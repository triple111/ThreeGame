//import * as THREE from '/three-main/build/three.module.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js';
import { Text } from 'https://cdn.skypack.dev/troika-three-text@0.30.2/src/Text.js';
import { Character } from '/character.js';
import { MapLoader } from '/maploader.js';

//---------------GAME WINDOW VARIABLES-----------------
const canvas = document.querySelector('#c');
const infobox = document.querySelector('#info');
const renderer = new THREE.WebGLRenderer({ canvas });
const renderwidth = 600;
const renderheight = 400;
renderer.antialias = false;
const scene = new THREE.Scene();
const width = 15;
const height = 10;
const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, .001, 1000);
const fontloader = new THREE.FontLoader();
//const gamefont = fontloader.load('resource/font/gamefont.json');
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

//---------------WORLD OBJECT VARIABLES-----------------
const maploader = new MapLoader(addToScene);
const boom = new THREE.Group()
const playergroup = new THREE.Group();
const player = new Character(-.5, -.5, 0, 'player');
const sword = new Character(-.75, -.5, .5, 'blacksword');
playergroup.position.set(2.5, 2.5, 0);
playergroup.add(player.sprite);
playergroup.add(sword.sprite);

//---------------OTHER VARIABLES-----------------
const currentKeysPressed = {};




//---------------FUNCTIONS---------------
function intializeWorld() {
    maploader.loadWorldGeometry();
    maploader.loadMapFile(drawWorld);
    maploader.loadCharacters();
}

function drawWorld() {
    for (var i = 0; i < maploader.mapObjects.length; i++) {
        scene.add(maploader.mapObjects[i].sprite);
    }
}

function addToScene(gameObject) { // used for callbacks to add to scene
    scene.add(gameObject);
}


function main() {

    renderer.setSize(renderwidth, renderheight);

    boom.add(camera);

    camera.position.z = 5;
    camera.position.x = 0;
    camera.position.y = -10;
    camera.lookAt(0, 0, 0);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const goblin = new Character(3, 0, 0, 'goblin');
    const demon = new Character(4, 0, 0, 'demon');
    const imp = new Character(5, 0, 0, 'imp');


    player.name = "player";
    //scene.add(player.sprite);
    //scene.add(sword.sprite);
    scene.add(goblin.sprite);
    scene.add(demon.sprite);
    scene.add(imp.sprite);

    scene.add(boom);
    scene.add(playergroup)
    boom.position.copy(playergroup.position);

    //const light = new THREE.AmbientLight(0xffffff, 1);
    // scene.add(light);

    const atext = new Text();
    scene.add(atext);
    atext.text = 'Greater Demon';
    atext.fontSize = 0.3;
    //atext.font = gamefont;
    atext.position.copy(demon.sprite.position);
    atext.position.z = 2.5;
    atext.rotation.x = THREE.Math.degToRad(90);
    atext.anchorX = 'center';
    //atext.material = new THREE.SpriteMaterial();
    renderer.render(scene, camera);

}


function onKeyPress(event) {
    currentKeysPressed[event.key] = true;
}

function onKeyUp(event) {
    currentKeysPressed[event.key] = false;
}

function checkKeys() {
    if (currentKeysPressed["ArrowLeft"] == true) boom.rotation.z -= 0.05;
    if (currentKeysPressed["ArrowRight"] == true) boom.rotation.z += 0.05;
}


function setupKeyControls() {
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 187: //+
                break;
            case 189: //-
                break;

            case 87: //w
                playergroup.position.y += 1;
                boom.position.copy(playergroup.position);
                break;
            case 65: //a
                playergroup.position.x -= 1;
                boom.position.copy(playergroup.position);
                break;
            case 83: //s
                playergroup.position.y -= 1;
                boom.position.copy(playergroup.position);
                break;
            case 68: //d
                playergroup.position.x += 1;
                boom.position.copy(playergroup.position);
                break;

        }
        renderer.render(scene, camera);
    };
}

function onPointerMove(event) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    var rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / renderwidth) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / renderheight) * 2 + 1;
}

//function

setupKeyControls();
main();
intializeWorld();
window.addEventListener('keydown', onKeyPress);
window.addEventListener('keyup', onKeyUp);
window.addEventListener('pointermove', onPointerMove);

window.requestAnimationFrame(loop);


function loop() {

    window.requestAnimationFrame(loop);
    checkKeys();

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    for (let i = 0; i < intersects.length; i++) {

        //console.log(intersects[i].object.id);
        infobox.innerHTML = intersects[i].object.id;

    }

    renderer.render(scene, camera);
}