let prodcutosEnCarrito = localStorage.getItem("productos-en-carrito");
prodcutosEnCarrito = JSON.parse(prodcutosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


function cargarProductosCarrito(){
    if(prodcutosEnCarrito && prodcutosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    

        contenedorCarritoProductos.innerHTML="";
    
        prodcutosEnCarrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-img" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                    
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                
                <button class="carrito-producto-eliminar" id="${producto.id}">
                    <i class="bi bi-trash"></i>
                </button>
            `;
    
            contenedorCarritoProductos.append(div);
            
        })
    
        actualizarBotonesEliminar();
        actualizarTotal();

    }else{
    
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
    }

}

cargarProductosCarrito();


function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        //        console.log('El ID del carrito es: ', boton.getAttribute('id'));
        boton.addEventListener("click", eliminarDelCarrito);
    })
  
}


function eliminarDelCarrito(e){

    //usando libreria toastify
    //alerta emergente de producto que se esta eliminando producto
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4518fa, #89b7eb)",
          borderRadius: "1rem",
          textTransform: "uppercase",
          fontSize: ".85rem"
        },
        offset: {
            x: "2rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();
    const idBoton = e.currentTarget.id;
    const index = prodcutosEnCarrito.findIndex(producto => producto.id === idBoton);

    prodcutosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(prodcutosEnCarrito));
}


botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito(){

    //usando libreria sweetAlert2
    //preguntando al usuario si desea vaciar todos los productos
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html:
        `Se van a borrar ${prodcutosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,//avisando la cantidad de productoa a eliminar del carrito
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:'Si',
        cancelButtonText:'No'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            prodcutosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(prodcutosEnCarrito));
            cargarProductosCarrito();
        } 
      })
}


function actualizarTotal(){

    const totalCalculado = prodcutosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;

}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito(){
    //    alert(`¡Gracias por su compra!`);
    prodcutosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(prodcutosEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}