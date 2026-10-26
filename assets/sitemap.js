/* sitemap.js — 全站主題與頁面登記表
   規則：新增主題時，只在這裡「新增 / 登記」，不要改動既有主題的檔案。
   - status: "available" 才會出現頁面清單；"planned" 只顯示為規劃中。
   - 主題頁面路徑 = stage.dir + "/" + topic.id + "/" + page.file
   - 共用頁面（shared）位於專案根目錄。
   - quizTotal：該主題「總測驗」題數，供首頁／主題首頁顯示進度。 */
window.OWASP_SITE = {
  siteTitle: "OWASP AI 資安學習教材",
  subtitle: "非官方學習整理・以官方文件為準",
  author: "Youjun 與 Claude Code 合力完成",
  updated: "內容截至 2026-10-26",
  shared: [
    { file: "index.html", title: "首頁・學習地圖" },
    { file: "primer-security-for-developers.html", title: "資安前置觀念（給開發者）" },
    { file: "glossary.html", title: "詞彙表" }
  ],
  stages: [
    {
      id: "01", dir: "01-overview", title: "總覽",
      desc: "先建立全貌：OWASP 的 AI 資安資源各管什麼、怎麼組織。",
      topics: [
        {
          id: "ai-exchange", title: "OWASP AI Exchange", status: "available",
          summary: "涵蓋所有 AI 的威脅、控制與風險分析知識庫（含舊名 AI Security and Privacy Guide）。",
          quizTotal: 16,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-threat-map.html", title: "第 2 章　威脅地圖", kind: "chapter" },
            { file: "03-control-map.html", title: "第 3 章　控制地圖", kind: "chapter" },
            { file: "04-seven-layers.html", title: "第 4 章　縱深防禦：提示詞注入七層防線", kind: "chapter" },
            { file: "05-agentic-genai.html", title: "第 5 章　GenAI 與 Agentic AI", kind: "chapter" },
            { file: "06-rag.html", title: "第 6 章　RAG 系統", kind: "chapter" },
            { file: "07-risk-analysis.html", title: "第 7 章　風險分析", kind: "chapter" },
            { file: "08-integration.html", title: "第 8 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "genai-security-project", title: "GenAI Security Project 架構", status: "available",
          summary: "專案總傘、治理與八個 Initiatives，以及 Solutions Landscape（工具目錄與 SecOps 九階段）。",
          quizTotal: 15,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-governance.html", title: "第 2 章　治理與組織", kind: "chapter" },
            { file: "03-initiatives.html", title: "第 3 章　八個 Initiatives 與產出地圖", kind: "chapter" },
            { file: "04-landscape.html", title: "第 4 章　Solutions Landscape", kind: "chapter" },
            { file: "05-integration.html", title: "第 5 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        }
      ]
    },
    {
      id: "02", dir: "02-llm-applications", title: "LLM 應用",
      desc: "LLM 應用最關鍵的風險清單與版本演進。",
      topics: [
        {
          id: "llm-top-10", title: "Top 10 for LLM Applications 2026", status: "available",
          summary: "2026 版十項風險（入口、放大器、衝擊三層）、各項控制的限制，以及 2023/24→2025→2026 的版本演進。",
          quizTotal: 18,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與方法論", kind: "chapter" },
            { file: "02-prompt-injection.html", title: "第 2 章　LLM01 提示詞注入", kind: "chapter" },
            { file: "03-supply-chain-poisoning.html", title: "第 3 章　LLM04 供應鏈與 LLM05 資料與模型投毒", kind: "chapter" },
            { file: "04-agency-output.html", title: "第 4 章　LLM03 過度授權與 LLM10 不當輸出處理", kind: "chapter" },
            { file: "05-context-vectors.html", title: "第 5 章　LLM08 隱藏上下文暴露與 LLM09 向量與嵌入弱點", kind: "chapter" },
            { file: "06-disclosure.html", title: "第 6 章　LLM02 敏感資訊外洩", kind: "chapter" },
            { file: "07-consumption-misinformation.html", title: "第 7 章　LLM06 無限制消耗與 LLM07 錯誤資訊", kind: "chapter" },
            { file: "08-evolution.html", title: "第 8 章　版本演進 2023、2025、2026", kind: "chapter" },
            { file: "09-scenarios.html", title: "第 9 章　情境演練", kind: "chapter" },
            { file: "10-integration.html", title: "第 10 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        }
      ]
    },
    {
      id: "03", dir: "03-prompt-injection-rag-practice", title: "提示詞注入與 RAG 實作",
      desc: "從條目走到可實作的防護與練習。",
      topics: [
        {
          id: "prompt-injection", title: "提示詞注入防護", status: "available",
          summary: "LLM01:2026 與 Prompt Injection Prevention Cheat Sheet：為什麼沒有根治法、哪些防線會被繞過、哪些架構控制能限縮後果。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-why-no-parameterized-query.html", title: "第 1 章　為什麼沒有參數化查詢：LLM01:2026 與攻擊面", kind: "chapter" },
            { file: "02-fragile-layers.html", title: "第 2 章　會被繞過的防線：篩選、結構化提示與護欄", kind: "chapter" },
            { file: "03-architectural-defense.html", title: "第 3 章　架構式防禦：工具邊界與限縮後果", kind: "chapter" },
            { file: "04-verify-and-integrate.html", title: "第 4 章　驗證、整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "rag-security", title: "RAG 安全", status: "available",
          summary: "RAG Security Cheat Sheet 與 LLM09:2026：RAG 管線的寫入端、讀取端與生成端各有哪些控制。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-pipeline-and-map.html", title: "第 1 章　RAG 管線與 Cheat Sheet 地圖", kind: "chapter" },
            { file: "02-write-side.html", title: "第 2 章　寫入端：文件投毒、嵌入操弄與攝入供應鏈", kind: "chapter" },
            { file: "03-read-side.html", title: "第 3 章　讀取端：存取控制繼承與隔離", kind: "chapter" },
            { file: "04-generate-and-integrate.html", title: "第 4 章　生成端、失效安全與整合", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "hands-on-labs", title: "動手練習", status: "available",
          summary: "PromptMe、PwnzzAI、FinBot CTF 的定位、版本、授權與安全使用，以及如何把練習接回防禦。",
          quizTotal: 12,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-three-labs.html", title: "第 1 章　三個練習專案的定位與安全使用", kind: "chapter" },
            { file: "02-learning-loop.html", title: "第 2 章　把練習接回防禦：學習迴圈與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        }
      ]
    },
    {
      id: "04", dir: "04-agentic-and-mcp", title: "Agentic 與 MCP",
      desc: "Agent 與 MCP 生態系的威脅與防護。",
      topics: [
        {
          id: "agentic-threats-and-mitigations", title: "Agentic 威脅與緩解", status: "available",
          summary: "Agentic AI – Threats and Mitigations 1.1 的 T1–T17 威脅分類與六個 Playbooks，加上用 MAESTRO 七層做多 Agent 威脅建模。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　定位與參考架構", kind: "chapter" },
            { file: "02-threat-taxonomy.html", title: "第 2 章　威脅分類與 Navigator", kind: "chapter" },
            { file: "03-playbooks.html", title: "第 3 章　緩解策略：六個 Playbooks", kind: "chapter" },
            { file: "04-multi-agent-integration.html", title: "第 4 章　多 Agent 威脅建模與整合收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "agentic-top-10-2026", title: "Top 10 for Agentic Applications 2026", status: "available",
          summary: "ASI01–ASI10 十項 agentic 風險：如何區分、怎麼防、與 LLM Top 10 2025／2026 編號的換算。",
          quizTotal: 15,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌、Least Agency 與十項地圖", kind: "chapter" },
            { file: "02-goal-tools-identity.html", title: "第 2 章　目標、工具與身分（ASI01–ASI03）", kind: "chapter" },
            { file: "03-supply-code-memory.html", title: "第 3 章　供應鏈、程式碼與記憶（ASI04–ASI06）", kind: "chapter" },
            { file: "04-comm-cascade-human-rogue.html", title: "第 4 章　通訊、連鎖、信任與流氓 Agent（ASI07–ASI10）", kind: "chapter" },
            { file: "05-integration.html", title: "第 5 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "securing-agentic-applications", title: "保護 Agentic 應用指南", status: "available",
          summary: "Securing Agentic Applications Guide 1.0：六類關鍵元件、生命週期控制、三種架構與高風險能力的控制，以及驗證與部署。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-components-attack-surface.html", title: "第 1 章　定位、元件與攻擊面", kind: "chapter" },
            { file: "02-lifecycle.html", title: "第 2 章　生命週期的控制：設計、建置、營運", kind: "chapter" },
            { file: "03-architectures-capabilities.html", title: "第 3 章　三種架構與高風險能力", kind: "chapter" },
            { file: "04-supply-assurance-hardening.html", title: "第 4 章　供應鏈、驗證、部署與整合", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "mcp-security", title: "MCP 安全", status: "available",
          summary: "MCP Top 10（Beta）、伺服器開發指南、第三方使用 Cheat Sheet 與 MCP Security Cheat Sheet：文件地圖、十項風險、開發者與使用者兩種視角。",
          quizTotal: 16,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-map-and-status.html", title: "第 1 章　MCP 文件地圖與成熟度", kind: "chapter" },
            { file: "02-top10-groups.html", title: "第 2 章　MCP Top 10 十項分組", kind: "chapter" },
            { file: "03-server-developer.html", title: "第 3 章　伺服器開發者視角", kind: "chapter" },
            { file: "04-third-party-user.html", title: "第 4 章　第三方使用者視角", kind: "chapter" },
            { file: "05-integration.html", title: "第 5 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "ai-agent-security-cheat-sheet", title: "AI Agent Security Cheat Sheet 與第三方執行證據驗證", status: "available",
          summary: "OWASP Cheat Sheet Series 的 AI Agent Security（13 項風險、九節最佳實務）與 Verifying Third-Party Agent Execution Evidence（六個問題）：限制 agent 能做什麼、看見與驗證、第三方執行紀錄能證明什麼。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌、定位與兩群控制", kind: "chapter" },
            { file: "02-restrict.html", title: "第 2 章　限制 agent 能做什麼", kind: "chapter" },
            { file: "03-see-and-test.html", title: "第 3 章　看見、驗證與測試", kind: "chapter" },
            { file: "04-third-party-evidence.html", title: "第 4 章　第三方執行證據怎麼驗", kind: "chapter" },
            { file: "05-integration.html", title: "第 5 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        }
      ]
    },
    {
      id: "05", dir: "05-governance-and-risk", title: "治理與風險",
      desc: "組織層級的治理、風險與標準對照。",
      topics: [
        {
          id: "governance-checklist-and-coe", title: "治理檢核表與卓越中心", status: "available",
          summary: "LLM Applications Cybersecurity and Governance Checklist 的 13 個區塊與 Center of Excellence Guide：導入前要想清楚什麼、由誰來做。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-checklist-strategy.html", title: "第 2 章　檢核表的前半：威脅與導入策略", kind: "chapter" },
            { file: "03-checklist-areas.html", title: "第 3 章　檢核表的 13 個區塊", kind: "chapter" },
            { file: "04-coe.html", title: "第 4 章　卓越中心 (CoE)", kind: "chapter" },
            { file: "05-integration.html", title: "第 5 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "threat-defense-compass", title: "Threat Defense COMPASS", status: "available",
          summary: "COMPASS 1.0 與 RunBook：以 OODA 循環和 5 分制可能性 × 衝擊，快速排出 AI 威脅的優先順序。",
          quizTotal: 13,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position-and-ooda.html", title: "第 1 章　全貌與定位：OODA 循環", kind: "chapter" },
            { file: "02-observe-orient.html", title: "第 2 章　觀察與定位：威脅檔案與評分", kind: "chapter" },
            { file: "03-decide-act.html", title: "第 3 章　決策、行動與兩個範例", kind: "chapter" },
            { file: "04-integration.html", title: "第 4 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "agentic-security-and-governance", title: "Agentic 安全與治理現況", status: "available",
          summary: "State of Agentic AI Security and Governance 2.01：agent 分類與威脅、安全與安全性的收斂、身分與供應鏈，以及採用層級 × 治理成熟度矩陣。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position-and-findings.html", title: "第 1 章　全貌與定位：三個主要發現", kind: "chapter" },
            { file: "02-taxonomy-and-threats.html", title: "第 2 章　Agent 分類與 2025–2026 威脅", kind: "chapter" },
            { file: "03-safety-security.html", title: "第 3 章　AI Safety 與 AI Security", kind: "chapter" },
            { file: "04-protocols-identity.html", title: "第 4 章　協定、Agent 身分與供應鏈", kind: "chapter" },
            { file: "05-maturity-model.html", title: "第 5 章　成熟度模型：採用層級 × 治理等級", kind: "chapter" },
            { file: "06-regulation-and-integration.html", title: "第 6 章　法規與跨文件整合", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "framework-crosswalk-and-standards", title: "框架對照與標準", status: "available",
          summary: "GenAI Security Industry Framework Crosswalk（51 個條目對映 26 個框架）與 AI Exchange 和各標準的關係：怎麼用、LLM 編號遷移、證據強度。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-crosswalk-position.html", title: "第 1 章　Crosswalk 的全貌與定位", kind: "chapter" },
            { file: "02-crosswalk-use.html", title: "第 2 章　怎麼用 Crosswalk：對照單位與編號遷移", kind: "chapter" },
            { file: "03-standards.html", title: "第 3 章　AI Exchange 與各標準的關係", kind: "chapter" },
            { file: "04-integration.html", title: "第 4 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "ai-maturity-assessment", title: "AI 成熟度評估（AIMA）", status: "available",
          summary: "OWASP AIMA V1.0：仿 SAMM 的 AI 成熟度模型（8 個領域、24 個實務、三級），用 Yes／No 問卷與「+」記分自評。",
          quizTotal: 13,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-domains.html", title: "第 2 章　八個領域與二十四個實務", kind: "chapter" },
            { file: "03-assessing.html", title: "第 3 章　怎麼做評估：級別、問卷與記分", kind: "chapter" },
            { file: "04-integration.html", title: "第 4 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        }
      ]
    },
    {
      id: "06", dir: "06-assessment-and-verification", title: "評估與驗證",
      desc: "紅隊、測試與驗證標準。",
      topics: [
        {
          id: "genai-red-teaming", title: "GenAI 紅隊演練", status: "available",
          summary: "Red Teaming Manual 的八階段、Guide 的概念與 Vendor Evaluation Criteria：怎麼判斷紅隊報告可不可靠、怎麼辨別只會越獄的廠商。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　三份文件與 AI 紅隊的定位", kind: "chapter" },
            { file: "02-phases-1-4.html", title: "第 2 章　階段 1–4：規劃到利用", kind: "chapter" },
            { file: "03-phases-5-8.html", title: "第 3 章　階段 5–8：持久化到修補", kind: "chapter" },
            { file: "04-vendor-evaluation.html", title: "第 4 章　評估紅隊廠商與工具", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "ai-testing-guide", title: "AI Testing Guide", status: "available",
          summary: "把 AI 威脅轉成 32 項可執行測試（應用、模型、基礎設施、資料四層），以及黑箱測試的限制。",
          quizTotal: 12,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　可信度測試與威脅驅動方法", kind: "chapter" },
            { file: "02-test-map.html", title: "第 2 章　四層 32 項測試地圖", kind: "chapter" },
            { file: "03-using-the-guide.html", title: "第 3 章　限制、黑灰白箱與跨文件整合", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "aisvs-and-llmsvs", title: "AISVS 與 LLMSVS", status: "available",
          summary: "把 AI／LLM 系統的安全要求寫成可驗證的需求：AISVS 1.01 的十二章、LLMSVS v2.0 的 V1–V8，以及怎麼選層級與蒐證。",
          quizTotal: 16,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-verification-standards.html", title: "第 1 章　驗證標準是什麼", kind: "chapter" },
            { file: "02-aisvs.html", title: "第 2 章　AISVS：十二章與版本", kind: "chapter" },
            { file: "03-llmsvs.html", title: "第 3 章　LLMSVS：V1–V8 與版本", kind: "chapter" },
            { file: "04-evidence-and-integration.html", title: "第 4 章　把需求變成驗證證據與跨文件整合", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "aivss", title: "AIVSS", status: "available",
          summary: "AI 弱點評分系統：為什麼 CVSS 不夠、並存的三套說法、v0.8 的十因子算式與 1.0 的查表模型，以及分數的正確解讀。",
          quizTotal: 12,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-why-aivss.html", title: "第 1 章　為什麼需要 AIVSS，以及三層版本", kind: "chapter" },
            { file: "02-scoring.html", title: "第 2 章　計分結構", kind: "chapter" },
            { file: "03-applying.html", title: "第 3 章　套用與限制", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        }
      ]
    },
    {
      id: "07", dir: "07-extended", title: "延伸主題",
      desc: "傳統 ML、資料、供應鏈、事件應變與其他。",
      topics: [
        {
          id: "ml-security-top-10", title: "Machine Learning Security Top 10", status: "available",
          summary: "傳統 ML 系統的十項風險（2023 edition，Version 0.3 Draft）：依生命週期分辨、官方建議的防禦主題，以及與 AI Exchange、LLM Top 10 2026 的對應。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-lifecycle-map.html", title: "第 2 章　十項風險地圖", kind: "chapter" },
            { file: "03-defenses-and-scenarios.html", title: "第 3 章　防禦與情境", kind: "chapter" },
            { file: "04-integration.html", title: "第 4 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "data-security", title: "資料安全", status: "available",
          summary: "Data Security Risks and Mitigations 2026（Version 1.0）：GenAI 的資料面、21 個 DSGAI 風險分六組、三層控制與 Buy／Build 標註，以及與 LLM Top 10 2026 的官方對照。",
          quizTotal: 16,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-data-surfaces.html", title: "第 2 章　GenAI 的資料面與 AI-DSPM", kind: "chapter" },
            { file: "03-dsgai-map.html", title: "第 3 章　21 個資料風險地圖", kind: "chapter" },
            { file: "04-tiers-and-scenarios.html", title: "第 4 章　三層控制與情境", kind: "chapter" },
            { file: "05-integration.html", title: "第 5 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "secure-coding-with-ai", title: "AI 輔助寫程式與模型營運安全", status: "available",
          summary: "Secure Coding with AI 與 Secure AI/ML Model Ops 兩份 Cheat Sheet：開發迴圈的信任邊界（依賴、間接提示詞注入、工具、沙箱、規則檔）、模型營運九節的生命週期排法，以及官方對應與作者整理的分界。",
          quizTotal: 15,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-dev-loop-trust.html", title: "第 2 章　開發迴圈的信任邊界", kind: "chapter" },
            { file: "03-tools-sandbox-rules.html", title: "第 3 章　工具、沙箱與規則檔", kind: "chapter" },
            { file: "04-model-ops.html", title: "第 4 章　模型營運的九節", kind: "chapter" },
            { file: "05-integration.html", title: "第 5 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "agentic-skills-top-10", title: "Agentic Skills Top 10", status: "available",
          summary: "Agent 技能層的十項風險（AST01–AST10；1.0-2026，白皮書 V1 公開審查中）：四個生態面向、歸類決策樹、官方建議的控制，以及編號對應的注意事項。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-ten-risks.html", title: "第 2 章　十項風險與歸類", kind: "chapter" },
            { file: "03-controls-and-scenarios.html", title: "第 3 章　防禦與情境", kind: "chapter" },
            { file: "04-integration.html", title: "第 4 章　跨文件整合與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "agent-control-standard", title: "Agent Control Standard", status: "available",
          summary: "Agent 執行期控制標準（規格 v0.1.0，早期）：Guardian 與鉤子、五種處置、失敗姿態（預設放行）與參考實作自述的缺口。",
          quizTotal: 12,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-guardian-and-hooks.html", title: "第 2 章　Guardian、鉤子與五種處置", kind: "chapter" },
            { file: "03-failure-posture.html", title: "第 3 章　失敗姿態與情境", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "aibom", title: "AIBOM", status: "available",
          summary: "OWASP AI SBOM Initiative 與 AIBOM Generator：工具範圍與版本現況、AI 物料清單要記什麼、與 DBOM、AgBOM、SBOM 的關係。",
          quizTotal: 12,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-why-and-what.html", title: "第 2 章　為什麼需要、要記什麼", kind: "chapter" },
            { file: "03-bom-family.html", title: "第 3 章　BOM 家族與整合", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        },
        {
          id: "incident-response-and-deepfake", title: "事件應變與 Deepfake", status: "available",
          summary: "GenAI Incident Response Guide 1.0 與 Deepfake 事件指南：什麼算 AI 事件與嚴重度矩陣、三種事件的應變、為什麼 deepfake 防線在流程而非辨識。",
          quizTotal: 14,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-ai-incidents.html", title: "第 2 章　什麼算 AI 事件、有多嚴重", kind: "chapter" },
            { file: "03-three-incidents.html", title: "第 3 章　三種事件的應變", kind: "chapter" },
            { file: "04-deepfake-and-integration.html", title: "第 4 章　Deepfake 與整合", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        }
,
        {
          id: "ai-in-regulated-industries", title: "受管制領域的 AI 安全", status: "available",
          summary: "OWASP Cheat Sheet Series 的兩份領域專用 AI 速查表：廣告系統（同意閘門、結果事件、供應鏈與生成內容出處）與 AML／制裁（身分先於篩查、失效即拒絕、簽署收據與名單新鮮度）；如何把通用控制翻譯到自己的領域。",
          quizTotal: 15,
          pages: [
            { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
            { file: "01-position.html", title: "第 1 章　全貌與定位", kind: "chapter" },
            { file: "02-advertising.html", title: "第 2 章　廣告系統：五道關卡", kind: "chapter" },
            { file: "03-aml-identity-and-failclosed.html", title: "第 3 章　AML 與制裁（上）：身分、篩查與失效即拒絕", kind: "chapter" },
            { file: "04-aml-receipt-and-freshness.html", title: "第 4 章　AML 與制裁（下）：收據與名單新鮮度", kind: "chapter" },
            { file: "05-integration.html", title: "第 5 章　共同模式與收尾", kind: "chapter" },
            { file: "quiz.html", title: "總測驗", kind: "quiz" },
            { file: "references.html", title: "參考資料與來源核對", kind: "reference" }
          ]
        }
      ]
    }
  ]
};
