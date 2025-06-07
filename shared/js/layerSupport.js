const layers = {};

function newDecimalZero() {
	return new Decimal(Decimal.dZero);
};

function newDecimalOne() {
	return new Decimal(Decimal.dOne);
};

const defaultGlow = "#ff0000";

function layerShown(layer) {
	return tmp[layer].layerShown;
};

let LAYERS = Object.keys(layers);
let hotkeys = {};
let maxRow = 0;

function updateHotkeys() {
	hotkeys = {};
	for (const layer in layers) {
		const hk = layers[layer].hotkeys;
		if (hk) {
			for (const id in hk) {
				hotkeys[hk[id].key] = hk[id];
				hotkeys[hk[id].key].layer = layer;
				hotkeys[hk[id].key].id = id;
				if (hk[id].unlocked === undefined) {
					hk[id].unlocked = true;
				};
			};
		};
	};
};

let ROW_LAYERS = {};
let TREE_LAYERS = {};
let OTHER_LAYERS = {};

function updateLayers() {
	LAYERS = Object.keys(layers);
	ROW_LAYERS = {};
	TREE_LAYERS = {};
	OTHER_LAYERS = {};
	for (const layer in layers) {
		setupLayer(layer);
	};
	for (const row in OTHER_LAYERS) {
		OTHER_LAYERS[row].sort((a, b) => a.position > b.position ? 1 : -1);
		for (const layer in OTHER_LAYERS[row]) {
			OTHER_LAYERS[row][layer] = OTHER_LAYERS[row][layer].layer;
		};
	};
	for (const row in TREE_LAYERS) {
		TREE_LAYERS[row].sort((a, b) => a.position > b.position ? 1 : -1);
		for (const layer in TREE_LAYERS[row]) {
			TREE_LAYERS[row][layer] = TREE_LAYERS[row][layer].layer;
		};
	};
	const treeLayers = [];
	for (let x = 0; x < maxRow + 1; x++) {
		if (TREE_LAYERS[x]) treeLayers.push(TREE_LAYERS[x]);
	};
	TREE_LAYERS = treeLayers;
	updateHotkeys();
};

function setupLayer(layer) {
	layers[layer].layer = layer;
	if (layers[layer].upgrades) {
		setRowCol(layers[layer].upgrades);
		for (const thing in layers[layer].upgrades) {
			if (isPlainObject(layers[layer].upgrades[thing])) {
				layers[layer].upgrades[thing].id = thing;
				layers[layer].upgrades[thing].layer = layer;
				if (layers[layer].upgrades[thing].unlocked === undefined) {
					layers[layer].upgrades[thing].unlocked = true;
				};
			};
		};
	};
	if (layers[layer].milestones) {
		for (const thing in layers[layer].milestones) {
			if (isPlainObject(layers[layer].milestones[thing])) {
				layers[layer].milestones[thing].id = thing;
				layers[layer].milestones[thing].layer = layer;
				if (layers[layer].milestones[thing].unlocked === undefined) {
					layers[layer].milestones[thing].unlocked = true;
				};
			};
		};
	};
	if (layers[layer].achievements) {
		setRowCol(layers[layer].achievements)
		for (const thing in layers[layer].achievements) {
			if (isPlainObject(layers[layer].achievements[thing])) {
				layers[layer].achievements[thing].id = thing;
				layers[layer].achievements[thing].layer = layer;
				if (layers[layer].achievements[thing].unlocked === undefined) {
					layers[layer].achievements[thing].unlocked = true;
				};
			};
		};
	};
	if (layers[layer].challenges) {
		setRowCol(layers[layer].challenges);
		for (const thing in layers[layer].challenges) {
			if (isPlainObject(layers[layer].challenges[thing])) {
				layers[layer].challenges[thing].id = thing;
				layers[layer].challenges[thing].layer = layer;
				if (layers[layer].challenges[thing].unlocked === undefined) {
					layers[layer].challenges[thing].unlocked = true;
				};
				if (layers[layer].challenges[thing].completionLimit === undefined) {
					layers[layer].challenges[thing].completionLimit = 1;
				} else if (layers[layer].challenges[thing].marked === undefined) {
					layers[layer].challenges[thing].marked = function() {return maxedChallenge(this.layer, this.id)};
				};
			};
		};
	};
	if (layers[layer].buyables) {
		layers[layer].buyables.layer = layer;
		setRowCol(layers[layer].buyables);
		for (const thing in layers[layer].buyables) {
			if (isPlainObject(layers[layer].buyables[thing])) {
				layers[layer].buyables[thing].id = thing;
				layers[layer].buyables[thing].layer = layer;
				if (layers[layer].buyables[thing].unlocked === undefined) {
					layers[layer].buyables[thing].unlocked = true;
				};
				layers[layer].buyables[thing].canBuy = function() {return canBuyBuyable(this.layer, this.id)};
				if (layers[layer].buyables[thing].purchaseLimit === undefined) {
					layers[layer].buyables[thing].purchaseLimit = new Decimal(Infinity);
				};
			};
		};
	};
	if (layers[layer].clickables) {
		layers[layer].clickables.layer = layer;
		setRowCol(layers[layer].clickables);
		for (const thing in layers[layer].clickables) {
			if (isPlainObject(layers[layer].clickables[thing])) {
				layers[layer].clickables[thing].id = thing;
				layers[layer].clickables[thing].layer = layer;
				if (layers[layer].clickables[thing].unlocked === undefined) {
					layers[layer].clickables[thing].unlocked = true;
				};
			};
		};
	};
	if (layers[layer].bars) {
		layers[layer].bars.layer = layer;
		for (const thing in layers[layer].bars) {
			layers[layer].bars[thing].id = thing;
			layers[layer].bars[thing].layer = layer;
			if (layers[layer].bars[thing].unlocked === undefined) {
				layers[layer].bars[thing].unlocked = true;
			};
		};
	};
	if (layers[layer].infoboxes) {
		for (const thing in layers[layer].infoboxes) {
			layers[layer].infoboxes[thing].id = thing;
			layers[layer].infoboxes[thing].layer = layer;
			if (layers[layer].infoboxes[thing].unlocked === undefined) {
				layers[layer].infoboxes[thing].unlocked = true;
			};
		};
	};
	if (layers[layer].grid) {
		layers[layer].grid.layer = layer;
		if (layers[layer].grid.getUnlocked === undefined) {
			layers[layer].grid.getUnlocked = true;
		};
		if (layers[layer].grid.getCanClick === undefined) {
			layers[layer].grid.getCanClick = true;
		};
	};
	if (layers[layer].startData) {
		const data = layers[layer].startData();
		if (data.points !== undefined) {
			if (data.best !== undefined && data.showBest === undefined) layers[layer].showBest = true;
			if (data.total !== undefined && data.showTotal === undefined) layers[layer].showTotal = true;
		};
	};
	if (!layers[layer].componentStyles) layers[layer].componentStyles = {};
	if (layers[layer].symbol === undefined) layers[layer].symbol = layer.at(0).toUpperCase() + layer.slice(1);
	if (layers[layer].unlockOrder === undefined) layers[layer].unlockOrder = [];
	if (layers[layer].gainMult === undefined) layers[layer].gainMult = newDecimalOne();
	if (layers[layer].gainExp === undefined) layers[layer].gainExp = newDecimalOne();
	if (layers[layer].directMult === undefined) layers[layer].directMult = newDecimalOne();
	if (layers[layer].type === undefined) layers[layer].type = "none";
	if (layers[layer].base === undefined || layers[layer].base <= 1) layers[layer].base = 2;
	if (layers[layer].softcap === undefined) layers[layer].softcap = new Decimal("e1e7");
	if (layers[layer].softcapPower === undefined) layers[layer].softcapPower = new Decimal(0.5);
	if (layers[layer].displayRow === undefined) layers[layer].displayRow = layers[layer].row;
	if (layers[layer].name === undefined) layers[layer].name = layer;
	if (layers[layer].layerShown === undefined) layers[layer].layerShown = true;
	if (layers[layer].glowColor === undefined) layers[layer].glowColor = defaultGlow;
	const row = layers[layer].row;
	const displayRow = layers[layer].displayRow;
	if (!ROW_LAYERS[row]) ROW_LAYERS[row] = {};
	if (!TREE_LAYERS[displayRow] && !isNaN(displayRow)) TREE_LAYERS[displayRow] = [];
	if (!OTHER_LAYERS[displayRow] && isNaN(displayRow)) OTHER_LAYERS[displayRow] = [];
	ROW_LAYERS[row][layer] = layer;
	const pos = (layers[layer].position !== undefined ? layers[layer].position : layer);
	if (!isNaN(displayRow) || displayRow < 0) TREE_LAYERS[displayRow].push({layer: layer, position: pos});
	else OTHER_LAYERS[displayRow].push({layer: layer, position: pos});
	if (maxRow < layers[layer].displayRow) maxRow = layers[layer].displayRow;
};

// Call this to add layers from a different file!
function addLayer(layerName, layerData, tabLayers = null) {
	layers[layerName] = layerData;
	layers[layerName].isLayer = true;
	if (tabLayers !== null) {
		const format = {};
		for (const id in tabLayers) {
			const layer = tabLayers[id];
			format[layers[layer].name ? layers[layer].name : layer] = {
				embedLayer: layer,
				buttonStyle() {
					if (!tmp[this.embedLayer].nodeStyle) {
						return {"border-color": tmp[this.embedLayer].color};
					} else {
						const style = tmp[this.embedLayer].nodeStyle;
						if (style["border-color"] === undefined) {
							style["border-color"] = tmp[this.embedLayer].color;
						};
						return style;
					};
				},
				unlocked() {return tmp[this.embedLayer].layerShown},
			};
		};
		layers[layerName].tabFormat = format;
	};
};

// Does the same thing, but for non-layer nodes
function addNode(layerName, layerData) {
	layers[layerName] = layerData;
	layers[layerName].isLayer = false;
};

// If data is a function, return the result of calling it. Otherwise, return the data.
function readData(data, ...args) {
	if (data instanceof Function) return data(...args);
	return data;
};

function setRowCol(upgrades) {
	if (upgrades.rows && upgrades.cols) return;
	let maxRow = 0;
	let maxCol = 0;
	for (const up in upgrades) {
		if (!isNaN(up)) {
			if (Math.floor(up / 10) > maxRow) maxRow = Math.floor(up / 10);
			if (up % 10 > maxCol) maxCol = up % 10;
		};
	};
	upgrades.rows = maxRow;
	upgrades.cols = maxCol;
};

function someLayerUnlocked(row) {
	for (const layer in ROW_LAYERS[row]) {
		if (player[layer].unlocked) {
			return true;
		};
	};
	return false;
};

// This isn't worth making a .ts file over
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

addLayer("info-tab", {
	tabFormat: ["info-tab"],
	row: "otherside",
});

addLayer("options-tab", {
	tabFormat: ["options-tab", "blank"],
	row: "otherside",
});

addLayer("changelog-tab", {
	tabFormat() {return [["raw-html", changelog]]},
	row: "otherside",
});
