# cytoscape.js-simulated-annealing
Simulated Annealing layout extension for Cytoscape.js


## Dependencies

 * Cytoscape.js >=x.y.z
 * <List your dependencies here please>

## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-annealing`,
 * via bower: `bower install cytoscape-annealing`, or
 * via direct download in the repository (probably from a tag).

`require()` the library as appropriate for your project:

CommonJS:
```js
var cytoscape = require('cytoscape');
var cySAayout = require('cytoscape-simulated-annealing');

cySAayout( cytoscape ); // register extension
```

AMD:
```js
require(['cytoscape', 'cytoscape-simulated-annealing'], function( cytoscape, cySAayout ){
  cySAayout( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.

## API

Call the layout, e.g. `cy.layout({ name: 'cytoscape-simulated-annealing', ... }).run()`, with the following options:


```js
// Default options
var defaults = {
    animate: true, // whether to animate changes to the layout
    animationDuration: 200, // duration of animation in ms, if enabled
    animationEasing: undefined, // easing of animation, if enabled
    animateFilter: function ( node, i ) {
        /*
        A function that determines whether the node should be animated.
        All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        */
        return true;
    },
    fit: false, // whether to fit the viewport to the graph. If set to true will move every node even if you move one node, because it is trying to fit the graph.
    padding: 30, // padding to leave between graph and viewport
    pan: {
        x: 0,
        y: 0,
    }, // pan the graph to the provided position, given as { x, y }
    ready: undefined, // callback for the layoutready event
    stop: undefined, // callback for the layoutstop event
    spacingFactor: 1, // a positive value which adjusts spacing between nodes (>1 means greater than usual spacing)
    transform: function ( node, position ) {
        /*
        Transform a given node position. Useful for changing flow direction in discrete layouts
        */
        return position;
    },
    zoom: 1, // zoom level as a positive number to set after animation
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    onStep: function ( obj ) {
        /*
        Callback when one step in simulated annealing is completed.
        Object obj has many useful attributes
        {
            state: Current state,
            energy: Energy of the current state,
            temperature: Current temperature,
            steps: Current step in the current iteration,
            iterations: Current iteration
        }
        */
    },
    SAInitialTemperature: 1000, // Initial temperature
    SATemperatureDecreaseRate: 0.99, // Rate at which temperature decreases
    nodeDistanceFactor: 0.1, // Node distance factor used to compute node distance cost.
    borderDistanceFactor: 0.1, // Border distance factor used to compute border distance cost.
    edgeLengthFactor: 0.5, // Edge length factor used to compute edge length cost.
    nodeEdgeDistanceFactor: 0.1, // Node Edge distance factor used to compute node edge distance cost.
    edgeCrossingsFactor: 10, // Edge crossings factor used to compute edge crossings cost.
    iterations: 2, // Number of simulated annealing iterations
    steps: 20, // Number of steps per iterations.
};
```

## Build targets

- `npm run build` : Build ``./src/**`` into `cytoscape-simulated-annealing.js`
