const modInfo = {
	name: 'The Primordial Tree',
	id: 'Yrahcaz7-ModTree-ThePrimordialTree',
	author: 'Yrahcaz7',
	pointsName: 'points',
	modFiles: ['achievements.js', 'softcaps.js', 'story.js', 'layers.js', 'technical/tree.js'],
	initialStartPoints: new Decimal(0),
	offlineLimit: 1, // In hours
};

const VERSION = {
	num: '3.3',
	name: 'Chaos Rises',
};

const winText = () => {
	return 'You reached ' + format(endPoints) + ' ' + modInfo.pointsName + ' and won the game!<br>However, it isn\'t the end yet...<br>Wait for more updates for further content.';
};

// gets the end of a color tag (no color, dark, or light)
function getdark(darkthis, type, special = false, research = false) {
	if (darkthis.layer !== undefined) {
		if (colorvalue[1] == 'dark') return '-dark">';
		if (colorvalue[1] == 'none') return '-OFF">';
		if (((type == 'title' || type == 'title-hasend') && colorvalue[0][1]) || (type == 'ref' && colorvalue[0][2])) {
			if (research) return '">';
			else {
				if (special) darkcanafford = darkthis.canAfford();
				else darkcanafford = player[darkthis.layer].points.gte(darkthis.cost);
				if ((darkcanafford && !hasUpgrade(darkthis.layer, darkthis.id)) || (type == 'title-hasend' && hasUpgrade(darkthis.layer, darkthis.id))) return '-dark">';
			};
		} else if (type == 'title-light' && colorvalue[0][1]) {
			if (special) darkcanafford = darkthis.canAfford();
			else darkcanafford = player[darkthis.layer].points.gte(darkthis.cost);
			if (darkcanafford && !hasUpgrade(darkthis.layer, darkthis.id)) return '-dark">';
			return '-light">';
		} else if (type == 'title-buyable' && colorvalue[0][1]) {
			darkcanafford = darkthis.canAfford();
			if (darkcanafford && getBuyableAmount(darkthis.layer, darkthis.id)) return '-dark">';
		} else return '-OFF">'
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
	return bulk;
};

// gets the light boost
function getLightBoost() {
	let lightboost = new Decimal(0);
	if (hasMilestone('m', 17)) lightboost = player.r.lightgainbest.mul(0.1);
	else if (hasMilestone('m', 16)) lightboost = player.r.lightgainbest.mul(0.05);
	else if (hasMilestone('m', 15)) lightboost = player.r.lightgainbest.mul(0.025);
	else if (hasMilestone('m', 7)) lightboost = player.r.lightgainbest.mul(0.01);
	else if (hasMilestone('m', 3)) lightboost = player.r.lightgainbest.mul(0.001);
	return lightboost;
};

// gets the light gain
function getLightGain() {
	let gain = getPointGen(true).pow(0.001).div(10);
	if (hasUpgrade('r', 13)) {
		gain = upgradeEffect('r', 13);
	} else {
		if (hasUpgrade('r', 11)) gain = gain.mul(upgradeEffect('r', 11));
		if (hasUpgrade('r', 12)) gain = gain.mul(upgradeEffect('r', 12));
		if (getBuyableAmount('d', 21).gt(0)) gain = gain.mul(getBuyableAmount('d', 21));
		if (hasMilestone('s', 30)) gain = gain.mul(2);
		if (hasMilestone('s', 41)) gain = gain.mul(3);
		if (hasMilestone('s', 50)) gain = gain.mul(3);
		if (hasMilestone('s', 52)) gain = gain.mul(3);
		if (gain.gt(1e25)) gain = new Decimal(1e25);
	};
	if (new Decimal(tmp.w.effect[2]).gt(1)) gain = gain.mul(tmp.w.effect[2]);
	gain = gain.add(getLightBoost());
	return gain;
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

// Determines if it should show points/sec
function canGenPoints() {
	return true;
};

// Calculate points/sec!
function getPointGen(forced = false) {
	// init
	let gain = new Decimal(1);
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
	if (hasUpgrade('e', 32) && getBuyableAmount('e', 12).gt(0)) gain = gain.mul(upgradeEffect('e', 32));
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
	if (hasUpgrade('h', 11)) {
		gain = gain.mul(upgradeEffect('h', 11));
		if (hasUpgrade('h', 21)) {
			gain = gain.mul(upgradeEffect('h', 21));
			if (hasUpgrade('h', 31)) {
				gain = gain.mul(upgradeEffect('h', 31));
				if (hasUpgrade('h', 41)) gain = gain.mul(upgradeEffect('h', 41));
	}}};
	if (hasUpgrade('p', 72)) gain = gain.mul(upgradeEffect('p', 72));
	if (hasUpgrade('m', 52)) gain = gain.mul(upgradeEffect('m', 52));
	if (getBuyableAmount('c', 11).gt(0)) gain = gain.mul(getBuyableAmount('c', 11).mul(5).add(1));
	if (getBuyableAmount('sp', 21).gt(0)) {
		gain = gain.mul(new Decimal(5).pow(getBuyableAmount('sp', 21)));
		if (hasUpgrade('sp', 13)) gain = gain.mul(new Decimal(5).pow(getBuyableAmount('sp', 21)));
	};
	if (getBuyableAmount('sp', 12).gt(0)) gain = gain.mul(getBuyableAmount('sp', 12).add(1).pow(-1));
	if (player.p.divinity.gt(0)) gain = gain.mul(player.p.divinity.add(1).pow(0.1));
	if (challengeCompletions('r', 11) >= 2) gain = gain.mul(player.r.essencemult);
	if (hasUpgrade('ds', 21) && hasUpgrade('ds', 24)) gain = gain.mul(player.A.points.mul(0.2));
	else gain = gain.mul(player.A.points.mul(0.1).add(1));
	if (inChallenge('ds', 11)) gain = gain.mul(0.0001);
	if (inChallenge('ds', 12)) gain = gain.mul(0.000001);
	if (inChallenge('ds', 21)) gain = gain.mul(0.0000000001);
	if (inChallenge('ds', 22)) gain = gain.mul(0.0000000001);
	if (new Decimal(tmp.w.effect[0]).gt(1)) gain = gain.mul(tmp.w.effect[0]);
	if (inChallenge('r', 11) && !forced) gain = new Decimal(0);
	// pow
	if (challengeCompletions('ch', 11) > 0) gain = gain.pow(challengeEffect('ch', 11));
	return gain;
};

// added player[data]
function addedPlayerData() { return {
	nerdMode: false,
}};

// Display extra things at the top of the page
const displayThings = [
	() => {if (tmp.gameEnded) return 'You beat the game!<br>For now...'},
];

// Determines when the game "ends"
const endPoints = new Decimal('e215000000');

// Style for the background, can be a function
const backgroundStyle = {};

// max tick length in seconds
function maxTickLength() {
	return 1;
};

// fixes for old saves
function fixOldSave(oldVersion) {
	// achievement fixes
	if (oldVersion == '2.2' && player.A.achievements.includes('123')) removeAchievement('123');
	if (oldVersion == '3.2' && player.A.achievements.includes('163')) removeAchievement('163');
};

// I won't tell you what these are for... hehehe...
const validChars = "!\"#$%&'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";

const randomChar = () => { return validChars[Math.floor(Math.random() * validChars.length)] };
