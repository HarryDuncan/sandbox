"use strict";
import * as THREE from "three";
import React, { Component } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let colourCount = 1
let cameraCount = 0
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


export class BlackRainbowScene extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false)
    breakAnimation = false;
   
    camera.position.y = 650;
    var scene = new THREE.Scene();
   


   let url = '../animationAssets/blkRainbow.glb'
   
   function circularMatrix(matrix, index, r, total) {
      var position = new THREE.Vector3();
      var rotation = new THREE.Euler();
      var quaternion = new THREE.Quaternion();
      var scale = new THREE.Vector3();


        let percentage =  360 * (index - 1 / total) * 1.2
       //  var r = 85
        var a = 3
        position.x = -80 + (r * Math.cos(percentage * a));
        position.z =  -40 + (r * Math.sin(percentage* a));
        quaternion.setFromEuler( rotation );
        scale.x = scale.y = scale.z = 3;
        matrix.compose( position, quaternion, scale );
        return matrix
    }

  
         var material =  new THREE.MeshPhongMaterial({color :0x0914ed, reflectivity : 0}) ;
         var material2 =  new THREE.MeshPhongMaterial({color : 0xff0048,  reflectivity : 0}) ;
          


        var geometry = new THREE.SphereGeometry( 1.5, 22, 22 );


        var outerCircle = new THREE.InstancedMesh(geometry, material2, 55 );
        for ( var i = 0; i < 55; i ++ ) {
            var matrix = new THREE.Matrix4();
            outerCircle.setMatrixAt(i, circularMatrix(matrix, i, 95, 55));

          }
        var mid = new THREE.InstancedMesh(geometry, material, 30 );

        for ( var i = 0; i < 40; i ++ ) {
            var matrix = new THREE.Matrix4();
            mid.setMatrixAt(i, circularMatrix(matrix, i, 70, 40));
          }

        var inner = new THREE.InstancedMesh(geometry, material2, 20 );
        for ( var i = 0; i < 20; i ++ ) {
            var matrix = new THREE.Matrix4();
            inner.setMatrixAt(i, circularMatrix(matrix, i, 50, 20));
          }

        scene.add(outerCircle)
        scene.add(mid)
        scene.add(inner)

   
    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
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
    this.container.appendChild( renderer.domElement );

    window.addEventListener('resize', onWindowResize, false);
    animate()
      function animate() {
        if(breakAnimation){
          cancelAnimationFrame(animate)
        }else{
          requestAnimationFrame( animate );
          render();
        }  
      }

       function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
      function render() {
        var timer = Date.now() * 0.0003;
       // camera.position.z = Math.cos(timer) * 50;
       // camera.position.x = Math.sin(timer);
        pointLight.position.set(Math.sin( timer ) * 700 , pointLight.position.y, pointLight.position.z )
        camera.lookAt( scene.position );
        if(camera.position.z > -0.5 && camera.position.z < 0.5 && !changeScene){
          changeScene = true
         
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
          ambientLight.intensity = 0.4
          pointLight.intensity = 1
          scene.background = new THREE.Color( 0xffffff );
          changeScene = false
        }
      
        renderer.render( scene, camera );

      }

    
      function gradualReduction(){
        while(ambientLight.intensity > 0){
             ambientLight.intensity -= 0.01
         
         
        }
      }
  }



  handleResize = () => {
    camera = new THREE.PerspectiveCamera( 705, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 650;
  }
  componentWillUnmount(){
    breakAnimation = true
    renderer.dispose()
     window.removeEventListener('resize', this.handleResize, false)
  }

 
  
  render() {

    return (
        <div style={{width:"inherit", height:"inherit", position:"absolute"}} 
          ref={thisNode => this.container=thisNode}>
      </div>  
    )
  }
}



