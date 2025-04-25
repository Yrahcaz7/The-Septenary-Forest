function getFocusBase() {
	let base = 2;
	if (getBuyableAmount("d", 11).gte(tmp.d.buyables[11].purchaseLimit)) base -= tmp.d.buyables[11].completionEffect;
	return base;
};

function getFocusRequirement() {
	let req = new Decimal(5e11);
	if (hasMilestone("a", 50)) req = req.div(milestoneEffect("a", 50));
	if (hasChallenge("sp", 13)) req = req.div(2);
	if (hasChallenge("sp", 15)) req = req.div(1.5);
	if (hasChallenge("sp", 21) && challengeEffect("sp", 21)[3]) req = req.div(challengeEffect("sp", 21)[3]);
	if (player.d.unlocks[0]) req = req.div(buyableEffect("d", 11));
	return req;
};

addLayer("cb", {
	name: "Consciousness",
	symbol: "CB",
	position: 1,
	branches: ["e", "g", "a"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		focusUnlocked: false,
	}},
	color: "#E5B55A",
	nodeStyle() {if (tmp.cb.canReset || player.cb.unlocked) return {"background": "border-box linear-gradient(to right, #EE7770, #E5B55A, #B44990)"}},
	resource: "conscious beings",
	row: 3,
	baseResource: "growth points",
	baseAmount() {return player.g.points},
	requires: new Decimal(1e15),
	type: "static",
	base() {
		let base = 10;
		if (hasChallenge("sp", 19)) base -= 2;
		if (getGridData("w", 406)) base -= gridEffect("w", 406);
		return base;
	},
	exponent() {return inChallenge("co", 11) ? 2 : 1},
	roundUpCost: true,
	canBuyMax() {return player.ec.unlocked},
	resetDescription: "Enlighten for ",
	gainMult() {
		let mult = newDecimalOne();
		if (hasChallenge("sp", 21) && challengeEffect("sp", 21)[2]) mult = mult.div(challengeEffect("sp", 21)[2]);
		if (hasMilestone("d", 39)) mult = mult.div(milestoneEffect("d", 39));
		if (getGridData("w", 105)) mult = mult.div(gridEffect("w", 105));
		if (tmp.r.effect[1]) mult = mult.div(tmp.r.effect[1]);
		if (tmp.ex.effect[0]) mult = mult.div(tmp.ex.effect[0]);
		if (tmp.ex.effect[4]) mult = mult.div(tmp.ex.effect[4]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		return mult;
	},
	directMult() {
		let mult = newDecimalOne();
		if (tmp.l.effect[2]) mult = mult.mul(tmp.l.effect[2]);
		return mult;
	},
	effect() {
		// third effect
		let pow2 = 1;
		if (hasChallenge("sp", 14)) pow2 += 0.5;
		if (hasMilestone("a", 62)) pow2 += 0.5;
		if (hasMilestone("d", 25)) pow2 += milestoneEffect("d", 25).toNumber();
		if (hasMilestone("r", 80)) pow2 *= 1000;
		// effects
		let eff = (inChallenge("sp", 16) ? [newDecimalOne(), newDecimalOne(), newDecimalOne()] : [
			new Decimal(hasChallenge("sp", 18) ? 150 : 100).pow(player.cb.points),
			new Decimal(hasChallenge("sp", 18) ? 7.5 : 5).pow(player.cb.points),
			player.cb.points.add(1).pow(pow2),
		]);
		// focus
		if (player.cb.focusUnlocked) {
			let extra = tmp.g.buyables[11].extra.add(tmp.g.buyables[12].extra).add(tmp.g.buyables[13].extra).add(tmp.g.buyables[14].extra);
			eff[3] = extra.div(getFocusRequirement()).max(1).log(getFocusBase()).floor().toNumber();
		} else {
			eff[3] = 0;
		};
		// return
		return eff;
	},
	effectDescription() {return "which are dividing the evolution requirement by /" + format(tmp.cb.effect[0]) + "; dividing the acclimation requirement by /" + format(tmp.cb.effect[1]) + "; and multiplying extra STR, WIS, AGI, and INT levels by " + format(tmp.cb.effect[2]) + "x"},
	resetsNothing() {return player.w.unlocked},
	autoPrestige() {return player.w.unlocked},
	tabFormat() {
		let text = "After enlightening 1 time, you can bulk acclimation points;<br>you keep all stimulation upgrades on row 2, 3, and 4 resets;<br>and you keep all growth enhancements on row 3 and 4 resets.<br><br>The above extra effects will not go away even if this layer is reset.";
		if (player.cb.points.gte(5)) text += "<br><br>After enlightening 6 times, you keep retrogression completions on row 4 resets.";
		let arr = [
			"main-display",
			"prestige-button",
			"resource-display",
			["display-text", text],
			"blank",
		];
		if (player.cb.focusUnlocked) {
			let svg = "<svg viewBox='0 0 500 50' style='width: 500px; height: 50px'>";
			let maximum = (hasChallenge("sp", 17) ?
				Math.max((getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0), tmp.cb.effect[3] * 2)
				: Math.max((getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0), tmp.cb.effect[3])
			);
			if (maximum > 0) {
				let right = (500 * getClickableState("cb", 12) / maximum);
				svg += "<rect x='0' y='0' width='" + (500 * getClickableState("cb", 11) / maximum) + "' height='50' fill='#EE7770'/>";
				svg += "<rect x='" + (500 - right) + "' y='0' width='" + right + "' height='50' fill='#B44990'/>";
				let div = (2 ** Math.floor(Math.log2(maximum) - 5));
				if (div > 1) maximum /= div;
				if (!hasChallenge("sp", 17)) {
					for (let index = (maximum % 1) / 2; index < maximum; index++) {
						if (index == 0) continue;
						let x = (500 * index / maximum);
						svg += "<line x1='" + x + "' y1='0' x2='" + x + "' y2='50' stroke='#E5B55A'/>";
					};
				};
			};
			svg += "</svg>";
			svg += "<div style='position: relative; float: left; margin: -54px 0px 0px 7.5px; font-size: 48px; color: #DFDFDF'>E</div>";
			svg += "<div style='position: relative; float: right; margin: -54px 9px 0px 0px; font-size: 48px; color: #DFDFDF'>A</div>";
			arr.push(["display-text", svg, {"display": "inline-block", "width": "500px", "height": "50px", "border": "solid 4px #E5B55A"}]);
			if (!hasChallenge("sp", 17)) arr.push(["row", [["clickable", 13], ["clickable", 11], ["clickable", 15], ["clickable", 12], ["clickable", 14]]]);
			arr.push("blank");
			let next = new Decimal(getFocusBase()).pow(tmp.cb.effect[3] + 1).mul(getFocusRequirement());
			arr.push(["display-text", "You have " + formatWhole(tmp.g.buyables[11].extra.add(tmp.g.buyables[12].extra).add(tmp.g.buyables[13].extra).add(tmp.g.buyables[14].extra)) + " total extra growth stat levels,<br>making the maximum focus points be " + formatWhole(tmp.cb.effect[3]) + ".<br><br>The next point can be gained at " + (next.gt(1) ? formatWhole(next.ceil()) + " extra levels." : "1 extra level.")]);
			arr.push("blank");
			if (hasMilestone("a", 52)) arr.push(["display-text", "<div style='display: inline-block; vertical-align: top; width: 50%'>You have <h2 style='color: #EE7770; text-shadow: #EE7770 0px 0px 10px'>" + formatWhole(getClickableState("cb", 11)) + "</h2> focus points allocated to evolution, which are increasing the completion limit of the 10th retrogression by " + formatWhole(clickableEffect("cb", 11)) + " and dividing the evolution requirement by /" + format(clickableEffect("cb", 13)) + "</div><div style='display: inline-block; vertical-align: top; width: 50%'>You have <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + formatWhole(getClickableState("cb", 12)) + "</h2> focus points allocated to acclimation, which are multiplying population maximum and gain by " + format(clickableEffect("cb", 12)) + "x and multiplying the exponent of the first population effect by " + format(clickableEffect("cb", 14)) + "x<div>"]);
			else arr.push(["display-text", "<div style='display: inline-block; vertical-align: top; width: 50%'>You have <h2 style='color: #EE7770; text-shadow: #EE7770 0px 0px 10px'>" + formatWhole(getClickableState("cb", 11)) + "</h2> focus points allocated to evolution, which are increasing the completion limit of the 10th retrogression by " + formatWhole(clickableEffect("cb", 11)) + "</div><div style='display: inline-block; vertical-align: top; width: 50%'>You have <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + formatWhole(getClickableState("cb", 12)) + "</h2> focus points allocated to acclimation, which are multiplying population maximum and gain by " + format(clickableEffect("cb", 12)) + "x<div>"]);
			arr.push("blank");
		};
		return arr;
	},
	layerShown() {return hasMilestone("a", 39) || player.cb.unlocked},
	hotkeys: [{
		key: "b",
		description: "B: reset for conscious beings",
		onPress() {if (player.cb.unlocked) doReset("cb")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		const keep = [];
		layerDataReset("cb", keep);
	},
	update(diff) {
		if (hasChallenge("sp", 12) && !player.cb.focusUnlocked) player.cb.focusUnlocked = true;
		if (hasChallenge("sp", 17)) {
			setClickableState("cb", 11, tmp.cb.effect[3]);
			setClickableState("cb", 12, tmp.cb.effect[3]);
		};
	},
	shouldNotify() {
		if (player.cb.focusUnlocked && (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) < tmp.cb.effect[3] && !inChallenge("sp", 16) && !hasChallenge("sp", 17)) return true;
	},
	componentStyles: {
		"prestige-button"() {if (tmp.cb.canReset && tmp.cb.nodeStyle) return tmp.cb.nodeStyle},
		"clickable"() {return {"min-height": "58px", "border": "solid 4px #E5B55A", "border-radius": "0px", "color": "#DFDFDF", "transform": "none"}},
	},
	clickables: {
		11: {
			title: "Focus on evolution",
			effect() {
				if (inChallenge("sp", 16)) return 0;
				return getClickableState("cb", 11) || 0;
			},
			canClick() {return (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) < tmp.cb.effect[3]},
			onClick() {setClickableState("cb", 11, (getClickableState("cb", 11) || 0) + 1)},
			onHold() {setClickableState("cb", 11, (getClickableState("cb", 11) || 0) + 1)},
			style: {"background-color": "#EE7770"},
		},
		12: {
			title: "Focus on acclimation",
			effect() {
				if (inChallenge("sp", 16)) return newDecimalOne();
				if (hasMilestone("a", 68)) return new Decimal(100).pow(getClickableState("cb", 12) || 0);
				return new Decimal(10).pow(getClickableState("cb", 12) || 0);
			},
			canClick() {return (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) < tmp.cb.effect[3]},
			onClick() {setClickableState("cb", 12, (getClickableState("cb", 12) || 0) + 1)},
			onHold() {setClickableState("cb", 12, (getClickableState("cb", 12) || 0) + 1)},
			style: {"background-color": "#B44990"},
		},
		13: {
			title: "MAX E",
			effect() {
				if (inChallenge("sp", 16)) return newDecimalOne();
				if (hasMilestone("a", 61)) return new Decimal(88).pow(getClickableState("cb", 11) || 0);
				if (hasMilestone("a", 52)) return new Decimal(5).pow(getClickableState("cb", 11) || 0);
			},
			canClick() {return (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) < tmp.cb.effect[3]},
			onClick() {setClickableState("cb", 11, tmp.cb.effect[3] - (getClickableState("cb", 12) || 0))},
			style: {"width": "74px", "background-color": "#EE7770"},
		},
		14: {
			title: "MAX A",
			effect() {
				if (inChallenge("sp", 16)) return 1;
				if (hasMilestone("a", 68)) return ((getClickableState("cb", 12) || 0) * 4 + 1) ** 4;
				if (hasMilestone("a", 57)) return ((getClickableState("cb", 12) || 0) * 2 + 1) ** 2;
				if (hasMilestone("a", 52)) return ((getClickableState("cb", 12) || 0) + 1) ** 0.5;
			},
			canClick() {return (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) < tmp.cb.effect[3]},
			onClick() {setClickableState("cb", 12, tmp.cb.effect[3] - (getClickableState("cb", 11) || 0))},
			style: {"width": "74px", "background-color": "#B44990"},
		},
		15: {
			title: "Reset Focus",
			canClick() {return (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) > 0},
			onClick() {
				setClickableState("cb", 11, 0);
				setClickableState("cb", 12, 0);
			},
			style: {"background-color": "#000"},
		},
	},
});
