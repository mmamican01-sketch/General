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
// Set GITHUB_PAGES=1 when deploying to GitHub Pages (https://username.github.io/General/)
const isGitHubPages = process.env.GITHUB_PAGES === '1';
export default defineConfig({
  output: 'static',
  base: isGitHubPages ? '/General/' : '/',
  site: isGitHubPages ? 'https://mmamican01-sketch.github.io' : 'https://general-gjpn.vercel.app',
  vite: {
    plugins: [tailwindcss(), watchContentStore()]
  },
  redirects: {
    '/': '/en/'
  }
});

