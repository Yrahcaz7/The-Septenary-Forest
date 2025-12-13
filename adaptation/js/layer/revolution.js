function getMaxChange() {
	return tmp.r.effect[3].mul(600).div(player.r.milestones.length + 1);
};

addLayer("r", {
	name: "Revolution",
	symbol: "R",
	position: 1,
	branches: ["sp", "e", "cb"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		change: newDecimalZero(),
	}},
	color: "#EE7770",
	nodeStyle() {if (tmp.r.canReset || player.r.unlocked) return {background: "border-box linear-gradient(to right, #55B020, #EE7770, #B44990)"}},
	resource: "revolutions",
	row: 4,
	baseResource: "evolutions",
	baseAmount() {return player.e.points},
	requires: new Decimal(20000),
	type: "static",
	base() {
		let base = 5;
		if (challengeCompletions("ec", 11) >= 3 && challengeEffect("ec", 11)[2]) base -= challengeEffect("ec", 11)[2];
		if (challengeCompletions("ec", 11) >= 12 && challengeEffect("ec", 11)[11]) base -= challengeEffect("ec", 11)[11];
		if (hasMilestone("r", 47)) base -= milestoneEffect("r", 47);
		if (getGridData("w", 403)) base -= gridEffect("w", 403);
		return base;
	},
	exponent() {return inChallenge("co", 11) ? 2 : 1},
	roundUpCost: true,
	canBuyMax() {return player.l.points.gte(3) || player.cy.unlocked},
	resetDescription: "Revolutionize for ",
	gainMult() {
		let mult = newDecimalOne();
		if (hasMilestone("d", 17)) mult = mult.div(milestoneEffect("d", 17));
		if (getGridData("w", 106)) mult = mult.div(gridEffect("w", 106));
		if (tmp.ec.effect[3]) mult = mult.div(tmp.ec.effect[3]);
		if (tmp.ex.effect[5]) mult = mult.div(tmp.ex.effect[5]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		if (tmp.co.effect[1]) mult = mult.div(tmp.co.effect[1]);
		if (tmp.co.effect[3]) mult = mult.div(tmp.co.effect[3]);
		if (tmp.t.effect[5] && hasMilestone("d", 62)) mult = mult.div(tmp.t.effect[5]);
		return mult;
	},
	directMult() {
		let mult = newDecimalOne();
		if (tmp.cy.effect[1]) mult = mult.mul(tmp.cy.effect[1]);
		return mult;
	},
	effect() {
		let changeEff2exp = 0.5;
		if (hasMilestone("r", 6)) changeEff2exp += 0.78;
		if (hasMilestone("r", 20)) changeEff2exp += 0.72;
		if (hasMilestone("r", 23)) changeEff2exp += 6;
		if (hasMilestone("r", 32)) changeEff2exp += 3;
		if (hasMilestone("r", 36)) changeEff2exp += 9;
		if (hasMilestone("r", 46)) changeEff2exp += 15;
		let changeEff3exp = new Decimal(0.05);
		if (hasMilestone("r", 7)) changeEff3exp = changeEff3exp.add(0.072);
		if (hasMilestone("r", 11)) changeEff3exp = changeEff3exp.add(0.0234);
		if (hasMilestone("r", 32)) changeEff3exp = changeEff3exp.add(99.8546);
		if (hasMilestone("r", 46)) changeEff3exp = changeEff3exp.mul(player.r.change.add(1).log10());
		if (hasMilestone("r", 110)) changeEff3exp = changeEff3exp.mul(2);
		if (hasMilestone("r", 55)) changeEff3exp = changeEff3exp.add(1).pow(2);
		let eff = [
			new Decimal(challengeCompletions("ec", 11) >= 9 ? 10 : 2).pow(player.r.points.pow(hasMilestone("r", 12) ? 1.5 : 1)),
			new Decimal(5).pow(player.r.points),
			player.r.points.div(10).add(1).min(hasMilestone("r", 55) ? 10 : 2),
			player.r.points.pow(2).mul(new Decimal(10).pow(player.r.points.sub(1))).mul((player.r.milestones.length + 1) ** (challengeCompletions("ec", 11) >= 9 ? 5 : 2)),
			new Decimal(10).pow(player.r.change.pow(hasMilestone("r", 11) ? 0.25 : 0.5)),
			(hasMilestone("r", 0) ? (hasMilestone("r", 20) ? player.r.change.add(1).pow(changeEff2exp) : player.r.change.add(1).pow(changeEff2exp).log10().add(1)) : newDecimalOne()),
			(hasMilestone("r", 1) ? (hasMilestone("r", 108) ? player.r.change.add(1).pow(changeEff3exp.pow(0.1).div(10000)) : player.r.change.add(1).pow(changeEff3exp).log10().add(1)) : newDecimalOne()),
			(hasMilestone("r", 4) ? new Decimal(222).pow(player.r.change.pow(0.2)) : newDecimalOne()),
		];
		if (hasMilestone("r", 5)) eff[3] = eff[3].mul(milestoneEffect("r", 5));
		if (hasMilestone("r", 10)) eff[3] = eff[3].mul(milestoneEffect("r", 10));
		if (hasMilestone("r", 38)) eff[3] = eff[3].mul(milestoneEffect("r", 38));
		if (tmp.w.effect[0] && player.t.points.gte(10)) eff[3] = eff[3].mul(tmp.w.effect[0]);
		if (tmp.l.effect[3]) eff[3] = eff[3].mul(tmp.l.effect[3]);
		if (tmp.cy.effect[3]) eff[3] = eff[3].mul(tmp.cy.effect[3]);
		eff[3] = eff[3].pow(buyableEffect("em", 12).add(1));
		if (hasMilestone("r", 11)) {
			if (eff[4].gte("e10000000")) eff[4] = eff[4].div("e10000000").pow(0.1).mul("e10000000");
			if (eff[4].gte("e100000000")) eff[4] = eff[4].div("e100000000").pow(0.1).mul("e100000000");
			if (eff[4].gte("e500000000")) eff[4] = eff[4].div("e500000000").pow(0.05).mul("e500000000");
			if (eff[4].gte("e2e9")) eff[4] = eff[4].div("e2e9").pow(0.2).mul("e2e9");
			if (eff[4].gte("e4e9")) eff[4] = eff[4].div("e4e9").pow(0.4).mul("e4e9");
			if (eff[4].gte("e6e9")) eff[4] = eff[4].div("e6e9").pow(0.6).mul("e6e9");
			if (eff[4].gte("e8e9")) eff[4] = eff[4].div("e8e9").pow(0.8).mul("e8e9");
			if (eff[4].gte("e1e10")) eff[4] = eff[4].div("e1e10").pow(0.01).mul("e1e10");
			if (eff[4].gte("e1.5e10")) eff[4] = eff[4].div("e1.5e10").pow(0.015).mul("e1.5e10");
			if (eff[4].gte("e2e10")) eff[4] = eff[4].div("e2e10").pow(0.02).mul("e2e10");
			if (eff[4].gte("e4e10")) eff[4] = eff[4].div("e4e10").pow(0.04).mul("e4e10");
			if (eff[4].gte("e6e10")) eff[4] = eff[4].div("e6e10").pow(0.06).mul("e6e10");
			if (eff[4].gte("e8e10")) eff[4] = eff[4].div("e8e10").pow(0.08).mul("e8e10");
			if (eff[4].gte("e1e11")) {
				let exp = 1e8;
				if (hasMilestone("r", 32)) exp *= 100;
				if (hasMilestone("r", 46)) exp *= 10;
				if (hasMilestone("r", 81)) exp *= 1000;
				if (hasMilestone("r", 109)) exp *= 10;
				if (hasMilestone("r", 110)) exp *= 10;
				eff[4] = eff[4].div("e1e11").log10().add(1).pow(exp).mul("e1e11");
			};
		} else {
			if (eff[4].gte("1e5555")) eff[4] = eff[4].div("1e5555").pow(0.1).mul("1e5555");
			if (eff[4].gte("1e200000")) eff[4] = eff[4].div("1e200000").log10().add(1).pow(2000).mul("1e200000");
		};
		if (eff[7].gte("1e3333")) eff[7] = eff[7].div("1e3333").pow(1/3).mul("1e3333");
		if (eff[7].gte("1e100000")) eff[7] = eff[7].div("1e100000").pow(0.1).mul("1e100000");
		if (eff[7].gte("e1000000")) eff[7] = eff[7].div("e1000000").pow(0.1).mul("e1000000");
		if (eff[7].gte("e2500000")) eff[7] = eff[7].div("e2500000").pow(0.025).mul("e2500000");
		if (eff[7].gte("e5000000")) eff[7] = eff[7].div("e5000000").pow(0.05).mul("e5000000");
		if (eff[7].gte("e7500000")) eff[7] = eff[7].div("e7500000").pow(0.075).mul("e7500000");
		if (eff[7].gte("e10000000")) {
			let exp = 100000;
			if (hasMilestone("r", 26)) exp *= 10;
			if (hasMilestone("r", 46)) exp *= 2.5;
			if (hasMilestone("r", 109)) exp *= 10;
			eff[7] = eff[7].div("e10000000").log10().add(1).pow(exp).mul("e10000000");
		};
		return eff;
	},
	effectDescription() {return "which are dividing the species requirement by /" + format(tmp.r.effect[0]) + ", dividing conscious being requirement by /" + format(tmp.r.effect[1]) + ", multiplying the completion limit of the 10th retrogression by " + format(tmp.r.effect[2]) + "x (" + (tmp.r.effect[2].gte(hasMilestone("r", 55) ? 10 : 2) ? "maxed" : "rounded down") + "), and generating " + format(tmp.r.effect[3]) + " change per second (with a limit of " + format(getMaxChange()) + ")"},
	resetsNothing() {return player.cy.unlocks[2] >= 2},
	autoPrestige() {return player.cy.unlocks[2] >= 2},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "After revolutionizing 1 time, you can bulk complete the 10th hybridization.<br><br>The above extra effect will not go away even if this layer is reset.";
			if (player.r.points.gte(2)) text += "<br><br>After revolutionizing 3 times, you keep hybridization completions on all resets.";
			if (player.r.points.gte(5)) text += "<br>After revolutionizing 6 times, you keep growth enhancements on all resets.";
			if (player.r.points.gte(8)) text += "<br>After revolutionizing 9 times, you bulk 10x stats from rows 3 and below.";
			text += "<br><br>You have <h2 style='color: #EE7770; text-shadow: #EE7770 0px 0px 10px'>" + format(player.r.change) + "</h2> change, which divides the evolution requirement by /" + format(tmp.r.effect[4]);
			if (hasMilestone("r", 4)) text += ", divides the domination requirement by /" + format(tmp.r.effect[5]) + ", divides the ecosystem requirement by /" + format(tmp.r.effect[6]) + ", and divides the acclimation requirement by /" + format(tmp.r.effect[7]);
			else if (hasMilestone("r", 1)) text += ", divides the domination requirement by /" + format(tmp.r.effect[5]) + " and divides the ecosystem requirement by /" + format(tmp.r.effect[6]);
			else if (hasMilestone("r", 0)) text += " and divides the domination requirement by /" + format(tmp.r.effect[5]);
			return text;
		}],
		"blank",
		"milestones",
		"blank",
	],
	layerShown() {return challengeCompletions("ec", 11) >= 2 || player.r.unlocked},
	hotkeys: [{
		key: "r",
		description: "R: reset for revolutions",
		onPress() {if (player.r.unlocked) doReset("r")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		const keep = [];
		if (hasMilestone("r", 34) && layers[resettingLayer].row == 5) keep.push("milestones", "lastMilestone");
		layerDataReset("r", keep);
	},
	update(diff) {
		if (player.r.change.lt(getMaxChange())) player.r.change = player.r.change.add(tmp.r.effect[3].mul(diff)).min(getMaxChange());
	},
	componentStyles: {
		"prestige-button"() {if (tmp.r.canReset && tmp.r.nodeStyle) return tmp.r.nodeStyle},
	},
	milestones: {
		0: {
			requirement: 10000,
			requirementDescription: "1st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "unlock an additional effect for change<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
		},
		1: {
			requirement: 500000,
			requirementDescription: "2nd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "unlock another additional effect for change<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		2: {
			requirement: 100000000,
			requirementDescription: "3rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "make buying CRA, FER, ANA, and SOV not spend any<br>acclimation points, but multiply their costs by 50<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		3: {
			requirement: 5e9,
			requirementDescription: "4th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "make population amount always set to its maximum<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		4: {
			requirement: 1e11,
			requirementDescription: "5th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "unlock yet another additional effect for change<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		5: {
			requirement: 1e13,
			requirementDescription: "6th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return player.ec.points.add(1)},
			effectDescription(eff) {return "multiply change gain and limit based on ecosystems<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		6: {
			requirement: 1e16,
			requirementDescription: "7th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		7: {
			requirement: 5e17,
			requirementDescription: "8th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the third change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		8: {
			requirement: 1e20,
			requirementDescription: "9th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce influence tickspeed cost by 1 purchase<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		9: {
			requirement: 1e22,
			requirementDescription: "10th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "unlock another influence generator<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		10: {
			requirement: 1e25,
			requirementDescription: "11th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return player.ex.points.add(1).mul(player.w.points.add(1))},
			effectDescription(eff) {return "multiply change gain and limit based on expansion points and wars<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		11: {
			requirement: 5e27,
			requirementDescription: "12th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first and third change effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		12: {
			requirement: 1e31,
			requirementDescription: "13th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first revolution effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		13: {
			requirement: 5e35,
			requirementDescription: "14th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		14: {
			requirement: 1e39,
			requirementDescription: "15th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return (player.l.unlocked ? "effect overriden by leaders" : "unlock more automation for domination") + "<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		15: {
			requirement: 1e44,
			requirementDescription: "16th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "unlock another tier of ANACHRONISM<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.co.unlocked},
		},
		16: {
			requirement: 1e48,
			requirementDescription: "17th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first war effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.co.unlocked},
		},
		17: {
			requirement: 1e52,
			requirementDescription: "18th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.03},
			effectDescription() {return "decrease the war requirement base by 0.03<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.co.unlocked},
		},
		18: {
			requirement: 1e55,
			requirementDescription: "19th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.025},
			effectDescription() {return "decrease the war requirement base by 0.025<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.co.unlocked},
		},
		19: {
			requirement: 1e58,
			requirementDescription: "20th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first ecosystem effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.co.unlocked},
		},
		20: {
			requirement: 1e62,
			requirementDescription: "21st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		21: {
			requirement: 1e67,
			requirementDescription: "22nd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first war effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		22: {
			requirement: 1e73,
			requirementDescription: "23rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		23: {
			requirement: 1e79,
			requirementDescription: "24th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		24: {
			requirement: 1e84,
			requirementDescription: "25th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.025},
			effectDescription() {return "decrease the war requirement base by 0.025<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		25: {
			requirement: 1e90,
			requirementDescription: "26th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.11},
			effectDescription() {return "decrease the domination requirement base by 0.11<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		26: {
			requirement: 1e100,
			requirementDescription: "27th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "weaken the last softcap of the last change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		27: {
			requirement: 1e110,
			requirementDescription: "28th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first war effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		28: {
			requirement: 1e120,
			requirementDescription: "29th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.022},
			effectDescription() {return "decrease the war requirement base by 0.022<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		29: {
			requirement: 1e130,
			requirementDescription: "30th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.1},
			effectDescription() {return "decrease the acclimation requirement base by 0.1<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		30: {
			requirement: 1e140,
			requirementDescription: "31st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last expansion effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		31: {
			requirement: 1e150,
			requirementDescription: "32nd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the enhancable battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		32: {
			requirement: 1e160,
			requirementDescription: "33rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "weaken the last softcap of the first change effect<br>and improve the second and third change effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		33: {
			requirement: 1e170,
			requirementDescription: "34th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the enhancable battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		34: {
			requirement: 1e180,
			requirementDescription: "35th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "keep innovations on row 6 resets<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		35: {
			requirement: 1e190,
			requirementDescription: "36th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the costs of row 2 control nodes<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		36: {
			requirement: 1e200,
			requirementDescription: "37th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		37: {
			requirement: 1e220,
			requirementDescription: "38th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second control effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		38: {
			requirement: 1e240,
			requirementDescription: "39th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return player.co.points.add(1).mul(player.l.points.add(1)).mul(player.t.points.add(1)).pow(6)},
			effectDescription(eff) {return "multiply change gain and limit based on row 6 resources<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		39: {
			requirement: 1e260,
			requirementDescription: "40th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the enhancable battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		40: {
			requirement: 1e280,
			requirementDescription: "41st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the expansion effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		41: {
			requirement: 1e300,
			requirementDescription: "42nd innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.025},
			effectDescription() {return "decrease the territory requirement base by 0.025<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		42: {
			requirement: "1e320",
			requirementDescription: "43rd innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease the leader requirement base by 0.05<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		43: {
			requirement: "1e340",
			requirementDescription: "44th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "the growth requirement scales less while in the <b>Migration</b><br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		44: {
			requirement: "1e360",
			requirementDescription: "45th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the enhancable battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		45: {
			requirement: "1e380",
			requirementDescription: "46th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease the leader requirement base by 0.05<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		46: {
			requirement: "1e400",
			requirementDescription: "47th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the change effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		47: {
			requirement: "1e420",
			requirementDescription: "48th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.0166},
			effectDescription() {return "decrease the revolution requirement base by 0.0166<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		48: {
			requirement: "1e440",
			requirementDescription: "49th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last settler effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		49: {
			requirement: "1e460",
			requirementDescription: "50th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.025},
			effectDescription() {return "decrease the expansion requirement base by 0.025<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		50: {
			requirement: "1e480",
			requirementDescription: "51st innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 10},
			effectDescription() {return "time for influence generators goes ten times faster<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		51: {
			requirement: "1e500",
			requirementDescription: "52nd innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.025},
			effectDescription() {return "decrease the leader requirement base by 0.025<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		52: {
			requirement: "1e525",
			requirementDescription: "53rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second influence effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		53: {
			requirement: "1e550",
			requirementDescription: "54th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the third control effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		54: {
			requirement: "1e575",
			requirementDescription: "55th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.06},
			effectDescription() {return "decrease the leader requirement base by 0.06<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		55: {
			requirement: "1e600",
			requirementDescription: "56th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "increase the maximum of the third revolution effect<br>and improve the third change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		56: {
			requirement: "1e625",
			requirementDescription: "57th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second war effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		57: {
			requirement: "1e650",
			requirementDescription: "58th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "you bulk 10x influence generators<br>(this resets influence generator amounts)<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			onComplete() {
				for (const key in player.ex.buyables) {
					if (key < 20) player.ex.buyables[key] = newDecimalZero();
				};
			},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		58: {
			requirement: "1e675",
			requirementDescription: "59th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.02},
			effectDescription() {return "decrease the war requirement base by 0.02<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		59: {
			requirement: "1e700",
			requirementDescription: "60th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.001},
			effectDescription() {return "decrease the domination requirement base by 0.001<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.em.unlocked},
		},
		60: {
			requirement: "1e750",
			requirementDescription: "61st innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease the ecosystem requirement base by 0.05<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		61: {
			requirement: "1e800",
			requirementDescription: "62nd innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease the leader requirement base by 0.01<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		62: {
			requirement: "1e850",
			requirementDescription: "63rd innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease the war requirement base by 0.01<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		63: {
			requirement: "1e900",
			requirementDescription: "64th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second continent effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		64: {
			requirement: "1e950",
			requirementDescription: "65th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease the war requirement base by 0.01<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		65: {
			requirement: "1e1000",
			requirementDescription: "66th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease the expansion requirement base by 0.05<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		66: {
			requirement: "1e1050",
			requirementDescription: "67th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first two territory effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		67: {
			requirement: "1e1100",
			requirementDescription: "68th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last settler effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		68: {
			requirement: "1e1150",
			requirementDescription: "69th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the maximum of control improvements by 1<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		69: {
			requirement: "1e1200",
			requirementDescription: "70th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second war effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		70: {
			requirement: "1e1250",
			requirementDescription: "71st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last settler effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		71: {
			requirement: "1e1300",
			requirementDescription: "72nd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first settler effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		72: {
			requirement: "1e1350",
			requirementDescription: "73rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "make CRA, FER, ANA, and SOV have no maximum<br>but their cost scales much faster past 1e10<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		73: {
			requirement: "1e1400",
			requirementDescription: "74th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last settler effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		74: {
			requirement: "1e1500",
			requirementDescription: "75th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 10},
			effectDescription() {return "time for cyclical generators goes ten times faster<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		75: {
			requirement: "1e1600",
			requirementDescription: "76th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the maximum of <b>Generator improvement</b> by 1<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		76: {
			requirement: "1e1700",
			requirementDescription: "77th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the requirement scaling of cyclical generators and cores<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		77: {
			requirement: "1e1800",
			requirementDescription: "78th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.0025},
			effectDescription() {return "decrease the war requirement base by 0.0025<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		78: {
			requirement: "1e1900",
			requirementDescription: "79th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.0075},
			effectDescription() {return "decrease the war requirement base by 0.0075<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		79: {
			requirement: "1e2000",
			requirementDescription: "80th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first territory effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		80: {
			requirement: "1e2100",
			requirementDescription: "81st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last conscious being effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		81: {
			requirement: "1e2200",
			requirementDescription: "82nd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first change and influence effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		82: {
			requirement: "1e2300",
			requirementDescription: "83rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first cyclical power effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		83: {
			requirement: "1e2400",
			requirementDescription: "84th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "you bulk 10x <b>Influence empowerment</b><br>(this resets <b>Influence empowerment</b> amount)<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			onComplete() {player.ex.buyables[22] = newDecimalZero()},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		84: {
			requirement: "1e2500",
			requirementDescription: "85th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last settler effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		85: {
			requirement: "1e2600",
			requirementDescription: "86th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "weaken the softcap of the domination focus+ effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		86: {
			requirement: "1e2700",
			requirementDescription: "87th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the maximum of control improvements by 1<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		87: {
			requirement: "1e2800",
			requirementDescription: "88th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "weaken the softcap of the domination focus+ effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		88: {
			requirement: "1e2900",
			requirementDescription: "89th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the cost and/or cost scaling of some control nodes<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		89: {
			requirement: "1e3000",
			requirementDescription: "90th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first control effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		90: {
			requirement: "1e3200",
			requirementDescription: "91st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the cost and/or cost scaling of some control nodes<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		91: {
			requirement: "1e3400",
			requirementDescription: "92nd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "you bulk 10x <b>Influence tickspeed</b><br>(this resets <b>Influence tickspeed</b> amount)<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			onComplete() {player.ex.buyables[21] = newDecimalZero()},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		92: {
			requirement: "1e3600",
			requirementDescription: "93rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last settler effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		93: {
			requirement: "1e3800",
			requirementDescription: "94th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "weaken the softcap of the domination focus+ effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		94: {
			requirement: "1e4000",
			requirementDescription: "95th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "you bulk 10x influence generators<br>(this resets influence generator amounts)<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			onComplete() {
				for (const key in player.ex.buyables) {
					if (key < 20) player.ex.buyables[key] = newDecimalZero();
				};
			},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		95: {
			requirement: "1e4400",
			requirementDescription: "96th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last settler effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		96: {
			requirement: "1e4800",
			requirementDescription: "97th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "you bulk 10x stats from rows 3 and below<br>(this respecs growth and acclimation points)<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			onComplete() {
				layers.g.buyables.respec();
				layers.a.buyables.respec();
			},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		97: {
			requirement: "1e5200",
			requirementDescription: "98th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "you bulk 10x all tiers of <b>Politics</b> and <b>Commitment</b><br>(this resets all <b>Politics</b> and <b>Commitment</b> amounts)<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			onComplete() {
				for (let row = 1; row <= tmp.t.grid.rows; row++) {
					setGridData("t", row * 100 + 2, 0);
					setGridData("t", row * 100 + 4, 0);
				};
			},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		98: {
			requirement: "1e5600",
			requirementDescription: "99th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first two territory effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		99: {
			requirement: "1e6000",
			requirementDescription: "100th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last settler effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		100: {
			requirement: "1e6400",
			requirementDescription: "101st innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease the expansion requirement base by 0.01<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		101: {
			requirement: "1e6800",
			requirementDescription: "102nd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "you bulk 10x stats from rows 3 and below<br>(this respecs growth and acclimation points)<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			onComplete() {
				layers.g.buyables.respec();
				layers.a.buyables.respec();
			},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		102: {
			requirement: "1e7200",
			requirementDescription: "103rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first cyclical power effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		103: {
			requirement: "1e7600",
			requirementDescription: "104th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 10},
			effectDescription() {return "time for cyclical generators goes ten times faster<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		104: {
			requirement: "1e8000",
			requirementDescription: "105th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 10},
			effectDescription() {return "time for control nodes goes ten times faster<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		105: {
			requirement: "1e9000",
			requirementDescription: "106th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first two territory effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		106: {
			requirement: "1e10000",
			requirementDescription: "107th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease row 6 resource requirement bases by 0.01<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		107: {
			requirement: "1e11000",
			requirementDescription: "108th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last settler effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		108: {
			requirement: "1e12000",
			requirementDescription: "109th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the third change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		109: {
			requirement: "1e13000",
			requirementDescription: "110th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first and last change effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		110: {
			requirement: "1e14000",
			requirementDescription: "111th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first and third change effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		111: {
			requirement: "1e15000",
			requirementDescription: "112th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first control effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		112: {
			requirement: "1e17500",
			requirementDescription: "113th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second cyclical power effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		113: {
			requirement: "1e20000",
			requirementDescription: "114th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first two territory effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		114: {
			requirement: "1e22500",
			requirementDescription: "115th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second cyclical power effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		115: {
			requirement: "1e25000",
			requirementDescription: "116th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the third economic sector effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
	},
});
