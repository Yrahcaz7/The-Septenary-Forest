const modInfo = {
	name: "The Septenary Forest",
	id: "Yrahcaz7/The-Septenary-Forest",
	author: "Yrahcaz7",
	pointsName: "points",
	modFiles: ["tree.js", "options.js", "layers.js"],
	discordName: "",
	discordLink: "",
	initialStartPoints: newDecimalZero(),
	offlineLimit: 1, // in hours
};

const VERSION = {
	num: "0.1",
	beta: "1",
	name: "Wood",
};

const changelog = `<h1>Changelog:</h1><br>
	<br><h3>v0.1 Beta: Wood</h3><br>
		- Added a new tab: Wood.<br>
		- Added chopping and auto-chopping.<br>
		- Added eight wood upgrades.<br>
	<br><h3>v0.0 Beta: UNIFICATION</h3><br>
		- Started unifying the trees.<br>
		- Upgraded from Vue 2 to Vue 3.<br>
		- Added some new custom features.<br>
		- Documented many custom features.<br>
<br>`;

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples. All official functions are already taken care of.)
const doNotCallTheseFunctionsEveryTick = ["doReset", "buy", "onPurchase", "blowUpEverything"];

// The test to display when the player wins the game.
function winText() {
	return "You reached " + format(endPoints) + " " + modInfo.pointsName + " and won the game!<br>However, it isn't the end yet...<br>Wait for more updates for further content.";
};

// The amount of points the player starts with after a reset.
function getStartPoints() {
	return new Decimal(modInfo.initialStartPoints)
};

// determines if points can be generated
function canGenPoints() {
	return true;
};

// calculates points/sec
function getPointGen() {
	let gain = newDecimalOne();
	if (hasUpgrade("t", 11)) gain = gain.mul(upgradeEffect("t", 11));
	if (hasUpgrade("t", 12)) gain = gain.mul(upgradeEffect("t", 12));
	if (hasUpgrade("t", 14)) gain = gain.mul(upgradeEffect("t", 14));
	return gain;
};

// added player[data]
function addedPlayerData() {return {}};

// display extra things at the top of the page
const displayThings = [
	() => {if (tmp.gameEnded) return "You beat the game!<br>For now..."},
];

// determines when the game "ends"
const endPoints = new Decimal(Infinity);

// runs after things are loaded
function onLoad() {};

// runs every frame right after point gain
function update(diff) {};

// style for the background, can be a function
const backgroundStyle = {};

// max tick length in seconds
function maxTickLength() {
	return 3600; // default is 1 hour which is just arbitrarily large
};

// bugfixes or inflation capping for old saves
function fixOldSave(oldVersion) {};
