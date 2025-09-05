import rehypeExternalLinks from 'rehype-external-links';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { flush, readStructure } from './pageHandler.js';

const css = `<style scoped>
  @reference "@/assets/css/main.css";
  .markdown {
    @apply text-foreground leading-relaxed;
  }
  .markdown * {
    @apply hover:bg-foreground/10 p-1 transition-colors duration-200 hover:rounded-xs;
  }
  .markdown h1 {
    @apply mb-6 text-3xl font-bold;
  }
  .markdown h2 {
    @apply mt-8 mb-4 text-2xl font-semibold;
  }
  .markdown h3 {
    @apply mt-6 mb-3 text-xl font-semibold;
  }
  .markdown p {
    @apply mb-4 text-base;
  }
  .markdown a {
    @apply text-primary hover:text-primary/80 underline;
  }
  .markdown hr {
    @apply border-border my-6;
  }
  .markdown ol {
    @apply mb-4 list-decimal space-y-2 pl-6;
  }
  .markdown ul {
    @apply mb-4 list-disc space-y-2 pl-6;
  }
  .markdown li {
    @apply leading-relaxed;
  }
  .markdown code {
    @apply bg-muted text-foreground rounded px-0 py-0.5 font-mono text-sm;
  }
  .markdown pre {
    @apply bg-muted text-foreground mb-4 overflow-x-auto rounded p-4 font-mono text-sm;
  }
  .markdown blockquote {
    @apply border-border text-muted-foreground border-l-4 pl-4 italic;
  }
</style>
`;

async function getHash(str) {
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex.slice(0, 8);
}

async function main() {
  const pages = await readStructure('pages');
  const pageRoot = pages.children;
  const menus = JSON.parse(pageRoot['index.json'].content);
  const subMeuns = {};
  const links = [];
  const short_urls = {};
  const short_urls_reversed = {};
  for (const menu of menus) {
    const menuKey = menu.name;
    const menuItem = pageRoot[menuKey].children;
    const submenuKeys = JSON.parse(menuItem['index.json'].content);
    subMeuns[menuKey] = [];
    for (const submenuKey of submenuKeys) {
      const mdContent = menuItem[`${submenuKey}.md`].content;
      const file = await remark()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeExternalLinks, {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          content: {
            type: 'element',
            tagName: 'Icon',
            properties: { name: 'uil:arrow-up-right', className: [] },
            children: [],
          },
        })
        .use(rehypeStringify)
        .process(mdContent);
      const htmlString = String(file);
      const filename = `${String(submenuKey)}.vue`;
      subMeuns[menuKey].push(String(submenuKey));
      const url = `/${menuKey}/${submenuKey}`;
      const urlHashed = await getHash(url);
      links.push(url);
      short_urls[urlHashed] = url;
      short_urls_reversed[`${url}`] = urlHashed;
      flush(['app', 'pages', menuKey, filename], `<template>${htmlString}</template>\n${css}`);
    }
  }

  flush(
    ['app', 'constant', 'menu.ts'],
    `export const MENUS = ${JSON.stringify(menus)};
    export const SUB_MENUS = ${JSON.stringify(subMeuns)} as Record<string,string[]>;
    export const LINKS = ${JSON.stringify(links)};
    export const SHORT_URLS=${JSON.stringify(short_urls)} as Record<string,string>;
    export const SHORT_URLS_REVERSED=${JSON.stringify(short_urls_reversed)} as Record<string,string>;`,
  );
}

await main();
