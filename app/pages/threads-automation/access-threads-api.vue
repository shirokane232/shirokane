<template>
  <h1>Threads API 服務開通</h1>
  <hr />
  <h3>快速總結：</h3>
  <ul>
    <li>
      要使用
      <a
        href="https://developers.facebook.com/docs/threads/"
        rel="noopener noreferrer"
        target="_blank"
        >Threads API<span><Icon name="uil:arrow-up-right" class=""></Icon></span></a
      >，你首先需要一個公開的網域來進行 Meta OAuth 驗證。
    </li>
    <li>
      利用
      <a href="https://www.cloudflare.com/" rel="noopener noreferrer" target="_blank"
        >Cloudflare<span><Icon name="uil:arrow-up-right" class=""></Icon></span
      ></a>
      託管來提供這個必要的網域，同時它也作為一個輕量級的後端平台，讓我們可以運行程式碼。
    </li>
    <li>設定與驗證是否能取得Access Token。</li>
  </ul>
  <hr />
  <h3>Step 1: 在 Facebook 開發者主控台註冊你的應用程式</h3>
  <ul>
    <li>
      至<a
        href="https://developers.facebook.com/apps/creation/"
        rel="noopener noreferrer"
        target="_blank"
        >Facebook 開發者主控台<span><Icon name="uil:arrow-up-right" class=""></Icon></span></a
      >建立應用程式
    </li>
    <li>
      至<code>應用程式角色</code> > <code>角色</code> > <code>新增用戶</code> >
      <code>增加 Threads 測試人員</code>
      <img
        src="/markdown/threads-automation/access-threads-api/b6b2893d-01d7-4739-bfd6-834694d36b83.png"
        alt="Add Threads Tester"
      />
    </li>
    <li>
      至<code>使用案例</code> > <code>存取Thread API (自訂)</code> > <code>設定</code>
      <ul>
        <li>取得 <code>Client ID</code> : Threads 應用程式編號</li>
        <li>取得 <code>Client Secret</code> : Threads 應用程式密鑰</li>
        <li>
          重新導向回呼網址：填入前端的 callback
          <ul>
            <li>
              我這邊是填入等等要去 Cloudflare 完成的後端 https://&#x3C;你的cloudflare
              Pages>.pages.dev/api/threads/auth/callback
            </li>
          </ul>
        </li>
        <li>解除安裝回呼網址：填入前端的cancel callback</li>
        <li>
          刪除回呼網址：填入前端的delete callback
          <img
            src="/markdown/threads-automation/access-threads-api/5341b5a7-9cde-4771-9fd2-ce1a1dcab51d.png"
            alt="Secrets"
          />
        </li>
      </ul>
    </li>
  </ul>
  <h3>Step 2: 設定重新導向回呼網址 (本例使用 Cloudflare)</h3>
  <ul>
    <li>
      開通自己的Github repository 並設定 Cloudflare Workers &#x26; Pages，詳細例子<a
        href="/shirokane/free-tier-services/cloudflare-nuxt-backend"
        >請看這</a
      >。
    </li>
    <li>
      在
      <a
        href="https://github.com/shirokane232/cf/blob/main/nuxt.config.ts"
        rel="noopener noreferrer"
        target="_blank"
        >nuxt.config.ts<span><Icon name="uil:arrow-up-right" class=""></Icon></span
      ></a>
      加入下列變數：
      <ul>
        <li>Client ID -> runtimeConfig.public.threadsClientId</li>
        <li>Redirect Path -> runtimeConfig.public.threadsRedirectPath</li>
        <li>
          Client Secret:
          <ul>
            <li>runtimeConfig.threadsClientSecret</li>
            <li>注意不要放在public下面，記得去 Cloudflare 更新 Secret。</li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      提供 User Login 的導向網址：<a
        href="https://github.com/shirokane232/cf/blob/main/server/api/threads/auth/login.ts"
        rel="noopener noreferrer"
        target="_blank"
        >/server/api/threads/auth/login.ts<span
          ><Icon name="uil:arrow-up-right" class=""></Icon></span
      ></a>
    </li>
    <li>
      提供 Callback 的導向網址：<a
        href="https://github.com/shirokane232/cf/blob/main/server/api/threads/auth/callback.ts"
        rel="noopener noreferrer"
        target="_blank"
        >/server/api/threads/auth/callback.ts<span
          ><Icon name="uil:arrow-up-right" class=""></Icon></span
      ></a>
      <ul>
        <li>
          在 callback.ts 檔案中，除了將授權碼（code）交換為 Access Token
          之外，還進行了額外的步驟，將這個 Access Token 進一步換成了長效期的Token (long-lived token)
        </li>
      </ul>
    </li>
  </ul>
  <h3>Step 3: 驗證</h3>
  <ul>
    <li>打開瀏覽器輸入：https://&#x3C;你的cloudflare domain>.pages.dev/api/threads/auth/login</li>
    <li>
      會導向<a href="https://www.threads.com/login" rel="noopener noreferrer" target="_blank"
        >Threads的Login畫面<span><Icon name="uil:arrow-up-right" class=""></Icon></span
      ></a>
    </li>
    <li>輸入帳號密碼後並同意授權後，就可以從response得到Access Token跟User ID的資訊</li>
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
