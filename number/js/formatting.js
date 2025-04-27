const romanNumerals = [
	["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
	["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
	["C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
];

function romanNumeralFormat(num) {
	// override
	if (hasUpgrade("rn", 21) && player.rn.calc && hasUpgrade("rn", 41) && player.rn.overCalc) return formatWhole(new Decimal(num));
	// setup
	let result = "", resultE = "";
	let places = newDecimalZero();
	let decimal = new Decimal(num);
	let layer = new Decimal(decimal.layer);
	// calculation
	if (decimal.mag === 0) {
		if (hasUpgrade("rn", 21) && player.rn.calc) {
			if (hasUpgrade("rn", 31) && player.rn.upCalc) return "0 (N)";
			return "N (0)";
		};
		return "N";
	};
	if (decimal.gte("e1000")) {
		decimal = decimal.layeradd10(0 - (decimal.layer - 1));
		if (decimal.gte("e1000")) {
			layer = layer.add(1);
			decimal = decimal.layeradd10(-1);
		};
	};
	if (decimal.gte(1e3)) {
		places = decimal.log10().trunc();
		places = places.div(3).trunc().mul(3);
		decimal = decimal.div(places.pow_base(10)).trunc();
		let numsArray = [...places.toString()].reverse();
		for (let i = 0; i < numsArray.length; i++) {
			numsArray[i] = +numsArray[i];
			if (numsArray[i] === 0) continue;
			resultE = romanNumerals[i][numsArray[i] - 1] + resultE;
		};
	};
	let numsArray = [...decimal.mag.toString()].reverse();
	for (let i = 0; i < numsArray.length; i++) {
		numsArray[i] = +numsArray[i];
		if (numsArray[i] === 0) continue;
		result = romanNumerals[i][numsArray[i] - 1] + result;
	};
	// return formatted decimal
	if (layer.eq(2)) result = "e" + result;
	else if (layer.eq(3)) result = "ee" + result;
	else if (layer.gte(4)) result = "eee" + result;
	if (new Decimal(num).gte("eeee1000")) {
		let numsArray = [...layer.toString()].reverse();
		let resultF = "";
		for (let i = 0; i < numsArray.length; i++) {
			numsArray[i] = +numsArray[i];
			if (numsArray[i] === 0) continue;
			resultF = romanNumerals[i][numsArray[i] - 1] + resultF;
		};
		result = "eee" + resultE + "F" + resultF;
	} else if (resultE) {
		result += "e" + resultE;
	};
	if (hasUpgrade("rn", 21) && player.rn.calc) {
		if (hasUpgrade("rn", 31) && player.rn.upCalc) return formatWhole(num) + " (" + result + ")";
		return result + " (" + formatWhole(num) + ")";
	};
	return result;
};

const greekNumerals = [
	["αʹ", "βʹ", "γʹ", "δʹ", "εʹ", "ϛʹ", "ζʹ", "ηʹ", "θʹ"],
	["ιʹ", "κʹ", "λʹ", "μʹ", "νʹ", "ξʹ", "οʹ", "πʹ", "ϙʹ"],
	["ρʹ", "σʹ", "τʹ", "υʹ", "φʹ", "χʹ", "ψʹ", "ωʹ", "ϡʹ"],
	["͵α", "͵β", "͵γ", "͵δ", "͵ε", "͵ϛ", "͵ζ", "͵η", "͵θ"],
	["M"],
];

function greekNumeralFormat(num) {
	// setup
	let result = "";
	let resultE = "";
	let places = newDecimalZero();
	let decimal = new Decimal(num);
	let layer = new Decimal(decimal.layer);
	// calculation
	if (decimal.mag === 0) {
		if (player.gn.calc && hasUpgrade('gn', 15)) return "𐆊 (0)";
		return "𐆊";
	};
	if (decimal.gte("e10000")) {
		decimal = decimal.layeradd10(0 - (decimal.layer - 1));
		if (decimal.gte("e10000")) {
			layer = layer.add(1);
			decimal = decimal.layeradd10(-1);
		};
	};
	if (decimal.gte(1e4)) {
		places = decimal.mul(2).log10().trunc();
		places = places.div(4).trunc().mul(4);
		decimal = decimal.div(places.pow_base(10)).trunc();
		let numsArray = [...places.toString()].reverse();
		for (let i = 0; i < numsArray.length; i++) {
			numsArray[i] = +numsArray[i];
			if (numsArray[i] === 0) continue;
			resultE = greekNumerals[i][numsArray[i] - 1] + resultE;
		};
	};
	let numsArray = [...decimal.mag.toString()].reverse();
	for (let i = 0; i < numsArray.length; i++) {
		numsArray[i] = +numsArray[i];
		if (numsArray[i] === 0) continue;
		result = greekNumerals[i][numsArray[i] - 1] + result;
	};
	// return formatted decimal
	if (layer == 2) result = "e" + result;
	else if (layer == 3) result = "ee" + result;
	else if (layer >= 4) result = "eee" + result;
	if (new Decimal(num).gte("eeee1000")) {
		let numsArray = [...layer.toString()].reverse();
		let resultF = "";
		for (let i = 0; i < numsArray.length; i++) {
			numsArray[i] = +numsArray[i];
			if (numsArray[i] === 0) continue;
			resultF = greekNumerals[i][numsArray[i] - 1] + resultF;
		};
		result = "eee" + resultE + "F" + resultF;
	} else if (resultE) {
		result += "e" + resultE;
	};
	if (player.gn.calc && player.gn.calcTier.gte(1)) {
		let resultNum = formatWhole(num);
		if (player.gn.calcTier.lt(10)) resultNum = resultNum.replace(/9/g, "?");
		if (player.gn.calcTier.lt(9)) resultNum = resultNum.replace(/8/g, "?");
		if (player.gn.calcTier.lt(8)) resultNum = resultNum.replace(/7/g, "?");
		if (player.gn.calcTier.lt(7)) resultNum = resultNum.replace(/6/g, "?");
		if (player.gn.calcTier.lt(6)) resultNum = resultNum.replace(/5/g, "?");
		if (player.gn.calcTier.lt(5)) resultNum = resultNum.replace(/4/g, "?");
		if (player.gn.calcTier.lt(4)) resultNum = resultNum.replace(/3/g, "?");
		if (player.gn.calcTier.lt(3)) resultNum = resultNum.replace(/2/g, "?");
		if (player.gn.calcTier.lt(2)) resultNum = resultNum.replace(/1/g, "?");
		return result + " (" + resultNum + ")";
	};
	return result;
};
