// parabola.js
let parabolaAnimation = null;
let parabolaState = { v0:20, angle:45, g:9.8, t:0, scale:8 };

export function initParabola(){
  // attach handlers only once
  const vIn = document.getElementById('velocity');
  const aIn = document.getElementById('angle');
  const vVal = document.getElementById('vVal');
  const aVal = document.getElementById('aVal');
  const startBtn = document.getElementById('parabola-start');
  const stopBtn = document.getElementById('parabola-stop');

  vIn.oninput = () => { vVal.textContent = vIn.value; parabolaState.v0 = +vIn.value; };
  aIn.oninput = () => { aVal.textContent = aIn.value; parabolaState.angle = +aIn.value; };

  startBtn.onclick = () => {
    parabolaState.t = 0;
    startParabolaLoop();
  };
  stopBtn.onclick = () => stopParabola();
  // start once automatically
  // startParabolaLoop();
}

function startParabolaLoop(){
  stopParabola();
  const canvas = document.getElementById('parabola-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const state = parabolaState;
  function clear(){
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  function draw(){
    clear();
    const rad = state.angle * Math.PI / 180;
    const vx = state.v0 * Math.cos(rad);
    const vy = state.v0 * Math.sin(rad);
    const x = vx * state.t;
    const y = vy * state.t - 0.5 * state.g * state.t * state.t;
    const px = 60 + x * state.scale;
    const py = canvas.height - (40 + y * state.scale);

    // ground
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

    // projectile
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI*2);
    ctx.fillStyle = '#ff3366';
    ctx.fill();

    // trajectory marker: small trail
    // (optional: store array of points; kept simple)

    if(y >= 0){
      state.t += 0.04;
      parabolaAnimation = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(parabolaAnimation);
    }
  }
  draw();
}

export function stopParabola(){
  if(parabolaAnimation) cancelAnimationFrame(parabolaAnimation);
  parabolaAnimation = null;
}
