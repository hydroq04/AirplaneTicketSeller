import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Cho phép truy cập từ IP trong mạng LAN
    port: 5173, // Cổng mặc định (có thể đổi nếu muốn)
  },
})
