import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js';
import { CSS2DRenderer, CSS2DObject} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js';

export class Interface{
    constructor(addToScene, canvas){
        var canvasrect = canvas.getBoundingClientRect();
        this.hoverinfo = document.createElement('div');
        this.hoverinfo.innerHTML = "Walk here (2 options)";
        this.hoverinfo.style.position = 'absolute';
        //this.hoverinfo.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        this.hoverinfo.style.top = canvasrect.top + 'px';
        //this.hoverinfo.style.left = canvasrect.left + 'px';
        document.body.appendChild(this.hoverinfo);
        //this.hoverlabel = new CSS2DObject(this.hoverinfo);
        //this.hoverlabel.position.set(0,0,0);
        //this.hoverlabel.layers.set(1);
        //addToScene(this.hoverlabel);    
    }

    //initialize
    initialize(document){

    }

}