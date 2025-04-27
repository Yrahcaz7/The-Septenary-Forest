const controlNodeName = ["Assimilation", "Politics", "Leadership", "Commitment", "Capacity", "Structure"];

const controlNodeReq = [[
	(x = 0) => Math.max(x + (hasMilestone("r", 90) ? 0 : 3) - getBuyableAmount("t", 13).toNumber(), 0),
	(x = 0) => new Decimal(10).pow(x ** buyableEffect("t", 12)),
	(x = 0) => Math.max(x + (hasMilestone("r", 90) ? 6 : 11) - getBuyableAmount("t", 13).toNumber(), 0),
	(x = 0) => (4 * (x ** buyableEffect("t", 12)) + 7) * 11,
	(x = 0) => Math.max(x + (hasMilestone("r", 90) ? 6 : 11) - getBuyableAmount("t", 13).toNumber(), 0),
	(x = 0) => (x ** buyableEffect("t", 12) + 3) * (hasMilestone("r", 88) ? 600 : 1000),
], [
	(x = 0) => Math.max(x + (hasMilestone("r", 35) ? 1 : 2) - getBuyableAmount("t", 13).toNumber(), 0) * 2,
	(x = 0) => new Decimal(hasMilestone("r", 35) ? 1e7 : 5e7).pow(x ** buyableEffect("t", 12) + 1),
	(x = 0) => Math.max(x + (hasMilestone("r", 35) ? (hasMilestone("r", 90) ? 4 : 7) : 8) - getBuyableAmount("t", 13).toNumber(), 0) * 2,
	(x = 0) => (x ** buyableEffect("t", 12) + (hasMilestone("r", 35) ? 4 : 5)) * 50,
	(x = 0) => Math.max(x + (hasMilestone("r", 35) ? (hasMilestone("r", 90) ? 3 : 6) : 7) - getBuyableAmount("t", 13).toNumber(), 0) * 2,
	(x = 0) => (x ** buyableEffect("t", 12) + (hasMilestone("r", 35) ? 4 : 5)) * (hasMilestone("r", 88) ? 750 : 1000),
], [
	(x = 0) => Math.max(x + (hasMilestone("r", 88) ? 1 : 2) - getBuyableAmount("t", 13).toNumber(), 0) * 5,
	(x = 0) => new Decimal(1e50).pow(x ** buyableEffect("t", 12) + 1),
	(x = 0) => Math.max(x + (hasMilestone("r", 88) ? 2 : 3) - getBuyableAmount("t", 13).toNumber(), 0) * 5,
	(x = 0) => (x ** buyableEffect("t", 12) + 2) * 100,
	(x = 0) => Math.max(x + 2 - getBuyableAmount("t", 13).toNumber(), 0) * 5,
	(x = 0) => (x ** buyableEffect("t", 12) + 6) * 1000,
], [
	(x = 0) => Math.max(x + (hasMilestone("r", 88) ? 3 : 4) - getBuyableAmount("t", 13).toNumber(), 0) * 8,
	(x = 0) => new Decimal(1e200).pow(x ** buyableEffect("t", 12) + 1),
	(x = 0) => Math.max(x + (hasMilestone("r", 88) ? 4 : 5) - getBuyableAmount("t", 13).toNumber(), 0) * 8,
	(x = 0) => (x ** buyableEffect("t", 12) + 2) * 150,
	(x = 0) => Math.max(x + (hasMilestone("r", 88) ? 4 : 5) - getBuyableAmount("t", 13).toNumber(), 0) * 8,
	(x = 0) => (x ** buyableEffect("t", 12) + 4) * 2000,
], [
	(x = 0) => Math.max(x + 5 - getBuyableAmount("t", 13).toNumber(), 0) * 12,
	(x = 0) => new Decimal("1e500").pow(x ** buyableEffect("t", 12) + 1),
	(x = 0) => Math.max(x + 6 - getBuyableAmount("t", 13).toNumber(), 0) * 12,
	(x = 0) => (x ** buyableEffect("t", 12) + 4) * 250,
	(x = 0) => Math.max(x + 6 - getBuyableAmount("t", 13).toNumber(), 0) * 12,
	(x = 0) => (x ** buyableEffect("t", 12) + 5) * 5000,
], [
	(x = 0) => Math.max(x + 6 - getBuyableAmount("t", 13).toNumber(), 0) * 16,
	(x = 0) => new Decimal(hasMilestone("r", 88) ? "1e2000" : "1e5000").pow(x ** buyableEffect("t", 12) + 1),
	(x = 0) => Math.max(x + 7 - getBuyableAmount("t", 13).toNumber(), 0) * 16,
	(x = 0) => (x ** buyableEffect("t", 12) + 5) * 2000,
	(x = 0) => Math.max(x + 7 - getBuyableAmount("t", 13).toNumber(), 0) * 16,
	(x = 0) => (x ** buyableEffect("t", 12) + (hasMilestone("r", 90) ? 3 : 4)) * 20000,
]];

function getControlNodeTimeSpeed() {
	let timeSpeed = 1;
	if (hasMilestone("d", 54)) timeSpeed *= milestoneEffect("d", 54);
	if (hasMilestone("r", 104)) timeSpeed *= milestoneEffect("r", 104);
	return timeSpeed;
}

function getAutoControlTiers() {
	let autoTiers = 0;
	if (player.cy.unlocks[3] >= 1) autoTiers++;
	if (player.cy.unlocks[3] >= 3) autoTiers++;
	if (player.cy.unlocks[3] >= 5) autoTiers++;
	if (player.cy.unlocks[3] >= 7) autoTiers++;
	if (player.cy.unlocks[3] >= 9) autoTiers++;
	if (player.cy.unlocks[3] >= 11) autoTiers++;
	return autoTiers;
};

function getControlImprovementLimit(limit) {
	if (hasMilestone("r", 68)) limit += milestoneEffect("r", 68);
	if (hasMilestone("r", 86)) limit += milestoneEffect("r", 86);
	return limit;
};

addLayer("t", {
	name: "Territory",
	symbol: "T",
	position: 2,
	branches: ["ex", "d", "w"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		controlUnlocked: false,
		control: newDecimalZero(),
		extra: {},
	}},
	color: "#E03330",
	nodeStyle() {if (tmp.t.canReset || player.t.unlocked) return {background: "border-box linear-gradient(to right, #EE7770, #E03330, #C77055)"}},
	resource: "territories",
	row: 5,
	baseResource: "domination points",
	baseAmount() {return player.d.points},
	requires: new Decimal(100000),
	type: "static",
	base() {
		let base = 1.5;
		if (challengeCompletions("ec", 11) >= 24 && challengeEffect("ec", 11)[23]) base -= challengeEffect("ec", 11)[23];
		if (hasMilestone("r", 41)) base -= milestoneEffect("r", 41);
		if (hasMilestone("r", 106)) base -= milestoneEffect("r", 106);
		return base;
	},
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return player.cy.unlocked},
	resetDescription: "Subjugate for ",
	gainMult() {
		let mult = newDecimalOne();
		return mult;
	},
	effect() {
		let amt = player.t.points;
		if (tmp.em.effect[0] && player.cy.unlocks[3] >= 8) amt = amt.add(tmp.em.effect[0]);
		let territoryEff1Base = 10;
		if (hasMilestone("r", 66)) territoryEff1Base++;
		if (hasMilestone("r", 79)) territoryEff1Base++;
		if (hasMilestone("r", 98)) territoryEff1Base += 6;
		if (hasMilestone("r", 105)) territoryEff1Base += 30;
		if (hasMilestone("r", 113)) territoryEff1Base += 50;
		if (player.cy.unlocks[2] >= 5) territoryEff1Base += 2;
		let territoryEff2Base = 5;
		if (hasMilestone("r", 66)) territoryEff2Base += 5;
		if (hasMilestone("r", 98)) territoryEff2Base += 20;
		if (hasMilestone("r", 105)) territoryEff2Base += 70;
		if (hasMilestone("r", 113)) territoryEff2Base += 150;
		let controlEff1Exp = 0.1;
		if (hasMilestone("r", 89)) controlEff1Exp += 0.01;
		if (hasMilestone("r", 111)) controlEff1Exp += 0.005;
		if (getBuyableAmount("t", 11).gte(1)) controlEff1Exp += 0.18;
		let controlEff2Exp = 0.1;
		if (hasMilestone("r", 37)) controlEff2Exp += 0.1;
		if (getBuyableAmount("t", 12).gte(2)) controlEff2Exp += 0.01;
		let controlEff3Exp = 1;
		if (hasMilestone("r", 53)) controlEff3Exp++;
		if (getBuyableAmount("t", 13).gte(3)) controlEff3Exp += 0.5;
		let eff = [
			new Decimal(territoryEff1Base).pow(amt),
			new Decimal(territoryEff2Base).pow(amt),
			amt.div(4).add(1),
			player.t.control.add(1).log10().add(1).pow(controlEff1Exp),
			(hasMilestone("d", 56) ? player.t.control.add(1).log10().div(10).add(1).pow(controlEff2Exp) : newDecimalOne()),
			(hasMilestone("d", 60) ? player.t.control.add(1).log10().add(1).pow(controlEff3Exp) : newDecimalOne()),
		];
		if (eff[3].gt(1.42) && !getBuyableAmount("t", 11).gte(1)) eff[3] = eff[3].sub(1.42).div(10).add(1.42);
		return eff;
	},
	effectDescription() {return "which are dividing the expansion requirement by /" + format(tmp.t.effect[0]) + ", dividing the war requirement by /" + format(tmp.t.effect[1]) + ", and directly multiplying domination point gain by " + format(tmp.t.effect[2]) + "x"},
	tabFormat() {
		let text = "You keep domination enhancements on continent resets.<br><br>After subjugating 1 time, you bulk 10x stats from rows 3 and below.<br><br>The above extra effect will not go away even if this layer is reset.";
		if (player.cy.unlocks[1] >= 4 && player.t.points.gte(5)) text += "<br><br>After subjugating 6 times, the first war effect is changed<br>and you always have everything that costs battles.";
		else if (player.t.points.gte(9)) text += "<br><br>After subjugating 10 times, the first war effect is changed<br>and you always have everything that costs battles.";
		if (player.t.controlUnlocked) {
			text += "<br><br>You have <h2 style='color: #E03330; text-shadow: #E03330 0px 0px 10px'>" + format(player.t.control) + "</h2> control, which directly multiplies acclimation point gain by " + format(tmp.t.effect[3]) + "x";
			if (hasMilestone("d", 62)) text += "; directly multiplies domination point gain by " + format(tmp.t.effect[4]) + "x; and divides the ecosystem, revolution, and expansion requirements by /" + format(tmp.t.effect[5]);
			else if (hasMilestone("d", 60)) text += ", directly multiplies domination point gain by " + format(tmp.t.effect[4]) + "x, and divides the expansion requirement by /" + format(tmp.t.effect[5]);
			else if (hasMilestone("d", 56)) text += " and directly multiplies domination point gain by " + format(tmp.t.effect[4]) + "x";
			text += "<br><br>If two control nodes generate the same thing, the generation is (gen1 + 1)(gen2 + 1).<br>By default, each control node maxes out at 100 seconds of production.";
		};
		let arr = [
			"main-display",
			"prestige-button",
			"resource-display",
			["display-text", text],
			"blank",
		];
		if (player.t.controlUnlocked) arr.push(["contained-grid", "calc(100% - 34px)"], "blank", "buyables", "blank");
		return arr;
	},
	layerShown() {return challengeCompletions("ec", 11) >= 16 || player.t.unlocked},
	hotkeys: [{
		key: "t",
		description: "T: reset for territories",
		onPress() {if (player.t.unlocked) doReset("t")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		const keep = [];
		layerDataReset("t", keep);
	},
	update(diff) {
		if (challengeCompletions("ec", 11) >= 18 && !player.t.controlUnlocked) player.t.controlUnlocked = true;
		if (player.t.controlUnlocked) {
			diff *= getControlNodeTimeSpeed();
			player.t.control = player.t.control.add(gridEffect("t", 101).mul(diff)).min(gridEffect("t", 101).mul(100));
			for (let row = 1; row <= tmp.t.grid.rows; row++) {
				for (let col = 1; col <= tmp.t.grid.cols; col++) {
					const id = row * 100 + col;
					let eff = newDecimalZero();
					if (getGridData("t", id + 1) && getGridData("t", id + 100)) eff = gridEffect("t", id + 1).add(1).mul(gridEffect("t", id + 100).add(1));
					else if (getGridData("t", id + 1)) eff = gridEffect("t", id + 1);
					else if (getGridData("t", id + 100)) eff = gridEffect("t", id + 100);
					if (eff) player.t.extra[id] = player.t.extra[id].add(eff.mul(diff)).min(eff.mul(100));
				};
			};
		};
	},
	automate() {
		for (let row = 1; row <= getAutoControlTiers() && row <= tmp.t.grid.rows; row++) {
			for (let col = 1; col <= tmp.t.grid.cols; col++) {
				const id = row * 100 + col;
				if (layers.t.grid.getCanClick(getGridData("t", id), id)) {
					layers.t.grid.onClick(getGridData("t", id), id);
				};
			};
		};
	},
	shouldNotify() {
		if (player.t.controlUnlocked) {
			for (let row = 1; row <= tmp.t.grid.rows; row++) {
				for (let col = 1; col <= tmp.t.grid.cols; col++) {
					if (layers.t.grid.getCanClick(getGridData("t", row * 100 + col), row * 100 + col)) return true;
				};
			};
			for (const key in tmp.t.buyables) {
				if (tmp.t.buyables[key]?.canBuy) return true;
			};
		};
	},
	componentStyles: {
		"prestige-button"() {if (tmp.t.canReset && tmp.t.nodeStyle) return tmp.t.nodeStyle},
		"contained-grid"() {return {"box-sizing": "border-box", border: "2px solid #E03330", padding: "16px"}},
		"gridable"() {return {width: "120px", height: "120px", "border-radius": "0px"}},
	},
	grid: {
		rows() {return 2 + getBuyableAmount("t", 11).toNumber()},
		maxRows: controlNodeReq.length,
		cols: controlNodeReq[0].length,
		getStartData(id) {return 0},
		getCanClick(data, id) {
			if (id % 100 == 6) return player.co.settlers.gte(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data));
			if (id % 100 == 5) return player.co.points.gte(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data));
			if (id % 100 == 4) return tmp.l.effect[4] >= controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data);
			if (id % 100 == 3) return player.l.points.gte(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data));
			if (id % 100 == 2) return player.t.control.gte(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data));
			if (id % 100 == 1) return player.t.points.gte(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data));
			return false;
		},
		onClick(data, id) {
			let bulk = 1;
			if (hasMilestone("r", 97) && (id % 100 == 2 || id % 100 == 4)) bulk *= 10;
			if (player.cy.unlocks[3] >= 10 && (id == 102 || id == 202)) bulk *= 10;
			player.t.grid[id] += bulk;
		},
		onHold(data, id) {this.onClick(data, id)},
		getTitle(data, id) {return controlNodeName[id % 100 - 1] + "<sup>" + Math.floor(id / 100) + "</sup>"},
		getDisplay(data, id) {
			let text = "producing " + format(gridEffect("t", id)) + " ";
			if (id == 101) text += "control";
			else if (id < 200) text += "of left node";
			else if (id % 100 <= 1) text += "of above node";
			else text += "of above and left nodes";
			text += " per second<br><br>Req: " + formatWhole(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data)) + " ";
			if (id % 100 == 6) text += "settlers";
			else if (id % 100 == 5) text += "continents";
			else if (id % 100 == 4) text += "focus+ points";
			else if (id % 100 == 3) text += "leaders";
			else if (id % 100 == 2) text += "control";
			else if (id % 100 == 1) text += "territories";
			else text += "???";
			text += "<br><br>Bought: " + formatWhole(data) + (player.t.extra[id].gte(1) ? " + " + formatWhole(player.t.extra[id].floor()) : "");
			return text;
		},
		getEffect(data, id) {
			if (data < 1) return newDecimalZero();
			return player.t.extra[id].floor().add(data).mul(new Decimal(10).pow(data - 1));
		},
		getUnlocked(id) {return player.t.controlUnlocked},
	},
	buyables: {
		11: {
			cost() {return [1e80, "1e498", "1e1920", "1e11777"][getBuyableAmount(this.layer, this.id).toNumber()] || Infinity},
			title: "Greater Control",
			display() {return "unlock another tier of control nodes<br><br>on first buy, also improves the first control effect" + (getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) ? "<br><br>Cost: " + format(this.cost()) + " control" : "") + "<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + this.purchaseLimit()},
			purchaseLimit() {return getControlImprovementLimit(2)},
			canAfford() {return player.t.control.gte(this.cost())},
			buy() {
				player.t.control = player.t.control.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit())) return {"border-color": "#E03330"}},
		},
		12: {
			cost() {return [1e136, 1e207, 1e280, "1e2211", "1e10899"][getBuyableAmount(this.layer, this.id).toNumber()] || Infinity},
			title: "Cheaper Policies",
			display() {return "reduce the cost scaling of all tiers of <b>Politics</b>, <b>Commitment</b>, and <b>Structure</b><br><br>on second buy, also improves the second control effect" + (getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) ? "<br><br>Cost: " + format(this.cost()) + " control" : "") + "<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + this.purchaseLimit()},
			effect() {
				let amt = getBuyableAmount(this.layer, this.id).toNumber();
				if (amt >= 4) amt = (amt - 4) / 8 + 4;
				return 1 / (1.5 ** amt) + 1;
			},
			purchaseLimit() {return getControlImprovementLimit(3)},
			canAfford() {return player.t.control.gte(this.cost())},
			buy() {
				player.t.control = player.t.control.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit())) return {"border-color": "#E03330"}},
		},
		13: {
			cost() {return ["1e346", "1e400", "1e447", "1e548", "1e2000", "1e10000"][getBuyableAmount(this.layer, this.id).toNumber()] || Infinity},
			title: "Propaganda Waves",
			display() {return "reduce the cost of all tiers of <b>Assimilation</b>, <b>Leadership</b>, and <b>Capacity</b><br><br>on third buy, also improves the third control effect" + (getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) ? "<br><br>Cost: " + format(this.cost()) + " control" : "") + "<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + this.purchaseLimit()},
			effect() {return getBuyableAmount(this.layer, this.id).toNumber()},
			purchaseLimit() {return getControlImprovementLimit(4)},
			canAfford() {return player.t.control.gte(this.cost())},
			buy() {
				player.t.control = player.t.control.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit())) return {"border-color": "#E03330"}},
		},
	},
});
