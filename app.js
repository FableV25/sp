import express from 'express'
import cors from 'cors'
import { getProductos, getProducto, createProducto, deleteProducto, updateProducto, incrementarVentasPorNombres  } from './database.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const app = express()

// Configuración de CORS
app.use(cors({
    origin: '*', // Permite solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'], // Métodos permitidos
    allowedHeaders: ['Content-Type'] // Cabeceras permitidas
}))

app.use(express.static('public'));

app.use(express.json())

/*---------- CRUD de productos --------------*/
app.get("/Productos", async (req, res) => {
    const Productos = await getProductos()
    res.send(Productos)
})                                              // Get

app.get("/Productos/:id", async (req, res) => {
    const id = req.params.id
    const Producto = await getProducto(id)
    res.send(Producto)
})                                              // Get by id

app.post("/Productos", async (req, res) =>{
    const {NombreP, Descripcion, Precio, Marca, Categoria, Estado} = req.body
    const note = await createProducto(NombreP, Descripcion, Precio, Marca, Categoria, Estado)
    res.status(201).send("Producto registrado")
})                                              // Crear producto

// Actualizar un producto (PUT)
app.put("/Productos/:id", async (req, res) => {
    const id = req.params.id;
    const fields = req.body; // Campos a actualizar
    const wasUpdated = await updateProducto(id, fields);

    if (wasUpdated) {
        res.send(`Producto con id ${id} fue actualizado exitosamente`);
    } else {
        res.status(404).send(`Producto con id ${id} no encontrado o no se realizaron cambios`);
    }
});               // Actualizar producto

app.delete("/Productos/:id", async (req, res) => {
    const id = req.params.id
    const wasDeleted = await deleteProducto(id)
    if (wasDeleted) {
        res.send(`Producto con id ${id} fue eliminado exitosamente`)
    } else {
        res.status(404).send(`Producto con id ${id} no encontrado`)
    }
})                                              // Eliminar producto


// Incrementar ventas para productos específicos
app.patch("/Productos/IncrementarVentas", async (req, res) => {
    const { nombresProductos } = req.body;

    if (!nombresProductos || !Array.isArray(nombresProductos) || nombresProductos.length === 0) {
        return res.status(400).send("Debes proporcionar un array con los nombres de los productos.");
    }

    try {
        const filasActualizadas = await incrementarVentasPorNombres(nombresProductos);

        if (filasActualizadas > 0) {
            res.send(`${filasActualizadas} productos actualizados exitosamente.`);
        } else {
            res.status(404).send("No se encontraron productos con los nombres proporcionados.");
        }
    } catch (error) {
        console.error("Error al incrementar ventas:", error.message);
        res.status(500).send("Ocurrió un error al incrementar las ventas.");
    }
});

app.use((err, req, res, next) =>{
    console.error(err.stack)
    res.status(500).send('Algo se estropeo')
})                                              // Error

app.listen(8080, () =>{
    console.log('server is runing on port 8080')
})                                              // Puerto
/*---------- CRUD de inventario --------------*/

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'main.html')));
app.get('/ventas', (req, res) => res.sendFile(path.join(__dirname, 'ventas.html')));
app.get('/inv', (req, res) => res.sendFile(path.join(__dirname, 'inv.html')));

