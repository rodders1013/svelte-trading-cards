import { registerComponent, Group } from '$lib';
import { Icon } from '$lib/card/icons';
import * as backgrounds from '$lib/card/backgrounds';
import * as borders from '$lib/card/borders';
import * as fields from '$lib/card/fields';
import * as decorations from '$lib/card/decorations';

let registered = false;

export function registerPreviewComponents(): void {
	if (registered) return;

	registerComponent('Group', Group);
	registerComponent('Icon', Icon);

	const modules = [backgrounds, borders, fields, decorations];
	for (const mod of modules) {
		for (const [name, component] of Object.entries(mod)) {
			if (typeof component === 'function' || (component && typeof component === 'object')) {
				registerComponent(name, component as any);
			}
		}
	}

	registered = true;
}
