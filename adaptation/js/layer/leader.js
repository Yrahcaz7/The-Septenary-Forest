function getFocusplusRequirement() {
	let req = 1000000;
	if (getGridData("w", 601)) req /= gridEffect("w", 601).toNumber();
	if (getGridData("w", 605)) req /= gridEffect("w", 605).toNumber();
	if (tmp.co.effect[4]) req /= tmp.co.effect[4].toNumber();
	return req;
};

addLayer("l", {
	name: "Leader",
	symbol: "L",
	position: 1,
	branches: [["ec", 2], "r", "cb", "ex", ["w", 2]],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		focusUnlocked: false,
	}},
	color: "#E5B55A",
	nodeStyle() {if (tmp.l.canReset || player.l.unlocked) return {background: "border-box linear-gradient(to right, #55B020, #E5B55A, #E03330)"}},
	resource: "leaders",
	row: 5,
	baseResource: "conscious beings",
	baseAmount() {return player.cb.points},
	requires: new Decimal(250000),
	type: "static",
	base() {
		let base = 2;
		if (challengeCompletions("ec", 11) >= 24 && challengeEffect("ec", 11)[23]) base -= challengeEffect("ec", 11)[23];
		if (hasMilestone("r", 42)) base -= milestoneEffect("r", 42);
		if (hasMilestone("r", 45)) base -= milestoneEffect("r", 45);
		if (hasMilestone("r", 51)) base -= milestoneEffect("r", 51);
		if (hasMilestone("r", 54)) base -= milestoneEffect("r", 54);
		if (hasMilestone("r", 61)) base -= milestoneEffect("r", 61);
		if (hasMilestone("r", 106)) base -= milestoneEffect("r", 106);
		return base;
	},
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return player.cy.unlocked},
	resetDescription: "Lead for ",
	gainMult() {
		let mult = newDecimalOne();
		if (hasMilestone("d", 44)) mult = mult.div(milestoneEffect("d", 44));
		if (getGridData("w", 603)) mult = mult.div(gridEffect("w", 603));
		return mult;
	},
	effect() {
		let amt = player.l.points;
		if (tmp.cy.effect[0]) amt = amt.add(tmp.cy.effect[0]);
		if (tmp.em.effect[0]) amt = amt.add(tmp.em.effect[0]);
		let lastEffAmt = new Decimal(amt);
		if (getGridData("w", 602) >= 2) lastEffAmt = lastEffAmt.mul(1.6);
		if (getGridData("w", 606) >= 2) lastEffAmt = lastEffAmt.mul(2.1);
		let eff = [
			new Decimal(2).pow(amt),
			new Decimal(getGridData("w", 604) ? gridEffect("w", 604) : 2).pow(amt),
			amt.div(4).add(1),
			(getGridData("w", 602) ? new Decimal(getGridData("w", 606) ? 75 : 3).pow(lastEffAmt) : lastEffAmt.add(1).pow(getGridData("w", 606) ? 7 : 1)),
		];
		if (player.l.focusUnlocked) eff[4] = Math.floor((tmp.cb.effect[3] / getFocusplusRequirement()) ** 0.8);
		else eff[4] = 0;
		return eff;
	},
	effectDescription() {return "which are multiplying power and stimulation gain by " + format(tmp.l.effect[0]) + "x; dividing the requirements of all resources from rows 2-5 by /" + format(tmp.l.effect[1]) + "; directly multiplying conscious being gain by " + format(tmp.l.effect[2]) + "x; and multiplying change gain, change limit, and influence generator production by " + format(tmp.l.effect[3]) + "x"},
	tabFormat() {
		let text = "After leading 1 time, more automation for domination is always unlocked,<br>species resets (that are not in hybridizations) no longer reset anything,<br>and you automatically claim potential species.<br><br>The above extra effects will not go away even if this layer is reset.";
		if (player.l.points.gte(1)) {
			if (player.cy.unlocks[1] >= 9) text += "";
			else if (player.cy.unlocks[0] >= 1) text += "<br><br>After leading 2 times, you keep retrogression completions on all resets.";
			else text += "<br><br>After leading 2 times, you keep retrogression completions on all resets,<br>domination resets (without respec) no longer reset anything,<br>and you automatically claim potential domination points.";
		};
		if (player.l.points.gte(2)) {
			if (player.cy.unlocks[1] >= 2) text += "";
			else if (player.cy.unlocks[0] >= 2) text += "<br><br>After leading 3 times, you keep stimulation upgrades on all resets.";
			else if (player.cy.unlocked) text += "<br><br>After leading 3 times, you keep stimulation upgrades on all resets<br>and potential growth points are always automatically claimed.";
			else text += "<br><br>After leading 3 times, you keep stimulation upgrades on all resets;<br>you can bulk ecosystems, revolutions, expansion points, and wars;<br>and potential growth points are always automatically claimed.";
		};
		if (player.l.points.gte(3)) {
			if (player.em.unlocked) text += "<br><br>After leading 4 times, you bulk 10x stats from rows 3 and below.";
			else if (player.l.points.gte(10)) text += "<br><br>After leading 4 times, you bulk 10x stats from rows 3 and below<br>and you keep domination enhancements on all resets.";
			else text += "<br><br>After leading 4 times, you bulk 10x stats from rows 3 and below,<br>you keep hybridization completions on leader resets,<br>and you keep domination enhancements on all resets.";
		};
		if (player.l.points.gte(4)) {
			if (player.cy.unlocks[1] >= 8) text += "<br><br>After leading 5 times, another tier of ANACHRONISM is unlocked.";
			else if (player.cy.unlocks[1] >= 1) text += "<br><br>After leading 5 times, another tier of ANACHRONISM is unlocked<br>and you keep ANACHRONISM completions on all resets.";
			else text += "<br><br>After leading 5 times, another tier of ANACHRONISM is unlocked,<br>you keep ANACHRONISM completions on all resets,<br>and you keep growth enhancements on all resets.";
		};
		if (player.cy.unlocks[1] >= 4 && player.l.points.gte(5)) text += "<br><br>After leading 6 times, you keep hybridization completions on all resets.";
		else if (player.l.points.gte(9)) text += "<br><br>After leading 10 times, you keep hybridization completions on all resets.";
		if (player.cy.unlocks[3] >= 4 && player.l.points.gte(6)) text += "<br><br>After leading 7 times, you always have everything that is free in the battle grid.";
		else if (player.l.points.gte(18)) text += "<br><br>After leading 20 times, you always have everything that is free in the battle grid.";
		let arr = [
			"main-display",
			"prestige-button",
			"resource-display",
			["display-text", text],
			"blank",
		];
		if (player.l.focusUnlocked) {
			let svg = "<svg viewBox='0 0 500 50' style='width: 500px; height: 50px'>";
			let maximum = (player.cy.unlocks[0] >= 6 ?
				Math.max((getClickableState("l", 11) || 0) + (getClickableState("l", 12) || 0), tmp.l.effect[4] * 2)
				: Math.max((getClickableState("l", 11) || 0) + (getClickableState("l", 12) || 0), tmp.l.effect[4])
			);
			if (maximum > 0) {
				let right = (500 * getClickableState("l", 12) / maximum);
				svg += "<rect x='0' y='0' width='" + (500 * getClickableState("l", 11) / maximum) + "' height='50' fill='#55B020'/>";
				svg += "<rect x='" + (500 - right) + "' y='0' width='" + right + "' height='50' fill='#E03330'/>";
				let div = (2 ** Math.floor(Math.log2(maximum) - 5));
				if (div > 1) maximum /= div;
				if (!(player.cy.unlocks[0] >= 6)) {
					for (let index = (maximum % 1) / 2; index < maximum; index++) {
						if (index == 0) continue;
						let x = (500 * index / maximum);
						svg += "<line x1='" + x + "' y1='0' x2='" + x + "' y2='50' stroke='#E5B55A'/>";
					};
				};
			};
			svg += "</svg>";
			svg += "<div style='position: relative; float: left; margin: -54px 0px 0px 7.5px; font-size: 48px; color: #DFDFDF'>SP</div>";
			svg += "<div style='position: relative; float: right; margin: -54px 9px 0px 0px; font-size: 48px; color: #DFDFDF'>D</div>";
			arr.push(["display-text", svg, {display: "inline-block", width: "500px", height: "50px", border: "solid 4px #E5B55A"}]);
			if (!(player.cy.unlocks[0] >= 6)) arr.push(["row", [["clickable", 13], ["clickable", 11], ["clickable", 15], ["clickable", 12], ["clickable", 14]]]);
			arr.push("blank");
			let next = Math.ceil(getFocusplusRequirement() * (tmp.l.effect[4] + 1) ** 1.25);
			arr.push(["display-text", "You have " + formatWhole(tmp.cb.effect[3]) + " maximum focus points,<br>making the maximum focus+ points be " + formatWhole(tmp.l.effect[4]) + ".<br><br>The next point can be gained at " + (next > 1 ? formatWhole(next) + " focus points." : "1 focus point.")]);
			arr.push("blank");
			arr.push(["display-text", "<div style='display: inline-block; vertical-align: top; width: 50%'>You have <h2 style='color: #55B020; text-shadow: #55B020 0px 0px 10px'>" + formatWhole(getClickableState("l", 11)) + "</h2> focus+ points allocated to speciation, which are increasing the completion limit of the 10th hybridization by " + formatWhole(clickableEffect("l", 11)) + "</div><div style='display: inline-block; vertical-align: top; width: 50%'>You have <h2 style='color: #E03330; text-shadow: #E03330 0px 0px 10px'>" + formatWhole(getClickableState("l", 12)) + "</h2> focus+ points allocated to domination, which are giving " + formatWhole(clickableEffect("l", 12)) + " extra FOC, SPE, CLI, and DOM<div>"]);
			arr.push("blank");
		};
		return arr;
	},
	layerShown() {return hasMilestone("d", 39) || player.l.unlocked},
	hotkeys: [{
		key: "l",
		description: "L: reset for leaders",
		onPress() {if (player.l.unlocked) doReset("l")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		const keep = [];
		layerDataReset("l", keep);
	},
	update(diff) {
		if (challengeCompletions("ec", 11) >= 15 && !player.l.focusUnlocked) player.l.focusUnlocked = true;
		if (player.cy.unlocks[0] >= 6) {
			setClickableState("l", 11, tmp.l.effect[4]);
			setClickableState("l", 12, tmp.l.effect[4]);
		};
	},
	componentStyles: {
		"prestige-button"() {if (tmp.l.canReset && tmp.l.nodeStyle) return tmp.l.nodeStyle},
		"clickable"() {return {"min-height": "58px", border: "solid 4px #E5B55A", "border-radius": "0px", color: "#DFDFDF", transform: "none"}},
	},
	clickables: {
		11: {
			title: "Focus on speciation",
			effect() {return (getClickableState("l", 11) || 0) * 75},
			canClick() {return (getClickableState("l", 11) || 0) + (getClickableState("l", 12) || 0) < tmp.l.effect[4]},
			onClick() {setClickableState("l", 11, (getClickableState("l", 11) || 0) + 1)},
			onHold() {setClickableState("l", 11, (getClickableState("l", 11) || 0) + 1)},
			style: {"background-color": "#55B020"},
		},
		12: {
			title: "Focus on domination",
			effect() {
				let eff = (getClickableState("l", 12) || 0) * 25;
				if (eff >= 3333) {
					let exp = 0.3;
					if (hasMilestone("r", 85)) exp += 0.2;
					if (hasMilestone("r", 87)) exp += 0.2;
					if (hasMilestone("r", 93)) exp += 0.1;
					eff = ((eff / 3333) ** exp) * 3333;
				};
				return Math.round(eff);
			},
			canClick() {return (getClickableState("l", 11) || 0) + (getClickableState("l", 12) || 0) < tmp.l.effect[4]},
			onClick() {setClickableState("l", 12, (getClickableState("l", 12) || 0) + 1)},
			onHold() {setClickableState("l", 12, (getClickableState("l", 12) || 0) + 1)},
			style: {"background-color": "#E03330"},
		},
		13: {
			title: "MAX SP",
			canClick() {return (getClickableState("l", 11) || 0) + (getClickableState("l", 12) || 0) < tmp.l.effect[4]},
			onClick() {setClickableState("l", 11, tmp.l.effect[4] - (getClickableState("l", 12) || 0))},
			style: {width: "84px", "background-color": "#55B020"},
		},
		14: {
			title: "MAX D",
			canClick() {return (getClickableState("l", 11) || 0) + (getClickableState("l", 12) || 0) < tmp.l.effect[4]},
			onClick() {setClickableState("l", 12, tmp.l.effect[4] - (getClickableState("l", 11) || 0))},
			style: {width: "84px", "background-color": "#E03330"},
		},
		15: {
			title: "Reset Focus+",
			canClick() {return (getClickableState("l", 11) || 0) + (getClickableState("l", 12) || 0) > 0},
			onClick() {
				setClickableState("l", 11, 0);
				setClickableState("l", 12, 0);
			},
			style: {width: "100px", "background-color": "#000"},
		},
	},
});
