import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const FOUNDATION_HEIGHT = 0.2;
const FLOOR_HEIGTH = 0.8;
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
  const boxGeometry = new THREE.BoxGeometry(14, FOUNDATION_HEIGHT, 14);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb775 });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  box.position.set(0, 0, 0);

  scene.add(box);

  return box;
}

function buildFloor(scene, baseY = FOUNDATION_HEIGHT / 2, color) {
  const boxGeometry = new THREE.BoxGeometry(6, FLOOR_HEIGTH, 6);
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
