import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,       // Allow access from network (optional)
    port: 5173,       // Default Vite dev port
    open: true,       // Automatically open browser
    strictPort: false // If 5173 is busy, use next available port
  }
});