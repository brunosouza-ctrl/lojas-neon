# -*- coding: utf-8 -*-
"""Monta a pasta que vai para a hospedagem.

Roda assim, de dentro do projeto:

    python publicar.py

Deixa tudo em publicar/ e tambem em lojas-neon-publicar.zip. O painel vira
publicar/admin/index.html, para o endereco final ser lojasneon.com.br/admin,
e por isso os caminhos dele ganham ".." na frente.
"""
import io, os, re, shutil, zipfile

RAIZ = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(RAIZ, "publicar")
ZIP = os.path.join(RAIZ, "lojas-neon-publicar.zip")

PAGINAS = ["index.html", "produtos.html", "obra.html", "profissional.html", "lojas.html"]
SOLTOS = ["favicon.ico", "robots.txt", "sitemap.xml", ".htaccess"]
PASTAS_ASSETS = ["css", "js", "img", "icones", "marcas"]
# o painel tem folha e script proprios: ficam de fora do site publico so se ele nao for junto
ADMIN = ["assets/css/admin.css", "assets/js/admin.js"]


def limpar():
    if os.path.exists(SAIDA):
        shutil.rmtree(SAIDA)
    os.makedirs(SAIDA)


def copiar():
    for p in PAGINAS + SOLTOS:
        shutil.copy2(os.path.join(RAIZ, p), os.path.join(SAIDA, p))
    for pasta in PASTAS_ASSETS:
        origem = os.path.join(RAIZ, "assets", pasta)
        if os.path.isdir(origem):
            shutil.copytree(origem, os.path.join(SAIDA, "assets", pasta))


def montar_painel():
    """admin.html vira admin/index.html, com os caminhos subindo uma pasta."""
    destino = os.path.join(SAIDA, "admin")
    os.makedirs(destino, exist_ok=True)
    html = io.open(os.path.join(RAIZ, "admin.html"), encoding="utf-8").read()
    html = re.sub(r'(href|src)="assets/', r'\1="../assets/', html)
    io.open(os.path.join(destino, "index.html"), "w", encoding="utf-8").write(html)


def conferir():
    """Nenhum arquivo citado nas paginas pode faltar no pacote."""
    faltando = []
    for pasta, _, arquivos in os.walk(SAIDA):
        for arq in arquivos:
            if not arq.endswith((".html", ".css", ".js")):
                continue
            caminho = os.path.join(pasta, arq)
            texto = io.open(caminho, encoding="utf-8", errors="ignore").read()
            texto = re.sub(r"<!--.*?-->", "", texto, flags=re.S)   # comentario nao conta
            citados = re.findall(r'(?:href|src|srcset)="([^"]+)"', texto)
            citados += re.findall(r"url\(['\"]?([^'\")]+)", texto)
            citados += re.findall(r"'(assets/[^']+)'", texto)
            for u in citados:
                if u.startswith(("http", "#", "tel:", "mailto:", "data:")) or "+" in u:
                    continue
                limpo = u.split("?")[0].split("#")[0]
                if not limpo or limpo.endswith("/"):
                    continue
                # endereco limpo (/produtos) e caminho da raiz (assets/...) contam da raiz do site
                if limpo.startswith("/"):
                    base, limpo = SAIDA, limpo.lstrip("/")
                elif limpo.startswith("assets/"):
                    base = SAIDA
                else:
                    base = pasta
                alvo = os.path.join(base, limpo)
                if not (os.path.exists(alvo) or os.path.isfile(alvo + ".html")):
                    faltando.append((os.path.relpath(caminho, SAIDA), u))
    return faltando


def zipar():
    if os.path.exists(ZIP):
        os.remove(ZIP)
    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
        for pasta, _, arquivos in os.walk(SAIDA):
            for arq in arquivos:
                caminho = os.path.join(pasta, arq)
                z.write(caminho, os.path.relpath(caminho, SAIDA))


limpar()
copiar()
montar_painel()
faltando = conferir()
zipar()

total = sum(len(a) for _, _, a in os.walk(SAIDA))
tamanho = sum(os.path.getsize(os.path.join(p, a)) for p, _, arqs in os.walk(SAIDA) for a in arqs)
print("pacote em publicar/: %d arquivos, %.1f MB" % (total, tamanho / 1048576.0))
print("zip: %s" % os.path.basename(ZIP))
if faltando:
    print("ATENCAO, arquivo citado e nao encontrado:")
    for arq, u in faltando:
        print("  %s -> %s" % (arq, u))
else:
    print("nenhum caminho quebrado")
