import { z } from 'zod';

/**
 * Demo card data schema - a concrete example of CardData for testing.
 * Both creator and gallery pages use this same shape to prove
 * the system is truly data-agnostic.
 */
export const DemoCardSchema = z.object({
	id: z.string(),
	title: z.string(),
	subtitle: z.string(),
	description: z.string(),
	imageUrl: z.string(),
	category: z.string(),
	rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
	date: z.string(),
	stats: z.array(
		z.object({
			label: z.string(),
			value: z.string()
		})
	)
});

export type DemoCard = z.infer<typeof DemoCardSchema>;

export const DemoDatasetSchema = z.object({
	name: z.string(),
	description: z.string(),
	cards: z.array(DemoCardSchema)
});

export type DemoDataset = z.infer<typeof DemoDatasetSchema>;

/**
 * Saved template with metadata
 */
export const SavedTemplateSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	template: z.object({
		name: z.string(),
		components: z.array(z.unknown())
	})
});

export type SavedTemplate = z.infer<typeof SavedTemplateSchema>;
