import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const FOUNDATION_HEIGHT = 0.2;
const FLOOR_HEIGTH = 1.8;
const ODD_FLOORS_COLOR = 0xc4989a;
const EVEN_FLOORS_COLOR = 0x9a8c8c;

main();

function main() {
  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = buildScene();

  buildLights(scene);

  const camera = buildCamera();

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.update();

  const floors = [];

  buildFoundation(scene);
  floors.push(buildFloor(scene, FOUNDATION_HEIGHT / 2, ODD_FLOORS_COLOR));
  floors.push(
    buildFloor(scene, FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH, EVEN_FLOORS_COLOR)
  );
  floors.push(
    buildFloor(
      scene,
      FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH * 2,
      ODD_FLOORS_COLOR
    )
  );

  buildTree(scene, 10, -10);
  buildTree(scene, 10, -8);
  buildTree(scene, -5, -8);
  buildTree(scene, -10, -10);
  buildTree(scene, -10, -5);
  buildTree(scene, 7, 9);
  buildTree(scene, 8, -5);
  buildTree(scene, -10, 12);
  buildTree(scene, -10, 8);
  buildTree(scene, -4, 12);

  renderer.setAnimationLoop(() => animate(renderer, scene, camera, orbit));

  listenToFloorsChange(scene, floors);
}

function animate(renderer, scene, camera, orbit) {
  orbit.update();

  renderer.render(scene, camera);
}

function buildScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x446481);

  return scene;
}

function buildCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 5, 10);

  return camera;
}

function buildLights(scene) {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(20, 30, 30);
  scene.add(light);
  const lightHelper = new THREE.DirectionalLightHelper(light, 5);
  scene.add(lightHelper);

  const light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(-20, 30, -30);
  scene.add(light2);
  const light2Helper = new THREE.DirectionalLightHelper(light2, 5);
  scene.add(light2Helper);
}

function buildFoundation(scene) {
  const boxGeometry = new THREE.BoxGeometry(30, FOUNDATION_HEIGHT, 30);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb775 });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  box.position.set(0, 0, 0);

  scene.add(box);

  return box;
}

function buildFloor(scene, baseY = FOUNDATION_HEIGHT / 2, color) {
  const boxGeometry = new THREE.BoxGeometry(8, FLOOR_HEIGTH, 8);
  const boxMaterial = new THREE.MeshStandardMaterial({ color });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  box.position.set(0, FLOOR_HEIGTH / 2 + baseY, 0);

  scene.add(box);

  return box;
}

function listenToFloorsChange(scene, floors) {
  const removeFloorButton = document.getElementById("remove-floor-button");
  removeFloorButton.addEventListener("click", () => {
    const floor = floors.pop();
    scene.remove(floor);
    setNumberOfFloors(floors.length);
  });

  const addFloorButton = document.getElementById("add-floor-button");
  addFloorButton.addEventListener("click", createNewFloor);

  function createNewFloor() {
    if (floors.length % 2 === 0) {
      floors.push(
        buildFloor(
          scene,
          FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH * floors.length,
          ODD_FLOORS_COLOR
        )
      );
    } else {
      floors.push(
        buildFloor(
          scene,
          FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH * floors.length,
          EVEN_FLOORS_COLOR
        )
      );
    }
    setNumberOfFloors(floors.length);
  }

  function setNumberOfFloors(value) {
    const numberOfFloorsLabel = document.getElementById("number-of-floors");
    numberOfFloorsLabel.innerText = value;
  }
}

function buildTree(scene, positionX, positionZ) {
  geometry = new THREE.BoxGeometry(1, 1, 1);

  var leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: 0x91e56e });
  var leaveLightMaterial = new THREE.MeshLambertMaterial({ color: 0xa2ff7a });
  var leaveDarkDarkMaterial = new THREE.MeshLambertMaterial({
    color: 0x71b356,
  });
  var stemMaterial = new THREE.MeshLambertMaterial({ color: 0x7d5a4f });

  var stem = new THREE.Mesh(geometry, stemMaterial);
  stem.position.set(0, 0, 0);
  stem.scale.set(0.3, 1.5, 0.3);

  var squareLeave01 = new THREE.Mesh(geometry, leaveDarkMaterial);
  squareLeave01.position.set(0.5, 1.6, 0.5);
  squareLeave01.scale.set(0.8, 0.8, 0.8);

  var squareLeave02 = new THREE.Mesh(geometry, leaveDarkMaterial);
  squareLeave02.position.set(-0.4, 1.3, -0.4);
  squareLeave02.scale.set(0.7, 0.7, 0.7);

  var squareLeave03 = new THREE.Mesh(geometry, leaveDarkMaterial);
  squareLeave03.position.set(0.4, 1.7, -0.5);
  squareLeave03.scale.set(0.7, 0.7, 0.7);

  var leaveDark = new THREE.Mesh(geometry, leaveDarkMaterial);
  leaveDark.position.set(0, 1.2, 0);
  leaveDark.scale.set(1, 2, 1);

  var leaveLight = new THREE.Mesh(geometry, leaveLightMaterial);
  leaveLight.position.set(0, 1.2, 0);
  leaveLight.scale.set(1.1, 0.5, 1.1);

  var ground = new THREE.Mesh(geometry, leaveDarkDarkMaterial);
  ground.position.set(0, -1, 0);
  ground.scale.set(2.4, 0.8, 2.4);

  let tree = new THREE.Group();
  tree.add(leaveDark);
  tree.add(leaveLight);
  tree.add(squareLeave01);
  tree.add(squareLeave02);
  tree.add(squareLeave03);
  tree.add(ground);
  tree.add(stem);

  tree.position.set(positionX, 1.6, positionZ);

  scene.add(tree);
}
