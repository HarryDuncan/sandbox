import * as THREE from "three";
import { IFramework } from "./../../animationTypes";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";
// @ts-ignore

import { animateCameraAlongSpline } from "../cameraControls";
import {
  BlurPass,
  EdgeDetectionMode,
  EffectPass,
  KernelSize,
  SavePass,
  SMAAEffect,
  SMAAPreset,
  RenderPass,
  SMAAImageLoader,
  TextureEffect,
} from "postprocessing";

import { vertShader } from "./shaders/vert";

let sampleClosedSpline = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-100, -10, -50),
    new THREE.Vector3(0, 100, 100),
    new THREE.Vector3(100, -50, -50),
    new THREE.Vector3(0, 0, -100),
  ],
  true
);

export const VinylScene = (framework: IFramework) => {
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 50, -950);

  let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  ambientLight.position.x = 40;
  scene.add(ambientLight);
  var pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.y = 0;
  pointLight.castShadow = true;
  scene.add(pointLight);

  const onProgress = () => {
    console.log("asdasd");
  };

  const onError = () => {
    console.log("asdsd");
  };
  // new MTLLoader( manager )
  // 		.setPath( '../animationAssets/payTheRent/' )
  // 		.load( 'Bloom.mtl', function ( materials ) {
  //
  // 			materials.preload();

  let url = "../animationAssets/vinyl/LP.obj";
  const loader = new OBJLoader();
  loader.load(url, (object) => {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        //  console.log(smaaImageLoader)
        if (child.name === "LP12_ LP-12_") {
          child.material = new THREE.MeshPhongMaterial({
            color: 0x00000,
            reflectivity: 0.7,
          });
          //@ts-ignore
        } else {
          child.material = new THREE.MeshPhongMaterial({
            color: 0x0255e1,
            reflectivity: 0.7,
          });
        }
      }
    });

    object.position.set(0, 0, 0);
    object.name = "prinicpal";
    object.rotation.set(0, -Math.PI, 0);
    object.scale.set(4, 4, 4);
    console.log(object);
    camera.lookAt(object.position);
    scene.add(object);
  });

  // } );
  //

  // Passes
  //
  // const savePass = new SavePass();
  // const blurPass = new BlurPass({
  // 	height: 240
  // });
  //
  // const smaaEffect = new SMAAEffect(
  //
  // 	SMAAPreset.HIGH,
  // 	EdgeDetectionMode.LUMA
  // );
  //
  // const textureEffect = new TextureEffect({
  // 	texture: savePass.renderTarget.texture
  // });
  //
  // const smaaPass = new EffectPass(camera, smaaEffect);
  // const texturePass = new EffectPass(camera, textureEffect);

  // textureEffect.blendMode.opacity.value = 0.8;

  // Creating the Icosahedron
  const geometry = new THREE.IcosahedronGeometry(2, 8); // ~250,000 Vertices for now

  let uniform = {
    uTime: { value: 1.0 },
  };

  let material = new THREE.ShaderMaterial({
    uniforms: uniform,
    vertexShader: vertShader,
  });

  const ico = new THREE.Points(geometry, material);
  ico.position.set(0, 0, 0);
  scene.add(ico);

  // framework.composer.addPass(smaaPass);
  // framework.composer.addPass(savePass);
  // framework.composer.addPass(blurPass);
  // framework.composer.addPass(texturePass);
  // console.log(framework.composer)
  // framework.composer.addPass(new RenderPass(scene, camera));

  let VinylScene = {
    name: "VinylScene",
    scene: scene,
    camera: camera,
    tag: "generic",
    backgroundDark: false,
    responsive: true,
    sceneTimer: window.performance.now(),
    sceneLength: 19000,
    composer: framework.composer,
    onUpdate: function (framework: IFramework) {
      if (material && material.uniforms) {
        material.uniforms.uTime.value = performance.now() / 1000;
      }
      // console.log(ico)
      animateCameraAlongSpline(framework.camera, 5, sampleClosedSpline);
      framework.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
  };
  return VinylScene;
};
