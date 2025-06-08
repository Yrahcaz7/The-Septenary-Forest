const layoutInfo = {
	startTab: "none",
	startNavTab: "tree-tab",
	showTree: true,
};

addLayer("tree-tab", {
	tabFormat: [["tree", () => layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS]],
	leftTab: true,
});
