import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { createLight} from './functions';
import {create2DArray, getRandomColor} from './../functions';
import {I2DDimension} from '../animations.types';
interface ILightSceneParams{

}

export const LightScene = (framework : any, sceneParams : ILightSceneParams) => {
		let scene: any;
		let renderer : any;
		let camera : any;


		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.set( 0, 50, -905 );

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x050505);

		RectAreaLightUniformsLib.init();

		let blankMatrixObj = {intensity : 1, color : getRandomColor(), dimension : {width : 5 , height : 5}}
		let matrix = create2DArray(10, 10, blankMatrixObj)


		let c1 = getRandomColor()
		let c2 = getRandomColor()
		const createLightMatrix = (matrix : any[]) => {
				let sceneHeight = 500
				let sceneWidth = 2000
				let margin = 20

				// // Define the light tile params
				// lightDimensions : I2DDimension = {width: (sceneWidth/ rows), height : (sceneHeight/ columns) }
				// intensity = 15
				// color = '0x55cdfc'




				let xCurrent = -(sceneHeight / 2)
				let yCurrent = sceneHeight / 2
				//
				//

				let counter : number = 0
				for(let i in matrix){
					let row = matrix[i]
					for(let r in matrix[i]){
						let lightParams = { position :  {x : ((20 * Number(r)) +(margin * Number(r)) ) ,  y : yCurrent , z : 0 },dimension : matrix[i][r]['dimension'] , intensity : matrix[i][r]['intensity'], color : Number(r) % 2 == 0 ? c2 : c1, objectName : `light_${counter}`}
						let [light, helper ] = createLight(lightParams)
						scene.add(light)
						scene.add(helper)
						counter ++
					}
					yCurrent -=	( 15 + margin )

				}
		}

		createLightMatrix(matrix)




		const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
		const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
		const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
		mshStdFloor.position.set(0, 0, 5 )
		scene.add( mshStdFloor );


		const geoWall =  new THREE.BoxGeometry( 2000, 2000, 0.1 );
		const matStdWall = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
		const mshStdWall = new THREE.Mesh( geoFloor, matStdFloor );
		mshStdFloor.position.set(0, 0,15 )
		scene.add( mshStdFloor );




	const controls = new OrbitControls( camera, framework.renderer.domElement );
			controls.target.copy( mshStdFloor.position );



		let t = window.performance.now();

		let LightScene = {
		 	name: 'BackdropLight',
		    scene: scene,
		    camera: camera,
		    tag : 'generic',
		    backgroundDark : true,
		    responsive : true,
		    sceneTimer : window.performance.now(),
		    sceneLength: 19000,
	      onUpdate : (framework : any) => {
					scene.traverse((o :any ) => {
						if(o.isMesh){
							console.log(o.name)
						}
					});
	      }
		}
		return LightScene
	}
