//#region Imports
import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
//#endregion

//#region  Scene and Object Setup
//Basic scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight,
  0.01,
  1000
  );
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(30, 30, 30);

//Instantiating our dragon (STL)
const material = new THREE.MeshStandardMaterial({color: 0x666666});
// const material = new THREE.MeshBasicMaterial({
//   map: loader.load('./stl_example/Dragon_ground_color.jpg'),
// });

const loader = new STLLoader()
loader.load(
    './stl_example/example.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(3*Math.PI/2,0,Math.PI/2)
        scene.add(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

//Bringing in some lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,30,0);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(ambientLight);
scene.add(pointLight);
//#endregion

//#region  Contols and effects

//Helpers to see grid
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper); 

//Adding controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//Adding stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25);
  const material = new THREE.MeshStandardMaterial({color: 0xfffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

//#endregion

//#region  Animation Loop

function animate(){
  requestAnimationFrame(animate); //Calling loop

  controls.update(); //Updating user input each frame

  renderer.render(scene, camera); //Rendering final output
}

animate();

//#endregion


