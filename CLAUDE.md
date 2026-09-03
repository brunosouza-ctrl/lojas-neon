# Lojas Neon, site

Site institucional com catálogo para a **Lojas Neon**, elétrica e hidráulica em Peruíbe/SP.
HTML, CSS e JavaScript puros. Sem build, sem framework, sem dependência de instalação.

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
| Telefone | (13) 3455-3019 |
| Instagram | @lojas_neon |
| Google | 4,5 com 225 avaliações |
| Unidade 1 | Av. Padre Anchieta, 1551, Balneário Stella Maris |
| Unidade 2 | Av. Padre Anchieta, 7700, Mar e Sol |

**Atenção:** o endereço da unidade 2 saiu de uma publicação do Instagram e **ainda não foi
confirmado pelo cliente**. Confirmar antes de publicar.

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

## O que ainda falta

- [ ] Logos das marcas para a esteira, em `assets/marcas/`: lorenzetti, tigre, makita, dewalt, stanley, black-decker, foxlux, amanco, tramontina, suvinil, docol, schneider
- [ ] Confirmar endereço e telefone da unidade Mar e Sol
- [ ] Avaliações reais do Google, hoje são espaço reservado marcado entre colchetes
- [ ] Fotos reais das fachadas e do Instagram, hoje são de banco livre
- [ ] Preços reais no catálogo, hoje só alguns saíram do Instagram
- [ ] Ajuste fino do hero no celular, o cliente pediu para deixar para depois
- [ ] Google Meu Negócio: a categoria está errada, cadastrada como loja de decoração em vez
      de material elétrico, e o cliente perdeu o acesso ao Gmail. Resolver por reivindicação
      de propriedade, que leva 7 dias.
