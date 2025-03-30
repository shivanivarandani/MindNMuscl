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

        logoScene.traverse( function( child ) {
            if ( child.isMesh ) {
                child.material.roughness = 1.0;

            }
        })



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
    logoScene.getObjectByName("muscl_n_nutrition").material.color.set("#808080");
    logoScene.getObjectByName("center").material.color.set("#808080");
}

const colors = {
    mind: "#efa901", // Yellowish-Orange
    muscl: "#1693e0", // Blue
    nutrition: "#029e5e", // Green
    you: 0xFFFFFF  // White
};

function changeColorGradually(object, targetColor) {
    const newColor = new THREE.Color(targetColor);
    
    function animateColor() {
        requestAnimationFrame(animateColor);
        object.material.color.lerp(newColor, 0.05); // Adjust the transition speed
    }
    
    animateColor();
}

function onPointerEvent(event){

    //event.preventDefault();

    let clientX, clientY;
    if (event.touches) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }


    // Convert position to normalized device coordinates (-1 to +1)
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

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
            logoScene.getObjectByName("center").material.color.set(colors.mind);
            title.innerHTML = "MIND";
            description.innerHTML = "The most powerful yet delicate tool that, when guided right, unlocks new perspective on life.";
        }
        else if(clickedObject.name === 'muscl'){
            setEverythingWhite();
            clickedObject.material.color.set(colors.muscl);
            logoScene.getObjectByName("muscl_n_nutrition").material.color.set(colors.muscl);
            logoScene.getObjectByName("center").material.color.set(colors.muscl);
            title.innerHTML = "MUSCL";
            description.innerHTML = "A tangible and formidable tool that unlocks endless possibilities when nurtured and guided.";
        }
        else if(clickedObject.name === 'nutrition'){
            setEverythingWhite();
            clickedObject.material.color.set(colors.nutrition);
            logoScene.getObjectByName("muscl_n_nutrition").material.color.set(colors.nutrition);
            logoScene.getObjectByName("center").material.color.set(colors.nutrition);
            title.innerHTML = "N (NUTRITION)";
            description.innerHTML = "The simplest yet most misunderstood element, showing quick improvements when approached correctly.";
        }
        else if(clickedObject.name === 'you'){
            setEverythingWhite();
            clickedObject.material.color.set(colors.you);
            logoScene.getObjectByName("mind_n_you").material.color.set(colors.you);
            logoScene.getObjectByName("center").material.color.set(colors.you);
            title.innerHTML = "YOU";
            description.innerHTML = "The unique foundation connecting all elements, symbolising individuality and giving meaning to holistic health.";
        }
        else if(clickedObject.name === 'muscl_n_nutrition'){
            setEverythingWhite();
            
            logoScene.getObjectByName("muscl").material.color.set(colors.you);
            logoScene.getObjectByName("nutrition").material.color.set(colors.you);
            logoScene.getObjectByName("muscl_n_nutrition").material.color.set(colors.you);
            logoScene.getObjectByName("center").material.color.set(colors.you);
            title.innerHTML = "INFINITY";
            description.innerHTML = "Represents the lifelong journey of self-care, continuous learning and application unique to each individual."
        }
        else if(clickedObject.name === 'mind_n_you'){
            setEverythingWhite();
            
            logoScene.getObjectByName("muscl").material.color.set(colors.you);
            logoScene.getObjectByName("nutrition").material.color.set(colors.you);
            logoScene.getObjectByName("muscl_n_nutrition").material.color.set(colors.you);
            logoScene.getObjectByName("center").material.color.set(colors.you);
            logoScene.getObjectByName("mind_n_you").material.color.set(colors.you);
            logoScene.getObjectByName("mind").material.color.set(colors.you);
            logoScene.getObjectByName("you").material.color.set(colors.you);
            title.innerHTML = "INTERCONNECTED";
            description.innerHTML = "Highlights how the aligment of Mind, Nutrition, Muscl, and YOU creates the sustainable growth and lasting impact."
        }

    }
    else{
        setEverythingWhite();
    }
};

function onTouchEvent(event) {
    if (event.touches.length > 0) {
        onPointerEvent(event);
    }
}

renderer.domElement.addEventListener('click', onPointerEvent);
renderer.domElement.addEventListener('mousemove', onPointerEvent);
renderer.domElement.addEventListener('touchstart', onTouchEvent, { passive: false });


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
        logo.rotation.y += 0.001;
    }

    // Render the scene from the perspective of the camera
    renderer.render( scene, camera );
}

// Start the animation loop
animate();