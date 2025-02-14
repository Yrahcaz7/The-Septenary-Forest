# Basic layer breakdown

This is a relatively minimal layer with few features. Most things will require additional features.

Note: `newDecimalZero()` and `newDecimalOne()` are just more optimized versions of `new Decimal(0)` and `new Decimal(1)`.

```js
addLayer("p", {
    name: "prestige",                       // This is optional and is only used in a few places. If absent it just uses the layer id.
    symbol: "P",                            // This appears on the layer's node. Default is the id with the first letter capitalized.
    row: 0,                                 // The row this layer is on in the tree (0 is the first row).
    position: 0,                            // Horizontal position within a row. By default sorts in alphabetical order by layer id.

    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: newDecimalZero(),           // "points" is the internal name for the main resource of the layer.
        best: newDecimalZero(),
        total: newDecimalZero(),
    }},
    color: "#4BDC13",                       // The color for the layer's node and some things in the layer.
    resource: "prestige points",            // The name of this layer's main prestige resource.
    

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of baseResource needed to gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer. Can also be a function.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = newDecimalOne();         // Factor in any bonuses multiplying gain here.
        return mult;
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        let exp = newDecimalOne();
        return exp;
    },
    hotkeys: [                              // An array of keyboard shorcuts that unlock when the layer is unlocked.
        {key: "p", description: "P: Reset for prestige points", onPress() { if (canReset(this.layer)) doReset(this.layer) }},
    ],

    layerShown() { return true },           // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
})
```
