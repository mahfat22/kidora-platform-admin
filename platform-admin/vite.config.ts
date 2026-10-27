import { fileURLToPath, URL } from 'node:url';
import autoprefixer from 'autoprefixer';
import vue from '@vitejs/plugin-vue';
import tailwindcss from 'tailwindcss';
import { defineConfig, loadEnv } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const themeSource = fileURLToPath(new URL('../src', import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, projectRoot, '');
    const apiBaseUrl = env.VITE_API_BASE_URL;

    if (!apiBaseUrl) {
        throw new Error('Set VITE_API_BASE_URL in platform-admin/.env to the local Laravel URL.');
    }

    const backendUrl = new URL(apiBaseUrl);
    if (backendUrl.protocol !== 'http:' || backendUrl.hostname !== 'kidora.test' || backendUrl.pathname !== '/') {
        throw new Error('VITE_API_BASE_URL must point to the local http://kidora.test backend.');
    }

    return {
        root: projectRoot,
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@theme': themeSource,
            },
        },
        css: {
            postcss: {
                plugins: [tailwindcss({ config: fileURLToPath(new URL('./tailwind.config.cjs', import.meta.url)) }), autoprefixer()],
            },
        },
        server: {
            fs: {
                allow: [fileURLToPath(new URL('..', import.meta.url))],
            },
            proxy: {
                '/admin/api': {
                    target: backendUrl.origin,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
        },
    };
});
