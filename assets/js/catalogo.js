/* =========================================================
   LOJAS NEON  |  catalogo, busca, filtros e orcamento
   O catalogo de exemplo abaixo e a planilha real do dono, com a foto de cada item.
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
  var PRODUTOS_EXEMPLO = [
    { ean: '7897381600577', n: 'Cabo flexível 1,5mm preto, rolo 100m', m: 'Sil', c: 'Elétrica', u: 'un', p: '199,99', foto: 'assets/img/produtos/7897381600577.jpg' },
    { ean: '7897381614000', n: 'Cabo flexível 1,5mm preto, por metro', m: 'Sil', c: 'Elétrica', u: 'm', p: '2,31', foto: 'assets/img/produtos/7897381614000.jpg' },
    { ean: '7897381600621', n: 'Cabo flexível 2,5mm preto, rolo 100m', m: 'Sil', c: 'Elétrica', u: 'un', p: '296,99', foto: 'assets/img/produtos/7897381600621.jpg' },
    { ean: '7897381614086', n: 'Cabo flexível 2,5mm preto, por metro', m: 'Sil', c: 'Elétrica', u: 'm', p: '3,69', foto: 'assets/img/produtos/7897381614086.jpg' },
    { ean: '7897381600676', n: 'Cabo flexível 4mm preto, rolo 100m', m: 'Sil', c: 'Elétrica', u: 'un', p: '514,90', foto: 'assets/img/produtos/7897381600676.jpg' },
    { ean: '7897381636149', n: 'Cabo flexível 4mm preto, por metro', m: 'Sil', c: 'Elétrica', u: 'm', p: '5,99', foto: 'assets/img/produtos/7897381636149.jpg' },
    { ean: '7897381600720', n: 'Cabo flexível 6mm preto, rolo 100m', m: 'Sil', c: 'Elétrica', u: 'un', p: '769,99', foto: 'assets/img/produtos/7897381600720.jpg' },
    { ean: '7897381636194', n: 'Cabo flexível 6mm preto, por metro', m: 'Sil', c: 'Elétrica', u: 'm', p: '8,99', foto: 'assets/img/produtos/7897381636194.jpg' },
    { ean: '7897381636248', n: 'Cabo flexível 10mm preto, por metro', m: 'Sil', c: 'Elétrica', u: 'm', p: '16,90', foto: 'assets/img/produtos/7897381636248.jpg' },
    { ean: '7897381636293', n: 'Cabo flexível 16mm preto, por metro', m: 'Sil', c: 'Elétrica', u: 'm', p: '28,50', foto: 'assets/img/produtos/7897381636293.jpg' },
    { ean: '7891435933581', n: 'Conjunto interruptor simples 6A 250V Aria branco', m: 'Tramontina', c: 'Elétrica', u: 'un', p: '8,70', foto: 'assets/img/produtos/7891435933581.jpg' },
    { ean: '7891435937626', n: 'Conjunto interruptor paralelo 6A 250V Aria branco', m: 'Tramontina', c: 'Elétrica', u: 'un', p: '14,40', foto: 'assets/img/produtos/7891435937626.jpg' },
    { ean: '7891435932577', n: 'Conjunto tomada 2P+T 10A 250V Aria branco', m: 'Tramontina', c: 'Elétrica', u: 'un', p: '7,50', foto: 'assets/img/produtos/7891435932577.jpg' },
    { ean: '7891435933598', n: 'Conjunto tomada 2P+T 20A 250V Aria branco', m: 'Tramontina', c: 'Elétrica', u: 'un', p: '8,90', foto: 'assets/img/produtos/7891435933598.jpg' },
    { ean: '7891435933888', n: 'Conjunto tomada dupla 2P+T 10A 250V Aria branco', m: 'Tramontina', c: 'Elétrica', u: 'un', p: '15,90', foto: 'assets/img/produtos/7891435933888.jpg' },
    { ean: '7891435937916', n: 'Conjunto 2 interruptores simples 6A 250V Aria branco', m: 'Tramontina', c: 'Elétrica', u: 'un', p: '14,99', foto: 'assets/img/produtos/7891435937916.jpg' },
    { ean: '7891435938081', n: 'Conjunto interruptor simples 6A e tomada 2P+T 10A Aria branco', m: 'Tramontina', c: 'Elétrica', u: 'un', p: '14,06', foto: 'assets/img/produtos/7891435938081.jpg' },
    { ean: '7890203455379', n: 'Fita isolante Imperial Slim 18mm x 5m', m: '3M', c: 'Elétrica', u: 'un', p: '5,90', foto: 'assets/img/produtos/7890203455379.jpg' },
    { ean: '7891040106363', n: 'Fita isolante Imperial Slim 18mm x 10m', m: '3M', c: 'Elétrica', u: 'un', p: '9,90', foto: 'assets/img/produtos/7891040106363.jpg' },
    { ean: '7891040105502', n: 'Fita isolante Imperial Slim 18mm x 20m', m: '3M', c: 'Elétrica', u: 'un', p: '14,90', foto: 'assets/img/produtos/7891040105502.jpg' },
    { ean: '7890203418060', n: 'Fita isolante Scotch 33+ 19mm x 20m', m: '3M', c: 'Elétrica', u: 'pc', p: '39,90', foto: 'assets/img/produtos/7890203418060.jpg' },
    { ean: '9000000049765', n: 'Conector de porcelana trifásico 10mm', m: 'Foxlux', c: 'Elétrica', u: 'un', p: '3,90', foto: 'assets/img/produtos/9000000049765.jpg' },

    { ean: '7897801301596', n: 'Sifão multiuso simples com tubo extensível', m: 'Krona', c: 'Hidráulica', u: 'un', p: '7,90', foto: 'assets/img/produtos/7897801301596.jpg' },
    { ean: '7897613336946', n: 'Fita veda rosca 18mm x 10m', m: 'Tigre', c: 'Hidráulica', u: 'un', p: '3,81', foto: 'assets/img/produtos/7897613336946.jpg' },
    { ean: '7897613336953', n: 'Fita veda rosca 18mm x 25m', m: 'Tigre', c: 'Hidráulica', u: 'un', p: '7,67', foto: 'assets/img/produtos/7897613336953.jpg' },
    { ean: '7897613336960', n: 'Fita veda rosca 18mm x 50m', m: 'Tigre', c: 'Hidráulica', u: 'un', p: '15,10', foto: 'assets/img/produtos/7897613336960.jpg' },

    { ean: '7908649631889', n: 'Ducha Ballerina 3 temperaturas 220V 5350W branca', m: 'Zagonel', c: 'Chuveiros', u: 'un', p: '52,90', foto: 'assets/img/produtos/7908649631889.jpg' },
    { ean: '7897273200335', n: 'Ducha Ideale Plus 4 temperaturas 220V 6800W branca', m: 'Zagonel', c: 'Chuveiros', u: 'un', p: '69,90', foto: 'assets/img/produtos/7897273200335.jpg' },
    { ean: '7908649605637', n: 'Ducha Moment eletrônica 220V 7500W branca', m: 'Zagonel', c: 'Chuveiros', u: 'un', p: '132,90', foto: 'assets/img/produtos/7908649605637.jpg' },
    { ean: '7896451824806', n: 'Maxi Ducha 220V 5500W', m: 'Lorenzetti', c: 'Chuveiros', u: 'un', p: '115,99', foto: 'assets/img/produtos/7896451824806.jpg' },
    { ean: '7896451844859', n: 'Bella Ducha Ultra 220V 6800W branca', m: 'Lorenzetti', c: 'Chuveiros', u: 'un', p: '119,90', foto: 'assets/img/produtos/7896451844859.jpg' },
    { ean: '7896451879035', n: 'Ducha Loren Shower eletrônica 220V 7500W', m: 'Lorenzetti', c: 'Chuveiros', u: 'un', p: '188,89', foto: 'assets/img/produtos/7896451879035.jpg' },

    { ean: '7898586133563', n: 'Lâmpada LED bulbo 9W 6500K bivolt', m: 'Foxlux', c: 'Iluminação', u: 'un', p: '3,99', foto: 'assets/img/produtos/7898586133563.jpg' },
    { ean: '7898586132146', n: 'Lâmpada LED bulbo 15W 6500K bivolt', m: 'Foxlux', c: 'Iluminação', u: 'un', p: '10,95', foto: 'assets/img/produtos/7898586132146.jpg' },
    { ean: '7898586132108', n: 'Lâmpada LED alta potência 20W 6500K bivolt', m: 'Foxlux', c: 'Iluminação', u: 'un', p: '14,90', foto: 'assets/img/produtos/7898586132108.jpg' },
    { ean: '7898586132115', n: 'Lâmpada LED alta potência 30W 6500K bivolt', m: 'Foxlux', c: 'Iluminação', u: 'un', p: '24,90', foto: 'assets/img/produtos/7898586132115.jpg' },
    { ean: '7898586132122', n: 'Lâmpada LED alta potência 40W 6500K bivolt', m: 'Foxlux', c: 'Iluminação', u: 'un', p: '34,90', foto: 'assets/img/produtos/7898586132122.jpg' },
    { ean: '7898586134454', n: 'Lâmpada LED alta potência 50W 6500K bivolt', m: 'Foxlux', c: 'Iluminação', u: 'un', p: '41,90', foto: 'assets/img/produtos/7898586134454.jpg' },
    { ean: '7898586137035', n: 'Lâmpada LED alta potência 100W 6500K bivolt', m: 'Foxlux', c: 'Iluminação', u: 'un', p: '109,90', foto: 'assets/img/produtos/7898586137035.jpg' },

    { ean: '7897192714494', n: 'Ventilador de teto Citrino 127V 130W 3 pás branco', m: 'Tron', c: 'Ventilação', u: 'pc', p: '299,99', foto: 'assets/img/produtos/7897192714494.jpg' },
    { ean: '7908412519208', n: 'Ventilador de mesa 40cm 127V 140W preto', m: 'Elgin', c: 'Ventilação', u: 'un', p: '209,99', foto: 'assets/img/produtos/7908412519208.jpg' },

    { ean: '7898567700944', n: 'Óleo desengripante spray 300ml', m: 'Lub Fast', c: 'Químicos', u: 'un', p: '8,50', foto: 'assets/img/produtos/7898567700944.jpg' },
    { ean: '7898965442477', n: 'Cola selante PU40 branca 400g', m: 'Cibraflex', c: 'Químicos', u: 'un', p: '13,90', foto: 'assets/img/produtos/7898965442477.jpg' }
  ];

  var PRODUTOS = [];

  /* ---------------------------------------------------------
     Carrega os produtos.
     Com o Supabase configurado, le de la. Sem configuracao, ou
     se o banco nao responder, usa o catalogo de exemplo acima,
     para o site nunca aparecer vazio.
     --------------------------------------------------------- */
  function normaliza(linha) {
    var preco = '';
    if (linha.preco !== null && linha.preco !== undefined && linha.preco !== '') {
      preco = Number(linha.preco).toFixed(2).replace('.', ',');
    }
    return {
      id: linha.id,
      ean: linha.codigo_barras || '',
      n: linha.nome,
      m: linha.marca || '',
      c: linha.categoria,
      u: linha.unidade || 'un',
      p: preco,
      foto: linha.foto_url || '',
      f: ''
    };
  }

  function carregarProdutos() {
    var cfg = window.NEON && window.NEON.config;
    var temBanco = window.NEON && window.NEON.temBanco && window.NEON.temBanco();

    if (!temBanco) {
      PRODUTOS = PRODUTOS_EXEMPLO.map(function (x, i) {
        x.id = 'p' + i;
        return x;
      });
      return Promise.resolve('exemplo');
    }

    var url = cfg.SUPABASE_URL.replace(/\/+$/, '') +
      '/rest/v1/produtos?select=id,codigo_barras,nome,marca,categoria,unidade,preco,foto_url&ativo=eq.true&order=ordem.asc,nome.asc';

    return fetch(url, {
      headers: {
        apikey: cfg.SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + cfg.SUPABASE_ANON_KEY
      }
    })
      .then(function (r) {
        if (!r.ok) throw new Error('banco respondeu ' + r.status);
        return r.json();
      })
      .then(function (linhas) {
        if (!linhas || !linhas.length) throw new Error('banco vazio');
        PRODUTOS = linhas.map(normaliza);
        return 'banco';
      })
      .catch(function (e) {
        if (window.console) console.warn('Catalogo veio do exemplo local:', e.message);
        PRODUTOS = PRODUTOS_EXEMPLO.map(function (x, i) {
          x.id = 'p' + i;
          return x;
        });
        return 'exemplo';
      });
  }

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
    'Ventilação': '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 10c0-4 1-7 4-7 2.5 0 3 3 0 5l-4 2"/><path d="M14 12c4 0 7 1 7 4 0 2.5-3 3-5 0l-2-4"/><path d="M12 14c0 4-1 7-4 7-2.5 0-3-3 0-5l4-2"/><path d="M10 12c-4 0-7-1-7-4 0-2.5 3-3 5 0l2 4"/></svg>',
    'Químicos': '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7.5 15h9"/></svg>'
  };

  var SVG_ZAP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.7 15l-1.2 4.4 4.5-1.2A10 10 0 1 0 12 2zm5.6 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.3-.9-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.2.1.4.1.6-.1l.7-.9c.2-.2.3-.2.6-.1l2 1c.2.1.4.2.4.3.1.2.1.6-.1 1.2z"/></svg>';

  /* ordem preferida; qualquer categoria nova do banco entra no fim */
  var ORDEM_CATEGORIAS = ['Elétrica', 'Hidráulica', 'Chuveiros', 'Iluminação', 'Ventilação', 'Químicos', 'Bombas', 'Ferramentas', 'Ferragens'];
  var CATEGORIAS = ORDEM_CATEGORIAS.slice();

  function apuraCategorias() {
    var achadas = [];
    PRODUTOS.forEach(function (p) {
      if (p.c && achadas.indexOf(p.c) === -1) achadas.push(p.c);
    });
    var conhecidas = ORDEM_CATEGORIAS.filter(function (c) { return achadas.indexOf(c) !== -1; });
    var novas = achadas.filter(function (c) { return ORDEM_CATEGORIAS.indexOf(c) === -1; }).sort();
    CATEGORIAS = conhecidas.concat(novas);
  }

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
  /* A foto do produto tem versao .webp ao lado do .jpg, uns 40% mais leve.
     O navegador que entender webp pega ela; o resto continua no jpg. */
  function imagem(endereco, alt) {
    var img = '<img src="' + endereco + '" alt="' + alt + '" width="560" height="560" loading="lazy" decoding="async">';
    if (endereco.slice(-4).toLowerCase() !== '.jpg') return img;
    return '<picture><source srcset="' + endereco.slice(0, -4) + '.webp" type="image/webp">' + img + '</picture>';
  }

  function cartao(p) {
    var UNIDADE = { m: 'metro', pc: 'peça' };
    var disp = p.p
      ? '<b>R$ ' + p.p + '</b>' + (p.u === 'm' ? ' <span class="prod-unid">por metro</span>' : '')
      : 'Consulte disponibilidade';
    return '' +
      '<article class="prod" data-prod="' + p.id + '">' +
        '<div class="prod-foto">' +
          imagem(p.foto || foto(p.f, 520), p.n) +
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
  /* Vitrine da home: em vez dos primeiros da lista, que seriam todos cabos,
     pega um de cada categoria, comecando pelo mais barato de cada uma, e da
     a segunda volta ate completar. */
  function variados(lista, quantos) {
    var porCategoria = {};
    lista.forEach(function (p) {
      (porCategoria[p.c] = porCategoria[p.c] || []).push(p);
    });

    var categorias = Object.keys(porCategoria).sort(function (a, b) {
      var ia = ORDEM_CATEGORIAS.indexOf(a), ib = ORDEM_CATEGORIAS.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });

    categorias.forEach(function (c) {
      porCategoria[c].sort(function (a, b) {
        return (precoNumero(a.p) || 1e9) - (precoNumero(b.p) || 1e9);
      });
    });

    var escolhidos = [];
    var volta = 0;
    while (escolhidos.length < quantos && volta < 20) {
      var achouAlgum = false;
      for (var i = 0; i < categorias.length && escolhidos.length < quantos; i++) {
        var fila = porCategoria[categorias[i]];
        if (fila.length > volta) {
          escolhidos.push(fila[volta]);
          achouAlgum = true;
        }
      }
      if (!achouAlgum) break;
      volta++;
    }
    return escolhidos;
  }

  function precoNumero(p) {
    if (p === null || p === undefined || p === '') return null;
    var n = Number(String(p).replace(/\./g, '').replace(',', '.'));
    return isNaN(n) ? null : n;
  }

  function montarCatalogo() {
  apuraCategorias();

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

  /* chips: refeitos quando a lista de categorias muda */
  function desenharChips() {
    if (!chips) return;
    var listaChips = ['Todos'].concat(CATEGORIAS);
    chips.innerHTML = listaChips.map(function (c) {
      var ativo = (c === 'Todos' ? '' : c) === categoriaAtiva;
      return '<button type="button" class="chip' + (ativo ? ' on' : '') + '" data-cat="' +
        (c === 'Todos' ? '' : c) + '">' + (I[c] || I.Todos) + c + '</button>';
    }).join('');

    chips.querySelectorAll('.chip').forEach(function (b) {
      b.addEventListener('click', function () {
        chips.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        categoriaAtiva = b.dataset.cat;
        render();
      });
    });
  }

  if (chips) {
    desenharChips();

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
      var alvo = semAcento(p.n + ' ' + p.m + ' ' + p.c + ' ' + (p.ean || ''));
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
      recorte = LIMITE ? variados(lista, LIMITE) : lista;
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

  /* usado quando o banco responde depois da primeira pintura */
  window.NEON.redesenhar = function () {
    desenharChips();
    render();
  };
  }

  /* Primeiro desenho, imediato, com a lista que mora neste arquivo.
     O banco no plano free demora a acordar, e esperar por ele deixaria a
     pagina vazia por segundos. */
  PRODUTOS = PRODUTOS_EXEMPLO.map(function (x, i) {
    x.id = 'p' + i;
    return x;
  });
  window.NEON.origemCatalogo = 'exemplo';
  montarCatalogo();

  /* Segundo desenho, quando o banco responde: precos e produtos de verdade. */
  carregarProdutos().then(function (origem) {
    window.NEON.origemCatalogo = origem;
    if (origem === 'banco' && window.NEON.redesenhar) window.NEON.redesenhar();
  });
})();
