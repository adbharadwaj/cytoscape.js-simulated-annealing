( function webpackUniversalModuleDefinition( root, factory ) {
	if ( typeof exports === 'object' && typeof module === 'object' )
		module.exports = factory();
	else if ( typeof define === 'function' && define.amd )
		define( [], factory );
	else if ( typeof exports === 'object' )
		exports[ "cytoscapeSimulatedAnnealing" ] = factory();
	else
		root[ "cytoscapeSimulatedAnnealing" ] = factory();
} )( typeof self !== 'undefined' ? self : this, function () {
	return /******/ ( function ( modules ) { // webpackBootstrap
		/******/ // The module cache
		/******/
		var installedModules = {};
		/******/
		/******/ // The require function
		/******/
		function __webpack_require__( moduleId ) {
			/******/
			/******/ // Check if module is in cache
			/******/
			if ( installedModules[ moduleId ] ) {
				/******/
				return installedModules[ moduleId ].exports;
				/******/
			}
			/******/ // Create a new module (and put it into the cache)
			/******/
			var module = installedModules[ moduleId ] = {
				/******/
				i: moduleId,
				/******/
				l: false,
				/******/
				exports: {}
				/******/
			};
			/******/
			/******/ // Execute the module function
			/******/
			modules[ moduleId ].call( module.exports, module, module.exports, __webpack_require__ );
			/******/
			/******/ // Flag the module as loaded
			/******/
			module.l = true;
			/******/
			/******/ // Return the exports of the module
			/******/
			return module.exports;
			/******/
		}
		/******/
		/******/
		/******/ // expose the modules object (__webpack_modules__)
		/******/
		__webpack_require__.m = modules;
		/******/
		/******/ // expose the module cache
		/******/
		__webpack_require__.c = installedModules;
		/******/
		/******/ // define getter function for harmony exports
		/******/
		__webpack_require__.d = function ( exports, name, getter ) {
			/******/
			if ( !__webpack_require__.o( exports, name ) ) {
				/******/
				Object.defineProperty( exports, name, {
					/******/
					configurable: false,
					/******/
					enumerable: true,
					/******/
					get: getter
					/******/
				} );
				/******/
			}
			/******/
		};
		/******/
		/******/ // getDefaultExport function for compatibility with non-harmony modules
		/******/
		__webpack_require__.n = function ( module ) {
			/******/
			var getter = module && module.__esModule ?
				/******/
				function getDefault() {
					return module[ 'default' ];
				} :
				/******/
				function getModuleExports() {
					return module;
				};
			/******/
			__webpack_require__.d( getter, 'a', getter );
			/******/
			return getter;
			/******/
		};
		/******/
		/******/ // Object.prototype.hasOwnProperty.call
		/******/
		__webpack_require__.o = function ( object, property ) {
			return Object.prototype.hasOwnProperty.call( object, property );
		};
		/******/
		/******/ // __webpack_public_path__
		/******/
		__webpack_require__.p = "";
		/******/
		/******/ // Load entry module and return exports
		/******/
		return __webpack_require__( __webpack_require__.s = 0 );
		/******/
	} )
	/************************************************************************/
	/******/
	( [
		/* 0 */
		/***/
		( function ( module, exports, __webpack_require__ ) {

			"use strict";
			var __WEBPACK_AMD_DEFINE_RESULT__;

			( function () {

				// registers the extension on a cytoscape lib ref
				var getLayout = __webpack_require__( 1 );
				var register = function ( cytoscape ) {
					var Layout = getLayout( cytoscape );
					cytoscape( 'layout', 'cytoscape-simulated-annealing', Layout );
				};

				if ( typeof module !== 'undefined' && module.exports ) { // expose as a commonjs module
					module.exports = register;
				}

				if ( true ) { // expose as an amd/requirejs module
					!( __WEBPACK_AMD_DEFINE_RESULT__ = ( function () {
							return register;
						} ).call( exports, __webpack_require__, exports, module ),
						__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && ( module.exports = __WEBPACK_AMD_DEFINE_RESULT__ ) );
				}

				if ( typeof cytoscape !== 'undefined' ) { // expose to global cytoscape (i.e. window.cytoscape)
					register( cytoscape );
				}

			} )();

			/***/
		} ),
		/* 1 */
		/***/
		( function ( module, exports, __webpack_require__ ) {

			"use strict";


			var SimulatedAnnealing = __webpack_require__( 2 );
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
					SATemperatureDecreaseRate: 0.75, // Rate at which temperature decreases
					nodeDistanceFactor: 2, // Node distance factor used to compute node distance cost.
					borderDistanceFactor: 1, // Border distance factor used to compute border distance cost.
					edgeLengthFactor: 0.5, // Edge length factor used to compute edge length cost.
					nodeEdgeDistanceFactor: 0.1, // Node Edge distance factor used to compute node edge distance cost.
					edgeCrossingsFactor: 1000, // Edge crossings factor used to compute edge crossings cost.
					iterations: 2, // Number of simulated annealing iterations
					steps: 20, // Number of steps per iterations.
					customEnergyFunction: {} // Contains the custom energy functions defined by the user.
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

				Layout.prototype.addEnergyFunction = function ( name, fn ) {
					this.options.customEnergyFunction[ name ] = fn;
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

			/***/
		} ),
		/* 2 */
		/***/
		( function ( module, exports, __webpack_require__ ) {

			( function () {
				"use strict";
				__webpack_require__( 3 );
				window.SAGraph = function ( userOptions ) {
					var _extend = function ( a, b ) {
						for ( var key in b ) {
							if ( b.hasOwnProperty( key ) ) {
								a[ key ] = b[ key ];
							}
						}
						return a;
					};
					var _clone = function ( obj ) {
						if ( obj == null || typeof ( obj ) != 'object' )
							return obj;

						var temp = obj.constructor(); // changed

						for ( var key in obj )
							temp[ key ] = _clone( obj[ key ] );
						return temp;
					};

					var defaultOptions = {
						SAInitialTemperature: 400,
						SATemperatureDecreaseRate: 0.99,
						nodeDistanceFactor: 100,
						borderDistanceFactor: 100,
						edgeLengthFactor: 500,
						nodeEdgeDistanceFactor: 100,
						edgeCrossingsFactor: 100000,
						iterations: 1,
						steps: 10,
					};

					var options = _extend( defaultOptions, userOptions );
					var layout = options.layout;
					var cy = options.cy;

					var _state2; // Stores the next possible state
					var _currentNode; // Stores the current node.
					var _edgeCrossingsTemp = {
						energy: 0,
						data: {}
					};

					var _area = options.boundingBox.w * options.boundingBox.h;

					var _distance = function ( node1, node2 ) {
						return Math.sqrt( _distanceSquared( node1, node2 ) );
					};
					var _distanceSquared = function ( node1, node2 ) {
						return ( node1.position( 'x' ) - node2.position( 'x' ) ) * ( node1.position( 'x' ) - node2.position( 'x' ) ) +
							( node1.position( 'y' ) - node2.position( 'y' ) ) * ( node1.position( 'y' ) - node2.position( 'y' ) );
					};

					var _distancePointToSegment = function ( p, v, w ) {
						var l2 = _distanceSquared( v, w );
						if ( l2 == 0 ) return _distanceSquared( p, v );
						var _p = p.position();
						var _v = v.position();
						var _w = w.position();
						var t = ( ( _p.x - _v.x ) * ( _w.x - _v.x ) + ( _p.y - _v.y ) * ( _w.y - _v.y ) ) / l2;
						if ( t < 0 ) return _distanceSquared( p, v );
						if ( t > 1 ) return _distanceSquared( p, w );

						var t = {
							x: _v.x + t * ( _w.x - _v.x ),
							y: _v.y + t * ( _w.y - _v.y )
						};
						return ( _p.x - t.x ) * ( _p.x - t.x ) + ( _p.y - t.y ) * ( _p.y - t.y );
					};

					var _lineIntersection = function ( line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY ) {
						/*
						This code is taken from here: http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
						 */
						// if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
						var denominator, a, b, numerator1, numerator2, result = {
							x: null,
							y: null,
							onLine1: false,
							onLine2: false
						};
						denominator = ( ( line2EndY - line2StartY ) * ( line1EndX - line1StartX ) ) - ( ( line2EndX - line2StartX ) * ( line1EndY - line1StartY ) );
						if ( denominator == 0 ) {
							return result;
						}
						a = line1StartY - line2StartY;
						b = line1StartX - line2StartX;
						numerator1 = ( ( line2EndX - line2StartX ) * a ) - ( ( line2EndY - line2StartY ) * b );
						numerator2 = ( ( line1EndX - line1StartX ) * a ) - ( ( line1EndY - line1StartY ) * b );
						a = numerator1 / denominator;
						b = numerator2 / denominator;

						// if we cast these lines infinitely in both directions, they intersect here:
						result.x = line1StartX + ( a * ( line1EndX - line1StartX ) );
						result.y = line1StartY + ( a * ( line1EndY - line1StartY ) );
						/*
						 // it is worth noting that this should be the same as:
						 x = line2StartX + (b * (line2EndX - line2StartX));
						 y = line2StartX + (b * (line2EndY - line2StartY));
						 */
						// if line1 is a segment and line2 is infinite, they intersect if:
						if ( a > 0 && a < 1 ) {
							result.onLine1 = true;
						}
						// if line2 is a segment and line1 is infinite, they intersect if:
						if ( b > 0 && b < 1 ) {
							result.onLine2 = true;
						}
						// if line1 and line2 are segments, they intersect if both of the above are true
						return result;
					}

					var _areEdgesCrossing = function ( src1, tgt1, src2, tgt2 ) {

						if ( src1.id() == src2.id() || src1.id() == tgt2.id() || tgt1.id() == src2.id() || tgt1.id() == tgt2.id() )
							// They share a node.
							return false;

						var result = _lineIntersection( src1.position( 'x' ), src1.position( 'y' ), tgt1.position( 'x' ), tgt1.position( 'y' ),
							src2.position( 'x' ), src2.position( 'y' ), tgt2.position( 'x' ), tgt2.position( 'y' ) )

						return !!( result && result.x && result.y && result.onLine1 && result.onLine2 );
					};

					var EnergyFunctions = {
						nodeDistance: function ( cy ) {
							if ( !options.nodeDistanceFactor ) {
								return Promise.resolve( 0 );
							}

							var willComputeNodeDistance = [];

							var nodes = cy.nodes();

							for ( var i = 1; i < nodes.length; i++ ) {
								for ( var j = i + 1; j < nodes.length; j++ ) {
									willComputeNodeDistance.push( new Promise( function ( resolve, reject ) {
										var distance = _distanceSquared( nodes[ i ], nodes[ j ] ) / _area;
										resolve( options.nodeDistanceFactor / distance );
									} ) )
								}
							}

							function getSum( total, num ) {
								return total + num;
							}

							return Promise.all( willComputeNodeDistance ).then( function ( values ) {
								return Promise.resolve( values.reduce( getSum ) );
							} );
						},
						borderDistance: function ( cy ) {
							if ( !options.borderDistanceFactor ) {
								return Promise.resolve( 0 );
							}

							var willComputeBorderDistance = [];

							cy.nodes().each( function ( node ) {
								willComputeBorderDistance.push( new Promise( function ( resolve, reject ) {
									var cost = 0;
									if ( node.position( 'x' ) > options.boundingBox.x1 && node.position( 'x' ) < options.boundingBox.x2 &&
										node.position( 'y' ) > options.boundingBox.y1 && node.position( 'y' ) < options.boundingBox.y2 ) {
										// Nodes repel edges
										var dist = [ options.boundingBox.x2 - node.position( 'x' ), options.boundingBox.y2 - node.position( 'y' ), node.position( 'x' ) - options.boundingBox.x1, node.position( 'y' ) - options.boundingBox.y1 ];
										for ( var distIndex = 0; distIndex < 4; distIndex++ ) {
											cost += 1 / ( dist[ distIndex ] );
										}
									} else {
										// If one is offscreen, cost is awful.
										cost = 10000000;
									}
									resolve( cost * options.borderDistanceFactor );
								} ) )
							} );

							function getSum( total, num ) {
								return total + num;
							}

							return Promise.all( willComputeBorderDistance ).then( function ( values ) {
								return Promise.resolve( values.reduce( getSum ) );
							} );
						},
						edgeLength: function ( cy ) {
							if ( !options.edgeLengthFactor ) {
								return Promise.resolve( 0 );
							}

							var willComputeEdgeLength = [];

							cy.nodes().each( function ( node1 ) {
								cy.edges().each( function ( edge ) {
									if ( edge.data( 'source' ) == node1.id() || edge.data( 'target' ) == node1.id() ) {
										var node2 = edge.data( 'source' ) == node1.id() ? cy.nodes( '#' + edge.data( 'target' ) ) : cy.nodes( '#' + edge.data( 'source' ) );
										willComputeEdgeLength.push( new Promise( function ( resolve, reject ) {
											var distance = _distance( node1, node2 );
											resolve( options.edgeLengthFactor * distance );
										} ) );
									}

								} );
							} );

							function getSum( total, num ) {
								return total + num;
							}

							return Promise.all( willComputeEdgeLength ).then( function ( values ) {
								values.push( 0 );
								return Promise.resolve( values.reduce( getSum ) );
							} );
						},
						nodeEdgeDistance: function ( cy ) {
							// TODO: implement caching
							if ( !options.nodeEdgeDistanceFactor ) {
								return Promise.resolve( 0 );
							}

							var willComputeNodeEdgeDistances = [];

							cy.nodes().each( function ( node1 ) {
								cy.edges().each( function ( edge ) {
									if ( edge.data( 'source' ) !== node1.id() && edge.data( 'target' ) !== node1.id() ) {
										willComputeNodeEdgeDistances.push( new Promise( function ( resolve, reject ) {
											var t = _distancePointToSegment( node1, cy.nodes( '#' + edge.data( 'source' ) ), cy.nodes( '#' + edge.data( 'target' ) ) )
											resolve( options.nodeEdgeDistanceFactor / ( t / _area ) );
										} ) );
									}
								} );
							} );

							function getSum( total, num ) {
								return total + num;
							}

							return Promise.all( willComputeNodeEdgeDistances ).then( function ( values ) {
								return Promise.resolve( values.reduce( getSum ) );
							} );
						},
						edgeCrossings: function ( cy, flush ) {
							/*
							 * If flush is set to True, function will compute edge crossings for all edges.
							 * Otherwise, it will compute edge crossings for current node (_currentNode) only.
							 */

							if ( !options.edgeCrossingsFactor ) {
								return Promise.resolve( 0 );
							}

							var edgeCrossing = function ( src1, tgt1, src2, tgt2 ) {

								return new Promise( function ( resolve, reject ) {
									var edge1ID = src1.id() + tgt1.id();
									var edge2ID = src2.id() + tgt2.id();
									if ( !_edgeCrossingsTemp.data.hasOwnProperty( edge1ID ) ) {
										_edgeCrossingsTemp.data[ edge1ID ] = {}
									}

									if ( !_edgeCrossingsTemp.data.hasOwnProperty( edge2ID ) ) {
										_edgeCrossingsTemp.data[ edge2ID ] = {}
									}

									if ( !_edgeCrossingsTemp.data[ edge2ID ].hasOwnProperty( edge1ID ) ) {
										_edgeCrossingsTemp.data[ edge2ID ][ edge1ID ] = 0
									}

									if ( !_edgeCrossingsTemp.data[ edge1ID ].hasOwnProperty( edge2ID ) ) {
										_edgeCrossingsTemp.data[ edge1ID ][ edge2ID ] = 0
									}

									var bool = _areEdgesCrossing( src1, tgt1, src2, tgt2 ) ? 1 : 0;

									_edgeCrossingsTemp.energy = _edgeCrossingsTemp.energy - options.edgeCrossingsFactor * ( _edgeCrossingsTemp.data[ edge2ID ][ edge1ID ] - bool );
									_edgeCrossingsTemp.data[ edge1ID ][ edge2ID ] = bool;
									_edgeCrossingsTemp.data[ edge2ID ][ edge1ID ] = bool;

									resolve();
								} );

							};

							_edgeCrossingsTemp = {
								energy: 0,
								data: {}
							};

							var edges = cy.edges();
							var willComputeEdgeCrossings = [];
							for ( var i = 0; i < edges.length; i++ ) {
								for ( var j = 0; j < edges.length; j++ ) {
									if ( edges[ i ].id() !== edges[ j ].id() ) {
										willComputeEdgeCrossings.push( edgeCrossing( cy.nodes( '#' + edges[ i ].data( 'source' ) ), cy.nodes( '#' + edges[ i ].data( 'target' ) ),
											cy.nodes( '#' + edges[ j ].data( 'source' ) ), cy.nodes( '#' + edges[ j ].data( 'target' ) ) ) );
									}
								}
							}

							return Promise.all( willComputeEdgeCrossings ).then( function () {
								return _edgeCrossingsTemp.energy;
							} );
						},
					};

					EnergyFunctions = _extend( EnergyFunctions, options.customEnergyFunction );

					return SimulatedAnnealing( {
						initialTemperature: options.SAInitialTemperature,
						temperatureDecreaseRate: options.SATemperatureDecreaseRate,
						iterations: options.iterations,
						steps: options.steps,
						onStep: options.onStep,
						getInitialState: function () {
							layout = cy.layout( {
								name: 'random',
								boundingBox: options.boundingBox,
								pan: options.pan,
								zoom: options.zoom,
							} );

							var willCalculateInitialEdgeCrossing = layout.pon( 'layoutstop' ).then( function ( event ) {
								//calculate initial crossings
								_state2 = cy.elements().clone();
								return EnergyFunctions.edgeCrossings( cy, true );
							} )

							layout.run();

							return willCalculateInitialEdgeCrossing.then( function ( energy ) {
								return Promise.resolve( cy.elements() );
							} );
						},
						getNeighboringState: function ( state, temperature ) {
							/*
							 * Change the position for ONE node only.
							 */

							return new Promise( function ( resolve, reject ) {
								_currentNode = cy.nodes()[ Math.floor( Math.random() * cy.nodes().length ) ];
								var factor = Math.pow( temperature / options.SAInitialTemperature, 2 ) / 2,
									scaleX = options.boundingBox.w * factor,
									scaleY = options.boundingBox.h * factor;

								var _currentNode2 = _state2.nodes( '#' + _currentNode.id() )
								_currentNode2.position( {
									x: _currentNode2.position( 'x' ) + Math.random() * scaleX - ( scaleX / 2 ),
									y: _currentNode2.position( 'y' ) + Math.random() * scaleY - ( scaleY / 2 )
								} );

								// Limit new position values to the bounds
								_currentNode2.position( {
									x: Math.max( options.boundingBox.x1, Math.min( _currentNode2.position( 'x' ), options.boundingBox.x2 ) ),
									y: Math.max( options.boundingBox.y1, Math.min( _currentNode2.position( 'y' ), options.boundingBox.y2 ) )
								} );

								resolve( _state2 );
							} );


						},
						calculateEnergy: function ( state ) {
							// var energy = 0;
							var willComputeEnergyFunctions = [];

							function getSum( total, num ) {
								return total + num;
							}

							for ( var i in EnergyFunctions ) {
								if ( EnergyFunctions.hasOwnProperty( i ) ) {
									willComputeEnergyFunctions.push( EnergyFunctions[ i ]( state ) );
								}
							}
							return Promise.all( willComputeEnergyFunctions ).then( function ( values ) {
								console.log( values );
								return Promise.resolve( values.reduce( getSum ) );
							} );

						},
						acceptChange: function ( currentState, newState ) {
							return new Promise( function ( resolve, reject ) {
								currentState.nodes( '#' + _currentNode.id() ).layoutPositions( layout, options, function ( ele ) {
									ele = typeof ele === "object" ? ele : this;

									var dModel = newState.nodes( '#' + _currentNode.id() ).position();

									if ( ele == _currentNode ) {
										return {
											x: dModel.x,
											y: dModel.y
										};
									} else {
										return {
											x: ele.position( 'x' ),
											y: ele.position( 'y' )
										}
									}
								} );

								layout.pon( 'layoutstop' ).then( function ( event ) {
									resolve();
								} );
							} )
						},
						discardChange: function ( currentState, nextState ) {
							nextState.nodes( '#' + _currentNode.id() ).position( {
								x: currentState.nodes( '#' + _currentNode.id() ).position( 'x' ),
								y: currentState.nodes( '#' + _currentNode.id() ).position( 'y' )
							} );
							return Promise.resolve();
						}
					} );
				};
			} )();

			/***/
		} ),
		/* 3 */
		/***/
		( function ( module, exports ) {

			( function () {
				"use strict";
				window.SimulatedAnnealing = function ( userConfig ) {
					var _extend = function ( a, b ) {
						for ( var key in b ) {
							if ( b.hasOwnProperty( key ) ) {
								a[ key ] = b[ key ];
							}
						}
						return a;
					};
					var _clone = function ( obj ) {
						if ( obj == null || typeof ( obj ) != 'object' )
							return obj;

						var temp = obj.constructor(); // changed

						for ( var key in obj )
							temp[ key ] = _clone( obj[ key ] );
						return temp;
					};

					var defaultConfig = {
						initialTemperature: 100,
						temperatureDecreaseRate: 0.99,
						iterations: 1,
						steps: 10,
						getInitialState: function ( temperature ) {
							return Promise.resolve( {
								value: temperature
							} );
						},
						getNeighboringState: function ( state, temperature ) {
							return Promise.resolve( {
								value: state.value + ( temperature / 2 - temperature * Math.random() )
							} );
						},
						calculateEnergy: function ( state ) {
							return Promise.resolve( Math.abs( state.value ) );
						},
						terminatingCondition: function ( state, temperature ) {
							return temperature === 0 || _currentIteration >= config.iterations;
						},
						decreaseTemperature: function ( state, energy, temperature ) {
							return temperature * config.temperatureDecreaseRate;
						},
						decideChange: function ( newEnergy, oldEnergy, temperature ) {
							var delta = newEnergy - oldEnergy;
							if ( delta < 0 ) {
								return true;
							}

							var C = Math.exp( -delta / temperature );
							var R = Math.random();

							return R < C;
						},
						discardChange: function ( currentState, nextState ) {
							return Promise.resolve();
						},
						acceptChange: function ( currentState, newState ) {
							_currentState = _clone( newState );
							return Promise.resolve();
						},
						onStep: function ( obj ) {
							console.log( obj );
						}
					};

					var config = _extend( defaultConfig, userConfig );

					var _currentState,
						_currentStep,
						_currentIteration,
						_currentEnergy,
						_currentTemperature;

					return {
						doStep: function () {
							var _nextState, _energy;
							return config.getNeighboringState( _currentState, _currentTemperature )
								.then( function ( nextState ) {
									_nextState = nextState;
									return config.calculateEnergy( nextState )
								} )
								.then( function ( energy ) {
									if ( !config.decideChange( energy, _currentEnergy, _currentTemperature ) ) {
										return config.discardChange( _currentState, _nextState ).then( function () {
											_currentStep += 1;
											return Promise.resolve();;
										} );
									} else {
										_energy = energy;
										return config.acceptChange( _currentState, _nextState ).then( function () {
											_currentStep += 1;
											_currentEnergy = _energy;
											return Promise.resolve();
										} );
									}
								} );
						},
						init: function () {
							_currentTemperature = config.initialTemperature;
							return config.getInitialState( _currentTemperature )
								.then( function ( currentState ) {
									_currentState = currentState
									return config.calculateEnergy( currentState );
								} )
								.then( function ( currentEnergy ) {
									_currentEnergy = currentEnergy;
									_currentIteration = 0;
									return Promise.resolve();
								} );
						},
						doIteration: function () {
							var sa = this;
							return sa.doStep().then( function () {
								config.onStep( sa.getCurrentObject() );
								if ( _currentStep < config.steps ) {
									return sa.doIteration();
								} else {
									return Promise.resolve();
								}
							} );
						},
						anneal: function () {
							var sa = this;
							_currentStep = 0;
							return sa.doIteration().then( function () {
								_currentTemperature = config.decreaseTemperature( _currentState, _currentEnergy, _currentTemperature );
								_currentIteration += 1
								if ( !config.terminatingCondition( _currentState, _currentTemperature ) ) {
									return sa.anneal();
								} else {
									return sa.getCurrentObject();
								}
							} );
						},
						run: function () {
							var sa = this;
							return sa.init().then( function () {
								return sa.anneal().then( function ( currentObject ) {
									return currentObject;
								} )
							} );
						},
						getCurrentObject: function () {
							return {
								state: _currentState,
								energy: _currentEnergy,
								temperature: _currentTemperature,
								steps: _currentStep,
								iterations: _currentIteration
							};
						}
					};
				};
			} )();

			/***/
		} )
		/******/
	] );
} );