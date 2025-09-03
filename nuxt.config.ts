import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
  modules: [
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
  ],
  app: {
    baseURL: '/shirokane/',
    buildAssetsDir: 'assets',
    head: {
      title: '白金雜記', // default title
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/shirokane/favicon.ico' }],
      meta: [
        { name: 'description', content: '數位乞丐｜免費服務狂熱者' },
        { property: 'og:title', content: '白金雜記' },
        { property: 'og:description', content: '數位乞丐｜免費服務狂熱者' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://shirokane232.github.io/shirokane/' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: 'Shadcn',
  },
  colorMode: {
    preference: 'dark', // default theme
    fallback: 'dark', // if system preference can't be detected
    classSuffix: '', // don't append -dark or -light
  },
  fonts: {
    families: [{ name: 'Noto Serif TC', weights: [400, 700], provider: 'google' }],
  },
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'zh',
    detectBrowserLanguage: false,
    locales: [{ code: 'zh', language: 'zh-TW' }],
  },
});
