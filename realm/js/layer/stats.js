addLayer("S", {
	name: "Stats",
	symbol: "S",
	row: "side",
	position: 1,
	color: "#60C060",
	type: "none",
	tooltip: "Stats",
	tabFormat: (() => {
		const statName = ["This Realm", "This Life", "All Time"];
		let tabs = {};
		for (let index = 0; index < statName.length; index++) {
			tabs[statName[index]] = {content: [["display-text", `<h2>${statName[index].toUpperCase()}</h2>`], "blank", ["h-line", "calc(100% - 12px)"], "blank"]};
			tabs[statName[index]].content.push(["display-text", () => `<h3>GENERAL</h3><br>Your best coins is <b>${format(player.stats[index].best)}</b><br>You have generated <b>${format(player.stats[index].total)}</b> coins`], "blank");
			tabs[statName[index]].content.push(["display-text", () => `<h3>PASSIVE</h3><br>Your best coins/sec is <b>${format(player.stats[index].bestPassive)}</b><br>You have generated <b>${format(player.stats[index].totalPassive)}</b> coins passively`, () => { return {color: lighten(getSideColor(1))} }], "blank");
			tabs[statName[index]].content.push(["display-text", () => `<h3>CLICKS</h3><br>Your best coins/click is <b>${format(player.stats[index].bestClickValue)}</b><br>You have generated <b>${format(player.stats[index].totalClickValue)}</b> coins from clicking${index === 0 ? "" : "<br>Your best times clicked is <b>" + formatWhole(player.stats[index].bestClicks) + "</b>"}<br>You have clicked <b>${formatWhole(player.stats[index].totalClicks)}</b> times`, () => { return {color: lighten(getSideColor(0))} }], "blank");
			tabs[statName[index]].content.push(["display-text", () => `<h3>COMPONENTS</h3><br>Your best components is <b>${formatWhole(player.stats[index].components)}</b>`, () => { return {color: lighten(layers.C.color)} }], "blank");
			tabs[statName[index]].content.push(["display-text", () => `<h3>MANA</h3><br>Your best mana regen is <b>${format(player.stats[index].manaRegen)}</b><br>Your best max mana is <b>${format(player.stats[index].maxMana)}</b><br>You have generated <b>${format(player.stats[index].manaTotal)}</b> mana`, () => { return {color: lighten(layers.M.color)} }], "blank");
			tabs[statName[index]].content.push(["display-text", () => `<h3>FACTION COINS</h3><br>Your best faction coins is <b>${formatWhole(player.stats[index].FCbest)}</b><br>You have found <b>${formatWhole(player.stats[index].FCtotal)}</b> faction coins<br>Your best faction coin chance is <b>${format(player.stats[index].FCchance)}%</b>`, () => {
				const faction = getAllianceIndex();
				if (faction >= 0) return {color: lighten(factionColor[faction])};
			}], "blank");
			if (index > 0) tabs[statName[index]].content.push(["display-text", () => `<h3>GEMS</h3><br>Your best gems is <b>${formatWhole(index === 2 ? player.bestGems : player.G.best) + "</b>"}<br>You have recieved <b>${formatWhole(index === 2 ? player.totalGems : player.G.total) + "</b>"} gems`, () => { return {color: lighten(layers.G.color)} }], "blank");
			tabs[statName[index]].content.push(["display-text", () => {
				if (player.stats[index].casts.every(amt => amt.eq(0))) return "<h3>SPELLS</h3><br>You have not cast any spells";
				let text = "<h3>SPELLS</h3><table class='stats'><tr><th>SPELL NAME</th><th>NUMBER OF CASTS</th><th>TIME SPENT ACTIVE</th></tr>";
				for (let spell = 0; spell < player.stats[index].casts.length; spell++) {
					if (player.stats[index].casts[spell].eq(0)) continue;
					text += `<tr style="color: ${lighten(getSideColor([2, 2, 0, 1][spell]))}">`;
					text += `<td>${spellName[spell]}</td>`;
					text += `<td><b>${formatWhole(player.stats[index].casts[spell])}</b></td>`;
					text += `<td><b>${formatTime(player.stats[index].spellTimes[spell])}</b></td>`;
					text += "</tr>";
				};
				return text + "</table>";
			}], "blank");
			tabs[statName[index]].content.push(["display-text", () => {
				if (player.stats[index].alliances.every(amt => amt === 0)) return "<h3>FACTIONS</h3><br>You have not allied with any factions";
				let text = "<h3>FACTIONS</h3><table class='stats'><tr><th>FACTION NAME</th><th>NUMBER OF ALLIANCES</th><th>TIME SPENT ALLIED</th></tr>";
				for (let faction = 0; faction < player.stats[index].alliances.length; faction++) {
					if (player.stats[index].alliances[faction] === 0) continue;
					text += `<tr style="color: ${lighten(factionColor[faction])}">`;
					text += `<td>${pluralFactionName[faction].at(0).toUpperCase() + pluralFactionName[faction].slice(1)}</td>`;
					text += `<td><b>${formatWhole(player.stats[index].alliances[faction])}</b></td>`;
					text += `<td><b>${formatTime(player.stats[index].allianceTimes[faction])}</b></td>`;
					text += "</tr>";
				};
				return text + "</table>";
			}], "blank");
			tabs[statName[index]].content.push(["display-text", () => {
				let text = `<h3>TIME</h3><div>You have spent <b>${formatTime(player.stats[index].time)}</b> in total</div><br>`;
				for (let side = 0; side < player.stats[index].sideTimes.length; side++) {
					if (player.stats[index].sideTimes[side] > 0) text += `<div style='color: ${lighten(getSideColor(side))}'>You have spent <b>${formatTime(player.stats[index].sideTimes[side])}</b> being ${sideName[side]}</div>`;
				};
				return text;
			}], "blank");
		};
		return tabs;
	})(),
});
