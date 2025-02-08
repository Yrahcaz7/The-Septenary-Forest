let app;

function loadVue() {
	for (const key in components) {
		if (Object.hasOwnProperty.call(components, key)) {
			components[key] = ("" + components[key]).replace(/[\n\t]/g, "");
		};
	};

	// data = a function returning the content (actually HTML)
	Vue.component('display-text', {
		props: ['layer', 'data'],
		template: components.display_text,
	});

	// data = a function returning the content (actually HTML)
	Vue.component('raw-html', {
		props: ['layer', 'data'],
		template: components.display_text,
	});

	// data = a function returning the content (actually HTML)
	Vue.component('custom-resource-display', {
		props: ['layer', 'data'],
		template: components.custom_resource_display,
	});

	// Blank space, data = optional height in px or pair with width and height in px
	Vue.component('blank', {
		props: ['layer', 'data'],
		template: components.blank,
	});

	// Displays an image, data is the URL
	Vue.component('display-image', {
		props: ['layer', 'data'],
		template: components.display_image,
	});
		
	// data = an array of Components to be displayed in a row
	Vue.component('row', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		computed: {
			key() {return this.$vnode.key}
		},
		template: components.row,
	});

	// data = an array of Components to be displayed in a column
	Vue.component('column', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		computed: {
			key() {return this.$vnode.key}
		},
		template: components.column,
	});

	// data [other layer, tabformat for within proxy]
	Vue.component('layer-proxy', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: components.layer_proxy,
	});

	Vue.component('infobox', {
		props: ['layer', 'data'],
		data() {return {tmp, player}},
		template: components.infobox,
	});

	// Data = width in px, by default fills the full area
	Vue.component('h-line', {
		props: ['layer', 'data'],
		template: components.h_line,
	});

	// Data = height in px, by default is bad
	Vue.component('v-line', {
		props: ['layer', 'data'],
		template: components.v_line,
	});

	Vue.component('challenges', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: components.challenges,
	});

	// data = id
	Vue.component('challenge', {
		props: ['layer', 'data'],
		data() {return {tmp, options, maxedChallenge, inChallenge, challengeStyle, player, canUseChallenge, startChallenge, challengeButtonText, layers, run, format, modInfo}},
		template: components.challenge,
	});

	Vue.component('upgrades', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: components.upgrades,
	});

	// data = id
	Vue.component('upgrade', {
		props: ['layer', 'data'],
		data() {return {tmp, buyUpg, hasUpgrade, canAffordUpgrade, layers, run, formatWhole}},
		template: components.upgrade,
	});

	Vue.component('milestones', {
		props: ['layer', 'data'],
		data() {return {tmp, milestoneShown}},
		template: components.milestones,
	});

	// data = id
	Vue.component('milestone', {
		props: ['layer', 'data'],
		data() {return {tmp, milestoneShown, hasMilestone, run, layers}},
		template: components.milestone,
	});

	Vue.component('toggle', {
		props: ['layer', 'data'],
		data() {return {tmp, toggleAuto, player}},
		template: components.toggle,
	});

	Vue.component('prestige-button', {
		props: ['layer'],
		data() {return {tmp, prestigeButtonText, doReset}},
		template: components.prestige_button,
	});

	Vue.component('assimilate-button', {
		props: ['layer'],
		data() {return {canAssimilate, player, assimilationReq, tmp, completeAssimilation}},
		template: components.assimilate_button,
	});

	// Displays the main resource for the layer
	Vue.component('main-display', {
		props: ['layer', 'data'],
		data() {return {player, tmp, format, formatWhole, extraMainDisplay, layers, run}},
		template: components.main_display,
	});

	// Displays the base resource for the layer, as well as the best and total values for the layer's currency, if tracked
	Vue.component('resource-display', {
		props: ['layer'],
		data() {return {tmp, formatWhole, format, player}},
		template: components.resource_display,
	});

	Vue.component('buyables', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: components.buyables,
	});

	Vue.component('buyable', {
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
		template: components.buyable,
	});

	Vue.component('respec-button', {
		props: ['layer'],
		data() {return {tmp, player, respecBuyables}},
		template: components.respec_button,
	});
	
	Vue.component('clickables', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: components.clickables,
	});

	// data = id of clickable
	Vue.component('clickable', {
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
		template: components.clickable,
	})

	Vue.component('master-button', {
		props: ['layer'],
		data() {return {tmp, run, player}},
		template: components.master_button,
	});

	// data = optionally, array of rows for the grid to show
	Vue.component('grid', {
		props: ['layer', 'data'],
		data() {return {tmp, run, layers}},
		template: components.grid,
	});

	// data = the max width of the grid or [max width, array of rows]
	Vue.component('contained-grid', {
		props: ['layer', 'data'],
		data() {return {tmp, run, layers}},
		template: components.contained_grid,
	});

	Vue.component('gridable', {
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
		template: components.gridable,
	})

	// data = id of microtab family
	Vue.component('microtabs', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		computed: {
			currentTab() {return player.subtabs[layer][data]}
		},
		template: components.microtabs,
	});

	// data = id of the bar
	Vue.component('bar', {
		props: ['layer', 'data'],
		data() {return {tmp, run, layers}},
		computed: {
			style() {return constructBarStyle(this.layer, this.data)}
		},
		template: components.bar,
	});

	Vue.component('achievements', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		template: components.achievements,
	});

	// data = id
	Vue.component('achievement', {
		props: ['layer', 'data'],
		data() {return {tmp, hasAchievement, achievementStyle}},
		template: components.achievement,
	});

	// Data is an array with the structure of the tree
	Vue.component('tree', {
		props: ['layer', 'data'],
		data() {return {tmp}},
		computed: {
			key() {return this.$vnode.key}
		},
		template: components.tree,
	});

	// Data is an array with the structure of the tree
	Vue.component('upgrade-tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: components.upgrade_tree,
	})

	// Data is an array with the structure of the tree
	Vue.component('buyable-tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: components.buyable_tree,
	})

	// Data is an array with the structure of the tree
	Vue.component('clickable-tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: components.clickable_tree,
	})

	// Data is an array with the structure of the tree
	Vue.component('thing-tree', {
		props: ['layer', 'data', 'type'],
		data() {return {tmp}},
		computed: {
			key() {return this.$vnode.key}
		},
		template: components.thing_tree,
	});

	// Updates the value in player[layer][data]
	Vue.component('text-input', {
		props: ['layer', 'data'],
		data() {return {player, focused, toValue}},
		template: components.text_input,
	});

	// Updates the value in player[layer][data][0]
	Vue.component('slider', {
		props: ['layer', 'data'],
		data() {return {player}},
		template: components.slider,
	});

	// Updates the value in player[layer][data[0]], options are an array in data[1]
	Vue.component('drop-down', {
		props: ['layer', 'data'],
		data() {return {player}},
		template: components.drop_down,
	});

	// These are for buyables, data is the id of the corresponding buyable
	Vue.component('sell-one', {
		props: ['layer', 'data'],
		data() {return {tmp, run, player}},
		template: components.sell_one,
	});
	
	Vue.component('sell-all', {
		props: ['layer', 'data'],
		data() {return {tmp, run, player}},
		template: components.sell_all,
	});

	// system components

	Vue.component('node-mark', {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: components.node_mark,
	});

	Vue.component('tab-buttons', {
		props: ['layer', 'data', 'name'],
		data() {return {subtabShouldNotify, subtabResetNotify, tmp, defaultGlow, player, updateTabFormats, needCanvasUpdate}},
		template: components.tab_buttons,
	});

	Vue.component('tree-node', {
		props: ['layer', 'abb', 'size', 'prev'],
		data() {return {nodeShown, shiftDown, options, player, overrideTreeNodeClick, tmp, showNavTab, showTab, constructNodeStyle, overrideTooltip, formatWhole}},
		template: components.tree_node,
	});

	Vue.component('layer-tab', {
		props: ['layer', 'back', 'spacing', 'embedded'],
		data() {return {tmp, player, goBack}},
		template: components.layer_tab,
	});

	Vue.component('overlay-head', {
		data() {return {player, format, formatTime, overridePointDisplay, modInfo, canGenPoints, tmp, formatSmall, getPointGen}},
		template: components.overlay_head,
	});

	Vue.component('info-tab', {
		data() {return {modInfo, VERSION, TMT_VERSION, showTab, endPoints, format, formatTime, hotkeys, player, tmp}},
		template: components.info_tab,
	});

	Vue.component('options-tab', {
		data() {return {save, toggleOpt, formatOption, options, hardReset, displayMode, fullColorDisplay, DISPLAY_MODES, exportSave, importSave, COLOR_DISPLAYS, switchTheme, getThemeName, adjustMSDisp, MS_DISPLAYS, MS_SETTINGS, player}},
		template: components.options_tab,
	});

	Vue.component('tooltip', {
		props: ['text'],
		template: components.tooltip,
	});

	Vue.component('particle', {
		props: ['data', 'index'],
		data() {return {constructParticleStyle, run}},
		template: components.particle,
	});

	Vue.component('bg', {
		props: ['layer'],
		template: components.bg,
		data() {return {tmp, player}},
	});

	app = new Vue({
		el: "#app",
		data: {
			tmp,
			player,
			modInfo,
			VERSION,
			formatTime,
			hardReset,
			keepGoing,
			readData,
			layoutInfo,
			resizeCanvas,
			showTab,
			goBack,
			OTHER_LAYERS,
			activePopups,
			particles,
			LAYERS,
		},
	});
};
