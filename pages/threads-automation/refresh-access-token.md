# Threads 自動刷新 Token

---

### 快速總結：

- 由於 Threads API 的 Access Token 會過期，我們使用 Google Apps Script 建立了一個自動化的腳本，來定期更新這些 Token，確保服務能夠持續穩定運行。

---

### Step 1: 設置 Google Apps Script

我用 Google Sheets 當成我的資料庫，用Google Apps Script 加上定時觸發來完成這個流程。

- 創建一個 Google sheets，拉一個表並命名為`secrets`如下圖：
  ![Default Sheet](/markdown/threads-automation/refresh-access-token/578b8209-b9bb-4ca3-ba34-d5976d954ef9.png)
- 開啟Apps Script：擴充功能 -> Apps Script
  - 創建sheets.gs，內容從[這裡](https://github.com/shirokane232/google-app-script/blob/main/sheets.js)複製貼上。
  - 創建main.gs，內容如下：
    ```
    function main() {
       console.log(readRows("secrets"))
    }
    ```
  - 存檔後選擇 main 按下執行，這一步會跳出一些授權的畫面，全部同意。
    ![Execute Sheet](/markdown/threads-automation/refresh-access-token/09f27448-f72d-401c-9791-e2fe395b5e08.png)
  - 將secrets sheet第一列的設置如下：
    - id: `threads-user`
    - secrets: 從上一篇 threads user access token 的 response，樣子像是 {"access_token":"...","user_id":"..."}
    - updatedAt: 0

### Step 2: 在 Cloudflare 上部署一個服務來刷新 Token

Threads API 授權流程需要一個長效的Token。Cloudflare 是一個快速且免費的託管平台，非常適合用來處理這個登入流程。

- 參考[上一篇](/threads-automation/access-threads-api)的 deployment 流程，將response貼在secrets column裡面
- 由於App Script用來送request的`UrlFetchApp`不接受太長的URL，於是我們使用一個proxy endpoint幫忙轉向：

  ```
  // /server/api/threads/refresh.ts
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
  ```

- 參考用實作[連結](https://github.com/shirokane232/cf/blob/main/server/api/threads/auth/refresh-token.ts)。

---

### Step 3: 使用 Google Apps Script 自動更新 Token

Threads 的 Token 會過期，因此你需要一個定時任務來自動刷新它。Google Apps Script 是個免費且可靠的選擇，可以設定定時觸發器。

- 在 Google Apps Script 貼上參考用的 scripts:
  - 用來操作sheet跟record更新的[sheet.js](https://github.com/shirokane232/google-app-script/blob/main/sheets.js)
  - 用來操作threads相關內容的[threads.js](https://github.com/shirokane232/google-app-script/blob/main/threads.js)
- 主要刷新用的 function refreshToken()，一些小細節分享：
  - domain可以改成你的Cloudflare service domain:
  - 目前設定是8小時更新一次，最後一次更新時間會寫回`updatedAt`
  - 得到新的token會寫回`secrets`
  ```
  function refreshToken() {
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
  ```
- 更新 main.gs，內容如下：

  ```
  function main() {
    threadMain()
  }
  ```

- 設定定時觸發器：在 Google Apps Script 專案的側邊欄中，點擊「觸發器」，新增一個觸發器來執行 main 函式，例如設定為15分鐘執行一次。
  ![Trigger](/markdown/threads-automation/refresh-access-token/af137bd8-14a9-4adf-80c0-74946ba60fe6.png)

---

透過這幾個步驟，你就建立了一個完整的自動化流程。現在，你的應用程式可以持續與 Threads API 交換 Token，而無需你頻繁手動介入。
