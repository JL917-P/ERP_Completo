/**
 * modules/pdf.js
 * Generación de PDF A4 doble hoja (Fumigación + Calidad)
 * Requiere:
 *  - jsPDF UMD cargado en index.html: window.jspdf.jsPDF
 *  - html2canvas cargado en index.html: window.html2canvas
 */

export async function generarPDF() {
  const jspdfGlobal = window.jspdf;
  if (!jspdfGlobal || !jspdfGlobal.jsPDF) {
    alert("Falta cargar jsPDF en index.html (window.jspdf.jsPDF).");
    return;
  }
  if (!window.html2canvas) {
    alert("Falta cargar html2canvas en index.html (window.html2canvas).");
    return;
  }

  const { jsPDF } = jspdfGlobal;
  const doc = new jsPDF("p", "mm", "a4");

  const paginas = [];

  // Buscar hojas A4 dentro de contenedores
  const hojaF = document.querySelector("#fumigacion-container .a4");
  const hojaC = document.querySelector("#calidad-container .a4");

  if (!hojaF && !hojaC) {
    alert("No se encontraron hojas A4 en Fumigación ni Calidad.");
    return;
  }

  if (hojaF) paginas.push(hojaF);
  if (hojaC) paginas.push(hojaC);

  for (let i = 0; i < paginas.length; i++) {
    const el = paginas[i];

    const canvas = await window.html2canvas(el, {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight
    });

    const imgData = canvas.toDataURL("image/png");

    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    const marginTop = (pdfHeight - imgHeight) / 2;

    if (i > 0) doc.addPage();
    doc.addImage(
      imgData,
      "PNG",
      0,
      marginTop < 0 ? 0 : marginTop,
      imgWidth,
      imgHeight
    );
  }

  // Nombre del archivo
  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, "0");
  const dd = String(ahora.getDate()).padStart(2, "0");
  const hh = String(ahora.getHours()).padStart(2, "0");
  const mi = String(ahora.getMinutes()).padStart(2, "0");

  const nombre = `constancias_${yyyy}${mm}${dd}_${hh}${mi}.pdf`;
  doc.save(nombre);
}
