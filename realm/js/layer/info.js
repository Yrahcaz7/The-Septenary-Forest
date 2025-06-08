addLayer("I", {
	name: "Info",
	symbol: "I",
	row: "side",
	position: 0,
	color: "#F0F0F0",
	type: "none",
	tooltip: "Info",
	tabFormat() {
		const data = [];
		for (let index = 0; tmp.I.infoboxes[index]; index++) {
			data.push(["infobox", index], "blank");
		};
		return data;
	},
	infoboxes: (() => {
		const data = {};
		const info = [
			["Introduction", null,
				"You are a newly born Creator, thrust into one of countless empty realms.",
				"You can create coins by clicking anywhere on the screen, and you can send coins through the Rift in exchange for various things.",
				"In the 'C' layer, you can trade for the vital components a realm, such as air and stone.",
				"In the 'M' layer, you can cast spells using your mana, as well as spend coins to upgrade your mana capacity and regeneration.",
				"In the 'F' layer, you can ally your realm with a faction, which gives you access to powerful upgrades related to that faction's focus.",
				"In the 'G' layer, you can trade your realm for gems, which enhance your coin production and can be traded for various upgrades.",
				"The 'I' layer (this one) displays information about the game.",
				"The 'S' layer displays your stats (statistics) for your current realm, current life, and all time.",
			],
			["Components", () => tmp.C.color,
				"Components are the basic building blocks of a realm, and boost your coin production in various ways.",
				"The first three components are called basic components, and they are always available. The fairy faction focuses on these components.",
				"Various advanced components can be unlocked later in the game. The demon faction focuses on these components.",
				"You can also uptier types of components, making them more powerful."
			],
			["Mana", () => tmp.M.color,
				"Mana is a resource that can be used to cast spells.",
				"You start with two spells, one that immediately gives you coins, and one that temporarily boosts your coin production.",
				"There are two different types of upgrades in the 'M' layer.", "The first type increases max mana, mana regeneration, and spell effects.", "The second type unlocks and improves autocasting, letting you guide the forces of mana to automatically cast spells for you.",
			],
			["Factions", () => tmp.F.color,
				"Faction coins are a resource that can be used to ally with a faction and unlock faction upgrades.",
				"These upgrades are different depending on the faction you ally with, as they all have a different focus.",
				"Generally, good factions focus more on active production, while evil factions focus more on passive production.",
			],
			["Gems", () => tmp.G.color,
				"Gems are an exremely valuable resource that innately boost your coin production.",
				"They can also be traded for upgrades that boost various aspects of each of your realms.",
				"However, they can only be obtained by trading your realm, resetting all your realm-making progress.",
			],
		];
		for (let index = 0; index < info.length; index++) {
			data[index] = {
				title: info[index][0],
				body: info[index][2],
			};
			if (info[index][1]) {
				data[index].style = {"border-color": info[index][1]};
				data[index].titleStyle = {"background-color": info[index][1]};
			};
			for (let line = 3; line < info[index].length; line++) {
				data[index].body += "<br><br>" + info[index][line];
			};
		};
		return data;
	})(),
});
