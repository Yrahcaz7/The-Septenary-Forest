const extraEvolutionEffects = {
	1: () => {
		if (player.sp.unlocked) return;
		else return "You can always bulk growth.<br>The effect of <b>Growth enhancement I</b> is changed."
	},
	6: () => {
		if (player.e.points.gte(14) || tmp.e.effect[4].gte(1e300)) return;
		else if (hasChallenge("e", 13)) return "The second to last evolution effect is multiplied by 32.";
		else return "The last evolution effect is multiplied by 32.";
	},
	14: () => {
		if (player.e.points.gte(233) || tmp.e.effect[4].gte(1e300)) {
			return;
		} else if (hasChallenge("e", 13)) {
			if (player.e.points.gte(14)) return "The second to last evolution effect is multiplied by 16,000.";
			else return "The second to last evolution effect is multiplied by 500.";
		} else {
			if (player.e.points.gte(14)) return "The last evolution effect is multiplied by 16,000.";
			else return "The last evolution effect is multiplied by 500.";
		};
	},
	20() {
		if (player.cb.unlocked) return;
		else return "You keep all stimulation upgrades on row 3 resets.";
	},
	26() {
		if (player.e.points.gte(83)) return;
		else if (player.e.points.gte(36)) return "The acclimation requirement is divided by 1.0915.";
		else return "The acclimation requirement is divided by 1.0915.<br>The base of the last evolution effect is multiplied by 10,000.";
	},
	30() {
		if (player.sp.unlocked) return;
		else return "More automation for growth is unlocked.";
	},
	36() {
		if (player.cb.unlocked) return;
		else if (player.e.points.gte(68)) return "You keep the first fourty-one growth enhancements on row 3 resets.";
		else if (player.e.points.gte(36)) return "The base of the last evolution effect is multiplied by 1e1545.<br>You keep the first fourty-one growth enhancements on row 3 resets.";
		else return "The base of the last evolution effect is multiplied by 1e1541.<br>You keep the first fourty-one growth enhancements on row 3 resets.";
	},
	60() {
		if (player.l.points.gte(3) || player.cy.unlocks[0] >= 2) return;
		else if (player.sp.unlocked) return "Potential growth points are automatically claimed.";
		else return "A new layer is unlocked.";
	},
	68() {
		if (player.e.points.gte(142)) return;
		else if (player.e.points.gte(68)) return "The base of the last evolution effect is multiplied by 1e21,095.";
		else return "The base of the last evolution effect is multiplied by 1e19,550.";
	},
	83() {
		if (player.e.points.gte(180)) return;
		else if (player.e.points.gte(155)) return "The extra INT from evolutions is multiplied by 1.5.";
		else if (player.e.points.gte(120)) return "The acclimation requirement is divided by 2.905081825.<br>The extra INT from evolutions is multiplied by 1.5.";
		else if (player.e.points.gte(105)) return "The acclimation requirement is divided by 2.905081825.<br>The extra STR, WIS, and INT from evolutions is multiplied by 1.5.";
		else if (player.e.points.gte(83)) return "The acclimation requirement is divided by 2.905081825.<br>The extra STR, WIS, AGI, and INT from evolutions is multiplied by 1.5.";
		else return "The acclimation requirement is divided by 2.66155.<br>The extra STR, WIS, AGI, and INT from evolutions is multiplied by 1.5.";
	},
	105() {
		if (player.e.points.gte(180)) return;
		else if (player.e.points.gte(105)) return "The extra AGI from evolutions is multiplied by 9.";
		else return "The extra AGI from evolutions is multiplied by 6.";
	},
	120() {
		if (player.e.points.gte(789)) return;
		else if (player.e.points.gte(120)) return "The extra STR and WIS from evolutions is multiplied by 6.";
		else return "The extra STR and WIS from evolutions is multiplied by 4.";
	},
	142() {
		if (player.e.points.gte(142)) return "The base of the last evolution effect is multiplied by 1e77,095.";
		else return "The base of the last evolution effect is multiplied by 1e56,000.";
	},
	155() {
		if (player.e.points.gte(397)) return;
		else if (player.e.points.gte(155)) return "The acclimation requirement is divided by 11.6203273.";
		else return "The acclimation requirement is divided by 4.";
	},
	180() {
		if (player.e.points.gte(322)) return;
		else if (player.e.points.gte(180)) return "The extra AGI from evolutions is multiplied by 36.<br>The extra INT from evolutions is multiplied by 60.";
		else return "The extra AGI from evolutions is multiplied by 4<br>The extra INT from evolutions is multiplied by 40.";
	},
	233() {
		if (player.e.points.gte(256) || tmp.e.effect[4].gte(1e300)) return;
		else return "The second to last evolution effect is improved.";
	},
	256() {
		if (tmp.e.effect[4].gte(1e300)) return;
		else return "The second to last evolution effect is improved further.";
	},
	270: "The 10th retrogression has an additional reward.",
	282() {
		if (player.e.points.gte(343)) return;
		else return "The 10th retrogression's last effect is improved.";
	},
	322() {
		if (player.e.points.gte(789)) return;
		else if (player.e.points.gte(322)) return "The extra AGI from evolutions is multiplied by 144.<br>The extra INT from evolutions is multiplied by 240.";
		else return "The extra AGI from evolutions is multiplied by 4.<br>The extra INT from evolutions is multiplied by 4.";
	},
	343() {
		if (player.e.points.gte(619)) return;
		else return "The 10th retrogression's last effect is improved further.";
	},
	397() {
		if (player.e.points.gte(728)) return;
		else if (player.e.points.gte(397)) return "The acclimation requirement is divided by 23.2406546.";
		else return "The acclimation requirement is divided by 2.";
	},
	503: "The base of the 10th retrogression's second effect is increased by 8.",
	570() {
		if (player.e.points.gte(635)) return;
		else return "The growth requirement base is decreased by 0.025.";
	},
	619() {
		if (player.e.points.gte(886)) return;
		else return "The 10th retrogression's last effect is improved even further.";
	},
	635() {
		if (player.e.points.gte(974)) return;
		else if (player.e.points.gte(635)) return "The growth requirement base is decreased by 0.04.";
		else return "The growth requirement base is decreased by 0.015.";
	},
	728() {
		if (player.e.points.gte(1306)) return;
		else if (player.e.points.gte(728)) return "The acclimation requirement is divided by 34.8609819.";
		else return "The acclimation requirement is divided by 1.5.";
	},
	789() {
		if (player.e.points.gte(1345)) return;
		else return "The extra STR, WIS, AGI, and INT from evolutions are greater.";
	},
	824() {
		if (player.e.points.gte(1142)) return;
		else return "The species requirement base is decreased by 0.05.";
	},
	886: "The 10th retrogression's last effect is improved even further still.",
	940() {
		if (player.e.points.gte(1425) || hasMilestone("a", 54)) return;
		else return "The 10th retrogression is easier.";
	},
	974() {
		if (player.e.points.gte(974)) return "The growth requirement base is decreased by 0.042.";
		else return "The growth requirement base is decreased by 0.002.";
	},
	1142() {
		if (player.e.points.gte(1372)) return;
		else if (player.e.points.gte(1142)) return "The species requirement base is decreased by 0.08.";
		else return "The species requirement base is decreased by 0.03.";
	},
	1306() {
		if (player.e.points.gte(2498)) return;
		else if (player.e.points.gte(1306)) return "The acclimation requirement is divided by 348.609819.";
		else return "The acclimation requirement is divided by 10.";
	},
	1345: "The extra STR, WIS, AGI, and INT from evolutions are even greater.",
	1372() {
		if (player.e.points.gte(1591)) return;
		else if (player.e.points.gte(1372)) return "The species requirement base is decreased by 0.1.";
		else return "The species requirement base is decreased by 0.02.";
	},
	1425() {
		if (player.e.points.gte(1547) || hasMilestone("a", 54)) return;
		else return "The 10th retrogression is even easier.";
	},
	1547() {
		if (hasMilestone("a", 54)) return;
		else return "The 10th retrogression is even easier still.";
	},
	1591() {
		if (player.e.points.gte(2171)) return;
		else if (player.e.points.gte(1591)) return "The species requirement base is decreased by 0.1375.";
		else return "The species requirement base is decreased by 0.0375.";
	},
	2171() {
		if (player.e.points.gte(2420)) return;
		if (player.e.points.gte(2171)) return "The species requirement base is decreased by 0.145.";
		else return "The species requirement base is decreased by 0.0075.";
	},
	2420() {
		if (player.e.points.gte(2420)) return "The species requirement base is decreased by 0.175.";
		else return "The species requirement base is decreased by 0.03.";
	},
	2498() {
		if (player.e.points.gte(2510)) return;
		else if (player.e.points.gte(2498)) return "The acclimation requirement is divided by 3,486.";
		else return "The acclimation requirement is divided by 10.";
	},
	2510() {
		if (player.e.points.gte(2510)) return "The acclimation requirement is divided by 34,860.";
		else return "The acclimation requirement is divided by 10.";
	},
};

addLayer("e", {
	name: "Evolution",
	symbol: "E",
	position: 0,
	branches: ["g"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		challengesUnlocked: false,
	}},
	color: "#EE7770",
	resource: "evolutions",
	row: 2,
	baseResource: "growth points",
	baseAmount() {return player.g.points},
	requires: new Decimal(300),
	type: "static",
	base() {
		let base = (inChallenge("sp", 21) ? 10 : (inChallenge("sp", 13) ? 2 : 1.5));
		if (hasMilestone("g", 50)) base -= milestoneEffect("g", 50);
		if (hasMilestone("g", 55)) base -= milestoneEffect("g", 55);
		if (hasMilestone("g", 64)) base -= milestoneEffect("g", 64);
		if (hasMilestone("g", 70)) base -= milestoneEffect("g", 70);
		if (hasMilestone("g", 73)) base -= milestoneEffect("g", 73);
		if (hasChallenge("e", 16)) base -= 0.052545;
		if (hasChallenge("e", 18)) base -= 0.02;
		if (inChallenge("ec", 11)) base *= tmp.ec.challenges[11].penalty;
		return base;
	},
	exponent() {return inChallenge("co", 11) ? 2 : 1},
	roundUpCost: true,
	canBuyMax() {return player.sp.unlocked},
	resetDescription: "Evolve for ",
	gainMult() {
		let mult = newDecimalOne();
		if (hasUpgrade("s", 85)) mult = mult.div(upgradeEffect("s", 85));
		if (hasMilestone("g", 19)) mult = mult.div(milestoneEffect("g", 19));
		if (hasMilestone("g", 24) && hasChallenge("e", 11)) mult = mult.div(milestoneEffect("g", 24));
		if (hasMilestone("g", 29)) mult = mult.div(milestoneEffect("g", 29));
		if (hasMilestone("g", 32)) mult = mult.div(milestoneEffect("g", 32));
		if (hasMilestone("g", 39)) mult = mult.div(milestoneEffect("g", 39));
		if (hasMilestone("g", 45)) mult = mult.div(milestoneEffect("g", 45));
		if (hasMilestone("g", 47)) mult = mult.div(milestoneEffect("g", 47));
		if (hasChallenge("e", 17)) mult = mult.div(challengeEffect("e", 17));
		if (hasChallenge("e", 19)) mult = mult.div(challengeEffect("e", 19));
		if (hasChallenge("e", 21) && challengeEffect("e", 21)[0]) mult = mult.div(challengeEffect("e", 21)[0]);
		if (hasChallenge("sp", 21) && challengeEffect("sp", 21)[0]) mult = mult.div(challengeEffect("sp", 21)[0]);
		if (hasMilestone("a", 52)) mult = mult.div(clickableEffect("cb", 13));
		if (hasMilestone("d", 15)) mult = mult.div(milestoneEffect("d", 15));
		if (tmp.a.effect[1]) mult = mult.div(tmp.a.effect[1]);
		if (tmp.sp.effect[0]) mult = mult.div(tmp.sp.effect[0]);
		if (tmp.cb.effect[0]) mult = mult.div(tmp.cb.effect[0]);
		if (tmp.r.effect[4]) mult = mult.div(tmp.r.effect[4]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		if (inChallenge("sp", 21)) mult = mult.div(new Decimal(5).pow(player.a.points.add(player.a.milestones.length).add(player.sp.points).add(player.cb.points).add(tmp.cb.effect[3]).add(player.d.points)));
		return mult;
	},
	effect() {
		let mult = [newDecimalOne(), newDecimalOne(), new Decimal(2), new Decimal(0.5), new Decimal(0.25), newDecimalOne()];
		// extra effects
		if (player.e.points.gte(6)) mult[4] = mult[4].mul(32);
		if (player.e.points.gte(14)) mult[4] = mult[4].mul(500);
		if (player.e.points.gte(26)) mult[5] = mult[5].mul(10000);
		if (player.e.points.gte(36)) mult[5] = mult[5].mul("1e1541");
		if (player.e.points.gte(68)) mult[5] = mult[5].mul("1e19550");
		if (player.e.points.gte(83)) {
			mult[0] = mult[0].mul(1.5);
			mult[1] = mult[1].mul(1.5);
			mult[2] = mult[2].mul(1.5);
			mult[3] = mult[3].mul(1.5);
		};
		if (player.e.points.gte(105)) mult[2] = mult[2].mul(6);
		if (player.e.points.gte(120)) {
			mult[0] = mult[0].mul(4);
			mult[1] = mult[1].mul(4);
		};
		if (player.e.points.gte(142)) mult[5] = mult[5].mul("1e56000");
		if (player.e.points.gte(180)) {
			mult[2] = mult[2].mul(4);
			mult[3] = mult[3].mul(40);
		};
		if (player.e.points.gte(322)) {
			mult[2] = mult[2].mul(4);
			mult[3] = mult[3].mul(4);
		};
		if (player.e.points.gte(1345)) {
			mult[0] = mult[0].mul(50);
			mult[1] = mult[1].mul(50);
			mult[2] = mult[2].mul(1.5);
			mult[3] = mult[3].mul(5);
		};
		// challenge completions
		if (hasChallenge("e", 12)) mult[3] = mult[3].mul(4);
		if (hasChallenge("e", 13)) mult[2] = mult[2].mul(2);
		if (hasChallenge("e", 14)) mult[1] = mult[1].mul(1.6);
		if (hasChallenge("e", 15)) {
			mult[0] = mult[0].mul(1.6);
			mult[5] = mult[5].mul(10000);
		};
		if (hasChallenge("e", 16)) {
			mult[0] = mult[0].mul(1.25);
			mult[1] = mult[1].mul(1.25);
			mult[2] = mult[2].mul(1.25);
			mult[3] = mult[3].mul(1.25);
		};
		if (hasChallenge("e", 17)) {
			mult[0] = mult[0].mul(1.25);
			mult[1] = mult[1].mul(1.25);
		};
		if (hasChallenge("sp", 12)) {
			mult[0] = mult[0].mul(10);
			mult[1] = mult[1].mul(10);
			mult[2] = mult[2].mul(10);
		};
		// layer effects
		if (tmp.sp.effect[1]) {
			mult[0] = mult[0].mul(tmp.sp.effect[1]);
			mult[1] = mult[1].mul(tmp.sp.effect[1]);
			mult[2] = mult[2].mul(tmp.sp.effect[1]);
			mult[3] = mult[3].mul(tmp.sp.effect[1]);
		};
		let pow5 = newDecimalOne();
		if (tmp.sp.effect[2]) pow5 = pow5.mul(tmp.sp.effect[2]);
		// prep
		let baseStats = (player.e.points.gte(789) ? new Decimal(1.4).pow(player.e.points.pow(0.5)) : player.e.points);
		// return
		return [
			baseStats.mul(mult[0]).floor(),
			baseStats.mul(mult[1]).floor(),
			baseStats.mul(mult[2]).floor(),
			baseStats.mul(mult[3]).floor(),
			(player.e.points.gte(233) ? new Decimal(player.e.points ? 2.5 : 1.5).pow(player.e.points).min(1e300) : player.e.points.mul(mult[4]).min(1e300)),
			new Decimal(10).mul(mult[5]).pow(player.e.points.pow(pow5)),
		];
	},
	effectDescription() {
		let text = "which are giving " + formatWhole(tmp.e.effect[0]) + " extra STR, " + formatWhole(tmp.e.effect[1]) + " extra WIS, " + formatWhole(tmp.e.effect[2]) + " extra AGI, and " + formatWhole(tmp.e.effect[3]) + " extra INT, as well as generating +" + format(tmp.e.effect[4]) + "% of potential stimulations per second";
		if (tmp.e.effect[4].gte(1e300)) text += " (maxed)";
		if (hasChallenge("e", 13)) text += " and dividing growth requirement by /" + format(tmp.e.effect[5]);
		return text;
	},
	resetsNothing() {return player.d.unlocked},
	autoPrestige() {return player.d.unlocked},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let pending = false;
			let text = "";
			for (const key in extraEvolutionEffects) {
				const eff = (typeof extraEvolutionEffects[key] == "function" ? extraEvolutionEffects[key]() : extraEvolutionEffects[key]);
				if (Object.hasOwnProperty.call(extraEvolutionEffects, key) && eff) {
					if (player.e.points.gte(+key)) {
						if (+key === 26 && !hasChallenge("e", 13)) {
							text += "<br><br>You need to complete the 3rd retrogression to obtain the next effect.";
							break;
						} else {
							if (!text.startsWith("Extra effect(s):")) text += "Extra effect(s):";
							text += "<br>" + eff;
						};
					} else if (player.e.points.add(tmp.e.resetGain).gte(+key) && tmp.e.canReset) {
						if (!pending) {
							if (text) text += "<br><br>";
							text += "Pending effect(s):";
						};
						text += "<br>" + eff;
						pending = true;
					} else {
						if (text) text += "<br><br>";
						if (+key === 1) text += "After you evolve 1 time";
						else text += "After you evolve " + formatWhole(key) + " times";
						text += ", you will obtain the following effect" + (eff.includes("<br>") ? "s" : "") + ":<br>" + eff;
						break;
					};
				};
			};
			return text;
		}],
		"blank",
		"challenges",
		"blank",
	],
	layerShown() {return hasMilestone("g", 15) || player.e.unlocked},
	hotkeys: [{
		key: "e",
		description: "E: reset for evolutions",
		onPress() {if (player.e.unlocked) doReset("e")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		if (player.cy.unlocks[1] >= 9
			|| player.l.points.gte(2)
			|| player.ec.points.gte(3)
			|| (layers[resettingLayer].row == 3 && player.cb.points.gte(6))
			|| resettingLayer == "sp"
		) keep.push("challenges");
		layerDataReset("e", keep);
	},
	update(diff) {
		if (hasMilestone("g", 24) && !player.e.challengesUnlocked) player.e.challengesUnlocked = true;
		if (hasMilestone("d", 22) && tmp.e.challenges[21].completionLimit > player.e.challenges[21]) player.e.challenges[21] = tmp.e.challenges[21].completionLimit;
		else if (hasMilestone("a", 54) && tmp.e.challenges[21].completionLimit > player.e.challenges[21]) player.e.challenges[21]++;
		player.e.challenges[21] = Math.floor(player.e.challenges[21]);
	},
	componentStyles: {
		"challenge"() {return {"min-height": "360px", "height": "fit-content", "border-radius": "50px"}},
	},
	challenges: {
		11: {
			name: "1st Retrogression",
			fullDisplay() {return "Entering this retrogression does an evolution reset.<br>While in this retrogression, you cannot buy INT.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: You always have all stimulation upgrades unlocked, you keep the first fifteen stimulation upgrades on growth resets, and the effects of <b>Growth enhancement I</b>, <b>Evolution enhancement III</b>, and INT are changed"},
			goal: 290,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return player.e.challengesUnlocked || hasChallenge("e", this.id)},
			overrideResetsNothing: true,
			style: {"width": "250px"},
		},
		12: {
			name: "2nd Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, you cannot buy STR, WIS, or AGI.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: The costs of STR, WIS, AGI, and INT are reduced by one level, the extra INT from evolutions is multiplied by 4, and you keep the first sixteen growth enhancements on evolve resets";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			goal: 215,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 8,
			enterable() {return player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)},
			overrideResetsNothing: true,
			style: {"width": "250px"},
		},
		13: {
			name: "3rd Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, you cannot buy stimulation upgrades.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: The extra AGI from evolutions is multiplied by 2, unlock 5 more stimulation upgrades, and a new evolution effect is unlocked " + (hasChallenge("e", this.id) ? " (already unlocked)" : "");
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			goal: 345,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 11,
			enterable() {return player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)},
			overrideResetsNothing: true,
			style: {"width": "250px"},
		},
		14: {
			name: "4th Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, your power gain will not increase.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: The extra WIS from evolutions is multiplied by 1.6 and if STR, WIS, AGI, and INT are all level 100 not counting extra levels, the maximum levels of STR, WIS, AGI, and INT will increase by 60 but their costs will increase much faster";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			goal: 650,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 14,
			enterable() {return player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)},
			overrideResetsNothing: true,
			style: {"width": "250px"},
		},
		15: {
			name: "5th Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, all previous in retrogression effects are applied, but growth enhancements past 16 multiply power by 1e10 after that.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: The base of the last evolution effect is multiplied by 10,000 and the extra STR from evolutions is multiplied by 1.6";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			goal: 660,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 18,
			enterable() {return player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)},
			overrideResetsNothing: true,
			countsAs: [11, 12, 13, 14],
			style: {"width": "250px"},
		},
		16: {
			name: "6th Retrogression",
			fullDisplay() {return "Entering this retrogression does an evolution reset.<br>While in this retrogression, you cannot buy STR, WIS, AGI, or INT.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: evolution requirement base is decreased by 0.052545, the extra STR, WIS, AGI, and INT from evolutions is multiplied by 1.25, and acclimation requirement is divided based on evolutions (currently&nbsp;/" + format(this.rewardEffect()) + ")"},
			rewardEffect() {
				let exp = new Decimal(0.439);
				if (hasMilestone("a", 19)) exp = exp.add(milestoneEffect("a", 19));
				return player.e.points.add(1).pow(exp);
			},
			goal: 106907666,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return (hasChallenge("e", this.id - 1) && hasMilestone("a", 12)) || hasChallenge("e", this.id)},
			enterable() {return player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)},
			overrideResetsNothing: true,
			style: {"width": "250px"},
		},
		17: {
			name: "7th Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, the original growth requirement base is set to 10.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: The extra STR and WIS from evolutions is multiplied by 1.25 and evolution and acclimation requirements are divided based on retrogressions completed (currently&nbsp;/" + format(this.rewardEffect()) + ")";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			rewardEffect() {
				let retrogressions = 0;
				for (const id in player.e.challenges)
					if (Object.hasOwnProperty.call(player.e.challenges, id))
						retrogressions += player.e.challenges[id];
				let base = new Decimal(1.1);
				if (hasMilestone("a", 16)) base = base.add(milestoneEffect("a", 16));
				let mult = newDecimalOne();
				if (hasChallenge("e", 21) && challengeEffect("e", 21)[2]) mult = mult.mul(challengeEffect("e", 21)[2]);
				return base.pow(retrogressions).mul(mult);
			},
			goal: 53356750,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 95,
			enterable() {return player.e.points.gte(this.unlockReq)},
			overrideResetsNothing: true,
			style: {"width": "250px"},
		},
		18: {
			name: "8th Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, the growth requirement cannot be modified by effects.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: growth requirement base is decreased by 0.01, evolution requirement base is decreased by 0.02, and the last population effect is multiplied based on retrogressions completed (currently&nbsp;" + format(this.rewardEffect()) + "x)";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			rewardEffect() {
				let retrogressions = 0;
				for (const id in player.e.challenges)
					if (Object.hasOwnProperty.call(player.e.challenges, id))
						retrogressions += player.e.challenges[id];
				let exp = new Decimal(0.25);
				if (hasMilestone("a", 21)) exp = exp.add(milestoneEffect("a", 21));
				let mult = newDecimalOne();
				if (hasChallenge("e", 21) && challengeEffect("e", 21)[2]) mult = mult.mul(challengeEffect("e", 21)[2]);
				return new Decimal(retrogressions).add(1).pow(exp).mul(mult);
			},
			goal: 6947077,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 124,
			enterable() {return player.e.points.gte(this.unlockReq)},
			overrideResetsNothing: true,
			style: {"width": "250px"},
		},
		19: {
			name: "9th Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, all previous in retrogression effects are applied.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: Power gain is exponentiated by 1.02, the first population effect's exponent is multiplied by 100, and evolution requirement is divided based on evolutions (currently&nbsp;/" + format(this.rewardEffect()) + ")";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			rewardEffect() {
				let exp = new Decimal(0.026);
				if (hasMilestone("a", 23)) exp = exp.add(milestoneEffect("a", 23));
				return player.e.points.mul(player.sp.points).add(1).pow(exp);
			},
			goal: 65556,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 148,
			enterable() {return player.e.points.gte(this.unlockReq)},
			overrideResetsNothing: true,
			countsAs: [11, 12, 13, 14, 15, 16, 17, 18],
			style: {"width": "250px"},
		},
		21: {
			name: "10th Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)) return "Entering this retrogression does an evolution reset" + (player.e.points.gte(1547) ? "" : " and forcibly removes all of your growth enhancements") + ".<br>While in this retrogression, the original growth requirement base is set to 10; growth requirement cannot be modified by effects except the effect of AGI; extra STR, WIS, AGI, and INT levels are nullified; the costs of STR, WIS, AGI, and INT are multiplied by 10 but buying them does not spend any growth points;" + (player.cb.unlocked ? "" : " you always keep stimulation upgrades on growth resets;") + " and each evolution past " + (player.e.points.gte(1425) ? "1,000 divides growth requirement by 1e1,000,000" : (player.e.points.gte(940) ? "900 divides growth requirement by 1e100,000" : "200 divides growth requirement by 1e10")) + ".<br><br>Goal: " + formatWhole(this.goal()) + " growth points<br><br>Completions: " + formatWhole(challengeCompletions("e", this.id)) + "/" + formatWhole(this.completionLimit()) + "<br><br>Rewards: evolution requirement is divided (currently&nbsp;/" + format(this.rewardEffect()[0]) + "), population maximum is multiplied (currently&nbsp;" + format(this.rewardEffect()[1]) + "x), " + (player.e.points.gte(270) ? " effects based on retrogressions completed are multiplied (currently&nbsp;" + format(this.rewardEffect()[2]) + "x), and power gain is multiplied based on your population" + (player.e.points.gte(282) ? " and acclimation points" : "") + " (currently&nbsp;" + format(this.rewardEffect()[3]) + "x)" : "and effects based on retrogressions completed are multiplied (currently&nbsp;" + format(this.rewardEffect()[2]) + "x)") + "<div><br></div>";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression. It is the very last one. Are you ready?";
			},
			rewardEffect() {
				// 1st effect base
				let base0 = new Decimal(5);
				if (hasMilestone("a", 29)) base0 = base0.add(milestoneEffect("a", 29));
				if (hasMilestone("a", 33)) base0 = base0.add(milestoneEffect("a", 33));
				if (hasMilestone("a", 44)) base0 = base0.add(milestoneEffect("a", 44));
				// 2nd effect base
				let base1 = new Decimal(2);
				if (player.e.points.gte(503)) base1 = base1.add(8);
				// 3rd effect base
				let base2 = new Decimal(1.2);
				if (hasMilestone("a", 52)) base2 = base2.add(0.05);
				// first three effects
				let eff = [
					base0.pow(challengeCompletions("e", this.id)),
					base1.pow(challengeCompletions("e", this.id)),
					base2.pow(challengeCompletions("e", this.id)),
					newDecimalOne(),
				];
				// last effect
				if (player.e.points.gte(886)) eff[3] = new Decimal(player.a.population).pow(50).mul(new Decimal(1e25).pow(player.a.points)).pow((challengeCompletions("e", this.id) * 10) ** 1.1);
				else if (player.e.points.gte(619)) eff[3] = new Decimal(player.a.population).pow(50).mul(new Decimal(10).pow(player.a.points)).pow(challengeCompletions("e", this.id) * 10);
				else if (player.e.points.gte(343)) eff[3] = new Decimal(player.a.population).pow(50).mul(new Decimal(10).pow(player.a.points)).pow(challengeCompletions("e", this.id) * 2);
				else if (player.e.points.gte(282)) eff[3] = new Decimal(player.a.population).mul(new Decimal(10).pow(player.a.points)).pow(challengeCompletions("e", this.id) * 2);
				else if (player.e.points.gte(270)) eff[3] = new Decimal(player.a.population).pow(challengeCompletions("e", this.id) * 2);
				// return
				return eff;
			},
			goal() {return [1932, 2132, 2525, 4960, 6390, 9111, 23866, 27200, 31550, 165360, 172222, 237101, 274600, 299075, 417088, 438088, 543644, 574280, 1891455, 2369288, 2710577, 3038161, 3432757, 12804264, 18518825, 25033969, 41771320, 44681050, 53741755, 56712288, 64654633, 89470100, 94354100, 504777099, 580014455, 618312800, 655288313, 677988377, 734667450, 811310777, 914555555][challengeCompletions("e", this.id)] || Infinity},
			canComplete() {return player.g.points.gte(this.goal())},
			unlocked() {return hasChallenge("e", 19) || hasChallenge("e", this.id)},
			unlockReq: 209,
			enterable() {return player.e.points.gte(this.unlockReq) || hasChallenge("e", this.id)},
			overrideResetsNothing: true,
			onEnter() {if (!player.e.points.gte(1547)) player.g.milestones = []},
			onExit() {this.onEnter()},
			completionLimit() {
				let limit = 22;
				if (hasMilestone("a", 42)) limit += milestoneEffect("a", 42);
				if (player.cb.focusUnlocked) limit += clickableEffect("cb", 11);
				if (tmp.r.effect[2]) limit *= tmp.r.effect[2].toNumber();
				return Math.floor(limit);
			},
			style: {"width": "calc(100% - 8px)", "max-width": "600px"},
		},
	},
});
