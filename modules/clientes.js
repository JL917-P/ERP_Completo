// =========================
// MÓDULO CLIENTES – CRUD + IndexedDB Básico
// =========================

(function(){
  const cont = document.getElementById('clientes-container');
  if (!cont) return;

  cont.innerHTML = `
    <div class="toolbar">
      <button id="cli-nuevo" class="btn primary">+ Nuevo cliente</button>
      <input id="cli-buscar" class="input" placeholder="Buscar por razón social o RUC">
    </div>
    <div id="cli-form-wrap" class="card hidden">
      <h3 id="cli-form-title">Nuevo cliente</h3>
      <div class="form-grid">
        <label>Razón Social
          <input id="cli-razon" class="input">
        </label>
        <label>RUC
          <input id="cli-ruc" class="input">
        </label>
        <label>Dirección
          <input id="cli-direccion" class="input">
        </label>
        <label>Correo
          <input id="cli-correo" class="input">
        </label>
        <label>Teléfono
          <input id="cli-telefono" class="input">
        </label>
        <label>Observación
          <textarea id="cli-obs" class="input" rows="2"></textarea>
        </label>
      </div>
      <div class="actions">
        <button id="cli-guardar" class="btn success">Guardar</button>
        <button id="cli-cancelar" class="btn secondary">Cancelar</button>
      </div>
    </div>
    <div id="cli-lista" class="grid"></div>
  `;

  // --- IndexedDB ---
  const DB_NAME = 'erp_induamerica';
  const DB_VER  = 2;   // <<---- VERSIÓN ACTUALIZADA (FIX)
  let db;
  let editId = null;

  const openReq = indexedDB.open(DB_NAME, DB_VER);
  openReq.onupgradeneeded = e => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains('clientes')) {
      const store = db.createObjectStore('clientes', { keyPath: 'id', autoIncrement: true });
      store.createIndex('razon', 'razon', { unique: false });
      store.createIndex('ruc', 'ruc', { unique: false });
    }
  };
  openReq.onsuccess = e => {
    db = e.target.result;
    cargarClientes();
  };
  openReq.onerror = () => console.error('Error abriendo IndexedDB clientes');

  // --- Helpers ---
  const $ = id => document.getElementById(id);

  function cargarClientes(filtro = ''){
    const lista = $('cli-lista');
    lista.innerHTML = '<p class="muted">Cargando...</p>';
    const tx = db.transaction('clientes', 'readonly');
    const store = tx.objectStore('clientes');
    const req = store.openCursor();
    const items = [];
    req.onsuccess = e => {
      const cur = e.target.result;
      if (cur){
        items.push(cur.value);
        cur.continue();
      } else {
        renderClientes(items, filtro);
      }
    };
  }

  function renderClientes(items, filtro){
    const lista = $('cli-lista');
    filtro = (filtro || '').toLowerCase();
    lista.innerHTML = '';
    const filtrados = items.filter(c => {
      const t = (c.razon + ' ' + c.ruc).toLowerCase();
      return t.includes(filtro);
    });
    if (!filtrados.length){
      lista.innerHTML = '<p class="muted">Sin clientes registrados.</p>';
      return;
    }
    filtrados.forEach(c => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${c.razon}</h3>
        <p class="small">RUC: ${c.ruc || '-'}</p>
        <p class="small">${c.direccion || ''}</p>
        <p class="small">${c.correo || ''}</p>
        <div class="card-actions">
          <button class="btn xs" data-accion="insertar" data-id="${c.id}">Insertar en hoja</button>
          <button class="btn xs secondary" data-accion="editar" data-id="${c.id}">Editar</button>
          <button class="btn xs danger" data-accion="eliminar" data-id="${c.id}">Eliminar</button>
        </div>
      `;
      lista.appendChild(card);
    });
  }

  function mostrarFormulario(modo, data){
    $('cli-form-wrap').classList.remove('hidden');
    $('cli-form-title').textContent = modo === 'nuevo' ? 'Nuevo cliente' : 'Editar cliente';
    if (modo === 'nuevo'){
      editId = null;
      $('cli-razon').value = '';
      $('cli-ruc').value = '';
      $('cli-direccion').value = '';
      $('cli-correo').value = '';
      $('cli-telefono').value = '';
      $('cli-obs').value = '';
    } else {
      editId = data.id;
      $('cli-razon').value = data.razon || '';
      $('cli-ruc').value = data.ruc || '';
      $('cli-direccion').value = data.direccion || '';
      $('cli-correo').value = data.correo || '';
      $('cli-telefono').value = data.telefono || '';
      $('cli-obs').value = data.obs || '';
    }
  }

  function ocultarFormulario(){
    $('cli-form-wrap').classList.add('hidden');
  }

  // --- Eventos UI ---
  $('cli-nuevo').onclick = () => mostrarFormulario('nuevo');
  $('cli-cancelar').onclick = ocultarFormulario;
  $('cli-buscar').oninput = e => cargarClientes(e.target.value);

  $('cli-guardar').onclick = () => {
    const cli = {
      razon: $('cli-razon').value.trim(),
      ruc: $('cli-ruc').value.trim(),
      direccion: $('cli-direccion').value.trim(),
      correo: $('cli-correo').value.trim(),
      telefono: $('cli-telefono').value.trim(),
      obs: $('cli-obs').value.trim()
    };
    if (!cli.razon){
      alert('La razón social es obligatoria');
      return;
    }

    const tx = db.transaction('clientes', 'readwrite');
    const store = tx.objectStore('clientes');
    if (editId){
      cli.id = editId;
      store.put(cli);
    } else {
      store.add(cli);
    }
    tx.oncomplete = () => {
      ocultarFormulario();
      cargarClientes($('cli-buscar').value);
    };
  };

  $('cli-lista').onclick = e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const accion = btn.dataset.accion;
    if (!id) return;

    const tx = db.transaction('clientes', 'readwrite');
    const store = tx.objectStore('clientes');
    const req = store.get(id);
    req.onsuccess = () => {
      const cli = req.result;
      if (!cli) return;
      if (accion === 'editar'){
        mostrarFormulario('editar', cli);
      } else if (accion === 'eliminar'){
        if (confirm('¿Eliminar cliente?')){
          store.delete(id);
          tx.oncomplete = () => cargarClientes($('cli-buscar').value);
        }
      } else if (accion === 'insertar'){
        insertarClienteEnHojas(cli);
      }
    };
  };

  // --- Inserción en hojas (si existen los elementos destino) ---
  function insertarClienteEnHojas(cli){
    const datos = `${cli.razon}\nRUC: ${cli.ruc || '-'}\n${cli.direccion || ''}`;

    const campoF = document.getElementById('campo-cliente-fumigacion');
    const campoC = document.getElementById('campo-cliente-calidad');

    if (campoF) campoF.textContent = datos;
    if (campoC) campoC.textContent = datos;

    alert('Datos del cliente preparados para las hojas. Si aún no ves campos cliente en Fumigación/Calidad, solo falta agregarlos en el HTML.');
  }

})();
