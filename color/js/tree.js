const layoutInfo = {
	startTab: "none",
	startNavTab: "tree-tab",
	showTree: true,
};

addNode("blank", {
	row: 1,
	position: 0,
	layerShown: "ghost",
});

addLayer("tree-tab", {
	tabFormat: [["tree", () => layoutInfo.treeLayout || TREE_LAYERS]],
	leftTab: true,
});
