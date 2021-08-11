import * as THREE from 'three';
import {IFramework} from './../../animationTypes'

export const ManyPoints = (framework : IFramework) => {


		let scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffffff);


		let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.set( 0, 50, -950 );






		let ManyPoints = {
		 	  name: 'ManyPoints',
		    scene: scene,
		    camera: camera,
		    tag : 'generic',
		    backgroundDark : true,
		    responsive : true,
		    sceneTimer : window.performance.now(),
		    sceneLength: 19000,
	      onUpdate : function(framework : IFramework){



	      	}
		}
		return ManyPoints
	}
