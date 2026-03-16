// =============================
// ABRIR / CERRAR SECCIONES MENU
// =============================
function toggleMenu(titulo){

const seccion = titulo.nextElementSibling;
if(!seccion) return;

seccion.style.display =
seccion.style.display === "block" ? "none" : "block";

}


// =============================
// ACTIVAR / DESACTIVAR CANTIDAD
// =============================
function toggleCantidad(checkbox){

const item = checkbox.closest(".item");
if(!item) return;

const cantidad = item.querySelector(".cantidad");
if(!cantidad) return;

if(checkbox.checked){

cantidad.disabled = false;

if(cantidad.value == 0){
cantidad.value = 1;
}

}else{

cantidad.value = 0;
cantidad.disabled = true;

}

calcularTotal();

}


// =============================
// MOSTRAR DESCRIPCION
// =============================
function toggleDescripcion(checkbox){

setTimeout(()=>{

const item = checkbox.closest(".item");
if(!item) return;

const descripcion = item.querySelector(".descripcion");
if(!descripcion) return;

descripcion.style.display =
checkbox.checked ? "block" : "none";

},10);

}


// =============================
// CALCULAR TOTAL
// =============================
function calcularTotal(){

let total = 0;

document.querySelectorAll(".check-plato").forEach(cb => {

if(!cb.checked) return;

const item = cb.closest(".item");
if(!item) return;

const cantidad = Number(item.querySelector(".cantidad")?.value) || 0;

let precio = 0;

// leer precio del SELECT (peceras)
const select = item.querySelector(".sabor");
if(select && select.value && !isNaN(select.value)){
precio = Number(select.value);
}

// si no hay select usar el span
if(!precio){
const span = item.querySelector("span");
if(span){
precio = Number(span.innerText.replace(/\$|\.|,/g,""));
}
}

if(!isNaN(precio)){
total += precio * cantidad;
}

});

const totalElemento = document.getElementById("total");
if(totalElemento){
totalElemento.innerText =
"$" + total.toLocaleString("es-CO");
}

const totalPedido = document.getElementById("totalPedido");
if(totalPedido){
totalPedido.value = total;
}

}


// =============================
// CONFIGURACION AL CARGAR
// =============================
document.addEventListener("DOMContentLoaded",function(){

document.querySelectorAll(".menu-section .platos")
.forEach(sec=>{
sec.style.display="none";
});

document.querySelectorAll(".cantidad").forEach(c=>{
c.disabled=true;
c.value=0;
});

document.querySelectorAll(".descripcion")
.forEach(d=>d.style.display="none");

});


// =============================
// CONTROL ENTREGA
// =============================
document.addEventListener("DOMContentLoaded",function(){

const tipoEntrega = document.getElementById("tipoEntrega");
const direccionField = document.getElementById("direccionField");
const mesaField = document.getElementById("mesaField");
const costoDomicilio = document.getElementById("costoDomicilio");

if(!tipoEntrega) return;

tipoEntrega.addEventListener("change",function(){

if(direccionField) direccionField.style.display="none";
if(mesaField) mesaField.style.display="none";
if(costoDomicilio) costoDomicilio.style.display="none";

if(this.value==="A domicilio"){
if(direccionField) direccionField.style.display="block";
if(costoDomicilio) costoDomicilio.style.display="block";
}

if(this.value==="Comer dentro del local"){
if(mesaField) mesaField.style.display="block";
}

});

});


// =============================
// CONTROL PAGOS
// =============================
document.addEventListener("DOMContentLoaded",function(){

const tipoPago = document.getElementById("tipoPago");

const infoPago = document.getElementById("infoPago");
const infoNequi = document.getElementById("infoNequi");
const efectivoField = document.getElementById("efectivoField");

if(!tipoPago) return;

tipoPago.addEventListener("change",function(){

if(infoPago) infoPago.style.display="none";
if(infoNequi) infoNequi.style.display="none";
if(efectivoField) efectivoField.style.display="none";

if(this.value==="Efectivo"){
if(efectivoField) efectivoField.style.display="block";
}

if(this.value==="Nequi"){
if(infoPago) infoPago.style.display="block";
if(infoNequi) infoNequi.style.display="block";
}

});

});


// =============================
// OBTENER PLATOS (CORREGIDO)
// =============================
function obtenerPlatos(){

let platos="";

document.querySelectorAll(".check-plato:checked").forEach(cb=>{

const item = cb.closest(".item");
if(!item) return;

const cant = Number(item.querySelector(".cantidad")?.value) || 0;
if(cant<=0) return;

let nombre = cb.value;

// leer proteína o precio del select
const select = item.querySelector(".sabor");
let extra="";

if(select && select.selectedIndex>0){
extra=" ("+select.options[select.selectedIndex].text+")";
}

platos+="• "+nombre+extra+" x"+cant+"\n";

});

return platos;

}


// =============================
// ENVIAR PEDIDO WHATSAPP
// =============================
document.addEventListener("DOMContentLoaded",function(){

const form=document.getElementById("pedidoForm");
if(!form) return;

let enviando=false;
let ultimoEnvio=0;

form.addEventListener("submit",function(e){

e.preventDefault();

const ahora=Date.now();

if(ahora-ultimoEnvio<5000) return;
if(enviando) return;

ultimoEnvio=ahora;
enviando=true;


// DATOS
const nombre=document.getElementById("nombre")?.value;
const telefono=document.getElementById("telefono")?.value;

const tipoEntrega=document.getElementById("tipoEntrega")?.value;
const direccion=document.getElementById("direccion")?.value;

const tipoPago=document.getElementById("tipoPago")?.value;
const efectivo=document.getElementById("efectivoCliente")?.value;

const especificaciones=document.getElementById("especificaciones")?.value;

const platos=obtenerPlatos();

if(!platos.trim()){
alert("Debes seleccionar al menos un plato");
enviando=false;
return;
}

const total=document.getElementById("totalPedido")?.value;

let totalTexto="";

if(total){
totalTexto=Number(total).toLocaleString("es-CO",{
style:"currency",
currency:"COP",
minimumFractionDigits:0
});
}


// MENSAJE
let mensaje="📦 Nuevo pedido recibido\n\n";

mensaje+="👤 Nombre: "+nombre+"\n\n";
mensaje+="📞 Número: "+telefono+"\n\n";

mensaje+="🍽️ Platos:\n"+platos+"\n";

if(tipoEntrega){
mensaje+="📦 Método: "+tipoEntrega+"\n\n";
}

if(direccion){
mensaje+="📍 Dirección: "+direccion+"\n\n";
}

if(tipoPago){
mensaje+="💳 Forma de Pago: "+tipoPago+"\n\n";
}

if(efectivo){
mensaje+="💵 Con cuánto paga: "+efectivo+"\n\n";
}

if(especificaciones){
mensaje+="📒 Especificaciones: "+especificaciones+"\n\n";
}

if(totalTexto){
mensaje+="💰 Total: "+totalTexto;
}


// WHATSAPP
const numero="573223101369";

const url=
"https://api.whatsapp.com/send?phone="+
numero+
"&text="+
encodeURIComponent(mensaje);

window.open(url,"_blank");

setTimeout(function(){
window.location.href = "gracias.html";
},1500);

});

});


// =============================
// FORZAR CIERRE DEL MENU
// =============================
document.addEventListener("DOMContentLoaded",function(){

document.querySelectorAll(".platos").forEach(seccion=>{
seccion.style.display="none";
});

});