import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Use relative asset paths so /assets isn't rewritten to HTML on some hosts
  base: '',
  plugins: [react()],
});


