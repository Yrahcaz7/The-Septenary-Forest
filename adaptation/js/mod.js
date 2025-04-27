const modInfo = {
	name: "The Adaptation Tree",
	id: "adaptation-tree-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "power",
	modFiles: ["tree.js", "options.js", "stats.js", "layer/stimulation.js", "layer/growth.js", "layer/evolution.js", "layer/acclimation.js", "layer/species.js", "layer/consciousness.js", "layer/domination.js", "layer/ecosystem.js", "layer/revolution.js", "layer/expansion.js", "layer/war.js", "layer/leader.js", "layer/continent.js", "layer/territory.js", "layer/cycle.js", "layer/empire.js"],
	offlineLimit: 1,
	friendlyErrors: false,
};

const VERSION = {
	num: "3.3",
	name: "The Economy",
};

const changelog = `<h1>Changelog:</h1><br>
	<br><h3>v3.3 - The Economy</h3><br>
		- Added one innovation to revolution.<br>
		- Added sectors.<br>
	<br><h3>v3.2 - Micromanagement</h3><br>
		- Added twenty-five phases to empires.<br>
		- Added thirty-five innovations to revolution.<br>
		- Added factions and cyclical cores.<br>
	<br><h3>v3.1 - The Imperial Age</h3><br>
		- Added the empire layer.<br>
		- Added ten phases to empires.<br>
		- Added twenty innovations to revolution.<br>
		- Added aspects, the fourth cycle, and the cyclical cycles.<br>
	<br><h3>v3.0 - The Cycle Begins</h3><br>
		- Added the cycle layer.<br>
		- Added twenty innovations to revolution.<br>
		- Added five enhancements to domination.<br>
		- Added the first, second, and third cycles.<br>
	<br><h3>v2.6 - The Start of Subjugation</h3><br>
		- Added the territory layer.<br>
		- Added ten innovations to revolution.<br>
		- Added ten enhancements to domination.<br>
	<br><h3>v2.5 - The Rise of Exploration</h3><br>
		- Added the continent layer.<br>
		- Added ten innovations to revolution.<br>
		- Added five enhancements to domination.<br>
	<br><h3>v2.4 - The Era of Leaders</h3><br>
		- Added the leader layer.<br>
		- Added five innovations to revolution.<br>
		- Added five enhancements to domination.<br>
	<br><h3>v2.3 - Declaration of War</h3><br>
		- Added the war layer.<br>
		- Added five innovations to revolution.<br>
		- Added ten enhancements to domination.<br>
	<br><h3>v2.2 - Expansionism</h3><br>
		- Added the expansion layer.<br>
		- Added five innovations to revolution.<br>
		- Added ten enhancements to domination.<br>
	<br><h3>v2.1 - The Age of Revolution</h3><br>
		- Added the revolution layer.<br>
		- Added five innovations to revolution.<br>
		- Added five enhancements to domination.<br>
	<br><h3>v2.0 - Successive Ecosystems</h3><br>
		- Added the ecosystem layer.<br>
		- Added ten enhancements to domination.<br>
		- Added five enhancements to acclimation.<br>
		- Added ANACHRONISM.<br>
	<br><h3>v1.6 - Rise to Dominance</h3><br>
		- Added the domination layer.<br>
		- Added five hybridizations.<br>
		- Added five enhancements to domination.<br>
		- Added fifteen enhancements to acclimation.<br>
	<br><h3>v1.5 - Emerging Consciousness</h3><br>
		- Added the consciousness layer.<br>
		- Added five hybridizations.<br>
		- Added fifteen enhancements to acclimation.<br>
	<br><h3>v1.4 - Speciation</h3><br>
		- Added the species layer.<br>
		- Added thirty enhancements to acclimation.<br>
		- Added five retrogressions.<br>
		- Added ten enhancements to growth.<br>
	<br><h3>v1.3 - Time to Acclimate</h3><br>
		- Added the acclimation layer.<br>
		- Added ten enhancements to acclimation.<br>
		- Added twenty-five enhancements to growth.<br>
	<br><h3>v1.2 - Evolution Begins</h3><br>
		- Added the evolution layer.<br>
		- Added five retrogressions.<br>
		- Added twenty-five enhancements.<br>
		- Added ten upgrades.<br>
	<br><h3>v1.1 - Growing Power</h3><br>
		- Added the growth layer.<br>
		- Added fifteen enhancements.<br>
		- Added fifteen upgrades.<br>
	<br><h3>v1.0 - Stimulations</h3><br>
		- Added the stimulation layer.<br>
		- Added fifteen upgrades.<div>
<br>`;

const winText = "You reached 1e21,000,000 influence and won the game!<br>However, it isn't the end yet...<br>Wait for more updates for further content.";

const canGenPoints = false;

function getPointPotential() {
	// retrogression overrides
	if (inChallenge("e", 15)) return new Decimal(1e10).pow(player.g.milestones.length - 16).max(1);
	if (inChallenge("e", 14)) return newDecimalOne();
	// start
	let gain = newDecimalOne();
	// increase base power gain
	if (hasUpgrade("s", 11)) gain = gain.add(upgradeEffect("s", 11));
	if (hasUpgrade("s", 12)) gain = gain.add(upgradeEffect("s", 12));
	if (hasUpgrade("s", 13)) gain = gain.add(upgradeEffect("s", 13));
	if (hasUpgrade("s", 14)) gain = gain.add(upgradeEffect("s", 14));
	if (hasUpgrade("s", 15)) gain = gain.add(upgradeEffect("s", 15));
	// multiply power gain
	if (hasUpgrade("s", 31)) gain = gain.mul(upgradeEffect("s", 31));
	if (hasUpgrade("s", 32)) gain = gain.mul(upgradeEffect("s", 32));
	if (hasUpgrade("s", 33)) gain = gain.mul(upgradeEffect("s", 33));
	if (hasUpgrade("s", 34)) gain = gain.mul(upgradeEffect("s", 34));
	if (hasUpgrade("s", 35)) gain = gain.mul(upgradeEffect("s", 35));
	if (hasUpgrade("s", 42)) gain = gain.mul(upgradeEffect("s", 42));
	if (hasUpgrade("s", 44)) gain = gain.mul(upgradeEffect("s", 44));
	if (hasUpgrade("s", 45)) gain = gain.mul(upgradeEffect("s", 45));
	if (hasUpgrade("s", 65)) gain = gain.mul(upgradeEffect("s", 65));
	if (hasUpgrade("s", 81)) gain = gain.mul(upgradeEffect("s", 81));
	if (player.g.unlocked) gain = gain.mul(buyableEffect("g", 11));
	if (hasChallenge("e", 21) && challengeEffect("e", 21)[3]) gain = gain.mul(challengeEffect("e", 21)[3]);
	if (player.s.unlocked) gain = gain.mul(tmp.s.effect);
	if (tmp.l.effect[0]) gain = gain.mul(tmp.l.effect[0]);
	// exponentiate power gain
	if (hasChallenge("e", 19)) gain = gain.pow(1.02);
	// special effects
	if (player.d.unlocked) gain = gain.mul(tmp.d.effect);
	if (inChallenge("co", 11)) gain = gain.log10().add(1);
	// return
	return gain;
};

function getPoints() {
	return getPointPotential().mul(1 - 1 / ((10 / 9) ** player.adaptationTime));
};

function getStatBulk() {
	let bulk = 1;
	if (hasMilestone("d", 52)) bulk *= 10;
	if (hasMilestone("d", 55)) bulk *= 10;
	if (hasMilestone("r", 96)) bulk *= 10;
	if (hasMilestone("r", 101)) bulk *= 10;
	if (player.r.points.gte(9)) bulk *= 10;
	if (player.ex.points.gte(6)) bulk *= 10;
	if (player.ex.points.gte(9)) bulk *= 10;
	if (player.w.points.gte(6)) bulk *= 10;
	if (player.l.points.gte(4)) bulk *= 10;
	if (player.t.unlocked) bulk *= 10;
	if (player.cy.unlocks[0] >= 7) bulk *= 10;
	return bulk;
};

function addedPlayerData() { return {
	adaptationTime: 0,
}};

const displayThings = [
	() => {
		if (tmp.other.oompsMag != 0 && options.showOOMs) return "(" + format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : (tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "")) + "s/sec)";
		return "(" + format(getPointPotential()) + " max power)";
	},
	() => "<br>current endgame is at 1e21,000,000 " + (player.ex.unlocked ? "influence" : "???"),
];

function isEndgame() {
	return player.ex.influence.gte("1e21000000");
};

function update(diff) {
	player.adaptationTime += diff;
};

function onReset(resettingLayer) {
	player.adaptationTime = 0;
};

function maxTickLength() {
	return 1;
};

function fixOldSave(oldVersion) {
	// change vars to decimals
	for (const key in layers.ex.buyables) {
		if (key < 20) player.ex.extra[key - 11] = new Decimal(player.ex.extra[key - 11] || 0);
	};
	for (let row = 1; row <= layers.t.grid.maxRows; row++) {
		for (let col = 1; col <= layers.t.grid.cols; col++) {
			player.t.extra[row * 100 + col] = new Decimal(player.t.extra[row * 100 + col] || 0);
		};
	};
	for (let index = 0; index < player.cy.generators.length; index++) {
		player.cy.generators[index] = new Decimal(player.cy.generators[index] || 0);
	};
	// add missing vars
	for (let index = 0; index < cycleUnlocks.length; index++) {
		if (!player.cy.unlocks[index]) player.cy.unlocks[index] = 0;
	};
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
