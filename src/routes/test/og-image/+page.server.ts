import type { PageServerLoad } from './$types';
import { renderOGImage, OG_IMAGE_PRESETS } from '$lib/server/index.js';
import type { CardTemplate, CardData } from '$lib/types/index.js';

// Sample template for testing
const sampleTemplate: CardTemplate = {
	name: 'OG Test Card',
	components: [
		{
			id: 'card-base',
			type: 'Group',
			props: {
				x: -35,
				y: -35,
				width: 820,
				height: 1120,
				isCardBase: true
			},
			children: [
				{
					id: 'bg',
					type: 'GradientBackground',
					props: {
						colors: ['#1e1b4b', '#312e81', '#4338ca'],
						direction: 'vertical'
					}
				},
				{
					id: 'border',
					type: 'Border',
					props: {
						color: '#fbbf24',
						width: 43
					}
				}
			]
		},
		{
			id: 'title-zone',
			type: 'Group',
			props: {
				x: 50,
				y: 80,
				width: 650,
				height: 60
			},
			children: [
				{
					id: 'title',
					type: 'TextField',
					props: {
						dataField: 'title',
						maxFontSize: 48,
						minFontSize: 24,
						color: '#ffffff',
						fontWeight: 'bold',
						alignment: 'center'
					}
				}
			]
		},
		{
			id: 'image-zone',
			type: 'Group',
			props: {
				x: 75,
				y: 160,
				width: 600,
				height: 450,
				radius: 12
			},
			children: [
				{
					id: 'card-image',
					type: 'Image',
					props: {
						dataField: 'imageUrl',
						fit: 'cover'
					}
				}
			]
		},
		{
			id: 'subtitle-zone',
			type: 'Group',
			props: {
				x: 50,
				y: 640,
				width: 650,
				height: 40
			},
			children: [
				{
					id: 'subtitle',
					type: 'TextField',
					props: {
						dataField: 'subtitle',
						maxFontSize: 28,
						minFontSize: 16,
						color: '#a5b4fc',
						alignment: 'center'
					}
				}
			]
		},
		{
			id: 'stats-zone',
			type: 'Group',
			props: {
				x: 50,
				y: 720,
				width: 650,
				height: 200
			},
			children: [
				{
					id: 'stats',
					type: 'StatPanel',
					props: {
						rows: [
							{ label: 'Rating', valueField: 'rating' },
							{ label: 'Level', valueField: 'level' },
							{ label: 'XP', valueField: 'xp' }
						],
						labelColor: '#94a3b8',
						valueColor: '#fbbf24',
						fontSize: 22,
						gap: 12
					}
				}
			]
		}
	]
};

const sampleData: CardData = {
	title: 'Legendary Hero',
	subtitle: 'Master of the Realm',
	imageUrl: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=600&h=450&fit=crop',
	rating: '98/100',
	level: '50',
	xp: '125,000'
};

export const load: PageServerLoad = async ({ url }) => {
	// Get params from URL
	const preset = (url.searchParams.get('preset') as keyof typeof OG_IMAGE_PRESETS) || 'twitter';
	const showLogo = url.searchParams.get('logo') !== 'false';
	const showWatermark = url.searchParams.get('watermark') !== 'false';
	const showCaption = url.searchParams.get('caption') === 'true';
	const background = url.searchParams.get('bg') || '#0f172a';

	try {
		const { buffer, width, height } = await renderOGImage(sampleTemplate, sampleData, {
			preset,
			background,
			backgroundGradient: url.searchParams.get('gradient') === 'true'
				? { from: '#1e1b4b', to: '#0f172a', direction: 'diagonal' }
				: undefined,
			cardScale: 0.85,
			branding: {
				logo: showLogo
					? {
							url: 'https://svelte.dev/svelte-logo-horizontal.svg',
							position: 'top-left',
							size: 40,
							padding: 20
						}
					: undefined,
				watermark: showWatermark
					? {
							text: 'svelte-trading-cards',
							position: 'bottom-right',
							fontSize: 16,
							opacity: 0.5
						}
					: undefined,
				caption: showCaption
					? {
							title: sampleData.title as string,
							subtitle: 'Created with svelte-trading-cards',
							position: 'below'
						}
					: undefined
			}
		});

		// Convert buffer to base64 for display
		const base64 = buffer.toString('base64');
		const dataUrl = `data:image/png;base64,${base64}`;

		return {
			imageDataUrl: dataUrl,
			width,
			height,
			preset,
			presets: Object.keys(OG_IMAGE_PRESETS) as (keyof typeof OG_IMAGE_PRESETS)[],
			options: {
				showLogo,
				showWatermark,
				showCaption,
				background
			}
		};
	} catch (error) {
		console.error('Error rendering OG image:', error);
		return {
			error: error instanceof Error ? error.message : 'Unknown error',
			preset,
			presets: Object.keys(OG_IMAGE_PRESETS) as (keyof typeof OG_IMAGE_PRESETS)[],
			options: {
				showLogo,
				showWatermark,
				showCaption,
				background
			}
		};
	}
};
