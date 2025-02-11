var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,
    treeLayout: "",
	orderBranches: true,
};

addLayer("tree-tab", {
    tabFormat: [["tree", () => layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS]],
    previousTab: "",
    leftTab: true,
});
