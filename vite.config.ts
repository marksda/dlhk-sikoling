// import * as path from 'node:path';
// import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
// import { viteStaticCopy } from 'vite-plugin-static-copy';
import react from '@vitejs/plugin-react';


// const require = createRequire(import.meta.url);
// const cMapsDir = path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'cmaps');
// const standardFontsDir = path.join(
//   path.dirname(require.resolve('pdfjs-dist/package.json')),
//   'standard_fonts',
// );

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 3000
  },
  plugins: [
    react(),
    // viteStaticCopy({
    //   targets: [
    //     { src: cMapsDir, dest: '' },
    //     { src: standardFontsDir, dest: '' },
    //   ],
    // }),
  ]
  
})
