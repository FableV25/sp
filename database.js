import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
  }).promise()

  /*------------------------------- Producto --------------------------------*/
  

  export async function getProductos(){
    const [rows] = await pool.query("SELECT * FROM Producto")
    return rows
  }                   // Todo en Producto  
                                                                                     
  
  export async function getProducto(id) {
    const [rows] = await pool.query('SELECT * FROM Producto WHERE idProducto = ?', [id]);
    return rows[0];
  }                   // Producto by ID

export async function createProducto(NombreP, Descripcion, Precio, Marca, Categoria, Estado){
  const result = await pool.query('INSERT INTO Producto (NombreP, Descripcion, Precio, Marca, Categoria, Estado) VALUES (?,?,?,?,?,?)', 
    [NombreP, Descripcion, Precio, Marca, Categoria, Estado])
    const id = result.insertId
    return getProducto(id)
}                     // Crear Producto 
  
// Actualizar un producto (nueva función)
export async function updateProducto(id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return false; // No hay campos para actualizar

  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const query = `UPDATE Producto SET ${setClause} WHERE idProducto = ?`;

  const [result] = await pool.query(query, [...values, id]);
  return result.affectedRows > 0;
}                    // Actualizar

export async function deleteProducto(id) {
  const [rows] = await pool.query('DELETE FROM Producto WHERE idProducto = ?', [id]);
  return rows.affectedRows > 0; // Returns true if a row was deleted, false otherwise
}                     // borrar



// Función para incrementar la columna "vendidosp" en base a los nombres de los productos
export async function incrementarVentasPorNombres(nombresProductos) {
  if (!Array.isArray(nombresProductos) || nombresProductos.length === 0) {
    throw new Error('Se debe proporcionar un array con los nombres de los productos.');
  }

  // Generamos una consulta para actualizar todos los productos
  const query = `
    UPDATE Producto 
    SET vendidosp = vendidosp + 1 
    WHERE NombreP IN (${nombresProductos.map(() => '?').join(', ')})
  `;

  // Ejecutamos la consulta con los nombres como parámetros
  const [result] = await pool.query(query, nombresProductos);

  return result.affectedRows; // Devolvemos el número de filas afectadas
}


