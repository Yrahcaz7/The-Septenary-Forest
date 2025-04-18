const modInfo = {
	name: "Realm Creator",
	author: "Yrahcaz7",
	pointsName: "coins",
	modFiles: ["tree.js", "options.js", "layers.js"],
	initialStartPoints: newDecimalZero(),
	offlineLimit: 1,
	useNewSaveSyntax: true,
};

const VERSION = {
	num: "0.5",
	name: "In Development",
};

const changelog = `<h1>Changelog:</h1><br>
	<br><h3>v0.5 - In Development</h3><br>
		- Massive internal rework.<br>
		- Creations now have their own layer.<br>
		- Creation tier series are now buyables.<br>
		- Added 3 new creation tiers.<br>
		- Various balancing changes.<br>
		- ALL OLD SAVE DATA IS REMOVED.<br>
	<br><h3>v0.4 - Super Beta</h3><br>
		- Added 2 new creation tiers.<br>
		- Added 3 gem power upgrades.<br>
		- Added 4 mana upgrades.<br>
		- Added 3 autocating upgrades.<br>
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

function winText() {
	return "You reached " + format(endPoints) + " " + modInfo.pointsName + " and won the game!<br>However, it isn't the end yet...<br>Wait for more updates for further content.";
};

function getRandInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

function taxCast(amt = newDecimalOne()) {
	player.M.mana = player.M.mana.sub(player.M.taxCost.mul(amt));
	player.M.stats.forEach(obj => obj.taxCasts = obj.taxCasts.add(amt));
	const gain = getPointGen().mul(player.M.taxEff.mul(amt));
	player.points = player.points.add(gain);
	player.stats.forEach(obj => obj.total = obj.total.add(gain));
};

function callCast() {
	player.M.callTime = new Decimal(30);
	player.M.mana = player.M.mana.sub(player.M.callCost);
	player.M.stats.forEach(obj => obj.callCasts = obj.callCasts.add(1));
	setClickableState("M", 12, "ON");
};

function sideSpellCast() {
	player.M.sideSpellTime = new Decimal(15);
	player.M.mana = player.M.mana.sub(player.M.sideSpellCost);
	if (hasUpgrade("F", 11)) {
		player.M.stats.forEach(obj => obj.holyCasts = obj.holyCasts.add(1));
	} else if (hasUpgrade("F", 21)) {
		player.M.stats.forEach(obj => obj.frenzyCasts = obj.frenzyCasts.add(1));
	};
	setClickableState("M", 13, "ON");
};

function getPointGen() {
	let gain = newDecimalZero();
	// addtitive
	if (getBuyableAmount("C", 12).gt(0)) gain = gain.add(getBuyableAmount("C", 12) * buyableEffect("C", 12));
	if (getBuyableAmount("C", 13).gt(0) && !hasUpgrade("F", 1143)) gain = gain.add(getBuyableAmount("C", 13) * buyableEffect("C", 13));
	// multiplicative
	if (hasUpgrade("F", 1062)) gain = gain.mul(upgradeEffect("F", 1062));
	if (hasUpgrade("F", 1161)) gain = gain.mul(upgradeEffect("F", 1161));
	if (hasUpgrade("F", 1163)) gain = gain.mul(upgradeEffect("F", 1163));
	if (hasUpgrade("F", 1071)) gain = gain.mul(upgradeEffect("F", 1071));
	if (hasUpgrade("F", 1072)) gain = gain.mul(upgradeEffect("F", 1072));
	if (hasUpgrade("F", 1073)) gain = gain.mul(upgradeEffect("F", 1073));
	if (hasUpgrade("F", 1081)) gain = gain.mul(upgradeEffect("F", 1081));
	gain = gain.mul(tmp.G.effect);
	if (getClickableState("M", 12) == "ON") gain = gain.mul(clickableEffect("M", 12));
	if (hasUpgrade("F", 21) && getClickableState("M", 13) == "ON") gain = gain.mul(clickableEffect("M", 13));
	return gain;
};

function getPlayerStartingStats() { return {
	best: newDecimalZero(),
	total: newDecimalZero(),
	FCchancebest: new Decimal(2.5),
	FCbest: newDecimalZero(),
	FCtotal: newDecimalZero(),
}};

function addedPlayerData() { return {
	best: newDecimalZero(),
	total: newDecimalZero(),
	FC: [newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero()],
	FCchance: new Decimal(2.5),
	bestGems: newDecimalZero(),
	stats: [getPlayerStartingStats(), getPlayerStartingStats(), getPlayerStartingStats()],
}};

const displayThings = [
	() => {if (tmp.gameEnded) return "You beat the game!<br>For now..."},
];

const endPoints = new Decimal(1e15);

function update(diff) {
	player.stats.forEach(obj => obj.best = obj.best.max(player.points));
	player.stats.forEach(obj => obj.total = obj.total.add(tmp.pointGen.mul(diff)));
};

function maxTickLength() {
	return 15;
};

function fixOldSave(oldVersion) {
	// remove old save data
	localStorage.removeItem("realm-creator-yrahcaz7");
	localStorage.removeItem("realm-creator-yrahcaz7_options");
};
