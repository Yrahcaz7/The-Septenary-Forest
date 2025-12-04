addLayer("C", {
	name: "Components",
	row: 0,
	position: 0,
	startData() { return {
		points: newDecimalZero(),
		tiers: new Decimal(3),
		bulk: newDecimalOne(),
	}},
	color: "#C0C0C0",
	resource: "components",
	type: "none",
	update(diff) {
		let components = newDecimalZero();
		let tiers = new Decimal(3);
		for (const key in player.C.buyables) {
			if (key < 100) components = components.add(getBuyableAmount("C", key));
			else tiers = tiers.add(getBuyableAmount("C", key));
		};
		player.C.points = components;
		player.C.tiers = tiers;
		player.stats.forEach(obj => obj.components = obj.components.max(player.C.points));
	},
	shouldNotify() {
		for (const key in player.C.buyables) {
			if (key > 100 && tmp.C.buyables[key].canBuy) return true;
		};
	},
	tabFormat() {
		const clickableRow = [];
		for (let index = 0; index < 6; index++) {
			clickableRow.push(["bulk-button", index, {margin: "0 7px"}]);
		};
		const buyableRow = [];
		for (let index = 0; tmp.C.buyables[index + 11]?.unlocked; index++) {
			buyableRow.push(["column", [["buyable", index + 11], ["buyable", index + 111]], {margin: "0 7px"}]);
		};
		return [
			["display-text", `You are bulk buying <b>${formatWhole(player.C.bulk)}x</b> components`],
			"blank",
			["row", clickableRow],
			"blank",
			["row", buyableRow],
		];
	},
	componentStyles: {
		buyable: {width: "180px", height: "125px", "border-radius": "25px"},
	},
	buyables: (() => {
		const data = {};
		function getCreationName(num) {
			if (num === 0) return "Air";
			if (num === 1) return "Stone";
			if (num === 2) return "Coal";
			if (num === 3) {
				if (hasUpgrade("F", 11)) return "Water";
				if (hasUpgrade("F", 12)) return "Fire";
				return "Iron";
			};
			return "???";
		};
		function getCreationCost(num) {
			let base = 1;
			if (hasFactionUpgrade(1, 0, 5)) base /= 1.2;
			return 100 ** ((1 + base) ** num - 1);
		};
		const creationTierEff = [
			[0.1,  0.05, 0.1,  0.2, 0.4, 0.65, 1,    1.5,  2,  3],
			[0.25, 0.5,  1.25, 2,   3.5, 5,    7.5,  8,    10],
			[20,   5,    7,    8,   10,  14,   16,   20],
			[500,  200,  300,  500, 700, 1000, 1300, 1500],
		];
		function getCreationTierReq(tier) {
			return 10 ** Math.floor(tier / 2) * (tier % 2 === 0 ? 10 : 32);
		};
		for (let index = 0; index < 4; index++) {
			data[index + 11] = {
				effect() {
					let eff = newDecimalZero();
					for (let tier = 0; tier <= getBuyableAmount("C", index + 111).toNumber(); tier++) {
						eff = eff.add(creationTierEff[index][tier]);
					};
					if (hasFactionUpgrade(0, 2, 5)) eff = eff.add(factionUpgradeEffect(0, 2).mul(2 ** index));
					if (index < 3) {
						if (hasFactionUpgrade(0, 0, 0)) eff = eff.mul(factionUpgradeEffect(0, 0));
						if (hasFactionUpgrade(0, 1, 0)) eff = eff.mul(factionUpgradeEffect(0, 1));
						if (hasFactionUpgrade(1, 1, 0)) eff = eff.mul(factionUpgradeEffect(1, 1));
					} else {
						if (hasFactionUpgrade(1, 2, 5)) eff = eff.mul(factionUpgradeEffect(1, 2));
					};
					return eff;
				},
				title() { return getCreationName(index) + " " + romanNumeral(getBuyableAmount("C", index + 111).toNumber() + 1) },
				cost() {
					const start = getBuyableAmount("C", index + 11);
					const end = start.add(player.C.bulk - 1);
					const scale = new Decimal(50);
					const a = scale.add(start); // scaled start
					const b = scale.add(end); // scaled end
					let cost = start.pow(2).neg().add(start).add(end.pow(2)).add(end).mul(25).div(scale); // ∑n=start→end (50n/scale)
					cost = cost.add(a.pow(6).mul(-2).add(a.pow(5).mul(6)).sub(a.pow(4).mul(5)).add(a.pow(2)).add(b.pow(6).mul(2)).add(b.pow(5).mul(6)).add(b.pow(4).mul(5)).sub(b.pow(2)).div(scale.pow(5).mul(12))); // ∑n=a→b (n/scale)^5
					return cost.mul(getCreationCost(index));
				},
				display() {
					const b = tmp.C.buyables[index + 11];
					const amount = getBuyableAmount("C", index + 11);
					const text = `\nCost: ${format(b.cost)} coin${b.cost.eq(1) ? "" : "s"}\n\nAmount: ${formatWhole(amount)}\n\n`;
					if (index === 2) {
						return text + `Effects: +${format(b.effect)} coins/${hasFactionUpgrade(1, 2, 1) ? "click" : "sec"} and +${format(b.effect2)}% FC find chance\n\nTotal Effects: +${format(amount.mul(b.effect))} and +${format(b.effect2total)}%${b.effect2total.gt(50) ? " (softcapped)" : ""}`;
					};
					return text + `Effect: +${format(b.effect)} coins/${index === 0 || (index >= 3 && hasUpgrade("F", 11)) ? "click" : "sec"}\n\nTotal Effect: +${format(b.effect * amount)}`;
				},
				canAfford() { return player.points.gte(this.cost()) },
				buy() {
					player.points = player.points.sub(this.cost());
					addBuyables("C", index + 11, player.C.bulk);
				},
			};
			if (index === 2) {
				data[index + 11].effect2 = new Decimal(5);
				data[index + 11].effect2total = function() {
					let eff = getBuyableAmount("C", index + 11).mul(this.effect2);
					if (eff.gt(50)) eff = eff.div(50).pow(0.25).mul(50);
					return eff;
				};
			};
			data[index + 111] = {
				title() { return "Uptier " + getCreationName(index) },
				cost() {
					if (!creationTierEff[index][getBuyableAmount("C", index + 111).toNumber()]) return newDecimalInf();
					if (getBuyableAmount("C", index + 111).gte(4)) return getBuyableAmount("C", index + 111).pow_base(1_000).div(10_000).mul(getCreationCost(index));
					return getBuyableAmount("C", index + 111).pow_base(20).mul(50 * getCreationCost(index));
				},
				display() {
					const tier = getBuyableAmount("C", index + 111).toNumber();
					const name = getCreationName(index).toLowerCase();
					const eff = creationTierEff[index][tier + 1];
					return `increase ${name}'${name.endsWith("s") ? "" : "s"} first base effect by +${eff ? format(eff, 2, false) : "???"}<br><br>Req: ${formatWhole(getCreationTierReq(tier))} ${name}<br><br>Cost: ${format(tmp.C.buyables[index + 111].cost)} coins`;
				},
				canAfford() { return getBuyableAmount("C", index + 11).gte(getCreationTierReq(getBuyableAmount("C", index + 111).toNumber())) && player.points.gte(this.cost()) },
				buy() {
					player.points = player.points.sub(this.cost());
					addBuyables("C", index + 111, 1);
				},
				style: {height: "90px"},
			};
			if (index >= 3) {
				data[index + 11].color = getSideColor;
				data[index + 111].color = getSideColor;
				data[index + 11].unlocked = hasChosenSide;
				data[index + 111].unlocked = hasChosenSide;
			};
		};
		return data;
	})(),
});
