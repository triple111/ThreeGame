//import * as THREE from '/three-main/build/three.module.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js';
import { Text } from 'https://cdn.skypack.dev/troika-three-text@0.30.2/src/Text.js';
import { Region } from './Region.js';
import { Character, Player } from '/character.js';
import { Monster, Spawner } from '/monster.js';
import { MapLoader } from '/maploader.js';
import { Interface } from '/interface.js';
import { CSS2DRenderer, CSS2DObject } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js';
import { ResourceManager } from '/ResourceManager.js';

//---------------GAME WINDOW VARIABLES-----------------
const canvas = document.querySelector('#c');
const infobox = document.querySelector('#info');
const tickbox = document.querySelector('#tick');
const statusbox = document.querySelector('#status');
const renderer = new THREE.WebGLRenderer({ canvas });
const renderwidth = 600;
const renderheight = 400;
renderer.antialias = false;
const scene = new THREE.Scene();
const width = 15;
const height = 10;
const cameradistance = 15;
scene.fog = new THREE.Fog(0x000000, cameradistance + 13, cameradistance + 20);
//scene.fog = new THREE.FogExp2(0x000000, 0.03);
const ocamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, .001, 100);
const pcamera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
const camera = pcamera;
const fontloader = new THREE.FontLoader();
//const gamefont = fontloader.load('resource/font/gamefont.json');
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const cameracenter = new THREE.Vector2();
cameracenter.x = 0;
cameracenter.y = 0;
const maxcameraangle = 5;
const mincameraangle = 5;
const upVector = new THREE.Vector3(0, 0, 1);
const clock = new THREE.Clock();
var deltaTime;
/*
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );
*/
const gameinterface = new Interface(addToScene, canvas);
//---------------WORLD OBJECT VARIABLES-----------------
var intersects;
const rm = new ResourceManager(addToScene, removeFromScene, main); //loads all the textures and stuff
const boom = new THREE.Group()
const player = new Player(28, 20, 0, 'player');
var currentregion;
var players = [];
players.push(player);

//---------------OTHER VARIABLES-----------------
var tick = 0;
const currentKeysPressed = {};

//---------------ENTRY POINT---------------

initializeInterface();
initializeWorld();

//---------------FUNCTIONS---------------
function initializeInterface(){
    renderer.setSize(renderwidth, renderheight);
    gameinterface.initialize(document);
    boom.add(camera);
    scene.add(boom);
    camera.position.x = 0;
    camera.position.y = -cameradistance;
    camera.lookAt(0, 0, 0);
    boom.rotateX(THREE.Math.degToRad(-30));

}

function initializeWorld() {
    rm.loadGame(0);
    //--------TESTING--------
    const light = new THREE.AmbientLight(0xEEEEEE); // soft white light
    const plight = new THREE.PointLight(0xff0000, 1, 10);
    plight.position.set(18, 10, 2);
    scene.add(light);
    //scene.add(plight);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

}

function main() {
    console.log("Main");
    currentregion = rm.regions[0];
    scene.add(player.sprite);
    boom.position.copy(player.sprite.position);

    renderer.render(scene, camera);

    window.addEventListener('keydown', onKeyPress);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', onClick);
    window.setInterval(serverTick, 600);
    window.requestAnimationFrame(loop);
}

function loop() {

    window.requestAnimationFrame(loop);

    deltaTime = clock.getElapsedTime();
    infobox.innerHTML = deltaTime;
    checkKeys(); //check to see if any keys are down

    //raycast to get mouse clicks
    raycaster.setFromCamera(pointer, camera);
    intersects = raycaster.intersectObjects(scene.children);
    for (let i = 0; i < intersects.length; i++) {
        //console.log(intersects[i].object.id);
        //infobox.innerHTML = intersects[0].object.name + ',' + intersects[0].object.id;
    }

    //raycast to remove roofs
    raycaster.setFromCamera(cameracenter, camera);
    var camintersects = raycaster.intersectObjects(scene.children);
    if (camintersects[0] != undefined) {
        if (camintersects[0].object.name == "roofs") {
            rm.roofs.visible = false;
        } else {
            rm.roofs.visible = true;
        }
    }

    //animatePlayers();
    renderer.render(scene, camera);
}

function serverTick() {
    clock.start();
    tick++;
    tickbox.innerHTML = tick;
    updatePlayers();
    updateRegion();
}

function updatePlayers() {
    for (var i = 0; i < players.length; i++) {
        if (players[i].isMoving = true) {
            players[i].move();
        }
    }
    boom.position.copy(player.sprite.position);
}

function animatePlayers() {
    for (var i = 0; i < players.length; i++) {
        if (players[i].isMoving = true) {
            //players[i].smoothmove(deltaTime);
        }
    }
    boom.position.copy(player.sprite.position);
}

function updateRegion() {
    currentregion.update(tick);
}

function onKeyPress(event) {
    currentKeysPressed[event.key] = true;
}

function onKeyUp(event) {
    currentKeysPressed[event.key] = false;
}

function checkKeys() { //todo clamp rotation
    if (currentKeysPressed["ArrowLeft"] == true) boom.rotateOnWorldAxis(upVector, -0.025);
    if (currentKeysPressed["ArrowRight"] == true) boom.rotateOnWorldAxis(upVector, 0.025);
    if (currentKeysPressed["ArrowUp"] == true) {
        boom.rotateX(-0.025);
        //console.log(THREE.Math.radToDeg(boom.rotation.x));
    }
    if (currentKeysPressed["ArrowDown"] == true) {
        boom.rotateX(0.025)
            //console.log(THREE.Math.radToDeg(boom.rotation.x));
    }
}

/* function setupKeyControls() {
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 187: //+
                break;
            case 189: //-
                break;

            case 87: //w
                playergroup.position.y += 1;
                boom.position.copy(player.sprite.position);
                break;
            case 65: //a
                playergroup.position.x -= 1;
                boom.position.copy(player.sprite.position);
                break;
            case 83: //s
                playergroup.position.y -= 1;
                boom.position.copy(player.sprite.position);
                break;
            case 68: //d
                playergroup.position.x += 1;
                boom.position.copy(player.sprite.position);
                break;

        }
        renderer.render(scene, camera);
    };
}
 */
function onPointerMove(event) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    var rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / renderwidth) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / renderheight) * 2 + 1;
}

function onClick(event) {
    if (intersects[0].object.name == 'groundplane') {
        var tilecoords = raycastToTileCoords(intersects[0])
        console.log('clicked' + intersects[0].object.name + ' at ' + tilecoords.x + "," + tilecoords.y);
        player.setDestination(tilecoords.x, tilecoords.y, tick);
        //console.log('new dest:' + player.destination.x + ',' + player.destination.y);
        boom.position.copy(player.sprite.position);
        statusbox.innerHTML = player.destination.x + ',' + player.destination.y;
    }

    var target = intersects[0].object;
    if (target.name == 'goblin') {
        currentregion.npcMap.get(target.id).die();
    }

}

function raycastToTileCoords(target) {
    var intersectVector3 = target.point;
    var tileX = Math.floor(intersectVector3.x);
    var tileY = Math.floor(intersectVector3.y);
    return new THREE.Vector2(tileX, tileY);
}

function getRandomArbitrary(min, max) {
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return Math.random() * (max - min) + min;
}


function addToScene(gameObject) { // used for callbacks to add to scene
    scene.add(gameObject);
}

function removeFromScene(id) {
    var gameObject = scene.getObjectById(id);
    scene.remove(gameObject);
}



