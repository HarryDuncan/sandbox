"use strict";
import * as THREE from "three";
import React, { Component } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let colourCount = 1
let cameraCount = 0
let rotateCount = 1
let cameraDepth = [ 750,  500, 650, 500,  550, 500]
let colourPairs = {

                  //Initial
                  1 : {'colour_1' : 0xe92b13, 'colour_2' : 0x0255e1},

                  //Haring
                  2 : {'colour_1' : 0x00b32d, 'colour_2' : 0x006aeb},
                  // Katzah
                  3 : {'colour_1' : 0x39c1ab, 'colour_2' : 0x0056bd},
                  // Black and red
                  4 : {'colour_1' : 0xeb0510, 'colour_2' : 0x170708},

                  //Amritzar colors
                  5 : {'colour_1' : 0xfed943, 'colour_2' : 0x1c72c7},
                  // Rando Pink and blue
                  6 : {'colour_1' : 0x0914ed, 'colour_2' : 0xff0048},
                  7 : {'colour_1' : 0x1921ff, 'colour_2' : 0xd33fb7},
                }
let animate;
let breakAnimation = false;
let changeScene = true;
var renderer = new THREE.WebGLRenderer( { antialias: true } );
var camera = new THREE.PerspectiveCamera( 705, window.innerWidth / window.innerHeight, 1, 1000 );


export function HomeScene(framework){

    breakAnimation = false;

    camera.position.y = 180;
    var scene = new THREE.Scene();

    let url = '../home.glb'
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const root = gltf.scene;
       var scale = 2;
        root.scale.set (scale,scale,scale);
        root.castShadow = true;
         var material =  new THREE.MeshPhongMaterial({color :0x0914ed, reflectivity : 0.7}) ;
          var material2 =  new THREE.MeshPhongMaterial({color : 0xff0048,  reflectivity : 0.7}) ;
          let count = 0
           root.traverse((o) => {
            if(o.isMesh){
              if(count % 2 === 0){
                o.material = material
              }else{
                o.material = material2
              }
              count ++
            }
           })
          scene.add(root);
           },
        );

    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
    ambientLight.position.x = 900
    scene.add( ambientLight );
    var pointLight = new THREE.PointLight(0xffffff, 1 );
    pointLight.position.y = 150
    pointLight.castShadow = true;
    scene.add( pointLight );
    scene.add( camera );
    scene.background = new THREE.Color( 0xffffff );





    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    let toggle = -1
    let bgToggleLimit = 40
    let bgTranslateCount = 0;
    window.addEventListener('resize', onWindowResize, false);

       function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
   // let changeVis = false

    let HomeScene = {
      name: 'HomeScene',
       scene: scene,
       camera: camera,
       tag : 'generic',
       responsive : true,
       changeVisuals : false,
       onUpdate :  function(framework){
          var timer = Date.now() * 0.0003;
          framework.camera.position.z = Math.cos( timer ) * 45 ;
          framework.camera.position.x = Math.sin(timer) * 0.9;
          pointLight.position.set(Math.sin( timer ) * 800 , pointLight.position.y, pointLight.position.z )
          framework.camera.lookAt( scene.position );
          if(framework.camera.position.z > -0.5 && framework.camera.position.z < 0.5 && !changeScene){
            changeScene = true
            if(rotateCount === 1){
               setTimeout(() => {
                framework.changeVisuals = true
                 }, 1500)
                rotateCount = 1

            }else{
              rotateCount ++
            }



            let c1 = colourPairs[colourCount]['colour_1']
            let c2 = colourPairs[colourCount]['colour_2']
            let newMaterial =  new THREE.MeshPhongMaterial({color : c1, reflectivity : 0.7}) ;
            let newMaterial2 =  new THREE.MeshPhongMaterial({color : c2,  reflectivity : 0.7}) ;

            colourCount += 1
            cameraCount += 1
            if(colourCount > 7){
              colourCount = 1
            }if(cameraCount > 5){
              cameraCount = 0;
            }
            let count = 0
            scene.traverse((o) => {
              if(o.isMesh){
                if(count % 2 === 0){
                  o.material = newMaterial
                }else{
                  o.material = newMaterial2
                }
                count ++
              }
            });

          }else if((camera.position.z < -0.5 || camera.position.z > 0.5) && changeScene){

               framework.changeVisuals = false


            changeScene = false
          }
        }
      }


  return HomeScene

}
