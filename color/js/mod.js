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
		- Added nine color upgrades.<br>
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

let winText = "<h3>You won the game!</h3><br>However, it isn't the end yet...<br>Wait for more updates for further content.";

function getStartPoints() {
	return new Decimal(modInfo.initialStartPoints);
};

function getRandInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

function canGenPoints() {
	return false;
};

function getPointGen() {
	return newDecimalZero();
};

function addedPlayerData() {return {}};

let displayThings = [];

function isEndgame() {
	return false;
};

let backgroundStyle = {};

function maxTickLength() {
	return 1;
};

function fixOldSave(oldVersion) {
	if (player.r) {
		player = null;
		save(true);
		window.location.reload();
	};
	delete player.spacer;
	delete options.colorDisplayMode;
	delete options.colorDisplay;
};

function overridePointDisplay() {
	let html = "";
	if (player.points.lt("1e1000")) html += "<span class'overlayThing'>You have&nbsp;</span>";
	html += "<h2 class='overlayThing' id='points'>" + illionFormat(player.points) + "</h2>";
	if (player.points.lt("e1000000")) html += "<span class='overlayThing'>&nbsp;" + modInfo.pointsName + "</span><br>";
	html += "average: " + illionFormat(getAverageCoinGain()) + "/sec";
	return html;
};
