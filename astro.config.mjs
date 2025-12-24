// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://joydeepballabh.github.io/TravelR', // Replace with your actual site URL
  base: '/TravelR', // Needed if deploying to a project page (user.github.io/repo)
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()]
});