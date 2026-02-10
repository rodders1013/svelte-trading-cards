import { randomBytes, randomUUID } from 'node:crypto';
import { getSql } from '$lib/server/db.js';
import { CardTemplateSchema, type CardTemplate } from '$lib/types/CardTemplate.js';
import { z } from 'zod';

const TemplateScopeSchema = z.enum(['universal', 'game']);
export type TemplateScope = z.infer<typeof TemplateScopeSchema>;

const CreateTemplateInputSchema = z.object({
	name: z.string().trim().min(3).max(80),
	description: z.string().trim().max(300).optional(),
	username: z.string().trim().min(2).max(40),
	scope: TemplateScopeSchema.default('universal'),
	gameKey: z.string().trim().min(1).max(64).optional(),
	template: CardTemplateSchema,
	editorState: z.array(z.unknown()).optional(),
	previewImageUrl: z.string().url().max(500).optional(),
	tags: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
	isPublic: z.boolean().default(true)
});

const UpdateTemplateInputSchema = z.object({
	name: z.string().trim().min(3).max(80).optional(),
	description: z.string().trim().max(300).optional(),
	username: z.string().trim().min(2).max(40).optional(),
	scope: TemplateScopeSchema.optional(),
	gameKey: z.string().trim().min(1).max(64).optional(),
	template: CardTemplateSchema.optional(),
	editorState: z.array(z.unknown()).optional(),
	previewImageUrl: z.string().url().max(500).optional(),
	tags: z.array(z.string().trim().min(1).max(30)).max(12).optional(),
	isPublic: z.boolean().optional()
});

const ListTemplatesOptionsSchema = z.object({
	limit: z.number().int().min(1).max(100).default(24),
	offset: z.number().int().min(0).default(0),
	search: z.string().trim().max(120).optional(),
	username: z.string().trim().max(40).optional(),
	scope: TemplateScopeSchema.optional(),
	gameKey: z.string().trim().max(64).optional(),
	sort: z.enum(['recent', 'name', 'popular']).default('recent')
});

export interface TemplateListResult {
	templates: TemplateSummary[];
	limit: number;
	offset: number;
	total: number;
}

export interface TemplateFacets {
	usernames: string[];
	gameKeys: string[];
}

export type CreateTemplateInput = z.infer<typeof CreateTemplateInputSchema>;
export type UpdateTemplateInput = z.infer<typeof UpdateTemplateInputSchema>;
export type ListTemplatesOptions = z.infer<typeof ListTemplatesOptionsSchema>;

export interface StoredTemplate {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	username: string;
	scope: TemplateScope;
	gameKey: string | null;
	template: CardTemplate;
	editorState: unknown[] | null;
	previewImageUrl: string | null;
	tags: string[];
	isPublic: boolean;
	editToken?: string;
	createdAt: string;
	updatedAt: string;
}

export interface TemplateSummary {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	username: string;
	scope: TemplateScope;
	gameKey: string | null;
	template: CardTemplate;
	tags: string[];
	previewImageUrl: string | null;
	updatedAt: string;
	createdAt: string;
}

function parseTemplateJson(input: unknown): CardTemplate {
	const parsed = typeof input === 'string' ? JSON.parse(input) : input;
	return CardTemplateSchema.parse(parsed);
}

function parseEditorStateJson(input: unknown): unknown[] | null {
	if (input == null) return null;
	const parsed = typeof input === 'string' ? JSON.parse(input) : input;
	return Array.isArray(parsed) ? parsed : null;
}

function toStoredTemplate(row: Record<string, unknown>, includeEditToken = false): StoredTemplate {
	return {
		id: String(row.id),
		slug: String(row.slug),
		name: String(row.name),
		description: row.description ? String(row.description) : null,
		username: row.username ? String(row.username) : 'anonymous',
		scope: row.scope === 'game' ? 'game' : 'universal',
		gameKey: row.game_key ? String(row.game_key) : null,
		template: parseTemplateJson(row.template_json),
		editorState: parseEditorStateJson(row.editor_state_json),
		previewImageUrl: row.preview_image_url ? String(row.preview_image_url) : null,
		tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
		isPublic: Boolean(row.is_public),
		editToken: includeEditToken && row.edit_token ? String(row.edit_token) : undefined,
		createdAt: new Date(String(row.created_at)).toISOString(),
		updatedAt: new Date(String(row.updated_at)).toISOString()
	};
}

function toTemplateSummary(row: Record<string, unknown>): TemplateSummary {
	return {
		id: String(row.id),
		slug: String(row.slug),
		name: String(row.name),
		description: row.description ? String(row.description) : null,
		username: row.username ? String(row.username) : 'anonymous',
		scope: row.scope === 'game' ? 'game' : 'universal',
		gameKey: row.game_key ? String(row.game_key) : null,
		template: parseTemplateJson(row.template_json),
		tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
		previewImageUrl: row.preview_image_url ? String(row.preview_image_url) : null,
		createdAt: new Date(String(row.created_at)).toISOString(),
		updatedAt: new Date(String(row.updated_at)).toISOString()
	};
}

function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 64);
}

async function buildUniqueSlug(baseName: string): Promise<string> {
	const sql = getSql();
	const base = slugify(baseName) || 'template';

	for (let attempt = 0; attempt < 10; attempt += 1) {
		const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
		const rows = await sql<{ id: string }[]>`
			select id from templates where slug = ${candidate} limit 1
		`;
		if (rows.length === 0) {
			return candidate;
		}
	}

	return `${base}-${randomBytes(3).toString('hex')}`;
}

function createEditToken(): string {
	return randomBytes(24).toString('hex');
}

function normalizeScopeAndGame(inputScope: TemplateScope, inputGameKey?: string): { scope: TemplateScope; gameKey: string | null } {
	if (inputScope === 'game') {
		return { scope: 'game', gameKey: inputGameKey?.trim() || null };
	}
	return { scope: 'universal', gameKey: null };
}

function baseTemplateSelection() {
	return `
		select
			id,
			slug,
			name,
			description,
			username,
			scope,
			game_key,
			template_json,
			editor_state_json,
			preview_image_url,
			tags,
			is_public,
			created_at,
			updated_at
		from templates
	`;
}

function baseTemplateSummarySelection() {
	return `
		select
			id,
			slug,
			name,
			description,
			username,
			scope,
			game_key,
			template_json,
			preview_image_url,
			tags,
			created_at,
			updated_at
		from templates
	`;
}

export async function listPublicTemplates(options: Partial<ListTemplatesOptions> = {}): Promise<TemplateListResult> {
	const parsed = ListTemplatesOptionsSchema.parse(options);
	const sql = getSql();

	const search = parsed.search?.trim() || null;
	const username = parsed.username?.trim() || null;
	const scope = parsed.scope ?? null;
	const gameKey = parsed.gameKey?.trim() || null;

	const sortSql =
		parsed.sort === 'name'
			? 'name asc, updated_at desc'
			: 'updated_at desc';

	const rows = await sql<Record<string, unknown>[]>`
		${sql.unsafe(baseTemplateSummarySelection())}
		where is_public = true
		and (${search}::text is null or name ilike ${`%${search ?? ''}%`} or description ilike ${`%${search ?? ''}%`})
		and (${username}::text is null or username = ${username})
		and (${scope}::text is null or scope = ${scope})
		and (${gameKey}::text is null or game_key = ${gameKey})
		order by ${sql.unsafe(sortSql)}
		limit ${parsed.limit}
		offset ${parsed.offset}
	`;

	const countRows = await sql<{ total: string }[]>`
		select count(*)::text as total
		from templates
		where is_public = true
		and (${search}::text is null or name ilike ${`%${search ?? ''}%`} or description ilike ${`%${search ?? ''}%`})
		and (${username}::text is null or username = ${username})
		and (${scope}::text is null or scope = ${scope})
		and (${gameKey}::text is null or game_key = ${gameKey})
	`;

	return {
		templates: rows.map((row) => toTemplateSummary(row)),
		limit: parsed.limit,
		offset: parsed.offset,
		total: Number(countRows[0]?.total ?? 0)
	};
}

export async function listTemplateFacets(): Promise<TemplateFacets> {
	const sql = getSql();

	const userRows = await sql<{ username: string }[]>`
		select distinct username
		from templates
		where is_public = true
		and username is not null
		and username <> ''
		order by username asc
	`;

	const gameRows = await sql<{ game_key: string }[]>`
		select distinct game_key
		from templates
		where is_public = true
		and game_key is not null
		and game_key <> ''
		order by game_key asc
	`;

	return {
		usernames: userRows.map((row) => row.username),
		gameKeys: gameRows.map((row) => row.game_key)
	};
}

export async function getPublicTemplateBySlug(slug: string): Promise<StoredTemplate | null> {
	const sql = getSql();
	const rows = await sql<Record<string, unknown>[]>`
		${sql.unsafe(baseTemplateSelection())}
		where slug = ${slug}
		and is_public = true
		limit 1
	`;

	if (rows.length === 0) return null;
	return toStoredTemplate(rows[0]);
}

export async function createTemplate(input: unknown): Promise<StoredTemplate> {
	const parsed = CreateTemplateInputSchema.parse(input);
	const sql = getSql();
	const id = randomUUID();
	const slug = await buildUniqueSlug(parsed.name);
	const editToken = createEditToken();
	const { scope, gameKey } = normalizeScopeAndGame(parsed.scope, parsed.gameKey);
	const templateJson = JSON.stringify(parsed.template);
	const editorStateJson = parsed.editorState ? JSON.stringify(parsed.editorState) : undefined;

	const rows =
		editorStateJson !== undefined
			? await sql<Record<string, unknown>[]>`
				insert into templates (
					id,
					slug,
					name,
					description,
					username,
					scope,
					game_key,
					template_json,
					editor_state_json,
					preview_image_url,
					tags,
					is_public,
					edit_token
				) values (
					${id},
					${slug},
					${parsed.name},
					${parsed.description ?? null},
					${parsed.username},
					${scope},
					${gameKey},
					cast(${templateJson} as jsonb),
					cast(${editorStateJson} as jsonb),
					${parsed.previewImageUrl ?? null},
					${parsed.tags},
					${parsed.isPublic},
					${editToken}
				)
				returning
					id,
					slug,
					name,
					description,
					username,
					scope,
					game_key,
					template_json,
					editor_state_json,
					preview_image_url,
					tags,
					is_public,
					edit_token,
					created_at,
					updated_at
			`
			: await sql<Record<string, unknown>[]>`
				insert into templates (
					id,
					slug,
					name,
					description,
					username,
					scope,
					game_key,
					template_json,
					editor_state_json,
					preview_image_url,
					tags,
					is_public,
					edit_token
				) values (
					${id},
					${slug},
					${parsed.name},
					${parsed.description ?? null},
					${parsed.username},
					${scope},
					${gameKey},
					cast(${templateJson} as jsonb),
					null,
					${parsed.previewImageUrl ?? null},
					${parsed.tags},
					${parsed.isPublic},
					${editToken}
				)
				returning
					id,
					slug,
					name,
					description,
					username,
					scope,
					game_key,
					template_json,
					editor_state_json,
					preview_image_url,
					tags,
					is_public,
					edit_token,
					created_at,
					updated_at
			`;

	return toStoredTemplate(rows[0], true);
}

export async function updateTemplateBySlug(
	slug: string,
	editToken: string,
	input: unknown
): Promise<StoredTemplate | null> {
	const parsed = UpdateTemplateInputSchema.parse(input);
	const sql = getSql();

	const hasPatch =
		parsed.name !== undefined ||
		parsed.description !== undefined ||
		parsed.username !== undefined ||
		parsed.scope !== undefined ||
		parsed.gameKey !== undefined ||
		parsed.template !== undefined ||
		parsed.editorState !== undefined ||
		parsed.previewImageUrl !== undefined ||
		parsed.tags !== undefined ||
		parsed.isPublic !== undefined;

	if (!hasPatch) return getPublicTemplateBySlug(slug);

	const scopeCandidate = parsed.scope ?? null;
	const normalized = normalizeScopeAndGame(
		parsed.scope ?? 'universal',
		parsed.gameKey
	);

	const rows = await sql<Record<string, unknown>[]>`
		update templates
		set
			name = case
				when ${parsed.name !== undefined} then ${parsed.name ?? ''}
				else name
			end,
			description = case
				when ${parsed.description !== undefined} then ${parsed.description || null}
				else description
			end,
			username = case
				when ${parsed.username !== undefined} then ${parsed.username ?? 'anonymous'}
				else username
			end,
			scope = case
				when ${scopeCandidate !== null} then ${normalized.scope}
				else scope
			end,
			game_key = case
				when ${scopeCandidate !== null || parsed.gameKey !== undefined} then ${normalized.gameKey}
				else game_key
			end,
			template_json = case
				when ${parsed.template !== undefined} then cast(${JSON.stringify(parsed.template ?? {})} as jsonb)
				else template_json
			end,
			editor_state_json = case
				when ${parsed.editorState !== undefined} then cast(${JSON.stringify(parsed.editorState ?? [])} as jsonb)
				else editor_state_json
			end,
			preview_image_url = case
				when ${parsed.previewImageUrl !== undefined} then ${parsed.previewImageUrl || null}
				else preview_image_url
			end,
			tags = case
				when ${parsed.tags !== undefined} then ${parsed.tags ?? []}
				else tags
			end,
			is_public = case
				when ${parsed.isPublic !== undefined} then ${parsed.isPublic ?? true}
				else is_public
			end,
			updated_at = now()
		where slug = ${slug}
		and edit_token = ${editToken}
		returning
			id,
			slug,
			name,
			description,
			username,
			scope,
			game_key,
			template_json,
			editor_state_json,
			preview_image_url,
			tags,
			is_public,
			created_at,
			updated_at
	`;

	if (rows.length === 0) return null;
	return toStoredTemplate(rows[0]);
}

export async function deleteTemplateBySlug(slug: string, editToken: string): Promise<boolean> {
	const sql = getSql();
	const result = await sql`
		delete from templates
		where slug = ${slug}
		and edit_token = ${editToken}
	`;

	return result.count > 0;
}
