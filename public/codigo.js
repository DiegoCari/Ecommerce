let productos = [];
fetch("/productos")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    cargarProductos(productos);
  });
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");
botonesCategorias.forEach((boton) =>
  boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
  })
);
function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";
  productosElegidos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

    contenedorProductos.append(div);
  });
  actualizarBotonesAgregar();
}
botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");
    if (e.currentTarget.id != "todos") {
      const productoCategoria = productos.find(
        (producto) => producto.categoria_id === e.currentTarget.id
      );
      tituloPrincipal.innerText = productoCategoria.categoria_nombre;
      const productosBoton = productos.filter(
        (producto) => producto.categoria_id === e.currentTarget.id
      );
      cargarProductos(productosBoton);
    } else {
      tituloPrincipal.innerText = "Todos los productos";
      cargarProductos(productos);
    }
  });
});
function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");
  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}
let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}
function agregarAlCarrito(e) {
  
  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find(
    (productos) => productos.id == idBoton
  );
    console.log(idBoton)
  const index = productosEnCarrito.findIndex(
    (productos) => productos.id === idBoton
  );

  if (index !== -1) {
    productosEnCarrito[index].cantidad++; // Aumentar cantidad si el producto ya existe
  } else {
    // Si el producto no existe en el carrito, agregarlo con cantidad 1
    const nuevoProductoEnCarrito = { ...productoAgregado, cantidad: 1};
    productosEnCarrito.push(nuevoProductoEnCarrito);
  }
  
  actualizarNumerito();
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );

}
function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numerito.innerText = nuevoNumerito;
}