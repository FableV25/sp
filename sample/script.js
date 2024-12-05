document.getElementById("product-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const NombreP = document.getElementById("NombreP").value;
    const Descripcion = document.getElementById("Descripcion").value;
    const Precio = document.getElementById("Precio").value;
    const Marca = document.getElementById("Marca").value;
    const Categoria = document.getElementById("Categoria").value;
    const Estado = document.getElementById("Estado").value;

    const response = await fetch("/Productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NombreP, Descripcion, Precio, Marca, Categoria, Estado })
    });

    if (response.ok) {
        alert("Producto registrado");
        loadProducts();
    }
});

async function loadProducts() {
    const response = await fetch("/Productos");
    const products = await response.json();
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";
    products.forEach(product => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <h3>${product.NombreP}</h3>
            <p>${product.Descripcion}</p>
            <p>Precio: $${product.Precio}</p>
            <p>Marca: ${product.Marca}</p>
            <p>Categoría: ${product.Categoria}</p>
            <p>Estado: ${product.Estado}</p>
            <button onclick="deleteProduct(${product.id})">Eliminar</button>
        `;
        productsDiv.appendChild(div);
    });
}

async function deleteProduct(id) {
    const response = await fetch(`/Productos/${id}`, {
        method: "DELETE"
    });
    if (response.ok) {
        alert(`Producto con id ${id} fue eliminado exitosamente`);
        loadProducts();
    }
}

window.onload = loadProducts;
