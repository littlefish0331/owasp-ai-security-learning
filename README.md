# OWASP AI 資安學習教材

> 把 OWASP 的 AI 資安資源整理成一套可自學的中文網站：給**熟悉 AI 與軟體開發、但對資安較陌生**的工程師。
> 重點是**知識整合**：不是堆名詞定義，而是讓你知道「遇到某個情況時，該查哪份文件、採哪類控制」。

**本教材為非官方學習整理，非 OWASP 發布，內容以官方文件為準。**

- 線上閱讀：<https://littlefish0331.github.io/owasp-ai-security-learning/>（GitHub Pages）
- 本機閱讀：下載或 clone 後，**雙擊 `index.html` 即可**（不需要伺服器、不需要安裝任何東西、離線可用）。

## 內容

28 個主題、七個階段、213 頁，依建議閱讀順序排列（首頁有學習地圖與各主題的學習目標）：

| 階段 | 範圍 |
|---|---|
| 前置 | 資安前置觀念（給開發者）：用開發者熟悉的類比說明威脅建模、信任邊界、最小權限、縱深防禦等 |
| 01 總覽 | OWASP AI Exchange、GenAI Security Project 架構 |
| 02 LLM 應用 | Top 10 for LLM Applications 2026 與版本演進 |
| 03 提示詞注入與 RAG 實作 | 提示詞注入防護、RAG 安全、動手練習 |
| 04 Agentic 與 MCP | Agentic 威脅與緩解、Top 10 for Agentic Applications 2026、保護 Agentic 應用、MCP 安全、AI Agent Security Cheat Sheet |
| 05 治理與風險 | 治理檢核表與卓越中心、COMPASS、Agentic 安全與治理現況、框架對照與標準、AI 成熟度評估 |
| 06 評估與驗證 | GenAI 紅隊演練、AI Testing Guide、AISVS 與 LLMSVS、AIVSS |
| 07 延伸主題 | ML Security Top 10、資料安全、Agentic Skills Top 10、Agent Control Standard、AIBOM、事件應變與 Deepfake、Secure Coding with AI、受管制領域的 AI 安全 |

每個主題包含：學習目標與預估時間、一頁式全貌、核心概念逐項講解（是什麼 → 為什麼會發生 → 怎麼被利用 → 怎麼防 → 常見誤解）、表格比較、Mermaid 流程圖、虛構情境、跨文件整合、**章末檢核與總測驗**（選擇題＋即時回饋、情境判斷題、配對題；成績與各學習目標掌握度存在你自己的瀏覽器）、參考資料與來源核對。另有累積式**詞彙表**（中英對照、標示暫譯）。

## 標示約定

- `官方`：內容來自 OWASP 文件。
- `作者整理，非官方`：類比、歸類或結論是教材作者的推論。
- `虛構`：情境中的公司與系統是虛構的。
- `NC 授權`：來源採非商業授權。
- 「未能確認」：查不到可靠依據的項目，教材不替官方補答案。

版本或日期衝突時，教材**一律採最新者**，並在各主題的「參考資料」頁寫明；無法判斷時標示「未能確認」。內容截至 **2026-10-26**；OWASP 的文件會持續更新，請以官方為準。

## 作者

由 **Youjun** 與 **Claude Code**（Anthropic）合力完成。

## 授權

- 教材文字、表格、圖說、測驗與詞彙表：**CC BY-SA 4.0**。
- 自行撰寫的程式碼（`assets/app.js`、`assets/sitemap.js`、`assets/style.css`、`tools/`）：**MIT**。
- Mermaid（`assets/vendor/`）：MIT，授權見 [`assets/vendor/mermaid.LICENSE.txt`](assets/vendor/mermaid.LICENSE.txt)。

完整說明見 [LICENSE](LICENSE)。教材引用與改寫自多份 OWASP 文件，各自有授權（多數 CC BY-SA 4.0、AI Exchange 為 CC0 1.0、MCP Top 10 因標示矛盾而保守視為非商業），逐頁頁尾與各主題參考資料頁有列出，**以來源頁面標示為準**。以上不是法律意見。

## 參考資料

所有一手來源（官方文件、專案、儲存庫）的網址、版本與授權，見 [SOURCES.md](SOURCES.md)。

## 技術說明

- 純 HTML／CSS／JavaScript，沒有框架、沒有 build 步驟、沒有外部執行期依賴；圖表使用本地的 Mermaid 副本。
- 導覽、測驗與進度由 `assets/app.js` 與 `assets/sitemap.js` 提供；進度存在瀏覽器的 `localStorage`，無法使用時不影響閱讀與測驗。
- 支援淺色／深色、字級調整、手機寬度與列印。
- 連結一律用相對路徑，因此本機 `file://` 與 GitHub Pages 的子路徑（`/<repo>/`）都能用。

## 回報問題

發現內容與官方文件不符、連結失效或錯字，請開 issue，並附上頁面與段落。這是非官方整理，**以官方文件為準**。
