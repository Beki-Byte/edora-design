import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' → the built site works from any sub-path (GitHub Pages, Netlify, Vercel…)
export default defineConfig({ base: './', plugins: [react()] });
