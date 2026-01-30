create table if not exists formations (
  id serial primary key,
  nom text not null,
  created_at timestamptz not null default now()
);

insert into formations (nom) values ('Formation exemple');

