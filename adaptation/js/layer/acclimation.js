function getAcclimationStatCost(amt) {
	if (!hasChallenge("sp", 18)) amt = amt.add(1);
	if (amt.gte(1e10)) return amt.pow(2).div(2e8);
	if (hasMilestone("r", 2)) return amt.mul(50);
	return amt;
};

function getAcclimationStatLimit() {
	if (hasMilestone("r", 72)) return Infinity;
	return 1e10;
};

function getAcclimationExtraStats(extra) {
	if (hasMilestone("a", 43)) extra = extra.add(milestoneEffect("a", 43));
	if (hasMilestone("a", 67)) extra = extra.add(milestoneEffect("a", 67));
	if (getGridData("w", 502)) extra = extra.add(gridEffect("w", 502));
	if (getGridData("w", 504)) extra = extra.add(gridEffect("w", 504));
	if (getGridData("w", 506)) extra = extra.add(gridEffect("w", 506));
	if (tmp.ex.effect[2]) extra = extra.add(tmp.ex.effect[2]);
	if (tmp.em.effect[4]) extra = extra.pow(tmp.em.effect[4]);
	return extra.floor();
};

addLayer("a", {
	name: "Acclimation",
	symbol: "A",
	position: 1,
	branches: ["g"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		spent: newDecimalZero(),
		population: newDecimalOne(),
		populationMax: newDecimalOne(),
		populationTime: 0,
		autoCRA: false,
		autoFER: false,
		autoANA: false,
		autoSOV: false,
	}},
	color: "#B44990",
	resource: "acclimation points",
	row: 2,
	baseResource: "growth points",
	baseAmount() {return player.g.points},
	requires: new Decimal(64000),
	type: "static",
	base() {
		let base = (inChallenge("sp", 14) ? 10 : 2);
		if (hasMilestone("g", 67)) base -= milestoneEffect("g", 67);
		if (hasMilestone("g", 72)) base -= milestoneEffect("g", 72);
		if (hasChallenge("sp", 15)) base -= challengeEffect("sp", 15);
		if (hasChallenge("sp", 16)) base -= challengeEffect("sp", 15);
		if (challengeCompletions("ec", 11) >= 4 && challengeEffect("ec", 11)[3]) base -= challengeEffect("ec", 11)[3];
		if (hasMilestone("r", 29)) base -= milestoneEffect("r", 29);
		if (inChallenge("ec", 11)) base *= tmp.ec.challenges[11].penalty;
		return base;
	},
	exponent() {return inChallenge("co", 11) ? 2 : 1},
	roundUpCost: true,
	canBuyMax() {return player.cb.unlocked},
	resetDescription: "Acclimate for ",
	gainMult() {
		let mult = newDecimalOne();
		if (hasMilestone("g", 48)) mult = mult.div(milestoneEffect("g", 48));
		if (hasMilestone("g", 52)) mult = mult.div(milestoneEffect("g", 52));
		if (hasMilestone("g", 60)) mult = mult.div(milestoneEffect("g", 60));
		if (player.e.points.gte(26)) mult = mult.div(1.0915);
		if (player.e.points.gte(83)) mult = mult.div(2.66155);
		if (player.e.points.gte(155)) mult = mult.div(4);
		if (player.e.points.gte(397)) mult = mult.div(2);
		if (player.e.points.gte(728)) mult = mult.div(1.5);
		if (player.e.points.gte(1306)) mult = mult.div(10);
		if (player.e.points.gte(2498)) mult = mult.div(10);
		if (player.e.points.gte(2510)) mult = mult.div(10);
		if (hasChallenge("e", 16)) mult = mult.div(challengeEffect("e", 16));
		if (hasChallenge("e", 17)) mult = mult.div(challengeEffect("e", 17));
		if (player.a.unlocked) mult = mult.div(buyableEffect("a", 13));
		if (hasChallenge("sp", 11)) mult = mult.div(challengeEffect("sp", 11));
		if (hasChallenge("sp", 13)) mult = mult.div(challengeEffect("sp", 13));
		if (player.d.unlocks[2]) mult = mult.div(buyableEffect("d", 13));
		if (hasMilestone("d", 19)) mult = mult.div(milestoneEffect("d", 19));
		if (tmp.cb.effect[1]) mult = mult.div(tmp.cb.effect[1]);
		if (tmp.r.effect[7]) mult = mult.div(tmp.r.effect[7]);
		if (tmp.ex.effect[3]) mult = mult.div(tmp.ex.effect[3]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		return mult;
	},
	directMult() {
		let mult = newDecimalOne();
		if (tmp.t.effect[3]) mult = mult.mul(tmp.t.effect[3]);
		return mult;
	},
	effect() {
		// initialize
		let amt = player.a.population.mul(buyableEffect("a", 14));
		// multiply
		let mult = [newDecimalOne(), newDecimalOne(), newDecimalOne()];
		if (hasChallenge("e", 18)) mult[2] = mult[2].mul(challengeEffect("e", 18));
		if (hasChallenge("e", 19)) mult[0] = mult[0].mul(100);
		if (hasMilestone("a", 3)) mult[2] = mult[2].mul(milestoneEffect("a", 3));
		if (hasMilestone("a", 11)) mult[1] = mult[1].mul(milestoneEffect("a", 11));
		if (hasMilestone("a", 17)) mult[2] = mult[2].mul(milestoneEffect("a", 17));
		if (hasMilestone("a", 25)) {
			mult[1] = mult[1].mul(milestoneEffect("a", 25));
			mult[2] = mult[2].mul(milestoneEffect("a", 25));
		};
		if (hasMilestone("a", 31)) mult[0] = mult[0].mul(milestoneEffect("a", 31));
		if (hasMilestone("a", 40)) mult[0] = mult[0].mul(milestoneEffect("a", 40));
		if (hasMilestone("a", 41)) mult[2] = mult[2].mul(milestoneEffect("a", 41));
		if (hasMilestone("a", 45)) mult[0] = mult[0].mul(milestoneEffect("a", 45));
		if (hasMilestone("a", 51)) mult[2] = mult[2].mul(milestoneEffect("a", 51));
		if (hasMilestone("a", 52)) mult[0] = mult[0].mul(clickableEffect("cb", 14));
		// exponent
		let exp1 = 0.1;
		if (hasMilestone("a", 34)) exp1 += milestoneEffect("a", 34);
		if (hasMilestone("a", 60)) exp1 += milestoneEffect("a", 60);
		if (hasMilestone("a", 64)) exp1 += milestoneEffect("a", 64);
		// return
		let eff = [
			(hasMilestone("a", 6) ? amt.add(1).pow(amt.log10().add(1).pow(0.125).mul(200000).mul(mult[0])) : new Decimal(10).pow(amt.sub(1).mul(mult[0])).sub(1).mul(1e100).add(1)),
			amt.pow(exp1).mul(mult[1]),
			amt.log10().mul(mult[2]).floor(),
		];
		if (hasMilestone("a", 6)) {
			if (eff[0].gt("e1e10000")) eff[0] = eff[0].layeradd10(-1).div("1e10000").sqrt().mul("1e10000").layeradd10(1);
			if (eff[0].gt("e1e100000")) eff[0] = eff[0].layeradd10(-1).div("1e100000").sqrt().mul("1e100000").layeradd10(1);
			if (eff[0].gt("ee1000000")) eff[0] = eff[0].layeradd10(-1).div("e1000000").sqrt().mul("e1000000").layeradd10(1);
			if (eff[0].gt("ee10000000")) eff[0] = eff[0].layeradd10(-1).div("e10000000").sqrt().mul("e10000000").layeradd10(1);
			if (eff[0].gt("ee100000000")) eff[0] = eff[0].layeradd10(-1).div("e100000000").pow(0.1).mul("e100000000").layeradd10(1);
			if (eff[0].gt("ee120000000")) eff[0] = eff[0].layeradd10(-1).div("e120000000").pow(0.12).mul("e120000000").layeradd10(1);
		} else {
			if (eff[0].gt("e750000")) eff[0] = eff[0].div("e750000").pow(0.1).mul("e750000");
			if (eff[0].gt("e1500000")) eff[0] = eff[0].div("e1500000").log10().add(1).pow(15000).mul("e1500000");
		};
		if (eff[2].gt("e33333333")) eff[2] = eff[2].div("e33333333").pow(1/30).mul("e33333333");
		return eff;
	},
	effectDescription() {return "of which " + formatWhole(player[this.layer].points.sub(player[this.layer].spent)) + " are unspent"},
	resetsNothing() {return player.ex.unlocked},
	autoPrestige() {return player.ex.unlocked},
	tabFormat() {return getStatDisplay("a", player.ec.unlocked, "Your population is currently <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + formatWhole(player.a.population) + "</h2>, which is dividing growth requirement by /" + format(tmp.a.effect[0]) + "; dividing evolution requirement by /" + format(tmp.a.effect[1]) + "; and giving " + formatWhole(tmp.a.effect[2]) + " extra STR, WIS, AGI, and INT." + (hasMilestone("r", 3) ? "" : "<br>(" + formatWhole(player.a.populationMax) + " max population)"))},
	layerShown() {return hasMilestone("g", 40) || player.a.unlocked},
	hotkeys: [{
		key: "a",
		description: "A: reset for acclimation points",
		onPress() {if (player.a.unlocked) doReset("a")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row >= this.row) player.a.populationTime = 0;
		if (layers[resettingLayer].row <= this.row) return;
		let keep = ["autoCRA", "autoFER", "autoANA", "autoSOV"];
		if (player.ex.unlocked || resettingLayer == "d") keep.push("milestones", "lastMilestone");
		layerDataReset("a", keep);
	},
	update(diff) {
		// add time
		player.a.populationTime += diff;
		// calculate maximum
		let max = newDecimalOne();
		max = max.mul(buyableEffect("a", 11));
		if (hasChallenge("e", 21) && challengeEffect("e", 21)[1]) max = max.mul(challengeEffect("e", 21)[1]);
		if (hasChallenge("sp", 21) && challengeEffect("sp", 21)[1]) max = max.mul(challengeEffect("sp", 21)[1]);
		if (player.cb.focusUnlocked) max = max.mul(clickableEffect("cb", 12));
		player.a.populationMax = max.round();
		// overrides
		if (hasMilestone("r", 3)) {
			player.a.population = player.a.populationMax;
		} else {
			// max exponent
			let exp = 0.5;
			if (hasMilestone("a", 59)) exp -= 0.03;
			if (hasMilestone("a", 66)) exp -= 0.14;
			if (hasMilestone("a", 73)) exp -= 0.17;
			// calculate rate
			let rate = new Decimal(player.a.populationTime).mul(2).div(max.pow(exp));
			rate = rate.mul(buyableEffect("a", 12));
			if (player.cb.focusUnlocked) rate = rate.mul(clickableEffect("cb", 12));
			// calculate population
			player.a.population = max.div(max.sub(1).mul(new Decimal(Math.E).pow(rate.neg())).add(1)).round();
		};
	},
	automate() {
		if (player.ec.unlocked) {
			if (player.a.autoCRA && layers.a.buyables[11].canAfford()) layers.a.buyables[11].buy();
			if (player.a.autoFER && layers.a.buyables[12].canAfford()) layers.a.buyables[12].buy();
			if (player.a.autoANA && layers.a.buyables[13].canAfford()) layers.a.buyables[13].buy();
			if (player.a.autoSOV && layers.a.buyables[14].canAfford()) layers.a.buyables[14].buy();
		};
	},
	componentStyles: {
		"buyable"() {return {"width": "210px", "height": "110px"}},
		"clickable"() {return {"min-height": "30px", "transform": "none"}},
	},
	buyables: {
		11: {
			cost(amt) {return getAcclimationStatCost(amt)},
			effectBase() {
				let base = new Decimal(10);
				if (hasMilestone("a", 0)) base = base.mul(milestoneEffect("a", 0));
				if (hasMilestone("a", 13)) base = base.mul(milestoneEffect("a", 13));
				if (hasMilestone("a", 26)) base = base.mul(milestoneEffect("a", 26));
				if (hasMilestone("a", 37)) base = base.mul(milestoneEffect("a", 37));
				if (hasMilestone("a", 46)) base = base.mul(milestoneEffect("a", 46));
				if (hasMilestone("a", 59)) base = base.mul(milestoneEffect("a", 59));
				if (hasMilestone("a", 66)) base = base.mul(milestoneEffect("a", 66));
				if (hasMilestone("a", 73)) base = base.mul(milestoneEffect("a", 73));
				return base;
			},
			effect(amt) {return amt.add(this.extra()).pow_base(this.effectBase())},
			title: "(CRA)FTSMANSHIP",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "multiply population maximum by " + format(b.effectBase) + (b.effectBase.gte(1000000) ? "" : "<br>(population max also influences gain)") + "<br><br>Effect: " + format(b.effect) + "x<br><br>Cost: " + formatWhole(b.cost) + " acclimation points<br><br>Level: " + (getBuyableAmount(this.layer, this.id).gte(b.purchaseLimit) ? "1e10/1e10" : formatWhole(getBuyableAmount(this.layer, this.id))) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
			},
			purchaseLimit() {return getAcclimationStatLimit()},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("sp", 11)},
			buy() {
				if (!hasMilestone("r", 2)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, getStatBulk());
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("a", 7)) extra = extra.add(milestoneEffect("a", 7));
				if (hasMilestone("a", 20)) extra = extra.add(milestoneEffect("a", 20));
				if (hasMilestone("a", 22)) extra = extra.add(milestoneEffect("a", 22));
				if (hasMilestone("a", 24)) extra = extra.add(milestoneEffect("a", 24));
				return getAcclimationExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit())) return {"border-color": "#B44990"}},
		},
		12: {
			cost(amt) {return getAcclimationStatCost(amt)},
			effectBase() {
				let base = new Decimal(5);
				if (hasMilestone("a", 15)) base = base.mul(milestoneEffect("a", 15));
				if (hasMilestone("a", 30)) base = base.mul(milestoneEffect("a", 30));
				if (hasMilestone("a", 35)) base = base.mul(milestoneEffect("a", 35));
				if (hasMilestone("a", 48)) base = base.mul(milestoneEffect("a", 48));
				if (hasMilestone("a", 55)) base = base.mul(milestoneEffect("a", 55));
				return base;
			},
			effect(amt) {return amt.add(this.extra()).pow_base(this.effectBase())},
			title: "(FER)TILITY",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "multiply population gain by " + format(b.effectBase) + "<br><br>Effect: " + format(b.effect) + "x<br><br>Cost: " + formatWhole(b.cost) + " acclimation points<br><br>Level: " + (getBuyableAmount(this.layer, this.id).gte(b.purchaseLimit) ? "1e10/1e10" : formatWhole(getBuyableAmount(this.layer, this.id))) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
			},
			purchaseLimit() {return getAcclimationStatLimit()},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("sp", 11)},
			buy() {
				if (!hasMilestone("r", 2)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, getStatBulk());
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("a", 4)) extra = extra.add(milestoneEffect("a", 4));
				if (hasMilestone("a", 9)) extra = extra.add(milestoneEffect("a", 9));
				if (hasMilestone("a", 18)) extra = extra.add(milestoneEffect("a", 18));
				if (hasMilestone("a", 20)) extra = extra.add(milestoneEffect("a", 20));
				if (hasMilestone("a", 22)) extra = extra.add(milestoneEffect("a", 22));
				return getAcclimationExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit())) return {"border-color": "#B44990"}},
		},
		13: {
			cost(amt) {return getAcclimationStatCost(amt)},
			effectBase() {
				let base = new Decimal(1.25);
				if (hasMilestone("a", 1)) base = base.add(milestoneEffect("a", 1));
				if (hasMilestone("a", 5)) base = base.add(milestoneEffect("a", 5));
				if (hasMilestone("a", 10)) base = base.add(milestoneEffect("a", 10));
				if (hasMilestone("a", 28)) base = base.add(milestoneEffect("a", 28));
				if (hasMilestone("a", 38)) base = base.add(milestoneEffect("a", 38));
				if (hasMilestone("a", 49)) base = base.add(milestoneEffect("a", 49));
				if (hasMilestone("a", 58)) base = base.add(milestoneEffect("a", 58));
				if (hasMilestone("a", 63)) base = base.add(milestoneEffect("a", 63));
				if (hasMilestone("a", 70)) base = base.add(milestoneEffect("a", 70));
				return base;
			},
			effect(amt) {return amt.add(this.extra()).pow_base(this.effectBase())},
			title: "(ANA)LYTICITY",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "divide acclimation requirement by " + format(b.effectBase) + "<br><br>Effect: /" + format(b.effect) + "<br><br>Cost: " + formatWhole(b.cost) + " acclimation points<br><br>Level: " + (getBuyableAmount(this.layer, this.id).gte(b.purchaseLimit) ? "1e10/1e10" : formatWhole(getBuyableAmount(this.layer, this.id))) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
			},
			purchaseLimit() {return getAcclimationStatLimit()},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("sp", 12)},
			buy() {
				if (!hasMilestone("r", 2)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, getStatBulk());
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("a", 18)) extra = extra.add(milestoneEffect("a", 18));
				if (hasMilestone("a", 22)) extra = extra.add(milestoneEffect("a", 22));
				if (hasMilestone("a", 24)) extra = extra.add(milestoneEffect("a", 24));
				return getAcclimationExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit())) return {"border-color": "#B44990"}},
		},
		14: {
			cost(amt) {return getAcclimationStatCost(amt)},
			effectBase() {
				let base = new Decimal(3);
				if (hasMilestone("a", 2)) base = base.mul(milestoneEffect("a", 2));
				if (hasMilestone("a", 14)) base = base.mul(milestoneEffect("a", 14));
				if (hasMilestone("a", 27)) base = base.mul(milestoneEffect("a", 27));
				if (hasMilestone("a", 36)) base = base.mul(milestoneEffect("a", 36));
				if (hasMilestone("a", 47)) base = base.mul(milestoneEffect("a", 47));
				if (hasMilestone("a", 56)) base = base.mul(milestoneEffect("a", 56));
				if (hasMilestone("a", 65)) base = base.mul(milestoneEffect("a", 65));
				if (hasMilestone("a", 72)) base = base.mul(milestoneEffect("a", 72));
				return base;
			},
			effect(amt) {return amt.add(this.extra()).pow_base(this.effectBase())},
			title: "(SOV)EREIGNTY",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "multiply population amount in population effects by " + format(b.effectBase) + "<br><br>Effect: " + format(b.effect) + "x<br><br>Cost: " + formatWhole(b.cost) + " acclimation points<br><br>Level: " + (getBuyableAmount(this.layer, this.id).gte(b.purchaseLimit) ? "1e10/1e10" : formatWhole(getBuyableAmount(this.layer, this.id))) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
			},
			purchaseLimit() {return getAcclimationStatLimit()},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("sp", 11)},
			buy() {
				if (!hasMilestone("r", 2)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, getStatBulk());
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("a", 6)) extra = extra.add(milestoneEffect("a", 6));
				if (hasMilestone("a", 18)) extra = extra.add(milestoneEffect("a", 18));
				if (hasMilestone("a", 20)) extra = extra.add(milestoneEffect("a", 20));
				if (hasMilestone("a", 24)) extra = extra.add(milestoneEffect("a", 24));
				return getAcclimationExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit())) return {"border-color": "#B44990"}},
		},
		respec() {
			setBuyableAmount("a", 11, newDecimalZero());
			setBuyableAmount("a", 12, newDecimalZero());
			setBuyableAmount("a", 13, newDecimalZero());
			setBuyableAmount("a", 14, newDecimalZero());
			player.a.spent = newDecimalZero();
			setClickableState("a", 11, 0);
			doReset("a", true, true);
		},
		respecText: "respec acclimation points",
	},
	clickables: {
		11: {
			display() {return "<h2>-4</h2>"},
			canClick() {return getClickableState("a", 11) > 0 && !getClickableState("a", 14)},
			onClick() {setClickableState("a", 11, (getClickableState("a", 11) || 0) - 1)},
			onHold() {setClickableState("a", 11, (getClickableState("a", 11) || 0) - 1)},
			style: {"width": "45px", "border-radius": "10px 0 0 10px"},
		},
		12: {
			display() {return "<h2>+4</h2>"},
			canClick() {
				let amt = new Decimal(((getClickableState("a", 11) || 0) + 1) * 4);
				return getBuyableAmount("a", 11).gte(amt) && getBuyableAmount("a", 12).gte(amt) && getBuyableAmount("a", 13).gte(amt) && getBuyableAmount("a", 14).gte(amt) && !getClickableState("a", 14);
			},
			onClick() {setClickableState("a", 11, (getClickableState("a", 11) || 0) + 1)},
			onHold() {setClickableState("a", 11, (getClickableState("a", 11) || 0) + 1)},
			style: {"width": "45px", "border-radius": "0 10px 10px 0"},
		},
		13: {
			display() {return (getClickableState("a", 13) ? "Both" : "Only Base")},
			canClick() {return tmp.a.buyables[11].extra.gte(1) || tmp.a.buyables[12].extra.gte(1) || tmp.a.buyables[13].extra.gte(1) || tmp.a.buyables[14].extra.gte(1)},
			onClick() {
				setClickableState("a", 13, !getClickableState("a", 13));
				if (getClickableState("a", 13)) setClickableState("a", 14, false);
			},
			style: {"width": "40px", "border-radius": "10px 0 0 10px"},
		},
		14: {
			display() {return (getClickableState("a", 14) ? "Both" : "Only Extra")},
			canClick() {return tmp.a.buyables[11].extra.gte(1) || tmp.a.buyables[12].extra.gte(1) || tmp.a.buyables[13].extra.gte(1) || tmp.a.buyables[14].extra.gte(1)},
			onClick() {
				setClickableState("a", 14, !getClickableState("a", 14));
				if (getClickableState("a", 14)) setClickableState("a", 13, false);
			},
			style: {"width": "40px", "border-radius": "0 10px 10px 0"},
		},
	},
	milestones: {
		0: {
			requirement: 5,
			requirementDescription: "CRA enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.25)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
		},
		1: {
			requirement: 6,
			requirementDescription: "ANA enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.11},
			effectDescription() {return "increase the base effect of ANA by 0.11<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		2: {
			requirement: 7,
			requirementDescription: "SOV enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.mul(10).add(1).pow(0.25)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		3: {
			requirement: 8,
			requirementDescription: "Population enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return 6},
			effectDescription() {return "multiply the last population effect by 6<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		4: {
			requirement: 9,
			requirementDescription: "FER enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1},
			effectDescription() {return "increase extra FER levels by 1<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		5: {
			requirement: 10,
			requirementDescription: "ANA enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.39},
			effectDescription() {return "increase the base effect of ANA by 0.39<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		6: {
			requirement: 11,
			requirementDescription: "SOV enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1},
			effectDescription() {return "increase extra SOV levels by 1<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		7: {
			requirement: 13,
			requirementDescription: "CRA enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1},
			effectDescription() {return "increase extra CRA levels by 1<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		8: {
			requirement: 14,
			requirementDescription: "Population enhancement II",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "change the formula of the first population effect<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		9: {
			requirement: 16,
			requirementDescription: "FER enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1},
			effectDescription() {return "increase extra FER levels by 1<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		10: {
			requirement: 17,
			requirementDescription: "ANA enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.25},
			effectDescription() {return "increase the base effect of ANA by 0.25<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		11: {
			requirement: 18,
			requirementDescription: "Population enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2.5},
			effectDescription() {return "multiply the second population effect by 2.5<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		12: {
			requirement: 20,
			requirementDescription: "Retrogression enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				let text = "unlock the 6th retrogression";
				if (hasMilestone("a", this.id) || hasChallenge("e", 16)) text += " (already unlocked)";
				text += "<br>Req: " + formatWhole(this.requirement) + " acclimation points";
				return text;
			},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		13: {
			requirement: 24,
			requirementDescription: "CRA enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.25)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		14: {
			requirement: 26,
			requirementDescription: "SOV enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.mul(10).add(1).pow(0.2525)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		15: {
			requirement: 28,
			requirementDescription: "FER enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.32)},
			effectDescription() {return "multiply the base effect of FER based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		16: {
			requirement: 32,
			requirementDescription: "Retrogression enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.036).sub(1)},
			effectDescription() {return "increase the base of the 7th retrogression's last effect based on acclimation points<br>Effect: +" + format(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		17: {
			requirement: 34,
			requirementDescription: "Population enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.66)},
			effectDescription() {return "multiply the last population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		18: {
			requirement: 35,
			requirementDescription: "CRA enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {
				if (hasMilestone("a", 32)) return getBuyableAmount("a", 11).div(2).floor();
				return getBuyableAmount("a", 11).div(3).floor();
			},
			effectDescription() {return "every " + (hasMilestone("a", 32) ? 2 : 3) + " base levels of CRA give an extra level to FER, ANA, and SOV<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		19: {
			requirement: 37,
			requirementDescription: "Retrogression enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.23},
			effectDescription() {return "increase the exponent of the 6th retrogression's last effect by 0.23<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		20: {
			requirement: 40,
			requirementDescription: "ANA enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {
				if (hasMilestone("a", 32)) return getBuyableAmount("a", 13).div(2).floor();
				return getBuyableAmount("a", 13).div(3).floor();
			},
			effectDescription() {return "every " + (hasMilestone("a", 32) ? 2 : 3) + " base levels of ANA give an extra level to CRA, FER, and SOV<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		21: {
			requirement: 43,
			requirementDescription: "Retrogression enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.75},
			effectDescription() {return "increase the exponent of the 8th retrogression's last effect by 0.75<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		22: {
			requirement: 46,
			requirementDescription: "SOV enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {
				if (hasMilestone("a", 32)) return getBuyableAmount("a", 14).div(2).floor();
				return getBuyableAmount("a", 14).div(3).floor();
			},
			effectDescription() {return "every " + (hasMilestone("a", 32) ? 2 : 3) + " base levels of SOV give an extra level to CRA, FER, and ANA<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		23: {
			requirement: 49,
			requirementDescription: "Retrogression enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.474},
			effectDescription() {return "increase the exponent of the 9th retrogression's last effect by 0.474<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		24: {
			requirement: 50,
			requirementDescription: "FER enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {
				if (hasMilestone("a", 32)) return getBuyableAmount("a", 12).div(2).floor();
				return getBuyableAmount("a", 12).div(3).floor();
			},
			effectDescription() {return "every " + (hasMilestone("a", 32) ? 2 : 3) + " base levels of FER give an extra level to CRA, ANA, and SOV<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		25: {
			requirement: 53,
			requirementDescription: "Population enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.2758664)},
			effectDescription() {return "multiply the last two population effects based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		26: {
			requirement: 57,
			requirementDescription: "CRA enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		27: {
			requirement: 60,
			requirementDescription: "SOV enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		28: {
			requirement: 64,
			requirementDescription: "ANA enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.2},
			effectDescription() {return "increase the base effect of ANA by 0.2<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		29: {
			requirement: 67,
			requirementDescription: "Retrogression enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base of the 10th retrogression's first effect by 2<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		30: {
			requirement: 69,
			requirementDescription: "FER enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.095)},
			effectDescription() {return "multiply the base effect of FER based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		31: {
			requirement: 70,
			requirementDescription: "Population enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.mul(2).add(1).pow(0.88477)},
			effectDescription() {return "multiply the exponent of the first population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		32: {
			requirement: 74,
			requirementDescription: "Synergy enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "decrease the base levels of CRA, FER, ANA, and SOV required<br>to give extra levels to the other stats by 1 (from 3 to 2)<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		33: {
			requirement: 80,
			requirementDescription: "Retrogression enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 8},
			effectDescription() {return "increase the base of the 10th retrogression's first effect by 8<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		34: {
			requirement: 84,
			requirementDescription: "Population enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.025},
			effectDescription() {return "increase the exponent of the second population effect by 0.025<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		35: {
			requirement: 88,
			requirementDescription: "FER enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.145)},
			effectDescription() {return "multiply the base effect of FER based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		36: {
			requirement: 90,
			requirementDescription: "SOV enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.1048)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		37: {
			requirement: 96,
			requirementDescription: "CRA enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.105)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		38: {
			requirement: 99,
			requirementDescription: "ANA enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.3},
			effectDescription() {return "increase the base effect of ANA by 0.3<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		39: {
			requirement: 105,
			requirementDescription: "Consciousness enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				let text = "unlock a new layer";
				if (player.cb.unlocked) text += " (already unlocked)";
				text += "<br>Req: " + formatWhole(this.requirement) + " acclimation points and 22 completions of the 10th retrogression";
				return text;
			},
			done() {return player.a.points.gte(this.requirement) && challengeCompletions("e", 21) >= 22},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		40: {
			requirement: 114,
			requirementDescription: "Population enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return new Decimal(1.033333333333333).pow(player.a.points)},
			effectDescription() {return "multiply the exponent of the first population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		41: {
			requirement: 122,
			requirementDescription: "Population enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return new Decimal(1.15).pow(player.a.points.pow(0.5))},
			effectDescription() {return "multiply the last population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		42: {
			requirement: 128,
			requirementDescription: "Retrogression enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 8},
			effectDescription() {return "increase the completion limit of the 10th retrogression by 8<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		43: {
			requirement: 135,
			requirementDescription: "Synergy enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("a", 11).min(getBuyableAmount("a", 12)).min(getBuyableAmount("a", 13)).min(getBuyableAmount("a", 14)).div(4).floor()},
			effectDescription() {return "every 4 base levels of CRA, FER, ANA, and SOV give an extra level to CRA, FER, ANA, and SOV<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		44: {
			requirement: 146,
			requirementDescription: "Retrogression enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 15},
			effectDescription() {return "increase the base of the 10th retrogression's first effect by 15<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		45: {
			requirement: 150,
			requirementDescription: "Population enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.925)},
			effectDescription() {return "multiply the exponent of the first population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		46: {
			requirement: 159,
			requirementDescription: "CRA enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		47: {
			requirement: 166,
			requirementDescription: "SOV enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		48: {
			requirement: 173,
			requirementDescription: "FER enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.05)},
			effectDescription() {return "multiply the base effect of FER based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		49: {
			requirement: 180,
			requirementDescription: "ANA enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.5},
			effectDescription() {return "increase the base effect of ANA by 0.5<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		50: {
			requirement: 190,
			requirementDescription: "Consciousness enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.25)},
			effectDescription() {return "divide focus requirement based on acclimation points<br>Effect: /" + format(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points and 35 completions of the 10th retrogression"},
			done() {return player.a.points.gte(this.requirement) && challengeCompletions("e", 21) >= 35},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		51: {
			requirement: 193,
			requirementDescription: "Population enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.29922)},
			effectDescription() {return "multiply the last population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		52: {
			requirement: 196,
			requirementDescription: "Retrogression enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "increase the base of the 10th retrogression's third effect by 0.05<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		53: {
			requirement: 206,
			requirementDescription: "Consciousness enhancement III",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "give both types of focus points an additional effect<br>Req: " + formatWhole(this.requirement) + " acclimation points and 40 completions of the 10th retrogression"},
			done() {return player.a.points.gte(this.requirement) && challengeCompletions("e", 21) >= 40},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		54: {
			requirement: 218,
			requirementDescription: "Retrogression enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "gain 10th retrogression completions automatically<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.d.unlocked},
		},
		55: {
			requirement: 258,
			requirementDescription: "FER enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.125)},
			effectDescription() {return "multiply the base effect of FER based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		56: {
			requirement: 266,
			requirementDescription: "SOV enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.115)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		57: {
			requirement: 284,
			requirementDescription: "Consciousness enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "greatly improve acclimation focus's second effect<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		58: {
			requirement: 310,
			requirementDescription: "ANA enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.5},
			effectDescription() {return "increase the base effect of ANA by 0.5<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		59: {
			requirement: 323,
			requirementDescription: "CRA enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.36)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>and reduce population max's influence on gain<br>Effects: " + format(this.effect()) + "x and -0.03<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		60: {
			requirement: 350,
			requirementDescription: "Population enhancement XII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.055},
			effectDescription() {return "increase the exponent of the second population effect by 0.055<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		61: {
			requirement: 394,
			requirementDescription: "Consciousness enhancement V",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "greatly improve evolution focus's second effect<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		62: {
			requirement: 405,
			requirementDescription: "Consciousness enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve conscious beings's last effect<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		63: {
			requirement: 438,
			requirementDescription: "ANA enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.5},
			effectDescription() {return "increase the base effect of ANA by 0.5<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		64: {
			requirement: 584,
			requirementDescription: "Population enhancement XIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.25},
			effectDescription() {return "increase the exponent of the second population effect by 0.25<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		65: {
			requirement: 622,
			requirementDescription: "SOV enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		66: {
			requirement: 704,
			requirementDescription: "CRA enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(1.5)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>and reduce population max's influence on gain<br>Effects: " + format(this.effect()) + "x and -0.14<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		67: {
			requirement: 705,
			requirementDescription: "FER enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("a", 12).div(hasMilestone("a", 74) ? 2 : 15).floor()},
			effectDescription() {return "every " + (hasMilestone("a", 74) ? 2 : 15) + " base levels of FER give an extra level to CRA, FER, ANA, and SOV<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		68: {
			requirement: 742,
			requirementDescription: "Consciousness enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "improve acclimation focus's effects<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		69: {
			requirement: 751,
			requirementDescription: "Domination enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.01888888888888889)},
			effectDescription() {return "divide domination requirement based on acclimation points<br>Effect: /" + format(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1) || player.ec.unlocked},
		},
		70: {
			requirement: 786,
			requirementDescription: "ANA enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.15151515151515152)},
			effectDescription() {return "increase the base effect of ANA based on acclimation points<br>Effect: +" + format(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		71: {
			requirement: 897,
			requirementDescription: "Domination enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.02)},
			effectDescription() {return "divide domination requirement based on acclimation points<br>Effect: /" + format(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		72: {
			requirement: 1305,
			requirementDescription: "SOV enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(5)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		73: {
			requirement: 1440,
			requirementDescription: "CRA enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(10)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>and reduce population max's influence on gain<br>Effects: " + format(this.effect()) + "x and -0.17<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		74: {
			requirement: 1809,
			requirementDescription: "FER enhancement X",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "decrease the base levels of FER required to give extra levels to<br>CRA, FER, ANA, and SOV from <b>FER enhancement IX</b> by 13 (from 15 to 2)<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
	},
});
