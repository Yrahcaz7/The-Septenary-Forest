addLayer('A', {
	name: 'Achievements',
	symbol: 'A',
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: '#A5BCC2',
	resource: 'achievements',
	row: 'side',
	layerShown() {return true},
	effectDescription() {
		text = ['<br>which are multiplying your point ', '', '', ''];
		if (hasUpgrade('ds', 21)) {
			if (hasUpgrade('ds', 24)) text[0] += 'and essence gain by <h2 class="layer-A">' + format(player.A.points.mul(0.2)) + '</h2>x';
			else {
				text[0] += 'gain by <h2 class="layer-A">' + format(player.A.points.mul(0.1).add(1)) + '</h2>x';
				text[1] += 'essence gain by <h2 class="layer-A">' + format(player.A.points.mul(0.2)) + '</h2>x';
			};
			if (hasUpgrade('ds', 23) && !hasUpgrade('ds', 24) && !hasUpgrade('p', 31)) text[2] += 'core and quark gain by <h2 class="layer-A">' + format(player.A.points.pow(2).div(100)) + '</h2>x';
			if (hasUpgrade('ds', 23) && hasUpgrade('ds', 24) && !hasUpgrade('p', 31)) text[1] += 'core and quark gain by <h2 class="layer-A">' + format(player.A.points.pow(2).div(100)) + '</h2>x';
			if (hasUpgrade('ds', 23) && hasUpgrade('ds', 24) && hasUpgrade('p', 31)) text[1] += 'core, prayer, and quark gain by <h2 class="layer-A">' + format(player.A.points.pow(2).div(100)) + '</h2>x';
		} else text[0] += 'gain by <h2 class="layer-A">' + format(player.A.points.mul(0.1).add(1)) + '</h2>x';
		if (hasUpgrade('a', 51)) text[3] += 'subatomic particle gain by <h2 class="layer-A">' + format(player.A.points.pow(1.25)) + '</h2>x';
		if (player.nerdMode) {
			if (hasUpgrade('ds', 21)) {
				if (hasUpgrade('ds', 24)) text[0] += ' (formula: x*0.2)';
				else {
					text[0] += ' (formula: x*0.1+1)';
					text[1] += ' (formula: x*0.2)';
				};
				if (hasUpgrade('ds', 23) && !hasUpgrade('ds', 24) && !hasUpgrade('p', 31)) text[2] += ' (formula: (x^2)/100)';
				if (hasUpgrade('ds', 23) && hasUpgrade('ds', 24)) text[1] += ' (formula: (x^2)/100)';
			} else text[0] += ' (formula: x*0.1+1)';
			if (hasUpgrade('a', 51)) text[3] += ' (formula: x^1.25)';
		};
		fintext = text[0];
		if (text[1]) fintext += '<br>and also multiplying ';
		fintext += text[1];
		if (text[2]) fintext += '<br>additionally, also multiplying ';
		fintext += text[2];
		if (text[3]) fintext += '<br>and lastly, also multiplying ';
		fintext += text[3];
		return fintext;
	},
	update(diff) {
		player.A.points = new Decimal(player.A.achievements.length);
	},
	tabFormat: [
		"main-display",
		"achievements",
	],
	achievements: {
		11: {
			name: 'The Point',
			done() {return player.points.gte(1)},
			tooltip: 'obtain 1 point.',
			image() { if (hasAchievement('A', 11)) return "images/achievements/11.png" },
			color: '#DFDFDF',
		},
		12: {
			name: 'Very Pointy',
			done() {return player.points.gte(1e10)},
			tooltip: 'obtain 1e10 points.',
			unlocked() { return hasAchievement('A', 11) },
			image() { if (hasAchievement('A', 12)) return "images/achievements/12.png" },
			color: '#DFDFDF',
		},
		13: {
			name: 'Now That\'s Really Pointy',
			done() {return player.points.gte(1e100)},
			tooltip: 'obtain 1e100 points.',
			unlocked() { return hasAchievement('A', 12) },
			image() { if (hasAchievement('A', 13)) return "images/achievements/13.png" },
			color: '#DFDFDF',
		},
		14: {
			name: 'Cosmic Point',
			done() {return player.points.gte('1e1000')},
			tooltip: 'obtain 1e1000 points.',
			unlocked() { return hasAchievement('A', 13) },
			image() { if (hasAchievement('A', 14)) return "images/achievements/14.png" },
			color: '#DFDFDF',
		},
		15: {
			name: 'Everything is Points',
			done() {return player.points.gte('1e10000')},
			tooltip: 'obtain 1e10,000 points.',
			unlocked() { return hasAchievement('A', 14) },
			image() { if (hasAchievement('A', 15)) return "images/achievements/15.png" },
			color: '#DFDFDF',
		},
		16: {
			name: 'Dull Points',
			done() {return player.points.gte(1e10) && player.e.total.eq(0)},
			tooltip: 'obtain 1e10 points with no essence.',
			unlocked() { return hasAchievement('A', 12) && hasAchievement('A', 21) },
			image() { if (hasAchievement('A', 16)) return "images/achievements/16.png" },
			color: '#DFDFDF',
		},
		21: {
			name: 'Essence of Rat',
			done() {return player.e.points.gte(1)},
			tooltip: 'obtain 1 essence.',
			unlocked() { return hasAchievement('A', 21) },
			image() { if (hasAchievement('A', 21)) return "images/achievements/21.png" },
			color: '#4CED13',
		},
		22: {
			name: 'Essence Cluster',
			done() {return player.e.points.gte(1e10)},
			tooltip: 'obtain 1e10 essence.',
			unlocked() { return hasAchievement('A', 21) },
			image() { if (hasAchievement('A', 22)) return "images/achievements/22.png" },
			color: '#4CED13',
		},
		23: {
			name: 'Gleaming, Golden Essence',
			done() {return player.e.points.gte(1e100)},
			tooltip: 'obtain 1e100 essence.',
			unlocked() { return hasAchievement('A', 22) },
			image() { if (hasAchievement('A', 23)) return "images/achievements/23.png" },
			color: '#4CED13',
		},
		24: {
			name: 'Essence of the Universe',
			done() {return player.e.points.gte('1e1000')},
			tooltip: 'obtain 1e1000 essence.',
			unlocked() { return hasAchievement('A', 23) },
			image() { if (hasAchievement('A', 24)) return "images/achievements/24.png" },
			color: '#4CED13',
		},
		25: {
			name: 'Essence of all Essence',
			done() {return player.e.points.gte('1e10000')},
			tooltip: 'obtain 1e10,000 essence.',
			unlocked() { return hasAchievement('A', 24) },
			image() { if (hasAchievement('A', 25)) return "images/achievements/25.png" },
			color: '#4CED13',
		},
		26: {
			name: 'Empty Soul',
			done() {return player.e.points .gte(1e10) && getBuyableAmount('e', 11).eq(0) && getBuyableAmount('e', 12).eq(0)},
			tooltip: 'obtain 1e10 essence with no essence rebuyables.',
			unlocked() { return hasAchievement('A', 22) && hasAchievement('A', 31) },
			image() { if (hasAchievement('A', 26)) return "images/achievements/26.png" },
			color: '#4CED13',
		},
		31: {
			name: 'Cracked Core',
			done() {return player.c.points.gte(1)},
			tooltip: 'obtain 1 core.',
			unlocked() { return hasAchievement('A', 31) },
			image() { if (hasAchievement('A', 31)) return "images/achievements/31.png" },
			color: '#D2D237',
		},
		32: {
			name: 'Mountainous Core',
			done() {return player.c.points.gte(1e10)},
			tooltip: 'obtain 1e10 cores.',
			unlocked() { return hasAchievement('A', 31) },
			image() { if (hasAchievement('A', 32)) return "images/achievements/32.png" },
			color: '#D2D237',
		},
		33: {
			name: 'Core of the Earth',
			done() {return player.c.points.gte(1e100)},
			tooltip: 'obtain 1e100 cores.',
			unlocked() { return hasAchievement('A', 32) },
			image() { if (hasAchievement('A', 33)) return "images/achievements/33.png" },
			color: '#D2D237',
		},
		34: {
			name: 'Core of the Sun',
			done() {return player.c.points.gte('1e1000')},
			tooltip: 'obtain 1e1000 cores.',
			unlocked() { return hasAchievement('A', 33) },
			image() { if (hasAchievement('A', 34)) return "images/achievements/34.png" },
			color: '#D2D237',
		},
		35: {
			name: 'Core of the Universe',
			done() {return player.c.points.gte('1e10000')},
			tooltip: 'obtain 1e10,000 cores.',
			unlocked() { return hasAchievement('A', 34) },
			image() { if (hasAchievement('A', 34)) return "images/achievements/35.png" },
			color: '#D2D237',
		},
		36: {
			name: 'Pointless Core',
			done() {return player.c.points.gte(1e10) && getBuyableAmount('c', 11).eq(0) && getBuyableAmount('c', 12).eq(0) && player.q.total.eq(0)},
			tooltip: 'obtain 1e10 cores with no core rebuyables and quarks.',
			unlocked() { return hasAchievement('A', 32) && hasAchievement('A', 41) },
			image() { if (hasAchievement('A', 36)) return "images/achievements/36.png" },
			color: '#D2D237',
		},
		41: {
			name: 'The Smallest Quark',
			done() {return player.q.points.gte(1)},
			tooltip: 'obtain 1 quark.',
			unlocked() { return hasAchievement('A', 41) },
			image() { if (hasAchievement('A', 41)) return "images/achievements/41.png" },
			color: '#DB5196',
		},
		42: {
			name: 'Quark Field',
			done() {return player.q.points .gte(1e10)},
			tooltip: 'obtain 1e10 quarks.',
			unlocked() { return hasAchievement('A', 41) },
			image() { if (hasAchievement('A', 42)) return "images/achievements/42.png" },
			color: '#DB5196',
		},
		43: {
			name: 'Oh, the Quark of it all',
			done() {return player.q.points.gte(1e100)},
			tooltip: 'obtain 1e100 quarks.',
			unlocked() { return hasAchievement('A', 42) },
			image() { if (hasAchievement('A', 43)) return "images/achievements/43.png" },
			color: '#DB5196',
		},
		44: {
			name: 'Quirky Quarks',
			done() {return player.q.points.gte('1e1000')},
			tooltip: 'obtain 1e1000 quarks.',
			unlocked() { return hasAchievement('A', 43) },
			image() { if (hasAchievement('A', 44)) return "images/achievements/44.png" },
			color: '#DB5196',
		},
		45: {
			name: 'Impossible Quarks',
			done() {return player.q.points.gte('1e10000')},
			tooltip: 'obtain 1e10,000 quarks.',
			unlocked() { return hasAchievement('A', 44) },
			image() { if (hasAchievement('A', 45)) return "images/achievements/45.png" },
			color: '#DB5196',
		},
		46: {
			name: 'The Outside',
			done() {return player.q.points.gte(1e10) && player.c.total.eq(0)},
			tooltip: 'obtain 1e10 quarks with no cores.',
			unlocked() { return hasAchievement('A', 42) && hasAchievement('A', 51) },
			image() { if (hasAchievement('A', 46)) return "images/achievements/46.png" },
			color: '#DB5196',
		},
		51: {
			name: 'Submarine, Subatomic',
			done() {return player.sp.points.gte(1)},
			tooltip: 'obtain 1 subatomic particle.',
			unlocked() { return hasAchievement('A', 51) },
			image() { if (hasAchievement('A', 51)) return "images/achievements/51.png" },
			color: '#710CC4',
		},
		52: {
			name: 'Variant Particles',
			done() {return player.sp.points.gte(100)},
			tooltip: 'obtain 100 subatomic particles.',
			unlocked() { return hasAchievement('A', 51) },
			image() { if (hasAchievement('A', 52)) return "images/achievements/52.png" },
			color: '#710CC4',
		},
		53: {
			name: 'Periodic Particles',
			done() {return player.sp.points.gte(10000)},
			tooltip: 'obtain 10,000 subatomic particles.',
			unlocked() { return hasAchievement('A', 52) },
			image() { if (hasAchievement('A', 53)) return "images/achievements/53.png" },
			color: '#710CC4',
		},
		54: {
			name: 'That\'s no Particle no More',
			done() {return player.sp.points.gte(1000000)},
			tooltip: 'obtain 1,000,000 subatomic particles.',
			unlocked() { return hasAchievement('A', 53) },
			image() { if (hasAchievement('A', 54)) return "images/achievements/54.png" },
			color: '#710CC4',
		},
		55: {
			name: 'Anti Dark Matter',
			done() {return player.sp.points.gte(1e11)},
			tooltip: 'obtain 1e11 subatomic particles.',
			unlocked() { return hasAchievement('A', 54) },
			image() { if (hasAchievement('A', 55)) return "images/achievements/55.png" },
			color: '#710CC4',
		},
		56: {
			name: 'Hollow Particles',
			done() {return player.sp.points.gte(10) && getBuyableAmount('sp', 11).eq(0) && getBuyableAmount('sp', 12).eq(0) && getBuyableAmount('sp', 21).eq(0) && player.h.total.eq(0)},
			tooltip: 'obtain 10 subatomic particles with no subatomic particle rebuyables and hexes.',
			unlocked() { return hasAchievement('A', 52) && hasAchievement('A', 61) },
			image() { if (hasAchievement('A', 56)) return "images/achievements/56.png" },
			color: '#710CC4',
		},
		61: {
			name: 'The Hex Game',
			done() {return player.h.points.gte(1)},
			tooltip: 'obtain 1 hex.',
			unlocked() { return hasAchievement('A', 61) },
			image() { if (hasAchievement('A', 61)) return "images/achievements/61.png" },
			color: '#E36409',
		},
		62: {
			name: 'Cursed into Oblivion',
			done() {return player.h.points.gte(1e10)},
			tooltip: 'obtain 1e10 hexes.',
			unlocked() { return hasAchievement('A', 61) },
			image() { if (hasAchievement('A', 62)) return "images/achievements/62.png" },
			color: '#E36409',
		},
		63: {
			name: 'The Prophecy of Doom',
			done() {return player.h.points.gte(1e100)},
			tooltip: 'obtain 1e100 hexes.',
			unlocked() { return hasAchievement('A', 62) },
			image() { if (hasAchievement('A', 63)) return "images/achievements/63.png" },
			color: '#E36409',
		},
		64: {
			name: 'The Advent of the End',
			done() {return player.h.points.gte('1e1000')},
			tooltip: 'obtain 1e1000 hexes.',
			unlocked() { return hasAchievement('A', 63) },
			image() { if (hasAchievement('A', 64)) return "images/achievements/64.png" },
			color: '#E36409',
		},
		65: {
			name: 'Nihilism: Nothing is There',
			done() {return player.h.points.gte('1e10000')},
			tooltip: 'obtain 1e10,000 hexes.',
			unlocked() { return hasAchievement('A', 64) },
			image() { if (hasAchievement('A', 65)) return "images/achievements/65.png" },
			color: '#E36409',
		},
		66: {
			name: 'Same Old Tricks',
			done() {return player.h.points.gte(1e10) && getBuyableAmount('c', 11).eq(0) && getBuyableAmount('c', 12).eq(0) && player.sp.total.eq(0)},
			tooltip: 'obtain 1e10 hexes with no subatomic particles and core rebuyables.',
			unlocked() { return hasAchievement('A', 62) && hasAchievement('A', 71) },
			image() { if (hasAchievement('A', 66)) return "images/achievements/66.png" },
			color: '#E36409',
		},
		71: {
			name: 'Demon Spirits',
			done() {return player.ds.points.gte(1)},
			tooltip: 'obtain 1 demon soul.',
			unlocked() { return hasAchievement('A', 71) },
			image() { if (hasAchievement('A', 71)) return "images/achievements/71.png" },
			color: '#BA0035',
		},
		72: {
			name: 'Demonic Ruin',
			done() {return player.ds.points.gte(1e8)},
			tooltip: 'obtain 1e8 demon souls.',
			unlocked() { return hasAchievement('A', 71) },
			image() { if (hasAchievement('A', 72)) return "images/achievements/72.png" },
			color: '#BA0035',
		},
		73: {
			name: 'Demon Summoning',
			done() {return player.ds.points.gte(1e60)},
			tooltip: 'obtain 1e60 demon souls.',
			unlocked() { return hasAchievement('A', 72) },
			image() { if (hasAchievement('A', 73)) return "images/achievements/73.png" },
			color: '#BA0035',
		},
		74: {
			name: 'Demonic Origin',
			done() {return player.ds.points.gte('1e400')},
			tooltip: 'obtain 1e400 demon souls.',
			unlocked() { return hasAchievement('A', 73) },
			image() { if (hasAchievement('A', 74)) return "images/achievements/74.png" },
			color: '#BA0035',
		},
		75: {
			name: 'Demonic Dimension',
			done() {return player.ds.points.gte('1e2000')},
			tooltip: 'obtain 1e2000 demon souls.',
			unlocked() { return hasAchievement('A', 74) },
			image() { if (hasAchievement('A', 75)) return "images/achievements/75.png" },
			color: '#BA0035',
		},
		76: {
			name: 'Occult Uprising',
			done() {return player.ds.points.gte(1e10) && getBuyableAmount('ds', 11).eq(0) && player.a.total.eq(0)},
			tooltip: 'obtain 1e10 demon souls with no demon soul rebuyables and atoms.',
			unlocked() { return hasAchievement('A', 72) && hasAchievement('A', 81) },
			image() { if (hasAchievement('A', 76)) return "images/achievements/76.png" },
			color: '#BA0035',
		},
		81: {
			name: 'Atomic Mass',
			done() {return player.a.points.gte(1)},
			tooltip: 'obtain 1 atom.',
			unlocked() { return hasAchievement('A', 81) },
			image() { if (hasAchievement('A', 81)) return "images/achievements/81.png" },
			color: '#4D2FE0',
		},
		82: {
			name: 'Atomic Movement',
			done() {return player.a.points.gte(10)},
			tooltip: 'obtain 10 atoms.',
			unlocked() { return hasAchievement('A', 81) },
			image() { if (hasAchievement('A', 82)) return "images/achievements/82.png" },
			color: '#4D2FE0',
		},
		83: {
			name: 'Masses of Atoms',
			done() {return player.a.points.gte(1000)},
			tooltip: 'obtain 1,000 atoms.',
			unlocked() { return hasAchievement('A', 82) },
			image() { if (hasAchievement('A', 83)) return "images/achievements/83.png" },
			color: '#4D2FE0',
		},
		84: {
			name: 'Atom Dance',
			done() {return player.a.points.gte(10000)},
			tooltip: 'obtain 10,000 atoms.',
			unlocked() { return hasAchievement('A', 83) },
			image() { if (hasAchievement('A', 84)) return "images/achievements/84.png" },
			color: '#4D2FE0',
		},
		85: {
			name: 'Atomic Hole',
			done() {return player.a.points.gte(1e9)},
			tooltip: 'obtain 1e9 atoms.',
			unlocked() { return hasAchievement('A', 84) },
			image() { if (hasAchievement('A', 85)) return "images/achievements/85.png" },
			color: '#4D2FE0',
		},
		86: {
			name: 'For Science!',
			done() {return player.a.points.gte(10) && player.ds.total.eq(0)},
			tooltip: 'obtain 10 atoms with no demon souls.',
			unlocked() { return hasAchievement('A', 82) && hasAchievement('A', 91) },
			image() { if (hasAchievement('A', 86)) return "images/achievements/86.png" },
			color: '#4D2FE0',
		},
		91: {
			name: 'Praise the Lord',
			done() {return player.p.points.gte(1)},
			tooltip: 'obtain 1 prayer.',
			unlocked() { return hasAchievement('A', 91) },
			image() { if (hasAchievement('A', 91)) return "images/achievements/91.png" },
			color: '#FDBBFF',
		},
		92: {
			name: 'Church Prayer Circle',
			done() {return player.p.points.gte(1e10)},
			tooltip: 'obtain 1e10 prayers.',
			unlocked() { return hasAchievement('A', 91) },
			image() { if (hasAchievement('A', 92)) return "images/achievements/92.png" },
			color: '#FDBBFF',
		},
		93: {
			name: 'Prayers all around',
			done() {return player.p.points.gte(1e100)},
			tooltip: 'obtain 1e100 prayers.',
			unlocked() { return hasAchievement('A', 92) },
			image() { if (hasAchievement('A', 93)) return "images/achievements/93.png" },
			color: '#FDBBFF',
		},
		94: {
			name: 'Global Prayers',
			done() {return player.p.points.gte('1e1000')},
			tooltip: 'obtain 1e1000 prayers.',
			unlocked() { return hasAchievement('A', 93) },
			image() { if (hasAchievement('A', 94)) return "images/achievements/94.png" },
			color: '#FDBBFF',
		},
		95: {
			name: 'Everything is Prayers',
			done() {return player.p.points.gte('1e10000')},
			tooltip: 'obtain 1e10,000 prayers.',
			unlocked() { return hasAchievement('A', 94) },
			image() { if (hasAchievement('A', 95)) return "images/achievements/95.png" },
			color: '#FDBBFF',
		},
		96: {
			name: 'Persistence',
			done() {return player.p.points.gte(1e10) && player.h.total.eq(0) && player.sp.total.eq(0) && player.s.total.eq(0)},
			tooltip: 'obtain 1e10 prayers with no hexes, subatomic particles, and sanctums.',
			unlocked() { return hasAchievement('A', 92) && hasAchievement('A', 101) },
			image() { if (hasAchievement('A', 96)) return "images/achievements/96.png" },
			color: '#FDBBFF',
		},
		101: {
			name: 'Church Sanctum',
			done() {return player.s.points.gte(1)},
			tooltip: 'obtain 1 sanctum.',
			unlocked() { return hasAchievement('A', 101) },
			color: '#AAFF00',
		},
		102: {
			name: 'Shrine Blessings',
			done() {return player.s.points.gte(10)},
			tooltip: 'obtain 10 sanctums.',
			unlocked() { return hasAchievement('A', 101) },
			color: '#AAFF00',
		},
		103: {
			name: 'Greatest Sanctum',
			done() {return player.s.points.gte(100)},
			tooltip: 'obtain 100 sanctums.',
			unlocked() { return hasAchievement('A', 102) },
			color: '#AAFF00',
		},
		104: {
			name: 'The World is Sanctum',
			done() {return player.s.points.gte(1000)},
			tooltip: 'obtain 1,000 sanctums.',
			unlocked() { return hasAchievement('A', 103) },
			color: '#AAFF00',
		},
		105: {
			name: 'Sanctum, Absolute',
			done() {return player.s.points.gte(10000)},
			tooltip: 'obtain 10,000 sanctums.',
			unlocked() { return hasAchievement('A', 104) },
			color: '#AAFF00',
		},
		106: {
			name: 'Still Sanctum',
			done() {return player.s.points.gte(10) && player.ds.total.eq(0) && player.a.total.eq(0)},
			tooltip: 'obtain 10 sanctums with no demon souls and atoms.',
			unlocked() { return hasAchievement('A', 102) && hasAchievement('A', 111) },
			color: '#AAFF00',
		},
		111: {
			name: 'Ancient Relic',
			done() {return player.r.points.gte(1)},
			tooltip: 'obtain 1 relic.',
			unlocked() { return hasAchievement('A', 111) },
			color: '#B9A975',
		},
		112: {
			name: 'Relic Stash',
			done() {return player.r.points.gte(10)},
			tooltip: 'obtain 10 relics.',
			unlocked() { return hasAchievement('A', 111) },
			color: '#B9A975',
		},
		113: {
			name: 'Treasure Hoard',
			done() {return player.r.points.gte(100)},
			tooltip: 'obtain 100 relics.',
			unlocked() { return hasAchievement('A', 112) },
			color: '#B9A975',
		},
		114: {
			name: 'Mountain of Relics',
			done() {return player.r.points.gte(1000)},
			tooltip: 'obtain 1,000 relics.',
			unlocked() { return hasAchievement('A', 113) },
			color: '#B9A975',
		},
		116: {
			name: 'Broken Relics',
			done() {return player.r.points.gte(10) && player.m.total.eq(0)},
			tooltip: 'obtain 10 relics with no molecules.',
			unlocked() { return hasAchievement('A', 112) && hasAchievement('A', 121) },
			color: '#B9A975',
		},
		121: {
			name: 'Atom Combination',
			done() {return player.m.points.gte(1)},
			tooltip: 'obtain 1 molecule.',
			unlocked() { return hasAchievement('A', 121) },
			color: '#00CCCC',
		},
		122: {
			name: 'Varied Molecules',
			done() {return player.m.points.gte(1000000)},
			tooltip: 'obtain 1,000,000 molecules.',
			unlocked() { return hasAchievement('A', 121) },
			color: '#00CCCC',
		},
		123: {
			name: 'Molecule Dictionary',
			done() {return player.m.points.gte(1e12)},
			tooltip: 'obtain 1e12 molecules.',
			unlocked() { return hasAchievement('A', 122) },
			color: '#00CCCC',
		},
		124: {
			name: 'Plethora of Molecules',
			done() {return player.m.points.gte(1e25)},
			tooltip: 'obtain 1e25 molecules.',
			unlocked() { return hasAchievement('A', 123) },
			color: '#00CCCC',
		},
		125: {
			name: 'Molecules are Everything',
			done() {return player.m.points.gte(1e75)},
			tooltip: 'obtain 1e75 molecules.',
			unlocked() { return hasAchievement('A', 124) },
			color: '#00CCCC',
		},
		126: {
			name: 'Shiny New Molecules',
			done() {return player.m.points.gte(1000000) && player.r.total.eq(0)},
			tooltip: 'obtain 1,000,000 molecules with no relics.',
			unlocked() { return hasAchievement('A', 122) && hasAchievement('A', 131) },
			color: '#00CCCC',
		},
		131: {
			name: 'Spread the Word',
			done() {return player.gi.points.gte(1)},
			tooltip: 'obtain 1 good influence.',
			unlocked() { return hasAchievement('A', 131) },
			color: '#08FF87',
		},
		132: {
			name: 'Good Deeds All Around',
			done() {return player.gi.points.gte(10)},
			tooltip: 'obtain 10 good influence.',
			unlocked() { return hasAchievement('A', 131) },
			color: '#08FF87',
		},
		133: {
			name: 'World of Good',
			done() {return player.gi.points.gte(100)},
			tooltip: 'obtain 100 good influence.',
			unlocked() { return hasAchievement('A', 132) },
			color: '#08FF87',
		},
		134: {
			name: 'Maximum Good',
			done() {return player.gi.points.gte(1000)},
			tooltip: 'obtain 1,000 good influence.',
			unlocked() { return hasAchievement('A', 133) },
			color: '#08FF87',
		},
		136: {
			name: 'Science is not Holy',
			done() {return player.gi.points.gte(10) && player.m.total.eq(0)},
			tooltip: 'obtain 10 good influence with no molecules.',
			unlocked() { return hasAchievement('A', 132) && hasAchievement('A', 151) },
			color: '#08FF87',
		},
		141: {
			name: 'Malevolent Evil',
			done() {return player.ei.points.gte(1)},
			tooltip: 'obtain 1 evil influence.',
			unlocked() { return hasAchievement('A', 141) },
			color: '#FF4400',
		},
		142: {
			name: 'Evil Encroaches',
			done() {return player.ei.points.gte(10)},
			tooltip: 'obtain 10 evil influence.',
			unlocked() { return hasAchievement('A', 141) },
			color: '#FF4400',
		},
		143: {
			name: 'Evil Encompasses',
			done() {return player.ei.points.gte(100)},
			tooltip: 'obtain 100 evil influence.',
			unlocked() { return hasAchievement('A', 142) },
			color: '#FF4400',
		},
		144: {
			name: 'Invasion of Evil',
			done() {return player.ei.points.gte(1000)},
			tooltip: 'obtain 1,000 evil influence.',
			unlocked() { return hasAchievement('A', 143) },
			color: '#FF4400',
		},
		146: {
			name: 'Disbelievers',
			done() {return player.ei.points.gte(10) && player.m.total.eq(0)},
			tooltip: 'obtain 10 evil influence with no molecules.',
			unlocked() { return hasAchievement('A', 142) && hasAchievement('A', 151) },
			color: '#FF4400',
		},
		151: {
			name: 'Big Fight',
			done() {return player.w.points.gte(1)},
			tooltip: 'obtain 1 war.',
			unlocked() { return hasAchievement('A', 151) },
			color: '#A0A0A0',
		},
		152: {
			name: '"Resolving Differences"',
			done() {return player.w.points.gte(10)},
			tooltip: 'obtain 10 wars.',
			unlocked() { return hasAchievement('A', 151) },
			color: '#A0A0A0',
		},
		153: {
			name: 'Ravaging War',
			done() {return player.w.points.gte(100)},
			tooltip: 'obtain 100 wars.',
			unlocked() { return hasAchievement('A', 152) },
			color: '#A0A0A0',
		},
		161: {
			name: 'Life is Born',
			done() {return player.cl.points.gte(1)},
			tooltip: 'obtain 1 cellular life.',
			unlocked() { return hasAchievement('A', 161) },
			color: '#008800',
		},
		162: {
			name: 'Life Blossoms',
			done() {return player.cl.points.gte(10)},
			tooltip: 'obtain 10 cellular life.',
			unlocked() { return hasAchievement('A', 161) },
			color: '#008800',
		},
		163: {
			name: 'Many Cells',
			done() {return player.cl.points.gte(100)},
			tooltip: 'obtain 100 cellular life.',
			unlocked() { return hasAchievement('A', 162) },
			color: '#008800',
		},
	},
});

addLayer('ghost0', {
	position: 1,
	row: 'side',
	layerShown() {return 'ghost'},
});

addLayer('SC', {
	name: 'Softcaps',
	symbol: 'SC',
	position: 2,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		softcaps: [],
	}},
	color: '#DFDFDF',
	resource: 'discovered softcaps',
	row: 'side',
	layerShown() {return player.SC.points > 0},
	tooltip() {return player.SC.points + ' softcaps'},
	effectDescription() {
		let core = 0;
		let quark = 0;
		let hex = 0;
		let divine = 0;
		let molecule = 0;
		let light = 0;
		let relic = 0;
		let good = 0;
		let text = ['of which '];
		let textfin = '';
		if (player.SC.softcaps.includes("c")) {
			core += 1;
		};
		if (player.SC.softcaps.includes("q")) {
			quark += 1;
		};
		if (player.SC.softcaps.includes("h")) {
			hex += 1;
		};
		if (player.SC.softcaps.includes("p-d")) {
			divine += 1;
		};
		if (player.SC.softcaps.includes("m-eff")) {
			molecule += 1;
		};
		if (player.SC.softcaps.includes("r-l")) {
			light += 1;
		};
		if (player.SC.softcaps.includes("r-eff1")) {
			relic += 1;
		};
		if (player.SC.softcaps.includes("gi-eff")) {
			good += 1;
		};
		if (core > 0) text.push('<h2 class="layer-c">' + core + '</h2> is <h2 class="layer-c">core</h2>');
		if (quark > 0) text.push('<h2 class="layer-q">' + quark + '</h2> is <h2 class="layer-q">quirky</h2>');
		if (hex > 0) text.push('<h2 class="layer-h">' + hex + '</h2> is <h2 class="layer-h">hexed</h2>');
		if (divine > 0) text.push('<h2 class="layer-p">' + divine + '</h2> is <h2 class="layer-p">divine</h2>');
		if (molecule > 0) text.push('<h2 class="layer-m">' + molecule + '</h2> is <h2 class="layer-m">molecular</h2>');
		if (light > 0) text.push('<h2 class="layer-r">' + light + '</h2> is <h2 class="layer-r">light</h2>');
		if (relic == 1) text.push('<h2 class="layer-r">1</h2> is a <h2 class="layer-r">relic</h2>');
		else if (relic > 1) text.push('<h2 class="layer-r">' + relic + '</h2> are <h2 class="layer-r">relics</h2>');
		if (good > 0) text.push('<h2 class="layer-gi">' + good + '</h2> is <h2 class="layer-gi">good</h2>');
		textfin = text[0];
		if (text.length > 1) {
			textfin += text[1];
		};
		if (text.length > 2) {
			if (text.length == 3) textfin += ' and ';
			else textfin += ", ";
			textfin += text[2];
		};
		if (text.length > 3) {
			if (text.length == 4) textfin += ', and ';
			else textfin += ", ";
			textfin += text[3];
		};
		if (text.length > 4) {
			if (text.length == 5) textfin += ', and ';
			else textfin += ", ";
			textfin += text[4];
		};
		if (text.length > 5) {
			if (text.length == 6) textfin += ', and ';
			else textfin += ", ";
			textfin += text[5];
		};
		if (text.length > 6) {
			if (text.length == 7) textfin += ', and ';
			else textfin += ", ";
			textfin += text[6];
		};
		if (text.length > 7) {
			if (text.length == 8) textfin += ', and ';
			else textfin += ", ";
			textfin += text[7];
		};
		if (text.length > 8) {
			if (text.length == 9) textfin += ', and ';
			else textfin += ", ";
			textfin += text[8];
		};
		return textfin;
	},
	update(diff) {
		player.SC.softcaps = [];
		if (player.c.points.gte(layers.c.softcap) && !player.SC.softcaps.includes("c")) {
			player.SC.softcaps.push("c");
		};
		if (player.q.points.gte(layers.q.softcap) && !player.SC.softcaps.includes("q")) {
			player.SC.softcaps.push("q");
		};
		if (player.h.points.gte(layers.h.softcap) && !player.SC.softcaps.includes("h")) {
			player.SC.softcaps.push("h");
		};
		if (player.p.divinity.gte(softcaps.p_d[0][0]) && !player.SC.softcaps.includes("p-d")) {
			player.SC.softcaps.push("p-d");
		};
		if (tmp.m.effect.gte(softcaps.m_eff[0][0]) && !player.SC.softcaps.includes("m-eff")) {
			player.SC.softcaps.push("m-eff");
		};
		if (player.r.lightgain.gte(softcaps.r_l[0][0]) && !player.SC.softcaps.includes("r-l")) {
			player.SC.softcaps.push("r-l");
		};
		if (tmp.r.effect.gte(softcaps.r_eff1[0][0]) && !player.SC.softcaps.includes("r-eff1")) {
			player.SC.softcaps.push("r-eff1");
		};
		if (tmp.gi.effect.gte(softcaps.gi_eff[0][0]) && !player.SC.softcaps.includes("gi-eff")) {
			player.SC.softcaps.push("gi-eff");
		};
		player.SC.points = new Decimal(player.SC.softcaps.length);
	},
	tabFormat: [
		"main-display",
		["display-text",
			function() {
				text = '';
				if (player.SC.softcaps.includes("c")) text += '<br><h2 class="layer-c">Core Gain Softcap</h2><br>starts at ' + format(layers.c.softcap) + ', gain to ^' + format(layers.c.softcapPower) + '<br>';
				if (player.SC.softcaps.includes("q")) text += '<br><h2 class="layer-q">Quark Gain Softcap</h2><br>starts at ' + format(layers.q.softcap) + ', gain to ^' + format(layers.q.softcapPower) + '<br>';
				if (player.SC.softcaps.includes("h")) text += '<br><h2 class="layer-h">Hex Gain Softcap</h2><br>starts at ' + format(layers.h.softcap) + ', gain to ^' + format(layers.h.softcapPower) + '<br>';
				if (player.SC.softcaps.includes("p-d")) text += '<br><h2 class="layer-p">Divinity Gain Softcap</h2><br>starts at ' + format(softcaps.p_d[0][0]) + ', gain to ^' + format(softcaps.p_d[0][1]) + '<br>';
				if (player.SC.softcaps.includes("m-eff")) text += '<br><h2 class="layer-m">Molecule Effect Softcap</h2><br>starts at ' + format(softcaps.m_eff[0][0]) + ', effect to ^' + format(softcaps.m_eff[0][1]) + '<br>';
				if (player.SC.softcaps.includes("r-l")) {
					text += '<br><h2 class="layer-r">Light Gain Softcap</h2><br>starts at ' + format(softcaps.r_l[0][0]) + ', gain to ^' + formatSmall(softcaps.r_l[0][1]) + '<br>';
					if (player.nerdMode) text += 'formula: (x/1e24+1)^(-0.01) where x is light gain after softcap<br>';
				};
				if (player.SC.softcaps.includes("r-eff1")) text += '<br><h2 class="layer-r">Relic\'s First Effect Softcap</h2><br>starts at ' + format(softcaps.r_eff1[0][0]) + ', effect to ^' + format(softcaps.r_eff1[0][1]) + '<br>';
				if (player.SC.softcaps.includes("gi-eff")) text += '<br><h2 class="layer-gi">Good Influence Effect Softcap</h2><br>starts at ' + format(softcaps.gi_eff[0][0]) + ', effect to ^' + format(softcaps.gi_eff[0][1]) + '<br>';
				return text;
			}],
	],
});

addLayer('e', {
	name: 'Essence',
	symbol: 'E',
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		auto_upgrades: false,
		auto_buyables: false,
	}},
	color: '#4CED13',
	branches: ['c', 'q', 'p'],
	requires: new Decimal(5),
	resource: 'essence',
	baseResource: 'points',
	baseAmount() { return player.points },
	type: 'normal',
	exponent: 0.5,
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade('e', 13)) mult = mult.mul(upgradeEffect('e', 13));
		if (hasUpgrade('e', 22)) {
			mult = mult.mul(upgradeEffect('e', 22));
			if (hasUpgrade('e', 41)) {
				mult = mult.mul(upgradeEffect('e', 41));
				if (hasUpgrade('e', 42)) mult = mult.mul(upgradeEffect('e', 42));
		}};
		if (hasUpgrade('c', 11)) mult = mult.mul(upgradeEffect('c', 11));
		if (hasUpgrade('q', 12) && hasUpgrade('q', 14)) {
			mult = mult.mul(upgradeEffect('q', 14));
			if (hasUpgrade('q', 15)) mult = mult.mul(upgradeEffect('q', 15));
		};
		if (hasUpgrade('q', 32)) mult = mult.mul(upgradeEffect('q', 32));
		if (hasUpgrade('a', 73)) mult = mult.mul(upgradeEffect('a', 73));
		if (hasUpgrade('p', 11)) mult = mult.mul(upgradeEffect('p', 11));
		if (hasUpgrade('m', 11)) mult = mult.mul(upgradeEffect('m', 11));
		if (hasUpgrade('m', 22)) mult = mult.mul(upgradeEffect('m', 22));
		if (getBuyableAmount('e', 11).gt(0)) mult = mult.mul(getBuyableAmount('e', 11).mul(2.5).add(1));
		if (getBuyableAmount('e', 12).gt(0)) mult = mult.mul(getBuyableAmount('e', 12).add(1).pow(0.25));
		if (getBuyableAmount('c', 12).gt(0)) mult = mult.mul(new Decimal(2).pow(getBuyableAmount('c', 12)));
		if (getBuyableAmount('sp', 12).gt(0)) {
			mult = mult.mul(new Decimal(5).pow(getBuyableAmount('sp', 12)));
			if (hasUpgrade('sp', 12)) mult = mult.mul(new Decimal(5).pow(getBuyableAmount('sp', 12)));
		};
		if (getBuyableAmount('sp', 11).gt(0)) mult = mult.mul(getBuyableAmount('sp', 11).add(1).pow(-1));
		if (getBuyableAmount('gi', 12).gt(0)) mult = mult.mul(new Decimal(10).pow(getBuyableAmount('gi', 12).pow(1.5)));
		if (hasUpgrade('p', 22)) mult = mult.mul(player.p.holiness.add(1).pow(0.055));
		if (player.s.points.gt(0)) mult = mult.mul(tmp.s.effect);
		if (player.r.points.gt(0)) mult = mult.mul(player.r.essencemult);
		if (hasUpgrade('ds', 21)) mult = mult.mul(player.A.points.mul(0.2));
		if (inChallenge('ds', 21)) mult = mult.mul(0.00000000000000000001);
		if (new Decimal(tmp.w.effect[0]).gt(1)) mult = mult.mul(tmp.w.effect[0]);
		return mult;
	},
	row: 0,
	hotkeys: [
		{key: 'e', description: 'E: Reset for essence', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return true },
	passiveGeneration() {
		let gen = 0;
		if (hasMilestone('c', 3)) {
			gen += 0.5;
			if (hasUpgrade('h', 51)) {
				gen += 0.25;
				if (hasUpgrade('h', 54)) {
					gen += 0.25;
					if (hasUpgrade('h', 61)) {
						gen += 0.25;
						if (hasUpgrade('h', 64)) {
							gen += 0.25;
		}}}}};
		return gen;
	},
	automate() {
		if (hasMilestone('m', 2) && player.e.auto_upgrades) {
			buyUpgrade('e', 11);
			if (hasUpgrade('e', 11)) buyUpgrade('e', 12);
			if (hasUpgrade('e', 12)) buyUpgrade('e', 13);
			if (hasUpgrade('e', 13)) buyUpgrade('e', 21);
			if (hasUpgrade('e', 21)) buyUpgrade('e', 22);
			if (hasUpgrade('e', 22)) buyUpgrade('e', 23);
			if (hasUpgrade('e', 23)) buyUpgrade('e', 31);
			if (hasMilestone('q', 0) && hasUpgrade('e', 31)) buyUpgrade('e', 32);
			if (hasMilestone('q', 0) && hasUpgrade('e', 32)) buyUpgrade('e', 33);
			if (hasMilestone('q', 0) && hasUpgrade('e', 33)) buyUpgrade('e', 41);
			if (hasMilestone('q', 0) && hasUpgrade('e', 41)) buyUpgrade('e', 42);
		};
		if (hasMilestone('m', 0) && player.e.auto_buyables) {
			if (layers.e.buyables[11].canAfford()) {
				layers.e.buyables[11].buy();
			};
			if (layers.e.buyables[12].unlocked() && layers.e.buyables[12].canAfford()) {
				layers.e.buyables[12].buy();
			};
		};
	},
	doReset(resettingLayer) {
		if (challengeCompletions('r', 11) >= 21) return;
		if (hasMilestone('s', 20) && resettingLayer == 's') return;
		if (hasMilestone('m', 2) && resettingLayer == 'm') return;
		if (hasMilestone('gi', 1) && resettingLayer == 'gi') return;
		let keep = ['auto_upgrades', 'auto_buyables'];
			if (hasMilestone('c', 0) && resettingLayer == 'c') keep.push("upgrades");
			if (hasMilestone('c', 2) && resettingLayer == 'c') keep.push("buyables");
			if (hasMilestone('q', 1) && resettingLayer == 'q') keep.push("upgrades");
			if (hasMilestone('q', 2) && resettingLayer == 'q') keep.push("buyables");
			if (hasMilestone('sp', 1) && resettingLayer == 'sp') keep.push("upgrades");
			if (hasMilestone('sp', 4) && resettingLayer == 'sp') keep.push("buyables");
			if (hasMilestone('h', 0) && resettingLayer == 'h') keep.push("upgrades");
			if (hasMilestone('h', 1) && resettingLayer == 'h') keep.push("buyables");
			if (hasMilestone('ds', 3)) keep.push("upgrades");
			if (hasMilestone('ds', 4)) keep.push("buyables");
			if (layers[resettingLayer].row > this.row) layerDataReset('e', keep);
		},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"blank",
		"blank",
		"buyables",
		"blank",
		"upgrades",
	],
	upgrades: {
		11: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Faster Points';
			},
			description: 'multiplies point gain by 1.5',
			cost: 1,
		},
		12: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Essence Influence';
			},
			description: 'multiplies point gain based on your essence',
			cost: 2,
			hardcap() {
				let hardcap = new Decimal("1e1750");
				if (tmp.r.effect.gt(1)) hardcap = hardcap.mul(tmp.r.effect);
				return hardcap;
			},
			effect() {
				let eff = player.e.points.add(1).pow(0.5);
				let hardcap = this.hardcap();
				if (eff.gt(hardcap)) return hardcap;
				return eff;
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (this.effect().gte(this.hardcap())) text += ' (hardcapped)';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.5';
				return text;
			},
			unlocked() { return hasUpgrade('e', 11) },
		},
		13: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Influenced Essence';
			},
			description: 'multiplies essence gain based on your points',
			cost: 5,
			effect() {
				return player.points.add(1).pow(0.15);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.15';
				return text;
			},
			unlocked() { return hasUpgrade('e', 12) },
		},
		21: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Point Recursion';
			},
			description: 'multiplies point gain based on your points',
			cost: 500,
			effect() {
				return player.points.add(1).pow(0.075);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.075';
				return text;
			},
			unlocked() { return hasUpgrade('e', 13) },
		},
		22: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Essence of Essence';
			},
			description: 'multiplies essence gain based on your essence',
			cost: 1250,
			effect() {
				return player.e.points.add(1).pow(0.11111111111);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.11111111111';
				return text;
			},
			unlocked() { return hasUpgrade('e', 21) },
		},
		23: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Recurring Recursion';
			},
			description: 'boosts the effect of <b class="layer-e' + getdark(this, "ref") + 'Point Recursion</b> based on your points',
			cost: 3500,
			effect() {
				return player.points.add(1).pow(0.25);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.25';
				return text;
			},
			unlocked() { return hasUpgrade('e', 22) },
		},
		31: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Infinite Recursion';
			},
			description: 'boosts the effect of <b class="layer-e' + getdark(this, "ref") + 'Recurring Recursion</b> based on your points',
			cost: 1.11e11,
			effect() {
				return player.points.add(1).pow(0.01);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasMilestone('q', 0) && hasUpgrade('e', 23) },
		},
		32: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Brilliance';
			},
			description() {
				return 'some of the effect of <b class="layer-e' + getdark(this, "ref") + 'Radiant Essence</b> is applied to point gain (based on essence)';
			},
			cost: 3.33e33,
			effect() {
				return player.e.points.add(1).pow(0.001);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.001';
				return text;
			},
			unlocked() { return hasMilestone('q', 0) && hasUpgrade('e', 31) },
		},
		33: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Essence Network';
			},
			description() {
				return 'boosts the effect of <b class="layer-e' + getdark(this, "ref") + 'Essence Influence</b> based on your essence';
			},
			cost: 5.55e55,
			effect() {
				return player.e.points.add(1).pow(0.025);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.025';
				return text;
			},
			unlocked() { return hasMilestone('q', 0) && hasUpgrade('e', 32) },
		},
		41: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Essence Recursion';
			},
			description() {
				return 'boosts the effect of <b class="layer-e' + getdark(this, "ref") + 'Essence of Essence</b> based on your essence';
			},
			cost: 7.77e77,
			effect() {
				return player.e.points.add(1).pow(0.001);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.001';
				return text;
			},
			unlocked() { return hasMilestone('q', 0) && hasUpgrade('e', 33) },
		},
		42: {
			title() {
				return '<b class="layer-e' + getdark(this, "title") + 'Essences to Infinity';
			},
			description() {
				return 'boosts the effect of <b class="layer-e' + getdark(this, "ref") + 'Essence Recursion</b> based on your essence';
			},
			cost: 9.99e99,
			effect() {
				return player.e.points.add(1).pow(0.01);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasMilestone('q', 0) && hasUpgrade('e', 41) },
		},
	},
	buyables: {
		11: {
			cost(x = 0) {
				if (x == 0) return new Decimal(12).pow(getBuyableAmount('e', 11)).add(20);
				return new Decimal(12).pow(getBuyableAmount('e', 11)).add(x).add(20);
			},
			title() {
				return '<b class="layer-e' + getdark(this, "title-buyable") + 'Purer Essence';
			},
			canAfford() { return player.e.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			purchaseLimit: 14,
			buy() {
				player.e.points = player.e.points.sub(this.cost());
				setBuyableAmount('e', 11, getBuyableAmount('e', 11).add(1));
			},
			display() {
				if (player.nerdMode) return 'multiplies essence gain based on the amount of this upgrade bought.<br>Currently: ' + format(getBuyableAmount('e', 11).mul(2.5).add(1)) + 'x<br>formula: x*2.5+1<br><br>Cost: ' + formatWhole(this.cost()) + ' essence<br><br>Bought: ' + formatWhole(getBuyableAmount('e', 11));
				return 'multiplies essence gain based on the amount of this upgrade bought.<br>Currently: ' + format(getBuyableAmount('e', 11).mul(2.5).add(1)) + 'x<br><br>Cost: ' + formatWhole(this.cost()) + ' essence<br><br>Bought: ' + formatWhole(getBuyableAmount('e', 11));
			},
		},
		12: {
			cost(x = 0) {
				if (x == 0) return new Decimal(44).pow(getBuyableAmount('e', 12)).mul(10).add(85184);
				return new Decimal(44).pow(getBuyableAmount('e', 12)).add(x).mul(10).add(85184);
			},
			title() {
				return '<b class="layer-e' + getdark(this, "title-buyable") + 'Radiant Essence';
			},
			canAfford() { return player.e.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			purchaseLimit: 99,
			buy() {
				player.e.points = player.e.points.sub(this.cost());
				setBuyableAmount('e', 12, getBuyableAmount('e', 12).add(1));
			},
			display() {
				if (player.nerdMode) return 'multiplies core gain (and essence gain at a reduced rate) based on the amount of this upgrade bought.<br>Currently: ' + format(getBuyableAmount('e', 12).add(1)) + 'x<br>and ' + format(getBuyableAmount('e', 12).add(1).pow(0.25)) + 'x<br>formulas: x+1 and (x+1)^0.25<br><br>Cost: ' + formatWhole(this.cost()) + ' essence<br><br>Bought: ' + formatWhole(getBuyableAmount('e', 12));
				return 'multiplies core gain (and essence gain at a reduced rate) based on the amount of this upgrade bought.<br>Currently: ' + format(getBuyableAmount('e', 12).add(1)) + 'x<br>and ' + format(getBuyableAmount('e', 12).add(1).pow(0.25)) + 'x<br><br>Cost: ' + formatWhole(this.cost()) + ' essence<br><br>Bought: ' + formatWhole(getBuyableAmount('e', 12));
			},
			unlocked() { return player.e.total.gte(85194) || getBuyableAmount('e', 12).gt(0) },
		},
	},
});

addLayer('c', {
	name: 'Cores',
	symbol: 'C',
	position: 0,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		auto_upgrades: false,
		auto_buyables: false,
	}},
	color: "#D2D237",
	branches: ['h'],
	requires: 10000,
	resource: 'cores',
	baseResource: 'essence',
	baseAmount() { return player.e.points },
	type: 'normal',
	exponent: 0.3,
	gainMult() {
		// init
		let mult = new Decimal(1);
		// mul
		if (hasUpgrade('e', 32)) mult = mult.mul(upgradeEffect('e', 32));
		if (hasUpgrade('c', 12)) mult = mult.mul(upgradeEffect('c', 12));
		if (hasUpgrade('q', 21)) {
			mult = mult.mul(upgradeEffect('q', 21));
			if (hasUpgrade('q', 22)) mult = mult.mul(upgradeEffect('q', 22));
		};
		if (hasUpgrade('q', 33)) mult = mult.mul(upgradeEffect('q', 33));
		if (hasUpgrade('h', 13)) {
			mult = mult.mul(upgradeEffect('h', 13));
			if (hasUpgrade('h', 23)) {
				mult = mult.mul(upgradeEffect('h', 23));
				if (hasUpgrade('h', 33)) mult = mult.mul(upgradeEffect('h', 33));
		}};
		if (hasUpgrade('h', 24)) mult = mult.mul(3);
		if (hasUpgrade('m', 21)) mult = mult.mul(upgradeEffect('m', 21));
		if (getBuyableAmount('e', 12).gt(0)) mult = mult.mul(getBuyableAmount('e', 12).add(1));
		if (hasUpgrade('ds', 21) && hasUpgrade('ds', 23)) mult = mult.mul(player.A.points.pow(2).div(100));
		if (inChallenge('ds', 11)) mult = mult.mul(0.01);
		if (inChallenge('ds', 21)) mult = mult.mul(0.000000000000001);
		if (new Decimal(tmp.w.effect[0]).gt(1)) mult = mult.mul(tmp.w.effect[0]);
		// pow
		if (getBuyableAmount('cl', 11).gt(0)) mult = mult.pow(buyableEffect('cl', 11)[0]);
		// return
		return mult;
	},
	softcap: new Decimal("1e1250"),
	softcapPower: 0.7,
	row: 1,
	hotkeys: [
		{key: 'c', description: 'C: Reset for cores', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return true },
	passiveGeneration() {
		let gen = 0;
		if (hasUpgrade('h', 43)) {
			gen += 0.01;
			if (hasUpgrade('h', 44)) {
				gen += 0.09;
				if (hasUpgrade('h', 52)) {
					gen += 0.15;
					if (hasUpgrade('c', 33)) {
						gen += 0.25;
		}}}};
		return gen;
	},
	automate() {
		if (hasMilestone('s', 1) && player.c.auto_upgrades) {
			if (hasMilestone('c', 1)) buyUpgrade('c', 11);
			if (hasMilestone('c', 1) && hasUpgrade('c', 11)) buyUpgrade('c', 12);
			if (hasMilestone('c', 1) && hasUpgrade('c', 12)) buyUpgrade('c', 13);
			if (hasMilestone('h', 8) && hasUpgrade('c', 13)) buyUpgrade('c', 21);
			if (hasMilestone('h', 8) && hasUpgrade('c', 21)) buyUpgrade('c', 22);
			if (hasMilestone('h', 8) && hasUpgrade('c', 22)) buyUpgrade('c', 23);
			if (hasUpgrade('h', 53) && hasUpgrade('c', 23)) buyUpgrade('c', 31);
			if (hasUpgrade('h', 53) && hasUpgrade('c', 31)) buyUpgrade('c', 32);
			if (hasUpgrade('h', 53) && hasUpgrade('c', 32)) buyUpgrade('c', 33);
		};
		if (hasMilestone('s', 2) && player.c.auto_buyables) {
			if (layers.c.buyables[11].canAfford()) {
				layers.c.buyables[11].buy();
			};
			if (layers.c.buyables[12].canAfford()) {
				layers.c.buyables[12].buy();
			};
		};
	},
	doReset(resettingLayer) {
		if (challengeCompletions('r', 11) >= 25 && resettingLayer == 'r') return;
		if (hasMilestone('m', 4) && resettingLayer == 'm') return;
		if (hasMilestone('gi', 2) && resettingLayer == 'gi') return;
		if (hasMilestone('ei', 1) && resettingLayer == 'ei') return;
		if (hasMilestone('w', 7) && resettingLayer == 'w') return;
		if (hasMilestone('cl', 2) && resettingLayer == 'cl') return;
		let keep = ['auto_upgrades', 'auto_buyables'];
			if (hasMilestone('h', 2) && resettingLayer == 'h') keep.push("upgrades");
			if (hasMilestone('h', 3) && resettingLayer == 'h') keep.push("buyables");
			if (hasMilestone('h', 4) && resettingLayer == 'sp') keep.push("upgrades");
			if (hasMilestone('h', 4) && resettingLayer == 'sp') keep.push("buyables");
			if (hasMilestone('h', 5) && resettingLayer == 'h') keep.push("milestones");
			if (hasMilestone('h', 5) && resettingLayer == 'sp') keep.push("milestones");
			if (hasMilestone('ds', 2) && resettingLayer == 'ds') keep.push("milestones");
			if (hasMilestone('ds', 5) && resettingLayer == 'ds') keep.push("upgrades");
			if (hasMilestone('ds', 6) && resettingLayer == 'ds') keep.push("buyables");
			if (hasMilestone('a', 1) && resettingLayer == 'a') keep.push("buyables");
			if (hasMilestone('a', 2) && resettingLayer == 'a') keep.push("upgrades");
			if (hasMilestone('a', 4) && resettingLayer == 'a') keep.push("milestones");
			if (hasMilestone('s', 25) && resettingLayer == 's') keep.push("milestones");
			if (layers[resettingLayer].row > this.row) layerDataReset('c', keep);
		},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"blank",
		"milestones",
		"buyables",
		"blank",
		"upgrades",
	],
	milestones: {
		0: {
			requirementDescription: '10 cores',
			effectDescription: 'keep essence upgrades on core resets',
			done() { return player.c.points.gte(10) },
		},
		1: {
			requirementDescription: '25 cores',
			effectDescription: 'unlock core upgrades',
			done() { return player.c.points.gte(25) },
		},
		2: {
			requirementDescription: '500 cores',
			effectDescription: 'keep essence rebuyables on core resets',
			done() { return player.c.points.gte(500) },
		},
		3: {
			requirementDescription: '1e64 cores',
			effectDescription: 'gain 50% of essence gain per second',
			done() { return player.c.points.gte(1e64) },
			unlocked() { return player.c.best.gte(1e60) },
		},
	},
	upgrades: {
		11: {
			title() {
				return '<b class="layer-c' + getdark(this, "title") + 'Heat Emission';
			},
			description: 'multiplies essence gain based on your cores',
			cost: 25,
			effect() {
				return player.c.points.add(1).pow(0.2);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.2';
				return text;
			},
			unlocked() { return hasMilestone('c', 1) },
		},
		12: {
			title() {
				return '<b class="layer-c' + getdark(this, "title") + 'Core Countdown';
			},
			description: 'multiplies core gain based on your points',
			cost: 100,
			effect() {
				return player.points.add(1).pow(0.01);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasUpgrade('c', 11) },
		},
		13: {
			title() {
				return '<b class="layer-c' + getdark(this, "title") + 'The Quarks\' Core';
			},
			description: 'multiplies quark gain based on your cores',
			cost: 750,
			effect() {
				return player.c.points.add(1).pow(0.1);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.1';
				return text;
			},
			unlocked() { return hasUpgrade('c', 12) },
		},
		21: {
			title() {
				return '<b class="layer-c' + getdark(this, "title") + 'Quarky Core';
			},
			description() {
				return 'multiplies the effect of <b class="layer-c' + getdark(this, "ref") + 'The Quarks\' Core</b> based on your cores';
			},
			cost: 1.00e69,
			effect() {
				return player.c.points.add(1).pow(0.005);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.005';
				return text;
			},
			unlocked() { return hasMilestone('h', 8) && hasUpgrade('c', 13) },
		},
		22: {
			title() {
				return '<b class="layer-c' + getdark(this, "title") + 'Quirky Core';
			},
			description() {
				return 'multiplies the effect of <b class="layer-c' + getdark(this, "ref") + 'Quarky Core</b> based on your cores';
			},
			cost: 1.00e71,
			effect() {
				return player.c.points.add(1).pow(0.002);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.002';
				return text;
			},
			unlocked() { return hasMilestone('h', 8) && hasUpgrade('c', 21) },
		},
		23: {
			title() {
				return '<b class="layer-c' + getdark(this, "title") + 'Super Core';
			},
			description: 'multiplies core gain based on your cores',
			cost: 1.00e73,
			effect() {
				return player.c.points.add(1).pow(0.01);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasMilestone('h', 8) && hasUpgrade('c', 22) },
		},
		31: {
			title() {
				return '<b class="layer-c' + getdark(this, "title") + 'Ultra Core';
			},
			description() {
				return 'multiplies the effect of <b class="layer-c' + getdark(this, "ref") + 'Super Core</b> based on your cores';
			},
			cost: 1.00e75,
			effect() {
				return player.c.points.add(1).pow(0.0025);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.0025';
				return text;
			},
			unlocked() { return hasUpgrade('h', 53) && hasUpgrade('c', 23) },
		},
		32: {
			title() {
				return '<b class="layer-c' + getdark(this, "title") + 'Hexed Core';
			},
			description() {
				return 'multiplies the effect of <b class="layer-c' + getdark(this, "ref") + 'Ultra Core</b> based on your hexes';
			},
			cost: 1.00e77,
			effect() {
				return player.c.points.add(1).pow(0.001);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.001';
				return text;
			},
			unlocked() { return hasUpgrade('h', 53) && hasUpgrade('c', 31) },
		},
		33: {
			title() {
				return '<b class="layer-c' + getdark(this, "title") + 'Core Liberation';
			},
			description() {
				return 'if you own <b class="layer-h' + getdark(this, "ref") + 'Core Production Line</b> and all subsequent upgrades, gain +25% of your core gain per second';
			},
			cost: 1.00e80,
			unlocked() { return hasUpgrade('h', 53) && hasUpgrade('c', 32) },
		},
	},
	buyables: {
		11: {
			cost(x = 0) {
				if (x == 0) return getBuyableAmount('c', 11).mul(2).add(1);
				return getBuyableAmount('c', 11).add(x).mul(2).add(1);
			},
			title() {
				return '<b class="layer-c' + getdark(this, "title-buyable") + 'Empowered Points';
			},
			canAfford() { return player.c.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			purchaseLimit: 99,
			buy() {
				player.c.points = player.c.points.sub(this.cost());
				setBuyableAmount('c', 11, getBuyableAmount('c', 11).add(1));
			},
			display() {
				let text = '';
				if (player.nerdMode) text += '<br>formula: x*5+1';
				if (getBuyableAmount('c', 11).eq(0)) return 'multiplies point gain based on the amount of this upgrade bought.<br>Currently: 1.00x' + text + '<br><br>Cost: 1 core<br><br>Bought: 0';
				else return 'multiplies point gain based on the amount of this upgrade bought.<br>Currently: ' + format(getBuyableAmount('c', 11).mul(5).add(1)) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' cores<br><br>Bought: ' + formatWhole(getBuyableAmount('c', 11));
			},
		},
		12: {
			cost(x = 0) {
				if (x == 0) return new Decimal(6).pow(getBuyableAmount('c', 12));
				return new Decimal(6).pow(getBuyableAmount('c', 12).add(x));
			},
			title() {
				return '<b class="layer-c' + getdark(this, "title-buyable") + 'Empowered Essence';
			},
			canAfford() { return player.c.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			purchaseLimit: 49,
			buy() {
				player.c.points = player.c.points.sub(this.cost());
				setBuyableAmount('c', 12, getBuyableAmount('c', 12).add(1));
			},
			display() {
				let text = '';
				if (player.nerdMode) text += '<br>formula: 2^x';
				if (getBuyableAmount('c', 12).eq(0)) return 'multiplies essence gain based on the amount of this upgrade bought.<br>Currently: 1.00x' + text + '<br><br>Cost: 1 core<br><br>Bought: 0';
				else return 'multiplies essence gain based on the amount of this upgrade bought.<br>Currently: ' + format(new Decimal(2).pow(getBuyableAmount('c', 12))) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' cores<br><br>Bought: ' + formatWhole(getBuyableAmount('c', 12));
			},
		},
	},
});

addLayer('q', {
	name: 'Quarks',
	symbol: 'Q',
	position: 2,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		auto_upgrades: false,
	}},
	color: "#DB5196",
	branches: ['sp'],
	requires: 1e9,
	resource: 'quarks',
	baseResource: 'essence',
	baseAmount() { return player.e.points },
	type: 'normal',
	exponent: 0.1,
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade('c', 13)) mult = mult.mul(upgradeEffect('c', 13));
		if (hasUpgrade('q', 11)) mult = mult.mul(upgradeEffect('q', 11));
		if (hasUpgrade('q', 21)) mult = mult.mul(upgradeEffect('q', 21));
			if (hasUpgrade('q', 22)) mult = mult.mul(upgradeEffect('q', 22));
		if (hasUpgrade('q', 12) && hasUpgrade('q', 23)) {
			mult = mult.mul(upgradeEffect('q', 23));
			if (hasUpgrade('q', 24)) {
				mult = mult.mul(upgradeEffect('q', 24));
				if (hasUpgrade('q', 25)) {
					mult = mult.mul(upgradeEffect('q', 25));
					if (hasUpgrade('q', 31)) mult = mult.mul(upgradeEffect('q', 31));
		}}};
		if (hasUpgrade('q', 42)) {
			mult = mult.mul(upgradeEffect('q', 42));
			if (hasUpgrade('q', 44)) mult = mult.mul(upgradeEffect('q', 44));
		};
		if (hasUpgrade('q', 45)) mult = mult.mul(upgradeEffect('q', 45));
		if (hasUpgrade('h', 34)) mult = mult.mul(2);
		if (hasUpgrade('a', 41)) mult = mult.mul(upgradeEffect('a', 41));
		if (hasUpgrade('m', 13)) mult = mult.mul(upgradeEffect('m', 13));
		if (getBuyableAmount('sp', 11).gt(0)) {
			mult = mult.mul(new Decimal(5).pow(getBuyableAmount('sp', 11)));
			if (hasUpgrade('sp', 11)) mult = mult.mul(new Decimal(5).pow(getBuyableAmount('sp', 11)));
		};
		if (getBuyableAmount('sp', 21).gt(0)) mult = mult.mul(getBuyableAmount('sp', 21).add(1).pow(-1));
		if (hasUpgrade('ds', 21) && hasUpgrade('ds', 23)) mult = mult.mul(player.A.points.pow(2).div(100));
		if (inChallenge('ds', 11)) mult = mult.mul(0.1);
		if (inChallenge('ds', 22)) mult = mult.mul(0.0000000000000000000000000000000000000001);
		if (new Decimal(tmp.w.effect[0]).gt(1)) mult = mult.mul(tmp.w.effect[0]);
		return mult;
	},
	softcap: new Decimal("1e1250"),
	softcapPower: 0.6,
	row: 1,
	hotkeys: [
		{key: 'q', description: 'Q: Reset for quarks', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return player.c.unlocked || player.q.unlocked },
	passiveGeneration() {
		gen = 0;
		if (hasMilestone('a', 8)) {
			gen += 0.01;
			if (hasMilestone('a', 9)) {
				gen += 0.09;
		}};
		return gen;
	},
	automate() {
		if (hasMilestone('s', 4) && player.q.auto_upgrades) {
			buyUpgrade('q', 11);
			if (hasUpgrade('q', 11)) buyUpgrade('q', 12);
			if (hasUpgrade('q', 12)) buyUpgrade('q', 13);
			if (hasUpgrade('q', 13)) buyUpgrade('q', 14);
			if (hasUpgrade('q', 14)) buyUpgrade('q', 15);
			if (hasUpgrade('q', 15)) buyUpgrade('q', 21);
			if (hasUpgrade('q', 21)) buyUpgrade('q', 22);
			if (hasUpgrade('q', 22)) buyUpgrade('q', 23);
			if (hasUpgrade('q', 23)) buyUpgrade('q', 24);
			if (hasUpgrade('q', 24)) buyUpgrade('q', 25);
			if (hasUpgrade('q', 25)) buyUpgrade('q', 31);
			if (hasUpgrade('q', 31)) buyUpgrade('q', 32);
			if (hasUpgrade('q', 32)) buyUpgrade('q', 33);
			if (hasUpgrade('q', 33)) buyUpgrade('q', 34);
			if (hasUpgrade('q', 34)) buyUpgrade('q', 35);
			if (hasMilestone('sp', 2) && hasUpgrade('q', 35)) buyUpgrade('q', 41);
			if (hasMilestone('sp', 2) && hasUpgrade('q', 41)) buyUpgrade('q', 42);
			if (hasMilestone('sp', 2) && hasUpgrade('q', 42)) buyUpgrade('q', 43);
			if (hasMilestone('sp', 2) && hasUpgrade('q', 43)) buyUpgrade('q', 44);
			if (hasMilestone('sp', 2) && hasUpgrade('q', 44)) buyUpgrade('q', 45);
		};
	},
	doReset(resettingLayer) {
		if (challengeCompletions('r', 11) >= 30 && resettingLayer == 'r') return;
		if (hasMilestone('m', 5) && resettingLayer == 'm') return;
		if (hasMilestone('gi', 3) && resettingLayer == 'gi') return;
		if (hasMilestone('ei', 2) && resettingLayer == 'ei') return;
		if (hasMilestone('w', 9) && resettingLayer == 'w') return;
		if (hasMilestone('cl', 5) && resettingLayer == 'cl') return;
		let keep = ['auto_upgrades'];
			if (hasMilestone('sp', 3) && resettingLayer == 'sp') keep.push("milestones");
			if (hasMilestone('sp', 5) && resettingLayer == 'sp') keep.push("upgrades");
			if (hasMilestone('h', 5) && resettingLayer == 'h') keep.push("milestones");
			if (hasMilestone('h', 5) && resettingLayer == 'sp') keep.push("milestones");
			if (hasMilestone('h', 6) && resettingLayer == 'sp') keep.push("upgrades");
			if (hasMilestone('h', 7) && resettingLayer == 'h') keep.push("upgrades");
			if (hasMilestone('ds', 2) && resettingLayer == 'ds') keep.push("milestones");
			if (hasMilestone('ds', 7) && resettingLayer == 'ds') keep.push("upgrades");
			if (hasMilestone('a', 0) && resettingLayer == 'a') keep.push("buyables");
			if (hasMilestone('a', 1) && resettingLayer == 'a') keep.push("upgrades");
			if (hasMilestone('a', 5) && resettingLayer == 'a') keep.push("milestones");
			if (hasMilestone('s', 25) && resettingLayer == 's') keep.push("milestones");
			if (layers[resettingLayer].row > this.row) layerDataReset('q', keep);
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"blank",
		"milestones",
		"upgrades",
	],
	milestones: {
		0: {
			requirementDescription: '5 quarks',
			effectDescription: 'you can explore 5 further essence upgrades',
			done() { return player.q.points.gte(5) }
		},
		1: {
			requirementDescription: '50,000 quarks',
			effectDescription: 'keep essence upgrades on quark resets',
			done() { return player.q.points.gte(50000) }
		},
		2: {
			requirementDescription: '250,000,000 quarks',
			effectDescription: 'keep essence rebuyables on quark resets',
			done() { return player.q.points.gte(250000000) }
		},
	},
	upgrades: {
		11: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'The Point of Quarks';
			},
			description: 'multiplies quark gain based on your points',
			cost: 1,
			effect() {
			   return player.points.add(1).pow(0.01);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.01';
				return text;
			},
		},
		12: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Quark Power';
			},
			description: 'multiplies point gain based on your quarks',
			cost: 2,
			effect() {
			   return player.q.points.add(1).pow(0.09);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.09';
				return text;
			},
			unlocked() { return hasUpgrade('q', 11) },
		},
		13: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Super Quarks';
			},
			description() {
				return 'multiplies the effect of <b class="layer-q' + getdark(this, "ref") + 'Quark Power</b> based on your points';
			},
			cost: 25,
			effect() {
			   return player.points.add(1).pow(0.0025);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.0025';
				return text;
			},
			unlocked() { return hasUpgrade('q', 12) },
		},
		14: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Essence of Quarks';
			},
			description() {
				return '<b class="layer-q' + getdark(this, "ref") + 'Quark Power</b> also affects essence gain at a reduced rate (<b class="layer-q' + getdark(this, "ref") + 'Super Quarks</b> does not affect this)';
			},
			cost: 100,
			effect() {
			   return player.q.points.add(1).pow(0.2);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.2';
				return text;
			},
			unlocked() { return hasUpgrade('q', 13) },
		},
		15: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Quark Fusion';
			},
			description() {
				return 'multiplies the effect of <b class="layer-q' + getdark(this, "ref") + 'Essence of Quarks</b> based on your cores';
			},
			cost: 750,
			effect() {
			   return player.c.points.add(1).pow(0.02);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.02';
				return text;
			},
			unlocked() { return hasUpgrade('q', 14) },
		},
		21: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Quirky Quarks';
			},
			description: 'multiplies core gain and quark gain based on your quarks',
			cost: 2500,
			effect() {
			   return player.q.points.add(1).pow(0.05);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.05';
				return text;
			},
			unlocked() { return hasUpgrade('q', 15) },
		},
		22: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Very Quirky';
			},
			description() {
				return 'multiplies the effect of <b class="layer-q' + getdark(this, "ref") + 'Quirky Quarks</b> based on your points';
			},
			cost: 7500,
			effect() {
			   return player.points.add(1).pow(0.02);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.02';
				return text;
			},
			unlocked() { return hasUpgrade('q', 21) },
		},
		23: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Quark Extreme';
			},
			description() {
				return '<b class="layer-q' + getdark(this, "ref") + 'Quark Power</b> also affects quark gain at a reduced rate (<b class="layer-q' + getdark(this, "ref") + 'Super Quarks</b> does not affect this)';
			},
			cost: 25000,
			effect() {
			   return player.q.points.add(1).pow(0.1);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.1';
				return text;
			},
			unlocked() { return hasUpgrade('q', 22) },
		},
		24: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Recurring Quarks';
			},
			description() {
				return 'multiplies the effect of <b class="layer-q' + getdark(this, "ref") + 'Quark Extreme</b> based on your quarks';
			},
			cost: 100000,
			effect() {
			   return player.q.points.add(1).pow(0.2);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.2';
				return text;
			},
			unlocked() { return hasUpgrade('q', 23) },
		},
		25: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Recurring More';
			},
			description() {
				return 'multiplies the effect of <b class="layer-q' + getdark(this, "ref") + 'Recurring Quarks</b> based on your quarks';
			},
			cost: 1500000,
			effect() {
			   return player.q.points.add(1).pow(0.05);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.05';
				return text;
			},
			unlocked() { return hasUpgrade('q', 24) },
		},
		31: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Infinite Recur';
			},
			description() {
				return 'multiplies the effect of <b class="layer-q' + getdark(this, "ref") + 'Recurring More</b> based on your quarks';
			},
			cost: 50000000,
			effect() {
			   return player.q.points.add(1).pow(0.01);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasUpgrade('q', 25) },
		},
		32: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Compact Quarks';
			},
			description: 'multiplies essence gain based on your quarks',
			cost: 1.00e9,
			effect() {
			   return player.q.points.add(1).pow(0.15);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.15';
				return text;
			},
			unlocked() { return hasUpgrade('q', 31) },
		},
		33: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Quark Fission';
			},
			description: 'multiplies core gain based on your quarks',
			cost: 1.00e10,
			effect() {
			   return player.q.points.add(1).pow(0.075);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.075';
				return text;
			},
			unlocked() { return hasUpgrade('q', 32) },
		},
		34: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'The Quark Count';
			},
			description: 'multiplies point gain based on your quarks',
			cost: 2.5e11,
			effect() {
			   return player.q.points.add(1).pow(0.01);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasUpgrade('q', 33) },
		},
		35: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Quark Counting';
			},
			description() {
				return 'multiplies the effect of <b class="layer-q' + getdark(this, "ref") + 'The Quark Count</b> based on your quarks';
			},
			cost: 1.00e13,
			effect() {
			   return player.q.points.add(1).pow(0.015);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.015';
				return text;
			},
			unlocked() { return hasUpgrade('q', 34) },
		},
		41: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Ticking Quarks';
			},
			description() {
				return 'multiplies the effect of <b class="layer-q' + getdark(this, "ref") + 'Quark Counting</b> based on your quarks';
			},
			cost: 1.00e14,
			effect() {
			   return player.q.points.add(1).pow(0.005);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.005';
				return text;
			},
			unlocked() { return hasMilestone('sp', 2) && hasUpgrade('q', 35) },
		},
		42: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Subatomic Quarks';
			},
			description: 'multiplies quark gain based on your subatomic particles',
			cost: 1.00e16,
			effect() {
			   return player.sp.points.add(1).pow(0.5);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.5';
				return text;
			},
			unlocked() { return hasMilestone('sp', 2) && hasUpgrade('q', 41) },
		},
		43: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Quirky Particles';
			},
			description: 'multiplies subatomic particle gain based on your quarks',
			cost: 1.00e18,
			effect() {
			   return player.q.points.add(1).pow(0.01);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasMilestone('sp', 2) && hasUpgrade('q', 42) },
		},
		44: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'Particle Quarks';
			},
			description() {
				return 'multiplies the effect of <b class="layer-q' + getdark(this, "ref") + 'Subatomic Quarks</b> based on your quarks';
			},
			cost: 1.00e20,
			effect() {
			   return player.q.points.add(1).pow(0.005);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.005';
				return text;
			},
			unlocked() { return hasMilestone('sp', 2) && hasUpgrade('q', 43) },
		},
		45: {
			title() {
				return '<b class="layer-q' + getdark(this, "title") + 'The Ultra Quark';
			},
			description: 'multiplies quark gain based on your quarks',
			cost: 1.00e22,
			effect() {
			   return player.q.points.add(1).pow(0.125);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.125';
				return text;
			},
			unlocked() { return hasMilestone('sp', 2) && hasUpgrade('q', 44) },
		},
	},
});

addLayer('sp', {
	name: 'Subatomic Particles',
	symbol: 'SP',
	position: 2,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		auto_upgrades: false,
		auto_buyables: false,
	}},
	color: "#710CC4",
	branches: ['a'],
	requires: 1e15,
	resource: 'subatomic particles',
	baseResource: 'quarks',
	baseAmount() { return player.q.points },
	type: 'static',
	exponent: 4.25,
	canBuyMax() { return hasMilestone('sp', 0) || player.w.unlocked },
	gainExp() {
		// init
		let gain = new Decimal(1);
		// mul
		if (hasUpgrade('q', 43)) gain = gain.mul(upgradeEffect('q', 43));
		if (hasUpgrade('h', 63)) gain = gain.mul(upgradeEffect('h', 63));
		if (hasUpgrade('a', 22)) gain = gain.mul(upgradeEffect('a', 22));
		if (hasUpgrade('a', 31)) gain = gain.mul(upgradeEffect('a', 31));
		if (getBuyableAmount('ds', 11).gt(0)) gain = gain.mul(getBuyableAmount('ds', 11).mul(5).add(1));
		if (getBuyableAmount('d', 21).gt(0)) gain = gain.mul(getBuyableAmount('d', 21));
		if (hasUpgrade('a', 51)) gain = gain.mul(player.A.points.pow(2.5).div(100));
		if (hasChallenge('ds', 21)) gain = gain.mul(player.ds.points.add(1).pow(0.2));
		if (inChallenge('ds', 12)) gain = gain.mul(player.q.points.pow(-0.05));
		if (inChallenge('ds', 22)) gain = gain.mul(0.0000000000000000000000000000000000000001);
		if (new Decimal(tmp.w.effect[0]).gt(1)) gain = gain.mul(tmp.w.effect[0]);
		// pow
		if (getBuyableAmount('cl', 13).gt(0)) gain = gain.pow(buyableEffect('cl', 13)[0]);
		// return
		return gain;
	},
	autoPrestige() { return hasMilestone('s', 11) },
	row: 2,
	hotkeys: [
		{key: 'S', description: 'Shift-S: Reset for subatomic particles', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return player.q.unlocked || player.sp.unlocked },
	automate() {
		if (hasMilestone('m', 4) && player.sp.auto_upgrades && hasUpgrade('h', 53)) {
			buyUpgrade('sp', 11);
			buyUpgrade('sp', 12);
			buyUpgrade('sp', 13);
		};
		if (hasMilestone('m', 4) && player.sp.auto_buyables) {
			if (layers.sp.buyables[11].canAfford()) {
				layers.sp.buyables[11].buy();
			};
			if (layers.sp.buyables[12].canAfford()) {
				layers.sp.buyables[12].buy();
			};
			if (layers.sp.buyables[21].canAfford()) {
				layers.sp.buyables[21].buy();
			};
		};
	},
	doReset(resettingLayer) {
		if (challengeCompletions('r', 11) >= 35 && resettingLayer == 'r') return;
		let keep = ['auto_upgrades', 'auto_buyables'];
			if (hasMilestone('ds', 0) && resettingLayer == 'ds') keep.push("buyables");
			if (hasMilestone('ds', 1) && resettingLayer == 'ds') keep.push("upgrades");
			if (hasMilestone('a', 0) && resettingLayer == 'a') keep.push("buyables");
			if (hasMilestone('a', 3) && resettingLayer == 'a') keep.push("upgrades");
			if (hasMilestone('a', 13) && resettingLayer == 'a') keep.push("milestones");
			if (layers[resettingLayer].row > this.row) layerDataReset('sp', keep);
		},
	resetsNothing() { return hasMilestone('s', 11) },
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"blank",
		"milestones",
		"buyables",
		"blank",
		"upgrades",
	],
	milestones: {
		0: {
			requirementDescription: '1 subatomic particle',
			effectDescription: 'you can buy max subatomic particles',
			done() { return player.sp.points.gte(1) }
		},
		1: {
			requirementDescription: '2 subatomic particles',
			effectDescription: 'keep essence upgrades on subatomic particle resets',
			done() { return player.sp.points.gte(2) }
		},
		2: {
			requirementDescription: '3 subatomic particles',
			effectDescription: 'you can explore 5 further quark upgrades',
			done() { return player.sp.points.gte(3) }
		},
		3: {
			requirementDescription: '4 subatomic particles',
			effectDescription: 'keep quark milestones on subatomic particle resets',
			done() { return player.sp.points.gte(4) }
		},
		4: {
			requirementDescription: '5 subatomic particles',
			effectDescription: 'keep essence rebuyables on subatomic particle resets',
			done() { return player.sp.points.gte(5) }
		},
		5: {
			requirementDescription: '6 subatomic particles',
			effectDescription: 'keep quark upgrades on subatomic particle resets',
			done() { return player.sp.points.gte(6) }
		},
	},
	upgrades: {
		11: {
			title() {
				return '<b class="layer-sp' + getdark(this, "title") + 'Positrons';
			},
			description() {
				return 'squares the positive effect of <b class="layer-sp' + getdark(this, "ref") + 'Protons';
			},
			cost: 6,
			unlocked() { return hasUpgrade('h', 53) },
		},
		12: {
			title() {
				return '<b class="layer-sp' + getdark(this, "title") + 'Beta Particles';
			},
			description() {
				return 'squares the positive effect of <b class="layer-sp' + getdark(this, "ref") + 'Neutrons';
			},
			cost: 6,
			unlocked() { return hasUpgrade('h', 53) },
		},
		13: {
			title() {
				return '<b class="layer-sp' + getdark(this, "title") + 'Gamma Particles';
			},
			description() {
				return 'squares the positive effect of <b class="layer-sp' + getdark(this, "ref") + 'Electrons';
			},
			cost: 6,
			unlocked() { return hasUpgrade('h', 53) },
		},
	},
	buyables: {
		11: {
			cost(x = 0) { return getBuyableAmount('sp', 11).add(1) },
			title() {
				return '<b class="layer-sp' + getdark(this, "title-buyable") + 'Protons';
			},
			canAfford() { return player.sp.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			purchaseLimit: 9,
			buy() {
				player.sp.points = player.sp.points.sub(this.cost());
				setBuyableAmount('sp', 11, getBuyableAmount('sp', 11).add(1));
			},
			display() {
				let text = '';
				if (player.nerdMode) {
					if (hasUpgrade('sp', 11)) text += '<br>formulas: 5^x^2 and (x+1)^-1';
					else text += '<br>formulas: 5^x and (x+1)^-1';
				};
				if (hasUpgrade('sp', 11)) return 'multiplies quark gain (but also decreases essence gain at a reduced rate) based on the amount of this upgrade bought.<br>Currently: ' + format(new Decimal(5).pow(getBuyableAmount('sp', 11)).pow(2)) + 'x<br>and ' + format(getBuyableAmount('sp', 11).add(1) ** -1) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' subatomic particles<br><br>Bought: ' + formatWhole(getBuyableAmount('sp', 11));
				else return 'multiplies quark gain (but also decreases essence gain at a reduced rate) based on the amount of this upgrade bought.<br>Currently: ' + format(new Decimal(5).pow(getBuyableAmount('sp', 11))) + 'x<br>and ' + format(getBuyableAmount('sp', 11).add(1) ** -1) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' subatomic particles<br><br>Bought: ' + formatWhole(getBuyableAmount('sp', 11));
			},
		},
		12: {
			cost(x = 0) { return getBuyableAmount('sp', 12).add(1) },
			title() {
				return '<b class="layer-sp' + getdark(this, "title-buyable") + 'Neutrons';
			},
			canAfford() { return player.sp.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			purchaseLimit: 9,
			buy() {
				player.sp.points = player.sp.points.sub(this.cost());
				setBuyableAmount('sp', 12, getBuyableAmount('sp', 12).add(1));
			},
			display() {
				let text = '';
				if (player.nerdMode) {
					if (hasUpgrade('sp', 12)) text += '<br>formulas: 5^x^2 and (x+1)^-1';
					else text += '<br>formulas: 5^x and (x+1)^-1';
				};
				if (hasUpgrade('sp', 12)) return 'multiplies essence gain (but also decreases point gain at a reduced rate) based on the amount of this upgrade bought.<br>Currently: ' + format(new Decimal(5).pow(getBuyableAmount('sp', 12)).pow(2)) + 'x<br>and ' + format(getBuyableAmount('sp', 12).add(1) ** -1) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' subatomic particles<br><br>Bought: ' + formatWhole(getBuyableAmount('sp', 12));
				else return 'multiplies essence gain (but also decreases point gain at a reduced rate) based on the amount of this upgrade bought.<br>Currently: ' + format(new Decimal(5).pow(getBuyableAmount('sp', 12))) + 'x<br>and ' + format(getBuyableAmount('sp', 12).add(1) ** -1) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' subatomic particles<br><br>Bought: ' + formatWhole(getBuyableAmount('sp', 12));
			},
		},
		21: {
			cost(x = 0) { return getBuyableAmount('sp', 21).add(1) },
			title() {
				return '<b class="layer-sp' + getdark(this, "title-buyable") + 'Electrons';
			},
			canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			purchaseLimit: 9,
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost());
				setBuyableAmount('sp', 21, getBuyableAmount('sp', 21).add(1));
			},
			display() {
				let text = '';
				if (player.nerdMode) {
					if (hasUpgrade('sp', 13)) text += '<br>formulas: 5^x^2 and (x+1)^-1';
					else text += '<br>formulas: 5^x and (x+1)^-1';
				};
				if (hasUpgrade('sp', 13)) return 'multiplies point gain (but also decreases quark gain at a reduced rate) based on the amount of this upgrade bought.<br>Currently: ' + format(new Decimal(5).pow(getBuyableAmount('sp', 21)).pow(2)) + 'x<br>and ' + format(getBuyableAmount('sp', 21).add(1) ** -1) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' subatomic particles<br><br>Bought: ' + formatWhole(getBuyableAmount('sp', 21));
				else return 'multiplies point gain (but also decreases quark gain at a reduced rate) based on the amount of this upgrade bought.<br>Currently: ' + format(new Decimal(5).pow(getBuyableAmount('sp', 21))) + 'x<br>and ' + format(getBuyableAmount('sp', 21).add(1) ** -1) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' subatomic particles<br><br>Bought: ' + formatWhole(getBuyableAmount('sp', 21));
			},
		},
	},
});

addLayer('h', {
	name: 'Hexes',
	symbol: 'H',
	position: 0,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		auto_upgrades: false,
	}},
	color: "#E36409",
	branches: ['ds'],
	requires: 1e60,
	resource: 'hexes',
	baseResource: 'cores',
	baseAmount() { return player.c.points },
	type: 'normal',
	exponent: 0.5,
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade('h', 12)) {
			mult = mult.mul(upgradeEffect('h', 12));
			if (hasUpgrade('h', 22)) {
				mult = mult.mul(upgradeEffect('h', 22));
				if (hasUpgrade('h', 32)) {
					mult = mult.mul(upgradeEffect('h', 32));
					if (hasUpgrade('h', 42)) mult = mult.mul(upgradeEffect('h', 42));
		}}};
		if (hasUpgrade('h', 14)) mult = mult.mul(4);
		if (hasUpgrade('h', 62)) mult = mult.mul(upgradeEffect('h', 62));
		if (hasUpgrade('h', 11) && hasUpgrade('ds', 11)) mult = mult.mul(upgradeEffect('h', 11));
		if (hasUpgrade('p', 12)) mult = mult.mul(1.05);
		if (hasUpgrade('m', 23)) mult = mult.mul(upgradeEffect('m', 23));
		if (getBuyableAmount('ds', 11).gt(0)) mult = mult.mul(new Decimal(2).pow(getBuyableAmount('ds', 11)));
		if (hasChallenge('ds', 11)) mult = mult.mul(player.ds.points.add(1).pow(0.25));
		if (inChallenge('ds', 11)) mult = mult.mul(0.001);
		if (inChallenge('ds', 12)) mult = mult.mul(0.0000000001);
		if (inChallenge('ds', 21)) mult = mult.mul(0.00001);
		if (new Decimal(tmp.w.effect[0]).gt(1)) mult = mult.mul(tmp.w.effect[0]);
		return mult;
	},
	softcap: new Decimal('1e1000'),
	softcapPower: 0.5,
	row: 2,
	hotkeys: [
		{key: 'h', description: 'H: Reset for hexes', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return player.sp.unlocked || player.h.unlocked },
	passiveGeneration() {
		let gen = 0;
		if (hasMilestone('s', 9)) gen += 0.001;
		return gen;
	},
	automate() {
		if (hasMilestone('m', 1) && player.h.auto_upgrades) {
			for (const id in layers.h.upgrades) {
				if (layers.h.upgrades[id].unlocked) buyUpgrade('h', id);
			};
		};
	},
	doReset(resettingLayer) {
		if (challengeCompletions('r', 11) >= 27 && resettingLayer == 'r') return;
		if (hasMilestone('m', 13) && resettingLayer == 'm') return;
		if (hasMilestone('gi', 4) && resettingLayer == 'gi') return;
		let keep = ['auto_upgrades'];
			if (hasMilestone('ds', 8) && resettingLayer == 'ds') keep.push("milestones");
			if (hasMilestone('a', 6) && resettingLayer == 'a') keep.push("milestones");
			if (hasMilestone('a', 11) && (resettingLayer == 'a' || resettingLayer == 'ds')) keep.push("upgrades");
			if (layers[resettingLayer].row > this.row) layerDataReset('h', keep);
		},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"blank",
		"milestones",
		"upgrades",
	],
	milestones: {
		0: {
			requirementDescription: '5 hexes',
			effectDescription: 'keep essence upgrades on hex resets',
			done() { return player.h.points.gte(5) }
		},
		1: {
			requirementDescription: '25 hexes',
			effectDescription: 'keep essence rebuyables on hex resets',
			done() { return player.h.points.gte(25) }
		},
		2: {
			requirementDescription: '125 hexes',
			effectDescription: 'keep core upgrades on hex resets',
			done() { return player.h.points.gte(125) }
		},
		3: {
			requirementDescription: '625 hexes',
			effectDescription: 'keep core rebuyables on hex resets',
			done() { return player.h.points.gte(625) }
		},
		4: {
			requirementDescription: '3,125 hexes',
			effectDescription: 'keep core upgrades and rebuyables on subatomic particle resets',
			done() { return player.h.points.gte(3125) }
		},
		5: {
			requirementDescription: '15,625 hexes',
			effectDescription: 'keep all row 2 milestones on row 3 resets',
			done() { return player.h.points.gte(15625) }
		},
		6: {
			requirementDescription: '78,125 hexes',
			effectDescription: 'keep quark upgrades on subatomic particle resets',
			done() { return player.h.points.gte(78125) }
		},
		7: {
			requirementDescription: '390,625 hexes',
			effectDescription: 'keep quark upgrades on hex resets',
			done() { return player.h.points.gte(390625) }
		},
		8: {
			requirementDescription: '1,953,125 hexes',
			effectDescription: 'you can explore 3 further core upgrades',
			done() { return player.h.points.gte(1953125) }
		},
	},
	upgrades: {
		11: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Hex Leak';
			},
			description() {
				if (hasUpgrade('ds', 11)) return 'multiplies point and hex gain based on your hexes';
				return 'multiplies point gain based on your hexes';            
			},
			cost: 1,
			effect() {
			   return player.h.points.add(1).pow(0.005);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (hasUpgrade('ds', 11)) text += '<br>and ' + format(this.effect()) + 'x';
				if (player.nerdMode) {
					if (hasUpgrade('ds', 11)) text += ' <br>formula (for both): (x+1)^0.005';
					else text += ' <br>formula: (x+1)^0.005';
				};
				return text;
			},
		},
		12: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Stronger Hexes';
			},
			description: 'multiplies hex gain based on your hexes',
			cost: 5,
			effect() {
				if (hasUpgrade('ds', 12)) return player.h.points.add(1).pow(0.1).pow(2);
				else return player.h.points.add(1).pow(0.1);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) {
					if (hasUpgrade('ds', 12)) text += ' <br>formula: (x+1)^0.1^2';
					else text += ' <br>formula: (x+1)^0.1';
				};
				return text;
			},
		},
		13: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Hex Fusion';
			},
			description: 'multiplies core gain based on your hexes',
			cost: 10,
			effect() {
				return player.h.points.add(1).pow(0.09);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.09';
				return text;
			},
		},
		14: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Boost Hexes';
			},
			description: 'quadruples hex gain',
			cost: 25,
		},
		21: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Numerical Hexes';
			},
			description() {
				if (hasUpgrade('ds', 11)) return 'multiplies the first effect of <b class="layer-h' + getdark(this, "ref") + 'Hex Leak</b> based on your hexes';
				return 'multiplies the effect of <b class="layer-h' + getdark(this, "ref") + 'Hex Leak</b> based on your hexes';
			},
			cost: 1000,
			effect() {
				return player.h.points.add(1).pow(0.025);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.025';
				return text;
			},
			unlocked() { return hasUpgrade('h', 11) && hasUpgrade('h', 12) && hasUpgrade('h', 13) && hasUpgrade('h', 14) },
		},
		22: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Super Strong Hexes';
			},
			description() {
				return 'multiplies the effect of <b class="layer-h' + getdark(this, "ref") + 'Stronger Hexes</b> based on your hexes';            
			},
			cost: 5000,
			effect() {
				return player.h.points.add(1).pow(0.05);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.05';
				return text;
			},
			unlocked() { return hasUpgrade('h', 11) && hasUpgrade('h', 12) && hasUpgrade('h', 13) && hasUpgrade('h', 14) },
		},
		23: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Hex Fission';
			},
			description() {
				return 'multiplies the effect of <b class="layer-h' + getdark(this, "ref") + 'Hex Fusion</b> based on your hexes'
			},
			cost: 10000,
			effect() {
				return player.h.points.add(1).pow(0.15);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.15';
				return text;
			},
			unlocked() { return hasUpgrade('h', 11) && hasUpgrade('h', 12) && hasUpgrade('h', 13) && hasUpgrade('h', 14) },
		},
		24: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Boost Cores';
			},
			description: 'triples core gain',
			cost: 25000,
			unlocked() { return hasUpgrade('h', 11) && hasUpgrade('h', 12) && hasUpgrade('h', 13) && hasUpgrade('h', 14) },
		},
		31: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Hex Numerals';
			},
			description() {
				return 'multiplies the effect of <b class="layer-h' + getdark(this, "ref") + 'Numerical Hexes</b> based on your points'
			},
			cost: 100000,
			effect() {
				return player.points.add(1).pow(0.002);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.002';
				return text;
			},
			unlocked() { return hasUpgrade('h', 21) && hasUpgrade('h', 22) && hasUpgrade('h', 23) && hasUpgrade('h', 24) },
		},
		32: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Extreme Hexes';
			},
			description() {
				return 'multiplies the effect of <b class="layer-h' + getdark(this, "ref") + 'Super Strong Hexes</b> based on your hexes'
			},
			cost: 500000,
			effect() {
				return player.h.points.add(1).pow(0.01);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasUpgrade('h', 21) && hasUpgrade('h', 22) && hasUpgrade('h', 23) && hasUpgrade('h', 24) },
		},
		33: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Core of Hexes';
			},
			description() {
				return 'multiplies the effect of <b class="layer-h' + getdark(this, "ref") + 'Hex Fission</b> based on your cores';
			},
			cost: 1000000,
			effect() {
				return player.h.points.add(1).pow(0.025);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.025';
				return text;
			},
			unlocked() { return hasUpgrade('h', 21) && hasUpgrade('h', 22) && hasUpgrade('h', 23) && hasUpgrade('h', 24) },
		},
		34: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Boost Quarks';
			},
			description: 'doubles quark gain',
			cost: 2500000,
			unlocked() { return hasUpgrade('h', 21) && hasUpgrade('h', 22) && hasUpgrade('h', 23) && hasUpgrade('h', 24) },
		},
		41: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Numero Hex';
			},
			description() {
				return 'multiplies the effect of <b class="layer-h' + getdark(this, "ref") + 'Hex Numerals</b> based on your hexes';
			},
			cost: 7500000,
			effect() {
				return player.points.add(1).pow(0.0001);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.0001';
				return text;
			},
			unlocked() { return hasUpgrade('h', 31) && hasUpgrade('h', 32) && hasUpgrade('h', 33) && hasUpgrade('h', 34) },
		},
		42: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Ultra Hexes';
			},
			description() {
				return 'multiplies the effect of <b class="layer-h' + getdark(this, "ref") + 'Extreme Hexes</b> based on your hexes';
			},
			cost: 15000000,
			effect() {
				return player.h.points.add(1).pow(0.001);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.001';
				return text;
			},
			unlocked() { return hasUpgrade('h', 31) && hasUpgrade('h', 32) && hasUpgrade('h', 33) && hasUpgrade('h', 34) },
		},
		43: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Core Continuation';
			},
			description: 'gains 1% of core gain per second',
			cost: 45000000,
			unlocked() { return hasUpgrade('h', 31) && hasUpgrade('h', 32) && hasUpgrade('h', 33) && hasUpgrade('h', 34) },
		},
		44: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Rapid Cores';
			},
			description() {
				return 'increases the effect of <b class="layer-h' + getdark(this, "ref") + 'Core Continuation</b> by 9% (total: 10%)';
			},
			cost: 75000000,
			unlocked() { return hasUpgrade('h', 31) && hasUpgrade('h', 32) && hasUpgrade('h', 33) && hasUpgrade('h', 34) },
		},
		51: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Faster Essence';
			},
			description() {
				return 'increases essence gain per second by 25% if you have the <b class="layer-c' + getdark(this, "ref") + '4th core milestone</b> (total: 75%)';
			},
			cost: 9e90,
			unlocked() { return hasUpgrade('ds', 11) && hasUpgrade('h', 41) && hasUpgrade('h', 42) && hasUpgrade('h', 43) && hasUpgrade('h', 44) },
		},
		52: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Core Production Line';
			},
			description() {
				return 'increases the effect of <b class="layer-h' + getdark(this, "ref") + 'Rapid Cores</b> by 15% (total: 25%)';
			},
			cost: 250000000,
			unlocked() { return hasUpgrade('h', 41) && hasUpgrade('h', 42) && hasUpgrade('h', 43) && hasUpgrade('h', 44) },
		},
		53: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Sub Core Particle Fusion';
			},
			description: 'you can explore 3 new core upgrades and 3 new subatomic particle upgrades',
			cost: 7.5e9,
			unlocked() { return hasUpgrade('h', 41) && hasUpgrade('h', 42) && hasUpgrade('h', 43) && hasUpgrade('h', 44) },
		},
		54: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Fastest Essence';
			},
			description() {
				return 'increases the effect of <b class="layer-h' + getdark(this, "ref") + 'Faster Essence</b> by 25% (total: 100%)';
			},
			cost: 9.5e95,
			unlocked() { return hasUpgrade('ds', 11) && hasUpgrade('h', 41) && hasUpgrade('h', 42) && hasUpgrade('h', 43) && hasUpgrade('h', 44) },
		},
		61: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Essence Overdrive';
			},
			description() {
				return 'increases the effect of <b class="layer-h' + getdark(this, "ref") + 'Fastest Essence</b> by 25% (total: 125%)';
			},
			cost: 1.00e100,
			unlocked() { return hasUpgrade('ds', 12) && hasUpgrade('h', 51) && hasUpgrade('h', 52) && hasUpgrade('h', 53) && hasUpgrade('h', 54) },
		},
		62: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Sub Hex Particle';
			},
			description: 'multiplies hex gain based on your subatomic particles',
			cost: 1.00e50,
			effect() {
				return player.sp.points.add(1).pow(2.5);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^2.5';
				return text;
			},
			unlocked() { return hasUpgrade('h', 52) && hasUpgrade('h', 53) },
		},
		63: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Hexed Subatomic Particle';
			},
			description: 'multiplies subatomic particle gain based on your hexes',
			cost: 6.66e66,
			effect() {
				return player.h.points.add(1).pow(0.02);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.02';
				return text;
			},
			unlocked() { return hasUpgrade('h', 52) && hasUpgrade('h', 53) },
		},
		64: {
			title() {
				return '<b class="layer-h' + getdark(this, "title") + 'Potential Essence Potential';
			},
			description() {
				return 'increases the effect of <b class="layer-h' + getdark(this, "ref") + 'Essence Overdrive</b> by 25% (total: 150%)';
			},
			cost: 1.11e111,
			unlocked() { return hasUpgrade('ds', 12) && hasUpgrade('h', 51) && hasUpgrade('h', 52) && hasUpgrade('h', 53) && hasUpgrade('h', 54) },
		},
	},
});

addLayer('ds', {
	name: 'Demon Souls',
	symbol: 'DS',
	position: 0,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		auto_upgrades: false,
		auto_buyables: false,
	}},
	color: "#BA0035",
	branches: ['ei'],
	requires: 1e60,
	resource: 'demon souls',
	baseResource: 'hexes',
	baseAmount() { return player.h.points },
	type: 'normal',
	exponent: 0.05,
	gainMult() {
		// init
		let mult = new Decimal(1);
		// mul
		if (hasUpgrade('a', 11)) mult = mult.mul(upgradeEffect('a', 11));
		if (hasUpgrade('a', 42)) mult = mult.mul(upgradeEffect('a', 42));
		if (hasUpgrade('a', 71)) mult = mult.mul(upgradeEffect('a', 71));
		if (hasUpgrade('m', 12)) mult = mult.mul(upgradeEffect('m', 12));
		if (hasUpgrade('m', 33)) mult = mult.mul(upgradeEffect('m', 33));
		if (hasChallenge('ds', 11)) mult = mult.mul(player.ds.points.add(1).pow(0.25));
		if (hasChallenge('ds', 12)) mult = mult.mul(player.h.points.add(1).pow(0.02));
		if (new Decimal(tmp.w.effect[0]).gt(1)) mult = mult.mul(tmp.w.effect[0]);
		// pow
		if (getBuyableAmount('cl', 12).gt(0)) mult = mult.pow(buyableEffect('cl', 12)[0]);
		// return
		return mult;
	},
	row: 3,
	hotkeys: [
		{key: 'd', description: 'D: Reset for demon souls', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return player.h.unlocked || player.ds.unlocked },
	passiveGeneration() {
		let gen = 0;
		if (hasMilestone('s', 10)) gen += 0.00001;
		return gen;
	},
	automate() {
		if (hasMilestone('m', 5) && player.ds.auto_upgrades) {
			buyUpgrade('ds', 11);
			buyUpgrade('ds', 12);
			if (hasUpgrade('ds', 11) && hasUpgrade('ds', 12)) {
				buyUpgrade('ds', 21);
				buyUpgrade('ds', 22);
				if (hasUpgrade('ds', 21)) buyUpgrade('ds', 23);
				if (hasUpgrade('ds', 23)) buyUpgrade('ds', 24);
			};
		};
		if (hasMilestone('m', 6) && player.ds.auto_buyables) {
			if (layers.ds.buyables[11].canAfford()) {
				layers.ds.buyables[11].buy();
			};
		};
	},
	doReset(resettingLayer) {
		if (hasMilestone('m', 14) && resettingLayer == 'm') return;
		if (hasMilestone('gi', 5) && resettingLayer == 'gi') return;
		let keep = ['auto_upgrades', 'auto_buyables'];
		let saveupg = [];
			if (hasMilestone('m', 1) && (resettingLayer == 'm' || resettingLayer == 'gi' || resettingLayer == 'ei')) {
				keep.push("challenges");
				saveupg.push(22);
			};
			if (hasMilestone('w', 4) && resettingLayer == 'w') keep.push("challenges");
			if (hasMilestone('cl', 3) && resettingLayer == 'cl') keep.push("challenges");
			if (layers[resettingLayer].row > this.row) {
				layerDataReset('ds', keep);
				player[this.layer].upgrades = saveupg;
			};
		},
	tabFormat: {
		"Demonic Curses": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				"milestones",
				"buyables",
				"blank",
				"upgrades",
			],
		},
		"Demon Gateway": {
			content: function() {
				if (this.unlocked) return [
					"main-display",
					"prestige-button",
					"resource-display",
					"blank",
					"blank",
					"challenges",
					"blank",
				];
				return [
					"main-display",
					"prestige-button",
					"resource-display",
					"blank",
					"milestones",
					"buyables",
					"blank",
					"upgrades",
				];
			},
			unlocked() {
				return hasUpgrade('ds', 22);
			},
		},
	},
	milestones: {
		0: {
			requirementDescription: '1 demon soul',
			effectDescription: 'keep subatomic particle rebuyables on demon soul resets',
			done() { return player.ds.points.gte(1) }
		},
		1: {
			requirementDescription: '5 demon souls',
			effectDescription: 'keep subatomic particle upgrades on demon soul resets',
			done() { return player.ds.points.gte(5) }
		},
		2: {
			requirementDescription: '15 demon souls',
			effectDescription: 'keep row 2 milestones on demon soul resets',
			done() { return player.ds.points.gte(15) }
		},
		3: {
			requirementDescription: '50 demon souls',
			effectDescription: 'keep essence upgrades on all resets',
			done() { return player.ds.points.gte(50) }
		},
		4: {
			requirementDescription: '125 demon souls',
			effectDescription: 'keep essence rebuyables on all resets',
			done() { return player.ds.points.gte(125) }
		},
		5: {
			requirementDescription: '625 demon souls',
			effectDescription: 'keep core upgrades on demon soul resets',
			done() { return player.ds.points.gte(625) }
		},
		6: {
			requirementDescription: '3,125 demon souls',
			effectDescription: 'keep core rebuyables on demon soul resets',
			done() { return player.ds.points.gte(3125) }
		},
		7: {
			requirementDescription: '1e10 demon souls',
			effectDescription: 'keep quark upgrades on demon soul resets',
			done() { return player.ds.points.gte(1e10) }
		},
		8: {
			requirementDescription: '1e14 demon souls',
			effectDescription: 'keep hex milestones on demon soul resets',
			done() { return player.ds.points.gte(1e14) }
		},
	},
	upgrades: {
		11: {
			title() {
				return '<b class="layer-ds' + getdark(this, "title") + 'Mad Hexes';
			},
			description() {
				return 'you can explore 2 further hex upgrades, and <b class="layer-h' + getdark(this, "ref", true, true) + 'Hex Leak</b> also applies to hex gain (and not any other upgrades in the chain)';
			},
			cost: 10,
		},
		12: {
			title() {
				return '<b class="layer-ds' + getdark(this, "title") + 'Hex Mania';
			},
			description() {
				return 'you can explore 2 further hex upgrades, and <b class="layer-h' + getdark(this, "ref", true, true) + 'Stronger Hexes</b>\' effect is squared';
			},
			cost: 75,
		},
		21: {
			title() {
				return '<b class="layer-ds' + getdark(this, "title") + 'Hall of Fame';
			},
			description() {
				let text = 'achievements also multiply essence gain';
				if (player.nerdMode) text += ' <br>formula: x*0.2';
				return text;
			},
			cost: 5000,
			unlocked() { return hasUpgrade('ds', 11) && hasUpgrade('ds', 12) }
		},
		22: {
			title() {
				return '<b class="layer-ds' + getdark(this, "title") + 'Demonic Key';
			},
			description() {
				return 'unlocks the <b class="layer-ds' + getdark(this, "ref") + 'Demon Gateway</b>';
			},
			cost: 100000,
			unlocked() { return hasUpgrade('ds', 11) && hasUpgrade('ds', 12) }
		},
		23: {
			title() {
				return '<b class="layer-ds' + getdark(this, "title") + 'Trophy of Glory';
			},
			description() {
				let text = 'achievements also multiply core and quark gain if you own <b class="layer-ds' + getdark(this, "ref") + 'Hall of Fame';
				if (player.nerdMode) text += '</b> <br>formula: x^2/100';
				return text;
			},
			cost: 2500000,
			unlocked() { return hasUpgrade('ds', 11) && hasUpgrade('ds', 12) && hasUpgrade('ds', 21) }
		},
		24: {
			title() {
				return '<b class="layer-ds' + getdark(this, "title") + 'Buried History';
			},
			description() {
				let text = 'achievements boosting point gain uses a better formula if you own <b class="layer-ds' + getdark(this, "ref") + 'Hall of Fame';
				if (player.nerdMode) text += '</b> <br>formula: x*0.2';
				return text;
			},
			cost: 1.11e11,
			unlocked() { return hasUpgrade('ds', 11) && hasUpgrade('ds', 12) && hasUpgrade('ds', 23) }
		},
	},
	buyables: {
		11: {
			cost(x = 0) {
				if (x == 0) return new Decimal(2).pow(getBuyableAmount('ds', 11)).add(1);
				return new Decimal(2).pow(getBuyableAmount('ds', 11).add(x)).add(1);
			},
			title() {
				return '<h3 class="layer-ds' + getdark(this, "title-buyable") + 'Demonic Energy';
			},
			canAfford() {
				return player.ds.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit);
			},
			purchaseLimit: 22,
			buy() {
				player.ds.points = player.ds.points.sub(this.cost());
				setBuyableAmount('ds', 11, getBuyableAmount('ds', 11).add(1));
			},
			display() {
				let text = '';
				if (player.nerdMode) text = '<br>formulas: 2^x and x*5+1';
				return 'multiplies hex gain (and also subatomic particle gain at a reduced rate) based on the amount of this upgrade bought.<br>Currently: ' + format(new Decimal(2).pow(getBuyableAmount('ds', 11))) + 'x<br>and ' + format(getBuyableAmount('ds', 11).mul(5).add(1)) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' demon souls<br><br>Bought: ' + formatWhole(getBuyableAmount('ds', 11));
			},
		},
	},
	challenges: {
		11: {
			name() {
				if (colorvalue[0][1]) return '<h3 class="layer-ds">Blazing Curse';
				return '<h3>Blazing Curse';
			},
			challengeDescription: " - Forces a Demon Soul reset<br> - Quark gain is divided by 100,000<br> - Point gain is divided by 10,000<br> - Hex gain is divided by 1,000<br> - Core gain is divided by 100<br> - Quark gain is divided by 10",
			goalDescription() {
				if (colorvalue[0][2]) {
					if (hasChallenge('ds', this.id)) return '<b class="layer-h">Potential Essence Potential';
					return '<b class="layer-h-dark">Potential Essence Potential';
				};
				return '<b>Potential Essence Potential';
			},
			canComplete() { return hasUpgrade('h', 64) },
			rewardDescription: "multiplies hex and demon soul gain based on your demon souls",
			rewardDisplay() {
				text = format(player.ds.points.add(1).pow(0.25)) + 'x';
				if (player.nerdMode) text += '<br>formula: (x+1)^0.25';
				return text;
			},
			doReset: true,
		},
		12: {
			name() {
				if (colorvalue[0][1]) return '<h3 class="layer-ds">Hellfire';
				return '<h3>Hellfire';
			},
			challengeDescription: " - Forces a Demon Soul reset<br> - Point gain is divided by 1,000,000<br> - Hex gain is divided by 1e10<br> - Subatomic Particle gain is divided by the number of Quarks",
			goalDescription() {
				if (colorvalue[0][2]) {
					if (hasChallenge('ds', this.id)) return '<b class="layer-h">Sub Core Particle Fusion';
					return '<b class="layer-h-dark">Sub Core Particle Fusion';
				};
				return '<b>Sub Core Particle Fusion';
			},
			canComplete() { return hasUpgrade('h', 63) },
			unlocked() { return hasChallenge('ds', 11) },
			rewardDescription: "multiply demon soul gain based on your hexes",
			rewardDisplay() {
				text = format(player.h.points.add(1).pow(0.02)) + 'x';
				if (player.nerdMode) text += '<br>formula: (x+1)^0.02';
				return text;
			},
			doReset: true,
		},
		21: {
			name() {
				if (colorvalue[0][1]) return '<h3 class="layer-ds">Opposite Polarity';
				return '<h3>Opposite Polarity';
			},
			challengeDescription: " - Forces a Demon Soul reset<br> - Hex gain is divided by 100,000<br> - Point gain is divided by 1e10<br> - Core gain is divided by 1e15<br> - Essence gain is divided by 1e20",
			goalDescription() {
				if (colorvalue[0][2]) {
					if (hasChallenge('ds', this.id)) return '<b class="layer-h">Sub Core Particle Fusion';
					return '<b class="layer-h-dark">Sub Core Particle Fusion';
				};
				return '<b>Sub Core Particle Fusion';
			},
			canComplete() { return hasUpgrade('h', 53) },
			unlocked() { return hasChallenge('ds', 12) },
			rewardDescription: "multiply subatomic particle<br>gain based on your demon souls",
			rewardDisplay() {
				text = format(player.ds.points.add(1).pow(0.2)) + 'x';
				if (player.nerdMode) text += '<br>formula: (x+1)^0.2';
				return text;
			},
			doReset: true,
		},
		22: {
			name() {
				if (colorvalue[0][1]) return '<h3 class="layer-ds">Dreaded Science';
				return '<h3>Dreaded Science';
			},
			challengeDescription: " - Forces a Demon Soul reset<br> - Point gain is divided by 1e10<br> - Quark and Subatomic Particle gain is divided by 1e40",
			goalDescription() {
				if (colorvalue[0][2]) return '<b class="layer-a">Famed Atom\'s Donations';
				return '<b>Famed Atom\'s Donations';
			},
			canComplete() { return hasUpgrade('a', 51) },
			unlocked() { return hasMilestone('a', 7) },
			rewardDescription: "multiply atom gain by 1.5",
			doReset: true,
		},
	},
});

addLayer('a', {
	name: 'Atoms',
	symbol: 'A',
	position: 2,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		auto_upgrades: false,
	}},
	color: "#4D2FE0",
	branches: ['m'],
	requires: 1000,
	resource: 'atoms',
	baseResource: 'subatomic particles',
	baseAmount() { return player.sp.points },
	type: 'static',
	exponent: 1,
	canBuyMax() { return true },
	gainExp() {
		let gain = new Decimal(1);
		if (hasUpgrade('a', 22)) gain = gain.mul(upgradeEffect('a', 22));
		if (hasUpgrade('a', 32)) gain = gain.mul(upgradeEffect('a', 32));
		if (hasUpgrade('a', 33)) gain = gain.mul(upgradeEffect('a', 33));
		if (hasUpgrade('a', 61)) gain = gain.mul(upgradeEffect('a', 61));
		if (hasUpgrade('a', 62)) gain = gain.mul(upgradeEffect('a', 62));
		if (hasUpgrade('a', 72)) gain = gain.mul(upgradeEffect('a', 72));
		if (hasChallenge('ds', 22)) gain = gain.mul(1.5);
		if (tmp.m.effect.gt(1)) gain = gain.mul(tmp.m.effect);
		if (new Decimal(tmp.w.effect[1]).gt(1)) gain = gain.mul(tmp.w.effect[1]);
		if (getBuyableAmount('cl', 11).gt(0)) gain = gain.mul(buyableEffect('cl', 11)[1]);
		return gain;
	},
	autoPrestige() { return hasMilestone('a', 15) },
	row: 3,
	hotkeys: [
		{key: 'a', description: 'A: Reset for atoms', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return player.ds.unlocked || player.a.unlocked },
	automate() {
		if (hasMilestone('gi', 11) && player.a.auto_upgrades) {
			for (const id in layers.a.upgrades) {
				if (layers.a.upgrades[id].unlocked) buyUpgrade('a', id);
			};
		};
	},
	doReset(resettingLayer) {
		if (hasMilestone('ei', 4) && resettingLayer == 'ei') return;
		let keep = ['auto_upgrades'];
			if (layers[resettingLayer].row == this.row) {
				keep.push("milestones", "points", "best", "total");
				if (hasMilestone('a', 12)) keep.push("upgrades");
			};
			if (hasMilestone('m', 12) && resettingLayer == 'm') keep.push("milestones");
			if (layers[resettingLayer].row >= this.row) layerDataReset('a', keep);
		},
	resetsNothing() { return hasMilestone('a', 14) },
	tabFormat: {
		"Atomic Progress": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				"milestones",
			],
		},
		"Atomic Tree": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				["display-text",
					function() {
						let text = 'When you buy one of these upgrades, you cannot buy<br>any upgrades that are not on its path. When you<br>do a row 4 reset, all atom upgrades will be reset.';
						if (hasMilestone('a', 10)) text += '<br><br>From the effect of the <b class="layer-a' + getdark(this, "ref", true, true) + '11th atom milestone</b>:<br>you can buy all atom upgrades.';
						if (hasMilestone('a', 12)) text += '<br><br>From the effect of the <b class="layer-a' + getdark(this, "ref", true, true) + '13th atom milestone:</b><br>row 4 resets do not reset atom upgrades.';
						return text;
					}],
				"blank",
				["upgrades", [1]],
				"blank",
				["upgrades", [2]],
				"blank",
				["upgrades", [3]],
				"blank",
				["upgrades", [4]],
				"blank",
				["upgrades", [5]],
				"blank",
				["upgrades", [6]],
				"blank",
				["upgrades", [7]],
			],
		},
	},
	milestones: {
		0: {
			requirementDescription: '1 atom',
			effectDescription: 'keep subatomic particle rebuyables on atom resets',
			done() { return player.a.points.gte(1) }
		},
		1: {
			requirementDescription: '2 atoms',
			effectDescription: 'keep core rebuyables on atom resets',
			done() { return player.a.points.gte(2) }
		},
		2: {
			requirementDescription: '3 atoms',
			effectDescription: 'keep core upgrades on atom resets',
			done() { return player.a.points.gte(3) }
		},
		3: {
			requirementDescription: '4 atoms',
			effectDescription: 'keep subatomic particle upgrades on atom resets',
			done() { return player.a.points.gte(4) }
		},
		4: {
			requirementDescription: '5 atoms',
			effectDescription: 'keep core milestones on atom resets',
			done() { return player.a.points.gte(5) }
		},
		5: {
			requirementDescription: '6 atoms',
			effectDescription: 'keep quark milestones on atom resets',
			done() { return player.a.points.gte(6) }
		},
		6: {
			requirementDescription: '7 atoms',
			effectDescription: 'keep hex milestones on atom resets',
			done() { return player.a.points.gte(7) }
		},
		7: {
			requirementDescription: '8 atoms & 45 total atoms',
			effectDescription: 'unlock a new demon soul challenge',
			done() { return player.a.points.gte(8) && player.a.total.gte(45) }
		},
		8: {
			requirementDescription: '10 atoms &  75 total atoms',
			effectDescription: 'gain 1% of quark gain per second',
			done() { return player.a.points.gte(10) && player.a.total.gte(75) }
		},
		9: {
			requirementDescription: '25 atoms &  125 total atoms',
			effectDescription: 'gain +9% of quark gain per second (total: 10%)',
			done() { return player.a.points.gte(25) && player.a.total.gte(125) }
		},
		10: {
			requirementDescription: '40 atoms & 175 total atoms',
			effectDescription: 'you can buy upgrades that are not on the other\'s paths',
			done() { return player.a.points.gte(40) && player.a.total.gte(175) }
		},
		11: {
			requirementDescription: '200 atoms & 500 total atoms',
			effectDescription: 'keep hex upgrades on row 4 resets',
			done() { return player.a.points.gte(200) && player.a.total.gte(500) }
		},
		12: {
			requirementDescription: '750 atoms and 1,000 total atoms',
			effectDescription: 'keep atom upgrades on row 4 resets',
			done() { return player.a.points.gte(750) && player.a.total.gte(1000) }
		},
		13: {
			requirementDescription: '1,000 atoms and 1,500 total atoms',
			effectDescription: 'keep subatomic particle milestones on atom resets',
			done() { return player.a.points.gte(1000) && player.a.total.gte(1500) }
		},
		14: {
			requirementDescription: '10,000 atoms and 1e600 prayers',
			effectDescription: 'atoms reset nothing',
			done() { return player.a.points.gte(10000) && player.p.points.gte("1e600") },
			unlocked() { return hasMilestone('a', 13) && player.r.points.gt(0) }
		},
		15: {
			requirementDescription: '18,000 atoms and 40 sanctums',
			effectDescription: 'perform atom resets automatically',
			done() { return player.a.points.gte(18000) && player.s.points.gte(40) && hasMilestone('a', 14) },
			unlocked() { return hasMilestone('a', 14) && player.r.points.gt(0) }
		},
	},
	upgrades: {
		11: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'The Demon of the Atom';
			},
			description() {
				if (hasMilestone('m', 11)) return 'multiplies demon soul gain by 1,000x';
				return 'multiplies demon soul gain based on your atoms';
			},
			cost: 1,
			effect() {
				eff = player.a.points.add(1).pow(0.5);
				hardcap = new Decimal(1000);
				if (eff.gt(hardcap) || hasMilestone('m', 11)) return hardcap;
				return eff;
			},
			effectDisplay() {
				if (hasMilestone('m', 11)) return 'max effect';
				if (this.effect().gte(1000)) text = format(this.effect()) + 'x<br>(hardcapped)';
				else text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.5';
				return text;
			},
			branches: [21, 22],
		},
		21: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Decaying Atoms';
			},
			description: 'multiplies subatomic particle gain based on your best atoms',
			cost: 1,
			effect() {
				return player.a.best.add(1).pow(1.25);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^1.25';
				return text;
			},
			branches: [31, 32],
			unlocked() {
				return !hasUpgrade('a', 22) && !hasUpgrade('a', 33) || hasMilestone('a', 10);
			},
		},
		22: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Atom Construction';
			},
			description() {
				if (hasMilestone('m', 11)) return 'multiplies atom gain by 2.50x';
				return 'multiplies atom gain based on your subatomic particles';
			},
			cost: 1,
			effect() {
				eff = player.sp.points.add(1).pow(0.02);
				hardcap = new Decimal(2.5);
				if (eff.gt(hardcap) || hasMilestone('m', 11)) return hardcap;
				return eff;
			},
			effectDisplay() {
				if (hasMilestone('m', 11)) return 'max effect';
				if (this.effect().gte(2.5)) text = format(this.effect()) + 'x<br>(hardcapped)';
				else text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.2';
				return text;
			},
			branches: [32, 33],
			unlocked() {
				return !hasUpgrade('a', 21) && !hasUpgrade('a', 31) || hasMilestone('a', 10);
			},
		},
		31: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Decayed Atoms';
			},
			description: 'multiplies subatomic particle gain based on your total atoms',
			cost: 2,
			effect() {
				return player.a.total.add(1).pow(1.05);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^1.05';
				return text;
			},
			branches: [41],
			unlocked() {
				return !hasUpgrade('a', 22) && !hasUpgrade('a', 32) && !hasUpgrade('a', 33) && !hasUpgrade('a', 42) || hasMilestone('a', 10);
			},
		},
		32: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Atomic Recursion';
			},
			description() {
				if (hasMilestone('m', 11)) return 'multiplies atom gain by 2.25x';
				return 'multiplies atom gain based on your total atoms';
			},
			cost: 2,
			effect() {
				eff = player.a.total.add(1).pow(0.05);
				hardcap = new Decimal(2.25);
				if (eff.gt(hardcap) || hasMilestone('m', 11)) return hardcap;
				return eff;
			},
			effectDisplay() {
				if (hasMilestone('m', 11)) return 'max effect';
				if (this.effect().gte(2.25)) text = format(this.effect()) + 'x<br>(hardcapped)';
				else text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.05';
				return text;
			},
			branches: [41, 42],
			unlocked() {
				return !hasUpgrade('a', 31) && !hasUpgrade('a', 33) || hasMilestone('a', 10);
			},
		},
		33: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Atom Production';
			},
			description() {
				if (hasMilestone('m', 11)) return 'multiplies atom gain by 3.15x';
				return 'multiplies atom gain based on your subatomic particles';
			},
			cost: 2,
			effect() {
				eff = player.sp.points.add(1).pow(0.025);
				hardcap = new Decimal(3.15);
				if (eff.gt(hardcap) || hasMilestone('m', 11)) return hardcap;
				return eff;
			},
			effectDisplay() {
				if (hasMilestone('m', 11)) return 'max effect';
				if (this.effect().gte(3.15)) text = format(this.effect()) + 'x<br>(hardcapped)';
				else text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.025';
				return text;
			},
			branches: [42],
			unlocked() {
				return !hasUpgrade('a', 21) && !hasUpgrade('a', 31) && !hasUpgrade('a', 32) && !hasUpgrade('a', 41) || hasMilestone('a', 10);
			},
		},
		41: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Atom Revenants';
			},
			description: 'multiplies quark gain based on your total atoms minus your current atoms',
			cost: 2,
			effect() {
				return player.a.total.sub(player.a.points).add(1).pow(0.75);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x-y+1)^0.75';
				return text;
			},
			branches: [51],
			unlocked() {
				return !hasUpgrade('a', 33) && !hasUpgrade('a', 42) || hasMilestone('a', 10);
			},
		},
		42: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'The Fallen';
			},
			description: 'multiplies demon soul gain based on your best atoms minus your current atoms',
			cost: 2,
			effect() {
				return player.a.best.mul(1.5).sub(player.a.points).pow(1.05);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula:<br>(x*1.5-y)^1.05';
				return text;
			},
			branches: [51],
			unlocked() {
				return !hasUpgrade('a', 31) && !hasUpgrade('a', 41) || hasMilestone('a', 10);
			},
		},
		51: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Famed Atoms\' Donations';
			},
			description() {
				let text = 'multiplies subatomic particle gain based on your number of achievements';
				if (player.nerdMode) text += ' <br>formula: x^1.25';
				return text;
			},
			cost: 3,
			branches: [61, 62],
			unlocked() { return true },
		},
		61: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Unpeaked';
			},
			description() {
				if (hasMilestone('m', 11)) return 'multiplies atom gain by 15.00x';
				return 'multiplies atom gain based on your total atoms minus your best atoms';
			},
			cost: 3,
			effect() {
				eff = player.a.total.sub(player.a.best).add(1).pow(0.2);
				hardcap = new Decimal(15);
				if (eff.gt(hardcap) || hasMilestone('m', 11)) return hardcap;
				return eff;
			},
			effectDisplay() {
				if (hasMilestone('m', 11)) return 'max effect';
				if (this.effect().gte(15)) text = format(this.effect()) + 'x<br>(hardcapped)';
				else text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x-y+1)^0.2';
				return text;
			},
			branches: [71, 72],
			unlocked() {
				return !hasUpgrade('a', 62) && !hasUpgrade('a', 73) || hasMilestone('a', 10);
			},
		},
		62: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Higher Peak';
			},
			description() {
				if (hasMilestone('m', 11)) return 'multiplies atom gain by 6.66x';
				return 'multiplies atom gain based on your total atoms times your current atoms';
			},
			cost: 3,
			effect() {
				eff = player.a.total.mul(player.a.points).pow(0.05).add(1);
				hardcap = new Decimal(6.66);
				if (eff.gt(hardcap) || hasMilestone('m', 11)) return hardcap;
				return eff;
			},
			effectDisplay() {
				if (hasMilestone('m', 11)) return 'max effect';
				if (this.effect().gte(6.66)) text = format(this.effect()) + 'x<br>(hardcapped)';
				else text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x*y)^0.05+1';
				return text;
			},
			branches: [72, 73],
			unlocked() {
				return !hasUpgrade('a', 61) && !hasUpgrade('a', 71) || hasMilestone('a', 10);
			},
		},
		71: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Demons Inside';
			},
			description: 'multiplies demon soul gain based on your best atoms times your current atoms',
			cost: 4,
			effect() {
				return player.a.best.mul(player.a.points).mul(2.5).pow(0.15);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x*y*2.5)^0.15';
				return text;
			},
			unlocked() {
				return !hasUpgrade('a', 62) && !hasUpgrade('a', 72) && !hasUpgrade('a', 73) || hasMilestone('a', 10);
			},
		},
		72: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Recurred, Recurring';
			},
			description() {
				if (hasMilestone('m', 11)) return 'multiplies atom gain by 5.00x';
				return 'multiplies atom gain based on your total atoms';
			},
			cost: 4,
			effect() {
				eff = player.a.total.add(1).pow(0.1);
				hardcap = new Decimal(5);
				if (eff.gt(hardcap) || hasMilestone('m', 11)) return hardcap;
				return eff;
			},
			effectDisplay() {
				if (hasMilestone('m', 11)) return 'max effect';
				if (this.effect().gte(5)) text = format(this.effect()) + 'x<br>(hardcapped)';
				else text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.1';
				return text;
			},
			unlocked() {
				return !hasUpgrade('a', 71) && !hasUpgrade('a', 73) || hasMilestone('a', 10);
			},
		},
		73: {
			title() {
				return '<b class="layer-a' + getdark(this, "title") + 'Atomic Essence';
			},
			description: 'multiplies essence gain based on your atoms',
			cost: 4,
			effect() {
				return player.a.points.add(1).pow(1.75);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^1.75';
				return text;
			},
			unlocked() {
				return !hasUpgrade('a', 61) && !hasUpgrade('a', 71) && !hasUpgrade('a', 72) || hasMilestone('a', 10);
			},
		},
	},
});

addLayer('p', {
	name: 'Prayers',
	symbol: 'P',
	position: 1,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		divinity: new Decimal(0),
		holiness: new Decimal(0),
		hymn: new Decimal(0),
		hymnEff: new Decimal(0),
		auto_upgrades: false,
		smart_auto_upgrades: false,
	}},
	color: "#FDBBFF",
	branches: ['s'],
	requires: new Decimal('1e1000'),
	resource: 'prayers',
	baseResource: 'essence',
	baseAmount() { return player.e.points },
	type: 'normal',
	exponent: 0.012,
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade('p', 15)) mult = mult.mul(upgradeEffect('p', 15));
		if (hasUpgrade('p', 21)) mult = mult.mul(upgradeEffect('p', 21));
		if (hasUpgrade('ds', 21) && hasUpgrade('ds', 23) && hasUpgrade('ds', 24) && hasUpgrade('p', 31)) mult = mult.mul(player.A.points.pow(2).div(100));
		if (hasUpgrade('p', 41)) mult = mult.mul(player.p.hymnEff);
		if (hasUpgrade('p', 62)) {
			mult = mult.mul(upgradeEffect('p', 62));
			if (hasUpgrade('p', 63)) mult = mult.mul(upgradeEffect('p', 63));
		};
		if (hasUpgrade('p', 73)) mult = mult.mul(upgradeEffect('p', 73));
		if (tmp.gi.effect.gt(1)) mult = mult.mul(tmp.gi.effect);
		if (new Decimal(tmp.w.effect[0]).gt(1)) mult = mult.mul(tmp.w.effect[0]);
		return mult;
	},
	row: 1,
	hotkeys: [
		{key: 'p', description: 'P: Reset for prayers', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return player.a.unlocked || player.p.unlocked },
	passiveGeneration() {
		let gen = 0;
		if (hasMilestone('s', 7)) {
			gen += 0.005;
			if (hasMilestone('s', 15)) gen = gen + 0.045;
		};
		return gen;
	},
	automate() {
		if (hasMilestone('s', 5) && player.p.auto_upgrades) {
			if (hasMilestone('s', 6)) notsmart = !player.p.smart_auto_upgrades;
			else notsmart = true;
			buyUpgrade('p', 11);
			if (notsmart || player.p.points.gte(1000)) buyUpgrade('p', 12);
			buyUpgrade('p', 13);
			buyUpgrade('p', 14);
			if (hasUpgrade('p', 14)) buyUpgrade('p', 15);
			buyUpgrade('p', 21);
			buyUpgrade('p', 33);
			if (notsmart || hasUpgrade('p', 14)) buyUpgrade('p', 22);
			if (hasUpgrade('p', 22)) {
				buyUpgrade('p', 23);
				buyUpgrade('p', 24);
				if (hasUpgrade('p', 24)) buyUpgrade('p', 25);
				if (notsmart || hasUpgrade('p', 24)) buyUpgrade('p', 31);
				buyUpgrade('p', 32);
				buyUpgrade('p', 34);
				if (hasUpgrade('p', 34)) buyUpgrade('p', 35);
				if (notsmart || hasUpgrade('p', 34)) buyUpgrade('p', 41);
			};
			if (hasUpgrade('p', 41)) {
				buyUpgrade('p', 42);
				buyUpgrade('p', 43);
				buyUpgrade('p', 44);
				if (hasUpgrade('p', 44)) buyUpgrade('p', 45);
				if (notsmart || hasUpgrade('p', 44)) buyUpgrade('p', 51);
				buyUpgrade('p', 52);
				buyUpgrade('p', 53);
				buyUpgrade('p', 54);
				if (hasUpgrade('p', 54)) buyUpgrade('p', 55);
				if (notsmart || hasUpgrade('p', 54)) buyUpgrade('p', 61);
				buyUpgrade('p', 62);
				buyUpgrade('p', 63);
				buyUpgrade('p', 64);
				if (hasUpgrade('p', 64)) buyUpgrade('p', 65);
				buyUpgrade('p', 71);
				buyUpgrade('p', 72);
				buyUpgrade('p', 73);
				buyUpgrade('p', 74);
			};
		};
	},
	effect() {
		effBoost = new Decimal(0.01);
		effEx = new Decimal(1);
		if (hasMilestone('p', 1)) effBoost = effBoost.mul(2);
		if (hasUpgrade('p', 13)) effBoost = effBoost.mul(upgradeEffect('p', 13));
		if (hasUpgrade('p', 32)) effBoost = effBoost.mul(upgradeEffect('p', 32));
		if (hasUpgrade('p', 33)) effBoost = effBoost.mul(upgradeEffect('p', 33));
		if (hasUpgrade('p', 42)) effBoost = effBoost.mul(upgradeEffect('p', 42));
		if (hasMilestone('p', 2)) effEx = new Decimal(1.5);
		if (hasMilestone('p', 3)) effEx = new Decimal(1.6);
		eff = effBoost.mul(player.p.points).pow(effEx);
		sc_start0 = softcaps.p_d[0][0];
		if (eff.gt(sc_start0)) eff = eff.sub(sc_start0).pow(softcaps.p_d[0][1]).add(sc_start0);
		if (hasUpgrade('p', 71)) eff = eff.mul(upgradeEffect('p', 71));
		return eff;
	},
	effectDescription() {
		if (tmp.p.effect.lt(0.1)) return 'which are generating <h2 class="layer-p">' + tmp.p.effect.mul(100).round().div(100) + '</h2> divinity/sec';
		if (tmp.p.effect.gt(softcaps.p_d[0][0])) return 'which are generating <h2 class="layer-p">' + format(tmp.p.effect) + '</h2> divinity/sec (softcapped)';
		return 'which are generating <h2 class="layer-p">' + format(tmp.p.effect) + '</h2> divinity/sec';
	},
	doReset(resettingLayer) {
		if (hasMilestone('ei', 3) && resettingLayer == 'ei') return;
		if (hasMilestone('cl', 6) && resettingLayer == 'cl') return;
		let keep = ['auto_upgrades', "smart_auto_upgrades"];
			if (resettingLayer == 'h') keep.push("points", "best", "total", "milestones");
			if (resettingLayer == 'sp') keep.push("points", "best", "total", "milestones");
			if (resettingLayer == 'r') keep.push("milestones");
			if (hasMilestone('s', 25) && resettingLayer == 's') keep.push("milestones");
			if (hasUpgrade('p', 22) && resettingLayer == 'p') {
				let mult = new Decimal(1);
				if (hasUpgrade('p', 61)) mult = mult.mul(upgradeEffect('p', 61));
				if (hasUpgrade('p', 23) && hasUpgrade('p', 25)) player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.08).mul(mult));
				else if (hasUpgrade('p', 23)) player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.06).mul(mult));
				else player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.04).mul(mult));
			};
			if (hasUpgrade('p', 41) && resettingLayer == 'p') {
				if (hasUpgrade('p', 51) && hasUpgrade('p', 55)) player.p.hymn = player.p.hymn.add(player.p.holiness.div(175).floor());
				else if (hasUpgrade('p', 51)) player.p.hymn = player.p.hymn.add(player.p.holiness.div(200).floor());
				else player.p.hymn = player.p.hymn.add(player.p.holiness.div(250).floor());
			};
			if (layers[resettingLayer].row >= this.row) player.p.divinity = new Decimal(0);
			if (layers[resettingLayer].row > this.row) {
				layerDataReset('p', keep);
				if (!keep.includes("holiness")) player.p.holiness = new Decimal(0);
				if (!keep.includes("hymn")) player.p.hymn = new Decimal(0);
			};
		},
	update(diff) {
		if (tmp.p.effect.gt(0)) {
			player.p.divinity = player.p.divinity.add(tmp.p.effect.mul(diff));
		};
		if (hasMilestone('s', 8)) {
			gen = 0.002;
			if (hasMilestone('s', 16)) gen = gen + 0.023;
			if (hasUpgrade('p', 22)) {
				let mult = new Decimal(1);
				if (hasUpgrade('p', 61)) mult = mult.mul(upgradeEffect('p', 61));
				if (hasUpgrade('p', 23) && hasUpgrade('p', 25)) player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.08).mul(mult).mul(diff).mul(0.002));
				if (hasUpgrade('p', 23)) player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.06).mul(mult).mul(diff).mul(0.002));
				else player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.04).mul(mult).mul(diff).mul(0.002));
			};
			if (hasUpgrade('p', 41)) {
				if (hasUpgrade('p', 51) && hasUpgrade('p', 55)) player.p.hymn = player.p.hymn.add(player.p.holiness.div(175).mul(diff).mul(0.002).floor());
				else if (hasUpgrade('p', 51)) player.p.hymn = player.p.hymn.add(player.p.holiness.div(200).mul(diff).mul(0.002).floor());
				else player.p.hymn = player.p.hymn.add(player.p.holiness.div(250).mul(diff).mul(0.002).floor());
			};
		};
		if (hasUpgrade('p', 41)) {
			if (hasUpgrade('p', 43) && hasUpgrade('p', 52) && hasUpgrade('p', 53)) player.p.hymnEff = player.p.hymn.add(1).pow(0.25);
			else if (hasUpgrade('p', 43) && hasUpgrade('p', 52)) player.p.hymnEff = player.p.hymn.add(1).pow(0.225);
			else if (hasUpgrade('p', 43)) player.p.hymnEff = player.p.hymn.add(1).pow(0.2);
			else player.p.hymnEff = player.p.hymn.add(1).pow(0.15);
		};
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"blank",
		["display-text",
			function() {
				text = 'You have <h2 class="layer-p">' + format(player.p.divinity) + '</h2> divinity, which boosts point generation by <h2 class="layer-p">' + format(player.p.divinity.add(1).pow(0.1)) + '</h2>x';
				if (hasUpgrade('p', 22)) text += '<br>You have <h2 class="layer-p">' + format(player.p.holiness) + '</h2> holiness, which boosts essence gain by <h2 class="layer-p">' + format(player.p.holiness.add(1).pow(0.055)) + '</h2>x';
				if (hasUpgrade('p', 41)) text += '<br>You have <h2 class="layer-p">' + formatWhole(player.p.hymn) + '</h2> hymns, which boosts prayer gain by <h2 class="layer-p">' + format(player.p.hymnEff) + '</h2>x';
				return text;
			}],
		"blank",
		"milestones",
		"upgrades",
		"clickables",
	],
	milestones: {
		0: {
			requirementDescription: '1 prayer',
			effectDescription: 'hex and subatomic particle resets only reset<br>prayer upgrades and special resources<br>out of the things in the prayer layer',
			done() { return player.p.points.gte(1) },
		},
		1: {
			requirementDescription: '20 prayers',
			effectDescription: 'prayers generate twice as much divinity',
			done() { return player.p.points.gte(20) },
		},
		2: {
			requirementDescription: '2,500 prayers & 250 hymns',
			effectDescription: 'divinity gain is raised to the power of 1.5',
			done() { return player.p.points.gte(2500) && player.p.hymn.gte(250)},
			unlocked() { return hasUpgrade('p', 41) },
		},
		3: {
			requirementDescription: '1.00e55 prayers',
			effectDescription: 'divinity gain is raised to the power<br>of 1.6 instead of 1.5',
			done() { return player.p.points.gte(1e55)},
			unlocked() { return player.p.points.gte(1e50) || (hasMilestone('p', 2) && player.s.points.gt(3)) },
		},
	},
	upgrades: {
		11: {
			title() {
				return '<b class="layer-p' + getdark(this, "title") + 'Prayer Influence';
			},
			description: 'multiplies essence gain based on your prayers',
			cost: 1,
			effect() {
				return player.p.points.add(1).pow(0.075);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.075';
				return text;
			},
		},
		12: {
			title() {
				return '<b class="layer-p' + getdark(this, "title") + 'Heretic Leniency';
			},
			description: 'multiplies hex gain by 1.05',
			cost: 10,
		},
		13: {
			title() {
				return '<b class="layer-p' + getdark(this, "title") + 'Essence of Divinity';
			},
			description: 'multiplies divinity gain based on your essence',
			cost: 25,
			effect() {
				return player.e.points.add(1).pow(0.0001);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.0001';
				return text;
			},
		},
		14: {
			fullDisplay() {
				let text = '<h3 class="layer-p' + getdark(this, "title", true, true) + 'Prayer Divination</h3><br>Req: 100 divinity with having 0 holiness';
				if (this.canAfford()) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.divinity.gte(100) && player.p.holiness.eq(0) },
			style: {'height':'120px','border':'2px dashed','border-color':'#FF8800','background-color':'#0088FF'},
			unlocked() { return hasMilestone('s', 0) && !hasUpgrade('p', 14) },
		},
		15: {
			fullDisplay() {
				if (player.nerdMode) return '<h3 class="layer-p' + getdark(this, "title", true) + 'Prayer Divination</h3><br>multiplies prayer gain based on your divinity<br>Currently: ' + format(this.effect()) + 'x <br>formula: (x+1)^0.02<br><br>Cost: 75 divinity';
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Prayer Divination</h3><br>multiplies prayer gain based on your divinity<br>Currently: ' + format(this.effect()) + 'x<br><br>Cost: 75 divinity';
			},
			canAfford() { return player.p.divinity.gte(75) },
			pay() {
				player.p.divinity = player.p.divinity.sub(75);
			},
			effect() {
				return player.p.divinity.add(1).pow(0.02);
			},
			unlocked() { return hasUpgrade('p', 14) },
		},
		21: {
			fullDisplay() {
				if (player.nerdMode) return '<h3 class="layer-p' + getdark(this, "title", true) + 'Divine Prayers</h3><br>multiplies prayer gain based on your divinity<br>Currently: ' + format(this.effect()) + 'x <br>formula: (x+1)^0.01<br><br>Cost: 20 divinity';
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Divine Prayers</h3><br>multiplies prayer gain based on your divinity<br>Currently: ' + format(this.effect()) + 'x<br><br>Cost: 20 divinity';
			},
			canAfford() { return player.p.divinity.gte(20) },
			pay() {
				player.p.divinity = player.p.divinity.sub(20);
			},
			effect() {
				return player.p.divinity.add(1).pow(0.01);
			},
		},
		22: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Holy Light</h3><br>unlocks <b class="layer-p' + getdark(this, "ref", true) + 'holiness</b><br><br>Cost: 45 divinity';
			},
			canAfford() { return player.p.divinity.gte(45) },
			pay() {
				player.p.divinity = player.p.divinity.sub(45);
			},
		},
		23: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Holy Channeling</h3><br>increases efficiency of holiness conversion<br>0.04x --> 0.06x<br><br>Cost: 10 holiness';
			},
			canAfford() { return player.p.holiness.gte(10) },
			pay() {
				player.p.holiness = player.p.holiness.sub(10);
			},
			unlocked() { return hasUpgrade('p', 22) },
		},
		24: {
			fullDisplay() {
				let text = '<h3 class="layer-p' + getdark(this, "title", true, true) + 'Holy Conversion</h3><br>Req: 75 holiness without owning <b class="layer-p' + getdark(this, "ref", true, true) + 'Church Relics</b>';
				if (this.canAfford()) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.holiness.gte(75) && !hasUpgrade('p', 31) },
			style: {'height':'120px','border':'2px dashed','border-color':'#FF8800','background-color':'#0088FF'},
			unlocked() { return hasMilestone('s', 0) && hasUpgrade('p', 22) && !hasUpgrade('p', 24) },
		},
		25: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Holy Conversion</h3><br>increases efficiency of holiness conversion if you own <b class="layer-p' + getdark(this, "ref", true) + 'Holy Channeling</b><br>0.06x --> 0.08x<br><br>Cost: 50 holiness';
			},
			canAfford() { return player.p.holiness.gte(50) },
			pay() {
				player.p.holiness = player.p.holiness.sub(50);
			},
			unlocked() { return hasUpgrade('p', 24) },
		},
		31: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Church Relics</h3><br>achievements also multiply prayer gain if you have all subsequent achievement upgrades<br><br>Cost: 175 divinity,<br>40 holiness';
			},
			canAfford() { return player.p.divinity.gte(175) && player.p.holiness.gte(40) },
			pay() {
				player.p.divinity = player.p.divinity.sub(175);
				player.p.holiness = player.p.holiness.sub(40);
			},
			unlocked() { return hasUpgrade('p', 22) },

		},
		32: {
			fullDisplay() {
				if (player.nerdMode) return '<h3 class="layer-p' + getdark(this, "title", true) + 'Divine Synergy</h3><br>multiplies divinity gain based on your holiness<br>Currently: ' + format(this.effect()) + 'x <br>formula: (x+1)^0.025<br><br>Cost: 750 divinity,<br>50 holiness';
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Divine Synergy</h3><br>multiplies divinity gain based on your holiness<br>Currently: ' + format(this.effect()) + 'x<br><br>Cost: 750 divinity,<br>50 holiness';
			},
			canAfford() { return player.p.divinity.gte(750) && player.p.holiness.gte(50) },
			pay() {
				player.p.divinity = player.p.divinity.sub(750);
				player.p.holiness = player.p.holiness.sub(50);
			},
			effect() {
				return player.p.holiness.add(1).pow(0.025);
			},
			unlocked() { return hasUpgrade('p', 22) },
		},
		33: {
			title() {
				return '<b class="layer-p' + getdark(this, "title") + 'Divine Recursion';
			},
			description: 'multiplies divinity gain based on your divinity',
			cost: 1000,
			effect() {
				return player.p.divinity.add(1).pow(0.2);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.2';
				return text;
			},
		},
		34: {
			fullDisplay() {
				let text = '<h3 class="layer-p' + getdark(this, "title", true, true) + 'Holy Shift</h3><br>Req: 1,000 holiness with 0 hymns';
				if (this.canAfford()) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.holiness.gte(1000) && player.p.hymn.eq(0) },
			style: {'height':'120px','border':'2px dashed','border-color':'#FF8800','background-color':'#0088FF'},
			unlocked() { return hasMilestone('s', 0) && hasUpgrade('p', 22) && !hasUpgrade('p', 34) },
		},
		35: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Holy Shift</h3><br>increases efficiency of holiness conversion if you own <b class="layer-p' + getdark(this, "ref", true) + 'Holy Conversion</b> and all subsequent upgrades<br>0.08x --> 0.11x<br><br>Cost: 500 holiness';
			},
			canAfford() { return player.p.holiness.gte(500) },
			pay() {
				player.p.holiness = player.p.holiness.sub(500);
			},
			unlocked() { return hasUpgrade('p', 34) },
		},
		41: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Written hymns</h3><br>unlocks <b class="layer-p' + getdark(this, "ref", true) + 'hymns</b><br><br>Cost: 2,000 divinity,<br>450 holiness';
			},
			canAfford() { return player.p.divinity.gte(2000) && player.p.holiness.gte(450) },
			pay() {
				player.p.divinity = player.p.divinity.sub(2000);
				player.p.holiness = player.p.holiness.sub(450);
			},
			unlocked() { return hasUpgrade('p', 22) },
		},
		42: {
			fullDisplay() {
				if (player.nerdMode) {
					if (hasUpgrade('p', 45)) return '<h3 class="layer-p' + getdark(this, "title", true) + 'Divine hymns</h3><br>multiplies divinity gain based on your hymns<br>Currently: ' + format(this.effect()) + 'x <br>formula: (x+1)^0.125<br><br>Cost: 1,000 holiness,<br>75 hymns';
					return '<h3 class="layer-p' + getdark(this, "title", true) + 'Divine hymns</h3><br>multiplies divinity gain based on your hymns<br>Currently: ' + format(this.effect()) + 'x <br>formula: (x+1)^0.1<br><br>Cost: 1,000 holiness,<br>75 hymns';
				};
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Divine hymns</h3><br>multiplies divinity gain based on your hymns<br>Currently: ' + format(this.effect()) + 'x<br><br>Cost: 1,000 holiness,<br>75 hymns';
			},
			canAfford() { return player.p.holiness.gte(1000) && player.p.hymn.gte(75) },
			pay() {
				player.p.holiness = player.p.holiness.sub(1000);
				player.p.hymn = player.p.hymn.sub(75);
			},
			effect() {
				if (hasUpgrade('p', 45)) return player.p.hymn.add(1).pow(0.125);
				return player.p.hymn.add(1).pow(0.1);
			},
			unlocked() { return hasUpgrade('p', 41) },
		},
		43: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Hymn Singing</h3><br>increases hymn effect exponent<br>0.15 --> 0.2<br><br>Cost: 1,000,000 holiness,<br>50,000 hymns';
			},
			canAfford() { return player.p.holiness.gte(1000000) && player.p.hymn.gte(50000) },
			pay() {
				player.p.holiness = player.p.holiness.sub(1000000);
				player.p.hymn = player.p.hymn.sub(50000);
			},
			unlocked() { return hasUpgrade('p', 41) },
		},
		44: {
			fullDisplay() {
				let text = '<h3 class="layer-p' + getdark(this, "title", true, true) + 'Hymn Divination</h3><br>Req: 10,000,000 hymns without owning <b class="layer-p' + getdark(this, "ref", true, true) + 'Shorter Hymns</b>';
				if (this.canAfford()) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.hymn.gte(10000000) && !hasUpgrade('p', 51) },
			style: {'height':'120px','border':'2px dashed','border-color':'#FF8800','background-color':'#0088FF'},
			unlocked() { return hasMilestone('s', 0) && hasUpgrade('p', 41) && !hasUpgrade('p', 44) },
		},
		45: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Hymn Divination</h3><br>increases the exponent of <b class="layer-p' + getdark(this, "ref", true) + 'Divine Hymns</b><br>^0.1 --> ^0.125<br><br>Cost: 2,500,000 hymns';
			},
			canAfford() { return player.p.hymn.gte(2500000) },
			pay() {
				player.p.hymn = player.p.hymn.sub(2500000);
			},
			unlocked() { return hasUpgrade('p', 44) },
		},
		51: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Shorter Hymns</h3><br>decreases hymn requirement<br>250 --> 200<br><br>Cost: 1,000,000 hymns';
			},
			canAfford() { return player.p.hymn.gte(1000000) },
			pay() {
				player.p.hymn = player.p.hymn.sub(1000000);
			},
			unlocked() { return hasUpgrade('p', 41) },
		},
		52: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Stronger Hymns</h3><br>increases hymn effect exponent if you have <b class="layer-p' + getdark(this, "ref", true) + 'Hymn Singing</b><br>0.2 --> 0.225<br><br>Cost: 10,000,000 hymns';
			},
			canAfford() { return player.p.hymn.gte(10000000) },
			pay() {
				player.p.hymn = player.p.hymn.sub(10000000);
			},
			unlocked() { return hasUpgrade('p', 41) },
		},
		53: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Strongest Hymns</h3><br>increases hymn effect exponent if you have all subsequent upgrades<br>0.225 --> 0.25<br><br>Cost: 100,000,000 hymns';
			},
			canAfford() { return player.p.hymn.gte(100000000) },
			pay() {
				player.p.hymn = player.p.hymn.sub(100000000);
			},
			unlocked() { return hasUpgrade('p', 41) },
		},
		54: {
			fullDisplay() {
				let text = '<h3 class="layer-p' + getdark(this, "title", true, true) + 'Even Shorter</h3><br>Req: 1e10 hymns without owning <b class="layer-p' + getdark(this, "ref", true, true) + 'Holy Hymns</b>';
				if (this.canAfford()) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.hymn.gte(1e10) && !hasUpgrade('p', 61) },
			style: {'height':'120px','border':'2px dashed','border-color':'#FF8800','background-color':'#0088FF'},
			unlocked() { return hasMilestone('s', 0) && hasUpgrade('p', 41) && !hasUpgrade('p', 54) },
		},
		55: {
			fullDisplay() {
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Even Shorter</h3><br>decreases hymn requirement if you own <b class="layer-p' + getdark(this, "ref", true) + 'Shorter Hymns</b><br>200 --> 175<br><br>Cost: ' + format(2.5e9) + ' hymns';
			},
			canAfford() { return player.p.hymn.gte(2.5e9) },
			pay() {
				player.p.hymn = player.p.hymn.sub(2.5e9);
			},
			unlocked() { return hasUpgrade('p', 54) },
		},
		61: {
			fullDisplay() {
				if (player.nerdMode) return '<h3 class="layer-p' + getdark(this, "title", true) + 'Holy Hymns</h3><br>multiplies holiness gain based on your hymns<br>Currently: ' + format(this.effect()) + 'x <br>formula: (x+1)^0.02<br><br>Cost: ' + format(1e9) + ' hymns';
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Holy Hymns</h3><br>multiplies holiness gain based on your hymns<br>Currently: ' + format(this.effect()) + 'x<br><br>Cost: ' + format(1e9) + ' hymns';
			},
			canAfford() { return player.p.hymn.gte(1e9) },
			pay() {
				player.p.hymn = player.p.hymn.sub(1e9);
			},
			effect() {
				return player.p.hymn.add(1).pow(0.02);
			},
			unlocked() { return hasUpgrade('p', 41) },
		},
		62: {
			fullDisplay() {
				if (player.nerdMode) return '<h3 class="layer-p' + getdark(this, "title", true) + 'Hymn Deconstruction</h3><br>multiplies prayer gain based on your hymns<br>Currently: ' + format(this.effect()) + 'x <br>formula: log5(x+10)<br><br>Cost: ' + format(1e11) + ' hymns';
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Hymn Deconstruction</h3><br>multiplies prayer gain based on your hymns<br>Currently: ' + format(this.effect()) + 'x<br><br>Cost: ' + format(1e11) + ' hymns';
			},
			canAfford() { return player.p.hymn.gte(1e11) },
			pay() {
				player.p.hymn = player.p.hymn.sub(1e11);
			},
			effect() {
				return player.p.hymn.add(10).log(5);
			},
			unlocked() { return hasUpgrade('p', 41) },
		},
		63: {
			fullDisplay() {
				if (player.nerdMode) return '<h3 class="layer-p' + getdark(this, "title", true) + 'Hymn Resolve</h3><br>multiplies the effect of <b class="layer-p' + getdark(this, "ref", true) + 'Hymn Deconstruction</b> based on your essence<br>Currently: ' + format(this.effect()) + 'x <br>formula: (x+1)^0.0015<br><br>Cost: ' + format(1e15) + ' hymns';
				return '<h3 class="layer-p' + getdark(this, "title", true) + 'Hymn Resolve</h3><br>multiplies the effect of <b class="layer-p' + getdark(this, "ref", true) + 'Hymn Deconstruction</b> based on your essence<br>Currently: ' + format(this.effect()) + 'x<br><br>Cost: ' + format(1e15) + ' hymns';
			},
			canAfford() { return player.p.hymn.gte(1e15) },
			pay() {
				player.p.hymn = player.p.hymn.sub(1e15);
			},
			effect() {
				return player.e.points.add(1).pow(0.0015);
			},
			unlocked() { return hasUpgrade('p', 41) },
		},
		64: {
			fullDisplay() {
				let text = '<h3 class="layer-p' + getdark(this, "title", true, true) + 'Silver Sanctums</h3><br>Req: 2.5e25 prayers, 2 sanctums, and all previous research';
				if (this.canAfford()) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.points.gte(2.5e25) && player.s.points.gte(2) && hasUpgrade('p', 15) && hasUpgrade('p', 25) && hasUpgrade('p', 35) && hasUpgrade('p', 45) && hasUpgrade('p', 55) },
			style: {'height':'120px','border':'2px dashed','border-color':'#FF8800','background-color':'#0088FF'},
			unlocked() { return hasMilestone('s', 0) && hasUpgrade('p', 41) && !hasUpgrade('p', 64) },
		},
		65: {
			title() {
				return '<b class="layer-p' + getdark(this, "title") + 'Silver Sanctums';
			},
			description: 'reduces sanctum gain exponent<br>5 --> 4',
			cost: 1.00e25,
			unlocked() { return hasUpgrade('p', 64) },
		},
		71: {
			title() {
				return '<b class="layer-p' + getdark(this, "title") + 'Divine Sanctums';
			},
			description: 'multiplies divinity gain after the softcap based on your sanctums',
			cost: 1.00e30,
			effect() {
				return player.s.points.mul(30).add(1).pow(0.95);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x*30+1)^0.95';
				return text;
			},
			unlocked() { return hasMilestone('s', 3) && hasUpgrade('p', 41) },
		},
		72: {
			title() {
				return '<b class="layer-p' + getdark(this, "title") + 'Sanctum Sanctions';
			},
			description: 'multiplies point gain based on your sanctums',
			cost: 1.00e75,
			effect() {
				return player.s.points.mul(25).add(1).pow(0.5);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x*25+1)^0.5';
				return text;
			},
			unlocked() { return hasMilestone('s', 3) && hasUpgrade('p', 41) },
		},
		73: {
			title() {
				return '<b class="layer-p' + getdark(this, "title") + 'Sanctum Prayers';
			},
			description: 'multiplies prayer gain based on your sanctums',
			cost: 1.00e125,
			effect() {
				return player.s.points.mul(2).add(1).pow(1.5);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x*2+1)^1.5';
				return text;
			},
			unlocked() { return hasMilestone('s', 3) && hasUpgrade('p', 41) },
		},
		74: {
			title() {
				return '<b class="layer-p' + getdark(this, "title") + 'Gold Sanctums';
			},
			description() {
				return 'reduces sanctum gain exponent if you have <b class="layer-p' + getdark(this, "ref") + 'Silver Sanctums</b><br>4 --> 3.48' 
			},
			cost: 1.00e175,
			unlocked() { return hasMilestone('s', 3) && hasUpgrade('p', 41) },
		},
	},
	clickables: {
		11: {
			title: 'RESET',
			display: 'resets your prayer upgrades, divinity, holiness, and hymns (used for if you can\'t get some researches anymore)',
			canClick() {
				return true;
			},
			onClick() {
				if (confirm('Are you really sure you want to reset your prayer upgrades, divinity, holiness, and hymns?')) {
					player.p.upgrades = [];
					player.p.holiness = new Decimal(0);
					player.p.divinity = new Decimal(0);
					player.p.hymn = new Decimal(0);
				};
			},
			unlocked() {return hasMilestone('s', 0)},
		},
	},
});

addLayer('s', {
	name: 'Sanctums',
	symbol: 'S',
	position: 1,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		devotion: new Decimal(0),
		devotion_effect: new Decimal(1),
		auto_worship: false,
		auto_sacrifice: false,
		auto_sacrificial_ceremony: false,
		no_speed_but_more_bulk: false,
	}},
	color: "#AAFF00",
	branches: ['r', 'gi'],
	requires: 1e15,
	resource: 'sanctums',
	baseResource: 'prayers',
	baseAmount() { return player.p.points },
	type: 'static',
	exponent() {
		if (hasUpgrade('p', 65) && hasUpgrade('p', 74)) return 3.48;
		if (hasUpgrade('p', 65)) return 4;
		return 5;
	},
	canBuyMax() { return hasMilestone('s', 0) || player.r.total.gt(0) || player.w.unlocked },
	gainExp() {
		let gain = new Decimal(1);
		if (player.r.sanctummult.gt(1)) gain = gain.mul(player.r.sanctummult);
		if (player.s.devotion_effect.gt(1)) gain = gain.mul(player.s.devotion_effect);
		if (new Decimal(tmp.w.effect[1]).gt(1)) gain = gain.mul(tmp.w.effect[1]);
		return gain;
	},
	autoPrestige() { return hasMilestone('s', 48) },
	row: 2,
	hotkeys: [
		{key: 's', description: 'S: Reset for sanctums', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return player.p.unlocked || player.s.unlocked },
	effect() {
		return new Decimal(2).pow(player.s.points);
	},
	effectDescription() {
		return 'which multiplies essence gain by <h2 class="layer-s">' + format(tmp.s.effect) + '</h2>x';
	},
	doReset(resettingLayer) {
		if (hasMilestone('s', 12) && resettingLayer == 'a') return;
		if (hasMilestone('cl', 7) && resettingLayer == 'cl') return;
		let keep = ["auto_worship", "auto_sacrifice", "auto_sacrificial_ceremony", "no_speed_but_more_bulk"];
			if (challengeCompletions('r', 11) >= 9 && resettingLayer == 'r') keep.push("milestones");
			if (layers[resettingLayer].row > this.row) {
				layerDataReset('s', keep);
				layerDataReset('d', keep);
				if (hasMilestone('m', 9) && resettingLayer == 'm') player.s.milestones = ['0'];
				if (hasMilestone('m', 10) && resettingLayer == 'm') {
					if (hasMilestone('m', 19)) set = 215;
					else if (hasMilestone('m', 18)) set = 20;
					else set = 5;
					player.s.points = new Decimal(set);
					player.s.best = new Decimal(set);
					player.s.total = new Decimal(set);
				};
				if (hasMilestone('gi', 6) && resettingLayer == 'gi') {
					if (hasMilestone('gi', 15)) set = 215;
					else if (hasMilestone('gi', 14)) set = 85;
					else if (hasMilestone('gi', 13)) set = 30;
					else if (hasMilestone('gi', 9)) set = 16;
					else if (hasMilestone('gi', 8)) set = 10;
					else if (hasMilestone('gi', 7)) set = 7;
					else set = 4;
					player.s.points = new Decimal(set);
					player.s.best = new Decimal(set);
					player.s.total = new Decimal(set);
				};
			};
		},
	resetsNothing() { return hasMilestone('s', 47) },
	tabFormat: {
		"Landmarks": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				"milestones",
			],
		},
		"Devotion": {
			content: function() {
				if (this.unlocked) return [
					"main-display",
					"prestige-button",
					"resource-display",
					"blank",
					["display-text", 'you have <h2 class="layer-s">' + format(player.s.devotion) + '</h2> devotion, which multiplies sanctum gain by <h2 class="layer-s">' + format(player.s.devotion_effect) + '</h2>x'],
					"blank",
					["layer-proxy", ['d', ["buyables"]]],
					"blank",
					"blank"
				];
				return [
					"main-display",
					"prestige-button",
					"resource-display",
					"blank",
					"milestones",
				];
			},
			unlocked() {
				return hasMilestone('s', 13);
			},
		},
	},
	milestones: {
		0: {
			requirementDescription: '1 sanctum',
			effectDescription: 'you can buy max sanctums and<br><b>research</b> 6 new prayer upgrades',
			done() { return player.s.points.gte(1) },
		},
		1: {
			requirementDescription: '2 sanctums',
			effectDescription: 'you can autobuy core upgrades',
			done() { return player.s.points.gte(2) },
			toggles: [['c', 'auto_upgrades']],
		},
		2: {
			requirementDescription: '3 sanctums',
			effectDescription: 'you can autobuy core rebuyables',
			done() { return player.s.points.gte(3) },
			toggles: [['c', 'auto_buyables']],
		},
		3: {
			requirementDescription: '4 sanctums',
			effectDescription: 'you can explore 4 further prayer upgrades',
			done() { return player.s.points.gte(4) },
		},
		4: {
			requirementDescription: '5 sanctums',
			effectDescription: 'you can autobuy quark upgrades',
			done() { return player.s.points.gte(5) },
			toggles: [['q', 'auto_upgrades']],
		},
		5: {
			requirementDescription: '6 sanctums',
			effectDescription: 'you can autobuy prayer upgrades',
			done() { return player.s.points.gte(6) },
			toggles: [['p', 'auto_upgrades']],
		},
		6: {
			requirementDescription: '7 sanctums',
			effectDescription: 'you can have autobuy prayer upgrades<br>option be smart (toggle on or off)',
			done() { return player.s.points.gte(7) },
			toggles: [['p', "smart_auto_upgrades"]],
		},
		7: {
			requirementDescription: '8 sanctums',
			effectDescription: 'gain 0.5% of prayer gain per second',
			done() { return player.s.points.gte(8) },
		},
		8: {
			requirementDescription: '9 sanctums',
			effectDescription: 'gain 0.2% of holiness & hymn gain per second',
			done() { return player.s.points.gte(9) },
		},
		9: {
			requirementDescription: '10 sanctums',
			effectDescription: 'gain 0.1% of hex gain per second',
			done() { return player.s.points.gte(10) },
		},
		10: {
			requirementDescription: '14 sanctums',
			effectDescription: 'gain 0.001% of demon soul gain per second',
			done() { return player.s.points.gte(14) },
		},
		11: {
			requirementDescription: '16 sanctums',
			effectDescription: 'subatomic particles reset nothing,<br>and perform subatomic particle<br>resets automatically',
			done() { return player.s.points.gte(16) },
		},
		12: {
			requirementDescription: '18 sanctums',
			effectDescription: 'atom resets don\'t reset sanctums',
			done() { return player.s.points.gte(18) },
		},
		13: {
			requirementDescription: '19 sanctums',
			effectDescription() {
				return 'unlock <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion';
			},
			done() { return player.s.points.gte(19) },
		},
		14: {
			requirementDescription: '22 sanctums',
			effectDescription() {
				return 'unlock <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrificial Ceremonies';
			},
			done() { return player.s.points.gte(22) },
			unlocked() { return hasMilestone('s', 13) },
		},
		15: {
			requirementDescription: '24 sanctums',
			effectDescription: 'gain +4.5% of prayer gain per second',
			done() { return player.s.points.gte(24) },
			unlocked() { return hasMilestone('s', 13) },
		},
		16: {
			requirementDescription: '25 sanctums',
			effectDescription: 'gain +2.3% of holiness & hymn gain per second',
			done() { return player.s.points.gte(25) },
			unlocked() { return hasMilestone('s', 13) },
		},
		17: {
			requirementDescription: '26 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Worship</b> cost scaling by 15';
			},
			done() { return player.s.points.gte(26) },
			unlocked() { return hasMilestone('s', 13) },
		},
		18: {
			requirementDescription: '27 sanctums',
			effectDescription() {
				return 'increase <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> effect exponent<br>0.3 --> 0.375';
			},
			done() { return player.s.points.gte(27) },
			unlocked() { return hasMilestone('s', 13) },
		},
		19: {
			requirementDescription: '30 sanctums',
			effectDescription() {
				return 'you can auto <b class="layer-s' + getdark(this, "ref", true, true) + 'Worship';
			},
			done() { return player.s.points.gte(30) },
			toggles: [['s', "auto_worship"]],
			unlocked() { return hasMilestone('s', 13) },
		},
		20: {
			requirementDescription: '31 sanctums',
			effectDescription: 'sanctum resets don\'t reset essence',
			done() { return player.s.points.gte(31) },
			unlocked() { return hasMilestone('s', 13) },
		},
		21: {
			requirementDescription: '32 sanctums',
			effectDescription() {
				return 'increase <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> effect exponent<br>0.375 --> 0.45';
			},
			done() { return player.s.points.gte(32) },
			unlocked() { return hasMilestone('s', 13) },
		},
		22: {
			requirementDescription: '35 sanctums',
			effectDescription() {
				return 'increase <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> effect exponent<br>0.45 --> 0.55';
			},
			done() { return player.s.points.gte(35) },
			unlocked() { return hasMilestone('s', 13) },
		},
		23: {
			requirementDescription: '39 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Worship</b> cost scaling by 2';
			},
			done() { return player.s.points.gte(39) },
			unlocked() { return hasMilestone('s', 13) },
		},
		24: {
			requirementDescription: '42 sanctums',
			effectDescription() {
				return 'double <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrifice</b>\'s effect';
			},
			done() { return player.s.points.gte(42) },
			unlocked() { return hasMilestone('s', 13) },
		},
		25: {
			requirementDescription: '43 sanctums',
			effectDescription: 'keep row 2 milestones on sanctum resets',
			done() { return player.s.points.gte(43) },
			unlocked() { return hasMilestone('s', 13) },
		},
		26: {
			requirementDescription: '44 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrifice</b> cost scaling by 2';
			},
			done() { return player.s.points.gte(44) },
			unlocked() { return hasMilestone('s', 13) },
		},
		27: {
			requirementDescription: '46 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrificial Ceremony</b><br>cost scaling by 2';
			},
			done() { return player.s.points.gte(46) },
			unlocked() { return hasMilestone('s', 13) },
		},
		28: {
			requirementDescription: '49 sanctums',
			effectDescription() {
				return 'you can auto perform<br><b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrificial Ceremonies';
			},
			done() { return player.s.points.gte(49) },
			toggles: [['s', "auto_sacrificial_ceremony"]],
			unlocked() { return hasMilestone('s', 13) },
		},
		29: {
			requirementDescription: '50 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrificial Ceremony</b><br>cost scaling by 1.5';
			},
			done() { return player.s.points.gte(50) },
			unlocked() { return hasMilestone('s', 13) },
		},
		30: {
			requirementDescription: '53 sanctums',
			effectDescription: 'double light gain',
			done() { return player.s.points.gte(53) },
			unlocked() { return hasMilestone('s', 13) },
		},
		31: {
			requirementDescription: '66 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrificial Ceremony</b><br>cost scaling by 1.2';
			},
			done() { return player.s.points.gte(66) },
			unlocked() { return hasMilestone('s', 13) },
		},
		32: {
			requirementDescription: '69 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Worship</b><br>cost by 1e100';
			},
			done() { return player.s.points.gte(69) },
			unlocked() { return hasMilestone('s', 13) },
		},
		33: {
			requirementDescription: '70 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrifice</b><br>cost scaling by 1.6';
			},
			done() { return player.s.points.gte(70) },
			unlocked() { return hasMilestone('s', 13) },
		},
		34: {
			requirementDescription: '71 sanctums',
			effectDescription() {
				return 'change <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrifice</b>\'s cost<br>to a requirement';
			},
			done() { return player.s.points.gte(71) },
			unlocked() { return hasMilestone('s', 13) },
		},
		35: {
			requirementDescription: '72 sanctums',
			effectDescription() {
				return 'increase <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> effect exponent<br>0.55 --> 0.575';
			},
			done() { return player.s.points.gte(72) },
			unlocked() { return hasMilestone('s', 13) },
		},
		36: {
			requirementDescription: '77 sanctums',
			effectDescription() {
				return 'increase <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> effect exponent<br>0.575 --> 0.6';
			},
			done() { return player.s.points.gte(77) },
			unlocked() { return hasMilestone('s', 13) },
		},
		37: {
			requirementDescription: '80 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrifice</b><br>cost scaling by 2';
			},
			done() { return player.s.points.gte(80) },
			unlocked() { return hasMilestone('s', 13) },
		},
		38: {
			requirementDescription: '85 sanctums',
			effectDescription() {
				return 'you can auto <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrifice';
			},
			done() { return player.s.points.gte(85) },
			toggles: [['s', "auto_sacrifice"]],
			unlocked() { return hasMilestone('s', 13) },
		},
		39: {
			requirementDescription: '87 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrifice</b><br>cost scaling by 2';
			},
			done() { return player.s.points.gte(87) },
			unlocked() { return hasMilestone('s', 13) },
		},
		40: {
			requirementDescription: '96 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Worship</b><br>cost scaling by 1.5';
			},
			done() { return player.s.points.gte(96) },
			unlocked() { return hasMilestone('s', 13) },
		},
		41: {
			requirementDescription: '100 sanctums',
			effectDescription: 'triple light gain',
			done() { return player.s.points.gte(100) },
			unlocked() { return hasMilestone('s', 13) },
		},
		42: {
			requirementDescription: '110 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrificial Ceremony</b><br>cost scaling by 1.5';
			},
			done() { return player.s.points.gte(110) },
			unlocked() { return hasMilestone('s', 13) },
		},
		43: {
			requirementDescription: '112 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrificial Ceremony</b><br>hex cost scaling by 3';
			},
			done() { return player.s.points.gte(112) },
			unlocked() { return hasMilestone('s', 13) },
		},
		44: {
			requirementDescription: '120 sanctums',
			effectDescription() {
				return 'auto <b class="layer-s' + getdark(this, "ref", true, true) + 'Worship</b><br>works twice as fast';
			},
			done() { return player.s.points.gte(120) },
			unlocked() { return hasMilestone('s', 13) },
		},
		45: {
			requirementDescription: '125 sanctums',
			effectDescription() {
				return 'divide <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrificial Ceremony</b><br>hex cost scaling by 4';
			},
			done() { return player.s.points.gte(125) },
			unlocked() { return hasMilestone('s', 13) },
		},
		46: {
			requirementDescription: '140 sanctums',
			effectDescription() {
				return 'auto <b class="layer-s' + getdark(this, "ref", true, true) + 'Worship</b> works<br>twice as fast (4x total)';
			},
			done() { return player.s.points.gte(140) },
			unlocked() { return hasMilestone('s', 13) },
		},
		47: {
			requirementDescription: '161 sanctums',
			effectDescription: 'sanctums reset nothing',
			done() { return player.s.points.gte(161) },
			unlocked() { return hasMilestone('s', 13) },
		},
		48: {
			requirementDescription: '164 sanctums',
			effectDescription: 'perform sanctum resets automatically',
			done() { return player.s.points.gte(164) },
			unlocked() { return hasMilestone('s', 13) },
		},
		49: {
			requirementDescription: '175 sanctums',
			effectDescription() {
				return 'increase <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> effect exponent<br>0.6 --> 0.625';
			},
			done() { return player.s.points.gte(175) },
			unlocked() { return hasMilestone('s', 13) },
		},
		50: {
			requirementDescription: '190 sanctums',
			effectDescription: 'triple light gain',
			done() { return player.s.points.gte(190) },
			unlocked() { return hasMilestone('s', 13) },
		},
		51: {
			requirementDescription: '200 sanctums',
			effectDescription() {
				return 'auto <b class="layer-s' + getdark(this, "ref", true, true) + 'Worship</b> works<br>thrice as fast (12x total)';
			},
			done() { return player.s.points.gte(200) && hasMilestone('m', 8) },
			unlocked() { return hasMilestone('s', 13) && hasMilestone('m', 8) },
		},
		52: {
			requirementDescription: '210 sanctums',
			effectDescription: 'triple light gain',
			done() { return player.s.points.gte(210) && hasMilestone('m', 8) },
			unlocked() { return hasMilestone('s', 13) && hasMilestone('m', 8) },
		},
		53: {
			requirementDescription: '215 sanctums',
			effectDescription() {
				return 'increase <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> effect exponent<br>0.625 --> 0.666';
			},
			done() { return player.s.points.gte(215) && hasMilestone('m', 8) },
			unlocked() { return hasMilestone('s', 13) && hasMilestone('m', 8) },
		},
	},
});

addLayer('d', {
	name: 'Devotion',
	symbol: 'D',
	position: 3,
	row: 2,
	layerShown() { return false },
	automate() {
		if (hasMilestone('cl', 1) && player.s.no_speed_but_more_bulk) {
			if (hasMilestone('s', 19) && player.s.auto_worship && layers.d.buyables[11].canAfford()) layers.d.buyables[11].buy();
			if (hasMilestone('s', 38) && player.s.auto_sacrifice && layers.d.buyables[12].canAfford()) layers.d.buyables[12].buy();
			if (hasMilestone('s', 28) && player.s.auto_sacrificial_ceremony && layers.d.buyables[21].canAfford()) layers.d.buyables[21].buy();
		} else {
			if (hasMilestone('s', 19) && player.s.auto_worship) {
				let work = 1;
				if (hasMilestone('s', 44)) work *= 2;
				if (hasMilestone('s', 46)) work *= 2;
				if (hasMilestone('s', 51)) work *= 3;
				if (challengeCompletions('r', 11) >= 17) work *= 2;
				if (challengeCompletions('r', 11) >= 38) work *= 2;
				if (hasMilestone('gi', 10)) work *= 2;
				for (let index = 0; index < work; index++) {
					if (!layers.d.buyables[11].canAfford()) break;
					layers.d.buyables[11].buy();
				};
			};
			if (hasMilestone('s', 38) && player.s.auto_sacrifice) {
				let work = 1;
				if (challengeCompletions('r', 11) >= 17) work *= 2;
				if (challengeCompletions('r', 11) >= 22) work *= 2;
				if (challengeCompletions('r', 11) >= 23) work *= 1.5;
				if (challengeCompletions('r', 11) >= 32) work *= 2;
				if (challengeCompletions('r', 11) >= 38) work *= 2;
				if (hasMilestone('gi', 10)) work *= 2;
				for (let index = 0; index < work; index++) {
					if (!layers.d.buyables[12].canAfford()) break;
					layers.d.buyables[12].buy();
				};
			};
			if (hasMilestone('s', 28) && player.s.auto_sacrificial_ceremony) {
				let work = 1;
				if (challengeCompletions('r', 11) >= 17) work *= 2;
				if (challengeCompletions('r', 11) >= 38) work *= 2;
				if (hasMilestone('gi', 10)) work *= 2;
				for (let index = 0; index < work; index++) {
					if (!layers.d.buyables[21].canAfford()) break;
					layers.d.buyables[21].buy();
				};
			};
		};
	},
	doReset(resettingLayer) {},
	update(diff) {
		eff = new Decimal(0);
		eff = eff.add(getBuyableAmount('d', 11).mul(0.1));
		if (hasMilestone('s', 24)) eff = eff.add(getBuyableAmount('d', 12));
		else eff = eff.add(getBuyableAmount('d', 12).mul(0.5));
		eff = eff.add(getBuyableAmount('d', 21).mul(0.75));
		player.s.devotion = eff;
		if (hasMilestone('s', 53)) player.s.devotion_effect = player.s.devotion.add(1).pow(0.666);
		else if (hasMilestone('s', 49)) player.s.devotion_effect = player.s.devotion.add(1).pow(0.625);
		else if (hasMilestone('s', 36)) player.s.devotion_effect = player.s.devotion.add(1).pow(0.6);
		else if (hasMilestone('s', 35)) player.s.devotion_effect = player.s.devotion.add(1).pow(0.575);
		else if (hasMilestone('s', 22)) player.s.devotion_effect = player.s.devotion.add(1).pow(0.55);
		else if (hasMilestone('s', 21)) player.s.devotion_effect = player.s.devotion.add(1).pow(0.45);
		else if (hasMilestone('s', 18)) player.s.devotion_effect = player.s.devotion.add(1).pow(0.375);
		else player.s.devotion_effect = player.s.devotion.add(1).pow(0.3);
	},
	buyables: {
		11: {
			cost(x = 0) {
				if (challengeCompletions('r', 11) >= 5) div = new Decimal(1e25).mul(player.r.relic_effects[2]).pow(getBuyableAmount('d', 21));
				else div = new Decimal(1e25).pow(getBuyableAmount('d', 21));
				if (hasMilestone('s', 32)) div = div.mul(1e100);
				scale = new Decimal(50);
				if (hasMilestone('s', 17)) scale = scale.div(15);
				if (hasMilestone('s', 23)) scale = scale.div(2);
				if (hasMilestone('s', 40)) scale = scale.div(1.5);
				if (x == 0) return new Decimal(10).pow(getBuyableAmount('d', 11).add(1).mul(scale)).mul(1e50).div(div);
				return new Decimal(10).pow(getBuyableAmount('d', 11).add(x).add(1).mul(scale)).mul(1e50).div(div);
			},
			title() {
				return '<h3 class="layer-s' + getdark(this, "title-buyable") + 'Worship<br>';
			},
			canAfford() {
				return player.p.points.gte(this.cost());
			},
			buy() {
				player.p.points = player.p.points.sub(this.cost());
				setBuyableAmount('d', 11, getBuyableAmount('d', 11).add(getDevotionBulk()));
			},
			display() {
				return 'use prayers to worship the gods. you will gain 0.1 devotion per worship.<br><br>Devotion Reward: ' + format(getBuyableAmount('d', 11).mul(0.1)) + '<br><br>Cost: ' + formatWhole(this.cost()) + ' prayers<br><br>Times Worshipped: ' + formatWhole(getBuyableAmount('d', 11));
			},
			style() {
				backcolors = '#224400, #336600';
				if (this.canAfford()) backcolors = '#112200, #448800';
				textcolor = '#AAFF00';
				if (colorvalue[1] == 'none') textcolor = '#DFDFDF';
				return {'background-image':'radial-gradient('+backcolors+')','color':textcolor,'border-radius':'50%'};
			},
			unlocked() { return hasMilestone('s', 13) },
		},
		12: {
			cost(x = 0) {
				scale = new Decimal(1);
				if (hasMilestone('s', 26)) scale = scale.div(2);
				if (hasMilestone('s', 33)) scale = scale.div(1.6);
				if (hasMilestone('s', 37)) scale = scale.div(2);
				if (hasMilestone('s', 39)) scale = scale.div(2);
				if (x == 0) return getBuyableAmount('d', 12).mul(scale).add(20).floor();
				return getBuyableAmount('d', 12).add(x).mul(scale).add(20).floor();
			},
			title() {
				return '<h3 class="layer-s' + getdark(this, "title-buyable") + 'Sacrifice<br>';
			},
			canAfford() {
				return player.s.points.gte(this.cost());
			},
			buy() {
				if (!hasMilestone('s', 34)) player.s.points = player.s.points.sub(this.cost());
				setBuyableAmount('d', 12, getBuyableAmount('d', 12).add(getDevotionBulk()));
			},
			display() {
				if (hasMilestone('s', 34)) return 'use sanctums as a sacrifice to worship the gods. you will gain<br>1 devotion per sacrifice.<br>each sacrifice also multiplies relic\'s first effect by 2<br>Currently: ' + format(new Decimal(2).pow(getBuyableAmount('d', 12))) + 'x<br><br>Devotion Reward: ' + format(getBuyableAmount('d', 12)) + '<br><br>Req: ' + formatWhole(this.cost()) + ' sanctums<br><br>Times Sacrificed:' + (formatWhole(getBuyableAmount('d', 12)).length >= 8 ? '<br>' : ' ') + formatWhole(getBuyableAmount('d', 12));
				if (hasMilestone('s', 24)) return 'use sanctums as a sacrifice to worship the gods. you will gain<br>1 devotion per sacrifice.<br>each sacrifice also multiplies relic\'s first effect by 2<br>Currently: ' + format(new Decimal(2).pow(getBuyableAmount('d', 12))) + 'x<br><br>Devotion Reward: ' + format(getBuyableAmount('d', 12)) + '<br><br>Cost: ' + formatWhole(this.cost()) + ' sanctums<br><br>Times Sacrificed:' + (formatWhole(getBuyableAmount('d', 12)).length >= 8 ? '<br>' : ' ') + formatWhole(getBuyableAmount('d', 12));
				return 'use sanctums as a sacrifice to worship the gods. you will gain<br>0.5 devotion per sacrifice.<br>each sacrifice also multiplies relic\'s first effect by 1.5<br>Currently: ' + format(new Decimal(1.5).pow(getBuyableAmount('d', 12))) + 'x<br><br>Devotion Reward: ' + format(getBuyableAmount('d', 12).mul(0.5)) + '<br><br>Cost: ' + formatWhole(this.cost()) + ' sanctums<br><br>Times Sacrificed:' + (formatWhole(getBuyableAmount('d', 12)).length >= 8 ? '<br>' : ' ') + formatWhole(getBuyableAmount('d', 12));
			},
			style() {
				backcolors = '#224400, #336600';
				if (this.canAfford()) backcolors = '#112200, #448800';
				textcolor = '#AAFF00';
				if (colorvalue[1] == 'none') textcolor = '#DFDFDF';
				return {'background-image':'radial-gradient('+backcolors+')','color':textcolor,'border-radius':'50%'};
			},
			unlocked() { return hasMilestone('s', 13) },
		},
		21: {
			cost_h(x = 0) {
				scale = new Decimal(50);
				if (hasMilestone('s', 27)) scale = scale.div(2);
				if (hasMilestone('s', 29)) scale = scale.div(1.5);
				if (hasMilestone('s', 31)) scale = scale.div(1.2);
				if (hasMilestone('s', 42)) scale = scale.div(1.5);
				if (hasMilestone('s', 43)) scale = scale.div(3);
				if (hasMilestone('s', 45)) scale = scale.div(4);
				if (x == 0) return new Decimal(10).pow(getBuyableAmount('d', 21).mul(scale)).mul(1e50);
				return new Decimal(10).pow(getBuyableAmount('d', 21).add(x).mul(scale)).mul(1e50);
			},
			cost_sp(x = 0) {
				scale = new Decimal(1);
				if (hasMilestone('s', 27)) scale = scale.div(2);
				if (hasMilestone('s', 29)) scale = scale.div(1.5);
				if (hasMilestone('s', 31)) scale = scale.div(1.2);
				if (hasMilestone('s', 42)) scale = scale.div(1.5);
				if (x == 0) return getBuyableAmount('d', 21).mul(scale).add(1).mul(1e15).floor();
				return getBuyableAmount('d', 21).add(x).mul(scale).add(1).mul(1e15).floor();
			},
			title() {
				return '<h3 class="layer-s' + getdark(this, "title-buyable") + 'Sacrificial Ceremony<br>';
			},
			canAfford() {
				return player.h.points.gte(this.cost_h()) && player.sp.points.gte(this.cost_sp());
			},
			buy() {
				player.h.points = player.h.points.sub(this.cost_h());
				player.sp.points = player.sp.points.sub(this.cost_sp());
				setBuyableAmount('d', 21, getBuyableAmount('d', 21).add(getDevotionBulk()));
			},
			display() {
				lasteff = new Decimal(1e25);
				if (challengeCompletions('r', 11) >= 5) lasteff = lasteff.mul(player.r.relic_effects[2]);
				if (getBuyableAmount('d', 21).eq(0)) return 'use hexes and subatomic particles in a sacrificial ceremony to worship the gods. you will gain 0.75 devotion per sacrificial ceremony. each sacrificial ceremony also multiplies subatomic particle gain by 1.2, light gain by 1 (additive; others are multiplicative), and divides worship cost by 1e25<br>Currently: 1.00x,<br>1.00x,<br>and /1.00<br><br>Devotion Reward: 0.00<br><br>Cost: ' + formatWhole(this.cost_h()) + ' hexes,<br>' + formatWhole(this.cost_sp()) + ' subatomic particles<br><br>Ceremonies Performed: 0';
				return 'use hexes and subatomic particles in a sacrificial ceremony to worship the gods. you will gain 0.75 devotion per sacrificial ceremony. each sacrificial ceremony also multiplies subatomic particle gain by 1.2, light gain by 1 (additive; others are multiplicative), and divides worship cost by 1e25<br>Currently: ' + format(new Decimal(1.2).pow(getBuyableAmount('d', 21))) + 'x,<br>' + format(getBuyableAmount('d', 21)) + 'x,<br>and /' + format(lasteff.pow(getBuyableAmount('d', 21))) + '<br><br>Devotion Reward: ' + format(getBuyableAmount('d', 21).mul(0.75)) + '<br><br>Cost: ' + formatWhole(this.cost_h()) + ' hexes,<br>' + formatWhole(this.cost_sp()) + ' subatomic particles<br><br>Ceremonies Performed: ' + formatWhole(getBuyableAmount('d', 21));
			},
			style() {
				backcolors = '#224400, #336600';
				if (this.canAfford()) backcolors = '#112200, #448800';
				textcolor = '#AAFF00';
				if (colorvalue[1] == 'none') textcolor = '#DFDFDF';
				return {'background-image':'radial-gradient('+backcolors+')','color':textcolor,'border-radius':'50%','height':'300px','width':'300px'};
			},
			unlocked() { return hasMilestone('s', 14) },
		},
	},
});

addLayer('r', {
	name: 'Relics',
	symbol: 'R',
	position: 1,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		lightreq: new Decimal(20000),
		light: new Decimal(0),
		lightbest: new Decimal(0),
		lightgain: new Decimal(0),
		lightgainbest: new Decimal(0),
		lightlastcap: new Decimal(0),
		relic_effects: [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
		sanctummult: new Decimal(1),
		essencemult: new Decimal(1),
		auto_activate: false,
		auto_upgrade_1: false,
		auto_upgrade_2: false,
		auto_upgrade_3: false,
	}},
	color: "#B9A975",
	branches: ['gi'],
	tooltip() {
		if (player.nerdMode) return formatWhole(challengeCompletions('r', 11)) + ' activated relics and ' + formatWhole(player.r.points) + ' total relics';
		return formatWhole(player.r.points) + ' relics';
	},
	requires: 10,
	resource: 'relics',
	baseResource: 'sanctums',
	baseAmount() { return player.s.points },
	type: 'static',
	exponent: 0.66,
	canBuyMax() { return true },
	gainExp() {
		let gain = new Decimal(1);
		if (hasUpgrade('m', 43)) gain = gain.mul(upgradeEffect('m', 43));
		if (challengeCompletions('r', 11) >= 13) gain = gain.mul(player.r.relic_effects[3]);
		if (hasUpgrade('ei', 34)) gain = gain.mul(upgradeEffect('ei', 34));
		if (new Decimal(tmp.w.effect[1]).gt(1)) gain = gain.mul(tmp.w.effect[1]);
		return gain;
	},
	autoPrestige() { return hasMilestone('w', 4) },
	row: 3,
	hotkeys: [
		{key: 'r', description: 'R: Reset for relics', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return player.s.unlocked || player.r.unlocked },
	automate() {
		if (hasMilestone('w', 3) && player.r.auto_activate) {
			if (getLightGain().gt(player.r.lightgainbest)) player.r.lightgainbest = getLightGain();
			if (this.challenges[11].canComplete()) player.r.challenges[11]++;
		};
		if (hasMilestone('w', 4) && player.r.auto_upgrade_1 && layers.r.upgrades[11].unlocked) buyUpgrade('r', 11);
		if (hasMilestone('w', 4) && player.r.auto_upgrade_2 && layers.r.upgrades[12].unlocked) buyUpgrade('r', 12);
		if (hasMilestone('w', 4) && player.r.auto_upgrade_3 && layers.r.upgrades[13].unlocked) buyUpgrade('r', 13);
	},
	effect() {
		let effBoost1 = new Decimal(1);
		let effex1 = new Decimal(1);
		let effBoost2 = new Decimal(1);
		let effBoost3 = new Decimal(1);
		if (getBuyableAmount('d', 12).gt(0)) {
			if (hasMilestone('s', 24)) effBoost1 = effBoost1.mul(new Decimal(2).pow(getBuyableAmount('d', 12)));
			else effBoost1 = effBoost1.mul(new Decimal(1.5).pow(getBuyableAmount('d', 12)));
		};
		if (challengeCompletions('r', 11) >= 3) {
			effBoost1 = effBoost1.mul(10000);
			effex1 = new Decimal(3.5);
		};
		if (challengeCompletions('r', 11) >= 4) effex1 = effex1.mul(player.r.relic_effects[1]);
		if (challengeCompletions('r', 11) >= 6) effex1 = effex1.mul(5);
		if (challengeCompletions('r', 11) >= 1) {
			effBoost2 = effBoost2.mul(player.r.relic_effects[0]);
			effBoost3 = effBoost3.mul(player.r.relic_effects[0]);
		};
		player.r.sanctummult = player.r.points.add(1).pow(0.5).mul(effBoost2);
		player.r.essencemult = player.r.points.mul(100).add(1).pow(0.25).mul(effBoost3);
		let eff1 = player.r.points.mul(effBoost1).add(1).pow(1.1).pow(effex1);
		if (eff1.gt(softcaps.r_eff1[0][0])) eff1 = eff1.sub(softcaps.r_eff1[0][0]).pow(softcaps.r_eff1[0][1]).add(softcaps.r_eff1[0][0]);
		return eff1;
	},
	effectDescription() {
		let text = ['', ''];
		if (tmp.r.effect.gte(softcaps.r_eff1[0][0])) text[0] = ' (softcapped)';
		if (challengeCompletions('r', 11) >= 2) text[1] = 'point and ';
		if (colorvalue[1] == 'none') return 'which makes Essence Influence\'s hardcap start ' + format(tmp.r.effect) + 'x later' + text[0] + ', multiplies sanctum gain by ' + format(player.r.sanctummult) + 'x, and also multiplies ' + text[1] + 'essence gain by ' + format(player.r.essencemult) + 'x';
		if (!colorvalue[0][2]) return 'which makes <h3>Essence Influence\'s</h3> hardcap start <h2 class="layer-r">' + format(tmp.r.effect) + '</h2>x later' + text[0] + ', multiplies sanctum gain by <h2 class="layer-r">' + format(player.r.sanctummult) + '</h2>x, and also multiplies ' + text[1] + 'essence gain by <h2 class="layer-r">' + format(player.r.essencemult) + '</h2>x';
		return 'which makes <h3 class="layer-e">Essence Influence\'s</h3> hardcap start <h2 class="layer-r">' + format(tmp.r.effect) + '</h2>x later' + text[0] + ', multiplies sanctum gain by <h2 class="layer-r">' + format(player.r.sanctummult) + '</h2>x, and also multiplies ' + text[1] + 'essence gain by <h2 class="layer-r">' + format(player.r.essencemult) + '</h2>x';
	},
	doReset(resettingLayer) {
		if (hasMilestone('m', 0) && resettingLayer == 'm') return;
		if (hasMilestone('gi', 0) && resettingLayer == 'gi') return;
		if (hasMilestone('ei', 0) && resettingLayer == 'ei') return;
		if (hasMilestone('w', 5) && resettingLayer == 'w') return;
		if (hasMilestone('cl', 1) && resettingLayer == 'cl') return;
		let keep = ['auto_activate', 'auto_upgrade_1', 'auto_upgrade_2', 'auto_upgrade_3'];
		let save = 0;
			if (hasMilestone('w', 2) && resettingLayer == 'w') {
				save = +challengeCompletions('r', 11);
				if (new Decimal(save).gt(player.r.points)) save = player.r.points.toNumber();
			};
			if (layers[resettingLayer].row > this.row) layerDataReset('r', keep);
			if (save > 0) {
				player.r.points = new Decimal(save);
				player.r.best = new Decimal(save);
				player.r.total = new Decimal(save);
				player.r.challenges[11] = save;
			};
		},
	resetsNothing() { return hasMilestone('w', 4) },
	update(diff) {
		player.r.lightreq = new Decimal(20000).mul(new Decimal(5).pow(challengeCompletions('r', 11)));
		let mult0 = new Decimal(1);
		if (challengeCompletions('r', 11) >= 11) mult0 = mult0.mul(2);
		if (challengeCompletions('r', 11) >= 14) mult0 = mult0.mul(2);
		if (challengeCompletions('r', 11) >= 15) mult0 = mult0.mul(1.2);
		if (challengeCompletions('r', 11) >= 16) mult0 = mult0.mul(1.1);
		if (challengeCompletions('r', 11) >= 18) mult0 = mult0.mul(1.05);
		if (challengeCompletions('r', 11) >= 19) mult0 = mult0.mul(1.02);
		if (challengeCompletions('r', 11) >= 20) mult0 = mult0.mul(1.01);
		if (challengeCompletions('r', 11) >= 25) mult0 = mult0.mul(1.001);
		player.r.relic_effects[0] = player.r.light.mul(10).add(1).pow(0.15).mul(mult0);
		player.r.relic_effects[1] = player.r.light.mul(1000).add(1).pow(0.05);
		let mult2 = new Decimal(1);
		if (challengeCompletions('r', 11) >= 7) mult2 = mult2.mul(4);
		if (challengeCompletions('r', 11) >= 8) mult2 = mult2.mul(2);
		player.r.relic_effects[2] = player.r.light.div(1000).add(1).pow(0.25).mul(mult2);
		player.r.relic_effects[3] = player.r.light.pow(0.0021);
		if (inChallenge('r', 11)) player.r.lightgain = getLightGain();
		else player.r.lightgain = getLightBoost();
		player.r.light = player.r.light.add(player.r.lightgain.mul(diff));
		if (player.r.light.gt(player.r.lightbest)) player.r.lightbest = player.r.light;
		if (player.r.lightgain.gt(player.r.lightgainbest)) player.r.lightgainbest = player.r.lightgain;
		if (!softcaps.r_l[0][1]) softcaps.r_l[0][1] = player.r.lightlastcap;
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"blank",
		["display-text",
			function() {
				text = 'relic resets reset everything on lower rows exept prayer milestones. also, you can still buy max sanctums.<br><br>';
				text += 'you have <h2 class="layer-r">' + player.r.points.sub(challengeCompletions('r', 11)).max(0) + '</h2> unactivated relics and <h2 class="layer-r">' + challengeCompletions('r', 11) + '</h2> activated relics';
				return text;
			}],
		"blank",
		"challenges",
		"blank",
		"upgrades",
	],
	challenges: {
		11: {
			name() {
				if (colorvalue[0][1]) return '<h3 class="layer-r">Activate Relics';
				return '<h3>Activate Relics';
			},
			buttonText: ["Activate", "Cannot activate", "Enter activation", "Enter activation"],
			challengeDescription: 'Temporarily converts all your point production into light production. Get enough light, and you can activate your relics for rewards.<br>',
			goalDescription() {
				if (maxedChallenge('r', 11)) text = 'You have ' + format(player.r.light) + ' light.<br>(' + format(player.r.lightgain) + '/sec)<br>';
				else text = 'You have ' + format(player.r.light) + '/' + format(player.r.lightreq) + ' light.<br>(' + format(player.r.lightgain) + '/sec)<br>';
				if (player.nerdMode) text += 'Best: (' + format(player.r.lightgainbest) + '/sec)<br>';
				return text;
			},
			rewardDescription() {
				let text = '';
				if (challengeCompletions('r', 11) >= 1 && challengeCompletions('r', 11) < 4) text += 'multiply relic\'s second and third effects based on your light<br>Currently: ' + format(player.r.relic_effects[0]) + 'x<br>';
				else if (challengeCompletions('r', 11) >= 5 && challengeCompletions('r', 11) < 12) text += 'multiply relic\'s second and third effects, exponentially increase relic\'s first effect, and also multiply Sacrificial Ceremony\'s last effect (all based on your light)<br>Currently: ' + format(player.r.relic_effects[0]) + 'x,<br>^' + format(player.r.relic_effects[1]) + ',<br>and ' + format(player.r.relic_effects[2]) + 'x<br>';
				else if (challengeCompletions('r', 11) >= 13) text += 'multiply relic\'s second and third effects and molecule gain, exponentially increase relic\'s first effect, multiply Sacrificial Ceremony\'s last effect, and also multiply relic gain (all based on your light)<br>Currently: ' + format(player.r.relic_effects[0]) + 'x,<br>^' + format(player.r.relic_effects[1]) + ',<br>' + format(player.r.relic_effects[2]) + 'x,<br>and ' + format(player.r.relic_effects[3]) + 'x<br>';
				if (challengeCompletions('r', 11) == 0) text += 'nothing currently<br><br>Next reward: multiply relic\'s second and third effects based on your light<br>Currently: ' + format(player.r.relic_effects[0]) + 'x';
				else if (challengeCompletions('r', 11) == 1) text += '<br>Next reward: relic\'s third effect also effects point gain';
				else if (challengeCompletions('r', 11) == 2) text += '<br>Next reward: multiply relic\'s first effect by 10,000 and raise it to ^3.5';
				else if (challengeCompletions('r', 11) == 3) text += '<br>Next reward: exponentially increase relic\'s first effect based on your light<br>Currently: ^' + format(player.r.relic_effects[1]);
				else if (challengeCompletions('r', 11) == 4) text += 'multiply relic\'s second and third effects based on your light, and also exponentially increase relic\'s first effect based on your light<br>Currently: ' + format(player.r.relic_effects[0]) + 'x<br>and ^' + format(player.r.relic_effects[1]) + '<br><br>Next reward: multiply Sacrificial Ceremony\'s last effect based on your light<br>Currently: ' + format(player.r.relic_effects[2]) + 'x';
				else if (challengeCompletions('r', 11) == 5) text += '<br>Next reward: raise relic\'s first effect to ^5';
				else if (challengeCompletions('r', 11) == 6) text += '<br>Next reward: quadruple the third activated relic effect';
				else if (challengeCompletions('r', 11) == 7) text += '<br>Next reward: double the third activated relic effect';
				else if (challengeCompletions('r', 11) == 8) text += '<br>Next reward: keep sanctum milestones on relic resets';
				else if (challengeCompletions('r', 11) == 9) {
					text += '<br>Next reward: unlock Molecules';
					if (player.m.unlocked) text += ' (already unlocked)';
				} else if (challengeCompletions('r', 11) == 10) text += '<br>Next reward: double the first activated relic effect';
				else if (challengeCompletions('r', 11) == 11) text += '<br>Next reward: the first activated relic effect also applies to molecule gain';
				else if (challengeCompletions('r', 11) == 12) text += 'multiply relic\'s second and third effects and molecule gain, exponentially increase relic\'s first effect, and also multiply Sacrificial Ceremony\'s last effect (all based on your light)<br>Currently: ' + format(player.r.relic_effects[0]) + 'x,<br>^' + format(player.r.relic_effects[1]) + ',<br>and ' + format(player.r.relic_effects[2]) + 'x<br><br>Next reward: multiply relic gain based on your light<br>Currently: ' + format(player.r.relic_effects[3]) + 'x';
				else if (challengeCompletions('r', 11) == 13) text += '<br>Next reward: double the first activated relic effect';
				else if (challengeCompletions('r', 11) == 14) text += '<br>Next reward: multiply the first activated relic<br>effect by 1.2';
				else if (challengeCompletions('r', 11) == 15) text += '<br>Next reward: multiply the first activated relic<br>effect by 1.1';
				else if (challengeCompletions('r', 11) == 16) text += '<br>Next reward: all <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> autobuyers work<br>twice as fast';
				else if (challengeCompletions('r', 11) == 17) text += '<br>Next reward: multiply the first activated relic<br>effect by 1.05';
				else if (challengeCompletions('r', 11) == 18) text += '<br>Next reward: multiply the first activated relic<br>effect by 1.02';
				else if (challengeCompletions('r', 11) == 19) text += '<br>Next reward: multiply the first activated relic<br>effect by 1.01';
				else if (challengeCompletions('r', 11) == 20) text += '<br>Next reward: essence is never reset';
				else if (challengeCompletions('r', 11) == 21) text += '<br>Next reward: auto <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrifice</b> works thrice as fast';
				else if (challengeCompletions('r', 11) == 22) text += '<br>Next reward: auto <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrifice</b> works twice as fast';
				else if (challengeCompletions('r', 11) == 23) text += '<br>Next reward: nothing';
				else if (challengeCompletions('r', 11) == 24) text += '<br>Next reward: relic resets don\'t reset cores';
				else if (challengeCompletions('r', 11) == 25) text += '<br>Next reward: nothing';
				else if (challengeCompletions('r', 11) == 26) text += '<br>Next reward: relic resets don\'t reset hexes';
				else if (challengeCompletions('r', 11) == 27) text += '<br>Next reward: nothing';
				else if (challengeCompletions('r', 11) == 28) text += '<br>Next reward: still nothing';
				else if (challengeCompletions('r', 11) == 29) text += '<br>Next reward: relic resets don\'t reset quarks';
				else if (challengeCompletions('r', 11) == 30) text += '<br>Next reward: nothing';
				else if (challengeCompletions('r', 11) == 31) text += '<br>Next reward: auto <b class="layer-s' + getdark(this, "ref", true, true) + 'Sacrifice</b> works twice as fast';
				else if (challengeCompletions('r', 11) == 32) text += '<br>Next reward: nothing';
				else if (challengeCompletions('r', 11) == 33) text += '<br>Next reward: still nothing';
				else if (challengeCompletions('r', 11) == 34) text += '<br>Next reward: relic resets don\'t reset subatomic particles';
				else if (challengeCompletions('r', 11) == 35) text += '<br>Next reward: nothing';
				else if (challengeCompletions('r', 11) == 36) text += '<br>Next reward: still nothing';
				else if (challengeCompletions('r', 11) == 37) text += '<br>Next reward: all <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> autobuyers work<br>twice as fast';
				else if (challengeCompletions('r', 11) == 38) text += '<br>Next reward: nothing';
				else if (challengeCompletions('r', 11) == 39) text += '<br>Next reward: still nothing';
				else if (challengeCompletions('r', 11) == 40) text += '<br>Next reward: all <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> autobuyers<br>can bulk buy 10x';
				else text += '<br>Next reward: you have gotten all the rewards!';
				return text;
			},
			canComplete() {
				return player.r.light.gte(player.r.lightreq) && challengeCompletions('r', 11) < this.completionLimit();
			},
			completionLimit() {
				return player.r.points;
			},
			style() {
				num = player.r.light.add(1).log(2).div(player.r.lightreq.add(1).log(2)).mul(100).floor();
				color = 'rgb(' + num + ',' + num + ',' + (num + 50) + ')';
				if (maxedChallenge('r', 11)) color = 'rgb(0,0,50)';
				if (num > 205) color = 'rgb(205,205,255)';
				textcolor = '#B9A975';
				if (colorvalue[1] == 'none') textcolor = '#DFDFDF';
				return {'background-color':color,'color':textcolor,'border-radius':'16%','height':'425px','width':'425px'};
			},
		},
	},
	upgrades: {
		11: {
			fullDisplay() {
				let text = '';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.3';
				return '<h3 class="layer-r' + getdark(this, "title-hasend") + 'Brighter Light</h3><br>multiplies light gain based on your sanctums<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: ' + format(1e12) + ' light';
			},
			canAfford() { return player.r.light.gte(1e12) },
			pay() {
				player.r.light = player.r.light.sub(1e12);
			},
			effect() {
				return player.s.points.add(1).pow(0.3);
			},
			unlocked() { return hasMilestone('gi', 0) },
		},
		12: {
			fullDisplay() {
				let text = '';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.1';
				return '<h3 class="layer-r' + getdark(this, "title-hasend") + 'Light of Light</h3><br>multiplies light gain based on your light<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: ' + format(1e13) + ' light';
			},
			canAfford() { return player.r.light.gte(1e13) },
			pay() {
				player.r.light = player.r.light.sub(1e13);
			},
			effect() {
				return player.r.light.add(1).pow(0.1);
			},
			unlocked() { return hasMilestone('gi', 0) },
		},
		13: {
			fullDisplay() {
				let text = '';
				if (player.nerdMode) text += ' <br>formula: (x*36+1)^10';
				return '<h3 class="layer-r' + getdark(this, "title-hasend") + 'Good Light</h3><br>(based on your good influence) sets base light gain after softcap to:<br>' + format(this.effect()) + '/sec' + text + '<br><br>Cost: free<br>WARNING: may decrease light gain';
			},
			canAfford() { return true },
			effect() {
				return player.gi.points.mul(36).add(1).pow(10);
			},
			unlocked() { return hasMilestone('gi', 0) && player.r.lightbest.gte(1e20) },
		},
	},
});

addLayer('m', {
	name: 'Molecules',
	symbol: 'M',
	position: 2,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		unique_nonextra: new Decimal(0),
		unique_extra: new Decimal(0),
		unique_total: new Decimal(0),
		auto_upgrades: false,
	}},
	color: "#00CCCC",
	branches: ['cl'],
	requires: 30000,
	resource: 'molecules',
	baseResource: 'atoms',
	baseAmount() { return player.a.points },
	type: 'normal',
	exponent: 0.9,
	gainMult() {
		let mult = new Decimal(1);
		if (challengeCompletions('r', 11) >= 12) mult = mult.mul(player.r.relic_effects[0]);
		if (new Decimal(tmp.w.effect[1]).gt(1)) mult = mult.mul(tmp.w.effect[1]);
		if (getBuyableAmount('w', 21).gt(0)) mult = mult.mul(buyableEffect('w', 21));
		return mult;
	},
	row: 4,
	hotkeys: [
		{key: 'm', description: 'M: Reset for molecules', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return challengeCompletions('r', 11) >= 10 || player.m.unlocked },
	passiveGeneration() {
		let gen = 0;
		if (hasMilestone('m', 20)) {
			gen += 0.1;
			if (hasMilestone('m', 21)) {
				gen += 0.4;
			};
		};
		return gen;
	},
	automate() {
		if (hasMilestone('w', 2) && player.m.auto_upgrades) {
			for (const id in layers.m.upgrades) {
				if (layers.m.upgrades[id].unlocked) buyUpgrade('m', id);
			};
		};
	},
	effect() {
		let eff = player.m.best.mul(0.5).add(1).pow(0.99);
		let sc_start0 = softcaps.m_eff[0][0];
		if (eff.gt(sc_start0)) eff = eff.sub(sc_start0).pow(softcaps.m_eff[0][1]).add(sc_start0);
		return eff;
	},
	effectDescription() {
		let softcap = '';
		if (tmp.m.effect.gt(softcaps.m_eff[0][0])) softcap = ' (softcapped)';
		return 'which multiplies atom gain by <h2 class="layer-m">' + format(tmp.m.effect) + '</h2>x (based on best)' + softcap;
	},
	doReset(resettingLayer) {
		if (hasMilestone('w', 6) && resettingLayer == 'w') return;
		let keep = ['auto_upgrades'];
			if (hasMilestone('w', 0) && resettingLayer == 'w') keep.push('milestones');
			if (hasMilestone('cl', 4) && resettingLayer == 'cl') keep.push('milestones');
			if (layers[resettingLayer].row > this.row) layerDataReset('m', keep);
		},
	update(diff) {
		let effnon = new Decimal(player.m.upgrades.length);
		if (hasUpgrade('m', 42)) effnon = effnon.mul(upgradeEffect('m', 42));
		player.m.unique_nonextra = effnon;
		let effex = new Decimal(0);
		if (hasUpgrade('m', 31) && upgradeEffect('m', 31).gt(0)) effex = effex.add(upgradeEffect('m', 31));
		if (hasUpgrade('m', 32) && upgradeEffect('m', 32).gt(0)) effex = effex.add(upgradeEffect('m', 32));
		if (hasUpgrade('m', 41) && upgradeEffect('m', 41).gt(0)) effex = effex.add(upgradeEffect('m', 41));
		if (hasUpgrade('m', 51) && upgradeEffect('m', 51).gt(0)) effex = effex.add(upgradeEffect('m', 51));
		if (hasUpgrade('m', 53) && upgradeEffect('m', 53).gt(0)) effex = effex.add(upgradeEffect('m', 53));
		player.m.unique_extra = effex;
		player.m.unique_total = player.m.unique_nonextra.add(player.m.unique_extra);
	},
	tabFormat: {
		"Microscope": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				"milestones",
			],
		},
		"Constructor": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				["display-text",
					function() {
						if (player.m.unique_extra.gt(0)) return 'You have <h2 class="layer-m">' + formatWhole(player.m.unique_nonextra) + '</h2><h3 class="layer-m-light">+' + formatWhole(player.m.unique_extra) + '</h3> total unique molecules';
						return 'You have <h2 class="layer-m">' + formatWhole(player.m.unique_nonextra) + '</h2> total unique molecules';
					}],
				"blank",
				"upgrades",
			],
		},
	},
	milestones: {
		0: {
			requirementDescription: '1 molecule',
			effectDescription: 'molecules don\'t reset relics, and<br>you can autobuy essence rebuyables',
			done() { return player.m.points.gte(1) },
			toggles: [['e', 'auto_buyables']],
		},
		1: {
			requirementDescription: '2 total molecules',
			effectDescription: 'keep demon soul challenges and<br><b class="layer-ds' + getdark(this, "ref", true, true) + 'Demonic Key</b> on row 5 resets,<br>and you can autobuy hex upgrades',
			done() { return player.m.total.gte(2) },
			toggles: [['h', 'auto_upgrades']],
		},
		2: {
			requirementDescription: '3 total molecules',
			effectDescription: 'molecules don\'t reset essence, and<br>you can autobuy essence upgrades',
			done() { return player.m.total.gte(3) },
			toggles: [['e', 'auto_upgrades']],
		},
		3: {
			requirementDescription: '4 total molecules',
			effectDescription: 'gain 0.1% of best light gain per second',
			done() { return player.m.total.gte(4) },
		},
		4: {
			requirementDescription: '5 total molecules',
			effectDescription: 'molecules don\'t reset cores, and<br>you can autobuy subatomic<br>particle upgrades and rebuyables',
			done() { return player.m.total.gte(5) },
			toggles: [['sp', 'auto_upgrades'], ['sp', 'auto_buyables']],
		},
		5: {
			requirementDescription: '7 total molecules',
			effectDescription: 'molecules don\'t reset quarks, and<br>you can autobuy demon soul upgrades',
			done() { return player.m.total.gte(7) },
			toggles: [['ds', 'auto_upgrades']],
		},
		6: {
			requirementDescription: '10 total molecules',
			effectDescription: 'you can autobuy demon soul rebuyables',
			done() { return player.m.total.gte(10) },
			toggles: [['ds', 'auto_buyables']],
		},
		7: {
			requirementDescription: '15 total molecules',
			effectDescription: 'gain +0.9% of best light gain per second',
			done() { return player.m.total.gte(15) },
		},
		8: {
			requirementDescription: '25 total molecules',
			effectDescription: 'unlock 3 more sanctum milestones',
			done() { return player.m.total.gte(25) },
		},
		9: {
			requirementDescription: '50 total molecules',
			effectDescription() {
				return 'keep the <b class="layer-s' + getdark(this, "ref", true, true) + '1st sanctum milestone</b><br>on molecule resets';
			},
			done() { return player.m.total.gte(50) },
		},
		10: {
			requirementDescription: '125 total molecules',
			effectDescription: 'keep 5 sanctums on molecule resets',
			done() { return player.m.total.gte(125) },
		},
		11: {
			requirementDescription: '500 total molecules',
			effectDescription: 'hardcapped atom upgrades always<br>have max effect',
			done() { return player.m.total.gte(500) },
		},
		12: {
			requirementDescription: '4,500 total molecules',
			effectDescription: 'keep atom milestones on molecule resets',
			done() { return player.m.total.gte(4500) },
		},
		13: {
			requirementDescription: '50,000 total molecules',
			effectDescription: 'molecules don\'t reset hexes',
			done() { return player.m.total.gte(50000) },
		},
		14: {
			requirementDescription: '750,000 total molecules',
			effectDescription: 'molecules don\'t reset demon souls',
			done() { return player.m.total.gte(750000) },
		},
		15: {
			requirementDescription: '15,000,000 total molecules',
			effectDescription: 'gain +1.5% of best light gain per second',
			done() { return player.m.total.gte(15000000) },
		},
		16: {
			requirementDescription: '450,000,000 total molecules',
			effectDescription: 'gain +2.5% of best light gain per second',
			done() { return player.m.total.gte(450000000) },
		},
		17: {
			requirementDescription: '2.5e10 total molecules',
			effectDescription: 'gain +5% of best light gain per second',
			done() { return player.m.total.gte(2.5e10) },
		},
		18: {
			requirementDescription: '2.5e12 total molecules',
			effectDescription: 'keep 25 more sanctums (30 total)<br>on molecule resets',
			done() { return player.m.total.gte(2.5e12) },
		},
		19: {
			requirementDescription: '4e14 total molecules',
			effectDescription: 'keep 185 more sanctums (215 total)<br>on molecule resets',
			done() { return player.m.total.gte(4e14) },
		},
		20: {
			requirementDescription: '7.5e16 total molecules',
			effectDescription: 'gain +10% of your molecule gain per second',
			done() { return player.m.total.gte(7.5e16) },
		},
		21: {
			requirementDescription: '1.5e19 total molecules',
			effectDescription: 'gain +40% of your molecule gain per second',
			done() { return player.m.total.gte(1.5e19) },
		},
	},
	upgrades: {
		11: {
			title() {
				return '<b class="layer-m' + getdark(this, "title-light") + 'Oxygen Gas';
			},
			description: 'multiplies essence gain based on your best molecules',
			cost: 1,
			effect() {
				return player.m.best.mul(100).add(1).pow(0.5);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x*100+1)^0.5';
				return text;
			},
		},
		12: {
			title() {
				return '<b class="layer-m' + getdark(this, "title-light") + 'Carbon Monoxide';
			},
			description: 'multiplies demon soul gain based on your best molecules',
			cost: 5,
			effect() {
				return player.m.best.mul(10).add(1).pow(0.2);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x*10+1)^0.2';
				return text;
			},
		},
		13: {
			title() {
				return '<b class="layer-m' + getdark(this, "title-light") + 'Carbon Dioxide';
			},
			description: 'multiplies quark gain based on your best molecules',
			cost: 10,
			effect() {
				return player.m.best.mul(50).add(1).pow(0.4);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x*50+1)^0.4';
				return text;
			},
		},
		21: {
			fullDisplay() {
				let text = '';
				if (player.nerdMode) text += ' <br>formula: (x*25+1)^0.3';
				return '<h3 class="layer-m' + getdark(this, "title-light", true) + 'Hydrogen Gas</h3><br>multiplies core gain based on your best molecules<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: 360,000 atoms';
			},
			canAfford() { return player.a.points.gte(360000) },
			pay() {
				player.a.points = player.a.points.sub(360000);
			},
			effect() {
				return player.m.best.mul(25).add(1).pow(0.3);
			},
		},
		22: {
			title() {
				return '<b class="layer-m' + getdark(this, "title-light") + 'H<tag style="font-size:10px">2</tag>O, aka Water';
			},
			description: 'multiplies essence gain based on your total unique molecules',
			cost: 125,
			effect() {
				return player.m.unique_total.add(1).mul(5);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)*5';
				return text;
			},
		},
		23: {
			fullDisplay() {
				let text = '';
				if (player.nerdMode) text += ' <br>formula: (x*250+1)^0.1';
				return '<h3 class="layer-m' + getdark(this, "title-light", true) + 'Ammonia</h3><br>multiplies hex gain based on your best molecules<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: 4,600,000 atoms';
			},
			canAfford() { return player.a.points.gte(4600000) },
			pay() {
				player.a.points = player.a.points.sub(4600000);
			},
			effect() {
				return player.m.best.mul(250).add(1).pow(0.1);
			},
		},
		31: {
			title() {
				return '<b class="layer-m' + getdark(this, "title-light") + 'Nitrogen Gas';
			},
			description: 'gives extra unique molecules based on your non-extra ones\' amount and worth',
			cost: 250,
			effect() {
				return player.m.unique_nonextra.div(2).add(1).floor();
			},
			effectDisplay() {
				let text = '+' + formatWhole(this.effect());
				if (player.nerdMode) text += ' <br>formula: (x*y)/2+1';
				return text;
			},
			unlocked() { return hasUpgrade('m', 21) && hasUpgrade('m', 22) && hasUpgrade('m', 23) },
		},
		32: {
			fullDisplay() {
				let text = '';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.2';
				return '<h3 class="layer-m' + getdark(this, "title-light", true) + 'NaCl, aka Salt</h3><br>gives extra unique molecules based on your atoms<br>Currently: +' + formatWhole(this.effect()) + text + '<br><br>Cost: 7,777,777 atoms';
			},
			canAfford() { return player.a.points.gte(7777777) },
			pay() {
				player.a.points = player.a.points.sub(7777777);
			},
			effect() {
				return player.a.points.add(1).pow(0.2).floor();
			},
			unlocked() { return hasUpgrade('m', 21) && hasUpgrade('m', 22) && hasUpgrade('m', 23) },
		},
		33: {
			fullDisplay() {
				let text = '';
				if (player.nerdMode) text += ' <br>formula: x*1000';
				return '<h3 class="layer-m' + getdark(this, "title-light", true) + 'O<tag style="font-size:10px">3</tag>, aka Ozone</h3><br>multiplies demon soul gain based on your total unique molecules<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: ' + format(1e10) + ' atoms';
			},
			canAfford() { return player.a.points.gte(1e10) },
			pay() {
				player.a.points = player.a.points.sub(1e10);
			},
			effect() {
				return player.m.unique_total.mul(1000);
			},
			unlocked() { return hasUpgrade('m', 21) && hasUpgrade('m', 22) && hasUpgrade('m', 23) },
		},
		41: {
			title() {
				return '<b class="layer-m' + getdark(this, "title-light") + 'Methane Gas';
			},
			description: 'gives extra unique molecules based on your demon souls',
			cost: 25000000,
			effect() {
				return player.ds.points.pow(10).log(10).add(1).floor();
			},
			effectDisplay() {
				let text = '+' + formatWhole(this.effect());
				if (player.nerdMode) text += ' <br>formula: log(x^10)+1';
				return text;
			},
			unlocked() { return hasUpgrade('m', 31) && hasUpgrade('m', 32) && hasUpgrade('m', 33) },
		},
		42: {
			title() {
				return '<b class="layer-m' + getdark(this, "title-light") + 'Calcium Oxide';
			},
			description: 'non-extra unique molecules are worth more based on your relics',
			cost: 50000000,
			effect() {
				return player.r.points.mul(5).add(1).pow(2);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x*5+1)^2';
				return text;
			},
			unlocked() { return hasUpgrade('m', 31) && hasUpgrade('m', 32) && hasUpgrade('m', 33) },
		},
		43: {
			fullDisplay() {
				let text = '';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.01';
				return'<h3 class="layer-m' + getdark(this, "title-light", true) + 'Calcium Hydroxide</h3><br>multiplies relic gain based on your extra unique molecules<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: ' + format(1.61e10) + ' atoms';
			},
			canAfford() { return player.a.points.gte(1.61e10) },
			pay() {
				player.a.points = player.a.points.sub(1.61e10);
			},
			effect() {
				return player.m.unique_extra.add(1).pow(0.01);
			},
			unlocked() { return hasUpgrade('m', 31) && hasUpgrade('m', 32) && hasUpgrade('m', 33) },
		},
		51: {
			title() {
				return '<b class="layer-m' + getdark(this, "title-light") + 'Neon Gas';
			},
			description: 'gives extra unique molecules based on your total good influence',
			cost: 1e13,
			effect() {
				return player.gi.total.add(1).pow(2.5).floor();
			},
			effectDisplay() {
				let text = '+' + formatWhole(this.effect());
				if (player.nerdMode) text += ' <br>formula: (x+1)^2.5';
				return text;
			},
			unlocked() { return hasMilestone('gi', 11) },
		},
		52: {
			title() {
				return '<b class="layer-m' + getdark(this, "title-light") + 'Sodium Oxide';
			},
			description: 'multiplies point gain based on your total unique molecules',
			cost: 1e14,
			effect() {
				return player.m.unique_total.add(1).pow(25);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^25';
				return text;
			},
			unlocked() { return hasMilestone('gi', 11) },
		},
		53: {
			title() {
				return '<b class="layer-m' + getdark(this, "title-light") + 'F<tag style="font-size:10px">2</tag>, Fluorine';
			},
			description: 'gives extra unique molecules based on your atoms',
			cost: 1e13,
			effect() {
				return player.a.points.add(1).pow(0.45).floor();
			},
			effectDisplay() {
				let text = '+' + formatWhole(this.effect());
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.45';
				return text;
			},
			unlocked() { return hasMilestone('gi', 11) },
		},
	},
});

addLayer('gi', {
	name: 'Good Influence',
	symbol: 'GI',
	position: 1,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		req_devotion: new Decimal(1),
		auto_buyables: false,
		auto_prestige: false,
	}},
	color: "#08FF87",
	branches: ['w'],
	requires: 15,
	resource: 'good influence',
	baseResource: 'relics',
	baseAmount() { return player.r.points },
	type: 'static',
	exponent: 1,
	canBuyMax() { return true },
	gainExp() {
		let gain = new Decimal(1);
		if (player.gi.req_devotion.gt(1)) gain = gain.mul(player.gi.req_devotion);
		if (hasUpgrade('ei', 24)) gain = gain.mul(upgradeEffect('ei', 24));
		if (new Decimal(tmp.w.effect[1]).gt(1)) gain = gain.mul(tmp.w.effect[1]);
		if (getBuyableAmount('w', 11).gt(0)) gain = gain.mul(buyableEffect('w', 11)[0]);
		if (getBuyableAmount('w', 13).gt(0)) gain = gain.mul(buyableEffect('w', 13));
		return gain;
	},
	autoPrestige() { return hasMilestone('w', 1) && (!hasMilestone('cl', 0) || player.gi.auto_prestige) },
	row: 4,
	hotkeys: [
		{key: 'G', description: 'Shift-G: Reset for good influence', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return player.m.unlocked || player.gi.unlocked },
	automate() {
		if (hasMilestone('w', 0) && player.gi.auto_buyables) {
			if (layers.gi.buyables[11].canAfford()) {
				layers.gi.buyables[11].buy();
			};
			if (layers.gi.buyables[12].unlocked() && layers.gi.buyables[12].canAfford()) {
				layers.gi.buyables[12].buy();
			};
		};
	},
	effect() {
		let effBase = new Decimal(2);
		if (getBuyableAmount('gi', 11).gt(0)) effBase = effBase.add(getBuyableAmount('gi', 11));
		let eff = effBase.pow(player.gi.total);
		if (eff.gt(softcaps.gi_eff[0][0])) {
			eff = eff.sub(softcaps.gi_eff[0][0]).pow(softcaps.gi_eff[0][1]).add(softcaps.gi_eff[0][0]);
		};
		return eff;
	},
	effectDescription() {
		let text = 'which multiplies prayer gain by <h2 class="layer-gi">' + format(tmp.gi.effect) + '</h2>x (based on total)';
		if (this.effect().gte(softcaps.gi_eff[0][0])) text += ' (softcapped)';
		return text;
	},
	doReset(resettingLayer) {
		if (hasMilestone('w', 8) && resettingLayer == 'w') return;
		if (hasMilestone('cl', 4) && resettingLayer == 'cl') return;
		let keep = ['auto_buyables', 'auto_prestige'];
			if (hasMilestone('w', 1) && resettingLayer == 'w') keep.push('milestones');
			if (hasMilestone('cl', 0) && resettingLayer == 'cl') keep.push('milestones');
			if (layers[resettingLayer].row > this.row) layerDataReset('gi', keep);
		},
	resetsNothing() { return hasMilestone('gi', 16) },
	update(diff) {
		let ex = 0.2;
		if (hasMilestone('gi', 12)) ex = 0.22;
		let eff = player.s.devotion.mul(1.05).add(1).pow(ex);
		player.gi.req_devotion = eff;
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"blank",
		["display-text",
			function() {
				if (player.nerdMode) return 'you have <h2 class="layer-s">' + format(player.s.devotion) + '</h2> devotion, which multiplies good influence gain by <h2 class="layer-gi">' + format(player.gi.req_devotion) + '</h2>x (formula: (x*1.05+1)^0.2)';
				return 'you have <h2 class="layer-s">' + format(player.s.devotion) + '</h2> devotion, which multiplies good influence gain by <h2 class="layer-gi">' + format(player.gi.req_devotion) + '</h2>x';
			}],
		"blank",
		"milestones",
		"buyables",
		"blank",
	],
	milestones: {
		0: {
			requirementDescription: '1 good influence',
			effectDescription: 'unlock relic upgrades, and good<br>influence resets don\'t reset relics',
			done() { return player.gi.points.gte(1) },
		},
		1: {
			requirementDescription: '2 good influence',
			effectDescription: 'good influence resets don\'t reset essence',
			done() { return player.gi.points.gte(2) },
		},
		2: {
			requirementDescription: '3 good influence',
			effectDescription: 'good influence resets don\'t reset cores',
			done() { return player.gi.points.gte(3) },
			unlocked() { return hasMilestone('gi', 0) },
		},
		3: {
			requirementDescription: '4 good influence',
			effectDescription: 'good influence resets don\'t reset quarks',
			done() { return player.gi.points.gte(4) },
			unlocked() { return hasMilestone('gi', 1) },
		},
		4: {
			requirementDescription: '5 good influence',
			effectDescription: 'good influence resets don\'t reset hexes',
			done() { return player.gi.points.gte(5) },
			unlocked() { return hasMilestone('gi', 2) },
		},
		5: {
			requirementDescription: '6 good influence',
			effectDescription: 'good influence resets don\'t reset demon souls',
			done() { return player.gi.points.gte(6) },
			unlocked() { return hasMilestone('gi', 3) },
		},
		6: {
			requirementDescription: '8 good influence',
			effectDescription: 'keep 4 sanctums on good influence resets',
			done() { return player.gi.points.gte(8) },
			unlocked() { return hasMilestone('gi', 4) },
		},
		7: {
			requirementDescription: '10 good influence',
			effectDescription: 'keep 3 more sanctums (7 total) on good influence resets',
			done() { return player.gi.points.gte(10) },
			unlocked() { return hasMilestone('gi', 5) },
		},
		8: {
			requirementDescription: '12 good influence',
			effectDescription: 'keep 3 more sanctums (10 total) on good influence resets',
			done() { return player.gi.points.gte(12) },
			unlocked() { return hasMilestone('gi', 6) },
		},
		9: {
			requirementDescription: '15 good influence',
			effectDescription: 'keep 6 more sanctums (16 total) on good influence resets',
			done() { return player.gi.points.gte(15) },
			unlocked() { return hasMilestone('gi', 7) },
		},
		10: {
			requirementDescription: '18 good influence',
			effectDescription() {
				return 'all <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> autobuyers work twice as fast';
			},
			done() { return player.gi.points.gte(18) },
			unlocked() { return hasMilestone('gi', 8) },
		},
		11: {
			requirementDescription: '21 good influence',
			effectDescription: 'you can explore 3 further molecule upgrades,<br>and you can autobuy atom upgrades',
			done() { return player.gi.points.gte(21) },
			toggles: [['a', 'auto_upgrades']],
			unlocked() { return hasMilestone('gi', 9) },
		},
		12: {
			requirementDescription: '22 good influence and<br>555 total good influence',
			effectDescription() {
				return 'increase <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b>\'s effect exponent<br>on good influence gain<br>0.2 --> 0.22';
			},
			done() { return player.gi.points.gte(22) && player.gi.total.gte(555) },
			unlocked() { return hasMilestone('gi', 10) },
		},
		13: {
			requirementDescription: '28 good influence and<br>1,000 total good influence',
			effectDescription: 'keep 14 more sanctums (30 total)<br>on good influence resets',
			done() { return player.gi.points.gte(28) && player.gi.total.gte(1000) },
			unlocked() { return hasMilestone('gi', 12) },
		},
		14: {
			requirementDescription: '32 good influence and<br>1,500 total good influence',
			effectDescription: 'keep 55 more sanctums (85 total)<br>on good influence resets',
			done() { return player.gi.points.gte(32) && player.gi.total.gte(1500) },
			unlocked() { return hasMilestone('gi', 13) },
		},
		15: {
			requirementDescription: '33 good influence and<br>1,750 total good influence',
			effectDescription: 'keep 130 more sanctums (215 total)<br>on good influence resets',
			done() { return player.gi.points.gte(33) && player.gi.total.gte(1750) },
			unlocked() { return hasMilestone('gi', 14) },
		},
		16: {
			requirementDescription: '36 good influence and<br>2,000 total good influence',
			effectDescription: 'good influence resets nothing',
			done() { return player.gi.points.gte(36) && player.gi.total.gte(2000) },
			unlocked() { return hasMilestone('gi', 15) },
		},
		17: {
			requirementDescription: '50 good influence and<br>6,400 total good influence',
			effectDescription() {
				return 'all <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> autobuyers can bulk buy 2x';
			},
			done() { return player.gi.points.gte(50) && player.gi.total.gte(6400) },
			unlocked() { return hasMilestone('gi', 16) },
		},
	},
	buyables: {
		11: {
			cost() {
				return getBuyableAmount('gi', 11).add(1);
			},
			title() {
				return '<h3 class="layer-gi' + getdark(this, "title-buyable") + 'Better Good';
			},
			canAfford() {
				return player.gi.points.gte(this.cost()) && getBuyableAmount('gi', 11).lt(this.purchaseLimit);
			},
			purchaseLimit: 8,
			buy() {
				player.gi.points = player.gi.points.sub(this.cost());
				setBuyableAmount('gi', 11, getBuyableAmount('gi', 11).add(1));
			},
			display() {
				return 'increases the good influence effect base by 1 per this upgrade bought.<br>Currently: +' + format(getBuyableAmount('gi', 11)) + '<br><br>Cost: ' + formatWhole(this.cost()) + ' good influence<br><br>Bought: ' + formatWhole(getBuyableAmount('gi', 11));
			},
		},
		12: {
			cost() {
				return getBuyableAmount('gi', 12).div(5).add(1).floor();
			},
			title() {
				return '<h3 class="layer-gi' + getdark(this, "title-buyable") + 'Drive out Evil';
			},
			canAfford() {
				return player.gi.points.gte(this.cost()) && getBuyableAmount('gi', 12).lt(this.purchaseLimit());
			},
			purchaseLimit() {
				return player.ds.points.add(1).log(10).div(12.5).floor();
			},
			buy() {
				player.gi.points = player.gi.points.sub(this.cost());
				setBuyableAmount('gi', 12, getBuyableAmount('gi', 12).add(1));
			},
			display() {
				if (player.nerdMode) return 'multiplies essence gain based on the amount of this upgrade bought.<br>Currently: ' + format(new Decimal(10).pow(getBuyableAmount('gi', 12).pow(1.5))) + 'x<br>formula: 10^(x^1.5)<br><br>Cost: ' + formatWhole(this.cost()) + ' good influence<br><br>Bought: ' + formatWhole(getBuyableAmount('gi', 12)) + '/' + formatWhole(this.purchaseLimit()) + '<br>limit formula: log10(x+1)/12.5 (floored) where x is demon souls';
				return 'multiplies essence gain based on the amount of this upgrade bought.<br>Currently: ' + format(new Decimal(10).pow(getBuyableAmount('gi', 12).pow(1.5))) + 'x<br><br>Cost: ' + formatWhole(this.cost()) + ' good influence<br><br>Bought: ' + formatWhole(getBuyableAmount('gi', 12)) + '/' + formatWhole(this.purchaseLimit());
			},
			unlocked() { return getBuyableAmount('gi', 11).gte(8) },
		},
	},
});

addLayer('ei', {
	name: 'Evil Influence',
	symbol: 'EI',
	position: 0,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
		power: new Decimal(0),
		auto_upgrades: false,
		auto_prestige: false,
	}},
	color: "#FF4400",
	branches: ['w'],
	requires: 'e3000',
	resource: 'evil influence',
	baseResource: 'demon souls',
	baseAmount() { return player.ds.points },
	type: 'static',
	exponent() {
		if (hasUpgrade('ei', 83)) return 5.75;
		if (hasUpgrade('ei', 73)) return 6.25;
		if (hasUpgrade('ei', 63)) return 6.45;
		if (hasUpgrade('ei', 53)) return 6.55;
		if (hasUpgrade('ei', 43)) return 6.75;
		if (hasUpgrade('ei', 33)) return 7;
		if (hasUpgrade('ei', 23)) return 7.25;
		if (hasUpgrade('ei', 13)) return 7.75;
		return 12;
	},
	canBuyMax() { return true },
	gainExp() {
		let gain = new Decimal(1);
		if (hasUpgrade('ei', 11)) gain = gain.mul(upgradeEffect('ei', 11));
		if (hasUpgrade('ei', 21)) gain = gain.mul(upgradeEffect('ei', 21));
		if (hasUpgrade('ei', 31)) gain = gain.mul(upgradeEffect('ei', 31));
		if (hasUpgrade('ei', 41)) gain = gain.mul(upgradeEffect('ei', 41));
		if (hasUpgrade('ei', 54)) gain = gain.mul(upgradeEffect('ei', 54));
		if (hasUpgrade('ei', 64)) gain = gain.mul(upgradeEffect('ei', 64));
		if (hasChallenge('ei', 22)) gain = gain.mul(1.75);
		if (new Decimal(tmp.w.effect[1]).gt(1)) gain = gain.mul(tmp.w.effect[1]);
		if (getBuyableAmount('w', 11).gt(0)) gain = gain.mul(buyableEffect('w', 11)[1]);
		if (getBuyableAmount('w', 12).gt(0)) gain = gain.mul(buyableEffect('w', 12));
		return gain;
	},
	autoPrestige() { return hasMilestone('w', 3) && (!hasMilestone('cl', 0) || player.ei.auto_prestige) },
	row: 4,
	hotkeys: [
		{key: 'E', description: 'Shift-E: Reset for evil influence', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return player.gi.unlocked || player.ei.unlocked },
	automate() {
		if (hasMilestone('w', 1) && player.ei.auto_upgrades) {
			for (const id in layers.ei.upgrades) {
				if (layers.ei.upgrades[id].unlocked) buyUpgrade('ei', id);
			};
		};
	},
	effect() {
		let effBase = new Decimal(2);
		if (hasUpgrade('ei', 15)) effBase = new Decimal(4);
		if (hasUpgrade('ei', 25)) effBase = new Decimal(6);
		if (hasUpgrade('ei', 35)) effBase = new Decimal(8);
		if (hasUpgrade('ei', 45)) effBase = new Decimal(10);
		let eff = effBase.pow(player.ei.points).sub(1);
		// mul
		if (hasUpgrade('ei', 12)) eff = eff.mul(upgradeEffect('ei', 12));
		if (hasUpgrade('ei', 14)) eff = eff.mul(upgradeEffect('ei', 14));
		if (hasUpgrade('ei', 22)) eff = eff.mul(upgradeEffect('ei', 22));
		if (hasUpgrade('ei', 32)) eff = eff.mul(upgradeEffect('ei', 32));
		if (hasUpgrade('ei', 42)) eff = eff.mul(upgradeEffect('ei', 42));
		if (hasUpgrade('ei', 44)) eff = eff.mul(upgradeEffect('ei', 44));
		if (hasUpgrade('ei', 52)) eff = eff.mul(upgradeEffect('ei', 52));
		if (hasUpgrade('ei', 62)) eff = eff.mul(upgradeEffect('ei', 62));
		if (hasUpgrade('ei', 72)) eff = eff.mul(upgradeEffect('ei', 72));
		if (hasUpgrade('ei', 74)) eff = eff.mul(upgradeEffect('ei', 74));
		// div
		if (inChallenge('ei', 11)) eff = eff.div(1000);
		if (inChallenge('ei', 12)) eff = eff.div(100000000);
		if (inChallenge('ei', 21)) eff = eff.div(1e15);
		// exp
		if (hasChallenge('ei', 11)) eff = eff.pow(1.075);
		if (hasChallenge('ei', 12)) eff = eff.pow(1.075);
		return eff;
	},
	effectDescription() {
		return 'which generates <h2 class="layer-ei">' + formatSmall(tmp.ei.effect) + '</h2> evil power per second';
	},
	doReset(resettingLayer) {
		if (hasMilestone('cl', 3) && resettingLayer == 'cl') return;
		let keep = ['auto_upgrades', 'auto_prestige'];
			if (hasMilestone('w', 2) && resettingLayer == 'w') keep.push('milestones');
			if (hasMilestone('w', 3) && resettingLayer == 'w') keep.push('challenges');
			if (hasMilestone('cl', 0) && resettingLayer == 'cl') keep.push('milestones');
			if (layers[resettingLayer].row > this.row) layerDataReset('ei', keep);
		},
	resetsNothing() { return hasChallenge('ei', 12) },
	update(diff) {
		if (tmp.ei.effect.gt(0)) {
			player.ei.power = player.ei.power.add(tmp.ei.effect.mul(diff));
		};
	},
	tabFormat: {
		"Cycle of Evil": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				["display-text",
					function() {
						return 'You have <h2 class="layer-ei">' + formatSmall(player.ei.power) + '</h2> evil power';
					}],
				"blank",
				"milestones",
				"upgrades",
			],
		},
		"Gate of Evil": {
			content: function() {
				if (this.unlocked) return [
					"main-display",
					"prestige-button",
					"resource-display",
					"blank",
					["display-text", 'You have <h2 class="layer-ei">' + formatSmall(player.ei.power) + '</h2> evil power'],
					"blank",
					"blank",
					"challenges",
					"blank",
				];
				return [
					"main-display",
					"prestige-button",
					"resource-display",
					"blank",
					["display-text", 'You have <h2 class="layer-ei">' + formatSmall(player.ei.power) + '</h2> evil power'],
					"blank",
					"milestones",
					"upgrades",
				];
			},
			unlocked() {
				return hasMilestone('ei', 5) || player.ei.activeChallenge;
			},
		},
	},
	milestones: {
		0: {
			requirementDescription: '2 total evil influence',
			effectDescription: 'evil influence resets don\'t reset relics',
			done() { return player.ei.total.gte(2) },
		},
		1: {
			requirementDescription: '8 total evil influence and 5,000 evil power',
			effectDescription: 'evil influence resets don\'t reset cores',
			done() { return player.ei.total.gte(8) && player.ei.power.gte(5000) },
			unlocked() { return hasMilestone('ei', 0) },
		},
		2: {
			requirementDescription: '55 total evil influence and 1e12 evil power',
			effectDescription: 'evil influence resets don\'t reset quarks',
			done() { return player.ei.total.gte(55) && player.ei.power.gte(1e12) },
			unlocked() { return hasMilestone('ei', 1) },
		},
		3: {
			requirementDescription: '146 total evil influence and 1e39 evil power',
			effectDescription: 'evil influence resets don\'t reset prayers',
			done() { return player.ei.total.gte(146) && player.ei.power.gte(1e39) },
			unlocked() { return hasMilestone('ei', 2) },
		},
		4: {
			requirementDescription: '303 total evil influence and 1e193 evil power',
			effectDescription: 'evil influence resets don\'t reset atoms',
			done() { return player.ei.total.gte(303) && player.ei.power.gte(1e193) },
			unlocked() { return hasMilestone('ei', 3) },
		},
		5: {
			requirementDescription: '348 total evil influence and 1e245 evil power',
			effectDescription() {
				return 'unlock the <b class="layer-ei' + getdark(this, "ref", true, true) + 'Gate of Evil';
			},
			done() { return player.ei.total.gte(348) && player.ei.power.gte(1e245) },
			unlocked() { return hasMilestone('ei', 4) },
		},
	},
	upgrades: {
		11: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Cycle of Evil';
			},
			description: 'multiplies evil influence gain based on your evil power',
			cost: 2,
			effect() {
				return player.ei.power.add(1).log10().add(1);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: log10(x+1)+1';
				return text;
			},
		},
		12: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Evil Power Up';
			},
			description: 'multiplies evil power gain based on your evil power',
			cost: 3,
			effect() {
				return player.ei.power.add(1).pow(0.1);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.1';
				return text;
			},
			unlocked() { return hasUpgrade('ei', 11) },
		},
		13: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'More Evil';
			},
			description: 'reduces evil influence gain exponent<br>12 --> 7.75',
			cost: 3,
			unlocked() { return hasUpgrade('ei', 12) },
		},
		14: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Rising Conflict';
			},
			description: 'multiplies evil power gain based on your good influence',
			cost: 4,
			effect() {
				return player.gi.points.add(1).pow(0.75);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.75';
				return text;
			},
			unlocked() { return hasUpgrade('ei', 13) },
		},
		15: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Evil Laughter';
			},
			description: 'increases evil power\'s base gain<br>2 --> 4',
			cost: 4,
			unlocked() { return hasUpgrade('ei', 14) },
		},
		21: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'The Cycle Continues';
			},
			description() {
				return 'multiplies the effect of <b class="layer-ei' + getdark(this, "ref") + 'Cycle of Evil</b> based on your evil power';
			},
			cost: 4,
			effect() {
				return player.ei.power.add(1).log10().add(1);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: log10(x+1)+1';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 5 },
		},
		22: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Stronger Evil';
			},
			description() {
				return 'multiplies the effect of <b class="layer-ei' + getdark(this, "ref") + 'Evil Power Up</b> based on your evil power';
			},
			cost: 5,
			effect() {
				return player.ei.power.add(1).pow(0.2);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.2';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 5 },
		},
		23: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Even More Evil';
			},
			description: 'reduces evil influence gain exponent<br>7.75 --> 7.25',
			cost: 5,
			unlocked() { return player.ei.upgrades.length >= 5 },
		},
		24: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Daredevil';
			},
			description: 'multiplies good influence gain based on your evil power',
			cost: 6,
			effect() {
				return player.ei.power.add(1).log10().add(1).pow(0.0175);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (log10(x+1)+1)^0.0175';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 5 },
		},
		25: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'The Evil Eye';
			},
			description: 'increases evil power\'s base gain<br>4 --> 6',
			cost: 6,
			unlocked() { return player.ei.upgrades.length >= 5 },
		},
		31: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Demonic Cycle';
			},
			description() {
				return 'multiplies the effect of <b class="layer-ei' + getdark(this, "ref") + 'The Cycle Continues</b> based on your demon souls';
			},
			cost: 6,
			effect() {
				return player.ds.points.add(1).log10().add(1).pow(0.02);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (log10(x+1)+1)^0.02';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 10 },
		},
		32: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Demonic Evil';
			},
			description() {
				return 'multiplies the effect of <b class="layer-ei' + getdark(this, "ref") + 'Stronger Evil</b> based on your demon souls';
			},
			cost: 7,
			effect() {
				return player.ds.points.add(1).log10().add(1).pow(0.9);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (log10(x+1)+1)^0.9';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 10 },
		},
		33: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Evil Gathering';
			},
			description: 'reduces evil influence gain exponent<br>7.25 --> 7',
			cost: 7,
			unlocked() { return player.ei.upgrades.length >= 10 },
		},
		34: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Greedy Evil';
			},
			description: 'multiplies relic gain based on your evil power',
			cost: 8,
			effect() {
				return player.ei.power.add(1).log10().add(1).pow(0.01);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (log10(x+1)+1)^0.01';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 10 },
		},
		35: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Innate Evil';
			},
			description: 'increases evil power\'s base gain<br>6 --> 8',
			cost: 8,
			unlocked() { return player.ei.upgrades.length >= 10 },
		},
		41: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Longer Cycle';
			},
			description() {
				return 'multiplies the effect of <b class="layer-ei' + getdark(this, "ref") + 'Demonic Cycle</b> based on your evil power';
			},
			cost: 8,
			effect() {
				return player.ei.power.add(1).log10().add(1).pow(0.06);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (log10(x+1)+1)^0.06';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 15 },
		},
		42: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Crimson Evil';
			},
			description() {
				return 'multiplies the effect of <b class="layer-ei' + getdark(this, "ref") + 'Demonic Evil</b> based on your demon souls';
			},
			cost: 9,
			effect() {
				return player.ds.points.add(1).log10().add(1).pow(0.5);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (log10(x+1)+1)^0.5';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 15 },
		},
		43: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Evil Condensing';
			},
			description: 'reduces evil influence gain exponent<br>7 --> 6.75',
			cost: 9,
			unlocked() { return player.ei.upgrades.length >= 15 },
		},
		44: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Evil Infiltration';
			},
			description: 'multiplies evil power gain based on your sanctums',
			cost: 10,
			effect() {
				return player.s.points.add(1).log10().add(1).pow(4);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (log10(x+1)+1)^4';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 15 },
		},
		45: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Evil Schemes';
			},
			description: 'increases evil power\'s base gain<br>8 --> 10',
			cost: 10,
			unlocked() { return player.ei.upgrades.length >= 15 },
		},
		52: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Bloody Evil';
			},
			description() {
				return 'multiplies the effect of <b class="layer-ei' + getdark(this, "ref") + 'Crimson Evil</b> based on your evil power';
			},
			cost: 11,
			effect() {
				return player.ei.power.add(1).pow(0.15);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.15';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 20 },
		},
		53: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Amassing Evil';
			},
			description: 'reduces evil influence gain exponent<br>6.75 --> 6.55',
			cost: 12,
			unlocked() { return player.ei.upgrades.length >= 20 },
		},
		54: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Determination';
			},
			description: 'multiplies evil influence gain based on your good influence',
			cost: 13,
			effect() {
				return player.gi.points.add(1).log10().add(1).pow(0.8);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (log10(x+1)+1)^0.8';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 20 },
		},
		62: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Empower Evil';
			},
			description() {
				return 'multiplies the effect of <b class="layer-ei' + getdark(this, "ref") + 'Bloody Evil</b> based on your evil power';
			},
			cost: 15,
			effect() {
				return player.ei.power.add(1).pow(0.1);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.1';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 23 },
		},
		63: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Army of Evil';
			},
			description: 'reduces evil influence gain exponent<br>6.55 --> 6.45',
			cost: 16,
			unlocked() { return player.ei.upgrades.length >= 23 },
		},
		64: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Evil Rituals';
			},
			description: 'multiplies evil influence gain based on your sanctums',
			cost: 17,
			effect() {
				return player.gi.points.add(1).log10().add(1).pow(0.55);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (log10(x+1)+1)^0.55';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 23 },
		},
		72: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Powerful Evil';
			},
			description() {
				return 'multiplies the effect of <b class="layer-ei' + getdark(this, "ref") + 'Empower Evil</b> based on your evil power';
			},
			cost: 19,
			effect() {
				return player.ei.power.add(1).pow(0.145);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (x+1)^0.145';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 26 },
		},
		73: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Evil Kingdom';
			},
			description: 'reduces evil influence gain exponent<br>6.45 --> 6.25',
			cost: 22,
			unlocked() { return player.ei.upgrades.length >= 26 },
		},
		74: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Evil Prayers';
			},
			description: 'multiplies evil power gain based on your prayers',
			cost: 25,
			effect() {
				return player.p.points.add(1).log10().add(1).pow(3.6);
			},
			effectDisplay() {
				let text = format(this.effect()) + 'x';
				if (player.nerdMode) text += ' <br>formula: (log10(x+1)+1)^3.6';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 26 },
		},
		83: {
			title() {
				return '<b class="layer-ei' + getdark(this, "title") + 'Infinite Evil';
			},
			description: 'reduces evil influence gain exponent<br>6.25 --> 5.75',
			cost: 30,
			unlocked() { return player.ei.upgrades.length >= 29 },
		},
	},
	challenges: {
		11: {
			name() {
				if (colorvalue[0][1]) return '<h3 class="layer-ei">Build the Gate';
				return '<h3>Build the Gate';
			},
			challengeDescription: ' - Resets evil influence milestones<br> - Resets evil influence upgrades<br> - Resets your evil power to 0<br> - Forces an evil influence reset<br> - Divides evil power gain by 1,000<br>',
			goalDescription: '1e230 evil power<br>',
			canComplete() { return player.ei.power.gte(1e230) },
			onEnter() {
				player.ei.milestones = [];
				player.ei.upgrades = [];
				player.ei.power = new Decimal(0);
			},
			rewardDescription: 'exponentiate evil power<br>gain by ^1.075',
			doReset: true,
			noAutoExit: true,
		},
		12: {
			name() {
				if (colorvalue[0][1]) return '<h3 class="layer-ei">Power the Gate';
				return '<h3>Power the Gate';
			},
			challengeDescription: " - Resets evil influence upgrades<br> - Resets your evil power to 0<br> - Forces an evil influence reset<br> - Divides evil power gain by 100,000,000<br>",
			goalDescription: '1e21 evil power<br>',
			canComplete() { return player.ei.power.gte(1e21) },
			unlocked() { return hasChallenge('ei', 11) },
			onEnter() {
				player.ei.upgrades = [];
				player.ei.power = new Decimal(0);
			},
			rewardDescription: 'evil influence resets nothing, all <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> autobuyers can bulk<br>buy 5x, and exponentiate evil<br>power gain by ^1.075',
			doReset: true,
			noAutoExit: true,
		},
		21: {
			name() {
				if (colorvalue[0][1]) return '<h3 class="layer-ei">Enter the Gate';
				return '<h3>Enter the Gate';
			},
			challengeDescription: " - Resets evil influence upgrades<br> - Resets your evil power to 0<br> - Resets your relics to 0<br> - Divides evil power gain by 1e15<br>",
			goalDescription: '1e18 evil power and 93 relics<br>',
			canComplete() { return player.ei.power.gte(1e18) && player.r.points.gte(93) },
			unlocked() { return hasChallenge('ei', 12) },
			onEnter() {
				player.ei.upgrades = [];
				player.ei.power = new Decimal(0);
				player.r.points = new Decimal(0);
				player.r.best = new Decimal(0);
				player.r.total = new Decimal(0);
				player.r.challenges[11] = 0;
			},
			rewardDescription: 'unlock Wars',
			noAutoExit: true,
		},
		22: {
			name() {
				if (colorvalue[0][1]) return '<h3 class="layer-ei">And Repeat';
				return '<h3>And Repeat';
			},
			challengeDescription() {
				return 'Endure the negative effects of all the other <b class="layer-ei' + getdark(this, "ref", true, true) + 'Gate of Evil</b> challenges. It is recommended to turn the evil influence upgrade autobuyer off.<br>';
			},
			goalDescription: '1e500 evil power and 144 relics<br>',
			canComplete() { return player.ei.power.gte('1e500') && player.r.points.gte(144) },
			unlocked() { return hasChallenge('ei', 21) && hasMilestone('w', 1) },
			onEnter() {
				player.ei.milestones = [];
				player.ei.upgrades = [];
				player.ei.power = new Decimal(0);
				player.r.points = new Decimal(0);
				player.r.best = new Decimal(0);
				player.r.total = new Decimal(0);
				player.r.challenges[11] = 0;
			},
			rewardDescription: 'multiply evil influence gain<br>by 1.75x',
			countsAs: [11, 12, 21],
			noAutoExit: true,
		},
	},
});

addLayer('w', {
	name: 'Wars',
	symbol: 'W',
	position: 0,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
	}},
	color: '#A0A0A0',
	requires: 60,
	resource: 'wars',
	baseAmount() { return player.gi.points.min(player.ei.points) },
	type: 'custom',
	getResetGain() {
		let gain = [player.gi.points.sub(60).div(20).mul(this.gainExp()).floor().sub(player.w.points).add(1), player.ei.points.sub(60).div(20).mul(this.gainExp()).floor().sub(player.w.points).add(1)];
		return gain[0].min(gain[1]).max(0);
	},
	getNextAt() {
		if (this.canBuyMax()) return this.getResetGain().div(this.gainExp()).mul(20).add(60);
		return player.w.points.div(this.gainExp()).mul(20).add(60);
	},
	canReset() { return this.getResetGain().gt(0) },
	prestigeNotify() { return this.getResetGain().gt(0) },
	prestigeButtonText() {
		return 'Reset for +<b>' + formatWhole(this.getResetGain()) + '</b> wars<br><br>' + (player.w.points.lt(30) ? (this.canBuyMax() ? 'Next:' : 'Req:') : '') + ' ' + formatWhole(player.gi.points) + ' / ' + formatWhole(this.getNextAt()) + ' GI<br>and ' + formatWhole(player.ei.points) + ' / ' + formatWhole(this.getNextAt()) + ' EI';
	},
	canBuyMax() { return false },
	onPrestige() {
		if (hasMilestone('w', 5)) return;
		player.c.unlocked = false;
		player.q.unlocked = false;
		player.sp.unlocked = false;
		player.h.unlocked = false;
		player.ds.unlocked = false;
		player.a.unlocked = false;
		player.p.unlocked = false;
		player.s.unlocked = false;
		if (!hasMilestone('w', 2)) player.r.unlocked = false;
		if (!hasMilestone('w', 0)) player.m.unlocked = false;
		if (!hasMilestone('w', 1)) player.gi.unlocked = false;
		if (!hasMilestone('w', 2)) player.ei.unlocked = false;
	},
	onPrestigeIsAfterGain: true,
	gainExp() {
		let gain = new Decimal(1);
		return gain;
	},
	row: 5,
	tooltipLocked() {
		return 'Reach ' + this.requires + ' GI and ' + this.requires + ' EI to unlock (You have ' + formatWhole(player.gi.points) + ' GI and ' + formatWhole(player.ei.points) + ' EI)';
	},
	hotkeys: [
		{key: 'w', description: 'W: Reset for wars', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return hasChallenge('ei', 21) || player.w.unlocked},
	effect() {
		return [new Decimal(1e10).pow(player.w.points), player.w.points.add(1).log10().add(1).pow(0.333), player.w.points.add(1).pow(1.5)];
	},
	effectDescription() {
		return 'which multiplies point, essence, core, quark, subatomic particle, hex, demon soul, and prayer gain by <h2 class="layer-w">' + format(tmp.w.effect[0]) + '</h2>x, atom, sanctum, relic, molecule, good influence, and evil influence by <h2 class="layer-w">' + format(tmp.w.effect[1]) + '</h2>x, and also light gain after softcap by <h2 class="layer-w">' + format(tmp.w.effect[2]) + '</h2>x';
	},
	doReset(resettingLayer) {
		let keep = [];
			if (layers[resettingLayer].row > this.row) layerDataReset('w', keep);
		},
	tabFormat: {
		"Progress": {
			content: [
				"main-display",
				"prestige-button",
				["display-text", () => { return 'You have ' + formatWhole(player.gi.points) + ' good influence<br>You have ' + formatWhole(player.ei.points) + ' evil influence<br><br>Your best wars is ' + formatWhole(player.w.best) + '<br>You have made a total of ' + formatWhole(player.w.total) + ' wars<br><br>After unlocking War, you can always buy max on all resources below this row.' }],
				"blank",
				["bar", "tide"],
				"blank",
				"milestones",
			],
		},
		"Influences": {
			content: [
				"main-display",
				"prestige-button",
				["display-text", () => { return 'You have ' + formatWhole(player.gi.points) + ' good influence<br>You have ' + formatWhole(player.ei.points) + ' evil influence<br><br>Your best wars is ' + formatWhole(player.w.best) + '<br>You have made a total of ' + formatWhole(player.w.total) + ' wars<br><br>After unlocking War, you can always buy max on all resources below this row.' }],
				"blank",
				["bar", "tide"],
				"blank",
				"buyables",
			],
		},
	},
	milestones: {
		0: {
			requirementDescription: '1 war',
			effectDescription: 'keep molecule milestones on war resets, and you can autobuy good influence rebuyables',
			done() { return player.w.points.gte(1) },
			toggles: [['gi', 'auto_buyables']],
		},
		1: {
			requirementDescription: '2 wars',
			effectDescription() {
				return 'keep good influence milestones on war resets, you can autobuy evil influence upgrades, perform good influence resets automatically, and unlock a new <b class="layer-ei' + getdark(this, "ref", true, true) + 'Gate of Evil</b> challenge';
			},
			done() { return player.w.points.gte(2) },
			toggles: [['ei', 'auto_upgrades']],
		},
		2: {
			requirementDescription: '3 wars',
			effectDescription() {
				return 'keep evil influence milestones and activated relics on war resets, you can autobuy molecule upgrades, and all <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> autobuyers can bulk buy 2x';
			},
			done() { return player.w.points.gte(3) },
			toggles: [['m', 'auto_upgrades']],
		},
		3: {
			requirementDescription: '4 wars',
			effectDescription: 'keep evil influence challenge completions on war resets, you can automatically activate relics, perform evil influence resets automatically, and unlock another war rebuyable',
			done() { return player.w.points.gte(4) },
			toggles: [['r', 'auto_activate']],
		},
		4: {
			requirementDescription: '5 wars',
			effectDescription: 'keep demon soul challenge completions on war resets, you can autobuy individual relic upgrades, relics reset nothing, perform relic resets automatically, and unlock another war rebuyable',
			done() { return player.w.points.gte(5) },
			toggles: [['r', 'auto_upgrade_1'], ['r', 'auto_upgrade_2'], ['r', 'auto_upgrade_3']],
		},
		5: {
			requirementDescription: '6 wars',
			effectDescription: 'war resets don\'t reset relics, and keep everything unlocked on war resets',
			done() { return player.w.points.gte(6) },
		},
		6: {
			requirementDescription: '7 wars',
			effectDescription: 'war resets don\'t reset molecules',
			done() { return player.w.points.gte(7) },
		},
		7: {
			requirementDescription: '8 wars',
			effectDescription: 'war resets don\'t reset cores',
			done() { return player.w.points.gte(8) },
		},
		8: {
			requirementDescription: '9 wars',
			effectDescription: 'war resets don\'t reset good influence, and unlock another war rebuyable',
			done() { return player.w.points.gte(9) },
		},
		9: {
			requirementDescription: '10 wars',
			effectDescription: 'war resets don\'t reset quarks, and unlock cellular life',
			done() { return player.w.points.gte(10) },
		},
	},
	bars: {
		tide: {
			direction: RIGHT,
			width: 600,
			height: 50,
			display() {
				if (player.gi.points.gt(player.ei.points)) return 'the tide currently favors good by ' + format(player.ei.points.div(player.gi.points).neg().add(1).mul(100)) + '%';
				if (player.ei.points.gt(player.gi.points)) return 'the tide currently favors evil by ' + format(player.gi.points.div(player.ei.points).neg().add(1).mul(100)) + '%';
				return 'the tide currently favors neither good nor evil';
			},
			progress() {
				if (player.gi.points.eq(player.ei.points)) return 0.5;
				return player.ei.points.div(player.ei.points.add(player.gi.points)).toNumber();
			},
			baseStyle: {'background-image':'linear-gradient(#08FF87, #AAFF00)'},
			fillStyle:  {'background-image':'linear-gradient(#FF4400, #BA0035)'},
			textStyle: {'color':'#000000'},
		},
	},
	buyables: {
		11: {
			cost() {
				if (getBuyableAmount('w', this.id).eq(0)) return new Decimal(108);
				if (getBuyableAmount('w', this.id).eq(1)) return new Decimal(124);
				if (getBuyableAmount('w', this.id).lt(4)) return getBuyableAmount('w', this.id).mul(20).add(104);
				if (getBuyableAmount('w', this.id).eq(4)) return new Decimal(177);
				if (getBuyableAmount('w', this.id).eq(5)) return new Decimal(188);
				if (getBuyableAmount('w', this.id).eq(6)) return new Decimal(194);
				return getBuyableAmount('w', this.id).mul(5).add(163);
			},
			title: '<h3 class="layer-w-dark">Rivalry',
			canAfford() { return player.gi.points.gte(this.cost()) && player.ei.points.gte(this.cost()) },
			buy() {
				player.gi.points = player.gi.points.sub(this.cost());
				player.ei.points = player.ei.points.sub(this.cost());
				setBuyableAmount('w', this.id, getBuyableAmount('w', this.id).add(1));
			},
			effect() {
				return [getBuyableAmount('w', this.id).add(1).pow(0.09), getBuyableAmount('w', this.id).add(1).pow(0.21)];
			},
			display() {
				let text = '';
				if (player.nerdMode) text = '<br>formulas: (x+1)^0.09<br>and (x+1)^0.21';
				return 'multiplies good influence and evil influence gain based on the amount of this upgrade bought.<br>Currently: ' + format(this.effect()[0]) + 'x<br>and ' + format(this.effect()[1]) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' EI and ' + formatWhole(this.cost()) + ' GI<br><br>Bought: ' + formatWhole(getBuyableAmount('w', this.id));
			},
		},
		12: {
			cost() {
				if (getBuyableAmount('w', this.id).eq(0)) return new Decimal(171);
				if (getBuyableAmount('w', this.id).eq(1)) return new Decimal(186);
				if (getBuyableAmount('w', this.id).eq(2)) return new Decimal(196);
				if (getBuyableAmount('w', this.id).lt(5)) return getBuyableAmount('w', this.id).mul(12).add(168);
				if (getBuyableAmount('w', this.id).eq(5)) return new Decimal(218);
				if (getBuyableAmount('w', this.id).eq(6)) return new Decimal(225);
				return getBuyableAmount('w', this.id).mul(8).add(170);
			},
			title: '<h3 class="layer-w-dark">Relic Hoarding',
			canAfford() { return player.r.points.gte(this.cost()) },
			buy() {
				player.r.points = player.r.points.sub(this.cost());
				setBuyableAmount('w', this.id, getBuyableAmount('w', this.id).add(1));
			},
			effect() {
				return player.r.points.add(1).pow(0.1).mul(getBuyableAmount('w', this.id)).add(1).pow(0.25);
			},
			display() {
				let text = '';
				if (player.nerdMode) text = '<br>formula: (((x+1)^0.1)*y+1)^0.25';
				return 'multiplies evil influence gain based on your relics and the amount of this upgrade bought.<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' relics<br><br>Bought: ' + formatWhole(getBuyableAmount('w', this.id));
			},
			unlocked() { return hasMilestone('w', 3) },
		},
		13: {
			cost() {
				return getBuyableAmount('w', this.id).mul(70000).add(320000);
			},
			title: '<h3 class="layer-w-dark">Power of Good',
			canAfford() { return player.s.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			purchaseLimit: 3,
			buy() {
				player.s.points = player.s.points.sub(this.cost());
				setBuyableAmount('w', this.id, getBuyableAmount('w', this.id).add(1));
			},
			effect() {
				return player.s.points.add(1).pow(0.025).mul(getBuyableAmount('w', this.id)).add(1).pow(0.025);
			},
			display() {
				let text = '';
				if (player.nerdMode) text = '<br>formula: (((x+1)^0.025)*y+1)^0.025';
				return 'multiplies good influence gain based on your sanctums and the amount of this upgrade bought.<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' sanctums<br><br>Bought: ' + formatWhole(getBuyableAmount('w', this.id)) + '/' + formatWhole(this.purchaseLimit);
			},
			unlocked() { return hasMilestone('w', 4) },
		},
		21: {
			cost() {
				return getBuyableAmount('w', this.id).mul(5).add(235);
			},
			title: '<h3 class="layer-w-dark">Race for Knowledge',
			canAfford() {
				return player.gi.points.gte(this.cost()) && player.ei.points.gte(this.cost());
			},
			buy() {
				player.gi.points = player.gi.points.sub(this.cost());
				player.ei.points = player.ei.points.sub(this.cost());
				setBuyableAmount('w', this.id, getBuyableAmount('w', this.id).add(1));
			},
			effect() {
				return getBuyableAmount('w', this.id).add(1).pow(3.25);
			},
			display() {
				let text = '';
				if (player.nerdMode) text = '<br>formula: (x+1)^3.25';
				return 'multiplies molecule gain based on the amount of this upgrade bought.<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' EI and ' + formatWhole(this.cost()) + ' GI<br><br>Bought: ' + formatWhole(getBuyableAmount('w', this.id));
			},
			unlocked() { return hasMilestone('w', 8) },
		},
	},
});

addLayer('cl', {
	name: 'Cellular Life',
	symbol: 'CL',
	position: 2,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
	}},
	color: "#008800",
	requires: 1e25,
	resource: 'cellular life',
	baseResource: 'molecules',
	baseAmount() { return player.m.points },
	type: 'static',
	base: 100,
	exponent: 1.5,
	canBuyMax() { return hasMilestone('cl', 0) },
	gainExp() {
		let gain = new Decimal(1);
		if (getBuyableAmount('cl', 12).gt(0)) gain = gain.mul(buyableEffect('cl', 12)[1]);
		if (getBuyableAmount('cl', 13).gt(0)) gain = gain.mul(buyableEffect('cl', 13)[1]);
		return gain;
	},
	row: 5,
	hotkeys: [
		{key: 'C', description: 'Shift-C: Reset for cellular life', onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() { return hasMilestone('w', 9) || player.cl.unlocked },
	doReset(resettingLayer) {
		let keep = [];
			if (layers[resettingLayer].row > this.row) layerDataReset('cl', keep);
		},
	tabFormat: {
		"Life Tracker": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				"milestones",
			],
		},
		"Tissues": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				"buyables",
			],
		},
	},
	milestones: {
		0: {
			requirementDescription: '1 total cellular life',
			effectDescription: 'keep good influence and evil influence milestones on cellular life resets, unlock options to toggle good influence and evil influence auto prestiges, and you can buy max cellular life',
			done() { return player.cl.total.gte(1) },
			toggles: [['ei', 'auto_prestige'], ['gi', 'auto_prestige']],
		},
		1: {
			requirementDescription: '2 total cellular life',
			effectDescription() {
				return 'cellular life doesn\'t reset relics, unlock option to disable exta <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> autobuyer speed, but make all <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> autobuyers bulk buy 100x, and unlock another <b class="layer-cl' + getdark(this, "ref", true, true) + 'Tissue</b>';
			},
			done() { return player.cl.total.gte(2) },
			toggles: [['s', 'no_speed_but_more_bulk']],
		},
		2: {
			requirementDescription: '4 total cellular life',
			effectDescription() {
				return 'cellular life doesn\'t reset cores, and all <b class="layer-s' + getdark(this, "ref", true, true) + 'Devotion</b> autobuyers can bulk buy 2x';
			},
			done() { return player.cl.total.gte(4) },
		},
		3: {
			requirementDescription: '6 total cellular life',
			effectDescription() {
				return 'cellular life doesn\'t reset evil influence, keep demon soul challenge completions on cellular life resets, and unlock another <b class="layer-cl' + getdark(this, "ref", true, true) + 'Tissue</b>';
			},
			done() { return player.cl.total.gte(6) },
		},
		4: {
			requirementDescription: '9 total cellular life',
			effectDescription: 'cellular life doesn\'t reset good influence, and keep molecule milestones on cellular life resets',
			done() { return player.cl.total.gte(9) },
		},
		5: {
			requirementDescription: '18 total cellular life',
			effectDescription: 'cellular life doesn\'t reset quarks',
			done() { return player.cl.total.gte(18) },
		},
		6: {
			requirementDescription: '63 total cellular life',
			effectDescription: 'cellular life doesn\'t reset prayers',
			done() { return player.cl.total.gte(63) },
		},
		7: {
			requirementDescription: '135 total cellular life',
			effectDescription: 'cellular life doesn\'t reset sanctums',
			done() { return player.cl.total.gte(135) },
		},
	},
	buyables: {
		11: {
			cost() {
				if (getBuyableAmount('cl', this.id).gte(10)) return getBuyableAmount('cl', this.id).mul(2).sub(8);
				return getBuyableAmount('cl', this.id).add(1);
			},
			title() {
				return '<b class="layer-cl' + getdark(this, "title-buyable") + 'Nervous Tissue';
			},
			canAfford() { return player.cl.points.gte(this.cost()) },
			buy() {
				player.cl.points = player.cl.points.sub(this.cost());
				setBuyableAmount('cl', this.id, getBuyableAmount('cl', this.id).add(1));
			},
			effect() {
				return [getBuyableAmount('cl', this.id).add(1).pow(0.02), getBuyableAmount('cl', this.id).add(1).pow(1.5)];
			},
			display() {
				let text = '';
				if (player.nerdMode) text = '<br>formulas: (x+1)^0.02<br>and (x+1)^1.5';
				return 'exponentiates core gain and multiplies atom gain based on the amount of this upgrade bought.<br>Currently: ^' + format(this.effect()[0]) + '<br>and ' + format(this.effect()[1]) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' cellular life<br><br>Bought: ' + formatWhole(getBuyableAmount('cl', this.id));
			},
		},
		12: {
			cost() {
				if (getBuyableAmount('cl', this.id).gte(10)) return getBuyableAmount('cl', this.id).mul(2).sub(8);
				return getBuyableAmount('cl', this.id).add(1);
			},
			title() {
				return '<b class="layer-cl' + getdark(this, "title-buyable") + 'Muscle Tissue';
			},
			canAfford() { return player.cl.points.gte(this.cost()) },
			buy() {
				player.cl.points = player.cl.points.sub(this.cost());
				setBuyableAmount('cl', this.id, getBuyableAmount('cl', this.id).add(1));
			},
			effect() {
				return [getBuyableAmount('cl', this.id).add(1).pow(0.01), getBuyableAmount('cl', this.id).add(1).pow(0.5)];
			},
			display() {
				let text = '';
				if (player.nerdMode) text = '<br>formulas: (x+1)^0.01<br>and (x+1)^0.5';
				return 'exponentiates demon soul gain and multiplies cellular life gain based on the amount of this upgrade bought.<br>Currently: ^' + format(this.effect()[0]) + '<br>and ' + format(this.effect()[1]) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' cellular life<br><br>Bought: ' + formatWhole(getBuyableAmount('cl', this.id));
			},
			unlocked() { return hasMilestone('cl', 1) },
		},
		13: {
			cost() {
				if (getBuyableAmount('cl', this.id).gte(10)) return getBuyableAmount('cl', this.id).mul(2).sub(8);
				return getBuyableAmount('cl', this.id).add(1);
			},
			title() {
				return '<b class="layer-cl' + getdark(this, "title-buyable") + 'Epithelial Tissue';
			},
			canAfford() { return player.cl.points.gte(this.cost()) },
			buy() {
				player.cl.points = player.cl.points.sub(this.cost());
				setBuyableAmount('cl', this.id, getBuyableAmount('cl', this.id).add(1));
			},
			effect() {
				return [getBuyableAmount('cl', this.id).add(1).pow(0.025), getBuyableAmount('cl', this.id).add(1).pow(0.75)];
			},
			display() {
				let text = '';
				if (player.nerdMode) text = '<br>formulas: (x+1)^0.025<br>and (x+1)^0.75';
				return 'exponentiates subatomic particle gain and multiplies cellular life gain based on the amount of this upgrade bought.<br>Currently: ^' + format(this.effect()[0]) + '<br>and ' + format(this.effect()[1]) + 'x' + text + '<br><br>Cost: ' + formatWhole(this.cost()) + ' cellular life<br><br>Bought: ' + formatWhole(getBuyableAmount('cl', this.id));
			},
			unlocked() { return hasMilestone('cl', 3) },
		},
		// 21: Connective Tissue
	},
});
