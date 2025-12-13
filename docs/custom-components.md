# Custom components (additional feature)

You can create custom components to use in [custom tab layouts](custom-tab-layouts.md) by adding the `customComponents` constant to your code.

I recommend creating a new `components.js` file to keep your custom components in, especially if you are adding more than one.

`customComponents` is an object where each key is the name of a custom component, and the value is a component object. For example:

```js
const customComponents = {
    "assimilate-button": {
        props: ["layer", "data"],
        data() { return {canAssimilate, player, assimilationReq, tmp, format, completeAssimilation} },
        template: template(`<button v-if="canAssimilate(layer) && player[data].assimilating === layer" :class="{
            [data]: true,
            reset: true,
            locked: player[layer].points.lt(assimilationReq[layer]),
            can: player[layer].points.gte(assimilationReq[layer]),
        }" :style="[
            {'margin-left': '16px'},
            (player[layer].points.gte(assimilationReq[layer]) ? {'background-color': tmp[data].color} : {}),
            tmp[layer].componentStyles['prestige-button'],
        ]" v-html="(player[layer].points.gte(assimilationReq[layer]) ? 'Assimilate this layer!' : 'Reach ' + format(assimilationReq[layer]) + ' ' + tmp[layer].resource + ' to fully Assimilate this layer.')" @click="completeAssimilation(layer)"></button>`),
    },
};
```

This example makes a new prestige-button-like element called "assimilate-button" (similar to the mastery buttons in the original TPT).

The `props` attribute always starts with "layer". This `layer` value is the id of the layer that the component is in.

The "data" value is what stores any data passed into the component when it is created.

For example, in `["assimilate-button", "mo"]`, the string `"mo"` is the value of `data`.

Anything in `props` (both `layer` and `data` here) can be used as variables in the template.

The `data()` method returns an object which contains all of the variables and functions you use in the template.

Lastly, the `template` attribute is a string that contains an HTML-like structure that incorporates JavaScript logic into HTML.

In this example, the template is passed through the `template()` function, removing any tabs and line breaks from the string.

For more detail, you can check out [this documentation on template syntax](https://vuejs.org/guide/essentials/template-syntax.html) or look at the [code for the already existing components](/shared/js/components.js).
