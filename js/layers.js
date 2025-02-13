const trees = [
	["primordial", "The Primordial Tree"],
	["realm", "Realm Creator"],
	["color", "Color Factory"],
	["number", "The Number Tree"],
	["boostGen", "Booster-Generator Tree"],
	["adaptation", "Adaptation Tree"],
];

function getChopTime() {
	let time = 60;
	if (hasUpgrade("t", 13)) time /= upgradeEffect("t", 13);
	if (hasUpgrade("t", 21)) time /= upgradeEffect("t", 21);
	return time;
};

function getAutoChopTime() {
	let time = 60;
	if (hasUpgrade("t", 23)) time /= upgradeEffect("t", 23);
	return time;
};

addLayer("t", {
	name: "trees",
	symbol: "T",
	row: 0,
	position: 0,
	startData() { return {
		unlocked: true,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		wood: newDecimalZero(),
		autoChop: false,
		autoChopTime: 0,
	}},
	color: "#38A32A",
	requires: new Decimal(10),
	resource: "trees",
	baseResource: "points",
	baseAmount() {return player.points},
	type: "static",
	exponent: 1,
	base: 10,
	gainMult() {
		let mult = newDecimalOne();
		return mult;
	},
	gainExp() {
		let exp = newDecimalOne();
		return exp;
	},
	effectDescription() {
		if (hasUpgrade("t", 14)) return "which multiply point gain by <h2 class='layer-t'>" + format(upgradeEffect("t", 14)) + "</h2>x (based on best)";
	},
	hotkeys: [
		{key: "t", description: "T: Reset for trees", onPress() {if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown() {return true},
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset('t', keep);
	},
	tabFormat: {
		"Links": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				["display-text", () => {
					let text = "<h2>Discovered Trees:</h2>";
					if (player.t.best.eq(0)) text += "<br><br><h3>None yet!</h3>";
					for (let index = 0; index < player.t.best.min(trees.length + 1).toNumber(); index++) {
						if (trees[index]) text += "<br><br><a class='link' href='" + trees[index][0] + "/index.html'>#" + (index + 1) + ": " + trees[index][1] + "</a>";
						else text += "<br><br><h3>#" + (index + 1) + ": Coming Not-So-Soon!</h3>";
					};
					return text;
				}],
			],
		},
		"Wood": {
			content() {
				let text = "You have <h2 class='layer-t'>" + formatWhole(player.t.wood) + "</h2> wood";
				if (hasUpgrade("t", 12)) text += ", which multiplies point gain by <h2 class='layer-t'>" + format(upgradeEffect("t", 12)) + "</h2>x";
				let arr = [
					"main-display",
					"prestige-button",
					"resource-display",
					"blank",
					["display-text", text],
					"blank",
					["clickable", 11],
					"blank",
					["bar", "chop"],
					"blank",
				];
				if (hasUpgrade("t", 22)) {
					arr.push(["display-text", "Auto-chopping: "]);
					arr.push(["toggle", ["t", "autoChop"]]);
					arr.push("blank");
					arr.push(["bar", "autoChop"]);
					arr.push("blank");
				};
				arr.push("upgrades");
				return arr;
			},
		},
	},
	update(diff) {
		let time = getClickableState("t", 11) || 0;
		if (time > 0) {
			time -= diff;
			if (time <= 0) {
				time = 0;
				player.t.wood = player.t.wood.add(1);
			};
		};
		time = Math.min(time, getChopTime());
		setClickableState("t", 11, time);
		if (player.t.autoChopTime > 0) {
			player.t.autoChopTime -= diff;
			if (player.t.autoChopTime <= 0) {
				player.t.autoChopTime = 0;
				player.t.wood = player.t.wood.add(1);
			};
		};
		player.t.autoChopTime = Math.min(player.t.autoChopTime, getAutoChopTime());
		if (player.t.autoChopTime === 0 && player.t.autoChop && player.t.points.gte(1)) {
			player.t.points = player.t.points.sub(1);
			player.t.autoChopTime = getAutoChopTime();
		};
	},
	clickables: {
		11: {
			title: "Chop Tree",
			display() {return "Chop up 1 tree, converting it into 1 wood."},
			canClick() {return player.t.points.gte(1) && (getClickableState("t", 11) || 0) === 0},
			onClick() {
				player.t.points = player.t.points.sub(1);
				setClickableState("t", 11, getChopTime());
			},
			style: {"width": "250px", "min-height": "50px", "border-radius": "25px"},
		},
	},
	bars: {
		chop: {
			direction: RIGHT,
			width: 200,
			height: 25,
			progress() { return 1 - (getClickableState("t", 11) || 0) / getChopTime() },
			display() { return formatTime(getClickableState("t", 11) || 0) + " remaining" },
			fillStyle: {"background-color": "#38A32A"},
		},
		autoChop: {
			direction: RIGHT,
			width: 200,
			height: 25,
			progress() { return 1 - player.t.autoChopTime / getAutoChopTime() },
			display() { return formatTime(player.t.autoChopTime) + " remaining" },
			fillStyle: {"background-color": "#38A32A"},
		},
	},
	upgrades: {
		11: {
			woodCost: 1,
			fullDisplay() { return "<h3>Point Tallying</h3><br>multiplies point gain by 2<br><br>Cost: " + formatWhole(this.woodCost) + " wood" },
			canAfford() { return player.t.wood.gte(this.woodCost) },
			pay() { player.t.wood = player.t.wood.sub(this.woodCost) },
			effect: 2,
		},
		12: {
			woodCost: 3,
			fullDisplay() { return "<h3>Pointy Wood</h3><br>unlocks the first wood effect<br><br>Cost: " + formatWhole(this.woodCost) + " wood" },
			canAfford() { return player.t.wood.gte(this.woodCost) },
			pay() { player.t.wood = player.t.wood.sub(this.woodCost) },
			effect() { return player.t.wood.add(1).pow(0.5) },
		},
		13: {
			woodCost: 6,
			fullDisplay() { return "<h3>Faster Chopping</h3><br>divides chopping time by 2<br><br>Cost: " + formatWhole(this.woodCost) + " wood" },
			canAfford() { return player.t.wood.gte(this.woodCost) },
			pay() { player.t.wood = player.t.wood.sub(this.woodCost) },
			effect: 2,
		},
		14: {
			woodCost: 12,
			fullDisplay() { return "<h3>Pointy Trees</h3><br>unlocks the first tree effect<br><br>Cost: " + formatWhole(this.woodCost) + " wood" },
			canAfford() { return player.t.wood.gte(this.woodCost) },
			pay() { player.t.wood = player.t.wood.sub(this.woodCost) },
			effect() { return player.t.best.add(1).pow(0.5).sub(1).pow_base(5) },
		},
		21: {
			woodCost: 6,
			fullDisplay() { return "<h3>Even Faster Chopping</h3><br>divides chopping time by 3<br><br>Cost: " + formatWhole(this.woodCost) + " wood" },
			canAfford() { return player.t.wood.gte(this.woodCost) },
			pay() { player.t.wood = player.t.wood.sub(this.woodCost) },
			effect: 3,
			unlocked() { return player.t.upgrades.length >= 4 },
		},
		22: {
			woodCost: 12,
			fullDisplay() { return "<h3>Automated Chopping</h3><br>unlocks the auto-chopper<br><br>Cost: " + formatWhole(this.woodCost) + " wood" },
			canAfford() { return player.t.wood.gte(this.woodCost) },
			pay() { player.t.wood = player.t.wood.sub(this.woodCost) },
			unlocked() { return player.t.upgrades.length >= 4 },
		},
		23: {
			woodCost: 24,
			fullDisplay() { return "<h3>Faster Automation</h3><br>divides auto-chopping time by 2<br><br>Cost: " + formatWhole(this.woodCost) + " wood" },
			canAfford() { return player.t.wood.gte(this.woodCost) },
			pay() { player.t.wood = player.t.wood.sub(this.woodCost) },
			effect: 2,
			unlocked() { return player.t.upgrades.length >= 4 },
		},
		24: {
			woodCost: 48,
			fullDisplay() { return "<h3>???</h3><br>coming soon!<br><br>Cost: " + formatWhole(this.woodCost) + " wood" },
			canAfford() { return player.t.wood.gte(this.woodCost) },
			pay() { player.t.wood = player.t.wood.sub(this.woodCost) },
			unlocked() { return player.t.upgrades.length >= 4 },
		},
	},
});
