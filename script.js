let timeOfDay = 1;           // 0 = dawn, 1 = day, 2 = night
const buildingWidth = 80;
const spacing = 10;
const generationInterval = 60;  // frames between additions
const slideSpeed = 2;          // px per frame sliding

let buildings = [];
let isSliding = false;
let slideOffset = 0;
let maxBuildings;

function setup() {
  const ctrlHeight = document.getElementById('controls').offsetHeight + 30;
  let canvas = createCanvas(windowWidth, windowHeight - ctrlHeight);
  canvas.parent(document.body);
  frameRate(60);
  calculateMax();
}

function windowResized() {
  const ctrlHeight = document.getElementById('controls').offsetHeight + 30;
  resizeCanvas(windowWidth, windowHeight - ctrlHeight);
  calculateMax();
}

function calculateMax() {
  // Enough buildings to fill screen
  maxBuildings = ceil(width / (buildingWidth + spacing)) + 1;
}

// Slider interaction
const slider = document.getElementById('timeRange');
slider.addEventListener('input', () => {
  timeOfDay = +slider.value;
  document.getElementById('timeLabel').textContent = ['Dawn','Day','Night'][timeOfDay];
});

function draw() {
  background(0);
  drawSky();

  // Trigger new building add if not currently sliding
  if (!isSliding && frameCount % generationInterval === 0) {
    addBuilding();
  }

  // Draw buildings: newest at center, older to left
  let xCenter = width / 2;
  for (let i = 0; i < buildings.length; i++) {
    const idx = buildings.length - 1 - i;
    let x = xCenter - buildingWidth/2 - idx * (buildingWidth + spacing) + slideOffset;
    drawBuilding(x, buildings[i]);
  }

  // Handle sliding animation
  if (isSliding) {
    slideOffset -= slideSpeed;
    if (slideOffset <= 0) {
      slideOffset = 0;
      isSliding = false;
      // Remove oldest if exceeding max
      if (buildings.length > maxBuildings) {
        buildings.shift();
      }
    }
  }
}

function addBuilding() {
  const h = height - mouseY;
  const cols = floor(buildingWidth / 20);
  const rows = floor(h / 30);
  let windows = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (random() < 0.4) {
        windows.push({i, j, glow: random(200,255)});
      }
    }
  }
  buildings.push({h, windows});
  isSliding = true;
  slideOffset = buildingWidth + spacing;
}

function drawSky() {
  let c1, c2;
  if (timeOfDay === 0) {
    c1 = color(255,153,102); c2 = color(255,204,153);
  } else if (timeOfDay === 1) {
    c1 = color(135,206,235); c2 = color(176,224,230);
  } else {
    c1 = color(15,15,40); c2 = color(50,50,80);
  }
  for (let y = 0; y < height; y++) {
    stroke(lerpColor(c1,c2,map(y,0,height,0,1)));
    line(0,y,width,y);
  }
}

function drawBuilding(x, {h, windows}) {
  fill(50); noStroke();
  rect(x, height - h, buildingWidth, h);
  windows.forEach(w => {
    fill(255,255,w.glow);
    rect(x + w.i*20 + 5, height - h + w.j*30 +5, 10,20);
  });
}