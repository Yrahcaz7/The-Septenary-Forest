const modInfo = {
	name: "Color Factory",
	id: "Yrahcaz7-ModTree-ColorFactory",
	author: "Yrahcaz7",
	pointsName: "coins",
	modFiles: ["formatting.js", "components.js", "tree.js", "options.js", "layers.js"],
	initialStartPoints: newDecimalOne(),
	offlineLimit: 1,
};

const VERSION = {
	num: "4.2",
	name: "Expansion",
};

const changelog = `<h1>Changelog:</h1><br>
	<br><h3>v4.2: Expansion</h3><br>
		- Added six multiplier milestones.<br>
		- Added ten color upgrades.<br>
		- Added the rest of the colors.<br>
		- Various bugfixes.<br>
	<br><h3>v4.1: The Greatest QOL Update</h3><br>
		- Added a hotkey for multiplier resets.<br>
		- Added picking the multiplier color.<br>
		- Finally implemented bulk buying.<br>
		- Added one new color.<br>
	<br><h3>v4.0: New Beginning</h3><br>
		- Reworked everything.<br>
		- Added one new color.<br>
<br>`;

function winText() {
	return "You reached " + formatWhole(4096) + " " + layers.m.resource + " and won the game!<br>However, it isn't the end yet...<br>Wait for more updates for further content.";
};
function getStartPoints() {
	return new Decimal(modInfo.initialStartPoints);
};

function getRandInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

const canGenPoints = false;

function getPointGen() {
	return newDecimalZero();
};

function addedPlayerData() {return {}};

const displayThings = [
	() => { if (tmp.gameEnded) return "You beat the game!<br>For now..." },
];

function isEndgame() {
	return player.m.points.gte(4096);
};

function maxTickLength() {
	return 1;
};

function fixOldSave(oldVersion) {
	// some kind of reset thing? don't know what this was about
	if (player.r) {
		player = null;
		save(true);
		location.reload();
	};
	// remove unused vars
	delete player.spacer;
	delete options.colorDisplayMode;
	delete options.colorDisplay;
	// rename vars
	if (options.tooltipForcing !== undefined) {
		options.forceTooltips = options.tooltipForcing;
		delete options.tooltipForcing;
	};
	if (options.extendplaces !== undefined) {
		options.extendPlaces = options.extendplaces;
		delete options.extendplaces;
	};
};

function overridePointDisplay() {
	let html = "";
	if (player.points.lt("1e1000")) html += "<span class'overlayThing'>You have </span>";
	html += "<h2 class='overlayThing' id='points'>" + illionFormat(player.points) + "</h2>";
	if (player.points.lt("e1000000")) html += "<span class='overlayThing'> " + modInfo.pointsName + "</span><br>";
	html += "(average: " + illionFormat(getAverageCoinGain()) + "/sec)";
	return html;
};
