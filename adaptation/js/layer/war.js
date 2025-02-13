function getEnhancableGridSize() {
	let size = 0;
	if (hasMilestone("d", 50)) size++;
	if (hasMilestone("d", 58)) size++;
	if (hasMilestone("r", 31)) size++;
	if (hasMilestone("r", 33)) size++;
	if (hasMilestone("r", 39)) size++;
	if (hasMilestone("r", 44)) size++;
	return size;
};

const warUpgrades = [[
	{title: "Display of Power", desc() {return "divides domination requirement based on wars<br>(currently /" + format(gridEffect("w", 101)) + ")"}, effect() {return player.w.points.add(2)}, cost: 1, e: {effect() {return new Decimal(100000).pow(player.w.points)}, cost: 1}},
	{title: "Violent Expansion", desc() {return "divides expansion requirement based on wars<br>(currently /" + format(gridEffect("w", 102)) + ")"}, effect() {return player.w.points.div(2).add(1)}, cost: 2, e: {effect() {return player.w.points.add(1).pow(1.25)}, cost: 1}},
	{title: "Wilderness Exploration", desc() {return "divides species requirement based on wars<br>(currently /" + format(gridEffect("w", 103)) + ")"}, effect() {return player.w.points.pow_base(1e5)}, cost: 4, e: {effect() {return player.w.points.pow_base(1e10)}, cost: 1}},
	{title: "Nature Investigation", desc() {return "divides ecosystem requirement based on wars<br>(currently /" + format(gridEffect("w", 104)) + ")"}, effect() {return player.w.points.div(3).add(1)}, cost: 25, e: {effect() {return player.w.points.add(1)}, cost: 2}},
	{title: "Solace Seeking", desc() {return "divides conscious being requirement based on wars<br>(currently /" + format(gridEffect("w", 105)) + ")"}, effect() {return player.w.points.pow_base("1e5000")}, cost: 150, e: {effect() {return player.w.points.pow_base("1e100000")}, cost: 4}},
	{title: "Revolutionary Tactics", desc() {return "divides revolution requirement based on wars<br>(currently /" + format(gridEffect("w", 106)) + ")"}, effect() {return player.w.points.div(10).add(1)}, cost: 1000, e: {effect() {return player.w.points.add(1)}, cost: 8}},
], [
	{title: "Forced Migration", desc() {return "increases the 10th hybridization's completion limit based on wars<br>(currently +" + formatWhole(gridEffect("w", 201)) + ")"}, effect() {return player.w.points.mul(2)}, cost: 2, e: {effect() {return player.w.points.mul(4)}, cost: 1}},
	{title: "Out of Place, Out of Time", desc: "unlocks another ANACHRONISM tier", effect: 1, cost: 4, e: {desc: "unlocks two more ANACHRONISM tiers", effect: 2, cost: 1}},
	{title: "Displaced Chronology", desc: "unlocks another ANACHRONISM tier", effect: 1, cost: 8, e: {desc: "unlocks two more ANACHRONISM tiers", effect: 2, cost: 1}},
	{title: "Smaller Habitats", desc() {return "increases the 10th hybridization's completion limit based on wars<br>(currently +" + formatWhole(gridEffect("w", 204)) + ")"}, effect() {return player.w.points.mul(3)}, cost: 30, e: {effect() {return player.w.points.mul(6)}, cost: 2}},
	{title: "Ancient Tactics", desc: "unlocks another ANACHRONISM tier", effect: 1, cost: 200, e: {desc: "unlocks two more ANACHRONISM tiers", effect: 2, cost: 4}},
	{title: "Futuristic Tactics", desc: "unlocks another ANACHRONISM tier", effect: 1, cost: 1500, e: {desc: "unlocks two more ANACHRONISM tiers", effect: 2, cost: 8}},
], [
	{title: "Enroaching Influence", desc: "unlocks another influence generator", effect: 1, cost: 4, e: {desc: "unlocks two more influence generators", effect: 2, cost: 1}},
	{title: "Greater Empowerment", desc: "reduces <b>Influence empowerment</b>'s cost scaling", cost: 8, effect: 1.5, e: {desc: "reduces <b>Influence empowerment</b>'s cost scaling more", effect: 1.45, cost: 1}},
	{title: "Surrounding Influence", desc: "unlocks another influence generator", effect: 1, cost: 16, e: {desc: "unlocks two more influence generators", effect: 2, cost: 2}},
	{title: "Generator Recycling", desc: "reduces the cost scaling of influence generators", cost: 40, e: {desc: "reduces the cost scaling of influence generators more", cost: 4}},
	{title: "Overarching Influence", desc: "unlocks another influence generator", effect: 1, cost: 250, e: {desc: "unlocks two more influence generators", effect: 2, cost: 8}},
	{title: "Greater Tickspeed", desc: "reduces <b>Influence tickspeed</b>'s cost scaling", cost: 2000, e: {desc: "reduces <b>Influence tickspeed</b>'s cost scaling more", cost: 16}},
], [
	{title: "Conflict Escalation", desc: "decreases war requirement base by 0.025", effect: 0.025, cost: 25, e: {desc: "decreases war requirement base by 0.03", effect: 0.03, cost: 2}},
	{title: "Battle Domination", desc: "decreases domination requirement base by 0.313", effect: 0.313, cost: 30, e: {desc: "decreases domination requirement base by 0.33", effect: 0.33, cost: 2}},
	{title: "Revolutionary Armaments", desc: "decreases revolution requirement base by 0.1", effect: 0.1, cost: 40, e: {desc: "decreases revolution requirement base by 0.17", effect: 0.17, cost: 4}},
	{title: "New Frontiers", desc: "decreases species requirement base by 0.075", effect: 0.075, cost: 55, e: {desc: "decreases species requirement base by 0.09", effect: 0.09, cost: 8}},
	{title: "Further Exploration", desc: "decreases expansion requirement base by 0.1", effect: 0.1, cost: 300, e: {desc: "decreases expansion requirement base by 0.11", effect: 0.11, cost: 16}},
	{title: "Enlightened Tactics", desc: "decreases conscious being requirement base by 1", effect: 1, cost: 2500, e: {desc: "decreases conscious being requirement base by 2", effect: 2, cost: 32}},
], [
	{title: "Further Domination", desc() {return "gives extra FOC, SPE, CLI, and DOM based on wars<br>(currently +" + formatWhole(gridEffect("w", 501)) + ")"}, effect() {return player.w.points}, cost: 150, e: {effect() {return player.w.points.mul(10)}, cost: 4}},
	{title: "Further Acclimation", desc() {return "gives extra CRA, FER, ANA, and SOV based on wars<br>(currently +" + formatWhole(gridEffect("w", 502)) + ")"}, effect() {return player.w.points.mul(75000)}, cost: 200, e: {effect() {return player.w.points.mul(10000000)}, cost: 4}},
	{title: "Military Domination", desc() {return "gives extra FOC, SPE, CLI, and DOM based on wars<br>(currently +" + formatWhole(gridEffect("w", 503)) + ")"}, effect() {return player.w.points.mul(2)}, cost: 250, e: {effect() {return player.w.points.mul(25)}, cost: 8}},
	{title: "Forced Acclimation", desc() {return "gives extra CRA, FER, ANA, and SOV based on wars<br>(currently +" + formatWhole(gridEffect("w", 504)) + ")"}, effect() {return player.w.points.mul(220000)}, cost: 300, e: {effect() {return player.w.points.mul(25000000)}, cost: 16}},
	{title: "Overpowering Presence", desc() {return "gives extra FOC, SPE, CLI, and DOM based on wars<br>(currently +" + formatWhole(gridEffect("w", 505)) + ")"}, effect() {return player.w.points.mul(5)}, cost: 350, e: {effect() {return player.w.points.mul(100)}, cost: 32}},
	{title: "Primal Instincts", desc() {return "gives extra CRA, FER, ANA, and SOV based on wars<br>(currently +" + formatWhole(gridEffect("w", 506)) + ")"}, effect() {return player.w.points.mul(500000)}, cost: 3500, e: {effect() {return player.w.points.mul(100000000)}, cost: 64}},
], [
	{title: "Honed Focus", desc() {return "divides focus+ requirement based on wars<br>(currently /" + format(gridEffect("w", 601)) + ")"}, effect() {return player.w.points.add(1).pow(0.1)}, cost: 1000, e: {effect() {return player.w.points.add(1).pow(0.15)}, cost: 8}},
	{title: "Public Speaking", desc: "improves the last leader effect", cost: 1500, e: {desc: "improves the last leader effect more", cost: 8}},
	{title: "Political Upheaval", desc() {return "divides leader requirement based on wars<br>(currently /" + format(gridEffect("w", 603)) + ")"}, effect() {return player.w.points.add(1).pow(0.2)}, cost: 2000, e: {effect() {return player.w.points.add(1).pow(0.3)}, cost: 16}},
	{title: "Smarter Leaders", desc: "improves the second leader effect", effect: 3, cost: 2500, e: {desc: "improves the second leader effect more", effect: 4.25, cost: 32}},
	{title: "Finer Focus", desc() {return "divides focus+ requirement based on wars<br>(currently /" + format(gridEffect("w", 605)) + ")"}, effect() {return player.w.points.add(1).pow(0.125)}, cost: 3500, e: {effect() {return player.w.points.add(1).pow(0.2)}, cost: 64}},
	{title: "Public Relations 101", desc: "improves the last leader effect", cost: 4500, e: {desc: "improves the last leader effect more", cost: 128}},
]];

function getWarUpgradeCostE(id) {
	let cost = warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1].e?.cost;
	if (typeof cost != "number") return Infinity;
	if (player.cy.unlocks[1] >= 5) cost--;
	if (player.cy.unlocks[1] >= 10) cost--;
	if (tmp.em) cost -= buyableEffect("em", 14).toNumber();
	return Math.max(cost, 0);
};

addLayer("w", {
	name: "War",
	symbol: "W",
	position: 3,
	branches: [["cb", 2], "d"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		spent: newDecimalZero(),
		spentE: newDecimalZero(),
	}},
	color: "#C77055",
	resource: "wars",
	row: 4,
	baseResource: "domination points",
	baseAmount() {return player.d.points},
	requires: new Decimal(200),
	type: "static",
	base() {
		let base = 2;
		if (challengeCompletions("ec", 11) >= 11 && challengeEffect("ec", 11)[10]) base -= challengeEffect("ec", 11)[10];
		if (challengeCompletions("ec", 11) >= 13 && challengeEffect("ec", 11)[12]) base -= challengeEffect("ec", 11)[12];
		if (challengeCompletions("ec", 11) >= 14 && challengeEffect("ec", 11)[13]) base -= challengeEffect("ec", 11)[13];
		if (challengeCompletions("ec", 11) >= 21 && challengeEffect("ec", 11)[20]) base -= challengeEffect("ec", 11)[20];
		if (hasMilestone("r", 17)) base -= milestoneEffect("r", 17);
		if (hasMilestone("r", 18)) base -= milestoneEffect("r", 18);
		if (hasMilestone("r", 24)) base -= milestoneEffect("r", 24);
		if (hasMilestone("r", 28)) base -= milestoneEffect("r", 28);
		if (hasMilestone("r", 58)) base -= milestoneEffect("r", 58);
		if (hasMilestone("r", 62)) base -= milestoneEffect("r", 62);
		if (hasMilestone("r", 64)) base -= milestoneEffect("r", 64);
		if (hasMilestone("r", 77)) base -= milestoneEffect("r", 77);
		if (hasMilestone("r", 78)) base -= milestoneEffect("r", 78);
		if (getGridData("w", 401)) base -= gridEffect("w", 401);
		return base;
	},
	exponent() {return inChallenge("co", 11) ? 2 : 1},
	roundUpCost: true,
	canBuyMax() {return player.l.points.gte(3) || player.cy.unlocked},
	resetDescription: "Declare war for ",
	gainMult() {
		let mult = newDecimalOne();
		if (getBuyableAmount("d", 14).gte(tmp.d.buyables[14].purchaseLimit)) mult = mult.div(tmp.d.buyables[14].completionEffect);
		if (tmp.ec.effect[3]) mult = mult.div(tmp.ec.effect[3]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		if (tmp.t.effect[1]) mult = mult.div(tmp.t.effect[1]);
		if (tmp.co.effect[5]) mult = mult.div(tmp.co.effect[5]);
		return mult;
	},
	effect() {
		let eff1Exp = 1.5;
		if (player.ex.points.gte(9)) eff1Exp += 0.1;
		if (player.w.points.gte(50)) eff1Exp += 0.05;
		if (hasMilestone("r", 16)) eff1Exp += 0.15;
		if (hasMilestone("r", 21)) eff1Exp += 0.15;
		if (hasMilestone("r", 27)) eff1Exp += 0.1;
		if (player.cy.unlocks[0] >= 4) eff1Exp += 0.05;
		if (player.cy.unlocks[0] >= 9) eff1Exp += 0.6;
		let eff2Exp = 1;
		if (hasMilestone("r", 56)) eff2Exp += 0.1;
		if (hasMilestone("r", 69)) eff2Exp += 0.1;
		return [
			(player.t.points.gte(player.cy.unlocks[1] >= 4 ? 6 : 10) ? new Decimal(1.1).pow(player.w.points.mul(eff1Exp)) : player.w.points.pow(eff1Exp).round()),
			(hasMilestone("d", 57) ? player.w.points.div(hasMilestone("d", 64) ? 20 : (hasMilestone("d", 61) ? 22 : (hasMilestone("d", 60) ? 33 : 50))).sub(hasMilestone("d", 58) ? 0 : 1).pow(eff2Exp).floor().max(0) : player.w.points.div(100).pow(eff2Exp).floor()),
		];
	},
	effectDescription() {
		if (player.t.points.gte(player.cy.unlocks[1] >= 4 ? 6 : 10)) return "which are multiplying change gain, change limit, and influence generator production by " + format(tmp.w.effect[0]) + "x and giving " + formatWhole(tmp.w.effect[1]) + " battle enhancements (of which " + formatWhole(tmp.w.effect[1].sub(player.w.spentE)) + " are unspent)";
		if (tmp.w.effect[1].gte(1)) return "which are giving " + formatWhole(tmp.w.effect[0]) + " battles (of which " + formatWhole(tmp.w.effect[0].sub(player.w.spent)) + " are unspent) and giving " + formatWhole(tmp.w.effect[1]) + " battle enhancements (of which " + formatWhole(tmp.w.effect[1].sub(player.w.spentE)) + " are unspent)";
		return "which are giving " + formatWhole(tmp.w.effect[0]) + " battles, of which " + formatWhole(tmp.w.effect[0].sub(player.w.spent)) + " are unspent";
	},
	resetsNothing() {return player.cy.unlocks[2] >= 4},
	autoPrestige() {return player.cy.unlocks[2] >= 4},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "You keep all domination enhancements on war resets.<br><br>After declaring war 1 time, consciousness resets no longer reset anything<br>and you automatically claim potential conscious beings.<br><br>The above extra effects will not go away even if this layer is reset.";
			if (player.w.points.gte(2)) text += "<br><br>After declaring war 3 times, you keep domination enhancements on all resets.";
			if (player.w.points.gte(5)) text += "<br>After declaring war 6 times, you bulk 10x stats from rows 3 and below.";
			if (player.w.points.gte(8)) text += "<br>After declaring war 9 times, the first war effect is improved.";
			return text;
		}],
		"blank",
		["contained-grid", "calc(100% - 34px)"],
		"blank",
		["row", ["respec-button", "master-button"]],
		"blank",
	],
	layerShown() {return challengeCompletions("ec", 11) >= 2 || player.w.unlocked},
	hotkeys: [{
		key: "w",
		description: "W: reset for wars",
		onPress() {if (player.w.unlocked) doReset("w")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("w", keep);
	},
	shouldNotify() {
		for (let row = 1; row <= tmp.w.grid.rows; row++)
			for (let col = 1; col <= tmp.w.grid.cols; col++)
				if (layers.w.grid.getCanClick(getGridData("w", row * 100 + col), row * 100 + col)) return true;
	},
	componentStyles: {
		"contained-grid"() {return {"box-sizing": "border-box", "border": "2px solid #C77055", "padding": "16px"}},
		"gridable"() {return {"width": "120px", "height": "120px", "border-radius": "0px"}},
		"master-button"() {return {"margin-right": "18px"}},
	},
	grid: {
		rows() {
			let size = 3;
			if (hasMilestone("d", 41)) size++;
			if (hasMilestone("r", 13)) size++;
			if (hasMilestone("r", 22)) size++;
			return size;
		},
		cols() {return this.rows()},
		maxRows: warUpgrades.length,
		maxCols: warUpgrades[0].length,
		getStartData(id) {
			if (player && new Decimal(player.t.points).gte(player.cy.unlocks[1] >= 4 ? 6 : 10)) {
				if (new Decimal(player.l.points).gte(player.cy.unlocks[3] >= 4 ? 7 : 20) && typeof id == "number" && getWarUpgradeCostE(id) <= 0) return 2;
				return 1;
			};
			return 0;
		},
		getCanClick(data, id) {
			if (inChallenge("co", 11)) return false;
			if (!(id == 101 || getGridData("w", id - 1) || getGridData("w", id + 1) || getGridData("w", id - 100) || getGridData("w", id + 100))) return false;
			if (data == 1 && Math.floor(id / 100) <= getEnhancableGridSize() && id % 100 <= getEnhancableGridSize()) return tmp.w.effect[1].sub(player.w.spentE).gte(getWarUpgradeCostE(id));
			if (data == 0) return tmp.w.effect[0].sub(player.w.spent).gte(warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1].cost);
			return false;
		},
		onClick(data, id) {
			if (data == 1) player.w.spentE = player.w.spentE.add(getWarUpgradeCostE(id));
			else player.w.spent = player.w.spent.add(warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1].cost);
			player.w.grid[id]++;
		},
		getTitle(data, id) {return warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1].title + (data == 2 ? "+" : "")},
		getDisplay(data, id) {
			if (!(id == 101 || getGridData("w", id - 1) || getGridData("w", id + 1) || getGridData("w", id - 100) || getGridData("w", id + 100))) return "";
			const upg = warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1];
			let desc = (data == 2 && upg.e.desc ? upg.e.desc : upg.desc);
			return (typeof desc == "function" ? desc() : desc) + "<br><br>Cost: " + (data > 0 && Math.floor(id / 100) <= getEnhancableGridSize() && id % 100 <= getEnhancableGridSize() ? formatWhole(getWarUpgradeCostE(id)) + " battle enhancement" + (getWarUpgradeCostE(id) == 1 ? "" : "s") : formatWhole(upg.cost) + " battle" + (upg.cost == 1 ? "" : "s"));
		},
		getEffect(data, id) {
			if (!id) return;
			const upg = warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1];
			let eff = upg.effect;
			if (data == 2 && upg.e.effect) eff = upg.e.effect;
			if (typeof eff == "function") return eff();
			return eff;
		},
		getStyle(data, id) {
			if (data == 2) return {"border-color": "#D69358", "background-color": "#77BF5F", "cursor": "default"};
			if (data == 1) {
				if (this.getCanClick(data, id)) return {"background-color": "#D69358"};
				const size = getEnhancableGridSize();
				if (Math.floor(id / 100) <= size && id % 100 <= size) return {"background-color": "#6C9060"};
				return {"background-color": "#77BF5F", "cursor": "default"};
			};
			if (!(id == 101 || getGridData("w", id - 1) || getGridData("w", id + 1) || getGridData("w", id - 100) || getGridData("w", id + 100))) return {"background-color": "#FFFFFF40"};
		},
	},
	buyables: {
		respec(onlyE = false) {
			if (onlyE || player.t.points.gte(player.cy.unlocks[1] >= 4 ? 6 : 10)) {
				for (const key in player.w.grid)
					if (Object.hasOwnProperty.call(player.w.grid, key))
						player.w.grid[key] = (player.l.points.gte(player.cy.unlocks[3] >= 4 ? 7 : 20) && getWarUpgradeCostE(key) <= 0 ? 2 : 1);
			} else {
				for (const key in player.w.grid)
					if (Object.hasOwnProperty.call(player.w.grid, key))
						player.w.grid[key] = 0;
				player.w.spent = newDecimalZero();
			};
			player.w.spentE = newDecimalZero();
			doReset("w", true, true);
		},
		respecText() {
			if (player.t.points.gte(player.cy.unlocks[1] >= 4 ? 6 : 10)) return "respec enhancements";
			return "respec battles" + (tmp.w.effect[1].gte(1) ? " and enhancements" : "");
		},
	},
	clickables: {
		masterButtonPress() {respecBuyables("w", true)},
		masterButtonText: "respec enhancements",
		showMasterButton() {return tmp.w.effect[1].gte(1) && !player.t.points.gte(player.cy.unlocks[1] >= 4 ? 6 : 10)},
	},
});
