console.log("ERP Base Loaded");
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelectorAll('.section').forEach(s=>s.classList.add('hidden'));
    document.getElementById(btn.dataset.section).classList.remove('hidden');
  };
});
