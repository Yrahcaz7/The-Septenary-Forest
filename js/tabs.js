// gets the content of a tab.
function getTab(layer, name) {
	if (layer == "e") return [
		"main-display",
		["row", ["prestige-button", "assimilate-button"]],
		"resource-display",
		"blank",
		"buyables",
		"blank",
		"upgrades",
	];
	if (layer == "c") return [
		"main-display",
		["row", ["prestige-button", "assimilate-button"]],
		"resource-display",
		"blank",
		"milestones",
		"buyables",
		"blank",
		"upgrades",
	];
	if (layer == "q") {
		if (name == "The Decipherer") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["display-text", 'Your ' + randomStr(9) + ' is currently <h2 class="layer-q">' + formatSmall(player.q.decipher) + '</h2>% deciphered, granting <h2 class="layer-q">' + formatWhole(player.q.insight) + '</h2> insight<br><br>Deciphered rate decays over time with a decay factor of ' + (hasUpgrade('q', 65) ? 0.1 : 0.001)],
				"blank",
				"buyables",
				"blank",
			];
		} else {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				"milestones",
				"upgrades",
			];
		};
	};
	if (layer == "sp") return [
		"main-display",
		["row", ["prestige-button", "assimilate-button"]],
		"resource-display",
		"blank",
		"milestones",
		"buyables",
		"blank",
		"upgrades",
	];
	if (layer == "h") {
		if (name == "The Breaker") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["clickable", "11"],
				"blank",
				["clickable", "21"],
				"blank",
			];
		} else {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				"milestones",
				"upgrades",
			];
		};
	};
	if (layer == "ds") {
		if (name == "Demon Gateway") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				"challenges",
				"blank",
			];
		} else {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				"milestones",
				"buyables",
				"blank",
				"upgrades",
			];
		};
	};
	if (layer == "a") {
		if (name == "Atomic Reactor") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["clickables", "1"],
				"blank",
				["clickables", "2"],
				"blank",
			];
		} else if (name == "Atomic Tree") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["display-text", () => {
					if ((hasMilestone('a', 10) && hasMilestone('a', 12)) || isAssimilated(layer) || player.mo.assimilating === layer) return 'All limitations have been removed.';
					else if (hasMilestone('a', 10)) return 'When you do a row 4 reset, all atom upgrades will be reset.';
					else if (hasMilestone('a', 12)) return 'When you buy one of these upgrades, you cannot buy<br>any upgrades that are not on its path.';
					else return 'When you buy one of these upgrades, you cannot buy<br>any upgrades that are not on its path. When you<br>do a row 4 reset, all atom upgrades will be reset.';
				}],
				"blank",
				["upgrade-tree", [
					[11],
					[21, 22],
					[31, 32, 33],
					[41, 42],
					[51],
					[61, 62],
					[71, 72, 73],
				]],
			];
		} else {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				"milestones",
			];
		};
	};
	if (layer == "p") return [
		"main-display",
		["row", ["prestige-button", "assimilate-button"]],
		"resource-display",
		"blank",
		["display-text", () => {
			let text = 'You have <h2 class="layer-p">' + format(player.p.divinity) + '</h2> divinity, which boosts point generation by <h2 class="layer-p">' + format(player.p.divinity.add(1).pow(0.1)) + '</h2>x';
			if (hasUpgrade('p', 22)) text += '<br>You have <h2 class="layer-p">' + format(player.p.holiness) + '</h2> holiness, which boosts essence gain by <h2 class="layer-p">' + format(player.p.holiness.add(1).pow(0.055)) + '</h2>x';
			if (hasUpgrade('p', 41)) text += '<br>You have <h2 class="layer-p">' + formatWhole(player.p.hymn) + '</h2> hymns, which boosts prayer gain by <h2 class="layer-p">' + format(player.p.hymnEff) + '</h2>x';
			return text;
		}],
		"blank",
		"milestones",
		"upgrades",
		() => { return tmp.p.clickables[11].unlocked ? "clickables" : "" },
		() => { return tmp.p.clickables[11].unlocked ? "blank" : "" },
	];
	if (layer == "s") {
		if (name == "Glow") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["display-text", 'you are generating <h2 class="layer-s">' + format(player.s.glow_gain) + '</h2> glow/sec, with a maximum of <h2 class="layer-s">' + format(player.s.glow_max) + '</h2> glow'],
				["display-text", 'you have <h2 class="layer-s">' + format(player.s.glow) + '</h2> glow, which multiplies sanctum gain and light gain after hardcap by <h2 class="layer-s">' + format(player.s.glow_effect) + '</h2>x'],
				"blank",
				["layer-proxy", ['g', ["buyables"]]],
				"blank",
				"blank",
			];
		} else if (name == "Devotion") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["display-text", 'you have <h2 class="layer-s">' + format(player.s.devotion) + '</h2> devotion, which multiplies sanctum gain by <h2 class="layer-s">' + format(player.s.devotion_effect) + '</h2>x'],
				"blank",
				["layer-proxy", ['d', ["buyables"]]],
				"blank",
				"blank",
			];
		} else {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				"milestones",
			];
		};
	};
	if (layer == "r") return [
		"main-display",
		["row", ["prestige-button", "assimilate-button"]],
		"resource-display",
		"blank",
		["display-text", () => { return 'you have <h2 class="layer-r">' + formatWhole(player.r.points.sub(challengeCompletions('r', 11)).max(0)) + '</h2> unactivated relics and <h2 class="layer-r">' + formatWhole(challengeCompletions('r', 11)) + '</h2> activated relics' }],
		"blank",
		"challenges",
		"blank",
		"upgrades",
	];
	if (layer == "m") {
		if (name == "Constructor") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["display-text", () => {
					if (player.m.unique_extra.gt(0)) return 'You have <h2 class="layer-m">' + formatWhole(player.m.unique_nonextra) + '</h2><h3 class="layer-m-light">+' + formatWhole(player.m.unique_extra) + '</h3> total unique molecules';
					return 'You have <h2 class="layer-m">' + formatWhole(player.m.unique_nonextra) + '</h2> total unique molecules';
				}],
				"blank",
				"upgrades",
			];
		} else {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				"milestones",
			];
		};
	};
	if (layer == "gi") return [
		"main-display",
		["row", ["prestige-button", "assimilate-button"]],
		"resource-display",
		"blank",
		["display-text", () => { return 'you have <h2 class="layer-s">' + format(player.s.devotion) + '</h2> devotion, which multiplies good influence gain by <h2 class="layer-gi">' + format(player.gi.req_devotion) + '</h2>x' }],
		"blank",
		"milestones",
		"buyables",
		"blank",
	];
	if (layer == "ei") {
		if (name == "Gate of Evil") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["display-text", 'You have <h2 class="layer-ei">' + formatSmall(player.ei.power) + '</h2> evil power'],
				"blank",
				"challenges",
				"blank",
			];
		} else {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["display-text", () => { return 'You have <h2 class="layer-ei">' + formatSmall(player.ei.power) + '</h2> evil power' }],
				"blank",
				"milestones",
				"upgrades",
			];
		};
	};
	if (layer == "w") {
		if (name == "Influences") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				["custom-resource-display", () => { return 'You have ' + formatWhole(player.gi.points) + ' good influence<br>You have ' + formatWhole(player.ei.points) + ' evil influence<br><br>Your best wars is ' + formatWhole(player.w.best) + '<br>You have made a total of ' + formatWhole(player.w.total) + ' wars' }],
				"blank",
				["display-text", 'After unlocking War, you can always buy max on all resources before this row.'],
				"blank",
				["bar", "tide"],
				"blank",
				"buyables",
				"blank",
			];
		} else {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				["custom-resource-display", () => { return 'You have ' + formatWhole(player.gi.points) + ' good influence<br>You have ' + formatWhole(player.ei.points) + ' evil influence<br><br>Your best wars is ' + formatWhole(player.w.best) + '<br>You have made a total of ' + formatWhole(player.w.total) + ' wars' }],
				"blank",
				["display-text", 'After unlocking War, you can always buy max on all resources before this row.'],
				"blank",
				["bar", "tide"],
				"blank",
				"milestones",
			];
		};
	};
	if (layer == "cl") {
		if (name == "Protein") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["display-text", 'You are currently finding <h2 class="layer-cl">' + format(player.cl.protein_conv) + '</h2> protein per cellular life<br>' + (player.cl.protein_gain.gt(0) ? 'You are currently gaining <h2 class="layer-cl">' + format(player.cl.protein_gain) + '</h2> protein per second<br>' : '') + 'You currently have <h2 class="layer-cl">' + format(player.cl.protein) + '</h2> protein'],
				"blank",
				["buyables", "3"],
				["buyables", "4"],
				["buyables", "5"],
				"blank",
				(tmp.cl.clickables[11].unlocked ? "clickables" : ""),
				(tmp.cl.clickables[11].unlocked ? "blank" : ""),
			];
		} else if (name == "Tissues") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["buyables", "1"],
				["buyables", "2"],
				"blank",
			];
		} else {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				"milestones",
			];
		};
	};
	if (layer == "ch") {
		if (name == "Story") {
			let content = [];
			content.push("main-display");
			content.push(["row", ["prestige-button", "assimilate-button"]]);
			content.push("resource-display");
			content.push("blank");
			for (let index = 0; index < story.length; index++) {
				content.push(["infobox", "story" + index]);
			};
			content.push(["display-text", function() {
				if (player.ch.best.toNumber() < storyLength(Infinity)) return "<br><br>next story discovery at " + formatWhole(player.ch.best.add(1)) + " chaos";
				else return "<br><br>all story discoveries found; wait for updates for more";
			}]);
			content.push("blank");
			return content;
		} else if (name == "The Tides") {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				["display-text", "All completion limits start at 1. Starting at the fourth chaos, every even-numbered chaos increases all completion limits by 1."],
				"blank",
				"challenges",
				"blank",
			];
		} else {
			return [
				"main-display",
				["row", ["prestige-button", "assimilate-button"]],
				"resource-display",
				"blank",
				"milestones",
			];
		};
	};
	if (layer == "mo") {
		if (name == "Synergism") {
			return [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				"buyables",
			];
		} else if (name == "Rewards") {
			return [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				["display-text", () => {
					if (player.mo.assimilated.length === 0) return 'Assimilation rewards will be shown here.';
					return getAssimilationRewards();
				}],
				"blank",
			];
		} else {
			return [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				["display-text", 'Multicellular organism resets do not reset anything.'],
				"blank",
				"clickables",
				"blank",
			];
		};
	};
	return [];
};

// gets the content function of an unlockable tab.
function getUnlockableTab(layer, name) { return () => {
	if (tmp[layer]?.tabFormat[name]?.unlocked) return getTab(layer, name);
	return getTab(layer);
}};
