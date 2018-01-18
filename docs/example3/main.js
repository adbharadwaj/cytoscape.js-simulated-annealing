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
				id: 'id',
				weight: 7,
				source: 'i',
				target: 'd'
			}
		},
		{
			data: {
				id: 'fe',
				weight: 3,
				source: 'f',
				target: 'e'
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
				id: 'ic',
				weight: 3,
				source: 'i',
				target: 'c'
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
			'background-color': '#11479e',
			// 'width': '10',
			// 'height': '10',
			'text-opacity': 0.5,
			'content': 'data(id)',
			'shape': 'data(shape)',
		} )
		.selector( 'edge' )
		.css( {
			'curve-style': 'bezier',
			'line-color': '#9dbaea',
			'target-arrow-color': '#9dbaea',
			'width': 4,
			'target-arrow-shape': 'triangle',
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

	elements: elesJson,
	zoom: 1,
	pan: {
		x: 0,
		y: 0
	},
	zoomingEnabled: false,
	panningEnabled: false,
} );

var layout;
var bb;

cy.ready( function () {
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

var _distance = function ( node1, node2 ) {
	return Math.sqrt( _distanceSquared( node1, node2 ) );
};

var _distanceSquared = function ( node1, node2 ) {
	return ( node1.position( 'x' ) - node2.position( 'x' ) ) * ( node1.position( 'x' ) - node2.position( 'x' ) ) +
		( node1.position( 'y' ) - node2.position( 'y' ) ) * ( node1.position( 'y' ) - node2.position( 'y' ) );
};

//determines edge angle for correct slope
function _isCorrectAngle( source, target, targetArrowShape ) {
	// if this is an undireted edge, the angle is always correct
	if ( targetArrowShape != 'triangle' ) {
		return true;
	}

	var x = source.position( 'x' ) - target.position( 'x' );
	var y = source.position( 'y' ) - target.position( 'y' );

	//if the angle is below the x-axis it is considered to have a correct slope
	if ( y < 0 ) {
		return true;
	}
	return false;
}

// var triangleTopRectangleBottomFactor = 10;
// var sameShapeDistanceFactor = 100000;
// var downwardPointingPathsFromTrianglesFactor = 10000;
var options = {};

$( "#runBtn" ).click( function () {
	options = {
		SAInitialTemperature: parseFloat( $( '#SAInitialTemperature' ).val() ),
		edgeCrossingsFactor: parseFloat( $( '#edgeCrossingsFactor' ).val() ),
		nodeDistanceFactor: parseFloat( $( '#nodeDistanceFactor' ).val() ),
		borderDistanceFactor: parseFloat( $( '#borderDistanceFactor' ).val() ),
		edgeLengthFactor: parseFloat( $( '#edgeLengthFactor' ).val() ),
		nodeEdgeDistanceFactor: parseFloat( $( '#nodeEdgeDistanceFactor' ).val() ),
		triangleTopRectangleBottomFactor: parseFloat( $( '#triangleTopRectangleBottomFactor' ).val() ),
		sameShapeDistanceFactor: parseFloat( $( '#sameShapeDistanceFactor' ).val() ),
		downwardPointingPathsFromTrianglesFactor: parseFloat( $( '#downwardPointingPathsFromTrianglesFactor' ).val() ),
		edgeSlopesFactor: parseFloat( $( '#edgeSlopesFactor' ).val() ),
	}
	layout = cy.layout( {
		name: 'cytoscape-simulated-annealing',
		iterations: 10,
		animationDuration: 10,
		steps: 30 * cy.nodes().length,
		// steps: 2,
		boundingBox: {
			x1: 20,
			y1: 20,
			w: 800,
			h: 500
		},
		// steps: 10,
		SAInitialTemperature: options.SAInitialTemperature,
		edgeCrossingsFactor: options.edgeCrossingsFactor,
		nodeDistanceFactor: options.nodeDistanceFactor,
		borderDistanceFactor: options.borderDistanceFactor,
		edgeLengthFactor: options.edgeLengthFactor,
		nodeEdgeDistanceFactor: options.nodeEdgeDistanceFactor,
		onStep: function ( obj ) {
			$( '#infoEnergy' ).html( obj.energy );
			$( '#infoTemp' ).html( obj.temperature );
			$( '#infoSteps' ).html( obj.steps );
			$( '#infoIterations' ).html( obj.iterations );
			// console.log(obj);
		}
	} ).addEnergyFunction( 'triangleToTopBorderDistance', function ( state ) {
		if ( !options.triangleTopRectangleBottomFactor ) {
			return Promise.resolve( 0 );
		}

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
		if ( !options.triangleTopRectangleBottomFactor ) {
			return Promise.resolve( 0 );
		}

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
	} ).addEnergyFunction( 'sameShapesTogether', function ( state ) {
		if ( !options.sameShapeDistanceFactor ) {
			return Promise.resolve( 0 );
		}

		var willComputeSameShapesDistance = [];

		state.nodes().each( function ( node1 ) {
			state.nodes().each( function ( node2 ) {
				if ( cy.nodes( '#' + node1.id() ).style( 'shape' ) == cy.nodes( '#' + node2.id() ).style( 'shape' ) ) {
					willComputeSameShapesDistance.push( new Promise( function ( resolve, reject ) {
						var distance = _distanceSquared( node1, node2 ) / ( bb.w * bb.h );
						resolve( options.sameShapeDistanceFactor * distance );
					} ) )
				}

			} );
		} );

		function getSum( total, num ) {
			return total + num;
		}

		return Promise.all( willComputeSameShapesDistance ).then( function ( values ) {
			return Promise.resolve( values.reduce( getSum ) );
		} );
	} ).addEnergyFunction( 'downwardPointingPathsFromTriangles', function ( state ) {
		if ( !options.downwardPointingPathsFromTrianglesFactor ) {
			return Promise.resolve( 0 );
		}

		var willComputeDownwardPointingPathsFromTriangles = [];
		var isCorrectAngle = function ( edge ) {
			return true;
		};
		var countDownwardPointingPaths = function ( node, state ) {
			var count = [];
			//we are at the bottom already! Return 1
			if ( cy.nodes( '#' + node.id() ).style( 'shape' ) == 'rectangle' || cy.nodes( '#' + node.id() ).style( 'shape' ) == 'square' ) {
				return Promise.resolve( 1 );
			}

			var connectedEdgesSource = state.edges( "[source='" + node.id() + "']" );

			for ( var i = 0; i < connectedEdgesSource.length; i++ ) {

				if ( _isCorrectAngle( state.nodes( '#' + connectedEdgesSource[ i ].data( 'source' ) ),
						state.nodes( '#' + connectedEdgesSource[ i ].data( 'target' ) ),
						cy.edges( '#' + connectedEdgesSource[ i ].id() ).style( 'target-arrow-shape' ) ) ) {
					var target = cy.nodes( '#' + connectedEdgesSource[ i ].data( 'target' ) );
					count.push( countDownwardPointingPaths( target, state ) );
				}
			}

			function getSum( total, num ) {
				return total + num;
			}

			return Promise.all( count ).then( function ( values ) {
				values.push( 0 );
				return Promise.resolve( values.reduce( getSum ) );
			} );

		}

		state.nodes().each( function ( node ) {
			if ( cy.nodes( '#' + node.id() ).style( 'shape' ) === 'triangle' ) {
				willComputeDownwardPointingPathsFromTriangles.push( countDownwardPointingPaths( node, state ) );
			}
		} );

		function getSum( total, num ) {
			return total + num;
		}

		return Promise.all( willComputeDownwardPointingPathsFromTriangles ).then( function ( values ) {
			// console.log( values.reduce( getSum ) );
			return Promise.resolve( options.downwardPointingPathsFromTrianglesFactor / values.reduce( getSum ) );
		} );
	} ).addEnergyFunction( 'edgeSlopes', function ( state ) {
		if ( !options.edgeSlopesFactor ) {
			return Promise.resolve( 0 );
		}

		var willComputeEdgeSlopes = [];

		state.edges().each( function ( edge ) {
			willComputeEdgeSlopes.push( new Promise( function ( resolve, reject ) {
				var source = state.nodes( '#' + edge.data( 'source' ) );
				var target = state.nodes( '#' + edge.data( 'target' ) );
				var deltaX = Math.abs( target.position( 'x' ) - source.position( 'x' ) );
				var deltaY = target.position( 'y' ) - source.position( 'y' );
				var slope = Math.atan( deltaY / deltaX );
				slope = slope > 0 ? slope : 0.1;
				// console.log( slope );
				resolve( 1 / slope * options.edgeSlopesFactor );
			} ) )
		} );

		function getSum( total, num ) {
			return total + num;
		}

		return Promise.all( willComputeEdgeSlopes ).then( function ( values ) {
			return Promise.resolve( values.reduce( getSum ) / cy.edges().length );
		} );

	} ).run();
} );