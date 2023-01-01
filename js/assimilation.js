// checks if a layer is assimilated
function isAssimilated(layer) {
	return player.mo.assimilated.includes(layer);
};

// checks if a layer can be assimilated
const assimilationOrder = ['e', 'c', 'q', 'sp', 'h', 'ds', 'a', 'p', 's', 'r', 'm', 'gi', 'ei', 'w', 'cl', 'ch'];

function canAssimilate(layer) {
	return getClickableState('mo', 11) && (player.mo.assimilated.includes(layer) || assimilationOrder[player.mo.assimilated.length] === layer);
};

// enters an assimilation run
function startAssimilation(layer) {
	// confirmation and such
	if (!tmp[layer]) {
		console.error("'" + layer + "' is not a valid layer");
		return false;
	};
	if (!confirm('Are you sure you want to start Assimilating ' + tmp[layer].name + '? This will reset all Assimilated layers content, all ' + tmp[layer].name + ' content, and put you in a run where only Assimilated layers and this layer will be active!')) return false;
	// enter assimilation
	player.mo.assimilating = layer;
	// reset things
	player.points = new Decimal(0);
	for (let index = 0; index < player.mo.assimilated.length; index++) {
		tmp[player.mo.assimilated[index]].doReset('mo');
	};
	tmp[layer].doReset('mo');
	return true;
};

// completes an assimilation run
const assimilationReq = {
	e: new Decimal('1e3555'),
	c: new Decimal('1e550'),
	q: new Decimal(Infinity),
	sp: new Decimal(Infinity),
	h: new Decimal(Infinity),
	ds: new Decimal(Infinity),
	a: new Decimal(Infinity),
	p: new Decimal(Infinity),
	s: new Decimal(Infinity),
	r: new Decimal(Infinity),
	m: new Decimal(Infinity),
	gi: new Decimal(Infinity),
	ei: new Decimal(Infinity),
	w: new Decimal(Infinity),
	cl: new Decimal(Infinity),
	ch: new Decimal(Infinity),
};

function completeAssimilation(layer) {
	// exit assimilation
	if (player[layer].points.lt(assimilationReq[layer]) || !assimilationReq[layer]) return false;
	if (!player.mo.assimilated.includes(layer)) player.mo.assimilated.push(layer);
	setClickableState('mo', 11, false);
	player.mo.assimilating = null;
	// reset things
	player.points = new Decimal(0);
	for (let index = 0; index < player.mo.assimilated.length; index++) {
		tmp[player.mo.assimilated[index]].doReset('mo');
	};
	unlockLayers();
	return true;
};

// lock non-assimilated layers
function lockLayers() {
	player.mo.hadLayers = [];
	for (const layer in player) {
		if (player[layer]?.unlocked && !canAssimilate(layer) && assimilationOrder.includes(layer)) {
			player[layer].unlocked = false;
			player.mo.hadLayers.push(layer);
		};
	};
};

// unlock non-assimilated layers
function unlockLayers() {
	for (const layer in player) {
		if (player.mo.hadLayers.includes(layer)) player[layer].unlocked = true;
	};
};

// override tooltips
function overrideTooltip(layer) {
	if (getClickableState('mo', 11) && assimilationOrder.includes(layer) && player.mo.assimilating === null) {
		if (player.mo.assimilated.includes(layer)) return 'You have already Assimilated ' + tmp[layer].name;
		else if (assimilationOrder[player.mo.assimilated.length] === layer) return 'You can Assimilate ' + tmp[layer].name;
		else return 'You cannot Assimilate ' + tmp[layer].name + ' yet';
	};
};

// override point display
function overridePointDisplay() {
	if (getClickableState('mo', 11) && player.mo.assimilating === null) return 'You have <h2 id="points">' + formatWhole(player.mo.assimilated.length) + '</h2> Assimilated layers';
};

// override tree node clicks
function overrideTreeNodeClick(layer) {
	if (getClickableState('mo', 11) && assimilationOrder.includes(layer) && !(player.mo.assimilated.includes(layer) && player.mo.assimilating)) {
		if (assimilationOrder[player.mo.assimilated.length] === layer) {
			if (player.mo.assimilating === null) return () => {if (startAssimilation(layer)) showTab(layer)};
			else return undefined;
		} else return () => {};
	};
};

// gets the assimilation rewards
function getAssimilationRewards() {
	let text = '';
	if (player.mo.assimilated.includes('e')) {
		if (colorvalue[1] != 'none' && colorvalue[0][2]) text += '<br><br><h2 class=layer-e>Essence</h2><br><br>Increases the cap of <b class=layer-e>Purer Essence</b> by 85<br>Improves the effect formulas of <b class=layer-e>Radiant Essence</b><br>Unlocks a new essence rebuyable, <b class=layer-e>Exponential Essence</b><br>Makes all previous essence upgrades always unlockable<br>Unlocks a new essence upgrade, <b class=layer-e>Essence of the Flow</b>';
		else text += '<br><br><h2>Essence</h2><br><br>Increases the cap of <b>Purer Essence</b> by 85<br>Improves the effect formulas of <b>Radiant Essence</b><br>Unlocks a new essence rebuyable, <b>Exponential Essence</b><br>Makes all previous essence upgrades always unlockable<br>Unlocks a new essence upgrade, <b>Essence of the Flow</b>';
	};
	if (player.mo.assimilated.includes('c')) {
		if (colorvalue[1] != 'none' && colorvalue[0][2]) text += '<br><br><h2 class=layer-c>Cores</h2><br><br>Increases the cost scaling and improves the effect formula of <b class=layer-c>Empowered Points</b><br>Increases the cap of <b class=layer-c>Empowered Essence</b> by 50<br>Unlocks a new core rebuyable, <b class=layer-c>Empowered Cores</b><br>Makes all previous core upgrades always unlockable<br>Unlocks three new core upgrades, <b class=layer-c>Core of the Flow</b>, <b class=layer-c>Core of Recursion</b>, and <b class=layer-c>Exponential Core</b>';
		else text += '<br><br><h2>Cores</h2><br><br>Increases the cost scaling and improves the effect formula of <b>Empowered Points</b><br>Increases the cap of <b>Empowered Essence</b> by 50<br>Unlocks a new core rebuyable, <b>Empowered Cores</b><br>Makes all previous core upgrades always unlockable<br>Unlocks three new core upgrades, <b>Core of the Flow</b>, <b>Core of Recursion</b>, and <b>Exponential Core</b>';
	};
	return text.replace("<br><br>", "");
};
