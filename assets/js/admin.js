/* =========================================================
   LOJAS NEON  |  painel de produtos

   Funciona de dois jeitos:
   - Com o Supabase configurado no config.js: login e dados de verdade.
   - Sem configuracao: modo demonstracao, guardando no proprio navegador,
     so para conhecer a tela. Nada disso chega no site.

   A importacao de planilha acha cada produto pelo codigo de barras.
   ========================================================= */

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var CATEGORIAS_SUGERIDAS = ['Elétrica', 'Hidráulica', 'Chuveiros', 'Iluminação',
    'Ventilação', 'Químicos', 'Bombas', 'Ferramentas', 'Ferragens'];

  var UNIDADES = { un: 'Unidade', m: 'Metro', pc: 'Peça' };

  var temBanco = window.NEON && window.NEON.temBanco && window.NEON.temBanco();
  var sb = null;
  var produtos = [];
  var editando = null;
  var fotoNova = null;      // File escolhido na janela, ainda nao enviado
  var planoImport = null;   // alteracoes lidas da planilha, esperando confirmacao

  /* =========================================================
     RECADOS
     ========================================================= */
  function recado(texto, tipo) {
    var el = document.createElement('div');
    el.className = 'recado' + (tipo ? ' ' + tipo : '');
    el.textContent = texto;
    $('recados').appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity .25s';
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 260);
    }, 3600);
  }

  /* =========================================================
     UTILIDADES
     ========================================================= */
  function precoParaNumero(txt) {
    if (txt === null || txt === undefined) return null;
    if (typeof txt === 'number') return isNaN(txt) ? null : Math.round(txt * 100) / 100;
    var limpo = String(txt).trim().replace(/[R$\s]/g, '');
    if (limpo === '') return null;
    // "1.234,56" vira 1234.56 ; "199.99" continua 199.99
    if (limpo.indexOf(',') !== -1) limpo = limpo.replace(/\./g, '').replace(',', '.');
    var n = Number(limpo);
    return isNaN(n) ? null : Math.round(n * 100) / 100;
  }

  function precoParaTexto(n) {
    if (n === null || n === undefined || n === '') return '';
    return Number(n).toFixed(2).replace('.', ',');
  }

  function soDigitos(v) {
    return String(v === null || v === undefined ? '' : v).replace(/\D/g, '');
  }

  function semAcento(t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function escapa(t) {
    return String(t === null || t === undefined ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function normalizaUnidade(v) {
    var t = semAcento(String(v || '')).trim();
    if (t === 'm' || t === 'mt' || t === 'metro' || t === 'metros') return 'm';
    if (t === 'pc' || t === 'pç' || t === 'peca' || t === 'pecas') return 'pc';
    if (t === '') return '';
    return 'un';
  }

  /* A descricao do sistema da loja vem em caixa alta e termina com a marca.
     Vira frase normal, sem a marca repetida, e com 40A, 220V, 9W e 6500K no lugar. */
  function descricaoParaNome(d, marca) {
    var t = String(d || '').replace(/\s+/g, ' ').trim();
    var m = String(marca || '').trim();
    if (m && semAcento(t).slice(-m.length - 1) === ' ' + semAcento(m)) {
      t = t.slice(0, t.length - m.length - 1).trim();
    }
    t = t.toLowerCase().replace(/(\d)(kva|kw|va|a|v|w|k)\b/g, function (x, n, u) {
      return n + u.toUpperCase();
    }).replace(/\bcurva ([bcd])\b/g, function (x, l) {
      return 'curva ' + l.toUpperCase();
    });
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
  }

  /* SIL vira Sil, TRAMONTINA vira Tramontina; sigla curta como 3M fica como esta */
  function marcaBonita(m) {
    var t = String(m || '').trim();
    if (!t || t.length <= 3 || /\d/.test(t) || t !== t.toUpperCase()) return t;
    return t.toLowerCase().replace(/(^|\s)(\S)/g, function (x, e, l) { return e + l.toUpperCase(); });
  }

  /* igual para efeito de importacao: ignora maiuscula, acento e espaco sobrando */
  function mesmoTexto(a, b) {
    return semAcento(String(a || '').trim()) === semAcento(String(b || '').trim());
  }

  /* =========================================================
     CAMADA DE DADOS
     ========================================================= */
  var CHAVE_DEMO = 'neon.demo.produtos.v2';

  /* Planilha real do dono. Gerado a partir de supabase/produtos-iniciais.json */
  var SEMENTE = [
      {
          "ean": "7897381600577",
          "nome": "Cabo flexível 1,5mm preto, rolo 100m",
          "marca": "Sil",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 199.99
      },
      {
          "ean": "7897381614000",
          "nome": "Cabo flexível 1,5mm preto, por metro",
          "marca": "Sil",
          "categoria": "Elétrica",
          "unidade": "m",
          "preco": 2.31
      },
      {
          "ean": "7897381600621",
          "nome": "Cabo flexível 2,5mm preto, rolo 100m",
          "marca": "Sil",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 296.99
      },
      {
          "ean": "7897381614086",
          "nome": "Cabo flexível 2,5mm preto, por metro",
          "marca": "Sil",
          "categoria": "Elétrica",
          "unidade": "m",
          "preco": 3.69
      },
      {
          "ean": "7897381600676",
          "nome": "Cabo flexível 4mm preto, rolo 100m",
          "marca": "Sil",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 514.9
      },
      {
          "ean": "7897381636149",
          "nome": "Cabo flexível 4mm preto, por metro",
          "marca": "Sil",
          "categoria": "Elétrica",
          "unidade": "m",
          "preco": 5.99
      },
      {
          "ean": "7897381600720",
          "nome": "Cabo flexível 6mm preto, rolo 100m",
          "marca": "Sil",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 769.99
      },
      {
          "ean": "7897381636194",
          "nome": "Cabo flexível 6mm preto, por metro",
          "marca": "Sil",
          "categoria": "Elétrica",
          "unidade": "m",
          "preco": 8.99
      },
      {
          "ean": "7897381636248",
          "nome": "Cabo flexível 10mm preto, por metro",
          "marca": "Sil",
          "categoria": "Elétrica",
          "unidade": "m",
          "preco": 16.9
      },
      {
          "ean": "7897381636293",
          "nome": "Cabo flexível 16mm preto, por metro",
          "marca": "Sil",
          "categoria": "Elétrica",
          "unidade": "m",
          "preco": 28.5
      },
      {
          "ean": "7891435933581",
          "nome": "Conjunto interruptor simples 6A 250V Aria branco",
          "marca": "Tramontina",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 8.7
      },
      {
          "ean": "7891435937626",
          "nome": "Conjunto interruptor paralelo 6A 250V Aria branco",
          "marca": "Tramontina",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 14.4
      },
      {
          "ean": "7891435932577",
          "nome": "Conjunto tomada 2P+T 10A 250V Aria branco",
          "marca": "Tramontina",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 7.5
      },
      {
          "ean": "7891435933598",
          "nome": "Conjunto tomada 2P+T 20A 250V Aria branco",
          "marca": "Tramontina",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 8.9
      },
      {
          "ean": "7891435933888",
          "nome": "Conjunto tomada dupla 2P+T 10A 250V Aria branco",
          "marca": "Tramontina",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 15.9
      },
      {
          "ean": "7891435937916",
          "nome": "Conjunto 2 interruptores simples 6A 250V Aria branco",
          "marca": "Tramontina",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 14.99
      },
      {
          "ean": "7891435938081",
          "nome": "Conjunto interruptor simples 6A e tomada 2P+T 10A Aria branco",
          "marca": "Tramontina",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 14.06
      },
      {
          "ean": "7890203455379",
          "nome": "Fita isolante Imperial Slim 18mm x 5m",
          "marca": "3M",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 5.9
      },
      {
          "ean": "7891040106363",
          "nome": "Fita isolante Imperial Slim 18mm x 10m",
          "marca": "3M",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 9.9
      },
      {
          "ean": "7891040105502",
          "nome": "Fita isolante Imperial Slim 18mm x 20m",
          "marca": "3M",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 14.9
      },
      {
          "ean": "7890203418060",
          "nome": "Fita isolante Scotch 33+ 19mm x 20m",
          "marca": "3M",
          "categoria": "Elétrica",
          "unidade": "pc",
          "preco": 39.9
      },
      {
          "ean": "9000000049765",
          "nome": "Conector de porcelana trifásico 10mm",
          "marca": "Foxlux",
          "categoria": "Elétrica",
          "unidade": "un",
          "preco": 3.9
      },
      {
          "ean": "7897801301596",
          "nome": "Sifão multiuso simples com tubo extensível",
          "marca": "Krona",
          "categoria": "Hidráulica",
          "unidade": "un",
          "preco": 7.9
      },
      {
          "ean": "7897613336946",
          "nome": "Fita veda rosca 18mm x 10m",
          "marca": "Tigre",
          "categoria": "Hidráulica",
          "unidade": "un",
          "preco": 3.81
      },
      {
          "ean": "7897613336953",
          "nome": "Fita veda rosca 18mm x 25m",
          "marca": "Tigre",
          "categoria": "Hidráulica",
          "unidade": "un",
          "preco": 7.67
      },
      {
          "ean": "7897613336960",
          "nome": "Fita veda rosca 18mm x 50m",
          "marca": "Tigre",
          "categoria": "Hidráulica",
          "unidade": "un",
          "preco": 15.1
      },
      {
          "ean": "7908649631889",
          "nome": "Ducha Ballerina 3 temperaturas 220V 5350W branca",
          "marca": "Zagonel",
          "categoria": "Chuveiros",
          "unidade": "un",
          "preco": 52.9
      },
      {
          "ean": "7897273200335",
          "nome": "Ducha Ideale Plus 4 temperaturas 220V 6800W branca",
          "marca": "Zagonel",
          "categoria": "Chuveiros",
          "unidade": "un",
          "preco": 69.9
      },
      {
          "ean": "7908649605637",
          "nome": "Ducha Moment eletrônica 220V 7500W branca",
          "marca": "Zagonel",
          "categoria": "Chuveiros",
          "unidade": "un",
          "preco": 132.9
      },
      {
          "ean": "7896451824806",
          "nome": "Maxi Ducha 220V 5500W",
          "marca": "Lorenzetti",
          "categoria": "Chuveiros",
          "unidade": "un",
          "preco": 115.99
      },
      {
          "ean": "7896451844859",
          "nome": "Bella Ducha Ultra 220V 6800W branca",
          "marca": "Lorenzetti",
          "categoria": "Chuveiros",
          "unidade": "un",
          "preco": 119.9
      },
      {
          "ean": "7896451879035",
          "nome": "Ducha Loren Shower eletrônica 220V 7500W",
          "marca": "Lorenzetti",
          "categoria": "Chuveiros",
          "unidade": "un",
          "preco": 188.89
      },
      {
          "ean": "7898586133563",
          "nome": "Lâmpada LED bulbo 9W 6500K bivolt",
          "marca": "Foxlux",
          "categoria": "Iluminação",
          "unidade": "un",
          "preco": 3.99
      },
      {
          "ean": "7898586132146",
          "nome": "Lâmpada LED bulbo 15W 6500K bivolt",
          "marca": "Foxlux",
          "categoria": "Iluminação",
          "unidade": "un",
          "preco": 10.95
      },
      {
          "ean": "7898586132108",
          "nome": "Lâmpada LED alta potência 20W 6500K bivolt",
          "marca": "Foxlux",
          "categoria": "Iluminação",
          "unidade": "un",
          "preco": 14.9
      },
      {
          "ean": "7898586132115",
          "nome": "Lâmpada LED alta potência 30W 6500K bivolt",
          "marca": "Foxlux",
          "categoria": "Iluminação",
          "unidade": "un",
          "preco": 24.9
      },
      {
          "ean": "7898586132122",
          "nome": "Lâmpada LED alta potência 40W 6500K bivolt",
          "marca": "Foxlux",
          "categoria": "Iluminação",
          "unidade": "un",
          "preco": 34.9
      },
      {
          "ean": "7898586134454",
          "nome": "Lâmpada LED alta potência 50W 6500K bivolt",
          "marca": "Foxlux",
          "categoria": "Iluminação",
          "unidade": "un",
          "preco": 41.9
      },
      {
          "ean": "7898586137035",
          "nome": "Lâmpada LED alta potência 100W 6500K bivolt",
          "marca": "Foxlux",
          "categoria": "Iluminação",
          "unidade": "un",
          "preco": 109.9
      },
      {
          "ean": "7897192714494",
          "nome": "Ventilador de teto Citrino 127V 130W 3 pás branco",
          "marca": "Tron",
          "categoria": "Ventilação",
          "unidade": "pc",
          "preco": 299.99
      },
      {
          "ean": "7908412519208",
          "nome": "Ventilador de mesa 40cm 127V 140W preto",
          "marca": "Elgin",
          "categoria": "Ventilação",
          "unidade": "un",
          "preco": 209.99
      },
      {
          "ean": "7898567700944",
          "nome": "Óleo desengripante spray 300ml",
          "marca": "Lub Fast",
          "categoria": "Químicos",
          "unidade": "un",
          "preco": 8.5
      },
      {
          "ean": "7898965442477",
          "nome": "Cola selante PU40 branca 400g",
          "marca": "Cibraflex",
          "categoria": "Químicos",
          "unidade": "un",
          "preco": 13.9
      }
  ];

  var Demo = {
    ler: function () {
      var lista;
      try { lista = JSON.parse(localStorage.getItem(CHAVE_DEMO)); } catch (e) { lista = null; }
      if (!lista) {
        lista = SEMENTE.map(function (p, i) {
          return {
            id: 'demo-' + i, codigo_barras: p.ean, nome: p.nome, marca: p.marca,
            categoria: p.categoria, unidade: p.unidade, preco: p.preco,
            foto_url: 'assets/img/produtos/' + p.ean + '.jpg', ativo: true, ordem: i
          };
        });
        Demo.gravar(lista);
      }
      return lista;
    },
    gravar: function (lista) {
      try { localStorage.setItem(CHAVE_DEMO, JSON.stringify(lista)); } catch (e) { /* aba privada */ }
    },
    entrar: function () { return Promise.resolve({ email: 'demonstração' }); },
    sair: function () { sessionStorage.removeItem('neon.demo.sessao'); return Promise.resolve(); },
    sessao: function () {
      return Promise.resolve(sessionStorage.getItem('neon.demo.sessao')
        ? { email: 'demonstração' } : null);
    },
    listar: function () { return Promise.resolve(Demo.ler()); },
    criar: function (d) {
      var lista = Demo.ler();
      d.id = 'demo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      lista.push(d);
      Demo.gravar(lista);
      return Promise.resolve(d);
    },
    atualizar: function (id, d) {
      var lista = Demo.ler().map(function (p) {
        return p.id === id ? Object.assign({}, p, d) : p;
      });
      Demo.gravar(lista);
      return Promise.resolve();
    },
    excluir: function (id) {
      Demo.gravar(Demo.ler().filter(function (p) { return p.id !== id; }));
      return Promise.resolve();
    },
    enviarFoto: function (file) {
      return new Promise(function (ok, falha) {
        var fr = new FileReader();
        fr.onload = function () { ok(fr.result); };
        fr.onerror = function () { falha(new Error('não consegui ler o arquivo')); };
        fr.readAsDataURL(file);
      });
    }
  };

  var Banco = {
    entrar: function (email, senha) {
      return sb.auth.signInWithPassword({ email: email, password: senha })
        .then(function (r) {
          if (r.error) throw r.error;
          return r.data.user;
        });
    },
    sair: function () { return sb.auth.signOut(); },
    sessao: function () {
      return sb.auth.getSession().then(function (r) {
        return r.data.session ? r.data.session.user : null;
      });
    },
    listar: function () {
      return sb.from('produtos').select('*').order('ordem').order('nome')
        .then(function (r) {
          if (r.error) throw r.error;
          return r.data;
        });
    },
    criar: function (d) {
      return sb.from('produtos').insert(d).select().single()
        .then(function (r) { if (r.error) throw r.error; return r.data; });
    },
    atualizar: function (id, d) {
      return sb.from('produtos').update(d).eq('id', id)
        .then(function (r) { if (r.error) throw r.error; });
    },
    excluir: function (id) {
      return sb.from('produtos').delete().eq('id', id)
        .then(function (r) { if (r.error) throw r.error; });
    },
    enviarFoto: function (file) {
      var ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      var nome = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
      return sb.storage.from('produtos').upload(nome, file, { upsert: false })
        .then(function (r) {
          if (r.error) throw r.error;
          return sb.storage.from('produtos').getPublicUrl(nome).data.publicUrl;
        });
    }
  };

  var API = Demo;

  if (temBanco && window.supabase) {
    try {
      sb = window.supabase.createClient(
        window.NEON.config.SUPABASE_URL,
        window.NEON.config.SUPABASE_ANON_KEY
      );
      API = Banco;
    } catch (e) {
      temBanco = false;
      if (window.console) console.warn('Supabase não iniciou:', e.message);
    }
  }

  /* =========================================================
     LOGIN
     ========================================================= */
  function mostrarErro(txt) {
    $('erroEntradaTexto').textContent = txt;
    $('erroEntrada').hidden = false;
  }

  if (!temBanco) {
    $('avisoDemo').hidden = false;
    $('botaoDemo').hidden = false;
    $('formEntrada').hidden = true;
  }

  $('botaoDemo').addEventListener('click', function () {
    sessionStorage.setItem('neon.demo.sessao', '1');
    abrirPainel({ email: 'demonstração' });
  });

  /* Três tentativas e o painel descansa 5 minutos.
     Isso e so um freio de mao: quem confere a senha de verdade e o Supabase,
     que tambem tem limite proprio de tentativas por minuto. */
  var CHAVE_TENTATIVAS = 'neon.painel.tentativas';
  var LIMITE = 3;
  var ESPERA = 5 * 60 * 1000;

  function tentativas() {
    try { return JSON.parse(localStorage.getItem(CHAVE_TENTATIVAS)) || { erros: 0, ate: 0 }; }
    catch (e) { return { erros: 0, ate: 0 }; }
  }

  function guardaTentativas(t) {
    try { localStorage.setItem(CHAVE_TENTATIVAS, JSON.stringify(t)); } catch (e) {}
  }

  function minutosQueFaltam(ate) {
    return Math.max(1, Math.ceil((ate - Date.now()) / 60000));
  }

  $('formEntrada').addEventListener('submit', function (e) {
    e.preventDefault();
    $('erroEntrada').hidden = true;

    var t = tentativas();
    if (t.ate > Date.now()) {
      mostrarErro('Muitas tentativas. Tente de novo em ' + minutosQueFaltam(t.ate) + ' minutos.');
      return;
    }

    var b = $('botaoEntrar');
    b.disabled = true;
    b.textContent = 'Entrando';

    var email = (window.NEON.config && window.NEON.config.PAINEL_EMAIL) || '';
    API.entrar(email, $('senha').value)
      .then(function (u) {
        guardaTentativas({ erros: 0, ate: 0 });
        abrirPainel(u);
      })
      .catch(function (err) {
        var m = (err && err.message) || '';
        if (/invalid login/i.test(m)) {
          var t2 = tentativas();
          t2.erros = (t2.erros || 0) + 1;
          if (t2.erros >= LIMITE) {
            t2.erros = 0;
            t2.ate = Date.now() + ESPERA;
            m = 'Senha errada três vezes. O painel só aceita outra tentativa daqui a 5 minutos.';
          } else {
            m = 'Senha não confere. ' + (LIMITE - t2.erros) +
              (LIMITE - t2.erros === 1 ? ' tentativa restante.' : ' tentativas restantes.');
          }
          guardaTentativas(t2);
          $('senha').value = '';
        } else if (/email not confirmed/i.test(m)) {
          m = 'A conta do painel ainda não foi confirmada no Supabase.';
        } else if (!m) {
          m = 'Não consegui entrar. Tente de novo.';
        }
        mostrarErro(m);
      })
      .then(function () {
        b.disabled = false;
        b.textContent = 'Entrar';
        $('senha').focus();
      });
  });

  $('botaoSair').addEventListener('click', function () {
    API.sair().then(function () { location.reload(); });
  });

  function abrirPainel(usuario) {
    $('telaEntrada').hidden = true;
    $('telaPainel').hidden = false;
    $('quemEntrou').textContent = 'Painel da loja';
    if (!temBanco) {
      $('faixaDemo').hidden = false;
      $('etiquetaModo').textContent = 'Demonstração';
    }
    carregar();
  }

  /* =========================================================
     LISTA
     ========================================================= */
  function carregar() {
    $('carregando').hidden = false;
    $('caixaTabela').hidden = true;
    $('vazioAdm').hidden = true;

    return API.listar()
      .then(function (lista) {
        produtos = lista || [];
        preencherFiltros();
        desenhar();
      })
      .catch(function (err) {
        $('carregando').hidden = true;
        recado('Não consegui carregar: ' + (err.message || 'erro'), 'erro');
      });
  }

  function preencherFiltros() {
    var cats = [];
    var marcas = [];
    produtos.forEach(function (p) {
      if (p.categoria && cats.indexOf(p.categoria) === -1) cats.push(p.categoria);
      if (p.marca && marcas.indexOf(p.marca) === -1) marcas.push(p.marca);
    });
    CATEGORIAS_SUGERIDAS.forEach(function (c) { if (cats.indexOf(c) === -1) cats.push(c); });
    cats.sort();
    marcas.sort();

    var sel = $('filtroCategoria');
    var atual = sel.value;
    sel.innerHTML = '<option value="">Todas as categorias</option>' +
      cats.map(function (c) { return '<option>' + escapa(c) + '</option>'; }).join('');
    sel.value = atual;

    $('listaCategorias').innerHTML = cats.map(function (c) { return '<option value="' + escapa(c) + '">'; }).join('');
    $('listaMarcas').innerHTML = marcas.map(function (m) { return '<option value="' + escapa(m) + '">'; }).join('');
  }

  function filtrados() {
    var termo = semAcento($('buscaAdm').value.trim());
    var cat = $('filtroCategoria').value;
    var sit = $('filtroSituacao').value;

    return produtos.filter(function (p) {
      if (cat && p.categoria !== cat) return false;
      if (sit === 'ativo' && !p.ativo) return false;
      if (sit === 'inativo' && p.ativo) return false;
      if (!termo) return true;
      var alvo = semAcento(p.nome + ' ' + (p.marca || '') + ' ' + p.categoria + ' ' + (p.codigo_barras || ''));
      return termo.split(/\s+/).every(function (parte) { return alvo.indexOf(parte) !== -1; });
    });
  }

  var LAPIS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
  var LIXO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
  var SEM_FOTO = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><circle cx="8.5" cy="10" r="2"/><path d="m2.5 16.5 5-4.5 4.5 4 3.5-3 6 5.5"/></svg>';

  function textoContagem(qtdFiltro) {
    var ativos = produtos.filter(function (p) { return p.ativo; }).length;
    return '<b>' + produtos.length + '</b> produtos no total, <b>' + ativos + '</b> aparecendo no site' +
      (qtdFiltro !== undefined && qtdFiltro !== produtos.length
        ? '. Mostrando <b>' + qtdFiltro + '</b> pelo filtro.' : '.');
  }

  function desenhar() {
    $('carregando').hidden = true;
    var lista = filtrados();
    $('contagem').innerHTML = textoContagem(lista.length);

    if (!lista.length) {
      $('caixaTabela').hidden = true;
      $('vazioAdm').hidden = false;
      var filtrando = produtos.length > 0;
      $('vazioTitulo').textContent = filtrando ? 'Nada encontrado com esse filtro' : 'Nenhum produto por aqui';
      $('vazioTexto').textContent = filtrando
        ? 'Tente outro termo, ou limpe a busca e os filtros.'
        : 'Cadastre o primeiro produto, ou importe uma planilha.';
      $('botaoNovoVazio').hidden = filtrando;
      return;
    }

    $('vazioAdm').hidden = true;
    $('caixaTabela').hidden = false;

    $('corpoTabela').innerHTML = lista.map(function (p) {
      var foto = p.foto_url
        ? '<img class="miniatura" src="' + escapa(enderecoFoto(p.foto_url)) + '" alt="">'
        : '<div class="miniatura-vazia">' + SEM_FOTO + '</div>';
      var partes = [];
      if (p.marca) partes.push(escapa(p.marca));
      if (p.codigo_barras) partes.push('<span class="codigo">' + escapa(p.codigo_barras) + '</span>');

      return '<tr data-id="' + escapa(p.id) + '"' + (p.ativo ? '' : ' class="linha-inativa"') + '>' +
        '<td class="cel-foto">' + foto + '</td>' +
        '<td class="cel-nome"><b>' + escapa(p.nome) + '</b>' +
          (partes.length ? '<span>' + partes.join(' · ') + '</span>' : '') +
        '</td>' +
        '<td><span class="marcador">' + escapa(p.categoria) + '</span></td>' +
        '<td class="cel-preco"><div class="preco-campo"><span>R$</span>' +
          '<input type="text" inputmode="decimal" value="' + escapa(precoParaTexto(p.preco)) +
          '" placeholder="a consultar" data-preco aria-label="Preço de ' + escapa(p.nome) + '"></div>' +
          (p.unidade === 'm' ? '<span class="preco-unid">por metro</span>' : '') +
        '</td>' +
        '<td class="cel-ativo"><label class="chave"><input type="checkbox" data-ativo' +
          (p.ativo ? ' checked' : '') + ' aria-label="Mostrar no site"><i></i></label></td>' +
        '<td class="cel-acoes">' +
          '<button class="icone-b" data-editar title="Editar">' + LAPIS + '</button>' +
          '<button class="icone-b perigo" data-excluir title="Excluir">' + LIXO + '</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    ligarLinhas();
  }

  function achar(id) {
    return produtos.filter(function (p) { return String(p.id) === String(id); })[0];
  }

  function ligarLinhas() {
    $('corpoTabela').querySelectorAll('tr').forEach(function (tr) {
      var id = tr.dataset.id;

      var campo = tr.querySelector('[data-preco]');
      var antes = campo.value;
      campo.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); campo.blur(); }
        if (e.key === 'Escape') { campo.value = antes; campo.blur(); }
      });
      campo.addEventListener('blur', function () {
        if (campo.value === antes) return;
        var novo = precoParaNumero(campo.value);
        campo.value = precoParaTexto(novo);
        if (campo.value === antes) return;

        API.atualizar(id, { preco: novo })
          .then(function () {
            var p = achar(id);
            if (p) p.preco = novo;
            antes = campo.value;
            campo.parentNode.classList.add('salvo');
            setTimeout(function () { campo.parentNode.classList.remove('salvo'); }, 900);
            recado('Preço salvo', 'ok');
          })
          .catch(function (err) {
            campo.value = antes;
            recado('Não salvou: ' + (err.message || 'erro'), 'erro');
          });
      });

      var chave = tr.querySelector('[data-ativo]');
      chave.addEventListener('change', function () {
        var valor = chave.checked;
        API.atualizar(id, { ativo: valor })
          .then(function () {
            var p = achar(id);
            if (p) p.ativo = valor;
            tr.classList.toggle('linha-inativa', !valor);
            $('contagem').innerHTML = textoContagem();
            recado(valor ? 'Produto aparecendo no site' : 'Produto escondido do site', 'ok');
          })
          .catch(function (err) {
            chave.checked = !valor;
            recado('Não salvou: ' + (err.message || 'erro'), 'erro');
          });
      });

      tr.querySelector('[data-editar]').addEventListener('click', function () {
        abrirJanela(achar(id));
      });

      tr.querySelector('[data-excluir]').addEventListener('click', function () {
        var p = achar(id);
        if (!p) return;
        if (!confirm('Excluir "' + p.nome + '"?\n\nIsso apaga o produto de vez. Se for só para tirar do site, use a chavinha da coluna "No site".')) return;
        API.excluir(id)
          .then(function () {
            produtos = produtos.filter(function (x) { return String(x.id) !== String(id); });
            desenhar();
            recado('Produto excluído', 'ok');
          })
          .catch(function (err) { recado('Não excluiu: ' + (err.message || 'erro'), 'erro'); });
      });
    });
  }

  var atraso;
  $('buscaAdm').addEventListener('input', function () {
    clearTimeout(atraso);
    atraso = setTimeout(desenhar, 180);
  });
  $('filtroCategoria').addEventListener('change', desenhar);
  $('filtroSituacao').addEventListener('change', desenhar);

  /* =========================================================
     JANELA DE EDICAO
     ========================================================= */
  /* O painel pode estar em /admin/, uma pasta abaixo do site. A foto gravada
     no banco e relativa a raiz ("assets/img/produtos/x.jpg"), entao aqui ela
     precisa de um ".." na frente para nao virar /admin/assets/... */
  function enderecoFoto(u) {
    var t = String(u || '');
    if (!t || /^(https?:|data:|\/)/.test(t)) return t;
    return /\/admin\/?$/.test(location.pathname.replace(/[^/]*$/, '')) ? '../' + t : t;
  }

  function preverFoto(url) {
    url = enderecoFoto(url);
    if (url) {
      $('fotoPrevia').src = url;
      $('fotoPrevia').hidden = false;
      $('fotoVazia').hidden = true;
      $('botaoTirarFoto').hidden = false;
    } else {
      $('fotoPrevia').hidden = true;
      $('fotoPrevia').removeAttribute('src');
      $('fotoVazia').hidden = false;
      $('botaoTirarFoto').hidden = true;
    }
  }

  function abrirJanela(p) {
    editando = p || null;
    fotoNova = null;
    $('tituloJanela').textContent = p ? 'Editar produto' : 'Novo produto';
    $('pNome').value = p ? p.nome : '';
    $('pCodigo').value = p ? (p.codigo_barras || '') : '';
    $('pMarca').value = p ? (p.marca || '') : '';
    $('pCategoria').value = p ? p.categoria : '';
    $('pPreco').value = p ? precoParaTexto(p.preco) : '';
    $('pUnidade').value = p ? (p.unidade || 'un') : 'un';
    $('pOrdem').value = p ? (p.ordem || 0) : 0;
    $('pFoto').value = p ? (p.foto_url && p.foto_url.indexOf('data:') !== 0 ? p.foto_url : '') : '';
    $('pAtivo').checked = p ? !!p.ativo : true;
    preverFoto(p ? p.foto_url : '');
    $('cortina').hidden = false;
    setTimeout(function () { $('pNome').focus(); }, 40);
  }

  function fecharJanela() {
    $('cortina').hidden = true;
    editando = null;
    fotoNova = null;
    $('pArquivo').value = '';
  }

  $('botaoNovo').addEventListener('click', function () { abrirJanela(null); });
  $('botaoNovoVazio').addEventListener('click', function () { abrirJanela(null); });
  $('fecharJanela').addEventListener('click', fecharJanela);
  $('cancelarJanela').addEventListener('click', fecharJanela);
  $('cortina').addEventListener('click', function (e) {
    if (e.target === $('cortina')) fecharJanela();
  });

  $('botaoFoto').addEventListener('click', function () { $('pArquivo').click(); });
  $('pArquivo').addEventListener('change', function () {
    var f = $('pArquivo').files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      recado('Imagem muito grande. O limite é 5 MB.', 'erro');
      $('pArquivo').value = '';
      return;
    }
    fotoNova = f;
    preverFoto(URL.createObjectURL(f));
    $('pFoto').value = '';
  });
  $('botaoTirarFoto').addEventListener('click', function () {
    fotoNova = null;
    $('pArquivo').value = '';
    $('pFoto').value = '';
    preverFoto('');
  });
  $('pFoto').addEventListener('change', function () {
    fotoNova = null;
    preverFoto($('pFoto').value.trim());
  });

  /* Enter dentro da janela salva, em vez de recarregar a pagina e perder o que foi digitado */
  $('formProduto').addEventListener('submit', function (e) {
    e.preventDefault();
    $('salvarProduto').click();
  });

  $('salvarProduto').addEventListener('click', function () {
    var nome = $('pNome').value.trim();
    var categoria = $('pCategoria').value.trim();
    var codigo = soDigitos($('pCodigo').value);
    if (!nome) { recado('O produto precisa de um nome.', 'erro'); $('pNome').focus(); return; }
    if (!categoria) { recado('Escolha uma categoria.', 'erro'); $('pCategoria').focus(); return; }

    var repetido = codigo && produtos.filter(function (x) {
      return x.codigo_barras === codigo && (!editando || String(x.id) !== String(editando.id));
    })[0];
    if (repetido) {
      recado('Esse código de barras já é do produto "' + repetido.nome + '".', 'erro');
      $('pCodigo').focus();
      return;
    }

    var b = $('salvarProduto');
    b.disabled = true;
    b.textContent = 'Salvando';

    var fotoAtual = editando ? editando.foto_url : '';
    var enviaFoto = fotoNova
      ? API.enviarFoto(fotoNova)
      : Promise.resolve($('pFoto').value.trim() || ($('fotoPrevia').hidden ? '' : fotoAtual));

    enviaFoto
      .then(function (url) {
        var dados = {
          codigo_barras: codigo || null,
          nome: nome,
          marca: $('pMarca').value.trim(),
          categoria: categoria,
          unidade: $('pUnidade').value,
          preco: precoParaNumero($('pPreco').value),
          foto_url: url || '',
          ativo: $('pAtivo').checked,
          ordem: parseInt($('pOrdem').value, 10) || 0
        };
        return editando ? API.atualizar(editando.id, dados).then(function () { return dados; })
                        : API.criar(dados);
      })
      .then(function (salvo) {
        if (editando) {
          var p = achar(editando.id);
          if (p) Object.assign(p, salvo);
          recado('Produto atualizado', 'ok');
        } else {
          produtos.push(salvo);
          recado('Produto cadastrado', 'ok');
        }
        fecharJanela();
        preencherFiltros();
        desenhar();
      })
      .catch(function (err) {
        recado('Não salvou: ' + (err.message || 'erro'), 'erro');
      })
      .then(function () {
        b.disabled = false;
        b.textContent = 'Salvar';
      });
  });

  /* =========================================================
     PLANILHA: EXPORTAR
     As colunas saem com os mesmos nomes que a importacao entende,
     entao da para exportar, mexer no Excel e importar de volta.
     ========================================================= */
  function temPlanilha() {
    if (window.XLSX) return true;
    recado('A biblioteca de planilha não carregou. Confira a internet e recarregue a página.', 'erro');
    return false;
  }

  $('botaoExportar').addEventListener('click', function () {
    if (!temPlanilha()) return;
    if (!produtos.length) { recado('Não há produtos para exportar.', 'erro'); return; }

    var linhas = produtos.slice().sort(function (a, b) {
      return (a.categoria || '').localeCompare(b.categoria || '', 'pt-BR') ||
             (a.nome || '').localeCompare(b.nome || '', 'pt-BR');
    }).map(function (p) {
      return {
        'Código de Barras': p.codigo_barras || '',
        'Nome no site': p.nome,
        'Marca': p.marca || '',
        'Categoria': p.categoria || '',
        'UN': (p.unidade || 'un').toUpperCase(),
        'Preço': p.preco === null || p.preco === undefined || p.preco === '' ? '' : Number(p.preco),
        'No site': p.ativo ? 'Sim' : 'Não'
      };
    });

    var folha = XLSX.utils.json_to_sheet(linhas);
    folha['!cols'] = [{ wch: 16 }, { wch: 54 }, { wch: 14 }, { wch: 14 }, { wch: 5 }, { wch: 11 }, { wch: 8 }];
    // codigo de barras como texto, senao o Excel mostra 7,89E+12
    var fim = XLSX.utils.decode_range(folha['!ref']);
    for (var r = 1; r <= fim.e.r; r++) {
      var cel = folha[XLSX.utils.encode_cell({ r: r, c: 0 })];
      if (cel) { cel.t = 's'; cel.z = '@'; }
      var preco = folha[XLSX.utils.encode_cell({ r: r, c: 5 })];
      if (preco && preco.t === 'n') preco.z = '#,##0.00';
    }

    var livro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(livro, folha, 'Produtos');
    var hoje = new Date();
    var data = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-' +
      String(hoje.getDate()).padStart(2, '0');
    XLSX.writeFile(livro, 'produtos-lojas-neon-' + data + '.xlsx');
    recado(produtos.length + ' produtos exportados', 'ok');
  });

  /* =========================================================
     PLANILHA: IMPORTAR
     1. Le a planilha e acha as colunas pelo nome, com ou sem acento.
     2. Casa cada linha com um produto pelo codigo de barras.
     3. Mostra o que vai mudar e so aplica depois da confirmacao.

     Produto que ja existe: atualiza preco, e tambem nome, marca, categoria,
     unidade e visibilidade quando essas colunas vierem preenchidas.
     O nome so e trocado pela coluna "Nome no site". A "Descricao" do sistema
     da loja vem em caixa alta e abreviada, entao ela so serve para batizar
     produto novo, nunca para sobrescrever um nome ja arrumado.
     ========================================================= */
  var APELIDOS = {
    codigo: ['codigo de barras', 'codigo', 'cod barras', 'cod. barras', 'ean', 'gtin', 'codigo barras'],
    nome: ['nome no site', 'nome'],
    descricao: ['descricao', 'descricao do produto', 'produto'],
    marca: ['marca', 'fabricante'],
    categoria: ['categoria'],
    unidade: ['un', 'unidade', 'und', 'unid'],
    preco: ['preco', 'valor', 'preco de venda', 'preco venda'],
    ativo: ['no site', 'ativo', 'mostrar no site', 'visivel']
  };

  function chaveCabecalho(t) {
    return semAcento(String(t || '')).replace(/[._]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function mapaColunas(cabecalhos) {
    var mapa = {};
    cabecalhos.forEach(function (h) {
      var k = chaveCabecalho(h);
      Object.keys(APELIDOS).forEach(function (campo) {
        if (!mapa[campo] && APELIDOS[campo].indexOf(k) !== -1) mapa[campo] = h;
      });
    });
    return mapa;
  }

  function simNao(v) {
    var t = semAcento(String(v === undefined || v === null ? '' : v)).trim();
    if (t === '') return null;
    if (['sim', 's', 'yes', 'x', '1', 'true', 'ativo'].indexOf(t) !== -1) return true;
    if (['nao', 'n', 'no', '0', 'false', 'inativo'].indexOf(t) !== -1) return false;
    return null;
  }

  function montaPlano(linhas, mapa) {
    var porCodigo = {};
    produtos.forEach(function (p) { if (p.codigo_barras) porCodigo[p.codigo_barras] = p; });

    var plano = { atualizar: [], criar: [], iguais: 0, semCodigo: 0, repetidos: 0 };
    var vistos = {};

    linhas.forEach(function (l) {
      var codigo = soDigitos(mapa.codigo ? l[mapa.codigo] : '');
      var nomeSite = mapa.nome ? String(l[mapa.nome] || '').trim() : '';
      var descricao = mapa.descricao ? String(l[mapa.descricao] || '').trim() : '';

      // linha completamente vazia, comum no fim das planilhas
      if (!codigo && !nomeSite && !descricao) return;
      if (!codigo) { plano.semCodigo++; return; }
      if (vistos[codigo]) { plano.repetidos++; return; }
      vistos[codigo] = true;

      var preco = mapa.preco ? precoParaNumero(l[mapa.preco]) : undefined;
      var marca = mapa.marca ? String(l[mapa.marca] || '').trim() : '';
      var categoria = mapa.categoria ? String(l[mapa.categoria] || '').trim() : '';
      var unidade = mapa.unidade ? normalizaUnidade(l[mapa.unidade]) : '';
      var ativo = mapa.ativo ? simNao(l[mapa.ativo]) : null;

      var atual = porCodigo[codigo];

      if (atual) {
        var mudancas = {};
        var descricoes = [];
        if (mapa.preco && preco !== null && Number(atual.preco) !== preco) {
          mudancas.preco = preco;
          descricoes.push({ campo: 'Preço', de: atual.preco === null ? 'a consultar' : 'R$ ' + precoParaTexto(atual.preco), para: 'R$ ' + precoParaTexto(preco) });
        }
        if (nomeSite && nomeSite !== atual.nome) {
          mudancas.nome = nomeSite;
          descricoes.push({ campo: 'Nome', de: atual.nome, para: nomeSite });
        }
        if (marca && !mesmoTexto(marca, atual.marca)) {
          mudancas.marca = marca;
          descricoes.push({ campo: 'Marca', de: atual.marca || '(vazio)', para: marca });
        }
        if (categoria && !mesmoTexto(categoria, atual.categoria)) {
          mudancas.categoria = categoria;
          descricoes.push({ campo: 'Categoria', de: atual.categoria, para: categoria });
        }
        if (unidade && unidade !== (atual.unidade || 'un')) {
          mudancas.unidade = unidade;
          descricoes.push({ campo: 'Vendido por', de: UNIDADES[atual.unidade || 'un'], para: UNIDADES[unidade] });
        }
        if (ativo !== null && ativo !== !!atual.ativo) {
          mudancas.ativo = ativo;
          descricoes.push({ campo: 'No site', de: atual.ativo ? 'Sim' : 'Não', para: ativo ? 'Sim' : 'Não' });
        }

        if (descricoes.length) {
          plano.atualizar.push({ produto: atual, mudancas: mudancas, descricoes: descricoes });
        } else {
          plano.iguais++;
        }
      } else {
        var nome = nomeSite || descricaoParaNome(descricao, marca);
        if (!nome) { plano.semCodigo++; return; }
        plano.criar.push({
          codigo_barras: codigo,
          nome: nome,
          marca: marcaBonita(marca),
          categoria: categoria || 'Sem categoria',
          unidade: unidade || 'un',
          preco: preco === undefined ? null : preco,
          foto_url: '',
          // chega sem foto: so aparece no site se a planilha mandar explicitamente
          ativo: ativo === true,
          ordem: 0
        });
      }
    });

    return plano;
  }

  $('botaoImportar').addEventListener('click', function () {
    if (!temPlanilha()) return;
    $('arquivoPlanilha').value = '';
    $('arquivoPlanilha').click();
  });

  $('arquivoPlanilha').addEventListener('change', function () {
    var arq = $('arquivoPlanilha').files[0];
    if (!arq) return;

    var leitor = new FileReader();
    leitor.onerror = function () { recado('Não consegui abrir o arquivo.', 'erro'); };
    leitor.onload = function () {
      var livro;
      try {
        livro = XLSX.read(new Uint8Array(leitor.result), { type: 'array' });
      } catch (e) {
        recado('Esse arquivo não parece uma planilha válida.', 'erro');
        return;
      }

      var folha = livro.Sheets[livro.SheetNames[0]];
      var linhas = XLSX.utils.sheet_to_json(folha, { defval: '', raw: true });
      if (!linhas.length) { recado('A planilha está vazia.', 'erro'); return; }

      var mapa = mapaColunas(Object.keys(linhas[0]));
      if (!mapa.codigo) {
        recado('Não achei a coluna "Código de Barras". É por ela que eu reconheço cada produto.', 'erro');
        return;
      }
      if (!mapa.preco && !mapa.nome && !mapa.categoria && !mapa.ativo && !mapa.marca && !mapa.unidade) {
        recado('A planilha tem o código de barras, mas nenhuma coluna para atualizar.', 'erro');
        return;
      }

      planoImport = montaPlano(linhas, mapa);
      mostrarPlano(arq.name, linhas.length, mapa);
    };
    leitor.readAsArrayBuffer(arq);
  });

  function mostrarPlano(nomeArquivo, totalLinhas, mapa) {
    var p = planoImport;
    var achadas = Object.keys(mapa).map(function (k) { return mapa[k]; });

    $('importArquivo').innerHTML = '<b>' + escapa(nomeArquivo) + '</b>, ' + totalLinhas +
      ' linhas. Colunas reconhecidas: ' + achadas.map(escapa).join(', ') + '.';

    var ignoradas = p.semCodigo + p.repetidos;
    $('importResumo').innerHTML =
      '<div class="import-num destaque"><b>' + p.atualizar.length + '</b><span>vão ser atualizados</span></div>' +
      '<div class="import-num destaque"><b>' + p.criar.length + '</b><span>produtos novos</span></div>' +
      '<div class="import-num"><b>' + p.iguais + '</b><span>já estavam iguais</span></div>' +
      '<div class="import-num"><b>' + ignoradas + '</b><span>linhas ignoradas' +
        (ignoradas ? (p.semCodigo ? ', sem código' : '') + (p.repetidos ? ', repetidas' : '') : '') + '</span></div>';

    $('importAvisoNovos').hidden = !p.criar.length;

    var itens = [];
    p.atualizar.forEach(function (a) {
      a.descricoes.forEach(function (d, i) {
        itens.push('<div class="import-linha"><div><b>' + escapa(a.produto.nome) + '</b>' +
          '<small>' + escapa(d.campo) + (a.produto.codigo_barras ? ' · ' + escapa(a.produto.codigo_barras) : '') + '</small></div>' +
          '<div class="import-mudanca"><span class="import-de">' + escapa(d.de) + '</span>' +
          '<span class="import-para">' + escapa(d.para) + '</span></div></div>');
      });
    });
    p.criar.forEach(function (n) {
      itens.push('<div class="import-linha"><div><b>' + escapa(n.nome) + '</b>' +
        '<small>' + escapa(n.categoria) + ' · ' + escapa(n.codigo_barras) + '</small></div>' +
        '<div class="import-mudanca"><span class="selo-novo">Novo</span> ' +
        '<span class="import-para">' + (n.preco === null ? 'a consultar' : 'R$ ' + precoParaTexto(n.preco)) + '</span></div></div>');
    });

    $('importLista').innerHTML = itens.length
      ? itens.join('')
      : '<div class="import-vazio">Nada para mudar. A planilha e o catálogo já estão iguais.</div>';

    $('aplicarImport').disabled = !(p.atualizar.length || p.criar.length);
    $('aplicarImport').textContent = 'Aplicar alterações';
    $('cortinaImport').hidden = false;
  }

  function fecharImport() {
    $('cortinaImport').hidden = true;
    planoImport = null;
  }

  $('fecharImport').addEventListener('click', fecharImport);
  $('cancelarImport').addEventListener('click', fecharImport);
  $('cortinaImport').addEventListener('click', function (e) {
    if (e.target === $('cortinaImport')) fecharImport();
  });

  $('aplicarImport').addEventListener('click', function () {
    if (!planoImport) return;
    var p = planoImport;
    var total = p.atualizar.length + p.criar.length;
    var feitos = 0;
    var erros = [];
    var b = $('aplicarImport');
    b.disabled = true;

    // uma de cada vez, para nao atropelar o banco e para contar direito o que deu errado
    var fila = p.atualizar.map(function (a) {
      return function () { return API.atualizar(a.produto.id, a.mudancas); };
    }).concat(p.criar.map(function (n) {
      return function () { return API.criar(Object.assign({}, n)); };
    }));

    function proximo(i) {
      if (i >= fila.length) return Promise.resolve();
      b.textContent = 'Aplicando ' + (i + 1) + ' de ' + total;
      return fila[i]()
        .then(function () { feitos++; })
        .catch(function (err) { erros.push(err.message || 'erro'); })
        .then(function () { return proximo(i + 1); });
    }

    proximo(0).then(function () {
      fecharImport();
      return carregar();
    }).then(function () {
      if (erros.length) {
        recado(feitos + ' aplicadas, ' + erros.length + ' falharam: ' + erros[0], 'erro');
      } else {
        recado(feitos + ' alterações aplicadas', 'ok');
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!$('cortinaImport').hidden) fecharImport();
    else if (!$('cortina').hidden) fecharJanela();
  });

  /* =========================================================
     PARTIDA
     ========================================================= */
  API.sessao().then(function (u) {
    if (u) abrirPainel(u);
  });
})();
