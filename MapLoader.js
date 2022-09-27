import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js';
import { MapObject } from '/MapObject.js';
import { Monster, Spawner } from '/monster.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.120.0/examples/jsm/loaders/GLTFLoader.js';

export class MapLoader {
    constructor(addToScene) {
        this.worldmesh;
        this.roofs;
        this.worldtexture;
        this.worldmaterial = new THREE.MeshStandardMaterial();
        this.mastertexture;
        this.mastermaterial = new THREE.MeshStandardMaterial();
        this.addToScene = addToScene;
        this.parser = new DOMParser();
        this.mapFile;
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
        self.worldmesh.traverse(function(child){
            //console.log(child.name);
            if(child.name == "roofs") self.roofs = child;
            self.addToScene(child);
        })
        //self.addToScene(self.worldmesh);

        }, undefined, function(error) {

            console.error(error);

        });
    }

    loadMapFile(region) {
        var client = new XMLHttpRequest();
        var self = this;
        var mapObjects = [];
        client.open('GET', '/resource/map/mastermap.tmx');
        client.onreadystatechange = function() {
            if (client.readyState == 4 && client.status == 200) {
                self.mapFile = self.parser.parseFromString(client.responseText, "text/xml");
                self.loadMapResources();
                self.loadSpawners(region);
            }
        }
        client.send();
    }

    loadMapResources(xmltext) {
        var mapResources = [];
        var resourcelist = this.mapFile.getElementsByClassName("tree");

        //load resources
        for (var i = 0; i < resourcelist.length; i++) {
            try {
                var xPosition = resourcelist[i].getAttribute('x') / 15;
                var yPosition = (64 - resourcelist[i].getAttribute('y') / 15); //flips due to tiled export order
                var zPosition = 0;
                var name;

                var properties = resourcelist[i].getElementsByTagName('property');
                //get properties of resource
                for(var o = 0; o < properties.length; o++){
                    switch(properties[o].getAttribute('name')){
                        case 'type':
                        name = properties[o].getAttribute('value');
                        break;
                    }
                }
            mapResources[i] = new MapObject(xPosition, yPosition, zPosition, name);
            
            } catch (error) {
                console.log("Couldn't find a tree");
            }
        }
        //add all mapResources to scene
        for (var i = 0; i < mapResources.length; i++) {
            this.addToScene(mapResources[i].sprite);
        }
    }

    loadSpawners(region){
        var mapSpawners = [];
        var spawnerlist = this.mapFile.getElementsByClassName("spawner");

        //load spawners
        for (var i = 0; i < spawnerlist.length; i++) {
            try {
                var xPosition = spawnerlist[i].getAttribute('x') / 15;
                var yPosition = (64 - spawnerlist[i].getAttribute('y') / 15); //flips due to tiled export order
              
                var zPosition = 0;
                var monstertype;
                var spawnradius;
                var maxmonsters;
                var isRoaming;

                var properties = spawnerlist[i].getElementsByTagName('property');
                //get properties of resource
                for(var o = 0; o < properties.length; o++){
                    switch(properties[o].getAttribute('name')){
                        case 'isRoaming':
                            isRoaming = properties[o].getAttribute('value');
                        break;
                        case 'maxmonsters':
                            maxmonsters = properties[o].getAttribute('value');
                        break;
                        case 'monstertype':
                            monstertype = properties[o].getAttribute('value');
                        break;
                        case 'spawnradius':
                            spawnradius = properties[o].getAttribute('value');
                        break;
                    }
                }
            mapSpawners[i] = new Spawner(xPosition, yPosition, zPosition, monstertype, spawnradius,maxmonsters, isRoaming, region);
            console.log("new spawner at: " + mapSpawners[i].x + ',' + mapSpawners[i].y);
        } catch (error) {
                console.log("Couldn't find a spawner");
            }
        }
            region.spawners = mapSpawners;
    }

    loadCharacters() {

    }


}