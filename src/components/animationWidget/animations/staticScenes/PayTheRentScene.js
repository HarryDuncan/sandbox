import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";
import { createLight } from "../lightScenes/functions";
export function PayTheRentScene(framework) {
  let scene, renderer, camera;
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 50, -950);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  RectAreaLightUniformsLib.init();

  let lightArr = [
    {
      intensity: 1,
      color: 0xffffff,
      dimension: { width: 420, height: 905 },
      position: { x: 380, y: 0, z: 0 },
    },
    {
      intensity: 1,
      color: 0xffffff,
      dimension: { width: 860, height: 105 },
      position: { x: -170, y: 220, z: 0 },
    },

    {
      intensity: 1,
      color: 0xffff00,
      dimension: { width: 105, height: 105 },
      position: { x: 110, y: 110, z: 0 },
    },

    {
      intensity: 1,
      color: 0xffff00,
      dimension: { width: 105, height: 105 },
      position: { x: -440, y: 330, z: 0 },
    },
    {
      intensity: 1,
      color: 0xffff00,
      dimension: { width: 105, height: 210 },
      position: { x: -330, y: 55, z: 0 },
    },
    {
      intensity: 1,
      color: 0xffff00,
      dimension: { width: 105, height: 105 },
      position: { x: 0, y: 330, z: 0 },
    },
    {
      intensity: 1,
      color: 0xffff00,
      dimension: { width: 315, height: 210 },
      position: { x: -110, y: -165, z: 0 },
    },

    {
      intensity: 1,
      color: 0xffff00,
      dimension: { width: 210, height: 210 },
      position: { x: -165, y: 55, z: 0 },
    },

    {
      intensity: 1,
      color: 0xcc0000,
      dimension: { width: 105, height: 105 },
      position: { x: 0, y: 0, z: 0 },
    },
    {
      intensity: 1,
      color: 0xcc0000,
      dimension: { width: 105, height: 105 },
      position: { x: 0, y: 0, z: 0 },
    },
    {
      intensity: 1,
      color: 0xcc0000,
      dimension: { width: 105, height: 105 },
      position: { x: 0, y: 110, z: 0 },
    },
    {
      intensity: 1,
      color: 0xcc0000,
      dimension: { width: 105, height: 105 },
      position: { x: 110, y: 0, z: 0 },
    },
    {
      intensity: 1,
      color: 0xcc0000,
      dimension: { width: 105, height: 105 },
      position: { x: -330, y: 330, z: 0 },
    },
    {
      intensity: 1,
      color: 0xcc0000,
      dimension: { width: 105, height: 105 },
      position: { x: -220, y: 330, z: 0 },
    },
    {
      intensity: 1,
      color: 0xcc0000,
      dimension: { width: 210, height: 210 },
      position: { x: -495, y: 55, z: 0 },
    },
    // {intensity : 1, color : 0xcc0000, dimension : {width : 105 , height : 105},  position :  {x : -220 ,  y : 330 , z : 0 }},
  ];

  for (let i in lightArr) {
    let lightParams = {
      position: lightArr[i]["position"],
      dimension: lightArr[i]["dimension"],
      intensity: lightArr[i]["intensity"],
      color: lightArr[i]["color"],
      objectName: `light_${Number(i)}`,
    };
    let [light, helper] = createLight(lightParams);
    scene.add(light);
    scene.add(helper);
  }

  const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000);
  const matStdFloor = new THREE.MeshStandardMaterial({
    color: 0x808080,
    roughness: 0.1,
    metalness: 0,
  });
  const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
  mshStdFloor.position.set(0, -110, 5);
  scene.add(mshStdFloor);

  const geoWall = new THREE.BoxGeometry(2000, 2000, 0.1);
  const matStdWall = new THREE.MeshStandardMaterial({
    color: 0x808080,
    roughness: 0.1,
    metalness: 0,
  });
  const mshStdWall = new THREE.Mesh(geoWall, matStdWall);
  mshStdWall.position.set(0, 0, 1);
  scene.add(mshStdWall);

  const manager = new THREE.LoadingManager();
  manager.addHandler(/\.dds$/i, new DDSLoader());

  const onProgress = () => {
    console.log("asdasd");
  };

  const onError = () => {
    console.log("asdsd");
  };
  new MTLLoader(manager)
    .setPath("../animationAssets/payTheRent/")
    .load("Bloom.mtl", function (materials) {
      materials.preload();

      new OBJLoader(manager)
        .setMaterials(materials)
        .setPath("../animationAssets/payTheRent/")
        .load(
          "Bloom.obj",
          function (object) {
            object.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                console.log(child);
                if (child.name === "BRICK_VASES_GRID") {
                  child.material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    roughness: 0.1,
                    opacity: 0.1,
                    transparent: true,
                  });
                }
              }
            });

            object.position.set(-440, -460, -55);
            object.name = "prinicpal";
            object.rotation.set(0, Math.PI / 2, 0);
            object.scale.set(1.05, 1.15, 1.05);
            scene.add(object);
          },
          onProgress,
          onError
        );
    });

  camera.lookAt(mshStdWall.position);

  let t = window.performance.now();

  let PayTheRentScene = {
    name: "PayTheRent",
    scene: scene,
    camera: camera,
    tag: "generic",
    backgroundDark: true,
    responsive: true,
    sceneTimer: window.performance.now(),
    sceneLength: 19000,
    onUpdate: function (framework) {
      //
      const mesh = scene.getObjectByName("prinicpal");
    },
  };
  return PayTheRentScene;
}
