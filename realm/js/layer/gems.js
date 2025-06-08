function layerEffNum(layer, num, extra) {
	if (options.colorText !== "points") return `<h2 style="color: ${tmp[layer].color}; text-shadow: ${tmp[layer].color} 0px 0px 10px">${format(num)}${extra}</h2>`;
	return `<b>${format(num)}${extra}</b>`;
};

addLayer("G", {
	name: "Gems",
	symbol: "G",
	row: 1,
	position: 0,
	branches: ["C", "M", "F"],
	startData() { return {
		points: newDecimalZero(),
		gemMult: newDecimalOne(),
	}},
	color: "#808080",
	requires: new Decimal(100),
	resource: "gems",
	baseResource: "total coins in this realm",
	baseAmount() { return player.stats[0].total },
	type: "normal",
	exponent: 0.25,
	gainMult() {
		let mult = newDecimalOne();
		return mult;
	},
	gainExp() { return newDecimalOne() },
	prestigeNotify() { return !tmp.G.passiveGeneration && tmp.G.canReset === true && tmp.G.resetGain.gte(player.G.points.add(new Decimal(100).div(player.G.gemMult)).div(2)) },
	prestigeButtonText() {
		let text = `Trade your realm for +<b>${formatWhole(tmp.G.resetGain)}</b> gem${(tmp.G.resetGain instanceof Decimal && tmp.G.resetGain.eq(1) ? "" : "s")}`;
		if (tmp.G.resetGain instanceof Decimal && tmp.G.resetGain.lt("1e10000")) {
			text += "<br><br>";
			const roundFactor = Decimal.pow(10, tmp.G.resetGain.max(10).log10().sub(1).floor());
			const targetValue = tmp.G.resetGain.div(roundFactor).add(1).floor().mul(roundFactor);
			let next = targetValue.div(tmp.G.directMult);
			if (next.gte(tmp.G.softcap)) next = next.div(tmp.G.softcap.pow(newDecimalOne().sub(tmp.G.softcapPower))).pow(newDecimalOne().div(tmp.G.softcapPower));
			next = next.root(tmp.G.gainExp).div(tmp.G.gainMult).root(tmp.G.exponent).mul(tmp.G.requires).max(tmp.G.requires);
			text += `Coins required for ${formatWhole(targetValue)} gem${targetValue.eq(1) ? "" : "s"}: ${format(next)}`;
		};
		return text;
	},
	effect() { return player.G.points.mul(player.G.gemMult).div(100).add(1) },
	effectDescription() { return `which are increasing all production by ${layerEffNum("G", player.G.gemMult, "%")} each, for a total of ${layerEffNum("G", tmp.G.effect, "x")}` },
	hotkeys: [
		{key: "G", description: "Shift+G: Trade your realm for gems", onPress() {if (canReset(this.layer)) doReset(this.layer)}},
	],
	onPrestige(gain) {
		if (player.G.best.gt(player.bestGems)) player.bestGems = player.G.best;
		player.totalGems = player.totalGems.add(gain);
	},
	onPrestigeIsAfterGain: true,
	tabFormat: [
		"main-display",
		"prestige-button",
		["custom-resource-display", () => `You have generated ${format(player.stats[0].total)} coins in this realm<br><br>Your best gems this life is ${format(player.G.best)}<br>You have recieved a total of ${format(player.G.total)} gems this life`],
		"blank",
		"upgrades",
	],
	componentStyles: {
		upgrade: {height: "120px", "border-radius": "25px"},
	},
	upgrades: (() => {
		const data = {};
		for (let index = 0; index < gemUpgrades.length; index++) {
			data[index + 11] = {
				title: gemUpgrades[index][0],
				description: gemUpgrades[index][1],
				effect() { return gemUpgrades[index][2]() },
				effectDisplay() { return (gemUpgrades[index][3] || "") + format(upgradeEffect("G", this.id)) + (gemUpgrades[index][4] || "") },
				cost: new Decimal(100).pow(index),
			};
			if (index > 0) data[index + 11].unlocked = () => hasUpgrade("G", index + 10);
		};
		return data;
	})(),
});
