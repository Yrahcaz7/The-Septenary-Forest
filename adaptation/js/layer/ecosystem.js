addLayer("ec", {
	name: "Ecosystem",
	symbol: "EC",
	position: 0,
	branches: ["sp", ["cb", 2]],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		chronoTime: 0,
	}},
	color: "#116022",
	resource: "ecosystems",
	row: 4,
	baseResource: "species",
	baseAmount() {return player.sp.points},
	requires: new Decimal(30),
	type: "static",
	base() {
		let base = 1.5;
		if (challengeCompletions("ec", 11) >= 5 && challengeEffect("ec", 11)[4]) base -= challengeEffect("ec", 11)[4];
		if (challengeCompletions("ec", 11) >= 22 && challengeEffect("ec", 11)[21]) base -= challengeEffect("ec", 11)[21];
		if (challengeCompletions("ec", 11) >= 28 && challengeEffect("ec", 11)[27]) base -= challengeEffect("ec", 11)[27];
		if (hasMilestone("r", 60)) base -= milestoneEffect("r", 60);
		return base;
	},
	exponent() {return inChallenge("co", 11) ? 2 : 1},
	roundUpCost: true,
	canBuyMax() {return player.l.points.gte(3) || player.cy.unlocked},
	resetDescription: "Ecologically succeed for ",
	gainMult() {
		let mult = newDecimalOne();
		if (getGridData("w", 104)) mult = mult.div(gridEffect("w", 104));
		if (tmp.ec.effect[3]) mult = mult.div(tmp.ec.effect[3]);
		if (tmp.r.effect[6]) mult = mult.div(tmp.r.effect[6]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		if (tmp.co.effect[0]) mult = mult.div(tmp.co.effect[0]);
		if (tmp.co.effect[5]) mult = mult.div(tmp.co.effect[5]);
		if (tmp.t.effect[5] && hasMilestone("d", 62)) mult = mult.div(tmp.t.effect[5]);
		if (tmp.cy.effect[2]) mult = mult.div(tmp.cy.effect[2]);
		return mult;
	},
	effect() {
		let base0 = new Decimal(5);
		if (player.ec.points.gte(9)) base0 = base0.mul(4);
		if (hasMilestone("r", 19)) base0 = base0.mul(5000000);
		return [
			base0.pow(player.ec.points),
			player.ec.points.mul(player.cy.unlocks[1] >= 11 ? 100 : 5),
			(player.ec.points.gt(0) ? new Decimal(100).pow(player.ec.points).min(1e300) : newDecimalZero()),
			(player.ec.challenges[11] >= 20 ? player.ec.points.pow_base(player.cy.unlocks[1] >= 11 ? 1.025 : 1.01) : newDecimalOne()),
		];
	},
	effectDescription() {
		if (player.ec.challenges[11] >= 20) return "which are dividing the species requirement by /" + format(tmp.ec.effect[0]) + ", increasing the completion limit of the 10th hybridization by +" + formatWhole(tmp.ec.effect[1]) + ", generating +" + format(tmp.ec.effect[2]) + "% of potential stimulations per second" + (tmp.ec.effect[2].gte(1e300) ? " (maxed)" : "") + ", and dividing all row 5 requirements by /" + format(tmp.ec.effect[3]);
		return "which are dividing the species requirement by /" + format(tmp.ec.effect[0]) + ", increasing the completion limit of the 10th hybridization by +" + formatWhole(tmp.ec.effect[1]) + ", and generating +" + format(tmp.ec.effect[2]) + "% of potential stimulations per second" + (tmp.ec.effect[2].gte(1e300) ? " (maxed)" : "");
	},
	resetsNothing() {return player.cy.unlocks[2] >= 1},
	autoPrestige() {return player.cy.unlocks[2] >= 1},
	tabFormat() {
		// succeession text
		let text = "You keep hybridization completions on ecosystem resets.<br><br>After succeeding 1 time, more automation for acclimation is always unlocked<br>and you can bulk species, conscious beings, and domination points.<br><br>The above extra effects will not go away even if this layer is reset.";
		if (player.ec.points.gte(2)) text += "<br><br>After succeeding 3 times, you keep retrogression completions on all resets.";
		if (player.ec.points.gte(5)) text += "<br>After succeeding 6 times, you keep stimulation upgrades on all resets.";
		if (player.ec.points.gte(8)) text += "<br>After succeeding 9 times, the first ecosystem effect is improved.";
		// tab format
		let arr = [
			"main-display",
			"prestige-button",
			"resource-display",
			["display-text", text],
			"blank",
		];
		// ANACHRONISM html
		if (options.hideChallenges && maxedChallenge("ec", 11) && !inChallenge("ec", 11)) {
			arr.push("blank");
		} else {
			let html = "<div class='challenge " + challengeStyle("ec", 11);
			html += "' style='width: 500px; height: 500px; border-radius: 50%; border-color: #116022; color: #116022'>";
			html += "<div style='height: 210px; display: flex'><h1>" + tmp.ec.challenges[11].name + "</h1></div>";
			html += "<div style='height: 210px; display: flex; margin-top: 80px'><span>" + layers.ec.challenges[11].fullDisplay() + "</span></div><button";
			if (tmp.ec.challenges[11].enterable) html += " class='can' style='position: absolute; top: calc(50% - 50px); left: calc(50% - 50px); width: 100px; height: 100px; border: none; border-radius: 50%; background-color: #116022; color: #FFFFFF; z-index: 1; transform: none; box-shadow: none'";
			else html += " class='locked' style='position: absolute; top: calc(50% - 50px); left: calc(50% - 50px); width: 100px; height: 100px; border: 5px solid #116022; border-radius: 50%; background-color: var(--locked); color: #116022; z-index: 1; transform: none; box-shadow: none'";
			html += " onclick='if (tmp.ec.challenges[11].enterable) startChallenge(\"ec\", 11)'>";
			html += challengeButtonText("ec", 11) + "</button>";
			let rotation = (player.ec.activeChallenge == 11 ?
				Math.floor(player.ec.chronoTime - Date.now() / 1000) % 60 * 6
				: Math.floor(Date.now() / 1000 - player.ec.chronoTime) % 60 * 6
			);
			html += "<div style='position: absolute; top: -2px; left: 247.5px; width: 5px; height: 252px; background-color: #116022C0; transform-origin: 50% 100%; transform: rotate(" + rotation + "deg)'></div>";
			html += "<button onclick='if (player.ec.unlocked && tmp.ec.challenges[11].enterable && player.ec.chronoTime !== 0) player.ec.chronoTime = 0'";
			if (player.ec.unlocked && tmp.ec.challenges[11].enterable && player.ec.chronoTime !== 0) html += " class='can' style='position: absolute; top: 430px; left: 430px; width: 70px; height: 70px; border: none; border-radius: 50%; background-color: #116022; color: #FFFFFF; transform: none; box-shadow: none'>SYNC OFF</button>";
			else html += " class='locked' style='position: absolute; top: 430px; left: 430px; width: 70px; height: 70px; border: 5px solid #116022; border-radius: 50%; background-color: var(--locked); color: #116022; transform: none; box-shadow: none'>SYNC ON</button>";
			if (tmp.ec.challenges[11].marked) html += "<div class='star' style='position: absolute; left: 20px; top: 20px; border-bottom-color: #116022; transform: scale(2)'></div>";
			arr.push(["raw-html", html], "blank");
		};
		// ANACHRONISM rewards
		if (hasChallenge("ec", 11)) {
			let rewards = "";
			for (let index = 0; index < challengeCompletions("ec", 11); index++) {
				if (index > 0) rewards += "<br>";
				const reward = layers.ec.challenges[11].rewards[index];
				rewards += layers.ec.challenges[11].name(index + 1) + " reward: " + (reward instanceof Function ? reward() : reward);
			};
			arr.push(["display-text", rewards], "blank");
		};
		// return
		return arr;
	},
	layerShown() {return hasChallenge("sp", 19) || player.ec.unlocked},
	hotkeys: [{
		key: "c",
		description: "C: reset for ecosystems",
		onPress() {if (player.ec.unlocked) doReset("ec")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		const keep = [];
		if (player.cy.unlocks[1] >= 8 || player.l.points.gte(5)) keep.push("challenges");
		layerDataReset("ec", keep);
	},
	update(diff) {
		if (inChallenge("ec", 11)) {
			Vue.set(player.e, "activeChallenge", 21);
			Vue.set(player.sp, "activeChallenge", 21);
		};
	},
	challenges: {
		11: {
			name(x = Math.min(challengeCompletions("ec", 11) + 1, tmp.ec.challenges[11].completionLimit)) {
				let text = "ANACHRONISM ";
				if (x >= 10) text += ["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"][Math.floor(x / 10) % 10 - 1];
				if (x % 10 >= 1) text += ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][x % 10 - 1];
				return text;
			},
			fullDisplay() {
				if (challengeCompletions("sp", 21) >= 18 || hasChallenge("ec", 11)) {
					let text = "";
					if (challengeCompletions("ec", 11) >= 12 && tmp.ec.challenges[11].completionLimit > 12) text += "Entering any ANACHRONISM past XII does an ecosystem reset.";
					else text += "Entering any ANACHRONISM does a species reset.";
					text += "<br><br>While in " + tmp.ec.challenges[11].name + ", the evolution and acclimation<br>requirement bases are multipled by " + formatWhole(tmp.ec.challenges[11].penalty) + "."
					text += "<br><br>While in any ANACHRONISM, you are trapped in<br>the 10th retrogression and hybridization.";
					text += "<br><br>Goal: " + formatWhole(tmp.ec.challenges[11].goal) + " growth points";
					text += "<br><br>Completed: " + formatWhole(challengeCompletions("ec", 11)) + "/" + formatWhole(tmp.ec.challenges[11].completionLimit);
					return text;
				};
				return "You need 18 completions of the 10th hybridization<br>to unlock ANACHRONISM.";
			},
			rewardEffect() {return [0.1, null, 3, 0.125, 0.05, 3, null, null, null, 0.03, 0.45, 0.1, 0.1, 0.075, null, null, null, null, null, null, 0.01, 0.064, null, 0.02, null, null, 0.01, 0.025, 0.01]},
			rewards: [
				"domination requirement base is decreased by 0.1",
				() => "three new layers are unlocked" + (player.r.unlocked ? " (" + (player.w.unlocked ? "" : (player.ex.unlocked ? 2 : 1) + "/3 ") + "already unlocked)" : ""),
				"revolution requirement base is decreased by 3",
				"acclimation requirement base is decreased by 0.125",
				"ecosystem requirement base is decreased by 0.05",
				"expansion requirement base is decreased by 3",
				() => "something new is unlocked for expansion" + (player.ex.influenceUnlocked ? " (already unlocked)" : ""),
				"influence generator and tickspeed cost scalings are reduced",
				"the first and last revolution effects are improved",
				"domination requirement base is decreased by 0.03",
				"war requirement base is decreased by 0.45",
				"revolution requirement base is decreased by 0.1",
				"war requirement base is decreased by 0.1",
				"war requirement base is decreased by 0.075",
				() => "something new is unlocked for leaders" + (player.l.focusUnlocked ? " (already unlocked)" : ""),
				() => "two new layers are unlocked" + (player.co.unlocked ? " (" + (player.t.unlocked ? "" : "1/2 ") + "already unlocked)" : ""),
				() => "something new is unlocked for continents" + (player.co.migrationUnlocked ? " (already unlocked)" : ""),
				() => "something new is unlocked for territories" + (player.t.controlUnlocked ? " (already unlocked)" : ""),
				"the first two continent effects are improved",
				"a new effect for ecosystems is unlocked",
				"war requirement base is decreased by 0.01",
				"ecosystem requirement base is decreased by 0.064",
				"the first two continent effects are improved again",
				"row 6 resource requirement bases are decreased by 0.02",
				"a new faction growth option is unlocked",
				"the first two cyclical power effects are improved",
				"expansion requirement base is decreased by 0.01",
				"ecosystem requirement base is decreased by 0.025",
				"the base effect of EXP is increased by 0.01",
			],
			goal() {return [167098, 155454, 155040, 869153600, 2.874e9, 7.992e9, 3.082e11, 4.73e11, 1.228e12, 7.191e12, 9.733e12, 1.359e13, 5.222e13, 4.09e14, 3.783e15, 1.133e18, 2.975e18, 3.206e20, 7.087e21, 1.791e23, 4.166e23, 1.46e25, 5.956e25, 1.938e26, 2.89e27, 1.586e28, 1.266e29, 3.765e29, 7.092e31][Math.min(challengeCompletions("ec", 11), tmp.ec.challenges[11].completionLimit - 1)] || Infinity},
			canComplete() {return player.g.points.gte(this.goal())},
			enterable() {return challengeCompletions("sp", 21) >= 18 || hasChallenge("ec", 11)},
			completionLimit() {
				let limit = 10;
				if (hasMilestone("d", 31)) limit += milestoneEffect("d", 31);
				if (hasMilestone("r", 15)) limit += milestoneEffect("r", 15);
				if (getGridData("w", 202)) limit += gridEffect("w", 202);
				if (getGridData("w", 203)) limit += gridEffect("w", 203);
				if (getGridData("w", 205)) limit += gridEffect("w", 205);
				if (getGridData("w", 206)) limit += gridEffect("w", 206);
				if (player.l.points.gte(5)) limit++;
				limit += buyableEffect("em", 11).toNumber();
				if (player.ec.activeChallenge == 11 && typeof tmp.ec.challenges[11].completionLimit == "number" && limit > tmp.ec.challenges[11].completionLimit) {
					Vue.set(player.ec, "activeChallenge", null);
					this.onExit();
				};
				return limit;
			},
			onEnter() {
				if (challengeCompletions("ec", 11) >= 12 && tmp.ec.challenges[11].completionLimit > 12) doReset("ec", true, true);
				else doReset("sp", true, true);
				player.ec.chronoTime = Date.now() / 500 - player.ec.chronoTime;
			},
			onExit() {this.onEnter()},
			penalty() {return Math.min(10 ** (Math.min(challengeCompletions("ec", 11), tmp.ec.challenges[11].completionLimit - 1) ** 2 + 1), 1e300)},
		},
	},
});
