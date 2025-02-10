const modInfo = {
	name: 'The Primordial Tree',
	id: 'Yrahcaz7-ModTree-ThePrimordialTree',
	author: 'Yrahcaz7',
	pointsName: 'points',
	modFiles: ['tree.js', 'options.js', 'assimilation.js', 'achievements.js', 'softcaps.js', 'story.js', 'tabs.js', 'layers.js'],
	initialStartPoints: newDecimalZero(),
	offlineLimit: 1, // in hours
};

const VERSION = {
	num: '3.6',
	beta: '1',
	name: 'UNIFICATION',
};

const changelog = `<h1>Changelog:</h1><br>
	<br><h3>v3.6 Beta: UNIFICATION</h3><br>
		- Removed one option.<br>
		- Added two options.<br>
		- Improved option style.<br>
	<br><h3>v3.5: More Assimilation</h3><br>
		- Added more to assimilation.<br>
		- Added more to stories.<br>
		- Added six milestones to chaos.<br>
		- Added two achievements.<br>
		- Added six achievement images.<br>
		- Improved story infobox style.<br>
	<br><h3>v3.4: Organisms Emerge</h3><br>
		- Added multicellular organisms.<br>
		- Added assimilation.<br>
		- Added more to stories.<br>
		- Added ten milestones to chaos.<br>
		- Added three achievements.<br>
	<br><h3>v3.3: Chaos Rises</h3><br>
		- Added chaos.<br>
		- Added seven milestones to chaos.<br>
		- Added two challenges to chaos.<br>
		- Added stories.<br>
		- Added seven achievements.<br>
		- Added six achievement images.<br>
		- Added one option.<br>
	<br><h3>v3.2: Back and Forth</h3><br>
		- Added protein.<br>
		- Added nine rebuyables to cellular life.<br>
		- Added five milestones to war.<br>
		- Added two achievements.<br>
		- Added six achievement images.<br>
		- MAJOR REBALANCING!<br>
	<br><h3>v3.1: Finally, Life</h3><br>
		- Added cellular life.<br>
		- Added thirteen milestones to cellular life.<br>
		- Added four rebuyables to cellular life.<br>
		- Added six milestones to war.<br>
		- Added five achievements.<br>
		- Added six achievement images.<br>
	<br><h3>v3.0: War, War, and more War</h3><br>
		- Added war.<br>
		- Added ten milestones to war.<br>
		- Added four rebuyables to war.<br>
		- Added one challenge to evil influence.<br>
		- Added eight achievements.<br>
		- Renamed buyables to rebuyables.<br>
		- Lots of technical changes and fixes.<br>
	<br><h3>v2.4: Power of Evil</h3><br>
		- Added evil influence.<br>
		- Added five milestones to evil influence.<br>
		- Added thirty upgrades to evil influence.<br>
		- Added three challenges to evil influence.<br>
		- Added one milestone to good influence.<br>
		- Added three achievements.<br>
		- Added three achievement images.<br>
	<br><h3>v2.3: Influence of Good</h3><br>
		- Added good influence.<br>
		- Added seventeen milestones to good influence.<br>
		- Added two rebuyables to good influence.<br>
		- Added four milestones to molecules.<br>
		- Added three upgrades to molecules.<br>
		- Added three upgrades to relics.<br>
		- Added eight achievements.<br>
		- Added five achievement images.<br>
	<br><h3>v2.2: Advances in Science</h3><br>
		- Added molecules.<br>
		- Added seventeen milestones to molecules.<br>
		- Added twelve upgrades to molecules.<br>
		- Added three milestones to sanctums.<br>
		- Added achievement colors.<br>
		- Added eight achievements.<br>
		- Added five achievement images.<br>
		- Added another option.<br>
		- Lots of technical changes and fixes.<br>
	<br><h3>v2.1: Relics of Light</h3><br>
		- Added relics.<br>
		- Added one custom challenge to relics.<br>
		- Added so, so many milestones to sanctums.<br>
		- Added three custom rebuyables to sanctums.<br>
		- Added two milestones to atoms.<br>
		- Added four achievements.<br>
		- Added eight achievement images.<br>
		- Added nerd mode.<br>
	<br><h3>v2.0: Sanctums of Color</h3><br>
		- Added sanctums.<br>
		- Added ten milestones to sanctums.<br>
		- Added four upgrades to prayers.<br>
		- Added six researchable upgrades to prayers.<br>
		- Added four achievements.<br>
		- Added custom colored text. Vibing!<br>
		- Added two options.<br>
	<br><h3>v1.5: Creativity Rules</h3><br>
		- Added one milestone to atoms.<br>
		- Added six upgrades to prayers.<br>
		- Added two achievements.<br>
		- Added twenty-seven achievement images.<br>
		- Changed 'best' and 'total' format.<br>
		- Finally fixed the rebuyable format bug.<br>
	<br><h3>v1.4: Praise the Sky</h3><br>
		- Added prayers.<br>
		- Added three milestones to prayers.<br>
		- Added twelve upgrades to prayers.<br>
		- Added one milestone to atoms.<br>
		- Added four achievements.<br>
	<br><h3>v1.3: Atomic Measure</h3><br>
		- Added atoms.<br>
		- Added twelve milestones to atoms.<br>
		- Added fourteen upgrades to atoms.<br>
		- Added one challenge to demon souls.<br>
		- Added six achievements.<br>
	<br><h3>v1.2: Demon Gateway</h3><br>
		- Added demonic gateway.<br>
		- Added two milestones to demon souls.<br>
		- Added one upgrade to demon souls.<br>
		- Added three challenges to demon souls.<br>
		- Added twelve achievements.<br>
		- Reformatted all tabs.<br>
	<br><h3>v1.1: Demonic Faith</h3><br>
		- Added demon souls.<br>
		- Added seven milestones to demon souls.<br>
		- Added two upgrades to demon souls.<br>
		- Added one rebuyable to demon souls.<br>
		- Added four upgrades to hexes.<br>
		- Added seven achievements.<br>
		- Renamed most achievements.<br>
		- Achievements now boost point gain.<br>
	<br><h3>v1.0: Variety Rules</h3><br>
		- Added one milestone to hexes.<br>
		- Added eight upgrades to hexes.<br>
		- Added one milestone to subatomic particles.<br>
		- Added three upgrades to subatomic particles.<br>
		- Added one milestone to cores.<br>
		- Added six upgrades to cores.<br>
		- Added three achievements.<br>
	<br><h3>v0.7: The Hex Game</h3><br>
		- Added hexes.<br>
		- Added eight milestones to hexes.<br>
		- Added twelve upgrades to hexes.<br>
		- Added one achievement.<br>
	<br><h3>v0.6: Subatomic Layer</h3><br>
		- Added subatomic particles.<br>
		- Added five milestones to subatomic particles.<br>
		- Added three rebuyables to subatomic particles.<br>
		- Added five upgrades to quarks.<br>
		- Added two achievements.<br>
	<br><h3>v0.5: How Many Miles</h3><br>
		- Added three milestones to cores.<br>
		- Added three milestones to quarks.<br>
		- Added eight achievements.<br>
	<br><h3>v0.4: To Infinity</h3><br>
		- Added five more upgrades to essence.<br>
		- Added another rebuyable to essence.<br>
		- Added twelve more upgrades to quarks.<br>
	<br><h3>v0.3: Quark Addition</h3><br>
		- Added quarks.<br>
		- Added three upgrades to cores.<br>
		- Added three upgrades to quarks.<br>
	<br><h3>v0.2: Core Update</h3><br>
		- Added cores.<br>
		- Added two rebuyables to cores.<br>
	<br><h3>v0.1: Game Launch</h3><br>
		- Game Launch.<br>
		- Added six upgrades.<br>
		- Added a rebuyable.<br>
<br>`;

const winText = () => {
	return 'You reached ' + format(endPoints) + ' ' + modInfo.pointsName + ' and won the game!<br>However, it isn\'t the end yet...<br>Wait for more updates for further content.';
};

let doNotCallTheseFunctionsEveryTick = [];

// gets the end of a color tag (no color, dark, or light)
function getdark(darkthis, type, special = false, research = false) {
	if (darkthis.layer !== undefined) {
		if (colorValue[1] == 'dark') return '-dark">';
		if (colorValue[1] == 'none') return '-OFF">';
		if (((type == 'title' || type == 'title-hasend') && colorValue[0][1]) || (type == 'ref' && colorValue[0][2])) {
			if (research) return '">';
			else {
				if (special) darkcanafford = darkthis.canAfford();
				else darkcanafford = player[darkthis.layer].points.gte(darkthis.cost);
				if ((darkcanafford && !hasUpgrade(darkthis.layer, darkthis.id)) || (type == 'title-hasend' && hasUpgrade(darkthis.layer, darkthis.id))) return '-dark">';
			};
		} else if (type == 'title-light' && colorValue[0][1]) {
			if (special) darkcanafford = darkthis.canAfford();
			else darkcanafford = player[darkthis.layer].points.gte(darkthis.cost);
			if (darkcanafford && !hasUpgrade(darkthis.layer, darkthis.id)) return '-dark">';
			return '-light">';
		} else if (type == 'title-buyable' && colorValue[0][1]) {
			if (darkthis.canAfford() && getBuyableAmount(darkthis.layer, darkthis.id)) return '-dark">';
		} else if (type == 'clickable' && colorValue[0][1]) {
			if (darkthis.canClick()) return '-dark">';
		} else {
			return '-OFF">';
		};
	};
	return '">';
};

// gets the devotion bulk
function getDevotionBulk() {
	let bulk = 1;
	if (challengeCompletions('r', 11) >= 41) bulk *= 10;
	if (hasMilestone('gi', 17)) bulk *= 2;
	if (hasChallenge('ei', 12)) bulk *= 5;
	if (hasMilestone('w', 2)) bulk *= 2;
	if (hasMilestone('w', 15)) bulk *= 5;
	if (hasMilestone('cl', 1) && player.s.no_speed_but_more_bulk) bulk *= 100;
	if (hasMilestone('cl', 2)) bulk *= 2;
	if (hasMilestone('ch', 9)) bulk *= 5;
	if (hasMilestone('ch', 10)) bulk *= 2;
	if (isAssimilated('s') || player.mo.assimilating === 's') bulk *= 10;
	return bulk;
};

// gets the light boost
function getLightBoost() {
	let lightboost = newDecimalZero();
	if (hasMilestone('m', 17)) lightboost = player.r.lightgainbest.mul(0.1);
	else if (hasMilestone('m', 16)) lightboost = player.r.lightgainbest.mul(0.05);
	else if (hasMilestone('m', 15)) lightboost = player.r.lightgainbest.mul(0.025);
	else if (hasMilestone('m', 7)) lightboost = player.r.lightgainbest.mul(0.01);
	else if (hasMilestone('m', 3)) lightboost = player.r.lightgainbest.mul(0.001);
	return lightboost;
};

// gets the light gain
function getLightGain() {
	let gain = getPointGen().pow(0.001).div(10);
	if (hasUpgrade('r', 13)) {
		gain = upgradeEffect('r', 13);
	} else {
		if (hasUpgrade('r', 11)) gain = gain.mul(upgradeEffect('r', 11));
		if (hasUpgrade('r', 12)) gain = gain.mul(upgradeEffect('r', 12));
		if (hasBuyable('d', 21)) gain = gain.mul(buyableEffect('d', 21)[1]);
		if (hasMilestone('s', 30)) gain = gain.mul(2);
		if (hasMilestone('s', 41)) gain = gain.mul(3);
		if (hasMilestone('s', 50)) gain = gain.mul(3);
		if (hasMilestone('s', 52)) gain = gain.mul(3);
		if (gain.gt(1e25)) gain = new Decimal(1e25);
	};
	if (player.s.glow_effect.gt(1)) gain = gain.mul(player.s.glow_effect);
	if (hasBuyable('g', 21)) gain = gain.mul(buyableEffect('g', 21)[2]);
	if (new Decimal(tmp.w.effect[2]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[2]);
	gain = gain.add(getLightBoost());
	return gain;
};

// determines if points can be generated
function canGenPoints() {
	if (inChallenge('r', 11)) return false;
	return true;
};

// calculates points/sec
function getPointGen() {
	// init
	let gain = newDecimalOne();
	// mul
	if (hasUpgrade('e', 11)) gain = gain.mul(1.5);
	if (hasUpgrade('e', 12)) {
		gain = gain.mul(upgradeEffect('e', 12));
		if (hasUpgrade('e', 33)) gain = gain.mul(upgradeEffect('e', 33));
	};
	if (hasUpgrade('e', 21)) {
		gain = gain.mul(upgradeEffect('e', 21));
		if (hasUpgrade('e', 23)) {
			gain = gain.mul(upgradeEffect('e', 23));
			if (hasUpgrade('e', 31)) gain = gain.mul(upgradeEffect('e', 31));
	}};
	if (hasUpgrade('e', 32)) gain = gain.mul(upgradeEffect('e', 32));
	if (hasUpgrade('q', 12)) {
		gain = gain.mul(upgradeEffect('q', 12));
		if (hasUpgrade('q', 13)) gain = gain.mul(upgradeEffect('q', 13));
	};
	if (hasUpgrade('q', 34)) {
		gain = gain.mul(upgradeEffect('q', 34));
		if (hasUpgrade('q', 35)) {
			gain = gain.mul(upgradeEffect('q', 35));
			if (hasUpgrade('q', 41)) gain = gain.mul(upgradeEffect('q', 41));
	}};
	if (hasUpgrade('q', 55)) gain = gain.mul(upgradeEffect('q', 55));
	if (hasUpgrade('h', 11)) {
		gain = gain.mul(upgradeEffect('h', 11));
		if (hasUpgrade('h', 21)) {
			gain = gain.mul(upgradeEffect('h', 21));
			if (hasUpgrade('h', 31)) {
				gain = gain.mul(upgradeEffect('h', 31));
				if (hasUpgrade('h', 41)) gain = gain.mul(upgradeEffect('h', 41));
	}}};
	if (hasUpgrade('h', 73)) gain = gain.mul(upgradeEffect('h', 73));
	if (hasUpgrade('p', 72)) gain = gain.mul(upgradeEffect('p', 72));
	if (hasUpgrade('m', 52)) gain = gain.mul(upgradeEffect('m', 52));
	if (hasBuyable('c', 11)) gain = gain.mul(buyableEffect('c', 11));
	if (hasBuyable('sp', 21)) gain = gain.mul(buyableEffect('sp', 21)[0]);
	if (hasBuyable('sp', 12)) gain = gain.mul(buyableEffect('sp', 12)[1]);
	if (player.p.unlocked && !tmp.p.deactivated) gain = gain.mul(player.p.divinity.add(1).pow(0.1));
	if (hasUpgrade('p', 82)) gain = gain.mul(upgradeEffect('p', 82));
	if (challengeCompletions('r', 11) >= 2) gain = gain.mul(tmp.r.effect[2]);
	if (hasUpgrade('ds', 21) && hasUpgrade('ds', 24)) gain = gain.mul(player.A.points.mul(0.2));
	else gain = gain.mul(player.A.points.mul(0.1).add(1));
	if (inChallenge('ds', 11)) gain = gain.mul(0.0001);
	if (inChallenge('ds', 12)) gain = gain.mul(0.000001);
	if (inChallenge('ds', 21)) gain = gain.mul(0.0000000001);
	if (inChallenge('ds', 22)) gain = gain.mul(0.0000000001);
	if (new Decimal(tmp.w.effect[0]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[0]);
	// pow
	if (hasUpgrade('q', 63)) gain = gain.pow(upgradeEffect('q', 63));
	if (challengeCompletions('ch', 11) > 0) gain = gain.pow(challengeEffect('ch', 11));
	if (challengeCompletions('ch', 12) > 0) gain = gain.pow(challengeEffect('ch', 12));
	// special nerf
	if (inChallenge('ds', 32)) gain = gain.add(1).log10().add(1).log10();
	// softcap
	if (gain.gt(softcaps.points[0])) {
		let excessGain = gain.div(softcaps.points[0]);
		excessGain = excessGain.pow(softcaps.points[1]());
		gain = excessGain.mul(softcaps.points[0]);
	};
	// return
	return gain;
};

// added player[data]
function addedPlayerData() { return {
	nerdMode: false,
}};

// display extra things at the top of the page
const displayThings = [
	() => {if (tmp.gameEnded) return 'You beat the game!<br>For now...'},
];

// determines when the game "ends"
const endPoints = new Decimal('e6e17');

// style for the background, can be a function
const backgroundStyle = {};

// max tick length in seconds
function maxTickLength() {
	return 1;
};

// runs after things are loaded
function onLoad() {
	calculateColorValue();
};

// removes an achievment
function removeAchievement(id = NaN) {
	for (var i = 0; i < player.A.achievements.length; i++) {
		if (player.A.achievements[i] == id) {
			player.A.achievements.splice(i, 1);
			return true;
		};
	};
	return false;
};

// fixes for old saves
function fixOldSave(oldVersion) {
	// achievement fixes
	if (oldVersion == '2.2' && player.A.achievements.includes('123')) removeAchievement('123');
	if (oldVersion == '3.2' && player.A.achievements.includes('163')) removeAchievement('163');
	// endgame fixes
	if ((oldVersion == '3.4' || oldVersion == '3.4.1') && (player.points.gte('e1.51e14') || player.ch.points.gt(50))) {
		setTimeout(() => {
			doReset('ch', true);
			if (player.ch.points.gt(50) || player.ch.best.gt(50) || player.ch.total.gt(50)) {
				player.ch.points = new Decimal(50);
				player.ch.best = new Decimal(50);
				player.ch.total = new Decimal(50);
			};
		});
	};
	// remove unused vars
	delete player.ghost0;
	delete player.r.sanctummult;
	delete player.r.essencemult;
	delete options.css;
	// rename vars
	if (options.tooltipForcing !== undefined) {
		options.forceTooltips = options.tooltipForcing;
		delete options.tooltipForcing;
	};
};

// gets random valid character
function randomChar() {
	return "&#" + Math.floor((Math.random() * (126 - 33 + 1)) + 33) + ";";
};

// gets random string
function randomStr(length = 1, sameChar = false) {
	if (length > 10000) length = 10000;
	if (length <= 0) return "";
	if (options.disableGlitchText) return "?".repeat(length);
	if (sameChar) return randomChar().repeat(length);
	let result = "";
	for (let index = 0; index < length; index++) {
		result += randomChar();
	};
	return result;
};
