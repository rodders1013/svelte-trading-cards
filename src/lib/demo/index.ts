export * from './types.js';

// Re-export data loaders
import creatorData from './data/creator-data.json';
import galleryData from './data/gallery-data.json';
import sportsData from './data/sports-data.json';
import defaultTemplate from './templates/default-template.json';

export const datasets = {
	creator: creatorData,
	gallery: galleryData,
	sports: sportsData
} as const;

export const templates = {
	default: defaultTemplate
} as const;

export type DatasetKey = keyof typeof datasets;
