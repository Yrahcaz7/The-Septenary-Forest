function getGrowthStatCost(amt, scale = false) {
	if (!hasChallenge("e", 12)) amt = amt.add(1);
	let mult = 1;
	if (inChallenge("e", 21)) mult *= 10;
	if (amt.gte(100)) {
		if (scale) return amt.sub(100).pow(0.5).pow_base(1.5).mul(100).mul(mult).floor();
		return amt.sub(100).mul(10).add(100).mul(mult);
	};
	return amt.mul(mult);
};

function getGrowthExtraStats(extra) {
	if (inChallenge("e", 21)) return newDecimalZero();
	if (tmp.a.effect[2]) extra = extra.add(tmp.a.effect[2]);
	if (tmp.cb.effect[2]) extra = extra.mul(tmp.cb.effect[2]);
	if (tmp.em.effect[4]) extra = extra.pow(tmp.em.effect[4]);
	return extra.floor();
};

addLayer("g", {
	name: "Growth",
	symbol: "G",
	position: 0,
	branches: ["s"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		spent: newDecimalZero(),
		autoSTR: false,
		autoWIS: false,
		autoAGI: false,
		autoINT: false,
	}},
	color: "#E5B55A",
	resource: "growth points",
	row: 1,
	baseResource: "stimulations",
	baseAmount() {return player.s.points},
	requires: new Decimal(100000000),
	type: "static",
	base() {
		let base = (inChallenge("sp", 18) ? 1e100 : (inChallenge("e", 17) || inChallenge("e", 21) ? 10 : 2));
		if (inChallenge("e", 18)) return base;
		if (hasUpgrade("s", 84)) base -= upgradeEffect("s", 84);
		if (hasMilestone("g", 18)) base -= milestoneEffect("g", 18);
		if (hasMilestone("g", 25)) base -= milestoneEffect("g", 25);
		if (hasMilestone("g", 31)) base -= milestoneEffect("g", 31);
		if (hasMilestone("g", 36)) base -= milestoneEffect("g", 36);
		if (hasMilestone("g", 38)) base -= milestoneEffect("g", 38);
		if (hasMilestone("g", 44)) base -= milestoneEffect("g", 44);
		if (hasMilestone("g", 49)) base -= milestoneEffect("g", 49);
		if (hasMilestone("g", 53)) base -= milestoneEffect("g", 53);
		if (hasMilestone("g", 59)) base -= milestoneEffect("g", 59);
		if (hasMilestone("g", 68)) base -= milestoneEffect("g", 68);
		if (hasMilestone("g", 74)) base -= milestoneEffect("g", 74);
		if (player.e.points.gte(570)) base -= 0.025;
		if (player.e.points.gte(635)) base -= 0.015;
		if (player.e.points.gte(974)) base -= 0.002;
		if (hasChallenge("e", 18)) base -= 0.01;
		return base;
	},
	exponent() {return inChallenge("co", 11) ? new Decimal(hasMilestone("r", 43) ? 500 : 1000).div(player.co.points.add(1)).max(1) : 1},
	canBuyMax() {return hasMilestone("g", 8) || player.e.unlocked},
	resetDescription: "Grow for ",
	gainMult() {
		let mult = newDecimalOne();
		if (inChallenge("e", 18)) return mult;
		if (inChallenge("e", 21)) {
			if (player.e.points.gte(1425)) return mult.div(buyableEffect("g", 13)).div(new Decimal("1e1000000").pow(player.e.points.sub(1000).max(0)));
			else if (player.e.points.gte(940)) return mult.div(buyableEffect("g", 13)).div(new Decimal("1e100000").pow(player.e.points.sub(900).max(0)));
			else return mult.div(buyableEffect("g", 13)).div(new Decimal(1e10).pow(player.e.points.sub(200).max(0)));
		};
		if (hasUpgrade("s", 51)) mult = mult.div(upgradeEffect("s", 51));
		if (hasUpgrade("s", 53)) mult = mult.div(upgradeEffect("s", 53));
		if (player.g.unlocked) mult = mult.div(buyableEffect("g", 13));
		if (hasChallenge("e", 13) && tmp.e.effect[5]) mult = mult.div(tmp.e.effect[5]);
		if (tmp.a.effect[0]) mult = mult.div(tmp.a.effect[0]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		return mult;
	},
	resetsNothing() {return hasMilestone("g", 36) || player.cy.unlocks[0] >= 2},
	autoPrestige() {return (hasMilestone("g", 36) && player.e.points.gte(60) && player.sp.unlocked) || player.l.points.gte(3) || player.cy.unlocks[0] >= 2},
	effectDescription() {return "of which " + formatWhole(player[this.layer].points.sub(player[this.layer].spent)) + " are unspent"},
	tabFormat() {return getStatDisplay("g", player.e.points.gte(30) || player.sp.unlocked)},
	layerShown() {return hasUpgrade("s", 35) || player.g.unlocked},
	hotkeys: [{
		key: "g",
		description: "G: reset for growth points",
		onPress() {if (player.g.unlocked) doReset("g")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		const keep = ["autoSTR", "autoWIS", "autoAGI", "autoINT"];
		if (player.cy.unlocks[1] >= 1
			|| player.l.points.gte(5)
			|| player.r.points.gte(6)
			|| (layers[resettingLayer].row <= 3 && player.cb.unlocked)
		) keep.push("milestones", "lastMilestone");
		if (keep.includes("milestones")) {
			layerDataReset("g", keep);
		} else {
			const keepMile = [];
			let keepMileNum = 0;
			if (layers[resettingLayer].row == 2 && player.e.points.gte(36)) keepMileNum = 41;
			else if (resettingLayer == "e" && hasChallenge("e", 12)) keepMileNum = 16;
			for (let index = 0; index < player.g.milestones.length; index++) {
				if (player.g.milestones[index] < keepMileNum) {
					keepMile.push(player.g.milestones[index]);
				};
			};
			layerDataReset("g", keep);
			player.g.milestones = keepMile;
		};
	},
	automate() {
		if (player.e.points.gte(30) || player.sp.unlocked) {
			if (player.g.autoSTR) buyBuyable("g", 11);
			if (player.g.autoWIS) buyBuyable("g", 12);
			if (player.g.autoAGI) buyBuyable("g", 13);
			if (player.g.autoINT) buyBuyable("g", 14);
		};
	},
	componentStyles: {
		buyable: {width: "210px", height: "110px"},
		clickable: {"min-height": "30px", transform: "none"},
	},
	buyables: {
		11: {
			cost(amt) {return getGrowthStatCost(amt)},
			effectBase() {
				let base = new Decimal(2.5);
				if (hasMilestone("g", 1)) base = base.mul(milestoneEffect("g", 1));
				if (hasMilestone("g", 6)) base = base.mul(milestoneEffect("g", 6));
				if (hasMilestone("g", 11)) base = base.mul(milestoneEffect("g", 11));
				if (hasMilestone("g", 14)) base = base.mul(milestoneEffect("g", 14));
				if (hasMilestone("g", 21)) base = base.mul(milestoneEffect("g", 21));
				if (hasMilestone("g", 27)) base = base.mul(milestoneEffect("g", 27));
				if (hasMilestone("g", 34)) base = base.mul(milestoneEffect("g", 34));
				if (hasMilestone("g", 43)) base = base.mul(milestoneEffect("g", 43));
				if (hasMilestone("g", 54)) base = base.mul(milestoneEffect("g", 54));
				if (hasMilestone("g", 61)) base = base.mul(milestoneEffect("g", 61));
				if (hasMilestone("g", 66)) base = base.mul(milestoneEffect("g", 66));
				return base;
			},
			effect(amt) {return amt.add(this.extra()).pow_base(this.effectBase())},
			title: "(STR)ENGTH",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "multiply power gain by " + format(b.effectBase) + "<br><br>Effect: " + format(b.effect) + "x<br><br>Cost: " + formatWhole(b.cost) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(b.purchaseLimit) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
			},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 54)) max += 90;
				if (hasMilestone("g", 61)) max += 750;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && !inChallenge("e", 12) && !inChallenge("e", 16)},
			buy() {
				if (!inChallenge("e", 21)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(getStatBulk()).min(1000));
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("g", 63) && player.g.resetTime) extra = extra.add(milestoneEffect("g", 63));
				if (tmp.e.effect[0]) extra = extra.add(tmp.e.effect[0]);
				return getGrowthExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(1000)) return {"border-color": "#E5B55A"}},
		},
		12: {
			cost(amt) {return getGrowthStatCost(amt)},
			effectBase() {
				let base = new Decimal(2);
				if (hasMilestone("g", 0)) base = base.mul(milestoneEffect("g", 0));
				if (hasMilestone("g", 2)) base = base.mul(milestoneEffect("g", 2));
				if (hasMilestone("g", 10)) base = base.mul(milestoneEffect("g", 10));
				if (hasMilestone("g", 17)) base = base.mul(milestoneEffect("g", 17));
				if (hasMilestone("g", 20)) base = base.mul(milestoneEffect("g", 20));
				if (hasMilestone("g", 28)) base = base.mul(milestoneEffect("g", 28));
				if (hasMilestone("g", 33)) base = base.mul(milestoneEffect("g", 33));
				if (hasMilestone("g", 42)) base = base.mul(milestoneEffect("g", 42));
				if (hasMilestone("g", 56)) base = base.mul(milestoneEffect("g", 56));
				if (hasMilestone("g", 62)) base = base.mul(milestoneEffect("g", 62));
				if (hasMilestone("g", 71)) base = base.mul(milestoneEffect("g", 71));
				return base;
			},
			effect(amt) {return amt.add(this.extra()).pow_base(this.effectBase())},
			title: "(WIS)DOM",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "multiply stimulation gain by " + format(b.effectBase) + "<br><br>Effect: " + format(b.effect) + "x<br><br>Cost: " + formatWhole(b.cost) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(b.purchaseLimit) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
			},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 56)) max += 90;
				if (hasMilestone("g", 62)) max += 750;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && !inChallenge("e", 12) && !inChallenge("e", 16)},
			buy() {
				if (!inChallenge("e", 21)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(getStatBulk()).min(1000));
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("g", 63) && player.g.resetTime) extra = extra.add(milestoneEffect("g", 63));
				if (tmp.e.effect[1]) extra = extra.add(tmp.e.effect[1]);
				return getGrowthExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(1000)) return {"border-color": "#E5B55A"}},
		},
		13: {
			cost(amt) {return getGrowthStatCost(amt)},
			effectBase() {
				if (hasMilestone("g", 46)) {
					let base = new Decimal(milestoneEffect("g", 46));
					if (hasMilestone("g", 51)) base = base.mul(milestoneEffect("g", 51));
					if (hasMilestone("g", 58)) base = base.mul(milestoneEffect("g", 58));
					if (hasMilestone("g", 65)) base = base.mul(milestoneEffect("g", 65));
					return base;
				};
				let base = new Decimal(4);
				if (hasMilestone("g", 4)) base = base.add(milestoneEffect("g", 4));
				if (hasMilestone("g", 5)) base = base.add(milestoneEffect("g", 5));
				if (hasMilestone("g", 9)) base = base.add(milestoneEffect("g", 9));
				if (hasMilestone("g", 16)) base = base.add(milestoneEffect("g", 16));
				if (hasMilestone("g", 22)) base = base.add(milestoneEffect("g", 22));
				if (hasMilestone("g", 30)) base = base.add(milestoneEffect("g", 30));
				return base;
			},
			effect(amt) {return amt.add(this.extra()).pow_base(this.effectBase())},
			title: "(AGI)LITY",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "divide growth requirement by " + formatWhole(b.effectBase) + " (minimum requirement: 100,000,000)<br><br>Effect: /" + format(b.effect) + "<br><br>Cost: " + formatWhole(b.cost) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(b.purchaseLimit) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
			},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 46)) max += 840;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && !inChallenge("e", 12) && !inChallenge("e", 16)},
			buy() {
				if (!inChallenge("e", 21)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(getStatBulk()).min(1000));
			},
			extra() {
				let extra = newDecimalZero();
				if (tmp.e.effect[2]) extra = extra.add(tmp.e.effect[2]);
				if (hasMilestone("g", 37)) extra = extra.add(milestoneEffect("g", 37));
				return getGrowthExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(1000)) return {"border-color": "#E5B55A"}},
		},
		14: {
			cost(amt) {return getGrowthStatCost(amt, true)},
			effectMax() {
				if (hasChallenge("e", 11)) return new Decimal(0.5);
				if (hasMilestone("g", 3)) {
					let max = new Decimal(10);
					if (hasMilestone("g", 13)) max = max.add(milestoneEffect("g", 13));
					if (hasMilestone("g", 23)) max = max.add(milestoneEffect("g", 23));
					return max;
				};
				return Infinity;
			},
			effectBase() {
				if (hasChallenge("e", 11)) {
					let base = new Decimal(0.005);
					if (hasMilestone("g", 26)) base = base.add(milestoneEffect("g", 26));
					return base;
				};
				if (hasMilestone("g", 3)) {
					let base = newDecimalOne();
					if (hasMilestone("g", 7)) base = base.add(milestoneEffect("g", 7));
					if (hasMilestone("g", 12)) base = base.add(milestoneEffect("g", 12));
					return base;
				};
				return new Decimal(5);
			},
			effect(amt) {
				if (hasChallenge("e", 11)) {
					let eff = amt.add(this.extra()).pow(0.75).mul(this.effectBase());
					if (eff.gt(0.375)) eff = eff.sub(0.375).div(2.5).add(0.375);
					return eff.min(this.effectMax());
				};
				if (hasMilestone("g", 3)) return amt.add(this.extra()).mul(this.effectBase()).min(this.effectMax());
				return amt.add(this.extra()).pow_base(this.effectBase());
			},
			title: "(INT)ELLECT",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				if (hasChallenge("e", 11)) {
					if (b.effect.eq(b.effectMax)) return "increase the stimulation effect exponent by " + format(b.effectBase) + "<br><br>Effect: +" + format(b.effect) + " (maxed)<br><br>Cost: " + formatWhole(b.cost) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(b.purchaseLimit) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
					else if (b.effect.gt(0.375)) return "increase the stimulation effect exponent by " + format(b.effectBase) + "<br><br>Effect: +" + format(b.effect) + " (softcapped)<br><br>Cost: " + formatWhole(b.cost) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(b.purchaseLimit) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
					else return "increase the stimulation effect exponent by " + format(b.effectBase) + "<br>(effective INT is powered to 0.75)<br>Effect: +" + format(b.effect) + "<br><br>Cost: " + formatWhole(b.cost) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(b.purchaseLimit) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
				};
				if (hasMilestone("g", 3)) return "unlock " + format(b.effectBase) + " new stimulation upgrade" + (b.effectBase.eq(1) ? "" : "s") + "<br>(maxes at " + formatWhole(b.effectMax) + " new upgrades)<br><br>Effect: +" + format(b.effect) + "<br><br>Cost: " + formatWhole(b.cost) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(b.purchaseLimit) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
				return "divide previous upgrade costs by " + formatWhole(b.effectBase) + "<br>(upgrade costs are rounded down)<br><br>Effect: /" + format(b.effect) + "<br><br>Cost: " + formatWhole(b.cost) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(b.purchaseLimit) + (b.extra.eq(0) ? "" : " + " + formatWhole(b.extra));
			},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 57)) max += 40;
				if (hasMilestone("g", 63) && player.g.resetTime) max += 800;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && !inChallenge("e", 11) && !inChallenge("e", 16)},
			buy() {
				if (!inChallenge("e", 21)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(getStatBulk()).min(1000));
			},
			extra() {
				let extra = newDecimalZero();
				if (hasMilestone("g", 35)) extra = extra.add(milestoneEffect("g", 35));
				if (hasMilestone("g", 41)) extra = extra.add(milestoneEffect("g", 41));
				if (hasMilestone("g", 63) && player.g.resetTime) extra = extra.add(milestoneEffect("g", 63).min(5000));
				if (hasMilestone("g", 69)) extra = extra.add(milestoneEffect("g", 69));
				if (tmp.e.effect[3]) extra = extra.add(tmp.e.effect[3]);
				return getGrowthExtraStats(extra);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(1000)) return {"border-color": "#E5B55A"}},
		},
		respec() {
			if (getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) {
				setBuyableAmount("g", 11, new Decimal(100));
				setBuyableAmount("g", 12, new Decimal(100));
				setBuyableAmount("g", 13, new Decimal(100));
				setBuyableAmount("g", 14, new Decimal(100));
				if (hasChallenge("e", 12)) player.g.spent = new Decimal(19800);
				else player.g.spent = new Decimal(20200);
				if (getClickableState("g", 11) > 2) setClickableState("g", 11, 2);
			} else {
				setBuyableAmount("g", 11, newDecimalZero());
				setBuyableAmount("g", 12, newDecimalZero());
				setBuyableAmount("g", 13, newDecimalZero());
				setBuyableAmount("g", 14, newDecimalZero());
				player.g.spent = newDecimalZero();
				setClickableState("g", 11, 0);
			};
			doReset("g", true, true);
		},
		respecText: "respec growth points",
	},
	clickables: {
		11: {
			display() {return "<h2>-50</h2>"},
			canClick() {return getClickableState("g", 11) > 0 && !getClickableState("g", 14)},
			onClick() {setClickableState("g", 11, (getClickableState("g", 11) || 0) - 1)},
			onHold() {setClickableState("g", 11, (getClickableState("g", 11) || 0) - 1)},
			style: {width: "45px", "border-radius": "10px 0 0 10px"},
		},
		12: {
			display() {return "<h2>+50</h2>"},
			canClick() {
				let amt = new Decimal(((getClickableState("g", 11) || 0) + 1) * 50);
				return getBuyableAmount("g", 11).gte(amt) && getBuyableAmount("g", 12).gte(amt) && getBuyableAmount("g", 13).gte(amt) && getBuyableAmount("g", 14).gte(amt) && !getClickableState("g", 14);
			},
			onClick() {setClickableState("g", 11, (getClickableState("g", 11) || 0) + 1)},
			onHold() {setClickableState("g", 11, (getClickableState("g", 11) || 0) + 1)},
			style: {width: "45px", "border-radius": "0 10px 10px 0"},
		},
		13: {
			display() {return (getClickableState("g", 13) ? "Both" : "Only Base")},
			canClick() {return tmp.g.buyables[11].extra.gte(1) || tmp.g.buyables[12].extra.gte(1) || tmp.g.buyables[13].extra.gte(1) || tmp.g.buyables[14].extra.gte(1)},
			onClick() {
				setClickableState("g", 13, !getClickableState("g", 13));
				if (getClickableState("g", 13)) setClickableState("g", 14, false);
			},
			style: {width: "40px", "border-radius": "10px 0 0 10px"},
		},
		14: {
			display() {return (getClickableState("g", 14) ? "Both" : "Only Extra")},
			canClick() {return tmp.g.buyables[11].extra.gte(1) || tmp.g.buyables[12].extra.gte(1) || tmp.g.buyables[13].extra.gte(1) || tmp.g.buyables[14].extra.gte(1)},
			onClick() {
				setClickableState("g", 14, !getClickableState("g", 14));
				if (getClickableState("g", 14)) setClickableState("g", 13, false);
			},
			style: {width: "40px", "border-radius": "0 10px 10px 0"},
		},
	},
	milestones: {
		0: {
			requirement: 6,
			requirementDescription: "WIS enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.25).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
		},
		1: {
			requirement: 9,
			requirementDescription: "STR enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.75).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		2: {
			requirement: 12,
			requirementDescription: "WIS enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.45).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		3: {
			requirement: 21,
			requirementDescription: "INT enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "change the base effect of INT<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		4: {
			requirement: 40,
			requirementDescription: "AGI enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of AGI by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		5: {
			requirement: 48,
			requirementDescription: "AGI enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of AGI by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		6: {
			requirement: 66,
			requirementDescription: "STR enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.1).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		7: {
			requirement: 70,
			requirementDescription: "INT enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.25},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the base effect of INT by 0.25<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		8: {
			requirement: 90,
			requirementDescription: "Growth enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				if (player.cb.unlocked) return "effect overriden by conscious beings<br>Req: " + formatWhole(this.requirement) + " growth points";
				else if (inChallenge("e", 21)) return "effect overriden by the 10th retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else if (hasChallenge("e", 11)) return "keep all stimulation upgrades on growth resets<br>Req: " + formatWhole(this.requirement) + " growth points";
				else if (player.e.unlocked) return "keep the first fifteen stimulation upgrades on growth resets<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "unlock bulk growth<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		9: {
			requirement: 101,
			requirementDescription: "AGI enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 8},
			effectDescription() {return "increase the base effect of AGI by 8<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		10: {
			requirement: 121,
			requirementDescription: "WIS enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.25).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		11: {
			requirement: 140,
			requirementDescription: "STR enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.5).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		12: {
			requirement: 150,
			requirementDescription: "INT enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.75},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the base effect of INT by 0.75<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		13: {
			requirement: 166,
			requirementDescription: "INT enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 5},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the max effect of INT by 5<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		14: {
			requirement: 196,
			requirementDescription: "STR enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		15: {
			requirement: 300,
			requirementDescription: "Evolution enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				let text = "unlock a new layer";
				if (player.e.unlocked) text += " (already unlocked)";
				text += "<br>Req: " + formatWhole(this.requirement) + " growth points";
				return text;
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		16: {
			requirement: 400,
			requirementDescription: "AGI enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 16},
			effectDescription() {return "increase the base effect of AGI by 16<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		17: {
			requirement: 420,
			requirementDescription: "WIS enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.1).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		18: {
			requirement: 488,
			requirementDescription: "Growth enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease growth requirement base by 0.05<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		19: {
			requirement: 525,
			requirementDescription: "Evolution enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.5},
			effectDescription() {return "divide evolution requirement by 1.5<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		20: {
			requirement: 575,
			requirementDescription: "WIS enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.15).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		21: {
			requirement: 640,
			requirementDescription: "STR enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		22: {
			requirement: 715,
			requirementDescription: "AGI enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 32},
			effectDescription() {return "increase the base effect of AGI by 32<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		23: {
			requirement: 788,
			requirementDescription: "INT enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 5},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the max effect of INT by 5<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		24: {
			requirement: 1725,
			requirementDescription: "Evolution enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return hasChallenge("e", 11) ? 1.5 : 1},
			effectDescription() {
				if (hasChallenge("e", 11)) return "divide evolution requirement by 1.5<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "unlock something new in the evolution layer<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		25: {
			requirement: 2000,
			requirementDescription: "Growth enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.07},
			effectDescription() {return "decrease growth requirement base by 0.07<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		26: {
			requirement: 2666,
			requirementDescription: "INT enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.003},
			effectDescription() {return "increase the base effect of INT by 0.003<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		27: {
			requirement: 3725,
			requirementDescription: "STR enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		28: {
			requirement: 4050,
			requirementDescription: "WIS enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.055)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		29: {
			requirement: 4960,
			requirementDescription: "Evolution enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.425},
			effectDescription() {return "divide evolution requirement by 1.425<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		30: {
			requirement: 10000,
			requirementDescription: "AGI enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 935},
			effectDescription() {return "increase the base effect of AGI by 935<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		31: {
			requirement: 25300,
			requirementDescription: "Growth enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease growth requirement base by 0.01<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		32: {
			requirement: 26400,
			requirementDescription: "Evolution enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.25},
			effectDescription() {return "divide evolution requirement by 1.25<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		33: {
			requirement: 29450,
			requirementDescription: "WIS enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.066)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		34: {
			requirement: 32000,
			requirementDescription: "STR enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		35: {
			requirement: 34550,
			requirementDescription: "INT enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase extra INT levels by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		36: {
			requirement: 47175,
			requirementDescription: "Growth enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01},
			effectDescription() {
				if (player.cy.unlocks[0] >= 2) return "decrease growth requirement base by 0.01<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "growth resets (without respec) no longer reset anything<br>and decrease growth requirement base by 0.01<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		37: {
			requirement: 50950,
			requirementDescription: "AGI enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 50},
			effectDescription() {return "increase extra AGI levels by 50<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		38: {
			requirement: 53333,
			requirementDescription: "Growth enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease growth requirement base by 0.01<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		39: {
			requirement: 55155,
			requirementDescription: "Evolution enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.07},
			effectDescription() {return "divide evolution requirement by 1.07<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		40: {
			requirement: 64750,
			requirementDescription: "Acclimation enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				let text = "unlock a new layer";
				if (player.a.unlocked) text += " (already unlocked)";
				text += "<br>Req: " + formatWhole(this.requirement) + " growth points";
				return text;
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		41: {
			requirement: 77555,
			requirementDescription: "INT enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase extra INT levels by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		42: {
			requirement: 85555,
			requirementDescription: "WIS enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.03)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		43: {
			requirement: 164000,
			requirementDescription: "STR enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.11)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		44: {
			requirement: 190000,
			requirementDescription: "Growth enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.005},
			effectDescription() {return "decrease growth requirement base by 0.005<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		45: {
			requirement: 236250,
			requirementDescription: "Evolution enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.5666},
			effectDescription() {return "divide evolution requirement by 1.5666<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		46: {
			requirement: 238000,
			requirementDescription: "AGI enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1e10},
			effectDescription() {return "increase the base effect of AGI to 1e10<br>and increase its maximum by 840<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		47: {
			requirement: 254300,
			requirementDescription: "Evolution enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.487},
			effectDescription() {return "divide evolution requirement by 1.487<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		48: {
			requirement: 256000,
			requirementDescription: "Acclimation enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.75},
			effectDescription() {return "divide acclimation requirement by 1.75<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		49: {
			requirement: 258425,
			requirementDescription: "Growth enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.1858},
			effectDescription() {return "decrease growth requirement base by 0.1858<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		50: {
			requirement: 349333,
			requirementDescription: "Evolution enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05732},
			effectDescription() {return "decrease evolution requirement base by 0.05732<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		51: {
			requirement: 352750,
			requirementDescription: "AGI enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1e15},
			effectDescription() {return "multiply the base effect of AGI by 1e15<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		52: {
			requirement: 400450,
			requirementDescription: "Acclimation enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.75},
			effectDescription() {return "divide acclimation requirement by 1.75<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		53: {
			requirement: 419625,
			requirementDescription: "Growth enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease growth requirement base by 0.05<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		54: {
			requirement: 467850,
			requirementDescription: "STR enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1e20).add(1).pow(0.555)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>and increase its maximum by 90<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		55: {
			requirement: 664750,
			requirementDescription: "Evolution enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.045875},
			effectDescription() {return "decrease evolution requirement base by 0.045875<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		56: {
			requirement: 842525,
			requirementDescription: "WIS enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1e10).add(1).pow(0.459)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>and increase its maximum by 90<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		57: {
			requirement: 1957700,
			requirementDescription: "INT enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "increase the maximum of INT by 40<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		58: {
			requirement: 2459000,
			requirementDescription: "AGI enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1e25},
			effectDescription() {return "multiply the base effect of AGI by 1e25<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		59: {
			requirement: 2769360,
			requirementDescription: "Growth enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.12},
			effectDescription() {return "decrease growth requirement base by 0.12<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		60: {
			requirement: 8658450,
			requirementDescription: "Acclimation enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.222},
			effectDescription() {return "divide acclimation requirement by 1.222<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		61: {
			requirement: 14606750,
			requirementDescription: "STR enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(2e20).add(1).pow(2.5)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>and increase its maximum by 750<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		62: {
			requirement: 20968222,
			requirementDescription: "WIS enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1.5177e20).add(1).pow(17.77)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>and increase its maximum by 750<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		63: {
			requirement: 68729900,
			requirementDescription: "INT enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("g", 14).add(tmp.g.buyables[14].extra).sub(248).div(2).floor().max(0)},
			effectDescription() {return "every 2 INT past 248 gives 1 extra STR, WIS, and INT<br>and increase the maximum of INT by 800<br>(extra INT levels from this enhancement max at 5,000)<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		64: {
			requirement: 102912250,
			requirementDescription: "Evolution enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.04762644},
			effectDescription() {return "decrease evolution requirement base by 0.04762644<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		65: {
			requirement: 122206000,
			requirementDescription: "AGI enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return new Decimal("1e7000")},
			effectDescription() {return "multiply the base effect of AGI by 1e7000<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		66: {
			requirement: 325223444,
			requirementDescription: "STR enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1e10).add(1).pow(39.3393)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		67: {
			requirement: 471368666,
			requirementDescription: "Acclimation enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.142295},
			effectDescription() {return "decrease acclimation requirement base by 0.142295<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		68: {
			requirement: 500472500,
			requirementDescription: "Growth enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.09912925},
			effectDescription() {return "decrease growth requirement base by 0.09912925<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		69: {
			requirement: 1450790500,
			requirementDescription: "INT enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.40495).sub(1).floor()},
			effectDescription() {return "increase extra INT levels based on growth points<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		70: {
			requirement: 2865557000,
			requirementDescription: "Evolution enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.0273939},
			effectDescription() {return "decrease evolution requirement base by 0.0273939<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		71: {
			requirement: 3632610555,
			requirementDescription: "WIS enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1.495575e10).add(1).pow(32)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		72: {
			requirement: 10812520000,
			requirementDescription: "Acclimation enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.042},
			effectDescription() {return "decrease acclimation requirement base by 0.042<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		73: {
			requirement: 38377554000,
			requirementDescription: "Evolution enhancement XII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01022},
			effectDescription() {return "decrease evolution requirement base by 0.01022<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		74: {
			requirement: 59805129250,
			requirementDescription: "Growth enhancement XII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.225024093},
			effectDescription() {return "decrease growth requirement base by 0.225024093<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
	},
});
