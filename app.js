//import * as THREE from '/three-main/build/three.module.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js'

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.antialias = true;
const scene = new THREE.Scene();

const fov = 75;
const aspect = 1; // the canvas default
const near = 0.1;
const far = 100;
//const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const boom = new THREE.Group()

const width = 10;
const height = 10;
const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);

function main() {

    renderer.setSize(400, 400);

    boom.add(camera);

    camera.position.z = 5;
    camera.position.x = 0;
    camera.position.y = -5;
    camera.lookAt(0, 0, 0);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);




    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); // greenish blue
    const grassmat = new THREE.MeshBasicMaterial({ color: 0x00aa00 });
    const cube = new THREE.Mesh(geometry, material);
    const planegeo = new THREE.PlaneGeometry(9, 9);
    const grass = new THREE.Mesh(planegeo, grassmat);

    scene.add(grass);
    scene.add(cube);
    scene.add(boom);
    cube.position.z = 1;
    renderer.render(scene, camera);
}

function setupKeyControls() {
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37: //left
                boom.rotation.z -= 0.1;
                break;
            case 38: //up
                // camera.rotation.z -= 0.1;
                break;
            case 39: //right
                //camera.rotation.x -= 0.1;
                boom.rotation.z += 0.1;
                break;
            case 40: //down
                //camera.rotation.z += 0.1;
                break;
            case 187: //+
                break;
            case 189: //-
                break;
        }
        renderer.render(scene, camera);
    };
}

//function
setupKeyControls();
main();