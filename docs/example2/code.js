var cy, bb;

Promise.all( [
		fetch( 'Interleukin 1 NetPath Pathway.cyjs', {
			mode: 'no-cors'
		} )
		.then( function ( res ) {
			return res.json()
		} ),
		fetch( 'Interleukin 1 NetPath Pathway.json', {
			mode: 'no-cors'
		} )
		.then( function ( res ) {
			return res.json()
		} )
	] )
	.then( function ( data ) {
		cy = window.cy = cytoscape( {
			container: document.getElementById( 'cy' ),
			elements: data[ 0 ].elements,
			style: data[ 1 ].style
		} );

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
	} );

var options = {}

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