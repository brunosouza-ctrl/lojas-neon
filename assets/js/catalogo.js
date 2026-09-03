/* =========================================================
   LOJAS NEON  |  catalogo, busca, filtros e orcamento
   As fotos sao de banco livre, temporarias.
   ========================================================= */

(function () {
  'use strict';

  var ZAP = '5513996061615';

  function foto(id, larg) {
    return 'https://images.unsplash.com/photo-' + id +
      '?auto=format&fit=crop&w=' + (larg || 600) + '&q=70';
  }

  /* ---------------------------------------------------------
     Base de produtos
     --------------------------------------------------------- */
  var PRODUTOS = [
    { n: 'Furadeira de impacto 710W', m: 'Stanley', c: 'Ferramentas', p: '363,50', f: '1645651964715-d200ce0939cc' },
    { n: 'Serra mármore 125mm 1300W', m: 'DeWalt', c: 'Ferramentas', p: '482,20', f: '1606676539940-12768ce0e762' },
    { n: 'Lixadeira orbital 200W', m: 'Black e Decker', c: 'Ferramentas', p: '188,20', f: '1518709414768-a88981a4515d' },
    { n: 'Kit soprador térmico 1800W', m: 'Black e Decker', c: 'Ferramentas', p: '357,93', f: '1585201731775-0597e1be4bfb' },
    { n: 'Jogo de 5 brocas madeira, widea e ferro', m: 'Makita', c: 'Ferramentas', p: '43,68', f: '1546827209-a218e99fdbe9' },
    { n: 'Parafusadeira a bateria 12V', m: 'Makita', c: 'Ferramentas', p: '', f: '1513467535987-fd81bc7d62f8' },
    { n: 'Esmerilhadeira angular 4.1/2 pol 850W', m: 'DeWalt', c: 'Ferramentas', p: '', f: '1590635023142-73c3d34f2805' },
    { n: 'Trena de aço 5m com trava', m: 'Stanley', c: 'Ferramentas', p: '', f: '1567361809214-b97d828071d9' },
    { n: 'Jogo de chaves combinadas 12 peças', m: 'Tramontina', c: 'Ferramentas', p: '', f: '1540103711724-ebf833bde8d1' },
    { n: 'Nível a laser autonivelante', m: 'Foxlux', c: 'Ferramentas', p: '', f: '1683115099413-5b7d85c2950c' },

    { n: 'Alicate amperímetro 200A profissional', m: 'Foxlux', c: 'Elétrica', p: '138,34', f: '1621905251189-08b45d6a269e' },
    { n: 'Cabo flexível 2,5mm 750V, rolo 100m', m: 'Sil', c: 'Elétrica', p: '', f: '1555963966-b7ae5404b6ed' },
    { n: 'Cabo flexível 1,5mm 750V, rolo 100m', m: 'Sil', c: 'Elétrica', p: '', f: '1544724569-5f546fd6f2b5' },
    { n: 'Disjuntor bipolar 40A curva C', m: 'Steck', c: 'Elétrica', p: '', f: '1635335874521-7987db781153' },
    { n: 'Quadro de distribuição 12 disjuntores', m: 'Steck', c: 'Elétrica', p: '', f: '1595856898575-9d187bd32fd6' },
    { n: 'Conjunto tomada 2P mais T 10A com placa', m: 'Foxlux', c: 'Elétrica', p: '', f: '1621905251918-48416bd8575a' },
    { n: 'Eletroduto corrugado 3/4 pol, rolo 50m', m: 'Tigre', c: 'Elétrica', p: '', f: '1507494924047-60b8ee826ca9' },
    { n: 'Fita isolante 19mm por 20m', m: '3M', c: 'Elétrica', p: '', f: '1581972327480-e3764d31e5e6' },
    { n: 'DPS protetor contra surtos 275V 20kA', m: 'Steck', c: 'Elétrica', p: '', f: '1660330589693-99889d60181e' },

    { n: 'Tubo soldável 25mm, barra de 6m', m: 'Tigre', c: 'Hidráulica', p: '', f: '1538474705339-e87de81450e8' },
    { n: 'Tubo de esgoto 100mm, barra de 6m', m: 'Amanco', c: 'Hidráulica', p: '', f: '1545193329-4a052e14eb8f' },
    { n: 'Registro de gaveta bruto 3/4 pol', m: 'Docol', c: 'Hidráulica', p: '', f: '1607472586893-edb57bdc0e39' },
    { n: 'Joelho soldável 90 graus 25mm', m: 'Tigre', c: 'Hidráulica', p: '', f: '1650551182991-b07558247564' },
    { n: 'Caixa de água polietileno 500 litros', m: 'Fortlev', c: 'Hidráulica', p: '', f: '1639600993675-2281b2c939f0' },
    { n: 'Torneira de cozinha de parede bica móvel', m: 'Docol', c: 'Hidráulica', p: '', f: '1543674892-7d64d45df18b' },
    { n: 'Adesivo plástico para PVC 175g', m: 'Tigre', c: 'Hidráulica', p: '', f: '1646009445351-b8192e095f3a' },
    { n: 'Sifão sanfonado universal', m: 'Tigre', c: 'Hidráulica', p: '', f: '1586057285471-2f78bffaf074' },

    { n: 'Chuveiro eletrônico Loren Shower 220V', m: 'Lorenzetti', c: 'Chuveiros', p: '', f: '1652662700928-5a4685e87d64' },
    { n: 'Ducha Hydra Optima 6800W 220V', m: 'Hydra', c: 'Chuveiros', p: '', f: '1561361398-d1f7b6cfee79' },
    { n: 'Chuveiro Duo Shower Quadra multitemperaturas', m: 'Lorenzetti', c: 'Chuveiros', p: '', f: '1698724624855-e9dbc5a0bddb' },
    { n: 'Torneira elétrica de parede 5500W', m: 'Lorenzetti', c: 'Chuveiros', p: '', f: '1566872796100-11812b8085f3' },
    { n: 'Resistência para chuveiro 220V 6800W', m: 'Lorenzetti', c: 'Chuveiros', p: '', f: '1697652973421-0d688f661d89' },

    { n: 'Bomba pressurizadora 1/2 CV', m: 'Schneider', c: 'Bombas', p: '', f: '1631856954655-966f97d809de' },
    { n: 'Bomba submersa para poço 1 CV', m: 'Schneider', c: 'Bombas', p: '', f: '1519520104014-df63821cb6f9' },
    { n: 'Bomba periférica 1/2 CV 220V', m: 'Dancor', c: 'Bombas', p: '', f: '1601598851547-4302969d0614' },
    { n: 'Boia de nível automática para caixa de água', m: 'Margirius', c: 'Bombas', p: '', f: '1605371924599-2d0365da1ae0' },

    { n: 'Parafuso chipboard 4,0 por 40mm, caixa 500', m: 'Ciser', c: 'Ferragens', p: '', f: '1631856955350-77f4023dff2b' },
    { n: 'Bucha de nylon S8 com parafuso, 100 unidades', m: 'Fischer', c: 'Ferragens', p: '', f: '1609713292783-5e45ec29b62d' },
    { n: 'Fechadura de porta externa rolete', m: 'Papaiz', c: 'Ferragens', p: '', f: '1602052793312-b99c2a9ee797' },
    { n: 'Dobradiça de aço 3.1/2 pol com anel', m: 'La Fonte', c: 'Ferragens', p: '', f: '1620388640785-892616248ec8' },
    { n: 'Cadeado de latão 40mm', m: 'Papaiz', c: 'Ferragens', p: '', f: '1624927637280-f033784c1279' },

    { n: 'Lâmpada LED bulbo 9W branca, caixa com 10', m: 'Foxlux', c: 'Iluminação', p: '', f: '1529310399831-ed472b81d589' },
    { n: 'Refletor LED 100W à prova de água', m: 'Foxlux', c: 'Iluminação', p: '', f: '1573621622238-f7ac6ac0429a' },
    { n: 'Painel LED de embutir 18W quadrado', m: 'Avant', c: 'Iluminação', p: '', f: '1532007271951-c487760934ae' },
    { n: 'Sensor de presença para teto 360 graus', m: 'Margirius', c: 'Iluminação', p: '', f: '1448745799564-e2c1ed534c94' },
    { n: 'Fita LED 5m com fonte, 12V', m: 'Avant', c: 'Iluminação', p: '', f: '1567177662154-dfeb4c93b6ae' },

    { n: 'Tinta acrílica fosca branca, lata de 18L', m: 'Suvinil', c: 'Tintas', p: '', f: '1525909002-1b05e0c869d8' },
    { n: 'Esmalte sintético brilhante 3,6L', m: 'Coral', c: 'Tintas', p: '', f: '1535673774336-ef95d2851cf3' },
    { n: 'Massa corrida PVA 18L', m: 'Suvinil', c: 'Tintas', p: '', f: '1585676737728-432f58d5fdba' },
    { n: 'Impermeabilizante para laje 18L', m: 'Vedacit', c: 'Tintas', p: '', f: '1542238060-646c7ed65622' },
    { n: 'Kit rolo de lã 23cm com bandeja e cabo', m: 'Atlas', c: 'Tintas', p: '', f: '1623944361530-8a6cd3eb0de8' }
  ];

  PRODUTOS.forEach(function (p, i) { p.id = 'p' + i; });

  /* ---------------------------------------------------------
     Icones
     --------------------------------------------------------- */
  var I = {
    Todos: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    'Elétrica': '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/></svg>',
    'Hidráulica': '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5s6 6.2 6 10.6a6 6 0 0 1-12 0C6 8.7 12 2.5 12 2.5z"/></svg>',
    Chuveiros: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="6.5" rx="2.5"/><path d="M9 13v1M12 13v2M15 13v1M10.5 18v1M13.5 18v1"/></svg>',
    Bombas: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/></svg>',
    Ferramentas: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    Ferragens: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.4"/></svg>',
    'Iluminação': '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21h6M12 17.5V21"/><path d="M12 2.5a6 6 0 0 0-3.5 10.9v2.1h7v-2.1A6 6 0 0 0 12 2.5z"/></svg>',
    Tintas: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h13v6H4z"/><path d="M17 7h3v4l-4 2v3h-3v-4z"/><rect x="11" y="18" width="4" height="4" rx="1"/></svg>'
  };

  var SVG_ZAP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.7 15l-1.2 4.4 4.5-1.2A10 10 0 1 0 12 2zm5.6 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.3-.9-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.2.1.4.1.6-.1l.7-.9c.2-.2.3-.2.6-.1l2 1c.2.1.4.2.4.3.1.2.1.6-.1 1.2z"/></svg>';

  var CATEGORIAS = ['Elétrica', 'Hidráulica', 'Chuveiros', 'Bombas', 'Ferramentas', 'Ferragens', 'Iluminação', 'Tintas'];

  function semAcento(t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /* =========================================================
     ORCAMENTO
     ========================================================= */
  var CHAVE = 'neon.orcamento';
  var orcamento = [];
  try { orcamento = JSON.parse(localStorage.getItem(CHAVE)) || []; } catch (e) { orcamento = []; }

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(orcamento)); } catch (e) { /* modo privado */ }
  }

  function noOrcamento(id) { return orcamento.indexOf(id) !== -1; }

  function alternar(id) {
    var i = orcamento.indexOf(id);
    if (i === -1) orcamento.push(id); else orcamento.splice(i, 1);
    salvar();
    pintarEstados();
    atualizarBarra();
  }

  function atualizarBarra() {
    var barra = document.getElementById('barraOrc');
    var flutuante = document.querySelector('.zap-fixo');
    if (!barra) return;

    if (!orcamento.length) {
      barra.classList.remove('on');
      if (flutuante) flutuante.classList.remove('escondido');
      return;
    }
    barra.classList.add('on');
    if (flutuante) flutuante.classList.add('escondido');
    var q = orcamento.length;
    barra.querySelector('.txt').innerHTML =
      'Orçamento <span style="opacity:.5">|</span> <b>' + q + (q === 1 ? ' item' : ' itens') + '</b>';
  }

  function textoOrcamento() {
    var itens = orcamento.map(function (id) {
      var p = PRODUTOS.filter(function (x) { return x.id === id; })[0];
      return p ? '- ' + p.n + ' (' + p.m + ')' : null;
    }).filter(Boolean);
    return 'Olá! Montei um orçamento no site:\n\n' + itens.join('\n') +
      '\n\nPodem me passar preço e disponibilidade?';
  }

  function pintarEstados() {
    document.querySelectorAll('[data-prod]').forEach(function (card) {
      var dentro = noOrcamento(card.dataset.prod);
      var mais = card.querySelector('.prod-mais');
      var bt = card.querySelector('.bt-orc');
      if (mais) {
        mais.classList.toggle('feito', dentro);
        mais.innerHTML = dentro
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 5.5 5.5L20 7"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
        mais.setAttribute('aria-label', dentro ? 'Remover do orçamento' : 'Adicionar ao orçamento');
      }
      if (bt) {
        bt.textContent = dentro ? 'Remover do orçamento' : 'Adicionar ao orçamento';
        bt.className = 'btn btn-p bt-orc ' + (dentro ? 'btn-azul' : 'btn-azul-linha');
      }
    });
  }

  var barra = document.getElementById('barraOrc');
  if (barra) {
    barra.querySelector('.btn').addEventListener('click', function () {
      if (!orcamento.length) return;
      window.open('https://wa.me/' + ZAP + '?text=' + encodeURIComponent(textoOrcamento()), '_blank');
    });
  }

  /* =========================================================
     CARTAO
     ========================================================= */
  function cartao(p) {
    var disp = p.p
      ? '<b>R$ ' + p.p + '</b>'
      : 'Consulte disponibilidade';
    return '' +
      '<article class="prod" data-prod="' + p.id + '">' +
        '<div class="prod-foto">' +
          '<img src="' + foto(p.f, 520) + '" alt="' + p.n + '" loading="lazy">' +
          '<button class="prod-mais" type="button" aria-label="Adicionar ao orçamento"></button>' +
        '</div>' +
        '<div class="prod-corpo">' +
          '<span class="prod-cat">' + p.c + '</span>' +
          '<h3>' + p.n + '</h3>' +
          '<p class="prod-disp">' + disp + '</p>' +
          '<button type="button" class="btn btn-p bt-orc btn-azul-linha">Adicionar ao orçamento</button>' +
        '</div>' +
      '</article>';
  }

  function ligarCartoes(raiz) {
    raiz.querySelectorAll('[data-prod]').forEach(function (card) {
      var id = card.dataset.prod;
      [card.querySelector('.prod-mais'), card.querySelector('.bt-orc')].forEach(function (b) {
        if (b) b.addEventListener('click', function () { alternar(id); });
      });
    });
    pintarEstados();
  }

  /* =========================================================
     MONTAGEM DO CATALOGO
     ========================================================= */
  var grade = document.getElementById('grade');
  if (!grade) { atualizarBarra(); return; }

  var LIMITE = parseInt(grade.dataset.limite || '0', 10);
  var COM_PAGINAS = grade.dataset.paginas === 'sim';
  var POR_PAGINA = 12;
  var pagina = 1;

  var campoBusca = document.getElementById('busca');
  var chips = document.getElementById('chips');
  var conta = document.getElementById('conta');
  var ordenar = document.getElementById('ordenar');
  var paginacao = document.getElementById('paginacao');
  var semNada = document.getElementById('semResultado');
  var categoriaAtiva = '';

  /* chips */
  if (chips) {
    var listaChips = ['Todos'].concat(CATEGORIAS);
    chips.innerHTML = listaChips.map(function (c, i) {
      return '<button type="button" class="chip' + (i === 0 ? ' on' : '') + '" data-cat="' +
        (i === 0 ? '' : c) + '">' + (I[c] || I.Todos) + c + '</button>';
    }).join('');

    chips.querySelectorAll('.chip').forEach(function (b) {
      b.addEventListener('click', function () {
        chips.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        categoriaAtiva = b.dataset.cat;
        render();
      });
    });

    var seta = document.getElementById('chipsSeta');
    if (seta) {
      seta.addEventListener('click', function () {
        chips.scrollBy({ left: 320, behavior: 'smooth' });
      });
      var conferirSeta = function () {
        var fim = chips.scrollLeft + chips.clientWidth >= chips.scrollWidth - 4;
        seta.style.display = chips.scrollWidth > chips.clientWidth + 4 && !fim ? 'grid' : 'none';
      };
      chips.addEventListener('scroll', conferirSeta);
      window.addEventListener('resize', conferirSeta);
      conferirSeta();
    }
  }

  function filtrar() {
    var termo = semAcento(campoBusca ? campoBusca.value.trim() : '');
    var lista = PRODUTOS.filter(function (p) {
      if (categoriaAtiva && p.c !== categoriaAtiva) return false;
      if (!termo) return true;
      var alvo = semAcento(p.n + ' ' + p.m + ' ' + p.c);
      return termo.split(/\s+/).every(function (parte) { return alvo.indexOf(parte) !== -1; });
    });

    var modo = ordenar ? ordenar.value : '';
    if (modo === 'az') lista.sort(function (a, b) { return a.n.localeCompare(b.n, 'pt-BR'); });
    else if (modo === 'za') lista.sort(function (a, b) { return b.n.localeCompare(a.n, 'pt-BR'); });
    else if (modo === 'preco') lista.sort(function (a, b) { return (a.p ? 0 : 1) - (b.p ? 0 : 1); });

    return lista;
  }

  function desenharPaginacao(total) {
    if (!paginacao) return;
    var paginas = Math.ceil(total / POR_PAGINA);
    if (paginas <= 1) { paginacao.innerHTML = ''; return; }

    var h = '<button data-ir="' + (pagina - 1) + '"' + (pagina === 1 ? ' disabled' : '') + '>Anterior</button>';
    for (var i = 1; i <= paginas; i++) {
      h += '<button data-ir="' + i + '"' + (i === pagina ? ' class="on"' : '') + '>' + i + '</button>';
    }
    h += '<button data-ir="' + (pagina + 1) + '"' + (pagina === paginas ? ' disabled' : '') + '>Próxima</button>';
    paginacao.innerHTML = h;

    paginacao.querySelectorAll('button[data-ir]').forEach(function (b) {
      b.addEventListener('click', function () {
        var destino = parseInt(b.dataset.ir, 10);
        if (destino < 1 || destino > paginas) return;
        pagina = destino;
        render(true);
        var topo = document.getElementById('topoCatalogo');
        if (topo) topo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function render(manterPagina) {
    if (!manterPagina) pagina = 1;
    var lista = filtrar();

    if (conta) {
      conta.textContent = lista.length +
        (lista.length === 1 ? ' produto encontrado' : ' produtos encontrados');
    }

    if (!lista.length) {
      grade.innerHTML = '';
      if (paginacao) paginacao.innerHTML = '';
      if (semNada) semNada.style.display = 'block';
      return;
    }
    if (semNada) semNada.style.display = 'none';

    var recorte;
    if (COM_PAGINAS) {
      var inicio = (pagina - 1) * POR_PAGINA;
      recorte = lista.slice(inicio, inicio + POR_PAGINA);
      desenharPaginacao(lista.length);
    } else {
      recorte = LIMITE ? lista.slice(0, LIMITE) : lista;
    }

    grade.innerHTML = recorte.map(cartao).join('');
    ligarCartoes(grade);
  }

  if (campoBusca) {
    var atraso;
    campoBusca.addEventListener('input', function () {
      clearTimeout(atraso);
      atraso = setTimeout(function () { render(); }, 180);
    });
  }
  if (ordenar) ordenar.addEventListener('change', function () { render(); });

  var vindo = new URLSearchParams(location.search).get('busca');
  if (vindo && campoBusca) campoBusca.value = vindo;

  render();
  atualizarBarra();
})();
