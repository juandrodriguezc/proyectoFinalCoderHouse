const agregar = async (pid) => {
    let h3Usuario = document.getElementById("h3Usuario");
    let cid = h3Usuario.dataset.carrito;
    console.log('esto es pid y cid', pid, cid);

    let respuesta = await fetch(`/api/carts/${cid}/productos/${pid}`, {
        method: "POST"
    });

    let datos = await respuesta.json();
    console.log(datos);
    if (respuesta.ok) {
        alert("Producto agregado al carrito...!!!");
    } else {
        alert(datos.error);
    }
};
