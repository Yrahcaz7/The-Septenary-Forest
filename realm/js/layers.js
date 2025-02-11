const mainTabStartingStats = {
	bestClickValue: newDecimalOne(),
	bestTotalClickValue: newDecimalZero(),
	bestClickTimes: newDecimalZero(),
	totalClickTimes: newDecimalZero(),
	bestCreations: newDecimalZero(),
};

const creationNames = [
	["Dirt", "Rich Dirt", "Richer Dirt", "Dry Soil", "Soil", "Fertile Soil", "Perfected Soil"],
	["Pebbles", "Rocks", "Boulders", "Stone Hills", "Stone Caves"],
	["Weeds", "Reeds", "Grass"],
];

const creationTierReq = [10, 25, 50, 100, 250, 500, 1000];

function getCreationName(id, lowercase = false) {
	let num = 0;
	while (hasUpgrade('1', (+id) + (num * 10) + 90)) {
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

function getCreationBulkCost(amount, mult = 1) {
	let total = newDecimalZero();
	for (let index = 0; index < getClickableState("1", 21); index++) {
		total = total.add(getCreationCost(amount.add(index), mult));
	};
	return total;
};

addLayer("1", {
	name: "Gems",
	symbol: "G",
	row: 0,
	position: 0,
	startData() { return {
		unlocked: true,
		points: newDecimalZero(),
		best: newDecimalZero(),
		clickValue: newDecimalOne(),
		clickTimes: newDecimalZero(),
		gemMult: newDecimalOne(),
		G: {
			bestClickValue: newDecimalOne(),
			bestTotalClickValue: newDecimalZero(),
			bestCreations: newDecimalZero(),
		},
		R: Object.create(mainTabStartingStats),
		T: Object.create(mainTabStartingStats),
	}},
	color: "#CCCCCC",
	requires: new Decimal(100000),
	resource: "gems",
	baseResource: "total coins this game",
	baseAmount() {return player.total},
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
	effect() {return player[1].points.mul(player[1].gemMult).mul(0.01).add(1)},
	effectDescription() {return "which are increasing all production by " + player[1].gemMult + "% each, for a total of " + format(tmp[1].effect) + 'x'},
	hotkeys: [
		{key: "a", description: "A: Abdicate for gems", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() {return true},
	tooltip() {return "Gems"},
	doReset(resettingLayer) {
		player.best = newDecimalZero();
		player.total = newDecimalZero();
		player.fairyCoins = newDecimalZero();
		player.elfCoins = newDecimalZero();
		player.angelCoins = newDecimalZero();
		player.goblinCoins = newDecimalZero();
		player.undeadCoins = newDecimalZero();
		player.demonCoins = newDecimalZero();
		player.FCchance = new Decimal(2.5);
		player.FC = newDecimalZero();
		player.G = Object.create(playerStartingStats);
		if (resettingLayer == '1') {
			layerDataReset('1', ["points", "best", "R", "T"], true);
			layerDataReset('2', ["R", "T"], true);
			layerDataReset('3');
		};
	},
	update(diff) {
		const pointGain = getPointGen().mul(diff);
		// clicks
		let clickGain = newDecimalOne();
		if (getBuyableAmount('1', 11).gt(0)) clickGain = clickGain.add(getBuyableAmount('1', 11).mul(buyableEffect('1', 11)));
		if (getBuyableAmount('1', 13).gt(0) && hasUpgrade('3', 1143)) clickGain = clickGain.add(getBuyableAmount('1', 13) * buyableEffect('1', 13));
		if (hasUpgrade('3', 1033)) clickGain = clickGain.mul(upgradeEffect('3', 1033));
		if (hasUpgrade('3', 1041)) clickGain = clickGain.mul(upgradeEffect('3', 1041));
		if (hasUpgrade('3', 1043)) clickGain = clickGain.mul(upgradeEffect('3', 1043));
		if (hasUpgrade('3', 1153)) clickGain = clickGain.mul(upgradeEffect('3', 1153));
		clickGain = clickGain.mul(tmp[1].effect);
		if (getClickableState('2', 12) == "ON") clickGain = clickGain.mul(clickableEffect('2', 12));
		if (hasUpgrade('3', 11) && getClickableState('2', 13) == "ON") clickGain = clickGain.mul(clickableEffect('2', 13));
		player[1].clickValue = clickGain;
		if (player[1].clickValue.gt(player[1].G.bestClickValue)) player[1].G.bestClickValue = player[1].clickValue;
		if (player[1].clickValue.gt(player[1].R.bestClickValue)) player[1].R.bestClickValue = player[1].clickValue;
		if (player[1].clickValue.gt(player[1].T.bestClickValue)) player[1].T.bestClickValue = player[1].clickValue;
		// coins
		if (player.points.gt(player.G.best)) player.G.best = player.points;
		if (player.points.gt(player.R.best)) player.R.best = player.points;
		if (player.points.gt(player.T.best)) player.T.best = player.points;
		player.G.total = new Decimal(player.G.total.add(pointGain));
		player.R.total = new Decimal(player.R.total.add(pointGain));
		player.T.total = new Decimal(player.T.total.add(pointGain));
		// faction coins
		let FCchance = new Decimal(2.5);
		if (getBuyableAmount('1', 13).gt(0)) FCchance = FCchance.add(getBuyableAmount('1', 13).mul(buyableEffect('1', 13).div(10)));
		if (hasUpgrade('3', 1033)) FCchance = FCchance.add(upgradeEffect('3', 1033).mul(3));
		if (hasUpgrade('3', 1042)) FCchance = FCchance.add(upgradeEffect('3', 1042));
		if (hasUpgrade('3', 1061)) FCchance = FCchance.add(upgradeEffect('3', 1061));
		if (hasUpgrade('3', 1063)) FCchance = FCchance.add(upgradeEffect('3', 1063));
		if (hasUpgrade('1', 2011) && !hasUpgrade('1', 2012)) FCchance = FCchance.add(upgradeEffect('1', 2011));
		if (hasUpgrade('1', 2011) && hasUpgrade('1', 2012)) FCchance = FCchance.add(upgradeEffect('1', 2011).mul(upgradeEffect('1', 2012)));
		player.FCchance = new Decimal(FCchance);
		if (player.FCchance.gt(player.G.FCchancebest)) player.G.FCchancebest = player.FCchance;
		if (player.FCchance.gt(player.R.FCchancebest)) player.R.FCchancebest = player.FCchance;
		if (player.FCchance.gt(player.T.FCchancebest)) player.T.FCchancebest = player.FCchance;
		player.FC = player.fairyCoins.add(player.elfCoins).add(player.angelCoins).add(player.goblinCoins).add(player.undeadCoins).add(player.demonCoins);
		if (player.FC.gt(player.G.FCbest)) player.G.FCbest = player.FC;
		if (player.FC.gt(player.R.FCbest)) player.R.FCbest = player.FC;
		if (player.FC.gt(player.T.FCbest)) player.T.FCbest = player.FC;
		// creations
		player[1].G.bestCreations = getBuyableAmount('1', 11).add(getBuyableAmount('1', 12)).add(getBuyableAmount('1', 13));
		if (player[1].G.bestCreations.gt(player[1].R.bestCreations)) player[1].R.bestCreations = player[1].G.bestCreations;
		if (player[1].G.bestCreations.gt(player[1].T.bestCreations)) player[1].T.bestCreations = player[1].G.bestCreations;
		// gems
		if (player[1].best.gt(player.bestGems)) player.bestGems = player[1].best;
		// fix bulk buy
		if (getClickableState("1", 21) < 1 || typeof getClickableState("1", 21) != "number") {
			setClickableState("1", 21, 1);
		} else if (getClickableState("1", 21) > 100) {
			setClickableState("1", 21, 100);
		};
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		["display-text", () => "Your faction coin find chance is " + format(player.FCchance) + "%"],
		"blank",
		["row", [
			["display-text", () => "<div style='color: #FF00FF'>You have " + formatWhole(player.fairyCoins) + " fairy coins</div><div style='color: #00FF00'>You have " + formatWhole(player.elfCoins) + " elf coins</div><div style='color: #00FFFF'>You have " + formatWhole(player.angelCoins) + " angel coins</div>"],
			["blank", ["17px"]],
			["clickables", [1]],
			["blank", ["17px"]],
			["display-text", () => "<div style='color: #888800'>You have " + formatWhole(player.goblinCoins) + " goblin coins</div><div style='color: #8800FF'>You have " + formatWhole(player.undeadCoins) + " undead coins</div><div style='color: #880000'>You have " + formatWhole(player.demonCoins) + " demon coins</div>"],
		]],
		"blank",
		["display-text", "<h2>Creations</h2>"],
		"blank",
		["clickables", [2]],
		"blank",
		"buyables",
		"blank",
		["display-text", () => { if (getBuyableAmount('1', 11).gte(10) || getBuyableAmount('1', 12).gte(10) || getBuyableAmount('1', 13).gte(10)) return '<h2>Creation Tier Upgrades</h2>' }],
		"blank",
		["upgrades", [9, 10, 11, 12, 13, 14]],
		["display-text", () => { if (player[1].points.gte(1)) return "<h2>Gem Power Upgrades</h2>" }],
		"blank",
		["upgrades", [201]],
	],
	componentStyles: {
		"buyable"() { return {'width':'180px', 'height':'180px'} },
	},
	clickables: {
		11: {
			title: "Click Button",
			display() {return "\nyour clicks are worth " + format(player[1].clickValue) + " coins"},
			canClick() {return true},
			onClick() {
				// faction coin initialization
				let factionCoinGainType = getRandInt(0, 6);
				let factionCoinsFound = newDecimalZero();
				let clickPower = player[1].clickValue;
				// faction coins gained calculation
				if (player.FCchance.gte(new Decimal(100))) factionCoinsFound = player.FCchance.div(100);
				else if (player.FCchance.div(100).gte(Math.random())) factionCoinsFound = newDecimalOne();
				if (hasUpgrade('3', 1053) && factionCoinGainType == 2) factionCoinsFound = factionCoinsFound.mul(5);
				factionCoinsFound = factionCoinsFound.floor();
				// earning the faction coins
				if (factionCoinGainType == 0) player.fairyCoins = player.fairyCoins.add(factionCoinsFound);
				else if (factionCoinGainType == 1) player.elfCoins = player.elfCoins.add(factionCoinsFound);
				else if (factionCoinGainType == 2) player.angelCoins = player.angelCoins.add(factionCoinsFound);
				else if (factionCoinGainType == 3) player.goblinCoins = player.goblinCoins.add(factionCoinsFound);
				else if (factionCoinGainType == 4) player.undeadCoins = player.undeadCoins.add(factionCoinsFound);
				else if (factionCoinGainType == 5) player.demonCoins = player.demonCoins.add(factionCoinsFound);
				// faction coin totals
				player.G.FCtotal = player.G.FCtotal.add(factionCoinsFound);
				player.R.FCtotal = player.R.FCtotal.add(factionCoinsFound);
				player.T.FCtotal = player.T.FCtotal.add(factionCoinsFound);
				// times clicked
				player[1].clickTimes = player[1].clickTimes.add(1);
				// best times clicked
				if (player[1].clickTimes.gt(player[1].R.bestClickTimes)) player[1].R.bestClickTimes = player[1].clickTimes;
				if (player[1].clickTimes.gt(player[1].T.bestClickTimes)) player[1].T.bestClickTimes = player[1].clickTimes;
				// total times clicked
				player[1].R.totalClickTimes = player[1].R.totalClickTimes.add(1);
				player[1].T.totalClickTimes = player[1].T.totalClickTimes.add(1);
				// coins gained
				if (hasUpgrade('3', 11) && getClickableState('2', 13) == "ON") clickPower = clickPower.mul(clickableEffect('2', 13));
				player.points = player.points.add(clickPower);
				player.best = player.best.max(player.points);
				player.total = player.total.add(clickPower);
				// total coins gained
				player[1].G.bestTotalClickValue = player[1].G.bestTotalClickValue.add(clickPower);
				player.G.total = player.G.total.add(clickPower);
				player.R.total = player.R.total.add(clickPower);
				player.T.total = player.T.total.add(clickPower);
				// best total click value
				if (player[1].G.bestTotalClickValue.gt(player[1].R.bestTotalClickValue)) player[1].R.bestTotalClickValue = player[1].G.bestTotalClickValue;
				if (player[1].G.bestTotalClickValue.gt(player[1].T.bestTotalClickValue)) player[1].T.bestTotalClickValue = player[1].G.bestTotalClickValue;
			},
		},
		21: {
			title() {return "You are bulk buying " + formatWhole(getClickableState("1", 21)) + "x creations"},
			canClick() {return true},
			onClick() {
				if (getClickableState("1", 21) == 1) {
					setClickableState("1", 21, 10);
				} else if (getClickableState("1", 21) == 10) {
					setClickableState("1", 21, 100);
				} else {
					setClickableState("1", 21, 1);
				};
			},
			style: {"width": "350px", "min-height": "30px", "border-radius": "15px"},
		},
	},
	buyables: {
		11: {
			title() { return getCreationName(this.id - 10) },
			cost() { return getCreationBulkCost(getBuyableAmount("1", this.id)) },
			effect() {
				let eff = new Decimal(0.1);
				if (hasUpgrade('1', 91)) eff = eff.add(0.05);
				if (hasUpgrade('1', 101)) eff = eff.add(0.1);
				if (hasUpgrade('1', 111)) eff = eff.add(0.2);
				if (hasUpgrade('1', 121)) eff = eff.add(0.4);
				if (hasUpgrade('1', 131)) eff = eff.add(0.65);
				if (hasUpgrade('1', 141)) eff = eff.add(1);
				if (hasUpgrade('3', 1083)) eff = eff.add(upgradeEffect('3', 1083).mul(1));
				if (hasUpgrade('3', 1031)) eff = eff.mul(upgradeEffect('3', 1031));
				if (hasUpgrade('3', 1032)) eff = eff.mul(upgradeEffect('3', 1032));
				return eff;
			},
			display() {
				if (this.cost() == newDecimalOne()) return "\nCost: 1 coin\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +" + format(buyableEffect('1', this.id)) + " to click production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * buyableEffect('1', this.id));
				else return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +" + format(buyableEffect('1', this.id)) + " to click production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * buyableEffect('1', this.id));
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("1", this.id, getBuyableAmount("1", this.id).add(getClickableState("1", 21)));
			},
		},
		12: {
			title() { return getCreationName(this.id - 10) },
			cost() { return getCreationBulkCost(getBuyableAmount("1", this.id), 100) },
			effect() {
				let eff = new Decimal(0.25);
				if (hasUpgrade('1', 92)) eff = eff.add(0.5);
				if (hasUpgrade('1', 102)) eff = eff.add(1.25);
				if (hasUpgrade('1', 112)) eff = eff.add(2);
				if (hasUpgrade('1', 122)) eff = eff.add(3.5);
				if (hasUpgrade('3', 1083)) eff = eff.add(upgradeEffect('3', 1083).mul(2));
				if (hasUpgrade('3', 1031)) eff = eff.mul(upgradeEffect('3', 1031));
				if (hasUpgrade('3', 1032)) eff = eff.mul(upgradeEffect('3', 1032));
				return eff;
			},
			display() { return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +" + format(buyableEffect('1', this.id)) + " to passive production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * buyableEffect('1', this.id)) },
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("1", this.id, getBuyableAmount("1", this.id).add(getClickableState("1", 21)));
			},
		},
		13: {
			title() { return getCreationName(this.id - 10) },
			cost() { return getCreationBulkCost(getBuyableAmount("1", this.id), 10000) },
			effect() {
				let eff = new Decimal(2.5);
				if (hasUpgrade('1', 93)) eff = eff.add(0.5);
				if (hasUpgrade('1', 103)) eff = eff.add(2);
				if (hasUpgrade('3', 1083)) eff = eff.add(upgradeEffect('3', 1083).mul(4));
				if (hasUpgrade('3', 1031)) eff = eff.mul(upgradeEffect('3', 1031));
				if (hasUpgrade('3', 1032)) eff = eff.mul(upgradeEffect('3', 1032));
				return eff;
			},
			display() {
				if (hasUpgrade('3', 1143)) return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +" + format(buyableEffect('1', this.id)) + " to click production and\n+" + format(buyableEffect('1', this.id).div(10)) + "% to FC find chance\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * buyableEffect('1', this.id)) + "\nand +" + format((getBuyableAmount('1', this.id) * buyableEffect('1', this.id).div(10))) + "%";
				else return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +" + format(buyableEffect('1', this.id)) + " to passive production and\n+" + format(buyableEffect('1', this.id).div(10)) + "% to FC find chance\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * buyableEffect('1', this.id)) + "\nand +" + format((getBuyableAmount('1', this.id) * buyableEffect('1', this.id).div(10))) + "%";
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("1", this.id, getBuyableAmount("1", this.id).add(getClickableState("1", 21)));
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
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) },
		},
		92: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.5) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) },
		},
		93: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.5, 0.05) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) },
		},
		101: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.1) },
			cost: 1000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("1", this.id - 10) },
		},
		102: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 1.25) },
			cost: 25000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("1", this.id - 10) },
		},
		103: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 2, 0.2) },
			cost: 2500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("1", this.id - 10) },
		},
		111: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.2) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("1", this.id - 10) },
		},
		112: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 2) },
			cost: 100000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("1", this.id - 10) },
		},
		121: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.4) },
			cost: 25000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("1", this.id - 10) },
		},
		122: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 3.5) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("1", this.id - 10) },
		},
		131: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 0.65) },
			cost: 100000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("1", this.id - 10) },
		},
		141: {
			fullDisplay() { return getCreationTierUpgradeDesc(this.id, this.cost, 1) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getBuyableAmount("1", this.id % 10 + 10).gte(creationTierReq[Math.floor(this.id / 10) - 9]) && hasUpgrade("1", this.id - 10) },
		},
		// other upgrades
		2011: {
			fullDisplay() { return '<h3>Gem Influence</h3><br>increase faction coin find chance based on your gems<br><br>Effect: +' + format(upgradeEffect('1', this.id)) + '%<br><br>Req: 25 1st creations'},
			effect() { return player[1].points.add(1).pow(0.5).sub(1) },
			canAfford() { return getBuyableAmount('1', 11).gte(25) },
			unlocked() { return player[1].points.gte(1) },
		},
		2012: {
			fullDisplay() { return '<h3>Gem Displays</h3><br>increase the effect of <b>Gem Influence</b> based on your gems<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Req: 25 2nd creations'},
			effect() { return player[1].points.add(1).pow(0.2) },
			canAfford() { return getBuyableAmount('1', 12).gte(25) },
			unlocked() { return player[1].points.gte(1) },
		},
		2013: {
			fullDisplay() { return '<h3>Gem Displays</h3><br>increase max mana and mana regen based on your gems<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Req: 25 3rd creations'},
			effect() { return player[1].points.add(1).log10().add(1).pow(0.5) },
			canAfford() { return getBuyableAmount('1', 13).gte(25) },
			unlocked() { return player[1].points.gte(1) },
		},
	},
});

const castingStartingStats = {
	manaRegenBest: new Decimal(2.5),
	manaTotal: newDecimalZero(),
	maxManaBest: new Decimal(100),
	taxCasts: newDecimalZero(),
	callCasts: newDecimalZero(),
	holyCasts: newDecimalZero(),
	frenzyCasts: newDecimalZero(),
};

addLayer("2", {
	name: "Casting",
	symbol: "C",
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
		G: Object.create(castingStartingStats),
		R: Object.create(castingStartingStats),
		T: Object.create(castingStartingStats),
	}},
	color: "#AA55AA",
	type: "none",
	layerShown() {return true },
	tooltip() {return "Casting"},
	doReset(resettingLayer) {},
	update(diff) {
		let manaCapped = false;
		let prevMana = player[2].mana;
		let manaRegen = new Decimal(2.5);
		let maxMana = new Decimal(100);
		let taxEff = new Decimal(30);
		let callBoost = newDecimalOne();
		let sideSpellBoost = newDecimalOne();
		let taxCost = new Decimal(80);
		let callCost = new Decimal(160);
		let sideSpellCost = new Decimal(120);
		// spell boosts
		if (hasUpgrade('3', 1162)) taxEff = taxEff.add(30);
		if (hasUpgrade('3', 1152)) taxEff = taxEff.mul(2);
		if (hasUpgrade('3', 1152)) callBoost = callBoost.mul(2);
		if (hasUpgrade('3', 1152)) sideSpellBoost = sideSpellBoost.mul(2);
		if (hasUpgrade('3', 1082)) sideSpellBoost = sideSpellBoost.mul(upgradeEffect('3', 1082));
		// return spell boost effects
		player[2].taxEff = taxEff;
		player[2].callBoost = callBoost;
		player[2].sideSpellBoost = sideSpellBoost;
		// spell costs
		if (hasUpgrade('3', 1152)) taxCost = taxCost.mul(3);
		if (hasUpgrade('3', 1152)) callCost = callCost.mul(3);
		if (hasUpgrade('3', 1152)) sideSpellCost = sideSpellCost.mul(3);
		// return spell cost
		player[2].taxCost = taxCost;
		player[2].callCost = callCost;
		player[2].sideSpellCost = sideSpellCost;
		// mana regen buffs
		if (hasUpgrade('2', 22) && upgradeEffect('2', 22).gt(0)) manaRegen = manaRegen.add(upgradeEffect('2', 22));
		if (hasUpgrade('2', 24) && upgradeEffect('2', 24).gt(0)) manaRegen = manaRegen.add(upgradeEffect('2', 24));
		if (hasUpgrade('3', 1052)) manaRegen = manaRegen.mul(upgradeEffect('3', 1052));
		if (hasUpgrade('1', 2013)) manaRegen = manaRegen.mul(upgradeEffect('1', 2013));
		player[2].manaRegen = manaRegen;
		const diffMana = player[2].manaRegen.mul(diff);
		// max mana buffs
		if (hasUpgrade('3', 1051)) maxMana = maxMana.mul(upgradeEffect('3', 1051));
		if (hasUpgrade('3', 1151)) maxMana = maxMana.mul(upgradeEffect('3', 1151));
		if (hasUpgrade('2', 21)) maxMana = maxMana.mul(upgradeEffect('2', 21));
		if (hasUpgrade('2', 23)) maxMana = maxMana.mul(upgradeEffect('2', 23));
		if (hasUpgrade('1', 2013)) maxMana = maxMana.mul(upgradeEffect('1', 2013));
		player[2].maxMana = maxMana;
		// increase mana
		if (player[2].mana.add(diffMana).gte(player[2].maxMana))
			player[2].mana = player[2].maxMana,
			manaCapped = true;
		else player[2].mana = player[2].mana.add(diffMana);
		// total mana
		if (manaCapped) {
			player[2].G.manaTotal = player[2].G.manaTotal.add(player[2].maxMana.sub(prevMana));
			player[2].R.manaTotal = player[2].R.manaTotal.add(player[2].maxMana.sub(prevMana));
			player[2].T.manaTotal = player[2].T.manaTotal.add(player[2].maxMana.sub(prevMana));
		} else {
			player[2].G.manaTotal = player[2].G.manaTotal.add(diffMana);
			player[2].R.manaTotal = player[2].R.manaTotal.add(diffMana);
			player[2].T.manaTotal = player[2].T.manaTotal.add(diffMana);
		};
		// best mana
		if (player[2].maxMana.gt(player[2].G.maxManaBest)) player[2].G.maxManaBest = player[2].maxMana;
		if (player[2].maxMana.gt(player[2].R.maxManaBest)) player[2].R.maxManaBest = player[2].maxMana;
		if (player[2].maxMana.gt(player[2].T.maxManaBest)) player[2].T.maxManaBest = player[2].maxMana;
		if (player[2].manaRegen.gt(player[2].G.manaRegenBest)) player[2].G.manaRegenBest = player[2].manaRegen;
		if (player[2].manaRegen.gt(player[2].R.manaRegenBest)) player[2].R.manaRegenBest = player[2].manaRegen;
		if (player[2].manaRegen.gt(player[2].T.manaRegenBest)) player[2].T.manaRegenBest = player[2].manaRegen;
		// spell time
		if (getClickableState('2', 12) == "ON") player[2].callTime = player[2].callTime.sub(diff);
		if (getClickableState('2', 13) == "ON") player[2].sideSpellTime = player[2].sideSpellTime.sub(diff);
		// spell done time
		if (player[2].callTime.lte(0)) setClickableState('2', 12) == "OFF", player[2].callTime = newDecimalZero();
		if (player[2].sideSpellTime.lte(0)) setClickableState('2', 13) == "OFF", player[2].sideSpellTime = newDecimalZero();
		// autocasting
		if (getClickableState('2', 101) == "secondary - ON" && player[2].callTime.gt(0) && player[2].sideSpellTime.gt(0) && player[2].mana.gte(player[2].taxCost)) {
			taxCast();
		};
		if (getClickableState('2', 102) == "primary - ON" && player[2].callTime.lte(0) && player[2].mana.gte(player[2].callCost)) {
			callCast();
		};
		if (getClickableState('2', 103) == "primary - ON" && player[2].sideSpellTime.lte(0) && player[2].mana.gte(player[2].sideSpellCost)) {
			sideSpellCast();
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
		["display-text", () => "<h2>Mana Upgrades</h2><br>You have " + format(player[2].G.manaTotal) + " mana generated"],
		"blank",
		["upgrades", [2]],
		["display-text", () => "<h2>Autocasting Upgrades</h2><br>You have " + format(player[2].R.manaTotal) + " total mana generated"],
		"blank",
		["upgrades", [10]],
	],
	clickables: {
		11: {
			title: "<span style='color: #000000'>Tax Collection</span>",
			display() { return '<span style="color: #000000">get coins equal to ' + formatWhole(player[2].taxEff) + ' seconds of passive production<br><br>Effect: +' + format(getPointGen().mul(player[2].taxEff)) + '<br><br>Cost: ' + formatWhole(player[2].taxCost) + ' mana</span>' },
			canClick() { if (player[2].mana.gte(player[2].taxCost)) return true },
			onClick() { taxCast() },
		},
		12: {
			title: "<span style='color: #000000'>Call to Arms</span>",
			display() { return '<span style="color: #000000">boost all production based on your creations for 30 seconds<br>Time left: ' + format(player[2].callTime) + 's<br><br>Effect: x' + format(clickableEffect('2', this.id)) + '<br><br>Cost: ' + formatWhole(player[2].callCost) + ' mana' },
			effect() { return player[1].G.bestCreations.add(1).pow(0.15).mul(player[2].callBoost)},
			canClick() {
				if (getClickableState('2', this.id) == "ON") return false;
				if (player[2].mana.gte(player[2].callCost)) return true;
				return false;
			},
			onClick() { callCast() },
		},
		13: {
			title() {
				if (hasUpgrade('3', 11)) return "<span style='color: #0000FF'>Holy Light</span>";
				if (hasUpgrade('3', 21)) return "<span style='color: #FF0000'>Blood Frenzy</span>";
				return "CHOOSE A SIDE TO UNLOCK";
			},
			display() {
				if (hasUpgrade('3', 11)) return '<span style="color: #0000FF">boost click production based on your mana for 15 seconds<br>Time left: ' + format(player[2].sideSpellTime) + 's<br><br>Effect: x' + format(clickableEffect('2', this.id)) + '<br><br>Cost: ' + formatWhole(player[2].sideSpellCost) + ' mana';
				if (hasUpgrade('3', 21)) return '<span style="color: #FF0000">boost passive production based on your mana for 15 seconds<br>Time left: ' + format(player[2].sideSpellTime) + 's<br><br>Effect: x' + format(clickableEffect('2', this.id)) + '<br><br>Cost: ' + formatWhole(player[2].sideSpellCost) + ' mana';
				return "";
			},
			effect() { return player[2].mana.add(1).pow(0.25).mul(player[2].sideSpellBoost) },
			canClick() {
				if (getClickableState('2', this.id) == "ON") return false;
				if (player[2].mana.gte(player[2].sideSpellCost) && hasChosenSide()) return true;
				return false;
			},
			onClick() { sideSpellCast() },
		},
		101: {
			title: "Autocasting",
			display() {
				if (hasUpgrade("2", 102)) return getClickableState(this.layer, this.id) || "OFF";
				return "LOCKED - need better autocasting";
			},
			canClick() { return hasUpgrade("2", 102) },
			onClick() {
				if (getClickableState(this.layer, this.id) == "secondary - ON") setClickableState(this.layer, this.id, "OFF");
				else setClickableState(this.layer, this.id, "secondary - ON");
			},
			style: {'min-height': '50px', 'border-radius': '25px'},
			unlocked() { return hasUpgrade("2", 101) },
		},
		102: {
			title: "Autocasting",
			display() { return getClickableState(this.layer, this.id) || "OFF" },
			canClick() { return true },
			onClick() {
				if (getClickableState(this.layer, this.id) == "primary - ON") setClickableState(this.layer, this.id, "OFF");
				else setClickableState(this.layer, this.id, "primary - ON");
			},
			style: {'min-height': '50px', 'border-radius': '25px'},
			unlocked() { return hasUpgrade("2", 101) },
		},
		103: {
			title() {
				if (hasChosenSide()) return "Autocasting";
				return "CHOOSE A SIDE TO UNLOCK";
			},
			display() { if (hasChosenSide()) return getClickableState(this.layer, this.id) || "OFF" },
			canClick() { return hasChosenSide() },
			onClick() {
				if (getClickableState(this.layer, this.id) == "primary - ON") setClickableState(this.layer, this.id, "OFF");
				else setClickableState(this.layer, this.id, "primary - ON");
			},
			style: {'min-height': '50px', 'border-radius': '25px'},
			unlocked() { return hasUpgrade("2", 101) },
		},
	},
	bars: {
		manabar: {
			direction: RIGHT,
			width: 500,
			height: 50,
			display() { return "You have " + format(player[2].mana) + "/" + format(player[2].maxMana) + " mana<br>(" + format(player[2].manaRegen) + "/s)" },
			fillStyle() { return {"background-color": "#AA55AA" } },
			borderStyle() { return {"border-color": "#AA55AA"} },
			progress() { return player[2].mana.div(player[2].maxMana) },
		},
	},
	upgrades: {
		11: {
			canAfford() { return player[2].mana.gte(player[2].maxMana) },
		},
		21: {
			fullDisplay() { return '<h3>Mana Cup</h3><br>increase max mana based on your mana<br><br>Effect: x' + format(upgradeEffect('2', this.id)) + '<br><br>Req: 500 mana generated<br><br>Cost: 1,500 coins'},
			effect() { return player[2].mana.add(1).pow(0.1) },
			cost: 1500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			canAfford() { return player[2].G.manaTotal.gte(500) },
		},
		22: {
			fullDisplay() { return '<h3>Mana Sense</h3><br>increase mana regen based on your mana<br><br>Effect: +' + format(upgradeEffect('2', this.id)) + '<br><br>Req: 1,500 mana generated<br><br>Cost: 5,000 coins'},
			effect() { return player[2].mana.add(1).pow(0.2) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			canAfford() { return player[2].G.manaTotal.gte(1500) },
			unlocked() { return hasUpgrade("2", 21) },
		},
		23: {
			fullDisplay() { return '<h3>Mana Jar</h3><br>increase max mana based on your creations<br><br>Effect: x' + format(upgradeEffect('2', this.id)) + '<br><br>Req: 4,500 mana generated<br><br>Cost: 25,000 coins'},
			effect() { return player[1].G.bestCreations.add(1).pow(0.125) },
			cost: 25000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			canAfford() { return player[2].G.manaTotal.gte(4500) },
			unlocked() { return hasUpgrade("2", 22) },
		},
		24: {
			fullDisplay() { return '<h3>Mana Sight</h3><br>increase mana regen based on your creations<br><br>Effect: +' + format(upgradeEffect('2', this.id)) + '<br><br>Req: 15,000 mana generated<br><br>Cost: 125,000 coins'},
			effect() { return player[1].G.bestCreations.add(1).pow(0.225) },
			cost: 125000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			canAfford() { return player[2].G.manaTotal.gte(15000) },
			unlocked() { return hasUpgrade("2", 23) },
		},
		101: {
			fullDisplay() { return '<h3>Primary Autocasting</h3><br>unlock autocasting<br><br>Req: 10,000 total mana generated<br><br>Cost: 333 mana'},
			canAfford() { return player[2].mana.gte(333) && player[2].R.manaTotal.gte(10000) },
			pay() { player[2].mana = player[2].mana.sub(333) },
		},
		102: {
			fullDisplay() { return '<h3>Secondary Autocasting</h3><br>unlock tax collection autocasting<br><br>Req: 100,000 total mana generated<br><br>Cost: 3,333 mana'},
			canAfford() { return player[2].mana.gte(3333) && player[2].R.manaTotal.gte(100000) },
			pay() { player[2].mana = player[2].mana.sub(3333) },
			unlocked() { return hasUpgrade("2", 101) },
		},
	},
});

function hasChosenSide() {
	return hasUpgrade('3', 11) || hasUpgrade('3', 21);
};

function hasChosenFaction() {
	return hasUpgrade('3', 31) || hasUpgrade('3', 41) || hasUpgrade('3', 51) || hasUpgrade('3', 61) || hasUpgrade('3', 71) || hasUpgrade('3', 81);
};

addLayer("3", {
	name: "Factions",
	symbol: "F",
	row: 0,
	position: 2,
	startData() { return {
		unlocked: true,
	}},
	color() {
		if (hasUpgrade('3', 11)) return "#0000CC";
		if (hasUpgrade('3', 21)) return "#CC0000";
		return "#CCCCCC";
	},
	type: "none",
	layerShown() {return true },
	tooltip() {return "Factions"},
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
			canAfford() { return player.fairyCoins.gte(5) && !hasChosenFaction() },
			pay() { player.fairyCoins = player.fairyCoins.sub(5) },
			style: {'color': '#FF00FF'},
			unlocked() { return hasUpgrade('3', 11) },
		},
		41: {
			fullDisplay() { return '<h3>Elven Alliance</h3><br>ally yourself with the elves, which focus on click production<br><br>Cost: 5 elf coins'},
			canAfford() { return player.elfCoins.gte(5) && !hasChosenFaction() },
			pay() { player.elfCoins = player.elfCoins.sub(5) },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade('3', 11) },
		},
		51: {
			fullDisplay() { return '<h3>Angel Alliance</h3><br>ally yourself with the angels, which focus on mana and spells<br><br>Cost: 5 angel coins'},
			canAfford() { return player.angelCoins.gte(5) && !hasChosenFaction() },
			pay() { player.angelCoins = player.angelCoins.sub(5) },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade('3', 11) },
		},
		61: {
			fullDisplay() { return '<h3>Goblin Alliance</h3><br>ally yourself with the goblins, which focus on faction coins<br><br>Cost: 5 goblin coins'},
			canAfford() { return player.goblinCoins.gte(5) && !hasChosenFaction() },
			pay() { player.goblinCoins = player.goblinCoins.sub(5) },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade('3', 21) },
		},
		71: {
			fullDisplay() { return '<h3>Undead Alliance</h3><br>ally yourself with the undead, which focus purely on passive production<br><br>Cost: 5 undead coins'},
			canAfford() { return player.undeadCoins.gte(5) && !hasChosenFaction() },
			pay() { player.undeadCoins = player.undeadCoins.sub(5) },
			style: {'color': '#8800FF'},
			unlocked() { return hasUpgrade('3', 21) },
		},
		81: {
			fullDisplay() { return '<h3>Demon Alliance</h3><br>ally yourself with the demons, which focus on non-basic creations<br><br>Cost: 5 demon coins'},
			canAfford() { return player.demonCoins.gte(5) && !hasChosenFaction() },
			pay() { player.demonCoins = player.demonCoins.sub(5) },
			style: {'color': '#880000'},
			unlocked() { return hasUpgrade('3', 21) },
		},
		// faction upgrades
		// fairy faction
		1031: {
			fullDisplay() { return '<h3>Magic Dust</h3><br>increase the effect of basic creations based on your mana regen<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 500 coins'},
			effect() { return player[2].manaRegen.add(1).mul(2).pow(0.5) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#FF00FF'},
			unlocked() { return hasUpgrade('3', 31) },
		},
		1032: {
			fullDisplay() { return '<h3>Fairy Workers</h3><br>increase the effect of basic creations based on your creations<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 5,000 coins'},
			effect() { return player[1].G.bestCreations.add(1).pow(0.2) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#FF00FF'},
			unlocked() { return hasUpgrade('3', 31) },
		},
		1033: {
			fullDisplay() { return '<h3>Fairy Traders</h3><br>increase click production and faction coin find chance based on your creations<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br>and +' + format(upgradeEffect('3', this.id).mul(3)) + '%<br><br>Cost: 50,000 coins'},
			effect() { return player[1].G.bestCreations.add(1).pow(0.1) },
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#FF00FF', 'height':'120px'},
			unlocked() { return hasUpgrade('3', 31) },
		},
		// elf faction
		1041: {
			fullDisplay() { return '<h3>Super Clicks</h3><br>increase click production based on your creations<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 500 coins'},
			effect() { return player[1].G.bestCreations.add(1).pow(0.25) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade('3', 41) },
		},
		1042: {
			fullDisplay() { return '<h3>Elven Luck</h3><br>increase faction coin find chance based on your click production<br><br>Effect: +' + format(upgradeEffect('3', this.id)) + '%<br><br>Cost: 5,000 coins'},
			effect() { return player[1].clickValue.add(1).pow(0.3) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade('3', 41) },
		},
		1043: {
			fullDisplay() { return '<h3>Elven Spirit</h3><br>increase click production based on your elf coins<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 50,000 coins'},
			effect() { return player.elfCoins.add(1).pow(0.5) },
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade('3', 41) },
		},
		1044: {
			fullDisplay() { return '<h3>Elven Trade Route</h3><br>unlock 3 more elf upgrades<br><br>Cost: 25 elf coins'},
			canAfford() {
				if (player.elfCoins.gte(25)) return true;
				else return false;
			},
			pay() {
				player.elfCoins = player.elfCoins.sub(25);
			},
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade('3', 41) },
		},
		1141: {
			fullDisplay() { return '<h3>Elven Clicks</h3><br>increase click production based on your coins<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 500,000 coins'},
			effect() { return player.points.add(1).pow(0.01) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade('3', 1044) },
		},
		1142: {
			fullDisplay() { return '<h3>Enchanted Clicks</h3><br>increase click production based on your mana regen<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 5,000,000 coins'},
			effect() { return player[2].manaRegen.add(1).pow(0.5) },
			cost: 5000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade('3', 1044) },
		},
		1143: {
			fullDisplay() { return '<h3>All on One</h3><br>the 3rd creation\'s first effect now applies to click production instead of passive production<br><br>Cost: 50,000,000 coins'},
			cost: 50000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FF00'},
			unlocked() { return hasUpgrade('3', 1044) },
		},
		// angel faction
		1051: {
			fullDisplay() { return '<h3>Angelic Capacity</h3><br>increase max mana based on your mana generated<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 500 coins'},
			effect() { return player[2].G.manaTotal.add(1).pow(0.075) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade('3', 51) },
		},
		1052: {
			fullDisplay() { return '<h3>Road to Heaven</h3><br>increase mana regen based on your angel coins<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 5,000 coins'},
			effect() { return player.angelCoins.add(1).pow(0.5) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade('3', 51) },
		},
		1053: {
			fullDisplay() { return '<h3>Angels Supreme</h3><br>gain 5x angel coins<br><br>Cost: 50,000 coins'},
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade('3', 51) },
		},
		1054: {
			fullDisplay() { return '<h3>Angel Trade Route</h3><br>unlock 3 more angel upgrades<br><br>Cost: 25 angel coins'},
			canAfford() {
				if (player.angelCoins.gte(25)) return true;
				else return false;
			},
			pay() {
				player.angelCoins = player.angelCoins.sub(25);
			},
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade('3', 51) },
		},
		1151: {
			fullDisplay() { return '<h3>Rainbows</h3><br>increase max mana based on your faction coins<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 500,000 coins'},
			effect() { return player.FC.add(1).pow(0.2) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade('3', 1054) },
		},
		1152: {
			fullDisplay() { return '<h3>Prism Upgrade</h3><br>double spell effects, but triple their mana cost<br><br>Cost: 5,000,000 coins'},
			cost: 5000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade('3', 1054) },
		},
		1153: {
			fullDisplay() { return '<h3>Angelic Clicks</h3><br>increase click production based on your max mana<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 50,000,000 coins'},
			effect() { return player[2].maxMana.add(1).pow(0.05) },
			cost: 50000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#00FFFF'},
			unlocked() { return hasUpgrade('3', 1054) },
		},
		// goblin faction
		1061: {
			fullDisplay() { return '<h3>Jackpot</h3><br>increase faction coin find chance based on your coins<br><br>Effect: +' + format(upgradeEffect('3', this.id)) + '%<br><br>Cost: 500 coins'},
			effect() { return player.points.add(1).pow(0.2) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade('3', 61) },
		},
		1062: {
			fullDisplay() { return '<h3>Goblin\'s Greed</h3><br>increase passive production based on your faction coins<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 5,000 coins'},
			effect() { return player.FC.add(1).pow(0.25) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade('3', 61) },
		},
		1063: {
			fullDisplay() { return '<h3>Currency Revolution</h3><br>increase faction coin find chance based on your faction coins<br><br>Effect: +' + format(upgradeEffect('3', this.id)) + '%<br><br>Cost: 50,000 coins'},
			effect() { return player.FC.add(1).pow(0.6) },
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade('3', 61) },
		},
		1064: {
			fullDisplay() { return '<h3>Goblin Trade Route</h3><br>unlock 3 more goblin upgrades<br><br>Cost: 25 goblin coins'},
			canAfford() {
				if (player.goblinCoins.gte(25)) return true;
				else return false;
			},
			pay() {
				player.goblinCoins = player.goblinCoins.sub(25);
			},
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade('3', 61) },
		},
		1161: {
			fullDisplay() { return '<h3>Moneyload</h3><br>increase passive production based on your faction coin find chance<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 500,000 coins'},
			effect() { return player.FCchance.add(1).pow(0.3) },
			cost: 500000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade('3', 1064) },
		},
		1162: {
			fullDisplay() { return '<h3>Absurd Taxes</h3><br>increase the base effect of Tax Collection by +30 seconds<br><br>Cost: 5,000,000 coins'},
			cost: 5000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade('3', 1064) },
		},
		1163: {
			fullDisplay() { return '<h3>Goblin Pride</h3><br>increase passive production based on your goblin coins<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 50,000,000 coins'},
			effect() { return player.goblinCoins.add(1).pow(0.3) },
			cost: 50000000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#888800'},
			unlocked() { return hasUpgrade('3', 1064) },
		},
		// undead faction
		1071: {
			fullDisplay() { return '<h3>Undending Cycle</h3><br>increase passive production based on your coins<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 500 coins'},
			effect() { return player.points.add(1).pow(0.15) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#8800FF'},
			unlocked() { return hasUpgrade('3', 71) },
		},
		1072: {
			fullDisplay() { return '<h3>Corpse Piles</h3><br>increase passive production based on your undead coins<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 5,000 coins'},
			effect() { return player.undeadCoins.add(1).pow(0.5) },
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#8800FF'},
			unlocked() { return hasUpgrade('3', 71) },
		},
		1073: {
			fullDisplay() { return '<h3>Stay no More</h3><br>increase passive production based on your click production<br><br>Effect: x' + format(upgradeEffect('3', this.id)) + '<br><br>Cost: 50,000 coins'},
			effect() { return player[1].clickValue.add(1).pow(0.2) },
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {'color': '#8800FF'},
			unlocked() { return hasUpgrade('3', 71) },
		},
		// demon faction
		1081: {
			fullDisplay() { return "<h3>Demonic Prestige</h3><br>increase passive production based on your creation tiers<br><br>Effect: x" + format(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: 500 coins"},
			effect() { return player[1].upgrades.length / 5 + 1 },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {"color": "#880000"},
			unlocked() { return hasUpgrade("3", 81) },
		},
		1082: {
			fullDisplay() { return "<h3>Demonic Blood</h3><br>increase blood frenzy effect based on your creations (higher numbered ones count more)<br><br>Effect: x" + format(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: 5,000 coins"},
			effect() {
				let amt = getBuyableAmount('1', 11);
				amt = amt.add(getBuyableAmount('1', 12).mul(5));
				amt = amt.add(getBuyableAmount('1', 13).mul(25));
				return amt.div(10).add(1).pow(0.1);
			},
			cost: 5000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {"color": "#880000"},
			unlocked() { return hasUpgrade("3", 81) },
		},
		1083: {
			fullDisplay() { return "<h3>Polished Rage</h3><br>increase all creation's first base effects based on their number and your gems<br><br>Effect: +(" + format(upgradeEffect(this.layer, this.id)) + " * 2^num)<br><br>Cost: 50,000 coins"},
			effect() { return player[1].points.add(1).pow(0.1).sub(1) },
			cost: 50000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			style: {"color": "#880000"},
			unlocked() { return hasUpgrade("3", 81) },
		},
	},
});

const statNames = {G: "This Game", R: "This Reincarnation", T: "All Time"};

const statTabs = {};

["G", "R", "T"].forEach(key => {
	let arr = [
		["display-text", () => "<h3>CURRENCY</h3><br>Your best coins is <b>" + format(player[key].best) + "</b><br>You have <b>" + format(player[key].total) + "</b> coins total<br>" + (key == "G" ? "You have <b>" + formatWhole(player[1].points) + "</b> gems<br>" : "") + (key == "R" ? "Your best gems is <b>" + formatWhole(player[1].best) + "</b><br>" : "") + (key == "T" ? "Your best gems is <b>" + formatWhole(player.bestGems) + "</b>" : "")],
		"blank",
		["display-text", () => "<h3>CLICKS</h3><br>Your best click production is <b>" + format(player[1][key].bestClickValue) + "</b><br>You have <b>" + format(player[1][key].bestTotalClickValue) + "</b> coins earned from clicking total<br>" + (key == "G" ? "You have clicked <b>" + formatWhole(player[1].clickTimes) + "</b> times<br>" : "Your best times clicked is <b>" + formatWhole(player[1][key].bestClickTimes) + "</b><br>You have clicked <b>" + formatWhole(player[1][key].totalClickTimes) + "</b> times total")],
		"blank",
		["display-text", () => "<h3>FACTION COINS</h3><br>" + (key == "G" ? "You have <b>" + formatWhole(player.FC) + "</b> faction coins<br>" : "") + "Your best faction coins is <b>" + formatWhole(player[key].FCbest) + "</b><br>You have <b>" + formatWhole(player[key].FCtotal) + "</b> faction coins total<br>You have <b>" + format(player[key].FCchancebest) + "%</b> best faction coin chance"],
		"blank",
		["display-text", () => "<h3>CREATIONS</h3><br>Your best creations is <b>" + formatWhole(player[1][key].bestCreations) + "</b>"],
		"blank",
		["display-text", () => "<h3>MANA</h3><br>Your best mana regen is <b>" + format(player[2][key].manaRegenBest) + "</b><br>Your best max mana is <b>" + format(player[2][key].maxManaBest) + "</b><br>You have generated a total of <b>" + format(player[2][key].manaTotal) + "</b> mana"],
		"blank",
		["display-text", () => "<h3>SPELLS</h3><br>You have cast 'tax collection' <b>" + formatWhole(player[2][key].taxCasts) + "</b> times<br>You have cast 'call to arms' <b>" + formatWhole(player[2][key].callCasts) + "</b> times<br>You have cast 'holy light' <b>" + formatWhole(player[2][key].holyCasts) + "</b> times<br>You have cast 'blood frenzy' <b>" + formatWhole(player[2][key].frenzyCasts) + "</b> times<br>"],
		"blank",
	];
	if (key == "G") arr.push(["display-text", () => "<h3>OTHER</h3><br>You have spent <b>" + formatTime(player[1].resetTime) + "</b> in this game"]);
	else if (key == "R") arr.push(["display-text", () => "<h3>OTHER</h3><br>You have spent <b>" + formatTime(player.timePlayed) + "</b> in this reincarnation"]);
	else if (key == "T") arr.push(["display-text", () => "<h3>OTHER</h3><br>You have spent <b>" + formatTime(player.timePlayed) + "</b> playing total"]);
	statTabs[key] = arr;
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
	tabFormat: {
		"This Game": {
			content: statTabs["G"],
		},
		"This Reincarnation": {
			content: statTabs["R"],
		},
		"All Time": {
			content: statTabs["T"],
		},
	},
});
