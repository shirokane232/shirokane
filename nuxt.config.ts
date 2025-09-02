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
    defaultLocale: 'zh-tw',
    locales: [{ code: 'zh-tw', name: 'zh-tw', file: 'zh-tw.json' }],
  },
});
