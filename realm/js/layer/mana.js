function getSpellIndex(index) {
	if (index === 2) {
		if (hasUpgrade("F", 12)) {
			index = 3;
		} else if (!hasUpgrade("F", 11)) {
			index = -1;
		};
	};
	return index;
};

function getSpellCost(index) {
	let cost = new Decimal([80, 160, 120][index]);
	if (hasFactionUpgrade(1, 1, 2)) cost = cost.mul(3);
	return cost;
};

function getSpellEffect(index, second = false) {
	let eff = tmp.M.clickables[index + 11][`baseEffect${second ? "2" : ""}`];
	if (index === 2) {
		if (hasFactionUpgrade(0, 1, 5)) eff = eff.mul(factionUpgradeEffect(0, 1));
	};
	if (hasFactionUpgrade(1, 1, 2)) eff = eff.mul(2);
	return eff;
};

const baseSpellDuration = [0, 30, 15, 15].map(x => new Decimal(x));

function castSpell(index, amt = newDecimalOne()) {
	const cost = getSpellCost(index);
	if (index === 0) {
		player.M.mana = player.M.mana.sub(cost.mul(amt));
		player.stats.forEach(obj => obj.casts[0] = obj.casts[0].add(amt));
		let gain = tmp.pointGen.mul(clickableEffect("M", 11));
		if (hasUpgrade("M", 23)) gain = gain.add(player.clickValue.mul(getSpellEffect(0, true)));
		gain = gain.mul(amt);
		player.points = player.points.add(gain);
		player.stats.forEach(obj => obj.total = obj.total.add(gain));
	} else {
		player.M.spellTimes[index] = baseSpellDuration[index];
		player.M.mana = player.M.mana.sub(cost);
		index = getSpellIndex(index);
		if (index >= 0) player.stats.forEach(obj => obj.casts[index] = obj.casts[index].add(1));
	};
};

const spellName = ["Time Bending", "Equalization", "Holy Light", "Blood Frenzy"];

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
		spellOrder: [],
		autoPercent: 100,
	}},
	color: "#0080E0",
	type: "none",
	prestigeNotify() { return player.M.mana.gte(player.M.maxMana) && tmp.pointGen instanceof Decimal && (tmp.pointGen.gt(0) || player.M.mana.gt(getSpellCost(1)) || (tmp.M.clickables[13].unlocked && player.M.mana.gt(getSpellCost(2)))) },
	tooltip() { return format(player.M.mana) + "/" + format(player.M.maxMana) + " mana" },
	update(diff) {
		// mana regen buffs
		let manaRegen = new Decimal(2.5);
		if (hasUpgrade("M", 12)) manaRegen = manaRegen.add(upgradeEffect("M", 12));
		if (hasUpgrade("M", 14)) manaRegen = manaRegen.add(upgradeEffect("M", 14));
		if (hasUpgrade("M", 22)) manaRegen = manaRegen.add(upgradeEffect("M", 22));
		if (hasFactionUpgrade(1, 2, 0)) manaRegen = manaRegen.mul(factionUpgradeEffect(1, 2));
		if (hasFactionUpgrade(0, 1, 2)) manaRegen = manaRegen.mul(factionUpgradeEffect(0, 1));
		if (hasFactionUpgrade(1, 1, 5)) manaRegen = manaRegen.mul(factionUpgradeEffect(1, 1));
		if (hasUpgrade("G", 13)) manaRegen = manaRegen.mul(upgradeEffect("G", 13));
		player.M.manaRegen = manaRegen;
		// max mana buffs
		let maxMana = new Decimal(100);
		if (hasFactionUpgrade(0, 0, 2)) maxMana = maxMana.mul(factionUpgradeEffect(0, 0));
		if (hasFactionUpgrade(1, 0, 2)) maxMana = maxMana.mul(factionUpgradeEffect(1, 0));
		if (hasFactionUpgrade(1, 1, 5)) maxMana = maxMana.mul(factionUpgradeEffect(1, 1));
		if (hasUpgrade("M", 11)) maxMana = maxMana.mul(upgradeEffect("M", 11));
		if (hasUpgrade("M", 13)) maxMana = maxMana.mul(upgradeEffect("M", 13));
		if (hasUpgrade("M", 21)) maxMana = maxMana.mul(upgradeEffect("M", 21));
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
			const newTime = player.M.spellTimes[index].sub(diff).max(0);
			const diffTime = player.M.spellTimes[index].sub(newTime);
			if (diffTime.gt(0)) {
				player.M.spellTimes[index] = newTime;
				const spellIndex = getSpellIndex(index);
				if (spellIndex >= 0) player.stats.forEach(obj => obj.spellTimes[spellIndex] = obj.spellTimes[spellIndex].add(diffTime));
			};
		};
		// autocasting
		const isOrdered = hasUpgrade("M", 102);
		for (let index = 0; index < player.M[isOrdered ? "spellOrder" : "spellTimes"].length; index++) {
			const spellIndex = (isOrdered ? player.M.spellOrder[index] : index);
			const cost = getSpellCost(spellIndex);
			if (player.M.spellTimes[spellIndex].lte(0) && player.M.mana.gte(cost)) {
				if (getClickableState("M", spellIndex + 11) === 1) {
					castSpell(spellIndex, player.M.mana.div(cost).floor());
				} else if (getClickableState("M", spellIndex + 11) === 2 && player.M.mana.gte(player.M.maxMana.mul(player.M.autoPercent / 100))) {
					let amt = player.M.mana.sub(player.M.maxMana.mul(player.M.autoPercent / 100)).div(cost).floor();
					if (player.M.mana.sub(amt.mul(cost)).gte(cost)) amt = amt.add(1);
					castSpell(spellIndex, amt);
				};
			};
		};
	},
	tabFormat() {
		const content = [["bar", "mana"]];
		if (hasUpgrade("M", 103)) content.push("blank", "mana-auto-percent-slider");
		content.push("blank");
		const row = [["column", [["clickable", 11, {"min-height": "100px", height: "100px"}], ["max-spell-cast", 11], ["autocast-toggle", 11]], {margin: "0 7px"}]];
		for (let index = 1; tmp.M.clickables[index + 11]?.unlocked; index++) {
			row.push(["column", [["clickable", index + 11], ["autocast-toggle", index + 11]], {margin: "0 7px"}]);
		};
		content.push(["row", row]);
		content.push("blank");
		content.push(["upgrades", [1, 2]]);
		content.push(["upgrades", [10]]);
		return content;
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
			display() { return `You have <b>${format(player.M.mana)}/${format(player.M.maxMana)}</b> mana<br>(${format(player.M.manaRegen)}/s)` },
			fillStyle() { return {"background-color": tmp.M.color} },
			borderStyle() { return {"border-color": tmp.M.color} },
			progress() { return player.M.mana.div(player.M.maxMana) },
		},
	},
	clickables: (() => {
		const data = {
			11: {
				display() {
					let gain = tmp.pointGen.mul(clickableEffect("M", this.id));
					if (hasUpgrade("M", 23)) {
						let eff2 = getSpellEffect(this.id - 11, true);
						gain = gain.add(player.clickValue.mul(eff2));
						return `get coins equal to ${formatWhole(clickableEffect("M", this.id))}x coins/sec and ${formatWhole(eff2)}x coins/click<br><br>Effect: +${format(gain)}<br><br>Cost: ${formatWhole(getSpellCost(this.id - 11))} mana</span>`;
					};
					return `get coins equal to ${formatWhole(clickableEffect("M", this.id))} seconds of coins/sec<br><br>Effect: +${format(gain)}<br><br>Cost: ${formatWhole(getSpellCost(this.id - 11))} mana</span>`;
				},
				baseEffect: new Decimal(30),
				baseEffect2: new Decimal(10),
			},
			12: {
				display() { return `boost all coin production based on your components for 30 seconds<br>Time left: ${formatTime(player.M.spellTimes[1])}<br><br>Effect: ${format(clickableEffect("M", this.id))}x<br><br>Cost: ${formatWhole(getSpellCost(this.id - 11))} mana` },
				baseEffect() { return player.C.points.add(1).pow(hasUpgrade("M", 24) ? 0.2 : 0.15) },
			},
			13: {
				display() { return `boost ${["coins/click", "coins/sec", "all coin production"].find((_, index) => hasUpgrade("F", index + 11))} based on your mana for 15 seconds<br>Time left: ${formatTime(player.M.spellTimes[2])}<br><br>Effect: ${format(clickableEffect("M", this.id))}x<br><br>Cost: ${formatWhole(getSpellCost(this.id - 11))} mana` },
				baseEffect() { return player.M.mana.add(1).pow(0.25) },
				color: getSideColor,
				unlocked: hasChosenSide,
			},
		};
		for (let index = 0; index < 3; index++) {
			data[index + 11].title = () => spellName[getSpellIndex(index)];
			data[index + 11].effect = () => getSpellEffect(index);
			data[index + 11].canClick = () => player.M.spellTimes[index].lte(0) && player.M.mana.gte(getSpellCost(index));
			data[index + 11].onClick = () => castSpell(index);
			if (!data[index + 11].color) data[index + 11].color = "#C0C0C0";
		};
		return data;
	})(),
	upgrades: (() => {
		const data = {};
		for (let index = 0; index < manaUpgrades.length; index++) {
			const row = Math.floor(index / 4);
			const col = index % 4;
			data[row * 10 + col + 11] = {
				cost: new Decimal(5).pow(2 * (row ** 2) + 3 * row + col * (row + 1)).mul(1000),
				currencyInternalName: "points",
				currencyLocation() { return player },
			};
			if (manaUpgrades[index][2]) {
				data[row * 10 + col + 11].fullDisplay = function() { return `<h3>${manaUpgrades[index][0]}</h3><br>${manaUpgrades[index][1]}<br><br>Effect: ${manaUpgrades[index][3] || ""}${format(upgradeEffect("M", this.id))}${manaUpgrades[index][4] || ""}<br><br>Cost: ${format(this.cost)} coins` };
				data[row * 10 + col + 11].effect = manaUpgrades[index][2];
			} else {
				data[row * 10 + col + 11].fullDisplay = function() { return `<h3>${manaUpgrades[index][0]}</h3><br>${manaUpgrades[index][1]}<br><br>Cost: ${format(this.cost)} coins` };
			};
			if (index > 0) data[row * 10 + col + 11].unlocked = () => hasUpgrade("M", Math.floor((index - 1) / 4) * 10 + ((index - 1) % 4) + 11);
		};
		for (let index = 0; index < autocastingUpgrades.length; index++) {
			data[index + 101] = {
				fullDisplay() { return `<h3>${autocastingUpgrades[index][0]}</h3><br>${autocastingUpgrades[index][1]}<br><br>Cost: ${format(this.cost)} coins` },
				cost: new Decimal(1_000).pow(new Decimal(2).pow(index)),
				currencyInternalName: "points",
				currencyLocation() { return player },
			};
			if (index > 0) data[index + 101].unlocked = () => hasUpgrade("M", index + 100);
		};
		return data;
	})(),
});
