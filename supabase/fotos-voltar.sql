-- =========================================================
-- LOJAS NEON  |  volta atras: fotos apontam de novo para fora
--
-- Usar enquanto o envio por FTP nao termina. Assim o site nao fica com
-- ficha sem foto. Depois que os arquivos estiverem no servidor, rodar de
-- novo o fotos-locais.sql para trazer tudo para dentro do site.
-- =========================================================

update public.produtos as p
set foto_url = antigo.url
from (values
  ('7898708928237', 'https://xztgjjlktxyamaczurlb.supabase.co/storage/v1/object/public/produtos/1790018202642-pvqmga.webp'),
  ('7898708928244', 'https://xztgjjlktxyamaczurlb.supabase.co/storage/v1/object/public/produtos/1790018298874-l0bhkn.webp'),
  ('7896451862594', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/loren-bello-bege.png?sfvrsn=2a65d669_2'),
  ('7896451846358', 'https://xztgjjlktxyamaczurlb.supabase.co/storage/v1/object/public/produtos/1790021081491-0j9n8n.png'),
  ('7896451846365', 'https://xztgjjlktxyamaczurlb.supabase.co/storage/v1/object/public/produtos/1790021100083-xicspz.png'),
  ('7896451862556', 'https://xztgjjlktxyamaczurlb.supabase.co/storage/v1/object/public/produtos/1790021680292-sw2b03.png'),
  ('7896451859686', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/loren-bello-branco.png?sfvrsn=b63b9cc1_2'),
  ('7896451862631', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/loren-bello-cinza.png?sfvrsn=6c9c663c_2'),
  ('7896451844842', 'https://xztgjjlktxyamaczurlb.supabase.co/storage/v1/object/public/produtos/1790021049139-39eu0l.png'),
  ('7896451808257', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiqv1qH6xib25iounefP-BmS-OCPqBU75_aoiTrvUj5A&s=10'),
  ('7896451832481', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzVWGTAjN5oRDUWrv0VylhNSJ4LWdbtmgTr6mgFNrLIA&s=10'),
  ('7896451818768', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGf9Rq8jMjskGRErfFyXODBkVQRGYP1mWWLIhMg0piIg&s=10'),
  ('7896451800398', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/acessorios-de-chuveiros/duchinha.png?sfvrsn=ce33405d_2'),
  ('7896451834317', 'https://xztgjjlktxyamaczurlb.supabase.co/storage/v1/object/public/produtos/1790019861659-euanwq.webp'),
  ('7896451834331', 'https://xztgjjlktxyamaczurlb.supabase.co/storage/v1/object/public/produtos/1790019939404-jp1g8p.webp'),
  ('7896451849489', 'https://xztgjjlktxyamaczurlb.supabase.co/storage/v1/object/public/produtos/1790019990172-knwmpv.webp'),
  ('7896451849496', 'https://xztgjjlktxyamaczurlb.supabase.co/storage/v1/object/public/produtos/1790020763995-0kn831.png'),
  ('7896451863270', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-storm-preto-cromado.png?sfvrsn=c226588e_2'),
  ('7896451866042', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-wave-branco-cromado.png?sfvrsn=2ca42db9_2'),
  ('7896451889072', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-century-digital---branco-com-cromado.png?sfvrsn=315544b5_2'),
  ('7896451887849', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-century-eletr%C3%B4nico---branco.png?sfvrsn=2082222d_2'),
  ('7896451863706', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-duo-branco.png?sfvrsn=5916d204_0'),
  ('7896451869944', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-duo-branco-cromado.png?sfvrsn=d8f243f0_0'),
  ('7896451866103', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-wave-preto-cromado.png?sfvrsn=2e3a4383_2'),
  ('7896451889041', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-century-digital---preto-com-cromado.png?sfvrsn=13be5497_2'),
  ('7896451887818', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-century-eletronico-preto.png?sfvrsn=51d7e2b0_4'),
  ('7896451880192', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-duo-preto-rose-gold.png?sfvrsn=80ca403e_2'),
  ('7896451887528', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-duo-matte-black.png?sfvrsn=e8505b45_2'),
  ('7896451869951', 'https://www.lorenzetti.com.br/images/default-source/produtos-png/chuveiros-eletricos/acqua-duo-preto-cromado.png?sfvrsn=d6f0c07c_0')
) as antigo(codigo, url)
where p.codigo_barras = antigo.codigo;

select count(*) as fotos_de_fora
from public.produtos
where foto_url like 'http%';
