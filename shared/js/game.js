let player;
let needCanvasUpdate = true;

// Don't change this
const TMT_VERSION = {
	tmtNum: "2.7",
	tmtName: "Δ",
};

function getResetGain(layer, useType = null) {
	let type = useType;
	if (!useType) {
		type = tmp[layer].type;
		if (layers[layer].getResetGain !== undefined) {
			return layers[layer].getResetGain();
		};
	};
	if (tmp[layer].type == "none") return newDecimalZero();
	if (tmp[layer].gainExp.eq(0)) return newDecimalZero();
	if (type == "static") {
		if ((!tmp[layer].canBuyMax) || tmp[layer].baseAmount.lt(tmp[layer].requires)) return newDecimalOne();
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).div(tmp[layer].gainMult).max(1).log(tmp[layer].base).mul(tmp[layer].gainExp).pow(Decimal.pow(tmp[layer].exponent, -1));
		gain = applySoftcapstoResetGain(layer, gain);
		gain = gain.mul(tmp[layer].directMult);
		return gain.floor().sub(player[layer].points).add(1).max(1);
	} else if (type == "normal") {
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return newDecimalZero();
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).mul(tmp[layer].gainMult).pow(tmp[layer].gainExp);
		gain = applySoftcapstoResetGain(layer, gain);
		if (tmp[layer].logged) gain = gain.add(1).log(tmp[layer].logged === true ? 10 : tmp[layer].logged);
		gain = gain.mul(tmp[layer].directMult);
		return gain.floor().max(0);
	} else if (type == "custom") {
		return layers[layer].getResetGain();
	} else {
		return newDecimalZero();
	};
};

function getNextAt(layer, canMax = false, useType = null) {
	let type = useType;
	if (!useType) {
		type = tmp[layer].type;
		if (layers[layer].getNextAt !== undefined) {
			return layers[layer].getNextAt(canMax);
		};
	};
	if (tmp[layer].type == "none" || tmp[layer].gainMult.lte(0) || tmp[layer].gainExp.lte(0)) {
		return newDecimalInf();
	} else if (type == "static") {
		if (!tmp[layer].canBuyMax) canMax = false;
		let next = player[layer].points.add(canMax && tmp[layer].baseAmount.gte(tmp[layer].nextAt) ? tmp[layer].resetGain : 0).div(tmp[layer].directMult);
		next = applyInverseSoftcapsToNextAt(layer, next);
		const extraCost = Decimal.pow(tmp[layer].base, next.pow(tmp[layer].exponent).div(tmp[layer].gainExp)).mul(tmp[layer].gainMult);
		let cost = extraCost.mul(tmp[layer].requires).max(tmp[layer].requires);
		if (tmp[layer].roundUpCost) cost = cost.ceil();
		return cost;
	} else if (type == "normal") {
		let next = tmp[layer].resetGain.add(1).div(tmp[layer].directMult);
		if (tmp[layer].logged) next = next.pow_base(tmp[layer].logged === true ? 10 : tmp[layer].logged).sub(1);
		next = applyInverseSoftcapsToNextAt(layer, next);
		next = next.root(tmp[layer].gainExp).div(tmp[layer].gainMult).root(tmp[layer].exponent).mul(tmp[layer].requires).max(tmp[layer].requires);
		if (tmp[layer].roundUpCost) next = next.ceil();
		return next;
	} else if (type == "custom") {
		return layers[layer].getNextAt(canMax);
	} else {
		return newDecimalInf();
	};
};

function applySoftcapstoResetGain(layer, gain) {
	if (tmp[layer].softcaps.length > 0 && tmp[layer].softcapPowers.length > 0) {
		const length = Math.min(tmp[layer].softcaps.length, tmp[layer].softcapPowers.length);
		for (let index = 0; index < length; index++) {
			gain = softcap(gain, tmp[layer].softcaps[index], tmp[layer].softcapPowers[index]);
		};
	} else {
		gain = softcap(gain, tmp[layer].softcap, tmp[layer].softcapPower);
	};
	return gain;
};

function applyInverseSoftcapsToNextAt(layer, next) {
	if (tmp[layer].softcaps.length > 0 && tmp[layer].softcapPowers.length > 0) {
		const length = Math.min(tmp[layer].softcaps.length, tmp[layer].softcapPowers.length);
		for (let index = length - 1; index >= 0; index--) {
			next = inverseSoftcap(next, tmp[layer].softcaps[index], tmp[layer].softcapPowers[index]);
		};
	} else {
		next = inverseSoftcap(next, tmp[layer].softcap, tmp[layer].softcapPower);
	};
	return next;
};

function softcap(value, cap, power = 0.5) {
	if (value.lte(cap)) return value;
	return value.pow(power).mul(cap.pow(newDecimalOne().sub(power)));
};

function inverseSoftcap(value, cap, power = 0.5) {
	if (value.lte(cap)) return value;
	return value.mul(cap.pow(new Decimal(power).sub(1))).pow(newDecimalOne().div(power));
};

// Return true if the layer should be highlighted. By default checks for upgrades only.
function shouldNotify(layer) {
	for (const id in tmp[layer].upgrades) {
		if (isPlainObject(layers[layer].upgrades[id])) {
			if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked) return true;
		};
	};
	if (player[layer].activeChallenge && canCompleteChallenge(layer, player[layer].activeChallenge)) return true;
	if (tmp[layer].shouldNotify) return true;
	if (isPlainObject(tmp[layer].tabFormat)) {
		for (const subtab in tmp[layer].tabFormat) {
			if (subtabShouldNotify(layer, "mainTabs", subtab)) {
				tmp[layer].trueGlowColor = tmp[layer].tabFormat[subtab].glowColor || defaultGlow;
				return true;
			};
		};
	};
	for (const family in tmp[layer].microtabs) {
		for (const subtab in tmp[layer].microtabs[family]) {
			if (subtabShouldNotify(layer, family, subtab)) {
				tmp[layer].trueGlowColor = tmp[layer].microtabs[family][subtab].glowColor;
				return true;
			};
		};
	};
	return false;
};

function canReset(layer) {
	if (tmp[layer].deactivated) return false;
	else if (layers[layer].canReset !== undefined) return run(layers[layer].canReset, layers[layer]);
	else if (tmp[layer].type == "normal") return tmp[layer].baseAmount.gte(tmp[layer].requires);
	else if (tmp[layer].type == "static") return tmp[layer].baseAmount.gte(tmp[layer].nextAt);
	else return false;
};

function rowReset(row, layer) {
	for (const lr in ROW_LAYERS[row]) {
		if (isPlainObject(lr)) continue;
		if (layers[lr].doReset) {
			if (!isNaN(row)) player[lr].activeChallenge = null; // Exit challenges on any row reset on an equal or higher row
			run(layers[lr].doReset, layers[lr], layer);
		} else if (tmp[layer].row > tmp[lr].row && !isNaN(row)) {
			layerDataReset(lr);
		};
	};
};

function layerDataReset(layer, keep = []) {
	const startData = getStartLayerData(layer);
	const storedData = {unlocked: player[layer].unlocked, forceTooltip: player[layer].forceTooltip, noRespecConfirm: player[layer].noRespecConfirm, prevTab: player[layer].prevTab} // Always keep these
	for (const thing in keep) {
		if (player[layer][keep[thing]] !== undefined) {
			delete startData[keep[thing]];
			storedData[keep[thing]] = player[layer][keep[thing]];
		};
	};
	layOver(player[layer], startData);
	for (const thing in storedData) {
		player[layer][thing] = storedData[thing];
	};
};

function addPoints(layer, gain) {
	player[layer].points = player[layer].points.add(gain).max(0);
	if (player[layer].best) player[layer].best = player[layer].best.max(player[layer].points);
	if (player[layer].total) player[layer].total = player[layer].total.add(gain);
};

function generatePoints(layer, diff) {
	addPoints(layer, tmp[layer].resetGain.mul(diff));
};

function doReset(layer, force = false, overrideResetsNothing = false) {
	if (tmp[layer].type == "none") return;
	const row = tmp[layer].row;
	const challenge = player[layer].activeChallenge;
	if (!force) {
		if (tmp[layer].canReset === false) return;
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return;
		let gain = tmp[layer].resetGain;
		if (tmp[layer].type == "static") {
			if (tmp[layer].baseAmount.lt(tmp[layer].nextAt)) return;
			gain = (tmp[layer].canBuyMax ? gain : 1);
		};
		if (layers[layer].onPrestige && !layers[layer].onPrestigeIsAfterGain) run(layers[layer].onPrestige, layers[layer], gain);
		addPoints(layer, gain);
		updateMilestones(layer);
		updateAchievements(layer);
		if (layers[layer].onPrestige && layers[layer].onPrestigeIsAfterGain) run(layers[layer].onPrestige, layers[layer], gain);
		if (!player[layer].unlocked) {
			player[layer].unlocked = true;
			needCanvasUpdate = true;
			if (tmp[layer].increaseUnlockOrder) {
				lrs = tmp[layer].increaseUnlockOrder;
				for (const lr in lrs) {
					if (!player[lrs[lr]].unlocked) player[lrs[lr]].unlockOrder++;
				};
			};
		};
	};
	if (!overrideResetsNothing && run(layers[layer].resetsNothing, layers[layer])) return;
	tmp[layer].baseAmount = newDecimalZero(); // quick fix
	for (const layerResetting in layers) {
		if (row >= layers[layerResetting].row && (!force || layerResetting != layer)) completeChallenge(layerResetting);
	};
	player.points = (typeof getStartPoints == "function" ? getStartPoints() : newDecimalZero());
	if (typeof onReset === "function") onReset(layer);
	for (let x = row; x >= 0; x--) {
		rowReset(x, layer);
	};
	for (const r in OTHER_LAYERS) {
		rowReset(r, layer);
	};
	player[layer].resetTime = 0;
	if (challenge && tmp[layer].challenges[challenge].noAutoExit) player[layer].activeChallenge = challenge;
	updateTemp();
	updateTemp();
};

function resetRow(row) {
	if (prompt('Are you sure you want to reset this row? It is highly recommended that you wait until the end of your current run before doing this! Type "I WANT TO RESET THIS" to confirm') !== "I WANT TO RESET THIS") return;
	rowReset(row + 1, ROW_LAYERS[row + 1][0]);
	doReset(ROW_LAYERS[row - 1][0], true);
	for (const layer in ROW_LAYERS[row]) {
		if (isPlainObject(layer)) continue;
		player[layer].unlocked = false;
		if (player[layer].unlockOrder) player[layer].unlockOrder = 0;
	};
	player.points = (typeof getStartPoints == "function" ? getStartPoints() : newDecimalZero());
	updateTemp();
	resizeCanvas();
};

function startChallenge(layer, x) {
	if ((!player[layer].unlocked && tmp[layer].upgrades.needLayerUnlocked !== false) || !tmp[layer].challenges[x].unlocked) return;
	if (player[layer].activeChallenge == x && canExitChallenge(layer, x)) {
		completeChallenge(layer, x);
		if (tmp[layer].challenges[x].doReset) doReset(layer, true, tmp[layer].challenges[x].overrideResetsNothing === true);
		player[layer].activeChallenge = null;
	} else if (canEnterChallenge(layer, x)) {
		player[layer].activeChallenge = x;
		run(layers[layer].challenges[x].onEnter, layers[layer].challenges[x]);
		if (tmp[layer].challenges[x].doReset) doReset(layer, true, tmp[layer].challenges[x].overrideResetsNothing === true);
		player[layer].activeChallenge = x;
	};
	updateChallengeTemp(layer);
};

function canCompleteChallenge(layer, x) {
	if (x != player[layer].activeChallenge) return;
	const challenge = tmp[layer].challenges[x];
	if (challenge.canComplete !== undefined) return challenge.canComplete;
	if (challenge.currencyInternalName) {
		const name = challenge.currencyInternalName;
		if (challenge.currencyLocation) {
			return !challenge.currencyLocation[name].lt(challenge.goal);
		} else if (challenge.currencyLayer) {
			return !player[challenge.currencyLayer][name].lt(challenge.goal);
		} else {
			return !player[name].lt(challenge.goal);
		};
	} else {
		return !player.points.lt(challenge.goal);
	};
};

function completeChallenge(layer, x = player[layer].activeChallenge) {
	if (!x) return;
	const completions = canCompleteChallenge(layer, x);
	if (!completions) {
		player[layer].activeChallenge = null;
		run(layers[layer].challenges[x].onExit, layers[layer].challenges[x]);
		return;
	};
	if (player[layer].challenges[x] < tmp[layer].challenges[x].completionLimit) {
		needCanvasUpdate = true;
		player[layer].challenges[x] += completions;
		player[layer].challenges[x] = Math.min(player[layer].challenges[x], tmp[layer].challenges[x].completionLimit);
		if (layers[layer].challenges[x].onComplete) run(layers[layer].challenges[x].onComplete, layers[layer].challenges[x]);
	};
	player[layer].activeChallenge = null;
	run(layers[layer].challenges[x].onExit, layers[layer].challenges[x]);
	updateChallengeTemp(layer);
};

VERSION.withoutName = "v" + VERSION.num + (VERSION.pre ? " Pre-Release " + VERSION.pre : (VERSION.beta ? " Beta " + VERSION.beta : ""));
VERSION.withName = VERSION.withoutName + (VERSION.name ? ": " + VERSION.name : "");

function autobuyUpgrades(layer) {
	if (!tmp[layer].upgrades) return;
	for (const id in tmp[layer].upgrades) {
		if (isPlainObject(tmp[layer].upgrades[id]) && (layers[layer].upgrades[id].canAfford === undefined || layers[layer].upgrades[id].canAfford() === true)) {
			buyUpg(layer, id);
		};
	};
};

function gameLoop(diff) {
	if ((typeof endPoints !== "undefined" ? player.points.gte(endPoints) : (typeof isEndgame == "function" ? isEndgame() : isEndgame)) || tmp.gameEnded) {
		tmp.gameEnded = true;
		clearParticles();
	};
	if (isNaN(diff) || diff < 0) diff = 0;
	if (tmp.gameEnded && !player.keepGoing) {
		diff = 0;
		clearParticles();
	};
	if (maxTickLength) {
		let limit = maxTickLength();
		if (diff > limit) diff = limit;
	};
	addTime(diff);
	if (typeof getPoints === "function" && getPoints() instanceof Decimal) player.points = getPoints();
	else player.points = player.points.add(tmp.pointGen.mul(diff)).max(0);
	if (typeof update === "function") update(diff);
	for (let x = 0; x <= maxTreeRow; x++) {
		for (const item in TREE_LAYERS[x]) {
			const layer = TREE_LAYERS[x][item];
			if (isPlainObject(layer)) continue;
			player[layer].resetTime += diff;
			if (tmp[layer].passiveGeneration) generatePoints(layer, diff * tmp[layer].passiveGeneration);
			if (layers[layer].update) layers[layer].update(diff);
		};
	};
	for (const row in OTHER_LAYERS) {
		for (const item in OTHER_LAYERS[row]) {
			const layer = OTHER_LAYERS[row][item];
			if (isPlainObject(layer)) continue;
			player[layer].resetTime += diff;
			if (tmp[layer].passiveGeneration) generatePoints(layer, diff * tmp[layer].passiveGeneration);
			if (layers[layer].update) layers[layer].update(diff);
		};
	};
	for (let x = maxTreeRow; x >= 0; x--) {
		for (const item in TREE_LAYERS[x]) {
			const layer = TREE_LAYERS[x][item];
			if (isPlainObject(layer)) continue;
			if (tmp[layer].autoPrestige && tmp[layer].canReset) doReset(layer);
			if (layers[layer].automate) layers[layer].automate();
			if (tmp[layer].autoUpgrade) autobuyUpgrades(layer);
		};
	};
	for (const row in OTHER_LAYERS) {
		for (const item in OTHER_LAYERS[row]) {
			const layer = OTHER_LAYERS[row][item];
			if (isPlainObject(layer)) continue;
			if (tmp[layer].autoPrestige && tmp[layer].canReset) doReset(layer);
			if (layers[layer].automate) layers[layer].automate();
			if (player[layer].best instanceof Decimal) player[layer].best = player[layer].best.max(player[layer].points);
			if (tmp[layer].autoUpgrade) autobuyUpgrades(layer);
		};
	};
	for (const layer in layers) {
		if (layers[layer].milestones) updateMilestones(layer);
		if (layers[layer].achievements) updateAchievements(layer);
	};
};

function hardReset(resetOptions = false) {
	if (!confirm("Are you sure you want to do this? You will lose all your progress!")) return;
	player = null;
	if (resetOptions) options = null;
	save(true);
	location.reload();
};

let ticking = false;

const INTERVAL = setInterval(() => {
	if (player === undefined || tmp === undefined || ticking || (tmp.gameEnded && !player.keepGoing)) return;
	ticking = true;
	const now = Date.now();
	let diff = (now - player.time) / 1e3;
	const trueDiff = diff;
	if (player.offTime !== undefined) {
		if (player.offTime.remain > modInfo.offlineLimit * 3600) player.offTime.remain = modInfo.offlineLimit * 3600;
		if (player.offTime.remain > 0) {
			let offlineDiff = Math.max(player.offTime.remain / 10, diff);
			player.offTime.remain -= offlineDiff;
			diff += offlineDiff;
		};
		if (!options.offlineProd || player.offTime.remain <= 0) player.offTime = undefined;
	};
	if (player.devSpeed !== undefined) diff *= player.devSpeed;
	player.time = now;
	if (needCanvasUpdate) {
		resizeCanvas();
		needCanvasUpdate = false;
	};
	tmp.scrolled = document.getElementById("treeTab") && document.getElementById("treeTab").scrollTop > 30;
	updateTemp();
	updateOomps(diff);
	updateWidth();
	updateTabFormats();
	gameLoop(diff);
	NaNcheck(player);
	adjustPopupTime(trueDiff);
	updateParticles(trueDiff);
	ticking = false;
}, 50);

setInterval(() => needCanvasUpdate = true, 500);
