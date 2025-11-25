document.getElementById('calidad-container').innerHTML = `
<div class='a4'>
<h2>CONSTANCIA DE CALIDAD</h2>
<button class='add-row-btn' onclick='addRowC()'>+ Agregar fila</button>
<table id='tablaC'>
<thead>
<tr>
<th>Item</th><th>Presentación</th><th>Cód. Lote</th><th>Cant.</th>
<th>F. Prod.</th><th>F. Venc.</th><th>%H</th><th>Quebrados</th>
<th>Tiz. Tot.</th><th>Tiz. Parc.</th><th>Dañados</th><th>Blancura</th>
</tr>
</thead>
<tbody></tbody>
</table>
</div>
`;
window.addRowC = function(){
 const tr = document.createElement('tr');
 for(let i=0;i<12;i++){
   const td=document.createElement('td');
   td.contentEditable=true;
   tr.appendChild(td);
 }
 document.querySelector('#tablaC tbody').appendChild(tr);
};
