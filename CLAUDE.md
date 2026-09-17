# Lojas Neon, site

Site institucional com catálogo para a **Lojas Neon**, elétrica e hidráulica em Peruíbe/SP.
HTML, CSS e JavaScript puros. Sem build, sem framework, sem dependência de instalação.

## Publicação

Domínio `lojasneon.com.br`, hospedagem na UOL Host (o cliente tem a conta). O site público vai
sem o painel: `admin.html`, `admin.css` e `admin.js` ficam fora até o Supabase existir, senão o
visitante cai num painel em modo demonstração. O pacote pronto sai em `publicar/` e
`lojas-neon-publicar.zip`, os dois fora do git.

Formulários de Profissional e Monte sua Obra não têm servidor: viram mensagem de WhatsApp
(`form.form-zap` em `base.js`).

## Como rodar

```bash
python -m http.server 5510
```

Depois abre `http://localhost:5510`. Também funciona abrindo o `index.html` direto no navegador,
porque todos os caminhos são relativos.

## Estrutura

```
index.html          home
produtos.html       catálogo completo, com busca, filtro, ordenação e paginação
profissional.html   página Sou Profissional, com formulário de cadastro
obra.html           página Monte sua Obra, com as 4 fases e formulário
lojas.html          as duas unidades, com mapa incorporado
assets/css/estilo.css   folha única
assets/js/base.js       menu, animação de entrada, esteira de marcas
assets/js/catalogo.js   base de produtos, busca, filtros, paginação, orçamento
assets/img/             fotos
assets/marcas/          logos das marcas, ainda vazio
```

Os arquivos de CSS e JS são chamados com `?v=NN` para furar cache. **Ao alterar CSS ou JS,
subir esse número nas cinco páginas**, senão o navegador serve a versão velha.

## Dados do cliente

| | |
|---|---|
| Razão social | Lojas Neon Comércio de Materiais Elétricos e Hidráulicos Ltda |
| CNPJ | 59.790.204/0001-16 |
| Aberta em | 08/12/1988 |
| WhatsApp | (13) 99606-1615 |
| Telefone | (13) 3455-3019 (Stella Maris), (13) 3366-6680 (Mar e Sol) |
| Instagram | @lojas_neon |
| Google | 4,5 com 227 avaliações (Stella Maris) |
| Unidade 1 | Av. Padre Anchieta, 1551, Balneário Stella Maris |
| Unidade 2 | Av. Padre Anchieta, 7700, lojas 4 e 5, Mar e Sol |

Dados conferidos no Google Maps em 16/09/2026:
- Stella Maris: 4,5 com 227 avaliações, seg a sex 8h às 18h, sáb 8h às 16h, dom 9h às 12h.
- Mar e Sol (ficha "LOJAS NEON II"): Av. Padre Anchieta 7700, lojas 4 e 5, tel (13) 3366-6680,
  4,9 com 18 avaliações, seg a sex 8h às 18h, sáb 8h às 17h, dom 8h às 12h.
- Existe uma terceira ficha "LOJAS NEON" na Av. Luciano de Bona, 2261, sem avaliações. Perguntar ao cliente.

A frase "Do fio aos tubos, tudo para sua obra" é do próprio cliente, veio da bio do Instagram.

## Identidade

```
--azul       #1539B2   marca, hero, faixa do topo
--azul-esc   #122B7A   títulos e rodapé
--amarelo    #FFC72C   ações e destaques
```

Tipografia: **Archivo** para títulos, **Inter** para texto. O título do hero usa o eixo de
largura variável da Archivo em 78%, para condensar e bater com o mockup do cliente.

A logo é uma **recriação em SVG** a partir do arquivo que o cliente mandou como imagem.
Está embutida nas cinco páginas, no cabeçalho e no rodapé. Se um dia chegar o vetor original,
vale trocar. As cores dela vêm das variáveis, então acompanham a paleta.

## O que a loja e, e o que ela nao e

A Neon e **eletrica e hidraulica**, mais ferragens, parafusos, ferramentas, bombas e
iluminacao. **Ela nao vende tinta** (confirmado pelo cliente em 08/09/2026) e **nao atende
obra pesada**: nada de cimento, areia, brita, ferro, tijolo, laje ou fundacao. Ja tirei tudo
isso do site uma vez; se voltar a aparecer em texto novo, esta errado.

A pagina "Monte sua Obra" existe, o cliente gosta dela, mas as fases sao todas de instalacao:
Entrada e quadro, Fiacao e pontos, Agua e esgoto, Chuveiro luz e ferragens.

## Regras de escrita que o cliente cobra

1. **Nunca usar travessão.** Vírgula, dois-pontos, parênteses ou ponto no lugar.
2. **Nunca usar emoji** na interface. Ícone é sempre SVG.
3. Nada de linguagem genérica de agência nem blocos decorativos que ninguém pediu.
4. O hero do desktop precisa caber na tela sem rolar, mostrando o início da seção seguinte.
5. Quando o cliente manda referência visual, seguir ao pé da letra.

## Detalhes técnicos que não são óbvios

**Hero.** A foto e o arco amarelo são duas elipses concêntricas recortadas por `clip-path`,
centro em 70,7% da caixa. A amarela é um pouco maior: a diferença entre elas é a espessura
do arco, e ela cresce junto com a tela. Mexer numa exige conferir a outra, e conferir também
o respiro até o fim do texto, que hoje é de 50px em 1440px de largura.

**Animação de entrada.** Usa Motion pelo CDN, mas com rede de proteção: o padrão é sempre
visível, o JS só esconde depois de confirmar que consegue animar, cada bloco solta as
animações 1,6s depois de aparecer e existe uma trava geral de 3s. Isso é proposital, o Motion
já deixou conteúdo invisível neste projeto. **Não remover essas proteções.**

**Orçamento.** O visitante junta produtos pelo botão de mais, a barra aparece no rodapé e
"Revisar orçamento" abre o WhatsApp com a lista montada. Fica em `localStorage`, acompanha
o visitante entre as páginas.

## Painel de produtos

`admin.html` permite alterar preco, cadastrar, esconder e excluir produto, e trocar a foto.
Quem cuida disso e o proprio cliente, nao o Bruno.

**Banco ligado em 17/09/2026**: projeto Supabase `xztgjjlktxyamaczurlb`, plano free, com os
43 produtos dentro. O `config.js` ja tem a URL e a chave publicavel (formato novo,
`sb_publishable_...`). A chave secreta nunca entra no site.

**A tela do painel pede so a senha.** O e-mail da conta (`painel@lojasneon.com.br`) fica no
`config.js`, em `PAINEL_EMAIL`, e entra sozinho. Quem confere a senha continua sendo o Supabase
Auth, nunca o JavaScript. Tres erros seguidos e a tela espera 5 minutos, gravado em
`localStorage` (`neon.painel.tentativas`).

**Se o `config.js` ficar vazio de novo**, tudo volta para o modo demonstracao, guardando no
`localStorage`. Serve para conhecer a tela sem tocar no banco.

O site le os produtos do banco e, **se o banco nao responder, cai para o catalogo de exemplo**
que esta dentro do `catalogo.js`. Isso e proposital: o catalogo nunca aparece vazio.

**A URL secreta nao protege nada.** O que protege sao as regras de RLS do `schema.sql`:
o visitante anonimo so le produtos ativos, e escrever exige estar autenticado.
Nunca colocar a chave `service_role` no `config.js`.

**Planilha.** "Exportar planilha" baixa todos os produtos em .xlsx. "Importar planilha" acha
cada linha pelo **codigo de barras**, mostra uma conferencia antes de gravar e so aplica depois
do clique. Aceita o formato do sistema da loja (Descricao, UN, Marca, Preco). O nome de produto
existente so muda pela coluna "Nome no site", nunca pela "Descricao". Produto novo entra
**escondido do site**, porque chega sem foto. Linha sem codigo e ignorada.

**Plano free e a pausa.** Sem nenhum acesso por 7 dias o projeto dorme. O site nao quebra:
cai para o catalogo de exemplo do `catalogo.js`. Para evitar, existe o agendamento
`.github/workflows/acorda-banco.yml`, que le um produto dia sim dia nao. Ele tambem anota o mes
em `.github/ultimo-ping.txt`, porque o GitHub desliga agendamento de repositorio parado ha 60
dias. O free nao tem backup automatico: a copia de seguranca e a planilha exportada pelo painel
e o `supabase/carga-inicial.sql`.

## O que ainda falta

- [ ] Logos das marcas para a esteira, em `assets/marcas/`. Hoje a esteira mostra em texto as marcas reais da planilha: Sil, Foxlux, Tramontina, Lorenzetti, Tigre, Zagonel, 3M, Elgin, Krona, Tron, Cibraflex
- [x] Avaliações reais do Google e posts reais do Instagram (capas em `assets/img/insta/`)
- [ ] Fotos reais das fachadas. Na home, os cartões das lojas mostram o mapa no lugar da foto. As fotos ilustrativas de Obra e Profissional continuam de banco livre, agora salvas em `assets/img/fotos/`
- [ ] Criar o projeto Supabase e preencher o `config.js`
- [x] Planilha do dono (43 itens) em `supabase/produtos-iniciais.json`, com foto real de cada item em `assets/img/produtos/<codigo de barras>.jpg`
- [ ] Subir esses 43 produtos para o Supabase quando o projeto existir
- [ ] Criar o usuario do cliente no Supabase Auth para ele entrar no painel
- [x] Hero do celular: foto em cima com arco amarelo e selo do Google, no estilo do site da Dani Diversidades
- [ ] Google Meu Negócio: a categoria está errada, cadastrada como loja de decoração em vez
      de material elétrico, e o cliente perdeu o acesso ao Gmail. Resolver por reivindicação
      de propriedade, que leva 7 dias.
