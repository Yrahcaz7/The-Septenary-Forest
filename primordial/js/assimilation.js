const ASSIMILATION_ORDER = ["e", "c", "q", "sp", "h", "ds", "a", "p", "s", "r", "m", "gi", "ei", "w", "cl"];

function isAssimilated(layer) {
	return player.mo.assimilated.includes(layer);
};

function canEnterAssimilationRun(layer) {
	return getClickableState("mo", 11) && (isAssimilated(layer) || ASSIMILATION_ORDER[player.mo.assimilated.length] === layer);
};

function enterAssimilationRun(layer) {
	// confirmation and such
	if (!tmp[layer]) {
		console.error("'" + layer + "' is not a valid layer");
		return false;
	};
	if (!confirm("Are you sure you want to start Assimilating " + (tmp[layer].pluralName || tmp[layer].name) + "? This will reset all Assimilated layers content, all " + tmp[layer].name + " content, and put you in a run where only Assimilated layers and this layer will be active!")) return false;
	// enter assimilation
	player.mo.assimilating = layer;
	// reset things
	player.points = newDecimalZero();
	for (let index = 0; index < player.mo.assimilated.length; index++) {
		tmp[player.mo.assimilated[index]].doReset("mo");
	};
	tmp[layer].doReset("mo");
	return true;
};

// checks if the player is in a glitched assimilation search
function inGlitchedAssimilationSearch() {
	return getClickableState("mo", 11) && player.mo.assimilated.length >= tmp.mo.clickables[11].limit;
};

// returns the input string, glitchifying it if neccessary
function glitchify(string) {
	if (!inGlitchedAssimilationSearch()) return string;
	let inTag = false;
	let inHeader = false;
	return string.replace(/<h|<\/|<|>|&nbsp;|[A-Za-z]+(?![A-Za-z0-9])/g, substr => {
		if (substr.startsWith("<")) {
			inTag = true;
			if (substr == "<h") inHeader = true;
			if (substr == "</") inHeader = false;
			return substr;
		};
		if (substr == ">") {
			inTag = false;
			return substr;
		};
		if (inTag || inHeader || substr.startsWith("&") || substr.startsWith("Assimilat")) {
			return substr;
		};
		return randomStr(substr.length);
	});
};

const ASSIMILATION_REQUIREMENTS = {
	e: new Decimal("1e3555"),
	c: new Decimal("5e555"),
	q: new Decimal("1e1355"),
	sp: new Decimal(110_000),
	h: new Decimal("1e1060"),
	ds: new Decimal(1e122),
	a: new Decimal(75_000),
	p: new Decimal("1e2000"),
	s: new Decimal(52),
	r: new Decimal(95),
	m: new Decimal(1e64),
	gi: new Decimal(700),
	ei: new Decimal(1640),
	w: new Decimal(272),
	cl: new Decimal(25_000),
};

function completeAssimilationRun(layer) {
	// exit assimilation
	if (player[layer].points.lt(ASSIMILATION_REQUIREMENTS[layer]) || !ASSIMILATION_REQUIREMENTS[layer]) return false;
	if (!isAssimilated(layer)) player.mo.assimilated.push(layer);
	setClickableState("mo", 11, false);
	player.mo.assimilating = null;
	// reset things
	player.points = newDecimalZero();
	for (let index = 0; index < player.mo.assimilated.length; index++) {
		tmp[player.mo.assimilated[index]].doReset("mo");
	};
	unlockNonAssimilatedLayers();
	return true;
};

function lockNonAssimilatedLayers() {
	player.mo.hadLayers = [];
	for (const layer in player) {
		if (player[layer]?.unlocked && !canEnterAssimilationRun(layer) && ASSIMILATION_ORDER.includes(layer)) {
			player[layer].unlocked = false;
			player.mo.hadLayers.push(layer);
		};
	};
};

function unlockNonAssimilatedLayers() {
	for (const layer in player) {
		if (player.mo.hadLayers.includes(layer)) player[layer].unlocked = true;
	};
};

function overrideTooltip(layer) {
	if (getClickableState("mo", 11) && player.mo.assimilating === null) {
		if (ASSIMILATION_ORDER.includes(layer)) {
			const name = tmp[layer].pluralName || tmp[layer].name;
			if (isAssimilated(layer)) return glitchify("You have already Assimilated " + name);
			if (ASSIMILATION_ORDER[player.mo.assimilated.length] === layer) return "You can Assimilate " + name;
			return "You cannot Assimilate " + name + " yet";
		};
		if (!tmp[layer].tooltip) {
			return glitchify(formatWhole(player[layer].points) + " " + tmp[layer].resource);
		};
	};
};

function overridePointDisplay() {
	if (getClickableState("mo", 11) && player.mo.assimilating === null) {
		return glitchify("You have <h2 id='points'>" + formatWhole(player.mo.assimilated.length) + "</h2>/" + formatWhole(tmp.mo.clickables[11].limit) + " Assimilated layers");
	};
};

function overrideTreeNodeClick(layer) {
	if (getClickableState("mo", 11) && ASSIMILATION_ORDER.includes(layer) && !(isAssimilated(layer) && player.mo.assimilating)) {
		if (ASSIMILATION_ORDER[player.mo.assimilated.length] === layer) {
			if (player.mo.assimilating === null) return () => { if (enterAssimilationRun(layer)) showTab(layer) };
		} else {
			return () => {};
		};
	};
};

const ASSIMILATION_REWARDS = [[
	["Makes all previous essence rebuyables and upgrades always unlockable"],
	["Increases the cap of", "Purer Essence", "by 85"],
	["Improves the effect formulas of", "Radiant Essence"],
	["Unlocks one new essence rebuyable:", "Exponential Essence"],
	["Unlocks one new essence upgrade:", "Essence of the Flow"],
], [
	["Increases the cost scaling and improves the effect formula of", "Empowered Points"],
	["Increases the cap of", "Empowered Essence", "by 50"],
	["Unlocks one new core rebuyable:", "Empowered Cores"],
	["Makes all previous core upgrades always unlockable"],
	["Unlocks three new core upgrades:", "Core of the Flow", ",", "Core of Recursion", ", and", "Exponential Core"],
], [
	["Unlocks unlocking", "The Decipherer", ", a new tab"],
	["Unlocks three new quark rebuyables:", "Sample Quarks", ",", "Atomic Insight", ", and", "Analyze Essence"],
	["Makes all previous quark upgrades always unlockable"],
	["Unlocks six new quark upgrades:", "Quark of the Flow", ",", "Mystery Quark", ",", "Valued Mystery", ",", "Bigger Mystery", ",", "What's the Point?", ", and", "Purge the Mystery"],
], [
	["Makes you always be able to buy max subatomic particles"],
	["Increases the cap of", "Protons", ",", "Neutrons", ", and", "Electrons", "by 90"],
	["Makes all previous subatomic particle upgrades always unlockable"],
	["Unlocks four new subatomic particle upgrades:", "Proton Decay", ",", "Neutron Decay", ",", "Electron Decay", ", and", "Particle of the Flow"],
], [
	["Unlocks unlocking", "The Breaker", ", a new tab"],
	["Makes all previous hex upgrades always unlockable"],
	["Unlocks five new hex upgrades:", "Hex the Hex", ",", "Hex the Core", ",", "Hexes are the Point", ",", "Hex of the Flow", ", and", "True Hexes"],
	["Makes the hex gain softcap start sooner (1e1000 --> 1e100)"],
	["Makes the hex gain softcap weaker (^0.5 --> ^0.51)"],
], [
	["Increases the cap of", "Demonic Energy", "by 77"],
	["Makes the", "Demonic Energy", "cost formula worse"],
	["Makes all previous demon soul upgrades and challenges always unlockable"],
	["Changes the goals of the first four demon soul challenges"],
	["Unlocks two new demon soul upgrades:", "Demonic Hexes", "and", "Wider Gate"],
], [
	["Unlocks", "Atomic Reactor", ", a new tab"],
	["Removes all", "Atomic Tree", "limitations"],
	["Unlocks", ["mo", "Synergism"], ", a new tab"],
	["Unlocks the first", ["mo", "Synergy"]],
], [
	["Makes all previous prayer upgrades always unlockable"],
	["Unlocks four new prayer upgrades:", "Sanctum Prayers+", ",", "The Point of Prayers", ",", "Prayer Influence+", ", and", "Prismatic Sanctums"],
	["Makes the prayer effect softcap start sooner (1e150 --> 1e15)"],
	["Makes the prayer effect softcap weaker (^0.95 --> ^0.96)"],
], [
	["Unlocks", "Glow", ", a new tab"],
	["Unlocks three new sanctum rebuyables:", "Glowing Worship", ",", "Glowing Sacrifice", ", and", "Glowing Sacrificial Ceremony"],
	["All", "Devotion", "autobuyers can bulk buy 10x"],
	["Unlocks the second", ["mo", "Synergy"]],
], [
	["Unlocks", "The Prism", ", a new tab"],
	["Unlocks three new relic rebuyables:", "Glowing Relics", ",", "Gleaming Relics", ", and", "Prismatic Relics"],
	["Reduces relic activation requirement scaling (5 --> 3)"],
	["Removes the softcap on relic's first effect"],
], [
	["Makes all previous molecule upgrades always unlockable"],
	["Unlocks three new molecule upgrades:", "Ne<span style='font-size: 0.8em'>2</span>, Neon", ",", "C<span style='font-size: 0.8em'>6</span>H<span style='font-size: 0.8em'>5</span>NH<span style='font-size: 0.8em'>2</span>, Aniline", ", and", "[Ru(NH<span style='font-size: 0.8em'>3</span>)<span style='font-size: 0.8em'>5</span>(N<span style='font-size: 0.8em'>2</span>)]Cl<span style='font-size: 0.8em'>2</span>"],
	["Makes the molecule effect softcap start later (15,000 --> 1e9)"],
	["Makes the molecule effect softcap weaker (^0.5 --> ^0.51)"],
], [
	["Makes the", "17th good influence milestone", "perform good influence resets automatically"],
	["Unlocks four new good influence upgrades:", "Devotion to Good", ",", "Sacrifice for Good", ",", "Glowing Goodness", ", and", "Greater Good"],
	["Reduces the good influence cost base (2 --> 1.99)"],
	["Unlocks the third", ["mo", "Synergy"]],
], [
	["Makes all previous evil influence challenges always unlockable"],
	["Adds a new effect to", "Enter the Gate"],
	["Adds a new effect to evil influence"],
	["Makes the evil influence gain softcaps weaker (^0.1 --> ^0.2)"],
], [
	["Makes all previous", "Influences", "always unlockable"],
	["Unlocks two new", "Influences", ":", "Relics of Good", "and", "Sanctum Habitation"],
	["Improves the formula of war's last effect"],
	["Makes you always be able to buy max wars"],
], [
	["Improves the second effect formulas of", "Nervous Tissue", ",", "Muscle Tissue", ", and", "Epithelial Tissue"],
	["Makes all previous", "Protein", "rebuyables always unlockable"],
	["Reduces the cellular life cost base (100 --> 50)"],
	["Makes you always be able to buy max cellular life"],
], [
	["Unlocks one new", "Tide", ":", "Tide of Science"],
	["Reduces the chaos cost exponent (0.85 --> 0.84)"],
	["Makes story and keywords be kept on all resets"],
	["Unlocks the fourth", ["mo", "Synergy"]],
], [
	["Unlocks", "Attunement", ", a new tab"],
	["Makes the", ["gi", "Good Influence", "Synergy"], "softcap weaker (/10 --> /4)"],
	["Adds a new effect to multicellular organisms"],
	["Unlocks the fifth", "Synergy"],
]];

function getAssimilationRewardDisplay() {
	if (player.mo.assimilated.length === 0) {
		return "Assimilation rewards will be shown here.";
	};
	const colorless = (!colorValue[0][1] || colorValue[1] === "none");
	let text = "";
	for (let layerIndex = 0; layerIndex < ASSIMILATION_REWARDS.length; layerIndex++) {
		const layer = LAYER_ORDER[layerIndex + 1];
		if (!isAssimilated(layer)) continue;
		text += "<br><h2 class='layer-mo'>Assimilated </h2><h2 class='layer-" + layer + "'>" + (tmp[layer].pluralName || tmp[layer].name) + "</h2><br><br>";
		const colorTag = "<b" + (colorless ? "" : " class='layer-" + layer + "'") + ">";
		for (const reward of ASSIMILATION_REWARDS[layerIndex]) {
			for (let index = 0; index < reward.length; index++) {
				const newText = (reward[index] instanceof Array ? reward[index][1] : reward[index]);
				if (index > 0 && !newText.startsWith(",") && !newText.startsWith(":")) {
					text += " ";
				};
				if (reward[index] instanceof Array) {
					text += "<b" + (colorless ? ">" : " class='layer-" + reward[index][0] + "'>") + newText;
					if (reward[index].length > 2) text += " " + colorTag + reward[index][2] + "</b>";
					text += "</b>";
				} else if (index % 2 === 1) {
					text += colorTag + newText + "</b>";
				} else {
					text += newText;
				};
			};
			text += "<br>";
		};
	};
	return text.replace(/^<br>/, "").replace(/<br>$/, "");
};

function extraMainDisplay(layer) {
	if (isAssimilated(layer)) return "<b class='layer-mo'>Assimilated</b> ";
};

// gets that glitchy text variable
function getGlitch(tweak = false) {
	// rounding
	let round = 0;
	if (hasUpgrade("q", 62)) round += 2.5;
	if (hasUpgrade("q", 65)) round += 2.5;
	// skewing
	let skew = 1;
	if (tweak) skew += 0.01;
	// multiplying
	let mult = 1;
	if (hasUpgrade("q", 53)) mult *= 10;
	if (hasUpgrade("q", 64)) mult *= 2.5;
	// frequency
	let frequency = 1;
	if (hasUpgrade("q", 53)) frequency *= 2;
	if (hasUpgrade("q", 54)) frequency /= 2;
	if (hasUpgrade("q", 65)) frequency *= 2;
	// calculate
	const val = Math.sin(player.timePlayed / (2 / frequency));
	// with rounding (based on the answer found here: https://math.stackexchange.com/a/107491)
	if (round) {
		const result = val * Math.sqrt((1 + (round ** 2)) / (1 + ((round ** 2) * (val ** 2))));
		if (tweak && hasMilestone("ch", 13)) return new Decimal(1.395e12).mul((result + skew) * mult).add(1);
		return player.points.max(player.q.basePointTotal).add(1).log10().mul((result + skew) * mult).add(1);
	};
	// without rounding
	if (tweak && hasMilestone("ch", 13)) return new Decimal(1.395e12).mul((val + skew) * mult).add(1);
	return player.points.max(player.q.basePointTotal).add(1).log10().mul((val + skew) * mult).add(1);
};

// gets glitch text in The Decipherer
function getGlitchDecipherText() {
	if (getBuyableAmount("pl", 31).gte(1)) return "knowledge";
	return randomStr(9);
};

// gets the main text display of The Decipherer
function getDeciphererDisplay() {
	let text = "Your " + getGlitchDecipherText() + " is";
	if (getBuyableAmount("pl", 31).gte(1)) text += " fully";
	else text += " currently <h2 class='layer-q'>" + format(player.q.decipher) + "</h2>%";
	text += " deciphered, granting <h2 class='layer-q'>" + formatWhole(player.q.insight) + "</h2> insight";
	text += "<br><br>Deciphered amount decays over time with a decay factor of " + (hasUpgrade("q", 65) ? "0.1" : "0.001");
	return text;
};

// gets glitch text in Attunement
function getGlitchAttuneText() {
	return randomStr(13) + " " + randomStr(8);
};
