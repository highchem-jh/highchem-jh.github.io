---
layout: page
title: Publishing guide
permalink: /publishing/
---

Three ways to publish to this blog. All use the same Markdown files in `_posts`,
and all finish with a commit to the `main` branch of
[highchem-jh.github.io](https://github.com/highchem-jh/highchem-jh.github.io).
GitHub Pages then rebuilds the site. New published posts appear on the homepage.

## Your author shortcuts

The public homepage does not show publishing links. Bookmark
[the editor]({{ '/write.html' | relative_url }}) to return to it directly.
At the bottom of that page, enable **Show author shortcuts on the homepage in
this browser** if you want quick links on your own computer. Use **Hide
shortcuts** on the homepage to turn them off again.

This preference is stored only in that browser. It does not verify your
identity or make the editor private. GitHub checks publishing permissions
when you save a post. Clearing browser data or using another browser resets
the preference.

## 1. Write on the website

1. Open the [post editor]({{ '/write.html' | relative_url }}).
2. Add a title, date, and Markdown text. Review the preview and the filename.
3. Choose **Continue on GitHub**. Sign in to the account that owns the repository.
4. Check the filename starts with `_posts/`, review the content, and choose **Commit changes**.
5. Save to **main**. If you use a separate branch, merge its pull request to publish.

The editor saves one draft in your current browser. Use **Download .md** to keep
additional copies. Opening GitHub does not publish anything by itself.
If GitHub loses the prefilled content during sign-in, use **Copy Markdown** or
download the file and follow the upload instructions below.

For long posts, the editor downloads the complete file and opens GitHub's upload
page instead. Drop that downloaded file into the page and commit it.

## 2. Upload Markdown files

For a note without Jekyll metadata, open the [editor]({{ '/write.html' | relative_url }})
and choose **Import .md file**. The importer adds the required post metadata and
filename; you can review both before continuing. Existing tags, categories, and
additional front matter are retained. The editor accepts one file at a time,
up to 1 MB. It updates the date to midnight in Japan time.

For one or several already prepared posts:

1. Make sure each filename is `YYYY-MM-DD-post-name.md`.
2. Include the front matter shown below.
3. Open [GitHub's post upload page](https://github.com/highchem-jh/highchem-jh.github.io/upload/main/_posts).
4. Drag the files into that page and commit to `main`.

For an existing post, edit it in the repository's
[_posts folder](https://github.com/highchem-jh/highchem-jh.github.io/tree/main/_posts).
The editor prepares new files; it does not automatically replace existing posts.

## 3. Publish from Obsidian

Use a **separate publishing vault** that is a clone of this website repository.
Keep personal notes in your usual vault. The prepared publishing vault includes
a post template and the [Obsidian Git community plugin](https://github.com/Vinzent03/obsidian-git).

### One-time setup

1. In Obsidian, choose **Open folder as vault** and select your publishing vault.
2. In **Settings → Community plugins**, allow community plugins for this vault
   and enable **Git** if it is not already enabled.
3. In **Settings → Core plugins**, enable **Templates**. Its template folder is
   `_templates`.
4. Run **Git: Pull** from the command palette. For your first push, complete the
   GitHub sign-in in Git's authentication prompt if requested.

The website's GitHub connection and the Git program on your computer have
separate sign-ins. If Git asks you to configure an author name or email, set
them for this repository. If Git cannot be found, set its executable path in
the Git plugin settings, then restart Obsidian.

### Write and publish

1. Run **Git: Pull** before editing, especially after using the website editor.
2. Create a note in `_drafts` and insert the **Post** template.
3. Fill in the title, date, tags, and body.
4. When ready, change `published: false` to `published: true`.
5. Move the note to `_posts` and name it `YYYY-MM-DD-post-name.md`.
6. Run **Git: Open source control view** to review the changed files.
7. Run **Git: Commit-and-sync**. This commits your changes and syncs with GitHub.

Automatic commits and pushes are disabled in the prepared vault. You decide when
to publish. If Git reports a conflict, resolve it before syncing again; do not
force-push over changes made through the website.

`_drafts`, `_local`, and `.obsidian` are ignored by Git. Notes in those
folders stay local unless you deliberately force-add them. `published: false`
only hides a post from the website: if the file is committed elsewhere in this
public repository, people can still read it on GitHub.

### Links and images

Use standard Markdown links such as `[another page](/japan-map.html)`.
Obsidian `[[wikilinks]]`, `![[embeds]]`, and plugins' custom formatting are not
automatically converted by this site.

Put images in `assets/images` and link from a post using
`![Description](/assets/images/photo.jpg)`. The web importer imports Markdown
text only; it does not upload images from your computer. Upload image files
separately to [assets/images on GitHub](https://github.com/highchem-jh/highchem-jh.github.io/upload/main/assets/images)
or commit them from Obsidian.

## Post format

{% raw %}
```markdown
---
layout: post
title: "A day in Kyoto"
date: "2026-10-20 00:00:00 +0900"
tags: [Japan, Kyoto]
categories: [Travel]
published: true
---

Write your introduction here.

## A favourite place

Your post continues here.
```
{% endraw %}

Dates use Japan time. Future-dated posts are hidden until a website rebuild
runs on or after the post's date; this setup does not schedule future publishing.

## Check publication

Open [GitHub Actions](https://github.com/highchem-jh/highchem-jh.github.io/actions)
and wait for **pages build and deployment** to succeed. Then refresh the
[homepage]({{ '/' | relative_url }}). If a post is missing, check the `_posts`
folder, dated filename, valid YAML front matter, date, and `published` value.

References: [Jekyll post format](https://jekyllrb.com/docs/posts/),
[GitHub file creation](https://docs.github.com/en/repositories/working-with-files/managing-files/creating-new-files),
and [Obsidian Git documentation](https://publish.obsidian.md/git-doc/Start%20here).
