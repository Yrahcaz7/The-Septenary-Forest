const customComponents = {
	'node-mark': {
		props: {layer: {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: template(`<div v-if='data'>
			<div v-if='data === "moon"'>
				<div class='moon num1' :style='{
					left: (offset - 25) + "px",
					top: (offset) + "px",
					transform: "scale(" + (scale || 1) + ")",
				}'></div>
				<div class='moon num2' :style='{
					left: (offset - 60) + "px",
					top: (offset) + "px",
					transform: "scale(" + (scale || 1) + ")",
				}'></div>
				<div class='moon num3' :style='{
					left: (offset - 95) + "px",
					top: (offset) + "px",
					transform: "scale(" + (scale || 1) + ")",
				}'></div>
			</div>
			<div v-else-if='data === true' class='star' :style='{
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
	},
};
