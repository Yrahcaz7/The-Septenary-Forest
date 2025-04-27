const modInfo = {
	name: "The Number Tree",
	id: "Yrahcaz7-ModTree-TheNumberTree",
	author: "Yrahcaz7",
	pointsName: "arabic numerals",
	modFiles: ["formatting.js", "tree.js", "options.js", "layers.js"],
	initialStartPoints: newDecimalZero(),
	offlineLimit: 1,
};

const VERSION = {
	num: "2.4",
	name: "Comprehension",
};

const changelog = `<h1>Changelog:</h1><br>
	<br><h3>v2.4: Comprehension</h3><br>
		- Added Comprehension.<br>
		- Added 3 greek numeral milestones.<br>
		- Added 4 greek numeral upgrades.<br>
	<br><h3>v2.3: The Greeks</h3><br>
		- Added greek numerals.<br>
		- Added Feat of Forgotten History.<br>
		- added Feat of Past and Present.<br>
		- added Feat of Time.<br>
		- Added 15 greek numeral milestones.<br>
		- Added 15 greek numeral upgrades.<br>
		- Added 8 intelligence milestones.<br>
	<br><h3>v2.2: Feats</h3><br>
		- Added Feats.<br>
		- Added Feat of Binary.<br>
		- Added Feat of Limits.<br>
		- Added Feat of History.<br>
		- Added Feat of Space.<br>
		- Added Feat of Dimensions.<br>
		- Added 6 intelligence milestones.<br>
	<br><h3>v2.1: Simulated</h3><br>
		- Added Simulation.<br>
		- Added 4 intelligence milestones.<br>
		- Added 15 intelligence upgrades.<br>
		- Added 5 digit upgrades.<br>
	<br><h3>v2.0: Intelligence</h3><br>
		- Added intelligence.<br>
		- Added Replicator.<br>
		- Added 5 intelligence milestones.<br>
		- Added 5 intelligence upgrades.<br>
		- Added 2 digit milestones.<br>
		- Added 5 digit upgrades.<br>
	<br><h3>v1.4: Limit Break</h3><br>
		- Added Limit Break.<br>
		- Added 3 digit milestones.<br>
		- Added 28 digit upgrades.<br>
	<br><h3>v1.3: Systematic</h3><br>
		- Added Base Up.<br>
		- Added 7 digit milestones.<br>
	<br><h3>v1.2: Breakthrough</h3><br>
		- Added 7 digit milestones.<br>
		- Added 4 digit upgrades.<br>
		- Added 3 roman numeral upgrades.<br>
	<br><h3>v1.1: Binary</h3><br>
		- Added digits.<br>
		- Added the number.<br>
		- Added number tracker.<br>
		- Added 4 digit upgrades.<br>
	<br><h3>v1.0: Roman Times</h3><br>
		- Added roman numerals.<br>
		- Added the roman numeral format.<br>
		- Added 15 roman numeral upgrades.<br>
		- Added 2 calculator options.<br>
<br>`;

function getUpgradeCap(layer, id) {
	return tmp[layer].upgrades[id].cap;
};

function getPointGen() {
	if (player.points.lt(0)) player.points = newDecimalZero();
	let gain = newDecimalOne();
	// upgrade effects
	if (hasUpgrade("rn", 11)) gain = gain.mul(upgradeEffect("rn", 11));
	if (hasUpgrade("rn", 13) && player.points.lt(getUpgradeCap("rn", 13))) gain = gain.mul(upgradeEffect("rn", 13));
	if (hasUpgrade("rn", 14) && player.points.lt(getUpgradeCap("rn", 14))) gain = gain.mul(upgradeEffect("rn", 14));
	if (hasUpgrade("rn", 15)) gain = gain.mul(upgradeEffect("rn", 15));
	if (hasUpgrade("rn", 25)) gain = gain.mul(upgradeEffect("rn", 25));
	if (hasUpgrade("rn", 35)) gain = gain.mul(upgradeEffect("rn", 35));
	if (hasUpgrade("gn", 11) && !inChallenge("i", 32)) gain = gain.mul(upgradeEffect("gn", 11));
	// layer effects
	if (player.d.unlocked) gain = gain.mul(tmp.d.effect.div(100).add(1));
	if (player.i.unlocked) gain = gain.mul(tmp.i.effect);
	// challenge effects
	if (inChallenge("i", 21)) gain = gain.mul(750);
	return gain;
};

function addedPlayerData() { return {
	nerdMode: false,
}};

const displayThings = [
	() => { if (tmp.gameEnded) return "You beat the game!<br>For now..." },
];

const endPoints = new Decimal("ee16");

function maxTickLength() {
	return 1;
};

function fixOldSave(oldVersion) {
	// remove unused vars
	delete player.spacer;
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
