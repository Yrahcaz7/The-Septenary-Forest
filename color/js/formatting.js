function illionFormat(decimal, short, precision = 2) {
	// setup
	let suffix = "";
	let divnum = newDecimalOne();
	let centillions = 0;
	let addt = false;
	if (options.extendPlaces && precision > 0) precision++;
	decimal = new Decimal(decimal);
	if (!short) suffix = " ";
	// illion calculation
	if (decimal.gte("e30003") || options.nfDisplay == "e") { // format normally if higher than 9,999th illion
		return format(decimal, precision);
	};
	if (decimal.gte("e3003")) { // add prefix if higher than 999th illion
		if (decimal.gte("e27003")) { // 9,000th
			divnum = divnum.mul("e27003");
			centillions += 90;
			if (!short) suffix += "novemmillia";
			else suffix += "nM";
		} else if (decimal.gte("e24003")) { // 8,000th
			divnum = divnum.mul("e24003");
			centillions += 80;
			if (!short) suffix += "octomillia";
			else suffix += "oM";
		} else if (decimal.gte("e21003")) { // 7,000th
			divnum = divnum.mul("e21003");
			centillions += 70;
			if (!short) suffix += "septenmillia";
			else suffix += "SM";
		} else if (decimal.gte("e18003")) { // 6,000th
			divnum = divnum.mul("e18003");
			centillions += 60;
			if (!short) suffix += "sexmillia";
			else suffix += "sM";
		} else if (decimal.gte("e15003")) { // 5,000th
			divnum = divnum.mul("e15003");
			centillions += 50;
			if (!short) suffix += "quinmillia";
			else suffix += "QM";
		} else if (decimal.gte("e12003")) { // 4,000th
			divnum = divnum.mul("e12003");
			centillions += 40;
			if (!short) suffix += "quattuormillia";
			else suffix += "qM";
		} else if (decimal.gte("e9003")) { // 3,000th
			divnum = divnum.mul("e9003");
			centillions += 30;
			if (!short) suffix += "tremillia";
			else suffix += "tM";
		} else if (decimal.gte("e6003")) { // 2,000th
			divnum = divnum.mul("e6003");
			centillions += 20;
			if (!short) suffix += "duomillia";
			else suffix += "dM";
		} else { // 1,000th
			divnum = divnum.mul("e3003");
			centillions += 10;
			if (!short) suffix += "millia";
			else suffix += "M";
		};
		if (!short) suffix += "-";
	};
	if (decimal.gte(1e303)) { // add prefix if higher than 99th illion
		if (decimal.div(new Decimal(1e300).pow(centillions)).gte("e2703")) { // 900th
			divnum = divnum.mul("e2700");
			centillions += 9;
			if (!short) suffix += "nongen";
			else suffix += "nC";
		} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte("e2403")) { // 800th
			divnum = divnum.mul("e2400");
			centillions += 8;
			if (!short) suffix += "octingen";
			else suffix += "oC";
		} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte("e2103")) { // 700th
			divnum = divnum.mul("e2100");
			centillions += 7;
			if (!short) suffix += "septingen";
			else suffix += "SC";
		} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte("e1803")) { // 600th
			divnum = divnum.mul("e1800");
			centillions += 6;
			if (!short) suffix += "sescen";
			else suffix += "sC";
		} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte("e1503")) { // 500th
			divnum = divnum.mul("e1500");
			centillions += 5;
			if (!short) suffix += "quingen";
			else suffix += "QC";
		} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte("e1203")) { // 400th
			divnum = divnum.mul("e1200");
			centillions += 4;
			if (!short) suffix += "quadringen";
			else suffix += "qC";
		} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte("e903")) { // 300th
			divnum = divnum.mul("e900");
			centillions += 3;
			if (!short) suffix += "trecen";
			else suffix += "tC";
		} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte("e603")) { // 200th
			divnum = divnum.mul("e600");
			centillions += 2;
			if (!short) suffix += "duocen";
			else suffix += "dC";
		} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte(1e303)) { // 100th
			divnum = divnum.mul(1e300);
			centillions += 1;
			if (!short) suffix += "cen";
			else suffix += "C";
		} else { // none
			if (short) suffix += "~";
		};
		if (!short) suffix += "-";
		if (decimal.lt("e3003")) divnum = divnum.mul(1e3);
	};
	if (decimal.gte(1e33)) { // add prefix if higher than 9th illion
		let exponent = decimal.layeradd10(-1).floor();
		// add first part
		if (exponent % 30 < 3) { // 9th
			divnum = divnum.mul(1e27);
			if (!short) suffix += "novem";
			else suffix += "n";
		} else if (exponent.sub(27) % 30 < 3) { // 8th
			divnum = divnum.mul(1e24);
			if (!short) suffix += "octo";
			else suffix += "o";
		} else if (exponent.sub(24) % 30 < 3) { // 7th
			divnum = divnum.mul(1e21);
			if (!short) suffix += "septen";
			else suffix += "S";
		} else if (exponent.sub(21) % 30 < 3) { // 6th
			divnum = divnum.mul(1e18);
			if (!short) suffix += "sex";
			else suffix += "s";
		} else if (exponent.sub(18) % 30 < 3) { // 5th
			divnum = divnum.mul(1e15);
			if (!short) suffix += "quin";
			else suffix += "Q";
		} else if (exponent.sub(15) % 30 < 3) { // 4th
			divnum = divnum.mul(1e12);
			if (!short) suffix += "quattuor";
			else suffix += "q";
		} else if (exponent.sub(12) % 30 < 3) { // 3rd
			divnum = divnum.mul(1e9);
			if (!short) suffix += "tre";
			else suffix += "t";
		} else if (exponent.sub(9) % 30 < 3) { // 2nd
			divnum = divnum.mul(1e6);
			if (!short) suffix += "duo";
			else suffix += "d";
		} else if (exponent.sub(6) % 30 < 3) { // 1st
			divnum = divnum.mul(1e3);
			if (!short) suffix += "un";
			else suffix += "u";
		} else { // none
			if (short) suffix += "~";
		};
		// add second part
		if ((exponent - 3) % 300 >= 30) {
			if (decimal.div(new Decimal(1e300).pow(centillions)).gte(1e273)) { // 90th
				divnum = divnum.mul(1e270);
				if (!short) suffix += "nona";
				else suffix += "n";
			} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte(1e243)) { // 80th
				divnum = divnum.mul(1e240);
				if (!short) suffix += "octo";
				else suffix += "o";
			} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte(1e213)) { // 70th
				divnum = divnum.mul(1e210);
				if (!short) suffix += "septua";
				else suffix += "S";
			} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte(1e183)) { // 60th
				divnum = divnum.mul(1e180);
				if (!short) suffix += "sexa";
				else suffix += "s";
			} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte(1e153)) { // 50th
				divnum = divnum.mul(1e150);
				if (!short) suffix += "quinqua";
				else suffix += "Q";
			} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte(1e123)) { // 40th
				divnum = divnum.mul(1e120);
				if (!short) suffix += "quadra";
				else suffix += "q";
			} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte(1e93)) { // 30th
				divnum = divnum.mul(1e90);
				if (!short) suffix += "tri";
				else suffix += "t";
			} else if (decimal.div(new Decimal(1e300).pow(centillions)).gte(1e63)) { // 20th
				divnum = divnum.mul(1e60);
				if (!short) suffix += "vi";
				else suffix += "v";
			} else { // 10th
				divnum = divnum.mul(1e30);
				if (!short) suffix += "dec";
				else suffix += "d";
			};
			if (
				(decimal.gte(1e303) && decimal.div(new Decimal(1e300).pow(centillions)).gte(1e60)) ||
				(decimal.lt(1e303) && decimal.gte(1e63))
			) { // add prefix part 2 ending
				if (!short) suffix += "gint";
			};
		} else {
			addt = true;
			if (short) suffix += "~";
		};
		if (decimal.lt(1e303)) divnum = divnum.mul(1e3);
	} else { // add prefix if 9th illion or lower
		if (decimal.gte(1e30)) { // 9th
			divnum = divnum.mul(1e30);
			if (!short) suffix += "non";
			else suffix += "n";
		} else if (decimal.gte(1e27)) { // 8th
			divnum = divnum.mul(1e27);
			if (!short) suffix += "oct";
			else suffix += "o";
		} else if (decimal.gte(1e24)) { // 7th
			divnum = divnum.mul(1e24);
			if (!short) suffix += "sept";
			else suffix += "S";
		} else if (decimal.gte(1e21)) { // 6th
			divnum = divnum.mul(1e21);
			if (!short) suffix += "sext";
			else suffix += "s";
		} else if (decimal.gte(1e18)) { // 5th
			divnum = divnum.mul(1e18);
			if (!short) suffix += "quint";
			else suffix += "Q";
		} else if (decimal.gte(1e15)) { // 4th
			divnum = divnum.mul(1e15);
			if (!short) suffix += "quadr";
			else suffix += "q";
		} else if (decimal.gte(1e12)) { // 3rd
			divnum = divnum.mul(1e12);
			if (!short) suffix += "tr";
			else suffix += "t";
		} else if (decimal.gte(1e9)) { // 2nd
			divnum = divnum.mul(1e9);
			if (!short) suffix += "b";
			else suffix += "b";
		} else if (decimal.gte(1e6)) { // 1st
			divnum = divnum.mul(1e6);
			if (!short) suffix += "m";
			else suffix += "m";
		} else if (decimal.gte(1e3)) { // 0th
			divnum = divnum.mul(1e3);
			if (!short) suffix += "thousand";
			else suffix += "k";
		} else { // none
			return format(decimal, options.extendPlaces ? Math.max(precision - 1, 0) : precision);
		};
	};
	// add suffix
	if (decimal.gte(1e6)) {
		if (!short) {
			if (addt) suffix += "t";
			suffix += "illion";
		};
	};
	// return formatted decimal
	return decimal.div(divnum).toStringWithDecimalPlaces(precision) + suffix;
};
