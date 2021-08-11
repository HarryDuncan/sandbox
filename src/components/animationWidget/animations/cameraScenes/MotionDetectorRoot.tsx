import * as React from 'react'
import {useState} from 'react'
import {CameraScene1, showAlert} from './cameraScene2'
import {IFramework, Framework} from './Framework'
import * as THREE from "three";

interface IMotionDetectorRootProps {
      
    }

interface IMotionDetectorRootState{
	manager : IFramework;
	currentVisual : any;
}

// Scene magager for displaying mutliple scenes in a particular setting
export class MotionDetectorRoot extends React.Component<IMotionDetectorRootProps, IMotionDetectorRootState>{
	private container : any;
	private videoRef : any;
	constructor(props : IMotionDetectorRootProps){
	    super(props)
	    this.container = React.createRef()
	    this.videoRef = React.createRef()
	    this.state = {
	    	manager : this.initalizeFramework(),
	    	currentVisual : null
	    }
	   }
	   

	 public componentDidMount(){
	 	setTimeout(() => {
	 		this.setState({
	 			currentVisual : CameraScene1(this.state.manager)
	 		})
	 	}, 100)
	 	
	  }
	  public initalizeFramework = () => {
		let returnManager : IFramework = Framework
		// Initialize Renderer
		returnManager.breakAnimation = false
		returnManager.initialized = true
   
	    // Initializes 3 JS Stuff
	    returnManager.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	    returnManager.renderer.setSize(window.innerWidth, window.innerHeight);
	    returnManager.renderer.shadowMap.enabled = true;
	    returnManager.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
		
	  	returnManager.video = document.getElementById("video");
	  	 
	  	 const audioListener = new THREE.AudioListener();
    	
    	returnManager.clock = new THREE.Clock();
    	let audio = new THREE.Audio(audioListener);
    	const audioLoader = new THREE.AudioLoader();
    		audioLoader.load('../hjdmix/Flanger.wav', (buffer) => {
	      

	        audio.setBuffer(buffer);
	        audio.setLoop(true);
	        audio.setVolume(0.5);
	        audio.play();
    	});

    	returnManager.canvas = document.createElement("canvas");
    	returnManager.ctx = returnManager.canvas.getContext("2d");

    	returnManager.analyser = new THREE.AudioAnalyser(audio, returnManager.fftSize);

		return returnManager
	}

	public startCam = () => {
		
		// @ts-ignore
		 let node = this.container.current
		 // @ts-ignore
		 node.appendChild(this.state.manager.renderer.domElement );
	     // window.addEventListener('resize', onWindowResize, false);
	    
	     

	     const fov = 45;
		 

	    // onResize();
	    let navigatorCopy : any = {};
		
	    navigatorCopy.mediaDevices = navigator.mediaDevices.getUserMedia({video : true})
	   
	    if (navigatorCopy.mediaDevices) {
	        const tick = () => {
		    	this.state.currentVisual.onUpdate(this.state.manager); // perform any requested updates
		   	 	this.state.manager.renderer.render(this.state.currentVisual.scene,  this.state.currentVisual.camera )
				 if(!this.state.manager.breakAnimation){
				 		// if(this.state.manager.changeVisuals === true){
				 			
				 		// 	this.changeScene()
				 		// }
				       requestAnimationFrame(tick); // register to call this again when the browser renders a new frame
				    }
	    	}
        tick()
	    } else {
	        showAlert();
	    }
      
		      	
	}

	public render() {
		return (
			<div className="drum-container">
			    <div className="row row-top">
			        <div className="col-6 col-sm-3">
			            <img className="virtual-drum" src="images/cymbal.png" alt="crash" id='0'/>
			        </div>
			        <div className="col-6 col-sm-3 offset-sm-6 d-none d-sm-inline">
			            <img className="virtual-drum" src="images/hi-hat.png" alt="hi-hat" id='1'/>
			        </div>
			    </div>
			    <div className="row row-bottom">
			        <div className="col-4 p-sm-3 p-0 d-none d-sm-inline">
			            <img className="virtual-drum" src="images/Floor-Tom.png" alt="floor-tom" id='2'/>
			            <div className="spinner-grow text-primary d-none" role="status" id="floor-tom-glowing">
			                <span className="sr-only">Loading...</span>
			            </div>
			        </div>
			        <div className="col-5 p-sm-3 p-0">
			            <img className="virtual-drum" src="images/Bass-Drum.png" alt="kick" id='3'/>
			            <div className="spinner-grow text-primary d-none" role="status" id="kick-glowing">
			                <span className="sr-only">Loading...</span>
			            </div>
			        </div>
			        <div className="col-3 p-sm-3 p-0 d-none d-sm-inline">
			            <img className="virtual-drum" src="images/Snare.png" id='4'/>
			            <div className="spinner-grow text-primary d-none" role="status" id="snare-glowing">
			                <span className="sr-only">Loading...</span>
			            </div>
			        </div>
			    </div>
			</div>
		)
	}
	
	
}
