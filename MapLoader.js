import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js';
import { MapObject } from '/MapObject.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.120.0/examples/jsm/loaders/GLTFLoader.js';

export class MapLoader {
    constructor(addToScene) {
        this.mapObjects = [];
        this.worldmesh;
        this.worldtexture;
        this.worldmaterial = new THREE.MeshBasicMaterial();
        this.mastertexture;
        this.mastermaterial = new THREE.MeshBasicMaterial();
        this.addToScene = addToScene;
        this.loadMapTextures();
        this.loadWorldGeometry()
    }

    loadMapTextures() {
        this.worldtexture = new THREE.TextureLoader().load('resource/mastermap.png');
        this.worldtexture.mapping = THREE.UVMapping;
        this.worldtexture.magFilter = THREE.NearestFilter;
        this.worldtexture.minFilter = THREE.NearestFilter;
        this.worldtexture.flipY = false; //required due to export;
        this.worldmaterial.map = this.worldtexture;

        this.mastertexture = new THREE.TextureLoader().load('resource/mastertex.png');
        this.mastertexture.mapping = THREE.UVMapping;
        this.mastertexture.magFilter = THREE.NearestFilter;
        this.mastertexture.minFilter = THREE.NearestFilter;
        this.mastertexture.flipY = false;
        this.mastermaterial.map = this.mastertexture;
        this.mastermaterial.side = THREE.DoubleSide;
        this.mastermaterial.transparent = true;
        this.mastermaterial.alphaTest = 0.01;
    }

    loadWorldGeometry() {
        var self = this;
        const loader = new GLTFLoader().load('resource/world.glb', function(gltf) {
            gltf.scene.position.set(0, 0, 0);
            gltf.scene.traverse((o) => {
                if (o.isMesh) {
                    if (o.name == 'groundplane') {
                        o.material = self.worldmaterial;
                    } else {
                        o.material = self.mastermaterial;
                    }
                }
            });
            self.worldmesh = gltf.scene;
            self.addToScene(self.worldmesh);

        }, undefined, function(error) {

            console.error(error);

        });
    }

    loadMapFile(callBack) {
        var client = new XMLHttpRequest();
        var self = this;
        var mapObjects = [];
        client.open('GET', '/resource/map/mastermap.tmx');
        client.onreadystatechange = function() {
            if (client.readyState == 4 && client.status == 200) {
                self.mapObjects = self.loadObjects(client.responseText);
                callBack(self.mapObjects);
            }
        }
        client.send();
    }

    loadObjects(xmltext) {
        var parser = new DOMParser();
        var mapFile = parser.parseFromString(xmltext, "text/xml");
        var objectDefinitions = mapFile.getElementsByTagName("object")
        var mapObjects = [];

        for (var i = 0; i < objectDefinitions.length; i++) {
            try {
                var xPosition = objectDefinitions[i].getAttribute('x') / 15;
                var yPosition = (64 - objectDefinitions[i].getAttribute('y') / 15); //flips due to tiled export order
                var zPosition = 0;
                var name = objectDefinitions[i].getAttribute('class');
                mapObjects[i] = new MapObject(xPosition, yPosition, zPosition, name);
            } catch (error) {
                console.log("Couldn't find " + objectDefinitions[i].getAttribute('class'));
            }
        }
        return (mapObjects);
    }

    loadCharacters() {

    }


}