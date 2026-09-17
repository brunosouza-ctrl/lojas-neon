# -*- coding: utf-8 -*-
"""Servidor de teste que imita a hospedagem.

O site publicado usa endereco limpo (/produtos em vez de /produtos.html), o que
na hospedagem e feito pelo .htaccess. Aqui o mesmo comportamento: se o caminho
pedido nao existir, tenta o arquivo .html com aquele nome.

    python servidor-local.py [porta] [pasta]
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 5510
PASTA = sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(os.path.abspath(__file__))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PASTA, **kwargs)

    def translate_path(self, path):
        caminho = super().translate_path(path)
        if not os.path.exists(caminho) and not path.rstrip("/").endswith(".html"):
            com_html = caminho.rstrip("/\\") + ".html"
            if os.path.isfile(com_html):
                return com_html
        return caminho

    def end_headers(self):
        # em teste, nada de cache: sempre a versao do disco
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, formato, *args):
        sys.stderr.write("%s\n" % (formato % args))


print("servindo %s em http://localhost:%d" % (PASTA, PORTA))
ThreadingHTTPServer(("", PORTA), Handler).serve_forever()
