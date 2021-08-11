import * as React from 'react'
import {useState} from 'react'
import {CameraScene1, showAlert} from './cameraScene2'
import {IFramework, Framework} from './Framework'
import * as THREE from "three";

interface ICameraRootProps {
      
    }

interface ICameraRootState{
	manager : IFramework;
	currentVisual : any;
}

// Scene magager for displaying mutliple scenes in a particular setting
export class CameraRoot extends React.Component<ICameraRootProps, ICameraRootState>{
	private container : any;
	private videoRef : any;
	constructor(props : ICameraRootProps){
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

	public componentWillUnmount = () => {
		this.state.manager.renderer.dispose()
	  
	//  deleteAllScenes() 
	//  console.log('asdasd')
	//  window.removeEventListener('resize', this.handleResize, false)
		this.setState({
			manager : {...this.state.manager, 'breakAnimation' : true},
			
		})
	}

	public render() {
		return (
			<div>
		        <div className={"frame"}>
		            <div className={"frame__title-wrap"}>
		                <span className={"frame__info"} onClick={this.startCam}>Click to stop/start</span>
		            </div>
		        </div>
		        <div ref={this.container} className="content">
		            <video ref={this.videoRef} id="video" className="hidden"></video>
		            <div id="message" className="hidden">Please allow camera access.</div>
		        </div>
	    	</div>
		)
	}
	
	
}
