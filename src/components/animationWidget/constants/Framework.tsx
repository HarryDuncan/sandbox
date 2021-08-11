import {IFramework} from './../animationTypes'


export const framework : IFramework = {
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

        //Transition
        reInitScene : false,
        transition : false,
        composer : null
}
