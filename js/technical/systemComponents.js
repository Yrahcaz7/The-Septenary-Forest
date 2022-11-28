var systemComponents = {
	'tab-buttons': {
		props: ['layer', 'data', 'name'],
		template: tab_buttons,
	},

	'tree-node': {
		props: ['layer', 'abb', 'size', 'prev'],
		template: tree_node,
	},

	'layer-tab': {
		props: ['layer', 'back', 'spacing', 'embedded'],
		template: layer_tab,
	},

	'overlay-head': {
		template: overlay_head,
    },

    'info-tab': {
        template: info_tab,
    },

    'options-tab': {
        template: options_tab,
    },

	'tooltip' : {
		props: ['text'],
		template: '<div class="tooltip" v-html="text">',
	},

	'node-mark': {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: node_mark,
	},

	'particle': {
		props: ['data', 'index'],
		template: _particle,
	},

	'bg': {
		props: ['layer'],
		template: _bg,
	},
};
