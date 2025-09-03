# Threads API 服務開通

---

### 快速總結：

- 要使用 [Threads API](https://developers.facebook.com/docs/threads/)，你首先需要一個公開的網域來進行 Meta OAuth 驗證。
- 利用 [Cloudflare](https://www.cloudflare.com/) 託管來提供這個必要的網域，同時它也作為一個輕量級的後端平台，讓我們可以運行程式碼。
- 設定與驗證是否能取得Access Token。

---

### Step 1: 在 Facebook 開發者主控台註冊你的應用程式

- 至[Facebook 開發者主控台](https://developers.facebook.com/apps/creation/)建立應用程式
- 至`應用程式角色` > `角色` > `新增用戶` > `增加 Threads 測試人員`
  ![Add Threads Tester](/markdown/threads-automation/access-threads-api/b6b2893d-01d7-4739-bfd6-834694d36b83.png)
- 至`使用案例` > `存取Thread API (自訂)` > `設定`
  - 取得 `Client ID` : Threads 應用程式編號
  - 取得 `Client Secret` : Threads 應用程式密鑰
  - 重新導向回呼網址：填入前端的 callback
    - 我這邊是填入等等要去 Cloudflare 完成的後端 https://<你的cloudflare Pages>.pages.dev/api/threads/auth/callback
  - 解除安裝回呼網址：填入前端的cancel callback
  - 刪除回呼網址：填入前端的delete callback
    ![Secrets](/markdown/threads-automation/access-threads-api/5341b5a7-9cde-4771-9fd2-ce1a1dcab51d.png)

### Step 2: 設定重新導向回呼網址 (本例使用 Cloudflare)

- 開通自己的Github repository 並設定 Cloudflare Workers & Pages，詳細例子[請看這](/shirokane/free-tier-services/cloudflare-nuxt-backend)。
- 在 [nuxt.config.ts](https://github.com/shirokane232/cf/blob/main/nuxt.config.ts) 加入下列變數：
  - Client ID -> runtimeConfig.public.threadsClientId
  - Redirect Path -> runtimeConfig.public.threadsRedirectPath
  - Client Secret:
    - runtimeConfig.threadsClientSecret
    - 注意不要放在public下面，記得去 Cloudflare 更新 Secret。
- 提供 User Login 的導向網址：[/server/api/threads/auth/login.ts](https://github.com/shirokane232/cf/blob/main/server/api/threads/auth/login.ts)
- 提供 Callback 的導向網址：[/server/api/threads/auth/callback.ts](https://github.com/shirokane232/cf/blob/main/server/api/threads/auth/callback.ts)
  - 在 callback.ts 檔案中，除了將授權碼（code）交換為 Access Token 之外，還進行了額外的步驟，將這個 Access Token 進一步換成了長效期的Token (long-lived token)

### Step 3: 驗證

- 打開瀏覽器輸入：https://<你的cloudflare domain>.pages.dev/api/threads/auth/login
- 會導向[Threads的Login畫面](https://www.threads.com/login)
- 輸入帳號密碼後並同意授權後，就可以從response得到Access Token跟User ID的資訊
