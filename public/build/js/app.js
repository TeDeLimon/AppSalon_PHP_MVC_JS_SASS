let paso=1;const cita={id:"",nombre:"",fecha:"",hora:"",servicios:[]};function iniciarApp(){mostrarSeccion(),tabs(),botonesPaginador(),consultarAPI(),nombreCliente(),idCliente(),seleccionarFecha(),seleccionarHora()}function tabs(){document.querySelectorAll(".tabs button").forEach(e=>{e.addEventListener("click",(function(e){paso=parseInt(e.target.dataset.paso),mostrarSeccion()}))})}function mostrarSeccion(){3===paso&&mostrarResumen();document.querySelector(".mostrar").classList.remove("mostrar");const e="#paso-"+paso;document.querySelector(e).classList.add("mostrar");document.querySelector(".actual").classList.remove("actual");document.querySelector(`[data-paso="${paso}"]`).classList.add("actual")}function botonesPaginador(){const e=document.querySelector("#anterior"),t=document.querySelector("#siguiente");e.addEventListener("click",(function(){1==paso?paso=3:paso--,mostrarSeccion()})),t.addEventListener("click",(function(){3==paso?paso=1:paso++,mostrarSeccion()}))}async function consultarAPI(){try{const e="http://localhost:300/api/servicios",t=await fetch(e),o=await t.json();await mostrarServicios(o)}catch(e){console.log(e)}}async function mostrarServicios(e){e.forEach(e=>{const{id:t,nombre:o,precio:n}=e,a=document.createElement("P");a.classList.add("nombre-servicio"),a.textContent=o;const c=document.createElement("P");c.classList.add("precio-servicio"),c.textContent="$"+n;const r=document.createElement("DIV");r.classList.add("servicio"),r.dataset.idServicio=t,r.onclick=function(){seleccionarServicio(e)},r.appendChild(a),r.appendChild(c),document.querySelector("#servicios").appendChild(r)})}function seleccionarServicio(e){const{id:t}=e;console.log(t);const{servicios:o}=cita,n=document.querySelector(`[data-id-servicio="${t}"]`);console.log(n),o.some(e=>e.id===t)?(cita.servicios=o.filter(e=>e.id!==t),n.classList.remove("seleccionado")):(cita.servicios=[...o,e],n.classList.add("seleccionado")),console.log(cita)}function nombreCliente(){cita.nombre=document.querySelector("#nombre").value}function idCliente(){cita.id=document.querySelector("#id").value}function seleccionarFecha(){document.querySelector("#fecha").addEventListener("input",(function(e){const t=new Date(e.target.value).getUTCDay();[6,0].includes(t)?(mostrarAlerta("Fines de semana no trabajamos","error",".formulario"),e.target.value=""):cita.fecha=e.target.value}))}function seleccionarHora(){document.querySelector("#hora").addEventListener("input",(function(e){const t=e.target.value.split(":")[0];t<10||t>18?(mostrarAlerta("La hora no es válida","error",".formulario"),e.target.value=""):cita.hora=e.target.value}))}function mostrarAlerta(e,t,o,n=!0){const a=document.querySelector(".alerta");a&&a.remove();const c=document.createElement("DIV");c.textContent=e,c.classList.add("alerta"),c.classList.add(t);document.querySelector(o).appendChild(c),n&&setTimeout(()=>{c.remove()},3e3)}function mostrarResumen(){const e=document.querySelector(".contenido-resumen");for(;e.firstChild;)e.removeChild(e.firstChild);if(Object.values(cita).includes("")||0===cita.servicios.length)return void mostrarAlerta("Hacen falta datos o Servicios","error",".contenido-resumen",!1);const{nombre:t,fecha:o,hora:n,servicios:a}=cita,c=document.createElement("H3");c.textContent="Resumen de Servicios",e.appendChild(c),a.forEach(t=>{const{id:o,precio:n,nombre:a}=t,c=document.createElement("DIV");c.classList.add("contenedor-servicio");const r=document.createElement("P");r.textContent=a;const i=document.createElement("P");i.innerHTML="<span>Precio:</span> $"+n,c.appendChild(r),c.appendChild(i),e.appendChild(c)});const r=document.createElement("H3");r.textContent="Resumen de Usuario",e.appendChild(r);const i=document.createElement("P");i.innerHTML="<span>Nombre: </span> "+t;const s=new Date(o),d=s.getMonth(),l=s.getDate(),u=s.getUTCFullYear(),m=new Date(Date.UTC(u,d,l)).toLocaleDateString("es-ES",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),p=document.createElement("P");p.innerHTML="<span>Fecha: </span> "+m;const h=document.createElement("P");h.innerHTML=`<span>Hora: </span> ${n} Horas`;const v=document.createElement("BUTTON");v.classList.add("boton"),v.textContent="Reservar Cita",v.onclick=reservarCita,e.appendChild(i),e.appendChild(p),e.appendChild(h),e.appendChild(v)}async function reservarCita(){const{nombre:e,id:t,fecha:o,hora:n,servicios:a}=cita,c=a.map(e=>e.id),r=new FormData;r.append("fecha",o),r.append("hora",n),r.append("usuarioId",t),r.append("servicios",c);try{const e="http://localhost:300/api/citas",t=await fetch(e,{method:"POST",body:r});(await t.json()).resultado&&Swal.fire({position:"center",icon:"success",title:"Se ha creado la cita",showConfirmButton:!1,timer:2500}).then(()=>{window.location.reload()})}catch(e){Swal.fire({icon:"error",title:"Oops...",text:"Hubo un error al guardar la cita"})}}document.addEventListener("DOMContentLoaded",(function(){iniciarApp()}));