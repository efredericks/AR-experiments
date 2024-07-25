// python server running
// each time somebody activates it a new blob appears (just an internal counter)
//  // new flower grows? new something? redo technqiue?
//

const gfxs = [];
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
  model = loadModel('./assets/gvsu-spinning-keychain/GVSUSpinLogo.stl', true)
}

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
  for (let i = 0; i < N; i++) {
    const gfx = createARGraphics(W, W, P2D, { scale: 2, markerId: i });
    gfx.background(0);
    //const gfx = createGraphics(W, W);//, P2D, { scale: 1, markerId: i });
    gfx.textAlign(CENTER, CENTER);
    gfx.textFont('Courier');

    let sx = 0;
    let sy = 0;

    if (i == 0) { // n
      gfx.noStroke();
      gfx.fill(color(220, 220, 220, 180));
      gfx.textSize(ts);

      for (let _sy = hskip; _sy < W - hskip; _sy += skip) {
        for (let _sx = hskip; _sx < W - hskip; _sx += skip) {
          gfx.text(grid[_sy][_sx].n.toFixed(1), _sx, _sy);
        }
      }
    } else if (i == 1) { // a
      gfx.noStroke();
      gfx.fill(color(220, 220, 220, 180));
      gfx.textSize(ts);

      sx = W;
      for (let _sy = hskip; _sy < W - hskip; _sy += skip) {
        for (let _sx = hskip; _sx < W - hskip; _sx += skip) {
          gfx.text(grid[_sy][_sx].a.toFixed(1), _sx, _sy);
        }
      }

      /*
  gfx.textSize(ts*2);
  let txt = "angle"
  let tw = gfx.textWidth(txt);
  gfx.rectMode(CENTER);
  gfx.fill(220);
  gfx.rect(W/2,hts,tw,ts);
  gfx.fill(20);
  gfx.text(txt, W/2, hts);
      */

    } else if (i == 2) { // arrow
      gfx.noStroke();
      gfx.fill(color(220, 220, 220, 180));
      gfx.textSize(ts);

      sy = W;
      for (let _sy = hskip; _sy < W - hskip; _sy += skip) {
        for (let _sx = hskip; _sx < W - hskip; _sx += skip) {
          gfx.push();
          gfx.translate(_sx - hts, _sy - hts);
          gfx.rotate(grid[_sy][_sx].a);
          gfx.text("𐃘", 0, 0);
          gfx.rotate(-grid[_sy][_sx].a);
          gfx.translate(-_sx + hts, -_sy + hts);
          gfx.pop();
        }
      }
    } else if (i == 3) {
      sx = W;
      sy = W;
    }
    gfxs.push({ g: gfx, sx: sx, sy: sy });
  }

  gfx_3d = createARGraphics(W, W, WEBGL, { scale: 2, markerId: 5 });


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

  saveGif("door.gif", 12)
}

let gfx_3d;
function draw() {
  // background(20);
  // fill(20);
  // noStroke();
  // rect(0, 0, width, W);
  // rect(0, W, W, W);
  // for (let i = 0; i < gfxs.length; i++) {
  //   let gfx = gfxs[i];
  //   image(gfx.g, gfx.sx, gfx.sy);
  // }

  for (let p of particles) {
    gfxs[3].g.fill(color(p.col));
    gfxs[3].g.circle(p.x, p.y, 4);

    let g = grid[int(p.y)][int(p.x)];
    p.x += 2 * cos(g.a);
    p.y += 2 * sin(g.a);

    if (p.x < 0 || p.x > W * 2 - 1 || p.y < 0 || p.y > W * 2 - 1) {
      p.x = random(0, W * 2 - 1);
      p.y = random(0, W * 2 - 1);
    }
  }

  gfx_3d.background(255);
  gfx_3d.ambientLight(20);
  gfx_3d.pointLight(
    255, 0, 0, // color
    40, -40, 0 // position
  );
  gfx_3d.directionalLight(
    0,255,0, // color
    1, 1, 0  // direction
  );

  // normal material shows the geometry normals
  gfx_3d.normalMaterial();
  // ambient materials reflect under any light
  gfx_3d.ambientMaterial(0, 0, 255);
  // emissive materials show the same color regardless of light
  gfx_3d.emissiveMaterial(0,0, 255);
  // specular materials reflect the color of the light source
  // and can vary in 'shininess'
  gfx_3d.shininess(10);
  gfx_3d.specularMaterial(0, 0, 255);

  gfx_3d.push();
  gfx_3d.rotateX(millis() * 0.001);
  gfx_3d.rotateY(millis() * 0.001);
  gfx_3d.rotateZ(millis() * 0.001);
  gfx_3d.model(model);
  gfx_3d.pop();

  // gfxs.forEach((gfx, index) => {
  //   gfx.g.clear();
  //   gfx.g.fill(cols[index]);
  //   gfx.g.circle(W / 2, W / 2, W);
  //   gfx.g.fill(255);
  //   const n = index + 1;
  //   for (let i = 0; i < n; i++) {
  //     const a = (i * PI) / n;
  //     v = createVector(cos(a), sin(a)).mult((W / 3) * sin(t + a));
  //     gfx.g.circle(v.x + W / 2, v.y + W / 2, W / 15);
  //   }

  //   image(gfx.g, gfx.sx, gfx.sy);
  // });
  // t += 0.04;
}
