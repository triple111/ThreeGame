import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.120.0/examples/jsm/loaders/GLTFLoader.js';
import { MapLoader } from '/maploader.js';
import { Region } from '/Region.js';

export class ResourceManager {
    constructor(addToScene, removeFromScene, main) {
        //---------------DEFINITIONS---------------
        this.textureindex = [
            'goblin',
            'imp',
            'player',
            'rock',
            'demon',
            'treedark',
            'mastermap',
            'mastertex'
        ];
        //---------------CALLBACKS---------------
        this.addToScene = addToScene;
        this.removeFromScene = removeFromScene;
        this.main = main;
        //---------------LOADERS---------------
        this.textureloader = new THREE.TextureLoader();
        this.meshloader = new GLTFLoader();
        this.mapLoader = new MapLoader(this,this.addToScene);
        //---------------TEXTURES---------------
        this.textures = new Map();
        //---------------MATERIALS---------------
        this.worldmaterial = new THREE.MeshStandardMaterial();
        this.mastermaterial = new THREE.MeshStandardMaterial();;
        //---------------MESHES---------------
        this.roofs;
        this.worldmeshes = [];
        //---------------OBJECTS---------------
        this.regions = [];
    }

    loadTextures() {
        var self = this;
        this.textureindex.forEach((texindex) => {
            var texstring = 'resource/' + texindex + '.png';

            self.textureloader.load(texstring, (tex) => {
                tex.mapping = THREE.UVMapping;
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                tex.flipY = false; //due to three js default orientation of textures


                self.textures.set(texindex, tex); //add textures to texture map

                if (self.textures.size == this.textureindex.length) {
                    console.log('Loaded ' + self.textures.size + ' textures');
                    self.loadGame(1);
                }
                //console.log("Loaded " + texindex);
            });
        });
    }

    loadMaterials() {
        this.worldmaterial.map = this.textures.get('mastermap');

        this.mastermaterial.map = this.textures.get('mastertex');
        this.mastermaterial.side = THREE.DoubleSide;
        this.mastermaterial.transparent = true;
        this.mastermaterial.alphaTest = 0.01;
        console.log('Loaded materials');

        this.loadGame(2);
    }

    loadMeshes() {
        var self = this;
        this.meshloader.load('resource/world.glb', function(meshgroup) {
                meshgroup.scene.traverse(function(child) {
                    if (child.type === 'Mesh') {
                        self.worldmeshes.push(child);
                    }
                });
                console.log('Loaded ' + self.worldmeshes.length + ' meshes');
                self.loadGame(3);
            }, undefined,
            function(error) {
                console.error(error);
            });
    }

    drawMeshes() {
        var self = this;
        this.worldmeshes.forEach((obj) => {
            if (obj.name == 'groundplane') {
                obj.material = self.worldmaterial;
            } else {
                obj.material = self.mastermaterial;
            }
            if (obj.name == "roofs") self.roofs = obj;
            self.addToScene(obj);
        });

        this.loadGame(4);
    }

    loadRegions() {
        this.regions.push(new Region(this.addToScene, this.removeFromScene));
        console.log("Loaded regions");
        this.loadGame(5);
    }

    loadMapFile(){
        this.mapLoader.loadMapFile(this.regions[0]);
        this.loadGame(6);
    }

    loadGame(progress) {
        switch (progress) {
            case 0:
                this.loadTextures();
                break;

            case 1:
                this.loadMaterials();
                //this.maploader = new MapLoader(this, this.addToScene);
                break;

            case 2:
                this.loadMeshes();
                //this.maploader = new MapLoader(this, this.addToScene);
                break;
            case 3:
                this.drawMeshes();
                break;
            case 4:
                this.loadRegions();
                break;
            case 5:
                this.loadMapFile();
                break;
            case 6:
                this.main();
                break;
        }
    }
}