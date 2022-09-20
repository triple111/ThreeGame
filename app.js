import * as THREE from '/three-main/build/three.module.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(400,400);

  const fov = 75;
  const aspect = 1;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  camera.position.x = 0;
  camera.position.y = -5;
  camera.rotation.x = 1.2;


/*
  const left = -1;
  const right = 1;
  const top = 1;
  const bottom = -1;
  const near = 5;
  const far = 50;
  const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  camera.zoom = 0.2;
*/
  const scene = new THREE.Scene();

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const material = new THREE.MeshBasicMaterial({color: 0x44aa88});  // greenish blue
  const grassmat = new THREE.MeshBasicMaterial({color: 0x00aa00});
  const cube = new THREE.Mesh(geometry, material);
  const planegeo = new THREE.PlaneGeometry(9,9);
  const grass = new THREE.Mesh(planegeo,grassmat);

  scene.add(grass);
  scene.add(cube);

  renderer.render(scene, camera);
}

main();