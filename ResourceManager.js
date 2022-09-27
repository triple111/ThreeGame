import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js'

export class ResourceManager {
    constructor() {
        this.textureindex = [
            'goblin',
            'imp',
            'player',
            'rock',
            'demon',
            'treedark'
        ];
        this.tl = new THREE.TextureLoader();
        this.textures = new Map();
    }

    loadTextures() {
        self = this;
        this.textureindex.forEach((texindex) => {
            var texstring = 'resource/' + texindex + '.png';

            self.tl.load(texstring, (tex) => {
                self.textures.set(texindex, tex); //add textures to texture map

                if (self.textures.size == this.textureindex.length) {
                    console.log('Loaded ' + self.textures.size + ' textures');
                    //gameLoadProgress(2);
                }
                //console.log("Loaded " + texindex);
            });

        });
    }

    //loadGame()
}