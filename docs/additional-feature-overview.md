# List of Additional Features

A comprehensive list of the additional features in The Septenary Forest that are not present in The Modding Tree.

## Useful Functions

- `hasBuyable(layer, id)`: Returns `true` if the player has one or more of the buyable.

- `milestoneEffect(layer, id)`: Returns the current effects of the milestone, if any.

## [Layer Features](layer-features.md)

- `softcaps`, `softcapPowers`: **OVERRIDE**. These are just like `softcap` and `softcapPower`, except they are arrays of values, allowing for multiple softcaps instead of just one. If either of these are missing or is an empty array, `softcap` and `softcapPower` are used instead. Both can also be functions that return an array, rather than an array itself.

- `onPrestigeIsAfterGain`: **optional**. A boolean indicating whether this layer's `onPrestige()` function triggers after prestige resource gain but before resetting anything (this also means that any relevant milestones and achievements will be updated to reflect the gain). Defaults to `false`, which makes `onPrestige()` trigger before both gain and reset.

- `logged`: **optional**. For normal layers, if this is a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) value, the resource gain becomes the log of the previous gain plus one. If it is exactly `true`, the log base is `10`, otherwise the log base is `new Decimal(logged)`. Can also be a function. **Has no effect on static layers.**

- `alias`: **optional**. An object (e.g. `{}`). Adds another tree node that refers to the same layer, with overrides for some layer features. Useful for adding a shortcut to a frequently used layer if your tree get very big.

    Overrides you can put on the alias object: `row`, `displayRow`, `symbol`, `position`, and `nodeStyle`. (The alias's `displayRow` defaults to the alias's `row`, or if it is not present, the layer's `displayRow`.)

## [`modInfo` Properties](main-mod-info.md)

- `useNewSaveSyntax`: **optional**. This combines the author name and the mod id to create a unique internal id. Any spaces in the name or id are treated as dashes. Similar to `id`, you shouldn't change this later (and if you use this, you shouldn't change `author` later, either). This is enabled by default.

- `friendlyErrors`: **optional**. When this is `false`, it disables my custom friendly errors and warnings that try to detect when things have gone wrong. (It's enabled by default because it can be very helpful and it shouldn't change anything functionally. Disabling it may slightly increase performance.)

## [`layoutInfo` Properties](trees-and-tree-customization.md#layoutinfo)

- `orderBranches`: If `true`, the branch drawing is done in order according to their colors. (The theme colors are drawn first, in order: 0, then 1, then 2. Custom colors are drawn last and thus are always on top).

- `htmlBranches`: If `true`, branches are created using HTML instead of being drawn on a canvas. This solves two major problems that TMT's original branches have: the update delay while scrolling and the low resolution. NOTE: `orderBranches` has no effect when `htmlBranches` is `true`, due to technical limitations.

## General Features

- `color`: **optional**. The background color of the buyable/clickable/upgrade if it can be purchased/clicked. (A string in hex format with a `#`.) The default is the layer's color. Can be a function.

Features on the main buyables/challenges/clickables/grid object:

- `needLayerUnlocked`: **optional**. If this is false, the layer need not be unlocked for the player to interact with buyables/challenges/clickables/gridables.

## Popup Features

- `popupTitle`: **optional**. The title of the popup generated when the achievement/milestone is gotten. If not present, the popup's title is "Achievement Unlocked!"/"Milestone Achieved!"

- `popupColor`: **optional**. The color of the popup generated when the achievement/milestone is gotten. If not present, the popup's color is the layer's color.

## [Buyable Features](buyables.md)

- `description`: A description of the buyable's effect. *You will also have to implement the effect where it is applied.* It can also be a function that returns updating text. Can use basic HTML.

- `effectDisplay(eff)`: **optional**. A function that returns a display of the current effects of the buyable with formatting. The `eff` argument holds the current effect of the buyable. Default displays nothing. Can use basic HTML.

- `currencyDisplayName`: **optional**. The name to display for the currency for the buyable.

- `costDisplay(cost)`: **OVERRIDE**. Overrides the cost display. The `cost` argument holds the current cost of the buyable. If you use this, `currencyDisplayName` does nothing.

- `boughtDisplay(x)`: **OVERRIDE**. Overrides the bought display. The `x` argument holds the amount of the buyable the player has.

NOTE: `display()` was renamed to `fullDisplay()` for consistency.

## [Challenge Features](challenges.md)

- `doReset`: **optional**. A boolean to determine if the challenge does a reset of its layer on enter and exit. Default is to not.

- `noAutoExit`: **optional**. A boolean to determine if the challenge should stay active on resets. Default is to not.

- `overrideResetsNothing`: **optional**. A boolean to determine if the challenge should still reset even if the layer's `resetsNothing` is true. Default is to not. This does not do anything unless `doReset` is true.

- `canEnter()`: **optional**. A function returning a boolean to determine if the challenge is enterable. Default behavior is to always allow entering.

- `canExit()`: **optional**. A function returning a boolean to determine if the challenge is exitable. Default behavior is to always allow exiting.

- `buttonText`: **optional**. An array that replaces the default button text. It has the following syntax: [`replace "Finish"`, `replace "Exit Early"`, `replace "Completed"`, `replace "Start"`, `replace "Locked"`]. [Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) values will be taken as you want the default for that value.

## [Milestone Features](milestones.md)

- `effect()`: **optional**. A function that calculates and returns the current values of any bonuses from the milestone. Can return a value or an object containing multiple values.

## [Upgrade Features](upgrades.md)

- `costDisplay`: **OVERRIDE**. Overrides the cost display. Can be a function. If it is a function, it can have an argument `cost`, which holds the current cost of the upgrade (useful for improving performance when `cost` is a function). Can use basic HTML.

## Components

For use in [custom tab layouts](custom-tab-layouts.md).

- `custom-resource-display`: The same as `display-text`, but uses the formatting of `resource-display`.

- `contained-grid`: Displays the gridable grid for the layer in a contained div. The argument is required. The argument can either be the max width of the containing div or an array: `[max width, list of rows]`. If the argument only indicates the component's max width, the component includes all of the layer's grid rows.

## Global Variables/Functions

- `endPoints`: **OVERRIDE**. An alternative to `isEndgame()`. It is a `Decimal` value that sets the game end to that amount of points. Also displays this amount along with your point name in the info tab if you choose to use it.

- `onLoad()`: **optional**. A function that runs when the game is finished loading, if it exists. Use this if you have additional custom things that need loading or setup!

- `update(diff)`: **optional**. This function is called every game tick. Use it for any passive resource production or time-based things. `diff` is the time since the last tick.

- `onReset(resettingLayer)`: **optional**. This function is called whenever any layer resets. Use this to reset any added player data that needs resetting based on `resettingLayer`.

- `getPoints()`: **OVERRIDE**. If this function returns a `Decimal`, `game.points` is set to that amount every tick instead of increasing based on `getPointGen()`. Can be used to implement a different method of point gain.

- `overridePointDisplay()`: **OVERRIDE**. What this function returns overrides the point display at the top of the page. Any extra display things will still be displayed; this just replaces the point and point per second display. If it returns a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value, however, it will use the default.

- `extraMainDisplay(layer)`: **optional**. What this function returns adds to the main point display of each layer. It inserts it after the amount, but before the name. (Can use basic HTML.) For example, if you had:

    ```js
    function extraMainDisplay(layer) {
        if (layer == "p") return "Super <b>Ultra</b> ";
    };
    ```

    In a layer with the id "p" where you have 10 prestige points, it would show "You have **10** Super **Ultra** prestige points" for the main point display instead of "You have **10** prestige points" (and in any other layer the main display would be the same).

- `currentlyText`: **OVERRIDE**. This replaces the text that says `"Currently: "` on all upgrades and buyables that use `effectDisplay` and all challenges that use `rewardDisplay`. Can use basic HTML. (Can also be function.)

- `pausedDisplay`: **OVERRIDE**. Overrides the `devSpeed` display when `devSpeed` is `0`. Can be a function.

- `overrideTooltip(layer)`: **OVERRIDE**. What this function returns overrides all tree node tooltips. You can use the layer parameter to make it only apply to certain layers. If it returns a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value, however, it will use the default.

- `overrideTreeNodeClick(layer)`: **OVERRIDE**. This function should return another function based on `layer`, which overrides what happens when you click that layer's tree node. If it does not return a function, it will use the default (which, if it is a layer, is going to that layer's tab).

## Other

- A more fleshed-out [custom options system](other.md#custom-options-additional-feature).

- A more fleshed-out [custom component system](custom-components.md).

- [Functions to simplify the implementation of the `buy()` method of buyables](buyables.md).

- Additional [`startData()` values](layer-features.md) can be omitted (`unlocked` and sometimes `points`).

- The capability to easily make multiple trees in the same repository. Useful if you want to modify the files of the modding engine and have it apply to all of your trees.

- Various minor bugfixes and default style changes.
