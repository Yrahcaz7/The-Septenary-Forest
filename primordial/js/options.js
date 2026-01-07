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
		nerdMode: false,
		colorDisplayMode: 0,
		colorDisplay: 0,
		extendPlaces: false,
		disableGlitchText: false,
	});
};

const optionGrid = [
	[
		{text: "Save game", onClick: save},
		{opt: "autosave", text() {return "Autosave: " + formatOpt(options[this.opt])}, onClick: toggleOpt},
		{text: "HARD RESET", onClick: hardReset},
		{opt: "colorDisplayMode", text() {return "Color Text Mode: " + DISPLAY_MODES[options[this.opt]]}, onClick: adjustColorDispMode},
	], [
		{text: "Export save to clipboard", onClick: exportSave},
		{text: "Import save", onClick: importSave},
		{opt: "offlineProd", text() {return "Offline Prod: " + formatOpt(options[this.opt])}, onClick: toggleOpt},
		{opt: "colorDisplay", text() {return "Colored Text: " + COLOR_DISPLAYS[options[this.opt]]}, onClick: adjustColorDisp},
	], [
		{opt: "theme", text() {return "Theme: " + getThemeName()}, onClick: switchTheme},
		{opt: "msDisplay", text() {return "Show Milestones: " + MS_DISPLAYS[MS_SETTINGS.indexOf(options[this.opt])]}, onClick: adjustMSDisp},
		{opt: "hqTree", text() {return "High-Quality Tree: " + formatOpt(options[this.opt])}, onClick: toggleOpt},
		{opt: "disableGlitchText", text() {return "Glitch Text: " + formatOpt(!options[this.opt]) + " (when off, qestion marks are displayed instead)"}, onClick: toggleOpt},
	], [
		{opt: "hideChallenges", text() {return "Show Completed Challenges: " + formatOpt(!options[this.opt])}, onClick: toggleOpt},
		{opt: "forceOneTab", text() {return "Single-Tab Mode: " + (options[this.opt] ? "ALWAYS" : "AUTO")}, onClick: toggleOpt},
		{opt: "forceTooltips", text() {return "Shift-Click to Toggle Tooltips: " + formatOpt(options[this.opt])}, onClick: toggleOpt},
		{opt: "extendPlaces", text() {return "Extended Decimal Places: " + formatOpt(options[this.opt])}, onClick: toggleOpt},
	], [
		{opt: "hideMilestonePopups", text() {return "Show Milestone Popups: " + formatOpt(!options[this.opt])}, onClick: toggleOpt},
		{opt: "nerdMode", text() {return "Nerd Mode: " + formatOpt(options[this.opt]) + " (you can also use the control key to toggle)"}, onClick: toggleOpt},
		{text() {return (player.devSpeed == 0 ? "Unpause" : "Pause") + " (you can also use the space key to toggle)"}, onClick: togglePause},
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
	if (name == "hqTree") changeTreeQuality();
	else if (name == "forceOneTab") needsCanvasUpdate = true;
};

const pausedDisplay = "Paused. Press space to unpause.";

function togglePause() {
	if (player.devSpeed == 0) player.devSpeed = 1;
	else player.devSpeed = 0;
};

function onKeyDown(key) {
	if (ctrlDown) options.nerdMode = !options.nerdMode;
	if (key == " " && !focused) togglePause();
};

const DISPLAY_MODES = ["ALL (recommended)", "ONLY SPECIAL", "SPECIAL AND TITLES", "SPECIAL AND REFRENCES"];

const COLOR_DISPLAYS = ["ON - NORMAL (recommended)", "ON - ALWAYS DARK", "OFF (recommended for colorblind)"];

let colorValue = [[true, true], "normal"];

function adjustColorDispMode() {
	options.colorDisplayMode++;
	if (options.colorDisplayMode >= DISPLAY_MODES.length) options.colorDisplayMode = 0;
	calculateColorValue();
};

function adjustColorDisp() {
	options.colorDisplay++;
	if (options.colorDisplay >= COLOR_DISPLAYS.length) options.colorDisplay = 0;
	calculateColorValue();
};

function calculateColorValue() {
	switch (options.colorDisplayMode) {
		case 0:
			colorValue[0] = [true, true];
			break;
		case 1:
			colorValue[0] = [false, false];
			break;
		case 2:
			colorValue[0] = [true, false];
			break;
		case 3:
			colorValue[0] = [false, true];
			break;
	};
	switch (options.colorDisplay) {
		case 0:
			colorValue[1] = "normal";
			break;
		case 1:
			colorValue[1] = "dark";
			break;
		case 2:
			colorValue[1] = "none";
			break;
	};
};
