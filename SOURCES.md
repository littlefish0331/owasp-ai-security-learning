# 參考資料來源總表 / Sources

本教材是**非官方學習整理，非 OWASP 發布，內容以官方文件為準**。這份清單列出教材所依據的一手來源（官方文件與專案），讓你可以直接回到原文。逐頁的「本章來源」與每個主題的「參考資料」頁（`references.html`）有更細的版本、日期與取捨說明。

- 讀取日：2026-10-26。OWASP 的文件會持續更新，Cheat Sheet 系列沒有版本號，請以官方現況為準。
- 版本或日期衝突時，本教材一律採最新者，並在各主題的參考資料頁寫明；無法判斷時標示「未能確認」。
- 授權欄是來源頁面的標示，不是本教材的判斷；本教材自己的授權見 [LICENSE](LICENSE)。

## 官方入口

| 名稱 | 網址 |
|---|---|
| OWASP GenAI Security Project | <https://genai.owasp.org/> |
| OWASP GenAI Security Project（GitHub 組織） | <https://github.com/GenAI-Security-Project> |
| OWASP AI Exchange | <https://owaspai.org/> |
| OWASP Cheat Sheet Series | <https://cheatsheetseries.owasp.org/> |
| OWASP 專案清單 | <https://owasp.org/projects/> |

## 依教材階段整理

### 01 總覽

| 主題 | 主要來源 | 授權（來源標示） |
|---|---|---|
| OWASP AI Exchange | <https://owaspai.org/>、<https://github.com/OWASP/www-project-ai-security-and-privacy-guide>（儲存庫沿用舊名 AI Security and Privacy Guide） | CC0 1.0 |
| GenAI Security Project 架構 | <https://genai.owasp.org/introduction-genai-security-project/>、<https://genai.owasp.org/initiatives/>、Solutions Landscape 各 PDF | CC BY-SA 4.0 |

### 02 LLM 應用

| 主題 | 主要來源 | 授權 |
|---|---|---|
| Top 10 for LLM Applications 2026 | <https://github.com/GenAI-Security-Project/GenAI-LLM-Top10>（`2026/`）、<https://genai.owasp.org/llm-top-10/> | CC BY-SA 4.0 |

### 03 提示詞注入與 RAG 實作

| 主題 | 主要來源 | 授權 |
|---|---|---|
| 提示詞注入防護 | <https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html> | CC BY-SA 4.0 |
| RAG 安全 | <https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html> | CC BY-SA 4.0 |
| 動手練習 | <https://github.com/OWASP/www-project-promptme>（Apache-2.0）、<https://github.com/OWASP/PwnzzAI>（GPL-3.0）、<https://github.com/GenAI-Security-Project/finbot-ctf>（README 寫 Apache-2.0，GitHub 偵測值為 NOASSERTION） | 如左；本教材只引用名稱與描述，未複製程式碼或解法 |

### 04 Agentic 與 MCP

| 主題 | 主要來源 | 授權 |
|---|---|---|
| Agentic 威脅與緩解 | Agentic AI – Threats and Mitigations、Multi-Agentic System Threat Modeling Guide（<https://genai.owasp.org/initiatives/agentic-security-initiative/>） | CC BY-SA 4.0 |
| Top 10 for Agentic Applications 2026 | <https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/> | CC BY-SA 4.0 |
| 保護 Agentic 應用指南 | <https://genai.owasp.org/resource/securing-agentic-applications-guide-1-0/> | CC BY-SA 4.0 |
| MCP 安全 | MCP Top 10（<https://owasp.org/www-project-mcp-top-10/>）、MCP 伺服器開發指南、第三方 MCP 使用 Cheat Sheet、MCP Security Cheat Sheet | MCP Top 10 來源標示自相矛盾，**本教材保守視為非商業（NC）**，只引用名稱、編號與簡短描述；其餘 CC BY-SA 4.0 |
| AI Agent Security Cheat Sheet | <https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html>、<https://cheatsheetseries.owasp.org/cheatsheets/Verifying_Third_Party_Agent_Execution_Evidence_Cheat_Sheet.html> | CC BY-SA 4.0（站台標示） |

### 05 治理與風險

| 主題 | 主要來源 | 授權 |
|---|---|---|
| 治理檢核表與卓越中心 | LLM Applications Cybersecurity and Governance Checklist、Center of Excellence Guide（<https://genai.owasp.org/initiatives/ai-security-governance-and-adoption/>） | CC BY-SA 4.0 |
| Threat Defense COMPASS | <https://genai.owasp.org/resource/owasp-genai-security-project-threat-defense-compass-1-0/> | CC BY-SA 4.0 |
| Agentic 安全與治理現況 | <https://genai.owasp.org/resource/state-of-agentic-ai-security-and-governance/> | CC BY-SA 4.0 |
| 框架對照與標準 | <https://github.com/GenAI-Security-Project/crosswalk>、AI Exchange 的標準章節 | CC BY-SA 4.0 / CC0 1.0 |
| AI 成熟度評估（AIMA） | <https://owasp.org/www-project-ai-maturity-assessment/> | CC BY-SA 4.0（儲存庫 LICENSE.md） |

### 06 評估與驗證

| 主題 | 主要來源 | 授權 |
|---|---|---|
| GenAI 紅隊演練 | <https://genai.owasp.org/initiatives/ai-red-teaming-initiative/> | CC BY-SA 4.0 |
| AI Testing Guide | <https://github.com/OWASP/www-project-ai-testing-guide> | CC BY-SA 4.0（儲存庫 LICENSE.md） |
| AISVS 與 LLMSVS | <https://github.com/OWASP/AISVS>、<https://github.com/OWASP/www-project-llm-verification-standard> | CC BY-SA 4.0 |
| AIVSS | <https://aivss.owasp.org/> | CC BY-SA 4.0（網站標示；規格與儲存庫的授權部分未能確認，見該主題參考資料頁） |

### 07 延伸主題

| 主題 | 主要來源 | 授權 |
|---|---|---|
| Machine Learning Security Top 10 | <https://owasp.github.io/www-project-machine-learning-security-top-10/index.html>（owasp.org 的舊網址目前失效） | CC BY-SA 4.0 |
| 資料安全 | Data Security Risks and Mitigations 2026（<https://genai.owasp.org/resource/owasp-genai-data-security-risks-mitigations-2026/>） | CC BY-SA 4.0 |
| Agentic Skills Top 10 | <https://owasp.org/www-project-agentic-skills-top-10/> | CC BY-SA 4.0 |
| Agent Control Standard | <https://github.com/GenAI-Security-Project/agent-control-standard> | 規格 Apache-2.0、文件 CC BY-SA 4.0 |
| AIBOM | <https://genai.owasp.org/resource/owasp-aibom-generator/> | 儲存庫 Apache-2.0 |
| 事件應變與 Deepfake | <https://genai.owasp.org/resource/genai-incident-response-guide-1-0/>、<https://genai.owasp.org/resource/guide-for-preparing-and-responding-to-deepfake-events/> | CC BY-SA 4.0 |
| Secure Coding with AI | <https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html>、<https://cheatsheetseries.owasp.org/cheatsheets/Secure_AI_Model_Ops_Cheat_Sheet.html> | CC BY-SA 4.0（站台標示） |
| 受管制領域的 AI 安全 | <https://cheatsheetseries.owasp.org/cheatsheets/AI-Powered_Advertising_Systems_Security_Cheat_Sheet.html>、<https://cheatsheetseries.owasp.org/cheatsheets/AML_Sanctions_AI_Agent_Payments_Cheat_Sheet.html> | CC BY-SA 4.0（站台標示） |

## 沒有做成主題的 OWASP AI 相關專案

下列專案在調查時確認存在，但本教材**沒有**做成主題，需要時請自行回官方查證（它們的狀態與授權可能不同，部分仍在早期階段）：

- OWASP MCP Governance and Risk Project、MCP Security Testing Guide、MCP Taxonomy、MCP Threat Modeling、MCP Verification Standard（<https://github.com/OWASP>）
- OWASP Agent Memory Guard（<https://owasp.org/www-project-agent-memory-guard/>）
- OWASP Agent Observability Standard（<https://github.com/OWASP/www-project-agent-observability-standard>）
- OWASP Top 10 Neocloud and AI Data Center Security Risks（FORGE；CC BY-NC-SA 4.0，是否為正式專案未能確認）
- Agent Name Service（ANS）、Insecure Agent Samples、Agentic Threats Navigator

## 授權的提醒

- 本教材以自己的話整理，不逐字大段複製官方文字；短引用都標示來源。
- 來源若為非商業（NC）授權，相關頁面會有「NC 授權」標籤。
- 此清單是依 2026-10-26 讀到的內容整理，**不是法律意見**。要再利用或再散布教材內容時，請自行確認各來源的現行授權。
- 網址以官方現況為準；若發現失效的連結，歡迎開 issue 告知。
