# Custom components (additional feature)

You can create custom components to use in [custom tab layouts](custom-tab-layouts.md) by adding the `customComponents` constant to your code.

I recommend creating a new `components.js` file to keep your custom components in, especially if you are adding more than one.

`customComponents` is an object where each key is the name of a custom component, and the value is a component object.
For example:

```js
const customComponents = {
    "assimilate-button": {
        props: ["layer", "data"],
        data() { return {canEnterAssimilationRun, player, ASSIMILATION_REQUIREMENTS, tmp, format, completeAssimilationRun} },
        template: template(/*html*/`<button v-if="canEnterAssimilationRun(layer) && player[data].assimilating === layer" :class="{
            [data]: true,
            reset: true,
            locked: player[layer].points.lt(ASSIMILATION_REQUIREMENTS[layer]),
            can: player[layer].points.gte(ASSIMILATION_REQUIREMENTS[layer]),
        }" :style="[
            {'margin-left': '16px'},
            (player[layer].points.gte(ASSIMILATION_REQUIREMENTS[layer]) ? {'background-color': tmp[data].color} : {}),
            tmp[layer].componentStyles['prestige-button'],
        ]" v-html="player[layer].points.gte(ASSIMILATION_REQUIREMENTS[layer]) ?
            'Assimilate this layer!'
            : 'Reach ' + format(ASSIMILATION_REQUIREMENTS[layer]) + ' ' + tmp[layer].resource + ' to fully Assimilate this layer.'
        " @click="completeAssimilationRun(layer)"></button>`),
    },
};
```

This example makes a new prestige-button-like element called "assimilate-button" (similar to the mastery buttons in The Prestige Tree).

The `props` attribute always starts with "layer".
This `layer` value is the id of the layer that the component is in.
The "data" value is what stores any data passed into the component when it is created.
For example, in `["assimilate-button", "mo"]`, the string `"mo"` is the value of `data`.

Anything in `props` (both `layer` and `data` here) can be used as variables in the template.

The `data()` method returns an object which contains all of the variables and functions you use in the template.
The object literal here is constructed using the [property assignment shorthand](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#enhanced_object_literals).

Lastly, the `template` attribute is a string that contains an HTML-like structure that incorporates JavaScript logic into HTML.
For more detail, you can check out [this documentation on Vue template syntax](https://vuejs.org/guide/essentials/template-syntax.html) or look at the [code for the already existing components](/shared/js/components.js).

In this example, the template is passed through the `template()` function, which removes any tabs and line breaks from the string.
The `/*html*/` comment is what enables HTML syntax highlighting for the template string (as long as you have an inline HTML extension installed in your code editor).
