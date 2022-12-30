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
	if (!tmp[layer]) {
		console.error("'" + layer + "' is not a valid layer");
		return;
	};
	if (!confirm('Are you sure you want to start Assimilating ' + tmp[layer].name + '? This will reset all Assimilated layers content and ' + tmp[layer].name + ' content and put you in a run where only Assimilated Layers and this layer will be active!')) return;
	player.mo.assimilating = layer;
	for (let index = 0; index < player.mo.assimilated.length; index++) {
		tmp[player.mo.assimilated[index]].doReset('mo');
	};
	tmp[layer].doReset('mo');
};

// completes an assimilation run
const assimilationReq = {
	e: new Decimal('1e1000'),
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
	if (getClickableState('mo', 11) && assimilationOrder.includes(layer)) {
		if (player.mo.assimilated.includes(layer)) return 'You have already Assimilated ' + tmp[layer].name;
		else if (assimilationOrder[player.mo.assimilated.length] === layer) return 'You can Assimilate ' + tmp[layer].name;
		else return 'You cannot Assimilate ' + tmp[layer].name + ' yet';
	};
};
