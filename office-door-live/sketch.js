// python server running
// each time somebody activates it a new blob appears (just an internal counter)
//  // new flower grows? new something? redo technqiue?
//

const W = 400;
const N = 4;
const NUM_PARTICLES = 5000;

let grid;

let t = 0;
const cols = ['#01295f', '#437f97', '#849324', '#ffb30f', '#fd151b', 120];
let particles;

let model;
function preload() {
  // let options = {
  //   // Enables standardized size scaling during loading if set to true.
  //   normalize: true,
  //   // Function to call once the model loads.
  //   successCallback: handleModel,
  //   // Function to call if an error occurs while loading.
  //   failureCallback: handleError,
  //   // Model's file extension.
  //   fileType: '.stl',
  //   // Flips the U texture coordinates of the model.
  //   flipU: false,
  //   // Flips the V texture coordinates of the model.
  //   flipV: false
  // };
  //model = loadModel('./assets/gvsu-spinning-keychain/GVSUSpinLogo.stl', true)
}

let gfx;
function setup() {
  //createCanvas(W*N/2,W*N/2);

  noiseDetail(8, 0.25);
  grid = [];
  for (y = 0; y < W * N; y++) {
    grid[y] = [];
    for (let x = 0; x < W * N; x++) {
      let n = noise(x * 0.01, y * 0.01);
      //let a = map(n, 0.0, 1.0, -TWO_PI, TWO_PI);
      let a = map(n, 0.0, 1.0, -PI, PI);
      grid[y][x] = { n: n, a: a };
    }
  }

  let ts = int(14);
  let skip = int(W / 16);
  let hskip = int(skip / 2);
  let hts = int(ts / 2);
  gfx = createARGraphics(W, W, P2D);//, { scale: 2, markerId: 0 });
  gfx.background(0);
  gfx.textAlign(CENTER, CENTER);
  gfx.textFont('Courier');

  background(20);

  particles = [];
  for (let _ = 0; _ < NUM_PARTICLES; _++) {
    particles.push({
      x: random(0, W * 2 - 1),
      y: random(0, W * 2 - 1),
      col: random(cols),//255),
    });
  }
  textSize(24);
  textAlign(CENTER, CENTER);

}

function draw() {
  for (let p of particles) {
    gfx.fill(color(p.col));
    gfx.circle(p.x, p.y, 4);

    let g = grid[int(p.y)][int(p.x)];
    p.x += 2 * cos(g.a);
    p.y += 2 * sin(g.a);

    if (p.x < 0 || p.x > W * 2 - 1 || p.y < 0 || p.y > W * 2 - 1) {
      p.x = random(0, W * 2 - 1);
      p.y = random(0, W * 2 - 1);
    }
  }
}
