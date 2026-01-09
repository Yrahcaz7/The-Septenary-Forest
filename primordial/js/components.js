const customComponents = {
	'assimilate-button': {
		props: ['layer'],
		data() { return {canAssimilate, player, assimilationReq, tmp, formatWhole, completeAssimilation} },
		template: template(`<button v-if="canAssimilate(layer) && player.mo.assimilating === layer" :class="{
			mo: true,
			reset: true,
			locked: player[layer].points.lt(assimilationReq[layer]),
			can: player[layer].points.gte(assimilationReq[layer]),
		}" :style="[
			{'margin-left': '16px'},
			(player[layer].points.gte(assimilationReq[layer]) ? {'background-color': tmp.mo.color} : {}),
			tmp[layer].componentStyles['prestige-button'],
		]" v-html="(player[layer].points.gte(assimilationReq[layer]) ? 'Assimilate this layer!' : 'Reach ' + formatWhole(assimilationReq[layer]) + ' ' + tmp[layer].resource + ' to fully Assimilate this layer.')" @click="completeAssimilation(layer)"></button>`),
	},
	'glitch-display-text': {
		props: ['layer', 'data'],
		data() {return {glitchify}},
		template: template(`<span class="instant" v-html="glitchify(data)"></span>`),
	},
	'glitch-upgrades': {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].upgrades" class="upgCol">
			<div v-for="row in (data === undefined ? tmp[layer].upgrades.rows : data)" class="upgRow">
				<template v-for="col in tmp[layer].upgrades.cols">
					<glitch-upgrade v-if="tmp[layer].upgrades[row * 10 + col] !== undefined && tmp[layer].upgrades[row * 10 + col].unlocked" :layer="layer" :data="row * 10 + col" :style="tmp[layer].componentStyles.upgrade"></glitch-upgrade>
				</template>
			</div>
		</div>`),
	},
	'glitch-upgrade': {
		props: ['layer', 'data'],
		data() {return {tmp, buyUpg, hasUpgrade, canAffordUpgrade, layers, glitchify, run, getCurrentlyText, formatWhole}},
		template: template(`<button v-if="tmp[layer].upgrades && tmp[layer].upgrades[data] !== undefined && tmp[layer].upgrades[data].unlocked" :id='"upgrade-" + layer + "-" + data' @click="buyUpg(layer, data)" :class="{
			[layer]: true,
			tooltipBox: true,
			upg: true,
			bought: hasUpgrade(layer, data),
			locked: (!canAffordUpgrade(layer, data) && !hasUpgrade(layer, data)),
			can: (canAffordUpgrade(layer, data) && !hasUpgrade(layer, data)),
		}" :style="[
			(!hasUpgrade(layer, data) && canAffordUpgrade(layer, data) ? {'background-color': tmp[layer].upgrades[data].color ?? tmp[layer].color} : {}),
			tmp[layer].upgrades[data].style
		]">
			<template v-if="tmp[layer].upgrades[data].title">
				<h3 v-html="tmp[layer].upgrades[data].title"></h3><br>
			</template>
			<span v-if="layers[layer].upgrades[data].fullDisplay" v-html="glitchify(run(layers[layer].upgrades[data].fullDisplay, layers[layer].upgrades[data]))"></span>
			<template v-else>
				<span v-html="glitchify(tmp[layer].upgrades[data].description)"></span>
				<template v-if="layers[layer].upgrades[data].effectDisplay">
					<br>
					<span v-html="glitchify(getCurrentlyText())"></span>
					<span v-html="glitchify(run(layers[layer].upgrades[data].effectDisplay, layers[layer].upgrades[data], tmp[layer].upgrades[data].effect))"></span>
				</template><br><br>
				<span v-if="layers[layer].upgrades[data].costDisplay" v-html="glitchify(run(layers[layer].upgrades[data].costDisplay, layers[layer].upgrades[data], tmp[layer].upgrades[data].cost))"></span>
				<span v-else v-html="glitchify('Cost: ' + formatWhole(tmp[layer].upgrades[data].cost) + ' ' + (tmp[layer].upgrades[data].currencyDisplayName || tmp[layer].upgrades[data].currencyInternalName || tmp[layer].resource))"></span>
			</template>
			<tooltip v-if="tmp[layer].upgrades[data].tooltip" v-html="glitchify(tmp[layer].upgrades[data].tooltip)"></tooltip>
		</button>`),
	},
	'glitch-milestones': {
		props: ['layer', 'data'],
		data() {return {tmp, milestoneShown}},
		template: template(`<div v-if="tmp[layer].milestones">
			<table>
				<tbody>
					<template v-for="id in (data === undefined ? Object.keys(tmp[layer].milestones) : data)">
						<tr v-if="tmp[layer].milestones[id] !== undefined && tmp[layer].milestones[id].unlocked && milestoneShown(layer, id)">
							<glitch-milestone :layer="layer" :data="id" :style="tmp[layer].componentStyles.milestone"></glitch-milestone>
						</tr>
					</template>
				</tbody>
			</table><br>
		</div>`),
	},
	'glitch-milestone': {
		props: ['layer', 'data'],
		data() {return {tmp, milestoneShown, hasMilestone, glitchify, run, layers}},
		template: template(`<td v-if="tmp[layer].milestones && tmp[layer].milestones[data] !== undefined && tmp[layer].milestones[data].unlocked && milestoneShown(layer, data)" :style="[tmp[layer].milestones[data].style]" :class="{
			milestone: true,
			tooltipBox: true,
			done: hasMilestone(layer, data),
		}">
			<h3 v-html="tmp[layer].milestones[data].requirementDescription"></h3><br>
			<span v-html="glitchify(run(layers[layer].milestones[data].effectDescription, layers[layer].milestones[data], tmp[layer].milestones[data].effect))"></span><br>
			<tooltip v-if="tmp[layer].milestones[data].tooltip" v-html="glitchify(tmp[layer].milestones[data].tooltip)"></tooltip>
			<template v-if="tmp[layer].milestones[data].toggles && hasMilestone(layer, data)" v-for="toggle in tmp[layer].milestones[data].toggles">
				<glitch-toggle :layer="layer" :data="toggle" :style="tmp[layer].componentStyles.toggle"></glitch-toggle>&nbsp;
			</template>
		</td>`),
	},
	'glitch-toggle': {
		props: ['layer', 'data'],
		data() {return {tmp, toggleAuto, glitchify, formatOpt, player}},
		template: template(`<button class="smallUpg can" :style="{'background-color': tmp[data[0]].color}" v-html="glitchify(formatOpt(player[data[0]][data[1]]))" @click="toggleAuto(data)"></button>`),
	},
	'glitch-prestige-button': {
		props: ['layer'],
		data() {return {tmp, glitchify, prestigeButtonText, doReset}},
		template: template(`<button v-if="(tmp[layer].type !== 'none')" :class="{
			[layer]: true,
			reset: true,
			locked: !tmp[layer].canReset,
			can: tmp[layer].canReset,
		}" :style="[
			(tmp[layer].canReset ? {'background-color': tmp[layer].color} : {}),
			tmp[layer].componentStyles['prestige-button'],
		]" v-html="glitchify(prestigeButtonText(layer))" @click="doReset(layer)"></button>`),
	},
	'glitch-main-display': {
		props: ['layer', 'data'],
		data() {return {player, glitchify, tmp, format, formatWhole, layers, run}},
		computed: {
			extraMainDisplay() {
				if (typeof extraMainDisplay === 'function') return extraMainDisplay(this.layer);
				return "";
			},
			effectDescription() {
				if (layers[this.layer].effectDescription) return run(layers[this.layer].effectDescription, layers[this.layer]);
				return "";
			},
		},
		template: template(`<div>
			<span v-if="player[layer].points.lt('1e1000')" v-html="glitchify('You have ')"></span>
			<h2 :style="{color: tmp[layer].color, 'text-shadow': tmp[layer].color + ' 0px 0px 10px'}">{{data ? format(player[layer].points, data) : formatWhole(player[layer].points)}}</h2>&nbsp;
			<span v-if="extraMainDisplay" v-html="glitchify(extraMainDisplay)"></span>
			<span v-html="glitchify(tmp[layer].resource)"></span>
			<span v-if="effectDescription" v-html="glitchify(', ' + effectDescription)"></span><br><br>
		</div>`),
	},
	'glitch-resource-display': {
		props: ['layer'],
		data() {return {tmp, glitchify, formatWhole, format, player}},
		template: template(`<div style="margin-top: -13px">
			<span v-if="tmp[layer].baseAmount" v-html="glitchify('<br>You have ' + formatWhole(tmp[layer].baseAmount) + ' ' + tmp[layer].baseResource)"></span>
			<span v-if="tmp[layer].passiveGeneration" v-html="glitchify('<br>You are gaining ' + format(tmp[layer].resetGain.times(tmp[layer].passiveGeneration)) + ' ' + tmp[layer].resource + ' per second')"></span>
			<br><br>
			<span v-if="tmp[layer].showBest" v-html="glitchify('Your best ' + tmp[layer].resource + ' is ' + formatWhole(player[layer].best)) + '<br>'"></span>
			<span v-if="tmp[layer].showTotal" v-html="glitchify('You have made a total of ' + formatWhole(player[layer].total) + ' ' + tmp[layer].resource) + '<br>'"></span>
		</div>`),
	},
	'glitch-buyables': {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].buyables" class="upgCol">
			<respec-button v-if="tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)" :layer="layer" :style="[
				{'margin-bottom': '12px'},
				tmp[layer].componentStyles['respec-button'],
			]"></respec-button>
			<div v-for="row in (data === undefined ? tmp[layer].buyables.rows : data)" class="upgRow">
				<template v-for="col in tmp[layer].buyables.cols">
					<glitch-buyable v-if="tmp[layer].buyables[row * 10 + col] !== undefined && tmp[layer].buyables[row * 10 + col].unlocked" :layer="layer" :data="row * 10 + col" style="margin: 0 7px"></glitch-buyable>
				</template><br>
			</div>
		</div>`),
	},
	'glitch-buyable': {
		props: ['layer', 'data'],
		data() {return {tmp, player, interval: false, buyBuyable, layers, glitchify, run, getCurrentlyText, formatWhole, newDecimalInf, time: 0}},
		methods: {
			start() {
				if (!this.interval) {
					this.interval = setInterval((function() {
						if (this.time >= 5) buyBuyable(this.layer, this.data);
						this.time++;
					}).bind(this), 50);
				};
			},
			stop() {
				clearInterval(this.interval);
				this.interval = false;
			  	this.time = 0;
			},
		},
		template: template(`<div v-if="tmp[layer].buyables && tmp[layer].buyables[data] !== undefined && tmp[layer].buyables[data].unlocked" style="display: grid">
			<button :class="{
				buyable: true,
				tooltipBox: true,
				can: tmp[layer].buyables[data].canBuy,
				locked: !tmp[layer].buyables[data].canBuy,
				bought: player[layer].buyables[data].gte(tmp[layer].buyables[data].purchaseLimit),
			}" :style="[
				(tmp[layer].buyables[data].canBuy ? {'background-color': tmp[layer].buyables[data].color ?? tmp[layer].color} : {}),
				tmp[layer].componentStyles.buyable,
				tmp[layer].buyables[data].style,
			]" @click="interval ? null : buyBuyable(layer, data)" :id='"buyable-" + layer + "-" + data' @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart.passive="start" @touchend="stop" @touchcancel="stop">
				<template v-if="tmp[layer].buyables[data].title">
					<h2 v-html="tmp[layer].buyables[data].title"></h2><br>
				</template>
				<span v-if="layers[layer].buyables[data].fullDisplay" style="white-space: pre-line" v-html="glitchify(run(layers[layer].buyables[data].fullDisplay, layers[layer].buyables[data]))"></span>
				<template v-else>
					<span v-html="glitchify(tmp[layer].buyables[data].description)"></span>
					<template v-if="layers[layer].buyables[data].effectDisplay">
						<br><br>
						<span v-html="glitchify(getCurrentlyText())"></span>
						<span v-html="glitchify(run(layers[layer].buyables[data].effectDisplay, layers[layer].buyables[data], tmp[layer].buyables[data].effect))"></span>
					</template><br><br>
					<span v-if="layers[layer].buyables[data].costDisplay" v-html="glitchify(run(layers[layer].buyables[data].costDisplay, layers[layer].buyables[data], tmp[layer].buyables[data].cost))"></span>
					<span v-else v-html="glitchify('Cost: ' + formatWhole(tmp[layer].buyables[data].cost) + ' ' + (tmp[layer].buyables[data].currencyDisplayName || tmp[layer].resource))"></span><br><br>
					<span v-if="layers[layer].buyables[data].boughtDisplay" v-html="glitchify(run(layers[layer].buyables[data].boughtDisplay, layers[layer].buyables[data], player[layer].buyables[data]))"></span>
					<span v-else v-html="glitchify('Bought: ' + formatWhole(player[layer].buyables[data]) + (newDecimalInf().neq(tmp[layer].buyables[data].purchaseLimit) ? '/' + formatWhole(tmp[layer].buyables[data].purchaseLimit) : ''))"></span>
				</template>
				<node-mark :layer="layer" :data='tmp[layer].buyables[data].marked'></node-mark>
				<tooltip v-if="tmp[layer].buyables[data].tooltip" v-html="glitchify(tmp[layer].buyables[data].tooltip)"></tooltip>
			</button>
			<br v-if="(tmp[layer].buyables[data].sellOne && (tmp[layer].buyables[data].canSellOne === undefined || tmp[layer].buyables[data].canSellOne)) || (tmp[layer].buyables[data].sellAll && (tmp[layer].buyables[data].canSellAll === undefined || tmp[layer].buyables[data].canSellAll))">
			<sell-one v-if="tmp[layer].buyables[data].sellOne && (tmp[layer].buyables[data].canSellOne === undefined || tmp[layer].buyables[data].canSellOne)" :layer="layer" :data="data" :style="tmp[layer].componentStyles['sell-one']"></sell-one>
			<sell-all v-if="tmp[layer].buyables[data].sellAll && (tmp[layer].buyables[data].canSellAll === undefined || tmp[layer].buyables[data].canSellAll)" :layer="layer" :data="data" :style="tmp[layer].componentStyles['sell-all']"></sell-all>
		</div>`),
	},
	'glitch-clickable': {
		props: ['layer', 'data'],
		data() {return {tmp, interval: false, clickClickable, glitchify, run, layers, time: 0}},
		methods: {
			start() {
				if (!this.interval && layers[this.layer].clickables[this.data].onHold) {
					this.interval = setInterval((function() {
						const c = layers[this.layer].clickables[this.data];
						if (this.time >= 5 && run(c.canClick, c)) run(c.onHold, c);
						this.time++;
					}).bind(this), 50);
				};
			},
			stop() {
				clearInterval(this.interval);
				this.interval = false;
			  	this.time = 0;
			},
		},
		template: template(`<button v-if="tmp[layer].clickables && tmp[layer].clickables[data] !== undefined && tmp[layer].clickables[data].unlocked" :class="{
			upg: true,
			tooltipBox: true,
			can: tmp[layer].clickables[data].canClick,
			locked: !tmp[layer].clickables[data].canClick,
		}" :style="[
			(tmp[layer].clickables[data].canClick ? {'background-color': tmp[layer].clickables[data].color ?? tmp[layer].color} : {}),
			tmp[layer].clickables[data].style,
		]" @click="interval ? null : clickClickable(layer, data)" :id='"clickable-" + layer + "-" + data' @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart.passive="start" @touchend="stop" @touchcancel="stop">
			<template v-if="tmp[layer].clickables[data].title">
				<h2 v-html="tmp[layer].clickables[data].title"></h2><br>
			</template>
			<span style="white-space: pre-line" v-html="glitchify(run(layers[layer].clickables[data].display, layers[layer].clickables[data]))"></span>
			<node-mark :layer="layer" :data='tmp[layer].clickables[data].marked'></node-mark>
			<tooltip v-if="tmp[layer].clickables[data].tooltip" v-html="glitchify(tmp[layer].clickables[data].tooltip)"></tooltip>
		</button>`),
	},
	'glitch-achievements': {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].achievements" class="upgCol">
			<div v-for="row in (data === undefined ? tmp[layer].achievements.rows : data)" class="upgRow">
				<template v-for="col in tmp[layer].achievements.cols">
					<glitch-achievement v-if="tmp[layer].achievements[row * 10 + col] !== undefined && tmp[layer].achievements[row * 10 + col].unlocked" :layer="layer" :data="row * 10 + col" :style="tmp[layer].componentStyles.achievement"></glitch-achievement>
				</template>
			</div>
		</div>`),
	},
	'glitch-achievement': {
		props: ['layer', 'data'],
		data() {return {tmp, hasAchievement, achievementStyle, glitchify}},
		computed: {
			tooltipText() {
				if (tmp[this.layer].achievements[this.data].tooltip == '') return false;
				if (hasAchievement(this.layer, this.data)) {
					if (tmp[this.layer].achievements[this.data].doneTooltip) return tmp[this.layer].achievements[this.data].doneTooltip;
					if (tmp[this.layer].achievements[this.data].tooltip) return tmp[this.layer].achievements[this.data].tooltip;
					return 'You did it!';
				};
				if (tmp[this.layer].achievements[this.data].goalTooltip) return tmp[this.layer].achievements[this.data].goalTooltip;
				if (tmp[this.layer].achievements[this.data].tooltip) return tmp[this.layer].achievements[this.data].tooltip;
				return 'LOCKED';
			},
		},
		template: template(`<div v-if="tmp[layer].achievements && tmp[layer].achievements[data] !== undefined && tmp[layer].achievements[data].unlocked" :class="{
			[layer]: true,
			achievement: true,
			tooltipBox: true,
			locked: !hasAchievement(layer, data),
			bought: hasAchievement(layer, data),
		}" :style="achievementStyle(layer, data)">
			<tooltip v-html="glitchify(tooltipText)"></tooltip>
			<span v-if="tmp[layer].achievements[data].name">
				<br><h3 :style="tmp[layer].achievements[data].textStyle" v-html="glitchify(tmp[layer].achievements[data].name)"></h3><br>
			</span>
		</div>`),
	},
};
