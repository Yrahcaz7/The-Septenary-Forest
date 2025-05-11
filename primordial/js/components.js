const customComponents = {
	'assimilate-button': {
		props: ['layer'],
		data() {return {canAssimilate, player, assimilationReq, tmp, format, completeAssimilation}},
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
	},
};
