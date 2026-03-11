const SOFTCAPS = {
	points: ["e1e14", () => {
		if (hasChallenge("ds", 32)) return 0.3;
		return 0.25;
	}],
	p_eff: [() => {
		if (isAssimilated("p") || player.mo.assimilating === "p") return 1e15;
		return 1e150;
	}, () => {
		if (isAssimilated("p") || player.mo.assimilating === "p") return 0.96;
		return 0.95;
	}],
	m_eff: [() => {
		if (isAssimilated("m") || player.mo.assimilating === "m") return 1e9;
		return 15000;
	}, () => {
		if (isAssimilated("m") || player.mo.assimilating === "m") return 0.51;
		return 0.5;
	}],
	r_eff1: [() => {
		if (isAssimilated("r") || player.mo.assimilating === "r") return Infinity;
		return "e1000000";
	}, 0.2],
	gi_eff: [() => {
		if (hasMilestone("gi", 18) && player.h.limitsBroken >= 4) return Infinity;
		return "1e2500";
	}, 0.6666666666666666],
	r_buyable_12: [1e200, 0.5],
	mo_buyable_13: [() => {
		if (getBuyableAmount("pl", 22).gte(2)) return Infinity;
		return 1.22;
	}, () => {
		if (getBuyableAmount("pl", 22).gte(1)) return 1.5;
		if (hasMilestone("ch", 43)) return 2;
		if (isAssimilated("mo")) return 4;
		return 10;
	}],
};

addLayer("SC", (() => {
	const LAYERS_WITH_GAIN_SOFTCAPS = ["e", "c", "q", "h", "ds", "p", "m", "ei"];
	let activeSoftcaps = {};
	function registerActiveSoftcap(id) {
		activeSoftcaps[id] = (activeSoftcaps[id] || 0) + 1;
		player.SC.points = player.SC.points.add(1);
	};
	function resetActiveSoftcaps() {
		activeSoftcaps = {};
		player.SC.points = newDecimalZero();
	};
	return {
		name: "Softcaps",
		symbol: "SC",
		position: 1,
		startData() { return {
			points: newDecimalZero(),
		}},
		color: "#DFDFDF",
		resource: "softcaps",
		row: "side",
		layerShown() { return player.SC.points.gt(0) && !(getClickableState("mo", 11) && player.mo.assimilating === null) },
		update(diff) {
			resetActiveSoftcaps();
			if (player.points.gte(SOFTCAPS.points[0])) {
				registerActiveSoftcap("points");
			};
			for (const layer of LAYERS_WITH_GAIN_SOFTCAPS) {
				if (tmp[layer].deactivated) {
					continue;
				} else if (tmp[layer].softcaps.length && !tmp[layer].deactivated) {
					for (let index = 0; index < tmp[layer].softcaps.length; index++) {
						if (player[layer].points.gte(tmp[layer].softcaps[index])) {
							registerActiveSoftcap("ei");
						};
					};
				} else if (player[layer].points.gte(tmp[layer].softcap)) {
					registerActiveSoftcap(layer);
				};
			};
			if (tmp.p.effect.gte(SOFTCAPS.p_eff[0]()) && !tmp.p.deactivated) {
				registerActiveSoftcap("p_eff");
			};
			if (tmp.r.effect[0].gte(SOFTCAPS.r_eff1[0]()) && !tmp.r.deactivated) {
				registerActiveSoftcap("r_eff1");
			};
			if (tmp.m.effect.gte(SOFTCAPS.m_eff[0]()) && !tmp.m.deactivated) {
				registerActiveSoftcap("m_eff");
			};
			if (tmp.gi.effect.gte(SOFTCAPS.gi_eff[0]()) && !tmp.gi.deactivated) {
				registerActiveSoftcap("gi_eff");
			};
			if (buyableEffect("r", 12).gte(SOFTCAPS.r_buyable_12[0]) && !tmp.r.deactivated) {
				registerActiveSoftcap("r_buyable_12");
			};
			if (buyableEffect("mo", 13).gte(SOFTCAPS.mo_buyable_13[0]()) && !tmp.mo.deactivated) {
				registerActiveSoftcap("mo_buyable_13");
			};
		},
		tabFormat: [
			["display-text", () => {
				let text = "You have <h2 class='layer-SC'>" + player.SC.points + "</h2> active softcaps<br>";
				if (activeSoftcaps.points) text += "<br><h2 class='points'>Point Gain Softcap</h2><br>starts at " + format(SOFTCAPS.points[0]) + ", gain to ^" + format(SOFTCAPS.points[1]()) + "<br>";
				for (const layer of LAYERS_WITH_GAIN_SOFTCAPS) {
					if (activeSoftcaps[layer] > 1) {
						text += "<br><h2 class='layer-" + layer + "'>" + tmp[layer].name + " Gain Softcaps</h2><ul>";
						for (let index = 0; index < activeSoftcaps[layer]; index++) {
							text += "<li>" + (index + 1) + ". starts at " + format(tmp[layer].softcaps[index]) + ", gain to ^" + format(tmp[layer].softcapPowers[index]) + "</li>";
						};
						text += "</ul>";
					} else if (activeSoftcaps[layer]) {
						text += "<br><h2 class='layer-" + layer + "'>" + tmp[layer].name + " Gain Softcap</h2><br>starts at " + format(tmp[layer].softcap) + ", gain to ^" + format(tmp[layer].softcapPower) + "<br>";
					};
				};
				if (activeSoftcaps.p_eff) text += "<br><h2 class='layer-p'>Prayer Effect Softcap</h2><br>starts at " + format(SOFTCAPS.p_eff[0]()) + ", effect to ^" + format(SOFTCAPS.p_eff[1]()) + "<br>";
				if (activeSoftcaps.r_eff1) text += "<br><h2 class='layer-r'>Relic's First Effect Softcap</h2><br>starts at " + format(SOFTCAPS.r_eff1[0]()) + ", effect to ^" + format(SOFTCAPS.r_eff1[1]) + "<br>";
				if (activeSoftcaps.m_eff) text += "<br><h2 class='layer-m'>Molecule Effect Softcap</h2><br>starts at " + format(SOFTCAPS.m_eff[0]()) + ", effect to ^" + format(SOFTCAPS.m_eff[1]()) + "<br>";
				if (activeSoftcaps.gi_eff) text += "<br><h2 class='layer-gi'>Good Influence Effect Softcap</h2><br>starts at " + format(SOFTCAPS.gi_eff[0]()) + ", effect to ^" + format(SOFTCAPS.gi_eff[1]) + "<br>";
				if (activeSoftcaps.r_buyable_12) text += "<br><h2 class='layer-r'>Gleaming Relics Effect Softcap</h2><br>starts at " + format(SOFTCAPS.r_buyable_12[0]) + ", effect ^" + format(SOFTCAPS.r_buyable_12[1]) + "<br>";
				if (activeSoftcaps.mo_buyable_13) text += "<br><h2 class='layer-mo'><b class='layer-gi'>Good Influence</b> Synergy Effect Softcap</h2><br>starts at " + format(SOFTCAPS.mo_buyable_13[0]()) + ", effect /" + format(SOFTCAPS.mo_buyable_13[1]()) + "<br>";
				return text;
			}],
		],
	};
})());
