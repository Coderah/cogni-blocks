import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { deepkitType } from '@deepkit/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), deepkitType() as Plugin, Components()],
});
