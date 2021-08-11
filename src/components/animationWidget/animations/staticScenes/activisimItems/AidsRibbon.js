"use strict";
import * as THREE from "three";
import React, { Component } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let colourCount = 1
let cameraCount = 0
let cameraDepth = [ 750,  500, 650, 500,  550, 500]
let animate;
let breakAnimation = false;
let changeScene = true;
var renderer = new THREE.WebGLRenderer( { antialias: true } );
var camera = new THREE.PerspectiveCamera( 705, window.innerWidth / window.innerHeight, 1, 1000 );


export class AidsRibbon extends Component {
  componentDidMount() {
   
    breakAnimation = false;
    let group = new THREE.Group();
    camera.position.y = 180;
    var scene = new THREE.Scene();
   
    let url = '../animationAssets/hivribbon.glb'
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const root = gltf.scene;

    
       var scale = 2;
        if(document.documentElement.clientWidth <= 900 && document.documentElement.clientWidth > 500){
          scale = 1
        }else if(document.documentElement.clientWidth < 500){
          scale = 1.8
        }
        root.scale.set (scale,scale,scale);
        root.castShadow = true;
         var material =  new THREE.MeshPhongMaterial({color :0xD6221D, reflectivity : 0.7}) ;
          let count = 0
           root.traverse((o) => {
            if(o.isMesh){
                o.material = material
            }
           })
          group.add(root);
           },
        );
   
    if(document.documentElement.clientWidth <= 900 && document.documentElement.clientWidth > 500){
          group.position.z = 5
    }
    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
    ambientLight.position.x = 900
    scene.add( ambientLight );
    var pointLight = new THREE.PointLight(0xffffff, 1 );
    pointLight.position.y = 150
    pointLight.castShadow = true;  
    scene.add( pointLight );
    scene.add( camera );
    scene.add(group)
    camera.lookAt(group);
    scene.background = new THREE.Color( 0xffffff );

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth * 0.4, window.innerHeight * 0.4);
    this.container.appendChild( renderer.domElement );
    animate()
      function animate() {
        if(breakAnimation){
          cancelAnimationFrame(animate)
        }else{
          requestAnimationFrame( animate );
          render();
        }  
      }
      function render() {
        var timer = Date.now() * 0.0003;
        group.rotation.z += 0.005;
        pointLight.position.set(Math.sin( timer ) * 800 , pointLight.position.y, pointLight.position.z )
        camera.lookAt( scene.position );
        renderer.render( scene, camera );

      }
  }

  componentWillUnmount(){
    breakAnimation = true
    renderer.dispose()
  }

 
  
  render() {

    let variableHeight = '12em'
    if(document.documentElement.clientWidth <= 900){
      variableHeight = '4em'
    }
    return (
        <div className={'aids-ribbon'} style={{ 'height' : variableHeight, 'width' : '5em'}} 
          ref={thisNode => this.container=thisNode}>
      </div>  
    )
  }
}