-- =========================================================
-- LOJAS NEON  |  nomes em caixa alta viram nome de vitrine
--
-- Os 27 produtos cadastrados em 21/09/2026 entraram com a descricao do
-- sistema da loja, toda em maiuscula e com a marca repetida no fim.
-- Aqui cada um recebe o nome no mesmo padrao dos outros: frase normal,
-- linha do produto com inicial maiuscula, tensao e potencia separadas.
--
-- Rodar uma vez no SQL Editor. Rodar de novo nao faz mal.
-- =========================================================

update public.produtos as p
set nome = novo.nome
from (values
  ('7896451834317', 'Aquecedor Versátil 127V 5500W'),
  ('7896451834331', 'Aquecedor Versátil 220V 5500W'),
  ('7896451849489', 'Bella Ducha Turbo Ultra 4 temperaturas 127V 5500W'),
  ('7896451849496', 'Bella Ducha Turbo Ultra 4 temperaturas 220V 6800W'),
  ('7896451846358', 'Bella Ducha Ultra 127V 5500W azul'),
  ('7896451844842', 'Bella Ducha Ultra 127V 5500W branca'),
  ('7896451846365', 'Bella Ducha Ultra 220V 6800W azul'),
  ('7896451862556', 'Bello Banho com cano 220V 5500W azul'),
  ('7896451862594', 'Bello Banho com cano 220V 5500W bege'),
  ('7896451859686', 'Bello Banho com cano 220V 5500W branco'),
  ('7896451862631', 'Bello Banho com cano 220V 5500W cinza'),
  ('7896451808257', 'Cano para chuveiro azul'),
  ('7896451832481', 'Cano para chuveiro bege'),
  ('7896451818768', 'Cano para chuveiro cinza'),
  ('7896451863270', 'Chuveiro Acqua Storm Ultra 220V 7800W preto e cromado'),
  ('7896451866042', 'Chuveiro Acqua Wave Ultra 220V 7800W branco e cromado'),
  ('7896451866103', 'Chuveiro Acqua Wave Ultra 220V 7800W preto e cromado'),
  ('7896451800398', 'Chuveirinho manual 083'),
  ('7896451889072', 'Chuveiro Acqua Century Digital 220V 7500W branco e cromado'),
  ('7896451889041', 'Chuveiro Acqua Century Digital 220V 7500W preto e cromado'),
  ('7896451887849', 'Chuveiro Acqua Century eletrônico 220V 7500W branco'),
  ('7896451887818', 'Chuveiro Acqua Century eletrônico 220V 7500W preto'),
  ('7896451869944', 'Chuveiro Acqua Duo 220V 7800W branco e cromado'),
  ('7896451863706', 'Chuveiro Acqua Duo 220V 7800W branco'),
  ('7896451869951', 'Chuveiro Acqua Duo 220V 7800W preto e cromado'),
  ('7896451887528', 'Chuveiro Acqua Duo 220V 7800W preto matte'),
  ('7896451880192', 'Chuveiro Acqua Duo 220V 7800W preto e rosé')
) as novo(codigo, nome)
where p.codigo_barras = novo.codigo;

-- conferencia: deve voltar vazio depois de rodar
select codigo_barras, nome
from public.produtos
where nome = upper(nome)
order by nome;
