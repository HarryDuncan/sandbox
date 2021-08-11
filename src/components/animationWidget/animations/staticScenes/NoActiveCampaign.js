import * as THREE from "three";
import React, { Component } from "react";
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

let renderer = new THREE.WebGLRenderer( { antialias: true } );
let camera = new THREE.PerspectiveCamera( 705, window.innerWidth / window.innerHeight, 1, 1000 );
let container, stats;
let  scene;
let controls;
const clock = new THREE.Clock();
let breakAnimation;



export class NoActiveCampaign extends Component {

  	componentDidMount() {
  		breakAnimation = false

			// camera

			camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );
			camera.position.z = 1500;

			// scene

			scene = new THREE.Scene();
			scene.background = new THREE.Color(0xffffff)
			scene.fog = new THREE.Fog( scene.background, 3500, 15000 );

			// world

			const s = 150;

			const geometry = new THREE.BoxBufferGeometry( s, s, s );
			const material = new THREE.MeshPhongMaterial( { color: 0x00b32d, specular: 0xffffff, shininess: 50 } );
			const material2 = new THREE.MeshPhongMaterial( { color: 0x006aeb, specular: 0xffffff, shininess: 50 } );
			for ( let i = 0; i < 500; i ++ ) {
				let mesh;
				if(Number(i) % 2 === 0){
					mesh = new THREE.Mesh( geometry, material );
				}else{
					mesh = new THREE.Mesh( geometry, material2 );
				}
				

				mesh.position.x = 1800 * ( 3.0 * Math.random() - 1.0 );
				mesh.position.y = 1800 * ( 3.0 * Math.random() - 1.0 );
				mesh.position.z = 1800 * ( 3.0 * Math.random() - 1.0 );

				mesh.rotation.x = Math.random() * Math.PI;
				mesh.rotation.y = Math.random() * Math.PI;
				mesh.rotation.z = Math.random() * Math.PI;

				mesh.matrixAutoUpdate = false;
				mesh.updateMatrix();

				scene.add( mesh );

			}


			// lights
			var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    		ambientLight.position.x = 900
    		scene.add( ambientLight );
			const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
			dirLight.position.set( 0, - 1, 0 ).normalize();
			dirLight.color.setHSL( 0.1, 0.7, 0.5 );
			scene.add( dirLight );

			// lensflares
			const textureLoader = new THREE.TextureLoader();

			const textureFlare0 = textureLoader.load( 'textures/lensflare/lensflare0.png' );
			const textureFlare3 = textureLoader.load( 'textures/lensflare/lensflare3.png' );

			addLight( 0.55, 0.9, 0.5, 5000, 0, - 1000 );
			addLight( 0.08, 0.8, 0.5, 0, 0, - 1000 );
			

			function addLight( h, s, l, x, y, z ) {

				const light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
				light.color = new THREE.Color(0x00b32d)
				light.position.set( x, y, z );
				scene.add( light );

				const lensflare = new Lensflare();
				lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, light.color ) );
				lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
				lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
				lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
				lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
				light.add( lensflare );

			}

			// renderer

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.outputEncoding = THREE.sRGBEncoding;
			this.container.appendChild( renderer.domElement );

			//

			// events

			window.addEventListener( 'resize', onWindowResize, false );
			animate();

			function onWindowResize() {

				renderer.setSize( window.innerWidth, window.innerHeight );

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

			}

			//

			function animate() {
				  if(breakAnimation){
		          cancelAnimationFrame(animate)
		        }else{
		          requestAnimationFrame( animate );
		         	renderAnimation();
		        }  
				
				

			}

			function renderAnimation() {
				camera.rotation.x += 0.0003
        		camera.rotation.y += 0.0003
					renderer.render( scene, camera );
				}
			}

			//

			

	componentWillUnmount(){
	    renderer.dispose()
	    breakAnimation = true
	     window.removeEventListener('resize', this.handleResize, false)
	  }

	render() {
	    return (
	        <div style={{width:"inherit", height:"inherit", position:"fixed", zIndex: '-1', top: 0}} 
	          ref={thisNode => this.container=thisNode}>
	      </div>  
	    )
	 }
  }