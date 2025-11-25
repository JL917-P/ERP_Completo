
import { voz } from './modules/voz.js';

window.addEventListener('DOMContentLoaded', ()=>{
  voz.init();

  const btn = document.getElementById("voice-button");

  btn.onclick = ()=>{
    voz.decir("Te escucho");
    voz.escuchar((texto)=>{
      console.log("Reconocido:", texto);

      // Reglas principales
      if(texto.includes("cliente")) {
        voz.decir("Mostrando clientes");
        document.getElementById("tab-clientes").click();
      }
      if(texto.includes("almacén")) {
        voz.decir("Mostrando almacenes");
        document.getElementById("tab-almacenes").click();
      }
      if(texto.includes("fumigación") || texto.includes("fumigacion")) {
        voz.decir("Abriendo fumigación");
        document.getElementById("tab-fumigacion").click();
      }
      if(texto.includes("calidad")) {
        voz.decir("Abriendo calidad");
        document.getElementById("tab-calidad").click();
      }
    });
  };
});
