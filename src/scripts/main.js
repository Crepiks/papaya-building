import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x446481);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(20, 30, 30);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 5, 10);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const FOUNDATION_HEIGHT = 0.2;
const FLOOR_HEIGTH = 1;

buildFoundation();
buildFloor(FOUNDATION_HEIGHT / 2, 0xc4989a);
buildFloor(FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH, 0xeb9665);
buildFloor(FOUNDATION_HEIGHT / 2 + FLOOR_HEIGTH * 2, 0xc4989a);

function animate() {
  orbit.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

function buildFoundation() {
  const boxGeometry = new THREE.BoxGeometry(10, FOUNDATION_HEIGHT, 10);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb775 });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  box.position.set(0, 0, 0);

  scene.add(box);
}

function buildFloor(baseY = FOUNDATION_HEIGHT / 2, color) {
  const boxGeometry = new THREE.BoxGeometry(3, FLOOR_HEIGTH, 3);
  const boxMaterial = new THREE.MeshStandardMaterial({ color });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  box.position.set(0, FLOOR_HEIGTH / 2 + baseY, 0);

  scene.add(box);
}
