# -*- coding: utf-8 -*-
"""Manda o pacote pronto para o branch de publicacao no GitHub.

A hospedagem da UOL le esse branch, que tem apenas o que vai para o ar:
as cinco paginas, os assets, o painel em admin/ e os arquivos soltos.
O restante do projeto (anotacoes, SQL, scripts) continua so no main.

Uso:

    python publicar.py            monta a pasta publicar/
    python enviar-publicacao.py   envia essa pasta para o branch publicacao
"""
import os, shutil, subprocess, sys, datetime

RAIZ = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(RAIZ, "publicar")
ARVORE = os.path.join(os.path.dirname(RAIZ), "lojas-neon-publicacao")
BRANCH = "publicacao"


def git(*args, onde=RAIZ, falhar=True):
    r = subprocess.run(["git"] + list(args), cwd=onde, capture_output=True, text=True)
    if falhar and r.returncode != 0:
        print("git " + " ".join(args))
        print(r.stdout + r.stderr)
        sys.exit(1)
    return (r.stdout + r.stderr).strip()


if not os.path.isdir(SAIDA):
    print("A pasta publicar/ nao existe. Rode antes: python publicar.py")
    sys.exit(1)

# a arvore de trabalho separada evita mexer no main enquanto isso
if not os.path.isdir(ARVORE):
    existe = BRANCH in git("branch", "--list", BRANCH) or \
        BRANCH in git("ls-remote", "--heads", "origin", BRANCH)
    if existe:
        git("fetch", "origin", BRANCH, falhar=False)
        git("worktree", "add", ARVORE, BRANCH)
    else:
        git("worktree", "add", "--orphan", "-b", BRANCH, ARVORE)

# troca o conteudo inteiro pelo pacote recem-gerado
for nome in os.listdir(ARVORE):
    if nome == ".git":
        continue
    caminho = os.path.join(ARVORE, nome)
    shutil.rmtree(caminho) if os.path.isdir(caminho) else os.remove(caminho)

for nome in os.listdir(SAIDA):
    origem, destino = os.path.join(SAIDA, nome), os.path.join(ARVORE, nome)
    shutil.copytree(origem, destino) if os.path.isdir(origem) else shutil.copy2(origem, destino)

git("add", "-A", onde=ARVORE)
if not git("status", "--porcelain", onde=ARVORE):
    print("nada mudou desde o ultimo envio")
    sys.exit(0)

data = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
git("commit", "-m", "Site no ar, versao de " + data, onde=ARVORE)
git("push", "-u", "origin", BRANCH, onde=ARVORE)
print("branch %s atualizado em %s" % (BRANCH, data))
