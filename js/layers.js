const trees = [
	["primordial", "The Primordial Tree"],
	["realm", "Realm Creator"],
];

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
						else text += "<br><br><h3>#" + (index + 1) + ": Coming Soon!</h3>";
					};
					return text;
				}],
			],
		},
	},
});
