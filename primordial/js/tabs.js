// gets the raw content of a tab.
function getRawTabContent(layer, name = "") {
	const prefix = (inGlitchedAssimilationSearch() ? "glitch-" : "");
	let content = [];
	content.push(prefix + "main-display");
	if (assimilationReq[layer]) {
		content.push(["row", ["prestige-button", "assimilate-button"]]);
	} else {
		content.push(prefix + "prestige-button");
	};
	if (layer == "w") {
		content.push(["custom-resource-display", "You have " + formatWhole(player.gi.points) + " good influence<br>You have " + formatWhole(player.ei.points) + " evil influence<br><br>Your best wars is " + formatWhole(player.w.best) + "<br>You have made a total of " + formatWhole(player.w.total) + " wars"]);
	} else {
		content.push(prefix + "resource-display");
	};
	content.push("blank");
	if (layer == "e") {
		content.push("buyables");
		content.push("blank");
		content.push("upgrades");
		content.push("blank");
	} else if (layer == "c") {
		content.push("milestones");
		content.push("buyables");
		content.push("blank");
		content.push("upgrades");
		content.push("blank");
	} else if (layer == "q") {
		if (name == "The Decipherer") {
			content.push(["display-text", "Your " + getGlitchDecipherText() + ' is currently <h2 class="layer-q">' + format(player.q.decipher) + '</h2>% deciphered, granting <h2 class="layer-q">' + formatWhole(player.q.insight) + "</h2> insight<br><br>Deciphered amount decays over time with a decay factor of " + (hasUpgrade("q", 65) ? 0.1 : 0.001)]);
			content.push("blank");
			content.push("buyables");
		} else {
			content.push("milestones");
			content.push("upgrades");
		};
		content.push("blank");
	} else if (layer == "sp") {
		content.push("milestones");
		content.push("buyables");
		content.push("blank");
		content.push("upgrades");
		content.push("blank");
	} else if (layer == "h") {
		if (name == "The Breaker") {
			content.push(["clickable", 11]);
			content.push("blank");
			content.push(["clickable", 21]);
		} else {
			content.push("milestones");
			content.push("upgrades");
		};
		content.push("blank");
	} else if (layer == "ds") {
		if (name == "Purification") {
			content.push(["display-text", "You have purified <h2 class='layer-ds'>" + formatWhole(getPurifiedDemonSouls()) + "</h2> demon souls"]);
			content.push("blank");
			content.push(["challenge", 101]);
		} else if (name == "Demon Gateway") {
			content.push(["challenges", [1, 2, 3]]);
		} else {
			content.push("milestones");
			content.push("buyables");
			content.push("blank");
			content.push("upgrades");
		};
		content.push("blank");
	} else if (layer == "a") {
		if (name == "Atomic Reactor") {
			content.push(["clickable", 11]);
			content.push("blank");
			content.push(["clickable", 21]);
			content.push("blank");
		} else if (name == "Atomic Tree") {
			let text = "";
			if ((hasMilestone("a", 10) && hasMilestone("a", 12)) || isAssimilated(layer) || player.mo.assimilating === layer) text = "All limitations have been removed.";
			else if (hasMilestone("a", 10)) text = "When you do a row 4 reset, all atom upgrades will be reset.";
			else if (hasMilestone("a", 12)) text = "When you buy one of these upgrades, you cannot buy<br>any upgrades that are not on its path.";
			else text = "When you buy one of these upgrades, you cannot buy<br>any upgrades that are not on its path. When you<br>do a row 4 reset, all atom upgrades will be reset.";
			content.push(["display-text", text]);
			content.push("blank");
			content.push(["upgrade-tree", [
				[11],
				[21, 22],
				[31, 32, 33],
				[41, 42],
				[51],
				[61, 62],
				[71, 72, 73],
			]]);
		} else {
			content.push("milestones");
		};
	} else if (layer == "p") {
		let text = 'You have <h2 class="layer-p">' + format(player.p.divinity) + '</h2> divinity, which boosts point generation by <h2 class="layer-p">' + format(player.p.divinity.add(1).pow(0.1)) + "</h2>x";
		if (hasUpgrade("p", 22)) text += '<br>You have <h2 class="layer-p">' + format(player.p.holiness) + '</h2> holiness, which boosts essence gain by <h2 class="layer-p">' + format(player.p.holiness.add(1).pow(0.055)) + "</h2>x";
		if (hasUpgrade("p", 41)) text += '<br>You have <h2 class="layer-p">' + formatWhole(player.p.hymns) + '</h2> hymns, which boosts prayer gain by <h2 class="layer-p">' + format(tmp.p.hymnEffect) + "</h2>x";
		content.push(["display-text", text]);
		content.push("blank");
		content.push("milestones");
		content.push("upgrades");
		content.push("blank");
		if (tmp.p.clickables[11].unlocked) {
			content.push(["clickable", 11]);
			content.push("blank");
		};
	} else if (layer == "s") {
		if (name == "Glow") {
			content.push(["display-text", 'You are generating <h2 class="layer-s">' + format(tmp.g.glowGain) + '</h2> glow/sec, with a maximum of <h2 class="layer-s">' + format(tmp.g.glowMax) + '</h2> glow<br>You have <h2 class="layer-s">' + format(player.s.glow) + '</h2> glow, which multiplies sanctum gain and light gain after hardcap by <h2 class="layer-s">' + format(tmp.g.glowEffect) + "</h2>x"]);
			content.push("blank");
			content.push(["layer-proxy", ["g", ["buyables"]]]);
			content.push("blank");
			content.push("blank");
		} else if (name == "Devotion") {
			content.push(["display-text", 'You have <h2 class="layer-s">' + format(tmp.d.devotion) + '</h2> devotion, which multiplies sanctum gain by <h2 class="layer-s">' + format(tmp.d.devotionEffect) + "</h2>x"]);
			content.push("blank");
			content.push(["layer-proxy", ["d", ["buyables"]]]);
			content.push("blank");
			content.push("blank");
		} else {
			content.push("milestones");
		};
	} else if (layer == "r") {
		content.push(["display-text", 'You have <h2 class="layer-r">' + formatWhole(player.r.points.sub(getActivatedRelics())) + '</h2> unactivated relics and <h2 class="layer-r">' + formatWhole(getActivatedRelics()) + "</h2> activated relics"]);
		content.push("blank");
		if (name == "The Prism") {
			content.push("buyables");
			content.push("blank");
			if (hasMilestone("ch", 25)) {
				content.push("milestones");
			};
		} else {
			content.push("challenges");
			content.push("blank");
			content.push("upgrades");
			content.push("blank");
		};
	} else if (layer == "m") {
		if (name == "Constructor") {
			let text = 'You have <h2 class="layer-m">' + formatWhole(tmp.m.uniqueNonExtra) + "</h2>";
			if (tmp.m.uniqueExtra.gt(0)) text += '<h3 class="layer-m-light">+' + formatWhole(tmp.m.uniqueExtra) + "</h3>";
			text += " total unique molecules";
			content.push(["display-text", text]);
			content.push("blank");
			content.push("upgrades");
			content.push("blank");
		} else {
			content.push("milestones");
		};
	} else if (layer == "gi") {
		content.push(["display-text", 'You have <h2 class="layer-s">' + format(tmp.d.devotion) + '</h2> devotion, which multiplies good influence gain by <h2 class="layer-gi">' + format(tmp.gi.devotionEffect) + "</h2>x"]);
		content.push("blank");
		content.push("milestones");
		content.push("buyables");
		content.push("blank");
		if (isAssimilated("gi") || player.mo.assimilating === "gi") {
			content.push("upgrades");
			content.push("blank");
		};
	} else if (layer == "ei") {
		content.push(["display-text", 'You have <h2 class="layer-ei">' + format(player.ei.power) + "</h2> evil power"]);
		content.push("blank");
		if (name == "Gate of Evil") {
			content.push("challenges");
		} else {
			content.push("milestones");
			content.push("upgrades");
		};
		content.push("blank");
	} else if (layer == "w") {
		content.push(["display-text", "After unlocking War, you can always buy max on all resources before this row."]);
		content.push("blank");
		content.push(["bar", "tide"]);
		content.push("blank");
		if (name == "Influences") {
			content.push("buyables");
			content.push("blank");
		} else {
			content.push("milestones");
		};
	} else if (layer == "cl") {
		if (name == "Protein") {
			content.push(["display-text", 'You are currently finding <h2 class="layer-cl">' + format(tmp.cl.proteinConv) + "</h2> protein per cellular life<br>" + (tmp.cl.proteinGain.gt(0) ? 'You are currently gaining <h2 class="layer-cl">' + format(tmp.cl.proteinGain) + "</h2> protein per second<br>" : "") + 'You currently have <h2 class="layer-cl">' + format(player.cl.protein) + "</h2> protein"]);
			content.push("blank");
			content.push(["buyables", [3, 4, 5]]);
			content.push("blank");
			if (tmp.cl.clickables[11].unlocked) {
				content.push("clickables");
				content.push("blank");
			};
		} else if (name == "Tissues") {
			content.push(["buyables", [1, 2]]);
			content.push("blank");
		} else {
			content.push("milestones");
		};
	} else if (layer == "ch") {
		if (name == "Keywords") {
			content.push([prefix + "display-text", getKeywordDisplay()]);
			content.push("blank");
			content.push(["row", [[prefix + "display-text", "Keyword deciphering is&nbsp;"], [prefix + "toggle", ["ch", "deciphering"]]]]);
			content.push("blank");
			content.push([prefix + "display-text", "Fully deciphered story segments are marked with <span style='font-size: 24px'>[&check;]</span>"]);
			if (isAssimilated("ch")) {
				content.push("blank");
				content.push(["display-text",
					"Story "
					+ "segments that".replace(/[A-Za-z]+(?![A-Za-z0-9])/g, substr => randomStr(substr.length))
					+ " cannot "
					+ "be fully deciphered are".replace(/[A-Za-z]+(?![A-Za-z0-9])/g, substr => randomStr(substr.length))
					+ " marked with <span style='font-size: 24px'>[X]</span>"
				]);
			};
			content.push("blank");
		} else if (name == "Story") {
			for (let index = 0; index < story.length; index++) {
				content.push(["infobox", "story" + index]);
			};
			content.push(["infobox", "chaos-assimilation"]);
			if (inGlitchedAssimilationSearch()) {
				content.push("blank");
				content.push("blank");
				content.push("glitch-assimilate-button");
				content.push("blank");
			} else {
				content.push([prefix + "display-text", getNextStoryAt()]);
			};
			content.push("blank");
		} else if (name == "The Tides") {
			if (!hasUpgrade("pl", 82)) {
				content.push(["display-text", "All completion limits start at 1. Starting at the fourth chaos, every even-numbered chaos increases all completion limits by 1."]);
				content.push("blank");
			};
			content.push("challenges");
			content.push("blank");
		} else {
			content.push(prefix + "milestones");
		};
	} else if (layer == "mo") {
		if (name == "Attunement") {
			content.push("milestones");
		} else if (name == "Synergism") {
			content.push(prefix + "buyables");
		} else if (name == "Rewards") {
			content.push([prefix + "display-text", getAssimilationRewards()]);
		} else {
			content.push([prefix + "display-text", "Multicellular organisms reset nothing."]);
			content.push("blank");
			content.push([prefix + "clickable", 11]);
			if (tmp.mo.clickables[21].unlocked) {
				content.push("blank");
				content.push([prefix + "clickable", 21]);
			};
			if (getClickableState("mo", 11) && player.mo.assimilated.length == 16) {
				content.push("blank");
				content.push("glitch-assimilate-button");
			};
		};
		content.push("blank");
	} else if (layer == "pl") {
		if (name == "Atmosphere") {
			content.push([prefix + "display-text", 'You have <h2 class="layer-pl">' + format(player.pl.air) + "</h2> air"]);
			if (hasMilestone("pl", 1)) {
				content.push("blank");
				content.push(["buyables", [1]]);
			};
			content.push("blank");
			content.push(prefix + "upgrades");
			content.push("blank");
		} else {
			content.push([prefix + "display-text", 'You have <h2 class="layer-ch">' + formatWhole(player.ch.points) + '</h2> chaos, which divides the planet requirement by /<h2 class="layer-pl">' + format(tmp.pl.chaosEffect) + "</h2>"]);
			content.push("blank");
			content.push(prefix + "milestones");
		};
	};
	return content;
};

// gets the content function of an always-unlocked tab.
function getTab(layer, name = "") {
	return () => getRawTabContent(layer, name);
};

// gets the content function of an unlockable tab.
function getUnlockableTab(layer, name = "") {
	return () => {
		if (tmp[layer]?.tabFormat[name]?.unlocked) return getRawTabContent(layer, name);
		return getRawTabContent(layer);
	};
};
