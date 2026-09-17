-- =========================================================
-- LOJAS NEON  |  carga inicial do catalogo
-- Os 43 itens da planilha do dono, na ordem em que aparecem no site.
-- Rodar DEPOIS do schema.sql, uma vez, no SQL Editor.
-- Rodar de novo e seguro: o codigo de barras nao duplica, so atualiza.
-- A foto aponta para o arquivo que ja vai junto com o site.
-- =========================================================

insert into public.produtos
  (codigo_barras, nome, marca, categoria, unidade, preco, foto_url, ordem)
values
  ('7897381600577', 'Cabo flexível 1,5mm preto, rolo 100m', 'Sil', 'Elétrica', 'un', 199.99, 'assets/img/produtos/7897381600577.jpg', 0),
  ('7897381614000', 'Cabo flexível 1,5mm preto, por metro', 'Sil', 'Elétrica', 'm', 2.31, 'assets/img/produtos/7897381614000.jpg', 10),
  ('7897381600621', 'Cabo flexível 2,5mm preto, rolo 100m', 'Sil', 'Elétrica', 'un', 296.99, 'assets/img/produtos/7897381600621.jpg', 20),
  ('7897381614086', 'Cabo flexível 2,5mm preto, por metro', 'Sil', 'Elétrica', 'm', 3.69, 'assets/img/produtos/7897381614086.jpg', 30),
  ('7897381600676', 'Cabo flexível 4mm preto, rolo 100m', 'Sil', 'Elétrica', 'un', 514.90, 'assets/img/produtos/7897381600676.jpg', 40),
  ('7897381636149', 'Cabo flexível 4mm preto, por metro', 'Sil', 'Elétrica', 'm', 5.99, 'assets/img/produtos/7897381636149.jpg', 50),
  ('7897381600720', 'Cabo flexível 6mm preto, rolo 100m', 'Sil', 'Elétrica', 'un', 769.99, 'assets/img/produtos/7897381600720.jpg', 60),
  ('7897381636194', 'Cabo flexível 6mm preto, por metro', 'Sil', 'Elétrica', 'm', 8.99, 'assets/img/produtos/7897381636194.jpg', 70),
  ('7897381636248', 'Cabo flexível 10mm preto, por metro', 'Sil', 'Elétrica', 'm', 16.90, 'assets/img/produtos/7897381636248.jpg', 80),
  ('7897381636293', 'Cabo flexível 16mm preto, por metro', 'Sil', 'Elétrica', 'm', 28.50, 'assets/img/produtos/7897381636293.jpg', 90),
  ('7891435933581', 'Conjunto interruptor simples 6A 250V Aria branco', 'Tramontina', 'Elétrica', 'un', 8.70, 'assets/img/produtos/7891435933581.jpg', 100),
  ('7891435937626', 'Conjunto interruptor paralelo 6A 250V Aria branco', 'Tramontina', 'Elétrica', 'un', 14.40, 'assets/img/produtos/7891435937626.jpg', 110),
  ('7891435932577', 'Conjunto tomada 2P+T 10A 250V Aria branco', 'Tramontina', 'Elétrica', 'un', 7.50, 'assets/img/produtos/7891435932577.jpg', 120),
  ('7891435933598', 'Conjunto tomada 2P+T 20A 250V Aria branco', 'Tramontina', 'Elétrica', 'un', 8.90, 'assets/img/produtos/7891435933598.jpg', 130),
  ('7891435933888', 'Conjunto tomada dupla 2P+T 10A 250V Aria branco', 'Tramontina', 'Elétrica', 'un', 15.90, 'assets/img/produtos/7891435933888.jpg', 140),
  ('7891435937916', 'Conjunto 2 interruptores simples 6A 250V Aria branco', 'Tramontina', 'Elétrica', 'un', 14.99, 'assets/img/produtos/7891435937916.jpg', 150),
  ('7891435938081', 'Conjunto interruptor simples 6A e tomada 2P+T 10A Aria branco', 'Tramontina', 'Elétrica', 'un', 14.06, 'assets/img/produtos/7891435938081.jpg', 160),
  ('7890203455379', 'Fita isolante Imperial Slim 18mm x 5m', '3M', 'Elétrica', 'un', 5.90, 'assets/img/produtos/7890203455379.jpg', 170),
  ('7891040106363', 'Fita isolante Imperial Slim 18mm x 10m', '3M', 'Elétrica', 'un', 9.90, 'assets/img/produtos/7891040106363.jpg', 180),
  ('7891040105502', 'Fita isolante Imperial Slim 18mm x 20m', '3M', 'Elétrica', 'un', 14.90, 'assets/img/produtos/7891040105502.jpg', 190),
  ('7890203418060', 'Fita isolante Scotch 33+ 19mm x 20m', '3M', 'Elétrica', 'pc', 39.90, 'assets/img/produtos/7890203418060.jpg', 200),
  ('9000000049765', 'Conector de porcelana trifásico 10mm', 'Foxlux', 'Elétrica', 'un', 3.90, 'assets/img/produtos/9000000049765.jpg', 210),
  ('7897801301596', 'Sifão multiuso simples com tubo extensível', 'Krona', 'Hidráulica', 'un', 7.90, 'assets/img/produtos/7897801301596.jpg', 220),
  ('7897613336946', 'Fita veda rosca 18mm x 10m', 'Tigre', 'Hidráulica', 'un', 3.81, 'assets/img/produtos/7897613336946.jpg', 230),
  ('7897613336953', 'Fita veda rosca 18mm x 25m', 'Tigre', 'Hidráulica', 'un', 7.67, 'assets/img/produtos/7897613336953.jpg', 240),
  ('7897613336960', 'Fita veda rosca 18mm x 50m', 'Tigre', 'Hidráulica', 'un', 15.10, 'assets/img/produtos/7897613336960.jpg', 250),
  ('7908649631889', 'Ducha Ballerina 3 temperaturas 220V 5350W branca', 'Zagonel', 'Chuveiros', 'un', 52.90, 'assets/img/produtos/7908649631889.jpg', 260),
  ('7897273200335', 'Ducha Ideale Plus 4 temperaturas 220V 6800W branca', 'Zagonel', 'Chuveiros', 'un', 69.90, 'assets/img/produtos/7897273200335.jpg', 270),
  ('7908649605637', 'Ducha Moment eletrônica 220V 7500W branca', 'Zagonel', 'Chuveiros', 'un', 132.90, 'assets/img/produtos/7908649605637.jpg', 280),
  ('7896451824806', 'Maxi Ducha 220V 5500W', 'Lorenzetti', 'Chuveiros', 'un', 115.99, 'assets/img/produtos/7896451824806.jpg', 290),
  ('7896451844859', 'Bella Ducha Ultra 220V 6800W branca', 'Lorenzetti', 'Chuveiros', 'un', 119.90, 'assets/img/produtos/7896451844859.jpg', 300),
  ('7896451879035', 'Ducha Loren Shower eletrônica 220V 7500W', 'Lorenzetti', 'Chuveiros', 'un', 188.89, 'assets/img/produtos/7896451879035.jpg', 310),
  ('7898586133563', 'Lâmpada LED bulbo 9W 6500K bivolt', 'Foxlux', 'Iluminação', 'un', 3.99, 'assets/img/produtos/7898586133563.jpg', 320),
  ('7898586132146', 'Lâmpada LED bulbo 15W 6500K bivolt', 'Foxlux', 'Iluminação', 'un', 10.95, 'assets/img/produtos/7898586132146.jpg', 330),
  ('7898586132108', 'Lâmpada LED alta potência 20W 6500K bivolt', 'Foxlux', 'Iluminação', 'un', 14.90, 'assets/img/produtos/7898586132108.jpg', 340),
  ('7898586132115', 'Lâmpada LED alta potência 30W 6500K bivolt', 'Foxlux', 'Iluminação', 'un', 24.90, 'assets/img/produtos/7898586132115.jpg', 350),
  ('7898586132122', 'Lâmpada LED alta potência 40W 6500K bivolt', 'Foxlux', 'Iluminação', 'un', 34.90, 'assets/img/produtos/7898586132122.jpg', 360),
  ('7898586134454', 'Lâmpada LED alta potência 50W 6500K bivolt', 'Foxlux', 'Iluminação', 'un', 41.90, 'assets/img/produtos/7898586134454.jpg', 370),
  ('7898586137035', 'Lâmpada LED alta potência 100W 6500K bivolt', 'Foxlux', 'Iluminação', 'un', 109.90, 'assets/img/produtos/7898586137035.jpg', 380),
  ('7897192714494', 'Ventilador de teto Citrino 127V 130W 3 pás branco', 'Tron', 'Ventilação', 'pc', 299.99, 'assets/img/produtos/7897192714494.jpg', 390),
  ('7908412519208', 'Ventilador de mesa 40cm 127V 140W preto', 'Elgin', 'Ventilação', 'un', 209.99, 'assets/img/produtos/7908412519208.jpg', 400),
  ('7898567700944', 'Óleo desengripante spray 300ml', 'Lub Fast', 'Químicos', 'un', 8.50, 'assets/img/produtos/7898567700944.jpg', 410),
  ('7898965442477', 'Cola selante PU40 branca 400g', 'Cibraflex', 'Químicos', 'un', 13.90, 'assets/img/produtos/7898965442477.jpg', 420)
on conflict (codigo_barras) where codigo_barras is not null do update set
  nome      = excluded.nome,
  marca     = excluded.marca,
  categoria = excluded.categoria,
  unidade   = excluded.unidade,
  preco     = excluded.preco,
  foto_url  = excluded.foto_url,
  ordem     = excluded.ordem;
