# tools/ — 驗證與維護腳本

這裡的腳本**只讀專案、不改教材內容**，都不依賴特定主題名稱：主題清單一律從 `assets/sitemap.js` 讀取，所以新增主題後不必改腳本。腳本本身**不是教材**，也不會被教材頁面載入；教材仍然是純 HTML／CSS／JS，雙擊 `file://` 即可使用。

## 執行環境

- Python 3.12+（只用標準庫）、Node 20+（只用內建模組）。沒有 `npm install`、沒有 build。
- Windows 上 Python 一律用 `python -I -X utf8 …`：`-I` 避免被當前目錄的同名模組劫持，`-X utf8` 避免 cp950 主控台輸出中文時出錯（`-I` 會忽略 `PYTHONIOENCODING`，所以要用 `-X`）。
- 從專案根目錄執行（路徑在腳本內自行解析，從哪裡執行都可以，但文件範例都以根目錄為準）。

## 一、靜態檢查（不需要瀏覽器；每次修改教材後都要跑）

```bash
python -I -X utf8 tools/check_all.py        # 一次跑完下面四項；有任何失敗結束碼為 1
```

| 腳本 | 檢查什麼 | 失敗的意思 |
|---|---|---|
| `check_links.py` | 內部連結、錨點、資源路徑；`sitemap.js` 登記的頁面都存在、主題資料夾裡的 html 都有登記；每頁 `data-root` 正確 | 有壞連結／漏登記。**修教材，不要改腳本** |
| `check_pages.py` | 每頁有 `lang="zh-Hant"`、非官方聲明、頁尾授權行、「來源」區塊、單一 h1、標題不跳級、圖有說明與 `data-alt`、標籤成對；術語格式（半形括弧、括弧前有空格） | 缺必備元素或格式不符。`PRODUCT_NAMES` 是刻意的人工清單，新產品名可加進去 |
| `check_quiz.js` | 題數與 `sitemap.js` 的 `quizTotal` 一致；三種題型；每個學習目標 ≥ 2 題；題目標的 `lo` 都有在測驗頁定義；至少一半是應用／判斷；每題恰一個正解且選項都有解析；章末 3–5 題；題目的「教材段落」連結有效；正解位置分佈 | 題庫結構問題 |
| `check_app_boot.js` | 以「假 DOM」載入 `app.js`：每個 available 主題的每一頁能啟動、目錄／麵包屑／上下頁正確、`localStorage` 全丟例外時也能啟動；首頁地圖列出 01–07 | 共用 JS 壞了（通常是改 `app.js`／`sitemap.js` 造成）。**假 DOM 不會解析 HTML，不能證明版面或互動正確** |

提示類（不算失敗，需要人判斷）：

```bash
python -I -X utf8 tools/reading_time.py            # 章節閱讀時間估算；> 8 分鐘就考慮拆章
python -I -X utf8 tools/check_quiz_terms.py [id]   # 題目用到的詞是否出現在「題目連結的章節」
python -I -X utf8 tools/check_reading_order.py     # 各主題首頁「前置知識」連到的主題，是否排在它前面（以 sitemap.js 的順序為準）
```

- `check_quiz_terms.py` 的旗標多半是題目自己的措辭；但若旗標的是**名稱、編號、事實**，代表教材沒教過，要補進對應章節（題目不得出現教材沒教過的事實）。
- `check_reading_order.py`：結束碼 1＝有前置知識指向排在後面的主題（學習路徑自相矛盾）。若前置只是建議，改前置知識文字；若確實需要，調整 `sitemap.js` 的主題順序。它**不會**驗證「接下來讀什麼」。

### 多人同時修改時：在暫存副本上檢查

```bash
python -I -X utf8 tools/stage_check.py                                   # 複製專案到暫存資料夾，移除未登記的主題資料夾，跑 check_all.py
python -I -X utf8 tools/stage_check.py --add-topic 07-extended=<區塊檔>  # 在副本的 sitemap.js 登記你的新主題後再跑
python -I -X utf8 tools/stage_check.py --keep                            # 保留副本並印出路徑（可在副本裡跑 reading_time／check_quiz_terms）
```

`stage_check.py` 不改動專案本身。用途是別人正在寫的半成品資料夾不會讓你的檢查失敗。`--add-topic` 會把區塊插在該階段最前面，所以副本上的 `check_reading_order.py` 可能報「前置知識指向後面的主題」，那是插入位置造成的；正式登記要放在你想要的位置。

## 二、瀏覽器實測（Playwright；每次新增或大幅修改主題後做）

靜態檢查不會執行頁面，所以 Mermaid 繪圖、點選互動、深色模式、手機寬度要用瀏覽器測。專案根目錄的 `.mcp.json` 是 Playwright MCP 的設定範例（`--isolated --allow-unrestricted-file-access`）；設定檔修改後要重啟 MCP 才會生效。

### 1. 啟動測試伺服器

```bash
python -I tools/serve.py 8765        # 只綁 127.0.0.1；Cache-Control: no-store
```

**必須用 `tools/serve.py`，不要用 `python -m http.server`**：後者允許瀏覽器快取 CSS／JS，改了 `style.css` 之後會一直看到舊版。測完要停掉；同時有多人測試時，各用不同的埠（例如 8766、8767），啟動後記下 pid（`netstat -ano | findstr :8765`），只停自己的。

### 2. 逐項檢查

| # | 項目 | 怎麼做 | 通過標準 |
|---|---|---|---|
| 1 | 載入無錯誤 | 監聽 `console`（error）、`pageerror`、`requestfailed`、`response ≥ 400`，逐頁 `goto` | 全部為空 |
| 2 | Mermaid | 每頁 `pre.mermaid` 數量 vs 其中含 `svg` 的數量；`.diagram-fallback` 數量 | 兩者相等、fallback 為 0 |
| 3 | 選擇題 | 選一個選項 → `.q-result`、`li.is-correct/.is-wrong/.is-other`、`.opt-why` 顯示、輸入鎖定 | 對錯與解析顯示 |
| 4 | 配對題 | 未選完就提交 → `.m-warn`；選滿提交 → 逐項 `li.is-correct/.is-wrong`、選單鎖定 | 有警示；逐項對錯 |
| 5 | 總測驗 | 全部作答 → 按 `#btn-report` → 分數、各 LO 掌握度、答錯題連結；`localStorage['owaspai-learning:v1'].quiz` 有 `byLO` | 數字與作答一致；連結指向有效錨點 |
| 6 | 深色／外觀 | `page.emulateMedia({colorScheme:'dark'})` 讀 `body` 背景色；點 `#theme-btn` 看 `data-theme` | 背景變深；切換有效；Mermaid 仍在 |
| 7 | 手機寬度 | `setViewportSize({width:390,height:800})`，逐頁 `scrollWidth ≤ clientWidth`；點 `#nav-toggle` 開目錄 | 無水平捲動（表格與圖可在自己的容器內捲） |
| 8 | 圖的可讀性 | 量每張圖的「有效字級」＝字級 × 實際寬度 ÷ viewBox 寬度，並實際看截圖 | 桌面寬度建議 ≥ 6px；轉譯成功不等於看得清楚 |

**測深色模式前**，先清掉 `localStorage['owaspai-learning:v1'].pref.theme`：先前點過 `#theme-btn` 會把偏好存起來，之後即使 `emulateMedia` 設成 dark，頁面仍是淺色，看起來像深色模式壞了。

### 3. 截圖與快照

- Playwright MCP 只能寫入專案根目錄或 `.playwright-mcp/` 之內；一律存到 `.playwright-mcp/screenshots/`。整個 `.playwright-mcp/` 已被 `.gitignore` 排除，不進版控。
- 截圖用完即丟，不要存在專案根目錄。多人同時測試時，只刪自己產生的檔案。

### 4. `file://`

教材要求「雙擊 `file://` 開啟就能用」，所以除了 `http://` 也要用 `file:///…/index.html` 跑一遍上表 1–5（`file://` 的 `localStorage` 行為與 `http` 不同）。若 Playwright 回 `Access to "file:" protocol is blocked`，代表設定沒生效，回報「`file://` 未實測」，不要拿 localhost 的結果代替。

## 三、使用規則

1. **不要宣稱沒跑過的事已驗證。** 回報要逐項寫「實測了什麼／沒實測什麼」。
2. 腳本找出的問題，**修教材**；除非腳本本身誤判（例如產品名清單），才改腳本，並在 commit 訊息說明原因。
3. 腳本不寫入專案。要產生暫存檔，放系統暫存資料夾。
4. 下載的官方 PDF／網頁快照**不要放進專案**（授權各異、體積大、可由 URL 重新取得）；放系統暫存資料夾，各用一個新的空資料夾，並用 `python -I` 讀取。
5. 新增腳本前先確認不是重複；新增後更新本 README 的表。
6. **改了檢查腳本，要證明它「真的會失敗」。** 全部 PASS 不代表檢查有效（可能根本沒檢查到）。做法：把專案複製到系統暫存資料夾（不要在專案內改），一次只對一個有效檔案注入一個錯誤，**先確認檔案內容真的變了**，再跑對應腳本，預期結束碼 ≠ 0；測完還原並確認 `check_all.py` 回到 0。常用的注入：多一個 `correct: true`、刪掉某選項的 `why`、移除非官方聲明、`<p>` 前塞入 `提示詞注入（Prompt Injection）`、拿掉 `data-alt`、加一個壞連結／壞錨點、`data-root` 改錯、`app.js` 加語法錯誤。注入 `correct: true` 時要注入到原本**不是**正解的選項，否則物件字面量重複屬性不會改變語意，看起來像「沒抓到」。
