#!/usr/bin/env node
/**
 * 只更新 README 中的文章与发布区块。代表作品与项目状态人工维护。
 * 零依赖；抓取失败保留上次内容，成功确认无数据才清空对应区块。
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const USER = "meiluosi";
const FEED_URL = "https://meiluosi.github.io/rss.xml";
const LIMIT = 5;

// 显式选择当前活跃项目。冻结项目（如 md-knowledge-graph）在 README 中单独复盘介绍。
const RELEASE_REPOS = [
	"fly-connectome-study",
	"agent-composition-review",
	"fde-problem-framing",
	"fde-route-selection",
	"fde-ramp",
	"fde-knowledge-base",
	"fde-demo",
	"fde-pilot",
	"fde-comms",
	"strandbeest-evolution",
	"zh-disambiguate-skill",
	"rewrite-fidelity-skill",
	"research-writing-skills",
	"research-learning",
	"human-in-the-loop-writing",
	"content-topic-decomposer",
	"content-card-designer",
];
const README_PATH = new URL("./README.md", import.meta.url);

function clean(value) {
	const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
	return value
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
		.replace(/<[^>]*>/g, "")
		.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
		.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(Number.parseInt(h, 16)))
		.replace(/&([a-z]+);/gi, (m, n) => named[n.toLowerCase()] ?? m)
		.replace(/\s+/g, " ")
		.trim();
}

function label(value) {
	return value.replace(/[\\\x60*_[\]<>]/g, "\\$&");
}

function safeUrl(value) {
	const url = new URL(value);
	if (url.protocol !== "https:" && url.protocol !== "http:") {
		throw new Error("不支持的链接协议");
	}
	return url.href.replace(/\(/g, "%28").replace(/\)/g, "%29");
}

function fmtDate(input) {
	const date = new Date(input);
	return input && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : "";
}

function replaceRegion(text, name, body) {
	const re = new RegExp("(<!-- " + name + " starts -->)[\\s\\S]*?(<!-- " + name + " ends -->)");
	if (!re.test(text)) throw new Error("README 缺少区块标记：" + name);
	return text.replace(re, (_, start, end) => start + "\n" + (body ? body + "\n" : "") + end);
}

async function request(url, fetchImpl, token, json = false) {
	const headers = { "User-Agent": USER + "-profile-readme-build" };
	if (json) {
		headers.Accept = "application/vnd.github+json";
		if (token) headers.Authorization = "Bearer " + token;
	}
	const response = await fetchImpl(url, { headers, signal: AbortSignal.timeout(15000) });
	if (!response.ok) throw new Error("HTTP " + response.status + " <- " + url);
	return json ? response.json() : response.text();
}

async function fetchPosts(fetchImpl, token) {
	const xml = await request(FEED_URL, fetchImpl, token);
	if (!/<rss[\s>]/i.test(xml) || !/<\/channel\s*>/i.test(xml) || !/<\/rss\s*>/i.test(xml)) {
		throw new Error("RSS 响应格式不完整");
	}
	const items = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/g)];
	const openings = xml.match(/<item(?=[\s/>])/g) || [];
	const closings = xml.match(/<\/item\s*>/g) || [];
	if (!/<channel(?:\s[^>]*)?>/i.test(xml) || openings.length !== items.length || closings.length !== items.length) {
		throw new Error("RSS 条目结构不完整");
	}
	return items
		.map(([, item]) => {
			const pick = (tag) => clean(item.match(new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + ">"))?.[1] ?? "");
			const title = pick("title");
			const link = pick("link");
			if (!title || !link) throw new Error("RSS 条目缺少标题或链接");
			return { title, link: safeUrl(link), date: fmtDate(pick("pubDate")) };
		})
		.sort((a, b) => (b.date || "").localeCompare(a.date || ""))
		.slice(0, LIMIT);
}

async function fetchReleases(fetchImpl, token) {
	// 任一仓库查询失败则保留整个旧区块，避免把部分结果当成完整快照。
	const groups = await Promise.all(RELEASE_REPOS.map(async (name) => {
		const data = await request(
			"https://api.github.com/repos/" + USER + "/" + name + "/releases?per_page=1",
			fetchImpl, token, true,
		);
		if (!Array.isArray(data)) throw new Error("发布响应不是列表：" + name);
		const release = data[0];
		if (!release) return [];
		if (!release.tag_name || !release.html_url || !fmtDate(release.published_at)) {
			throw new Error("发布记录缺少字段：" + name);
		}
		return [{
			name: name + " " + release.tag_name,
			link: safeUrl(release.html_url),
			date: fmtDate(release.published_at),
			pre: Boolean(release.prerelease),
		}];
	}));
	return groups.flat().sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name)).slice(0, LIMIT);
}

export async function updateReadme(readme, { fetchImpl = fetch, token = process.env.GITHUB_TOKEN || "", warn = console.warn } = {}) {
	const sections = [
		{
			name: "posts",
			fetch: () => fetchPosts(fetchImpl, token),
			render: (items) => items.length ? "### 最新文章\n\n" + items.map((p) =>
				"- [" + label(p.title) + "](" + p.link + ")" + (p.date ? " · " + p.date : "")
			).join("\n") : "",
		},
		{
			name: "releases",
			fetch: () => fetchReleases(fetchImpl, token),
			render: (items) => items.length ? "### 最近发布\n\n" + items.map((r) =>
				"- [" + label(r.name) + "](" + r.link + ") · " + r.date + (r.pre ? " \u0060pre\u0060" : "")
			).join("\n") : "",
		},
	];
	for (const section of sections) replaceRegion(readme, section.name, "");
	const results = await Promise.allSettled(sections.map((section) => section.fetch()));
	for (const [index, result] of results.entries()) {
		const section = sections[index];
		if (result.status === "fulfilled") {
			readme = replaceRegion(readme, section.name, section.render(result.value));
		} else {
			warn("保留上次 " + section.name + " 内容：" + result.reason.message);
		}
	}
	return readme;
}

async function main() {
	const before = await readFile(README_PATH, "utf8");
	const after = await updateReadme(before);
	if (after === before) {
		console.log("README 无变化。");
		return;
	}
	await writeFile(README_PATH, after, "utf8");
	console.log("已更新 README 的动态区块。");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	main().catch((err) => {
		console.error("构建失败：" + err.message);
		process.exitCode = 1;
	});
}
