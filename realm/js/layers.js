const creationName = ["Air", "Soil", "Grass"];
const creationCostBase = [1, 100, 10_000];

function getCreationTierReq(index) {
	return 10 ** Math.floor(index / 2) * (index % 2 === 0 ? 10 : 32);
};

const creationTierEff = [
	[0.05, 0.1, 0.2, 0.4, 0.65, 1, 1.5, 2, 3],
	[0.5, 1.25, 2, 3.5, 5, 7.5, 8, 10],
	[0.5, 2, 2.5, 2.5, 5, 7, 8],
];

function getCreationTierCost(id) {
	if (!creationTierEff[id - 111][getBuyableAmount("C", id).toNumber()]) return Infinity;
	if (getBuyableAmount("C", id).gte(3)) return getBuyableAmount("C", id).pow_base(1_000).div(10_000).mul(creationCostBase[id - 111]);
	if (getBuyableAmount("C", id).eq(2)) return new Decimal(20_000).mul(creationCostBase[id - 111]);
	if (getBuyableAmount("C", id).eq(1)) return new Decimal(1_000).mul(creationCostBase[id - 111]);
	return new Decimal(100).mul(creationCostBase[id - 111]);
};

function getCreationTierUpgradeDesc(id) {
	const index = getBuyableAmount("C", id).toNumber();
	const name = creationName[id - 111].toLowerCase();
	const eff = creationTierEff[id - 111][index];
	return "increase " + name + "'" + (name.endsWith("s") ? "" : "s") + " first base effect by +" + (eff ? format(eff, 2, false) : "???") + "<br><br>Req: " + formatWhole(getCreationTierReq(index)) + " " + name + "<br><br>Cost: " + format(tmp.C.buyables[id].cost) + " coins";
};

function getCreationCost(id, bulk = player.C.bulk, amount = getBuyableAmount("C", id)) {
	const start = amount;
	const end = start.add(bulk - 1);
	const scale = new Decimal(50);
	const a = scale.add(start); // scaled start
	const b = scale.add(end); // scaled end
	let cost = start.pow(2).neg().add(start).add(end.pow(2)).add(end).mul(25).div(scale); // ∑n=start→end (50n/scale)
	cost = cost.add(a.pow(6).mul(-2).add(a.pow(5).mul(6)).sub(a.pow(4).mul(5)).add(a.pow(2)).add(b.pow(6).mul(2)).add(b.pow(5).mul(6)).add(b.pow(4).mul(5)).sub(b.pow(2)).div(scale.pow(5).mul(12))); // ∑n=a→b (n/scale)^5
	return cost.mul(creationCostBase[id - 11]);
};

function romanNumeral(num) {
	let text = "";
	if (num >= 100) text += ["C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"][Math.floor(num / 100) % 10 - 1];
	if (num % 100 >= 10) text += ["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"][Math.floor(num / 10) % 10 - 1];
	if (num % 10 >= 1) text += ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][num % 10 - 1];
	return text;
};

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
		player.C.points = getBuyableAmount("C", 11).add(getBuyableAmount("C", 12)).add(getBuyableAmount("C", 13));
		player.stats.forEach(obj => obj.creations = obj.creations.max(player.C.points));
		player.C.tiers = getBuyableAmount("C", 111).add(getBuyableAmount("C", 112)).add(getBuyableAmount("C", 113)).add(3);
	},
	shouldNotify() { return tmp.C.buyables[111].canBuy || tmp.C.buyables[112].canBuy || tmp.C.buyables[113].canBuy },
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
	clickables: {
		11: {
			title: "1x",
			canClick() {return player.C.bulk.neq(1)},
			onClick() {player.C.bulk = newDecimalOne()},
		},
		12: {
			title: "10x",
			canClick() {return player.C.bulk.neq(10)},
			onClick() {player.C.bulk = new Decimal(10)},
		},
		13: {
			title: "100x",
			canClick() {return player.C.bulk.neq(100)},
			onClick() {player.C.bulk = new Decimal(100)},
		},
		14: {
			title: "1,000x",
			canClick() {return player.C.bulk.neq(1000)},
			onClick() {player.C.bulk = new Decimal(1000)},
		},
	},
	buyables: {
		11: {
			title() { return creationName[this.id - 11] + " " + romanNumeral(getBuyableAmount("C", "1" + this.id).toNumber() + 1) },
			cost() { return getCreationCost(this.id) },
			effect() {
				let eff = new Decimal(0.1);
				for (let index = 0; index < getBuyableAmount("C", "1" + this.id).toNumber(); index++) {
					eff = eff.add(creationTierEff[this.id - 11][index]);
				};
				if (hasUpgrade("F", 1083)) eff = eff.add(upgradeEffect("F", 1083).mul(1));
				if (hasUpgrade("F", 1031)) eff = eff.mul(upgradeEffect("F", 1031));
				if (hasUpgrade("F", 1032)) eff = eff.mul(upgradeEffect("F", 1032));
				return eff;
			},
			display() {
				const cost = this.cost();
				const amount = getBuyableAmount(this.layer, this.id);
				const effect = buyableEffect(this.layer, this.id);
				return "\nCost: " + format(cost) + " coin" + (cost.eq(newDecimalOne()) ? "" : "s") + "\n\nAmount: " + formatWhole(amount) + "\n\nEffect: +" + format(effect) + " to coins/click\n\nTotal Effect: +" + format(effect * amount);
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("C", this.id, getBuyableAmount("C", this.id).add(player.C.bulk));
			},
		},
		12: {
			title() { return creationName[this.id - 11] + " " + romanNumeral(getBuyableAmount("C", "1" + this.id).toNumber() + 1) },
			cost() { return getCreationCost(this.id) },
			effect() {
				let eff = new Decimal(0.25);
				for (let index = 0; index < getBuyableAmount("C", "1" + this.id).toNumber(); index++) {
					eff = eff.add(creationTierEff[this.id - 11][index]);
				};
				if (hasUpgrade("F", 1083)) eff = eff.add(upgradeEffect("F", 1083).mul(2));
				if (hasUpgrade("F", 1031)) eff = eff.mul(upgradeEffect("F", 1031));
				if (hasUpgrade("F", 1032)) eff = eff.mul(upgradeEffect("F", 1032));
				return eff;
			},
			display() {
				const cost = this.cost();
				const amount = getBuyableAmount(this.layer, this.id);
				const effect = buyableEffect(this.layer, this.id);
				return "\nCost: " + format(cost) + " coin" + (cost.eq(newDecimalOne()) ? "" : "s") + "\n\nAmount: " + formatWhole(amount) + "\n\nEffect: +" + format(effect) + " to coins/sec\n\nTotal Effect: +" + format(effect * amount);
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("C", this.id, getBuyableAmount("C", this.id).add(player.C.bulk));
			},
		},
		13: {
			title() { return creationName[this.id - 11] + " " + romanNumeral(getBuyableAmount("C", "1" + this.id).toNumber() + 1) },
			cost() { return getCreationCost(this.id) },
			effect() {
				let eff = new Decimal(2.5);
				for (let index = 0; index < getBuyableAmount("C", "1" + this.id).toNumber(); index++) {
					eff = eff.add(creationTierEff[this.id - 11][index]);
				};
				if (hasUpgrade("F", 1083)) eff = eff.add(upgradeEffect("F", 1083).mul(4));
				if (hasUpgrade("F", 1031)) eff = eff.mul(upgradeEffect("F", 1031));
				if (hasUpgrade("F", 1032)) eff = eff.mul(upgradeEffect("F", 1032));
				return eff;
			},
			effect2: 0.25,
			display() {
				const b = tmp[this.layer].buyables[this.id];
				const amount = getBuyableAmount(this.layer, this.id);
				const effect = buyableEffect(this.layer, this.id);
				return "\nCost: " + format(b.cost) + " coins\n\nAmount: " + formatWhole(amount) + "\n\nEffect: +" + format(effect) + " to coins/" + (hasUpgrade("F", 1143) ? "click" : "sec") + " and +" + format(b.effect2) + "% to FC find chance\n\nTotal Effect: +" + format(amount.mul(effect)) + " and +" + format(amount.mul(b.effect2)) + "%";
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("C", this.id, getBuyableAmount("C", this.id).add(player.C.bulk));
			},
		},
		111: {
			title: "Uptier " + creationName[0],
			cost() { return getCreationTierCost(this.id) },
			display() { return getCreationTierUpgradeDesc(this.id) },
			canAfford() { return getBuyableAmount("C", this.id - 100).gte(getCreationTierReq(getBuyableAmount("C", this.id).toNumber())) && player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("C", this.id, getBuyableAmount("C", this.id).add(1));
			},
			style: {height: "90px"},
		},
		112: {
			title: "Uptier " + creationName[1],
			cost() { return getCreationTierCost(this.id) },
			display() { return getCreationTierUpgradeDesc(this.id) },
			canAfford() { return getBuyableAmount("C", this.id - 100).gte(getCreationTierReq(getBuyableAmount("C", this.id).toNumber())) && player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("C", this.id, getBuyableAmount("C", this.id).add(1));
			},
			style: {height: "90px"},
		},
		113: {
			title: "Uptier " + creationName[2],
			cost() { return getCreationTierCost(this.id) },
			display() { return getCreationTierUpgradeDesc(this.id) },
			canAfford() { return getBuyableAmount("C", this.id - 100).gte(getCreationTierReq(getBuyableAmount("C", this.id).toNumber())) && player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount("C", this.id, getBuyableAmount("C", this.id).add(1));
			},
			style: {height: "90px"},
		},
	},
});

const autocastTier = ["OFF", "primary - ON", "secondary - ON", "ternary - ON"];

function getSpellCost(index) {
	let cost = new Decimal([80, 160, 120][index]);
	if (hasUpgrade("F", 1152)) cost = cost.mul(3);
	return cost;
};

function getSideColor(side = -1) {
	if (side < 0) side = [11, 12].findIndex(id => hasUpgrade("F", id));
	if (side === 0) return "#4040E0";
	if (side === 1) return "#E04040";
	return "#C0C0C0";
};

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
	layerShown() { return true },
	tooltip() { return format(player.M.mana) + "/" + format(player.M.maxMana) + " mana" },
	update(diff) {
		// mana regen buffs
		let manaRegen = new Decimal(2.5);
		if (hasUpgrade("M", 12) && upgradeEffect("M", 12).gt(0)) manaRegen = manaRegen.add(upgradeEffect("M", 12));
		if (hasUpgrade("M", 14) && upgradeEffect("M", 14).gt(0)) manaRegen = manaRegen.add(upgradeEffect("M", 14));
		if (hasUpgrade("F", 1052)) manaRegen = manaRegen.mul(upgradeEffect("F", 1052));
		if (hasUpgrade("G", 13)) manaRegen = manaRegen.mul(upgradeEffect("G", 13));
		player.M.manaRegen = manaRegen;
		// max mana buffs
		let maxMana = new Decimal(100);
		if (hasUpgrade("F", 1051)) maxMana = maxMana.mul(upgradeEffect("F", 1051));
		if (hasUpgrade("F", 1151)) maxMana = maxMana.mul(upgradeEffect("F", 1151));
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
			if (getClickableState("M", index + 11)) {
				player.M.spellTimes[index] = player.M.spellTimes[index].sub(diff);
			};
			if (player.M.spellTimes[index].lte(0)) {
				setClickableState("M", index + 11, false);
				player.M.spellTimes[index] = newDecimalZero();
			};
		};
		// primary autocasting
		if (player.M.spellTimes[1].lte(0) && player.M.mana.gte(getSpellCost(1))) {
			if (getClickableState("M", 102) === 1) {
				callCast();
			} else if (getClickableState("M", 102) === 3 && player.M.mana.gte(player.M.maxMana.mul(player.M.autoPercent / 100))) {
				callCast();
			};
		};
		if (player.M.spellTimes[2].lte(0) && player.M.mana.gte(getSpellCost(2))) {
			if (getClickableState("M", 103) === 1) {
				sideSpellCast();
			} else if (getClickableState("M", 103) === 3 && player.M.mana.gte(player.M.maxMana.mul(player.M.autoPercent / 100))) {
				sideSpellCast();
			};
		};
		// secondary autocasting
		const taxCost = getSpellCost(0);
		if ((player.M.spellTimes[1].gt(0) || !getClickableState("M", 102)) && (player.M.spellTimes[2].gt(0) || !getClickableState("M", 103)) && player.M.mana.gte(taxCost)) {
			if (getClickableState("M", 101) === 2) {
				taxCast(player.M.mana.div(taxCost).floor());
			} else if (getClickableState("M", 101) === 3 && player.M.mana.gte(player.M.maxMana.mul(player.M.autoPercent / 100))) {
				taxCast(player.M.mana.sub(player.M.maxMana.mul(player.M.autoPercent / 100)).div(taxCost).floor());
			};
		};
	},
	tabFormat() {
		const arr = [["bar", "mana"]];
		if (hasUpgrade("M", 103)) arr.push("blank", "mana-auto-percent-slider");
		arr.push("blank");
		arr.push(["clickables", [1]]);
		arr.push(["clickables", [10]]);
		arr.push("blank");
		arr.push(["upgrades", [1]]);
		arr.push(["display-text", "You have generated " + format(player.stats[2].manaTotal) + " mana in total"]);
		arr.push("blank");
		arr.push(["upgrades", [10]]);
		return arr;
	},
	componentStyles: {
		upgrade: {height: "120px", "border-radius": "25px"},
		clickable: {width: "125px", "min-height": "50px", transform: "none"},
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
				if (hasUpgrade("F", 1162)) eff = eff.add(30);
				if (hasUpgrade("F", 1152)) eff = eff.mul(2);
				return eff;
			},
			canClick() { if (player.M.mana.gte(getSpellCost(this.id - 11))) return true },
			onClick: taxCast,
			color: "#C0C0C0",
			style: {height: "125px", "border-radius": "25px 25px 0 0"},
		},
		12: {
			title: "Call to Arms",
			display() { return "boost all coin generation based on your creations for 30 seconds<br>Time left: " + formatTime(player.M.spellTimes[1]) + "<br><br>Effect: x" + format(clickableEffect("M", this.id)) + "<br><br>Cost: " + formatWhole(getSpellCost(this.id - 11)) + " mana" },
			effect() {
				let eff = player.C.points.add(1).pow(0.15);
				if (hasUpgrade("F", 1152)) eff = eff.mul(2);
				return eff;
			},
			canClick() {
				if (getClickableState("M", this.id)) return false;
				if (player.M.mana.gte(getSpellCost(this.id - 11))) return true;
				return false;
			},
			onClick: callCast,
			color: "#C0C0C0",
			style: {height: "125px", "border-radius": "25px 25px 0 0"},
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
				if (hasUpgrade("F", 1152)) eff = eff.mul(2);
				if (hasUpgrade("F", 1082)) eff = eff.mul(upgradeEffect("F", 1082));
				return eff;
			},
			canClick() {
				if (getClickableState("M", this.id)) return false;
				if (player.M.mana.gte(getSpellCost(this.id - 11)) && hasChosenSide()) return true;
				return false;
			},
			onClick: sideSpellCast,
			color: getSideColor,
			style: {height: "125px", "border-radius": "25px 25px 0 0"},
		},
		101: {
			title: "Autocasting",
			display() {
				if (hasUpgrade("M", 102)) return autocastTier[getClickableState(this.layer, this.id) || 0];
				return "LOCKED - need better autocasting";
			},
			canClick() { return hasUpgrade("M", 102) },
			onClick() {
				if (getClickableState(this.layer, this.id) === 3) {
					setClickableState(this.layer, this.id, 0);
				} else if (getClickableState(this.layer, this.id) === 2) {
					if (hasUpgrade("M", 103)) setClickableState(this.layer, this.id, 3);
					else setClickableState(this.layer, this.id, 0);
				} else {
					setClickableState(this.layer, this.id, 2);
				};
			},
			color: "#C0C0C0",
			style: {"border-radius": "0 0 25px 25px"},
		},
		102: {
			title: "Autocasting",
			display() {
				if (hasUpgrade("M", 101)) return autocastTier[getClickableState(this.layer, this.id) || 0];
				return "LOCKED - need better autocasting";
			},
			canClick() { return hasUpgrade("M", 101) },
			onClick() {
				if (getClickableState(this.layer, this.id) === 3) {
					setClickableState(this.layer, this.id, 0);
				} else if (getClickableState(this.layer, this.id) === 1) {
					if (hasUpgrade("M", 103)) setClickableState(this.layer, this.id, 3);
					else setClickableState(this.layer, this.id, 0);
				} else {
					setClickableState(this.layer, this.id, 1);
				};
			},
			color: "#C0C0C0",
			style: {"border-radius": "0 0 25px 25px"},
		},
		103: {
			title() { return (hasChosenSide() ? "Autocasting" : "LOCKED") },
			display() {
				if (!hasChosenSide()) return "";
				if (hasUpgrade("M", 101)) return autocastTier[getClickableState(this.layer, this.id) || 0];
				return "LOCKED - need better autocasting";
			},
			canClick() { return hasChosenSide() && hasUpgrade("M", 101) },
			onClick() {
				if (getClickableState(this.layer, this.id) === 3) {
					setClickableState(this.layer, this.id, 0);
				} else if (getClickableState(this.layer, this.id) === 1) {
					if (hasUpgrade("M", 103)) setClickableState(this.layer, this.id, 3);
					else setClickableState(this.layer, this.id, 0);
				} else {
					setClickableState(this.layer, this.id, 1);
				};
			},
			color: getSideColor,
			style: {"border-radius": "0 0 25px 25px"},
		},
	},
	upgrades: {
		11: {
			fullDisplay() { return "<h3>Mana Cup</h3><br>multiply max mana based on your mana generated this era<br><br>Effect: x" + format(upgradeEffect("M", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.stats[0].manaTotal.add(1).pow(0.1) },
			cost: 1_500,
			currencyInternalName: "points",
			currencyLocation() { return player },
		},
		12: {
			fullDisplay() { return "<h3>Mana Sense</h3><br>increase mana regen based on your mana generated this era<br><br>Effect: +" + format(upgradeEffect("M", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.stats[0].manaTotal.add(1).pow(0.125) },
			cost: 5_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("M", 11) },
		},
		13: {
			fullDisplay() { return "<h3>Mana Jar</h3><br>multiply max mana based on your creations<br><br>Effect: x" + format(upgradeEffect("M", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.C.points.add(1).pow(0.125) },
			cost: 25_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("M", 12) },
		},
		14: {
			fullDisplay() { return "<h3>Mana Sight</h3><br>increase mana regen based on your creations<br><br>Effect: +" + format(upgradeEffect("M", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.C.points.add(1).pow(0.225) },
			cost: 125_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("M", 13) },
		},
		101: {
			fullDisplay() { return "<h3>Primary Autocasting</h3><br>unlock autocasting<br><br>Req: 10,000 total mana generated<br><br>Cost: " + format(this.cost) + " coins" },
			cost: 1_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
		},
		102: {
			fullDisplay() { return "<h3>Secondary Autocasting</h3><br>unlock tax collection autocasting<br><br>Req: 100,000 total mana generated<br><br>Cost: " + format(this.cost) + " coins" },
			cost: 1_000_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("M", 101) },
		},
		103: {
			fullDisplay() { return "<h3>Ternary Autocasting</h3><br>unlock autocasting when mana is at least a specified percent of max mana<br><br>Req: 1,000,000 total mana generated<br><br>Cost: " + format(this.cost) + " coins" },
			cost: 1e12,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("M", 102) },
		},
	},
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
		["row", [["upgrade", 11], ["blank", ["17px"]], ["upgrade", 12], ["blank", ["17px"]], ["upgrade", 13]]],
		"blank",
		["row", [["upgrade", 21], ["blank", ["17px"]], ["upgrade", 22], ["blank", ["17px"]], ["upgrade", 23]]],
		"blank",
		["upgrades", [103, 104, 105, 106, 107, 108, 113, 114, 115, 116, 117, 118]],
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
		},
		21: getAllianceUpgrade(0),
		22: getAllianceUpgrade(1),
		23: getAllianceUpgrade(2),
		// faction upgrades
		// fairy faction
		1031: {
			fullDisplay() { return "<h3>Magic Dust</h3><br>multiply the first effect of basic creations based on your mana regen<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.M.manaRegen.mul(2).add(1).pow(0.5) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 0 },
		},
		1032: {
			fullDisplay() { return "<h3>Fairy Workers</h3><br>multiply the first effect of basic creations based on your creations<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.C.points.add(1).pow(0.2) },
			cost: 5_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 0 },
		},
		1033: {
			fullDisplay() { return "<h3>Fairy Traders</h3><br>multiply coins/click and faction coin find chance based on your creations<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br>and +" + format(upgradeEffect("F", this.id).mul(3)) + "%<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.C.points.add(1).pow(0.1) },
			cost: 50_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 0 },
		},
		// elf faction
		1041: {
			fullDisplay() { return "<h3>Super Clicks</h3><br>multiply coins/click based on your creations<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.C.points.add(1).pow(0.25) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 1 },
		},
		1042: {
			fullDisplay() { return "<h3>Elven Luck</h3><br>increase faction coin find chance based on your coins/click<br><br>Effect: +" + format(upgradeEffect("F", this.id)) + "%<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.clickValue.add(1).pow(0.3) },
			cost: 5_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 1 },
		},
		1043: {
			fullDisplay() { return "<h3>Elven Spirit</h3><br>multiply coins/click based on your elf coins<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.FC[1].add(1).pow(0.4) },
			cost: 50_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 1 },
		},
		1044: {
			fullDisplay() { return "<h3>Elf Trade Route</h3><br>unlock 3 more elf upgrades<br><br>Cost: 25 elf coins" },
			canAfford() { return player.FC[1].gte(25) },
			pay() { player.FC[1] = player.FC[1].sub(25) },
			unlocked() { return getAllianceIndex() === 1 },
		},
		1141: {
			fullDisplay() { return "<h3>Elven Clicks</h3><br>multiply coins/click based on your coins<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.points.add(1).pow(0.01) },
			cost: 5_000_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("F", 1044) },
		},
		1142: {
			fullDisplay() { return "<h3>Enchanted Clicks</h3><br>multiply coins/click based on your mana regen<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.M.manaRegen.add(1).pow(0.5) },
			cost: 500_000_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("F", 1044) },
		},
		1143: {
			fullDisplay() { return "<h3>All on One</h3><br>the 3rd creation's first effect now applies to coins/click instead of coins/sec<br><br>Cost: " + format(this.cost) + " coins" },
			cost: 5e10,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("F", 1044) },
		},
		// angel faction
		1051: {
			fullDisplay() { return "<h3>Angelic Capacity</h3><br>multiply max mana based on your mana generated<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.stats[0].manaTotal.add(1).pow(0.075) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 2 },
		},
		1052: {
			fullDisplay() { return "<h3>Road to Heaven</h3><br>multiply mana regen based on your angel coins<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.FC[2].add(1).pow(0.4) },
			cost: 5_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 2 },
		},
		1053: {
			fullDisplay() { return "<h3>Angels Supreme</h3><br>gain 5x angel coins<br><br>Cost: " + format(this.cost) + " coins" },
			cost: 50_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 2 },
		},
		1054: {
			fullDisplay() { return "<h3>Angel Trade Route</h3><br>unlock 3 more angel upgrades<br><br>Cost: 25 angel coins" },
			canAfford() { return player.FC[2].gte(25) },
			pay() { player.FC[2] = player.FC[2].sub(25) },
			unlocked() { return getAllianceIndex() === 2 },
		},
		1151: {
			fullDisplay() { return "<h3>Rainbows</h3><br>multiply max mana based on your faction coins<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.F.points.add(1).pow(0.2) },
			cost: 5_000_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("F", 1054) },
		},
		1152: {
			fullDisplay() { return "<h3>Prism Upgrade</h3><br>double all spell effects, but triple all spell mana costs<br><br>Cost: " + format(this.cost) + " coins" },
			cost: 500_000_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("F", 1054) },
		},
		1153: {
			fullDisplay() { return "<h3>Angelic Clicks</h3><br>multiply coins/click based on your max mana<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.M.maxMana.add(1).pow(0.05) },
			cost: 5e10,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("F", 1054) },
		},
		// goblin faction
		1061: {
			fullDisplay() { return "<h3>Jackpot</h3><br>increase faction coin find chance based on your coins<br><br>Effect: +" + format(upgradeEffect("F", this.id)) + "%<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.points.add(1).pow(0.2) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 3 },
		},
		1062: {
			fullDisplay() { return "<h3>Goblin's Greed</h3><br>multiply coins/sec based on your faction coins<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.F.points.add(1).pow(0.25) },
			cost: 5_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 3 },
		},
		1063: {
			fullDisplay() { return "<h3>Currency Revolution</h3><br>increase faction coin find chance based on your faction coins<br><br>Effect: +" + format(upgradeEffect("F", this.id)) + "%<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.F.points.add(1).pow(0.6) },
			cost: 50_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 3 },
		},
		1064: {
			fullDisplay() { return "<h3>Goblin Trade Route</h3><br>unlock 3 more goblin upgrades<br><br>Cost: 25 goblin coins" },
			canAfford() { return player.FC[3].gte(25) },
			pay() { player.FC[3] = player.FC[3].sub(25) },
			unlocked() { return getAllianceIndex() === 3 },
		},
		1161: {
			fullDisplay() { return "<h3>Moneyload</h3><br>multiply coins/sec based on your faction coin find chance<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.FCchance.add(1).pow(0.25) },
			cost: 5_000_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("F", 1064) },
		},
		1162: {
			fullDisplay() { return "<h3>Absurd Taxes</h3><br>increase the base effect of Tax Collection by +30 seconds<br><br>Cost: " + format(this.cost) + " coins" },
			cost: 500_000_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("F", 1064) },
		},
		1163: {
			fullDisplay() { return "<h3>Goblin Pride</h3><br>multiply coins/sec based on your goblin coins<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.FC[3].add(1).pow(0.3) },
			cost: 5e10,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return hasUpgrade("F", 1064) },
		},
		// undead faction
		1071: {
			fullDisplay() { return "<h3>Undending Cycle</h3><br>multiply coins/sec based on your coins<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.points.add(1).log10().div(2).add(1) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 4 },
		},
		1072: {
			fullDisplay() { return "<h3>Corpse Piles</h3><br>multiply coins/sec based on your undead coins<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.FC[4].add(1).pow(0.3) },
			cost: 5_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 4 },
		},
		1073: {
			fullDisplay() { return "<h3>Stay no More</h3><br>multiply coins/sec based on your coins/click<br><br>Effect: x" + format(upgradeEffect("F", this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.clickValue.add(1).log10().div(2).add(1) },
			cost: 50_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 4 },
		},
		// demon faction
		1081: {
			fullDisplay() { return "<h3>Demonic Prestige</h3><br>multiply coins/sec based on your creation tiers<br><br>Effect: x" + format(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.C.tiers.div(5).add(1) },
			cost: 500,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 5 },
		},
		1082: {
			fullDisplay() { return "<h3>Demonic Blood</h3><br>multiply blood frenzy effect based on your creations (higher numbered ones count more)<br><br>Effect: x" + format(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: " + format(this.cost) + " coins" },
			effect() {
				let amt = getBuyableAmount("C", 11);
				amt = amt.add(getBuyableAmount("C", 12).mul(5));
				amt = amt.add(getBuyableAmount("C", 13).mul(25));
				return amt.div(10).add(1).pow(0.1);
			},
			cost: 5_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 5 },
		},
		1083: {
			fullDisplay() { return "<h3>Polished Rage</h3><br>increase all creation's first base effects based on their number and your gems<br><br>Effect: +(" + format(upgradeEffect(this.layer, this.id)) + " * 2^num)<br><br>Cost: " + format(this.cost) + " coins" },
			effect() { return player.G.points.add(1).pow(0.1).sub(1) },
			cost: 50_000,
			currencyInternalName: "points",
			currencyLocation() { return player },
			unlocked() { return getAllianceIndex() === 5 },
		},
	},
});

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
	upgrades: {
		11: {
			title: "Gem Influence",
			description: "increase faction coin find chance based on your total gems",
			effect() {
				let eff = player.G.total.add(1).log10().mul(10);
				if (hasUpgrade("G", 12)) eff = eff.mul(upgradeEffect("G", 12));
				return eff;
			},
			effectDisplay() { return "+" + format(upgradeEffect("G", this.id)) + "%" },
			cost: 1,
		},
		12: {
			title: "Gem Displays",
			description: "multiply the effect of <b>Gem Influence</b> based on your gems",
			effect() { return player.G.points.add(1).log10().add(1) },
			effectDisplay() { return "x" + format(upgradeEffect("G", this.id)) },
			cost: 100,
			unlocked() { return hasUpgrade("G", 11) },
		},
		13: {
			title: "Magic Gems",
			description: "multiply max mana and mana regen based on your gems",
			effect() {
				let eff = player.G.points.add(1).log10().add(1).pow(0.5);
				if (hasUpgrade("G", 14)) eff = eff.mul(upgradeEffect("G", 14));
				return eff;
			},
			effectDisplay() { return "x" + format(upgradeEffect("G", this.id)) },
			cost: 10_000,
			unlocked() { return hasUpgrade("G", 12) },
		},
		14: {
			title: "Magic Residue",
			description: "multiply the effect of <b>Magic Gems</b> based on your best gems",
			effect() { return player.G.best.add(1).log10().add(1).pow(0.25) },
			effectDisplay() { return "x" + format(upgradeEffect("G", this.id)) },
			cost: 1_000_000,
			unlocked() { return hasUpgrade("G", 13) },
		},
	},
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

function coinClick() {
	// faction coins gained calculation
	const factionCoinGainType = getRandInt(0, 6);
	let factionCoinsFound = newDecimalZero();
	if (player.FCchance.gte(100)) factionCoinsFound = player.FCchance.div(100);
	else if (player.FCchance.div(100).gte(Math.random())) factionCoinsFound = newDecimalOne();
	if (hasUpgrade("F", 1053) && factionCoinGainType === 2) factionCoinsFound = factionCoinsFound.mul(5);
	factionCoinsFound = factionCoinsFound.floor();
	// faction coins gained
	player.FC[factionCoinGainType] = player.FC[factionCoinGainType].add(factionCoinsFound);
	player.stats.forEach(obj => obj.FCtotal = obj.FCtotal.add(factionCoinsFound));
	// times clicked
	player.stats.forEach(obj => obj.totalClicks = obj.totalClicks.add(1));
	player.stats.forEach(obj => obj.bestClicks = obj.bestClicks.max(player.stats[0].totalClicks));
	// coins gained
	let clickPower = player.clickValue;
	if (hasUpgrade("F", 11) && getClickableState("M", 13)) clickPower = clickPower.mul(clickableEffect("M", 13));
	player.points = player.points.add(clickPower);
	player.stats.forEach(obj => obj.total = obj.total.add(clickPower));
	player.stats.forEach(obj => obj.totalClickValue = obj.totalClickValue.add(clickPower));
};

document.onclick = coinClick;
