const customComponents = {
	"mana-auto-percent-slider": {
		props: ["layer"],
		data() { return {player, format} },
		template: template(`<div class="tooltipBox">
			<tooltip :text="'Ternary: autocast when mana is at least ' + player[layer].autoPercent + '% of max mana (' + format(player[layer].maxMana.mul(player[layer].autoPercent / 100)) + ')'"></tooltip>
			<input type="range" v-model="player[layer].autoPercent" min="0" max="100" style='width: 500px'>
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
		data() { return {tmp} },
		computed: {
			unlockedModes() { return (hasUpgrade(this.layer, 103) ? 2 : 1) },
			canClick() { return hasUpgrade(this.layer, 101) },
			canOrder() { return hasUpgrade(this.layer, 102) },
			spellOrder() { return player[this.layer].spellOrder.indexOf(this.data - 11) },
			activeMode() { return getClickableState(this.layer, this.data) },
		},
		methods: {
			toggle(mode) {
				if (!this.canClick) return;
				setClickableState(this.layer, this.data, mode === this.activeMode ? 0 : mode);
				if (this.canOrder && mode === this.activeMode) player[this.layer].spellOrder.push(player[this.layer].spellOrder.splice(this.spellOrder, 1)[0]);
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
					<text v-if="mode === activeMode" x="20" y="19.9" text-anchor="middle" dominant-baseline="central" fill="#000000" stroke="none" style="font-size: 15px">{{this.canOrder ? this.spellOrder + 1 : "ON"}}</text>
				</svg>
			</button>
		</div>`),
	},
};
