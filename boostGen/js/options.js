let options = {};

function getStartOptions() {
	return Vue.reactive({
		autosave: true,
		msDisplay: 'always',
		theme: 'default',
		hqTree: false,
		offlineProd: true,
		hideChallenges: false,
		showStory: true,
		forceOneTab: false,
		forceTooltips: true,
		hideMilestonePopups: false,
		extendPlaces: false,
	});
};

const optionGrid = [
	[
		{text: "Save game", onClick: save},
		{opt: "autosave", text() {return "Autosave: " + formatOpt(options[this.opt])}, onClick: toggleOpt},
		{text: "HARD RESET", onClick: hardReset},
	], [
		{text: "Export save to clipboard", onClick: exportSave},
		{text: "Import save", onClick: importSave},
		{opt: "offlineProd", text() {return "Offline Prod: " + formatOpt(options[this.opt])}, onClick: toggleOpt},
	], [
		{opt: "theme", text() {return "Theme: " + getThemeName()}, onClick: switchTheme},
		{opt: "msDisplay", text() {return "Show Milestones: " + MS_DISPLAYS[MS_SETTINGS.indexOf(options[this.opt])]}, onClick: adjustMSDisp},
		{opt: "hqTree", text() {return "High-Quality Tree: " + formatOpt(options[this.opt])}, onClick: toggleOpt},
	], [
		{opt: "hideChallenges", text() {return "Show Completed Challenges: " + formatOpt(!options[this.opt])}, onClick: toggleOpt},
		{opt: "forceOneTab", text() {return "Single-Tab Mode: " + (options.forceOneTab ? "ALWAYS" : "AUTO")}, onClick: toggleOpt},
		{opt: "forceTooltips", text() {return "Shift-Click to Toggle Tooltips: " + formatOpt(options[this.opt])}, onClick: toggleOpt},
	], [
		{opt: "hideMilestonePopups", text() {return "Show Milestone Popups: " + formatOpt(!options[this.opt])}, onClick: toggleOpt},
		{opt: "extendPlaces", text() {return "Extended Decimal Places: " + formatOpt(options[this.opt])}, onClick: toggleOpt},
	],
];

function formatOpt(opt) {
	if (opt) return 'ON';
	return 'OFF';
};

function toggleOpt(name) {
	// toggle option
	options[name] = !options[name];
	// special
	if (name == 'hqTree') changeTreeQuality();
	else if (name == 'forceOneTab') needsCanvasUpdate = true;
};

function changeTreeQuality() {
	let on = options.hqTree;
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
	let complete = player[layer].milestones.includes(id);
	let auto = layers[layer].milestones[id].toggles;
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
