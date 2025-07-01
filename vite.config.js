// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
// build: {
//     outDir: 'dist',
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '370a-102-90-98-83.ngrok-free.app',  // ✅ Add your ngrok domain here
    ],
  },
  build: {
    outDir: 'dist',
  },
})
