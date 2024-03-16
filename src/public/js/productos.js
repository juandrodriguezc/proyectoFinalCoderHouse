const socket=io()

socket.on("nuevoProducto", datos=>{
    console.log(datos)
    let ulProductos=document.getElementById("productos") 
    ulProductos.innerHTML+=`<li>${datos.nombre} - ${datos.precio}$</li>`})
