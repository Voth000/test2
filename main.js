///

gsap.from(".a4", {
  opacity: 1, 
x: -200,
  duration: 2,
  delay: 0,
});

gsap.from(".a2", {
  opacity: 1, 
y: -1200,
  duration: 2,
  delay: 0,
});

gsap.from(".a1", {
  opacity: 1, 
x: -800,
  duration: 2,
  delay: 0,
});



/////

const toggleButton = document.getElementById('toggleButton');
const hiddenDiv = document.getElementById('gui');

toggleButton.addEventListener('change', function() {
  if (toggleButton.checked) {
    hiddenDiv.style.visibility = 'hidden';
  } else {
    hiddenDiv.style.visibility = 'visible';
  }
});


/////

let inactivityTimeout;
let countdownInterval;
const countdownStart = 10; 
let countdown = countdownStart;


function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  clearInterval(countdownInterval);
  document.getElementById('inactivityPopup').style.display = 'none';
  document.getElementById('inactivityOverlay').style.display = 'none';
  countdown = countdownStart; 
  inactivityTimeout = setTimeout(showInactivityPopup, 120000);
}

// Show inactivity popup and start countdown
function showInactivityPopup() {
  document.getElementById('inactivityPopup').style.display = 'block';
  document.getElementById('inactivityOverlay').style.display = 'block';
  startInactivityCountdown();
}

// Start countdown and reload if it reaches zero
function startInactivityCountdown() {
  document.getElementById('inactivityCountdown').textContent = countdown;
  countdownInterval = setInterval(() => {
    countdown--;
    document.getElementById('inactivityCountdown').textContent = countdown;
    
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      location.reload();
    }
  }, 1000);
}

// Cancel button to stop countdown and reset inactivity timer
document.getElementById('cancelInactivityButton').addEventListener('click', () => {
  resetInactivityTimer();
});

// Reset inactivity timer on any user interaction
['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetInactivityTimer);
});

// Start the initial inactivity timer
resetInactivityTimer();


  // Add event listener to refresh button
document.getElementById('refreshButton').addEventListener('click', () => {
	location.reload();
  });
  


  


   



/////
function showAlert() {
  // Display the overlay and the pop-up box
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('popup').style.display = 'block';
}

function hideAlert() {
  // Hide the overlay and the pop-up box
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('popup').style.display = 'none';
}

/////

document.addEventListener('touchmove', function(event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });




const canvas1 = document.getElementById('scribbleCanvas');
const ctx = canvas1.getContext('2d');
const videoElement = document.querySelector('.input_video');
const headRectangle = document.getElementById("headRectangle");
const starContainer = document.getElementById("starContainer");
const starCount = 8; // Number of static stars
const maxBlinkInterval = 500; // Maximum interval for random position update


    const scribbles = []; // Store the scribbles
    const numScribbles = 4; // Number of scribbles to create
    const movementThreshold = 20; // Minimum distance to trigger rotation
    let latestColor1 = 'rgba(112, 112, 112, 1)'; 
    let lastHeadPosition = { x: null, y: null };
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
  });

  faceMesh.onResults(onResults);

  const camera = new Camera(videoElement, {
      onFrame: async () => {
          await faceMesh.send({ image: videoElement });
      },
      width: window.width,
      height: window.height
  });
  camera.start();


function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");

  // Set initial random position
  randomizeStarPosition(star);

  // Append the star to the container
  starContainer.appendChild(star);

  // Randomize blinking interval for each star
  setInterval(() => {
      randomizeStarPosition(star);
  }, Math.random() * maxBlinkInterval);
}

// Function to randomize position
function randomizeStarPosition(star) {
  const posX = Math.random() * window.innerWidth;
  const posY = Math.random() * window.innerHeight;
  const size = Math.random() * 20 + 20; // Star size between 3px and 8px

  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.left = `${posX}px`;
  star.style.top = `${posY}px`;
}

// Initialize stars on page load
function initializeStars() {
  for (let i = 0; i < starCount; i++) {
      createStar();
  }
}


    function initializeScribbles() {
        for (let i = 0; i < numScribbles; i++) {
            scribbles.push({
                startX: Math.random() * canvas1.width,
                startY: Math.random() * canvas1.height,
                angle: Math.random() * Math.PI * 2, // Random angle
            });
        }
        drawScribbles();
    }


    function onResults(results) {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const faceLandmarks = results.multiFaceLandmarks[0];
          const leftEyeLandmark = faceLandmarks[33];
          
          const scaledPosition = getScaledPosition(leftEyeLandmark);
          // Get the position of the left eye (landmark 33)
          const leftEyeX = faceLandmarks[33].x * canvas1.width;
          const leftEyeY = faceLandmarks[33].y * canvas1.height; // Invert y-coordinate to match canvas
  
          // Update the rectangle position to follow the left eye
          updateRectanglePosition(scaledPosition.x, scaledPosition.y);
  
          // Use a central face point (like the nose at index 1) to track head movement
          const currentHeadPosition = {
              x: faceLandmarks[1].x * canvas1.width,
              y: faceLandmarks[1].y * canvas1.height, // Invert y-coordinate
          };
          
          // Check if the head has moved significantly
          const distance = Math.sqrt(Math.pow(currentHeadPosition.x - (lastHeadPosition.x || 0), 2) + 
                                     Math.pow(currentHeadPosition.y - (lastHeadPosition.y || 0), 2));
  
          if (distance > movementThreshold) {
              // Rotate the scribbles randomly
              rotateScribbles();
              drawScribbles();
              lastHeadPosition = currentHeadPosition; // Update the last head position
          }
      }
  }

  function getScaledPosition(landmark) {
    // Adjust for mirrored video by inverting the x-coordinate
    const x = (1 - landmark.x) * videoElement.clientWidth;
    const y =  landmark.y * videoElement.clientHeight; // Invert y-coordinate
    return { x, y };
}

function updateRectanglePosition(x, y) {
    // Get the viewport boundaries for the rectangle dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rectWidth = headRectangle.offsetWidth;
    const rectHeight = headRectangle.offsetHeight;

    // Clamp x and y within the viewport
    const clampedX = Math.max(rectWidth / 2, Math.min(x, viewportWidth - rectWidth / 2));
    const clampedY = Math.max(rectHeight / 2, Math.min(y, viewportHeight - rectHeight / 2));

    headRectangle.style.left = `${clampedX}px`;
    headRectangle.style.top = `${clampedY}px`;
}

function rotateScribbles() {
    scribbles.forEach(scribble => {
        // Add a random angle between -30 and 30 degrees to the current angle
        scribble.angle += (Math.random() * 60 - 30) * (Math.PI / 180); // Convert degrees to radians
    });
}


function changeColor() {
  var colorInput = document.getElementById("colorPicker5");
  var color = colorInput.value;
  var rgb = hexToRgb(color);

  latestColor1 = 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 1)';
  ctx.shadowColor = latestColor1; 
  drawScribbles(); // Redraw scribbles with new color
}




function drawScribbles() {
  // Clear the canvas before drawing
  ctx.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'; // Glow color (white, semi-transparent)
  ctx.shadowBlur = 20;
  scribbles.forEach(scribble => {
      var numLines = 500; // Number of lines per scribble
      var radius = 2;

      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';

      var startX = scribble.startX;
      var startY = scribble.startY;
      var angle = scribble.angle;

      for (var i = 0; i < numLines; i++) {
          var x2 = startX + Math.sin(angle) * radius;
          var y2 = startY + Math.cos(angle) * radius;

          ctx.globalAlpha = i / numLines;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          startX = x2;
          startY = y2;
          angle += Math.random() * 2 - 1; // Slight variation in angle
          radius += Math.random() * 40 - 20;

          radius = Math.max(1, Math.min(radius, 20));
      }
  });
   // Reset shadow settings to avoid affecting other drawings
   ctx.shadowColor = 'transparent';
   ctx.shadowBlur = 0;
}



function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1; // Get device pixel ratio
  canvas1.width = window.innerWidth * dpr;
  canvas1.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  drawScribbles(); // Redraw scribbles after resizing
}

// Set initial canvas size and initialize scribbles
resizeCanvas();
initializeScribbles(); 
initializeStars();
// Create initial scribbles

// Adjust on window resize
window.addEventListener('resize', resizeCanvas);

