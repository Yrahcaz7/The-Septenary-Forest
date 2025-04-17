let tmp = {};
let temp = tmp; // Proxy for tmp
let funcs = {};
let NaNalert = false;

// Tmp will not call these
let activeFunctions = [
	"startData", "onPrestige", "doReset", "update", "automate",
	"buy", "buyMax", "respec", "onPress", "onClick", "onHold", "masterButtonPress",
	"sellOne", "sellAll", "pay", "actualCostFunction", "actualEffectFunction",
	"effectDescription", "display", "fullDisplay", "effectDisplay", "rewardDisplay",
	"tabFormat", "content",
	"onComplete", "onPurchase", "onEnter", "onExit", "done",
	"getUnlocked", "getStyle", "getCanClick", "getTitle", "getDisplay", "getEffect",
];

if (typeof doNotCallTheseFunctionsEveryTick !== "undefined") {
	for (const func in doNotCallTheseFunctionsEveryTick) {
		activeFunctions.push(doNotCallTheseFunctionsEveryTick[func]);
	};
};

// Add the names of classes to traverse
let traversableClasses = [];

function setupTemp() {
	tmp = Vue.reactive({});
	tmp.pointGen = {};
	tmp.backgroundStyle = {};
	tmp.displayThings = [];
	tmp.scrolled = 0;
	tmp.gameEnded = false;
	funcs = {};
	setupTempData(layers, tmp, funcs);
	for (const layer in layers) {
		tmp[layer].resetGain = {};
		tmp[layer].nextAt = {};
		tmp[layer].nextAtDisp = {};
		tmp[layer].canReset = {};
		tmp[layer].notify = {};
		tmp[layer].prestigeNotify = {};
		tmp[layer].computedNodeStyle = [];
		setupBuyables(layer);
		tmp[layer].trueGlowColor = [];
	};
	tmp.other = {
		lastPoints: player.points || newDecimalZero(),
		oomps: newDecimalZero(),
		screenWidth: 0,
		screenHeight: 0,
    };
	updateWidth();
	temp = tmp;
};

const boolNames = ["unlocked", "deactivated"];

function setupTempData(layerData, tmpData, funcsData) {
	for (const item in layerData) {
		if (layerData[item] == null) {
			tmpData[item] = null;
		} else if (layerData[item] instanceof Decimal) {
			tmpData[item] = layerData[item];
		} else if (Array.isArray(layerData[item])) {
			tmpData[item] = [];
			funcsData[item] = [];
			setupTempData(layerData[item], tmpData[item], funcsData[item]);
		} else if (isPlainObject(layerData[item])) {
			tmpData[item] = {};
			funcsData[item] = [];
			setupTempData(layerData[item], tmpData[item], funcsData[item]);
		} else if (!!layerData[item] && typeof layerData[item] == "object" && traversableClasses.includes(layerData[item].constructor.name)) {
			tmpData[item] = new layerData[item].constructor();
			funcsData[item] = new layerData[item].constructor();
		} else if (typeof layerData[item] == "function" && !activeFunctions.includes(item)) {
			funcsData[item] = layerData[item];
			if (boolNames.includes(item)) tmpData[item] = false;
			else tmpData[item] = newDecimalOne(); // The safest thing to put probably?
		} else {
			tmpData[item] = layerData[item];
		};
	};
};

function updateTemp() {
	if (tmp === undefined) setupTemp();
	updateTempData(layers, tmp, funcs);
	for (const layer in layers) {
		tmp[layer].resetGain = getResetGain(layer);
		tmp[layer].nextAt = getNextAt(layer);
		tmp[layer].nextAtDisp = getNextAt(layer, true);
		tmp[layer].canReset = canReset(layer);
		tmp[layer].trueGlowColor = tmp[layer].glowColor;
		tmp[layer].notify = shouldNotify(layer);
		tmp[layer].prestigeNotify = prestigeNotify(layer);
		if (tmp[layer].passiveGeneration === true) tmp[layer].passiveGeneration = 1; // This is needed because `new Decimal(true) = new Decimal(0)`
	};
	if (typeof canGenPoints === 'function' ? canGenPoints() : typeof canGenPoints === 'undefined' || canGenPoints) tmp.pointGen = getPointGen();
	else tmp.pointGen = newDecimalZero();
	if (typeof backgroundStyle !== "undefined") tmp.backgroundStyle = readData(backgroundStyle);
	tmp.displayThings = [];
	if (typeof displayThings !== "undefined") {
		for (thing in displayThings) {
			let text = displayThings[thing];
			if (typeof text == "function") text = text();
			tmp.displayThings.push(text);
		};
	};
};

function updateTempData(layerData, tmpData, funcsData, useThis) {
	for (const item in funcsData) {
		if (Array.isArray(layerData[item])) {
			if (item !== "tabFormat" && item !== "content") { // These are only updated when needed
				updateTempData(layerData[item], tmpData[item], funcsData[item], useThis);
			};
		} else if (isPlainObject(layerData[item]) || (typeof layerData[item] === "object" && traversableClasses.includes(layerData[item].constructor.name))) {
			updateTempData(layerData[item], tmpData[item], funcsData[item], useThis);
		} else if (typeof layerData[item] == "function" && typeof tmpData[item] != "function") {
			let value;
			if (useThis !== undefined) value = layerData[item].bind(useThis)();
			else value = layerData[item]();
			tmpData[item] = value;
		};
	};
};

function updateChallengeTemp(layer) {
	updateTempData(layers[layer].challenges, tmp[layer].challenges, funcs[layer].challenges);
};

function updateBuyableTemp(layer) {
	updateTempData(layers[layer].buyables, tmp[layer].buyables, funcs[layer].buyables);
};

function updateClickableTemp(layer) {
	updateTempData(layers[layer].clickables, tmp[layer].clickables, funcs[layer].clickables);
};

function setupBuyables(layer) {
	for (const id in layers[layer].buyables) {
		if (isPlainObject(layers[layer].buyables[id])) {
			const b = layers[layer].buyables[id];
			b.actualCostFunction = b.cost;
			b.cost = function(x) {
				x = (x === undefined ? player[this.layer].buyables[this.id] : x);
				return layers[this.layer].buyables[this.id].actualCostFunction(x);
			};
			b.actualEffectFunction = b.effect;
			b.effect = function(x) {
				x = (x === undefined ? player[this.layer].buyables[this.id] : x);
				return layers[this.layer].buyables[this.id].actualEffectFunction(x);
			};
		};
	};
};
