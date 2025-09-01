# 後端伺服器 - 使用 Cloudflare Workers & Pages

---

### 快速總結：

- 免費： Cloudflare Pages 每天提供多達 100,000 個免費請求，足以應付許多個人專案或小型網站的需求，並且不收取額外費用。
- 與 GitHub 高度整合： 部署流程非常輕鬆。只需將您的網站專案推送到 GitHub，Cloudflare Pages 就能自動偵測程式碼變更，並在每次 git push 後自動建置並部署您的網站。
- 提供免費公開網域： Cloudflare Pages 會為您的專案提供一個免費的 .pages.dev 子網域，讓網站能夠即時上線。

---

### Step 1: 在 Github 創造一個 repository

- 在 Github 創造一個專案
- Nuxt Init
  ```bash
  npx nuxi init <你的專案名稱>
  ```
- 根據 [nitro cloudflare](https://nitro.build/deploy/providers/cloudflare) ，我們在`nuxt.config.ts`中加入

  ```
  nitro: {
      preset: 'cloudflare-pages'
  },
  ```

- 使用一連串的git指令連結上你剛剛創的 git repository
- 更新你的 repository git add/commit/push

### Step 2: 將 Github 連結至cloudflare Workers & Pages

- 登入 Cloudflare [儀表板](https://dash.cloudflare.com/)
- 前往 Compute > Workers & Pages 。
  ![Cloudflare Workers & Pages](/markdown/free-tier-services/cloudflare-nuxt-backend/5ebfde2e-82c7-4fe7-9c96-dc75e1cb0a04.png)
- 按下 Create 按鈕 > 切換到 Pages Tab > 選擇 Import an existing Git repository
- 跟著畫面設定：
  - 連結你的 github 帳號跟 repository
  - Production branch: main (以後 main 會自動 deployment)
  - Framework preset: Nuxt.js
  - Build command: npm run build
  - Build output directory: dist
- 按下 Save and Deploy 就會進行第一次 Deployment
- cloudflare 會分配給你一個 domain 。可以用瀏覽器打開檢查看看有沒有成功。

### Step 3: Nuxt 後端範例：

- 規格描述：
  - Endpoint: /api/version [GET]
  - Response:
    - 範例

      ```
      {
        "version": "4a4b06f2514f9631f767765e5a3e0c1ff07b526e",
        "updatedAt": "2025-08-31T12:22:55+08:00"
      }
      ```

    - 說明：
      - version: commit hash
      - updatedAt: commit 的時間

- 在nuxt.config.ts中加入`commitHash`，`commitTime`，並放入`runtimeConfig`中

  ```
  const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();
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
  ```

- 更新server/api/version.ts

  ```typescript
  export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    return {
      version: runtimeConfig.public.commitHash,
      updatedAt: runtimeConfig.public.commitTime,
    };
  });
  ```

- git add/commit/push 之後，至 Cloudflare 提供給你的 https://...dev/api/version 觀看結果。
- [範例repository](https://github.com/shirokane232/cf)
