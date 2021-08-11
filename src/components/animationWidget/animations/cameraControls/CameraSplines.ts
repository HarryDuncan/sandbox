import {Camera, TubeBufferGeometry, Vector3} from "three";


export const animateCameraAlongSpline = (camera : any, scale : number, pipeSpline : any ) => {
  var splineCamera = camera;
  var tubeGeometry = new TubeBufferGeometry(pipeSpline, 100, 2, 3, true);
  var binormal = new Vector3();
  var normal = new Vector3();

  // animate camera along spline
  var time = Date.now();
  var looptime =10 * 1000;
  var t = ( time % looptime ) / looptime;
  var pos = tubeGeometry.parameters.path.getPointAt( t );
  pos.multiplyScalar(scale);
  // interpolation
  var segments = tubeGeometry.tangents.length;
  var pickt = t * segments;
  var pick = Math.floor( pickt );
  var pickNext = ( pick + 1 ) % segments;
  binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
  binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );
  var dir = tubeGeometry.parameters.path.getTangentAt( t );
  var offset = 15;
  normal.copy( binormal ).cross( dir );
  // we move on a offset on its binormal
  pos.add( normal.clone().multiplyScalar( offset ) );
  splineCamera.position.copy( pos );
  // using arclength for stablization in look ahead
  var lookAt = tubeGeometry.parameters.path.getPointAt( ( t + 30 / tubeGeometry.parameters.path.getLength() ) % 1 ).multiplyScalar(scale);
  // camera orientation 2 - up orientation via normal
  splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
  splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);

}
