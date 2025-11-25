// =========================
// MÓDULO ALMACENES – CRUD + IndexedDB Básico
// =========================

(function(){
  const cont = document.getElementById('almacenes-container');
  if (!cont) return;

  cont.innerHTML = `
    <div class="toolbar">
      <button id="alm-nuevo" class="btn primary">+ Nuevo almacén</button>
      <input id="alm-buscar" class="input" placeholder="Buscar por nombre o responsable">
    </div>
    <div id="alm-form-wrap" class="card hidden">
      <h3 id="alm-form-title">Nuevo almacén</h3>
      <div class="form-grid">
        <label>Nombre del almacén
          <input id="alm-nombre" class="input">
        </label>
        <label>Dirección
          <input id="alm-direccion" class="input">
        </label>
        <label>Responsable
          <input id="alm-responsable" class="input">
        </label>
        <label>Teléfono
          <input id="alm-telefono" class="input">
        </label>
        <label>Observación
          <textarea id="alm-obs" class="input" rows="2"></textarea>
        </label>
      </div>
      <div class="actions">
        <button id="alm-guardar" class="btn success">Guardar</button>
        <button id="alm-cancelar" class="btn secondary">Cancelar</button>
      </div>
    </div>
    <div id="alm-lista" class="grid"></div>
  `;

  // IndexedDB
  const DB_NAME = 'erp_induamerica';
  const DB_VER  = 2; // IMPORTANTE: nueva versión para crear almacenes
  let db;
  let editId = null;

  const openReq = indexedDB.open(DB_NAME, DB_VER);

  openReq.onupgradeneeded = e => {
    const db = e.target.result;

    if (!db.objectStoreNames.contains('almacenes')) {
      const store = db.createObjectStore('almacenes', { keyPath: 'id', autoIncrement: true });
      store.createIndex('nombre', 'nombre', { unique: false });
      store.createIndex('responsable', 'responsable', { unique: false });
    }
  };

  openReq.onsuccess = e => {
    db = e.target.result;
    cargarAlmacenes();
  };

  openReq.onerror = () => console.error('Error abriendo IndexedDB almacenes');

  const $ = id => document.getElementById(id);

  function cargarAlmacenes(filtro = ''){
    const lista = $('alm-lista');
    lista.innerHTML = '<p class="muted">Cargando...</p>';
    const tx = db.transaction('almacenes', 'readonly');
    const store = tx.objectStore('almacenes');
    const req = store.openCursor();
    const items = [];
    req.onsuccess = e => {
      const cur = e.target.result;
      if (cur){
        items.push(cur.value);
        cur.continue();
      } else {
        renderAlmacenes(items, filtro);
      }
    };
  }

  function renderAlmacenes(items, filtro){
    const lista = $('alm-lista');
    filtro = (filtro || '').toLowerCase();
    lista.innerHTML = '';
    const filtrados = items.filter(a => {
      const t = (a.nombre + ' ' + (a.responsable || '')).toLowerCase();
      return t.includes(filtro);
    });

    if (!filtrados.length){
      lista.innerHTML = '<p class="muted">Sin almacenes registrados.</p>';
      return;
    }

    filtrados.forEach(a => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${a.nombre}</h3>
        <p class="small">${a.direccion || ''}</p>
        <p class="small">Resp.: ${a.responsable || '-'}</p>
        <p class="small">Tel: ${a.telefono || '-'}</p>
        <div class="card-actions">
          <button class="btn xs" data-accion="insertar" data-id="${a.id}">Insertar en hoja</button>
          <button class="btn xs secondary" data-accion="editar" data-id="${a.id}">Editar</button>
          <button class="btn xs danger" data-accion="eliminar" data-id="${a.id}">Eliminar</button>
        </div>
      `;
      lista.appendChild(card);
    });
  }

  function mostrarFormulario(modo, data){
    $('alm-form-wrap').classList.remove('hidden');
    $('alm-form-title').textContent = modo === 'nuevo' ? 'Nuevo almacén' : 'Editar almacén';

    if (modo === 'nuevo'){
      editId = null;
      $('alm-nombre').value = '';
      $('alm-direccion').value = '';
      $('alm-responsable').value = '';
      $('alm-telefono').value = '';
      $('alm-obs').value = '';
    } else {
      editId = data.id;
      $('alm-nombre').value = data.nombre || '';
      $('alm-direccion').value = data.direccion || '';
      $('alm-responsable').value = data.responsable || '';
      $('alm-telefono').value = data.telefono || '';
      $('alm-obs').value = data.obs || '';
    }
  }

  function ocultarFormulario(){
    $('alm-form-wrap').classList.add('hidden');
  }

  $('alm-nuevo').onclick = () => mostrarFormulario('nuevo');
  $('alm-cancelar').onclick = ocultarFormulario;
  $('alm-buscar').oninput = e => cargarAlmacenes(e.target.value);

  $('alm-guardar').onclick = () => {
    const a = {
      nombre: $('alm-nombre').value.trim(),
      direccion: $('alm-direccion').value.trim(),
      responsable: $('alm-responsable').value.trim(),
      telefono: $('alm-telefono').value.trim(),
      obs: $('alm-obs').value.trim()
    };

    if (!a.nombre){
      alert('El nombre del almacén es obligatorio');
      return;
    }

    const tx = db.transaction('almacenes', 'readwrite');
    const store = tx.objectStore('almacenes');

    if (editId){
      a.id = editId;
      store.put(a);
    } else {
      store.add(a);
    }

    tx.oncomplete = () => {
      ocultarFormulario();
      cargarAlmacenes($('alm-buscar').value);
    };
  };

  $('alm-lista').onclick = e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const accion = btn.dataset.accion;
    if (!id) return;

    const tx = db.transaction('almacenes', 'readwrite');
    const store = tx.objectStore('almacenes');
    const req = store.get(id);

    req.onsuccess = () => {
      const a = req.result;
      if (!a) return;

      if (accion === 'editar'){
        mostrarFormulario('editar', a);
      } 
      else if (accion === 'eliminar'){
        if (confirm('¿Eliminar almacén?')){
          store.delete(id);
          tx.oncomplete = () => cargarAlmacenes($('alm-buscar').value);
        }
      } 
      else if (accion === 'insertar'){
        insertarAlmacenEnHojas(a);
      }
    };
  };

  function insertarAlmacenEnHojas(a){
    const texto = `${a.nombre}\n${a.direccion || ''}\nResp.: ${a.responsable || ''}`;

    const campoF = document.getElementById('campo-almacen-fumigacion');
    const campoC = document.getElementById('campo-almacen-calidad');

    if (campoF) campoF.textContent = texto;
    if (campoC) campoC.textContent = texto;

    alert('Datos del almacén preparados para las hojas. Si aún no ves campos almacén en Fumigación/Calidad, solo falta agregarlos en el HTML.');
  }

})();
