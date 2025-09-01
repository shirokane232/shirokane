<template>
  <h1>Threads 自動刷新 Token</h1>
  <hr />
  <h3>快速總結：</h3>
  <ul>
    <li>
      由於 Threads API 的 Access Token 會過期，我們使用 Google Apps Script
      建立了一個自動化的腳本，來定期更新這些 Token，確保服務能夠持續穩定運行。
    </li>
  </ul>
  <hr />
  <h3>Step 1: 設置 Google Apps Script</h3>
  <p>我用 Google Sheets 當成我的資料庫，用Google Apps Script 加上定時觸發來完成這個流程。</p>
  <ul>
    <li>
      創建一個 Google sheets，拉一個表並命名為<code>secrets</code>如下圖：
      <img
        src="/markdown/threads-automation/refresh-access-token/578b8209-b9bb-4ca3-ba34-d5976d954ef9.png"
        alt="Default Sheet"
      />
    </li>
    <li>
      開啟Apps Script：擴充功能 -> Apps Script
      <ul>
        <li>
          創建sheets.gs，內容從<a
            href="https://github.com/shirokane232/google-app-script/blob/main/sheets.js"
            rel="noopener noreferrer"
            target="_blank"
            >這裡<span><Icon name="uil:arrow-up-right" class=""></Icon></span></a
          >複製貼上。
        </li>
        <li>
          創建main.gs，內容如下：
          <pre><code>function main() {
   console.log(readRows("secrets"))
}
</code></pre>
        </li>
        <li>
          存檔後選擇 main 按下執行，這一步會跳出一些授權的畫面，全部同意。
          <img
            src="/markdown/threads-automation/refresh-access-token/09f27448-f72d-401c-9791-e2fe395b5e08.png"
            alt="Execute Sheet"
          />
        </li>
        <li>
          將secrets sheet第一列的設置如下：
          <ul>
            <li>id: <code>threads-user</code></li>
            <li>
              secrets: 從上一篇 threads user access token 的 response，樣子像是
              {"access_token":"...","user_id":"..."}
            </li>
            <li>updatedAt: 0</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
  <h3>Step 2: 在 Cloudflare 上部署一個服務來刷新 Token</h3>
  <p>
    Threads API 授權流程需要一個長效的Token。Cloudflare
    是一個快速且免費的託管平台，非常適合用來處理這個登入流程。
  </p>
  <ul>
    <li>
      <p>
        參考<a href="/threads-automation/access-threads-api">上一篇</a>的 deployment
        流程，將response貼在secrets column裡面
      </p>
    </li>
    <li>
      <p>
        由於App Script用來送request的<code>UrlFetchApp</code>不接受太長的URL，於是我們使用一個proxy
        endpoint幫忙轉向：
      </p>
      <pre><code>// /server/api/threads/refresh.ts
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const { access_token, user_id } = await readBody(event);
  if (!access_token || !user_id) {
    return { success: false, error: "Missing access_token or user_id." };
  }

  const params = new URLSearchParams();
  params.append("grant_type", "th_refresh_token");
  params.append("access_token", access_token);

  const requestUrl = `https://graph.threads.net/refresh_access_token?${params.toString()}`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
    });

    const refreshedTokenData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: refreshedTokenData.error_message || "Failed to refresh token.",
      };
    }

    return {
      access_token: refreshedTokenData.access_token,
      user_id: user_id,
    };
  } catch (err) {
    return { success: false, error: "Network request failed." };
  }
});
</code></pre>
    </li>
    <li>
      <p>
        參考用實作<a
          href="https://github.com/shirokane232/cf/blob/main/server/api/threads/auth/refresh-token.ts"
          rel="noopener noreferrer"
          target="_blank"
          >連結<span><Icon name="uil:arrow-up-right" class=""></Icon></span></a
        >。
      </p>
    </li>
  </ul>
  <hr />
  <h3>Step 3: 使用 Google Apps Script 自動更新 Token</h3>
  <p>
    Threads 的 Token 會過期，因此你需要一個定時任務來自動刷新它。Google Apps Script
    是個免費且可靠的選擇，可以設定定時觸發器。
  </p>
  <ul>
    <li>
      <p>在 Google Apps Script 貼上參考用的 scripts:</p>
      <ul>
        <li>
          用來操作sheet跟record更新的<a
            href="https://github.com/shirokane232/google-app-script/blob/main/sheets.js"
            rel="noopener noreferrer"
            target="_blank"
            >sheet.js<span><Icon name="uil:arrow-up-right" class=""></Icon></span
          ></a>
        </li>
        <li>
          用來操作threads相關內容的<a
            href="https://github.com/shirokane232/google-app-script/blob/main/threads.js"
            rel="noopener noreferrer"
            target="_blank"
            >threads.js<span><Icon name="uil:arrow-up-right" class=""></Icon></span
          ></a>
        </li>
      </ul>
    </li>
    <li>
      <p>主要刷新用的 function refreshToken()，一些小細節分享：</p>
      <ul>
        <li>domain可以改成你的Cloudflare service domain:</li>
        <li>目前設定是8小時更新一次，最後一次更新時間會寫回<code>updatedAt</code></li>
        <li>得到新的token會寫回<code>secrets</code></li>
      </ul>
      <pre><code>function refreshToken() {
  const domain = loadEnv()["CLOUDFLARE"];
  const threadSecrets = readRows("secrets").find((value) => {
    return value["id"] == "threads-user";
  });
  const now = new Date().getTime();
  const eightHoursInMilliseconds = 8 * 60 * 60 * 1000;
  if (now - threadSecrets.updatedAt > eightHoursInMilliseconds) {
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(JSON.parse(threadSecrets.secrets)),
    };
    const url = `${domain}api/threads/auth/refresh-token`;
    try {
      const response = UrlFetchApp.fetch(url, options);
      const responseContent = response.getContentText();
      const responseData = JSON.parse(responseContent);
      const responseCode = response.getResponseCode();
      if (responseCode === 200) {
        console.log(JSON.stringify(responseData));
        threadSecrets.secrets = JSON.stringify(responseData);
        threadSecrets.updatedAt = now;
        updateForRecord("secrets", threadSecrets._row_index, threadSecrets);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
</code></pre>
    </li>
    <li>
      <p>更新 main.gs，內容如下：</p>
      <pre><code>function main() {
  threadMain()
}
</code></pre>
    </li>
    <li>
      <p>
        設定定時觸發器：在 Google Apps Script 專案的側邊欄中，點擊「觸發器」，新增一個觸發器來執行
        main 函式，例如設定為15分鐘執行一次。
        <img
          src="/markdown/threads-automation/refresh-access-token/af137bd8-14a9-4adf-80c0-74946ba60fe6.png"
          alt="Trigger"
        />
      </p>
    </li>
  </ul>
  <hr />
  <p>
    透過這幾個步驟，你就建立了一個完整的自動化流程。現在，你的應用程式可以持續與 Threads API 交換
    Token，而無需你頻繁手動介入。
  </p>
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
