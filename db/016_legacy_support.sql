-- How many people have supported each cause on the Her Legacy page.
--
-- One row per cause, holding the number shown on the page. Visitors add to it
-- with the "I supported this" button; the family can also set it by hand in
-- /admin, for people who said so in person or in a guestbook message. Nothing
-- here says who anyone is — it is a count, not a list.
--
-- slug matches the {{support:slug}} marker in content/legacy.md, so a cause can
-- be hidden or shown in the content without touching this table.
create table if not exists legacy_causes (
  slug       text primary key,
  count      integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default now()
);

insert into legacy_causes (slug) values
  ('prxpr'), ('kind'), ('thedream'), ('latinos-for-education')
on conflict (slug) do nothing;

-- One row per button press, kept only to stop one person (or a script) from
-- pressing it over and over: ip_hash is the same salted hash the guestbook
-- uses, never the address itself.
create table if not exists legacy_supports (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null references legacy_causes (slug),
  ip_hash    text,
  created_at timestamptz not null default now()
);

create index if not exists legacy_supports_recent
  on legacy_supports (ip_hash, created_at desc);
