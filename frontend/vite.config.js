import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [tailwindcss(), react()],

    server: {
      proxy: mode === 'development'
        ? {
            '/api': {
              target: env.VITE_API_URL,
              changeOrigin: true,
            },
          }
        : undefined,
    },

    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    }
  }
});
