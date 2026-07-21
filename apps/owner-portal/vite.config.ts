import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { brandingPlugin } from '../../packages/assets/vite-branding'

export default defineConfig({
  plugins: [brandingPlugin(), tailwindcss(), react()],
  server: {
    port: 5398,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
