-- =========================================================
-- LOJAS NEON  |  fotos passam a morar no proprio site
--
-- As 29 fotos cadastradas em 21/09/2026 apontavam para fora: 16 para o site
-- da Lorenzetti, 10 para o Storage do Supabase e 3 para miniaturas do Google.
-- Todas foram baixadas, achatadas em fundo branco, aparadas e padronizadas
-- em 560 por 560, iguais as outras do catalogo. Agora o endereco e local.
--
-- Rodar depois de subir os arquivos por FTP, senao a foto fica quebrada
-- ate o envio terminar. Rodar de novo nao faz mal.
-- =========================================================

update public.produtos as p
set foto_url = novo.caminho
from (values
  ('7898708928237', 'assets/img/produtos/7898708928237.jpg'),
  ('7898708928244', 'assets/img/produtos/7898708928244.jpg'),
  ('7896451862594', 'assets/img/produtos/7896451862594.jpg'),
  ('7896451846358', 'assets/img/produtos/7896451846358.jpg'),
  ('7896451846365', 'assets/img/produtos/7896451846365.jpg'),
  ('7896451862556', 'assets/img/produtos/7896451862556.jpg'),
  ('7896451859686', 'assets/img/produtos/7896451859686.jpg'),
  ('7896451862631', 'assets/img/produtos/7896451862631.jpg'),
  ('7896451844842', 'assets/img/produtos/7896451844842.jpg'),
  ('7896451808257', 'assets/img/produtos/7896451808257.jpg'),
  ('7896451832481', 'assets/img/produtos/7896451832481.jpg'),
  ('7896451818768', 'assets/img/produtos/7896451818768.jpg'),
  ('7896451800398', 'assets/img/produtos/7896451800398.jpg'),
  ('7896451834317', 'assets/img/produtos/7896451834317.jpg'),
  ('7896451834331', 'assets/img/produtos/7896451834331.jpg'),
  ('7896451849489', 'assets/img/produtos/7896451849489.jpg'),
  ('7896451849496', 'assets/img/produtos/7896451849496.jpg'),
  ('7896451863270', 'assets/img/produtos/7896451863270.jpg'),
  ('7896451866042', 'assets/img/produtos/7896451866042.jpg'),
  ('7896451889072', 'assets/img/produtos/7896451889072.jpg'),
  ('7896451887849', 'assets/img/produtos/7896451887849.jpg'),
  ('7896451863706', 'assets/img/produtos/7896451863706.jpg'),
  ('7896451869944', 'assets/img/produtos/7896451869944.jpg'),
  ('7896451866103', 'assets/img/produtos/7896451866103.jpg'),
  ('7896451889041', 'assets/img/produtos/7896451889041.jpg'),
  ('7896451887818', 'assets/img/produtos/7896451887818.jpg'),
  ('7896451880192', 'assets/img/produtos/7896451880192.jpg'),
  ('7896451887528', 'assets/img/produtos/7896451887528.jpg'),
  ('7896451869951', 'assets/img/produtos/7896451869951.jpg')
) as novo(codigo, caminho)
where p.codigo_barras = novo.codigo;

-- conferencia: deve voltar vazio
select codigo_barras, nome, foto_url
from public.produtos
where foto_url like 'http%'
order by nome;
