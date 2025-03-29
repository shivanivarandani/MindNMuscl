import * as THREE from 'three';
import { GLTFLoader } from "../three/GLTFLoader.js";
import { OrbitControls } from '../three/OrbitControls.js';
import { RGBELoader } from '../three/RGBELoader.js';

// Variables to hold the logo scene and logo object
let logoScene, logo_grp, logo;

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
        logo = logoScene.getObjectByName('MNM_Logo');



    }
);



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