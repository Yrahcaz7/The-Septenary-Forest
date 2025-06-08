const customComponents = {
	"bulk-button": {
		props: ["layer", "data"],
		data() { return {player, tmp, formatWhole} },
		computed: {
			bulkAmount() { return new Decimal(10).pow(this.data) },
		},
		template: template(`<button :class="'upg tooltipBox ' + (player[layer].bulk.eq(bulkAmount) ? 'locked' : 'can')" :style="[(player[layer].bulk.eq(bulkAmount) ? {} : {'background-color': tmp[layer].color}), {
			width: 'min-content',
			'min-height': '30px',
			'border-radius': '5px',
		}]" @click="player[layer].bulk = bulkAmount">
			<h2>{{formatWhole(bulkAmount)}}x</h2>
		</button>`),
	},
	"mana-auto-percent-slider": {
		props: ["layer"],
		data() { return {player, format} },
		template: template(`<div class="tooltipBox">
			<tooltip :text="'Ternary: autocast when mana is at least ' + player[layer].autoPercent + '% of max mana (' + format(player[layer].maxMana.mul(player[layer].autoPercent / 100)) + ')'"></tooltip>
			<input type="range" v-model="player[layer].autoPercent" min="0" max="100" style="width: 500px">
		</div>`),
	},
	"max-spell-cast": {
		props: ["layer", "data"],
		data() { return {tmp, castSpell, formatWhole} },
		computed: {
			spellCasts() { return player[this.layer].mana.div(getSpellCost(this.data - 11)).floor() },
		},
		template: template(`<button :class="'upg tooltipBox ' + (tmp[layer].clickables[data].canClick ? 'can' : 'locked')" :style="[(tmp[layer].clickables[data].canClick ? {'background-color': tmp[layer].clickables[data].color} : {}), {
			'border-radius': '0',
			width: '125px',
			'min-height': '25px',
			transform: 'none',
		}]" @click="castSpell(data - 11, spellCasts)">
			Cast Max ({{formatWhole(spellCasts)}}x)
		</button>`),
	},
	"autocast-toggle": {
		props: ["layer", "data"],
		data() { return {tmp, hasUpgrade} },
		computed: {
			unlockedModes() { return (hasUpgrade(this.layer, 103) ? 2 : 1) },
			canClick() { return hasUpgrade(this.layer, 101) },
			spellOrder() { return player[this.layer].spellOrder.indexOf(this.data - 11) },
			activeMode() { return getClickableState(this.layer, this.data) },
		},
		methods: {
			toggle(mode) {
				if (!this.canClick) return;
				setClickableState(this.layer, this.data, mode === this.activeMode ? 0 : mode);
				if (this.spellOrder >= 0) player[this.layer].spellOrder.splice(this.spellOrder, 1);
				if (mode === this.activeMode) player[this.layer].spellOrder.push(this.data - 11);
			},
		},
		template: template(`<div>
			<button v-for="mode in unlockedModes" :class="'upg tooltipBox ' + (canClick ? 'can' : 'locked')" :style="[(canClick ? {'background-color': (mode === 2 ? tmp[layer].color : tmp[layer].clickables[data].color)} : {}), {
				'border-radius': '0px 0px ' + (mode < unlockedModes ? '0' : '25') + 'px ' + (mode > 1 ? '0' : '25') + 'px',
				width: (125 / unlockedModes) + 'px',
				'min-height': 'min-content',
				transform: 'none',
			}]" @click="toggle(mode)">
				<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#000000" stroke-width="2">
					<g id="arrow">
						<path d="m 5,20 a 15,15 0 0 1 11,-14.5 a 15,15 0 0 1 17,7" style="stroke-linecap: round"/>
						<path d="m 34,5 v 8 h -8" style="stroke-linecap: round; stroke-linejoin: round"/>
					</g>
					<use href="#arrow" transform-origin="20 20" transform="rotate(180)"/>
					<text v-if="mode === activeMode" x="20" y="19.9" text-anchor="middle" dominant-baseline="central" fill="#000000" stroke="none" style="font-size: 15px">{{hasUpgrade(layer, 102) ? this.spellOrder + 1 : "ON"}}</text>
				</svg>
			</button>
		</div>`),
	},
};
