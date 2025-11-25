document.getElementById('fumigacion-container').innerHTML = `
<div class='a4'>
<h2>CONSTANCIA DE FUMIGACIÓN</h2>
<button class='add-row-btn' onclick='addRowF()'>+ Agregar fila</button>
<table id='tablaF'>
<thead>
<tr>
<th>Item</th><th>Fecha Envío</th><th>Producto</th><th>Lote</th>
<th>Cant. Env.</th><th>F. Prod.</th><th>F. Venc.</th>
<th>F. Fumi.</th><th>F. Lib.</th><th>Cant. Fumig.</th>
<th>N° Tabs</th><th>Fosfina</th><th>U. Transp.</th>
</tr>
</thead>
<tbody></tbody>
</table>
</div>
`;
window.addRowF = function(){
 const tr = document.createElement('tr');
 for(let i=0;i<13;i++){
   const td=document.createElement('td');
   td.contentEditable=true;
   tr.appendChild(td);
 }
 document.querySelector('#tablaF tbody').appendChild(tr);
};
