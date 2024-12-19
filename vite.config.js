import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3004', // Your backend server
        changeOrigin: true, // Ensures the origin of the host header is changed to match the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: removes '/api' prefix before forwarding
      },
    },
  },
})
