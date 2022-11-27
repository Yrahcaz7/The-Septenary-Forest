const softcaps = {
	p_d: [[1e150, 0.95]],
	m_eff: [[15000, 0.5]],
	r_l: [[1e20, 0]],
	r_eff1: [['e500000', 0.333]],
	gi_eff: [['1e2500', 0.6666666666666666]],
};

addLayer('ghost0', {
	position: 1,
	row: 'side',
	layerShown() {return 'ghost'},
});

addLayer('SC', {
	name: 'Softcaps',
	symbol: 'SC',
	position: 2,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		softcaps: [],
	}},
	color: '#DFDFDF',
	resource: 'discovered softcaps',
	row: 'side',
	layerShown() { return player.SC.points.gt(0) },
	tooltip() { return player.SC.points + ' softcaps' },
	update(diff) {
		player.SC.softcaps = [];
		if (player.c.points.gte(layers.c.softcap) && !player.SC.softcaps.includes("c")) {
			player.SC.softcaps.push("c");
		};
		if (player.q.points.gte(layers.q.softcap) && !player.SC.softcaps.includes("q")) {
			player.SC.softcaps.push("q");
		};
		if (player.h.points.gte(layers.h.softcap) && !player.SC.softcaps.includes("h")) {
			player.SC.softcaps.push("h");
		};
        if (player.ds.points.gte(layers.ds.softcap) && !player.SC.softcaps.includes("ds")) {
			player.SC.softcaps.push("ds");
		};
		if (player.p.divinity.gte(softcaps.p_d[0][0]) && !player.SC.softcaps.includes("p-d")) {
			player.SC.softcaps.push("p-d");
		};
		if (tmp.m.effect.gte(softcaps.m_eff[0][0]) && !player.SC.softcaps.includes("m-eff")) {
			player.SC.softcaps.push("m-eff");
		};
		if (player.r.lightgain.gte(softcaps.r_l[0][0]) && !player.SC.softcaps.includes("r-l")) {
			player.SC.softcaps.push("r-l");
		};
		if (tmp.r.effect.gte(softcaps.r_eff1[0][0]) && !player.SC.softcaps.includes("r-eff1")) {
			player.SC.softcaps.push("r-eff1");
		};
		if (tmp.gi.effect.gte(softcaps.gi_eff[0][0]) && !player.SC.softcaps.includes("gi-eff")) {
			player.SC.softcaps.push("gi-eff");
		};
		player.SC.points = new Decimal(player.SC.softcaps.length);
	},
	tabFormat: [
		"main-display",
		["display-text", function() {
            let text = '';
            if (player.SC.softcaps.includes("c")) text += '<br><h2 class="layer-c">Core Gain Softcap</h2><br>starts at ' + format(layers.c.softcap) + ', gain to ^' + format(layers.c.softcapPower) + '<br>';
            if (player.SC.softcaps.includes("q")) text += '<br><h2 class="layer-q">Quark Gain Softcap</h2><br>starts at ' + format(layers.q.softcap) + ', gain to ^' + format(layers.q.softcapPower) + '<br>';
            if (player.SC.softcaps.includes("h")) text += '<br><h2 class="layer-h">Hex Gain Softcap</h2><br>starts at ' + format(layers.h.softcap) + ', gain to ^' + format(layers.h.softcapPower) + '<br>';
            if (player.SC.softcaps.includes("ds")) text += '<br><h2 class="layer-ds">Demon Soul Gain Softcap</h2><br>starts at ' + format(layers.ds.softcap) + ', gain to ^' + format(layers.ds.softcapPower) + '<br>';
            if (player.SC.softcaps.includes("p-d")) text += '<br><h2 class="layer-p">Divinity Gain Softcap</h2><br>starts at ' + format(softcaps.p_d[0][0]) + ', gain to ^' + format(softcaps.p_d[0][1]) + '<br>';
            if (player.SC.softcaps.includes("m-eff")) text += '<br><h2 class="layer-m">Molecule Effect Softcap</h2><br>starts at ' + format(softcaps.m_eff[0][0]) + ', effect to ^' + format(softcaps.m_eff[0][1]) + '<br>';
            if (player.SC.softcaps.includes("r-l")) {
                text += '<br><h2 class="layer-r">Light Gain Softcap</h2><br>starts at ' + format(softcaps.r_l[0][0]) + ', gain to ^' + formatSmall(softcaps.r_l[0][1]) + '<br>';
                if (player.nerdMode) text += 'formula: (x/1e24+1)^(-0.01) where x is light gain after softcap<br>';
            };
            if (player.SC.softcaps.includes("r-eff1")) text += '<br><h2 class="layer-r">Relic\'s First Effect Softcap</h2><br>starts at ' + format(softcaps.r_eff1[0][0]) + ', effect to ^' + format(softcaps.r_eff1[0][1]) + '<br>';
            if (player.SC.softcaps.includes("gi-eff")) text += '<br><h2 class="layer-gi">Good Influence Effect Softcap</h2><br>starts at ' + format(softcaps.gi_eff[0][0]) + ', effect to ^' + format(softcaps.gi_eff[0][1]) + '<br>';
            return text;
		}],
	],
});
