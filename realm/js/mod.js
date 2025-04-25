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
		- You can now click anywhere to gain coins.<br>
		- Creations now have their own layer.<br>
		- Creation tier series are now buyables.<br>
		- Added 6 new creation tiers.<br>
		- Added 1 gem power upgrade.<br>
		- Various balancing changes.<br>
		- Added more stats to the stat menu again.<br>
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
	player.M.mana = player.M.mana.sub(getSpellCost(0).mul(amt));
	player.stats.forEach(obj => obj.casts[0] = obj.casts[0].add(amt));
	const gain = getPointGen().mul(clickableEffect("M", 11).mul(amt));
	player.points = player.points.add(gain);
	player.stats.forEach(obj => obj.total = obj.total.add(gain));
};

function callCast() {
	player.M.spellTimes[1] = new Decimal(30);
	player.M.mana = player.M.mana.sub(getSpellCost(1));
	player.stats.forEach(obj => obj.casts[1] = obj.casts[1].add(1));
	setClickableState("M", 12, true);
};

function sideSpellCast() {
	player.M.spellTimes[2] = new Decimal(15);
	player.M.mana = player.M.mana.sub(getSpellCost(2));
	if (hasUpgrade("F", 11)) {
		player.stats.forEach(obj => obj.casts[2] = obj.casts[2].add(1));
	} else if (hasUpgrade("F", 12)) {
		player.stats.forEach(obj => obj.casts[3] = obj.casts[3].add(1));
	};
	setClickableState("M", 13, true);
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
	if (getClickableState("M", 12)) gain = gain.mul(clickableEffect("M", 12));
	if (hasUpgrade("F", 12) && getClickableState("M", 13)) gain = gain.mul(clickableEffect("M", 13));
	return gain;
};

function getPlayerStartingStats() { return {
	// general
	best: newDecimalZero(),
	total: newDecimalZero(),
	// passive
	bestPassive: newDecimalOne(),
	totalPassive: newDecimalZero(),
	// clicks
	bestClickValue: newDecimalOne(),
	totalClickValue: newDecimalZero(),
	bestClicks: newDecimalZero(),
	totalClicks: newDecimalZero(),
	// faction coins
	FCchance: new Decimal(2.5),
	FCbest: newDecimalZero(),
	FCtotal: newDecimalZero(),
	// creations
	creations: newDecimalZero(),
	// mana
	manaRegen: new Decimal(2.5),
	manaTotal: newDecimalZero(),
	maxMana: new Decimal(100),
	// spells
	casts: [newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero()],
	// alliances
	alliances: [0, 0, 0, 0, 0, 0],
	// time
	allianceTimes: [newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero()],
	sideTimes: [newDecimalZero(), newDecimalZero(), newDecimalZero()],
	time: newDecimalZero(),
}};

function addedPlayerData() { return {
	clickValue: newDecimalOne(),
	FCchance: new Decimal(2.5),
	FC: [newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero()],
	bestGems: newDecimalZero(),
	stats: [getPlayerStartingStats(), getPlayerStartingStats(), getPlayerStartingStats()],
}};

const displayThings = [
	() => { return format(player.clickValue) + "/click" },
];

const endPoints = new Decimal(1e18);

function update(diff) {
	// passive
	const gain = tmp.pointGen.mul(diff);
	player.stats.forEach(obj => obj.best = obj.best.max(player.points));
	player.stats.forEach(obj => obj.total = obj.total.add(gain));
	player.stats.forEach(obj => obj.bestPassive = obj.bestPassive.max(tmp.pointGen));
	player.stats.forEach(obj => obj.totalPassive = obj.totalPassive.add(gain));
	// clicks
	let clickValue = newDecimalOne();
	if (getBuyableAmount("C", 11).gt(0)) clickValue = clickValue.add(getBuyableAmount("C", 11).mul(buyableEffect("C", 11)));
	if (getBuyableAmount("C", 13).gt(0) && hasUpgrade("F", 1143)) clickValue = clickValue.add(getBuyableAmount("C", 13) * buyableEffect("C", 13));
	if (hasUpgrade("F", 1033)) clickValue = clickValue.mul(upgradeEffect("F", 1033));
	if (hasUpgrade("F", 1041)) clickValue = clickValue.mul(upgradeEffect("F", 1041));
	if (hasUpgrade("F", 1043)) clickValue = clickValue.mul(upgradeEffect("F", 1043));
	if (hasUpgrade("F", 1153)) clickValue = clickValue.mul(upgradeEffect("F", 1153));
	clickValue = clickValue.mul(tmp.G.effect);
	if (getClickableState("M", 12)) clickValue = clickValue.mul(clickableEffect("M", 12));
	if (hasUpgrade("F", 11) && getClickableState("M", 13)) clickValue = clickValue.mul(clickableEffect("M", 13));
	player.clickValue = clickValue;
	player.stats.forEach(obj => obj.bestClickValue = obj.bestClickValue.max(player.clickValue));
	// faction coins
	let FCchance = new Decimal(2.5);
	if (getBuyableAmount("C", 13).gt(0)) FCchance = FCchance.add(getBuyableAmount("C", 13).mul(tmp.C.buyables[13].effect2));
	if (hasUpgrade("F", 1033)) FCchance = FCchance.add(upgradeEffect("F", 1033).mul(3));
	if (hasUpgrade("F", 1042)) FCchance = FCchance.add(upgradeEffect("F", 1042));
	if (hasUpgrade("F", 1061)) FCchance = FCchance.add(upgradeEffect("F", 1061));
	if (hasUpgrade("F", 1063)) FCchance = FCchance.add(upgradeEffect("F", 1063));
	if (hasUpgrade("G", 11)) FCchance = FCchance.add(upgradeEffect("G", 11));
	player.FCchance = FCchance;
	player.stats.forEach(obj => obj.FCchance = obj.FCchance.max(player.FCchance));
	player.F.points = player.FC[0].add(player.FC[1]).add(player.FC[2]).add(player.FC[3]).add(player.FC[4]).add(player.FC[5]);
	player.stats.forEach(obj => obj.FCbest = obj.FCbest.max(player.F.points));
	// time
	const alliance = getAllianceIndex();
	if (alliance >= 0) player.stats.forEach(obj => obj.allianceTimes[alliance] = obj.allianceTimes[alliance].add(diff));
	let side = 2;
	if (hasUpgrade("F", 11)) side = 0;
	else if (hasUpgrade("F", 12)) side = 1;
	player.stats.forEach(obj => obj.sideTimes[side] = obj.sideTimes[side].add(diff));
	player.stats.forEach(obj => obj.time = obj.time.add(diff));
};

function maxTickLength() {
	return 15;
};

function fixOldSave(oldVersion) {
	// remove old save data
	localStorage.removeItem("realm-creator-yrahcaz7");
	localStorage.removeItem("realm-creator-yrahcaz7_options");
};

const currentlyText = "<br>Effect: ";
