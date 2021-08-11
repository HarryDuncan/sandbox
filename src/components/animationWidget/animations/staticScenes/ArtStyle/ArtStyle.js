import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { TexturePass } from 'three/examples/jsm//postprocessing/TexturePass.js';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass.js';
import { MaskPass, ClearMaskPass } from 'three/examples/jsm//postprocessing/MaskPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';

export const ArtStyle = (framework) => {
    let box,torus, composer, camera;
    camera = new THREE.PerspectiveCamera( 40, 5600 / 5600, 1, 1000 );
    camera.position.z = 10;

    const scene1 = new THREE.Scene();
    const scene2 = new THREE.Scene();

    box = new THREE.Mesh( new THREE.BoxGeometry( 10, 1, 1 ) );
    scene1.add( box );

    torus = new THREE.Mesh(  new THREE.BoxGeometry( 10, 1, 1 ) );
    torus.material.flatShading = false
    torus.geometry.computeVertexNormals()
    scene2.add( torus );


    framework.renderer.setClearColor( 0xffffff );
    framework.renderer.autoClear = false;

    const clearPass = new ClearPass();

    const clearMaskPass = new ClearMaskPass();

    const maskPass1 = new MaskPass( scene1, camera );
    const maskPass2 = new MaskPass( scene2, camera );

    const texture1 = new THREE.TextureLoader().load( '../animationAssets/ArtStyles/Green.jpg' );
    // texture1.minFilter = THREE.LinearFilter;
    const texture2 = new THREE.TextureLoader().load( '../animationAssets/ArtStyles/Blue.jpg' );

    const texturePass1 = new TexturePass( texture1 );
    const texturePass2 = new TexturePass( texture2 );

    const outputPass = new ShaderPass( CopyShader );

    const parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    };

    const renderTarget = new THREE.WebGLRenderTarget( 5600, 5600, parameters );

    composer = new EffectComposer( framework.renderer, renderTarget );
    composer.addPass( clearPass );
    composer.addPass( maskPass1 );
    composer.addPass( texturePass1 );
    composer.addPass( clearMaskPass );
    composer.addPass( maskPass2 );
    composer.addPass( texturePass2 );
    composer.addPass( clearMaskPass );
    composer.addPass( outputPass );


    let ArtStyle = {
      name: 'HomeScene',
       scene: scene1,
       camera: camera,
       tag : 'generic',
       responsive : true,
       changeVisuals : false,
       onUpdate :  function(framework){
         const time = performance.now() * 0.001 + 6000;

         box.position.x = Math.cos( time / 1.5 ) * 2;
         box.position.y = Math.sin( time ) * 2;
         box.rotation.x = time;
         box.rotation.y = time / 2;

         torus.position.x = Math.cos( time ) * 2;
         torus.position.y = Math.sin( time / 1.5 ) * 2;
         torus.rotation.x = time;
         torus.rotation.y = time / 2;

         framework.renderer.clear();
         composer.render( time );
       }
     }

    return ArtStyle
  }
