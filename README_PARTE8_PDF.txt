
ERP PARTE 8 – PDF FINAL DOBLE HOJA (FUMIGACIÓN + CALIDAD)

1. Requisitos en index.html (antes de cerrar </head> o justo antes de </body>):

   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

2. Asegúrate de que las hojas A4 tengan esta estructura:

   <section id="fumigacion">
     <div id="fumigacion-container">
       <div class="a4">
         <!-- TODO EL CONTENIDO DE FUMIGACIÓN -->
       </div>
     </div>
   </section>

   <section id="calidad">
     <div id="calidad-container">
       <div class="a4">
         <!-- TODO EL CONTENIDO DE CALIDAD -->
       </div>
     </div>
   </section>

3. Inserta el botón del PDF donde quieras (por ejemplo, en Fumigación):

   Copia el contenido de pdf-button.html dentro de index.html
   o incluye el botón manualmente y llama a generarPDF().

4. El módulo modules/pdf.js:
   - Captura las dos hojas .a4 (fumigación y calidad)
   - Usa html2canvas para convertirlas en imágenes
   - Usa jsPDF para generar un PDF A4 de 2 páginas
   - Guarda el archivo como constancias_YYYYMMDD_HHMM.pdf

5. El estilo del botón está en pdf-style.css (puedes copiarlo a tu style.css si prefieres).
