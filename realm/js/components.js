const customComponents = {
	"mana-auto-percent-slider": {
		props: ["layer"],
		data() { return {player, format} },
		template: template(`<div class="tooltipBox">
			<tooltip :text="'Ternary: autocast when mana is at least ' + player[layer].autoPercent + '% of max mana (' + format(player[layer].maxMana.mul(player[layer].autoPercent / 100)) + ')'"></tooltip>
			<input type="range" v-model="player[layer].autoPercent" min="0" max="100" style='width: 500px'>
		</div>`),
	},
};
