
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';




export function RoomAndMirror(framework) {
		let camera, scene, renderer;

		let cameraControls;

		let sphereGroup, smallSphere;

		let groundMirror, verticalMirror;


		

		// scene
		scene = new THREE.Scene();

		// camera
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
		camera.position.set( 0, 75, 160 );

		cameraControls = new OrbitControls( camera, framework.renderer.domElement );
		cameraControls.target.set( 0, 40, 0 );
		cameraControls.maxDistance = 400;
		cameraControls.minDistance = 10;
		cameraControls.update();

		//

		const planeGeo = new THREE.PlaneGeometry( 100.1, 100.1 );

		// reflectors/mirrors

		let geometry, material;

		geometry = new THREE.CircleGeometry( 40, 64 );
		groundMirror = new Reflector( geometry, {
			clipBias: 0.003,
			textureWidth: window.innerWidth * window.devicePixelRatio,
			textureHeight: window.innerHeight * window.devicePixelRatio,
			color: 0x777777
		} );
		groundMirror.position.y = 0.5;
		groundMirror.rotateX( - Math.PI / 2 );
		scene.add( groundMirror );

		let groundMirror2 = new Reflector( geometry, {
			clipBias: 0.003,
			textureWidth: window.innerWidth * window.devicePixelRatio,
			textureHeight: window.innerHeight * window.devicePixelRatio,
			color: 0x777777
		} );
		groundMirror2.position.x = 49.5;
		groundMirror2.position.y = 50;
		groundMirror2.rotateY( - Math.PI / 2 );
		scene.add( groundMirror2 );

		let groundMirror3 = new Reflector( geometry, {
			clipBias: 0.003,
			textureWidth: window.innerWidth * window.devicePixelRatio,
			textureHeight: window.innerHeight * window.devicePixelRatio,
			color: 0x777777
		} );
		groundMirror3.position.x = -49.5;
		groundMirror3.position.y = 50;
		groundMirror3.rotateY(  Math.PI / 2 );
		scene.add( groundMirror3 );

		geometry = new THREE.PlaneGeometry( 100, 100 );
		verticalMirror = new Reflector( geometry, {
			clipBias: 0.003,
			textureWidth: window.innerWidth * window.devicePixelRatio,
			textureHeight: window.innerHeight * window.devicePixelRatio,
			color: 0x889999
		} );
		verticalMirror.position.y = 50;
		verticalMirror.position.z = - 50;
		scene.add( verticalMirror );


		sphereGroup = new THREE.Object3D();
		scene.add( sphereGroup );

		geometry = new THREE.CylinderGeometry( 0.1, 15 * Math.cos( Math.PI / 180 * 30 ), 0.1, 24, 1 );
		material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x444444 } );
		const sphereCap = new THREE.Mesh( geometry, material );
		sphereCap.position.y = - 15 * Math.sin( Math.PI / 180 * 30 ) - 0.05;
		sphereCap.rotateX( - Math.PI );

		geometry = new THREE.SphereGeometry( 15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120 );
		// const halfSphere = new THREE.Mesh( geometry, material );
		// halfSphere.add( sphereCap );
		// halfSphere.rotateX( - Math.PI / 180 * 135 );
		// halfSphere.rotateZ( - Math.PI / 180 * 20 );
		// halfSphere.position.y = 7.5 + 15 * Math.sin( Math.PI / 180 * 30 );

		// sphereGroup.add( halfSphere );

		geometry = new THREE.IcosahedronGeometry( 5, 0 );
		material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, flatShading: true } );
		smallSphere = new THREE.Mesh( geometry, material );
		scene.add( smallSphere );

		// walls
		const planeTop = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
		planeTop.position.y = 100;
		planeTop.rotateX( Math.PI / 2 );
		scene.add( planeTop );

		const planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
		planeBottom.rotateX( - Math.PI / 2 );
		scene.add( planeBottom );


		const planeFront = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('../images/art/keith.jpg')}) );
		planeFront.position.z = 50;
		planeFront.position.y = 50;
		planeFront.rotateY( Math.PI );
		scene.add( planeFront );

		const planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color:  0xe92b13} ) );
		planeRight.position.x = 50;
		planeRight.position.y = 50;
		planeRight.rotateY( - Math.PI / 2 );
		scene.add( planeRight );

		const planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color:  0x1c72c7 } ) );
		planeLeft.position.x = - 50;
		planeLeft.position.y = 50;
		planeLeft.rotateY( Math.PI / 2 );
		scene.add( planeLeft );

		// lights
		const mainLight = new THREE.PointLight( 0xcccccc, 1.5, 250 );
		mainLight.position.y = 60;
		scene.add( mainLight );

		

		const redLight = new THREE.PointLight( 0xfed943, 0.85, 1000 );
		redLight.position.set( - 550, 50, 0 );
		scene.add( redLight );

		const blueLight = new THREE.PointLight( 0x1c72c7, 0.85, 1000 );
		blueLight.position.set( 0, 50, 550 );
		scene.add( blueLight );

		

	let RoomAndMirror = {
			name: 'BackdropLight',
		    scene: scene,
		    camera: camera,
		    tag : 'generic',
		    backgroundDark : true,
		    responsive : true,
		    sceneTimer : window.performance.now(),
		    sceneLength: 19000,
		    onUpdate : function(framework){

		    	const timer = Date.now() * 0.01;

				sphereGroup.rotation.y -= 0.002;

				smallSphere.position.set(
					Math.cos( timer * 0.1 ) * 30,
					Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 5,
					Math.sin( timer * 0.1 ) * 30
				);
				smallSphere.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
				smallSphere.rotation.z = timer * 0.8;


		    }


	}

	return RoomAndMirror

}

	// function onWindowResize() {

	// 	camera.aspect = window.innerWidth / window.innerHeight;
	// 	camera.updateProjectionMatrix();

	// 	renderer.setSize( window.innerWidth, window.innerHeight );

	// 	groundMirror.getRenderTarget().setSize(
	// 		window.innerWidth * window.devicePixelRatio,
	// 		window.innerHeight * window.devicePixelRatio
	// 	);
	// 	verticalMirror.getRenderTarget().setSize(
	// 		window.innerWidth * window.devicePixelRatio,
	// 		window.innerHeight * window.devicePixelRatio
	// 	);

	// }

	// function animate() {

	// 	requestAnimationFrame( animate );

		
	// 	renderer.render( scene, camera );

	// }
