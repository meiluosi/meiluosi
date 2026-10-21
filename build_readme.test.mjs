import assert from "node:assert/strict";
import test from "node:test";
import { updateReadme } from "./build_readme.mjs";

const template = "# Fixed projects\n\n<!-- posts starts -->\nOld posts\n<!-- posts ends -->\n\n<!-- releases starts -->\nOld releases\n<!-- releases ends -->\n\nFrozen project retrospective\n";
const feed = (items = "") => "<rss version=\"2.0\"><channel>" + items + "</channel></rss>";
const item = (i, date = "2026-10-11T00:00:00Z") => "<item><title><![CDATA[Post " + i + " $& [demo]]]></title><link>https://example.com/post-" + i + "</link><pubDate>" + date + "</pubDate></item>";
const response = (value, json = false) => new Response(json ? JSON.stringify(value) : value);
const release = (name) => ({ tag_name: "v1", html_url: "https://github.com/meiluosi/" + name + "/releases/tag/v1", published_at: "2026-10-10T00:00:00Z", prerelease: false });

test("updates only dynamic regions, sorts and limits posts, excludes frozen repositories and is idempotent", async () => {
	const urls = [];
	const fetchImpl = async (url, options) => {
		urls.push(url);
		if (url.endsWith("rss.xml")) {
			assert.equal(options.headers.Authorization, undefined);
			return response(feed([
				item(0, "2026-07-08T00:00:00Z"),
				item(1, "2026-10-15T00:00:00Z"),
				item(2, "2026-10-15T00:00:00Z"),
				item(3, "2026-10-14T00:00:00Z"),
				item(4, "2026-10-13T00:00:00Z"),
				item(5, "2026-10-12T00:00:00Z"),
			].join("")));
		}
		assert.equal(options.headers.Authorization, "Bearer test-token");
		return response([release(url.split("/")[5])], true);
	};
	const output = await updateReadme(template, { fetchImpl, token: "test-token" });
	assert.ok(output.startsWith("# Fixed projects\n"));
	assert.ok(output.endsWith("Frozen project retrospective\n"));
	assert.equal((output.match(/^- \[Post/gm) || []).length, 5);
	assert.ok(output.includes("Post 1 $& \\[demo\\]"));
	assert.ok(!output.includes("Post 0"));
	assert.ok(!urls.some((url) => url.includes("md-knowledge-graph") || url.includes("/users/")));
	assert.equal(await updateReadme(output, { fetchImpl, token: "test-token" }), output);
});

test("total network failure retains the entire previous README", async () => {
	const warnings = [];
	const output = await updateReadme(template, {
		fetchImpl: async () => { throw new Error("offline"); },
		warn: (message) => warnings.push(message),
	});
	assert.equal(output, template);
	assert.equal(warnings.length, 2);
});

test("partial release failure retains all previous releases while posts update", async () => {
	const output = await updateReadme(template, {
		fetchImpl: async (url) => {
			if (url.endsWith("rss.xml")) return response(feed(item(1)));
			if (url.includes("rewrite-fidelity")) return new Response("unavailable", { status: 503 });
			return response([release("strandbeest-evolution")], true);
		},
		warn: () => {},
	});
	assert.ok(output.includes("Post 1"));
	assert.ok(output.includes("Old releases"));
	assert.ok(!output.includes("strandbeest-evolution v1"));
});

test("successful empty sources clear old dynamic content only", async () => {
	const output = await updateReadme(template, {
		fetchImpl: async (url) => url.endsWith("rss.xml") ? response(feed()) : response([], true),
	});
	assert.ok(output.includes("<!-- posts starts -->\n<!-- posts ends -->"));
	assert.ok(output.includes("<!-- releases starts -->\n<!-- releases ends -->"));
	assert.ok(output.includes("Frozen project retrospective"));
});

test("invalid RSS or release shapes preserve previous sections", async () => {
	for (const rss of ["<html>upstream error</html>", feed("<item><title>Incomplete</title></item>"), feed("<item><title>broken</title>"), feed("<item/>")]) {
		const output = await updateReadme(template, {
			fetchImpl: async (url) => url.endsWith("rss.xml") ? response(rss) : response({ message: "error" }, true),
			warn: () => {},
		});
		assert.equal(output, template);
	}
});

test("missing template markers fail before requests and unsafe feed links preserve old content", async () => {
	await assert.rejects(updateReadme("# missing", {
		fetchImpl: async () => assert.fail("must not fetch"),
	}), /缺少区块标记/);
	const output = await updateReadme(template, {
		fetchImpl: async (url) => url.endsWith("rss.xml")
			? response(feed("<item><title>Unsafe</title><link>javascript:alert(1)</link></item>"))
			: response([], true),
		warn: () => {},
	});
	assert.ok(output.includes("Old posts"));
});

const englishTemplate = "# Selected work\n\n<!-- releases starts -->\nOld releases\n<!-- releases ends -->\n";

test("the English face refreshes only the releases region and uses English headings", async () => {
	const urls = [];
	const fetchImpl = async (url) => {
		urls.push(url);
		assert.ok(url.includes("/releases"), "English face must not fetch the Chinese feed");
		return response([release("agent-composition-review")], true);
	};
	const output = await updateReadme(englishTemplate, {
		fetchImpl,
		token: "test-token",
		lang: "en",
		sections: ["releases"],
	});
	assert.ok(output.includes("### Recent releases"));
	assert.ok(!output.includes("最新发布"));
	assert.ok(output.includes("agent-composition-review v1"));
	assert.ok(!urls.some((url) => url.endsWith("rss.xml")));
	assert.equal(await updateReadme(output, { fetchImpl, token: "test-token", lang: "en", sections: ["releases"] }), output);
});

test("a section without a marker fails before any request", async () => {
	await assert.rejects(updateReadme(englishTemplate, {
		fetchImpl: async () => assert.fail("must not fetch"),
		sections: ["posts"],
	}), /缺少区块标记/);
	await assert.rejects(updateReadme(englishTemplate, {
		fetchImpl: async () => assert.fail("must not fetch"),
		sections: ["unknown"],
	}), /未知区块/);
});
