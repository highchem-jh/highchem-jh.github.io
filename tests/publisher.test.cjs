const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../assets/publisher/post-core.js");
const yaml = require("../assets/publisher/vendor/yaml.min.js");
const markdown = require("../assets/publisher/vendor/markdown-it.min.js")({html:false});
const base = {title:"Kyoto: a walk",date:"2026-10-20",slug:"kyoto-walk",tags:"Japan, Kyoto",categories:"Travel",visibility:"true",body:"## Hello\n\nA **good** day.",extra:{}};

test("prepared post round-trips YAML punctuation and Japanese text", () => {
  const post=core.prepare({...base,title:'京都: "a walk"\nSecond line'});
  const imported=core.importMarkdown(post.content,post.filename);
  assert.equal(imported.title,'京都: "a walk"\nSecond line');
  assert.equal(imported.visibility,"true");
  assert.equal(imported.tags,"Japan, Kyoto");
  assert.equal(imported.body,base.body+"\n");
});
test("plain Markdown gains a title and a safe Unicode filename", () => {
  const imported=core.importMarkdown("# 京都の旅\n\nHello.","note.md");
  assert.equal(imported.title,"京都の旅");
  assert.equal(imported.slug,"京都の旅");
  assert.match(core.prepare(imported).filename,/^\d{4}-\d{2}-\d{2}-京都の旅\.md$/);
});
test("front matter import preserves extra metadata and unpublished state", () => {
  const text="\uFEFF---\r\ntitle: Test\r\ndate: 2026-10-20\r\npublished: false\r\ntags: [one, two]\r\npermalink: /my-post/\r\ncustom:\r\n  nested: yes\r\n---\r\n\r\nBody\r\n";
  const imported=core.importMarkdown(text,"2026-10-20-test.md");
  const result=core.prepare(imported);
  const parsed=yaml.load(result.content.split("---\n")[1]);
  assert.equal(parsed.published,false);
  assert.equal(parsed.permalink,"/my-post/");
  assert.equal(parsed.custom.nested,"yes");
  assert.match(result.warnings.join(" "),/public/);
});
test("filename cannot escape the posts folder", () => {
  for(const slug of ["../secrets","a/b","x.html","-bad","bad--name"]) assert.throws(()=>core.prepare({...base,slug}),/filename/);
  assert.equal(core.slugify("Hello / WORLD!"),"hello-world");
});
test("invalid calendar dates and malformed front matter are rejected", () => {
  assert.equal(core.validDate("2026-02-30"),false);
  assert.equal(core.validDate("2024-02-29"),true);
  assert.throws(()=>core.importMarkdown("---\ntitle: Test\nBody","note.md"),/closing/);
  assert.throws(()=>core.importMarkdown("---\n- a\n- b\n---\nText","note.md"),/named fields/);
  assert.throws(()=>core.importMarkdown("---\npublished: \"false\"\n---\nText","note.md"),/without quotes/);
});
test("post content is preserved in a short GitHub handoff URL", () => {
  const result=core.prepare(base);
  const url=new URL(result.url);
  assert.equal(url.origin,"https://github.com");
  assert.equal(url.searchParams.get("filename"),"_posts/"+result.filename);
  assert.equal(url.searchParams.get("value"),result.content);
});
test("long posts use uploads without truncating content", () => {
  const result=core.prepare({...base,body:"日本語の文章です。\n".repeat(900)});
  assert.equal(result.upload,true);
  assert.equal(result.url,"https://github.com/highchem-jh/highchem-jh.github.io/upload/main/_posts");
  assert.equal(core.importMarkdown(result.content,result.filename).body,"日本語の文章です。\n".repeat(900));
});
test("Markdown preview does not execute raw HTML or javascript links", () => {
  const html=markdown.render('<script>alert(1)</script>\n\n[x](javascript:alert(1))\n\n<img src=x onerror=alert(1)>');
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("<img"));
  assert.ok(!html.includes('href="javascript:'));
});
test("Obsidian embeds and local image paths are flagged", () => {
  const result=core.prepare({...base,body:"![[photo.jpg]]\n\n![photo](photos/a.jpg)"});
  assert.equal(result.warnings.length,2);
});
test("future-dated posts describe rebuild requirements", () => {
  const result=core.prepare({...base,date:"2099-01-01"});
  assert.match(result.warnings.join(" "),/does not schedule/);
});
