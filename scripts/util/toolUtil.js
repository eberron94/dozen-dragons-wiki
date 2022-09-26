// PARSING =============================================================================================================
Parser = {};
Parser._parse_aToB = function (abMap, a, fallback) {
	if (a === undefined || a === null) throw new TypeError("undefined or null object passed to parser");
	if (typeof a === "string") a = a.trim();
	if (abMap[a] !== undefined) return abMap[a];
	return fallback !== undefined ? fallback : a;
};

Parser._parse_bToA = function (abMap, b) {
	if (b === undefined || b === null) throw new TypeError("undefined or null object passed to parser");
	if (typeof b === "string") b = b.trim();
	for (const v in abMap) {
		if (!abMap.hasOwnProperty(v)) continue;
		if (abMap[v] === b) return v;
	}
	return b;
};
Parser.numberToText = function (number, freq) {
	if (number == null) throw new TypeError(`undefined or null object passed to parser`);
	// TODO: Hacky fix for frequencies
	if (typeof number === "string") return number;
	if (Math.abs(number) >= 100) return `${number}`;

	function getAsText (num) {
		const abs = Math.abs(num);
		switch (abs) {
			case 0:
				return "zero";
			case 1:
				if (freq) {
					return "once"
				} else return "one"
			case 2:
				if (freq) {
					return "twice"
				} else return "two"
			case 3:
				return "three";
			case 4:
				return "four";
			case 5:
				return "five";
			case 6:
				return "six";
			case 7:
				return "seven";
			case 8:
				return "eight";
			case 9:
				return "nine";
			case 10:
				return "ten";
			case 11:
				return "eleven";
			case 12:
				return "twelve";
			case 13:
				return "thirteen";
			case 14:
				return "fourteen";
			case 15:
				return "fifteen";
			case 16:
				return "sixteen";
			case 17:
				return "seventeen";
			case 18:
				return "eighteen";
			case 19:
				return "nineteen";
			case 20:
				return "twenty";
			case 30:
				return "thirty";
			case 40:
				return "forty";
			case 50:
				return "<span title=\"fiddy\">fifty</span>"; // :^)
			case 60:
				return "sixty";
			case 70:
				return "seventy";
			case 80:
				return "eighty";
			case 90:
				return "ninety";
			default: {
				const str = String(abs);
				return `${getAsText(Number(`${str[0]}0`))}-${getAsText(Number(str[1]))}`;
			}
		}
	}

	if (freq) {
		return `${getAsText(number)} ${number > 2 ? "times" : ""}`
	} else {
		return `${number < 0 ? "negative " : ""}${getAsText(number)}`
	}
};

Parser._greatestCommonDivisor = function (a, b) {
	if (b < Number.EPSILON) return a;
	return Parser._greatestCommonDivisor(b, Math.floor(a % b));
};
Parser.numberToFractional = function (number) {
	const len = number.toString().length - 2;
	let denominator = 10 ** len;
	let numerator = number * denominator;
	const divisor = Parser._greatestCommonDivisor(numerator, denominator);
	numerator = Math.floor(numerator / divisor);
	denominator = Math.floor(denominator / divisor);

	return denominator === 1 ? String(numerator) : `${Math.floor(numerator)}/${Math.floor(denominator)}`;
};

Parser.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

Parser._addCommas = function (intNum) {
	return `${intNum}`.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
};

Parser.numToBonus = function (intNum) {
	return `${intNum >= 0 ? "+" : ""}${intNum}`
};

Parser.isValidCreatureLvl = function (lvl) {
	lvl = Number(lvl);
	return lvl > -2 && lvl < 26
}

Parser.actionTypeKeyToFull = function (key) {
	key = key.toLowerCase();
	switch (key) {
		case "untrained": return "Skill (Untrained)"
		case "trained": return "Skill (Trained)"
		case "expert": return "Skill (Expert)"
		case "master": return "Skill (Master)"
		case "legendary": return "Skill (Legendary)"
		case "variantrule": return "Optional/Variant Action"
		default: return key.toTitleCase();
	}
}

Parser.SKILL_TO_ATB_ABV = {
	"acrobatics": "dex",
	"arcana": "int",
	"athletics": "str",
	"crafting": "int",
	"deception": "cha",
	"diplomacy": "cha",
	"intimidation": "cha",
	"lore": "int",
	"medicine": "wis",
	"nature": "wis",
	"occultism": "int",
	"performance": "cha",
	"religion": "wis",
	"society": "int",
	"stealth": "dex",
	"survival": "wis",
	"thievery": "dex",
};

Parser.skillToAbilityAbv = function (skill) {
	return Parser._parse_aToB(Parser.SKILL_TO_ATB_ABV, skill);
};

Parser.SKILL_TO_SHORT = {
	"acrobatics": "acro",
	"arcana": "arc",
	"athletics": "ath",
	"crafting": "cra",
	"deception": "dec",
	"diplomacy": "dip",
	"intimidation": "int",
	"lore": "lore",
	"medicine": "med",
	"nature": "nat",
	"occultism": "occ",
	"performance": "per",
	"religion": "rel",
	"society": "soc",
	"stealth": "ste",
	"survival": "sur",
	"thievery": "thi",
};

Parser.skillToShort = function (skill) {
	return Parser._parse_aToB(Parser.SKILL_TO_SHORT, skill);
};

Parser.XP_CHART = {
	"-4": 10,
	"-3": 15,
	"-2": 20,
	"-1": 30,
	"0": 40,
	"1": 60,
	"2": 80,
	"3": 120,
	"4": 160,
}

Parser._getSourceStringFromSource = function (source) {
	if (source && source.source) return source.source;
	return source;
};
Parser._buildSourceCache = function (dict) {
	const out = {};
	Object.entries(dict).forEach(([k, v]) => out[k.toLowerCase()] = v);
	return out;
};
Parser._sourceFullCache = null;
Parser.hasSourceFull = function (source) {
	Parser._sourceFullCache = Parser._sourceFullCache || Parser._buildSourceCache(Parser.SOURCE_JSON_TO_FULL);
	return !!Parser._sourceFullCache[source.toLowerCase()];
};
Parser._sourceAbvCache = null;
Parser.hasSourceAbv = function (source) {
	Parser._sourceAbvCache = Parser._sourceAbvCache || Parser._buildSourceCache(Parser.SOURCE_JSON_TO_ABV);
	return !!Parser._sourceAbvCache[source.toLowerCase()];
};
Parser._sourceDateCache = null;
Parser.hasSourceDate = function (source) {
	Parser._sourceDateCache = Parser._sourceDateCache || Parser._buildSourceCache(Parser.SOURCE_JSON_TO_DATE);
	return !!Parser._sourceDateCache[source.toLowerCase()];
};
Parser.hasSourceStore = function (source) {
	Parser._sourceStoreCache = Parser._sourceStoreCache || Parser._buildSourceCache(Parser.SOURCE_JSON_TO_STORE);
	return !!Parser._sourceStoreCache[source.toLowerCase()];
};
Parser.sourceJsonToFull = function (source) {
	source = Parser._getSourceStringFromSource(source);
	if (Parser.hasSourceFull(source)) return Parser._sourceFullCache[source.toLowerCase()].replace(/'/g, "\u2019");
	if (BrewUtil.hasSourceJson(source)) return BrewUtil.sourceJsonToFull(source).replace(/'/g, "\u2019");
	return Parser._parse_aToB(Parser.SOURCE_JSON_TO_FULL, source).replace(/'/g, "\u2019");
};
Parser.sourceJsonToFullCompactPrefix = function (source) {
	let compact = Parser.sourceJsonToFull(source);
	Object.keys(Parser.SOURCE_PREFIX_TO_SHORT).forEach(prefix => {
		compact = compact.replace(prefix, Parser.SOURCE_PREFIX_TO_SHORT[prefix] || prefix);
	});
	Parser.COMPACT_PREFIX_MAP.forEach(it => compact = compact.replace(it.re, it.replaceWith));
	return compact;
};
Parser.sourceJsonToAbv = function (source) {
	source = Parser._getSourceStringFromSource(source);
	if (Parser.hasSourceAbv(source)) return Parser._sourceAbvCache[source.toLowerCase()];
	if (BrewUtil.hasSourceJson(source)) return BrewUtil.sourceJsonToAbv(source);
	return Parser._parse_aToB(Parser.SOURCE_JSON_TO_ABV, source);
};
Parser.sourceJsonToDate = function (source) {
	source = Parser._getSourceStringFromSource(source);
	if (Parser.hasSourceDate(source)) return Parser._sourceDateCache[source.toLowerCase()];
	if (BrewUtil.hasSourceJson(source)) return BrewUtil.sourceJsonToDate(source);
	return Parser._parse_aToB(Parser.SOURCE_JSON_TO_DATE, source, null);
};
Parser.sourceJsonToStore = function (source) {
	source = Parser._getSourceStringFromSource(source);
	if (Parser.hasSourceStore(source)) return Parser._sourceStoreCache[source.toLowerCase()];
	if (BrewUtil.hasSourceJson(source)) return BrewUtil.sourceJsonToUrl(source);
	return Parser._parse_aToB(Parser.SOURCE_JSON_TO_STORE, source, null);
};
Parser.sourceJsonToColor = function (source) {
	return `source${Parser._getSourceStringFromSource(source).replace(/[&\\/\\#,+()$~%.'":*?<>{}]/g, "_")}`;
};

Parser.stringToSlug = function (str) {
	return str.trim().toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
};
Parser.stringToCasedSlug = function (str) {
	return str.replace(/[^\w ]+/g, "").replace(/ +/g, "-");
};

// TODO: Using conversion tables
Parser.priceToValue = function (price) {
	if (price == null) return 0;
	let mult = 0;
	let offset = 0;
	let amount = price.amount || 0;
	switch (price.coin) {
		case "cp":
			mult = 1;
			break;
		case "sp":
			mult = 10;
			break;
		case "gp":
			mult = 100;
			break;
		case "pp":
			mult = 1000;
			break;
	}
	// FIXME: This is rather stupid in retrospect, to modify the price if there is a note.
	// if (price.note != null) offset = 0.1;
	return mult * amount + offset
};
Parser.priceToFull = function (price, noPlatinum) {
	if (price == null) return "\u2014";
	if (typeof price === "object") {
		if (price.amount == null || price.coin == null) return "\u2014";
		return `${Parser._addCommas(price.amount)} ${price.coin}${price.note ? ` ${price.note}` : ""}`
	} else if (typeof price === "number" && !isNaN(price)) {
		// assume it's all copper (1/100 gp)
		let coin = "";
		let divide = 1;
		if (noPlatinum) {
			switch (Math.floor(Math.log10(price))) {
				case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10:
				case 2: coin = "gp"; divide = 100; break;
				case 1: coin = "sp"; divide = 10; break;
				case 0: coin = "cp"; divide = 1; break;
			}
		} else {
			switch (Math.floor(Math.log10(price))) {
				case 4: case 5: case 6: case 7: case 8: case 9: case 10:
				case 3: coin = "pp"; divide = 1000; break;
				case 2: coin = "gp"; divide = 100; break;
				case 1: coin = "sp"; divide = 10; break;
				case 0: coin = "cp"; divide = 1; break;
			}
		}
		return `${Parser._addCommas(price / divide)} ${coin}`
	}
	return "\u2014"
};
Parser.itemValueToFull = function (item, isShortForm) {
	return Parser._moneyToFull(item, "value", "valueMult", isShortForm);
};
Parser.itemValueToFullMultiCurrency = function (item, isShortForm) {
	return Parser._moneyToFullMultiCurrency(item, "value", "valueMult", isShortForm);
};
Parser._moneyToFull = function (it, prop, propMult, isShortForm) {
	if (it[prop]) {
		const {coin, mult} = Parser.getCurrencyAndMultiplier(it[prop], it.currencyConversion);
		return `${(it[prop] * mult).toLocaleString(undefined, {maximumFractionDigits: 5})} ${coin}`;
	} else if (it[propMult]) return isShortForm ? `×${it[propMult]}` : `base value ×${it[propMult]}`;
	return "";
};
Parser._moneyToFullMultiCurrency = function (it, prop, propMult, isShortForm) {
	if (it[prop]) {
		const simplified = CurrencyUtil.doSimplifyCoins(
			{
				cp: it[prop],
			},
			{
				currencyConversionId: it.currencyConversion,
			},
		);

		const conversionTable = Parser.getCurrencyConversionTable(it.currencyConversion);

		return [...conversionTable]
			.reverse()
			.filter(meta => simplified[meta.coin])
			.map(meta => `${simplified[meta.coin].toLocaleString(undefined, {maximumFractionDigits: 5})} ${meta.coin}`)
			.join(", ");
	} else if (it[propMult]) return isShortForm ? `×${it[propMult]}` : `base value ×${it[propMult]}`;
	return "";
};
Parser.DEFAULT_CURRENCY_CONVERSION_TABLE = [
	{
		coin: "cp",
		mult: 1,
	},
	{
		coin: "sp",
		mult: 0.1,
	},
	{
		coin: "gp",
		mult: 0.01,
		isFallback: true,
	},
];
Parser.FULL_CURRENCY_CONVERSION_TABLE = [
	{
		coin: "cp",
		mult: 1,
	},
	{
		coin: "sp",
		mult: 0.1,
	},
	{
		coin: "gp",
		mult: 0.01,
		isFallback: true,
	},
	{
		coin: "pp",
		mult: 0.001,
	},
];
Parser.getCurrencyConversionTable = function (currencyConversionId) {
	const fromBrew = currencyConversionId ? MiscUtil.get(BrewUtil.homebrewMeta, "currencyConversions", currencyConversionId) : null;
	const conversionTable = fromBrew && fromBrew.length ? fromBrew : Parser.DEFAULT_CURRENCY_CONVERSION_TABLE;
	if (conversionTable !== Parser.DEFAULT_CURRENCY_CONVERSION_TABLE) conversionTable.sort((a, b) => SortUtil.ascSort(b.mult, a.mult));
	return conversionTable;
};
Parser.getCurrencyAndMultiplier = function (value, currencyConversionId) {
	const conversionTable = Parser.getCurrencyConversionTable(currencyConversionId);

	if (!value) return conversionTable.find(it => it.isFallback) || conversionTable[0];
	if (conversionTable.length === 1) return conversionTable[0];
	if (!Number.isInteger(value) && value < conversionTable[0].mult) return conversionTable[0];

	for (let i = conversionTable.length - 1; i >= 0; --i) {
		if (Number.isInteger(value * conversionTable[i].mult)) return conversionTable[i];
	}

	return conversionTable.last();
};
Parser.COIN_ABVS = ["cp", "sp", "gp", "pp"];
Parser.COIN_ABV_TO_FULL = {
	"cp": "copper pieces",
	"sp": "silver pieces",
	"gp": "gold pieces",
	"pp": "platinum pieces",
};
Parser.COIN_CONVERSIONS = [1, 10, 100, 1000];
Parser.coinAbvToFull = function (coin) {
	return Parser._parse_aToB(Parser.COIN_ABV_TO_FULL, coin);
};

Parser._decimalSeparator = (0.1).toLocaleString().substring(1, 2);
Parser._numberCleanRegexp = Parser._decimalSeparator === "." ? new RegExp(/[\s,]*/g, "g") : new RegExp(/[\s.]*/g, "g");
Parser._costSplitRegexp = Parser._decimalSeparator === "." ? new RegExp(/(\d+(\.\d+)?)([csegp]p)/) : new RegExp(/(\d+(,\d+)?)([csegp]p)/);
/** input e.g. "25 gp", "1,000pp" */
Parser.coinValueToNumber = function (value) {
	if (!value) return 0;
	// handle oddities
	if (value === "Varies") return 0;

	value = value
		.replace(/\s*/, "")
		.replace(Parser._numberCleanRegexp, "")
		.toLowerCase();
	const m = Parser._costSplitRegexp.exec(value);
	if (!m) throw new Error(`Badly formatted value "${value}"`);
	const ixCoin = Parser.COIN_ABVS.indexOf(m[3]);
	if (!~ixCoin) throw new Error(`Unknown coin type "${m[3]}"`);
	return Number(m[1]) * Parser.COIN_CONVERSIONS[ixCoin];
};

Parser.PROFICIENCIES = ["Untrained", "Trained", "Expert", "Master", "Legendary"]
Parser.proficiencyAbvToFull = function (abv) {
	switch (abv) {
		case "t": return "trained";
		case "T": return "Trained";
		case "e": return "expert";
		case "E": return "Expert";
		case "m": return "master";
		case "M": return "Master";
		case "l": return "legendary";
		case "L": return "Legendary";
		case "u": return "untrained";
		case "U": return "Untrained";
		default: throw new Error(`Unknown proficiency rank ${abv}.`)
	}
}
Parser.proficiencyToNumber = function (prof) {
	switch (prof[0].toLowerCase()) {
		case "u": return 0;
		case "t": return 1;
		case "e": return 2;
		case "m": return 3;
		case "l": return 4;
		default: return 69;
	}
}
Parser.genderToFull = function (g) {
	switch (g.toLowerCase()) {
		case "m": return "male";
		case "f": return "female";
		case "a": return "agender";
		case "gf": return "genderfluid";
		case "nb": return "nonbinary";
		default: return "";
	}
}
Parser.savingThrowAbvToFull = function (abv) {
	switch (abv) {
		case "f":
		case "F":
		case "Fort":
		case "fort": return "Fortitude";
		case "r":
		case "R":
		case "Ref":
		case "ref": return "Reflex";
		case "w":
		case "W":
		case "Will":
		case "will": return "Will";
		default: throw new Error(`Unknown saving throw abv ${abv}.`)
	}
}

Parser.speedToFullMap = function (speed) {
	return Object.keys(speed).map(k => {
		if (k === "walk") return `${speed.walk} feet`
		else return `${k.uppercaseFirst()} ${speed[k]} feet`
	})
}

Parser.getClassSideBar = function (sidebarEntries) {
	sidebarEntries = MiscUtil.copy(sidebarEntries)
	const first = sidebarEntries.splice(0, 1)[0];
	return {
		type: "pf2-sidebar",
		name: first.name,
		entries: first.entries.concat(sidebarEntries.map(it => [{type: "pf2-title", name: it.name}, ...it.entries]).flat()),
	}
}
Parser.getClassSideBarEntries = function (cls) {
	let initProf = cls.initialProficiencies
	const out = [];
	let sideBar = {
		type: "pf2-sidebar",
		name: `${(cls.rarity ? "RARITY" : "INITIAL PROFICIENCIES")}`,
		entries: [
		],
	}
	if (cls.rarity) out.push({name: "RARITY", entries: [`{@trait ${cls.rarity}}`]});
	const initProfText = "At 1st level, you gain the listed proficiency ranks in the following statistics. You are untrained in anything not listed unless you gain a better proficiency rank in some other way."
	out.push({name: "INITIAL PROFICIENCIES", entries: [initProfText]});
	out.push({name: "PERCEPTION", entries: [`${Parser.proficiencyAbvToFull(initProf.perception)} in Perception`]});
	out.push({
		name: "SAVING THROWS",
		entries: [
			`${Parser.proficiencyAbvToFull(initProf.fort)} in Fortitude`,
			`${Parser.proficiencyAbvToFull(initProf.ref)} in Reflex`,
			`${Parser.proficiencyAbvToFull(initProf.will)} in Will`,
		]});

	function initProfParser (thing, entry) {
		Object.keys(thing).forEach(k => {
			let thingArray = [];
			let prof = "";
			switch (k) {
				case "u": {
					thingArray = thing.u
					prof = "Untrained"
					break;
				}
				case "t": {
					thingArray = thing.t
					prof = "Trained"
					break;
				}
				case "e": {
					thingArray = thing.e
					prof = "Expert"
					break;
				}
				case "m": {
					thingArray = thing.m
					prof = "Master"
					break;
				}
				case "l": {
					thingArray = thing.l
					prof = "Legendary"
					break;
				}
				case "add": return entry.push(`{@indentSubsequent Trained in a number of additional skills equal to ${thing.add} plus your Intelligence modifier}`);
				default:
			}
			thingArray.forEach(element => {
				if (typeof element === "object") {
					if (element.entry) {
						return entry.push(`{@indentSubsequent ${prof} in ${element.entry}}`);
					} else {
						return entry.push(`{@indentSubsequent ${prof} in ${element.skill.length === 1 ? "" : `your choice of`} ${element.skill.map(s => `{@skill ${s}}`).joinConjunct(", ", " or ")}}`);
					}
				} else return entry.push(`{@indentSubsequent ${prof} in ${element}}`);
			});
		});
	}

	const skillsEntries = [];
	const attacksEntries = [];
	const defensesEntries = [];
	initProfParser(initProf.skills, skillsEntries)
	out.push({name: "SKILLS", entries: skillsEntries});
	initProfParser(initProf.attacks, attacksEntries)
	out.push({name: "ATTACKS", entries: attacksEntries});
	initProfParser(initProf.defenses, defensesEntries)
	out.push({name: "DEFENSES", entries: defensesEntries});

	if (initProf.classDc) out.push({name: "CLASS DC", entries: [initProf.classDc.entry]});
	if (initProf.spells) {
		const spellsEntries = [];
		initProfParser(initProf.spells, spellsEntries)
		out.push({name: "SPELLS", entries: spellsEntries});
	}
	return out
}

Parser.spSchoolToStyle = function (school) {
	const rawColor = MiscUtil.get(Renderer.trait.TRAITS, school.toLowerCase(), "_data", "school", "color");
	if (!rawColor || !rawColor.trim()) return "";
	const validColor = BrewUtil.getValidColor(rawColor);
	if (validColor.length) return `style="color: #${validColor}"`;
	return "";
};
Parser.spSchoolToAbv = function (school) {
	const schoolAbv = MiscUtil.get(Renderer.trait.TRAITS, school.toLowerCase(), "_data", "school", "short");
	if (!schoolAbv || !schoolAbv.trim()) return school;
	return schoolAbv;
};

TR_AC = "Arcane";
TR_DV = "Divine";
TR_OC = "Occult";
TR_PR = "Primal";
Parser.TRADITIONS = [TR_AC, TR_DV, TR_OC, TR_PR];

Parser.getOrdinalForm = function (i) {
	i = Number(i);
	if (isNaN(i)) return "";
	const j = i % 10;
	const k = i % 100;
	if (j === 1 && k !== 11) return `${i}st`;
	if (j === 2 && k !== 12) return `${i}nd`;
	if (j === 3 && k !== 13) return `${i}rd`;
	return `${i}th`;
};

Parser.spLevelToFull = function (level) {
	return Parser.getOrdinalForm(level);
};

Parser.getArticle = function (str) {
	str = `${str}`;
	str = str.replace(/\d+/g, (...m) => Parser.numberToText(m[0]));
	return /^[aeiou]/.test(str) ? "an" : "a";
};

Parser.spLevelToFullLevelText = function (level, dash) {
	return `${Parser.spLevelToFull(level)}${(level === 0 ? "s" : `${dash ? "-" : " "}level`)}`;
};

Parser.COMPONENTS_TO_FULL = {};
Parser.COMPONENTS_TO_FULL["V"] = "verbal";
Parser.COMPONENTS_TO_FULL["M"] = "material";
Parser.COMPONENTS_TO_FULL["S"] = "somatic";
Parser.COMPONENTS_TO_FULL["F"] = "focus";

Parser.alignToFull = function (align) {
	switch (String(align).toLowerCase()) {
		case null:
			return "";
		case "any":
			return "Any";
		case "lg":
		case "lawful good":
			return "Lawful Good";
		case "ng":
		case "neutral good":
			return "Neutral Good";
		case "cg":
		case "chaotic good":
			return "Chaotic Good";
		case "ln":
		case "lawful neutral":
			return "Lawful Neutral";
		case "n":
		case "neutral":
			return "Neutral";
		case "cn":
		case "chaotic neutral":
			return "Chaotic Neutral";
		case "le":
		case "lawful evil":
			return "Lawful Evil";
		case "ne":
		case "neutral evil":
			return "Neutral Evil";
		case "ce":
		case "chaotic evil":
			return "Chaotic Evil";
		case "all":
			return "All";
		case "l":
		case "lawful":
			return "Lawful";
		case "c":
		case "chaotic":
			return "Chaotic";
		case "g":
		case "good":
			return "Good";
		case "e":
		case "evil":
			return "Evil";
		default:
			return "\u2014";
	}
};

Parser.CAT_ID_QUICKREF = 10;
Parser.CAT_ID_VARIANT_RULE = 11;
Parser.CAT_ID_SUBSYSTEM = 12;
Parser.CAT_ID_TABLE = 13;
Parser.CAT_ID_TABLE_GROUP = 14;
Parser.CAT_ID_BOOK = 15;

Parser.CAT_ID_ANCESTRY = 20;
Parser.CAT_ID_HERITAGE = 21;
Parser.CAT_ID_VE_HERITAGE = 22;
Parser.CAT_ID_BACKGROUND = 7;
Parser.CAT_ID_CLASS = 23;
Parser.CAT_ID_CLASS_FEATURE = 5;
Parser.CAT_ID_SUBCLASS = 24;
Parser.CAT_ID_SUBCLASS_FEATURE = 6;
Parser.CAT_ID_ARCHETYPE = 25;
Parser.CAT_ID_FEAT = 0;
Parser.CAT_ID_COMPANION = 26;
Parser.CAT_ID_FAMILIAR = 27;
Parser.CAT_ID_EIDOLON = 28;
Parser.CAT_ID_OPTIONAL_FEATURE = 30;
Parser.CAT_ID_OPTIONAL_FEATURE_LESSON = 31;

Parser.CAT_ID_ADVENTURE = 50;
Parser.CAT_ID_HAZARD = 51;

Parser.CAT_ID_ACTION = 8;
Parser.CAT_ID_CREATURE = 1;
Parser.CAT_ID_CONDITION = 60;
Parser.CAT_ID_ITEM = 2;
Parser.CAT_ID_SPELL = 3;
Parser.CAT_ID_AFFLICTION = 61;
Parser.CAT_ID_CURSE = 62;
Parser.CAT_ID_DISEASE = 63;
Parser.CAT_ID_ABILITY = 64;
Parser.CAT_ID_DEITY = 9;
Parser.CAT_ID_LANGUAGE = 65;
Parser.CAT_ID_PLACE = 66;
Parser.CAT_ID_PLANE = 67;
Parser.CAT_ID_NATION = 68;
Parser.CAT_ID_SETTLEMENT = 69;
Parser.CAT_ID_RITUAL = 70;
Parser.CAT_ID_VEHICLE = 71;
Parser.CAT_ID_TRAIT = 4;
Parser.CAT_ID_ORGANIZATION = 72;

Parser.CAT_ID_PAGE = 99;

// FIXME:
Parser.CAT_ID_TO_FULL = {};
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_QUICKREF] = "Quick Reference";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_VARIANT_RULE] = "Variant Rule";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_SUBSYSTEM] = "Subsystem";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_TABLE] = "Table";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_TABLE_GROUP] = "Table";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_BOOK] = "Book";

Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ANCESTRY] = "Ancestry";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_HERITAGE] = "Heritage";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_VE_HERITAGE] = "Versatile Heritage";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_BACKGROUND] = "Background";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CLASS] = "Class";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CLASS_FEATURE] = "Class Feature";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_SUBCLASS] = "Subclass";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_SUBCLASS_FEATURE] = "Subclass Feature";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ARCHETYPE] = "Archetype";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_FEAT] = "Feat";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_COMPANION] = "Companion";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_FAMILIAR] = "Familiar";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_EIDOLON] = "Eidolon";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_OPTIONAL_FEATURE] = "Optional Feature";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_OPTIONAL_FEATURE_LESSON] = "Lesson";

Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ADVENTURE] = "Adventure";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_HAZARD] = "Hazard";

Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ACTION] = "Action";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CREATURE] = "Bestiary";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CONDITION] = "Condition";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ITEM] = "Item";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_SPELL] = "Spell";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_AFFLICTION] = "Affliction";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CURSE] = "Curse";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_DISEASE] = "Disease";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ABILITY] = "Creature Ability";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_DEITY] = "Deity";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_LANGUAGE] = "Language";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_PLACE] = "Place";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_PLANE] = "Plane";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ORGANIZATION] = "Organization";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_NATION] = "Nation";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_SETTLEMENT] = "Settlement";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_RITUAL] = "Ritual";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_VEHICLE] = "Vehicle";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_TRAIT] = "Trait";

Parser.CAT_ID_TO_FULL[Parser.CAT_ID_PAGE] = "Page";

Parser.pageCategoryToFull = function (catId) {
	return Parser._parse_aToB(Parser.CAT_ID_TO_FULL, catId);
};

Parser.CAT_ID_TO_PROP = {};
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_QUICKREF] = null;
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_VARIANT_RULE] = "variantrule";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_SUBSYSTEM] = "variantrule";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_TABLE] = "table";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_TABLE_GROUP] = "tableGroup";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_BOOK] = "book";

Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ANCESTRY] = "ancestry";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_HERITAGE] = "heritage";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_VE_HERITAGE] = "versatileHeritage";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_BACKGROUND] = "background";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CLASS] = "class";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CLASS_FEATURE] = "classFeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_SUBCLASS] = "subclass";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_SUBCLASS_FEATURE] = "subclassFeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ARCHETYPE] = "archetype";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_FEAT] = "feat";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_COMPANION] = "companion";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_FAMILIAR] = "familiar";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_EIDOLON] = "eidolon";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_OPTIONAL_FEATURE] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_OPTIONAL_FEATURE_LESSON] = "optionalfeature";

Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ADVENTURE] = "adventure";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_HAZARD] = "hazard";

Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ACTION] = "action";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CREATURE] = "creature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CONDITION] = "condition";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ITEM] = "item";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_SPELL] = "spell";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_AFFLICTION] = "affliction";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CURSE] = "curse";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_DISEASE] = "disease";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ABILITY] = "ability";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_DEITY] = "deity";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_LANGUAGE] = "language";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_PLACE] = "place";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_PLANE] = "place";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ORGANIZATION] = "organization";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_NATION] = "place";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_SETTLEMENT] = "place";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_RITUAL] = "ritual";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_VEHICLE] = "vehicle";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_TRAIT] = "trait";

Parser.CAT_ID_TO_PROP[Parser.CAT_ID_PAGE] = null;

Parser.CAT_ID_TO_PROP[Parser.CAT_ID_GENERIC_DATA] = "generic";

Parser.pageCategoryToProp = function (catId) {
	return Parser._parse_aToB(Parser.CAT_ID_TO_PROP, catId);
};

Parser.ABIL_ABVS = ["str", "dex", "con", "int", "wis", "cha"];

Parser.bookOrdinalToAbv = (ordinal, preNoSuff) => {
	if (ordinal === undefined) return "";
	switch (ordinal.type) {
		case "part":
			return `${preNoSuff ? " " : ""}Part ${ordinal.identifier}${preNoSuff ? "" : " \u2014 "}`;
		case "chapter":
			return `${preNoSuff ? " " : ""}Ch. ${ordinal.identifier}${preNoSuff ? "" : ": "}`;
		case "episode":
			return `${preNoSuff ? " " : ""}Ep. ${ordinal.identifier}${preNoSuff ? "" : ": "}`;
		case "appendix":
			return `${preNoSuff ? " " : ""}App. ${ordinal.identifier}${preNoSuff ? "" : ": "}`;
		case "level":
			return `${preNoSuff ? " " : ""}Level ${ordinal.identifier}${preNoSuff ? "" : ": "}`;
		default:
			throw new Error(`Unhandled ordinal type "${ordinal.type}"`);
	}
};

Parser.nameToTokenName = function (name) {
	return name
		.normalize("NFD") // replace diactrics with their individual graphemes
		.replace(/[\u0300-\u036f]/g, "") // remove accent graphemes
		.replace(/Æ/g, "AE").replace(/æ/g, "ae")
		.replace(/"/g, "");
};

Parser.TM_A = "action";
Parser.TM_AA = "two";
Parser.TM_AAA = "three";
Parser.TM_R = "reaction";
Parser.TM_F = "free";
Parser.TM_ROUND = "round";
Parser.TM_MINS = "minute";
Parser.TM_HRS = "hour";
Parser.TM_DAYS = "day";
Parser.TM_VARIES = "varies";
Parser.TIME_ACTIONS = [Parser.TM_A, Parser.TM_R, Parser.TM_F];

Parser.TM_TO_ACTIVITY = {};
Parser.TM_TO_ACTIVITY[Parser.TM_F] = "Free Action";
Parser.TM_TO_ACTIVITY[Parser.TM_R] = "Reaction";
Parser.TM_TO_ACTIVITY[Parser.TM_A] = "Action";
Parser.TM_TO_ACTIVITY[Parser.TM_AA] = "Two-Action";
Parser.TM_TO_ACTIVITY[Parser.TM_AAA] = "Three-Action";
Parser.TM_TO_ACTIVITY[Parser.TM_ROUND] = "Rounds";
Parser.TM_TO_ACTIVITY[Parser.TM_VARIES] = "Varies";
Parser.TM_TO_ACTIVITY[Parser.TM_MINS] = "Minutes";
Parser.TM_TO_ACTIVITY[Parser.TM_HRS] = "Hours";
Parser.TM_TO_ACTIVITY[Parser.TM_DAYS] = "Days";

Parser.ACTIVITY_TYPE_TO_IDX = Object.keys(Parser.TM_TO_ACTIVITY).map((a, ix) => ({[a]: ix})).reduce((a, b) => Object.assign(a, b), {});
Parser.activityTypeToNumber = function (activity) {
	return Parser._parse_aToB(Parser.ACTIVITY_TYPE_TO_IDX, activity, 900000000);
}

Parser.timeToActivityType = function (time) {
	if (time == null) return null;
	if (time.unit == null) return null;
	switch (time.unit) {
		case Parser.TM_VARIES:
		case Parser.TM_DAYS:
		case Parser.TM_HRS:
		case Parser.TM_MINS:
		case Parser.TM_ROUND:
		case Parser.TM_R:
		case Parser.TM_F:
			return Parser.TM_TO_ACTIVITY[time.unit];
		case Parser.TM_A: {
			if (time.number === 1) return Parser.TM_TO_ACTIVITY[Parser.TM_A];
			if (time.number === 2) return Parser.TM_TO_ACTIVITY[Parser.TM_AA];
			if (time.number === 3) return Parser.TM_TO_ACTIVITY[Parser.TM_AAA];
		}
	}
};

Parser.getNormalisedTime = function (time) {
	if (time == null) return 0;
	if (time === "Exploration") return 900000000;
	if (time === "Downtime") return 900000001;
	let multiplier = 1;
	let offset = 0;
	switch (time.unit) {
		case Parser.TM_F: offset = 1; break;
		case Parser.TM_R: offset = 2; break;
		case Parser.TM_A: multiplier = 10; break;
		case Parser.TM_AA: multiplier = 20; break;
		case Parser.TM_AAA: multiplier = 30; break;
		case Parser.TM_ROUND: multiplier = 60; break;
		case Parser.TM_MINS: multiplier = 600; break;
		case Parser.TM_HRS: multiplier = 36000; break;
		case Parser.TM_DAYS: multiplier = 864000; break;
		case Parser.TM_VARIES: multiplier = 100; break;
	}
	return (multiplier * time.number) + offset;
};

Parser.timeToFullEntry = function (time) {
	if (time.entry != null) return time.entry;
	if (Parser.TIME_ACTIONS.includes(time.unit)) {
		if (time.number === 1 && time.unit === Parser.TM_F) return "{@as f}";
		if (time.number === 1 && time.unit === Parser.TM_R) return "{@as r}";
		if (time.number === 2 && time.unit === Parser.TM_A) return "{@as 2}";
		if (time.number === 3 && time.unit === Parser.TM_A) return "{@as 3}";
		return "{@as 1}";
	}
	return `${time.number} ${time.unit}${time.number >= 2 ? "s" : ""}`;
}

Parser.freqToFullEntry = function (freq) {
	if (freq.special != null) return freq.special;
	freq.number = Parser.numberToText(freq.freq, true)
	return `${freq.number} ${freq.recurs ? "every" : "per"} ${freq.interval || ""} ${freq.interval >= 2 ? `${freq.unit}s` : freq.customUnit ? freq.customUnit : freq.unit}${freq.overcharge ? ", plus overcharge" : ""}`;
}

Parser.timeToTableStr = function (time) {
	if (time.unit === "varies") return "Varies";
	if (Parser.TIME_ACTIONS.includes(time.unit)) {
		if (time.number === 1 && time.unit === Parser.TM_F) return "Free Action";
		if (time.number === 1 && time.unit === Parser.TM_R) return "Reaction";
		if (time.number === 2 && time.unit === Parser.TM_A) return "Two-Action";
		if (time.number === 3 && time.unit === Parser.TM_A) return "Three-Action";
		return "Action";
	}
	return `${time.number} ${time.unit.uppercaseFirst()}${time.number >= 2 ? "s" : ""}`;
}

UNT_FEET = "feet";
UNT_MILES = "mile";
Parser.INCHES_PER_FOOT = 12;
Parser.FEET_PER_MILE = 5280;

RNG_SELF = "self";
RNG_UNLIMITED = "unlimited";
RNG_UNLIMITED_SAME_PLANE = "planetary";
RNG_UNLIMITED_OTHER_PLANE = "interplanar";
RNG_TOUCH = "touch";

Parser.rangeToFull = function (range) {
	if (range == null) return "";
	if (range.entry) return range.entry;
	if (range.unit === UNT_FEET) return `${range.number} ${range.number === 1 ? "foot" : "feet"}`;
	if (range.unit === UNT_MILES) return `${range.number} ${range.number === 1 ? "mile" : "miles"}`;
	return range.unit;
}

// TODO: Handle range/area types: emanation, cone etc?
Parser.getNormalisedRange = function (range) {
	if (!MiscUtil.isObject(range)) return 0;
	let multiplier = 1;
	let distance = 0;
	let offset = 0;

	switch (range.unit) {
		case null: distance = 0; break;
		case UNT_FEET: multiplier = Parser.INCHES_PER_FOOT; distance = range.number; break;
		case UNT_MILES: multiplier = Parser.INCHES_PER_FOOT * Parser.FEET_PER_MILE; distance = range.number; break;
		case RNG_TOUCH: distance = 1; break;
		case RNG_UNLIMITED_SAME_PLANE: distance = 900000000; break;
		case RNG_UNLIMITED_OTHER_PLANE: distance = 900000001; break;
		case RNG_UNLIMITED: distance = 900000002; break;
		case "unknown": distance = 900000003; break;
		default: {
			// it's homebrew?
			const fromBrew = MiscUtil.get(BrewUtil.homebrewMeta, "spellDistanceUnits", range.unit);
			if (fromBrew) {
				const ftPerUnit = fromBrew.feetPerUnit;
				if (ftPerUnit != null) {
					multiplier = Parser.INCHES_PER_FOOT * ftPerUnit;
					distance = range.number;
				} else {
					distance = 910000000; // default to max distance, to have them displayed at the bottom
				}
			}
			break;
		}
	}
	// value in inches, to allow greater granularity
	return (multiplier * distance) + offset;
}

Parser.getFilterRange = function (object) {
	const fRan = object.range || {type: null};
	if (fRan.unit !== null) {
		let norm_range = Parser.getNormalisedRange(fRan);
		if (norm_range === 1) {
			return "Touch"
		} else if (norm_range < Parser.INCHES_PER_FOOT * 10) {
			return "5 feet"
		} else if (norm_range < Parser.INCHES_PER_FOOT * 25) {
			return "10 feet"
		} else if (norm_range < Parser.INCHES_PER_FOOT * 50) {
			return "25 feet"
		} else if (norm_range < Parser.INCHES_PER_FOOT * 100) {
			return "50 feet"
		} else if (norm_range < Parser.INCHES_PER_FOOT * 500) {
			return "100 feet"
		} else if (norm_range < Parser.INCHES_PER_FOOT * Parser.FEET_PER_MILE) {
			return "500 feet"
		} else if (norm_range < 900000000) {
			return "1 mile"
		} else if (norm_range < 900000001) {
			return "Planetary"
		} else if (norm_range < 900000002) {
			return "Unlimited"
		} else {
			return "Varies"
		}
	} else {
		return null
	}
}

Parser.getFilterDuration = function (object) {
	const duration = object.duration || {type: "special"}
	switch (duration.type) {
		case null: return "Instant";
		case "timed": {
			if (!duration.duration) return "Special";
			switch (duration.duration.unit) {
				case "turn":
				case "round": return "1 Round";

				case "minute": {
					const amt = duration.duration.number || 0;
					if (amt <= 1) return "1 Minute";
					if (amt <= 10) return "10 Minutes";
					if (amt <= 60) return "1 Hour";
					if (amt <= 8 * 60) return "8 Hours";
					return "24+ Hours";
				}

				case "hour": {
					const amt = duration.duration.number || 0;
					if (amt <= 1) return "1 Hour";
					if (amt <= 8) return "8 Hours";
					return "24+ Hours";
				}

				case "week":
				case "day":
				case "year": return "24+ Hours";
				default: return "Special";
			}
		}
		case "unlimited": return "Unlimited";
		case "special":
		default: return "Special";
	}
}

Parser.ATB_ABV_TO_FULL = {
	"str": "Strength",
	"dex": "Dexterity",
	"con": "Constitution",
	"int": "Intelligence",
	"wis": "Wisdom",
	"cha": "Charisma",
};

Parser.ATB_TO_NUM = {
	"Strength": 1,
	"Dexterity": 2,
	"Constitution": 3,
	"Intelligence": 4,
	"Wisdom": 5,
	"Charisma": 6,
	"Free": 7,
}

Parser.attAbvToFull = function (abv) {
	return Parser._parse_aToB(Parser.ATB_ABV_TO_FULL, abv);
};

// TODO: Rework for better clarity?
Parser.CONDITION_TO_COLOR = {
	"Blinded": "#525252",
	"Clumsy": "#5c57af",
	"Concealed": "#525252",
	"Confused": "#c9c91e",
	"Controlled": "#ed07bb",
	"Dazzled": "#db8f48",
	"Deafened": "#666464",
	"Doomed": "#9e1414",
	"Drained": "#72aa01",
	"Dying": "#ff0000",
	"Enfeebled": "#42a346",
	"Fascinated": "#fc7b02",
	"Fatigued": "#7913c6",
	"Flat-Footed": "#7f7f7f",
	"Fleeing": "#c9ca18",
	"Frightened": "#c9ca18",
	"Grabbed": "#00e0ac",
	"Immobilized": "#009f7a",
	"Invisible": "#71738c",
	"Paralyzed": "#015642",
	"Persistent Damage": "#ed6904",
	"Petrified": "#2fd62f",
	"Prone": "#00e070",
	"Quickened": "#00d5e0",
	"Restrained": "#007c5f",
	"Sickened": "#008202",
	"Slowed": "#2922a5",
	"Stunned": "#4b43db",
	"Stupefied": "#c94873",
	"Unconscious": "#a0111b",
	"Wounded": "#e81919",

};
// TODO: It would be nice to have everything in a json file...
// Would also make it a lot easier to validate with a schema.

// Listing of all the sources
SRC_CRB = "CRB";
SRC_APG = "APG";
SRC_B1 = "B1";
SRC_B2 = "B2";
SRC_B3 = "B3";
SRC_GMG = "GMG";
SRC_SOM = "SoM";
SRC_LOWG = "LOWG";
SRC_LOCG = "LOCG";
SRC_LOGM = "LOGM";
SRC_LOGMWS = "LOGMWS";
SRC_LOL = "LOL";
SRC_LOPSG = "LOPSG";
SRC_LOAG = "LOAG";
SRC_LOME = "LOME";
SRC_LOACLO = "LOACLO";
SRC_AAWS = "AAWS";
SRC_GNG = "G&G";
SRC_LOTGB = "LOTGB"
SRC_LOMM = "LOMM"
SRC_LOKL = "LOKL"
SRC_LOTG = "LOTG"
SRC_BotD = "BotD"
SRC_AOA0 = "AoA0";
SRC_AOA1 = "AoA1";
SRC_AOA2 = "AoA2";
SRC_AOA3 = "AoA3";
SRC_AOA4 = "AoA4";
SRC_AOA5 = "AoA5";
SRC_AOA6 = "AoA6";
SRC_EC0 = "EC0";
SRC_EC1 = "EC1";
SRC_EC2 = "EC2";
SRC_EC3 = "EC3";
SRC_EC4 = "EC4";
SRC_EC5 = "EC5";
SRC_EC6 = "EC6";
SRC_AOE0 = "AoE0";
SRC_AOE1 = "AoE1";
SRC_AOE2 = "AoE2";
SRC_AOE3 = "AoE3";
SRC_AOE4 = "AoE4";
SRC_AOE5 = "AoE5";
SRC_AOE6 = "AoE6";
SRC_AV0 = "AV0";
SRC_AV1 = "AV1";
SRC_AV2 = "AV2";
SRC_AV3 = "AV3";
SRC_FRP0 = "FRP0";
SRC_FRP1 = "FRP1";
SRC_FRP2 = "FRP2";
SRC_FRP3 = "FRP3";
SRC_SOT0 = "SoT0";
SRC_SOT1 = "SoT1";
SRC_SOT2 = "SoT2";
SRC_SOT3 = "SoT3";
SRC_SOT4 = "SoT4";
SRC_SOT5 = "SoT5";
SRC_SOT6 = "SoT6";
SRC_OoA0 = "OoA0";
SRC_OoA1 = "OoA1";
SRC_OoA2 = "OoA2";
SRC_OoA3 = "OoA3";
SRC_QFF0 = "QFF0";
SRC_QFF1 = "QFF1";
SRC_QFF2 = "QFF2";
SRC_QFF3 = "QFF3";
SRC_BL0 = "BL0";
SRC_BL1 = "BL1";
SRC_BL2 = "BL2";
SRC_BL3 = "BL3";
SRC_BL4 = "BL4";
SRC_BL5 = "BL5";
SRC_BL6 = "BL6";
SRC_GW0 = "GW0";
SRC_GW1 = "GW1";
SRC_GW2 = "GW2";
SRC_GW3 = "GW3";
SRC_SLI = "Sli";
SRC_NGD = "NGD";
SRC_FOP = "FoP";
SRC_LTIBA = "LTiBA";
SRC_TIO = "TiO";
SRC_DA = "DA";
SRC_LOIL = "LOIL";
SRC_PFUM = "PFUM";

SRC_3PP_SUFFIX = " 3pp";

AP_PREFIX = "Adventure Path: ";
AP_PREFIX_SHORT = "AP: ";

FotRP_PREFIX = "Fists of the Ruby Phoenix: "
FotRP_PREFIX_SHORT = "FotRP: "

AV_PREFIX = "Abomination Vaults: "
AV_PREFIX_SHORT = "AV: "

AoE_PREFIX = "Agents of Edgewatch: "
AoE_PREFIX_SHORT = "AoE: "

EC_PREFIX = "Extinction Curse: "
EC_PREFIX_SHORT = "EC: "

AoA_PREFIX = "Age of Ashes: "
AoA_PREFIX_SHORT = "AoA: "

SoT_PREFIX = "Strength of Thousands: "
SoT_PREFIX_SHORT = "SoT: "

OoA_PREFIX = "Outlaws of Alkenstar: "
OoA_PREFIX_SHORT = "OoA: "

BL_PREFIX = "Blood Lords: "
BL_PREFIX_SHORT = "BL: "

GW_PREFIX = "Gatewalkers: "
GW_PREFIX_SHORT = "GW: "

LO_PREFIX = "Lost Omens: ";
LO_PREFIX_SHORT = "LO: ";

Parser.COMPACT_PREFIX_MAP = [
	{re: /Fists of the Ruby Phoenix #(\d): /, replaceWith: "FotRP$1: "},
	{re: /Abomination Vaults #(\d): /, replaceWith: "AV$1: "},
	{re: /Agents of Edgewatch #(\d): /, replaceWith: "AoE$1: "},
	{re: /Extinction Curse #(\d): /, replaceWith: "EC$1: "},
	{re: /Age of Ashes #(\d): /, replaceWith: "AoA$1: "},
	{re: /Strength of Thousands #(\d): /, replaceWith: "SoT$1: "},
	{re: /Outlaws of Alkenstar #(\d): /, replaceWith: "OoA$1: "},
	{re: /Quest for the Frozen Flame #(\d): /, replaceWith: "QFF$1: "},
	{re: /Blood Lords #(\d): /, replaceWith: "BL$1: "},
	{re: /Gatewalkers #(\d): /, replaceWith: "GW$1: "},
];

Parser.SOURCE_PREFIX_TO_SHORT = {};
Parser.SOURCE_PREFIX_TO_SHORT[LO_PREFIX] = LO_PREFIX_SHORT;
Parser.SOURCE_PREFIX_TO_SHORT[AP_PREFIX] = AP_PREFIX_SHORT;
Parser.SOURCE_PREFIX_TO_SHORT[FotRP_PREFIX] = FotRP_PREFIX_SHORT;
Parser.SOURCE_PREFIX_TO_SHORT[AV_PREFIX] = AV_PREFIX_SHORT;
Parser.SOURCE_PREFIX_TO_SHORT[AoE_PREFIX] = AoE_PREFIX_SHORT;
Parser.SOURCE_PREFIX_TO_SHORT[EC_PREFIX] = EC_PREFIX_SHORT;
Parser.SOURCE_PREFIX_TO_SHORT[AoA_PREFIX] = AoA_PREFIX_SHORT;
Parser.SOURCE_PREFIX_TO_SHORT[SoT_PREFIX] = SoT_PREFIX_SHORT;
Parser.SOURCE_PREFIX_TO_SHORT[OoA_PREFIX] = OoA_PREFIX_SHORT;
Parser.SOURCE_PREFIX_TO_SHORT[BL_PREFIX] = BL_PREFIX_SHORT;
Parser.SOURCE_PREFIX_TO_SHORT[GW_PREFIX] = GW_PREFIX_SHORT;
// Turn JSON to Full Title
Parser.SOURCE_JSON_TO_FULL = {};
Parser.SOURCE_JSON_TO_FULL[SRC_CRB] = "Core Rulebook";
Parser.SOURCE_JSON_TO_FULL[SRC_B1] = "Bestiary";
Parser.SOURCE_JSON_TO_FULL[SRC_GMG] = "Gamemastery Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_B2] = "Bestiary 2";
Parser.SOURCE_JSON_TO_FULL[SRC_APG] = "Advanced Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_B3] = "Bestiary 3";
Parser.SOURCE_JSON_TO_FULL[SRC_SOM] = "Secrets of Magic";
Parser.SOURCE_JSON_TO_FULL[SRC_LOWG] = "Lost Omens: World Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_LOCG] = "Lost Omens: Character Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_LOGM] = "Lost Omens: Gods & Magic";
Parser.SOURCE_JSON_TO_FULL[SRC_LOGMWS] = "Lost Omens: Gods & Magic Web Supplement";
Parser.SOURCE_JSON_TO_FULL[SRC_LOL] = "Lost Omens: Legends";
Parser.SOURCE_JSON_TO_FULL[SRC_LOPSG] = "Lost Omens: Pathfinder Society Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_LOAG] = "Lost Omens: Ancestry Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_LOME] = "Lost Omens: The Mwangi Expanse";
Parser.SOURCE_JSON_TO_FULL[SRC_LOACLO] = "Lost Omens: Absalom, City of Lost Omens";
Parser.SOURCE_JSON_TO_FULL[SRC_AAWS] = "Azarketi Ancestry Web Supplement";
Parser.SOURCE_JSON_TO_FULL[SRC_GNG] = "Guns & Gears";
Parser.SOURCE_JSON_TO_FULL[SRC_LOTGB] = "Lost Omens: The Grand Bazaar";
Parser.SOURCE_JSON_TO_FULL[SRC_LOMM] = "Lost Omens: Monsters of Myth";
Parser.SOURCE_JSON_TO_FULL[SRC_BotD] = "Book of the Dead";
Parser.SOURCE_JSON_TO_FULL[SRC_LOTG] = "Lost Omens: Travel Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_LOKL] = "Lost Omens: Knights of Lastwall";
Parser.SOURCE_JSON_TO_FULL[SRC_DA] = "Dark Archive";
Parser.SOURCE_JSON_TO_FULL[SRC_LOIL] = "Lost Omens: Impossible Lands";
Parser.SOURCE_JSON_TO_FULL[SRC_PFUM] = "PATHFINDER: FUMBUS!";

// Adventure Paths
Parser.SOURCE_JSON_TO_FULL[SRC_AOA0] = "Age of Ashes Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_AOA1] = "Age of Ashes #1: Hellknight Hill";
Parser.SOURCE_JSON_TO_FULL[SRC_AOA2] = "Age of Ashes #2: Cult of Cinders";
Parser.SOURCE_JSON_TO_FULL[SRC_AOA3] = "Age of Ashes #3: Tomorrow Must Burn";
Parser.SOURCE_JSON_TO_FULL[SRC_AOA4] = "Age of Ashes #4: Fires of the Haunted City";
Parser.SOURCE_JSON_TO_FULL[SRC_AOA5] = "Age of Ashes #5: Against the Scarlet Triad";
Parser.SOURCE_JSON_TO_FULL[SRC_AOA6] = "Age of Ashes #6: Broken Promises";

Parser.SOURCE_JSON_TO_FULL[SRC_EC0] = "Extinction Curse Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_EC1] = "Extinction Curse #1: The Show Must Go On";
Parser.SOURCE_JSON_TO_FULL[SRC_EC2] = "Extinction Curse #2: Legacy of the Lost God";
Parser.SOURCE_JSON_TO_FULL[SRC_EC3] = "Extinction Curse #3: Life's Long Shadows";
Parser.SOURCE_JSON_TO_FULL[SRC_EC4] = "Extinction Curse #4: Siege of the Dinosaurs";
Parser.SOURCE_JSON_TO_FULL[SRC_EC5] = "Extinction Curse #5: Lord of the Black Sands";
Parser.SOURCE_JSON_TO_FULL[SRC_EC6] = "Extinction Curse #6: The Apocalypse Prophet";

Parser.SOURCE_JSON_TO_FULL[SRC_AOE0] = "Agents of Edgewatch Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_AOE1] = "Agents of Edgewatch #1: Devil at the Dreaming Palace";
Parser.SOURCE_JSON_TO_FULL[SRC_AOE2] = "Agents of Edgewatch #2: Sixty Feet Under";
Parser.SOURCE_JSON_TO_FULL[SRC_AOE3] = "Agents of Edgewatch #3: All or Nothing";
Parser.SOURCE_JSON_TO_FULL[SRC_AOE4] = "Agents of Edgewatch #4: Assault on Hunting Lodge Seven";
Parser.SOURCE_JSON_TO_FULL[SRC_AOE5] = "Agents of Edgewatch #5: Belly of the Black Whale";
Parser.SOURCE_JSON_TO_FULL[SRC_AOE6] = "Agents of Edgewatch #6: Ruins of the Radiant Siege";

Parser.SOURCE_JSON_TO_FULL[SRC_AV0] = "Abomination Vaults Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_AV1] = "Abomination Vaults #1: Ruins of Gauntlight";
Parser.SOURCE_JSON_TO_FULL[SRC_AV2] = "Abomination Vaults #2: Hands of the Devil";
Parser.SOURCE_JSON_TO_FULL[SRC_AV3] = "Abomination Vaults #3: Eyes of Empty Death";

Parser.SOURCE_JSON_TO_FULL[SRC_FRP0] = "Fists of the Ruby Phoenix Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_FRP1] = "Fists of the Ruby Phoenix #1: Despair on Danger Island";
Parser.SOURCE_JSON_TO_FULL[SRC_FRP2] = "Fists of the Ruby Phoenix #2: Ready? Fight!";
Parser.SOURCE_JSON_TO_FULL[SRC_FRP3] = "Fists of the Ruby Phoenix #3: King of the Mountain";

Parser.SOURCE_JSON_TO_FULL[SRC_SOT0] = "Strength of Thousands Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_SOT1] = "Strength of Thousands #1: Kindled Magic";
Parser.SOURCE_JSON_TO_FULL[SRC_SOT2] = "Strength of Thousands #2: Spoken on the Song Wind";
Parser.SOURCE_JSON_TO_FULL[SRC_SOT3] = "Strength of Thousands #3: Hurricane's Howl";
Parser.SOURCE_JSON_TO_FULL[SRC_SOT4] = "Strength of Thousands #4: Secrets of the Temple-City";
Parser.SOURCE_JSON_TO_FULL[SRC_SOT5] = "Strength of Thousands #5: Doorway to the Red Star";
Parser.SOURCE_JSON_TO_FULL[SRC_SOT6] = "Strength of Thousands #6: Shadows of the Ancients";

Parser.SOURCE_JSON_TO_FULL[SRC_OoA0] = "Outlaws of Alkenstar Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_OoA1] = "Outlaws of Alkenstar #1: Punks in a Powder Keg";
Parser.SOURCE_JSON_TO_FULL[SRC_OoA2] = "Outlaws of Alkenstar #2: Cradle of Quartz";
Parser.SOURCE_JSON_TO_FULL[SRC_OoA3] = "Outlaws of Alkenstar #3: The Smoking Gun";

Parser.SOURCE_JSON_TO_FULL[SRC_QFF0] = "Quest for the Frozen Flame Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_QFF1] = "Quest for the Frozen Flame #1: Broken Tusk Moon";
Parser.SOURCE_JSON_TO_FULL[SRC_QFF2] = "Quest for the Frozen Flame #2: Lost Mammoth Valley";
Parser.SOURCE_JSON_TO_FULL[SRC_QFF3] = "Quest for the Frozen Flame #3: Burning Tundra";

Parser.SOURCE_JSON_TO_FULL[SRC_BL0] = "Blood Lords Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_BL1] = "Blood Lords #1: Zombie Fest";
Parser.SOURCE_JSON_TO_FULL[SRC_BL2] = "Blood Lords #2: Graveclaw";
Parser.SOURCE_JSON_TO_FULL[SRC_BL3] = "Blood Lords #3: Field of Maidens";
Parser.SOURCE_JSON_TO_FULL[SRC_BL4] = "Blood Lords #4: The Ghouls Hunger";
Parser.SOURCE_JSON_TO_FULL[SRC_BL5] = "Blood Lords #5: A Taste of Ashes";
Parser.SOURCE_JSON_TO_FULL[SRC_BL6] = "Blood Lords #6: Ghost King's Rage";

Parser.SOURCE_JSON_TO_FULL[SRC_GW0] = "Gatewalkers Player's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_GW1] = "Gatewalkers #1: The Seventh Arch";
Parser.SOURCE_JSON_TO_FULL[SRC_GW2] = "Gatewalkers #2: They Watched the Stars";
// Parser.SOURCE_JSON_TO_FULL[SRC_GW3] = "Gatewalkers #3: UNKNOWN";

Parser.SOURCE_JSON_TO_FULL[SRC_SLI] = "The Slithering";
Parser.SOURCE_JSON_TO_FULL[SRC_NGD] = "Night of the Gray Death";
Parser.SOURCE_JSON_TO_FULL[SRC_FOP] = "The Fall of Plaguestone";
Parser.SOURCE_JSON_TO_FULL[SRC_TIO] = "Troubles in Otari";
Parser.SOURCE_JSON_TO_FULL[SRC_LTIBA] = "Little Trouble in Big Absalom";
// Turn JSON to Abbreviations
Parser.SOURCE_JSON_TO_ABV = {};
Parser.SOURCE_JSON_TO_ABV[SRC_CRB] = "CRB";
Parser.SOURCE_JSON_TO_ABV[SRC_B1] = "B1";
Parser.SOURCE_JSON_TO_ABV[SRC_GMG] = "GMG";
Parser.SOURCE_JSON_TO_ABV[SRC_B2] = "B2";
Parser.SOURCE_JSON_TO_ABV[SRC_APG] = "APG";
Parser.SOURCE_JSON_TO_ABV[SRC_B3] = "B3";
Parser.SOURCE_JSON_TO_ABV[SRC_SOM] = "SoM";
Parser.SOURCE_JSON_TO_ABV[SRC_LOWG] = "LOWG";
Parser.SOURCE_JSON_TO_ABV[SRC_LOCG] = "LOCG";
Parser.SOURCE_JSON_TO_ABV[SRC_LOGM] = "LOGM";
Parser.SOURCE_JSON_TO_ABV[SRC_LOGMWS] = "LOGMWS";
Parser.SOURCE_JSON_TO_ABV[SRC_LOL] = "LOL";
Parser.SOURCE_JSON_TO_ABV[SRC_LOPSG] = "LOPSG";
Parser.SOURCE_JSON_TO_ABV[SRC_LOAG] = "LOAG";
Parser.SOURCE_JSON_TO_ABV[SRC_LOME] = "LOME";
Parser.SOURCE_JSON_TO_ABV[SRC_LOACLO] = "LOACLO";
Parser.SOURCE_JSON_TO_ABV[SRC_AAWS] = "AAWS";
Parser.SOURCE_JSON_TO_ABV[SRC_GNG] = "G&G";
Parser.SOURCE_JSON_TO_ABV[SRC_LOTGB] = "LOTGB";
Parser.SOURCE_JSON_TO_ABV[SRC_LOMM] = "LOMM";
Parser.SOURCE_JSON_TO_ABV[SRC_BotD] = "BotD";
Parser.SOURCE_JSON_TO_ABV[SRC_LOTG] = "LOTG";
Parser.SOURCE_JSON_TO_ABV[SRC_LOKL] = "LOKL";
Parser.SOURCE_JSON_TO_ABV[SRC_DA] = "DA";
Parser.SOURCE_JSON_TO_ABV[SRC_LOIL] = "LOIL";
Parser.SOURCE_JSON_TO_ABV[SRC_PFUM] = "PFUM";

// Adventure Paths
Parser.SOURCE_JSON_TO_ABV[SRC_AOA0] = "AoA0";
Parser.SOURCE_JSON_TO_ABV[SRC_AOA1] = "AoA1";
Parser.SOURCE_JSON_TO_ABV[SRC_AOA2] = "AoA2";
Parser.SOURCE_JSON_TO_ABV[SRC_AOA3] = "AoA3";
Parser.SOURCE_JSON_TO_ABV[SRC_AOA4] = "AoA4";
Parser.SOURCE_JSON_TO_ABV[SRC_AOA5] = "AoA5";
Parser.SOURCE_JSON_TO_ABV[SRC_AOA6] = "AoA6";

Parser.SOURCE_JSON_TO_ABV[SRC_EC0] = "EC0";
Parser.SOURCE_JSON_TO_ABV[SRC_EC1] = "EC1";
Parser.SOURCE_JSON_TO_ABV[SRC_EC2] = "EC2";
Parser.SOURCE_JSON_TO_ABV[SRC_EC3] = "EC3";
Parser.SOURCE_JSON_TO_ABV[SRC_EC4] = "EC4";
Parser.SOURCE_JSON_TO_ABV[SRC_EC5] = "EC5";
Parser.SOURCE_JSON_TO_ABV[SRC_EC6] = "EC6";

Parser.SOURCE_JSON_TO_ABV[SRC_AOE0] = "AoE0";
Parser.SOURCE_JSON_TO_ABV[SRC_AOE1] = "AoE1";
Parser.SOURCE_JSON_TO_ABV[SRC_AOE2] = "AoE2";
Parser.SOURCE_JSON_TO_ABV[SRC_AOE3] = "AoE3";
Parser.SOURCE_JSON_TO_ABV[SRC_AOE4] = "AoE4";
Parser.SOURCE_JSON_TO_ABV[SRC_AOE5] = "AoE5";
Parser.SOURCE_JSON_TO_ABV[SRC_AOE6] = "AoE6";

Parser.SOURCE_JSON_TO_ABV[SRC_AV0] = "AV0";
Parser.SOURCE_JSON_TO_ABV[SRC_AV1] = "AV1";
Parser.SOURCE_JSON_TO_ABV[SRC_AV2] = "AV2";
Parser.SOURCE_JSON_TO_ABV[SRC_AV3] = "AV3";

Parser.SOURCE_JSON_TO_ABV[SRC_FRP0] = "FRP0";
Parser.SOURCE_JSON_TO_ABV[SRC_FRP1] = "FRP1";
Parser.SOURCE_JSON_TO_ABV[SRC_FRP2] = "FRP2";
Parser.SOURCE_JSON_TO_ABV[SRC_FRP3] = "FRP3";

Parser.SOURCE_JSON_TO_ABV[SRC_SOT0] = "SoT0";
Parser.SOURCE_JSON_TO_ABV[SRC_SOT1] = "SoT1";
Parser.SOURCE_JSON_TO_ABV[SRC_SOT2] = "SoT2";
Parser.SOURCE_JSON_TO_ABV[SRC_SOT3] = "SoT3";
Parser.SOURCE_JSON_TO_ABV[SRC_SOT4] = "SoT4";
Parser.SOURCE_JSON_TO_ABV[SRC_SOT5] = "SoT5";
Parser.SOURCE_JSON_TO_ABV[SRC_SOT6] = "SoT6";

Parser.SOURCE_JSON_TO_ABV[SRC_OoA0] = "OoA0";
Parser.SOURCE_JSON_TO_ABV[SRC_OoA1] = "OoA1";
Parser.SOURCE_JSON_TO_ABV[SRC_OoA2] = "OoA2";
Parser.SOURCE_JSON_TO_ABV[SRC_OoA3] = "OoA3";

Parser.SOURCE_JSON_TO_ABV[SRC_QFF0] = "QFF0";
Parser.SOURCE_JSON_TO_ABV[SRC_QFF1] = "QFF1";
Parser.SOURCE_JSON_TO_ABV[SRC_QFF2] = "QFF2";
Parser.SOURCE_JSON_TO_ABV[SRC_QFF3] = "QFF3";

Parser.SOURCE_JSON_TO_ABV[SRC_GW0] = "GW0";
Parser.SOURCE_JSON_TO_ABV[SRC_GW1] = "GW1";
Parser.SOURCE_JSON_TO_ABV[SRC_GW2] = "GW2";
Parser.SOURCE_JSON_TO_ABV[SRC_GW3] = "GW3";

Parser.SOURCE_JSON_TO_ABV[SRC_BL0] = "BL0";
Parser.SOURCE_JSON_TO_ABV[SRC_BL1] = "BL1";
Parser.SOURCE_JSON_TO_ABV[SRC_BL2] = "BL2";
Parser.SOURCE_JSON_TO_ABV[SRC_BL3] = "BL3";
Parser.SOURCE_JSON_TO_ABV[SRC_BL4] = "BL4";
Parser.SOURCE_JSON_TO_ABV[SRC_BL5] = "BL5";
Parser.SOURCE_JSON_TO_ABV[SRC_BL6] = "BL6";

Parser.SOURCE_JSON_TO_ABV[SRC_SLI] = "Sli";
Parser.SOURCE_JSON_TO_ABV[SRC_NGD] = "NGD";
Parser.SOURCE_JSON_TO_ABV[SRC_FOP] = "FoP";
Parser.SOURCE_JSON_TO_ABV[SRC_LTIBA] = "LTiBA";
Parser.SOURCE_JSON_TO_ABV[SRC_TIO] = "TiO";
// Turn JSON to Date of Release
Parser.SOURCE_JSON_TO_DATE = {};
Parser.SOURCE_JSON_TO_DATE[SRC_CRB] = "2019-08-01";
Parser.SOURCE_JSON_TO_DATE[SRC_B1] = "2019-08-01";
Parser.SOURCE_JSON_TO_DATE[SRC_LOWG] = "2019-08-28";
Parser.SOURCE_JSON_TO_DATE[SRC_LOCG] = "2019-10-16";
Parser.SOURCE_JSON_TO_DATE[SRC_LOGM] = "2020-01-29";
Parser.SOURCE_JSON_TO_DATE[SRC_LOGMWS] = "2020-01-29";
Parser.SOURCE_JSON_TO_DATE[SRC_GMG] = "2020-02-26";
Parser.SOURCE_JSON_TO_DATE[SRC_EC3] = "2020-03-25";
Parser.SOURCE_JSON_TO_DATE[SRC_B2] = "2020-05-27";
Parser.SOURCE_JSON_TO_DATE[SRC_LOL] = "2020-07-30";
Parser.SOURCE_JSON_TO_DATE[SRC_APG] = "2020-08-30";
Parser.SOURCE_JSON_TO_DATE[SRC_LOPSG] = "2020-10-14";
Parser.SOURCE_JSON_TO_DATE[SRC_LOAG] = "2021-02-24";
Parser.SOURCE_JSON_TO_DATE[SRC_AAWS] = "2021-02-24";
Parser.SOURCE_JSON_TO_DATE[SRC_B3] = "2021-03-31";
Parser.SOURCE_JSON_TO_DATE[SRC_B3] = "2021-07-07";
Parser.SOURCE_JSON_TO_DATE[SRC_SOM] = "2021-08-25";
Parser.SOURCE_JSON_TO_DATE[SRC_GNG] = "2021-10-13";
Parser.SOURCE_JSON_TO_DATE[SRC_LOTGB] = "2021-10-13";
Parser.SOURCE_JSON_TO_DATE[SRC_LOMM] = "2021-12-22";
Parser.SOURCE_JSON_TO_DATE[SRC_BotD] = "2022-04-27";
// Turn JSON to Paizo Store
Parser.SOURCE_JSON_TO_STORE = {};
Parser.SOURCE_JSON_TO_STORE[SRC_CRB] = "https://paizo.com/products/btq01zp3";
Parser.SOURCE_JSON_TO_STORE[SRC_B1] = "https://paizo.com/products/btq01zp4";
Parser.SOURCE_JSON_TO_STORE[SRC_LOWG] = "https://paizo.com/products/btq01zoj";
Parser.SOURCE_JSON_TO_STORE[SRC_LOCG] = "https://paizo.com/products/btq01zt4";
Parser.SOURCE_JSON_TO_STORE[SRC_LOGM] = "https://paizo.com/products/btq021wf";
Parser.SOURCE_JSON_TO_STORE[SRC_LOGMWS] = "https://paizo.com/products/btq021wf";
Parser.SOURCE_JSON_TO_STORE[SRC_GMG] = "https://paizo.com/products/btq022c1";
Parser.SOURCE_JSON_TO_STORE[SRC_EC3] = "https://paizo.com/products/btq01zuh";
Parser.SOURCE_JSON_TO_STORE[SRC_B2] = "https://paizo.com/products/btq022yq";
Parser.SOURCE_JSON_TO_STORE[SRC_LOL] = "https://paizo.com/products/btq023gd";
Parser.SOURCE_JSON_TO_STORE[SRC_APG] = "https://paizo.com/products/btq023ih";
Parser.SOURCE_JSON_TO_STORE[SRC_LOPSG] = "https://paizo.com/products/btq0250x";
Parser.SOURCE_JSON_TO_STORE[SRC_LOAG] = "https://paizo.com/products/btq026k5";
Parser.SOURCE_JSON_TO_STORE[SRC_LOME] = "https://paizo.com/products/btq026i4";
Parser.SOURCE_JSON_TO_STORE[SRC_AAWS] = "https://paizo-images.s3-us-west-2.amazonaws.com/image/download/Azarketi+Ancestry.pdf";
Parser.SOURCE_JSON_TO_STORE[SRC_B3] = "https://paizo.com/products/btq027mn";
Parser.SOURCE_JSON_TO_STORE[SRC_SOM] = "https://paizo.com/products/btq027uy";
Parser.SOURCE_JSON_TO_STORE[SRC_GNG] = "https://paizo.com/products/btq026mw";
Parser.SOURCE_JSON_TO_STORE[SRC_LOTGB] = "https://paizo.com/products/btq027kc";
Parser.SOURCE_JSON_TO_STORE[SRC_LOMM] = "https://paizo.com/products/btq027u2";
Parser.SOURCE_JSON_TO_STORE[SRC_BotD] = "https://paizo.com/products/btq02c0j";
Parser.SOURCE_JSON_TO_STORE[SRC_LOTG] = "https://paizo.com/products/btq02c20";
Parser.SOURCE_JSON_TO_STORE[SRC_LOKL] = "https://paizo.com/products/btq02c3a";
// Adventure Paths
Parser.SOURCE_JSON_TO_STORE[SRC_AOA0] = "https://paizo.com/products/btq024wj";
Parser.SOURCE_JSON_TO_STORE[SRC_AOA1] = "https://paizo.com/products/btq024tw";
Parser.SOURCE_JSON_TO_STORE[SRC_AOA2] = "https://paizo.com/products/btq022ci";
Parser.SOURCE_JSON_TO_STORE[SRC_AOA3] = "https://paizo.com/products/btq022lx";
Parser.SOURCE_JSON_TO_STORE[SRC_AOA4] = "https://paizo.com/products/btq0233p";
Parser.SOURCE_JSON_TO_STORE[SRC_AOA5] = "https://paizo.com/products/btq023dz";
Parser.SOURCE_JSON_TO_STORE[SRC_AOA6] = "https://paizo.com/products/btq023g1";

Parser.SOURCE_JSON_TO_STORE[SRC_EC0] = "https://paizo.com/products/btq022ks";
Parser.SOURCE_JSON_TO_STORE[SRC_EC1] = "https://paizo.com/products/btq01zqb"
Parser.SOURCE_JSON_TO_STORE[SRC_EC2] = "https://paizo.com/products/btq01zrd";
Parser.SOURCE_JSON_TO_STORE[SRC_EC3] = "https://paizo.com/products/btq01zuh";
Parser.SOURCE_JSON_TO_STORE[SRC_EC4] = "https://paizo.com/products/btq0216l";
Parser.SOURCE_JSON_TO_STORE[SRC_EC5] = "https://paizo.com/products/btq021by";
Parser.SOURCE_JSON_TO_STORE[SRC_EC6] = "https://paizo.com/products/btq021f4";

Parser.SOURCE_JSON_TO_STORE[SRC_AOE0] = "https://paizo.com/products/btq01zth";
Parser.SOURCE_JSON_TO_STORE[SRC_AOE1] = "https://paizo.com/products/btq01znq";
Parser.SOURCE_JSON_TO_STORE[SRC_AOE2] = "https://paizo.com/products/btq01znt";
Parser.SOURCE_JSON_TO_STORE[SRC_AOE3] = "https://paizo.com/products/btq01zrs";
Parser.SOURCE_JSON_TO_STORE[SRC_AOE4] = "https://paizo.com/products/btq0204d";
Parser.SOURCE_JSON_TO_STORE[SRC_AOE5] = "https://paizo.com/products/btq02065";
Parser.SOURCE_JSON_TO_STORE[SRC_AOE6] = "https://paizo.com/products/btq021cb";

Parser.SOURCE_JSON_TO_STORE[SRC_AV0] = "https://paizo.com/community/blog/v5748dyo6shjm";
Parser.SOURCE_JSON_TO_STORE[SRC_AV1] = "https://paizo.com/products/btq026kj";
Parser.SOURCE_JSON_TO_STORE[SRC_AV2] = "https://paizo.com/products/btq027jm";
Parser.SOURCE_JSON_TO_STORE[SRC_AV3] = "https://paizo.com/products/btq024xm";

Parser.SOURCE_JSON_TO_STORE[SRC_FRP0] = "https://paizo.com/community/blog/v5748dyo6shmo";
Parser.SOURCE_JSON_TO_STORE[SRC_FRP1] = "https://paizo.com/products/btq027qd";
Parser.SOURCE_JSON_TO_STORE[SRC_FRP2] = "https://paizo.com/products/btq027sp";
Parser.SOURCE_JSON_TO_STORE[SRC_FRP3] = "https://paizo.com/products/btq027sq";

Parser.SOURCE_JSON_TO_STORE[SRC_SOT0] = "https://paizo.com/community/blog/v5748dyo6shr4";
Parser.SOURCE_JSON_TO_STORE[SRC_SOT1] = "https://paizo.com/products/btq026li";
Parser.SOURCE_JSON_TO_STORE[SRC_SOT2] = "https://paizo.com/products/btq026mv";
Parser.SOURCE_JSON_TO_STORE[SRC_SOT3] = "https://paizo.com/products/btq027kb";
Parser.SOURCE_JSON_TO_STORE[SRC_SOT4] = "https://paizo.com/products/btq027nz";
Parser.SOURCE_JSON_TO_STORE[SRC_SOT5] = "https://paizo.com/products/btq027s2";
Parser.SOURCE_JSON_TO_STORE[SRC_SOT6] = "https://paizo.com/products/btq027u1";

Parser.SOURCE_JSON_TO_STORE[SRC_OoA0] = "https://paizo.com/community/blog/v5748dyo6si08";
Parser.SOURCE_JSON_TO_STORE[SRC_OoA1] = "https://paizo.com/products/btq02ajl";
Parser.SOURCE_JSON_TO_STORE[SRC_OoA2] = "https://paizo.com/products/btq02am3";
Parser.SOURCE_JSON_TO_STORE[SRC_OoA3] = "https://paizo.com/products/btq02aot";

Parser.SOURCE_JSON_TO_STORE[SRC_QFF0] = "https://paizo.com/community/blog/v5748dyo6shx3";
Parser.SOURCE_JSON_TO_STORE[SRC_QFF1] = "https://paizo.com/products/btq02asv";
Parser.SOURCE_JSON_TO_STORE[SRC_QFF2] = "https://paizo.com/products/btq029ud";
Parser.SOURCE_JSON_TO_STORE[SRC_QFF3] = "https://paizo.com/products/btq029wg";

Parser.SOURCE_JSON_TO_STORE[SRC_BL0] = "https://paizo.com/community/blog/v5748dyo6si34";
Parser.SOURCE_JSON_TO_STORE[SRC_BL1] = "https://paizo.com/products/btq02art";
Parser.SOURCE_JSON_TO_STORE[SRC_BL2] = "https://paizo.com/products/btq02asf";
Parser.SOURCE_JSON_TO_STORE[SRC_BL3] = "https://paizo.com/products/btq02c11";
Parser.SOURCE_JSON_TO_STORE[SRC_BL4] = "https://paizo.com/products/btq02c4e";
Parser.SOURCE_JSON_TO_STORE[SRC_BL5] = "https://paizo.com/products/btq02d51";
Parser.SOURCE_JSON_TO_STORE[SRC_BL6] = "https://paizo.com/products/btq02d71";

Parser.SOURCE_JSON_TO_STORE[SRC_GW0] = "";
Parser.SOURCE_JSON_TO_STORE[SRC_GW1] = "https://paizo.com/products/btq02dsq";
Parser.SOURCE_JSON_TO_STORE[SRC_GW2] = "https://paizo.com/products/btq02dw1";
// Parser.SOURCE_JSON_TO_STORE[SRC_GW3] = "";

Parser.SOURCE_JSON_TO_STORE[SRC_SLI] = "https://paizo.com/products/btq023hg";
Parser.SOURCE_JSON_TO_STORE[SRC_NGD] = "https://paizo.com/products/btq027o0";
Parser.SOURCE_JSON_TO_STORE[SRC_FOP] = "https://paizo.com/products/btq01zoh";
Parser.SOURCE_JSON_TO_STORE[SRC_TIO] = "https://paizo.com/products/btq026k1";
Parser.SOURCE_JSON_TO_STORE[SRC_LTIBA] = "https://paizo.com/products/btq024ys";

Parser.SOURCES_ADVENTURES = new Set([
	SRC_AOA0,
	SRC_AOA1,
	SRC_AOA2,
	SRC_AOA3,
	SRC_AOA4,
	SRC_AOA5,
	SRC_AOA6,
	SRC_EC0,
	SRC_EC1,
	SRC_EC2,
	SRC_EC3,
	SRC_EC4,
	SRC_EC5,
	SRC_EC6,
	SRC_AOE0,
	SRC_AOE1,
	SRC_AOE2,
	SRC_AOE3,
	SRC_AOE4,
	SRC_AOE5,
	SRC_AOE6,
	SRC_AV0,
	SRC_AV1,
	SRC_AV2,
	SRC_AV3,
	SRC_FRP0,
	SRC_FRP1,
	SRC_FRP2,
	SRC_FRP3,
	SRC_SOT0,
	SRC_SOT1,
	SRC_SOT2,
	SRC_SOT3,
	SRC_SOT4,
	SRC_SOT5,
	SRC_SOT6,
	SRC_SLI,
	SRC_NGD,
	SRC_LTIBA,
	SRC_FOP,
	SRC_TIO,
	SRC_OoA0,
	SRC_OoA1,
	SRC_OoA2,
	SRC_OoA3,
	SRC_QFF0,
	SRC_QFF1,
	SRC_QFF2,
	SRC_QFF3,
	SRC_BL0,
	SRC_BL1,
	SRC_BL2,
	SRC_BL3,
	SRC_BL4,
	SRC_BL5,
	SRC_BL6,
	SRC_GW0,
	SRC_GW1,
	SRC_GW2,
	SRC_GW3,
]);
Parser.SOURCES_CORE_SUPPLEMENTS = new Set(Object.keys(Parser.SOURCE_JSON_TO_FULL).filter(it => !Parser.SOURCES_ADVENTURES.has(it)));
Parser.SOURCES_VANILLA = new Set([SRC_CRB, SRC_B1, SRC_GMG, SRC_APG, SRC_SOM, SRC_GNG]);

Parser.SOURCES_AVAILABLE_DOCS_BOOK = {};
[
	SRC_CRB,
	SRC_APG,
	SRC_B1,
	SRC_B2,
	SRC_B3,
	SRC_GMG,
	SRC_SOM,
	SRC_LOCG,
	SRC_LOGM,
	SRC_LOAG,
	SRC_LOACLO,
	SRC_AAWS,
	SRC_GNG,
	SRC_LOTGB,
	SRC_LOMM,
	SRC_BotD,
	SRC_LOTG,
	SRC_LOKL,
	SRC_PFUM,
	SRC_DA,
	SRC_LOIL,
].forEach(src => {
	Parser.SOURCES_AVAILABLE_DOCS_BOOK[src] = src;
	Parser.SOURCES_AVAILABLE_DOCS_BOOK[src.toLowerCase()] = src;
});
Parser.SOURCES_AVAILABLE_DOCS_ADVENTURE = {};
[
	SRC_AOA0,
	SRC_AOA1,
	SRC_AOA2,
	SRC_AOA3,
	SRC_AOA4,
	SRC_AOA5,
	SRC_AOA6,
	SRC_EC0,
	SRC_EC1,
	SRC_EC2,
	SRC_EC3,
	SRC_EC4,
	SRC_EC5,
	SRC_EC6,
	SRC_AOE0,
	SRC_AOE1,
	SRC_AOE2,
	SRC_AOE3,
	SRC_AOE4,
	SRC_AOE5,
	SRC_AOE6,
	SRC_AV0,
	SRC_AV1,
	SRC_AV2,
	SRC_AV3,
	SRC_FRP0,
	SRC_FRP1,
	SRC_FRP2,
	SRC_FRP3,
	SRC_SOT0,
	SRC_SOT1,
	SRC_SOT2,
	SRC_SOT3,
	SRC_SOT4,
	SRC_SOT5,
	SRC_SOT6,
	SRC_SLI,
	SRC_NGD,
	SRC_FOP,
	SRC_TIO,
	SRC_LTIBA,
	SRC_BL0,
	SRC_BL1,
	SRC_BL2,
	SRC_BL3,
	SRC_BL4,
	SRC_BL5,
	SRC_BL6,
	SRC_GW0,
	SRC_GW1,
	SRC_GW2,
	SRC_GW3,
].forEach(src => {
	Parser.SOURCES_AVAILABLE_DOCS_ADVENTURE[src] = src;
	Parser.SOURCES_AVAILABLE_DOCS_ADVENTURE[src.toLowerCase()] = src;
});

Parser.TAG_TO_DEFAULT_SOURCE = {
	"spell": SRC_CRB,
	"item": SRC_CRB,
	"class": SRC_CRB,
	"creature": SRC_B1,
	"condition": SRC_CRB,
	"disease": SRC_GMG,
	"curse": SRC_GMG,
	"background": SRC_CRB,
	"ancestry": SRC_CRB,
	"versatileHeritage": SRC_APG,
	"archetype": SRC_CRB,
	"feat": SRC_CRB,
	"trap": SRC_CRB,
	"hazard": SRC_CRB,
	"deity": SRC_CRB,
	"variantrule": SRC_GMG,
	"action": SRC_CRB,
	"ability": SRC_B1,
	"classFeature": SRC_CRB,
	"subclassFeature": SRC_CRB,
	"table": SRC_CRB,
	"language": SRC_CRB,
	"ritual": SRC_CRB,
	"trait": SRC_CRB,
	"vehicle": SRC_GMG,
	"place": SRC_GMG,
	"plane": SRC_GMG,
	"settlement": SRC_GMG,
	"nation": SRC_GMG,
	"group": SRC_CRB,
	"domain": SRC_CRB,
	"skill": SRC_CRB,
	"familiar": SRC_APG,
	"familiarAbility": SRC_CRB,
	"companion": SRC_CRB,
	"companionAbility": SRC_CRB,
	"eidolon": SRC_SOM,
	"optfeature": SRC_APG,
	"organization": SRC_LOCG,
	"creatureTemplate": SRC_B1,
};
Parser.getTagSource = function (tag, source) {
	if (source && source.trim()) return source;
	tag = tag.trim();
	if (tag.startsWith("@")) tag = tag.slice(1);

	if (!Parser.TAG_TO_DEFAULT_SOURCE[tag]) throw new Error(`Unhandled tag source "${tag}"`);
	return Parser.TAG_TO_DEFAULT_SOURCE[tag];
};

Parser.getTraitName = function (trait) {
	// TODO: This implementation is not perfect, but for now it will do
	const regex = new RegExp(`\\s(?:\\d|[A-Za-z]$|\\(|d\\d|[A-Z],|[a-z], [a-z], or [a-z]|${Object.values(Parser.DMGTYPE_JSON_TO_FULL).join("|")}|to \\w+)(.+|$)`);
	const name = trait ? trait.replace(/\|.+/, "").replace(regex, "") : "";
	if (name === name.toUpperCase()) return name;
	else if (name.length <= 2) return name.toUpperCase(); // Alignment traits: CG, LE, ...
	else return name.toTitleCase();
}

Parser.rarityToNumber = function (r) {
	if (isNaN(r)) {
		switch (r.toLowerCase()) {
			case "common": return 0;
			case "uncommon": return 1;
			case "rare": return 2;
			case "unique": return 3;
			default: return 69;
		}
	} else return r
}

Parser.dmgTypeToFull = function (dmg) {
	return Parser._parse_aToB(Parser.DMGTYPE_JSON_TO_FULL, dmg)
}
Parser.DMGTYPE_JSON_TO_FULL = {
	"A": "acid",
	"B": "bludgeoning",
	"C": "cold",
	"D": "bleed",
	"E": "electricity",
	"F": "fire",
	"H": "chaotic",
	"I": "poison",
	"L": "lawful",
	"M": "mental",
	"Mod": "modular",
	"N": "sonic",
	"O": "force",
	"P": "piercing",
	"R": "precision",
	"S": "slashing",
	"+": "positive",
	"-": "negative",
};

Parser.levelToDC = function (level, isSpell, traits) {
	if (isNaN(level)) return "?";
	let DC = 0;
	if (isSpell.toLowerCase() === "focus" || isSpell.toLowerCase() === "spell" || isSpell === true) level = (level * 2) - 1;
	if (level < 21) DC = 14 + Number(level) + Math.floor(level / 3);
	else DC = 40 + Number((level - 20) * 2);

	// The Difficulty is negative for easier adjustments and positive for harder adjustments. 0 is default.
	if (traits && traits.length) {
		const difficulties = typeof traits === "string" ? traits.split(" ") : traits.filter(it => typeof it === "string");
		difficulties.forEach(difficulty => {
			switch (Parser.rarityToNumber(difficulty)) {
				// Incredibly Easy
				case -3:
					DC = DC - 10;
					break;
				// Very Easy
				case -2:
					DC = DC - 5
					break;
				// Easy
				case -1:
					DC = DC - 2
					break;
				// Hard (Uncommon)
				case 1:
					DC = DC + 2
					break;
				// Very Hard (Rare)
				case 2:
					DC = DC + 5
					break;
				// Incredibly Hard (Unique)
				case 3:
					DC = DC + 10
					break;
				default: break;
			}
		});
	}

	return `${DC}${level < 0 || level > 25 ? `*` : ""}`
};

Parser.typeToSkill = function (type) {
	if (typeof type === "string" || type instanceof String) { type = type.split() }

	let skill = new Set();

	for (let i = 0; i < type.length; i++) {
		let typeNum = type[i];
		switch (typeNum.toLowerCase()) {
			// Creature Types
			case "aberration": skill.add("{@skill Occultism}"); break;
			case "animal": skill.add("{@skill Nature}"); break;
			case "astral": skill.add("{@skill Occultism}"); break;
			case "beast": skill.add("{@skill Arcana}"); skill.add("{@skill Nature}"); break;
			case "celestial": skill.add("{@skill Religion}"); break;
			case "construct": skill.add("{@skill Arcana}"); skill.add("{@skill Crafting}"); break;
			case "dragon": skill.add("{@skill Arcana}"); break;
			case "elemental": skill.add("{@skill Arcana}"); skill.add("{@skill Nature}"); break;
			case "ethereal": skill.add("{@skill Occultism}"); break;
			case "fey": skill.add("{@skill Nature}"); break;
			case "fiend": skill.add("{@skill Religion}"); break;
			case "fungus": skill.add("{@skill Nature}"); break;
			case "humanoid": skill.add("{@skill Society}"); break;
			case "monitor": skill.add("{@skill Religion}"); break;
			case "ooze": skill.add("{@skill Occultism}"); break;
			case "spirit": skill.add("{@skill Occultism}"); break;
			case "plant": skill.add("{@skill Nature}"); break;
			case "undead": skill.add("{@skill Religion}"); break;
			// Spellcasting Traditions
			case "arcane": skill.add("{@skill Arcana}"); break;
			case "divine": skill.add("{@skill Religion}"); break;
			case "occult": skill.add("{@skill Occultism}"); break;
			case "primal": skill.add("{@skill Nature}"); break;
			case "magical": skill.add("{@skill Arcana}"); skill.add("{@skill Religion}"); skill.add("{@skill Occultism}"); skill.add("{@skill Nature}"); break;
			// Items
			case "alchemical":
			case "item": skill.add("{@skill Crafting}"); break;
			default: break;
		}
	}
	return [...skill].join(" or ")
};

Parser.getKeyByValue = function (object, value) {
	return Object.keys(object).filter(function (key) {
		return object[key] === value;
	});
}


// ************************************************************************* //
// Do not use classes                                                        //
// ************************************************************************* //


// in deployment, `IS_DEPLOYED = "<version number>";` should be set below.
IS_DEPLOYED = undefined;
VERSION_NUMBER = /* PF2ETOOLS_VERSION__OPEN */"0.6.4"/* PF2ETOOLS_VERSION__CLOSE */;
DEPLOYED_STATIC_ROOT = ""; // ""; // FIXME re-enable this when we have a CDN again
IS_VTT = false;

IMGUR_CLIENT_ID = `abdea4de492d3b0`;

// TODO refactor into VeCt
HASH_PART_SEP = ",";
HASH_LIST_SEP = "_";
HASH_SUB_LIST_SEP = "~";
HASH_SUB_KV_SEP = ":";
HASH_BLANK = "blankhash";
HASH_SUB_NONE = "null";

VeCt = {
	STR_NONE: "None",
	STR_SEE_CONSOLE: "See the console (CTRL+SHIFT+J) for details.",

	HASH_CR_SCALED: "scaled",
	HASH_ITEM_RUNES: "runeitem",

	FILTER_BOX_SUB_HASH_SEARCH_PREFIX: "fbsr",

	JSON_HOMEBREW_INDEX: `homebrew/index.json`,

	STORAGE_HOMEBREW: "HOMEBREW_STORAGE",
	STORAGE_HOMEBREW_META: "HOMEBREW_META_STORAGE",
	STORAGE_EXCLUDES: "EXCLUDES_STORAGE",
	STORAGE_DMSCREEN: "DMSCREEN_STORAGE",
	STORAGE_DMSCREEN_TEMP_SUBLIST: "DMSCREEN_TEMP_SUBLIST",
	STORAGE_ROLLER_MACRO: "ROLLER_MACRO_STORAGE",
	STORAGE_ENCOUNTER: "ENCOUNTER_STORAGE",
	STORAGE_RUNEITEM: "RUNEITEM_STORAGE",
	STORAGE_POINTBUY: "POINTBUY_STORAGE",

	DUR_INLINE_NOTIFY: 500,

	PG_NONE: "NO_PAGE",

	SYM_UI_SKIP: Symbol("uiSkip"),
};

// STRING ==============================================================================================================
String.prototype.uppercaseFirst = String.prototype.uppercaseFirst || function () {
	const str = this.toString();
	if (str.length === 0) return str;
	if (str.length === 1) return str.charAt(0).toUpperCase();
	return str.charAt(0).toUpperCase() + str.slice(1);
};

String.prototype.lowercaseFirst = String.prototype.lowercaseFirst || function () {
	const str = this.toString();
	if (str.length === 0) return str;
	if (str.length === 1) return str.charAt(0).toLowerCase();
	return str.charAt(0).toLowerCase() + str.slice(1);
};

String.prototype.uq = String.prototype.uq || function () {
	return this.unescapeQuotes();
};

String.prototype.toTitleCase = String.prototype.toTitleCase || function () {
	let str = this.replace(/([^\W_]+[^\s-/]*) */g, m0 => m0.charAt(0).toUpperCase() + m0.substr(1).toLowerCase());

	// Require space surrounded, as title-case requires a full word on either side
	StrUtil._TITLE_LOWER_WORDS_RE = StrUtil._TITLE_LOWER_WORDS_RE = StrUtil.TITLE_LOWER_WORDS.map(it => new RegExp(`\\s${it}\\s`, "gi"));
	StrUtil._TITLE_UPPER_WORDS_RE = StrUtil._TITLE_UPPER_WORDS_RE = StrUtil.TITLE_UPPER_WORDS.map(it => new RegExp(`\\b${it}\\b`, "g"));

	const len = StrUtil.TITLE_LOWER_WORDS.length;
	for (let i = 0; i < len; i++) {
		str = str.replace(
			StrUtil._TITLE_LOWER_WORDS_RE[i],
			txt => txt.toLowerCase(),
		);
	}

	const len1 = StrUtil.TITLE_UPPER_WORDS.length;
	for (let i = 0; i < len1; i++) {
		str = str.replace(
			StrUtil._TITLE_UPPER_WORDS_RE[i],
			StrUtil.TITLE_UPPER_WORDS[i].toUpperCase(),
		);
	}

	return str;
};

String.prototype.toSentenceCase = String.prototype.toSentenceCase || function () {
	const out = [];
	const re = /([^.!?]+)([.!?]\s*|$)/gi;
	let m;
	do {
		m = re.exec(this);
		if (m) {
			out.push(m[0].toLowerCase().uppercaseFirst());
		}
	} while (m);
	return out.join("");
};

String.prototype.toSpellCase = String.prototype.toSpellCase || function () {
	return this.toLowerCase().replace(/(^|of )(bigby|otiluke|mordenkainen|evard|hadar|agathys|abi-dalzim|aganazzar|drawmij|leomund|maximilian|melf|nystul|otto|rary|snilloc|tasha|tenser|jim)('s|$| )/g, (...m) => `${m[1]}${m[2].toTitleCase()}${m[3]}`);
};

String.prototype.toCamelCase = String.prototype.toCamelCase || function () {
	return this.split(" ").map((word, index) => {
		if (index === 0) return word.toLowerCase();
		return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
	}).join("");
};

String.prototype.escapeQuotes = String.prototype.escapeQuotes || function () {
	return this.replace(/'/g, `&apos;`).replace(/"/g, `&quot;`);
};

String.prototype.qq = String.prototype.qq || function () {
	return this.escapeQuotes();
};

String.prototype.unescapeQuotes = String.prototype.unescapeQuotes || function () {
	return this.replace(/&apos;/g, `'`).replace(/&quot;/g, `"`);
};

String.prototype.uq = String.prototype.uq || function () {
	return this.unescapeQuotes();
};

String.prototype.encodeApos = String.prototype.encodeApos || function () {
	return this.replace(/'/g, `%27`);
};

/**
 * Calculates the Damerau-Levenshtein distance between two strings.
 * https://gist.github.com/IceCreamYou/8396172
 */
String.prototype.distance = String.prototype.distance || function (target) {
	let source = this;
	let i;
	let j;
	if (!source) return target ? target.length : 0;
	else if (!target) return source.length;

	const m = source.length;
	const n = target.length;
	const INF = m + n;
	const score = new Array(m + 2);
	const sd = {};
	for (i = 0; i < m + 2; i++) score[i] = new Array(n + 2);
	score[0][0] = INF;
	for (i = 0; i <= m; i++) {
		score[i + 1][1] = i;
		score[i + 1][0] = INF;
		sd[source[i]] = 0;
	}
	for (j = 0; j <= n; j++) {
		score[1][j + 1] = j;
		score[0][j + 1] = INF;
		sd[target[j]] = 0;
	}

	for (i = 1; i <= m; i++) {
		let DB = 0;
		for (j = 1; j <= n; j++) {
			const i1 = sd[target[j - 1]];
			const j1 = DB;
			if (source[i - 1] === target[j - 1]) {
				score[i + 1][j + 1] = score[i][j];
				DB = j;
			} else {
				score[i + 1][j + 1] = Math.min(score[i][j], Math.min(score[i + 1][j], score[i][j + 1])) + 1;
			}
			score[i + 1][j + 1] = Math.min(score[i + 1][j + 1], score[i1] ? score[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1) : Infinity);
		}
		sd[source[i - 1]] = i;
	}
	return score[m + 1][n + 1];
};

String.prototype.isNumeric = String.prototype.isNumeric || function () {
	return !isNaN(parseFloat(this)) && isFinite(this);
};

String.prototype.last = String.prototype.last || function () {
	return this[this.length - 1];
};

String.prototype.escapeRegexp = String.prototype.escapeRegexp || function () {
	return this.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};

String.prototype.toUrlified = String.prototype.toUrlified || function () {
	return encodeURIComponent(this.toLowerCase()).toLowerCase();
};

String.prototype.toChunks = String.prototype.toChunks || function (size) {
	// https://stackoverflow.com/a/29202760/5987433
	const numChunks = Math.ceil(this.length / size)
	const chunks = new Array(numChunks)
	for (let i = 0, o = 0; i < numChunks; ++i, o += size) chunks[i] = this.substr(o, size);
	return chunks
};

String.prototype.toAscii = String.prototype.toAscii || function () {
	return this
		.normalize("NFD") // replace diacritics with their individual graphemes
		.replace(/[\u0300-\u036f]/g, "") // remove accent graphemes
		.replace(/Æ/g, "AE").replace(/æ/g, "ae");
};

String.prototype.trimChar = String.prototype.trimChar || function (ch) {
	let start = 0; let end = this.length;
	while (start < end && this[start] === ch) ++start;
	while (end > start && this[end - 1] === ch) --end;
	return (start > 0 || end < this.length) ? this.substring(start, end) : this;
};

String.prototype.trimAnyChar = String.prototype.trimAnyChar || function (chars) {
	let start = 0; let end = this.length;
	while (start < end && chars.indexOf(this[start]) >= 0) ++start;
	while (end > start && chars.indexOf(this[end - 1]) >= 0) --end;
	return (start > 0 || end < this.length) ? this.substring(start, end) : this;
};

Array.prototype.joinConjunct = Array.prototype.joinConjunct || function (joiner, lastJoiner, nonOxford) {
	if (this.length === 0) return "";
	if (this.length === 1) return this[0];
	if (this.length === 2) return this.join(lastJoiner);
	else {
		let outStr = "";
		for (let i = 0; i < this.length; ++i) {
			outStr += this[i];
			if (i < this.length - 2) outStr += joiner;
			else if (i === this.length - 2) outStr += `${(!nonOxford && this.length > 2 ? joiner.trim() : "")}${lastJoiner}`;
		}
		return outStr;
	}
};

StrUtil = {
	COMMAS_NOT_IN_PARENTHESES_REGEX: /,\s?(?![^(]*\))/g,
	COMMA_SPACE_NOT_IN_PARENTHESES_REGEX: /, (?![^(]*\))/g,

	uppercaseFirst: function (string) {
		return string.uppercaseFirst();
	},
	// Certain minor words should be left lowercase unless they are the first or last words in the string
	TITLE_LOWER_WORDS: ["a", "an", "the", "and", "but", "or", "for", "nor", "as", "at", "by", "for", "from", "in", "into", "near", "of", "on", "onto", "to", "with", "over"],
	// Certain words such as initialisms or acronyms should be left uppercase
	TITLE_UPPER_WORDS: ["Id", "Tv", "Dm", "Ok"],

	padNumber: (n, len, padder) => {
		return String(n).padStart(len, padder);
	},

	elipsisTruncate (str, atLeastPre = 5, atLeastSuff = 0, maxLen = 20) {
		if (maxLen >= str.length) return str;

		maxLen = Math.max(atLeastPre + atLeastSuff + 3, maxLen);
		let out = "";
		let remain = maxLen - (3 + atLeastPre + atLeastSuff);
		for (let i = 0; i < str.length - atLeastSuff; ++i) {
			const c = str[i];
			if (i < atLeastPre) out += c;
			else if ((remain--) > 0) out += c;
		}
		if (remain < 0) out += "...";
		out += str.substring(str.length - atLeastSuff, str.length);
		return out;
	},

	toTitleCase (str) {
		return str.toTitleCase();
	},

	getNamePart (str) {
		if (typeof str !== "string") return str
		return str.split(" ").filter(it => !StrUtil.TITLE_LOWER_WORDS.includes(it.toLowerCase())).join(" ")
	},
};

CleanUtil = {
	getCleanJson (data, minify = false) {
		let str = minify ? JSON.stringify(data) : `${JSON.stringify(data, null, "\t")}\n`;
		return CleanUtil.getCleanString(str);
	},

	/**
	 * @param str
	 * @param isJsonDump If the string is intended to be re-parsed by `JSON.parse`
	 */
	getCleanString (str, isJsonDump = true) {
		str = str
			.replace(CleanUtil.SHARED_REPLACEMENTS_REGEX, (match) => CleanUtil.SHARED_REPLACEMENTS[match])
			.replace(/\u00AD/g, "") // soft hyphens
			.replace(/\s*(\.\s*\.\s*\.)/g, "$1");

		if (isJsonDump) {
			return str
				.replace(CleanUtil.STR_REPLACEMENTS_REGEX, (match) => CleanUtil.STR_REPLACEMENTS[match])
		} else {
			return str
				.replace(CleanUtil.JSON_REPLACEMENTS_REGEX, (match) => CleanUtil.JSON_REPLACEMENTS[match])
		}
	},
};
CleanUtil.SHARED_REPLACEMENTS = {
	"’": "'",
	"…": "...",
	" ": " ", // non-breaking space
	"ﬀ": "ff",
	"ﬃ": "ffi",
	"ﬄ": "ffl",
	"ﬁ": "fi",
	"ﬂ": "fl",
	"Ĳ": "IJ",
	"ĳ": "ij",
	"Ǉ": "LJ",
	"ǈ": "Lj",
	"ǉ": "lj",
	"Ǌ": "NJ",
	"ǋ": "Nj",
	"ǌ": "nj",
	"ﬅ": "ft",
};
CleanUtil.STR_REPLACEMENTS = {
	"—": "\\u2014",
	"–": "\\u2013",
	"−": "\\u2212",
	"“": `\\"`,
	"”": `\\"`,
};
CleanUtil.JSON_REPLACEMENTS = {
	"“": `"`,
	"”": `"`,
};
CleanUtil.SHARED_REPLACEMENTS_REGEX = new RegExp(Object.keys(CleanUtil.SHARED_REPLACEMENTS).join("|"), "g");
CleanUtil.STR_REPLACEMENTS_REGEX = new RegExp(Object.keys(CleanUtil.STR_REPLACEMENTS).join("|"), "g");
CleanUtil.JSON_REPLACEMENTS_REGEX = new RegExp(Object.keys(CleanUtil.JSON_REPLACEMENTS).join("|"), "g");

// SOURCES =============================================================================================================
SourceUtil = {
	ADV_BOOK_GROUPS: [
		{group: "core", displayName: "Core"},
		{group: "lost-omens", displayName: "Lost Omens"},
		{group: "homebrew", displayName: "Homebrew"},
		{group: "other", displayName: "Miscellaneous"},
	],

	isAdventure (source) {
		if (source instanceof FilterItem) source = source.item;
		return Parser.SOURCES_ADVENTURES.has(source);
	},

	isCoreOrSupplement (source) {
		if (source instanceof FilterItem) source = source.item;
		return Parser.SOURCES_CORE_SUPPLEMENTS.has(source);
	},

	isNonstandardSource (source) {
		// FIXME Once nonstandard sources are added
		return source != null && BrewUtil.hasSourceJson(source);
	},

	getFilterGroup (source) {
		if (source instanceof FilterItem) source = source.item;
		if (BrewUtil.hasSourceJson(source)) return 3;
		if (SourceUtil.isAdventure(source)) return 1;
		if (SourceUtil.isNonstandardSource(source)) return 2;
		if (!SourceUtil.isNonstandardSource(source)) return 0;
	},

	getAdventureBookSourceHref (source, page) {
		if (!source) return null;
		source = source.toLowerCase();

		// TODO this could be made to work with homebrew
		let docPage;
		if (Parser.SOURCES_AVAILABLE_DOCS_BOOK[source]) docPage = UrlUtil.PG_BOOK;
		else if (Parser.SOURCES_AVAILABLE_DOCS_ADVENTURE[source]) docPage = UrlUtil.PG_ADVENTURE;
		if (!docPage) return null;

		return `${docPage}#${[source, page ? `page:${page}` : null].filter(Boolean).join(HASH_PART_SEP)}`;
	},
};

// CURRENCY ============================================================================================================
CurrencyUtil = {
	/**
	 * Convert 10 gold -> 1 platinum, etc.
	 * @param obj Object of the form {cp: 123, sp: 456, ...} (values optional)
	 * @param [opts]
	 * @param [opts.currencyConversionId] Currency conversion table ID.
	 * @param [opts.currencyConversionTable] Currency conversion table.
	 */
	doSimplifyCoins (obj, opts) {
		opts = opts || {};

		const conversionTable = opts.currencyConversionTable || Parser.getCurrencyConversionTable(opts.currencyConversionId);
		if (!conversionTable.length) return obj;

		const normalized = conversionTable
			.map(it => {
				return {
					...it,
					normalizedMult: 1 / it.mult,
				}
			})
			.sort((a, b) => SortUtil.ascSort(a.normalizedMult, b.normalizedMult));

		// Simplify currencies
		for (let i = 0; i < normalized.length - 1; ++i) {
			const coinCur = normalized[i].coin;
			const coinNxt = normalized[i + 1].coin;
			const coinRatio = normalized[i + 1].normalizedMult / normalized[i].normalizedMult;

			if (obj[coinCur] && Math.abs(obj[coinCur]) >= coinRatio) {
				const nxtVal = obj[coinCur] >= 0 ? Math.floor(obj[coinCur] / coinRatio) : Math.ceil(obj[coinCur] / coinRatio);
				obj[coinCur] = obj[coinCur] % coinRatio;
				obj[coinNxt] = (obj[coinNxt] || 0) + nxtVal;
			}
		}

		normalized
			.filter(coinMeta => obj[coinMeta.coin] === 0 || obj[coinMeta.coin] == null)
			.forEach(coinMeta => {
				// First set the value to null, in case we're dealing with a class instance that has setters
				obj[coinMeta.coin] = null;
				delete obj[coinMeta.coin];
			});

		return obj;
	},

	/**
	 * Convert a collection of coins into an equivalent value in copper.
	 * @param obj Object of the form {cp: 123, sp: 456, ...} (values optional)
	 */
	getAsCopper (obj) {
		return Parser.FULL_CURRENCY_CONVERSION_TABLE
			.map(currencyMeta => (obj[currencyMeta.coin] || 0) * (1 / currencyMeta.mult))
			.reduce((a, b) => a + b, 0);
	},
};

// CONVENIENCE/ELEMENTS ================================================================================================
Math.seed = Math.seed || function (s) {
	return function () {
		s = Math.sin(s) * 10000;
		return s - Math.floor(s);
	};
};

JqueryUtil = {
	_isEnhancementsInit: false,
	initEnhancements () {
		if (JqueryUtil._isEnhancementsInit) return;
		JqueryUtil._isEnhancementsInit = true;

		JqueryUtil.addSelectors();

		/**
		 * Template strings which can contain jQuery objects.
		 * Usage: $$`<div>Press this button: ${$btn}</div>`
		 * @return JQuery
		 */
		window.$$ = function (parts, ...args) {
			if (parts instanceof jQuery) {
				return (...passed) => {
					const parts2 = [...passed[0]];
					const args2 = passed.slice(1);
					parts2[0] = `<div>${parts2[0]}`;
					parts2.last(`${parts2.last()}</div>`);

					const $temp = $$(parts2, ...args2);
					$temp.children().each((i, e) => $(e).appendTo(parts));
					return parts;
				};
			} else {
				const $eles = [];
				let ixArg = 0;

				const handleArg = (arg) => {
					if (arg instanceof $) {
						$eles.push(arg);
						return `<${arg.tag()} data-r="true"></${arg.tag()}>`;
					} else if (arg instanceof HTMLElement) {
						return handleArg($(arg));
					} else return arg
				};

				const raw = parts.reduce((html, p) => {
					const myIxArg = ixArg++;
					if (args[myIxArg] == null) return `${html}${p}`;
					if (args[myIxArg] instanceof Array) return `${html}${args[myIxArg].map(arg => handleArg(arg)).join("")}${p}`;
					else return `${html}${handleArg(args[myIxArg])}${p}`;
				});
				const $res = $(raw);

				if ($res.length === 1) {
					if ($res.attr("data-r") === "true") return $eles[0];
					else $res.find(`[data-r=true]`).replaceWith(i => $eles[i]);
				} else {
					// Handle case where user has passed in a bunch of elements with no outer wrapper
					const $tmp = $(`<div></div>`);
					$tmp.append($res);
					$tmp.find(`[data-r=true]`).replaceWith(i => $eles[i]);
					return $tmp.children();
				}

				return $res;
			}
		};

		$.fn.extend({
			// avoid setting input type to "search" as it visually offsets the contents of the input
			disableSpellcheck: function () {
				return this.attr("autocomplete", "new-password").attr("autocapitalize", "off").attr("spellcheck", "false");
			},
			tag: function () {
				return this.prop("tagName").toLowerCase();
			},
			title: function (...args) {
				return this.attr("title", ...args);
			},
			placeholder: function (...args) {
				return this.attr("placeholder", ...args);
			},
			disable: function () {
				return this.attr("disabled", true);
			},

			/**
			 * Quickly set the innerHTML of the innermost element, without parsing the whole thing with jQuery.
			 * Useful for populating e.g. a table row.
			 */
			fastSetHtml: function (html) {
				if (!this.length) return this;
				let tgt = this[0];
				while (tgt.children.length) {
					tgt = tgt.children[0];
				}
				tgt.innerHTML = html;
				return this;
			},

			blurOnEsc: function () {
				return this.keydown(evt => {
					if (evt.which === 27) this.blur(); // escape
				});
			},

			hideVe: function () {
				return this.addClass("ve-hidden");
			},
			showVe: function () {
				return this.removeClass("ve-hidden");
			},
			toggleVe: function (val) {
				if (val === undefined) return this.toggleClass("ve-hidden", !this.hasClass("ve-hidden"));
				else return this.toggleClass("ve-hidden", !val);
			},
		});

		$.event.special.destroyed = {
			remove: function (o) {
				if (o.handler) o.handler();
			},
		}
	},

	addSelectors () {
		// Add a selector to match exact text (case insensitive) to jQuery's arsenal
		//   Note that the search text should be `trim().toLowerCase()`'d before being passed in
		$.expr[":"].textEquals = (el, i, m) => $(el).text().toLowerCase().trim() === m[3].unescapeQuotes();

		// Add a selector to match contained text (case insensitive)
		$.expr[":"].containsInsensitive = (el, i, m) => {
			const searchText = m[3];
			const textNode = $(el).contents().filter((i, e) => e.nodeType === 3)[0];
			if (!textNode) return false;
			const match = textNode.nodeValue.toLowerCase().trim().match(`${searchText.toLowerCase().trim().escapeRegexp()}`);
			return match && match.length > 0;
		};
	},

	showCopiedEffect ($ele, text = "Copied!", bubble) {
		const top = $(window).scrollTop();
		const pos = $ele.offset();

		const animationOptions = {
			top: "-=8",
			opacity: 0,
		};
		if (bubble) {
			animationOptions.left = `${Math.random() > 0.5 ? "-" : "+"}=${~~(Math.random() * 17)}`;
		}
		const seed = Math.random();
		const duration = bubble ? 250 + seed * 200 : 250;
		const offsetY = bubble ? 16 : 0;

		const $dispCopied = $(`<div class="clp__disp-copied"></div>`);
		$dispCopied
			.html(text)
			.css({
				top: (pos.top - 24) + offsetY - top,
				left: pos.left + ($ele.width() / 2),
			})
			.appendTo(document.body)
			.animate(
				animationOptions,
				{
					duration,
					complete: () => $dispCopied.remove(),
					progress: (_, progress) => { // progress is 0..1
						if (bubble) {
							const diffProgress = 0.5 - progress;
							animationOptions.top = `${diffProgress > 0 ? "-" : "+"}=40`;
							$dispCopied.css("transform", `rotate(${seed > 0.5 ? "-" : ""}${seed * 500 * progress}deg)`);
						}
					},
				},
			);
	},

	_dropdownInit: false,
	bindDropdownButton ($ele) {
		if (!JqueryUtil._dropdownInit) {
			JqueryUtil._dropdownInit = true;
			document.addEventListener("click", () => [...document.querySelectorAll(`.open`)].filter(ele => !(ele.className || "").split(" ").includes(`dropdown--navbar`)).forEach(ele => ele.classList.remove("open")));
		}
		$ele.click(() => setTimeout(() => $ele.parent().addClass("open"), 1)); // defer to allow the above to complete
	},

	_ACTIVE_TOAST: [],
	/**
	 * @param {{content: jQuery|string, type?: string, autoHideTime?: number} | string} options The options for the toast.
	 * @param {(jQuery|string)} options.content Toast contents. Supports jQuery objects.
	 * @param {string} options.type Toast type. Can be any Bootstrap alert type ("success", "info", "warning", or "danger").
	 *  @param {number} options.autoHideTime The time in ms before the toast will be automatically hidden.
	 * Defaults to 5000 ms.
	 * A value of 0 will cause the toast to never automatically hide.
	 */
	doToast (options) {
		if (typeof window === "undefined") return;

		if (typeof options === "string") {
			options = {
				content: options,
				type: "info",
			};
		}
		options.type = options.type || "info";

		options.autoHideTime = options.autoHideTime ?? 5000;

		const doCleanup = ($toast) => {
			$toast.removeClass("toast--animate");
			setTimeout(() => $toast.remove(), 85);
			JqueryUtil._ACTIVE_TOAST.splice(JqueryUtil._ACTIVE_TOAST.indexOf($toast), 1);
		};

		const $btnToastDismiss = $(`<button class="btn toast__btn-close"><span class="glyphicon glyphicon-remove"></span></button>`)
			.click(() => doCleanup($toast));

		const $toast = $$`
		<div class="toast toast--type-${options.type}">
			<div class="toast__wrp-content">${options.content}</div>
			<div class="toast__wrp-control">${$btnToastDismiss}</div>
		</div>`.prependTo($(`body`)).data("pos", 0);

		setTimeout(() => $toast.addClass(`toast--animate`), 5);
		if (options.autoHideTime !== 0) {
			setTimeout(() => {
				doCleanup($toast);
			}, options.autoHideTime);
		}

		if (JqueryUtil._ACTIVE_TOAST.length) {
			JqueryUtil._ACTIVE_TOAST.forEach($oldToast => {
				const pos = $oldToast.data("pos");
				$oldToast.data("pos", pos + 1);
				if (pos === 2) doCleanup($oldToast);
			});
		}

		JqueryUtil._ACTIVE_TOAST.push($toast);
	},

	isMobile () {
		if (navigator && navigator.userAgentData && navigator.userAgentData.mobile) return true;
		// Equivalent to `$width-screen-sm`
		return window.matchMedia("(max-width: 768px)").matches;
	},
};

if (typeof window !== "undefined") window.addEventListener("load", JqueryUtil.initEnhancements);

ElementUtil = {
	getOrModify ({
		tag,
		clazz,
		style,
		click,
		contextmenu,
		change,
		mousedown,
		mouseup,
		mousemove,
		keydown,
		html,
		text,
		txt,
		ele,
		children,
		outer,

		id,
		name,
		title,
		val,
		href,
		type,
		attrs,
	}) {
		ele = ele || (outer ? (new DOMParser()).parseFromString(outer, "text/html").body.childNodes[0] : document.createElement(tag));

		if (clazz) ele.className = clazz;
		if (style) ele.setAttribute("style", style);
		if (click) ele.addEventListener("click", click);
		if (contextmenu) ele.addEventListener("contextmenu", contextmenu);
		if (change) ele.addEventListener("change", change);
		if (mousedown) ele.addEventListener("mousedown", mousedown);
		if (mouseup) ele.addEventListener("mouseup", mouseup);
		if (mousemove) ele.addEventListener("mousemove", mousemove);
		if (keydown) ele.addEventListener("keydown", keydown);
		if (html != null) ele.innerHTML = html;
		if (text != null || txt != null) ele.textContent = text;
		if (id != null) ele.setAttribute("id", id);
		if (name != null) ele.setAttribute("name", name);
		if (title != null) ele.setAttribute("title", title);
		if (href != null) ele.setAttribute("href", href);
		if (val != null) ele.setAttribute("value", val);
		if (type != null) ele.setAttribute("type", type);
		if (attrs != null) { for (const k in attrs) { if (attrs[k] === undefined) continue; ele.setAttribute(k, attrs[k]); } }
		if (children) for (let i = 0, len = children.length; i < len; ++i) if (children[i] != null) ele.append(children[i]);

		ele.appends = ele.appends || ElementUtil._appends.bind(ele);
		ele.appendTo = ele.appendTo || ElementUtil._appendTo.bind(ele);
		ele.prependTo = ele.prependTo || ElementUtil._prependTo.bind(ele);
		ele.addClass = ele.addClass || ElementUtil._addClass.bind(ele);
		ele.removeClass = ele.removeClass || ElementUtil._removeClass.bind(ele);
		ele.toggleClass = ele.toggleClass || ElementUtil._toggleClass.bind(ele);
		ele.showVe = ele.showVe || ElementUtil._showVe.bind(ele);
		ele.hideVe = ele.hideVe || ElementUtil._hideVe.bind(ele);
		ele.toggleVe = ele.toggleVe || ElementUtil._toggleVe.bind(ele);
		ele.empty = ele.empty || ElementUtil._empty.bind(ele);
		ele.detach = ele.detach || ElementUtil._detach.bind(ele);
		ele.attr = ele.attr || ElementUtil._attr.bind(ele);
		ele.val = ele.val || ElementUtil._val.bind(ele);
		ele.html = ele.html || ElementUtil._html.bind(ele);
		ele.txt = ele.txt || ElementUtil._txt.bind(ele);
		ele.tooltip = ele.tooltip || ElementUtil._tooltip.bind(ele);
		ele.onClick = ele.onClick || ElementUtil._onClick.bind(ele);
		ele.onContextmenu = ele.onContextmenu || ElementUtil._onContextmenu.bind(ele);
		ele.onChange = ele.onChange || ElementUtil._onChange.bind(ele);

		return ele;
	},

	_appends (child) {
		this.appendChild(child);
		return this;
	},

	_appendTo (parent) {
		parent.appendChild(this);
		return this;
	},

	_prependTo (parent) {
		parent.prepend(this);
		return this;
	},

	_addClass (clazz) {
		this.classList.add(clazz);
		return this;
	},

	_removeClass (clazz) {
		this.classList.remove(clazz);
		return this;
	},

	_toggleClass (clazz, isActive) {
		if (isActive == null) this.classList.toggle(clazz);
		else if (isActive) this.classList.add(clazz);
		else this.classList.remove(clazz);
		return this;
	},

	_showVe () {
		this.classList.remove("ve-hidden");
		return this;
	},

	_hideVe () {
		this.classList.add("ve-hidden");
		return this;
	},

	_toggleVe (isActive) {
		this.toggleClass("ve-hidden", isActive == null ? isActive : !isActive);
		return this;
	},

	_empty () {
		this.innerHTML = "";
		return this;
	},

	_detach () {
		if (this.parentElement) this.parentElement.removeChild(this);
		return this;
	},

	_attr (name, value) {
		this.setAttribute(name, value);
		return this;
	},

	_html (html) {
		if (html === undefined) return this.innerHTML;
		this.innerHTML = html;
		return this;
	},

	_txt (txt) {
		if (txt === undefined) return this.innerText;
		this.innerText = txt;
		return this;
	},

	_tooltip (title) {
		return this.attr("title", title);
	},

	_onClick (fn) { return ElementUtil._onX(this, "click", fn); },
	_onContextmenu (fn) { return ElementUtil._onX(this, "contextmenu", fn); },
	_onChange (fn) { return ElementUtil._onX(this, "change", fn); },

	_onX (ele, evtName, fn) { ele.addEventListener(evtName, fn); return ele; },

	_val (val) {
		if (val !== undefined) {
			switch (this.tagName) {
				case "SELECT": {
					let selectedIndexNxt = -1;
					for (let i = 0, len = this.options.length; i < len; ++i) {
						if (this.options[i]?.value === val) { selectedIndexNxt = i; break; }
					}
					this.selectedIndex = selectedIndexNxt;
					return this;
				}

				default: {
					this.value = val;
					return this;
				}
			}
		}

		switch (this.tagName) {
			case "SELECT": return this.options[this.selectedIndex]?.value;

			default: return this.value;
		}
	},

	// region "Static"
	getIndexPathToParent (parent, child) {
		if (!parent.contains(child)) return null;

		const path = [];

		while (child !== parent) {
			if (!child.parentElement) return null;

			const ix = [...child.parentElement.children].indexOf(child);
			if (!~ix) return null;

			path.push(ix);

			child = child.parentElement;
		}

		return path.reverse();
	},

	getChildByIndexPath (parent, indexPath) {
		for (let i = 0; i < indexPath.length; ++i) {
			const ix = indexPath[i];
			parent = parent.children[ix];
			if (!parent) return null;
		}
		return parent;
	},
	// endregion
};

if (typeof window !== "undefined") window.e_ = ElementUtil.getOrModify;

ObjUtil = {
	mergeWith (source, target, fnMerge, options = { depth: 1 }) {
		if (!source || !target || typeof fnMerge !== "function") throw new Error("Must include a source, target and a fnMerge to handle merging");

		const recursive = function (deepSource, deepTarget, depth = 1) {
			if (depth > options.depth || !deepSource || !deepTarget) return;
			for (let prop of Object.keys(deepSource)) {
				deepTarget[prop] = fnMerge(deepSource[prop], deepTarget[prop], source, target);
				recursive(source[prop], deepTarget[prop], depth + 1);
			}
		};
		recursive(source, target, 1);
	},

	async pForEachDeep (source, pCallback, options = { depth: Infinity, callEachLevel: false }) {
		const path = [];
		const pDiveDeep = async function (val, path, depth = 0) {
			if (options.callEachLevel || typeof val !== "object" || options.depth === depth) {
				await pCallback(val, path, depth);
			}
			if (options.depth !== depth && typeof val === "object") {
				for (const key of Object.keys(val)) {
					path.push(key);
					await pDiveDeep(val[key], path, depth + 1);
				}
			}
			path.pop();
		};
		await pDiveDeep(source, path);
	},
};

// TODO refactor other misc utils into this
MiscUtil = {
	COLOR_HEALTHY: "#00bb20",
	COLOR_HURT: "#c5ca00",
	COLOR_BLOODIED: "#f7a100",
	COLOR_DEFEATED: "#cc0000",

	copy (obj) {
		return JSON.parse(JSON.stringify(obj));
	},

	isObject (obj) {
		return obj && typeof obj === "object" && !Array.isArray(obj);
	},

	merge (...objects) {
		return objects.filter(it => MiscUtil.isObject(it)).reduce((acc, obj) => {
			Object.keys(obj).forEach(key => {
				const initVal = acc[key];
				const newVal = obj[key];
				if (Array.isArray(initVal) && Array.isArray(newVal)) acc[key] = initVal.concat(...newVal);
				else if (MiscUtil.isObject(initVal) && MiscUtil.isObject(newVal)) acc[key] = MiscUtil.merge(initVal, newVal);
				else acc[key] = newVal;
			});
			return acc;
		}, {});
	},

	async pCopyTextToClipboard (text) {
		function doCompatibilityCopy () {
			const $iptTemp = $(`<textarea class="clp__wrp-temp"></textarea>`)
				.appendTo(document.body)
				.val(text)
				.select();
			document.execCommand("Copy");
			$iptTemp.remove();
		}

		if (navigator && navigator.permissions) {
			try {
				const access = await navigator.permissions.query({ name: "clipboard-write" });
				if (access.state === "granted" || access.state === "prompt") {
					await navigator.clipboard.writeText(text);
				} else doCompatibilityCopy();
			} catch (e) {
				doCompatibilityCopy();
			}
		} else doCompatibilityCopy();
	},

	checkProperty (object, ...path) {
		for (let i = 0; i < path.length; ++i) {
			object = object[path[i]];
			if (object == null) return false;
		}
		return true;
	},

	get (object, ...path) {
		if (object == null) return null;
		for (let i = 0; i < path.length; ++i) {
			object = object[path[i]];
			if (object == null) return object;
		}
		return object;
	},

	set (object, ...pathAndVal) {
		if (object == null) return null;

		const val = pathAndVal.pop();
		if (!pathAndVal.length) return null;

		const len = pathAndVal.length;
		for (let i = 0; i < len; ++i) {
			const pathPart = pathAndVal[i];
			if (i === len - 1) object[pathPart] = val;
			else object = (object[pathPart] = object[pathPart] || {});
		}

		return val;
	},

	getOrSet (object, ...pathAndVal) {
		const existing = MiscUtil.get(object, ...pathAndVal);
		return existing || MiscUtil.set(object, ...pathAndVal);
	},

	mix: (superclass) => new MiscUtil._MixinBuilder(superclass),
	_MixinBuilder: function (superclass) {
		this.superclass = superclass;

		this.with = function (...mixins) {
			return mixins.reduce((c, mixin) => mixin(c), this.superclass);
		};
	},

	clearSelection () {
		if (document.getSelection) {
			document.getSelection().removeAllRanges();
			document.getSelection().addRange(document.createRange());
		} else if (window.getSelection) {
			if (window.getSelection().removeAllRanges) {
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(document.createRange());
			} else if (window.getSelection().empty) {
				window.getSelection().empty();
			}
		} else if (document.selection) {
			document.selection.empty();
		}
	},

	randomColor () {
		let r;
		let g;
		let b;
		const h = RollerUtil.randomise(30, 0) / 30;
		const i = ~~(h * 6);
		const f = h * 6 - i;
		const q = 1 - f;
		switch (i % 6) {
			case 0:
				r = 1;
				g = f;
				b = 0;
				break;
			case 1:
				r = q;
				g = 1;
				b = 0;
				break;
			case 2:
				r = 0;
				g = 1;
				b = f;
				break;
			case 3:
				r = 0;
				g = q;
				b = 1;
				break;
			case 4:
				r = f;
				g = 0;
				b = 1;
				break;
			case 5:
				r = 1;
				g = 0;
				b = q;
				break;
		}
		return `#${`00${(~~(r * 255)).toString(16)}`.slice(-2)}${`00${(~~(g * 255)).toString(16)}`.slice(-2)}${`00${(~~(b * 255)).toString(16)}`.slice(-2)}`;
	},

	/**
	 * @param hex Original hex color.
	 * @param [opts] Options object.
	 * @param [opts.bw] True if the color should be returnes as black/white depending on contrast ratio.
	 * @param [opts.dark] Color to return if a "dark" color would contrast best.
	 * @param [opts.light] Color to return if a "light" color would contrast best.
	 */
	invertColor (hex, opts) {
		opts = opts || {};

		hex = hex.slice(1); // remove #

		let r = parseInt(hex.slice(0, 2), 16);
		let g = parseInt(hex.slice(2, 4), 16);
		let b = parseInt(hex.slice(4, 6), 16);

		// http://stackoverflow.com/a/3943023/112731
		const isDark = (r * 0.299 + g * 0.587 + b * 0.114) > 186;
		if (opts.dark && opts.light) return isDark ? opts.dark : opts.light;
		else if (opts.bw) return isDark ? "#000000" : "#FFFFFF";

		r = (255 - r).toString(16);
		g = (255 - g).toString(16);
		b = (255 - b).toString(16);
		return `#${[r, g, b].map(it => it.padStart(2, "0")).join("")}`;
	},

	scrollPageTop () {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	},

	expEval (str) {
		// eslint-disable-next-line no-new-func
		return new Function(`return ${str.replace(/[^-()\d/*+.]/g, "")}`)();
	},

	parseNumberRange (input, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
		function errInvalid (input) {
			throw new Error(`Could not parse range input "${input}"`);
		}

		function errOutOfRange () {
			throw new Error(`Number was out of range! Range was ${min}-${max} (inclusive).`);
		}

		function isOutOfRange (num) {
			return num < min || num > max;
		}

		function addToRangeVal (range, num) {
			range.add(num);
		}

		function addToRangeLoHi (range, lo, hi) {
			for (let i = lo; i <= hi; ++i) range.add(i);
		}

		while (true) {
			if (input && input.trim()) {
				const clean = input.replace(/\s*/g, "");
				if (/^((\d+-\d+|\d+),)*(\d+-\d+|\d+)$/.exec(clean)) {
					const parts = clean.split(",");
					const out = new Set();

					for (const part of parts) {
						if (part.includes("-")) {
							const spl = part.split("-");
							const numLo = Number(spl[0]);
							const numHi = Number(spl[1]);

							if (isNaN(numLo) || isNaN(numHi) || numLo === 0 || numHi === 0 || numLo > numHi) errInvalid();

							if (isOutOfRange(numLo) || isOutOfRange(numHi)) errOutOfRange();

							if (numLo === numHi) addToRangeVal(out, numLo);
							else addToRangeLoHi(out, numLo, numHi);
						} else {
							const num = Number(part);
							if (isNaN(num) || num === 0) errInvalid();
							else {
								if (isOutOfRange(num)) errOutOfRange();
								addToRangeVal(out, num);
							}
						}
					}

					return out;
				} else errInvalid();
			} else return null;
		}
	},

	MONTH_NAMES: [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December",
	],
	dateToStr (date, short) {
		const month = MiscUtil.MONTH_NAMES[date.getMonth()];
		return `${short ? month.substring(0, 3) : month} ${Parser.getOrdinalForm(date.getDate())}, ${date.getFullYear()}`;
	},

	findCommonPrefix (strArr) {
		let prefix = null;
		strArr.forEach(s => {
			if (prefix == null) {
				prefix = s;
			} else {
				const minLen = Math.min(s.length, prefix.length);
				for (let i = 0; i < minLen; ++i) {
					const cp = prefix[i];
					const cs = s[i];
					if (cp !== cs) {
						prefix = prefix.substring(0, i);
						break;
					}
				}
			}
		});
		return prefix;
	},

	/**
	 * @param fgHexTarget Target/resultant color for the foreground item
	 * @param fgOpacity Desired foreground transparency (0-1 inclusive)
	 * @param bgHex Background color
	 */
	calculateBlendedColor (fgHexTarget, fgOpacity, bgHex) {
		const fgDcTarget = CryptUtil.hex2Dec(fgHexTarget);
		const bgDc = CryptUtil.hex2Dec(bgHex);
		return ((fgDcTarget - ((1 - fgOpacity) * bgDc)) / fgOpacity).toString(16);
	},

	/**
	 * Borrowed from lodash.
	 *
	 * @param func The function to debounce.
	 * @param wait Minimum duration between calls.
	 * @param options Options object.
	 * @return {Function} The debounced function.
	 */
	debounce (func, wait, options) {
		let lastArgs;
		let lastThis;
		let maxWait;
		let result;
		let timerId;
		let lastCallTime;
		let lastInvokeTime = 0;
		let leading = false;
		let maxing = false;
		let trailing = true;

		wait = Number(wait) || 0;
		if (typeof options === "object") {
			leading = !!options.leading;
			maxing = "maxWait" in options;
			maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : maxWait;
			trailing = "trailing" in options ? !!options.trailing : trailing;
		}

		function invokeFunc (time) {
			let args = lastArgs;
			let thisArg = lastThis;

			lastArgs = lastThis = undefined;
			lastInvokeTime = time;
			result = func.apply(thisArg, args);
			return result;
		}

		function leadingEdge (time) {
			lastInvokeTime = time;
			timerId = setTimeout(timerExpired, wait);
			return leading ? invokeFunc(time) : result;
		}

		function remainingWait (time) {
			let timeSinceLastCall = time - lastCallTime;
			let timeSinceLastInvoke = time - lastInvokeTime;
			let result = wait - timeSinceLastCall;
			return maxing ? Math.min(result, maxWait - timeSinceLastInvoke) : result;
		}

		function shouldInvoke (time) {
			let timeSinceLastCall = time - lastCallTime;
			let timeSinceLastInvoke = time - lastInvokeTime;

			return (lastCallTime === undefined || (timeSinceLastCall >= wait) || (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
		}

		function timerExpired () {
			const time = Date.now();
			if (shouldInvoke(time)) {
				return trailingEdge(time);
			}
			// Restart the timer.
			timerId = setTimeout(timerExpired, remainingWait(time));
		}

		function trailingEdge (time) {
			timerId = undefined;

			if (trailing && lastArgs) return invokeFunc(time);
			lastArgs = lastThis = undefined;
			return result;
		}

		function cancel () {
			if (timerId !== undefined) clearTimeout(timerId);
			lastInvokeTime = 0;
			lastArgs = lastCallTime = lastThis = timerId = undefined;
		}

		function flush () {
			return timerId === undefined ? result : trailingEdge(Date.now());
		}

		function debounced () {
			let time = Date.now();
			let isInvoking = shouldInvoke(time);
			lastArgs = arguments;
			lastThis = this;
			lastCallTime = time;

			if (isInvoking) {
				if (timerId === undefined) return leadingEdge(lastCallTime);
				if (maxing) {
					// Handle invocations in a tight loop.
					timerId = setTimeout(timerExpired, wait);
					return invokeFunc(lastCallTime);
				}
			}
			if (timerId === undefined) timerId = setTimeout(timerExpired, wait);
			return result;
		}

		debounced.cancel = cancel;
		debounced.flush = flush;
		return debounced;
	},

	// from lodash
	throttle (func, wait, options) {
		let leading = true;
		let trailing = true;

		if (typeof options === "object") {
			leading = "leading" in options ? !!options.leading : leading;
			trailing = "trailing" in options ? !!options.trailing : trailing;
		}

		return this.debounce(func, wait, { leading, maxWait: wait, trailing });
	},

	pDelay (msecs, resolveAs) {
		return new Promise(resolve => setTimeout(() => resolve(resolveAs), msecs));
	},

	GENERIC_WALKER_ENTRIES_KEY_BLACKLIST: new Set(["caption", "type", "name", "colStyles", "rowStyles", "style", "styles", "shortName", "subclassShortName", "immunities", "resistances", "weaknesses", "featType", "trait", "traits", "components"]),

	/**
	 * @param [opts]
	 * @param [opts.keyBlacklist]
	 * @param [opts.isAllowDeleteObjects] If returning `undefined` from an object handler should be treated as a delete.
	 * @param [opts.isAllowDeleteArrays] (Unimplemented) // TODO
	 * @param [opts.isAllowDeleteBooleans] (Unimplemented) // TODO
	 * @param [opts.isAllowDeleteNumbers] (Unimplemented) // TODO
	 * @param [opts.isAllowDeleteStrings] (Unimplemented) // TODO
	 * @param [opts.isDepthFirst] If array/object recursion should occur before array/object primitive handling.
	 * @param [opts.isNoModification] If the walker should not attempt to modify the data.
	 */
	getWalker (opts) {
		opts = opts || {};
		const keyBlacklist = opts.keyBlacklist || new Set();

		function applyHandlers (handlers, obj, lastKey, stack) {
			if (!(handlers instanceof Array)) handlers = [handlers];
			handlers.forEach(h => {
				const out = h(obj, lastKey, stack);
				if (!opts.isNoModification) obj = out;
			});
			return obj;
		}

		function runHandlers (handlers, obj, lastKey, stack) {
			if (!(handlers instanceof Array)) handlers = [handlers];
			handlers.forEach(h => h(obj, lastKey, stack));
		}

		const fn = (obj, primitiveHandlers, lastKey, stack) => {
			if (obj == null) {
				if (primitiveHandlers.null) return applyHandlers(primitiveHandlers.null, obj, lastKey, stack);
				return obj;
			}

			const doObjectRecurse = () => {
				Object.keys(obj).forEach(k => {
					const v = obj[k];
					if (!keyBlacklist.has(k)) {
						const out = fn(v, primitiveHandlers, k, stack);
						if (!opts.isNoModification) obj[k] = out;
					}
				});
			};

			const to = typeof obj;
			switch (to) {
				case undefined:
					if (primitiveHandlers.preUndefined) runHandlers(primitiveHandlers.preUndefined, obj, lastKey, stack);
					if (primitiveHandlers.undefined) {
						const out = applyHandlers(primitiveHandlers.undefined, obj, lastKey, stack);
						if (!opts.isNoModification) obj = out;
					}
					if (primitiveHandlers.postUndefined) runHandlers(primitiveHandlers.postUndefined, obj, lastKey, stack);
					return obj;
				case "boolean":
					if (primitiveHandlers.preBoolean) runHandlers(primitiveHandlers.preBoolean, obj, lastKey, stack);
					if (primitiveHandlers.boolean) {
						const out = applyHandlers(primitiveHandlers.boolean, obj, lastKey, stack);
						if (!opts.isNoModification) obj = out;
					}
					if (primitiveHandlers.postBoolean) runHandlers(primitiveHandlers.postBoolean, obj, lastKey, stack);
					return obj;
				case "number":
					if (primitiveHandlers.preNumber) runHandlers(primitiveHandlers.preNumber, obj, lastKey, stack);
					if (primitiveHandlers.number) {
						const out = applyHandlers(primitiveHandlers.number, obj, lastKey, stack);
						if (!opts.isNoModification) obj = out;
					}
					if (primitiveHandlers.postNumber) runHandlers(primitiveHandlers.postNumber, obj, lastKey, stack);
					return obj;
				case "string":
					if (primitiveHandlers.preString) runHandlers(primitiveHandlers.preString, obj, lastKey, stack);
					if (primitiveHandlers.string) {
						const out = applyHandlers(primitiveHandlers.string, obj, lastKey, stack);
						if (!opts.isNoModification) obj = out;
					}
					if (primitiveHandlers.postString) runHandlers(primitiveHandlers.postString, obj, lastKey, stack);
					return obj;
				case "object": {
					if (obj instanceof Array) {
						if (primitiveHandlers.preArray) runHandlers(primitiveHandlers.preArray, obj, lastKey, stack);
						if (opts.isDepthFirst) {
							if (stack) stack.push(obj);
							const out = obj.map(it => fn(it, primitiveHandlers, lastKey, stack));
							if (!opts.isNoModification) obj = out;
							if (stack) stack.pop();

							if (primitiveHandlers.array) {
								const out = applyHandlers(primitiveHandlers.array, obj, lastKey, stack);
								if (!opts.isNoModification) obj = out;
							}
						} else {
							if (primitiveHandlers.array) {
								const out = applyHandlers(primitiveHandlers.array, obj, lastKey, stack);
								if (!opts.isNoModification) obj = out;
							}
							const out = obj.map(it => fn(it, primitiveHandlers, lastKey, stack));
							if (!opts.isNoModification) obj = out;
						}
						if (primitiveHandlers.postArray) runHandlers(primitiveHandlers.postArray, obj, lastKey, stack);
						return obj;
					} else {
						if (primitiveHandlers.preObject) runHandlers(primitiveHandlers.preObject, obj, lastKey, stack);
						if (opts.isDepthFirst) {
							if (stack) stack.push(obj);
							doObjectRecurse();
							if (stack) stack.pop();

							if (primitiveHandlers.object) {
								const out = applyHandlers(primitiveHandlers.object, obj, lastKey, stack);
								if (!opts.isNoModification) obj = out;
							}
							if (obj == null) {
								if (!opts.isAllowDeleteObjects) throw new Error(`Object handler(s) returned null!`);
							}
						} else {
							if (primitiveHandlers.object) {
								const out = applyHandlers(primitiveHandlers.object, obj, lastKey, stack);
								if (!opts.isNoModification) obj = out;
							}
							if (obj == null) {
								if (!opts.isAllowDeleteObjects) throw new Error(`Object handler(s) returned null!`);
							} else {
								doObjectRecurse();
							}
						}
						if (primitiveHandlers.postObject) runHandlers(primitiveHandlers.postObject, obj, lastKey, stack);
						return obj;
					}
				}
				default:
					throw new Error(`Unhandled type "${to}"`);
			}
		};

		return { walk: fn };
	},

	pDefer (fn) {
		return (async () => fn())();
	},
};

// EVENT HANDLERS ======================================================================================================
EventUtil = {
	_mouseX: 0,
	_mouseY: 0,

	init () {
		document.addEventListener("mousemove", evt => {
			EventUtil._mouseX = evt.clientX;
			EventUtil._mouseY = evt.clientY;
		});
	},

	getClientX (evt) {
		return evt.touches && evt.touches.length ? evt.touches[0].clientX : evt.clientX;
	},
	getClientY (evt) {
		return evt.touches && evt.touches.length ? evt.touches[0].clientY : evt.clientY;
	},

	isInInput (evt) {
		return evt.target.nodeName === "INPUT" || evt.target.nodeName === "TEXTAREA"
			|| evt.target.getAttribute("contenteditable") === "true";
	},

	noModifierKeys (evt) {
		return !evt.ctrlKey && !evt.altKey && !evt.metaKey;
	},

	getKeyIgnoreCapsLock (evt) {
		if (!evt.key) return null;
		if (evt.key.length !== 1) return evt.key;
		const isCaps = (evt.originalEvent || evt).getModifierState("CapsLock");
		if (!isCaps) return evt.key;
		const asciiCode = evt.key.charCodeAt(0);
		const isUpperCase = asciiCode >= 65 && asciiCode <= 90;
		const isLowerCase = asciiCode >= 97 && asciiCode <= 122;
		if (!isUpperCase && !isLowerCase) return evt.key;
		return isUpperCase ? evt.key.toLowerCase() : evt.key.toUpperCase();
	},
};

if (typeof window !== "undefined") window.addEventListener("load", EventUtil.init);

// CONTEXT MENUS =======================================================================================================
ContextUtil = {
	_isInit: false,
	_menus: [],

	_init () {
		if (ContextUtil._isInit) return;
		ContextUtil._isInit = true;

		$(document.body).click(() => ContextUtil._menus.forEach(menu => menu.close()));
	},

	getMenu (actions) {
		ContextUtil._init();

		const menu = new ContextUtil.Menu(actions);
		ContextUtil._menus.push(menu);
		return menu;
	},

	deleteMenu (menu) {
		menu.remove();
		const ix = ContextUtil._menus.findIndex(it => it === menu);
		if (~ix) ContextUtil._menus.splice(ix, 1);
	},

	pOpenMenu (evt, menu, userData) {
		evt.preventDefault();
		evt.stopPropagation();

		ContextUtil._init();

		// Close any other open menus
		ContextUtil._menus.filter(it => it !== menu).forEach(it => it.close());

		return menu.pOpen(evt, userData);
	},

	Menu: function (actions) {
		this._actions = actions;
		this._pResult = null;
		this._resolveResult = null;

		this._userData = null;

		const $elesAction = this._actions.map(it => {
			if (it == null) return $(`<div class="my-1 w-100 ui-ctx__divider"></div>`);

			const $row = $$`<div class="py-1 px-5 ui-ctx__row ${it.isDisabled ? "disabled" : ""} ${it.style || ""}">${it.text}</div>`
				.click(async evt => {
					if (it.isDisabled) return;

					evt.preventDefault();
					evt.stopPropagation();

					this.close();

					const result = await it.fnAction(evt, this._userData);
					if (this._resolveResult) this._resolveResult(result);
				});
			if (it.title) $row.title(it.title);

			return $row;
		});

		this._$ele = $$`<div class="flex-col ui-ctx__wrp py-2">${$elesAction}</div>`
			.hideVe()
			.appendTo(document.body);

		this.remove = function () {
			this._$ele.remove();
		}

		this.width = function () {
			return this._$ele.width();
		}
		this.height = function () {
			return this._$ele.height();
		}

		this.pOpen = function (evt, userData) {
			if (this._resolveResult) this._resolveResult(null);
			this._pResult = new Promise(resolve => {
				this._resolveResult = resolve;
			});
			this._userData = userData;

			this._$ele
				.css({
					position: "absolute",
					left: this._getMenuPosition(evt, "x"),
					top: this._getMenuPosition(evt, "y"),
				})
				.showVe();

			return this._pResult;
		}
		this.close = function () {
			this._$ele.hideVe();
		}

		this._getMenuPosition = function (evt, axis) {
			const { fnMenuSize, propMousePos, fnWindowSize, fnScrollDir } = axis === "x"
				? { fnMenuSize: "width", propMousePos: "clientX", fnWindowSize: "width", fnScrollDir: "scrollLeft" }
				: { fnMenuSize: "height", propMousePos: "clientY", fnWindowSize: "height", fnScrollDir: "scrollTop" };

			const posMouse = evt[propMousePos];
			const szWin = $(window)[fnWindowSize]();
			const posScroll = $(window)[fnScrollDir]();
			let position = posMouse + posScroll;
			const szMenu = this[fnMenuSize]();
			// opening menu would pass the side of the page
			if (posMouse + szMenu > szWin && szMenu < posMouse) position -= szMenu;
			return position;
		}
	},

	/**
	 * @param text
	 * @param fnAction Action, which is passed its triggering click event as an argument.
	 * @param [opts] Options object.
	 * @param [opts.isDisabled] If this action is disabled.
	 * @param [opts.title] Help (title) text.
	 * @param [opts.style] Additional CSS classes to add (e.g. `ctx-danger`).
	 */
	Action: function (text, fnAction, opts) {
		opts = opts || {};

		this.text = text;
		this.fnAction = fnAction;

		this.isDisabled = opts.isDisabled;
		this.title = opts.title;
		this.style = opts.style;
	},
};

// LIST AND SEARCH =====================================================================================================
SearchUtil = {
	removeStemmer (elasticSearch) {
		const stemmer = elasticlunr.Pipeline.getRegisteredFunction("stemmer");
		elasticSearch.pipeline.remove(stemmer);
	},
};

// ENCODING/DECODING ===================================================================================================
UrlUtil = {
	encodeForHash (toEncode) {
		if (toEncode instanceof Array) return toEncode.map(it => `${it}`.toUrlified()).join(HASH_LIST_SEP);
		else return `${toEncode}`.toUrlified();
	},

	autoEncodeHash (obj) {
		const curPage = UrlUtil.getCurrentPage();
		const encoder = UrlUtil.URL_TO_HASH_BUILDER[curPage];
		if (!encoder) throw new Error(`No encoder found for page ${curPage}`);
		return encoder(obj);
	},

	getCurrentPage () {
		if (typeof window === "undefined") return VeCt.PG_NONE;
		const pSplit = window.location.pathname.split("/");
		let out = pSplit[pSplit.length - 1];
		if (!out.toLowerCase().endsWith(".html")) out += ".html";
		return out;
	},

	/**
	 * All internal URL construction should pass through here, to ensure static url is used when required.
	 *
	 * @param href the link
	 */
	link (href) {
		function addGetParam (curr) {
			if (href.includes("?")) return `${curr}&v=${VERSION_NUMBER}`;
			else return `${curr}?v=${VERSION_NUMBER}`;
		}

		if (!IS_VTT && IS_DEPLOYED) return addGetParam(`${DEPLOYED_STATIC_ROOT}${href}`);
		else if (IS_DEPLOYED) return addGetParam(href);
		return href;
	},

	unpackSubHash (subHash, unencode) {
		// format is "key:value~list~sep~with~tilde"
		if (subHash.includes(HASH_SUB_KV_SEP)) {
			const keyValArr = subHash.split(HASH_SUB_KV_SEP).map(s => s.trim());
			const out = {};
			let k = keyValArr[0].toLowerCase();
			if (unencode) k = decodeURIComponent(k);
			let v = keyValArr[1].toLowerCase();
			if (unencode) v = decodeURIComponent(v);
			out[k] = v.split(HASH_SUB_LIST_SEP).map(s => s.trim());
			if (out[k].length === 1 && out[k] === HASH_SUB_NONE) out[k] = [];
			return out;
		} else {
			throw new Error(`Badly formatted subhash ${subHash}`)
		}
	},

	/**
	 * @param key The subhash key.
	 * @param values The subhash values.
	 * @param [opts] Options object.
	 * @param [opts.isEncodeBoth] If both the key and values should be URl encoded.
	 * @param [opts.isEncodeKey] If the key should be URL encoded.
	 * @param [opts.isEncodeValues] If the values should be URL encoded.
	 * @returns {string}
	 */
	packSubHash (key, values, opts) {
		opts = opts || {};
		if (opts.isEncodeBoth || opts.isEncodeKey) key = key.toUrlified();
		if (opts.isEncodeBoth || opts.isEncodeValues) values = values.map(it => it.toUrlified());
		return `${key}${HASH_SUB_KV_SEP}${values.join(HASH_SUB_LIST_SEP)}`;
	},

	categoryToPage (category) {
		return UrlUtil.CAT_TO_PAGE[category];
	},
	categoryToHoverPage (category) {
		return UrlUtil.CAT_TO_HOVER_PAGE[category] || UrlUtil.categoryToPage(category);
	},

	bindLinkExportButton (filterBox, $btn) {
		$btn = $btn || ListUtil.getOrTabRightButton(`btn-link-export`, `magnet`);
		$btn.addClass("btn-copy-effect")
			.off("click")
			.on("click", async evt => {
				let url = window.location.href;

				const parts = filterBox.getSubHashes({ isAddSearchTerm: true });
				parts.unshift(url);

				if (evt.ctrlKey) {
					await MiscUtil.pCopyTextToClipboard(filterBox.getFilterTag());
					JqueryUtil.showCopiedEffect($btn);
					return;
				}

				if (evt.shiftKey && ListUtil.sublist) {
					const toEncode = JSON.stringify(ListUtil.getExportableSublist());
					const part2 = UrlUtil.packSubHash(ListUtil.SUB_HASH_PREFIX, [toEncode], { isEncodeBoth: true });
					parts.push(part2);
				}

				await MiscUtil.pCopyTextToClipboard(parts.join(HASH_PART_SEP));
				JqueryUtil.showCopiedEffect($btn);
			})
			.title("Get link to filters (SHIFT adds list; CTRL copies @filter tag)")
	},

	bindLinkExportButtonMulti (filterBox, $btn) {
		$btn = $btn || ListUtil.getOrTabRightButton(`btn-link-export`, `magnet`);
		$btn.addClass("btn-copy-effect").off("click").on("click", async evt => {
			const url = window.location.href.replace(/\.html.+/, ".html");
			const [[mainHash, ..._], [featHash, ...__]] = Hist.getDoubleHashParts();
			const filterBoxHashes = filterBox.getSubHashes({ isAddSearchTerm: true });
			const toCopy = `${url}#${[mainHash, ...filterBoxHashes].join(HASH_PART_SEP)}#${featHash}`;

			await MiscUtil.pCopyTextToClipboard(toCopy);
			JqueryUtil.showCopiedEffect($btn);
		}).title("Get Link to Filters");
	},

	mini: {
		compress (primitive) {
			const type = typeof primitive;
			if (primitive == null) return `x`;
			switch (type) {
				case "boolean":
					return `b${Number(primitive)}`;
				case "number":
					return `n${primitive}`;
				case "string":
					return `s${primitive.toUrlified()}`;
				default:
					throw new Error(`Unhandled type "${type}"`);
			}
		},

		decompress (raw) {
			const [type, data] = [raw.slice(0, 1), raw.slice(1)];
			switch (type) {
				case "x":
					return null;
				case "b":
					return !!Number(data);
				case "n":
					return Number(data);
				case "s":
					return String(data);
				default:
					throw new Error(`Unhandled type "${type}"`);
			}
		},
	},

	class: {
		getIndexedEntries (cls) {
			const out = [];
			let scFeatureI = 0;
			(cls.classFeatures || []).forEach((lvlFeatureList, ixLvl) => {
				// class features
				lvlFeatureList
					.filter(feature => !feature.gainSubclassFeature)
					.forEach((feature, ixFeature) => {
						const name = Renderer.findName(feature);
						if (!name) { // tolerate missing names in homebrew
							if (BrewUtil.hasSourceJson(cls.source)) return;
							else throw new Error("Class feature had no name!");
						}
						out.push({
							_type: "classFeature",
							source: cls.source.source || cls.source,
							name,
							hash: `${UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES](cls)}${HASH_PART_SEP}${UrlUtil.getClassesPageStatePart({
								feature: {
									ixLevel: ixLvl,
									ixFeature: ixFeature,
								},
							})}`,
							entry: feature,
							level: ixLvl + 1,
						})
					});

				// subclass features
				const ixGainSubclassFeatures = lvlFeatureList.findIndex(feature => feature.gainSubclassFeature);
				if (~ixGainSubclassFeatures) {
					cls.subclasses.forEach(sc => {
						const features = ((sc.subclassFeatures || [])[scFeatureI] || []);
						sc.source = sc.source || cls.source; // default to class source if required
						const tempStack = [];
						features.forEach(feature => {
							const subclassFeatureHash = `${UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES](cls)}${HASH_PART_SEP}${UrlUtil.getClassesPageStatePart({
								subclass: sc,
								feature: { ixLevel: ixLvl, ixFeature: ixGainSubclassFeatures },
							})}`;
							const name = Renderer.findName(feature);
							if (!name) { // tolerate missing names in homebrew
								if (BrewUtil.hasSourceJson(sc.source)) return;
								else throw new Error("Subclass feature had no name!");
							}
							tempStack.push({
								_type: "subclassFeature",
								name,
								subclassName: sc.name,
								subclassShortName: sc.shortName,
								source: sc.source.source || sc.source,
								hash: subclassFeatureHash,
								entry: feature,
								level: ixLvl + 1,
							});

							if (feature.entries) {
								const namedFeatureParts = feature.entries.filter(it => it.name);
								namedFeatureParts.forEach(it => {
									const lvl = ixLvl + 1;
									if (tempStack.find(existing => it.name === existing.name && lvl === existing.level)) return;
									tempStack.push({
										_type: "subclassFeaturePart",
										name: it.name,
										subclassName: sc.name,
										subclassShortName: sc.shortName,
										source: sc.source.source || sc.source,
										hash: subclassFeatureHash,
										entry: feature,
										level: lvl,
									});
								});
							}
						});
						out.push(...tempStack);
					});
					scFeatureI++;
				} else if (ixGainSubclassFeatures.length > 1) {
					setTimeout(() => {
						throw new Error(`Multiple subclass features gained at level ${ixLvl + 1} for class "${cls.name}" from source "${cls.source}"!`)
					});
				}
			});
			return out;
		},
	},

	getStateKeySubclass (sc) {
		return Parser.stringToSlug(`sub ${sc.shortName || sc.name} ${Parser.sourceJsonToAbv(sc.source)}`);
	},

	getStateKeyHeritage (h) {
		return Parser.stringToSlug(`h ${h.shortName || h.name} ${Parser.sourceJsonToAbv(h.source)}`)
	},

	/**
	 * @param opts Options object.
	 * @param [opts.subclass] Subclass (or object of the form `{shortName: "str", source: "str"}`)
	 * @param [opts.feature] Object of the form `{ixLevel: 0, ixFeature: 0}`
	 */
	getClassesPageStatePart (opts) {
		const stateParts = [
			opts.subclass ? `${UrlUtil.getStateKeySubclass(opts.subclass)}=${UrlUtil.mini.compress(true)}` : null,
			opts.feature ? `feature=${UrlUtil.mini.compress(`${opts.feature.ixLevel}-${opts.feature.ixFeature}`)}` : "",
		].filter(Boolean);
		return stateParts.length ? UrlUtil.packSubHash("state", stateParts) : "";
	},

	/**
	 * @param opts Options object.
	 * @param [opts.heritage] Heritage (or object of the form `{name: "str", source: "str"}`)
	 */
	getAncestriesPageStatePart (opts) {
		const stateParts = [
			opts.heritage ? `${UrlUtil.getStateKeyHeritage(opts.heritage)}=${UrlUtil.mini.compress(true)}` : null,
		].filter(Boolean);
		return stateParts.length ? UrlUtil.packSubHash("state", stateParts) : "";
	},
};

UrlUtil.PG_BESTIARY = "bestiary.html";
UrlUtil.PG_SPELLS = "spells.html";
UrlUtil.PG_RITUALS = "rituals.html";
UrlUtil.PG_BACKGROUNDS = "backgrounds.html";
UrlUtil.PG_ITEMS = "items.html";
UrlUtil.PG_CLASSES = "classes.html";
UrlUtil.PG_CONDITIONS = "conditions.html";
UrlUtil.PG_AFFLICTIONS = "afflictions.html";
UrlUtil.PG_FEATS = "feats.html";
UrlUtil.PG_COMPANIONS_FAMILIARS = "companionsfamiliars.html";
UrlUtil.PG_ANCESTRIES = "ancestries.html";
UrlUtil.PG_ARCHETYPES = "archetypes.html";
UrlUtil.PG_VARIANTRULES = "variantrules.html";
UrlUtil.PG_ADVENTURE = "adventure.html";
UrlUtil.PG_ADVENTURES = "adventures.html";
UrlUtil.PG_BOOK = "book.html";
UrlUtil.PG_BOOKS = "books.html";
UrlUtil.PG_DEITIES = "deities.html";
UrlUtil.PG_HAZARDS = "hazards.html";
UrlUtil.PG_QUICKREF = "quickreference.html";
UrlUtil.PG_MANAGE_BREW = "managebrew.html";
UrlUtil.PG_MAKE_BREW = "makebrew.html";
UrlUtil.PG_DEMO_RENDER = "renderdemo.html";
UrlUtil.PG_TABLES = "tables.html";
UrlUtil.PG_ORGANIZATIONS = "organizations.html";
UrlUtil.PG_CREATURETEMPLATE = "creaturetemplates.html";
UrlUtil.PG_CHARACTERS = "characters.html";
UrlUtil.PG_ACTIONS = "actions.html";
UrlUtil.PG_ABILITIES = "abilities.html";
UrlUtil.PG_LANGUAGES = "languages.html";
UrlUtil.PG_TRAITS = "traits.html"
UrlUtil.PG_VEHICLES = "vehicles.html"
UrlUtil.PG_GM_SCREEN = "gmscreen.html";
UrlUtil.PG_CHANGELOG = "changelog.html";
UrlUtil.PG_PLACES = "places.html";
UrlUtil.PG_OPTIONAL_FEATURES = "optionalfeatures.html";
UrlUtil.PG_SEARCH = "search.html";
UrlUtil.PG_GENERIC_DATA = "genericData";

UrlUtil.URL_TO_HASH_BUILDER = {};
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_BESTIARY] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_SPELLS] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_RITUALS] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_BACKGROUNDS] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ITEMS] = (it) => UrlUtil.encodeForHash([it.generic === "G" ? `${it.name} (generic)` : it.add_hash ? `${it.name} (${it.add_hash})` : it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CONDITIONS] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_AFFLICTIONS] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_FEATS] = (it) => UrlUtil.encodeForHash([it.add_hash ? `${it.name} (${it.add_hash})` : it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_COMPANIONS_FAMILIARS] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ANCESTRIES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ARCHETYPES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_VARIANTRULES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ADVENTURE] = (it) => UrlUtil.encodeForHash(it.id);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_BOOK] = (it) => UrlUtil.encodeForHash(it.id);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_DEITIES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_HAZARDS] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_TABLES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ORGANIZATIONS] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CREATURETEMPLATE] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ACTIONS] = (it) => UrlUtil.encodeForHash([it.add_hash ? `${it.name} (${it.add_hash})` : it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ABILITIES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_LANGUAGES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_TRAITS] = (it) => UrlUtil.encodeForHash(BrewUtil.hasSourceJson(it.source) ? [it.name, it.source] : [it.name]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_VEHICLES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_PLACES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_OPTIONAL_FEATURES] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
// region Fake pages (props)
UrlUtil.URL_TO_HASH_BUILDER["subclass"] = it => {
	const hashParts = [
		UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES]({ name: it.className, source: it.classSource }),
		UrlUtil.packSubHash("state", [`${UrlUtil.getStateKeySubclass(it)}=${UrlUtil.mini.compress(true)}`]),
	].filter(Boolean);
	return Hist.util.getCleanHash(hashParts.join(HASH_PART_SEP));
};
UrlUtil.URL_TO_HASH_BUILDER["classFeature"] = (it) => UrlUtil.encodeForHash([it.name, it.className, it.classSource, it.level, it.source]);
UrlUtil.URL_TO_HASH_BUILDER["subclassFeature"] = (it) => UrlUtil.encodeForHash([it.name, it.className, it.classSource, it.subclassShortName, it.subclassSource, it.level, it.source]);
UrlUtil.URL_TO_HASH_BUILDER["legendaryGroup"] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER["runeItem"] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER["domain"] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER["group"] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
UrlUtil.URL_TO_HASH_BUILDER["skill"] = (it) => UrlUtil.encodeForHash([it.name, it.source]);
// endregion

UrlUtil.PG_TO_NAME = {};
UrlUtil.PG_TO_NAME[UrlUtil.PG_BESTIARY] = "Bestiary";
UrlUtil.PG_TO_NAME[UrlUtil.PG_SPELLS] = "Spells";
UrlUtil.PG_TO_NAME[UrlUtil.PG_BACKGROUNDS] = "Backgrounds";
UrlUtil.PG_TO_NAME[UrlUtil.PG_ITEMS] = "Items";
UrlUtil.PG_TO_NAME[UrlUtil.PG_CLASSES] = "Classes";
UrlUtil.PG_TO_NAME[UrlUtil.PG_CONDITIONS] = "Conditions";
UrlUtil.PG_TO_NAME[UrlUtil.PG_AFFLICTIONS] = "Afflictions";
UrlUtil.PG_TO_NAME[UrlUtil.PG_FEATS] = "Feats";
UrlUtil.PG_TO_NAME[UrlUtil.PG_COMPANIONS_FAMILIARS] = "Companions and Familiars";
UrlUtil.PG_TO_NAME[UrlUtil.PG_ANCESTRIES] = "Ancestries";
UrlUtil.PG_TO_NAME[UrlUtil.PG_ARCHETYPES] = "Archetypes";
UrlUtil.PG_TO_NAME[UrlUtil.PG_VARIANTRULES] = "Variant Rules";
UrlUtil.PG_TO_NAME[UrlUtil.PG_ADVENTURES] = "Adventures";
UrlUtil.PG_TO_NAME[UrlUtil.PG_BOOKS] = "Books";
UrlUtil.PG_TO_NAME[UrlUtil.PG_DEITIES] = "Deities";
UrlUtil.PG_TO_NAME[UrlUtil.PG_HAZARDS] = "Hazards";
UrlUtil.PG_TO_NAME[UrlUtil.PG_QUICKREF] = "Quick Reference";
UrlUtil.PG_TO_NAME[UrlUtil.PG_MANAGE_BREW] = "Homebrew Manager";
UrlUtil.PG_TO_NAME[UrlUtil.PG_DEMO_RENDER] = "Renderer Demo";
UrlUtil.PG_TO_NAME[UrlUtil.PG_TABLES] = "Tables";
UrlUtil.PG_TO_NAME[UrlUtil.PG_ORGANIZATIONS] = "Organizations";
UrlUtil.PG_TO_NAME[UrlUtil.PG_CREATURETEMPLATE] = "Creature Templates";
UrlUtil.PG_TO_NAME[UrlUtil.PG_ACTIONS] = "Actions";
UrlUtil.PG_TO_NAME[UrlUtil.PG_ABILITIES] = "Creature Abilities";
UrlUtil.PG_TO_NAME[UrlUtil.PG_LANGUAGES] = "Languages";
UrlUtil.PG_TO_NAME[UrlUtil.PG_GM_SCREEN] = "GM Screen";
UrlUtil.PG_TO_NAME[UrlUtil.PG_CHANGELOG] = "Changelog";
UrlUtil.PG_TO_NAME[UrlUtil.PG_PLACES] = "Planes and Places";
UrlUtil.PG_TO_NAME[UrlUtil.PG_OPTIONAL_FEATURES] = "Optional Features";

UrlUtil.CAT_TO_PAGE = {};
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_QUICKREF] = UrlUtil.PG_QUICKREF;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_VARIANT_RULE] = UrlUtil.PG_VARIANTRULES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_SUBSYSTEM] = UrlUtil.PG_VARIANTRULES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_TABLE] = UrlUtil.PG_TABLES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_TABLE_GROUP] = UrlUtil.PG_TABLES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_BOOK] = UrlUtil.PG_BOOK;

UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_ANCESTRY] = UrlUtil.PG_ANCESTRIES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_HERITAGE] = UrlUtil.PG_ANCESTRIES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_VE_HERITAGE] = UrlUtil.PG_ANCESTRIES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_BACKGROUND] = UrlUtil.PG_BACKGROUNDS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_CLASS] = UrlUtil.PG_CLASSES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_CLASS_FEATURE] = UrlUtil.PG_CLASSES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_SUBCLASS] = UrlUtil.PG_CLASSES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_SUBCLASS_FEATURE] = UrlUtil.PG_CLASSES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_ARCHETYPE] = UrlUtil.PG_ARCHETYPES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_FEAT] = UrlUtil.PG_FEATS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_COMPANION] = UrlUtil.PG_COMPANIONS_FAMILIARS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_FAMILIAR] = UrlUtil.PG_COMPANIONS_FAMILIARS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_EIDOLON] = UrlUtil.PG_COMPANIONS_FAMILIARS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_OPTIONAL_FEATURE] = UrlUtil.PG_OPTIONAL_FEATURES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_OPTIONAL_FEATURE_LESSON] = UrlUtil.PG_OPTIONAL_FEATURES;

UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_ADVENTURE] = UrlUtil.PG_ADVENTURE;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_HAZARD] = UrlUtil.PG_HAZARDS;

UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_ACTION] = UrlUtil.PG_ACTIONS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_CREATURE] = UrlUtil.PG_BESTIARY;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_CONDITION] = UrlUtil.PG_CONDITIONS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_ITEM] = UrlUtil.PG_ITEMS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_SPELL] = UrlUtil.PG_SPELLS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_AFFLICTION] = UrlUtil.PG_AFFLICTIONS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_CURSE] = UrlUtil.PG_AFFLICTIONS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_DISEASE] = UrlUtil.PG_AFFLICTIONS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_ABILITY] = UrlUtil.PG_ABILITIES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_DEITY] = UrlUtil.PG_DEITIES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_LANGUAGE] = UrlUtil.PG_LANGUAGES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_PLACE] = UrlUtil.PG_PLACES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_PLANE] = UrlUtil.PG_PLACES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_ORGANIZATION] = UrlUtil.PG_ORGANIZATIONS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_CREATURETEMPLATE] = UrlUtil.PG_CREATURETEMPLATE;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_NATION] = UrlUtil.PG_PLACES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_SETTLEMENT] = UrlUtil.PG_PLACES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_RITUAL] = UrlUtil.PG_RITUALS;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_VEHICLE] = UrlUtil.PG_VEHICLES;
UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_TRAIT] = UrlUtil.PG_TRAITS;

UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_PAGE] = null;

UrlUtil.CAT_TO_PAGE[Parser.CAT_ID_GENERIC_DATA] = UrlUtil.PG_GENERIC_DATA;

UrlUtil.CAT_TO_HOVER_PAGE = {};
UrlUtil.CAT_TO_HOVER_PAGE[Parser.CAT_ID_CLASS_FEATURE] = "classfeature";
UrlUtil.CAT_TO_HOVER_PAGE[Parser.CAT_ID_SUBCLASS_FEATURE] = "subclassfeature";

// SORTING =============================================================================================================
SortUtil = {
	ascSort: (a, b) => {
		if (typeof FilterItem !== "undefined") {
			if (a instanceof FilterItem) a = a.item;
			if (b instanceof FilterItem) b = b.item;
		}

		return SortUtil._ascSort(a, b);
	},

	ascSortProp: (prop, a, b) => {
		return SortUtil.ascSort(a[prop], b[prop]);
	},

	ascSortLower: (a, b) => {
		if (typeof FilterItem !== "undefined") {
			if (a instanceof FilterItem) a = a.item;
			if (b instanceof FilterItem) b = b.item;
		}

		a = a ? a.toLowerCase() : a;
		b = b ? b.toLowerCase() : b;

		return SortUtil._ascSort(a, b);
	},

	ascSortLowerProp: (prop, a, b) => {
		return SortUtil.ascSortLower(a[prop], b[prop]);
	},

	// warning: slow
	ascSortNumericalSuffix (a, b) {
		if (typeof FilterItem !== "undefined") {
			if (a instanceof FilterItem) a = a.item;
			if (b instanceof FilterItem) b = b.item;
		}

		function popEndNumber (str) {
			const spl = str.split(" ");
			return spl.last().isNumeric() ? [spl.slice(0, -1).join(" "), Number(spl.last().replace(Parser._numberCleanRegexp, ""))] : [spl.join(" "), 0];
		}

		const [aStr, aNum] = popEndNumber(a.item || a);
		const [bStr, bNum] = popEndNumber(b.item || b);
		const initialSort = SortUtil.ascSort(aStr, bStr);
		if (initialSort) return initialSort;
		return SortUtil.ascSort(aNum, bNum);
	},

	// FIXME: I return 1, 10, 2, 3, 4 when it really should be 1, 2, 3, 4, 10
	_ascSort: (a, b) => {
		if (b === a) return 0;
		return b < a ? 1 : -1;
	},

	ascSortAdventure (a, b) {
		return SortUtil.ascSortDateString(b.published, a.published)
			|| SortUtil.ascSortLower(a.parentSource || "", b.parentSource || "")
			|| SortUtil.ascSort(a.publishedOrder ?? 0, b.publishedOrder ?? 0)
			|| SortUtil.ascSortLower(a.storyline, b.storyline)
			|| SortUtil.ascSort(a.level?.start ?? 20, b.level?.start ?? 20)
			|| SortUtil.ascSortLower(a.name, b.name);
	},

	ascSortBook (a, b) {
		return SortUtil.ascSortDateString(b.published, a.published)
			|| SortUtil.ascSortLower(a.parentSource || "", b.parentSource || "")
			|| SortUtil.ascSortLower(a.name, b.name);
	},

	ascSortDate (a, b) {
		return b.getTime() - a.getTime();
	},

	ascSortDateString (a, b) {
		return SortUtil.ascSortDate(new Date(a || "1970-01-0"), new Date(b || "1970-01-0"));
	},

	compareListNames (a, b) {
		return SortUtil._ascSort(a.name.toLowerCase(), b.name.toLowerCase());
	},

	listSort (a, b, opts) {
		opts = opts || { sortBy: "name" };
		if (opts.sortBy === "name") return SortUtil.compareListNames(a, b);
		else return SortUtil._compareByOrDefault_compareByOrDefault(a, b, opts.sortBy);
	},

	_listSort_compareBy (a, b, sortBy) {
		const aValue = typeof a.values[sortBy] === "string" ? a.values[sortBy].toLowerCase() : a.values[sortBy];
		const bValue = typeof b.values[sortBy] === "string" ? b.values[sortBy].toLowerCase() : b.values[sortBy];

		return SortUtil._ascSort(aValue, bValue);
	},

	_compareByOrDefault_compareByOrDefault (a, b, sortBy) {
		return SortUtil._listSort_compareBy(a, b, sortBy) || SortUtil.compareListNames(a, b);
	},

	_alignSorted: ["ce", "ne", "le", "cn", "n", "ln", "cg", "ng", "lg", "any"],
	alignmentSort: (a, b) => {
		if (typeof FilterItem !== "undefined") {
			if (a instanceof FilterItem) a = a.item;
			if (b instanceof FilterItem) b = b.item;
		}
		return SortUtil.ascSort(SortUtil._alignSorted.indexOf(b.toLowerCase()), SortUtil._alignSorted.indexOf(a.toLowerCase()));
	},

	sortActivities (a, b) {
		return SortUtil.ascSort(Parser.activityTypeToNumber(a), Parser.activityTypeToNumber(b));
	},

	ascSortLvl (a, b) {
		if (typeof FilterItem !== "undefined") {
			if (a instanceof FilterItem) a = a.item;
			if (b instanceof FilterItem) b = b.item;
		}
		// always put unknown values last
		if (a === "Unknown" || a === undefined) a = "999";
		if (b === "Unknown" || b === undefined) b = "999";
		return SortUtil.ascSort(a, b);
	},

	ascSortRarity (a, b) {
		if (typeof FilterItem !== "undefined") {
			if (a instanceof FilterItem) a = a.item;
			if (b instanceof FilterItem) b = b.item;
		}
		return SortUtil.ascSort(Parser.rarityToNumber(a), Parser.rarityToNumber(b));
	},

	ascSortProfRanks (a, b) {
		return SortUtil.ascSort(Parser.proficiencyToNumber(a.item), Parser.proficiencyToNumber(b.item))
	},

	abilitySort (a, b) {
		return SortUtil.ascSort(Parser._parse_aToB(Parser.ATB_TO_NUM, a, 999), Parser._parse_aToB(Parser.ATB_TO_NUM, b, 999));
	},

	sortTraits (a, b) {
		// if (typeof FilterItem !== "undefined") {
		// 	if (a instanceof FilterItem) a = a.item;
		// 	if (b instanceof FilterItem) b = b.item;
		// }
		if (['uncommon','rare','unique'].includes(a)) return -1;
		else if (['uncommon','rare','unique'].includes(b)) return 1;
		else if (Renderer.trait.isTraitInCategory(a, "_alignAbv")) return -1;
		else if (Renderer.trait.isTraitInCategory(b, "_alignAbv")) return 1;
		else if (Renderer.trait.isTraitInCategory(a, "Size")) return -1;
		else if (Renderer.trait.isTraitInCategory(b, "Size")) return 1;
		else return SortUtil.ascSortLower(a, b);
	},

	sortSpellLvlCreature (a, b) {
		const aNum = Number(a);
		const bNum = Number(b);
		if (!isNaN(aNum) && !isNaN(bNum)) return SortUtil.ascSort(bNum, aNum);
		else if (isNaN(a)) return 1;
		else if (isNaN(b)) return -1;
		else return 0;
	},

	sortItemSubCategory (a, b) {
		const out = SortUtil.ascSort(a.item.split(" ").last(), b.item.split(" ").last());
		if (out === 0) return SortUtil.ascSort(a, b)
		else return out;
	},

	sortDice (a, b) {
		if (typeof FilterItem !== "undefined") {
			if (a instanceof FilterItem) a = a.item;
			if (b instanceof FilterItem) b = b.item;
		}
		const A = String(a).split("d");
		const B = String(b).split("d");
		if (A.length < B.length) return -1;
		else if (A.length > B.length) return 1;
		else if (SortUtil._ascSort(A[0], B[0]) !== 0) return SortUtil._ascSort(A[0], B[0]);
		return SortUtil.ascSort((`000${A[1]}`).slice(-3), (`000${B[1]}`).slice(-3));
	},

	initBtnSortHandlers ($wrpBtnsSort, list) {
		function addCaret ($btnSort, direction) {
			$wrpBtnsSort.find(".caret").removeClass("caret");
			$btnSort.find(".caret_wrp").addClass("caret").toggleClass("caret--reverse", direction === "asc");
		}

		const $btnSort = $wrpBtnsSort.find(`.sort[data-sort="${list.sortBy}"]`);
		addCaret($btnSort, list.sortDir);

		$wrpBtnsSort.find(".sort").each((i, e) => {
			const $btnSort = $(e);
			$btnSort.click(evt => {
				evt.stopPropagation();
				const direction = list.sortDir === "asc" ? "desc" : "asc";
				addCaret($btnSort, direction);
				list.sort($btnSort.data("sort"), direction);
			});
		});
	},
};

// JSON LOADING ========================================================================================================
DataUtil = {
	_loading: {},
	_loaded: {},
	_merging: {},
	_merged: {},

	async _pLoad (url) {
		if (DataUtil._loading[url]) {
			await DataUtil._loading[url];
			return DataUtil._loaded[url];
		}

		DataUtil._loading[url] = new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.overrideMimeType("application/json");
			request.onload = function () {
				try {
					DataUtil._loaded[url] = JSON.parse(this.response);
					resolve();
				} catch (e) {
					reject(new Error(`Could not parse JSON from ${url}: ${e.message}`));
				}
			};
			request.onerror = (e) => reject(new Error(`Error during JSON request: ${e.target.status}`));
			request.send();
		});

		await DataUtil._loading[url];
		return DataUtil._loaded[url];
	},

	async loadJSON (url, ...otherData) {
		const procUrl = UrlUtil.link(url);

		let ident = procUrl;
		let data;
		try {
			data = await DataUtil._pLoad(procUrl);
		} catch (e) {
			setTimeout(() => {
				throw e;
			})
		}

		// Fallback to the un-processed URL
		if (!data) {
			ident = url;
			data = await DataUtil._pLoad(url);
		}

		await DataUtil.pDoMetaMerge(ident, data);

		return data;
	},

	async pDoMetaMerge (ident, data, options) {
		DataUtil._merging[ident] = DataUtil._merging[ident] || DataUtil._pDoMetaMerge(ident, data, options);
		await DataUtil._merging[ident];
		return DataUtil._merged[ident];
	},

	_pDoMetaMerge_handleCopyProp (prop, arr, entry, options) {
		if (entry._copy) {
			switch (prop) {
				case "creature": return DataUtil.creature.pMergeCopy(arr, entry, options);
				case "creatureFluff": return DataUtil.creatureFluff.pMergeCopy(arr, entry, options);
				case "spell": return DataUtil.spell.pMergeCopy(arr, entry, options);
				case "spellFluff": return DataUtil.spellFluff.pMergeCopy(arr, entry, options);
				case "item": return DataUtil.item.pMergeCopy(arr, entry, options);
				case "itemFluff": return DataUtil.itemFluff.pMergeCopy(arr, entry, options);
				case "background": return DataUtil.background.pMergeCopy(arr, entry, options);
				case "ancestry": return DataUtil.ancestry.pMergeCopy(arr, entry, options);
				case "ancestryFluff": return DataUtil.ancestryFluff.pMergeCopy(arr, entry, options);
				case "deity": return DataUtil.deity.pMergeCopy(arr, entry, options);
				case "deityFluff": return DataUtil.deityFluff.pMergeCopy(arr, entry, options);
				case "organization": return DataUtil.organization.pMergeCopy(arr, entry, options);
				case "organizationFluff": return DataUtil.organizationFluff.pMergeCopy(arr, entry, options);
				case "creatureTemplate": return DataUtil.creatureTemplate.pMergeCopy(arr, entry, options);
				case "creatureTemplateFluff": return DataUtil.creatureTemplateFluff.pMergeCopy(arr, entry, options);
				default: throw new Error(`No dependency _copy merge strategy specified for property "${prop}"`);
			}
		}
	},

	async _pDoMetaMerge (ident, data, options) {
		if (data._meta) {
			if (data._meta.dependencies) {
				await Promise.all(Object.entries(data._meta.dependencies).map(async ([prop, sources]) => {
					if (!data[prop]) return; // if e.g. creature dependencies are declared, but there are no creatures to merge with, bail out

					const toLoads = await Promise.all(sources.map(async source => DataUtil.pGetLoadableByMeta(prop, source)));
					const dependencyData = await Promise.all(toLoads.map(toLoad => DataUtil.loadJSON(toLoad)));
					const flatDependencyData = dependencyData.map(dd => dd[prop]).flat();
					await Promise.all(data[prop].map(entry => DataUtil._pDoMetaMerge_handleCopyProp(prop, flatDependencyData, entry, options)));
				}));
				delete data._meta.dependencies;
			}

			if (data._meta.internalCopies) {
				for (const prop of data._meta.internalCopies) {
					if (!data[prop]) continue;
					for (const entry of data[prop]) {
						await DataUtil._pDoMetaMerge_handleCopyProp(prop, data[prop], entry, options);
					}
				}
				delete data._meta.internalCopies;
			}

			if (data._meta.otherSources) {
				await Promise.all(Object.entries(data._meta.otherSources).map(async ([prop, sources]) => {
					const toLoads = await Promise.all(Object.entries(sources).map(async ([source, findWith]) => ({
						findWith,
						url: await DataUtil.pGetLoadableByMeta(prop, source),
					})));

					const additionalData = await Promise.all(toLoads.map(async ({ findWith, url }) => ({
						findWith,
						sourceData: await DataUtil.loadJSON(url),
					})));

					additionalData.forEach(dataAndSource => {
						const findWith = dataAndSource.findWith;
						const ad = dataAndSource.sourceData;
						const toAppend = ad[prop].filter(it => it.otherSources && it.otherSources.find(os => os.source === findWith));
						if (toAppend.length) data[prop] = (data[prop] || []).concat(toAppend);
					});
				}));
				delete data._meta.otherSources;
			}
		}
		DataUtil._merged[ident] = data;
	},

	getCleanFilename (filename) {
		return filename.replace(/[^-_a-zA-Z0-9]/g, "_");
	},

	getCsv (headers, rows) {
		function escapeCsv (str) {
			return `"${str.replace(/"/g, `""`).replace(/ +/g, " ").replace(/\n\n+/gi, "\n\n")}"`;
		}

		function toCsv (row) {
			return row.map(str => escapeCsv(str)).join(",");
		}

		return `${toCsv(headers)}\n${rows.map(r => toCsv(r)).join("\n")}`;
	},

	userDownload (filename, data, {fileType = null, isSkipAdditionalMetadata = false, propVersion = "siteVersion", valVersion = VERSION_NUMBER} = {}) {
		filename = `${filename}.json`;
		if (isSkipAdditionalMetadata || data instanceof Array) return DataUtil._userDownload(filename, JSON.stringify(data, null, "\t"), "text/json");

		data = {[propVersion]: valVersion, ...data};
		if (fileType != null) data = {fileType, ...data};
		return DataUtil._userDownload(filename, JSON.stringify(data, null, "\t"), "text/json");
	},

	userDownloadText (filename, string) {
		return DataUtil._userDownload(filename, string, "text/plain");
	},

	_userDownload (filename, data, mimeType) {
		const a = document.createElement("a");
		const t = new Blob([data], {type: mimeType});
		a.href = window.URL.createObjectURL(t);
		a.download = filename;
		a.dispatchEvent(new MouseEvent("click", {bubbles: true, cancelable: true, view: window}));
		setTimeout(() => window.URL.revokeObjectURL(a.href), 100);
	},

	/** Always returns an array of files, even in "single" mode. */
	pUserUpload ({isMultiple = false, expectedFileType = null, propVersion = "siteVersion"} = {}) {
		return new Promise(resolve => {
			const $iptAdd = $(`<input type="file" ${isMultiple ? "multiple" : ""} accept=".json" style="position: fixed; top: -100px; left: -100px; display: none;">`).on("change", (evt) => {
				const input = evt.target;

				const reader = new FileReader();
				let readIndex = 0;
				const out = [];
				const errs = [];
				reader.onload = async () => {
					const name = input.files[readIndex - 1].name;
					const text = reader.result;

					try {
						const json = JSON.parse(text);

						const isSkipFile = expectedFileType != null && json.fileType && json.fileType !== expectedFileType && !(await InputUiUtil.pGetUserBoolean({
							textYes: "Yes",
							textNo: "Cancel",
							title: "File Type Mismatch",
							htmlDescription: `The file "${name}" has the type "${json.fileType}" when the expected file type was "${expectedFileType}".<br>Are you sure you want to upload this file?`,
						}));

						if (!isSkipFile) {
							delete json.fileType;
							delete json[propVersion];

							out.push(json);
						}
					} catch (e) {
						errs.push({filename: name, message: e.message});
					}

					if (input.files[readIndex]) reader.readAsText(input.files[readIndex++]);
					else resolve({jsons: out, errors: errs});
				};

				reader.readAsText(input.files[readIndex++]);
			}).appendTo(document.body);
			$iptAdd.click();
		});
	},

	doHandleFileLoadErrorsGeneric (errors) {
		if (!errors) return;
		errors.forEach(err => {
			JqueryUtil.doToast({
				content: `Could not load file "${err.filename}": <code>${err.message}</code>. ${VeCt.STR_SEE_CONSOLE}`,
				type: "danger",
			});
		});
	},

	cleanJson (cpy) {
		cpy.name = cpy._displayName || cpy.name;
		delete cpy.uniqueId;
		DataUtil.__cleanJsonObject(cpy);
		return cpy;
	},

	__cleanJsonObject (obj) {
		if (obj == null) return obj;
		if (typeof obj === "object") {
			if (obj instanceof Array) {
				obj.forEach(it => DataUtil.__cleanJsonObject(it));
			} else {
				Object.entries(obj).forEach(([k, v]) => {
					if (k.startsWith("_") || k === "customHashId") delete obj[k];
					else DataUtil.__cleanJsonObject(v);
				});
			}
		}
	},

	async pGetLoadableByMeta (key, value) {
		// TODO(future) allow value to be e.g. a string (assumed to be an official data's source); an object e.g. `{type: external, url: <>}`,...
		// TODO(future) have this return the data, not a URL
		// TODO(future) handle homebrew dependencies/refactor "creature" and "spell" + have this be the general form.
		switch (key) {
			case "creature": {
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/bestiary/index.json`);
				if (index[value]) return `${Renderer.get().baseUrl}data/bestiary/${index[value]}`;
				const brewIndex = await DataUtil.brew.pLoadSourceIndex();
				if (!brewIndex[value]) throw new Error(`Bestiary index did not contain source "${value}"`);
				const urlRoot = await StorageUtil.pGet(`HOMEBREW_CUSTOM_REPO_URL`);
				const brewUrl = DataUtil.brew.getFileUrl(brewIndex[value], urlRoot);
				await BrewUtil.pDoHandleBrewJson((await DataUtil.loadJSON(brewUrl)), UrlUtil.getCurrentPage());
				return brewUrl;
			}
			case "creatureFluff": {
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/bestiary/fluff-index.json`);
				if (!index[value]) throw new Error(`Bestiary fluff index did not contain source "${value}"`);
				return `${Renderer.get().baseUrl}data/bestiary/${index[value]}`;
			}
			case "spell": {
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/spells/index.json`);
				if (index[value]) return `${Renderer.get().baseUrl}data/spells/${index[value]}`;
				const brewIndex = await DataUtil.brew.pLoadSourceIndex();
				if (!brewIndex[value]) throw new Error(`Spell index did not contain source "${value}"`);
				const urlRoot = await StorageUtil.pGet(`HOMEBREW_CUSTOM_REPO_URL`);
				const brewUrl = DataUtil.brew.getFileUrl(brewIndex[value], urlRoot);
				await BrewUtil.pDoHandleBrewJson((await DataUtil.loadJSON(brewUrl)), UrlUtil.getCurrentPage());
				return brewUrl;
			}
			case "spellFluff": {
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/spells/fluff-index.json`);
				if (!index[value]) throw new Error(`Spell fluff index did not contain source "${value}"`);
				return `${Renderer.get().baseUrl}data/spells/${index[value]}`;
			}
			// case "item":
			// case "itemFluff":
			case "background":
				return `${Renderer.get().baseUrl}data/backgrounds.json`;
			// case "ancestry":
			case "raceFluff":
				return `${Renderer.get().baseUrl}data/fluff-races.json`;
			// case "deity":
			default:
				throw new Error(`Could not get loadable URL for \`${JSON.stringify({ key, value })}\``);
		}
	},

	generic: {
		_walker_replaceTxt: null,

		/**
		 * @param uid
		 * @param tag
		 * @param [opts]
		 * @param [opts.isLower] If the returned values should be lowercase.
		 */
		unpackUid (uid, tag, opts) {
			opts = opts || {};
			if (opts.isLower) uid = uid.toLowerCase();
			let [name, source, displayText, ...others] = uid.split("|").map(it => it.trim());

			source = Parser.getTagSource(tag, source);
			if (opts.isLower) source = source.toLowerCase();

			return {
				name,
				source,
				displayText,
				others,
			};
		},

		async _pMergeCopy (impl, page, entryList, entry, options) {
			if (entry._copy) {
				const hash = UrlUtil.URL_TO_HASH_BUILDER[page](entry._copy);
				const it = impl._mergeCache[hash] || DataUtil.generic._pMergeCopy_search(impl, page, entryList, entry, options);
				if (!it) return;
				// Handle recursive copy
				if (it._copy) await DataUtil.generic._pMergeCopy(impl, page, entryList, it, options);
				return DataUtil.generic._pApplyCopy(impl, MiscUtil.copy(it), entry, options);
			}
		},

		_pMergeCopy_search (impl, page, entryList, entry, options) {
			const entryHash = UrlUtil.URL_TO_HASH_BUILDER[page](entry._copy);
			return entryList.find(it => {
				const hash = UrlUtil.URL_TO_HASH_BUILDER[page](it);
				impl._mergeCache[hash] = it;
				return hash === entryHash;
			});
		},

		async _pApplyCopy (impl, copyFrom, copyTo, options = {}) {
			if (options.doKeepCopy) copyTo.__copy = MiscUtil.copy(copyFrom);

			// convert everything to arrays
			function normaliseMods (obj) {
				Object.entries(obj._mod).forEach(([k, v]) => {
					if (!(v instanceof Array)) obj._mod[k] = [v];
				});
			}

			const copyMeta = copyTo._copy || {};

			if (copyMeta._mod) normaliseMods(copyMeta);

			// copy over required values
			Object.keys(copyFrom).forEach(k => {
				if (copyTo[k] === null) return delete copyTo[k];
				if (copyTo[k] == null) {
					if (impl._MERGE_REQUIRES_PRESERVE[k]) {
						if (copyTo._copy._preserve && copyTo._copy._preserve[k]) copyTo[k] = copyFrom[k];
					} else copyTo[k] = copyFrom[k];
				}
			});

			// mod helpers /////////////////
			// FIXME: Get back to this.
			function getPropertyFromPath (obj, path) {
				return path.split(".").reduce((o, i) => o[i], obj);
			}

			function setPropertyFromPath (obj, setTo, path) {
				const split = path.split(".");
				if (split.length === 1) obj[path] = setTo;
				else {
					const top = split.shift();
					if (!MiscUtil.isObject(obj[top])) obj[top] = {};
					setPropertyFromPath(obj[top], setTo, split.join("."));
				}
			}

			function doEnsureArray (obj, prop) {
				if (!(obj[prop] instanceof Array)) obj[prop] = [obj[prop]];
			}

			function doMod_appendStr (modInfo, prop) {
				if (copyTo[prop]) copyTo[prop] = `${copyTo[prop]}${modInfo.joiner || ""}${modInfo.str}`;
				else copyTo[prop] = modInfo.str;
			}

			function doMod_replaceTxt (modInfo, path) {
				if (!getPropertyFromPath(copyTo, path)) return;

				DataUtil.generic._walker_replaceTxt = DataUtil.generic._walker_replaceTxt || MiscUtil.getWalker();
				const re = new RegExp(modInfo.replace, `g${modInfo.flags || ""}`);
				const handlers = {
					// TODO(Future) may need to have this handle replaces inside _some_ tags
					string: (str) => {
						if (modInfo.replaceTags) return str.replace(re, modInfo.with);
						const split = Renderer.splitByTags(str);
						const len = split.length;
						for (let i = 0; i < len; ++i) {
							if (split[i].startsWith("{@")) continue;
							split[i] = split[i].replace(re, modInfo.with);
						}
						return split.join("");
					},
					object: (obj) => {
						// TODO: Maybe we need to go deeper
						return obj;
					},
				};

				// Handle any pure strings, e.g. `"legendaryHeader"`
				const setTo = getPropertyFromPath(copyTo, path).map(it => {
					if (typeof it !== "string") return it;
					return DataUtil.generic._walker_replaceTxt.walk(it, handlers);
				});
				setPropertyFromPath(copyTo, setTo, path);

				// TODO: This is getting out of hand
				const typesToReplaceIn = ["successDegree", "ability", "affliction", "lvlEffect"];
				getPropertyFromPath(copyTo, path).forEach(it => {
					if (path === "attacks") {
						it.damage = it.damage.replace(re, modInfo.with);
						it.traits = DataUtil.generic._walker_replaceTxt.walk(it.traits, handlers);
					}
					if (it.entries) it.entries = DataUtil.generic._walker_replaceTxt.walk(it.entries, handlers);
					if (it.items) it.items = DataUtil.generic._walker_replaceTxt.walk(it.items, handlers);
					if (typesToReplaceIn.includes(it.type)) {
						Object.keys(it).forEach(key => {
							it[key] = DataUtil.generic._walker_replaceTxt.walk(it[key], handlers)
						});
					}
					if (it.headerEntries) it.headerEntries = DataUtil.generic._walker_replaceTxt.walk(it.headerEntries, handlers);
					if (it.footerEntries) it.footerEntries = DataUtil.generic._walker_replaceTxt.walk(it.footerEntries, handlers);
				});
			}

			function doMod_prependArr (modInfo, prop) {
				doEnsureArray(modInfo, "items");
				copyTo[prop] = copyTo[prop] ? modInfo.items.concat(copyTo[prop]) : modInfo.items
			}

			function doMod_appendArr (modInfo, prop) {
				doEnsureArray(modInfo, "items");
				copyTo[prop] = copyTo[prop] ? copyTo[prop].concat(modInfo.items) : modInfo.items
			}

			function doMod_appendIfNotExistsArr (modInfo, prop) {
				doEnsureArray(modInfo, "items");
				if (!copyTo[prop]) return copyTo[prop] = modInfo.items;
				copyTo[prop] = copyTo[prop].concat(modInfo.items.filter(it => !copyTo[prop].some(x => CollectionUtil.deepEquals(it, x))));
			}

			function doMod_replaceArr (modInfo, prop, isThrow = true) {
				doEnsureArray(modInfo, "items");

				if (!copyTo[prop]) {
					if (isThrow) throw new Error(`Could not find "${prop}" array`);
					return false;
				}

				let ixOld;
				if (modInfo.replace.regex) {
					const re = new RegExp(modInfo.replace.regex, modInfo.replace.flags || "");
					ixOld = copyTo[prop].findIndex(it => it.idName || it.name ? re.test(it.idName || it.name) : typeof it === "string" ? re.test(it) : false);
				} else if (modInfo.replace.index != null) {
					ixOld = modInfo.replace.index;
				} else {
					ixOld = copyTo[prop].findIndex(it => it.idName || it.name ? it.idName || it.name === modInfo.replace : it === modInfo.replace);
				}

				if (~ixOld) {
					copyTo[prop].splice(ixOld, 1, ...modInfo.items);
					return true;
				} else if (isThrow) throw new Error(`Could not find "${prop}" item with name or title "${modInfo.replace}" to replace`);
				return false;
			}

			function doMod_replaceOrAppendArr (modInfo, prop) {
				const didReplace = doMod_replaceArr(modInfo, prop, false);
				if (!didReplace) doMod_appendArr(modInfo, prop);
			}

			function doMod_insertArr (modInfo, path) {
				doEnsureArray(modInfo, "items");
				if (!getPropertyFromPath(copyTo, path)) throw new Error(`Could not find "${path}" array`);
				getPropertyFromPath(copyTo, path).splice(modInfo.index, 0, ...modInfo.items);
			}

			function doMod_removeArr (modInfo, path) {
				if (modInfo.names) {
					doEnsureArray(modInfo, "names");
					modInfo.names.forEach(nameToRemove => {
						const ixOld = getPropertyFromPath(copyTo, path).findIndex(it => it.idName || it.name === nameToRemove);
						if (~ixOld) getPropertyFromPath(copyTo, path).splice(ixOld, 1);
						else {
							if (!modInfo.force) throw new Error(`Could not find "${path}" item with name "${nameToRemove}" to remove`);
						}
					});
				} else if (modInfo.items) {
					doEnsureArray(modInfo, "items");
					modInfo.items.forEach(itemToRemove => {
						const ixOld = getPropertyFromPath(copyTo, path).findIndex(it => it === itemToRemove);
						if (~ixOld) getPropertyFromPath(copyTo, path).splice(ixOld, 1);
						else throw new Error(`Could not find "${path}" item "${itemToRemove}" to remove`);
					});
				} else throw new Error(`One of "names" or "items" must be provided!`)
			}

			function doMod_scalarAddProp (modInfo, prop) {
				function applyTo (k) {
					const out = Number(copyTo[prop][k]) + modInfo.scalar;
					const isString = typeof copyTo[prop][k] === "string";
					copyTo[prop][k] = isString ? `${out >= 0 ? "+" : ""}${out}` : out;
				}

				if (!copyTo[prop]) return;
				if (modInfo.prop === "*") Object.keys(copyTo[prop]).forEach(k => applyTo(k));
				else applyTo(modInfo.prop);
			}

			function doMod_scalarMultProp (modInfo, prop) {
				function applyTo (k) {
					let out = Number(copyTo[prop][k]) * modInfo.scalar;
					if (modInfo.floor) out = Math.floor(out);
					const isString = typeof copyTo[prop][k] === "string";
					copyTo[prop][k] = isString ? `${out >= 0 ? "+" : ""}${out}` : out;
				}

				if (!copyTo[prop]) return;
				if (modInfo.prop === "*") Object.keys(copyTo[prop]).forEach(k => applyTo(k));
				else applyTo(modInfo.prop);
			}

			function doMod (modInfos, ...properties) {
				function handleProp (prop) {
					modInfos.forEach(modInfo => {
						if (typeof modInfo === "string") {
							switch (modInfo) {
								case "remove":
									return delete copyTo[prop];
								default:
									throw new Error(`Unhandled mode: ${modInfo}`);
							}
						} else {
							switch (modInfo.mode) {
								case "appendStr":
									return doMod_appendStr(modInfo, prop);
								case "replaceTxt":
									return doMod_replaceTxt(modInfo, prop);
								case "prependArr":
									return doMod_prependArr(modInfo, prop);
								case "appendArr":
									return doMod_appendArr(modInfo, prop);
								case "replaceArr":
									return doMod_replaceArr(modInfo, prop);
								case "replaceOrAppendArr":
									return doMod_replaceOrAppendArr(modInfo, prop);
								case "appendIfNotExistsArr":
									return doMod_appendIfNotExistsArr(modInfo, prop);
								case "insertArr":
									return doMod_insertArr(modInfo, prop);
								case "removeArr":
									return doMod_removeArr(modInfo, prop);
								case "scalarAddProp":
									return doMod_scalarAddProp(modInfo, prop);
								case "scalarMultProp":
									return doMod_scalarMultProp(modInfo, prop);
								default:
									throw new Error(`Unhandled mode: ${modInfo.mode}`);
							}
						}
					});
				}

				properties.forEach(prop => handleProp(prop));
				// special case for "no property" modifications, i.e. underscore-key'd
				if (!properties.length) handleProp();
			}

			// apply mods
			if (copyMeta._mod) {
				// pre-convert any dynamic text
				Object.entries(copyMeta._mod).forEach(([k, v]) => {
					copyMeta._mod[k] = JSON.parse(
						JSON.stringify(v)
							.replace(/<\$([^$]+)\$>/g, (...m) => {
								const parts = m[1].split("__");

								switch (parts[0]) {
									case "name":
										return copyTo.name;
									default:
										return m[0];
								}
							}),
					);
				});

				Object.entries(copyMeta._mod).forEach(([path, modInfos]) => {
					if (path === "*") doMod(modInfos, "attacks", "abilities.top", "abilities.mid", "abilities.bot");
					else if (path === "_") doMod(modInfos);
					else if (path === "entriesMode") {
						/* do nothing */
					} else doMod(modInfos, path);
				});
			}

			// add filter tag
			copyTo._isCopy = true;

			// cleanup
			delete copyTo._copy;
		},
	},

	trait: {
		loadJSON: async function () {
			return DataUtil.loadJSON(`${Renderer.get().baseUrl}data/traits.json`);
		},
	},

	feat: {
		_loadedJson: null,
		_pLoadingJson: null,

		async loadJSON () {
			if (DataUtil.feat._loadedJson) return DataUtil.feat._loadedJson;
			DataUtil.feat._pLoadingJson = (async () => {
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/feats/index.json`);
				const allData = await Promise.all(Object.values(index).map(file => DataUtil.loadJSON(`${Renderer.get().baseUrl}data/feats/${file}`)));
				DataUtil.feat._loadedJson = {
					feat: allData.map(it => it.feat || []).flat(),
				}
			})();
			await DataUtil.feat._pLoadingJson;

			return DataUtil.feat._loadedJson;
		},
	},

	ritual: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		async pMergeCopy (ritualList, ritual, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.ritual, UrlUtil.PG_RITUALS, ritualList, ritual, options);
		},

		loadJSON: async function () {
			return DataUtil.loadJSON(`${Renderer.get().baseUrl}data/rituals.json`);
		},
	},

	optionalfeature: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		async pMergeCopy (optionalFeatureList, optionalfeature, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.optionalfeature, UrlUtil.PG_OPTIONAL_FEATURES, optionalFeatureList, optionalfeature, options);
		},

		loadJSON: async function () {
			return DataUtil.loadJSON(`${Renderer.get().baseUrl}data/optionalfeatures.json`);
		},
	},

	creature: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		async pMergeCopy (crList, cr, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.creature, UrlUtil.PG_BESTIARY, crList, cr, options);
		},

		async pLoadAll () {
			const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/bestiary/index.json`);
			const allData = await Promise.all(Object.entries(index).map(async ([source, file]) => {
				const data = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/bestiary/${file}`);
				return data.creature.filter(it => it.source === source);
			}));
			return allData.flat();
		},

	},

	creatureFluff: {
		_MERGE_REQUIRES_PRESERVE: {},
		_mergeCache: {},
		async pMergeCopy (crFlfList, crFlf, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.creatureFluff, UrlUtil.PG_BESTIARY, crFlfList, crFlf, options);
		},
	},

	spell: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		async pMergeCopy (spellList, spell, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.spell, UrlUtil.PG_SPELLS, spellList, spell, options);
		},

		async pLoadAll () {
			const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/spells/index.json`);
			const allData = await Promise.all(Object.entries(index).map(async ([source, file]) => {
				const data = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/spells/${file}`);
				return data.spell.filter(it => it.source === source);
			}));
			return allData.flat();
		},
	},

	spellFluff: {
		_MERGE_REQUIRES_PRESERVE: {},
		_mergeCache: {},
		async pMergeCopy (spellFlfList, spellFlf, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.spellFluff, UrlUtil.PG_SPELLS, spellFlfList, spellFlf, options);
		},
	},

	item: {
		_MERGE_REQUIRES_PRESERVE: {
		},
		_mergeCache: {},
		_loadedJson: null,
		_pLoadingJson: null,
		async pMergeCopy (itemList, item, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.item, UrlUtil.PG_ITEMS, itemList, item, options);
		},

		async loadJSON () {
			if (DataUtil.item._loadedJson) return DataUtil.item._loadedJson;
			DataUtil.item._pLoadingJson = (async () => {
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/items/index.json`);
				const files = ["baseitems.json", ...Object.values(index)];
				const allData = await Promise.all(files.map(file => DataUtil.loadJSON(`${Renderer.get().baseUrl}data/items/${file}`)));
				const expanded = await Promise.all(allData.map(it => it.item || []).flat().map(it => DataUtil.item.expandVariants(it)));
				DataUtil.item._loadedJson = {
					item: expanded.flat(),
					baseitem: allData.map(it => it.baseitem || []).flat(),
				}
			})();
			await DataUtil.item._pLoadingJson;

			return DataUtil.item._loadedJson;
		},

		async expandVariants (item) {
			if (!item.variants) return [item];
			const expanded = await Promise.all(item.variants.filter(x => { if (x.exists !== true) return x }).map(v => DataUtil.item._expandVariant(item, v)));
			return [item, ...expanded];
		},

		async _expandVariant (generic, variant) {
			variant = MiscUtil.copy(variant);
			variant._copy = variant._copy || {};
			variant._copy._mod = MiscUtil.merge(generic._vmod, variant._mod, variant._copy._mod);
			const entriesMode = variant._copy._mod.entriesMode || "concat";
			if (entriesMode === "concat") {
				variant.entries = MiscUtil.copy([...generic.entries, ...variant.entries || []]);
			} else if (entriesMode === "generic") {
				variant.entries = MiscUtil.copy([...generic.entries]);
			} else if (entriesMode === "variant") {
				variant.entries = MiscUtil.copy([...variant.entries]);
			}
			// FIXME:
			if (!variant.name) {
                const gName = generic.name.toLowerCase();
                const vName = variant.variantType.toLowerCase();
				if (!generic.name.toLowerCase().includes(variant.variantType.toLowerCase()) && !variant.variantType.toLowerCase().includes(generic.name.toLowerCase())) {
					variant.name = `${generic.name} (${variant.variantType})`.toTitleCase();
				} else if(vName.includes(gName) && !gName.includes(vName)) {
                    variant.name = `${gName} (${vName.replace(gName,'').trim()})`.toTitleCase();
                } else {
					variant.name = variant.variantType.toTitleCase();
				}
			}
			variant.type = generic.type || "Item";
			variant.generic = "V";
			variant.genericItem = `${generic.name} (generic)${generic.source.toLowerCase() !== "crb" ? `|${generic.source}` : "||"}${generic.name}`;
			await DataUtil.generic._pApplyCopy(DataUtil.item, generic, variant, {});
			delete variant.variants;
			return variant;
		},
	},

	runeItem: {
		unpackUid (uid) {
			const splits = uid.split("|").map(it => it.trim());
			const source = splits[1];
			let displayText;
			let name;
			if (splits.length % 2) displayText = splits.pop();
			splits.push(splits.shift());
			name = displayText || splits.filter((x, i) => i % 2 === 1).map(it => Renderer.runeItem.getRuneShortName(it)).join(" ");
			const hashes = Renderer.runeItem.getHashesFromTag(uid);
			return { hashes, displayText, name, source }
		},
	},

	itemFluff: {
		_MERGE_REQUIRES_PRESERVE: {},
		_mergeCache: {},
		async pMergeCopy (itemFlfList, itemFlf, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.itemFluff, UrlUtil.PG_ITEMS, itemFlfList, itemFlf, options);
		},
	},

	background: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		_loadedJson: null,
		_pLoadingJson: null,

		async loadJSON () {
			if (DataUtil.background._loadedJson) return DataUtil.background._loadedJson;
			DataUtil.background._pLoadingJson = (async () => {
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/backgrounds/index.json`);
				const allData = await Promise.all(Object.values(index).map(file => DataUtil.loadJSON(`${Renderer.get().baseUrl}data/backgrounds/${file}`)));
				DataUtil.background._loadedJson = {
					background: allData.map(it => it.background || []).flat(),
				}
			})();
			await DataUtil.background._pLoadingJson;

			return DataUtil.background._loadedJson;
		},
		async pMergeCopy (bgList, bg, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.background, UrlUtil.PG_BACKGROUNDS, bgList, bg, options);
		},
	},

	ancestry: {
		_pLoadingJson: null,
		_loadedJson: null,
		async loadJSON () {
			if (DataUtil.ancestry._loadedJson) return DataUtil.ancestry._loadedJson;
			DataUtil.ancestry._pLoadingJson = (async () => {
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/ancestries/index.json`);
				const allData = await Promise.all(Object.values(index).map(it => DataUtil.loadJSON(`${Renderer.get().baseUrl}data/ancestries/${it}`)));
				DataUtil.ancestry._loadedJson = {
					ancestry: allData.map(it => it.ancestry || []).flat(),
					versatileHeritage: allData.map(it => it.versatileHeritage || []).flat(),
				};
			})();
			await DataUtil.ancestry._pLoadingJson;

			return DataUtil.ancestry._loadedJson;
		},
	},

	ancestryFluff: {
		_MERGE_REQUIRES_PRESERVE: {},
		_mergeCache: {},
		async pMergeCopy (ancFlfList, ancFlf, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.ancestryFluff, UrlUtil.PG_ANCESTRIES, ancFlfList, ancFlf, options);
		},
	},

	class: {
		_pLoadingJson: null,
		_pLoadingRawJson: null,
		_loadedJson: null,
		_loadedRawJson: null,
		async loadJSON () {
			if (DataUtil.class._loadedJson) return DataUtil.class._loadedJson;

			DataUtil.class._pLoadingJson = (async () => {
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/class/index.json`);
				const allData = await Promise.all(Object.values(index).map(it => DataUtil.loadJSON(`${Renderer.get().baseUrl}data/class/${it}`)));

				const allDereferencedData = await Promise.all(allData.map(json => Promise.all((json.class || []).map(cls => DataUtil.class.pGetDereferencedClassData(cls)))));
				DataUtil.class._loadedJson = { class: allDereferencedData.flat() };
			})();
			await DataUtil.class._pLoadingJson;

			return DataUtil.class._loadedJson;
		},

		async loadRawJSON () {
			if (DataUtil.class._loadedRawJson) return DataUtil.class._loadedRawJson;

			DataUtil.class._pLoadingRawJson = (async () => {
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/class/index.json`);
				const allData = await Promise.all(Object.values(index).map(it => DataUtil.loadJSON(`${Renderer.get().baseUrl}data/class/${it}`)));

				DataUtil.class._loadedRawJson = {
					class: allData.map(it => it.class || []).flat(),
					classFeature: allData.map(it => it.classFeature || []).flat(),
					subclassFeature: allData.map(it => it.subclassFeature || []).flat(),
				};
			})();
			await DataUtil.class._pLoadingRawJson;

			return DataUtil.class._loadedRawJson;
		},

		/**
		 * @param uid
		 * @param [opts]
		 * @param [opts.isLower] If the returned values should be lowercase.
		 */
		unpackUidClassFeature (uid, opts) {
			opts = opts || {};
			if (opts.isLower) uid = uid.toLowerCase();
			let [name, className, classSource, level, source, displayText] = uid.split("|").map(it => it.trim());
			classSource = classSource || (opts.isLower ? SRC_CRB.toLowerCase() : SRC_CRB);
			source = source || classSource;
			level = Number(level)
			return {
				name,
				className,
				classSource,
				level,
				source,
				displayText,
			};
		},

		/**
		 * @param uid
		 * @param [opts]
		 * @param [opts.isLower] If the returned values should be lowercase.
		 */
		unpackUidSubclassFeature (uid, opts) {
			opts = opts || {};
			if (opts.isLower) uid = uid.toLowerCase();
			let [name, className, classSource, subclassShortName, subclassSource, level, source, displayText] = uid.split("|").map(it => it.trim());
			classSource = classSource || (opts.isLower ? SRC_CRB.toLowerCase() : SRC_CRB);
			subclassSource = subclassSource || (opts.isLower ? SRC_CRB.toLowerCase() : SRC_CRB);
			source = source || subclassSource;
			level = Number(level)
			return {
				name,
				className,
				classSource,
				subclassShortName,
				subclassSource,
				level,
				source,
				displayText,
			};
		},

		_mutEntryNestLevel (feature) {
			const depth = (feature.header == null ? 1 : feature.header) - 1;
			for (let i = 0; i < depth; ++i) {
				const nxt = MiscUtil.copy(feature);
				feature.entries = [nxt];
				delete feature.name;
				delete feature.page;
				delete feature.source;
			}
		},

		async pGetDereferencedClassData (cls) {
			if (cls.classFeatures && cls.classFeatures.every(it => typeof it !== "string" && !it.classFeature)) return cls;

			cls = MiscUtil.copy(cls);

			const byLevel = {}; // Build a map of `level: [classFeature]`
			for (const classFeatureRef of (cls.classFeatures || [])) {
				const uid = classFeatureRef.classFeature ? classFeatureRef.classFeature : classFeatureRef;
				const { name, className, classSource, level, source } = DataUtil.class.unpackUidClassFeature(uid);
				if (!name || !className || !level || isNaN(level)) continue; // skip over broken links

				const hash = UrlUtil.URL_TO_HASH_BUILDER["classFeature"]({ name, className, classSource, level, source });

				// Skip blacklisted
				if (ExcludeUtil.isInitialised && ExcludeUtil.isExcluded(hash, "classFeature", source, { isNoCount: true })) continue;

				const classFeature = await Renderer.hover.pCacheAndGet("classFeature", source, hash, { isCopy: true });
				// skip over missing links
				if (!classFeature) {
					JqueryUtil.doToast({
						type: "danger",
						content: `Failed to find <code>classFeature</code> <code>${uid}</code>`,
					});
					continue;
				}

				if (classFeatureRef.gainSubclassFeature) classFeature.gainSubclassFeature = true;
				// Remove sources to avoid colouring e.g. entire UA classes with the "spicy green" styling
				if (classFeature.source === cls.source && SourceUtil.isNonstandardSource(classFeature.source)) delete classFeature.source;

				DataUtil.class._mutEntryNestLevel(classFeature);

				const key = `${classFeature.level || 1}`;
				(byLevel[key] = byLevel[key] || []).push(classFeature);
			}

			const outClassFeatures = [];
			const maxLevel = Math.max(...Object.keys(byLevel).map(it => Number(it)));
			for (let i = 1; i <= maxLevel; ++i) {
				outClassFeatures[i - 1] = byLevel[i] || [];
			}
			cls.classFeatures = outClassFeatures;

			if (cls.subclasses) {
				const outSubclasses = [];
				for (const sc of cls.subclasses) {
					outSubclasses.push(await DataUtil.class.pGetDereferencedSubclassData(sc));
				}
				cls.subclasses = outSubclasses;
			}

			return cls;
		},

		async pGetDereferencedSubclassData (sc) {
			if (sc.subclassFeatures && sc.subclassFeatures.every(it => typeof it !== "string" && !it.subclassFeature)) return sc;

			sc = MiscUtil.copy(sc);

			const byLevel = {}; // Build a map of `level: [subclassFeature]`

			for (const subclassFeatureRef of (sc.subclassFeatures || [])) {
				const uid = subclassFeatureRef.subclassFeature ? subclassFeatureRef.subclassFeature : subclassFeatureRef;
				const {
					name,
					className,
					classSource,
					subclassShortName,
					subclassSource,
					level,
					source,
				} = DataUtil.class.unpackUidSubclassFeature(uid);
				if (!name || !className || !subclassShortName || !level || isNaN(level)) continue; // skip over broken links
				const hash = UrlUtil.URL_TO_HASH_BUILDER["subclassFeature"]({
					name,
					className,
					classSource,
					subclassShortName,
					subclassSource,
					level,
					source,
				});

				// Skip blacklisted
				if (ExcludeUtil.isInitialised && ExcludeUtil.isExcluded(hash, "subclassFeature", source, { isNoCount: true })) continue;

				const subclassFeature = await Renderer.hover.pCacheAndGet("subclassFeature", source, hash, { isCopy: true });
				// skip over missing links
				if (!subclassFeature) {
					JqueryUtil.doToast({
						type: "danger",
						content: `Failed to find <code>subclassFeature</code> <code>${uid}</code>`,
					});
					continue;
				}

				// Remove sources to avoid colouring e.g. entire UA classes with the "spicy green" styling
				if (subclassFeature.source === sc.source && SourceUtil.isNonstandardSource(subclassFeature.source)) delete subclassFeature.source;

				DataUtil.class._mutEntryNestLevel(subclassFeature);

				const key = `${subclassFeature.level || 1}`;
				(byLevel[key] = byLevel[key] || []).push(subclassFeature);
			}

			sc.subclassFeatures = Object.keys(byLevel)
				.map(it => Number(it))
				.sort(SortUtil.ascSort)
				.map(k => byLevel[k]);

			return sc;
		},
	},

	deity: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		async pMergeCopy (deityList, deity, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.deity, UrlUtil.PG_DEITIES, deityList, deity, options);
		},

		loadJSON: async function () {
			return DataUtil.loadJSON(`${Renderer.get().baseUrl}data/deities.json`);
		},
	},

	deityFluff: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		async pMergeCopy (deityFlfList, deityFlf, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.deityFluff, UrlUtil.PG_DEITIES, deityFlfList, deityFlf, options);
		},
	},

	organization: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		async pMergeCopy (organizationList, organization, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.organization, UrlUtil.PG_ORGANIZATIONS, organizationList, organization, options);
		},

		loadJSON: async function () {
			return DataUtil.loadJSON(`${Renderer.get().baseUrl}data/organizations.json`);
		},
	},

	organizationFluff: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		async pMergeCopy (organizationFlfList, organizationFlf, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.organizationFluff, UrlUtil.PG_ORGANIZATIONS, organizationFlfList, organizationFlf, options);
		},
	},

	creatureTemplate: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		async pMergeCopy (creatureTemplateList, creatureTemplate, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.creatureTemplate, UrlUtil.PG_ORGANIZATIONS, creatureTemplateList, creatureTemplate, options);
		},

		loadJSON: async function () {
			return DataUtil.loadJSON(`${Renderer.get().baseUrl}data/creaturetemplates.json`);
		},
	},

	creatureTemplateFluff: {
		_MERGE_REQUIRES_PRESERVE: {
			page: true,
			otherSources: true,
		},
		_mergeCache: {},
		async pMergeCopy (creatureTemplateFlfList, creatureTemplateFlf, options) {
			return DataUtil.generic._pMergeCopy(DataUtil.creatureTemplateFluff, UrlUtil.PG_ORGANIZATIONS, creatureTemplateFlfList, creatureTemplateFlf, options);
		},
	},

	brew: {
		_getCleanUrlRoot (urlRoot) {
			if (urlRoot && urlRoot.trim()) {
				urlRoot = urlRoot.trim();
				if (!urlRoot.endsWith("/")) urlRoot = `${urlRoot}/`;
			} else urlRoot = `https://raw.githubusercontent.com/Pf2eTools/homebrew/master/`;
			return urlRoot;
		},

		async pLoadTimestamps (urlRoot) {
			urlRoot = DataUtil.brew._getCleanUrlRoot(urlRoot);
			return DataUtil.loadJSON(`${urlRoot}_generated/index-timestamps.json`);
		},

		async pLoadPropIndex (urlRoot) {
			urlRoot = DataUtil.brew._getCleanUrlRoot(urlRoot);
			return DataUtil.loadJSON(`${urlRoot}_generated/index-props.json`);
		},

		async pLoadSourceIndex (urlRoot) {
			urlRoot = DataUtil.brew._getCleanUrlRoot(urlRoot);
			return DataUtil.loadJSON(`${urlRoot}_generated/index-sources.json`);
		},

		getFileUrl (path, urlRoot) {
			urlRoot = DataUtil.brew._getCleanUrlRoot(urlRoot);
			return `${urlRoot}${path}`;
		},
	},
};

// ROLLING =============================================================================================================
RollerUtil = {
	isCrypto () {
		return typeof window !== "undefined" && typeof window.crypto !== "undefined";
	},

	randomise (max, min = 1) {
		if (min > max) return 0;
		if (max === min) return max;
		if (RollerUtil.isCrypto()) {
			return RollerUtil._randomise(min, max + 1);
		} else {
			return RollerUtil.roll(max) + min;
		}
	},

	rollOnArray (array) {
		return array[RollerUtil.randomise(array.length) - 1]
	},

	/**
	 * Cryptographically secure RNG
	 */
	_randomise: (min, max) => {
		const range = max - min;
		const bytesNeeded = Math.ceil(Math.log2(range) / 8);
		const randomBytes = new Uint8Array(bytesNeeded);
		const maximumRange = (2 ** 8) ** bytesNeeded;
		const extendedRange = Math.floor(maximumRange / range) * range;
		let i;
		let randomInteger;
		while (true) {
			window.crypto.getRandomValues(randomBytes);
			randomInteger = 0;
			for (i = 0; i < bytesNeeded; i++) {
				randomInteger <<= 8;
				randomInteger += randomBytes[i];
			}
			if (randomInteger < extendedRange) {
				randomInteger %= range;
				return min + randomInteger;
			}
		}
	},

	/**
	 * Result in range: 0 to (max-1); inclusive
	 * e.g. roll(20) gives results ranging from 0 to 19
	 * @param max range max (exclusive)
	 * @param fn funciton to call to generate random numbers
	 * @returns {number} rolled
	 */
	roll (max, fn = Math.random) {
		return Math.floor(fn() * max);
	},

	addListRollButton (isCompact, ids, rollX) {
		ids = ids || { roll: "feelinglucky", reset: "reset", search: "filter-search-group" }
		const $btnRoll = $(`<button class="btn btn-xs btn-default ${isCompact ? "px-2" : ""}" id="${ids.roll}" title="Feeling Lucky?"><span class="glyphicon glyphicon-random"></span></button>`);
		$btnRoll.on("click", () => {
			const primaryLists = ListUtil.getPrimaryLists();
			if (primaryLists && primaryLists.length) {
				const allLists = primaryLists.filter(l => l.visibleItems.length);
				if (allLists.length) {
					if (rollX == null) rollX = RollerUtil.roll(allLists.length);
					const list = allLists[rollX];
					const rollY = RollerUtil.roll(list.visibleItems.length);
					window.location.hash = $(list.visibleItems[rollY].ele).find(`a`).prop("hash");
				}
			}
		});

		$(`#${ids.search}`).find(`#${ids.reset}`).before($btnRoll);
	},

	getColRollType (colLabel) {
		if (typeof colLabel !== "string") return false;
		if (/^{@dice [^}]+}$/.test(colLabel.trim())) return true;
		colLabel = Renderer.stripTags(colLabel);

		if (Renderer.dice.lang.getTree3(colLabel)) return RollerUtil.ROLL_COL_STANDARD;

		// Remove trailing variables, if they exist
		colLabel = colLabel.replace(RollerUtil._REGEX_ROLLABLE_COL_LABEL, "$1");
		if (Renderer.dice.lang.getTree3(colLabel)) return RollerUtil.ROLL_COL_VARIABLE;

		return 0;
	},

	getFullRollCol (lbl) {
		if (lbl.includes("@dice")) return lbl;

		if (Renderer.dice.lang.getTree3(lbl)) return `{@dice ${lbl}}`;

		// Try to split off any trailing variables, e.g. `d100 + Level` -> `d100`, `Level`
		const m = RollerUtil._REGEX_ROLLABLE_COL_LABEL.exec(lbl);
		if (!m) return lbl;

		return `{@dice ${m[1]}${m[2]}#$prompt_number:title=Enter a ${m[3].trim()}$#|${lbl}}`;
	},

	_DICE_REGEX_STR: "((([1-9]\\d*)?d([1-9]\\d*)(\\s*?[-+×x*÷/]\\s*?(\\d,\\d|\\d)+(\\.\\d+)?)?))+?",
};
RollerUtil.DICE_REGEX = new RegExp(RollerUtil._DICE_REGEX_STR, "g");
RollerUtil.REGEX_DAMAGE_DICE = /(\d+)( \((?:{@dice |{@damage ))([-+0-9d ]*)(}\) [a-z]+( \([-a-zA-Z0-9 ]+\))?( or [a-z]+( \([-a-zA-Z0-9 ]+\))?)? damage)/gi;
RollerUtil._REGEX_ROLLABLE_COL_LABEL = /^(.*?\d)(\s*[-+/*^×÷]\s*)([a-zA-Z0-9 ]+)$/;
RollerUtil.ROLL_COL_NONE = 0;
RollerUtil.ROLL_COL_STANDARD = 1;
RollerUtil.ROLL_COL_VARIABLE = 2;

// STORAGE =============================================================================================================
// Dependency: localforage
StorageUtil = {
	_init: false,
	_initAsync: false,
	_fakeStorage: {},
	_fakeStorageAsync: {},

	_getSyncStorage () {
		if (StorageUtil._init) {
			if (StorageUtil.__fakeStorage) return StorageUtil._fakeStorage;
			else return window.localStorage;
		}

		StorageUtil._init = true;
		try {
			window.localStorage.setItem("_test_storage", true);
			return window.localStorage;
		} catch (e) {
			// if the user has disabled cookies, build a fake version
			StorageUtil.__fakeStorage = true;
			StorageUtil._fakeStorage = {
				isSyncFake: true,
				getItem: k => StorageUtil.__fakeStorage[k],
				removeItem: k => delete StorageUtil.__fakeStorage[k],
				setItem: (k, v) => StorageUtil.__fakeStorage[k] = v,
			};
			return StorageUtil._fakeStorage;
		}
	},

	async _getAsyncStorage () {
		if (StorageUtil._initAsync) {
			if (StorageUtil.__fakeStorageAsync) return StorageUtil._fakeStorageAsync;
			else return localforage;
		}

		const getInitFakeStorage = () => {
			StorageUtil.__fakeStorageAsync = {};
			StorageUtil._fakeStorageAsync = {
				pIsAsyncFake: true,
				async setItem (k, v) {
					StorageUtil.__fakeStorageAsync[k] = v;
				},
				async getItem (k) {
					return StorageUtil.__fakeStorageAsync[k];
				},
				async removeItem (k) {
					delete StorageUtil.__fakeStorageAsync[k];
				},
			};
			return StorageUtil._fakeStorageAsync;
		};

		if (typeof window !== "undefined") {
			try {
				// check if IndexedDB is available (i.e. not in Firefox private browsing)
				await new Promise((resolve, reject) => {
					const request = window.indexedDB.open("_test_db", 1);
					request.onerror = reject;
					request.onsuccess = resolve;
				});
				await localforage.setItem("_storage_check", true);
				return localforage;
			} catch (e) {
				return getInitFakeStorage();
			} finally {
				StorageUtil._initAsync = true;
			}
		} else return getInitFakeStorage();
	},

	// region Synchronous
	syncGet (key) {
		const rawOut = StorageUtil._getSyncStorage().getItem(key);
		if (rawOut && rawOut !== "undefined" && rawOut !== "null") return JSON.parse(rawOut);
		return null;
	},

	syncSet (key, value) {
		StorageUtil._getSyncStorage().setItem(key, JSON.stringify(value));
		StorageUtil._syncTrackKey(key)
	},

	syncRemove (key) {
		StorageUtil._getSyncStorage().removeItem(key);
		StorageUtil._syncTrackKey(key, true);
	},

	syncGetForPage (key) {
		return StorageUtil.syncGet(`${key}_${UrlUtil.getCurrentPage()}`);
	},
	syncSetForPage (key, value) {
		StorageUtil.syncSet(`${key}_${UrlUtil.getCurrentPage()}`, value);
	},

	isSyncFake () {
		return !!StorageUtil._getSyncStorage().isSyncFake
	},

	_syncTrackKey (key, isRemove) {
		const meta = StorageUtil.syncGet(StorageUtil._META_KEY) || {};
		if (isRemove) delete meta[key];
		else meta[key] = 1;
		StorageUtil._getSyncStorage().setItem(StorageUtil._META_KEY, JSON.stringify(meta));
	},

	syncGetDump () {
		const out = {};
		const meta = StorageUtil.syncGet(StorageUtil._META_KEY) || {};
		Object.entries(meta).filter(([key, isPresent]) => isPresent).forEach(([key]) => out[key] = StorageUtil.syncGet(key));
		return out;
	},

	syncSetFromDump (dump) {
		Object.entries(dump).forEach(([k, v]) => StorageUtil.syncSet(k, v));
	},
	// endregion

	// region Asynchronous
	async pIsAsyncFake () {
		const storage = await StorageUtil._getAsyncStorage();
		return !!storage.pIsAsyncFake;
	},

	async pSet (key, value) {
		StorageUtil._pTrackKey(key);
		const storage = await StorageUtil._getAsyncStorage();
		return storage.setItem(key, value);
	},

	async pGet (key) {
		const storage = await StorageUtil._getAsyncStorage();
		return storage.getItem(key);
	},

	async pRemove (key) {
		StorageUtil._pTrackKey(key, true);
		const storage = await StorageUtil._getAsyncStorage();
		return storage.removeItem(key);
	},

	getPageKey (key, page) {
		return `${key}_${page || UrlUtil.getCurrentPage()}`;
	},
	async pGetForPage (key) {
		return StorageUtil.pGet(StorageUtil.getPageKey(key));
	},
	async pSetForPage (key, value) {
		return StorageUtil.pSet(StorageUtil.getPageKey(key), value);
	},
	async pRemoveForPage (key) {
		return StorageUtil.pRemove(StorageUtil.getPageKey(key));
	},

	async _pTrackKey (key, isRemove) {
		const storage = await StorageUtil._getAsyncStorage();
		const meta = (await StorageUtil.pGet(StorageUtil._META_KEY)) || {};
		if (isRemove) delete meta[key];
		else meta[key] = 1;
		return storage.setItem(StorageUtil._META_KEY, meta);
	},

	async pGetDump () {
		const out = {};
		const meta = (await StorageUtil.pGet(StorageUtil._META_KEY)) || {};
		await Promise.all(Object.entries(meta).filter(([key, isPresent]) => isPresent).map(async ([key]) => out[key] = await StorageUtil.pGet(key)));
		return out;
	},

	async pSetFromDump (dump) {
		return Promise.all(Object.entries(dump).map(([k, v]) => StorageUtil.pSet(k, v)));
	},
	// endregion
};
StorageUtil._META_KEY = "_STORAGE_META_STORAGE";

// TODO transition cookie-like storage items over to this
SessionStorageUtil = {
	_fakeStorage: {},
	__storage: null,
	getStorage: () => {
		try {
			return window.sessionStorage;
		} catch (e) {
			// if the user has disabled cookies, build a fake version
			if (SessionStorageUtil.__storage) return SessionStorageUtil.__storage;
			else {
				return SessionStorageUtil.__storage = {
					isFake: true,
					getItem: (k) => {
						return SessionStorageUtil._fakeStorage[k];
					},
					removeItem: (k) => {
						delete SessionStorageUtil._fakeStorage[k];
					},
					setItem: (k, v) => {
						SessionStorageUtil._fakeStorage[k] = v;
					},
				};
			}
		}
	},

	isFake () {
		return SessionStorageUtil.getStorage().isSyncFake
	},

	setForPage: (key, value) => {
		SessionStorageUtil.set(`${key}_${UrlUtil.getCurrentPage()}`, value);
	},

	set (key, value) {
		SessionStorageUtil.getStorage().setItem(key, JSON.stringify(value));
	},

	getForPage: (key) => {
		return SessionStorageUtil.get(`${key}_${UrlUtil.getCurrentPage()}`);
	},

	get (key) {
		const rawOut = SessionStorageUtil.getStorage().getItem(key);
		if (rawOut && rawOut !== "undefined" && rawOut !== "null") return JSON.parse(rawOut);
		return null;
	},

	removeForPage: (key) => {
		SessionStorageUtil.remove(`${key}_${UrlUtil.getCurrentPage()}`)
	},

	remove (key) {
		SessionStorageUtil.getStorage().removeItem(key);
	},
};

// HOMEBREW ============================================================================================================
BrewUtil = {
	_PAGE: null, // Allow the current page to be forcibly specified externally

	homebrew: null,
	homebrewMeta: null,
	_lists: null,
	_sourceCache: null,
	_filterBoxes: null,
	_sourceFilters: null,
	_pHandleBrew: null,
	_lockHandleBrewJson: null,

	/**
	 * @param options Options object.
	 * @param [options.list] List.
	 * @param [options.lists] Lists.
	 * @param [options.filterBox] Filter box.
	 * @param [options.filterBoxes] Filter boxes.
	 * @param [options.sourceFilter] Source filter.
	 * @param [options.sourceFilters] Source filters.
	 * @param [options.pHandleBrew] Brew handling function.
	 */
	bind (options) {
		// provide ref to List.js instance
		if (options.list) BrewUtil._lists = [options.list];
		else if (options.lists) BrewUtil._lists = options.lists;
		// provide ref to FilterBox and Filter instance
		if (options.filterBox) BrewUtil._filterBoxes = [options.filterBox];
		else if (options.filterBoxes) BrewUtil._filterBoxes = options.filterBoxes;
		if (options.sourceFilter) BrewUtil._sourceFilters = [options.sourceFilter];
		else if (options.sourceFilters) BrewUtil._sourceFilters = options.sourceFilters;
		// allow external source for handleBrew
		if (options.pHandleBrew !== undefined) this._pHandleBrew = options.pHandleBrew;
	},

	async pAddBrewData () {
		if (BrewUtil.homebrew) {
			return BrewUtil.homebrew;
		} else {
			try {
				const homebrew = await StorageUtil.pGet(VeCt.STORAGE_HOMEBREW) || {};
				BrewUtil.homebrewMeta = StorageUtil.syncGet(VeCt.STORAGE_HOMEBREW_META) || { sources: [] };
				BrewUtil.homebrewMeta.sources = BrewUtil.homebrewMeta.sources || [];

				BrewUtil.homebrew = homebrew;

				BrewUtil._resetSourceCache();

				return BrewUtil.homebrew;
			} catch (e) {
				BrewUtil.pPurgeBrew(e);
			}
		}
	},

	async pPurgeBrew (error) {
		JqueryUtil.doToast({
			content: "Error when loading homebrew! Purged homebrew data. (See the log for more information.)",
			type: "danger",
		});
		await StorageUtil.pRemove(VeCt.STORAGE_HOMEBREW);
		StorageUtil.syncRemove(VeCt.STORAGE_HOMEBREW_META);
		BrewUtil.homebrew = null;
		window.location.hash = "";
		BrewUtil.homebrew = {};
		BrewUtil.homebrewMeta = { sources: [] };
		if (error) {
			setTimeout(() => {
				throw error;
			});
		}
	},

	async pAddLocalBrewData (callbackFn = async (d, page) => BrewUtil.pDoHandleBrewJson(d, page, null)) {
		if (!IS_VTT && !IS_DEPLOYED) {
			const data = await DataUtil.loadJSON(`${Renderer.get().baseUrl}${VeCt.JSON_HOMEBREW_INDEX}`);
			// auto-load from `homebrew/`, for custom versions of the site
			if (data.toImport.length) {
				const page = BrewUtil._PAGE || UrlUtil.getCurrentPage();
				const allData = await Promise.all(data.toImport.map(it => DataUtil.loadJSON(`homebrew/${it}`)));
				await Promise.all(allData.map(d => callbackFn(d, page)));
			}
		}
	},

	/**
	 * @param $appendTo Parent element
	 * @param [opts] Options object
	 * @param [opts.isModal]
	 * @param [opts.isShowAll]
	 */
	async _pRenderBrewScreen ($appendTo, opts) {
		opts = opts || {};

		const page = BrewUtil._PAGE || UrlUtil.getCurrentPage();

		const $brewList = $(`<div class="manbrew__current_brew flex-col h-100 mt-1"></div>`);

		await BrewUtil._pRenderBrewScreen_pRefreshBrewList($brewList);

		const $iptAdd = $(`<input multiple type="file" accept=".json" style="display: none;">`)
			.change(evt => {
				const input = evt.target;

				let readIndex = 0;
				const reader = new FileReader();
				reader.onload = async () => {
					const json = JSON.parse(reader.result);

					await DataUtil.pDoMetaMerge(CryptUtil.uid(), json);

					await BrewUtil.pDoHandleBrewJson(json, page, BrewUtil._pRenderBrewScreen_pRefreshBrewList.bind(this, $brewList));

					if (input.files[readIndex]) reader.readAsText(input.files[readIndex++]);
					else $(evt.target).val(""); // reset the input
				};
				reader.readAsText(input.files[readIndex++]);
			});

		const $btnLoadFromUrl = $(`<button class="btn btn-default btn-sm mr-2">Load from URL</button>`)
			.click(async () => {
				const enteredUrl = await InputUiUtil.pGetUserString({ title: "Homebrew URL" });
				if (!enteredUrl || !enteredUrl.trim()) return;

				let parsedUrl;
				try {
					parsedUrl = new URL(enteredUrl);
				} catch (e) {
					JqueryUtil.doToast({
						content: `The provided URL does not appear to be valid.`,
						type: "danger",
					});
					return;
				}
				BrewUtil.addBrewRemote(null, parsedUrl.href).catch(err => {
					JqueryUtil.doToast({
						content: "Could not load homebrew from the provided URL.",
						type: "danger",
					});
					setTimeout(() => {
						throw err;
					});
				});
			});

		const $btnGet = $(`<button class="btn btn-info btn-sm">Get Homebrew</button>`)
			.click(() => BrewUtil._pHandleClickBtnGet(opts));

		const $btnCustomUrl = $(`<button class="btn btn-info btn-sm px-2" title="Set Custom Repository URL"><span class="glyphicon glyphicon-cog"></span></button>`)
			.click(async () => {
				const customBrewUtl = await StorageUtil.pGet(`HOMEBREW_CUSTOM_REPO_URL`);

				const nxtUrl = await InputUiUtil.pGetUserString({
					title: "Homebrew Repository URL (Blank for Default)",
					default: customBrewUtl,
				});

				if (nxtUrl == null) await StorageUtil.pRemove(`HOMEBREW_CUSTOM_REPO_URL`);
				else await StorageUtil.pSet(`HOMEBREW_CUSTOM_REPO_URL`, nxtUrl);
			});

		const $btnDelAll = opts.isModal ? null : BrewUtil._$getBtnDeleteAll();

		const $wrpBtns = $$`<div class="flex-vh-center no-shrink mobile__flex-col">
			<div class="flex-v-center mobile__mb-2">
				<div class="flex-v-center btn-group mr-2">
					${$btnGet}
					${$btnCustomUrl}
				</div>
				<label role="button" class="btn btn-default btn-sm mr-2">Upload File${$iptAdd}</label>
				${$btnLoadFromUrl}
			</div>
			<div class="flex-v-center">
				<a href="https://github.com/Pf2eToolsOrg/homebrew" class="flex-v-center" target="_blank" rel="noopener noreferrer"><button class="btn btn-default btn-sm">Browse Source Repository</button></a>
				${$btnDelAll}
				${opts.isModal ? $(`<button class="btn btn-danger btn-sm ml-2">Cancel</button>`).click(() => opts.doClose()) : ""}
			</div>
		</div>`;

		if (opts.isModal) {
			$$($appendTo)`
			${$brewList}
			${$wrpBtns.addClass("mb-2")}`
		} else {
			$$($appendTo)`
			${$wrpBtns.addClass("mb-3")}
			${$brewList}`
		}

		BrewUtil.addBrewRemote = async ($ele, jsonUrl, doUnescape) => {
			let cached;
			if ($ele) {
				cached = $ele.html();
				$ele.text("Loading...");
			}
			if (doUnescape) jsonUrl = jsonUrl.unescapeQuotes();
			const data = await DataUtil.loadJSON(`${jsonUrl}?${(new Date()).getTime()}`);
			await BrewUtil.pDoHandleBrewJson(data, page, BrewUtil._pRenderBrewScreen_pRefreshBrewList.bind(this, $brewList));
			if ($ele) {
				$ele.text("Done!");
				setTimeout(() => $ele.html(cached), VeCt.DUR_INLINE_NOTIFY);
			}
		};
	},

	async _pHandleClickBtnGet (opts) {
		const $btnToggleDisplayNonPageBrews = opts.isModal ? $(`<button class="btn btn-default btn-xs mr-2 ${opts.isShowAll ? "" : "active"}" disabled title="Hides homebrews which do not contain content relevant to this page.">Hide Unrelated</button>`) : null;

		const $btnAll = $(`<button class="btn btn-default btn-xs" disabled title="(Excluding samples)">Add All</button>`);

		const $ulRows = $$`<ul class="list"><li><div class="lst__wrp-cells"><span style="font-style: italic;">Loading...</span></div></li></ul>`;

		const $iptSearch = $(`<input type="search" class="search manbrew__search form-control w-100" placeholder="Find homebrew...">`)
			.keydown(evt => {
				switch (evt.which) {
					case 13: { // enter
						return $ulRows.find(`li`).first().find(`.manbrew__load_from_url`).click()
					}
					case 40: { // down
						const firstItem = list.visibleItems[0];
						if (firstItem) firstItem.ele.focus();
					}
				}
			});

		const { $modalInner, doClose } = UiUtil.getShowModal({
			isHeight100: true,
			title: `Get Homebrew`,
			isUncappedHeight: true,
			isWidth100: true,
			overlayColor: "transparent",
			isHeaderBorder: true,
		});

		const $wrpBtn = $$`<div class="flex-vh-center no-shrink mobile__flex-col">
			${$(`<button class="btn btn-danger btn-sm">Cancel</button>`).click(() => doClose())}
			</div>`;

		$$($modalInner)`
		<div class="mt-1"><i>A list of homebrew available in the public repository. Click a name to load the homebrew, or view the source directly.<br>
		Contributions are welcome; see the <a href="https://github.com/Pf2eToolsOrg/homebrew#readme" target="_blank" rel="noopener noreferrer">README</a>, or stop by our <a href="https://discord.gg/2hzNxErtVu" target="_blank" rel="noopener noreferrer">Discord</a>.</i></div>
		<hr class="hr-1">
		<div class="flex-h-right mb-1">${$btnToggleDisplayNonPageBrews}${$btnAll}</div>
		${$iptSearch}
		<div class="filtertools manbrew__filtertools btn-group input-group input-group--bottom flex no-shrink">
			<button class="col-4 sort btn btn-default btn-xs" data-sort="name">Name</button>
			<button class="col-3 sort btn btn-default btn-xs" data-sort="author">Author</button>
			<button class="col-1-2 sort btn btn-default btn-xs" data-sort="category">Category</button>
			<button class="col-1-4 sort btn btn-default btn-xs" data-sort="modified">Modified</button>
			<button class="col-1-4 sort btn btn-default btn-xs" data-sort="added">Added</button>
			<button class="sort btn btn-default btn-xs ve-grow" disabled>Source</button>
		</div>
		${$ulRows}${$wrpBtn}`;

		// populate list
		let dataList;

		function fnSort (a, b, o) {
			a = dataList[a.ix];
			b = dataList[b.ix];

			if (o.sortBy === "name") return byName();
			if (o.sortBy === "author") return orFallback(SortUtil.ascSortLower, "_brewAuthor");
			if (o.sortBy === "category") return orFallback(SortUtil.ascSortLower, "_brewCat");
			if (o.sortBy === "added") return orFallback(SortUtil.ascSort, "_brewAdded");
			if (o.sortBy === "modified") return orFallback(SortUtil.ascSort, "_brewModified");

			function byName () {
				return SortUtil.ascSortLower(a._brewName, b._brewName);
			}

			function orFallback (func, prop) {
				return func(a[prop], b[prop]) || byName();
			}
		}

		const urlRoot = await StorageUtil.pGet(`HOMEBREW_CUSTOM_REPO_URL`);
		const [timestamps, propIndex] = await Promise.all([
			DataUtil.brew.pLoadTimestamps(urlRoot),
			DataUtil.brew.pLoadPropIndex(urlRoot),
		]);
		const props = opts.isShowAll ? BrewUtil.getPageProps(UrlUtil.PG_MANAGE_BREW) : BrewUtil.getPageProps();

		const seenPaths = new Set();

		dataList = [];
		props.forEach(prop => {
			Object.entries(propIndex[prop] || {})
				.forEach(([path, dir]) => {
					if (seenPaths.has(path)) return;
					seenPaths.add(path);
					dataList.push({
						download_url: DataUtil.brew.getFileUrl(path, urlRoot),
						path,
						name: path.slice(path.indexOf("/") + 1),
						_cat: BrewUtil.dirToProp(dir),
					})
				})
		});

		dataList.forEach(it => {
			const cleanFilename = it.name.trim().replace(/\.json$/, "");
			const spl = cleanFilename.split(";").map(it => it.trim());
			if (spl.length > 1) {
				it._brewName = spl[1];
				it._brewAuthor = spl[0];
			} else {
				it._brewName = cleanFilename;
				it._brewAuthor = "";
			}
		});
		dataList.sort((a, b) => SortUtil.ascSortLower(a._brewName, b._brewName));

		const list = new List({
			$iptSearch,
			$wrpList: $ulRows,
			fnSort,
			isUseJquery: true,
		});
		SortUtil.initBtnSortHandlers($modalInner.find(".manbrew__filtertools"), list);

		dataList.forEach((it, i) => {
			it._brewAdded = (timestamps[it.path] || {}).a || 0;
			it._brewModified = (timestamps[it.path] || {}).m || 0;
			it._brewCat = BrewUtil._pRenderBrewScreen_getDisplayCat(BrewUtil.dirToProp(it._cat));

			const timestampAdded = it._brewAdded ? MiscUtil.dateToStr(new Date(it._brewAdded * 1000), true) : "";
			const timestampModified = it._brewModified ? MiscUtil.dateToStr(new Date(it._brewModified * 1000), true) : "";

			const $btnAdd = $(`<span class="col-4 bold manbrew__load_from_url pl-0 clickable"></span>`)
				.text(it._brewName)
				.click(() => BrewUtil.addBrewRemote($btnAdd, it.download_url || "", true));

			const $li = $$`<li class="not-clickable lst--border lst__row--focusable" tabindex="1">
				<div class="lst__wrp-cells">
					${$btnAdd}
					<span class="col-3">${it._brewAuthor}</span>
					<span class="col-1-2 text-center">${it._brewCat}</span>
					<span class="col-1-4 text-center">${timestampModified}</span>
					<span class="col-1-4 text-center">${timestampAdded}</span>
					<span class="col-1 manbrew__source text-center"><a href="${it.download_url}" target="_blank" rel="noopener noreferrer">View Raw</a></span>
				</div>
			</li>`;

			$li.keydown(evt => {
				switch (evt.which) {
					case 13: { // enter
						return $btnAdd.click()
					}
					case 38: { // up
						const ixCur = list.visibleItems.indexOf(listItem);
						if (~ixCur) {
							const prevItem = list.visibleItems[ixCur - 1];
							if (prevItem) prevItem.ele.focus();
						} else {
							const firstItem = list.visibleItems[0];
							if (firstItem) firstItem.ele.focus();
						}
						return;
					}
					case 40: { // down
						const ixCur = list.visibleItems.indexOf(listItem);
						if (~ixCur) {
							const nxtItem = list.visibleItems[ixCur + 1];
							if (nxtItem) nxtItem.ele.focus();
						} else {
							const lastItem = list.visibleItems.last();
							if (lastItem) lastItem.ele.focus();
						}
					}
				}
			});

			const listItem = new ListItem(
				i,
				$li,
				it._brewName,
				{
					author: it._brewAuthor,
					category: it._brewCat,
					added: timestampAdded,
					modified: timestampAdded,
				},
				{
					$btnAdd,
					isSample: it._brewAuthor.toLowerCase().startsWith("sample -"),
				},
			);
			list.addItem(listItem);
		});

		list.init();

		$btnAll.prop("disabled", false).click(() => list.visibleItems.filter(it => !it.data.isSample).forEach(it => it.data.$btnAdd.click()));

		if ($btnToggleDisplayNonPageBrews) {
			$btnToggleDisplayNonPageBrews
				.prop("disabled", false)
				.click(() => {
					$btnToggleDisplayNonPageBrews.toggleClass("active");
					doClose();
					BrewUtil._pHandleClickBtnGet({
						...opts,
						isShowAll: !$btnToggleDisplayNonPageBrews.hasClass("active"),
					});
				});
		}

		$iptSearch.focus();
	},

	_$getBtnDeleteAll (isModal) {
		return $(`<button class="btn ${isModal ? "btn-xs" : "btn-sm ml-2"} btn-danger">Delete All</button>`)
			.click(async () => {
				if (!window.confirm("Are you sure?")) return;
				await StorageUtil.pSet(VeCt.STORAGE_HOMEBREW, {});
				StorageUtil.syncSet(VeCt.STORAGE_HOMEBREW_META, {});
				window.location.hash = "";
				location.reload();
			});
	},

	async _pCleanSaveBrew () {
		const cpy = MiscUtil.copy(BrewUtil.homebrew);
		BrewUtil._STORABLE.forEach(prop => {
			(cpy[prop] || []).forEach(ent => {
				// FIXME: This breaks item _vmod
				// Object.keys(ent).filter(k => k.startsWith("_")).forEach(k => delete ent[k]);
			});
		});
		await StorageUtil.pSet(VeCt.STORAGE_HOMEBREW, cpy);
	},

	async _pRenderBrewScreen_pDeleteSource ($brewList, source, doConfirm, isAllSources) {
		if (doConfirm && !window.confirm(`Are you sure you want to remove all homebrew${!isAllSources ? ` with${source ? ` source "${Parser.sourceJsonToFull(source)}"` : `out a source`}` : ""}?`)) return;

		const vetoolsSourceSet = new Set(BrewUtil._getActiveVetoolsSources().map(it => it.json));
		const isMatchingSource = (itSrc) => isAllSources || (itSrc === source || (source === undefined && !vetoolsSourceSet.has(itSrc) && !BrewUtil.hasSourceJson(itSrc)));

		await Promise.all(BrewUtil._getBrewCategories().map(async k => {
			const cat = BrewUtil.homebrew[k];
			const pDeleteFn = BrewUtil._getPDeleteFunction(k);
			const toDel = [];
			cat.filter(it => isMatchingSource(it.source)).forEach(it => toDel.push(it.uniqueId));
			await Promise.all(toDel.map(async uId => pDeleteFn(uId)));
		}));
		if (BrewUtil._lists) BrewUtil._lists.forEach(l => l.update());
		BrewUtil._persistHomebrewDebounced();
		BrewUtil.removeJsonSource(source);
		// remove the source from the filters and re-render the filter box
		if (BrewUtil._sourceFilters) BrewUtil._sourceFilters.forEach(sf => sf.removeItem(source));
		if (BrewUtil._filterBoxes) BrewUtil._filterBoxes.forEach(fb => fb.render());
		await BrewUtil._pRenderBrewScreen_pRefreshBrewList($brewList);
		window.location.hash = "";
		if (BrewUtil._filterBoxes) BrewUtil._filterBoxes.forEach(fb => fb.fireChangeEvent());
	},

	async _pRenderBrewScreen_pRefreshBrewList ($brewList) {
		function showSourceManager (source, showAll) {
			const $wrpBtnDel = $(`<div class="flex-v-center"></div>`);

			const { $modalInner, doClose } = UiUtil.getShowModal({
				isHeight100: true,
				title: `View/Manage ${source ? `Source Contents: ${Parser.sourceJsonToFull(source)}` : showAll ? "Entries from All Sources" : `Entries with No Source`}`,
				isUncappedHeight: true,
				isWidth100: true,
				overlayColor: "transparent",
				$titleSplit: $wrpBtnDel,
				isHeaderBorder: true,
			});

			const $cbAll = $(`<input type="checkbox">`);
			const $ulRows = $$`<ul class="list"></ul>`;
			const $iptSearch = $(`<input type="search" class="search manbrew__search form-control w-100 mt-1" placeholder="Search entries...">`);
			const $wrpBtnsSort = $$`<div class="filtertools manbrew__filtertools btn-group">
				<button class="col-6 sort btn btn-default btn-xs" data-sort="name">Name</button>
				<button class="col-5 sort btn btn-default btn-xs" data-sort="category">Category</button>
				<label class="wrp-cb-all pr-0 flex-vh-center mb-0 h-100">${$cbAll}</label>
			</div>`;
			$$($modalInner)`
				${$iptSearch}
				${$wrpBtnsSort}
				${$ulRows}`;

			let list;

			// populate list
			function populateList () {
				$ulRows.empty();

				list = new List({
					$iptSearch,
					$wrpList: $ulRows,
					fnSort: SortUtil.listSort,
				});

				ListUiUtil.bindSelectAllCheckbox($cbAll.off("change"), list);

				function mapCategoryEntry (cat, bru) {
					const out = {};
					out.name = bru.name;
					out.uniqueId = bru.uniqueId;
					out.extraInfo = "";
					switch (cat) {
						case "subclass":
							out.extraInfo = ` (${bru.class})`;
							break;
						case "subrace":
							out.extraInfo = ` (${(bru.race || {}).name})`;
							break;
						case "psionic":
							out.extraInfo = ` (${Parser.psiTypeToMeta(bru.type).short})`;
							break;
						case "itemProperty": {
							if (bru.entries) out.name = Renderer.findName(bru.entries);
							if (!out.name) out.name = bru.abbreviation;
							break;
						}
						case "adventureData":
						case "bookData": {
							const assocData = {
								"adventureData": "adventure",
								"bookData": "book",
							};
							out.name = (((BrewUtil.homebrew[assocData[cat]] || []).find(a => a.id === bru.id) || {}).name || bru.id);
						}
					}
					out.name = out.name || `(Unknown)`;
					return out;
				}

				const vetoolsSourceSet = new Set(BrewUtil._getActiveVetoolsSources().map(it => it.json));

				const isMatchingSource = (itSrc) => showAll || (itSrc === source || (source === undefined && !vetoolsSourceSet.has(itSrc) && !BrewUtil.hasSourceJson(itSrc)));
				BrewUtil._getBrewCategories().forEach(cat => {
					BrewUtil.homebrew[cat]
						.filter(it => isMatchingSource(it.source))
						.map(it => mapCategoryEntry(cat, it))
						.sort((a, b) => SortUtil.ascSort(a.name, b.name))
						.forEach((it, i) => {
							const dispCat = BrewUtil._pRenderBrewScreen_getDisplayCat(cat, true);

							const eleLi = document.createElement("li");
							eleLi.className = "row px-0";

							eleLi.innerHTML = `<label class="lst--border no-select mb-0 flex-v-center">
								<div class="col-6 bold">${it.name}</div>
								<div class="col-5 flex-vh-center">${dispCat}${it.extraInfo}</div>
								<div class="pr-0 col-1 flex-vh-center"><input type="checkbox" class="no-events"></div>
							</label>`;

							const listItem = new ListItem(
								i,
								eleLi,
								it.name,
								{
									category: dispCat,
									category_raw: cat,
								},
								{
									uniqueId: it.uniqueId,
									cbSel: eleLi.firstElementChild.children[2].firstElementChild,
								},
							);
							list.addItem(listItem);

							eleLi.addEventListener("click", evt => ListUiUtil.handleSelectClick(list, listItem, evt));
						});
				});
				$ulRows.empty();

				list.init();
				if (!list.items.length) $ulRows.append(`<h5 class="text-center">No results found.</h5>`);
				SortUtil.initBtnSortHandlers($wrpBtnsSort, list);
			}

			populateList();

			$(`<button class="btn btn-danger btn-xs">Delete Selected</button>`).on("click", async () => {
				const toDel = list.items.filter(it => $(it.ele).find(`input`).prop("checked")).map(it => ({ ...it.values, ...it.data }));

				if (!toDel.length) return;
				if (!window.confirm(`Are you sure you want to delete the ${toDel.length} selected item${toDel.length === 1 ? "" : "s"}?`)) return;

				if (toDel.length === list.items.length) {
					await BrewUtil._pRenderBrewScreen_pDeleteSource($brewList, source, false, false);
					doClose();
				} else {
					await Promise.all(toDel.map(async it => {
						const pDeleteFn = BrewUtil._getPDeleteFunction(it.category_raw);
						await pDeleteFn(it.uniqueId);
					}));
					if (BrewUtil._lists) BrewUtil._lists.forEach(l => l.update());
					BrewUtil._persistHomebrewDebounced();
					populateList();
					await BrewUtil._pRenderBrewScreen_pRefreshBrewList($brewList);
					window.location.hash = "";
				}
			}).appendTo($wrpBtnDel);

			$iptSearch.focus();
		}

		$brewList.empty();
		if (!BrewUtil.homebrew) return;

		const $iptSearch = $(`<input type="search" class="search manbrew__search form-control" placeholder="Search active homebrew...">`);
		const $wrpList = $(`<ul class="list-display-only brew-list brew-list--target manbrew__list"></ul>`);
		const $ulGroup = $(`<ul class="list-display-only brew-list brew-list--groups no-shrink" style="height: initial;"></ul>`);

		const list = new List({ $iptSearch, $wrpList, isUseJquery: true });

		const $lst = $$`
			<div class="flex-col h-100">
				${$iptSearch}
				<div class="filtertools manbrew__filtertools btn-group input-group input-group--bottom flex no-shrink">
					<button class="col-5 sort btn btn-default btn-xs ve-grow" data-sort="source">Source</button>
					<button class="col-4 sort btn btn-default btn-xs" data-sort="authors">Authors</button>
					<button class="col-1 btn btn-default btn-xs" disabled>Origin</button>
					<button class="col-2 ve-grow btn btn-default btn-xs" disabled>&nbsp;</button>
				</div>
				<div class="flex w-100 h-100 overflow-y-auto relative">${$wrpList}</div>
			</div>
		`.appendTo($brewList);
		$ulGroup.appendTo($brewList);
		SortUtil.initBtnSortHandlers($lst.find(".manbrew__filtertools"), list);

		const createButtons = (src, $row) => {
			const $btnViewManage = $(`<button class="btn btn-sm btn-default">View/Manage</button>`)
				.on("click", () => {
					showSourceManager(src.json, src._all);
				});

			const $btnDeleteAll = $(`<button class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-trash"></span></button>`)
				.on("click", () => BrewUtil._pRenderBrewScreen_pDeleteSource($brewList, src.json, true, src._all));

			$$`<div class="flex-h-right flex-v-center btn-group">
				${$btnViewManage}
				${$btnDeleteAll}
			</div>`.appendTo($row);
		};

		const brewSources = MiscUtil.copy(BrewUtil.getJsonSources())
			.filter(src => BrewUtil._isSourceRelevantForCurrentPage(src.json));
		brewSources.sort((a, b) => SortUtil.ascSort(a.full, b.full));

		brewSources.forEach((src, i) => {
			const validAuthors = (!src.authors ? [] : !(src.authors instanceof Array) ? [] : src.authors).join(", ");
			const isGroup = src._unknown || src._all;

			const $row = $(`<li class="row manbrew__row lst--border">
				<span class="col-5 manbrew__col--tall source manbrew__source">${isGroup ? "<i>" : ""}${src.full}${isGroup ? "</i>" : ""}</span>
				<span class="col-4 manbrew__col--tall authors">${validAuthors}</span>
				<${src.url ? "a" : "span"} class="col-1 manbrew__col--tall text-center" ${src.url ? `href="${src.url}" target="_blank" rel="noopener noreferrer"` : ""}>${src.url ? "View Source" : ""}</${src.url ? "a" : "span"}>
				<span class="hidden">${src.abbreviation}</span>
			</li>`);
			createButtons(src, $row);

			const listItem = new ListItem(
				i,
				$row,
				src.full,
				{
					authors: validAuthors,
					abbreviation: src.abbreviation,
				},
			);
			list.addItem(listItem);
		});

		const createGroupRow = (fullText, modeProp) => {
			const $row = $(`<div class="row manbrew__row flex-h-right">
				<div class="manbrew__col--tall source manbrew__source text-right"><i class="mr-3">${fullText}</i></div>
			</div>`);
			createButtons({ [modeProp]: true }, $row);
			$ulGroup.append($row);
		};
		createGroupRow("Entries From All Sources", "_all");
		createGroupRow("Entries Without Sources", "_unknown");

		list.init();
		$iptSearch.focus();
	},

	_isSourceRelevantForCurrentPage (source) {
		const cats = ["trait", ...BrewUtil.getPageProps()];
		return !!cats.find(cat => !!(BrewUtil.homebrew[cat] || []).some(entry => (entry.inherits ? entry.inherits.source : entry.source) === source));
	},

	getPageProps (page) {
		page = BrewUtil._PAGE || page || UrlUtil.getCurrentPage();

		const _PG_SPELLS = ["spell", "domain"];
		const _PG_BESTIARY = ["creature"];

		switch (page) {
			case UrlUtil.PG_VARIANTRULES:
				return ["variantrule"];
			case UrlUtil.PG_TABLES:
				return ["table", "tableGroup"];
			case UrlUtil.PG_BOOKS:
				return ["book", "bookData"];
			case UrlUtil.PG_ANCESTRIES:
				return ["ancestry", "versatileHeritage", "heritage"];
			case UrlUtil.PG_BACKGROUNDS:
				return ["background"];
			case UrlUtil.PG_CLASSES:
				return ["class", "subclass", "classFeature", "subclassFeature"];
			case UrlUtil.PG_ARCHETYPES:
				return ["archetype"];
			case UrlUtil.PG_FEATS:
				return ["feat"];
			case UrlUtil.PG_COMPANIONS_FAMILIARS:
				return ["companion", "familiar", "eidolon"];
			case UrlUtil.PG_ADVENTURES:
				return ["adventure", "adventureData"];
			case UrlUtil.PG_HAZARDS:
				return ["hazard"];
			case UrlUtil.PG_ACTIONS:
				return ["action"];
			case UrlUtil.PG_BESTIARY:
				return _PG_BESTIARY;
			case UrlUtil.PG_CONDITIONS:
				return ["condition"];
			case UrlUtil.PG_ITEMS:
				return ["item", "baseitem", "group"];
			case UrlUtil.PG_SPELLS:
				return _PG_SPELLS;
			case UrlUtil.PG_AFFLICTIONS:
				return ["disease", "curse"];
			case UrlUtil.PG_ABILITIES:
				return ["ability"];
			case UrlUtil.PG_DEITIES:
				return ["deity", "domain"];
			case UrlUtil.PG_LANGUAGES:
				return ["language"];
			case UrlUtil.PG_PLACES:
				return ["place"];
			case UrlUtil.PG_ORGANIZATIONS:
				return ["organization"];
			case UrlUtil.PG_CREATURETEMPLATE:
				return ["creatureTemplate"];
			case UrlUtil.PG_RITUALS:
				return ["ritual"];
			case UrlUtil.PG_OPTIONAL_FEATURES:
				return ["optionalfeature"];
			case UrlUtil.PG_VEHICLES:
				return ["vehicle"];
			case UrlUtil.PG_TRAITS:
				return ["trait"];
			case UrlUtil.PG_MAKE_BREW:
				return [
					..._PG_SPELLS,
					..._PG_BESTIARY,
					"makebrewCreatureTrait",
				];
			case UrlUtil.PG_MANAGE_BREW:
			case UrlUtil.PG_DEMO_RENDER:
				return BrewUtil._STORABLE;
			default:
				throw new Error(`No homebrew properties defined for category ${page}`);
		}
	},

	dirToProp (dir) {
		if (!dir) return "";
		else if (BrewUtil._STORABLE.includes(dir)) return dir;
		else {
			switch (dir) {
				case "collection":
					return dir;
				case "magicvariant":
					return "variant";
				case "makebrew":
					return "makebrewCreatureTrait";
			}
			throw new Error(`Directory was not mapped to a category: "${dir}"`);
		}
	},

	_pRenderBrewScreen_getDisplayCat (cat, isManager) {
		if (cat === "variantrule") return "Variant Rule";
		if (cat === "optionalfeature") return "Optional Feature";
		if (cat === "adventure") return isManager ? "Adventure Contents/Info" : "Adventure";
		if (cat === "adventureData") return "Adventure Text";
		if (cat === "book") return isManager ? "Book Contents/Info" : "Book";
		if (cat === "bookData") return "Book Text";
		if (cat === "baseitem") return "Base Item";
		if (cat === "classFeature") return "Class Feature";
		if (cat === "versatileHeritage") return "Versatile Heritage";
		if (cat === "subclassFeature") return "Subclass Feature";
		return cat.uppercaseFirst();
	},

	handleLoadbrewClick: async (ele, jsonUrl, name) => {
		const $ele = $(ele);
		if (!$ele.hasClass("rd__wrp-loadbrew--ready")) return; // an existing click is being handled
		const cached = $ele.html();
		const cachedTitle = $ele.title();
		$ele.title("");
		$ele.removeClass("rd__wrp-loadbrew--ready").html(`${name}<span class="glyphicon glyphicon-refresh rd__loadbrew-icon rd__loadbrew-icon--active"></span>`);
		jsonUrl = jsonUrl.unescapeQuotes();
		const data = await DataUtil.loadJSON(`${jsonUrl}?${(new Date()).getTime()}`);
		await BrewUtil.pDoHandleBrewJson(data, BrewUtil._PAGE || UrlUtil.getCurrentPage());
		$ele.html(`${name}<span class="glyphicon glyphicon-saved rd__loadbrew-icon"></span>`);
		setTimeout(() => $ele.html(cached).addClass("rd__wrp-loadbrew--ready").title(cachedTitle), 500);
	},

	async _pDoRemove (arrName, uniqueId, isChild) {
		function getIndex (arrName, uniqueId, isChild) {
			return BrewUtil.homebrew[arrName].findIndex(it => isChild ? it.parentUniqueId : it.uniqueId === uniqueId);
		}

		const index = getIndex(arrName, uniqueId, isChild);
		if (~index) {
			const toRemove = BrewUtil.homebrew[arrName][index];
			BrewUtil.homebrew[arrName].splice(index, 1);
			if (BrewUtil._lists) {
				BrewUtil._lists.forEach(l => l.removeItemByData(isChild ? "parentuniqueId" : "uniqueId", uniqueId));
			}
			return toRemove;
		}
	},

	_getPDeleteFunction (category) {
		switch (category) {
			case "variantrule":
			case "table":
			case "tableGroup":
			case "ancestry":
			case "heritage":
			case "versatileHeritage":
			case "background":
			case "class":
			case "classFeature":
			case "subclassFeature":
			case "archetype":
			case "feat":
			case "companion":
			case "familiar":
			case "eidolon":
			case "hazard":
			case "action":
			case "creature":
			case "condition":
			case "item":
			case "baseitem":
			case "spell":
			case "disease":
			case "curse":
			case "ability":
			case "organization":
			case "creatureTemplate":
			case "deity":
			case "language":
			case "place":
			case "ritual":
			case "vehicle":
			case "trait":
			case "group":
			case "domain":
			case "skill":
			case "optionalfeature":
				return BrewUtil._genPDeleteGenericBrew(category);
			case "subclass":
				return BrewUtil._pDeleteSubclassBrew;
			case "adventure":
			case "book":
				return BrewUtil._genPDeleteGenericBookBrew(category);
			case "adventureData":
			case "bookData":
				return () => {
				}; // Do nothing, handled by deleting the associated book/adventure
			default:
				throw new Error(`No homebrew delete function defined for category ${category}`);
		}
	},

	async _pDeleteSubclassBrew (uniqueId) {
		let sc;
		let index = 0;
		for (; index < BrewUtil.homebrew.subclass.length; ++index) {
			if (BrewUtil.homebrew.subclass[index].uniqueId === uniqueId) {
				sc = BrewUtil.homebrew.subclass[index];
				break;
			}
		}

		// FIXME: What is this for? It breaks the class page when you have homebrew automatically loaded.
		/* if (sc) {
			const forClass = sc.class;
			BrewUtil.homebrew.subclass.splice(index, 1);
			BrewUtil._persistHomebrewDebounced();

			if (typeof ClassesPage === "undefined") return;
			await classesPage.pDeleteSubclassBrew(uniqueId, sc);
		} */
	},

	_genPDeleteGenericBrew (category) {
		return async (uniqueId) => {
			await BrewUtil._pDoRemove(category, uniqueId);
		};
	},

	_genPDeleteGenericBookBrew (category) {
		return async (uniqueId) => {
			await BrewUtil._pDoRemove(category, uniqueId);
			await BrewUtil._pDoRemove(`${category}Data`, uniqueId, true);
		};
	},

	manageBrew: () => {
		const { $modalInner, doClose } = UiUtil.getShowModal({
			isHeight100: true,
			isWidth100: true,
			title: `Manage Homebrew`,
			isUncappedHeight: true,
			$titleSplit: BrewUtil._$getBtnDeleteAll(true),
			isHeaderBorder: true,
		});

		BrewUtil._pRenderBrewScreen($modalInner, { isModal: true, doClose });
	},

	async pAddEntry (prop, obj) {
		BrewUtil._mutUniqueId(obj);
		(BrewUtil.homebrew[prop] = BrewUtil.homebrew[prop] || []).push(obj);
		BrewUtil._persistHomebrewDebounced();
		return BrewUtil.homebrew[prop].length - 1;
	},

	async pRemoveEntry (prop, obj) {
		const ix = (BrewUtil.homebrew[prop] = BrewUtil.homebrew[prop] || []).findIndex(it => it.uniqueId === obj.uniqueId);
		if (~ix) {
			BrewUtil.homebrew[prop].splice(ix, 1);
			BrewUtil._persistHomebrewDebounced();
		} else throw new Error(`Could not find object with ID "${obj.uniqueId}" in "${prop}" list`);
	},

	getEntryIxByEntry (prop, obj) {
		return (BrewUtil.homebrew[prop] = BrewUtil.homebrew[prop] || []).findIndex(it => it.name === obj.name && it.source === obj.source);
	},

	async pUpdateEntryByIx (prop, ix, obj) {
		if (~ix && ix < BrewUtil.homebrew[prop].length) {
			BrewUtil._mutUniqueId(obj);
			BrewUtil.homebrew[prop].splice(ix, 1, obj);
			BrewUtil._persistHomebrewDebounced();
		} else throw new Error(`Index "${ix}" was not valid!`);
	},

	_mutUniqueId (obj) {
		delete obj.uniqueId; // avoid basing the hash on the previous hash
		obj.uniqueId = CryptUtil.md5(JSON.stringify(obj));
	},

	_STORABLE: ["variantrule", "table", "tableGroup", "book", "bookData", "ancestry", "heritage", "versatileHeritage", "background", "class", "subclass", "classFeature", "subclassFeature", "archetype", "feat", "companion", "familiar", "eidolon", "adventure", "adventureData", "hazard", "action", "creature", "condition", "item", "baseitem", "spell", "disease", "curse", "ability", "deity", "language", "place", "ritual", "vehicle", "trait", "group", "domain", "skill", "optionalfeature", "organization", "creatureTemplate"],
	async pDoHandleBrewJson (json, page, pFuncRefresh) {
		page = BrewUtil._PAGE || page;
		await BrewUtil._lockHandleBrewJson.pLock();
		try {
			return BrewUtil._pDoHandleBrewJson(json, page, pFuncRefresh);
		} finally {
			BrewUtil._lockHandleBrewJson.unlock();
		}
	},

	async _pDoHandleBrewJson (json, page, pFuncRefresh) {
		page = BrewUtil._PAGE || page;

		function storePrep (arrName) {
			if (json[arrName] != null && !(json[arrName] instanceof Array)) return;
			if (json[arrName]) {
				json[arrName].forEach(it => BrewUtil._mutUniqueId(it));
			} else json[arrName] = [];
		}

		// prepare for storage
		BrewUtil._STORABLE.forEach(storePrep);

		const bookPairs = [
			["adventure", "adventureData"],
			["book", "bookData"],
		];
		bookPairs.forEach(([bookMetaKey, bookDataKey]) => {
			if (json[bookMetaKey] && json[bookDataKey]) {
				json[bookMetaKey].forEach(book => {
					const data = json[bookDataKey].find(it => it.id === book.id);
					if (data) {
						data.parentUniqueId = book.uniqueId;
					}
				});
			}
		});

		// store
		async function pCheckAndAdd (prop) {
			if (!BrewUtil.homebrew[prop]) BrewUtil.homebrew[prop] = [];
			if (!(json[prop] instanceof Array)) return [];
			if (IS_DEPLOYED || IS_VTT) {
				// in production mode, skip any existing brew
				const areNew = [];
				const existingIds = BrewUtil.homebrew[prop].map(it => it.uniqueId);
				json[prop].forEach(it => {
					if (!existingIds.find(id => it.uniqueId === id)) {
						BrewUtil.homebrew[prop].push(it);
						areNew.push(it);
					}
				});
				return areNew;
			} else {
				// in development mode, replace any existing brew
				const existing = {};
				BrewUtil.homebrew[prop].forEach(it => {
					existing[it.source] = (existing[it.source] || {});
					existing[it.source][it.name] = it.uniqueId;
				});
				const pDeleteFn = BrewUtil._getPDeleteFunction(prop);
				await Promise.all(json[prop].map(async it => {
					// Handle magic variants
					const itSource = it.inherits && it.inherits.source ? it.inherits.source : it.source;
					if (existing[itSource] && existing[itSource][it.name]) {
						await pDeleteFn(existing[itSource][it.name]);
					}
					BrewUtil.homebrew[prop].push(it);
				}));
				return json[prop];
			}
		}

		function checkAndAddMetaGetNewSources () {
			const areNew = [];
			if (json._meta) {
				if (!BrewUtil.homebrewMeta) BrewUtil.homebrewMeta = { sources: [] };

				Object.keys(json._meta).forEach(k => {
					switch (k) {
						case "dateAdded":
						case "dateLastModified":
							break;
						case "sources": {
							const existing = BrewUtil.homebrewMeta.sources.map(src => src.json);
							json._meta.sources.forEach(src => {
								if (!existing.find(it => it === src.json)) {
									BrewUtil.homebrewMeta.sources.push(src);
									areNew.push(src);
								}
							});
							break;
						}
						default: {
							BrewUtil.homebrewMeta[k] = BrewUtil.homebrewMeta[k] || {};
							Object.assign(BrewUtil.homebrewMeta[k], json._meta[k]);
							break;
						}
					}
				});
			}
			return areNew;
		}

		let sourcesToAdd = json._meta ? json._meta.sources : [];
		const toAdd = {};
		BrewUtil._STORABLE.filter(k => json[k] instanceof Array).forEach(k => toAdd[k] = json[k]);
		BrewUtil.homebrew = BrewUtil.homebrew || {};
		sourcesToAdd = checkAndAddMetaGetNewSources(); // adding source(s) to Filter should happen in per-page addX functions
		await Promise.all(BrewUtil._STORABLE.map(async k => toAdd[k] = await pCheckAndAdd(k))); // only add if unique ID not already present
		BrewUtil._persistHomebrewDebounced(); // Debounce this for mass adds, e.g. "Add All"
		StorageUtil.syncSet(VeCt.STORAGE_HOMEBREW_META, BrewUtil.homebrewMeta);

		// wipe old cache
		BrewUtil._resetSourceCache();

		// display on page
		switch (page) {
			case UrlUtil.PG_VARIANTRULES:
			case UrlUtil.PG_TABLES:
			case UrlUtil.PG_BOOK:
			case UrlUtil.PG_BOOKS:
			case UrlUtil.PG_ANCESTRIES:
			case UrlUtil.PG_BACKGROUNDS:
			case UrlUtil.PG_CLASSES:
			case UrlUtil.PG_ARCHETYPES:
			case UrlUtil.PG_FEATS:
			case UrlUtil.PG_COMPANIONS_FAMILIARS:
			case UrlUtil.PG_ADVENTURE:
			case UrlUtil.PG_ADVENTURES:
			case UrlUtil.PG_HAZARDS:
			case UrlUtil.PG_ACTIONS:
			case UrlUtil.PG_BESTIARY:
			case UrlUtil.PG_CONDITIONS:
			case UrlUtil.PG_ITEMS:
			case UrlUtil.PG_SPELLS:
			case UrlUtil.PG_AFFLICTIONS:
			case UrlUtil.PG_ABILITIES:
			case UrlUtil.PG_DEITIES:
			case UrlUtil.PG_LANGUAGES:
			case UrlUtil.PG_PLACES:
			case UrlUtil.PG_ORGANIZATIONS:
			case UrlUtil.PG_CREATURETEMPLATE:
			case UrlUtil.PG_RITUALS:
			case UrlUtil.PG_VEHICLES:
			case UrlUtil.PG_OPTIONAL_FEATURES:
			case UrlUtil.PG_TRAITS:
				await (BrewUtil._pHandleBrew || handleBrew)(MiscUtil.copy(toAdd));
				break;
			case UrlUtil.PG_MANAGE_BREW:
			case UrlUtil.PG_DEMO_RENDER:
			case VeCt.PG_NONE:
				// No-op
				break;
			default:
				throw new Error(`No homebrew add function defined for category ${page}`);
		}

		if (pFuncRefresh) await pFuncRefresh();

		if (BrewUtil._filterBoxes && BrewUtil._sourceFilters) {
			BrewUtil._filterBoxes.forEach((filterBox, idx) => {
				const cur = filterBox.getValues();
				if (cur.Source) {
					const toSet = JSON.parse(JSON.stringify(cur.Source));

					if (toSet._totals.yes || toSet._totals.no) {
						sourcesToAdd.forEach(src => toSet[src.json] = 1);
						filterBox.setFromValues({ Source: toSet });
					}
				}
				filterBox.fireChangeEvent();
			});
		}
	},

	makeBrewButton: (id) => {
		$(`#${id}`).on("click", () => BrewUtil.manageBrew());
	},

	_getBrewCategories () {
		return Object.keys(BrewUtil.homebrew).filter(it => !it.startsWith("_"));
	},

	// region sources
	_buildSourceCache () {
		function doBuild () {
			if (BrewUtil.homebrewMeta && BrewUtil.homebrewMeta.sources) {
				BrewUtil.homebrewMeta.sources.forEach(src => BrewUtil._sourceCache[src.json.toLowerCase()] = ({ ...src }));
			}
		}

		if (!BrewUtil._sourceCache) {
			BrewUtil._sourceCache = {};

			if (!BrewUtil.homebrewMeta) {
				const temp = StorageUtil.syncGet(VeCt.STORAGE_HOMEBREW_META) || {};
				temp.sources = temp.sources || [];
				BrewUtil.homebrewMeta = temp;
				doBuild();
			} else {
				doBuild();
			}
		}
	},

	_resetSourceCache () {
		BrewUtil._sourceCache = null;
	},

	removeJsonSource (source) {
		if (!source) return;
		source = source.toLowerCase();
		BrewUtil._resetSourceCache();
		const ix = BrewUtil.homebrewMeta.sources.findIndex(it => it.json.toLowerCase() === source);
		if (~ix) BrewUtil.homebrewMeta.sources.splice(ix, 1);
		StorageUtil.syncSet(VeCt.STORAGE_HOMEBREW_META, BrewUtil.homebrewMeta);
	},

	getJsonSources () {
		BrewUtil._buildSourceCache();
		return BrewUtil.homebrewMeta && BrewUtil.homebrewMeta.sources ? BrewUtil.homebrewMeta.sources : [];
	},

	hasSourceJson (source) {
		if (!source) return false;
		source = source.toLowerCase();
		BrewUtil._buildSourceCache();
		return !!BrewUtil._sourceCache[source];
	},

	sourceJsonToFull (source) {
		if (!source) return "";
		source = source.toLowerCase();
		BrewUtil._buildSourceCache();
		return BrewUtil._sourceCache[source] ? BrewUtil._sourceCache[source].full || source : source;
	},

	sourceJsonToAbv (source) {
		if (!source) return "";
		source = source.toLowerCase();
		BrewUtil._buildSourceCache();
		return BrewUtil._sourceCache[source] ? BrewUtil._sourceCache[source].abbreviation || source : source;
	},

	sourceJsonToDate (source) {
		if (!source) return "";
		source = source.toLowerCase();
		BrewUtil._buildSourceCache();
		return BrewUtil._sourceCache[source] ? BrewUtil._sourceCache[source].dateReleased || source : source;
	},

	sourceJsonToUrl (source) {
		if (!source) return "";
		source = source.toLowerCase();
		BrewUtil._buildSourceCache();
		return BrewUtil._sourceCache[source] ? BrewUtil._sourceCache[source].url || source : source;
	},

	sourceJsonToSource (source) {
		if (!source) return null;
		source = source.toLowerCase();
		BrewUtil._buildSourceCache();
		return BrewUtil._sourceCache[source] ? BrewUtil._sourceCache[source] : null;
	},

	sourceJsonToStyle (source) {
		if (!source) return "";
		source = source.toLowerCase();
		const color = BrewUtil.sourceJsonToColor(source);
		if (color) return `style="color: #${color}; border-color: #${color}; text-decoration-color: #${color};"`;
		return "";
	},

	sourceJsonToColor (source) {
		if (!source) return "";
		source = source.toLowerCase();
		BrewUtil._buildSourceCache();
		if (BrewUtil._sourceCache[source] && BrewUtil._sourceCache[source].color) {
			const validColor = BrewUtil.getValidColor(BrewUtil._sourceCache[source].color);
			if (validColor.length) return validColor;
			return "";
		} else return "";
	},

	getValidColor (color) {
		// Prevent any injection shenanigans
		return color.replace(/[^a-fA-F0-9]/g, "").slice(0, 8);
	},

	addSource (sourceObj) {
		BrewUtil._resetSourceCache();
		const exists = BrewUtil.homebrewMeta.sources.some(it => it.json === sourceObj.json);
		if (exists) throw new Error(`Source "${sourceObj.json}" already exists!`);
		(BrewUtil.homebrewMeta.sources = BrewUtil.homebrewMeta.sources || []).push(sourceObj);
		StorageUtil.syncSet(VeCt.STORAGE_HOMEBREW_META, BrewUtil.homebrewMeta);
	},

	updateSource (sourceObj) {
		BrewUtil._resetSourceCache();
		const ix = BrewUtil.homebrewMeta.sources.findIndex(it => it.json === sourceObj.json);
		if (!~ix) throw new Error(`Source "${sourceObj.json}" does not exist!`);
		const json = BrewUtil.homebrewMeta.sources[ix].json;
		BrewUtil.homebrewMeta.sources[ix] = {
			...sourceObj,
			json,
		};
		StorageUtil.syncSet(VeCt.STORAGE_HOMEBREW_META, BrewUtil.homebrewMeta);
	},

	_getActiveVetoolsSources () {
		if (BrewUtil.homebrew === null) throw new Error(`Homebrew was not initialized!`);

		const allActiveSources = new Set();
		Object.keys(BrewUtil.homebrew).forEach(k => BrewUtil.homebrew[k].forEach(it => it.source && allActiveSources.add(it.source)));
		return Object.keys(Parser.SOURCE_JSON_TO_FULL).map(k => ({
			json: k,
			full: Parser.SOURCE_JSON_TO_FULL[k],
			abbreviation: Parser.SOURCE_JSON_TO_ABV[k],
			dateReleased: Parser.SOURCE_JSON_TO_DATE[k],
		})).sort((a, b) => SortUtil.ascSort(a.full, b.full)).filter(it => allActiveSources.has(it.json));
	},
	// endregion

	/**
	 * Get data in a format similar to the main search index
	 */
	async pGetSearchIndex () {
		BrewUtil._buildSourceCache();
		const indexer = new Omnidexer(Omnisearch.highestId + 1);

		await BrewUtil.pAddBrewData();
		if (BrewUtil.homebrew) {
			const INDEX_DEFINITIONS = [Omnidexer.TO_INDEX__FROM_INDEX_JSON, Omnidexer.TO_INDEX];

			// Run these in serial, to prevent any ID ancestry condition antics
			for (const IX_DEF of INDEX_DEFINITIONS) {
				for (const arbiter of IX_DEF) {
					if (!(BrewUtil.homebrew[arbiter.brewProp || arbiter.listProp] || []).length) continue;

					if (arbiter.pFnPreProcBrew) {
						const toProc = await arbiter.pFnPreProcBrew.bind(arbiter)(BrewUtil.homebrew);
						await indexer.pAddToIndex(arbiter, toProc)
					} else {
						await indexer.pAddToIndex(arbiter, BrewUtil.homebrew)
					}
				}
			}
		}

		return Omnidexer.decompressIndex(indexer.getIndex());
	},

	async pGetAdditionalSearchIndices (highestId, addiProp) {
		BrewUtil._buildSourceCache();
		const indexer = new Omnidexer(highestId + 1);

		await BrewUtil.pAddBrewData();
		if (BrewUtil.homebrew) {
			const INDEX_DEFINITIONS = [Omnidexer.TO_INDEX__FROM_INDEX_JSON, Omnidexer.TO_INDEX];

			await Promise.all(INDEX_DEFINITIONS.map(IXDEF => {
				return Promise.all(IXDEF
					.filter(ti => ti.additionalIndexes && (BrewUtil.homebrew[ti.listProp] || []).length)
					.map(ti => {
						return Promise.all(Object.entries(ti.additionalIndexes).filter(([prop]) => prop === addiProp).map(async ([prop, pGetIndex]) => {
							const toIndex = await pGetIndex(indexer, { [ti.listProp]: BrewUtil.homebrew[ti.listProp] });
							toIndex.forEach(add => indexer.pushToIndex(add));
						}));
					}));
			}));
		}
		return Omnidexer.decompressIndex(indexer.getIndex());
	},

	async pGetAlternateSearchIndices (highestId, altProp) {
		BrewUtil._buildSourceCache();
		const indexer = new Omnidexer(highestId + 1);

		await BrewUtil.pAddBrewData();
		if (BrewUtil.homebrew) {
			const INDEX_DEFINITIONS = [Omnidexer.TO_INDEX__FROM_INDEX_JSON, Omnidexer.TO_INDEX];

			for (const IXDEF of INDEX_DEFINITIONS) {
				const filteredIxDef = IXDEF.filter(ti => ti.alternateIndexes && (BrewUtil.homebrew[ti.listProp] || []).length);

				for (const ti of filteredIxDef) {
					const filteredAltIndexes = Object.entries(ti.alternateIndexes)
						.filter(([prop]) => prop === altProp);
					for (const tuple of filteredAltIndexes) {
						const [prop, pGetIndex] = tuple;
						await indexer.pAddToIndex(ti, BrewUtil.homebrew, { alt: ti.alternateIndexes[prop] })
					}
				}
			}
		}

		return Omnidexer.decompressIndex(indexer.getIndex());
	},

	__pPersistHomebrewDebounced: null,
	_persistHomebrewDebounced () {
		if (BrewUtil.__pPersistHomebrewDebounced == null) {
			BrewUtil.__pPersistHomebrewDebounced = MiscUtil.debounce(() => BrewUtil._pCleanSaveBrew(), 125);
		}
		BrewUtil.__pPersistHomebrewDebounced();
	},
};

// ID GENERATION =======================================================================================================
CryptUtil = {
	// region md5 internals
	// stolen from http://www.myersdaily.org/joseph/javascript/md5.js
	_md5cycle: (x, k) => {
		let a = x[0];
		let b = x[1];
		let c = x[2];
		let d = x[3];

		a = CryptUtil._ff(a, b, c, d, k[0], 7, -680876936);
		d = CryptUtil._ff(d, a, b, c, k[1], 12, -389564586);
		c = CryptUtil._ff(c, d, a, b, k[2], 17, 606105819);
		b = CryptUtil._ff(b, c, d, a, k[3], 22, -1044525330);
		a = CryptUtil._ff(a, b, c, d, k[4], 7, -176418897);
		d = CryptUtil._ff(d, a, b, c, k[5], 12, 1200080426);
		c = CryptUtil._ff(c, d, a, b, k[6], 17, -1473231341);
		b = CryptUtil._ff(b, c, d, a, k[7], 22, -45705983);
		a = CryptUtil._ff(a, b, c, d, k[8], 7, 1770035416);
		d = CryptUtil._ff(d, a, b, c, k[9], 12, -1958414417);
		c = CryptUtil._ff(c, d, a, b, k[10], 17, -42063);
		b = CryptUtil._ff(b, c, d, a, k[11], 22, -1990404162);
		a = CryptUtil._ff(a, b, c, d, k[12], 7, 1804603682);
		d = CryptUtil._ff(d, a, b, c, k[13], 12, -40341101);
		c = CryptUtil._ff(c, d, a, b, k[14], 17, -1502002290);
		b = CryptUtil._ff(b, c, d, a, k[15], 22, 1236535329);

		a = CryptUtil._gg(a, b, c, d, k[1], 5, -165796510);
		d = CryptUtil._gg(d, a, b, c, k[6], 9, -1069501632);
		c = CryptUtil._gg(c, d, a, b, k[11], 14, 643717713);
		b = CryptUtil._gg(b, c, d, a, k[0], 20, -373897302);
		a = CryptUtil._gg(a, b, c, d, k[5], 5, -701558691);
		d = CryptUtil._gg(d, a, b, c, k[10], 9, 38016083);
		c = CryptUtil._gg(c, d, a, b, k[15], 14, -660478335);
		b = CryptUtil._gg(b, c, d, a, k[4], 20, -405537848);
		a = CryptUtil._gg(a, b, c, d, k[9], 5, 568446438);
		d = CryptUtil._gg(d, a, b, c, k[14], 9, -1019803690);
		c = CryptUtil._gg(c, d, a, b, k[3], 14, -187363961);
		b = CryptUtil._gg(b, c, d, a, k[8], 20, 1163531501);
		a = CryptUtil._gg(a, b, c, d, k[13], 5, -1444681467);
		d = CryptUtil._gg(d, a, b, c, k[2], 9, -51403784);
		c = CryptUtil._gg(c, d, a, b, k[7], 14, 1735328473);
		b = CryptUtil._gg(b, c, d, a, k[12], 20, -1926607734);

		a = CryptUtil._hh(a, b, c, d, k[5], 4, -378558);
		d = CryptUtil._hh(d, a, b, c, k[8], 11, -2022574463);
		c = CryptUtil._hh(c, d, a, b, k[11], 16, 1839030562);
		b = CryptUtil._hh(b, c, d, a, k[14], 23, -35309556);
		a = CryptUtil._hh(a, b, c, d, k[1], 4, -1530992060);
		d = CryptUtil._hh(d, a, b, c, k[4], 11, 1272893353);
		c = CryptUtil._hh(c, d, a, b, k[7], 16, -155497632);
		b = CryptUtil._hh(b, c, d, a, k[10], 23, -1094730640);
		a = CryptUtil._hh(a, b, c, d, k[13], 4, 681279174);
		d = CryptUtil._hh(d, a, b, c, k[0], 11, -358537222);
		c = CryptUtil._hh(c, d, a, b, k[3], 16, -722521979);
		b = CryptUtil._hh(b, c, d, a, k[6], 23, 76029189);
		a = CryptUtil._hh(a, b, c, d, k[9], 4, -640364487);
		d = CryptUtil._hh(d, a, b, c, k[12], 11, -421815835);
		c = CryptUtil._hh(c, d, a, b, k[15], 16, 530742520);
		b = CryptUtil._hh(b, c, d, a, k[2], 23, -995338651);

		a = CryptUtil._ii(a, b, c, d, k[0], 6, -198630844);
		d = CryptUtil._ii(d, a, b, c, k[7], 10, 1126891415);
		c = CryptUtil._ii(c, d, a, b, k[14], 15, -1416354905);
		b = CryptUtil._ii(b, c, d, a, k[5], 21, -57434055);
		a = CryptUtil._ii(a, b, c, d, k[12], 6, 1700485571);
		d = CryptUtil._ii(d, a, b, c, k[3], 10, -1894986606);
		c = CryptUtil._ii(c, d, a, b, k[10], 15, -1051523);
		b = CryptUtil._ii(b, c, d, a, k[1], 21, -2054922799);
		a = CryptUtil._ii(a, b, c, d, k[8], 6, 1873313359);
		d = CryptUtil._ii(d, a, b, c, k[15], 10, -30611744);
		c = CryptUtil._ii(c, d, a, b, k[6], 15, -1560198380);
		b = CryptUtil._ii(b, c, d, a, k[13], 21, 1309151649);
		a = CryptUtil._ii(a, b, c, d, k[4], 6, -145523070);
		d = CryptUtil._ii(d, a, b, c, k[11], 10, -1120210379);
		c = CryptUtil._ii(c, d, a, b, k[2], 15, 718787259);
		b = CryptUtil._ii(b, c, d, a, k[9], 21, -343485551);

		x[0] = CryptUtil._add32(a, x[0]);
		x[1] = CryptUtil._add32(b, x[1]);
		x[2] = CryptUtil._add32(c, x[2]);
		x[3] = CryptUtil._add32(d, x[3]);
	},

	_cmn: (q, a, b, x, s, t) => {
		a = CryptUtil._add32(CryptUtil._add32(a, q), CryptUtil._add32(x, t));
		return CryptUtil._add32((a << s) | (a >>> (32 - s)), b);
	},

	_ff: (a, b, c, d, x, s, t) => {
		return CryptUtil._cmn((b & c) | ((~b) & d), a, b, x, s, t);
	},

	_gg: (a, b, c, d, x, s, t) => {
		return CryptUtil._cmn((b & d) | (c & (~d)), a, b, x, s, t);
	},

	_hh: (a, b, c, d, x, s, t) => {
		return CryptUtil._cmn(b ^ c ^ d, a, b, x, s, t);
	},

	_ii: (a, b, c, d, x, s, t) => {
		return CryptUtil._cmn(c ^ (b | (~d)), a, b, x, s, t);
	},

	_md51: (s) => {
		let n = s.length;
		let state = [1732584193, -271733879, -1732584194, 271733878];
		let i;
		for (i = 64; i <= s.length; i += 64) {
			CryptUtil._md5cycle(state, CryptUtil._md5blk(s.substring(i - 64, i)));
		}
		s = s.substring(i - 64);
		let tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
		tail[i >> 2] |= 0x80 << ((i % 4) << 3);
		if (i > 55) {
			CryptUtil._md5cycle(state, tail);
			for (i = 0; i < 16; i++) tail[i] = 0;
		}
		tail[14] = n * 8;
		CryptUtil._md5cycle(state, tail);
		return state;
	},

	_md5blk: (s) => {
		let md5blks = [];
		for (let i = 0; i < 64; i += 4) {
			md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
		}
		return md5blks;
	},

	_hex_chr: "0123456789abcdef".split(""),

	_rhex: (n) => {
		let s = "";
		for (let j = 0; j < 4; j++) {
			s += CryptUtil._hex_chr[(n >> (j * 8 + 4)) & 0x0F] + CryptUtil._hex_chr[(n >> (j * 8)) & 0x0F];
		}
		return s;
	},

	_add32: (a, b) => {
		return (a + b) & 0xFFFFFFFF;
	},
	// endregion

	hex: (x) => {
		for (let i = 0; i < x.length; i++) {
			x[i] = CryptUtil._rhex(x[i]);
		}
		return x.join("");
	},

	hex2Dec (hex) {
		return parseInt(`0x${hex}`);
	},

	md5: (s) => {
		return CryptUtil.hex(CryptUtil._md51(s));
	},

	/**
	 * Based on Java's implementation.
	 * @param obj An object to hash.
	 * @return {*} An integer hashcode for the object.
	 */
	hashCode (obj) {
		if (typeof obj === "string") {
			if (!obj) return 0;
			let h = 0;
			for (let i = 0; i < obj.length; ++i) h = 31 * h + obj.charCodeAt(i);
			return h;
		} else if (typeof obj === "number") return obj;
		else throw new Error(`No hashCode implementation for ${obj}`);
	},

	uid () { // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
		if (RollerUtil.isCrypto()) {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
		} else {
			let d = Date.now();
			if (typeof performance !== "undefined" && typeof performance.now === "function") {
				d += performance.now();
			}
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
				const r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
			});
		}
	},
};

// COLLECTIONS =========================================================================================================
CollectionUtil = {
	ObjectSet: class ObjectSet {
		constructor () {
			this.map = new Map();
			this[Symbol.iterator] = this.values;
		}

		// Each inserted element has to implement _toIdString() method that returns a string ID.
		// Two objects are considered equal if their string IDs are equal.
		add (item) {
			this.map.set(item._toIdString(), item);
		}

		values () {
			return this.map.values();
		}
	},

	setEq (a, b) {
		if (a.size !== b.size) return false;
		for (const it of a) if (!b.has(it)) return false;
		return true;
	},

	setDiff (set1, set2) {
		return new Set([...set1].filter(it => !set2.has(it)));
	},

	deepEquals (a, b) {
		if (CollectionUtil._eq_sameValueZeroEqual(a, b)) return true;
		if (a && b && typeof a === "object" && typeof b === "object") {
			if (CollectionUtil._eq_isPlainObject(a) && CollectionUtil._eq_isPlainObject(b)) return CollectionUtil._eq_areObjectsEqual(a, b);
			const arrayA = Array.isArray(a);
			const arrayB = Array.isArray(b);
			if (arrayA || arrayB) return arrayA === arrayB && CollectionUtil._eq_areArraysEqual(a, b);
			const setA = a instanceof Set;
			const setB = b instanceof Set;
			if (setA || setB) return setA === setB && CollectionUtil.setEq(a, b);
			return CollectionUtil._eq_areObjectsEqual(a, b);
		}
		return false;
	},

	// This handles the NaN != NaN case; ignore linter complaints
	// eslint-disable-next-line no-self-compare
	_eq_sameValueZeroEqual: (a, b) => a === b || (a !== a && b !== b),
	_eq_isPlainObject: (value) => value.constructor === Object || value.constructor == null,
	_eq_areObjectsEqual (a, b) {
		const keysA = Object.keys(a);
		const { length } = keysA;
		if (Object.keys(b).length !== length) return false;
		for (let i = 0; i < length; i++) {
			if (!b.hasOwnProperty(keysA[i])) return false;
			if (!CollectionUtil.deepEquals(a[keysA[i]], b[keysA[i]])) return false;
		}
		return true;
	},
	_eq_areArraysEqual (a, b) {
		const { length } = a;
		if (b.length !== length) return false;
		for (let i = 0; i < length; i++) if (!CollectionUtil.deepEquals(a[i], b[i])) return false;
		return true;
	},
};

Array.prototype.last = Array.prototype.last || function (arg) {
	if (arg !== undefined) this[this.length - 1] = arg;
	else return this[this.length - 1];
};

Array.prototype.filterIndex = Array.prototype.filterIndex || function (fnCheck) {
	const out = [];
	this.forEach((it, i) => {
		if (fnCheck(it)) out.push(i);
	});
	return out;
};

Array.prototype.equals = Array.prototype.equals || function (array2) {
	const array1 = this;
	if (!array1 && !array2) return true;
	else if ((!array1 && array2) || (array1 && !array2)) return false;

	let temp = [];
	if ((!array1[0]) || (!array2[0])) return false;
	if (array1.length !== array2.length) return false;
	let key;
	// Put all the elements from array1 into a "tagged" array
	for (let i = 0; i < array1.length; i++) {
		key = `${(typeof array1[i])}~${array1[i]}`; // Use "typeof" so a number 1 isn't equal to a string "1".
		if (temp[key]) temp[key]++;
		else temp[key] = 1;
	}
	// Go through array2 - if same tag missing in "tagged" array, not equal
	for (let i = 0; i < array2.length; i++) {
		key = `${(typeof array2[i])}~${array2[i]}`;
		if (temp[key]) {
			if (temp[key] === 0) return false;
			else temp[key]--;
		} else return false;
	}
	return true;
};

Array.prototype.partition = Array.prototype.partition || function (fnIsValid) {
	return this.reduce(([pass, fail], elem) => fnIsValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]], [[], []]);
};

Array.prototype.getNext = Array.prototype.getNext || function (curVal) {
	let ix = this.indexOf(curVal);
	if (!~ix) throw new Error("Value was not in array!");
	if (++ix >= this.length) ix = 0;
	return this[ix];
};

Array.prototype.shuffle = Array.prototype.shuffle || function () {
	for (let i = 0; i < 10000; ++i) this.sort(() => Math.random() - 0.5);
	return this;
};

/** Map each array item to a k:v pair, then flatten them into one object. */
Array.prototype.mergeMap = Array.prototype.mergeMap || function (fnMap) {
	return this.map((...args) => fnMap(...args)).reduce((a, b) => Object.assign(a, b), {});
};

/** Map each item via an async function, awaiting for each to complete before starting the next. */
Array.prototype.pSerialAwaitMap = Array.prototype.pSerialAwaitMap || async function (fnMap) {
	const out = [];
	const len = this.length;
	for (let i = 0; i < len; ++i) out.push(await fnMap(this[i], i));
	return out;
};

Array.prototype.unique = Array.prototype.unique || function (fnGetProp) {
	const seen = new Set();
	return this.filter((...args) => {
		const val = fnGetProp ? fnGetProp(...args) : args[0];
		if (seen.has(val)) return false;
		seen.add(val);
		return true;
	});
};

Array.prototype.zip = Array.prototype.zip || function (otherArray) {
	const out = [];
	const len = Math.max(this.length, otherArray.length);
	for (let i = 0; i < len; ++i) {
		out.push([this[i], otherArray[i]]);
	}
	return out;
};

Array.prototype.nextWrap = Array.prototype.nextWrap || function (item) {
	const ix = this.indexOf(item);
	if (~ix) {
		if (ix + 1 < this.length) return this[ix + 1];
		else return this[0];
	} else return this.last();
};

Array.prototype.prevWrap = Array.prototype.prevWrap || function (item) {
	const ix = this.indexOf(item);
	if (~ix) {
		if (ix - 1 >= 0) return this[ix - 1];
		else return this.last();
	} else return this[0];
};

Array.prototype.sum = Array.prototype.sum || function () {
	let tmp = 0;
	const len = this.length;
	for (let i = 0; i < len; ++i) tmp += this[i];
	return tmp;
};

Array.prototype.mean = Array.prototype.mean || function () {
	return this.sum() / this.length;
};

Array.prototype.meanAbsoluteDeviation = Array.prototype.meanAbsoluteDeviation || function () {
	const mean = this.mean();
	return (this.map(num => Math.abs(num - mean)) || []).mean();
};

// OVERLAY VIEW ========================================================================================================
/**
 * Relies on:
 * - page implementing HashUtil's `loadSubHash` with handling to show/hide the book view based on hashKey changes
 * - page running no-argument `loadSubHash` when `hashchange` occurs
 *
 * @param opts Options object.
 * @param opts.hashKey to use in the URL so that forward/back can open/close the view
 * @param opts.$openBtn jQuery-selected button to bind click open/close
 * @param opts.noneVisibleMsg "error" message to display if user has not selected any viewable content
 * @param opts.pageTitle Title.
 * @param opts.state State to modify when opening/closing.
 * @param opts.stateKey Key in state to set true/false when opening/closing.
 * @param opts.popTblGetNumShown function which should populate the view with HTML content and return the number of items displayed
 * @param [opts.hasPrintColumns] True if the overlay should contain a dropdown for adjusting print columns.
 * @constructor
 */
function PrintModeView (opts) {
	opts = opts || {};
	const { hashKey, $openBtn, noneVisibleMsg, pageTitle, popTblGetNumShown, isFlex, state, stateKey } = opts;

	if (hashKey && stateKey) throw new Error();

	this.hashKey = hashKey;
	this.stateKey = stateKey;
	this.state = state;
	this.$openBtn = $openBtn;
	this.noneVisibleMsg = noneVisibleMsg;
	this.popTblGetNumShown = popTblGetNumShown;

	this.active = false;
	this._$body = null;
	this._$wrpBook = null;

	this._$wrpRenderedContent = null;
	this._$wrpNoneShown = null;
	this._doRenderContent = null; // N.B. currently unused, but can be used to refresh the contents of the view

	this.$openBtn.off("click").on("click", () => {
		if (this.stateKey) {
			this.state[this.stateKey] = true;
		} else {
			Hist.cleanSetHash(`${window.location.hash}${HASH_PART_SEP}${this.hashKey}${HASH_SUB_KV_SEP}true`);
		}
	});

	this._doHashTeardown = () => {
		if (this.stateKey) {
			this.state[this.stateKey] = false;
		} else {
			Hist.cleanSetHash(window.location.hash.replace(`${this.hashKey}${HASH_SUB_KV_SEP}true`, ""));
		}
	};

	this._renderContent = async ($wrpContent, $dispName, $wrpControlsToPass) => {
		this._$wrpRenderedContent = this._$wrpRenderedContent
			? this._$wrpRenderedContent.empty()
			: $$`<div class="prntv__scroller h-100 overflow-y-auto ${isFlex ? "flex" : ""}">${$wrpContent}</div>`.appendTo(this._$wrpBook);

		const numShown = await this.popTblGetNumShown($wrpContent, $dispName, $wrpControlsToPass);

		if (numShown) {
			if (this._$wrpNoneShown) {
				this._$wrpNoneShown.remove();
				this._$wrpNoneShown = null;
			}
		} else {
			if (!this._$wrpNoneShown) {
				const $btnClose = $(`<button class="btn btn-default">Close</button>`)
					.click(() => this._doHashTeardown());

				this._$wrpNoneShown = $$`<div class="w-100 flex-col no-shrink prntv__footer mb-3">
					<div class="mb-2 flex-vh-center"><span class="initial-message">${this.noneVisibleMsg}</span></div>
					<div class="flex-vh-center">${$btnClose}</div>
				</div>`.appendTo(this._$wrpBook);
			}
		}
	};

	// NOTE: Avoid using `flex` css, as it doesn't play nice with printing
	this.pOpen = async () => {
		if (this.active) return;
		this.active = true;
		document.title = `${pageTitle} - Pf2eTools`;

		this._$body = $(`body`);
		this._$wrpBook = $(`<div class="prntv"></div>`);

		this._$body.css("overflow", "hidden");
		this._$body.addClass("prntv-active");

		const $btnClose = $(`<span class="delete-icon glyphicon glyphicon-remove"></span>`)
			.click(() => this._doHashTeardown());
		const $dispName = $(`<div></div>`); // pass this to the content function to allow it to set a main header
		$$`<div class="prntv__spacer-name split-v-center no-shrink">${$dispName}${$btnClose}</div>`.appendTo(this._$wrpBook);

		// region controls
		// Optionally usable "controls" section at the top of the pane
		const $wrpControls = $(`<div class="w-100 flex-col prntv__wrp-controls"></div>`)
			.appendTo(this._$wrpBook);

		let $wrpControlsToPass = $wrpControls;
		if (opts.hasPrintColumns) {
			$wrpControls.addClass("px-2 mt-2");

			const injectPrintCss = (cols) => {
				$(`#prntv__print-style`).remove();
				$(`<style media="print" id="prntv__print-style">.prntv__wrp { column-count: ${cols}; }</style>`)
					.appendTo($(document.body))
			};

			const lastColumns = StorageUtil.syncGetForPage(PrintModeView._PRINT_VIEW_COLUMNS_K);

			const $selColumns = $(`<select class="form-control input-sm">
				<option value="0">Two (book style)</option>
				<option value="1">One</option>
			</select>`)
				.change(() => {
					const val = Number($selColumns.val());
					if (val === 0) injectPrintCss(2);
					else injectPrintCss(1);

					StorageUtil.syncSetForPage(PrintModeView._PRINT_VIEW_COLUMNS_K, val);
				});
			if (lastColumns != null) $selColumns.val(lastColumns);
			$selColumns.change();

			$wrpControlsToPass = $$`<div class="w-100 flex">
				<div class="flex-vh-center"><div class="mr-2 no-wrap help--subtle" title="Applied when printing the page.">Print columns:</div>${$selColumns}</div>
			</div>`.appendTo($wrpControls);
		}
		// endregion

		const $wrpContent = $(`<div class="prntv__wrp p-2"></div>`);

		await this._renderContent($wrpContent, $dispName, $wrpControlsToPass);

		this._pRenderContent = () => this._renderContent($wrpContent, $dispName, $wrpControlsToPass);

		this._$wrpBook.append(`<style media="print">.pf2-trait { border-color: #ccc; }</style>`);
		this._$body.append(this._$wrpBook);
	};

	this.teardown = () => {
		if (this.active) {
			this._$body.css("overflow", "");
			this._$body.removeClass("prntv-active");
			this._$wrpBook.remove();
			this.active = false;

			this._$wrpRenderedContent = null;
			this._$wrpNoneShown = null;
			this._pRenderContent = null;
		}
	};

	this.pHandleSub = (sub) => {
		if (this.stateKey) return; // Assume anything with state will handle this itself.

		const bookViewHash = sub.find(it => it.startsWith(this.hashKey));
		if (bookViewHash && UrlUtil.unpackSubHash(bookViewHash)[this.hashKey][0] === "true") return this.pOpen();
		else this.teardown();
	};
}

PrintModeView._PRINT_VIEW_COLUMNS_K = "printViewColumns";

// CONTENT EXCLUSION ===================================================================================================
ExcludeUtil = {
	isInitialised: false,
	_excludes: null,

	async pInitialise () {
		ExcludeUtil.pSave = MiscUtil.throttle(ExcludeUtil._pSave, 50);
		try {
			ExcludeUtil._excludes = await StorageUtil.pGet(VeCt.STORAGE_EXCLUDES) || [];
			ExcludeUtil._excludes = ExcludeUtil._excludes.filter(it => it.hash); // remove legacy rows
		} catch (e) {
			JqueryUtil.doToast({
				content: "Error when loading content blacklist! Purged blacklist data. (See the log for more information.)",
				type: "danger",
			});
			try {
				await StorageUtil.pRemove(VeCt.STORAGE_EXCLUDES);
			} catch (e) {
				setTimeout(() => {
					throw e
				});
			}
			ExcludeUtil._excludes = null;
			window.location.hash = "";
			setTimeout(() => {
				throw e
			});
		}
		ExcludeUtil.isInitialised = true;
	},

	getList () {
		return ExcludeUtil._excludes || [];
	},

	async pSetList (toSet) {
		ExcludeUtil._excludes = toSet;
		await ExcludeUtil.pSave();
	},

	_excludeCount: 0,
	/**
	 * @param hash
	 * @param category
	 * @param source
	 * @param [opts]
	 * @param [opts.isNoCount]
	 */
	isExcluded (hash, category, source, opts) {
		if (!ExcludeUtil._excludes || !ExcludeUtil._excludes.length) return false;
		if (!source) throw new Error(`Entity had no source!`);
		opts = opts || {};

		source = source.source || source;
		const out = !!ExcludeUtil._excludes.find(row => (row.source === "*" || row.source === source) && (row.category === "*" || row.category === category) && (row.hash === "*" || row.hash === hash));
		if (out && !opts.isNoCount) ++ExcludeUtil._excludeCount;
		return out;
	},

	checkShowAllExcluded (list, $pagecontent) {
		if ((!list.length && ExcludeUtil._excludeCount) || (list.length > 0 && list.length === ExcludeUtil._excludeCount)) {
			$pagecontent.html(`
				<div class="initial-message">(Content <a href="blacklist.html">blacklisted</a>)</div>
			`);
		}
	},

	addExclude (displayName, hash, category, source) {
		if (!ExcludeUtil._excludes.find(row => row.source === source && row.category === category && row.hash === hash)) {
			ExcludeUtil._excludes.push({ displayName, hash, category, source });
			ExcludeUtil.pSave();
			return true;
		}
		return false;
	},

	removeExclude (hash, category, source) {
		const ix = ExcludeUtil._excludes.findIndex(row => row.source === source && row.category === category && row.hash === hash);
		if (~ix) {
			ExcludeUtil._excludes.splice(ix, 1);
			ExcludeUtil.pSave();
		}
	},

	async _pSave () {
		return StorageUtil.pSet(VeCt.STORAGE_EXCLUDES, ExcludeUtil._excludes);
	},

	// The throttled version, available post-initialisation
	async pSave () { /* no-op */
	},

	resetExcludes () {
		ExcludeUtil._excludes = [];
		ExcludeUtil.pSave();
	},
};

// ENCOUNTERS ==========================================================================================================
EncounterUtil = {
	async pGetInitialState () {
		if (await EncounterUtil._pHasSavedStateLocal()) {
			if (await EncounterUtil._hasSavedStateUrl()) {
				return {
					type: "url",
					data: EncounterUtil._getSavedStateUrl(),
				};
			} else {
				return {
					type: "local",
					data: await EncounterUtil._pGetSavedStateLocal(),
				};
			}
		} else return null;
	},

	_hasSavedStateUrl () {
		return window.location.hash.length && Hist.getSubHash(EncounterUtil.SUB_HASH_PREFIX) != null;
	},

	_getSavedStateUrl () {
		let out = null;
		try {
			out = JSON.parse(decodeURIComponent(Hist.getSubHash(EncounterUtil.SUB_HASH_PREFIX)));
		} catch (e) {
			setTimeout(() => {
				throw e;
			});
		}
		Hist.setSubhash(EncounterUtil.SUB_HASH_PREFIX, null);
		return out;
	},

	async _pHasSavedStateLocal () {
		return !!StorageUtil.pGet(VeCt.STORAGE_ENCOUNTER);
	},

	async _pGetSavedStateLocal () {
		try {
			return await StorageUtil.pGet(VeCt.STORAGE_ENCOUNTER);
		} catch (e) {
			JqueryUtil.doToast({
				content: "Error when loading encounters! Purged encounter data. (See the log for more information.)",
				type: "danger",
			});
			await StorageUtil.pRemove(VeCt.STORAGE_ENCOUNTER);
			setTimeout(() => {
				throw e;
			});
		}
	},

	async pDoSaveState (toSave) {
		StorageUtil.pSet(VeCt.STORAGE_ENCOUNTER, toSave);
	},

	async pGetSavedState () {
		const saved = await StorageUtil.pGet(EncounterUtil.SAVED_ENCOUNTER_SAVE_LOCATION);
		return saved || {};
	},

	getEncounterName (encounter) {
		if (encounter.l && encounter.l.items && encounter.l.items.length) {
			const largestCount = encounter.l.items.sort((a, b) => SortUtil.ascSort(Number(b.c), Number(a.c)))[0];
			const name = decodeURIComponent(largestCount.h.split(HASH_LIST_SEP)[0]).toTitleCase();
			return `Encounter with ${name} ×${largestCount.c}`;
		} else return "(Unnamed Encounter)"
	},
};
EncounterUtil.SUB_HASH_PREFIX = "encounter";
EncounterUtil.SAVED_ENCOUNTER_SAVE_LOCATION = "ENCOUNTER_SAVED_STORAGE";

// RUNEITEMS ===========================================================================================================
RuneItemUtil = {

	_hasSavedStateUrl () {
		return window.location.hash.length && Hist.getSubHash(RuneItemUtil.SUB_HASH_PREFIX) != null;
	},

	_getSavedStateUrl () {
		let out = null;
		try {
			out = JSON.parse(decodeURIComponent(Hist.getSubHash(RuneItemUtil.SUB_HASH_PREFIX)));
		} catch (e) {
			setTimeout(() => {
				throw e;
			});
		}
		Hist.setSubhash(RuneItemUtil.SUB_HASH_PREFIX, null);
		return out;
	},

	async _pHasSavedStateLocal () {
		return !!StorageUtil.pGet(VeCt.STORAGE_RUNEITEM);
	},

	async _pGetSavedStateLocal () {
		try {
			return await StorageUtil.pGet(VeCt.STORAGE_RUNEITEM);
		} catch (e) {
			JqueryUtil.doToast({
				content: "Error when loading runeitems! Purged runeitems data. (See the log for more information.)",
				type: "danger",
			});
			await StorageUtil.pRemove(VeCt.STORAGE_RUNEITEM);
			setTimeout(() => {
				throw e;
			});
		}
	},

	async pDoSaveState (toSave) {
		StorageUtil.pSet(VeCt.STORAGE_RUNEITEM, toSave);
	},

	async pGetSavedState () {
		const saved = await StorageUtil.pGet(RuneItemUtil.SAVED_RUNEITEM_SAVE_LOCATION);
		return saved || {};
	},

};
RuneItemUtil.SUB_HASH_PREFIX = "runeitem";
RuneItemUtil.SAVED_RUNEITEM_SAVE_LOCATION = "RUNEITEM_SAVED_STORAGE";

// EXTENSIONS ==========================================================================================================
ExtensionUtil = {
	ACTIVE: false,

	_doSend (type, data) {
		const detail = MiscUtil.copy({ type, data });
		window.dispatchEvent(new CustomEvent("rivet.send", { detail }));
	},

	async pDoSendStats (evt, ele) {
		const $parent = $(ele).closest(`th.rnd-name`);
		const page = $parent.attr("data-page");
		const source = $parent.attr("data-source");
		const hash = $parent.attr("data-hash");
		const extensionData = $parent.attr("data-extension");

		if (page && source && hash) {
			let toSend = await Renderer.hover.pCacheAndGet(page, source, hash);

			if (extensionData) {
				switch (page) {
					case UrlUtil.PG_BESTIARY: {
						toSend = await scaleCreature.scale(toSend, Number(extensionData));
					}
				}
			}

			ExtensionUtil._doSend("entity", { page, entity: toSend, isTemp: !!evt.shiftKey });
		}
	},

	doSendRoll (data) {
		ExtensionUtil._doSend("roll", data);
	},
};
if (typeof window !== "undefined") window.addEventListener("rivet.active", () => ExtensionUtil.ACTIVE = true);

// LOCKS ===============================================================================================================
VeLock = function () {
	this._lockMeta = null;

	this.pLock = async () => {
		while (this._lockMeta) await this._lockMeta.lock;
		let unlock = null;
		const lock = new Promise(resolve => unlock = resolve);
		this._lockMeta = {
			lock,
			unlock,
		}
	};

	this.unlock = () => {
		const lockMeta = this._lockMeta;
		if (lockMeta) {
			this._lockMeta = null;
			lockMeta.unlock();
		}
	};
}
BrewUtil._lockHandleBrewJson = new VeLock();


//////////////////////////////////////////////////////////////////////////////////////////////////////

// ENTRY RENDERING =====================================================================================================
/*
 * // EXAMPLE USAGE //
 *
 * const entryRenderer = new Renderer();
 *
 * const topLevelEntry = mydata[0];
 * // prepare an array to hold the string we collect while recursing
 * const textStack = [];
 *
 * // recurse through the entry tree
 * entryRenderer.renderEntries(topLevelEntry, textStack);
 *
 * // render the final product by joining together all the collected strings
 * $("#myElement").html(toDisplay.join(""));
 */
function Renderer () {
	this.wrapperTag = "div";
	this.baseUrl = "";
	this.baseMediaUrls = {};

	this._lazyImages = false;
	this._firstSection = true;
	this._isAddHandlers = true;
	this._headerIndex = 1;
	this._tagExportDict = null;
	this._trackTitles = { enabled: false, titles: {} };
	this._enumerateTitlesRel = { enabled: false, titles: {} };
	this._hooks = {};
	this._fnPostProcess = null;
	this._extraSourceClasses = null;
	this._isInternalLinksDisabled = false;
	this._fnsGetStyleClasses = {};

	/**
	 * Enables/disables lazy-load image rendering.
	 * @param bool true to enable, false to disable.
	 */
	this.setLazyImages = function (bool) {
		// hard-disable lazy loading if the Intersection API is unavailable (e.g. under iOS 12)
		if (typeof IntersectionObserver === "undefined") this._lazyImages = false;
		else this._lazyImages = !!bool;
		return this;
	};

	/**
	 * Set the tag used to group rendered elements
	 * @param tag to use
	 */
	this.setWrapperTag = function (tag) {
		this.wrapperTag = tag;
		return this;
	};

	/**
	 * Set the base url for rendered links.
	 * Usage: `renderer.setBaseUrl("https://www.example.com/")` (note the "http" prefix and "/" suffix)
	 * @param url to use
	 */
	this.setBaseUrl = function (url) {
		this.baseUrl = url;
		return this;
	};

	this.setBaseMediaUrl = function (mediaDir, url) {
		this.baseMediaUrls[mediaDir] = url;
		return this;
	}

	/**
	 * Other sections should be prefixed with a vertical divider
	 * @param bool
	 */
	this.setFirstSection = function (bool) {
		this._firstSection = bool;
		return this;
	};

	/**
	 * Disable adding JS event handlers on elements.
	 * @param bool
	 */
	this.setAddHandlers = function (bool) {
		this._isAddHandlers = bool;
		return this;
	};

	/**
	 * Add a post-processing function which acts on the final rendered strings from a root call.
	 * @param fn
	 */
	this.setFnPostProcess = function (fn) {
		this._fnPostProcess = fn;
		return this;
	};

	/**
	 * Specify a list of extra classes to be added to those rendered on entries with sources.
	 * @param arr
	 */
	this.setExtraSourceClasses = function (arr) {
		this._extraSourceClasses = arr;
		return this;
	};

	/**
	 * Headers are ID'd using the attribute `data-title-index` using an incrementing int. This resets it to 1.
	 */
	this.resetHeaderIndex = function () {
		this._headerIndex = 1;
		this._trackTitles.titles = {};
		this._enumerateTitlesRel.titles = {};
		return this;
	};

	/**
	 * Pass an object to have the renderer export lists of found @-tagged content during renders
	 *
	 * @param toObj the object to fill with exported data. Example results:
	 * 			{
	 *				commoner_mm: {page: "bestiary.html", source: "MM", hash: "commoner_mm"},
	 *				storm%20giant_mm: {page: "bestiary.html", source: "MM", hash: "storm%20giant_mm"},
	 *				detect%20magic_phb: {page: "spells.html", source: "PHB", hash: "detect%20magic_phb"}
	 *			}
	 * 			These results intentionally match those used for hover windows, so can use the same cache/loading paths
	 */
	this.doExportTags = function (toObj) {
		this._tagExportDict = toObj;
		return this;
	};

	/**
	 * Reset/disable tag export
	 */
	this.resetExportTags = function () {
		this._tagExportDict = null;
		return this;
	};

	/** Used by Foundry config. */
	this.setInternalLinksDisabled = function (bool) {
		this._isInternalLinksDisabled = bool;
		return this;
	};

	this.isInternalLinksDisabled = function () {
		return !!this._isInternalLinksDisabled;
	};

	/** Bind function which apply exta CSS classes to entry/list renders.  */
	this.setFnGetStyleClasses = function (identifier, fn) {
		this._fnsGetStyleClasses[identifier] = fn;
		return this;
	};

	/**
	 * If enabled, titles with the same name will be given numerical identifiers.
	 * This identifier is stored in `data-title-relative-index`
	 */
	this.setEnumerateTitlesRel = function (bool) {
		this._enumerateTitlesRel.enabled = bool;
		return this;
	};

	this._getEnumeratedTitleRel = function (name) {
		if (this._enumerateTitlesRel.enabled && name) {
			const clean = name.toLowerCase();
			this._enumerateTitlesRel.titles[clean] = this._enumerateTitlesRel.titles[clean] || 0;
			return `data-title-relative-index="${this._enumerateTitlesRel.titles[clean]++}"`;
		} else return "";
	};

	this.setTrackTitles = function (bool) {
		this._trackTitles.enabled = bool;
		return this;
	};

	this.getTrackedTitles = function () {
		return MiscUtil.copy(this._trackTitles.titles);
	};

	this._handleTrackTitles = function (name) {
		if (this._trackTitles.enabled) {
			this._trackTitles.titles[this._headerIndex] = name;
		}
	};

	this.addHook = function (entryType, hookType, fnHook) {
		((this._hooks[entryType] = this._hooks[entryType] || {})[hookType] =
			this._hooks[entryType][hookType] || []).push(fnHook);
	};

	this.removeHook = function (entryType, hookType, fnHook) {
		const ix = ((this._hooks[entryType] = this._hooks[entryType] || {})[hookType] =
			this._hooks[entryType][hookType] || []).indexOf(fnHook);
		if (~ix) this._hooks[entryType][hookType].splice(ix, 1);
	};

	this._getHooks = function (entryType, hookType) {
		return (this._hooks[entryType] || {})[hookType] || [];
	};

	/**
	 * Recursively walk down a tree of "entry" JSON items, adding to a stack of strings to be finally rendered to the
	 * page. Note that this function does _not_ actually do the rendering, see the example code above for how to display
	 * the result.
	 *
	 * @param entry An "entry" usually defined in JSON. A schema is available in tests/schema
	 * @param textStack A reference to an array, which will hold all our strings as we recurse
	 * @param options Render options.
	 * @param options.prefix String to prefix rendered lines with.
	 */
	this.recursiveRender = function (entry, textStack, options) {
		if (entry instanceof Array) {
			entry.forEach(nxt => this.recursiveRender(nxt, textStack, options));
			return;
		}

		// respect the API of the original, but set up for using string concatenations
		if (textStack.length === 0) textStack[0] = "";
		else textStack.reverse();

		// initialise meta
		const meta = {};
		meta._typeStack = [];

		this._recursiveRender(entry, textStack, meta, options);
		if (this._fnPostProcess) textStack[0] = this._fnPostProcess(textStack[0]);
		textStack.reverse();
	};

	/**
	 * Inner rendering code. Uses string concatenation instead of an array stack, for ~2x the speed.
	 * @param entry As above.
	 * @param textStack As above.
	 * @param meta As above, with the addition of...
	 * @param options
	 *          .prefix The (optional) prefix to be added to the textStack before whatever is added by the current call
	 *          .suffix The (optional) suffix to be added to the textStack after whatever is added by the current call
	 * @private
	 */
	this._recursiveRender = function (entry, textStack, meta, options) {
		if (entry == null) return; // Avoid dying on nully entries
		if (!textStack) throw new Error("Missing stack!");
		if (!meta) throw new Error("Missing metadata!");

		options = options || {};
		if (options.pf2StatFix && !options.prefix && !options.suffix) {
			options.prefix = `<p class="pf2-stat__text">`;
			options.suffix = "</p>";
		}

		meta._didRenderPrefix = false;
		meta._didRenderSuffix = false;

		if (typeof entry === "object") {
			// the root entry (e.g. "Rage" in barbarian "classFeatures") is assumed to be of type "entries"
			const type = entry.type == null ? "entries" : entry.type;

			meta._typeStack.push(type);

			switch (type) {
				// recursive
				case "section":
				case "chapter":
				case "pf2-h1":
					this._renderPf2H1(entry, textStack, meta, options);
					break;
				case "pf2-h1-flavor":
					this._renderPf2H1Flavor(entry, textStack, meta, options);
					break;
				case "pf2-h2":
					this._renderPf2H2(entry, textStack, meta, options);
					break;
				case "pf2-h3":
					this._renderPf2H3(entry, textStack, meta, options);
					break;
				case "pf2-h4":
					this._renderPf2H4(entry, textStack, meta, options);
					break;
				case "pf2-h5":
					this._renderPf2H5(entry, textStack, meta, options);
					break;
				case "pf2-sidebar":
					this._renderPf2Sidebar(entry, textStack, meta, options);
					break;
				case "pf2-inset":
					this._renderPf2Inset(entry, textStack, meta, options);
					break;
				case "pf2-tips-box":
					this._renderPf2TipsBox(entry, textStack, meta, options);
					break;
				case "pf2-sample-box":
					this._renderPf2SampleBox(entry, textStack, meta, options);
					break;
				case "pf2-beige-box":
					this._renderPf2SampleBox(entry, textStack, meta, { beige: true, ...options });
					break;
				case "pf2-red-box":
					this._renderPf2RedBox(entry, textStack, meta, options);
					break;
				case "pf2-brown-box":
					this._renderPf2BrownBox(entry, textStack, meta, options);
					break;
				case "pf2-key-ability":
					this._renderPf2KeyAbility(entry, textStack, meta, options);
					break;
				case "pf2-key-box":
					this._renderPf2KeyBox(entry, textStack, meta, options);
					break;
				case "pf2-title":
					this._renderPf2Title(entry, textStack, meta, options);
					break;
				case "pf2-options":
					this._renderPf2Options(entry, textStack, meta, options);
					break;
				case "entries":
					this._renderEntries(entry, textStack, meta, options);
					break;
				case "text":
					this._renderText(entry, textStack, meta, options);
					break;
				case "entriesOtherSource":
					this._renderEntriesOtherSource(entry, textStack, meta, options);
					break;
				case "list":
					this._renderList(entry, textStack, meta, options);
					break;
				case "table":
					this._renderTable(entry, textStack, meta, options);
					break;
				case "tableGroup":
					this._renderTableGroup(entry, textStack, meta, options);
					break;
				case "paper":
					this._renderPaper(entry, textStack, meta, options);
					break;
				case "quote":
					this._renderQuote(entry, textStack, meta, options);
					break

				// pf2-abilities
				case "affliction":
					this._renderAffliction(entry, textStack, meta, options);
					break;
				case "successDegree":
					this._renderSuccessDegree(entry, textStack, meta, options);
					break;
				case "lvlEffect":
					this._renderLeveledEffect(entry, textStack, meta, options);
					break;
				case "attack":
					this._renderAttack(entry, textStack, meta, options);
					break;
				case "ability":
					this._renderAbility(entry, textStack, meta, options);
					break;

				// inline
				case "inline":
					this._renderInline(entry, textStack, meta, options);
					break;
				case "inlineBlock":
					this._renderInlineBlock(entry, textStack, meta, options);
					break;
				case "dice":
					this._renderDice(entry, textStack, meta, options);
					break;
				case "link":
					this._renderLink(entry, textStack, meta, options);
					break;

				// list items
				case "item": this._renderItem(entry, textStack, meta, options); break;

				// entire in-line data records
				case "data":
					this._renderData(entry, textStack, meta, options);
					break;

				// images
				case "image":
					this._renderImage(entry, textStack, meta, options);
					break;
				case "gallery":
					this._renderGallery(entry, textStack, meta, options);
					break;

				// homebrew changes
				case "homebrew":
					this._renderHomebrew(entry, textStack, meta, options);
					break;

				// misc
				case "code":
					this._renderCode(entry, textStack, meta, options);
					break;
				case "hr":
					this._renderHr(entry, textStack, meta, options);
					break;
			}

			meta._typeStack.pop();
		} else if (typeof entry === "string") { // block
			this._renderPrefix(entry, textStack, meta, options);
			this._renderString(entry, textStack, meta, options);
			this._renderSuffix(entry, textStack, meta, options);
		} else { // block
			// for ints or any other types which do not require specific rendering
			this._renderPrefix(entry, textStack, meta, options);
			this._renderPrimitive(entry, textStack, meta, options);
			this._renderSuffix(entry, textStack, meta, options);
		}
	};

	this._renderPrefix = function (entry, textStack, meta, options) {
		if (meta._didRenderPrefix) return;
		if (options.prefix != null) {
			textStack[0] += options.prefix;
			meta._didRenderPrefix = true;
		}
	};

	this._renderSuffix = function (entry, textStack, meta, options) {
		if (meta._didRenderSuffix) return;
		if (options.suffix != null) {
			textStack[0] += options.suffix;
			meta._didRenderSuffix = true;
		}
	};

	this._renderEntries = function (entry, textStack, meta, options) {
		textStack[0] += `<p>`
		entry.entries.forEach(e => this._recursiveRender(e, textStack, meta, options));
		textStack[0] += `</p>`
	};

	this._renderText = function (entry, textStack, meta, options) {
		entry.entries.forEach(e => this._recursiveRender(e, textStack, meta, { prefix: `<p class="${entry.style || ""}">`, suffix: `</p>` }));
	};

	this._renderEntriesOtherSource = function (entry, textStack, meta, options) {
		this._getReference(entry)
		if (entry.entries && entry.entries.length) {
			textStack[0] += `<div class="pf2-wrp-other-source mb-3">`;
			textStack[0] += `<hr class="hr-other-source">`;
			entry.entries.forEach(e => this._recursiveRender(e, textStack, meta, {
				prefix: `<p class="pf2-other-source">`,
				suffix: `</p>`,
			}));
			textStack[0] += Renderer.utils.getPageP(entry, { prefix: "\u2014", noReprints: true });
			textStack[0] += `</div>`;
		}
	};

	this._renderImage = function (entry, textStack, meta, options) {
		function getStylePart () {
			return entry.maxWidth ? `style="max-width: ${entry.maxWidth}px"` : "";
		}

		if (entry.imageType === "map") textStack[0] += `<div class="rd__wrp-map">`;
		this._renderPrefix(entry, textStack, meta, options);
		textStack[0] += `<div class="float-clear"></div>`;
		textStack[0] += `<div class="${meta._typeStack.includes("gallery") ? "rd__wrp-gallery-image" : ""}">`;

		const href = this._renderImage_getUrl(entry);
		const maxRes = entry.maxRes ? Renderer.utils.getMediaUrl(entry, "maxRes", "img") : null;
		const svg = this._lazyImages && entry.width != null && entry.height != null
			? `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${entry.width}" height="${entry.height}"><rect width="100%" height="100%" fill="#ccc3"></rect></svg>`)}`
			: null;
		textStack[0] += `<div class="${this._renderImage_getWrapperClasses(entry, meta)}">
			<a href="${maxRes || href}" target="_blank" rel="noopener noreferrer" ${entry.title ? `title="${Renderer.stripTags(entry.title)}"` : ""}>
				<img class="${this._renderImage_getImageClasses(entry, meta)}" src="${svg || href}" ${entry.altText ? `alt="${entry.altText}"` : ""} ${svg ? `data-src="${href}"` : ""} ${getStylePart()}>
			</a>
		</div>`;
		if (entry.title || entry.mapRegions) {
			textStack[0] += `<div class="rd__image-title">
				${entry.title ? `<div class="rd__image-title-inner ${entry.title && entry.mapRegions ? "mr-2" : ""}">${this.render(entry.title)}</div>` : ""}
				${entry.mapRegions ? `<button class="btn btn-xs btn-default rd__image-btn-viewer" onclick="RenderMap.pShowViewer(event, this)" data-rd-packed-map="${this._renderImage_getMapRegionData(entry)}"><span class="glyphicon glyphicon-picture"></span> Dynamic Viewer</button>` : ""}
			</div>`;
		} else if (entry._galleryTitlePad) textStack[0] += `<div class="rd__image-title">&nbsp;</div>`;

		textStack[0] += `</div>`;
		this._renderSuffix(entry, textStack, meta, options);
		if (entry.imageType === "map") textStack[0] += `</div>`;
	};

	this._renderImage_getMapRegionData = function (entry) {
		return JSON.stringify(this.getMapRegionData(entry)).escapeQuotes();
	};

	this.getMapRegionData = function (entry) {
		return {
			regions: entry.mapRegions,
			width: entry.width,
			height: entry.height,
			href: this._renderImage_getUrl(entry),
			hrefThumbnail: this._renderImage_getUrlThumbnail(entry),
		};
	};

	this._renderImage_getWrapperClasses = function (entry) {
		const out = ["rd__wrp-image", "relative"];
		if (entry.style) {
			switch (entry.style) {
				case "comic-speaker-left":
					out.push("rd__comic-img-speaker", "rd__comic-img-speaker--left");
					break;
				case "comic-speaker-right":
					out.push("rd__comic-img-speaker", "rd__comic-img-speaker--right");
					break;
			}
		}
		return out.join(" ");
	};

	this._renderImage_getImageClasses = function (entry) {
		const out = ["rd__image"];
		if (entry.style) {
			switch (entry.style) {
				case "deity-symbol":
					out.push("rd__img-small");
					break;
				case "cover":
					out.push("rd__img-cover");
					break;
			}
		}
		return out.join(" ");
	};

	this._renderImage_getUrl = function (entry) {
		return Renderer.utils.getMediaUrl(entry, "href", "img");
	};
	this._renderImage_getUrlThumbnail = function (entry) {
		return Renderer.utils.getMediaUrl(entry, "hrefThumbnail", "img");
	};

	this._renderTableGroup = function (entry, textStack, meta, options) {
		const len = entry.tables.length;
		for (let i = 0; i < len; ++i) {
			const addStyles = `${i === 0 ? "" : "mt-0"} ${i === len - 1 ? "" : "mb-0"}`
			this._renderTable(entry.tables[i], textStack, meta, { addStyles });
		}
	};

	// TODO: Badly formatted rollable tables will ruin everything
	// TODO: Autodetect rollable tables?
	this._renderTable = function (entry, textStack, meta, options) {
		const numCol = Math.max(...entry.rows.map(x => x.type === "multiRow" ? x.rows.map(y => y.length) : x.length).flat());
		const gridTemplate = entry.colSizes ? entry.colSizes.map(x => `${String(x)}fr`).join(" ") : "1fr ".repeat(numCol);
		textStack[0] += `<div class="${entry.style || "pf2-table"} ${this._firstSection ? "mt-0" : ""} ${entry.rollable ? "pf2-table--rollable" : ""} ${options.addStyles || ""}" style="grid-template-columns: ${gridTemplate}">`;
		if (entry.style && entry.style.includes("pf2-box__table--red")) {
			if (entry.colStyles == null) entry.colStyles = Array(numCol).fill("");
			entry.colStyles[0] += " no-border-left";
			entry.colStyles[numCol - 1] += " no-border-right";
		}

		if (entry.name) {
			if (entry.id) {
				textStack[0] += `<div class="pf2-table__caption ${this._firstSection ? "" : "mt-3"}">TABLE ${entry.id}: ${entry.name}</div>`
			} else {
				textStack[0] += `<div class="pf2-table__name ${this._firstSection ? "" : "mt-3"}">${entry.name}</div>`
			}
			this._firstSection = false;
		}
		if (entry.intro) {
			const len = entry.intro.length;
			for (let i = 0; i < len; ++i) {
				let styles = `${entry.introStyles ? entry.introStyles[i] || "" : ""}`
				this._recursiveRender(entry.intro[i], textStack, meta, {
					prefix: `<div class="pf2-table__intro ${styles}">`,
					suffix: "</div>",
				});
			}
		}

		const lenRows = entry.rows.length;
		const labelRowIdx = entry.labelRowIdx ? entry.labelRowIdx : [0];
		let rowParity = 0;
		let idxSpan = 0;

		const renderRow = (row, idxRow, minButton) => {
			const lenCol = row.length;
			const dataStr = idxRow ? this._renderTable_getDataStr(row, entry.rollable) : "";
			if (row.type === "multiRow") {
				row.rows.forEach((r, i) => {
					renderRow(r, idxRow, i === 0 ? minButton : "");
					rowParity = (rowParity + 1) % 2;
				});
				rowParity = (rowParity + 1) % 2;
			} else if (lenCol === numCol) {
				for (let idxCol = 0; idxCol < lenCol; ++idxCol) {
					let styles = this._renderTable_getStyles(entry, idxRow, idxCol, false, rowParity);
					textStack[0] += `<div class="${styles}" ${idxCol ? dataStr : ""}><span>`;
					this._recursiveRender(row[idxCol], textStack, meta);
					textStack[0] += idxCol === lenCol - 1 ? minButton : "";
					textStack[0] += `</span></div>`;
				}
				if (labelRowIdx.includes(idxRow)) {
					rowParity = 0;
				} else {
					rowParity = (rowParity + 1) % 2;
				}
			} else {
				let last_end = 1;
				for (let idxCol = 0; idxCol < lenCol; ++idxCol) {
					let styles = this._renderTable_getStyles(entry, idxRow, idxCol, true, rowParity);
					let span = entry.spans[idxSpan][idxCol];
					if (last_end !== span[0]) {
						textStack[0] += `<div class="${styles}" style="grid-column:${last_end}/${span[0]}" ${idxCol ? dataStr : ""}></div>`;
					}
					textStack[0] += `<div class="${styles}" style="grid-column:${span[0]}/${span[1]}" ${idxCol ? dataStr : ""}><span>${this.render(row[idxCol])}${span[1] === numCol + 1 ? minButton : ""}</span></div>`;
					last_end = span[1];
				}
				if (last_end !== numCol + 1) {
					let styles = this._renderTable_getStyles(entry, idxRow, numCol, true, rowParity);
					textStack[0] += `<div class="${styles}" style="grid-column:${last_end}/${numCol}" ${dataStr}><span>${minButton}</span></div>`;
				}
				if (labelRowIdx.includes(idxRow)) {
					rowParity = 0;
				} else {
					rowParity = (rowParity + 1) % 2;
				}
				idxSpan += 1;
			}
		};

		for (let idxRow = 0; idxRow < lenRows; ++idxRow) {
			const minButton = entry.minimizeTo && entry.minimizeTo[0] === idxRow ? this._renderTable_getMinimizeButton() : "";
			const row = entry.rows[idxRow];
			renderRow(row, idxRow, minButton);
		}

		if (entry.footnotes != null) {
			const len = entry.footnotes.length;
			for (let i = 0; i < len; ++i) {
				let styles = `${entry.footStyles ? entry.footStyles[i] || "" : ""}`
				this._recursiveRender(entry.footnotes[i], textStack, meta, {
					prefix: `<div class="pf2-table__footnote pf2-table--minimize ${styles}">`,
					suffix: "</div>",
				});
			}
		}
		if (entry.outro) {
			const len = entry.outro.length;
			for (let i = 0; i < len; ++i) {
				let styles = `${entry.outroStyles ? entry.outroStyles[i] || "" : ""}`
				this._recursiveRender(entry.outro[i], textStack, meta, {
					prefix: `<div class="pf2-table__outro ${styles}">`,
					suffix: "</div>",
				});
			}
		}

		textStack[0] += `</div>`
	};

	this._renderTable_getMinimizeButton = function () {
		return `<div class="inline-block" style="float: right" onclick="((ele) => {
						$(ele).text($(ele).text().includes('+') ? ' [\u2013]' : ' [+]');
						$(ele).parent().parent().siblings('.pf2-table--minimize').toggle()
					})(this)">[\u2013]</div>`
	}

	this._renderTable_getStyles = function (entry, rowIdx, colIdx, noColStyle, rowParity) {
		const labelRowIdx = entry.labelRowIdx ? entry.labelRowIdx : [0];
		const labelColIdx = entry.labelColIdx ? entry.labelColIdx : [];
		const minTo = entry.minimizeTo && !entry.minimizeTo.includes(rowIdx) ? `pf2-table--minimize` : "";
		let row_styles = ""
		let col_styles = ""
		let cell_styles = ""
		let type_styles = ""
		if (entry.rowStyles && typeof (entry.rowStyles[0]) === "string") {
			row_styles = `${entry.rowStyles ? entry.rowStyles[rowIdx] || "" : ""}`;
		} else if (entry.rowStyles) {
			for (let rs of entry.rowStyles) {
				if (rs.row === rowIdx) {
					row_styles = rs.style;
					break;
				}
			}
		}
		if (!noColStyle && entry.colStyles && typeof (entry.colStyles[0]) === "string") {
			col_styles = `${entry.colStyles ? entry.colStyles[colIdx] || "" : ""}`;
		} else if (!noColStyle && entry.colStyles) {
			for (let cs of entry.colStyles) {
				if (cs.col === rowIdx) {
					col_styles = cs.style;
					break;
				}
			}
		}
		if (entry.cellStyles) {
			for (let cs of entry.cellStyles) {
				if (cs.row === rowIdx && cs.col === colIdx) {
					cell_styles = cs.style;
					break;
				}
			}
		}

		if (labelRowIdx.includes(rowIdx)) {
			type_styles = "pf2-table__label"
		} else if (!noColStyle && labelColIdx.includes(colIdx)) {
			type_styles = "pf2-table__label"
		} else {
			type_styles = `pf2-table__entry ${rowParity ? "odd" : ""}`
		}

		return `${row_styles} ${col_styles} ${cell_styles} ${type_styles} ${minTo}`
	};

	this._renderTable_getDataStr = function (row, roll) {
		if (roll) {
			let min;
			let max;
			const firstCell = String(row.type === "multiRow" ? row.rows[0][0] : row[0]).trim();
			// FIXME
			const mLowHigh = /^(\d+)( or (?:lower|higher|less)$|(\+)$)/i.exec(firstCell);
			if (mLowHigh) {
				if (mLowHigh[2].toLowerCase() === " or lower" || mLowHigh[2].toLowerCase() === " or less") {
					min = -Renderer.dice.POS_INFINITE;
					max = Number(mLowHigh[1]);
				} else {
					min = Number(mLowHigh[1]);
					max = Renderer.dice.POS_INFINITE;
				}
			} else {
				// format: "95-00" or "12"
				// u2012 = figure dash; u2013 = en-dash
				const m = /^(\d+)([-\u2012\u2013](\d+))?$/.exec(firstCell);
				if (m) {
					if (m[1] && !m[2]) {
						min = Number(m[1]);
						max = Number(m[1]);
					} else {
						min = Number(m[1]);
						max = Number(m[3]);
					}
				} else {
					// format: "12+"
					const m = /^(\d+)\+$/.exec(row[0]);
					min = Number(m[1]);
					max = Renderer.dice.POS_INFINITE;
				}
			}

			min = min === 0 ? 100 : min;
			max = max === 0 ? 100 : max;
			return `data-roll-min="${min}" data-roll-max="${max}"`;
		}
		return ``;
	};

	this._getDataString = function (entry) {
		let dataString = "";
		if (entry.source) dataString += `data-source="${entry.source}"`;
		if (entry.data) {
			for (const k in entry.data) {
				if (!k.startsWith("rd-")) continue;
				dataString += ` data-${k}="${`${entry.data[k]}`.escapeQuotes()}"`;
			}
		}
		return dataString;
	};

	this._renderList_getListCssClasses = function (entry, textStack, meta, options) {
		const out = [`rd__list`];
		if (entry.style || entry.columns) {
			if (entry.style) out.push(...entry.style.split(" ").map(it => it.startsWith("pf2") ? it : `rd__${it}`));
			if (entry.columns) out.push(`columns-${entry.columns}`);
		}
		return out.join(" ");
	};

	// FIXME: list styles with sabon/good-ot fonts
	this._renderList = function (entry, textStack, meta, options) {
		if (entry.items) {
			if (entry.name) textStack[0] += `<div class="rd__list-name">${entry.name}</div>`;
			const cssClasses = this._renderList_getListCssClasses(entry, textStack, meta, options);
			textStack[0] += `<ul ${cssClasses ? `class="${cssClasses}"` : ""}>`;
			const isListHang = entry.style && entry.style.split(" ").includes("list-hang");
			const len = entry.items.length;
			for (let i = 0; i < len; ++i) {
				const item = entry.items[i];
				// Special case for child lists -- avoid wrapping in LI tags to avoid double-bullet
				if (item.type !== "list") {
					const className = `${this._getStyleClass(item)}`;
					textStack[0] += `<li class="rd__li ${className}">`;
				}
				// If it's a raw string in a hanging list, wrap it in a div to allow for the correct styling
				if (isListHang && typeof item === "string") textStack[0] += "<div>";
				this._recursiveRender(item, textStack, meta);
				if (isListHang && typeof item === "string") textStack[0] += "</div>";
				if (item.type !== "list") textStack[0] += "</li>";
			}
			textStack[0] += "</ul>";
		}
	};

	this._renderItem = function (entry, textStack, meta, options) {
		this._renderPrefix(entry, textStack, meta, options);
		textStack[0] += `<p class="m-0"><span class="${entry.style || "bold"} list-item-title">${this.render(entry.name)}</span> `;
		if (entry.entry) this._recursiveRender(entry.entry, textStack, meta);
		else if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) this._recursiveRender(entry.entries[i], textStack, meta, { prefix: i > 0 ? `<span class="rd__p-cont-indent">` : "", suffix: i > 0 ? "</span>" : "" });
		}
		textStack[0] += "</p>";
		this._renderSuffix(entry, textStack, meta, options);
	};

	this._renderLeveledEffect = function (entry, textStack, meta, options) {
		if (entry.entries) {
			entry.entries.forEach(e => {
				textStack[0] += `<p class="pf2-stat pf2-stat__section"><strong>${e.range}&nbsp;</strong>${this.render(e.entry)}</p>`;
			});
		}
	}

	this._renderAttack = function (entry, textStack, meta, options) {
		let MAP = -5;
		if (entry.noMAP) MAP = 0;
		if (entry.traits && entry.traits.map(t => t.toLowerCase()).includes("agile")) MAP = -4;
		textStack[0] += `<p class="pf2-stat pf2-stat__section attack">
			<strong>${entry.range}&nbsp;</strong>${this.render("{@as 1}")} ${entry.name}${entry.attack ? this.render(` {@hit ${entry.attack}||${entry.name.uppercaseFirst()}|MAP=${MAP}}`) : ""}${entry.traits != null ? ` ${this.render(`(${entry.traits.map((t) => `{@trait ${t.toLowerCase()}}`).join(", ")})`)}` : ""}, <strong>Damage&nbsp;</strong>${this.render(entry.damage)}${entry.noMAP ? "; no multiple attack penalty" : ""}</p>`;
	};

	this._renderAbility = function (entry, textStack, meta, options) {
		const style = entry.style || "inline";
		switch (style) {
			case "compact":
			case "inline":
				this._renderAbility_compact(entry, textStack, meta, options);
				break;
			case "full":
			case "block":
				this._renderAbility_full(entry, textStack, meta, options);
				break;
		}
	}

	this._renderAbility_full = function (entry, textStack, meta, options) {
		textStack[0] += `<div class="pf2-stat pf2-book--stat">`;
		textStack[0] += Renderer.utils.getNameDiv(entry, { activity: true, type: "" });
		textStack[0] += Renderer.utils.getDividerDiv();
		textStack[0] += Renderer.utils.getTraitsDiv(entry.traits || []);
		textStack[0] += Renderer.ability.getSubHead(entry);
		textStack[0] += Renderer.generic.getRenderedEntries(entry);
		textStack[0] += `</div>`;
	}

	this._renderAbility_compact = function (entry, textStack, meta, options) {
		textStack[0] += `<div class="pf2-stat pf2-stat__section"><span class="pf2-stat__text"><strong>${entry.name != null ? entry.name : "Activate"}</strong>`
		if (entry.activity != null) textStack[0] += ` ${this.render(Parser.timeToFullEntry(entry.activity))}`;
		if (entry.components != null) textStack[0] += ` ${this.render(entry.components.join(", "))}`;
		if (entry.traits && entry.traits.length) textStack[0] += ` (${entry.traits.map(t => this.render(`{@trait ${t.toLowerCase()}}`)).join(", ")})`;
		entry.components != null || entry.traits != null ? textStack[0] += "; " : textStack[0] += "&nbsp;";
		if (entry.cost != null) textStack[0] += `<strong>Cost&nbsp;</strong>${entry.cost}; `;
		if (entry.frequency != null) textStack[0] += `<strong>Frequency&nbsp;</strong>${this.render_addTerm(Parser.freqToFullEntry(entry.frequency))} `;
		if (entry.note != null) textStack[0] += `${this.render(entry.note)}; `;
		if (entry.requirements != null) textStack[0] += `<strong>Requirements&nbsp;</strong>${this.render_addTerm(entry.requirements)} `;
		if (entry.trigger != null) textStack[0] += `<strong>Trigger&nbsp;</strong>${this.render_addTerm(entry.trigger)} `;
		textStack[0] += `${entry.frequency || entry.requirements || entry.trigger || entry.components || (entry.activity && entry.activity.unit === Parser.TM_VARIES) ? "<strong>Effect&nbsp;</strong>" : ""}`;
		if (entry.entries) {
			textStack[0] += `${this.render(entry.entries[0], { isAbility: true })}</span>`;
			for (let i = 1; i < entry.entries.length; i++) {
				textStack[0] += this.render(entry.entries[i], { isAbility: true, pf2StatFix: true });
			}
		} else textStack[0] += "</span>";
		if (entry.special != null) textStack[0] += `<p class="pf2-stat__text"><strong>Special&nbsp;</strong>${this.render(entry.special)}</p>`;
		textStack[0] += `</div>`
	}

	this._renderSuccessDegree = function (entry, textStack, meta, options) {
		Object.keys(entry.entries).forEach(key => {
			textStack[0] += `<span class="pf2-stat pf2-stat__section"><strong>${key}&nbsp;</strong>`;
			if (typeof (entry.entries[key]) === "string") {
				this._recursiveRender(entry.entries[key], textStack, meta, { prefix: "<span>", suffix: "</span>" });
			} else if (Array.isArray(entry.entries[key])) {
				entry.entries[key].forEach((e, idx) => {
					if (idx === 0) this._recursiveRender(e, textStack, meta, { prefix: "<span>", suffix: "</span>" });
					else this._recursiveRender(e, textStack, meta, { prefix: "<span class='pf2-stat__section'>", suffix: "</span>" });
				});
			}
			textStack[0] += `</span>`;
		});
	}

	this._renderAffliction = function (entry, textStack, meta, options) {
		const renderer = Renderer.get();

		// TODO: The spaces seem whack here... make sure this is correct with all entries.
		let traits = []
		if (entry.traits) entry.traits.forEach((t) => traits.push(`{@trait ${t.toLowerCase()}}`));
		if (!options.isAbility) textStack[0] += `<p class="pf2-stat pf2-stat__section">`
		if (entry.name) textStack[0] += `<strong>${entry.name}&nbsp;</strong>`;
		if (traits.length) textStack[0] += `(${renderer.render(traits.join(", "))}); `;
		if (entry.level != null) textStack[0] += `<strong>Level&nbsp;</strong>${entry.level}; `;
		if (entry.note != null) textStack[0] += `${this.render(entry.note)} `;
		if (entry.DC != null || entry.savingThrow != null) {
			textStack[0] += `<strong>Saving Throw&nbsp;</strong>`
			if (entry.DC != null) textStack[0] += `DC ${renderer.render(entry.DC)} `
			textStack[0] += `${renderer.render(entry.savingThrow)}.`
		}
		if (entry.onset != null) textStack[0] += ` <strong>Onset</strong> ${entry.onset}`;
		if (entry.maxDuration != null) textStack[0] += ` <strong>Maximum Duration</strong> ${entry.maxDuration}`;
		if (entry.stages) {
			for (let stage of entry.stages) {
				textStack[0] += ` <strong class="no-wrap">Stage ${stage.stage}&nbsp;</strong>`;
				this._recursiveRender(stage.entry, textStack, meta);
				if (stage.duration != null) textStack[0] += ` (${renderer.render(stage.duration)});`;
			}
		}
		if (entry.entries) {
			textStack[0] += ` <strong>Effect&nbsp;</strong>`;
			entry.entries.forEach(it => this._recursiveRender(it, textStack, meta));
		}
		textStack[0] = textStack[0].replace(/;$/, ".");
		if (!options.isAbility) textStack[0] += `</p>`;
	};

	this._renderPf2H1 = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<${this.wrapperTag} class="pf2-wrp-h1" ${dataString}>`;

		if (entry.name != null) {
			const renderer = Renderer.get();
			this._handleTrackTitles(entry.name);
			textStack[0] += `<p class="pf2-h1 rd__h${entry.blue ? " pf2-h1--blue" : ""}" data-title-index="${this._headerIndex++}" ${this._getEnumeratedTitleRel(entry.name)}>
							<span class="entry-title-inner" ${entry.source ? `title="${Parser.sourceJsonToFull(entry.source)}${entry.page != null ? `, p. ${entry.page}` : ""}"` : ""}>${renderer.render(entry.name)}</span>`;
			if (entry.collapsible) textStack[0] += `<span class="pf2-h1--collapse">${this._getCollapsibleToggle({ minus: "-" })}</span>`;
			textStack[0] += `</p>`
		}
		this._getReference(entry);
		this._firstSection = false;
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, { prefix: `<p class="pf2-p">`, suffix: `</p>` });
			}
		}
		textStack[0] += `<div class="float-clear"></div>`;
		textStack[0] += `</${this.wrapperTag}>`;
	};

	this._renderPf2H1Flavor = function (entry, textStack, meta, options) {
		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				textStack[0] += `<p class="pf2-h1-flavor rd__h${entry.centered ? " pf2-h1-flavor--centered" : ""}">${this.render(entry.entries[i])}</p>`;
			}
		}
		textStack[0] += this._getPf2ChapterSwirl()
	};

	this._getPf2ChapterSwirl = function () {
		return `<div class="flex">
                <div class="pf2-chapter__line pf2-chapter__line--l"></div>
                <svg class="pf2-chapter__swirl pf2-chapter__swirl--l" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.57 57.84"><path d="M800.2,632.26a36.88,36.88,0,0,1-11.08-1.86c-8.26-3.54-12-5.67-17.94-13.93a39.28,39.28,0,0,1-5.08-10.05,19.27,19.27,0,0,0-8-10.95,12.64,12.64,0,0,0-6.67-2.22,8.8,8.8,0,0,0-5.57,2c-3.7,2.94-4.55,7.11-2.52,12.38a16.63,16.63,0,0,0,.81,1.71c-6.64-2.41-9.19-8.31-9-20.51v-.69l-.66.2c-1.67.51-3.34,1-5,1.57-7.53,2.4-15.31,4.88-23,4.88a31.28,31.28,0,0,1-12.92-2.68,38.86,38.86,0,0,0,7,.65c13,0,24.65-7,34.88-13.11a29.75,29.75,0,0,1,15.33-4.26c12.49,0,23.44,7.86,26,18.68a1.29,1.29,0,0,0,.62.73,1.49,1.49,0,0,1,.2.15l.34.3.33-.31c6.21-5.84,10.58-8.33,14.61-8.33,2.41,0,4.75.91,7.37,2.85C805,593,806,596.86,803.49,602c-1.87-4.49-4.64-7-7.82-7a7.19,7.19,0,0,0-2.8.61c-4.1,1.74-5.67,7.06-3.65,12.37a13.49,13.49,0,0,0,12.35,8.61,10.84,10.84,0,0,0,1.13-.06A13.18,13.18,0,0,0,814.34,605c1.23-8.66-2.06-15-10.06-19.4,7.2.2,11.07,4.31,14.18,8.74l.1.14a38.92,38.92,0,0,1,3,4.81,23.4,23.4,0,0,1,2,13c0,.35-.07.61-.07.76-1,6.1-2.89,8.43-3.89,9.68-4,5-6.37,6-8.84,7.07A37.67,37.67,0,0,1,800.2,632.26Z" transform="translate(-689.69 -574.92)"/><path d="M750.77,575.92c12.26,0,23,7.7,25.54,18.3a1.78,1.78,0,0,0,.82,1,.83.83,0,0,1,.15.11l.69.61.66-.63c6-5.66,10.43-8.19,14.27-8.19a11.76,11.76,0,0,1,7.07,2.75c4.24,3.15,5.34,6.46,3.53,10.87-1.94-4-4.69-6.24-7.83-6.24a7.66,7.66,0,0,0-3,.65c-4.34,1.85-6,7.44-3.92,13a14,14,0,0,0,12.82,8.93,11.66,11.66,0,0,0,1.18-.06,13.67,13.67,0,0,0,12.08-12c1.16-8.17-1.59-14.35-8.41-18.78,5.63.88,8.92,4.48,11.63,8.34l.1.14a37.88,37.88,0,0,1,3,4.73,22.87,22.87,0,0,1,2,12.75c0,.32-.06.54-.07.72-1,6-2.81,8.26-3.78,9.47-4,4.94-6.23,5.91-8.64,6.92a37.17,37.17,0,0,1-10.37,2.38,36.67,36.67,0,0,1-10.9-1.82c-8.17-3.51-11.82-5.62-17.72-13.76a39.37,39.37,0,0,1-5-9.91,19.72,19.72,0,0,0-8.22-11.22,13.05,13.05,0,0,0-6.94-2.3,9.29,9.29,0,0,0-5.88,2.14c-3.84,3.05-4.76,7.53-2.68,13,.07.19.15.37.23.55-5.5-2.61-7.62-8.38-7.44-19.53l0-1.37-1.31.4c-1.68.51-3.38,1.05-5,1.58-7.49,2.38-15.24,4.85-22.86,4.85a31.61,31.61,0,0,1-8.44-1.11c.84.06,1.69.08,2.54.08,13.18,0,24.85-7,35.14-13.18a29.27,29.27,0,0,1,15.07-4.19m0-1a30.19,30.19,0,0,0-15.58,4.33c-11,6.59-22,13-34.63,13a38.2,38.2,0,0,1-10.87-1.59,31.87,31.87,0,0,0,16.77,4.62c9.46,0,18.8-3.63,28.18-6.47-.21,13.11,2.82,19.17,10.49,21.37-.48-1-1-1.83-1.34-2.74-1.71-4.43-1.53-8.71,2.36-11.81a8.27,8.27,0,0,1,5.26-1.92,12.1,12.1,0,0,1,6.4,2.15,18.67,18.67,0,0,1,7.81,10.67,39.89,39.89,0,0,0,5.16,10.19c5.94,8.2,9.55,10.41,18.18,14.12a37.78,37.78,0,0,0,11.25,1.88A38.5,38.5,0,0,0,811,630.31c2.64-1.12,5-2.22,9-7.22,1.23-1.54,3-4,4-10a24.66,24.66,0,0,0-2-14,41.26,41.26,0,0,0-3.13-5c-3.56-5.07-7.7-9-15.17-9-.46,0-.94,0-1.43,0,9.18,4.34,12.86,10.78,11.57,19.8a12.74,12.74,0,0,1-11.19,11.11c-.36,0-.72.05-1.08.05a12.94,12.94,0,0,1-11.88-8.28c-1.91-5-.45-10.11,3.37-11.74a6.69,6.69,0,0,1,2.61-.57c3,0,5.6,2.35,7.42,6.78q.15.39.36.39c.11,0,.23-.08.37-.24,2.77-5.47,1.76-9.63-3.25-13.36a12.79,12.79,0,0,0-7.67-3c-4.26,0-8.84,2.72-14.95,8.46-.23-.2-.6-.37-.66-.61-2.78-11.58-14.21-19.07-26.52-19.07Z" transform="translate(-689.69 -574.92)"/></svg>
                <svg class="pf2-chapter__swirl pf2-chapter__swirl--r" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.57 57.84"><path d="M800.2,632.26a36.88,36.88,0,0,1-11.08-1.86c-8.26-3.54-12-5.67-17.94-13.93a39.28,39.28,0,0,1-5.08-10.05,19.27,19.27,0,0,0-8-10.95,12.64,12.64,0,0,0-6.67-2.22,8.8,8.8,0,0,0-5.57,2c-3.7,2.94-4.55,7.11-2.52,12.38a16.63,16.63,0,0,0,.81,1.71c-6.64-2.41-9.19-8.31-9-20.51v-.69l-.66.2c-1.67.51-3.34,1-5,1.57-7.53,2.4-15.31,4.88-23,4.88a31.28,31.28,0,0,1-12.92-2.68,38.86,38.86,0,0,0,7,.65c13,0,24.65-7,34.88-13.11a29.75,29.75,0,0,1,15.33-4.26c12.49,0,23.44,7.86,26,18.68a1.29,1.29,0,0,0,.62.73,1.49,1.49,0,0,1,.2.15l.34.3.33-.31c6.21-5.84,10.58-8.33,14.61-8.33,2.41,0,4.75.91,7.37,2.85C805,593,806,596.86,803.49,602c-1.87-4.49-4.64-7-7.82-7a7.19,7.19,0,0,0-2.8.61c-4.1,1.74-5.67,7.06-3.65,12.37a13.49,13.49,0,0,0,12.35,8.61,10.84,10.84,0,0,0,1.13-.06A13.18,13.18,0,0,0,814.34,605c1.23-8.66-2.06-15-10.06-19.4,7.2.2,11.07,4.31,14.18,8.74l.1.14a38.92,38.92,0,0,1,3,4.81,23.4,23.4,0,0,1,2,13c0,.35-.07.61-.07.76-1,6.1-2.89,8.43-3.89,9.68-4,5-6.37,6-8.84,7.07A37.67,37.67,0,0,1,800.2,632.26Z" transform="translate(-689.69 -574.92)"/><path d="M750.77,575.92c12.26,0,23,7.7,25.54,18.3a1.78,1.78,0,0,0,.82,1,.83.83,0,0,1,.15.11l.69.61.66-.63c6-5.66,10.43-8.19,14.27-8.19a11.76,11.76,0,0,1,7.07,2.75c4.24,3.15,5.34,6.46,3.53,10.87-1.94-4-4.69-6.24-7.83-6.24a7.66,7.66,0,0,0-3,.65c-4.34,1.85-6,7.44-3.92,13a14,14,0,0,0,12.82,8.93,11.66,11.66,0,0,0,1.18-.06,13.67,13.67,0,0,0,12.08-12c1.16-8.17-1.59-14.35-8.41-18.78,5.63.88,8.92,4.48,11.63,8.34l.1.14a37.88,37.88,0,0,1,3,4.73,22.87,22.87,0,0,1,2,12.75c0,.32-.06.54-.07.72-1,6-2.81,8.26-3.78,9.47-4,4.94-6.23,5.91-8.64,6.92a37.17,37.17,0,0,1-10.37,2.38,36.67,36.67,0,0,1-10.9-1.82c-8.17-3.51-11.82-5.62-17.72-13.76a39.37,39.37,0,0,1-5-9.91,19.72,19.72,0,0,0-8.22-11.22,13.05,13.05,0,0,0-6.94-2.3,9.29,9.29,0,0,0-5.88,2.14c-3.84,3.05-4.76,7.53-2.68,13,.07.19.15.37.23.55-5.5-2.61-7.62-8.38-7.44-19.53l0-1.37-1.31.4c-1.68.51-3.38,1.05-5,1.58-7.49,2.38-15.24,4.85-22.86,4.85a31.61,31.61,0,0,1-8.44-1.11c.84.06,1.69.08,2.54.08,13.18,0,24.85-7,35.14-13.18a29.27,29.27,0,0,1,15.07-4.19m0-1a30.19,30.19,0,0,0-15.58,4.33c-11,6.59-22,13-34.63,13a38.2,38.2,0,0,1-10.87-1.59,31.87,31.87,0,0,0,16.77,4.62c9.46,0,18.8-3.63,28.18-6.47-.21,13.11,2.82,19.17,10.49,21.37-.48-1-1-1.83-1.34-2.74-1.71-4.43-1.53-8.71,2.36-11.81a8.27,8.27,0,0,1,5.26-1.92,12.1,12.1,0,0,1,6.4,2.15,18.67,18.67,0,0,1,7.81,10.67,39.89,39.89,0,0,0,5.16,10.19c5.94,8.2,9.55,10.41,18.18,14.12a37.78,37.78,0,0,0,11.25,1.88A38.5,38.5,0,0,0,811,630.31c2.64-1.12,5-2.22,9-7.22,1.23-1.54,3-4,4-10a24.66,24.66,0,0,0-2-14,41.26,41.26,0,0,0-3.13-5c-3.56-5.07-7.7-9-15.17-9-.46,0-.94,0-1.43,0,9.18,4.34,12.86,10.78,11.57,19.8a12.74,12.74,0,0,1-11.19,11.11c-.36,0-.72.05-1.08.05a12.94,12.94,0,0,1-11.88-8.28c-1.91-5-.45-10.11,3.37-11.74a6.69,6.69,0,0,1,2.61-.57c3,0,5.6,2.35,7.42,6.78q.15.39.36.39c.11,0,.23-.08.37-.24,2.77-5.47,1.76-9.63-3.25-13.36a12.79,12.79,0,0,0-7.67-3c-4.26,0-8.84,2.72-14.95,8.46-.23-.2-.6-.37-.66-.61-2.78-11.58-14.21-19.07-26.52-19.07Z" transform="translate(-689.69 -574.92)"/></svg>
                <div class="pf2-chapter__line pf2-chapter__line--r"></div>
            	</div>`
	};

	this._renderPf2H2 = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<${this.wrapperTag} class="pf2-wrp-h2" ${dataString}>`;
		textStack[0] += `<div class="pf2-h2--wrp ${this._firstSection ? "m-0" : ""}">`
		this._firstSection = false;

		if (entry.step != null) {
			textStack[0] += `<p class="pf2-h2__step-num">${entry.step}</p>`
			textStack[0] += `<p class="pf2-h2__step">STEP ${entry.step}</p>`
		}
		this._getReference(entry);

		if (entry.name != null) {
			const renderer = Renderer.get();
			this._handleTrackTitles(entry.name);
			textStack[0] += `<p class="pf2-h2 rd__h" data-title-index="${this._headerIndex++}" ${this._getEnumeratedTitleRel(entry.name)}>
							<span class="entry-title-inner" ${entry.source ? `title="${Parser.sourceJsonToFull(entry.source)}${entry.page != null ? `, p. ${entry.page}` : ""}"` : ""}>${renderer.render(entry.name)}</span>`;
			if (entry.collapsible) textStack[0] += this._getCollapsibleToggle({ minus: "-" });
			textStack[0] += `</p>`
		}
		textStack[0] += `</div>`
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, { prefix: `<p class="pf2-p">`, suffix: `</p>` });
			}
		}
		textStack[0] += `</${this.wrapperTag}>`;
	};

	this._renderPf2H3 = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<${this.wrapperTag} class="pf2-wrp-h3" ${dataString}>`;

		if (entry.name != null) {
			const renderer = Renderer.get();
			this._handleTrackTitles(entry.name);
			textStack[0] += `<p class="pf2-h3 rd__h ${this._firstSection ? "p-0" : ""}" data-title-index="${this._headerIndex++}" ${this._getEnumeratedTitleRel(entry.name)}>
							<span class="entry-title-inner" ${entry.source ? `title="${Parser.sourceJsonToFull(entry.source)}${entry.page != null ? `, p. ${entry.page}` : ""}"` : ""}>${renderer.render(entry.name)}</span>`;
			if (entry.level || entry.collapsible) textStack[0] += `<span class="pf2-h3--lvl">${entry.level ? Parser.getOrdinalForm(entry.level) : ""}${entry.collapsible ? this._getCollapsibleToggle({ minus: "\u2013" }) : ""}</span>`;
			textStack[0] += `</p>`;
		}
		this._getReference(entry);
		this._firstSection = false;
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, { prefix: `<p class="pf2-p">`, suffix: `</p>` });
			}
		}
		textStack[0] += `</${this.wrapperTag}>`;
	};

	this._renderPf2H4 = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<${this.wrapperTag} class="pf2-wrp-h4" ${dataString}>`;

		if (entry.name != null) {
			const renderer = Renderer.get();
			this._handleTrackTitles(entry.name);
			textStack[0] += `<p class="pf2-h4 rd__h ${this._firstSection ? "p-0" : ""}" data-title-index="${this._headerIndex++}" ${this._getEnumeratedTitleRel(entry.name)}>
							<span class="entry-title-inner" ${entry.source ? `title="${Parser.sourceJsonToFull(entry.source)}${entry.page != null ? `, p. ${entry.page}` : ""}"` : ""}>${renderer.render(entry.name)}</span>`;
			if (entry.level || entry.collapsible) textStack[0] += `<span class="pf2-h4--lvl">${entry.level ? Parser.getOrdinalForm(entry.level) : ""}${entry.collapsible ? this._getCollapsibleToggle({ minus: "\u2013" }) : ""}</span>`;
			textStack[0] += `</p>`;
		}
		this._getReference(entry);
		this._firstSection = false;
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, { prefix: `<p class="pf2-p">`, suffix: `</p>` });
			}
		}
		textStack[0] += `</${this.wrapperTag}>`;
	};

	this._renderPf2H5 = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<${this.wrapperTag} class="pf2-wrp-h5" ${dataString}>`;

		if (entry.name != null) {
			this._handleTrackTitles(entry.name);
			textStack[0] += `<p class="pf2-h5 rd__h ${this._firstSection ? "mt-0" : ""}" data-title-index="${this._headerIndex++}" ${this._getEnumeratedTitleRel(entry.name)}><span class="entry-title-inner">${this.render(entry.name)}</span></p>`;
		}
		this._getReference(entry);
		this._firstSection = false;
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, { prefix: `<p class="pf2-p">`, suffix: `</p>` });
			}
		}
		textStack[0] += `</${this.wrapperTag}>`;
	};

	this._getCollapsibleToggle = function (opts) {
		return `<span class="no-select pf2-h--collapse" onclick="((ele) => {
			$(ele).text($(ele).text().includes('+') ? ' [${opts.minus}]' : ' [+]');
			$(ele).parent().parent()${opts.parents === 3 ? ".parent()" : ""}.siblings().toggle();
		})(this)">[${opts.minus}]</span>`
	};

	this._renderPf2Title = function (entry, textStack, meta, options) {
		if (entry.name != null) {
			this._handleTrackTitles(entry.name);
			textStack[0] += `<p class="pf2-title ${entry.style || ""}">${this.render(entry.name)}</p>`;
		}
		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, options);
			}
		}
	};

	this._renderPf2Sidebar = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<div class="pf2-sidebar ${(entry.style || []).join(" ")}" ${dataString}>`;

		if (entry.name != null) {
			const renderer = Renderer.get();
			this._handleTrackTitles(entry.name);
			textStack[0] += `<p class="pf2-sidebar__title" data-title-index="${this._headerIndex++}" ${this._getEnumeratedTitleRel(entry.name)}><span class="entry-title-inner">${renderer.render(entry.name)}</span></p>`;
		}
		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, {
					prefix: `<p class="pf2-sidebar__text">`,
					suffix: `</p>`,
				});
			}
		}
		textStack[0] += `</div>`;
	};

	this._renderPf2SampleBox = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<div class="${options.beige ? "pf2-beige-box" : "pf2-sample-box"}" ${dataString}>`;

		if (entry.name != null) {
			this._handleTrackTitles(entry.name);
			textStack[0] += `<div class="${options.beige ? "pf2-beige-box__title" : "pf2-sample-box__title"}"><span>${entry.name}</span></div>`;
		}
		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, {
					prefix: `<p class="${options.beige ? "pf2-beige-box__text" : "pf2-sample-box__text"}">`,
					suffix: "</p>",
				});
			}
		}
		textStack[0] += `</div>`;
	};

	this._renderPf2Inset = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<div class="pf2-inset" ${dataString}>`;

		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta);
			}
		}
		textStack[0] += `</div>`;
	};

	this._renderPf2TipsBox = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<div class="pf2-tips-box" ${dataString}>`;

		if (entry.name != null) {
			this._handleTrackTitles(entry.name);
			textStack[0] += `<div class="pf2-tips-box__title"><span>${entry.name}</span></div>`;
		}
		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, {
					prefix: "<p class=\"pf2-tips-box__text\">",
					suffix: "</p>",
				});
			}
		}
		textStack[0] += `</div>`;
	};

	this._getPf2BoxSwirl = function (right, styles) {
		if (right) {
			return `<svg class="pf2-box__swirl pf2-box__swirl--right ${styles}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 415 242"><path d="M1.39,241.51S-.3,71.14.05,71.33s21.77.19,32.62-.44a162.92,162.92,0,0,0,29-4.21,129.52,129.52,0,0,0,27.54-10c8.58-4.32,17.24-9.56,24-16.44a43.08,43.08,0,0,0,4.59-5.49c1-1.5,2-3.17,3.91-3.57s4.35.29,6.29.8A35.38,35.38,0,0,1,133.82,34c7.47,3.44,13.3,9.39,18.13,15.91a89.19,89.19,0,0,1,13.26,25.78c1.48,4.57,2.64,9.21,4.58,13.63a61.82,61.82,0,0,0,6.74,11.73c2.61,3.56,5.66,7.34,9.24,10,4,3,8.62,2.55,13.35,2.47,11.33-.18,22.66-.48,34-.17q4.14.11,8.28.34a32.22,32.22,0,0,0,7-.12,20.35,20.35,0,0,0,10-4.63,38.2,38.2,0,0,0,9.1-45.84,30.88,30.88,0,0,0-7.34-10,26.81,26.81,0,0,0-10.24-5.2C242.33,45.83,233.56,46.47,227,51a24.54,24.54,0,0,0-10.11,21,19.36,19.36,0,0,0,3.58,11.17,14.84,14.84,0,0,0,9.09,5.51,16.64,16.64,0,0,0,6,0c.78-.15,2.12-.6,2.74.19.31.39-.07.72-.35,1.14s-.51.73-.78,1.08a20.38,20.38,0,0,1-9.7,6.52c-16.57,5.41-33.26-7.15-38.83-22.31a36.82,36.82,0,0,1-2.27-12,60.62,60.62,0,0,1,1.48-13,67.43,67.43,0,0,1,9.44-23.9A59.61,59.61,0,0,1,216.74,8,58.69,58.69,0,0,1,242,.23a76.68,76.68,0,0,1,28.17,3.05,72.58,72.58,0,0,1,24.69,13.37c13.36,11,23,26.29,26.26,43.33a68.81,68.81,0,0,1,0,25.47c-.22,1.17-.45,2.35-.75,3.5a21.3,21.3,0,0,0-.74,2.56,3.63,3.63,0,0,0,.21,1.73s.22.62.32.66.89-.3,1-.35c1.16-.38,2.32-.74,3.49-1.08a82.23,82.23,0,0,1,14.91-2.91,69.58,69.58,0,0,1,53.47,18A65.83,65.83,0,0,1,414.44,155a66.94,66.94,0,0,1-19.32,47.35c-.38-2.72-.69-5.46-1.07-8.18-1.16-8.35-3.23-16.73-7.36-24.14a41.74,41.74,0,0,0-16.33-16.32,61.34,61.34,0,0,0-11.21-4.65c-1.69-.53-4.26-1.45-5.89-.27s-1.68,4-1.78,5.8c-.28,5-.1,10-.1,14.93q0,35.78,0,71.53"/></svg>`
		} else {
			return `<svg class="pf2-box__swirl pf2-box__swirl--left ${styles}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 415 242"><path d="M63.05,241.05V169.52c0-5,.18-10-.09-14.93-.11-1.81-.13-4.6-1.78-5.8s-4.2-.26-5.89.27a61.34,61.34,0,0,0-11.21,4.65A41.74,41.74,0,0,0,27.75,170c-4.13,7.41-6.2,15.79-7.36,24.14-.38,2.72-.69,5.46-1.07,8.18A66.94,66.94,0,0,1,0,155a65.82,65.82,0,0,1,21.38-47.46,69.62,69.62,0,0,1,53.48-18,82.23,82.23,0,0,1,14.91,2.91q1.76.51,3.48,1.08c.16,0,.91.41,1,.35a2.86,2.86,0,0,0,.32-.66,3.63,3.63,0,0,0,.21-1.73A21.3,21.3,0,0,0,94.09,89c-.3-1.15-.53-2.33-.75-3.5a68.81,68.81,0,0,1,0-25.47c3.23-17,12.9-32.38,26.26-43.33A72.58,72.58,0,0,1,144.3,3.28a76.68,76.68,0,0,1,28.17-3A58.69,58.69,0,0,1,197.7,8a59.71,59.71,0,0,1,19.5,18.51,67.43,67.43,0,0,1,9.44,23.9,60.62,60.62,0,0,1,1.48,13,36.82,36.82,0,0,1-2.27,12c-5.57,15.16-22.26,27.72-38.83,22.31a20.33,20.33,0,0,1-9.7-6.52c-.27-.35-.54-.71-.79-1.08s-.65-.75-.34-1.14c.62-.79,2-.34,2.74-.19a16.64,16.64,0,0,0,6,0A14.86,14.86,0,0,0,194,83.25a19.44,19.44,0,0,0,3.58-11.17,24.54,24.54,0,0,0-10.11-21c-6.58-4.57-15.35-5.21-22.94-3.14a26.81,26.81,0,0,0-10.24,5.2,30.74,30.74,0,0,0-7.34,10,38.2,38.2,0,0,0,9.1,45.84,20.36,20.36,0,0,0,10,4.63,32.32,32.32,0,0,0,7,.12q4.14-.24,8.28-.34c11.33-.31,22.66,0,34,.17,4.73.08,9.33.48,13.34-2.47,3.59-2.63,6.64-6.41,9.25-10a61.82,61.82,0,0,0,6.74-11.73c1.94-4.42,3.1-9.06,4.58-13.63a88.94,88.94,0,0,1,13.26-25.78c4.83-6.52,10.66-12.47,18.13-15.91A35.06,35.06,0,0,1,286.44,32c1.94-.51,4.28-1.23,6.29-.8s2.85,2.07,3.91,3.57a43.08,43.08,0,0,0,4.59,5.49c6.77,6.88,15.43,12.12,24,16.44a129.64,129.64,0,0,0,27.53,10,163.16,163.16,0,0,0,29,4.21c10.85.63,32.27.62,32.62.44S413,241.51,413,241.51"/></svg>`
		}
	};

	this._renderPf2BrownBox = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<div ${dataString} class="flex">`;
		textStack[0] += `<div class="pf2-box pf2-box--brown">`;
		textStack[0] += this._getPf2BoxSwirl(false, "pf2-box--brown")
		textStack[0] += `<div class="pf2-box__swirl-connection pf2-box--brown"></div>`
		textStack[0] += this._getPf2BoxSwirl(true, "pf2-box--brown")

		if (entry.name != null) {
			this._handleTrackTitles(entry.name);
			textStack[0] += `<span class="pf2-box__title">${entry.name}</span>`;
		}
		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, { prefix: "<p class='pf2-box__text'>", suffix: "</p>" });
			}
		}
		textStack[0] += `</div></div>`;
	};

	this._renderPf2RedBox = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<div ${dataString} class="flex">`;
		textStack[0] += `<div class="pf2-box pf2-box--red">`;
		textStack[0] += this._getPf2BoxSwirl(false, "pf2-box--red")
		textStack[0] += `<div class="pf2-box__swirl-connection pf2-box--red"></div>`
		textStack[0] += this._getPf2BoxSwirl(true, "pf2-box--red")

		if (entry.name != null) {
			this._handleTrackTitles(entry.name);
			textStack[0] += `<span class="pf2-box__title">${entry.name}</span>`;
		}
		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, {
					prefix: "<p class='pf2-box__text'>",
					suffix: "</p>",
				});
			}
		}
		textStack[0] += `</div></div>`;
	};

	this._renderPf2KeyBox = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<div class="pf2-key-box" ${dataString}>`;

		if (entry.name != null) {
			this._handleTrackTitles(entry.name);
			textStack[0] += `<p class="pf2-key-box__title">${entry.name}</p>`;
		}
		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, {
					prefix: `<p class="pf2-key-box__text">`,
					suffix: "</p>",
				});
			}
		}
		textStack[0] += `</div>`;
	};

	this._renderPf2KeyAbility = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<div class="pf2-key-abilities" ${dataString}>`;

		if (entry.ability != null) {
			textStack[0] += `<div class="pf2-key-abilities__ab">`;
			textStack[0] += `<p class="pf2-key-abilities__title">KEY ABILITY</p>`;
			const len = entry.ability.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.ability[i], textStack, meta, {
					prefix: "<p class='pf2-key-abilities__text'>",
					suffix: "</p>",
				});
			}
			textStack[0] += `</div>`;
		}

		if (entry.hp != null) {
			textStack[0] += `<div class="pf2-key-abilities__hp">`;
			textStack[0] += `<p class="pf2-key-abilities__title">HIT POINTS</p>`;
			const len = entry.hp.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.hp[i], textStack, meta, {
					prefix: "<p class='pf2-key-abilities__text'>",
					suffix: "</p>",
				});
			}
			textStack[0] += `</div>`;
		}
		textStack[0] += `</div>`;
	};

	// TODO: This is often used as a crutch
	this._renderPf2Options = function (entry, textStack, meta, options) {
		if (!entry.items || !entry.items.length) return;
		if (!entry.skipSort) entry.items = entry.items.sort((a, b) => a.name && b.name ? SortUtil.ascSort(a.name, b.name) : a.name ? -1 : b.name ? 1 : 0);
		const renderer = Renderer.get();
		entry.items.forEach(it => {
			const entries = MiscUtil.copy(it.entries);
			const style = entry.style ? entry.style : "pf2-book__option";
			textStack[0] += `<p class="${style}">${it.name ? `<strong>${renderer.render(it.name)}${entry.noColon ? "" : ":"}&nbsp;</strong>` : ""}${renderer.render(entries.shift())}</p>`;
			entries.forEach(e => this._recursiveRender(e, textStack, meta, { prefix: `<p class="${style}">`, suffix: `</p>` }));
		});
	};

	this._renderQuote = function (entry, textStack, meta, options) {
		const renderer = Renderer.get();
		const len = entry.entries.length;
		for (let i = 0; i < len; ++i) {
			textStack[0] += `<p class="rd__quote-line ${i === len - 1 && entry.by ? `rd__quote-line--last` : ""}">${i === 0 && !entry.skipMarks ? "&ldquo;" : ""}`;
			this._recursiveRender(entry.entries[i], textStack, meta, { prefix: "<i>", suffix: "</i>" });
			textStack[0] += `${i === len - 1 && !entry.skipMarks ? "&rdquo;" : ""}</p>`;
		}
		if (entry.by || entry.source) {
			textStack[0] += `<p> <span class="rd__quote-by">\u2014 `;
			textStack[0] += `${entry.by != null ? `${renderer.render(entry.by)}` : entry.source != null ? `${Parser.sourceJsonToFull(entry.source)}` : ""}${entry.from ? `, <i>${renderer.render(entry.from)}</i>` : entry.source && entry.page ? `, <i>p. ${entry.page}</i>` : ""}</span>`;
			textStack[0] += `</p>`;
		}
	};

	this._renderPaper = function (entry, textStack, meta, options) {
		const dataString = this._getDataString(entry);
		textStack[0] += `<div class="pf2-paper-wrp">`;

		if (entry.title != null) {
			textStack[0] += `<p class="pf2-paper-title">${this.render(entry.title)}</p>`;
		}

		const styles = (entry.style || "").split(" ").filter(Boolean).map(s => `pf2-${s}`).join(" ");
		textStack[0] += `<div class="pf2-paper ${styles}" ${dataString}>`;

		if (entry.head) {
			textStack[0] += `<div class="pf2-paper__header">`;
			const len = entry.head.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.head[i], textStack, meta, {
					prefix: `<p class="pf2-paper__text">`,
					suffix: "</p>",
				});
			}
			textStack[0] += `</div>`;
		}
		this._getReference(entry);

		textStack[0] += `<div class="pf2-paper__entries">`;
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, {
					prefix: `<p class="pf2-paper__text" ${entry.noIndentLastEntry && i === len - 1 ? "style='text-indent: 0;'" : ""}>`,
					suffix: "</p>",
				});
			}
		}
		textStack[0] += `</div>`;

		if (entry.signature) {
			textStack[0] += `<div class="pf2-paper__signature">`;
			const len = entry.signature.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.signature[i], textStack, meta, {
					prefix: `<p class="pf2-paper__text">`,
					suffix: "</p>",
				});
			}
			textStack[0] += `</div>`;
		}

		if (entry.footnotes) {
			textStack[0] += `<div class="pf2-paper__footer">`;
			const len = entry.footnotes.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.footnotes[i], textStack, meta, {
					prefix: `<p class="pf2-paper__text">`,
					suffix: "</p>",
				});
			}
			textStack[0] += `</div>`;
		}
		textStack[0] += `</div></div>`;
	};

	this._renderInline = function (entry, textStack, meta, options) {
		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) this._recursiveRender(entry.entries[i], textStack, meta);
		}
	};

	this._renderInlineBlock = function (entry, textStack, meta, options) {
		this._getReference(entry);
		this._renderPrefix(entry, textStack, meta, options);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) this._recursiveRender(entry.entries[i], textStack, meta);
		}
		this._renderSuffix(entry, textStack, meta, options);
	};

	this._renderDice = function (entry, textStack, meta, options) {
		textStack[0] += Renderer.getEntryDice(entry, entry.name, this._isAddHandlers);
	};

	// Ex. {"type": "data", "tag": "spell", "name": "Fireball", "source": "CRB"}
	this._renderData = async function (entry, textStack, meta, options) {
		this._renderPrefix(entry, textStack, meta, options);
		this._renderDataHeader(textStack);
		const tag = entry.tag;
		const name = entry.name;
		const source = entry.source || Parser.TAG_TO_DEFAULT_SOURCE[tag];
		const catId = Parser._parse_bToA(Parser.CAT_ID_TO_PROP, tag);
		const page = entry.page || UrlUtil.CAT_TO_PAGE[catId];
		// FIXME: Doesn't render "data" structures. See SoM dragon and soul gifts.
		if (entry.data) {
			const renderFn = Renderer.hover._pageToRenderFn(page);
			const rendered = renderFn ? renderFn(entry.data, { isEmbedded: true, noPage: true }) : `<div class="pf2-stat">Failed to render ${entry.data.name}.</div>`;
			textStack[0] += typeof rendered === "object" ? [...rendered].map(e => e.outerHTML).join("") : rendered;
		} else {
			const hash = entry.hash || UrlUtil.URL_TO_HASH_BUILDER[page](entry);
			textStack[0] += `<div class="pf2-stat" data-stat-tag="${tag.qq()}" data-stat-name="${name.qq()}" data-stat-hash="${hash.qq()}" data-stat-page="${page.qq()}" data-stat-source="${source.qq()}">
				<i>Loading ${Renderer.get().render(`{@${tag} ${name}|${source}}`)}...</i>
				<style onload="Renderer.events.handleLoad_inlineStatblock(this)"></style>
			</div>`;
		}
		this._renderDataFooter(textStack);
		this._renderSuffix(entry, textStack, meta, options);
	};

	this._renderData_getEmbeddedToggle = function () {
		return `<div class="rd__data-embed-toggle inline-block" onclick="((ele) => {
						$(ele).text($(ele).text().includes('+') ? ' [\u2013]' : ' [+]');
						$(ele).parent().siblings().not('.pf2-embedded-name').toggle()
					})(this)">[\u2013]</div>`
	};

	this._renderDataHeader = function (textStack, isEmbedded) {
		if (isEmbedded) textStack[0] += `<div class="rd__b-data"><div class="pf2-stat pf2-wrp-stat m-0">`;
		else textStack[0] += `<div class="pf2-stat pf2-wrp-stat">`;
	};

	this._renderDataFooter = function (textStack, isEmbedded) {
		if (isEmbedded) textStack[0] += `</div></div>`;
		else textStack[0] += `</div>`;
	};

	this._renderGallery = function (entry, textStack, meta, options) {
		textStack[0] += `<div class="rd__wrp-gallery">`;
		const len = entry.images.length;
		const anyNamed = entry.images.find(it => it.title);
		for (let i = 0; i < len; ++i) {
			const img = MiscUtil.copy(entry.images[i]);
			if (anyNamed && !img.title) img._galleryTitlePad = true; // force untitled images to pad to match their siblings
			delete img.imageType;
			this._recursiveRender(img, textStack, meta, options);
		}
		textStack[0] += `</div>`;
	};

	this._renderHomebrew = function (entry, textStack, meta, options) {
		this._renderPrefix(entry, textStack, meta, options);
		textStack[0] += `<div class="homebrew-section"><div class="homebrew-float"><span class="homebrew-notice"></span>`;

		if (entry.oldEntries) {
			const hoverMeta = Renderer.hover.getMakePredefinedHover({
				type: "entries",
				name: "Homebrew",
				entries: entry.oldEntries,
			});
			let markerText;
			if (entry.movedTo) {
				markerText = "(See moved content)";
			} else if (entry.entries) {
				markerText = "(See replaced content)";
			} else {
				markerText = "(See removed content)";
			}
			textStack[0] += `<span class="homebrew-old-content" href="#${window.location.hash}" ${hoverMeta.html}>${markerText}</span>`;
		}

		textStack[0] += `</div>`;

		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, {
					prefix: "<p>",
					suffix: "</p>",
				})
			}
		} else if (entry.movedTo) {
			textStack[0] += `<i>This content has been moved to ${entry.movedTo}.</i>`;
		} else {
			textStack[0] += "<i>This content has been deleted.</i>";
		}

		textStack[0] += `</div>`;
		this._renderSuffix(entry, textStack, meta, options);
	};

	this._renderCode = function (entry, textStack, meta, options) {
		const isWrapped = !!StorageUtil.syncGet("rendererCodeWrap");
		textStack[0] += `
			<div class="flex-col h-100">
				<div class="flex no-shrink pt-1">
					<button class="btn btn-default btn-xs mb-1 mr-2" onclick="Renderer.events.handleClick_copyCode(event, this)">Copy Code</button>
					<button class="btn btn-default btn-xs mb-1 ${isWrapped ? "active" : ""}" onclick="Renderer.events.handleClick_toggleCodeWrap(event, this)">Word Wrap</button>
				</div>
				<pre class="h-100 w-100 mb-1 ${isWrapped ? "rd__pre-wrap" : ""}">${entry.preformatted}</pre>
			</div>
		`;
	};

	this._renderHr = function (entry, textStack, meta, options) {
		textStack[0] += `<hr class="${entry.style ? entry.style : "rd__hr"}">`;
		this._getReference(entry);
		if (entry.entries) {
			const len = entry.entries.length;
			for (let i = 0; i < len; ++i) {
				this._recursiveRender(entry.entries[i], textStack, meta, {
					prefix: "<p>",
					suffix: "</p>",
				})
			}
		}
	};

	this._getStyleClass = function (entry) {
		const outList = [];
		if (SourceUtil.isNonstandardSource(entry.source)) outList.push("spicy-sauce");
		if (BrewUtil.hasSourceJson(entry.source)) outList.push("refreshing-brew");
		if (this._extraSourceClasses) outList.push(...this._extraSourceClasses);
		for (const k in this._fnsGetStyleClasses) {
			const fromFn = this._fnsGetStyleClasses[k](entry);
			if (fromFn) outList.push(...fromFn);
		}
		return outList.join(" ");
	};

	this._getReference = function (entry) {
		if (entry.reference) {
			let source = `<a href="${Parser.sourceJsonToStore(entry.source)}">${Parser.sourceJsonToFull(entry.source)}</a>`
			if (entry.reference.index || entry.reference.auto !== true) {
				entry.entries.splice(entry.reference.index, 0, entry.reference.note ?? `{@note Read from ${entry.page != null ? `page ${entry.page} of ` : ""}${source}}.`);
			} else if (!entry.entries.length) {
				entry.entries = []
				entry.entries.push(`{@note Read from ${entry.page != null ? `page ${entry.page} of ` : ""}${source}}.`);
			} else {
				const len = entry.entries.length;
				for (let i = 0; i < len; ++i) {
					// If there are no strings, assume there is no content inside the entry itself, meaning it's a 100% reference to the source.
					// Else, check if the entry contains any objects. If it does, put the reference *before* the objects.
					// Resolving that, just add the entry at the end if the previous two are false.
					if (entry.entries[i].type === "pf2-h1-flavor" || entry.entries[i].type === "pf2-sidebar") {
						entry.entries.splice(i + 1, 0, `{@note Read from ${entry.page != null ? `page ${entry.page} of ` : ""}${source}}.`);
						return
					} else if (!entry.entries.filter(t => typeof t === "string").length) {
						entry.entries.unshift(`{@note Read from ${entry.page != null ? `page ${entry.page} of ` : ""}${source}}.`)
						return
					} else if (typeof entry.entries[i] === "object") {
						entry.entries.splice(i, 0, `{@note Read the rest from ${entry.page != null ? `page ${entry.page} of ` : ""}${source}}.`)
						return
					} else {
						entry.entries.push(`{@note Read the rest from ${entry.page != null ? `page ${entry.page} of ` : ""}${source}}.`)
						return
					}
				}
			}
			// Dedpulication measure, not needed though (?)
			// entry.entries = Array.from([...new Set(entry.entries)]);
		}
	}

	this._renderString = function (entry, textStack, meta, options) {
		const tagSplit = Renderer.splitByTags(entry);
		const len = tagSplit.length;
		for (let i = 0; i < len; ++i) {
			const s = tagSplit[i];
			if (!s) continue;
			if (s.startsWith("{@")) {
				const [tag, text] = Renderer.splitFirstSpace(s.slice(1, -1));
				this._renderString_renderTag(textStack, meta, options, tag, text);
			} else textStack[0] += s;
		}
	};

	this._renderString_renderTag = function (textStack, meta, options, tag, text) {
		switch (tag) {
			// BASIC STYLES/TEXT ///////////////////////////////////////////////////////////////////////////////
			case "@as":
			case "@actionsymbol":
				textStack[0] += `<span class="pf2-action-icon" data-symbol="${text}"></span>`;
				textStack[0] += `<span class="pf2-action-icon-copy-text">${this._renderString_actionCopyText(text)}</span>`;
				break;
			case "@b":
			case "@bold":
				textStack[0] += `<b>`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</b>`;
				break;
			case "@i":
			case "@italic":
				textStack[0] += `<i>`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</i>`;
				break;
			case "@s":
			case "@strike":
				textStack[0] += `<s>`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</s>`;
				break;
			case "@u":
			case "@underline":
				textStack[0] += `<u>`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</u>`;
				break;
			case "@n":
			case "@nostyle":
				textStack[0] += `<span class="no-font-style inline-block">`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</span>`;
				break;
			case "@c":
			case "@center":
				textStack[0] += `<span class="text-center block">`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</span>`;
				break;
			case "@sup":
				textStack[0] += `<sup>`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</sup>`;
				break;
			case "@sub":
				textStack[0] += `<sub>`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</sub>`;
				break;
			case "@note":
				textStack[0] += `<i class="ve-muted">`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</i>`;
				break;
			case "@divider":
				textStack[0] += `<div class="pf2-stat pf2-stat__line"></div>`
				break;
			case "@color": {
				const [toDisplay, color] = Renderer.splitTagByPipe(text);
				const scrubbedColor = BrewUtil.getValidColor(color);

				textStack[0] += `<span style="color: #${scrubbedColor}">`;
				this._recursiveRender(toDisplay, textStack, meta);
				textStack[0] += `</span>`;
				break;
			}
			case "@handwriting":
				textStack[0] += `<span class="pf2-handwriting">`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</span>`;
				break;
			case "@highlight": {
				const [toDisplay, color] = Renderer.splitTagByPipe(text);
				const scrubbedColor = color ? BrewUtil.getValidColor(color) : null;

				textStack[0] += scrubbedColor ? `<span style="background-color: #${scrubbedColor}">` : `<span class="rd__highlight">`;
				textStack[0] += toDisplay;
				textStack[0] += `</span>`;
				break;
			}
			case "@indentFirst":
				textStack[0] += `<span class="text-indent-first inline-block">`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</span>`;
				break;
			case "@indentSubsequent":
				textStack[0] += `<span class="text-indent-subsequent block">`;
				this._recursiveRender(text, textStack, meta);
				textStack[0] += `</span>`;
				break;

			// DCs /////////////////////////////////////////////////////////////////////////////////////////////
			case "@dc": {
				textStack[0] += `DC <span class="rd__dc">${text}</span>`;
				break;
			}

			// DICE ////////////////////////////////////////////////////////////////////////////////////////////
			case "@dice":
			case "@damage":
			case "@hit":
			case "@d20":
			case "@flatDC":
			case "@chance":
			case "@recharge": {
				const fauxEntry = {
					type: "dice",
					rollable: true,
				};
				const [rollText, displayText, name, ...others] = Renderer.splitTagByPipe(text);
				if (displayText) fauxEntry.displayText = displayText;
				if (name) fauxEntry.name = name;
				if (others.includes("onTable")) fauxEntry.onTable = true;

				switch (tag) {
					case "@dice": {
						// format: {@dice 1d2 + 3 + 4d5 - 6}
						fauxEntry.toRoll = rollText;
						if (!displayText && rollText.includes(";")) fauxEntry.displayText = rollText.replace(/;/g, "/");
						if ((!fauxEntry.displayText && rollText.includes("#$")) || (fauxEntry.displayText && fauxEntry.displayText.includes("#$"))) fauxEntry.displayText = (fauxEntry.displayText || rollText).replace(/#\$prompt_number[^$]*\$#/g, "(n)");
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					}
					case "@damage": {
						fauxEntry.toRoll = rollText;
						fauxEntry.subType = "damage";
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					}
					case "@d20": {
						// format: {@d20 +1} or {@d20 -2}
						let mod;
						if (!isNaN(rollText)) {
							const n = Number(rollText);
							mod = `${n >= 0 ? "+" : ""}${n}`;
						} else mod = rollText;
						fauxEntry.displayText = fauxEntry.displayText || mod;
						fauxEntry.toRoll = `1d20${mod}`;
						fauxEntry.subType = "d20";
						fauxEntry.d20mod = mod;
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					}
					case "@hit": {
						// format: {@hit +1} or {@hit -2}
						let mod;
						if (!isNaN(rollText)) {
							const n = Number(rollText);
							mod = `${n >= 0 ? "+" : ""}${n}`;
						} else mod = rollText;
						fauxEntry.displayText = fauxEntry.displayText || mod;
						fauxEntry.toRoll = `1d20${mod}`;
						const MAPstr = others.find(o => o.startsWith("MAP=")) || "MAP=-5";
						fauxEntry.MAP = Number(MAPstr.replace(/MAP=/, ""));
						fauxEntry.subType = "hit";
						fauxEntry.d20mod = mod;
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					}
					case "@flatDC": {
						// format: {@flatDC 15}
						fauxEntry.displayText = fauxEntry.displayText || rollText;
						fauxEntry.toRoll = `1d20`;
						fauxEntry.subType = "d20";
						fauxEntry.successThresh = 21 - Number(fauxEntry.displayText);
						fauxEntry.successMax = 20;
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					}
					case "@chance": {
						// format: {@chance 25|display text|rollbox rollee name}
						fauxEntry.toRoll = `1d100`;
						fauxEntry.successThresh = Number(rollText);
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					}
					case "@recharge": {
						// format: {@recharge 4|flags}
						const flags = displayText ? displayText.split("") : null; // "m" for "minimal" = no brackets
						fauxEntry.toRoll = "1d6";
						const asNum = Number(rollText || 6);
						fauxEntry.successThresh = 7 - asNum;
						fauxEntry.successMax = 6;
						textStack[0] += `${flags && flags.includes("m") ? "" : "("}Recharge `;
						fauxEntry.displayText = `${asNum}${asNum < 6 ? `\u20136` : ""}`;
						this._recursiveRender(fauxEntry, textStack, meta);
						textStack[0] += `${flags && flags.includes("m") ? "" : ")"}`;
						break;
					}
				}

				break;
			}

			// SCALE DICE //////////////////////////////////////////////////////////////////////////////////////
			case "@scaledice":
			case "@scaledamage": {
				const fauxEntry = Renderer.parseScaleDice(tag, text);
				this._recursiveRender(fauxEntry, textStack, meta);
				break;
			}

			// LINKS ///////////////////////////////////////////////////////////////////////////////////////////
			case "@filter": {
				const [displayText, page, namespace, ...filters] = Renderer.splitTagByPipe(text);

				const filterSubhashMeta = Renderer.getFilterSubhashes(filters, namespace);

				const fauxEntry = {
					type: "link",
					text: displayText,
					href: {
						type: "internal",
						path: `${page}.html`,
						hash: HASH_BLANK,
						hashPreEncoded: true,
						subhashes: filterSubhashMeta.subhashes,
					},
				};

				if (filterSubhashMeta.customHash) fauxEntry.href.hash = filterSubhashMeta.customHash;

				this._recursiveRender(fauxEntry, textStack, meta);

				break;
			}
			case "@link": {
				const [displayText, url] = Renderer.splitTagByPipe(text);
				let outUrl = url == null ? displayText : url;
				if (!outUrl.startsWith("http")) outUrl = `http://${outUrl}`; // avoid HTTPS, as the D&D homepage doesn't support it
				const fauxEntry = {
					type: "link",
					href: {
						type: "external",
						url: outUrl,
					},
					text: displayText,
				};
				this._recursiveRender(fauxEntry, textStack, meta);

				break;
			}
			case "@pf2etools":
			case "@Pf2eTools": {
				const [displayText, page, hash] = Renderer.splitTagByPipe(text);
				const fauxEntry = {
					type: "link",
					href: {
						type: "internal",
						path: page,
					},
					text: displayText,
				};
				if (hash) {
					fauxEntry.hash = hash;
					fauxEntry.hashPreEncoded = true;
				}
				this._recursiveRender(fauxEntry, textStack, meta);

				break;
			}

			// OTHER HOVERABLES ////////////////////////////////////////////////////////////////////////////////
			case "@footnote": {
				const [displayText, footnoteText, optTitle] = Renderer.splitTagByPipe(text);
				const hoverMeta = Renderer.hover.getMakePredefinedHover({
					type: "entries",
					name: "Footnote",
					entries: [footnoteText, optTitle ? `\u2014 {@note ${optTitle}}` : ""].filter(Boolean),
				});
				textStack[0] += `<span class="help" ${hoverMeta.html}>`;
				this._recursiveRender(displayText, textStack, meta);
				textStack[0] += `</span>`;

				break;
			}
			case "@homebrew": {
				const [newText, oldText] = Renderer.splitTagByPipe(text);
				const tooltipEntries = [];
				if (newText && oldText) {
					tooltipEntries.push("{@b This is a homebrew addition, replacing the following:}");
				} else if (newText) {
					tooltipEntries.push("{@b This is a homebrew addition.}")
				} else if (oldText) {
					tooltipEntries.push("{@b The following text has been removed with this homebrew:}")
				}
				if (oldText) {
					tooltipEntries.push(oldText);
				}
				const hoverMeta = Renderer.hover.getMakePredefinedHover({
					type: "entries",
					name: "Homebrew Modifications",
					entries: tooltipEntries,
				});
				textStack[0] += `<span class="homebrew-inline" ${hoverMeta.html}>`;
				this._recursiveRender(newText || "[...]", textStack, meta);
				textStack[0] += `</span>`;

				break;
			}
			case "@domain":
			case "@skill":
			case "@group": {
				const { name, source, displayText, others } = DataUtil.generic.unpackUid(text, tag);
				const hash = UrlUtil.encodeForHash([name, source]);
				const fakePage = tag.replace(/^@/, "");
				const hoverMeta = Renderer.get()._getHoverString(fakePage, source, hash, null);
				textStack[0] += `<span class="help--hover" ${hoverMeta}>${displayText || name}</span>`;
				break;
			}
			case "@area": {
				const [compactText, areaId, flags, ...others] = Renderer.splitTagByPipe(text);

				const renderText = flags && flags.includes("x")
					? compactText
					: `${flags && flags.includes("u") ? "A" : "a"}rea ${compactText}`;

				if (typeof BookUtil === "undefined") { // for the roll20 script
					textStack[0] += renderText;
				} else {
					const area = BookUtil.curRender.headerMap[areaId] || { entry: { name: "" } }; // default to prevent rendering crash on bad tag
					const hoverMeta = Renderer.hover.getMakePredefinedHover(area.entry, {
						isLargeBookContent: true,
						depth: area.depth,
					});
					textStack[0] += `<a href="#${BookUtil.curRender.curBookId},${area.chapter},${UrlUtil.encodeForHash(area.entry.name)},0" ${hoverMeta.html}>${renderText}</a>`;
				}

				break;
			}

			// HOMEBREW LOADING ////////////////////////////////////////////////////////////////////////////////
			case "@loader": {
				const { name, path } = this._renderString_getLoaderTagMeta(text);
				textStack[0] += `<span onclick="BrewUtil.handleLoadbrewClick(this, '${path.escapeQuotes()}', '${name.escapeQuotes()}')" class="rd__wrp-loadbrew--ready" title="Click to install homebrew">${name}<span class="glyphicon glyphicon-download-alt rd__loadbrew-icon rd__loadbrew-icon"></span></span>`;
				break;
			}

			// CONTENT TAGS ////////////////////////////////////////////////////////////////////////////////////
			case "@book":
			case "@adventure": {
				// format: {@tag Display Text|DMG< |chapter< |section >< |number > >}
				const page = tag === "@book" ? "book.html" : "adventure.html";
				const [displayText, book, chapter, section, rawNumber] = Renderer.splitTagByPipe(text);
				const number = rawNumber || 0;
				const hash = `${book}${chapter ? `${HASH_PART_SEP}${chapter}${section ? `${HASH_PART_SEP}${UrlUtil.encodeForHash(section)}${number != null ? `${HASH_PART_SEP}${UrlUtil.encodeForHash(number)}` : ""}` : ""}` : ""}`;
				const fauxEntry = {
					type: "link",
					href: {
						type: "internal",
						path: page,
						hash,
						hashPreEncoded: true,
					},
					text: displayText,
				};
				this._recursiveRender(fauxEntry, textStack, meta);

				break;
			}
			case "@quickref": {
				const [displayText, source, ixChapter, section, ixSection, ...others] = Renderer.splitTagByPipe(text);
				const hash = `bookref-quick${HASH_PART_SEP}${ixChapter}${HASH_PART_SEP}${UrlUtil.encodeForHash(section)}${HASH_PART_SEP}${ixSection || 0}`
				const fauxEntry = {
					type: "link",
					href: {
						type: "internal",
						path: UrlUtil.PG_QUICKREF,
						hash,
						hashPreEncoded: true,
						hover: {
							page: UrlUtil.PG_QUICKREF,
							source: source || SRC_CRB,
							hash,
							hashPreEncoded: true,
						},
					},
					text: displayText,
				};
				this._recursiveRender(fauxEntry, textStack, meta);
				break;
			}

			case "@deity": {
				const [name, source, displayText, ...others] = Renderer.splitTagByPipe(text);
				const hash = `${name}${source ? `${HASH_LIST_SEP}${source}` : ""}`;

				const fauxEntry = {
					type: "link",
					href: {
						type: "internal",
						hash,
					},
					text: (displayText || name),
				};

				fauxEntry.href.path = UrlUtil.PG_DEITIES;
				if (!source) fauxEntry.href.hash += `${HASH_LIST_SEP}${SRC_CRB}`;
				fauxEntry.href.hover = {
					page: UrlUtil.PG_DEITIES,
					source: source || SRC_CRB,
				};
				this._recursiveRender(fauxEntry, textStack, meta);

				break;
			}

			case "@trait": {
				const [name, source, displayText, ...others] = Renderer.splitTagByPipe(text);
				const hash = BrewUtil.hasSourceJson(source) ? `${Parser.getTraitName(name)}${HASH_LIST_SEP}${source}` : Parser.getTraitName(name);
				const fauxEntry = {
					type: "link",
					href: {
						type: "internal",
						path: UrlUtil.PG_TRAITS,
						hash,
						hover: {
							page: UrlUtil.PG_TRAITS,
							source,
						},
					},
					text: (displayText || name),
				};

				this._recursiveRender(fauxEntry, textStack, meta);
				break;
			}

			case "@classFeature": {
				const unpacked = DataUtil.class.unpackUidClassFeature(text);

				const classPageHash = `${UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES]({
					name: unpacked.className,
					source: unpacked.classSource,
				})}${HASH_PART_SEP}${UrlUtil.getClassesPageStatePart({
					feature: {
						ixLevel: unpacked.level - 1,
						ixFeature: 0,
					},
				})}`;

				const fauxEntry = {
					type: "link",
					href: {
						type: "internal",
						path: UrlUtil.PG_CLASSES,
						hash: classPageHash,
						hashPreEncoded: true,
						hover: {
							page: "classfeature",
							source: unpacked.source,
							hash: UrlUtil.URL_TO_HASH_BUILDER["classFeature"](unpacked),
							hashPreEncoded: true,
						},
					},
					text: (unpacked.displayText || unpacked.name),
				};

				this._recursiveRender(fauxEntry, textStack, meta);

				break;
			}

			case "@subclassFeature": {
				const unpacked = DataUtil.class.unpackUidSubclassFeature(text);

				const classPageHash = `${UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES]({
					name: unpacked.className,
					source: unpacked.classSource,
				})}${HASH_PART_SEP}${UrlUtil.getClassesPageStatePart({
					feature: {
						ixLevel: unpacked.level - 1,
						ixFeature: 0,
					},
				})}`;

				const fauxEntry = {
					type: "link",
					href: {
						type: "internal",
						path: UrlUtil.PG_CLASSES,
						hash: classPageHash,
						hashPreEncoded: true,
						hover: {
							page: "subclassfeature",
							source: unpacked.source,
							hash: UrlUtil.URL_TO_HASH_BUILDER["subclassFeature"](unpacked),
							hashPreEncoded: true,
						},
					},
					text: (unpacked.displayText || unpacked.name),
				};

				this._recursiveRender(fauxEntry, textStack, meta);

				break;
			}

			case "@runeItem": {
				const { hashes, displayText, name, source } = DataUtil.runeItem.unpackUid(text);
				let [baseItemHash, ...runeHashes] = hashes;

				const preloadId = `${VeCt.HASH_ITEM_RUNES}${HASH_SUB_KV_SEP}${baseItemHash}${HASH_SUB_LIST_SEP}${runeHashes.join(HASH_SUB_LIST_SEP)}`;
				const itemsPageHash = `${baseItemHash}${HASH_PART_SEP}runebuilder${HASH_SUB_KV_SEP}true${HASH_SUB_LIST_SEP}${runeHashes.join(HASH_SUB_LIST_SEP)}`;

				const fauxEntry = {
					type: "link",
					href: {
						type: "internal",
						path: UrlUtil.PG_ITEMS,
						hash: itemsPageHash,
						hashPreEncoded: true,
						hover: {
							page: UrlUtil.PG_ITEMS,
							source,
							hash: UrlUtil.URL_TO_HASH_BUILDER["runeItem"]({ name, source }),
							hashPreEncoded: true,
							preloadId,
						},
					},
					text: displayText || name,
				};
				this._recursiveRender(fauxEntry, textStack, meta);
				break;
			}

			case "@condition": {
				const { name, source, displayText, others } = DataUtil.generic.unpackUid(text, tag);
				const hash = `${name.replace(/\s\d+$/, "")}${HASH_LIST_SEP}${source}`;

				const fauxEntry = {
					type: "link",
					href: {
						type: "internal",
						hash,
						path: UrlUtil.PG_CONDITIONS,
						hover: {
							page: UrlUtil.PG_CONDITIONS,
							source,
						},
					},
					text: (displayText || name),
				};
				this._recursiveRender(fauxEntry, textStack, meta);
				break;
			}
			default: {
				const { name, source, displayText, others } = DataUtil.generic.unpackUid(text, tag);
				const hash = `${name}${HASH_LIST_SEP}${source}`;

				const fauxEntry = {
					type: "link",
					href: {
						type: "internal",
						hash,
					},
					text: (displayText || name),
				};
				switch (tag) {
					case "@spell":
						fauxEntry.href.path = UrlUtil.PG_SPELLS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_SPELLS,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@ritual":
						fauxEntry.href.path = UrlUtil.PG_RITUALS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_RITUALS,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@vehicle":
						fauxEntry.href.path = UrlUtil.PG_VEHICLES;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_VEHICLES,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@item":
						fauxEntry.href.path = UrlUtil.PG_ITEMS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_ITEMS,
							source,
						};
						// FIXME: everything that has to do with add_hash is horrible and its making me do stuff like this
						fauxEntry.text = displayText || name.replace(/ \(.+\)/, "");
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@class": {
						fauxEntry.href.hover = {
							page: UrlUtil.PG_CLASSES,
							source,
						};
						if (others.length) {
							const [subclassShortName, subclassSource, featurePart] = others;

							const classStateOpts = {
								subclass: {
									shortName: subclassShortName.trim(),
									source: subclassSource
										// Subclass state uses the abbreviated form of the source for URL shortness
										? Parser.sourceJsonToAbv(subclassSource.trim())
										: source || SRC_CRB,
								},
							};

							// Don't include the feature part for hovers, as it is unsupported
							const hoverSubhashObj = UrlUtil.unpackSubHash(UrlUtil.getClassesPageStatePart(classStateOpts));
							fauxEntry.href.hover.subhashes = [{
								key: "state",
								value: hoverSubhashObj.state,
								preEncoded: true,
							}];

							if (featurePart) {
								const featureParts = featurePart.trim().split("-");
								classStateOpts.feature = {
									ixLevel: featureParts[0] || "0",
									ixFeature: featureParts[1] || "0",
								};
							}

							const subhashObj = UrlUtil.unpackSubHash(UrlUtil.getClassesPageStatePart(classStateOpts));

							fauxEntry.href.subhashes = [
								{ key: "state", value: subhashObj.state.join(HASH_SUB_LIST_SEP), preEncoded: true },
								{ key: "flst.classes.classesmiscellaneous", value: "clear" },
							];
						}
						fauxEntry.href.path = UrlUtil.PG_CLASSES;
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					}
					case "@creature":
						fauxEntry.href.path = UrlUtil.PG_BESTIARY;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_BESTIARY,
							source,
						};
						// ...|scaledLvl}
						if (others.length) {
							const targetLvl = others[0];
							fauxEntry.href.hover.preloadId = `${VeCt.HASH_CR_SCALED}:${targetLvl}`;
							fauxEntry.href.subhashes = [
								{ key: VeCt.HASH_CR_SCALED, value: targetLvl },
							];
							fauxEntry.text = displayText || `${name} (CR ${others[0]})`;
						}
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@disease":
					case "@affliction":
					case "@curse":
						fauxEntry.href.path = UrlUtil.PG_AFFLICTIONS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_AFFLICTIONS,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@bg":
					case "@background":
						fauxEntry.href.path = UrlUtil.PG_BACKGROUNDS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_BACKGROUNDS,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@archetype":
						fauxEntry.href.path = "archetypes.html";
						fauxEntry.href.hover = {
							page: UrlUtil.PG_ARCHETYPES,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@versatileHeritage": {
						fauxEntry.href.hash = HASH_BLANK;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_ANCESTRIES,
							source,
						};
						const ancStateOpts = {
							heritage: { name, source },
						};

						const subhashObj = UrlUtil.unpackSubHash(UrlUtil.getAncestriesPageStatePart(ancStateOpts));
						fauxEntry.href.hover.subhashes = [{
							key: "state",
							value: subhashObj.state,
							preEncoded: true,
						}];
						fauxEntry.href.subhashes = [
							{ key: "state", value: subhashObj.state.join(HASH_SUB_LIST_SEP), preEncoded: true },
							{ key: "flst.ancestries.ancestriesmiscellaneous", value: "clear" },
						];
						fauxEntry.href.path = UrlUtil.PG_ANCESTRIES;
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					}
					case "@ancestry":
						fauxEntry.href.hover = {
							page: UrlUtil.PG_ANCESTRIES,
							source,
						};
						if (others.length) {
							const [heritageName, heritageSource] = others;

							const ancStateOpts = {
								heritage: {
									name: heritageName.trim(),
									source: heritageSource
										? Parser.sourceJsonToAbv(heritageSource.trim())
										: source || SRC_CRB,
								},
							};

							const subhashObj = UrlUtil.unpackSubHash(UrlUtil.getAncestriesPageStatePart(ancStateOpts));
							fauxEntry.href.hover.subhashes = [{
								key: "state",
								value: subhashObj.state,
								preEncoded: true,
							}];

							fauxEntry.href.subhashes = [
								{ key: "state", value: subhashObj.state.join(HASH_SUB_LIST_SEP), preEncoded: true },
								{ key: "flst.ancestries.ancestriesmiscellaneous", value: "clear" },
							];
						}
						fauxEntry.href.path = UrlUtil.PG_ANCESTRIES;
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@eidolon":
					case "@companion":
					case "@familiar":
						fauxEntry.href.path = UrlUtil.PG_COMPANIONS_FAMILIARS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_COMPANIONS_FAMILIARS,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@familiarAbility":
						fauxEntry.href.path = UrlUtil.PG_COMPANIONS_FAMILIARS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_COMPANIONS_FAMILIARS,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@companionAbility":
						fauxEntry.href.path = UrlUtil.PG_COMPANIONS_FAMILIARS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_COMPANIONS_FAMILIARS,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@feat":
						fauxEntry.href.path = UrlUtil.PG_FEATS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_FEATS,
							source,
						};
						// FIXME: everything that has to do with add_hash is horrible and its making me do stuff like this
						fauxEntry.text = displayText || name.replace(/ \(.+\)/, "");
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@organization":
						fauxEntry.href.path = UrlUtil.PG_ORGANIZATIONS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_ORGANIZATIONS,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@creatureTemplate":
						fauxEntry.href.path = UrlUtil.PG_CREATURETEMPLATE;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_CREATURETEMPLATE,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@hazard":
						fauxEntry.href.path = UrlUtil.PG_HAZARDS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_HAZARDS,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@optfeature":
						fauxEntry.href.path = UrlUtil.PG_OPTIONAL_FEATURES;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_OPTIONAL_FEATURES,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@variantrule":
						fauxEntry.href.path = UrlUtil.PG_VARIANTRULES;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_VARIANTRULES,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@table":
						fauxEntry.href.path = UrlUtil.PG_TABLES;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_TABLES,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@action":
						fauxEntry.href.path = UrlUtil.PG_ACTIONS;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_ACTIONS,
							source,
						};
						fauxEntry.text = displayText || name.replace(/ \(.+\)/, "");
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@ability":
						fauxEntry.href.path = UrlUtil.PG_ABILITIES;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_ABILITIES,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@language":
						fauxEntry.href.path = UrlUtil.PG_LANGUAGES;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_LANGUAGES,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
					case "@place":
					case "@plane":
					case "@nation":
					case "@settlement":
						fauxEntry.href.path = UrlUtil.PG_PLACES;
						fauxEntry.href.hover = {
							page: UrlUtil.PG_PLACES,
							source,
						};
						this._recursiveRender(fauxEntry, textStack, meta);
						break;
				}

				break;
			}
		}
	};

	this._renderString_actionCopyText = function (text) {
		switch (text.toLowerCase()) {
			case "1":
			case "a":
				return "[>]"
			case "2":
			case "d":
				return "[>>]"
			case "3":
			case "t":
				return "[>>>]"
			case "f":
				return "[F]"
			case "r":
				return "[R]"
			default:
				return "[?]"
		}
	};

	this._renderString_getLoaderTagMeta = function (text) {
		const [name, file] = Renderer.splitTagByPipe(text);
		const path = /^.*?:\/\//.test(file) ? file : `https://raw.githubusercontent.com/Pf2eTools/homebrew/master/${file}`;
		return { name, path };
	};

	this._renderPrimitive = function (entry, textStack, meta, options) {
		textStack[0] += entry;
	};

	this._renderLink = function (entry, textStack, meta, options) {
		let href = this._renderLink_getHref(entry);

		const metasHooks = this._getHooks("link", "ele").map(hook => hook(entry)).filter(Boolean);
		const isDisableEvents = metasHooks.some(it => it.isDisableEvents);

		if (this._isInternalLinksDisabled && entry.href.type === "internal") {
			textStack[0] += `<span class="bold" ${isDisableEvents ? "" : this._renderLink_getHoverString(entry)} ${metasHooks.map(it => it.string).join(" ")}>${this.render(entry.text)}</span>`
		} else {
			textStack[0] += `<a href="${href}" ${entry.href.type === "internal" ? "" : `target="_blank" rel="noopener noreferrer"`} ${isDisableEvents ? "" : this._renderLink_getHoverString(entry)} ${metasHooks.map(it => it.string)}>${this.render(entry.text)}</a>`;
		}
	};

	this._renderLink_getHref = function (entry) {
		let href;
		if (entry.href.type === "internal") {
			// baseURL is blank by default
			href = `${this.baseUrl}${entry.href.path}#`;
			if (entry.href.hash != null) {
				href += entry.href.hashPreEncoded ? entry.href.hash : UrlUtil.encodeForHash(entry.href.hash);
			}
			if (entry.href.subhashes != null) {
				for (let i = 0; i < entry.href.subhashes.length; ++i) {
					href += this._renderLink_getSubhashPart(entry.href.subhashes[i]);
				}
			}
		} else if (entry.href.type === "external") {
			href = entry.href.url;
		}
		return href;
	};

	this._renderLink_getSubhashPart = function (subHash) {
		let out = "";
		if (subHash.preEncoded) out += `${HASH_PART_SEP}${subHash.key}${HASH_SUB_KV_SEP}`;
		else out += `${HASH_PART_SEP}${UrlUtil.encodeForHash(subHash.key)}${HASH_SUB_KV_SEP}`;
		if (subHash.value != null) {
			if (subHash.preEncoded) out += subHash.value;
			else out += UrlUtil.encodeForHash(subHash.value);
		} else {
			// TODO allow list of values
			out += subHash.values.map(v => UrlUtil.encodeForHash(v)).join(HASH_SUB_LIST_SEP);
		}
		return out;
	};

	this._renderLink_getHoverString = function (entry) {
		if (!entry.href.hover) return "";

		let procHash = entry.href.hover.hash
			? entry.href.hover.hashPreEncoded ? entry.href.hover.hash : UrlUtil.encodeForHash(entry.href.hover.hash)
			: entry.href.hashPreEncoded ? entry.href.hash : UrlUtil.encodeForHash(entry.href.hash);
		procHash = procHash.replace(/'/g, "\\'");

		if (this._tagExportDict) {
			this._tagExportDict[procHash] = {
				page: entry.href.hover.page,
				source: entry.href.hover.source,
				hash: procHash,
			};
		}

		if (entry.href.hover.subhashes) {
			for (let i = 0; i < entry.href.hover.subhashes.length; ++i) {
				procHash += this._renderLink_getSubhashPart(entry.href.hover.subhashes[i]);
			}
		}

		if (this._isAddHandlers) return this._getHoverString(entry.href.hover.page, entry.href.hover.source, procHash, entry.href.hover.preloadId);
		else return "";
	};

	this._getHoverString = function (page, source, procHash, preloadId) {
		return `onmouseover="Renderer.hover.pHandleLinkMouseOver(event, this, '${page}', '${source}', '${procHash}', ${preloadId ? `'${preloadId}'` : "null"})" onmouseleave="Renderer.hover.handleLinkMouseLeave(event, this)" onmousemove="Renderer.hover.handleLinkMouseMove(event, this)"  ${Renderer.hover.getPreventTouchString()}`;
	}

	/**
	 * Helper function to render an entity using this renderer
	 * @param entry
	 * @param opts
	 * @returns {string}
	 */
	this.render = function (entry, opts) {
		opts = opts || {};
		const tempStack = [];
		this.recursiveRender(entry, tempStack, opts);
		return tempStack.join("");
	};

	this.render_addTerm = function (entry, terminator = ";") {
		const tempStack = [];
		this.recursiveRender(entry, tempStack);
		return this._addTerm(tempStack.join(""), terminator);
	};

	this._addTerm = function (str, terminator = ";") {
		// checking for closing html tags
		if (/[^<>\w\s](?:<\/[^<\s]+>)*$/.test(str)) return str;
		else return `${str}${terminator}`;
	}

	// TODO: Expand this to allow rendering of other entry types
	/**
	 * @param [entries]
	 * @param [options]
	 * @param [options.andOr] true to return "; or " and " or " instead of ", " and "; ".
	*/
	this.renderJoinCommaOrSemi = function (entries, options) {
		options = options || {};
		if (entries.includes(e => typeof e !== "string")) return this.render(entries);
		if (options.andOr === true) {
			if (entries.find(element => element.includes("and" || ","))) return this.render(entries.join("; or "))
			else return this.render(entries.join(" or "));
		}
		if (entries.find(element => element.includes(","))) return this.render(entries.join("; "));
		else return this.render(entries.join(", "));
	}
}

Renderer.ENTRIES_WITH_ENUMERATED_TITLES = [
	{ type: "section", key: "entries" },
	{ type: "entries", key: "entries" },
	{ type: "options", key: "entries" },
	{ type: "inset", key: "entries" },
	{ type: "insetReadaloud", key: "entries" },
	{ type: "variant", key: "entries" },
	{ type: "variantInner", key: "entries" },
	{ type: "actions", key: "entries" },
	{ type: "flowBlock", key: "entries" },
	{ type: "optfeature", key: "entries" },
	{ type: "patron", key: "entries" },
];

Renderer.ENTRIES_WITH_CHILDREN = [
	...Renderer.ENTRIES_WITH_ENUMERATED_TITLES,
	{ type: "list", key: "items" },
	{ type: "table", key: "rows" },
];

Renderer.events = {
	handleClick_copyCode (evt, ele) {
		const $e = $(ele).parent().next("pre");
		MiscUtil.pCopyTextToClipboard($e.text());
		JqueryUtil.showCopiedEffect($e);
	},

	handleClick_toggleCodeWrap (evt, ele) {
		const nxt = !StorageUtil.syncGet("rendererCodeWrap");
		StorageUtil.syncSet("rendererCodeWrap", nxt);
		const $btn = $(ele).toggleClass("active", nxt);
		const $e = $btn.parent().next("pre");
		$e.toggleClass("rd__pre-wrap", nxt);
	},

	handleLoad_inlineStatblock (ele) {
		const observer = Renderer.utils.lazy.getCreateObserver({
			observerId: "inlineStatblock",
			fnOnObserve: Renderer.events._handleLoad_inlineStatblock_fnOnObserve.bind(Renderer.events),
		});

		observer.track(ele.parentNode);
	},

	_handleLoad_inlineStatblock_fnOnObserve ({ entry }) {
		const ele = entry.target;

		const tag = ele.dataset.statTag.uq();
		const page = ele.dataset.statPage.uq();
		const pageRenderFn = (ele.dataset.statPageRenderFn || ele.dataset.statPage).uq();
		const source = ele.dataset.statSource.uq();
		const name = ele.dataset.statName.uq();
		const hash = ele.dataset.statHash.uq();

		Renderer.hover.pCacheAndGet(page, source, hash)
			.then(toRender => {
				if (!toRender) {
					ele.outerHTML = `<div class="pf2-stat"><i>Failed to load ${Renderer.get().render(`{@${tag} ${name}|${source}}`)}!</i></div>`;
					throw new Error(`Could not find ${tag}: ${hash}`);
				}

				const fnRender = Renderer.hover._pageToRenderFn(pageRenderFn);
				const rendered = fnRender(toRender, { noPage: true });
				if (typeof rendered === "string") ele.outerHTML = rendered;
				else if (MiscUtil.isObject(rendered)) $(ele).replaceWith(rendered);
			});
	},
};

Renderer.applyProperties = function (entry, object) {
	const propSplit = Renderer.splitByPropertyInjectors(entry);
	const len = propSplit.length;
	if (len === 1) return entry;

	let textStack = "";

	for (let i = 0; i < len; ++i) {
		const s = propSplit[i];
		if (!s) continue;
		if (s.startsWith("{=")) {
			const [path, modifiers] = s.slice(2, -1).split("/");
			let fromProp = object[path];

			if (modifiers) {
				for (const modifier of modifiers) {
					switch (modifier) {
						case "a": // render "a"/"an" depending on prop value
							fromProp = Renderer.applyProperties._leadingAn.has(fromProp[0].toLowerCase()) ? "an" : "a";
							break;

						case "l":
							fromProp = fromProp.toLowerCase();
							break; // convert text to lower case
						case "t":
							fromProp = fromProp.toTitleCase();
							break; // title-case text
						case "u":
							fromProp = fromProp.toUpperCase();
							break; // uppercase text
					}
				}
			}
			textStack += fromProp;
		} else textStack += s;
	}

	return textStack;
};
Renderer.applyProperties._leadingAn = new Set(["a", "e", "i", "o", "u"]);

Renderer.applyAllProperties = function (entries, object) {
	const handlers = { string: (str) => Renderer.applyProperties(str, object) };
	return MiscUtil.getWalker().walk(entries, handlers);
};

Renderer.attackTagToFull = function (tagStr) {
	function renderTag (tags) {
		return `${tags.includes("m") ? "Melee " : tags.includes("r") ? "Ranged " : tags.includes("g") ? "Magical " : tags.includes("a") ? "Area " : ""}${tags.includes("w") ? "Weapon " : tags.includes("s") ? "Spell " : ""}`;
	}

	const tagGroups = tagStr.toLowerCase().split(",").map(it => it.trim()).filter(it => it).map(it => it.split(""));
	if (tagGroups.length > 1) {
		const seen = new Set(tagGroups.last());
		for (let i = tagGroups.length - 2; i >= 0; --i) {
			tagGroups[i] = tagGroups[i].filter(it => {
				const out = !seen.has(it);
				seen.add(it);
				return out;
			});
		}
	}
	return `${tagGroups.map(it => renderTag(it)).join(" or ")}Attack:`;
};

Renderer.splitFirstSpace = function (string) {
	const firstIndex = string.indexOf(" ");
	return firstIndex === -1 ? [string, ""] : [string.substr(0, firstIndex), string.substr(firstIndex + 1)];
};

Renderer._splitByTagsBase = function (leadingCharacter) {
	return function (string) {
		let tagDepth = 0;
		let char, char2;
		const out = [];
		let curStr = "";
		let isLastOpen = false;

		const len = string.length;
		for (let i = 0; i < len; ++i) {
			char = string[i];
			char2 = string[i + 1];

			switch (char) {
				case "{":
					isLastOpen = true;
					if (char2 === leadingCharacter) {
						if (tagDepth++ > 0) {
							curStr += "{";
						} else {
							out.push(curStr.replace(/<VE_LEAD>/g, leadingCharacter));
							curStr = `{${leadingCharacter}`;
							++i;
						}
					} else curStr += "{";
					break;

				case "}":
					isLastOpen = false;
					curStr += "}";
					if (tagDepth !== 0 && --tagDepth === 0) {
						out.push(curStr.replace(/<VE_LEAD>/g, leadingCharacter));
						curStr = "";
					}
					break;

				case leadingCharacter: {
					if (!isLastOpen) curStr += "<VE_LEAD>";
					else curStr += leadingCharacter;
					break;
				}

				default:
					isLastOpen = false;
					curStr += char;
					break;
			}
		}

		if (curStr) out.push(curStr.replace(/<VE_LEAD>/g, leadingCharacter));

		return out;
	};
};

Renderer.splitByTags = Renderer._splitByTagsBase("@");
Renderer.splitByPropertyInjectors = Renderer._splitByTagsBase("=");

Renderer._splitByPipeBase = function (leadingCharacter) {
	return function (string) {
		let tagDepth = 0;
		let char, char2;
		const out = [];
		let curStr = "";

		const len = string.length;
		for (let i = 0; i < len; ++i) {
			char = string[i];
			char2 = string[i + 1];

			switch (char) {
				case "{":
					if (char2 === leadingCharacter) tagDepth++;
					curStr += "{";

					break;

				case "}":
					if (tagDepth) tagDepth--;
					curStr += "}";

					break;

				case "|": {
					if (tagDepth) curStr += "|";
					else {
						out.push(curStr);
						curStr = "";
					}
					break;
				}

				default: {
					curStr += char;
					break;
				}
			}
		}

		if (curStr) out.push(curStr);
		return out;
	};
};

Renderer.splitTagByPipe = Renderer._splitByPipeBase("@");

Renderer.getEntryDice = function (entry, name, isAddHandlers = true) {
	const toDisplay = Renderer.getEntryDiceDisplayText(entry);

	if (entry.rollable === true) return Renderer.getRollableEntryDice(entry, name, isAddHandlers, toDisplay);
	else return toDisplay;
};

Renderer.getRollableEntryDice = function (entry, name, isAddHandlers = true, toDisplay) {
	const toPack = MiscUtil.copy(entry);
	if (typeof toPack.toRoll !== "string") {
		// handle legacy format
		toPack.toRoll = Renderer.legacyDiceToString(toPack.toRoll);
	}

	const handlerPart = isAddHandlers ? `onmousedown="event.preventDefault()" onclick="Renderer.dice.pRollerClickUseData(event, this)" data-packed-dice='${JSON.stringify(toPack).escapeQuotes()}'` : "";

	const rollableTitlePart = isAddHandlers ? Renderer.getEntryDiceTitle(toPack.subType) : null;
	const titlePart = isAddHandlers
		? `title="${[name, rollableTitlePart].filter(Boolean).join(". ").escapeQuotes()}" ${name ? `data-roll-name="${name}"` : ""}`
		: name ? `title="${name.escapeQuotes()}" data-roll-name="${name.escapeQuotes()}"` : "";

	return `<span class="roller render-roller" ${titlePart} ${handlerPart}>${toDisplay}</span>`;
};

Renderer.getEntryDiceTitle = function (subType) {
	return `Click to roll. ${subType === "damage" ? "SHIFT to roll a critical hit, CTRL to half damage (rounding down)." : subType === "d20" ? "SHIFT to roll with advantage, CTRL to roll with disadvantage." : subType === "hit" ? "SHIFT to roll with MAP, CTRL to roll with MAP × 2." : "SHIFT/CTRL to roll twice."}`
};

Renderer.legacyDiceToString = function (array) {
	let stack = "";
	array.forEach(r => {
		stack += `${r.neg ? "-" : stack === "" ? "" : "+"}${r.number || 1}d${r.faces}${r.mod ? r.mod > 0 ? `+${r.mod}` : r.mod : ""}`
	});
	return stack;
};

Renderer.getEntryDiceDisplayText = function (entry) {
	function getDiceAsStr () {
		if (entry.successThresh) return `${entry.successThresh} percent`;
		else if (typeof entry.toRoll === "string") return entry.toRoll;
		else {
			// handle legacy format
			return Renderer.legacyDiceToString(entry.toRoll)
		}
	}

	return entry.displayText ? entry.displayText : getDiceAsStr();
};

Renderer.parseScaleDice = function (tag, text) {
	// format: {@scaledice 2d6;3d6|2-8,9|1d6} (or @scaledamage)
	const [baseRoll, progression, addPerProgress, renderMode] = Renderer.splitTagByPipe(text);
	const progressionParse = MiscUtil.parseNumberRange(progression, 1, 10);
	const baseLevel = Math.min(...progressionParse);
	const options = {};
	const isMultableDice = /^(\d+)d(\d+)$/i.exec(addPerProgress);

	const getSpacing = () => {
		let diff = null;
		const sorted = [...progressionParse].sort(SortUtil.ascSort);
		for (let i = 1; i < sorted.length; ++i) {
			const prev = sorted[i - 1];
			const curr = sorted[i];
			if (diff == null) diff = curr - prev;
			else if (curr - prev !== diff) return null;
		}
		return diff;
	};

	const spacing = getSpacing();
	progressionParse.forEach(k => {
		const offset = k - baseLevel;
		if (isMultableDice && spacing != null) {
			options[k] = offset ? `${Number(isMultableDice[1]) * (offset / spacing)}d${isMultableDice[2]}` : "";
		} else {
			options[k] = offset ? [...new Array(Math.floor(offset / spacing))].map(_ => addPerProgress).join("+") : "";
		}
	});

	const out = {
		type: "dice",
		rollable: true,
		toRoll: baseRoll,
		displayText: addPerProgress,
		prompt: {
			entry: "Heighten to...",
			mode: renderMode,
			options,
		},
	};
	if (tag === "@scaledamage") out.subType = "damage";

	return out;
};

Renderer.getAbilityData = function (abArr) {
	function doRenderOuter (abObj) {
		const mainAbs = [];
		const asCollection = [];
		const areNegative = [];
		const toConvertToText = [];
		const toConvertToShortText = [];

		if (abObj != null) {
			handleAllAbilities(abObj);
			handleAbilitiesChoose();
			return new Renderer._AbilityData(toConvertToText.join("; "), toConvertToShortText.join("; "), asCollection, areNegative);
		}

		return new Renderer._AbilityData("", "", [], []);

		function handleAllAbilities (abObj, targetList) {
			MiscUtil.copy(Parser.ABIL_ABVS)
				.sort((a, b) => SortUtil.ascSort(abObj[b] || 0, abObj[a] || 0))
				.forEach(shortLabel => handleAbility(abObj, shortLabel, targetList));
		}

		function handleAbility (abObj, shortLabel, optToConvertToTextStorage) {
			if (abObj[shortLabel] != null) {
				const isNegMod = abObj[shortLabel] < 0;
				const toAdd = `${shortLabel.uppercaseFirst()} ${(isNegMod ? "" : "+")}${abObj[shortLabel]}`;

				if (optToConvertToTextStorage) {
					optToConvertToTextStorage.push(toAdd);
				} else {
					toConvertToText.push(toAdd);
					toConvertToShortText.push(toAdd);
				}

				mainAbs.push(shortLabel.uppercaseFirst());
				asCollection.push(shortLabel);
				if (isNegMod) areNegative.push(shortLabel);
			}
		}

		function handleAbilitiesChoose () {
			if (abObj.choose != null) {
				const ch = abObj.choose;
				let outStack = "";
				if (ch.weighted) {
					const w = ch.weighted;
					const areIncreaseShort = [];
					const areIncrease = w.weights.filter(it => it >= 0).sort(SortUtil.ascSort).reverse().map(it => {
						areIncreaseShort.push(`+${it}`);
						return `one ability to increase by ${it}`;
					});
					const areReduceShort = [];
					const areReduce = w.weights.filter(it => it < 0).map(it => -it).sort(SortUtil.ascSort).map(it => {
						areReduceShort.push(`-${it}`);
						return `one ability to decrease by ${it}`;
					});
					const froms = w.from.map(it => it.uppercaseFirst());
					const startText = froms.length === 6
						? `Choose `
						: `From ${froms.joinConjunct(", ", " and ")} choose `;
					toConvertToText.push(`${startText}${areIncrease.concat(areReduce).joinConjunct(", ", " and ")}`);
					toConvertToShortText.push(`${froms.length === 6 ? "Any combination " : ""}${areIncreaseShort.concat(areReduceShort).join("/")}${froms.length === 6 ? "" : ` from ${froms.join("/")}`}`);
				} else {
					const allAbilities = ch.from.length === 6;
					const allAbilitiesWithParent = isAllAbilitiesWithParent(ch);
					let amount = ch.amount === undefined ? 1 : ch.amount;
					amount = (amount < 0 ? "" : "+") + amount;
					if (allAbilities) {
						outStack += "any ";
					} else if (allAbilitiesWithParent) {
						outStack += "any other ";
					}
					if (ch.count != null && ch.count > 1) {
						outStack += `${Parser.numberToText(ch.count)} `;
					}
					if (allAbilities || allAbilitiesWithParent) {
						outStack += `${ch.count > 1 ? "unique " : ""}${amount}`;
					} else {
						for (let j = 0; j < ch.from.length; ++j) {
							let suffix = "";
							if (ch.from.length > 1) {
								if (j === ch.from.length - 2) {
									suffix = " or ";
								} else if (j < ch.from.length - 2) {
									suffix = ", ";
								}
							}
							let thsAmount = ` ${amount}`;
							if (ch.from.length > 1) {
								if (j !== ch.from.length - 1) {
									thsAmount = "";
								}
							}
							outStack += ch.from[j].uppercaseFirst() + thsAmount + suffix;
						}
					}
				}

				if (outStack.trim()) {
					toConvertToText.push(`Choose ${outStack}`);
					toConvertToShortText.push(outStack.uppercaseFirst());
				}
			}
		}

		function isAllAbilitiesWithParent (chooseAbs) {
			const tempAbilities = [];
			for (let i = 0; i < mainAbs.length; ++i) {
				tempAbilities.push(mainAbs[i].toLowerCase());
			}
			for (let i = 0; i < chooseAbs.from.length; ++i) {
				const ab = chooseAbs.from[i].toLowerCase();
				if (!tempAbilities.includes(ab)) tempAbilities.push(ab);
				if (!asCollection.includes(ab.toLowerCase)) asCollection.push(ab.toLowerCase());
			}
			return tempAbilities.length === 6;
		}
	}

	const outerStack = (abArr || [null]).map(it => doRenderOuter(it));
	if (outerStack.length <= 1) return outerStack[0];
	return new Renderer._AbilityData(
		`Choose one of: ${outerStack.map((it, i) => `(${Parser.ALPHABET[i].toLowerCase()}) ${it.asText}`).join(" ")}`,
		`One from: ${outerStack.map((it, i) => `(${Parser.ALPHABET[i].toLowerCase()}) ${it.asTextShort}`).join(" ")}`,
		[...new Set(outerStack.map(it => it.asCollection).flat())],
		[...new Set(outerStack.map(it => it.areNegative).flat())],
	);
};

Renderer._AbilityData = function (asText, asTextShort, asCollection, areNegative) {
	this.asText = asText;
	this.asTextShort = asTextShort;
	this.asCollection = asCollection;
	this.areNegative = areNegative;
};

Renderer.getFilterSubhashes = function (filters, namespace = null) {
	let customHash = null;

	const subhashes = filters.map(f => {
		const [fName, fVals, fMeta, fOpts] = f.split("=").map(s => s.trim());
		const isBoxData = fName.startsWith("fb");
		const key = isBoxData ? `${fName}${namespace ? `.${namespace}` : ""}` : `flst${namespace ? `.${namespace}` : ""}${UrlUtil.encodeForHash(fName)}`;

		let value;
		// special cases for "search" and "hash" keywords
		if (isBoxData) {
			return {
				key,
				value: fVals,
				preEncoded: true,
			}
		} else if (fName === "search") {
			// "search" as a filter name is hackily converted to a box meta option
			return {
				key: VeCt.FILTER_BOX_SUB_HASH_SEARCH_PREFIX,
				value: UrlUtil.encodeForHash(fVals),
				preEncoded: true,
			};
		} else if (fName === "hash") {
			customHash = fVals;
			return null;
		} else if (fVals.startsWith("[") && fVals.endsWith("]")) { // range
			const [min, max] = fVals.substring(1, fVals.length - 1).split(";").map(it => it.trim());
			if (max == null) { // shorthand version, with only one value, becomes min _and_ max
				value = [
					`min=${min}`,
					`max=${min}`,
				].join(HASH_SUB_LIST_SEP);
			} else {
				value = [
					min ? `min=${min}` : "",
					max ? `max=${max}` : "",
				].filter(Boolean).join(HASH_SUB_LIST_SEP);
			}
		} else {
			value = fVals.split(";")
				.map(s => s.trim())
				.filter(Boolean)
				.map(s => {
					if (s.startsWith("!")) return `${UrlUtil.encodeForHash(s.slice(1))}=2`;
					return `${UrlUtil.encodeForHash(s)}=1`;
				})
				.join(HASH_SUB_LIST_SEP);
		}

		const out = [{
			key,
			value,
			preEncoded: true,
		}];

		if (fMeta) {
			out.push({
				key: `flmt${UrlUtil.encodeForHash(fName)}`,
				value: fMeta,
				preEncoded: true,
			});
		}

		if (fOpts) {
			out.push({
				key: `flop${UrlUtil.encodeForHash(fName)}`,
				value: fOpts,
				preEncoded: true,
			});
		}

		return out;
	}).flat().filter(Boolean);

	return {
		customHash,
		subhashes,
	};
};

Renderer.utils = {
	getBorderTr: (optText) => {
		return `<tr><th class="border" colspan="6">${optText || ""}</th></tr>`;
	},

	getDividerDiv: () => {
		return `<div class="pf2-stat pf2-stat__line"></div>`
	},

	getTraitsDiv: (traits, options) => {
		traits = traits || [];
		options = options || {};
		let source;
		const renderer = Renderer.get()
		const traitsHtml = [];
		for (let trait of options.doNotSortTraits ? traits : traits.sort(SortUtil.sortTraits)) {
			const styles = ["pf2-trait"];
			if (traits.indexOf(trait) === 0) {
				styles.push("pf2-trait--left");
			}
			if (traits.indexOf(trait) === traits.length - 1) {
				styles.push("pf2-trait--right");
			}
			switch (Renderer.stripTags(trait.toLowerCase())) {
				case "uncommon": styles.push("pf2-trait--uncommon"); break;
				case "rare": styles.push("pf2-trait--rare"); break;
				case "unique": styles.push("pf2-trait--unique"); break;
			}
			if (Renderer.trait.isTraitInCategory(Renderer.stripTags(trait), "Size")) {
				styles.push("pf2-trait--size");
			} else if (Renderer.trait.isTraitInCategory(Renderer.stripTags(trait), "_alignAbv")) {
				styles.push("pf2-trait--alignment");
			} else if (Renderer.trait.isTraitInCategory(Renderer.stripTags(trait), "_settlement")) {
				styles.push("pf2-trait--settlement");
			}
			if (options.doNotTagTraits) {
				let finishedTrait = "";
				if (trait.includes(`{@`)) {
					let traitRender = renderer.render(trait)
					finishedTrait = [traitRender.slice(0, 2), ` class="${styles.join(" ")}" `, traitRender.slice(2)].join("");
				} else {
					styles.push("pf2-trait--notag");
					finishedTrait = `<a class="${styles.join(" ")}">${trait}</a>`
				}
				traitsHtml.push(finishedTrait)
			} else {
				[trait, source] = trait.split("|");
				const hash = BrewUtil.hasSourceJson(source) ? UrlUtil.encodeForHash([Parser.getTraitName(trait), source]) : UrlUtil.encodeForHash([Parser.getTraitName(trait)]);
				const url = `${UrlUtil.PG_TRAITS}#${hash}`;
				source = source || "TRT";

				const procHash = hash.replace(/'/g, "\\'");
				const hoverMeta = Renderer.get()._getHoverString(UrlUtil.PG_TRAITS, source, procHash, null);

				traitsHtml.push(`<a href="${url}" class="${styles.join(" ")}" ${hoverMeta}>${trait}<span style="letter-spacing: -.2em">&nbsp;</span></a>`)
			}
		}
		return traitsHtml.join("")
	},

	getNotes: (obj, opts) => {
		opts = opts || {};
		opts.exclude = opts.exclude || [];
		const renderer = Renderer.get();
		const renderedNotes = Object.keys(obj).filter(it => !opts.exclude.includes(it)).map(key => {
			if (opts.dice) return renderer.render(`{@d20 ${Parser.numToBonus(obj[key])}||${opts.dice.name || key}} ${key}`);
			else return `${obj[key]} ${key}`;
		}).join(", ");
		return `${renderedNotes ? ` (${renderedNotes})` : ""}`
	},

	getNameDiv: (it, opts) => {
		opts = opts || {};

		let dataPart = "";
		if (opts.page) {
			const hash = UrlUtil.URL_TO_HASH_BUILDER[opts.page](it);
			dataPart = `data-page="${opts.page}" data-source="${it.source.uq()}" data-hash="${hash.uq()}"`;
		}
		const type = opts.type != null ? opts.type : it.type || ""
		const DC = opts.level != null ? Number(opts.level) : Number(it.level)
		const level = opts.level != null ? `${opts.level}` : (!isNaN(Number(it.level)) || typeof it.level === "string") ? ` ${it.level}` : ""
		const activity = opts.activity ? ` ${it.activity != null && Parser.timeToFullEntry(it.activity).includes("@as") ? Renderer.get().render(Parser.timeToFullEntry(it.activity)) : ``}` : ``
		let typesForSkills = it.creatureType || it.traditions || it.traits || it.type || ""
		const $ele = $$`<div class="flex ${opts.isEmbedded ? "pf2-embedded-name" : ""}" ${dataPart}>
			<p class="pf2-stat pf2-stat__name"><span class="stats-name copyable" onmousedown="event.preventDefault()" onclick="Renderer.utils._pHandleNameClick(this)">${opts.prefix || ""}${it._displayName || it.name}${opts.suffix || ""}</span>${activity}</p>
			<p class="pf2-stat pf2-stat__name pf2-stat__name--level">${opts.$btnScaleLvl ? opts.$btnScaleLvl : ""}${opts.$btnResetScaleLvl ? opts.$btnResetScaleLvl : ""}
			<span title="${Parser.levelToDC(DC, type, it.traits) === "?" && Parser.typeToSkill(typesForSkills) === "" ? "" : `Identification DC ${Parser.levelToDC(DC, type, it.traits)} ${Renderer.stripTags(Parser.typeToSkill(typesForSkills))}`}">${type} ${level}</span>
			${opts.isEmbedded ? ` ${Renderer.get()._renderData_getEmbeddedToggle()}` : ""}</p>
		</div>`;
		if (opts.asJquery) return $ele;
		else return $ele[0].outerHTML;
	},

	getExcludedDiv (it, dataProp, page) {
		if (!ExcludeUtil.isInitialised) return "";
		const hash = page ? UrlUtil.URL_TO_HASH_BUILDER[page](it) : UrlUtil.autoEncodeHash(it);
		const isExcluded = ExcludeUtil.isExcluded(hash, dataProp, it.source);
		return isExcluded ? `<div class="pt-3 text-center text-danger"><b><i>Warning: This content has been <a href="blacklist.html">blacklisted</a>.</i></b></div>` : "";
	},

	getPageP: (it, opts) => {
		opts = opts || {};
		return `<p class="pf2-stat pf2-stat__source">
					${opts.prefix ? opts.prefix : ""}
					${it.source != null ? `<a href="${Parser.sourceJsonToStore(it.source)}"><strong>${Parser.sourceJsonToFull(it.source)}</strong></a>${it.page != null ? `, page ${it.page}.` : ""}` : ""}
					${opts.noReprints || !it.otherSources ? "" : Renderer.utils.getOtherSourceHtml(it.otherSources)}
				</p>`;
	},

	getOtherSourceHtml: (otherSources) => {
		return `<span class="pf2-stat__source--other">
		${Object.keys(otherSources).map(k => `${k} in ${otherSources[k]
		.map(str => {
			const [src, page] = str.split("|");
			return `<span title="${Parser.sourceJsonToFull(src)}${page ? `, page ${page}` : ""}"><a href="${Parser.sourceJsonToStore(src)}"><strong>${src}</strong></a></span>`
		}).join(", ")}.`).join(" ")}
		</span>`;
	},

	async _pHandleNameClick (ele) {
		await MiscUtil.pCopyTextToClipboard($(ele).text());
		JqueryUtil.showCopiedEffect($(ele));
	},

	tabButton: (label, funcChange, funcPopulate) => {
		return {
			label: label,
			funcChange: funcChange,
			funcPopulate: funcPopulate,
		};
	},
	_tabs: {},
	_curTab: null,
	_prevTab: null,
	bindTabButtons: (...tabButtons) => {
		Renderer.utils._tabs = {};
		Renderer.utils._prevTab = Renderer.utils._curTab;
		Renderer.utils._curTab = null;

		const $content = $("#pagecontent");
		const $wrpTab = $(`#stat-tabs`);

		$wrpTab.find(`.stat-tab-gen`).remove();

		let initialTab = null;
		const toAdd = tabButtons.map((tb, i) => {
			const toSel = (!Renderer.utils._prevTab && i === 0) || (Renderer.utils._prevTab && Renderer.utils._prevTab.label === tb.label);
			const $t = $(`<span class="ui-tab__btn-tab-head ${toSel ? `ui-tab__btn-tab-head--active` : ""} btn btn-default stat-tab-gen">${tb.label}</span>`);
			tb.$t = $t;
			$t.click(() => {
				const curTab = Renderer.utils._curTab;
				const tabs = Renderer.utils._tabs;

				if (!curTab || curTab.label !== tb.label) {
					if (curTab) curTab.$t.removeClass(`ui-tab__btn-tab-head--active`);
					Renderer.utils._curTab = tb;
					$t.addClass(`ui-tab__btn-tab-head--active`);
					if (curTab) tabs[curTab.label].content = $content.children().detach();

					tabs[tb.label] = tb;
					if (!tabs[tb.label].content && tb.funcPopulate) {
						tb.funcPopulate();
					} else {
						$content.append(tabs[tb.label].content);
					}
					if (tb.funcChange) tb.funcChange();
				}
			});
			if (Renderer.utils._prevTab && Renderer.utils._prevTab.label === tb.label) initialTab = $t;
			return $t;
		});

		if (tabButtons.length !== 1) toAdd.reverse().forEach($t => $wrpTab.prepend($t));
		(initialTab || toAdd[toAdd.length - 1]).click();
	},

	/**
	 * @param entry Data entry to search for fluff on, e.g. a creature
	 * @param prop The fluff index reference prop, e.g. `"creatureFluff"`
	 */
	getPredefinedFluff (entry, prop) {
		if (!entry.fluff) return null;

		const mappedProp = `_${prop}`;
		const mappedPropAppend = `_append${prop.uppercaseFirst()}`;
		const fluff = {};

		const assignPropsIfExist = (fromObj, ...props) => {
			props.forEach(prop => {
				if (fromObj[prop]) fluff[prop] = fromObj[prop];
			});
		};

		assignPropsIfExist(entry.fluff, "name", "type", "entries", "images");

		if (entry.fluff[mappedProp]) {
			const fromList = (BrewUtil.homebrew[prop] || []).find(it =>
				it.name === entry.fluff[mappedProp].name
				&& it.source === entry.fluff[mappedProp].source,
			);
			if (fromList) {
				assignPropsIfExist(fromList, "name", "type", "entries", "images");
			}
		}

		if (entry.fluff[mappedPropAppend]) {
			const fromList = (BrewUtil.homebrew[prop] || []).find(it => it.name === entry.fluff[mappedPropAppend].name && it.source === entry.fluff[mappedPropAppend].source);
			if (fromList) {
				if (fromList.entries) {
					fluff.entries = MiscUtil.copy(fluff.entries || []);
					fluff.entries.push(...MiscUtil.copy(fromList.entries));
				}
				if (fromList.images) {
					fluff.images = MiscUtil.copy(fluff.images || []);
					fluff.images.push(...MiscUtil.copy(fromList.images));
				}
			}
		}

		return fluff;
	},

	async pGetFluff ({ entity, pFnPostProcess, fluffUrl, fluffBaseUrl, fluffProp } = {}) {
		let predefinedFluff = Renderer.utils.getPredefinedFluff(entity, fluffProp);
		if (predefinedFluff) {
			if (pFnPostProcess) predefinedFluff = await pFnPostProcess(predefinedFluff);
			return predefinedFluff;
		}
		if (!fluffBaseUrl && !fluffUrl) return null;

		const fluffIndex = fluffBaseUrl ? await DataUtil.loadJSON(`${Renderer.get().baseUrl}${fluffBaseUrl}fluff-index.json`) : null;
		if (fluffIndex && !fluffIndex[entity.source]) return null;

		const data = fluffIndex && fluffIndex[entity.source]
			? await DataUtil.loadJSON(`${Renderer.get().baseUrl}${fluffBaseUrl}${fluffIndex[entity.source]}`)
			: await DataUtil.loadJSON(`${Renderer.get().baseUrl}${fluffUrl}`);
		if (!data) return null;

		let fluff = (data[fluffProp] || []).find(it => it.name === entity.name && it.source === entity.source);
		if (!fluff) return null;

		// Avoid modifying the original object
		if (pFnPostProcess) fluff = await pFnPostProcess(fluff);
		return fluff;
	},

	async pGetQuickRules (prop) {
		const data = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/quickrules.json`);
		const renderer = Renderer.get().setFirstSection(true);
		const toRender = data.quickRules[prop];
		const textStack = [""];
		renderer.recursiveRender(toRender.entries, textStack, { prefix: "<p class='pf2-p'>", suffix: "</p>" });
		return $$`${textStack.join("")}${Renderer.utils.getPageP(toRender)}`;
	},

	HTML_NO_INFO: "<i>No information available.</i>",
	HTML_NO_IMAGES: "<i>No images available.</i>",
	_prereqWeights: {
		level: 0,
		pact: 1,
		patron: 2,
		spell: 3,
		race: 4,
		ability: 5,
		proficiency: 6,
		spellcasting: 7,
		feature: 8,
		item: 9,
		other: 10,
		otherSummary: 11,
		[undefined]: 12,
	},
	_getPrerequisiteHtml_getShortClassName (className) {
		const ixFirstVowel = /[aeiou]/.exec(className).index;
		const start = className.slice(0, ixFirstVowel + 1);
		let end = className.slice(ixFirstVowel + 1);
		end = end.replace().replace(/[aeiou]/g, "");
		return `${start}${end}`.toTitleCase();
	},
	getPrerequisiteHtml: (prerequisites, { isListMode = false, blacklistKeys = new Set(), isTextOnly = false, isSkipPrefix = false } = {}) => {
		if (!prerequisites) { return isListMode ? "\u2014" : ""; }
		let cntPrerequisites = 0;
		// TODO: This fucking thing
		const renderer = Renderer.get();
		const listOfChoices = prerequisites.map(pr => {
			return Object.entries(pr).sort(([kA], [kB]) => Renderer.utils._prereqWeights[kA] - Renderer.utils._prereqWeights[kB]).map(([k, v]) => {
				if (blacklistKeys.has(k)) { return false; }
				cntPrerequisites += 1;
				switch (k) {
					case "level":
					{
						if (typeof v === "number") {
							if (isListMode) { return `Lvl ${v}`; } else { return `${Parser.getOrdinalForm(v)} level`; }
						} else if (!v.class && !v.subclass) {
							if (isListMode) { return `Lvl ${v.level}`; } else { return `${Parser.getOrdinalForm(v.level)} level`; }
						}
						const isSubclassVisible = v.subclass && v.subclass.visible;
						const isClassVisible = v.class && (v.class.visible || isSubclassVisible);
						if (isListMode) {
							const shortNameRaw = isClassVisible ? Renderer.utils._getPrerequisiteHtml_getShortClassName(v.class.name) : null;
							return `${isClassVisible ? `${shortNameRaw.slice(0, 4)}${isSubclassVisible ? "*" : "."} ` : ""} Lvl ${v.level}`;
						} else {
							let classPart = "";
							if (isClassVisible && isSubclassVisible) { classPart = ` ${v.class.name} (${v.subclass.name})`; } else if (isClassVisible) { classPart = ` ${v.class.name}`; } else if (isSubclassVisible) { classPart = ` &lt;remember to insert class name here&gt; (${v.subclass.name})`; }
							return `${Parser.getOrdinalForm(v.level)} level${isClassVisible ? ` ${classPart}` : ""}`;
						}
					}
					case "spell":
						return isListMode ? v.map(x => x.split("#")[0].split("|")[0].toTitleCase()).join("/") : v.map(sp => Parser.prereqSpellToFull(sp, {
							isTextOnly,
						})).joinConjunct(", ", " or ");
					case "feat":
						return isListMode ? v.map(x => x.split("|")[0].toTitleCase()).join("/") : v.map(it => `{@feat ${it}}`).joinConjunct(", ", " or ");
					case "spellcasting":
						return isListMode ? "spellcasting" : "spell repertoire or ability to prepare spells";
					case "feature":
						return isListMode ? v.map(x => Renderer.stripTags(x).toTitleCase()).join("/") : v.map(it => isTextOnly ? Renderer.stripTags(it) : it).joinConjunct(", ", " or ");
					case "item":
						return isListMode ? v.map(x => x.toTitleCase()).join("/") : v.joinConjunct(", ", " or ");
					case "otherSummary":
						return isListMode ? (v.entrySummary || Renderer.stripTags(v.entry)) : (isTextOnly ? Renderer.stripTags(v.entry) : v.entry);
					case "other":
						return isListMode ? "Special" : (isTextOnly ? Renderer.stripTags(v) : v);
					case "ability":
					{
						let hadMultipleInner = false;
						let hadMultiMultipleInner = false;
						let allValuesEqual = null;
						outer: for (const abMeta of v) {
							for (const req of Object.values(abMeta)) {
								if (allValuesEqual == null) { allValuesEqual = req; } else {
									if (req !== allValuesEqual) {
										allValuesEqual = null;
										break outer;
									}
								}
							}
						}
						const abilityOptions = v.map(abMeta => {
							if (allValuesEqual) {
								const abList = Object.keys(abMeta);
								hadMultipleInner = hadMultipleInner || abList.length > 1;
								return isListMode ? abList.map(ab => ab.uppercaseFirst()).join(", ") : abList.map(ab => Parser.attAbvToFull(ab)).joinConjunct(", ", " and ");
							} else {
								const groups = {};
								Object.entries(abMeta).forEach(([ab, req]) => {
									(groups[req] = groups[req] || []).push(ab);
								},
								);
								let isMulti = false;
								const byScore = Object.entries(groups).sort(([reqA], [reqB]) => SortUtil.ascSort(Number(reqB), Number(reqA))).map(([req, abs]) => {
									hadMultipleInner = hadMultipleInner || abs.length > 1;
									if (abs.length > 1) { hadMultiMultipleInner = isMulti = true; }
									abs = abs.sort(SortUtil.ascSortAtts);
									return `${abs.map(ab => Parser.attAbvToFull(ab)).joinConjunct(", ", " and ")} ${req}`;
								},
								);
								return isListMode ? `${isMulti || byScore.length > 1 ? "(" : ""}${byScore.join(" & ")}${isMulti || byScore.length > 1 ? ")" : ""}` : isMulti ? byScore.joinConjunct("; ", " and ") : byScore.joinConjunct(", ", " and ");
							}
						},
						);
						if (isListMode) {
							return `${abilityOptions.join("/")}${allValuesEqual != null ? ` ${allValuesEqual}+` : ""}`;
						} else {
							const isComplex = hadMultiMultipleInner || hadMultipleInner || allValuesEqual == null;
							const joined = abilityOptions.joinConjunct(hadMultiMultipleInner ? " - " : hadMultipleInner ? "; " : ", ", isComplex ? (isTextOnly ? ` /or/ ` : ` <i>or</i> `) : " or ");
							return `${joined}${allValuesEqual != null ? ` ${allValuesEqual}` : ""}`;
						}
					}
					case "armor":
					{
						return
					}
					case "weapon":
					{
						return
					}
					case "skill":
					{
						renderStack = [...new Set()]
						v.forEach(element => {
							array = new Set()
							Object.keys(element).forEach(key => {
								array.add(`${element[key]} in ${Parser.getKeyByValue(element, element[key]).map(s => `{@skill ${s.includes("lore") ? `Lore||${s.toTitleCase()}` : s.toTitleCase()}}`).joinConjunct(", ", " and ")}`)
							});
							renderStack.push(renderer.renderJoinCommaOrSemi(Array.from(array)))
						});
						return renderer.renderJoinCommaOrSemi(renderStack, { andOr: true });
					}
					default:
						throw new Error(`Unhandled key: ${k}`);
				}
			},
			).filter(Boolean).join(", ");
		},
		).filter(Boolean);
		if (!listOfChoices.length) { return isListMode ? "\u2014" : ""; }
		return `${renderer.render(isListMode ? listOfChoices.join("/") : `${isSkipPrefix ? "" : `<strong>Prerequisite${cntPrerequisites === 1 ? "" : "s"}</strong> `}${listOfChoices.joinConjunct("; ", " or ")}`)}`;
	},

	getMediaUrl (entry, prop, mediaDir) {
		if (!entry[prop]) return "";

		let href = "";
		if (entry[prop].type === "internal") {
			const baseUrl = Renderer.get().baseMediaUrls[mediaDir] || Renderer.get().baseUrl;
			const mediaPart = `${mediaDir}/${entry[prop].path}`;
			href = baseUrl !== "" ? `${baseUrl}${mediaPart}` : UrlUtil.link(mediaPart);
		} else if (entry[prop].type === "external") {
			href = entry[prop].url;
		}
		return href;
	},

	lazy: {
		_getIntersectionConfig () {
			return {
				rootMargin: "150px 0px", // if the element gets within 150px of the viewport
				threshold: 0.01,
			};
		},

		_OBSERVERS: {},
		getCreateObserver ({ observerId, fnOnObserve }) {
			if (!Renderer.utils.lazy._OBSERVERS[observerId]) {
				const observer = Renderer.utils.lazy._OBSERVERS[observerId] = new IntersectionObserver(
					Renderer.utils.lazy.getFnOnIntersect({
						observerId,
						fnOnObserve,
					}),
					Renderer.utils.lazy._getIntersectionConfig(),
				);

				observer._TRACKED = new Set();

				observer.track = it => {
					observer._TRACKED.add(it);
					return observer.observe(it);
				};

				observer.untrack = it => {
					observer._TRACKED.delete(it);
					return observer.unobserve(it);
				};

				// If we try to print a page with e.g. un-loaded images, attempt to load them all first
				observer._printListener = evt => {
					if (!observer._TRACKED.size) return;

					// region Sadly we cannot cancel or delay the print event, so, show a blocking alert
					[...observer._TRACKED].forEach(it => {
						observer.untrack(it);
						fnOnObserve({
							observer,
							entry: {
								target: it,
							},
						});
					});

					alert(`All content must be loaded prior to printing. Please cancel the print and wait a few moments for loading to complete!`);
					// endregion
				};
				window.addEventListener("beforeprint", observer._printListener);
			}
			return Renderer.utils.lazy._OBSERVERS[observerId];
		},

		destroyObserver ({ observerId }) {
			const observer = Renderer.utils.lazy._OBSERVERS[observerId];
			if (!observer) return;

			observer.disconnect();
			window.removeEventListener("beforeprint", observer._printListener);
		},

		getFnOnIntersect ({ observerId, fnOnObserve }) {
			return obsEntries => {
				const observer = Renderer.utils.lazy._OBSERVERS[observerId];

				obsEntries.forEach(entry => {
					// filter observed entries for those that intersect
					if (entry.intersectionRatio <= 0) return;

					observer.untrack(entry.target);
					fnOnObserve({
						observer,
						entry,
					});
				});
			};
		},
	},
};

Renderer.get = () => {
	if (!Renderer.defaultRenderer) Renderer.defaultRenderer = new Renderer();
	return Renderer.defaultRenderer;
};

Renderer.ability = {
	getRenderedString (it, opts) {
		opts = opts || {};

		return `${Renderer.utils.getExcludedDiv(it, "ability", UrlUtil.PG_ABILITIES)}
		${Renderer.utils.getNameDiv(it, { page: UrlUtil.PG_ABILITIES, activity: true, type: "", ...opts })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(it.traits || [])}
		${Renderer.ability.getSubHead(it)}
		${Renderer.generic.getRenderedEntries(it)}
		${opts.noPage ? "" : Renderer.utils.getPageP(it)}`;
	},
	getSubHead (it) {
		const renderStack = [];
		const renderer = Renderer.get();
		// FIXME: Is this order right?
		if (it.aspect != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Aspect&nbsp;</strong>${renderer.render(it.aspect)}</p>`);
		}
		if (it.cost != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Cost&nbsp;</strong>${renderer.render(it.cost)}</p>`);
		}
		if (it.prerequisites != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Prerequisites&nbsp;</strong>${renderer.render(it.prerequisites)}</p>`);
		}
		if (it.frequency != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Frequency&nbsp;</strong>${renderer.render(Parser.freqToFullEntry(it.frequency))}</p>`);
		}
		if (it.trigger != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Trigger&nbsp;</strong>${renderer.render(it.trigger)}</p>`);
		}
		if (it.requirements != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Requirements&nbsp;</strong>${renderer.render(it.requirements)}</p>`);
		}
		if (renderStack.length !== 0) renderStack.push(Renderer.utils.getDividerDiv())
		return renderStack.join("");
	},
};

Renderer.action = {
	getRenderedString (it, opts) {
		opts = opts || {};

		return `${Renderer.utils.getExcludedDiv(it, "action", UrlUtil.PG_ACTIONS)}
		${Renderer.utils.getNameDiv(it, { page: UrlUtil.PG_ACTIONS, activity: true, type: "", ...opts })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(it.traits || [])}
		${Renderer.action.getSubHead(it)}
		${Renderer.generic.getRenderedEntries(it)}
		${opts.noPage ? "" : Renderer.utils.getPageP(it)}`;
	},
	getSubHead (it) {
		const renderStack = [];
		const renderer = Renderer.get()
		if (it.actionType) {
			if (it.actionType.skill) {
				renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Skill&nbsp;</strong>`);
				if (it.actionType.skill.untrained) renderStack.push(`${renderer.render(`${it.actionType.skill.untrained.map(a => `{@skill ${a.toTitleCase()}}`).join(", ")} (untrained)`)}`)
				if (it.actionType.skill.trained) renderStack.push(`${renderer.render(`${it.actionType.skill.trained.map(a => `{@skill ${a.toTitleCase()}}`).join(", ")} (trained)`)}`)
				if (it.actionType.skill.expert) renderStack.push(`${renderer.render(`${it.actionType.skill.expert.map(a => `{@skill ${a.toTitleCase()}}`).join(", ")} (expert)`)}`)
				if (it.actionType.skill.legendary) renderStack.push(`${renderer.render(`${it.actionType.skill.legendary.map(a => `{@skill ${a.toTitleCase()}}`).join(", ")} (legendary)`)}`)
				renderStack.push(`</p>`)
			}
			if (it.actionType.class) {
				renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Class&nbsp;</strong>${renderer.render(`${it.actionType.class.map(c => `{@class ${c.toTitleCase()}}`).join(", ")}`)}`);
				if (it.actionType.subclass) {
					const subClasses = [];
					for (let i = 0; i < it.actionType.subclass.length; i++) {
						if (it.actionType.subclass[i]) {
							const [c, cSrc] = it.actionType.class[i].split("|");
							const [sc, scSrc] = it.actionType.subclass[i].split("|");
							subClasses.push(renderer.render(`{@class ${c}|${cSrc || ""}|${sc}|${sc}|${scSrc || ""}}`))
						}
					}
					renderStack.push(`; <strong>Subclass&nbsp;</strong>${subClasses.join(", ")}`);
				}
				renderStack.push(`</p>`)
			}
			if (it.actionType.archetype) {
				renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Archetype&nbsp;</strong>${renderer.render(`${it.actionType.archetype.map(a => `{@archetype ${a}}`).join(", ")}`)}</p>`);
			}
			if (it.actionType.ancestry || it.actionType.heritage || it.actionType.versatileHeritage) {
				if (it.actionType.ancestry) {
					it.actionType.ancestry.forEach(a => {
						ancestryName = a ? a.split(`|`)[0] : null
						ancestrySource = a ? a.split(`|`)[1] || "" : ""
						renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Ancestry&nbsp;</strong>${renderer.render(`{@ancestry ${ancestryName}|${ancestrySource}|`)}`);
						if (it.actionType.heritage || it.actionType.versatileHeritage) renderStack.push(`; `)
					})
				}
				if (it.actionType.heritage) {
					it.actionType.heritage.forEach(h => {
						heritageName = h ? h.split(`|`)[0] : null
						heritageSource = h ? h.split(`|`)[1] || "" : ""
						renderStack.push(`<strong>Heritage&nbsp;</strong>${renderer.render(`{@ancestry ${ancestryName}|${ancestrySource}|${heritageName}|${heritageName}|${heritageSource}|}`)}`);
						if (it.actionType.versatileHeritage) renderStack.push(`; `)
					})
				}
				if (it.actionType.versatileHeritage) {
					it.actionType.versatileHeritage.forEach(v => {
						versatileHeritageName = v ? v.split(`|`)[0] : null
						versatileHeritageSource = v ? v.split(`|`)[1] || "" : ""
						if (!it.actionType.ancestry) renderStack.push(`<p class="pf2-stat pf2-stat__section">`);
						renderStack.push(`<strong>Versatile Heritage&nbsp;</strong>${renderer.render(`{@ancestry ${ancestryName ? `${ancestryName}|${ancestrySource}` : "Human|CRB"}|${versatileHeritageName}|${versatileHeritageName}|${versatileHeritageSource}|}`)}`);
					})
				}
				renderStack.push(`</p>`)
			}
			if (it.actionType.variantrule) {
				renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Variant Rule&nbsp;</strong>${renderer.render(`{@variantrule ${it.actionType.variantrule}}`)}`);
				renderStack.push(`</p>`)
			}
		}
		if (it.cost != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Cost&nbsp;</strong>${renderer.render(it.cost)}</p>`);
		}
		if (it.prerequisites != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Prerequisites&nbsp;</strong>${renderer.render(it.prerequisites)}</p>`);
		}
		if (it.frequency != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Frequency&nbsp;</strong>${renderer.render(Parser.freqToFullEntry(it.frequency))}</p>`);
		}
		if (it.trigger != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Trigger&nbsp;</strong>${renderer.render(it.trigger)}</p>`);
		}
		if (it.requirements != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Requirements&nbsp;</strong>${renderer.render(it.requirements)}</p>`);
		}
		if (renderStack.length !== 0) renderStack.push(Renderer.utils.getDividerDiv())
		return renderStack.join("");
	},
	getQuickRules (it) {
		let renderStack = [""]
		Renderer.get().setFirstSection(true).recursiveRender({ type: "pf2-h3", name: it.name, entries: it.info }, renderStack)
		return `
		${Renderer.utils.getExcludedDiv(it, "action", UrlUtil.PG_ACTIONS)}
		${renderStack.join("")}
		${Renderer.utils.getPageP(it)}`
	},
};

Renderer.adventureBook = {
	getEntryIdLookup (bookData, doThrowError = true) {
		const out = {};
		const titlesRel = {};

		let chapIx;
		const handlers = {
			object: (obj) => {
				Renderer.ENTRIES_WITH_ENUMERATED_TITLES
					.forEach(meta => {
						if (obj.type !== meta.type) return;

						if (obj.id) {
							if (out[obj.id]) {
								(out.__BAD = out.__BAD || []).push(obj.id);
							} else {
								out[obj.id] = {
									chapter: chapIx,
									entry: obj,
								};

								if (obj.name) {
									const cleanName = obj.name.toLowerCase();
									titlesRel[cleanName] = titlesRel[cleanName] || 0;
									out[obj.id].ixTitleRel = titlesRel[cleanName]++;
									out[obj.id].nameClean = cleanName;
								}
							}
						}
					});

				return obj;
			},
		};

		bookData.forEach((chap, _chapIx) => {
			chapIx = _chapIx;
			MiscUtil.getWalker().walk(chap, handlers);
		});

		if (doThrowError) if (out.__BAD) throw new Error(`IDs were already in storage: ${out.__BAD.map(it => `"${it}"`).join(", ")}`);

		return out;
	},
};

Renderer.affliction = {
	getRenderedString (affliction, opts) {
		opts = opts || {};
		const renderer = Renderer.get();
		const renderStack = [];
		renderer.setFirstSection(true);

		renderStack.push(`${Renderer.utils.getExcludedDiv(affliction, affliction.__prop || affliction._type, UrlUtil.PG_AFFLICTIONS)}`)
		renderStack.push(`
			${Renderer.utils.getNameDiv(affliction, { page: UrlUtil.PG_AFFLICTIONS, level: affliction.level !== null ? affliction.level : "", ...opts })}
			${Renderer.utils.getDividerDiv()}
			${Renderer.utils.getTraitsDiv(affliction.traits || [])}
		`);
		if (affliction.usage) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Usage </strong>${renderer.render(affliction.usage)}</p>${Renderer.utils.getDividerDiv()}`)
		renderer.recursiveRender(affliction.entries, renderStack, { pf2StatFix: true });
		if (!opts.noPage) renderStack.push(Renderer.utils.getPageP(affliction))

		return renderStack.join("");
	},
};

Renderer.ancestry = {
	getRenderedString (it, opts) {
		if (it.__prop === "ancestry") return Renderer.ancestry.getRenderedAncestry(it, opts);
		if (it.__prop === "heritage") return Renderer.ancestry.getRenderedHeritage(it, opts);
		if (it.__prop === "versatileHeritage") return Renderer.ancestry.getRenderedVersatileHeritage(it, opts);
	},

	getRenderedAncestry (anc, opts) {
		// FIXME: This is now less bad
		opts = opts || {};
		const renderer = Renderer.get().setFirstSection(true);
		const renderStack = [];
		renderStack.push(`${Renderer.utils.getNameDiv(anc, { page: UrlUtil.PG_ANCESTRIES, type: "Ancestry", ...opts })}`)
		renderStack.push(Renderer.utils.getDividerDiv())
		renderStack.push(`<div class="pf2-sidebar--compact">`)
		if (anc.rarity) renderStack.push(renderer.render(`<div><p class="pf2-title">Rarity</p><p class="pf2-sidebar__text">{@trait ${anc.rarity.toTitleCase()}}</p></div>`))
		renderStack.push(`<div><p class="pf2-title">Hit Points</p><p class="pf2-sidebar__text">${anc.hp}</p></div>`)
		renderStack.push(`<div><p class="pf2-title">Size</p><p class="pf2-sidebar__text">${anc.size.joinConjunct(", ", " or ").toTitleCase()}</p></div>`)
		renderStack.push(`<div><p class="pf2-title">Speed</p><p class="pf2-sidebar__text">${Parser.speedToFullMap(anc.speed).join(", ")}</p></div>`)
		if (anc.boosts) renderStack.push(`<div><p class="pf2-title">Ability Boosts</p><p class="pf2-sidebar__text">${anc.boosts.join(", ").toTitleCase()}</p></div>`)
		if (anc.flaw) renderStack.push(`<div><p class="pf2-title">Ability Flaw</p><p class="pf2-sidebar__text">${anc.flaw.join(", ").toTitleCase()}</p></div>`)
		// FIXME: This is a wonky solution to the hover pup-up being spammed with the "you can choose your language" text. Perhaps split the data between languages you always know and ones you can choose?
		if (anc.languages) renderStack.push(`<div><p class="pf2-title">Languages</p><p class="pf2-sidebar__text">${renderer.render(anc.languages.join(", ").replace(/, Additional languages [\s\S]+region\)\./g, ""))}</p></div>`)
		if (anc.traits) renderStack.push(`<div><p class="pf2-title">Traits</p><p class="pf2-sidebar__text">${renderer.render(anc.traits.join(", ").toTitleCase())}</p></div>`)
		renderStack.push(`
			${anc.feature ? `<div><p class="pf2-title">${anc.feature.name}</p><p class="pf2-sidebar__text">${renderer.render(anc.feature.entries)}</p></div>` : ""}
			${anc.features ? anc.features.map(f => `<div><p class="pf2-title">${f.name}</p><p class="pf2-sidebar__text">${renderer.render(f.entries)}</p></div>`).join("") : ""}
		`)
		renderStack.push(`</div>`)
		if (!opts.noPage) renderStack.push(Renderer.utils.getPageP(anc));
		return renderStack.join("");
	},

	getRenderedHeritage (her, opts) {
		const renderer = Renderer.get().setFirstSection(true);
		const renderStack = [];
		renderer.recursiveRender({ type: "pf2-h3", name: her.name, entries: her.entries }, renderStack);
		return `${renderStack.join("")}`;
	},

	getRenderedVersatileHeritage (vHer, opts) {
		const renderer = Renderer.get().setFirstSection(true);
		const renderStack = [];
		renderer.recursiveRender({ type: "pf2-h2", name: vHer.name, entries: vHer.entries }, renderStack);
		return `${renderStack.join("")}`;
	},

	pGetFluff (ancestry) {
		return Renderer.utils.pGetFluff({
			entity: ancestry,
			fluffProp: "ancestryFluff",
			fluffUrl: `data/fluff-ancestries.json`,
		});
	},
};

Renderer.archetype = {
	getRenderedString (arc) {
		const renderer = Renderer.get().setFirstSection(true);
		const renderStack = [];
		Renderer.get().setFirstSection(true).recursiveRender(arc.entries, renderStack, { pf2StatFix: true });

		return `${Renderer.utils.getNameDiv(arc, { page: UrlUtil.PG_ARCHETYPES, type: "ARCHETYPE" })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(arc.traits || [])}
		${renderer.render({ type: "pf2-h4", entries: arc.entries })}
		${Renderer.utils.getPageP(arc)}
		`;
	},
};

Renderer.background = {
	getRenderedString (bg, opts) {
		opts = opts || {};
		const renderStack = [];
		Renderer.get().setFirstSection(true).recursiveRender(bg.entries, renderStack, { pf2StatFix: true });

		return `
		${Renderer.utils.getExcludedDiv(bg, "background", UrlUtil.PG_BACKGROUNDS)}
		${Renderer.utils.getNameDiv(bg, { page: UrlUtil.PG_BACKGROUNDS, type: "BACKGROUND", ...opts })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(bg.traits || [])}
		${renderStack.join("")}
		${Renderer.utils.getPageP(bg)}
		`;
	},

	pGetFluff (bg) {
		return Renderer.utils.pGetFluff({
			entity: bg,
			fluffUrl: "data/fluff-backgrounds.json",
			fluffProp: "backgroundFluff",
		});
	},
};

Renderer.companionfamiliar = {
	getRenderedString (it, opts) {
		if (it.__prop === "familiarAbility") return Renderer.familiar.getRenderedFamiliarAbility(it, opts)
		if (it.__prop === "companionAbility") return Renderer.companion.getRenderedCompanionAbility(it, opts)
		if (it.__prop === "companion") return Renderer.companion.getRenderedString(it, opts);
		if (it.__prop === "familiar") return Renderer.familiar.$getRenderedString(it, opts);
		if (it.__prop === "eidolon") return Renderer.eidolon.getRenderedString(it, opts);
	},

	getRenderedSenses (it) {
		const renderer = Renderer.get();
		if (!it.senses) return ""
		return `<p class="pf2-stat pf2-stat__section"><strong>Senses&nbsp;</strong>${Object.entries(it.senses).map(([k, v]) => {
			return v.map(s => `${renderer.render(s)}${k === "other" ? "" : ` (${k})`}`)
		}).flat().join(", ")}</p>`
	},
};
Renderer.companion = {
	getRenderedString (companion, opts) {
		opts = opts || {};
		const renderer = Renderer.get();
		return `${Renderer.utils.getExcludedDiv(companion, "companion", UrlUtil.PG_COMPANIONS_FAMILIARS)}
		${Renderer.utils.getNameDiv(companion, { type: "Companion", ...opts })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(companion.traits)}
		${companion.access ? `<p class="pf2-stat pf2-stat__section"><strong>Access&nbsp;</strong>${renderer.render(companion.access)}</p>` : ""}
		${(companion.traits && companion.traits.length) || companion.access ? Renderer.utils.getDividerDiv() : ""}
		<p class="pf2-stat pf2-stat__section"><strong>Size&nbsp;</strong>${companion.size}</p>
		${Renderer.creature.getAttacks(companion)}
		${Renderer.creature.getAbilityMods(companion.abilityMods)}
		<p class="pf2-stat pf2-stat__section"><strong>Hit Points&nbsp;</strong>${companion.hp}</p>
		<p class="pf2-stat pf2-stat__section"><strong>Skill&nbsp;</strong>${renderer.render(`{@skill ${companion.skill}}`)}</p>
		${Renderer.companionfamiliar.getRenderedSenses(companion)}
		${Renderer.creature.getSpeed(companion)}
		${companion.special ? `<p class="pf2-stat pf2-stat__section"><strong>Special&nbsp;</strong>${renderer.render(companion.special)}</p>` : ""}
		${companion.support ? `<p class="pf2-stat pf2-stat__section"><strong>Support Benefit&nbsp;</strong>${renderer.render(companion.support)}</p>` : ""}
		${companion.maneuver ? `<p class="pf2-stat pf2-stat__section mb-4"><strong>Advanced Maneuver&nbsp;</strong>${companion.maneuver.name}</p>` : ""}
		${companion.maneuver ? Renderer.action.getRenderedString(companion.maneuver, { noPage: true }) : ""}
		${opts.noPage ? "" : Renderer.utils.getPageP(companion)}`;
	},
	getRenderedCompanionAbility (it, opts) {
		return `${Renderer.utils.getNameDiv(it)}
			${Renderer.utils.getDividerDiv()}
			${Renderer.utils.getTraitsDiv(it.traits)}
			${Renderer.generic.getRenderedEntries(it)}
			${Renderer.utils.getPageP(it)}`;
	},
};
Renderer.familiar = {
	$getRenderedString (familiar, opts) {
		opts = opts || {};
		const renderer = Renderer.get();
		return $$`${Renderer.utils.getExcludedDiv(familiar, "familiar", UrlUtil.PG_COMPANIONS_FAMILIARS)}
		${Renderer.utils.getNameDiv(familiar, { type: "Familiar", ...opts })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(familiar.traits)}
		${familiar.access ? `<p class="pf2-stat pf2-stat__section"><strong>Access&nbsp;</strong>${renderer.render(familiar.access)}</p>` : ""}
		${familiar.alignment ? `<p class="pf2-stat pf2-stat__section"><strong>Alignment&nbsp;</strong>${familiar.alignment}</p>` : ""}
		${familiar.requires ? `<p class="pf2-stat pf2-stat__section"><strong>Required Number of Abilities&nbsp;</strong>${familiar.requires}</p>` : ""}
		${familiar.granted && !familiar.granted.length === 0 ? `<p class="pf2-stat pf2-stat__section"><strong>Granted Abilities&nbsp;</strong>${renderer.render(familiar.granted.join(", "))}</p>` : ""}
		${Renderer.utils.getDividerDiv()}
		${familiar.abilities.map(a => Renderer.creature.getRenderedAbility(a))}
		${opts.noPage ? "" : Renderer.utils.getPageP(familiar)}`;
	},

	getRenderedFamiliarAbility (it, opts) {
		// TODO:
		return `${Renderer.utils.getNameDiv(it, { type: `${it.type} Ability` })}
			${Renderer.utils.getDividerDiv()}
			${Renderer.utils.getTraitsDiv(it.traits)}
			${Renderer.generic.getRenderedEntries(it)}
			${Renderer.utils.getPageP(it)}`;
	},
};
Renderer.eidolon = {
	getRenderedString (eidolon, opts) {
		opts = opts || {};
		const renderer = Renderer.get().setFirstSection(false);
		return `${Renderer.utils.getExcludedDiv(eidolon, "eidolon", UrlUtil.PG_COMPANIONS_FAMILIARS)}
		${Renderer.utils.getNameDiv(eidolon, { type: "Eidolon", ...opts })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(eidolon.traits)}
		${eidolon.tradition ? `<p class="pf2-stat pf2-stat__section"><strong>Tradition&nbsp;</strong>${renderer.render(eidolon.tradition)} ${renderer.render(eidolon.traditionNote)}</p>` : ""}
		${eidolon.alignment ? `<p class="pf2-stat pf2-stat__section"><strong>Alignment&nbsp;</strong>${renderer.render(eidolon.alignment)}</p>` : ""}
		${eidolon.home ? `<p class="pf2-stat pf2-stat__section"><strong>Home Plane&nbsp;</strong>${renderer.render(eidolon.home)}</p>` : ""}
		${Renderer.utils.getDividerDiv()}
		<p class="pf2-stat pf2-stat__section"><strong>Size&nbsp;</strong>${renderer.render(eidolon.size.map(t => `{@trait ${t}}`).joinConjunct(", ", " or "))}</p>
		${eidolon.extraStats ? eidolon.extraStats.map(es => `<p class="pf2-stat pf2-stat__section"><strong>${es.name}&nbsp;</strong>${renderer.render(es.entries)}</p>`) : ""}
		<p class="pf2-stat pf2-stat__section"><strong>Suggested Attacks&nbsp;</strong>${renderer.render(eidolon.suggestedAttacks)}</p>
		${eidolon.stats.map(s => `<p class="pf2-stat pf2-stat__section"><strong>${s.name || ""}&nbsp;</strong>${Object.entries(s.abilityScores).map(([k, v]) => `<i>${k.toTitleCase()}</i> ${v}`).join(", ")}; ${Parser.numToBonus(s.ac.number)} AC (${Parser.numToBonus(s.ac.dexCap)} Dex Cap)</p>`).join("")}
		<p class="pf2-stat pf2-stat__section"><strong>Skills&nbsp;</strong>${renderer.render(eidolon.skills.map(s => `{@skill ${s}}`).join(", "))}</p>
		${Renderer.companionfamiliar.getRenderedSenses(eidolon)}
		<p class="pf2-stat pf2-stat__section"><strong>Language&nbsp;</strong>${renderer.render(eidolon.languages.map(l => `{@language ${l}}`).join(", "))}</p>
		${Renderer.creature.getSpeed(eidolon)}
		${Renderer.utils.getDividerDiv()}
		<p class="pf2-stat pf2-stat__section"><strong>Eidolon Abilities&nbsp;</strong>${eidolon.abilities.map(a => `<i>${a.type.toTitleCase()}</i> ${a.name}`).join("; ")}</p>
		${eidolon.abilities.map(a => `${renderer.render({ type: "pf2-h4", name: a.name, level: a.level, entries: a.entries })}`).join("")}
		${opts.noPage ? "" : Renderer.utils.getPageP(eidolon)}`;
	},

};

Renderer.class = {
	getRenderedString (cls, opts) {
		opts = opts || {};
		const renderer = Renderer.get().setFirstSection(true);
		const fakeEntry = { type: "pf2-h1", name: cls.name, entries: cls.entries.map(e => ({ type: "pf2-h3", ...e })) }

		return renderer.render(fakeEntry, opts)
	},

	getCompactRenderedClassFeature (clsFeature, opts) {
		opts = opts || {};
		const renderer = Renderer.get().setFirstSection(true);
		const fakeEntry = { type: "pf2-h3", name: clsFeature.name, entries: clsFeature.entries }

		return renderer.render(fakeEntry, opts)
	},
};

Renderer.condition = {
	getRenderedString (cond, opts) {
		opts = opts || {};
		const renderer = Renderer.get();
		const renderStack = [];
		renderer.setFirstSection(true);

		renderStack.push(`${Renderer.utils.getExcludedDiv(cond, cond.__prop || cond._type, UrlUtil.PG_CONDITIONS)}`)
		renderStack.push(`
			${Renderer.utils.getNameDiv(cond, { page: UrlUtil.PG_CONDITIONS, type: "condition", ...opts })}
			${Renderer.utils.getDividerDiv()}
		`);
		renderer.recursiveRender(cond.entries, renderStack, { pf2StatFix: true });
		if (!opts.noPage) renderStack.push(Renderer.utils.getPageP(cond))

		return renderStack.join("");
	},
};

Renderer.creature = {
	getRenderedString (cr, opts) {
		cr = scaleCreature.applyVarRules(cr);
		opts = opts || {};
		if (opts.showScaler) {
			opts.$btnResetScaleLvl = opts.$btnResetScaleLvl || Renderer.creature.$getBtnResetScaleLvl(cr);
			opts.$btnScaleLvl = opts.$btnScaleLvl || Renderer.creature.$getBtnScaleLvl(cr);
			opts.asJquery = true;
		}

		return $$`<div class="pf2-stat">${Renderer.utils.getExcludedDiv(cr, "creature", UrlUtil.PG_BESTIARY)}
			${Renderer.utils.getNameDiv(cr, { page: UrlUtil.PG_BESTIARY, type: cr.type || "CREATURE", ...opts })}
			${Renderer.utils.getDividerDiv()}
			${Renderer.utils.getTraitsDiv(cr.traits)}
			${Renderer.creature.getPerception(cr)}
			${Renderer.creature.getLanguages(cr)}
			${Renderer.creature.getSkills(cr)}
			${Renderer.creature.getAbilityMods(cr.abilityMods)}
			${cr.abilities && cr.abilities.top ? cr.abilities.top.map(it => Renderer.creature.getRenderedAbility(it, { noButton: true })) : ""}
			${Renderer.creature.getItems(cr)}
			${Renderer.utils.getDividerDiv()}
			${Renderer.creature.getDefenses(cr)}
			${cr.abilities && cr.abilities.mid ? cr.abilities.mid.map(it => Renderer.creature.getRenderedAbility(it, { noButton: true })) : ""}
			${Renderer.utils.getDividerDiv()}
			${Renderer.creature.getSpeed(cr)}
			${Renderer.creature.getAttacks(cr)}
			${Renderer.creature.getSpellCasting(cr)}
			${Renderer.creature.getRituals(cr)}
			${cr.abilities && cr.abilities.bot ? cr.abilities.bot.map(it => Renderer.creature.getRenderedAbility(it, { noButton: true })) : ""}
			${opts.noPage ? "" : Renderer.utils.getPageP(cr)}</div>`;
	},

	getPerception (cr) {
		const renderer = Renderer.get();
		const perception = cr.perception;
		const senses = cr.senses || [];
		const rdPerception = renderer.render(`{@d20 ${perception.std}||Perception}`);
		const rdOtherPerception = Renderer.utils.getNotes(perception, { exclude: ["std"], dice: { name: "Perception" } });
		const rdSenses = renderer.renderJoinCommaOrSemi(senses.map(s => `${s.name}${s.type ? ` (${s.type})` : ""}${s.range != null ? ` ${s.range.number} feet` : ""}`));
		return `<p class="pf2-stat pf2-stat__section"><strong>Perception&nbsp;</strong>${rdPerception}${rdOtherPerception}${rdSenses.length ? "; " : ""}${rdSenses}</p>`;
	},

	getLanguages (cr) {
		const renderer = Renderer.get()
		if (cr.languages != null && (cr.languages.languages.length !== 0 || (cr.languages.abilities && cr.languages.abilities.length !== 0))) {
			let renderStack = [];

			renderStack.push(`<p class="pf2-stat pf2-stat__section">`)
			renderStack.push(`<span><strong>Languages&nbsp;</strong></span>`)
			renderStack.push(`<span>`)
			renderStack.push(cr.languages.languages.length !== 0 ? cr.languages.languages.join(", ") : "— ")
			if (cr.languages.abilities && cr.languages.abilities.length !== 0) {
				if (cr.languages.languages.length !== 0) renderStack.push("; ")
				renderStack.push(renderer.render(cr.languages.abilities.join(", ")))
			}
			renderStack.push(`</span>`)
			renderStack.push(`</p>`)

			return renderStack.join("")
		} else return ""
	},

	getSkills (cr) {
		if (cr.skills != null && (Object.keys(cr.skills).length !== 0)) {
			let renderStack = [];
			const renderer = Renderer.get();

			renderStack.push(`<p class="pf2-stat pf2-stat__section">`)
			renderStack.push(`<strong>Skills&nbsp;</strong>`)
			let skills = []
			Object.keys(cr.skills).forEach(skill => {
				let renderedSkill = `${skill} ${renderer.render(`{@d20 ${cr.skills[skill].std}||${skill}}`)}${Renderer.utils.getNotes(cr.skills[skill], { exclude: ["std"], dice: { name: skill } })}`;
				skills.push(renderedSkill)
			});

			renderStack.push(skills.sort().join("<span>, </span>"))
			renderStack.push(`</p>`)

			return renderStack.join("")
		} else return ""
	},

	getAbilityMods (mods) {
		const renderer = Renderer.get();
		return `<p class="pf2-stat pf2-stat__section">
			<strong>Str&nbsp;</strong>${renderer.render(`{@d20 ${mods.str}||Strength}`)}
			<strong>Dex&nbsp;</strong>${renderer.render(`{@d20 ${mods.dex}||Dexterity}`)}
			<strong>Con&nbsp;</strong>${renderer.render(`{@d20 ${mods.con}||Constitution}`)}
			<strong>Int&nbsp;</strong>${renderer.render(`{@d20 ${mods.int}||Intelligence}`)}
			<strong>Wis&nbsp;</strong>${renderer.render(`{@d20 ${mods.wis}||Wisdom}`)}
			<strong>Cha&nbsp;</strong>${renderer.render(`{@d20 ${mods.cha}||Charisma}`)}
		</p>`;
	},

	getItems (cr) {
		if (cr.items != null) {
			let renderStack = [];
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`)
			renderStack.push(`<span><strong>Items&nbsp;</strong></span>`)
			renderStack.push(Renderer.get().render(cr.items.join(", ")))
			renderStack.push(`</p>`)
			return renderStack.join("")
		} else return ""
	},

	getDefenses (cr) {
		let renderStack = [];
		const renderer = Renderer.get();
		renderStack.push(`<p class="pf2-stat pf2-stat__section">`);
		const ac = cr.ac;
		renderStack.push(`<span><strong>AC&nbsp;</strong>${ac.std}${Renderer.utils.getNotes(ac, { exclude: ["std", "abilities"] })}`);
		if (ac.abilities != null) renderStack.push(`; ${renderer.render(ac.abilities)}`);
		const st = cr.savingThrows
		renderStack.push(`; <strong>Fort&nbsp;</strong>`);
		renderStack.push(Renderer.get().render(`{@d20 ${st.fort.std}||Fortitude Save}`));
		renderStack.push(Renderer.utils.getNotes(st.fort, { exclude: ["std", "abilities"], dice: { name: "Fortitude Save" } }));
		renderStack.push(`, <strong>Ref&nbsp;</strong>`);
		renderStack.push(Renderer.get().render(`{@d20 ${st.ref.std}||Reflex Save}`));
		renderStack.push(Renderer.utils.getNotes(st.ref, { exclude: ["std", "abilities"], dice: { name: "Reflex Save" } }));
		renderStack.push(`, <strong>Will&nbsp;</strong>`);
		renderStack.push(Renderer.get().render(`{@d20 ${st.will.std}||Will Save}`));
		renderStack.push(Renderer.utils.getNotes(st.will, { exclude: ["std", "abilities"], dice: { name: "Will Save" } }));
		if (st.abilities != null) renderStack.push(`, ${renderer.render(st.abilities)}`);
		renderStack.push(`</span>`)
		renderStack.push(`</p>`)

		renderStack.push(`<p class="pf2-stat pf2-stat__section">`)
		renderStack.push(cr.hp.map(hp => {
			return `<span><strong>HP&nbsp;</strong>${hp.note != null ? `${hp.note} ` : ``}${hp.hp}${renderer.render(`${hp.abilities != null ? `, ${hp.abilities.join(", ")}` : ``}`)}`;
		}).join(" "));
		if (cr.hardness != null) {
			renderStack.push(`; <strong>Hardness&nbsp;</strong>${cr.hardness}`)
		}
		if (cr.immunities != null) {
			renderStack.push(`; <strong>Immunities&nbsp;</strong>`)
			renderStack.push(renderer.render(cr.immunities.join(", ")));
		}
		if (cr.weaknesses != null) {
			renderStack.push(`; <strong>Weaknesses&nbsp;</strong>`)
			let ws = []
			for (let x of cr.weaknesses) {
				if (typeof (x) === "string") {
					ws.push(x)
				} else {
					ws.push(`${x.name}${x.amount ? ` ${x.amount}` : ""}${x.note ? ` ${x.note}` : ``}`)
				}
			}
			renderStack.push(ws.join(", "))
		}
		if (cr.resistances != null) {
			renderStack.push(`; <strong>Resistances&nbsp;</strong>`)
			let rs = []
			for (let x of cr.resistances) {
				if (typeof (x) === "string") {
					rs.push(x)
				} else {
					rs.push(`${x.name}${x.amount ? ` ${x.amount}` : ""}${x.note ? ` ${renderer.render(x.note)}` : ``}`)
				}
			}
			renderStack.push(rs.join(", "))
		}
		renderStack.push(`</span>`)
		renderStack.push(`</p>`)

		return renderStack.join("")
	},

	getSpeed (cr) {
		const renderer = Renderer.get();
		const speeds = cr.speed.walk != null ? [`${cr.speed.walk} feet`] : [];
		speeds.push(...Object.keys(cr.speed).filter(k => !(["abilities", "walk"].includes(k))).map(k => `${k} ${cr.speed[k]} feet`));
		return `<p class="pf2-stat pf2-stat__section">
				<strong>Speed&nbsp;</strong>${speeds.join(", ")}${cr.speed.abilities != null ? `; ${renderer.render(cr.speed.abilities.join(", "))}` : ""}</p>`
	},

	getAttacks (cr) {
		if (cr.attacks) {
			const renderer = Renderer.get();
			const renderStack = [""];
			cr.attacks.forEach(a => renderer._renderAttack(a, renderStack));
			return renderStack.join("");
		}
	},

	getSpellCasting (cr) {
		if (cr.spellcasting != null) {
			const renderer = Renderer.get()
			let renderStack = [];
			for (let sc of cr.spellcasting) {
				const meta = [];
				if (sc.DC != null) meta.push(`DC ${sc.DC}`);
				if (sc.attack != null) meta.push(`attack {@hit ${sc.attack}||Spell attack}`);
				if (sc.fp != null) meta.push(`${sc.fp} Focus Points`);
				renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>${sc.name}${/Spell/.test(sc.name) ? "" : " Spells"}&nbsp;</strong>${renderer.render(meta.join(", "))}`)
				Object.keys(sc.entry).sort(SortUtil.sortSpellLvlCreature).forEach((lvl) => {
					if (lvl !== "constant") {
						renderStack.push(`<span>; <strong>${lvl === "0" ? "Cantrips" : Parser.getOrdinalForm(lvl)}&nbsp;</strong>`)
						if (sc.entry[lvl].level != null) renderStack.push(`<strong>(${Parser.getOrdinalForm(sc.entry[lvl].level)})&nbsp;</strong>`)
						if (sc.entry[lvl].slots != null) renderStack.push(`(${sc.entry[lvl].slots} slots) `)
						let spells = []
						for (let spell of sc.entry[lvl].spells) {
							let amount = spell.amount != null ? typeof (spell.amount) === "number" ? [`×${spell.amount}`] : [spell.amount] : []
							let notes = spell.notes != null ? spell.notes : []
							let bracket = ""
							if (amount.length || notes.length) {
								bracket = ` (${amount.concat(notes).join(", ")})`
							}
							spells.push(`{@spell ${spell.name}|${spell.source || SRC_CRB}|${spell.name}}${bracket}`)
						}
						renderStack.push(renderer.render(spells.join(", ")))
					} else {
						renderStack.push(`<span>; <strong>Constant&nbsp;</strong></span>`)
						Object.keys(sc.entry["constant"]).sort().reverse().forEach((clvl) => {
							renderStack.push(`<span><strong>(${Parser.getOrdinalForm(clvl)})&nbsp;</strong></span>`)
							let spells = []
							for (let spell of sc.entry["constant"][clvl].spells) {
								let notes = spell.notes != null ? spell.notes : []
								let bracket = ""
								if (notes.length) {
									bracket = ` (${notes.join(", ")})`
								}
								spells.push(`{@spell ${spell.name}|${spell.source || SRC_CRB}|${spell.name}}${bracket}`)
							}
							renderStack.push(renderer.render(`${spells.join(", ")}; `))
						});
					}
				});
				renderStack.push(`</p>`)
			}
			return renderStack.join("")
		} else return ""
	},

	getRituals (cr) {
		if (cr.rituals == null) return "";
		const renderer = Renderer.get();
		const renderRitual = (r) => {
			return `{@ritual ${r.name}|${r.source || ""}}${r.notes == null && r.level == null ? "" : ` (${[Parser.getOrdinalForm(r.level)].concat(...(r.notes || [])).filter(Boolean).join(", ")})`}`;
		};
		return `${cr.rituals.map(rf => `<p class="pf2-stat pf2-stat__section"><strong>${rf.tradition ? `${rf.tradition} ` : ""}Rituals</strong> DC ${rf.DC};${renderer.render(rf.rituals.map(r => renderRitual(r)).join(", "))}`)}`;
	},

	getRenderedAbility (ability, opts) {
		opts = opts || {};
		const renderer = Renderer.get();
		if (ability.type === "affliction") return renderer.render(ability);
		const buttonClass = Parser.stringToSlug(`ab ${ability.name}`);

		let renderedGenericAbility;
		const generic = ability.generic;
		if (generic != null && !opts.isRenderingGeneric) {
			const tag = generic.tag || "ability";
			const name = generic.name || ability.name;
			generic.name = name;
			const source = generic.source || Parser.TAG_TO_DEFAULT_SOURCE[tag];
			generic.source = source;
			const catId = Parser._parse_bToA(Parser.CAT_ID_TO_PROP, tag);
			const page = generic.page || UrlUtil.CAT_TO_PAGE[catId];
			generic.page = page;
			const hash = generic.hash || UrlUtil.URL_TO_HASH_BUILDER[page](generic);
			generic.hash = hash;
			renderedGenericAbility = `<div class="pf2-stat pf2-stat__section" data-stat-tag="${tag.qq()}" data-stat-name="${name.qq()}" data-stat-hash="${hash.qq()}" data-stat-page-render-fn="genericCreatureAbility" data-stat-page="${page.qq()}" data-stat-source="${source.qq()}">
				<i>Loading ${renderer.render(`{@${tag} ${name}|${source}}`)}...</i>
				<style onload="Renderer.events.handleLoad_inlineStatblock(this)"></style>
			</div>`;
		}
		const isRenderButton = (generic || opts.isRenderingGeneric) && !opts.noButton && !opts.asHTML;
		const abilityName = generic ? renderer.render(`{@${generic.tag} ${ability.name}${generic.add_hash ? ` (${generic.add_hash})` : ""}|${ability.source ? ability.source : generic.source ? generic.source : ""}${ability.title ? `|${ability.title}` : ""}}`) : ability.name;

		// Button doesn't work with asHTML
		const $ele = $$`<p class="pf2-stat pf2-stat__section ${buttonClass} ${opts.isRenderingGeneric ? "hidden" : ""}"><strong>${abilityName}</strong>
					${ability.activity ? renderer.render(Parser.timeToFullEntry(ability.activity)) : ""}
					${isRenderButton ? Renderer.creature.getAbilityTextButton(buttonClass, opts.isRenderingGeneric) : ""}
					${ability.traits && ability.traits.length ? `(${ability.traits.map(t => renderer.render(`{@trait ${t.toLowerCase()}}`)).join(", ")}); ` : ""}
					${ability.frequency ? `<strong>Frequency&nbsp;</strong>${renderer.render_addTerm(Parser.freqToFullEntry(ability.frequency))}` : ""}
					${ability.requirements ? `<strong>Requirements&nbsp;</strong>${renderer.render_addTerm(ability.requirements)}` : ""}
					${ability.trigger ? `<strong>Trigger&nbsp;</strong>${renderer.render_addTerm(ability.trigger)}` : ""}
					${ability.frequency || ability.requirements || ability.trigger ? "<strong>Effect</strong>" : ""}
					${(ability.entries || []).map(it => renderer.render(it)).join(" ")}
					</p>
					${renderedGenericAbility || ""}`;
		if (!opts.asHTML) return $ele;
		else return $ele[0].outerHTML;
	},

	getAbilityTextButton (buttonClass, generic) {
		return $(`<button title="Toggle short/long text" class="btn btn-xs btn-default">
					<span class="glyphicon ${generic ? "glyphicon-eye-close" : "glyphicon-eye-open"}"></span></button>`)
			.on("click").click((evt) => {
				evt.stopPropagation();
				$(`.${buttonClass}`).toggleClass("hidden");
			});
	},

	getLvlScaleTarget (win, $btnScaleLvl, lastLvl, origLvl, cbRender, isCompact) {
		const evtName = "click.cr-scaler";
		let slider;
		const $body = $(win.document.body);
		function cleanSliders () {
			$body.find(`.mon__cr_slider_wrp`).remove();
			$btnScaleLvl.off(evtName);
			if (slider) slider.destroy();
		}

		cleanSliders();

		const $wrp = $(`<div class="mon__cr_slider_wrp ${isCompact ? "mon__cr_slider_wrp--compact" : ""}"></div>`);

		const cur = lastLvl;
		if (!Parser.isValidCreatureLvl(lastLvl)) throw new Error(`Initial level ${lastLvl} was not valid!`);
		if (!Parser.isValidCreatureLvl(origLvl)) throw new Error(`Initial level ${origLvl} was not valid!`);

		const comp = BaseComponent.fromObject({
			min: -1,
			max: 25,
			cur,
		})
		slider = new ComponentUiUtil.RangeSlider({
			comp,
			propMin: "min",
			propMax: "max",
			propCurMin: "cur",
		});
		slider.$get().appendTo($wrp);

		const $wrpBtns = $(`<div class="flex"></div>`).appendTo($wrp);

		$(`<button class="ui-slidr__btn cr-adjust--weak">Weak</button>`).off().click(() => {
			const state = { min: -1, max: 25, cur: origLvl - 1 }
			slider._comp._proxyAssignSimple("state", state)
		}).appendTo($wrpBtns);
		$(`<button class="ui-slidr__btn cr-adjust--elite">Elite</button>`).off().click(() => {
			const state = { min: -1, max: 25, cur: origLvl + 1 }
			slider._comp._proxyAssignSimple("state", state)
		}).appendTo($wrpBtns);

		$btnScaleLvl.off(evtName).on(evtName, (evt) => evt.stopPropagation());
		$wrp.on(evtName, (evt) => evt.stopPropagation());
		$body.off(evtName).on(evtName, cleanSliders);

		comp._addHookBase("cur", () => {
			cbRender(comp._state.cur);
			$body.off(evtName);
			cleanSliders();
		});

		$btnScaleLvl.after($wrp);
	},

	bindScaleLvlButtons ($content, toRender, renderFn, page, source, hash, meta, sourceData) {
		$content
			.find(".mon__btn-scale-lvl")
			.click(evt => {
				evt.stopPropagation();
				const win = (evt.view || {}).window;

				const $btn = $(evt.target).closest("button");
				const initialLvl = toRender._originalLvl != null ? toRender._originalLvl : toRender.level;
				const lastLvl = toRender.level;

				Renderer.creature.getLvlScaleTarget(
					win,
					$btn,
					lastLvl,
					initialLvl,
					async (targetLvl) => {
						const original = await Renderer.hover.pCacheAndGet(page, source, hash);
						if (targetLvl === initialLvl) {
							toRender = original;
							sourceData.type = "stats";
							delete sourceData.level;
						} else {
							toRender = await scaleCreature.scale(toRender, targetLvl);
							sourceData.type = "statsCreatureScaled";
							sourceData.level = targetLvl;
						}

						$content.empty().append(renderFn(toRender));
						meta.windowMeta.$windowTitle.text(toRender._displayName || toRender.name);
						Renderer.creature.bindScaleLvlButtons($content, toRender, renderFn, page, source, hash, meta, sourceData);
					},
					true,
				);
			});

		$content
			.find(".mon__btn-reset-lvl")
			.click(async () => {
				toRender = await Renderer.hover.pCacheAndGet(page, source, hash);
				$content.empty().append(renderFn(toRender));
				meta.windowMeta.$windowTitle.text(toRender._displayName || toRender.name);
				Renderer.creature.bindScaleLvlButtons($content, toRender, renderFn, page, source, hash, meta, sourceData);
			});
	},

	$getBtnScaleLvl (cr) {
		const $btnScaleLvl = cr.level != null ? $(`
			<button title="Scale Creature By Level (Highly Experimental)" class="mon__btn-scale-lvl btn btn-xs btn-default">
				<span class="glyphicon glyphicon-signal"/>
			</button>`) : null;
		return $btnScaleLvl.off("click");
	},

	$getBtnResetScaleLvl (cr) {
		const isScaled = cr.level != null && cr._originalLvl != null;
		const $btnResetScaleLvl = cr.level != null ? $(`
			<button title="Reset Level Scaling" class="mon__btn-reset-lvl btn btn-xs btn-default">
				<span class="glyphicon glyphicon-refresh"></span>
			</button>`).toggle(isScaled) : null;
		return $btnResetScaleLvl.off("click");
	},

	async pGetFluff (creature) {
		return Renderer.utils.pGetFluff({
			entity: creature,
			fluffBaseUrl: `data/bestiary/`,
			fluffProp: "creatureFluff",
		});
	},

	// region Custom hash ID packing/unpacking
	getCustomHashId (cr) {
		if (!cr._isScaledLvl) return null;

		const {
			name,
			source,
			_scaledLvl: scaledLvl,
		} = cr;

		return [
			name,
			source,
			scaledLvl ?? "",
		].join("__").toLowerCase();
	},

	getUnpackedCustomHashId (customHashId) {
		if (!customHashId) return null;
		const [, , scaledLvl] = customHashId.split("__").map(it => it.trim());
		if (scaledLvl == null) return null;
		return {
			_scaledLvl: Number(scaledLvl),
			customHashId,
		};
	},
	// endregion

	async pGetModifiedCreature (cr, customHashId) {
		if (!customHashId) return cr;
		const { _scaledLvl } = Renderer.creature.getUnpackedCustomHashId(customHashId);
		if (_scaledLvl != null) return scaleCreature.scale(cr, _scaledLvl);
		throw new Error(`Unhandled custom hash ID "${customHashId}"`);
	},
};

Renderer.deity = {
	getRenderedString (deity, opts) {
		opts = opts || {};
		const renderer = Renderer.get().setFirstSection(true);
		const renderStack = [];
		if (deity.info && deity.info.length) {
			renderStack.push(Renderer.utils.getDividerDiv());
			renderer.recursiveRender(deity.info, renderStack, { pf2StatFix: true });
		}
		return `${Renderer.utils.getExcludedDiv(deity, "deity", UrlUtil.PG_DEITIES)}
			${Renderer.utils.getNameDiv(deity, { type: `${deity.alignment && deity.alignment.length === 1 ? `${deity.alignment[0]}` : ""} Deity`, ...opts })}
			${renderStack.join("")}
			${deity.anathema || deity.edicts || deity.followerAlignment ? Renderer.utils.getDividerDiv() : ""}
			${Renderer.deity.getEdictsAnathemaAlign(deity)}
			${deity.devoteeBenefits ? Renderer.utils.getDividerDiv() : ""}
			${Renderer.deity.getDevoteeBenefits(deity)}
			${opts.noPage ? "" : Renderer.utils.getPageP(deity)}`;
	},

	getEdictsAnathemaAlign (deity) {
		let out = [];
		const renderer = Renderer.get();
		const edictsDelim = (deity.edicts || []).map(it => it.includes(",")).some(Boolean) ? "; " : ", ";
		const anathemaDelim = (deity.anathema || []).map(it => it.includes(",")).some(Boolean) ? "; " : ", ";
		if (deity.edicts) out.push(`<p class="pf2-stat__section"><strong>Edicts&nbsp;</strong>${renderer.render(deity.edicts.join(edictsDelim))}</p>`)
		if (deity.anathema) out.push(`<p class="pf2-stat__section"><strong>Anathema&nbsp;</strong>${renderer.render(deity.anathema.join(anathemaDelim))}</p>`)
		if (deity.followerAlignment) out.push(renderer.render(`<p class="pf2-stat__section"><strong>Follower Alignments&nbsp;</strong>${deity.followerAlignment.entry ? deity.followerAlignment.entry : deity.followerAlignment.alignment.map(a => a.toUpperCase()).map(a => a.length > 2 ? a : `{@trait ${a}}`).join(", ")}</p>`))
		return out.join("")
	},

	getClericSpells (spells) {
		return Object.keys(spells).map(k => `${Parser.getOrdinalForm(k)}: ${spells[k].map(s => `{@spell ${s}}`).join(", ")}`).join(", ").replace(/ \((.+)\)\}/g, `} ($1)`);
	},

	getDevoteeBenefits (deity) {
		if (deity.devoteeBenefits == null) return "";
		let out = [];
		const renderer = Renderer.get()
		const b = deity.devoteeBenefits;
		// FIXME: See FEAT-39 on Discords
		if (b.font) out.push(`<p class="pf2-stat__section"><strong>Divine Font&nbsp;</strong>${renderer.render(b.font.map(f => `{@spell ${f}}`).join(" or "))}</p>`)
		if (b.ability) out.push(`<p class="pf2-stat__section"><strong>Divine Ability&nbsp;</strong>${renderer.render(b.ability.entry)}</p>`)
		if (b.skill) out.push(`<p class="pf2-stat__section"><strong>Divine Skill&nbsp;</strong>${renderer.render(b.skill.map(s => `{@skill ${s.toTitleCase()}}`).join(", "))}</p>`)
		if (b.domains) out.push(`<p class="pf2-stat__section"><strong>Domains&nbsp;</strong>${renderer.render(b.domains.map(it => `{@filter ${it}|spells||domains=${it}}`).join(", "))}</p>`)
		if (b.alternateDomains) out.push(`<p class="pf2-stat__section"><strong>Alternate Domains&nbsp;</strong>${renderer.render(b.alternateDomains.map(it => `{@filter ${it}|spells||domains=${it}}`).join(", "))}</p>`)
		if (b.spells) out.push(`<p class="pf2-stat__section"><strong>Cleric Spells&nbsp;</strong>${renderer.render(Renderer.deity.getClericSpells(b.spells))}</p>`)
		if (b.weapon) out.push(`<p class="pf2-stat__section"><strong>Favored Weapon&nbsp;</strong>${renderer.render(b.weapon.map(w => `{@item ${w}}`).join(" or "))}</p>`)
		if (b.avatar) {
			out.push(`<p class="pf2-h3">Avatar</p>`)
			if (b.avatar.preface) out.push(`<p class="pf2-stat">${renderer.render(b.avatar.preface)}</p>`)
			out.push(`<p class="pf2-stat"><strong>${deity.name}</strong> `)
			if (b.avatar.speed) out.push(`${b.avatar.speed.walk ? `Speed ${b.avatar.speed.walk} feet` : "no land Speed"}${Object.keys(b.avatar.speed).filter(type => type !== "walk").map(s => (typeof b.avatar.speed[s] === "number") ? `, ${s} Speed ${b.avatar.speed[s]} feet` : "").join("")}`)
			let notes = []
			if (b.avatar.airWalk) notes.push(`{@spell air walk}`)
			if (b.avatar.immune) notes.push(`immune to ${b.avatar.immune.map(i => `{@condition ${i}}`).joinConjunct(", ", " and ")}`)
			if (b.avatar.ignoreTerrain) notes.push("ignore {@quickref difficult terrain||3|terrain} and {@quickref greater difficult terrain||3|terrain}")
			if (b.avatar.speed.speedNote) notes.push(`${b.avatar.speed.speedNote}`)
			if (notes.length > 0) out.push(`, ${renderer.render(notes.join(", "))}`)
			if (b.avatar.shield) out.push(`; shield (${b.avatar.shield} Hardness, can't be damaged)`)
			if (b.avatar.melee || b.avatar.ranged) {
				out.push(`; `)
				if (b.avatar.melee) {
					b.avatar.melee.forEach((element, index, array) => {
						out.push(Renderer.deity.getRenderedMeleeAttack(element))
						out.push(array.length - 1 === index ? "" : "; ")
					});
				}
				if (b.avatar.ranged) {
					if (b.avatar.melee && Object.keys(b.avatar.melee).length) out.push(`; `)
					b.avatar.ranged.forEach((element, index, array) => {
						out.push(Renderer.deity.getRenderedRangedAttack(element))
						out.push(array.length - 1 === index ? "" : "; ")
					});
				}
				out.push(`.`)
			}
			out.push(`</p>`)
		}

		return out.join("")
	},

	getRenderedRangedAttack (attack) {
		const renderer = Renderer.get()
		let out = []
		let rangedTraits = []
		if (attack.traits && attack.traits.length) rangedTraits = rangedTraits.concat(attack.traits.map(t => `{@trait ${t.toLowerCase()}}`))
		if (attack.preciousMetal) rangedTraits = rangedTraits.concat(attack.preciousMetal)
		if (attack.traitNote) rangedTraits.push(attack.traitNote)
		rangedTraits.push(`${attack.range ? `range ${attack.reload || attack.rangedIncrement ? "increment" : ""} ${attack.range} feet` : ""}${attack.reload ? `, reload ${attack.reload}` : ""}`)

		out.push(renderer.render(`<strong>Ranged</strong> {@as 1} `))
		out.push(renderer.render(attack.name))
		out.push(renderer.render(` (${rangedTraits.sort(SortUtil.sortTraits).join(", ")}), `))
		out.push(renderer.render(`<strong>Damage</strong> {@damage ${attack.damage}} ${attack.damageType}${attack.damageType2 && attack.damage ? ` and {@damage ${attack.damage2}} ${attack.damageType2}` : ``}`))
		if (attack.note) out.push(renderer.render(`. ${attack.note}`))
		return out.join("")
	},

	getRenderedMeleeAttack (attack) {
		const renderer = Renderer.get()
		let out = []
		let meleeTraits = []
		if (attack.traits && attack.traits.length) meleeTraits = meleeTraits.concat(attack.traits.map(t => `{@trait ${t.toLowerCase()}}`))
		if (attack.preciousMetal) meleeTraits = meleeTraits.concat(attack.preciousMetal)
		if (attack.traitNote) meleeTraits.push(attack.traitNote)

		out.push(renderer.render(`<strong>Melee</strong> {@as 1} `))
		out.push(renderer.render(attack.name))
		if (meleeTraits.length) { out.push(renderer.render(` (${meleeTraits.join(", ")}), `)) } else out.push(" ")
		out.push(renderer.render(`<strong>Damage</strong> {@damage ${attack.damage}} ${attack.damageType}${attack.damageType2 && attack.damage ? ` and {@damage ${attack.damage2}} ${attack.damageType2}` : ``}`))
		if (attack.note) out.push(renderer.render(` ${attack.note}.`))
		return out.join("")
	},

	getRenderedLore (deity) {
		const textStack = [""];
		const renderer = Renderer.get().setFirstSection(true)
		if (deity.lore) deity.lore.forEach(l => renderer.recursiveRender(l, textStack));
		return textStack.join("");
	},

	getIntercession (deity) {
		const textStack = [""];
		const renderer = Renderer.get().setFirstSection(true)
		if (deity.intercession) {
			const entry = {
				type: "pf2-h2",
				name: "Divine Intercession",
				entries: deity.intercession.flavor ? deity.intercession.flavor : [],
			};
			renderer.recursiveRender(entry, textStack);
			if (deity.intercession.boon) {
				Object.keys(deity.intercession.boon)
					.map(key => `<p class="pf2-book__option"><strong>${key}&nbsp;</strong>${renderer.render(deity.intercession.boon[key])}</p>`)
					.forEach(it => textStack.push(it))
			}
			if (deity.intercession.curse) {
				Object.keys(deity.intercession.curse)
					.map(key => `<p class="pf2-book__option"><strong>${key}&nbsp;</strong>${renderer.render(deity.intercession.curse[key])}</p>`)
					.forEach(it => textStack.push(it))
			}
			// textStack.push(`<p class="pf2-p">${renderer.render(`{@note published in ${deity.intercession.source}, page ${deity.intercession.page}.}`)}</p>`)
		}
		return textStack.join("");
	},

	getImage (deity) {
		const textStack = [""];
		if (deity.images) {
			const img = deity.images[0];
			if (img.includes("2e.aonprd.com")) textStack.push(`<a target="_blank" rel="noopener noreferrer" title="Shift/Ctrl to open in a new window/tab." href="${img}">Images available on the Archives of Nethys.</a>`);
			else textStack.push(`<p><img style="display: block; margin-left: auto; margin-right: auto; width: 50%;" src="${img}" alt="No Image Found."></p>`);
		}
		return textStack.join("");
	},

	async pGetFluff (deity) {
		return Renderer.utils.pGetFluff({
			entity: deity,
			fluffUrl: `data/fluff-deities.json`,
			fluffProp: "deityFluff",
		});
	},
};

Renderer.domain = {
	getRenderedString (domain) {
		// TODO: Add filter link to deities and spells?
		const renderer = Renderer.get().setFirstSection(true);
		const textStack = [];
		renderer.recursiveRender(domain.entries, textStack, { pf2StatFix: true })
		return `${renderer.render({ type: "pf2-h3", name: `${domain.name} (Domain)` })}
		${textStack.join("")}
		${Renderer.utils.getPageP(domain)}`;
	},
}

Renderer.feat = {
	getSubHead (feat) {
		const renderStack = [];
		const renderer = Renderer.get()
		if (feat.access != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Access&nbsp;</strong>${renderer.render(feat.access)}</p>`);
		}
		// TODO: Fully transition to objects
		if (feat.prerequisites != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Prerequisites&nbsp;</strong>`)
			renderStack.push(renderer.render(feat.prerequisites))
			renderStack.push(`</p>`)
		}
		if (feat.prerequisiteArray != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Prerequisites&nbsp;</strong>`)
			renderStack.push(Renderer.utils.getPrerequisiteHtml(feat.prerequisiteArray, { isSkipPrefix: true }))
			renderStack.push(`</p>`)
		}
		if (feat.frequency != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Frequency&nbsp;</strong>${renderer.render(Parser.freqToFullEntry(feat.frequency))}</p>`);
		}
		if (feat.trigger != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Trigger&nbsp;</strong>${renderer.render(feat.trigger)}</p>`);
		}
		if (feat.cost != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Cost&nbsp;</strong>${renderer.render(feat.cost)}</p>`);
		}
		if (feat.requirements != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Requirements&nbsp;</strong>${renderer.render(feat.requirements)}</p>`);
		}
		if (renderStack.length !== 0) renderStack.push(Renderer.utils.getDividerDiv())
		return renderStack.join("");
	},

	getLeadsTo (feat) {
		const renderer = Renderer.get();
		if (feat.leadsTo && feat.leadsTo.length) {
			return `<p class="pf2-stat pf2-stat__text mt-2">${renderer.render(`{@note This feat leads to: ${feat.leadsTo.map(it => `{@feat ${it}}`).joinConjunct(", ", " and ")}.}`)}</p>`
		} else return "";
	},

	getRenderedString (feat, opts) {
		opts = opts || {};

		return `${Renderer.utils.getExcludedDiv(feat, "feat", UrlUtil.PG_FEATS)}
			${Renderer.utils.getNameDiv(feat, { page: UrlUtil.PG_FEATS, type: "FEAT", activity: true, ...opts })}
			${Renderer.utils.getDividerDiv()}
			${Renderer.utils.getTraitsDiv(feat.traits)}
			${Renderer.feat.getSubHead(feat)}
			${Renderer.generic.getRenderedEntries(feat)}
			${opts.renderLeadsTo ? Renderer.feat.getLeadsTo(feat) : ""}
			${opts.noPage ? "" : Renderer.utils.getPageP(feat)}`;
	},
};

Renderer.group = {
	getRenderedString (group) {
		// TODO: Add filter link to items?
		const renderer = Renderer.get().setFirstSection(true);
		const textStack = [];
		renderer.recursiveRender(group.specialization, textStack, { pf2StatFix: true })
		return `${renderer.render({ type: "pf2-h3", name: `${group.name} (${group.type} Group)` })}
		${textStack.join("")}
		${Renderer.utils.getPageP(group)}`;
	},
};

Renderer.hazard = {
	getRenderedString (hazard, opts) {
		opts = opts || {};
		const renderStack = [""];
		const renderer = Renderer.get();
		renderStack.push(`
		${Renderer.utils.getExcludedDiv(hazard, "hazard", UrlUtil.PG_HAZARDS)}
		${Renderer.utils.getNameDiv(hazard, { page: UrlUtil.PG_HAZARDS, type: "HAZARD", ...opts })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(hazard.traits || [])}`);
		if (hazard.stealth) {
			let stealthText = hazard.stealth.dc != null ? `DC ${hazard.stealth.dc}` : `{@d20 ${hazard.stealth.bonus}||Stealth}`;
			if (hazard.stealth.minProf) stealthText += ` (${hazard.stealth.minProf})`;
			if (hazard.stealth.notes) stealthText += ` ${hazard.stealth.notes}`;
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Stealth&nbsp;</strong>${renderer.render(stealthText)}</p>`);
		}
		if (hazard.perception) {
			let perceptionText = hazard.perception.dc != null ? `DC ${hazard.perception.dc}` : `{@d20 ${hazard.perception.bonus}||perception}`;
			if (hazard.perception.minProf) perceptionText += ` (${hazard.perception.minProf})`;
			if (hazard.perception.notes) perceptionText += ` ${hazard.perception.notes}`;
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Perception&nbsp;</strong>${renderer.render(perceptionText)}</p>`);
		}
		if (hazard.abilities) {
			hazard.abilities.forEach(a => {
				renderStack.push(Renderer.creature.getRenderedAbility(a, { noButton: true, asHTML: true }))
			});
		}
		if (hazard.description) {
			const descriptionStack = [`<p class="pf2-stat pf2-stat__section--wide"><strong>Description&nbsp;</strong>`];
			renderer.recursiveRender(hazard.description, descriptionStack);
			descriptionStack.push(`</p>`);
			renderStack.push(descriptionStack.join(""));
		}
		renderStack.push(Renderer.utils.getDividerDiv());
		if (hazard.disable) {
			const disableStack = [`<p class="pf2-stat pf2-stat__section"><strong>Disable&nbsp;</strong>`];
			renderer.recursiveRender(hazard.disable.entries, disableStack);
			disableStack.push(`</p>`);
			renderStack.push(disableStack.join(""));
		}
		if (hazard.defenses) {
			const def = hazard.defenses
			const defensesStack = [`<p class="pf2-stat pf2-stat__section">`];
			const sectionAcSt = []
			const sectionTwo = []
			if (def.ac) {
				sectionAcSt.push(Object.keys(def.ac)
					.map(k => `<strong>${k === "default" ? "" : `${k} `}AC&nbsp;</strong>${def.ac[k]}`).join(", "));
			}
			if (def.savingThrows) {
				sectionAcSt.push(Object.keys(def.savingThrows).filter(k => def.savingThrows[k] != null)
					.map(k => `<strong>${k.uppercaseFirst()}&nbsp;</strong>{@d20 ${def.savingThrows[k]}||${Parser.savingThrowAbvToFull(k)}}`).join(", "));
			}
			defensesStack.push(renderer.render(sectionAcSt.join("; ")))
			if (sectionAcSt.length) defensesStack.push(`</p><p class="pf2-stat pf2-stat__section">`);
			if (def.hardness != null && def.hp != null) {
				// FIXME: KILL ME
				sectionTwo.push(Object.keys(def.hardness).map(k => `<strong>${k === "default" ? "" : `${k} `}Hardness&nbsp;</strong>${def.hardness[k]}${def.hp[k] != null ? `, <strong>${k === "default" ? "" : `${k} `}HP&nbsp;</strong>${def.hp[k]}${def.bt && def.bt[k] != null ? ` (BT ${def.bt[k]})` : ""}${def.notes && def.notes[k] != null ? ` ${renderer.render(def.notes[k])}` : ""}` : ""}`).join("; "));
			} else if (def.hp != null) {
				sectionTwo.push(Object.keys(def.hp)
					.map(k => `<strong>${k === "default" ? "" : `${k} `}HP&nbsp;</strong>${def.hp[k]}${def.bt && def.bt[k] != null ? `, (BT ${def.bt[k]})` : ""}`).join("; "));
			} else if (def.hp == null && def.hardness != null) {
				throw new Error("What? Hardness but no HP?") // TODO: ...Maybe?
			} else {
				sectionTwo.push("")
			}
			if (def.immunities) sectionTwo.push(`<strong>Immunities&nbsp;</strong>${def.immunities.join(", ")}`);
			if (def.weaknesses) sectionTwo.push(`<strong>Weaknesses&nbsp;</strong>${def.weaknesses.join(", ")}`);
			if (def.resistances) sectionTwo.push(`<strong>Resistances&nbsp;</strong>${def.resistances.join(", ")}`);
			defensesStack.push(renderer.render(sectionTwo.join("; ")))
			defensesStack.push(`</p>`);
			renderStack.push(defensesStack.join(""));
		}
		if (hazard.actions) {
			hazard.actions.forEach(a => {
				if (a.type === "attack") {
					let textStack = []
					renderer._renderAttack(a, textStack)
					renderStack.push(textStack)
				} else renderStack.push(Renderer.creature.getRenderedAbility(a, { noButton: true, asHTML: true }))
			});
		}
		if (hazard.routine) {
			renderStack.push(Renderer.utils.getDividerDiv());
			hazard.routine.forEach((entry, idx) => {
				if (idx !== 0) {
					if (typeof entry === "object") renderer.recursiveRender(entry, renderStack);
					else renderer.recursiveRender(entry, renderStack, { prefix: `<p class="pf2-stat pf2-stat__text--wide">`, suffix: "</p>" });
				} else renderStack.push(`<p class="pf2-stat pf2-stat__text--wide"><strong>Routine&nbsp;</strong>${renderer.render(entry)}</p>`);
			});
		}
		if (hazard.reset) {
			renderStack.push(Renderer.utils.getDividerDiv());
			renderStack.push(`<p class="pf2-stat pf2-stat__section--wide"><strong>Reset&nbsp;</strong>`);
			renderer.recursiveRender(hazard.reset, renderStack);
			renderStack.push(`</p>`);
		}
		if (!opts.noPage) renderStack.push(Renderer.utils.getPageP(hazard))
		return renderStack.join("")
	},
};

Renderer.item = {
	getRenderedString (item, opts) {
		opts = opts || {};
		const renderStack = [""]
		Renderer.get().recursiveRender(item.entries, renderStack, { pf2StatFix: true })
		return `${Renderer.utils.getExcludedDiv(item, "item", UrlUtil.PG_ITEMS)}
			${Renderer.utils.getNameDiv(item, { page: UrlUtil.PG_ITEMS, ...opts })}
			${Renderer.utils.getDividerDiv()}
			${Renderer.utils.getTraitsDiv(item.traits)}
			${Renderer.item.getSubHead(item)}
			${renderStack.join("")}
			${Renderer.item.getVariantsHtml(item)}
			${item.craftReq || item.special || item.destruction ? Renderer.utils.getDividerDiv() : ""}
			${Renderer.generic.getSpecial(item, { type: "craftReq", title: "Craft Requirements"})}
			${Renderer.generic.getSpecial(item, { type: "Destruction"})}
			${Renderer.generic.getSpecial(item)}
			${Renderer.item.getGenericItem(item)}
			${Renderer.utils.getPageP(item)}`;
	},

	getSubHead (item) {
		const renderStack = [];
		const renderer = Renderer.get();
		if (item.siegeWeaponData && Object.keys(item.siegeWeaponData).length) return Renderer.item.getSiegeStats(item);

		if (item.access) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Access&nbsp;</strong>${renderer.render(item.access)}</p>`);
		if (item.price) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Price&nbsp;</strong>${Parser.priceToFull(item.price)}</p>`);
		// This ammunition is for ammunition items and should not be confused with the ammunition data of ranged weapons
		if (item.ammunition) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Ammunition&nbsp;</strong>${renderer.render(Array.isArray(item.ammunition) ? item.ammunition.map(t => `{@item ${t}}`).join(", ") : `{@item ${item.ammunition}}`)}</p>`);
		if (item.contract != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`);
			if (item.contract.devil != null) renderStack.push(`<strong>Devil&nbsp;</strong>${renderer.render(item.contract.devil)}`);
			if (item.contract.devil != null && item.contract.decipher != null) renderStack.push("; ");
			if (item.contract.decipher != null) renderStack.push(`<strong>${renderer.render(`{@action Decipher Writing}`)}&nbsp;</strong>${renderer.render(item.contract.decipher.map(d => `{@skill ${d}}`).join(", "))}`);
			renderStack.push(`</p>`);
		}

		if (item.usage != null || item.bulk != null) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`);
			if (item.usage != null) renderStack.push(`<strong>Usage&nbsp;</strong>${renderer.render(item.usage)}`);
			if (item.usage != null && item.bulk != null) renderStack.push("; ");
			if (item.bulk != null) renderStack.push(`<strong>Bulk&nbsp;</strong>${item.bulk}`);
			renderStack.push(`</p>`);
		}
		if (item.duration) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Duration&nbsp;</strong>${renderer.render(item.duration.entry)}</p>`);
		if (item.activate) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Activate&nbsp;</strong>`);
			if (item.activate.activity != null) {
				renderStack.push(`${renderer.render(Parser.timeToFullEntry(item.activate.activity))} `);
			}
			if (item.activate.components != null) {
				renderStack.push(`${renderer.render(item.activate.components)}`);
			}
			if (item.activate.frequency != null) {
				renderStack.push(`; <strong>Frequency&nbsp;</strong>${renderer.render(Parser.freqToFullEntry(item.activate.frequency))}`);
			}
			if (item.activate.trigger != null) {
				renderStack.push(`; <strong>Trigger&nbsp;</strong>${renderer.render(item.activate.trigger)}`);
			}
			if (item.activate.requirements != null) {
				renderStack.push(`; <strong>Requirements&nbsp;</strong>${renderer.render(item.activate.requirements)}`);
			}
			renderStack.push(`</p>`);
		}
		if (item.onset) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Onset&nbsp;</strong>${item.onset}</p>`);
		}

		renderStack.push(Renderer.item.getShieldStats(item));
		renderStack.push(Renderer.item.getArmorStats(item));
		renderStack.push(Renderer.item.getWeaponStats(item));
		if (item.hands) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Hands&nbsp;</strong>${item.hands}</p>`)

		// General Item Line
		const group = item.weaponData && !item.comboWeaponData ? item.weaponData.group : item.armorData ? item.armorData.group : item.group;
		if (item.category || group) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`);
			if (item.category) {
				renderStack.push(`<strong>Category&nbsp;</strong>`);
				if (item.subCategory != null) renderStack.push(`${item.subCategory} `);
				if (item.category === "Weapon") renderStack.push(`${item.weaponData ? item.weaponData.range ? "Ranged " : "Melee " : ""}`);
				renderStack.push(`${Array.isArray(item.category) ? item.category.join(", ") : item.category}${item.category === "Worn" ? `&nbsp;${item.type}` : ""}`);
			}
			if (item.category != null && group != null) renderStack.push("; ");
			if (group != null) renderStack.push(`<strong>Group&nbsp;</strong>${renderer.render(`{@group ${group}}`)}`);
			renderStack.push(`</p>`);
		}

		if (renderStack.length !== 0) renderStack.push(Renderer.utils.getDividerDiv())

		// Intelligent Items
		if (item.perception) {
			let senses;
			if (item.perception.senses) {
				senses = (item.perception.senses.precise || []).map(s => `precise ${s}`)
					.concat((item.perception.senses.imprecise || []).map(s => `imprecise ${s}`))
					.concat((item.perception.senses.vague || []).map(s => `vague ${s}`))
					.join(", ");
			}
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>${renderer.render(`{@skill Perception}`)}&nbsp;</strong>${renderer.render(`{@d20 ${item.perception.default}||Perception}`)}${senses ? `; ${senses}` : ""}</p>`);
		}
		if (item.communication) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Communication&nbsp;</strong>${item.communication.map(c => `${c.name}${c.notes ? ` (${renderer.render(c.notes)})` : ""}`).join("; ")}</p>`)
		}
		if (item.skills) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Skills&nbsp;</strong>`);
			const skills = [];
			Object.keys(item.skills).forEach(skill => {
				skills.push(`${skill.includes("Lore") ? `${renderer.render(`{@skill Lore||${skill}}`)}` : `${renderer.render(`{@skill ${skill}}`)}`}&nbsp;${renderer.render(`{@d20 ${item.skills[skill]["default"]}||${skill}}`)}${Renderer.utils.getNotes(item.skills[skill], { exclude: ["default"], dice: { name: skill } })}`);
			});
			renderStack.push(skills.join(", "))
			renderStack.push(`</p>`);
		}
		if (item.abilityMods) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`);
			renderStack.push(`<strong>Int&nbsp;</strong>`);
			renderStack.push(renderer.render(`{@d20 ${item.abilityMods.Int}||Intelligence}`));
			renderStack.push(`, <strong>Wis&nbsp;</strong>`);
			renderStack.push(renderer.render(`{@d20 ${item.abilityMods.Wis}||Wisdom}`));
			renderStack.push(`, <strong>Cha&nbsp;</strong>`);
			renderStack.push(renderer.render(`{@d20 ${item.abilityMods.Cha}||Charisma}`));
			renderStack.push(`</p>`);
		}
		if (item.savingThrows) {
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`);
			if (item.savingThrows.Will) {
				renderStack.push(`<strong>Will&nbsp;</strong>`)
				renderStack.push(Renderer.get().render(`{@d20 ${item.savingThrows.Will.default}||Will Save}`))
				renderStack.push(Renderer.utils.getNotes(item.savingThrows.Will, { exclude: ["default", "abilities"], dice: { name: "Will Save" } }));
			}
			renderStack.push(`</p>`);
		}
		if (item.perception || item.communication || item.skills || item.abilityMods || item.savingThrows) renderStack.push(Renderer.utils.getDividerDiv());
		return renderStack.join("");
	},

	getShieldStats (item) {
		if (item.shieldData && Object.keys(item.shieldData).length) {
			const shieldData = item.shieldData;
			// FIXME: Rework this to be more in line with creature AC
			return `<p class="pf2-stat pf2-stat__section">
					<strong>AC Bonus&nbsp;</strong>${Parser.numToBonus(shieldData.ac)}${shieldData.ac2 ? `/${Parser.numToBonus(shieldData.ac2)}` : ""};
					${shieldData.dexCap ? `<strong>Dex Cap&nbsp;</strong>${Parser.numToBonus(shieldData.dexCap)};` : ""}
					<strong>Hardness&nbsp;</strong>${shieldData.hardness};
					<strong>HP&nbsp;</strong>${shieldData.hp};
					<strong>BT&nbsp;</strong>${shieldData.bt}
					</p>
					${shieldData.speedPen != null ? `<p class="pf2-stat pf2-stat__section"><strong>Speed Penalty&nbsp;</strong>${shieldData.speedPen ? `–${shieldData.speedPen} ft.` : "\u2014"}</p>` : ""}`;
		} else return "";
	},

	getSiegeStats (item) {
		const renderStack = [];
		const renderer = Renderer.get();
		const siegeData = item.siegeWeaponData;
		if (item.price || siegeData.ammunition) {
			const miniStack = [];
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`)
			if (item.price) miniStack.push(`<strong>Price&nbsp;</strong>${Parser.priceToFull(item.price)}`);
			if (siegeData.ammunition) miniStack.push(`<strong>Ammunition&nbsp;</strong>${siegeData.ammunition}`);
			renderStack.push(miniStack.join("; "));
			renderStack.push(`</p>`);
			renderStack.push(Renderer.utils.getDividerDiv());
		}
		if (item.usage || item.bulk || siegeData.space || siegeData.crew || item.subCategory) {
			let miniStack = [];
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`)
			if (item.usage) miniStack.push(`<strong>Usage&nbsp;</strong>${item.usage}`);
			if (item.bulk) miniStack.push(`<strong>Bulk&nbsp;</strong>${item.bulk}`);
			if (siegeData.space) miniStack.push(`<strong>Space&nbsp;</strong>${Object.entries(siegeData.space).map(([k, v]) => `${v.number} ${v.unit} ${k}`).join(", ")}`);
			renderStack.push(miniStack.join("; "));
			renderStack.push(`</p>`);

			miniStack = [];
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`)
			if (siegeData.crew) miniStack.push(`<strong>Crew&nbsp;</strong>${siegeData.crew.min}${siegeData.crew.max ? ` to ${siegeData.crew.max}` : ""}`);
			if (item.subCategory) miniStack.push(`<strong>Proficiency&nbsp;</strong>${siegeData.proficiency.toLowerCase()}`);
			renderStack.push(miniStack.join("; "));
			renderStack.push(`</p>`);
			renderStack.push(Renderer.utils.getDividerDiv());
		}
		if (siegeData.defenses) {
			renderStack.push(Renderer.vehicle.getDefenses(siegeData))
			renderStack.push(Renderer.utils.getDividerDiv());
		}
		if (siegeData.speed) {
			renderStack.push(`<strong>Speed&nbsp;</strong>${siegeData.speed.speed} feet${siegeData.speed.note ? ` (${siegeData.speed.note})` : ""}`)
			renderStack.push(Renderer.utils.getDividerDiv());
		}
		return renderer.render(renderStack.join(""));
	},

	getArmorStats (item) {
		if (item.armorData && Object.keys(item.armorData).length) {
			const armorData = item.armorData;

			return `<p class="pf2-stat pf2-stat__section">
			<strong>AC Bonus&nbsp;</strong>${Parser.numToBonus(armorData.ac)};
			<strong>Dex Cap&nbsp;</strong>${Parser.numToBonus(armorData.dexCap)}
			</p><p class="pf2-stat pf2-stat__section">
			<strong>Strength&nbsp;</strong>${armorData.str ? `${armorData.str}` : "\u2014"};
			<strong>Check Penalty&nbsp;</strong>${armorData.checkPen ? `–${armorData.checkPen}` : "\u2014"};
			<strong>Speed Penalty&nbsp;</strong>${armorData.speedPen ? `–${armorData.speedPen} ft.` : "\u2014"}
			</p>`;
		} else return "";
	},

	getWeaponStats (item) {
		const weaponData = item.weaponData;
		const comboWeaponData = item.comboWeaponData;
		if (weaponData && Object.keys(weaponData).length && comboWeaponData && Object.keys(comboWeaponData).length) {
			const opts = { doRenderGroup: true };
			return `<div class="pf2-combo">
				<div class="pf2-combo__start"><p class="pf2-combo__title">${weaponData.type}</p>${Renderer.item._getRenderedWeaponStats(weaponData, opts)}</div>
				<div class="pf2-combo__end"><p class="pf2-combo__title">${comboWeaponData.type}</p>${Renderer.item._getRenderedWeaponStats(comboWeaponData, opts)}</div>
			</div>`
		} else if (weaponData && Object.keys(weaponData).length) {
			return Renderer.item._getRenderedWeaponStats(weaponData);
		} else return "";
	},

	_getRenderedWeaponStats (data, opts) {
		opts = opts || {};
		const renderer = Renderer.get();
		const rangedEntries = [];
		if (data.ammunition) rangedEntries.push(`<strong>Ammunition&nbsp;</strong>${renderer.render(`{@item ${data.ammunition}}`)}`);
		if (data.range) rangedEntries.push(`<strong>Range&nbsp;</strong>${renderer.render(`${data.range} ft.`)}`);
		if (data.reload || data.reload === 0) rangedEntries.push(`<strong>Reload&nbsp;</strong>${renderer.render(`${data.reload}`)}`);

		const rangedLine = rangedEntries.join("; ");
		return `
		${data.traits && data.traits.length ? `<p class="pf2-stat pf2-stat__section"><strong>Traits&nbsp;</strong>${data.traits.map(t => renderer.render(`{@trait ${t.toLowerCase()}}`)).join(", ")}</p>` : ""}
		<p class="pf2-stat pf2-stat__section"><strong>Damage&nbsp;</strong>${renderer.render(`{@damage ${data.damage}}&nbsp;${Parser.dmgTypeToFull(data.damageType)}${data.damage2 ? ` and {@damage ${data.damage2}}&nbsp;${data.damageType2 ? Parser.dmgTypeToFull(data.damageType2) : Parser.dmgTypeToFull(data.damageType)}` : ""}`)}</p>
		${rangedLine ? `<p class="pf2-stat pf2-stat__section">${rangedLine}</p>` : ""}
		${opts.doRenderGroup ? `<p class="pf2-stat pf2-stat__section"><strong>Group&nbsp;</strong>${renderer.render(`{@group ${data.group}}`)}</p>` : ""}
		`;
	},

	getVariantsHtml (item) {
		if (!item.generic || !item.variants || !item.variants.length) return "";
		const renderStack = [];
		const renderer = Renderer.get()
		item.variants.forEach((v) => {
			renderStack.push(Renderer.utils.getDividerDiv());
			// FIXME: Optimize this hellish mess
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Type&nbsp;</strong>${renderer.render(`{@item ${v.variantType.toLowerCase().includes(item.name.toLowerCase()) ? `${v.variantType}` : `${v.name ? v.name : `${v.variantType} ${item.name}`}`}|${v.source ? v.source : item.source}|${v.variantType}}`)}`);
			if (v.level != null) renderStack.push(`; <strong>Level&nbsp;</strong>${v.level}`);
			if (v.traits != null && v.traits.length) renderStack.push(` (${renderer.render(v.traits.map(t => `{@trait ${t.toLowerCase()}}`).join(", "))})`);
			if (v.price != null) renderStack.push(`; <strong>Price&nbsp;</strong>${Parser.priceToFull(v.price)}`);
			if (v.bulk != null) renderStack.push(`; <strong>Bulk&nbsp;</strong>${v.bulk}`);
			if (v.craftReq != null) renderStack.push(`; <strong>Craft Requirements&nbsp;</strong>${renderer.render(v.craftReq)}`);
			renderStack.push(`</p>`);
			if (v.entries != null && v.entries.length) {
				renderer.recursiveRender(v.entries, renderStack, { prefix: "<p class='pf2-stat pf2-stat__section--wide'>", suffix: "</p>" });
			}
			if (v.shieldData != null) renderStack.push(`<p class='pf2-stat pf2-stat__section--wide'>The shield has Hardness ${v.shieldData.hardness}, HP ${v.shieldData.hp}, and BT ${v.shieldData.bt}.</p>`);
		});
		return renderStack.join("")
	},

	getGenericItem: (item) => {
		if (item.genericItem != null) {
			return `<span class="pf2-stat pf2-stat__source" style="float: left">
				${Renderer.get().render(`{@note Main Item: ${`{@item ${item.genericItem}}`}}`)}
			</span>`
		} else return ""
	},

	_builtLists: {},

	_lockBuildList: null,
	async _pLockBuildList () {
		while (Renderer.item._lockBuildList) await Renderer.item._lockBuildList.lock;
		let unlock = null;
		const lock = new Promise(resolve => unlock = resolve);
		Renderer.item._lockBuildList = {
			lock,
			unlock,
		}
	},

	_unlockBuildList () {
		const lockMeta = Renderer.item._lockBuildList;
		if (Renderer.item._lockBuildList) {
			delete Renderer.item._lockBuildList;
			lockMeta.unlock();
		}
	},

	/**
	 * Runs callback with itemList as argument
	 * @param [opts] Options object.
	 * @param [opts.fnCallback] Run with args: allItems.
	 * @param [opts.urls] Overrides for default URLs.
	 * @param [opts.isAddGroups] Whether item groups should be included.
	 * @param [opts.isBlacklistVariants] Whether the blacklist should be respected when applying magic variants.
	 */
	async pBuildList (opts) {
		await Renderer.item._pLockBuildList();

		opts = opts || {};
		opts.urls = opts.urls || {};

		const kBlacklist = opts.isBlacklistVariants ? "withBlacklist" : "withoutBlacklist";
		if (Renderer.item._builtLists[kBlacklist]) {
			const cached = Renderer.item._builtLists[kBlacklist];

			Renderer.item._unlockBuildList();
			if (opts.fnCallback) return opts.fnCallback(cached);
			return cached;
		}

		const itemData = await DataUtil.item.loadJSON();
		const baseItems = itemData.baseitem;
		const allItems = [...itemData.item, ...baseItems];
		Renderer.item._builtLists[kBlacklist] = allItems;

		Renderer.item._unlockBuildList();
		if (opts.fnCallback) return opts.fnCallback(allItems);
		return allItems;
	},

	async getItemsFromHomebrew (homebrew) {
		const items = [...(homebrew.baseitem || []), ...(homebrew.item || [])];
		const expanded = await Promise.all(items.map(it => DataUtil.item.expandVariants(it)));
		return expanded.flat();
	},

	pGetFluff (item) {
		return Renderer.utils.pGetFluff({
			entity: item,
			fluffProp: "itemFluff",
			fluffBaseUrl: `data/items/`,
		});
	},

	getRenderedFluff (item) {
		const textStack = [""];
		const renderer = Renderer.get().setFirstSection(true)
		if (item.entries) item.entries.forEach(l => renderer.recursiveRender(l, textStack));
		return textStack.join("");
	},
};

Renderer.language = {
	getRenderedString (it, opts) {
		opts = opts || {};
		const textStack = [""];
		const renderer = Renderer.get().setFirstSection(true);
		const allEntries = [];
		if (it.entries) allEntries.push(...it.entries);
		if (!allEntries.length) allEntries.push("{@i No entries available.}");
		renderer.recursiveRender(allEntries, textStack, { pf2StatFix: true })

		return `
		${Renderer.utils.getExcludedDiv(it, "language", UrlUtil.PG_LANGUAGES)}
		${Renderer.utils.getNameDiv(it, { page: UrlUtil.PG_LANGUAGES, type: `${it.type ? `${it.type} ` : ""}language`, ...opts })}
		${Renderer.utils.getDividerDiv()}
		${it.typicalSpeakers ? `<p class="pf2-stat pf2-stat__section"><strong>Typical Speakers</strong> ${Renderer.get().render(it.typicalSpeakers.join(", "))}</p>` : ""}
		${it.regions ? `<p class="pf2-stat pf2-stat__section"><strong>Regions</strong> ${Renderer.get().render(it.regions.join(", "))}</p>` : ""}
		${Renderer.utils.getDividerDiv()}
		${textStack.join("")}
		${Renderer.utils.getPageP(it)}`;
	},

	pGetFluff (it) {
		return Renderer.utils.pGetFluff({
			entity: it,
			fluffProp: "languageFluff",
			fluffUrl: `data/fluff-languages.json`,
		});
	},
};

Renderer.nation = {
	getRenderedString (it, opts) {
		opts = opts | {}
		const renderer = Renderer.get()
		const renderStack = []
		renderStack.push(Renderer.utils.getExcludedDiv(it, "nation", UrlUtil.PLACES))
		renderStack.push(Renderer.utils.getNameDiv(it, { page: UrlUtil.PLACES, type: "NATION", ...opts }))
		renderStack.push(Renderer.utils.getDividerDiv())
		renderStack.push(Renderer.utils.getTraitsDiv(it.traits || []))
		renderStack.push(Renderer.nation.getSubHeadTop(it))
		renderStack.push(Renderer.nation.getSubHeadBot(it))
		renderStack.push(Renderer.nation.getResidents(it))
		renderStack.push(Renderer.utils.getPageP(it))
		return renderStack.join("");
	},
	getSubHeadTop (it) {
		const renderer = Renderer.get()
		const renderStack = []
		if (it.description) renderStack.push(`<p class="pf2-stat pf2-stat__section">${it.description}</p>`)
		if (it.nationData.government) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Government&nbsp;</strong>${it.nationData.government}</p>`)
		if (it.nationData.capital) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Capital&nbsp;</strong>${it.nationData.capital.name} (${it.nationData.capital.total.toLocaleString()})</p>`)
		if (it.nationData.population) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Population&nbsp;</strong>${renderer.renderJoinCommaOrSemi(it.nationData.population)}</p>`)
		if (it.nationData.languages) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Languages&nbsp;</strong>${renderer.renderJoinCommaOrSemi(it.nationData.languages)}</p>`)
		if (it.nationData.religions) renderStack.push(renderer.render(Renderer.nation.getReligions(it)))
		if (it.nationData.features) renderStack.push(renderer.render(Renderer.nation.getFeatures(it.nationData)))
		renderStack.push(Renderer.utils.getDividerDiv())
		return renderStack.join("")
	},
	getReligions (it) {
		const renderer = Renderer.get()
		const renderStack = []
		renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Religions&nbsp;</strong>`)
		renderStack.push(it.nationData.religions.map(r => typeof r === "object" ? `{@b ${r.type.toTitleCase()}} ${renderer.renderJoinCommaOrSemi(r.religions)}` : r).join(", "))
		renderStack.push(`</p>`)
		return renderStack.join("")
	},
	getFeatures (it) {
		const renderer = Renderer.get()
		const renderStack = []
		it.features.forEach(element => {
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`)
			renderStack.push(`<strong>${element.name}</strong> ${renderer.render(element.entries)}`)
			renderStack.push(`</p>`)
		});
		return renderStack.join("")
	},
	getSubHeadBot (it) {
		const renderer = Renderer.get()
		const renderStack = []
		const data = it.nationData
		if (data.exports) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Primary&nbsp;Exports&nbsp;</strong>${renderer.renderJoinCommaOrSemi(data.exports)}</p>`)
		if (data.imports) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Primary&nbsp;Imports&nbsp;</strong>${renderer.renderJoinCommaOrSemi(data.imports)}</p>`)
		if (data.enemies) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Enemies&nbsp;</strong>${renderer.renderJoinCommaOrSemi(data.enemies)}</p>`)
		if (data.factions) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Factions&nbsp;</strong>${renderer.renderJoinCommaOrSemi(data.factions)}</p>`)
		if (data.threats) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Threats&nbsp;</strong>${renderer.renderJoinCommaOrSemi(data.threats)}</p>`)
		if (renderStack.length !== 0) renderStack.push(Renderer.utils.getDividerDiv())
		return renderStack.join("")
	},
	getResidents (it) {
		const renderer = Renderer.get()
		const renderStack = []
		it.residents.forEach(element => {
			const residentStack = []
			renderStack.push(`<p class="pf2-stat pf2-stat__section">`)
			renderStack.push(renderer.render(`<strong>${element.name}</strong> `))
			if (element.alignment || element.gender || element.ancestry || element.position) {
				renderStack.push(`(`)
				if (element.alignment) residentStack.push(`{@trait ${element.alignment}}`)
				if (element.gender) residentStack.push(Parser.genderToFull(element.gender))
				if (element.ancestry) residentStack.push(element.ancestry)
				if (element.position) residentStack.push(element.position)
				if (element.level) residentStack.push(element.level)
				renderStack.push(residentStack.join(" "))
				renderStack.push(`) `)
			}
			if (element.bond) renderStack.push(element.bond)
			renderStack.push(`</p>`)
		});
		return renderer.render(renderStack.join(""))
	},
};

Renderer.optionalFeature = {
	// FIXME: Add prerequisite showing
	getListPrerequisiteLevelText (prerequisites) {
		if (!prerequisites || !prerequisites.some(it => it.level)) { return "\u2014"; }
		const levelPart = prerequisites.find(it => it.level).level;
		return levelPart.level || levelPart;
	},
	getRenderedString (it, opts) {
		opts = opts || {};
		return `
		${Renderer.utils.getNameDiv(it)}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(it.traits)}
		${it.prerequisite ? `<p class="pf2-stat pf2-stat__section">${Renderer.utils.getPrerequisiteHtml(it.prerequisite)}</p>` : ""}
		${it.traits ? Renderer.utils.getDividerDiv() : it.prerequisite ? Renderer.utils.getDividerDiv() : ""}
		${Renderer.generic.getRenderedEntries(it)}
		${opts.noPage ? "" : Renderer.utils.getPageP(it)}`;
	},
};

Renderer.organization = {
	getRenderedString (organization, opts) {
		opts = opts || {};
		return `
			${Renderer.utils.getExcludedDiv(organization, "organization", UrlUtil.PG_ORGANIZATIONS)}
			${Renderer.utils.getNameDiv(organization, { type: `${organization.alignment && organization.alignment.length === 1 ? `${organization.alignment[0]}` : ""} organization`, ...opts })}
			${Renderer.utils.getDividerDiv()}
			${Renderer.utils.getTraitsDiv(organization.traits || [])}
			${Renderer.organization.getTitleScopeGoals(organization)}
			${Renderer.utils.getDividerDiv()}
			${Renderer.organization.getDetails(organization)}
			${Renderer.utils.getDividerDiv()}
			${Renderer.organization.getMembership(organization)}
			${opts.noPage ? "" : Renderer.utils.getPageP(organization)}`;
	},

	getTitleScopeGoals (organization) {
		let out = [];
		const renderer = Renderer.get();
		if (organization.title) out.push(`<p class="pf2-stat__section"><i>${organization.title.join(", ")}</i></p>`);
		if (organization.scope) out.push(`<p class="pf2-stat__section"><strong>Scope and Influence&nbsp;</strong>${renderer.renderJoinCommaOrSemi(organization.scope)}</p>`);
		if (organization.goals) out.push(`<p class="pf2-stat__section"><strong>Goals&nbsp;</strong>${renderer.renderJoinCommaOrSemi(organization.goals)}</p>`);
		return out.join("");
	},

	getDetails (organization) {
		let out = [];
		const renderer = Renderer.get();
		if (organization.headquarters) out.push(`<p class="pf2-stat__section"><strong>Headquarters&nbsp;</strong>${renderer.renderJoinCommaOrSemi(organization.headquarters)}</p>`);
		if (organization.keyMembers) out.push(`<p class="pf2-stat__section"><strong>Key Members&nbsp;</strong>${renderer.renderJoinCommaOrSemi(organization.keyMembers)}</p>`);
		if (organization.allies) out.push(`<p class="pf2-stat__section"><strong>Allies&nbsp;</strong>${renderer.renderJoinCommaOrSemi(organization.allies)}</p>`);
		if (organization.enemies) out.push(`<p class="pf2-stat__section"><strong>Enemies&nbsp;</strong>${renderer.renderJoinCommaOrSemi(organization.enemies)}</p>`);
		if (organization.assets) out.push(`<p class="pf2-stat__section"><strong>Assets&nbsp;</strong>${renderer.renderJoinCommaOrSemi(organization.assets)}</p>`);
		return out.join("")
	},

	getMembership (organization) {
		let out = [];
		const renderer = Renderer.get();
		if (organization.requirements) out.push(`<p class="pf2-stat__section"><strong>Membership Requirements&nbsp;</strong>${renderer.renderJoinCommaOrSemi(organization.requirements)}</p>`);
		if (organization.followerAlignment) {
			out.push(`<p class="pf2-stat__section"><strong>Accepted Alignments&nbsp;</strong>${renderer.render(organization.followerAlignment.map(it => it.entry ? it.entry : `{@trait ${it.main}}${it.secondaryCustom ? ` (${it.secondaryCustom})` : it.secondary ? ` (${it.secondary.map(it => `{@trait ${it}}`).join(", ")}${it.note ? `; ${it.note}` : ""})` : ""}`).join(", "))}</p>`);
		}
		if (organization.values) out.push(`<p class="pf2-stat__section"><strong>Values&nbsp;</strong>${renderer.renderJoinCommaOrSemi(organization.values)}</p>`);
		if (organization.anathema) out.push(`<p class="pf2-stat__section"><strong>Anathema&nbsp;</strong>${renderer.renderJoinCommaOrSemi(organization.anathema)}</p>`);
		return out.join("");
	},

	getRenderedLore (organization) {
		const textStack = [""];
		const renderer = Renderer.get().setFirstSection(true);
		if (organization.lore) organization.lore.forEach(l => renderer.recursiveRender(l, textStack));
		return textStack.join("");
	},

	getImage (organization) {
		const textStack = [""];
		if (organization.images) {
			const img = organization.images[0];
			if (img.includes("2e.aonprd.com")) textStack.push(`<a target="_blank" rel="noopener noreferrer" title="Shift/Ctrl to open in a new window/tab." href="${img}">Images available on the Archives of Nethys.</a>`);
			else textStack.push(`<p><img style="display: block; margin-left: auto; margin-right: auto; width: 50%;" src="${img}" alt="No Image Found."></p>`);
		}
		return textStack.join("");
	},

	async pGetFluff (organization) {
		return Renderer.utils.pGetFluff({
			entity: organization,
			fluffUrl: `data/fluff-organizations.json`,
			fluffProp: "organizationFluff",
		});
	},
};

Renderer.creatureTemplate = {
	getRenderedString (it, opts) {
		opts = opts || {};
		return $$`
			${Renderer.utils.getExcludedDiv(it, "creatureTemplate", UrlUtil.PG_CREATURETEMPLATE)}
			${Renderer.utils.getNameDiv(it)}
			${Renderer.utils.getDividerDiv()}
			${Renderer.utils.getTraitsDiv(it.traits || [])}
			${Renderer.creatureTemplate.getBody(it)}
			${Renderer.generic.getRenderedEntries(it)}
			${it.abilities && it.abilities.entries ? Renderer.generic.getRenderedEntries(it.abilities) : ""}
			${it.abilities && it.abilities.abilities ? it.abilities.abilities.map(x => Renderer.creature.getRenderedAbility(x)) : ""}
			${it.optAbilities && it.optAbilities.entries ? Renderer.generic.getRenderedEntries(it.optAbilities) : ""}
			${it.optAbilities && it.optAbilities.abilities ? it.optAbilities.abilities.map(x => Renderer.creature.getRenderedAbility(x)) : ""}
		`
	},

	getBody (it) {
		if (!it.languages || it.languages.length === 0) return "";
		const textStack = [""];
		const renderer = Renderer.get().setFirstSection(true);
		// TODO: Insert any functional properties here to be displayed.
		textStack.push(Renderer.utils.getDividerDiv())
		return renderer.render(textStack.join(""));
	},

	getRenderedLore (creatureTemplate) {
		const textStack = [""];
		const renderer = Renderer.get().setFirstSection(true);
		if (creatureTemplate.lore) creatureTemplate.lore.forEach(l => renderer.recursiveRender(l, textStack));
		return textStack.join("");
	},

	getImage (creatureTemplate) {
		const textStack = [""];
		if (creatureTemplate.images) {
			const img = creatureTemplate.images[0];
			if (img.includes("2e.aonprd.com")) textStack.push(`<a target="_blank" rel="noopener noreferrer" title="Shift/Ctrl to open in a new window/tab." href="${img}">Images available on the Archives of Nethys.</a>`);
			else textStack.push(`<p><img style="display: block; margin-left: auto; margin-right: auto; width: 50%;" src="${img}" alt="No Image Found."></p>`);
		}
		return textStack.join("");
	},

	async pGetFluff (creatureTemplate) {
		return Renderer.utils.pGetFluff({
			entity: creatureTemplate,
			fluffUrl: `data/fluff-creaturetemplates.json`,
			fluffProp: "creatureTemplateFluff",
		});
	},
};

Renderer.place = {
	getRenderedString (it, opts) {
		if (it.category.toLowerCase() === "plane") return Renderer.plane.getRenderedString(it, opts)
		if (it.category.toLowerCase() === "settlement") return Renderer.settlement.getRenderedString(it, opts)
		if (it.category.toLowerCase() === "nation") return Renderer.nation.getRenderedString(it, opts)
	},
};

Renderer.plane = {
	getRenderedString (it, opts) {
		opts = opts | {}
		const renderer = Renderer.get()
		const renderStack = []
		renderStack.push(Renderer.utils.getExcludedDiv(it, "plane", UrlUtil.PLACES))
		renderStack.push(Renderer.utils.getNameDiv(it, { page: UrlUtil.PLACES, type: "PLANE", ...opts }))
		renderStack.push(Renderer.utils.getDividerDiv())
		renderStack.push(Renderer.utils.getTraitsDiv(it.traits || []))
		renderStack.push(Renderer.plane.getSubHead(it))
		renderer.recursiveRender(it.entries, renderStack, { pf2StatFix: true })
		renderStack.push(Renderer.utils.getPageP(it))
		return renderStack.join("");
	},
	getSubHead (it) {
		const renderer = Renderer.get()
		const renderStack = []
		renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Category&nbsp;</strong>${it.planeData.category.toTitleCase()} Plane</p>`)
		renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Divinities&nbsp;</strong>${renderer.renderJoinCommaOrSemi(it.planeData.divinities)}</p>`)
		renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Native Inhabitants&nbsp;</strong>${renderer.renderJoinCommaOrSemi(it.planeData.inhabitants)}</p>`)
		renderStack.push(Renderer.utils.getDividerDiv())
		return renderStack.join("")
	},
};

Renderer.ritual = {
	getRenderedString (ritual, opts) {
		opts = opts || {};
		const renderer = Renderer.get();
		const renderStack = [];
		renderer.recursiveRender(ritual.entries, renderStack, { pf2StatFix: true });

		return renderer.render(`${Renderer.utils.getExcludedDiv(ritual, "ritual", UrlUtil.PG_RITUALS)}
		${Renderer.utils.getNameDiv(ritual, { page: UrlUtil.PG_RITUALS, type: ritual.type || "Ritual", ...opts })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(ritual.traits)}
		<p class="pf2-stat pf2-stat__section">
		${[`<strong>Cast&nbsp;</strong>${renderer.render(Parser.timeToFullEntry(ritual.cast))}`,
		`${ritual.cost ? `<strong>Cost&nbsp;</strong>${renderer.render(ritual.cost)}` : ""}`,
		`${ritual.secondaryCasters ? `<strong>Secondary Casters&nbsp;</strong>${ritual.secondaryCasters.entry ? ritual.secondaryCasters.entry : ritual.secondaryCasters.number}${ritual.secondaryCasters.note ? `, ${ritual.secondaryCasters.note}` : ""}` : ""}`].filter(Boolean).join("; ")}
		</p>
		<p class="pf2-stat pf2-stat__section">
		${[`<strong>Primary&nbsp;Check&nbsp;</strong>${ritual.primaryCheck.entry ? renderer.render(ritual.primaryCheck.entry) : `${ritual.primaryCheck.skills.map(s => `{@skill ${s}}`).joinConjunct(", ", " or ")} (${ritual.primaryCheck.prof}${ritual.primaryCheck.mustBe ? `; you must be a ${ritual.primaryCheck.mustBe.joinConjunct(", ", " or ")}` : ""})`}`,
		`${ritual.secondaryCheck ? `<strong>Secondary&nbsp;Checks&nbsp;</strong>${ritual.secondaryCheck.entry ? renderer.render(ritual.secondaryCheck.entry) : `${ritual.secondaryCheck.skills.map(s => `{@skill ${s}}`).joinConjunct(", ", " or ")} ${ritual.secondaryCheck.prof ? `(${ritual.secondaryCheck.prof})` : ""}`}` : ""}`].filter(Boolean).join("; ")}
		</p>
		${ritual.area || ritual.targets || ritual.range
		? `<p class="pf2-stat pf2-stat__section">${[`${ritual.range && ritual.range.entry ? `<strong>Range&nbsp;</strong>${renderer.render(ritual.range.entry)}` : ""}`,
			`${ritual.area ? `<strong>Area&nbsp;</strong>${renderer.render(ritual.area.entry)}` : ""}`,
			`${ritual.targets ? `<strong>Targets&nbsp;</strong>${renderer.render(ritual.targets)}` : ""}`].filter(Boolean).join("; ")}</p>` : ""}
			${ritual.duration && ritual.duration.type ? `<p class="pf2-stat pf2-stat__section"><strong>Duration&nbsp;</strong>${renderer.render(ritual.duration.entry)}</p>` : ""}
		${ritual.requirements ? `<p class="pf2-stat pf2-stat__section"> <strong>Requirements</strong> ${renderer.render(ritual.requirements)} </p>` : ""}
		${Renderer.utils.getDividerDiv()}
		${renderStack.join("")}
		${ritual.heightened ? `${Renderer.utils.getDividerDiv()}${Renderer.spell.getHeightenedEntry(ritual)}` : ""}
		${opts.noPage ? "" : Renderer.utils.getPageP(ritual)}`);
	},
};

Renderer.rule = {
	getRenderedString (rule) {
		return `
			<tr><td colspan="6">
			${Renderer.get().setFirstSection(true).render(rule)}
			</td></tr>
		`;
	},
};

Renderer.runeItem = {
	getRuneShortName (rune) {
		if (rune.shortName) return rune.shortName;
		let name = typeof rune === "string" ? rune : rune.name;
		if (name.startsWith("+")) return name.split(" ")[0];
		return name.toTitleCase();
	},

	getTag (baseItem, runes) {
		return [baseItem].map(it => [it.name, it.source]).concat(runes.map(it => [it.name, it.source])).flat().join("|")
	},

	getHashesFromTag (tag) {
		const split = tag.split("|").map(it => it.trim()).map(it => it === "" ? SRC_CRB : it);
		if (split.length % 2) {
			split.pop();
		}
		const out = [];
		while (split.length) { out.push(split.splice(0, 2)) }
		return out.map(it => UrlUtil.encodeForHash(it));
	},

	getRuneItem (baseItem, runes) {
		let runeItem = MiscUtil.copy(baseItem);
		runeItem.name = [...runes.map(r => Renderer.runeItem.getRuneShortName(r)), runeItem.name].join(" ");
		runeItem.type = "item";
		runeItem.level = Math.max(...runes.map(r => r.level));
		runeItem.traits = [...new Set([baseItem.traits || [], ...runes.map(it => it.traits || [])].flat())].sort(SortUtil.sortTraits);
		const value = [baseItem, ...runes].map(it => Parser.priceToValue(it.price)).reduce((a, b) => a + b, 0);
		runeItem.price = { coin: "gp", amount: Math.floor(value / 100) };
		runeItem.entries = [runeItem.entries, ...runes.map(r => r.entries.map((e, idx) => idx === 0 ? `{@bold ${r.name}} ${e}` : e))].flat();
		runeItem.runeItem = true;
		delete runeItem.equipment;
		return runeItem;
	},
};

Renderer.settlement = {
	getRenderedString (it, opts) {
		const renderer = Renderer.get().setFirstSection(true);
		const renderStack = [];
		renderer.recursiveRender(it.entries, renderStack, { pf2StatFix: true });

		renderStack.push(Renderer.utils.getExcludedDiv(it, "settlement", UrlUtil.PG_SETTLEMENTS))
		renderStack.push(Renderer.utils.getNameDiv(it, { page: UrlUtil.PG_SETTLEMENTS, type: "SETTLEMENT", ...opts }))
		renderStack.push(Renderer.utils.getDividerDiv())
		renderStack.push(Renderer.utils.getTraitsDiv(it.traits || []))
		renderStack.push(Renderer.settlement.getSubHeadTop(it))
		renderStack.push(Renderer.settlement.getSubHeadBot(it))
		renderStack.push(Renderer.nation.getResidents(it))
		renderStack.push(Renderer.utils.getPageP(it))
		return renderStack.join("")
	},
	getSubHeadTop (it) {
		const renderer = Renderer.get()
		const renderStack = []
		if (it.description) renderStack.push(`<p class="pf2-stat pf2-stat__section">${it.description}</p>`)
		if (it.settlementData.government) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Government&nbsp;</strong>${it.settlementData.government}</p>`)
		if (it.settlementData.population) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Population&nbsp;</strong>${Renderer.settlement.getPopulation(it.settlementData.population)}</p>`)
		if (it.settlementData.languages) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Languages&nbsp;</strong>${renderer.renderJoinCommaOrSemi(it.settlementData.languages)}</p>`)
		renderStack.push(Renderer.utils.getDividerDiv())
		return renderStack.join("")
	},
	getSubHeadBot (it) {
		const renderer = Renderer.get()
		const renderStack = []
		if (it.settlementData.religions) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Religions&nbsp;</strong>${renderer.renderJoinCommaOrSemi(it.settlementData.religions)}</p>`)
		if (it.settlementData.threats) renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Threats&nbsp;</strong>${renderer.renderJoinCommaOrSemi(it.settlementData.threats)}</p>`)
		if (it.settlementData.features) renderStack.push(renderer.render(Renderer.nation.getFeatures(it.settlementData)))
		renderStack.push(Renderer.utils.getDividerDiv())
		return renderStack.join("")
	},
	getPopulation (it) {
		const renderer = Renderer.get()
		const renderStack = []
		const textStack = []
		renderStack.push(`${it.total.toLocaleString()}`)
		if (it.ancestries) {
			renderStack.push(` (`)
			for (const [key, value] of Object.entries(it.ancestries)) {
				textStack.push(renderer.render(`{@dice ${it.total}*${(value) / 100}|${value}%} ${key}`))
			}
			renderStack.push(textStack.join(", "))
			renderStack.push(`)`)
		}
		return renderStack.join("")
	},
};

Renderer.skill = {
	getRenderedString (it) {
		const fakeEntry = {
			type: "pf2-h3",
			name: it.name,
			entries: it.entries,
		};
		return `${Renderer.get().setFirstSection(true).render(fakeEntry)}`;
	},
};

Renderer.spell = {
	getRenderedString (sp, opts) {
		opts = opts || {};
		const renderer = Renderer.get().setFirstSection(false);
		const entryStack = [];
		renderer.recursiveRender(sp.entries, entryStack, { pf2StatFix: true });

		const level = ` ${sp.level}`;
		const type = sp.traits.includes("cantrip") ? "CANTRIP" : sp.focus ? "FOCUS" : "SPELL";

		return `${Renderer.utils.getExcludedDiv(sp, "spell", UrlUtil.PG_SPELLS)}
		${Renderer.utils.getNameDiv(sp, { page: UrlUtil.PG_SPELLS, type: type, level: level, ...opts })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(sp.traits)}
		${Renderer.spell.getSubHead(sp)}
		${entryStack.join("")}
		${sp.heightened ? `${Renderer.utils.getDividerDiv()}${Renderer.spell.getHeightenedEntry(sp)}` : ""}
		${opts.noPage ? "" : Renderer.utils.getPageP(sp)}`;
	},

	getSubHead (sp) {
		const renderer = Renderer.get()

		const componentsRender = sp.components && sp.components.length === 1 ? sp.components[0].map(it => Parser.COMPONENTS_TO_FULL[it]).join(", ") : "";

		let castPart = ``;
		if (sp.cost != null) castPart += `; <strong>Cost&nbsp;</strong>${renderer.render(sp.cost)}`;
		if (sp.trigger != null) castPart += `; <strong>Trigger&nbsp;</strong>${renderer.render(sp.trigger)}`;
		if (sp.requirements != null) castPart += `; <strong>Requirements&nbsp;</strong>${renderer.render(sp.requirements)}`;

		const targetingParts = [];
		if (sp.range) targetingParts.push(`<strong>Range&nbsp;</strong>${renderer.render(Parser.rangeToFull(sp.range))}`);
		if (sp.area != null) targetingParts.push(`<strong>Area&nbsp;</strong>${renderer.render(sp.area.entry)}`);
		if (sp.targets != null) targetingParts.push(`<strong>Targets&nbsp;</strong>${renderer.render(sp.targets)}`);

		const stDurationParts = [];
		if (sp.savingThrow != null && sp.savingThrow.hidden !== true) stDurationParts.push(`<strong>Saving Throw&nbsp;</strong>${sp.savingThrow.basic ? "basic " : ""}${sp.savingThrow.type.map(t => Parser.savingThrowAbvToFull(t)).join(" or ")}`);
		if (sp.duration && sp.duration.type != null) stDurationParts.push(`<strong>Duration&nbsp;</strong>${renderer.render(sp.duration.entry)}`);

		return `${sp.traditions ? `<p class="pf2-stat pf2-stat__section"><strong>Traditions </strong>${renderer.render(sp.traditions.map(it => `{@trait ${it}}`).join(", ").toLowerCase())}</p>` : ""}
		${sp.domains ? `<p class="pf2-stat pf2-stat__section"><strong>Domain${sp.domains.length > 1 ? "s" : ""}</strong> ${renderer.render(sp.domains.map(it => `{@filter ${it}|deities||domain=${it}}`).join(", "))}` : ""}
		${sp.subclass ? Object.keys(sp.subclass).map(k => `<p class="pf2-stat pf2-stat__section"><strong>${k.split("|")[1]}</strong> ${renderer.render(k.split("|")[1].toLowerCase() === "mystery" ? sp.subclass[k].map(it => `{@class Oracle|APG|${it}|${it}}`).join(", ") : sp.subclass[k].join(", ").toLowerCase())}</p>`) : ""}
		<p class="pf2-stat pf2-stat__section"><strong>Cast </strong>${renderer.render(Parser.timeToFullEntry(sp.cast))} ${!Parser.TIME_ACTIONS.includes(sp.cast.unit) && componentsRender ? `(${componentsRender})` : componentsRender}${castPart}</p>
		${targetingParts.length ? `<p class="pf2-stat pf2-stat__section">${targetingParts.join("; ")}</p>` : ""}
		${stDurationParts.length ? `<p class="pf2-stat pf2-stat__section">${stDurationParts.join("; ")}</p>` : ""}
		${Renderer.utils.getDividerDiv()}`;
	},

	getHeightenedEntry (sp) {
		if (!sp.heightened) return "";
		const renderer = Renderer.get();
		const renderStack = [""];
		const renderArray = (a) => {
			a.forEach((e, i) => {
				if (i === 0) renderer.recursiveRender(e, renderStack, { prefix: "<span>", suffix: "</span>" });
				else renderer.recursiveRender(e, renderStack, { prefix: "<span class='pf2-stat__section'>", suffix: "</span>" });
			});
		};
		if (sp.heightened.plusX != null) {
			Object.entries(sp.heightened.plusX).forEach(([x, entries]) => {
				renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Heightened (+${x})&nbsp;</strong>`);
				renderArray(entries);
				renderStack.push(`</p>`);
			});
		}
		if (sp.heightened.X != null) {
			Object.entries(sp.heightened.X).forEach(([x, entries]) => {
				renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>Heightened (${Parser.getOrdinalForm(x)})&nbsp;</strong>`);
				renderArray(entries);
				renderStack.push(`</p>`);
			});
		}
		return renderStack.join("")
	},

	pGetFluff (sp) {
		return Renderer.utils.pGetFluff({
			entity: sp,
			fluffBaseUrl: `data/spells/`,
			fluffProp: "spellFluff",
		});
	},
};

Renderer.table = {
	getRenderedString (it) {
		it.type = it.type || "table";
		const cpy = MiscUtil.copy(it);
		delete cpy.name;
		return `
			${Renderer.utils.getExcludedDiv(it, "table", UrlUtil.PG_TABLES)}
			${Renderer.get().setFirstSection(true).render(it)}
		`;
	},
};

Renderer.trait = {
	TRAITS: {},

	getRenderedString (trait, opts) {
		opts = opts || {};
		const renderer = Renderer.get();
		const renderStack = [];
		renderer.setFirstSection(true);
		renderStack.push(`${Renderer.utils.getExcludedDiv(trait, "trait", UrlUtil.PG_TRAITS)}`)
		renderStack.push(`
			${Renderer.utils.getNameDiv(trait, { page: UrlUtil.PG_TRAITS, type: "Trait", ...opts })}
			${Renderer.utils.getDividerDiv()}
		`);
		renderer.recursiveRender(trait.entries, renderStack, { pf2StatFix: true });
		if (!opts.noPage) renderStack.push(Renderer.utils.getPageP(trait))

		return renderStack.join("");
	},

	async preloadTraits () {
		let loading = {};
		const cats = new Set([]);
		const traits = (await Promise.all([DataUtil.loadJSON(`${Renderer.get().baseUrl}data/traits.json`), BrewUtil.pAddBrewData()])).map(it => it.trait).filter(Boolean).flat();
		for (let trait of traits) {
			if (!trait.categories || !trait.categories.length) {
				trait.categories = ["General"];
			}
			trait.categories.forEach(c => cats.add(c));
			loading[trait.name.toLowerCase()] = trait;
		}
		loading._categories = Array.from(cats);
		Renderer.trait.TRAITS = loading;
	},

	isTraitInCategory (trait, category) {
		const name = Parser.getTraitName(trait).toLowerCase();
		let lookup;
		if (Renderer.trait.TRAITS) lookup = Renderer.trait.TRAITS[name];
		if (lookup) return lookup.categories.includes(category);
		return category === "General";
	},

	getTraitCategories (trait) {
		const lookup = Renderer.trait.TRAITS[trait.toLowerCase()];
		if (lookup) return lookup.categories || [];
		// else console.warn(`Could not look up the ${trait} trait.`);
		return [];
	},

	filterTraitsByCats (traits, categories) {
		return traits.filter(t => Renderer.trait.getTraitCategories(t).some(c => categories.includes(c)));
	},
};

Renderer.variantrule = {
	getRenderedString (rule) {
		const textStack = [];
		Renderer.get().setFirstSection(true).resetHeaderIndex().recursiveRender(rule.entries, textStack);
		return `
			${Renderer.utils.getExcludedDiv(rule, "variantrule", UrlUtil.PG_VARIANTRULES)}
			${textStack.join("")}
			${Renderer.utils.getPageP(rule)}
		`;
	},
};

Renderer.vehicle = {
	getRenderedString (it, opts) {
		opts = opts || {};
		const renderer = Renderer.get();
		const traits = it.traits || [];
		// FIXME: This is becoming a mess
		// <p class="pf2-stat pf2-stat__section"><strong>Crew&nbsp;</strong>${it.crew.pilot} pilot${it.crew.pilot > 1 ? "s" : ""}${it.crew.crew ? `, ${it.crew.crew} crew` : ""}${it.passengers != null ? `; <strong>Passengers&nbsp;</strong>${it.passengers}` : ""}</p>
		return $$`${Renderer.utils.getExcludedDiv(it, "vehicle", UrlUtil.PG_VEHICLES)}
		${Renderer.utils.getNameDiv(it, { type: "Vehicle", ...opts })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(traits)}
		${it.price ? `<p class="pf2-stat pf2-stat__section"><strong>Price&nbsp;</strong>${Parser.priceToFull(it.price)}</p>` : ""}
		${it.price && it.entries ? `${Renderer.utils.getDividerDiv()}` : ""}
		${it.entries ? `<p class="pf2-stat pf2-stat__section">${renderer.render(it.entries)}</p>` : ""}
		${Renderer.utils.getDividerDiv()}
		<p class="pf2-stat pf2-stat__section"><strong>Space&nbsp;</strong>${Object.entries(it.space).map(([k, v]) => `${v.number} ${v.unit} ${v.name ? v.name : k}`).join(", ")}</p>
		<p class="pf2-stat pf2-stat__section"><strong>Crew&nbsp;</strong>${it.crew.map(c => `${c.number} ${c.entry ? c.entry : c.type}`).join(", ")}${it.passengers ? `; <strong>Passengers&nbsp;</strong>${it.passengers}${it.passengersNote ? ` (${it.passengersNote})` : ""}` : ""}</p>
		<p class="pf2-stat pf2-stat__section"><strong>Piloting Check&nbsp;</strong>${it.pilotingCheck.length > 1 ? `${it.pilotingCheck.slice(0, -1).map(c => `${c.entry ? `${renderer.render(c.entry)}` : `${c.skill.includes("Lore") ? renderer.render(`{@skill Lore||${c.skill}}`) : renderer.render(`{@skill ${c.skill}}`)} (DC ${c.dc})`}`).join(", ")} or ${it.pilotingCheck.map(c => `${c.entry ? `${renderer.render(c.entry)}` : `${c.skill.includes("Lore") ? renderer.render(`{@skill Lore||${c.skill}}`) : renderer.render(`{@skill ${c.skill}}`)} (DC ${c.dc})`}`).slice(-1)}` : it.pilotingCheck.map(c => `${c.entry ? `${renderer.render(c.entry)}` : `${c.skill.includes("Lore") ? renderer.render(`{@skill Lore||${c.skill}}`) : renderer.render(`{@skill ${c.skill}}`)} (DC ${c.dc})`}`)}</p>
		${Renderer.utils.getDividerDiv()}
		${Renderer.vehicle.getDefenses(it, opts)}
		${it.abilities && it.abilities.mid ? it.abilities.mid.map(x => Renderer.creature.getRenderedAbility(x, { noButton: true })) : ""}
		${Renderer.utils.getDividerDiv()}
		<p class="pf2-stat pf2-stat__section"><strong>Speed&nbsp;</strong>${it.speed.map(s => s.type === "special" ? s.entry : `${s.type !== "walk" ? `${s.type} ` : ""}${s.speed ? `${s.speed} feet` : ""} ${s.traits ? `(${renderer.render(s.traits.map(t => `{@trait ${t.toLowerCase()}}`).join(", "))})` : ""} ${s.note ? `(${renderer.render(s.note)})` : ""}`).join(", ")}</p>
		<p class="pf2-stat pf2-stat__section"><strong>Collision&nbsp;</strong>${it.collision.entries ? it.collision.entries : `${it.collision.damage ? renderer.render(it.collision.damage) : ""}${it.collision.type ? ` ${it.collision.type}` : ""} ${it.collision.dc ? `(DC ${it.collision.dc})` : ""}`}</p>
		${it.abilities && it.abilities.bot ? it.abilities.bot.map(x => Renderer.creature.getRenderedAbility(x, { noButton: true })) : ""}
		${it.craftReq || it.special || it.destruction ? Renderer.utils.getDividerDiv() : ""}
		${Renderer.generic.getSpecial(it, { title: "Destruction" })}
		${Renderer.generic.getSpecial(it)}
		${Renderer.utils.getPageP(it)}`;
	},
	getDefenses (it, opts) {
		const renderer = Renderer.get();
		const defensesStack = [];
		if (it.defenses) {
			const def = it.defenses;
			const sectionAcSt = [];
			const sectionTwo = [];
			defensesStack.push(`<p class="pf2-stat pf2-stat__section">`);
			if (def.ac) {
				sectionAcSt.push(Object.keys(def.ac)
					.map(k => `<strong>${k === "default" ? "" : `${k} `}AC&nbsp;</strong>${def.ac[k]}`).join(", "));
			}
			if (def.savingThrows) {
				sectionAcSt.push(Object.keys(def.savingThrows).filter(k => def.savingThrows[k] != null)
					.map(k => `<strong>${k.uppercaseFirst()}&nbsp;</strong>{@d20 ${def.savingThrows[k]}||${Parser.savingThrowAbvToFull(k)}}`).join(", "));
			}
			defensesStack.push(renderer.render(sectionAcSt.join("; ")))
			if (sectionAcSt.length) defensesStack.push(`</p><p class="pf2-stat pf2-stat__section">`);
			if (def.hardness != null && def.hp != null) {
				// FIXME: KILL ME
				sectionTwo.push(Object.keys(def.hardness).map(k => `<strong>${k === "default" ? "" : `${k} `}Hardness&nbsp;</strong>${def.hardness[k]}${def.hp[k] != null ? `, <strong>${k === "default" ? "" : `${k} `}HP&nbsp;</strong>${def.hp[k]}${def.bt && def.bt[k] != null ? ` (BT ${def.bt[k]})` : ""}${def.notes && def.notes[k] != null ? ` ${renderer.render(def.notes[k])}` : ""}` : ""}`).join("; "));
			} else if (def.hp != null) {
				sectionTwo.push(Object.keys(def.hp)
					.map(k => `<strong>${k === "default" ? "" : `${k} `}HP&nbsp;</strong>${def.hp[k]}${def.bt && def.bt[k] != null ? `, (BT ${def.bt[k]})` : ""}`).join("; "));
			} else throw new Error("What? Hardness but no HP?") // TODO: ...Maybe?
			if (def.immunities) sectionTwo.push(`<strong>Immunities&nbsp;</strong>${def.immunities.join(", ")}`);
			if (def.weaknesses) sectionTwo.push(`<strong>Weaknesses&nbsp;</strong>${def.weaknesses.map(w => w.amount ? `${w.amount} ${w.name}${w.note ? ` ${w.note}` : ""}` : `${w.name}${w.note ? ` ${w.note}` : ""}`).join(", ")}`);
			if (def.resistances) sectionTwo.push(`<strong>Resistances&nbsp;</strong>${def.resistances.map(r => r.amount ? `${r.amount} ${r.name}${r.note ? ` ${r.note}` : ""}` : `${r.name}${r.note ? ` ${r.note}` : ""}`).join(", ")}`);
			defensesStack.push(renderer.render(sectionTwo.join("; ")));
			defensesStack.push(`</p>`);
		}
		return defensesStack.join("")
	},
};

Renderer.generic = {
	getRenderedString (it) {
		return `
		${Renderer.utils.getNameDiv(it)}
		${Renderer.get().setFirstSection(true).render({ entries: it.entries })}
		${Renderer.utils.getPageP(it)}`;
	},

	dataGetRenderedString (it, options) {
		options = options || {};
		const traits = it.traits || [];
		const renderedSections = Renderer.generic.getRenderedSection(it.sections);
		return `
		${Renderer.utils.getNameDiv(it, { "isEmbedded": options.isEmbedded, "activity": `${it.activity ? Parser.timeToFullEntry(it.activity) : ""}`, "type": `${it.category ? it.category : ""} `, "level": typeof it.level !== "number" ? it.level : undefined })}
		${Renderer.utils.getDividerDiv()}
		${Renderer.utils.getTraitsDiv(traits, { doNotTagTraits: it.doNotTagTraits, doNotSortTraits: it.doNotSortTraits })}
		${Renderer.ability.getSubHead(it)}
		${renderedSections.join(Renderer.utils.getDividerDiv())}
		${options.noPage ? "" : Renderer.utils.getPageP(it)}`;
	},

	getRenderedSection (sections) {
		const renderer = Renderer.get();
		return sections.map(section => section.map(a => {
			if (a.some(e => typeof e !== "string" && e.type == null)) {
				return `<p class="pf2-stat pf2-stat__section">${a.map(o => {
					if (typeof o === "object" && o.type == null) return `<strong>${o.name} </strong>${renderer.render(o.entry)}`;
					else return `${renderer.render(o)}`;
				}).map((rd, ix) => {
					if (ix === a.length - 1) return rd;
					return renderer._addTerm(rd);
				}).join(" ")}</p>`
			} else return a.map(e => `<p class="pf2-stat pf2-stat__text">${renderer.render(e)}</p>`).join("")
		}).join(""));
	},

	getRenderedEntries (it, opts) {
		opts = opts || {};
		const renderer = Renderer.get();
		const renderStack = [];
		if (it.entries) renderer.recursiveRender(it.entries, renderStack, { pf2StatFix: true });

		return `${renderStack.join("")}
			${Renderer.generic.getSpecial(it, opts)}
			${Renderer.generic.getAddSections(it, opts)}`;
	},

	getAddSections (it) {
		if (it.addSections) return Renderer.generic.getRenderedSection(it.addSections).join(Renderer.utils.getDividerDiv());
		else return "";
	},

	/**
	 * @param it {array} Entry Itself
	 * @param [opts] {array}
	 * @param [opts.type] {string} "special", "destruction", "craftReq"
	 * @param [opts.title] {string} "Special", "Destruction", "Crafting Requirements"
	 */
	getSpecial (it, opts) {
		opts = opts || {};
		opts.title = opts.title ?? "Special";
		opts.type = opts.type ?? opts.title.toLowerCase();
		const renderer = Renderer.get();
		if (it[opts.type] != null) {
			let renderStack = []
			renderStack.push(`<p class="pf2-stat pf2-stat__section"><strong>${opts.title}&nbsp;</strong>`)

			it[opts.type].forEach((s, index) => {
				if (index === 0) {
					renderStack.push(renderer.render(s))
					renderStack.push(`</p>`)
				} else {
					renderStack.push(`<p class="pf2-stat__text">`)
					renderStack.push(renderer.render(s))
					renderStack.push(`</p>`)
				}
			})
			return renderStack.join("")
		} else return "";
	},
};

Renderer.hover = {
	TAG_TO_PAGE: {
		"spell": UrlUtil.PG_SPELLS,
		"item": UrlUtil.PG_ITEMS,
		"creature": UrlUtil.PG_BESTIARY,
		"condition": UrlUtil.PG_CONDITIONS,
		"disease": UrlUtil.PG_AFFLICTIONS,
		"curse": UrlUtil.PG_AFFLICTIONS,
		"background": UrlUtil.PG_BACKGROUNDS,
		"ancestry": UrlUtil.PG_ANCESTRIES,
		"companion": UrlUtil.PG_COMPANIONS_FAMILIARS,
		"familiar": UrlUtil.PG_COMPANIONS_FAMILIARS,
		"eidolon": UrlUtil.PG_COMPANIONS_FAMILIARS,
		"feat": UrlUtil.PG_FEATS,
		"hazard": UrlUtil.PG_HAZARDS,
		"deity": UrlUtil.PG_DEITIES,
		"organization": UrlUtil.PG_ORGANIZATIONS,
		"creatureTemplate": UrlUtil.PG_CREATURETEMPLATE,
		"variantrule": UrlUtil.PG_VARIANTRULES,
		"optfeature": UrlUtil.PG_OPTIONAL_FEATURES,
	},

	LinkMeta: function () {
		this.isHovered = false;
		this.isLoading = false;
		this.isPermanent = false;
		this.windowMeta = null;
	},

	_BAR_HEIGHT: 16,

	_linkCache: {},
	_eleCache: new Map(),
	_entryCache: {},
	_isInit: false,
	_gmScreen: null,
	_lastId: 0,
	_contextMenu: null,
	_contextMenuLastClickedHeader: null,

	bindGmScreen (screen) {
		this._gmScreen = screen;
	},

	_getNextId () {
		return ++Renderer.hover._lastId;
	},

	_doInit () {
		if (!Renderer.hover._isInit) {
			Renderer.hover._isInit = true;

			$(document.body).on("click", () => Renderer.hover.cleanTempWindows());

			Renderer.hover._contextMenu = ContextUtil.getMenu([
				new ContextUtil.Action(
					"Maximize All",
					() => {
						const $permWindows = $(`.hoverborder[data-perm="true"]`);
						$permWindows.attr("data-display-title", "false");
					},
				),
				new ContextUtil.Action(
					"Minimize All",
					() => {
						const $permWindows = $(`.hoverborder[data-perm="true"]`);
						$permWindows.attr("data-display-title", "true");
					},
				),
				null,
				new ContextUtil.Action(
					"Close Others",
					() => {
						const $thisHoverClose = $(Renderer.hover._contextMenuLastClickedHeader).closest(`.hoverborder--top`).find(`.hvr__close`);
						$(`.hvr__close`).not($thisHoverClose).click();
					},
				),
				new ContextUtil.Action(
					"Close All",
					() => $(`.hvr__close`).click(),
				),
			]);
		}
	},

	cleanTempWindows () {
		for (const [ele, meta] of Renderer.hover._eleCache.entries()) {
			if (!meta.isPermanent && meta.windowMeta && !document.body.contains(ele)) {
				meta.windowMeta.doClose();
			} else if (!meta.isPermanent && meta.isHovered && meta.windowMeta) {
				// Check if any elements have failed to clear their hovering status on mouse move
				const bounds = ele.getBoundingClientRect();
				if (EventUtil._mouseX < bounds.x
					|| EventUtil._mouseY < bounds.y
					|| EventUtil._mouseX > bounds.x + bounds.width
					|| EventUtil._mouseY > bounds.y + bounds.height) {
					meta.windowMeta.doClose();
				}
			}
		}
	},

	_getSetMeta (ele) {
		if (!Renderer.hover._eleCache.has(ele)) Renderer.hover._eleCache.set(ele, new Renderer.hover.LinkMeta());
		return Renderer.hover._eleCache.get(ele);
	},

	_handleGenericMouseOverStart (evt, ele) {
		// Don't open on small screens unless forced
		if (Renderer.hover.isSmallScreen(evt) && !evt.shiftKey) return;

		Renderer.hover.cleanTempWindows();

		const meta = Renderer.hover._getSetMeta(ele);
		if (meta.isHovered || meta.isLoading) return; // Another hover is already in progress

		// Set the cursor to a waiting spinner
		ele.style.cursor = "wait";

		meta.isHovered = true;
		meta.isLoading = true;
		meta.isPermanent = evt.shiftKey;

		return meta;
	},

	// (Baked into render strings)
	async pHandleLinkMouseOver (evt, ele, page, source, hash, preloadId) {
		Renderer.hover._doInit();

		const meta = Renderer.hover._handleGenericMouseOverStart(evt, ele);
		if (meta == null) return;

		if (evt.ctrlKey && Renderer.hover._pageToFluffFn(page)) meta.isFluff = true;

		let toRender;
		if (preloadId != null) {
			const [type, data] = preloadId.split(":");
			switch (type) {
				case VeCt.HASH_CR_SCALED: {
					const baseMon = await Renderer.hover.pCacheAndGet(page, source, hash);
					toRender = await scaleCreature.scale(baseMon, Number(data));
					break;
				}
				case VeCt.HASH_ITEM_RUNES: {
					toRender = Renderer.hover._getFromCache(page, source, hash);
					if (toRender) break;
					const [baseItem, ...runes] = await Promise.all(data.split(HASH_SUB_LIST_SEP).map(h => Renderer.hover.pCacheAndGet(page, decodeURIComponent(h.split(HASH_LIST_SEP)[1]), h)));
					toRender = Renderer.runeItem.getRuneItem(baseItem, runes);
					Renderer.hover._addToCache(page, source, hash, toRender);
					break;
				}
			}
		} else {
			if (meta.isFluff) {
				// Try to fetch the fluff directly
				toRender = await Renderer.hover.pCacheAndGet(`fluff__${page}`, source, hash);
				// Fall back on fluff attached to the object itself
				const entity = await Renderer.hover.pCacheAndGet(page, source, hash);
				const pFnGetFluff = Renderer.hover._pageToFluffFn(page);
				toRender = await pFnGetFluff(entity);
			} else toRender = await Renderer.hover.pCacheAndGet(page, source, hash);
		}

		meta.isLoading = false;
		// Check if we're still hovering the entity
		if (!meta.isHovered && !meta.isPermanent) return;

		const $content = meta.isFluff
			? Renderer.hover.$getHoverContent_fluff(page, toRender)
			: Renderer.hover.$getHoverContent_stats(page, toRender);
		const sourceData = {
			type: "stats",
			page,
			source,
			hash,
		};
		meta.windowMeta = Renderer.hover.getShowWindow(
			$content,
			Renderer.hover.getWindowPositionFromEvent(evt),
			{
				title: toRender ? toRender.name : "",
				isPermanent: meta.isPermanent,
				pageUrl: `${Renderer.get().baseUrl}${page}#${hash}`,
				cbClose: () => meta.isHovered = meta.isPermanent = meta.isLoading = meta.isFluff = false,
				sourceData: toRender,
			},
			sourceData,
		);

		// Reset cursor
		ele.style.cursor = "";

		if (page === UrlUtil.PG_BESTIARY && !meta.isFluff) {
			const win = (evt.view || {}).window;
			const renderFn = Renderer.hover._pageToRenderFn(page);
			if (win._IS_POPOUT) {
				$content.find(`.mon__btn-scale-lvl`).remove();
				$content.find(`.mon__btn-reset-lvl`).remove();
			} else {
				switch (page) {
					case UrlUtil.PG_BESTIARY: {
						Renderer.creature.bindScaleLvlButtons($content, toRender, renderFn, page, source, hash, meta, sourceData);
					}
				}
			}
		}
	},

	// (Baked into render strings)
	handleLinkMouseLeave (evt, ele) {
		const meta = Renderer.hover._eleCache.get(ele);
		ele.style.cursor = "";

		if (!meta || meta.isPermanent) return;

		if (evt.shiftKey) {
			meta.isPermanent = true;
			meta.windowMeta.setIsPermanent(true);
			return;
		}

		meta.isHovered = false;
		if (meta.windowMeta) {
			meta.windowMeta.doClose();
			meta.windowMeta = null;
		}
	},

	// (Baked into render strings)
	handleLinkMouseMove (evt, ele) {
		const meta = Renderer.hover._eleCache.get(ele);
		if (!meta || meta.isPermanent || !meta.windowMeta) return;

		meta.windowMeta.setPosition(Renderer.hover.getWindowPositionFromEvent(evt));

		if (evt.shiftKey && !meta.isPermanent) {
			meta.isPermanent = true;
			meta.windowMeta.setIsPermanent(true);
		}
	},

	/**
	 * (Baked into render strings)
	 * @param evt
	 * @param ele
	 * @param entryId
	 * @param [opts]
	 * @param [opts.isBookContent]
	 * @param [opts.isLargeBookContent]
	 */
	handlePredefinedMouseOver (evt, ele, entryId, opts) {
		opts = opts || {};

		const meta = Renderer.hover._handleGenericMouseOverStart(evt, ele);
		if (meta == null) return;

		Renderer.hover.cleanTempWindows();

		const toRender = Renderer.hover._entryCache[entryId];

		meta.isLoading = false;
		// Check if we're still hovering the entity
		if (!meta.isHovered && !meta.isPermanent) return;

		const $content = Renderer.hover.$getHoverContent_generic(toRender, opts);
		meta.windowMeta = Renderer.hover.getShowWindow(
			$content,
			Renderer.hover.getWindowPositionFromEvent(evt),
			{
				title: toRender.data && toRender.data.hoverTitle != null ? toRender.data.hoverTitle : toRender.name,
				isPermanent: meta.isPermanent,
				cbClose: () => meta.isHovered = meta.isPermanent = meta.isLoading = false,
				sourceData: toRender,
			},
		);

		// Reset cursor
		ele.style.cursor = "";
	},

	// (Baked into render strings)
	handlePredefinedMouseLeave (evt, ele) { return Renderer.hover.handleLinkMouseLeave(evt, ele) },

	// (Baked into render strings)
	handlePredefinedMouseMove (evt, ele) { return Renderer.hover.handleLinkMouseMove(evt, ele) },

	getWindowPositionFromEvent (evt) {
		const ele = evt.target;

		const offset = $(ele).offset();
		const vpOffsetT = offset.top - $(document).scrollTop();
		const vpOffsetL = offset.left - $(document).scrollLeft();

		const fromBottom = vpOffsetT > window.innerHeight / 2;
		const fromRight = vpOffsetL > window.innerWidth / 2;

		return {
			mode: "autoFromElement",
			vpOffsetT,
			vpOffsetL,
			fromBottom,
			fromRight,
			eleHeight: $(ele).height(),
			eleWidth: $(ele).width(),
			clientX: EventUtil.getClientX(evt),
			window: (evt.view || {}).window || window,
		}
	},

	getWindowPositionExact (x, y, evt = null) {
		return {
			window: ((evt || {}).view || {}).window || window,
			mode: "exact",
			x,
			y,
		}
	},

	getWindowPositionExactVisibleBottom (x, y, evt = null) {
		return {
			...Renderer.hover.getWindowPositionExact(x, y, evt),
			mode: "exactVisibleBottom",
		};
	},

	_WINDOW_METAS: {},
	MIN_Z_INDEX: 200,
	_MAX_Z_INDEX: 300,
	_DEFAULT_WIDTH_PX: 600,
	_BODY_SCROLLER_WIDTH_PX: 15,

	_getZIndex () {
		const zIndices = Object.values(Renderer.hover._WINDOW_METAS).map(it => it.zIndex);
		if (!zIndices.length) return Renderer.hover.MIN_Z_INDEX;
		return Math.max(...zIndices);
	},

	_getNextZIndex (hoverId) {
		const cur = Renderer.hover._getZIndex();
		// If we're already the highest index, continue to use this index
		if (hoverId != null && Renderer.hover._WINDOW_METAS[hoverId].zIndex === cur) return cur;
		// otherwise, go one higher
		const out = cur + 1;

		// If we've broken through the max z-index, try to free up some z-indices
		if (out > Renderer.hover._MAX_Z_INDEX) {
			const sortedWindowMetas = Object.entries(Renderer.hover._WINDOW_METAS)
				.sort(([kA, vA], [kB, vB]) => SortUtil.ascSort(vA.zIndex, vB.zIndex));

			if (sortedWindowMetas.length >= (Renderer.hover._MAX_Z_INDEX - Renderer.hover.MIN_Z_INDEX)) {
				// If we have too many window open, collapse them into one z-index
				sortedWindowMetas.forEach(([k, v]) => {
					v.setZIndex(Renderer.hover.MIN_Z_INDEX);
				})
			} else {
				// Otherwise, ensure one consistent run from min to max z-index
				sortedWindowMetas.forEach(([k, v], i) => {
					v.setZIndex(Renderer.hover.MIN_Z_INDEX + i);
				});
			}

			return Renderer.hover._getNextZIndex(hoverId);
		} else return out;
	},

	/**
	 * @param $content Content to append to the window.
	 * @param position The position of the window. Can be specified in various formats.
	 * @param [opts] Options object.
	 * @param [opts.isPermanent] If the window should have the expanded toolbar of a "permanent" window.
	 * @param [opts.title] The window title.
	 * @param [opts.isBookContent] If the hover window contains book content. Affects the styling of borders.
	 * @param [opts.pageUrl] A page URL which is navigable via a button in the window header
	 * @param [opts.cbClose] Callback to run on window close.
	 * @param [opts.width] An initial width for the window.
	 * @param [opts.height] An initial height fot the window.
	 * @param [opts.$pFnGetPopoutContent] A function which loads content for this window when it is popped out.
	 * @param [opts.fnGetPopoutSize] A function which gets a `{width: ..., height: ...}` object with dimensions for a
	 * popout window.
	 * @param [sourceData] Source data which can be used to load the contents into the DM screen.
	 * @param [sourceData.type]
	 */
	getShowWindow ($content, position, opts, sourceData) {
		opts = opts || {};

		Renderer.hover._doInit();

		const initialWidth = opts.width == null ? Renderer.hover._DEFAULT_WIDTH_PX : opts.width;
		const initialZIndex = Renderer.hover._getNextZIndex();

		const $body = $(position.window.document.body);
		const $hov = $(`<div class="hwin"></div>`)
			.css({
				"right": -initialWidth,
				"width": initialWidth,
				"zIndex": initialZIndex,
			});
		const $wrpContent = $(`<div class="hwin__wrp-table"></div>`);
		if (opts.height != null) $wrpContent.css("height", opts.height);
		const $hovTitle = $(`<span class="window-title">${opts.title || ""}</span>`);

		const out = {};
		const hoverId = Renderer.hover._getNextId();
		Renderer.hover._WINDOW_METAS[hoverId] = out;
		const mouseUpId = `mouseup.${hoverId} touchend.${hoverId}`;
		const mouseMoveId = `mousemove.${hoverId} touchmove.${hoverId}`;
		const resizeId = `resize.${hoverId}`;

		const doClose = () => {
			$hov.remove();
			$(position.window.document).off(mouseUpId);
			$(position.window.document).off(mouseMoveId);
			$(position.window).off(resizeId);

			delete Renderer.hover._WINDOW_METAS[hoverId];

			if (opts.cbClose) opts.cbClose(out);
		};

		let drag = {};
		function handleDragMousedown (evt, type) {
			if (evt.which === 0 || evt.which === 1) evt.preventDefault();
			out.zIndex = Renderer.hover._getNextZIndex(hoverId);
			$hov.css({
				"z-index": out.zIndex,
				"animation": "initial",
			});
			drag.type = type;
			drag.startX = EventUtil.getClientX(evt);
			drag.startY = EventUtil.getClientY(evt);
			drag.baseTop = parseFloat($hov.css("top"));
			drag.baseLeft = parseFloat($hov.css("left"));
			drag.baseHeight = $wrpContent.height();
			drag.baseWidth = parseFloat($hov.css("width"));
			if (type < 9) {
				$wrpContent.css({
					"height": drag.baseHeight,
					"max-height": "initial",
				});
				$hov.css("max-width", "initial");
			}
		}

		const $brdrTopRightResize = $(`<div class="hoverborder__resize-ne"></div>`)
			.on("mousedown touchstart", (evt) => handleDragMousedown(evt, 1));

		const $brdrRightResize = $(`<div class="hoverborder__resize-e"></div>`)
			.on("mousedown touchstart", (evt) => handleDragMousedown(evt, 2));

		const $brdrBottomRightResize = $(`<div class="hoverborder__resize-se"></div>`)
			.on("mousedown touchstart", (evt) => handleDragMousedown(evt, 3));

		const $brdrBtm = $(`<div class="hoverborder hoverborder--btm ${opts.isBookContent ? "hoverborder-book" : ""}"><div class="hoverborder__resize-s"></div></div>`)
			.on("mousedown touchstart", (evt) => handleDragMousedown(evt, 4));

		const $brdrBtmLeftResize = $(`<div class="hoverborder__resize-sw"></div>`)
			.on("mousedown touchstart", (evt) => handleDragMousedown(evt, 5));

		const $brdrLeftResize = $(`<div class="hoverborder__resize-w"></div>`)
			.on("mousedown touchstart", (evt) => handleDragMousedown(evt, 6));

		const $brdrTopLeftResize = $(`<div class="hoverborder__resize-nw"></div>`)
			.on("mousedown touchstart", (evt) => handleDragMousedown(evt, 7));

		const $brdrTopResize = $(`<div class="hoverborder__resize-n"></div>`)
			.on("mousedown touchstart", (evt) => handleDragMousedown(evt, 8));

		const $brdrTop = $(`<div class="hoverborder hoverborder--top ${opts.isBookContent ? "hoverborder-book" : ""}" ${opts.isPermanent ? `data-perm="true"` : ""}></div>`)
			.on("mousedown touchstart", (evt) => handleDragMousedown(evt, 9))
			.on("contextmenu", (evt) => {
				Renderer.hover._contextMenuLastClickedHeader = $brdrTop[0];
				ContextUtil.pOpenMenu(evt, Renderer.hover._contextMenu);
			});

		function isOverHoverTarget (evt, target) {
			return EventUtil.getClientX(evt) >= target.left
				&& EventUtil.getClientX(evt) <= target.left + target.width
				&& EventUtil.getClientY(evt) >= target.top
				&& EventUtil.getClientY(evt) <= target.top + target.height;
		}

		function handleNorthDrag (evt) {
			const diffY = Math.max(drag.startY - EventUtil.getClientY(evt), 80 - drag.baseHeight); // prevent <80 height, as this will cause the box to move downwards
			$wrpContent.css("height", drag.baseHeight + diffY);
			$hov.css("top", drag.baseTop - diffY);
			drag.startY = EventUtil.getClientY(evt);
			drag.baseHeight = $wrpContent.height();
			drag.baseTop = parseFloat($hov.css("top"));
		}

		function handleEastDrag (evt) {
			const diffX = drag.startX - EventUtil.getClientX(evt);
			$hov.css("width", drag.baseWidth - diffX);
			drag.startX = EventUtil.getClientX(evt);
			drag.baseWidth = parseFloat($hov.css("width"));
		}

		function handleSouthDrag (evt) {
			const diffY = drag.startY - EventUtil.getClientY(evt);
			$wrpContent.css("height", drag.baseHeight - diffY);
			drag.startY = EventUtil.getClientY(evt);
			drag.baseHeight = $wrpContent.height();
		}

		function handleWestDrag (evt) {
			const diffX = Math.max(drag.startX - EventUtil.getClientX(evt), 150 - drag.baseWidth);
			$hov.css("width", drag.baseWidth + diffX)
				.css("left", drag.baseLeft - diffX);
			drag.startX = EventUtil.getClientX(evt);
			drag.baseWidth = parseFloat($hov.css("width"));
			drag.baseLeft = parseFloat($hov.css("left"));
		}

		$(position.window.document)
			.on(mouseUpId, (evt) => {
				if (drag.type) {
					if (drag.type < 9) {
						$wrpContent.css("max-height", "");
						$hov.css("max-width", "");
					}
					adjustPosition();

					if (drag.type === 9) {
						// handle mobile button touches
						if (evt.target.classList.contains("hvr__close") || evt.target.classList.contains("hvr__popout")) {
							evt.preventDefault();
							drag.type = 0;
							$(evt.target).click();
							return;
						}

						// handle DM screen integration
						if (this._gmScreen && sourceData) {
							const panel = this._gmScreen.getPanelPx(EventUtil.getClientX(evt), EventUtil.getClientY(evt));
							if (!panel) return;
							this._gmScreen.setHoveringPanel(panel);
							const target = panel.getAddButtonPos();

							if (isOverHoverTarget(evt, target)) {
								switch (sourceData.type) {
									case "stats": {
										panel.doPopulate_Stats(sourceData.page, sourceData.source, sourceData.hash);
										break;
									}
									case "statsCreatureScaled": {
										panel.doPopulate_StatsScaledLvl(sourceData.page, sourceData.source, sourceData.hash, sourceData.level);
										break;
									}
								}
								doClose();
							}
							this._gmScreen.resetHoveringButton();
						}
					}
					drag.type = 0;
				}
			})
			.on(mouseMoveId, (evt) => {
				switch (drag.type) {
					case 1: handleNorthDrag(evt); handleEastDrag(evt); break;
					case 2: handleEastDrag(evt); break;
					case 3: handleSouthDrag(evt); handleEastDrag(evt); break;
					case 4: handleSouthDrag(evt); break;
					case 5: handleSouthDrag(evt); handleWestDrag(evt); break;
					case 6: handleWestDrag(evt); break;
					case 7: handleNorthDrag(evt); handleWestDrag(evt); break;
					case 8: handleNorthDrag(evt); break;
					case 9: {
						const diffX = drag.startX - EventUtil.getClientX(evt);
						const diffY = drag.startY - EventUtil.getClientY(evt);
						$hov.css("left", drag.baseLeft - diffX)
							.css("top", drag.baseTop - diffY);
						drag.startX = EventUtil.getClientX(evt);
						drag.startY = EventUtil.getClientY(evt);
						drag.baseTop = parseFloat($hov.css("top"));
						drag.baseLeft = parseFloat($hov.css("left"));

						// handle DM screen integration
						if (this._gmScreen) {
							const panel = this._gmScreen.getPanelPx(EventUtil.getClientX(evt), EventUtil.getClientY(evt));
							if (!panel) return;
							this._gmScreen.setHoveringPanel(panel);
							const target = panel.getAddButtonPos();

							if (isOverHoverTarget(evt, target)) this._gmScreen.setHoveringButton(panel);
							else this._gmScreen.resetHoveringButton();
						}
						break;
					}
				}
			});
		$(position.window).on(resizeId, () => adjustPosition(true));

		const doToggleMinimizedMaximized = () => {
			const curState = $brdrTop.attr("data-display-title");
			const isNextMinified = curState === "false";
			$brdrTop.attr("data-display-title", isNextMinified);
			$brdrTop.attr("data-perm", true);
			$hov.toggleClass("hwin--minified", isNextMinified);
		};

		const doMaximize = () => {
			$brdrTop.attr("data-display-title", false);
			$hov.toggleClass("hwin--minified", false);
		};

		$brdrTop.attr("data-display-title", false);
		$brdrTop.on("dblclick", () => doToggleMinimizedMaximized());
		$brdrTop.append($hovTitle);
		const $brdTopRhs = $(`<div class="flex" style="margin-left: auto;"></div>`).appendTo($brdrTop);

		if (opts.pageUrl && !position.window._IS_POPOUT && !Renderer.get().isInternalLinksDisabled()) {
			const $btnGotoPage = $(`<a class="top-border-icon glyphicon glyphicon-modal-window" style="margin-right: 2px;" title="Go to Page" href="${opts.pageUrl}"></a>`)
				.appendTo($brdTopRhs);
		}

		if (!position.window._IS_POPOUT) {
			const $btnPopout = $(`<span class="top-border-icon glyphicon glyphicon-new-window hvr__popout" style="margin-right: 2px;" title="Open as Popup Window"></span>`)
				.on("click", async evt => {
					evt.stopPropagation();

					const dimensions = opts.fnGetPopoutSize ? opts.fnGetPopoutSize() : { width: 600, height: $content.height() };
					const win = open(
						"",
						opts.title || "",
						`width=${dimensions.width},height=${dimensions.height}location=0,menubar=0,status=0,titlebar=0,toolbar=0`,
					);

					win._IS_POPOUT = true;
					win.document.write(`
						<!DOCTYPE html>
						<html lang="en" class="${typeof styleSwitcher !== "undefined" && styleSwitcher.getActiveDayNight() === StyleSwitcher.STYLE_NIGHT ? StyleSwitcher.NIGHT_CLASS : ""}"><head>
							<meta name="viewport" content="width=device-width, initial-scale=1">
							<title>${opts.title}</title>
							${$(`link[rel="stylesheet"][href]`).map((i, e) => e.outerHTML).get().join("\n")}
							<!-- Favicons -->
							<link rel="icon" type="image/svg+xml" href="favicon.svg">
							<link rel="icon" type="image/png" sizes="256x256" href="favicon-256x256.png">
							<link rel="icon" type="image/png" sizes="144x144" href="favicon-144x144.png">
							<link rel="icon" type="image/png" sizes="128x128" href="favicon-128x128.png">
							<link rel="icon" type="image/png" sizes="64x64" href="favicon-64x64.png">
							<link rel="icon" type="image/png" sizes="48x48" href="favicon-48x48.png">
							<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
							<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">

							<!-- Chrome Web App Icons -->
							<link rel="manifest" href="manifest.webmanifest">
							<meta name="application-name" content="Pf2eTools">
							<meta name="theme-color" content="#006bc4">

							<!-- Windows Start Menu tiles -->
							<meta name="msapplication-config" content="browserconfig.xml"/>
							<meta name="msapplication-TileColor" content="#006bc4">

							<!-- Apple Touch Icons -->
							<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon-180x180.png">
							<link rel="apple-touch-icon" sizes="360x360" href="apple-touch-icon-360x360.png">
							<link rel="apple-touch-icon" sizes="167x167" href="apple-touch-icon-167x167.png">
							<link rel="apple-touch-icon" sizes="152x152" href="apple-touch-icon-152x152.png">
							<link rel="apple-touch-icon" sizes="120x120" href="apple-touch-icon-120x120.png">
							<meta name="apple-mobile-web-app-title" content="Pf2eTools">

							<!-- macOS Safari Pinned Tab and Touch Bar -->
							<link rel="mask-icon" href="safari-pinned-tab.svg" color="#006bc4">

							<style>
								html, body { width: 100%; height: 100%; }
								body { overflow: hidden; }
								.hwin--popout { max-width: 100%; max-height: 100%; box-shadow: initial; width: 100%; overflow-y: auto; }
							</style>
						</head><body class="rd__body-popout">
						<div class="hwin hoverbox--popout hwin--popout"></div>
						<script src="js/parser.js"></script>
						<script src="js/utils.js"></script>
						<script src="lib/jquery.js"></script>
						</body></html>
					`);

					let $cpyContent;
					if (opts.$pFnGetPopoutContent) {
						$cpyContent = await opts.$pFnGetPopoutContent();
					} else {
						$cpyContent = $content.clone(true, true);
						$cpyContent.find(`.mon__btn-scale-lvl`).remove();
						$cpyContent.find(`.mon__btn-scale-lvl`).remove();
					}

					let ticks = 50;
					while (!win.document.body && ticks-- > 0) await MiscUtil.pDelay(5);

					$cpyContent.appendTo($(win.document).find(`.hoverbox--popout`));

					win.Renderer = Renderer;

					doClose();
				}).appendTo($brdTopRhs);
		}

		if (opts.sourceData) {
			const btnPopout = e_({
				tag: "span",
				clazz: `hwin__top-border-icon hwin__top-border-icon--text`,
				title: "Show Source Data",
				text: "{}",
				click: evt => {
					evt.stopPropagation();
					evt.preventDefault();

					const $content = Renderer.hover.$getHoverContent_statsCode(opts.sourceData);
					Renderer.hover.getShowWindow(
						$content,
						Renderer.hover.getWindowPositionFromEvent(evt),
						{
							title: [opts.sourceData._displayName || opts.sourceData.name, "Source Data"].filter(Boolean).join(" \u2014 "),
							isPermanent: true,
							isBookContent: true,
						},
					);
				},
			});
			$brdTopRhs.append(btnPopout);
		}

		const $btnClose = $(`<span class="delete-icon glyphicon glyphicon-remove hvr__close" title="Close"></span>`)
			.on("click", (evt) => {
				evt.stopPropagation();
				doClose();
			}).appendTo($brdTopRhs);

		$wrpContent.append($content);

		$hov.append($brdrTopResize).append($brdrTopRightResize).append($brdrRightResize).append($brdrBottomRightResize)
			.append($brdrBtmLeftResize).append($brdrLeftResize).append($brdrTopLeftResize)

			.append($brdrTop)
			.append($wrpContent)
			.append($brdrBtm);

		$body.append($hov);

		const setPosition = (pos) => {
			switch (pos.mode) {
				case "autoFromElement": {
					if (pos.fromBottom) $hov.css("top", pos.vpOffsetT - ($hov.height() + 10));
					else $hov.css("top", pos.vpOffsetT + pos.eleHeight + 10);

					if (pos.fromRight) $hov.css("left", (pos.clientX || pos.vpOffsetL) - (parseFloat($hov.css("width")) + 10));
					else $hov.css("left", (pos.clientX || (pos.vpOffsetL + pos.eleWidth)) + 10);
					break;
				}
				case "exact": {
					$hov.css({
						"left": pos.x,
						"top": pos.y,
					});
					break;
				}
				case "exactVisibleBottom": {
					$hov.css({
						"left": pos.x,
						"top": pos.y,
						"animation": "initial", // Briefly remove the animation so we can calculate the height
					});

					let yPos = pos.y;

					const { bottom: posBottom, height: winHeight } = $hov[0].getBoundingClientRect();
					const height = position.window.innerHeight
					if (posBottom > height) {
						yPos = position.window.innerHeight - winHeight;
						$hov.css({
							"top": yPos,
							"animation": "",
						});
					}

					break;
				}
				default:
					throw new Error(`Positiong mode unimplemented: "${pos.mode}"`);
			}

			adjustPosition(true);
		};

		setPosition(position);

		function adjustPosition () {
			const eleHov = $hov[0];
			// use these pre-computed values instead of forcing redraws for speed (saves ~100ms)
			const hvTop = parseFloat(eleHov.style.top);
			const hvLeft = parseFloat(eleHov.style.left);
			const hvWidth = parseFloat(eleHov.style.width);
			const screenHeight = position.window.innerHeight;
			const screenWidth = position.window.innerWidth;

			// readjust position...
			// ...if vertically clipping off screen
			if (hvTop < 0) eleHov.style.top = `0px`;
			else if (hvTop >= screenHeight - Renderer.hover._BAR_HEIGHT) {
				$hov.css("top", screenHeight - Renderer.hover._BAR_HEIGHT);
			}

			// ...if horizontally clipping off screen
			if (hvLeft < 0) $hov.css("left", 0);
			else if (hvLeft + hvWidth + Renderer.hover._BODY_SCROLLER_WIDTH_PX > screenWidth) {
				$hov.css("left", Math.max(screenWidth - hvWidth - Renderer.hover._BODY_SCROLLER_WIDTH_PX, 0));
			}
		}

		const setIsPermanent = (isPermanent) => {
			opts.isPermanent = isPermanent;
			$brdrTop.attr("data-perm", isPermanent);
		};

		const setZIndex = (zIndex) => {
			$hov.css("z-index", zIndex);
			out.zIndex = zIndex;
		};

		const doZIndexToFront = () => {
			const nxtZIndex = Renderer.hover._getNextZIndex(hoverId);
			setZIndex(nxtZIndex);
		};

		out.$windowTitle = $hovTitle;
		out.zIndex = initialZIndex;
		out.setZIndex = setZIndex

		out.setPosition = setPosition;
		out.setIsPermanent = setIsPermanent;
		out.doClose = doClose;
		out.doMaximize = doMaximize;
		out.doZIndexToFront = doZIndexToFront;

		return out;
	},

	/**
	 * @param entry
	 * @param [opts]
	 * @param [opts.isBookContent]
	 * @param [opts.isLargeBookContent]
	 * @param [opts.depth]
	 */
	getMakePredefinedHover (entry, opts) {
		opts = opts || {};

		const id = Renderer.hover._getNextId();
		Renderer.hover._entryCache[id] = entry;
		return {
			id,
			html: `onmouseover="Renderer.hover.handlePredefinedMouseOver(event, this, ${id}, ${JSON.stringify(opts).escapeQuotes()})" onmousemove="Renderer.hover.handlePredefinedMouseMove(event, this)" onmouseleave="Renderer.hover.handlePredefinedMouseLeave(event, this)" ${Renderer.hover.getPreventTouchString()}`,
			mouseOver: (evt, ele) => Renderer.hover.handlePredefinedMouseOver(evt, ele, id, opts),
			mouseMove: (evt, ele) => Renderer.hover.handlePredefinedMouseMove(evt, ele),
			mouseLeave: (evt, ele) => Renderer.hover.handlePredefinedMouseLeave(evt, ele),
			touchStart: (evt, ele) => Renderer.hover.handleTouchStart(evt, ele),
		};
	},

	updatePredefinedHover (id, entry) {
		Renderer.hover._entryCache[id] = entry;
	},

	getPreventTouchString () {
		return `ontouchstart="Renderer.hover.handleTouchStart(event, this)"`
	},

	handleTouchStart (evt, ele) {
		// on large touchscreen devices only (e.g. iPads)
		if (!Renderer.hover.isSmallScreen(evt)) {
			// cache the link location and redirect it to void
			$(ele).data("href", $(ele).data("href") || $(ele).attr("href"));
			$(ele).attr("href", "javascript:void(0)");
			// restore the location after 100ms; if the user long-presses the link will be restored by the time they
			//   e.g. attempt to open a new tab
			setTimeout(() => {
				const data = $(ele).data("href");
				if (data) {
					$(ele).attr("href", data);
					$(ele).data("href", null);
				}
			}, 100);
		}
	},

	// region entry fetching
	addEmbeddedToCache (page, source, hash, entity) {
		Renderer.hover._addToCache(page, source, hash, entity);
	},

	_addToCache: (page, source, hash, entity) => {
		page = page.toLowerCase();
		source = source.toLowerCase();
		hash = hash.toLowerCase();

		((Renderer.hover._linkCache[page] =
			Renderer.hover._linkCache[page] || {})[source] =
			Renderer.hover._linkCache[page][source] || {})[hash] = entity;
	},

	_getFromCache: (page, source, hash, opts) => {
		opts = opts || {};

		page = page.toLowerCase();
		source = source.toLowerCase();
		hash = hash.toLowerCase();

		const out = MiscUtil.get(Renderer.hover._linkCache, page, source, hash);
		if (opts.isCopy && out != null) return MiscUtil.copy(out);
		return out;
	},

	_isCached: (page, source, hash) => {
		return Renderer.hover._linkCache[page] && Renderer.hover._linkCache[page][source] && Renderer.hover._linkCache[page][source][hash];
	},

	_psCacheLoading: {},
	_flagsCacheLoaded: {},
	_locks: {},
	_flags: {},

	/**
	 * @param page
	 * @param hash
	 * @param [opts] Options object.
	 * @param [opts.isCopy] If a copy, rather than the original entity, should be returned.
	 */
	async pCacheAndGetHash (page, hash, opts) {
		const source = decodeURIComponent(hash.split(HASH_LIST_SEP).last());
		return Renderer.hover.pCacheAndGet(page, source, hash, opts);
	},

	/**
	 * @param page
	 * @param source
	 * @param hash
	 * @param [opts] Options object.
	 * @param [opts.isCopy] If a copy, rather than the original entity, should be returned.
	 */
	async pCacheAndGet (page, source, hash, opts) {
		opts = opts || {};

		page = page.toLowerCase();
		source = source.toLowerCase();
		hash = hash.toLowerCase();

		const existingOut = Renderer.hover._getFromCache(page, source, hash, opts);
		if (existingOut) return existingOut;

		switch (page) {
			case "generic":
			case "hover":
				return null;
			case UrlUtil.PG_CLASSES:
				return Renderer.hover._pCacheAndGet_pLoadClasses(page, source, hash, opts);
			case UrlUtil.PG_SPELLS:
				return Renderer.hover._pCacheAndGet_pLoadWithIndex(page, source, hash, opts, `data/spells/`, "spell");
			case UrlUtil.PG_RITUALS:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "rituals.json", "ritual");
			case UrlUtil.PG_BESTIARY:
				return Renderer.hover._pCacheAndGet_pLoadWithIndex(page, source, hash, opts, `data/bestiary/`, "creature");
			case UrlUtil.PG_ITEMS: {
				const loadKey = UrlUtil.PG_ITEMS;
				// FIXME: urgent
				await Renderer.hover._pCacheAndGet_pDoLoadWithLock(
					page,
					source,
					hash,
					loadKey,
					async () => {
						const allItems = await Renderer.item.pBuildList({
							isAddGroups: true,
							isBlacklistVariants: true,
						});
						// populate brew once the main item properties have been loaded
						const brewData = await BrewUtil.pAddBrewData();
						const itemList = await Renderer.item.getItemsFromHomebrew(brewData);
						itemList.forEach(it => {
							const itHash = UrlUtil.URL_TO_HASH_BUILDER[page](it);
							Renderer.hover._addToCache(page, it.source, itHash, it);
						});

						allItems.forEach(item => {
							const itemHash = UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ITEMS](item);
							Renderer.hover._addToCache(page, item.source, itemHash, item);
						});
					},
				);

				return Renderer.hover._getFromCache(page, source, hash, opts);
			}
			case UrlUtil.PG_VEHICLES:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "vehicles.json", ["vehicle"]);
			case UrlUtil.PG_BACKGROUNDS:
				return Renderer.hover._pCacheAndGet_pLoadWithIndex(page, source, hash, opts, "data/backgrounds/", "background");
			case UrlUtil.PG_ARCHETYPES:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "archetypes.json", ["archetype"]);
			case UrlUtil.PG_FEATS:
				return Renderer.hover._pCacheAndGet_pLoadWithIndex(page, source, hash, opts, "data/feats/", "feat");
			case UrlUtil.PG_COMPANIONS_FAMILIARS:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "companionsfamiliars.json", ["companion", "companionAbility", "familiar", "familiarAbility", "eidolon"]);
			case UrlUtil.PG_ANCESTRIES:
				return Renderer.hover._pCacheAndGet_pLoadAncestries(page, source, hash, opts);
			case UrlUtil.PG_DEITIES:
				return Renderer.hover._pCacheAndGet_pLoadCustom(page, source, hash, opts, "deities.json", "deity", null, "deity");
			case UrlUtil.PG_ORGANIZATIONS:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "organizations.json", "organization");
			case UrlUtil.PG_CREATURETEMPLATE:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "creaturetemplates.json", "creatureTemplate");
			case UrlUtil.PG_HAZARDS:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "hazards.json", ["hazard"]);
			case UrlUtil.PG_VARIANTRULES:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "variantrules.json", "variantrule");
			case UrlUtil.PG_CONDITIONS:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "conditions.json", ["condition"], (listProp, item) => item.__prop = listProp);
			case UrlUtil.PG_AFFLICTIONS:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "afflictions.json", ["disease", "curse"], (listProp, item) => item.__prop = listProp);
			case UrlUtil.PG_TABLES:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "tables.json", ["table", "tableGroup"], (listProp, item) => item.__prop = listProp);
			case UrlUtil.PG_ACTIONS:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "actions.json", "action");
			case UrlUtil.PG_OPTIONAL_FEATURES:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "optionalfeatures.json", "optionalfeature");
			case UrlUtil.PG_ABILITIES:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "abilities.json", "ability");
			case UrlUtil.PG_LANGUAGES:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "languages.json", "language");
			case UrlUtil.PG_TRAITS:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, "TRT", hash, { sourceOverride: "TRT", ...opts }, "traits.json", "trait");
			case UrlUtil.PG_PLACES:
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "places.json", "place");

			// region adventure/books/references
			case UrlUtil.PG_QUICKREF: {
				const loadKey = UrlUtil.PG_QUICKREF;

				await Renderer.hover._pCacheAndGet_pDoLoadWithLock(
					page,
					source,
					hash,
					loadKey,
					async () => {
						const json = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/generated/bookref-quick.json`);

						json.data["bookref-quick"].forEach((chapter, ixChapter) => {
							const metas = IndexableFileQuickReference.getChapterNameMetas(chapter);

							metas.forEach(nameMeta => {
								const hashParts = [
									"bookref-quick",
									ixChapter,
									UrlUtil.encodeForHash(nameMeta.name.toLowerCase()),
								];
								if (nameMeta.ixBook) hashParts.push(nameMeta.ixBook);
								else hashParts.push(0);

								const hash = hashParts.join(HASH_PART_SEP);

								Renderer.hover._addToCache(page, nameMeta.source, hash, nameMeta.entry);
							});
						});
					},
				);

				return Renderer.hover._getFromCache(page, source, hash, opts);
			}

			case UrlUtil.PG_ADVENTURE: {
				const loadKey = `${page}${source}`;

				await Renderer.hover._pCacheAndGet_pDoLoadWithLock(
					page,
					source,
					hash,
					loadKey,
					async () => {
						// region Brew
						const brew = await BrewUtil.pAddBrewData();

						// Get only the ids that exist in both data + contents
						const brewDataIds = (brew.adventureData || []).filter(it => it.id).map(it => it.id);
						const brewContentsIds = new Set(...(brew.adventure || []).filter(it => it.id).map(it => it.id));
						const matchingBrewIds = brewDataIds.filter(id => brewContentsIds.has(id));

						matchingBrewIds.forEach(id => {
							const brewData = (brew.adventureData || []).find(it => it.id === id);
							const brewContents = (brew.adventure || []).find(it => it.id === id);

							const pack = {
								adventure: brewContents,
								adventureData: brewData,
							};

							const hash = UrlUtil.URL_TO_HASH_BUILDER[page](brewContents);
							Renderer.hover._addToCache(page, brewContents.source, hash, pack);
						});
						// endregion

						const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/adventures.json`);
						const fromIndex = index.adventure.find(it => UrlUtil.URL_TO_HASH_BUILDER[page](it) === hash);
						if (!fromIndex) return Renderer.hover._getFromCache(page, source, hash, opts);

						const json = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/adventure/adventure-${hash}.json`);

						const pack = {
							adventure: fromIndex,
							adventureData: json,
						};

						Renderer.hover._addToCache(page, fromIndex.source, hash, pack);
					},
				);

				return Renderer.hover._getFromCache(page, source, hash, opts);
			}
			// endregion

			// region per-page fluff
			case `fluff__${UrlUtil.PG_BESTIARY}`:
				return Renderer.hover._pCacheAndGet_pLoadMultiSourceFluff(page, source, hash, opts, `data/bestiary/`, "creatureFluff");
			case `fluff__${UrlUtil.PG_SPELLS}`:
				return Renderer.hover._pCacheAndGet_pLoadMultiSourceFluff(page, source, hash, opts, `data/spells/`, "spellFluff");
			case `fluff__${UrlUtil.PG_BACKGROUNDS}`:
				return Renderer.hover._pCacheAndGet_pLoadSimpleFluff(page, source, hash, opts, "data/backgrounds/fluff-backgrounds.json", "backgroundFluff");
			case `fluff__${UrlUtil.PG_ITEMS}`:
				return Renderer.hover._pCacheAndGet_pLoadSimpleFluff(page, source, hash, opts, "fluff-conditions.json", ["conditionFluff", "diseaseFluff"]);
			case `fluff__${UrlUtil.PG_ORGANIZATIONS}`:
				return Renderer.hover._pCacheAndGet_pLoadSimpleFluff(page, source, hash, opts, "fluff-organizations.json", "organizationFluff");
			case `fluff__${UrlUtil.PG_CREATURETEMPLATE}`:
				return Renderer.hover._pCacheAndGet_pLoadSimpleFluff(page, source, hash, opts, "fluff-creaturetemplates.json", "creatureTemplateFluff");
				// endregion

			// region props
			case "classfeature":
				return Renderer.hover._pCacheAndGet_pLoadClassFeatures(page, source, hash, opts);
			case "subclassfeature":
				return Renderer.hover._pCacheAndGet_pLoadSubclassFeatures(page, source, hash, opts);
			case "domain":
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "domains.json", ["domain"]);
			case "group":
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "groups.json", ["group"]);
			case "skill":
				return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, opts, "skills.json", ["skill"]);

			case "raw_classfeature":
				return Renderer.hover._pCacheAndGet_pLoadClassFeatures(page, source, hash, opts);
			case "raw_subclassfeature":
				return Renderer.hover._pCacheAndGet_pLoadSubclassFeatures(page, source, hash, opts);

			default:
				throw new Error(`No load function defined for page ${page}`);
		}
	},

	async _pCacheAndGet_pDoLoadWithLock (page, source, hash, loadKey, pFnLoad) {
		if (Renderer.hover._psCacheLoading[loadKey]) await Renderer.hover._psCacheLoading[loadKey];

		if (!Renderer.hover._flagsCacheLoaded[loadKey] || !Renderer.hover._isCached(page, source, hash)) {
			Renderer.hover._psCacheLoading[loadKey] = (async () => {
				await pFnLoad();

				Renderer.hover._flagsCacheLoaded[loadKey] = true;
			})();
			await Renderer.hover._psCacheLoading[loadKey];
		}
	},

	/**
	 * @param page
	 * @param data the data
	 * @param listProp list property in the data
	 * @param [opts]
	 * @param [opts.fnMutateItem] optional function to run per item; takes listProp and an item as parameters
	 * @param [opts.fnGetHash]
	 * @param [opts.sourceOverride]
	 */
	_pCacheAndGet_populate (page, data, listProp, opts) {
		opts = opts || {};

		data[listProp].forEach(it => {
			const itHash = (opts.fnGetHash || UrlUtil.URL_TO_HASH_BUILDER[page])(it);
			it.__prop = listProp;
			if (opts.fnMutateItem) opts.fnMutateItem(listProp, it);
			const source = opts.sourceOverride || it.source;
			Renderer.hover._addToCache(page, source, itHash, it);
		});
	},

	async _pCacheAndGet_pLoadWithIndex (page, source, hash, opts, baseUrl, listProp, fnPrePopulate = null) {
		const loadKey = `${page}${source}`;

		await Renderer.hover._pCacheAndGet_pDoLoadWithLock(
			page,
			source,
			hash,
			loadKey,
			async () => {
				const brewData = await BrewUtil.pAddBrewData();
				if (fnPrePopulate) fnPrePopulate(brewData, { isBrew: true });
				if (brewData[listProp]) Renderer.hover._pCacheAndGet_populate(page, brewData, listProp, { fnGetHash: opts.fnGetHash });
				const index = await DataUtil.loadJSON(`${Renderer.get().baseUrl}${baseUrl}${opts.isFluff ? "fluff-" : ""}index.json`);
				const officialSources = {};
				Object.entries(index).forEach(([k, v]) => officialSources[k.toLowerCase()] = v);

				const officialSource = officialSources[source.toLowerCase()];
				if (officialSource) {
					const data = await DataUtil.loadJSON(`${Renderer.get().baseUrl}${baseUrl}${officialSource}`);
					if (fnPrePopulate) fnPrePopulate(data, { isBrew: false });
					Renderer.hover._pCacheAndGet_populate(page, data, listProp, { fnGetHash: opts.fnGetHash });
				}
				// (else source to load is 3rd party, which was already handled)
			},
		);

		return Renderer.hover._getFromCache(page, source, hash, opts);
	},

	async _pCacheAndGet_pLoadMultiSourceFluff (page, source, hash, opts, baseUrl, listProp, fnPrePopulate = null) {
		const nxtOpts = MiscUtil.copy(opts);
		nxtOpts.isFluff = true;
		nxtOpts.fnGetHash = it => UrlUtil.encodeForHash([it.name, it.source]);
		return Renderer.hover._pCacheAndGet_pLoadWithIndex(page, source, hash, nxtOpts, baseUrl, listProp);
	},

	async _pCacheAndGet_pLoadSingleBrew (page, opts, listProps, fnMutateItem) {
		const brewData = await BrewUtil.pAddBrewData();
		listProps = listProps instanceof Array ? listProps : [listProps];
		listProps.forEach(lp => {
			if (brewData[lp]) {
				Renderer.hover._pCacheAndGet_populate(page, brewData, lp, {
					fnMutateItem,
					fnGetHash: opts.fnGetHash,
				});
			}
		});
	},

	_pCacheAndGet_handleSingleData (page, opts, data, listProps, fnMutateItem) {
		if (listProps instanceof Array) {
			listProps.forEach(prop => data[prop] && Renderer.hover._pCacheAndGet_populate(page, data, prop, {
				fnMutateItem,
				fnGetHash: opts.fnGetHash,
				sourceOverride: opts.sourceOverride,
			}));
		} else Renderer.hover._pCacheAndGet_populate(page, data, listProps, { fnMutateItem, fnGetHash: opts.fnGetHash, sourceOverride: opts.sourceOverride });
	},

	async _pCacheAndGet_pLoadSimple (page, source, hash, opts, jsonFile, listProps, fnMutateItem) {
		const loadKey = jsonFile;

		await Renderer.hover._pCacheAndGet_pDoLoadWithLock(
			page,
			source,
			hash,
			loadKey,
			async () => {
				await Renderer.hover._pCacheAndGet_pLoadSingleBrew(page, opts, listProps, fnMutateItem);
				const data = await DataUtil.loadJSON(`${Renderer.get().baseUrl}data/${jsonFile}`);
				Renderer.hover._pCacheAndGet_handleSingleData(page, opts, data, listProps, fnMutateItem);
			},
		);

		return Renderer.hover._getFromCache(page, source, hash, opts);
	},

	async _pCacheAndGet_pLoadSimpleFluff (page, source, hash, opts, jsonFile, listProps, fnMutateItem) {
		const nxtOpts = MiscUtil.copy(opts);
		nxtOpts.isFluff = true;
		nxtOpts.fnGetHash = it => UrlUtil.encodeForHash([it.name, it.source]);
		return Renderer.hover._pCacheAndGet_pLoadSimple(page, source, hash, nxtOpts, jsonFile, listProps, fnMutateItem);
	},

	async _pCacheAndGet_pLoadCustom (page, source, hash, opts, jsonFile, listProps, itemModifier, loader) {
		const loadKey = jsonFile;

		await Renderer.hover._pCacheAndGet_pDoLoadWithLock(
			page,
			source,
			hash,
			loadKey,
			async () => {
				await Renderer.hover._pCacheAndGet_pLoadSingleBrew(page, opts, listProps, itemModifier);
				const data = await DataUtil[loader].loadJSON();
				Renderer.hover._pCacheAndGet_handleSingleData(page, opts, data, listProps, itemModifier);
			},
		);

		return Renderer.hover._getFromCache(page, source, hash, opts);
	},

	async _pCacheAndGet_pLoadAncestries (page, source, hash, opts) {
		const loadKey = UrlUtil.PG_ANCESTRIES;

		await Renderer.hover._pCacheAndGet_pDoLoadWithLock(
			page,
			source,
			hash,
			loadKey,
			async () => {
				const addToIndex = (anc) => {
					anc = MiscUtil.copy(anc);
					anc.__prop = "ancestry";
					const ancHash = UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ANCESTRIES](anc);
					Renderer.hover._addToCache(UrlUtil.PG_ANCESTRIES, anc.source || SRC_CRB, ancHash, anc);

					(anc.heritage || []).forEach(h => {
						h = MiscUtil.copy(h);
						h.__prop = "heritage"
						const hHash = `${ancHash}${HASH_PART_SEP}${UrlUtil.getAncestriesPageStatePart({ heritage: h })}`;
						Renderer.hover._addToCache(UrlUtil.PG_ANCESTRIES, anc.source || h.source || SRC_CRB, hHash, h);
						Renderer.hover._addToCache(UrlUtil.PG_ANCESTRIES, h.source || SRC_CRB, hHash, h);
					});
				};

				const addHeritageToIndex = (h, prop) => {
					h = MiscUtil.copy(h);
					h.__prop = prop;
					const anc = ancestryData.ancestry.find(it => it.name === h.ancestryName && it.source === (h.ancestrySource || SRC_CRB));
					let ancHash = HASH_BLANK;
					if (anc) ancHash = UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ANCESTRIES](anc);

					const hHash = `${ancHash}${HASH_PART_SEP}${UrlUtil.getAncestriesPageStatePart({ heritage: h })}`;
					if (anc) Renderer.hover._addToCache(UrlUtil.PG_ANCESTRIES, anc.source || h.source || SRC_CRB, hHash, h);
					Renderer.hover._addToCache(UrlUtil.PG_ANCESTRIES, h.source || SRC_CRB, hHash, h);
				};

				const ancestryData = await DataUtil.ancestry.loadJSON();
				const brewData = await BrewUtil.pAddBrewData();
				(brewData.ancestry || []).forEach(a => addToIndex(a));
				for (const h of (brewData.heritage || [])) addHeritageToIndex(h, "heritage");
				for (const vh of (brewData.versatileHeritage || [])) addHeritageToIndex(vh, "versatileHeritage");
				ancestryData.ancestry.forEach(a => addToIndex(a));
				ancestryData.versatileHeritage.forEach(vh => addHeritageToIndex(vh, "versatileHeritage"));
			},
		);

		return Renderer.hover._getFromCache(page, source, hash, opts);
	},

	async _pCacheAndGet_pLoadClasses (page, source, hash, opts) {
		const loadKey = UrlUtil.PG_CLASSES;

		await Renderer.hover._pCacheAndGet_pDoLoadWithLock(
			page,
			source,
			hash,
			loadKey,
			async () => {
				const pAddToIndex = async cls => {
					// add class
					const clsHash = UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES](cls);
					cls = await DataUtil.class.pGetDereferencedClassData(cls);
					const clsEntries = {
						name: cls.name,
						type: "section",
						entries: MiscUtil.copy((cls.classFeatures || []).flat()),
					};
					Renderer.hover._addToCache(UrlUtil.PG_CLASSES, cls.source || SRC_CRB, clsHash, clsEntries);

					// add subclasses
					await Promise.all((cls.subclasses || []).map(async sc => {
						sc = await DataUtil.class.pGetDereferencedSubclassData(sc);
						const scHash = `${clsHash}${HASH_PART_SEP}${UrlUtil.getClassesPageStatePart({ subclass: sc })}`;
						const scEntries = { type: "section", entries: MiscUtil.copy((sc.subclassFeatures || []).flat()) };
						// Always use the class source where available, as these are all keyed as sub-hashes on the classes page
						Renderer.hover._addToCache(UrlUtil.PG_CLASSES, cls.source || sc.source || SRC_CRB, scHash, scEntries);
						// Add a copy using the subclass source, for omnisearch results
						Renderer.hover._addToCache(UrlUtil.PG_CLASSES, sc.source || SRC_CRB, scHash, scEntries);
					}));

					// add all class/subclass features
					UrlUtil.class.getIndexedEntries(cls).forEach(it => Renderer.hover._addToCache(UrlUtil.PG_CLASSES, it.source, it.hash, it.entry));
				};

				const pAddSubclassToIndex = async sc => {
					const cls = classData.class.find(it => it.name === sc.className && it.source === (sc.classSource || SRC_CRB));
					if (!cls) return;
					const clsHash = UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES](cls);

					// add subclasse
					sc = await DataUtil.class.pGetDereferencedSubclassData(sc);
					const scHash = `${clsHash}${HASH_PART_SEP}${UrlUtil.getClassesPageStatePart({ subclass: sc })}`;
					const scEntries = { type: "section", entries: MiscUtil.copy((sc.subclassFeatures || []).flat()) };
					// Always use the class source where available, as these are all keyed as sub-hashes on the classes page
					Renderer.hover._addToCache(UrlUtil.PG_CLASSES, cls.source || sc.source || SRC_CRB, scHash, scEntries);
					// Add a copy using the subclass source, for omnisearch results
					Renderer.hover._addToCache(UrlUtil.PG_CLASSES, sc.source || SRC_CRB, scHash, scEntries);

					// Reduce the class down so we only have subclass features
					const cpyClass = MiscUtil.copy(cls);
					cpyClass.classFeatures = (cpyClass.classFeatures || []).map(lvlFeatureList => {
						return lvlFeatureList.filter(feature => feature.gainSubclassFeature)
					});

					cpyClass.subclasses = [sc];

					// add all class/subclass features
					UrlUtil.class.getIndexedEntries(cpyClass).forEach(it => Renderer.hover._addToCache(UrlUtil.PG_CLASSES, it.source, it.hash, it.entry));
				};

				const classData = await DataUtil.class.loadJSON();
				const brewData = await BrewUtil.pAddBrewData();
				await Promise.all((brewData.class || []).map(cc => pAddToIndex(cc)));
				for (const sc of (brewData.subclass || [])) await pAddSubclassToIndex(sc);
				await Promise.all(classData.class.map(cc => pAddToIndex(cc)));
			},
		);

		return Renderer.hover._getFromCache(page, source, hash, opts);
	},

	async _pCacheAndGet_pLoadClassFeatures (page, source, hash, opts) {
		const loadKey = page;

		await Renderer.hover._pCacheAndGet_pDoLoadWithLock(
			page,
			source,
			hash,
			loadKey,
			async () => {
				const brewData = await BrewUtil.pAddBrewData();
				await Renderer.hover._pCacheAndGet_pDoDereferenceNestedAndCache(brewData.classFeature, "classFeature", UrlUtil.URL_TO_HASH_BUILDER["classFeature"]);
				await Renderer.hover._pCacheAndGet_pLoadOfficialClassAndSubclassFeatures();
			},
		);

		return Renderer.hover._getFromCache(page, source, hash, opts);
	},

	async _pCacheAndGet_pLoadSubclassFeatures (page, source, hash, opts) {
		const loadKey = page;

		await Renderer.hover._pCacheAndGet_pDoLoadWithLock(
			page,
			source,
			hash,
			loadKey,
			async () => {
				const brewData = await BrewUtil.pAddBrewData();
				await Renderer.hover._pCacheAndGet_pDoDereferenceNestedAndCache(brewData.subclassFeature, "subclassFeature", UrlUtil.URL_TO_HASH_BUILDER["subclassFeature"]);
				await Renderer.hover._pCacheAndGet_pLoadOfficialClassAndSubclassFeatures();
			},
		);

		return Renderer.hover._getFromCache(page, source, hash, opts);
	},

	async _pCacheAndGet_pDoDereferenceNestedAndCache (entities, page, fnGetHash) {
		if (!entities) return;

		const entriesWithRefs = {};
		const entriesWithoutRefs = {};
		const ptrHasRef = { _: false };

		const walker = MiscUtil.getWalker({
			keyBlacklist: MiscUtil.GENERIC_WALKER_ENTRIES_KEY_BLACKLIST,
			isNoModification: true,
		});
		const handlers = {
			object: (obj) => {
				if (ptrHasRef._) return obj;
				if (obj.type === "refClassFeature" || obj.type === "refSubclassFeature" || obj.type === "refOptionalfeature") ptrHasRef._ = true;
				return obj;
			},
		};

		entities.forEach(ent => {
			// Cache the raw version
			const hash = fnGetHash(ent);
			Renderer.hover._addToCache(`raw_${page}`, ent.source, hash, ent);

			ptrHasRef._ = false;
			walker.walk(ent.entries, handlers);

			(ptrHasRef._ ? entriesWithRefs : entriesWithoutRefs)[hash] = ptrHasRef._ ? MiscUtil.copy(ent) : ent;
		});

		let cntDerefLoops = 0;
		while (Object.keys(entriesWithRefs).length && cntDerefLoops < 25) { // conservatively avoid infinite looping
			const hashes = Object.keys(entriesWithRefs);
			for (const hash of hashes) {
				const ent = entriesWithRefs[hash];

				const toReplaceMetas = [];
				walker.walk(
					ent.entries,
					{
						array: (arr) => {
							for (let i = 0; i < arr.length; ++i) {
								const it = arr[i];
								if (it.type === "refClassFeature" || it.type === "refSubclassFeature" || it.type === "refOptionalfeature") {
									toReplaceMetas.push({
										...it,
										array: arr,
										ix: i,
									});
								}
							}
							return arr;
						},
					},
				);

				let cntReplaces = 0;
				for (const toReplaceMeta of toReplaceMetas) {
					switch (toReplaceMeta.type) {
						case "refClassFeature":
						case "refSubclassFeature": {
							const prop = toReplaceMeta.type === "refClassFeature" ? "classFeature" : "subclassFeature";
							const refUnpacked = toReplaceMeta.type === "refClassFeature"
								? DataUtil.class.unpackUidClassFeature(toReplaceMeta.classFeature)
								: DataUtil.class.unpackUidSubclassFeature(toReplaceMeta.subclassFeature);
							const refHash = UrlUtil.URL_TO_HASH_BUILDER[prop](refUnpacked);

							// Skip blacklisted
							if (ExcludeUtil.isInitialised && ExcludeUtil.isExcluded(refHash, prop, refUnpacked.source, { isNoCount: true })) {
								cntReplaces++;
								toReplaceMeta.array[toReplaceMeta.ix] = {};
								break;
							}

							// Homebrew can e.g. reference cross-file
							const cpy = entriesWithoutRefs[refHash]
								? MiscUtil.copy(entriesWithoutRefs[refHash])
								: Renderer.hover._getFromCache(prop, refUnpacked.source, refHash, { isCopy: true });

							if (cpy) {
								cntReplaces++;
								delete cpy.className;
								delete cpy.classSource;
								delete cpy.subclassShortName;
								delete cpy.subclassSource;
								delete cpy.level;
								delete cpy.header;
								if (ent.source === cpy.source) delete cpy.source;
								if (ent.page === cpy.page) delete cpy.page;
								if (toReplaceMeta.name) cpy.name = toReplaceMeta.name;
								toReplaceMeta.array[toReplaceMeta.ix] = cpy;
							}

							break;
						}

						case "refOptionalfeature": {
							const refUnpacked = DataUtil.generic.unpackUid(toReplaceMeta.optionalfeature, "optfeature");
							const refHash = UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_COMPANIONS_FAMILIARS](refUnpacked);

							// Skip blacklisted
							if (ExcludeUtil.isInitialised && ExcludeUtil.isExcluded(refHash, "optionalfeature", refUnpacked.source, { isNoCount: true })) {
								cntReplaces++;
								toReplaceMeta.array[toReplaceMeta.ix] = {};
								break;
							}

							const cpy = await Renderer.hover.pCacheAndGetHash(UrlUtil.PG_COMPANIONS_FAMILIARS, refHash, { isCopy: true });
							if (cpy) {
								cntReplaces++;
								delete cpy.featureType;
								delete cpy.prerequisite;
								if (ent.source === cpy.source) delete cpy.source;
								if (ent.page === cpy.page) delete cpy.page;
								if (toReplaceMeta.name) cpy.name = toReplaceMeta.name;
								toReplaceMeta.array[toReplaceMeta.ix] = cpy;
							}

							break;
						}
					}
				}

				if (cntReplaces === toReplaceMetas.length) {
					delete entriesWithRefs[hash];
					entriesWithoutRefs[hash] = ent;
				}
			}

			cntDerefLoops++;
		}

		Object.values(entriesWithoutRefs).forEach(ent => {
			Renderer.hover._addToCache(page, ent.source, fnGetHash(ent), ent);
		});

		// Add the failed-to-resolve entities to the cache nonetheless
		const entriesWithRefsVals = Object.values(entriesWithRefs);
		if (entriesWithRefsVals.length) {
			JqueryUtil.doToast({
				type: "danger",
				content: `Failed to load references for ${entriesWithRefsVals.length} entr${entriesWithRefsVals.length === 1 ? "y" : "ies"}!`,
			});
		}

		entriesWithRefsVals.forEach(ent => {
			Renderer.hover._addToCache(page, ent.source, fnGetHash(ent), ent);
		});
	},

	async _pCacheAndGet_pLoadOfficialClassAndSubclassFeatures () {
		const lockKey = "classFeature__subclassFeature";
		if (Renderer.hover._flags[lockKey]) return;
		if (!Renderer.hover._locks[lockKey]) Renderer.hover._locks[lockKey] = new VeLock();
		await Renderer.hover._locks[lockKey].pLock();
		if (Renderer.hover._flags[lockKey]) return;

		try {
			const rawClassData = await DataUtil.class.loadRawJSON();

			await Renderer.hover._pCacheAndGet_pDoDereferenceNestedAndCache(rawClassData.classFeature, "classFeature", UrlUtil.URL_TO_HASH_BUILDER["classFeature"]);
			await Renderer.hover._pCacheAndGet_pDoDereferenceNestedAndCache(rawClassData.subclassFeature, "subclassFeature", UrlUtil.URL_TO_HASH_BUILDER["subclassFeature"]);

			Renderer.hover._flags[lockKey] = true;
		} finally {
			Renderer.hover._locks[lockKey].unlock();
		}
	},
	// endregion

	getGenericCompactRenderedString (entry) {
		const textStack = [""];
		const renderer = Renderer.get().setFirstSection(true);
		const fakeEntry = { type: "pf2-h3", name: entry.name, entries: entry.entries };
		renderer.recursiveRender(fakeEntry, textStack);
		return textStack.join("");
	},

	_pageToRenderFn (page) {
		switch (page) {
			case "generic":
			case "hover":
				return Renderer.hover.getGenericCompactRenderedString;
			case UrlUtil.PG_QUICKREF:
				return Renderer.hover.getGenericCompactRenderedString;
			case UrlUtil.PG_CLASSES:
				return Renderer.class.getRenderedString;
			case UrlUtil.PG_SPELLS:
				return Renderer.spell.getRenderedString;
			case UrlUtil.PG_RITUALS:
				return Renderer.ritual.getRenderedString;
			case UrlUtil.PG_ITEMS:
				return Renderer.item.getRenderedString;
			case UrlUtil.PG_BESTIARY:
				return (it, opts) => Renderer.creature.getRenderedString(it, {
					showScaler: true,
					isScaled: it._originalLvl != null,
					...opts,
				});
			case UrlUtil.PG_VEHICLES:
				return Renderer.vehicle.getRenderedString;
			case UrlUtil.PG_ARCHETYPES:
				return Renderer.archetype.getRenderedString;
			case UrlUtil.PG_CONDITIONS:
				return Renderer.condition.getRenderedString;
			case UrlUtil.PG_AFFLICTIONS:
				return Renderer.affliction.getRenderedString;
			case UrlUtil.PG_ORGANIZATIONS:
				return Renderer.organization.getRenderedString;
			case UrlUtil.PG_CREATURETEMPLATE:
				return Renderer.creatureTemplate.getRenderedString;
			case UrlUtil.PG_BACKGROUNDS:
				return Renderer.background.getRenderedString;
			case UrlUtil.PG_FEATS:
				return Renderer.feat.getRenderedString;
			case UrlUtil.PG_COMPANIONS_FAMILIARS:
				return Renderer.companionfamiliar.getRenderedString;
			case UrlUtil.PG_ANCESTRIES:
				// FIXME: heritage rendering
				return Renderer.ancestry.getRenderedString;
			case UrlUtil.PG_DEITIES:
				return Renderer.deity.getRenderedString;
			case UrlUtil.PG_HAZARDS:
				return Renderer.hazard.getRenderedString;
			case UrlUtil.PG_VARIANTRULES:
				return Renderer.variantrule.getRenderedString;
			case UrlUtil.PG_TABLES:
				return Renderer.table.getRenderedString;
			case UrlUtil.PG_ACTIONS:
				return Renderer.action.getRenderedString;
			case UrlUtil.PG_ABILITIES:
				return Renderer.ability.getRenderedString;
			case UrlUtil.PG_OPTIONAL_FEATURES:
				return Renderer.optionalFeature.getRenderedString;
			case UrlUtil.PG_LANGUAGES:
				return Renderer.language.getRenderedString;
			case UrlUtil.PG_TRAITS:
				return Renderer.trait.getRenderedString;
			case UrlUtil.PG_PLACES:
				return Renderer.place.getRenderedString;
			// region props
			case "classfeature":
			case "classFeature":
				return Renderer.class.getCompactRenderedClassFeature;
			case "subclassfeature":
			case "subclassFeature":
				return Renderer.class.getCompactRenderedClassFeature;
			case "domain": return Renderer.domain.getRenderedString;
			case "group": return Renderer.group.getRenderedString;
			case "skill": return Renderer.skill.getRenderedString;
			case "genericData": return Renderer.generic.dataGetRenderedString;
			case "genericCreatureAbility": return it => Renderer.creature.getRenderedAbility(it, {isRenderingGeneric: true});
			// endregion
			default: throw new Error(`Unknown page: ${page} in _pageToRenderFn`);
		}
	},

	_pageToFluffFn (page) {
		switch (page) {
			case UrlUtil.PG_BESTIARY:
				return Renderer.creature.pGetFluff;
			case UrlUtil.PG_ITEMS:
				return Renderer.item.pGetFluff;
			case UrlUtil.PG_SPELLS:
				return Renderer.spell.pGetFluff;
			case UrlUtil.PG_ANCESTRIES:
				return Renderer.ancestry.pGetFluff;
			case UrlUtil.PG_BACKGROUNDS:
				return Renderer.background.pGetFluff;
			case UrlUtil.PG_LANGUAGES:
				return Renderer.language.pGetFluff;
			default:
				return null;
		}
	},

	isSmallScreen (evt) {
		evt = evt || {};
		const win = (evt.view || {}).window || window;
		return win.innerWidth <= 768;
	},

	bindPopoutButton ($btnPop, toList, handlerGenerator, title, page) {
		$btnPop
			.off("click")
			.title(title || "Popout Window (SHIFT for Source Data)");

		$btnPop.on(
			"click",
			handlerGenerator
				? handlerGenerator(toList)
				: (evt) => {
					if (Hist.lastLoadedId !== null) {
						const toRender = toList[Hist.lastLoadedId];

						if (evt.shiftKey) {
							const $content = Renderer.hover.$getHoverContent_statsCode(toRender);
							Renderer.hover.getShowWindow(
								$content,
								Renderer.hover.getWindowPositionFromEvent(evt),
								{
									title: `${toRender.name} \u2014 Source Data`,
									isPermanent: true,
									isBookContent: true,
								},
							);
						} else {
							Renderer.hover.doPopout(evt, toList, Hist.lastLoadedId, page);
						}
					}
				},
		);
	},
	$getHoverContent_stats (page, toRender) {
		const renderFn = Renderer.hover._pageToRenderFn(page);
		return $$`<div class="stats pf2-stat">${renderFn(toRender)}</div>`;
	},

	$getHoverContent_fluff (page, toRender) {
		if (!toRender) {
			return $$`<table class="stats"><tr class="text"><td colspan="6" class="p-2 text-center">${Renderer.utils.HTML_NO_INFO}</td></tr></table>`;
		}

		toRender = MiscUtil.copy(toRender);

		if (toRender.images) {
			const cachedImages = toRender.images;
			delete toRender.images;

			toRender.entries = toRender.entries || [];
			const hasText = toRender.entries.length > 0;
			if (hasText) toRender.entries.unshift({ type: "hr" });
			toRender.entries.unshift(...cachedImages.reverse());
		}

		return $$`<div class="stats">${Renderer.generic.getRenderedString(toRender)}</div>`;
	},

	$getHoverContent_statsCode (toRender, dirty) {
		const cleanCopy = dirty ? MiscUtil.copy(toRender) : DataUtil.cleanJson(MiscUtil.copy(toRender));
		return Renderer.hover.$getHoverContent_miscCode(
			`${cleanCopy.name} \u2014 Source Data${dirty ? " (Dev Mode)" : ""}`,
			JSON.stringify(cleanCopy, null, "\t"),
		);
	},

	$getHoverContent_miscCode (name, code) {
		const toRenderCode = {
			type: "code",
			name,
			preformatted: code,
		};
		return $$`<div class="stats stats--book">${Renderer.get().render(toRenderCode)}</div>`;
	},

	$getHoverContent_generic (toRender, opts) {
		opts = opts || {};

		return $$`<div class="stats ${opts.isBookContent || opts.isLargeBookContent ? "pf2-book" : "pf2-stat"} ${opts.isLargeBookContent ? "stats--book-large" : ""}">${Renderer.hover.getGenericCompactRenderedString(toRender)}</div>`;
	},

	doPopout (evt, allEntries, index, page) {
		page = page || UrlUtil.getCurrentPage();
		const it = allEntries[index];
		const $content = Renderer.hover.$getHoverContent_stats(page, it);
		Renderer.hover.getShowWindow(
			$content,
			Renderer.hover.getWindowPositionFromEvent(evt),
			{
				pageUrl: `#${UrlUtil.URL_TO_HASH_BUILDER[page](it)}`,
				title: it._displayName || it.name,
				isPermanent: true,
			},
		);
	},
};

/**
 * Recursively find all the names of entries, useful for indexing
 * @param nameStack an array to append the names to
 * @param entry the base entry
 * @param [opts] Options object.
 * @param [opts.maxDepth] Maximum depth to search for
 * @param [opts.depth] Start depth (used internally when recursing)
 * @param [opts.typeBlacklist] A set of entry types to avoid.
 */
Renderer.getNames = function (nameStack, entry, opts) {
	opts = opts || {};
	if (opts.maxDepth == null) opts.maxDepth = false;
	if (opts.depth == null) opts.depth = 0;

	if (opts.typeBlacklist && entry.type && opts.typeBlacklist.has(entry.type)) return;

	if (opts.maxDepth !== false && opts.depth > opts.maxDepth) return;
	if (entry.name) nameStack.push(Renderer.stripTags(entry.name));
	if (entry.entries) {
		let nextDepth = entry.type === "section" ? -1 : entry.type === "entries" ? opts.depth + 1 : opts.depth;
		for (const eX of entry.entries) {
			const nxtOpts = { ...opts };
			nxtOpts.depth = nextDepth;
			Renderer.getNames(nameStack, eX, nxtOpts);
		}
	} else if (entry.items) {
		for (const eX of entry.items) {
			Renderer.getNames(nameStack, eX, opts);
		}
	}
};

// dig down until we find a name, as feature names can be nested
Renderer.findName = function (entry) {
	function search (it) {
		if (it instanceof Array) {
			for (const child of it) {
				const n = search(child);
				if (n) return n;
			}
		} else if (it instanceof Object) {
			if (it.name) return it.name;
			else {
				for (const child of Object.values(it)) {
					const n = search(child);
					if (n) return n;
				}
			}
		}
	}

	return search(entry);
};

Renderer.stripTags = function (str) {
	if (!str) return str;
	let nxtStr = Renderer._stripTagLayer(str);
	while (nxtStr.length !== str.length) {
		str = nxtStr;
		nxtStr = Renderer._stripTagLayer(str);
	}
	return nxtStr;
};

Renderer._stripTagLayer = function (str) {
	if (str.includes("{@")) {
		const tagSplit = Renderer.splitByTags(str);
		return tagSplit.filter(it => it).map(it => {
			if (it.startsWith("{@")) {
				let [tag, text] = Renderer.splitFirstSpace(it.slice(1, -1));
				text = text.replace(/<\$([^$]+)\$>/gi, ""); // remove any variable tags
				switch (tag) {
					case "@b":
					case "@bold":
                        return '**' + text + '**'
					case "@i":
					case "@italic":
                        return '*' + text + '*'
					case "@handwriting":
					case "@indent":
					case "@indentFirst":
					case "@indentSubsequent":
					case "@s":
					case "@strike":
					case "@u":
					case "@underline":
					case "@c":
					case "@center":
					case "@n":
					case "@nostyle":
					case "@sup":
					case "@sub":
						return text;

					case "@dc":
						return `DC ${text}`;

					case "@as": {
						// TODO
						return text;
					}

					case "@chance":
					case "@d20":
					case "@damage":
					case "@flatDC":
					case "@dice":
					case "@hit": {
						const [rollText, displayText] = Renderer.splitTagByPipe(text);
						switch (tag) {
							case "@damage":
							case "@flatDC":
							case "@dice": {
								return displayText || rollText.replace(/;/g, "/");
							}
							case "@d20":
							case "@hit": {
								return displayText || (() => {
									const n = Number(rollText);
									if (isNaN(n)) {
										throw new Error(`Could not parse "${rollText}" as a number!`)
									}
									return `${n >= 0 ? "+" : ""}${n}`;
								})();
							}
							case "@chance": {
								return displayText || `${rollText} percent`;
							}
						}
						throw new Error(`Unhandled tag: ${tag}`);
					}

					case "@note":
					case "@domain":
					case "@group": {
						return text;
					}
					case "@skill": {
						const parts = Renderer.splitTagByPipe(text);
						if (parts[2] !== undefined) {
							return parts[2]
						} else {
							return parts[0]
						}
					}
					case "@Pf2eTools":
					case "@pf2etools":
					case "@adventure":
					case "@book":
					case "@quickref":
					case "@filter":
					case "@footnote":
					case "@link":
					case "@scaledice":
					case "@scaledamage":
					case "@loader":
					case "@color":
					case "@highlight": {
						const parts = Renderer.splitTagByPipe(text);
						return parts[0];
					}

					case "@area": {
						const [compactText, areaId, flags, ...others] = Renderer.splitTagByPipe(text);

						return flags && flags.includes("x")
							? compactText
							: `${flags && flags.includes("u") ? "A" : "a"}rea ${compactText}`;
					}

					case "@action":
					case "@ability":
					case "@background":
					case "@class":
					case "@condition":
					case "@creature":
					case "@disease":
					case "@affliction":
					case "@feat":
					case "@hazard":
					case "@vehicle":
					case "@item":
					case "@language":
					case "@object":
					case "@ancestry":
					case "@archetype":
					case "@versatileHeritage":
					case "@reward":
					case "@spell":
					case "@status":
					case "@table":
					case "@trait":
					case "@place":
					case "@plane":
					case "@nation":
					case "@ritual":
					case "@settlement":
					case "@deity":
					case "@organization":
					case "@eidolon":
					case "@familiar":
					case "@familiarAbility":
					case "@companion":
					case "@companionAbility":
					case "@optfeature":
					case "@creatureTemplate":
					case "@variantrule": {
						const parts = Renderer.splitTagByPipe(text);
						return parts.length >= 3 ? parts[2] : parts[0];
					}

					case "@classFeature": {
						const parts = Renderer.splitTagByPipe(text);
						return parts.length >= 6 ? parts[5] : parts[0];
					}

					case "@subclassFeature": {
						const parts = Renderer.splitTagByPipe(text);
						return parts.length >= 8 ? parts[7] : parts[0];
					}

					case "@runeItem": {
						const parts = Renderer.splitTagByPipe(text);
						return parts.length % 2 ? parts[parts.length - 1] : parts.push(parts.shift()).map(it => it[0]).map(it => Renderer.runeItem.getRuneShortName(it)).join(" ");
					}

					case "@homebrew": {
						const [newText, oldText] = Renderer.splitTagByPipe(text);
						if (newText && oldText) {
							return `${newText} [this is a homebrew addition, replacing the following: "${oldText}"]`;
						} else if (newText) {
							return `${newText} [this is a homebrew addition]`;
						} else if (oldText) {
							return `[the following text has been removed due to homebrew: ${oldText}]`;
						} else throw new Error(`Homebrew tag had neither old nor new text!`);
					}

					default:
						throw new Error(`Unhandled tag: "${tag}"`);
				}
			} else return it;
		}).join("");
	}
	return str;
};

Renderer.initLazyImageLoaders = function () {
	function onIntersection (obsEntries) {
		obsEntries.forEach(entry => {
			if (entry.intersectionRatio > 0) { // filter observed entries for those that intersect
				Renderer._imageObserver.unobserve(entry.target);
				const $img = $(entry.target);
				$img.attr("src", $img.attr("data-src")).removeAttr("data-src");
			}
		});
	}

	let printListener = null;
	const $images = $(`img[data-src]`);
	const config = {
		rootMargin: "150px 0px", // if the image gets within 150px of the viewport
		threshold: 0.01,
	};

	if (Renderer._imageObserver) {
		Renderer._imageObserver.disconnect();
		window.removeEventListener("beforeprint", printListener);
	}

	Renderer._imageObserver = new IntersectionObserver(onIntersection, config);
	$images.each((i, image) => Renderer._imageObserver.observe(image));

	// If we try to print a page with un-loaded images, attempt to load them all first
	printListener = () => {
		alert(`All images in the page will now be loaded. This may take a while.`);
		$images.each((i, image) => {
			Renderer._imageObserver.unobserve(image);
			const $img = $(image);
			$img.attr("src", $img.attr("data-src")).removeAttr("data-src");
		});
	};
	window.addEventListener("beforeprint", printListener);
};
Renderer._imageObserver = null;

Renderer.HEAD_NEG_1 = "rd__b--0";
Renderer.HEAD_0 = "rd__b--1";
Renderer.HEAD_1 = "rd__b--2";
Renderer.HEAD_2 = "rd__b--3";
Renderer.HEAD_2_SUB_VARIANT = "rd__b--4";
Renderer.DATA_NONE = "data-none";

if (typeof module !== "undefined") {
	module.exports.Renderer = Renderer;
	global.Renderer = Renderer;
} else {
	window.addEventListener("load", async () => {
		// This would fail on seo pages because base url has not been set yet.
		if (!window.hasOwnProperty("_SEO_PAGE")) await Renderer.trait.preloadTraits()
	});
}


//////////////////////////////////////////////////////////////////////////////////////////////////////



module.exports = {
    DataUtil,
    SortUtil,
    Renderer
};
