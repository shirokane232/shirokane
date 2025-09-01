import l from"./BrqzjRh4.js";import{H as o,y as a,A as n,E as t,C as r,I as d,G as p,z as i}from"./-n5fOHii.js";import{_ as u}from"./DlAUqK2U.js";const f=o("/markdown/threads-automation/refresh-access-token/578b8209-b9bb-4ca3-ba34-d5976d954ef9.png"),m=o("/markdown/threads-automation/refresh-access-token/09f27448-f72d-401c-9791-e2fe395b5e08.png"),g=o("/markdown/threads-automation/refresh-access-token/af137bd8-14a9-4adf-80c0-74946ba60fe6.png"),k={},h={href:"https://github.com/shirokane232/google-app-script/blob/main/sheets.js",rel:"noopener noreferrer",target:"_blank"},c={href:"https://github.com/shirokane232/cf/blob/main/server/api/threads/auth/refresh-token.ts",rel:"noopener noreferrer",target:"_blank"},S={href:"https://github.com/shirokane232/google-app-script/blob/main/sheets.js",rel:"noopener noreferrer",target:"_blank"},v={href:"https://github.com/shirokane232/google-app-script/blob/main/threads.js",rel:"noopener noreferrer",target:"_blank"};function b(T,e){const s=l;return i(),a(p,null,[e[19]||(e[19]=n("h1",null,"Threads 自動刷新 Token",-1)),e[20]||(e[20]=n("hr",null,null,-1)),e[21]||(e[21]=n("h3",null,"快速總結：",-1)),e[22]||(e[22]=n("ul",null,[n("li",null," 由於 Threads API 的 Access Token 會過期，我們使用 Google Apps Script 建立了一個自動化的腳本，來定期更新這些 Token，確保服務能夠持續穩定運行。 ")],-1)),e[23]||(e[23]=n("hr",null,null,-1)),e[24]||(e[24]=n("h3",null,"Step 1: 設置 Google Apps Script",-1)),e[25]||(e[25]=n("p",null,"我用 Google Sheets 當成我的資料庫，用Google Apps Script 加上定時觸發來完成這個流程。",-1)),n("ul",null,[e[7]||(e[7]=n("li",null,[t(" 創建一個 Google sheets，拉一個表並命名為"),n("code",null,"secrets"),t("如下圖： "),n("img",{src:f,alt:"Default Sheet"})],-1)),n("li",null,[e[6]||(e[6]=t(" 開啟Apps Script：擴充功能 -> Apps Script ",-1)),n("ul",null,[n("li",null,[e[1]||(e[1]=t(" 創建sheets.gs，內容從",-1)),n("a",h,[e[0]||(e[0]=t("這裡",-1)),n("span",null,[r(s,{name:"uil:arrow-up-right",class:""})])]),e[2]||(e[2]=t("複製貼上。 ",-1))]),e[3]||(e[3]=n("li",null,[t(" 創建main.gs，內容如下： "),n("pre",null,[n("code",null,`function main() {
   console.log(readRows("secrets"))
}
`)])],-1)),e[4]||(e[4]=n("li",null,[t(" 存檔後選擇 main 按下執行，這一步會跳出一些授權的畫面，全部同意。 "),n("img",{src:m,alt:"Execute Sheet"})],-1)),e[5]||(e[5]=n("li",null,[t(" 將secrets sheet第一列的設置如下： "),n("ul",null,[n("li",null,[t("id: "),n("code",null,"threads-user")]),n("li",null,' secrets: 從上一篇 threads user access token 的 response，樣子像是 {"access_token":"...","user_id":"..."} '),n("li",null,"updatedAt: 0")])],-1))])])]),e[26]||(e[26]=n("h3",null,"Step 2: 在 Cloudflare 上部署一個服務來刷新 Token",-1)),e[27]||(e[27]=n("p",null," Threads API 授權流程需要一個長效的Token。Cloudflare 是一個快速且免費的託管平台，非常適合用來處理這個登入流程。 ",-1)),n("ul",null,[e[11]||(e[11]=n("li",null,[n("p",null,[t(" 參考"),n("a",{href:"/threads-automation/access-threads-api"},"上一篇"),t("的 deployment 流程，將response貼在secrets column裡面 ")])],-1)),e[12]||(e[12]=n("li",null,[n("p",null,[t(" 由於App Script用來送request的"),n("code",null,"UrlFetchApp"),t("不接受太長的URL，於是我們使用一個proxy endpoint幫忙轉向： ")]),n("pre",null,[n("code",null,`// /server/api/threads/refresh.ts
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const { access_token, user_id } = await readBody(event);
  if (!access_token || !user_id) {
    return { success: false, error: "Missing access_token or user_id." };
  }

  const params = new URLSearchParams();
  params.append("grant_type", "th_refresh_token");
  params.append("access_token", access_token);

  const requestUrl = \`https://graph.threads.net/refresh_access_token?\${params.toString()}\`;

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
`)])],-1)),n("li",null,[n("p",null,[e[9]||(e[9]=t(" 參考用實作",-1)),n("a",c,[e[8]||(e[8]=t("連結",-1)),n("span",null,[r(s,{name:"uil:arrow-up-right",class:""})])]),e[10]||(e[10]=t("。 ",-1))])])]),e[28]||(e[28]=n("hr",null,null,-1)),e[29]||(e[29]=n("h3",null,"Step 3: 使用 Google Apps Script 自動更新 Token",-1)),e[30]||(e[30]=n("p",null," Threads 的 Token 會過期，因此你需要一個定時任務來自動刷新它。Google Apps Script 是個免費且可靠的選擇，可以設定定時觸發器。 ",-1)),n("ul",null,[n("li",null,[e[17]||(e[17]=n("p",null,"在 Google Apps Script 貼上參考用的 scripts:",-1)),n("ul",null,[n("li",null,[e[14]||(e[14]=t(" 用來操作sheet跟record更新的",-1)),n("a",S,[e[13]||(e[13]=t("sheet.js",-1)),n("span",null,[r(s,{name:"uil:arrow-up-right",class:""})])])]),n("li",null,[e[16]||(e[16]=t(" 用來操作threads相關內容的",-1)),n("a",v,[e[15]||(e[15]=t("threads.js",-1)),n("span",null,[r(s,{name:"uil:arrow-up-right",class:""})])])])])]),e[18]||(e[18]=d(`<li data-v-3f4e408d><p data-v-3f4e408d>主要刷新用的 function refreshToken()，一些小細節分享：</p><ul data-v-3f4e408d><li data-v-3f4e408d>domain可以改成你的Cloudflare service domain:</li><li data-v-3f4e408d>目前設定是8小時更新一次，最後一次更新時間會寫回<code data-v-3f4e408d>updatedAt</code></li><li data-v-3f4e408d>得到新的token會寫回<code data-v-3f4e408d>secrets</code></li></ul><pre data-v-3f4e408d><code data-v-3f4e408d>function refreshToken() {
  const domain = loadEnv()[&quot;CLOUDFLARE&quot;];
  const threadSecrets = readRows(&quot;secrets&quot;).find((value) =&gt; {
    return value[&quot;id&quot;] == &quot;threads-user&quot;;
  });
  const now = new Date().getTime();
  const eightHoursInMilliseconds = 8 * 60 * 60 * 1000;
  if (now - threadSecrets.updatedAt &gt; eightHoursInMilliseconds) {
    const options = {
      method: &quot;post&quot;,
      contentType: &quot;application/json&quot;,
      payload: JSON.stringify(JSON.parse(threadSecrets.secrets)),
    };
    const url = \`\${domain}api/threads/auth/refresh-token\`;
    try {
      const response = UrlFetchApp.fetch(url, options);
      const responseContent = response.getContentText();
      const responseData = JSON.parse(responseContent);
      const responseCode = response.getResponseCode();
      if (responseCode === 200) {
        console.log(JSON.stringify(responseData));
        threadSecrets.secrets = JSON.stringify(responseData);
        threadSecrets.updatedAt = now;
        updateForRecord(&quot;secrets&quot;, threadSecrets._row_index, threadSecrets);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
</code></pre></li><li data-v-3f4e408d><p data-v-3f4e408d>更新 main.gs，內容如下：</p><pre data-v-3f4e408d><code data-v-3f4e408d>function main() {
  threadMain()
}
</code></pre></li><li data-v-3f4e408d><p data-v-3f4e408d> 設定定時觸發器：在 Google Apps Script 專案的側邊欄中，點擊「觸發器」，新增一個觸發器來執行 main 函式，例如設定為15分鐘執行一次。 <img src="`+g+'" alt="Trigger" data-v-3f4e408d></p></li>',3))]),e[31]||(e[31]=n("hr",null,null,-1)),e[32]||(e[32]=n("p",null," 透過這幾個步驟，你就建立了一個完整的自動化流程。現在，你的應用程式可以持續與 Threads API 交換 Token，而無需你頻繁手動介入。 ",-1))],64)}const y=u(k,[["render",b],["__scopeId","data-v-3f4e408d"]]);export{y as default};
