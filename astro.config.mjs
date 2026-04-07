// @ts-check
import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentStorePath = path.resolve(__dirname, 'src/content-store');

function watchContentStore() {
  return {
    name: 'watch-content-store',
    configureServer(server) {
      server.watcher.add(contentStorePath);
      server.watcher.on('change', (file) => {
        if (file.includes('content-store') && (file.endsWith('.json') || file.endsWith('.md'))) {
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // Hostinger VPS deployment expects the site to be served from the domain root.
  base: '/',
  site: 'https://afgtglobal.com',
  vite: {
    plugins: [tailwindcss(), watchContentStore()]
  },
  redirects: {
    '/': '/en/'
  }
});

