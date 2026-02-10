create extension if not exists pgcrypto;

create table if not exists templates (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	name text not null,
	description text,
	template_json jsonb not null,
	preview_image_url text,
	tags text[] not null default '{}',
	is_public boolean not null default true,
	created_by text,
	edit_token text not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists templates_is_public_updated_idx
	on templates (is_public, updated_at desc);

create index if not exists templates_tags_gin_idx
	on templates using gin (tags);

create index if not exists templates_template_json_gin_idx
	on templates using gin (template_json);
