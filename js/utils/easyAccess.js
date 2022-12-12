function hasUpgrade(layer, id) {
	return ((player[layer].upgrades.includes(+id) || player[layer].upgrades.includes("" + id)) && !tmp[layer].deactivated);
};

function hasMilestone(layer, id) {
	return ((player[layer].milestones.includes(+id) || player[layer].milestones.includes("" + id)) && !tmp[layer].deactivated);
};

function hasAchievement(layer, id) {
	return ((player[layer].achievements.includes(+id) || player[layer].achievements.includes("" + id)) && !tmp[layer].deactivated);
};

function hasChallenge(layer, id) {
	return ((player[layer].challenges[id]) && !tmp[layer].deactivated);
};

function maxedChallenge(layer, id) {
	return ((player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit) && !tmp[layer].deactivated);
};

function challengeCompletions(layer, id) {
	return (player[layer].challenges[id]);
};

function hasBuyable(layer, id) {
	return ((new Decimal(player[layer].buyables[id]).gt(0)) && !tmp[layer].deactivated);
};

function getBuyableAmount(layer, id) {
	return (player[layer].buyables[id]);
};

function setBuyableAmount(layer, id, amt) {
	player[layer].buyables[id] = amt;
};

function addBuyables(layer, id, amt) {
	player[layer].buyables[id] = player[layer].buyables[id].add(amt);
};

function getClickableState(layer, id) {
	return (player[layer].clickables[id]);
};

function setClickableState(layer, id, state) {
	player[layer].clickables[id] = state;
};

function getGridData(layer, id) {
	return (player[layer].grid[id]);
};

function setGridData(layer, id, data) {
	player[layer].grid[id] = data;
};

function upgradeEffect(layer, id) {
	return (tmp[layer].upgrades[id].effect);
};

function challengeEffect(layer, id) {
	return (tmp[layer].challenges[id].rewardEffect);
};

function buyableEffect(layer, id) {
	return (tmp[layer].buyables[id].effect);
};

function clickableEffect(layer, id) {
	return (tmp[layer].clickables[id].effect);
};

function achievementEffect(layer, id) {
	return (tmp[layer].achievements[id].effect);
};

function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id));
};
