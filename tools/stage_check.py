"""在「專案的暫存副本」上跑 tools/check_all.py，讓同時進行的工作不被別人未完成的內容干擾。

為什麼需要：多人同時工作時，專案根目錄會出現「還沒登記進 sitemap.js 的新主題資料夾」
或「別人寫到一半的頁面」，直接跑 check_all.py 會出現不屬於自己的失敗。這支腳本：
  1. 把專案複製到系統暫存資料夾（不含 .git、.playwright-mcp、__pycache__、.claude）；
  2. （可選）在副本的 sitemap.js 登記你的新主題（--add-topic），讓你自己的頁面也被檢查；
  3. 預設把副本裡「沒有登記在 sitemap.js 的主題資料夾」整個移除（--keep-unregistered 可關閉）；
  4. 在副本上執行 check_all.py，輸出原樣顯示，結束碼與 check_all.py 相同。
它不會改動專案本身。

用法（從專案根目錄）：
  python -I -X utf8 tools/stage_check.py
  python -I -X utf8 tools/stage_check.py --add-topic 07-extended=C:/path/to/topic-block.js
  python -I -X utf8 tools/stage_check.py --keep          # 保留副本，印出路徑

topic-block.js 是一段 JS 物件文字（與 sitemap.js 內其他主題完全同格式，結尾要有逗號），例如：
  {
    id: "my-topic", title: "標題", status: "available",
    summary: "一句話。",
    quizTotal: 12,
    pages: [
      { file: "index.html", title: "主題首頁：學習目標與路徑", kind: "index" },
      ...
    ]
  },
注意 id/title/status 要在同一行，每個頁面一行（tools/_common.py 用逐行規則解析）。
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import project_root, read  # noqa: E402

IGNORE = shutil.ignore_patterns('.git', '.playwright-mcp', '__pycache__', '.claude', 'node_modules')


def add_topic(sitemap_text, stage_dir, block):
    lines = sitemap_text.split('\n')
    stage_i = next((i for i, l in enumerate(lines) if re.search(r'dir:\s*"%s"' % re.escape(stage_dir), l)), None)
    if stage_i is None:
        sys.exit('stage_check: sitemap.js 找不到階段 dir "%s"' % stage_dir)
    topics_i = next((i for i in range(stage_i, len(lines)) if re.search(r'\btopics:\s*\[', lines[i])), None)
    if topics_i is None:
        sys.exit('stage_check: 階段 "%s" 找不到 topics: [' % stage_dir)
    lines[topics_i + 1:topics_i + 1] = block.rstrip('\n').split('\n')
    return '\n'.join(lines)


def registered(copy_root):
    """回傳副本 sitemap.js 登記的 (stage_dir, topic_id) 集合（含 planned）。"""
    text = read(os.path.join(copy_root, 'assets', 'sitemap.js'))
    out, stage = set(), None
    for line in text.split('\n'):
        m = re.search(r'dir:\s*"([^"]+)"', line)
        if m:
            stage = m.group(1)
        m = re.search(r'\bid:\s*"([a-z0-9\-]+)",\s*title:', line)
        if m and stage:
            out.add((stage, m.group(1)))
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--add-topic', action='append', default=[], metavar='STAGE_DIR=FILE',
                    help='在副本的 sitemap.js 登記一個主題區塊（可重複）')
    ap.add_argument('--keep-unregistered', action='store_true', help='不要移除副本裡未登記的主題資料夾')
    ap.add_argument('--keep', action='store_true', help='跑完保留副本並印出路徑')
    args = ap.parse_args()

    root = project_root()
    tmp = tempfile.mkdtemp(prefix='owasp-stage-')
    copy = os.path.join(tmp, 'p')
    shutil.copytree(root, copy, ignore=IGNORE)

    sm_path = os.path.join(copy, 'assets', 'sitemap.js')
    for spec in args.add_topic:
        stage_dir, _, f = spec.partition('=')
        if not f:
            sys.exit('stage_check: --add-topic 要寫成 STAGE_DIR=FILE')
        with open(f, encoding='utf-8') as fh:
            block = fh.read()
        text = add_topic(read(sm_path), stage_dir, block)
        with open(sm_path, 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(text)

    removed = []
    if not args.keep_unregistered:
        reg = registered(copy)
        for stage_dir in sorted({s for s, _ in reg}):
            sd = os.path.join(copy, stage_dir)
            if not os.path.isdir(sd):
                continue
            for name in sorted(os.listdir(sd)):
                p = os.path.join(sd, name)
                if os.path.isdir(p) and (stage_dir, name) not in reg:
                    shutil.rmtree(p)
                    removed.append('%s/%s' % (stage_dir, name))
    print('stage_check: 副本 %s' % copy)
    if removed:
        print('stage_check: 副本中移除未登記的主題資料夾（不影響專案）：')
        for r in removed:
            print('  - ' + r)
    sys.stdout.flush()

    rc = subprocess.call([sys.executable, '-I', '-X', 'utf8', os.path.join('tools', 'check_all.py')], cwd=copy)
    if args.keep:
        print('stage_check: 已保留副本 %s' % copy)
    else:
        shutil.rmtree(tmp, ignore_errors=True)
    sys.exit(rc)


if __name__ == '__main__':
    main()
