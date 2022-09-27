import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js'

export class Character {
    constructor(x, y, z, name) {
        this.currentX = x;
        this.currentY = y;
        this.currentZ = z;
        this.destX = this.currentX;
        this.destY = this.currentY;
        this.destZ = this.currentZ;
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
        this.place(this.currentX, this.currentY, this.currentZ)
        this.lastmovetick;
        this.isMoving = false; 
        //console.log(this.currentX + ',' + this.currentY + "/" + this.destX + ',' + this.destY);

    }

    scalesprite() {

    }

    place(x,y,z) {
        this.currentX = x;
        this.currentY = y;
        this.currentZ = z;
        this.destX = x;
        this.destY = y;
        this.destZ = z;
        this.sprite.position.copy(new THREE.Vector3(this.currentX + .5, this.currentY + .5, this.currentZ)); //0.5 is sprite center offset
    }

    setDestination(x,y){
        this.destX = x;
        this.destY = y;
    }

    move(){
   
        if(this.currentX < this.destX) {
            this.isMoving = true;
            this.currentX += 1; //east
        }
        if(this.currentX > this.destX) {
            this.currentX -= 1; //west
            this.isMoving = true;
        }
        if(this.currentY < this.destY) {
            this.currentY += 1; //north
            this.isMoving = true;
        }
        if(this.currentY > this.destY) {
            this.currentY -= 1; //south
            this.isMoving = true;
        }
       
        if(this.currentX == this.destX && this.currentY == this.destY){
            this.isMoving = false;
        }
        
        //time to move the player
        if(this.isMoving == true) this.sprite.position.copy(new THREE.Vector3(this.currentX + .5, this.currentY + .5, 0)); //0.5 is sprite center offset
       
        //console.log(this.currentX + ',' + this.currentY + "/" + this.destX + ',' + this.destY);

    }
}