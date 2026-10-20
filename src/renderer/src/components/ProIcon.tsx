import type { CSSProperties } from 'react';

/** Line glyphs used by the 0.5.7 PRO workspace. 24px grid, 1.7 stroke, one
 *  colour (currentColor) — deliberately different from the 16px pixel icon set
 *  used by Classic. Paths are the same family as the 0.5.7 rail so the two
 *  interfaces read as one product. */
export type ProIconName =
  | 'tasks'
  | 'inbox'
  | 'automations'
  | 'memory'
  | 'capabilities'
  | 'integrations'
  | 'stapler'
  | 'agents'
  | 'temps'
  | 'search'
  | 'plus'
  | 'attach'
  | 'mic'
  | 'send'
  | 'chevron-up'
  | 'chevron-down'
  | 'close'
  | 'sun'
  | 'moon'
  | 'gear'
  | 'expand'
  | 'collapse'
  | 'play'
  | 'stop';

const PATHS: Record<ProIconName, string> = {
  tasks: 'M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM9 5v14M15 5v14',
  inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h5l2 3h4l2-3h5',
  automations: 'M13 2L4 14h7l-1 8 9-12h-7z',
  memory: 'M6 6m-2.5 0a2.5 2.5 0 105 0a2.5 2.5 0 10-5 0M18 8m-2.5 0a2.5 2.5 0 105 0a2.5 2.5 0 10-5 0M9 18m-2.5 0a2.5 2.5 0 105 0a2.5 2.5 0 10-5 0M17 17m-2.5 0a2.5 2.5 0 105 0a2.5 2.5 0 10-5 0M8 7.5l7.5 1M7.5 8l1 7.5M11.5 18h3M16 10l1 4.5',
  capabilities: 'M12 3l2 3h3l1 3 3 2-1 3 1 3-3 2-1 3h-3l-2 3-2-3H7l-1-3-3-2 1-3-1-3 3-2 1-3h3zM12 12m-3 0a3 3 0 106 0a3 3 0 10-6 0',
  integrations: 'M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 01-11 0zM12 17v4',
  stapler: 'M3 15h18v4H3zM5 15V9a1 1 0 011-1h9l6-2v9M15 8v7',
  agents: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  temps: 'M12 12m-9 0a9 9 0 1018 0a9 9 0 10-18 0M12 7v5l3 2',
  search: 'M11 11m-7 0a7 7 0 1014 0a7 7 0 10-14 0M20 20l-3.5-3.5',
  plus: 'M12 5v14M5 12h14',
  attach: 'M21 12l-8.5 8.5a5 5 0 01-7-7L14 5a3.5 3.5 0 015 5l-8.5 8.5a2 2 0 01-3-3L15 8',
  mic: 'M9 3h6v8a3 3 0 01-6 0zM5 11a7 7 0 0014 0M12 18v3M9 21h6',
  send: 'M3 11l18-8-8 18-2-8z',
  'chevron-up': 'M6 15l6-6 6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  close: 'M6 6l12 12M18 6L6 18',
  sun: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z',
  gear: 'M12 9a3 3 0 100 6 3 3 0 000-6zM19.4 15a1.7 1.7 0 00.3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V20h-2.4v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.9.3l-.1.1-1.7-1.7.1-.1A1.7 1.7 0 007.7 15a1.7 1.7 0 00-1.6-1H6v-2.4h.1a1.7 1.7 0 001.6-1.1 1.7 1.7 0 00-.3-1.9l-.1-.1 1.7-1.7.1.1a1.7 1.7 0 001.9.3A1.7 1.7 0 0012 5.6V5.5h2.4v.1a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.6 1h.1V14h-.1a1.7 1.7 0 00-1.6 1z',
  expand: 'M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5',
  collapse: 'M8 8H3V3M16 8h5V3M21 16h-5v5M3 16h5v5',
  play: 'M8 5l11 7-11 7z',
  stop: 'M6 6h12v12H6z'
};

export function ProIcon({ name, size = 16, style }: { name: ProIconName; size?: number; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, opacity: 0.9, ...style }}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}