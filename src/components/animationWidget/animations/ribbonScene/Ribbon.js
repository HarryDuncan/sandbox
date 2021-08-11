import {Vector2, Color, MeshPhongMaterial, Face,Mesh, Face3, Geometry, DoubleSide, FaceColors, Vector3, Group, } from 'three'
import {ATUtil} from './ATUTIL'
import {SimplexNoise}  from './SimplexNoise'


export var RIBBON_LEN = 400;//number of spine points



// RIBBON CONSTRUCTOR
export class Ribbon {

	constructor(holder, id) {
		this.up = new Vector3(1,0,0);

		this.direction = new Vector3();
		this.normal = new Vector3();

		this.arm1 = new Vector3();
		this.arm2 = new Vector3();
		this.arm3 = new Vector3();

		this.arm1T = new Vector3();
		this.arm2T = new Vector3();
		this.arm3T = new Vector3();

		this.xAxis = new Vector3(1,0,0);
		this.yAxis = new Vector3(0,1,0);
		this.zAxis = new Vector3(0,0,1);

		this.groupHolder = new Group();
		this.id = id;
		this.noiseId = this.id/300;
		this.holder = holder;
		this.scope = this;
		this.noise = new SimplexNoise();
		this.init()
	}



	init(){


			this.holder.add(this.groupHolder);

			//some thick
			this.ribbonWidth = ATUtil.randomRange(4,10);
			if (Math.random() < 0.2){
				this.ribbonWidth = 20;
			}

			this.color = new Color();
			this.hue = Math.random();
			this.color.setHSL(this.hue,0.4,0.9);

			//head is the thing that moves, prev follows behind
			this.head = new Vector3();
			this.prev = new Vector3();

			//ADD MESH
			this.meshGeom = this.createMeshGeom();

			this.meshMaterial = new MeshPhongMaterial( {
				side: DoubleSide,
				vertexColors:FaceColors,
				color: 0xFFFFFF,
				shininess: 30,
				specular: 0x50473b,
			} );

			this.mesh = new Mesh( this.meshGeom, this.meshMaterial );
			this.groupHolder.add(this.mesh);

			this.mesh.frustumCulled = false;

			//create arm vectors
			var armLenFac = 1.7;
			this.arm1 = new Vector3(300 * armLenFac,0,0);
			this.arm2 = new Vector3(200 * armLenFac,0,0);
			this.arm3 = new Vector3(100 * armLenFac,0,0);

			this.reset();

			// events.on('update',this.update);

		};

		createMeshGeom = () => {

			//make geometry, faces & colors for a ribbon
			var i;
			var geom = new Geometry();
			geom.vertexColors = [];

			//create verts + colors
			for ( i = 0; i < RIBBON_LEN; i ++ ) {
				geom.vertices.push(new Vector3());
				geom.vertices.push(new Vector3());
				geom.vertexColors.push(new Color());
				geom.vertexColors.push(new Color());
			}

			//create faces

			for ( i = 0; i < RIBBON_LEN-1; i ++ ) {
				geom.faces.push( new Face3(i*2,i*2+1,i*2+2));
				geom.faces.push( new Face3(i*2+1,i*2+3,i*2+2));
			}
			return geom;
		};

		reset = () => {

			var i;

			//reset prev position
			this.prev.copy(this.head);

			//reset mesh geom
			for ( i = 0; i < RIBBON_LEN; i ++ ) {
				this.meshGeom.vertices[i*2].copy(this.head);
				this.meshGeom.vertices[i*2+1].copy(this.head);
			}

			//init colors for this ribbon
			//hue is set by noiseId
			var hue1 = (this.noiseId + Math.random()*0.01) % 2;
			var hue2 = (this.noiseId + Math.random()*0.01) % 2;

			if (Math.random() < 0.1)  {
				hue1 = Math.random();
			}
			if (Math.random() < 0.1)  {
				hue2 = Math.random();
			}

			var sat = ATUtil.randomRange(0.6,1);
			var lightness = ATUtil.randomRange(0.2,0.6);

			var col = new Color();

			for ( i = 0; i < RIBBON_LEN-1; i ++ ) {
				//add lightness gradient based on spine position
				col.setHSL( ATUtil.lerp(i/RIBBON_LEN,hue1,hue2), sat, lightness);
				this.meshGeom.faces[i*2].color.copy(col);
				this.meshGeom.faces[i*2+1].color.copy(col);
			}

			this.meshGeom.verticesNeedUpdate = true;
			this.meshGeom.colorsNeedUpdate = true;

		};

		getNoiseAngle = (zOffset) => {
			return this.noise.noise3d( this.noiseTime, this.noiseId, zOffset ) * Math.PI*2;


		}

	 update = () =>{

			this.scope.prev.copy(this.scope.head);

			//MOVE JOINTS
			this.arm1T.copy(this.arm1);
			this.arm2T.copy(this.arm2);
			this.arm3T.copy(this.arm3);

			this.arm1T.applyAxisAngle( this.zAxis, this.getNoiseAngle(0) );
			console.log(this.arm1T)
			this.arm1T.applyAxisAngle( this.yAxis, this.getNoiseAngle(20));

			this.arm2T.applyAxisAngle( this.zAxis, this.getNoiseAngle(50) );
			this.arm2T.applyAxisAngle( this.xAxis, this.getNoiseAngle(70) );

			this.arm3T.applyAxisAngle( this.xAxis, this.getNoiseAngle(100));
			this.arm3T.applyAxisAngle( this.yAxis, this.getNoiseAngle(150) );

			//MOVE HEAD
			this.scope.head.copy(this.arm1T).add(this.arm2T).add(this.arm3T);

			//calc new L + R edge positions from direction between head and prev
			this.direction.subVectors(this.scope.head,this.scope.prev).normalize();
			this.normal.crossVectors( this.direction, this.up ).normalize();
			this.normal.multiplyScalar(this.scope.ribbonWidth);

			//shift each 2 verts down one posn
			//e.g. copy verts (0,1) -> (2,3)
			for ( var i = RIBBON_LEN - 1; i > 0; i -- ) {
				this.scope.meshGeom.vertices[i*2].copy(this.scope.meshGeom.vertices[(i-1)*2]);
				this.scope.meshGeom.vertices[i*2+1].copy(this.scope.meshGeom.vertices[(i-1)*2+1]);
			}

			//populate 1st 2 verts with left and right normalHelper
			this.scope.meshGeom.vertices[0].copy(this.scope.head).add(this.normal);
			this.scope.meshGeom.vertices[1].copy(this.scope.head).sub(this.normal);

			this.scope.meshGeom.verticesNeedUpdate = true;
			this.scope.meshGeom.computeFaceNormals();
			this.scope.meshGeom.computeVertexNormals();

		};

};
