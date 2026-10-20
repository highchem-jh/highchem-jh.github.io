# Personal blog

GitHub Pages / Jekyll site with a Japan prefecture map and a browser post editor.

- `/japan-map.html`: interactive map of all 47 prefectures.
- `/write.html`: write Markdown, import a `.md` file, preview, download, or hand
  off a prepared file to GitHub for an authenticated commit.
- `/publishing/`: instructions for browser writing, direct uploads, and Obsidian.
- `_posts/`: published post sources named `YYYY-MM-DD-slug.md`.
- `_templates/Post.md`: Obsidian Templates starter, unpublished by default.

The editor has no backend and requests no tokens. It saves one draft in browser
localStorage. Short posts use GitHub's prefilled new-file URL; long posts use a
download and GitHub upload. The final save always happens on GitHub.
The repository's public visibility also applies to unpublished files committed
to it. Local `_drafts/` and Obsidian settings are gitignored.

The preview disables raw HTML. Markdown-it renders standard Markdown, while
Jekyll renders published posts; Liquid, raw HTML, theme styling, and unsupported
Obsidian syntax may differ.

## Checks

Run `node --test tests/publisher.test.cjs`.
No npm install is needed; browser dependencies are vendored.
The regular GitHub Pages deployment builds Jekyll.

## Design and author navigation

The blog, articles, and guide use the shared `_layouts` and `assets/site.css`.
The map and editor also import `assets/design-tokens.css`. See `DESIGN.md` and
`style-kit/example.html` for instructions on reusing the style.

Publishing shortcuts are hidden by default. Enable the browser preference at
the bottom of `/write.html` to show them on the homepage on that device.
This is not authentication: GitHub still enforces permission to save posts.

## Browser dependencies

- js-yaml 5.5.0 (`assets/publisher/vendor/yaml.min.js`)
- markdown-it 15.0.3 (`assets/publisher/vendor/markdown-it.min.js`)

Both browser bundles and their licenses were copied unchanged from their
versioned npm registry tarballs. They are loaded from this site, not a CDN.
