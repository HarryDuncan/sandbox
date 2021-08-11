// import * as THREE from "three";
// import React, { Component } from "react";
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
// // import { TrackballControls } from '.three/examples/jsm/controls/TrackballControls.js';
// import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
// import './galleryStyles.scss';
// import {ItemTile} from './../ui/itemCard/itemCard';

// let table = [
// 				"H", "Hydrogen", "1.00794", 5, 1,
// 				"He", "Helium", "4.002602", 18, 1,
// 				"Li", "Lithium", "6.941", 1, 2,
// 				"Be", "Beryllium", "9.012182", 2, 2,
// 				"B", "Boron", "10.811", 13, 2,
// 				"C", "Carbon", "12.0107", 14, 2,
// 				"N", "Nitrogen", "14.0067", 15, 2,
// 				"O", "Oxygen", "15.9994", 16, 2,
// 				"F", "Fluorine", "18.9984032", 17, 2,
// 				"Ne", "Neon", "20.1797", 18, 2,
// 				"Na", "Sodium", "22.98976...", 1, 3,
// 				"Mg", "Magnesium", "24.305", 2, 3,
// 				"Al", "Aluminium", "26.9815386", 13, 3,
// 				"Si", "Silicon", "28.0855", 14, 3,
				
// 			];
// let breakAnimation = false;
// let changeScene = true;
// var renderer = new THREE.WebGLRenderer( { antialias: true } );
// var camera = new THREE.PerspectiveCamera( 705, window.innerWidth / window.innerHeight, 1, 1000 );

// const formatTable = (data) => {
// 	table = data
// }

// export function PreviewGallery3D = ({
// 			formatTable(this.props.items)
// 		let camera, scene, renderer;
// 			let controls;
			
// 			const objects = [];5
// 			const targets = { table: [], sphere: [], helix: [], grid: [] };

			

// 				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
// 				camera.position.z = 3000;

// 				scene = new THREE.Scene();

// 				// table

// 				for (let i in table ) {

// 					const element = document.createElement( 'div' );
// 					element.className = 'element';
// 					element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

// 					const img = document.createElement( 'img' );
// 					img.className = 'number';
// 					img.src =`/images/art/${table[i]['Url']}.jpg`
// 					element.appendChild( img );

					
// 					const details = document.createElement( 'div' );
// 					details.className = 'details';
// 					details.innerHTML = table[i]['Title'];
// 					element.appendChild( details );

// 					const objectCSS = new CSS3DObject( element );
// 					objectCSS.position.x = Math.random() * 4000 - 2000;
// 					objectCSS.position.y = Math.random() * 4000 - 2000;
// 					objectCSS.position.z = Math.random() * 4000 - 2000;
// 					scene.add( objectCSS );

// 					objects.push( objectCSS );

// 					//

// 					const object = new THREE.Object3D();
// 					object.position.x = ( (Number(i) % 4) * 440 ) - 1330;
// 					object.position.y = - (Math.floor((Number(i) / 4 )) * 680 ) + 1090;

// 					targets.table.push( object );

// 				}

// 				// sphere

// 				const vector = new THREE.Vector3();

// 				for ( let i = 0, l = objects.length; i < l; i ++ ) {

// 					const phi = Math.acos( - 1 + ( 2 * i ) / l );
// 					const theta = Math.sqrt( l * Math.PI ) * phi;

// 					const object = new THREE.Object3D();

// 					object.position.setFromSphericalCoords( 800, phi, theta );

// 					vector.copy( object.position ).multiplyScalar( 2 );

// 					object.lookAt( vector );

// 					targets.sphere.push( object );

// 				}

// 				// helix

// 				for ( let i = 0, l = objects.length; i < l; i ++ ) {

// 					const theta = i * 0.575 + Math.PI;
// 					const y = - ( i * 80 ) + 450;

// 					const object = new THREE.Object3D();

// 					object.position.setFromCylindricalCoords( 900, theta, y );

// 					vector.x = object.position.x * 2;
// 					vector.y = object.position.y;
// 					vector.z = object.position.z * 2;

// 					object.lookAt( vector );

// 					targets.helix.push( object );

// 				}

// 				// grid

// 				for ( let i = 0; i < objects.length; i ++ ) {

// 					const object = new THREE.Object3D();

// 					object.position.x = ( ( i % 5 ) * 400 ) - 800;
// 					object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
// 					object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

// 					targets.grid.push( object );

// 				}

// 				//

// 				renderer = new CSS3DRenderer();
// 				renderer.setSize( window.innerWidth, window.innerHeight );
// 				this.container.appendChild( renderer.domElement );

// 				//

				

// 				const buttonTable = document.getElementById( 'table' );
// 				buttonTable.addEventListener( 'click', function () {

// 					transform( targets.table, 2000 );

// 				} );

// 				const buttonSphere = document.getElementById( 'sphere' );
// 				buttonSphere.addEventListener( 'click', function () {

// 					transform( targets.sphere, 2000 );

// 				} );

// 				const buttonHelix = document.getElementById( 'helix' );
// 				buttonHelix.addEventListener( 'click', function () {

// 					transform( targets.helix, 2000 );

// 				} );

// 				const buttonGrid = document.getElementById( 'grid' );
// 				buttonGrid.addEventListener( 'click', function () {

// 					transform( targets.grid, 2000 );

// 				} );

// 				transform( targets.table, 2000 );

// 				//

// 			window.addEventListener( 'resize', onWindowResize );
// 			animate();

				

// 			function transform( targets, duration ) {

// 				TWEEN.removeAll();

// 				for ( let i = 0; i < objects.length; i ++ ) {

// 					const object = objects[ i ];
// 					const target = targets[ i ];

// 					new TWEEN.Tween( object.position )
// 						.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
// 						.easing( TWEEN.Easing.Exponential.InOut )
// 						.start();

// 					new TWEEN.Tween( object.rotation )
// 						.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
// 						.easing( TWEEN.Easing.Exponential.InOut )
// 						.start();

// 				}

// 				new TWEEN.Tween( this )
// 					.to( {}, duration * 2 )
// 					.onUpdate( render )
// 					.start();

// 			}

// 			function onWindowResize() {

// 				camera.aspect = window.innerWidth / window.innerHeight;
// 				camera.updateProjectionMatrix();

// 				renderer.setSize( window.innerWidth, window.innerHeight );

// 				render();

// 			}

// 			function animate() {

// 				requestAnimationFrame( animate );

// 				TWEEN.update();

// 				// controls.update();

// 			}

// 		let Gallery3D = {

// 		}

// }


// 	componentDidMount() {
		
		

// 			function render() {

// 				renderer.render( scene, camera );

// 			}
// 	}

// 	 handleResize = () => {
// 	    camera = new THREE.PerspectiveCamera( 705, window.innerWidth / window.innerHeight, 1, 1000 );
// 	    camera.position.y = 180;
// 	  }
// 	  componentWillUnmount(){
// 	    breakAnimation = true
// 	    renderer.dispose()
// 	     window.removeEventListener('resize', this.handleResize, false)
// 	  }
	
// 	render() {
// 		return (
// 			<div>
// 			  <div style={{width:"inherit", height:"inherit", position:"absolute"}} ref={thisNode => this.container=thisNode}/>
				
			
// 			</div>
// 		)
// 	}
// }
			

		

			
