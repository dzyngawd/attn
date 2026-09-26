# Import notes — attn Design System

**Source:** Claude Design project "attn Design System"
https://claude.ai/design/p/f5a85842-ef50-4b38-b4fc-c0571e1f782a
**Imported:** 2026-09-26, into `design-system/` mirroring the project's own paths, via Claude Code's built-in design-project reader (the `claude_design` MCP was not installed in the session).

Start with `readme.md` (the brand book and index) and `SKILL.md`. `styles.css` is the CSS entry; components are React `.jsx` with `.d.ts` types and a `.prompt.md` usage note each.

## Not imported

The first five exceed the reader's 256 KiB per-file cap (the tool truncates rather than fails); the last is a small binary the reader can only return inline.

| path | what it is | impact |
| --- | --- | --- |
| `components/figma/Accordion.jsx` | FAQ accordion, all 10 variants inline (~270 KB) | the only component missing; its `.d.ts` and `.prompt.md` are present |
| `_ds_bundle.js` | compiled UMD bundle (`window.AttnDesignSystem_f5a858`) that the `*.card.html` previews and `ui_kits/*/index.html` load | those static previews won't run until it's rebuilt or downloaded; the source components are all here |
| `components/figma/assets/73b8d25c64595bf8.png` | RBC logo bitmap used by `PriorityCardDefault`'s default tile and `fig-assets.css` | default tile shows the tile colour only |
| `assets/images/avatar-liam.png` | account avatar photo | referenced by `ui_kits/ios-app/Screens.jsx` and `ui_kits/web/WebApp.jsx` |
| `uploads/Mobie view inspo.png`, `uploads/pasted-1790453899619-0.png` | inspiration screenshots | reference only |
| `components/figma/assets/7f12ea1300756f14.png` | 256×256 grey image placeholder used by `ImagesRegular`/`ImagesTall` (fill and circular variants) | under the cap, but its bytes only arrive inline and the hand copy failed the PNG integrity check, so it was left out rather than written corrupt |

To get these, download them from the Claude Design project in the browser and drop them at the same paths.

## Deviations from the source

- **SVGs:** `assets/attn-logo.svg` and `assets/mascot/*.svg` were copied with their geometry intact but without the `<metadata><c2pa:manifest>` content-credentials block (and its `xmlns:c2pa` attribute). Rendering is identical.
- Everything else is byte-for-byte what the project serves, including the `_ds_manifest.json` card index and `_adherence.oxlintrc.json` lint rules.

## Layout reminders from the source

- `_adherence.oxlintrc.json` expects app code to import components from a single `index.js` barrel rather than component internals, and warns on raw hex colours and px literals in favour of `var()` tokens.
- Components use unitless Figma tokens via `calc(var(--space-*) * 1px)`; `tokens/attn.css` provides px-ready aliases (`--sp-*`, `--r-*`, `--fs-*`).
- Fonts load from Google Fonts (`tokens/fonts.css`); SF Pro falls back to the system font.
