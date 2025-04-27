const COLORS = [{
	name: "red",
	hex: "#ff0000",
	costBase: 0,
	earnings: 5,
	time: 3,
}, {
	name: "orange",
	hex: "#ff8800",
	costBase: 32,
	earnings: 500,
	time: 6,
}, {
	name: "yellow",
	hex: "#ffff00",
	dark: true,
	costBase: 64,
	earnings: 25000,
	time: 12,
}, {
	name: "lime",
	hex: "#88ff00",
	dark: true,
	costBase: 96,
	earnings: 2.5e6,
	time: 24,
}, {
	name: "green",
	hex: "#00ff00",
	dark: true,
	costBase: 128,
	earnings: 500e6,
	time: 48,
}, {
	name: "clover",
	hex: "#00ff88",
	dark: true,
	costBase: 164,
	earnings: 50e9,
	time: 96,
}, {
	name: "cyan",
	hex: "#00ffff",
	dark: true,
	costBase: 200,
	earnings: 2.5e12,
	time: 192,
}, {
	name: "azure",
	hex: "#0088ff",
	costBase: 250,
	earnings: 500e12,
	time: 384,
}, {
	name: "ocean",
	hex: "#0000ff",
	costBase: 300,
	earnings: 100e15,
	time: 768,
}, {
	name: "violet",
	hex: "#8800ff",
	costBase: 375,
	earnings: 50e18,
	time: 1536,
}, {
	name: "fuchsia",
	hex: "#ff00ff",
	costBase: 475,
	earnings: 2.5e21,
	time: 3072,
}, {
	name: "magenta",
	hex: "#ff0088",
	costBase: 600,
	earnings: 2.5e24,
	time: 6144,
}];

const COLOR_MILESTONES = [10, 25, 50, 100, 150, 200, 300, 400, 500, 600];

const COLOR_MILESTONE_MULT = [2.5, 5, 10, 50, 200, 200, 400, 400, 800, 800];

const COLOR_UPGRADE_STYLE = {
	background: "var(--rainbowline)",
	"background-size": "200%",
	animation: "3s linear infinite rainbowline",
};

function registerColorCost(index, bulk) {
	const BUYNUM = (index + 1) * 10 + 1;
	const AMOUNT = getBuyableAmount("c", BUYNUM).toNumber();
	let bulkCost = new Decimal(tmp.c.buyables[BUYNUM].cost || layers.c.buyables[BUYNUM].cost());
	for (let num = 1; num < bulk; num++) {
		bulkCost = bulkCost.add(layers.c.buyables[BUYNUM].cost(AMOUNT + num));
	};
	COLORS[index].bulkLocation = AMOUNT;
	if (!COLORS[index].bulkCost) COLORS[index].bulkCost = {};
	COLORS[index].bulkCost[bulk] = bulkCost;
};

function getColorBulk(index) {
	if (getClickableState("c", 11) == "next") {
		const BUYNUM = (index + 1) * 10 + 1;
		const AMOUNT = getBuyableAmount("c", BUYNUM).toNumber();
		if (AMOUNT === 0) return 1;
		for (let index = 0; index < COLOR_MILESTONES.length; index++) {
			if (AMOUNT < COLOR_MILESTONES[index]) {
				return COLOR_MILESTONES[index] - AMOUNT;
			};
		};
		return 1;
	};
	if (getClickableState("c", 11) == "5x") {
		return 5;
	};
	return 1;
};

function getColorSpeed(index) {
	let speed = newDecimalOne();
	speed = speed.div(COLORS[index].time);
	const MULTNUM = 202 + index;
	if (hasUpgrade("c", 11)) speed = speed.mul(upgradeEffect("c", 11));
	if (hasUpgrade("c", 14)) speed = speed.mul(upgradeEffect("c", 14));
	if (hasUpgrade("c", 23)) speed = speed.mul(upgradeEffect("c", 23));
	if (getGridData("m", MULTNUM)) speed = speed.mul(getGridData("m", MULTNUM));
	return speed;
};

function getColorCost(index) {
	const BUYNUM = (index + 1) * 10 + 1;
	const AMOUNT = getBuyableAmount("c", BUYNUM).toNumber();
	const BULK = getColorBulk(index);
	if (BULK === 1) {
		return tmp.c.buyables[BUYNUM].cost || layers.c.buyables[BUYNUM].cost();
	} else {
		if (COLORS[index].bulkLocation !== AMOUNT) {
			COLORS[index].bulkCost = {};
		};
		if (!COLORS[index].bulkCost[BULK]) {
			registerColorCost(index, BULK);
		};
		return COLORS[index].bulkCost[BULK];
	};
};

function getColorTabContent() {
	const content = [["display-text", "You have <h2 class='rainbowvalue-text'>" + formatWhole(player.c.colors) + "</h2> colors unlocked"]];
	if (tmp.c.clickables[11].unlocked) {
		content.push("blank");
		content.push("clickables");
		content.push("blank");
	} else {
		content.push("blank");
	};
	for (let index = 0; index <= player.c.colors && index < COLORS.length; index++) {
		const NAME = COLORS[index].name;
		content.push(["row", [
			["display-text", "<b class='sidetext' style='color:" + COLORS[index].hex + "'>" + NAME.toUpperCase()],
			["bar", NAME + "Prog"],
			["blank", ["5px", "5px"]],
			["bar", NAME + "Bar"],
			["blank", ["5px", "5px"]],
			["column", [
				["bar", NAME + "Buy"],
				["blank", ["5px", "5px"]],
				["buyable", (index + 1) * 10 + 1],
		]]]]);
		content.push("blank");
	};
	return content;
};

function getColorBars() {
	const bars = {};
	for (let index = 0; index < COLORS.length; index++) {
		const NAME = COLORS[index].name;
		const HEX = COLORS[index].hex;
		const BUYNUM = (index + 1) * 10 + 1;
		bars[NAME + "Bar"] = {
			direction: RIGHT,
			width: 300,
			height: 50,
			progress() { return player.c.time[index] || 0 },
			display() { if (getBuyableAmount("c", BUYNUM).gt(0) && player.c.earnings[index]) return "coins/cycle: " + illionFormat(player.c.earnings[index]) + "<br>(" + illionFormat(player.c.earnings[index].mul(getColorSpeed(index))) + "/sec)" },
			fillStyle: {"background-color": HEX},
			borderStyle: {"border-color": HEX},
			style: {"color": (COLORS[index].dark ? "#888888" : "#ffffff")},
			unlocked() { return player.c.colors >= index },
		};
		bars[NAME + "Buy"] = {
			direction: LEFT,
			width: 171,
			height: 21,
			progress() {
				const COST = getColorCost(index);
				if (COST.eq(0)) return newDecimalOne();
				return player.points.div(COST);
			},
			display() { return format(this.progress().min(1).mul(100)) + "%" },
			fillStyle: {"background-color": HEX},
			borderStyle: {"border-color": HEX},
			style: {"color": (COLORS[index].dark ? "#888888" : "#ffffff")},
			unlocked() { return player.c.colors >= index },
		};
		bars[NAME + "Prog"] = {
			direction: UP,
			width: 60,
			height: 60,
			progress() {
				const AMOUNT = getBuyableAmount("c", BUYNUM);
				for (let index = 0; index < COLOR_MILESTONES.length; index++) {
					if (AMOUNT.lt(COLOR_MILESTONES[index])) return AMOUNT.div(COLOR_MILESTONES[index]);
				};
				return AMOUNT.div(COLOR_MILESTONES.at(-1));
			},
			display() { return "<h1 style='font-family: Flavors'>" + formatWhole(getBuyableAmount("c", BUYNUM)) },
			fillStyle: {"background-color": HEX},
			borderStyle: {"border-color": HEX},
			style: {"color": (COLORS[index].dark ? "#888888" : "#ffffff"), "border-radius": "50%"},
			unlocked() { return player.c.colors >= index },
		};
	};
	return bars;
};

function getColorBuyables() {
	const buyables = {};
	for (let index = 0; index < COLORS.length; index++) {
		const HEX = COLORS[index].hex;
		const BUYNUM = (index + 1) * 10 + 1;
		const DIVNUM = 302 + index;
		buyables[BUYNUM] = {
			cost(x) {
				let amt = new Decimal(COLORS[index].costBase).add(x);
				let divnum = newDecimalOne();
				if (hasUpgrade("c", 12)) divnum = divnum.mul(upgradeEffect("c", 12));
				if (hasUpgrade("c", 15)) divnum = divnum.mul(upgradeEffect("c", 15));
				if (hasUpgrade("c", 22)) divnum = divnum.mul(upgradeEffect("c", 22));
				if (getGridData("m", DIVNUM)) divnum = divnum.mul(getGridData("m", DIVNUM));
				return amt.div(2).pow(2).add(new Decimal(1.32).pow(amt.pow(0.9))).div(divnum);
			},
			canAfford() { return player.points.gte(getColorCost(index)) },
			buy() {
				player.points = player.points.sub(getColorCost(index));
				addBuyables("c", BUYNUM, getColorBulk(index));
			},
			display() {
				if (getBuyableAmount("c", BUYNUM).gte(this.purchaseLimit)) return "<h3 style='color:" + HEX + "'>MAXED";
				let buyText = "Cost";
				if (getBuyableAmount("c", BUYNUM).eq(0) && getColorBulk(index) === 1) buyText = "Unlock";
				return "<h3 style='color:" + HEX + "'>" + buyText + ": " + illionFormat(getColorCost(index), true) + " coins";
			},
			purchaseLimit: COLOR_MILESTONES.at(-1),
			style: {"background-color": (COLORS[index].dark ? "#888888" : "#ffffff")},
			unlocked() { return player.c.colors >= index },
		};
	};
	return buyables;
};

function getAverageCoinGain() {
	let gain = newDecimalZero();
	for (let index = 0; index < player.c.colors; index++) {
		if (player.c.earnings[index]) gain = gain.add(player.c.earnings[index].mul(getColorSpeed(index)));
	};
	return gain;
};

addLayer("c", {
	name: "Colors",
	symbol: "<span class='rainbowline-backround'></span>",
	row: 0,
	position: 0,
	startData() { return {
		unlocked: true,
		colors: 0,
		colorBest: 0,
		earnings: Array.from({length: COLORS.length}, () => newDecimalZero()),
		time: Array.from({length: COLORS.length}, () => newDecimalZero()),
	}},
	color: "#ffffff",
	nodeStyle: {border: "0px transparent"},
	tooltip() { return formatWhole(player.c.colors) + " colors unlocked" },
	layerShown() { return true },
	doReset(resettingLayer) {
		const keep = [];
		if (resettingLayer == "m") keep.push("colorBest", "clickables");
		if (layers[resettingLayer].row > this.row) layerDataReset("c", keep);
	},
	update(diff) {
		// update unlocks
		for (let index = player.c.colors; index < COLORS.length; index++) {
			const BUYNUM = (index + 1) * 10 + 1;
			if (getBuyableAmount("c", BUYNUM).gt(0)) {
				player.c.colors = index + 1;
			} else {
				break;
			};
		};
		// update best
		if (player.c.colors > player.c.colorBest) player.c.colorBest = player.c.colors;
		// calculate earnings
		for (let index = 0; index < player.c.colors; index++) {
			const BUYNUM = (index + 1) * 10 + 1;
			const MULTNUM = 102 + index;
			let earnings = getBuyableAmount("c", BUYNUM).mul(COLORS[index].earnings);
			for (let msIndex = 0; msIndex < COLOR_MILESTONES.length; msIndex++) {
				if (getBuyableAmount("c", BUYNUM).gte(COLOR_MILESTONES[msIndex])) earnings = earnings.mul(COLOR_MILESTONE_MULT[msIndex]);
			};
			if (hasUpgrade("c", 13)) earnings = earnings.mul(upgradeEffect("c", 13));
			if (hasUpgrade("c", 21)) earnings = earnings.mul(upgradeEffect("c", 21));
			if (hasUpgrade("c", 24)) earnings = earnings.mul(upgradeEffect("c", 24));
			if (getGridData("m", MULTNUM)) earnings = earnings.mul(getGridData("m", MULTNUM));
			player.c.earnings[index] = earnings;
		};
		// earn
		for (let index = 0; index < player.c.colors; index++) {
			if (!player.c.time[index]) {
				player.c.time[index] = newDecimalZero();
			} else if (player.c.time[index].gt(1)) {
				let timesFilled = player.c.time[index].floor();
				player.points = player.points.add(player.c.earnings[index].mul(timesFilled));
				player.c.time[index] = player.c.time[index].sub(timesFilled);
			};
		};
		// add time
		for (let index = 0; index < player.c.colors; index++) {
			player.c.time[index] = player.c.time[index].add(getColorSpeed(index).mul(diff));
		};
	},
	tabFormat: {
		Colors: {
			content: getColorTabContent,
		},
		Upgrades: {
			content: [
				["display-text", () => "You have <h2 class='rainbowvalue-text'>" + formatWhole(player.c.colors) + "</h2> colors unlocked"],
				"blank",
				"upgrades",
			],
			unlocked() { return hasMilestone("m", 1) },
		},
	},
	componentStyles: {
		buyable: {height: "25px", width: "175px", "border-radius": "10px", "z-index": 99},
	},
	bars: getColorBars(),
	buyables: getColorBuyables(),
	clickables: {
		11: {
			display() {
				if (!getClickableState("c", 11)) return "<h2>Buying 1x";
				return "<h2>Buying " + getClickableState("c", 11);
			},
			style: {"min-height": "40px", "border-radius": "20px"},
			canClick() { return true },
			onClick() {
				if (!getClickableState("c", 11)) {
					setClickableState("c", 11, "1x");
				};
				if (getClickableState("c", 11) == "1x") {
					setClickableState("c", 11, "5x");
				} else if (getClickableState("c", 11) == "5x" && hasMilestone("m", 3)) {
					setClickableState("c", 11, "next");
				} else {
					setClickableState("c", 11, "1x");
				};
			},
			unlocked() { return hasMilestone("m", 0) },
		},
	},
	upgrades: {
		11: {
			coinCost: 1e6,
			fullDisplay() { return "<h3>Smoother Production</h3><br>multiplies the speed of all colors by 1.1<br><br>Cost: " + illionFormat(this.coinCost) + " coins" },
			canAfford() { return player.points.gte(this.coinCost) },
			pay() { player.points = player.points.sub(this.coinCost) },
			effect: 1.1,
			style() { if (tmp[this.layer].upgrades[this.id].canAfford && !hasUpgrade("c", this.id)) return COLOR_UPGRADE_STYLE},
		},
		12: {
			coinCost: 1e9,
			fullDisplay() { return "<h3>Corner Cutting</h3><br>divides color costs by 1.5<br><br>Cost: " + illionFormat(this.coinCost) + " coins" },
			canAfford() { return player.points.gte(this.coinCost) },
			pay() { player.points = player.points.sub(this.coinCost) },
			effect: 1.5,
			onPurchase() {
				for (let index = 0; index < COLORS.length; index++) {
					registerColorCost(index, getColorBulk(index));
				};
			},
			style() { if (tmp[this.layer].upgrades[this.id].canAfford && !hasUpgrade("c", this.id)) return COLOR_UPGRADE_STYLE},
		},
		13: {
			coinCost: 1e12,
			fullDisplay() { return "<h3>Spectrum Synergy</h3><br>multiplies color powers based on your colors unlocked<br><br>Effect: " + illionFormat(upgradeEffect(this.layer, this.id)) + "x<br><br>Cost: " + illionFormat(this.coinCost) + " coins" },
			canAfford() { return player.points.gte(this.coinCost) },
			pay() { player.points = player.points.sub(this.coinCost) },
			effect() { return (player.c.colors) ** 2 / 100 + 1 },
			style() { if (tmp[this.layer].upgrades[this.id].canAfford && !hasUpgrade("c", this.id)) return COLOR_UPGRADE_STYLE},
		},
		14: {
			coinCost: 1e15,
			fullDisplay() { return "<h3>Multiplicative Speed</h3><br>multiplies color speeds based on your total multiplier<br><br>Effect: " + illionFormat(upgradeEffect(this.layer, this.id)) + "x<br><br>Cost: " + illionFormat(this.coinCost) + " coins" },
			canAfford() { return player.points.gte(this.coinCost) },
			pay() { player.points = player.points.sub(this.coinCost) },
			effect() { return player.m.points.add(1).log10().div(5).add(1) },
			style() { if (tmp[this.layer].upgrades[this.id].canAfford && !hasUpgrade("c", this.id)) return COLOR_UPGRADE_STYLE},
		},
		15: {
			coinCost: 1e18,
			fullDisplay() { return "<h3>Upgraded Costs</h3><br>divides color costs based on your color upgrades<br><br>Effect: /" + illionFormat(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: " + illionFormat(this.coinCost) + " coins" },
			canAfford() { return player.points.gte(this.coinCost) },
			pay() { player.points = player.points.sub(this.coinCost) },
			effect() { return player.c.upgrades.length / 10 + 1 },
			onPurchase() {
				for (let index = 0; index < COLORS.length; index++) {
					registerColorCost(index, getColorBulk(index));
				};
			},
			style() { if (tmp[this.layer].upgrades[this.id].canAfford && !hasUpgrade("c", this.id)) return COLOR_UPGRADE_STYLE},
		},
		21: {
			coinCost: 1e21,
			fullDisplay() { return "<h3>Powered Colors</h3><br>multiplies color powers based on your total multiplier<br><br>Effect: " + illionFormat(upgradeEffect(this.layer, this.id)) + "x<br><br>Cost: " + illionFormat(this.coinCost) + " coins" },
			canAfford() { return player.points.gte(this.coinCost) },
			pay() { player.points = player.points.sub(this.coinCost) },
			effect() { return player.m.points.add(1).log10().div(4).add(1) },
			style() { if (tmp[this.layer].upgrades[this.id].canAfford && !hasUpgrade("c", this.id)) return COLOR_UPGRADE_STYLE},
		},
		22: {
			coinCost: 1e24,
			fullDisplay() { return "<h3>Investment</h3><br>divides color costs based on your colors unlocked<br><br>Effect: /" + illionFormat(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: " + illionFormat(this.coinCost) + " coins" },
			canAfford() { return player.points.gte(this.coinCost) },
			pay() { player.points = player.points.sub(this.coinCost) },
			effect() { return (player.c.colors) ** 2.5 / 1000 + 1 },
			onPurchase() {
				for (let index = 0; index < COLORS.length; index++) {
					registerColorCost(index, getColorBulk(index));
				};
			},
			style() { if (tmp[this.layer].upgrades[this.id].canAfford && !hasUpgrade("c", this.id)) return COLOR_UPGRADE_STYLE},
		},
		23: {
			coinCost: 1e27,
			fullDisplay() { return "<h3>Fluid Production</h3><br>multiplies color speeds based on your colors unlocked<br><br>Effect: " + illionFormat(upgradeEffect(this.layer, this.id)) + "x<br><br>Cost: " + illionFormat(this.coinCost) + " coins" },
			canAfford() { return player.points.gte(this.coinCost) },
			pay() { player.points = player.points.sub(this.coinCost) },
			effect() { return (player.c.colors) ** 2 / 100 + 1 },
			style() { if (tmp[this.layer].upgrades[this.id].canAfford && !hasUpgrade("c", this.id)) return COLOR_UPGRADE_STYLE},
		},
		24: {
			coinCost: 1e30,
			fullDisplay() { return "<h3>Upgraded Power</h3><br>multiplies color powers based on your color upgrades<br><br>Effect: " + illionFormat(upgradeEffect(this.layer, this.id)) + "x<br><br>Cost: " + illionFormat(this.coinCost) + " coins" },
			canAfford() { return player.points.gte(this.coinCost) },
			pay() { player.points = player.points.sub(this.coinCost) },
			effect() { return player.c.upgrades.length / 10 + 1 },
			style() { if (tmp[this.layer].upgrades[this.id].canAfford && !hasUpgrade("c", this.id)) return COLOR_UPGRADE_STYLE},
		},
		25: {
			coinCost: 1e33,
			fullDisplay() { return "<h3>???</h3><br>coming soon!<br><br>Cost: " + illionFormat(this.coinCost) + " coins" },
			canAfford() { return player.points.gte(this.coinCost) },
			pay() { player.points = player.points.sub(this.coinCost) },
			style() { if (tmp[this.layer].upgrades[this.id].canAfford && !hasUpgrade("c", this.id)) return COLOR_UPGRADE_STYLE},
		},
	},
});

function assignMultiplier(amount, selected = -1) {
	let color = (selected >= 0 ? selected + 1 : getRandInt(1, player.c.colorBest));
	let type = getRandInt(1, 4);
	let id = type * 100 + color + 1;
	setGridData("m", id, amount.add(getGridData("m", id)));
	console.log("Assigned " + amount + " to " + COLORS[color - 1].name + " " + ["power", "speed", "cost"][type - 1]);
};

addLayer("m", {
	name: "Multiplier",
	symbol: "M",
	row: 2,
	position: 0,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		type: -1,
	}},
	color: "#708090",
	marked: "moon",
	requires: 4,
	resource: "total multiplier",
	baseResource: "colors unlocked",
	baseAmount() { return new Decimal(player.c.colors) },
	type: "custom",
	gainMult() {
		let mult = newDecimalOne();
		if (hasMilestone("m", 2)) mult = mult.add(1);
		if (hasMilestone("m", 4)) mult = mult.add(1);
		return mult;
	},
	getResetGain(x = 0) {
		const num = player.c.colors + x;
		if (num < tmp.m.requires) return newDecimalZero();
		let gain = new Decimal(2).pow(num + 1 - tmp.m.requires);
		gain = gain.mul(tmp.m.gainMult);
		return gain;
	},
	getNextAt() {
		if (!tmp.m.canReset) return tmp.m.requires;
		return player.c.colors + 1;
	},
	canReset() { return player.c.colors >= tmp.m.requires },
	prestigeNotify() { return tmp.m.canReset && (new Decimal(tmp.m.resetGain).gte(player.m.points.div(10))) },
	prestigeButtonText() {
		let text = "";
		if (player.m.points.lt(1e3)) text += "Reset for ";
		const TYPE = (player.m.type >= 0 ? (hasMilestone("m", 2) ? "partially " : "") + COLORS[player.m.type].name : "random");
		if (!tmp.m.canReset) return text + "+<b>0</b> " + TYPE + " multiplier<br><br>You will gain " + illionFormat(new Decimal(2).mul(tmp.m.gainMult), false, 0) + " more at 4 colors unlocked";
		return text + "+<b>" + illionFormat(tmp.m.resetGain, false, 0) + "</b> " + TYPE + " multiplier<br><br>You will gain " + illionFormat(this.getResetGain(1) - tmp.m.resetGain, true, 0) + " more at " + illionFormat(tmp.m.nextAt, true, 0) + " colors unlocked";
	},
	onPrestige(gain) {
		if (hasMilestone("m", 2)) {
			let portion = gain.div(hasMilestone("m", 4) ? 3 : 2).round();
			assignMultiplier(portion, player.m.type);
			assignMultiplier(portion);
			if (hasMilestone("m", 4)) assignMultiplier(portion);
		} else {
			assignMultiplier(gain, player.m.type);
		};
	},
	hotkeys: [{
		key: "M",
		description: "Shift+M: Reset for multiplier",
		onPress() { if (player.m.unlocked) doReset("m") },
	}],
	layerShown() { return true },
	tabFormat: [
		"main-display",
		"prestige-button",
		["custom-resource-display", () => "You have " + player.c.colors + " colors unlocked<br>Your best colors unlocked is " + player.c.colorBest],
		"blank",
		["column", [
			["raw-html", "<button class='scrollButton can' onclick='this.parentElement.nextElementSibling.scrollBy(-92, 0)'>\<</button><h2 style='padding: 0 5px 0 5px'>Multiplier Distribution</h2><button class='scrollButton can' onclick='this.parentElement.nextElementSibling.scrollBy(92, 0)'>\></button>", {"display": "flex", "justify-content": "space-between", "padding": "0 5px 0 5px"}],
			["contained-grid", "calc(100% - 10px)"],
			["display-text", "Click one of the colored buttons at the bottom to select that multiplier color.", {"padding": "0 5px 0 5px"}],
		]],
		"blank",
		"milestones",
	],
	componentStyles: {
		column: {width: "fit-content", "max-width": "calc(100% - 14px)", border: "2px solid #ffffff", "border-radius": "20px", padding: "5px 0"},
		"contained-grid": {padding: "5px"},
	},
	grid: {
		rows: 4,
		cols() { return player.c.colorBest + 1 },
		maxCols: COLORS.length + 1,
		getStartData(id) {},
		getDisplay(data, id) {
			if (id == 101) return "<h3>this row multiplies power";
			if (id == 201) return "<h3>this row multiplies speed";
			if (id == 301) return "<h3>this row divides cost";
			if (id == 401) return "<h3>RANDOM";
			if (id > 401) return "<h3>" + COLORS[id % 100 - 2].name.toUpperCase();
			if (!data) return "<h2>N/A";
			return "<h2>" + illionFormat(data, true, 0);
		},
		getStyle(data, id) {
			const INDEX = id % 100 - 2;
			return {
				width: "90px",
				height: (id >= 401 ? "30px" : "90px"),
				"border-color": (id >= 401 ? (INDEX >= 0 ? COLORS[INDEX].hex : "#888888") : "#00000020"),
				"border-radius": "10px",
				"background-color": (INDEX >= 0 ? (COLORS[INDEX].dark ? "#888888" : "#f0f0f0") : "#f0f0f0"),
				color: (INDEX >= 0 ? COLORS[INDEX].hex : "#000000"),
			};
		},
		getCanClick(data, id) { return id >= 401 },
		overrideNeedLayerUnlocked: true,
		onClick(data, id) {
			const INDEX = id % 100 - 2;
			player.m.type = INDEX;
		},
	},
	milestones: {
		0: {
			done() { return player.m.points.gte(2) },
			requirementDescription: "2 total multiplier",
			effectDescription: "unlock the bulk buy 5x option for colors",
		},
		1: {
			done() { return player.m.points.gte(8) },
			requirementDescription: "8 total multiplier",
			effectDescription: "unlock the upgrades tab",
			unlocked() { return hasMilestone("m", this.id - 1) },
		},
		2: {
			done() { return player.m.points.gte(64) },
			requirementDescription: "64 total multiplier",
			effectDescription: "you gain +100% extra multiplier on reset<br>this extra multiplier is assigned randomly",
			unlocked() { return hasMilestone("m", this.id - 1) },
		},
		3: {
			done() { return player.m.points.gte(256) },
			requirementDescription: "256 total multiplier",
			effectDescription: "unlock the bulk buy next option for colors",
			unlocked() { return hasMilestone("m", this.id - 1) },
		},
		4: {
			done() { return player.m.points.gte(1024) },
			requirementDescription: "1,024 total multiplier",
			effectDescription: "you gain +100% extra multiplier on reset<br>this extra multiplier is assigned randomly",
			unlocked() { return hasMilestone("m", this.id - 1) },
		},
		5: {
			done() { return player.m.points.gte(4096) },
			requirementDescription: "4,096 total multiplier",
			effectDescription: "coming soon!",
			unlocked() { return hasMilestone("m", this.id - 1) },
		},
	},
});
