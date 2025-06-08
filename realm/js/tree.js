const layoutInfo = {
	startTab: "I",
	startNavTab: "tree-tab",
	showTree: true,
};

addLayer("tree-tab", {
	tabFormat: [["tree", () => layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS]],
	previousTab: "",
	leftTab: true,
});
