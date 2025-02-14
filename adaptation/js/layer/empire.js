function getFactionSize() {
	if (hasMilestone("em", 12) && player.em.points.gte(4)) return buyableEffect("em", 21).add(buyableEffect("em", 22)).min(player.l.points);
	return newDecimalZero();
};

function getEconomyClickValue() {
	let value = new Decimal(0.0001);
	if (hasBuyable("em", 31)) value = value.mul(buyableEffect("em", 31));
	if (hasBuyable("em", 33)) value = value.mul(buyableEffect("em", 33));
	if (tmp.em.effect[6]) value = value.div(tmp.em.effect[6]);
	return value.toNumber();
};

addLayer("em", {
	name: "Empire",
	symbol: "EM",
	position: 1,
	branches: ["l", "ex", "t"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		spent: 0,
	}},
	color: "#B44990",
	nodeStyle() {if (tmp.em.canReset || player.em.unlocked) return {"background": "border-box linear-gradient(to right, #55B020, #B44990, #C77055)"}},
	resource: "empires",
	row: 6,
	baseResource: "expansion points",
	baseAmount() {return player.ex.points},
	requires: new Decimal(500),
	type: "static",
	base: 1.5,
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Imperialize for ",
	gainMult() {
		let mult = newDecimalOne();
		if (tmp.em.effect[3]) mult = mult.div(tmp.em.effect[3]);
		return mult;
	},
	effect() {
		let phaseEffExp = 0.171;
		if (hasMilestone("em", 18)) phaseEffExp += 0.066;
		if (hasMilestone("em", 23)) phaseEffExp += 0.025;
		let thirdSectorEff = (hasMilestone("em", 34) ? (getClickableState("em", 22) || 0) * (hasMilestone("r", 115) ? 10 : 5) : 0);
		let eff = [
			player.em.points.mul(hasMilestone("em", 1) ? 2 : 1),
			player.em.points.div(10).add(1),
			player.em.points.mul(2).add(thirdSectorEff),
			new Decimal(player.em.milestones.length + 1).pow(phaseEffExp),
			(hasMilestone("em", 12) && player.em.points.gte(4) ? getFactionSize().div(100).add(1) : newDecimalOne()),
			(hasMilestone("em", 28) && player.em.points.gte(8) ? (getClickableState("em", 22) || 0) / 10 : newDecimalOne()),
			(hasMilestone("em", 28) && player.em.points.gte(8) ? new Decimal(1000).pow(getClickableState("em", 22) || 0) : newDecimalOne()),
			thirdSectorEff,
		];
		if (eff[4].gte(1.02)) eff[4] = eff[4].sub(1.02).div(5).add(1.02);
		return eff;
	},
	effectDescription() {
		if (player.cy.unlocks[3] >= 8) return "which are increasing leader and territory amounts in their effects by +" + formatWhole(tmp.em.effect[0]) + " and directly multiplying expansion point gain by " + format(tmp.em.effect[1]) + "x";
		return "which are increasing leader amount in its effects by +" + formatWhole(tmp.em.effect[0]) + " and directly multiplying expansion point gain by " + format(tmp.em.effect[1]) + "x";
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", "After consolidating 1 time, you keep domination enhancements on all resets.<br><br>The above extra effect will not go away even if this layer is reset."],
		"blank",
		["microtabs", "features"],
		"blank",
	],
	layerShown() {return hasMilestone("d", 59) || player.em.unlocked},
	hotkeys: [{
		key: "m",
		description: "M: reset for empires",
		onPress() {if (player.em.unlocked) doReset("em")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("em", keep);
	},
	shouldNotify() {
		if (hasMilestone("em", 12) && player.em.points.gte(4))
			for (const key in tmp.em.buyables)
				if (key > 20 && tmp.em.buyables[key]?.unlocked && tmp.em.buyables[key]?.canAfford) return true;
	},
	componentStyles: {
		"prestige-button"() {if (tmp.em.canReset && tmp.em.nodeStyle) return tmp.em.nodeStyle},
		"microtabs"() {return {"box-sizing": "border-box", "width": "fit-content", "max-width": "calc(100% - 34px)", "border": "2px solid #B44990", "padding": "8.5px"}},
		"tab-button"() {return {"margin": "8.5px"}},
	},
	microtabs: {
		features: {
			"Aspects": {
				content() {
					if (player.em.points.lt(1)) return [["display-text", "Reach 1 empire to unlock Aspects"]];
					return [
						["display-text", "You have <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + formatWhole(tmp.em.effect[2].sub(tmp.em.effect[7])) + "</h2>" + (tmp.em.effect[7] ? "+" + formatWhole(tmp.em.effect[7]) : "") + " aspect points, of which " + formatWhole(tmp.em.effect[2].sub(player.em.spent)) + " are unspent<br><br>Buying an aspect costs 1 aspect point."],
						"blank",
						["row", [
							["column", [["buyable", 11], ["blank", "75px"], ["buyable", 12]]],
							["column", [["display-text", getStatSVG("em")]]],
							["column", [["buyable", 13], ["blank", "75px"], ["buyable", 14]]],
						]],
						"respec-button",
					];
				},
				style: {"margin": "8.5px"},
				unlocked() {return player.em.points.gte(1)},
			},
			"Phases": {
				content() {
					if (player.em.points.lt(2)) return [["display-text", "Reach 2 empires to unlock Phases"]];
					return [
						["display-text", "You have <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + formatWhole(player.em.milestones.length) + "</h2> phases, which are dividing empire requirement by /" + format(tmp.em.effect[3])],
						"blank",
						"milestones",
					];
				},
				style: {"margin": "8.5px"},
				unlocked() {return player.em.points.gte(2)},
			},
			"Factions": {
				content() {
					if (player.em.points.lt(4)) return [["display-text", "Reach 4 empires to unlock Factions"]];
					return [
						["display-text", "You have <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + formatWhole(getFactionSize()) + "</h2>/" + formatWhole(player.l.points) + " leaders in your faction, which exponentiates extra stats from rows 4 and below by ^" + format(tmp.em.effect[4])],
						"blank",
						["row", [["buyable", 21], ["buyable", 22]]],
					];
				},
				style: {"margin": "8.5px"},
				unlocked() {return hasMilestone("em", 12)},
			},
			"Sectors": {
				content() {
					if (player.em.points.lt(8)) return [["display-text", "Reach 8 empires to unlock Sectors"]];
					return [
						["display-text", "You have taken over <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + formatWhole(getClickableState("em", 22) || 0) + "</h2>/5 economic sectors, which decreases the cost exponent of <b>Political Pressure</b> by -" + format(tmp.em.effect[5]) + (hasMilestone("em", 34) ?
							"; divides claim amount, <b>Grand Schemes</b> cost, and <b>Begin the Hunt</b> cost by /" + format(tmp.em.effect[6]) + "; and provides " + formatWhole(tmp.em.effect[7]) + " extra cyclical cores and aspect points"
							: " and divides claim amount, <b>Grand Schemes</b> cost, and <b>Begin the Hunt</b> cost by /" + format(tmp.em.effect[6])
						) + "<br><br>You are <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + format((getClickableState("em", 21) || 0) * 100, 3) + "</h2>% of the way to taking over an economic sector"],
						"blank",
						["row", [["clickable", 21], ["clickable", 22]]],
						"blank",
						["row", [["buyable", 31], ["buyable", 32], ["buyable", 33]]],
					];
				},
				style: {"margin": "8.5px"},
				unlocked() {return hasMilestone("em", 28)},
			},
		},
	},
	buyables: {
		11: {
			cost(amt) {return amt.add(1).mul(hasMilestone("em", 6) ? 450 : 500)},
			effect(amt) {
				let eff = amt.mul(1);
				if (hasMilestone("em", 2)) eff = eff.add(milestoneEffect("em", 2));
				if (hasMilestone("em", 10)) eff = eff.add(milestoneEffect("em", 10));
				if (hasMilestone("em", 19)) eff = eff.add(milestoneEffect("em", 19));
				if (hasMilestone("em", 24)) eff = eff.add(milestoneEffect("em", 24));
				if (hasMilestone("em", 29)) eff = eff.add(milestoneEffect("em", 29));
				if (hasMilestone("em", 33)) eff = eff.add(milestoneEffect("em", 33));
				return eff;
			},
			title: "(ECO)SYSTEM ASPECT",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "unlock 1 more ANACHRONISM tier<br><br>Effect: +" + formatWhole(b.effect) + "<br><br>Req: " + formatWhole(b.cost) + " ecosystems<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() {return player.ec.points.gte(this.cost()) && tmp.em.effect[2].sub(player[this.layer].spent).gte(1)},
			buy() {
				player[this.layer].spent++;
				addBuyables(this.layer, this.id, 1);
			},
			style: {"width": "210px", "height": "110px"},
		},
		12: {
			cost(amt) {return amt.add(1).mul(hasMilestone("em", 4) ? 450 : 500)},
			effectBase() {
				let base = 0.05;
				if (hasMilestone("em", 8)) base += milestoneEffect("em", 8);
				if (hasMilestone("em", 14)) base += milestoneEffect("em", 14);
				if (hasMilestone("em", 17)) base += milestoneEffect("em", 17);
				if (hasMilestone("em", 22)) base += milestoneEffect("em", 22);
				if (hasMilestone("em", 26)) base += milestoneEffect("em", 26);
				if (hasMilestone("em", 32)) base += milestoneEffect("em", 32);
				return base;
			},
			effect(amt) {
				let eff = amt.mul(this.effectBase());
				if (eff.gte(0.5)) eff = eff.sub(0.5).div(2).add(0.5);
				return eff;
			},
			title: "(REV)OLUTION ASPECT",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "increase change gain exponent by " + format(b.effectBase) + " (also influence limit)<br><br>Effect: +" + format(b.effect) + (b.effect.gte(0.5) ? " (softcapped)" : "") + "<br><br>Req: " + formatWhole(b.cost) + " revolutions<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() {return player.r.points.gte(this.cost()) && tmp.em.effect[2].sub(player[this.layer].spent).gte(1)},
			buy() {
				player[this.layer].spent++;
				addBuyables(this.layer, this.id, 1);
			},
			style: {"width": "210px", "height": "110px"},
		},
		13: {
			cost(amt) {return amt.add(1).mul(hasMilestone("em", 9) ? 450 : 500)},
			effectBase() {
				let base = 0.1;
				if (challengeCompletions("ec", 11) >= 29 && challengeEffect("ec", 11)[28]) base += challengeEffect("ec", 11)[28];
				if (hasMilestone("em", 0)) base += milestoneEffect("em", 0);
				if (hasMilestone("em", 7)) base += milestoneEffect("em", 7);
				if (hasMilestone("em", 13)) base += milestoneEffect("em", 13);
				if (hasMilestone("em", 15)) base += milestoneEffect("em", 15);
				if (hasMilestone("em", 21)) base += milestoneEffect("em", 21);
				if (hasMilestone("em", 25)) base += milestoneEffect("em", 25);
				if (hasMilestone("em", 31)) base += milestoneEffect("em", 31);
				return base;
			},
			effect(amt) {
				let eff = amt.mul(this.effectBase());
				if (eff.gte(1)) eff = eff.sub(1).div(2).add(1);
				return eff;
			},
			title: "(EXP)ANSION ASPECT",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "increase influence gain exponent by " + format(b.effectBase) + "<br><br>Effect: +" + format(b.effect) + (b.effect.gte(1) ? " (softcapped)" : "") + "<br><br>Req: " + formatWhole(b.cost) + " expansion points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() {return player.ex.points.gte(this.cost()) && tmp.em.effect[2].sub(player[this.layer].spent).gte(1)},
			buy() {
				player[this.layer].spent++;
				addBuyables(this.layer, this.id, 1);
			},
			style: {"width": "210px", "height": "110px"},
		},
		14: {
			cost(amt) {return amt.add(1).mul(hasMilestone("em", 9) ? 450 : 500)},
			effectBase() {
				let base = 2;
				if (hasMilestone("em", 3)) base += milestoneEffect("em", 3);
				if (hasMilestone("em", 5)) base += milestoneEffect("em", 5);
				if (hasMilestone("em", 11)) base += milestoneEffect("em", 11);
				if (hasMilestone("em", 16)) base += milestoneEffect("em", 16);
				if (hasMilestone("em", 20)) base += milestoneEffect("em", 20);
				if (hasMilestone("em", 27)) base += milestoneEffect("em", 27);
				if (hasMilestone("em", 30)) base += milestoneEffect("em", 30);
				return base;
			},
			effect(amt) {
				let eff = amt.mul(this.effectBase());
				if (eff.gte(20)) eff = eff.sub(20).div(10).add(20);
				return eff.floor();
			},
			title: "(WAR) ASPECT",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "decrease the battle enhancement costs by " + formatWhole(b.effectBase) + "<br><br>Effect: -" + formatWhole(b.effect) + (b.effect.gte(20) ? " (softcapped)" : "") + "<br><br>Req: " + formatWhole(b.cost) + " wars<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() {return player.w.points.gte(this.cost()) && tmp.em.effect[2].sub(player[this.layer].spent).gte(1)},
			buy() {
				player[this.layer].spent++;
				addBuyables(this.layer, this.id, 1);
			},
			style: {"width": "210px", "height": "110px"},
		},
		21: {
			cost(amt) {
				if (amt.gte(20)) return amt.sub(14).pow_base("1e40000");
				if (amt.gte(15)) return amt.sub(9).pow_base("1e20000");
				if (amt.gte(10)) return amt.sub(4).pow_base("1e10000");
				return amt.add(1).pow_base("1e5000");
			},
			effect(amt) {return amt},
			title: "Political Manipulation",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "manipulate some politics to make 1 leader to join your faction<br><br>Effect: +" + formatWhole(b.effect) + (getBuyableAmount(this.layer, this.id).lt(b.purchaseLimit) ? "<br><br>Cost: " + format(b.cost) + " control" : "") + "<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + b.purchaseLimit;
			},
			purchaseLimit: 22,
			canAfford() {return player.t.control.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)},
			buy() {
				player.t.control = player.t.control.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			unlocked() {return hasMilestone("em", 12) && player.em.points.gte(4)},
			style() {
				let style = {"margin-left": "7px", "margin-right": "7px"};
				if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) style["border-color"] = "#B44990";
				return style;
			},
		},
		22: {
			cost(amt) {return new Decimal("e1000000").pow(amt.add(1).pow(2))},
			effect(amt) {return amt},
			title: "Reputation Inflation",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "take advantage of your reputation to make 1 leader to join your faction<br><br>Effect: +" + formatWhole(b.effect) + "<br><br>Cost: " + format(b.cost) + " influence<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() {return player.ex.influence.gte(this.cost())},
			buy() {
				player.ex.influence = player.ex.influence.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			unlocked() {return hasMilestone("em", 12) && player.em.points.gte(4) && challengeCompletions("ec", 11) >= 25},
			style: {"margin-left": "7px", "margin-right": "7px"},
		},
		31: {
			cost(amt) {return amt.add(1).pow(2 - tmp.em.effect[5]).ceil()},
			effectBase() {return buyableEffect("em", 32).add(2)},
			effect(amt) {return this.effectBase().pow(amt)},
			title: "Political Pressure",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "apply pressure by using your faction to multiply claim amount by " + format(b.effectBase) + "<br><br>Effect: " + format(b.effect) + "x<br><br>Req: " + formatWhole(b.cost) + " leaders in your faction<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() {return getFactionSize().gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, 1)},
			unlocked() {return hasMilestone("em", 28) && player.em.points.gte(8)},
			style: {"margin-left": "7px", "margin-right": "7px"},
		},
		32: {
			cost(amt) {return amt.pow(1.5).pow_base(2).div(tmp.em.effect[6]).mul(0.1).toNumber()},
			effect(amt) {return amt.div(2)},
			title: "Grand Schemes",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "conduct some insidious schemes to increase the base effect of <b>Political Pressure</b><br><br>Effect: +" + format(b.effect) + "<br><br>Cost: " + format(b.cost * 100) + "% progress<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() {return (getClickableState("em", 21) || 0) > this.cost()},
			buy() {
				setClickableState("em", 21, (getClickableState("em", 21) || 0) - this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			unlocked() {return hasMilestone("em", 28) && player.em.points.gte(8)},
			style: {"margin-left": "7px", "margin-right": "7px"},
		},
		33: {
			cost(amt) {return amt.pow_base(1000).div(tmp.em.effect[6]).mul(0.99).toNumber()},
			effect(amt) {return amt.pow_base(2.5)},
			title: "Begin the Hunt",
			display() {
				const b = tmp[this.layer].buyables[this.id];
				return "hire skilled hounds using the majority of your resources to multiply claim amount by " + format(2.5) + "<br><br>Effect: " + format(b.effect) + "x<br><br>Cost: " + format(b.cost * 100) + "% progress<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() {return (getClickableState("em", 21) || 0) > this.cost()},
			buy() {
				setClickableState("em", 21, (getClickableState("em", 21) || 0) - this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			unlocked() {return hasMilestone("em", 28) && player.em.points.gte(8)},
			style: {"margin-left": "7px", "margin-right": "7px"},
		},
		respec() {
			setBuyableAmount("em", 11, newDecimalZero());
			setBuyableAmount("em", 12, newDecimalZero());
			setBuyableAmount("em", 13, newDecimalZero());
			setBuyableAmount("em", 14, newDecimalZero());
			player.em.spent = newDecimalZero();
			doReset("co", true, true);
			doReset("l", true, true);
			doReset("t", true, true);
		},
		respecText: "respec aspect points",
		respecMessage: 'Are you sure you want to respec? This will force you to do "Continent", "Leader", and "Territory" resets as well!',
	},
	clickables: {
		21: {
			effect() {return getEconomyClickValue() * (1 - (getClickableState("em", 21) || 0))},
			display() {return "Claim " + format(getEconomyClickValue() * 100, 3) + "% of the unclaimed portion of the current economic sector (+" + format(tmp.em.clickables[21].effect * 100, 3) + "% progress)"},
			canClick() {return true},
			onClick() {setClickableState("em", 21, (getClickableState("em", 21) || 0) + this.effect())},
			style: {"min-height": "60px", "width": "150px", "border-radius": "30px", "margin-left": "7px", "margin-right": "7px"},
		},
		22: {
			display() {return "Take over this economic sector (requires 99.999% progress and will set progress to 0%)"},
			canClick() {return (getClickableState("em", 21) || 0) >= 0.99999 && (getClickableState("em", 22) || 0) < 5},
			onClick() {
				setClickableState("em", 21, 0);
				setClickableState("em", 22, (getClickableState("em", 22) || 0) + 1);
			},
			style: {"min-height": "60px", "width": "150px", "border-radius": "30px", "margin-left": "7px", "margin-right": "7px"},
		},
	},
	milestones: {
		0: {
			requirement: "1e500000",
			requirementDescription: "EXP phase I",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.1},
			effectDescription() {return "increase the base effect of EXP by 0.1<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return player.em.points.gte(2)},
		},
		1: {
			requirement: "1e600000",
			requirementDescription: "Empire phase I",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first empire effect<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		2: {
			requirement: "1e700000",
			requirementDescription: "ECO phase I",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the effect of ECO by 1<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		3: {
			requirement: "1e800000",
			requirementDescription: "WAR phase I",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the base effect of WAR by 1<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		4: {
			requirement: "1e900000",
			requirementDescription: "REV phase I",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the requirement scaling of REV<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		5: {
			requirement: "e1000000",
			requirementDescription: "WAR phase II",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the base effect of WAR by 1<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		6: {
			requirement: "e1100000",
			requirementDescription: "ECO phase II",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the requirement scaling of ECO<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		7: {
			requirement: "e1200000",
			requirementDescription: "EXP phase II",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.02},
			effectDescription() {return "increase the base effect of EXP by 0.02<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		8: {
			requirement: "e1300000",
			requirementDescription: "REV phase II",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.03},
			effectDescription() {return "increase the base effect of REV by 0.03<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		9: {
			requirement: "e1400000",
			requirementDescription: "Empire phase II",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the requirement scaling of EXP and WAR<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		10: {
			requirement: "e1600000",
			requirementDescription: "ECO phase III",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the effect of ECO by 1<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		11: {
			requirement: "e1800000",
			requirementDescription: "WAR phase III",
			popupTitle: "Innovation Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of WAR by 2<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		12: {
			requirement: "e2000000",
			requirementDescription: "Empire phase III",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "unlock something new for empires" + (hasMilestone("em", 12) && player.em.points.gte(4) ? " (already unlocked)" : "") + "<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		13: {
			requirement: "e2200000",
			requirementDescription: "EXP phase III",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.03},
			effectDescription() {return "increase the base effect of EXP by 0.03<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		14: {
			requirement: "e2400000",
			requirementDescription: "REV phase III",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.02},
			effectDescription() {return "increase the base effect of REV by 0.02<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		15: {
			requirement: "e2600000",
			requirementDescription: "EXP phase IV",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.01},
			effectDescription() {return "increase the base effect of EXP by 0.01<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		16: {
			requirement: "e2800000",
			requirementDescription: "WAR phase IV",
			popupTitle: "Innovation Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of WAR by 2<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		17: {
			requirement: "e3000000",
			requirementDescription: "REV phase IV",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.01},
			effectDescription() {return "increase the base effect of REV by 0.01<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		18: {
			requirement: "e3400000",
			requirementDescription: "Empire phase IV",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the phase effect<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		19: {
			requirement: "e3800000",
			requirementDescription: "ECO phase IV",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the effect of ECO by 1<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		20: {
			requirement: "e4200000",
			requirementDescription: "WAR phase V",
			popupTitle: "Innovation Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of WAR by 2<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		21: {
			requirement: "e4600000",
			requirementDescription: "EXP phase V",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.02},
			effectDescription() {return "increase the base effect of EXP by 0.02<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		22: {
			requirement: "e5000000",
			requirementDescription: "REV phase V",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.01},
			effectDescription() {return "increase the base effect of REV by 0.01<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		23: {
			requirement: "e6000000",
			requirementDescription: "Empire phase V",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the phase effect<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		24: {
			requirement: "e7000000",
			requirementDescription: "ECO phase V",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the effect of ECO by 1<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		25: {
			requirement: "e8000000",
			requirementDescription: "EXP phase VI",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.02},
			effectDescription() {return "increase the base effect of EXP by 0.02<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		26: {
			requirement: "e9000000",
			requirementDescription: "REV phase VI",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.03},
			effectDescription() {return "increase the base effect of REV by 0.03<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		27: {
			requirement: "e10000000",
			requirementDescription: "WAR phase VI",
			popupTitle: "Innovation Acquired!",
			effect() {return 5},
			effectDescription() {return "increase the base effect of WAR by 5<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		28: {
			requirement: "e11000000",
			requirementDescription: "Empire phase VI",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "unlock something new for empires" + (hasMilestone("em", 28) && player.em.points.gte(8) ? " (already unlocked)" : "") + "<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		29: {
			requirement: "e12000000",
			requirementDescription: "ECO phase VI",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the effect of ECO by 1<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		30: {
			requirement: "e13000000",
			requirementDescription: "WAR phase VII",
			popupTitle: "Innovation Acquired!",
			effect() {return 5},
			effectDescription() {return "increase the base effect of WAR by 5<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		31: {
			requirement: "e15000000",
			requirementDescription: "EXP phase VII",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.02},
			effectDescription() {return "increase the base effect of EXP by 0.02<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		32: {
			requirement: "e17000000",
			requirementDescription: "REV phase VII",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.01},
			effectDescription() {return "increase the base effect of REV by 0.01<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		33: {
			requirement: "e19000000",
			requirementDescription: "ECO phase VII",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the effect of ECO by 1<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		34: {
			requirement: "e21000000",
			requirementDescription: "Empire phase VI",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "unlock another effect for economic sectors<br>Req: " + formatWhole(this.requirement) + " influence"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
	},
});
