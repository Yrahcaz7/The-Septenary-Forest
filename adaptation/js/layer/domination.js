function getDominationExtraStats(extra) {
	if (hasMilestone("d", 37)) extra = extra.add(milestoneEffect("d", 37));
	if (getGridData("w", 501)) extra = extra.add(gridEffect("w", 501));
	if (getGridData("w", 503)) extra = extra.add(gridEffect("w", 503));
	if (getGridData("w", 505)) extra = extra.add(gridEffect("w", 505));
	if (player.l.focusUnlocked) extra = extra.add(clickableEffect("l", 12));
	if (tmp.em.effect[4]) extra = extra.pow(tmp.em.effect[4]);
	return extra.floor();
};

addLayer("d", {
	name: "Domination",
	symbol: "D",
	position: 2,
	branches: ["a"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		spent: newDecimalZero(),
		unlocks: [],
		autoFOC: false,
		autoSPE: false,
		autoCLI: false,
		autoDOM: false,
	}},
	color: "#E03330",
	resource: "domination points",
	row: 3,
	baseResource: "acclimation points",
	baseAmount() {return player.a.points},
	requires: new Decimal(250),
	type: "static",
	base() {
		let base = 2;
		if (hasChallenge("sp", 19)) base -= 0.16;
		if (hasMilestone("d", 47)) base -= milestoneEffect("d", 47);
		if (hasMilestone("d", 49)) base -= milestoneEffect("d", 49);
		if (challengeCompletions("ec", 11) >= 1 && challengeEffect("ec", 11)[0]) base -= challengeEffect("ec", 11)[0];
		if (challengeCompletions("ec", 11) >= 10 && challengeEffect("ec", 11)[9]) base -= challengeEffect("ec", 11)[9];
		if (hasMilestone("r", 25)) base -= milestoneEffect("r", 25);
		if (hasMilestone("r", 59)) base -= milestoneEffect("r", 59);
		if (getGridData("w", 402)) base -= gridEffect("w", 402);
		return base;
	},
	exponent() {return inChallenge("co", 11) ? 2 : 1},
	roundUpCost: true,
	canBuyMax() {return player.ec.unlocked},
	resetDescription: "Dominate for ",
	gainMult() {
		let mult = newDecimalOne();
		if (hasMilestone("a", 69)) mult = mult.div(milestoneEffect("a", 69));
		if (hasMilestone("a", 71)) mult = mult.div(milestoneEffect("a", 71));
		if (hasChallenge("sp", 17)) mult = mult.div(challengeEffect("sp", 17));
		if (hasChallenge("sp", 21) && challengeEffect("sp", 21)[4]) mult = mult.div(challengeEffect("sp", 21)[4]);
		if (player.d.unlocks[3]) mult = mult.div(buyableEffect("d", 14));
		if (getGridData("w", 101)) mult = mult.div(gridEffect("w", 101));
		if (tmp.r.effect[5]) mult = mult.div(tmp.r.effect[5]);
		if (tmp.ex.effect[1]) mult = mult.div(tmp.ex.effect[1]);
		if (tmp.ex.effect[4]) mult = mult.div(tmp.ex.effect[4]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		return mult;
	},
	directMult() {
		let mult = newDecimalOne();
		if (tmp.t.effect[2]) mult = mult.mul(tmp.t.effect[2]);
		if (tmp.t.effect[4]) mult = mult.mul(tmp.t.effect[4]);
		return mult;
	},
	effect() {return player.points.add(1).pow(0.025)},
	effectDescription() {return "of which " + formatWhole(player[this.layer].points.sub(player[this.layer].spent)) + " are unspent"},
	resetsNothing() {return player.l.points.gte(2) || player.cy.unlocks[0] >= 1},
	autoPrestige() {return player.l.points.gte(2) || player.cy.unlocks[0] >= 1},
	tabFormat() {return getStatDisplay("d", hasMilestone("r", 14) || player.l.unlocked, "You keep all acclimation enhancements on domination resets.<br><br>After dominating 1 time, you automatically claim potential evolutions,<br>evolution resets (that are not in retrogressions) no longer reset anything,<br>and power gain is multiplied by your current power plus 1 exponentiated by 0.025.<br><br>The above extra effects will not go away even if this layer is reset.")},
	layerShown() {return hasChallenge("sp", 15) || player.d.unlocked},
	hotkeys: [{
		key: "d",
		description: "D: reset for domination points",
		onPress() {if (player.d.unlocked) doReset("d")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		const keep = ["autoFOC", "autoSPE", "autoCLI", "autoDOM"];
		if (player.em.unlocked
			|| player.l.points.gte(4)
			|| player.w.points.gte(3)
			|| resettingLayer == "w"
		) keep.push("milestones", "lastMilestone");
		layerDataReset("d", keep);
	},
	update(diff) {
		if (!player.d.unlocks[0] && player.cb.points.gte(11)) player.d.unlocks[0] = true;
		if (!player.d.unlocks[1] && player.sp.points.gte(14)) player.d.unlocks[1] = true;
		if (!player.d.unlocks[2] && player.a.points.gte(270)) player.d.unlocks[2] = true;
		if (!player.d.unlocks[3] && player.cb.points.gte(12) && player.sp.points.gte(16) && player.a.points.gte(325) && player.d.points.gte(1)) player.d.unlocks[3] = true;
	},
	automate() {
		if (hasMilestone("r", 14) || player.l.unlocked) {
			if (player.d.autoFOC) buyBuyable("d", 11);
			if (player.d.autoSPE) buyBuyable("d", 12);
			if (player.d.autoCLI) buyBuyable("d", 13);
			if (player.d.autoDOM) buyBuyable("d", 14);
		};
	},
	componentStyles: {
		buyable: {width: "210px", height: "110px"},
		clickable: {"min-height": "30px", transform: "none"},
	},
	buyables: {
		11: {
			cost(amt) {return amt.add(1)},
			effectBase() {
				let base = new Decimal(2.5);
				if (hasMilestone("d", 0)) base = base.mul(milestoneEffect("d", 0));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).add(this.extra()).pow_base(this.effectBase())},
			completionEffect() {
				let eff = 0.15;
				if (hasMilestone("d", 7)) eff += milestoneEffect("d", 7);
				if (hasMilestone("d", 10)) eff += milestoneEffect("d", 10);
				if (hasMilestone("d", 22)) eff += milestoneEffect("d", 22);
				if (hasMilestone("d", 27)) eff += milestoneEffect("d", 27);
				return eff;
			},
			title: "DOMINATE (FOC)US",
			fullDisplay() {
				if (!player.d.unlocks[0]) return "<br>requires 11 conscious beings to unlock";
				const b = tmp[this.layer].buyables[this.id];
				if (getBuyableAmount(this.layer, this.id).gte(b.purchaseLimit)) return "Normal effect: divides focus requirement by " + format(b.effect) + "<br><br>Complete domination effect: decreases the focus requirement base by " + format(b.completionEffect) + "<br><br>Progress: " + format(100) + "%";
				return "divide focus requirement by " + format(b.effectBase) + "<br><br>Effect: /" + format(b.effect) + "<br><br>Cost: " + formatWhole(b.cost) + " domination points<br><br>Progress: " + format(getBuyableAmount(this.layer, this.id) * 20) + "%";
			},
			purchaseLimit: 5,
			canAfford() {return player.d.unlocks[0] && player[this.layer].points.sub(player[this.layer].spent).gte(this.cost())},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {return getDominationExtraStats(newDecimalZero())},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return {"border-color": "#E03330"}},
		},
		12: {
			cost(amt) {return amt.add(1)},
			effectBase() {
				let base = new Decimal(1.2);
				if (hasMilestone("d", 3)) base = base.mul(milestoneEffect("d", 3));
				if (hasMilestone("d", 5)) base = base.mul(milestoneEffect("d", 5));
				if (hasMilestone("d", 11)) base = base.mul(milestoneEffect("d", 11));
				if (hasMilestone("d", 16)) base = base.mul(milestoneEffect("d", 16));
				if (hasMilestone("d", 26)) base = base.mul(milestoneEffect("d", 26));
				if (hasMilestone("d", 46)) base = base.mul(milestoneEffect("d", 46));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).add(this.extra()).pow_base(this.effectBase())},
			completionEffect() {
				let eff = 0.064;
				if (hasMilestone("d", 30)) eff += milestoneEffect("d", 30);
				return eff;
			},
			title: "DOMINATE (SPE)CIES",
			fullDisplay() {
				if (!player.d.unlocks[1]) return "<br>requires 14 species to unlock";
				const b = tmp[this.layer].buyables[this.id];
				if (getBuyableAmount(this.layer, this.id).gte(b.purchaseLimit)) return "Normal effect: divides species requirement by " + format(b.effect) + "<br><br>Complete domination effect: decreases the species requirement base by " + format(b.completionEffect) + "<br><br>Progress: " + format(100) + "%";
				return "divide species requirement by " + format(b.effectBase) + "<br><br>Effect: /" + format(b.effect) + "<br><br>Cost: " + formatWhole(b.cost) + " domination points<br><br>Progress: " + format(getBuyableAmount(this.layer, this.id) * 10) + "%";
			},
			purchaseLimit: 10,
			canAfford() {return player.d.unlocks[1] && player[this.layer].points.sub(player[this.layer].spent).gte(this.cost())},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("d", 48)) extra = extra.add(milestoneEffect("d", 48));
				return getDominationExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return {"border-color": "#E03330"}},
		},
		13: {
			cost(amt) {return amt.add(1)},
			effectBase() {
				let base = new Decimal(1000);
				if (hasMilestone("d", 1)) base = base.mul(milestoneEffect("d", 1));
				if (hasMilestone("d", 6)) base = base.mul(milestoneEffect("d", 6));
				if (hasMilestone("d", 13)) base = base.mul(milestoneEffect("d", 13));
				if (hasMilestone("d", 21)) base = base.mul(milestoneEffect("d", 21));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).add(this.extra()).pow_base(this.effectBase())},
			completionEffect() {
				let eff = 0.3;
				if (hasMilestone("d", 24)) eff += milestoneEffect("d", 24);
				if (hasMilestone("d", 36)) eff += milestoneEffect("d", 36);
				if (hasMilestone("d", 45)) eff += milestoneEffect("d", 45);
				return eff;
			},
			title: "DOMINATE (CLI)MATE",
			fullDisplay() {
				if (!player.d.unlocks[2]) return "<br>requires 270 acclimation points to unlock";
				const b = tmp[this.layer].buyables[this.id];
				if (getBuyableAmount(this.layer, this.id).gte(b.purchaseLimit)) return "Normal effect: divides acclimation requirement by " + format(b.effect) + "<br><br>Complete domination effect: decreases the expansion requirement base by " + format(b.completionEffect) + "<br><br>Progress: " + format(100) + "%";
				return "divide acclimation requirement by " + format(b.effectBase) + "<br><br>Effect: /" + format(b.effect) + "<br><br>Cost: " + formatWhole(b.cost) + " domination points<br><br>Progress: " + format(getBuyableAmount(this.layer, this.id) * 20 / 3) + "%";
			},
			purchaseLimit: 15,
			canAfford() {return player.d.unlocks[2] && player[this.layer].points.sub(player[this.layer].spent).gte(this.cost())},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("d", 48)) extra = extra.add(milestoneEffect("d", 48));
				return getDominationExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return {"border-color": "#E03330"}},
		},
		14: {
			cost(amt) {return amt.add(1)},
			effectBase() {
				let base = new Decimal(2);
				if (hasMilestone("d", 2)) base = base.mul(milestoneEffect("d", 2));
				if (hasMilestone("d", 8)) base = base.mul(milestoneEffect("d", 8));
				if (hasMilestone("d", 12)) base = base.mul(milestoneEffect("d", 12));
				if (hasMilestone("d", 20)) base = base.mul(milestoneEffect("d", 20));
				if (hasMilestone("d", 29)) base = base.mul(milestoneEffect("d", 29));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).add(this.extra()).pow_base(this.effectBase())},
			completionEffect() {
				let maxed = 0;
				for (const key in player.d.buyables) {
					if (player.d.buyables[key] >= tmp.d.buyables[key].purchaseLimit) maxed++;
				};
				let base = new Decimal(1.88);
				if (hasMilestone("d", 32)) base = base.add(milestoneEffect("d", 32));
				if (hasMilestone("d", 43)) base = base.add(milestoneEffect("d", 43));
				return base.pow(maxed);
			},
			title: "TOTAL (DOM)INATION",
			fullDisplay() {
				if (!player.d.unlocks[3]) return "<br>requires 12 conscious beings, 16 species, 325 acclimation points, and 1 domination point to unlock";
				const b = tmp[this.layer].buyables[this.id];
				if (getBuyableAmount(this.layer, this.id).gte(b.purchaseLimit)) return "Normal effect: divides domination requirement by " + format(b.effect) + "<br><br>Complete domination effect: divides the war requirement based on stats at 100% (currently&nbsp;/" + format(b.completionEffect) + ")<br><br>Progress: " + format(100) + "%";
				return "divide domination requirement by " + format(b.effectBase) + "<br><br>Effect: /" + format(b.effect) + "<br><br>Cost: " + formatWhole(b.cost) + " domination points<br><br>Progress: " + format(getBuyableAmount(this.layer, this.id) * 5) + "%";
			},
			purchaseLimit: 20,
			canAfford() {return player.d.unlocks[3] && player[this.layer].points.sub(player[this.layer].spent).gte(this.cost())},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("d", 48)) extra = extra.add(milestoneEffect("d", 48));
				return getDominationExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return {"border-color": "#E03330"}},
		},
		respec() {
			setBuyableAmount("d", 11, newDecimalZero());
			setBuyableAmount("d", 12, newDecimalZero());
			setBuyableAmount("d", 13, newDecimalZero());
			setBuyableAmount("d", 14, newDecimalZero());
			player.d.spent = newDecimalZero();
			setClickableState("cb", 11, 0);
			setClickableState("cb", 12, 0);
			doReset("d", true, true);
		},
		respecText: "respec domination points",
	},
	clickables: {
		13: {
			display() {return (getClickableState("d", 13) ? "Both" : "Only Base")},
			canClick() {return tmp.d.buyables[11].extra.gte(1) || tmp.d.buyables[12].extra.gte(1) || tmp.d.buyables[13].extra.gte(1) || tmp.d.buyables[14].extra.gte(1)},
			onClick() {
				setClickableState("d", 13, !getClickableState("d", 13));
				if (getClickableState("d", 13)) setClickableState("d", 14, false);
			},
			style: {width: "40px", "border-radius": "10px 0 0 10px"},
		},
		14: {
			display() {return (getClickableState("d", 14) ? "Both" : "Only Extra")},
			canClick() {return tmp.d.buyables[11].extra.gte(1) || tmp.d.buyables[12].extra.gte(1) || tmp.d.buyables[13].extra.gte(1) || tmp.d.buyables[14].extra.gte(1)},
			onClick() {
				setClickableState("d", 14, !getClickableState("d", 14));
				if (getClickableState("d", 14)) setClickableState("d", 13, false);
			},
			style: {width: "40px", "border-radius": "0 10px 10px 0"},
		},
	},
	milestones: {
		0: {
			requirement: 5,
			requirementDescription: "FOC enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1)},
			effectDescription(eff) {return "multiply the base effect of FOC based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
		},
		1: {
			requirement: 8,
			requirementDescription: "CLI enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(3)},
			effectDescription(eff) {return "multiply the base effect of CLI based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ec.unlocked},
		},
		2: {
			requirement: 9,
			requirementDescription: "DOM enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.0252)},
			effectDescription(eff) {return "multiply the base effect of DOM based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ec.unlocked},
		},
		3: {
			requirement: 12,
			requirementDescription: "SPE enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.031)},
			effectDescription(eff) {return "multiply the base effect of SPE based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ec.unlocked},
		},
		4: {
			requirement: 13,
			requirementDescription: "Species enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.242)},
			effectDescription(eff) {return "divide species requirement based on domination points<br>Effect: /" + format(eff) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ec.unlocked},
		},
		5: {
			requirement: 14,
			requirementDescription: "SPE enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.1)},
			effectDescription(eff) {return "multiply the base effect of SPE based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.r.unlocked},
		},
		6: {
			requirement: 17,
			requirementDescription: "CLI enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(7)},
			effectDescription(eff) {return "multiply the base effect of CLI based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.r.unlocked},
		},
		7: {
			requirement: 18,
			requirementDescription: "FOC enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "increase the complete domination effect of FOC by 0.05<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.r.unlocked},
		},
		8: {
			requirement: 20,
			requirementDescription: "DOM enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.025)},
			effectDescription(eff) {return "multiply the base effect of DOM based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.r.unlocked},
		},
		9: {
			requirement: 22,
			requirementDescription: "Hybridization enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "make the 10th hybridization have an additional reward<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.r.unlocked},
		},
		10: {
			requirement: 23,
			requirementDescription: "FOC enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "increase the complete domination effect of FOC by 0.05<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.r.unlocked},
		},
		11: {
			requirement: 26,
			requirementDescription: "SPE enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.075)},
			effectDescription(eff) {return "multiply the base effect of SPE based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.r.unlocked},
		},
		12: {
			requirement: 31,
			requirementDescription: "DOM enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.045)},
			effectDescription(eff) {return "multiply the base effect of DOM based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.r.unlocked},
		},
		13: {
			requirement: 34,
			requirementDescription: "CLI enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(11)},
			effectDescription(eff) {return "multiply the base effect of CLI based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.r.unlocked},
		},
		14: {
			requirement: 35,
			requirementDescription: "Species enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.0383},
			effectDescription() {return "decrease species requirement base by 0.0383<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.r.unlocked},
		},
		15: {
			requirement: 41,
			requirementDescription: "D-E synergy enhancement",
			popupTitle: "Enhancement Acquired!",
			effect() {return new Decimal(1e100).pow(getBuyableAmount("d", 11).add(getBuyableAmount("d", 12)).add(getBuyableAmount("d", 13)).add(getBuyableAmount("d", 14)))},
			effectDescription(eff) {return "divide the evolution requirement based on base FOC, SPE, CLI, and DOM levels<br>Effect: /" + format(eff) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ex.unlocked},
		},
		16: {
			requirement: 50,
			requirementDescription: "SPE enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.1055)},
			effectDescription(eff) {return "multiply the base effect of SPE based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ex.unlocked},
		},
		17: {
			requirement: 54,
			requirementDescription: "D-R synergy enhancement",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("d", 11).add(getBuyableAmount("d", 12)).add(getBuyableAmount("d", 13)).add(getBuyableAmount("d", 14)).add(1).pow(0.164)},
			effectDescription(eff) {return "divide the revolution requirement based on base FOC, SPE, CLI, and DOM levels<br>Effect: /" + format(eff) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ex.unlocked},
		},
		18: {
			requirement: 62,
			requirementDescription: "Hybridization enhancement II",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve the 10th hybridization's last effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ex.unlocked},
		},
		19: {
			requirement: 65,
			requirementDescription: "D-A synergy enhancement",
			popupTitle: "Enhancement Acquired!",
			effect() {return new Decimal(1e25).pow(getBuyableAmount("d", 11).add(getBuyableAmount("d", 12)).add(getBuyableAmount("d", 13)).add(getBuyableAmount("d", 14)).add(1))},
			effectDescription(eff) {return "divide the acclimation requirement based on base FOC, SPE, CLI, and DOM levels<br>Effect: /" + format(eff) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ex.unlocked},
		},
		20: {
			requirement: 77,
			requirementDescription: "DOM enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.055)},
			effectDescription(eff) {return "multiply the base effect of DOM based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.w.unlocked},
		},
		21: {
			requirement: 84,
			requirementDescription: "CLI enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(46.6)},
			effectDescription(eff) {return "multiply the base effect of CLI based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.w.unlocked},
		},
		22: {
			requirement: 97,
			requirementDescription: "FOC enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.14},
			effectDescription() {return "increase the complete domination effect of FOC by 0.14<br>and the 10th retrogression is auto-maxed<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.w.unlocked},
		},
		23: {
			requirement: 110,
			requirementDescription: "Species enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.033},
			effectDescription() {return "decrease species requirement base by 0.033<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.w.unlocked},
		},
		24: {
			requirement: 128,
			requirementDescription: "CLI enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.09},
			effectDescription() {return "increase the complete domination effect of CLI by 0.09<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.w.unlocked},
		},
		25: {
			requirement: 140,
			requirementDescription: "D-CB synergy enhancement",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("d", 11).add(getBuyableAmount("d", 12)).add(getBuyableAmount("d", 13)).add(getBuyableAmount("d", 14)).div(3)},
			effectDescription(eff) {return "increase the exponent of the last conscious being effect<br>based on base FOC, SPE, CLI, and DOM levels<br>Effect: +" + format(eff) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.w.unlocked},
		},
		26: {
			requirement: 156,
			requirementDescription: "SPE enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.2)},
			effectDescription(eff) {return "multiply the base effect of SPE based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.w.unlocked},
		},
		27: {
			requirement: 160,
			requirementDescription: "FOC enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.025},
			effectDescription() {return "increase the complete domination effect of FOC by 0.025<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.w.unlocked},
		},
		28: {
			requirement: 180,
			requirementDescription: "Hybridization enhancement III",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve the 10th hybridization's second to last effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.w.unlocked},
		},
		29: {
			requirement: 193,
			requirementDescription: "DOM enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.0363)},
			effectDescription(eff) {return "multiply the base effect of DOM based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.w.unlocked},
		},
		30: {
			requirement: 202,
			requirementDescription: "SPE enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.076},
			effectDescription() {return "increase the complete domination effect of SPE by 0.076<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.l.unlocked},
		},
		31: {
			requirement: 229,
			requirementDescription: "ANACHRONISM enhancement",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1},
			effectDescription() {return "unlock another tier of ANACHRONISM<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.l.unlocked},
		},
		32: {
			requirement: 246,
			requirementDescription: "DOM enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.62},
			effectDescription() {return "increase the base complete domination effect of DOM by 0.62<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.l.unlocked},
		},
		33: {
			requirement: 257,
			requirementDescription: "Influence enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve influence's second effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.l.unlocked},
		},
		34: {
			requirement: 297,
			requirementDescription: "Influence enhancement II",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "unlock an additional effect for influence<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.l.unlocked},
		},
		35: {
			requirement: 313,
			requirementDescription: "Influence enhancement III",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve influence's third effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.l.unlocked},
		},
		36: {
			requirement: 340,
			requirementDescription: "CLI enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.11},
			effectDescription() {return "increase the complete domination effect of CLI by 0.11<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.l.unlocked},
		},
		37: {
			requirement: 359,
			requirementDescription: "FOC enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("d", 11).mul(2)},
			effectDescription(eff) {return "every base level of FOC gives two extra levels to FOC, SPE, CLI, and DOM<br>Effect: +" + formatWhole(eff) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.l.unlocked},
		},
		38: {
			requirement: 393,
			requirementDescription: "Hybridization enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve the 10th hybridization's second to last effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.l.unlocked},
		},
		39: {
			requirement: 777,
			requirementDescription: "The lucky enhancement",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.pow_base(479250)},
			effectDescription(eff) {return "divide conscious being requirement based on domination points<br>and unlock something new..." + (player.l.unlocked ? " (already unlocked)" : "") + "<br>Effect: /" + format(eff) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.l.unlocked},
		},
		40: {
			requirement: 958,
			requirementDescription: "Influence enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve influence's second effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.co.unlocked},
		},
		41: {
			requirement: 1605,
			requirementDescription: "Battle enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "expand the battle grid<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.co.unlocked},
		},
		42: {
			requirement: 2699,
			requirementDescription: "Influence enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("ex", 22)},
			effectDescription(eff) {return "make each <b>Influence empowerment</b> give an extra level to <b>Influence tickspeed</b><br>Effect: +" + formatWhole(eff) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.co.unlocked},
		},
		43: {
			requirement: 4500,
			requirementDescription: "DOM enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.6},
			effectDescription() {return "increase the base complete domination effect of DOM by 0.6<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.co.unlocked},
		},
		44: {
			requirement: 4955,
			requirementDescription: "D-L synergy enhancement",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("d", 11).add(getBuyableAmount("d", 12)).add(getBuyableAmount("d", 13)).add(getBuyableAmount("d", 14)).div(50).add(1)},
			effectDescription(eff) {return "divide leader requirement based on base FOC, SPE, CLI, and DOM levels<br>Effect: /" + format(eff) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.co.unlocked},
		},
		45: {
			requirement: 8750,
			requirementDescription: "CLI enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "increase the complete domination effect of CLI by 0.05<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.t.unlocked},
		},
		46: {
			requirement: 14825,
			requirementDescription: "SPE enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.1)},
			effectDescription(eff) {return "multiply the base effect of SPE based on domination points<br>Effect: " + format(eff) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.t.unlocked},
		},
		47: {
			requirement: 28580,
			requirementDescription: "The cool enhancement",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.137},
			effectDescription() {return "decrease domination requirement base by 0.137<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.t.unlocked},
		},
		48: {
			requirement: 54175,
			requirementDescription: "FOC enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("d", 11).add(tmp.d.buyables[11].extra).div(10).floor()},
			effectDescription(eff) {return "every 10 levels of FOC gives an extra level to SPE, CLI, and DOM<br>Effect: +" + formatWhole(eff) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.t.unlocked},
		},
		49: {
			requirement: 69745,
			requirementDescription: "The coolest enhancement",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.045},
			effectDescription() {return "decrease domination requirement base by 0.045<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.t.unlocked},
		},
		50: {
			requirement: 200000,
			requirementDescription: "Battle enhancement II",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "expand the enhancable battle grid<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.cy.unlocked},
		},
		51: {
			requirement: 300000,
			requirementDescription: "Hybridization enhancement V",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				if (player.cy.unlocks[1] >= 3) return "effect overriden by <b>The Second Cycle</b><br>Req: " + formatWhole(this.requirement) + " domination points";
				return "the 10th hybridization is auto-maxed<br>Req: " + formatWhole(this.requirement) + " domination points";
			},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.cy.unlocked},
		},
		52: {
			requirement: 400000,
			requirementDescription: "The bulky enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "you bulk 10x stats from rows 3 and below<br>(this respecs growth and acclimation points)<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			onComplete() {
				layers.g.buyables.respec();
				layers.a.buyables.respec();
			},
			unlocked() {return hasMilestone("d", this.id - 1) || player.cy.unlocked},
		},
		53: {
			requirement: 550000,
			requirementDescription: "The lazy enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "unlock automation for <b>Generator improvement</b><br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.cy.unlocked},
		},
		54: {
			requirement: 700000,
			requirementDescription: "The speedy enhancement",
			popupTitle: "Enhancement Acquired!",
			effect() {return 10},
			effectDescription() {return "time for control nodes goes ten times faster<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.cy.unlocked},
		},
		55: {
			requirement: 850000,
			requirementDescription: "The bulkiest enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "you bulk 10x stats from rows 3 and below<br>(this respecs growth and acclimation points)<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			onComplete() {
				layers.g.buyables.respec();
				layers.a.buyables.respec();
			},
			unlocked() {return hasMilestone("d", this.id - 1) || player.cy.unlocked},
		},
		56: {
			requirement: 1000000,
			requirementDescription: "The controlled enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "unlock another effect for control<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.cy.unlocked},
		},
		57: {
			requirement: 1375000,
			requirementDescription: "The enhanced enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve the second war effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.cy.unlocked},
		},
		58: {
			requirement: 2111111,
			requirementDescription: "The enhanced battle enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "expand the enhancable battle grid<br>and improve the second war effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.cy.unlocked},
		},
		59: {
			requirement: 3250000,
			requirementDescription: "THE 7TH ROW APROACHES",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "two new layers are unlocked" + (player.cy.unlocked ? " (" + (player.em.unlocked ? "" : "1/2 ") + "already unlocked)" : "") + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.cy.unlocked},
		},
		60: {
			requirement: 5500000,
			requirementDescription: "The dual enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "unlock another effect for control<br>and improve the second war effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.em.unlocked},
		},
		61: {
			requirement: 9000000,
			requirementDescription: "The choice enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve the second war effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.em.unlocked},
		},
		62: {
			requirement: 14141414,
			requirementDescription: "The controlling enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve the third control effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.em.unlocked},
		},
		63: {
			requirement: 29500000,
			requirementDescription: "The productive enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve the settler effects<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.em.unlocked},
		},
		64: {
			requirement: 45555555,
			requirementDescription: "The final enhancement",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve the second war effect<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.em.unlocked},
		},
	},
});
