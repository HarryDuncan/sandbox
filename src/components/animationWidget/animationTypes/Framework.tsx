
export interface IFramework  {
        initialized : boolean;
        automaticSwitchingOn : boolean;
        breakAnimation  : boolean;


        // Three JS part of the framework
        renderer : any;
        camera : any;
        scene : any;

        composer : any;

        // If background is dark change logo to light version
        bgDark : boolean;
        sceneIndex : number;
        changeVisuals : boolean;

        reInitScene : boolean;
        transition : boolean;

    }
