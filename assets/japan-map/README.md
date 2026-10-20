# Japan prefecture map

`/japan-map.html` is a standalone, buildless map linked from the blog homepage.
It works on GitHub Pages without changing the existing Jekyll theme. All assets
are hosted in this repository; no map service, API key, or runtime CDN is required.

Click, tap, or use Tab and Enter/Space to select a prefecture. The searchable
directory supports English and Japanese and remains usable if the SVG fails.
Selection only displays a name and region: no prefecture pages are created and
there are no placeholder article links.

To connect articles later, use prefecture codes 1–47 in `map.js` to associate
each prefecture with its URL and add navigation to `selectPrefecture()`.

## Map source and license

`japan.svg` is an unmodified copy of Geolonia's `map-full.svg`:
https://github.com/geolonia/japanese-prefectures

Geolonia credits the Japanese Wikipedia `日本地図.svg` as its source:
https://ja.wikipedia.org/wiki/File:日本地図.svg

The upstream map is licensed under the GNU Free Documentation License (GFDL).
A copy of the license is included in `LICENSE-GFDL.txt`. Original SVG title and
description are preserved, and attribution is visible on the map page.
Some remote islands, including the Ogasawara Islands, are omitted by the source.
