const modInfo = {
	name: "Realm Creator",
	author: "Yrahcaz7",
	pointsName: "coins",
	modFiles: ["components.js", "tree.js", "options.js", "upgrades.js", "layer/factions.js", "layer/mana.js", "layer/components.js", "layer/gems.js", "layer/reincarnation.js", "layer/info.js", "layer/stats.js"],
	offlineLimit: 1,
};

const VERSION = {
	num: "1.0",
	name: "Actually Playable Version",
};

const changelog = `<h1>Changelog:</h1><br>
	<br><h3>v1.0 - Actually Playable Version</h3><br>
		- Added 4 mana upgrades.<br>
		- Added 3 fairy upgrades.<br>
		- Added 3 undead upgrades.<br>
		- Added 3 demon upgrades.<br>
		- Changed how autocasting works.<br>
		- Improved the stat menu and added more stats.<br>
		- Added an option to toggle colored text.<br>
		- Rebalanced many things.<br>
		- Fixed various bugs.<br>
	<br><h3>v0.5 - Reworked Beta</h3><br>
		- Massive internal rework.<br>
		- You can now click anywhere to gain coins.<br>
		- Components now have their own layer.<br>
		- Creation tier series are now buyables.<br>
		- Added 1 new creation per alignment.<br>
		- Added many new component tiers.<br>
		- Added 1 gem power upgrade.<br>
		- Various balancing changes.<br>
		- Added more stats to the stat menu again.<br>
		- ALL OLD SAVE DATA IS REMOVED.<br>
	<br><h3>v0.4 - Super Beta</h3><br>
		- Added 2 new component tiers.<br>
		- Added 3 gem power upgrades.<br>
		- Added 4 mana upgrades.<br>
		- Added 3 autocating upgrades.<br>
		- Added 6 elf upgrades.<br>
		- Added 6 angel upgrades.<br>
		- Added 3 undead upgrades.<br>
		- Added 3 demon upgrades.<br>
		- Added even more stats to the stat menu.<br>
		- Various fixes.<br>
	<br><h3>v0.3 - Spells Beta</h3><br>
		- Added 5 new component tiers.<br>
		- Added casting, mana, and spells.<br>
		- Added 2 normal spells.<br>
		- Added 2 side spells.<br>
		- Added 2 mana upgrades.<br>
		- Added 3 fairy upgrades.<br>
		- Added 6 goblin upgrades.<br>
		- Added more types of stats to the stat menu.<br>
		- Minor fixes.<br>
	<br><h3>v0.2 - Factions Beta</h3><br>
		- Added 5 new component tiers.<br>
		- Added faction coins.<br>
		- Added choosing a faction.<br>
		- Added a new tab for faction stuff.<br>
		- Fixed various issues with the stats menu.<br>
		- Added faction coin stats to the stat menu.<br>
	<br><h3>v0.1 - Beta Test</h3><br>
		- Added the click button.<br>
		- Added 3 components.<br>
		- Added a stats menu.<br>
<br>`;

function getRandInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The minimum is inclusive and the maximum is exclusive
};

function romanNumeral(num) {
	let text = "";
	if (num >= 100) text += ["C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"][Math.floor(num / 100) % 10 - 1];
	if (num % 100 >= 10) text += ["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"][Math.floor(num / 10) % 10 - 1];
	if (num % 10 >= 1) text += ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][num % 10 - 1];
	return text;
};

function getPointGen() {
	let gain = newDecimalZero();
	// addtitive
	if (getBuyableAmount("C", 12).gt(0)) gain = gain.add(getBuyableAmount("C", 12) * buyableEffect("C", 12));
	if (getBuyableAmount("C", 13).gt(0) && !hasFactionUpgrade(1, 2, 1)) gain = gain.add(getBuyableAmount("C", 13) * buyableEffect("C", 13));
	if (getBuyableAmount("C", 14).gt(0) && hasUpgrade("F", 12)) gain = gain.add(getBuyableAmount("C", 14) * buyableEffect("C", 14));
	// multiplicative
	if (hasFactionUpgrade(0, 1, 3)) gain = gain.mul(factionUpgradeEffect(0, 1));
	if (hasFactionUpgrade(1, 0, 3)) gain = gain.mul(factionUpgradeEffect(1, 0));
	if (hasFactionUpgrade(1, 1, 3)) gain = gain.mul(2);
	if (hasFactionUpgrade(1, 2, 3)) gain = gain.mul(factionUpgradeEffect(1, 2));
	if (hasFactionUpgrade(0, 0, 4)) gain = gain.mul(factionUpgradeEffect(0, 0));
	if (hasFactionUpgrade(0, 1, 4)) gain = gain.mul(factionUpgradeEffect(0, 1));
	if (hasFactionUpgrade(0, 2, 4)) gain = gain.mul(factionUpgradeEffect(0, 2));
	if (hasFactionUpgrade(1, 0, 4)) gain = gain.mul(factionUpgradeEffect(1, 0));
	if (hasFactionUpgrade(1, 2, 4)) gain = gain.mul(2);
	if (hasFactionUpgrade(0, 0, 5)) gain = gain.mul(factionUpgradeEffect(0, 0));
	gain = gain.mul(tmp.G.effect);
	if (player.M.spellTimes[1].gt(0)) gain = gain.mul(clickableEffect("M", 12));
	if (hasUpgrade("F", 12) && player.M.spellTimes[2].gt(0)) gain = gain.mul(clickableEffect("M", 13));
	return gain;
};

const displayThings = [
	() => format(player.clickValue) + "/click",
];

const endPoints = new Decimal(1e16);

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
	FCchance: new Decimal(5),
	FCbest: newDecimalZero(),
	FCtotal: newDecimalZero(),
	// components
	components: newDecimalZero(),
	// mana
	manaRegen: new Decimal(2.5),
	manaTotal: newDecimalZero(),
	maxMana: new Decimal(100),
	// spells
	casts: [newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero()],
	spellTimes: [newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero()],
	// alliances
	alliances: [0, 0, 0, 0, 0, 0],
	// time
	allianceTimes: [newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero()],
	sideTimes: [newDecimalZero(), newDecimalZero(), newDecimalZero()],
	time: newDecimalZero(),
}};

function addedPlayerData() { return {
	clickValue: newDecimalOne(),
	FCchance: new Decimal(5),
	FC: [newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero()],
	bestGems: newDecimalZero(),
	totalGems: newDecimalZero(),
	stats: [getPlayerStartingStats(), getPlayerStartingStats(), getPlayerStartingStats()],
}};

function onReset(resettingLayer) {
	player.clickValue = newDecimalOne();
	player.FCchance = new Decimal(5);
	player.FC = [newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero()];
	player.stats[0] = getPlayerStartingStats();
	if (resettingLayer === "R") player.stats[1] = getPlayerStartingStats();
};

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
	if (getBuyableAmount("C", 13).gt(0) && hasFactionUpgrade(1, 2, 1)) clickValue = clickValue.add(getBuyableAmount("C", 13) * buyableEffect("C", 13));
	if (getBuyableAmount("C", 14).gt(0) && hasUpgrade("F", 11)) clickValue = clickValue.add(getBuyableAmount("C", 14) * buyableEffect("C", 14));
	if (hasFactionUpgrade(0, 2, 0)) clickValue = clickValue.mul(factionUpgradeEffect(0, 2));
	if (hasFactionUpgrade(1, 0, 0)) clickValue = clickValue.mul(factionUpgradeEffect(1, 0));
	if (hasFactionUpgrade(0, 0, 1)) clickValue = clickValue.mul(factionUpgradeEffect(0, 0));
	if (hasFactionUpgrade(0, 2, 1)) clickValue = clickValue.mul(factionUpgradeEffect(0, 2));
	if (hasFactionUpgrade(1, 2, 2)) clickValue = clickValue.mul(factionUpgradeEffect(1, 2));
	clickValue = clickValue.mul(tmp.G.effect);
	if (player.M.spellTimes[1].gt(0)) clickValue = clickValue.mul(clickableEffect("M", 12));
	if (hasUpgrade("F", 11) && player.M.spellTimes[2].gt(0)) clickValue = clickValue.mul(clickableEffect("M", 13));
	player.clickValue = clickValue;
	player.stats.forEach(obj => obj.bestClickValue = obj.bestClickValue.max(player.clickValue));
	// faction coins
	let FCchance = new Decimal(5);
	if (getBuyableAmount("C", 13).gt(0)) FCchance = FCchance.add(tmp.C.buyables[13].effect2total);
	if (hasFactionUpgrade(0, 2, 0)) FCchance = FCchance.add(factionUpgradeEffect(0, 2).mul(3));
	if (hasFactionUpgrade(0, 1, 1)) FCchance = FCchance.add(factionUpgradeEffect(0, 1));
	if (hasFactionUpgrade(0, 0, 3)) FCchance = FCchance.add(factionUpgradeEffect(0, 0));
	if (hasUpgrade("G", 11)) FCchance = FCchance.add(upgradeEffect("G", 11));
	if (hasFactionUpgrade(0, 2, 3)) FCchance = FCchance.mul(factionUpgradeEffect(0, 2));
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

document.onclick = () => {
	// faction coins calculation
	const FCtype = getRandInt(0, 6);
	let FCfound = player.FCchance.div(100);
	if ((FCfound.toNumber() % 1) > Math.random()) {
		FCfound = FCfound.add(1);
	};
	FCfound = FCfound.floor();
	if (hasFactionUpgrade(0, 2, 2) && FCtype === 2) FCfound = FCfound.mul(5);
	if (hasFactionUpgrade(1, 1, 3) && FCtype === 3) FCfound = FCfound.mul(2);
	if (hasFactionUpgrade(1, 2, 4) && FCtype === 4) FCfound = FCfound.mul(2);
	// faction coins gained
	player.FC[FCtype] = player.FC[FCtype].add(FCfound);
	player.stats.forEach(obj => obj.FCtotal = obj.FCtotal.add(FCfound));
	// times clicked
	player.stats.forEach(obj => obj.totalClicks = obj.totalClicks.add(1));
	player.stats.forEach(obj => obj.bestClicks = obj.bestClicks.max(player.stats[0].totalClicks));
	// coins gained
	player.points = player.points.add(player.clickValue);
	player.stats.forEach(obj => obj.total = obj.total.add(player.clickValue));
	player.stats.forEach(obj => obj.totalClickValue = obj.totalClickValue.add(player.clickValue));
};
