const modInfo = {
	name: "Booster-Generator Tree",
	id: "booster-generator-tree-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "points",
	modFiles: ["tree.js", "options.js", "layers.js"],
	initialStartPoints: newDecimalZero(),
	offlineLimit: 24, // in hours
}

const VERSION = {
	num: "2.1",
	name: "Power of Hyper",
};

const changelog = `<h1>Changelog:</h1><br>
	<br><h3>v2.1 - Power of Hyper</h3><br>
		- Added the hyper generators layer.<br>
		- Added one milestone.<br>
		- Added three hyper generators.<br>
		- Added three hyper abilities.<br>
	<br><h3>v2.0 - Super Power Time</h3><br>
		- Added the super generators layer.<br>
		- Added seven milestones.<br>
		- Added nine super generators.<br>
		- Added fifteen upgrades.<br>
	<br><h3>v1.4 - Going Ever Higher</h3><br>
		- Added three milestones.<br>
		- Added ten upgrades.<br>
	<br><h3>v1.3 - New Upgrades Incoming</h3><br>
		- Added eight milestones.<br>
		- Added four generators.<br>
		- Added ten upgrades.<br>
	<br><h3>v1.2 - The Super Update</h3><br>
		- Added the super boosters layer.<br>
		- Added two milestones.<br>
		- Added five upgrades.<br>
	<br><h3>v1.1 - Boosters Galore</h3><br>
		- Added the boosters layer.<br>
		- Added two milestones.<br>
		- Added three generators.<br>
		- Added five upgrades.<br>
	<br><h3>v1.0 - Start the Generation</h3><br>
		- Added the generators layer.<br>
		- Added three generators.<br>
		- Added five upgrades.<br>
<br>`;

function winText() {
	return "You reached " + format(endgameBoosters) + " boosters and won the game!<br>However, it isn't the end yet...<br>Wait for more updates for further content.";
};

function getPointGen() {
	let gain = newDecimalOne();
	if (hasUpgrade("g", 11)) gain = gain.mul(upgradeEffect("g", 11));
	if (hasUpgrade("g", 12)) gain = gain.mul(upgradeEffect("g", 12));
	if (hasUpgrade("g", 13)) gain = gain.mul(upgradeEffect("g", 13));
	if (hasUpgrade("g", 15)) gain = gain.mul(upgradeEffect("g", 15));
	if (hasUpgrade("b", 22)) gain = gain.mul(upgradeEffect("b", 22));
	if (hasUpgrade("sg", 33)) gain = gain.mul(upgradeEffect("sg", 33));
	if (player.g.unlocked) gain = gain.mul(tmp.g.effect);
	if (player.b.unlocked) gain = gain.mul(tmp.b.effect);
	return gain;
};

const productionCap = 100; // 100 seconds

const endgameBoosters = new Decimal(2900);

function addedPlayerData() { return {}};

const displayThings = [
	() => {
		if (tmp.gameEnded) return "<br>you have beaten the game!";
		return "<br>you need " + formatWhole(endgameBoosters) + " boosters to beat the game";
	},
];

function isEndgame() {
	return player.b.points.gte(endgameBoosters);
};

function update(diff) {
	if (hasMilestone("sb", 3)) {
		player.points = tmp.pointGen.mul(productionCap);
	} else {
		player.points = player.points.min(tmp.pointGen.mul(productionCap));
	};
};

function maxTickLength() {
	return 1;
};

function fixOldSave(oldVersion) {
	delete player.blank;
	delete options.colorDisplayMode;
	delete options.colorDisplay;
	delete options.css;
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

const currentlyText = "<br>Effect: ";
