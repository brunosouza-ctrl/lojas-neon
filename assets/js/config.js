/* =========================================================
   LOJAS NEON  |  configuracao

   Preencher os dois campos abaixo com os dados do projeto Supabase.
   Estao em: painel do Supabase > Project Settings > Data API.

   A chave publicavel (sb_publishable_...) e publica de proposito, pode ficar aqui.
   Quem protege os dados sao as regras de RLS do schema.sql,
   nao o segredo da chave.

   NUNCA colocar aqui a chave "service_role".
   ========================================================= */

window.NEON = window.NEON || {};

window.NEON.config = {
  SUPABASE_URL: 'https://xztgjjlktxyamaczurlb.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_2YRGDZ8m2QLOiAD-oVw1Uw_H2USCtLV',

  /* Conta do painel no Supabase Auth. Quem cuida do catalogo digita so a senha:
     este e-mail entra sozinho. Trocar aqui se um dia criarem outra conta. */
  PAINEL_EMAIL: 'painel@lojasneon.com.br'
};

/* Enquanto os campos acima estiverem vazios, o site usa o catalogo
   de exemplo que esta dentro do catalogo.js e o painel avisa que
   ainda nao foi configurado. */
window.NEON.temBanco = function () {
  var c = window.NEON.config;
  return !!(c.SUPABASE_URL && c.SUPABASE_ANON_KEY);
};
