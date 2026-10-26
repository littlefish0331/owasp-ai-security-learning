"""共用小工具：找出專案根目錄、列出主題、讀 sitemap.js 的登記資料。

設計原則：
- 只用 Python 標準庫；不連網；不寫入專案內容（只讀）。
- 不寫死主題名稱：由 assets/sitemap.js 取得 status == "available" 的主題，
  新增主題後這些腳本不需要修改。
- 執行方式：python -I -X utf8 tools/<script>.py [參數]
  （-I 隔離模式避免被當前目錄的同名模組劫持；-X utf8 避免 Windows cp950 輸出錯誤）
"""
import os
import re
import sys


def project_root():
    """tools/ 的上一層就是專案根目錄。"""
    return os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def html_pages(root):
    """專案內所有教材 HTML（排除 vendor 與隱藏資料夾）。"""
    out = []
    for dp, dn, fn in os.walk(root):
        dn[:] = [d for d in dn if not d.startswith('.') and d not in ('vendor', 'tools', 'node_modules')]
        for f in fn:
            if f.endswith('.html'):
                out.append(os.path.join(dp, f))
    return sorted(out)


def available_topics(root):
    """解析 assets/sitemap.js，回傳 [{stage_dir, id, title, pages:[{file,kind}], quiz_total}]。

    sitemap.js 的格式固定（見檔頭註解）：每個階段有 dir，每個主題有 id/status/pages。
    這裡用逐行掃描而非執行 JS，以維持「只用標準庫」。
    """
    text = read(os.path.join(root, 'assets', 'sitemap.js'))
    topics = []
    stage_dir = None
    cur = None
    in_pages = False
    for line in text.split('\n'):
        m = re.search(r'dir:\s*"([^"]+)"', line)
        if m:
            stage_dir = m.group(1)
        m = re.search(r'id:\s*"([a-z0-9\-]+)",\s*title:\s*"([^"]+)",\s*status:\s*"(available|planned)"', line)
        if m:
            cur = {'stage_dir': stage_dir, 'id': m.group(1), 'title': m.group(2),
                   'status': m.group(3), 'pages': [], 'quiz_total': None}
            topics.append(cur)
            in_pages = False
            continue
        if cur is None:
            continue
        m = re.search(r'quizTotal:\s*(\d+)', line)
        if m:
            cur['quiz_total'] = int(m.group(1))
        if re.search(r'\bpages:\s*\[', line):
            in_pages = True
        m = re.search(r'\{\s*file:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*kind:\s*"([^"]+)"', line)
        if m and in_pages:
            cur['pages'].append({'file': m.group(1), 'title': m.group(2), 'kind': m.group(3)})
    return [t for t in topics if t['status'] == 'available']


def topic_dir(root, topic):
    return os.path.join(root, topic['stage_dir'], topic['id'])


def die(msg, code=2):
    print(msg, file=sys.stderr)
    sys.exit(code)
