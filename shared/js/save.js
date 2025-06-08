// ************ Save stuff ************
function getModID() {
	if (modInfo.id) {
		if (modInfo.useNewSaveSyntax === undefined || modInfo.useNewSaveSyntax) return modInfo.author.replace(/\s+/g, "-") + "/" + modInfo.id.replace(/\s+/g, "-");
		return modInfo.id;
	};
	if (modInfo.useNewSaveSyntax === undefined || modInfo.useNewSaveSyntax) return modInfo.author.replace(/\s+/g, "-") + "/" + modInfo.name.replace(/\s+/g, "-");
	return modInfo.name.replace(/\s+/g, "-") + "-" + modInfo.author.replace(/\s+/g, "-");
};

function save(force) {
	NaNcheck(player);
	if (NaNalert && !force) return;
	if (modInfo.useNewSaveSyntax === undefined || modInfo.useNewSaveSyntax) {
		localStorage.setItem(getModID() + "/save", btoa(encodeURIComponent(JSON.stringify(player))));
		localStorage.setItem(getModID() + "/options", btoa(encodeURIComponent(JSON.stringify(options))));
	} else {
		localStorage.setItem(getModID(), btoa(encodeURIComponent(JSON.stringify(player))));
		localStorage.setItem(getModID() + "_options", btoa(encodeURIComponent(JSON.stringify(options))));
	};
};

function startPlayerBase() {
	return Vue.reactive({
		tab: layoutInfo.startTab,
		navTab: (layoutInfo.showTree ? layoutInfo.startNavTab : "none"),
		time: Date.now(),
		notify: {},
		versionType: getModID(),
		version: VERSION.num,
		pre: VERSION.pre,
		beta: VERSION.beta,
		timePlayed: 0,
		keepGoing: false,
		hasNaN: false,
		points: modInfo.initialStartPoints || newDecimalZero(),
		subtabs: {},
		lastSafeTab: (readData(layoutInfo.showTree) ? "none" : layoutInfo.startTab),
	});
};

function getStartPlayer() {
	const playerData = startPlayerBase();
	if (typeof addedPlayerData === "function") {
		const extraData = addedPlayerData();
		for (const thing in extraData) {
			playerData[thing] = extraData[thing];
		};
	};
	playerData.infoboxes = {};
	for (const layer in layers) {
		playerData[layer] = getStartLayerData(layer);
		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {
			playerData.subtabs[layer] = {};
			playerData.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
		};
		if (layers[layer].microtabs) {
			if (playerData.subtabs[layer] == undefined) playerData.subtabs[layer] = {};
			for (const item in layers[layer].microtabs) {
				playerData.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
			};
		};
		if (layers[layer].infoboxes) {
			if (playerData.infoboxes[layer] == undefined) playerData.infoboxes[layer] = {};
			for (const item in layers[layer].infoboxes) {
				playerData.infoboxes[layer][item] = false;
			};
		};
	};
	return playerData;
};

function getStartLayerData(layer) {
	const layerData = (layers[layer].startData instanceof Function ? layers[layer].startData() : {});
	if (layerData.unlocked === undefined) layerData.unlocked = true;
	if (layerData.points !== undefined) {
		if (layerData.total === undefined) layerData.total = newDecimalZero();
		if (layerData.best === undefined) layerData.best = newDecimalZero();
	};
	if (layerData.resetTime === undefined) layerData.resetTime = 0;
	if (layerData.forceTooltip === undefined) layerData.forceTooltip = false;
	if (layerData.noRespecConfirm === undefined) layerData.noRespecConfirm = false;
	if (layerData.clickables === undefined && layers[layer].clickables) {
		layerData.clickables = getStartClickables(layer);
	};
	if (layers[layer].buyables) {
		layerData.buyables = getStartBuyables(layer);
	};
	if (layers[layer].upgrades) {
		layerData.upgrades = [];
	};
	if (layers[layer].milestones) {
		layerData.milestones = [];
		layerData.lastMilestone = null;
	};
	if (layers[layer].achievements) {
		layerData.achievements = [];
	};
	if (layers[layer].challenges) {
		layerData.challenges = getStartChallenges(layer);
	};
	if (layers[layer].grid) {
		layerData.grid = getStartGrid(layer);
	};
	layerData.prevTab = "";
	return layerData;
};

function getStartBuyables(layer) {
	const data = {};
	for (const id in layers[layer].buyables) {
		if (isPlainObject(layers[layer].buyables[id])) data[id] = newDecimalZero();
	};
	return data;
};

function getStartClickables(layer) {
	const data = {};
	for (const id in layers[layer].clickables) {
		if (isPlainObject(layers[layer].clickables[id])) data[id] = "";
	};
	return data;
};

function getStartChallenges(layer) {
	const data = {};
	for (const id in layers[layer].challenges) {
		if (isPlainObject(layers[layer].challenges[id])) data[id] = 0;
	};
	return data;
};

function getStartGrid(layer) {
	const data = {};
	if (!layers[layer].grid) return data;
	if (layers[layer].grid.maxRows === undefined) layers[layer].grid.maxRows = layers[layer].grid.rows;
	if (layers[layer].grid.maxCols === undefined) layers[layer].grid.maxCols = layers[layer].grid.cols;
	for (let y = 1; y <= layers[layer].grid.maxRows; y++) {
		for (let x = 1; x <= layers[layer].grid.maxCols; x++) {
			data[100 * y + x] = layers[layer].grid.getStartData(100 * y + x);
		};
	};
	return data;
};

function fixSave() {
	fixData(getStartPlayer(), player);
	for (const layer in layers) {
		if (player[layer].best !== undefined) player[layer].best = new Decimal(player[layer].best);
		if (player[layer].total !== undefined) player[layer].total = new Decimal(player[layer].total);
		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {
			if (!(layers[layer].tabFormat[player.subtabs[layer].mainTabs] instanceof Object)) {
				player.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
			};
		};
		if (layers[layer].microtabs) {
			for (const item in layers[layer].microtabs) {
				if (!(layers[layer].microtabs[item][player.subtabs[layer][item]] instanceof Object)) {
					player.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
				};
			};
		};
	};
};

function fixData(defaultData, newData) {
	for (const item in defaultData) {
		if (defaultData[item] === null) {
			if (newData[item] === undefined) newData[item] = null;
		} else if (defaultData[item] instanceof Decimal) { // Convert to Decimal
			if (newData[item] === undefined) newData[item] = defaultData[item];
			else newData[item] = new Decimal(newData[item]);
		} else if (defaultData[item] instanceof Object) {
			if (newData[item] === undefined) newData[item] = defaultData[item];
			else fixData(defaultData[item], newData[item]);
		} else {
			if (newData[item] === undefined) newData[item] = defaultData[item];
		};
	};
};

function load(mainPage = false) {
	const get = localStorage.getItem(getModID() + (modInfo.useNewSaveSyntax === undefined || modInfo.useNewSaveSyntax ? "/save" : ""));
	if (get) {
		player = Object.assign(getStartPlayer(), JSON.parse(decodeURIComponent(atob(get))));
		fixSave();
		loadOptions();
	} else {
		player = getStartPlayer();
		options = getStartOptions();
	};
	if (options.offlineProd) {
		if (player.offTime === undefined) {
			player.offTime = {remain: 0};
		};
		player.offTime.remain += (Date.now() - player.time) / 1000;
	};
	player.time = Date.now();
	versionCheck();
	changeTheme();
	changeTreeQuality();
	updateLayers();
	setupModInfo();
	setupTemp();
	updateTemp();
	updateTemp();
	updateTabFormats();
	loadVue(mainPage);
	if (typeof onLoad === "function") onLoad();
};

function loadOptions() {
	options = getStartOptions();
	const get = localStorage.getItem(getModID() + (modInfo.useNewSaveSyntax === undefined || modInfo.useNewSaveSyntax ? "/" : "_") + "options");
	if (get) options = Object.assign(options, JSON.parse(decodeURIComponent(atob(get))));
	if (themeNames.indexOf(options.theme) < 0) theme = "default";
	fixData(options, getStartOptions());
};

function setupModInfo() {
	modInfo.changelog = changelog;
	modInfo.winText = (typeof winText !== "undefined" ? (winText instanceof Function ? winText() : winText) : (typeof endPoints !== "undefined" ? "You reached " + format(endPoints) + " " + (modInfo.pointsName || "points") + " and beat the game!<br>However, it isn't the end yet...<br>Wait for more updates for further content." : "Congratulations! You have reached the end and beaten this game, but for now..."));
};

function NaNcheck(data) {
	for (const item in data) {
		if (Array.isArray(data[item]) || isPlainObject(data[item])) {
			NaNcheck(data[item]);
		} else if (data[item] !== data[item] || (data[item] instanceof Decimal && data[item].isNaN())) {
			if (!NaNalert) {
				clearInterval(INTERVAL);
				NaNalert = true;
				alert("Invalid value found in player, named '" + item + "'. Please let the creator of this mod know! You can refresh the page, and you should be un-NaNed.");
				return;
			};
		};
	};
};

function exportSave() {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(btoa(encodeURIComponent(JSON.stringify(player)))).then(() => {
			alert("Your save has been successfully copied to the clipboard.");
		}, err => {
			alert("Could not copy save: ", err);
			console.error("Could not copy save: ", err);
		});
	} else {
		alert("Could not copy save: navigator.clipboard is not supported in this context.");
		console.error("Could not copy save: navigator.clipboard is not supported in this context.");
	};
};

function importSave(imported = undefined, forced = false) {
	if (imported === undefined) imported = prompt("Paste your save here");
	try {
		const tempPlr = Object.assign(getStartPlayer(), JSON.parse(atob(imported)));
		if (tempPlr.versionType !== getModID() && !forced && !confirm("This save appears to be for a different mod! Are you sure you want to import?")) {
			return; // Wrong save. Use "Forced" to force it to accept.
		};
		player = tempPlr;
		player.versionType = getModID();
		fixSave();
		versionCheck();
		save();
		location.reload();
	} catch (e) {
		return;
	};
};

function versionCheck() {
	if (player.versionType === undefined || player.version === undefined) {
		player.versionType = getModID();
		player.version = 0;
	};
	if (player.versionType == getModID()) {
		player.keepGoing = false;
		if (typeof fixOldSave === "function") fixOldSave(player.version);
	};
	player.versionType = getStartPlayer().versionType;
	player.version = VERSION.num;
	if (VERSION.pre) player.pre = VERSION.pre;
	else delete player.pre;
	if (VERSION.beta) player.beta = VERSION.beta;
	else delete player.beta;
};

const SAVE_INTERVAL = setInterval(() => {
	if (player === undefined || (tmp.gameEnded && !player.keepGoing)) return;
	if (options.autosave) save();
}, 5000);

onbeforeunload = () => {
    if (player.autosave) save();
};
