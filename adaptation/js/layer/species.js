addLayer("sp", {
	name: "Species",
	symbol: "SP",
	position: 0,
	branches: ["e"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
	}},
	color: "#55B020",
	resource: "species",
	row: 3,
	baseResource: "evolutions",
	baseAmount() {return player.e.points},
	requires: new Decimal(60),
	type: "static",
	base() {
		let base = 1.5;
		if (player.e.points.gte(824)) base -= 0.05;
		if (player.e.points.gte(1142)) base -= 0.03;
		if (player.e.points.gte(1372)) base -= 0.02;
		if (player.e.points.gte(1591)) base -= 0.0375;
		if (player.e.points.gte(2171)) base -= 0.0075;
		if (player.e.points.gte(2420)) base -= 0.03;
		if (hasMilestone("d", 14)) base -= milestoneEffect("d", 14);
		if (hasMilestone("d", 23)) base -= milestoneEffect("d", 23);
		if (getBuyableAmount("d", 12).gte(tmp.d.buyables[12].purchaseLimit)) base -= tmp.d.buyables[12].completionEffect;
		if (getGridData("w", 404)) base -= gridEffect("w", 404);
		return base;
	},
	exponent() {return inChallenge("co", 11) ? 2 : 1},
	roundUpCost: true,
	canBuyMax() {return player.ec.unlocked},
	resetDescription: "Speciate for ",
	gainMult() {
		let mult = newDecimalOne();
		if (hasChallenge("sp", 14)) mult = mult.div(challengeEffect("sp", 14));
		if (hasChallenge("sp", 21) && challengeEffect("sp", 21)[5]) mult = mult.div(challengeEffect("sp", 21)[5]);
		if (hasMilestone("d", 4)) mult = mult.div(milestoneEffect("d", 4));
		if (player.d.unlocks[1]) mult = mult.div(buyableEffect("d", 12));
		if (getGridData("w", 103)) mult = mult.div(gridEffect("w", 103));
		if (tmp.ec.effect[0]) mult = mult.div(tmp.ec.effect[0]);
		if (tmp.r.effect[0]) mult = mult.div(tmp.r.effect[0]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		return mult;
	},
	directMult() {
		let mult = newDecimalOne();
		if (tmp.co.effect[2]) mult = mult.mul(tmp.co.effect[2]);
		return mult;
	},
	effect() {
		// overrides
		if (inChallenge("sp", 17)) return [1, 1, 1];
		// base
		let base0 = player.sp.points;
		if (hasChallenge("sp", 11)) base0 = base0.mul(2);
		if (hasChallenge("sp", 12)) base0 = base0.mul(challengeEffect("sp", 12));
		if (hasChallenge("sp", 13)) base0 = base0.mul(2);
		if (hasChallenge("sp", 14)) base0 = base0.mul(2);
		if (hasChallenge("sp", 15)) base0 = base0.mul(2);
		if (hasChallenge("sp", 16)) base0 = base0.mul(5);
		// exponent
		let exp0 = 1;
		if (hasChallenge("sp", 17)) exp0 += 0.25;
		let exp2 = 0.2;
		if (player.sp.points.gte(6)) exp2 += 0.3;
		if (hasChallenge("sp", 11)) exp2 += 0.075;
		// return
		if (player.sp.points.gte(666)) return [
			base0.pow(player.sp.points.pow(exp0 + 0.45)),
			player.sp.points.pow(500),
			player.sp.points.pow(exp2 + 0.25),
		];
		if (player.sp.points.gte(6)) return [
			base0.pow(player.sp.points.pow(exp0)),
			player.sp.points.pow(2),
			player.sp.points.pow(exp2),
		];
		return [
			base0.pow(0.5).div(2).add(1.5).pow(player.sp.points.pow(exp0)),
			player.sp.points.add(1),
			player.sp.points.mul(5).add(1).pow(exp2),
		];
	},
	effectDescription() {return "which are dividing the evolution requirement by /" + format(tmp.sp.effect[0]) + "; multiplying the extra STR, WIS, AGI, and INT from evolutions by " + format(tmp.sp.effect[1]) + "x; and exponentiating evolution amount in the last evolution effect by ^" + format(tmp.sp.effect[2])},
	resetsNothing() {return player.l.unlocked},
	autoPrestige() {return player.l.unlocked},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "You keep retrogression completions on species resets.<br><br>After speciating 1 time, you can always bulk growth and evolutions,<br>the effect of <b>Growth enhancement I</b> is always changed,<br>and more automation for growth is always unlocked.<br><br>The above extra effects will not go away even if this layer is reset.";
			if (player.sp.points.gte(5)) text += "<br><br>After speciating 6 times, all species effects are massively improved.";
			if (player.sp.points.gte(600)) text += "<br>After speciating 666 times, all species effects are improved again.";
			return text;
		}],
		"blank",
		"challenges",
		"blank",
	],
	layerShown() {return player.e.points.gte(60) || player.sp.unlocked},
	hotkeys: [{
		key: "p",
		description: "P: reset for species",
		onPress() {if (player.sp.unlocked) doReset("sp")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		const keep = [];
		if (player.cy.unlocks[3] >= 6
			|| player.l.points.gte(player.cy.unlocks[1] >= 4 ? 6 : 10)
			|| resettingLayer == "co"
			|| (resettingLayer == "l" && player.l.points.gte(4))
			|| player.r.points.gte(3)
			|| resettingLayer == "ec"
		) keep.push("challenges");
		layerDataReset("sp", keep);
	},
	update(diff) {
		if ((hasMilestone("d", 51) || player.cy.unlocks[1] >= 3) && tmp.sp.challenges[21].completionLimit > player.sp.challenges[21]) player.sp.challenges[21] = tmp.sp.challenges[21].completionLimit;
		else if (player.r.unlocked && canCompleteChallenge("sp", 21) && player.sp.challenges[21] < tmp.sp.challenges[21].completionLimit) player.sp.challenges[21]++;
	},
	componentStyles: {
		challenge: {"min-height": "360px", height: "fit-content", "border-radius": "50px"},
	},
	challenges: {
		11: {
			name: "1st Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, you cannot buy CRA, FER, or SOV.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 2, the exponent of the last species effect is increased by 0.075, and acclimation requirement is divided based on species (currently&nbsp;/" + format(this.rewardEffect()) + ")";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {return new Decimal(1.3).pow(player.sp.points)},
			goal: 692,
			canComplete() {return player.e.points.gte(this.goal)},
			unlockReq: 8,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			overrideResetsNothing: true,
			style: {width: "250px"},
		},
		12: {
			name: "2nd Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, you cannot buy ANA.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The extra STR, WIS, and AGI from evolutions is multiplied by 10, the base of the first species effect is multiplied based on hybridizations completed (" + (this.rewardEffect().gte(10) ? "maxed at 10" : "currently&nbsp;" + formatWhole(this.rewardEffect())) + "x), and something new is unlocked for consciousness" + (player.cb.focusUnlocked ? " (already unlocked)" : "");
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {
				let hybridizations = 0;
				for (const id in player.sp.challenges) {
					hybridizations += player.sp.challenges[id];
				};
				return new Decimal(hybridizations).add(1).min(10);
			},
			goal: 1095,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("sp", this.id - 1) || hasChallenge("sp", this.id)},
			unlockReq: 9,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			overrideResetsNothing: true,
			style: {width: "250px"},
		},
		13: {
			name: "3rd Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, the original evolution requirement base is set to 2.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 2, focus requirement is divided by 2, and acclimation requirement is divided based on conscious beings (currently&nbsp;/" + format(this.rewardEffect()) + ")";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {return new Decimal(1.36).pow(player.cb.points)},
			goal: 537,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("sp", this.id - 1) || hasChallenge("sp", this.id)},
			unlockReq: 10,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			overrideResetsNothing: true,
			style: {width: "250px"},
		},
		14: {
			name: "4th Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, the original acclimation requirement base is set to 10.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 2, the last conscious being effect is powered to 1.5, and species requirement is divided based on acclimation points past 200 (currently&nbsp;/" + format(this.rewardEffect()) + ")";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {return new Decimal(hasChallenge("sp", 19) ? 1.04 : (hasChallenge("sp", 16) ? 1.02 : 1.01)).pow(player.a.points.sub(200).max(0).pow(0.5))},
			goal: 1096,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("sp", this.id - 1) || hasChallenge("sp", this.id)},
			unlockReq: 12,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			overrideResetsNothing: true,
			style: {width: "250px"},
		},
		15: {
			name: "5th Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, all previous in hybridization effects are applied.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 2, acclimation requirement base is decreased by 0.0505, focus requirement is divided by 1.5, and a new layer is unlocked" + (player.d.unlocked ? " (already unlocked)" : "");
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {return 0.0505},
			goal: 501,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("sp", this.id - 1) || hasChallenge("sp", this.id)},
			unlockReq: 13,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			overrideResetsNothing: true,
			countsAs: [11, 12, 13, 14],
			style: {width: "250px"},
		},
		16: {
			name: "6th Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, conscious beings and focus do nothing.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 5, acclimation requirement base is decreased by 0.01, and the 4th hybridization's last effect is improved.";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {return 0.01},
			goal: 2067,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("sp", this.id - 1) || hasChallenge("sp", this.id)},
			unlockReq: 15,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			overrideResetsNothing: true,
			style: {width: "250px"},
		},
		17: {
			name: "7th Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, species effects do nothing.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The first species effect is greatly improved, focus can be allocated to both evolution and acclimation, focus points are automatically allocated, and domination point requirement is divided based on hybridizations completed (currently&nbsp;/" + format(this.rewardEffect()) + ")";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {
				let hybridizations = 0;
				for (const id in player.sp.challenges) {
					hybridizations += player.sp.challenges[id];
				};
				if (hasChallenge("sp", 18)) return new Decimal(hybridizations).div(100).add(1).pow(12.88888888888889);
				return new Decimal(hybridizations).div(100).add(1).pow(6.555555555555555);
			},
			goal: 2131,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("sp", this.id - 1) || hasChallenge("sp", this.id)},
			unlockReq: 16,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			overrideResetsNothing: true,
			style: {width: "250px"},
		},
		18: {
			name: "8th Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, the original growth requirement base is set to 1e100.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The first two conscious being effects are improved; the costs of CRA, FER, ANA, and SOV are reduced by one level; and the 7th hybridization's last effect is improved.";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			goal: 3931,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("sp", this.id - 1) || hasChallenge("sp", this.id)},
			unlockReq: 18,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			overrideResetsNothing: true,
			style: {width: "250px"},
		},
		19: {
			name: "9th Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, all previous in hybridization effects are applied.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The 4th hybridization's last effect is improved again; the base conscious being and domination requirements are decreased by 2 and 0.16 respectively; and a new layer is unlocked" + (player.ec.unlocked ? " (already unlocked)" : "");
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			goal: 301,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("sp", this.id - 1) || hasChallenge("sp", this.id)},
			unlockReq: 19,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			overrideResetsNothing: true,
			countsAs: [11, 12, 13, 14, 15, 16, 17, 18],
			style: {width: "250px"},
		},
		21: {
			name: "10th Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, all previous in hybridization effects are applied; the original evolution requirement base is set to 10; and each acclimation point, acclimation enhancement, species, conscious being, focus point, and domination point divides evolution requirement by 5.<br><br>Goal: " + formatWhole(this.goal()) + " evolutions<br><br>Completions: " + formatWhole(challengeCompletions("sp", this.id)) + "/" + formatWhole(this.completionLimit()) + "<br><br>Rewards: evolution requirement is divided (currently&nbsp;/" + format(this.rewardEffect()[0]) + "), population maximum is multiplied (currently&nbsp;" + format(this.rewardEffect()[1]) + "x), conscious being requirement is divided (currently&nbsp;/" + format(this.rewardEffect()[2]) + "), focus requirement is divided (currently&nbsp;/" + format(this.rewardEffect()[3]) + "), " + (hasMilestone("d", 9) ? "domination requirement is divided (currently&nbsp;/" + format(this.rewardEffect()[4]) + "), and species requirement is divided (currently&nbsp;/" + format(this.rewardEffect()[5]) + ")" : "and domination requirement is divided (currently&nbsp;/" + format(this.rewardEffect()[4]) + ")") + "<div><br></div>";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this hybridization. It is the very last one. Are you ready?";
			},
			rewardEffect() { return [
				new Decimal(1e25).pow(challengeCompletions("sp", this.id)),
				new Decimal(1e10).pow(challengeCompletions("sp", this.id)),
				new Decimal(2).pow(challengeCompletions("sp", this.id)),
				new Decimal(100).pow(challengeCompletions("sp", this.id)),
				new Decimal(hasMilestone("d", 38) ? 1.484 : hasMilestone("d", 28) ? 1.45 : 1.353).pow(challengeCompletions("sp", this.id)),
				(hasMilestone("d", 9) ? new Decimal(hasMilestone("d", 18) ? 1.85 : 1.25).pow(challengeCompletions("sp", this.id)) : newDecimalOne()),
			]},
			goal() {
				let amt = challengeCompletions("sp", this.id);
				if (amt >= 10000) return Infinity;
				if (amt >= 9000) return (amt - 8995) * 1.52587890625e24;
				if (amt >= 8000) return (amt - 7995) * 6.103515625e21;
				if (amt >= 7000) return (amt - 6995) * 2.44140625e19;
				if (amt >= 6000) return (amt - 5995) * 9.765625e16;
				if (amt >= 5000) return (amt - 4995) * 3.90625e14;
				if (amt >= 4000) return (amt - 3995) * 1.5625e12;
				if (amt >= 3000) return (amt - 2995) * 6.25e9;
				if (amt >= 2000) return (amt - 1995) * 25000000;
				if (amt >= 1000) return (amt - 995) * 100000;
				if (amt >= 22) return (amt - 16) * 500;
				return [166, 237, 288, 340, 436, 555, 617, 755, 932, 1001, 1110, 1183, 1317, 1446, 1510, 1589, 1665, 1737, 1875, 2024, 2115, 2440][amt];
			},
			canComplete() {return player.e.points.gte(this.goal())},
			unlocked() {return hasChallenge("sp", 19) || hasChallenge("sp", this.id)},
			unlockReq: 21,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			overrideResetsNothing: true,
			completionLimit() {
				let limit = 5;
				if (getGridData("w", 201)) limit += gridEffect("w", 201).toNumber();
				if (getGridData("w", 204)) limit += gridEffect("w", 204).toNumber();
				if (player.l.focusUnlocked) limit += clickableEffect("l", 11);
				if (tmp.ec.effect[1]) limit += tmp.ec.effect[1].toNumber();
				return limit;
			},
			countsAs: [11, 12, 13, 14, 15, 16, 17, 18, 19],
			style: {width: "calc(100% - 8px)", "max-width": "600px"},
		},
	},
});
