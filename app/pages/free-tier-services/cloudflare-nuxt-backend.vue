<template>
  <h1>後端伺服器 - 使用 Cloudflare Workers &#x26; Pages</h1>
  <hr />
  <h3>快速總結：</h3>
  <ul>
    <li>
      免費： Cloudflare Pages 每天提供多達 100,000
      個免費請求，足以應付許多個人專案或小型網站的需求，並且不收取額外費用。
    </li>
    <li>
      與 GitHub 高度整合： 部署流程非常輕鬆。只需將您的網站專案推送到 GitHub，Cloudflare Pages
      就能自動偵測程式碼變更，並在每次 git push 後自動建置並部署您的網站。
    </li>
    <li>
      提供免費公開網域： Cloudflare Pages 會為您的專案提供一個免費的 .pages.dev
      子網域，讓網站能夠即時上線。
    </li>
  </ul>
  <hr />
  <h3>Step 1: 在 Github 創造一個 repository</h3>
  <ul>
    <li>
      <p>在 Github 創造一個專案</p>
    </li>
    <li>
      <p>Nuxt Init</p>
      <pre><code class="language-bash">npx nuxi init &#x3C;你的專案名稱>
</code></pre>
    </li>
    <li>
      <p>
        根據
        <a
          href="https://nitro.build/deploy/providers/cloudflare"
          rel="noopener noreferrer"
          target="_blank"
          >nitro cloudflare<span><Icon name="uil:arrow-up-right" class=""></Icon></span
        ></a>
        ，我們在<code>nuxt.config.ts</code>中加入
      </p>
      <pre><code>nitro: {
    preset: 'cloudflare-pages'
},
</code></pre>
    </li>
    <li>
      <p>使用一連串的git指令連結上你剛剛創的 git repository</p>
    </li>
    <li>
      <p>更新你的 repository git add/commit/push</p>
    </li>
  </ul>
  <h3>Step 2: 將 Github 連結至cloudflare Workers &#x26; Pages</h3>
  <ul>
    <li>
      登入 Cloudflare
      <a href="https://dash.cloudflare.com/" rel="noopener noreferrer" target="_blank"
        >儀表板<span><Icon name="uil:arrow-up-right" class=""></Icon></span
      ></a>
    </li>
    <li>
      前往 Compute > Workers &#x26; Pages 。
      <img
        src="/markdown/free-tier-services/cloudflare-nuxt-backend/5ebfde2e-82c7-4fe7-9c96-dc75e1cb0a04.png"
        alt="Cloudflare Workers &#x26; Pages"
      />
    </li>
    <li>按下 Create 按鈕 > 切換到 Pages Tab > 選擇 Import an existing Git repository</li>
    <li>
      跟著畫面設定：
      <ul>
        <li>連結你的 github 帳號跟 repository</li>
        <li>Production branch: main (以後 main 會自動 deployment)</li>
        <li>Framework preset: Nuxt.js</li>
        <li>Build command: npm run build</li>
        <li>Build output directory: dist</li>
      </ul>
    </li>
    <li>按下 Save and Deploy 就會進行第一次 Deployment</li>
    <li>cloudflare 會分配給你一個 domain 。可以用瀏覽器打開檢查看看有沒有成功。</li>
  </ul>
  <h3>Step 3: Nuxt 後端範例：</h3>
  <ul>
    <li>
      <p>規格描述：</p>
      <ul>
        <li>Endpoint: /api/version [GET]</li>
        <li>
          Response:
          <ul>
            <li>
              <p>範例</p>
              <pre><code>{
  "version": "4a4b06f2514f9631f767765e5a3e0c1ff07b526e",
  "updatedAt": "2025-08-31T12:22:55+08:00"
}
</code></pre>
            </li>
            <li>
              <p>說明：</p>
              <ul>
                <li>version: commit hash</li>
                <li>updatedAt: commit 的時間</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      <p>
        在nuxt.config.ts中加入<code>commitHash</code>，<code>commitTime</code>，並放入<code>runtimeConfig</code>中
      </p>
      <pre><code>const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();
const commitTime = require('child_process').execSync('git log -1 --format=%cI').toString().trim();

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'cloudflare-pages',
  },
  runtimeConfig: {
    public: {
      commitHash: commitHash,
      commitTime: commitTime,
    },
  },
});
</code></pre>
    </li>
    <li>
      <p>更新server/api/version.ts</p>
      <pre><code class="language-typescript">export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  return {
    version: runtimeConfig.public.commitHash,
    updatedAt: runtimeConfig.public.commitTime,
  };
});
</code></pre>
    </li>
    <li>
      <p>
        git add/commit/push 之後，至 Cloudflare 提供給你的 https://...dev/api/version 觀看結果。
      </p>
    </li>
    <li>
      <p>
        <a href="https://github.com/shirokane232/cf" rel="noopener noreferrer" target="_blank"
          >範例repository<span><Icon name="uil:arrow-up-right" class=""></Icon></span
        ></a>
      </p>
    </li>
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
