(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./vendor/yaml.min.js"));
  else root.PostCore = factory(root.jsyaml);
})(typeof globalThis !== "undefined" ? globalThis : this, function (yaml) {
  "use strict";
  const repository = "https://github.com/highchem-jh/highchem-jh.github.io";
  const supportedKeys = new Set(["title", "date", "layout", "tags", "categories", "published"]);
  function today() {
    const parts = new Intl.DateTimeFormat("en", { timeZone:"Asia/Tokyo", year:"numeric", month:"2-digit", day:"2-digit" }).formatToParts(new Date());
    return ["year","month","day"].map(key => parts.find(part => part.type === key).value).join("-");
  }
  function slugify(value) {
    return value.normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0,100).replace(/-$/,"");
  }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0,10) === value;
  }
  function splitList(value) { return String(value || "").split(",").map(s => s.trim()).filter(Boolean); }
  function toList(value) { return Array.isArray(value) ? value.map(String).join(", ") : String(value || "").split(/\s+/).filter(Boolean).join(", "); }
  function importMarkdown(text, filename) {
    text = text.replace(/^\uFEFF/,"").replace(/\r\n?/g,"\n");
    let metadata = {}, body = text;
    if (/^---[ \t]*\n/.test(text)) {
      const match = text.match(/^---[ \t]*\n([\s\S]*?)\n(?:---|\.\.\.)[ \t]*(?:\n|$)/);
      if (!match) throw new Error("The file starts with front matter but has no closing --- line.");
      metadata = yaml.load(match[1], { schema:yaml.CORE_SCHEMA }) || {};
      if (typeof metadata !== "object" || Array.isArray(metadata)) throw new Error("Front matter must contain named fields such as title and date.");
      body = text.slice(match[0].length).replace(/^\n/,"");
    }
    const base = filename.replace(/\.(?:md|markdown)$/i,"");
    const dated = base.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
    const heading = body.match(/^#\s+(.+)$/m);
    const title = String(metadata.title || (heading && heading[1]) || (dated ? dated[2] : base).replace(/-/g," "));
    const date = String(metadata.date || (dated && dated[1]) || today()).slice(0,10);
    if (!validDate(date)) throw new Error("The imported post has an invalid date. Use YYYY-MM-DD.");
    if (metadata.published !== undefined && typeof metadata.published !== "boolean") throw new Error("The published field must be true or false, without quotes.");
    const extra = Object.create(null);
    for (const [key, value] of Object.entries(metadata)) if (!supportedKeys.has(key)) extra[key] = value;
    return { title, date, slug:slugify(dated ? dated[2] : title), tags:toList(metadata.tags), categories:toList(metadata.categories), visibility:String(metadata.published !== false), body, extra };
  }
  function prepare(state) {
    if (!state.title.trim()) throw new Error("Add a post title.");
    if (!validDate(state.date)) throw new Error("Choose a valid post date.");
    if (!/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(state.slug) || state.slug.length > 120) throw new Error("Use letters, numbers, and hyphens for the filename name.");
    if (!state.body.trim()) throw new Error("Write some post text or import a Markdown file.");
    const metadata = { ...state.extra, layout:"post", title:state.title.trim(), date:`${state.date} 00:00:00 +0900`, tags:splitList(state.tags), categories:splitList(state.categories), published:state.visibility === "true" };
    const content = "---\n" + yaml.dump(metadata, { lineWidth:-1, noRefs:true }) + "---\n\n" + state.body.replace(/\s*$/,"") + "\n";
    const filename = `${state.date}-${state.slug}.md`;
    const params = new URLSearchParams({ filename:`_posts/${filename}`, value:content });
    const createUrl = `${repository}/new/main?${params}`;
    // Keep the link small enough to survive GitHub's sign-in redirect.
    const upload = createUrl.length > 6000;
    const warnings = [];
    if (state.visibility !== "true") warnings.push("This post will stay off the website, but committing it makes its source public on GitHub. For a private draft, keep it in this browser or your local _drafts folder.");
    if (state.date > today()) warnings.push("This is a future-dated post. Jekyll will hide it until a rebuild runs on or after that date; this setup does not schedule a rebuild.");
    if (/\[\[.*?\]\]/s.test(state.body)) warnings.push("Obsidian [[wikilinks]] and ![[embeds]] are not converted. Use standard Markdown links and images before publishing.");
    if (/\]\((?!https?:|\/|#|mailto:|data:)[^)]+\)/i.test(state.body)) warnings.push("Relative links may resolve differently on the website. For uploaded images, use /assets/images/filename.png.");
    if (/{[{%]/.test(state.body)) warnings.push("Liquid expressions are processed by Jekyll and may render differently from this preview.");
    return { content, filename, upload, url:upload ? `${repository}/upload/main/_posts` : createUrl, warnings };
  }
  return { today, slugify, validDate, importMarkdown, prepare };
});
