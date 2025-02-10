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
		colorDisplayMode: 0,
		colorDisplay: 0,
		extendplaces: false,
		hideMilestonePopups: false,
		disableGlitchText: false,
	});
};

const DISPLAY_MODES = ['ALL (recommended)', 'ONLY SPECIAL', 'SPECIAL AND TITLES', 'SPECIAL AND REFRENCES'];

const COLOR_DISPLAYS = ['ON - NORMAL (recommended)', 'ON - ALWAYS DARK', 'OFF (recommended for colorblind)'];

let colorValue = [[true, true, true], 'normal'];

function displayMode() {
	options.colorDisplayMode++;
	if (options.colorDisplayMode >= DISPLAY_MODES.length) options.colorDisplayMode = 0;
	calculateColorValue();
};

function colorDisplay() {
	options.colorDisplay++;
	if (options.colorDisplay >= COLOR_DISPLAYS.length) options.colorDisplay = 0;
	calculateColorValue();
};

function calculateColorValue() {
	switch (options.colorDisplayMode) {
		case 0:
			colorValue[0] = [true, true, true];
			break;
		case 1:
			colorValue[0] = [true, false, false];
			break;
		case 2:
			colorValue[0] = [true, true, false];
			break;
		case 3:
			colorValue[0] = [true, false, true];
			break;
	};
	switch (options.colorDisplay) {
		case 0:
			colorValue[1] = 'normal';
			break;
		case 1:
			colorValue[1] = 'dark';
			break;
		case 2:
			colorValue[1] = 'none';
			break;
	};
};
