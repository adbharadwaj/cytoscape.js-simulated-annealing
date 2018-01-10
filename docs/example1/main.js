var elesJson = {
	nodes: [ {
			data: {
				id: 'a',
				shape: 'triangle'
			}
		},
		{
			data: {
				id: 'b',
				shape: 'ellipse'
			}
		},
		{
			data: {
				id: 'c',
				shape: 'ellipse'
			}
		},
		{
			data: {
				id: 'd',
				shape: 'rectangle'
			}
		},
		{
			data: {
				id: 'e',
				shape: 'rectangle'
			}
		},
		{
			data: {
				id: 'f',
				shape: 'triangle'
			}
		},
		{
			data: {
				id: 'g',
				shape: 'ellipse'
			}
		},
		{
			data: {
				id: 'h',
				shape: 'ellipse'
			}
		},
		{
			data: {
				id: 'i',
				shape: 'ellipse'
			}
		}
	],

	edges: [ {
			data: {
				id: 'ae',
				weight: 1,
				source: 'a',
				target: 'e'
			}
		},
		{
			data: {
				id: 'ab',
				weight: 3,
				source: 'a',
				target: 'b'
			}
		},
		{
			data: {
				id: 'be',
				weight: 4,
				source: 'b',
				target: 'e'
			}
		},
		{
			data: {
				id: 'bc',
				weight: 5,
				source: 'b',
				target: 'c'
			}
		},
		{
			data: {
				id: 'ce',
				weight: 6,
				source: 'c',
				target: 'e'
			}
		},
		{
			data: {
				id: 'de',
				weight: 7,
				source: 'd',
				target: 'e'
			}
		},
		{
			data: {
				id: 'ef',
				weight: 3,
				source: 'e',
				target: 'f'
			}
		},
		{
			data: {
				id: 'ai',
				weight: 3,
				source: 'a',
				target: 'i'
			}
		},
		{
			data: {
				id: 'ci',
				weight: 3,
				source: 'c',
				target: 'i'
			}
		},
		{
			data: {
				id: 'gc',
				weight: 3,
				source: 'g',
				target: 'c'
			}
		},
		{
			data: {
				id: 'hd',
				weight: 3,
				source: 'h',
				target: 'd'
			}
		},
		{
			data: {
				id: 'ah',
				weight: 3,
				source: 'a',
				target: 'h'
			}
		},
		{
			data: {
				id: 'ei',
				weight: 3,
				source: 'e',
				target: 'i'
			}
		},
		{
			data: {
				id: 'bg',
				weight: 3,
				source: 'b',
				target: 'g'
			}
		},
		{
			data: {
				id: 'af',
				weight: 3,
				source: 'a',
				target: 'f'
			}
		}
	]
};

var cy = cytoscape( {
	container: document.getElementById( 'cy' ),
	style: cytoscape.stylesheet()
		.selector( 'node' )
		.css( {
			'background-color': '#B3767E',
			'width': '20',
			'height': '20',
			'content': 'data(id)',
			'shape': 'data(shape)',
		} )
		.selector( 'edge' )
		.css( {
			'line-color': '#F2B1BA',
			'target-arrow-color': '#F2B1BA',
			'width': 2,
			'target-arrow-shape': 'circle',
			'opacity': 0.8
		} )
		.selector( ':selected' )
		.css( {
			'background-color': 'black',
			'line-color': 'black',
			'target-arrow-color': 'black',
			'source-arrow-color': 'black',
			'opacity': 1
		} )
		.selector( '.faded' )
		.css( {
			'opacity': 0.25,
			'text-opacity': 0
		} ),

	elements: elesJson
} );

var bb;
cy.ready( function () {
	cy.pan( {
		x: 0,
		y: 0
	} );
	bb = cy.extent();
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
} );

var options = {};

$( '#runBtn' ).click( function () {
	options = {
		SAInitialTemperature: parseFloat( $( '#SAInitialTemperature' ).val() ),
		edgeCrossingsFactor: parseFloat( $( '#edgeCrossingsFactor' ).val() ),
		nodeDistanceFactor: parseFloat( $( '#nodeDistanceFactor' ).val() ),
		borderDistanceFactor: parseFloat( $( '#borderDistanceFactor' ).val() ),
		edgeLengthFactor: parseFloat( $( '#edgeLengthFactor' ).val() ),
		nodeEdgeDistanceFactor: parseFloat( $( '#nodeEdgeDistanceFactor' ).val() ),
		triangleTopRectangleBottomFactor: parseFloat( $( '#triangleTopRectangleBottomFactor' ).val() )
	}
	console.log( options );
	cy.layout( {
		name: 'cytoscape-simulated-annealing',
		iterations: 10,
		animationDuration: 10,
		steps: 30 * cy.nodes().length,
		// steps: 10,
		SAInitialTemperature: options.SAInitialTemperature,
		edgeCrossingsFactor: options.edgeCrossingsFactor,
		nodeDistanceFactor: options.nodeDistanceFactor,
		borderDistanceFactor: options.borderDistanceFactor,
		edgeLengthFactor: options.edgeLengthFactor,
		nodeEdgeDistanceFactor: options.nodeEdgeDistanceFactor,
		// nodeDistanceFactor: 1,
		onStep: function ( obj ) {
			$( '#infoEnergy' ).html( obj.energy );
			$( '#infoTemp' ).html( obj.temperature );
			$( '#infoSteps' ).html( obj.steps );
			$( '#infoIterations' ).html( obj.iterations );
			// console.log(obj);
		}
	} ).addEnergyFunction( 'triangleToTopBorderDistance', function ( state ) {

		var willComputeTriangleToTopBorderDistance = [];

		state.nodes().each( function ( node ) {

			if ( cy.nodes( '#' + node.id() ).style( 'shape' ) == 'triangle' ) {
				willComputeTriangleToTopBorderDistance.push( new Promise( function ( resolve, reject ) {
					var cost = 0;
					if ( node.position( 'x' ) > bb.x1 && node.position( 'x' ) < bb.x2 &&
						node.position( 'y' ) >= bb.y1 && node.position( 'y' ) < bb.y2 ) {
						// Nodes repel edges
						var dist = node.position( 'y' ) - bb.y1;
						cost += dist * dist

					} else {
						// If one is offscreen, cost is awful.
						cost = 100000000;
					}
					resolve( cost * options.triangleTopRectangleBottomFactor );
				} ) )
			}
		} );

		function getSum( total, num ) {
			return total + num;
		}

		return Promise.all( willComputeTriangleToTopBorderDistance ).then( function ( values ) {
			return Promise.resolve( values.reduce( getSum ) );
		} );
	} ).addEnergyFunction( 'rectToBottomBorderDistance', function ( state ) {
		var willComputeRectToBottomBorderDistance = [];

		state.nodes().each( function ( node ) {
			if ( cy.nodes( '#' + node.id() ).style( 'shape' ) == 'rectangle' ) {
				willComputeRectToBottomBorderDistance.push( new Promise( function ( resolve, reject ) {
					var cost = 0;
					if ( node.position( 'x' ) > bb.x1 && node.position( 'x' ) < bb.x2 &&
						node.position( 'y' ) > bb.y1 && node.position( 'y' ) <= bb.y2 ) {
						// Nodes repel edges
						var dist = bb.y2 - node.position( 'y' );
						cost += dist * dist

					} else {
						// If one is offscreen, cost is awful.
						cost = 100000000;
					}
					resolve( cost * options.triangleTopRectangleBottomFactor );
				} ) )
			}
		} );

		function getSum( total, num ) {
			return total + num;
		}

		return Promise.all( willComputeRectToBottomBorderDistance ).then( function ( values ) {
			return Promise.resolve( values.reduce( getSum ) );
		} );
	} ).run();
} )