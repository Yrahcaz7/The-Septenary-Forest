const layoutInfo = {
	startTab: "I",
	startNavTab: "tree-tab",
	showTree: true,
	htmlBranches: true,
};

addLayer("tree-tab", {
	tabFormat: [["tree", () => layoutInfo.treeLayout || TREE_LAYERS]],
	leftTab: true,
});
