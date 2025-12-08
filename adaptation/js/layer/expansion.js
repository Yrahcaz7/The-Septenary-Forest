function getUnlockedExpansionGens() {
	let unlocked = 0;
	if (hasMilestone("r", 9)) unlocked += milestoneEffect("r", 9);
	if (getGridData("w", 301)) unlocked += gridEffect("w", 301);
	if (getGridData("w", 303)) unlocked += gridEffect("w", 303);
	if (getGridData("w", 305)) unlocked += gridEffect("w", 305);
	return unlocked;
};

const GENERATOR_COST_BASES = [2, 3, 5, 9, 13, 17, 22, 100, 150];

function getExpansionGenCost(id, amt) {
	if (getGridData("w", 304)) amt = amt.div(getGridData("w", 304) + 1);
	if (id > 11) amt = amt.add(1);
	if (challengeCompletions("ec", 11) >= 8) return amt.mul(GENERATOR_COST_BASES[id - 11]).round();
	return amt.pow_base(GENERATOR_COST_BASES[id - 11]).round();
};

const GENERATOR_IMPROVEMENTS = ["(b + x) * b<sup>2</sup>", "(b + x) * b<sup>3</sup> * 2<sup>b</sup>", "(b + x) * b<sup>5</sup> * 3<sup>b</sup>", "(10b + x) * b<sup>12</sup> * 5<sup>b</sup>", "(b * EX + x) * b<sup>EX</sup> * 10<sup>b</sup>", "(b + x) * b<sup>55</sup> * EX<sup>b</sup>", "(b + x) * b<sup>EX</sup> * EX<sup>6.6b</sup>", "(b + x) * b<sup>EX</sup> * EX<sup>9b</sup>", "(b + x) * b<sup>EX</sup> * EX<sup>10b</sup>", "(b + x) * b<sup>EX</sup> * EX<sup>20b</sup>", "(b + x) * b<sup>EX</sup> * EX<sup>22b</sup>"];

function expansionGenEffect(id, b) {
	let level = getBuyableAmount("ex", 31).toNumber();
	let x = player.ex.extra[id - 11].floor();
	let eff = [
		b.add(x).mul(b.pow(2)),
		b.add(x).mul(b.pow(3)).mul(b.pow_base(2)),
		b.add(x).mul(b.pow(5)).mul(b.pow_base(3)),
		b.mul(10).add(x).mul(b.pow(12)).mul(b.pow_base(5)),
		b.mul(player.ex.points).add(x).mul(b.pow(player.ex.points)).mul(b.pow_base(10)),
		b.add(x).mul(b.pow(55)).mul(b.pow_base(player.ex.points)),
		b.add(x).mul(b.pow(player.ex.points)).mul(b.mul(6.6).pow_base(player.ex.points)),
		b.add(x).mul(b.pow(player.ex.points)).mul(b.mul(9).pow_base(player.ex.points)),
		b.add(x).mul(b.pow(player.ex.points)).mul(b.mul(10).pow_base(player.ex.points)),
		b.add(x).mul(b.pow(player.ex.points)).mul(b.mul(20).pow_base(player.ex.points)),
		b.add(x).mul(b.pow(player.ex.points)).mul(b.mul(22).pow_base(player.ex.points)),
	][level];
	if (hasBuyable("ex", 21)) eff = eff.mul(buyableEffect("ex", 21));
	if (tmp.w.effect[0] && player.t.points.gte(10)) eff = eff.mul(tmp.w.effect[0]);
	if (tmp.l.effect[3]) eff = eff.mul(tmp.l.effect[3]);
	return eff;
};

function expansionGen10Effect() {
	return buyableEffect("ex", 11).pow(0.1);
};

function getExpansionGenBulk() {
	let bulk = 1;
	if (hasMilestone("r", 57)) bulk *= 10;
	if (hasMilestone("r", 94)) bulk *= 10;
	return bulk;
};

addLayer("ex", {
	name: "Expansion",
	symbol: "EX",
	position: 2,
	branches: ["cb", "a", "d"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		influenceUnlocked: false,
		influence: newDecimalZero(),
		extra: [],
		autoIG: false,
		autoTE: false,
		autoGI: false,
	}},
	color: "#B44990",
	nodeStyle() {if (tmp.ex.canReset || player.ex.unlocked) return {background: "border-box linear-gradient(to right, #EE7770, #B44990, #E03330)"}},
	resource: "expansion points",
	row: 4,
	baseResource: "acclimation points",
	baseAmount() {return player.a.points},
	requires: new Decimal(20000),
	type: "static",
	base() {
		let base = 5;
		if (getBuyableAmount("d", 13).gte(tmp.d.buyables[13].purchaseLimit)) base -= tmp.d.buyables[13].completionEffect;
		if (challengeCompletions("ec", 11) >= 6 && challengeEffect("ec", 11)[5]) base -= challengeEffect("ec", 11)[5];
		if (challengeCompletions("ec", 11) >= 27 && challengeEffect("ec", 11)[26]) base -= challengeEffect("ec", 11)[26];
		if (hasMilestone("r", 49)) base -= milestoneEffect("r", 49);
		if (hasMilestone("r", 65)) base -= milestoneEffect("r", 65);
		if (hasMilestone("r", 100)) base -= milestoneEffect("r", 100);
		if (getGridData("w", 405)) base -= gridEffect("w", 405);
		return base;
	},
	exponent() {return inChallenge("co", 11) ? 2 : 1},
	roundUpCost: true,
	canBuyMax() {return player.l.points.gte(3) || player.cy.unlocked},
	resetDescription: "Expand your influence for ",
	gainMult() {
		let mult = newDecimalOne();
		if (getGridData("w", 102)) mult = mult.div(gridEffect("w", 102));
		if (tmp.ec.effect[3]) mult = mult.div(tmp.ec.effect[3]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		if (tmp.t.effect[0]) mult = mult.div(tmp.t.effect[0]);
		if (tmp.t.effect[5]) mult = mult.div(tmp.t.effect[5]);
		return mult;
	},
	directMult() {
		let mult = newDecimalOne();
		if (tmp.em.effect[1]) mult = mult.mul(tmp.em.effect[1]);
		return mult;
	},
	effect() {
		let lastExansionEffExp = 1;
		if (hasMilestone("r", 30)) lastExansionEffExp += 0.75;
		if (hasMilestone("r", 40)) lastExansionEffExp += 0.25;
		let influenceEff2ExpMult = 1;
		if (hasMilestone("r", 52)) influenceEff2ExpMult *= 2;
		let eff = [
			new Decimal(hasMilestone("r", 40) ? 10 : 5).pow(player.ex.points),
			new Decimal(hasMilestone("r", 40) ? 1e10 : 10).pow(player.ex.points),
			player.ex.points.mul(player.ex.points.gte(3) ? 300 : 100).pow(lastExansionEffExp).floor(),
			new Decimal(1e25).pow(player.ex.influence.pow(0.25)),
			(hasMilestone("d", 40) ? player.ex.influence.add(1).pow(0.05 * influenceEff2ExpMult) : player.ex.influence.add(1).log10().add(1).pow((hasMilestone("d", 33) ? 4.255 : 1) * influenceEff2ExpMult)),
			(hasMilestone("d", 34) ? player.ex.influence.add(1).log10().add(1).pow(hasMilestone("d", 35) ? 0.5 : 0.2) : newDecimalOne()),
		];
		if (eff[3].gte("1e11111")) eff[3] = eff[3].div("1e11111").pow(1/9).mul("1e11111");
		if (eff[3].gte("1e22222")) eff[3] = eff[3].div("1e22222").pow(2/9).mul("1e22222");
		if (eff[3].gte("1e33333")) eff[3] = eff[3].div("1e33333").pow(1/3).mul("1e33333");
		if (eff[3].gte("1e44444")) eff[3] = eff[3].div("1e44444").pow(4/9).mul("1e44444");
		if (eff[3].gte("1e55555")) eff[3] = eff[3].div("1e55555").pow(5/9).mul("1e55555");
		if (eff[3].gte("1e66666")) eff[3] = eff[3].div("1e66666").pow(2/3).mul("1e66666");
		if (eff[3].gte("1e77777")) eff[3] = eff[3].div("1e77777").pow(7/9).mul("1e77777");
		if (eff[3].gte("1e88888")) eff[3] = eff[3].div("1e88888").pow(8/9).mul("1e88888");
		if (eff[3].gte("1e200000")) eff[3] = eff[3].div("1e200000").pow(0.0055).mul("1e200000");
		if (eff[3].gte("1e500000")) eff[3] = eff[3].div("1e500000").pow(0.01).mul("1e500000");
		if (eff[3].gte("1e1000000")) eff[3] = eff[3].div("1e1000000").log10().add(1).pow(hasMilestone("r", 81) ? 100000 : 10000).mul("1e1000000");
		if (eff[3].gte("1e5555555") && !hasMilestone("r", 81)) eff[3] = eff[3].div("1e5555555").pow(5/9).mul("1e5555555");
		return eff;
	},
	effectDescription() {return "which are dividing the conscious being requirement by /" + format(tmp.ex.effect[0]) + ", dividing the domination requirement by /" + format(tmp.ex.effect[1]) + ", and giving " + formatWhole(tmp.ex.effect[2]) + " extra CRA, FER, ANA, and SOV"},
	resetsNothing() {return player.cy.unlocks[2] >= 3},
	autoPrestige() {return player.cy.unlocks[2] >= 3},
	tabFormat() {
		let text = "After expanding 1 time, you keep acclimation enhancements on all resets,<br>acclimation resets (without respec) no longer reset anything,<br>and you automatically claim potential acclimation points.<br><br>The above extra effects will not go away even if this layer is reset.";
		if (player.ex.points.gte(2)) text += "<br><br>After expanding 3 times, the last expansion effect is improved.";
		if (player.ex.points.gte(5)) text += "<br>After expanding 6 times, you bulk 10x stats from rows 3 and below.";
		if (player.ex.points.gte(8)) text += "<br>After expanding 9 times, you bulk 10x more stats from rows 3 and below.";
		if (player.ex.influenceUnlocked) {
			text += "<br><br>You have <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + format(player.ex.influence) + "</h2> influence, which divides the acclimation requirement by /" + format(tmp.ex.effect[3]);
			if (hasMilestone("d", 34)) text += ", divides the conscious being and domination requirements by /" + format(tmp.ex.effect[4]) + ", and divides the revolution requirement by /" + format(tmp.ex.effect[5]);
			else text += " and divides the conscious being and domination requirements by /" + format(tmp.ex.effect[4]);
			text += "<br><br>By default, each influence generator maxes out at 100 seconds of production.";
		};
		const arr = [
			"main-display",
			"prestige-button",
			"resource-display",
			["display-text", text],
			"blank",
		];
		if (player.ex.influenceUnlocked) {
			arr.push(["buyables", "2"], "blank");
			for (const key in tmp.ex.buyables) {
				if (key < 20 && tmp.ex.buyables[key].unlocked) {
					arr.push(["buyable", +key], "blank");
				};
			};
			if (getUnlockedExpansionGens() >= 7) {
				let html = "<div style='display: grid'>";
				html += "<button class='buyable tooltipBox locked' style='width: 500px; height: 60px; border-radius: 0px; background-color: #FFFFFF40' id='buyable-ex-20'>";
				html += "<h2><s>10th</s> 1st influence generator</h2><br>";
				html += "<span style='white-space: pre-line'>through the power of 10s, these generators are producing<br>" + format(expansionGen10Effect()) + " 9th influence generators per second</span>";
				html += "</button></div>";
				arr.push(["raw-html", html], "blank");
			};
			if (player.co.unlocked) arr.push(["row", [
				["column", [["display-text", "auto<br>IGs"], ["blank", "10px"], ["toggle", ["ex", "autoIG"]]]],
				["buyables", "3"],
				["column", [["display-text", "auto<br>IT &<br>IE"], ["blank", "10px"], ["toggle", ["ex", "autoTE"]]]],
			]]);
			else arr.push(["buyables", "3"]);
			if (hasMilestone("d", 53)) arr.push(["blank", "10px"], ["toggle", ["ex", "autoGI"]], "blank");
			else arr.push("blank");
		};
		return arr;
	},
	layerShown() {return challengeCompletions("ec", 11) >= 2 || player.ex.unlocked},
	hotkeys: [{
		key: "x",
		description: "X: reset for expansion points",
		onPress() {if (player.ex.unlocked) doReset("ex")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		const keep = ["autoIG", "autoTE", "autoGI"];
		layerDataReset("ex", keep);
		for (const key in layers.ex.buyables) {
			if (key < 20) player.ex.extra[key - 11] = newDecimalZero();
		};
	},
	update(diff) {
		if (challengeCompletions("ec", 11) >= 7 && !player.ex.influenceUnlocked) player.ex.influenceUnlocked = true;
		if (player.ex.influenceUnlocked) {
			diff *= buyableEffect("ex", 31);
			if (hasMilestone("r", 50)) diff *= milestoneEffect("r", 50);
			for (const key in layers.ex.buyables) {
				if (key < 20 && hasBuyable("ex", key) && tmp.ex.buyables[key].unlocked) {
					let eff = buyableEffect("ex", key);
					if (key == 11) {
						eff = eff.pow(buyableEffect("em", 13).add(1));
						if (player.ex.influence.lt(eff.mul(100))) {
							player.ex.influence = player.ex.influence.add(eff.mul(diff)).min(eff.mul(100));
						};
					} else {
						if (player.ex.extra[key - 12].lt(eff.mul(100))) {
							player.ex.extra[key - 12] = player.ex.extra[key - 12].add(eff.mul(diff)).min(eff.mul(100));
						};
					};
				};
			};
			if (getUnlockedExpansionGens() >= 7) {
				const eff = expansionGen10Effect();
				if (player.ex.extra[8].lt(eff.mul(100))) {
					player.ex.extra[8] = player.ex.extra[8].add(eff.mul(diff)).min(eff.mul(100));
				};
			};
		};
	},
	automate() {
		if (player.co.unlocked && player.ex.autoIG) {
			for (const key in tmp.ex.buyables) {
				if (key < 20) buyBuyable("ex", key);
			};
		};
		if (player.co.unlocked && player.ex.autoTE) {
			buyBuyable("ex", 21);
			buyBuyable("ex", 22);
		};
		if (hasMilestone("d", 53) && player.ex.autoGI) {
			buyBuyable("ex", 31);
		};
	},
	shouldNotify() {
		if (player.ex.influenceUnlocked) {
			for (const key in tmp.ex.buyables) {
				if (tmp.ex.buyables[key]?.canBuy) return true;
			};
		};
	},
	componentStyles: {
		"prestige-button"() {if (tmp.ex.canReset && tmp.ex.nodeStyle) return tmp.ex.nodeStyle},
		"buyable"() {return {width: "500px", height: "60px", "border-radius": 0}},
	},
	buyables: {
		11: {
			cost(amt) {return getExpansionGenCost(this.id, amt)},
			effect(amt) {return expansionGenEffect(this.id, amt)},
			title: "1st influence generator",
			display() {
				const g = tmp[this.layer].buyables[this.id];
				return "these generators are producing " + format(g.effect) + " influence per second<br><br><div style='display: flex'><div>Req: " + formatWhole(g.cost) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>";
			},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, getExpansionGenBulk())},
			style() {if (tmp[this.layer].buyables[this.id].canBuy) return tmp.ex.nodeStyle},
		},
		12: {
			cost(amt) {return getExpansionGenCost(this.id, amt)},
			effect(amt) {return expansionGenEffect(this.id, amt)},
			title: "2nd influence generator",
			display() {
				const g = tmp[this.layer].buyables[this.id];
				return "these generators are producing " + format(g.effect) + " 1st influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(g.cost) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>";
			},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, getExpansionGenBulk())},
			style() {if (tmp[this.layer].buyables[this.id].canBuy) return tmp.ex.nodeStyle},
		},
		13: {
			cost(amt) {return getExpansionGenCost(this.id, amt)},
			effect(amt) {return expansionGenEffect(this.id, amt)},
			title: "3rd influence generator",
			display() {
				const g = tmp[this.layer].buyables[this.id];
				return "these generators are producing " + format(g.effect) + " 2nd influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(g.cost) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>";
			},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, getExpansionGenBulk())},
			style() {if (tmp[this.layer].buyables[this.id].canBuy) return tmp.ex.nodeStyle},
		},
		14: {
			cost(amt) {return getExpansionGenCost(this.id, amt)},
			effect(amt) {return expansionGenEffect(this.id, amt)},
			title: "4th influence generator",
			display() {
				const g = tmp[this.layer].buyables[this.id];
				return "these generators are producing " + format(g.effect) + " 3rd influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(g.cost) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>";
			},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, getExpansionGenBulk())},
			style() {if (tmp[this.layer].buyables[this.id].canBuy) return tmp.ex.nodeStyle},
			unlocked() {return getUnlockedExpansionGens() >= 1},
		},
		15: {
			cost(amt) {return getExpansionGenCost(this.id, amt)},
			effect(amt) {return expansionGenEffect(this.id, amt)},
			title: "5th influence generator",
			display() {
				const g = tmp[this.layer].buyables[this.id];
				return "these generators are producing " + format(g.effect) + " 4th influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(g.cost) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>";
			},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, getExpansionGenBulk())},
			style() {if (tmp[this.layer].buyables[this.id].canBuy) return tmp.ex.nodeStyle},
			unlocked() {return getUnlockedExpansionGens() >= 2},
		},
		16: {
			cost(amt) {return getExpansionGenCost(this.id, amt)},
			effect(amt) {return expansionGenEffect(this.id, amt)},
			title: "6th influence generator",
			display() {
				const g = tmp[this.layer].buyables[this.id];
				return "these generators are producing " + format(g.effect) + " 5th influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(g.cost) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>";
			},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, getExpansionGenBulk())},
			style() {if (tmp[this.layer].buyables[this.id].canBuy) return tmp.ex.nodeStyle},
			unlocked() {return getUnlockedExpansionGens() >= 3},
		},
		17: {
			cost(amt) {return getExpansionGenCost(this.id, amt)},
			effect(amt) {return expansionGenEffect(this.id, amt)},
			title: "7th influence generator",
			display() {
				const g = tmp[this.layer].buyables[this.id];
				return "these generators are producing " + format(g.effect) + " 6th influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(g.cost) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>";
			},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, getExpansionGenBulk())},
			style() {if (tmp[this.layer].buyables[this.id].canBuy) return tmp.ex.nodeStyle},
			unlocked() {return getUnlockedExpansionGens() >= 4},
		},
		18: {
			cost(amt) {return getExpansionGenCost(this.id, amt)},
			effect(amt) {return expansionGenEffect(this.id, amt)},
			title: "8th influence generator",
			display() {
				const g = tmp[this.layer].buyables[this.id];
				return "these generators are producing " + format(g.effect) + " 7th influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(g.cost) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>";
			},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, getExpansionGenBulk())},
			style() {if (tmp[this.layer].buyables[this.id].canBuy) return tmp.ex.nodeStyle},
			unlocked() {return getUnlockedExpansionGens() >= 5},
		},
		19: {
			cost(amt) {return getExpansionGenCost(this.id, amt)},
			effect(amt) {return expansionGenEffect(this.id, amt)},
			title: "9th influence generator",
			display() {
				const g = tmp[this.layer].buyables[this.id];
				return "these generators are producing " + format(g.effect) + " 8th influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(g.cost) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>";
			},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, getExpansionGenBulk())},
			style() {if (tmp[this.layer].buyables[this.id].canBuy) return tmp.ex.nodeStyle},
			unlocked() {return getUnlockedExpansionGens() >= 6},
		},
		21: {
			cost(amt) {
				if (!hasMilestone("r", 8)) amt = amt.add(1);
				let exp = 2;
				if (challengeCompletions("ec", 11) >= 8) exp -= 0.5;
				if (getGridData("w", 306) >= 1) exp -= 0.025;
				if (getGridData("w", 306) >= 2) exp -= 0.005;
				return amt.pow(exp).pow_base(10);
			},
			effectBase() {
				let base = new Decimal(2);
				base = base.add(buyableEffect("ex", 22));
				if (tmp.cy.effect[4]) base = base.add(tmp.cy.effect[4]);
				return base;
			},
			effect(amt) {return amt.add(this.extra()).pow_base(this.effectBase())},
			title: "Influence tickspeed",
			display() {
				const IT = tmp[this.layer].buyables[this.id];
				return "all generators produce " + format(IT.effectBase) + " times as much<br><br>Effect: " + format(IT.effect) + "x<br><br>Cost: " + format(IT.cost) + " influence<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (IT.extra.eq(0) ? "" : " + " + formatWhole(IT.extra));
			},
			canAfford() {return player.ex.influenceUnlocked && player.ex.influence.gte(this.cost())},
			buy() {
				player.ex.influence = player.ex.influence.sub(this.cost());
				let bulk = 1;
				if (hasMilestone("r", 91)) bulk *= 10;
				if (player.cy.unlocks[0] >= 5) bulk *= 10;
				if (player.cy.unlocks[3] >= 2) bulk *= 10;
				addBuyables(this.layer, this.id, bulk);
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("d", 42)) extra = extra.add(milestoneEffect("d", 42));
				return extra;
			},
			style() {
				let obj = {width: "250px", height: "100px", "border-radius": "25px"};
				if (tmp[this.layer].buyables[this.id].canBuy) obj.background = tmp.ex.nodeStyle.background;
				return obj;
			},
		},
		22: {
			cost(amt) {return amt.add(1).pow(getGridData("w", 302) ? gridEffect("w", 302) : 2).pow_base(1e12)},
			effectBase() {return 0.5},
			effect(amt) {return amt.mul(this.effectBase())},
			title: "Influence empowerment",
			display() {
				const IE = tmp[this.layer].buyables[this.id];
				return "each tickspeed gives " + format(IE.effectBase) + " more multiplier<br><br>Effect: +" + format(IE.effect) + "<br><br>Cost: " + format(IE.cost) + " influence<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() {return player.ex.influenceUnlocked && player.ex.influence.gte(this.cost())},
			buy() {
				player.ex.influence = player.ex.influence.sub(this.cost());
				let bulk = 1;
				if (hasMilestone("r", 83)) bulk *= 10;
				if (player.cy.unlocks[1] >= 6) bulk *= 10;
				addBuyables(this.layer, this.id, bulk);
			},
			style() {
				let obj = {width: "250px", height: "100px", "border-radius": "25px"};
				if (tmp[this.layer].buyables[this.id].canBuy) obj.background = tmp.ex.nodeStyle.background;
				return obj;
			},
		},
		31: {
			cost(amt) {return new Decimal([7.7e77, 1.11e111, 2.02e202, "3.45e345", "6.6e660", "1.055e1055", "2.211e2211", "5e5000", "9e9000", "e1000000"][amt] || Infinity)},
			effect(amt) {return amt.toNumber() + 1},
			title: "Generator improvement",
			display() {
				const GI = tmp[this.layer].buyables[this.id];
				const amt = getBuyableAmount(this.layer, this.id).toNumber();
				if (GENERATOR_IMPROVEMENTS[amt + 1]) return "improve the generator formulas and time for generators goes faster, but reset influence and all non-bought generators<br><br>Next: " + GENERATOR_IMPROVEMENTS[amt] + " --> " + GENERATOR_IMPROVEMENTS[amt + 1] + " and " + formatWhole(GI.effect) + "x --> " + formatWhole(GI.effect + 1) + "x<br><br>Cost: " + format(GI.cost) + " influence<br><br>Bought: " + formatWhole(amt) + "/" + formatWhole(GI.purchaseLimit);
				return "improve the generator formulas and time for generators goes faster, but reset influence and all non-bought generators<br><br>Effects: " + GENERATOR_IMPROVEMENTS[0] + " --> " + GENERATOR_IMPROVEMENTS[amt] + " and 1x --> " + formatWhole(GI.effect) + "x<br><br>Bought: " + formatWhole(amt) + "/" + formatWhole(GI.purchaseLimit);
			},
			purchaseLimit() {
				let limit = 9;
				if (hasMilestone("r", 75)) limit += milestoneEffect("r", 75);
				return limit;
			},
			canAfford() {return player.ex.influenceUnlocked && player.ex.influence.gte(this.cost())},
			buy() {
				player.ex.influence = newDecimalZero();
				for (const key in layers.ex.buyables) {
					if (key < 20) player.ex.extra[key - 11] = newDecimalZero();
				};
				addBuyables(this.layer, this.id, 1);
			},
			style() {
				let obj = {width: "400px", height: "110px", "border-radius": "25px"};
				if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit())) obj["border-color"] = "#B44990";
				else if (tmp[this.layer].buyables[this.id].canBuy) obj.background = tmp.ex.nodeStyle.background;
				return obj;
			},
		},
	},
});
