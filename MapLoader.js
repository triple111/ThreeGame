import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js';
import { MapObject } from '/MapObject.js';
import { Monster, Spawner } from '/monster.js';

export class MapLoader {
    constructor(rm, addToScene) {
        this.rm = rm;
        this.addToScene = addToScene;
        this.parser = new DOMParser();
        this.mapFile;
    }

    loadMapFile(region) {
        var client = new XMLHttpRequest();
        var self = this;
        var mapObjects = [];
        client.open('GET', '/resource/map/mastermap.tmx');
        client.onreadystatechange = function() {
            if (client.readyState == 4 && client.status == 200) {
                self.mapFile = self.parser.parseFromString(client.responseText, "text/xml");
                self.loadMapResources(region);
                self.loadSpawners(region);
            }
        }
        client.send();
    }

    loadMapResources(region) {
        var mapResources = [];
        var resourcelist = this.mapFile.getElementsByClassName("object");

        //load resources
        for (var i = 0; i < resourcelist.length; i++) {
            try {
                var xPosition = resourcelist[i].getAttribute('x') / 15;
                var yPosition = (64 - resourcelist[i].getAttribute('y') / 15); //flips due to tiled export order
                var zPosition = 0;
                var name;

                var properties = resourcelist[i].getElementsByTagName('property');
                //get properties of resource
                for (var o = 0; o < properties.length; o++) {
                    switch (properties[o].getAttribute('name')) {
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
        region.resources = mapResources;
        for (var i = 0; i < region.resources.length; i++) {
            this.addToScene(region.resources[i].sprite);
        }
    }

    loadSpawners(region) {
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
                for (var o = 0; o < properties.length; o++) {
                    switch (properties[o].getAttribute('name')) {
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
                mapSpawners[i] = new Spawner(xPosition, yPosition, zPosition, monstertype, spawnradius, maxmonsters, isRoaming, region);
                //console.log("new spawner at: " + mapSpawners[i].x + ',' + mapSpawners[i].y);
            } catch (error) {
                console.log("Couldn't find a spawner");
            }
        }
        region.spawners = mapSpawners;
    }

    loadCharacters() {

    }


}