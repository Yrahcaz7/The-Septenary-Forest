addLayer("C", {
	name: "Creations",
	row: 0,
	position: 0,
	startData() { return {
		points: newDecimalZero(),
		tiers: new Decimal(3),
		bulk: newDecimalOne(),
	}},
	color: "#C0C0C0",
	resource: "creations",
	type: "none",
	update(diff) {
		let creations = newDecimalZero();
		let tiers = new Decimal(3);
		for (const key in player.C.buyables) {
			if (key < 100) creations = creations.add(getBuyableAmount("C", key));
			else tiers = tiers.add(getBuyableAmount("C", key));
		};
		player.C.points = creations;
		player.C.tiers = tiers;
		player.stats.forEach(obj => obj.creations = obj.creations.max(player.C.points));
	},
	shouldNotify() {
		for (const key in player.C.buyables) {
			if (key > 100 && tmp.C.buyables[key].canBuy) return true;
		};
	},
	tabFormat: [
		["display-text", () => "You are bulk buying " + formatWhole(player.C.bulk) + "x creations"],
		"blank",
		"clickables",
		"blank",
		["buyables", [1]],
		"blank",
		["buyables", [11]],
		"blank",
	],
	componentStyles: {
		clickable: {width: "min-content", "min-height": "30px", "border-radius": "5px"},
		buyable: {width: "180px", height: "125px", "border-radius": "25px"},
	},
	clickables: (() => {
		const data = {};
		for (let index = 0; index < 6; index++) {
			const amt = new Decimal(10).pow(index);
			data[index + 11] = {
				title: formatWhole(amt) + "x",
				canClick() { return player.C.bulk.neq(amt) },
				onClick() { player.C.bulk = new Decimal(amt) },
			};
		};
		return data;
	})(),
	buyables: (() => {
		const data = {};
		const creationName = ["Air", "Soil", "Grass"];
		const creationCostBase = [1, 100, 10_000];
		const firstBaseCreationEff = [0.1, 0.25, 2.5];
		const secondBaseCreationEff = [undefined, undefined, 0.25];
		const creationTierEff = [
			[0.05, 0.1, 0.2, 0.4, 0.65, 1, 1.5, 2, 3],
			[0.5, 1.25, 2, 3.5, 5, 7.5, 8, 10],
			[0.5, 2, 2.5, 2.5, 5, 7, 8],
		];
		function getCreationTierReq(tier) {
			return 10 ** Math.floor(tier / 2) * (tier % 2 === 0 ? 10 : 32);
		};
		for (let index = 0; index < 3; index++) {
			data[index + 11] = {
				effect() {
					let eff = new Decimal(firstBaseCreationEff[index]);
					for (let tier = 0; tier < getBuyableAmount("C", index + 111).toNumber(); tier++) {
						eff = eff.add(creationTierEff[index][tier]);
					};
					if (hasFactionUpgrade(0, 2, 5)) eff = eff.add(factionUpgradeEffect(0, 2).mul(2 ** index));
					if (index < 3) {
						if (hasFactionUpgrade(0, 0, 0)) eff = eff.mul(factionUpgradeEffect(0, 0));
						if (hasFactionUpgrade(0, 1, 0)) eff = eff.mul(factionUpgradeEffect(0, 1));
					};
					return eff;
				},
				title() { return creationName[index] + " " + romanNumeral(getBuyableAmount("C", index + 111).toNumber() + 1) },
				cost() {
					const start = getBuyableAmount("C", index + 11);
					const end = start.add(player.C.bulk - 1);
					const scale = new Decimal(50);
					const a = scale.add(start); // scaled start
					const b = scale.add(end); // scaled end
					let cost = start.pow(2).neg().add(start).add(end.pow(2)).add(end).mul(25).div(scale); // ∑n=start→end (50n/scale)
					cost = cost.add(a.pow(6).mul(-2).add(a.pow(5).mul(6)).sub(a.pow(4).mul(5)).add(a.pow(2)).add(b.pow(6).mul(2)).add(b.pow(5).mul(6)).add(b.pow(4).mul(5)).sub(b.pow(2)).div(scale.pow(5).mul(12))); // ∑n=a→b (n/scale)^5
					return cost.mul(creationCostBase[index]);
				},
				display() {
					const b = tmp.C.buyables[index + 11];
					const amount = getBuyableAmount("C", index + 11);
					const text = "\nCost: " + format(b.cost) + " coin" + (b.cost.eq(newDecimalOne()) ? "" : "s") + "\n\nAmount: " + formatWhole(amount) + "\n\n";
					if (index === 2) {
						return text + "Effects: +" + format(b.effect) + " to coins/" + (hasFactionUpgrade(1, 2, 1) ? "click" : "sec") + " and +" + format(b.effect2) + "% to FC find chance\n\nTotal Effects: +" + format(amount.mul(b.effect)) + " and +" + format(amount.mul(b.effect2)) + "%";
					};
					return text + "Effect: +" + format(b.effect) + " to coins/" + (index === 0 ? "click" : "sec") + "\n\nTotal Effect: +" + format(b.effect * amount);
				},
				canAfford() { return player.points.gte(this.cost()) },
				buy() {
					player.points = player.points.sub(this.cost());
					addBuyables("C", index + 11, player.C.bulk);
				},
			};
			if (secondBaseCreationEff[index] !== undefined) {
				data[index + 11].effect2 = new Decimal(secondBaseCreationEff[index]);
			};
			data[index + 111] = {
				title: "Uptier " + creationName[index],
				cost() {
					if (!creationTierEff[index][getBuyableAmount("C", index + 111).toNumber()]) return new Decimal(Infinity);
					if (getBuyableAmount("C", index + 111).gte(3)) return getBuyableAmount("C", index + 111).pow_base(1_000).div(10_000).mul(creationCostBase[index]);
					if (getBuyableAmount("C", index + 111).eq(2)) return new Decimal(20_000).mul(creationCostBase[index]);
					if (getBuyableAmount("C", index + 111).eq(1)) return new Decimal(1_000).mul(creationCostBase[index]);
					return new Decimal(100).mul(creationCostBase[index]);
				},
				display() {
					const tier = getBuyableAmount("C", index + 111).toNumber();
					const name = creationName[index].toLowerCase();
					const eff = creationTierEff[index][tier];
					return "increase " + name + "'" + (name.endsWith("s") ? "" : "s") + " first base effect by +" + (eff ? format(eff, 2, false) : "???") + "<br><br>Req: " + formatWhole(getCreationTierReq(tier)) + " " + name + "<br><br>Cost: " + format(tmp.C.buyables[index + 111].cost) + " coins";
				},
				canAfford() { return getBuyableAmount("C", index + 11).gte(getCreationTierReq(getBuyableAmount("C", index + 111).toNumber())) && player.points.gte(this.cost()) },
				buy() {
					player.points = player.points.sub(this.cost());
					addBuyables("C", index + 111, 1);
				},
				style: {height: "90px"},
			};
		};
		return data;
	})(),
});

function getSpellCost(index) {
	let cost = new Decimal([80, 160, 120][index]);
	if (hasFactionUpgrade(1, 1, 2)) cost = cost.mul(3);
	return cost;
};

function getSideColor(side = -1) {
	if (side < 0) side = [11, 12].findIndex(id => hasUpgrade("F", id));
	if (side === 0) return "#4040E0";
	if (side === 1) return "#E04040";
	return "#C0C0C0";
};

const manaUpgrades = [
	["Mana Cup", "multiply max mana based on your mana generated this era", () => player.stats[0].manaTotal.add(1).pow(0.1), "x"],
	["Mana Sense", "increase mana regen based on your mana generated this era", () => player.stats[0].manaTotal.add(1).pow(0.125), "+"],
	["Mana Jar", "multiply max mana based on your creations", () => player.C.points.add(1).pow(0.125), "x"],
	["Mana Sight", "increase mana regen based on your creations", () => player.C.points.add(1).pow(0.225), "+"],
];

const autocastingUpgrades = [
	["Primary Autocasting", "unlock autocasting"],
	["Secondary Autocasting", "unlock tax collection autocasting"],
	["Ternary Autocasting", "unlock autocasting when mana is at least a specified percent of max mana"],
];

addLayer("M", {
	name: "Mana",
	symbol: "M",
	row: 0,
	position: 1,
	startData() { return {
		mana: newDecimalZero(),
		maxMana: new Decimal(100),
		manaRegen: new Decimal(2.5),
		spellTimes: [newDecimalZero(), newDecimalZero(), newDecimalZero()],
		autoPercent: 50,
	}},
	color: "#0080E0",
	type: "none",
	prestigeNotify() { return player.M.mana.gte(player.M.maxMana) },
	tooltip() { return format(player.M.mana) + "/" + format(player.M.maxMana) + " mana" },
	update(diff) {
		// mana regen buffs
		let manaRegen = new Decimal(2.5);
		if (hasUpgrade("M", 12) && upgradeEffect("M", 12).gt(0)) manaRegen = manaRegen.add(upgradeEffect("M", 12));
		if (hasUpgrade("M", 14) && upgradeEffect("M", 14).gt(0)) manaRegen = manaRegen.add(upgradeEffect("M", 14));
		if (hasFactionUpgrade(0, 1, 2)) manaRegen = manaRegen.mul(factionUpgradeEffect(0, 1));
		if (hasUpgrade("G", 13)) manaRegen = manaRegen.mul(upgradeEffect("G", 13));
		player.M.manaRegen = manaRegen;
		// max mana buffs
		let maxMana = new Decimal(100);
		if (hasFactionUpgrade(0, 0, 2)) maxMana = maxMana.mul(factionUpgradeEffect(0, 0));
		if (hasFactionUpgrade(1, 0, 2)) maxMana = maxMana.mul(factionUpgradeEffect(1, 0));
		if (hasUpgrade("M", 11)) maxMana = maxMana.mul(upgradeEffect("M", 11));
		if (hasUpgrade("M", 13)) maxMana = maxMana.mul(upgradeEffect("M", 13));
		if (hasUpgrade("G", 13)) maxMana = maxMana.mul(upgradeEffect("G", 13));
		player.M.maxMana = maxMana;
		// increase mana
		let diffMana = player.M.manaRegen.mul(diff);
		if (player.M.mana.add(diffMana).gte(player.M.maxMana)) {
			diffMana = player.M.maxMana.sub(player.M.mana);
		};
		player.M.mana = player.M.mana.add(diffMana);
		// mana stats
		if (diffMana.gt(0)) player.stats.forEach(obj => obj.manaTotal = obj.manaTotal.add(diffMana));
		player.stats.forEach(obj => obj.maxMana = obj.maxMana.max(player.M.maxMana));
		player.stats.forEach(obj => obj.manaRegen = obj.manaRegen.max(player.M.manaRegen));
		// spell time
		for (let index = 1; index < player.M.spellTimes.length; index++) {
			player.M.spellTimes[index] = player.M.spellTimes[index].sub(diff).max(0);
		};
		// autocasting
		for (let index = 2; index >= 0; index--) {
			const cost = getSpellCost(index);
			if (player.M.spellTimes[index].lte(0) && player.M.mana.gte(cost)) {
				if (getClickableState("M", index + 11) === 1) {
					castSpell(index, player.M.mana.div(cost).floor());
				} else if (getClickableState("M", index + 11) === 2 && player.M.mana.gte(player.M.maxMana.mul(player.M.autoPercent / 100))) {
					let amt = player.M.mana.sub(player.M.maxMana.mul(player.M.autoPercent / 100)).div(cost).floor();
					if (player.M.mana.sub(amt.mul(cost)).gte(cost)) amt = amt.add(1);
					castSpell(index, amt);
				};
			};
		};
	},
	tabFormat() {
		const arr = [["bar", "mana"]];
		if (hasUpgrade("M", 103)) arr.push("blank", "mana-auto-percent-slider");
		arr.push("blank");
		arr.push(["row", [
			["column", [["clickable", 11], ["autocast-toggle", [11, 102]]], {margin: "0 7px"}],
			["column", [["clickable", 12], ["autocast-toggle", [12, 101]]], {margin: "0 7px"}],
			["column", [["clickable", 13], ["autocast-toggle", [13, 101, true]]], {margin: "0 7px"}]
		]]);
		arr.push("blank");
		arr.push(["upgrades", [1]]);
		arr.push(["display-text", "You have generated " + format(player.stats[2].manaTotal) + " mana in total"]);
		arr.push("blank");
		arr.push(["upgrades", [10]]);
		return arr;
	},
	componentStyles: {
		upgrade: {height: "120px", "border-radius": "25px"},
		clickable: {width: "125px", height: "125px", "border-radius": "25px 25px 0 0", transform: "none"},
	},
	bars: {
		mana: {
			direction: RIGHT,
			width: 500,
			height: 50,
			display() { return "You have " + format(player.M.mana) + "/" + format(player.M.maxMana) + " mana<br>(" + format(player.M.manaRegen) + "/s)" },
			fillStyle() { return {"background-color": tmp.M.color} },
			borderStyle() { return {"border-color": tmp.M.color} },
			progress() { return player.M.mana.div(player.M.maxMana) },
		},
	},
	clickables: {
		11: {
			title: "Tax Collection",
			display() { return "get coins equal to " + formatWhole(clickableEffect("M", this.id)) + " seconds of coins/sec<br><br>Effect: +" + format(tmp.pointGen.mul(clickableEffect("M", this.id))) + "<br><br>Cost: " + formatWhole(getSpellCost(this.id - 11)) + " mana</span>" },
			effect() {
				let eff = new Decimal(30);
				if (hasFactionUpgrade(1, 1, 3)) eff = eff.add(30);
				if (hasFactionUpgrade(1, 1, 2)) eff = eff.mul(2);
				return eff;
			},
			canClick() { return player.M.mana.gte(getSpellCost(this.id - 11)) },
			onClick() { castSpell(this.id - 11) },
			color: "#C0C0C0",
		},
		12: {
			title: "Call to Arms",
			display() { return "boost all coin generation based on your creations for 30 seconds<br>Time left: " + formatTime(player.M.spellTimes[1]) + "<br><br>Effect: x" + format(clickableEffect("M", this.id)) + "<br><br>Cost: " + formatWhole(getSpellCost(this.id - 11)) + " mana" },
			effect() {
				let eff = player.C.points.add(1).pow(0.15);
				if (hasFactionUpgrade(1, 1, 2)) eff = eff.mul(2);
				return eff;
			},
			canClick() { return player.M.spellTimes[this.id - 11].lte(0) && player.M.mana.gte(getSpellCost(this.id - 11)) },
			onClick() { castSpell(this.id - 11) },
			color: "#C0C0C0",
		},
		13: {
			title() {
				if (hasUpgrade("F", 11)) return "Holy Light";
				if (hasUpgrade("F", 12)) return "Blood Frenzy";
				return "CHOOSE A SIDE TO UNLOCK";
			},
			display() {
				if (hasUpgrade("F", 11)) return "boost coins/click based on your mana for 15 seconds<br>Time left: " + formatTime(player.M.spellTimes[2]) + "<br><br>Effect: x" + format(clickableEffect("M", this.id)) + "<br><br>Cost: " + formatWhole(getSpellCost(this.id - 11)) + " mana";
				if (hasUpgrade("F", 12)) return "boost coins/sec based on your mana for 15 seconds<br>Time left: " + formatTime(player.M.spellTimes[2]) + "<br><br>Effect: x" + format(clickableEffect("M", this.id)) + "<br><br>Cost: " + formatWhole(getSpellCost(this.id - 11)) + " mana";
				return "";
			},
			effect() {
				let eff = player.M.mana.add(1).pow(0.25);
				if (hasFactionUpgrade(1, 1, 2)) eff = eff.mul(2);
				if (hasFactionUpgrade(0, 1, 5)) eff = eff.mul(factionUpgradeEffect(0, 1));
				return eff;
			},
			canClick() { return hasChosenSide() && player.M.spellTimes[this.id - 11].lte(0) && player.M.mana.gte(getSpellCost(this.id - 11)) },
			onClick() { castSpell(this.id - 11) },
			color: getSideColor,
		},
	},
	upgrades: (() => {
		const data = {};
		for (let index = 0; index < manaUpgrades.length; index++) {
			data[index + 11] = {
				fullDisplay() { return "<h3>" + manaUpgrades[index][0] + "</h3><br>" + manaUpgrades[index][1] + "<br><br>Effect: " + (manaUpgrades[index][3] || "") + format(upgradeEffect("M", this.id)) + (manaUpgrades[index][4] || "") + "<br><br>Cost: " + format(this.cost) + " coins" },
				effect() { return manaUpgrades[index][2]() },
				cost: new Decimal(5).pow(index).mul(1000),
				currencyInternalName: "points",
				currencyLocation() { return player },
			};
			if (index > 0) data[index + 11].unlocked = () => hasUpgrade("M", index + 10);
		};
		for (let index = 0; index < autocastingUpgrades.length; index++) {
			data[index + 101] = {
				fullDisplay() { return "<h3>" + autocastingUpgrades[index][0] + "</h3><br>" + autocastingUpgrades[index][1] + "<br><br>Cost: " + format(this.cost) + " coins" },
				cost: new Decimal(1_000).pow(new Decimal(2).pow(index)),
				currencyInternalName: "points",
				currencyLocation() { return player },
			};
			if (index > 0) data[index + 101].unlocked = () => hasUpgrade("M", index + 100);
		};
		return data;
	})(),
});

function hasChosenSide() {
	return hasUpgrade("F", 11) || hasUpgrade("F", 12) || hasUpgrade("F", 13);
};

function hasChosenFaction() {
	return hasUpgrade("F", 21) || hasUpgrade("F", 22) || hasUpgrade("F", 23);
};

function getAllianceIndex(index = -1, side = -1) {
	if (index < 0) {
		index = [21, 22, 23].findIndex(id => hasUpgrade("F", id));
		if (index < 0) return -1;
	};
	if (side < 0) side = [11, 12, 13].findIndex(id => hasUpgrade("F", id));
	if (side === 0) return index;
	if (side === 1) return index + 3;
	if (side === 2) return index + 6;
	return -1;
};

function getFactionCoinTypes(index = -1, side = -1) {
	if (index < 0) {
		index = [21, 22, 23].findIndex(id => hasUpgrade("F", id));
		if (index < 0) return [];
	};
	if (side < 0) side = [11, 12, 13].findIndex(id => hasUpgrade("F", id));
	if (side === 0) return [index];
	if (side === 1) return [index + 3];
	if (side === 2) {
		if (index === 0) return [2, 3];
		if (index === 1) return [1, 5];
		if (index === 2) return [0, 4];
	};
	return [];
};

const factionName = ["fairy", "elf", "angel", "goblin", "undead", "demon"];
const pluralFactionName = ["fairies", "elves", "angels", "goblins", "undead", "demons"];
const factionFocus = ["basic creations", "click production", "mana and spells", "faction coins", "passive production", "non-basic creations"];
const factionColor = ["#C040E0", "#40E040", "#40C0E0", "#C08040", "#8040C0", "#C04040"];

function getAllianceUpgrade(index) {
	return {
		fullDisplay() {
			const alliance = getAllianceIndex(index);
			const name = (factionName[alliance] || "???");
			return "<h3>" + name.at(0).toUpperCase() + name.slice(1) + " Alliance</h3><br>ally yourself with the " + (pluralFactionName[alliance] || "???") + ", which focus on " + (factionFocus[alliance] || "???") + "<br><br>Cost: 5 " + name + " coins";
		},
		canAfford() { return getFactionCoinTypes(index).every(type => player.FC[type].gte(5)) && !hasChosenFaction() },
		pay() { getFactionCoinTypes(index).forEach(type => player.FC[type] = player.FC[type].sub(5)) },
		onPurchase() {
			const alliance = getAllianceIndex(index);
			if (alliance > 0) player.stats.forEach(obj => obj.alliances[alliance]++);
		},
		color() { return factionColor[getAllianceIndex(index)] || "#C0C0C0" },
		style() { return {"border-color": "color-mix(in srgb, " + this.color() + " 87.5%, #000000 12.5%)"} },
		unlocked: hasChosenSide,
	}
};

const factionUpgrades = [[
	["Magic Dust", "multiply the first effect of basic creations based on your mana regen", () => player.M.manaRegen.mul(2).add(1).pow(0.5), "x"],
	["Fairy Workers", "multiply the first effect of basic creations based on your creations", () => player.C.points.add(1).pow(0.2), "x"],
	["Fairy Traders", "multiply coins/click and faction coin find chance based on your creations", () => player.C.points.add(1).pow(0.1), "x"],
], [
	["Super Clicks", "multiply coins/click based on your creations", () => player.C.points.add(1).pow(0.25), "x"],
	["Elven Luck", "increase faction coin find chance based on your coins/click", () => player.clickValue.add(1).pow(0.3), "+", "%"],
	["Elven Spirit", "multiply coins/click based on your elf coins", () => player.FC[1].add(1).pow(0.4), "x"],
	["Elven Clicks", "multiply coins/click based on your coins", () => player.points.add(1).pow(0.01), "x"],
	["Enchanted Clicks", "multiply coins/click based on your mana regen", () => player.M.manaRegen.add(1).pow(0.5), "x"],
	["All on One", "the 3rd creation's first effect now applies to coins/click instead of coins/sec"],
], [
	["Angelic Capacity", "multiply max mana based on your mana generated this era", () => player.stats[0].manaTotal.add(1).pow(0.075), "x"],
	["Road to Heaven", "multiply mana regen based on your angel coins", () => player.FC[2].add(1).pow(0.4), "x"],
	["Angels Supreme", "gain 5x angel coins"],
	["Rainbows", "multiply max mana based on your faction coins", () => player.F.points.add(1).pow(0.2), "x"],
	["Prism Upgrade", "double all spell effects, but triple all spell mana costs"],
	["Angelic Clicks", "multiply coins/click based on your max mana", () => player.M.maxMana.add(1).pow(0.05), "x"],
], [
	["Jackpot", "increase faction coin find chance based on your coins", () => player.points.add(1).log10().mul(10).add(1), "+", "%"],
	["Goblin's Greed", "multiply coins/sec based on your faction coins", () => player.F.points.add(1).pow(0.25), "x"],
	["Currency Revolution", "increase faction coin find chance based on your faction coins", () => player.F.points.add(1).pow(0.6), "+", "%"],
	["Moneyload", "multiply coins/sec based on your faction coin find chance", () => player.FCchance.add(1).pow(0.25), "x"],
	["Absurd Taxes", "increase the base effect of Tax Collection by +30 seconds"],
	["Goblin Pride", "multiply coins/sec based on your goblin coins", () => player.FC[3].add(1).pow(0.3), "x"],
], [
	["Undending Cycle", "multiply coins/sec based on your coins", () => player.points.add(1).log10().div(2).add(1), "x"],
	["Corpse Piles", "multiply coins/sec based on your undead coins", () => player.FC[4].add(1).pow(0.3), "x"],
	["Stay no More", "multiply coins/sec based on your coins/click", () => player.clickValue.add(1).log10().div(2).add(1), "x"],
], [
	["Demonic Prestige", "multiply coins/sec based on your creation tiers", () => player.C.tiers.div(5).add(1), "x"],
	["Demonic Blood", "multiply blood frenzy effect based on your creations (higher numbered ones count more)", () => [11, 12, 13].reduce((acc, id, num) => acc.add(getBuyableAmount("C", id).mul(5 ** num)), new Decimal(0)).div(10).add(1).pow(0.1), "x"],
	["Polished Rage", "increase all creation's first base effects based on their number and your gems", () => player.G.points.add(1).pow(0.1).sub(1), "+(", " * 2^num)"],
]];

function getFactionUpgrade(row, num, faction = -1) {
	const obj = {};
	if (num < 3) {
		obj.fullDisplay = function() {
			const alliance = getAllianceIndex(faction);
			if (alliance < 0) return "";
			const upg = factionUpgrades[alliance][3 * row + num];
			if (upg) return "<h3>" + upg[0] + "</h3><br>" + upg[1] + (upg.length > 2 ? "<br><br>Effect: " + (upg[3] || "") + format(upgradeEffect("F", this.id)) + (upg[4] || "") : "") + "<br><br>Cost: " + format(this.cost) + " coins";
			return "";
		};
		obj.effect = () => {
			const alliance = getAllianceIndex(faction);
			if (alliance < 0) return;
			const upg = factionUpgrades[alliance][3 * row + num];
			if (upg) return (upg[2] instanceof Function ? upg[2]() : upg[2]);
		};
		obj.cost = new Decimal(10).pow(1.5 * (row ** 2) + 2.5 * row + 2 + (row + 1) * num).mul(5);
		obj.currencyInternalName = "points";
		obj.currencyLocation = () => player;
		if (row === 0) obj.unlocked = hasChosenFaction;
		else obj.unlocked = () => hasChosenFaction() && hasUpgrade("F", 104 + 10 * row);
	} else {
		const cost = 25 * (10 ** (row ** 2));
		obj.fullDisplay = function() {
			const name = (factionName[getAllianceIndex(faction)] || "???");
			const types = getFactionCoinTypes(faction);
			return "<h3>" + name.at(0).toUpperCase() + name.slice(1) + " Trade Route</h3><br>unlock 3 more " + name + " upgrades<br><br>Cost: " + formatWhole(cost) + " " + (types.length === 2 ? factionName[types[0]] + " and " + factionName[types[1]] : name) + " coins";
		};
		obj.canAfford = () => getFactionCoinTypes(faction).every(type => player.FC[type].gte(cost));
		obj.pay = () => getFactionCoinTypes(faction).forEach(type => player.FC[type] = player.FC[type].sub(cost));
		if (row === 0) obj.unlocked = () => hasChosenFaction() && factionUpgrades[getAllianceIndex(faction)]?.length >= 3 * (row + 2);
		else obj.unlocked = () => hasChosenFaction() && hasUpgrade("F", 104 + 10 * row) && factionUpgrades[getAllianceIndex(faction)]?.length >= 3 * (row + 2);
	};
	obj.color = () => factionColor[getAllianceIndex(faction)] || "#C0C0C0";
	return obj;
};

function hasFactionUpgrade(row, num, faction) {
	return faction === getAllianceIndex() && hasUpgrade("F", 111 + 10 * row + num);
};

function factionUpgradeEffect(row, num) {
	return upgradeEffect("F", 111 + 10 * row + num);
};

function getFCdisp(index) {
	return "<div style='color: lch(from " + factionColor[index] + " calc(l + 20) c h)'>" + formatWhole(player.FC[index]) + " " + factionName[index] + " coins</div>";
};

addLayer("F", {
	name: "Factions",
	symbol: "F",
	row: 0,
	position: 2,
	startData() { return {
		points: newDecimalZero(),
	}},
	color() {
		const alliance = getAllianceIndex();
		if (alliance >= 0) return factionColor[alliance];
		return getSideColor();
	},
	resource: "faction coins",
	type: "none",
	tabFormat: [
		["display-text", () => "Your faction coin find chance is " + format(player.FCchance) + "%<br><br>You have " + formatWhole(player.F.points) + " faction coins, which are composed of:"],
		["row", [
			["display-text", () => getFCdisp(0) + getFCdisp(1) + getFCdisp(2), {display: "inline-block", "min-width": "200px"}],
			["blank", ["17px"]],
			["display-text", () => getFCdisp(3) + getFCdisp(4) + getFCdisp(5), {display: "inline-block", "min-width": "200px"}],
		]],
		"blank",
		["row", [["upgrade", 11, {margin: "0 7px"}], ["upgrade", 12, {margin: "0 7px"}], ["upgrade", 13, {margin: "0 7px"}]]],
		"blank",
		["row", [["upgrade", 21, {margin: "0 7px"}], ["upgrade", 22, {margin: "0 7px"}], ["upgrade", 23, {margin: "0 7px"}]]],
		"blank",
		["upgrades", [11, 12]],
	],
	componentStyles: {
		upgrade: {height: "120px", "border-radius": "25px"},
	},
	upgrades: {
		// faction picking
		11: {
			fullDisplay() { return "<h3>Proof of Good Deed</h3><br>ally yourself with the side of good, which focuses on active production<br><br>Cost: 250 coins" },
			canAfford() { return player.points.gte(250) && !hasChosenSide() },
			pay() { player.points = player.points.sub(250) },
			color: getSideColor(0),
			style: {"border-color": "color-mix(in srgb, " + getSideColor(0) + " 87.5%, #000000 12.5%)"},
		},
		12: {
			fullDisplay() { return "<h3>Proof of Evil Deed</h3><br>ally yourself with the side of evil, which focuses on passive production<br><br>Cost: 250 coins" },
			canAfford() { return player.points.gte(250) && !hasChosenSide() },
			pay() { player.points = player.points.sub(250) },
			color: getSideColor(1),
			style: {"border-color": "color-mix(in srgb, " + getSideColor(1) + " 87.5%, #000000 12.5%)"},
		},
		13: {
			fullDisplay() { return "<h3>Proof of Neutrality</h3><br>don't ally yourself with either side and focus on all production<br><br>Cost: ??? coins" },
			canAfford() { return false },
			color: getSideColor(2),
			style: {"border-color": "color-mix(in srgb, " + getSideColor(2) + " 87.5%, #000000 12.5%)"},
			unlocked() { return false },
		},
		21: getAllianceUpgrade(0),
		22: getAllianceUpgrade(1),
		23: getAllianceUpgrade(2),
		// faction upgrades
		111: getFactionUpgrade(0, 0),
		112: getFactionUpgrade(0, 1),
		113: getFactionUpgrade(0, 2),
		114: getFactionUpgrade(0, 3),
		121: getFactionUpgrade(1, 0),
		122: getFactionUpgrade(1, 1),
		123: getFactionUpgrade(1, 2),
	},
});

const gemUpgrades = [
	["Gem Influence", "increase faction coin find chance based on your total gems", () => {
		let eff = player.G.total.add(1).log10().mul(10);
		if (hasUpgrade("G", 12)) eff = eff.mul(upgradeEffect("G", 12));
		return eff;
	}, "+", "%"],
	["Gem Displays", "multiply the effect of Gem Influence based on your gems", () => player.G.points.add(1).log10().add(1), "x"],
	["Magic Gems", "multiply max mana and mana regen based on your gems", () => {
		let eff = player.G.points.add(1).log10().add(1).pow(0.5);
		if (hasUpgrade("G", 14)) eff = eff.mul(upgradeEffect("G", 14));
		return eff;
	}, "x"],
	["Magic Residue", "multiply the effect of Magic Gems based on your best gems", () => player.G.best.add(1).log10().add(1).pow(0.25), "x"],
];

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
	baseResource: "total coins this era",
	baseAmount() {return player.stats[0].total},
	type: "normal",
	exponent: 0.3333333333333333,
	gainMult() {
		let mult = newDecimalOne();
		return mult;
	},
	gainExp() {return newDecimalOne()},
	prestigeNotify() {return !tmp.G.passiveGeneration && tmp.G.canReset === true && tmp.G.resetGain.gte(player.G.points.add(100).div(2))},
	prestigeButtonText() {
		let text = "Abdicate for +<b>" + formatWhole(tmp.G.resetGain) + "</b> gem" + (tmp.G.resetGain instanceof Decimal && tmp.G.resetGain.eq(1) ? "" : "s");
		if (tmp.G.resetGain instanceof Decimal && tmp.G.resetGain.lt("1e10000")) {
			text += "<br><br>";
			const roundFactor = Decimal.pow(10, tmp.G.resetGain.max(10).log10().sub(1).floor());
			const targetValue = tmp.G.resetGain.div(roundFactor).add(1).floor().mul(roundFactor);
			let next = targetValue.div(tmp.G.directMult);
			if (next.gte(tmp.G.softcap)) next = next.div(tmp.G.softcap.pow(newDecimalOne().sub(tmp.G.softcapPower))).pow(newDecimalOne().div(tmp.G.softcapPower));
			next = next.root(tmp.G.gainExp).div(tmp.G.gainMult).root(tmp.G.exponent).mul(tmp.G.requires).max(tmp.G.requires);
			text += "Coins required for " + formatWhole(targetValue) + " gem" + (targetValue.eq(1) ? "" : "s") + ": " + format(next);
		};
		return text;
	},
	effect() { return player.G.points.mul(player.G.gemMult).div(100).add(1) },
	effectDescription() { return "which are increasing all production by " + player.G.gemMult + "% each, for a total of " + format(tmp.G.effect) + "x" },
	hotkeys: [
		{key: "A", description: "Shift+A: Abdicate for gems", onPress() {if (canReset(this.layer)) doReset(this.layer)}},
		{key: "G", description: "Shift+G: Abdicate for gems", onPress() {if (canReset(this.layer)) doReset(this.layer)}},
	],
	onPrestige(gain) {
		if (player.G.best.gt(player.bestGems)) player.bestGems = player.G.best;
	},
	onPrestigeIsAfterGain: true,
	tabFormat: [
		"main-display",
		"prestige-button",
		["custom-resource-display", () => "You have generated " + format(player.stats[0].total) + " coins this era<br><br>Your best gems is " + format(player.G.best) + "<br>You have made a total of " + format(player.G.total) + " gems"],
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

const spellName = ["Tax Collection", "Call to Arms", "Holy Light", "Blood Frenzy"];
const sideName = ["good", "evil", "neutral"];

addLayer("S", {
	name: "Stats",
	symbol: "S",
	row: "side",
	position: 0,
	color: "#60C060",
	type: "none",
	tooltip() { return "Stats" },
	tabFormat: (() => {
		const statName = ["This Era", "This Reincarnation", "All Time"];
		let tabs = {};
		for (let index = 0; index < statName.length; index++) {
			tabs[statName[index]] = {content: [
				["display-text", "<h2>" + statName[index].toUpperCase() + "</h2>"],
				"blank",
				["h-line", "calc(100% - 12px)"],
				"blank",
				["display-text", () => "<h3>GENERAL</h3><br>Your best coins is <b>" + format(player.stats[index].best) + "</b><br>You have generated <b>" + format(player.stats[index].total) + "</b> coins<br>" + (index > 0 ? "Your best gems is <b>" + formatWhole(index === 2 ? player.bestGems : player.G.best) + "</b>" : "")],
				"blank",
				["display-text", () => "<h3>PASSIVE</h3><br>Your best coins/sec is <b>" + format(player.stats[index].bestPassive) + "</b><br>You have generated <b>" + format(player.stats[index].totalPassive) + "</b> coins passively"],
				"blank",
				["display-text", () => "<h3>CLICKS</h3><br>Your best coins/click is <b>" + format(player.stats[index].bestClickValue) + "</b><br>You have generated <b>" + format(player.stats[index].totalClickValue) + "</b> coins from clicking" + (index === 0 ? "" : "<br>Your best times clicked is <b>" + formatWhole(player.stats[index].bestClicks) + "</b>") + "<br>You have clicked <b>" + formatWhole(player.stats[index].totalClicks) + "</b> times"],
				"blank",
				["display-text", () => "<h3>FACTION COINS</h3><br>Your best faction coins is <b>" + formatWhole(player.stats[index].FCbest) + "</b><br>You have found <b>" + formatWhole(player.stats[index].FCtotal) + "</b> faction coins<br>You have <b>" + format(player.stats[index].FCchance) + "%</b> best faction coin chance"],
				"blank",
				["display-text", () => "<h3>CREATIONS</h3><br>Your best creations is <b>" + formatWhole(player.stats[index].creations) + "</b>"],
				"blank",
				["display-text", () => "<h3>MANA</h3><br>Your best mana regen is <b>" + format(player.stats[index].manaRegen) + "</b><br>Your best max mana is <b>" + format(player.stats[index].maxMana) + "</b><br>You have generated <b>" + format(player.stats[index].manaTotal) + "</b> mana"],
				"blank",
				["display-text", () => {
					let text = "<h3>SPELLS</h3>";
					let hasCastSpells = false;
					for (let spell = 0; spell < spellName.length; spell++) {
						if (player.stats[index].casts[spell].gt(0)) {
							text += "<br>You have cast '" + spellName[spell] + "' <b>" + formatWhole(player.stats[index].casts[spell]) + "</b> time";
							if (player.stats[index].casts[spell].neq(1)) text += "s";
							hasCastSpells = true;
						};
					};
					if (!hasCastSpells) text += "<br>You have not cast any spells";
					return text;
				}],
				"blank",
				["display-text", () => {
					let text = "<h3>FACTIONS</h3>";
					let hasAllied = false;
					for (let faction = 0; faction < player.stats[index].alliances.length; faction++) {
						if (player.stats[index].alliances[faction] > 0) {
							text += "<br>You have allied with the " + pluralFactionName[faction] + " <b>" + formatWhole(player.stats[index].alliances[faction]) + "</b> time";
							if (player.stats[index].alliances[faction] !== 1) text += "s";
							hasAllied = true;
						};
					};
					if (!hasAllied) text += "<br>You have not allied with any factions";
					return text;
				}],
				"blank",
				["display-text", () => {
					let text = "<h3>TIME</h3><br>You have spent <b>" + formatTime(player.stats[index].time) + "</b><br>";
					for (let side = 0; side < player.stats[index].sideTimes.length; side++) {
						if (player.stats[index].sideTimes[side] > 0) text += "<br>You have spent <b>" + formatTime(player.stats[index].sideTimes[side]) + "</b> being " + sideName[side];
					};
					let hasAllied = false;
					for (let faction = 0; faction < player.stats[index].allianceTimes.length; faction++) {
						if (player.stats[index].allianceTimes[faction] > 0) {
							if (!hasAllied) {
								text += "<br>";
								hasAllied = true;
							};
							text += "<br>You have spent <b>" + formatTime(player.stats[index].allianceTimes[faction]) + "</b> allied with the " + pluralFactionName[faction];
						};
					};
					return text;
				}],
				"blank",
			]};
		};
		return tabs;
	})(),
});

document.onclick = () => {
	// faction coins calculation
	const FCtype = getRandInt(0, 6);
	let FCfound = player.FCchance.div(100);
	if ((FCfound.toNumber() % 1) > Math.random()) {
		FCfound = FCfound.add(1);
	};
	FCfound = FCfound.floor();
	if (hasFactionUpgrade(0, 2, 2) && FCtype === 2) FCfound = FCfound.mul(5);
	// faction coins gained
	player.FC[FCtype] = player.FC[FCtype].add(FCfound);
	player.stats.forEach(obj => obj.FCtotal = obj.FCtotal.add(FCfound));
	// times clicked
	player.stats.forEach(obj => obj.totalClicks = obj.totalClicks.add(1));
	player.stats.forEach(obj => obj.bestClicks = obj.bestClicks.max(player.stats[0].totalClicks));
	// coins gained
	player.points = player.points.add(player.clickValue);
	player.stats.forEach(obj => obj.total = obj.total.add(player.clickValue));
	player.stats.forEach(obj => obj.totalClickValue = obj.totalClickValue.add(player.clickValue));
};
