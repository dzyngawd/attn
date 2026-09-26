/**
 * attn — tile glyphs. One small inline SVG per item type, drawn in the same
 * 2px round-capped stroke so tiles feel like one family. Colours live in
 * tokens.css under [data-type]. No emoji (design system rule).
 */
const wrap = (body) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const TILES = {
  calendar: { label: 'Calendar', svg: wrap('<rect x="3" y="5" width="18" height="16" rx="3.5"/><path d="M3 10h18M8 3v4M16 3v4"/>') },
  mail:     { label: 'Email',    svg: wrap('<rect x="3" y="5" width="18" height="14" rx="3.5"/><path d="m4.5 7.5 7.5 5.5 7.5-5.5"/>') },
  task:     { label: 'Task',     svg: wrap('<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>') },
  focus:    { label: 'Focus',    svg: wrap('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/>') },
  note:     { label: 'Note',     svg: wrap('<path d="M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>') },
  manual:   { label: 'Manual',   svg: wrap('<path d="M12 3.5l1.9 5.6 5.6 1.9-5.6 1.9L12 18.5l-1.9-5.6L4.5 11l5.6-1.9z"/>') },
};

export const TILE_TYPES = Object.keys(TILES);

export function tileSvg(type) {
  return (TILES[type] || TILES.manual).svg;
}
