# mod.js

Most of the non-layer code and data that you're likely to edit is here in [mod.js](/js/mod.js).
Everything in [mod.js](/js/mod.js) will not be altered by updates, besides the addition of new things.

Here's a breakdown of what's in it:

- `modInfo` is where most of the basic configuration for the mod is. It contains:

    - `name`: The name of your mod. (a string)
    - `id`: The id for your mod, a unique string that is used to determine savefile location. Be sure to set it when you start making a mod, and don't change it later because it will erase all saves.
    - `author`: The name of the author, displayed in the info tab.
    - `pointsName`: **optional**. This changes what is displayed instead of "points" for the main currency. (It does not affect it in the code.)
    - `modFiles`: An array of file addresses which will be loaded for this mod. Using smaller files makes it easier to find what you're looking for.
    - `discordName`, `discordLink`: **optional**. If you have a Discord server or other discussion place, you can add a link to it.
        "discordName" is the text on the link, and "discordLink" is the url of an invite. If you're using a Discord invite, please make sure it's set to never expire.
    - `offlineLimit`: A number that is the maximum amount of offline time that the player can accumulate, in hours. Any extra time is lost.
        This is useful because most of these mods are fast-paced enough that too much offline time ruins the balance, such as the time in between updates. That is why I suggest developers disable offline time on their own savefile.
    - `initialStartPoints`: **optional**. A Decimal for the amount of points a new player should start with.
    - `useNewSaveSyntax`: **optional** *(additional feature)*. This combines the author name and the mod id to create a unique internal id. Any spaces in the name or id are treated as dashes. Similar to `id`, you shouldn't change this later (and if you use this, you shouldn't change `author` later, either). This is enabled by default.
    - `friendlyErrors`: **optional** *(additional feature)*. When this is false, it disables my custom friendly errors and warnings that try to detect when things have gone wrong. (It's enabled by default because it can be very helpful and it shouldn't change anything functionally. Disabling it may slightly increase performance.)

- `VERSION` is used to describe the current version of your mod. It contains:

    - `num`: The mod's version number, displayed at the top right of the tree tab.
    - `name`: The version's name, displayed alongside the number in the info tab.
    - `pre`: **optional**. The prerelease version number, if it is a prerelease.
    - `beta`: **optional**. The beta version number, if it is beta.

- `changelog` is the HTML displayed in the changelog tab.

- `doNotCallTheseFunctionsEveryTick` is very important, if you are adding non-standard functions. TMT calls every function anywhere in "layers" every tick to store the result, unless specifically told not to. Functions that are used to do an action need to be identified. "Official" functions (those in the documentation) are all fine, but if you make any new ones, add their names to this array. (This feature is optional.)

```js
// The ones here are examples. All official functions are already taken care of.
const doNotCallTheseFunctionsEveryTick = ["doReset", "buy", "onPurchase", "blowUpEverything"];
```

- `winText`: **optional**. Sets the test to display when the player wins the game. (Can use basic HTML). This can be a string or a function that returns a string. If  absent or is/returns an empty string, displays a default message instead.

- `getStartPoints()`: **optional**. A function that returns a Decimal that is the amount of points the player starts with after a reset. If absent, the player does not start with any points after a reset.

- `canGenPoints()`: **optional**. A function returning a boolean for if points should be generated. Use this if you want an upgrade to unlock generating points. You can also have it be a constant value. If absent, points are always generated.

- `getPointGen()`: A function that calculates your points per second. Anything that affects your point gain should go into the calculation here.

- `addedPlayerData()`: **optional**. A function that returns any non-layer-related data that you want to be added to the save data and "player" object.

```js
function addedPlayerData() {
    return {
        weather: "rain",
        happiness: new Decimal(72),
    };
};
```

- `displayThings`: **optional**. An array of functions used to display extra things at the top of the tree tab. Each function returns a string, which is a line to display (with basic HTML support). If a function returns nothing, nothing is displayed (and it doesn't take up a line).

- `isEndgame()`: A function to determine if the player has reached the end of the game, at which point the "you win!" screen appears.

Additional features:

- `endPoints`: **OVERRIDE**. An alternative to `isEndgame()`. It is a Decimal value that sets the game end to that amount of points. Also displays this amount along with your point name in the info tab if you choose to use it.

- `onLoad()`: **optional**. A function that runs when the game is finished loading, if it exists. Use this if you have additional custom things that need loading or setup!

- `update(diff)`: **optional**. This function is called every game tick. Use it for any passive resource production or time-based things. `diff` is the time since the last tick.

- `onReset(resettingLayer)`: **optional**. This function is called whenever any layer resets. Use this to reset any added player data that needs resetting based on `resettingLayer`.

## Less important things

- `backgroundStyle`: **optional**. A CSS object containing the styling for the background of the full game. Can be a function!

- `maxTickLength()`: Returns the maximum tick length in seconds. Only really useful if you have something that reduces over time, which long ticks mess up (usually a challenge).

- `fixOldSave(oldVersion)`: Can be used to modify a save file when loading into a new version of the game. Use this to undo inflation, never forcibly hard reset your players.

Additional features:

- `getPoints()`: **OVERRIDE**. If this function returns a Decimal, `game.points` is set to that amount every tick instead of increasing based on `getPointGen()`. Can be used to implement a different method of point gain.

- `overridePointDisplay()`: **OVERRIDE**. What this function returns overrides the point display at the top of the page. Any extra display things will still be displayed; this just replaces the point and point per second display. If it returns a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value, however, it will use the default.

- `extraMainDisplay(layer)`: **optional**. What this function returns adds to the main point display of each layer. It inserts it after the amount, but before the name. (Can use basic HTML.) For example, if you had:

    ```js
    function extraMainDisplay(layer) {
        if (layer == "p") return "Super <b>Ultra</b> ";
    };
    ```

    In a layer with the id "p" where you have 10 prestige points, it would show "You have **10** Super **Ultra** prestige points" for the main point display instead of "You have **10** prestige points" (and in any other layer the main display would be the same).

- `currentlyText`: **OVERRIDE**. This replaces the text that says `"Currently: "` on all upgrades that use `effectDisplay` and all challenges that use `rewardDisplay`. (Can use basic HTML.) Can also be function.
