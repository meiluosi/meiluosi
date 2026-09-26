#!/usr/bin/env node
/**
 * 构建 GitHub 门面 README（模式 B：门面即构建产物）。
 *
 * 设计原则
 *   1. 区块按需生长 —— 某数据源为空时，该区块渲染为空（markdown 里不可见），
 *      但标记始终保留，所以以后有内容会「自动长出来」，无需改代码。
 *   2. 零依赖 —— 只用 Node 内置 fetch / fs，CI 不需要 npm install。
 *   3. 幂等 —— 数据没变则输出相同，CI 靠 git diff 判断是否提交，不产生空提交。
 *
 * 运行：node build_readme.mjs
 * 可选环境变量：GITHUB_TOKEN（CI 里用 secrets.GITHUB_TOKEN，避免 60 次/小时的限流）
 */

import { readFile, writeFile } from "node:fs/promises";

// ---------------------------------------------------------------- 配置区

const USER = "meiluosi";
const BLOG_URL = "https://meiluosi.github.io";
const FEED_URL = `${BLOG_URL}/rss.xml`;

/** 每个区块最多显示几条 */
const LIMIT = 5;

/**
 * 是否把 fork 仓库也算进「最近发布 / 正在维护」。
 * 默认 false —— fork 是别人的作品，研究工程风只展示你自己的。
 * 想让博客仓库也出现，把这里改成 true 即可。
 */
const INCLUDE_FORKS = false;

const README_PATH = new URL("./README.md", import.meta.url);

// ---------------------------------------------------------------- 工具

const TOKEN = process.env.GITHUB_TOKEN || "";

const HEADERS = {
	"User-Agent": `${USER}-profile-readme-build`,
	Accept: "application/vnd.github+json",
	...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function getJson(url) {
	const res = await fetch(url, { headers: HEADERS });
	if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} <- ${url}`);
	return res.json();
}

async function getText(url) {
	const res = await fetch(url, { headers: { "User-Agent": HEADERS["User-Agent"] } });
	if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} <- ${url}`);
	return res.text();
}

function decodeEntities(s) {
	const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
	return s
		.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
		.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(Number.parseInt(h, 16)))
		.replace(/&([a-z]+);/gi, (m, n) => named[n.toLowerCase()] ?? m);
}

function stripTags(s) {
	return s.replace(/<[^>]*>/g, "");
}

function clean(s) {
	return decodeEntities(stripTags(s)).replace(/\s+/g, " ").trim();
}

/** RFC822 / ISO 日期 → YYYY-MM-DD；解析不出就返回空串 */
function fmtDate(input) {
	if (!input) return "";
	const d = new Date(input);
	if (Number.isNaN(d.getTime())) return "";
	return d.toISOString().slice(0, 10);
}

/** 读取标记之间已有的内容（用于判断是否需要重写文件） */
function replaceRegion(text, name, body) {
	const re = new RegExp(`(<!-- ${name} starts -->)[\\s\\S]*?(<!-- ${name} ends -->)`);
	if (!re.test(text)) {
		throw new Error(`README 里找不到标记对：<!-- ${name} starts --> ... <!-- ${name} ends -->`);
	}
	const replacement = body ? `$1\n${body}\n$2` : "$1\n$2";
	return text.replace(re, replacement);
}

// ---------------------------------------------------------------- 数据源

/** 最新文章：从博客 RSS 抓（这是门面唯一「第一天就有内容」的来源） */
async function fetchPosts() {
	const xml = await getText(FEED_URL);
	const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

	return items
		.map((item) => {
			const pick = (tag) => {
				const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
				return m ? clean(m[1]) : "";
			};
			return { title: pick("title"), link: pick("link"), date: fmtDate(pick("pubDate")) };
		})
		.filter((p) => p.title && p.link)
		.slice(0, LIMIT);
}

/** 取用户仓库（排除 fork，以及门面仓库自身） */
async function fetchRepos() {
	const repos = await getJson(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`);
	return repos.filter(
		(r) =>
			// 门面仓库本身是基础设施，不是「项目」
			r.name !== USER && (INCLUDE_FORKS || !r.fork),
	);
}

/** 最近发布：遍历仓库取各自最新 release，按发布时间排序 */
async function fetchReleases(repos) {
	const found = [];
	for (const repo of repos) {
		try {
			const releases = await getJson(
				`https://api.github.com/repos/${repo.full_name}/releases?per_page=1`,
			);
			const r = releases[0];
			if (r) {
				found.push({
					name: `${repo.name} ${r.tag_name}`,
					link: r.html_url,
					date: fmtDate(r.published_at),
					pre: Boolean(r.prerelease),
				});
			}
		} catch (err) {
			console.warn(`  ! release 查询失败 ${repo.full_name}: ${err.message}`);
		}
	}
	return found
		.sort((a, b) => (b.date || "").localeCompare(a.date || ""))
		.slice(0, LIMIT);
}

// ---------------------------------------------------------------- 区块渲染

function renderPosts(posts) {
	if (!posts.length) return "";
	const lines = posts.map((p) => `- [${p.title}](${p.link})${p.date ? ` · ${p.date}` : ""}`);
	return `### 最新文章\n\n${lines.join("\n")}`;
}

function renderReleases(releases) {
	if (!releases.length) return "";
	const lines = releases.map(
		(r) => `- [${r.name}](${r.link})${r.date ? ` · ${r.date}` : ""}${r.pre ? " `pre`" : ""}`,
	);
	return `### 最近发布\n\n${lines.join("\n")}`;
}

function renderRepos(repos) {
	if (!repos.length) return "";
	const lines = repos.map((r) => {
		const desc = r.description ? ` — ${r.description}` : "";
		const lang = r.language ? ` \`${r.language}\`` : "";
		return `- [${r.name}](${r.html_url})${desc}${lang}`;
	});
	return `### 正在维护\n\n${lines.join("\n")}`;
}

// ---------------------------------------------------------------- 主流程

async function main() {
	let readme = await readFile(README_PATH, "utf8");

	console.log(`抓取 ${FEED_URL} ...`);
	let posts = [];
	try {
		posts = await fetchPosts();
		console.log(`  ✓ ${posts.length} 篇文章`);
	} catch (err) {
		console.warn(`  ! RSS 抓取失败，跳过该区块: ${err.message}`);
	}

	console.log(`抓取 ${USER} 的仓库 ...`);
	let repos = [];
	try {
		repos = await fetchRepos();
		console.log(`  ✓ ${repos.length} 个自有仓库（fork=${INCLUDE_FORKS ? "计入" : "排除"}）`);
	} catch (err) {
		console.warn(`  ! 仓库抓取失败，跳过相关区块: ${err.message}`);
	}

	console.log("抓取 releases ...");
	const releases = await fetchReleases(repos);
	console.log(`  ✓ ${releases.length} 条发布`);

	readme = replaceRegion(readme, "posts", renderPosts(posts));
	readme = replaceRegion(readme, "releases", renderReleases(releases));
	readme = replaceRegion(readme, "repos", renderRepos(repos));

	await writeFile(README_PATH, readme, "utf8");

	const empty = [
		["最新文章", posts.length],
		["最近发布", releases.length],
		["正在维护", repos.length],
	]
		.filter(([, n]) => n === 0)
		.map(([name]) => name);

	console.log("✓ README.md 已更新");
	if (empty.length) {
		console.log(`  当前为空的区块（已渲染为空，有内容后会自动出现）: ${empty.join("、")}`);
	}
}

main().catch((err) => {
	console.error(`✗ 构建失败: ${err.message}`);
	process.exit(1);
});
