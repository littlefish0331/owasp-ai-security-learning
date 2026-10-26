"""一次跑完所有「不需要瀏覽器」的靜態檢查，最後印出總表。

用法：python -I -X utf8 tools/check_all.py
結束碼：0 = 全部通過；1 = 有任何一項失敗。

涵蓋：連結與錨點與 sitemap 登記、每頁必備元素與格式、題庫完整性、共用 JS 啟動（假 DOM）。
不涵蓋：瀏覽器實測（Mermaid 繪圖、點選互動、深色、手機寬度、file://）— 見 tools/README.md。
閱讀量（reading_time.py）與題目用詞（check_quiz_terms.py）是「提示」類，不算失敗，另外單獨跑。
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
STEPS = [
    ('連結／錨點／sitemap', [sys.executable, '-I', '-X', 'utf8', os.path.join(HERE, 'check_links.py')]),
    ('頁面元素／格式', [sys.executable, '-I', '-X', 'utf8', os.path.join(HERE, 'check_pages.py')]),
    ('題庫完整性', ['node', os.path.join(HERE, 'check_quiz.js')]),
    ('共用 JS 啟動（假 DOM）', ['node', os.path.join(HERE, 'check_app_boot.js')]),
]

results = []
for name, cmd in STEPS:
    print(f'\n######## {name}')
    r = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    out = (r.stdout or '') + (r.stderr or '')
    # 只印尾端與所有失敗行，避免洗版
    lines = out.splitlines()
    shown = [l for l in lines if l.startswith(('FAIL', '  FAIL', 'MISSING', 'NOT REGISTERED', 'SITEMAP', 'data-root', 'EVAL')) or ' FAIL ' in l]
    for l in shown[:40]:
        print(l)
    print('\n'.join(lines[-4:]))
    results.append((name, r.returncode))

print('\n======== 總表')
bad = 0
for name, code in results:
    print(f'  {"PASS" if code == 0 else "FAIL"}  {name}')
    bad += code != 0
print('\n未涵蓋（需瀏覽器）：Mermaid 繪圖、點選互動、深色模式、手機寬度、file:// — 見 tools/README.md')
sys.exit(1 if bad else 0)
