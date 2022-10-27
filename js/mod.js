let modInfo = {
	name: 'The Primordial Tree',
	id: 'Yrahcaz7-ModTree-ThePrimordialTree',
	author: 'Yrahcaz7',
	pointsName: 'points',
	modFiles: ['layers.js', 'tree.js'],
	initialStartPoints: new Decimal(0),
	offlineLimit: 1, // In hours
};

let VERSION = {
	num: '2.3',
	name: 'Influence of Good',
};

let winText = '<h3>You won the game!</h3><br>However, it isn\'t the end yet...<br>Wait for more updates for further content.';

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
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

function removeachievement(value) {
	for (var i = 0; i < player.A.achievements.length; i++) {
		if (player.A.achievements[i] == value) {
			player.A.achievements.splice(i, 1);
			return true;
		};
	};
	return false;
};

// Determines if it should show points/sec
function canGenPoints(){
	return true;
};

// Calculate points/sec!
function getPointGen(forced = false) {
	let gain = new Decimal(1);
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
	if (inChallenge('r', 11) && !forced) gain = new Decimal(0);
	return gain;
};

function addedPlayerData() { return {
	nerdMode: false,
}};

// Display extra things at the top of the page
var displayThings = [
];

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte('ee16');
};

// Style for the background, can be a function
var backgroundStyle = {
};

function maxTickLength() {
	return 1; // In seconds
};

function fixOldSave(oldVersion) {
	// this is for the achievement that had it's reqirement increased to be impossible to get in 2.2
	if (oldVersion == '2.2' && player.A.achievements.includes('123')) removeachievement('123');

	// this is for the infinite light gain loop.
	// It caps all your resources at around where they would have been before the loop.
	// it will not be exact, and you might have to build up some light or row 5 resources that were reset.
	// it might seem annoying, but if I didn't do this, some people's saves would break.
	endloop = false;
	count = 0;
	while (endloop === false) {
		if (oldVersion == '2.3' && player.r.light.gt(1e40)) {
			if (player.points.gt('1e15000')) player.points = new Decimal('1e15000');
			if (player.e.points.gt('1e15000')) {
				player.e.points = new Decimal('1e15000');
				player.e.best = new Decimal('1e15000');
				player.e.total = new Decimal('1e15000');
			};
			if (player.c.points.gt('1e5000')) {
				player.c.points = new Decimal('1e5000');
				player.c.best = new Decimal('1e5000');
				player.c.total = new Decimal('1e5000');
			};
			if (player.p.points.gt('1e4000')) {
				player.p.points = new Decimal('1e4000');
				player.p.best = new Decimal('1e10000');
				player.p.total = new Decimal('1e10000');
			};
			if (player.p.divinity.gt('1e10000')) player.p.divinity = new Decimal('1e10000');
			if (player.p.holiness.gt('1e10000')) player.p.holiness = new Decimal('1e10000');
			if (player.p.hymn.gt('1e10000')) player.p.hymn = new Decimal('1e10000');
			if (player.q.points.gt('1e3000')) {
				player.q.points = new Decimal('1e3000');
				player.q.best = new Decimal('1e3000');
				player.q.total = new Decimal('1e3000');
			};
			if (player.h.points.gt('1e2000')) {
				player.h.points = new Decimal('1e2000');
				player.h.best = new Decimal('1e2000');
				player.h.total = new Decimal('1e2000');
			};
			if (player.s.points.gt(3000)) {
				player.s.points = new Decimal(3000);
				player.s.best = new Decimal(3000);
				player.s.total = new Decimal(3000);
			};
			if (player.sp.points.gt(1e33)) {
				player.sp.points = new Decimal(1e33);
				player.sp.best = new Decimal(1e33);
				player.sp.total = new Decimal(1e33);
			};
			if (player.ds.points.gt(1e222)) {
				player.ds.points = new Decimal(1e222);
				player.ds.best = new Decimal(1e222);
				player.ds.total = new Decimal(1e222);
			};
			if (player.r.points.gt(36)) {
				player.r.points = new Decimal(36);
				player.r.best = new Decimal(36);
				player.r.total = new Decimal(36);
			};
			if (player.r.light.gt(1e21)) player.r.light = new Decimal(1e21);
			if (player.r.lightgainbest.gt(1e20)) player.r.light = new Decimal(1e20);
			if (challengeCompletions('r', 11) > 25) player['r'].challenges[11] = 25;
			if (player.a.points.gt(1e11)) {
				player.a.points = new Decimal(1e11);
				player.a.best = new Decimal(1e11);
				player.a.total = new Decimal(1e11);
			};
			if (player.gi.points.gt(10)) {
				player.gi.points = new Decimal(10);
				player.gi.best = new Decimal(10);
				if (getBuyableAmount('gi', 11).eq(0)) player.gi.total = new Decimal(10);
				if (getBuyableAmount('gi', 11).eq(1)) player.gi.total = new Decimal(11);
				if (getBuyableAmount('gi', 11).eq(2)) player.gi.total = new Decimal(13);
				if (getBuyableAmount('gi', 11).eq(3)) player.gi.total = new Decimal(16);
				if (getBuyableAmount('gi', 11).eq(4)) player.gi.total = new Decimal(20);
				if (getBuyableAmount('gi', 11).eq(5)) player.gi.total = new Decimal(25);
				if (getBuyableAmount('gi', 11).eq(6)) player.gi.total = new Decimal(31);
				if (getBuyableAmount('gi', 11).eq(7)) player.gi.total = new Decimal(38);
				if (getBuyableAmount('gi', 11).eq(8)) player.gi.total = new Decimal(46);
			};
			if (player.m.points.gt(1e10)) player.m.points = new Decimal(1e10);
			if (player.A.achievements.includes('35')) removeachievement('35');
			if (player.A.achievements.includes('45')) removeachievement('45');
			if (player.A.achievements.includes('65')) removeachievement('65');
			if (player.A.achievements.includes('74')) removeachievement('74');
			if (player.A.achievements.includes('95')) removeachievement('95');
			if (player.A.achievements.includes('105')) removeachievement('105');
			if (player.A.achievements.includes('113')) removeachievement('113');
			if (player.A.achievements.includes('116')) removeachievement('116');
			if (player.A.achievements.includes('123')) removeachievement('123');
			if (player.A.achievements.includes('124')) removeachievement('124');
			if (player.A.achievements.includes('126')) removeachievement('126');
			if (player.A.achievements.includes('133')) removeachievement('133');
		};
		count += 1;
		// double-check values
		(player.points.gt('1e15000')||player.e.points.gt('1e15000')||player.c.points.gt('1e5000')||player.p.points.gt('1e4000')||player.p.divinity.gt('1e10000')||player.p.holiness.gt('1e10000')||player.p.hymn.gt('1e10000')||player.q.points.gt('1e3000')||player.h.points.gt('1e2000')||player.s.points.gt(3000)||player.sp.points.gt(1e33)||player.ds.points.gt(1e222)||player.ds.points.gt(1e222)||player.r.points.gt(36)||player.r.light.gt(1e21)||player.r.lightgainbest.gt(1e20)||challengeCompletions('r', 11)>26||player.a.points.gt(1e11)||player.gi.points.gt(10)||player.m.points.gt(1e10))?
			(count>100?
				endloop=true: // give up after 100 iterations
				endloop=false): // re-set values
			endloop=true; // end loop if all is good
	};
};
