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
		var cy = window.cy = cytoscape( {
			container: document.getElementById( 'cy' ),
			elements: data[ 0 ].elements,
			style: data[ 1 ].style
		} );

		cy.ready( function () {
			cy.pan( {
				x: 0,
				y: 0
			} );

			cy.layout( {
				name: 'cytoscape-simulated-annealing',
				iterations: 10,
				animationDuration: 10,
				steps: 30 * cy.nodes().length,
				// steps: 10,
				SAInitialTemperature: 10000,
				edgeCrossingsFactor: 1000,
				nodeDistanceFactor: 2,
				borderDistanceFactor: 1,
				edgeLengthFactor: 0.5,
				nodeEdgeDistanceFactor: 0.1,
				onStep: function ( obj ) {
					$( '#infoEnergy' ).html( obj.energy );
					$( '#infoTemp' ).html( obj.temperature );
					$( '#infoSteps' ).html( obj.steps );
					$( '#infoIterations' ).html( obj.iterations );
					console.log( obj );
				}
			} ).run();

		} );

	} );