/* =========================================================
   LOJAS NEON  |  comportamento comum a todas as paginas
   Depende de: Motion One (window.Motion) e Three.js (window.THREE),
   ambos opcionais. Sem eles a pagina continua funcionando.
   ========================================================= */

(function () {
  'use strict';

  var temMotion = typeof window.Motion !== 'undefined';
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. Menu no celular
     --------------------------------------------------------- */
  var botaoMenu = document.querySelector('.menu-botao');
  var navTopo = document.getElementById('navTopo');
  if (botaoMenu && navTopo) {
    botaoMenu.addEventListener('click', function () {
      navTopo.classList.toggle('aberto');
      botaoMenu.setAttribute('aria-expanded', navTopo.classList.contains('aberto'));
    });
  }

  /* ---------------------------------------------------------
     2. Entrada dos elementos ao rolar
     --------------------------------------------------------- */
  function ligarEntradas() {
    var alvos = [].slice.call(document.querySelectorAll('[data-anim]'));
    if (!alvos.length || !temMotion || reduzir) return;

    var animate = window.Motion.animate;
    var stagger = window.Motion.stagger;

    /* So esconde por JS. Qualquer falha daqui pra frente termina em
       "mostra tudo", nunca em pagina em branco. */
    document.documentElement.classList.add('anim-on');
    alvos.forEach(function (el) { el.classList.add('reveal'); });

    /* Solta qualquer animacao presa e devolve o elemento ao estado do CSS,
       que e sempre visivel. Protege contra o Motion segurar o primeiro
       keyframe quando a animacao nao conclui. */
    function soltar(el) {
      var nos = [el].concat([].slice.call(el.querySelectorAll(':scope > *')));
      nos.forEach(function (no) {
        if (no.getAnimations) {
          no.getAnimations().forEach(function (a) { try { a.cancel(); } catch (e) {} });
        }
        no.style.opacity = '';
        no.style.transform = '';
      });
    }

    function revelar(el) {
      el.classList.remove('reveal');
      var filhos = el.querySelectorAll(':scope > *');
      var emGrupo = el.hasAttribute('data-anim-filhos') && filhos.length > 1;
      try {
        if (emGrupo) {
          animate(filhos,
            { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] },
            { duration: 0.55, delay: stagger(0.07), easing: [0.22, 0.61, 0.36, 1] });
        } else {
          animate(el,
            { opacity: [0, 1], transform: ['translateY(26px)', 'translateY(0px)'] },
            { duration: 0.6, easing: [0.22, 0.61, 0.36, 1] });
        }
      } catch (err) { /* sem animacao, mas visivel */ }

      /* tempo de sobra sobre a duracao mais o escalonamento */
      setTimeout(function () { soltar(el); }, 1600);
    }

    var pendentes = alvos.slice();

    function checar() {
      var alturaJanela = window.innerHeight || document.documentElement.clientHeight;
      pendentes = pendentes.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < alturaJanela - 60 && r.bottom > 0) { revelar(el); return false; }
        return true;
      });
      if (!pendentes.length) desligar();
    }

    var agendado = false;
    function agendar() {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(function () { agendado = false; checar(); });
    }
    function desligar() {
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
    }

    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    checar();

    /* Trava de seguranca: passados 3s, nada continua escondido. */
    setTimeout(function () {
      document.documentElement.classList.remove('anim-on');
      alvos.forEach(function (el) { el.classList.remove('reveal'); soltar(el); });
      desligar();
    }, 3000);
  }

  /* ---------------------------------------------------------
     4. Fundo com profundidade (Three.js)
        Campo de pontos que flutua devagar e reage ao mouse.
     --------------------------------------------------------- */
  function ligarFundo3D(idCanvas, opcoes) {
    var canvas = document.getElementById(idCanvas);
    if (!canvas || typeof window.THREE === 'undefined' || reduzir) return;

    var cfg = opcoes || {};
    var qtd = cfg.qtd || 520;
    var cor = cfg.cor || 0x8FB4FF;
    var alcance = cfg.alcance || 46;

    var pai = canvas.parentElement;
    var largura = pai.clientWidth;
    var altura = pai.clientHeight;
    if (!largura || !altura) return;

    var cena = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(62, largura / altura, 1, 400);
    camera.position.z = 42;

    var render;
    try {
      render = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) { return; }
    render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    render.setSize(largura, altura, false);

    var pos = new Float32Array(qtd * 3);
    var vel = new Float32Array(qtd);
    for (var i = 0; i < qtd; i++) {
      pos[i * 3] = (Math.random() - 0.5) * alcance * 2.6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * alcance;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      vel[i] = 0.008 + Math.random() * 0.03;
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    var mat = new THREE.PointsMaterial({
      color: cor,
      size: cfg.tamanho || 0.42,
      transparent: true,
      opacity: cfg.opacidade || 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    var pontos = new THREE.Points(geo, mat);
    cena.add(pontos);

    var mx = 0, my = 0, ax = 0, ay = 0;
    pai.addEventListener('mousemove', function (e) {
      var r = pai.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });

    var vivo = true;
    var obs = new IntersectionObserver(function (ent) {
      vivo = ent[0].isIntersecting;
    }, { threshold: 0 });
    obs.observe(pai);

    function quadro() {
      requestAnimationFrame(quadro);
      if (!vivo) return;

      var p = geo.attributes.position.array;
      for (var i = 0; i < qtd; i++) {
        p[i * 3 + 1] += vel[i];
        if (p[i * 3 + 1] > alcance / 2) p[i * 3 + 1] = -alcance / 2;
      }
      geo.attributes.position.needsUpdate = true;

      ax += (mx * 3.2 - ax) * 0.045;
      ay += (my * -2.2 - ay) * 0.045;
      camera.position.x = ax;
      camera.position.y = ay;
      camera.lookAt(0, 0, 0);
      pontos.rotation.z += 0.0004;

      render.render(cena, camera);
    }
    quadro();

    window.addEventListener('resize', function () {
      var l = pai.clientWidth, a = pai.clientHeight;
      if (!l || !a) return;
      camera.aspect = l / a;
      camera.updateProjectionMatrix();
      render.setSize(l, a, false);
    });
  }

  /* ---------------------------------------------------------
     5. Esteira de marcas: duplica o trilho para o loop fechar
     --------------------------------------------------------- */
  function ligarEsteira() {
    document.querySelectorAll('.esteira-trilho').forEach(function (trilho) {
      if (trilho.dataset.pronto) return;
      trilho.innerHTML += trilho.innerHTML;
      trilho.dataset.pronto = '1';
    });
  }

  /* ---------------------------------------------------------
     6. Botoes com resposta ao toque
     --------------------------------------------------------- */
  function ligarBotoes() {
    if (!temMotion || reduzir) return;
    var animate = window.Motion.animate;
    document.querySelectorAll('.btn').forEach(function (b) {
      b.addEventListener('pointerdown', function () {
        animate(b, { scale: 0.97 }, { duration: 0.09 });
      });
      ['pointerup', 'pointerleave'].forEach(function (ev) {
        b.addEventListener(ev, function () {
          animate(b, { scale: 1 }, { type: 'spring', stiffness: 420, damping: 18 });
        });
      });
    });
  }

  /* ---------------------------------------------------------
     Partida
     --------------------------------------------------------- */
  function iniciar() {
    ligarEsteira();
    ligarEntradas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

  window.NEON = { fundo3D: ligarFundo3D, entradas: ligarEntradas };
})();
