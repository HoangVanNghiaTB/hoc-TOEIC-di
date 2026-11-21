import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tutorPlugin } from './server/tutorPlugin.ts'
import { progressPlugin } from './server/progressPlugin.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), tutorPlugin(), progressPlugin()],
  server: { host: true, port: 5173, strictPort: true },
  optimizeDeps: { include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-dev-runtime'] },
})
