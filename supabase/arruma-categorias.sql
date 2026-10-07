-- =========================================================
-- LOJAS NEON  |  junta as categorias repetidas
--
-- O catalogo ficou com "Elétrica" (53 produtos) e "elétrica" (30), que para o
-- banco sao coisas diferentes e no site viravam duas prateleiras. Aqui cada uma
-- volta para a grafia usada no site.
--
-- Rodar uma vez no SQL Editor. Rodar de novo nao faz mal.
-- =========================================================

update public.produtos
set categoria = 'Elétrica'
where lower(categoria) in ('elétrica', 'eletrica');

update public.produtos
set categoria = 'Hidráulica'
where lower(categoria) in ('hidráulica', 'hidraulica');

update public.produtos
set categoria = 'Iluminação'
where lower(categoria) in ('iluminação', 'iluminacao');

update public.produtos
set categoria = 'Ventilação'
where lower(categoria) in ('ventilação', 'ventilacao');

update public.produtos
set categoria = 'Chuveiros'   where lower(categoria) = 'chuveiros';
update public.produtos
set categoria = 'Químicos'    where lower(categoria) in ('químicos', 'quimicos');
update public.produtos
set categoria = 'Ferramentas' where lower(categoria) = 'ferramentas';
update public.produtos
set categoria = 'Ferragens'   where lower(categoria) = 'ferragens';
update public.produtos
set categoria = 'Bombas'      where lower(categoria) = 'bombas';

-- a marca das furadeiras entrou em minuscula
update public.produtos set marca = 'Famastil' where marca = 'famastil';

-- conferencia: cada categoria deve aparecer uma vez so
select categoria, count(*) as produtos
from public.produtos
group by categoria
order by produtos desc;
