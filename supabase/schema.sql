-- =========================================================
-- LOJAS NEON  |  banco do catalogo
-- Rodar uma vez no SQL Editor do Supabase, do projeto novo.
-- =========================================================

-- ---------------------------------------------------------
-- 1. Tabela de produtos
-- ---------------------------------------------------------
create table if not exists public.produtos (
  id            uuid primary key default gen_random_uuid(),
  codigo_barras text,                       -- chave para importar planilha e atualizar preco
  nome          text        not null,
  marca         text        not null default '',
  categoria     text        not null,
  unidade       text        not null default 'un',  -- un, m (por metro) ou pc (peca)
  preco         numeric(10,2),              -- nulo significa "consulte disponibilidade"
  foto_url      text,
  ativo         boolean     not null default true,
  ordem         integer     not null default 0,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on column public.produtos.preco is 'Nulo aparece no site como Consulte disponibilidade';
comment on column public.produtos.ativo is 'Falso esconde do site sem apagar o registro';
comment on column public.produtos.ordem is 'Menor aparece primeiro dentro da categoria';

-- um codigo de barras nao pode aparecer duas vezes; produto sem codigo continua permitido
create unique index if not exists produtos_codigo_barras_uk
  on public.produtos (codigo_barras) where codigo_barras is not null;

create index if not exists produtos_categoria_idx on public.produtos (categoria);
create index if not exists produtos_ativo_idx     on public.produtos (ativo);
create index if not exists produtos_ordem_idx     on public.produtos (ordem);

-- busca por nome: o site filtra no proprio navegador, entao um indice simples basta.
-- (indice com unaccent nao e aceito: a funcao nao e IMMUTABLE no Postgres do Supabase)
create index if not exists produtos_nome_idx on public.produtos (lower(nome));

-- ---------------------------------------------------------
-- 2. Carimbo automatico de atualizacao
-- ---------------------------------------------------------
create or replace function public.marca_atualizacao()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists produtos_atualizado_em on public.produtos;
create trigger produtos_atualizado_em
  before update on public.produtos
  for each row execute function public.marca_atualizacao();

-- ---------------------------------------------------------
-- 3. Permissoes
--    O site le sem login. Só quem estiver autenticado escreve.
--    Isso é o que realmente protege o painel, nao a URL secreta.
-- ---------------------------------------------------------
alter table public.produtos enable row level security;

drop policy if exists "leitura publica dos ativos" on public.produtos;
create policy "leitura publica dos ativos"
  on public.produtos for select
  to anon
  using (ativo = true);

drop policy if exists "quem entrou ve tudo" on public.produtos;
create policy "quem entrou ve tudo"
  on public.produtos for select
  to authenticated
  using (true);

drop policy if exists "quem entrou cadastra" on public.produtos;
create policy "quem entrou cadastra"
  on public.produtos for insert
  to authenticated
  with check (true);

drop policy if exists "quem entrou altera" on public.produtos;
create policy "quem entrou altera"
  on public.produtos for update
  to authenticated
  using (true) with check (true);

drop policy if exists "quem entrou exclui" on public.produtos;
create policy "quem entrou exclui"
  on public.produtos for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------
-- 4. Fotos dos produtos
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

drop policy if exists "foto de produto e publica" on storage.objects;
create policy "foto de produto e publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'produtos');

drop policy if exists "quem entrou envia foto" on storage.objects;
create policy "quem entrou envia foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'produtos');

drop policy if exists "quem entrou troca foto" on storage.objects;
create policy "quem entrou troca foto"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'produtos');

drop policy if exists "quem entrou apaga foto" on storage.objects;
create policy "quem entrou apaga foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'produtos');
