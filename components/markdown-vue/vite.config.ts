import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VineVitePlugin } from 'vue-vine/vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MarkdownVue',
      fileName: (format) => `markdown-vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    VineVitePlugin(),
  ],
});
