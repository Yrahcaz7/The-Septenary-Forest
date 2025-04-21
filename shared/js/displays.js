function prestigeButtonText(layer) {
	if (layers[layer].prestigeButtonText !== undefined) return run(layers[layer].prestigeButtonText(), layers[layer]);
	if (tmp[layer].type == "normal") return (player[layer].points.lt(1e3) ? (tmp[layer].resetDescription ?? "Reset for ") : "") + "+<b>" + formatWhole(tmp[layer].resetGain) + "</b> " + tmp[layer].resource + (tmp[layer].resetGain.lt(100) && player[layer].points.lt(1e3) ? "<br><br>Next at " + (tmp[layer].roundUpCost ? formatWhole(tmp[layer].nextAt) : format(tmp[layer].nextAt)) + " " + tmp[layer].baseResource : "");
	if (tmp[layer].type == "static") return (tmp[layer].resetDescription ?? "Reset for ") + "+<b>" + formatWhole(tmp[layer].resetGain) + "</b> " + tmp[layer].resource + "<br><br>" + (player[layer].points.lt(30) ? (tmp[layer].baseAmount.gte(tmp[layer].nextAt) && tmp[layer].canBuyMax ? "Next:" : "Req:") : "") + " " + formatWhole(tmp[layer].baseAmount) + " / " + (tmp[layer].roundUpCost ? formatWhole(tmp[layer].nextAtDisp) : format(tmp[layer].nextAtDisp)) + " " + tmp[layer].baseResource;
	if (tmp[layer].type == "none") return "";
	return "You need prestige button text";
};

function constructNodeStyle(layer) {
	const style = [];
	if ((tmp[layer].isLayer && layerUnlocked(layer)) || (!tmp[layer].isLayer && tmp[layer].canClick)) style.push({"background-color": tmp[layer].color});
	if (tmp[layer].image !== undefined) style.push({"background-image": "url('" + tmp[layer].image + "')"});
	if (tmp[layer].notify && player[layer].unlocked) style.push({"box-shadow": "var(--hqProperty2a), 0 0 20px " + tmp[layer].trueGlowColor});
	style.push(tmp[layer].nodeStyle);
	return style;
};

function challengeStyle(layer, id) {
	if (!canUseChallenge(layer, id)) return "locked";
	if (player[layer].activeChallenge == id && canCompleteChallenge(layer, id)) return "canComplete";
	if (maxedChallenge(layer, id)) return "done";
	return "locked";
};

function challengeButtonText(layer, id) {
	const text = ["Finish", "Exit Early", "Completed", "Start", "Locked"];
	if (tmp[layer].challenges[id].buttonText) {
		let buttonText = tmp[layer].challenges[id].buttonText;
		if (typeof tmp[layer].challenges[id].buttonText == "function") {
			buttonText = buttonText();
		};
		if (buttonText) {
			for (let index = 0; index < text.length; index++) {
				if (buttonText[index]) text[index] = buttonText[index];
			};
		};
	};
	if (!canUseChallenge(layer, id)) return text[4];
	if (player[layer].activeChallenge == id) return text[canCompleteChallenge(layer, id) ? 0 : 1];
	return text[maxedChallenge(layer, id) ? 2 : 3];
};

function achievementStyle(layer, id) {
	const ach = tmp[layer].achievements[id];
	const style = [];
	if (ach.image) style.push({"background-image": "url('" + ach.image + "')"});
	if (!ach.unlocked) style.push({"visibility": "hidden"});
	style.push(ach.style);
	return style;
};

function updateWidth() {
	const screenWidth = window.innerWidth;
	let splitScreen = screenWidth >= 1024;
	if (options.forceOneTab) splitScreen = false;
	if (player.navTab == "none") splitScreen = true;
	tmp.other.screenWidth = screenWidth;
	tmp.other.screenHeight = window.innerHeight;
	tmp.other.splitScreen = splitScreen;
	tmp.other.lastPoints = player.points;
};

function updateOomps(diff) {
	tmp.other.oompsMag = 0;
	if (player.points.lte(1e100) || diff == 0) return;
	let pp = new Decimal(player.points);
	let lp = tmp.other.lastPoints || newDecimalZero();
	if (pp.gt(lp)) {
		if (pp.gte("10^^8")) {
			pp = pp.slog(1e10);
			lp = lp.slog(1e10);
			tmp.other.oomps = pp.sub(lp).div(diff);
			tmp.other.oompsMag = -1;
		} else {
			while (pp.div(lp).log10().div(diff).gte(100) && tmp.other.oompsMag <= 5 && lp.gt(0)) {
				pp = pp.log10();
				lp = lp.log10();
				tmp.other.oomps = pp.sub(lp).div(diff);
				tmp.other.oompsMag++;
			};
		};
	};
};

function constructBarStyle(layer, id) {
	const bar = tmp[layer].bars[id];
	const style = {};
	let visualProgress = 0;
	if (bar.progress instanceof Decimal) {
		visualProgress = (1 - Math.min(Math.max(bar.progress.toNumber(), 0), 1)) * 100;
	} else {
		visualProgress = (1 - Math.min(Math.max(bar.progress, 0), 1)) * 100;
	};
	style.dims = {width: bar.width + "px", height: bar.height + "px"};
	style.fillDims = {width: (bar.width + 0.5) + "px", height: (bar.height + 0.5) + "px"};
	switch (bar.direction) {
		case UP:
			style.fillDims["clip-path"] = "inset(" + visualProgress + "% 0% 0% 0%)";
			style.fillDims.width = (bar.width + 1) + "px";
			break;
		case DOWN:
			style.fillDims["clip-path"] = "inset(0% 0% " + visualProgress + "% 0%)";
			style.fillDims.width = (bar.width + 1) + "px";
			break;
		case RIGHT:
			style.fillDims["clip-path"] = "inset(0% " + visualProgress + "% 0% 0%)";
			break;
		case LEFT:
			style.fillDims["clip-path"] = "inset(0% 0% 0% " + visualProgress + "%)";
			break;
		case DEFAULT:
			style.fillDims["clip-path"] = "inset(0% 50% 0% 0%)";
	};
	if (bar.instant) style.fillDims["transition-duration"] = "0s";
	return style;
};

function constructTabFormat(layer, id, family) {
	let tabTemp, tabLayer, tabFunc, location;
	if (id === undefined) {
		tabTemp = tmp[layer].tabFormat;
		tabLayer = layers[layer].tabFormat;
		tabFunc = funcs[layer].tabFormat;
		location = tmp[layer];
	} else if (family === undefined) {
		tabTemp = tmp[layer].tabFormat[id].content;
		tabLayer = layers[layer].tabFormat[id].content;
		tabFunc = funcs[layer].tabFormat[id].content;
		location = tmp[layer].tabFormat[id];
	} else {
		tabTemp = tmp[layer].microtabs[family][id].content;
		tabLayer = layers[layer].microtabs[family][id].content;
		tabFunc = funcs[layer].microtabs[family][id].content;
		location = tmp[layer].microtabs[family][id];
	};
	if (typeof tabLayer == "function") return tabLayer.bind(location)();
	updateTempData(tabLayer, tabTemp, tabFunc, {layer, id, family});
	return tabTemp;
};

function updateTabFormats() {
	updateTabFormat(player.tab);
	updateTabFormat(player.navTab);
};

function updateTabFormat(layer) {
	if (layers[layer]?.tabFormat === undefined) return;
	let tab = player.subtabs[layer]?.mainTabs;
	if (typeof layers[layer].tabFormat == "function") {
		temp[layer].tabFormat = layers[layer].tabFormat();
	} else if (Array.isArray(layers[layer].tabFormat)) {
		temp[layer].tabFormat = constructTabFormat(layer);
	} else if (isPlainObject(layers[layer].tabFormat) && layers[layer].tabFormat[tab].embedLayer === undefined) {
		temp[layer].tabFormat[tab].content = constructTabFormat(layer, tab);
	};
	// Check for embedded layer
	if (isPlainObject(tmp[layer].tabFormat) && tmp[layer].tabFormat[tab].embedLayer !== undefined) {
		updateTabFormat(tmp[layer].tabFormat[tab].embedLayer);
	};
	// Update microtabs
	for (const family in layers[layer].microtabs) {
		tab = player.subtabs[layer][family];
		if (tmp[layer].microtabs[family][tab]) {
			if (tmp[layer].microtabs[family][tab].embedLayer) updateTabFormat(tmp[layer].microtabs[family][tab].embedLayer);
			else temp[layer].microtabs[family][tab].content = constructTabFormat(layer, tab, family);
		};
	};
};
