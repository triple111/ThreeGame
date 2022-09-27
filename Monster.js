import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js'
import { Character } from '/Character.js';

export class Monster extends Character {
    constructor(x, y, z, name, isRoaming, roamradius, spawner) {
        super(x, y, z, name);
        this.isRoaming = isRoaming;
        this.roamradius = roamradius;
        this.spawner = spawner;

    }

    roam() {
        if (this.isRoaming == 'true') {
            if (Math.random() < 0.05) { //10% chance to roam
                this.destination.x = this.spawner.x + this.getRandomArbitrary(-this.roamradius, this.roamradius + 1);
                this.destination.y = this.spawner.y + this.getRandomArbitrary(-this.roamradius, this.roamradius + 1);
                //console.log(this.sprite.name + ' is roaming to ' + this.destination.x + ',' + this.destination.y);
            }
            super.move();
        }
    }

    die() {
        console.log('killed ' + this.sprite.name);
        this.spawner.currentmonsters -= 1;
        this.spawner.region.removeFromScene(this.id);
        delete this;
    }

    getRandomArbitrary(min, max) { //exclusive of max
        var rand = Math.floor(Math.random() * (max - min) + min);
        return rand;
    }
}

export class Spawner {
    constructor(x, y, z, monstertype, spawnradius, maxmonsters, isRoaming, region) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.monstertype = monstertype;
        this.spawnradius = spawnradius;
        this.currentmonsters = 0;
        this.maxmonsters = maxmonsters;
        this.isRoaming = isRoaming;
        this.region = region;
    }

    spawn() {
        if (this.currentmonsters < this.maxmonsters) {
            for (var n = 0; n < this.maxmonsters - this.currentmonsters; n++) { //adds more monsters if below limit
                var spawnX = this.x + this.getRandomArbitrary(-this.spawnradius, this.spawnradius + 1);
                var spawnY = this.y + this.getRandomArbitrary(-this.spawnradius, this.spawnradius + 1);
                var spawnedmonster = new Monster(spawnX, spawnY, 0, this.monstertype, this.isRoaming, 5, this);
                this.region.addToScene(spawnedmonster.sprite);
                this.region.npcMap.set(spawnedmonster.sprite.id, spawnedmonster);
                console.log("Spawned " + this.region.npcMap.get(spawnedmonster.sprite.id).sprite.name + this.region.npcMap.get(spawnedmonster.sprite.id).sprite.id + " at " + spawnX + ',' + spawnY);
            }
            this.currentmonsters = this.maxmonsters;
        }
    }

    getRandomArbitrary(min, max) { //exclusive of max
        var rand = Math.floor(Math.random() * (max - min) + min);
        return rand;
    }
}