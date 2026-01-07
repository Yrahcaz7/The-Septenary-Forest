let options = {};

function getStartOptions() {
	return Vue.reactive({
		autosave: true,
		msDisplay: "always",
		theme: "default",
		hqTree: false,
		offlineProd: true,
		hideChallenges: false,
		showStory: true,
		forceOneTab: false,
		forceTooltips: true,
		hideMilestonePopups: false,
		extendPlaces: false,
		colorText: "all",
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
		{opt: "colorText", text() {return "Colored Text: " + COLOR_DISPLAYS[COLOR_SETTINGS.indexOf(options[this.opt])]}, onClick: adjustColorText},
	],
];

function formatOpt(value) {
	if (value) return "ON";
	return "OFF";
};

function toggleOpt(name) {
	// toggle option
	options[name] = !options[name];
	// special
	if (name === "hqTree") changeTreeQuality();
	else if (name === "forceOneTab") needsCanvasUpdate = true;
};

const COLOR_DISPLAYS = ["ALL", "MAIN CURRENCY AND EFFECTS", "ONLY MAIN CURRENCY"];

const COLOR_SETTINGS = ["all", "eff", "points"];

function adjustColorText() {
	options.colorText = COLOR_SETTINGS[(COLOR_SETTINGS.indexOf(options.colorText) + 1) % COLOR_SETTINGS.length];
};
