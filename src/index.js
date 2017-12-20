'use strict';

( function () {

	// registers the extension on a cytoscape lib ref
	var getLayout = require( './layout.js' );
	var register = function ( cytoscape ) {
		var Layout = getLayout( cytoscape );
		cytoscape( 'layout', 'cytoscape.js-simulated-annealing', Layout );
	};

	if ( typeof module !== 'undefined' && module.exports ) { // expose as a commonjs module
		module.exports = register;
	}

	if ( typeof define !== 'undefined' && define.amd ) { // expose as an amd/requirejs module
		define( 'cytoscape.js-simulated-annealing', function () {
			return register;
		} );
	}

	if ( typeof cytoscape !== 'undefined' ) { // expose to global cytoscape (i.e. window.cytoscape)
		register( cytoscape );
	}

} )();