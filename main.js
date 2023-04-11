import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './style.css'

//scene
const scene = new THREE.Scene()

let geometry = new THREE.SphereGeometry( 3, 40, 100 );

const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
  roughness: 0.5,
});
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.z = 20;
scene.add(camera);

//Render
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;

//Resize
window.addEventListener('resize', () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
})

//change shape
let geometrySelect = document.getElementById('select-shape')

// Listen for changes to the dropdown and update the geometry based on the selection
geometrySelect.addEventListener('change', (event) => {
  const selectedGeometry = event.target.value

  console.log(selectedGeometry)
  
  // Remove the existing mesh from the scene
  scene.remove(mesh)
  
  // Create a new geometry based on the selected option
  if (selectedGeometry === 'Sphere') {
    geometry = new THREE.SphereGeometry(3, 40, 100)
  } else if (selectedGeometry === 'Cube') {
    geometry = new THREE.BoxGeometry(3, 3, 3)
  } else if (selectedGeometry === 'Cylinder') {
    geometry = new THREE.CylinderGeometry(2, 2, 5, 32)
  }
  
  // Create a new mesh with the updated geometry and add it to the scene
  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
})


const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();

//Timeline

const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {z:0, x:0, y: 0}, {z:1, x:1, y:1})
tl.fromTo('nav', {y: '-100%'}, {y: "0%"})
tl.fromTo('.title', {opacity: 0}, {opacity: 1})
tl.fromTo('.job', {opacity: 0}, {opacity: 1, duration: 2})
setTimeout(function() { tl.fromTo('.job', {opacity: 1}, {opacity: 0, duration: 2}); }, 10000);
setTimeout(function() { tl.fromTo('.title', {opacity: 1}, {opacity: 0, duration: 2}); }, 8000);

//Mouse Animator Color
let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
  if(mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]

    //animate
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`)
    gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
  }
})