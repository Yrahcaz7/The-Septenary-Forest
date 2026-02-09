const layoutInfo = {
	startTab: "none",
	startNavTab: "tree-tab",
	showTree: true,
	// treeLayout: [["p"], ["b", "g"]],
	orderBranches: false,
	htmlBranches: true,
};

/* A "ghost" layer which offsets other layers in the tree
addNode("blank", {
	position: 0,
	row: "side",
	layerShown: "ghost",
});
*/

addLayer("tree-tab", {
	tabFormat: [["tree", () => layoutInfo.treeLayout || TREE_LAYERS]],
	previousTab: "",
	leftTab: true,
});
