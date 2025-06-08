function hasUpgrade(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.upgrades || !layers[layer].upgrades[id])) {
		console.warn("There was an attempt to check if the player has an upgrade with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].upgrades ? "upgrade does not exist" : "layer does not have any upgrades") : "layer does not exist") + ".");
		return false;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return player[layer].upgrades.includes(+id) || player[layer].upgrades.includes("" + id);
};

function hasMilestone(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.milestones || !layers[layer].milestones[id])) {
		console.warn("There was an attempt to check if the player has a milestone with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].milestones ? "milestone does not exist" : "layer does not have any milestones") : "layer does not exist") + ".");
		return false;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return player[layer].milestones.includes(+id) || player[layer].milestones.includes("" + id);
};

function hasAchievement(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.achievements || !layers[layer].achievements[id])) {
		console.warn("There was an attempt to check if the player has an achievement with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].achievements ? "achievement does not exist" : "layer does not have any achievements") : "layer does not exist") + ".");
		return false;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return player[layer].achievements.includes(+id) || player[layer].achievements.includes("" + id);
};

function hasChallenge(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.challenges || !layers[layer].challenges[id])) {
		console.warn("There was an attempt to check if the player has a challenge with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].challenges ? "challenge does not exist" : "layer does not have any challenges") : "layer does not exist") + ".");
		return false;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return player[layer].challenges[id];
};

function maxedChallenge(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.challenges || !layers[layer].challenges[id])) {
		console.warn("There was an attempt to check if the player has maxed a challenge with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].challenges ? "challenge does not exist" : "layer does not have any challenges") : "layer does not exist") + ".");
		return false;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit;
};

function challengeCompletions(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.challenges || !layers[layer].challenges[id])) {
		console.warn("There was an attempt to get the completion count of a challenge with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].challenges ? "challenge does not exist" : "layer does not have any challenges") : "layer does not exist") + ".");
		return 0;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return 0;
	return player[layer].challenges[id];
};

function canUseChallenge(layer, id) {
	if (inChallenge(layer, id)) return canExitChallenge(layer, id);
	return canEnterChallenge(layer, id);
};

function canEnterChallenge(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.challenges || !layers[layer].challenges[id])) {
		console.warn("There was an attempt to check if the player can enter a challenge with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].challenges ? "challenge does not exist" : "layer does not have any challenges") : "layer does not exist") + ".");
		return false;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return tmp[layer].challenges[id].canEnter ?? true;
};

function canExitChallenge(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.challenges || !layers[layer].challenges[id])) {
		console.warn("There was an attempt to check if the player can exit a challenge with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].challenges ? "challenge does not exist" : "layer does not have any challenges") : "layer does not exist") + ".");
		return false;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return tmp[layer].challenges[id].canExit ?? true;
};

function hasBuyable(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.buyables || !layers[layer].buyables[id])) {
		console.warn("There was an attempt to check if the player has a buyable with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].buyables ? "buyable does not exist" : "layer does not have any buyables") : "layer does not exist") + ".");
		return false;
	};
	if (!player[layer] || !player[layer].buyables[id] || !tmp[layer] || tmp[layer].deactivated) return false;
	return player[layer].buyables[id].gt(0);
};

function getBuyableAmount(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.buyables || !layers[layer].buyables[id])) {
		console.warn("There was an attempt to get the bought amount of a buyable with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].buyables ? "buyable does not exist" : "layer does not have any buyables") : "layer does not exist") + ".");
		return newDecimalZero();
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return newDecimalZero();
	return player[layer].buyables[id];
};

function setBuyableAmount(layer, id, amt) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.buyables || !layers[layer].buyables[id])) {
		console.warn("There was an attempt to set the bought amount of a buyable with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].buyables ? "buyable does not exist" : "layer does not have any buyables") : "layer does not exist") + ".");
		return;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return;
	player[layer].buyables[id] = amt;
};

function addBuyables(layer, id, amt) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.buyables || !layers[layer].buyables[id])) {
		console.warn("There was an attempt to add to the bought amount of a buyable with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].buyables ? "buyable does not exist" : "layer does not have any buyables") : "layer does not exist") + ".");
		return;
	};
	if (!player[layer] || !player[layer].buyables[id] || !tmp[layer] || tmp[layer].deactivated) return;
	player[layer].buyables[id] = player[layer].buyables[id].add(amt);
};

function getClickableState(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.clickables || !layers[layer].clickables[id])) {
		console.warn("There was an attempt to get the state of a clickable with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].clickables ? "clickable does not exist" : "layer does not have any clickables") : "layer does not exist") + ".");
		return undefined;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return undefined;
	return player[layer].clickables[id];
};

function setClickableState(layer, id, state) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.clickables || !layers[layer].clickables[id])) {
		console.warn("There was an attempt to set the state of a clickable with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].clickables ? "clickable does not exist" : "layer does not have any clickables") : "layer does not exist") + ".");
		return;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return;
	player[layer].clickables[id] = state;
};

function getGridData(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && !layers[layer]?.grid) {
		console.warn("There was an attempt to get the data of a gridable with id '" + id + "' in layer '" + layer + "', but that layer does not " + (layers[layer] ? "have a grid" : "exist") + ".");
		return undefined;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return undefined;
	return player[layer].grid[id];
};

function setGridData(layer, id, data) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && !layers[layer]?.grid) {
		console.warn("There was an attempt to set the data of a gridable with id '" + id + "' in layer '" + layer + "', but that layer does not " + (layers[layer] ? "have a grid" : "exist") + ".");
		return;
	};
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return;
	player[layer].grid[id] = data;
};

function upgradeEffect(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.upgrades || !layers[layer].upgrades[id])) {
		console.error("There was an attempt to get the effect of an upgrade with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].upgrades ? "upgrade does not exist" : "layer does not have any upgrades") : "layer does not exist") + ".");
		return undefined;
	};
	return tmp[layer].upgrades[id].effect;
};

function challengeEffect(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.challenges || !layers[layer].challenges[id])) {
		console.error("There was an attempt to get the effect of a challenge with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].challenges ? "challenge does not exist" : "layer does not have any challenges") : "layer does not exist") + ".");
		return undefined;
	};
	return tmp[layer].challenges[id].rewardEffect;
};

function buyableEffect(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.buyables || !layers[layer].buyables[id])) {
		console.error("There was an attempt to get the effect of a buyable with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].buyables ? "buyable does not exist" : "layer does not have any buyables") : "layer does not exist") + ".");
		return undefined;
	};
	return tmp[layer].buyables[id].effect;
};

function clickableEffect(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.clickables || !layers[layer].clickables[id])) {
		console.error("There was an attempt to get the effect of a clickable with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].clickables ? "clickable does not exist" : "layer does not have any clickables") : "layer does not exist") + ".");
		return undefined;
	};
	return tmp[layer].clickables[id].effect;
};

function milestoneEffect(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.milestones || !layers[layer].milestones[id])) {
		console.error("There was an attempt to get the effect of a milestone with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].milestones ? "milestone does not exist" : "layer does not have any milestones") : "layer does not exist") + ".");
		return undefined;
	};
	return tmp[layer].milestones[id].effect;
};

function achievementEffect(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && (!layers[layer]?.achievements || !layers[layer].achievements[id])) {
		console.error("There was an attempt to get the effect of a achievement with id '" + id + "' in layer '" + layer + "', but that " + (layers[layer] ? (layers[layer].achievements ? "achievement does not exist" : "layer does not have any achievements") : "layer does not exist") + ".");
		return undefined;
	};
	return tmp[layer].achievements[id].effect;
};

function gridEffect(layer, id) {
	if ((modInfo.friendlyErrors === undefined || modInfo.friendlyErrors) && !layers[layer]?.grid) {
		console.error("There was an attempt to get the effect of a gridable with id '" + id + "' in layer '" + layer + "', but that layer does not " + (layers[layer] ? "have a grid" : "exist") + ".");
		return undefined;
	};
	return gridRun(layer, "getEffect", player[layer].grid[id], id);
};
