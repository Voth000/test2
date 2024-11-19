
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

import Stats from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/libs/stats.module.js';
import dat from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/postprocessing/UnrealBloomPass.js';
// Define global variables
let scene, camera, renderer, controls, raycaster, mouse, composer;
let container, tim, tim1, gltf2, gltf3, gltf4;

const popup = document.getElementById("up");
const languageToggle = document.getElementById("languageToggle");

function showPopup() {
  popup.style.display = "flex";
}

function hidePopup() {
  popup.style.display = "none";
}

function toggleLanguage(isVietnamese) {
  // Set body class for language-specific styling
  document.body.className = isVietnamese ? 'lang-vi' : 'lang-en';
  
  // Save language preference
  localStorage.setItem('preferredLanguage', isVietnamese ? 'vi' : 'en');
  
  // Optional: Trigger a custom event for other parts of the application
  document.dispatchEvent(new CustomEvent('languageChanged', { 
    detail: { language: isVietnamese ? 'vi' : 'en' } 
  }));
}

// Initialize language preference
document.addEventListener('DOMContentLoaded', function() {
  // Get stored language preference
  const storedLang = localStorage.getItem('preferredLanguage');
  
  if (storedLang) {
    const isVietnamese = storedLang === 'en';
    // Set the toggle switch position
    if (languageToggle) {
      languageToggle.checked = isVietnamese;
    }
    // Apply the language
    toggleLanguage(isVietnamese);
  }
  
  // Show popup initially
  showPopup();
  
  // Add event listener for language toggle
  if (languageToggle) {
    languageToggle.addEventListener('change', function(e) {
      toggleLanguage(e.target.checked);
    });
  }
});


init();

function init() {

  container = document.getElementById('three-container');
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true; // If you need shadows

  renderer.toneMappingExposure = 1;
  renderer.setClearAlpha(0.0);
  //scene.background = new THREE.Color(0x333333);
 
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  



  composer = new EffectComposer(renderer);
  const renderScene = new RenderPass(scene, camera);
composer.addPass(renderScene);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.6,  // Bloom strength
    1,  // Bloom radius
    0.85  // Bloom threshold
  );
  composer.addPass(bloomPass);




  // Load texture for spotlight
  const texture = new THREE.TextureLoader();
  const spotTexture = texture.load('./en.JPG'); // Make sure this path is correct
  spotTexture.minFilter = THREE.LinearFilter;
  spotTexture.magFilter = THREE.LinearFilter;
  spotTexture.colorSpace = THREE.SRGBColorSpace;
   // Add an ambient light
  const ambientLight = new THREE.AmbientLight(0x262626);
  scene.add(ambientLight);
 // Set up spotlight with texture
 const spotLight = new THREE.SpotLight(0xffffff, 10);
 const spotLight1 = new THREE.SpotLight(0xffffff, 3);

 spotLight1.position.set(-2.5, 8, 2.5);
 spotLight1.angle = Math.PI / 6;
 spotLight1.map = spotTexture;

 
 spotLight1.penumbra = 1;
 spotLight1.decay = 4;
 spotLight1.distance = 100;

 
 spotLight.position.set(0.5, -20, 0.5);
 spotLight.angle = Math.PI / -4;
 spotLight.penumbra = 1;
 spotLight.decay = 4;
 spotLight.distance = 100;
 spotLight.map = spotTexture;

 spotLight.castShadow = true;
 spotLight.shadow.mapSize.width = 1024;
 spotLight.shadow.mapSize.height = 1024;
 spotLight.shadow.camera.near = 1;
 spotLight.shadow.camera.far = 200;
 spotLight.shadow.focus = 1;
 // Rotates it 180 degrees along Y-axis
 spotLight.rotation.z = Math.PI / -8;
 
 scene.add(spotLight);
 scene.add(spotLight1);
 // Add a ground plane to receive shadows
 const planeGeometry = new THREE.PlaneGeometry(200, 200);
 const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xbcbcbc, transparent: true, opacity: 0.1});
 const ground = new THREE.Mesh(planeGeometry, planeMaterial);
 ground.position.set(-4, -7, 2);
 ground.rotation.x = Math.PI / -6;
 ground.receiveShadow = true;
 scene.add(ground);




const colorPicker = document.getElementById('colorPicker');

const emissiveColor = new THREE.Color(0xffffff);

// Listen for the color picker's input event
colorPicker.addEventListener('input', function(event) {
  const color = event.target.value;
  emissiveColor.set(color);
  updateEmissiveColor();
});

// Function to update the emissive color of the model's material
function updateEmissiveColor() {
  tim.traverse(function (node) {
    if (node.isMesh && node.name !== 'sh') { // Apply to all models except 'sh.glb'
      node.material.emissive = emissiveColor;
    }
  });
  renderer.render(scene, camera); // Render the scene to see the color change immediately
}

// Get the color picker element
const colorPicker1 = document.getElementById('colorPicker2');
// Set up the emissive color
const emissiveColor1 = new THREE.Color(0x949494);
// Listen for the color picker's input event
colorPicker1.addEventListener('input', function(event1) {
  const color1 = event1.target.value;
  emissiveColor1.set(color1);
  updateEmissiveColor1();
});


function updateEmissiveColor1() {
  gltf4.traverse(function (node) {
    if (node.isMesh) {
      node.material.emissive = emissiveColor1;
    }
  });
  renderer.render(scene, camera); // Render the scene to see the color change immediately
}


 // Load the first GLTF model (tim.glb)
 const loader = new GLTFLoader();
 loader.load('ani2.glb', function (gltf) {
   tim = gltf.scene;
   scene.add(tim);

const mixer = new THREE.AnimationMixer(tim);
const clips = gltf.animations;


clips.forEach(function (clip) {
 const action = mixer.clipAction(clip);
 action.play();
});
tim.visible = false;
tim.name = "tim";
document.addEventListener('click', function(event) {
  // Check if click is on or inside language controls
  const isLanguageControl = event.target.closest('.language-choice') || 
                          event.target.closest('#languageToggle');
                          
  // Check if click is inside popup content
  const isPopupContent = event.target.closest('.up-content');
  
  // Don't hide popup if clicking language controls or popup content
  if (isLanguageControl || isPopupContent) {
    return;
  }
  
  // Check for 3D model clicks (your existing raycaster logic)
  if (raycaster) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      let parent = clickedObject;
      while (parent) {
        if (parent.name === "tim") {
          hidePopup();
          break;
        }
        parent = parent.parent;
      }
    }
  }
});

document.getElementById("button2").addEventListener("click", function(){
 scene.getObjectByName( 'tim1' ).visible = false;
 scene.getObjectByName( 'tim' ).visible = true;
});

   tim.traverse(function (node) {
       if (node.isMesh) {
         node.material.shininess = 0;
 node.scale.set(0.11, 0.11, 0.11);

 const material = node.material;
 material.emissive = emissiveColor; // set the emissive color to white
 material.emissiveIntensity = 0.7; // adj
 node.material.transparent = true;
     node.material.opacity = 1; 
     node.castShadow = true;
					node.receiveShadow = true;
       }
     });
   // Set the position of the model
   tim.position.set(0, 0, 0.5);

   // Set up the raycaster and mouse
   raycaster = new THREE.Raycaster();
   mouse = new THREE.Vector2();
   // Add an event listener for mouse clicks
   document.addEventListener('mousedown', onDocumentMouseDown);
   // Animation loop
 function animate() {
   requestAnimationFrame(animate);

   // Update the mixer to advance the animations
   mixer.update(0.005); // Adjust the time delta as needed
   const time = performance.now() / 3000;

   spotLight.position.x = Math.cos( time ) * 2.5;
   spotLight.position.z = Math.sin( time ) * 2.5;

   spotLight1.position.x = Math.cos( time ) * 2.5;
   spotLight1.position.z = Math.sin( time ) * 2.5;
   renderer.render(scene, camera);
   composer.render();

   controls.update();
 }

 // Start the animation loop
 animate();

 });


   // Load the first GLTF model (tim.glb)
   const loader1 = new GLTFLoader();
   loader1.load('test.glb', function (gltf) {
     tim1 = gltf.scene;
     scene.add(tim1);
 
 const mixer = new THREE.AnimationMixer(tim1);
 const clips = gltf.animations;
 

 clips.forEach(function (clip) {
   const action = mixer.clipAction(clip);
   action.play();
 });

 tim1.visible = true;
 tim1.name = "tim1";

 document.getElementById("button1").addEventListener("click", function(){
   scene.getObjectByName( 'tim' ).visible = false;

 tim1.visible = !tim1.visible;
 });
 
     tim1.traverse(function (node) {
         if (node.isMesh) {
   const material = node.material;
   material.emissive = emissiveColor; // set the emissive color to white
   material.emissiveIntensity = 0.4;
   node.material.metalness = 0.2; // Adjust as desired
        node.material.roughness = 0.4; // Adjust as desired
        node.material.needsUpdate = true;
        node.rotation.x = Math.PI / -8;
       node.scale.set(0.6, 0.6, 0.6);
       node.position.set(-0.25, 1, 0.8);

       if (material.map) {
         material.map.encoding = THREE.sRGBEncoding;
         material.castShadow = true;
         material.receiveShadow = true;
       }
         }
       });
  
    
  
     raycaster = new THREE.Raycaster();
     mouse = new THREE.Vector2();

     document.addEventListener('mousedown', onDocumentMouseDown);

   function animate() {
     requestAnimationFrame(animate);
 
  
     mixer.update(0.008); 
     composer.render();

     renderer.render(scene, camera);
     controls.update();
   }
 
   // Start the animation loop
   animate();
 
   });





  // Load the second GLTF model (2.glb)
  loader.load('hoa2.glb', function (gltf) {
    gltf2 = gltf.scene;
    gltf2.traverse(function (node) {
        if (node.isMesh) {
          node.material.opacity = 1; 
          node.material.shininess = 5;
          node.scale.set(1.4, 1.4, 1.4);
          node.position.set(0, 0, 0);
          node.castShadow = true;
					node.receiveShadow = true;
          const material = node.material;
          material.emissive = new THREE.Color(0xFFFFFF); // set the emissive color to white
          material.emissiveIntensity = 0.4; // adj
         
        }
      });
     
  });

  loader.load('tree2.glb', function (gltf) {
    gltf3 = gltf.scene;
    
    gltf3.traverse(function (node) {
        if (node.isMesh) {
          node.material.shininess = 55;
          node.scale.set(0.2, 0.2, 0.2);
          node.position.set(0, 0, 0);
          node.castShadow = true;
					node.receiveShadow = true;
  const material = node.material;
  material.opacity = 0.6; 
  material.emissive = new THREE.Color(0xffffff); // set the emissive color to white
  material.emissiveIntensity = 0.7; // adj
        }
      });
    
  });

  loader.load('sh.glb', function (gltf) {
    gltf4 = gltf.scene;
    gltf4.traverse(function (node) {
        if (node.isMesh) {
          node.material.shininess = 85;
          node.scale.set(1.4, 1.4, 1.4);
          node.position.set(0, 0, -3);
          node.castShadow = true;
					node.receiveShadow = true;
  const material = node.material;
  material.transparent = true;  
  material.opacity = 0.5; 

 material.emissive = new THREE.Color(0xada9e5);
// material.emissive = new THREE.Color(0x484573); 
   // set the emissive color to white
  material.emissiveIntensity = 1; // adj
        }
      });
     
  });







  // Set the camera position
  camera.position.z = 5;

  window.addEventListener('resize', onWindowResize);

}


let currentGlb = gltf2;
let gltf4Count = 0; // Counter for gltf4 appearances

function onDocumentMouseDown(event) {
  // Set the mouse position
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

// Perform the raycast
raycaster.setFromCamera(mouse, camera);

const intersectObjects = [];

if (tim.visible) {
  intersectObjects.push(tim);
}

if (tim1.visible) {
  intersectObjects.push(tim1);
}

const intersects = raycaster.intersectObjects(intersectObjects, true);

  // Check if the mouse clicked on the tim.glb model
  if (intersects.length > 0) {
    // Get the first intersection point
    const intersection = intersects[0];

    // Calculate the position and rotation of the new object
    const position = intersection.point.clone();
    const normal = intersection.face.normal.clone();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    // Create a clone of the current GLTF model
    if (currentGlb) {
      const clone = currentGlb.clone();
      // Set the position and rotation of the clone based on the mouse click
      clone.position.copy(position);
      clone.quaternion.copy(quaternion);
      scene.add(clone);

      // Increment the gltf4Count if gltf4 is cloned
      if (currentGlb === gltf4) {
        gltf4Count++;
      }
    }
  }

}

setInterval(() => {
  if (currentGlb === gltf2) {
    currentGlb = gltf3;
    scene.remove(gltf2);
    scene.add(gltf3);
  } else if (currentGlb === gltf3) {
    if (gltf4Count < 20) {
      currentGlb = gltf4;
      scene.remove(gltf3);
      scene.add(gltf4);
    } else {
      currentGlb = gltf2;
      scene.remove(gltf3);
      scene.add(gltf2);
    }
  } else {
    currentGlb = gltf2;
    scene.remove(gltf4);
    scene.add(gltf2);
  }
}, 400);


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  composer.render();
}

animate();

// Function to handle window resizing
function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
}