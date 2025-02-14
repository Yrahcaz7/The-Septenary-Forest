addLayer('N', {
	name: 'notes',
	symbol: 'N',
	row: 'side',
	position: 0,
	startData() { return {
		unlocked: true,
		points: newDecimalZero(),
		record: newDecimalZero(),
	}},
	color: '#c0c0c0',
	resource: 'notes',
	type: 'none',
	layerShown() { return true },
	tabFormat: [
		['display-text', () => 'You have <h2 class="layer-N">' + formatWhole(player.N.points) + '</h2> notes'],
		'blank',
		['display-text', () => {
			let text = '<h3>Note #1 - Roman Numeral Transcription</h3><br><br>';
			text += 'N ----- 0<br>';
			text += 'I ----- 1<br>';
			text += 'V ----- 5<br>';
			text += 'X ----- 10<br>';
			text += 'L ----- 50<br>';
			text += 'C ----- 100<br>';
			text += 'D ----- 500<br>';
			text += '&#8576; ----- 1,000<br>';
			if (player.N.points.gte(2)) {
				text += '<br><h3>Note #2 - Greek Numeral Transcription</h3><br><br>';
				text += '𐆊 ----- 0<br>';
				text += 'αʹ ----- 1<br>';
				text += 'βʹ ----- 2<br>';
				text += 'γʹ ----- 3<br>';
				text += 'δʹ ----- 4<br>';
				text += 'εʹ ----- 5<br>';
				text += 'ϛʹ ----- 6<br>';
				text += 'ζʹ ----- 7<br>';
				text += 'ηʹ ----- 8<br>';
				text += 'θʹ ----- 9<br>';
				text += 'ιʹ ----- 10<br>';
				text += 'κʹ ----- 20<br>';
				text += 'λʹ ----- 30<br>';
				text += 'μʹ ----- 40<br>';
				text += 'νʹ ----- 50<br>';
				text += 'ξʹ ----- 60<br>';
				text += 'οʹ ----- 70<br>';
				text += 'πʹ ----- 80<br>';
				text += 'ϙʹ ----- 90<br>';
				text += 'ρʹ ----- 100<br>';
				text += 'σʹ ----- 200<br>';
				text += 'τʹ ----- 300<br>';
				text += 'υʹ ----- 400<br>';
				text += 'φʹ ----- 500<br>';
				text += 'χʹ ----- 600<br>';
				text += 'ψʹ ----- 700<br>';
				text += 'ωʹ ----- 800<br>';
				text += 'ϡʹ ----- 900<br>';
				text += '͵α ----- 1,000<br>';
				text += '͵β ----- 2,000<br>';
				text += '͵γ ----- 3,000<br>';
				text += '͵δ ----- 4,000<br>';
				text += '͵ε ----- 5,000<br>';
				text += '͵ϛ ----- 6,000<br>';
				text += '͵ζ ----- 7,000<br>';
				text += '͵η ----- 8,000<br>';
				text += '͵θ ----- 9,000<br>';
			};
			return text;
		}],
		'blank',
	],
	update(diff) {
		let amount = newDecimalOne();
		if (player.gn.unlocked) amount = amount.add(1);
		player.N.points = amount.round();
		if (player.N.points.gt(player.N.record)) {
			let title = 'title not found';
			player.N.record = player.N.record.add(1).round();
			if (player.N.points.eq(1)) title = 'Roman Numeral Transcription';
			else if (player.N.points.eq(2)) title = 'Greek Numeral Transcription';
			doPopup('none', title, 'New note found!', 3, '#cccccc');
		};
	},
});

addLayer('rn', {
	name: 'roman numerals',
	symbol: 'RN',
	row: 0,
	position: 0,
	branches: ['d', 'gn'],
	tooltip() { return romanNumeralFormat(player.rn.points) + ' roman numerals' },
	startData() { return {
		unlocked: true,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		calc: true,
		upCalc: false,
		overCalc: false,
	}},
	color: '#c06000',
	resource: 'roman numerals',
	baseResource: 'arabic numerals',
	baseAmount() { return player.points },
	requires: new Decimal(5),
	type: 'normal',
	exponent: 0.5,
	gainMult() {
		if (inChallenge('i', 12)) return newDecimalZero();
		let gain = newDecimalOne();
		if (hasUpgrade('rn', 12)) gain = gain.mul(upgradeEffect('rn', 12));
		if (hasUpgrade('rn', 22)) gain = gain.mul(upgradeEffect('rn', 22));
		if (hasUpgrade('rn', 32)) gain = gain.mul(upgradeEffect('rn', 32));
		if (hasUpgrade('d', 22)) gain = gain.mul(2);
		if (hasUpgrade('d', 33)) gain = gain.mul(2);
		if (hasUpgrade('d', 44)) gain = gain.mul(2);
		if (hasUpgrade('d', 55)) gain = gain.mul(2);
		if (hasUpgrade('d', 65)) gain = gain.mul(2);
		if (hasUpgrade('d', 75)) gain = gain.mul(2);
		if (hasUpgrade('d', 85)) gain = gain.mul(2);
		if (hasUpgrade('d', 95)) gain = gain.mul(2);
		if (hasChallenge('i', 12)) gain = gain.mul(challengeEffect('i', 12));
		if (hasMilestone('i', 15)) gain = gain.mul(tmp.i.effect);
		return gain;
	},
	softcap: new Decimal("1e1000"),
	softcapPower() {
		if (hasUpgrade('d', 22)) {
			if (hasUpgrade('d', 33)) {
				if (hasUpgrade('d', 44)) {
					if (hasUpgrade('d', 55)) {
						if (hasUpgrade('d', 65)) {
							if (hasUpgrade('d', 75)) {
								if (hasUpgrade('d', 85)) {
									if (hasUpgrade('d', 95)) return 0.888;
									return 0.88;
								};
								return 0.875;
							};
							return 0.85;
						};
						return 0.825;
					};
					return 0.8;
				};
				return 0.75;
			};
			return 0.5;
		};
		return 0.2;
	},
	prestigeButtonText() {
		let resetGain = new Decimal(tmp.rn.resetGain), text = '';
		if (player.rn.points.lt(1e3)) text = 'Reset for ';
		text += '+<b>' + romanNumeralFormat(resetGain) + '</b> roman numerals';
		if (resetGain.lt(100) && player.rn.points.lt(1e3)) text += '<br><br>Next at ' + format(tmp.rn.nextAt) + ' arabic numerals';
		return text;
	},
	resetsNothing() { return hasMilestone('d', 5) },
	passiveGeneration() { if (hasMilestone('d', 6)) return 10 },
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		if ((hasMilestone('gn', 1) && resettingLayer == 'gn') || (hasMilestone('i', 17) && resettingLayer == 'i')) keep.push('upgrades');
		if ((hasMilestone('gn', 2) && resettingLayer == 'gn') || (hasMilestone('i', 19) && resettingLayer == 'i')) keep.push('calc', 'upCalc', 'overCalc');
		layerDataReset('rn', keep);
	},
	hotkeys: [{
		key: 'r', // Use uppercase if it's combined with shift, or 'ctrl+x' for holding down ctrl.
		description: 'R: reset for roman numerals',
		onPress() { if (player.rn.unlocked) doReset('rn') },
	}],
	layerShown() { return true },
	tabFormat: [
		['display-text', () => {
			if (player.rn.points.gte('1e1000')) return '<h2 class="layer-rn">' + romanNumeralFormat(player.rn.points) + '</h2> roman numerals';
			return 'You have <h2 class="layer-rn">' + romanNumeralFormat(player.rn.points) + '</h2> roman numerals';
		},
		],
		'blank',
		'prestige-button',
		['custom-resource-display', () => {
			let text = 'You have ' + format(player.points) + ' arabic numerals<br>';
			if (tmp.rn.passiveGeneration) text += 'You are gaining ' + romanNumeralFormat(tmp.rn.resetGain.mul(tmp.rn.passiveGeneration)) + ' roman numerals per second<br>';
			text += '<br>Your best roman numerals is ' + romanNumeralFormat(player.rn.best) + '<br>';
			text += 'You have made a total of ' + romanNumeralFormat(player.rn.total) + ' roman numerals';
			return text;
		}],
		'blank',
		'upgrades',
		'clickables',
		'blank',
	],
	upgrades: {
		11: {
			fullDisplay() {
				let text = `<h3>Countings</h3><br>
					multiply arabic numeral gain based on the amount of roman numerals you have<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.rn.points.add(1).pow(0.25) },
			cost: new Decimal(4),
		},
		12: {
			fullDisplay() {
				let text = `<h3>Practice...</h3><br>
					multiply roman numeral gain based on the amount of total roman numerals you have<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.rn.total.add(1).pow(0.2) },
			cost: new Decimal(10),
		},
		13: {
			fullDisplay() {
				let text = `<h3>Again</h3><br>
					multiply arabic numeral gain by ` + format(this.effect()) + ` when you have less than ` + format(this.cap()) + ` arabic numerals<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() {
				let eff = new Decimal(10);
				if (hasUpgrade('rn', 43)) eff = eff.mul(upgradeEffect('rn', 43));
				return eff;
			},
			cap() {
				cap = new Decimal(10);
				if (hasUpgrade('rn', 23)) cap = cap.mul(upgradeEffect('rn', 23));
				if (hasUpgrade('rn', 42)) cap = cap.mul(upgradeEffect('rn', 42));
				return cap;
			},
			cost: new Decimal(30),
		},
		14: {
			fullDisplay() {
				let text = `<h3>Faster</h3><br>
					multiply arabic numeral gain by ` + format(this.effect()) + ` when you have less than ` + format(this.cap()) + ` arabic numerals<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() {
				let eff = new Decimal(2);
				if (hasUpgrade('rn', 24)) eff = eff.mul(upgradeEffect('rn', 24));
				if (hasUpgrade('rn', 43)) eff = eff.mul(upgradeEffect('rn', 43));
				return eff;
			},
			cap() {
				cap = new Decimal(50);
				if (hasUpgrade('rn', 24)) cap = cap.mul(upgradeEffect('rn', 24));
				if (hasUpgrade('rn', 34)) cap = cap.mul(upgradeEffect('rn', 34));
				if (hasUpgrade('rn', 42)) cap = cap.mul(upgradeEffect('rn', 42));
				return cap;
			},
			cost: new Decimal(100),
		},
		15: {
			fullDisplay() {
				let text = `<h3>Repetitive</h3><br>
					multiply arabic numeral gain based on the amount of arabic numerals you have<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.points.add(1).pow(0.1) },
			cost: new Decimal(350),
		},
		21: {
			fullDisplay() {
				let text = `<h3>Calculator</h3><br>
					shows the arabic numeral equivalent to all roman numerals alongside the normal values<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				return text;
			},
			cost: new Decimal(600),
			unlocked() { return player.rn.upgrades.length >= 5 },
		},
		22: {
			fullDisplay() {
				let text = `<h3>Makes Perfect</h3><br>
					multiply roman numeral gain based on your best roman numerals<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.rn.best.mul(1000).add(1).pow(0.15) },
			cost: new Decimal(1000),
			unlocked() { return player.rn.upgrades.length >= 5 },
		},
		23: {
			fullDisplay() {
				let text = `<h3>Again, Again</h3><br>
					multiply the cap of <b>Again</b> by ` + format(this.effect()) + `<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() {
				if (hasUpgrade('rn', 33)) return new Decimal(10).mul(upgradeEffect('rn', 33));
				return 10;
			},
			cost: new Decimal(10000),
			unlocked() { return player.rn.upgrades.length >= 5 },
		},
		24: {
			fullDisplay() {
				let text = `<h3>Faster, Faster</h3><br>
					multiply the effect and cap of <b>Faster</b> by ` + format(this.effect()) + `<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return 5 },
			cost: new Decimal(30000),
			unlocked() { return player.rn.upgrades.length >= 5 },
		},
		25: {
			fullDisplay() {
				let text = `<h3>Patterns</h3><br>
					multiply arabic numeral gain based on the amount of arabic numerals you have<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.points.div(50).add(1).pow(0.5) },
			cost: new Decimal(100000),
			unlocked() { return player.rn.upgrades.length >= 5 },
		},
		31: {
			fullDisplay() {
				let text = `<h3>Priorities</h3><br>
					you can change the priority of calculator values<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				return text;
			},
			cost: new Decimal(250000),
			unlocked() { return player.rn.upgrades.length >= 10 },
		},
		32: {
			fullDisplay() {
				let text = `<h3>Studying</h3><br>
					multiply roman numeral gain based on your best roman numerals<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.rn.best.mul(20000).add(1).pow(0.075) },
			cost: new Decimal(500000),
			unlocked() { return player.rn.upgrades.length >= 10 },
		},
		33: {
			fullDisplay() {
				let text = `<h3>Cycle</h3><br>
					multiply the effect of <b>Again, Again</b> by ` + format(this.effect()) + `<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return 100 },
			cost: new Decimal(2000000),
			unlocked() { return player.rn.upgrades.length >= 10 },
		},
		34: {
			fullDisplay() {
				let text = `<h3>Fastest</h3><br>
					multiply the cap of <b>Faster</b> by ` + format(this.effect()) + `<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return 200 },
			cost: new Decimal(10000000),
			unlocked() { return player.rn.upgrades.length >= 10 },
		},
		35: {
			fullDisplay() {
				let text = `<h3>Correlation</h3><br>
					multiply arabic numeral gain based on your best roman numerals<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.rn.best.div(100).add(1).pow(0.2) },
			cost: new Decimal(25000000),
			unlocked() { return player.rn.upgrades.length >= 10 },
		},
		41: {
			fullDisplay() {
				let text = `<h3>Override</h3><br>
					you can override non-calculator values with calculator values<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				return text;
			},
			cost: new Decimal(1e50),
			unlocked() { return player.rn.upgrades.length >= 15 && hasMilestone('d', 2) },
		},
		42: {
			fullDisplay() {
				let text = `<h3>Uncapped</h3><br>
					multiply the caps of <b>Again</b> and <b>Faster</b> based on your best roman numerals<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				return text;
			},
			effect() {
				let eff = player.rn.best.mul(1e25).add(1).pow(0.9);
				if (hasUpgrade('rn', 43)) eff = eff.mul(upgradeEffect('rn', 43));
				return eff;
			},
			cost: new Decimal(1e70),
			unlocked() { return player.rn.upgrades.length >= 15 && hasMilestone('d', 3) },
		},
		43: {
			fullDisplay() {
				let text = `<h3>To the Sky</h3><br>
					multiply the effect of <b>Again</b>, <b>Faster</b>, and <b>Uncapped</b> by ` + format(this.effect()) + `<br><br>
					Cost: ` + romanNumeralFormat(this.cost) + ` roman numerals`;
				return text;
			},
			effect() { return 200 },
			cost: new Decimal(1e90),
			unlocked() { return player.rn.upgrades.length >= 15 && hasMilestone('d', 4) },
		},
	},
	clickables: {
		11: {
			display() {
				if (player.rn.calc) return '<h3>calulator<br>is on';
				return '<h3>calulator<br>is off';
			},
			canClick() { return true },
			onClick() { player.rn.calc = !player.rn.calc },
			unlocked() { return hasUpgrade('rn', 21) },
		},
		12: {
			display() {
				if (!player.rn.calc) return '<h3>turn on calculator to access';
				if (player.rn.overCalc) return '<h3>turn off override to access';
				if (player.rn.upCalc) return '<h3>currently prioritizing arabic numerals';
				return '<h3>currently prioritizing roman numerals';
			},
			canClick() { if (player.rn.calc && !player.rn.overCalc) return true },
			onClick() { player.rn.upCalc = !player.rn.upCalc },
			unlocked() { return hasUpgrade('rn', 31) },
		},
		13: {
			display() {
				if (!player.rn.calc) return '<h3>turn on calculator to access';
				if (player.rn.overCalc) return '<h3>override active';
				return '<h3>override inactive';
			},
			canClick() { if (player.rn.calc) return true },
			onClick() { player.rn.overCalc = !player.rn.overCalc },
			unlocked() { return hasUpgrade('rn', 41) },
		},
	},
});

function getNumberBase() {
	let base = 2;
	if (getBuyableAmount('d', 51).gt(0)) base = buyableEffect('d', 51).toNumber();
	return base;
};

addLayer('d', {
	name: 'digits',
	symbol: 'D',
	row: 0,
	position: 1,
	branches: ['i'],
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		max: new Decimal(99),
		number: newDecimalZero(),
		clickPower: newDecimalOne(),
		meta: '',
		limited: false,
		timer: 0,
		numberUpgradeAuto: false,
		baseUpAuto: false,
		numberButtonAuto: false,
		digitAuto: false,
		limitBreakAuto: false,
	}},
	color: '#a0a0a0',
	resource: 'digits',
	baseResource: 'arabic numerals',
	baseAmount() { return player.points },
	requires: new Decimal(1e10),
	type: 'custom',
	exponent() {
		if (hasUpgrade('d', 11)) {
			if (hasUpgrade('d', 21)) {
				if (hasUpgrade('d', 31)) {
					if (hasUpgrade('d', 41)) {
						if (hasUpgrade('d', 51)) {
							if (hasUpgrade('d', 61)) {
								if (hasUpgrade('d', 71)) {
									if (hasUpgrade('d', 81)) {
										if (hasUpgrade('d', 91)) return 1.484;
										return 1.49;
									};
									return 1.5;
								};
								return 1.55;
							};
							return 1.575;
						};
						return 1.6;
					};
					return 1.65;
				};
				return 1.7;
			};
			return 1.75;
		};
		return 1.2;
	},
	gainMult() {
		let gain = newDecimalOne();
		if (hasUpgrade('d', 42)) gain = gain.div(upgradeEffect('d', 42));
		if (hasUpgrade('d', 52)) gain = gain.div(upgradeEffect('d', 52));
		if (hasUpgrade('d', 62)) gain = gain.div(upgradeEffect('d', 62));
		if (hasUpgrade('d', 72)) gain = gain.div(upgradeEffect('d', 72));
		if (hasUpgrade('d', 73)) gain = gain.div(upgradeEffect('d', 73));
		if (hasUpgrade('d', 83)) gain = gain.div(upgradeEffect('d', 83));
		if (player.i.unlocked) gain = gain.div(player.i.unitEffect);
		return gain;
	},
	canBuyMax() { return hasMilestone('d', 16) },
	prestigeButtonText() {
		if (player.d.points.gte(player.d.max)) return '<b>MAXED';
		let text = 'Reset for +<b>' + formatWhole(tmp.d.resetGain) + '</b> ' + tmp.d.resource + '<br><br>';
		if (player.d.points.lt(1000)) {
			if (tmp.d.baseAmount.gte(tmp.d.nextAt) && tmp.d.canBuyMax) text += 'Next:';
			else text += 'Req:';
		};
		text += ' ' + formatWhole(tmp.d.baseAmount) + ' / ';
		if (tmp.d.roundUpCost) text += formatWhole(tmp.d.nextAtDisp);
		else text += format(tmp.d.nextAtDisp);
		text += ' ' + tmp.d.baseResource;
		return text;
	},
	getResetGain() {
		if (player.d.points.gte(player.d.max)) return newDecimalZero();
		if ((!tmp.d.canBuyMax) || tmp.d.baseAmount.lt(tmp.d.requires)) return newDecimalOne();
		let gain = tmp.d.baseAmount.div(tmp.d.requires).div(tmp.d.gainMult).max(1).log(tmp.d.base).mul(tmp.d.gainExp).pow(Decimal.pow(tmp.d.exponent, -1));
		gain = gain.mul(tmp.d.directMult);
		if (player.d.points.add(gain.floor().sub(player.d.points).add(1).max(1)).gt(player.d.max)) return new Decimal(player.d.max).sub(player.d.points);
		return gain.floor().sub(player.d.points).add(1).max(1);
	},
	getNextAt(canMax = false) {
		if (!tmp.d.canBuyMax) canMax = false;
		let amt = player.d.points;
		if (canMax && tmp.d.baseAmount.gte(tmp.d.nextAt)) amt = amt.add(tmp.d.resetGain);
		amt = amt.div(tmp.d.directMult);
		let extraCost = Decimal.pow(tmp.d.base, amt.pow(tmp.d.exponent).div(tmp.d.gainExp)).mul(tmp.d.gainMult);
		let cost = extraCost.mul(tmp.d.requires).max(tmp.d.requires);
		if (tmp.d.roundUpCost) cost = cost.ceil();
		return cost;
	},
	canReset() {
		if (player.d.points.gte(player.d.max)) return false;
		return tmp.d.baseAmount.gte(tmp.d.nextAt);
	},
	prestigeNotify() {
		if (tmp.d.autoPrestige || tmp.d.passiveGeneration) return false;
		return tmp.d.canReset;
	},
	resetsNothing() { return hasMilestone('i', 3) },
	autoPrestige() { return player.d.digitAuto },
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = ["numberUpgradeAuto", "baseUpAuto", "digitAuto", "limitBreakAuto"];
		let keepMile = [];
		if ((hasMilestone('gn', 0) && resettingLayer == 'gn') || (hasMilestone('i', 10) && resettingLayer == 'i')) {
			keepMile.push('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
		};
		if ((hasMilestone('gn', 3) && resettingLayer == 'gn') || (hasMilestone('i', 16) && resettingLayer == 'i')) {
			keepMile.push('18');
		};
		if (hasMilestone('gn', 17) && resettingLayer == 'gn') keep.push('milestones');
		layerDataReset('d', keep);
		if (!keep.includes('milestones')) player[this.layer].milestones = keepMile;
	},
	hotkeys: [{
		key: 'd', // Use uppercase if it's combined with shift, or 'ctrl+x' for holding down ctrl.
		description: 'D: reset for digits',
		onPress() { if (player.d.unlocked) doReset('d') },
	}],
	effect() {
		let logValue = newDecimalOne();
		if (hasMilestone('d', 14)) logValue = new Decimal(0.0001);
		else if (hasMilestone('d', 13)) logValue = new Decimal(0.001);
		else if (hasMilestone('d', 12)) logValue = new Decimal(0.005);
		else if (hasMilestone('d', 11)) logValue = new Decimal(0.02);
		else if (hasMilestone('d', 10)) logValue = new Decimal(0.1);
		else if (hasMilestone('d', 1)) logValue = new Decimal(0.2);
		else if (hasMilestone('d', 0)) logValue = new Decimal(0.5);
		if (getBuyableAmount('d', 42).gt(0)) logValue = logValue.div(buyableEffect('d', 42));
		let eff = player.d.number.add(1).log(logValue.add(1)).mul(player.d.points);
		if (getBuyableAmount('d', 51)) eff = eff.mul(new Decimal(2).pow(getBuyableAmount('d', 51)));
		if (hasUpgrade('d', 32)) eff = eff.mul(upgradeEffect('d', 32));
		if (hasUpgrade('d', 43)) eff = eff.mul(upgradeEffect('d', 43));
		if (hasUpgrade('d', 54)) eff = eff.mul(upgradeEffect('d', 54));
		if (hasUpgrade('d', 64)) eff = eff.mul(upgradeEffect('d', 64));
		if (hasUpgrade('d', 74)) eff = eff.mul(upgradeEffect('d', 74));
		if (hasUpgrade('d', 84)) eff = eff.mul(upgradeEffect('d', 84));
		if (hasUpgrade('d', 94)) eff = eff.mul(upgradeEffect('d', 94));
		return eff;
	},
	layerShown() { return true },
	tabFormat: {
		"Number": {
			content: () => {
				let content = [
					['display-text', 'You have <h2 class="layer-d">' + formatWhole(player.d.points) + '</h2> digits (and your number is <h2 class="layer-d">' + formatWhole(player.d.number) + '</h2>), which increases arabic numeral gain by +<h2 class="layer-d">' + format(tmp.d.effect) + '</h2>%'],
					'blank',
					'prestige-button',
					'resource-display',
					'blank',
					'grid',
					'blank',
					['row', [['buyable', 11], 'blank', 'clickables', 'blank', ['buyable', 12]]],
					['blank', '13px'],
					['buyables', '2'],
					['blank', '13px'],
					['buyables', '3'],
				];
				if (hasMilestone('d', 17)) content.push(['blank', '13px'], ['buyables', '4']);
				content.push('blank');
				return content;
			},
		},
		"Milestones": {
			content: [
				['display-text', () => 'You have <h2 class="layer-d">' + formatWhole(player.d.points) + '</h2> digits (and your number is <h2 class="layer-d">' + formatWhole(player.d.number) + '</h2>), which increases arabic numeral gain by +<h2 class="layer-d">' + format(tmp.d.effect) + '</h2>%'],
				'blank',
				'prestige-button',
				'resource-display',
				'blank',
				'milestones',
			],
		},
		"Base Up": {
			content: [
				['display-text', () => 'You have <h2 class="layer-d">' + formatWhole(player.d.points) + '</h2> digits (and your number is <h2 class="layer-d">' + formatWhole(player.d.number) + '</h2>), which increases arabic numeral gain by +<h2 class="layer-d">' + format(tmp.d.effect) + '</h2>%'],
				'blank',
				'prestige-button',
				'resource-display',
				'blank',
				['buyable', 51],
				'blank',
			],
			unlocked() { return hasMilestone('d', 9) },
		},
		"Limit Break": {
			content: [
				['display-text', () => 'You have <h2 class="layer-d">' + formatWhole(player.d.points) + '</h2> digits (and your number is <h2 class="layer-d">' + formatWhole(player.d.number) + '</h2>), which increases arabic numeral gain by +<h2 class="layer-d">' + format(tmp.d.effect) + '</h2>%'],
				'blank',
				'prestige-button',
				'resource-display',
				'blank',
				['display-text', () => 'Your digit limit is <h2 class="layer-d">' + formatWhole(player.d.max) + '</h2>'],
				'blank',
				'upgrades',
			],
			unlocked() { return hasMilestone('d', 15) },
		},
	},
	update(diff) {
		let cap = new Decimal(99);
		if (hasUpgrade('d', 52)) cap = cap.add(1);
		if (hasUpgrade('d', 11)) cap = cap.mul(2);
		if (hasUpgrade('d', 42)) cap = cap.mul(1.5);
		if (hasUpgrade('d', 62)) cap = cap.mul(1.5);
		if (hasUpgrade('d', 72)) cap = cap.mul(4);
		if (hasMilestone('d', 19)) cap = cap.mul(2);
		if (hasUpgrade('d', 82)) cap = cap.mul(5);
		if (hasUpgrade('d', 92)) cap = cap.mul(10);
		if (hasUpgrade('gn', 12) && !inChallenge('i', 32)) cap = cap.mul(upgradeEffect('gn', 12));
		if (hasUpgrade('gn', 23) && !inChallenge('i', 32)) cap = cap.mul(upgradeEffect('gn', 23));
		if (hasUpgrade('gn', 31) && !inChallenge('i', 32)) cap = cap.mul(upgradeEffect('gn', 31));
		if (hasUpgrade('gn', 34) && !inChallenge('i', 32)) cap = cap.mul(upgradeEffect('gn', 34));
		player.d.max = cap.round();
		player.d.timer += diff;
		let timer = newDecimalOne().div(buyableEffect('d', 32)).toNumber();
		if (player.d.timer >= timer) {
			let ticks = Math.floor(player.d.timer / timer);
			player.d.number = player.d.number.add(buyableEffect('d', 22).mul(ticks));
			if (hasMilestone('d', 18)) player.d.number = player.d.number.add(player.d.clickPower.mul(ticks)).round();
			player.d.timer -= timer * ticks;
		};
		let power = newDecimalOne();
		if (getBuyableAmount('d', 11).gt(0)) power = power.add(buyableEffect('d', 11));
		if (getBuyableAmount('d', 12).gt(0)) power = power.mul(buyableEffect('d', 12));
		player.d.clickPower = power;
		let limit = new Decimal(getNumberBase()).pow(player.d.points).round().sub(1);
		if (player.d.number.gte(limit)) {
			player.d.number = limit;
			player.d.limited = true;
		} else {
			player.d.limited = false;
		};
		if (buyableEffect('d', 51).gte(10)) {
			player.d.meta = 'base 10 achieved';
			return;
		};
		player.d.meta = (player.d.number.toNumber()).toString(getNumberBase());
		let meta = player.d.meta;
		if ((tmp.d.grid.cols - meta.length) == 0) return;
		for (let i = 0; i < (tmp.d.grid.cols - meta.length); i++) {
			player.d.meta = '0' + player.d.meta;
		};
	},
	automate() {
		for (let num = 0; num < (hasUpgrade('gn', 32) && !inChallenge('i', 32) ? 2 : 1); num++) {
			if (player.d.limitBreakAuto) {
				for (upgrade in tmp.d.upgrades) {
					if (upgrade == "layer" || upgrade == "rows" || upgrade == "cols") continue;
					if (tmp.d.upgrades[upgrade].unlocked) {
						buyUpgrade('d', upgrade);
					};
				};
			};
			if (player.d.numberUpgradeAuto) {
				for (upgrade in tmp.d.buyables) {
					if (upgrade == "layer" || upgrade == "rows" || upgrade == "cols" || (upgrade == "51" && !player.d.baseUpAuto)) continue;
					if (tmp.d.buyables[upgrade].unlocked && layers.d.buyables[upgrade].canAfford()) {
						layers.d.buyables[upgrade].buy();
					};
				};
			} else if (player.d.baseUpAuto) {
				if (tmp.d.buyables[51].unlocked && layers.d.buyables[51].canAfford()) {
					layers.d.buyables[51].buy();
				};
			};
		};
	},
	grid: {
		rows: 1,
		cols() {
			if (hasUpgrade('d', 11)) return 2;
			if (buyableEffect('d', 51).gte(10) || player.d.points.gt(99)) return 1;
			return player.d.points.toNumber();
		},
		maxCols: 99,
		getStartData(id) { return 0 },
		getUnlocked(id) { return true },
		getCanClick(data, id) { return false },
		getDisplay(data, id) {
			if (buyableEffect('d', 51).gte(10) && id == 101) return '<h2>Base ' + formatWhole(buyableEffect('d', 51)) + ' achieved';
			if (hasUpgrade('d', 11) && id == 102) return '<h2>Limit broken';
			if (player.d.points.gt(99) && id == 101) return '<h2>Limit bent';
			if (player.d.limited) return '<h2>' + formatWhole(buyableEffect('d', 51).sub(1));
			data = player.d.meta.charAt(id - 101);
			setGridData('d', id, data);
			return '<h2>' + data;
		},
		getStyle(data, id) {
			if (buyableEffect('d', 51).gte(10) && id == 101) return {'height':'30px','width':'170px','border-radius':'0%'};
			if (hasUpgrade('d', 11) && id == 102) return {'height':'30px','width':'130px','border-radius':'0%'};
			if (player.d.points.gt(99) && id == 101) return {'height':'30px','width':'120px','border-radius':'0%'};
			return {'height':'30px','width':'30px','border-radius':'50%'};
		},
	},
	clickables: {
		11: {
			display() { return '<h3>Make number +' + formatWhole(player.d.clickPower) + (hasUpgrade('d', 11) || buyableEffect('d', 51).gte(10) || player.d.points.gt(99) ? '' : ' <span style="word-break: break-word">(+' + Math.round(player.d.clickPower.toNumber()).toString(getNumberBase()) + ')</span>') + ' larger' },
			canClick() { return true },
			onClick() { player.d.number = player.d.number.add(player.d.clickPower).round() },
		},
	},
	buyables: {
		11: {
			cost() { return new Decimal(1e5).pow(getBuyableAmount(this.layer, this.id).div(5).add(1)).mul(1e10) },
			effect() {
				let eff = getBuyableAmount(this.layer, this.id);
				if (getBuyableAmount('d', 21).gt(0)) eff = eff.mul(buyableEffect('d', 21));
				return eff;
			},
			display() {
				return `<h3>One Up</h3><br>`
					+ `Increase the effect of the button to the right by 1<br>`
					+ `Currently: +` + formatWhole(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit());
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit() {
				lim = new Decimal(250);
				if (getBuyableAmount('d', 31).gt(0)) lim = lim.add(buyableEffect('d', 31));
				return lim;
			},
		},
		12: {
			cost() {
				let costing = new Decimal(1e10).pow(getBuyableAmount(this.layer, this.id).add(1)).mul(1e5);
				if (getBuyableAmount('d', 33).gt(0)) costing = costing.div(buyableEffect('d', 33));
				if (getBuyableAmount('d', 43).gt(0)) costing = costing.div(buyableEffect('d', 43));
				return costing;
			},
			effect() { return new Decimal(3).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Triple</h3><br>`
					+ `multiply the effect of the button to the left by 3<br>`
					+ `Currently: ` + formatWhole(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit());
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit() {
				let cap = new Decimal(1000);
				if (hasUpgrade('gn', 22) && !inChallenge('i', 32)) cap = cap.add(upgradeEffect('gn', 22));
				return cap;
			},
		},
		22: {
			cost() { return new Decimal(1e5).pow(getBuyableAmount(this.layer, this.id).add(1)).mul(1e20) },
			effect() {
				let eff = getBuyableAmount(this.layer, this.id).mul(1.5).floor();
				if (getBuyableAmount('d', 23).gt(0)) eff = eff.mul(buyableEffect('d', 23));
				return eff;
			},
			display() {
				return `<h3>Lazing</h3><br>`
					+ `passively increase your number by +1.5 (rounded down) every ` + formatTime(newDecimalOne().div(buyableEffect('d', 32))) + `<br>`
					+ `Currently: +` + formatWhole(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 200,
		},
		32: {
			cost() { return new Decimal(1e10).pow(getBuyableAmount(this.layer, this.id).add(1)).mul(1e20) },
			effect() { return getBuyableAmount(this.layer, this.id).mul(20).div(100).add(1) },
			display() {
				return `<h3>Rapid Idle</h3><br>`
					+ `Increase the speed of the upgrade above by +20%<br>`
					+ `Currently: +` + formatWhole(getBuyableAmount(this.layer, this.id).mul(20)) + `%<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 33333,
		},
		21: {
			cost() { return new Decimal(1e50).pow(getBuyableAmount(this.layer, this.id).div(5).add(1)).mul(1e150) },
			effect() {
				let effBase = new Decimal(2);
				if (getBuyableAmount('d', 41).gt(0)) effBase = effBase.mul(buyableEffect('d', 41));
				return effBase.pow(getBuyableAmount(this.layer, this.id));
			},
			display() {
				let text = `<h3>Up the Up</h3><br>`
					+ `Multiply the effect of the upgrade above by `;
				if (getBuyableAmount('d', 41).gt(0)) text += format(buyableEffect('d', 41).mul(2));
				else text += '2';
				text += `<br>`
					+ `Currently: ` + formatWhole(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit());
				return text;
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit() {
				let limit = new Decimal(500);
				if (hasChallenge('i', 12)) limit = limit.add(challengeEffect('i', 12));
				return limit;
			},
			unlocked() { return hasMilestone('d', 7) },
		},
		23: {
			cost() {
				let costing = new Decimal(1e50).pow(getBuyableAmount(this.layer, this.id).div(5).add(1)).mul(1e150);
				if (getBuyableAmount('d', 33).gt(0)) costing = costing.div(buyableEffect('d', 33));
				if (getBuyableAmount('d', 43).gt(0)) costing = costing.div(buyableEffect('d', 43));
				return costing;
			},
			effect() { return new Decimal(5).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Worth the Time</h3><br>`
					+ `Multiply the effect of the upgrade to the left by 5<br>`
					+ `Currently: ` + formatWhole(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			unlocked() { return hasMilestone('d', 7) },
		},
		31: {
			cost() { return new Decimal(1e10).pow(getBuyableAmount(this.layer, this.id).add(1)).mul(1e240) },
			effect() { return getBuyableAmount(this.layer, this.id).mul(15) },
			display() {
				return `<h3>Higher!</h3><br>`
					+ `increase the cap of <b>One Up</b> by 15<br>`
					+ `Currently: +` + formatWhole(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 20,
			unlocked() { return hasMilestone('d', 8) },
		},
		33: {
			cost() {
				let costing = new Decimal(1e20).pow(getBuyableAmount(this.layer, this.id).add(1)).mul(1e230);
				if (getBuyableAmount('d', 43).gt(0)) costing = costing.div(buyableEffect('d', 43));
				return costing;
			},
			effect() { return new Decimal(1e10).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Cheap</h3><br>`
					+ `divide the cost of all of the upgrades above by 1e10<br>`
					+ `Currently: /` + formatWhole(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			unlocked() { return hasMilestone('d', 8) },
		},
		51: {
			cost() {
				if (getBuyableAmount(this.layer, this.id).eq(0)) return new Decimal(6e29);
				if (getBuyableAmount(this.layer, this.id).eq(1)) return new Decimal(1e47);
				if (getBuyableAmount(this.layer, this.id).eq(2)) return new Decimal(4e59);
				if (getBuyableAmount(this.layer, this.id).eq(3)) return new Decimal(1e69);
				if (getBuyableAmount(this.layer, this.id).eq(4)) return new Decimal(1e77);
				if (getBuyableAmount(this.layer, this.id).eq(5)) return new Decimal(4e83);
				if (getBuyableAmount(this.layer, this.id).eq(6)) return new Decimal(2e89);
				if (getBuyableAmount(this.layer, this.id).eq(7)) return new Decimal(2e94);
				return new Decimal(1e99);
			},
			effect() { return getBuyableAmount(this.layer, this.id).add(2) },
			display() {
				return `<h1>Base Up</h1><br><br><h3>`
					+ `Upgrade your numbers to the next base (allowing for higher numbers) and multiply the number effect by 2<br><br>`
					+ `Currently: base ` + formatWhole(buyableEffect(this.layer, this.id)) + ` and ` + formatWhole(new Decimal(2).pow(getBuyableAmount(this.layer, this.id))) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` of your number<br><br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit) + `</h3>`;
			},
			canAfford() { return player.d.number.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.d.number = player.d.number.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'300px','height':'300px','border-radius':'50%'},
			purchaseLimit: 8,
			unlocked() {
				if (inChallenge('i', 11)) return false;
				return hasMilestone('d', 9);
			},
		},
		41: {
			cost() {
				let costing = new Decimal(1e250).pow(getBuyableAmount(this.layer, this.id).add(1)).mul('1e750');
				if (hasUpgrade('d', 63)) costing = costing.div(upgradeEffect('d', 63));
				return costing;
			},
			effect() { return new Decimal(1.25).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Up Even More</h3><br>`
					+ `Multiply the base effect of <b>Up the Up</b> by 1.25<br>`
					+ `Currently: ` + format(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit());
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit() {
				let limit = new Decimal(25);
				if (hasChallenge('i', 11)) limit = limit.add(challengeEffect('i', 11));
				return limit;
			},
			unlocked() { return hasMilestone('d', 17) },
		},
		42: {
			cost() { return new Decimal(1e75).pow(getBuyableAmount(this.layer, this.id).add(1)).mul('1e925') },
			effect() { return new Decimal(750).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Weaken Chains</h3><br>`
					+ `Divide the logarithm base above 1 in the number effect formula by 750<br>`
					+ `Currently: /` + formatWhole(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 4,
			unlocked() { return hasMilestone('d', 17) },
		},
		43: {
			cost() { return new Decimal(1e50).pow(getBuyableAmount(this.layer, this.id).add(1)).mul('1e950') },
			effect() {
				let eff = new Decimal(1e20).pow(getBuyableAmount(this.layer, this.id));
				if (hasUpgrade('d', 53)) eff = eff.mul(upgradeEffect('d', 53));
				return eff;
			},
			display() {
				return `<h3>Cheapest</h3><br>`
					+ `divide the cost of the upgrades above by 1e20<br>`
					+ `Currently: /` + formatWhole(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit());
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit() {
				let cap = new Decimal(50);
				if (hasUpgrade('gn', 21) && !inChallenge('i', 32)) cap = cap.add(upgradeEffect('gn', 21));
				return cap;
			},
			unlocked() { return hasMilestone('d', 17) },
		},
	},
	milestones: {
		0: {
			requirementDescription: "30 digits and number 100,000",
			effectDescription: "improves the number effect formula<br>log2 --> log1.5",
			done() { return player.d.points.gte(30) && player.d.number.gte(100000) },
		},
		1: {
			requirementDescription: "40 digits and number 300,000",
			effectDescription: "improves the number effect formula<br>log1.5 --> log1.2",
			done() { return player.d.points.gte(40) && player.d.number.gte(300000) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		2: {
			requirementDescription: "60 digits and number 1,000,000",
			effectDescription: "unlocks a new roman numeral upgrade",
			done() { return player.d.points.gte(60) && player.d.number.gte(1000000) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		3: {
			requirementDescription: "80 digits and number 10,000,000",
			effectDescription: "unlocks a second new roman numeral upgrade",
			done() { return player.d.points.gte(80) && player.d.number.gte(10000000) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		4: {
			requirementDescription: "99 digits and number 100,000,000",
			effectDescription: "unlocks a third new roman numeral upgrade",
			done() { return player.d.points.gte(99) && player.d.number.gte(100000000) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		5: {
			requirementDescription: "number 1e11",
			effectDescription: "roman numerals reset nothing",
			done() { return player.d.number.gte(1e11) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		6: {
			requirementDescription: "number 1e15",
			effectDescription: "gain 1,000% of roman numeral gain per second",
			done() { return player.d.number.gte(1e15) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		7: {
			requirementDescription: "number 1e16",
			effectDescription: "unlocks two new digit number upgrades",
			done() { return player.d.number.gte(1e16) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		8: {
			requirementDescription: "number 1e24",
			effectDescription: "unlocks two new digit number upgrades",
			done() { return player.d.number.gte(1e24) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		9: {
			requirementDescription: "360 One Ups",
			effectDescription: "unlocks Base Up",
			done() { return getBuyableAmount('d', 11).gte(360) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		10: {
			requirementDescription: "number 1e35",
			effectDescription: "improves the number effect formula<br>log1.2 --> log1.1",
			done() { return player.d.number.gte(1e35) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		11: {
			requirementDescription: "number 1e36",
			effectDescription: "improves the number effect formula<br>log1.1 --> log1.02",
			done() { return player.d.number.gte(1e36) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		12: {
			requirementDescription: "number 1e40",
			effectDescription: "improves the number effect formula<br>log1.02 --> log1.005",
			done() { return player.d.number.gte(1e40) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		13: {
			requirementDescription: "number 1e45",
			effectDescription: "improves the number effect formula<br>log1.005 --> log1.001",
			done() { return player.d.number.gte(1e45) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		14: {
			requirementDescription: "number 1e66",
			effectDescription: "improves the number effect formula<br>log1.001 --> log1.0001",
			done() { return player.d.number.gte(1e66) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		15: {
			requirementDescription: "number 1e99",
			effectDescription: "unlocks Limit Break",
			done() { return player.d.number.gte(1e99) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		16: {
			requirementDescription: "number 1e101",
			effectDescription: "you can buy max digits",
			done() { return player.d.number.gte(1e101) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		17: {
			requirementDescription: "number 1e116",
			effectDescription: "unlocks three new digit number upgrades",
			done() { return player.d.number.gte(1e111) },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		18: {
			requirementDescription: "number 1e630",
			effectDescription: "<b>Lazing</b> also presses the button above it on activation",
			done() { return player.d.number.gte('1e630') },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
		19: {
			requirementDescription: "number 1e1750",
			effectDescription: "double the digit limit",
			done() { return player.d.number.gte('1e1750') },
			unlocked() { return hasMilestone('d', this.id - 1) || hasMilestone('d', this.id) },
		},
	},
	upgrades: {
		11: {
			fullDisplay() {
				let text = `<h3>Limit Break</h3><br>
					double the digit limit, but increase the digit cost exponent<br>(1.2 --> 1.75)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(99),
			unlocked() { return hasMilestone('d', 15) },
		},
		21: {
			fullDisplay() {
				let text = `<h3>Digit Bend</h3><br>
					decrease the digit cost exponent<br>(1.75 --> 1.7)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(108),
			unlocked() {
				if (inChallenge('i', 12)) return false;
				return player.d.upgrades.length >= 1;
			},
		},
		22: {
			fullDisplay() {
				let text = `<h3>Roman Numeral Bend</h3><br>
					double roman numeral gain and increase roman numeral gain after softcap<br>(^0.2 --> ^0.5)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(125),
			unlocked() {
				if (inChallenge('i', 12)) return false;
				return player.d.upgrades.length >= 1;
			},
		},
		31: {
			fullDisplay() {
				let text = `<h3>Digit Warp</h3><br>
					decrease the digit cost exponent<br>(1.7 --> 1.65)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(126),
			unlocked() { return player.d.upgrades.length >= 3 },
		},
		32: {
			fullDisplay() {
				let text = `<h3>Number Warp</h3><br>
					multiply the number effect based on the number you have<br>
					Currently: ` + format(upgradeEffect(this.layer, this.id)) + `x<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return player.d.number.add(1).pow(0.1) },
			cost: new Decimal(148),
			unlocked() { return player.d.upgrades.length >= 3 },
		},
		33: {
			fullDisplay() {
				let text = `<h3>Roman Numeral Warp</h3><br>
					double roman numeral gain and increase roman numeral gain after softcap<br>(^0.5 --> ^0.75)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(147),
			unlocked() { return player.d.upgrades.length >= 3 },
		},
		41: {
			fullDisplay() {
				let text = `<h3>Digit Hole</h3><br>
					decrease the digit cost exponent<br>(1.65 --> 1.6)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(164),
			unlocked() { return player.d.upgrades.length >= 6 },
		},
		42: {
			fullDisplay() {
				let text = `<h3>Limit Hole</h3><br>
					multiply the digit limit by 1.5 and divide digit cost requirement by 1e20<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return new Decimal(1e20) },
			cost: new Decimal(197),
			unlocked() { return player.d.upgrades.length >= 6 },
		},
		43: {
			fullDisplay() {
				let text = `<h3>Number Hole</h3><br>
					multiply the number effect based on the number you have<br>
					Currently: ` + format(upgradeEffect(this.layer, this.id)) + `x<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return player.d.number.add(1).pow(0.025) },
			cost: new Decimal(162),
			unlocked() { return player.d.upgrades.length >= 6 },
		},
		44: {
			fullDisplay() {
				let text = `<h3>Roman Numeral Hole</h3><br>
					double roman numeral gain and increase roman numeral gain after softcap<br>(^0.75 --> ^0.8)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(193),
			unlocked() { return player.d.upgrades.length >= 6 },
		},
		51: {
			fullDisplay() {
				let text = `<h3>Digit Void</h3><br>
					decrease the digit cost exponent<br>(1.6 --> 1.575)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(199),
			unlocked() { return player.d.upgrades.length >= 10 },
		},
		52: {
			fullDisplay() {
				let text = `<h3>Limit Void</h3><br>
					increase the base digit limit by 1 and divide digit cost requirement by 1e50<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return new Decimal(1e50) },
			cost: new Decimal(217),
			unlocked() { return player.d.upgrades.length >= 10 },
		},
		53: {
			fullDisplay() {
				let text = `<h3>Cost Void</h3><br>
					multiply the effect of <b>Cheapest</b> based on the number you have<br>
					Currently: ` + format(upgradeEffect(this.layer, this.id)) + `x<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return player.d.number.add(1).pow(0.6) },
			cost: new Decimal(228),
			unlocked() { return player.d.upgrades.length >= 10 },
		},
		54: {
			fullDisplay() {
				let text = `<h3>Number Void</h3><br>
					multiply the number effect based on the number you have<br>
					Currently: ` + format(upgradeEffect(this.layer, this.id)) + `x<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return player.d.number.add(1).pow(0.02) },
			cost: new Decimal(224),
			unlocked() { return player.d.upgrades.length >= 10 },
		},
		55: {
			fullDisplay() {
				let text = `<h3>Roman Numeral Void</h3><br>
					double roman numeral gain and increase roman numeral gain after softcap<br>(^0.8 --> ^0.825)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(222),
			unlocked() { return player.d.upgrades.length >= 10 },
		},
		61: {
			fullDisplay() {
				let text = `<h3>Digit Space</h3><br>
					decrease the digit cost exponent<br>(1.575 --> 1.55)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(229),
			unlocked() { return player.d.upgrades.length >= 15 },
		},
		62: {
			fullDisplay() {
				let text = `<h3>Limit Space</h3><br>
					multiply the digit limit by 1.5 and divide digit cost requirement by 1e75<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return new Decimal(1e75) },
			cost: new Decimal(269),
			unlocked() { return player.d.upgrades.length >= 15 },
		},
		63: {
			fullDisplay() {
				let text = `<h3>Cost Space</h3><br>
					divide the cost of <b>Up Even More</b> based on the number you have<br>
					Currently: /` + format(upgradeEffect(this.layer, this.id)) + `<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return player.d.number.add(1).pow(1.1) },
			cost: new Decimal(251),
			unlocked() { return player.d.upgrades.length >= 15 },
		},
		64: {
			fullDisplay() {
				let text = `<h3>Number Space</h3><br>
					multiply the number effect based on the number you have<br>
					Currently: ` + format(upgradeEffect(this.layer, this.id)) + `x<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return player.d.number.add(1).pow(0.05) },
			cost: new Decimal(252),
			unlocked() { return player.d.upgrades.length >= 15 },
		},
		65: {
			fullDisplay() {
				let text = `<h3>Roman Numeral Space</h3><br>
					double roman numeral gain and increase roman numeral gain after softcap<br>(^0.825 --> ^0.85)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(277),
			unlocked() { return player.d.upgrades.length >= 15 },
		},
		71: {
			fullDisplay() {
				let text = `<h3>Digit Star</h3><br>
					decrease the digit cost exponent<br>(1.55 --> 1.5)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(290),
			unlocked() { return player.d.upgrades.length >= 20 },
		},
		72: {
			fullDisplay() {
				let text = `<h3>Limit Star</h3><br>
					multiply the digit limit by 4 and divide digit cost requirement by 1e800<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return new Decimal('1e800') },
			cost: new Decimal(422),
			unlocked() { return player.d.upgrades.length >= 20 },
		},
		73: {
			fullDisplay() {
				let text = `<h3>Cost Star</h3><br>
					divide digit cost requirement by 1e700<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return new Decimal('1e700') },
			cost: new Decimal(520),
			unlocked() { return player.d.upgrades.length >= 20 },
		},
		74: {
			fullDisplay() {
				let text = `<h3>Number Star</h3><br>
					multiply the number effect based on the number you have<br>
					Currently: ` + format(upgradeEffect(this.layer, this.id)) + `x<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return player.d.number.add(1).pow(0.02) },
			cost: new Decimal(352),
			unlocked() { return player.d.upgrades.length >= 20 },
		},
		75: {
			fullDisplay() {
				let text = `<h3>Roman Numeral Star</h3><br>
					double roman numeral gain and increase roman numeral gain after softcap<br>(^0.85 --> ^0.875)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(370),
			unlocked() { return player.d.upgrades.length >= 20 },
		},
		81: {
			fullDisplay() {
				let text = `<h3>Digit Galaxy</h3><br>
					decrease the digit cost exponent<br>(1.5 --> 1.49)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(5500),
			unlocked() { return player.d.upgrades.length >= 25 && getBuyableAmount('i', 32).gte(1) },
		},
		82: {
			fullDisplay() {
				let text = `<h3>Limit Galaxy</h3><br>
					multiply the digit limit by 5<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(3600),
			unlocked() { return player.d.upgrades.length >= 25 && getBuyableAmount('i', 32).gte(1) },
		},
		83: {
			fullDisplay() {
				let text = `<h3>Cost Galaxy</h3><br>
					divide digit cost requirement by 1e75,000<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return new Decimal('1e75000') },
			cost: new Decimal(7500),
			unlocked() { return player.d.upgrades.length >= 25 && getBuyableAmount('i', 32).gte(1) },
		},
		84: {
			fullDisplay() {
				let text = `<h3>Number Galaxy</h3><br>
					multiply the number effect based on the number you have<br>
					Currently: ` + format(upgradeEffect(this.layer, this.id)) + `x<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return player.d.number.add(1).pow(0.0025) },
			cost: new Decimal(4750),
			unlocked() { return player.d.upgrades.length >= 25 && getBuyableAmount('i', 32).gte(1) },
		},
		85: {
			fullDisplay() {
				let text = `<h3>Roman Numeral Galaxy</h3><br>
					double roman numeral gain and increase roman numeral gain after softcap<br>(^0.875 --> ^0.88)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(3900),
			unlocked() { return player.d.upgrades.length >= 25 && getBuyableAmount('i', 32).gte(1) },
		},
		91: {
			fullDisplay() {
				let text = `<h3>Digit Dimension</h3><br>
					decrease the digit cost exponent<br>(1.49 --> 1.484)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(17000),
			unlocked() { return player.d.upgrades.length >= 30 && getBuyableAmount('i', 72).gte(1) },
		},
		92: {
			fullDisplay() {
				let text = `<h3>Limit Dimension</h3><br>
					multiply the digit limit by 10<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(18000),
			unlocked() { return player.d.upgrades.length >= 30 && getBuyableAmount('i', 72).gte(1) },
		},
		93: {
			fullDisplay() {
				let text = `<h3>Cost Dimension</h3><br>
					divide intelligence cost requirement based on the number you have<br>
					Currently: ` + format(upgradeEffect(this.layer, this.id)) + `x<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return player.d.number.add(1).log10().add(1).pow(0.02) },
			cost: new Decimal(19000),
			unlocked() { return player.d.upgrades.length >= 30 && getBuyableAmount('i', 72).gte(1) },
		},
		94: {
			fullDisplay() {
				let text = `<h3>Number Dimension</h3><br>
					multiply the number effect based on the number you have<br>
					Currently: ` + format(upgradeEffect(this.layer, this.id)) + `x<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			effect() { return player.d.number.add(1).pow(0.002) },
			cost: new Decimal(16000),
			unlocked() { return player.d.upgrades.length >= 30 && getBuyableAmount('i', 72).gte(1) },
		},
		95: {
			fullDisplay() {
				let text = `<h3>Roman Numeral Dimension</h3><br>
					double roman numeral gain and increase roman numeral gain after softcap<br>(^0.88 --> ^0.888)<br><br>
					Cost: ` + formatWhole(this.cost) + ` digits`;
				return text;
			},
			cost: new Decimal(15000),
			unlocked() { return player.d.upgrades.length >= 30 && getBuyableAmount('i', 72).gte(1) },
		},
	},
});

addLayer('i', {
	name: 'intelligence',
	symbol: 'I',
	row: 1,
	position: 1,
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		total: newDecimalZero(),
		units: newDecimalOne(),
		unitEffect: newDecimalOne(),
		timerR: 0,
		raw: newDecimalZero(),
		raw_power: new Decimal(0.1),
		processed: newDecimalZero(),
		process_power: new Decimal(2),
		products: newDecimalZero(),
		craft_power: new Decimal(15),
		craft_eff: newDecimalOne(),
		money: newDecimalZero(),
		sell_power: newDecimalOne(),
		sell_eff: new Decimal(2.75),
		timerM: 0,
		timerP: 0,
		timerC: 0,
		timerS: 0,
		score: newDecimalZero(),
		scoreEff: newDecimalOne(),
		simAuto: false,
		replicateAuto: false,
	}},
	color: '#c0e020',
	resource: 'intelligence',
	baseResource: 'digits',
	roundUpCost: true,
	baseAmount() { return player.d.points },
	requires: new Decimal(600),
	type: 'static',
	exponent: 1,
	gainMult() {
		let gain = newDecimalOne();
		if (player.i.score.gte(1)) gain = gain.div(player.i.scoreEff);
		if (hasUpgrade('d', 93)) gain = gain.div(upgradeEffect('d', 93));
		if (hasChallenge('i', 31)) gain = gain.div(challengeEffect('i', 31));
		if (hasChallenge('i', 32)) gain = gain.div(challengeEffect('i', 32));
		if (hasChallenge('i', 41)) gain = gain.div(challengeEffect('i', 41));
		if (hasChallenge('i', 42)) gain = gain.div(challengeEffect('i', 42));
		if (hasUpgrade('gn', 33) && !inChallenge('i', 32)) gain = gain.div(upgradeEffect('gn', 33));
		return gain;
	},
	canBuyMax() { return hasMilestone('i', 18) },
	hotkeys: [{
		key: 'i', // Use uppercase if it's combined with shift, or 'ctrl+x' for holding down ctrl.
		description: 'I: reset for intelligence',
		onPress() { if (player.i.unlocked) doReset('i') },
	}],
	effect() {
		if (hasMilestone('i', 14)) return new Decimal(1000).pow(player.i.points);
		if (hasMilestone('i', 13)) return new Decimal(100).pow(player.i.points);
		return new Decimal(10).pow(player.i.points);
	},
	effectDescription() {
		if (hasMilestone('i', 15)) return 'which multiplies arabic numeral gain and roman numeral gain by <h2 class="layer-i">' + format(tmp.i.effect) + '</h2>x';
		return 'which multiplies arabic numeral gain by <h2 class="layer-i">' + format(tmp.i.effect) + '</h2>x';
	},
	layerShown() { return hasMilestone('d', 15) || player.i.unlocked },
	tabFormat: {
		"Milestones": {
			content: [
				'main-display',
				'prestige-button',
				'resource-display',
				'blank',
				'milestones',
			],
		},
		"Replicator": {
			content: [
				'main-display',
				'prestige-button',
				'resource-display',
				'blank',
				['display-text', () => 'You have <h2 class="layer-i">' + formatWhole(player.i.units) + '</h2> units, which divides the digit cost requirement by /<h2 class="layer-i">' + format(player.i.unitEffect) + '</h2> (digit cost requirement cannot go below 1e10)'],
				'blank',
				['row', [['buyable', 11], 'blank', ['clickables', '1'], 'blank', ['buyable', 12]]],
				['blank', '13px'],
				['buyables', '3'],
				['blank', '13px'],
				['buyables', '7'],
				'blank',
			],
			unlocked() { return player.i.unlocked },
		},
		"Simulation": {
			content: [
				'main-display',
				'prestige-button',
				'resource-display',
				'blank',
				['display-text', () => {
					let text = 'You have <h2 class="layer-i">' + format(player.i.raw) + '</h2> raw materials,<br><h2 class="layer-i">' + format(player.i.processed) + '</h2> processed materials,<br><h2 class="layer-i">' + formatWhole(player.i.products) + '</h2> finished products,<br>and <h2 class="layer-i">' + format(player.i.money) + '</h2> money.';
					if (player.i.score.gte(1)) text += '<br>This totals to <h2 class="layer-i">' + format(player.i.score) + '</h2> score, which divides the intelligence cost requirement by /<h2 class="layer-i">' + format(player.i.scoreEff) + "</h2> (intelligence cost requirement cannot go below 600)";
					return text;
				}],
				'blank',
				['clickables', '2'],
				['blank', '13px'],
				['buyables', '4'],
				['blank', '13px'],
				['buyables', '5'],
				['blank', '13px'],
				['buyables', '6'],
				'blank',
			],
			unlocked() { return hasMilestone('i', 5) },
		},
		"Feats": {
			content: [
				'main-display',
				'prestige-button',
				'resource-display',
				'blank',
				['display-text', 'Feats are runs with restriction(s). when you enter a Feat, everything will reset like an intelligence reset. reach the goal to complete the Feat and get a reward, or exit it and try it another time.'],
				['challenges', '1'],
				['challenges', '2'],
				['clickables', '3'],
				['challenges', '3'],
				['challenges', '4'],
				'blank',
			],
			unlocked() { return hasMilestone('i', 9) },
		},
	},
	update(diff) {
		// replication timer
		if (getBuyableAmount('i', 73).gt(0)) {
			player.i.timerR += diff;
			let increment = 1;
			if (player.i.timerR >= increment) {
				let ticks = Math.floor(player.i.timerR / increment);
				player.i.units = player.i.units.mul(buyableEffect('i', 73).pow(ticks));
				player.i.timerR -= increment * ticks;
			};
		};
		// replication effect
		let power = new Decimal(0.25);
		if (getBuyableAmount('i', 12).gt(0)) power = power.add(buyableEffect('i', 12));
		if (getBuyableAmount('i', 33).gt(0)) power = power.add(buyableEffect('i', 33));
		if (hasChallenge('i', 22) && !getClickableState('i', 31)) power = power.mul(challengeEffect('i', 22));
		player.i.unitEffect = player.i.units.add(1).pow(power);
		if (inChallenge('i', 22)) player.i.unitEffect = newDecimalOne();
		// simulation timers
		if (getBuyableAmount('i', 51).gt(0)) player.i.timerM += diff;
		if (getBuyableAmount('i', 52).gt(0)) player.i.timerP += diff;
		if (getBuyableAmount('i', 53).gt(0)) player.i.timerC += diff;
		if (getBuyableAmount('i', 54).gt(0)) player.i.timerS += diff;
		if (player.i.timerM >= buyableEffect('i', 51)) {
			let ticks = Math.floor(player.i.timerM / buyableEffect('i', 51));
			player.i.raw = player.i.raw.add(player.i.raw_power.mul(ticks)).mul(1e12).round().div(1e12);
			player.i.timerM -= buyableEffect('i', 51) * ticks;
		};
		if (player.i.timerP >= buyableEffect('i', 52)) {
			let ticks = Math.floor(player.i.timerP / buyableEffect('i', 52));
			let effectiveTicks = Math.min(ticks, Math.floor(player.i.raw.div(player.i.process_power).toNumber()));
			player.i.raw = player.i.raw.sub(player.i.process_power.mul(effectiveTicks)).mul(1e12).round().div(1e12);
			player.i.processed = player.i.processed.add(player.i.process_power.mul(effectiveTicks)).mul(1e12).round().div(1e12);
			player.i.timerP -= buyableEffect('i', 52) * ticks;
		};
		if (player.i.timerC >= buyableEffect('i', 53)) {
			let ticks = Math.floor(player.i.timerC / buyableEffect('i', 53));
			let effectiveTicks = Math.min(ticks, Math.floor(player.i.processed.div(player.i.craft_power).toNumber()));
			player.i.processed = player.i.processed.sub(player.i.craft_power.mul(effectiveTicks)).mul(1e12).round().div(1e12);
			player.i.products = player.i.products.add(player.i.craft_power.mul(player.i.craft_eff).div(5).mul(effectiveTicks)).round();
			player.i.timerC -= buyableEffect('i', 53) * ticks;
		};
		if (player.i.timerS >= buyableEffect('i', 54)) {
			let ticks = Math.floor(player.i.timerS / buyableEffect('i', 54));
			let effectiveTicks = Math.min(ticks, Math.floor(player.i.products.div(player.i.sell_power).toNumber()));
			player.i.products = player.i.products.sub(player.i.sell_power.mul(effectiveTicks)).round();
			player.i.money = player.i.money.add(player.i.sell_power.mul(player.i.sell_eff).mul(effectiveTicks)).mul(1e12).round().div(1e12);
			player.i.timerS -= buyableEffect('i', 54) * ticks;
		};
		// simulation earnings
		let earnings = [new Decimal(0.1), new Decimal(2), new Decimal(15), newDecimalOne(), newDecimalOne(), new Decimal(2.75)];
		if (getBuyableAmount('i', 41).gt(0)) earnings[0] = earnings[0].add(buyableEffect('i', 41));
		if (getBuyableAmount('i', 61).gt(0)) earnings[0] = earnings[0].mul(buyableEffect('i', 61));
		player.i.raw_power = earnings[0];
		if (getBuyableAmount('i', 42).gt(0)) earnings[1] = earnings[1].add(buyableEffect('i', 42));
		if (getBuyableAmount('i', 62).gt(0)) earnings[1] = earnings[1].mul(buyableEffect('i', 62));
		player.i.process_power = earnings[1];
		if (getBuyableAmount('i', 43).gt(0)) earnings[2] = earnings[2].add(buyableEffect('i', 43));
		if (getBuyableAmount('i', 63).gt(0)) earnings[2] = earnings[2].mul(buyableEffect('i', 63));
		player.i.craft_power = earnings[2];
		if (getBuyableAmount('i', 43).gt(0)) earnings[3] = earnings[3].mul(buyableEffect('i', 43).mul(0.01).add(1));
		player.i.craft_eff = earnings[3];
		if (getBuyableAmount('i', 44).gt(0)) earnings[4] = earnings[4].add(buyableEffect('i', 44));
		if (getBuyableAmount('i', 64).gt(0)) earnings[4] = earnings[4].mul(buyableEffect('i', 64));
		player.i.sell_power = earnings[4];
		if (getBuyableAmount('i', 44).gt(0)) earnings[5] = earnings[5].mul(buyableEffect('i', 44).mul(0.01).add(1));
		player.i.sell_eff = earnings[5];
		// simulation effect
		let worth = new Decimal(50);
		if (getBuyableAmount('i', 63).gt(0)) worth = worth.mul(buyableEffect('i', 63));
		player.i.score = player.i.raw.add(player.i.processed.mul(2)).add(player.i.products.mul(worth)).add(player.i.money.div(5)).div(1e9).add(getBuyableAmount('i', 41).add(getBuyableAmount('i', 42)).add(getBuyableAmount('i', 43)).add(getBuyableAmount('i', 44)).add(getBuyableAmount('i', 51)).add(getBuyableAmount('i', 52)).add(getBuyableAmount('i', 53)).add(getBuyableAmount('i', 54)).div(1000));
		player.i.scoreEff = player.i.score.add(1).pow(0.1);
	},
	automate() {
		if (player.i.simAuto) {
			for (upgrade in tmp.i.buyables) {
				if (upgrade == "layer" || upgrade == "rows" || upgrade == "cols" || upgrade < 40 || upgrade > 70) continue;
				if (tmp.i.buyables[upgrade].unlocked && layers.i.buyables[upgrade].canAfford()) {
					player.i.money = player.i.money.sub(tmp.i.buyables[upgrade].cost);
					addBuyables('i', upgrade, 1);
				};
			};
		};
		if (player.i.replicateAuto) {
			for (upgrade in tmp.i.buyables) {
				if (upgrade == "layer" || upgrade == "rows" || upgrade == "cols" || (upgrade > 40 && upgrade < 70)) continue;
				if (tmp.i.buyables[upgrade].unlocked && layers.i.buyables[upgrade].canAfford()) {
					player.points = player.points.sub(tmp.i.buyables[upgrade].cost);
					addBuyables('i', upgrade, 1);
				};
			};
		};
	},
	milestones: {
		0: {
			requirementDescription: "1 intelligence",
			effectDescription: "unlocks digit number upgrade autobuyer",
			toggles: [["d", "numberUpgradeAuto"]],
			done() { return player.i.points.gte(1) },
		},
		1: {
			requirementDescription: "2 intelligence",
			effectDescription: "unlocks Base Up autobuyer",
			toggles: [["d", "baseUpAuto"]],
			done() { return player.i.points.gte(2) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		2: {
			requirementDescription: "3 intelligence",
			effectDescription: "unlocks digit autobuyer",
			toggles: [["d", "digitAuto"]],
			done() { return player.i.points.gte(3) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		3: {
			requirementDescription: "4 intelligence",
			effectDescription: "digits reset nothing",
			done() { return player.i.points.gte(4) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		4: {
			requirementDescription: "5 intelligence",
			effectDescription: "unlocks Limit Break autobuyer",
			toggles: [["d", "limitBreakAuto"]],
			done() { return player.i.points.gte(5) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		5: {
			requirementDescription: "5 intelligence and 11,111 digits",
			effectDescription: "unlocks Simulation",
			done() { return player.i.points.gte(5) && player.d.points.gte(11111) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		6: {
			requirementDescription: "1,000,000 money",
			effectDescription: "unlocks Simulation autobuyer",
			toggles: [["i", "simAuto"]],
			done() { return player.i.money.gte(1000000) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		7: {
			requirementDescription: "6 intelligence",
			effectDescription: "unlocks 4 new Simulation upgrades",
			done() { return player.i.points.gte(6) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		8: {
			requirementDescription: "7 intelligence",
			effectDescription: "unlocks 3 new Replicator upgrades",
			done() { return player.i.points.gte(7) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		9: {
			requirementDescription: "8 intelligence and 20,000 digits",
			effectDescription: "unlocks Feats",
			done() { return player.i.points.gte(8) && player.d.points.gte(20000) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		10: {
			requirementDescription: "9 intelligence",
			effectDescription: "retain the first 10 digit milestones on intelligence resets",
			done() { return player.i.points.gte(9) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		11: {
			requirementDescription: "9 intelligence and 30,000 digits",
			effectDescription: "unlocks a new Feat",
			done() { return player.i.points.gte(9) && player.d.points.gte(30000) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		12: {
			requirementDescription: "11 intelligence and 3 Feat of History completions",
			effectDescription: "unlocks a new Feat",
			done() { return player.i.points.gte(11) && challengeCompletions('i', 12) >= 3 },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		13: {
			requirementDescription: "12 intelligence",
			effectDescription: "improve intelligence effect formula (10^x --> 100^x)",
			done() { return player.i.points.gte(12) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		14: {
			requirementDescription: "13 intelligence and 9 Feat of History completions",
			effectDescription: "improve intelligence effect formula (100^x --> 1,000^x)",
			done() { return player.i.points.gte(13) && challengeCompletions('i', 12) >= 9 },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		15: {
			requirementDescription: "13 intelligence and 15 Feat of History completions",
			effectDescription: "the intelligence effect also applies to roman numeral gain",
			done() { return player.i.points.gte(13) && challengeCompletions('i', 12) >= 15 },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		16: {
			requirementDescription: "15 intelligence",
			effectDescription: "retain the 19th digit milestone on intelligence resets",
			done() { return player.i.points.gte(15) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		17: {
			requirementDescription: "19 intelligence",
			effectDescription: "retain roman numeral upgrades on intelligence resets",
			done() { return player.i.points.gte(19) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		18: {
			requirementDescription: "20 intelligence",
			effectDescription: "you can buy max intelligence",
			done() { return player.i.points.gte(20) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		19: {
			requirementDescription: "27 intelligence",
			effectDescription: "retain calculator prefrences on intelligence resets",
			done() { return player.i.points.gte(27) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		20: {
			requirementDescription: "29 intelligence and 6 Feat of Binary completions",
			effectDescription: "unlocks a new Feat",
			done() { return player.i.points.gte(29) && challengeCompletions('i', 11) >= 6 },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		21: {
			requirementDescription: "30 intelligence and 7 Feat of Binary completions",
			effectDescription: "unlocks a new Feat",
			done() { return player.i.points.gte(30) && challengeCompletions('i', 11) >= 7 },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		22: {
			requirementDescription: "86 intelligence and 40 Feat of Time completions",
			effectDescription: "multiply the cap of Feat of Time by 2",
			done() { return player.i.points.gte(86) && challengeCompletions('i', 42) >= 40 },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
		23: {
			requirementDescription: "98 intelligence",
			effectDescription: "multiply the cap of Feat of Past and Present by 2",
			done() { return player.i.points.gte(98) },
			unlocked() { return hasMilestone('i', this.id - 1) || hasMilestone('i', this.id) },
		},
	},
	clickables: {
		11: {
			display() {
				if (getBuyableAmount('i', 11).gt(0)) return "<h2>replicate your units " + formatWhole(buyableEffect('i', 11)) + " times";
				return "<h2>replicate your units";
			},
			canClick() { return player.i.unlocked },
			onClick() {
				let power = new Decimal(2);
				if (getBuyableAmount('i', 31).gt(0)) power = power.mul(buyableEffect('i', 31));
				if (getBuyableAmount('i', 71).gt(0)) power = power.mul(buyableEffect('i', 71));
				if (getBuyableAmount('i', 11).gt(0)) power = power.pow(buyableEffect('i', 11));
				player.i.units = player.i.units.mul(power);
			},
		},
		21: {
			display() { return "<h2>mine " + format(player.i.raw_power) + " raw materials" },
			canClick() { return true },
			onClick() { player.i.raw = player.i.raw.add(player.i.raw_power).mul(1000).round().div(1000)},
			unlocked() { return hasMilestone('i', 5) },
		},
		22: {
			display() { return "<h2>process " + format(player.i.process_power) + " materials" },
			canClick() { return player.i.raw.gte(player.i.process_power) },
			onClick() {
				player.i.raw = player.i.raw.sub(player.i.process_power).mul(1e12).round().div(1e12);
				player.i.processed = player.i.processed.add(player.i.process_power).mul(1e12).round().div(1e12);
			},
			unlocked() { return hasMilestone('i', 5) },
		},
		23: {
			display() { return "<h3>craft " + format(player.i.craft_power) + " processed materials into " + formatWhole(player.i.craft_power.mul(player.i.craft_eff).div(5)) + " finished products" },
			canClick() { return player.i.processed.gte(player.i.craft_power) },
			onClick() {
				player.i.processed = player.i.processed.sub(player.i.craft_power).mul(1e12).round().div(1e12);
				player.i.products = player.i.products.add(player.i.craft_power.mul(player.i.craft_eff).div(5)).round();
			},
			unlocked() { return hasMilestone('i', 5) },
		},
		24: {
			display() { return "<h3>sell " + formatWhole(player.i.sell_power) + " finished products for " + format(player.i.sell_power.mul(player.i.sell_eff)) + " money" },
			canClick() { return player.i.products.gte(player.i.sell_power) },
			onClick() {
				player.i.products = player.i.products.sub(player.i.sell_power).round();
				player.i.money = player.i.money.add(player.i.sell_power.mul(player.i.sell_eff)).mul(1e12).round().div(1e12);
			},
			unlocked() { return hasMilestone('i', 5) },
		},
		31: {
			display() {
				if (!getClickableState(this.layer, this.id)) return "<h2>Feat of Space effect is on";
				return "<h2>Feat of Space effect is off";
			},
			canClick() { return true },
			onClick() {
				if (getClickableState(this.layer, this.id)) setClickableState(this.layer, this.id, false);
				else setClickableState(this.layer, this.id, true);
			},
			style() {
				let color = '#77bf5f';
				if (getClickableState(this.layer, this.id)) color = '#bf8f8f';
				return {'width':'595px','min-height':'40px','background-color':color,'color':'rgba(0, 0, 0, 0.5)','border':'4px solid rgba(0, 0, 0, 0.125)','border-radius':'20px','transform':'scale(1, 1)'};
			},
			unlocked() { return hasChallenge('i', 22) },
		},
	},
	buyables: {
		11: {
			cost() { return new Decimal('1e1000').pow(getBuyableAmount(this.layer, this.id)).mul('1e2000') },
			effect() { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Again</h3><br>`
					+ `Multiply the effect of the button to the right by 2<br>`
					+ `Currently: ` + formatWhole(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 5,
		},
		12: {
			cost() { return new Decimal('1e200').pow(getBuyableAmount(this.layer, this.id)).mul('1e2000') },
			effect() { return getBuyableAmount(this.layer, this.id).mul(0.075) },
			display() {
				return `<h3>More Effective</h3><br>`
					+ `Increase the unit effect exponent by 0.075<br>`
					+ `Currently: +` + format(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 20,
		},
		31: {
			cost() { return new Decimal('1e500').pow(getBuyableAmount(this.layer, this.id)).mul('1e2500') },
			effect() { return new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Power</h3><br>`
					+ `Multiply replication power by 1.1<br>`
					+ `Currently: ` + format(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
		},
		32: {
			cost() { return new Decimal('1e5900') },
			effect() { return new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Galaxies</h3><br>`
					+ `Unlock 5 more Limit Break upgrades<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 1,
		},
		33: {
			cost() { return new Decimal('1e250').pow(getBuyableAmount(this.layer, this.id)).mul('1e3000') },
			effect() { return getBuyableAmount(this.layer, this.id).mul(0.25) },
			display() {
				return `<h3>Efficiency</h3><br>`
					+ `Increase the unit effect exponent by 0.25<br>`
					+ `Currently: +` + format(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
		},
		41: {
			cost() {
				let mult = newDecimalOne();
				if (getBuyableAmount(this.layer, this.id).gte(1000)) mult = getBuyableAmount(this.layer, this.id).div(250).pow(1.5);
				return new Decimal(7.5).add(getBuyableAmount(this.layer, this.id).mul(2.5)).mul(mult);
			},
			effect() { return getBuyableAmount(this.layer, this.id).mul(0.1) },
			display() {
				return `<h3>Pickaxe Upgrade</h3><br>`
					+ `Increase the effect of the button above by 0.1<br>`
					+ `Currently: +` + format(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 2500, // 17500
			unlocked() { return hasMilestone('i', 5) },
		},
		42: {
			cost() {
				let mult = newDecimalOne();
				if (getBuyableAmount(this.layer, this.id).gte(1000)) mult = getBuyableAmount(this.layer, this.id).div(250).pow(1.5);
				return new Decimal(7.5).add(getBuyableAmount(this.layer, this.id).mul(2.5)).mul(mult);
			},
			effect() { return getBuyableAmount(this.layer, this.id).mul(0.2) },
			display() {
				return `<h3>Hotter Forges</h3><br>`
					+ `Increase the effect of the button above by 0.2<br>`
					+ `Currently: +` + format(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 2500, // 17500
			unlocked() { return hasMilestone('i', 5) },
		},
		43: {
			cost() {
				let mult = newDecimalOne();
				if (getBuyableAmount(this.layer, this.id).gte(1000)) mult = getBuyableAmount(this.layer, this.id).div(250).pow(1.5);
				return new Decimal(7.5).add(getBuyableAmount(this.layer, this.id).mul(2.5)).mul(mult);
			},
			effect() { return getBuyableAmount(this.layer, this.id).mul(4.5) },
			display() {
				return `<h3>Bulk Crafting</h3><br>`
					+ `Increase the capacity of the button above by 4.5 (and increase eff slightly)<br>`
					+ `Currently: +` + format(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 2500, // 17500
			unlocked() { return hasMilestone('i', 5) },
		},
		44: {
			cost() {
				let mult = newDecimalOne();
				if (getBuyableAmount(this.layer, this.id).gte(1000)) mult = getBuyableAmount(this.layer, this.id).div(250).pow(1.5);
				return new Decimal(7.5).add(getBuyableAmount(this.layer, this.id).mul(2.5)).mul(mult);
			},
			effect() { return getBuyableAmount(this.layer, this.id) },
			display() {
				return `<h3>Marketing</h3><br>`
					+ `Increase the capacity of the button above by 1 (and increase eff slightly)<br>`
					+ `Currently: +` + format(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 2500, // 17500
			unlocked() { return hasMilestone('i', 5) },
		},
		51: {
			cost() { return new Decimal(50).add(getBuyableAmount(this.layer, this.id).mul(10)) },
			effect() { return 5 / (1.5 ** getBuyableAmount(this.layer, this.id).toNumber()) },
			display() {
				if (getBuyableAmount(this.layer, this.id).eq(0)) {
					return `<h3>Buy Excavator</h3><br>`
						+ `Unlock auto for the button above<br>`
						+ `Increment: ` + formatTime(buyableEffect(this.layer, this.id)) + `<br><br>`
						+ `Cost: ` + format(this.cost()) + ` money<br>`
						+ `Amount: 0/` + formatWhole(this.purchaseLimit);
				};
				return `<h3>Buy Excavator</h3><br>`
					+ `Divide the auto increment of the button above by 1.5<br>`
					+ `Increment: ` + formatTime(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 25,
			unlocked() { return hasMilestone('i', 5) },
		},
		52: {
			cost() { return new Decimal(50).add(getBuyableAmount(this.layer, this.id).mul(10)) },
			effect() { return 5 / (1.5 ** getBuyableAmount(this.layer, this.id).toNumber()) },
			display() {
				if (getBuyableAmount(this.layer, this.id).eq(0)) {
					return `<h3>Hire Blacksmith</h3><br>`
						+ `Unlock auto for the button above<br>`
						+ `Increment: ` + formatTime(buyableEffect(this.layer, this.id)) + `<br><br>`
						+ `Cost: ` + format(this.cost()) + ` money<br>`
						+ `Amount: 0/` + formatWhole(this.purchaseLimit);
				};
				return `<h3>Hire Blacksmith</h3><br>`
					+ `Divide the auto increment of the button above by 1.5<br>`
					+ `Increment: ` + formatTime(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 25,
			unlocked() { return hasMilestone('i', 5) },
		},
		53: {
			cost() { return new Decimal(50).add(getBuyableAmount(this.layer, this.id).mul(10)) },
			effect() { return 30 / (1.5 ** getBuyableAmount(this.layer, this.id).toNumber()) },
			display() {
				if (getBuyableAmount(this.layer, this.id).eq(0)) {
					return `<h3>Buy Robot V2.0</h3><br>`
						+ `Unlock auto for the button above<br>`
						+ `Increment: ` + formatTime(buyableEffect(this.layer, this.id)) + `<br><br>`
						+ `Cost: ` + format(this.cost()) + ` money<br>`
						+ `Amount: 0/` + formatWhole(this.purchaseLimit);
				};
				return `<h3>Buy Robot V2.0</h3><br>`
					+ `Divide the auto increment of the button above by 1.5<br>`
					+ `Increment: ` + formatTime(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 30,
			unlocked() { return hasMilestone('i', 5) },
		},
		54: {
			cost() { return new Decimal(50).add(getBuyableAmount(this.layer, this.id).mul(10)) },
			effect() { return 30 / (1.5 ** getBuyableAmount(this.layer, this.id).toNumber()) },
			display() {
				if (getBuyableAmount(this.layer, this.id).eq(0)) {
					return `<h3>Hire Merchant</h3><br>`
						+ `Unlock auto for the button above<br>`
						+ `Increment: ` + formatTime(buyableEffect(this.layer, this.id)) + `<br><br>`
						+ `Cost: ` + format(this.cost()) + ` money<br>`
						+ `Amount: 0/` + formatWhole(this.purchaseLimit);
				};
				return `<h3>Hire Merchant</h3><br>`
					+ `Divide the auto increment of the button above by 1.5<br>`
					+ `Increment: ` + formatTime(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 30,
			unlocked() { return hasMilestone('i', 5) },
		},
		61: {
			cost() { return new Decimal(10).pow(getBuyableAmount(this.layer, this.id)).mul(1000000) },
			effect() { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Buy Dig Site</h3><br>`
					+ `Multiply the effect of the button above by 2<br>`
					+ `Currently: ` + format(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 10,
			unlocked() { return hasMilestone('i', 7) },
		},
		62: {
			cost() { return new Decimal(10).pow(getBuyableAmount(this.layer, this.id)).mul(1000000) },
			effect() { return new Decimal(1.75).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>More Forges</h3><br>`
					+ `Multiply the effect of the button above by 1.75<br>`
					+ `Currently: ` + format(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 10,
			unlocked() { return hasMilestone('i', 7) },
		},
		63: {
			cost() { return new Decimal(10).pow(getBuyableAmount(this.layer, this.id)).mul(1000000) },
			effect() { return new Decimal(1.25).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Better Formula</h3><br>`
					+ `Multiply the capacity of the button above and the score worth of finished products by 1.25<br>`
					+ `Currently: ` + format(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 10,
			unlocked() { return hasMilestone('i', 7) },
		},
		64: {
			cost() { return new Decimal(10).pow(getBuyableAmount(this.layer, this.id)).mul(1000000) },
			effect() { return new Decimal(2.25).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Advertising</h3><br>`
					+ `Multiply the capacity of the button above by 2.25<br>`
					+ `Currently: ` + format(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` money<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.i.money.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.i.money = player.i.money.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 10,
			unlocked() { return hasMilestone('i', 7) },
		},
		71: {
			cost() { return new Decimal('1e1000').pow(getBuyableAmount(this.layer, this.id)).mul('1e5000') },
			effect() { return new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Exponential</h3><br>`
					+ `Multiply replication power by 1.5<br>`
					+ `Currently: ` + format(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			unlocked() { return hasMilestone('i', 7) },
		},
		72: {
			cost() { return new Decimal('1e6200') },
			effect() { return new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Dimensions</h3><br>`
					+ `Unlock 5 more Limit Break upgrades<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 1,
			unlocked() { return hasMilestone('i', 7) },
		},
		73: {
			cost() { return new Decimal(1e250).pow(getBuyableAmount(this.layer, this.id)).mul('1e5000') },
			effect() { return new Decimal(10).pow(getBuyableAmount(this.layer, this.id)) },
			display() {
				return `<h3>Passivity</h3><br>`
					+ `Multiply your units by 10x every ` + formatTime(1) + `<br>`
					+ `Currently: ` + format(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			unlocked() { return hasMilestone('i', 7) },
		},
	},
	challenges: {
		11: {
			name: 'Feat of Binary',
			fullDisplay() {
				return 'Restriction: you cannot buy Base Ups<br>' + 'Goal: ' + format(new Decimal('1e100').pow(challengeCompletions(this.layer, this.id)).mul('1e1000')) + ' arabic numerals<br>Reward: increase <b>Up Even More</b>\'s cap by 1<br>Currently: +' + formatWhole(challengeEffect(this.layer, this.id)) + '<br>Completions: ' + formatWhole(challengeCompletions(this.layer, this.id)) + '/' + this.completionLimit();
			},
			rewardEffect() { return challengeCompletions(this.layer, this.id) },
			canComplete() { return player.points.gte(new Decimal('1e100').pow(challengeCompletions(this.layer, this.id)).mul('1e1000')) },
			doReset: true,
			style: {'width':'290px','height':'230px','border-radius':'20px'},
			marked: false,
			completionLimit() {
				let cap = 10;
				if (hasMilestone('gn', 11)) cap = cap * 2;
				return cap;
			},
			unlocked() { return hasMilestone('i', 9) },
		},
		12: {
			name: 'Feat of Limits',
			fullDisplay() {
				return 'Restriction: you can only buy the first Limit Break upgrade<br>' + 'Goal: ' + format(new Decimal('1e100').pow(challengeCompletions(this.layer, this.id)).mul('1e1100')) + ' arabic numerals<br>Reward: increase <b>Up the Up</b>\'s cap by 25<br>Currently: +' + formatWhole(challengeEffect(this.layer, this.id)) + '<br>Completions: ' + formatWhole(challengeCompletions(this.layer, this.id)) + '/' + this.completionLimit();
			},
			rewardEffect() { return new Decimal(challengeCompletions(this.layer, this.id)).mul(25) },
			canComplete() { return player.points.gte(new Decimal('1e100').pow(challengeCompletions(this.layer, this.id)).mul('1e1100')) },
			doReset: true,
			style: {'width':'290px','height':'230px','border-radius':'20px'},
			marked: false,
			completionLimit() {
				let cap = 10;
				if (hasMilestone('gn', 11)) cap = cap * 2;
				return cap;
			},
			unlocked() { return hasMilestone('i', 9) },
		},
		21: {
			name: 'Feat of History',
			fullDisplay() {
				return 'Restriction: you cannot gain roman numerals, but arabic numeral gain 750x<br>' + 'Goal: ' + format(new Decimal(200).pow(challengeCompletions(this.layer, this.id)).mul(1e13)) + ' arabic numerals<br>Reward: multiply roman numeral gain by 10,000<br>Currently: ' + formatWhole(challengeEffect(this.layer, this.id)) + 'x<br>Completions: ' + formatWhole(challengeCompletions(this.layer, this.id)) + '/' + this.completionLimit;
			},
			rewardEffect() { return new Decimal(10000).pow(challengeCompletions(this.layer, this.id)) },
			canComplete() { return player.points.gte(new Decimal(200).pow(challengeCompletions(this.layer, this.id)).mul(1e13)) },
			doReset: true,
			style: {'width':'290px','height':'230px','border-radius':'20px'},
			marked: false,
			completionLimit: 20,
			unlocked() { return hasMilestone('i', 9) },
		},
		22: {
			name: 'Feat of Space',
			fullDisplay() {
				return 'Restriction: the unit effect is disabled<br>' + 'Goal: ' + format(new Decimal('1e1000').pow(challengeCompletions(this.layer, this.id)).mul('1e4000')) + ' arabic numerals<br>Reward: multiply the unit effect exponent by 2<br>Currently: ' + formatWhole(challengeEffect(this.layer, this.id)) + 'x<br>Completions: ' + formatWhole(challengeCompletions(this.layer, this.id)) + '/' + this.completionLimit;
			},
			rewardEffect() { return new Decimal(2).pow(challengeCompletions(this.layer, this.id)) },
			canComplete() { return player.points.gte(new Decimal('1e1000').pow(challengeCompletions(this.layer, this.id)).mul('1e4000')) },
			doReset: true,
			style: {'width':'290px','height':'230px','border-radius':'20px'},
			marked: false,
			completionLimit: 3,
			unlocked() { return hasMilestone('i', 9) && hasMilestone('i', 11) },
		},
		31: {
			name: 'Feat of Dimensions',
			fullDisplay() {
				return 'Restrictions: Feat of Limits and Feat of Space\'s restrictions<br>' + 'Goal: ' + format(new Decimal('1e50').pow(challengeCompletions(this.layer, this.id)).mul('1e1200')) + ' arabic numerals<br>Reward: divide the intelligence cost requirement by 1.666<br>Currently: /' + format(challengeEffect(this.layer, this.id)) + '<br>Completions: ' + formatWhole(challengeCompletions(this.layer, this.id)) + '/' + this.completionLimit();
			},
			rewardEffect() { return new Decimal(1.666).pow(challengeCompletions(this.layer, this.id)) },
			canComplete() { return player.points.gte(new Decimal('1e50').pow(challengeCompletions(this.layer, this.id)).mul('1e1200')) },
			doReset: true,
			countsAs: [12, 22],
			style: {'width':'290px','height':'230px','border-radius':'20px'},
			marked: false,
			completionLimit() {
				let cap = 15;
				if (hasMilestone('gn', 11)) cap = cap * 2;
				return cap;
			},
			unlocked() { return hasMilestone('i', 9) && hasMilestone('i', 12) },
		},
		32: {
			name: 'Feat of Forgotten History',
			fullDisplay() {
				return 'Restrictions: Feat of History\'s restriction and Studies are useless<br>' + 'Goal: ' + format(new Decimal(1e5).pow(challengeCompletions(this.layer, this.id)).mul(1e50)) + ' arabic numerals<br>Reward: divide the intelligence cost requirement by 2<br>Currently: /' + format(challengeEffect(this.layer, this.id)) + '<br>Completions: ' + formatWhole(challengeCompletions(this.layer, this.id)) + '/' + this.completionLimit;
			},
			rewardEffect() { return new Decimal(2).pow(challengeCompletions(this.layer, this.id)) },
			canComplete() { return player.points.gte(new Decimal(1e5).pow(challengeCompletions(this.layer, this.id)).mul(1e50)) },
			doReset: true,
			countsAs: [21],
			style: {'width':'290px','height':'230px','border-radius':'20px'},
			marked: false,
			completionLimit: 10,
			unlocked() { return hasMilestone('i', 9) && hasMilestone('gn', 4) },
		},
		41: {
			name: 'Feat of Past and Present',
			fullDisplay() {
				return 'Restrictions: Feat of Binary and Feat of Forgotten History\'s restrictions<br>' + 'Goal: ' + format(new Decimal(1e25).pow(challengeCompletions(this.layer, this.id)).mul(1e200)) + ' arabic numerals<br>Reward: divide the intelligence cost requirement by 1.5<br>Currently: /' + format(challengeEffect(this.layer, this.id)) + '<br>Completions: ' + formatWhole(challengeCompletions(this.layer, this.id)) + '/' + this.completionLimit();
			},
			rewardEffect() { return new Decimal(1.5).pow(challengeCompletions(this.layer, this.id)) },
			canComplete() { return player.points.gte(new Decimal(1e25).pow(challengeCompletions(this.layer, this.id)).mul(1e200)) },
			doReset: true,
			countsAs: [11, 21, 32],
			style: {'width':'290px','height':'230px','border-radius':'20px'},
			marked: false,
			completionLimit() {
				let cap = 10;
				if (hasMilestone('i', 23)) cap = cap * 2;
				if (hasMilestone('gn', 11)) cap = cap * 2;
				return cap;
			},
			unlocked() { return hasMilestone('i', 9) && hasMilestone('i', 20) },
		},
		42: {
			name: 'Feat of Time',
			fullDisplay() {
				return 'Restrictions: all previous intelligence Feat restrictions<br>' + 'Goal: ' + format(new Decimal(1e10).pow(challengeCompletions(this.layer, this.id)).mul(1e240)) + ' arabic numerals<br>Reward: divide the intelligence cost requirement by 1.75<br>Currently: /' + format(challengeEffect(this.layer, this.id)) + '<br>Completions: ' + formatWhole(challengeCompletions(this.layer, this.id)) + '/' + this.completionLimit();
			},
			rewardEffect() { return new Decimal(1.75).pow(challengeCompletions(this.layer, this.id)) },
			canComplete() { return player.points.gte(new Decimal(1e10).pow(challengeCompletions(this.layer, this.id)).mul(1e240)) },
			doReset: true,
			countsAs: [11, 12, 21, 22, 31, 32, 41],
			style: {'width':'290px','height':'230px','border-radius':'20px'},
			marked: false,
			completionLimit() {
				let cap = 20;
				if (hasMilestone('i', 22)) cap = cap * 2;
				if (hasMilestone('gn', 11)) cap = cap * 2;
				if (getBuyableAmount('gn', 14).gt(0)) cap = cap * buyableEffect('gn', 14).toNumber();
				return Math.round(cap);
			},
			unlocked() { return hasMilestone('i', 9) && hasMilestone('i', 12) },
		},
	},
});

addLayer('gn', {
	name: 'greek numerals',
	symbol: 'GN',
	row: 1,
	position: 0,
	tooltip() { return greekNumeralFormat(player.gn.points) + ' greek numerals' },
	startData() { return {
		unlocked: false,
		points: newDecimalZero(),
		best: newDecimalZero(),
		bestOnce: newDecimalZero(),
		total: newDecimalZero(),
		calc: true,
		calcTier: newDecimalZero(),
		tierMeta: '',
	}},
	color: '#e0a020',
	resource: 'greek numerals',
	baseResource: 'roman numerals',
	baseAmount() { return player.rn.points },
	requires: new Decimal('1e6600'),
	type: 'normal',
	exponent: 0.04,
	directMult() {
		let gain = newDecimalOne();
		if (hasUpgrade('gn', 13) && !inChallenge('i', 32)) gain = gain.mul(upgradeEffect('gn', 13));
		if (hasUpgrade('gn', 14) && !inChallenge('i', 32)) gain = gain.mul(upgradeEffect('gn', 14));
		if (hasUpgrade('gn', 24) && !inChallenge('i', 32)) gain = gain.mul(upgradeEffect('gn', 24));
		return gain;
	},
	softcap: new Decimal(100),
	softcapPower: 0.001,
	onPrestige(gain) { if (gain.gt(player.gn.bestOnce)) player.gn.bestOnce = gain },
	prestigeButtonText() {
		let resetGain = new Decimal(tmp.gn.resetGain), text = '';
		if (player.gn.points.lt(1e3)) text = 'Reset for ';
		text += '+<b>' + greekNumeralFormat(resetGain) + '</b> greek numerals';
		if (resetGain.lt(100) && player.gn.points.lt(1e3)) text += '<br><br>Next at ' + romanNumeralFormat(tmp.gn.nextAt) + ' roman numerals';
		return text;
	},
	hotkeys: [{
		key: 'g', // Use uppercase if it's combined with shift, or 'ctrl+x' for holding down ctrl.
		description: 'G: reset for greek numerals',
		onPress() { if (player.i.unlocked) doReset('i') },
	}],
	layerShown() { return hasMilestone('i', 9) || player.gn.unlocked },
	tabFormat: {
		"Milestones": {
			content: [
				['display-text', () => {
					if (player.gn.points.gte('1e1000')) return '<h2 class="layer-gn">' + greekNumeralFormat(player.rn.points) + '</h2> greek numerals';
					return 'You have <h2 class="layer-gn">' + greekNumeralFormat(player.gn.points) + '</h2> greek numerals';
				}],
				'blank',
				'prestige-button',
				['blank', '3px'],
				['display-text', () => {
					let text = 'You have ' + romanNumeralFormat(player.rn.points) + ' roman numerals<br>';
					if (tmp.gn.passiveGeneration) text += 'You are gaining ' + greekNumeralFormat(tmp.gn.resetGain.mul(tmp.gn.passiveGeneration)) + ' greek numerals per second<br>';
					text += '<br>Your best greek numerals is ' + greekNumeralFormat(player.gn.best) + '<br>';
					text += 'Your best greek numerals in one reset is ' + greekNumeralFormat(player.gn.bestOnce) + '<br>';
					text += 'You have made a total of ' + greekNumeralFormat(player.gn.total) + ' greek numerals';
					return text;
				}],
				'milestones',
			],
		},
		"Studies": {
			content: [
				['display-text', () => {
					if (player.gn.points.gte('1e1000')) return '<h2 class="layer-gn">' + greekNumeralFormat(player.rn.points) + '</h2> greek numerals';
					return 'You have <h2 class="layer-gn">' + greekNumeralFormat(player.gn.points) + '</h2> greek numerals';
				}],
				'blank',
				'prestige-button',
				['blank', '3px'],
				['display-text', () => {
					let text = 'You have ' + romanNumeralFormat(player.rn.points) + ' roman numerals<br>';
					if (tmp.gn.passiveGeneration) text += 'You are gaining ' + greekNumeralFormat(tmp.gn.resetGain.mul(tmp.gn.passiveGeneration)) + ' greek numerals per second<br>';
					text += '<br>Your best greek numerals is ' + greekNumeralFormat(player.gn.best) + '<br>';
					text += 'Your best greek numerals in one reset is ' + greekNumeralFormat(player.gn.bestOnce) + '<br>';
					text += 'You have made a total of ' + greekNumeralFormat(player.gn.total) + ' greek numerals';
					return text;
				}],
				'upgrades',
				'clickables',
				'blank',
			],
		},
		"Comprehension": {
			content: [
				['display-text', () => {
					if (player.gn.points.gte('1e1000')) return '<h2 class="layer-gn">' + greekNumeralFormat(player.rn.points) + '</h2> greek numerals';
					return 'You have <h2 class="layer-gn">' + greekNumeralFormat(player.gn.points) + '</h2> greek numerals';
				}],
				'blank',
				'prestige-button',
				['blank', '3px'],
				['display-text', () => {
					let text = 'You have ' + romanNumeralFormat(player.rn.points) + ' roman numerals<br>';
					if (tmp.gn.passiveGeneration) text += 'You are gaining ' + greekNumeralFormat(tmp.gn.resetGain.mul(tmp.gn.passiveGeneration)) + ' greek numerals per second<br>';
					text += '<br>Your best greek numerals is ' + greekNumeralFormat(player.gn.best) + '<br>';
					text += 'Your best greek numerals in one reset is ' + greekNumeralFormat(player.gn.bestOnce) + '<br>';
					text += 'You have made a total of ' + greekNumeralFormat(player.gn.total) + ' greek numerals<br><br>';
					text += 'Your translation tier is <h2 class="layer-gn">' + formatWhole(player.gn.calcTier) + '</h2><br>';
					text += 'formula: ' + player.gn.tierMeta;
					return text;
				}],
				'blank',
				'buyables',
				'blank',
			],
			unlocked() { return hasMilestone('gn', 15) },
		},
	},
	update(diff) {
		let tier = newDecimalZero();
		let meta = '';
		// set
		if (hasUpgrade('gn', 15) && !inChallenge('i', 32)) tier = newDecimalOne();
		if (hasUpgrade('gn', 25) && !inChallenge('i', 32)) tier = new Decimal(2);
		meta += formatWhole(tier);
		// add
		if (hasMilestone('gn', 5)) tier = tier.add(1);
		if (hasMilestone('gn', 6)) tier = tier.add(1);
		if (hasMilestone('gn', 7)) tier = tier.add(1);
		if (hasMilestone('gn', 8)) tier = tier.add(1);
		if (hasMilestone('gn', 9)) tier = tier.add(1);
		if (hasMilestone('gn', 10)) tier = tier.add(1);
		if (hasMilestone('gn', 12)) tier = tier.add(1);
		if (hasMilestone('gn', 14)) tier = tier.add(1);
		if (getBuyableAmount('gn', 11).gt(0)) tier = tier.add(buyableEffect('gn', 11));
		if (tier.sub(meta).gt(0)) meta += '+' + format(tier.sub(meta));
		// mul
		let mul = newDecimalOne();
		let eff = new Decimal(2);
		if (getBuyableAmount('gn', 12).gt(0)) {
			eff = eff.add(buyableEffect('gn', 12));
		};
		if (hasUpgrade('gn', 35) && !inChallenge('i', 32)) {
			tier = tier.mul(eff);
			mul = mul.mul(eff);
			meta = '(' + meta + ')*' + format(mul);
		};
		// pow
		eff = new Decimal(2);
		if (getBuyableAmount('gn', 13).gt(0)) {
			eff = eff.add(buyableEffect('gn', 13));
		};
		if (hasMilestone('gn', 13)) {
			tier = tier.pow(eff);
			meta = '(' + meta + ')^' + format(eff);
		};
		player.gn.tierMeta = meta;
		player.gn.calcTier = tier.round();
	},
	milestones: {
		0: {
			requirementDescription() { return greekNumeralFormat(200) + " greek numerals" },
			effectDescription: "retain the first 10 digit milestones on greek numeral resets",
			done() { return player.gn.points.gte(200) },
		},
		1: {
			requirementDescription() { return greekNumeralFormat(500) + " greek numerals and " + greekNumeralFormat(136) + " greek numerals in one reset" },
			effectDescription: "retain roman numeral upgrades on greek numeral resets",
			done() { return player.gn.points.gte(500) && player.gn.bestOnce.gte(136) },
		},
		2: {
			requirementDescription() { return greekNumeralFormat(750) + " greek numerals and " + greekNumeralFormat(140) + " greek numerals in one reset" },
			effectDescription: "retain calculator prefrences on greek numeral resets",
			done() { return player.gn.points.gte(750) && player.gn.bestOnce.gte(140) },
		},
		3: {
			requirementDescription() { return greekNumeralFormat(1000) + " greek numerals and " + greekNumeralFormat(200) + " greek numerals in one reset" },
			effectDescription: "retain the 19th digit milestone on greek numeral resets",
			done() { return player.gn.points.gte(1000) && player.gn.bestOnce.gte(200) },
		},
		4: {
			requirementDescription() { return greekNumeralFormat(2000) + " greek numerals and " + greekNumeralFormat(220) + " greek numerals in one reset" },
			effectDescription: "unlock a new Feat",
			done() { return player.gn.points.gte(2000) && player.gn.bestOnce.gte(220) },
		},
		5: {
			requirementDescription() { return greekNumeralFormat(2500) + " greek numerals and " + greekNumeralFormat(250) + " greek numerals in one reset" },
			effectDescription: "gain a free translation tier",
			done() { return player.gn.points.gte(2500) && player.gn.bestOnce.gte(250) },
		},
		6: {
			requirementDescription() { return greekNumeralFormat(3000) + " greek numerals and " + greekNumeralFormat(300) + " greek numerals in one reset" },
			effectDescription: "gain a free translation tier",
			done() { return player.gn.points.gte(3000) && player.gn.bestOnce.gte(300) },
		},
		7: {
			requirementDescription() { return greekNumeralFormat(6000) + " greek numerals and " + greekNumeralFormat(666) + " greek numerals in one reset" },
			effectDescription: "gain a free translation tier",
			done() { return player.gn.points.gte(6000) && player.gn.bestOnce.gte(666) },
		},
		8: {
			requirementDescription() { return greekNumeralFormat(7500) + " greek numerals and " + greekNumeralFormat(750) + " greek numerals in one reset" },
			effectDescription: "gain a free translation tier",
			done() { return player.gn.points.gte(7500) && player.gn.bestOnce.gte(750) },
		},
		9: {
			requirementDescription() { return greekNumeralFormat(8750) + " greek numerals and " + greekNumeralFormat(875) + " greek numerals in one reset" },
			effectDescription: "gain a free translation tier",
			done() { return player.gn.points.gte(8750) && player.gn.bestOnce.gte(875) },
		},
		10: {
			requirementDescription() { return greekNumeralFormat(10000) + " greek numerals and " + greekNumeralFormat(1000) + " greek numerals in one reset" },
			effectDescription: "gain a free translation tier",
			done() { return player.gn.points.gte(10000) && player.gn.bestOnce.gte(1000) },
		},
		11: {
			requirementDescription() { return greekNumeralFormat(20000) + " greek numerals and " + greekNumeralFormat(1111) + " greek numerals in one reset" },
			effectDescription: "multiply the caps of Feats of Binary, Limits, Dimesions, Past and Present, and Time by 2",
			done() { return player.gn.points.gte(20000) && player.gn.bestOnce.gte(1111) },
		},
		12: {
			requirementDescription() { return greekNumeralFormat(30000) + " greek numerals and " + greekNumeralFormat(2000) + " greek numerals in one reset" },
			effectDescription: "gain a free translation tier",
			done() { return player.gn.points.gte(30000) && player.gn.bestOnce.gte(2000) },
		},
		13: {
			requirementDescription() { return greekNumeralFormat(40000) + " greek numerals and " + greekNumeralFormat(2222) + " greek numerals in one reset" },
			effectDescription: "translation tiers are squared",
			done() { return player.gn.points.gte(40000) && player.gn.bestOnce.gte(2222) },
		},
		14: {
			requirementDescription() { return greekNumeralFormat(200000) + " greek numerals and " + greekNumeralFormat(20000) + " greek numerals in one reset" },
			effectDescription: "gain a free translation tier",
			done() { return player.gn.points.gte(200000) && player.gn.bestOnce.gte(20000) },
		},
		15: {
			requirementDescription() { return greekNumeralFormat(250000) + " greek numerals and " + greekNumeralFormat(25000) + " greek numerals in one reset" },
			effectDescription: "unlock Comprehension",
			done() { return player.gn.points.gte(250000) && player.gn.bestOnce.gte(25000) },
		},
		16: {
			requirementDescription() { return greekNumeralFormat(2000000) + " greek numerals and " + greekNumeralFormat(200000) + " greek numerals in one reset" },
			effectDescription: "unlocks Replication autobuyer",
			toggles: [["i", "replicateAuto"]],
			done() { return player.gn.points.gte(2000000) && player.gn.bestOnce.gte(200000) },
		},
		17: {
			requirementDescription() { return greekNumeralFormat(10000000) + " greek numerals and " + greekNumeralFormat(1000000) + " greek numerals in one reset" },
			effectDescription: "retain digit milestones on greek numeral resets",
			done() { return player.gn.points.gte(10000000) && player.gn.bestOnce.gte(1000000) },
		},
	},
	upgrades: {
		11: {
			fullDisplay() {
				let text = `<h3>Greek Know-How</h3><br>
					multiply arabic numeral gain based on the amount of greek numerals you have<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return new Decimal(10).pow(player.gn.points.add(1).pow(0.5)) },
			cost: newDecimalOne(),
		},
		12: {
			fullDisplay() {
				let text = `<h3>Greek Digits</h3><br>
					multiply the digit limit based on the amount of greek numerals you have<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.gn.points.add(1).pow(0.05) },
			cost: new Decimal(250),
		},
		13: {
			fullDisplay() {
				let text = `<h3>Greek IQ</h3><br>
					multiply greek numeral gain based on the amount of intelligence you have<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.i.points.add(1).pow(0.1) },
			cost: new Decimal(500),
		},
		14: {
			fullDisplay() {
				let text = `<h3>Greek Diplomacy</h3><br>
					multiply greek numeral gain based on your best roman numerals<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.rn.best.add(1).log10().add(1).pow(0.05) },
			cost: new Decimal(1000),
		},
		15: {
			fullDisplay() {
				let text = `<h3>Process of Elimination</h3><br>
					unlock translation tier 1<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			cost: new Decimal(2000),
		},
		21: {
			fullDisplay() {
				let text = `<h3>Greek Markets</h3><br>
					increase the cap of <b>Cheapest</b> based on the amount of greek numerals you have<br>
					Currently: +` + formatWhole(this.effect()) + `<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.gn.points.add(1).pow(0.75).round() },
			cost: new Decimal(1250),
			unlocked() { return player.gn.upgrades.length >= 5 },
		},
		22: {
			fullDisplay() {
				let text = `<h3>Greek Multiplication</h3><br>
					increase the cap of <b>Triple</b> based on the amount of greek numerals you have<br>
					Currently: +` + formatWhole(this.effect()) + `<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.gn.points.add(1).pow(0.5).round() },
			cost: new Decimal(1500),
			unlocked() { return player.gn.upgrades.length >= 5 },
		},
		23: {
			fullDisplay() {
				let text = `<h3>Greek Counting</h3><br>
					multiply the digit limit based on the amount of greek numerals you have<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.gn.points.add(1).pow(0.03) },
			cost: new Decimal(2500),
			unlocked() { return player.gn.upgrades.length >= 5 },
		},
		24: {
			fullDisplay() {
				let text = `<h3>Greek Dictionary</h3><br>
					multiply greek numeral gain based on your translation tier<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.gn.calcTier.add(1).pow(0.5) },
			cost: new Decimal(5000),
			unlocked() { return player.gn.upgrades.length >= 5 },
		},
		25: {
			fullDisplay() {
				let text = `<h3>Ask the Locals</h3><br>
					unlock translation tier 2<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			cost: new Decimal(4500),
			unlocked() { return player.gn.upgrades.length >= 5 },
		},
		31: {
			fullDisplay() {
				let text = `<h3>Greek Geometry</h3><br>
					multiply the digit limit based on the amount of greek numerals you have<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.gn.points.add(1).pow(0.02) },
			cost: new Decimal(7500),
			unlocked() { return player.gn.upgrades.length >= 10 },
		},
		32: {
			fullDisplay() { // may need to be changed to bulk? not sure
				let text = `<h3>Greek Markets</h3><br>
					all digit autobuyers can buy 2x as fast<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			cost: new Decimal(10000),
			unlocked() { return player.gn.upgrades.length >= 10 },
		},
		33: {
			fullDisplay() {
				let text = `<h3>Greek EQ</h3><br>
					divide the intelligence cost requirement based on your translation tier<br>
					Currently: /` + format(this.effect()) + `<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.gn.calcTier.add(1).pow(0.5) },
			cost: new Decimal(20000),
			unlocked() { return player.gn.upgrades.length >= 10 },
		},
		34: {
			fullDisplay() {
				let text = `<h3>Greek Trigonometry</h3><br>
					multiply the digit limit based on the amount of greek numerals you have<br>
					Currently: ` + format(this.effect()) + `x<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			effect() { return player.gn.points.add(1).pow(0.1) },
			cost: new Decimal(30000),
			unlocked() { return player.gn.upgrades.length >= 10 },
		},
		35: {
			fullDisplay() {
				let text = `<h3>Linguistics Class</h3><br>
					double translation tiers<br><br>
					Cost: ` + greekNumeralFormat(this.cost) + ` greek numerals`;
				if (player.nerdMode) text += '';
				return text;
			},
			cost: new Decimal(100000),
			unlocked() { return player.gn.upgrades.length >= 10 },
		},
	},
	clickables: {
		11: {
			display() {
				if (player.gn.calc) return '<h3>turn<br>translator<br>off</h3><br>your translation tier is ' + formatWhole(player.gn.calcTier);
				return '<h3>turn<br>translator<br>on</h3><br>your translation tier is ' + formatWhole(player.gn.calcTier);
			},
			canClick() {
				return true;
			},
			onClick() {
				player.gn.calc = !player.gn.calc;
			},
			unlocked() { return hasUpgrade('gn', 15) && !inChallenge('i', 32) },
		},
	},
	buyables: {
		11: {
			cost() { return new Decimal('1e3000').pow(getBuyableAmount(this.layer, this.id)).mul('1e30000') },
			effect() {
				let eff = getBuyableAmount(this.layer, this.id).mul(1.1);
				return eff;
			},
			display() {
				return `<h3>Addition</h3><br>`
					+ `Increase the addition factor in the translation formula by 1.1<br>`
					+ `Currently: +` + format(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 10,
			unlocked() { return hasMilestone('gn', 15) },
		},
		12: {
			cost() { return new Decimal('1e5000').pow(getBuyableAmount(this.layer, this.id)).mul('1e35000') },
			effect() {
				let eff = getBuyableAmount(this.layer, this.id).mul(0.75);
				return eff;
			},
			display() {
				return `<h3>Multiplication</h3><br>`
					+ `Increase the multiplication factor in the translation formula by 0.75<br>`
					+ `Currently: +` + format(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 10,
			unlocked() { return hasMilestone('gn', 15) },
		},
		13: {
			cost() { return new Decimal('1e7500').pow(getBuyableAmount(this.layer, this.id)).mul('1e37500') },
			effect() {
				let eff = getBuyableAmount(this.layer, this.id).mul(0.2);
				return eff;
			},
			display() {
				return `<h3>Exponential</h3><br>`
					+ `Increase the exponential factor in the translation formula by 0.2<br>`
					+ `Currently: +` + format(buyableEffect(this.layer, this.id)) + `<br><br>`
					+ `Cost: ` + format(this.cost()) + ` arabic numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id)) + `/` + formatWhole(this.purchaseLimit);
			},
			canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
			buy() {
				player.points = player.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			purchaseLimit: 5,
			unlocked() { return hasMilestone('gn', 15) },
		},
		14: {
			cost() { return new Decimal(10).pow(getBuyableAmount(this.layer, this.id)).mul(1000000) },
			effect() {
				let eff = new Decimal(1.2).pow(getBuyableAmount(this.layer, this.id));
				return eff;
			},
			display() {
				return `<h3>Time Path</h3><br>`
					+ `Multiply the cap of Feat of Time by 1.2<br>`
					+ `Currently: ` + format(buyableEffect(this.layer, this.id)) + `x<br><br>`
					+ `Cost: ` + format(this.cost()) + ` greek numerals<br>`
					+ `Amount: ` + formatWhole(getBuyableAmount(this.layer, this.id));
			},
			canAfford() { return player.gn.points.gte(this.cost()) },
			buy() {
				player.gn.points = player.gn.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style: {'width':'120px','height':'120px'},
			unlocked() { return hasMilestone('gn', 15) },
		},
	},
});
