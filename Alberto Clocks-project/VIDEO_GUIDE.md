# Alberto Clocks — Media Guide

## Hero videos

Keep hero videos inside `public/`.

The current Hero reads these files:
- `/brown-golden-watch1.mp4`
- `/blue-watch2.mp4`
- `/golden-watch1.mp4`
- `/brown-watch1.mp4`

To add another Hero video:
1. Put the `.mp4` inside `public/`.
2. Open `src/components/hero/Hero.jsx`.
3. Add the new path to the `videos` array.
4. Keep videos short and landscape for a smooth cinematic background.

The Hero automatically moves to the next video when the current video ends.

## Technology images

Technology visuals are stored in:
`public/images/technology-1.png`
`public/images/technology-2.png`
`public/images/technology-3.png`

Their data is controlled from:
`src/assets/data/technology.json`

## Product images

Watch product images are in:
`public/images/watches/`

Product names, categories, prices and image paths are controlled from:
`src/assets/data/products.json`

## Watch parts

Part images are in:
`public/images/parts/`

Data is controlled from:
`src/assets/data/watchParts.json`

## Packages

Package information and luxury watch images are controlled from:
`src/assets/data/packages.json`

## About / Team / Gallery

About images:
`public/images/about/`

Team images:
`public/images/team/`

Gallery future-concept images:
`public/images/gallery/`

Their content is controlled by:
- `src/assets/data/about.json`
- `src/assets/data/team.json`
- `src/assets/data/gallery.json`

## Logo / Favicon

The Alberto logo is:
`public/images/logo.png`

It is used in the navbar and as the browser favicon through `index.html`.

## Note

Do not add the unused 10-second video mentioned during the media selection. The project keeps the existing Hero videos and the supplied Technology images.
