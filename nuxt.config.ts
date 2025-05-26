import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "nuxt-zod-i18n",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/icon",
  ],

  imports: {
    dirs: [
      "composables/**",
      "stores/**",
      "components/**",
      "pages/**",
      "types/**",
    ],
  },

  css: ["./assets/css/tailwind.css"],

  devtools: { enabled: true },

  compatibilityDate: "2025-05-15",

  icon: {
    provider: "server",
    mode: "svg",
    clientBundle: {
      icons: ["solar:global-outline", "gg:extension", "hugeicons:corporate"],
      scan: true,
      includeCustomCollections: true,
    },
    serverBundle: {
      collections: ["mdi", "line-md", "solar", "gg", "emojione"],
    },

    customCollections: [
      {
        prefix: "my-icon",
        dir: "./src/assets/icons/",
      },
    ],
  },

  ssr: false,

  i18n: {
    strategy: "prefix_and_default",
    defaultLocale: "de",
    vueI18n: "~/i18n/i18n.config.ts",

    locales: [
      { code: "de", language: "de-DE", isCatchallLocale: true },
      { code: "en", language: "en-EN" },
    ],

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },
    types: "composition",
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  zodI18n: {
    localeCodesMapping: {
      "en-GB": "en",
      "de-DE": "de",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
