console.log("Cargando módulos ERP...");

// Lista de los módulos según tu carpeta real
const modules = [
    { id: "fumigacion", html: "modules/fumigacion_header.html", js: "modules/fumigacion.js" },
    { id: "calidad", html: "modules/calidad_header.html", js: "modules/calidad.js" },
    { id: "clientes", html: null, js: "modules/clientes.js" },
    { id: "almacenes", html: null, js: "modules/almacenes.js" },
    { id: "plantillas", html: "modules/pdf-button.html", js: "modules/pdf.js" },
    { id: "historial", html: "modules/footer.html", js: "modules/header.js" },
    { id: "voz", html: "modules/voice-ui.html", js: "modules/voz.js" }
];

// Función de carga
modules.forEach(m => {
    const container = document.getElementById(`${m.id}-container`);
    if (!container) return;

    // Si el módulo tiene HTML, cargarlo
    if (m.html) {
        fetch(m.html)
            .then(r => r.text())
            .then(html => {
                container.innerHTML = html;
            })
            .catch(err => {
                container.innerHTML = "Error cargando módulo HTML…";
                console.error("Error HTML", m.id, err);
            });
    }

    // Cargar el JS correspondiente
    if (m.js) {
        const script = document.createElement('script');
        script.src = m.js;
        script.defer = true;
        document.body.appendChild(script);
    }
});
