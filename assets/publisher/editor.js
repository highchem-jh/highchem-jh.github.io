/* Local-only drafting; GitHub handles authentication and the final repository save. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const fields = ["title","date","slug","tags","categories","visibility","body"];
  const storageKey = "highchem-jh-post-draft-v1";
  const markdown = window.markdownit({ html:false, linkify:false, typographer:false });
  let extra = {}, prepared = null, manualSlug = false, saveTimer;
  function state() { return Object.assign(Object.fromEntries(fields.map(id => [id,$(id).value])), {extra}); }
  function message(text) { $("message").textContent = text; $("message").hidden = !text; }
  function fill(value) {
    fields.forEach(id => { $(id).value = value[id] || (id === "date" ? PostCore.today() : id === "visibility" ? "true" : ""); });
    extra = value.extra || {};
    manualSlug = Boolean(value.slug);
    render();
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(state())); $("draft-status").textContent = "Draft saved in this browser."; }
    catch { $("draft-status").textContent = "Browser storage is unavailable. Download your draft to keep it."; }
  }
  function render() {
    const value = state();
    $("preview").innerHTML = markdown.render(value.body || "_Your preview will appear here._");
    $("word-count").textContent = `${value.body.trim() ? value.body.trim().split(/\s+/u).length : 0} words`;
    const keys = Object.keys(extra);
    $("metadata-note").hidden = !keys.length;
    $("metadata-note").textContent = "Other imported metadata retained: " + keys.join(", ");
    try {
      prepared = PostCore.prepare(value);
      $("filename").textContent = "_posts/" + prepared.filename;
      $("source").textContent = prepared.content;
      $("continue").href = prepared.url;
      $("continue").setAttribute("aria-disabled","false");
      $("continue").textContent = prepared.upload ? "Download & upload on GitHub" : "Continue on GitHub";
      $("handoff-help").textContent = prepared.upload
        ? "This post is too long for a prefilled link. The button downloads the complete .md file and opens GitHub’s _posts upload page. Drop the downloaded file there, then commit it to main."
        : "GitHub opens with your prepared file. Sign in, review it, and choose “Commit changes” to save it to main. If GitHub loses the prefilled text during sign-in, use Copy Markdown or Download .md.";
      $("download").disabled = $("copy").disabled = false;
      $("validation").textContent = "Prepared: " + prepared.filename;
      $("warnings").replaceChildren(...prepared.warnings.map(text => { const p=document.createElement("p");p.textContent=text;return p; }));
      $("warnings").hidden = !prepared.warnings.length;
    } catch (error) {
      prepared = null;
      $("continue").removeAttribute("href");
      $("continue").setAttribute("aria-disabled","true");
      $("download").disabled = $("copy").disabled = true;
      $("validation").textContent = error.message;
      $("filename").textContent = $("source").textContent = "";
      $("warnings").hidden = true;
    }
  }
  function download() {
    if (!prepared) return;
    const url = URL.createObjectURL(new Blob([prepared.content], {type:"text/markdown;charset=utf-8"}));
    const a = document.createElement("a");
    a.href=url; a.download=prepared.filename; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $("editor").addEventListener("submit", event => event.preventDefault());
  $("editor").addEventListener("input", event => {
    if (event.target.id === "slug") manualSlug = true;
    if (event.target.id === "title" && !manualSlug) $("slug").value = PostCore.slugify($("title").value);
    render();
    clearTimeout(saveTimer);
    $("draft-status").textContent = "Saving draft…";
    saveTimer = setTimeout(save, 300);
  });
  $("import-file").addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (!/\.(md|markdown)$/i.test(file.name)) throw new Error("Choose a .md or .markdown file.");
      if (file.size > 1024*1024) throw new Error("Use a Markdown file under 1 MB. Upload larger prepared files directly on GitHub.");
      const imported = PostCore.importMarkdown(await file.text(),file.name);
      if (($("body").value.trim() || $("title").value.trim()) && !window.confirm("Replace the current browser draft with this file? Download the current draft first if you want to keep it.")) return;
      clearTimeout(saveTimer);
      fill(imported); save();
      message(`Imported ${file.name}. Review the title, date, preview, and visibility before continuing.`);
    } catch (error) { message(error.message); }
    finally { event.target.value = ""; }
  });
  $("new-post").addEventListener("click", () => {
    if (($("body").value.trim() || $("title").value.trim()) && !window.confirm("Start a new post and replace this browser draft? Download it first if you want to keep a copy.")) return;
    clearTimeout(saveTimer); fill({}); manualSlug=false; save(); message(""); $("title").focus();
  });
  $("download").addEventListener("click", download);
  $("copy").addEventListener("click", async () => {
    if (!prepared) return;
    try { await navigator.clipboard.writeText(prepared.content); message("Markdown copied. Paste it into GitHub’s file editor."); }
    catch { message("Clipboard access was unavailable. Download the .md file, or copy the text from Prepared Markdown file."); }
  });
  $("continue").addEventListener("click", event => {
    if (!prepared) { event.preventDefault(); return; }
    save();
    if (prepared.upload) download();
    message("Continue in GitHub to finish saving. This editor has not published the post.");
  });
  try {
    const saved = localStorage.getItem(storageKey);
    fill(saved ? JSON.parse(saved) : {});
    if (saved) $("draft-status").textContent = "Restored your draft from this browser.";
  } catch { fill({}); $("draft-status").textContent = "Could not restore a browser draft. You can still write and download."; }
})();
