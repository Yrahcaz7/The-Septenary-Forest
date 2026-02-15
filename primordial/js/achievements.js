addLayer("A", {
	name: "Achievements",
	symbol: "A",
	position: 0,
	startData() { return {
		points: newDecimalZero(),
	}},
	color: "#A5BCC2",
	resource: "achievements",
	row: "side",
	effect() {
		let base = 1.0005;
		if (getBuyableAmount("pl", 22).gte(4)) base += 0.0005;
		if (getBuyableAmount("pl", 22).gte(7)) base += 0.0004;
		return new Decimal(base).pow(player.A.points);
	},
	effectDescription() {
		if (getBuyableAmount("pl", 22).gte(3)) {
			return "which multiplies your chaos gain by <h2 class='layer-A'>" + format(tmp.A.effect) + "</h2>x";
		};
		let text = ["<br>which multiplies your point ", "", "", ""];
		if (hasUpgrade("ds", 21)) {
			if (hasUpgrade("ds", 24)) {
				text[0] += "and essence gain by <h2 class='layer-A'>" + format(player.A.points.div(5)) + "</h2>x";
			} else {
				text[0] += "gain by <h2 class='layer-A'>" + format(player.A.points.div(10).add(1)) + "</h2>x";
				text[1] += "essence gain by <h2 class='layer-A'>" + format(player.A.points.div(5)) + "</h2>x";
			};
			if (hasUpgrade("ds", 23)) {
				if (!hasUpgrade("ds", 24) && !hasUpgrade("p", 31)) text[2] += "core and quark gain by <h2 class='layer-A'>" + format(player.A.points.pow(2).div(100)) + "</h2>x";
				else if (hasUpgrade("ds", 24) && !hasUpgrade("p", 31)) text[1] += "core and quark gain by <h2 class='layer-A'>" + format(player.A.points.pow(2).div(100)) + "</h2>x";
				else if (hasUpgrade("ds", 24) && hasUpgrade("p", 31)) text[1] += "core, prayer, and quark gain by <h2 class='layer-A'>" + format(player.A.points.pow(2).div(100)) + "</h2>x";
			};
		} else {
			text[0] += "gain by <h2 class='layer-A'>" + format(player.A.points.div(10).add(1)) + "</h2>x";
		};
		if (hasUpgrade("a", 51)) text[3] += "subatomic particle gain by <h2 class='layer-A'>" + format(player.A.points.pow(1.25)) + "</h2>x";
		if (options.nerdMode) {
			if (hasUpgrade("ds", 21)) {
				if (hasUpgrade("ds", 24)) {
					text[0] += " (formula: 0.2x)";
				} else {
					text[0] += " (formula: x/10+1)";
					text[1] += " (formula: x/5)";
				};
				if (hasUpgrade("ds", 23) && !hasUpgrade("ds", 24) && !hasUpgrade("p", 31)) text[2] += " (formula: (x^2)/100)";
				if (hasUpgrade("ds", 23) && hasUpgrade("ds", 24)) text[1] += " (formula: (x^2)/100)";
			} else {
				text[0] += " (formula: x/10+1)";
			};
			if (hasUpgrade("a", 51)) text[3] += " (formula: x^1.25)";
		};
		let finalText = text[0];
		if (text[1]) finalText += "<br>and also multiplies " + text[1];
		if (text[2]) finalText += "<br>additionally, also multiplies " + text[2];
		if (text[3]) finalText += "<br>and lastly, also multiplies " + text[3];
		return finalText;
	},
	update(diff) {
		player.A.points = new Decimal(player.A.achievements.length);
	},
	tabFormat() {
		const prefix = (inGlitchedAssimilationSearch() ? "glitch-" : "");
		return [
			prefix + "main-display",
			prefix + "achievements",
			"blank",
		];
	},
	achievements: (() => {
		let obj = {
			11: {
				name: "The Point",
				requirement: 1,
			},
			12: {
				name: "Very Pointy",
				requirement: 1e10,
			},
			13: {
				name: "Now That's Really Pointy",
				requirement: 1e100,
			},
			14: {
				name: "Cosmic Point",
				requirement: "1e1000",
			},
			15: {
				name: "Everything is Points",
				requirement: "1e10000",
			},
			16: {
				name: "Dull Points",
				done() { return player.points.gte(1e10) && player.e.total.eq(0) },
				tooltip: "obtain 1e10 points with no essence.",
				unlocked() { return hasAchievement("A", 12) && hasAchievement("A", 21) },
			},
			21: {
				name: "Essence of Rat",
				requirement: 1,
			},
			22: {
				name: "Essence Cluster",
				requirement: 1e10,
			},
			23: {
				name: "Gleaming, Golden Essence",
				requirement: 1e100,
			},
			24: {
				name: "Essence of the Universe",
				requirement: "1e1000",
			},
			25: {
				name: "Essence of all Essence",
				requirement: "1e10000",
			},
			26: {
				name: "Empty Soul",
				done() { return player.e.points.gte(1e10) && getBuyableAmount("e", 11).eq(0) && getBuyableAmount("e", 12).eq(0) },
				tooltip: "obtain 1e10 essence with no essence rebuyables.",
				unlocked() { return hasAchievement("A", 22) && hasAchievement("A", 31) },
			},
			31: {
				name: "Cracked Core",
				requirement: 1,
			},
			32: {
				name: "Mountainous Core",
				requirement: 1e10,
			},
			33: {
				name: "Core of the Earth",
				requirement: 1e100,
			},
			34: {
				name: "Core of the Sun",
				requirement: "1e1000",
			},
			35: {
				name: "Core of the Universe",
				requirement: "1e10000",
			},
			36: {
				name: "Pointless Core",
				done() { return player.c.points.gte(1e10) && getBuyableAmount("c", 11).eq(0) && getBuyableAmount("c", 12).eq(0) && player.q.total.eq(0) },
				tooltip: "obtain 1e10 cores with no core rebuyables and quarks.",
				unlocked() { return hasAchievement("A", 32) && hasAchievement("A", 41) },
			},
			41: {
				name: "The Smallest Quark",
				requirement: 1,
			},
			42: {
				name: "Quark Field",
				requirement: 1e10,
			},
			43: {
				name: "Oh, the Quark of it all",
				requirement: 1e100,
			},
			44: {
				name: "Quirky Quarks",
				requirement: "1e1000",
			},
			45: {
				name: "Impossible Quarks",
				requirement: "1e10000",
			},
			46: {
				name: "The Outside",
				done() { return player.q.points.gte(1e10) && player.c.total.eq(0) },
				tooltip: "obtain 1e10 quarks with no cores.",
				unlocked() { return hasAchievement("A", 42) && hasAchievement("A", 51) },
			},
			51: {
				name: "Submarine, Subatomic",
				requirement: 1,
			},
			52: {
				name: "Variant Particles",
				requirement: 100,
			},
			53: {
				name: "Periodic Particles",
				requirement: 10_000,
			},
			54: {
				name: "That's no Particle no More",
				requirement: 1_000_000,
			},
			55: {
				name: "Anti Dark Matter",
				requirement: 1e11,
			},
			56: {
				name: "Hollow Particles",
				done() { return player.sp.points.gte(10) && getBuyableAmount("sp", 11).eq(0) && getBuyableAmount("sp", 12).eq(0) && getBuyableAmount("sp", 13).eq(0) && player.h.total.eq(0) },
				tooltip: "obtain 10 subatomic particles with no subatomic particle rebuyables and hexes.",
				unlocked() { return hasAchievement("A", 52) && hasAchievement("A", 61) },
			},
			61: {
				name: "The Hex Game",
				requirement: 1,
			},
			62: {
				name: "Cursed into Oblivion",
				requirement: 1e10,
			},
			63: {
				name: "The Prophecy of Doom",
				requirement: 1e100,
			},
			64: {
				name: "The Advent of the End",
				requirement: "1e1000",
			},
			65: {
				name: "Nihilism: Nothing is There",
				requirement: "1e10000",
			},
			66: {
				name: "Same Old Tricks",
				done() { return player.h.points.gte(1e10) && getBuyableAmount("c", 11).eq(0) && getBuyableAmount("c", 12).eq(0) && player.sp.total.eq(0) },
				tooltip: "obtain 1e10 hexes with no subatomic particles and core rebuyables.",
				unlocked() { return hasAchievement("A", 62) && hasAchievement("A", 71) },
			},
			71: {
				name: "Demon Spirits",
				requirement: 1,
			},
			72: {
				name: "Demonic Ruin",
				requirement: 1e8,
			},
			73: {
				name: "Demon Summoning",
				requirement: 1e60,
			},
			74: {
				name: "Demonic Origin",
				requirement: "1e400",
			},
			75: {
				name: "Demonic Dimension",
				requirement: "1e2000",
			},
			76: {
				name: "Occult Uprising",
				done() { return player.ds.points.gte(1e10) && getBuyableAmount("ds", 11).eq(0) && player.a.total.eq(0) },
				tooltip: "obtain 1e10 demon souls with no demon soul rebuyables and atoms.",
				unlocked() { return hasAchievement("A", 72) && hasAchievement("A", 81) },
			},
			81: {
				name: "Atomic Mass",
				requirement: 1,
			},
			82: {
				name: "Atomic Movement",
				requirement: 10,
			},
			83: {
				name: "Masses of Atoms",
				requirement: 1000,
			},
			84: {
				name: "Atom Dance",
				requirement: 10_000,
			},
			85: {
				name: "Atomic Hole",
				requirement: 1e9,
			},
			86: {
				name: "For Science!",
				done() { return player.a.points.gte(10) && player.ds.total.eq(0) },
				tooltip: "obtain 10 atoms with no demon souls.",
				unlocked() { return hasAchievement("A", 82) && hasAchievement("A", 91) },
			},
			91: {
				name: "Praise the Lord",
				requirement: 1,
			},
			92: {
				name: "Church Prayer Circle",
				requirement: 1e10,
			},
			93: {
				name: "Prayers all around",
				requirement: 1e100,
			},
			94: {
				name: "Global Prayers",
				requirement: "1e1000",
			},
			95: {
				name: "Everything is Prayers",
				requirement: "1e10000",
			},
			96: {
				name: "Persistence",
				done() { return player.p.points.gte(1e10) && player.h.total.eq(0) && player.sp.total.eq(0) && player.s.total.eq(0) },
				tooltip: "obtain 1e10 prayers with no hexes, subatomic particles, and sanctums.",
				unlocked() { return hasAchievement("A", 92) && hasAchievement("A", 101) },
			},
			101: {
				name: "Church Sanctum",
				requirement: 1,
			},
			102: {
				name: "Shrine Blessings",
				requirement: 10,
			},
			103: {
				name: "Greater Sanctum",
				requirement: 100,
			},
			104: {
				name: "The World is Sanctum",
				requirement: 1000,
			},
			105: {
				name: "Sanctum, Absolute",
				requirement: 10_000,
			},
			106: {
				name: "Still Sanctum",
				done() { return player.s.points.gte(10) && player.ds.total.eq(0) && player.a.total.eq(0) },
				tooltip: "obtain 10 sanctums with no demon souls and atoms.",
				unlocked() { return hasAchievement("A", 102) && hasAchievement("A", 111) },
			},
			111: {
				name: "Ancient Relic",
				requirement: 1,
			},
			112: {
				name: "Giant Relics",
				requirement: 10,
			},
			113: {
				name: "Treasure Hoard",
				requirement: 100,
			},
			114: {
				name: "Mountain of Relics",
				requirement: 1000,
			},
			115: {
				name: "Dragon's Hoard",
				requirement: 10_000,
			},
			116: {
				name: "Broken Relics",
				done() { return player.r.points.gte(10) && player.m.total.eq(0) },
				tooltip: "obtain 10 relics with no molecules.",
				unlocked() { return hasAchievement("A", 112) && hasAchievement("A", 121) },
			},
			121: {
				name: "Atom Combination",
				requirement: 1,
			},
			122: {
				name: "Varied Molecules",
				requirement: 1_000_000,
			},
			123: {
				name: "Molecule Dictionary",
				requirement: 1e12,
			},
			124: {
				name: "Plethora of Molecules",
				requirement: 1e25,
			},
			125: {
				name: "Molecules are Everything",
				requirement: 1e75,
			},
			126: {
				name: "Shiny New Molecules",
				done() { return player.m.points.gte(1_000_000) && player.r.total.eq(0) },
				tooltip: "obtain 1,000,000 molecules with no relics.",
				unlocked() { return hasAchievement("A", 122) && hasAchievement("A", 131) },
			},
			131: {
				name: "Spread the Word",
				requirement: 1,
			},
			132: {
				name: "Good Deeds All Around",
				requirement: 10,
			},
			133: {
				name: "World of Good",
				requirement: 100,
			},
			134: {
				name: "Maximum Good",
				requirement: 1000,
			},
			135: {
				name: "Good Exceeding",
				requirement: 10_000,
			},
			136: {
				name: "Science is not Holy",
				done() { return player.gi.points.gte(10) && player.m.total.eq(0) },
				tooltip: "obtain 10 good influence with no molecules.",
				unlocked() { return hasAchievement("A", 132) && hasAchievement("A", 151) },
			},
			141: {
				name: "Malevolent Evil",
				requirement: 1,
			},
			142: {
				name: "Evil Encroaches",
				requirement: 10,
			},
			143: {
				name: "Evil Encompasses",
				requirement: 100,
			},
			144: {
				name: "Invasion of Evil",
				requirement: 1000,
			},
			145: {
				name: "Evil to Infinity",
				requirement: 10_000,
			},
			146: {
				name: "Disbelievers",
				done() { return player.ei.points.gte(10) && player.m.total.eq(0) },
				tooltip: "obtain 10 evil influence with no molecules.",
				unlocked() { return hasAchievement("A", 142) && hasAchievement("A", 151) },
			},
			151: {
				name: "Big Fight",
				requirement: 1,
			},
			152: {
				name: '"Resolving Differences"',
				requirement: 10,
			},
			153: {
				name: "Ravaging War",
				requirement: 100,
			},
			154: {
				name: "War of the World",
				requirement: 1000,
			},
			155: {
				name: "Ultimate War",
				requirement: 10_000,
			},
			156: {
				name: "Vast Battlefields",
				done() { return player.w.points.gte(10) && player.pl.points.gte(1) },
				tooltip: "obtain 10 wars and 1 planet.",
				unlocked() { return hasAchievement("A", 152) && hasAchievement("A", 191) },
			},
			161: {
				name: "Life is Born",
				requirement: 1,
			},
			162: {
				name: "Life Blossoms",
				requirement: 100,
			},
			163: {
				name: "Many Cells",
				requirement: 10_000,
			},
			164: {
				name: "Congealing Cells",
				requirement: 1_000_000,
			},
			165: {
				name: "Ever-Replicating Cells",
				requirement: 100_000_000,
			},
			166: {
				name: "Planetary Life",
				done() { return player.cl.points.gte(100) && player.pl.points.gte(1) },
				tooltip: "obtain 100 cellular life and 1 planet.",
				unlocked() { return hasAchievement("A", 162) && hasAchievement("A", 191) },
			},
			171: {
				name: "Rising Chaos",
				requirement: 1,
			},
			172: {
				name: "Madness of Chaos",
				requirement: 8,
			},
			173: {
				name: "Chaos Engulfs",
				requirement: 64,
			},
			174: {
				name() { return "Chaos of " + (getBuyableAmount("pl", 22).gte(3) ? "Memory" : randomStr(6)) },
				requirement: 256,
			},
			175: {
				name() { return (getBuyableAmount("pl", 22).gte(4) ? "Chaos of Time" : randomStr(5) + " " + randomStr(2) + " " + randomStr(4)) },
				requirement: 1024,
			},
			176: {
				name: "Chaotic Planet",
				done() { return player.ch.points.gte(8) && player.pl.points.gte(1) },
				tooltip: "obtain 8 chaos and 1 planet.",
				unlocked() { return hasAchievement("A", 172) && hasAchievement("A", 191) },
			},
			181: {
				name: "The First Organism",
				requirement: 1,
			},
			182: {
				name: "Growing Organisms",
				requirement: 10,
			},
			183: {
				name: "Organism Population",
				requirement: 100,
			},
			184: {
				name: "Ecosystem of Organisms",
				requirement: 1_000,
			},
			185: {
				name: "Society of Organisms",
				requirement: 10_000,
			},
			186: {
				name: "Planet Habitation",
				done() { return player.mo.points.gte(10) && player.pl.points.gte(1) },
				tooltip: "obtain 10 multicellular organisms and 1 planet.",
				unlocked() { return hasAchievement("A", 182) && hasAchievement("A", 191) },
			},
			191: {
				name: "Home Planet",
				requirement: 1,
			},
			192: {
				name: "Observable Planets",
				requirement: 5,
			},
			193: {
				name: "Solar System",
				requirement: 8,
			},
		};
		const done = req => player.points.gte(req);
		const doneLayer = (layer, req) => player[layer].points.gte(req);
		const image = id => { if (hasAchievement("A", id)) return "images/achievements/" + id + ".png" };
		const currencyNames = ["point", "essence", "core", "quark", "subatomic particle", "hex", "demon soul", "atom", "prayer", "sanctum", "relic", "molecule", "good influence", "evil influence", "war", "cellular life", "chaos", "multicellular organism", "planet"];
		for (const key in obj) {
			const requirement = obj[key].requirement;
			const layerIndex = Math.floor((+key) / 10) - 1;
			const layer = LAYER_ORDER[layerIndex];
			if (requirement) {
				if (layer) obj[key].done = doneLayer.bind(null, layer, requirement);
				else obj[key].done = done.bind(null, requirement);
				obj[key].tooltip = "obtain " + simpleFormatWhole(requirement) + " " + (requirement === 1 ? currencyNames[layerIndex] : (layer ? layers[layer].resource : "points")) + ".";
			};
			if (key != 11) {
				const columnId = (+key) % 10;
				if (columnId === 1) obj[key].unlocked = hasAchievement.bind(null, "A", +key);
				else if (columnId <= 5) obj[key].unlocked = hasAchievement.bind(null, "A", (+key) - 1);
			};
			if (+key < 150) {
				obj[key].image = image.bind(null, +key);
				if (+key >= 140) obj[key].style = {"background-position": "-2px -2px", "background-size": "94px", "background-repeat": "no-repeat"};
			};
			obj[key].popupColor = (layer ? layers[layer].color : "#DFDFDF");
		};
		return obj;
	})(),
});
