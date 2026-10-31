# dougsnitker.com

My personal site: an Angular app, prerendered at build time to static pages.

```sh
npm install
npm start          # dev server at http://localhost:4200
npm run build      # prerendered pages in dist/dougsnitker/browser
```

- All copy (intro, roles, skills, projects, interests, photos, and the little text adventure, which
  is not shown on any page right now) lives in
  `src/app/content.ts`. Add LinkedIn roles to `ROLES`, newest first.
- Pages are routes in `src/app/app.routes.ts`, components in `src/app/pages`.
- The theme is green phosphor on black, like an 80s monochrome CRT: brightness levels of one green
  (`--glow`, `--fg`, `--dim`, `--faint`) at the top of `src/styles.scss`, with scanlines, a slow
  rolling bar and a blinking cursor (the two animations stop for visitors who prefer reduced motion).
- The DS logo is `public/logo.svg` (also the favicon), shown by the `Logo` component.
  `icon-*.png` and `og.png` are rendered from it with `rsvg-convert`.

## Photos

The full-size originals live in `photos/`, which is git-ignored, so only photos chosen for the site
go out. The site shows each photo dithered in four greens on a little CRT screen (the `CrtPhoto`
component), fading to the colour original on hover or tap.

To add a photo: put it in `photos/`, add its name to `PUBLISHED` in `tools/crt-photos.py`, run
`python3 tools/crt-photos.py --publish` (writes the dithered PNG and a web-sized original into
`public/photos/`), then list it in `src/app/content.ts`. Running the script without `--publish`
renders all three looks (phosphor, dither, ASCII) into `photos/crt/` for comparing.

## Deploying

Pushes to `main` build and publish to GitHub Pages (`.github/workflows/deploy.yml`). Point
`dougsnitker.com` at GitHub Pages and set it as the custom domain in the repo's Pages settings.
