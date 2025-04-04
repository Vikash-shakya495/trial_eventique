import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
  server: {
    proxy: {
      "/socket.io": {
        target: "https://trial-eventique-002-event-booking-system.onrender.com",
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})


// export const API_URL = import.meta.env.VITE_API_URL;
