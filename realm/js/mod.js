const modInfo = {
	name: "Realm Creator",
	id: "realm-creator-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "coins",
	modFiles: ["tree.js", "options.js", "layers.js"],
	initialStartPoints: newDecimalZero(),
	offlineLimit: 1,
}

const VERSION = {
	num: "0.4",
	name: "Super Beta",
	beta: "2",
};

const changelog = `<h1>Changelog:</h1><br>
	<br><h3>v0.4 - Super Beta</h3><br>
		- Added 2 new creation tiers.<br>	
		- Added 3 gem power upgrades.<br>
		- Added 2 mana upgrades.<br>
		- Added 2 autocating upgrades.<br>
		- Added 6 elf upgrades.<br>
		- Added 6 angel upgrades.<br>
		- Added 3 demon upgrades.<br>
		- Added even more stats to the stat menu.<br>
		- Various fixes.<br>
	<br><h3>v0.3 - Spells Beta</h3><br>
		- Added 5 new creation tiers.<br>
		- Added casting, mana, and spells.<br>
		- Added 2 normal spells.<br>
		- Added 2 side spells.<br>
		- Added 2 mana upgrades.<br>
		- Added 3 fairy upgrades.<br>
		- Added 6 goblin upgrades.<br>
		- Added more types of stats to the stat menu.<br>
		- Minor fixes.<br>
	<br><h3>v0.2 - Factions Beta</h3><br>
		- Added 5 new creation tiers.<br>
		- Added faction coins.<br>
		- Added choosing a faction.<br>
		- Added a new tab for faction stuff.<br>
		- Fixed various issues with the stats menu.<br>
		- Added faction coin stats to the stat menu.<br>
	<br><h3>v0.1 - Beta Test</h3><br>
		- Added the click button.<br>
		- Added 3 creations.<br>
		- Added a stats menu.<br>
<br>`;

const winText = `Congratulations! You have reached the end and beaten this game, but for now...`;

function getRandInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

function taxCast() {
	player[2].mana = player[2].mana.sub(player[2].taxCost);
	player[2].G.taxCasts = player[2].G.taxCasts.add(1);
	player[2].R.taxCasts = player[2].R.taxCasts.add(1);
	player[2].T.taxCasts = player[2].T.taxCasts.add(1);
	let gain = getPointGen().mul(player[2].taxEff);
	player.points = player.points.add(gain);
	player.best = player.best.max(player.points);
	player.total = player.total.add(gain);
};

function callCast() {
	player[2].callTime = new Decimal(30);
	player[2].mana = player[2].mana.sub(player[2].callCost);
	player[2].G.callCasts = player[2].G.callCasts.add(1);
	player[2].R.callCasts = player[2].R.callCasts.add(1);
	player[2].T.callCasts = player[2].T.callCasts.add(1);
	setClickableState('2', 12, "ON");
};

function sideSpellCast() {
	player[2].sideSpellTime = new Decimal(15);
	player[2].mana = player[2].mana.sub(player[2].sideSpellCost);
		if (hasUpgrade('3', 11)) {
			player[2].G.holyCasts = player[2].G.holyCasts.add(1);
			player[2].R.holyCasts = player[2].R.holyCasts.add(1);
			player[2].T.holyCasts = player[2].T.holyCasts.add(1);
		};
		if (hasUpgrade('3', 21)) {
			player[2].G.frenzyCasts = player[2].G.frenzyCasts.add(1);
			player[2].R.frenzyCasts = player[2].R.frenzyCasts.add(1);
			player[2].T.frenzyCasts = player[2].T.frenzyCasts.add(1);
		};
	setClickableState('2', 13, "ON");
};

function canGenPoints() {
	return true;
};

function getPointGen() {
	let gain = newDecimalZero();
	// addtitive
	if (getBuyableAmount('1', 12).gt(0)) gain = gain.add(getBuyableAmount('1', 12) * buyableEffect('1', 12));
	if (getBuyableAmount('1', 13).gt(0) && !hasUpgrade('3', 1143)) gain = gain.add(getBuyableAmount('1', 13) * buyableEffect('1', 13));
	// multiplicative
	if (hasUpgrade('3', 1062)) gain = gain.mul(upgradeEffect('3', 1062));
	if (hasUpgrade('3', 1161)) gain = gain.mul(upgradeEffect('3', 1161));
	if (hasUpgrade('3', 1163)) gain = gain.mul(upgradeEffect('3', 1163));
	if (hasUpgrade('3', 1071)) gain = gain.mul(upgradeEffect('3', 1071));
	if (hasUpgrade('3', 1072)) gain = gain.mul(upgradeEffect('3', 1072));
	if (hasUpgrade('3', 1073)) gain = gain.mul(upgradeEffect('3', 1073));
	if (hasUpgrade('3', 1081)) gain = gain.mul(upgradeEffect('3', 1081));
	gain = gain.mul(tmp[1].effect);
	if (getClickableState('2', 12) == "ON") gain = gain.mul(clickableEffect('2', 12));
	if (hasUpgrade('3', 21) && getClickableState('2', 13) == "ON") gain = gain.mul(clickableEffect('2', 13));
	return gain;
};

const playerStartingStats = {
	best: newDecimalZero(),
	total: newDecimalZero(),
	FCchancebest: new Decimal(2.5),
	FCbest: newDecimalZero(),
	FCtotal: newDecimalZero(),
};

function addedPlayerData() { return {
	best: newDecimalZero(),
	total: newDecimalZero(),
	fairyCoins: newDecimalZero(),
	elfCoins: newDecimalZero(),
	angelCoins: newDecimalZero(),
	goblinCoins: newDecimalZero(),
	undeadCoins: newDecimalZero(),
	demonCoins: newDecimalZero(),
	FCchance: new Decimal(2.5),
	FC: newDecimalZero(),
	bestGems: newDecimalZero(),
	G: Object.create(playerStartingStats),
	R: Object.create(playerStartingStats),
	T: Object.create(playerStartingStats),
}};

const displayThings = [];

const endPoints = new Decimal(Infinity);

function update(diff) {
	player.best = player.best.max(player.points);
	player.total = player.total.add(tmp.pointGen.mul(diff));
};

let backgroundStyle = {};

function maxTickLength() {
	return 3600;
};

function fixOldSave(oldVersion) {
	delete player.blank;
	delete options.colorDisplayMode;
	delete options.colorDisplay;
	delete options.css;
};
