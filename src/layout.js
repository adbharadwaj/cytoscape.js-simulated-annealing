'use strict';

var SimulatedAnnealing = require( './SimulatedAnnealing/graph.js' );
// registers the extension on a cytoscape lib ref

var SALayout = function ( cytoscape ) {

	if ( !cytoscape ) {
		return;
	} // can't register if cytoscape unspecified

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

	var extend = Object.assign || function ( tgt ) {
		for ( var i = 1; i < arguments.length; i++ ) {
			var obj = arguments[ i ];

			for ( var k in obj ) {
				tgt[ k ] = obj[ k ];
			}
		}
		return tgt;
	};

	// constructor
	// options : object containing layout options
	function Layout( options ) {
		this.options = extend( {}, defaults, options );
	}

	Layout.prototype.run = function () {
		var layout = this;
		layout.trigger( {
			type: 'layoutstart',
			layout: layout
		} );
		var options = this.options;
		options.layout = layout;
		var cy = options.cy; // cy is automatically populated for us in the constructor
		var eles = options.eles;
		var nodes = eles.nodes();
		var edges = eles.edges();

		var bb = options.boundingBox ? options.boundingBox : cy.extent();
		if ( bb.x2 === undefined ) {
			bb.x2 = bb.x1 + bb.w;
		}
		if ( bb.w === undefined ) {
			bb.w = bb.x2 - bb.x1;
		}
		if ( bb.y2 === undefined ) {
			bb.y2 = bb.y1 + bb.h;
		}
		if ( bb.h === undefined ) {
			bb.h = bb.y2 - bb.y1;
		}

		options.boundingBox = bb;
		options.center = {
			x: ( bb.x1 + bb.x2 ) / 2,
			y: ( bb.y1 + bb.y2 ) / 2
		};

		layout.trigger( 'layoutready' );

		var sa = SAGraph( options );
		return sa.run().then( function ( currentObject ) {
			layout.trigger( 'layoutstop' );
			return layout;
		} );
	};

	Layout.prototype.stop = function () {
		this.trigger( 'layoutstop' );

		return this; // chaining
	};

	Layout.prototype.destroy = function () {

		return this; // chaining
	};

	return Layout;

};

module.exports = function get( cytoscape ) {
	return SALayout( cytoscape );
};