import * as THREE from 'three';
import { GLTFLoader } from "../three/GLTFLoader.js";
import { OrbitControls } from '../three/OrbitControls.js';
import { RGBELoader } from '../three/RGBELoader.js';

// Variables to hold the logo scene and logo object
let logoScene, logo_grp, logo;

const title = document.getElementById("title");
const description = document.getElementById("description");

// Create a new Three.js scene
const scene = new THREE.Scene();

// Set up the camera with a perspective view
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Get the canvas element from the DOM
const container = document.getElementById("threejscanvas");

// Create a WebGL renderer and set its size
const renderer = new THREE.WebGLRenderer({canvas: container, antialias: true, preserveDrawingBuffer:true, alpha: true});
renderer.setSize( container.clientWidth, container.clientHeight );

// Set up orbit controls for the camera
const controls = new OrbitControls( camera, renderer.domElement );

// Set the initial position of the camera
camera.position.x = 0.1;
camera.position.y = 0;
camera.position.z = 0.1;

// Enable damping (inertia) for the controls
controls.enableDamping = true;
controls.dampingFactor = 0.02;
controls.rotateSpeed = 0.5;

// ---------------------------------------------------------------------
// HDRI - IMAGE BASED LIGHTING
// ---------------------------------------------------------------------
new RGBELoader()
.setPath('./assets/')
.load('photo_studio_02_2k.hdr', function (texture) {
    // Set the texture mapping to equirectangular reflection mapping
    texture.mapping = THREE.EquirectangularReflectionMapping;

    // Set the scene environment to the loaded texture
    scene.environment = texture;
});

// Create a loading manager
var loadingManager = new THREE.LoadingManager();

// Load the GLTF model
const loader = new GLTFLoader(loadingManager);
loader.load(
    './assets/mNm_logo.gltf',
    function ( gltf ) {
        // Add the loaded scene to the main scene
        logoScene = gltf.scene;
        scene.add( logoScene );

        // Get the logo object by name
        //logo_grp = logoScene.getObjectByName('k_logo_grp');
        logo = logoScene.getObjectByName('logo');



    }
);



//raycaster 

// Assuming you have a scene, camera, and renderer already set up
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


function setEverythingWhite(){
    logoScene.getObjectByName("mind").material.color.set("#808080");
    logoScene.getObjectByName("muscl").material.color.set("#808080");
    logoScene.getObjectByName("nutrition").material.color.set("#808080");
    logoScene.getObjectByName("you").material.color.set("#808080");

    logoScene.getObjectByName("mind_n_you").material.color.set("#808080");
    logoScene.getObjectByName("musc_n_nutrition").material.color.set("#808080");
}

const colors = {
    mind: 0xFFA500, // Yellowish-Orange
    muscl: 0x0000FF, // Blue
    nutrition: 0x008000, // Green
    you: 0xFFFFFF  // White
};

window.addEventListener('click', (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(logoScene.getObjectByName('logo').children);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        if(clickedObject.name === 'mind'){
            setEverythingWhite();
            clickedObject.material.color.set(colors.mind);
            logoScene.getObjectByName("mind_n_you").material.color.set(colors.mind);
            title.innerHTML = "Mind";
            description.innerHTML = "The most powerful yet delicate tool that, when guided right, unlocks new perspective on life.";
        }
        if(clickedObject.name === 'muscl'){
            setEverythingWhite();
            clickedObject.material.color.set(colors.muscl);
            logoScene.getObjectByName("musc_n_nutrition").material.color.set(colors.muscl);
            title.innerHTML = "Muscl";
            description.innerHTML = "Muscle is a soft tissue found in most animals. Muscle cells contain protein filaments of actin and myosin that slide past one another, producing a contraction that changes both the length and the shape of the cell.";
        }
        if(clickedObject.name === 'nutrition'){
            setEverythingWhite();
            clickedObject.material.color.set(colors.nutrition);
            logoScene.getObjectByName("musc_n_nutrition").material.color.set(colors.nutrition);
            title.innerHTML = "Nutrition";
            description.innerHTML = "Nutrition is the science that interprets the nutrients and other substances in food in relation to maintenance, growth, reproduction, health and disease of an organism.";
        }
        if(clickedObject.name === 'you'){
            setEverythingWhite();
            clickedObject.material.color.set(colors.you);
            logoScene.getObjectByName("mind_n_you").material.color.set(colors.you);
            title.innerHTML = "You";
            description.innerHTML = "You are the one who is reading this right now. You are the most important element of the logo"
        }
    }
});


// Handle window resize events
window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Animation loop
function animate(time) {
    requestAnimationFrame( animate );
    controls.update();

    // Rotate the logo if it exists
    if(logo){
        logo.rotation.y += 0.005;
    }

    // Render the scene from the perspective of the camera
    renderer.render( scene, camera );
}

// Start the animation loop
animate();