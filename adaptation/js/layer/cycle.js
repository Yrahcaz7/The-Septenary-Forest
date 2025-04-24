const cycleUnlocks = [[
	[25, "domination resets (without respec) no longer reset anything<br>you automatically claim potential domination points"],
	[45, "growth resets (without respec) no longer reset anything<br>you automatically claim potential growth points"],
	[75, "you generate an additional 100% of potential stimulations per second"],
	[100, "the first war effect is improved", null, 9],
	[125, () => "you bulk 10x <b>Influence tickspeed</b>" + (player.cy.unlocks[0] >= 5 ? "" : "<br>(this resets <b>Influence tickspeed</b> amount)"), () => setBuyableAmount("ex", 21, newDecimalZero())],
	[155, "focus+ can be allocated to both species and domination<br>focus+ points are automatically allocated"],
	[180, "you bulk 10x stats from rows 3 and below"],
	[225, "unlock an additional effect for settlers"],
	[255, "the first war effect is improved further"],
], [
	[50, "you keep growth enhancements on all resets"],
	[100, "you keep stimulation upgrades on all resets"],
	[150, "the 10th hybridization is auto-maxed"],
	[200, "the row 6 [10 resets] effects unlocks at 6 resets"],
	[250, "decrease the battle enhancement costs by 1", null, 10],
	[275, () => "you bulk 10x <b>Influence empowerment</b>" + (player.cy.unlocks[1] >= 6 ? "" : "<br>(this resets <b>Influence empowerment</b> amount)"), () => setBuyableAmount("ex", 22, newDecimalZero())],
	[300, "the first cycle effect is improved"],
	[325, "you keep ANACHRONISM completions on all resets"],
	[350, "you keep retrogression completions on all resets"],
	[375, () => "decrease the battle enhancement costs by " + (player.cy.unlocks[1] >= 10 ? 2 : 1)],
	[400, "the second and fourth ecosystem effects are improved"],
], [
	[111, "ecosystem resets (that are not in ANACHRONISM) no longer reset anything<br>you automatically claim potential ecosystems"],
	[222, "revolution resets no longer reset anything<br>you automatically claim potential revolutions"],
	[333, "expansion resets no longer reset anything<br>you automatically claim potential expansion points"],
	[444, "war resets (without respec) no longer reset anything<br>you automatically claim potential wars"],
	[555, "the first territory effect is improved"],
], [
	[150, "you automatically buy tier 1 control nodes"],
	[300, () => "you bulk 10x <b>Influence tickspeed</b>" + (player.cy.unlocks[3] >= 2 ? "" : "<br>(this resets <b>Influence tickspeed</b> amount)"), () => setBuyableAmount("ex", 21, newDecimalZero())],
	[450, "you automatically buy tier 2 control nodes"],
	[600, "the leader [20 resets] effect unlocks at 7 resets"],
	[750, "you automatically buy tier 3 control nodes"],
	[900, "you keep hybridization completions on all resets"],
	[1050, "you automatically buy tier 4 control nodes"],
	[1200, "the first empire effect is improved"],
	[1350, "you automatically buy tier 5 control nodes"],
	[1500, () => "you bulk 10x the first 2 tiers of <b>Politics</b>" + (player.cy.unlocks[3] >= 10 ? "" : "<br>(this resets <b>Politics<sup>1</sup></b> and <b>Politics<sup>2</sup></b> amounts)"), () => {setGridData("t", 102, 0); setGridData("t", 202, 0)}],
	[1650, "you automatically buy tier 6 control nodes"],
	[1800, "multiply settler gain (but not limit) by 10x"],
]];

function cycleUnlockText(tab) {
	let text = "";
	for (let index = 0; index <= player.cy.unlocks[tab] && index < cycleUnlocks[tab].length; index++) {
		if (cycleUnlocks[tab][index][3] && player.cy.unlocks[tab] >= cycleUnlocks[tab][index][3]) continue;
		if (index > 0) text += (index >= player.cy.unlocks[tab] ? "<br><br>" : "<br>");
		if (index >= player.cy.unlocks[tab]) text += "At " + formatWhole(cycleUnlocks[tab][index][0]) + " revolutions:<br>";
		text += (cycleUnlocks[tab][index][1] instanceof Function ? cycleUnlocks[tab][index][1]() : cycleUnlocks[tab][index][1]);
	};
	return text;
};

function getCyclicalGeneratorTimeSpeed() {
	let timeSpeed = 1;
	if (hasMilestone("r", 74)) timeSpeed *= milestoneEffect("r", 74);
	if (hasMilestone("r", 103)) timeSpeed *= milestoneEffect("r", 103);
	return timeSpeed;
};

function getCyclicalReqScale() {
	let scale = 100;
	if (hasMilestone("r", 76)) scale -= 55;
	return scale;
};

addLayer("cy", {
	name: "Cycle",
	symbol: "CY",
	position: 0,
	branches: ["co", "r", "l"],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		unlocks: [],
		power: newDecimalZero(),
		generators: [],
		cores: newDecimalZero(),
	}},
	color: "#EE7770",
	nodeStyle() {if (tmp.cy.canReset || player.cy.unlocked) return {"background": "border-box linear-gradient(to right, #116022, #EE7770, #E03330)"}},
	resource: "cycles",
	row: 6,
	baseResource: "revolutions",
	baseAmount() {return player.r.points},
	requires: new Decimal(200),
	type: "static",
	base: 1.5,
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Begin for ",
	gainMult() {
		let mult = newDecimalOne();
		return mult;
	},
	effect() {
		let powerEff1Exp = 0.25;
		if (challengeCompletions("ec", 11) >= 26) powerEff1Exp += 0.25;
		if (hasMilestone("r", 82)) powerEff1Exp += 0.25;
		if (hasMilestone("r", 102)) powerEff1Exp += 0.25;
		let powerEff2Exp = 2;
		if (challengeCompletions("ec", 11) >= 26) powerEff2Exp++;
		if (hasMilestone("r", 112)) powerEff2Exp++;
		if (hasMilestone("r", 114)) powerEff2Exp++;
		return [
			player.cy.points.mul(player.cy.unlocks[1] >= 7 ? 2 : 1),
			player.cy.points.div(10).add(1),
			(player.cy.points.gte(5) ? player.cy.power.add(1).pow(powerEff1Exp) : newDecimalOne()),
			(player.cy.points.gte(5) ? player.cy.power.add(1).pow(powerEff2Exp) : newDecimalOne()),
			(player.cy.points.gte(5) ? player.cy.power.add(1).log10().mul(10) : newDecimalZero()),
			(player.cy.cores.gt(0) ? player.cy.cores.add(tmp.em.effect[7] ? tmp.em.effect[7] : 0).pow(2).div(100).add(1) : newDecimalOne()),
		];
	},
	effectDescription() {return "which are increasing continent and leader amounts in their effects by +" + formatWhole(tmp.cy.effect[0]) + " and directly multiplying revolution gain by " + format(tmp.cy.effect[1]) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", "After beginning 1 time, you can always bulk ecosystems, revolutions, expansion points, wars, continents, leaders, and territories.<br><br>The above extra effect will not go away even if this layer is reset."],
		"blank",
		["microtabs", "cycles"],
		"blank",
	],
	layerShown() {return hasMilestone("d", 59) || player.cy.unlocked},
	hotkeys: [{
		key: "y",
		description: "Y: reset for cycles",
		onPress() {if (player.cy.unlocked) doReset("cy")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("cy", keep);
	},
	update(diff) {
		for (let cycle = 0; cycle < player.cy.points.toNumber() && cycle < cycleUnlocks.length; cycle++) {
			if (cycleUnlocks[cycle][player.cy.unlocks[cycle]] && player.r.points.gte(cycleUnlocks[cycle][player.cy.unlocks[cycle]][0])) {
				if (cycleUnlocks[cycle][player.cy.unlocks[cycle]][2]) cycleUnlocks[cycle][player.cy.unlocks[cycle]][2]();
				player.cy.unlocks[cycle]++;
			};
		};
		if (player.cy.points.gte(5)) {
			diff *= getCyclicalGeneratorTimeSpeed();
			if (player.cy.generators.length >= 100) {
				let potentialCores = player.r.points.div(getCyclicalReqScale()).floor().sub(100).max(0);
				if (potentialCores.gt(player.cy.cores)) player.cy.cores = potentialCores;
			} else {
				let cyclicalUnlocks = player.r.points.div(getCyclicalReqScale()).floor().min(100).toNumber();
				if (cyclicalUnlocks > player.cy.generators.length) player.cy.generators.push(newDecimalOne());
			};
			for (let index = 0; index < player.cy.generators.length; index++) {
				let eff = player.cy.generators[index].mul(tmp.cy.effect[5]);
				if (index == 0) {
					if (player.cy.power.lt(eff.mul(100)))
						player.cy.power = player.cy.power.add(eff.mul(diff)).min(eff.mul(100));
				} else {
					if (player.cy.generators[index - 1].lt(eff.mul(100)))
						player.cy.generators[index - 1] = player.cy.generators[index - 1].add(eff.mul(diff)).min(eff.mul(100));
				};
			};
		};
	},
	componentStyles: {
		"prestige-button"() {if (tmp.cy.canReset && tmp.cy.nodeStyle) return tmp.cy.nodeStyle},
		"microtabs"() {return {"box-sizing": "border-box", "width": "fit-content", "max-width": "calc(100% - 34px)", "border": "2px solid #EE7770", "padding": "8.5px"}},
		"tab-button"() {return {"margin": "8.5px"}},
	},
	microtabs: {
		cycles: {
			"The First Cycle": {
				content: [["display-text", () => player.cy.points.gte(1) ? cycleUnlockText(0) : "Reach 1 cycle to unlock The First Cycle"]],
				style: {"margin": "8.5px"},
				unlocked() {return player.cy.points.gte(1)},
			},
			"The Second Cycle": {
				content: [["display-text", () => player.cy.points.gte(2) ? cycleUnlockText(1) : "Reach 2 cycles to unlock The Second Cycle"]],
				style: {"margin": "8.5px"},
				unlocked() {return player.cy.points.gte(2)},
			},
			"The Third Cycle": {
				content: [["display-text", () => player.cy.points.gte(3) ? cycleUnlockText(2) : "Reach 3 cycles to unlock The Third Cycle"]],
				style: {"margin": "8.5px"},
				unlocked() {return player.cy.points.gte(3)},
			},
			"The Fourth Cycle": {
				content: [["display-text", () => player.cy.points.gte(4) ? cycleUnlockText(3) : "Reach 4 cycles to unlock The Fourth Cycle"]],
				style: {"margin": "8.5px"},
				unlocked() {return player.cy.points.gte(4)},
			},
			"The Cyclical Cycles": {
				content: [["display-text", () => {
					if (player.cy.points.gte(5)) {
						let text = "";
						text += "You have <h2 style='color: #EE7770; text-shadow: #EE7770 0px 0px 10px'>" + format(player.cy.power) + "</h2> cyclical power, which is dividing the ecosystem requirement by /" + format(tmp.cy.effect[2]) + ", multiplying change and limit by " + format(tmp.cy.effect[3]) + "x, and increasing the effect of <b>Influence tickspeed</b> by +" + format(tmp.cy.effect[4]);
						text += "<br><br>Each cyclical generator produces 1 of the previous generator per second,";
						text += "<br>except each cyclical generator 1 produces 1 cyclical power per second.";
						text += "<br><br>By default, each cyclical generator maxes out at 100 seconds of production.";
						if (player.cy.generators.length > 11) {
							text += "<br>";
							for (let index = 0; index < 5; index++)
								text += "<br>You have " + format(player.cy.generators[index]) + " cyclical generator " + (index + 1);
							text += "<br>...";
							for (let index = player.cy.generators.length - 5; index < player.cy.generators.length; index++)
								text += "<br>You have " + format(player.cy.generators[index]) + " cyclical generator " + (index + 1);
						} else {
							for (let index = 0; index < player.cy.generators.length; index++) {
								if (index == 0) text += "<br>";
								text += "<br>You have " + format(player.cy.generators[index]) + " cyclical generator " + (index + 1);
							};
						};
						if (player.cy.cores.gt(0)) text += "<br><br>You have <h2 style='color: #EE7770; text-shadow: #EE7770 0px 0px 10px'>" + formatWhole(player.cy.cores) + "</h2>" + (tmp.em.effect[7] ? "+" + formatWhole(tmp.em.effect[7]) : "") + " cyclical cores, which are multiplying cyclical generator production by " + format(tmp.cy.effect[5]) + "x";
						if (player.cy.generators.length >= 100) text += "<br><br>" + (player.cy.cores.gt(0) ? "The next cyclical core will be gained" : "Cyclical cores will unlock") + " at " + formatWhole(player.cy.cores.add(101).mul(getCyclicalReqScale())) + " revolutions";
						else text += "<br><br>The next cyclical generator will unlock at " + formatWhole((player.cy.generators.length + 1) * getCyclicalReqScale()) + " revolutions";
						return text;
					} else {
						return "Reach 5 cycles to unlock The Cyclical Cycles";
					};
				}]],
				style: {"margin": "8.5px"},
				buttonStyle: {"border-color": "#D44C44", "background-color": "#EE7770", "color": "#0F0F0F", "text-shadow": "none"},
				unlocked() {return player.cy.points.gte(5)},
			},
		},
	}
});
