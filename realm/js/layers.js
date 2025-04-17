function getGemsTabStartingStats() { return {
	bestClickValue: newDecimalOne(),
	bestTotalClickValue: newDecimalZero(),
	bestClickTimes: newDecimalZero(),
	totalClickTimes: newDecimalZero(),
	bestCreations: newDecimalZero(),
}};

const creationNames = [
	["Dirt", "Rich Dirt", "Richer Dirt", "Dry Soil", "Soil", "Fertile Soil", "Perfected Soil"],
	["Pebbles", "Rocks", "Boulders", "Stone Hills", "Stone Caves"],
	["Weeds", "Reeds", "Grass"],
];

const creationTierReq = [10, 25, 50, 100, 250, 500, 1000];

function getCreationName(id, lowercase = false) {
	let num = 0;
	while (hasUpgrade("G", (+id) + (num * 10) + 90)) {
		num++;
	};
	if (lowercase) return creationNames[id - 1][num].toLowerCase();
	else return creationNames[id - 1][num];
};

function getCreationTierUpgradeDesc(id, cost, eff, eff2 = 0) {
	const names = creationNames[id % 10 - 1];
	const index = Math.floor(id / 10) - 9;
	if (id % 10 == 3) {
		return "<h3>" + names[index + 1] + "</h3><br>increases " + names[index].toLowerCase() + "'" + (names[index].endsWith("s") ? "" : "s") + " first base effect by +" + format(eff, 2, false) + ", second base effect by +" + format(eff2, 2, false) + "%<br><br>Req: " + creationTierReq[index] + " " + names[index].toLowerCase() + "<br><br>Cost: " + format(cost) + " coins";
	} else {
		return "<h3>" + names[index + 1] + "</h3><br>increases " + names[index].toLowerCase() + "'" + (names[index].endsWith("s") ? "" : "s") + " base effect by +" + format(eff, 2, false) + "<br><br>Req: " + creationTierReq[index] + " " + names[index].toLowerCase() + "<br><br>Cost: " + format(cost) + " coins";
	};
};

function getCreationCost(amount, mult = 1) {
	return amount.add(1).pow(amount.add(1).pow(0.1).add(amount.div(25000))).mul(mult);
};

function getCreationBulk() {
	return +(getClickableState("G", 21) || 1);
};

function getCreationBulkCost(amount, mult = 1) {
	let total = newDecimalZero();
	for (let index = 0; index < getCreationBulk(); index++) {
		total = total.add(getCreationCost(amount.add(index), mult));
	};
	return total;
};

addLayer("G", {
	name: "Gems",
	symbol: "G",
	row: 0,
	position: 0,
	startData() { return {
		unlocked: true,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		clickValue: newDecimalOne(),
		clickTimes: newDecimalZero(),
		gemMult: newDecimalOne(),
		stats: [{
			bestClickValue: newDecimalOne(),
			bestTotalClickValue: newDecimalZero(),
			bestCreations: newDecimalZero(),
		}, getGemsTabStartingStats(), getGemsTabStartingStats()],
	}},
	color: "#CCCCCC",
	requires: new Decimal(100000),
	resource: "gems",
	baseResource: "total coins this era",
	baseAmount() {return player.stats[0].total},
	type: "normal",
	exponent: 0.5,
	gainMult() {
		let mult = newDecimalOne();
		return mult;
	},
	gainExp() {
		return newDecimalOne();
	},
	resetDescription: "Abdicate for ",
	effect() {return player.G.points.mul(player.G.gemMult).mul(0.01).add(1)},
	effectDescription() {return "which are increasing all production by " + player.G.gemMult + "% each, for a total of " + format(tmp.G.effect) + 'x'},
	hotkeys: [
		{key: "a", description: "A: Abdicate for gems", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() {return true},
	doReset(resettingLayer) {
		player.FC = [newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero(), newDecimalZero()];
		player.FCchance = new Decimal(2.5);
		player.totalFC = newDecimalZero();
		player.stats[0] = getPlayerStartingStats();
		if (resettingLayer === "G") {
			layerDataReset("G", ["points", "best", "stats"]);
			player.G.stats[0] = getGemsTabStartingStats();
			layerDataReset("M", ["stats"]);
			player.M.stats[0] = getManaTabStartingStats();
			layerDataReset("F");
		};
	},
	update(diff) {
		// clicks
		let clickGain = newDecimalOne();
		if (getBuyableAmount("G", 11).gt(0)) clickGain = clickGain.add(getBuyableAmount("G", 11).mul(buyableEffect("G", 11)));
		if (getBuyableAmount("G", 13).gt(0) && hasUpgrade("F", 1143)) clickGain = clickGain.add(getBuyableAmount("G", 13) * buyableEffect("G", 13));
		if (hasUpgrade("F", 1033)) clickGain = clickGain.mul(upgradeEffect("F", 1033));
		if (hasUpgrade("F", 1041)) clickGain = clickGain.mul(upgradeEffect("F", 1041));
		if (hasUpgrade("F", 1043)) clickGain = clickGain.mul(upgradeEffect("F", 1043));
		if (hasUpgrade("F", 1153)) clickGain = clickGain.mul(upgradeEffect("F", 1153));
		clickGain = clickGain.mul(tmp.G.effect);
		if (getClickableState("M", 12) == "ON") clickGain = clickGain.mul(clickableEffect("M", 12));
		if (hasUpgrade("F", 11) && getClickableState("M", 13) == "ON") clickGain = clickGain.mul(clickableEffect("M", 13));
		player.G.clickValue = clickGain;
		player.G.stats.forEach(obj => obj.bestClickValue = obj.bestClickValue.max(player.G.clickValue));
		// faction coins
		let FCchance = new Decimal(2.5);
		if (getBuyableAmount("G", 13).gt(0)) FCchance = FCchance.add(getBuyableAmount("G", 13).mul(buyableEffect("G", 13).div(10)));
		if (hasUpgrade("F", 1033)) FCchance = FCchance.add(upgradeEffect("F", 1033).mul(3));
		if (hasUpgrade("F", 1042)) FCchance = FCchance.add(upgradeEffect("F", 1042));
		if (hasUpgrade("F", 1061)) FCchance = FCchance.add(upgradeEffect("F", 1061));
		if (hasUpgrade("F", 1063)) FCchance = FCchance.add(upgradeEffect("F", 1063));
		if (hasUpgrade("G", 2011) && !hasUpgrade("G", 2012)) FCchance = FCchance.add(upgradeEffect("G", 2011));
		if (hasUpgrade("G", 2011) && hasUpgrade("G", 2012)) FCchance = FCchance.add(upgradeEffect("G", 2011).mul(upgradeEffect("G", 2012)));
		player.FCchance = new Decimal(FCchance);
		player.stats.forEach(obj => obj.FCchancebest = obj.FCchancebest.max(player.FCchance));
		player.totalFC = player.FC[0].add(player.FC[1]).add(player.FC[2]).add(player.FC[3]).add(player.FC[4]).add(player.FC[5]);
		player.stats.forEach(obj => obj.FCbest = obj.FCbest.max(player.totalFC));
		// creations
		const bestCreations = getBuyableAmount("G", 11).add(getBuyableAmount("G", 12)).add(getBuyableAmount("G", 13));
		player.G.stats.forEach(obj => obj.bestCreations = obj.bestCreations.max(bestCreations));
		// gems
		if (player.G.best.gt(player.bestGems)) player.bestGems = player.G.best;
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		["display-text", () => "Your faction coin find chance is " + format(player.FCchance) + "%"],
		"blank",
		["row", [
			["display-text", () => "<div style='color: #FF00FF'>You have " + formatWhole(player.FC[0]) + " fairy coins</div><div style='color: #00FF00'>You have " + formatWhole(player.FC[1]) + " elf coins</div><div style='color: #00FFFF'>You have " + formatWhole(player.FC[2]) + " angel coins</div>"],
			["blank", ["17px"]],
			["clickables", [1]],
			["blank", ["17px"]],
			["display-text", () => "<div style='color: #888800'>You have " + formatWhole(player.FC[3]) + " goblin coins</div><div style='color: #8800FF'>You have " + formatWhole(player.FC[4]) + " undead coins</div><div style='color: #880000'>You have " + formatWhole(player.FC[5]) + " demon coins</div>"],
		]],
		"blank",
		["display-text", "<h2>Creations</h2>"],
		"blank",
		["clickables", [2]],
		"blank",
		"buyables",
		"blank",
		["display-text", () => { if (getBuyableAmount("G", 11).gte(10) || getBuyableAmount("G", 12).gte(10) || getBuyableAmount("G", 13).gte(10)) return '<h2>Creation Tier Upgrades</h2>' }],
		"blank",
		["upgrades", [9, 10, 11, 12, 13, 14]],
		["display-text", () => { if (player.G.points.gte(1)) return "<h2>Gem Power Upgrades</h2>" }],
		"blank",
		["upgrades", [201]],
	],
	componentStyles: {
		"buyable"() { return {'width':'180px', 'height':'180px'} },
	},
	clickables: {
		11: {
			title() {return "click for " + format(player.G.clickValue) + " coins"},
			canClick() {return true},
			onClick() {
				// faction coin initialization
				const factionCoinGainType = getRandInt(0, 6);
				let factionCoinsFound = newDecimalZero();
				let clickPower = player.G.clickValue;
				// faction coins gained calculation
				if (player.FCchance.gte(100)) factionCoinsFound = player.FCchance.div(100);
				else if (player.FCchance.div(100).gte(Math.random())) factionCoinsFound = newDecimalOne();
				if (hasUpgrade("F", 1053) && factionCoinGainType === 2) factionCoinsFound = factionCoinsFound.mul(5);
				factionCoinsFound = factionCoinsFound.floor();
				// faction coins gained
				player.FC[factionCoinGainType] = player.FC[factionCoinGainType].add(factionCoinsFound);
				player.stats.forEach(obj => obj.FCtotal = obj.FCtotal.add(factionCoinsFound));
				// times clicked
				player.G.clickTimes = player.G.clickTimes.add(1);
				// best times clicked
				if (player.G.clickTimes.gt(player.G.stats[1].bestClickTimes)) player.G.stats[1].bestClickTimes = player.G.clickTimes;
				if (player.G.clickTimes.gt(player.G.stats[2].bestClickTimes)) player.G.stats[2].bestClickTimes = player.G.clickTimes;
				// total times clicked
				player.G.stats[1].totalClickTimes = player.G.stats[1].totalClickTimes.add(1);
				player.G.stats[2].totalClickTimes = player.G.stats[2].totalClickTimes.add(1);
				// coins gained
				if (hasUpgrade("F", 11) && getClickableState("M", 13) == "ON") clickPower = clickPower.mul(clickableEffect("M", 13));
				player.points = player.points.add(clickPower);
				player.stats.forEach(obj => obj.total = obj.total.add(clickPower));
				player.G.stats.forEach(obj => obj.bestTotalClickValue = obj.bestTotalClickValue.add(clickPower));
			},
		},
		21: {
			title() {return "You are bulk buying " + formatWhole(getCreationBulk()) + "x creations"},
			canClick() {return true},
			onClick() {
				const bulk = getCreationBulk();
				if (bulk === 1) {
					setClickableState("G", 21, 10);
				} else if (bulk === 10) {
					setClickableState("G", 21, 100);
				} else {
					setClickableState("G", 21, 1);
				};
			},
			style: {"width": "350px", "min-height": "30px", "border-radius": "15px"},
		},
	},
	buyables: {
		11: {
			title() { return getCreationName(this.id - 10) },
			cost() { return getCreationBulkCost(getBuyableAmount("G", this.id)) },
			effect() {
				let eff = new Decimal(0.1);
				if (hasUpgrade("G", 91)) eff = eff.add(0.05);
				if (hasUpgrade("G", 101)) eff = eff.add(0.1);
				if (hasUpgrade("G", 111)) eff = eff.add(0.2);
				if (hasUpgrade("G", 121)) eff = eff.add(0.4);
				if (hasUpgrade("G", 131)) eff = eff.add(0.65);
				if (hasUpgrade("G", 141)) eff = eff.add(1);
				if (hasUpgrade("F", 1083)) eff = eff.add(upgradeEffect("F", 1083).mul(1));
				if (hasUpgrade("F", 1031)) eff = eff.mul(upgradeEffect("F", 1031));
				if (hasUpgrade("F", 1032)) eff = eff.mul(upgradeEffect("F", 1032));
				return eff;
			},
			display() {
				if (this.cost() == newDecimalOne()) return "\nCost: 1 coin\n\nAmount: " + getBuyableAmount("G", this.id) + "\n\nEffect: +" + format(buyableEffect("G", this.id)) + " to click production\n\nTotal Effect: +" + format(getBuyableAmount("G", this.id) * buyableEffect("G", this.id));
				else return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount("G", this.id) + "\n\nEffect: +" + format(buyableEffect("G", this.id)) + " to click production\n\nTotal Effect: +" + format(getBuyableAmount("G", this.id) * buyableEffect("G", this.id));
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("G", this.id, getBuyableAmount("G", this.id).add(getCreationBulk()));
			},
		},
		12: {
			title() { return getCreationName(this.id - 10) },
			cost() { return getCreationBulkCost(getBuyableAmount("G", this.id), 100) },
			effect() {
				let eff = new Decimal(0.25);
				if (hasUpgrade("G", 92)) eff = eff.add(0.5);
				if (hasUpgrade("G", 102)) eff = eff.add(1.25);
				if (hasUpgrade("G", 112)) eff = eff.add(2);
				if (hasUpgrade("G", 122)) eff = eff.add(3.5);
				if (hasUpgrade("F", 1083)) eff = eff.add(upgradeEffect("F", 1083).mul(2));
				if (hasUpgrade("F", 1031)) eff = eff.mul(upgradeEffect("F", 1031));
				if (hasUpgrade("F", 1032)) eff = eff.mul(upgradeEffect("F", 1032));
				return eff;
			},
			display() { return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount("G", this.id) + "\n\nEffect: +" + format(buyableEffect("G", this.id)) + " to passive production\n\nTotal Effect: +" + format(getBuyableAmount("G", this.id) * buyableEffect("G", this.id)) },
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("G", this.id, getBuyableAmount("G", this.id).add(getCreationBulk()));
			},
		},
		13: {
			title() { return getCreationName(this.id - 10) },
			cost() { return getCreationBulkCost(getBuyableAmount("G", this.id), 10000) },
			effect() {
				let eff = new Decimal(2.5);
				if (hasUpgrade("G", 93)) eff = eff.add(0.5);
				if (hasUpgrade("G", 103)) eff = eff.add(2);
				if (hasUpgrade("F", 1083)) eff = eff.add(upgradeEffect("F", 1083).mul(4));
				if (hasUpgrade("F", 1031)) eff = eff.mul(upgradeEffect("F", 1031));
				if (hasUpgrade("F", 1032)) eff = eff.mul(upgradeEffect("F", 1032));
				return eff;
			},
			display() {
				if (hasUpgrade("F", 1143)) return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount("G", this.id) + "\n\nEffect: +" + format(buyableEffect("G", this.id)) + " to click production and\n+" + format(buyableEffect("G", this.id).div(10)) + "% to FC find chance\n\nTotal Effect: +" + format(getBuyableAmount("G", this.id) * buyableEffect("G", this.id)) + "\nand +" + format((getBuyableAmount("G", this.id) * buyableEffect("G", this.id).div(10))) + "%";
				else return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount("G", this.id) + "\n\nEffect: +" + format(buyableEffect("G", this.id)) + " to passive production and\n+" + format(buyableEffect("G", this.id).div(10)) + "% to FC find chance\n\nTotal Effect: +" + format(getBuyableAmount("G", this.id) * buyableEffect("G", this.id)) + "\nand +" + format((getBuyableAmount("G", this.id) * buyableEffect("G", this.id).div(10))) + "%";
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("G", this.id, getBuyableAmount("G", this.id).add(getCreationBulk()));
			},
		},
	},
	upgrades: {
		// creation tiers
		91: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.05) },
			cost: 250,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) },
		},
		92: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.5) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) },
		},
		93: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.5, 0.05) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) },
		},
		101: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.1) },
			cost: 1000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("G", this.id - 10) },
		},
		102: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 1.25) },
			cost: 25000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("G", this.id - 10) },
		},
		103: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 2, 0.2) },
			cost: 2500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("G", this.id - 10) },
		},
		111: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.2) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("G", this.id - 10) },
		},
		112: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 2) },
			cost: 100000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("G", this.id - 10) },
		},
		121: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.4) },
			cost: 25000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("G", this.id - 10) },
		},
		122: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 3.5) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("G", this.id - 10) },
		},
		131: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.65) },
			cost: 100000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("G", this.id - 10) },
		},
		141: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 1) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("G", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("G", this.id - 10) },
		},
		// other upgrades
		2011: {
			fullDisplay() { return '<h3>Gem Influence</h3><br>increase faction coin find chance based on your gems<br><br>Effect: +' + format(upgradeEffect("G", this.id)) + '%<br><br>Req: 25 1st creations'},
			effect() { return player.G.points.add(1).pow(0.5).sub(1) },
			canAfford() { return getBuyableAmount("G", 11).gte(25) },
			unlocked() { return player.G.points.gte(1) },
		},
		2012: {
			fullDisplay() { return '<h3>Gem Displays</h3><br>increase the effect of <b>Gem Influence</b> based on your gems<br><br>Effect: x' + format(upgradeEffect("G", this.id)) + '<br><br>Req: 25 2nd creations'},
			effect() { return player.G.points.add(1).pow(0.2) },
			canAfford() { return getBuyableAmount("G", 12).gte(25) },
			unlocked() { return player.G.points.gte(1) },
		},
		2013: {
			fullDisplay() { return '<h3>Gem Displays</h3><br>increase max mana and mana regen based on your gems<br><br>Effect: x' + format(upgradeEffect("G", this.id)) + '<br><br>Req: 25 3rd creations'},
			effect() { return player.G.points.add(1).log10().add(1).pow(0.5) },
			canAfford() { return getBuyableAmount("G", 13).gte(25) },
			unlocked() { return player.G.points.gte(1) },
		},
	},
});

function getManaTabStartingStats() { return {
	manaRegenBest: new Decimal(2.5),
	manaTotal: newDecimalZero(),
	maxManaBest: new Decimal(100),
	taxCasts: newDecimalZero(),
	callCasts: newDecimalZero(),
	holyCasts: newDecimalZero(),
	frenzyCasts: newDecimalZero(),
}};

addLayer("M", {
	name: "Mana",
	symbol: "M",
	row: 0,
	position: 1,
	startData() { return {
		unlocked: true,
		mana: newDecimalZero(),
		maxMana: new Decimal(100),
		manaRegen: new Decimal(2.5),
		taxEff: new Decimal(30),
		taxCost: new Decimal(80),
		callBoost: newDecimalOne(),
		callTime: newDecimalZero(),
		callCost: new Decimal(160),
		sideSpellBoost: newDecimalOne(),
		sideSpellTime: newDecimalZero(),
		sideSpellCost: new Decimal(120),
		stats: [getManaTabStartingStats(), getManaTabStartingStats(), getManaTabStartingStats()],
	}},
	color: "#AA55AA",
	type: "none",
	layerShown() {return true},
	tooltip() {return formatWhole(player.M.mana) + "/" + formatWhole(player.M.maxMana) + " mana"},
	doReset(resettingLayer) {},
	update(diff) {
		let manaCapped = false;
		let prevMana = player.M.mana;
		let manaRegen = new Decimal(2.5);
		let maxMana = new Decimal(100);
		let taxEff = new Decimal(30);
		let callBoost = newDecimalOne();
		let sideSpellBoost = newDecimalOne();
		let taxCost = new Decimal(80);
		let callCost = new Decimal(160);
		let sideSpellCost = new Decimal(120);
		// spell boosts
		if (hasUpgrade("F", 1162)) taxEff = taxEff.add(30);
		if (hasUpgrade("F", 1152)) taxEff = taxEff.mul(2);
		if (hasUpgrade("F", 1152)) callBoost = callBoost.mul(2);
		if (hasUpgrade("F", 1152)) sideSpellBoost = sideSpellBoost.mul(2);
		if (hasUpgrade("F", 1082)) sideSpellBoost = sideSpellBoost.mul(upgradeEffect("F", 1082));
		// return spell boost effects
		player.M.taxEff = taxEff;
		player.M.callBoost = callBoost;
		player.M.sideSpellBoost = sideSpellBoost;
		// spell costs
		if (hasUpgrade("F", 1152)) taxCost = taxCost.mul(3);
		if (hasUpgrade("F", 1152)) callCost = callCost.mul(3);
		if (hasUpgrade("F", 1152)) sideSpellCost = sideSpellCost.mul(3);
		// return spell cost
		player.M.taxCost = taxCost;
		player.M.callCost = callCost;
		player.M.sideSpellCost = sideSpellCost;
		// mana regen buffs
		if (hasUpgrade("M", 22) && upgradeEffect("M", 22).gt(0)) manaRegen = manaRegen.add(upgradeEffect("M", 22));
		if (hasUpgrade("M", 24) && upgradeEffect("M", 24).gt(0)) manaRegen = manaRegen.add(upgradeEffect("M", 24));
		if (hasUpgrade("F", 1052)) manaRegen = manaRegen.mul(upgradeEffect("F", 1052));
		if (hasUpgrade("G", 2013)) manaRegen = manaRegen.mul(upgradeEffect("G", 2013));
		player.M.manaRegen = manaRegen;
		const diffMana = player.M.manaRegen.mul(diff);
		// max mana buffs
		if (hasUpgrade("F", 1051)) maxMana = maxMana.mul(upgradeEffect("F", 1051));
		if (hasUpgrade("F", 1151)) maxMana = maxMana.mul(upgradeEffect("F", 1151));
		if (hasUpgrade("M", 21)) maxMana = maxMana.mul(upgradeEffect("M", 21));
		if (hasUpgrade("M", 23)) maxMana = maxMana.mul(upgradeEffect("M", 23));
		if (hasUpgrade("G", 2013)) maxMana = maxMana.mul(upgradeEffect("G", 2013));
		player.M.maxMana = maxMana;
		// increase mana
		if (player.M.mana.add(diffMana).gte(player.M.maxMana)) {
			player.M.mana = player.M.maxMana;
			manaCapped = true;
		} else {
			player.M.mana = player.M.mana.add(diffMana);
		};
		// total mana
		if (manaCapped) {
			player.M.stats[0].manaTotal = player.M.stats[0].manaTotal.add(player.M.maxMana.sub(prevMana));
			player.M.stats[1].manaTotal = player.M.stats[1].manaTotal.add(player.M.maxMana.sub(prevMana));
			player.M.stats[2].manaTotal = player.M.stats[2].manaTotal.add(player.M.maxMana.sub(prevMana));
		} else {
			player.M.stats[0].manaTotal = player.M.stats[0].manaTotal.add(diffMana);
			player.M.stats[1].manaTotal = player.M.stats[1].manaTotal.add(diffMana);
			player.M.stats[2].manaTotal = player.M.stats[2].manaTotal.add(diffMana);
		};
		// best mana
		if (player.M.maxMana.gt(player.M.stats[0].maxManaBest)) player.M.stats[0].maxManaBest = player.M.maxMana;
		if (player.M.maxMana.gt(player.M.stats[1].maxManaBest)) player.M.stats[1].maxManaBest = player.M.maxMana;
		if (player.M.maxMana.gt(player.M.stats[2].maxManaBest)) player.M.stats[2].maxManaBest = player.M.maxMana;
		if (player.M.manaRegen.gt(player.M.stats[0].manaRegenBest)) player.M.stats[0].manaRegenBest = player.M.manaRegen;
		if (player.M.manaRegen.gt(player.M.stats[1].manaRegenBest)) player.M.stats[1].manaRegenBest = player.M.manaRegen;
		if (player.M.manaRegen.gt(player.M.stats[2].manaRegenBest)) player.M.stats[2].manaRegenBest = player.M.manaRegen;
		// spell time
		if (getClickableState("M", 12) == "ON") player.M.callTime = player.M.callTime.sub(diff);
		if (getClickableState("M", 13) == "ON") player.M.sideSpellTime = player.M.sideSpellTime.sub(diff);
		// spell done time
		if (player.M.callTime.lte(0)) setClickableState("M", 12) == "OFF", player.M.callTime = newDecimalZero();
		if (player.M.sideSpellTime.lte(0)) setClickableState("M", 13) == "OFF", player.M.sideSpellTime = newDecimalZero();
		// primary autocasting
		if (player.M.callTime.lte(0) && player.M.mana.gte(player.M.callCost)) {
			if (getClickableState("M", 102) == "primary - ON") {
				callCast();
			} else if (getClickableState("M", 102) == "ternary - ON" && player.M.mana.gte(player.M.maxMana.div(2))) {
				callCast();
			};
		};
		if (player.M.sideSpellTime.lte(0) && player.M.mana.gte(player.M.sideSpellCost)) {
			if (getClickableState("M", 103) == "primary - ON") {
				sideSpellCast();
			} else if (getClickableState("M", 103) == "ternary - ON" && player.M.mana.gte(player.M.maxMana.div(2))) {
				sideSpellCast();
			};
		};
		// secondary autocasting
		if (player.M.callTime.gt(0) && player.M.sideSpellTime.gt(0) && player.M.mana.gte(player.M.taxCost)) {
			if (getClickableState("M", 101) == "secondary - ON") {
				taxCast(player.M.mana.div(player.M.taxCost).floor());
			} else if (getClickableState("M", 101) == "ternary - ON" && player.M.mana.gte(player.M.maxMana.div(2))) {
				taxCast(player.M.mana.sub(player.M.maxMana.div(2)).div(player.M.taxCost).floor());
			};
		};
	},
	tabFormat: [
		["display-text", "<h2>Spell Casting</h2>"],
		"blank",
		["clickables", [1]],
		"blank",
		["clickables", [10]],
		"blank",
		["bar", "manabar"],
		"blank",
		["display-text", () => "<h2>Mana Upgrades</h2><br>You have " + format(player.M.stats[0].manaTotal) + " mana generated"],
		"blank",
		["upgrades", [2]],
		["display-text", () => "<h2>Autocasting Upgrades</h2><br>You have " + format(player.M.stats[1].manaTotal) + " total mana generated"],
		"blank",
		["upgrades", [10]],
	],
	clickables: {
		11: {
			title: "<span style='color: #000000'>Tax Collection</span>",
			display() { return '<span style="color: #000000">get coins equal to ' + formatWhole(player.M.taxEff) + ' seconds of passive production<br><br>Effect: +' + format(getPointGen().mul(player.M.taxEff)) + '<br><br>Cost: ' + formatWhole(player.M.taxCost) + ' mana</span>' },
			canClick() { if (player.M.mana.gte(player.M.taxCost)) return true },
			onClick() { taxCast() },
		},
		12: {
			title: "<span style='color: #000000'>Call to Arms</span>",
			display() { return '<span style="color: #000000">boost all production based on your creations for 30 seconds<br>Time left: ' + format(player.M.callTime) + 's<br><br>Effect: x' + format(clickableEffect("M", this.id)) + '<br><br>Cost: ' + formatWhole(player.M.callCost) + ' mana' },
			effect() { return player.G.stats[0].bestCreations.add(1).pow(0.15).mul(player.M.callBoost)},
			canClick() {
				if (getClickableState("M", this.id) == "ON") return false;
				if (player.M.mana.gte(player.M.callCost)) return true;
				return false;
			},
			onClick() { callCast() },
		},
		13: {
			title() {
				if (hasUpgrade("F", 11)) return "<span style='color: #0000FF'>Holy Light</span>";
				if (hasUpgrade("F", 21)) return "<span style='color: #FF0000'>Blood Frenzy</span>";
				return "CHOOSE A SIDE TO UNLOCK";
			},
			display() {
				if (hasUpgrade("F", 11)) return '<span style="color: #0000FF">boost click production based on your mana for 15 seconds<br>Time left: ' + format(player.M.sideSpellTime) + 's<br><br>Effect: x' + format(clickableEffect("M", this.id)) + '<br><br>Cost: ' + formatWhole(player.M.sideSpellCost) + ' mana';
				if (hasUpgrade("F", 21)) return '<span style="color: #FF0000">boost passive production based on your mana for 15 seconds<br>Time left: ' + format(player.M.sideSpellTime) + 's<br><br>Effect: x' + format(clickableEffect("M", this.id)) + '<br><br>Cost: ' + formatWhole(player.M.sideSpellCost) + ' mana';
				return "";
			},
			effect() { return player.M.mana.add(1).pow(0.25).mul(player.M.sideSpellBoost) },
			canClick() {
				if (getClickableState("M", this.id) == "ON") return false;
				if (player.M.mana.gte(player.M.sideSpellCost) && hasChosenSide()) return true;
				return false;
			},
			onClick() { sideSpellCast() },
		},
		101: {
			title: "Autocasting",
			display() {
				if (hasUpgrade("M", 102)) return getClickableState(this.layer, this.id) || "OFF";
				return "LOCKED - need better autocasting";
			},
			canClick() { return hasUpgrade("M", 102) },
			onClick() {
				if (getClickableState(this.layer, this.id) == "ternary - ON") {
					setClickableState(this.layer, this.id, "OFF");
				} else if (getClickableState(this.layer, this.id) == "secondary - ON") {
					if (hasUpgrade("M", 103)) setClickableState(this.layer, this.id, "ternary - ON");
					else setClickableState(this.layer, this.id, "OFF");
				} else {
					setClickableState(this.layer, this.id, "secondary - ON");
				};
			},
			style: {'min-height': '50px', 'border-radius': '25px'},
			unlocked() { return hasUpgrade("M", 101) },
		},
		102: {
			title: "Autocasting",
			display() { return getClickableState(this.layer, this.id) || "OFF" },
			canClick() { return true },
			onClick() {
				if (getClickableState(this.layer, this.id) == "ternary - ON") {
					setClickableState(this.layer, this.id, "OFF");
				} else if (getClickableState(this.layer, this.id) == "primary - ON") {
					if (hasUpgrade("M", 103)) setClickableState(this.layer, this.id, "ternary - ON");
					else setClickableState(this.layer, this.id, "OFF");
				} else {
					setClickableState(this.layer, this.id, "primary - ON");
				};
			},
			style: {'min-height': '50px', 'border-radius': '25px'},
			unlocked() { return hasUpgrade("M", 101) },
		},
		103: {
			title() {
				if (hasChosenSide()) return "Autocasting";
				return "CHOOSE A SIDE TO UNLOCK";
			},
			display() { if (hasChosenSide()) return getClickableState(this.layer, this.id) || "OFF" },
			canClick() { return hasChosenSide() },
			onClick() {
				if (getClickableState(this.layer, this.id) == "ternary - ON") {
					setClickableState(this.layer, this.id, "OFF");
				} else if (getClickableState(this.layer, this.id) == "primary - ON") {
					if (hasUpgrade("M", 103)) setClickableState(this.layer, this.id, "ternary - ON");
					else setClickableState(this.layer, this.id, "OFF");
				} else {
					setClickableState(this.layer, this.id, "primary - ON");
				};
			},
			style: {'min-height': '50px', 'border-radius': '25px'},
			unlocked() { return hasUpgrade("M", 101) },
		},
	},
	bars: {
		manabar: {
			direction: RIGHT,
			width: 500,
			height: 50,
			display() { return "You have " + format(player.M.mana) + "/" + format(player.M.maxMana) + " mana<br>(" + format(player.M.manaRegen) + "/s)" },
			fillStyle() { return {"background-color": "#AA55AA" } },
			borderStyle() { return {"border-color": "#AA55AA"} },
			progress() { return player.M.mana.div(player.M.maxMana) },
		},
	},
	upgrades: {
		11: {
			canAfford() { return player.M.mana.gte(player.M.maxMana) },
		},
		21: {
			fullDisplay() { return '<h3>Mana Cup</h3><br>increase max mana based on your mana<br><br>Effect: x' + format(upgradeEffect("M", this.id)) + '<br><br>Req: 500 mana generated<br><br>Cost: 1,500 coins'},
			effect() { return player.M.mana.add(1).pow(0.1) },
			cost: 1500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			canAfford() { return player.M.stats[0].manaTotal.gte(500) },
		},
		22: {
			fullDisplay() { return '<h3>Mana Sense</h3><br>increase mana regen based on your mana<br><br>Effect: +' + format(upgradeEffect("M", this.id)) + '<br><br>Req: 1,500 mana generated<br><br>Cost: 5,000 coins'},
			effect() { return player.M.mana.add(1).pow(0.2) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			canAfford() { return player.M.stats[0].manaTotal.gte(1500) },
			unlocked() { return hasUpgrade("M", 21) },
		},
		23: {
			fullDisplay() { return '<h3>Mana Jar</h3><br>increase max mana based on your creations<br><br>Effect: x' + format(upgradeEffect("M", this.id)) + '<br><br>Req: 4,500 mana generated<br><br>Cost: 25,000 coins'},
			effect() { return player.G.stats[0].bestCreations.add(1).pow(0.125) },
			cost: 25000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			canAfford() { return player.M.stats[0].manaTotal.gte(4500) },
			unlocked() { return hasUpgrade("M", 22) },
		},
		24: {
			fullDisplay() { return '<h3>Mana Sight</h3><br>increase mana regen based on your creations<br><br>Effect: +' + format(upgradeEffect("M", this.id)) + '<br><br>Req: 15,000 mana generated<br><br>Cost: 125,000 coins'},
			effect() { return player.G.stats[0].bestCreations.add(1).pow(0.225) },
			cost: 125000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			canAfford() { return player.M.stats[0].manaTotal.gte(15000) },
			unlocked() { return hasUpgrade("M", 23) },
		},
		101: {
			fullDisplay() { return '<h3>Primary Autocasting</h3><br>unlock autocasting<br><br>Req: 10,000 total mana generated<br><br>Cost: 333 mana'},
			canAfford() { return player.M.mana.gte(333) && player.M.stats[1].manaTotal.gte(10000) },
			pay() { player.M.mana = player.M.mana.sub(333) },
		},
		102: {
			fullDisplay() { return '<h3>Secondary Autocasting</h3><br>unlock tax collection autocasting<br><br>Req: 100,000 total mana generated<br><br>Cost: 3,333 mana'},
			canAfford() { return player.M.mana.gte(3333) && player.M.stats[1].manaTotal.gte(100000) },
			pay() { player.M.mana = player.M.mana.sub(3333) },
			unlocked() { return hasUpgrade("M", 101) },
		},
		103: {
			fullDisplay() { return '<h3>Ternary Autocasting</h3><br>unlock autocasting when over 50% mana<br><br>Req: 1,000,000 total mana generated<br><br>Cost: 33,333 mana'},
			canAfford() { return player.M.mana.gte(33333) && player.M.stats[1].manaTotal.gte(1000000) },
			pay() { player.M.mana = player.M.mana.sub(33333) },
			unlocked() { return hasUpgrade("M", 102) },
		},
	},
});

function hasChosenSide() {
	return hasUpgrade("F", 11) || hasUpgrade("F", 21);
};

function hasChosenFaction() {
	return hasUpgrade("F", 31) || hasUpgrade("F", 41) || hasUpgrade("F", 51) || hasUpgrade("F", 61) || hasUpgrade("F", 71) || hasUpgrade("F", 81);
};

addLayer("F", {
	name: "Factions",
	symbol: "F",
	row: 0,
	position: 2,
	startData() { return {
		unlocked: true,
	}},
	color() {
		if (hasUpgrade("F", 11)) return "#0000CC";
		if (hasUpgrade("F", 21)) return "#CC0000";
		return "#CCCCCC";
	},
	type: "none",
	layerShown() {return true},
	tooltip() {return formatWhole(player.totalFC) + " faction coins"},
	doReset(resettingLayer) {},
	tabFormat: [
		["display-text", "<h2>Faction Upgrades</h2>"],
		"blank",
		["row", [["upgrades", [1]], ["blank", ["17px"]], ["upgrades", [2]]]],
		["row", [["upgrades", [3, 6]], ["blank", ["17px"]], ["upgrades", [4, 7]], ["blank", ["17px"]], ["upgrades", [5, 8]]]],
		["upgrades", [103, 104, 105, 106, 107, 108, 113, 114, 115, 116, 117, 118]],
	],
	upgrades: {
		// side picking
		11: {
			fullDisplay() { return '<h3>Proof of Good Deed</h3><br>ally yourself with the side of good, which focuses on active production<br><br>Cost: 250 coins'},
			canAfford() { return player.points.gte(250) && !hasChosenSide() },
			pay() { player.points = player.points.sub(250) },
			style: {'color': '#0000FF'},
		},
		21: {
			fullDisplay() { return '<h3>Proof of Evil Deed</h3><br>ally yourself with the side of evil, which focuses on passive production<br><br>Cost: 250 coins'},
			canAfford() { return player.points.gte(250) && !hasChosenSide() },
			pay() { player.points = player.points.sub(250) },
			style: {'color': '#FF0000'},
		},
		// faction picking
		31: {
			fullDisplay() { return '<h3>Fairy Alliance</h3><br>ally yourself with the fairies, which focus on basic creations<br><br>Cost: 5 fairy coins'},
			canAfford() { return player.FC[0].gte(5) && !hasChosenFaction() },
			pay() { player.FC[0] = player.FC[0].sub(5) },
			style: {'color': '#FF00FF'},
			unlocked() { return hasUpgrade("F", 11) },
		},
		41: {
			fullDisplay() { return '<h3>Elven Alliance</h3><br>ally yourself with the elves, which focus on click production<br><br>Cost: 5 elf coins'},
			canAfford() { return player.FC[1].gte(5) && !hasChosenFaction() },
			pay() { player.FC[1] = player.FC[1].sub(5) },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade("F", 11) },
		},
		51: {
			fullDisplay() { return '<h3>Angel Alliance</h3><br>ally yourself with the angels, which focus on mana and spells<br><br>Cost: 5 angel coins'},
			canAfford() { return player.FC[2].gte(5) && !hasChosenFaction() },
			pay() { player.FC[2] = player.FC[2].sub(5) },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade("F", 11) },
		},
		61: {
			fullDisplay() { return '<h3>Goblin Alliance</h3><br>ally yourself with the goblins, which focus on faction coins<br><br>Cost: 5 goblin coins'},
			canAfford() { return player.FC[3].gte(5) && !hasChosenFaction() },
			pay() { player.FC[3] = player.FC[3].sub(5) },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade("F", 21) },
		},
		71: {
			fullDisplay() { return '<h3>Undead Alliance</h3><br>ally yourself with the undead, which focus purely on passive production<br><br>Cost: 5 undead coins'},
			canAfford() { return player.FC[4].gte(5) && !hasChosenFaction() },
			pay() { player.FC[4] = player.FC[4].sub(5) },
			style: {'color': '#8800FF'},
			unlocked() { return hasUpgrade("F", 21) },
		},
		81: {
			fullDisplay() { return '<h3>Demon Alliance</h3><br>ally yourself with the demons, which focus on non-basic creations<br><br>Cost: 5 demon coins'},
			canAfford() { return player.FC[5].gte(5) && !hasChosenFaction() },
			pay() { player.FC[5] = player.FC[5].sub(5) },
			style: {'color': '#880000'},
			unlocked() { return hasUpgrade("F", 21) },
		},
		// faction upgrades
		// fairy faction
		1031: {
			fullDisplay() { return '<h3>Magic Dust</h3><br>increase the effect of basic creations based on your mana regen<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 500 coins'},
			effect() { return player.M.manaRegen.add(1).mul(2).pow(0.5) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#FF00FF'},
			unlocked() { return hasUpgrade("F", 31) },
		},
		1032: {
			fullDisplay() { return '<h3>Fairy Workers</h3><br>increase the effect of basic creations based on your creations<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 5,000 coins'},
			effect() { return player.G.stats[0].bestCreations.add(1).pow(0.2) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#FF00FF'},
			unlocked() { return hasUpgrade("F", 31) },
		},
		1033: {
			fullDisplay() { return '<h3>Fairy Traders</h3><br>increase click production and faction coin find chance based on your creations<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br>and +' + format(upgradeEffect("F", this.id).mul(3)) + '%<br><br>Cost: 50,000 coins'},
			effect() { return player.G.stats[0].bestCreations.add(1).pow(0.1) },
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#FF00FF', 'height':'120px'},
			unlocked() { return hasUpgrade("F", 31) },
		},
		// elf faction
		1041: {
			fullDisplay() { return '<h3>Super Clicks</h3><br>increase click production based on your creations<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 500 coins'},
			effect() { return player.G.stats[0].bestCreations.add(1).pow(0.25) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade("F", 41) },
		},
		1042: {
			fullDisplay() { return '<h3>Elven Luck</h3><br>increase faction coin find chance based on your click production<br><br>Effect: +' + format(upgradeEffect("F", this.id)) + '%<br><br>Cost: 5,000 coins'},
			effect() { return player.G.clickValue.add(1).pow(0.3) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade("F", 41) },
		},
		1043: {
			fullDisplay() { return '<h3>Elven Spirit</h3><br>increase click production based on your elf coins<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 50,000 coins'},
			effect() { return player.FC[1].add(1).pow(0.5) },
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade("F", 41) },
		},
		1044: {
			fullDisplay() { return '<h3>Elven Trade Route</h3><br>unlock 3 more elf upgrades<br><br>Cost: 25 elf coins'},
			canAfford() {
				if (player.FC[1].gte(25)) return true;
				else return false;
			},
			pay() {
				player.FC[1] = player.FC[1].sub(25);
			},
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade("F", 41) },
		},
		1141: {
			fullDisplay() { return '<h3>Elven Clicks</h3><br>increase click production based on your coins<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 500,000 coins'},
			effect() { return player.points.add(1).pow(0.01) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade("F", 1044) },
		},
		1142: {
			fullDisplay() { return '<h3>Enchanted Clicks</h3><br>increase click production based on your mana regen<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 5,000,000 coins'},
			effect() { return player.M.manaRegen.add(1).pow(0.5) },
			cost: 5000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade("F", 1044) },
		},
		1143: {
			fullDisplay() { return '<h3>All on One</h3><br>the 3rd creation\'s first effect now applies to click production instead of passive production<br><br>Cost: 50,000,000 coins'},
			cost: 50000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade("F", 1044) },
		},
		// angel faction
		1051: {
			fullDisplay() { return '<h3>Angelic Capacity</h3><br>increase max mana based on your mana generated<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 500 coins'},
			effect() { return player.M.stats[0].manaTotal.add(1).pow(0.075) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade("F", 51) },
		},
		1052: {
			fullDisplay() { return '<h3>Road to Heaven</h3><br>increase mana regen based on your angel coins<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 5,000 coins'},
			effect() { return player.FC[2].add(1).pow(0.5) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade("F", 51) },
		},
		1053: {
			fullDisplay() { return '<h3>Angels Supreme</h3><br>gain 5x angel coins<br><br>Cost: 50,000 coins'},
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade("F", 51) },
		},
		1054: {
			fullDisplay() { return '<h3>Angel Trade Route</h3><br>unlock 3 more angel upgrades<br><br>Cost: 25 angel coins'},
			canAfford() {
				if (player.FC[2].gte(25)) return true;
				else return false;
			},
			pay() {
				player.FC[2] = player.FC[2].sub(25);
			},
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade("F", 51) },
		},
		1151: {
			fullDisplay() { return '<h3>Rainbows</h3><br>increase max mana based on your faction coins<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 500,000 coins'},
			effect() { return player.totalFC.add(1).pow(0.2) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade("F", 1054) },
		},
		1152: {
			fullDisplay() { return '<h3>Prism Upgrade</h3><br>double spell effects, but triple their mana cost<br><br>Cost: 5,000,000 coins'},
			cost: 5000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade("F", 1054) },
		},
		1153: {
			fullDisplay() { return '<h3>Angelic Clicks</h3><br>increase click production based on your max mana<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 50,000,000 coins'},
			effect() { return player.M.maxMana.add(1).pow(0.05) },
			cost: 50000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade("F", 1054) },
		},
		// goblin faction
		1061: {
			fullDisplay() { return '<h3>Jackpot</h3><br>increase faction coin find chance based on your coins<br><br>Effect: +' + format(upgradeEffect("F", this.id)) + '%<br><br>Cost: 500 coins'},
			effect() { return player.points.add(1).pow(0.2) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade("F", 61) },
		},
		1062: {
			fullDisplay() { return '<h3>Goblin\'s Greed</h3><br>increase passive production based on your faction coins<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 5,000 coins'},
			effect() { return player.totalFC.add(1).pow(0.25) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade("F", 61) },
		},
		1063: {
			fullDisplay() { return '<h3>Currency Revolution</h3><br>increase faction coin find chance based on your faction coins<br><br>Effect: +' + format(upgradeEffect("F", this.id)) + '%<br><br>Cost: 50,000 coins'},
			effect() { return player.totalFC.add(1).pow(0.6) },
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade("F", 61) },
		},
		1064: {
			fullDisplay() { return '<h3>Goblin Trade Route</h3><br>unlock 3 more goblin upgrades<br><br>Cost: 25 goblin coins'},
			canAfford() {
				if (player.FC[3].gte(25)) return true;
				else return false;
			},
			pay() {
				player.FC[3] = player.FC[3].sub(25);
			},
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade("F", 61) },
		},
		1161: {
			fullDisplay() { return '<h3>Moneyload</h3><br>increase passive production based on your faction coin find chance<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 500,000 coins'},
			effect() { return player.FCchance.add(1).pow(0.3) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade("F", 1064) },
		},
		1162: {
			fullDisplay() { return '<h3>Absurd Taxes</h3><br>increase the base effect of Tax Collection by +30 seconds<br><br>Cost: 5,000,000 coins'},
			cost: 5000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade("F", 1064) },
		},
		1163: {
			fullDisplay() { return '<h3>Goblin Pride</h3><br>increase passive production based on your goblin coins<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 50,000,000 coins'},
			effect() { return player.FC[3].add(1).pow(0.3) },
			cost: 50000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade("F", 1064) },
		},
		// undead faction
		1071: {
			fullDisplay() { return '<h3>Undending Cycle</h3><br>increase passive production based on your coins<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 500 coins'},
			effect() { return player.points.add(1).pow(0.15) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#8800FF'},
			unlocked() { return hasUpgrade("F", 71) },
		},
		1072: {
			fullDisplay() { return '<h3>Corpse Piles</h3><br>increase passive production based on your undead coins<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 5,000 coins'},
			effect() { return player.FC[4].add(1).pow(0.5) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#8800FF'},
			unlocked() { return hasUpgrade("F", 71) },
		},
		1073: {
			fullDisplay() { return '<h3>Stay no More</h3><br>increase passive production based on your click production<br><br>Effect: x' + format(upgradeEffect("F", this.id)) + '<br><br>Cost: 50,000 coins'},
			effect() { return player.G.clickValue.add(1).pow(0.2) },
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#8800FF'},
			unlocked() { return hasUpgrade("F", 71) },
		},
		// demon faction
		1081: {
			fullDisplay() { return "<h3>Demonic Prestige</h3><br>increase passive production based on your creation tiers<br><br>Effect: x" + format(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: 500 coins"},
			effect() { return player.G.upgrades.length / 5 + 1 },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {"color": "#880000"},
			unlocked() { return hasUpgrade("F", 81) },
		},
		1082: {
			fullDisplay() { return "<h3>Demonic Blood</h3><br>increase blood frenzy effect based on your creations (higher numbered ones count more)<br><br>Effect: x" + format(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: 5,000 coins"},
			effect() {
				let amt = getBuyableAmount("G", 11);
				amt = amt.add(getBuyableAmount("G", 12).mul(5));
				amt = amt.add(getBuyableAmount("G", 13).mul(25));
				return amt.div(10).add(1).pow(0.1);
			},
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {"color": "#880000"},
			unlocked() { return hasUpgrade("F", 81) },
		},
		1083: {
			fullDisplay() { return "<h3>Polished Rage</h3><br>increase all creation's first base effects based on their number and your gems<br><br>Effect: +(" + format(upgradeEffect(this.layer, this.id)) + " * 2^num)<br><br>Cost: 50,000 coins"},
			effect() { return player.G.points.add(1).pow(0.1).sub(1) },
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {"color": "#880000"},
			unlocked() { return hasUpgrade("F", 81) },
		},
	},
});

addLayer("S", {
	name: "Stats",
	symbol: "S",
	row: "side",
	position: 0,
	startData() { return {
		unlocked: true,
	}},
	color: "#66DD66",
	type: "none",
	layerShown() {return true},
	tooltip() {return "Stats"},
	tabFormat: (() => {
		const statNames = ["This Era", "This Reincarnation", "All Time"];
		let tabs = {};
		for (let index = 0; index < statNames.length; index++) {
			const arr = [
				["display-text", () => "<h3>CURRENCY</h3><br>Your best coins is <b>" + format(player.stats[index].best) + "</b><br>You have <b>" + format(player.stats[index].total) + "</b> coins total<br>" + (index === 0 ? "You have <b>" + formatWhole(player.G.points) + "</b> gems<br>" : "") + (index === 1 ? "Your best gems is <b>" + formatWhole(player.G.best) + "</b><br>" : "") + (index === 2 ? "Your best gems is <b>" + formatWhole(player.bestGems) + "</b>" : "")],
				"blank",
				["display-text", () => "<h3>CLICKS</h3><br>Your best click production is <b>" + format(player.G.stats[index].bestClickValue) + "</b><br>You have <b>" + format(player.G.stats[index].bestTotalClickValue) + "</b> coins earned from clicking total<br>" + (index === 0 ? "You have clicked <b>" + formatWhole(player.G.clickTimes) + "</b> times<br>" : "Your best times clicked is <b>" + formatWhole(player.G.stats[index].bestClickTimes) + "</b><br>You have clicked <b>" + formatWhole(player.G.stats[index].totalClickTimes) + "</b> times total")],
				"blank",
				["display-text", () => "<h3>FACTION COINS</h3><br>" + (index === 0 ? "You have <b>" + formatWhole(player.totalFC) + "</b> faction coins<br>" : "") + "Your best faction coins is <b>" + formatWhole(player.stats[index].FCbest) + "</b><br>You have <b>" + formatWhole(player.stats[index].FCtotal) + "</b> faction coins total<br>You have <b>" + format(player.stats[index].FCchancebest) + "%</b> best faction coin chance"],
				"blank",
				["display-text", () => "<h3>CREATIONS</h3><br>Your best creations is <b>" + formatWhole(player.G.stats[index].bestCreations) + "</b>"],
				"blank",
				["display-text", () => "<h3>MANA</h3><br>Your best mana regen is <b>" + format(player.M.stats[index].manaRegenBest) + "</b><br>Your best max mana is <b>" + format(player.M.stats[index].maxManaBest) + "</b><br>You have generated a total of <b>" + format(player.M.stats[index].manaTotal) + "</b> mana"],
				"blank",
				["display-text", () => "<h3>SPELLS</h3><br>You have cast 'tax collection' <b>" + formatWhole(player.M.stats[index].taxCasts) + "</b> times<br>You have cast 'call to arms' <b>" + formatWhole(player.M.stats[index].callCasts) + "</b> times<br>You have cast 'holy light' <b>" + formatWhole(player.M.stats[index].holyCasts) + "</b> times<br>You have cast 'blood frenzy' <b>" + formatWhole(player.M.stats[index].frenzyCasts) + "</b> times<br>"],
				"blank",
			];
			if (index === 0) arr.push(["display-text", () => "<h3>OTHER</h3><br>You have spent <b>" + formatTime(player.G.resetTime) + "</b> in this era"]);
			else if (index === 1) arr.push(["display-text", () => "<h3>OTHER</h3><br>You have spent <b>" + formatTime(player.timePlayed) + "</b> in this reincarnation"]);
			else if (index === 2) arr.push(["display-text", () => "<h3>OTHER</h3><br>You have spent <b>" + formatTime(player.timePlayed) + "</b> playing total"]);
			tabs[statNames[index]] = {content: arr};
		};
		return tabs;
	})(),
});
