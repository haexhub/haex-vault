import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  
  telemetry: false,
  
  modules: [
    '@pinia/nuxt',
    'nuxt-zod-i18n',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-snackbar',
    'pinia-plugin-persistedstate/nuxt',
  ],

  imports: {
    dirs: ['composables/**', 'stores/**', 'components/**', 'pages/**'],
  },

  i18n: {
    strategy: 'prefix_and_default',
    defaultLocale: 'de',
    lazy: true,
    vueI18n: './src/i18n/i18n.config.ts',
    /* langDir: '../src/i18n',
     */

    locales: [
      { code: 'de', language: 'de-DE', isCatchallLocale: true },
      { code: 'en', language: 'en-EN' },
    ],

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
    },
    types: 'composition',
  },

  zodI18n: {
    localeCodesMapping: {
      'en-GB': 'en',
      'de-DE': 'de',
    },
  },

  runtimeConfig: {
    public: {
      haexVault: {
        lastVaultFileName: 'lastVaults.json',
        defaultDatabase: 'src/database/default.db',
      },
    },
  },

  devtools: { enabled: true },
  srcDir: './src',
  // Enable SSG
  ssr: false,
  // Enables the development server to be discoverable by other devices when running on iOS physical devices
  devServer: { host: process.env.TAURI_DEV_HOST || 'localhost' },
  vite: {
    // Better support for Tauri CLI output
    clearScreen: false,
    // Enable environment variables
    // Additional environment variables can be found at
    // https://v2.tauri.app/reference/environment-variables/
    envPrefix: ['VITE_', 'TAURI_'],
    server: {
      // Tauri requires a consistent port
      strictPort: true,
    },

    optimizeDeps: {
      // Don't optimize these packages as they contain web workers and WASM files.
      // https://github.com/vitejs/vite/issues/11672#issuecomment-1415820673
      exclude: ['@journeyapps/wa-sqlite', '@powersync/web'],
      include: ['@powersync/web > js-logger'],
    },
    plugins: [wasm(), topLevelAwait()],
    worker: {
      format: 'es',
      plugins: () => [wasm(), topLevelAwait()],
    },
  },
});
