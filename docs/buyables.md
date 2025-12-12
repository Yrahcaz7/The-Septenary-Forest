# Buyables

Buyables are usually things that can be bought multiple times with scaling costs. They come with optional buttons that can be used for respeccing or selling buyables, among other things.

The amount of a buyable owned is a `Decimal`.

Useful functions for dealing with buyables and implementing their effects:

- `getBuyableAmount(layer, id)`: get the amount of the buyable the player has.
- `setBuyableAmount(layer, id, amount)`: set the amount of the buyable the player has.
- `addBuyables(layer, id, amount)`: add to the amount of the buyable.
- `hasBuyable(layer, id)`: returns true if the player has one or more of the buyable.
- `buyableEffect(layer, id)`: returns the current effects of the buyable, if any.

Buyables should be formatted like this:

```js
buyables: {
    11: {
        cost(x) { return new Decimal(2).mul(x) },
        fullDisplay() { return "Blah" },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost());
            addBuyables(this.layer, this.id, 1);
        },
        etc
    },
    etc
}
```

> Additional functions for implementing `buy()` easier:
>
> - `buyStandardBuyable(obj, currencyLayer = obj.layer, currencyName = "points", bulk = 1)`: Buys a standard buyable that costs one currency. The default currency is "points" from the layer the buyable is in (this can be overriden with the `currencyLayer` and `currencyName` parameters). If `currencyLayer` is an empty string, no layer is used (e.g. just `player[currencyName]` instead of `player[currencyLayer][currencyName]`).
> - `buyMultiCurrencyBuyable(obj, currencyLayers = [], costless = false, bulk = 1)`: Buys a standard multi-currency buyable. The currencies all have to be "points" of different layers (the layer ids should be provided as an array for the `currencyLayers` argument). If the `costless` argument is true, the cost is not subtracted from each "points", instead the cost is added to the respective "total" values.
>
> **WARNING: The `bulk` parameter for these functions only changes the amount of the buyable gotten from the purchase, it does NOT increase the cost accordingly. Use `bulk` with care (or not at all).**
>
> Example usage:
>
> ```js
> buyables: {
>     11: {
>         cost(x) { return new Decimal(5).pow(x.add(1).pow(1.5).add(2)) },
>         title: "More Prestige Points",
>         description: "multiplies prestige point gain.",
>         effect(x) { return x.add(1).pow(0.5) },
>         effectDisplay(eff) { return format(eff) + "x" },
>         currencyDisplayName: "points",
>         canAfford() { return player.points.gte(this.cost()) },
>         buy() { buyStandardBuyable(this, "") },
>     },
> }
> ```
>

Features:

- `title`: **optional**. Displayed at the top in a larger font. It can also be a function that returns updating text. Can use basic HTML.

> - `description` (additional feature): A description of the buyable's effect. *You will also have to implement the effect where it is applied.* It can also be a function that returns updating text. Can use basic HTML.

- `effect()`: **optional**. A function that calculates and returns the current values of bonuses of this buyable. Can have an optional argument `x` to calculate the effect of having x of the buyable.
    Can return a value or an object containing multiple values.

> - `effectDisplay(eff)` (additional feature): **optional**. A function that returns a display of the current effects of the buyable with formatting. The `eff` argument holds the current effect of the buyable. Default displays nothing. Can use basic HTML.

- `cost()`: Cost for buying the next buyable. Can have an optional argument `x` to calculate the cost of the `x+1`th purchase. (`x` is a `Decimal`).
    Can return an object if there are multiple currencies.

> - `currencyDisplayName` (additional feature): **optional**. The name to display for the currency for the buyable.
>
> - `costDisplay(cost)` (additional feature): **OVERRIDE**. Overrides the cost display. The `cost` argument holds the current cost of the buyable. If you use this, `currencyDisplayName` does nothing.
>
> - `boughtDisplay(x)` (additional feature): **OVERRIDE**. Overrides the bought display. The `x` argument holds the amount of the buyable the player has.

- `fullDisplay()` (formerly `display()`): **OVERRIDE**. Overrides the other displays and descriptions (besides `title`), and lets you set the full text for the buyable. Can use basic HTML.

- `unlocked()`: **optional**. A function returning a bool to determine if the buyable is visible or not. Default is unlocked.

- `canAfford()`: A function returning a bool to determine if you can buy one of the buyables.

- `buy()`: A function that implements buying one of the buyable, including spending the currency.

- `buyMax()`: **optional**. A function that implements buying as many of the buyable as possible.

- `style`: **optional**. Applies CSS to this buyable, in the form of an object where the keys are CSS attributes, and the values are the values for those attributes (both as strings).

- `purchaseLimit`: **optional**. The limit on how many of the buyable can be bought. The default is no limit.

- `marked`: **optional** Adds a mark to the corner of the buyable. If it's "true" it will be a star, but it can also be an image URL.

- `tooltip`: **optional**. Adds a tooltip to this buyable, appears when it is hovered over. Can use basic HTML. Default is no tooltip. If this returns an empty value, that also disables the tooltip.

- `layer`: **assigned automagically**. It's the same value as the name of this layer, so you can do `player[this.layer].points` or similar.

- `id`: **assigned automagically**. It's the "key" which the buyable was stored under, for convenient access. The buyable in the example's id is `11`.

- `branches`: **optional**. This is primarially useful for buyable trees. An array of buyable ids. A line will appear from this buyable to all of the buyables in the list. Alternatively, an entry in the array can be a 2-element array consisting of the buyable id and a color value. The color value can either be a string with a hex color code, or a number from 1-3 (theme-affected colors). A third element in the array optionally specifies line width.

> - `color` (additional feature): **optional**. The background color of the buyable if it can be purchased. (A string in hex format with a `#`.) The default is the color of the layer the buyable belongs to. Can be a function.

Sell One/Sell All:

Including a `sellOne` or `sellAll` function will cause an additional button to appear beneath the buyable. They are functionally identical, but "sell one" appears above "sell all". You can also use them for other things.

- `sellOne()`, `sellAll()`: **optional**. Called when the button is pressed. The standard use would be to decrease/reset the amount of the buyable, and possibly return some currency to the player.

- `canSellOne()`, `canSellAll()`: **optional**. Booleans determining whether or not to show the buttons. If "canSellOne/All" is absent but "sellOne/All" is present, the appropriate button will always show.

To add a respec button, or something similar, add the respecBuyables function to the main buyables object (not individual buyables).
You can use these features along with it:

- `respec()`: **optional**. This is called when the button is pressed (after a toggleable confirmation message).

- `respecText`: **optional**. Text to display on the respec Button.

- `showRespec()`: **optional**. A function determining whether or not to show the button, if respecBuyables is defined. Defaults to true if absent.

- `respecMessage`: **optional**. A custom confirmation message on respec, in place of the default one.

> Additional features on the main buyables object:
>
> - `needLayerUnlocked`: **optional**. If this is false, the layer need not be unlocked for the player to purchase buyables.
