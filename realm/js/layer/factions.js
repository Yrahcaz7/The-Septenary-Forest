function hasChosenSide() {
	return hasUpgrade("F", 11) || hasUpgrade("F", 12) || hasUpgrade("F", 13);
};

function hasChosenFaction() {
	return hasUpgrade("F", 21) || hasUpgrade("F", 22) || hasUpgrade("F", 23);
};

function getSideColor(side = -1) {
	if (side < 0) side = [11, 12].findIndex(id => hasUpgrade("F", id));
	if (side === 0) return "#4040E0";
	if (side === 1) return "#E04040";
	return "#C0C0C0";
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

const sideName = ["good", "evil", "neutral"];
const factionName = ["fairy", "elf", "angel", "goblin", "undead", "demon"];
const pluralFactionName = ["fairies", "elves", "angels", "goblins", "undead", "demons"];
const factionFocus = ["basic components", "click production", "mana and spells", "faction coins", "passive production", "advanced components"];
const factionColor = ["#C040E0", "#40E040", "#40C0E0", "#C08040", "#8040C0", "#C04040"];

function getAllianceUpgrade(index) {
	return {
		fullDisplay() {
			const alliance = getAllianceIndex(index);
			const name = (factionName[alliance] || "???");
			const types = getFactionCoinTypes(alliance);
			return `<h3>${name.at(0).toUpperCase() + name.slice(1)} Alliance</h3><br>ally yourself with the ${pluralFactionName[alliance] || "???"}, which focus on ${factionFocus[alliance] || "???"}<br><br>Cost: 5 ${types.length === 2 ? factionName[types[0]] + " and " + factionName[types[1]] : name} coins`;
		},
		canAfford() { return getFactionCoinTypes(index).every(type => player.FC[type].gte(5)) && !hasChosenFaction() },
		pay() { getFactionCoinTypes(index).forEach(type => player.FC[type] = player.FC[type].sub(5)) },
		onPurchase() {
			const alliance = getAllianceIndex(index);
			if (alliance >= 0) player.stats.forEach(obj => obj.alliances[alliance]++);
		},
		color() { return factionColor[getAllianceIndex(index)] || "#C0C0C0" },
		style() { return {"border-color": "color-mix(in srgb, " + this.color() + " 87.5%, #000000 12.5%)"} },
		unlocked: hasChosenSide,
	}
};

function getFactionUpgrade(row, num, faction = -1) {
	const obj = {};
	if (num < 3) {
		obj.fullDisplay = function() {
			const alliance = getAllianceIndex(faction);
			if (alliance < 0) return "";
			const upg = factionUpgrades[alliance][3 * row + num];
			if (upg) return `<h3>${upg[0]}</h3><br>${upg[1]}${upg.length > 2 ? "<br><br>Effect: " + (upg[3] || "") + format(upgradeEffect("F", this.id)) + (upg[4] || "") : ""}<br><br>Cost: ${format(this.cost)} coins`;
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
		obj.fullDisplay = () => {
			const name = (factionName[getAllianceIndex(faction)] || "???");
			const types = getFactionCoinTypes(faction);
			return `<h3>${["First", "Second"][row]} ${name.at(0).toUpperCase() + name.slice(1)} Trade Route</h3><br>unlock 3 more ${name} upgrades<br><br>Cost: ${formatWhole(cost)} ${types.length === 2 ? factionName[types[0]] + " and " + factionName[types[1]] : name} coins`;
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

function lighten(color, amount = 20) {
	if (options.colorText === "all") return `lch(from ${color} calc(l + ${amount}) c h)`;
	return "inherit";
};

function getFCdisp(index) {
	return `<div style='color: ${lighten(factionColor[index])}'><b>${formatWhole(player.FC[index])}</b> ${factionName[index]} coins</div>`;
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
		["display-text", () => `Your faction coin find chance is <b>${format(player.FCchance)}%</b><br><br>You have <b>${formatWhole(player.F.points)}</b> faction coins, which are composed of:`],
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
		["upgrades", [11, 12, 13]],
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
			style: {"border-color": `color-mix(in srgb, ${getSideColor(0)} 87.5%, #000000 12.5%)`},
		},
		12: {
			fullDisplay() { return "<h3>Proof of Evil Deed</h3><br>ally yourself with the side of evil, which focuses on passive production<br><br>Cost: 250 coins" },
			canAfford() { return player.points.gte(250) && !hasChosenSide() },
			pay() { player.points = player.points.sub(250) },
			color: getSideColor(1),
			style: {"border-color": `color-mix(in srgb, ${getSideColor(1)} 87.5%, #000000 12.5%)`},
		},
		13: {
			fullDisplay() { return "<h3>Proof of Neutrality</h3><br>don't ally yourself with either side and focus on all production<br><br>Cost: ??? coins" },
			canAfford() { return false },
			color: getSideColor(2),
			style: {"border-color": `color-mix(in srgb, ${getSideColor(2)} 87.5%, #000000 12.5%)`},
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
		124: getFactionUpgrade(1, 3),
		131: getFactionUpgrade(2, 0),
		132: getFactionUpgrade(2, 1),
		133: getFactionUpgrade(2, 2),
	},
});
