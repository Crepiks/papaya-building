import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x446481);

const light = new THREE.DirectionalLight(0xffffff, 0.5);
// light.position.set(10, 10, 10);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 10, 10);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const boxGeometry = new THREE.BoxGeometry(10, 0.2, 10);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb775 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

function animate() {
  orbit.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
