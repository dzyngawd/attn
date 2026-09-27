/**
 * attn — theme picker (Control Centre header, top right).
 *
 * Four swatches, one per theme; each swatch carries its own [data-theme] so the
 * CSS tokens paint it with the real gradient — no colour values live here.
 *
 *   const picker = mountThemePicker(el, { onSelect: (theme) => … });
 *   picker.set('lime');   // reflect the current theme
 */
import { THEMES, THEME_META } from './state.js';

export function mountThemePicker(el, { onSelect }) {
  el.innerHTML = THEMES.map((id) => `<button class="swatch" type="button" role="radio" aria-checked="false" data-theme="${id}" data-pick="${id}" title="${THEME_META[id].label} · ${THEME_META[id].hint}" aria-label="${THEME_META[id].label} theme"><span class="swatch-dot"></span></button>`).join('')
    + '<span class="theme-picker-name" aria-live="polite"></span>';
  const name = el.querySelector('.theme-picker-name');
  const set = (theme) => {
    el.querySelectorAll('.swatch').forEach((b) => b.setAttribute('aria-checked', b.dataset.pick === theme ? 'true' : 'false'));
    name.textContent = THEME_META[theme]?.label || '';
  };
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.swatch');
    if (!b) return;
    set(b.dataset.pick);
    onSelect?.(b.dataset.pick);
  });
  return { set };
}
