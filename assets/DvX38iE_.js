import o from"./DxJWofRL.js";import{H as r,y as u,A as t,E as l,C as n,I as i,G as d,z as s}from"./DaKAzoyb.js";import{_ as p}from"./DlAUqK2U.js";const m=r("/markdown/free-tier-services/cloudflare-nuxt-backend/5ebfde2e-82c7-4fe7-9c96-dc75e1cb0a04.png"),v={},f={href:"https://nitro.build/deploy/providers/cloudflare",rel:"noopener noreferrer",target:"_blank"},g={href:"https://dash.cloudflare.com/",rel:"noopener noreferrer",target:"_blank"},b={href:"https://github.com/shirokane232/cf",rel:"noopener noreferrer",target:"_blank"};function x(y,e){const a=o;return s(),u(d,null,[e[15]||(e[15]=t("h1",null,"後端伺服器 - 使用 Cloudflare Workers & Pages",-1)),e[16]||(e[16]=t("hr",null,null,-1)),e[17]||(e[17]=t("h3",null,"快速總結：",-1)),e[18]||(e[18]=t("ul",null,[t("li",null," 免費： Cloudflare Pages 每天提供多達 100,000 個免費請求，足以應付許多個人專案或小型網站的需求，並且不收取額外費用。 "),t("li",null," 與 GitHub 高度整合： 部署流程非常輕鬆。只需將您的網站專案推送到 GitHub，Cloudflare Pages 就能自動偵測程式碼變更，並在每次 git push 後自動建置並部署您的網站。 "),t("li",null," 提供免費公開網域： Cloudflare Pages 會為您的專案提供一個免費的 .pages.dev 子網域，讓網站能夠即時上線。 ")],-1)),e[19]||(e[19]=t("hr",null,null,-1)),e[20]||(e[20]=t("h3",null,"Step 1: 在 Github 創造一個 repository",-1)),t("ul",null,[e[6]||(e[6]=t("li",null,[t("p",null,"在 Github 創造一個專案")],-1)),e[7]||(e[7]=t("li",null,[t("p",null,"Nuxt Init"),t("pre",null,[t("code",{class:"language-bash"},`npx nuxi init <你的專案名稱>
`)])],-1)),t("li",null,[t("p",null,[e[1]||(e[1]=l(" 根據 ",-1)),t("a",f,[e[0]||(e[0]=l("nitro cloudflare",-1)),t("span",null,[n(a,{name:"uil:arrow-up-right",class:""})])]),e[2]||(e[2]=l(" ，我們在",-1)),e[3]||(e[3]=t("code",null,"nuxt.config.ts",-1)),e[4]||(e[4]=l("中加入 ",-1))]),e[5]||(e[5]=t("pre",null,[t("code",null,`nitro: {
    preset: 'cloudflare-pages'
},
`)],-1))]),e[8]||(e[8]=t("li",null,[t("p",null,"使用一連串的git指令連結上你剛剛創的 git repository")],-1)),e[9]||(e[9]=t("li",null,[t("p",null,"更新你的 repository git add/commit/push")],-1))]),e[21]||(e[21]=t("h3",null,"Step 2: 將 Github 連結至cloudflare Workers & Pages",-1)),t("ul",null,[t("li",null,[e[11]||(e[11]=l(" 登入 Cloudflare ",-1)),t("a",g,[e[10]||(e[10]=l("儀表板",-1)),t("span",null,[n(a,{name:"uil:arrow-up-right",class:""})])])]),e[12]||(e[12]=i('<li data-v-57a0e554> 前往 Compute &gt; Workers &amp; Pages 。 <img src="'+m+'" alt="Cloudflare Workers &amp; Pages" data-v-57a0e554></li><li data-v-57a0e554>按下 Create 按鈕 &gt; 切換到 Pages Tab &gt; 選擇 Import an existing Git repository</li><li data-v-57a0e554> 跟著畫面設定： <ul data-v-57a0e554><li data-v-57a0e554>連結你的 github 帳號跟 repository</li><li data-v-57a0e554>Production branch: main (以後 main 會自動 deployment)</li><li data-v-57a0e554>Framework preset: Nuxt.js</li><li data-v-57a0e554>Build command: npm run build</li><li data-v-57a0e554>Build output directory: dist</li></ul></li><li data-v-57a0e554>按下 Save and Deploy 就會進行第一次 Deployment</li><li data-v-57a0e554>cloudflare 會分配給你一個 domain 。可以用瀏覽器打開檢查看看有沒有成功。</li>',5))]),e[22]||(e[22]=t("h3",null,"Step 3: Nuxt 後端範例：",-1)),t("ul",null,[e[14]||(e[14]=i(`<li data-v-57a0e554><p data-v-57a0e554>規格描述：</p><ul data-v-57a0e554><li data-v-57a0e554>Endpoint: /api/version [GET]</li><li data-v-57a0e554> Response: <ul data-v-57a0e554><li data-v-57a0e554><p data-v-57a0e554>範例</p><pre data-v-57a0e554><code data-v-57a0e554>{
  &quot;version&quot;: &quot;4a4b06f2514f9631f767765e5a3e0c1ff07b526e&quot;,
  &quot;updatedAt&quot;: &quot;2025-08-31T12:22:55+08:00&quot;
}
</code></pre></li><li data-v-57a0e554><p data-v-57a0e554>說明：</p><ul data-v-57a0e554><li data-v-57a0e554>version: commit hash</li><li data-v-57a0e554>updatedAt: commit 的時間</li></ul></li></ul></li></ul></li><li data-v-57a0e554><p data-v-57a0e554> 在nuxt.config.ts中加入<code data-v-57a0e554>commitHash</code>，<code data-v-57a0e554>commitTime</code>，並放入<code data-v-57a0e554>runtimeConfig</code>中 </p><pre data-v-57a0e554><code data-v-57a0e554>const commitHash = require(&#39;child_process&#39;).execSync(&#39;git rev-parse HEAD&#39;).toString().trim();
const commitTime = require(&#39;child_process&#39;).execSync(&#39;git log -1 --format=%cI&#39;).toString().trim();

export default defineNuxtConfig({
  compatibilityDate: &#39;2025-07-15&#39;,
  devtools: { enabled: true },
  nitro: {
    preset: &#39;cloudflare-pages&#39;,
  },
  runtimeConfig: {
    public: {
      commitHash: commitHash,
      commitTime: commitTime,
    },
  },
});
</code></pre></li><li data-v-57a0e554><p data-v-57a0e554>更新server/api/version.ts</p><pre data-v-57a0e554><code class="language-typescript" data-v-57a0e554>export default defineEventHandler(async (event) =&gt; {
  const runtimeConfig = useRuntimeConfig();
  return {
    version: runtimeConfig.public.commitHash,
    updatedAt: runtimeConfig.public.commitTime,
  };
});
</code></pre></li><li data-v-57a0e554><p data-v-57a0e554> git add/commit/push 之後，至 Cloudflare 提供給你的 https://...dev/api/version 觀看結果。 </p></li>`,4)),t("li",null,[t("p",null,[t("a",b,[e[13]||(e[13]=l("範例repository",-1)),t("span",null,[n(a,{name:"uil:arrow-up-right",class:""})])])])])])],64)}const q=p(v,[["render",x],["__scopeId","data-v-57a0e554"]]);export{q as default};
