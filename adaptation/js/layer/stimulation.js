addLayer("s", {
	name: "Stimulation",
	symbol: "S",
	position: 0,
	startData() { return {
		unlocked: true,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
	}},
	color: "#70EBB0",
	resource: "stimulations",
	row: 0,
	baseResource: modInfo.pointsName,
	baseAmount() {return player.points},
	requires: new Decimal(0.75),
	type: "normal",
	exponent: 0.5,
	softcap: new Decimal("1e50000"),
	softcapPower: 0.9,
	logged() {return inChallenge("co", 11)},
	gainMult() {
		let mult = newDecimalOne();
		if (hasUpgrade("s", 21)) mult = mult.mul(upgradeEffect("s", 21));
		if (hasUpgrade("s", 22)) mult = mult.mul(upgradeEffect("s", 22));
		if (hasUpgrade("s", 23)) mult = mult.mul(upgradeEffect("s", 23));
		if (hasUpgrade("s", 24)) mult = mult.mul(upgradeEffect("s", 24));
		if (hasUpgrade("s", 25)) mult = mult.mul(upgradeEffect("s", 25));
		if (hasUpgrade("s", 41)) mult = mult.mul(upgradeEffect("s", 41));
		if (hasUpgrade("s", 43)) mult = mult.mul(upgradeEffect("s", 43));
		if (hasUpgrade("s", 45)) mult = mult.mul(upgradeEffect("s", 45));
		if (hasUpgrade("s", 65)) mult = mult.mul(upgradeEffect("s", 65));
		if (hasUpgrade("s", 82)) mult = mult.mul(upgradeEffect("s", 82));
		if (player.g.unlocked) mult = mult.mul(buyableEffect("g", 12));
		if (tmp.l.effect[0]) mult = mult.mul(tmp.l.effect[0]);
		return mult;
	},
	effect() {
		let exp = new Decimal(0.5);
		if (hasUpgrade("s", 52)) exp = exp.add(upgradeEffect("s", 52));
		if (hasUpgrade("s", 54)) exp = exp.add(upgradeEffect("s", 54));
		if (hasUpgrade("s", 55)) exp = exp.add(upgradeEffect("s", 55));
		if (hasUpgrade("s", 71)) exp = exp.add(upgradeEffect("s", 71));
		if (hasUpgrade("s", 72)) exp = exp.add(upgradeEffect("s", 72));
		if (hasUpgrade("s", 73)) exp = exp.add(upgradeEffect("s", 73));
		if (hasUpgrade("s", 74)) exp = exp.add(upgradeEffect("s", 74));
		if (hasUpgrade("s", 75)) exp = exp.add(upgradeEffect("s", 75));
		if (hasUpgrade("s", 83)) exp = exp.add(upgradeEffect("s", 83));
		if (hasChallenge("e", 11)) exp = exp.add(buyableEffect("g", 14));
		let eff = player.s.points.add(1).pow(exp);
		if (eff.gt("e875000")) eff = eff.div("e875000").pow(0.9).mul("e875000");
		return eff;
	},
	effectDescription() {
		let text = "which are multiplying power gain by " + format(tmp.s.effect) + "x";
		if (tmp.s.resetGain.gte(tmp.s.softcap)) text += "<br>(stimulation gain softcapped at " + formatWhole(tmp.s.softcap) + ")";
		if (tmp.s.effect.gt("e875000")) text += "<br>(stimulation effect softcapped at 1e875,000)";
		return text;
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"blank",
		"upgrades",
	],
	layerShown() {return player.s.unlocked},
	passiveGeneration() {
		let gen = 0;
		if (tmp.e.effect[4]) gen += tmp.e.effect[4].toNumber() / 100;
		if (tmp.ec.effect[2]) gen += tmp.ec.effect[2].toNumber() / 100;
		if (player.cy.unlocks[0] >= 3) gen++;
		return gen;
	},
	hotkeys: [{
		key: "s",
		description: "S: reset for stimulations",
		onPress() {if (player.s.unlocked) doReset("s")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		const keep = [];
		if (player.cy.unlocks[1] >= 2
			|| player.l.points.gte(3)
			|| player.ec.points.gte(6)
			|| (layers[resettingLayer].row <= 3 && player.cb.unlocked)
			|| (layers[resettingLayer].row == 2 && player.e.points.gte(20))
			|| (resettingLayer == "g" && inChallenge("e", 21))
			|| (resettingLayer == "g" && hasMilestone("g", 8) && hasChallenge("e", 11))
		) keep.push("upgrades");
		if (!keep.includes("upgrades") && resettingLayer == "g" && ((hasMilestone("g", 8) && player.e.unlocked) || hasChallenge("e", 11))) {
			const keepUpg = [];
			if (resettingLayer == "g" && ((hasMilestone("g", 8) && player.e.unlocked) || (!hasMilestone("g", 8) && hasChallenge("e", 11)))) {
				for (let index = 0; index < player.s.upgrades.length; index++) {
					if (player.s.upgrades[index] < 40) keepUpg.push(player.s.upgrades[index]);
				};
			};
			layerDataReset("s", keep);
			player.s.upgrades = keepUpg;
		} else {
			layerDataReset("s", keep);
		};
	},
	upgrades: {
		11: {
			title: "Learning",
			description: "increase base power gain by 1",
			effect() {return 1},
			cost() {
				let cost = new Decimal(10);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return !inChallenge("e", 13)},
		},
		12: {
			title: "Experience",
			description: "increase base power gain by 1.5",
			effect() {return 1.5},
			cost() {
				let cost = new Decimal(25);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 11) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		13: {
			title: "Memorization",
			description: "increase base power gain by 2.5",
			effect() {return 2.5},
			cost() {
				let cost = new Decimal(75);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 12) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		14: {
			title: "Calculation",
			description: "increase base power gain based on the number of upgrades",
			effect() {return player.s.upgrades.length * 3},
			effectDisplay() {return "+" + format(this.effect())},
			cost() {
				let cost = new Decimal(250);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 13) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		15: {
			title: "Intelligence",
			description: "increase base power gain based on stimulations",
			effect() {return player.s.points.add(1).log10().mul(100)},
			effectDisplay() {return "+" + format(this.effect())},
			cost() {
				let cost = new Decimal(1000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 14) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		21: {
			title: "Seeking",
			description: "multiply stimulation gain by 1.5",
			effect() {return 1.5},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(15000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 15) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		22: {
			title: "Taunting",
			description: "multiply stimulation gain by 1.5",
			effect() {return 1.5},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(25000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 21) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		23: {
			title: "Tracking",
			description: "multiply stimulation gain by 2",
			effect() {return 2},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(45000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 22) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		24: {
			title: "Luring",
			description: "multiply stimulation gain by 2.5",
			effect() {return 2.5},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(100000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 23) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		25: {
			title: "Hunting",
			description: "multiply stimulation gain based on the number of upgrades",
			effect() {return Math.max(player.s.upgrades.length ** 0.5, 1) },
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(250000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 24) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		31: {
			title: "Recuperation",
			description: "multiply power gain by 3",
			effect() {return 3},
			cost() {
				let cost = new Decimal(500000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 25) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		32: {
			title: "Repetition",
			description: "multiply power gain by 4",
			effect() {return 4},
			cost() {
				let cost = new Decimal(1000000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 31) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		33: {
			title: "Restoration",
			description: "multiply power gain by 4",
			effect() {return 4},
			cost() {
				let cost = new Decimal(2500000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 32) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		34: {
			title: "Training",
			description: "multiply power gain by 5",
			effect() {return 5},
			cost() {
				let cost = new Decimal(7500000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 33) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		35: {
			title: "Growth",
			description() {
				let text = "multiply power gain by 5 and unlock a new layer";
				if (player.g.unlocked) text += " (already unlocked)";
				return text;
			},
			effect() {return 5},
			cost() {
				let cost = new Decimal(25000000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 34) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		41: {
			title: "Calmness",
			description: "multiply stimulation gain based on stimulations",
			effect() {return player.s.points.add(1).log10().mul(0.5).add(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e15),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(1)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		42: {
			title: "Consumption",
			description: "multiply power gain based on power",
			effect() {return player.points.add(1).log10().mul(0.75).add(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(2.5e16),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(2)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		43: {
			title: "Meditation",
			description: "multiply stimulation gain based on power",
			effect() {
				if (hasUpgrade("s", 63)) return player.points.add(1).pow(0.05);
				else return player.points.add(1).log10().mul(0.45).add(1);
			},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e18),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(3)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		44: {
			title: "Absorbtion",
			description: "multiply power gain based on stimulations",
			effect() {
				if (hasUpgrade("s", 64)) return player.s.points.add(1).pow(0.088);
				else return player.s.points.add(1).log10().mul(1.5).add(1);
			},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(5e19),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(4)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		45: {
			title: "Assimilation",
			description: "multiply power and stimulation gain by 10",
			effect() {return 10},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e22),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(5)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		51: {
			title: "Swiftness",
			description: "divide growth requirement by 16",
			effect() {return 16},
			cost: new Decimal(2.5e20),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(6)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		52: {
			title: "Deregulation",
			description: "increase stimulation effect exponent by 0.1",
			effect() {return 0.1},
			cost: new Decimal(5e21),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(7)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		53: {
			title: "Acceleration",
			description: "divide growth requirement based on your power",
			effect() {
				if (hasUpgrade("s", 62)) return player.points.mul(1e10).add(1).pow(0.05);
				else return player.points.add(1).log10().mul(0.5).add(1);
			},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(2.5e23),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(8)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		54: {
			title: "Freedom",
			description: "increase stimulation effect exponent by 0.1",
			effect() {return 0.1},
			cost: new Decimal(2.5e25),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(9)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		55: {
			title: "Boundlessness",
			description: "increase stimulation effect exponent based on your growth points",
			effect() {
				let eff = newDecimalZero();
				if (hasUpgrade("s", 61)) eff = player.g.points.add(1).pow(0.1).div(10);
				else eff = player.g.points.add(1).log10().mul(0.036);
				if (eff.gte(0.5)) return new Decimal(0.5);
				else return eff;
			},
			effectDisplay() {return "+" + format(this.effect()) + (this.effect().eq(0.5) ? " (max)" : "")},
			cost: new Decimal(2.5e28),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(10)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		61: {
			title: "Limitlessness",
			description: "improve the effect formula of <b>Boundlessness</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e50),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(11)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		62: {
			title: "Windlessness",
			description: "improve the effect formula of <b>Acceleration</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e60),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(12)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		63: {
			title: "Enlightenment",
			description: "improve the effect formula of <b>Meditation</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e71),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(13)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		64: {
			title: "Gorging",
			description: "improve the effect formula of <b>Absorbtion</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e84),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(14)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		65: {
			title: "Integration",
			description: "apply the effects of <b>Assimilation</b> two more times",
			effect() {return upgradeEffect("s", 45) ** 2},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e100),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(15)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		71: {
			title: "Loosening",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e190),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(16)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		72: {
			title: "Passing",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e215),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(17)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		73: {
			title: "Breaking",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e245),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(18)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		74: {
			title: "Exceeding",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e295),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(19)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		75: {
			title: "Break the Limit",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal("1e345"),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(20)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		81: {
			title: "Warrior Blood",
			description: "multiply power gain by 1e25",
			effect() {return 1e25},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal("1e2500"),
			unlocked() {return hasChallenge("e", 13) && !inChallenge("e", 13)},
		},
		82: {
			title: "Scholar Blood",
			description: "multiply stimulation gain by 1e10",
			effect() {return 1e10},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal("1e3500"),
			unlocked() {return hasChallenge("e", 13) && !inChallenge("e", 13)},
		},
		83: {
			title: "Wanderer Blood",
			description: "increase stimulation effect exponent by 0.0025",
			effect() {return 0.0025},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal("1e4575"),
			unlocked() {return hasChallenge("e", 13) && !inChallenge("e", 13)},
		},
		84: {
			title: "Alchemist Blood",
			description: "decrease growth requirement base by 0.1125",
			effect() {return 0.1125},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal("1e6220"),
			unlocked() {return hasChallenge("e", 13) && !inChallenge("e", 13)},
		},
		85: {
			title: "Mutant Blood",
			description: "divide evolution requirement by 1.25",
			effect() {return 1.25},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal("1e7800"),
			unlocked() {return hasChallenge("e", 13) && !inChallenge("e", 13)},
		},
	},
});
