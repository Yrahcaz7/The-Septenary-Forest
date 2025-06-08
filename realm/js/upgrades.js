const manaUpgrades = [
	["Magic Proficiency", "multiply max mana based on your mana generated this era", () => player.stats[0].manaTotal.add(1).pow(0.1), "", "x"],
	["Mana Sight", "increase mana regen based on your mana generated this era", () => player.stats[0].manaTotal.add(1).pow(0.125), "+"],
	["Mana Vessels", "multiply max mana based on your creations", () => player.C.points.add(1).pow(0.125), "", "x"],
	["Magical Environment", "increase mana regen based on your creations", () => player.C.points.add(1).pow(0.225), "+"],
	["Attunement", "multiply max mana based on your faction coins", () => player.F.points.add(1).pow(0.05), "", "x"],
	["Magical Aid", "increase mana regen based on your faction coins", () => player.F.points.add(1).pow(0.3), "+"],
	["Focused Taxing", "make 'Tax Collection' also give coins equal to 10x coins/click"],
	["Reinforced Weapons", "improve the 'Call to Arms' effect"],
];

const autocastingUpgrades = [
	["Magic Cycles", "unlock autocasting"],
	["Cyclical Layering", "unlock ordering autocasts"],
	["Delayed Casting", "unlock autocasting only when mana is at least a specified percent of max mana"],
];

const factionUpgrades = [[
	["Magic Dust", "multiply the first effect of basic creations based on your mana regen", () => player.M.manaRegen.mul(4).add(1).pow(0.4), "", "x"],
	["Fairy Workers", "multiply the first effect of basic creations based on your creations", () => player.C.points.add(1).pow(0.2), "", "x"],
	["Fairy Traders", "multiply coins/click and faction coin find chance based on your creations", () => player.C.points.add(1).pow(0.1), "", "x"],
	["Active Workers", "multiply coins/click based on your coins/sec", () => new Decimal(tmp.pointGen).add(1).log10().div(2).add(1), "", "x"],
	["Epitome of Mischief", "multiply the first effect of basic creations based on your fairy coins", () => player.FC[0].add(1).pow(0.3), "", "x"],
	["The Roots of Mana", "multiply mana regen based on your basic creations", () => [11, 12, 13].reduce((acc, id) => acc.add(getBuyableAmount("C", id)), newDecimalOne()).pow(0.05), "", "x"],
], [
	["Super Clicks", "multiply coins/click based on your creations", () => player.C.points.add(1).pow(0.3), "", "x"],
	["Elven Luck", "increase faction coin find chance based on your coins/click", () => player.clickValue.add(1).log10().mul(20), "+", "%"],
	["Elven Spirit", "multiply coins/click based on your elf coins", () => player.FC[1].add(1).pow(0.4), "", "x"],
	["Elven Clicks", "multiply coins/click based on your coins", () => player.points.add(1).log10().add(1), "", "x"],
	["Enchanted Clicks", "multiply coins/click based on your mana regen", () => player.M.manaRegen.add(1).pow(0.5), "", "x"],
	["All on One", "the 3rd creation's first effect now applies to coins/click instead of coins/sec"],
], [
	["Angelic Capacity", "multiply max mana based on your mana generated this era", () => player.stats[0].manaTotal.add(1).pow(0.125), "", "x"],
	["Road to Heaven", "multiply mana regen based on your angel coins", () => player.FC[2].add(1).pow(0.4), "", "x"],
	["Angels Supreme", "multiply angel coin gain by 5"],
	["Rainbows", "multiply max mana based on your faction coins", () => player.F.points.add(1).pow(0.25), "", "x"],
	["Prism Upgrade", "double all spell effects, but triple all spell mana costs"],
	["Angelic Clicks", "multiply coins/click based on your max mana", () => player.M.maxMana.add(1).pow(0.2), "", "x"],
], [
	["Jackpot", "increase faction coin find chance based on your coins", () => player.points.add(1).log10().mul(20), "+", "%"],
	["Goblin's Greed", "multiply coins/sec based on your faction coins", () => player.F.points.add(1).pow(0.25), "", "x"],
	["Currency Revolution", "multiply faction coin find chance based on your faction coins", () => player.F.points.add(1).log10().div(2).add(1), "", "x"],
	["Moneyload", "multiply coins/sec based on your faction coin find chance", () => player.FCchance.add(1).pow(0.2), "", "x"],
	["Absurd Taxes", "increase the first base effect of Tax Collection by 30"],
	["Goblin Pride", "multiply coins/sec based on your goblin coins", () => player.FC[3].add(1).pow(0.25), "", "x"],
], [
	["Undending Cycle", "multiply coins/sec based on your coins", () => player.points.add(1).log10().div(2).add(1), "", "x"],
	["Corpse Piles", "multiply coins/sec based on your undead coins", () => player.FC[4].add(1).pow(hasFactionUpgrade(1, 1, 4) ? 0.4 : 0.3), "", "x"],
	["Stay no More", "multiply coins/sec based on your coins/click", () => player.clickValue.add(1).log10().div(2).add(1), "", "x"],
	["Necromancy Manual", "multiply coins/sec based on your mana generated this era", () => player.stats[0].manaTotal.add(1).pow(0.075), "", "x"],
	["Smarter Zombies", "improve the 'Corpse Piles' effect"],
	["Page of the Necronomicon", "multiply coins/sec and undead coin gain by 2"],
], [
	["Demonic Prestige", "multiply coins/sec based on your creation tiers", () => player.C.tiers.div(5).add(1), "", "x"],
	["Demonic Blood", "multiply blood frenzy effect based on your creations (higher numbered ones count more)", () => [11, 12, 13, 14].reduce((acc, id, num) => acc.add(getBuyableAmount("C", id).mul(5 ** num)), newDecimalOne()).pow(0.1), "", "x"],
	["Polished Rage", "increase all creation's first base effects based on their number and your gems", () => player.G.points.add(1).pow(0.05), "+(", " * 2^num)"],
	["Demonic Deals", "divide the creation cost scaling per number by 1.2 (this also affects tiers)"],
	["Bloody Magic", "multiply mana regen and max mana based on your demon coins", () => player.FC[5].add(1).pow(0.125), "", "x"],
	["Higher Order", "multiply the first effect of non-basic creations based on your creation tiers", () => player.C.tiers.div(2).add(1), "", "x"],
]];

const gemUpgrades = [
	["Gem Influence", "increase faction coin find chance based on your total gems", () => {
		let eff = player.G.total.add(1).log10().mul(10);
		if (hasUpgrade("G", 12)) eff = eff.mul(upgradeEffect("G", 12));
		return eff;
	}, "+", "%"],
	["Gem Displays", "multiply the effect of Gem Influence based on your gems", () => player.G.points.add(1).log10().add(1), "", "x"],
	["Magic Gems", "multiply max mana and mana regen based on your gems", () => {
		let eff = player.G.points.add(1).log10().add(1).pow(0.5);
		if (hasUpgrade("G", 14)) eff = eff.mul(upgradeEffect("G", 14));
		return eff;
	}, "", "x"],
	["Magic Residue", "multiply the effect of Magic Gems based on your best gems", () => player.G.best.add(1).log10().add(1).pow(0.25), "", "x"],
];
