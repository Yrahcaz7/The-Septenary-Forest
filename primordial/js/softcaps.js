const softcaps = {
	points: ['e1e14', () => {
		if (hasChallenge('ds', 32)) return 0.3;
		return 0.25;
	}],
	p_eff: [() => {
		if (isAssimilated('p') || player.mo.assimilating === 'p') return 1e15;
		return 1e150;
	}, () => {
		if (isAssimilated('p') || player.mo.assimilating === 'p') return 0.96;
		return 0.95;
	}],
	m_eff: [() => {
		if (isAssimilated('m') || player.mo.assimilating === 'm') return 1e9;
		return 15000;
	}, () => {
		if (isAssimilated('m') || player.mo.assimilating === 'm') return 0.51;
		return 0.5;
	}],
	r_eff1: ['e1000000', 0.2],
	gi_eff: ['1e2500', 0.6666666666666666],
	mo_buyable_13: [1.22, 10],
};

const layersWithNormalSoftcappedGain = ["e", "c", "q", "h", "ds", "p", "m"];

let activeSoftcaps = {};

function registerActiveSoftcap(id) {
	if (activeSoftcaps[id]) {
		activeSoftcaps[id]++;
	} else {
		activeSoftcaps[id] = 1;
	};
	player.SC.points = player.SC.points.add(1);
};

function resetActiveSoftcaps() {
	activeSoftcaps = {};
	player.SC.points = newDecimalZero();
};

addLayer('SC', {
	name: 'Softcaps',
	symbol: 'SC',
	position: 1,
	startData() { return {
		points: newDecimalZero(),
		softcaps: [],
	}},
	color: '#DFDFDF',
	resource: 'discovered softcaps',
	row: 'side',
	layerShown() { return player.SC.points.gt(0) && !(getClickableState('mo', 11) && player.mo.assimilating === null) },
	tooltip() { return player.SC.points + ' softcaps' },
	update(diff) {
		resetActiveSoftcaps();
		if (player.points.gte(softcaps.points[0])) {
			registerActiveSoftcap("points");
		};
		for (const layer of layersWithNormalSoftcappedGain) {
			if (player[layer].points.gte(tmp[layer].softcap) && !tmp[layer].deactivated) {
				registerActiveSoftcap(layer);
			};
		};
		if (!tmp.ei.deactivated) {
			for (let index = 0; index < tmp.ei.softcaps.length; index++) {
				if (player.ei.points.gte(tmp.ei.softcaps[index]) && !tmp.ei.deactivated) {
					registerActiveSoftcap("ei");
				};
			};
		};
		if (tmp.p.effect.gte(softcaps.p_eff[0]()) && !tmp.p.deactivated) {
			registerActiveSoftcap("p-eff");
		};
		if (tmp.r.effect[0].gte(softcaps.r_eff1[0]) && !(isAssimilated('r') || player.mo.assimilating === 'r') && !tmp.r.deactivated) {
			registerActiveSoftcap("r-eff1");
		};
		if (tmp.m.effect.gte(softcaps.m_eff[0]()) && !tmp.m.deactivated) {
			registerActiveSoftcap("m-eff");
		};
		if (tmp.gi.effect.gte(softcaps.gi_eff[0]) && !tmp.gi.deactivated && !(hasMilestone('gi', 18) && player.h.limitsBroken >= 4)) {
			registerActiveSoftcap("gi-eff");
		};
		if (buyableEffect('mo', 13).gte(1.22) && !tmp.mo.deactivated) {
			registerActiveSoftcap("mo-buyable-13");
		};
	},
	tabFormat: [
		"main-display",
		["display-text", () => {
			let text = '';
			if (activeSoftcaps["points"]) text += '<br><h2 class="pointSoftcap">Point Gain Softcap</h2><br>starts at ' + format(softcaps.points[0]) + ', gain to ^' + format(softcaps.points[1]()) + '<br>';
			for (const layer of layersWithNormalSoftcappedGain) {
				if (activeSoftcaps[layer]) text += '<br><h2 class="layer-' + layer + '">' + tmp[layer].name + ' Gain Softcap</h2><br>starts at ' + format(tmp[layer].softcap) + ', gain to ^' + format(tmp[layer].softcapPower) + '<br>';
			};
			if (activeSoftcaps["ei"]) {
				if (activeSoftcaps["ei"] > 1) {
					text += '<br><h2 class="layer-ei">Evil Influence Gain Softcaps</h2><ul>';
					for (let index = 0; index < activeSoftcaps["ei"]; index++) {
						text += '<li>' + (index + 1) + '. starts at ' + format(tmp.ei.softcaps[index]) + ', gain to ^' + format(tmp.ei.softcapPowers[index]) + '</li>';
					};
					text += '</ul>';
				} else {
					text += '<br><h2 class="layer-ei">Evil Influence Gain Softcap</h2><br>starts at ' + format(tmp.ei.softcaps[0]) + ', gain to ^' + format(tmp.ei.softcapPowers[0]) + '<br>';
				};
			};
			if (activeSoftcaps["p-eff"]) text += '<br><h2 class="layer-p">Prayer Effect Softcap</h2><br>starts at ' + format(softcaps.p_eff[0]()) + ', effect to ^' + format(softcaps.p_eff[1]()) + '<br>';
			if (activeSoftcaps["r-eff1"]) text += '<br><h2 class="layer-r">Relic\'s First Effect Softcap</h2><br>starts at ' + format(softcaps.r_eff1[0]) + ', effect to ^' + format(softcaps.r_eff1[1]) + '<br>';
			if (activeSoftcaps["m-eff"]) text += '<br><h2 class="layer-m">Molecule Effect Softcap</h2><br>starts at ' + format(softcaps.m_eff[0]()) + ', effect to ^' + format(softcaps.m_eff[1]()) + '<br>';
			if (activeSoftcaps["gi-eff"]) text += '<br><h2 class="layer-gi">Good Influence Effect Softcap</h2><br>starts at ' + format(softcaps.gi_eff[0]) + ', effect to ^' + format(softcaps.gi_eff[1]) + '<br>';
			if (activeSoftcaps["mo-buyable-13"]) text += '<br><h2 class="layer-mo"><b class="layer-gi">Good Influence</b> Synergy Effect Softcap</h2><br>starts at ' + format(softcaps.mo_buyable_13[0]) + ', effect /' + format(softcaps.mo_buyable_13[1]) + '<br>';
			return text;
		}],
	],
});
