// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    ["github:haexhub/haex-base-ui", { install: true }]
  ],

  devtools: { enabled: true },

  compatibilityDate: '2025-05-15',

  modules: ['@vite-pwa/nuxt'],

  icon: {
    provider: 'server',
    mode: "svg",
    clientBundle: {
      icons: ["solar:global-outline", "gg:extension", "hugeicons:corporate"],
      scan: true,
      includeCustomCollections: true,
    },
    serverBundle: { collections: ["mdi", "line-md", "solar", "gg", "emojione"] },

    customCollections: [
      {
        prefix: 'my-icon',
        dir: './src/assets/icons/'
      },
    ],
  },
})