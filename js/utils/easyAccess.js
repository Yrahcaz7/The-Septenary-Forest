function hasUpgrade(layer, id) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return (player[layer].upgrades.includes(+id) || player[layer].upgrades.includes("" + id));
};

function hasMilestone(layer, id) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return (player[layer].milestones.includes(+id) || player[layer].milestones.includes("" + id));
};

function hasAchievement(layer, id) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return (player[layer].achievements.includes(+id) || player[layer].achievements.includes("" + id));
};

function hasChallenge(layer, id) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return (player[layer].challenges[id]);
};

function maxedChallenge(layer, id) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return false;
	return (player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit);
};

function challengeCompletions(layer, id) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return 0;
	return (player[layer].challenges[id]);
};

function hasBuyable(layer, id) {
	if (!player[layer] || !player[layer].buyables[id] || !tmp[layer] || tmp[layer].deactivated) return false;
	return (player[layer].buyables[id].gt(0));
};

function getBuyableAmount(layer, id) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return new Decimal(0);
	return (player[layer].buyables[id]);
};

function setBuyableAmount(layer, id, amt) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return;
	player[layer].buyables[id] = amt;
};

function addBuyables(layer, id, amt) {
	if (!player[layer] || !player[layer].buyables[id] || !tmp[layer] || tmp[layer].deactivated) return;
	player[layer].buyables[id] = player[layer].buyables[id].add(amt);
};

function getClickableState(layer, id) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return undefined;
	return (player[layer].clickables[id]);
};

function setClickableState(layer, id, state) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return;
	player[layer].clickables[id] = state;
};

function getGridData(layer, id) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return undefined;
	return (player[layer].grid[id]);
};

function setGridData(layer, id, data) {
	if (!player[layer] || !tmp[layer] || tmp[layer].deactivated) return;
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

function milestoneEffect(layer, id) {
	return (tmp[layer].milestones[id].effect);
};

function achievementEffect(layer, id) {
	return (tmp[layer].achievements[id].effect);
};

function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id));
};
