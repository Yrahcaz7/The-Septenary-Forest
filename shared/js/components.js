let app;

/**
 * Removes newlines and tabs from a string to allow formatting templates
 * @param {string} str 
 */
function template(str) {
	return str.replace(/[\n\t]/g, "");
};

function getCurrentlyText() {
	if (typeof currentlyText === "function") return currentlyText();
	if (typeof currentlyText === "string") return currentlyText;
	return "Currently: ";
};

function loadVue(mainPage = false) {
	app = Vue.createApp({
		data() {return {player, tmp, modInfo, VERSION, formatTime, hardReset, keepGoing, readData, layoutInfo, resizeCanvas, showTab, goBack, OTHER_LAYERS, activePopups, particles, LAYERS}},
		computed: {
			gameEnded() {return tmp.gameEnded && !player.keepGoing},
		},
		template: template(`<div id="app">
			<!-- canvas -->
			<canvas id="treeCanvas" class="canvas" v-if="!gameEnded"></canvas>
			<div class="main-vl" v-if="player.navTab !== 'none' && tmp.other.splitScreen && player.tab !== 'none' && !gameEnded"></div>
			<!-- loading screen -->
			<div v-if="false" class="fullWidth" style="display: flex; flex-direction: column; justify-content: center; background-color: #0f0f0f; z-index: 999999999999999">
				<div><h1>Loading...</h1><br><h2>If this takes too long it means there was a serious error!</h2></div>
			</div>
			<!-- game end screen -->
			<div v-if="gameEnded" class="fullWidth">
				<br>
				<h2>{{modInfo.name}} {{VERSION.withoutName}}</h2><br><br>
				<h3 v-html="modInfo.winText"></h3><br><br>
				<div v-if="!player.timePlayedReset">It took you {{formatTime(player.timePlayed)}} to beat the game.</div><br>
				<button class="longUpg can" style="margin-right: 18px" onclick="hardReset(true)">Play Again</button><button class="longUpg can" onclick="keepGoing()">Keep Going</button><br><br>
				<span v-if="modInfo.discordLink"><a class="link" :href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
				<a class="link" href="https://discord.gg/F3xveHV" target="_blank" :style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br><br>
				<a class="link" href="https://discord.gg/wwQfgPa" target="_blank" style="font-size: 16px">Main Prestige Tree server</a><br><br>
			</div>
			<!-- miscellaneous buttons -->
			<div id="treeOverlay" v-if="!gameEnded && (player.tab === 'none' || tmp.other.splitScreen || !readData(layoutInfo.showTree))" onscroll="resizeCanvas()" :class="{
				treeOverlay: true,
				fullWidth: player.tab === 'none' || player.navTab === 'none',
				col: player.tab !== 'none' && player.navTab !== 'none',
				left: player.tab !== 'none' && player.navTab !== 'none',
			}" :style="{'margin-top': !readData(layoutInfo.showTree) && player.tab == 'info-tab' ? '50px' : ''}">
				<div id="version" onclick="showTab('changelog-tab')" class="overlayThing" style="margin-right: 13px">{{VERSION.withoutName}}</div>
				<button v-if="((player.navTab == 'none' && (tmp[player.tab].row == 'side' || tmp[player.tab].row == 'otherside' || player[player.tab].prevTab)) || player[player.navTab]?.prevTab)" class="big back overlayThing" onclick="goBack(player.navTab === 'none' ? player.tab : player.navTab)">&#8592;</button>
				<img id="optionWheel" class="overlayThing" v-if="player.tab != 'options-tab'" src="${mainPage ? "" : "../"}shared/images/options_wheel.png" onclick="showTab('options-tab')">
				<div id="info" v-if="player.tab != 'info-tab'" class="overlayThing" onclick="showTab('info-tab')">i</div>
				<div id="discord" class="overlayThing" style="z-index: 30001">
					<img src="${mainPage ? "" : "../"}shared/images/discord.png">
					<ul id="discordLinks">
						<li v-if="modInfo.discordLink"><a class="link" :href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></li>
						<li><a class="link" href="https://discord.gg/F3xveHV" target="_blank" :style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br></li>
						<li><a class="link" href="https://discord.gg/wwQfgPa" target="_blank" style="font-size: 16px">Main Prestige Tree server</a></li>
					</ul>
				</div>
				<overlay-head v-if="!gameEnded"></overlay-head>
				<div class="upgCol sideLayers">
					<tree-node v-for="node in OTHER_LAYERS.side" :node='node' :size="'small'"></tree-node>
				</div>
			</div>
			<!-- tree tab -->
			<div v-if="!gameEnded && (player.tab === 'none' || tmp.other.splitScreen)" id="treeTab" onscroll="resizeCanvas()" :class="{
				fullWidth: player.tab === 'none' || player.navTab === 'none',
				col: player.tab !== 'none' && player.navTab !== 'none',
				left: player.tab !== 'none' && player.navTab !== 'none',
			}">
				<br><br><br><br>
				<overlay-head id="fakeHead" style="visibility: hidden"></overlay-head>
				<layer-tab :layer="player.navTab === 'none' ? player.tab : player.navTab"></layer-tab>
				<bg :layer="player.navTab === 'none' ? player.tab : player.navTab"></bg>
			</div>
			<!-- popups -->
			<div class="popup-container">
				<transition-group name="fade">
					<div v-for="(popup, index) in activePopups" class="popup" :class="popup.type" :key="'p' + popup.id" @click="() => activePopups.splice(index, 1)" :style="popup.color ? {'background-color': popup.color} : {}">
						<h3>{{popup.title}}</h3><br>
						<h2 v-html="popup.message"></h2>
					</div>
				</transition-group>
			</div>
			<!-- particles -->
			<div class="particle-container">
				<template v-for="(particle, index) in particles">
					<particle :data="particle" :index="index"></particle>
				</template>
			</div>
			<!-- layer tab -->
			<div v-if="player.navTab !== 'none' && player.tab !== 'none' && !gameEnded" onscroll="resizeCanvas()" :class="{
				fullWidth: player.navTab === 'none' || !tmp.other.splitScreen || !readData(layoutInfo.showTree),
				col: player.navTab !== 'none',
				right: player.navTab !== 'none',
				fast: true,
				tab: true,
			}">
				<template v-for="layer in LAYERS">
					<layer-tab v-if="player.tab == layer" :layer="layer" :back="'none'" :spacing="'50px'"></layer-tab>
				</template>
				<bg :layer="player.tab"></bg>
			</div>
			<!-- background -->
			<div class="bg2" :style="tmp.backgroundStyle"></div>
		</div>`),
	});

	const addNormalComponent = (name, component) => {
		if (typeof customComponents === "object" && isPlainObject(customComponents) && customComponents[name]) return;
		app.component(name, component);
	};

	// data = a function returning the content (actually HTML)
	addNormalComponent('display-text', {
		props: ['layer', 'data'],
		template: template(`<span class="instant" v-html="data"></span>`),
	});

	// data = a function returning the content (actually HTML)
	addNormalComponent('raw-html', {
		props: ['layer', 'data'],
		template: template(`<span class="instant" v-html="data"></span>`),
	});

	// data = a function returning the content (actually HTML)
	addNormalComponent('custom-resource-display', {
		props: ['layer', 'data'],
		template: template(`<div class="instant" style="margin-top: -13px" v-html="'<br>' + (typeof data === 'function' ? data() : data)"></div>`),
	});

	// data = optional height in px or [width in px, height in px]
	addNormalComponent('blank', {
		props: ['layer', 'data'],
		template: template(`
			<div class="instant" v-if="!data" style="width: 8px; height: 17px"></div>
			<div class="instant" v-else-if="Array.isArray(data)" :style="{width: data[0], height: data[1]}"></div>
			<div class="instant" v-else :style="{width: '8px', height: data}"><br></div>
		`),
	});

	// data = the URL of the image
	addNormalComponent('display-image', {
		props: ['layer', 'data'],
		template: template(`<img class="instant" :src="data" :alt="data">`),
	});
		
	// data = an array of components to be displayed in a row
	addNormalComponent('row', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div class="upgRow instant">
			<div v-for="(item, index) in data">
				<component v-if="!Array.isArray(item)" :is="item" :layer="layer" :style="tmp[layer].componentStyles[item]"></component>
				<component v-else-if="item.length == 3" :is="item[0]" :layer="layer" :data="item[1]" :style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]"></component>
				<component v-else-if="item.length == 2" :is="item[0]" :layer="layer" :data="item[1]" :style="tmp[layer].componentStyles[item[0]]"></component>
			</div>
		</div>`),
	});

	// data = an array of components to be displayed in a column
	addNormalComponent('column', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div class="upgCol instant">
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
		</div>`),
	});

	// data = [other layer, tabformat for within proxy]
	addNormalComponent('layer-proxy', {
		props: ['layer', 'data'],
		template: template(`<div><column :layer="data[0]" :data="data[1]"></column></div>`),
	});

	// data = the id of the infobox
	addNormalComponent('infobox', {
		props: ['layer', 'data'],
		data() {return {tmp, player}},
		template: template(`<div class="story instant" v-if="tmp[layer].infoboxes && tmp[layer].infoboxes[data] !== undefined && tmp[layer].infoboxes[data].unlocked" :style="[{
			'border-bottom-style': (player.infoboxes[layer][data] ? 'solid' : 'none'),
			'border-color': tmp[layer].color,
		}, tmp[layer].infoboxes[data].style]">
			<button class="story-title" :style="[{'background-color': tmp[layer].color}, tmp[layer].infoboxes[data].titleStyle]" @click="player.infoboxes[layer][data] = !player.infoboxes[layer][data]">
				<span class="story-toggle">{{player.infoboxes[layer][data] ? "+" : "-"}}</span>
				<span v-html="tmp[layer].infoboxes[data].title ? tmp[layer].infoboxes[data].title : tmp[layer].name"></span>
			</button>
			<div v-if="!player.infoboxes[layer][data]" class="story-text" :style="tmp[layer].infoboxes[data].bodyStyle">
				<span v-html="tmp[layer].infoboxes[data].body ? tmp[layer].infoboxes[data].body : 'Blah'"></span>
			</div>
		</div>`),
	});

	// data = width in px, by default fills the full area
	addNormalComponent('h-line', {
		props: ['layer', 'data'],
		template: template(`<hr class="instant hl" :style="data ? {width: data} : {}">`),
	});

	// data = height in px, by default is bad
	addNormalComponent('v-line', {
		props: ['layer', 'data'],
		template: template(`<div class="instant vl" :style="data ? {height: data} : {}"></div>`),
	});

	// data = array of rows to include, by default is all
	addNormalComponent('challenges', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].challenges" class="upgCol">
			<div v-for="row in (data === undefined ? tmp[layer].challenges.rows : data)" class="upgRow">
				<template v-for="col in tmp[layer].challenges.cols">
					<challenge v-if="tmp[layer].challenges[row * 10 + col] !== undefined && tmp[layer].challenges[row * 10 + col].unlocked" :layer="layer" :data="row * 10 + col" :style="tmp[layer].componentStyles.challenge"></challenge>
				</template>
			</div>
		</div>`),
	});

	// data = the id of the challenge
	addNormalComponent('challenge', {
		props: ['layer', 'data'],
		data() {return {tmp, options, maxedChallenge, inChallenge, challengeStyle, player, canUseChallenge, startChallenge, challengeButtonText, layers, run, format, modInfo, getCurrentlyText}},
		template: template(`<div v-if="tmp[layer].challenges && tmp[layer].challenges[data] !== undefined && tmp[layer].challenges[data].unlocked && !(options.hideChallenges && maxedChallenge(layer, data) && !inChallenge(layer, data))" :class="[
			'challenge',
			challengeStyle(layer, data),
			(player[layer].activeChallenge === data ? 'resetNotify' : ''),
		]" :style="tmp[layer].challenges[data].style">
			<br>
			<h3 v-html="tmp[layer].challenges[data].name"></h3><br><br>
			<button :class="{longUpg: true, can: canUseChallenge(layer, data), [layer]: true}" :style="{'background-color': tmp[layer].color}" @click="startChallenge(layer, data)">{{challengeButtonText(layer, data)}}</button><br><br>
			<span v-if="layers[layer].challenges[data].fullDisplay" v-html="run(layers[layer].challenges[data].fullDisplay, layers[layer].challenges[data])"></span>
			<template v-else>
				<span v-html="tmp[layer].challenges[data].challengeDescription"></span><br>
				Goal: <span v-if="tmp[layer].challenges[data].goalDescription" v-html="tmp[layer].challenges[data].goalDescription"></span>
				<template v-else>{{format(tmp[layer].challenges[data].goal)}} {{tmp[layer].challenges[data].currencyDisplayName || (modInfo.pointsName || "points")}}</template><br>
				Reward: <span v-html="tmp[layer].challenges[data].rewardDescription"></span>
				<template v-if="layers[layer].challenges[data].rewardDisplay !== undefined">
					<br>
					<span v-html="getCurrentlyText()"></span>
					<span v-html="tmp[layer].challenges[data].rewardDisplay ? run(layers[layer].challenges[data].rewardDisplay, layers[layer].challenges[data], tmp[layer].challenges[data].rewardEffect) : format(tmp[layer].challenges[data].rewardEffect)"></span>
				</template>
			</template>
			<node-mark :layer="layer" :data='tmp[layer].challenges[data].marked' :offset="20" :scale="1.5"></node-mark>
		</div>`),
	});

	// data = array of rows to include, by default is all
	addNormalComponent('upgrades', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].upgrades" class="upgCol">
			<div v-for="row in (data === undefined ? tmp[layer].upgrades.rows : data)" class="upgRow">
				<template v-for="col in tmp[layer].upgrades.cols">
					<upgrade v-if="tmp[layer].upgrades[row * 10 + col] !== undefined && tmp[layer].upgrades[row * 10 + col].unlocked" :layer="layer" :data="row * 10 + col" :style="tmp[layer].componentStyles.upgrade"></upgrade>
				</template>
			</div>
		</div>`),
	});

	// data = the id of the upgrade
	addNormalComponent('upgrade', {
		props: ['layer', 'data'],
		data() {return {tmp, buyUpg, hasUpgrade, canAffordUpgrade, layers, run, getCurrentlyText, formatWhole}},
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
			<span v-if="layers[layer].upgrades[data].fullDisplay" v-html="run(layers[layer].upgrades[data].fullDisplay, layers[layer].upgrades[data])"></span>
			<template v-else>
				<span v-html="tmp[layer].upgrades[data].description"></span>
				<template v-if="layers[layer].upgrades[data].effectDisplay">
					<br>
					<span v-html="getCurrentlyText()"></span>
					<span v-html="run(layers[layer].upgrades[data].effectDisplay, layers[layer].upgrades[data], tmp[layer].upgrades[data].effect)"></span>
				</template><br><br>
				<span v-if="layers[layer].upgrades[data].costDisplay" v-html="run(layers[layer].upgrades[data].costDisplay, layers[layer].upgrades[data], tmp[layer].upgrades[data].cost)"></span>
				<template v-else>Cost: {{formatWhole(tmp[layer].upgrades[data].cost)}} {{(tmp[layer].upgrades[data].currencyDisplayName || tmp[layer].upgrades[data].currencyInternalName || tmp[layer].resource)}}</template>
			</template>
			<tooltip v-if="tmp[layer].upgrades[data].tooltip" :text="tmp[layer].upgrades[data].tooltip"></tooltip>
		</button>`),
	});

	// data = array of rows to include, by default is all
	addNormalComponent('milestones', {
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

	// data = the id of the milestone
	addNormalComponent('milestone', {
		props: ['layer', 'data'],
		data() {return {tmp, milestoneShown, hasMilestone, run, layers}},
		template: template(`<td v-if="tmp[layer].milestones && tmp[layer].milestones[data] !== undefined && tmp[layer].milestones[data].unlocked && milestoneShown(layer, data)" :style="[tmp[layer].milestones[data].style]" :class="{
			milestone: true,
			tooltipBox: true,
			done: hasMilestone(layer, data),
		}">
			<h3 v-html="tmp[layer].milestones[data].requirementDescription"></h3><br>
			<span v-html="run(layers[layer].milestones[data].effectDescription, layers[layer].milestones[data], tmp[layer].milestones[data].effect)"></span><br>
			<tooltip v-if="tmp[layer].milestones[data].tooltip" :text="tmp[layer].milestones[data].tooltip"></tooltip>
			<template v-if="tmp[layer].milestones[data].toggles && hasMilestone(layer, data)" v-for="toggle in tmp[layer].milestones[data].toggles">
				<toggle :layer="layer" :data="toggle" :style="tmp[layer].componentStyles.toggle"></toggle>&nbsp;
			</template>
		</td>`),
	});

	// Toggles the boolean value in player[data[0]][data[1]]
	addNormalComponent('toggle', {
		props: ['layer', 'data'],
		data() {return {tmp, toggleAuto, formatOpt, player}},
		template: template(`<button class="smallUpg can" :style="{'background-color': tmp[data[0]].color}" @click="toggleAuto(data)">{{formatOpt(player[data[0]][data[1]])}}</button>`),
	});

	addNormalComponent('prestige-button', {
		props: ['layer'],
		data() {return {tmp, prestigeButtonText, doReset}},
		template: template(`<button v-if="tmp[layer].type !== 'none'" :class="{
			[layer]: true,
			reset: true,
			locked: !tmp[layer].canReset,
			can: tmp[layer].canReset,
		}" :style="[
			(tmp[layer].canReset ? {'background-color': tmp[layer].color} : {}),
			tmp[layer].componentStyles['prestige-button'],
		]" v-html="prestigeButtonText(layer)" @click="doReset(layer)"></button>`),
	});

	// Displays the main resource for the layer
	addNormalComponent('main-display', {
		props: ['layer', 'data'],
		data() {return {player, tmp, format, formatWhole, layers, run}},
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
			<template v-if="player[layer].points.lt('1e1000')">You have </template>
			<h2 :style="{color: tmp[layer].color, 'text-shadow': tmp[layer].color + ' 0px 0px 10px'}">{{data ? format(player[layer].points, data) : formatWhole(player[layer].points)}}</h2>&nbsp;
			<span v-if="extraMainDisplay" v-html="extraMainDisplay"></span>
			{{tmp[layer].resource}}
			<span v-if="effectDescription" v-html="', ' + effectDescription"></span><br><br>
		</div>`),
	});

	// Displays the base resource for the layer, as well as the best and total values for the layer's currency, if tracked
	addNormalComponent('resource-display', {
		props: ['layer'],
		data() {return {tmp, formatWhole, format, player}},
		template: template(`<div style="margin-top: -13px">
			<template v-if="tmp[layer].baseAmount"><br>You have {{formatWhole(tmp[layer].baseAmount)}} {{tmp[layer].baseResource}}</template>
			<template v-if="tmp[layer].passiveGeneration"><br>You are gaining {{format(tmp[layer].resetGain.times(tmp[layer].passiveGeneration))}} {{tmp[layer].resource}} per second</template>
			<br><br>
			<template v-if="tmp[layer].showBest">Your best {{tmp[layer].resource}} is {{formatWhole(player[layer].best)}}<br></template>
			<template v-if="tmp[layer].showTotal">You have made a total of {{formatWhole(player[layer].total)}} {{tmp[layer].resource}}<br></template>
		</div>`),
	});

	// data = array of rows to include, by default is all
	addNormalComponent('buyables', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].buyables" class="upgCol">
			<respec-button v-if="tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)" :layer="layer" :style="[
				{'margin-bottom': '12px'},
				tmp[layer].componentStyles['respec-button'],
			]"></respec-button>
			<div v-for="row in (data === undefined ? tmp[layer].buyables.rows : data)" class="upgRow">
				<template v-for="col in tmp[layer].buyables.cols">
					<buyable v-if="tmp[layer].buyables[row * 10 + col] !== undefined && tmp[layer].buyables[row * 10 + col].unlocked" :layer="layer" :data="row * 10 + col" style="margin: 0 7px"></buyable>
				</template><br>
			</div>
		</div>`),
	});

	// data = the id of the buyable
	addNormalComponent('buyable', {
		props: ['layer', 'data'],
		data() {return {tmp, player, interval: false, buyBuyable, layers, run, getCurrentlyText, formatWhole, newDecimalInf, time: 0}},
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
				<span v-if="layers[layer].buyables[data].fullDisplay" style="white-space: pre-line" v-html="run(layers[layer].buyables[data].fullDisplay, layers[layer].buyables[data])"></span>
				<template v-else>
					<span v-html="tmp[layer].buyables[data].description"></span>
					<template v-if="layers[layer].buyables[data].effectDisplay">
						<br><br>
						<span v-html="getCurrentlyText()"></span>
						<span v-html="run(layers[layer].buyables[data].effectDisplay, layers[layer].buyables[data], tmp[layer].buyables[data].effect)"></span>
					</template><br><br>
					<span v-if="layers[layer].buyables[data].costDisplay" v-html="run(layers[layer].buyables[data].costDisplay, layers[layer].buyables[data], tmp[layer].buyables[data].cost)"></span>
					<template v-else>Cost: {{formatWhole(tmp[layer].buyables[data].cost)}} {{(tmp[layer].buyables[data].currencyDisplayName || tmp[layer].resource)}}</template><br><br>
					<span v-if="layers[layer].buyables[data].boughtDisplay" v-html="run(layers[layer].buyables[data].boughtDisplay, layers[layer].buyables[data], player[layer].buyables[data])"></span>
					<template v-else>Bought: {{formatWhole(player[layer].buyables[data])}}{{newDecimalInf().neq(tmp[layer].buyables[data].purchaseLimit) ? "/" + formatWhole(tmp[layer].buyables[data].purchaseLimit) : ""}}</template>
				</template>
				<node-mark :layer="layer" :data='tmp[layer].buyables[data].marked'></node-mark>
				<tooltip v-if="tmp[layer].buyables[data].tooltip" :text="tmp[layer].buyables[data].tooltip"></tooltip>
			</button>
			<br v-if="(tmp[layer].buyables[data].sellOne && (tmp[layer].buyables[data].canSellOne === undefined || tmp[layer].buyables[data].canSellOne)) || (tmp[layer].buyables[data].sellAll && (tmp[layer].buyables[data].canSellAll === undefined || tmp[layer].buyables[data].canSellAll))">
			<sell-one v-if="tmp[layer].buyables[data].sellOne && (tmp[layer].buyables[data].canSellOne === undefined || tmp[layer].buyables[data].canSellOne)" :layer="layer" :data="data" :style="tmp[layer].componentStyles['sell-one']"></sell-one>
			<sell-all v-if="tmp[layer].buyables[data].sellAll && (tmp[layer].buyables[data].canSellAll === undefined || tmp[layer].buyables[data].canSellAll)" :layer="layer" :data="data" :style="tmp[layer].componentStyles['sell-all']"></sell-all>
		</div>`),
	});

	addNormalComponent('respec-button', {
		props: ['layer'],
		data() {return {tmp, player, respecBuyables}},
		template: template(`<div v-if="tmp[layer].buyables && tmp[layer].buyables.respec && (tmp[layer].buyables.showRespec === undefined || tmp[layer].buyables.showRespec)">
			<div class="tooltipBox respecCheckbox">
				<input type="checkbox" v-model="player[layer].noRespecConfirm">
				<tooltip :text="'Disable respec confirmation'"></tooltip>
			</div>
			<button @click="respecBuyables(layer)" :class="{longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked}" style="margin-right: 18px">{{tmp[layer].buyables.respecText ? tmp[layer].buyables.respecText : "Respec"}}</button>
		</div>`),
	});

	// data = array of rows to include, by default is all
	addNormalComponent('clickables', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].clickables" class="upgCol">
			<master-button v-if="tmp[layer].clickables.masterButtonPress && (tmp[layer].clickables.showMasterButton === undefined || tmp[layer].clickables.showMasterButton)" :layer="layer" :style="[
				{'margin-bottom': '12px'},
				tmp[layer].componentStyles['master-button'],
			]"></master-button>
			<div v-for="row in (data === undefined ? tmp[layer].clickables.rows : data)" class="upgRow">
				<template v-for="col in tmp[layer].clickables.cols">
					<clickable v-if="tmp[layer].clickables[row * 10 + col] !== undefined && tmp[layer].clickables[row * 10 + col].unlocked" :layer="layer" :data="row * 10 + col" :style="[{margin: '0 7px'}, tmp[layer].componentStyles.clickable]"></clickable>
				</template><br>
			</div>
		</div>`),
	});

	// data = the id of the clickable
	addNormalComponent('clickable', {
		props: ['layer', 'data'],
		data() {return {tmp, interval: false, clickClickable, run, layers, time: 0}},
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
			<span style="white-space: pre-line" v-html="run(layers[layer].clickables[data].display, layers[layer].clickables[data])"></span>
			<node-mark :layer="layer" :data='tmp[layer].clickables[data].marked'></node-mark>
			<tooltip v-if="tmp[layer].clickables[data].tooltip" :text="tmp[layer].clickables[data].tooltip"></tooltip>
		</button>`),
	});

	addNormalComponent('master-button', {
		props: ['layer'],
		data() {return {tmp, run, player}},
		template: template(`<button v-if="tmp[layer].clickables && tmp[layer].clickables.masterButtonPress && (tmp[layer].clickables.showMasterButton === undefined || tmp[layer].clickables.showMasterButton)" @click="run(tmp[layer].clickables.masterButtonPress, tmp[layer].clickables)" :class="{
			longUpg: true,
			can: player[layer].unlocked,
			locked: !player[layer].unlocked,
		}">{{tmp[layer].clickables.masterButtonText ? tmp[layer].clickables.masterButtonText : "Click me!"}}</button>`),
	});

	// data = array of rows to include, by default is all
	addNormalComponent('grid', {
		props: ['layer', 'data'],
		data() {return {tmp, run, layers}},
		template: template(`<div v-if="tmp[layer].grid" class="upgCol">
			<div v-for="row in (data === undefined ? tmp[layer].grid.rows : data)" class="upgRow">
				<template v-for="col in tmp[layer].grid.cols">
					<gridable v-if="run(layers[layer].grid.getUnlocked, layers[layer].grid, row * 100 + col)" :layer="layer" :data="row * 100 + col" :style="[{margin: '1px'}, tmp[layer].componentStyles.gridable]"></gridable>
				</template><br>
			</div>
		</div>`),
	});

	// data = the max width of the grid or [max width, array of rows]
	addNormalComponent('contained-grid', {
		props: ['layer', 'data'],
		data() {return {tmp, run, layers}},
		template: template(`<div v-if="tmp[layer].grid" class="upgCol" :style="{
			width: 'fit-content',
			'max-width': (Array.isArray(data) ? data[0] : data),
			overflow: 'auto',
			'overscroll-behavior-x': 'none',
		}">
			<div v-for="row in (Array.isArray(data) ? data[1] : Math.min(tmp[layer].grid.rows, tmp[layer].grid.maxRows))" class="upgRow" style="max-width: none; flex-wrap: nowrap; justify-content: initial">
				<template v-for="col in Math.min(tmp[layer].grid.cols, tmp[layer].grid.maxCols)">
					<gridable v-if="run(layers[layer].grid.getUnlocked, layers[layer].grid, row * 100 + col)" :layer="layer" :data="row * 100 + col" :style="[{margin: '1px'}, tmp[layer].componentStyles.gridable]"></gridable>
				</template><br>
			</div>
		</div>`),
	});

	// data = the id of the gridable
	addNormalComponent('gridable', {
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
		]" @click="clickGrid(layer, data)" @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart.passive="start" @touchend="stop" @touchcancel="stop">
			<span v-if="layers[layer].grid.getTitle">
				<h3 v-html="gridRun(this.layer, 'getTitle', player[this.layer].grid[this.data], this.data)"></h3><br>
			</span>
			<span style="white-space: pre-line" v-html="gridRun(this.layer, 'getDisplay', player[this.layer].grid[this.data], this.data)"></span>
			<tooltip v-if="layers[layer].grid.getTooltip" :text="gridRun(this.layer, 'getTooltip', player[this.layer].grid[this.data], this.data)"></tooltip>
		</button>`),
	});

	// data = id of microtab family
	addNormalComponent('microtabs', {
		props: ['layer', 'data'],
		data() {return {tmp, player}},
		computed: {
			currentTab() {return player.subtabs[layer][data]},
		},
		template: template(`<div v-if="tmp[layer].microtabs" style="border-style: solid">
			<div class="upgCol instant">
				<tab-buttons :layer="layer" :data="tmp[layer].microtabs[data]" :name="data" :style="tmp[layer].componentStyles['tab-buttons']"></tab-buttons>
			</div>
			<layer-tab v-if="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :layer="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :embedded="true"></layer-tab>
			<column v-else :style="tmp[layer].microtabs[data][player.subtabs[layer][data]].style" :layer="layer" :data="tmp[layer].microtabs[data][player.subtabs[layer][data]].content"></column>
		</div>`),
	});

	// data = id of the bar
	addNormalComponent('bar', {
		props: ['layer', 'data'],
		data() {return {tmp, run, layers}},
		computed: {
			style() {return constructBarStyle(this.layer, this.data)},
		},
		template: template(`<div v-if="tmp[layer].bars && tmp[layer].bars[data].unlocked" style="position: relative">
			<div :style="[
				tmp[layer].bars[data].style,
				style.dims,
				{display: 'table'},
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

	// data = array of rows to include, by default is all
	addNormalComponent('achievements', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: template(`<div v-if="tmp[layer].achievements" class="upgCol">
			<div v-for="row in (data === undefined ? tmp[layer].achievements.rows : data)" class="upgRow">
				<template v-for="col in tmp[layer].achievements.cols">
					<achievement v-if="tmp[layer].achievements[row * 10 + col] !== undefined && tmp[layer].achievements[row * 10 + col].unlocked" :layer="layer" :data="row * 10 + col" :style="tmp[layer].componentStyles.achievement"></achievement>
				</template>
			</div>
		</div>`),
	});

	// data = the id of the achievement
	addNormalComponent('achievement', {
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

	// data = an array with the structure of the tree
	addNormalComponent('tree', {
		props: ['layer', 'data'],
		template: template(`<div>
			<div v-for="row in data" class="treeRow">
				<tree-node v-for="node in row" :node='node' :prev='layer'></tree-node>
			</div>
		</div>`),
	});

	// data = an array with the structure of the tree
	addNormalComponent('upgrade-tree', {
		props: ['layer', 'data'],
		template: template(`<thing-tree :layer="layer" :data="data" :type="'upgrade'"></thing-tree>`),
	});

	// data = an array with the structure of the tree
	addNormalComponent('buyable-tree', {
		props: ['layer', 'data'],
		template: template(`<thing-tree :layer="layer" :data="data" :type="'buyable'"></thing-tree>`),
	});

	// data = an array with the structure of the tree
	addNormalComponent('clickable-tree', {
		props: ['layer', 'data'],
		template: template(`<thing-tree :layer="layer" :data="data" :type="'clickable'"></thing-tree>`),
	});

	// data = an array with the structure of the tree
	addNormalComponent('thing-tree', {
		props: ['layer', 'data', 'type'],
		data() {return {tmp}},
		template: template(`<div>
			<div v-for="row in data" class="treeRow">
				<template v-for="id in row">
					<component v-if="tmp[layer][type + 's'][id] !== undefined && tmp[layer][type + 's'][id].unlocked" :is="type" :layer="layer" :data="id" :style="tmp[layer].componentStyles[type]" class="treeThing"></component>
				</template>
			</div>
		</div>`),
	});

	// Updates the value in player[layer][data]
	addNormalComponent('text-input', {
		props: ['layer', 'data'],
		data() {return {player, focused, toValue}},
		template: template(`<input class="instant" :id="'input-' + layer + '-' + data" :value="player[layer][data].toString()" @focus="focused = true" @blur="focused = false" @change="player[layer][data] = toValue(document.getElementById('input-' + layer + '-' + data).value, player[layer][data])">`),
	});

	// Updates the value in player[layer][data[0]] (min=data[1], max=data[2])
	addNormalComponent('slider', {
		props: ['layer', 'data'],
		data() {return {player}},
		template: template(`<div class="tooltipBox">
			<tooltip :text="player[layer][data[0]]"></tooltip>
			<input type="range" v-model="player[layer][data[0]]" :min="data[1]" :max="data[2]">
		</div>`),
	});

	// Updates the value in player[layer][data[0]], the options are an array in data[1]
	addNormalComponent('drop-down', {
		props: ['layer', 'data'],
		data() {return {player}},
		template: template(`<select v-model="player[layer][data[0]]">
			<option v-for="item in data[1]" :value="item">{{item}}</option>
		</select>`),
	});

	// data = the id of the corresponding buyable
	addNormalComponent('sell-one', {
		props: ['layer', 'data'],
		data() {return {tmp, run, player}},
		template: template(`<button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellOne && (tmp[layer].buyables[data].canSellOne === undefined || tmp[layer].buyables[data].canSellOne)" @click="run(tmp[layer].buyables[data].sellOne, tmp[layer].buyables[data])" :class="{
			longUpg: true,
			can: player[layer].unlocked,
			locked: !player[layer].unlocked,
		}">{{tmp[layer].buyables.sellOneText ? tmp[layer].buyables.sellOneText : "Sell One"}}</button>`),
	});

	// data = the id of the corresponding buyable
	addNormalComponent('sell-all', {
		props: ['layer', 'data'],
		data() {return {tmp, run, player}},
		template: template(`<button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellAll && (tmp[layer].buyables[data].canSellAll === undefined || tmp[layer].buyables[data].canSellAll)" @click="run(tmp[layer].buyables[data].sellAll, tmp[layer].buyables[data])" :class="{
			longUpg: true,
			can: player[layer].unlocked,
			locked: !player[layer].unlocked,
		}">{{tmp[layer].buyables.sellAllText ? tmp[layer].buyables.sellAllText : "Sell All"}}</button>`),
	});

	// system components below

	addNormalComponent('node-mark', {
		props: {layer: {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: template(`<div v-if='data'>
			<div v-if='data === true' class='star' :style='{
				position: "absolute",
				left: (offset - 10) + "px",
				top: (offset - 10) + "px",
				transform: "scale(" + (scale || 1) + ")",
			}'></div>
			<img v-else class='mark' :style='{
				position: "absolute",
				left: (offset - 22) + "px",
				top: (offset - 15) + "px",
				transform: "scale(" + (scale || 1) + ")",
			}' :src="data">
		</div>`),
	});

	addNormalComponent('tab-buttons', {
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
					]" @click="() => {
						player.subtabs[layer][name] = tab;
						updateTabFormats();
						needCanvasUpdate = true;
					}">
					{{tab}}
				</button>
			</div>
		</div>`),
	});

	addNormalComponent('tree-node', {
		props: ['node', 'size', 'prev'],
		data() {return {nodeShown, tmp, player, constructNodeStyle}},
		computed: {
			layer() {return isPlainObject(this.node) ? this.node.layer : this.node},
			isAlias() {return isPlainObject(this.node) && this.node.isAlias},
			symbol() {return this.isAlias ? tmp[this.layer].alias.symbol : tmp[this.layer].symbol},
			tooltipText() {
				if (typeof overrideTooltip === 'function' && overrideTooltip(this.layer)) {
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
				} else if (typeof overrideTreeNodeClick === 'function' && typeof overrideTreeNodeClick(this.layer) === 'function') {
					overrideTreeNodeClick(this.layer)();
				} else if (tmp[this.layer].isLayer) {
					if (tmp[this.layer].leftTab) showNavTab(this.layer, this.prev);
					else showTab(this.layer, this.prev);
				} else {
					run(layers[this.layer].onClick, layers[this.layer]);
				};
			},
		},
		template: template(`<button v-if="nodeShown(layer)" :id="layer + (isAlias ? '-alias' : '')" @click="onClick" :class="{
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
		}" :style="constructNodeStyle(layer, isAlias)">
			<span class="nodeLabel" v-html="(symbol && tmp[layer].image === undefined) ? symbol : ''"></span>
			<tooltip v-if="tmp[layer].tooltip != ''" :text="tooltipText"></tooltip>
			<node-mark :layer='layer' :data='tmp[layer].marked'></node-mark>
		</button>`),
	});

	addNormalComponent('layer-tab', {
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
			<button v-if="back" :class="back == 'big' ? 'big back' : 'back'" @click="goBack(layer)">&#8592;</button>
			<template v-if="tmp[layer].tabFormat">
				<template v-if="Array.isArray(tmp[layer].tabFormat)">
					<div v-if="spacing" :style="{height: spacing}"></div>
					<column :layer="layer" :data="tmp[layer].tabFormat"></column>
				</template>
				<template v-else>
					<div class="upgCol" :style="{
						'padding-top': (embedded ? '0' : '25px'),
						'margin-top': (embedded ? '-10px' : 0),
						'margin-bottom': '24px',
					}">
						<tab-buttons :style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
					</div>
					<layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true"></layer-tab>
					<column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content"></column>
				</template>
			</template>
			<template v-else>
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
			</template>
		</div>`),
	});

	addNormalComponent('overlay-head', {
		data() {return {player, format, formatTime, modInfo, tmp}},
		computed: {
			pausedDisplay() {
				if (typeof pausedDisplay === 'function') return pausedDisplay();
				if (typeof pausedDisplay !== 'undefined') return pausedDisplay;
			},
			overridePointDisplay() {
				if (typeof overridePointDisplay === 'function') return overridePointDisplay() || "";
				return "";
			},
			canGenPoints() {
				if (typeof canGenPoints === 'function') return canGenPoints();
				if (typeof canGenPoints !== 'undefined') return canGenPoints;
				return true;
			},
			pointGen() {
				if (typeof getPointGen === 'function') return getPointGen();
				return newDecimalZero();
			},
		},
		template: template(`<div class="overlayThing" style="
			padding-bottom: 10px;
			background-image: linear-gradient(var(--background), color-mix(in srgb, var(--background) 80%, transparent), color-mix(in srgb, var(--background) 60%, transparent), color-mix(in srgb, var(--background) 40%, transparent), transparent);
			z-index: 1000;
			position: relative;
		">
			<div v-if="player.devSpeed === 0 && pausedDisplay">
				<br>{{pausedDisplay}}<br>
			</div>
			<div v-else-if="player.devSpeed !== undefined && player.devSpeed !== 1">
				<br>Dev Speed: {{format(player.devSpeed)}}x<br>
			</div>
			<div v-if="player.offTime !== undefined">
				<br>Offline Time: {{formatTime(player.offTime.remain)}}<br>
			</div><br>
			<div v-if="overridePointDisplay" v-html="overridePointDisplay"></div>
			<div v-else>
				<template v-if="player.points.lt('1e1000')">You have </template>
				<h2 id="points">{{format(player.points)}}</h2>
				<template v-if="player.points.lt('e1000000')">&nbsp;{{modInfo.pointsName || "points"}}</template>
				<div v-if="canGenPoints">
					{{tmp.other.oompsMag !== 0 ?
						format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : (tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "")) + "s"
						: format(pointGen)
					}}/sec
				</div>
			</div>
			<template v-for="thing in tmp.displayThings">
				<div v-if="thing" v-html="thing"></div>
			</template>
		</div>`),
	});

	addNormalComponent('info-tab', {
		data() {return {modInfo, VERSION, TMT_VERSION, showTab, format, formatTime, hotkeys, player, tmp}},
		computed: {
			endPoints() {if (typeof endPoints !== "undefined") return endPoints},
		},
		template: template(`<div>
			<h2>{{modInfo.name}}</h2><br>
			<h3>{{VERSION.withName}}</h3><br>
			<template v-if="modInfo.author">
				Made by {{modInfo.author}}<br>
			</template><br>
			The Modding Tree <a href="https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md" target="_blank" class="link" style="font-size: 14px; display: inline">{{TMT_VERSION.tmtNum}}</a> by Acamaeda and FlamemasterNXF<br>
			The Prestige Tree made by Jacorb and Aarex<br><br>
			<div class="link" onclick="showTab('changelog-tab')">Changelog</div><br><br>
			<span v-if="modInfo.discordLink">
				<a class="link" :href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br><br>
			</span>
			<a class="link" href="https://discord.gg/F3xveHV" target="_blank" :style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br><br>
			<a class="link" href="https://discord.gg/wwQfgPa" target="_blank" style="font-size: 16px">Main Prestige Tree server</a><br>
			<template v-if="endPoints !== undefined">
				<br>Current Endgame: {{format(endPoints) + " " + (modInfo.pointsName || "points")}}<br>
			</template><br>
			Time Played: {{formatTime(player.timePlayed)}}<br><br>
			<h3>Hotkeys</h3><br><br>
			<template v-for="key in hotkeys">
				<template v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked">
					{{key.description}}<br>
				</template>
			</template><br>
			${mainPage ? `` : `<a class="link" href="../index.html">Back to main page</a><br><br>`}
		</div>`),
	});

	addNormalComponent('options-tab', {
		data() {return {optionGrid, run}},
		template: (() => {
			let template = `<table><tbody>`;
			for (let row = 0; row < optionGrid.length; row++) {
				template += `<tr>`;
				for (let index = 0; index < optionGrid[row].length; index++) {
					template += `<td><button class="opt"`;
					if (optionGrid[row][index].onClick) {
						template += ` onclick="optionGrid[${row}][${index}].onClick(`;
						if (optionGrid[row][index].onClick === toggleOpt && optionGrid[row][index].opt) {
							template += `'${optionGrid[row][index].opt}'`;
						};
						template += `)"`;
					};
					template += `>`;
					if (optionGrid[row][index].text) {
						template += `{{run(optionGrid[${row}][${index}].text, optionGrid[${row}][${index}])}}`;
					};
					template += `</button></td>`;
				};
				template += `</tr>`;
			};
			return template + `</tbody></table>`;
		})(),
	});

	addNormalComponent('tooltip', {
		props: ['text'],
		template: template(`<div class="tooltip" v-html="text"></div>`),
	});

	addNormalComponent('particle', {
		props: ['data'],
		data() {return {constructParticleStyle, run, getParticleImage}},
		template: template(`<div class='particle instant' :style="[
			constructParticleStyle(data, ${mainPage}),
			data.style,
		]" @click="run(data.onClick, data)" @mouseenter="run(data.onMouseOver, data)" @mouseleave="run(data.onMouseLeave, data)">
			<svg v-if="data.color" style="display: none">
				<mask :id="'pmask' + data.id">
					<image id="img" :href="getParticleImage(data, ${mainPage})" x="0" y="0" :width="data.width" :height="data.height"></image>
				</mask>
			</svg>
			<span v-if="data.text" v-html="data.text"></span>
		</div>`),
	});

	addNormalComponent('bg', {
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

	// add custom components
	if (typeof customComponents === "object" && isPlainObject(customComponents)) {
		for (const name in customComponents) {
			app.component(name, customComponents[name]);
		};
	};

	// mount the vue app
	app.mount(document.body);
};
