let canvas;
let ctx;

window.addEventListener("resize", resizeCanvas);

function retrieveCanvasData() {
	const treeCanv = document.getElementById("treeCanvas");
	if (!treeCanv) return false;
	canvas = treeCanv;
	ctx = canvas.getContext("2d");
	return true;
};

function resizeCanvas() {
	if (!retrieveCanvasData()) return;
	canvas.width = 0;
	canvas.height = 0;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	drawTree();
};

let colors_theme;

function drawTree() {
	if (!retrieveCanvasData()) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const queuedBranches = [[], [], [], []];
	for (const layer in layers) {
		if (tmp[layer].layerShown && tmp[layer].branches) {
			for (const branch in tmp[layer].branches) {
				if (layoutInfo.orderBranches) {
					let data = tmp[layer].branches[branch];
					queuedBranches[Array.isArray(data) ? (data[1] === 1 || data[1] === 2 || data[1] === 3 ? data[1] - 1 : 3) : 0].push([layer, data]);
				} else {
					drawTreeBranch(layer, tmp[layer].branches[branch]);
				};
			};
		};
		drawComponentBranches(layer, tmp[layer].upgrades, "upgrade-");
		drawComponentBranches(layer, tmp[layer].buyables, "buyable-");
		drawComponentBranches(layer, tmp[layer].clickables, "clickable-");
	};
	for (let priority = 0; priority < queuedBranches.length; priority++) {
		for (let index = 0; index < queuedBranches[priority].length; index++) {
			drawTreeBranch(...queuedBranches[priority][index]);
		};
	};
};

function drawComponentBranches(layer, data, prefix) {
	for (const id in data) {
		if (data[id].branches) {
			for (const branch in data[id].branches) {
				drawTreeBranch(id, data[id].branches[branch], prefix + layer + "-");
			};
		};
	};
};

function drawTreeBranch(num1, data, prefix) { // taken from Antimatter Dimensions & adjusted slightly
	let num2 = data;
	let color_id = 1;
	let width = 15;
	if (Array.isArray(data)) {
		num2 = data[0];
		color_id = data[1];
		width = data[2] || width;
	};
	if (typeof color_id == "number") {
		color_id = colors_theme[color_id];
	};
	if (prefix) {
		num1 = prefix + num1;
		num2 = prefix + num2;
	};
	if (document.getElementById(num1) == null || document.getElementById(num2) == null) {
		return;
	};
	let start = document.getElementById(num1).getBoundingClientRect();
	let end = document.getElementById(num2).getBoundingClientRect();
	let x1 = start.left + (start.width / 2) + document.body.scrollLeft;
	let y1 = start.top + (start.height / 2) + document.body.scrollTop;
	let x2 = end.left + (end.width / 2) + document.body.scrollLeft;
	let y2 = end.top + (end.height / 2) + document.body.scrollTop;
	ctx.lineWidth = width;
	ctx.strokeStyle = color_id;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
};
