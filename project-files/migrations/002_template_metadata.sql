alter table templates
	add column if not exists username text not null default 'anonymous';

alter table templates
	add column if not exists scope text not null default 'universal';

alter table templates
	add column if not exists game_key text;

alter table templates
	add column if not exists editor_state_json jsonb;

create index if not exists templates_username_idx
	on templates (username);

create index if not exists templates_scope_game_key_idx
	on templates (scope, game_key);
