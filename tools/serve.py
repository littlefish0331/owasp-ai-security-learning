"""本機測試用靜態伺服器：只綁 127.0.0.1，所有回應帶 Cache-Control: no-store。

為什麼要自己寫、不用 `python -m http.server`：
  預設伺服器允許瀏覽器快取 CSS/JS，測試時會吃到舊檔，造成「明明改了卻沒變」的假象
  （本專案實際發生過：改了 style.css 卻一直看到舊版）。

用法：python -I tools/serve.py [port]        預設 8765；根目錄固定為專案根目錄。
停止：結束該程序（見 tools/README.md 的 PowerShell 一行指令），或 Ctrl+C。
注意：這只是測試伺服器。教材本身不依賴伺服器（雙擊 file:// 即可用）。
"""
import functools
import http.server
import os
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *args):
        pass  # 安靜；需要時改成 print


if __name__ == '__main__':
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), functools.partial(Handler, directory=ROOT))
    print(f'serving {ROOT} at http://127.0.0.1:{PORT}/  (no-store; Ctrl+C to stop)', flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
