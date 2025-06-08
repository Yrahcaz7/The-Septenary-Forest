const themeNames = ["default", "aqua"];

const themeColors = {
	default: {
		1: "#ffffff", // Branch color 1
		2: "#bfbfbf", // Branch color 2
		3: "#7f7f7f", // Branch color 3
		color: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		tooltipBackground: "rgba(0, 0, 0, 0.75)",
	},
	aqua: {
		1: "#bfdfff",
		2: "#8fa7bf",
		3: "#5f6f7f",
		color: "#bfdfff",
		points: "#dfefff",
		locked: "#c4a7b3",
		background: "#001f3f",
		tooltipBackground: "rgba(0, 15, 31, 0.75)",
	},
};

function changeTheme() {
	const colors = themeColors[getThemeName()];
	document.body.style.setProperty("--background", colors.background);
	document.body.style.setProperty("--tooltipBackground", colors.tooltipBackground);
	document.body.style.setProperty("--color", colors.color);
	document.body.style.setProperty("--points", colors.points);
	document.body.style.setProperty("--locked", colors.locked);
};

function getThemeName() {
	return options.theme || "default";
};

function switchTheme() {
	const index = themeNames.indexOf(options.theme);
	if (options.theme === null || index >= themeNames.length - 1 || index < 0) {
		options.theme = themeNames[0];
	} else {
		options.theme = themeNames[index + 1];
	};
	changeTheme();
	resizeCanvas();
};
