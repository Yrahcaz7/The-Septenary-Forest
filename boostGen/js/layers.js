const generatorCostScale = {
	101() {
		if (hasUpgrade("g", 24)) return 3;
		if (hasUpgrade("g", 23)) return 4;
		return 5;
	},
	201() {
		if (hasUpgrade("g", 25)) return 15;
		if (hasUpgrade("g", 22)) return 50;
		return 100;
	},
	202() {
		if (hasUpgrade("g", 14)) return 30;
		return 500;
	},
	301() {
		if (hasUpgrade("g", 31)) return 64;
		return 1000;
	},
	302() {return 5000},
	303() {return 50},
	401() {
		if (hasUpgrade("g", 42)) return 25;
		return 100000;
	},
	402() {
		if (hasUpgrade("g", 43)) return 50;
		if (hasUpgrade("g", 41)) return 10000;
		return 1e15;
	},
	403() {
		if (hasUpgrade("g", 43)) return 20;
		return 20000;
	},
	404() {
		if (hasUpgrade("g", 42)) return 100;
		return 1000000;
	},
};

const generatorExtraCost = {
	301() {return 5e13},
	302() {return 1e14},
	303() {
		if (hasUpgrade("g", 32)) return 1000000;
		return 1e17;
	},
	401() {return 1e80},
	402() {return 1e75},
	403() {return 1e84},
	404() {return 1e90},
};

const generatorName = {
	101: "Basic Generator",
	201: "Generator Generator 1",
	202: "Generator Generator 2",
	301: "Left Generator",
	302: "Center Generator",
	303: "Right Generator",
	401: "Beginning Generator",
	402: "Backward Generator",
	403: "Forward Generator",
	404: "Ending Generator",
};

function generatorCost(id) {
	let bought = player.g.grid[id].bought;
	let scale = generatorCostScale[id]();
	let extra = generatorExtraCost[id];
	if (typeof extra == "function" && !hasUpgrade("g", 44)) {
		return new Decimal(scale).pow(bought ** 1.25 + 1).mul(extra());
	};
	return new Decimal(scale).pow(bought ** 1.25 + 1);
};

function getBoughtGenerators() {
	let bought = 0;
	for (let id in player.g.grid) {
		if (typeof player.g.grid[id] == "object") {
			bought += player.g.grid[id].bought;
		};
	};
	return bought;
};

function getBoughtSuperGenerators() {
	let bought = new Decimal(0);
	for (let id in player.sg.buyables) {
		if (player.sg.buyables[id] instanceof Decimal) {
			bought = bought.add(player.sg.buyables[id]);
		};
	};
	return bought;
};

addLayer("g", {
	name: "Generators",
	symbol: "G",
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		passive: new Decimal(0),
		autoBasic: false,
		auto1and2: false,
		autoLCR: false,
		autoBBFE: false,
	}},
	color: "#A3D9A5",
	resource: "generator power",
	row: 0,
	effect() {return player.g.points.add(1).pow(0.75)},
	effectDescription() {return "which is multiplying point gain by " + format(tmp.g.effect) + "x"},
	tabFormat: [
		"main-display",
		["display-text", () => "You are gaining " + format(player.g.passive) + " generator power per second<br><br>Note: most forms of passive production cap out at 100 seconds worth of production"],
		"blank",
		"grid",
		"blank",
		"upgrades",
	],
	layerShown() {return true},
	doReset(resettingLayer) {
		let keep = ["autoBasic", "auto1and2", "autoLCR", "autoBBFE"];
		if (hasMilestone("b", 3)) keep.push("upgrades");
		if (layers[resettingLayer].row > this.row) layerDataReset("g", keep);
	},
	update(diff) {
		let gain = gridEffect("g", 101);
		if (hasUpgrade("g", 21)) gain = gain.mul(upgradeEffect("g", 21));
		if (hasUpgrade("g", 33)) gain = gain.mul(upgradeEffect("g", 33));
		if (hasUpgrade("g", 34)) gain = gain.mul(upgradeEffect("g", 34));
		if (hasUpgrade("g", 35)) gain = gain.mul(upgradeEffect("g", 35));
		if (hasUpgrade("g", 45)) gain = gain.mul(upgradeEffect("g", 45));
		if (hasUpgrade("b", 14)) gain = gain.mul(upgradeEffect("b", 14));
		if (hasUpgrade("b", 23)) gain = gain.mul(upgradeEffect("b", 23));
		if (hasUpgrade("b", 34)) gain = gain.mul(upgradeEffect("b", 34));
		if (hasUpgrade("sg", 24)) gain = gain.mul(upgradeEffect("sg", 24));
		if (hasUpgrade("sg", 31)) gain = gain.mul(upgradeEffect("sg", 31));
		if (player.sg.unlocked) gain = gain.mul(tmp.sg.effect);
		player.g.passive = gain;
		if (productionCap && (player.g.points.add(gain.mul(diff)).gte(gain.mul(productionCap))) || hasMilestone("sb", 4)) {
			player.g.points = gain.mul(productionCap);
		} else {
			player.g.points = player.g.points.add(gain.mul(diff)).max(0);
		};
		for (let id in player.g.grid) {
			if (gridEffect("g", id).gt(0)) {
				let gen = new Decimal(0);
				let extra = new Decimal(0);
				let checkId = Number(id) + 100;
				if (gridEffect("g", checkId).gt(0)) {
					if (gen.eq(0)) gen = new Decimal(1);
					gen = gen.mul(gridEffect("g", checkId));
					extra = extra.add(gridEffect("g", checkId));
				};
				checkId = Number(id) + 101;
				if (gridEffect("g", checkId).gt(0)) {
					if (gen.eq(0)) gen = new Decimal(1);
					gen = gen.mul(gridEffect("g", checkId));
					extra = extra.add(gridEffect("g", checkId));
				};
				gen = gen.max(extra);
				if (gen.gt(0)) {
					if (player.sg.unlocked) gen = gen.mul(tmp.sg.effect);
				};
				if (productionCap && gen.gt(0) && (player.g.grid[id].amount.add(gen.mul(diff)).gte(gen.mul(productionCap)) || hasMilestone("sb", 7))) {
					player.g.grid[id].amount = gen.mul(productionCap);
				} else {
					player.g.grid[id].amount = player.g.grid[id].amount.add(gen.mul(diff)).max(0);
				};
			};
		};
	},
	automate() {
		for (let id in player.g.grid) {
			if (generatorCostScale[id]) {
				if (id > 500) {
					// placeholder
				} else if (id > 400) {
					if (player.points.gte(generatorCost(id)) && hasMilestone("sb", 5) && player.g.autoBBFE) {
						player.points = player.points.sub(generatorCost(id));
						player.g.grid[id].bought++;
						player.g.grid[id].amount = player.g.grid[id].amount.add(1);
					};
				} else if (id > 300) {
					if (player.points.gte(generatorCost(id)) && hasMilestone("sb", 2) && player.g.autoLCR) {
						player.points = player.points.sub(generatorCost(id));
						player.g.grid[id].bought++;
						player.g.grid[id].amount = player.g.grid[id].amount.add(1);
					};
				} else if (id > 200) {
					if (player.points.gte(generatorCost(id)) && hasMilestone("sb", 1) && player.g.auto1and2) {
						player.points = player.points.sub(generatorCost(id));
						player.g.grid[id].bought++;
						player.g.grid[id].amount = player.g.grid[id].amount.add(1);
					};
				} else {
					if (player.points.gte(generatorCost(id)) && hasMilestone("sb", 0) && player.g.autoBasic) {
						player.points = player.points.sub(generatorCost(id));
						player.g.grid[id].bought++;
						player.g.grid[id].amount = player.g.grid[id].amount.add(1);
					};
				};
			};
		};
	},
	componentStyles: {
		"gridable"() {return {"width": "105px", "height": "105px"}},
		"upgrade"() {return {"width": "125px", "height": "125px"}},
	},
	grid: {
		rows() {
			let rows = 2;
			if (hasMilestone("b", 1)) rows++;
			if (hasMilestone("b", 4)) rows++;
			return rows;
		},
		cols: 4,
		maxRows: 4,
		getStartData(id) {
			return {
				bought: 0,
				amount: new Decimal(0),
			};
		},
		getUnlocked(id) {
			return id % 100 < id / 100;
		},
		getCanClick(data, id) {
			return player.points.gte(generatorCost(id));
		},
		onClick(data, id) {
			player.points = player.points.sub(generatorCost(id));
			player.g.grid[id].bought++;
			player.g.grid[id].amount = player.g.grid[id].amount.add(1);
		},
		onHold(data, id) {
			if (player.points.gte(generatorCost(id))) {
				player.points = player.points.sub(generatorCost(id));
				player.g.grid[id].bought++;
				player.g.grid[id].amount = player.g.grid[id].amount.add(1);
			};
		},
		getTitle(data, id) {
			return generatorName[id];
		},
		getDisplay(data, id) {
			return "<br>Amount: " + format(data.amount) + " (" + formatWhole(data.bought) + ")<br><br>Cost: " + format(generatorCost(id)) + " points";
		},
		getEffect(data, id) {
			if (!data) return new Decimal(0);
			return data.amount.mul(data.bought);
		},
	},
	upgrades: {
		11: {
			title: "Basic Points",
			description: "Bought Basic Generators multiply point gain.",
			effect() {return Math.max(player.g.grid[101].bought, 1)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(10000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return getGridData("g", 201).bought >= 2 || player.b.unlocked},
		},
		12: {
			title: "Triple Points",
			description: "Triple point gain.",
			effect() {return new Decimal(3)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(100000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 11)},
		},
		13: {
			title: "Point Points",
			description: "[Points ^ 0.08] multiply point gain.",
			effect() {return player.points.pow(0.08).max(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1000000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 12)},
		},
		14: {
			title: "Cheaper 2",
			description: "Reduce Generator Generator 2 cost scaling.<br><br>Effect: 500 -> 30",
			cost: new Decimal(10000000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 13)},
		},
		15: {
			title: "Upgrade Points",
			description: "[2 ^ Upgrades] multiply point gain.",
			effect() {return 2 ** player.g.upgrades.length},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(100000000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 14)},
		},
		21: {
			title: "Point Power",
			description: "[Points ^ 0.1] multiply generator power gain.",
			effect() {return player.points.pow(0.1)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e11),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 15) && hasMilestone("b", 0)},
		},
		22: {
			title: "Cheaper 1",
			description: "Reduce Generator Generator 1 cost scaling.<br><br>Effect: 100 -> 50",
			cost: new Decimal(1e12),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 21) && hasMilestone("b", 0)},
		},
		23: {
			title: "Cheaper Basic",
			description: "Reduce Basic Generator cost scaling.<br><br>Effect: 5 -> 4",
			cost: new Decimal(2e13),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 22) && hasMilestone("b", 0)},
		},
		24: {
			title: "Even Cheaper Basic",
			description: "Reduce Basic Generator cost scaling again.<br><br>Effect: 4 -> 3",
			cost: new Decimal(2e14),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 23) && hasMilestone("b", 0)},
		},
		25: {
			title: "Even Cheaper 1",
			description: "Reduce Generator Generator 1 cost scaling again.<br><br>Effect: 50 -> 15",
			cost: new Decimal(5e15),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 24) && hasMilestone("b", 0)},
		},
		31: {
			title: "Cheaper Left",
			description: "Reduce Left Generator cost scaling.<br><br>Effect: 1,000 -> 64",
			cost: new Decimal(1e34),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 25) && hasMilestone("b", 2)},
		},
		32: {
			title: "Cheaper Right",
			description: "Reduce Right Generator base cost.<br><br>Effect: 1e17 -> 1,000,000",
			cost: new Decimal(1e37),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 31) && hasMilestone("b", 2)},
		},
		33: {
			title: "Super Power",
			description: "[Super Boosters * 2] multiply generator power gain.",
			effect() {return player.sb.points.mul(2).max(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e39),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 32) && hasMilestone("b", 2)},
		},
		34: {
			title: "Basic Power",
			description: "[1.1 ^ Bought Basic Generators] multiply generator power gain.",
			effect() {return new Decimal(1.1).pow(player.g.grid[101].bought)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e44),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 33) && hasMilestone("b", 2)},
		},
		35: {
			title: "1 and 2 Power",
			description: "[1.1 ^ Bought Generator Generators 1 and 2] multiply generator power gain.",
			effect() {return new Decimal(1.1).pow(player.g.grid[201].bought + player.g.grid[202].bought)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e50),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 34) && hasMilestone("b", 2)},
		},
		41: {
			title: "Cheaper Backward",
			description: "Reduce Backward Generator cost scaling.<br><br>Effect: 1e15 -> 10,000",
			cost: new Decimal(1e207),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 35) && hasMilestone("b", 6)},
		},
		42: {
			title: "Cheaper B/E",
			description: "Reduce Beginning and Ending Generator cost scaling.<br><br>Effect: 10,0000 -> 25 and 1,000,000 -> 100",
			cost: new Decimal(1e215),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 41) && hasMilestone("b", 6)},
		},
		43: {
			title: "Cheaper B/F",
			description: "Reduce Backward and Forward Generator cost scaling.<br><br>Effect: 10,000 -> 50 and 20,000 -> 20",
			cost: new Decimal(1e220),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 42) && hasMilestone("b", 6)},
		},
		44: {
			title: "Cheaper Generators",
			description: "Remove the base costs of all generators.",
			cost: new Decimal(1e232),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 43) && hasMilestone("b", 6)},
		},
		45: {
			title: "Generator Power",
			description: "[1.025 ^ Bought Generators] multiply generator power gain.",
			effect() {return new Decimal(1.025).pow(getBoughtGenerators())},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e239),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 44) && hasMilestone("b", 6)},
		},
	},
});

addLayer("b", {
	name: "Boosters",
	symbol: "B",
	position: 0,
	branches: ["g"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#6E64C4",
	resource: "boosters",
	row: 1,
	baseResource: "points",
	baseAmount() {return player.points},
	requires: new Decimal(1e11),
	type: "static",
	exponent: 1.25,
	base() {
		if (hasUpgrade("b", 31)) return 4.25;
		if (hasUpgrade("b", 12)) return 4.5;
		return 5;
	},
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade("b", 13)) mult = mult.div(upgradeEffect("b", 13));
		if (hasUpgrade("b", 15)) mult = mult.div(upgradeEffect("b", 15));
		if (hasUpgrade("b", 24)) mult = mult.div(upgradeEffect("b", 24));
		if (hasUpgrade("b", 33)) mult = mult.div(upgradeEffect("b", 33));
		if (hasMilestone("b", 14)) mult = mult.div(clickableEffect("hg", 13));
		return mult;
	},
	canBuyMax() {return hasMilestone("sb", 6)},
	effect() {
		let base = new Decimal(2);
		if (player.sb.unlocked) base = base.add(tmp.sb.effect);
		if (hasUpgrade("b", 25)) base = base.add(upgradeEffect("b", 25));
		return base.pow(player.b.points);
	},
	effectDescription() {return "which are multiplying point gain by " + format(tmp.b.effect) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		"milestones",
		"upgrades",
	],
	layerShown() {return hasUpgrade("g", 15) || player.b.unlocked},
	hotkeys: [{
		key: "b",
		description: "B: reset for boosters",
		onPress() {if (player.b.unlocked) doReset("b")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("b", keep);
	},
	componentStyles: {
		"upgrade"() {return {"width": "125px", "height": "125px"}},
	},
	milestones: {
		0: {
			requirementDescription: "2 boosters",
			effectDescription: "unlocks more generator upgrades",
			done() {return player.b.points.gte(2)},
		},
		1: {
			requirementDescription: "6 boosters",
			effectDescription: "unlocks a new row of generators",
			done() {return player.b.points.gte(6)},
			unlocked() {return hasMilestone("b", 0)},
		},
		2: {
			requirementDescription: "18 boosters",
			effectDescription: "unlocks more generator upgrades",
			done() {return player.b.points.gte(18)},
			unlocked() {return hasMilestone("b", 1)},
		},
		3: {
			requirementDescription: "28 boosters",
			effectDescription: "unlocks booster upgrades<br>keeps generator upgrades on reset",
			done() {return player.b.points.gte(28)},
			unlocked() {return hasMilestone("b", 2)},
		},
		4: {
			requirementDescription: "49 boosters",
			effectDescription: "unlocks a new row of generators",
			done() {return player.b.points.gte(49)},
			unlocked() {return hasMilestone("b", 3)},
		},
		5: {
			requirementDescription: "69 boosters",
			effectDescription: "unlocks more booster upgrades",
			done() {return player.b.points.gte(69)},
			unlocked() {return hasMilestone("b", 4)},
		},
		6: {
			requirementDescription: "105 boosters",
			effectDescription: "unlocks more generator upgrades",
			done() {return player.b.points.gte(105)},
			unlocked() {return hasMilestone("b", 5)},
		},
		7: {
			requirementDescription: "131 boosters",
			effectDescription: "unlocks more booster upgrades",
			done() {return player.b.points.gte(131)},
			unlocked() {return hasMilestone("b", 6)},
		},
		8: {
			requirementDescription: "198 boosters",
			effectDescription: "unlocks super generators",
			done() {return player.b.points.gte(198)},
			unlocked() {return hasMilestone("b", 7)},
		},
		9: {
			requirementDescription: "274 boosters",
			effectDescription: "unlocks super generator upgrades",
			done() {return player.b.points.gte(274)},
			unlocked() {return hasMilestone("b", 8)},
		},
		10: {
			requirementDescription: "348 boosters",
			effectDescription: "unlocks more super generator upgrades",
			done() {return player.b.points.gte(348)},
			unlocked() {return hasMilestone("b", 9)},
		},
		11: {
			requirementDescription: "459 boosters",
			effectDescription: "unlocks more super generators",
			done() {return player.b.points.gte(459)},
			unlocked() {return hasMilestone("b", 10)},
		},
		12: {
			requirementDescription: "585 boosters",
			effectDescription: "unlocks more super generator upgrades",
			done() {return player.b.points.gte(585)},
			unlocked() {return hasMilestone("b", 11)},
		},
		13: {
			requirementDescription: "1,077 boosters",
			effectDescription: "unlocks another super generator",
			done() {return player.b.points.gte(1077)},
			unlocked() {return hasMilestone("b", 12)},
		},
		14: {
			requirementDescription: "2,073 boosters",
			effectDescription: "unlocks hyper generators<br>keeps super generator upgrades on reset",
			done() {return player.b.points.gte(2073)},
			unlocked() {return hasMilestone("b", 13)},
		},
	},
	upgrades: {
		11: {
			title: "Cheaper Super",
			description: "Reduce super booster scaling.<br><br>Effect: 10,000 -> 2,500",
			cost: new Decimal(1e55),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasMilestone("b", 3)},
		},
		12: {
			title: "Cheaper Boosters",
			description: "Reduce booster scaling.<br><br>Effect: 5 -> 4.5",
			cost: new Decimal(1e61),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 11) && hasMilestone("b", 3)},
		},
		13: {
			title: "Power Boosters",
			description: "[Generator Power ^ 0.1] divides booster cost.",
			effect() {return player.g.points.pow(0.1).max(1)},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(1e64),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 12) && hasMilestone("b", 3)},
		},
		14: {
			title: "Boost Power",
			description: "[1.16 ^ Boosters] multiplies generator power gain.",
			effect() {return new Decimal(1.16).pow(player.b.points)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e68),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 13) && hasMilestone("b", 3)},
		},
		15: {
			title: "Point Boosters",
			description: "[Points ^ 0.048] divides booster cost. Maxes at 555,555.",
			effect() {return player.points.pow(0.048).max(1).min(555555)},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(1e74),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 14) && hasMilestone("b", 3)},
		},
		21: {
			title: "Upgrade Super",
			description: "[100,000 ^ Upgrades] divides super booster cost.",
			effect() {return new Decimal(100000).pow(player.b.upgrades.length)},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(1e127),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 15) && hasMilestone("b", 5)},
		},
		22: {
			title: "Boost Points",
			description: "[1.16 ^ Boosters] multiplies point gain.",
			effect() {return new Decimal(1.16).pow(player.b.points)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e139),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 21) && hasMilestone("b", 5)},
		},
		23: {
			title: "More Super Power",
			description: "[2 ^ Super Boosters] multiplies generator power gain.",
			effect() {return new Decimal(2).pow(player.sb.points)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e168),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 22) && hasMilestone("b", 5)},
		},
		24: {
			title: "Basic Boosters",
			description: "[1.2 ^ Bought Basic Generators / 1,000] divides booster cost.",
			effect() {return new Decimal(1.2).pow(player.g.grid[101].bought).div(1000).max(1)},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(1e177),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 23) && hasMilestone("b", 5)},
		},
		25: {
			title: "Upgrade Booster",
			description: "[Upgrades / 20] increases the booster effect base.",
			effect() {return player.b.upgrades.length / 20},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(1e186),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 24) && hasMilestone("b", 5)},
		},
		31: {
			title: "Even Cheaper Boosters",
			description: "Reduce booster scaling again.<br><br>Effect: 4.5 -> 4.25",
			cost: new Decimal(1e272),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 25) && hasMilestone("b", 7)},
		},
		32: {
			title: "Super Super",
			description: "[Super Boosters ^ 0.06] multiplies the super booster effect.",
			effect() {return player.sb.points.pow(0.06)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e290),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 31) && hasMilestone("b", 7)},
		},
		33: {
			title: "Generator Boosters",
			description: "[1.05 ^ Bought Generators / 1e9] divides booster cost.",
			effect() {return new Decimal(1.05).pow(getBoughtGenerators()).div(1e9).max(1)},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal("1e334"),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 32) && hasMilestone("b", 7)},
		},
		34: {
			title: "More Boost Power",
			description: "[1.25 ^ Boosters / 10,000,000] multiplies generator power gain.",
			effect() {return new Decimal(1.25).pow(player.b.points).div(10000000).max(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal("1e349"),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 33) && hasMilestone("b", 7)},
		},
		35: {
			title: "Boost Super",
			description: "[2 ^ Boosters / 10,000,000] divides super booster cost.",
			effect() {return new Decimal(2).pow(player.b.points).div(10000000).max(1)},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal("1e403"),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 34) && hasMilestone("b", 7)},
		},
	},
});

addLayer("sb", {
	name: "Super Boosters",
	symbol: "SB",
	position: 1,
	branches: ["b"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#504899",
	resource: "super boosters",
	row: 1,
	baseResource: "points",
	baseAmount() {return player.points},
	requires: new Decimal(1e24),
	type: "static",
	exponent() {
		if (player.sb.points.gte(35)) return 2.33;
		if (player.sb.points.gte(34)) return 2.287;
		if (player.sb.points.gte(33)) return 2.286;
		if (player.sb.points.gte(32)) return 2.28;
		if (player.sb.points.gte(31)) return 2.2764;
		if (player.sb.points.gte(30)) return 2.133;
		if (player.sb.points.gte(29)) return 2.10475;
		if (player.sb.points.gte(28)) return 2.10395;
		if (player.sb.points.gte(27)) return 2.0945;
		if (player.sb.points.gte(26)) return 2.067;
		if (player.sb.points.gte(25)) return 2.0313;
		if (player.sb.points.gte(22)) return 2.01675;
		if (player.sb.points.gte(9)) return 2.0125;
		return 2;
	},
	base() {
		if (hasUpgrade("b", 11)) return 2500;
		return 10000;
	},
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade("b", 21)) mult = mult.div(upgradeEffect("b", 21));
		if (hasUpgrade("b", 35)) mult = mult.div(upgradeEffect("b", 35));
		if (hasUpgrade("sg", 21)) mult = mult.div(upgradeEffect("sg", 21));
		if (hasMilestone("b", 14)) mult = mult.div(clickableEffect("hg", 13));
		return mult;
	},
	canBuyMax() {return false},
	effect() {
		let mult = new Decimal(1);
		if (hasUpgrade("b", 32)) mult = mult.mul(upgradeEffect("b", 32));
		return player.sb.points.mul(mult);
	},
	effectDescription() {return "which are increasing the booster effect base by +" + format(tmp.sb.effect)},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		"milestones",
	],
	layerShown() {return player.b.points.gte(11) || player.sb.unlocked},
	hotkeys: [{
		key: "s",
		description: "S: reset for super boosters",
		onPress() {if (player.sb.unlocked) doReset("sb")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("sb", keep);
	},
	milestones: {
		0: {
			requirementDescription: "4 super boosters",
			effectDescription: "unlocks autobuy for Basic Generator",
			toggles: [["g", "autoBasic"]],
			done() {return player.sb.points.gte(4)},
		},
		1: {
			requirementDescription: "5 super boosters",
			effectDescription: "unlocks autobuy for Generator Generators 1 and 2",
			toggles: [["g", "auto1and2"]],
			done() {return player.sb.points.gte(5)},
		},
		2: {
			requirementDescription: "6 super boosters",
			effectDescription: "unlocks autobuy for Left, Center, and Right Generators",
			toggles: [["g", "autoLCR"]],
			done() {return player.sb.points.gte(6)},
		},
		3: {
			requirementDescription: "7 super boosters",
			effectDescription: "makes points always equal to 100% of potential",
			done() {return player.sb.points.gte(7)},
		},
		4: {
			requirementDescription: "8 super boosters",
			effectDescription: "makes generator power always equal to 100% of potential",
			done() {return player.sb.points.gte(8)},
		},
		5: {
			requirementDescription: "9 super boosters",
			effectDescription: "unlocks autobuy for Beginning, Backward, Forward, and Ending Generators",
			toggles: [["g", "autoBBFE"]],
			done() {return player.sb.points.gte(9)},
		},
		6: {
			requirementDescription: "10 super boosters",
			effectDescription: "unlocks bulk buying for boosters",
			done() {return player.sb.points.gte(10)},
		},
		7: {
			requirementDescription: "14 super boosters",
			effectDescription: "makes all generator amounts always equal to 100% of potential",
			done() {return player.sb.points.gte(14)},
		},
	},
});

addLayer("sg", {
	name: "Super Generators",
	symbol: "SG",
	position: 1,
	branches: ["g"],
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		best: new Decimal(0),
		passive: new Decimal(0),
		capacity: new Decimal(0),
	}},
	color: "#248239",
	resource: "super generator power",
	row: 0,
	effect() {return player.sg.points.add(1).pow(0.5)},
	effectDescription() {return "which is multiplying all generator amounts gain and generator power gain by " + format(tmp.sg.effect) + "x"},
	tabFormat: [
		"main-display",
		["display-text", () => {return "You are gaining " + format(player.sg.passive) + " super generator power per second<br><br>Your best super generator power is " + format(player.sg.best) + "<br><br>You have " + format(player.sg.capacity) + " total capacity, with " + format(player.sg.capacity.sub(getBoughtSuperGenerators())) + " capacity remaining"}],
		"blank",
		"buyables",
		"blank",
		"upgrades",
	],
	layerShown() {return hasMilestone("b", 8)},
	doReset(resettingLayer) {
		let keep = ["buyables", "best"];
		if (hasMilestone("b", 14)) keep.push("upgrades");
		if (layers[resettingLayer].row > this.row) layerDataReset("sg", keep);
	},
	update(diff) {
		let gain = buyableEffect("sg", 11);
		gain = gain.mul(buyableEffect("sg", 12));
		gain = gain.mul(buyableEffect("sg", 17));
		gain = gain.mul(buyableEffect("sg", 18));
		if (hasUpgrade("sg", 12)) gain = gain.mul(upgradeEffect("sg", 12));
		if (hasUpgrade("sg", 14)) gain = gain.mul(upgradeEffect("sg", 14));
		player.sg.passive = gain;
		if (productionCap && player.sg.points.add(gain.mul(diff)).gte(gain.mul(productionCap))) {
			player.sg.points = gain.mul(productionCap);
		} else {
			player.sg.points = player.sg.points.add(gain.mul(diff)).max(0);
		};
		if (player.sg.points.gt(player.sg.best)) player.sg.best = player.sg.points;
		let cap = player.sb.points;
		if (hasUpgrade("sg", 15)) cap = cap.add(upgradeEffect("sg", 15));
		if (hasUpgrade("sg", 22)) cap = cap.add(upgradeEffect("sg", 22));
		if (hasUpgrade("sg", 23)) cap = cap.add(upgradeEffect("sg", 23));
		if (hasUpgrade("sg", 25)) cap = cap.add(upgradeEffect("sg", 25));
		if (hasUpgrade("sg", 35)) cap = cap.add(upgradeEffect("sg", 35));
		if (hasMilestone("b", 14)) cap = cap.add(clickableEffect("hg", 11));
		player.sg.capacity = cap;
	},
	componentStyles: {
		"buyable"() {return {"width": "200px", "height": "125px"}},
		"upgrade"() {return {"width": "125px", "height": "125px"}},
	},
	buyables: {
		respec() {
			for (let id in player.sg.buyables) {
				if (player.sg.buyables[id] instanceof Decimal) {
					player.sg.buyables[id] = new Decimal(0);
				};
			};
			player.sg.passive = new Decimal(0);
			player.sg.points = new Decimal(0);
		},
		respecText: "Respec capacity",
		respecMessage: "Are you sure you want to respec capacity? This will reset all Super Generators, but refund all capacity.",
		11: {
			title: "1st Super Generator",
			display() {
				const extra = this.extra();
				return "Increase super generator power gain by " + format(this.effectBase()) + ".<br><br>Effect: +" + format(buyableEffect("sg", this.id)) + "<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
			},
			cost() {return new Decimal(1e160).mul(new Decimal(100).pow(getBuyableAmount("sg", this.id).pow(1.25).add(1)))},
			canAfford() {return player.g.points.gte(this.cost()) && player.sg.capacity.gte(getBoughtSuperGenerators().add(1))},
			buy() {
				player.g.points = player.g.points.sub(this.cost());
				setBuyableAmount("sg", this.id, getBuyableAmount("sg", this.id).add(1));
			},
			effectBase() {
				let base = new Decimal(1);
				base = base.add(buyableEffect("sg", 14));
				return base;
			},
			extra() {
				let extra = buyableEffect("sg", 15).add(buyableEffect("sg", 19));
				if (hasUpgrade("sg", 13)) extra = extra.add(upgradeEffect("sg", 13));
				return extra;
			},
			effect() {return getBuyableAmount("sg", this.id).add(this.extra()).mul(this.effectBase())},
		},
		12: {
			title: "2nd Super Generator",
			display() {
				const extra = this.extra();
				return "Multiply super generator power gain by " + format(this.effectBase()) + ".<br><br>Effect: " + format(buyableEffect("sg", this.id)) + "x<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
			},
			cost() {return new Decimal(1e168).mul(new Decimal(1e8).pow(getBuyableAmount("sg", this.id).pow(1.25).add(1)))},
			canAfford() {return player.g.points.gte(this.cost()) && player.sg.capacity.gte(getBoughtSuperGenerators().add(1))},
			buy() {
				player.g.points = player.g.points.sub(this.cost());
				setBuyableAmount("sg", this.id, getBuyableAmount("sg", this.id).add(1));
			},
			effectBase() {
				let base = new Decimal(2);
				base = base.add(buyableEffect("sg", 13));
				return base;
			},
			extra() {return buyableEffect("sg", 15).add(buyableEffect("sg", 19))},
			effect() {return this.effectBase().pow(getBuyableAmount("sg", this.id).add(this.extra()))},
		},
		13: {
			title: "3rd Super Generator",
			display() {
				const extra = this.extra();
				return "Increase 2nd Super Generator effect base by " + format(2) + ".<br><br>Effect: +" + format(buyableEffect("sg", this.id)) + "<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
			},
			cost() {return new Decimal(1e180).mul(new Decimal(1e6).pow(getBuyableAmount("sg", this.id).pow(1.25).add(1)))},
			canAfford() {return player.g.points.gte(this.cost()) && player.sg.capacity.gte(getBoughtSuperGenerators().add(1))},
			buy() {
				player.g.points = player.g.points.sub(this.cost());
				setBuyableAmount("sg", this.id, getBuyableAmount("sg", this.id).add(1));
			},
			extra() {return buyableEffect("sg", 15).add(buyableEffect("sg", 19))},
			effect() {return getBuyableAmount("sg", this.id).add(this.extra()).mul(2)},
		},
		14: {
			title: "4th Super Generator",
			display() {
				const extra = this.extra();
				if (hasUpgrade("sg", 34)) return "[1st Super Generators ^ 1.77] increases the 1st Super Generator effect base.<br><br>Effect: +" + format(buyableEffect("sg", this.id)) + "<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
				if (hasUpgrade("sg", 11)) return "[1st Super Generators ^ 1.55] increases the 1st Super Generator effect base.<br><br>Effect: +" + format(buyableEffect("sg", this.id)) + "<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
				return "[Bought 1st Super Generators ^ 0.5] increases the 1st Super Generator effect base.<br><br>Effect: +" + format(buyableEffect("sg", this.id)) + "<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
			},
			cost() {return new Decimal(1e181).mul(new Decimal(1e10).pow(getBuyableAmount("sg", this.id).pow(1.25).add(1)))},
			canAfford() {return player.g.points.gte(this.cost()) && player.sg.capacity.gte(getBoughtSuperGenerators().add(1))},
			buy() {
				player.g.points = player.g.points.sub(this.cost());
				setBuyableAmount("sg", this.id, getBuyableAmount("sg", this.id).add(1));
			},
			extra() {
				let extra = buyableEffect("sg", 15).add(buyableEffect("sg", 19));
				if (hasUpgrade("sg", 13)) extra = extra.add(upgradeEffect("sg", 13));
				return extra;
			},
			effect() {
				if (hasUpgrade("sg", 34)) return getBuyableAmount("sg", this.id).add(this.extra()).mul(getBuyableAmount("sg", 11).add(tmp.sg.buyables[11].extra).pow(1.77));
				if (hasUpgrade("sg", 11)) return getBuyableAmount("sg", this.id).add(this.extra()).mul(getBuyableAmount("sg", 11).add(tmp.sg.buyables[11].extra).pow(1.55));
				return getBuyableAmount("sg", this.id).add(this.extra()).mul(getBuyableAmount("sg", 11).pow(0.5));
			},
		},
		15: {
			title: "5th Super Generator",
			display() {
				const extra = this.extra();
				return "Get " + format(this.effectBase()) + " extra super generators of all the previous types.<br><br>Effect: +" + format(buyableEffect("sg", this.id)) + "<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
			},
			exponent() {
				if (getBuyableAmount("sg", this.id).gte(9)) return 1.311;
				if (getBuyableAmount("sg", this.id).gte(8)) return 1.294;
				if (getBuyableAmount("sg", this.id).gte(7)) return 1.263;
				return 1.25;
			},
			cost() {return new Decimal(1e187).mul(new Decimal(1e30).pow(getBuyableAmount("sg", this.id).pow(this.exponent()).add(1)))},
			canAfford() {return player.g.points.gte(this.cost()) && player.sg.capacity.gte(getBoughtSuperGenerators().add(1))},
			buy() {
				player.g.points = player.g.points.sub(this.cost());
				setBuyableAmount("sg", this.id, getBuyableAmount("sg", this.id).add(1));
			},
			effectBase() {
				let base = new Decimal(1);
				base = base.add(buyableEffect("sg", 16));
				return base;
			},
			extra() {return buyableEffect("sg", 19)},
			effect() {return getBuyableAmount("sg", this.id).add(this.extra()).mul(this.effectBase())},
		},
		16: {
			title: "6th Super Generator",
			display() {
				const extra = this.extra();
				return "Increase 5th Super Generator effect base by " + format(0.1) + ".<br><br>Effect: +" + format(buyableEffect("sg", this.id)) + "<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
			},
			cost() {return new Decimal("1e500").mul(new Decimal(1e43).pow(getBuyableAmount("sg", this.id).pow(1.25).add(1)))},
			canAfford() {return player.g.points.gte(this.cost()) && player.sg.capacity.gte(getBoughtSuperGenerators().add(1))},
			buy() {
				player.g.points = player.g.points.sub(this.cost());
				setBuyableAmount("sg", this.id, getBuyableAmount("sg", this.id).add(1));
			},
			extra() {return buyableEffect("sg", 19)},
			effect() {return getBuyableAmount("sg", this.id).add(this.extra()).mul(0.1)},
			unlocked() {return hasMilestone("b", 11)},
		},
		17: {
			title: "7th Super Generator",
			display() {
				const extra = this.extra();
				return "[Generator Power ^ 0.0077] multiplies super generator power gain.<br><br>Effect: " + format(buyableEffect("sg", this.id)) + "x<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
			},
			exponent() {
				if (getBuyableAmount("sg", this.id).gte(8)) return 1.3388;
				if (getBuyableAmount("sg", this.id).gte(7)) return 1.331;
				return 1.25;
			},
			cost() {
				if (getBuyableAmount("sg", this.id).gte(10)) return new Decimal(Infinity);
				return new Decimal("1e420").mul(new Decimal(1e141).pow(getBuyableAmount("sg", this.id).pow(this.exponent()).add(1)));
			},
			canAfford() {return player.g.points.gte(this.cost()) && player.sg.capacity.gte(getBoughtSuperGenerators().add(1))},
			buy() {
				player.g.points = player.g.points.sub(this.cost());
				setBuyableAmount("sg", this.id, getBuyableAmount("sg", this.id).add(1));
			},
			extra() {return buyableEffect("sg", 19)},
			effect() {return player.g.points.pow(0.0077).pow(getBuyableAmount("sg", this.id).add(this.extra()))},
			unlocked() {return hasMilestone("b", 11)},
		},
		18: {
			title: "8th Super Generator",
			display() {
				const extra = this.extra();
				return "[Boosters * 1.12] multiplies super generator power gain.<br><br>Effect: " + format(buyableEffect("sg", this.id)) + "x<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
			},
			cost() {return new Decimal("1e460").mul(new Decimal(1e145).pow(getBuyableAmount("sg", this.id).pow(1.25).add(1)))},
			canAfford() {return player.g.points.gte(this.cost()) && player.sg.capacity.gte(getBoughtSuperGenerators().add(1))},
			buy() {
				player.g.points = player.g.points.sub(this.cost());
				setBuyableAmount("sg", this.id, getBuyableAmount("sg", this.id).add(1));
			},
			extra() {return buyableEffect("sg", 19)},
			effect() {return player.b.points.mul(1.12).pow(getBuyableAmount("sg", this.id).add(this.extra()))},
			unlocked() {return hasMilestone("b", 11)},
		},
		19: {
			title: "9th Super Generator",
			display() {
				const extra = this.extra();
				return "Get " + format(this.effectBase()) + " extra super generators of all the previous types.<br><br>Effect: +" + format(buyableEffect("sg", this.id)) + "<br><br>Cost: " + format(this.cost()) + " generator power<br><br>Bought: " + formatWhole(getBuyableAmount("sg", this.id)) + (extra.gt(0) ? " + " + format(extra) : "");
			},
			exponent() {
				if (getBuyableAmount("sg", this.id).gte(3)) return 1.79;
				return 1.45;
			},
			cost() {return new Decimal("1e1500").mul(new Decimal("1e343").pow(getBuyableAmount("sg", this.id).pow(this.exponent()).add(1)))},
			canAfford() {return player.g.points.gte(this.cost()) && player.sg.capacity.gte(getBoughtSuperGenerators().add(1))},
			buy() {
				player.g.points = player.g.points.sub(this.cost());
				setBuyableAmount("sg", this.id, getBuyableAmount("sg", this.id).add(1));
			},
			effectBase() {return new Decimal(0.32)},
			extra() {return new Decimal(0)},
			effect() {return getBuyableAmount("sg", this.id).add(this.extra()).mul(this.effectBase())},
			unlocked() {return hasMilestone("b", 13)},
		},
	},
	upgrades: {
		11: {
			title: "Enhance 4th",
			description: "Improve the 4th Super Generator formula.",
			cost: new Decimal(6e13),
			unlocked() {return hasMilestone("b", 9)},
		},
		12: {
			title: "Upgrade Super Power",
			description: "[2.1 ^ Upgrades] multiplies super generator power gain.",
			effect() {return new Decimal(2.1).pow(player.sg.upgrades.length)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e15),
			unlocked() {return hasUpgrade("sg", 11) && hasMilestone("b", 9)},
		},
		13: {
			title: "Extra 1 and 4",
			description: "Get 14 extra 1st and 4th Super Generators.",
			effect() {return new Decimal(14)},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(1e19),
			unlocked() {return hasUpgrade("sg", 12) && hasMilestone("b", 9)},
		},
		14: {
			title: "Super Power Recursion",
			description: "[Super Generator Power ^ 0.396 / 1e9] multiplies super generator power gain.",
			effect() {return player.sg.points.pow(0.396).div(1e9).max(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(2e22),
			unlocked() {return hasUpgrade("sg", 13) && hasMilestone("b", 9)},
		},
		15: {
			title: "Capacity + 1",
			description: "Increase total capacity by 1.",
			effect() {return new Decimal(1)},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(3e26),
			unlocked() {return hasUpgrade("sg", 14) && hasMilestone("b", 9)},
		},
		21: {
			title: "Super Synergy",
			description: "[Super Generator Power ^ 0.25] divides super booster cost.",
			effect() {return player.sg.points.pow(0.25).max(1)},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(6e28),
			unlocked() {return hasUpgrade("sg", 15) && hasMilestone("b", 10)},
		},
		22: {
			title: "Another Capacity + 1",
			description: "Increase total capacity by 1 again.",
			effect() {return new Decimal(1)},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(1e31),
			unlocked() {return hasUpgrade("sg", 21) && hasMilestone("b", 10)},
		},
		23: {
			title: "Yet Another Capacity + 1",
			description: "Increase total capacity by 1 again.",
			effect() {return new Decimal(1)},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(5e35),
			unlocked() {return hasUpgrade("sg", 22) && hasMilestone("b", 10)},
		},
		24: {
			title: "Upgrade Power",
			description: "[Upgrades ^ 16.6] multiplies generator power gain.",
			effect() {return player.sg.upgrades.length ** 16.6},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e42),
			unlocked() {return hasUpgrade("sg", 23) && hasMilestone("b", 10)},
		},
		25: {
			title: "Capacity + 2",
			description: "Increase total capacity by 2.",
			effect() {return new Decimal(2)},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(6e46),
			unlocked() {return hasUpgrade("sg", 24) && hasMilestone("b", 10)},
		},
		31: {
			title: "Power Recursion",
			description: "[Generator Power ^ 0.025 / 1e15] multiplies generator power gain.",
			effect() {return player.g.points.pow(0.025).div(1e15).max(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(3e86),
			unlocked() {return hasUpgrade("sg", 25) && hasMilestone("b", 12)},
		},
		32: {
			title: "Just an Upgrade",
			description: "Increase upgrade count by 1, just like all the others.",
			cost: new Decimal(6e99),
			unlocked() {return hasUpgrade("sg", 31) && hasMilestone("b", 12)},
		},
		33: {
			title: "Upgrade Points",
			description: "[4.9 ^ Upgrades] multiplies point gain.",
			effect() {return new Decimal(4.9).pow(player.sg.upgrades.length)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(2e137),
			unlocked() {return hasUpgrade("sg", 32) && hasMilestone("b", 12)},
		},
		34: {
			title: "Enhance 4th Again",
			description: "Improve the 4th Super Generator formula again.",
			cost: new Decimal(2e181),
			unlocked() {return hasUpgrade("sg", 33) && hasMilestone("b", 12)},
		},
		35: {
			title: "Yet Another Capacity + 1",
			description: "Increase total capacity by 1 again.",
			effect() {return new Decimal(1)},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(1e207),
			unlocked() {return hasUpgrade("sg", 34) && hasMilestone("b", 12)},
		},
	},
});

addLayer("hg", {
	name: "Hyper Generators",
	symbol: "HG",
	position: 2,
	branches: ["sg"],
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		passive: new Decimal(0),
	}},
	color: "#164E21",
	resource: "hyper generator power",
	row: 0,
	tabFormat: [
		"main-display",
		["display-text", () => {return "You are gaining " + format(player.hg.passive) + " hyper generator power per second"}],
		"blank",
		"buyables",
		"blank",
		"h-line",
		"blank",
		"clickables",
		"blank",
	],
	layerShown() {return hasMilestone("b", 14)},
	doReset(resettingLayer) {
		let keep = ["clickables"];
		if (layers[resettingLayer].row > this.row) layerDataReset("hg", keep);
	},
	update(diff) {
		let gain = buyableEffect("hg", 11);
		gain = gain.mul(buyableEffect("hg", 12));
		gain = gain.mul(buyableEffect("hg", 13));
		gain = gain.mul(clickableEffect("hg", 12));
		player.hg.passive = gain;
		if (productionCap && player.hg.points.add(gain.mul(diff)).gte(gain.mul(productionCap))) {
			player.hg.points = gain.mul(productionCap);
		} else {
			player.hg.points = player.hg.points.add(gain.mul(diff)).max(0);
		};
		if (player.hg.points.gt(player.hg.best)) player.hg.best = player.hg.points;
	},
	componentStyles: {
		"buyable"() {return {"width": "200px", "height": "125px"}},
		"clickable"() {return {"width": "200px", "height": "125px"}},
	},
	buyables: {
		11: {
			title: "1st Hyper Generator",
			display() {
				return "Increase hyper generator power gain by " + format(this.effectBase()) + ".<br><br>Effect: +" + format(buyableEffect("hg", this.id)) + "<br><br>Cost: " + format(this.cost()) + " super generator power<br><br>Bought: " + formatWhole(getBuyableAmount("hg", this.id));
			},
			cost() {return new Decimal("1e750").mul(new Decimal(1e50).pow(getBuyableAmount("hg", this.id).pow(1.1).add(1)))},
			canAfford() {return player.sg.points.gte(this.cost())},
			buy() {
				player.sg.points = player.sg.points.sub(this.cost());
				setBuyableAmount("hg", this.id, getBuyableAmount("hg", this.id).add(1));
			},
			effectBase() {return new Decimal(1)},
			effect() {return getBuyableAmount("hg", this.id).mul(this.effectBase())},
		},
		12: {
			title: "2nd Hyper Generator",
			display() {
				return "Multiply hyper generator power gain by " + format(this.effectBase()) + ".<br><br>Effect: " + format(buyableEffect("hg", this.id)) + "x<br><br>Cost: " + format(this.cost()) + " hyper generator power<br><br>Bought: " + formatWhole(getBuyableAmount("hg", this.id));
			},
			cost() {return new Decimal(1).mul(new Decimal(5).pow(getBuyableAmount("hg", this.id).pow(1.1).add(1)))},
			canAfford() {return player.hg.points.gte(this.cost())},
			buy() {
				player.hg.points = player.hg.points.sub(this.cost());
				setBuyableAmount("hg", this.id, getBuyableAmount("hg", this.id).add(1));
			},
			effectBase() {return new Decimal(2)},
			effect() {return this.effectBase().pow(getBuyableAmount("hg", this.id))},
		},
		13: {
			title: "3rd Hyper Generator",
			display() {
				return "[1.001 ^ Boosters] multiplies hyper generator power gain.<br><br>Effect: " + format(buyableEffect("hg", this.id)) + "x<br><br>Cost: " + format(this.cost()) + " hyper generator power<br><br>Bought: " + formatWhole(getBuyableAmount("hg", this.id));
			},
			cost() {return new Decimal(100).mul(new Decimal(100).pow(getBuyableAmount("hg", this.id).pow(1.1).add(1)))},
			canAfford() {return player.hg.points.gte(this.cost())},
			buy() {
				player.hg.points = player.hg.points.sub(this.cost());
				setBuyableAmount("hg", this.id, getBuyableAmount("hg", this.id).add(1));
			},
			effect() {return new Decimal(1.001).pow(player.b.points).pow(getBuyableAmount("hg", this.id))},
		},
	},
	clickables: {
		11: {
			title: "1st Hyper Ability",
			display() {return "<h3>[Hyperspace Expansion]</h3><br><br>Sacrifice your hyper generator power for +" + format(this.formula(player.hg.points.add(getClickableState("hg", this.id))).sub(this.effect())) + " capacity.<br><br>Effect: +" + format(this.effect())},
			canClick() {return player.hg.points.gt(0)},
			onClick() {
				if (!getClickableState("hg", this.id)) setClickableState("hg", this.id, new Decimal(0));
				setClickableState("hg", this.id, new Decimal(getClickableState("hg", this.id)).add(player.hg.points));
				player.hg.points = new Decimal(0);
			},
			formula(number) {return new Decimal(number).add(1).log10().div(2)},
			effect() {return this.formula(getClickableState("hg", this.id))},
		},
		12: {
			title: "2nd Hyper Ability",
			display() {
				if (this.canClick()) return "<h3>[Hyperpower Enhancement]</h3><br><br>Sacrifice your hyper generator power for " + format(this.formula(player.hg.points.add(getClickableState("hg", this.id))).div(this.effect())) + "x hyper generator power gain.<br><br>Effect: " + format(this.effect()) + "x";
				return "<h3>[Hyperpower Enhancement]</h3><br><br>You need " + format(this.req) + " hyper generator power to unlock.<br><br>Effect: /" + format(this.effect());
			},
			req: new Decimal(1000),
			canClick() {return player.hg.points.gt(0)},
			onClick() {
				if (!getClickableState("hg", this.id)) setClickableState("hg", this.id, new Decimal(0));
				setClickableState("hg", this.id, new Decimal(getClickableState("hg", this.id)).add(player.hg.points));
				player.hg.points = new Decimal(0);
			},
			formula(number) {return new Decimal(number).add(1).pow(0.1)},
			effect() {return this.formula(getClickableState("hg", this.id))},
		},
		13: {
			title: "3rd Hyper Ability",
			display() {
				if (this.canClick()) return "<h3>[Hyperboost Discounting]</h3><br><br>Sacrifice your hyper generator power for /" + format(this.formula(player.hg.points.add(getClickableState("hg", this.id))).div(this.effect())) + " booster and super booster cost.<br><br>Effect: /" + format(this.effect());
				return "<h3>[Hyperboost Discounting]</h3><br><br>You need " + format(this.req) + " hyper generator power to unlock.<br><br>Effect: /" + format(this.effect());
			},
			req: new Decimal(1e10),
			canClick() {return player.hg.points.gt(this.req)},
			onClick() {
				if (!getClickableState("hg", this.id)) setClickableState("hg", this.id, new Decimal(0));
				setClickableState("hg", this.id, new Decimal(getClickableState("hg", this.id)).add(player.hg.points));
				player.hg.points = new Decimal(0);
			},
			formula(number) {return new Decimal(number).add(1).pow(2)},
			effect() {return this.formula(getClickableState("hg", this.id))},
		},
	},
});
