// checks if a layer is assimilated
function isAssimilated(layer) {
	return player.mo.assimilated.includes(layer);
};

// checks if a layer can be assimilated
const assimilationOrder = ['e', 'c', 'q', 'sp', 'h', 'ds', 'a', 'p', 's', 'r', 'm', 'gi', 'ei', 'w', 'cl', 'ch'];

function canAssimilate(layer) {
	return getClickableState('mo', 11) && (isAssimilated(layer) || assimilationOrder[player.mo.assimilated.length] === layer);
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
	c: new Decimal('5e555'),
	q: new Decimal('1e1355'),
	sp: new Decimal(110000),
	h: new Decimal('1e1060'),
	ds: new Decimal(1e122),
	a: new Decimal(75000),
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
	if (!isAssimilated(layer)) player.mo.assimilated.push(layer);
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
		if (isAssimilated(layer)) return 'You have already Assimilated ' + tmp[layer].name;
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
	if (getClickableState('mo', 11) && assimilationOrder.includes(layer) && !(isAssimilated(layer) && player.mo.assimilating)) {
		if (assimilationOrder[player.mo.assimilated.length] === layer) {
			if (player.mo.assimilating === null) return () => {if (startAssimilation(layer)) showTab(layer)};
			else return undefined;
		} else return () => {};
	};
};

// gets the assimilation rewards
function getAssimilationRewards() {
	let text = '';
	if (isAssimilated('e')) {
		text += '<br><br><h2 class="layer-mo">Assimilated</h2> <h2 class="layer-e">Essence</h2><br><br>';
		if (colorvalue[1] != 'none' && colorvalue[0][2]) text += 'Increases the cap of <b class="layer-e">Purer Essence</b> by 85<br>Improves the effect formulas of <b class="layer-e">Radiant Essence</b><br>Unlocks a new essence rebuyable, <b class="layer-e">Exponential Essence</b><br>Makes all previous essence upgrades always unlockable<br>Unlocks a new essence upgrade, <b class="layer-e">Essence of the Flow</b>';
		else text += 'Increases the cap of <b>Purer Essence</b> by 85<br>Improves the effect formulas of <b>Radiant Essence</b><br>Unlocks a new essence rebuyable, <b>Exponential Essence</b><br>Makes all previous essence upgrades always unlockable<br>Unlocks a new essence upgrade, <b>Essence of the Flow</b>';
	};
	if (isAssimilated('c')) {
		text += '<br><br><h2 class="layer-mo">Assimilated</h2> <h2 class="layer-c">Cores</h2><br><br>';
		if (colorvalue[1] != 'none' && colorvalue[0][2]) text += 'Increases the cost scaling and improves the effect formula of <b class="layer-c">Empowered Points</b><br>Increases the cap of <b class="layer-c">Empowered Essence</b> by 50<br>Unlocks a new core rebuyable, <b class="layer-c">Empowered Cores</b><br>Makes all previous core upgrades always unlockable<br>Unlocks three new core upgrades: <b class="layer-c">Core of the Flow</b>, <b class="layer-c">Core of Recursion</b>, and <b class="layer-c">Exponential Core</b>';
		else text += 'Increases the cost scaling and improves the effect formula of <b>Empowered Points</b><br>Increases the cap of <b>Empowered Essence</b> by 50<br>Unlocks a new core rebuyable, <b>Empowered Cores</b><br>Makes all previous core upgrades always unlockable<br>Unlocks three new core upgrades: <b>Core of the Flow</b>, <b>Core of Recursion</b>, and <b>Exponential Core</b>';
	};
	if (isAssimilated('q')) {
		text += '<br><br><h2 class="layer-mo">Assimilated</h2> <h2 class="layer-q">Quarks</h2><br><br>';
		if (colorvalue[1] != 'none' && colorvalue[0][2]) text += 'Unlocks unlocking the <b class="layer-q">Decipherer</b>, a new tab<br>Unlocks three new quark rebuyables: <b class="layer-q">Sample Quarks</b>, <b class="layer-q">Atomic Insight</b>, and <b class="layer-q">Analyze Essence</b><br>Makes all previous quark upgrades always unlockable<br>Unlocks ten new quark upgrades: <b class="layer-q">Quark of the Flow</b>, <b class="layer-q">Mystery Quark</b>, <b class="layer-q">Valued Mystery</b>, <b class="layer-q">Bigger Mystery</b>, <b class="layer-q">What\'s the Point?</b>, and <b class="layer-q">Purge the Mystery</b>';
		else text += 'Unlocks unlocking the <b>Decipherer</b>, a new tab<br>Unlocks three new quark rebuyables: <b>Sample Quarks</b>, <b>Atomic Insight</b>, and <b>Analyze Essence</b><br>Makes all previous quark upgrades always unlockable<br>Unlocks six new quark upgrades: <b>Quark of the Flow</b>, <b>Mystery Quark</b>, <b>Valued Mystery</b>, <b>Bigger Mystery</b>, <b>What\'s the Point?</b>, and <b>Purge the Mystery</b>>';
	};
	if (isAssimilated('sp')) {
		text += '<br><br><h2 class="layer-mo">Assimilated</h2> <h2 class="layer-sp">Subatomic Particles</h2><br><br>';
		if (colorvalue[1] != 'none' && colorvalue[0][2]) text += 'Makes you always be able to buy max subatomic particles<br>Increases the cap of <b class="layer-sp">Protons</b>, <b class="layer-sp">Neutrons</b>, and <b class="layer-sp">Electrons</b> by 90<br>Makes all previous subatomic particle upgrades always unlockable<br>Unlocks four new subatomic particle upgrades: <b class="layer-sp">Proton Decay</b>, <b class="layer-sp">Neutron Decay</b>, <b class="layer-sp">Electron Decay</b>, and <b class="layer-sp">Particle of the Flow</b>';
		else text += 'Makes you always be able to buy max subatomic particles<br>Increases the cap of <b>Protons</b>, <b>Neutrons</b>, and <b>Electrons</b> by 90<br>Makes all previous subatomic particle upgrades always unlockable<br>Unlocks four new subatomic particle upgrades: <b>Proton Decay</b>, <b>Neutron Decay</b>, <b>Electron Decay</b>, and <b>Particle of the Flow</b>';
	};
	if (isAssimilated('h')) {
		text += '<br><br><h2 class="layer-mo">Assimilated</h2> <h2 class="layer-h">Hexes</h2><br><br>';
		if (colorvalue[1] != 'none' && colorvalue[0][2]) text += 'Unlocks unlocking the <b class="layer-h">Breaker</b>, a new tab<br>Makes all previous hex upgrades always unlockable<br>Unlocks five new hex upgrades: <b class="layer-h">Hex the Hex</b>, <b class="layer-h">Hex the Core</b>, <b class="layer-h">Hexes are the Point</b>, <b class="layer-h">Hex of the Flow</b>, and <b class="layer-h">True Hexes</b><br>Makes the hex softcap start sooner (1e1000 --> 1e100)<br>Makes the hex softcap weaker (^0.5 --> ^0.51)';
		else text += 'Unlocks unlocking the <b>Breaker</b>, a new tab<br>Makes all previous hex upgrades always unlockable<br>Unlocks five new hex upgrades: <b>Hex the Hex</b>, <b>Hex the Core</b>, <b>Hexes are the Point</b>, <b>Hex of the Flow</b>, and <b>True Hexes</b><br>Makes the hex softcap start sooner (1e1000 --> 1e100)<br>Makes the hex softcap weaker (^0.5 --> ^0.51)';
	};
	if (isAssimilated('ds')) {
		text += '<br><br><h2 class="layer-mo">Assimilated</h2> <h2 class="layer-ds">Demon Souls</h2><br><br>';
		if (colorvalue[1] != 'none' && colorvalue[0][2]) text += 'Increases the cap of <b class="layer-ds">Demonic Energy</b> by 77<br>Makes the <b class="layer-ds">Demonic Energy</b> cost formula worse<br>Changes the goals of the first four demon soul challenges<br>Makes all previous demon soul upgrades always unlockable<br>Unlocks two new demon soul upgrades: <b class="layer-ds">Demonic Hexes</b> and <b class="layer-ds">Wider Gate</b>';
		else text += 'Increases the cap of <b>Demonic Energy</b> by 77<br>Makes the <b>Demonic Energy</b> cost formula worse<br>Changes the goals of the first four demon soul challenges<br>Makes all previous demon soul upgrades always unlockable<br>Unlocks two new demon soul upgrades: <b>Demonic Hexes</b> and <b>Wider Gate</b>';
	};
	if (isAssimilated('a')) {
		text += '<br><br><h2 class="layer-mo">Assimilated</h2> <h2 class="layer-a">Atoms</h2><br><br>';
		if (colorvalue[1] != 'none' && colorvalue[0][2]) text += 'Unlocks the <b class="layer-a">Atomic Reactor</b>, a new tab<br>Removes all <b class="layer-a">Atomic Tree</b> limitations<br>Unlocks <b class="layer-mo">Synergism</b>, a new tab<br>Unlocks the first <b class="layer-mo">Synergy</b>';
		else text += 'Unlocks the <b>Atomic Reactor</b>, a new tab<br>Removes all <b>Atomic Tree</b> limitations<br>Unlocks <b>Synergism</b>, a new tab<br>Unlocks the first <b>Synergy</b>';
	};
	return text.replace("<br><br>", "");
};

function extraMainDisplay(layer) {
	if (isAssimilated(layer)) return "<b class='layer-mo'>Assimilated</b> ";
};

// gets that glitchy text variable
function getGlitch(tweak = false) {
	// rounding
	let round = 0;
	if (hasUpgrade('q', 62)) round += 2.5;
	if (hasUpgrade('q', 65)) round += 2.5;
	// skewing
	let skew = 1;
	if (tweak) skew += 0.01;
	// multiplying
	let mult = 1;
	if (hasUpgrade('q', 53)) mult *= 10;
	if (hasUpgrade('q', 64)) mult *= 2.5;
	// frequency
	let frequency = 1;
	if (hasUpgrade('q', 53)) frequency *= 2;
	if (hasUpgrade('q', 54)) frequency /= 2;
	if (hasUpgrade('q', 65)) frequency *= 2;
	// calculate
	const val = Math.sin(new Date().getTime() / (2000 / frequency));
	// with rounding (based on the answer found here: https://math.stackexchange.com/a/107491)
	if (round) {
		const result = val * Math.sqrt((1 + (round ** 2)) / (1 + ((round ** 2) * (val ** 2))));
		if (tweak && hasMilestone('ch', 13)) return new Decimal(1.395e12).mul((result + skew) * mult).add(1);
		else return player.points.max(player.q.basePointTotal).add(1).log10().mul((result + skew) * mult).add(1);
	};
	// without rounding
	if (tweak && hasMilestone('ch', 13)) return new Decimal(1.395e12).mul((val + skew) * mult).add(1);
	else return player.points.max(player.q.basePointTotal).add(1).log10().mul((val + skew) * mult).add(1);
};
