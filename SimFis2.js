// main.js
// navigasi section
function showSection(id){
    document.querySelectorAll("section").forEach(s => s.style.display = "none");
    document.getElementById(id).style.display = "flex";
    window.scrollTo({top:0, behavior:'smooth'});
    // if leaving sim area, stop sims
    if(id !== 'simulasi') {
      stopParabola();
      stopGravity();
    }
  }
  showSection('home');
  
  // open selected sim inside simulasi page
  function openSim(sim){
    showSection('simulasi');
    // hide all sim areas
    document.querySelectorAll('.sim-area').forEach(el => el.style.display = 'none');
    // stop previous sim instances
    stopParabola();
    stopGravity();
  
    if(sim === 'parabola'){
      document.getElementById('parabola-area').style.display = 'block';
      initParabola(); // from parabola.js
    } else if(sim === 'gravitasi'){
      document.getElementById('gravitasi-area').style.display = 'block';
      initGravity(); // from gravity.js
    }
  }
  
  // convenience wrapper used earlier
  function startSim(type){ openSim(type); }
  