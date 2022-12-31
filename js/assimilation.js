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
		return;
	};
	if (!confirm('Are you sure you want to start Assimilating ' + tmp[layer].name + '? This will reset all Assimilated layers content, all ' + tmp[layer].name + ' content, and put you in a run where only Assimilated layers and this layer will be active!')) return;
	// enter assimilation
	player.mo.assimilating = layer;
	// reset things
	player.points = new Decimal(0);
	for (let index = 0; index < player.mo.assimilated.length; index++) {
		tmp[player.mo.assimilated[index]].doReset('mo');
	};
	tmp[layer].doReset('mo');
};

// completes an assimilation run
const assimilationReq = {
	e: new Decimal('1e3555'),
	c: new Decimal(Infinity),
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
	if (player[layer].points.lt(assimilationReq[layer]) || !assimilationReq[layer]) return;
	if (!player.mo.assimilated.includes(layer)) player.mo.assimilated.push(layer);
	setClickableState('mo', 11, false);
	player.mo.assimilating = null;
	// reset things
	player.points = new Decimal(0);
	for (let index = 0; index < player.mo.assimilated.length; index++) {
		tmp[player.mo.assimilated[index]].doReset('mo');
	};
	unlockLayers();
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
	if (getClickableState('mo', 11) && assimilationOrder.includes(layer)) {
		if (assimilationOrder[player.mo.assimilated.length] === layer) {
			if (player.mo.assimilating === null) return () => {startAssimilation(layer); showTab(layer)};
			else return undefined;
		} else return () => {};
	};
};

// gets the assimilation rewards
function getAssimilationRewards() {
	let text = '';
	if (player.mo.assimilated.includes('e')) {
		if (colorvalue[1] != 'none' && colorvalue[0][2]) text += '<h2 class=layer-e>Essence</h2><br><br>Increases the cap of <b class=layer-e>Purer Essence</b> by 85<br>Improves the effect formulas of <b class=layer-e>Radiant Essence</b><br>Unlocks a new buyable, <b class=layer-e>Exponential Essence</b><br>Makes all essence upgrades always unlockable<br>Unlocks a new upgrade, <b class=layer-e>Essence of the Flow</b>';
		else text += '<h2>Essence</h2><br><br>Increases the cap of <b>Purer Essence</b> by 85<br>Improves the effect formulas of <b>Radiant Essence</b><br>Unlocks a new buyable, <b>Exponential Essence</b><br>Makes all essence upgrades always unlockable<br>Unlocks a new upgrade, <b>Essence of the Flow</b>';
	};
	return text;
};
