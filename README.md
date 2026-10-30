# frapx-bench

How many bytes does it take to put one full-screen fragment shader on a web page?

Each entry in `src/` draws the same picture — a gradient over UV that pulses
with time — with the smallest honest code each library allows, and
`pnpm measure` bundles it with esbuild (minified ESM for the browser, tree-shaking
on) and reports the size after gzip -9 and brotli 11.

<!-- results -->
Measured 2026-10-30. Sizes in kB (1 kB = 1000 bytes).

| Library | Version | min | gzip -9 | brotli 11 |
| --- | --- | ---: | ---: | ---: |
| frapx (`@frapx/fx-canvas`) | @frapx/fx-canvas@0.12.0 | 38.1 | 11.2 | 10.0 |
| frapx React (`@frapx/react-canvas`), React excluded | @frapx/react-canvas@0.9.0 | 43.4 | 13.1 | 11.7 |
| three.js | three@0.186.1 | 529.8 | 133.0 | 109.8 |
| Babylon.js (`ThinEngine` + `EffectRenderer`) | @babylonjs/core@9.32.1 | 177.1 | 44.9 | 38.6 |
| OGL | ogl@1.0.11 | 45.0 | 13.1 | 11.1 |
| twgl.js | twgl.js@7.0.0 | 32.2 | 11.2 | 9.8 |
<!-- /results -->

## What the numbers include

The minimal code for three.js, Babylon.js, OGL and twgl.js only draws. None of
it pauses while offscreen or in a hidden tab, respects reduced motion, restores
a lost WebGL context, follows the element's size with a `ResizeObserver`, or is
safe to import during SSR — you would write that yourself.

The frapx number already includes all of that: `@frapx/fx-canvas` does it by
default, and its size counts its runtime, `@frapx/core`.

- The React row excludes React and ReactDOM themselves.
- Babylon.js uses `ThinEngine` and `EffectRenderer`, its lightest path for a
  full-screen effect, imported per module. A `Scene`-based setup is larger.
- three.js uses `WebGLRenderer`, `Scene`, `OrthographicCamera`, `PlaneGeometry`
  and `ShaderMaterial`.

## Run it

```sh
pnpm install
pnpm measure          # rewrites the table above and results.json
pnpm serve            # also serves dist/<id>.html at http://127.0.0.1:5468
```

Versions are pinned in `package.json`. To measure newer releases, bump them
and run `pnpm measure` again.

## License

MIT
