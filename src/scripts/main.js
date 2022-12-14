import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { initializeLocationModal, openLocationModal } from "./location-modal";

const FOUNDATION_HEIGHT = 0.2;
const FLOOR_HEIGTH = 1.6;
const WALL_COLOR = 0x3e7da9;

const floors = [];

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

main();

function main() {
  initializeLocationModal();

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = buildScene();
  const camera = buildCamera();
  const orbit = new OrbitControls(camera, renderer.domElement);
  buildLights(scene);
  orbit.update();

  buildBuilding(scene);

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

  buildCar(scene);

  renderer.setAnimationLoop(() => animate(renderer, scene, camera, orbit));
}

function animate(renderer, scene, camera, orbit) {
  orbit.update();

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children, true);

  for (const intersect of intersects) {
    if (
      floors.find((floor) =>
        floor.children.find((child) => child.id === intersect.object.id)
      )
    ) {
      intersect.object.material.color.set(0xf5bfc0);
      openLocationModal();
    } else {
      floors.forEach((floor) => {
        floor.children.forEach((child) => {
          child.material.color.set(WALL_COLOR);
        });
      });
    }
  }

  renderer.render(scene, camera);
}

function buildScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x424d5c);

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

  const light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(-20, 30, -30);
  scene.add(light2);
}

function buildBuilding(scene) {
  let roof = null;

  buildFoundation(scene);
  floors.push(buildFloor(scene, FOUNDATION_HEIGHT / 2));
  floors.push(buildFloor(scene, FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH));
  floors.push(buildFloor(scene, FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH * 2));
  roof = buildRoof(scene, floors);

  listenToFloorsChange(scene, floors, () => {
    scene.remove(roof);
    if (floors.length > 0) {
      roof = buildRoof(scene, floors);
    }
  });
}

function buildFoundation(scene) {
  const boxGeometry = new THREE.BoxGeometry(30, FOUNDATION_HEIGHT, 30);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x5d767e });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  box.position.set(0, 0, 0);

  scene.add(box);

  return box;
}

function buildRoof(scene, floors) {
  const group = new THREE.Group();
  const geometry = new THREE.BoxBufferGeometry(4, 1, 2);
  const material = new THREE.MeshLambertMaterial({ color: WALL_COLOR });
  const roof1 = new THREE.Mesh(geometry, material);
  const roof2 = new THREE.Mesh(geometry, material);
  const roof3 = new THREE.Mesh(geometry, material);

  roof1.position.set(
    0,
    FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH * floors.length + 0.5,
    3
  );
  roof2.position.set(
    0,
    FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH * floors.length + 0.5,
    0
  );
  roof3.position.set(
    0,
    FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH * floors.length + 0.5,
    -3
  );

  group.add(roof1);
  group.add(roof2);
  group.add(roof3);

  scene.add(group);

  return group;
}

function buildFloor(scene, baseY = FOUNDATION_HEIGHT / 2) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: WALL_COLOR });

  const wall1 = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, FLOOR_HEIGTH, 0.2),
    material
  );
  wall1.position.set(0, baseY + FLOOR_HEIGTH / 2, 5);

  const wall2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, FLOOR_HEIGTH, 10),
    material
  );
  wall2.position.set(-3, baseY + FLOOR_HEIGTH / 2, 0);

  const wall3 = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, FLOOR_HEIGTH, 0.2),
    material
  );
  wall3.position.set(0, baseY + FLOOR_HEIGTH / 2, 2);

  const wall4 = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, FLOOR_HEIGTH, 0.2),
    material
  );
  wall4.position.set(0, baseY + FLOOR_HEIGTH / 2, -1);

  const wall5 = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, FLOOR_HEIGTH, 0.2),
    material
  );
  wall5.position.set(0, baseY + FLOOR_HEIGTH / 2, -5);

  const roofGeometry = new THREE.BoxGeometry(6.4, 0.2, 10.4);
  const roof = new THREE.Mesh(roofGeometry, material);

  roof.position.set(0, FLOOR_HEIGTH + baseY, 0);

  const window1 = buildWindow();
  window1.position.set(1.4, FLOOR_HEIGTH / 2 + baseY, 5.1);

  const window2 = buildWindow();
  window2.position.set(-1.4, FLOOR_HEIGTH / 2 + baseY, 5.1);

  group.add(roof);
  group.add(wall1);
  group.add(wall2);
  group.add(wall3);
  group.add(wall4);
  group.add(wall5);
  group.add(window1);
  group.add(window2);

  scene.add(group);

  return group;

  function buildWindow() {
    const geometry = new THREE.BoxBufferGeometry(0.8, 1, 0.1);
    const window = new THREE.Mesh(geometry, material);

    return window;
  }
}

function listenToFloorsChange(scene, floors, onChange = () => {}) {
  const removeFloorButton = document.getElementById("remove-floor-button");
  removeFloorButton.addEventListener("click", () => {
    const floor = floors.pop();
    scene.remove(floor);
    setNumberOfFloors(floors.length);

    onChange();
  });

  const addFloorButton = document.getElementById("add-floor-button");
  addFloorButton.addEventListener("click", () => {
    createNewFloor();
    onChange();
  });

  function createNewFloor() {
    floors.push(
      buildFloor(scene, FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH * floors.length)
    );
    setNumberOfFloors(floors.length);
  }

  function setNumberOfFloors(value) {
    const numberOfFloorsLabel = document.getElementById("number-of-floors");
    numberOfFloorsLabel.innerText = value;
  }
}

function buildTree(scene, positionX, positionZ) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: 0x91e56e });
  const leaveLightMaterial = new THREE.MeshLambertMaterial({ color: 0xa2ff7a });
  const leaveDarkDarkMaterial = new THREE.MeshLambertMaterial({
    color: 0x71b356,
  });
  const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x7d5a4f });

  const stem = new THREE.Mesh(geometry, stemMaterial);
  stem.position.set(0, 0, 0);
  stem.scale.set(0.3, 1.5, 0.3);

  const squareLeave01 = new THREE.Mesh(geometry, leaveDarkMaterial);
  squareLeave01.position.set(0.5, 1.6, 0.5);
  squareLeave01.scale.set(0.8, 0.8, 0.8);

  const squareLeave02 = new THREE.Mesh(geometry, leaveDarkMaterial);
  squareLeave02.position.set(-0.4, 1.3, -0.4);
  squareLeave02.scale.set(0.7, 0.7, 0.7);

  const squareLeave03 = new THREE.Mesh(geometry, leaveDarkMaterial);
  squareLeave03.position.set(0.4, 1.7, -0.5);
  squareLeave03.scale.set(0.7, 0.7, 0.7);

  const leaveDark = new THREE.Mesh(geometry, leaveDarkMaterial);
  leaveDark.position.set(0, 1.2, 0);
  leaveDark.scale.set(1, 2, 1);

  const leaveLight = new THREE.Mesh(geometry, leaveLightMaterial);
  leaveLight.position.set(0, 1.2, 0);
  leaveLight.scale.set(1.1, 0.5, 1.1);

  const ground = new THREE.Mesh(geometry, leaveDarkDarkMaterial);
  ground.position.set(0, -1, 0);
  ground.scale.set(2.4, 0.8, 2.4);

  const tree = new THREE.Group();
  tree.add(leaveDark);
  tree.add(leaveLight);
  tree.add(squareLeave01);
  tree.add(squareLeave02);
  tree.add(squareLeave03);
  tree.add(ground);
  tree.add(stem);

  tree.position.set(positionX, 1.4, positionZ);

  scene.add(tree);
}

function buildCar(scene) {
  const car = new THREE.Group();

  const backWheel = createWheels();
  backWheel.position.y = 6;
  backWheel.position.x = -18;
  car.add(backWheel);

  const frontWheel = createWheels();
  frontWheel.position.y = 6;
  frontWheel.position.x = 18;
  car.add(frontWheel);

  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(60, 15, 30),
    new THREE.MeshLambertMaterial({ color: 0xa52523 })
  );
  main.position.y = 12;
  car.add(main);

  const carFrontTexture = getCarFrontTexture();

  const carBackTexture = getCarFrontTexture();

  const carRightSideTexture = getCarSideTexture();

  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
  carLeftSideTexture.rotation = Math.PI;
  carLeftSideTexture.flipY = false;

  const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 12, 24), [
    new THREE.MeshLambertMaterial({ map: carFrontTexture }),
    new THREE.MeshLambertMaterial({ map: carBackTexture }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
    new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
  ]);
  cabin.position.x = -6;
  cabin.position.y = 25.5;
  car.add(cabin);

  car.scale.set(0.03, 0.03, 0.03);
  car.position.set(10, 0.1, 10);

  scene.add(car);
}

function createWheels() {
  const geometry = new THREE.BoxBufferGeometry(12, 12, 33);
  const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const wheel = new THREE.Mesh(geometry, material);
  return wheel;
}

function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
}
