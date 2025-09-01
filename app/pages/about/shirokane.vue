<template>
  <h1>Shirokane</h1>
  <p>數位乞丐｜免費服務狂熱者。</p>
  <p>
    我沒有崇高理想，只是一名漂泊在異鄉的數位遊民。暫時定居東京白金台後，便以白金自稱。
    你的每一份贊助，都是我生存的能量。無論是一杯咖啡、兩杯，甚至是十杯，你的心意都將成為我繼續在網路上乞討的動力。
  </p>
  <hr />
  <h2>我的創作</h2>
  <p>
    部落格：<a
      href="https://shirokane232.github.io/shirokane/"
      rel="noopener noreferrer"
      target="_blank"
      >白金雜記<span><Icon name="uil:arrow-up-right" class=""></Icon></span
    ></a>
  </p>
  <h2>如何支持我</h2>
  <ul>
    <li>Buy Me a Coffee： https://buymeacoffee.com/shirokane</li>
  </ul>
  <h3>聯繫方式</h3>
  <ul>
    <li>
      Github：<a href="https://github.com/shirokane232/" rel="noopener noreferrer" target="_blank"
        >https://github.com/shirokane232/<span
          ><Icon name="uil:arrow-up-right" class=""></Icon></span
      ></a>
    </li>
    <li>電子郵件：shirokane232@gmail.com</li>
  </ul>
</template>
<style scoped>
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
