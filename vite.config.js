import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            aggrid: ['ag-grid-vue3', 'ag-grid-community'],
            excel: ['xlsx', 'file-saver'],
            pdf: ['jspdf', 'jspdf-autotable']
          }
        }
      }
    },
    base: mode === 'production' ? '/sisaweb3/' : '/',
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/index.scss" as *;`
        }
      }
    },
  }
})
