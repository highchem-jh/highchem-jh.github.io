# Reusing the blog style

The style uses a warm cream background, dark forest green accents, generous
spacing, serif headings, and plain sans-serif body text. Fonts come from the
device, so no external font service is required.

## Use it on another website

Copy these files, keeping them in the same directory:

- `assets/design-tokens.css`: colors, fonts, corner radius, and page width.
- `assets/site.css`: navigation, typography, cards, buttons, article formatting,
  and responsive layouts. This imports `design-tokens.css`.

Add this to the new page's HTML head:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="assets/site.css">
```

Use `style-kit/example.html` as a starting point. It shows the header, hero,
topic labels, feature card, and reading layout. It needs no build process or
JavaScript. In the repository, its stylesheet link points to `../assets/site.css`;
the downloadable kit puts the example at the root and uses `assets/site.css`.

## Main building blocks

| Class | Use |
| --- | --- |
| `site-shell` | Centered page container with responsive side padding |
| `site-header`, `site-brand`, `site-nav` | Site name and navigation |
| `hero`, `eyebrow`, `intro` | Opening title and introduction |
| `topic-list`, `tag` | Topic labels |
| `feature-card` | Highlighted section with a pale green background |
| `button`, `button-secondary` | Main and secondary actions |
| `post-grid`, `post-card` | Article cards |
| `reading-page`, `reading-header`, `prose` | Articles and long-form pages |
| `site-footer` | Footer |

## Change the look once

Edit variables in `design-tokens.css`:

```css
:root {
  --paper: #f6f5ef;
  --surface: #fffef9;
  --ink: #253b38;
  --green: #285c4d;
  --font-heading: Georgia, "Times New Roman", serif;
  --radius: 16px;
  --page-width: 1184px;
}
```

The homepage, posts, guide, map, and editor all import the shared color variables.
Page-specific styles remain in `assets/japan-map/map.css` and
`assets/publisher/editor.css`. To reuse their exact layouts, copy those
stylesheets and their associated HTML as well.

For React or another framework, import `site.css` once and use these same class
names (as `className` in React). On an existing site, review the global `body`,
`a`, and box-sizing rules before importing to avoid overriding unrelated styles.

For another Jekyll site, also copy `_layouts/default.html`, `_layouts/home.html`,
`_layouts/page.html`, and `_layouts/post.html`, then adapt the navigation and
homepage feature content to that site. The default layout references
`assets/author-shortcuts.js`; copy it only if you want the same browser preference,
or remove that script and the hidden shortcuts panel.

The Japan SVG is a separate GFDL asset, not part of the generic style kit.
Preserve its attribution and license if you reuse it.
