
import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {I3DPosition, I2DDimension} from '../../animations.types';

interface ILightBoxParams {
  position : I3DPosition;
  dimension : I2DDimension;
  intensity : number;
  color : string;

  objectName: string ;
}

// Returns a rectangle light and helper
export const createLight = (lightParams : ILightBoxParams) => {
  const light = new THREE.RectAreaLight( lightParams.color, lightParams.intensity, lightParams.dimension.width, lightParams.dimension.height);
  light.position.set( lightParams.position.x, lightParams.position.y , lightParams.position.z );
  light.name = lightParams.objectName

  let helper = new RectAreaLightHelper( light )
  helper.position.set( lightParams.position.x, lightParams.position.y , lightParams.position.z );
  helper.name = `${lightParams.objectName}_helper`

  return [light, helper]
}
