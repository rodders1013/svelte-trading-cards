import { randomBytes, randomUUID } from 'node:crypto';
import { getSql } from '$lib/server/db.js';
import { CardTemplateSchema, type CardTemplate } from '$lib/types/CardTemplate.js';
import { z } from 'zod';

const CreateTemplateInputSchema = z.object({
	name: z.string().trim().min(3).max(80),
	description: z.string().trim().max(300).optional(),
	template: CardTemplateSchema,
	previewImageUrl: z.string().url().max(500).optional(),
	tags: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
	isPublic: z.boolean().default(true)
});

const UpdateTemplateInputSchema = z.object({
	name: z.string().trim().min(3).max(80).optional(),
	description: z.string().trim().max(300).optional(),
	template: CardTemplateSchema.optional(),
	previewImageUrl: z.string().url().max(500).optional(),
	tags: z.array(z.string().trim().min(1).max(30)).max(12).optional(),
	isPublic: z.boolean().optional()
});

export type CreateTemplateInput = z.infer<typeof CreateTemplateInputSchema>;
export type UpdateTemplateInput = z.infer<typeof UpdateTemplateInputSchema>;

export interface StoredTemplate {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	template: CardTemplate;
	previewImageUrl: string | null;
	tags: string[];
	isPublic: boolean;
	editToken?: string;
	createdAt: string;
	updatedAt: string;
}

function toStoredTemplate(row: Record<string, unknown>, includeEditToken = false): StoredTemplate {
	const rawTemplate = row.template_json;
	const parsedTemplate =
		typeof rawTemplate === 'string' ? JSON.parse(rawTemplate) : rawTemplate;

	return {
		id: String(row.id),
		slug: String(row.slug),
		name: String(row.name),
		description: row.description ? String(row.description) : null,
		template: CardTemplateSchema.parse(parsedTemplate),
		previewImageUrl: row.preview_image_url ? String(row.preview_image_url) : null,
		tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
		isPublic: Boolean(row.is_public),
		editToken: includeEditToken && row.edit_token ? String(row.edit_token) : undefined,
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

export async function listPublicTemplates(limit = 24, offset = 0): Promise<StoredTemplate[]> {
	const sql = getSql();
	const rows = await sql<Record<string, unknown>[]>`
		select
			id,
			slug,
			name,
			description,
			template_json,
			preview_image_url,
			tags,
			is_public,
			created_at,
			updated_at
		from templates
		where is_public = true
		order by updated_at desc
		limit ${Math.max(1, Math.min(limit, 100))}
		offset ${Math.max(0, offset)}
	`;

	return rows.map((row) => toStoredTemplate(row));
}

export async function getPublicTemplateBySlug(slug: string): Promise<StoredTemplate | null> {
	const sql = getSql();
	const rows = await sql<Record<string, unknown>[]>`
		select
			id,
			slug,
			name,
			description,
			template_json,
			preview_image_url,
			tags,
			is_public,
			created_at,
			updated_at
		from templates
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
	const templateJson = JSON.stringify(parsed.template);

	const rows = await sql<Record<string, unknown>[]>`
		insert into templates (
			id,
			slug,
			name,
			description,
			template_json,
			preview_image_url,
			tags,
			is_public,
			edit_token
		) values (
			${id},
			${slug},
			${parsed.name},
			${parsed.description ?? null},
			cast(${templateJson} as jsonb),
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
			template_json,
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
		parsed.template !== undefined ||
		parsed.previewImageUrl !== undefined ||
		parsed.tags !== undefined ||
		parsed.isPublic !== undefined;

	if (!hasPatch) return getPublicTemplateBySlug(slug);

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
			template_json = case
				when ${parsed.template !== undefined} then cast(${JSON.stringify(parsed.template ?? {})} as jsonb)
				else template_json
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
			template_json,
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
