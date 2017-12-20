'use strict';

var _ = require('lodash');
var async = require('async');
var SimulatedAnnealing = require('./SimulatedAnnealing/graph.js');
// registers the extension on a cytoscape lib ref

var SALayout = function (cytoscape) {

	if (!cytoscape) {
		return;
	} // can't register if cytoscape unspecified

	var defaults = {
		/*
		 * Default configuration
		 */
		animate: true,
		pan: {
			x: 0,
			y: 0,
		},
		// boundingBox: {
		// 	x1: 200,
		// 	y1: 100,
		// 	w: 400,
		// 	h: 300
		// },
		onStep:  function (obj) {
            // do nothing
        },
		zoom: 1,
        animationDuration: 200,
		fit: false, // If set to true will move every node even if you move one node, because it is trying to fit the graph.
		SAInitialTemperature: 100
	};

	var extend = Object.assign || function (tgt) {
		for (var i = 1; i < arguments.length; i++) {
			var obj = arguments[i];

			for (var k in obj) {
				tgt[k] = obj[k];
			}
		}
		return tgt;
	};

	// constructor
	// options : object containing layout options
	function Layout(options) {
		this.options = extend({}, defaults, options);
	}

	Layout.prototype.run = function () {
		var layout = this;
		layout.trigger({
			type: 'layoutstart',
			layout: layout
		});
		var options = this.options;
		options.layout = layout;
		var cy = options.cy; // cy is automatically populated for us in the constructor
		var eles = options.eles;
		var nodes = eles.nodes();
		var edges = eles.edges();

        var bb = options.boundingBox ? options.boundingBox : cy.extent();
        if( bb.x2 === undefined ){ bb.x2 = bb.x1 + bb.w; }
        if( bb.w === undefined ){ bb.w = bb.x2 - bb.x1; }
        if( bb.y2 === undefined ){ bb.y2 = bb.y1 + bb.h; }
        if( bb.h === undefined ){ bb.h = bb.y2 - bb.y1; }

		options.boundingBox = bb;
        options.center = {x: (bb.x1 + bb.x2) / 2, y: (bb.y1 + bb.y2) / 2};

		layout.trigger('layoutready');

		var sa = SAGraph(options);
		return sa.run().then(function (currentObject) {
		    layout.trigger('layoutstop');
			return layout;
		});
	};

	Layout.prototype.stop = function () {
		this.trigger('layoutstop');

		return this; // chaining
	};

	Layout.prototype.destroy = function () {

		return this; // chaining
	};

	return Layout;

};

module.exports = function get(cytoscape) {
	return SALayout(cytoscape);
};
