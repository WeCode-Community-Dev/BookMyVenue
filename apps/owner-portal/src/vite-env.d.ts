// Ambient declarations for static asset imports (Vite resolves these at build).
// Note: we intentionally do NOT `/// <reference types="vite/client" />` here —
// it redeclares import.meta.env and conflicts with @venue404/api-client's own
// ImportMeta.env declaration (TS2717).
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.jpeg' {
  const src: string
  export default src
}
declare module '*.svg' {
  const src: string
  export default src
}
declare module '*.webp' {
  const src: string
  export default src
}
