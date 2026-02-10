import type { AnimationType, AnimationEasing } from './types.js';

export type AnimationId = Exclude<AnimationType, 'none'>;

export interface AnimationKeyframe {
	name: string;
	css: string;
}

export interface AnimationClassDef {
	className: string;
	selector?: string;
	keyframe: string;
	defaultDuration?: string;
	defaultEasing?: AnimationEasing | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
	extraCss?: string;
}

export interface AnimationUIHints {
	supportsDirection?: boolean;
	supportsOrigin?: boolean;
	supportsPulsePattern?: boolean;
	supportsFloatStyle?: boolean;
	supportsScale?: boolean;
	supportsFloatDistance?: boolean;
	supportsFloatRotation?: boolean;
}

export interface AnimationDefinition {
	id: AnimationId;
	label: string;
	description: string;
	defaultEasing: AnimationEasing;
	supportsDirection: boolean;
	directionClassByDirection?: Partial<Record<'clockwise' | 'counterclockwise', string>>;
	keyframes: AnimationKeyframe[];
	classes: AnimationClassDef[];
	ui?: AnimationUIHints;
}

export const ANIMATION_DEFINITIONS: AnimationDefinition[] = [
	{
		id: 'spin',
		label: 'Spin',
		description: 'Continuous rotation',
		defaultEasing: 'linear',
		supportsDirection: true,
		directionClassByDirection: {
			clockwise: 'tc-spin',
			counterclockwise: 'tc-spin-reverse'
		},
		keyframes: [
			{
				name: 'tc-spin',
				css: `
				from { transform: rotate(0deg); }
				to { transform: rotate(360deg); }
			`
			},
			{
				name: 'tc-spin-reverse',
				css: `
				from { transform: rotate(360deg); }
				to { transform: rotate(0deg); }
			`
			}
		],
		classes: [
			{
				className: 'tc-spin',
				keyframe: 'tc-spin',
				defaultDuration: '1.5s',
				defaultEasing: 'linear'
			},
			{
				className: 'tc-spin-reverse',
				keyframe: 'tc-spin-reverse',
				defaultDuration: '1.5s',
				defaultEasing: 'linear'
			}
		],
		ui: {
			supportsDirection: true,
			supportsOrigin: true
		}
	},
	{
		id: 'pulse',
		label: 'Pulse',
		description: 'Scale up and down gently',
		defaultEasing: 'ease-in-out',
		supportsDirection: false,
		keyframes: [
			{
				name: 'tc-pulse',
				css: `
				0%, 100% { transform: scale(1); }
				50% { transform: scale(var(--tc-scale, 1.1)); }
			`
			},
			{
				name: 'tc-pulse-heartbeat',
				css: `
				0%, 100% { transform: scale(1); }
				15% { transform: scale(var(--tc-scale, 1.1)); }
				30% { transform: scale(1); }
				45% { transform: scale(calc(var(--tc-scale, 1.1) * 0.85)); }
				60% { transform: scale(1); }
			`
			},
			{
				name: 'tc-pulse-triple',
				css: `
				0%, 100% { transform: scale(1); }
				10% { transform: scale(var(--tc-scale, 1.1)); }
				20% { transform: scale(1); }
				35% { transform: scale(calc(var(--tc-scale, 1.1) * 0.9)); }
				45% { transform: scale(1); }
				60% { transform: scale(calc(var(--tc-scale, 1.1) * 0.8)); }
				70% { transform: scale(1); }
			`
			}
		],
		classes: [
			{
				className: 'tc-pulse',
				keyframe: 'tc-pulse',
				defaultDuration: '1.5s',
				defaultEasing: 'ease-in-out'
			},
			{
				className: 'tc-pulse-heartbeat',
				keyframe: 'tc-pulse-heartbeat',
				defaultDuration: '1.5s',
				defaultEasing: 'ease-in-out'
			},
			{
				className: 'tc-pulse-triple',
				keyframe: 'tc-pulse-triple',
				defaultDuration: '1.5s',
				defaultEasing: 'ease-in-out'
			}
		],
		ui: {
			supportsOrigin: true,
			supportsPulsePattern: true,
			supportsScale: true
		}
	},
	{
		id: 'bounce',
		label: 'Bounce',
		description: 'Bouncy vertical movement',
		defaultEasing: 'ease-in-out',
		supportsDirection: false,
		keyframes: [
			{
				name: 'tc-bounce',
				css: `
				0%, 100% { transform: translateY(0); }
				50% { transform: translateY(-10%); }
			`
			}
		],
		classes: [
			{
				className: 'tc-bounce',
				keyframe: 'tc-bounce',
				defaultDuration: '1.5s',
				defaultEasing: 'ease-in-out'
			}
		],
		ui: {
			supportsOrigin: true
		}
	},
	{
		id: 'shake',
		label: 'Shake',
		description: 'Quick horizontal shake',
		defaultEasing: 'ease-in-out',
		supportsDirection: false,
		keyframes: [
			{
				name: 'tc-shake',
				css: `
				0%, 100% { transform: translateX(0); }
				10%, 30%, 50%, 70%, 90% { transform: translateX(-2%); }
				20%, 40%, 60%, 80% { transform: translateX(2%); }
			`
			}
		],
		classes: [
			{
				className: 'tc-shake',
				keyframe: 'tc-shake',
				defaultDuration: '1.5s',
				defaultEasing: 'ease-in-out'
			}
		]
	},
	{
		id: 'float',
		label: 'Float',
		description: 'Gentle floating motion',
		defaultEasing: 'ease-in-out',
		supportsDirection: false,
		keyframes: [
			{
				name: 'tc-float',
				css: `
				0%, 100% { transform: translateY(0) rotate(0deg); }
				25% { transform: translateY(calc(var(--tc-float-distance, 3) * -1%)) rotate(calc(var(--tc-float-rotation, 1) * 1deg)); }
				75% { transform: translateY(calc(var(--tc-float-distance, 3) * 1%)) rotate(calc(var(--tc-float-rotation, 1) * -1deg)); }
			`
			},
			{
				name: 'tc-float-bob',
				css: `
				0%, 100% { transform: translateY(0); }
				50% { transform: translateY(calc(var(--tc-float-distance, 3) * -1%)); }
			`
			},
			{
				name: 'tc-float-sway',
				css: `
				0%, 100% { transform: translateX(0); }
				25% { transform: translateX(calc(var(--tc-float-distance, 3) * -1%)); }
				75% { transform: translateX(calc(var(--tc-float-distance, 3) * 1%)); }
			`
			},
			{
				name: 'tc-float-orbit',
				css: `
				0% { transform: translate(0, calc(var(--tc-float-distance, 3) * -1%)); }
				25% { transform: translate(calc(var(--tc-float-distance, 3) * 1%), 0); }
				50% { transform: translate(0, calc(var(--tc-float-distance, 3) * 1%)); }
				75% { transform: translate(calc(var(--tc-float-distance, 3) * -1%), 0); }
				100% { transform: translate(0, calc(var(--tc-float-distance, 3) * -1%)); }
			`
			}
		],
		classes: [
			{
				className: 'tc-float',
				keyframe: 'tc-float',
				defaultDuration: '3s',
				defaultEasing: 'ease-in-out'
			},
			{
				className: 'tc-float-bob',
				keyframe: 'tc-float-bob',
				defaultDuration: '3s',
				defaultEasing: 'ease-in-out'
			},
			{
				className: 'tc-float-sway',
				keyframe: 'tc-float-sway',
				defaultDuration: '3s',
				defaultEasing: 'ease-in-out'
			},
			{
				className: 'tc-float-orbit',
				keyframe: 'tc-float-orbit',
				defaultDuration: '3s',
				defaultEasing: 'ease-in-out'
			}
		],
		ui: {
			supportsFloatStyle: true,
			supportsFloatDistance: true,
			supportsFloatRotation: true
		}
	},
	{
		id: 'fade',
		label: 'Fade',
		description: 'Pulsing opacity in and out',
		defaultEasing: 'ease-in-out',
		supportsDirection: false,
		keyframes: [
			{
				name: 'tc-fade',
				css: `
				0%, 100% { opacity: 1; }
				50% { opacity: 0.6; }
			`
			}
		],
		classes: [
			{
				className: 'tc-fade',
				keyframe: 'tc-fade',
				defaultDuration: '1.5s',
				defaultEasing: 'ease-in-out'
			}
		]
	},
	{
		id: 'ping',
		label: 'Ping',
		description: 'Attention-grabbing ping',
		defaultEasing: 'ease-out',
		supportsDirection: false,
		keyframes: [
			{
				name: 'tc-ping',
				css: `
				0% { transform: scale(1); opacity: 1; }
				75%, 100% { transform: scale(1.5); opacity: 0; }
			`
			}
		],
		classes: [
			{
				className: 'tc-ping',
				keyframe: 'tc-ping',
				defaultDuration: '1s',
				defaultEasing: 'ease-out'
			}
		],
		ui: {
			supportsOrigin: true
		}
	},
	{
		id: 'trace',
		label: 'Trace',
		description: 'Neon sign drawing effect (works on stroked elements)',
		defaultEasing: 'linear',
		supportsDirection: true,
		directionClassByDirection: {
			clockwise: 'tc-trace',
			counterclockwise: 'tc-trace-reverse'
		},
		keyframes: [
			{
				name: 'tc-trace',
				css: `
				0% { stroke-dashoffset: 0; }
				100% { stroke-dashoffset: var(--tc-trace-offset, 5000); }
			`
			},
			{
				name: 'tc-trace-reverse',
				css: `
				0% { stroke-dashoffset: var(--tc-trace-offset, 5000); }
				100% { stroke-dashoffset: 0; }
			`
			}
		],
		classes: [
			{
				className: 'tc-trace',
				selector:
					'.tc-trace path, .tc-trace circle, .tc-trace rect, .tc-trace line, .tc-trace polyline, .tc-trace polygon',
				keyframe: 'tc-trace',
				defaultDuration: '15s',
				defaultEasing: 'linear',
				extraCss: `
  stroke-dasharray: var(--tc-trace-dasharray, 12 9999);
  stroke-linecap: var(--tc-trace-linecap, round);
  stroke: var(--tc-trace-color, currentColor);
  stroke-width: var(--tc-trace-width, inherit);
  opacity: var(--tc-trace-opacity, 1);
`
			},
			{
				className: 'tc-trace-reverse',
				selector:
					'.tc-trace-reverse path, .tc-trace-reverse circle, .tc-trace-reverse rect, .tc-trace-reverse line, .tc-trace-reverse polyline, .tc-trace-reverse polygon',
				keyframe: 'tc-trace-reverse',
				defaultDuration: '15s',
				defaultEasing: 'linear',
				extraCss: `
  stroke-dasharray: var(--tc-trace-dasharray, 12 9999);
  stroke-linecap: var(--tc-trace-linecap, round);
  stroke: var(--tc-trace-color, currentColor);
  stroke-width: var(--tc-trace-width, inherit);
  opacity: var(--tc-trace-opacity, 1);
`
			}
		],
		ui: {
			supportsDirection: true
		}
	},
	{
		id: 'glint',
		label: 'Glint',
		description: 'Traveling diagonal highlight sweep',
		defaultEasing: 'linear',
		supportsDirection: true,
		directionClassByDirection: {
			clockwise: 'tc-glint-band',
			counterclockwise: 'tc-glint-band-reverse'
		},
		keyframes: [
			{
				name: 'tc-glint-band',
				css: `
				0% { x: -1.2; }
				100% { x: 2.2; }
			`
			},
			{
				name: 'tc-glint-band-reverse',
				css: `
				0% { x: 2.2; }
				100% { x: -1.2; }
			`
			}
		],
		classes: [
			{
				className: 'tc-glint-band',
				keyframe: 'tc-glint-band',
				defaultDuration: '4s',
				defaultEasing: 'linear'
			},
			{
				className: 'tc-glint-band-reverse',
				keyframe: 'tc-glint-band-reverse',
				defaultDuration: '4s',
				defaultEasing: 'linear'
			}
		],
		ui: {
			supportsDirection: true
		}
	}
];

const EXTRA_KEYFRAMES: AnimationKeyframe[] = [
	{
		name: 'tc-shimmer',
		css: `
		0% { filter: hue-rotate(0deg); }
		100% { filter: hue-rotate(360deg); }
	`
	},
	{
		name: 'tc-glow-pulse',
		css: `
		0%, 100% { opacity: var(--tc-glow-intensity, 0.5); }
		50% { opacity: calc(var(--tc-glow-intensity, 0.5) * 0.3); }
	`
	}
];

const EXTRA_CLASSES: AnimationClassDef[] = [
	{
		className: 'tc-shimmer',
		keyframe: 'tc-shimmer',
		defaultDuration: '3s',
		defaultEasing: 'linear'
	},
	{
		className: 'tc-glow-pulse',
		keyframe: 'tc-glow-pulse',
		defaultDuration: '2s',
		defaultEasing: 'ease-in-out'
	}
];

export function getAnimationDefinition(type: AnimationType): AnimationDefinition | undefined {
	if (type === 'none') return undefined;
	return ANIMATION_DEFINITIONS.find((def) => def.id === type);
}

export function getAnimationMeta(type: AnimationType): AnimationUIHints {
	return getAnimationDefinition(type)?.ui ?? {};
}

export function getAllAnimationKeyframes(): string {
	const allKeyframes = [
		...ANIMATION_DEFINITIONS.flatMap((def) => def.keyframes),
		...EXTRA_KEYFRAMES
	];
	return allKeyframes.map((kf) => `@keyframes ${kf.name} {${kf.css}}`).join('\n');
}

export function getAllAnimationClasses(): string {
	const allClasses = [
		...ANIMATION_DEFINITIONS.flatMap((def) => def.classes),
		...EXTRA_CLASSES
	];

	return allClasses
		.map((cls) => {
			const duration = cls.defaultDuration ?? '1.5s';
			const easing = cls.defaultEasing ?? 'ease-in-out';
			const extra = cls.extraCss ? `\n${cls.extraCss}` : '';
			const selector = cls.selector ?? `.${cls.className}`;
			return `
${selector} {
  animation: ${cls.keyframe} var(--tc-duration, ${duration}) var(--tc-easing, ${easing}) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);${extra}
}`;
		})
		.join('\n');
}
