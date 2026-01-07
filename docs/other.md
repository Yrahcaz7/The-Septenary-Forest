# Other Things

## CSS

A good way to give your game a unique feel is to customize the appearance of it. Modifying the CSS files helps you to do that on a global level. The CSS is broken up into several files to make it easier to find what is relevant to you.

CSS tip: Every component is automatically given a CSS class with the same name as its layer id. You can use this to apply something specifically for a single layer! You can also combine classes, such as `.p.achievement` or `.c.locked`, to change specific things in specific layers.

## Temp

`temp`/`tmp` (either works) is a data structure that is a copy of layers (which contains all of the layer data you defined plus default things), but it replaces most functions with the result of calling those functions. E.g. if layer `p`'s `baseAmount` is based on points, `layers.p.baseAmount` is a function that returns `player.points`. If the player currently has 54 points, `temp.p.baseAmount` would be 54 (as a `Decimal`). You can use temp to improve performance.

## Custom options (additional feature)

For each tree, there is an options file (`options.js`). To add a new option, go to that file and add a new property to the object returned from `getStartOptions()` and a corresponding option object to `optionGrid`.

The following features go on individual option objects:

- `opt`: **optional**. The name of the corresponding option as a string.

- `text`: **optional**. The text to display on the option. Can be a function that returns updating text.

- `onClick()`: **optional**. The function to call when the option button is clicked. If this is `toggleOpt`, the `opt` argument will be set to the value of `opt` if it exists.

If you want any of the options to also be toggled by a keybind, you can use the following feature:

- `onKeyDown(key)`: **optional**. A function that is called whenever the player presses a key down. The `key` parameter is the pressed key (with the correct capitalization). Some variables that are useful here are `focused`, `shiftDown`, and `ctrlDown`.

    `focused` indicates if the player has a text input focused. Most keybinds should usually be disabled when this is true.

    `shiftDown` and `ctrlDown` indicate if the player has the shift key or control key pressed down, respectively.
