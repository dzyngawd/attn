# attn Design System

**attn** (styled lowercase, often "attn." with the period) is a personal assistant that reads your tools — Gmail first, then Calendar, tasks and notes — and surfaces only what needs your attention. This system is built for rapid hackathon work: a small token set, the Figma component inventory, and three device-state components for the voice assistant.

## Products / surfaces
1. **Device (assistant)** — a landscape screen (1328×616 native) housed in a sky-blue shell. States: idle, display, listening, thinking, speaking, alerts. This is the expressive surface. → `ui_kits/device/`
2. **iOS app** — onboarding, "Needs attn." Home (Immediate / Upcoming), Account, Notifications & Widget, Pro paywall, widgets. → `ui_kits/ios-app/`
3. **Web app** — setup, integrations and manual input. **No web screens exist in the Figma**; `ui_kits/web/` is derived from the iOS Account/Settings patterns at the team's request.

## Sources
- Figma: `attn.fig` (pages: ATTN-Chatgbpt-Explorations, ATTN-Claude-Explorations, Moodboard, HI-Level-designs, Page-10, Other, Foundations, Archive). The **Foundations** page ("Phase 2 · exact-value tokens") and **HI-Level-designs** are the ground truth; Page-10 holds the device states and mascot.
- Upload: `uploads/Mobie view inspo.png` — device display inspiration (face, clock, widget stack, mascot, logo).
- GitHub: https://github.com/AdedamolaOla/attn — **not read** (GitHub was not connected during this build). Explore it to align components with the real code.

## Index
- `styles.css` — entry; imports only.
- `tokens/fig-tokens.css` — all 406 Figma Variables (6 collections, all modes: light/dark, Dynamic Type sizes, iPhone/iPad…). Unitless floats.
- `tokens/attn.css` — px-ready aliases (`--sp-*`, `--r-*`, `--fs-*`, `--font-*`, gradients, shadows, motion).
- `tokens/fonts.css` — Google Fonts import (Inter, Inter Tight, Agbalumo).
- `components/figma/` — materialized Figma component families. `components/icons/` — Icon + 21 glyphs. `components/device/` — AttnFace, AttnOrb, DeviceDisplay.
- `guidelines/` — foundation cards. `assets/` — logo, mascot parts, images.
- `ui_kits/device`, `ui_kits/ios-app`, `ui_kits/web`. `SKILL.md`.

## Components
From Figma (`components/figma/`): Accordion, AppIcon, AppIconDefault, AttnLogo, ButtonLiquidGlassSymbol, ButtonLiquidGlassText, CheckboxInput, ContentsDisclosure, DateAndTimeCollapsed, Decrement, EditButtonsLight, Grabber, Header, IconShape, ImagesRegular, ImagesTall, Increment, LabelSymbolDefault, LabelSymbolDestructiveDefault, LabelSymbolPreferred, LabelText, LiquidGlassRegularSmall, Loading, MenuItems, PopupButton, PriceCards, Priority, PriorityCardDefault, Row, Separator, SettingsRowContainer, StatusBarIPhone, Stepper, ToggleSwitch, Trailing, WidgetItems, Widgets. Glyph components also emitted as dependencies: AngleDown, AngleLeft, AngleUp, Bell, Check, ChevronRight, Fire, QuestionCircle.
Icons (`components/icons/`): Icon.
Device (`components/device/`): AttnFace, AttnOrb, DeviceDisplay.

Duplicate families in the Figma (App icon, Header, Price Cards, Priority, Widget items, Widgets each appear twice across pages) are the same component; one implementation each.

## Intentional additions
- AttnFace — packages the blocky-eye face from Page-10 "Display" frames (exact eye/mouth/bubble geometry) with expressions + blink/float motion, since device states need a reusable face.
- AttnOrb — the Figma "Loading"/"attn AI" orb, animated per voice state (listening/thinking/speaking). "Thinking" is not drawn in Figma; it reuses the orb with faster motion.
- DeviceDisplay — the Page-10 Display/AI Listening frames as one stateful component. "alert" state (pulsing first item + surprised face) is an extension, not in Figma.
- **Icon** — wrapper for the 21-glyph set.
- Props added to materialized components: `WidgetItems` status/statusTone/tileColor; `PriorityCardDefault` tile/tileColor/onReviewed/onOpen/onMore.

## CONTENT FUNDAMENTALS
- **Voice:** calm, brief, reassuring. attn speaks as a helper that has already done the sorting: "Know what deserves your attention.", "You're all caught up.", "Keep what matters within reach", "Stay ahead of what matters".
- **Person:** "you/your" for the user; attn refers to itself by name in third person ("attn quietly finds important emails before they become problems", "attn will stop syncing this inbox…"). "I" only in the founder note on Pro success.
- **Casing:** Sentence case everywhere — titles, buttons ("Connect your mail", "View Priority Inbox", "Start 7-Day Free Trial" is the exception with Title Case), status ("Due Today" is title-cased as a label). Brand is always lowercase **attn**, and the pun "Needs attn." uses the period.
- **Status lines are terse and time-based:** "Due Today", "Closes in 30mins", "Closes in 1hour", "2 days ago", "In 8 hours", "20mins ago" (note the compact no-space units on the device).
- **Actions:** short verbs — "Reviewed", "Open in Gmail", "Try Again", "Not now", "Add Widget", "Allow notifications", "Disconnect Gmail".
- **Numbers as heroes:** "14 mails", "73%", "Zero mail", "12:42".
- **Fine print** explains consequences plainly: "Read-only access. Disconnect anytime."
- **No emoji** in UI copy. Unicode glyphs ($, ✈︎) appear inside device widget tiles.

## VISUAL FOUNDATIONS
- **Colour:** mostly white / warm canvas (`--surface-canvas` rgb(240,239,234)) with near-black ink (`--surface-priority` rgb(16,16,18)). One loud brand move: the **sky gradient** rgb(0,159,254) → rgb(249,251,227) on the device and onboarding. Accents: sky-soft rgb(124,208,255), sun yellow rgb(255,214,0) (orb), mint rgb(169,239,228) (confidence). Action blue rgb(0,136,255). Urgency = red `--status-action-needed` rgb(255,69,59); `attention/*` scale red→orange→yellow→green.
- **Priority tones:** each priority card sits in a coloured frame — blue, green, orange, cyan (`--priority-tone-*`) with two soft white circles bleeding off the corners and a bevel (inset highlight top-left, inset shade bottom).
- **Type:** Inter Tight is the brand face (titles 700, headline 600, body 400/500). Inter for action labels/buttons (600, 13px). SF Pro for iOS system chrome. **Agbalumo** only for the device clock (128px, line-height 0.72). Tight line-heights (100%) on UI text; 19.6px for reading body.
- **Spacing:** semantic steps 8 compact · 10 control · 12 card · 13 action-x · 14 row · 16 content/screen · 20 panel/screen-x · 24 section · 56 result.
- **Radii:** generous and nested — 8 small, 12 medium, 16 widget item, 20 identity, 24 priority inner, 28 card/widget, 30 panel, 34 widget large, 100 pill. Device screen 72, shell 83.
- **Cards:** dark inner card (`--surface-widget` rgb(22,22,24), r24, shadow 0 4 7.8 rgba(0,0,0,.08)) inside a tone frame (r28, bevel). Light cards: white r20–28, soft 0.08 shadow, no borders. Hairlines rgb(227,225,218) only in lists.
- **Buttons:** full-width blue pills on onboarding; black/white small pills on cards ("Reviewed" black, "Open in Gmail" white); grey circular back button; iOS Liquid Glass buttons for system actions.
- **Backgrounds:** flat white for app screens; sky gradient + cloud imagery for onboarding; device always sky gradient with a dark inset vignette and white 11.6px inner ring. No textures, no noise.
- **Motion:** feedback 120ms, micro 200, content 300, list 320, expressive 550; stagger 60ms. Springs are nearly critically damped for selection (bounce .04), a little for content (.08), playful for expressive (.22). Ambient loops are slow (7.5–13s). Device: face floats and blinks; orb spins/breathes; items enter with 60ms stagger; voice overlay fades in at 36% black.
- **Hover/press:** press = scale .97 + shade; selection tabs slide a white pill with 0 2 16 rgba(0,0,0,.08).
- **Haptics:** selection, impactLight, success. Never on ambient loops, percentage ticks, card entrances or background updates.
- **Transparency/blur:** only iOS Liquid Glass and the device voice overlay.
- **Character:** chunky, cartoon — bubble-letter wordmark and cloud mascot with thick black outlines and offset shadow; device face uses blocky polygon eyes with square highlights.

## ICONOGRAPHY
- A 21-glyph line/solid icon set from the Figma (Font Awesome–style names: angle-*, bell, book, check, chevron-right, close, dna, file-lines, fire, grid, info-circle, question-circle, refresh, share-nodes, users-group, adjustments-vertical, annotation). Materialized to `components/icons/icon-data.js`; render with `<Icon name="Bell" size={16} />` — paints `currentColor`.
- iOS system screens use SF Symbols (appear as private-use glyphs like "􀆊" inside Apple kit components; they render only on Apple platforms).
- Brand logos in cards (RBC, Figma, Air Canada) are bitmaps; only RBC is shipped (`components/figma/assets/73b8d25c64595bf8.png`).
- No emoji. Device tiles use plain Unicode ($, ✈︎).

## Brand assets
- `assets/attn-logo.svg` — wordmark. `assets/mascot/*.svg` — cloud mascot parts (head, bodies, arms, smile, offset shadow), recoloured to white fill / ink outline. `assets/images/` — avatar and onboarding imagery.

## Fonts
Inter, Inter Tight and Agbalumo load from Google Fonts (no font binaries in the Figma). **SF Pro** is not shipped — falls back to the system UI font.
