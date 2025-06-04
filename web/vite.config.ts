import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'postcss'
import autoprefixer from 'postcss'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
})
