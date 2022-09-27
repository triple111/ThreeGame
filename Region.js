import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js';
import { Character } from '/character.js';
import {Monster, Spawner} from '/monster.js';

export class Region{
    constructor(addToScene){
        this.resources = [];
        this.npcs = [];
        this.npcMap = new Map();
        this.spawners = [];
        this.addToScene = addToScene;
    }

    update(){
        //spawn monsters
        for (var i = 0; i < this.spawners.length; i++){
           this.spawners[i].spawn();
        }
        //roam monsters
        for (var i = 0; i < this.npcs.length; i++){
            this.npcs[i].roam();
        }
    }

    
        
    
}