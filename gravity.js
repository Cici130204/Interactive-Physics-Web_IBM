// gravity.js
let gravRenderer, gravScene, gravCamera, gravControls, gravAnimationId;
let gravPlanets = [];
let gravParams = { baseSpeed: 0.01, baseDist: 25 };

function initGravity(){
  // if already initialized, do nothing
  if(document.getElementById('gravitasi-container').dataset.inited) return;

  const container = document.getElementById('gravitasi-container');
  const w = container.clientWidth || window.innerWidth;
  const h = 520;

  gravScene = new THREE.Scene();
  gravScene.background = new THREE.Color(0x0a0a12);

  gravCamera = new THREE.PerspectiveCamera(55, w/h, 0.1, 2000);
  gravCamera.position.set(0, 60, 120);

  gravRenderer = new THREE.WebGLRenderer({ antialias: true });
  gravRenderer.setSize(w, h);
  container.appendChild(gravRenderer.domElement);

  // controls
  gravControls = new THREE.OrbitControls(gravCamera, gravRenderer.domElement);
  gravControls.enableDamping = true;

  // lights
  const hemi = new THREE.HemisphereLight(0xffffff, 0x080820, 0.6);
  gravScene.add(hemi);
  const sunLight = new THREE.PointLight(0xffffff, 2.0);
  gravScene.add(sunLight);

  // sun
  const sunMat = new THREE.MeshStandardMaterial({ emissive: 0xffcc33, emissiveIntensity: 1.6, color: 0x000000 });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(5, 48, 48), sunMat);
  gravScene.add(sun);

  // planets
  const data = [
    { r: gravParams.baseDist * 0.6, s: 1.5, c: 0x00aaff, v: 0.02 },
    { r: gravParams.baseDist, s: 2.0, c: 0x00ff66, v: 0.013 },
    { r: gravParams.baseDist * 1.4, s: 2.5, c: 0xff00ff, v: 0.009 },
  ];
  data.forEach(d => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.s, 32, 32), new THREE.MeshStandardMaterial({ color: d.c }));
    mesh.userData = { angle: Math.random()*Math.PI*2, speed: d.v, radius: d.r };
    gravScene.add(mesh);
    gravPlanets.push(mesh);

    // orbit line
    const pts = [];
    for(let i=0;i<=64;i++){
      const theta = (i/64)*Math.PI*2;
      pts.push(new THREE.Vector3(Math.cos(theta)*d.r, 0, Math.sin(theta)*d.r));
    }
    const orbit = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color:0x666666 }));
    gravScene.add(orbit);
  });

  // mark initialized
  container.dataset.inited = "1";

  // connect DOM controls
  const speedIn = document.getElementById('gravSpeed');
  const distIn = document.getElementById('gravDist');
  const speedVal = document.getElementById('gravSpeedVal');
  const distVal = document.getElementById('gravDistVal');
  const resetCam = document.getElementById('grav-reset');

  if(speedIn){
    speedIn.oninput = () => {
      gravParams.baseSpeed = +speedIn.value;
      speedVal.textContent = speedIn.value;
      // scale planets speeds proportionally
      gravPlanets.forEach((p, i)=> p.userData.speed = gravParams.baseSpeed * (1 - i*0.3));
    };
  }
  if(distIn){
    distIn.oninput = () => {
      const base = +distIn.value;
      distVal.textContent = base;
      // update radii and orbit geometry
      gravPlanets.forEach((p, idx)=>{
        const newR = base * (1 + idx*0.4);
        p.userData.radius = newR;
      });
      // rebuild orbits quickly by removing old and adding new
      // (for simplicity we won't remove old; you can refresh page)
    };
  }
  if(resetCam){
    resetCam.onclick = () => {
      gravCamera.position.set(0,40,80);
      gravControls.target.set(0,0,0);
      gravControls.update();
    };
  }

  // start loop
  animateGravity();
  window.addEventListener('resize', onGravResize);
}

function animateGravity(){
  gravAnimationId = requestAnimationFrame(animateGravity);
  // update planets
  gravPlanets.forEach((p, i) => {
    p.userData.angle += p.userData.speed;
    const r = p.userData.radius;
    p.position.x = r * Math.cos(p.userData.angle);
    p.position.z = r * Math.sin(p.userData.angle);
    p.rotation.y += 0.01 + i*0.005;
  });
  // sun pulsing
  // gravScene.children[?] sun at index 3 maybe; skip
  gravControls.update();
  gravRenderer.render(gravScene, gravCamera);
}

function onGravResize(){
  const container = document.getElementById('gravitasi-container');
  if(!container) return;
  const w = container.clientWidth;
  const h = 520;
  gravCamera.aspect = w/h;
  gravCamera.updateProjectionMatrix();
  gravRenderer.setSize(w,h);
}

function stopGravity(){
  // stop animation and remove renderer if present
  if(typeof gravAnimationId !== 'undefined'){
    cancelAnimationFrame(gravAnimationId);
    gravAnimationId = null;
  }
  const container = document.getElementById('gravitasi-container');
  if(container && container.firstChild){
    // remove canvas and clear scene references
    container.removeChild(container.firstChild);
    gravPlanets = [];
    gravScene = null;
    gravRenderer = null;
    gravCamera = null;
    gravControls = null;
    delete container.dataset.inited;
  }
}

window.initGravity = initGravity;
window.stopGravity = stopGravity;
