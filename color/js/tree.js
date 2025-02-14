const layoutInfo = {
	startTab: "none",
	startNavTab: "tree-tab",
	showTree: true,
	treeLayout: "",
};

addNode("blank", {
	row: 1,
	position: 0,
	layerShown: "ghost",
});

addLayer("tree-tab", {
	tabFormat: [["tree", () => layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS]],
	previousTab: "",
	leftTab: true,
});
