let app;

// removes newlines and tabs from a string to allow formatting templates
function template(str) {
	return str.replace(/[\n\t]/g, "");
};

function loadVue() {
	app = Vue.createApp({
		data() {return {tmp, player, modInfo, VERSION, formatTime, hardReset, keepGoing, readData, layoutInfo, resizeCanvas, showTab, goBack, OTHER_LAYERS, activePopups, particles, LAYERS}},
	});

	// data = a function returning the content (actually HTML)
	app.component('display-text', {
		props: ['layer', 'data'],
		template: template(`<span class="instant" v-html="data"></span>`),
	});

	// data = a function returning the content (actually HTML)
	app.component('raw-html', {
		props: ['layer', 'data'],
		template: template(`<span class="instant" v-html="data"></span>`),
	});

	// data = a function returning the content (actually HTML)
	app.component('custom-resource-display', {
		props: ['layer', 'data'],
		template: template(`<div class="instant" style="margin-top: -13px" v-html="'<br>' + (typeof data === 'function' ? data() : data)"></div>`),
	});

	// Blank space, data = optional height in px or [width in px, height in px]
	app.component('blank', {
		props: ['layer', 'data'],
		template: template(`<div class="instant">
			<div class="instant" v-if="!data" :style="{'width': '8px', 'height': '17px'}"></div>
			<div class="instant" v-else-if="Array.isArray(data)" :style="{'width': data[0], 'height': data[1]}"></div>
			<div class="instant" v-else :style="{'width': '8px', 'height': data}"><br></div>
		</div>`),
	});

	// Displays an image, data is the URL
	app.component('display-image', {
		props: ['layer', 'data'],
		template: template(`<img class="instant" :src="data" :alt="data">`),
	});
		
	// data = an array of components to be displayed in a row
	app.component('row', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div class="upgTable instant">
			<div class="upgRow">
				<div v-for="(item, index) in data">
					<component v-if="!Array.isArray(item)" :is="item" :layer="layer" :style="tmp[layer].componentStyles[item]"></component>
					<component v-else-if="item.length == 3" :is="item[0]" :layer="layer" :data="item[1]" :style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]"></component>
					<component v-else-if="item.length == 2" :is="item[0]" :layer="layer" :data="item[1]" :style="tmp[layer].componentStyles[item[0]]"></component>
				</div>
			</div>
		</div>`),
	});

	// data = an array of components to be displayed in a column
	app.component('column', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div class="upgTable instant">
			<div class="upgCol">
				<template v-for="item in data">
					<template v-if="item">
						<component v-if="!Array.isArray(item)" :is="item" :layer="layer" :style="tmp[layer].componentStyles[item]"></component>
						<component v-else-if="item.length == 2" :is="item[0]" :layer="layer" :data="item[1]" :style="tmp[layer].componentStyles[item[0]]"></component>
						<component v-else-if="item.length == 3" :is="item[0]" :layer="layer" :data="item[1]" :style="[
							tmp[layer].componentStyles[item[0]],
							(item[2] ? item[2] : {}),
						]"></component>
					</template>
				</template>
			</div>
		</div>`),
	});

	// data [other layer, tabformat for within proxy]
	app.component('layer-proxy', {
		props: ['layer', 'data'],
		template: template(`<div><column :layer="data[0]" :data="data[1]"></column></div>`),
	});

	app.component('infobox', {
		props: ['layer', 'data'],
		data() {return {tmp, player}},
		template: template(`<div class="story instant" v-if="tmp[layer].infoboxes && tmp[layer].infoboxes[data] !== undefined && tmp[layer].infoboxes[data].unlocked" :style="[{
			'border-bottom-style': (player.infoboxes[layer][data] ? 'solid' : 'none'),
			'border-color': tmp[layer].color,
			'border-radius': (player.infoboxes[layer][data] ? 0 : '8px'),
		}, tmp[layer].infoboxes[data].style]">
			<button class="story-title" :style="[{'background-color': tmp[layer].color}, tmp[layer].infoboxes[data].titleStyle]" v-on:click="player.infoboxes[layer][data] = !player.infoboxes[layer][data]">
				<span class="story-toggle">{{player.infoboxes[layer][data] ? "+" : "-"}}</span>
				<span v-html="tmp[layer].infoboxes[data].title ? tmp[layer].infoboxes[data].title : (tmp[layer].name)"></span>
			</button>
			<div v-if="!player.infoboxes[layer][data]" class="story-text" :style="tmp[layer].infoboxes[data].bodyStyle">
				<span v-html="tmp[layer].infoboxes[data].body ? tmp[layer].infoboxes[data].body : 'Blah'"></span>
			</div>
		</div>`),
	});

	// Data = width in px, by default fills the full area
	app.component('h-line', {
		props: ['layer', 'data'],
		template: template(`<hr class="instant" :style="data ? {'width': data} : {}" class="hl">`),
	});

	// Data = height in px, by default is bad
	app.component('v-line', {
		props: ['layer', 'data'],
		template: template(`<div class="instant" :style="data ? {'height': data} : {}" class="vl"></div>`),
	});

	app.component('challenges', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].challenges" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].challenges.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].challenges.cols">
					<challenge v-if="tmp[layer].challenges[row * 10 + col] !== undefined && tmp[layer].challenges[row * 10 + col].unlocked" :layer="layer" :data="row * 10 + col" :style="tmp[layer].componentStyles.challenge"></challenge>
				</div>
			</div>
		</div>`),
	});

	// data = id
	app.component('challenge', {
		props: ['layer', 'data'],
		data() {return {tmp, options, maxedChallenge, inChallenge, challengeStyle, player, canUseChallenge, startChallenge, challengeButtonText, layers, run, format, modInfo}},
		template: template(`<div v-if="tmp[layer].challenges && tmp[layer].challenges[data] !== undefined && tmp[layer].challenges[data].unlocked && !(options.hideChallenges && maxedChallenge(layer, data) && !inChallenge(layer, data))" :class="[
			'challenge',
			challengeStyle(layer, data),
			(player[layer].activeChallenge === data ? 'resetNotify' : ''),
		]" :style="tmp[layer].challenges[data].style">
			<br>
			<h3 v-html="tmp[layer].challenges[data].name"></h3><br><br>
			<button :class="{longUpg: true, can: canUseChallenge(layer, data), [layer]: true}" :style="{'background-color': tmp[layer].color}" v-on:click="startChallenge(layer, data)">{{challengeButtonText(layer, data)}}</button><br><br>
			<span v-if="layers[layer].challenges[data].fullDisplay" v-html="run(layers[layer].challenges[data].fullDisplay, layers[layer].challenges[data])"></span>
			<span v-else>
				<span v-html="tmp[layer].challenges[data].challengeDescription"></span><br>
				Goal: <span v-if="tmp[layer].challenges[data].goalDescription" v-html="tmp[layer].challenges[data].goalDescription"></span>
				<span v-else>{{format(tmp[layer].challenges[data].goal)}} {{tmp[layer].challenges[data].currencyDisplayName ? tmp[layer].challenges[data].currencyDisplayName : modInfo.pointsName}}</span><br>
				Reward: <span v-html="tmp[layer].challenges[data].rewardDescription"></span><br>
				<span v-if="layers[layer].challenges[data].rewardDisplay !== undefined">Currently: <span v-html="tmp[layer].challenges[data].rewardDisplay ? run(layers[layer].challenges[data].rewardDisplay, layers[layer].challenges[data]) : format(tmp[layer].challenges[data].rewardEffect)"></span></span>
			</span>
			<node-mark :layer="layer" :data='tmp[layer].challenges[data].marked' :offset="20" :scale="1.5"></node-mark>
		</div>`),
	});

	app.component('upgrades', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].upgrades" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].upgrades.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].upgrades.cols">
					<div v-if="tmp[layer].upgrades[row * 10 + col] !== undefined && tmp[layer].upgrades[row * 10 + col].unlocked" class="upgAlign">
						<upgrade :layer="layer" :data="row * 10 + col" :style="tmp[layer].componentStyles.upgrade"></upgrade>
					</div>
				</div>
			</div><br>
		</div>`),
	});

	// data = id
	app.component('upgrade', {
		props: ['layer', 'data'],
		data() {return {tmp, buyUpg, hasUpgrade, canAffordUpgrade, layers, run, formatWhole}},
		template: template(`<button v-if="tmp[layer].upgrades && tmp[layer].upgrades[data] !== undefined && tmp[layer].upgrades[data].unlocked" :id='"upgrade-" + layer + "-" + data' v-on:click="buyUpg(layer, data)" :class="{
			[layer]: true,
			tooltipBox: true,
			upg: true,
			bought: hasUpgrade(layer, data),
			locked: (!canAffordUpgrade(layer, data) && !hasUpgrade(layer, data)),
			can: (canAffordUpgrade(layer, data) && !hasUpgrade(layer, data)),
		}" :style="[
			(!hasUpgrade(layer, data) && canAffordUpgrade(layer, data) ? {'background-color': tmp[layer].color} : {}),
			tmp[layer].upgrades[data].style
		]">
			<span v-if="layers[layer].upgrades[data].fullDisplay" v-html="run(layers[layer].upgrades[data].fullDisplay, layers[layer].upgrades[data])"></span>
			<span v-else>
				<span v-if="tmp[layer].upgrades[data].title"><h3 v-html="tmp[layer].upgrades[data].title"></h3><br></span>
				<span v-html="tmp[layer].upgrades[data].description"></span>
				<span v-if="layers[layer].upgrades[data].effectDisplay"><br>Currently: <span v-html="run(layers[layer].upgrades[data].effectDisplay, layers[layer].upgrades[data])"></span></span><br><br>
				Cost: {{formatWhole(tmp[layer].upgrades[data].cost)}} {{(tmp[layer].upgrades[data].currencyDisplayName ? tmp[layer].upgrades[data].currencyDisplayName : tmp[layer].resource)}}
			</span>
			<tooltip v-if="tmp[layer].upgrades[data].tooltip" :text="tmp[layer].upgrades[data].tooltip"></tooltip>
		</button>`),
	});

	app.component('milestones', {
		props: ['layer', 'data'],
		data() {return {tmp, milestoneShown}},
		template: template(`<div v-if="tmp[layer].milestones">
			<table>
				<tbody>
					<template v-for="id in (data === undefined ? Object.keys(tmp[layer].milestones) : data)">
						<tr v-if="tmp[layer].milestones[id] !== undefined && tmp[layer].milestones[id].unlocked && milestoneShown(layer, id)">
							<milestone :layer="layer" :data="id" :style="tmp[layer].componentStyles.milestone"></milestone>
						</tr>
					</template>
				</tbody>
			</table><br>
		</div>`),
	});

	// data = id
	app.component('milestone', {
		props: ['layer', 'data'],
		data() {return {tmp, milestoneShown, hasMilestone, run, layers}},
		template: template(`<td v-if="tmp[layer].milestones && tmp[layer].milestones[data] !== undefined && tmp[layer].milestones[data].unlocked && milestoneShown(layer, data)" :style="[tmp[layer].milestones[data].style]" :class="{
			milestone: true,
			tooltipBox: true,
			done: hasMilestone(layer, data),
		}">
			<h3 v-html="tmp[layer].milestones[data].requirementDescription"></h3><br>
			<span v-html="run(layers[layer].milestones[data].effectDescription, layers[layer].milestones[data])"></span><br>
			<tooltip v-if="tmp[layer].milestones[data].tooltip" :text="tmp[layer].milestones[data].tooltip"></tooltip>
			<span v-if="tmp[layer].milestones[data].toggles && hasMilestone(layer, data)" v-for="toggle in tmp[layer].milestones[data].toggles">
				<toggle :layer="layer" :data="toggle" :style="tmp[layer].componentStyles.toggle"></toggle>&nbsp;
			</span>
		</td>`),
	});

	app.component('toggle', {
		props: ['layer', 'data'],
		data() {return {tmp, toggleAuto, player}},
		template: template(`<button class="smallUpg can" :style="{'background-color': tmp[data[0]].color}" v-on:click="toggleAuto(data)">{{player[data[0]][data[1]] ? "ON" : "OFF"}}</button>`),
	});

	app.component('prestige-button', {
		props: ['layer'],
		data() {return {tmp, prestigeButtonText, doReset}},
		template: template(`<button v-if="(tmp[layer].type !== 'none')" :class="{
			[layer]: true,
			reset: true,
			locked: !tmp[layer].canReset,
			can: tmp[layer].canReset,
		}" :style="[
			(tmp[layer].canReset ? {'background-color': tmp[layer].color} : {}),
			tmp[layer].componentStyles['prestige-button'],
		]" v-html="prestigeButtonText(layer)" v-on:click="doReset(layer)"></button>`),
	});

	app.component('assimilate-button', {
		props: ['layer'],
		data() {return {canAssimilate, player, assimilationReq, tmp, completeAssimilation}},
		template: template(`<button v-if="canAssimilate(layer) && player.mo.assimilating === layer" :class="{
			mo: true,
			reset: true,
			locked: player[layer].points.lt(assimilationReq[layer]),
			can: player[layer].points.gte(assimilationReq[layer]),
		}" :style="[
			{'margin-left': '16px'},
			(player[layer].points.gte(assimilationReq[layer]) ? {'background-color': tmp.mo.color} : {}),
			tmp[layer].componentStyles['prestige-button'],
		]" v-html="(player[layer].points.gte(assimilationReq[layer]) ? 'Assimilate this layer!' : 'Reach ' + format(assimilationReq[layer]) + ' ' + tmp[layer].resource + ' to fully Assimilate this layer.')" v-on:click="completeAssimilation(layer)"></button>`),
	});

	// Displays the main resource for the layer
	app.component('main-display', {
		props: ['layer', 'data'],
		data() {return {player, tmp, format, formatWhole, extraMainDisplay, layers, run}},
		template: template(`<div>
			<span v-if="player[layer].points.lt('1e1000')">You have&nbsp;</span>
			<h2 :style="{'color': tmp[layer].color, 'text-shadow': '0px 0px 10px' + tmp[layer].color}">{{data ? format(player[layer].points, data) : formatWhole(player[layer].points)}}</h2>&nbsp;
			<span v-if="typeof extraMainDisplay === 'function' && extraMainDisplay(layer)" v-html="extraMainDisplay(layer)"></span>
			{{tmp[layer].resource}}
			<span v-if="layers[layer].effectDescription">
				,&nbsp;
				<span v-html="run(layers[layer].effectDescription, layers[layer])"></span>
			</span><br><br>
		</div>`),
	});

	// Displays the base resource for the layer, as well as the best and total values for the layer's currency, if tracked
	app.component('resource-display', {
		props: ['layer'],
		data() {return {tmp, formatWhole, format, player}},
		template: template(`<div style="margin-top: -13px">
			<span v-if="tmp[layer].baseAmount"><br>You have {{formatWhole(tmp[layer].baseAmount)}} {{tmp[layer].baseResource}}</span>
			<span v-if="tmp[layer].passiveGeneration"><br>You are gaining {{format(tmp[layer].resetGain.times(tmp[layer].passiveGeneration))}} {{tmp[layer].resource}} per second</span>
			<br><br>
			<span v-if="tmp[layer].showBest">Your best {{tmp[layer].resource}} is {{formatWhole(player[layer].best)}}<br></span>
			<span v-if="tmp[layer].showTotal">You have made a total of {{formatWhole(player[layer].total)}} {{tmp[layer].resource}}<br></span>
		</div>`),
	});

	app.component('buyables', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].buyables" class="upgTable">
			<respec-button v-if="tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)" :layer="layer" :style="[
				{'margin-bottom': '12px'},
				tmp[layer].componentStyles['respec-button'],
			]"></respec-button>
			<div v-for="row in (data === undefined ? tmp[layer].buyables.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].buyables.cols">
					<div v-if="tmp[layer].buyables[row * 10 + col] !== undefined && tmp[layer].buyables[row * 10 + col].unlocked" class="upgAlign" :style="{
						'margin-left': '7px',
						'margin-right': '7px',
						'height': (data ? data : 'inherit'),
					}">
						<buyable :layer="layer" :data="row * 10 + col"></buyable>
					</div>
				</div><br>
			</div>
		</div>`),
	});

	app.component('buyable', {
		props: ['layer', 'data'],
		data() {return {tmp, player, interval: false, buyBuyable, run, layers, time: 0}},
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
				(tmp[layer].buyables[data].canBuy ? {'background-color': tmp[layer].color} : {}),
				tmp[layer].componentStyles.buyable,
				tmp[layer].buyables[data].style,
			]" v-on:click="interval ? null : buyBuyable(layer, data)" :id='"buyable-" + layer + "-" + data' @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
				<span v-if="tmp[layer].buyables[data].title">
					<h2 v-html="tmp[layer].buyables[data].title"></h2><br>
				</span>
				<span :style="{'white-space': 'pre-line'}" v-html="run(layers[layer].buyables[data].display, layers[layer].buyables[data])"></span>
				<node-mark :layer="layer" :data='tmp[layer].buyables[data].marked'></node-mark>
				<tooltip v-if="tmp[layer].buyables[data].tooltip" :text="tmp[layer].buyables[data].tooltip"></tooltip>
			</button>
			<br v-if="(tmp[layer].buyables[data].sellOne && (tmp[layer].buyables[data].canSellOne === undefined || tmp[layer].buyables[data].canSellOne)) || (tmp[layer].buyables[data].sellAll && (tmp[layer].buyables[data].canSellAll === undefined || tmp[layer].buyables[data].canSellAll))">
			<sell-one v-if="tmp[layer].buyables[data].sellOne && (tmp[layer].buyables[data].canSellOne === undefined || tmp[layer].buyables[data].canSellOne)" :layer="layer" :data="data" :style="tmp[layer].componentStyles['sell-one']"></sell-one>
			<sell-all v-if="tmp[layer].buyables[data].sellAll && (tmp[layer].buyables[data].canSellAll === undefined || tmp[layer].buyables[data].canSellAll)" :layer="layer" :data="data" :style="tmp[layer].componentStyles['sell-all']"></sell-all>
		</div>`),
	});

	app.component('respec-button', {
		props: ['layer'],
		data() {return {tmp, player, respecBuyables}},
		template: template(`<div v-if="tmp[layer].buyables && tmp[layer].buyables.respec && (tmp[layer].buyables.showRespec === undefined || tmp[layer].buyables.showRespec)">
			<div class="tooltipBox respecCheckbox">
				<input type="checkbox" v-model="player[layer].noRespecConfirm">
				<tooltip :text="'Disable respec confirmation'"></tooltip>
			</div>
			<button v-on:click="respecBuyables(layer)" :class="{longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked}" style="margin-right: 18px">{{tmp[layer].buyables.respecText ? tmp[layer].buyables.respecText : "Respec"}}</button>
		</div>`),
	});
	
	app.component('clickables', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].clickables" class="upgTable">
			<master-button v-if="tmp[layer].clickables.masterButtonPress && (tmp[layer].clickables.showMasterButton === undefined || tmp[layer].clickables.showMasterButton)" :layer="layer" :style="[
				{'margin-bottom': '12px'},
				tmp[layer].componentStyles['master-button'],
			]"></master-button>
			<div v-for="row in (data === undefined ? tmp[layer].clickables.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].clickables.cols">
					<div v-if="tmp[layer].clickables[row * 10 + col] !== undefined && tmp[layer].clickables[row * 10 + col].unlocked" class="upgAlign" :style="{
						'margin-left': '7px',
						'margin-right': '7px',
						'height': (data ? data : 'inherit'),
					}">
						<clickable :layer="layer" :data="row * 10 + col" :style="tmp[layer].componentStyles.clickable"></clickable>
					</div>
				</div>
				<br>
			</div>
		</div>`),
	});

	// data = id of clickable
	app.component('clickable', {
		props: ['layer', 'data'],
		data() {return {tmp, interval: false, clickClickable, run, layers, time: 0}},
		methods: {
			start() {
				if (!this.interval && layers[this.layer].clickables[this.data].onHold) {
					this.interval = setInterval((function() {
						let c = layers[this.layer].clickables[this.data];
						if (this.time >= 5 && run(c.canClick, c)) run(c.onHold, c);
						this.time++;
					}).bind(this), 50)
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
			(tmp[layer].clickables[data].canClick ? {'background-color': tmp[layer].color} : {}),
			tmp[layer].clickables[data].style,
		]" v-on:click="interval ? null : clickClickable(layer, data)" :id='"clickable-" + layer + "-" + data' @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
			<span v-if="tmp[layer].clickables[data].title">
				<h2 v-html="tmp[layer].clickables[data].title"></h2><br>
			</span>
			<span style="white-space: pre-line" v-html="run(layers[layer].clickables[data].display, layers[layer].clickables[data])"></span>
			<node-mark :layer="layer" :data='tmp[layer].clickables[data].marked'></node-mark>
			<tooltip v-if="tmp[layer].clickables[data].tooltip" :text="tmp[layer].clickables[data].tooltip"></tooltip>
		</button>`),
	})

	app.component('master-button', {
		props: ['layer'],
		data() {return {tmp, run, player}},
		template: template(`<button v-if="tmp[layer].clickables && tmp[layer].clickables.masterButtonPress && (tmp[layer].clickables.showMasterButton === undefined || tmp[layer].clickables.showMasterButton)" v-on:click="run(tmp[layer].clickables.masterButtonPress, tmp[layer].clickables)" :class="{
			longUpg: true,
			can: player[layer].unlocked,
			locked: !player[layer].unlocked,
		}">{{tmp[layer].clickables.masterButtonText ? tmp[layer].clickables.masterButtonText : "Click me!"}}</button>`),
	});

	// data = optionally, array of rows for the grid to show
	app.component('grid', {
		props: ['layer', 'data'],
		data() {return {tmp, run, layers}},
		template: template(`<div v-if="tmp[layer].grid" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].grid.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].grid.cols">
					<div v-if="run(layers[layer].grid.getUnlocked, layers[layer].grid, row * 100 + col)" class="upgAlign" style="margin: 1px; height: inherit">
						<gridable :layer="layer" :data="row * 100 + col" :style="tmp[layer].componentStyles.gridable"></gridable>
					</div>
				</div><br>
			</div>
		</div>`),
	});

	// data = the max width of the grid or [max width, array of rows]
	app.component('contained-grid', {
		props: ['layer', 'data'],
		data() {return {tmp, run, layers}},
		template: template(`<div v-if="tmp[layer].grid" class="upgTable" :style="{
			'width': 'fit-content',
			'max-width': (Array.isArray(data) ? data[0] : data),
			'overflow': 'auto',
			'overscroll-behavior-x': 'none',
		}">
			<div v-for="row in (Array.isArray(data) ? data[1] : Math.min(tmp[layer].grid.rows, tmp[layer].grid.maxRows))" class="upgRow" style="max-width: none; flex-wrap: nowrap; justify-content: initial">
				<div v-for="col in Math.min(tmp[layer].grid.cols, tmp[layer].grid.maxCols)">
					<div v-if="run(layers[layer].grid.getUnlocked, layers[layer].grid, row * 100 + col)" class="upgAlign" style="margin: 1px; height: inherit">
						<gridable :layer="layer" :data="row * 100 + col" :style="tmp[layer].componentStyles.gridable"></gridable>
					</div>
				</div><br>
			</div>
		</div>`),
	});

	app.component('gridable', {
		props: ['layer', 'data'],
		data() {return {tmp, player, run, layers, gridRun, clickGrid, interval: false, time: 0}},
		computed: {
			canClick() {
				return gridRun(this.layer, 'getCanClick', player[this.layer].grid[this.data], this.data);
			},
		},
		methods: {
			start() {
				if (!this.interval && layers[this.layer].grid.onHold) {
					this.interval = setInterval((function() {
						if (this.time >= 5 && gridRun(this.layer, 'getCanClick', player[this.layer].grid[this.data], this.data)) {
							gridRun(this.layer, 'onHold', player[this.layer].grid[this.data], this.data);
						};
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
		template: template(`<button v-if="tmp[layer].grid && player[layer].grid[data] !== undefined && run(layers[layer].grid.getUnlocked, layers[layer].grid, data)" :class="{
			tile: true,
			can: canClick,
			locked: !canClick,
			tooltipBox: true,
		}" :style="[
			(canClick ? {'background-color': tmp[layer].color} : {}),
			gridRun(layer, 'getStyle', player[this.layer].grid[this.data], this.data),
		]" v-on:click="clickGrid(layer, data)" @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
			<span v-if="layers[layer].grid.getTitle">
				<h3 v-html="gridRun(this.layer, 'getTitle', player[this.layer].grid[this.data], this.data)"></h3><br>
			</span>
			<span style="white-space: pre-line" v-html="gridRun(this.layer, 'getDisplay', player[this.layer].grid[this.data], this.data)"></span>
			<tooltip v-if="layers[layer].grid.getTooltip" :text="gridRun(this.layer, 'getTooltip', player[this.layer].grid[this.data], this.data)"></tooltip>
		</button>`),
	})

	// data = id of microtab family
	app.component('microtabs', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		computed: {
			currentTab() {return player.subtabs[layer][data]},
		},
		template: template(`<div v-if="tmp[layer].microtabs" style="border-style: solid">
			<div class="upgTable instant">
				<tab-buttons :layer="layer" :data="tmp[layer].microtabs[data]" :name="data" :style="tmp[layer].componentStyles['tab-buttons']"></tab-buttons>
			</div>
			<layer-tab v-if="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :layer="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :embedded="true"></layer-tab>
			<column v-else :style="tmp[layer].microtabs[data][player.subtabs[layer][data]].style" :layer="layer" :data="tmp[layer].microtabs[data][player.subtabs[layer][data]].content"></column>
		</div>`),
	});

	// data = id of the bar
	app.component('bar', {
		props: ['layer', 'data'],
		data() {return {tmp, run, layers}},
		computed: {
			style() {return constructBarStyle(this.layer, this.data)},
		},
		template: template(`<div v-if="tmp[layer].bars && tmp[layer].bars[data].unlocked" style="position: relative">
			<div :style="[
				tmp[layer].bars[data].style,
				style.dims,
				{'display': 'table'},
			]">
				<div class="overlayTextContainer barBorder" :style="[
					tmp[layer].bars[data].borderStyle,
					style.dims,
				]">
					<span class="overlayText" :style="[
						tmp[layer].bars[data].style,
						tmp[layer].bars[data].textStyle,
					]" v-html="run(layers[layer].bars[data].display, layers[layer].bars[data])"></span>
				</div>
				<div class="barBG barBorder" :style="[
					tmp[layer].bars[data].style,
					tmp[layer].bars[data].baseStyle,
					tmp[layer].bars[data].borderStyle,
					style.dims,
				]">
					<div class="fill" :style="[
						tmp[layer].bars[data].style,
						tmp[layer].bars[data].fillStyle,
						style.fillDims,
					]"></div>
				</div>
			</div>
		</div>`),
	});

	app.component('achievements', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].achievements" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].achievements.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].achievements.cols">
					<div v-if="tmp[layer].achievements[row * 10 + col] !== undefined && tmp[layer].achievements[row * 10 + col].unlocked" class="upgAlign">
						<achievement :layer="layer" :data="row * 10 + col" :style="tmp[layer].componentStyles.achievement"></achievement>
					</div>
				</div>
			</div><br>
		</div>`),
	});

	// data = id
	app.component('achievement', {
		props: ['layer', 'data'],
		data() {return {tmp, hasAchievement, achievementStyle}},
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
			<tooltip :text="tooltipText"></tooltip>
			<span v-if="tmp[layer].achievements[data].name">
				<br><h3 :style="tmp[layer].achievements[data].textStyle" v-html="tmp[layer].achievements[data].name"></h3><br>
			</span>
		</div>`),
	});

	// Data is an array with the structure of the tree
	app.component('tree', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div>
			<span class="upgRow" v-for="row in data">
				<table>
					<span v-for="node in row" style="width: 0px">
						<tree-node :layer='node' :prev='layer' :abb='tmp[node].symbol'></tree-node>
					</span>
					<tbody>
						<tr>
							<td>
								<button class="treeNode hidden"></button>
							</td>
						</tr>
					</tbody>
				</table>
			</span>
		</div>`),
	});

	// Data is an array with the structure of the tree
	app.component('upgrade-tree', {
		props: ['layer', 'data'],
		template: template(`<thing-tree :layer="layer" :data="data" :type="'upgrade'"></thing-tree>`),
	})

	// Data is an array with the structure of the tree
	app.component('buyable-tree', {
		props: ['layer', 'data'],
		template: template(`<thing-tree :layer="layer" :data="data" :type="'buyable'"></thing-tree>`),
	})

	// Data is an array with the structure of the tree
	app.component('clickable-tree', {
		props: ['layer', 'data'],
		template: template(`<thing-tree :layer="layer" :data="data" :type="'clickable'"></thing-tree>`),
	})

	// Data is an array with the structure of the tree
	app.component('thing-tree', {
		props: ['layer', 'data', 'type'],
		data() {return {tmp}},
		template: template(`<div>
			<span class="upgRow" v-for="row in data">
				<table>
					<span v-for="id in row" style="width: 0; height: 0" class="upgAlign">
						<component v-if="tmp[layer][type + 's'][id] !== undefined && tmp[layer][type + 's'][id].unlocked" :is="type" :layer="layer" :data="id" :style="tmp[layer].componentStyles[type]" class="treeThing"></component>
					</span>
					<tbody>
						<tr>
							<td>
								<button class="treeNode hidden"></button>
							</td>
						</tr>
					</tbody>
				</table>
			</span>
		</div>`),
	});

	// Updates the value in player[layer][data]
	app.component('text-input', {
		props: ['layer', 'data'],
		data() {return {player, focused, toValue}},
		template: template(`<input class="instant" :id="'input-' + layer + '-' + data" :value="player[layer][data].toString()" v-on:focus="focused = true" v-on:blur="focused = false" v-on:change="player[layer][data] = toValue(document.getElementById('input-' + layer + '-' + data).value, player[layer][data])">`),
	});

	// Updates the value in player[layer][data][0]
	app.component('slider', {
		props: ['layer', 'data'],
		data() {return {player}},
		template: template(`<div class="tooltipBox">
			<tooltip :text="player[layer][data[0]]"></tooltip>
			<input type="range" v-model="player[layer][data[0]]" :min="data[1]" :max="data[2]">
		</div>`),
	});

	// Updates the value in player[layer][data[0]], options are an array in data[1]
	app.component('drop-down', {
		props: ['layer', 'data'],
		data() {return {player}},
		template: template(`<select v-model="player[layer][data[0]]">
			<option v-for="item in data[1]" :value="item">{{item}}</option>
		</select>`),
	});

	// These are for buyables, data is the id of the corresponding buyable
	app.component('sell-one', {
		props: ['layer', 'data'],
		data() {return {tmp, run, player}},
		template: template(`<button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellOne && (tmp[layer].buyables[data].canSellOne === undefined || tmp[layer].buyables[data].canSellOne)" v-on:click="run(tmp[layer].buyables[data].sellOne, tmp[layer].buyables[data])" :class="{
			longUpg: true,
			can: player[layer].unlocked,
			locked: !player[layer].unlocked,
		}">{{tmp[layer].buyables.sellOneText ? tmp[layer].buyables.sellOneText : "Sell One"}}</button>`),
	});
	
	app.component('sell-all', {
		props: ['layer', 'data'],
		data() {return {tmp, run, player}},
		template: template(`<button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellAll && (tmp[layer].buyables[data].canSellAll === undefined || tmp[layer].buyables[data].canSellAll)" v-on:click="run(tmp[layer].buyables[data].sellAll, tmp[layer].buyables[data])" :class="{
			longUpg: true,
			can: player[layer].unlocked,
			locked: !player[layer].unlocked,
		}">{{tmp[layer].buyables.sellAllText ? tmp[layer].buyables.sellAllText : "Sell All"}}</button>`),
	});

	// system components

	app.component('node-mark', {
		props: {layer: {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: template(`<div v-if='data'>
			<div v-if='data === true' class='star' :style='{
				position: "absolute",
				left: (offset - 10) + "px",
				top: (offset - 10) + "px",
				transform: "scale(" + (scale || 1) + "," + (scale || 1) + ")",
			}'></div>
			<img v-else class='mark' :style='{
				position: "absolute",
				left: (offset - 22) + "px",
				top: (offset - 15) + "px",
				transform: "scale(" + (scale || 1) + "," + (scale || 1) + ")",
			}' :src="data">
		</div>`),
	});

	app.component('tab-buttons', {
		props: ['layer', 'data', 'name'],
		data() {return {subtabShouldNotify, subtabResetNotify, tmp, defaultGlow, player, updateTabFormats, needCanvasUpdate}},
		template: template(`<div class="upgRow">
			<div v-for="tab in Object.keys(data)">
				<button v-if="data[tab].unlocked === undefined || data[tab].unlocked" :class="{
						tabButton: true,
						notify: subtabShouldNotify(layer, name, tab),
						resetNotify: subtabResetNotify(layer, name, tab),
					}" :style="[
						{'border-color': tmp[layer].color},
						(subtabShouldNotify(layer, name, tab) ?
							{'box-shadow': 'var(--hqProperty2a), 0 0 20px' + (data[tab].glowColor || defaultGlow)}
							: {}),
						tmp[layer].componentStyles['tab-button'],
						data[tab].buttonStyle,
					]" v-on:click="() => {
						player.subtabs[layer][name] = tab;
						updateTabFormats();
						needCanvasUpdate = true;
					}">
					{{tab}}
				</button>
			</div>
		</div>`),
	});

	app.component('tree-node', {
		props: ['layer', 'abb', 'size', 'prev'],
		data() {return {nodeShown, shiftDown, options, player, overrideTreeNodeClick, tmp, showNavTab, showTab, constructNodeStyle, overrideTooltip, formatWhole}},
		computed: {
			tooltipText() {
				if (typeof overrideTooltip == 'function' && overrideTooltip(this.layer)) {
					return overrideTooltip(this.layer);
				};
				if (tmp[this.layer].isLayer) {
					if (player[this.layer].unlocked) {
						if (tmp[this.layer].tooltip) return tmp[this.layer].tooltip;
						return formatWhole(player[this.layer].points) + ' ' + tmp[this.layer].resource;
					};
					if (tmp[this.layer].tooltipLocked) return tmp[this.layer].tooltipLocked;
					if (tmp[this.layer].deactivated) return '' + (tmp[this.layer].name ? tmp[this.layer].name : tmp[this.layer].resource) + ' is deactivated';
					return 'Reach ' + formatWhole(tmp[this.layer].requires) + ' ' + tmp[this.layer].baseResource + ' to unlock (You have ' + formatWhole(tmp[this.layer].baseAmount) + ' ' + tmp[this.layer].baseResource + ')';
				};
				if (tmp[this.layer].canClick) {
					if (tmp[this.layer].tooltip) return tmp[this.layer].tooltip;
					return 'I am a button!';
				};
				if (tmp[this.layer].tooltipLocked) return tmp[this.layer].tooltipLocked;
				return 'I am a button!';
			},
		},
		methods: {
			onClick() {
				if (shiftDown && options.forceTooltips) {
					player[this.layer].forceTooltip = !player[this.layer].forceTooltip;
				} else if (typeof overrideTreeNodeClick == 'function' && typeof overrideTreeNodeClick(this.layer) == 'function') {
					overrideTreeNodeClick(this.layer)();
				} else if (tmp[this.layer].isLayer) {
					if (tmp[this.layer].leftTab) showNavTab(this.layer, this.prev);
					else showTab(this.layer, this.prev);
				} else {
					run(layers[this.layer].onClick, layers[this.layer]);
				};
			},
		},
		template: template(`<button v-if="nodeShown(layer)" :id="layer" v-on:click="onClick" :class="{
			treeNode: tmp[layer].isLayer,
			treeButton: !tmp[layer].isLayer,
			smallNode: size == 'small',
			[layer]: true,
			tooltipBox: true,
			forceTooltip: player[layer].forceTooltip,
			ghost: tmp[layer].layerShown == 'ghost',
			hidden: !tmp[layer].layerShown,
			locked: (tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !tmp[layer].canClick),
			notify: tmp[layer].notify && player[layer].unlocked,
			resetNotify: tmp[layer].prestigeNotify,
			can: ((player[layer].unlocked || tmp[layer].canReset) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
			front: !tmp.scrolled
		}" :style="constructNodeStyle(layer)">
			<span class="nodeLabel" v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : ''"></span>
			<tooltip v-if="tmp[layer].tooltip != ''" :text="tooltipText"></tooltip>
			<node-mark :layer='layer' :data='tmp[layer].marked'></node-mark>
		</button>`),
	});

	app.component('layer-tab', {
		props: ['layer', 'back', 'spacing', 'embedded'],
		data() {return {tmp, player, goBack}},
		template: template(`<div :style="[
			(tmp[layer].style ?
				tmp[layer].style
				: {}),
			(tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ?
				tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style
				: {}
		]" class="noBackground">
			<div v-if="back">
				<button :class="back == 'big' ? 'other-back' : 'back'" v-on:click="goBack(layer)">&#8592;</button>
			</div>
			<template v-if="tmp[layer].tabFormat">
				<div v-if="Array.isArray(tmp[layer].tabFormat)">
					<div v-if="spacing" :style="{height: spacing}"></div>
					<column :layer="layer" :data="tmp[layer].tabFormat"></column>
				</div>
				<div v-else>
					<div class="upgTable" :style="{
						'padding-top': (embedded ? '0' : '25px'),
						'margin-top': (embedded ? '-10px' : '0'),
						'margin-bottom': '24px',
					}">
						<tab-buttons :style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
					</div>
					<layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true"></layer-tab>
					<column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content"></column>
				</div>
			</template>
			<div v-else>
				<div v-if="spacing" :style="{height: spacing}"></div>
				<infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]"></infobox>
				<main-display :style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
				<div v-if="tmp[layer].type !== 'none'">
					<prestige-button :style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
				</div>
				<resource-display :style="tmp[layer].componentStyles['resource-display']" :layer="layer">
				</resource-display>
				<milestones :style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
				<div v-if="Array.isArray(tmp[layer].midsection)">
					<column :layer="layer" :data="tmp[layer].midsection"></column>
				</div>
				<clickables :style="tmp[layer].componentStyles.clickables" :layer="layer"></clickables>
				<buyables :style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
				<upgrades :style="tmp[layer].componentStyles.upgrades" :layer="layer"></upgrades>
				<challenges :style="tmp[layer].componentStyles.challenges" :layer="layer"></challenges>
				<achievements :style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
				<br><br>
			</div>
		</div>`),
	});

	app.component('overlay-head', {
		data() {return {player, format, formatTime, overridePointDisplay, modInfo, canGenPoints, tmp, formatSmall, getPointGen}},
		template: template(`<div class="overlayThing" style="
			padding-bottom: 10px;
			background-image: linear-gradient(#000, #000C, #0009, #0006, #0000);
			z-index: 1000;
			position: relative;
		">
			<span v-if="player.devSpeed && player.devSpeed !== 1" class="overlayThing">
				<br>Dev Speed: {{format(player.devSpeed)}}x<br>
			</span>
			<span v-if="player.offTime !== undefined" class="overlayThing">
				<br>Offline Time: {{formatTime(player.offTime.remain)}}<br>
			</span>
			<br>
			<span v-if="typeof overridePointDisplay == 'function' && overridePointDisplay()" v-html="overridePointDisplay()" class="overlayThing"></span>
			<span v-else>
				<span v-if="player.points.lt('1e1000')" class="overlayThing">You have&nbsp;</span>
				<h2 class="overlayThing" id="points">{{format(player.points)}}</h2>
				<span v-if="player.points.lt('e1000000')" class="overlayThing">&nbsp;{{modInfo.pointsName}}</span><br>
				<span v-if="canGenPoints()" class="overlayThing">
					{{tmp.other.oompsMag !== 0 ?
						format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : (tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "")) + "s"
						: formatSmall(getPointGen())
					}}/sec
				</span>
			</span>
			<div v-for="thing in tmp.displayThings" class="overlayThing">
				<span v-if="thing" v-html="thing"></span>
			</div>
		</div>`),
	});

	app.component('info-tab', {
		data() {return {modInfo, VERSION, TMT_VERSION, showTab, endPoints, format, formatTime, hotkeys, player, tmp}},
		template: template(`<div>
			<h2>{{modInfo.name}}</h2><br>
			<h3>{{VERSION.withName}}</h3><br>
			<span v-if="modInfo.author">
				Made by {{modInfo.author}}<br>
			</span><br>
			The Modding Tree <a href="https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md" target="_blank" class="link" style="font-size: 14px; display: inline">{{TMT_VERSION.tmtNum}}</a> by Acamaeda and FlamemasterNXF<br>
			The Prestige Tree made by Jacorb and Aarex<br><br>
			<div class="link" onclick="showTab('changelog-tab')">Changelog</div><br><br>
			<span v-if="modInfo.discordLink">
				<a class="link" :href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br><br>
			</span>
			<a class="link" href="https://discord.gg/F3xveHV" target="_blank" :style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br><br>
			<a class="link" href="https://discord.gg/wwQfgPa" target="_blank" style="font-size: 16px">Main Prestige Tree server</a><br><br>
			<div v-if="endPoints !== undefined">
				Current Endgame: {{format(endPoints) + " " + (modInfo.pointsName ? modInfo.pointsName : "points")}}<br>
			</div><br>
			Time Played: {{formatTime(player.timePlayed)}}<br><br>
			<h3>Hotkeys</h3><br><br>
			<span v-for="key in hotkeys">
				<span v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked">
					{{key.description}}<br>
				</span>
			</span>
		</div>`),
	});

	app.component('options-tab', {
		data() {return {save, toggleOpt, formatOption, options, hardReset, displayMode, fullColorDisplay, DISPLAY_MODES, exportSave, importSave, COLOR_DISPLAYS, switchTheme, getThemeName, adjustMSDisp, MS_DISPLAYS, MS_SETTINGS, player}},
		template: template(`<table>
			<tbody>
				<tr>
					<td><button class="opt" onclick="save()">Save</button></td>
					<td><button class="opt" onclick="toggleOpt('autosave')">Autosave: {{formatOption(options.autosave)}}</button></td>
					<td><button class="opt" onclick="hardReset()">HARD RESET</button></td>
					<td><button class="opt" onclick="displayMode(); fullColorDisplay()">Color Text Mode: {{DISPLAY_MODES[options.colorDisplayMode]}}</button></td>
				</tr>
				<tr>
					<td><button class="opt" onclick="exportSave()">Export to clipboard</button></td>
					<td><button class="opt" onclick="importSave()">Import</button></td>
					<td><button class="opt" onclick="toggleOpt('offlineProd')">Offline Progress: {{formatOption(options.offlineProd)}}</button></td>
					<td><button class="opt" onclick="colorDisplay(); fullColorDisplay()">Colored Text: {{COLOR_DISPLAYS[options.colorDisplay]}}</button></td>
				</tr>
				<tr>
					<td><button class="opt" onclick="switchTheme()">Theme: {{getThemeName()}}</button></td>
					<td><button class="opt" onclick="adjustMSDisp()">Show Milestones: {{MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)]}}</button></td>
					<td><button class="opt" onclick="toggleOpt('hqTree')">High-Quality Tree: {{formatOption(options.hqTree)}}</button></td>
					<td><button class="opt" onclick="player.nerdMode = !player.nerdMode">Nerd Mode: {{formatOption(player.nerdMode)}} (you can also use the control key to toggle)</button></td>
				</tr>
				<tr>
					<td><button class="opt" onclick="toggleOpt('hideChallenges')">Show Completed Challenges: {{formatOption(!options.hideChallenges)}}</button></td>
					<td><button class="opt" onclick="toggleOpt('forceOneTab')">Single-Tab Mode: {{options.forceOneTab ? "ALWAYS" : "AUTO"}}</button></td>
					<td><button class="opt" onclick="toggleOpt('forceTooltips')">Shift-Click to Toggle Tooltips: {{formatOption(options.forceTooltips)}}</button></td>
					<td><button class="opt" onclick="toggleOpt('extendplaces')">Extended Decimal Places: {{formatOption(options.extendplaces)}}</button></td>
				</tr>
				<tr>
					<td><button class="opt" onclick="toggleOpt('hideMilestonePopups')">Show Milestone Popups: {{formatOption(!options.hideMilestonePopups)}}</button></td>
					<td><button class="opt" onclick="toggleOpt('disableGlitchText')">Glitch Text: {{formatOption(!options.disableGlitchText)}} (when off, qestion marks are displayed instead)</button></td>
				</tr>
			</tbody>
		</table>`),
	});

	app.component('tooltip', {
		props: ['text'],
		template: template(`<div class="tooltip" v-html="text"></div>`),
	});

	app.component('particle', {
		props: ['data', 'index'],
		data() {return {constructParticleStyle, run}},
		template: template(`<div>
			<div class='particle instant' :style="[
				constructParticleStyle(data),
				data.style,
			]" v-on:click="run(data.onClick, data)" v-on:mouseenter="run(data.onMouseOver, data)" v-on:mouseleave="run(data.onMouseLeave, data)">
				<span v-html="data.text"></span>
			</div>
			<svg version="2" v-if="data.color">
				<mask :id="'pmask' + data.id">
					<image id="img" :href="data.image" x="0" y="0" :height="data.width" :width="data.height"></image>
				</mask>
			</svg>
		</div>`),
	});

	app.component('bg', {
		props: ['layer'],
		data() {return {tmp, player}},
		template: template(`<div class="bg" :style="[
			(tmp[layer].style ?
				tmp[layer].style
				: {}),
			(tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat) ?
				tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style
				: {}),
		]"></div>`),
	});

	app.mount("#app");
};
