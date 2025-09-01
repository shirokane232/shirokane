export const MENUS = [
  { name: 'free-tier-services', icon: 'material-symbols:star-outline-rounded' },
  { name: 'threads-automation', icon: 'mingcute:threads-line' },
  { name: 'about', icon: 'mdi:information-outline' },
];
export const SUB_MENUS = {
  'free-tier-services': ['cloudflare-nuxt-backend'],
  'threads-automation': ['access-threads-api', 'refresh-access-token'],
  about: ['shirokane'],
} as Record<string, string[]>;
export const LINKS = [
  '/free-tier-services/cloudflare-nuxt-backend',
  '/threads-automation/access-threads-api',
  '/threads-automation/refresh-access-token',
  '/about/shirokane',
];
export const SHORT_URLS = {
  '951de663': '/free-tier-services/cloudflare-nuxt-backend',
  '31ebf6b1': '/threads-automation/access-threads-api',
  c0e2d79d: '/threads-automation/refresh-access-token',
  '0fd0584f': '/about/shirokane',
} as Record<string, string>;
export const SHORT_URLS_REVERSED = {
  '/free-tier-services/cloudflare-nuxt-backend': '951de663',
  '/threads-automation/access-threads-api': '31ebf6b1',
  '/threads-automation/refresh-access-token': 'c0e2d79d',
  '/about/shirokane': '0fd0584f',
} as Record<string, string>;
