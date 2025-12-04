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
};

addLayer('SC', {
	name: 'Softcaps',
	symbol: 'SC',
	position: 2,
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
		player.SC.softcaps = [];
		if (player.points.gte(softcaps.points[0])) {
			player.SC.softcaps.push("points");
		};
		if (player.c.points.gte(tmp.c.softcap) && !tmp.c.deactivated) {
			player.SC.softcaps.push("c");
		};
		if (player.q.points.gte(tmp.q.softcap) && !tmp.q.deactivated) {
			player.SC.softcaps.push("q");
		};
		if (player.h.points.gte(tmp.h.softcap) && !tmp.h.deactivated) {
			player.SC.softcaps.push("h");
		};
		if (player.ds.points.gte(tmp.ds.softcap) && !tmp.ds.deactivated) {
			player.SC.softcaps.push("ds");
		};
		if (tmp.p.effect.gte(softcaps.p_eff[0]()) && !tmp.p.deactivated) {
			player.SC.softcaps.push("p-eff");
		};
		if (tmp.r.effect[0].gte(softcaps.r_eff1[0]) && !(isAssimilated('r') || player.mo.assimilating === 'r') && !tmp.r.deactivated) {
			player.SC.softcaps.push("r-eff1");
		};
		if (tmp.m.effect.gte(softcaps.m_eff[0]) && !tmp.m.deactivated) {
			player.SC.softcaps.push("m-eff");
		};
		if (tmp.gi.effect.gte(softcaps.gi_eff[0]) && !tmp.gi.deactivated && !(hasMilestone('gi', 18) && player.h.limitsBroken >= 4)) {
			player.SC.softcaps.push("gi-eff");
		};
		if (player.ei.points.gte(tmp.ei.softcap) && !tmp.ei.deactivated) {
			player.SC.softcaps.push("ei");
		};
		player.SC.points = new Decimal(player.SC.softcaps.length);
	},
	tabFormat: [
		"main-display",
		["display-text", () => {
			let text = '';
			if (player.SC.softcaps.includes("points")) text += '<br><h2 class="pointSoftcap">Point Gain Softcap</h2><br>starts at ' + format(softcaps.points[0]) + ', gain to ^' + format(softcaps.points[1]()) + '<br>';
			if (player.SC.softcaps.includes("c")) text += '<br><h2 class="layer-c">Core Gain Softcap</h2><br>starts at ' + format(tmp.c.softcap) + ', gain to ^' + format(tmp.c.softcapPower) + '<br>';
			if (player.SC.softcaps.includes("q")) text += '<br><h2 class="layer-q">Quark Gain Softcap</h2><br>starts at ' + format(tmp.q.softcap) + ', gain to ^' + format(tmp.q.softcapPower) + '<br>';
			if (player.SC.softcaps.includes("h")) text += '<br><h2 class="layer-h">Hex Gain Softcap</h2><br>starts at ' + format(tmp.h.softcap) + ', gain to ^' + format(tmp.h.softcapPower) + '<br>';
			if (player.SC.softcaps.includes("ds")) text += '<br><h2 class="layer-ds">Demon Soul Gain Softcap</h2><br>starts at ' + format(tmp.ds.softcap) + ', gain to ^' + format(tmp.ds.softcapPower) + '<br>';
			if (player.SC.softcaps.includes("p-eff")) text += '<br><h2 class="layer-p">Prayer Effect Softcap</h2><br>starts at ' + format(softcaps.p_eff[0]()) + ', effect to ^' + format(softcaps.p_eff[1]()) + '<br>';
			if (player.SC.softcaps.includes("r-eff1")) text += '<br><h2 class="layer-r">Relic\'s First Effect Softcap</h2><br>starts at ' + format(softcaps.r_eff1[0]) + ', effect to ^' + format(softcaps.r_eff1[1]) + '<br>';
			if (player.SC.softcaps.includes("m-eff")) text += '<br><h2 class="layer-m">Molecule Effect Softcap</h2><br>starts at ' + format(softcaps.m_eff[0]()) + ', effect to ^' + format(softcaps.m_eff[1]()) + '<br>';
			if (player.SC.softcaps.includes("gi-eff")) text += '<br><h2 class="layer-gi">Good Influence Effect Softcap</h2><br>starts at ' + format(softcaps.gi_eff[0]) + ', effect to ^' + format(softcaps.gi_eff[1]) + '<br>';
			if (player.SC.softcaps.includes("ei")) text += '<br><h2 class="layer-ei">Evil Influence Gain Softcap</h2><br>starts at ' + format(tmp.ei.softcap) + ', gain to ^' + format(tmp.ei.softcapPower) + '<br>';
			return text;
		}],
	],
});
