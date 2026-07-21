import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const iconPath = join(dirname(fileURLToPath(import.meta.url)), 'branding', 'icon.png')

/** Serves and bundles the shared Venue404 favicon from @venue404/assets. */
export function brandingPlugin(): Plugin {
  return {
    name: 'venue404-branding',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/favicon.png' || req.url === '/favicon.ico') {
          res.setHeader('Content-Type', 'image/png')
          res.end(readFileSync(iconPath))
          return
        }
        next()
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'favicon.png',
        source: readFileSync(iconPath),
      })
    },
  }
}
