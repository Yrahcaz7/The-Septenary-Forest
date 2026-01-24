addLayer("e", {
	name: "Essence",
	symbol: "E",
	row: 0,
	position: 0,
	startData() { return {
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		auto_upgrades: false,
		auto_buyables: false,
	}},
	color: "#4CED13",
	branches: ["c", "q", "p"],
	requires: 5,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "essence",
	baseResource: "points",
	baseAmount() { return player.points },
	type: "normal",
	exponent: 0.5,
	gainMult() {
		// init
		let mult = newDecimalOne();
		// mul
		if (hasUpgrade("e", 13)) mult = mult.mul(upgradeEffect("e", 13));
		if (hasUpgrade("e", 22)) {
			mult = mult.mul(upgradeEffect("e", 22));
			if (hasUpgrade("e", 41)) {
				mult = mult.mul(upgradeEffect("e", 41));
				if (hasUpgrade("e", 42)) mult = mult.mul(upgradeEffect("e", 42));
		}};
		if (hasUpgrade("c", 11)) mult = mult.mul(upgradeEffect("c", 11));
		if (hasUpgrade("q", 12) && hasUpgrade("q", 14)) {
			mult = mult.mul(upgradeEffect("q", 14));
			if (hasUpgrade("q", 15)) mult = mult.mul(upgradeEffect("q", 15));
		};
		if (hasUpgrade("q", 32)) mult = mult.mul(upgradeEffect("q", 32));
		if (hasUpgrade("a", 73)) mult = mult.mul(upgradeEffect("a", 73));
		if (hasUpgrade("p", 11)) mult = mult.mul(upgradeEffect("p", 11));
		if (hasUpgrade("m", 11)) mult = mult.mul(upgradeEffect("m", 11));
		if (hasUpgrade("m", 22)) mult = mult.mul(upgradeEffect("m", 22));
		if (hasBuyable("e", 11)) mult = mult.mul(buyableEffect("e", 11));
		if (hasBuyable("e", 12)) mult = mult.mul(buyableEffect("e", 12)[1]);
		if (hasBuyable("c", 12)) mult = mult.mul(buyableEffect("c", 12));
		if (hasBuyable("sp", 12)) mult = mult.mul(buyableEffect("sp", 12)[0]);
		if (hasBuyable("gi", 12)) mult = mult.mul(buyableEffect("gi", 12));
		if (hasUpgrade("p", 22)) mult = mult.mul(player.p.holiness.add(1).pow(0.055));
		if (hasUpgrade("p", 83)) mult = mult.mul(upgradeEffect("p", 83));
		if (tmp.s.effect.gt(1) && !tmp.s.deactivated) mult = mult.mul(tmp.s.effect);
		if (new Decimal(tmp.r.effect[2]).gt(1) && !tmp.r.deactivated) mult = mult.mul(tmp.r.effect[2]);
		if (hasUpgrade("ds", 21)) mult = mult.mul(player.A.points.mul(0.2));
		if (new Decimal(tmp.w.effect[0]).gt(1) && !tmp.w.deactivated) mult = mult.mul(tmp.w.effect[0]);
		if (new Decimal(tmp.ch.effect[0]).gt(1) && !tmp.ch.deactivated) mult = mult.mul(tmp.ch.effect[0]);
		// div
		if (hasBuyable("sp", 11)) mult = mult.mul(buyableEffect("sp", 11)[1]);
		if (inChallenge("ds", 21)) mult = mult.div(1e20);
		// pow
		if (hasBuyable("e", 13)) mult = mult.pow(buyableEffect("e", 13));
		if (hasBuyable("cl", 21)) mult = mult.pow(buyableEffect("cl", 21)[0]);
		// return
		return mult;
	},
	hotkeys: [{key: "e", description: "E: Reset for essence", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	passiveGeneration() {
		let gen = 0;
		if (hasUpgrade("e", 43)) gen += 2e20;
		if (hasMilestone("c", 3)) {
			gen += 0.5;
			if (hasUpgrade("h", 51)) {
				gen += 0.25;
				if (hasUpgrade("h", 54)) {
					gen += 0.25;
					if (hasUpgrade("h", 61)) {
						gen += 0.25;
						if (hasUpgrade("h", 64)) {
							gen += 0.25;
		}}}}};
		if (hasUpgrade("pl", 12)) gen += 0.1;
		return gen;
	},
	automate() {
		if (hasMilestone("m", 2) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				buyUpgrade(this.layer, id);
			};
		};
		if (hasMilestone("m", 0) && player[this.layer].auto_buyables) {
			updateBuyableTemp(this.layer);
			for (const id in tmp[this.layer].buyables) {
				buyBuyable(this.layer, id);
			};
		};
	},
	doReset(resettingLayer) {
		if (getActivatedRelics() >= 21 && resettingLayer != "mo") return;
		if (hasMilestone("s", 20) && resettingLayer == "s") return;
		if (hasMilestone("m", 2) && resettingLayer == "m") return;
		if (hasMilestone("gi", 1) && resettingLayer == "gi") return;
		let keep = ["auto_upgrades", "auto_buyables"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (hasMilestone("c", 0) && resettingLayer == "c") keep.push("upgrades");
		if (hasMilestone("c", 2) && resettingLayer == "c") keep.push("buyables");
		if (hasMilestone("q", 1) && resettingLayer == "q") keep.push("upgrades");
		if (hasMilestone("q", 2) && resettingLayer == "q") keep.push("buyables");
		if (hasMilestone("sp", 1) && resettingLayer == "sp") keep.push("upgrades");
		if (hasMilestone("sp", 4) && resettingLayer == "sp") keep.push("buyables");
		if (hasMilestone("h", 0) && resettingLayer == "h") keep.push("upgrades");
		if (hasMilestone("h", 1) && resettingLayer == "h") keep.push("buyables");
		if (hasMilestone("ds", 3)) keep.push("upgrades");
		if (hasMilestone("ds", 4)) keep.push("buyables");
		if (layers[resettingLayer].row > this.row) layerDataReset("e", keep);
	},
	tabFormat: getTab("e"),
	buyables: {
		11: {
			cost(x) { return new Decimal(12).pow(x).add(20) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Purer Essence' },
			description: 'multiplies essence gain based on the amount of this upgrade bought.',
			canAfford() { return player.e.points.gte(this.cost()) },
			purchaseLimit() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer ? 99 : 14 },
			buy() { buyStandardBuyable(this) },
			effect(x) { return x.mul(2.5).add(1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 2.5x+1';
				return text;
			},
		},
		12: {
			cost(x) { return new Decimal(44).pow(x).mul(10).add(85184) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Radiant Essence' },
			description: 'multiplies core gain (and essence gain at a reduced rate) based on the amount of this upgrade bought.',
			canAfford() { return player.e.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this) },
			effect(x) {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return [x.add(1).pow(2), x.add(1)];
				return [x.add(1), x.add(1).pow(0.25)];
			},
			effectDisplay(eff) {
				let text = format(eff[0]) + 'x<br>and ' + format(eff[1]) + 'x';
				if (options.nerdMode) {
					if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) text += '<br>formulas: (x+1)^2<br>and x+1';
					else text += '<br>formulas: x+1<br>and (x+1)^0.25';
				};
				return text;
			},
			unlocked() { return player.e.total.gte(85194) || getBuyableAmount("e", this.id).gt(0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		13: {
			cost(x) {
				if (player.mo.assimilating === this.layer) return new Decimal(10).pow(x.add(2));
				return new Decimal('e10000000').pow(x).mul('e750000000');
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Exponential Essence' },
			description: 'exponentiates essence gain multiplier based on the amount of this upgrade bought.',
			canAfford() { return player.e.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this) },
			effect(x) { return x.add(1).pow(player.mo.assimilating === this.layer ? 0.2 : 0.0025) },
			effectDisplay(eff) {
				let text = '^' + format(eff);
				if (options.nerdMode) {
					if (player.mo.assimilating === this.layer) text += '<br>formula: (x+1)^0.2';
					else text += '<br>formula: (x+1)^0.0025';
				};
				return text;
			},
			unlocked() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
	},
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Faster Points' },
			description: 'multiplies point gain by 1.5',
			cost: 1,
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Essence Influence' },
			description: 'multiplies point gain based on your essence',
			cost: 2,
			hardcap() {
				let hardcap = new Decimal("1e1750");
				if (new Decimal(tmp.r.effect[0]).gt(1) && !tmp.r.deactivated) hardcap = hardcap.mul(tmp.r.effect[0]);
				return hardcap;
			},
			effect() { return player.e.points.add(1).pow(0.5).min(this.hardcap()) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (eff.gte(this.hardcap())) text += ' (hardcapped)';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.5';
				return text;
			},
			unlocked() { return hasUpgrade("e", 11) },
		},
		13: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Influenced Essence' },
			description: 'multiplies essence gain based on your points',
			cost: 5,
			effect() { return player.points.add(1).pow(0.15) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.15';
				return text;
			},
			unlocked() { return hasUpgrade("e", 12) },
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Point Recursion' },
			description: 'multiplies point gain based on your points',
			cost: 500,
			effect() { return player.points.add(1).pow(0.075) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.075';
				return text;
			},
			unlocked() { return hasUpgrade("e", 13) },
		},
		22: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Essence of Essence' },
			description: 'multiplies essence gain based on your essence',
			cost: 1250,
			effect() { return player.e.points.add(1).pow(0.11111111111) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.11111111111';
				return text;
			},
			unlocked() { return hasUpgrade("e", 21) },
		},
		23: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Recurring Recursion' },
			description() { return 'boosts the effect of <b' + getColorClass(this, REF) + 'Point Recursion</b> based on your points' },
			cost: 3500,
			effect() { return player.points.add(1).pow(0.25) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.25';
				return text;
			},
			unlocked() { return hasUpgrade("e", 22) },
		},
		31: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Infinite Recursion' },
			description() { return 'boosts the effect of <b' + getColorClass(this, REF) + 'Recurring Recursion</b> based on your points' },
			cost: 1e11,
			effect() { return player.points.add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return (hasMilestone("q", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("e", 23) },
		},
		32: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Brilliance' },
			description() { return 'some of the effect of <b' + getColorClass(this, REF) + 'Radiant Essence</b> is applied to point gain (based on essence)' },
			cost: 3e33,
			effect() { return (buyableEffect("e", 12)[0] || newDecimalOne()).pow(0.1).mul(player.e.points).add(1).pow(0.001) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: ((x^0.1)y+1)^0.001';
				return text;
			},
			unlocked() { return (hasMilestone("q", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("e", 31) },
		},
		33: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Essence Network' },
			description() { return 'boosts the effect of <b' + getColorClass(this, REF) + 'Essence Influence</b> based on your essence' },
			cost: 5e55,
			effect() { return player.e.points.add(1).pow(0.025) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.025';
				return text;
			},
			unlocked() { return (hasMilestone("q", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("e", 32) },
		},
		41: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Essence Recursion' },
			description() { return 'boosts the effect of <b' + getColorClass(this, REF) + 'Essence of Essence</b> based on your essence' },
			cost: 7e77,
			effect() { return player.e.points.add(1).pow(0.001) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.001';
				return text;
			},
			unlocked() { return (hasMilestone("q", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("e", 33) },
		},
		42: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Essences to Infinity' },
			description() { return 'boosts the effect of <b' + getColorClass(this, REF) + 'Essence Recursion</b> based on your essence' },
			cost: 9e99,
			effect() { return player.e.points.add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return (hasMilestone("q", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("e", 41) },
		},
		43: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Essence of the Flow' },
			description: 'gain +2e22% of your essence gain per second',
			cost: '1e1111',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("e", 42) },
		},
	},
});

addLayer("c", {
	name: "Core",
	pluralName: "Cores",
	symbol: "C",
	row: 1,
	position: 0,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		auto_upgrades: false,
		auto_buyables: false,
	}},
	color: "#D2D237",
	branches: ["h"],
	requires: 10000,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "cores",
	baseResource: "essence",
	baseAmount() { return player.e.points },
	type: "normal",
	exponent: 0.3,
	gainMult() {
		// init
		let mult = newDecimalOne();
		// mul
		if (hasUpgrade("e", 32)) mult = mult.mul(upgradeEffect("e", 32));
		if (hasUpgrade("c", 12)) mult = mult.mul(upgradeEffect("c", 12));
		if (hasUpgrade("c", 42)) mult = mult.mul(upgradeEffect("c", 42));
		if (hasUpgrade("q", 21)) {
			mult = mult.mul(upgradeEffect("q", 21));
			if (hasUpgrade("q", 22)) mult = mult.mul(upgradeEffect("q", 22));
		};
		if (hasUpgrade("q", 33)) mult = mult.mul(upgradeEffect("q", 33));
		if (hasUpgrade("h", 13)) {
			mult = mult.mul(upgradeEffect("h", 13));
			if (hasUpgrade("h", 23)) {
				mult = mult.mul(upgradeEffect("h", 23));
				if (hasUpgrade("h", 33)) mult = mult.mul(upgradeEffect("h", 33));
		}};
		if (hasUpgrade("h", 24)) mult = mult.mul(3);
		if (hasUpgrade("h", 72)) mult = mult.mul(upgradeEffect("h", 72));
		if (hasUpgrade("m", 21)) mult = mult.mul(upgradeEffect("m", 21));
		if (hasBuyable("e", 12)) mult = mult.mul(buyableEffect("e", 12)[0]);
		if (hasBuyable("c", 13)) mult = mult.mul(buyableEffect("c", 13));
		if (hasUpgrade("ds", 21) && hasUpgrade("ds", 23)) mult = mult.mul(player.A.points.pow(2).div(100));
		if (new Decimal(tmp.w.effect[0]).gt(1) && !tmp.w.deactivated) mult = mult.mul(tmp.w.effect[0]);
		// div
		if (inChallenge("ds", 11)) mult = mult.div(100);
		if (inChallenge("ds", 21)) mult = mult.div(1e15);
		// pow
		if (hasUpgrade("c", 43)) mult = mult.pow(upgradeEffect("c", 43));
		if (hasBuyable("cl", 11)) mult = mult.pow(buyableEffect("cl", 11)[0]);
		if (hasBuyable("cl", 21)) mult = mult.pow(buyableEffect("cl", 21)[1]);
		// return
		return mult;
	},
	softcap: new Decimal("1e1250"),
	softcapPower: 0.7,
	hotkeys: [{key: "c", description: "C: Reset for cores", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	passiveGeneration() {
		let gen = 0;
		if (hasUpgrade("h", 43)) {
			gen += 0.01;
			if (hasUpgrade("h", 44)) {
				gen += 0.09;
				if (hasUpgrade("h", 52)) {
					gen += 0.15;
					if (hasUpgrade("c", 33)) {
						gen += 0.25;
		}}}};
		if (hasUpgrade("c", 41)) gen += upgradeEffect("c", 41).div(100).toNumber();
		if (hasUpgrade("pl", 14)) gen += 0.1;
		return gen;
	},
	automate() {
		if (hasMilestone("s", 1) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				buyUpgrade(this.layer, id);
			};
		};
		if (hasMilestone("s", 2) && player[this.layer].auto_buyables) {
			updateBuyableTemp(this.layer);
			for (const id in layers[this.layer].buyables) {
				buyBuyable(this.layer, id);
			};
		};
	},
	doReset(resettingLayer) {
		if (getActivatedRelics() >= 25 && resettingLayer == "r") return;
		if (hasMilestone("m", 4) && resettingLayer == "m") return;
		if (hasMilestone("gi", 2) && resettingLayer == "gi") return;
		if (hasMilestone("ei", 1) && resettingLayer == "ei") return;
		if (hasMilestone("w", 7) && resettingLayer == "w") return;
		if (hasMilestone("cl", 2) && resettingLayer == "cl") return;
		let keep = ["auto_upgrades", "auto_buyables"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (hasUpgrade("sp", 21) && resettingLayer == "sp") keep.push("buyables");
		if (hasUpgrade("sp", 22) && resettingLayer == "sp") keep.push("upgrades");
		if (hasUpgrade("sp", 23) && resettingLayer == "sp") keep.push("milestones");
		if (hasMilestone("h", 2) && resettingLayer == "h") keep.push("upgrades");
		if (hasMilestone("h", 3) && resettingLayer == "h") keep.push("buyables");
		if (hasMilestone("h", 4) && resettingLayer == "sp") keep.push("upgrades");
		if (hasMilestone("h", 4) && resettingLayer == "sp") keep.push("buyables");
		if (hasMilestone("h", 5) && resettingLayer == "h") keep.push("milestones");
		if (hasMilestone("h", 5) && resettingLayer == "sp") keep.push("milestones");
		if (hasMilestone("ds", 2) && resettingLayer == "ds") keep.push("milestones");
		if (hasMilestone("ds", 5) && resettingLayer == "ds") keep.push("upgrades");
		if (hasMilestone("ds", 6) && resettingLayer == "ds") keep.push("buyables");
		if (hasMilestone("a", 1) && resettingLayer == "a") keep.push("buyables");
		if (hasMilestone("a", 2) && resettingLayer == "a") keep.push("upgrades");
		if (hasMilestone("a", 4) && resettingLayer == "a") keep.push("milestones");
		if (hasMilestone("s", 25) && resettingLayer == "s") keep.push("milestones");
		if (layers[resettingLayer].row > this.row) layerDataReset("c", keep);
	},
	tabFormat: getTab("c"),
	milestones: (() => {
		let obj = {
			0: {
				requirement: 10,
				effectDescription: "keep essence upgrades on core resets",
			},
			1: {
				requirement: 25,
				effectDescription: "unlock core upgrades",
			},
			2: {
				requirement: 500,
				effectDescription: "keep essence rebuyables on core resets",
			},
			3: {
				requirement: 1e64,
				effectDescription: "gain 50% of your essence gain per second",
				unlocked() { return player.c.best.gte(1e60) || player.h.unlocked },
			},
		};
		const done = req => player.c.points.gte(req);
		for (const key in obj) {
			obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " cores";
			obj[key].done = done.bind(null, obj[key].requirement);
			delete obj[key].requirement;
		};
		return obj;
	})(),
	buyables: {
		11: {
			cost(x) {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return new Decimal(6).pow(x);
				return x.mul(2).add(1);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Empowered Points' },
			description: 'multiplies point gain based on the amount of this upgrade bought.',
			canAfford() { return player.c.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this) },
			effect(x) {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return new Decimal(2).add(buyableEffect("c", 13)).pow(x);
				return x.mul(5).add(1);
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) {
					if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) text += '<br>formula: 2^x';
					else text += '<br>formula: 5x+1';
				};
				return text;
			},
		},
		12: {
			cost(x) { return new Decimal(6).pow(x) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Empowered Essence' },
			description: 'multiplies essence gain based on the amount of this upgrade bought.',
			canAfford() { return player.c.points.gte(this.cost()) },
			purchaseLimit() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer ? 99 : 49 },
			buy() { buyStandardBuyable(this) },
			effect(x) { return new Decimal(2).add(buyableEffect("c", 13)).pow(x) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 2^x';
				return text;
			},
		},
		13: {
			cost(x) {
				if (player.mo.assimilating === this.layer) return new Decimal(1e5).pow(x.div(2).add(2));
				return new Decimal(1e20).pow(x.add(1));
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Empowered Cores' },
			description: 'increases the base of the previous two rebuyables based on the amount of this upgrade bought.',
			canAfford() { return player.c.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this) },
			effect(x) { return x.mul(0.05) },
			effectDisplay(eff) {
				let text = '+' + format(eff);
				if (options.nerdMode) text += '<br>formula: 0.05x';
				return text;
			},
			unlocked() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
	},
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Heat Emission' },
			description: 'multiplies essence gain based on your cores',
			cost: 25,
			effect() { return player.c.points.add(1).pow(0.2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.2';
				return text;
			},
			unlocked() { return hasMilestone("c", 1) },
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Core Countdown' },
			description: 'multiplies core gain based on your points',
			cost: 100,
			effect() { return player.points.add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasUpgrade("c", 11) },
		},
		13: {
			title() { return "<b" + getColorClass(this, TITLE) + "The Quarks' Core" },
			description: 'multiplies quark gain based on your cores',
			cost: 750,
			effect() { return player.c.points.add(1).pow(0.1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.1';
				return text;
			},
			unlocked() { return hasUpgrade("c", 12) },
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quarky Core' },
			description() { return "multiplies the effect of <b" + getColorClass(this, REF) + "The Quarks' Core</b> based on your cores" },
			cost: 1e69,
			effect() { return player.c.points.add(1).pow(0.005) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.005';
				return text;
			},
			unlocked() { return (hasMilestone("h", 8) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("c", 13) },
		},
		22: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quirky Core' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Quarky Core</b> based on your cores' },
			cost: 1e71,
			effect() { return player.c.points.add(1).pow(0.002) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.002';
				return text;
			},
			unlocked() { return (hasMilestone("h", 8) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("c", 21) },
		},
		23: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Super Core' },
			description: 'multiplies core gain based on your cores',
			cost: 1e73,
			effect() { return player.c.points.add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return (hasMilestone("h", 8) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("c", 22) },
		},
		31: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Ultra Core' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Super Core</b> based on your cores' },
			cost: 1e75,
			effect() { return player.c.points.add(1).pow(0.0025) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.0025';
				return text;
			},
			unlocked() { return (hasUpgrade("h", 53) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("c", 23) },
		},
		32: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Core of Cores' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Ultra Core</b> based on your cores' },
			cost: 1e77,
			effect() { return player.c.points.add(1).pow(0.001) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.001';
				return text;
			},
			unlocked() { return (hasUpgrade("h", 53) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("c", 31) },
		},
		33: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Core Liberation' },
			description() { return 'if you own <b' + getColorClass(this, REF, "h") + 'Core Production Line</b> and all subsequent upgrades, gain +25% of your core gain per second' },
			cost: 1e80,
			unlocked() { return (hasUpgrade("h", 53) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("c", 32) },
		},
		41: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Core of the Flow' },
			description: 'gain more of your core gain per second based on your cores',
			cost: 1e145,
			effect() { return player.c.points.add(1).log10().add(1).pow(13.3).min(1e36) },
			effectDisplay(eff) {
				let text = '+' + format(eff) + '%';
				if (eff.gte(1e36)) text += ' (maxed)';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^13.3';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("c", 33) },
		},
		42: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Core of Recursion' },
			description: 'multiplies core gain based on your cores',
			effect() { return  player.c.points.add(1).log10().add(1).pow(80) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^80';
				return text;
			},
			cost: 1e199,
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("c", 41) },
		},
		43: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Exponential Core' },
			description() { return 'exponentiates core gain multiplier by ^' + (player.mo.assimilating === this.layer ? '1.25' : '1.005') },
			cost: '1e480',
			effect() { return new Decimal(player.mo.assimilating === this.layer ? 1.25 : 1.005) },
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("c", 42) },
		},
	},
});

addLayer("q", {
	name: "Quark",
	pluralName: "Quarks",
	symbol: "Q",
	row: 1,
	position: 2,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		basePointTotal: newDecimalZero(),
		decipher: newDecimalZero(),
		insight: newDecimalZero(),
		auto_upgrades: false,
		auto_buyable_11: false,
		auto_buyable_12: false,
		auto_buyable_13: false,
		auto_buyable_21: false,
		auto_buyable_22: false,
		auto_buyable_23: false,
	}},
	color: "#DB5196",
	branches: ["sp"],
	requires: 1e9,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "quarks",
	baseResource: "essence",
	baseAmount() { return player.e.points },
	type: "normal",
	exponent: 0.1,
	gainMult() {
		// init
		let mult = newDecimalOne();
		// mul
		if (hasUpgrade("c", 13)) mult = mult.mul(upgradeEffect("c", 13));
		if (hasUpgrade("q", 11)) mult = mult.mul(upgradeEffect("q", 11));
		if (hasUpgrade("q", 21)) mult = mult.mul(upgradeEffect("q", 21));
		if (hasUpgrade("q", 22)) mult = mult.mul(upgradeEffect("q", 22));
		if (hasUpgrade("q", 12) && hasUpgrade("q", 23)) {
			mult = mult.mul(upgradeEffect("q", 23));
			if (hasUpgrade("q", 24)) {
				mult = mult.mul(upgradeEffect("q", 24));
				if (hasUpgrade("q", 25)) {
					mult = mult.mul(upgradeEffect("q", 25));
					if (hasUpgrade("q", 31)) mult = mult.mul(upgradeEffect("q", 31));
		}}};
		if (hasUpgrade("q", 42)) {
			mult = mult.mul(upgradeEffect("q", 42));
			if (hasUpgrade("q", 44)) mult = mult.mul(upgradeEffect("q", 44));
		};
		if (hasUpgrade("q", 45)) mult = mult.mul(upgradeEffect("q", 45));
		if (hasUpgrade("q", 52)) mult = mult.mul(upgradeEffect("q", 52));
		if (hasUpgrade("h", 34)) mult = mult.mul(2);
		if (hasUpgrade("a", 41)) mult = mult.mul(upgradeEffect("a", 41));
		if (hasUpgrade("m", 13)) mult = mult.mul(upgradeEffect("m", 13));
		if (hasBuyable("sp", 11)) mult = mult.mul(buyableEffect("sp", 11)[0]);
		if (hasUpgrade("ds", 21) && hasUpgrade("ds", 23)) mult = mult.mul(player.A.points.pow(2).div(100));
		if (new Decimal(tmp.w.effect[0]).gt(1) && !tmp.w.deactivated) mult = mult.mul(tmp.w.effect[0]);
		// div
		if (hasBuyable("sp", 13)) mult = mult.mul(buyableEffect("sp", 13)[1]);
		if (inChallenge("ds", 11)) mult = mult.div(10);
		if (inChallenge("ds", 22)) mult = mult.div(1e40);
		// return
		return mult;
	},
	softcap: new Decimal("1e1250"),
	softcapPower: 0.6,
	hotkeys: [{key: "q", description: "Q: Reset for quarks", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.c.unlocked || player.q.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	passiveGeneration() {
		let gen = 0;
		if (hasUpgrade("q", 51)) gen += 1e28;
		if (hasMilestone("a", 8)) gen += 0.01;
		if (hasMilestone("a", 9)) gen += 0.09;
		if (hasUpgrade("pl", 22)) gen += 0.1;
		return gen;
	},
	automate() {
		if (hasMilestone("s", 4) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				if (id < 60 || hasMilestone("ch", 20)) buyUpgrade(this.layer, id);
			};
		};
		updateBuyableTemp(this.layer);
		if (hasMilestone("ch", 16) && player.q.auto_buyable_11) buyBuyable("q", 11);
		if (hasMilestone("ch", 20) && player.q.auto_buyable_12) buyBuyable("q", 12);
		if (hasMilestone("ch", 22) && player.q.auto_buyable_13) buyBuyable("q", 13);
		if (hasMilestone("ch", 22) && player.q.auto_buyable_21) buyBuyable("q", 21);
		if (hasMilestone("ch", 46) && player.q.auto_buyable_22) buyBuyable("q", 22);
		if (hasMilestone("ch", 46) && player.q.auto_buyable_23) buyBuyable("q", 23);
	},
	doReset(resettingLayer) {
		if (getActivatedRelics() >= 30 && resettingLayer == "r") return;
		if (hasMilestone("m", 5) && resettingLayer == "m") return;
		if (hasMilestone("gi", 3) && resettingLayer == "gi") return;
		if (hasMilestone("ei", 2) && resettingLayer == "ei") return;
		if (hasMilestone("w", 9) && resettingLayer == "w") return;
		if (hasMilestone("cl", 5) && resettingLayer == "cl") return;
		let keep = ["auto_upgrades", "auto_buyable_11", "auto_buyable_12", "auto_buyable_13", "auto_buyable_21", "auto_buyable_22", "auto_buyable_23"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (hasMilestone("sp", 3) && resettingLayer == "sp") keep.push("milestones");
		if (hasMilestone("sp", 5) && resettingLayer == "sp") keep.push("upgrades");
		if (hasMilestone("h", 5) && resettingLayer == "h") keep.push("milestones");
		if (hasMilestone("h", 5) && resettingLayer == "sp") keep.push("milestones");
		if (hasMilestone("h", 6) && resettingLayer == "sp") keep.push("upgrades");
		if (hasMilestone("h", 7) && resettingLayer == "h") keep.push("upgrades");
		if (hasMilestone("ds", 2) && resettingLayer == "ds") keep.push("milestones");
		if (hasMilestone("ds", 7) && resettingLayer == "ds") keep.push("upgrades");
		if (hasMilestone("a", 1) && resettingLayer == "a") keep.push("upgrades");
		if (hasMilestone("a", 5) && resettingLayer == "a") keep.push("milestones");
		if (hasMilestone("s", 25) && resettingLayer == "s") keep.push("milestones");
		if (layers[resettingLayer].row > this.row) layerDataReset("q", keep);
	},
	update(diff) {
		if (tmp.q.tabFormat["The Decipherer"].unlocked) {
			// calculate gain
			let gain = newDecimalZero();
			if (hasBuyable("q", 11)) gain = gain.add(buyableEffect("q", 11));
			if (hasBuyable("q", 13)) gain = gain.mul(buyableEffect("q", 13));
			// calculate max decipher
			let maxDecipher = new Decimal(100);
			if (hasBuyable("q", 22)) maxDecipher = maxDecipher.mul(buyableEffect("q", 22));
			// update deciphered rate
			if (diff > 0) {
				if (hasUpgrade("q", 65)) player.q.decipher = player.q.decipher.mul(0.1 ** diff).add(gain.mul(diff));
				else player.q.decipher = player.q.decipher.mul(0.001 ** diff).add(gain.mul(diff));
			};
			if (player.q.decipher.gt(maxDecipher)) player.q.decipher = maxDecipher;
			// calculate insight
			let mul = newDecimalOne();
			if (hasBuyable("q", 21)) mul = mul.mul(buyableEffect("q", 21));
			player.q.insight = player.q.decipher.mul('1e1000').add(1).pow(0.1).sub(1).mul(mul).floor();
		} else {
			player.q.decipher = newDecimalZero();
			player.q.insight = newDecimalZero();
		};
		if (player.points.gt(player.q.basePointTotal)) player.q.basePointTotal = player.points;
	},
	tabFormat: {
		"Quark Central": {
			content: getTab("q"),
		},
		"The Decipherer": {
			content: getUnlockableTab("q", "The Decipherer"),
			unlocked() { return hasUpgrade("q", 61) },
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 5,
				effectDescription: "unlock 5 new essence upgrades",
			},
			1: {
				requirement: 50_000,
				effectDescription: "keep essence upgrades on quark resets",
			},
			2: {
				requirement: 250_000_000,
				effectDescription: "keep essence rebuyables on quark resets",
			},
		};
		const done = req => player.q.points.gte(req);
		for (const key in obj) {
			obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " quarks";
			obj[key].done = done.bind(null, obj[key].requirement);
			delete obj[key].requirement;
		};
		return obj;
	})(),
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'The Point of Quarks' },
			description: 'multiplies quark gain based on your points',
			cost: 1,
			effect() { return player.points.add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return text;
			},
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quark Power' },
			description: 'multiplies point gain based on your quarks',
			cost: 2,
			effect() { return player.q.points.add(1).pow(0.09) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.09';
				return text;
			},
			unlocked() { return hasUpgrade("q", 11) },
		},
		13: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Super Quarks' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Quark Power</b> based on your points' },
			cost: 25,
			effect() { return player.points.add(1).pow(0.0025) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.0025';
				return text;
			},
			unlocked() { return hasUpgrade("q", 12) },
		},
		14: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Essence of Quarks' },
			description() { return '<b' + getColorClass(this, REF) + 'Quark Power</b> also affects essence gain at a reduced rate (<b' + getColorClass(this, REF) + 'Super Quarks</b> does not affect this)' },
			cost: 100,
			effect() { return player.q.points.add(1).pow(0.2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.2';
				return text;
			},
			unlocked() { return hasUpgrade("q", 13) },
		},
		15: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quark Fusion' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Essence of Quarks</b> based on your cores' },
			cost: 750,
			effect() { return player.c.points.add(1).pow(0.02) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.02';
				return text;
			},
			unlocked() { return hasUpgrade("q", 14) },
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quirky Quarks' },
			description: 'multiplies core gain and quark gain based on your quarks',
			cost: 2500,
			effect() { return player.q.points.add(1).pow(0.05) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.05';
				return text;
			},
			unlocked() { return hasUpgrade("q", 15) },
		},
		22: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Very Quirky' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Quirky Quarks</b> based on your points' },
			cost: 7500,
			effect() { return player.points.add(1).pow(0.02) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.02';
				return text;
			},
			unlocked() { return hasUpgrade("q", 21) },
		},
		23: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quark Extreme' },
			description() { return '<b' + getColorClass(this, REF) + 'Quark Power</b> also affects quark gain at a reduced rate (<b' + getColorClass(this, REF) + 'Super Quarks</b> does not affect this)' },
			cost: 25000,
			effect() { return player.q.points.add(1).pow(0.1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.1';
				return text;
			},
			unlocked() { return hasUpgrade("q", 22) },
		},
		24: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Recurring Quarks' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Quark Extreme</b> based on your quarks' },
			cost: 100000,
			effect() { return player.q.points.add(1).pow(0.2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.2';
				return text;
			},
			unlocked() { return hasUpgrade("q", 23) },
		},
		25: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Recurring More' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Recurring Quarks</b> based on your quarks' },
			cost: 1500000,
			effect() { return player.q.points.add(1).pow(0.05) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.05';
				return text;
			},
			unlocked() { return hasUpgrade("q", 24) },
		},
		31: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Infinite Recur' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Recurring More</b> based on your quarks' },
			cost: 50000000,
			effect() { return player.q.points.add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasUpgrade("q", 25) },
		},
		32: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Compact Quarks' },
			description: 'multiplies essence gain based on your quarks',
			cost: 1e9,
			effect() { return player.q.points.add(1).pow(0.15) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.15';
				return text;
			},
			unlocked() { return hasUpgrade("q", 31) },
		},
		33: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quark Fission' },
			description: 'multiplies core gain based on your quarks',
			cost: 1e10,
			effect() { return player.q.points.add(1).pow(0.075) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.075';
				return text;
			},
			unlocked() { return hasUpgrade("q", 32) },
		},
		34: {
			title() { return '<b' + getColorClass(this, TITLE) + 'The Quark Count' },
			description: 'multiplies point gain based on your quarks',
			cost: 2.5e11,
			effect() { return player.q.points.add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasUpgrade("q", 33) },
		},
		35: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quark Counting' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'The Quark Count</b> based on your quarks' },
			cost: 1e13,
			effect() { return player.q.points.add(1).pow(0.015) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.015';
				return text;
			},
			unlocked() { return hasUpgrade("q", 34) },
		},
		41: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Ticking Quarks' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Quark Counting</b> based on your quarks' },
			cost: 1e14,
			effect() { return player.q.points.add(1).pow(0.005) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.005';
				return text;
			},
			unlocked() { return (hasMilestone("sp", 2) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 35) },
		},
		42: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Subatomic Quarks' },
			description: 'multiplies quark gain based on your subatomic particles',
			cost: 1e16,
			effect() {
				if (player.mo.assimilating === this.layer) return newDecimalOne();
				return player.sp.points.add(1).pow(0.5);
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.5';
				return text;
			},
			unlocked() { return (hasMilestone("sp", 2) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 41) },
		},
		43: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quirky Particles' },
			description: 'multiplies subatomic particle gain based on your quarks',
			cost: 1e18,
			effect() { return player.q.points.add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return (hasMilestone("sp", 2) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 42) },
		},
		44: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Particle Quarks' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Subatomic Quarks</b> based on your quarks' },
			cost: 1e20,
			effect() { return player.q.points.add(1).pow(0.005) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.005';
				return text;
			},
			unlocked() { return (hasMilestone("sp", 2) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 43) },
		},
		45: {
			title() { return '<b' + getColorClass(this, TITLE) + 'The Ultra Quark' },
			description: 'multiplies quark gain based on your quarks',
			cost: 1e22,
			effect() { return player.q.points.add(1).pow(0.125) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.125';
				return text;
			},
			unlocked() { return (hasMilestone("sp", 2) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 44) },
		},
		51: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quark of the Flow' },
			description: 'gain +1e30% of your quark gain per second',
			cost: '1e825',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 45) },
		},
		52: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Mystery Quark' },
			description() { return 'multiplies quark gain based on your ' + getGlitchDecipherText() },
			cost: '1e1048',
			effect() {
				if (hasUpgrade("q", 54)) return getGlitch().pow(12.5);
				return getGlitch().pow(5);
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: ???';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 51) },
		},
		53: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Valued Mystery' },
			description() { return 'multiplies ' + getGlitchDecipherText() + ' value by 10 and frequency by 2' },
			cost: '1e1145',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 52) },
		},
		54: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Bigger Mystery' },
			description() { return 'multiplies <b' + getColorClass(this, REF) + 'Mystery Quark</b> effect exponent by 2.5 and divides ' + getGlitchDecipherText() + ' frequency by 2' },
			cost: '1e1171',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 53) },
		},
		55: {
			title() { return '<b' + getColorClass(this, TITLE) + 'What\'s the Point?' },
			description() { return 'multiplies point gain based on your ' + getGlitchDecipherText() },
			cost: '1e1295',
			effect() { return getGlitch().pow(21) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: ???';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 54) },
		},
		61: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Purge the Mystery' },
			description() { return 'unlocks <b' + getColorClass(this, REF) + 'The Decipherer</b>,<br>a new tab' },
			cost: 'e8.325e10',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("q", 55) },
		},
		62: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Optimizing' },
			description() { return 'increases the ' + getGlitchDecipherText() + ' rounding element by 2.5, and improves the <b' + getColorClass(this, REF) + 'Sample Quarks</b> effect formula' },
			cost: 'e8.333e10',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasMilestone("ch", 11) && hasUpgrade("q", 61) },
		},
		63: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Estimation on Point' },
			description() { return 'exponentiates point gain multiplier based on your ' + getGlitchDecipherText() },
			cost: 'e8.34e10',
			effect() { return getGlitch().log10().add(1).pow(0.05) },
			effectDisplay(eff) {
				let text = '^' + format(eff);
				if (options.nerdMode) text += '<br>formula: ???';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasMilestone("ch", 11) && hasUpgrade("q", 62) },
		},
		64: {
			title() { return '<b' + getColorClass(this, TITLE) + 'More Optimal' },
			description() { return 'multiplies ' + getGlitchDecipherText() + ' value by 2.5, and improves the <b' + getColorClass(this, REF) + 'Sample Quarks</b> effect formula' },
			cost: 'e1.091e11',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasMilestone("ch", 11) && hasUpgrade("q", 63) },
		},
		65: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Mystery Surge' },
			description() { return 'multiplies ' + getGlitchDecipherText() + ' frequency by 2, increases the ' + getGlitchDecipherText() + ' rounding element by 2.5, and increases decay factor to 0.1' },
			cost: 'e1.0945e11',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasMilestone("ch", 11) && hasUpgrade("q", 64) },
		},
	},
	buyables: {
		11: {
			cost(x) {
				if (player.h.limitsBroken >= 3) return new Decimal(2).pow(new Decimal(1.3).pow(x));
				return new Decimal('e2.5e9').pow(x).mul('e1e10');
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Sample Quarks' },
			description() { return 'increases deciphering based on the amount of this upgrade bought. becomes less effective based on your ' + getGlitchDecipherText() + '.' },
			canAfford() { return player.q.points.gte(this.cost()) },
			purchaseLimit() { return player.h.limitsBroken >= 3 ? 1000 : 99 },
			buy() { buyStandardBuyable(this, "q", 'points', getQuarkBuyableBulk(), true) },
			effect(x) {
				if (hasUpgrade("q", 64)) return new Decimal(100).pow(x).div(getGlitch(true).pow(92))
				if (hasUpgrade("q", 62)) return new Decimal(100).pow(x).div(getGlitch(true).pow(97.25))
				return new Decimal(100).pow(x).div(getGlitch(true).pow(100));
			},
			effectDisplay(eff) {
				let text = '+' + format(eff) + '%';
				if (options.nerdMode) text += '<br>formula: (100^x)/y';
				return text;
			},
			unlocked() { return hasUpgrade("q", 61) },
		},
		12: {
			cost(x) {
				let div = newDecimalOne();
				if (x.eq(29)) div = div.mul(1.8);
				return new Decimal(2).pow(x).div(div);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Atomic Insight' },
			description: 'multiplies atom gain based on your insight and the amount of this upgrade bought.',
			canAfford() { return player.q.insight.gte(this.cost()) },
			purchaseLimit() {
				let limit = 99;
				if (hasMilestone("ch", 30)) limit += 101;
				if (hasMilestone("ch", 31)) limit += 800;
				return limit;
			},
			buy() { player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(getQuarkBuyableBulk()).min(tmp[this.layer].buyables[this.id].purchaseLimit) },
			effect(x) {
				if (x.eq(0)) return newDecimalOne();
				return player.q.insight.add(1).pow(0.1).mul(new Decimal(10).pow(x));
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: ((x+1)^0.1)(10^y)';
				return text;
			},
			costDisplay(cost) { return 'Req: ' + formatWhole(cost) + ' insight' },
			unlocked() { return hasUpgrade("q", 61) },
		},
		13: {
			cost(x) { return new Decimal(10).pow(new Decimal(10).pow(x)) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Analyze Essence' },
			description: 'multiplies deciphering based on the amount of this upgrade bought.',
			canAfford() { return player.e.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this, "e", 'points', getQuarkBuyableBulk(), true) },
			effect(x) { return new Decimal(10).pow(x) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 10^x';
				return text;
			},
			currencyDisplayName: 'essence',
			unlocked() { return hasUpgrade("q", 61) },
		},
		21: {
			cost(x) { return new Decimal(5).pow(x) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Insight Into Insight' },
			description: 'multiplies insight gain based on the amount of this upgrade bought.',
			canAfford() { return player.q.insight.gte(this.cost()) },
			purchaseLimit() {
				let limit = 99;
				if (hasMilestone("ch", 30)) limit += 101;
				if (hasMilestone("ch", 31)) limit += 800;
				return limit;
			},
			buy() { player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(getQuarkBuyableBulk()).min(tmp[this.layer].buyables[this.id].purchaseLimit) },
			effect(x) { return new Decimal(1.25).pow(x).add(x.pow(2.15)) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 1.25^x + x^2.15';
				return text;
			},
			costDisplay(cost) { return 'Req: ' + formatWhole(cost) + ' insight' },
			unlocked() { return hasMilestone("ch", 11) && hasUpgrade("q", 61) },
		},
		22: {
			cost(x) {
				if (hasMilestone('ch', 49)) return new Decimal(10).pow(new Decimal(10).pow(x.div(2).add(60)));
				return new Decimal(10).pow(new Decimal(1e6).pow(x));
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Knowledge Expansion' },
			description: 'multiplies maximum deciphering based on the amount of this upgrade bought.',
			canAfford() { return hasBuyable(this.layer, this.id) ? player.points.gte(this.cost()) : player.q.decipher.gte(100) },
			purchaseLimit: 99,
			buy() {
				if (hasBuyable(this.layer, this.id)) buyStandardBuyable(this, "", "points", getQuarkBuyableBulk());
				else addBuyables(this.layer, this.id, getQuarkBuyableBulk());
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].min(tmp[this.layer].buyables[this.id].purchaseLimit);
			},
			effect(x) { return new Decimal(1e10).pow(x) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 1e10^x';
				return text;
			},
			costDisplay(cost) {
				if (hasBuyable(this.layer, this.id)) return 'Cost: ' + formatWhole(cost) + ' points';
				return 'Req: 100% deciphered';
			},
			unlocked() { return hasMilestone("ch", 41) && hasUpgrade("q", 61) },
		},
		23: {
			cost(x) { return new Decimal(1e4).pow(x) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Chaotic Insight' },
			description: 'multiplies chaos gain based on the amount of this upgrade bought.',
			canAfford() { return player.q.insight.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(getQuarkBuyableBulk()).min(tmp[this.layer].buyables[this.id].purchaseLimit) },
			effect(x) { return new Decimal(1.001).pow(x) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 1.001^x';
				return text;
			},
			costDisplay(cost) { return 'Req: ' + formatWhole(cost) + ' insight' },
			unlocked() { return hasMilestone("ch", 41) && hasUpgrade("q", 61) },
		},
	},
});

addLayer("sp", {
	name: "Subatomic Particle",
	pluralName: "Subatomic Particles",
	symbol: "SP",
	row: 2,
	position: 2,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		auto_upgrades: false,
		auto_buyables: false,
	}},
	color: "#710CC4",
	branches: ["a"],
	requires: 1e15,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "subatomic particles",
	baseResource: "quarks",
	baseAmount() { return player.q.points },
	type: "static",
	exponent: 4.25,
	canBuyMax() { return hasMilestone("sp", 0) || player.w.unlocked || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
	gainExp() {
		// init
		let gain = newDecimalOne();
		// mul
		if (hasUpgrade("q", 43)) gain = gain.mul(upgradeEffect("q", 43));
		if (hasUpgrade("sp", 31)) gain = gain.mul(2.5);
		if (hasUpgrade("h", 63)) gain = gain.mul(upgradeEffect("h", 63));
		if (hasUpgrade("a", 22)) gain = gain.mul(upgradeEffect("a", 22));
		if (hasUpgrade("a", 31)) gain = gain.mul(upgradeEffect("a", 31));
		if (hasBuyable("ds", 11)) gain = gain.mul(buyableEffect("ds", 11)[1]);
		if (hasBuyable("d", 21)) gain = gain.mul(buyableEffect("d", 21)[1]);
		if (hasUpgrade("a", 51)) gain = gain.mul(player.A.points.pow(2.5).div(100));
		if (hasChallenge("ds", 21)) gain = gain.mul(challengeEffect("ds", 21));
		if (new Decimal(tmp.w.effect[0]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[0]);
		// div
		if (inChallenge("ds", 12)) gain = gain.mul(player.q.points.pow(-0.05));
		if (inChallenge("ds", 22)) gain = gain.div(1e40);
		// pow
		if (hasUpgrade("sp", 31) && player.mo.assimilating !== this.layer) gain = gain.pow(3.36);
		if (hasBuyable("cl", 13)) gain = gain.pow(buyableEffect("cl", 13)[0]);
		// return
		return gain;
	},
	autoPrestige() { return hasMilestone("s", 11) || hasUpgrade("pl", 24) },
	hotkeys: [{key: "S", description: "Shift-S: Reset for subatomic particles", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.q.unlocked || player.sp.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	automate() {
		if (hasMilestone("m", 4) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				buyUpgrade(this.layer, id);
			};
		};
		if (hasMilestone("m", 4) && player[this.layer].auto_buyables) {
			updateBuyableTemp(this.layer);
			for (const id in layers[this.layer].buyables) {
				buyBuyable(this.layer, id);
			};
		};
	},
	doReset(resettingLayer) {
		if (getActivatedRelics() >= 35 && resettingLayer == "r") return;
		let keep = ["auto_upgrades", "auto_buyables"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (hasMilestone("ds", 0) && resettingLayer == "ds") keep.push("buyables");
		if (hasMilestone("ds", 1) && resettingLayer == "ds") keep.push("upgrades");
		if (hasMilestone("a", 0) && resettingLayer == "a") keep.push("buyables");
		if (hasMilestone("a", 3) && resettingLayer == "a") keep.push("upgrades");
		if (hasMilestone("a", 13) && resettingLayer == "a") keep.push("milestones");
		if (layers[resettingLayer].row > this.row) layerDataReset("sp", keep);
	},
	resetsNothing() { return hasMilestone("s", 11) || hasUpgrade("sp", 31) || hasUpgrade("pl", 24) },
	tabFormat: getTab("sp"),
	milestones: (() => {
		let obj = {
			0: { effectDescription: "you can buy max subatomic particles" },
			1: { effectDescription: "keep essence upgrades on subatomic particle resets" },
			2: { effectDescription: "unlock 5 new quark upgrades" },
			3: { effectDescription: "keep quark milestones on subatomic particle resets" },
			4: { effectDescription: "keep essence rebuyables on subatomic particle resets" },
			5: { effectDescription: "keep quark upgrades on subatomic particle resets" },
		};
		const done = req => player.sp.points.gte(req);
		for (const key in obj) {
			const requirement = (+key) + 1;
			obj[key].requirementDescription = simpleFormatWhole(requirement) + " subatomic particle" + (requirement === 1 ? "" : "s");
			obj[key].done = done.bind(null, requirement);
		};
		return obj;
	})(),
	buyables: {
		11: {
			cost(x) { return x.add(1) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Protons' },
			description: 'multiplies quark gain (but also decreases essence gain at a reduced rate) based on the amount of this upgrade bought.',
			canAfford() { return player.sp.points.gte(this.cost()) },
			purchaseLimit() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer ? 99 : 9 },
			buy() { buyStandardBuyable(this) },
			effect(x) {
				if (hasUpgrade("sp", 21)) return [new Decimal(5).pow(x).pow(4), newDecimalOne().div(x.add(1))];
				if (hasUpgrade("sp", 11)) return [new Decimal(5).pow(x).pow(2), newDecimalOne().div(x.add(1))];
				return [new Decimal(5).pow(x), newDecimalOne().div(x.add(1))];
			},
			effectDisplay(eff) {
				let text = format(eff[0]) + 'x<br>and ' + format(eff[1]) + 'x';
				if (options.nerdMode) {
					if (hasUpgrade("sp", 21)) text += '<br>formulas: (5^x)^4<br>and 1/(x+1)';
					else if (hasUpgrade("sp", 11)) text += '<br>formulas: (5^x)^2<br>and 1/(x+1)';
					else text += '<br>formulas: 5^x and 1/(x+1)';
				};
				return text;
			},
		},
		12: {
			cost(x) { return x.add(1) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Neutrons' },
			description: 'multiplies essence gain (but also decreases point gain at a reduced rate) based on the amount of this upgrade bought.',
			canAfford() { return player.sp.points.gte(this.cost()) },
			purchaseLimit() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer ? 99 : 9 },
			buy() { buyStandardBuyable(this) },
			effect(x) {
				if (hasUpgrade("sp", 22)) return [new Decimal(5).pow(x).pow(4), newDecimalOne().div(x.add(1))];
				if (hasUpgrade("sp", 12)) return [new Decimal(5).pow(x).pow(2), newDecimalOne().div(x.add(1))];
				return [new Decimal(5).pow(x), newDecimalOne().div(x.add(1))];
			},
			effectDisplay(eff) {
				let text = format(eff[0]) + 'x<br>and ' + format(eff[1]) + 'x';
				if (options.nerdMode) {
					if (hasUpgrade("sp", 22)) text += '<br>formulas: (5^x)^4<br>and 1/(x+1)';
					else if (hasUpgrade("sp", 12)) text += '<br>formulas: (5^x)^2<br>and 1/(x+1)';
					else text += '<br>formulas: 5^x and 1/(x+1)';
				};
				return text;
			},
		},
		13: {
			cost(x) { return x.add(1) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Electrons' },
			description: 'multiplies point gain (but also decreases quark gain at a reduced rate) based on the amount of this upgrade bought.',
			canAfford() { return player.sp.points.gte(this.cost()) },
			purchaseLimit() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer ? 99 : 9 },
			buy() { buyStandardBuyable(this) },
			effect(x) {
				if (hasUpgrade("sp", 23)) return [new Decimal(5).pow(x).pow(4), newDecimalOne().div(x.add(1))];
				if (hasUpgrade("sp", 13)) return [new Decimal(5).pow(x).pow(2), newDecimalOne().div(x.add(1))];
				return [new Decimal(5).pow(x), newDecimalOne().div(x.add(1))];
			},
			effectDisplay(eff) {
				let text = format(eff[0]) + 'x<br>and ' + format(eff[1]) + 'x';
				if (options.nerdMode) {
					if (hasUpgrade("sp", 23)) text += '<br>formulas: (5^x)^4<br>and 1/(x+1)';
					else if (hasUpgrade("sp", 13)) text += '<br>formulas: (5^x)^2<br>and 1/(x+1)';
					else text += '<br>formulas: 5^x and 1/(x+1)';
				};
				return text;
			},
		},
	},
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Positrons' },
			description() { return 'squares the positive effect of <b' + getColorClass(this, REF) + 'Protons' },
			cost: 6,
			unlocked() { return hasUpgrade("h", 53) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Beta Particles' },
			description() { return 'squares the positive effect of <b' + getColorClass(this, REF) + 'Neutrons' },
			cost: 6,
			unlocked() { return hasUpgrade("h", 53) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		13: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Gamma Particles' },
			description() { return 'squares the positive effect of <b' + getColorClass(this, REF) + 'Electrons' },
			cost: 6,
			unlocked() { return hasUpgrade("h", 53) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Proton Decay' },
			description() { return 'squares the positive effect of <b' + getColorClass(this, REF) + 'Protons</b>, and keep core rebuyables on subatomic particle resets' },
			cost: 32000,
			unlocked() { return hasUpgrade("sp", 11) && (isAssimilated(this.layer) || player.mo.assimilating === this.layer) },
		},
		22: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Neutron Decay' },
			description() { return 'squares the positive effect of <b' + getColorClass(this, REF) + 'Neutrons</b>, and keep core upgrades on subatomic particle resets' },
			cost: 68000,
			unlocked() { return hasUpgrade("sp", 12) && (isAssimilated(this.layer) || player.mo.assimilating === this.layer) },
		},
		23: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Electron Decay' },
			description() { return 'squares the positive effect of <b' + getColorClass(this, REF) + 'Electrons</b>, and keep core milestones on subatomic particle resets' },
			cost: 76000,
			unlocked() { return hasUpgrade("sp", 13) && (isAssimilated(this.layer) || player.mo.assimilating === this.layer) },
		},
		31: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Particle of the Flow' },
			description() {
				if (player.mo.assimilating === this.layer) return 'multiplies subatomic particle gain by 2.5x and subatomic particles reset nothing';
				return 'multiplies subatomic particle gain by 2.5x, exponentiates subatomic particle gain multiplier by ^3.36, and subatomic particles reset nothing';
			},
			cost() { return player.mo.assimilating === this.layer ? 88888 : 'e2.66e9' },
			style: {width: '150px', height: '150px'},
			unlocked() { return hasUpgrade("sp", 21) && hasUpgrade("sp", 22) && hasUpgrade("sp", 23) && (isAssimilated(this.layer) || player.mo.assimilating === this.layer) },
		},
	},
});

addLayer("h", {
	name: "Hex",
	pluralName: "Hexes",
	symbol: "H",
	row: 2,
	position: 0,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		limitsBroken: 0,
		auto_upgrades: false,
		keep_breaking: false,
	}},
	color: "#E36409",
	branches: ["ds"],
	requires: 1e60,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "hexes",
	baseResource: "cores",
	baseAmount() { return player.c.points },
	type: "normal",
	exponent: 0.5,
	gainMult() {
		// init
		let mult = newDecimalOne();
		// mul
		if (hasUpgrade("h", 12)) {
			mult = mult.mul(upgradeEffect("h", 12));
			if (hasUpgrade("h", 22)) {
				mult = mult.mul(upgradeEffect("h", 22));
				if (hasUpgrade("h", 32)) {
					mult = mult.mul(upgradeEffect("h", 32));
					if (hasUpgrade("h", 42)) mult = mult.mul(upgradeEffect("h", 42));
		}}};
		if (hasUpgrade("h", 14)) mult = mult.mul(4);
		if (hasUpgrade("h", 62)) mult = mult.mul(upgradeEffect("h", 62));
		if (hasUpgrade("h", 71)) mult = mult.mul(upgradeEffect("h", 71));
		if (hasUpgrade("h", 11) && hasUpgrade("ds", 11)) mult = mult.mul(upgradeEffect("h", 11));
		if (hasUpgrade("p", 12)) mult = mult.mul(1.05);
		if (hasUpgrade("m", 23)) mult = mult.mul(upgradeEffect("m", 23));
		if (hasBuyable("ds", 11)) mult = mult.mul(buyableEffect("ds", 11)[0]);
		if (hasChallenge("ds", 11)) mult = mult.mul(challengeEffect("ds", 11));
		if (new Decimal(tmp.w.effect[0]).gt(1) && !tmp.w.deactivated) mult = mult.mul(tmp.w.effect[0]);
		// div
		if (inChallenge("ds", 11)) mult = mult.div(1_000);
		if (inChallenge("ds", 12)) mult = mult.div(1e10);
		if (inChallenge("ds", 21)) mult = mult.div(100_000);
		// special nerf
		if (inChallenge("ds", 31)) mult = mult.pow(-1);
		// return
		return mult;
	},
	softcap() {
		if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return new Decimal("1e100");
		return new Decimal("1e1000");
	},
	softcapPower() {
		if (hasChallenge("ds", 31)) return 0.55;
		if (hasUpgrade("ds", 31)) return 0.52;
		if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return 0.51;
		return 0.5;
	},
	hotkeys: [{key: "h", description: "H: Reset for hexes", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.sp.unlocked || player.h.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	passiveGeneration() {
		let gen = 0;
		if (hasUpgrade("h", 74)) gen += 6e64;
		if (hasMilestone("s", 9)) gen += 0.001;
		if (hasUpgrade("pl", 32)) gen += 0.1;
		return gen;
	},
	automate() {
		if (hasMilestone("m", 1) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				if (id < (hasMilestone("ch", 23) ? 90 : 80)) buyUpgrade(this.layer, id);
			};
		};
	},
	doReset(resettingLayer) {
		if (getActivatedRelics() >= 27 && resettingLayer == "r") return;
		if (hasMilestone("m", 13) && resettingLayer == "m") return;
		if (hasMilestone("gi", 4) && resettingLayer == "gi") return;
		let keep = ["auto_upgrades", "keep_breaking"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (hasMilestone("ds", 8) && resettingLayer == "ds") keep.push("milestones");
		if (hasMilestone("a", 6) && resettingLayer == "a") keep.push("milestones");
		if (hasMilestone("a", 11) && (resettingLayer == "a" || resettingLayer == "ds")) keep.push("upgrades");
		if (hasMilestone("ch", 15) && resettingLayer == "ch" && player.h.keep_breaking) keep.push("limitsBroken");
		if (layers[resettingLayer].row < 6) keep.push("limitsBroken");
		if (layers[resettingLayer].row > this.row) layerDataReset("h", keep);
	},
	tabFormat: {
		"Classic Hexes": {
			content: getTab("h"),
		},
		"The Breaker": {
			content: getUnlockableTab("h", "The Breaker"),
			unlocked() { return hasUpgrade("h", 81) },
		},
	},
	milestones: (() => {
		let obj = {
			0: { effectDescription: "keep essence upgrades on hex resets" },
			1: { effectDescription: "keep essence rebuyables on hex resets" },
			2: { effectDescription: "keep core upgrades on hex resets" },
			3: { effectDescription: "keep core rebuyables on hex resets" },
			4: { effectDescription: "keep core upgrades and rebuyables on subatomic particle resets" },
			5: { effectDescription: "keep all row 2 milestones on row 3 resets" },
			6: { effectDescription: "keep quark upgrades on subatomic particle resets" },
			7: { effectDescription: "keep quark upgrades on hex resets" },
			8: { effectDescription: "unlock 3 new core upgrades" },
		};
		const done = req => player.h.points.gte(req);
		for (const key in obj) {
			const requirement = 5 ** ((+key) + 1);
			obj[key].requirementDescription = simpleFormatWhole(requirement) + " hexes";
			obj[key].done = done.bind(null, requirement);
		};
		return obj;
	})(),
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hex Leak' },
			description() {
				if (hasUpgrade("ds", 11)) return 'multiplies point and hex gain based on your hexes';
				return 'multiplies point gain based on your hexes';
			},
			cost: 1,
			effect() { return  player.h.points.add(1).pow(0.005) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (hasUpgrade("ds", 11)) text += '<br>and ' + format(eff) + 'x';
				if (options.nerdMode) {
					if (hasUpgrade("ds", 11)) text += '<br>formula (for both): (x+1)^0.005';
					else text += '<br>formula: (x+1)^0.005';
				};
				return text;
			},
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Stronger Hexes' },
			description: 'multiplies hex gain based on your hexes',
			cost: 5,
			effect() {
				if (hasUpgrade("ds", 12)) return player.h.points.add(1).pow(0.1).pow(2);
				return player.h.points.add(1).pow(0.1);
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) {
					if (hasUpgrade("ds", 12)) text += '<br>formula: (x+1)^0.1^2';
					else text += '<br>formula: (x+1)^0.1';
				};
				return text;
			},
		},
		13: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hex Fusion' },
			description: 'multiplies core gain based on your hexes',
			cost: 10,
			effect() { return player.h.points.add(1).pow(0.09) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.09';
				return text;
			},
		},
		14: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Boost Hexes' },
			description: 'quadruples hex gain',
			cost: 25,
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Numerical Hexes' },
			description() {
				if (hasUpgrade("ds", 11)) return 'multiplies the first effect of <b' + getColorClass(this, REF) + 'Hex Leak</b> based on your hexes';
				return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Hex Leak</b> based on your hexes';
			},
			cost: 1000,
			effect() { return player.h.points.add(1).pow(0.025) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.025';
				return text;
			},
			unlocked() { return hasUpgrade("h", 11) && hasUpgrade("h", 12) && hasUpgrade("h", 13) && hasUpgrade("h", 14) },
		},
		22: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Super Strong Hexes' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Stronger Hexes</b> based on your hexes' },
			cost: 5000,
			effect() { return player.h.points.add(1).pow(0.05) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.05';
				return text;
			},
			unlocked() { return hasUpgrade("h", 11) && hasUpgrade("h", 12) && hasUpgrade("h", 13) && hasUpgrade("h", 14) },
		},
		23: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hex Fission' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Hex Fusion</b> based on your hexes' },
			cost: 10000,
			effect() { return player.h.points.add(1).pow(0.15) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.15';
				return text;
			},
			unlocked() { return hasUpgrade("h", 11) && hasUpgrade("h", 12) && hasUpgrade("h", 13) && hasUpgrade("h", 14) },
		},
		24: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Boost Cores' },
			description: 'triples core gain',
			cost: 25000,
			unlocked() { return hasUpgrade("h", 11) && hasUpgrade("h", 12) && hasUpgrade("h", 13) && hasUpgrade("h", 14) },
		},
		31: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hex Numerals' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Numerical Hexes</b> based on your points' },
			cost: 100000,
			effect() { return player.points.add(1).pow(0.002) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.002';
				return text;
			},
			unlocked() { return hasUpgrade("h", 21) && hasUpgrade("h", 22) && hasUpgrade("h", 23) && hasUpgrade("h", 24) },
		},
		32: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Extreme Hexes' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Super Strong Hexes</b> based on your hexes' },
			cost: 500000,
			effect() { return player.h.points.add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return text;
			},
			unlocked() { return hasUpgrade("h", 21) && hasUpgrade("h", 22) && hasUpgrade("h", 23) && hasUpgrade("h", 24) },
		},
		33: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Core of Hexes' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Hex Fission</b> based on your cores' },
			cost: 1000000,
			effect() { return player.h.points.add(1).pow(0.025) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.025';
				return text;
			},
			unlocked() { return hasUpgrade("h", 21) && hasUpgrade("h", 22) && hasUpgrade("h", 23) && hasUpgrade("h", 24) },
		},
		34: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Boost Quarks' },
			description: 'doubles quark gain',
			cost: 2500000,
			unlocked() { return hasUpgrade("h", 21) && hasUpgrade("h", 22) && hasUpgrade("h", 23) && hasUpgrade("h", 24) },
		},
		41: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Numero Hex' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Hex Numerals</b> based on your hexes' },
			cost: 7500000,
			effect() { return  player.points.add(1).pow(0.0001) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.0001';
				return text;
			},
			unlocked() { return hasUpgrade("h", 31) && hasUpgrade("h", 32) && hasUpgrade("h", 33) && hasUpgrade("h", 34) },
		},
		42: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Ultra Hexes' },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Extreme Hexes</b> based on your hexes' },
			cost: 15000000,
			effect() { return  player.h.points.add(1).pow(0.001) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.001';
				return text;
			},
			unlocked() { return hasUpgrade("h", 31) && hasUpgrade("h", 32) && hasUpgrade("h", 33) && hasUpgrade("h", 34) },
		},
		43: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Core Continuation' },
			description: 'gains 1% of core gain per second',
			cost: 45000000,
			unlocked() { return hasUpgrade("h", 31) && hasUpgrade("h", 32) && hasUpgrade("h", 33) && hasUpgrade("h", 34) },
		},
		44: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Rapid Cores' },
			description() { return 'increases the effect of <b' + getColorClass(this, REF) + 'Core Continuation</b> by 9% (total: 10%)' },
			cost: 75000000,
			unlocked() { return hasUpgrade("h", 31) && hasUpgrade("h", 32) && hasUpgrade("h", 33) && hasUpgrade("h", 34) },
		},
		51: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Faster Essence' },
			description() { return 'increases essence gain per second by 25% if you have the <b' + getColorClass(this, REF, "c") + '1e64 cores milestone</b> (total: 75%)' },
			cost: 9e90,
			unlocked() { return (hasUpgrade("ds", 11) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("h", 41) && hasUpgrade("h", 42) && hasUpgrade("h", 43) && hasUpgrade("h", 44) },
		},
		52: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Core Production Line' },
			description() { return 'increases the effect of <b' + getColorClass(this, REF) + 'Rapid Cores</b> by 15% (total: 25%)' },
			cost: 250000000,
			unlocked() { return hasUpgrade("h", 41) && hasUpgrade("h", 42) && hasUpgrade("h", 43) && hasUpgrade("h", 44) },
		},
		53: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Sub Core Particle Fusion' },
			description: 'unlock 3 new core upgrades and 3 new subatomic particle upgrades',
			cost: 7.5e9,
			unlocked() { return hasUpgrade("h", 41) && hasUpgrade("h", 42) && hasUpgrade("h", 43) && hasUpgrade("h", 44) },
		},
		54: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Fastest Essence' },
			description() { return 'increases the effect of <b' + getColorClass(this, REF) + 'Faster Essence</b> by 25% (total: 100%)' },
			cost: 9.5e95,
			unlocked() { return (hasUpgrade("ds", 11) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("h", 41) && hasUpgrade("h", 42) && hasUpgrade("h", 43) && hasUpgrade("h", 44) },
		},
		61: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Essence Overdrive' },
			description() { return 'increases the effect of <b' + getColorClass(this, REF) + 'Fastest Essence</b> by 25% (total: 125%)' },
			cost: 1e100,
			unlocked() { return (hasUpgrade("ds", 12) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("h", 51) && hasUpgrade("h", 52) && hasUpgrade("h", 53) && hasUpgrade("h", 54) },
		},
		62: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Sub Hex Particle' },
			description: 'multiplies hex gain based on your subatomic particles',
			cost: 1e50,
			effect() { return player.sp.points.add(1).pow(2.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^2.5';
				return text;
			},
			unlocked() { return hasUpgrade("h", 52) && hasUpgrade("h", 53) },
		},
		63: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hexed Subatomic Particle' },
			description: 'multiplies subatomic particle gain based on your hexes',
			cost: 6.66e66,
			effect() { return player.h.points.add(1).pow(0.02) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.02';
				return text;
			},
			unlocked() { return hasUpgrade("h", 52) && hasUpgrade("h", 53) },
		},
		64: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Potential Essence Potential' },
			description() { return 'increases the effect of <b' + getColorClass(this, REF) + 'Essence Overdrive</b> by 25% (total: 150%)' },
			cost: 1.11e111,
			unlocked() { return (hasUpgrade("ds", 12) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("h", 51) && hasUpgrade("h", 52) && hasUpgrade("h", 53) && hasUpgrade("h", 54) },
		},
		71: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hex the Hex' },
			description: 'multiplies hex gain based on your hexes',
			cost: '1e570',
			effect() { return player.h.points.add(1).log10().add(1).pow(75) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^75';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("h", 61) && hasUpgrade("h", 62) && hasUpgrade("h", 63) && hasUpgrade("h", 64) },
		},
		72: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hex the Core' },
			description: 'multiplies core gain based on your hexes',
			cost: '1e696',
			effect() { return player.h.points.add(1).log10().add(1).pow(250) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^250';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("h", 61) && hasUpgrade("h", 62) && hasUpgrade("h", 63) && hasUpgrade("h", 64) },
		},
		73: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hexes are the Point' },
			description: 'multiplies point gain based on your hexes',
			cost: '1e870',
			effect() { return player.h.points.add(1).log10().add(1).pow(336) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^336';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("h", 61) && hasUpgrade("h", 62) && hasUpgrade("h", 63) && hasUpgrade("h", 64) },
		},
		74: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hex of the Flow' },
			description: 'gain +6e66% of your hex gain per second',
			cost: '1e977',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("h", 61) && hasUpgrade("h", 62) && hasUpgrade("h", 63) && hasUpgrade("h", 64) },
		},
		81: {
			title() { return '<b' + getColorClass(this, TITLE) + 'True Hexes' },
			description() { return 'Unlocks <b' + getColorClass(this, REF) + 'The Breaker</b>,<br>a new tab' },
			cost: 'e1.132e14',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("h", 71) && hasUpgrade("h", 72) && hasUpgrade("h", 73) && hasUpgrade("h", 74) },
		},
	},
	clickables: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'The Breaker' },
			display() {
				const nextNerf = format(this.nerfLayers[player.h.limitsBroken]);
				let text = 'Use to break a new limit. Using this will reset your evil influence, evil power, and evil influence upgrades. Additionally, it will divide evil influence gain.<br><br>';
				if (player.h.limitsBroken === 0) {
					text += 'Next effect: break the limit of <b' + getColorClass(this, REF, "w") + 'Power of Good</b> and improve its effect formula, but its cost scales much faster. Also divide evil influence gain by /' + nextNerf + '.<br><br>Limits broken:<br>none so far';
				} else if (player.h.limitsBroken === 1) {
					text += 'Next effect: break the limit of <b' + getColorClass(this, REF, "cl") + 'Deeper Comprehension</b>, but its cost scales much faster. Also divide evil influence gain by /' + nextNerf + '.<br><br>Limits broken:<br><b' + getColorClass(this, REF, "w") + 'Power of Good</b>';
				} else if (player.h.limitsBroken === 2) {
					text += 'Next effect: break the limit of <b' + getColorClass(this, REF, "q") + 'Sample Quarks</b>, but its cost scales much faster. Also divide evil influence gain by /' + nextNerf + '.<br><br>Limits broken:<br><b' + getColorClass(this, REF, "w") + 'Power of Good</b><br><b' + getColorClass(this, REF, "cl") + 'Deeper Comprehension</b>';
				} else if (player.h.limitsBroken === 3) {
					text += 'Next effect: break the limit of <b' + getColorClass(this, REF, "gi") + 'Better Good</b>, but its cost scales much faster. Also divide evil influence gain by /' + nextNerf + '.<br><br>Limits broken:<br><b' + getColorClass(this, REF, "w") + 'Power of Good</b><br><b' + getColorClass(this, REF, "cl") + 'Deeper Comprehension</b><br><b' + getColorClass(this, REF, "q") + 'Sample Quarks</b>';
				} else {
					text += 'Next effect: you have broken all the limits!<br><br>Limits broken:<br><b' + getColorClass(this, REF, "w") + 'Power of Good</b><br><b' + getColorClass(this, REF, "cl") + 'Deeper Comprehension</b><br><b' + getColorClass(this, REF, "q") + 'Sample Quarks</b><br><b' + getColorClass(this, REF, "gi") + 'Better Good</b>';
				};
				text += '<br><br>Effect on evil influence gain: /' + format(tmp.h.clickables[11].nerf);
				text += '<br><br>Req: ' + formatWhole(tmp.h.clickables[11].req[0]) + ' achievements and ' + formatWhole(tmp.h.clickables[11].req[1]) + ' evil influence';
				text += '<br><br>Bought: ' + formatWhole(player.h.limitsBroken) + '/' + formatWhole(this.reqLayers.length);
				return text;
			},
			reqLayers: [79900, 33133, 20900, 22888],
			req() { return [92 + player.h.limitsBroken, this.reqLayers[player.h.limitsBroken] || Infinity] },
			nerfLayers: [100, 10, 2, 2],
			nerf() {
				let nerf = newDecimalOne();
				for (let index = 0; index < this.nerfLayers.length && index < player.h.limitsBroken; index++) {
					nerf = nerf.mul(this.nerfLayers[index]);
				};
				return nerf;
			},
			canClick() { return player.A.points.gte(tmp.h.clickables[11].req[0]) && player.ei.points.gte(tmp.h.clickables[11].req[1]) && player.h.limitsBroken < this.reqLayers.length && player.h.limitsBroken < this.nerfLayers.length },
			onClick() {
				player.ei.points = newDecimalZero();
				player.ei.best = newDecimalZero();
				player.ei.total = newDecimalZero();
				player.ei.power = newDecimalZero();
				player.ei.upgrades = [];
				player.h.limitsBroken++;
			},
			style() {
				let obj = {width: "300px", height: "300px"};
				if (player.h.limitsBroken >= this.reqLayers.length) {
					obj["background-color"] = "#77bf5f";
					obj.cursor = "default";
				};
				return obj;
			},
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Reset Breaking' },
			display() { return 'Breaking only resets on Assimilation and row 7+ resets. Click to reset Breaking and force a chaos reset.' },
			canClick() { return player.h.limitsBroken > 0 },
			onClick() {
				if (confirm('Are you sure you want to force a chaos reset to reset Breaking?')) {
					player.h.limitsBroken = 0;
					doReset("ch", true);
				};
			},
			style: {'min-height': '80px', width: '200px'},
		},
	},
});

addLayer("ds", {
	name: "Demon Soul",
	pluralName: "Demon Souls",
	symbol: "DS",
	row: 3,
	position: 0,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		threads: newDecimalZero(),
		threadGainBest: newDecimalZero(),
		auto_upgrades: false,
		auto_buyables: false,
	}},
	color: "#BA0035",
	branches: ["ei"],
	requires: 1e60,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "demon souls",
	baseResource: "hexes",
	baseAmount() { return player.h.points },
	type: "normal",
	exponent: 0.05,
	gainMult() {
		// init
		let mult = newDecimalOne();
		// mul
		if (hasUpgrade("ds", 31)) mult = mult.mul(upgradeEffect("ds", 31));
		if (hasUpgrade("a", 11)) mult = mult.mul(upgradeEffect("a", 11));
		if (hasUpgrade("a", 42)) mult = mult.mul(upgradeEffect("a", 42));
		if (hasUpgrade("a", 71)) mult = mult.mul(upgradeEffect("a", 71));
		if (hasUpgrade("m", 12)) mult = mult.mul(upgradeEffect("m", 12));
		if (hasUpgrade("m", 33)) mult = mult.mul(upgradeEffect("m", 33));
		if (hasChallenge("ds", 11)) mult = mult.mul(challengeEffect("ds", 11));
		if (hasChallenge("ds", 12)) mult = mult.mul(challengeEffect("ds", 12));
		if (new Decimal(tmp.w.effect[0]).gt(1) && !tmp.w.deactivated) mult = mult.mul(tmp.w.effect[0]);
		if (inChallenge("ch", 11)) mult = mult.mul('1e4000');
		// pow
		if (hasBuyable("cl", 12)) mult = mult.pow(buyableEffect("cl", 12)[0]);
		if (hasChallenge("ch", 11)) mult = mult.pow(challengeEffect("ch", 11));
		// return
		return mult;
	},
	softcap: new Decimal('e10000000'),
	softcapPower: 0.8,
	hotkeys: [{key: "d", description: "D: Reset for demon souls", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.h.unlocked || player.ds.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	passiveGeneration() {
		let gen = 0;
		if (hasMilestone("s", 10)) gen += 0.00001;
		if (hasUpgrade("pl", 34)) gen += 0.1;
		return gen;
	},
	automate() {
		if (hasMilestone("m", 5) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				buyUpgrade(this.layer, id);
			};
		};
		if (hasMilestone("m", 6) && player[this.layer].auto_buyables) {
			updateBuyableTemp(this.layer);
			buyBuyable(this.layer, 11);
		};
	},
	doReset(resettingLayer) {
		if (hasMilestone("m", 14) && resettingLayer == "m") return;
		if (hasMilestone("gi", 5) && resettingLayer == "gi") return;
		let keep = ["threads", "threadGainBest", "auto_upgrades", "auto_buyables"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		const saveUpg = [];
		if (hasMilestone("m", 1) && (resettingLayer == "m" || resettingLayer == "gi" || resettingLayer == "ei")) {
			keep.push("challenges");
			saveUpg.push(22);
		};
		if (hasMilestone("w", 4) && resettingLayer == "w") keep.push("challenges");
		if (hasMilestone("cl", 3) && resettingLayer == "cl") keep.push("challenges");
		if (hasMilestone("ch", 5) && resettingLayer == "ch") keep.push("challenges");
		if (layers[resettingLayer].row > this.row) {
			layerDataReset("ds", keep);
			player[this.layer].upgrades = saveUpg;
		};
	},
	threadGain() {
		// init
		let gain = newDecimalZero();
		// active
		if (inChallenge("ds", 101)) {
			// base
			if (hasMilestone("ch", 45)) gain = gain.add(tmp.pl.effect.add(1).pow(0.1));
			else gain = gain.add(tmp.pl.effect.add(1).log10());
			// mul
			if (hasMilestone("ch", 48)) gain = gain.mul(milestoneEffect("ch", 48));
			if (hasMilestone("ch", 49)) gain = gain.mul(milestoneEffect("ch", 49));
		};
		// return
		return gain;
	},
	update(diff) {
		player.ds.threads = player.ds.threads.add(tmp.ds.threadGain.mul(diff));
		if (tmp.ds.threadGain.gt(player.ds.threadGainBest)) player.ds.threadGainBest = tmp.ds.threadGain;
	},
	tabFormat: {
		"Demonic Curses": {
			content: getTab("ds"),
		},
		"Demon Gateway": {
			content: getUnlockableTab("ds", "Demon Gateway"),
			unlocked() { return hasUpgrade("ds", 22) },
		},
		Purification: {
			content: getUnlockableTab("ds", "Purification"),
			unlocked() { return hasMilestone("ch", 44) },
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription: "keep subatomic particle rebuyables on demon soul resets",
			},
			1: {
				requirement: 5,
				effectDescription: "keep subatomic particle upgrades on demon soul resets",
			},
			2: {
				requirement: 15,
				effectDescription: "keep row 2 milestones on demon soul resets",
			},
			3: {
				requirement: 50,
				effectDescription: "keep essence upgrades on all resets",
			},
			4: {
				requirement: 125,
				effectDescription: "keep essence rebuyables on all resets",
			},
			5: {
				requirement: 625,
				effectDescription: "keep core upgrades on demon soul resets",
			},
			6: {
				requirement: 3125,
				effectDescription: "keep core rebuyables on demon soul resets",
			},
			7: {
				requirement: 1e10,
				effectDescription: "keep quark upgrades on demon soul resets",
			},
			8: {
				requirement: 1e14,
				effectDescription: "keep hex milestones on demon soul resets",
			},
		};
		const done = req => player.ds.points.gte(req);
		for (const key in obj) {
			obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " demon soul" + (obj[key].requirement === 1 ? "" : "s");
			obj[key].done = done.bind(null, obj[key].requirement);
			delete obj[key].requirement;
		};
		return obj;
	})(),
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Mad Hexes' },
			description() { return 'unlock 2 new hex upgrades, and <b' + getColorClass(this, REF, "h") + 'Hex Leak</b> also applies to hex gain (and not any other upgrades in the chain)' },
			cost: 10,
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hex Mania' },
			description() { return 'unlock 2 new hex upgrades, and <b' + getColorClass(this, REF, "h") + 'Stronger Hexes</b>\' effect is squared' },
			cost: 75,
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hall of Fame' },
			description() {
				let text = 'achievements also multiply essence gain';
				if (options.nerdMode) text += '<br>formula: 0.2x';
				return text;
			},
			cost: 5000,
			unlocked() { return hasUpgrade("ds", 11) && hasUpgrade("ds", 12) }
		},
		22: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Demonic Key' },
			description() { return 'unlocks the <b' + getColorClass(this, REF) + 'Demon Gateway</b>, a new tab' },
			cost: 100000,
			unlocked() { return hasUpgrade("ds", 11) && hasUpgrade("ds", 12) }
		},
		23: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Trophy of Glory' },
			description() {
				let text = 'achievements also multiply core and quark gain if you own <b' + getColorClass(this, REF) + 'Hall of Fame';
				if (options.nerdMode) text += '</b><br>formula: x^2/100';
				return text;
			},
			cost: 2500000,
			unlocked() { return hasUpgrade("ds", 21) }
		},
		24: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Buried History' },
			description() {
				let text = 'achievements boosting point gain uses a better formula if you own <b' + getColorClass(this, REF) + 'Hall of Fame';
				if (options.nerdMode) text += '</b><br>formula: 0.2x';
				return text;
			},
			cost: 1.11e11,
			unlocked() { return hasUpgrade("ds", 23) }
		},
		31: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Demonic Hexes' },
			description() { return 'makes hex gain softcap weaker (^0.51 --> ^0.52) and multiplies demon soul gain by 1e10' },
			cost: 1e105,
			effect() { return 1e10 },
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("ds", 24) }
		},
		32: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Wider Gate' },
			description: 'unlocks 2 new demon soul challenges',
			cost: 'e1.132e13',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("ds", 31) }
		},
	},
	buyables: {
		11: {
			cost(x) {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return new Decimal(10).pow(x.add(50));
				return new Decimal(2).pow(x);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Demonic Energy' },
			description: 'multiplies hex gain (and also subatomic particle gain at a reduced rate) based on the amount of this upgrade bought.',
			canAfford() { return player.ds.points.gte(this.cost()) },
			purchaseLimit() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer ? 99 : 22 },
			buy() { buyStandardBuyable(this) },
			effect(x) { return [new Decimal(2).pow(x), x.mul(5).add(1)] },
			effectDisplay(eff) {
				let text = format(eff[0]) + 'x<br>and ' + format(eff[1]) + 'x';
				if (options.nerdMode) text += '<br>formulas: 2^x<br>and 5x+1';
				return text;
			},
		},
	},
	challenges: {
		11: {
			name() { return '<h3' + getColorClass(this, REF) + 'Blazing Curse' },
			challengeDescription: " - Forces a Demon Soul reset<br> - Quark gain is divided by 100,000<br> - Point gain is divided by 10,000<br> - Hex gain is divided by 1,000<br> - Core gain is divided by 100<br> - Quark gain is divided by 10",
			goalDescription() {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) {
					return format('1e1133') + ' hexes';
				};
				return '<b' + getColorClass(this, REF, "h") + 'Potential Essence Potential';
			},
			canComplete() {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return player.h.points.gte('1e1133');
				return hasUpgrade("h", 64);
			},
			rewardDescription: "multiplies hex and demon soul gain based on your demon souls",
			rewardEffect() { return player.ds.points.add(1).pow(0.25) },
			rewardDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.25';
				return text;
			},
			doReset: true,
		},
		12: {
			name() { return '<h3' + getColorClass(this, REF) + 'Hellfire' },
			challengeDescription: " - Forces a Demon Soul reset<br> - Point gain is divided by 1,000,000<br> - Hex gain is divided by 1e10<br> - Subatomic Particle gain is divided by the number of Quarks",
			goalDescription() {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) {
					return format('1e1127') + ' hexes';
				};
				return '<b' + getColorClass(this, REF, "h") + 'Sub Core Particle Fusion';
			},
			canComplete() {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return player.h.points.gte('1e1127');
				return hasUpgrade("h", 63);
			},
			rewardDescription: "multiply demon soul gain based on your hexes",
			rewardEffect() { return player.h.points.add(1).pow(0.02) },
			rewardDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.02';
				return text;
			},
			doReset: true,
			unlocked() { return hasChallenge("ds", 11) },
		},
		21: {
			name() { return '<h3' + getColorClass(this, REF) + 'Opposite Polarity' },
			challengeDescription: " - Forces a Demon Soul reset<br> - Hex gain is divided by 100,000<br> - Point gain is divided by 1e10<br> - Core gain is divided by 1e15<br> - Essence gain is divided by 1e20",
			goalDescription() {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) {
					return format('1e1155') + ' hexes';
				};
				return '<b' + getColorClass(this, REF, "h") + 'Sub Core Particle Fusion';
			},
			canComplete() {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return player.h.points.gte('1e1155');
				return hasUpgrade("h", 53);
			},
			rewardDescription: "multiply subatomic particle<br>gain based on your demon souls",
			rewardEffect() { return player.ds.points.add(1).pow(0.2) },
			rewardDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.2';
				return text;
			},
			doReset: true,
			unlocked() { return hasChallenge("ds", 12) },
		},
		22: {
			name() { return '<h3' + getColorClass(this, REF) + 'Dreaded Science' },
			challengeDescription: " - Forces a Demon Soul reset<br> - Point gain is divided by 1e10<br> - Quark and Subatomic Particle gain is divided by 1e40<br>",
			goalDescription() {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) {
					return format('1e1195') + ' hexes<br>';
				};
				return "<b" + getColorClass(this, REF, "a") + "Famed Atom's Donations";
			},
			canComplete() {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return player.h.points.gte('1e1195');
				return hasUpgrade("a", 51);
			},
			rewardDescription: "multiply atom gain by 1.5",
			doReset: true,
			unlocked() { return (hasMilestone("a", 7) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasChallenge("ds", 21) },
		},
		31: {
			name() { return '<h3' + getColorClass(this, REF) + 'Reversed Hexes' },
			challengeDescription: " - Forces a Demon Soul reset<br> - Hex gain multiplier divides hex gain instead of multipling it<br>",
			goalDescription() { return format('e3.88e13') + ' hexes<br>' },
			canComplete() { return player.h.points.gte('e3.88e13') },
			rewardDescription: "make hex gain softcap weaker (^0.52 --> ^0.55)",
			doReset: true,
			unlocked() { return hasUpgrade("ds", 32) && hasChallenge("ds", 22) },
		},
		32: {
			name() { return '<h3' + getColorClass(this, REF) + 'Point Deficiency' },
			challengeDescription: "- Applies all previous demon soul challenge effects at once<br> - Point gain is log10(log10(gain+1)+1)<br>",
			countsAs: [11, 12, 21, 22, 31],
			goalDescription() { return format('e5.29e13') + ' hexes and ' + formatWhole(666) + ' points<br>' },
			canComplete() { return player.h.points.gte('e5.29e13') && player.points.gte(666) },
			rewardDescription: "make point gain softcap weaker (^0.25 --> ^0.3)",
			doReset: true,
			unlocked() { return hasUpgrade("ds", 32) && hasChallenge("ds", 31) },
		},
		101: {
			name() { return '<h3' + getColorClass(this, TITLE, "ds", true) + 'Purify Souls' },
			buttonText: ["Purify", "Cannot purify", "Enter purification", "Enter purification"],
			challengeDescription: 'Temporarily converts all your air production into Thread production. Get enough Threads, and you can purify your demon souls for rewards.<br>',
			goalDescription() {
				let text = "You have " + formatWhole(player.ds.threads);
				if (!maxedChallenge(this.layer, this.id)) text += "/" + formatWhole(getPurificationReq());
				text += " Threads.<br>";
				text += "(" + format(tmp.ds.threadGain) + "/sec)<br>";
				if (options.nerdMode) text += "Best: (" + format(player.ds.threadGainBest) + "/sec)<br>";
				return text;
			},
			// use effects like this: `if (getPurifiedDemonSouls() >= x && challengeEffect("ds", 101)[y]) gain = gain.mul(challengeEffect("ds", 101)[y]);`
			rewardDescription() {
				const completions = challengeCompletions(this.layer, this.id);
				const effects = challengeEffect(this.layer, this.id);
				let text = "";
				// current rewards
				if (completions >= 3) text += "multiply good influence gain and multiply cellular life gain (both based on your Threads)<br>Currently: " + format(effects[0]) + "x<br>and " + format(effects[1]) + "x";
				else if (completions >= 1) text += "multiply good influence gain based on your Threads<br>Currently: " + format(effects[0]) + "x";
				else text += "nothing currently";
				// next reward
				text += '<br><br>Next reward: ';
				if (completions == 0) text += "multiply good influence gain based on your Threads<br>Currently: " + format(effects[0]) + "x";
				else if (completions == 1) text += "improve the first purified souls effect";
				else if (completions == 2) text += "multiply cellular life gain based on your Threads<br>Currently: " + format(effects[1]) + "x";
				else if (completions == 3) text += "further improve the first purified souls effect";
				else text += "you have gotten all the rewards!";
				return text;
			},
			rewardEffect() {
				let div0 = 10;
				if (getPurifiedDemonSouls() >= 2) div0--;
				if (getPurifiedDemonSouls() >= 4) div0--;
				return [
					player.ds.threads.add(1).log10().div(div0).add(1),
					player.ds.threads.add(1).log10().add(1).pow(0.2),
				];
			},
			canComplete() { return player.ds.threads.gte(getPurificationReq()) && challengeCompletions(this.layer, this.id) < tmp[this.layer].challenges[this.id].completionLimit },
			completionLimit() { return player.ds.points.toNumber() },
			style: {width: '450px', height: '450px', 'border-color': '#BA0035', 'border-radius': '70px', 'background-color': '#200000', 'color': 'var(--color)'},
		},
	},
});

addLayer("a", {
	name: "Atom",
	pluralName: "Atoms",
	symbol: "A",
	row: 3,
	position: 2,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		auto_upgrades: false,
		auto_reactor: false,
	}},
	color: "#4D2FE0",
	branches: ["m"],
	requires: 1000,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "atoms",
	baseResource: "subatomic particles",
	baseAmount() { return player.sp.points },
	type: "static",
	exponent: 1,
	canBuyMax() { return true },
	gainExp() {
		let gain = newDecimalOne();
		if (hasBuyable("q", 12)) gain = gain.mul(buyableEffect("q", 12));
		if (hasUpgrade("a", 22)) gain = gain.mul(upgradeEffect("a", 22));
		if (hasUpgrade("a", 32)) gain = gain.mul(upgradeEffect("a", 32));
		if (hasUpgrade("a", 33)) gain = gain.mul(upgradeEffect("a", 33));
		if (hasUpgrade("a", 61)) gain = gain.mul(upgradeEffect("a", 61));
		if (hasUpgrade("a", 62)) gain = gain.mul(upgradeEffect("a", 62));
		if (hasUpgrade("a", 72)) gain = gain.mul(upgradeEffect("a", 72));
		if (hasChallenge("ds", 22)) gain = gain.mul(1.5);
		if (hasMilestone("r", 7)) gain = gain.mul(milestoneEffect("r", 7));
		if (tmp.m.effect.gt(1) && !tmp.m.deactivated) gain = gain.mul(tmp.m.effect);
		if (new Decimal(tmp.w.effect[1]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[1]);
		if (hasBuyable("w", 21) && hasMilestone("ch", 35)) gain = gain.mul(buyableEffect("w", 21));
		if (hasBuyable("cl", 11)) gain = gain.mul(buyableEffect("cl", 11)[1]);
		if (hasBuyable("cl", 33)) gain = gain.mul(buyableEffect("cl", 33));
		if (hasBuyable("cl", 52)) gain = gain.mul(buyableEffect("cl", 52));
		if (hasBuyable("mo", 11)) gain = gain.mul(buyableEffect("mo", 11));
		return gain;
	},
	autoPrestige() { return hasMilestone("a", 15) || hasUpgrade("pl", 42) },
	hotkeys: [{key: "a", description: "A: Reset for atoms", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.ds.unlocked || player.a.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	automate() {
		if (hasMilestone("gi", 11) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				buyUpgrade(this.layer, id);
			};
		};
		if (hasMilestone("ch", 28) && player.a.auto_reactor) {
			if (layers.a.clickables[11].canClick()) {
				layers.a.clickables[11].onClick();
			};
		};
	},
	doReset(resettingLayer) {
		if (hasMilestone("ei", 4) && resettingLayer == "ei") return;
		let keep = ["auto_upgrades", "auto_reactor"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (layers[resettingLayer].row == this.row) {
			keep.push("milestones", "points", "best", "total", "clickables");
			if (hasMilestone("a", 12) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) keep.push("upgrades");
		};
		if (hasMilestone("m", 12) && resettingLayer == "m") keep.push("milestones");
		if (hasMilestone("cl", 8) && resettingLayer == "cl") keep.push("milestones");
		if (layers[resettingLayer].row >= this.row) layerDataReset("a", keep);
	},
	resetsNothing() { return hasMilestone("a", 14) || hasUpgrade("pl", 42) },
	tabFormat: {
		"Atomic Progress": {
			content: getTab("a"),
		},
		"Atomic Tree": {
			content: getTab("a", "Atomic Tree"),
		},
		"Atomic Reactor": {
			content: getUnlockableTab("a", "Atomic Reactor"),
			unlocked() { return isAssimilated("a") || player.mo.assimilating === "a" },
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription: "keep subatomic particle rebuyables on atom resets",
			},
			1: {
				requirement: 2,
				effectDescription: "keep core rebuyables on atom resets",
			},
			2: {
				requirement: 3,
				effectDescription: "keep core upgrades on atom resets",
			},
			3: {
				requirement: 4,
				effectDescription: "keep subatomic particle upgrades on atom resets",
			},
			4: {
				requirement: 5,
				effectDescription: "keep core milestones on atom resets",
			},
			5: {
				requirement: 6,
				effectDescription: "keep quark milestones on atom resets",
			},
			6: {
				requirement: 7,
				effectDescription: "keep hex milestones on atom resets",
			},
			7: {
				requirements: [8, 45],
				effectDescription: "unlock a new demon soul challenge",
			},
			8: {
				requirements: [10, 75],
				effectDescription: "gain 1% of quark gain per second",
			},
			9: {
				requirements: [25, 125],
				effectDescription: "gain +9% of quark gain per second (total: 10%)",
			},
			10: {
				requirements: [40, 175],
				effectDescription: "you can buy upgrades that are not on the other's paths",
			},
			11: {
				requirements: [200, 500],
				effectDescription: "keep hex upgrades on row 4 resets",
			},
			12: {
				requirements: [750, 1000],
				effectDescription: "keep atom upgrades on row 4 resets",
			},
			13: {
				requirements: [1000, 1500],
				effectDescription: "keep subatomic particle milestones on atom resets",
			},
			14: {
				requirementDescription: "10,000 atoms and 1e600 prayers",
				effectDescription: "atoms reset nothing",
				done() { return player.a.points.gte(10000) && player.p.points.gte("1e600") },
				unlocked() { return (hasMilestone("a", 13) && player.r.unlocked) || hasMilestone("a", 14) }
			},
			15: {
				requirementDescription: "18,000 atoms and 40 sanctums",
				effectDescription: "perform atom resets automatically",
				done() { return player.a.points.gte(18000) && player.s.points.gte(40) && hasMilestone("a", 14) },
				unlocked() { return (hasMilestone("a", 14) && player.r.unlocked) || hasMilestone("a", 15) }
			},
		};
		const done = req => player.a.points.gte(req);
		const doneTotal = (req, reqTotal) => player.a.points.gte(req) && player.a.total.gte(reqTotal);
		for (const key in obj) {
			if (obj[key].requirements) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirements[0]) + " atoms and " + simpleFormatWhole(obj[key].requirements[1]) + " total atoms";
				obj[key].done = doneTotal.bind(null, ...obj[key].requirements);
				delete obj[key].requirements;
			} else if (obj[key].requirement) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " atom" + (obj[key].requirement === 1 ? "" : "s");
				obj[key].done = done.bind(null, obj[key].requirement);
				delete obj[key].requirement;
			};
		};
		return obj;
	})(),
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'The Demon of the Atom' },
			description() {
				if (hasMilestone("m", 11)) return 'multiplies demon soul gain by 1,000x';
				return 'multiplies demon soul gain based on your atoms';
			},
			cost: 1,
			effect() {
				const eff = player.a.points.add(1).pow(0.5);
				const hardcap = new Decimal(1000);
				if (eff.gt(hardcap) || hasMilestone("m", 11)) return hardcap;
				return eff;
			},
			effectDisplay(eff) {
				if (hasMilestone("m", 11)) return 'max effect';
				let text = format(eff) + 'x';
				if (eff.gte(1000)) text += '<br>(hardcapped)';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.5';
				return text;
			},
			branches: [21, 22],
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Decaying Atoms' },
			description: 'multiplies subatomic particle gain based on your best atoms',
			cost: 1,
			effect() { return player.a.best.add(1).pow(1.25) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^1.25';
				return text;
			},
			branches: [31, 32],
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 22) && !hasUpgrade("a", 33)) },
		},
		22: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Atom Construction' },
			description() {
				if (hasMilestone("m", 11) && getClickableState("a", 11) < 2) return 'multiplies atom gain by 2.50x';
				return 'multiplies atom gain based on your subatomic particles';
			},
			cost: 1,
			effect() {
				if (getClickableState("a", 11) >= 2) {
					return player.sp.points.add(1).pow(0.02).log10().add(1);
				};
				const eff = player.sp.points.add(1).pow(0.02);
				const hardcap = new Decimal(2.5);
				if (eff.gt(hardcap) || hasMilestone("m", 11)) return hardcap;
				return eff;
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (getClickableState("a", 11) >= 2) {
					if (options.nerdMode) text += '<br>formula: log10((x+1)^0.02)+1';
					return text;
				};
				if (hasMilestone("m", 11)) return 'max effect';
				if (eff.gte(2.5)) text += '<br>(hardcapped)';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.02';
				return text;
			},
			branches: [32, 33],
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 21) && !hasUpgrade("a", 31)) },
		},
		31: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Decayed Atoms' },
			description: 'multiplies subatomic particle gain based on your total atoms',
			cost: 2,
			effect() { return player.a.total.add(1).pow(1.05) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^1.05';
				return text;
			},
			branches: [41],
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 22) && !hasUpgrade("a", 32) && !hasUpgrade("a", 33) && !hasUpgrade("a", 42)) },
		},
		32: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Atomic Recursion' },
			description() {
				if (hasMilestone("m", 11) && getClickableState("a", 11) < 3) return 'multiplies atom gain by 2.25x';
				return 'multiplies atom gain based on your total atoms';
			},
			cost: 2,
			effect() {
				if (getClickableState("a", 11) >= 3) {
					return player.a.total.add(1).pow(0.01);
				};
				const eff = player.a.total.add(1).pow(0.05);
				const hardcap = new Decimal(2.25);
				if (eff.gt(hardcap) || hasMilestone("m", 11)) return hardcap;
				return eff;
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (getClickableState("a", 11) >= 3) {
					if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
					return text;
				};
				if (hasMilestone("m", 11)) return 'max effect';
				if (eff.gte(2.25)) text += '<br>(hardcapped)';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.05';
				return text;
			},
			branches: [41, 42],
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 31) && !hasUpgrade("a", 33)) },
		},
		33: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Atom Production' },
			description() {
				if (hasMilestone("m", 11) && getClickableState("a", 11) < 1) return 'multiplies atom gain by 3.15x';
				return 'multiplies atom gain based on your subatomic particles';
			},
			cost: 2,
			effect() {
				if (getClickableState("a", 11) >= 1) {
					return player.sp.points.add(1).pow(0.025).log10().add(1);
				};
				const eff = player.sp.points.add(1).pow(0.025);
				const hardcap = new Decimal(3.15);
				if (eff.gt(hardcap) || hasMilestone("m", 11)) return hardcap;
				return eff;
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (getClickableState("a", 11) >= 1) {
					if (options.nerdMode) text += '<br>formula: log10((x+1)^0.025)+1';
					return text;
				};
				if (hasMilestone("m", 11)) return 'max effect';
				if (eff.gte(3.15)) text += '<br>(hardcapped)';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.025';
				return text;
			},
			branches: [42],
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 21) && !hasUpgrade("a", 31) && !hasUpgrade("a", 32) && !hasUpgrade("a", 41)) },
		},
		41: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Atom Revenants' },
			description: 'multiplies quark gain based on your total atoms minus your current atoms',
			cost: 2,
			effect() { return player.a.total.sub(player.a.points).add(1).pow(0.75) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x-y+1)^0.75';
				return text;
			},
			branches: [51],
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 33) && !hasUpgrade("a", 42)) },
		},
		42: {
			title() { return '<b' + getColorClass(this, TITLE) + 'The Fallen' },
			description: 'multiplies demon soul gain based on your best atoms minus your current atoms',
			cost: 2,
			effect() { return player.a.best.mul(1.5).sub(player.a.points).add(1).pow(1.05) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula:<br>(1.5x-y+1)^1.05';
				return text;
			},
			branches: [51],
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 31) && !hasUpgrade("a", 41)) },
		},
		51: {
			title() { return "<b" + getColorClass(this, TITLE) + "Famed Atoms' Donations" },
			description() {
				let text = 'multiplies subatomic particle gain based on your number of achievements';
				if (options.nerdMode) text += '<br>formula: x^1.25';
				return text;
			},
			cost: 3,
			branches: [61, 62],
		},
		61: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Unpeaked' },
			description() {
				if (getClickableState("a", 11) >= 6) return 'multiplies atom gain based on your total atoms';
				if (hasMilestone("m", 11)) return 'multiplies atom gain by 15.00x';
				return 'multiplies atom gain based on your total atoms minus your best atoms';
			},
			cost: 3,
			effect() {
				if (getClickableState("a", 11) >= 6) {
					return player.a.total.add(1).pow(0.02);
				};
				const eff = player.a.total.sub(player.a.best).add(1).pow(0.2);
				const hardcap = new Decimal(15);
				if (eff.gt(hardcap) || hasMilestone("m", 11)) return hardcap;
				return eff;
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (getClickableState("a", 11) >= 6) {
					if (options.nerdMode) text += '<br>formula: (x+1)^0.02';
					return text;
				};
				if (hasMilestone("m", 11)) return 'max effect';
				if (eff.gte(15)) text += '<br>(hardcapped)';
				if (options.nerdMode) text += '<br>formula: (x-y+1)^0.2';
				return text;
			},
			branches: [71, 72],
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 62) && !hasUpgrade("a", 73)) },
		},
		62: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Higher Peak' },
			description() {
				if (hasMilestone("m", 11) && getClickableState("a", 11) < 4) return 'multiplies atom gain by 6.66x';
				return 'multiplies atom gain based on your total atoms times your current atoms';
			},
			cost: 3,
			effect() {
				if (getClickableState("a", 11) >= 4) {
					return player.a.total.mul(player.a.points).add(1).pow(0.013);
				};
				const eff = player.a.total.mul(player.a.points).pow(0.05).add(1);
				const hardcap = new Decimal(6.66);
				if (eff.gt(hardcap) || hasMilestone("m", 11)) return hardcap;
				return eff;
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (getClickableState("a", 11) >= 4) {
					if (options.nerdMode) text += '<br>formula: (xy+1)^0.013';
					return text;
				};
				if (hasMilestone("m", 11)) return 'max effect';
				if (eff.gte(6.66)) text += '<br>(hardcapped)';
				if (options.nerdMode) text += '<br>formula: (xy)^0.05+1';
				return text;
			},
			branches: [72, 73],
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 61) && !hasUpgrade("a", 71)) },
		},
		71: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Demons Inside' },
			description: 'multiplies demon soul gain based on your best atoms times your current atoms',
			cost: 4,
			effect() { return player.a.best.mul(player.a.points).mul(2.5).add(1).pow(0.15) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (2.5xy+1)^0.15';
				return text;
			},
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 62) && !hasUpgrade("a", 72) && !hasUpgrade("a", 73)) },
		},
		72: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Recurred, Recurring' },
			description() {
				if (hasMilestone("m", 11) && getClickableState("a", 11) < 5) return 'multiplies atom gain by 5.00x';
				return 'multiplies atom gain based on your total atoms';
			},
			cost: 4,
			effect() {
				if (getClickableState("a", 11) >= 5) {
					return player.a.total.add(1).pow(0.025);
				};
				const eff = player.a.total.add(1).pow(0.1);
				const hardcap = new Decimal(5);
				if (eff.gt(hardcap) || hasMilestone("m", 11)) return hardcap;
				return eff;
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (getClickableState("a", 11) >= 5) {
					if (options.nerdMode) text += '<br>formula: (x+1)^0.025';
					return text;
				};
				if (hasMilestone("m", 11)) return 'max effect';
				if (eff.gte(5)) text += '<br>(hardcapped)';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.1';
				return text;
			},
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 71) && !hasUpgrade("a", 73)) },
		},
		73: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Atomic Essence' },
			description: 'multiplies essence gain based on your atoms',
			cost: 4,
			effect() { return player.a.points.add(1).pow(1.75) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^1.75';
				return text;
			},
			unlocked() { return (hasMilestone("a", 10) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) || (!hasUpgrade("a", 61) && !hasUpgrade("a", 71) && !hasUpgrade("a", 72)) },
		},
	},
	clickables: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Atomic Reactor' },
			display() {
				const num = getClickableState("a", 11) || 0;
				let text = 'Removes maximums on the effects of atom upgrades, but worsens the respective effect formulas.<br><br>';
				text += 'Next Effect: ' + (this.upgrades[num] ? 'Removes the maximum of ' + tmp.a.upgrades[this.upgrades[num]].title + '</b>\'s effect, but ' + (this.upgrades[num] == 61 ? 'change' : 'worsen') + ' its effect formula.' : 'You have all the effects!');
				text += '<br><br>Upgrades Affected:';
				if (num > 0) {
					for (let index = 0; index < num; index++) {
						text += '<br>' + tmp.a.upgrades[this.upgrades[index]].title + '</b>';
					};
				} else {
					text += '<br>none so far';
				};
				text += '<br><br>Cost: ' + formatWhole(this.cost()) + ' atoms<br><br>Bought: ' + formatWhole(num) + '/' + formatWhole(this.upgrades.length);
				if (tmp[this.layer].clickables[this.id].canClick) text = text.replace(/layer-a/g, 'layer-a-dark');
				else text = text.replace(/layer-a-dark/g, 'layer-a');
				return text;
			},
			upgrades: [33, 22, 32, 62, 72, 61],
			assimilationReq: [36000, 61000],
			req: ['1e690', '1e728', '1e771', '1e912', '1e1221', '1e1500'],
			cost() {
				const num = getClickableState("a", 11) || 0;
				if (player.mo.assimilating === this.layer) {
					return this.assimilationReq[num] || Infinity;
				};
				return this.req[num] || Infinity;
			},
			canClick() {
				const num = getClickableState("a", 11) || 0;
				if (player.mo.assimilating === this.layer) return player.a.points.gte(this.assimilationReq[num]) && num < this.assimilationReq.length && num < this.upgrades.length;
				return player.a.points.gte(this.req[num]) && num < this.req.length && num < this.upgrades.length;
			},
			onClick() {
				player.a.points = player.a.points.sub(this.cost());
				setClickableState("a", 11, (getClickableState("a", 11) || 0) + 1);
			},
			style() {
				let obj = {width: "300px", height: "300px"};
				if (getClickableState("a", 11) >= this.upgrades.length) {
					obj["background-color"] = "#77bf5f";
					obj.cursor = "default";
				};
				return obj;
			},
		},
		21: {
			title() {
				if (getClickableState("a", 11) >= 2) return '<b' + getColorClass(this, TITLE) + 'Increase Total Atoms';
				return '<b' + getColorClass(this, TITLE) + 'Reset Atom Upgrades';
			},
			display() {
				if (getClickableState("a", 11) >= 2) {
					let text = 'Click to increase your total atoms by +' + formatWhole(this.effect()) + ' (based on your atoms and <b' + getColorClass(this, REF) + 'Atomic Reactor</b>s)';
					if (options.nerdMode) text += '<br>formula: x^0.5 * 2.5^y';
					return text;
				};
				return 'Click to reset your atom upgrades. You need to have completed <b' + getColorClass(this, REF, "ds") + 'Dreaded Science</b> to use this. Get 2 <b' + getColorClass(this, REF) + 'Atomic Reactor</b>s to improve this.';
			},
			effect() { return player.a.points.pow(0.5).mul(2.5 ** getClickableState("a", 11)).floor() },
			canClick() { return player.a.upgrades.length > 0 && player.ds.challenges[22] > 0 },
			onClick() {
				if (getClickableState("a", 11) >= 2) {
					player.a.total = player.a.total.add(this.effect());
				} else {
					player.a.upgrades = [];
				};
			},
			style: {'min-height': '80px', width: '200px'},
		},
	},
});

addLayer("p", {
	name: "Prayer",
	pluralName: "Prayers",
	symbol: "P",
	row: 1,
	position: 1,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		divinity: newDecimalZero(),
		holiness: newDecimalZero(),
		hymns: newDecimalZero(),
		auto_upgrades: false,
		smart_auto_upgrades: false,
	}},
	color: "#FDBBFF",
	branches: ["s"],
	requires: '1e1000',
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "prayers",
	baseResource: "essence",
	baseAmount() { return player.e.points },
	type: "normal",
	exponent: 0.012,
	gainMult() {
		// init
		let mult = newDecimalOne();
		// mult
		if (hasUpgrade("p", 15)) mult = mult.mul(upgradeEffect("p", 15));
		if (hasUpgrade("p", 21)) mult = mult.mul(upgradeEffect("p", 21));
		if (hasUpgrade("ds", 21) && hasUpgrade("ds", 23) && hasUpgrade("ds", 24) && hasUpgrade("p", 31)) mult = mult.mul(player.A.points.pow(2).div(100));
		if (hasUpgrade("p", 41)) mult = mult.mul(tmp.p.hymnEffect);
		if (hasUpgrade("p", 62)) {
			mult = mult.mul(upgradeEffect("p", 62));
			if (hasUpgrade("p", 63)) mult = mult.mul(upgradeEffect("p", 63));
		};
		if (hasUpgrade("p", 73)) mult = mult.mul(upgradeEffect("p", 73));
		if (hasUpgrade("p", 81)) mult = mult.mul(upgradeEffect("p", 81));
		if (tmp.gi.effect.gt(1) && !tmp.gi.deactivated && !(hasMilestone("gi", 19) && player.h.limitsBroken >= 4)) mult = mult.mul(tmp.gi.effect);
		if (new Decimal(tmp.w.effect[0]).gt(1) && !tmp.w.deactivated) mult = mult.mul(tmp.w.effect[0]);
		if (hasUpgrade("pl", 44)) mult = mult.mul(upgradeEffect("pl", 44));
		// pow
		if (hasChallenge("ch", 12)) mult = mult.pow(challengeEffect("ch", 12));
		// return
		return mult;
	},
	hotkeys: [{key: "p", description: "P: Reset for prayers", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.a.unlocked || player.p.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	passiveGeneration() {
		let gen = 0;
		if (hasMilestone("s", 7)) {
			gen += 0.005;
			if (hasMilestone("s", 15)) gen += 0.045;
		};
		return gen;
	},
	automate() {
		if (hasMilestone("s", 5) && player.p.auto_upgrades) {
			const notSmart = (hasMilestone("s", 6) ? !player.p.smart_auto_upgrades : true);
			buyUpgrade("p", 11);
			if (notSmart || player.p.points.gte(1000)) buyUpgrade("p", 12);
			buyUpgrade("p", 13);
			buyUpgrade("p", 14);
			if (hasUpgrade("p", 14)) buyUpgrade("p", 15);
			buyUpgrade("p", 21);
			buyUpgrade("p", 33);
			if (notSmart || hasUpgrade("p", 14)) buyUpgrade("p", 22);
			if (hasUpgrade("p", 22)) {
				buyUpgrade("p", 23);
				buyUpgrade("p", 24);
				if (hasUpgrade("p", 24)) buyUpgrade("p", 25);
				if (notSmart || hasUpgrade("p", 24)) buyUpgrade("p", 31);
				buyUpgrade("p", 32);
				buyUpgrade("p", 34);
				if (hasUpgrade("p", 34)) buyUpgrade("p", 35);
				if (notSmart || hasUpgrade("p", 34)) buyUpgrade("p", 41);
			};
			if (hasUpgrade("p", 41)) {
				buyUpgrade("p", 42);
				buyUpgrade("p", 43);
				buyUpgrade("p", 44);
				if (hasUpgrade("p", 44)) buyUpgrade("p", 45);
				if (notSmart || hasUpgrade("p", 44)) buyUpgrade("p", 51);
				buyUpgrade("p", 52);
				buyUpgrade("p", 53);
				buyUpgrade("p", 54);
				if (hasUpgrade("p", 54)) buyUpgrade("p", 55);
				if (notSmart || hasUpgrade("p", 54)) buyUpgrade("p", 61);
				buyUpgrade("p", 62);
				buyUpgrade("p", 63);
				buyUpgrade("p", 64);
				if (hasUpgrade("p", 64)) buyUpgrade("p", 65);
				buyUpgrade("p", 71);
				buyUpgrade("p", 72);
				buyUpgrade("p", 73);
				buyUpgrade("p", 74);
				if (hasMilestone("ch", 23)) {
					buyUpgrade("p", 81);
					buyUpgrade("p", 82);
					buyUpgrade("p", 83);
					buyUpgrade("p", 84);
				};
			};
		};
	},
	effect() {
		let effBoost = new Decimal(0.01);
		let effEx = newDecimalOne();
		if (hasMilestone("p", 1)) effBoost = effBoost.mul(2);
		if (hasUpgrade("p", 13)) effBoost = effBoost.mul(upgradeEffect("p", 13));
		if (hasUpgrade("p", 32)) effBoost = effBoost.mul(upgradeEffect("p", 32));
		if (hasUpgrade("p", 33)) effBoost = effBoost.mul(upgradeEffect("p", 33));
		if (hasUpgrade("p", 42)) effBoost = effBoost.mul(upgradeEffect("p", 42));
		if (hasMilestone("p", 2)) effEx = new Decimal(1.5);
		if (hasMilestone("p", 3)) effEx = new Decimal(1.6);
		let eff = effBoost.mul(player.p.points).pow(effEx);
		let sc_start = softcaps.p_eff[0]();
		if (eff.gt(sc_start)) eff = eff.div(sc_start).pow(softcaps.p_eff[1]()).mul(sc_start);
		if (hasUpgrade("p", 71)) eff = eff.mul(upgradeEffect("p", 71));
		return eff;
	},
	effectDescription() {
		if (tmp.p.effect.gt(softcaps.p_eff[0]())) return 'which are generating <h2 class="layer-p">' + format(tmp.p.effect) + '</h2> divinity/sec (softcapped)';
		return 'which are generating <h2 class="layer-p">' + format(tmp.p.effect) + '</h2> divinity/sec';
	},
	doReset(resettingLayer) {
		if (hasMilestone("ei", 3) && resettingLayer == "ei") return;
		if (hasMilestone("w", 10) && resettingLayer == "w") return;
		if (hasMilestone("cl", 6) && resettingLayer == "cl") return;
		let keep = ["auto_upgrades", "smart_auto_upgrades"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (resettingLayer == "h") keep.push("points", "best", "total", "milestones");
		if (resettingLayer == "sp") keep.push("points", "best", "total", "milestones");
		if (resettingLayer == "r") keep.push("milestones");
		if (hasMilestone("s", 25) && resettingLayer == "s") keep.push("milestones");
		if (hasUpgrade("p", 22) && resettingLayer == "p") {
			let mult = newDecimalOne();
			if (hasUpgrade("p", 61)) mult = mult.mul(upgradeEffect("p", 61));
			if (hasUpgrade("p", 23) && hasUpgrade("p", 25)) player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.08).mul(mult));
			else if (hasUpgrade("p", 23)) player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.06).mul(mult));
			else player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.04).mul(mult));
		};
		if (hasUpgrade("p", 41) && resettingLayer == "p") {
			if (hasUpgrade("p", 51) && hasUpgrade("p", 55)) player.p.hymns = player.p.hymns.add(player.p.holiness.div(175).floor());
			else if (hasUpgrade("p", 51)) player.p.hymns = player.p.hymns.add(player.p.holiness.div(200).floor());
			else player.p.hymns = player.p.hymns.add(player.p.holiness.div(250).floor());
		};
		if (layers[resettingLayer].row >= this.row) player.p.divinity = newDecimalZero();
		if (layers[resettingLayer].row > this.row) {
			layerDataReset("p", keep);
			if (!keep.includes("holiness")) player.p.holiness = newDecimalZero();
			if (!keep.includes("hymns")) player.p.hymns = newDecimalZero();
		};
	},
	update(diff) {
		if (tmp.p.effect.gt(0) && !tmp.p.deactivated) {
			player.p.divinity = player.p.divinity.add(tmp.p.effect.mul(diff));
		};
		if (hasMilestone("s", 8)) {
			let gen = 0.002;
			if (hasMilestone("s", 16)) gen += 0.023;
			if (hasUpgrade("p", 22)) {
				let mult = newDecimalOne();
				if (hasUpgrade("p", 61)) mult = mult.mul(upgradeEffect("p", 61));
				if (hasUpgrade("p", 23) && hasUpgrade("p", 25)) player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.08).mul(mult).mul(diff).mul(0.002));
				if (hasUpgrade("p", 23)) player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.06).mul(mult).mul(diff).mul(0.002));
				else player.p.holiness = player.p.holiness.add(player.p.divinity.mul(0.04).mul(mult).mul(diff).mul(0.002));
			};
			if (hasUpgrade("p", 41)) {
				if (hasUpgrade("p", 51) && hasUpgrade("p", 55)) player.p.hymns = player.p.hymns.add(player.p.holiness.div(175).mul(diff).mul(0.002).floor());
				else if (hasUpgrade("p", 51)) player.p.hymns = player.p.hymns.add(player.p.holiness.div(200).mul(diff).mul(0.002).floor());
				else player.p.hymns = player.p.hymns.add(player.p.holiness.div(250).mul(diff).mul(0.002).floor());
			};
		};
	},
	hymnEffect() {
		let exp = 0.15;
		if (hasUpgrade("p", 43)) {
			if (hasUpgrade("p", 52)) {
				if (hasUpgrade("p", 53)) exp = 0.25;
				else exp = 0.225;
			} else {
				exp = 0.2;
			};
		};
		return player.p.hymns.add(1).pow(exp);
	},
	tabFormat: getTab("p"),
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription: "hex and subatomic particle resets only reset prayer upgrades and special resources out of the things in the prayer layer",
			},
			1: {
				requirement: 20,
				effectDescription: "prayers generate twice as much divinity",
			},
			2: {
				requirements: [2500, 250],
				effectDescription: "divinity gain is raised to the power of 1.5",
				unlocked() { return hasUpgrade("p", 41) || player.s.unlocked },
			},
			3: {
				requirement: 1e55,
				effectDescription: "divinity gain is raised to the power of 1.6 instead of 1.5",
				unlocked() { return hasMilestone("p", 2) || player.s.unlocked },
			},
		};
		const done = req => player.p.points.gte(req);
		const doneHymns = (req, reqHymns) => player.p.points.gte(req) && player.p.hymns.gte(reqHymns);
		for (const key in obj) {
			if (obj[key].requirements) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirements[0]) + " prayers and " + simpleFormatWhole(obj[key].requirements[1]) + " hymns";
				obj[key].done = doneHymns.bind(null, ...obj[key].requirements);
				delete obj[key].requirements;
			} else if (obj[key].requirement) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " prayer" + (obj[key].requirement === 1 ? "" : "s");
				obj[key].done = done.bind(null, obj[key].requirement);
				delete obj[key].requirement;
			};
		};
		return obj;
	})(),
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Prayer Influence' },
			description: 'multiplies essence gain based on your prayers',
			cost: 1,
			effect() { return player.p.points.add(1).pow(0.075) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.075';
				return text;
			},
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Heretic Leniency' },
			description: 'multiplies hex gain by 1.05',
			cost: 10,
		},
		13: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Essence of Divinity' },
			description: 'multiplies divinity gain based on your essence',
			cost: 25,
			effect() { return player.e.points.add(1).pow(0.0001) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.0001';
				return text;
			},
		},
		14: {
			title() { return '<b' + getColorClass(this, TITLE, "p", true) + 'Prayer Divination' },
			fullDisplay() {
				let text = 'Req: 100 divinity with having 0 holiness';
				if (tmp[this.layer].upgrades[this.id].canAfford) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.divinity.gte(100) && player.p.holiness.eq(0) },
			style: {height: '120px', border: '2px dashed', 'border-color': '#FF8800', 'background-color': '#0088FF'},
			unlocked() { return (hasMilestone("s", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && !hasUpgrade("p", 14) },
		},
		15: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Prayer Divination' },
			description: 'multiplies prayer gain based on your divinity',
			effect() { return player.p.divinity.add(1).pow(0.02) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.02';
				return text;
			},
			cost: 75,
			currencyInternalName: "divinity",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 14) },
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Divine Prayers' },
			description: 'multiplies prayer gain based on your divinity',
			effect() { return player.p.divinity.add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return text;
			},
			cost: 20,
			currencyInternalName: "divinity",
			currencyLayer: "p",
		},
		22: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Holy Light' },
			description() { return 'unlocks <b' + getColorClass(this, REF) + 'holiness</b>' },
			cost: 45,
			currencyInternalName: "divinity",
			currencyLayer: "p",
		},
		23: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Holy Channeling' },
			description: 'increases efficiency of holiness conversion<br>(0.04x --> 0.06x)',
			cost: 10,
			currencyInternalName: "holiness",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 22) },
		},
		24: {
			title() { return '<b' + getColorClass(this, TITLE, "p", true) + 'Holy Conversion' },
			fullDisplay() {
				let text = 'Req: 75 holiness without owning <b' + getColorClass(this, REF, "p", true) + 'Church Relics</b>';
				if (tmp[this.layer].upgrades[this.id].canAfford) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.holiness.gte(75) && !hasUpgrade("p", 31) },
			style: {height: '120px', border: '2px dashed', 'border-color': '#FF8800', 'background-color': '#0088FF'},
			unlocked() { return (hasMilestone("s", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 22) && !hasUpgrade("p", 24) },
		},
		25: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Holy Conversion' },
			description() { return 'increases efficiency of holiness conversion if you own <b' + getColorClass(this, REF) + 'Holy Channeling</b><br>(0.06x --> 0.08x)' },
			cost: 50,
			currencyInternalName: "holiness",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 24) },
		},
		31: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Church Relics' },
			description: 'achievements also multiply prayer gain if you have all subsequent achievement upgrades',
			costDisplay: "Cost: 175 divinity<br>and 40 holiness",
			canAfford() { return player.p.divinity.gte(175) && player.p.holiness.gte(40) },
			pay() {
				player.p.divinity = player.p.divinity.sub(175);
				player.p.holiness = player.p.holiness.sub(40);
			},
			unlocked() { return hasUpgrade("p", 22) },

		},
		32: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Divine Synergy' },
			description: 'multiplies divinity gain based on your holiness',
			effect() { return player.p.holiness.add(1).pow(0.025) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.025';
				return text;
			},
			costDisplay: "Cost: 750 divinity<br>and 50 holiness",
			canAfford() { return player.p.divinity.gte(750) && player.p.holiness.gte(50) },
			pay() {
				player.p.divinity = player.p.divinity.sub(750);
				player.p.holiness = player.p.holiness.sub(50);
			},
			unlocked() { return hasUpgrade("p", 22) },
		},
		33: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Divine Recursion' },
			description: 'multiplies divinity gain based on your divinity',
			cost: 1000,
			effect() { return player.p.divinity.add(1).pow(0.2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.2';
				return text;
			},
			unlocked() { return hasUpgrade("p", 22) },
		},
		34: {
			title() { return '<b' + getColorClass(this, TITLE, "p", true) + 'Holy Shift' },
			fullDisplay() {
				let text = 'Req: 1,000 holiness with 0 hymns';
				if (tmp[this.layer].upgrades[this.id].canAfford) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.holiness.gte(1000) && player.p.hymns.eq(0) },
			style: {height: '120px', border: '2px dashed', 'border-color': '#FF8800', 'background-color': '#0088FF'},
			unlocked() { return (hasMilestone("s", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 22) && !hasUpgrade("p", 34) },
		},
		35: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Holy Shift' },
			description() { return 'increases efficiency of holiness conversion if you own <b' + getColorClass(this, REF) + 'Holy Conversion</b> and all subsequent upgrades<br>(0.08x --> 0.11x)' },
			cost: 500,
			currencyInternalName: "holiness",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 34) },
		},
		41: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Written Hymns' },
			description() { return 'unlocks <b' + getColorClass(this, REF) + 'hymns</b>' },
			costDisplay: "Cost: 2,000 divinity<br>and 450 holiness",
			canAfford() { return player.p.divinity.gte(2000) && player.p.holiness.gte(450) },
			pay() {
				player.p.divinity = player.p.divinity.sub(2000);
				player.p.holiness = player.p.holiness.sub(450);
			},
			unlocked() { return hasUpgrade("p", 22) },
		},
		42: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Divine Hymns' },
			description: 'multiplies divinity gain based on your hymns',
			effect() { return player.p.hymns.add(1).pow(hasUpgrade("p", 45) ? 0.125 : 0.1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^' + (hasUpgrade("p", 45) ? 0.125 : 0.1);
				return text;
			},
			costDisplay: "Cost: 1,000 holiness<br>and 75 hymns",
			canAfford() { return player.p.holiness.gte(1000) && player.p.hymns.gte(75) },
			pay() {
				player.p.holiness = player.p.holiness.sub(1000);
				player.p.hymns = player.p.hymns.sub(75);
			},
			unlocked() { return hasUpgrade("p", 41) },
		},
		43: {
			title() { return "<b" + getColorClass(this, TITLE) + "Hymn Singing" },
			description: "increases hymn effect exponent<br>(0.15 --> 0.2)",
			costDisplay: "Cost: 1,000,000 holiness<br>and 50,000 hymns",
			canAfford() { return player.p.holiness.gte(1000000) && player.p.hymns.gte(50000) },
			pay() {
				player.p.holiness = player.p.holiness.sub(1000000);
				player.p.hymns = player.p.hymns.sub(50000);
			},
			unlocked() { return hasUpgrade("p", 41) },
		},
		44: {
			title() { return "<b" + getColorClass(this, TITLE, "p", true) + "Hymn Divination" },
			fullDisplay() {
				let text = 'Req: 10,000,000 hymns without owning <b' + getColorClass(this, REF, "p", true) + 'Concise Hymns</b>';
				if (tmp[this.layer].upgrades[this.id].canAfford) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.hymns.gte(10000000) && !hasUpgrade("p", 51) },
			style: {height: '120px', border: '2px dashed', 'border-color': '#FF8800', 'background-color': '#0088FF'},
			unlocked() { return (hasMilestone("s", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) && !hasUpgrade("p", 44) },
		},
		45: {
			title() { return "<b" + getColorClass(this, TITLE) + "Hymn Divination" },
			description() { return 'increases the exponent of <b' + getColorClass(this, REF) + 'Divine Hymns</b><br>(^0.1 --> ^0.125)' },
			cost: 2_500_000,
			currencyInternalName: "hymns",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 44) },
		},
		51: {
			title() { return "<b" + getColorClass(this, TITLE) + "Concise Hymns" },
			description: "decreases hymn requirement<br>(250 --> 200)",
			cost: 1_000_000,
			currencyInternalName: "hymns",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 41) },
		},
		52: {
			title() { return "<b" + getColorClass(this, TITLE) + "Stronger Hymns" },
			description() { return 'increases hymn effect exponent if you have <b' + getColorClass(this, REF) + 'Hymn Singing</b><br>(0.2 --> 0.225)' },
			cost: 10_000_000,
			currencyInternalName: "hymns",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 41) },
		},
		53: {
			title() { return "<b" + getColorClass(this, TITLE) + "Strongest Hymns" },
			description() { return 'increases hymn effect exponent if you have all subsequent upgrades<br>(0.225 --> 0.25)' },
			cost: 100_000_000,
			currencyInternalName: "hymns",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 41) },
		},
		54: {
			title() { return "<b" + getColorClass(this, TITLE, "p", true) + "Hymn Compression" },
			fullDisplay() {
				let text = 'Req: 1e10 hymns without owning <b' + getColorClass(this, REF, "p", true) + 'Holy Hymns</b>';
				if (tmp[this.layer].upgrades[this.id].canAfford) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.hymns.gte(1e10) && !hasUpgrade("p", 61) },
			style: {height: '120px', border: '2px dashed', 'border-color': '#FF8800', 'background-color': '#0088FF'},
			unlocked() { return (hasMilestone("s", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) && !hasUpgrade("p", 54) },
		},
		55: {
			title() { return "<b" + getColorClass(this, TITLE) + "Hymn Compression" },
			description() { return 'decreases hymn requirement if you own <b' + getColorClass(this, REF) + 'Concise Hymns</b><br>(200 --> 175)' },
			cost: 2.5e9,
			currencyInternalName: "hymns",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 54) },
		},
		61: {
			title() { return "<b" + getColorClass(this, TITLE) + "Holy Hymns" },
			description: "multiplies holiness gain based on your hymns",
			effect() { return player.p.hymns.add(1).pow(0.02) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.02';
				return text;
			},
			cost: 1e9,
			currencyInternalName: "hymns",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 41) },
		},
		62: {
			title() { return "<b" + getColorClass(this, TITLE) + "Hymn Deconstruction" },
			description: "multiplies prayer gain based on your hymns",
			effect() { return player.p.hymns.add(10).log(5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: log5(x+10)';
				return text;
			},
			cost: 1e11,
			currencyInternalName: "hymns",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 41) },
		},
		63: {
			title() { return "<b" + getColorClass(this, TITLE) + "Hymn Resolve" },
			description() { return 'multiplies the effect of <b' + getColorClass(this, REF) + 'Hymn Deconstruction</b> based on your essence' },
			effect() { return player.e.points.add(1).pow(0.0015) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.0015';
				return text;
			},
			cost: 1e15,
			currencyInternalName: "hymns",
			currencyLayer: "p",
			unlocked() { return hasUpgrade("p", 41) },
		},
		64: {
			title() { return "<b" + getColorClass(this, TITLE) + "Silver Sanctums" },
			fullDisplay() {
				let text = 'Req: 2.5e25 prayers, 2 sanctums, and all previous research';
				if (tmp[this.layer].upgrades[this.id].canAfford) text += '<br><br><b>Requirements met!';
				return text;
			},
			canAfford() { return player.p.points.gte(2.5e25) && player.s.points.gte(2) && hasUpgrade("p", 15) && hasUpgrade("p", 25) && hasUpgrade("p", 35) && hasUpgrade("p", 45) && hasUpgrade("p", 55) },
			style: {height: '120px', border: '2px dashed', 'border-color': '#FF8800', 'background-color': '#0088FF'},
			unlocked() { return (hasMilestone("s", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) && !hasUpgrade("p", 64) },
		},
		65: {
			title() { return "<b" + getColorClass(this, TITLE) + "Silver Sanctums" },
			description: "reduces sanctum cost scaling<br>(5 --> 4)",
			cost: 1e25,
			unlocked() { return hasUpgrade("p", 64) },
		},
		71: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Divine Sanctums' },
			description: 'multiplies divinity gain after the softcap based on your sanctums',
			cost: 1e30,
			effect() { return player.s.points.mul(30).add(1).pow(0.95) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (30x+1)^0.95';
				return text;
			},
			unlocked() { return (hasMilestone("s", 3) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) },
		},
		72: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Sanctum Sanctions' },
			description: 'multiplies point gain based on your sanctums',
			cost: 1e75,
			effect() { return player.s.points.mul(25).add(1).pow(0.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (25x+1)^0.5';
				return text;
			},
			unlocked() { return (hasMilestone("s", 3) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) },
		},
		73: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Sanctum Prayers' },
			description: 'multiplies prayer gain based on your sanctums',
			cost: 1e125,
			effect() { return player.s.points.mul(2).add(1).pow(1.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (2x+1)^1.5';
				return text;
			},
			unlocked() { return (hasMilestone("s", 3) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) },
		},
		74: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Gold Sanctums' },
			description() { return 'reduces sanctum cost scaling if you have <b' + getColorClass(this, REF) + 'Silver Sanctums</b><br>(4 --> 3.48)' },
			cost: 1e175,
			unlocked() { return (hasMilestone("s", 3) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) },
		},
		81: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Sanctum Prayers+' },
			description: 'multiplies prayer gain based on your sanctums',
			cost: 'e3.75e13',
			effect() { return new Decimal(1e10).pow(player.s.points) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 1e10^x';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) },
		},
		82: {
			title() { return '<b' + getColorClass(this, TITLE) + 'The Point of Prayers' },
			description: 'multiplies point gain based on your prayers',
			cost: 'e3.94e13',
			effect() { return player.p.points.add(1).pow(0.25) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.25';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) },
		},
		83: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Prayer Influence+' },
			description: 'multiplies essence gain based on your prayers',
			cost: 'e4.38e13',
			effect() { return player.p.points.add(1).pow(0.333) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.333';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) },
		},
		84: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Prismatic Sanctums' },
			description() { return 'reduces sanctum cost scaling if you have <b' + getColorClass(this, REF) + 'Gold Sanctums</b><br>(3.48 --> 3.3)' },
			cost: 'e5.01e13',
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("p", 41) },
		},
	},
	clickables: {
		11: {
			title: 'RESET',
			display: "resets your prayer upgrades, divinity, holiness, and hymns (used for if you can't get some researches anymore)",
			canClick() { return true },
			onClick() {
				if (confirm('Are you really sure you want to reset your prayer upgrades, divinity, holiness, and hymns?')) {
					player.p.upgrades = [];
					player.p.divinity = newDecimalZero();
					player.p.holiness = newDecimalZero();
					player.p.hymns = newDecimalZero();
				};
			},
			unlocked() { return hasMilestone("s", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
	},
});

addLayer("s", {
	name: "Sanctum",
	pluralName: "Sanctums",
	symbol: "S",
	row: 2,
	position: 1,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		glow: newDecimalZero(),
		auto_worship: false,
		auto_sacrifice: false,
		auto_sacrificial_ceremony: false,
		auto_glow: false,
		no_speed_but_more_bulk: false,
	}},
	color: "#AAFF00",
	branches: ["r", "gi"],
	requires: 1e15,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "sanctums",
	baseResource: "prayers",
	baseAmount() { return player.p.points },
	type: "static",
	exponent() {
		if (hasUpgrade("p", 65)) {
			if (hasUpgrade("p", 74)) {
				if (hasUpgrade("p", 84)) return 3.3;
				return 3.48;
			};
			return 4;
		};
		return 5;
	},
	canBuyMax() { return hasMilestone("s", 0) || player.r.total.gt(0) || player.w.unlocked },
	gainExp() {
		let gain = newDecimalOne();
		if (tmp.d.devotionEffect.gt(1)) gain = gain.mul(tmp.d.devotionEffect);
		if (tmp.g.glowEffect.gt(1)) gain = gain.mul(tmp.g.glowEffect);
		if (new Decimal(tmp.r.effect[1]).gt(1) && !tmp.r.deactivated) gain = gain.mul(tmp.r.effect[1]);
		if (tmp.gi.effect.gt(1) && !tmp.gi.deactivated && hasMilestone("gi", 19) && player.h.limitsBroken >= 4 && tmp.gi.effect.lte(1e100)) gain = gain.mul(tmp.gi.effect);
		if (new Decimal(tmp.w.effect[1]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[1]);
		if (hasBuyable("mo", 12)) gain = gain.mul(buyableEffect("mo", 12));
		if (hasUpgrade("pl", 52)) gain = gain.mul(upgradeEffect("pl", 52));
		return gain;
	},
	autoPrestige() { return hasMilestone("s", 48) },
	hotkeys: [{key: "s", description: "S: Reset for sanctums", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.p.unlocked || player.s.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	effect() { return new Decimal(2).pow(player.s.points) },
	effectDescription() { return 'which multiplies essence gain by <h2 class="layer-s">' + format(tmp.s.effect) + '</h2>x' },
	doReset(resettingLayer) {
		if (hasMilestone("s", 12) && resettingLayer == "a") return;
		if (hasMilestone("w", 11) && resettingLayer == "w") return;
		if (hasMilestone("cl", 7) && resettingLayer == "cl") return;
		let keep = ["auto_worship", "auto_sacrifice", "auto_sacrificial_ceremony", "no_speed_but_more_bulk", "auto_glow"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (getActivatedRelics() >= 9 && resettingLayer == "r") keep.push("milestones");
		if (layers[resettingLayer].row > this.row) {
			layerDataReset("s", keep);
			layerDataReset("d", keep);
			layerDataReset("g", keep);
			if (hasMilestone("m", 9) && resettingLayer == "m") player.s.milestones = ['0'];
			if (hasMilestone("m", 10) && resettingLayer == "m") {
				let set = 5;
				if (hasMilestone("m", 19)) set = 215;
				else if (hasMilestone("m", 18)) set = 20;
				player.s.points = new Decimal(set);
				player.s.best = new Decimal(set);
				player.s.total = new Decimal(set);
			};
			if (hasMilestone("gi", 6) && resettingLayer == "gi") {
				let set = 4;
				if (hasMilestone("gi", 15)) set = 215;
				else if (hasMilestone("gi", 14)) set = 85;
				else if (hasMilestone("gi", 13)) set = 30;
				else if (hasMilestone("gi", 9)) set = 16;
				else if (hasMilestone("gi", 8)) set = 10;
				else if (hasMilestone("gi", 7)) set = 7;
				player.s.points = new Decimal(set);
				player.s.best = new Decimal(set);
				player.s.total = new Decimal(set);
			};
		};
	},
	resetsNothing() { return hasMilestone("s", 47) },
	tabFormat: {
		Landmarks: {
			content: getTab("s"),
		},
		Devotion: {
			content: getUnlockableTab("s", "Devotion"),
			unlocked() { return hasMilestone("s", 13) },
		},
		Glow: {
			content: getUnlockableTab("s", "Glow"),
			unlocked() { return isAssimilated("s") || player.mo.assimilating === "s" },
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription: "you can buy max sanctums and <b>research</b> 6 new prayer upgrades",
			},
			1: {
				requirement: 2,
				effectDescription: "you can autobuy core upgrades",
				toggles: [["c", "auto_upgrades"]],
			},
			2: {
				requirement: 3,
				effectDescription: "you can autobuy core rebuyables",
				toggles: [["c", "auto_buyables"]],
			},
			3: {
				requirement: 4,
				effectDescription: "unlock 4 new prayer upgrades",
			},
			4: {
				requirement: 5,
				effectDescription: "you can autobuy quark upgrades",
				toggles: [["q", "auto_upgrades"]],
			},
			5: {
				requirement: 6,
				effectDescription: "you can autobuy prayer upgrades",
				toggles: [["p", "auto_upgrades"]],
			},
			6: {
				requirement: 7,
				effectDescription: "unlock an option to make the prayer upgrade autobuyer be smart",
				toggles: [["p", "smart_auto_upgrades"]],
			},
			7: {
				requirement: 8,
				effectDescription: "gain 0.5% of your prayer gain per second",
			},
			8: {
				requirement: 9,
				effectDescription: "gain 0.2% of your holiness and hymn gain per second",
			},
			9: {
				requirement: 10,
				effectDescription: "gain 0.1% of your hex gain per second",
			},
			10: {
				requirement: 14,
				effectDescription: "gain 0.001% of your demon soul gain per second",
			},
			11: {
				requirement: 16,
				effectDescription: "subatomic particles reset nothing and perform subatomic particle resets automatically",
			},
			12: {
				requirement: 18,
				effectDescription: "atom resets don't reset sanctums",
			},
			13: {
				requirement: 19,
				effectDescription() { return "unlock <b" + getColorClass(this, REF) + "Devotion" },
			},
			14: {
				requirement: 22,
				effectDescription() { return "unlock <b" + getColorClass(this, REF) + "Sacrificial Ceremonies" },
			},
			15: {
				requirement: 24,
				effectDescription: "gain +4.5% of prayer gain per second",
			},
			16: {
				requirement: 25,
				effectDescription: "gain +2.3% of holiness and hymn gain per second",
			},
			17: {
				requirement: 26,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Worship</b> cost scaling by 15" },
			},
			18: {
				requirement: 27,
				effectDescription() { return "increase <b" + getColorClass(this, REF) + "Devotion</b> effect exponent (0.3 --> 0.375)" },
			},
			19: {
				requirement: 30,
				effectDescription() { return "you can auto <b" + getColorClass(this, REF) + 'Worship' },
				toggles: [["s", "auto_worship"]],
			},
			20: {
				requirement: 31,
				effectDescription: "sanctum resets don't reset essence",
			},
			21: {
				requirement: 32,
				effectDescription() { return "increase <b" + getColorClass(this, REF) + "Devotion</b> effect exponent (0.375 --> 0.45)" },
			},
			22: {
				requirement: 35,
				effectDescription() { return "increase <b" + getColorClass(this, REF) + "Devotion</b> effect exponent (0.45 --> 0.55)" },
			},
			23: {
				requirement: 39,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Worship</b> cost scaling by 2" },
			},
			24: {
				requirement: 42,
				effectDescription() { return "double <b" + getColorClass(this, REF) + "Sacrifice</b>'s effect" },
			},
			25: {
				requirement: 43,
				effectDescription: "keep row 2 milestones on sanctum resets",
			},
			26: {
				requirement: 44,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Sacrifice</b> cost scaling by 2" },
			},
			27: {
				requirement: 46,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Sacrificial Ceremony</b> cost scaling by 2" },
			},
			28: {
				requirement: 49,
				effectDescription() { return "you can auto perform <b" + getColorClass(this, REF) + "Sacrificial Ceremonies" },
				toggles: [["s", "auto_sacrificial_ceremony"]],
			},
			29: {
				requirement: 50,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Sacrificial Ceremony</b> cost scaling by 1.5" },
			},
			30: {
				requirement: 53,
				effectDescription: "double light gain",
			},
			31: {
				requirement: 66,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Sacrificial Ceremony</b> cost scaling by 1.2" },
			},
			32: {
				requirement: 69,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Worship</b> cost by 1e100" },
			},
			33: {
				requirement: 70,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Sacrifice</b> cost scaling by 1.6" },
			},
			34: {
				requirement: 71,
				effectDescription() { return "change <b" + getColorClass(this, REF) + "Sacrifice</b>'s cost to a requirement" },
			},
			35: {
				requirement: 72,
				effectDescription() { return "increase <b" + getColorClass(this, REF) + "Devotion</b> effect exponent (0.55 --> 0.575)" },
			},
			36: {
				requirement: 77,
				effectDescription() { return "increase <b" + getColorClass(this, REF) + "Devotion</b> effect exponent (0.575 --> 0.6)" },
			},
			37: {
				requirement: 80,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Sacrifice</b> cost scaling by 2" },
			},
			38: {
				requirement: 85,
				effectDescription() { return "you can auto <b" + getColorClass(this, REF) + "Sacrifice" },
				toggles: [["s", "auto_sacrifice"]],
			},
			39: {
				requirement: 87,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Sacrifice</b> cost scaling by 2" },
			},
			40: {
				requirement: 96,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Worship</b> cost scaling by 1.5" },
			},
			41: {
				requirement: 100,
				effectDescription: "triple light gain",
			},
			42: {
				requirement: 110,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Sacrificial Ceremony</b> cost scaling by 1.5" },
			},
			43: {
				requirement: 112,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Sacrificial Ceremony</b> hex cost scaling by 3" },
			},
			44: {
				requirement: 120,
				effectDescription() { return "auto <b" + getColorClass(this, REF) + "Worship</b> works twice as fast" },
			},
			45: {
				requirement: 125,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Sacrificial Ceremony</b> hex cost scaling by 4" },
			},
			46: {
				requirement: 140,
				effectDescription() { return "auto <b" + getColorClass(this, REF) + "Worship</b> works twice as fast (4x total)" },
			},
			47: {
				requirement: 161,
				effectDescription: "sanctums reset nothing",
			},
			48: {
				requirement: 164,
				effectDescription: "perform sanctum resets automatically",
			},
			49: {
				requirement: 175,
				effectDescription() { return "increase <b" + getColorClass(this, REF) + "Devotion</b> effect exponent (0.6 --> 0.625)" },
			},
			50: {
				requirement: 190,
				effectDescription: "triple light gain",
			},
			51: {
				requirement: 200,
				effectDescription() { return "auto <b" + getColorClass(this, REF) + "Worship</b> works thrice as fast (12x total)" },
			},
			52: {
				requirement: 210,
				effectDescription: "triple light gain",
			},
			53: {
				requirement: 215,
				effectDescription() { return "increase <b" + getColorClass(this, REF) + "Devotion</b> effect exponent (0.625 --> 0.666)" },
			},
		};
		const done = req => player.s.points.gte(req);
		const doneAndUnlocked = req => player.s.points.gte(req) && hasMilestone("m", 8);
		const unlocked1 = () => hasMilestone("s", 13);
		const unlocked2 = () => hasMilestone("s", 13) && hasMilestone("m", 8);
		for (const key in obj) {
			obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " sanctum" + (obj[key].requirement === 1 ? "" : "s");
			if (+key >= 51) obj[key].done = doneAndUnlocked.bind(null, obj[key].requirement);
			else obj[key].done = done.bind(null, obj[key].requirement);
			delete obj[key].requirement;
			if (+key >= 51) obj[key].unlocked = unlocked2;
			else if (+key >= 14) obj[key].unlocked = unlocked1;
		};
		return obj;
	})(),
});

addLayer("d", {
	name: "Devotion",
	symbol: "D",
	row: 2,
	position: 3,
	color: "#AAFF00",
	layerShown() { return false },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate("s") },
	automate() {
		if (hasMilestone("cl", 1) && player.s.no_speed_but_more_bulk) {
			if (hasMilestone("s", 19) && player.s.auto_worship) buyBuyable("d", 11);
			if (hasMilestone("s", 38) && player.s.auto_sacrifice) buyBuyable("d", 12);
			if (hasMilestone("s", 28) && player.s.auto_sacrificial_ceremony) buyBuyable("d", 21);
		} else {
			if (hasMilestone("s", 19) && player.s.auto_worship) {
				let work = 1;
				if (hasMilestone("s", 44)) work *= 2;
				if (hasMilestone("s", 46)) work *= 2;
				if (hasMilestone("s", 51)) work *= 3;
				if (getActivatedRelics() >= 17) work *= 2;
				if (getActivatedRelics() >= 38) work *= 2;
				if (hasMilestone("gi", 10)) work *= 2;
				for (let index = 0; index < work && canBuyBuyable("d", 11); index++) {
					buyBuyable("d", 11);
				};
			};
			if (hasMilestone("s", 38) && player.s.auto_sacrifice) {
				let work = 1;
				if (getActivatedRelics() >= 17) work *= 2;
				if (getActivatedRelics() >= 22) work *= 2;
				if (getActivatedRelics() >= 23) work *= 1.5;
				if (getActivatedRelics() >= 32) work *= 2;
				if (getActivatedRelics() >= 38) work *= 2;
				if (hasMilestone("gi", 10)) work *= 2;
				for (let index = 0; index < work && canBuyBuyable("d", 12); index++) {
					buyBuyable("d", 12);
				};
			};
			if (hasMilestone("s", 28) && player.s.auto_sacrificial_ceremony) {
				let work = 1;
				if (getActivatedRelics() >= 17) work *= 2;
				if (getActivatedRelics() >= 38) work *= 2;
				if (hasMilestone("gi", 10)) work *= 2;
				for (let index = 0; index < work && canBuyBuyable("d", 21); index++) {
					buyBuyable("d", 21);
				};
			};
		};
	},
	doReset(resettingLayer) {},
	update(diff) {
		if (player.d.buyables[11].gt(tmp.d.buyables[11].purchaseLimit)) player.d.buyables[11] = new Decimal(tmp.d.buyables[11].purchaseLimit);
		if (player.d.buyables[12].gt(tmp.d.buyables[12].purchaseLimit)) player.d.buyables[12] = new Decimal(tmp.d.buyables[12].purchaseLimit);
		if (player.d.buyables[21].gt(tmp.d.buyables[21].purchaseLimit)) player.d.buyables[21] = new Decimal(tmp.d.buyables[21].purchaseLimit);
	},
	devotion() { return tmp.d.buyables[11].devotion.add(tmp.d.buyables[12].devotion).add(tmp.d.buyables[21].devotion) },
	devotionEffect() {
		let exp = 0.3;
		if (hasMilestone("s", 53)) exp = 0.666;
		else if (hasMilestone("s", 49)) exp = 0.625;
		else if (hasMilestone("s", 36)) exp = 0.6;
		else if (hasMilestone("s", 35)) exp = 0.575;
		else if (hasMilestone("s", 22)) exp = 0.55;
		else if (hasMilestone("s", 21)) exp = 0.45;
		else if (hasMilestone("s", 18)) exp = 0.375;
		return tmp.d.devotion.add(1).pow(exp);
	},
	componentStyles: {
		buyable: {'border-radius': '50%'},
	},
	buyables: {
		11: {
			cost(x) {
				let div = buyableEffect("d", 21)[2];
				if (div === undefined) div = newDecimalOne();
				if (hasMilestone("s", 32)) div = div.mul(1e100);
				let scale = new Decimal(50);
				if (hasMilestone("s", 17)) scale = scale.div(15);
				if (hasMilestone("s", 23)) scale = scale.div(2);
				if (hasMilestone("s", 40)) scale = scale.div(1.5);
				return new Decimal(10).pow(x.add(1).mul(scale)).mul(1e50).div(div);
			},
			title() { return '<b' + getColorClass(this, TITLE, "s") + 'Worship<br>' },
			description: 'use prayers to worship the gods. you will gain 0.1 devotion per worship.',
			canAfford() { return player.p.points.gte(this.cost()) },
			purchaseLimit: 1e9,
			buy() { buyStandardBuyable(this, "p", 'points', getDevotionBuyableBulk()) },
			devotion() { return getBuyableAmount(this.layer, this.id).mul(0.1) },
			costDisplay(cost) { return 'Devotion Reward: ' + format(this.devotion()) + '<br><br>Cost: ' + formatWhole(cost) + ' prayers' },
			boughtDisplay(x) { return 'Times Worshipped:<br>' + formatWhole(x) + '/' + formatWhole(this.purchaseLimit) },
			style() {
				let backColors = '#224400, #336600';
				if (tmp[this.layer].buyables[this.id].canBuy) backColors = '#112200, #448800';
				let textColor = '#AAFF00';
				if (colorValue[1] == "none") textColor = '#DFDFDF';
				return {'background-image': 'radial-gradient(' + backColors + ')', color: textColor};
			},
			unlocked() { return hasMilestone("s", 13) },
		},
		12: {
			cost(x) {
				let scale = newDecimalOne();
				if (hasMilestone("s", 26)) scale = scale.div(2);
				if (hasMilestone("s", 33)) scale = scale.div(1.6);
				if (hasMilestone("s", 37)) scale = scale.div(2);
				if (hasMilestone("s", 39)) scale = scale.div(2);
				return x.mul(scale).add(20).floor();
			},
			title() { return '<b' + getColorClass(this, TITLE, "s") + 'Sacrifice<br>' },
			description() { return "use sanctums as a sacrifice to worship the gods. you will gain<br>" + (hasMilestone("s", 24) ? "1" : "0.5") + " devotion per sacrifice.<br>each sacrifice also multiplies relic's first effect by " + (hasMilestone("s", 24) ? "2" : "1.5") + "." },
			canAfford() { return player.s.points.gte(this.cost()) },
			purchaseLimit: 1e9,
			buy() {
				if (!hasMilestone("s", 34)) player.s.points = player.s.points.sub(this.cost());
				addBuyables(this.layer, this.id, getDevotionBuyableBulk());
			},
			effect(x) { return new Decimal(2).pow(x) },
			devotion() {
				if (hasMilestone("s", 24)) return getBuyableAmount(this.layer, this.id);
				return getBuyableAmount(this.layer, this.id).mul(0.5);
			},
			effectDisplay(eff) { return format(eff) + 'x' },
			costDisplay(cost) { return 'Devotion Reward: ' + format(this.devotion()) + '<br><br>' + (hasMilestone("s", 34) ? 'Req' : 'Cost') + ': '  + formatWhole(cost) + ' sanctums' },
			boughtDisplay(x) { return 'Times Sacrificed:' + (formatWhole(x).length >= 8 ? '<br>' : ' ') + formatWhole(x) + '<br>/' + formatWhole(this.purchaseLimit) },
			style() {
				let backColors = '#224400, #336600';
				if (tmp[this.layer].buyables[this.id].canBuy) backColors = '#112200, #448800';
				let textColor = '#AAFF00';
				if (colorValue[1] == "none") textColor = '#DFDFDF';
				return {'background-image': 'radial-gradient(' + backColors + ')', color: textColor};
			},
			unlocked() { return hasMilestone("s", 13) },
		},
		21: {
			cost_h() {
				let scale = new Decimal(50);
				if (hasMilestone("s", 27)) scale = scale.div(2);
				if (hasMilestone("s", 29)) scale = scale.div(1.5);
				if (hasMilestone("s", 31)) scale = scale.div(1.2);
				if (hasMilestone("s", 42)) scale = scale.div(1.5);
				if (hasMilestone("s", 43)) scale = scale.div(3);
				if (hasMilestone("s", 45)) scale = scale.div(4);
				return new Decimal(10).pow(getBuyableAmount(this.layer, this.id).mul(scale)).mul(1e50);
			},
			cost_sp() {
				let scale = newDecimalOne();
				if (hasMilestone("s", 27)) scale = scale.div(2);
				if (hasMilestone("s", 29)) scale = scale.div(1.5);
				if (hasMilestone("s", 31)) scale = scale.div(1.2);
				if (hasMilestone("s", 42)) scale = scale.div(1.5);
				return getBuyableAmount(this.layer, this.id).mul(scale).add(1).mul(1e15).floor();
			},
			title() { return '<b' + getColorClass(this, TITLE, "s") + 'Sacrificial Ceremony<br>' },
			description: 'use hexes and subatomic particles in a sacrificial ceremony to worship the gods. you will gain 0.75 devotion per sacrificial ceremony. each sacrificial ceremony also multiplies subatomic particle gain by 1 (additive), light gain by 1 (additive), and divides worship cost by 1e25 (multiplicative, like normal).',
			canAfford() { return player.h.points.gte(this.cost_h()) && player.sp.points.gte(this.cost_sp()) },
			purchaseLimit: 1e9,
			buy() {
				player.h.points = player.h.points.sub(this.cost_h());
				player.sp.points = player.sp.points.sub(this.cost_sp());
				addBuyables(this.layer, this.id, getDevotionBuyableBulk());
			},
			effect(x) {
				if (getActivatedRelics() >= 5 && challengeEffect("r", 11)[2]) return [undefined, x.add(1), new Decimal(1e25).mul(challengeEffect("r", 11)[2]).pow(x)];
				return [undefined, x.add(1), new Decimal(1e25).pow(x)];
			},
			devotion() { return getBuyableAmount(this.layer, this.id).mul(0.75) },
			effectDisplay(eff) { return format(eff[1]) + 'x,<br>' + format(eff[1]) + 'x,<br>and /' + format(eff[2]) },
			costDisplay(cost) { return 'Devotion Reward: ' + format(this.devotion()) + '<br><br>Cost: ' + formatWhole(this.cost_h()) + ' hexes<br>and ' + formatWhole(this.cost_sp()) + ' subatomic particles' },
			boughtDisplay(x) { return 'Ceremonies Performed: ' + formatWhole(x) + '/' + formatWhole(this.purchaseLimit) },
			style() {
				let backColors = '#224400, #336600';
				if (tmp[this.layer].buyables[this.id].canBuy) backColors = '#112200, #448800';
				let textColor = '#AAFF00';
				if (colorValue[1] == "none") textColor = '#DFDFDF';
				return {width: '300px', height: '300px', 'background-image': 'radial-gradient(' + backColors + ')', 'padding': '10px', color: textColor};
			},
			unlocked() { return hasMilestone("s", 14) },
		},
	},
});

addLayer("g", {
	name: "Glow",
	symbol: "G",
	row: 2,
	position: 4,
	color: "#AAFF00",
	layerShown() { return false },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate("s")},
	automate() {
		if (hasMilestone("ch", 24) && player.s.auto_glow) {
			buyBuyable("g", 11);
			buyBuyable("g", 12);
			buyBuyable("g", 21);
		};
	},
	doReset(resettingLayer) {},
	glowGain() {
		// init
		let gain = buyableEffect("g", 11).mul(buyableEffect("g", 12)).mul(buyableEffect("g", 21)[0]);
		// mul
		if (hasUpgrade("gi", 13)) gain = gain.mul(upgradeEffect("gi", 13));
		if (tmp.gi.effect.gt(1) && !tmp.gi.deactivated && hasMilestone("gi", 19) && player.h.limitsBroken >= 4 && tmp.gi.effect.lte(1e100)) gain = gain.mul(tmp.gi.effect);
		if (hasMilestone("ch", 21)) gain = gain.mul(10);
		if (hasBuyable("r", 11)) gain = gain.mul(buyableEffect("r", 11));
		// pow
		if (hasChallenge("ei", 21) && (isAssimilated("ei") || player.mo.assimilating === "ei")) gain = gain.pow(1.1);
		// return
		return gain;
	},
	glowMax() {
		let max = new Decimal(1000).mul(buyableEffect("g", 21)[1]);
		if (hasBuyable("r", 11)) max = max.mul(buyableEffect("r", 11));
		return max;
	},
	update(diff) { player.s.glow = player.s.glow.add(tmp.g.glowGain.mul(diff)).min(tmp.g.glowMax) },
	glowEffect() { return player.s.glow.mul(1000).add(1).pow(0.1) },
	componentStyles: {
		buyable: {'border-radius': '50%'},
	},
	buyables: {
		11: {
			cost(x) { return new Decimal(10).pow(new Decimal(10).pow(x.div(3).add(3))) },
			title() { return '<b' + getColorClass(this, TITLE, "s") + 'Glowing<br>Worship<br>' },
			description: 'use prayers to worship the gods. each worship increases your glow gain by 1.',
			canAfford() { return player.p.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this, "p") },
			effect(x) { return x },
			effectDisplay(eff) { return format(eff) + '/sec' },
			currencyDisplayName: 'prayers',
			boughtDisplay(x) { return 'Times Worshipped: ' + formatWhole(x) + '/' + formatWhole(this.purchaseLimit) },
			style() {
				let backColors = '#224400, #336600';
				if (tmp[this.layer].buyables[this.id].canBuy) backColors = '#112200, #448800';
				let textColor = '#AAFF00';
				if (colorValue[1] == "none") textColor = '#DFDFDF';
				return {'background-image': 'radial-gradient(' + backColors + ')', color: textColor};
			},
			unlocked() { return isAssimilated("s") || player.mo.assimilating === "s" },
		},
		12: {
			cost(x) { return new Decimal(5).pow(x.add(3)) },
			title() { return '<b' + getColorClass(this, TITLE, "s") + 'Glowing<br>Sacrifice<br>' },
			description: 'use glow as a sacrifice to worship the gods. each sacrifice multiplies your glow gain by 2.',
			canAfford() { return player.s.glow.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this, "s", 'glow') },
			effect(x) { return new Decimal(2).pow(x) },
			effectDisplay(eff) { return format(eff) + 'x' },
			currencyDisplayName: 'glow',
			boughtDisplay(x) { return 'Times Sacrificed: ' + formatWhole(x) + '/' + formatWhole(this.purchaseLimit) },
			style() {
				let backColors = '#224400, #336600';
				if (tmp[this.layer].buyables[this.id].canBuy) backColors = '#112200, #448800';
				let textColor = '#AAFF00';
				if (colorValue[1] == "none") textColor = '#DFDFDF';
				return {'background-image': 'radial-gradient(' + backColors + ')', color: textColor};
			},
			unlocked() { return isAssimilated("s") || player.mo.assimilating === "s" },
		},
		21: {
			cost(x) {
				let exp = newDecimalOne();
				if (hasUpgrade("gi", 12)) exp = exp.mul(upgradeEffect("gi", 12));
				if (x.gte(14)) return new Decimal(10).pow(new Decimal(10).pow(x.div(2).add(10))).pow(exp);
				if (x.gte(12)) return new Decimal('e1e11').pow(x.add(1).pow(5)).pow(exp);
				return new Decimal('e1e14').pow(x.add(1).pow(2)).pow(exp);
			},
			title() { return '<b' + getColorClass(this, TITLE, "s") + 'Glowing Sacrificial Ceremony<br>' },
			description: 'use essence in a sacrificial ceremony to worship the gods. each sacrifice multiplies your glow gain by 2.5, your maximum glow by 10, and your light gain after hardcap by the amount of your glowing worships plus 1.',
			canAfford() { return player.e.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this, "e") },
			effect(x) { return [new Decimal(2.5).pow(x), new Decimal(10).pow(x), getBuyableAmount("g", 11).add(1).pow(x)] },
			effectDisplay(eff) { return format(eff[0]) + 'x,<br>' + format(eff[1]) + 'x,<br>and ' + format(eff[2]) + 'x' },
			currencyDisplayName: 'essence',
			boughtDisplay(x) { return 'Ceremonies Performed: ' + formatWhole(x) + '/' + formatWhole(this.purchaseLimit) },
			style() {
				let backColors = '#224400, #336600';
				if (tmp[this.layer].buyables[this.id].canBuy) backColors = '#112200, #448800';
				let textColor = '#AAFF00';
				if (colorValue[1] == "none") textColor = '#DFDFDF';
				return {width: '300px', height: '300px', 'background-image': 'radial-gradient(' + backColors + ')', 'padding': '10px', color: textColor};
			},
			unlocked() { return isAssimilated("s") || player.mo.assimilating === "s" },
		},
	},
});

addLayer("r", {
	name: "Relic",
	pluralName: "Relics",
	symbol: "R",
	row: 3,
	position: 1,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		light: newDecimalZero(),
		lightGainBest: newDecimalZero(),
		auto_activate: false,
		auto_upgrade_1: false,
		auto_upgrade_2: false,
		auto_upgrade_3: false,
		auto_buyables: false,
	}},
	color: "#B9A975",
	branches: ["gi"],
	tooltip() {
		if (options.nerdMode) return formatWhole(getActivatedRelics()) + ' activated relics and ' + formatWhole(player.r.points) + ' total relics';
		return formatWhole(player.r.points) + ' relics';
	},
	requires: 10,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "relics",
	baseResource: "sanctums",
	baseAmount() { return player.s.points },
	type: "static",
	exponent: 0.66,
	canBuyMax() { return true },
	gainExp() {
		let gain = newDecimalOne();
		if (hasUpgrade("m", 43)) gain = gain.mul(upgradeEffect("m", 43));
		if (getActivatedRelics() >= 13 && challengeEffect("r", 11)[3]) gain = gain.mul(challengeEffect("r", 11)[3]);
		if (hasUpgrade("ei", 34)) gain = gain.mul(upgradeEffect("ei", 34));
		if (new Decimal(tmp.w.effect[1]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[1]);
		return gain;
	},
	autoPrestige() { return hasMilestone("w", 4) },
	hotkeys: [{key: "r", description: "R: Reset for relics", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.s.unlocked || player.r.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	automate() {
		if (hasMilestone("w", 3) && player.r.auto_activate) {
			if (layers.r.challenges[11].canComplete()) player.r.challenges[11] += getRelicActivationBulk();
		};
		if (hasMilestone("w", 4) && player.r.auto_upgrade_1) buyUpgrade("r", 11);
		if (hasMilestone("w", 4) && player.r.auto_upgrade_2) buyUpgrade("r", 12);
		if (hasMilestone("w", 4) && player.r.auto_upgrade_3) buyUpgrade("r", 13);
		if (hasMilestone("pl", 0) && player[this.layer].auto_buyables) {
			updateBuyableTemp(this.layer);
			for (const id in layers[this.layer].buyables) {
				buyBuyable(this.layer, id);
			};
		};
	},
	effect() {
		let effBoost1 = newDecimalOne();
		let effex1 = newDecimalOne();
		let effBoost2 = newDecimalOne();
		let effBoost3 = newDecimalOne();
		if (hasBuyable("d", 12)) effBoost1 = effBoost1.mul(buyableEffect("d", 12));
		if (getActivatedRelics() >= 3) {
			effBoost1 = effBoost1.mul(10000);
			effex1 = new Decimal(3.5);
		};
		if (getActivatedRelics() >= 4 && challengeEffect("r", 11)[1]) effex1 = effex1.mul(challengeEffect("r", 11)[1]);
		if (getActivatedRelics() >= 6) effex1 = effex1.mul(5);
		if (getActivatedRelics() >= 1 && challengeEffect("r", 11)[0]) {
			effBoost2 = effBoost2.mul(challengeEffect("r", 11)[0]);
			effBoost3 = effBoost3.mul(challengeEffect("r", 11)[0]);
		};
		let eff1 = player.r.points.mul(effBoost1).add(1).pow(1.1).pow(effex1);
		if (eff1.gt(softcaps.r_eff1[0]) && !(isAssimilated("r") || player.mo.assimilating === "r")) {
			eff1 = eff1.div(softcaps.r_eff1[0]).pow(softcaps.r_eff1[1]).mul(softcaps.r_eff1[0]);
		};
		return [eff1, player.r.points.add(1).pow(0.5).mul(effBoost2), player.r.points.mul(100).add(1).pow(0.25).mul(effBoost3)];
	},
	effectDescription() {
		let text = ["", ""];
		if (tmp.r.effect[0].gte(softcaps.r_eff1[0]) && !(isAssimilated("r") || player.mo.assimilating === "r")) text[0] = ' (softcapped)';
		if (getActivatedRelics() >= 2) text[1] = 'point and ';
		return 'which makes <b' + getColorClass(this, REF, "e", true) + 'Essence Influence\'s</b> hardcap start <h2 class="layer-r">' + format(tmp.r.effect[0]) + '</h2>x later' + text[0] + ', multiplies sanctum gain by <h2 class="layer-r">' + format(tmp.r.effect[1]) + '</h2>x, and also multiplies ' + text[1] + 'essence gain by <h2 class="layer-r">' + format(tmp.r.effect[2]) + '</h2>x';
	},
	doReset(resettingLayer) {
		if (hasMilestone("m", 0) && resettingLayer == "m") return;
		if (hasMilestone("gi", 0) && resettingLayer == "gi") return;
		if (hasMilestone("ei", 0) && resettingLayer == "ei") return;
		if (hasMilestone("w", 5) && resettingLayer == "w") return;
		if (hasMilestone("cl", 1) && resettingLayer == "cl") return;
		let keep = ["auto_activate", "auto_upgrade_1", "auto_upgrade_2", "auto_upgrade_3", "auto_buyables"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		let save = 0;
		if (hasMilestone("w", 2) && resettingLayer == "w") {
			save = getActivatedRelics();
		};
		if (layers[resettingLayer].row > this.row) layerDataReset("r", keep);
		if (save > 0) {
			player.r.points = new Decimal(save);
			player.r.best = new Decimal(save);
			player.r.total = new Decimal(save);
			player.r.challenges[11] = save;
		};
	},
	resetsNothing() { return hasMilestone("w", 4) },
	lightGain(activating = inChallenge("r", 11)) {
		// init
		let gain = newDecimalZero();
		// active
		if (activating) {
			// base
			if (hasUpgrade("r", 13)) {
				gain = upgradeEffect("r", 13);
			} else {
				gain = getPointGen().pow(0.001).div(10);
				// mul (before hardcap)
				if (hasUpgrade("r", 11)) gain = gain.mul(upgradeEffect("r", 11));
				if (hasUpgrade("r", 12)) gain = gain.mul(upgradeEffect("r", 12));
				if (hasBuyable("d", 21)) gain = gain.mul(buyableEffect("d", 21)[1]);
				if (hasMilestone("s", 30)) gain = gain.mul(2);
				if (hasMilestone("s", 41)) gain = gain.mul(3);
				if (hasMilestone("s", 50)) gain = gain.mul(3);
				if (hasMilestone("s", 52)) gain = gain.mul(3);
				// hardcap
				if (gain.gt(1e25)) gain = new Decimal(1e25);
			};
			// mul (after hardcap)
			if (tmp.g.glowEffect.gt(1)) gain = gain.mul(tmp.g.glowEffect);
			if (hasBuyable("g", 21)) gain = gain.mul(buyableEffect("g", 21)[2]);
			if (new Decimal(tmp.w.effect[2]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[2]);
			if (hasBuyable("r", 12)) gain = gain.mul(buyableEffect("r", 12));
			if (hasUpgrade("m", 61)) gain = gain.mul(upgradeEffect("m", 61));
			if (hasUpgrade("pl", 54)) gain = gain.mul(upgradeEffect("pl", 54));
			// pow (after hardcap)
			if (hasMilestone("mo", 3)) gain = gain.pow(1.2);
		};
		// add portion of best
		let portion = 0;
		if (hasMilestone("m", 17)) portion = 0.1;
		else if (hasMilestone("m", 16)) portion = 0.05;
		else if (hasMilestone("m", 15)) portion = 0.025;
		else if (hasMilestone("m", 7)) portion = 0.01;
		else if (hasMilestone("m", 3)) portion = 0.001;
		if (portion > 0) {
			gain = gain.add(player.r.lightGainBest.mul(portion));
		};
		// return
		return gain;
	},
	update(diff) {
		// generate light
		player.r.light = player.r.light.add(tmp.r.lightGain.mul(diff));
		// update best light gain
		if (hasMilestone("w", 3) && player.r.auto_activate) {
			const potentialLightGain = layers.r.lightGain(true);
			if (potentialLightGain.gt(player.r.lightGainBest)) player.r.lightGainBest = potentialLightGain;
		} else {
			if (tmp.r.lightGain.gt(player.r.lightGainBest)) player.r.lightGainBest = tmp.r.lightGain;
		};
		// round up activation to bulk
		const bulk = getRelicActivationBulk();
		if (bulk > 1) player.r.challenges[11] = Math.ceil(player.r.challenges[11] / bulk) * bulk;
	},
	tabFormat: {
		Activation: {
			content: getTab("r"),
		},
		"The Prism": {
			content: getTab("r", "The Prism"),
			unlocked() { return isAssimilated("r") || player.mo.assimilating === "r" },
		},
	},
	challenges: {
		11: {
			name() { return '<h3' + getColorClass(this, TITLE, "r", true) + 'Activate Relics' },
			buttonText: ["Activate", "Cannot activate", "Enter activation", "Enter activation"],
			challengeDescription: 'Temporarily converts all your point production into light production. Get enough light, and you can activate your relics for rewards.<br>',
			goalDescription() {
				let text = "";
				if (tmp.r.lightGain.gte(1e25) && !hasUpgrade("r", 13)) {
					if (maxedChallenge(this.layer, this.id)) text = 'You have ' + format(player.r.light) + ' light.<br>(' + format(tmp.r.lightGain) + '/sec - hardcapped at 1e25)<br>';
					else text = 'You have ' + format(player.r.light) + '/' + format(getActivationReq()) + ' light.<br>(' + format(tmp.r.lightGain) + '/sec - hardcapped at 1e25)<br>';
				} else {
					if (maxedChallenge(this.layer, this.id)) text = 'You have ' + format(player.r.light) + ' light.<br>(' + format(tmp.r.lightGain) + '/sec)<br>';
					else text = 'You have ' + format(player.r.light) + '/' + format(getActivationReq()) + ' light.<br>(' + format(tmp.r.lightGain) + '/sec)<br>';
				};
				if (options.nerdMode) text += 'Best: (' + format(player.r.lightGainBest) + '/sec)<br>';
				return text;
			},
			rewardDescription() {
				const completions = challengeCompletions(this.layer, this.id);
				const effects = challengeEffect(this.layer, this.id);
				let text = "";
				// current rewards
				if (completions >= 13) text += 'multiply relic\'s second and third effects and molecule gain, exponentiate relic\'s first effect, multiply Sacrificial Ceremony\'s last effect, and also multiply relic gain (all based on your light)<br>Currently: ' + format(effects[0]) + 'x,<br>^' + format(effects[1]) + (effects[1]?.eq(100) ? ' (capped)' : "") + ',<br>' + format(effects[2]) + 'x,<br>and ' + format(effects[3]) + 'x';
				else if (completions >= 12) text += 'multiply relic\'s second and third effects and molecule gain, exponentiate relic\'s first effect, and also multiply Sacrificial Ceremony\'s last effect (all based on your light)<br>Currently: ' + format(effects[0]) + 'x,<br>^' + format(effects[1]) + (effects[1]?.eq(100) ? ' (capped)' : "") + ',<br>and ' + format(effects[2]) + 'x';
				else if (completions >= 5) text += 'multiply relic\'s second and third effects, exponentiate relic\'s first effect, and also multiply Sacrificial Ceremony\'s last effect (all based on your light)<br>Currently: ' + format(effects[0]) + 'x,<br>^' + format(effects[1]) + (effects[1]?.eq(100) ? ' (capped)' : "") + ',<br>and ' + format(effects[2]) + 'x';
				else if (completions >= 4) text += 'multiply relic\'s second and third effects based on your light, and also exponentiate relic\'s first effect based on your light<br>Currently: ' + format(effects[0]) + 'x<br>and ^' + format(effects[1]) + (effects[1]?.eq(100) ? ' (capped)' : "");
				else if (completions >= 1) text += 'multiply relic\'s second and third effects based on your light<br>Currently: ' + format(effects[0]) + 'x';
				else text += 'nothing currently';
				// next reward
				text += '<br><br>Next reward: ';
				if (completions == 0) text += "multiply relic's second and third effects based on your light<br>Currently: " + format(effects[0]) + "x";
				else if (completions == 1) text += "relic's third effect also affects point gain";
				else if (completions == 2) text += "multiply relic's first effect by 10,000 and raise it to ^3.5";
				else if (completions == 3) text += "exponentiate relic's first effect based on your light<br>Currently: ^" + format(effects[1]);
				else if (completions == 4) text += "multiply Sacrificial Ceremony's last effect based on your light<br>Currently: " + format(effects[2]) + "x";
				else if (completions == 5) text += "raise relic's first effect to ^5";
				else if (completions == 6) text += 'quadruple the third activated relic effect';
				else if (completions == 7) text += 'double the third activated relic effect';
				else if (completions == 8) text += 'keep sanctum milestones on relic resets';
				else if (completions == 9) text += 'unlock Molecules' + (player.m.unlocked ? ' (already unlocked)' : "");
				else if (completions == 10) text += 'double the first activated relic effect';
				else if (completions == 11) text += 'the first activated relic effect also applies to molecule gain';
				else if (completions == 12) text += 'multiply relic gain based on your light<br>Currently: ' + format(effects[3]) + 'x';
				else if (completions == 13) text += 'double the first activated relic effect';
				else if (completions == 14) text += 'multiply the first activated relic<br>effect by 1.2';
				else if (completions == 15) text += 'multiply the first activated relic<br>effect by 1.1';
				else if (completions == 16) text += 'all <b' + getColorClass(this, REF, "s") + 'Devotion</b> autobuyers work<br>twice as fast';
				else if (completions == 17) text += 'multiply the first activated relic<br>effect by 1.05';
				else if (completions == 18) text += 'multiply the first activated relic<br>effect by 1.02';
				else if (completions == 19) text += 'multiply the first activated relic<br>effect by 1.01';
				else if (completions == 20) text += 'essence is never reset';
				else if (completions == 21) text += 'auto <b' + getColorClass(this, REF, "s") + 'Sacrifice</b> works thrice as fast';
				else if (completions == 22) text += 'auto <b' + getColorClass(this, REF, "s") + 'Sacrifice</b> works twice as fast';
				else if (completions == 23) text += 'nothing';
				else if (completions == 24) text += "relic resets don't reset cores";
				else if (completions == 25) text += 'nothing';
				else if (completions == 26) text += "relic resets don't reset hexes";
				else if (completions == 27) text += 'nothing';
				else if (completions == 28) text += 'still nothing';
				else if (completions == 29) text += "relic resets don't reset quarks";
				else if (completions == 30) text += 'nothing';
				else if (completions == 31) text += 'auto <b' + getColorClass(this, REF, "s") + 'Sacrifice</b> works twice as fast';
				else if (completions == 32) text += 'nothing';
				else if (completions == 33) text += 'still nothing';
				else if (completions == 34) text += "relic resets don't reset subatomic particles";
				else if (completions == 35) text += 'nothing';
				else if (completions == 36) text += 'still nothing';
				else if (completions == 37) text += 'all <b' + getColorClass(this, REF, "s") + 'Devotion</b> autobuyers work<br>twice as fast';
				else if (completions == 38) text += 'nothing';
				else if (completions == 39) text += 'still nothing';
				else if (completions == 40) text += 'all <b' + getColorClass(this, REF, "s") + 'Devotion</b> autobuyers<br>can bulk buy 10x';
				else text += 'you have gotten all the rewards!';
				return text;
			},
			rewardEffect() {
				let mult0 = newDecimalOne();
				if (getActivatedRelics() >= 11) mult0 = mult0.mul(2);
				if (getActivatedRelics() >= 14) mult0 = mult0.mul(2);
				if (getActivatedRelics() >= 15) mult0 = mult0.mul(1.2);
				if (getActivatedRelics() >= 16) mult0 = mult0.mul(1.1);
				if (getActivatedRelics() >= 18) mult0 = mult0.mul(1.05);
				if (getActivatedRelics() >= 19) mult0 = mult0.mul(1.02);
				if (getActivatedRelics() >= 20) mult0 = mult0.mul(1.01);
				if (getActivatedRelics() >= 25) mult0 = mult0.mul(1.001);
				let mult2 = newDecimalOne();
				if (getActivatedRelics() >= 7) mult2 = mult2.mul(4);
				if (getActivatedRelics() >= 8) mult2 = mult2.mul(2);
				return [
					player.r.light.mul(10).add(1).pow(0.15).mul(mult0),
					player.r.light.mul(1000).add(1).pow(0.05).min(100),
					player.r.light.div(1000).add(1).pow(0.25).mul(mult2),
					player.r.light.pow(0.0021),
				];
			},
			canComplete() { return player.r.light.gte(getActivationReq()) && challengeCompletions(this.layer, this.id) < tmp.r.challenges[this.id].completionLimit },
			completionLimit() { return player.r.points.toNumber() },
			style() {
				const num = player.r.light.add(1).log(2).div(getActivationReq().add(1).log(2)).mul(100).floor();
				let BGcolor = 'rgb(' + num + ',' + num + ',' + (num + 100) + ')';
				if (num.gt(100)) BGcolor = 'rgb(100,100,200)';
				let textColor = '#B9A975';
				if (colorValue[1] == "none") textColor = '#DFDFDF';
				return {width: '450px', height: '450px', 'background-color': BGcolor, color: textColor, 'border-radius': '70px'};
			},
		},
	},
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Brighter Light</b>' },
			description: 'multiplies light gain based on your sanctums',
			effect() { return player.s.points.add(1).pow(0.3) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.3';
				return text;
			},
			cost: 1e12,
			currencyInternalName: "light",
			currencyLayer: "r",
			unlocked() { return hasMilestone("gi", 0) },
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Light of Light</b>' },
			description: 'multiplies light gain based on your light',
			effect() { return player.r.light.add(1).pow(0.1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.1';
				return text;
			},
			cost: 1e13,
			currencyInternalName: "light",
			currencyLayer: "r",
			unlocked() { return hasMilestone("gi", 0) },
		},
		13: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Good Light</b>' },
			description: 'makes base light gain based on your good influence, ignoring hardcap',
			effect() { return player.gi.points.mul(36).add(1).pow(10) },
			effectDisplay(eff) {
				let text = format(eff) + '/sec';
				if (options.nerdMode) text += '<br>formula: (36x+1)^10';
				return text;
			},
			canAfford() { return this.effect().gte(1e25) },
			costDisplay: "Req: effect must be at least 1e25",
			unlocked() { return hasMilestone("gi", 0) },
		},
	},
	buyables: {
		11: {
			cost(x) {
				let cost = new Decimal(hasMilestone("r", 4) ? 1.75 : 2).pow(x).mul(10);
				if (hasMilestone("r", 2)) cost = cost.div(milestoneEffect("r", 2));
				return cost.add(1e-10).floor();
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Glowing Relics' },
			description: 'multiplies glow gain and maximum glow based on the amount of this upgrade bought.',
			canAfford() { return new Decimal(getActivatedRelics()).gte(this.cost()) },
			purchaseLimit: 99,
			buy() { addBuyables(this.layer, this.id, 1) },
			effect(x) { return new Decimal(5).pow(x.add(buyableEffect("r", 21))) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 5^x';
				return text;
			},
			costDisplay(cost) { return 'Req: ' + formatWhole(cost) + ' activated relics' },
			boughtDisplay(x) { return 'Bought: ' + formatWhole(x) + '/' + formatWhole(this.purchaseLimit) + (hasBuyable("r", 21) ? ' + ' + formatWhole(buyableEffect("r", 21)) : "") },
		},
		12: {
			cost(x) {
				let cost = new Decimal(hasMilestone("r", 1) ? 2 : 2.5).pow(x).add(49);
				if (hasMilestone("r", 2)) cost = cost.div(milestoneEffect("r", 2));
				return cost.add(1e-10).floor();
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Gleaming Relics' },
			description: 'multiplies light gain after hardcap based on the amount of this upgrade bought.',
			canAfford() { return new Decimal(getActivatedRelics()).gte(this.cost()) },
			purchaseLimit: 99,
			buy() { addBuyables(this.layer, this.id, 1) },
			effect(x) { return new Decimal(1000).pow(x.add(buyableEffect("r", 21))) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 1,000^x';
				return text;
			},
			costDisplay(cost) { return 'Req: ' + formatWhole(cost) + ' activated relics' },
			boughtDisplay(x) { return 'Bought: ' + formatWhole(x) + '/' + formatWhole(this.purchaseLimit) + (hasBuyable("r", 21) ? ' + ' + formatWhole(buyableEffect("r", 21)) : "") },
		},
		21: {
			cost(x) {
				let cost = new Decimal(hasMilestone("r", 1) ? (hasMilestone("r", 5) ? 1.5 : 2) : 4).pow(x).mul(75);
				if (hasMilestone("r", 2)) cost = cost.div(milestoneEffect("r", 2));
				return cost.add(1e-10).floor();
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Prismatic Relics' },
			description() { return 'gives extra levels to <b' + getColorClass(this, REF) + 'Glowing Relics</b> and <b' + getColorClass(this, REF) + 'Gleaming Relics</b> based on the amount of this upgrade bought.' },
			canAfford() { return new Decimal(getActivatedRelics()).gte(this.cost()) },
			purchaseLimit: 99,
			buy() { addBuyables(this.layer, this.id, 1) },
			effect(x) { return x },
			effectDisplay(eff) {
				let text = '+' + formatWhole(eff);
				if (options.nerdMode) text += '<br>formula: x';
				return text;
			},
			costDisplay(cost) { return 'Req: ' + formatWhole(cost) + ' activated relics' },
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1e12,
				effectDescription: "reduce relic activation requirement scaling (3 --> 2)",
			},
			1: {
				requirement: 6e12,
				effectDescription() { return "reduce requirement scaling of <b" + getColorClass(this, REF) + "Gleaming Relics</b> (2.5 --> 2) and <b" + getColorClass(this, REF) + "Prismatic Relics</b> (4 --> 2)" },
			},
			2: {
				requirement: 1e13,
				effect() { return player.ch.points.sub(70).max(0).add(1) },
				effectDescription(eff) { return "divide relic rebuyable requirements based on your chaos after 70 (currently /" + format(eff) + ")" },
			},
			3: {
				requirement: 2e13,
				effect() { return new Decimal(getActivatedRelics()).add(1).pow(0.0252) },
				effectDescription(eff) { return "multiply multicellular organism gain based on your activated relics (currently " + format(eff) + "x)" },
			},
			4: {
				requirement: 1e14,
				effectDescription() { return "reduce requirement scaling of <b" + getColorClass(this, REF) + "Glowing Relics</b> (2 --> 1.75)" },
			},
			5: {
				requirement: 1e15,
				effectDescription() { return "reduce requirement scaling of <b" + getColorClass(this, REF) + "Prismatic Relics</b> (2 --> 1.5)" },
			},
			6: {
				requirement: 1e16,
				effect() { return player.r.points.add(1).pow(0.0045) },
				effectDescription(eff) { return "multiply multicellular organism gain based on your relics (currently " + format(eff) + "x)" },
			},
			7: {
				requirement: 2e17,
				effect() { return new Decimal(getActivatedRelics()).add(1).pow(10) },
				effectDescription(eff) { return "multiply atom gain based on your activated relics (currently " + format(eff) + "x)" },
			},
			8: {
				requirement: 2e18,
				effect() { return player.r.light.add(1).log10().add(1).pow(0.01) },
				effectDescription(eff) { return "multiply multicellular organism gain based on your light (currently " + format(eff) + "x)" },
			},
		};
		const done = req => player.r.points.gte(req) && isAssimilated("r") && hasMilestone("ch", 25);
		const doneAndUnlocked = req => player.r.points.gte(req) && isAssimilated("r") && hasMilestone("ch", 25) && hasMilestone("ch", 26);
		const unlocked = () => hasMilestone("ch", 26);
		for (const key in obj) {
			obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " relics";
			if (+key >= 4) obj[key].done = doneAndUnlocked.bind(null, obj[key].requirement);
			else obj[key].done = done.bind(null, obj[key].requirement);
			delete obj[key].requirement;
			if (+key >= 4) obj[key].unlocked = unlocked;
		};
		return obj;
	})(),
});

addLayer("m", {
	name: "Molecule",
	pluralName: "Molecules",
	symbol: "M",
	row: 4,
	position: 2,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		auto_upgrades: false,
	}},
	color: "#00CCCC",
	branches: ["cl"],
	requires: 30000,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "molecules",
	baseResource: "atoms",
	baseAmount() { return player.a.points },
	type: "normal",
	exponent: 0.9,
	gainMult() {
		let mult = newDecimalOne();
		if (getActivatedRelics() >= 12 && challengeEffect("r", 11)[0]) mult = mult.mul(challengeEffect("r", 11)[0]);
		if (new Decimal(tmp.w.effect[1]).gt(1) && !tmp.w.deactivated) mult = mult.mul(tmp.w.effect[1]);
		if (hasBuyable("w", 21)) mult = mult.mul(buyableEffect("w", 21));
		if (hasUpgrade("pl", 62)) mult = mult.mul(upgradeEffect("pl", 62));
		return mult;
	},
	hotkeys: [{key: "m", description: "M: Reset for molecules", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return getActivatedRelics() >= 10 || player.m.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer)},
	passiveGeneration() {
		let gen = 0;
		if (hasMilestone("m", 20)) gen += 0.1;
		if (hasMilestone("m", 21)) gen += 0.4;
		if (hasMilestone("pl", 1)) gen += 0.1;
		return gen;
	},
	automate() {
		if (hasMilestone("w", 2) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				if (id < (hasMilestone("ch", 27) ? 70 : 60)) buyUpgrade(this.layer, id);
			};
		};
	},
	effect() {
		let eff = player.m.best.mul(0.5).add(1).pow(0.99);
		const sc_start = softcaps.m_eff[0]();
		if (eff.gt(sc_start)) eff = eff.div(sc_start).pow(softcaps.m_eff[1]()).mul(sc_start);
		return eff;
	},
	effectDescription() { return 'which multiplies atom gain by <h2 class="layer-m">' + format(tmp.m.effect) + '</h2>x (based on best)' + (tmp.m.effect.gt(softcaps.m_eff[0]()) ? ' (softcapped)' : '') },
	doReset(resettingLayer) {
		if (hasMilestone("w", 6) && resettingLayer == "w") return;
		let keep = ["auto_upgrades"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (hasMilestone("w", 0) && resettingLayer == "w") keep.push("milestones");
		if (hasMilestone("cl", 4) && resettingLayer == "cl") keep.push("milestones");
		if (hasMilestone("ch", 3) && resettingLayer == "ch") keep.push("milestones");
		if (layers[resettingLayer].row > this.row) layerDataReset("m", keep);
	},
	uniqueNonExtra() {
		let unique = new Decimal(player.m.upgrades.length);
		if (hasUpgrade("m", 42)) unique = unique.mul(upgradeEffect("m", 42));
		return unique;
	},
	uniqueExtra() {
		let unique = newDecimalZero();
		if (hasUpgrade("m", 31) && upgradeEffect("m", 31).gt(0)) unique = unique.add(upgradeEffect("m", 31));
		if (hasUpgrade("m", 32) && upgradeEffect("m", 32).gt(0)) unique = unique.add(upgradeEffect("m", 32));
		if (hasUpgrade("m", 41) && upgradeEffect("m", 41).gt(0)) unique = unique.add(upgradeEffect("m", 41));
		if (hasUpgrade("m", 51) && upgradeEffect("m", 51).gt(0)) unique = unique.add(upgradeEffect("m", 51));
		if (hasUpgrade("m", 53) && upgradeEffect("m", 53).gt(0)) unique = unique.add(upgradeEffect("m", 53));
		if (hasUpgrade("m", 63)) unique = unique.mul(upgradeEffect("m", 63));
		return unique;
	},
	tabFormat: {
		Microscope: {
			content: getTab("m"),
		},
		Constructor: {
			content: getTab("m", "Constructor"),
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription: "molecules don't reset relics, and you can autobuy essence rebuyables",
				toggles: [["e", "auto_buyables"]],
			},
			1: {
				requirement: 2,
				effectDescription() { return "keep demon soul challenges and <b" + getColorClass(this, REF, "ds") + "Demonic Key</b> on row 5 resets, and you can autobuy hex upgrades" },
				toggles: [["h", "auto_upgrades"]],
			},
			2: {
				requirement: 3,
				effectDescription: "molecules don't reset essence, and you can autobuy essence upgrades",
				toggles: [["e", "auto_upgrades"]],
			},
			3: {
				requirement: 4,
				effectDescription: "gain 0.1% of your best light gain per second",
			},
			4: {
				requirement: 5,
				effectDescription: "molecules don't reset cores, and you can autobuy subatomic particle upgrades and rebuyables",
				toggles: [["sp", "auto_upgrades"], ["sp", "auto_buyables"]],
			},
			5: {
				requirement: 7,
				effectDescription: "molecules don't reset quarks, and you can autobuy demon soul upgrades",
				toggles: [["ds", "auto_upgrades"]],
			},
			6: {
				requirement: 10,
				effectDescription: "you can autobuy demon soul rebuyables",
				toggles: [["ds", "auto_buyables"]],
			},
			7: {
				requirement: 15,
				effectDescription: "gain +0.9% of your best light gain per second",
			},
			8: {
				requirement: 25,
				effectDescription: "unlock 3 more sanctum milestones",
			},
			9: {
				requirement: 50,
				effectDescription() { return "keep the <b" + getColorClass(this, REF, "s") + "1 sanctum milestone</b> on molecule resets" },
			},
			10: {
				requirement: 125,
				effectDescription: "keep 5 sanctums on molecule resets",
			},
			11: {
				requirement: 500,
				effectDescription: "hardcapped atom upgrades always have max effect",
			},
			12: {
				requirement: 4500,
				effectDescription: "keep atom milestones on molecule resets",
			},
			13: {
				requirement: 50_000,
				effectDescription: "molecules don't reset hexes",
			},
			14: {
				requirement: 750_000,
				effectDescription: "molecules don't reset demon souls",
			},
			15: {
				requirement: 15_000_000,
				effectDescription: "gain +1.5% of your best light gain per second",
			},
			16: {
				requirement: 450_000_000,
				effectDescription: "gain +2.5% of your best light gain per second",
			},
			17: {
				requirement: 2.5e10,
				effectDescription: "gain +5% of your best light gain per second",
			},
			18: {
				requirement: 2.5e12,
				effectDescription: "keep 25 more sanctums (30 total) on molecule resets",
			},
			19: {
				requirement: 4e14,
				effectDescription: "keep 185 more sanctums (215 total) on molecule resets",
			},
			20: {
				requirement: 7.5e16,
				effectDescription: "gain +10% of your molecule gain per second",
			},
			21: {
				requirement: 1.5e19,
				effectDescription: "gain +40% of your molecule gain per second",
			},
		};
		const done = req => player.m.total.gte(req);
		for (const key in obj) {
			obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " total molecule" + (obj[key].requirement === 1 ? "" : "s");
			obj[key].done = done.bind(null, obj[key].requirement);
			delete obj[key].requirement;
		};
		return obj;
	})(),
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'O<span style="font-size: 0.8em">2</span>, Oxygen' },
			description: 'multiplies essence gain based on your best molecules',
			cost: 1,
			effect() { return player.m.best.mul(100).add(1).pow(0.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (100x+1)^0.5';
				return text;
			},
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'CO, Carbon Monoxide' },
			description: 'multiplies demon soul gain based on your best molecules',
			cost: 5,
			effect() { return player.m.best.mul(10).add(1).pow(0.2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (10x+1)^0.2';
				return text;
			},
		},
		13: {
			title() { return '<b' + getColorClass(this, TITLE) + 'CO<span style="font-size: 0.8em">2</span>, Carbon Dioxide' },
			description: 'multiplies quark gain based on your best molecules',
			cost: 10,
			effect() { return player.m.best.mul(50).add(1).pow(0.4) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (50x+1)^0.4';
				return text;
			},
		},
		21: {
			fullDisplay() {
				let text = "";
				if (options.nerdMode) text += '<br>formula: (25x+1)^0.3';
				return '<h3' + getColorClass(this, TITLE) + 'CO<span style="font-size: 0.8em">3</span>, Carbon Trioxide</h3><br>multiplies core gain based on your best molecules<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: 360,000 atoms';
			},
			canAfford() { return player.a.points.gte(360000) },
			pay() { player.a.points = player.a.points.sub(360000) },
			effect() { return player.m.best.mul(25).add(1).pow(0.3) },
		},
		22: {
			title() { return '<b' + getColorClass(this, TITLE) + 'H<span style="font-size: 0.8em">2</span>O, Water' },
			description: 'multiplies essence gain based on your total unique molecules',
			cost: 125,
			effect() { return tmp.m.uniqueNonExtra.add(tmp.m.uniqueExtra).add(1).mul(5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 5(x+1)';
				return text;
			},
		},
		23: {
			fullDisplay() {
				let text = "";
				if (options.nerdMode) text += '<br>formula: (250x+1)^0.1';
				return '<h3' + getColorClass(this, TITLE) + 'NH<span style="font-size: 0.8em">3</span>, Ammonia</h3><br>multiplies hex gain based on your best molecules<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: 4,600,000 atoms';
			},
			canAfford() { return player.a.points.gte(4600000) },
			pay() { player.a.points = player.a.points.sub(4600000) },
			effect() { return player.m.best.mul(250).add(1).pow(0.1) },
		},
		31: {
			title() { return '<b' + getColorClass(this, TITLE) + 'H<span style="font-size: 0.8em">2</span>, Hydrogen' },
			description: "gives extra unique molecules based on your non-extra ones' amount and worth",
			cost: 250,
			effect() { return tmp.m.uniqueNonExtra.div(2).add(1).floor() },
			effectDisplay(eff) {
				let text = '+' + formatWhole(eff);
				if (options.nerdMode) text += '<br>formula: xy/2+1';
				return text;
			},
			unlocked() { return hasUpgrade("m", 21) && hasUpgrade("m", 22) && hasUpgrade("m", 23) },
		},
		32: {
			fullDisplay() {
				let text = "";
				if (options.nerdMode) text += '<br>formula: (x+1)^0.2';
				return '<h3' + getColorClass(this, TITLE) + 'NaCl, Salt</h3><br>gives extra unique molecules based on your atoms<br>Currently: +' + formatWhole(this.effect()) + text + '<br><br>Cost: 7,777,777 atoms';
			},
			canAfford() { return player.a.points.gte(7777777) },
			pay() { player.a.points = player.a.points.sub(7777777) },
			effect() { return player.a.points.add(1).pow(0.2).floor() },
			unlocked() { return hasUpgrade("m", 21) && hasUpgrade("m", 22) && hasUpgrade("m", 23) },
		},
		33: {
			fullDisplay() {
				let text = "";
				if (options.nerdMode) text += '<br>formula: 1000x';
				return '<h3' + getColorClass(this, TITLE) + 'O<span style="font-size:0.8em">3</span>, Ozone</h3><br>multiplies demon soul gain based on your total unique molecules<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: ' + format(1e10) + ' atoms';
			},
			canAfford() { return player.a.points.gte(1e10) },
			pay() { player.a.points = player.a.points.sub(1e10) },
			effect() { return tmp.m.uniqueNonExtra.add(tmp.m.uniqueExtra).mul(1000) },
			unlocked() { return hasUpgrade("m", 21) && hasUpgrade("m", 22) && hasUpgrade("m", 23) },
		},
		41: {
			title() { return '<b' + getColorClass(this, TITLE) + 'CH<span style="font-size: 0.8em">4</span>, Methane' },
			description: 'gives extra unique molecules based on your demon souls',
			cost: 25000000,
			effect() { return player.ds.points.add(1).pow(10).log10().add(1).floor() },
			effectDisplay(eff) {
				let text = '+' + formatWhole(eff);
				if (options.nerdMode) text += '<br>formula: log((x+1)^10)+1';
				return text;
			},
			unlocked() { return hasUpgrade("m", 31) && hasUpgrade("m", 32) && hasUpgrade("m", 33) },
		},
		42: {
			title() { return '<b' + getColorClass(this, TITLE) + 'CaO, Calcium Oxide' },
			description: 'non-extra unique molecules are worth more based on your relics',
			cost: 50000000,
			effect() { return player.r.points.mul(5).add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (5x+1)^2';
				return text;
			},
			unlocked() { return hasUpgrade("m", 31) && hasUpgrade("m", 32) && hasUpgrade("m", 33) },
		},
		43: {
			fullDisplay() {
				let text = "";
				if (options.nerdMode) text += '<br>formula: (x+1)^0.01';
				return'<h3' + getColorClass(this, TITLE) + 'Ca(OH)<span style="font-size: 0.8em">2</span>, Calcium Hydroxide</h3><br>multiplies relic gain based on your extra unique molecules<br>Currently: ' + format(this.effect()) + 'x' + text + '<br><br>Cost: ' + format(1.61e10) + ' atoms';
			},
			canAfford() { return player.a.points.gte(1.61e10) },
			pay() { player.a.points = player.a.points.sub(1.61e10) },
			effect() { return tmp.m.uniqueExtra.add(1).pow(0.01) },
			unlocked() { return hasUpgrade("m", 31) && hasUpgrade("m", 32) && hasUpgrade("m", 33) },
		},
		51: {
			title() { return '<b' + getColorClass(this, TITLE) + 'N<span style="font-size: 0.8em">2</span>, Nitrogen' },
			description: 'gives extra unique molecules based on your total good influence',
			cost: 1e13,
			effect() { return (tmp.gi.deactivated ? new Decimal(0) : player.gi.total).add(1).pow(2.5).floor() },
			effectDisplay(eff) {
				let text = '+' + formatWhole(eff);
				if (options.nerdMode) text += '<br>formula: (x+1)^2.5';
				return text;
			},
			unlocked() { return (hasMilestone("gi", 11) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("m", 41) && hasUpgrade("m", 42) && hasUpgrade("m", 43) },
		},
		52: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Na<span style="font-size: 0.8em">2</span>O, Sodium Oxide' },
			description: 'multiplies point gain based on your total unique molecules',
			cost: 1e14,
			effect() { return tmp.m.uniqueNonExtra.add(tmp.m.uniqueExtra).add(1).pow(25) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^25';
				return text;
			},
			unlocked() { return (hasMilestone("gi", 11) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("m", 41) && hasUpgrade("m", 42) && hasUpgrade("m", 43) },
		},
		53: {
			title() { return '<b' + getColorClass(this, TITLE) + 'F<span style="font-size: 0.8em">2</span>, Fluorine' },
			description: 'gives extra unique molecules based on your atoms',
			cost: 1e13,
			effect() { return player.a.points.add(1).pow(0.45).floor() },
			effectDisplay(eff) {
				let text = '+' + formatWhole(eff);
				if (options.nerdMode) text += '<br>formula: (x+1)^0.45';
				return text;
			},
			unlocked() { return (hasMilestone("gi", 11) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("m", 41) && hasUpgrade("m", 42) && hasUpgrade("m", 43) },
		},
		61: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Ne<span style="font-size: 0.8em">2</span>, Neon' },
			description: 'multiplies light gain after hardcap based on your total unique molecules',
			cost: 1e62,
			effect() { return tmp.m.uniqueNonExtra.add(tmp.m.uniqueExtra).add(1).log10().add(1).pow(hasUpgrade("m", 62) ? 10 : 0.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) {
					if (hasUpgrade("m", 62)) text += '<br>formula: (log10(x+1)+1)^10';
					else text += '<br>formula: (log10(x+1)+1)^0.5';
				};
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("m", 51) && hasUpgrade("m", 52) && hasUpgrade("m", 53) },
		},
		62: {
			title() { return '<b' + getColorClass(this, TITLE) + 'C<span style="font-size: 0.8em">6</span>H<span style="font-size: 0.8em">5</span>NH<span style="font-size: 0.8em">2</span>, Aniline' },
			description() { return 'improves <b' + getColorClass(this, "ref-light", "m") + 'Ne<span style="font-size: 0.8em">2</span>, Neon</b>\'s effect exponent<br>(0.5 --> 10)' },
			cost() { return (player.mo.assimilating != null ? 1e80 : '1e1400') },
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("m", 51) && hasUpgrade("m", 52) && hasUpgrade("m", 53) },
		},
		63: {
			title() { return '<b' + getColorClass(this, TITLE) + '[Ru(NH<span style="font-size: 0.8em">3</span>)<span style="font-size: 0.8em">5</span>(N<span style="font-size: 0.8em">2</span>)]Cl<span style="font-size: 0.8em">2</span>' },
			description: 'multiplies extra unique molecules based on your molecules',
			cost: '1e1575',
			effect() { return player.m.points.add(1).log10().add(1).pow(10) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^10';
				return text;
			},
			unlocked() { return (isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasUpgrade("m", 51) && hasUpgrade("m", 52) && hasUpgrade("m", 53) },
		},
	},
});

addLayer("gi", {
	name: "Good Influence",
	symbol: "GI",
	row: 4,
	position: 1,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		auto_buyables: false,
		auto_upgrades: false,
		auto_prestige: false,
	}},
	color: "#08FF87",
	branches: ["w", "ch"],
	requires: 15,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "good influence",
	baseResource: "relics",
	baseAmount() { return player.r.points },
	type: "static",
	base() {
		if (hasUpgrade("gi", 14)) return 1.98;
		if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return 1.99;
		return 2;
	},
	exponent: 1,
	canBuyMax() { return true },
	devotionEffect() { return tmp.d.devotion.mul(1.05).add(1).pow(hasMilestone("gi", 12) ? 0.22 : 0.2) },
	gainExp() {
		let gain = newDecimalOne();
		if (getPurifiedDemonSouls() >= 1 && challengeEffect("ds", 101)[0]) gain = gain.mul(challengeEffect("ds", 101)[0]);
		if (tmp.gi.devotionEffect.gt(1)) gain = gain.mul(tmp.gi.devotionEffect);
		if (hasUpgrade("ei", 24)) gain = gain.mul(upgradeEffect("ei", 24));
		if (new Decimal(tmp.w.effect[1]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[1]);
		if (hasBuyable("w", 11)) gain = gain.mul(buyableEffect("w", 11)[0]);
		if (hasBuyable("w", 13)) gain = gain.mul(buyableEffect("w", 13));
		if (hasBuyable("w", 22)) gain = gain.mul(buyableEffect("w", 22));
		if (hasBuyable("mo", 13)) gain = gain.mul(buyableEffect("mo", 13));
		if (hasBuyable("pl", 11)) gain = gain.mul(buyableEffect("pl", 11));
		return gain;
	},
	autoPrestige() { return (hasMilestone("w", 1) || ((isAssimilated(this.layer) || player.mo.assimilating === this.layer) && hasMilestone("gi", 16)) || hasUpgrade("pl", 64)) && (!hasMilestone("cl", 0) || player.gi.auto_prestige) },
	hotkeys: [{key: "G", description: "Shift-G: Reset for good influence", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.m.unlocked || player.gi.unlocked },
	deactivated() { return inChallenge("ch", 11) || (getClickableState("mo", 11) && !canAssimilate(this.layer))},
	automate() {
		if ((hasUpgrade("gi", 11) && !hasMilestone("w", 0)) || (hasMilestone("w", 0) && player.gi.auto_buyables)) {
			updateBuyableTemp("gi");
			let work = 1;
			if (hasMilestone("ch", 2)) work *= 2;
			if (hasMilestone("ch", 6)) work *= 5;
			if (hasMilestone("ch", 9)) work *= 2;
			if (hasMilestone("ch", 14)) work *= 2;
			if (hasMilestone("ch", 16)) work *= 2;
			for (let index = 0; index < work; index++) {
				if (!canBuyBuyable("gi", 11)) break;
				buyBuyable("gi", 11);
			};
			if (layers.gi.buyables[12].unlocked()) {
				for (let index = 0; index < work; index++) {
					if (!canBuyBuyable("gi", 12)) break;
					buyBuyable("gi", 12);
				};
			};
		};
		if (hasMilestone("ch", 28) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				buyUpgrade(this.layer, id);
			};
		};
	},
	effect() {
		let effBase = new Decimal(2);
		if (hasBuyable("gi", 11)) effBase = effBase.add(buyableEffect("gi", 11));
		if (hasMilestone("gi", 19) && player.h.limitsBroken >= 4) {
			return player.gi.points.div(100).add(effBase).pow(0.25).min(1e100);
		};
		if (hasMilestone("gi", 18) && player.h.limitsBroken >= 4) {
			return effBase.pow(player.gi.total.pow(1.454));
		};
		let eff = effBase.pow(player.gi.total);
		if (eff.gt(softcaps.gi_eff[0])) {
			eff = eff.div(softcaps.gi_eff[0]).pow(softcaps.gi_eff[1]).mul(softcaps.gi_eff[0]);
		};
		return eff;
	},
	effectDescription() {
		if (hasMilestone("gi", 19) && player.h.limitsBroken >= 4) {
			return 'which multiplies sanctum gain and glow gain by <h2 class="layer-gi">' + format(tmp.gi.effect) + '</h2>x';
		};
		let text = 'which multiplies prayer gain by <h2 class="layer-gi">' + format(tmp.gi.effect) + '</h2>x (based on total)';
		if (this.effect().gte(softcaps.gi_eff[0]) && !(hasMilestone("gi", 18) && player.h.limitsBroken >= 4)) text += ' (softcapped)';
		return text;
	},
	doReset(resettingLayer) {
		if (hasMilestone("w", 8) && resettingLayer == "w") return;
		if (hasMilestone("cl", 4) && resettingLayer == "cl") return;
		let keep = ["auto_buyables", "auto_upgrades", "auto_prestige"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (hasMilestone("w", 1) && resettingLayer == "w") keep.push("milestones");
		if (hasMilestone("cl", 0) && resettingLayer == "cl") keep.push("milestones");
		if (hasMilestone("ch", 8) && resettingLayer == "ch") keep.push("milestones");
		if (layers[resettingLayer].row > this.row) layerDataReset("gi", keep);
	},
	resetsNothing() { return hasMilestone("gi", 16) || hasUpgrade("pl", 64) },
	tabFormat: getTab("gi"),
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription: "unlock relic upgrades and good influence resets don't reset relics",
			},
			1: {
				requirement: 2,
				effectDescription: "good influence resets don't reset essence",
			},
			2: {
				requirement: 3,
				effectDescription: "good influence resets don't reset cores",
			},
			3: {
				requirement: 4,
				effectDescription: "good influence resets don't reset quarks",
			},
			4: {
				requirement: 5,
				effectDescription: "good influence resets don't reset hexes",
			},
			5: {
				requirement: 6,
				effectDescription: "good influence resets don't reset demon souls",
			},
			6: {
				requirement: 8,
				effectDescription: "keep 4 sanctums on good influence resets",
			},
			7: {
				requirement: 10,
				effectDescription: "keep 3 more sanctums (7 total) on good influence resets",
			},
			8: {
				requirement: 12,
				effectDescription: "keep 3 more sanctums (10 total) on good influence resets",
			},
			9: {
				requirement: 15,
				effectDescription: "keep 6 more sanctums (16 total) on good influence resets",
			},
			10: {
				requirement: 18,
				effectDescription() { return "all <b" + getColorClass(this, REF, "s") + "Devotion</b> autobuyers work twice as fast" },
			},
			11: {
				requirement: 21,
				effectDescription: "unlock 3 new molecule upgrades and you can autobuy atom upgrades",
				toggles: [["a", "auto_upgrades"]],
			},
			12: {
				requirements: [22, 555],
				effectDescription() { return "increase <b" + getColorClass(this, REF, "s") + "Devotion</b>'s effect exponent on good influence gain (0.2 --> 0.22)" },
				done() { return player.gi.points.gte(22) && player.gi.total.gte(555) },
			},
			13: {
				requirements: [28, 1000],
				effectDescription: "keep 14 more sanctums (30 total) on good influence resets",
			},
			14: {
				requirements: [32, 1500],
				effectDescription: "keep 55 more sanctums (85 total) on good influence resets",
			},
			15: {
				requirements: [33, 1750],
				effectDescription: "keep 130 more sanctums (215 total) on good influence resets",
			},
			16: {
				requirements: [36, 2000],
				effectDescription() {
					let text = "good influence resets nothing";
					if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) text += " and perform good influence resets automatically";
					return text;
				},
			},
			17: {
				requirements: [50, 6400],
				effectDescription() { return "all <b" + getColorClass(this, REF, "s") + "Devotion</b> autobuyers can bulk buy 2x" },
			},
			18: {
				requirementDescription: "16,100 good influence and 4 limits broken",
				effectDescription: "remove the good influence effect softcap and improve the good influence effect formula if you have at least 4 limits broken",
				done() { return player.gi.points.gte(16100) && player.h.limitsBroken >= 4 },
			},
			19: {
				requirementDescription: "20,640 good influence and 2.5e17 glow",
				effectDescription: "change the good influence effect if you have at least 4 limits broken",
				done() { return player.gi.points.gte(20640) && player.h.limitsBroken >= 4 && player.s.glow.gte(2.5e17) },
			},
		};
		const done = req => player.gi.points.gte(req);
		const doneTotal = (req, reqTotal) => player.gi.points.gte(req) && player.gi.total.gte(reqTotal);
		const unlocked = id => hasMilestone("gi", id - 2);
		const unlockedLimitsBroken = id => hasMilestone("gi", id - 2) && player.h.limitsBroken >= 4;
		for (const key in obj) {
			if (obj[key].requirements) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirements[0]) + " good influence and " + simpleFormatWhole(obj[key].requirements[1]) + " total good influence";
				obj[key].done = doneTotal.bind(null, ...obj[key].requirements);
				delete obj[key].requirements;
			} else if (obj[key].requirement) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " good influence";
				obj[key].done = done.bind(null, obj[key].requirement);
				delete obj[key].requirement;
			};
			if (+key >= 18) obj[key].unlocked = unlockedLimitsBroken.bind(null, +key);
			else if (+key >= 2) obj[key].unlocked = unlocked.bind(null, +key);
		};
		return obj;
	})(),
	buyables: {
		11: {
			cost(x) {
				if (player.h.limitsBroken >= 4 && x.gte(8)) return x.add(1).pow(2);
				return x.add(1);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Better Good' },
			description: 'increases the good influence effect base by 1 per this upgrade bought.',
			canAfford() { return player.gi.points.gte(this.cost()) },
			purchaseLimit() { return player.h.limitsBroken >= 4 ? 1e9 : 8 },
			buy() { buyGoodInfluenceBuyable(this) },
			effect(x) { return x },
			effectDisplay(eff) { return '+' + format(eff) },
		},
		12: {
			cost(x) { return x.div(5).add(1).floor() },
			title() { return '<b' + getColorClass(this, TITLE) + 'Drive out Evil' },
			description: 'multiplies essence gain based on the amount of this upgrade bought.',
			canAfford() { return player.gi.points.gte(this.cost()) },
			purchaseLimit() { return player.ds.points.add(1).log10().div(12.5).floor().min(1e9) },
			buy() { buyGoodInfluenceBuyable(this) },
			effect(x) { return new Decimal(10).pow(x.pow(1.5)) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 10^(x^1.5)';
				return text;
			},
			boughtDisplay(x) {
				let text = 'Bought: ' + formatWhole(x) + '/' + formatWhole(tmp[this.layer].buyables[this.id].purchaseLimit);
				if (options.nerdMode) text += '<br>limit formula: log10(x+1)/12.5 (floored) where x is demon souls<br>limit maxes at 1e9';
				return text;
			},
			unlocked() { return getBuyableAmount("gi", 11).gte(8) },
		},
	},
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Devotion to Good' },
			description() { return 'makes all <b' + getColorClass(this, REF, "s") + 'Devotion</b> autobuyers bulk buy 100x and good influence rebuyables are autobought' },
			cost: 200,
			unlocked() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Sacrifice for Good' },
			description() { return 'exponentiate <b' + getColorClass(this, REF, "s") + 'Glowing Sacrificial Ceremony</b>\'s cost by ^' + format(this.effect) },
			cost: 500,
			effect: 1e-7,
			unlocked() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		13: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Glowing Goodness' },
			description: 'multiply glow gain based on total good influence',
			cost: 40_000,
			effect() { return player.gi.total.add(1).pow(1.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^1.5';
				return text;
			},
			unlocked() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		14: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Greater Good' },
			description: 'reduce the good influence cost base (1.99 --> 1.98)',
			cost: 44_444,
			unlocked() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
	},
});

addLayer("ei", {
	name: "Evil Influence",
	symbol: "EI",
	row: 4,
	position: 0,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		power: newDecimalZero(),
		auto_upgrades: false,
		auto_prestige: false,
	}},
	color: "#FF4400",
	branches: ["w", "ch"],
	requires: 'e3000',
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "evil influence",
	baseResource: "demon souls",
	baseAmount() { return player.ds.points },
	type: "static",
	exponent() {
		if (hasUpgrade("ei", 83)) return 5.75;
		if (hasUpgrade("ei", 73)) return 6.25;
		if (hasUpgrade("ei", 63)) return 6.45;
		if (hasUpgrade("ei", 53)) return 6.55;
		if (hasUpgrade("ei", 43)) return 6.75;
		if (hasUpgrade("ei", 33)) return 7;
		if (hasUpgrade("ei", 23)) return 7.25;
		if (hasUpgrade("ei", 13)) return 7.75;
		return 12;
	},
	canBuyMax() { return true },
	gainExp() {
		let gain = newDecimalOne();
		if (hasUpgrade("ei", 11)) gain = gain.mul(upgradeEffect("ei", 11));
		if (hasUpgrade("ei", 21)) gain = gain.mul(upgradeEffect("ei", 21));
		if (hasUpgrade("ei", 31)) gain = gain.mul(upgradeEffect("ei", 31));
		if (hasUpgrade("ei", 41)) gain = gain.mul(upgradeEffect("ei", 41));
		if (hasUpgrade("ei", 54)) gain = gain.mul(upgradeEffect("ei", 54));
		if (hasUpgrade("ei", 64)) gain = gain.mul(upgradeEffect("ei", 64));
		if (hasChallenge("ei", 22)) gain = gain.mul(1.75);
		if (new Decimal(tmp.w.effect[1]).gt(1) && !tmp.w.deactivated) gain = gain.mul(tmp.w.effect[1]);
		if (hasBuyable("w", 11)) gain = gain.mul(buyableEffect("w", 11)[1]);
		if (hasBuyable("w", 12)) gain = gain.mul(buyableEffect("w", 12));
		if (hasBuyable("cl", 53)) gain = gain.mul(buyableEffect("cl", 53));
		if (inChallenge("ch", 11)) gain = gain.mul(1.1);
		if (hasMilestone("ch", 17)) gain = gain.mul(milestoneEffect("ch", 16));
		if (player.h.limitsBroken > 0) gain = gain.div(tmp.h.clickables[11].nerf);
		return gain;
	},
	softcaps: [new Decimal(25_000_000), new Decimal(50_000_000), new Decimal(100_000_000)],
	softcapPowers() {
		let power = 0.1;
		if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) {
			power = 0.2;
		};
		return Array.from({length: this.softcaps.length}).map(() => power);
	},
	autoPrestige() { return (hasMilestone("w", 3) || hasUpgrade("pl", 64)) && (!hasMilestone("cl", 0) || player.ei.auto_prestige) },
	hotkeys: [{key: "E", description: "Shift-E: Reset for evil influence", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.gi.unlocked || player.ei.unlocked || player.w.unlocked },
	deactivated() { return inChallenge("ch", 12) || (getClickableState("mo", 11) && !canAssimilate(this.layer)) },
	automate() {
		if (hasMilestone("w", 1) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				buyUpgrade(this.layer, id);
			};
		};
	},
	effect() {
		// first effect
		let effBase1 = new Decimal(2);
		if (hasUpgrade("ei", 15)) effBase1 = new Decimal(4);
		if (hasUpgrade("ei", 25)) effBase1 = new Decimal(6);
		if (hasUpgrade("ei", 35)) effBase1 = new Decimal(8);
		if (hasUpgrade("ei", 45)) effBase1 = new Decimal(10);
		let eff1 = effBase1.pow(player.ei.points).sub(1);
		// mul
		if (hasUpgrade("ei", 12)) eff1 = eff1.mul(upgradeEffect("ei", 12));
		if (hasUpgrade("ei", 14)) eff1 = eff1.mul(upgradeEffect("ei", 14));
		if (hasUpgrade("ei", 22)) eff1 = eff1.mul(upgradeEffect("ei", 22));
		if (hasUpgrade("ei", 32)) eff1 = eff1.mul(upgradeEffect("ei", 32));
		if (hasUpgrade("ei", 42)) eff1 = eff1.mul(upgradeEffect("ei", 42));
		if (hasUpgrade("ei", 44)) eff1 = eff1.mul(upgradeEffect("ei", 44));
		if (hasUpgrade("ei", 52)) eff1 = eff1.mul(upgradeEffect("ei", 52));
		if (hasUpgrade("ei", 62)) eff1 = eff1.mul(upgradeEffect("ei", 62));
		if (hasUpgrade("ei", 72)) eff1 = eff1.mul(upgradeEffect("ei", 72));
		if (hasUpgrade("ei", 74)) eff1 = eff1.mul(upgradeEffect("ei", 74));
		// div
		if (inChallenge("ei", 11)) eff1 = eff1.div(1000);
		if (inChallenge("ei", 12)) eff1 = eff1.div(100_000_000);
		if (inChallenge("ei", 21)) eff1 = eff1.div(1e15);
		// exp
		if (hasChallenge("ei", 11)) eff1 = eff1.pow(1.075);
		if (hasChallenge("ei", 12)) eff1 = eff1.pow(1.075);
		// second effect
		let eff2 = newDecimalOne();
		if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) {
			eff2 = player.ei.points.div(1000).add(1).pow(0.015);
		};
		// return
		return [eff1, eff2];
	},
	effectDescription() {
		let text = "which generates <h2 class='layer-ei'>" + format(tmp.ei.effect[0]) + "</h2> evil power per second";
		if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) {
			text += " and divides the good influence cost of war by /<h2 class='layer-ei'>" + format(tmp.ei.effect[1]) + "</h2>";
		};
		return text;
	},
	doReset(resettingLayer) {
		if (hasMilestone("cl", 3) && resettingLayer == "cl") return;
		let keep = ["auto_upgrades", "auto_prestige"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (hasMilestone("w", 2) && resettingLayer == "w") keep.push("milestones");
		if (hasMilestone("w", 3) && resettingLayer == "w") keep.push("challenges");
		if (hasMilestone("cl", 0) && resettingLayer == "cl") keep.push("milestones");
		if (hasMilestone("ch", 4) && resettingLayer == "ch") keep.push("challenges");
		if (layers[resettingLayer].row > this.row) layerDataReset("ei", keep);
	},
	resetsNothing() { return hasChallenge("ei", 12) || hasUpgrade("pl", 64) },
	update(diff) {
		if (tmp.ei.effect[0]?.gt(0) && !tmp.ei.deactivated) {
			player.ei.power = player.ei.power.add(tmp.ei.effect[0].mul(diff));
		};
	},
	tabFormat: {
		"Cycle of Evil": {
			content: getTab("ei"),
		},
		"Gate of Evil": {
			content: getUnlockableTab("ei", "Gate of Evil"),
			unlocked() { return hasMilestone("ei", 5) || player.ei.activeChallenge },
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription: "evil influence resets don't reset relics",
			},
			1: {
				requirements: [8, 5000],
				effectDescription: "evil influence resets don't reset cores",
			},
			2: {
				requirements: [55, 1e12],
				effectDescription: "evil influence resets don't reset quarks",
			},
			3: {
				requirements: [146, 1e39],
				effectDescription: "evil influence resets don't reset prayers",
			},
			4: {
				requirements: [303, 1e193],
				effectDescription: "evil influence resets don't reset atoms",
			},
			5: {
				requirements: [348, 1e245],
				effectDescription() { return "unlock <b" + getColorClass(this, REF) + "Gate of Evil" },
			},
		};
		const done = req => player.ei.total.gte(req);
		const donePower = (req, reqPower) => player.ei.total.gte(req) && player.ei.power.gte(reqPower);
		const unlocked = id => hasMilestone("ei", id - 1);
		for (const key in obj) {
			if (obj[key].requirements) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirements[0]) + " total evil influence and " + simpleFormatWhole(obj[key].requirements[1]) + " evil power";
				obj[key].done = donePower.bind(null, ...obj[key].requirements);
				delete obj[key].requirements;
			} else if (obj[key].requirement) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " total evil influence";
				obj[key].done = done.bind(null, obj[key].requirement);
				delete obj[key].requirement;
			};
			if (+key >= 1) obj[key].unlocked = unlocked.bind(null, +key);
		};
		return obj;
	})(),
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Cycle of Evil' },
			description: 'multiplies evil influence gain based on your evil power',
			cost: 2,
			effect() { return player.ei.power.add(1).log10().add(1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: log10(x+1)+1';
				return text;
			},
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Evil Power Up' },
			description: 'multiplies evil power gain based on your evil power',
			cost: 3,
			effect() { return player.ei.power.add(1).pow(0.1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.1';
				return text;
			},
			unlocked() { return hasUpgrade("ei", 11) },
		},
		13: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'More Evil' },
			description: 'reduces evil influence cost scaling<br>12 --> 7.75',
			cost: 3,
			unlocked() { return hasUpgrade("ei", 12) },
		},
		14: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Rising Conflict' },
			description: 'multiplies evil power gain based on your good influence',
			cost: 4,
			effect() { return  player.gi.points.add(1).pow(0.75) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.75';
				return text;
			},
			unlocked() { return hasUpgrade("ei", 13) },
		},
		15: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Evil Laughter' },
			description: 'increases evil power\'s base gain<br>2 --> 4',
			cost: 4,
			unlocked() { return hasUpgrade("ei", 14) },
		},
		21: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'The Cycle Continues' },
			description() { return  'multiplies the effect of <b' + getColorClass(this, REF) + 'Cycle of Evil</b> based on your evil power' },
			cost: 4,
			effect() { return  player.ei.power.add(1).log10().add(1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: log10(x+1)+1';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 5 },
		},
		22: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Stronger Evil' },
			description() { return  'multiplies the effect of <b' + getColorClass(this, REF) + 'Evil Power Up</b> based on your evil power' },
			cost: 5,
			effect() { return  player.ei.power.add(1).pow(0.2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.2';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 5 },
		},
		23: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Even More Evil' },
			description: 'reduces evil influence cost scaling<br>7.75 --> 7.25',
			cost: 5,
			unlocked() { return player.ei.upgrades.length >= 5 },
		},
		24: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Daredevil' },
			description: 'multiplies good influence gain based on your evil power',
			cost: 6,
			effect() { return  player.ei.power.add(1).log10().add(1).pow(0.0175) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^0.0175';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 5 },
		},
		25: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'The Evil Eye' },
			description: 'increases evil power\'s base gain<br>4 --> 6',
			cost: 6,
			unlocked() { return player.ei.upgrades.length >= 5 },
		},
		31: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Demonic Cycle' },
			description() { return  'multiplies the effect of <b' + getColorClass(this, REF) + 'The Cycle Continues</b> based on your demon souls' },
			cost: 6,
			effect() { return  player.ds.points.add(1).log10().add(1).pow(0.02) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^0.02';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 10 },
		},
		32: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Demonic Evil' },
			description() { return  'multiplies the effect of <b' + getColorClass(this, REF) + 'Stronger Evil</b> based on your demon souls' },
			cost: 7,
			effect() { return  player.ds.points.add(1).log10().add(1).pow(0.9) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^0.9';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 10 },
		},
		33: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Evil Gathering' },
			description: 'reduces evil influence cost scaling<br>7.25 --> 7',
			cost: 7,
			unlocked() { return player.ei.upgrades.length >= 10 },
		},
		34: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Greedy Evil' },
			description: 'multiplies relic gain based on your evil power',
			cost: 8,
			effect() { return  player.ei.power.add(1).log10().add(1).pow(0.01) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^0.01';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 10 },
		},
		35: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Innate Evil' },
			description: 'increases evil power\'s base gain<br>6 --> 8',
			cost: 8,
			unlocked() { return player.ei.upgrades.length >= 10 },
		},
		41: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Longer Cycle' },
			description() { return  'multiplies the effect of <b' + getColorClass(this, REF) + 'Demonic Cycle</b> based on your evil power' },
			cost: 8,
			effect() { return  player.ei.power.add(1).log10().add(1).pow(0.06) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^0.06';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 15 },
		},
		42: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Crimson Evil' },
			description() { return  'multiplies the effect of <b' + getColorClass(this, REF) + 'Demonic Evil</b> based on your demon souls' },
			cost: 9,
			effect() { return  player.ds.points.add(1).log10().add(1).pow(0.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^0.5';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 15 },
		},
		43: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Evil Condensing' },
			description: 'reduces evil influence cost scaling<br>7 --> 6.75',
			cost: 9,
			unlocked() { return player.ei.upgrades.length >= 15 },
		},
		44: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Evil Infiltration' },
			description: 'multiplies evil power gain based on your sanctums',
			cost: 10,
			effect() { return  player.s.points.add(1).log10().add(1).pow(4) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^4';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 15 },
		},
		45: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Evil Schemes' },
			description: 'increases evil power\'s base gain<br>8 --> 10',
			cost: 10,
			unlocked() { return player.ei.upgrades.length >= 15 },
		},
		52: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Bloody Evil' },
			description() { return  'multiplies the effect of <b' + getColorClass(this, REF) + 'Crimson Evil</b> based on your evil power' },
			cost: 11,
			effect() { return  player.ei.power.add(1).pow(0.15) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.15';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 20 },
		},
		53: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Amassing Evil' },
			description: 'reduces evil influence cost scaling<br>6.75 --> 6.55',
			cost: 12,
			unlocked() { return player.ei.upgrades.length >= 20 },
		},
		54: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Determination' },
			description: 'multiplies evil influence gain based on your good influence',
			cost: 13,
			effect() { return  player.gi.points.add(1).log10().add(1).pow(0.8) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^0.8';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 20 },
		},
		62: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Empower Evil' },
			description() { return  'multiplies the effect of <b' + getColorClass(this, REF) + 'Bloody Evil</b> based on your evil power' },
			cost: 15,
			effect() { return  player.ei.power.add(1).pow(0.1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.1';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 23 },
		},
		63: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Army of Evil' },
			description: 'reduces evil influence cost scaling<br>6.55 --> 6.45',
			cost: 16,
			unlocked() { return player.ei.upgrades.length >= 23 },
		},
		64: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Evil Rituals' },
			description: 'multiplies evil influence gain based on your sanctums',
			cost: 17,
			effect() { return  player.gi.points.add(1).log10().add(1).pow(0.55) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^0.55';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 23 },
		},
		72: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Powerful Evil' },
			description() { return  'multiplies the effect of <b' + getColorClass(this, REF) + 'Empower Evil</b> based on your evil power' },
			cost: 19,
			effect() { return  player.ei.power.add(1).pow(0.145) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.145';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 26 },
		},
		73: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Evil Kingdom' },
			description: 'reduces evil influence cost scaling<br>6.45 --> 6.25',
			cost: 22,
			unlocked() { return player.ei.upgrades.length >= 26 },
		},
		74: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Evil Prayers' },
			description: 'multiplies evil power gain based on your prayers',
			cost: 25,
			effect() { return  player.p.points.add(1).log10().add(1).pow(3.6) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^3.6';
				return text;
			},
			unlocked() { return player.ei.upgrades.length >= 26 },
		},
		83: {
			title() { return  '<b' + getColorClass(this, TITLE) + 'Infinite Evil' },
			description: 'reduces evil influence cost scaling<br>6.25 --> 5.75',
			cost: 30,
			unlocked() { return player.ei.upgrades.length >= 29 },
		},
	},
	challenges: {
		11: {
			name() { return '<h3' + getColorClass(this, TITLE) + 'Build the Gate' },
			challengeDescription: ' - Resets evil influence milestones<br> - Resets evil influence upgrades<br> - Resets your evil power to 0<br> - Forces an evil influence reset<br> - Divides evil power gain by 1,000<br>',
			goalDescription: '1e230 evil power<br>',
			canComplete() { return player.ei.power.gte(1e230) },
			onEnter() {
				player.ei.milestones = [];
				player.ei.upgrades = [];
				player.ei.power = newDecimalZero();
			},
			rewardDescription: 'exponentiate evil power<br>gain by ^1.075',
			doReset: true,
			noAutoExit: true,
		},
		12: {
			name() { return '<h3' + getColorClass(this, TITLE) + 'Power the Gate' },
			challengeDescription: " - Resets evil influence upgrades<br> - Resets your evil power to 0<br> - Forces an evil influence reset<br> - Divides evil power gain by 1e8",
			goalDescription: '1e21 evil power',
			canComplete() { return player.ei.power.gte(1e21) },
			onEnter() {
				player.ei.upgrades = [];
				player.ei.power = newDecimalZero();
			},
			rewardDescription() { return 'evil influence resets nothing, all <b' + getColorClass(this, REF, "s") + 'Devotion</b> autobuyers can bulk<br>buy 5x, and exponentiate evil<br>power gain by ^1.075' },
			doReset: true,
			noAutoExit: true,
			unlocked() { return hasChallenge("ei", 11) },
		},
		21: {
			name() { return '<h3' + getColorClass(this, TITLE) + 'Enter the Gate' },
			challengeDescription: " - Resets evil influence upgrades<br> - Resets your evil power to 0<br> - Resets your relics to 0<br> - Divides evil power gain by 1e15<br>",
			goalDescription: '1e18 evil power and 93 relics<br>',
			canComplete() { return player.ei.power.gte(1e18) && player.r.points.gte(93) },
			onEnter() {
				player.ei.upgrades = [];
				player.ei.power = newDecimalZero();
				player.r.points = newDecimalZero();
				player.r.best = newDecimalZero();
				player.r.total = newDecimalZero();
			},
			rewardDescription() {
				let text = "unlock Wars";
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) {
					text += " and exponentiate <b" + getColorClass(this, REF, "s") + "Glow</b> gain by ^1.1";
				};
				return text;
			},
			noAutoExit: true,
			unlocked() { return hasChallenge("ei", 12) },
		},
		22: {
			name() { return '<h3' + getColorClass(this, TITLE) + 'And Repeat' },
			challengeDescription() { return 'Endure the negative effects of all the previous <b' + getColorClass(this, REF) + 'Gate of Evil</b> challenges.<br>(It is recommended to turn the evil influence upgrade autobuyer off.)<br>' },
			goalDescription: '1e500 evil power and 144 relics<br>',
			canComplete() { return player.ei.power.gte('1e500') && player.r.points.gte(144) },
			onEnter() {
				player.ei.milestones = [];
				player.ei.upgrades = [];
				player.ei.power = newDecimalZero();
				player.r.points = newDecimalZero();
				player.r.best = newDecimalZero();
				player.r.total = newDecimalZero();
			},
			rewardDescription: 'multiply evil influence<br>gain by 1.75x',
			countsAs: [11, 12, 21],
			noAutoExit: true,
			unlocked() { return hasChallenge("ei", 21) && (hasMilestone("w", 1) || isAssimilated(this.layer) || player.mo.assimilating === this.layer) },
		},
	},
});

addLayer("w", {
	name: "War",
	pluralName: "Wars",
	symbol: "W",
	row: 5,
	position: 0,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		auto_influence: false,
	}},
	color: "#A0A0A0",
	branches: ["ch"],
	requires: 60,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "wars",
	giCostMult() {
		let mult = newDecimalOne();
		if (isAssimilated("ei") || player.mo.assimilating === "ei") {
			mult = mult.div(tmp.ei.effect[1]);
		};
		return mult;
	},
	baseAmount() { return player.gi.points.div(this.giCostMult()).min(player.ei.points) },
	type: "custom",
	getResetGain() {
		if (tmp.w.baseAmount.lt(tmp.w.requires)) return newDecimalZero();
		let gain = tmp.w.baseAmount.sub(tmp.w.requires).div(20).mul(this.gainExp()).floor().sub(player.w.points).add(1);
		if (this.canBuyMax()) return gain.max(0);
		return gain.max(0).min(1);
	},
	getNextAt() {
		if (this.canBuyMax()) return player.w.points.add(this.getResetGain()).div(this.gainExp()).mul(20).add(tmp.w.requires);
		return player.w.points.div(this.gainExp()).mul(20).add(tmp.w.requires);
	},
	canReset() { return this.getResetGain().gt(0) },
	prestigeNotify() { return this.getResetGain().gt(0) },
	prestigeButtonText() { return 'Reset for +<b>' + formatWhole(tmp.w.getResetGain) + '</b> wars<br><br>' + (player.w.points.lt(30) ? (tmp.w.canBuyMax ? 'Next:' : 'Req:') : "") + ' ' + formatWhole(player.gi.points) + ' / ' + format(tmp.w.getNextAt.mul(tmp.w.giCostMult)) + ' GI<br>' + (player.w.points.lt(30) ? 'and ' : "") + formatWhole(player.ei.points) + ' / ' + format(tmp.w.getNextAt) + ' EI' },
	canBuyMax() { return hasMilestone("ch", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
	onPrestige() {
		if (hasMilestone("w", 5) || hasMilestone("pl", 0)) return;
		player.c.unlocked = false;
		player.q.unlocked = false;
		player.sp.unlocked = false;
		player.h.unlocked = false;
		player.ds.unlocked = false;
		player.a.unlocked = false;
		player.p.unlocked = false;
		player.s.unlocked = false;
		if (!hasMilestone("w", 2)) player.r.unlocked = false;
		if (!hasMilestone("w", 0)) player.m.unlocked = false;
		if (!hasMilestone("w", 1)) player.gi.unlocked = false;
		if (!hasMilestone("w", 2)) player.ei.unlocked = false;
	},
	onPrestigeIsAfterGain: true,
	gainExp() {
		let gain = newDecimalOne();
		if (new Decimal(tmp.ch.effect[1]).gt(1) && !tmp.ch.deactivated) gain = gain.mul(tmp.ch.effect[1]);
		return gain;
	},
	autoPrestige() { return hasMilestone("w", 17) || hasUpgrade("pl", 72) },
	tooltipLocked() {
		if (tmp[this.layer].deactivated) return 'War is deactivated';
		return 'Reach ' + this.requires + ' GI and ' + this.requires + ' EI to unlock (You have ' + formatWhole(player.gi.points) + ' GI and ' + formatWhole(player.ei.points) + ' EI)';
	},
	hotkeys: [{key: "w", description: "W: Reset for wars", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return hasChallenge("ei", 21) || player.w.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer) },
	automate() {
		if (hasMilestone("w", 18) && player[this.layer].auto_influence) {
			updateBuyableTemp(this.layer);
			for (const id in layers[this.layer].buyables) {
				buyBuyable(this.layer, id);
			};
		};
	},
	effect() { return [
		new Decimal(1e10).pow(player.w.points),
		player.w.points.add(1).log10().add(1).pow(0.333),
		player.w.points.add(1).pow(isAssimilated(this.layer) || player.mo.assimilating === this.layer ? 5 : 1.5),
	]},
	effectDescription() { return 'which multiplies point, essence, core, quark, subatomic particle, hex, demon soul, and prayer gain by <h2 class="layer-w">' + format(tmp.w.effect[0]) + '</h2>x; multiplies atom, sanctum, relic, molecule, good influence, and evil influence gain by <h2 class="layer-w">' + format(tmp.w.effect[1]) + '</h2>x; and multiplies light gain after hardcap by <h2 class="layer-w">' + format(tmp.w.effect[2]) + '</h2>x' },
	doReset(resettingLayer) {
		if (hasMilestone("ch", 12) && resettingLayer == "ch") return;
		let keep = ["auto_influence"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		let save;
		if (hasMilestone("ch", 10) && resettingLayer == "ch") {
			save = player.ch.points.mul(10);
			if (save.gt(player.w.points)) save = player.w.points;
		} else if (hasMilestone("ch", 9) && resettingLayer == "ch") {
			save = player.ch.points.mul(5);
			if (save.gt(player.w.points)) save = player.w.points;
		} else if (hasMilestone("ch", 0) && resettingLayer == "ch") {
			save = player.ch.points;
			if (save.gt(player.w.points)) save = player.w.points;
		};
		if (hasMilestone("ch", 1) && resettingLayer == "ch") keep.push("milestones");
		if (layers[resettingLayer].row > this.row) {
			layerDataReset("w", keep);
			if (save) {
				player.w.points = save;
				player.w.best = save;
				player.w.total = save;
			};
		};
	},
	resetsNothing() { return hasMilestone("w", 17) || hasUpgrade("pl", 72) },
	tabFormat: {
		Progress: {
			content: getTab("w"),
		},
		Influences: {
			content: getTab("w", "Influences"),
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription: "keep molecule milestones on war resets, and you can autobuy good influence rebuyables",
				toggles: [["gi", "auto_buyables"]],
			},
			1: {
				requirement: 2,
				effectDescription() { return "keep good influence milestones on war resets, you can autobuy evil influence upgrades, perform good influence resets automatically, and unlock a new <b" + getColorClass(this, REF, "ei") + "Gate of Evil</b> challenge" },
				toggles: [["ei", "auto_upgrades"]],
			},
			2: {
				requirement: 3,
				effectDescription() { return "keep evil influence milestones and activated relics on war resets, you can autobuy molecule upgrades, and all <b" + getColorClass(this, REF, "s") + "Devotion</b> autobuyers can bulk buy 2x" },
				toggles: [["m", "auto_upgrades"]],
			},
			3: {
				requirement: 4,
				effectDescription() { return "keep evil influence challenge completions on war resets, you can automatically activate relics, perform evil influence resets automatically, and unlock another <b" + getColorClass(this, REF) + "Influence</b>" },
				toggles: [["r", "auto_activate"]],
			},
			4: {
				requirement: 5,
				effectDescription() { return "keep demon soul challenge completions on war resets, you can autobuy individual relic upgrades, relics reset nothing, perform relic resets automatically, and unlock another <b" + getColorClass(this, REF) + "Influence</b>" },
				toggles: [["r", "auto_upgrade_1"], ["r", "auto_upgrade_2"], ["r", "auto_upgrade_3"]],
			},
			5: {
				requirement: 6,
				effectDescription: "war resets don't reset relics, and keep everything unlocked on war resets",
			},
			6: {
				requirement: 7,
				effectDescription: "war resets don't reset molecules",
			},
			7: {
				requirement: 8,
				effectDescription: "war resets don't reset cores",
			},
			8: {
				requirement: 9,
				effectDescription() { return "war resets don't reset good influence, and unlock another <b" + getColorClass(this, REF) + "Influence</b>" },
			},
			9: {
				requirement: 10,
				effectDescription: "war resets don't reset quarks, and unlock cellular life",
			},
			10: {
				requirement: 11,
				effectDescription() { return "war resets don't reset prayers, and reduce <b" + getColorClass(this, REF) + "Relic Hoarding</b> cost scaling past 6 of them" },
			},
			11: {
				requirement: 12,
				effectDescription() { return "war resets don't reset sanctums, and increase the maximum bought of <b" + getColorClass(this, REF) + "Power of Good</b> by 1" },
			},
			12: {
				requirement: 13,
				effectDescription() { return "increase the maximum bought of <b" + getColorClass(this, REF) + "Power of Good</b> by 1" },
			},
			13: {
				requirement: 15,
				effectDescription() { return "increase the maximum bought of <b" + getColorClass(this, REF) + "Power of Good</b> by 2" },
			},
			14: {
				requirement: 18,
				effectDescription() { return "increase the maximum bought of <b" + getColorClass(this, REF) + "Power of Good</b> by 3 and you can autobuy <b" + getColorClass(this, REF, "cl") + "Tissues</b>" },
				toggles: [["cl", "auto_tissues"]],
			},
			15: {
				requirement: 22,
				effectDescription() { return "increase the maximum bought of <b" + getColorClass(this, REF) + "Power of Good</b> by 12, and all <b" + getColorClass(this, REF, "s") + "Devotion</b> autobuyers can bulk buy 5x" },
			},
			16: {
				requirement: 24,
				effectDescription() { return "increase the maximum bought of <b" + getColorClass(this, REF) + "Power of Good</b> by 28, reduce <b" + getColorClass(this, REF) + "Power of Good</b> cost scaling, and unlock <b" + getColorClass(this, REF, "cl") + "Protein</b>" },
			},
			17: {
				requirement: 36,
				effectDescription: "war resets nothing and auto perform war resets",
			},
			18: {
				requirement: 60,
				effectDescription() { return "unlock 3 more protein buyables, and you can autobuy <b" + getColorClass(this, REF) + "Influences</b>" },
				toggles: [["w", "auto_influence"]],
			},
			19: {
				requirement: 64,
				effectDescription() { return "increase passive protein gain by 10%, multiply passive protein gain by 100x, improve <b" + getColorClass(this, REF, "cl") + "Passive Discovery</b>'s effect formulas, and disable manual protein gain" },
			},
			20: {
				requirement: 67,
				effectDescription() { return "improve <b" + getColorClass(this, REF, "cl") + "Passive Discovery</b>'s effect formulas and <b" + getColorClass(this, REF, "cl") + "Innate Evil</b>'s effect formula" },
			},
		};
		const done = req => player.w.points.gte(req);
		for (const key in obj) {
			obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " war" + (obj[key].requirement === 1 ? "" : "s");
			obj[key].done = done.bind(null, obj[key].requirement);
			delete obj[key].requirement;
		};
		return obj;
	})(),
	bars: {
		tide: {
			direction: RIGHT,
			width: 600,
			height: 50,
			display() {
				if (player.gi.points.gt(player.ei.points)) return 'the tide currently favors good by ' + format(player.ei.points.div(player.gi.points).neg().add(1).mul(100)) + '%';
				if (player.ei.points.gt(player.gi.points)) return 'the tide currently favors evil by ' + format(player.gi.points.div(player.ei.points).neg().add(1).mul(100)) + '%';
				return 'the tide currently favors neither good nor evil';
			},
			progress() {
				if (player.gi.points.eq(player.ei.points)) return 0.5;
				return player.ei.points.div(player.ei.points.add(player.gi.points)).toNumber();
			},
			baseStyle: {'background-image': 'linear-gradient(#08FF87, #AAFF00)'},
			fillStyle: {'background-image': 'linear-gradient(#FF4400, #BA0035)'},
			textStyle: {color: "#000000"},
		},
	},
	buyables: {
		11: {
			cost(x) {
				if (x.eq(0)) return new Decimal(108);
				if (x.eq(1)) return new Decimal(124);
				if (x.lt(4)) return x.mul(20).add(104);
				if (x.eq(4)) return new Decimal(177);
				if (x.eq(5)) return new Decimal(188);
				if (x.eq(6)) return new Decimal(194);
				return x.mul(5).add(163);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Rivalry' },
			description: 'multiplies good influence and evil influence gain based on the amount of this upgrade bought.',
			canAfford() { return player.gi.points.gte(this.cost()) && player.ei.points.gte(this.cost()) },
			purchaseLimit: 5000,
			buy() { buyMultiCurrencyBuyable(this, ["gi", "ei"], hasMilestone("ch", 10)) },
			effect(x) { return [x.add(1).pow(0.09), x.add(1).pow(0.21)] },
			effectDisplay(eff) {
				let text = format(eff[0]) + 'x<br>and ' + format(eff[1]) + 'x';
				if (options.nerdMode) text += '<br>formulas: (x+1)^0.09<br>and (x+1)^0.21';
				return text;
			},
			costDisplay(cost) { return 'Cost: ' + formatWhole(cost) + ' GI and ' + formatWhole(cost) + ' EI' },
		},
		12: {
			cost(x) {
				if (x.eq(0)) return new Decimal(171);
				if (x.eq(1)) return new Decimal(186);
				if (x.eq(2)) return new Decimal(196);
				if (x.lt(5)) return x.mul(12).add(168);
				if (x.eq(5)) return new Decimal(218);
				if (x.eq(6)) return new Decimal(225);
				if (hasMilestone("w", 10)) return x.mul(7).add(170);
				return x.mul(8).add(170);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Relic Hoarding' },
			description: 'multiplies evil influence gain based on your relics and the amount of this upgrade bought.',
			canAfford() { return player.r.points.gte(this.cost()) },
			purchaseLimit: 15,
			buy() { buyMultiCurrencyBuyable(this, ["r"], hasMilestone("ch", 10)) },
			effect(x) { return player.r.points.add(1).pow(0.1).mul(x).add(1).pow(0.25) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (y((x+1)^0.1)+1)^0.25';
				return text;
			},
			currencyDisplayName: 'relics',
			unlocked() { return hasMilestone("w", 3) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		13: {
			cost(x) {
				if (player.h.limitsBroken >= 1) return new Decimal(1.1).pow(x).mul(10_000_000);
				if (hasMilestone("w", 16)) return x.mul(50_000).add(320_000);
				return x.mul(70_000).add(320_000);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Power of Good' },
			description: 'multiplies good influence gain based on your sanctums and the amount of this upgrade bought.',
			canAfford() { return player.s.points.gte(this.cost()) },
			purchaseLimit() {
				if (player.h.limitsBroken >= 1) return 1e9;
				let max = 3;
				if (hasMilestone("w", 11)) max += 1;
				if (hasMilestone("w", 12)) max += 1;
				if (hasMilestone("w", 13)) max += 2;
				if (hasMilestone("w", 14)) max += 3;
				if (hasMilestone("w", 15)) max += 12;
				if (hasMilestone("w", 16)) max += 28;
				return max;
			},
			buy() { buyMultiCurrencyBuyable(this, ["s"], hasMilestone("ch", 10)) },
			effect(x) {
				if (player.h.limitsBroken >= 1) return player.s.points.add(1).pow(0.025).mul(x).add(1).pow(0.05);
				return player.s.points.add(1).pow(0.025).mul(x).add(1).pow(0.025);
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) {
					if (player.h.limitsBroken >= 1) text += '<br>formula: (y((x+1)^0.025)+1)^0.05';
					else text += '<br>formula: (y((x+1)^0.025)+1)^0.025';
				};
				return text;
			},
			currencyDisplayName: 'sanctums',
			unlocked() { return hasMilestone("w", 4) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		21: {
			cost(x) { return x.mul(5).add(235) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Race for Knowledge' },
			description() { return 'multiplies ' + (hasMilestone("ch", 35) ? 'atom and ' : "") + 'molecule gain based on the amount of this upgrade bought.' },
			canAfford() { return player.gi.points.gte(this.cost()) && player.ei.points.gte(this.cost()) },
			purchaseLimit() {
				let max = new Decimal(20);
				if (hasMilestone("ch", 7)) max = max.add(milestoneEffect("ch", 7));
				if (hasMilestone("ch", 38)) max = max.add(50);
				if (hasMilestone("mo", 1)) max = max.add(50);
				return max;
			},
			buy() { buyMultiCurrencyBuyable(this, ["gi", "ei"], hasMilestone("ch", 10)) },
			effect(x) {
				if (hasMilestone("ch", 8)) return x.add(1).pow(7.5).add(new Decimal(2.5).pow(x)).sub(1);
				return x.add(1).pow(3.25);
			},
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) {
					if (hasMilestone("ch", 8)) text += '<br>formula: (x+1)^7.5 + 2.5^x - 1';
					else text += '<br>formula: (x+1)^3.25';
				};
				return text;
			},
			costDisplay(cost) { return 'Cost: ' + formatWhole(cost) + ' GI and ' + formatWhole(cost) + ' EI' },
			unlocked() { return hasMilestone("w", 8) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		22: {
			cost(x) { return new Decimal(hasMilestone("ch", 34) ? 100 : 1000).pow(x) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Relics of Good' },
			description: 'multiplies good influence gain based on your relics and the amount of this upgrade bought.',
			canAfford() { return player.r.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyMultiCurrencyBuyable(this, ["r"], hasMilestone("ch", 10)) },
			effect(x) { return player.r.points.add(1).log10().mul(x).div(1000).add(1).pow(0.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)*y/1000+1)^0.5';
				return text;
			},
			currencyDisplayName: 'relics',
			unlocked() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		23: {
			cost(x) { return new Decimal(hasMilestone("ch", 32) ? 1e6 : 1e10).pow(x) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Sanctum Habitation' },
			description: 'multiplies multicellular organism gain based on your sanctums and the amount of this upgrade bought.',
			canAfford() { return player.s.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyMultiCurrencyBuyable(this, ["s"], hasMilestone("ch", 10)) },
			effect(x) { return player.s.points.add(1).log10().mul(x).div(100).add(1).pow(0.1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)*y/100+1)^0.1';
				return text;
			},
			currencyDisplayName: 'sanctums',
			unlocked() { return isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
	},
});

addLayer("cl", {
	name: "Cellular Life",
	symbol: "CL",
	row: 5,
	position: 2,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		protein: newDecimalZero(),
		auto_tissues: false,
		auto_buyable_31: false,
		auto_buyable_32: false,
		auto_buyable_33: false,
		auto_buyable_41: false,
		auto_buyable_42: false,
		auto_buyable_43: false,
		auto_buyable_51: false,
		auto_buyable_52: false,
		auto_buyable_53: false,
	}},
	color: "#008800",
	branches: ["mo"],
	requires: 1e25,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "cellular life",
	baseResource: "molecules",
	baseAmount() { return player.m.points },
	type: "static",
	base() {
		if (hasMilestone("ch", 37)) return 4;
		if (hasMilestone("ch", 36)) return 14;
		if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return 50;
		return 100;
	},
	exponent() {
		if (hasMilestone("cl", 11)) return 1.4;
		if (hasMilestone("cl", 10)) return 1.45;
		return 1.5;
	},
	canBuyMax() { return hasMilestone("cl", 0) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
	gainExp() {
		let gain = newDecimalOne();
		if (getPurifiedDemonSouls() >= 3 && challengeEffect("ds", 101)[1]) gain = gain.mul(challengeEffect("ds", 101)[1]);
		if (hasBuyable("cl", 12)) gain = gain.mul(buyableEffect("cl", 12)[1]);
		if (hasBuyable("cl", 13)) gain = gain.mul(buyableEffect("cl", 13)[1]);
		if (hasChallenge("ch", 21)) gain = gain.mul(challengeEffect("ch", 21)[0]);
		if (tmp.mo.effect.gt(1) && !tmp.mo.deactivated) gain = gain.mul(tmp.mo.effect);
		return gain;
	},
	autoPrestige() { return hasMilestone("cl", 12) || hasUpgrade("pl", 74) },
	hotkeys: [{key: "l", description: "L: Reset for cellular life", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return hasMilestone("w", 9) || player.cl.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer) },
	automate() {
		if (hasMilestone("w", 14) && player.cl.auto_tissues) {
			[21, 13, 12, 11].forEach(id => buyBuyable("cl", id));
		};
		if (hasMilestone("ch", 1)) {
			if (player.cl.auto_buyable_31) buyBuyable("cl", 31);
			if (player.cl.auto_buyable_32) {
				buyBuyable("cl", 32);
				if (hasMilestone("ch", 22)) buyBuyable("cl", 32);
			};
			if (player.cl.auto_buyable_33) buyBuyable("cl", 33);
		};
		if (hasMilestone("ch", 6)) {
			if (player.cl.auto_buyable_41) buyBuyable("cl", 41);
			if (player.cl.auto_buyable_42) buyBuyable("cl", 42);
			if (player.cl.auto_buyable_43) buyBuyable("cl", 43);
		};
		if (hasMilestone("ch", 7)) {
			if (player.cl.auto_buyable_51) buyBuyable("cl", 51);
			if (player.cl.auto_buyable_52) buyBuyable("cl", 52);
			if (player.cl.auto_buyable_53) buyBuyable("cl", 53);
		};
	},
	doReset(resettingLayer) {
		let keep = ["auto_tissues", "auto_buyable_31", "auto_buyable_32", "auto_buyable_33", "auto_buyable_41", "auto_buyable_42", "auto_buyable_43", "auto_buyable_51", "auto_buyable_52", "auto_buyable_53"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (hasMilestone("ch", 0) && resettingLayer == "ch") keep.push("milestones");
		if (hasMilestone("ch", 39) && resettingLayer == "ch") keep.push("buyables");
		if (layers[resettingLayer].row > this.row) layerDataReset("cl", keep);
	},
	resetsNothing() { return hasMilestone("cl", 12) || hasUpgrade("pl", 74) },
	proteinConv() {
		// init
		let conv = newDecimalZero();
		// add
		if (hasBuyable("cl", 31)) conv = conv.add(buyableEffect("cl", 31));
		else if (!tmp.cl.deactivated) conv = conv.add(1);
		// mul
		if (hasBuyable("cl", 32)) conv = conv.mul(buyableEffect("cl", 32));
		if (hasBuyable("cl", 41)) conv = conv.mul(buyableEffect("cl", 41));
		if (hasBuyable("cl", 42)) conv = conv.mul(buyableEffect("cl", 42));
		if (hasBuyable("cl", 43)) conv = conv.mul(buyableEffect("cl", 43)[1]);
		if (hasBuyable("cl", 51)) conv = conv.mul(buyableEffect("cl", 51));
		if (hasChallenge("ch", 21)) conv = conv.mul(challengeEffect("ch", 21)[1]);
		if (new Decimal(tmp.ch.effect[2]).gt(1) && !tmp.ch.deactivated) conv = conv.mul(tmp.ch.effect[2]);
		// return
		return conv;
	},
	proteinGain() {
		// init
		let mult = newDecimalZero();
		// add
		if (hasBuyable("cl", 43)) mult = mult.add(buyableEffect("cl", 43)[0]);
		if (hasMilestone("w", 19)) mult = mult.add(0.1);
		// mul
		if (hasMilestone("w", 19)) mult = mult.mul(100);
		// return
		return mult.mul(player.cl.points).mul(tmp.cl.proteinConv);
	},
	update(diff) { player.cl.protein = player.cl.protein.add(tmp.cl.proteinGain.mul(diff)) },
	tabFormat: {
		"Life Tracker": {
			content: getTab("cl"),
		},
		Tissues: {
			content: getTab("cl", "Tissues"),
		},
		Protein: {
			content: getUnlockableTab("cl", "Protein"),
			unlocked() { return hasMilestone("w", 16)},
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription: "keep good influence and evil influence milestones on cellular life resets, unlock options to toggle good influence and evil influence auto prestiges, and you can buy max cellular life",
				toggles: [["ei", "auto_prestige"], ["gi", "auto_prestige"]],
			},
			1: {
				requirement: 2,
				effectDescription() { return "cellular life doesn't reset relics, unlock an option to disable extra <b" + getColorClass(this, REF, "s") + "Devotion</b> autobuyer speed, but make all <b" + getColorClass(this, REF, "s") + "Devotion</b> autobuyers bulk buy 100x, and unlock another <b" + getColorClass(this, REF) + "Tissue</b>" },
				toggles: [["s", 'no_speed_but_more_bulk']],
			},
			2: {
				requirement: 4,
				effectDescription() { return "cellular life doesn't reset cores, and all <b" + getColorClass(this, REF, "s") + "Devotion</b> autobuyers can bulk buy 2x" },
			},
			3: {
				requirement: 6,
				effectDescription() { return "cellular life doesn't reset evil influence, keep demon soul challenge completions on cellular life resets, and unlock another <b" + getColorClass(this, REF) + "Tissue</b>" },
			},
			4: {
				requirement: 9,
				effectDescription: "cellular life doesn't reset good influence, and keep molecule milestones on cellular life resets",
			},
			5: {
				requirement: 18,
				effectDescription: "cellular life doesn't reset quarks",
			},
			6: {
				requirement: 30,
				effectDescription: "cellular life doesn't reset prayers",
			},
			7: {
				requirement: 63,
				effectDescription: "cellular life doesn't reset sanctums",
			},
			8: {
				requirement: 135,
				effectDescription: "keep atom milestones on cellular life resets",
			},
			9: {
				requirement: 214,
				effectDescription() { return "unlock another <b" + getColorClass(this, REF) + "Tissue</b>" },
			},
			10: {
				requirement: 318,
				effectDescription: "reduce the cost scaling of cellular life (1.5 --> 1.45)",
			},
			11: {
				requirement: 677,
				effectDescription: "reduce the cost scaling of cellular life (1.45 --> 1.4)",
			},
			12: {
				requirementDescription: "111 cellular life and 9,999 total cellular life",
				effectDescription: "cellular life resets nothing and auto perform cellular life resets",
				done() { return player.cl.points.gte(111) && player.cl.total.gte(9999) },
			},
		};
		const done = req => player.cl.total.gte(req);
		for (const key in obj) {
			if (obj[key].requirement) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " total cellular life";
				obj[key].done = done.bind(null, obj[key].requirement);
				delete obj[key].requirement;
			};
		};
		return obj;
	})(),
	buyables: {
		11: {
			cost(x) {
				if (x.gte(10)) return x.mul(2).sub(8);
				return x.add(1);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Nervous Tissue' },
			description: 'exponentiates core gain multiplier and multiplies atom gain based on the amount of this upgrade bought.',
			canAfford() { return player.cl.points.gte(this.cost()) },
			purchaseLimit: 750,
			buy() { buyStandardBuyable(this, "cl", 'points', getCellularLifeBuyableBulk(), true) },
			effect(x) {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return [x.add(1).pow(0.05), new Decimal(1.1).pow(x)];
				return [x.add(1).pow(0.05), x.add(1).pow(1.5)];
			},
			effectDisplay(eff) {
				let text = '^' + format(eff[0]) + '<br>and ' + format(eff[1]) + 'x';
				if (options.nerdMode) {
					if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) text += '<br>formulas: (x+1)^0.05<br>and 1.1^x';
					else text += '<br>formulas: (x+1)^0.05<br>and (x+1)^1.5';
				};
				return text;
			},
		},
		12: {
			cost(x) {
				if (x.gte(10)) return x.mul(2).sub(8);
				return x.add(1);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Muscle Tissue' },
			description: 'exponentiates demon soul gain multiplier and multiplies cellular life gain based on the amount of this upgrade bought.',
			canAfford() { return player.cl.points.gte(this.cost()) },
			purchaseLimit: 750,
			buy() { buyStandardBuyable(this, "cl", 'points', getCellularLifeBuyableBulk(), true) },
			effect(x) {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return [x.add(1).pow(0.0175), x.add(1).pow(0.55)];
				return [x.add(1).pow(0.0175), x.add(1).pow(0.5)];
			},
			effectDisplay(eff) {
				let text = '^' + format(eff[0]) + '<br>and ' + format(eff[1]) + 'x';
				if (options.nerdMode) {
					if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) text += '<br>formulas: (x+1)^0.0175<br>and (x+1)^0.55';
					else text += '<br>formulas: (x+1)^0.0175<br>and (x+1)^0.5';
				};
				return text;
			},
			unlocked() { return hasMilestone("cl", 1) },
		},
		13: {
			cost(x) {
				if (x.gte(10)) return x.mul(2).sub(8);
				return x.add(1);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Epithelial Tissue' },
			description: 'exponentiates subatomic particle gain multiplier and multiplies cellular life gain based on the amount of this upgrade bought.',
			canAfford() { return player.cl.points.gte(this.cost()) },
			purchaseLimit: 750,
			buy() { buyStandardBuyable(this, "cl", 'points', getCellularLifeBuyableBulk(), true) },
			effect(x) {
				if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) return [x.add(1).pow(0.025), x.add(1).pow(0.8)];
				return [x.add(1).pow(0.025), x.add(1).pow(0.75)];
			},
			effectDisplay(eff) {
				let text = '^' + format(eff[0]) + '<br>and ' + format(eff[1]) + 'x';
				if (options.nerdMode) {
					if (isAssimilated(this.layer) || player.mo.assimilating === this.layer) text += '<br>formulas: (x+1)^0.025<br>and (x+1)^0.8';
					else text += '<br>formulas: (x+1)^0.025<br>and (x+1)^0.75';
				};
				return text;
			},
			unlocked() { return hasMilestone("cl", 3) },
		},
		21: {
			cost(x) { return x.mul(10).add(10) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Connective Tissue' },
			description: 'exponentiates essence gain multiplier and exponentiates core gain multiplier based on the amount of this upgrade bought.',
			canAfford() { return player.cl.points.gte(this.cost()) },
			purchaseLimit: 400,
			buy() { buyStandardBuyable(this, "cl", 'points', getCellularLifeBuyableBulk(), true) },
			effect(x) { return [x.add(1).pow(0.075), x.add(1).pow(0.36)] },
			effectDisplay(eff) {
				let text = '^' + format(eff[0]) + '<br>and ^' + format(eff[1]);
				if (options.nerdMode) text += '<br>formulas: (x+1)^0.075<br>and (x+1)^0.36';
				return text;
			},
			unlocked() { return hasMilestone("cl", 9) },
		},
		31: {
			cost(x) { return x.mul(100).add(1000) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Practice Makes Perfect' },
			description: 'increases protein found from cellular life based on your best cellular life and the amount of this upgrade bought.',
			canAfford() { return player.cl.points.gte(this.cost()) },
			purchaseLimit: 1e9,
			buy() { buyStandardBuyable(this, "cl", 'points', getCellularLifeBuyableBulk(), true) },
			effect(x) { return player.cl.best.mul(x.pow(2)).add(1).pow(0.25) },
			effectDisplay(eff) {
				let text = '+' + format(eff);
				if (options.nerdMode) text += '<br>formula: (x(y^2)+1)^0.25';
				return text;
			},
		},
		32: {
			cost(x) { return new Decimal(1.5).pow(x).mul(10000) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Result Analyzing' },
			description: 'multiplies protein found from cellular life based on your wars and the amount of this upgrade bought.',
			canAfford() { return player.cl.protein.gte(this.cost()) },
			purchaseLimit: 1e9,
			buy() { buyStandardBuyable(this, "cl", 'protein', getCellularLifeBuyableBulk(), true) },
			effect(x) { return player.w.points.mul(x).add(1).pow(1.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (xy+1)^1.5';
				return text;
			},
			currencyDisplayName: 'protein',
		},
		33: {
			cost(x) { return new Decimal(10).pow(x).mul(1000000) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Synergizing' },
			description: 'multiplies atom gain based on the amount of this upgrade bought.',
			canAfford() { return player.cl.protein.gte(this.cost()) },
			purchaseLimit: 1e9,
			buy() { buyStandardBuyable(this, "cl", 'protein', getCellularLifeBuyableBulk(), true) },
			effect(x) { return new Decimal(6).pow(x) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 6^x';
				return text;
			},
			currencyDisplayName: 'protein',
		},
		41: {
			cost(x) {
				if (player.h.limitsBroken >= 2) return new Decimal(1e10).pow(x);
				return new Decimal(10).pow(x).mul(1e45);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Deeper Comprehension' },
			description: 'multiplies protein found from cellular life based on the amount of this upgrade bought.',
			canAfford() { return player.m.points.gte(this.cost()) },
			purchaseLimit() { return player.h.limitsBroken >= 2 ? 1e9 : 30 },
			buy() { buyStandardBuyable(this, "m", 'points', getCellularLifeBuyableBulk(), true) },
			effect(x) { return new Decimal(3).pow(x) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 3^x';
				return text;
			},
			currencyDisplayName: 'molecules',
		},
		42: {
			cost(x) { return new Decimal(100).pow(x).mul(1e14) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Intensive Research' },
			description: 'multiplies protein found from cellular life based on the amount of this upgrade bought.',
			canAfford() { return player.cl.protein.gte(this.cost()) },
			purchaseLimit: 1e9,
			buy() { buyStandardBuyable(this, "cl", 'protein', getCellularLifeBuyableBulk(), true) },
			effect(x) { return new Decimal(5).pow(x) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 5^x';
				return text;
			},
			currencyDisplayName: 'protein',
		},
		43: {
			cost(x) { return new Decimal(10).pow(x).mul(1e33) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Passive Discovery' },
			description: 'increases passive protein gain and multiplies protein found from cellular life based on the amount of this upgrade bought.',
			canAfford() { return player.cl.protein.gte(this.cost()) },
			purchaseLimit: 1e9,
			buy() { buyStandardBuyable(this, "cl", 'protein', getCellularLifeBuyableBulk(), true) },
			effect(x) {
				if (hasMilestone("w", 20)) return [new Decimal(1.36).pow(x).sub(1).mul(10), x.mul(50).add(1).pow(3)];
				if (hasMilestone("w", 19)) return [new Decimal(1.175).pow(x).sub(1).mul(10), x.mul(25).add(1).pow(3)];
				return [new Decimal(1.025).pow(x).sub(1).mul(10), x.mul(7.5).add(1).pow(2)];
			},
			effectDisplay(eff) {
				let text = '+' + format(eff[0].mul(100)) + '%<br>and ' + format(eff[1]) + 'x';
				if (options.nerdMode) { // x to % -> 10(...) * 100 = 1,000(...)
					if (hasMilestone("w", 20)) text += '<br>formulas: 1,000((1.36^x)-1)<br>and (50x+1)^3';
					else if (hasMilestone("w", 19)) text += '<br>formulas: 1,000((1.175^x)-1)<br>and (25x+1)^3';
					else text += '<br>formulas: 1,000((1.025^x)-1)<br>and (7.5x+1)^2';
				};
				return text;
			},
			currencyDisplayName: 'protein',
		},
		51: {
			cost(x) { return x.mul(500).add(4000) },
			title() { return '<b' + getColorClass(this, TITLE) + 'More Perfection' },
			description: 'multiplies protein found from cellular life based the amount of this upgrade bought.',
			canAfford() { return player.cl.points.gte(this.cost()) },
			purchaseLimit: 1e9,
			buy() { buyStandardBuyable(this, "cl", 'points', getCellularLifeBuyableBulk(), true) },
			effect(x) { return x.add(1).pow(10) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^10';
				return text;
			},
			unlocked() { return hasMilestone("w", 18) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		52: {
			cost(x) { return new Decimal(1e5).pow(x).mul(1e40) },
			title() { return '<b' + getColorClass(this, TITLE) + 'More Synergy' },
			description: 'multiplies atom gain based on the amount of this upgrade bought.',
			canAfford() { return player.cl.protein.gte(this.cost()) },
			purchaseLimit: 1e9,
			buy() { buyStandardBuyable(this, "cl", 'protein', getCellularLifeBuyableBulk(), true) },
			effect(x) { return new Decimal(10).pow(x) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 10^x';
				return text;
			},
			currencyDisplayName: 'protein',
			unlocked() { return hasMilestone("w", 18) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
		53: {
			cost(x) {
				if (hasMilestone("ch", 0)) return new Decimal(1e5).pow(x.div(2)).mul(1e50);
				return new Decimal(1e5).pow(x).mul(1e50);
			},
			title() { return '<b' + getColorClass(this, TITLE) + 'Innate Evil' },
			description: 'multiplies evil influence gain based on the amount of this upgrade bought.',
			canAfford() { return player.cl.protein.gte(this.cost()) },
			purchaseLimit: 60,
			buy() { buyStandardBuyable(this, "cl", 'protein', getCellularLifeBuyableBulk(), true) },
			effect(x) { return x.add(1).pow(hasMilestone("w", 20) ? 0.155 : 0.125) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) {
					if (hasMilestone("w", 20)) text += '<br>formula: (x+1)^0.155';
					else text += '<br>formula: (x+1)^0.125';
				};
				return text;
			},
			currencyDisplayName: 'protein',
			unlocked() { return hasMilestone("w", 18) || isAssimilated(this.layer) || player.mo.assimilating === this.layer },
		},
	},
	clickables: {
		11: {
			display() { return 'Convert all your cellular life to ' + format(player.cl.points.mul(tmp.cl.proteinConv)) + ' protein' },
			canClick: true,
			onClick() {
				player.cl.protein = player.cl.protein.add(player.cl.points.mul(tmp.cl.proteinConv));
				player.cl.points = newDecimalZero();
			},
			unlocked() { return !hasMilestone("w", 19) },
		},
	},
});

addLayer("ch", {
	name: "Chaos",
	symbol: "CHAOS",
	row: 6,
	position: 0,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		deciphering: true,
	}},
	color: "#FFFFFF",
	nodeStyle() {
		let obj = {width: '150px', height: '150px'};
		if (this.getResetGain().gt(0) || player.ch.unlocked) {
			obj['background-image'] = 'radial-gradient(#FFFFFF, #4CED13, #D2D237, #DB5196, #710CC4, #E36409, #BA0035, #4D2FE0, #FDBBFF, #AAFF00, #B9A975, #00CCCC, #08FF87, #FF4400, #A0A0A0, #008800, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF)';
			obj['border-width'] = 0;
		};
		return obj;
	},
	branches: ["pl"],
	requires: 70,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "chaos",
	baseResource: "wars",
	baseAmount() { return player.w.points },
	type: "custom",
	base: 1.1,
	exponent() { return isAssimilated(this.layer) ? 0.84 : 0.85 },
	getResetGain() {
		if (hasMilestone("pl", 0)) {
			return getResetGain("ch", "static");
		};
		if (tmp.ch.baseAmount.lt(tmp.ch.requires)) return newDecimalZero();
		let gain = tmp.ch.baseAmount.sub(tmp.ch.requires);
		if (player.ch.points.gt(102)) gain = newDecimalZero();
		else if (player.ch.points.gt(97)) gain = gain.add(32870).div(400);
		else if (player.ch.points.gt(82)) gain = gain.add(13470).div(200);
		else if (player.ch.points.gt(68)) gain = gain.add(5270).div(100);
		else if (player.ch.points.gt(48)) gain = gain.add(1190).div(40);
		else if (player.ch.points.gt(19)) gain = gain.add(230).div(20);
		else if (player.ch.points.gt(8)) gain = gain.add(40).div(10);
		else gain = gain.div(5);
		return gain.mul(tmp.ch.gainExp).floor().sub(player.ch.points).add(1).max(0).min(1);
	},
	getNextAt(canMax = false) {
		if (hasMilestone("pl", 0)) {
			return getNextAt("ch", canMax, "static");
		};
		let next = player.ch.points.div(tmp.ch.gainExp);
		if (player.ch.points.gt(102)) next = newDecimalInf();
		else if (player.ch.points.gt(97)) next = next.mul(400).sub(32870);
		else if (player.ch.points.gt(82)) next = next.mul(200).sub(13470);
		else if (player.ch.points.gt(68)) next = next.mul(100).sub(5270);
		else if (player.ch.points.gt(48)) next = next.mul(40).sub(1190);
		else if (player.ch.points.gt(19)) next = next.mul(20).sub(230);
		else if (player.ch.points.gt(8)) next = next.mul(10).sub(40);
		else next = next.mul(5);
		return next.add(tmp.ch.requires);
	},
	canReset() { return tmp.ch.baseAmount.gte(tmp.ch.nextAt) },
	prestigeNotify() { return tmp.ch.baseAmount.gte(tmp.ch.nextAt) },
	prestigeButtonText() { return randomStr(5) + ' ' + randomStr(3) + ' +<b>' + formatWhole(tmp.ch.getResetGain) + '</b> ' + randomStr(5) + '<br><br>' + (player.ch.points.lt(30) ? (tmp.ch.baseAmount.gte(tmp.ch.nextAt) && tmp.ch.canBuyMax ? randomStr(4) : randomStr(3)) + ':' : "") + ' ' + formatWhole(tmp.ch.baseAmount) + ' / ' + formatWhole(tmp.ch.nextAtDisp) + ' ' + randomStr(4) },
	canBuyMax() { return hasMilestone("pl", 0) },
	gainExp() {
		let gain = newDecimalOne();
		if (hasBuyable("q", 23)) gain = gain.mul(buyableEffect("q", 23));
		if (hasBuyable("mo", 21)) gain = gain.mul(buyableEffect("mo", 21));
		return gain;
	},
	tooltip() { return formatWhole(player.ch.points) + ' ' + randomStr(5) },
	tooltipLocked() { return randomStr(5) + ' ' + this.requires + ' ' + randomStr(4) + ' ' + randomStr(2) + ' ' + randomStr(6) + ' (' + randomStr(3) + ' ' + randomStr(4) + ' ' + formatWhole(player.w.points) + ' ' + randomStr(4) + ')' },
	hotkeys: [{key: "C", description: "Shift-C: Reset for chaos", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.cl.unlocked || player.ch.unlocked },
	deactivated() { return getClickableState("mo", 11) && !canAssimilate(this.layer) },
	automate() {
		if (hasUpgrade("pl", 92)) {
			if (canCompleteChallenge("ch", 11)) player.ch.challenges[11]++;
			if (canCompleteChallenge("ch", 12)) player.ch.challenges[12]++;
		};
	},
	effect() { return [
		new Decimal(hasMilestone("ch", 15) ? 'e1e11' : '1e1000').pow(player.ch.points),
		player.ch.points.add(1).pow(hasMilestone("ch", 19) ? (hasUpgrade("pl", 94) ? 0.1 : 0.0575) : 0.0485),
		new Decimal(hasMilestone("ch", 3) ? 75 : 25).pow(player.ch.points),
	]},
	effectDescription() { return 'which multiplies essence gain by <h2 class="layer-ch">' + format(tmp.ch.effect[0]) + '</h2>x, multiplies war gain by <h2 class="layer-ch">' + format(tmp.ch.effect[1]) + '</h2>x, and multiplies protein gain by <h2 class="layer-ch">' + format(tmp.ch.effect[2]) + '</h2>x' },
	doReset(resettingLayer) {
		let keep = ["deciphering"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (layers[resettingLayer].row > this.row) layerDataReset("ch", keep);
	},
	tabFormat: {
		Accumulation: {
			content: getTab("ch"),
		},
		"The Tides": {
			content: getUnlockableTab("ch", "The Tides"),
			unlocked() { return hasMilestone("ch", 1) },
		},
		Story: {
			content: getTab("ch", "Story"),
		},
		Keywords: {
			content: getTab("ch", "Keywords"),
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription() { return "keep wars equal to your chaos on chaos resets, keep cellular life milestones on chaos resets, you can buy max wars, and reduce <b" + getColorClass(this, REF, "cl") + "Innate Evil</b> cost scaling" },
			},
			1: {
				requirement: 2,
				effectDescription() { return "keep war milestones on chaos resets, unlock <b" + getColorClass(this, REF) + "The Tides</b>, and you can autobuy the first three <b" + getColorClass(this, REF, "cl") + "Protein</b> rebuyables individually" },
				toggles: [["cl", "auto_buyable_31"], ["cl", "auto_buyable_32"], ["cl", "auto_buyable_33"]],
			},
			2: {
				requirement: 3,
				effectDescription() { return "the good influence rebuyable autobuyer is 2x faster; when you buy a good influence rebuyable, you do not spend any good influence, instead you gain total good influence equal to its cost; and unlock another <b" + getColorClass(this, REF) + "Tide</b>" },
			},
			3: {
				requirement: 4,
				effectDescription: "keep molecule milestones on chaos resets, and improve the formula of chaos's third effect",
			},
			4: {
				requirement: 5,
				effectDescription: "keep evil influence challenge completions on chaos resets",
			},
			5: {
				requirement: 6,
				effectDescription: "keep demon soul challenge completions on chaos resets",
			},
			6: {
				requirement: 9,
				effectDescription() { return "the good influence rebuyable autobuyer is 2x faster, and you can autobuy the fourth to sixth <b" + getColorClass(this, REF, "cl") + "Protein</b> rebuyables individually" },
				toggles: [["cl", "auto_buyable_41"], ["cl", "auto_buyable_42"], ["cl", "auto_buyable_43"]],
			},
			7: {
				requirement: 13,
				effect() { return player.ch.points.sub(10).max(0).mul(2.25).floor() },
				effectDescription(eff) { return "you can autobuy the seventh to ninth <b" + getColorClass(this, REF, "cl") + "Protein</b> rebuyables individually, and every chaos after 10 increases the the maximum bought of <b" + getColorClass(this, REF, "w") + "Race for Knowledge</b> by 2.25, rounded down (currently +" + formatWhole(eff) + ")" },
				toggles: [["cl", "auto_buyable_51"], ["cl", "auto_buyable_52"], ["cl", "auto_buyable_53"]],
			},
			8: {
				requirement: 16,
				effectDescription() { return "keep good influence milestones on chaos resets, and improve <b" + getColorClass(this, REF, "w") + "Race for Knowledge</b>'s effect formula" },
			},
			9: {
				requirement: 19,
				effectDescription() { return "keep wars equal to five times your chaos on chaos resets, all <b" + getColorClass(this, REF, "s") + "Devotion</b> autobuyers can bulk buy 5x, and the good influence rebuyable autobuyer is 2x faster" },
			},
			10: {
				requirement: 24,
				effectDescription() { return "keep wars equal to ten times your chaos on chaos resets, all <b" + getColorClass(this, REF, "s") + "Devotion</b> autobuyers can bulk buy 2x, and when you buy an <b" + getColorClass(this, REF, "w") + "Influence</b>, you do not spend any currency, instead you gain total amount(s) of the kind(s) of currency spent equal to its cost" },
			},
			11: {
				requirement: 26,
				effectDescription() { return "if you have <b" + getColorClass(this, REF, "mo") + "Assimilated</b> <b" + getColorClass(this, REF, "q") + "Quarks</b>, unlock four new quark upgrades and another quark rebuyable" },
			},
			12: {
				requirement: 28,
				effectDescription: "chaos resets don't reset wars",
			},
			13: {
				requirement: 30,
				effectDescription() { return "improve <b" + getColorClass(this, REF) + "Tide of Good</b>'s effect formula, and do something with " + getGlitchDecipherText() },
			},
			14: {
				requirement: 33,
				effectDescription: "reduce the multicellular organism cost base (1.2 --> 1.1) and the good influence rebuyable autobuyer is 2x faster",
			},
			15: {
				requirement: 38,
				effectDescription() { return "unlock the option to keep Breaking on chaos resets (<b" + getColorClass(this, REF, "h") + "Reset Breaking</b> will still work), improve the formula of chaos's first effect, and reduce the multicellular organism cost base (1.1 --> 1.067)" },
				toggles: [["h", "keep_breaking"]],
			},
			16: {
				requirement: 42,
				effect() {
					const base = (player.ch.challenges[11] + player.ch.challenges[12]) / 250 + 1;
					if (hasMilestone("ch", 21)) return base ** 6;
					if (hasMilestone("ch", 20)) return base ** 3.5;
					if (hasMilestone("ch", 19)) return base ** 3.325;
					if (hasMilestone("ch", 18)) return base ** 1.8;
					return base ** 1.35;
				},
				effectDescription(eff) { return "you can autobuy the first quark rebuyable, the good influence rebuyable autobuyer is 2x faster, and multiply multicellular organism gain based on <b" + getColorClass(this, REF) + (isAssimilated("ch") ? randomStr(4) : 'Tide') + "</b> completions (currently " + format(eff) + "x)" },
				toggles: [["q", "auto_buyable_11"]],
			},
			17: {
				requirement: 48,
				effectDescription() { return "make the <b" + getColorClass(this, REF) + "42 chaos milestone</b>'s effect also multiply evil influence gain" },
			},
			18: {
				requirement: 50,
				effectDescription() { return "improve the effect formula of the <b" + getColorClass(this, REF) + "42 chaos milestone</b>" },
			},
			19: {
				requirement: 51,
				effectDescription() { return "improve the formula of chaos's second effect and improve the effect formula of the the <b" + getColorClass(this, REF) + "42 chaos milestone</b>" },
			},
			20: {
				requirement: 55,
				effectDescription() { return "you can autobuy the second quark rebuyable, the 6th row of quark upgrades can be autobought, and improve the effect formula of the <b" + getColorClass(this, REF) + "42 chaos milestone</b>" },
				toggles: [["q", "auto_buyable_12"]],
			},
			21: {
				requirement: 57,
				effectDescription() { return "you gain 10x glow, improve the effect formula of the <b" + getColorClass(this, REF) + "42 chaos milestone</b>, and you can buy max multicellular organisms" },
			},
			22: {
				requirement: 59,
				effectDescription() { return "you can autobuy the third and fourth quark rebuyables and the <b" + getColorClass(this, REF, "cl") + "Result Analyzing</b> autobuyer is 2x faster" },
				toggles: [["q", "auto_buyable_13"], ["q", "auto_buyable_21"]],
			},
			23: {
				requirement: 63,
				effectDescription: "the 8th row of hex upgrades and the 8th row of prayer upgrades can be autobought",
			},
			24: {
				requirement: 67,
				effectDescription: "you can autobuy glow rebuyables",
				toggles: [["s", "auto_glow"]],
			},
			25: {
				requirement: 70,
				effectDescription() { return "if you have <b" + getColorClass(this, REF, "mo") + "Assimilated</b> <b" + getColorClass(this, REF, "r") + "Relics</b>, unlock relic milestones" },
			},
			26: {
				requirement: 75,
				effectDescription() { return "if you have <b" + getColorClass(this, REF, "mo") + "Assimilated</b> <b" + getColorClass(this, REF, "r") + "Relics</b>, unlock more relic milestones" },
			},
			27: {
				requirement: 78,
				effectDescription: "the 6th row of molecule upgrades can be autobought, the good influence rebuyable autobuyer can bulk buy 10x, and you gain more total good influence from buying rebuyables based on bulk",
			},
			28: {
				requirement: 82,
				effectDescription() { return "you can autobuy <b" + getColorClass(this, REF, "a") + "Atomic Reactor</b>s and good influence upgrades" },
				toggles: [["a", "auto_reactor"], ["gi", "auto_upgrades"]],
			},
			29: {
				requirement: 87,
				effectDescription: "reduce the multicellular organism cost base (1.067 --> 1.063)",
			},
			30: {
				requirement: 92,
				effectDescription() { return "all quark, good influence, and cellular life rebuyable autobuyers can bulk buy 10x and increase the caps of <b" + getColorClass(this, REF, "q") + "Atomic Insight</b> and <b" + getColorClass(this, REF, "q") + "Insight Into Insight</b> by 101" },
			},
			31: {
				requirement: 96,
				effectDescription() { return "increase the caps of <b" + getColorClass(this, REF, "q") + "Atomic Insight</b> and <b" + getColorClass(this, REF, "q") + "Insight Into Insight</b> by 800" },
			},
			32: {
				requirement: 102,
				effectDescription() { return "reduce the cost scaling of <b" + getColorClass(this, TITLE, "w") + "Sanctum Habitation</b> and you can bulk 10x relic activation" },
			},
			33: {
				requirement: 106,
				effectDescription() { return "reduce the multicellular organism cost base (1.063 --> 1.0575) and increase the cap of <b" + getColorClass(this, TITLE, "mo") + "Assimilation</b> by 1" },
			},
			34: {
				requirement: 115,
				effectDescription() { return "reduce the cost scaling of <b" + getColorClass(this, TITLE, "w") + "Relics of Good</b>" },
			},
			35: {
				requirement: 122,
				effectDescription() { return "<b" + getColorClass(this, TITLE, "w") + "Race for Knowledge</b> also affects atom gain" },
			},
			36: {
				requirement: 128,
				effectDescription: "reduce the cellular life cost base (50 --> 14)",
			},
			37: {
				requirement: 133,
				effectDescription: "reduce the cellular life cost base (14 --> 4)",
			},
			38: {
				requirement: 140,
				effectDescription() { return "increase the cap of <b" + getColorClass(this, TITLE, "w") + "Race for Knowledge</b> by 50 and increase the cap of <b" + getColorClass(this, TITLE, "mo") + "Assimilation</b> by 1" },
			},
			39: {
				requirement: 148,
				effectDescription: "keep cellular life rebuyables on chaos resets",
			},
			40: {
				requirement: 158,
				effectDescription() { return "divide <b" + getColorClass(this, REF) + "Tide of Science</b>'s goal by 1e100" },
			},
			41: {
				requirement: 164,
				effectDescription: "unlock two more quark rebuyables",
			},
			42: {
				requirement: 173,
				effectDescription: "reduce the multicellular organism cost base (1.0575 --> 1.055)",
			},
			43: {
				requirement: 186,
				effectDescription() { return "make the <b" + getColorClass(this, REF, "gi") + "Good Influence</b> <b" + getColorClass(this, REF, "mo") + "Synergy</b> softcap weaker (/4 --> /2) and increase <b" + getColorClass(this, REF, "pl") + "Chaotic Air</b>'s effect exponent (0.5 -> 1.25)" },
			},
			44: {
				requirement: 194,
				effectDescription() { return "unlock <b" + getColorClass(this, REF, "ds") + "Purification</b>, a new demon souls tab" },
			},
			45: {
				requirement: 203,
				effectDescription: "improve the Thread gain formula",
			},
			46: {
				requirement: 216,
				effectDescription: "you can autobuy the fifth and sixth quark rebuyables",
				toggles: [["q", "auto_buyable_22"], ["q", "auto_buyable_23"]],
			},
			47: {
				requirement: 231,
				effectDescription() { return "increase the maximum completion limit of <b" + getColorClass(this, REF) + "Tide of Science</b> by 2" },
			},
			48: {
				requirement: 252,
				effect() { return player.ch.points.add(1) },
				effectDescription(eff) { return "multiply Thread gain by your chaos plus 1 (currently " + formatWhole(eff) + "x)" },
			},
			49: {
				requirement: 280,
				effect() { return player.q.buyables[11].add(player.q.buyables[12]).add(player.q.buyables[13]).add(player.q.buyables[21]).add(player.q.buyables[22]).add(player.q.buyables[23]).add(1) },
				effectDescription(eff) { return "change <b" + getColorClass(this, TITLE, "q") + "Knowledge Expansion</b>'s cost formula and multiply Thread gain by the amount of quark rebuyables bought plus 1 (currently " + formatWhole(eff) + "x)" },
			},
			50: {
				requirement: 300,
				effectDescription() { return "coming soon..." },
			},
		};
		const done = req => player.ch.points.gte(req);
		const unlockedMO = () => player.mo.unlocked;
		const unlockedPL = () => player.pl.unlocked;
		for (const key in obj) {
			if (obj[key].requirement) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " chaos";
				obj[key].done = done.bind(null, obj[key].requirement);
				delete obj[key].requirement;
			};
			if (+key >= 33) obj[key].unlocked = unlockedPL;
			else if (+key >= 11) obj[key].unlocked = unlockedMO;
		};
		return obj;
	})(),
	challenges: {
		11: {
			name() { return '<h3' + getColorClass(this, TITLE) + 'Tide of Evil' },
			challengeDescription: "- Forces a chaos reset<br>- Disables good influence<br>- Multiplies demon soul gain by 1e3200<br>- Multiplies evil influence gain by 1.1",
			goalLayers: [17, 18, 60, 70, 80, 100, 120, 140, 64175, 64500, 64888, 65250, 70750, 71250, 71750, 94250, 95250, 96750, 98000, 99500],
			goal() { return this.goalLayers[challengeCompletions(this.layer, this.id)] || Infinity },
			goalDescription() {
				const c = tmp.ch.challenges[this.id];
				return formatWhole(c.goal) + " evil influence<br>Completions: " + formatWhole(challengeCompletions(this.layer, this.id)) + "/" + formatWhole(c.completionLimit) + (c.completionLimit >= this.limitLimit ? " (maxed)" : "");
			},
			canComplete() { return player.ei.points.gte(tmp.ch.challenges[this.id].goal) && challengeCompletions(this.layer, this.id) < tmp.ch.challenges[this.id].completionLimit},
			completionLimit() { return (hasUpgrade("pl", 82) ? this.limitLimit : player.ch.points.div(2).floor().max(1).min(this.limitLimit).toNumber()) },
			limitLimit: 20,
			onEnter() { player.gi.unlocked = false },
			onExit() { player.gi.unlocked = true },
			rewardDescription: "exponentiates point gain and demon soul gain multiplier based on completions",
			rewardEffect() { return challengeCompletions(this.layer, this.id) / 100 + 1 },
			rewardDisplay(eff) {
				let text = '^' + format(eff);
				if (options.nerdMode) text += '<br>formula: x/100+1';
				return text;
			},
			doReset: true,
		},
		12: {
			name() { return '<h3' + getColorClass(this, TITLE) + 'Tide of Good' },
			challengeDescription: "- Forces a chaos reset<br>- Disables evil influence<br>",
			goal() {
				const completions = challengeCompletions(this.layer, this.id);
				if (completions < 3) return completions * 25 + 85;
				if (completions < 14) return completions * 50 + 600;
				if (completions < 27) return completions * 400 + 400;
				if (completions < 32) return completions * 500;
				return Infinity;
			},
			goalDescription() {
				const c = tmp.ch.challenges[this.id];
				return formatWhole(c.goal) + " good influence<br>Completions: " + formatWhole(challengeCompletions(this.layer, this.id)) + "/" + formatWhole(c.completionLimit) + (c.completionLimit >= this.limitLimit ? " (maxed)" : "") + "<br>";
			},
			canComplete() { return player.gi.points.gte(tmp.ch.challenges[this.id].goal) && challengeCompletions(this.layer, this.id) < tmp.ch.challenges[this.id].completionLimit},
			completionLimit() { return (hasUpgrade("pl", 82) ? this.limitLimit : player.ch.points.div(2).floor().max(1).min(this.limitLimit).toNumber()) },
			limitLimit: 32,
			onEnter() { player.ei.unlocked = false },
			onExit() { player.ei.unlocked = true },
			rewardDescription: "exponentiates point gain and prayer gain multiplier based on completions",
			rewardEffect() {
				if (hasMilestone("ch", 13)) return (challengeCompletions(this.layer, this.id) + 1) ** 0.2;
				return (challengeCompletions(this.layer, this.id) * 6.32 + 1) ** 0.005;
			},
			rewardDisplay(eff) {
				let text = '^' + format(eff);
				if (options.nerdMode) {
					if (hasMilestone("ch", 13)) text += '<br>formula: (x+1)^0.2';
					else text += '<br>formula: (6.32x+1)^0.005';
				};
				return text;
			},
			doReset: true,
			unlocked() { return hasMilestone("ch", 2) },
		},
		21: {
			name() { return '<h3' + getColorClass(this, TITLE) + 'Tide of Science' },
			challengeDescription() { return "- Applies all previous <b" + getColorClass(this, REF) + "Tides</b> at once<br>" },
			goal() {
				const completions = challengeCompletions(this.layer, this.id);
				let goal = new Decimal("1e500").pow(completions ** (completions >= 6 ? 1.353 : 1.1)).mul("1e2000");
				if (hasMilestone("ch", 40)) goal = goal.div(1e100);
				return goal;
			},
			goalDescription() {
				const c = tmp.ch.challenges[this.id];
				const completions = challengeCompletions(this.layer, this.id);
				return formatWhole(completions >= c.completionLimit ? Infinity : c.goal) + " molecules<br>Completions: " + formatWhole(completions) + "/" + formatWhole(c.completionLimit) + (c.completionLimit >= c.limitLimit ? " (maxed)" : "") + "<br>";
			},
			canComplete() { return player.m.points.gte(tmp.ch.challenges[this.id].goal) && challengeCompletions(this.layer, this.id) < tmp.ch.challenges[this.id].completionLimit},
			completionLimit() { return (hasUpgrade("pl", 82) ? tmp.ch.challenges[this.id].limitLimit : player.ch.points.div(2).floor().max(1).min(tmp.ch.challenges[this.id].limitLimit).toNumber()) },
			limitLimit() { return hasMilestone("ch", 47) ? 8 : 6 },
			onEnter() { player.gi.unlocked = false; player.ei.unlocked = false },
			onExit() { player.gi.unlocked = true; player.ei.unlocked = true },
			rewardDescription: "multiplies cellular life gain and protein gain based on completions",
			rewardEffect() { return [new Decimal(1.2).pow(challengeCompletions(this.layer, this.id)), new Decimal(1e10).pow(challengeCompletions(this.layer, this.id) ** 2)] },
			rewardDisplay(eff) {
				let text = format(eff[0]) + "x<br>and " + format(eff[1]) + "x";
				if (options.nerdMode) text += '<br>formulas: 1.2^x<br>and 1e10^(x^2)';
				return text;
			},
			doReset: true,
			countsAs: [11, 12],
			unlocked() { return hasMilestone("ch", 2) && isAssimilated(this.layer) },
		},
	},
	infoboxes: getChaosInfoBoxes(),
});

addLayer("mo", {
	name: "Multicellular Organism",
	pluralName: "Multicellular Organisms",
	symbol: "MO",
	row: 6,
	position: 1,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		assimilating: null,
		assimilated: [],
		hadLayers: [],
		auto_buyable_11: false,
	}},
	color: "#88CC44",
	branches: ["pl"],
	requires: 10000,
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "multicellular organisms",
	baseResource: "cellular life",
	baseAmount() { return player.cl.points },
	type: "static",
	base() {
		if (hasMilestone("ch", 42)) return 1.055;
		if (hasMilestone("ch", 33)) return 1.0575;
		if (hasMilestone("ch", 29)) return 1.063;
		if (hasMilestone("ch", 15)) return 1.067;
		if (hasMilestone("ch", 14)) return 1.1;
		return 1.2;
	},
	exponent: 1,
	canBuyMax() { return hasMilestone("ch", 21) || hasUpgrade("pl", 84) },
	gainExp() {
		let gain = newDecimalOne();
		if (hasBuyable("w", 23)) gain = gain.mul(buyableEffect("w", 23));
		if (hasMilestone("r", 3)) gain = gain.mul(milestoneEffect("r", 3));
		if (hasMilestone("r", 6)) gain = gain.mul(milestoneEffect("r", 6));
		if (hasMilestone("r", 8)) gain = gain.mul(milestoneEffect("r", 8));
		if (hasMilestone("ch", 16)) gain = gain.mul(milestoneEffect("ch", 16));
		if (hasBuyable("mo", 22)) gain = gain.mul(buyableEffect("mo", 22));
		return gain;
	},
	autoPrestige() { return hasUpgrade("pl", 84) },
	hotkeys: [{key: "o", description: "O: Reset for multicellular organisms", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return player.ch.unlocked || player.mo.unlocked },
	automate() {
		updateBuyableTemp(this.layer);
		if (hasMilestone("pl", 2) && player.mo.auto_buyable_11) buyBuyable("mo", 11);
	},
	effect() {
		if (isAssimilated(this.layer)) {
			let exp = 0.15;
			if (hasMilestone("mo", 0)) exp = 0.1666;
			return player.mo.points.add(1).pow(exp);
		};
		return newDecimalOne();
	},
	effectDescription() {
		if (isAssimilated(this.layer)) return 'which multiplies cellular life gain by <h2 class="layer-mo">' + format(tmp.mo.effect) + '</h2>x';
	},
	doReset(resettingLayer) {
		let keep = ["clickables", 'assimilating', 'assimilated', 'hadLayers', "auto_buyable_11"];
		keep = keep.concat(getKeepFromPlanets(resettingLayer));
		if (layers[resettingLayer].row > this.row) layerDataReset("mo", keep);
	},
	resetsNothing() { return true },
	tabFormat: {
		Assimilation: {
			content: getTab("mo"),
		},
		Rewards: {
			content: getTab("mo", "Rewards"),
		},
		Synergism: {
			content: getUnlockableTab("mo", "Synergism"),
			unlocked() { return isAssimilated("a") || player.mo.assimilating === "a" },
		},
		Attunement: {
			content: getUnlockableTab("mo", "Attunement"),
			unlocked() { return isAssimilated("mo") },
		},
	},
	clickables: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Assimilation' },
			display() {
				const c = tmp.mo.clickables[11];
				let text = '<br>';
				if (player.mo.assimilating !== null) {
					text += 'Currently Assimilating: ' + (tmp[player.mo.assimilating].pluralName || tmp[player.mo.assimilating].name) + '.<br><br>Click to exit the run.';
				} else if (getClickableState("mo", 11)) {
					text += 'You are in an Assimilation search.<br><br>';
					if (player.mo.assimilated.length == 16) text += 'Click the node of the layer you wish to attempt to Assimilate.'.replace(/[A-Za-z]+(?![A-Za-z0-9])/g, substr => randomStr(substr.length));
					else text += 'Click the node of the layer you wish to attempt to Assimilate.';
					text += '<br><br>Click here to exit the search.';
				} else {
					text += 'Begin an Assimilation search.<br><br>Req: ' + formatWhole(c.req) + ' multicellular organisms';
				};
				text += '<br><br>Assimilated layers: ' + formatWhole(player.mo.assimilated.length) + '/' + formatWhole(c.limit);
				return text;
			},
			req() { return [1, 2, 3, 4, 7, 12, 16, 21, 30, 57, 77, 101, 125, 151, 181, 275, 500][player.mo.assimilated.length] || Infinity },
			limit() {
				let max = 15;
				if (hasMilestone("ch", 33)) max++;
				if (hasMilestone("ch", 38)) max++;
				return max;
			},
			canClick() { return (getClickableState("mo", 11) ? true : player.mo.points.gte(tmp.mo.clickables[11].req)) && player.mo.assimilated.length < tmp.mo.clickables[11].limit },
			onClick() {
				if (player.mo.assimilating !== null) {
					if (!confirm('Are you sure you want to exit this Assimilation run? This will reset all Assimilated layers content, all ' + tmp[player.mo.assimilating].name + ' content, and put you back into a normal run.')) return;
					setClickableState("mo", 11, false);
					player.points = newDecimalZero();
					for (let index = 0; index < player.mo.assimilated.length; index++) {
						tmp[player.mo.assimilated[index]].doReset("mo");
					};
					tmp[player.mo.assimilating].doReset("mo");
					player.mo.assimilating = null;
					unlockLayers();
				} else if (getClickableState("mo", 11)) {
					setClickableState("mo", 11, false);
					unlockLayers();
				} else {
					setClickableState("mo", 11, true);
					lockLayers();
				};
			},
			style() {
				let obj = {width: '200px', height: '200px'};
				if (player.mo.assimilated.length >= tmp.mo.clickables[11].limit) {
					obj["background-color"] = "#77bf5f";
					obj.cursor = "default";
				};
				return obj;
			},
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Break the Cycle' },
			display: '<br>Unlock the final layer...<br><br>Req: 245 multicellular organisms',
			canClick() { return player.mo.points.gte(245) && !getClickableState("mo", 21) },
			onClick() { setClickableState("mo", 21, true) },
			style() {
				let obj = {width: '200px', height: '100px'};
				if (getClickableState("mo", 21)) {
					obj["background-color"] = "#77bf5f";
					obj.cursor = "default";
				};
				return obj;
			},
			unlocked() { return player.mo.assimilated.length >= 15 },
		},
	},
	buyables: {
		11: {
			cost(x) { return x.div(2).add(1).mul(18) },
			effect(x) { return new Decimal(1000).pow(x) },
			title() { return '<b' + getColorClass(this, TITLE, "a") + 'Atom</b> <b' + getColorClass(this, TITLE) + 'Synergy' },
			description: 'multiplies atom gain based on the amount of this upgrade bought.',
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 1000^x';
				return text;
			},
			canAfford() { return player.mo.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this) },
			unlocked() { return isAssimilated("a") || player.mo.assimilating === "a" },
		},
		12: {
			cost(x) { return x.add(1).pow(2).add(50) },
			effect(x) { return new Decimal(2).pow(x) },
			title() { return '<b' + getColorClass(this, TITLE, "s") + 'Sanctum</b> <b' + getColorClass(this, TITLE) + 'Synergy' },
			description: 'multiplies sanctum gain based on the amount of this upgrade bought.',
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 2^x';
				return text;
			},
			canAfford() { return player.mo.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this) },
			unlocked() { return isAssimilated("s") || player.mo.assimilating === "s" },
		},
		13: {
			cost(x) { return x.add(1).pow(3).add(106) },
			effect(x) {
				let eff = new Decimal(1.1).pow(x);
				if (eff.gte(softcaps.mo_buyable_13[0])) eff = eff.sub(softcaps.mo_buyable_13[0]).div(softcaps.mo_buyable_13[1]()).add(softcaps.mo_buyable_13[0]);
				return eff;
			},
			title() { return '<b' + getColorClass(this, TITLE, "gi") + 'Good Influence</b> <b' + getColorClass(this, TITLE) + 'Synergy' },
			description: 'multiplies good influence gain based on the amount of this upgrade bought.',
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (eff.gte(softcaps.mo_buyable_13[0])) text += ' (softcapped)';
				if (options.nerdMode) text += '<br>formula: 1.1^x';
				return text;
			},
			canAfford() { return player.mo.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this) },
			unlocked() { return isAssimilated("gi") || player.mo.assimilating === "gi" },
		},
		21: {
			cost(x) { return new Decimal(hasMilestone("mo", 2) ? 1.3 : 1.5).pow(x).mul(300) },
			effect(x) { return new Decimal(1.03).pow(x) },
			title() { return '<b' + getColorClass(this, TITLE, "ch", true) + 'Chaos</b> <b' + getColorClass(this, TITLE) + 'Synergy' },
			description: 'multiplies chaos gain based on the amount of this upgrade bought.',
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 1.03^x';
				return text;
			},
			canAfford() { return player.mo.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this) },
			unlocked() { return isAssimilated("ch") },
		},
		22: {
			cost(x) { return new Decimal(hasMilestone("mo", 2) ? 1.2 : 1.5).pow(x).mul(600) },
			effect(x) { return new Decimal(1.03).pow(x) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Multicellular Organism Synergy' },
			description: 'multiplies multicellular organism gain based on the amount of this upgrade bought.',
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 1.03^x';
				return text;
			},
			canAfford() { return player.mo.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this) },
			unlocked() { return isAssimilated("mo") },
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 666,
				effectDescription() { return "increase the " + getGlitchAttuneText() + " effect exponent (0.15 --> 0.1666)" },
			},
			1: {
				requirement: 800,
				effectDescription() { return "increase the cap of <b" + getColorClass(this, TITLE, "w") + "Race for Knowledge</b> by 50" },
			},
			2: {
				requirement: 999,
				effectDescription() { return "reduce the cost scaling of <b" + getColorClass(this, TITLE, "ch", true) + "Chaos</b> <b" + getColorClass(this, TITLE) + "Synergy</b> and <b" + getColorClass(this, TITLE) + getGlitchAttuneText() + " Synergy</b>" },
			},
			3: {
				requirement: 1360,
				effectDescription() { return "exponentiate light gain after hardcap by ^1.2" },
			},
		};
		const done = req => player.mo.points.gte(req);
		const unlocked = () => isAssimilated("mo");
		for (const key in obj) {
			if (obj[key].requirement) {
				obj[key].requirementDescription = "Tier " + ((+key) + 1) + ": [" + formatWhole(obj[key].requirement) + "]";
				obj[key].done = done.bind(null, obj[key].requirement);
				delete obj[key].requirement;
			};
			obj[key].popupTitle = "Attuning...";
			obj[key].unlocked = unlocked;
		};
		return obj;
	})(),
});

addLayer("pl", {
	name: "Planet",
	pluralName: "Planets",
	symbol: "<img src='images/planet.png' alt='PLANETS' width='200px' height='200px'>",
	row: 7,
	position: 0,
	alias: {
		symbol: "<img src='images/planet.png' alt='PL' width='60px' height='60px'>",
		row: 'side',
		position: 2,
		nodeStyle: {'border-width': 0},
	},
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		air: newDecimalZero(),
	}},
	color: "#3C51AF",
	nodeStyle: {width: '200px', height: '200px', 'border-width': 0},
	chaosEffect() { return player.ch.points.add(1) },
	requires() { return new Decimal(25_000).div(tmp.pl.chaosEffect) },
	marked() { return isAssimilated(this.layer) },
	shouldNotify() { return isAssimilated(this.layer) && getClickableState("mo", 11) && player.mo.assimilating === null },
	glowColor() { if (this.shouldNotify()) return this.color },
	resource: "planets",
	baseResource: "multicellular organisms",
	baseAmount() { return player.mo.points },
	type: "static",
	base: 2,
	exponent: 1.46,
	canBuyMax: false,
	gainExp() {
		let gain = newDecimalOne();
		return gain;
	},
	hotkeys: [{key: "P", description: "Shift-P: Reset for planets", onPress() { if (canReset(this.layer)) doReset(this.layer) }}],
	layerShown() { return getClickableState("mo", 21) || player.pl.unlocked },
	effect() {
		let eff = player.pl.points.div(10);
		for (const id of [13, 21, 23, 31, 33, 41, 43, 51, 53, 61, 63, 71, 73, 81, 83, 91, 93]) {
			if (hasUpgrade("pl", id)) eff = eff.mul(upgradeEffect("pl", id));
		};
		if (hasBuyable("pl", 12)) eff = eff.mul(buyableEffect("pl", 12));
		if (hasBuyable("pl", 13)) eff = eff.mul(buyableEffect("pl", 13));
		return eff;
	},
	effectDescription() { return "which generate <h2 class='layer-pl'>" + format(inChallenge("ds", 101) ? 0 : tmp.pl.effect) + "</h2> air per second" },
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("pl", keep);
	},
	update(diff) {
		if (!inChallenge("ds", 101)) {
			player.pl.air = player.pl.air.add(tmp.pl.effect.mul(diff));
		};
	},
	tabFormat: {
		Progress: {
			content: getTab("pl"),
		},
		Atmosphere: {
			content: getTab("pl", "Atmosphere"),
		},
	},
	milestones: (() => {
		let obj = {
			0: {
				requirement: 1,
				effectDescription() { return "you can autobuy relic rebuyables, keep everything unlocked on war resets, change the chaos cost formula (removing hardcap), you can buy max chaos, keep <b" + getColorClass(this, REF, "mo") + "Assimilation</b> on all resets, and keep all milestones on lesser resets" },
				toggles: [["r", "auto_buyables"]],
			},
			1: {
				requirement: 2,
				effectDescription() { return "you can bulk 10x relic activation, gain +10% of your molecule gain per second, you can bulk 10x good influence rebuyables if you have the <b" + getColorClass(this, REF, "ch", true) + "78 chaos milestone</b>, keep all challenges on lesser resets, and unlock air rebuyables" },
			},
			2: {
				requirement: 3,
				effectDescription() { return "you can bulk 10x cellular life rebuyables, you can autobuy <b" + getColorClass(this, TITLE, "a") + "Atom</b> <b" + getColorClass(this, TITLE, "mo") + "Synergy</b>, keep all upgrades on lesser resets, and unlock another air rebuyable" },
				toggles: [["mo", "auto_buyable_11"]],
			},
		};
		const done = req => player.pl.points.gte(req);
		for (const key in obj) {
			if (obj[key].requirement) {
				obj[key].requirementDescription = simpleFormatWhole(obj[key].requirement) + " planet" + (obj[key].requirement === 1 ? "" : "s");
				obj[key].done = done.bind(null, obj[key].requirement);
				delete obj[key].requirement;
			};
		};
		return obj;
	})(),
	buyables: {
		11: {
			cost(x) { return new Decimal(1e10).pow(x.add(1)) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Innate Good' },
			description: 'multiplies good influence gain based the amount of this upgrade bought.',
			canAfford() { return player.pl.air.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this, "pl", "air") },
			effect(x) { return x.div(10).add(1).pow(0.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x/10+1)^0.5';
				return text;
			},
			currencyDisplayName: 'air',
			unlocked() { return hasMilestone("pl", 1) },
		},
		12: {
			cost(x) { return new Decimal(1.5).pow(x).mul(100) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Photosynthesis' },
			description: 'multiplies air gain based your light and the amount of this upgrade bought.',
			canAfford() { return player.mo.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { buyStandardBuyable(this, "mo") },
			effect(x) { return player.r.light.add(1).log10().add(1).pow(x) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^y';
				return text;
			},
			currencyDisplayName: 'multicellular organisms',
			unlocked() { return hasMilestone("pl", 1) },
		},
		13: {
			cost(x) { return new Decimal(1.1).pow(x).mul(200) },
			title() { return '<b' + getColorClass(this, TITLE) + 'Chaotic Composition' },
			description: 'multiplies air gain based your atoms and the amount of this upgrade bought.',
			canAfford() { return player.ch.points.gte(this.cost()) },
			purchaseLimit: 99,
			buy() { addBuyables(this.layer, this.id, 1) },
			effect(x) { return player.a.points.add(1).log10().add(1).pow(x) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^y';
				return text;
			},
			costDisplay(cost) { return 'Req: ' + formatWhole(cost) + ' chaos' },
			unlocked() { return hasMilestone("pl", 2) },
		},
	},
	upgrades: {
		11: {
			title() { return '<b' + getColorClass(this, TITLE) + 'The Point of Air</b>' },
			description: 'multiplies point gain based on your air',
			effect() { return player.pl.air.add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^2';
				return text;
			},
			cost: 1,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		12: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Airy Essence</b>' },
			description: 'gains 10% of your essence gain per second',
			cost: 5,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		13: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Essence of Air</b>' },
			description: 'multiplies air gain based on your essence',
			effect() { return player.e.points.add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 10,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		14: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Airy Cores</b>' },
			description: 'gains 10% of your core gain per second',
			cost: 20,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		21: {
			title() { return '<b' + getColorClass(this, TITLE) + 'The Core of Air</b>' },
			description: 'multiplies air gain based on your cores',
			effect() { return player.c.points.add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 40,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		22: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Airy Quarks</b>' },
			description: 'gains 10% of your quark gain per second',
			cost: 200,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		23: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Quirky Air</b>' },
			description: 'multiplies air gain based on your quarks',
			effect() { return player.q.points.add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 800,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		24: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Airy Particles</b>' },
			description: 'makes subatomic particles reset nothing and perform subatomic particle resets automatically',
			cost: 2_500,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		31: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Particles of Air</b>' },
			description: 'multiplies air gain based on your subatomic particles',
			effect() { return player.sp.points.add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 10_000,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		32: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Airy Hexes</b>' },
			description: 'gains 10% of your hex gain per second',
			cost: 40_000,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		33: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Hexed Air</b>' },
			description: 'multiplies air gain based on your hexes',
			effect() { return player.h.points.add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 100_000,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		34: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Airy Souls</b>' },
			description: 'gains 10% of your demon soul gain per second',
			cost: 800_000,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		41: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Demonic Air</b>' },
			description: 'multiplies air gain based on your demon souls',
			effect() { return player.ds.points.add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 2_000_000,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		42: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Airy Atoms</b>' },
			description: 'makes atoms reset nothing and perform atom resets automatically',
			cost: 8_000_000,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		43: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Atomic Air</b>' },
			description: 'multiplies air gain based on your atoms',
			effect() { return player.a.points.add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 20_000_000,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		44: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Pray to the Sky</b>' },
			description: 'multiplies prayer gain based on your air',
			effect() { return player.pl.air.add(1).pow(10) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^10';
				return text;
			},
			cost: 50_000_000,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		51: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Holy Air</b>' },
			description: 'multiplies air gain based on your holiness',
			effect() { return player.p.holiness.add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 200_000_000,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		52: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Sanctum of the Sky</b>' },
			description: 'multiplies sanctum gain based on your air',
			effect() { return player.pl.air.add(1).log10().add(1).pow(0.1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log(x+1)+1)^0.1';
				return text;
			},
			cost: 2e9,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		53: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Sanctums of Air</b>' },
			description: 'multiplies air gain based on your sanctums',
			effect() { return player.s.points.add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 5e9,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		54: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Bright Sky</b>' },
			description: 'multiplies light gain after hardcap based on your air',
			effect() { return player.pl.air.add(1).pow(0.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.5';
				return text;
			},
			cost: 4e10,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		61: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Relics of Air</b>' },
			description: 'multiplies air gain based on your relics',
			effect() { return player.r.points.add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 1e11,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		62: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Molecules of Air</b>' },
			description: 'multiplies molecule gain based on your air',
			effect() { return player.pl.air.add(1).pow(0.1) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.1';
				return text;
			},
			cost: 5e11,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		63: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Varied Atmosphere</b>' },
			description: 'multiplies air gain based on your total unique molecules',
			effect() { return tmp.m.uniqueNonExtra.add(tmp.m.uniqueExtra).add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(x+1)+1)^2';
				return text;
			},
			cost: 2e12,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		64: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Airy Influence</b>' },
			description: 'makes good/evil influence reset nothing and perform good/evil influence resets automatically',
			cost: 8e12,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		71: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Dual Air</b>' },
			description: 'multiplies air gain based on your good/evil influence',
			effect() { return player.gi.points.mul(player.ei.points).add(1).slog().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (superlog(xy+1)+1)^2';
				return text;
			},
			cost: 2e13,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		72: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Airy Wars</b>' },
			description: 'makes wars reset nothing and perform war resets automatically',
			cost: 8e13,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		73: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Wars of Air</b>' },
			description: 'multiplies air gain based on your wars',
			effect() { return player.w.points.add(1).log10().add(1).pow(2) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (log10(x+1)+1)^2';
				return text;
			},
			cost: 2e14,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		74: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Airy Cells</b>' },
			description: 'makes cellular life reset nothing and perform cellular life resets automatically',
			cost: 8e14,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		81: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Achievements of Air</b>' },
			description: 'multiplies air gain based on your achievements past 90',
			effect() { return player.A.points.sub(90).max(0).pow_base(1.25) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 1.25^(x-90)';
				return text;
			},
			cost: 4e15,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		82: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Tides of Air</b>' },
			description() { return 'makes the completion limits of <b' + getColorClass(this, REF, "ch", true) + 'The Tides</b> always maxed' },
			cost: 4e16,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		83: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Chaotic Air</b>' },
			description: 'multiplies air gain based on your chaos',
			effect() { return player.ch.points.add(1).pow(hasMilestone("ch", 43) ? 1.25 : 0.5) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^' + (hasMilestone("ch", 43) ? '1.25' : '0.5');
				return text;
			},
			cost: 1e17,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		84: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Breathing</b>' },
			description: 'makes it so you can always buy max multicellular organisms and perform multicellular organism resets automatically',
			cost: 4e17,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		91: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Complex Air</b>' },
			description: 'multiplies air gain based on your multicellular organisms',
			effect() { return player.mo.points.add(1).pow(0.4) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: (x+1)^0.4';
				return text;
			},
			cost: 2e18,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		92: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Flowing Tides</b>' },
			description() {
				if (isAssimilated("ch")) return 'makes you be able to gain completions of <b' + getColorClass(this, REF, "ch", true) + randomStr(3) + ' ' + randomStr(5) + '</b> without exiting them';
				return 'makes you be able to gain completions of <b' + getColorClass(this, REF, "ch", true) + 'The Tides</b> without exiting them';
			},
			cost: 1e19,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		93: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Milestones of Air</b>' },
			description: 'multiplies air gain based on your chaos milestones past 20',
			effect() { return new Decimal(1.2).pow(Math.max(player.ch.milestones.length - 20, 0)) },
			effectDisplay(eff) {
				let text = format(eff) + 'x';
				if (options.nerdMode) text += '<br>formula: 1.2^(x-20)';
				return text;
			},
			cost: 4e19,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
		94: {
			title() { return '<b' + getColorClass(this, TITLE) + 'Planetary Chaos</b>' },
			description() { return "improves the formula of chaos's second effect if you have the <b" + getColorClass(this, REF, "ch", true) + "42 chaos milestone</b>" },
			cost: 2e20,
			currencyInternalName: "air",
			currencyLayer: "pl",
		},
	},
});
