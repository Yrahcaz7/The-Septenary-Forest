# Challenges

Challenges can have fully customizable win conditions. Useful functions for dealing with Challenges and implementing their effects:

- `inChallenge(layer, id)`: determine if the player is in a given challenge (or another challenge on the same layer that counts as this one).
- `hasChallenge(layer, id)`: determine if the player has completed the challenge.
- `challengeCompletions(layer, id)`: determine how many times the player completed the challenge.
- `maxedChallenge(layer, id)`: determines if the player has reached the maximum completions.
- `challengeEffect(layer, id)`: Returns the current effects of the challenge, if any.

Challenges are stored in the following format:

```js
challenges: {
    11: {
        name: "Ouch",
        challengeDescription: "description of ouchie",
        canComplete() { return player.points.gte(100) },
        etc
    },
    etc
}
```

Usually, each challenge should have an id where the first digit is the row and the second digit is the column.

Individual Challenges can have these features:

- `name`: Name of the challenge, can be a string or a function. Can use basic HTML.

- `challengeDescription`: A description of what makes the challenge a challenge. *You will need to implement these elsewhere.* It can also be a function that returns updating text. Can use basic HTML.

- `goalDescription`: A description of the win condition for the challenge. It can also be a function that returns updating text.
    Can use basic HTML. (Optional if using the old goal system)

- `canComplete()`: A function that returns true if you meet the win condition for the challenge. Returning a number will allow bulk completing the challenge.
    (Optional if using the old goal system)

- `rewardDescription`: A description of the reward's effect. *You will also have to implement the effect where it is applied.* It can also be a function that returns updating text. Can use basic HTML.

- `rewardEffect()`: **optional**. A function that calculates and returns the current values of any bonuses from the reward. Can return a value or an object containing multiple values. Can use basic HTML.

- `rewardDisplay()`: **optional**. A function that returns a display of the current effects of the reward with formatting. Default behavior is to just display the a number appropriately formatted.

- `fullDisplay()`: **OVERRIDE**. Overrides the other displays and descriptions, and lets you set the full text for the challenge. Can use basic HTML.

- `unlocked()`: **optional**. A function returning a bool to determine if the challenge is visible or not. Default is unlocked.

- `onComplete()`: **optional**. This function will be called when the challenge is completed when previously incomplete.

- `onEnter()` - **optional**. This function will be called when entering the challenge.

- `onExit()` - **optional**. This function will be called when exiting the challenge in any way.

- `countsAs`: **optional**. If a challenge combines the effects of other challenges in this layer, you can use this. An array of challenge ids. The player is effectively in all of those challenges when in the current one.

- `completionLimit`: **optional**. The amount of times you can complete this challenge. Default is 1 completion.

- `style`: **optional**. Applies CSS to this challenge, in the form of an object where the keys are CSS attributes, and the values are the values for those attributes (both as strings).

- `marked`: **optional** Adds a mark to the corner of the challenge. If it's "true" it will be a star, but it can also be an image URL. By default, if the challenge has multiple completions, it will be starred at max completions.

- `layer`: **assigned automagically**. It's the same value as the name of this layer, so you can do player[this.layer].points or similar

- `id`: **assigned automagically**. It's the "key" which the challenge was stored under, for convenient access. The challenge in the example's id is 11.

Additional features:

- `doReset`: **optional**. A boolean to determine if the challenge does a reset of its layer on enter and exit. Default is to not.

- `noAutoExit`: **optional**. A boolean to determine if the challenge should stay active on resets. Default is to not.

- `canEnter()`: **optional**. A function returning a boolean to determine if the challenge is enterable. Default behavior is to always allow entering.

- `canExit()`: **optional**. A function returning a boolean to determine if the challenge is exitable. Default behavior is to always allow exiting.

- `buttonText`: **optional**. An array that replaces the default button text. It has the following syntax: [`replace "Finish"`, `replace "Exit Early"`, `replace "Completed"`, `replace "Start"`, `replace "Locked"`]. [Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) values will be taken as you want the default for that value.

The old goal system uses these features:

- `goal`: **deprecated**. A Decimal for the amount of currency required to beat the challenge. By default, the goal is in basic Points. The goal can also be a function if its value changes.

- `currencyDisplayName`: **deprecated**. The name to display for the currency for the goal

- `currencyInternalName`: **deprecated**. The internal name for that currency

- `currencyLayer`: **deprecated**. The internal name of the layer that currency is stored in. If it's not in a layer, omit. If it's not stored directly in a layer, instead use the next feature.

- `currencyLocation()`: **deprecated**. If your currency is stored in something inside a layer (e.g. a buyable's amount), you can access it this way. This is a function returning the object in "player" that contains the value (like `player[this.layer].buyables`)
