// ************ Big Feature related ************

function respecBuyables(layer, ...args) {
	if (!layers[layer].buyables || !layers[layer].buyables.respec) return;
	if (!player[layer].noRespecConfirm && !confirm(tmp[layer].buyables.respecMessage || 'Are you sure you want to respec? This will force you to do a "' + (tmp[layer].name ? tmp[layer].name : layer) + '" reset as well!')) return;
	run(layers[layer].buyables.respec, layers[layer].buyables, ...args);
	updateBuyableTemp(layer);
	document.activeElement.blur();
};

function canAffordUpgrade(layer, id) {
	let upg = tmp[layer].upgrades[id];
	if (tmp[layer].deactivated || upg.canAfford === false) return false;
	if (upg.cost !== undefined) return canAffordPurchase(layer, upg, upg.cost);
	return true;
};

function canBuyBuyable(layer, id) {
	let b = temp[layer].buyables[id];
	return (b.unlocked && run(b.canAfford, b) && player[layer].buyables[id].lt(b.purchaseLimit) && !tmp[layer].deactivated);
};

function canAffordPurchase(layer, thing, cost) {
	if (thing.currencyInternalName) {
		let name = thing.currencyInternalName;
		if (thing.currencyLocation) {
			return thing.currencyLocation[name].gte(cost);
		} else if (thing.currencyLayer) {
			return player[thing.currencyLayer][name].gte(cost);
		} else {
			return player[name].gte(cost);
		};
	} else {
		return player[layer].points.gte(cost);
	};
};

function buyUpgrade(layer, id) {
	buyUpg(layer, id);
};

function buyUpg(layer, id) {
	if (!tmp[layer].upgrades || !tmp[layer].upgrades[id]) return;
	let upg = tmp[layer].upgrades[id];
	if (!player[layer].unlocked || player[layer].deactivated || !upg.unlocked || player[layer].upgrades.includes(id) || upg.canAfford === false) return;
	let pay = layers[layer].upgrades[id].pay;
	if (pay !== undefined) {
		run(pay, layers[layer].upgrades[id]);
	} else {
		let cost = upg.cost;
		if (upg.currencyInternalName) {
			let name = upg.currencyInternalName;
			if (upg.currencyLocation) {
				if (upg.currencyLocation[name].lt(cost)) return;
				upg.currencyLocation[name] = upg.currencyLocation[name].sub(cost);
			} else if (upg.currencyLayer) {
				let lr = upg.currencyLayer;
				if (player[lr][name].lt(cost)) return;
				player[lr][name] = player[lr][name].sub(cost);
			} else {
				if (player[name].lt(cost)) return;
				player[name] = player[name].sub(cost);
			}
		} else {
			if (player[layer].points.lt(cost)) return;
			player[layer].points = player[layer].points.sub(cost);
		};
	};
	player[layer].upgrades.push(id);
	if (upg.onPurchase !== undefined) {
		run(upg.onPurchase, upg);
	};
	needCanvasUpdate = true;
};

function buyMaxBuyable(layer, id) {
	if (!player[layer].unlocked || tmp[layer].deactivated || !tmp[layer].buyables[id].unlocked || !tmp[layer].buyables[id].canBuy || !layers[layer].buyables[id].buyMax) return;
	run(layers[layer].buyables[id].buyMax, layers[layer].buyables[id]);
	updateBuyableTemp(layer);
};

function buyBuyable(layer, id) {
	if (!player[layer].unlocked || tmp[layer].deactivated || !tmp[layer].buyables[id].unlocked || !tmp[layer].buyables[id].canBuy) return;
	run(layers[layer].buyables[id].buy, layers[layer].buyables[id]);
	updateBuyableTemp(layer);
};

function clickClickable(layer, id) {
	if (!player[layer].unlocked || tmp[layer].deactivated || !tmp[layer].clickables[id].unlocked || !tmp[layer].clickables[id].canClick) return;
	run(layers[layer].clickables[id].onClick, layers[layer].clickables[id]);
	updateClickableTemp(layer);
};

function clickGrid(layer, id) {
	if (!player[layer].unlocked || tmp[layer].deactivated || !run(layers[layer].grid.getUnlocked, layers[layer].grid, id) || !gridRun(layer, 'getCanClick', player[layer].grid[id], id)) return;
	gridRun(layer, 'onClick', player[layer].grid[id], id);
};

// Function to determine if the player is in a challenge
function inChallenge(layer, id) {
	let challenge = player[layer].activeChallenge;
	if (!challenge) return false;
	if (challenge == id) return true;
	if (layers[layer].challenges[challenge].countsAs) {
		return tmp[layer].challenges[challenge].countsAs.includes(+id);
	};
	return false;
};

// ************ Misc ************

let onTreeTab = true;

function showTab(name) {
	if (LAYERS.includes(name) && !layerUnlocked(name)) return;
	if (player.tab !== name) clearParticles(p => p.layer === player.tab);
	if (tmp[name] && player.tab === name && isPlainObject(tmp[name].tabFormat)) {
		player.subtabs[name].mainTabs = Object.keys(layers[name].tabFormat)[0];
	};
	player.tab = name;
	if (tmp[name] && tmp[name].row !== 'side' && tmp[name].row !== 'otherside') player.lastSafeTab = name;
	updateTabFormats();
	needCanvasUpdate = true;
	document.activeElement.blur();
};

function showNavTab(name, prev) {
	console.log(prev);
	if (LAYERS.includes(name) && !layerUnlocked(name)) return;
	if (player.navTab !== name) clearParticles(p => p.layer === player.navTab);
	if (tmp[name] && tmp[name].previousTab !== undefined) prev = tmp[name].previousTab;
	console.log(name, prev);
	if (name !== 'none' && prev && !tmp[prev]?.leftTab === !tmp[name]?.leftTab) player[name].prevTab = prev;
	else if (player[name]) player[name].prevTab = '';
	player.navTab = name;
	updateTabFormats();
	needCanvasUpdate = true;
};

function goBack(layer) {
	let nextTab = 'none';
	if (player[layer].prevTab) nextTab = player[layer].prevTab;
	if (player.navTab === 'none' && (tmp[layer]?.row === 'side' || tmp[layer].row === 'otherside')) nextTab = player.lastSafeTab;
	if (tmp[layer].leftTab) showNavTab(nextTab, layer);
	else showTab(nextTab, layer);
};

function layOver(obj1, obj2) {
	for (let x in obj2) {
		if (obj2[x] instanceof Decimal) obj1[x] = new Decimal(obj2[x]);
		else if (obj2[x] instanceof Object) layOver(obj1[x], obj2[x]);
		else obj1[x] = obj2[x];
	};
};

function prestigeNotify(layer) {
	if (layers[layer].prestigeNotify) return layers[layer].prestigeNotify();
	if (isPlainObject(tmp[layer].tabFormat)) {
		for (subtab in tmp[layer].tabFormat) {
			if (subtabResetNotify(layer, 'mainTabs', subtab)) return true;
		};
	};
	for (family in tmp[layer].microtabs) {
		for (subtab in tmp[layer].microtabs[family]) {
			if (subtabResetNotify(layer, family, subtab)) return true;
		};
	};
	if (tmp[layer].autoPrestige || tmp[layer].passiveGeneration) return false;
	else if (tmp[layer].type == 'static') return tmp[layer].canReset;
	else if (tmp[layer].type == 'normal') return tmp[layer].canReset && tmp[layer].resetGain.gte(player[layer].points.div(10));
	else return false;
};

function notifyLayer(name) {
	if (player.tab == name || !layerUnlocked(name)) return;
	player.notify[name] = 1;
};

function subtabShouldNotify(layer, family, id) {
	let subtab = {};
	if (family === 'mainTabs') subtab = tmp[layer].tabFormat[id];
	else subtab = tmp[layer].microtabs[family][id];
	if (!subtab.unlocked) return false;
	if (subtab.embedLayer) return tmp[subtab.embedLayer].notify;
	return subtab.shouldNotify;
};

function subtabResetNotify(layer, family, id) {
	let subtab = {};
	if (family === 'mainTabs') subtab = tmp[layer].tabFormat[id];
	else subtab = tmp[layer].microtabs[family][id];
	if (subtab.embedLayer) return tmp[subtab.embedLayer].prestigeNotify;
	return subtab.prestigeNotify;
};

function nodeShown(layer) {
	return layerShown(layer);
};

function layerUnlocked(layer) {
	if (tmp[layer] && tmp[layer].type == 'none') return player[layer].unlocked;
	return LAYERS.includes(layer) && (player[layer].unlocked || (tmp[layer].canReset && tmp[layer].layerShown));
};

function keepGoing() {
	player.keepGoing = true;
	needCanvasUpdate = true;
};

function toNumber(x) {
	if (x.mag !== undefined) return x.toNumber();
	if (x + 0 !== x) return parseFloat(x);
	return x;
};

function updateMilestones(layer) {
	if (tmp[layer].deactivated) return;
	for (id in layers[layer].milestones) {
		if (layers[layer].milestones[id] === undefined) return;
		if (layers[layer].milestones[id].done === undefined) {
			layers[layer].milestones[id] = undefined;
			return;
		};
		if (!hasMilestone(layer, id) && layers[layer].milestones[id].done()) {
			player[layer].milestones.push(id);
			if (layers[layer].milestones[id].onComplete) layers[layer].milestones[id].onComplete();
			let color = tmp[layer].color;
			if (layers[layer].milestones[id].popupColor) color = layers[layer].milestones[id].popupColor;
			let popupTitle = (tmp[layer].milestones[id].popupTitle !== undefined ? tmp[layer].milestones[id].popupTitle : '');
			if ((tmp[layer].milestonePopups || tmp[layer].milestonePopups === undefined) && !options.hideMilestonePopups) doPopup('milestone', tmp[layer].milestones[id].requirementDescription, popupTitle, 3, color);
			player[layer].lastMilestone = id;
		};
	};
};

function updateAchievements(layer) {
	if (tmp[layer].deactivated) return;
	for (id in layers[layer].achievements) {
		if (isPlainObject(layers[layer].achievements[id]) && !hasAchievement(layer, id) && layers[layer].achievements[id].done()) {
			player[layer].achievements.push(id);
			if (layers[layer].achievements[id].onComplete) layers[layer].achievements[id].onComplete();
			let color = tmp[layer].color;
			if (layers[layer].achievements[id].popupColor) color = layers[layer].achievements[id].popupColor;
			let popupTitle = (tmp[layer].achievements[id].popupTitle !== undefined ? tmp[layer].achievements[id].popupTitle : '');
			if (tmp[layer].achievementPopups || tmp[layer].achievementPopups === undefined) doPopup('achievement', tmp[layer].achievements[id].name, popupTitle, 3, color);
		};
	};
};

function addTime(diff, layer) {
	let data = player;
	let time = data.timePlayed;
	if (layer) {
		data = data[layer];
		time = data.time;
	};
	// I am not that good to perfectly fix that leak. ~ DB Aarex
	if (time + 0 !== time) {
		console.log('Memory leak detected. Trying to fix...');
		time = toNumber(time);
		if (isNaN(time) || time == 0) {
			console.log("Couldn't fix! Resetting...");
			time = layer ? player.timePlayed : 0;
			if (!layer) player.timePlayedReset = true;
		};
	};
	time += toNumber(diff);
	if (layer) data.time = time;
	else data.timePlayed = time;
};

let focused = false;
let shiftDown = false;
let ctrlDown = false;

document.onkeydown = e => {
	if (player === undefined) return;
	shiftDown = e.shiftKey;
	ctrlDown = e.ctrlKey;
	if (tmp.gameEnded && !player.keepGoing) return;
	if (ctrlDown) options.nerdMode = !options.nerdMode;
	let key = e.key;
	if (ctrlDown) key = 'ctrl+' + key;
	if (focused) return;
	if (ctrlDown && hotkeys[key]) e.preventDefault();
	if (hotkeys[key]) {
		let k = hotkeys[key];
		if (player[k.layer].unlocked && tmp[k.layer].hotkeys[k.id].unlocked) k.onPress();
	};
};

document.onkeyup = e => {
	shiftDown = e.shiftKey;
	ctrlDown = e.ctrlKey;
};

function isPlainObject(obj) {
	return !!obj && obj.constructor === Object;
};

document.title = modInfo.name;

// Converts a string value to whatever it's supposed to be
function toValue(value, oldValue) {
	if (oldValue instanceof Decimal) {
		value = new Decimal(value);
		if (value.isNaN()) return newDecimalZero();
		return value;
	};
	if (!isNaN(oldValue)) return parseFloat(value) || 0;
	return value;
};

// Variables that must be defined to display popups
let activePopups = Vue.reactive([]);
let popupID = 0;

// Function to show popups
function doPopup(type = 'none', text = 'This is a test popup.', title = '', timer = 3, color = '') {
	switch (type) {
		case 'achievement':
			popupTitle = 'Achievement Unlocked!';
			popupType = 'achievement-popup';
			break;
		case 'milestone':
			popupTitle = 'Milestone Achieved!';
			popupType = 'milestone-popup';
			break;
		default:
			popupTitle = 'Something Happened?';
			popupType = 'default-popup';
			break;
	};
	if (title != '') popupTitle = title;
	activePopups.push({"time": timer, "type": popupType, "title": popupTitle, "message": text + "<br>", "id": popupID, "color": color});
	popupID++;
};

// Function to reduce time on active popups
function adjustPopupTime(diff) {
	for (popup in activePopups) {
		activePopups[popup].time -= diff;
		if (activePopups[popup].time < 0) {
			activePopups.splice(popup, 1); // Remove popup when time hits 0
		};
	};
};

function run(func, target, ...args) {
	if (typeof func == "function") {
		let bound = func.bind(target);
		return bound(...args);
	};
	return func;
};

function gridRun(layer, func, data, id) {
	if (typeof layers[layer].grid[func] == "function") {
		let bound = layers[layer].grid[func].bind(layers[layer].grid);
		return bound(data, id);
	};
	return layers[layer].grid[func];
};
