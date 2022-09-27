import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js';
import { Character } from '/character.js';
import {Monster, Spawner} from '/monster.js';

export class Region{
    constructor(addToScene, removeFromScene){
        this.resources = [];
        this.npcs = [];
        this.npcMap = new Map();
        this.spawners = [];
        this.addToScene = addToScene;
        this.removeFromScene = removeFromScene;
        this.lastupdatetick;
        this.repoptime = 30;
        this.initialize(0);
    }

    initialize(currentTick){
          //spawn monsters
          for (var i = 0; i < this.spawners.length; i++){
            this.spawners[i].spawn();
         }
         this.lastupdatetick = currentTick;
    }

    update(currentTick){
        if(currentTick == this.lastupdatetick + this.repoptime){
            //spawn monsters
            for (var i = 0; i < this.spawners.length; i++){
                this.spawners[i].spawn();
            }
            this.lastupdatetick = currentTick;
            console.log("Repop");
        }
        //roam monsters
        this.npcMap.forEach((npc) =>{
            npc.roam();
        });
    }

    
        
    
}