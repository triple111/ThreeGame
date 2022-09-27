import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js'
import { LitSpriteMaterial } from '/LitSpriteMaterial.js';

export class MapObject {
    constructor(x, y, z, name) {
        this.x = x + .5;
        this.y = y + .5;
        this.z = z;
        this.position = new THREE.Vector3(this.x, this.y, this.z);
        var texstring = 'resource/' + name + '.png';
        this.texture = new THREE.TextureLoader().load(texstring, (tex) => {
            tex.needsUpdate = true;
            var yScale = tex.image.height / 15;
            var xScale = tex.image.width / 15;
            this.sprite.scale.set(xScale, yScale, 1);
        })

        this.texture.magFilter = THREE.NearestFilter; //make it pixelated
        this.material = new THREE.SpriteMaterial({ map: this.texture, depthWrite: true, alphaTest: 0.01 });
        this.sprite = new THREE.Sprite(this.material);
        this.sprite.center = new THREE.Vector2(0.5, 0); //center the sprite   
        this.sprite.position.copy(this.position);

    }

    scalesprite() {

    }
    move() {

    }
}