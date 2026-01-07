function changeTreeQuality() {
	const on = options.hqTree;
	document.body.style.setProperty('--hqProperty1', on ? '2px solid' : '4px solid');
	document.body.style.setProperty('--hqProperty2a', on ? '-4px -4px 4px #00000040 inset' : '-4px -4px 4px #00000000 inset');
	document.body.style.setProperty('--hqProperty2b', on ? '0px 0px 20px var(--background)' : '');
	document.body.style.setProperty('--hqProperty3', on ? '2px 2px 4px #00000040' : 'none');
};

function toggleAuto(toggle) {
	player[toggle[0]][[toggle[1]]] = !player[toggle[0]][toggle[1]];
	needCanvasUpdate = true;
};

const MS_DISPLAYS = ['ALL', 'LAST, AUTO, INCOMPLETE (recommended)', 'AUTOMATION, INCOMPLETE (recommended)', 'INCOMPLETE', 'NONE'];

const MS_SETTINGS = ['always', 'last', 'automation', 'incomplete', 'never'];

function adjustMSDisp() {
	options.msDisplay = MS_SETTINGS[(MS_SETTINGS.indexOf(options.msDisplay) + 1) % MS_SETTINGS.length];
};

function milestoneShown(layer, id) {
	if (layers[layer].milestones[id] === undefined) return false;
	const complete = player[layer].milestones.includes(id);
	const auto = layers[layer].milestones[id].toggles;
	switch (options.msDisplay) {
		case 'always':
			return true;
		case 'last':
			return auto || !complete || player[layer].lastMilestone === id;
		case 'automation':
			return auto || !complete;
		case 'incomplete':
			return !complete;
		case 'never':
			return false;
	};
	return false;
};
