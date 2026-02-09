# Trees and tree customization

If you want to have something beyond the standard tree on the left tab, you can do that in [tree.js](/js/tree.js). You can change the layout of the tree, including making non-layer nodes, change it into something other than a tree, or hide the left tab altogether. This also introduces the "tree" component, which can be used in your layers as well.

## `layoutInfo`

The most important part is `layoutInfo`, containing:

- `startTab`: The id of the default tab to show on the right at the start.

- `startNavTab`: The id of the default tab to show on the left at the start.

- `showTree`: True if the tree tab should be shown at the start of the game. (The other tab will fill the whole page otherwise.)

- `treeLayout`: If present, overrides the tree layout and places nodes as you describe instead (explained in the next section).

> - `orderBranches` (additional feature): If `true`, the branch drawing is done in order according to their colors. (The theme colors are drawn first, in order: 0, then 1, then 2. Custom colors are drawn last and thus are always on top).
>
> - `htmlBranches` (additional feature): If `true`, branches are created using HTML instead of being drawn on a canvas. This solves two major problems that TMT's original branches have: the update delay while scrolling and the low resolution. NOTE: `orderBranches` has no effect when `htmlBranches` is `true`, due to technical limitations.

Additionally, if you want the main layout to not be a tree, you can edit the "tree-tab" layer at the bottom of tree.js to modify it just like a normal layer's tab. You can even switch between left tabs, using `showNavTab(layer)` to make that layer appear on the left.

## Trees

The tree component is defined as an array of arrays of names of layers or nodes to show in the tree. They work just like layers/nodes in the main tree, but branches between nodes will only work on the first node if you have duplicates.

Here is an example tree:

```js
[["p"],
 ["left", "blank", "right", "blank"]
 ["a", "b", "blank", "c", "weirdButton"]],
```

## Nodes

Nodes are non-layer buttons that can go in trees. They are defined similarly to layers, but with addNode instead of addLayer.

Features:

- `color`: **optional**. The node's color. (A string in hex format with a #)

- `symbol`: **optional** The text on the button (The id capitalized by default)

- `canClick()`: Returns true if the player can click the node.

- `onClick()`: The function called when the node is clicked.

- `layerShown()`: **optional**. A function returning a bool which determines if this node should be visible. It can also return "ghost", which will hide the layer, but its node will still take up space in its tree.

- `branches`: **optional**. An array of layer/node ids. On a tree, a line will appear from this node to all of the nodes in the list. Alternatively, an entry in the array can be a 2-element array consisting of the id and a color value. The color value can either be a string with a hex color code, or a number from 1-3 (theme-affected colors).

- `nodeStyle`: **optional**. A CSS object, where the keys are CSS attributes, which styles this node on the tree.

- `tooltip()` / `tooltipLocked()`: **optional**. Functions that return text, which is the tooltip for the node when the layer is unlocked or locked, respectively. By default the tooltips behave the same as in the original Prestige Tree.

- `row`: **optional**. The row that this node appears in (for the default tree).

- `position`: **optional**. Determines the horizontal position of the layer in its row in a default tree. By default, it uses the id, and layers/nodes are sorted in alphabetical order.

## Overriding functions (additional features)

- `overrideTooltip(layer)`: **OVERRIDE**. What this function returns overrides all tree node tooltips. You can use the layer parameter to make it only apply to certain layers. If it returns a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value, however, it will use the default.

- `overrideTreeNodeClick(layer)`: **OVERRIDE**. This function should return another function based on `layer`, which overrides what happens when you click that layer's tree node. If it does not return a function, it will use the default (which, if it is a layer, is going to that layer's tab).
