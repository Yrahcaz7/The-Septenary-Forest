const layoutInfo = {
	startTab: "none",
	startNavTab: "tree-tab",
	showTree: true,
	treeLayout: "",
};

// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
	position: 1,
	row: "side",
	layerShown: "ghost",
});

addLayer("tree-tab", {
	tabFormat: [["tree", () => layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS]],
	previousTab: "",
	leftTab: true,
});
