
export interface IFramework  {
        initialized : boolean,
        automaticSwitchingOn : boolean,
        breakAnimation  : boolean,
    

        // Three JS part of the framework
        renderer : any,
        camera : any,
        scene : any,


        clock : any;
        width : number;
        height : number;
        video : any;


        // If background is dark change logo to light version
        bgDark : boolean,
        sceneIndex : number;
        changeVisuals : boolean;
        audio : any;
        analyser : any;
        fftSize : number
        frequencyRange : any;

        canvas : any;    
        ctx : any;

    }

export const Framework : IFramework = {
        initialized : false,
        automaticSwitchingOn : true,
        breakAnimation  : false,

      
        // Three JS part of the framework
        renderer : null,
        camera : null,
        scene : null,

        // If background is dark change logo to light version
        bgDark : false,
        sceneIndex : 0,
        changeVisuals : false,

        clock : null,
        width : window.innerWidth,
        height : window.innerHeight,
        video : {},

        audio : null,
        analyser : null,
        fftSize : 2048,
        frequencyRange :  {bass: [20, 140],lowMid: [140, 400], mid: [400, 2600], highMid: [2600, 5200], treble: [5200, 14000]},

        canvas : null,
        ctx : null,


}

   

  
let particles, videoWidth, videoHeight, imageCache;

const particleIndexArray = [];




// audio
let audio, analyser;
const fftSize = 2048; 

