// python server running
// each time somebody activates it a new blob appears (just an internal counter)
//  // new flower grows? new something? redo technqiue?
//

const W = 400;
const N = 4;
const NUM_PARTICLES = 5000;

let grid;

let socket;

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
let num_users = -1;
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
  gfx = createARGraphics(W, W, P2D, { scale: 8 });//, markerId: 0 });

  gfx.background(0);
  gfx.textSize(24);
  gfx.textAlign(CENTER, CENTER);
  gfx.textFont('Courier');

  // background(20);

  particles = [];

  socket = io()
  socket.on('connect', function () {
    socket.emit('my event', { data: 'I\'m connected!' });
  });
  socket.on('connection success', data => {
    num_users = data['num_users'];
    console.log("Received num users: " + data['num_users']);
  });
}

function setupParticles() {
  for (let _ = 0; _ < num_users; _++) {
    particles.push({
      x: random(0, W * 2 - 1),
      y: random(0, W * 2 - 1),
      col: random(cols),//255),
    });
  }
}

function draw() {
  if (particles.length == 0 && num_users < 0) {
    gfx.fill(220);
    gfx.textSize(24);
    gfx.text("SERVER CONNECTION BROKEN", W / 2, W / 2);
    gfx.textSize(18);
    gfx.text("TELL FREDERICKS", W / 2, W / 2 + 24);
  } else if (particles.length == 0 && num_users > 0) {
    gfx.fill(220);
    gfx.textSize(24);
    gfx.text("SETTING UP PARTICLE LIST", W / 2, W / 2);
    setupParticles();
    gfx.background(20);
  } else {
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
    let s = `${num_users} visitors`;
    gfx.textSize(18);
    let tw = gfx.textWidth(s)
    gfx.fill(color(0,0,0,80));
    gfx.noStroke();
    gfx.rect(0, 0, tw, 20);
    gfx.fill(color(220,220,220,80));
    gfx.text(s, tw/2, 10);
  }
}
