var app;

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
		computed: {
			key() {return this.$vnode.key}
		},
		template: components.row,
	});

	// data = an array of Components to be displayed in a column
	Vue.component('column', {
		props: ['layer', 'data'],
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
		template: components.challenges,
	});

	// data = id
	Vue.component('challenge', {
		props: ['layer', 'data'],
		template: components.challenge,
	});

	Vue.component('upgrades', {
		props: ['layer', 'data'],
		template: components.upgrades,
	});

	// data = id
	Vue.component('upgrade', {
		props: ['layer', 'data'],
		template: components.upgrade,
	});

	Vue.component('milestones', {
		props: ['layer', 'data'],
		template: components.milestones,
	});

	// data = id
	Vue.component('milestone', {
		props: ['layer', 'data'],
		template: components.milestone,
	});

	Vue.component('toggle', {
		props: ['layer', 'data'],
		template: components.toggle,
	});

	Vue.component('prestige-button', {
		props: ['layer'],
		template: components.prestige_button,
	});

	Vue.component('assimilate-button', {
		props: ['layer'],
		template: components.assimilate_button,
	});

	// Displays the main resource for the layer
	Vue.component('main-display', {
		props: ['layer', 'data'],
		template: components.main_display,
	});

	// Displays the base resource for the layer, as well as the best and total values for the layer's currency, if tracked
	Vue.component('resource-display', {
		props: ['layer'],
		template: components.resource_display,
	});

	Vue.component('buyables', {
		props: ['layer', 'data'],
		template: components.buyables,
	});

	Vue.component('buyable', {
		props: ['layer', 'data'],
		template: components.buyable,
		data() {return {interval: false, time: 0}},
		methods: {
			start() {
				if (!this.interval) {
					this.interval = setInterval((function() {
						if (this.time >= 5) buyBuyable(this.layer, this.data);
						this.time = this.time + 1;
					}).bind(this), 50);
				};
			},
			stop() {
				clearInterval(this.interval);
				this.interval = false;
			  	this.time = 0;
			},
		},
	});

	Vue.component('respec-button', {
		props: ['layer'],
		template: components.respec_button,
	});
	
	Vue.component('clickables', {
		props: ['layer', 'data'],
		template: components.clickables,
	});

	// data = id of clickable
	Vue.component('clickable', {
		props: ['layer', 'data'],
		template: components.clickable,
		data() {return {interval: false, time: 0}},
		methods: {
			start() {
				if (!this.interval && layers[this.layer].clickables[this.data].onHold) {
					this.interval = setInterval((function() {
						let c = layers[this.layer].clickables[this.data];
						if (this.time >= 5 && run(c.canClick, c)) run(c.onHold, c);
						this.time = this.time + 1;
					}).bind(this), 50)
				};
			},
			stop() {
				clearInterval(this.interval);
				this.interval = false;
			  	this.time = 0;
			},
		},
	})

	Vue.component('master-button', {
		props: ['layer'],
		template: components.master_button,
	});

	// data = optionally, array of rows for the grid to show
	Vue.component('grid', {
		props: ['layer', 'data'],
		template: components.grid,
	});

	Vue.component('gridable', {
		props: ['layer', 'data'],
		template: components.gridable,
		data() {return {interval: false, time: 0}},
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
						this.time = this.time + 1;
					}).bind(this), 50);
				};
			},
			stop() {
				clearInterval(this.interval);
				this.interval = false;
			  	this.time = 0;
			},
		},
	})

	// data = id of microtab family
	Vue.component('microtabs', {
		props: ['layer', 'data'],
		computed: {
			currentTab() {return player.subtabs[layer][data]}
		},
		template: components.microtabs,
	});

	// data = id of the bar
	Vue.component('bar', {
		props: ['layer', 'data'],
		computed: {
			style() {return constructBarStyle(this.layer, this.data)}
		},
		template: components.bar,
	});

	Vue.component('achievements', {
		props: ['layer', 'data'],
		template: components.achievements,
	});

	// data = id
	Vue.component('achievement', {
		props: ['layer', 'data'],
		template: components.achievement,
	});

	// Data is an array with the structure of the tree
	Vue.component('tree', {
		props: ['layer', 'data'],
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

	Vue.component('thing-tree', {
		props: ['layer', 'data', 'type'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: components.thing_tree,
	});

	// Updates the value in player[layer][data]
	Vue.component('text-input', {
		props: ['layer', 'data'],
		template: components.text_input,
	});

	// Updates the value in player[layer][data][0]
	Vue.component('slider', {
		props: ['layer', 'data'],
		template: components.slider,
	});

	// Updates the value in player[layer][data[0]], options are an array in data[1]
	Vue.component('drop-down', {
		props: ['layer', 'data'],
		template: components.drop_down,
	});

	// These are for buyables, data is the id of the corresponding buyable
	Vue.component('sell-one', {
		props: ['layer', 'data'],
		template: components.sell_one,
	});
	
	Vue.component('sell-all', {
		props: ['layer', 'data'],
		template: components.sell_all,
	});

	// system components

	Vue.component('node-mark', {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: components.node_mark,
	});

	Vue.component('tab-buttons', {
		props: ['layer', 'data', 'name'],
		template: components.tab_buttons,
	});

	Vue.component('tree-node', {
		props: ['layer', 'abb', 'size', 'prev'],
		template: components.tree_node,
	});

	Vue.component('layer-tab', {
		props: ['layer', 'back', 'spacing', 'embedded'],
		template: components.layer_tab,
	});

	Vue.component('overlay-head', {
		template: components.overlay_head,
	});

	Vue.component('info-tab', {
		template: components.info_tab,
	});

	Vue.component('options-tab', {
		template: components.options_tab,
	});

	Vue.component('tooltip', {
		props: ['text'],
		template: components.tooltip,
	});

	Vue.component('particle', {
		props: ['data', 'index'],
		template: components.particle,
	});

	Vue.component('bg', {
		props: ['layer'],
		template: components.bg,
	});

	app = new Vue({
		el: "#app",
		data: {
			player,
			tmp,
			options,
			Decimal,
			format,
			formatWhole,
			formatTime,
			formatSmall,
			focused,
			getThemeName,
			layerunlocked,
			doReset,
			buyUpg,
			buyUpgrade,
			startChallenge,
			milestoneShown,
			keepGoing,
			hasUpgrade,
			hasMilestone,
			hasAchievement,
			hasChallenge,
			maxedChallenge,
			getBuyableAmount,
			getClickableState,
			inChallenge,
			canAffordUpgrade,
			canBuyBuyable,
			canCompleteChallenge,
			subtabShouldNotify,
			subtabResetNotify,
			challengeStyle,
			challengeButtonText,
			constructBarStyle,
			constructParticleStyle,
			VERSION,
			LAYERS,
			hotkeys,
			activePopups,
			particles,
			mouseX,
			mouseY,
			shiftDown,
			ctrlDown,
			run,
			gridRun,
		},
	});
};
