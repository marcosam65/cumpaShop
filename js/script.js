let productos = [];

fetch("./js/producto.json")
    .then(response => response.json())
    .then((data) => {
        productos = data;
        cargarProductos(prodcutos);
    })

    /*creando div para insertar productos en html*/
const contenedorProductos = document.querySelector("#contenedor-productos");
/*cambiando de menu active de ingreso a los siguientes botones de menu */
const botonesCategorias = document.querySelectorAll(".btn-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-carrito");
const numerito = document.querySelector("#numerito");


botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    MediaStreamAudioDestinationNode.classList.remove("aside-visible");
}));


function cargarProductos(productosElegidos){

    /*Dejando vacio el contenedor productos para cargarlos con el producto 
    o boton elegido */
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML =  `
            <img class="producto-img" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-carrito" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);

    })
       /*Actualizando botones agregar con una funcion */
    actualizarBotonesAgregar();
}





botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        
        /*con la siguiente linea movemos el active y pasa al siguiene boton */
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        
        /*currentTarger hace que el elemento active ocurra cuando
         agamos click en cualquier parte del boton*/
         e.currentTarget.classList.add("active");

         botonesCategorias.forEach(boton => boton.classList.remove("active"));
         e.currentTarget.classList.add("active");

        /*cargar productos por eleccion de boton menu con "cargarProductos(productosBoton);"
        o cargar todos los prodcutos con "cargarProductos(productos);"*/
        if(e.currentTarget.id != "todos"){

            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;

            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        }else{
            tituloPrincipal.innerText = "Todos los Productos";
            cargarProductos(productos);
        }

    })

});


/*Funcion para agregar productos al carrito */

function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".producto-carrito");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}



/*Condicional para agragar producto y numerito sin perder productos agregados */
let prodcutosEnCarrito;

let prodcutosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if(prodcutosEnCarritoLS){
    prodcutosEnCarrito = JSON.parse(prodcutosEnCarritoLS);
    actualizarNumerito();
}else{
    prodcutosEnCarrito = [];
}



function agregarAlCarrito(e){

    //usando libreria toastify
    //alerta emergente que se esta agregando producto al carrito
    Toastify({
        text: "Producto agregado",
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
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(prodcutosEnCarrito.some(producto => producto.id === idBoton)){
        const index = prodcutosEnCarrito.findIndex(producto => producto.id === idBoton);
        prodcutosEnCarrito[index].cantidad++;
    }else{
        productoAgregado.cantidad = 1;
        prodcutosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    /*almacenando producto en localstorage*/
    localStorage.setItem("productos-en-carrito", JSON.stringify(prodcutosEnCarrito));
}


/*Actualiazando cantidad de productos en carrito*/

function actualizarNumerito(){
    let nuevoNumerito = prodcutosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}