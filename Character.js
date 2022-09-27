import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js'

export class Character {
    constructor(x, y, z, name) {
        this.currentposition = new THREE.Vector3(x, y, z);
        this.nextposition = new THREE.Vector3(x, y, z);
        this.destination = new THREE.Vector3(x, y, z);
        this.spriteoffset = new THREE.Vector3(0.5, 0.5, 0);
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
        this.sprite.center = new THREE.Vector2(0.5, 0); //center the sprite anchor  
        this.sprite.name = name;
        this.id = this.sprite.id;
        this.place(this.currentposition);
        this.isMoving = false;
        //console.log(this.currentX + ',' + this.currentY + "/" + this.destX + ',' + this.destY);

    }

    scalesprite() {

    }

    place(newposition) {
        this.currentposition = newposition;
        this.nextposition.copy(this.currentposition);
        this.destination.copy(this.currentposition);
        this.sprite.position.copy(new THREE.Vector3(this.currentposition.x + .5, this.currentposition.y + .5, this.currentposition.z + 0)); //0.5 is sprite center offset
    }

    setDestination(x, y) {
        this.destination.x = x;
        this.destination.y = y;
        //console.log(this.currentposition.x + ',' + this.currentposition.y + "/" + this.destination.x + ',' + this.destination.y);
    }

    move() {

        if (this.currentposition.x < this.destination.x) {
            this.currentposition.x += 1; //east
            this.isMoving = true; //east
        }
        if (this.currentposition.x > this.destination.x) {
            this.currentposition.x -= 1; //west
            this.isMoving = true;
        }
        if (this.currentposition.y < this.destination.y) {
            this.currentposition.y += 1; //north
            this.isMoving = true;
        }
        if (this.currentposition.y > this.destination.y) {
            this.currentposition.y -= 1; //south
            this.isMoving = true;
        }

        if (this.currentposition.x == this.destination.x && this.currentposition.y == this.destination.y) {
            this.isMoving = false;
        }

        //time to move the player
        if (this.isMoving == true) {
            this.sprite.position.copy(new THREE.Vector3(this.currentposition.x + .5, this.currentposition.y + .5, this.currentposition.z + 0)); //0.5 is sprite center offset

        }
        // console.log(this.currentposition.x + ',' + this.currentposition.y + "/" + this.destination.x + ',' + this.destination.y);
    }

    smoothmove(deltaTime) {
        if (this.currentposition.x < this.destination.x) {
            this.nextposition.x = this.currentposition.x + 1; //east
        }
        if (this.currentposition.x > this.destination.x) {
            this.nextposition.x = this.currentposition.x - 1; //west
        }
        if (this.currentposition.y < this.destination.y) {
            this.nextposition.y = this.currentposition.y + 1; //north
        }
        if (this.currentposition.y > this.destination.y) {
            this.nextposition.y = this.currentposition.y - 1; //south
        }

        var currentcoord = new THREE.Vector3(this.currentposition.x + 0.5, this.currentposition.y + 0.5, 0);
        var nextcoord = new THREE.Vector3(this.nextposition.x + 0.5, this.nextposition.y + 0.5, 0);
        //var lerpvector = 
        this.sprite.position.lerpVectors(currentcoord, nextcoord, deltaTime);

    }
}

export class Player extends Character {
    constructor(x, y, z, name) {
        super(x, y, z, name);
        this.nextmoveTick;
    }
}