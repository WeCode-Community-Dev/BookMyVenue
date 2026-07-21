/**
 * Venue404 design tokens — JS/TS mirror of theme.css
 *
 * Use these when you need design values in code:
 * charts, canvas, inline styles, motion libraries, tests.
 *
 * Keep in sync with packages/ui/src/styles/theme.css
 */

export const colors = {
  brand:                 '#285A48',  // primary
  brandHover:            '#1e4335',  // primary dark
  brandSecondary:        '#408A71',  // secondary
  brandSecondaryHover:   '#327060',  // secondary dark
  brandBlack:            '#091413',  // custom black
  brandLight:            '#e8f2ee',  // primary tint — backgrounds
  brandLightStrong:      '#d1e6dc',  // primary tint — stronger
  brandMuted:            '#9ec5b4',  // primary tint — rings/borders
  sidebar:     '#091413',  // brand-black — dark sidebar background
  sidebarBorder: 'rgba(39,39,42,0.6)',
  surface:     '#ffffff',
  bg:          '#fafafa',
  text:        '#18181b',
  textMuted:   '#71717a',
  textSubtle:  '#a1a1aa',
  border:      '#e4e4e7',
  borderStrong:'#d4d4d8',
} as const

export const accent = {
  brand:   { bg: '#e8f2ee', icon: '#285A48', text: '#1e4335' },
  amber:   { bg: '#fffbeb', icon: '#f59e0b', text: '#b45309' },
  emerald: { bg: '#ecfdf5', icon: '#10b981', text: '#065f46' },
  violet:  { bg: '#f5f3ff', icon: '#8b5cf6', text: '#5b21b6' },
  rose:    { bg: '#fff1f2', icon: '#f43f5e', text: '#9f1239' },
} as const

export const easing = {
  outExpo:    'cubic-bezier(0.23, 1, 0.32, 1)',
  inOutExpo:  'cubic-bezier(0.77, 0, 0.175, 1)',
} as const

export const duration = {
  press:        150,
  cardEnter:    400,
  cardStagger:   60,
  pageEnter:    250,
} as const

export const layout = {
  sidebarWidth:  248,
  topbarHeight:   60,
} as const
