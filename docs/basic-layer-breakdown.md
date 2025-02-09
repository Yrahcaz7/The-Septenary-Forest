# Basic layer breakdown

This is a relatively minimal layer with few features. Most things will require additional features.

Note: `newDecimalZero()` and `newDecimalOne()` are just more optimized versions of `new Decimal(0)` and `new Decimal(1)`.

```js
addLayer("p", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: newDecimalZero(),           // "points" is the internal name for the main resource of the layer.
        best: newDecimalZero(),
        total: newDecimalZero(),
    }},
    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "prestige points",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = newDecimalOne();         // Factor in any bonuses multiplying gain here.
        return mult;
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        let mult = newDecimalOne();
        return mult;
    },

    layerShown() { return true },           // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
})
```
