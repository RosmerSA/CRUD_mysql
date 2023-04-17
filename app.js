// Creamos variables para obtener los módulos y permitir que se utilicen las
// funciones y métodos definidos en ellos

var express = require('express');
var mysql = require('mysql');
var cors = require('cors');

// usamos esta variable para acceder a los métodos de express de manera mas sencilla
var app = express();
app.use(express.json());
app.use(cors());

// RUTAS
const api = "/api/articulos";

// Establecemos los parametros de conexión
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'articulosdb'
});

// probamos la conexión 
connection.connect(function(error){
  if(error) {
    throw error;
  } else {
    console.log("¡Conexión exitosa a la base de datos!");
  }
});

app.get('/', function(req, res){
  res.send('Ruta INICIO');
});

// CREAREMOS LOS MÉTODOS PARA MOSTRAR TODOS LOS ARTÍCULOS
app.get(api, (req, res)=> {
  connection.query('SELECT * FROM articulos', (error, filas)=> {
    if(error) {
      throw error;
    } else {
      res.send(filas);
    }
  }); 
});

// MOSTRAR UN SOLO ARTÍCULO
app.get(`${api}/:id`, (req, res)=> {
  connection.query('SELECT * FROM articulos WHERE id = ?',[req.params.id], (error, fila)=> {
    if(error) {
      throw error;
    } else {
      res.send(fila);
    }
  }); 
});

// CREAR ARTICULOS 

app.post(`${api}`, (req, res)=> {
  let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
  let sql = 'INSERT INTO articulos SET ?'
  connection.query(sql, data, function(error, results){
    if(error) {
      throw error;
    } else {
      res.send(results);
    }
  }); 
});

// EDITAR ARTICULOS

app.put(`${api}/:id`, (req, res)=> {
  let id = req.params.id;
  let descripcion = req.body.descripcion;
  let precio = req.body.precio;
  let stock = req.body.stock;
  let sql = 'UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?';
  connection.query(sql, [descripcion, precio, stock, id], function(error, results){
    if(error) {
      throw error;
    } else {
      res.send(results);
    }
  });
});

// ELIMINAR ARTICULOS 

app.delete(`${api}/:id`, (req, res)=> {
  connection.query('DELETE FROM articulos WHERE id = ?', [req.params.id], function(error, filas){
    if (error) {
      throw error;
    } res.send(filas);
  });
});

const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function() {
  console.log("Servidor Ok en puerto: " + puerto);
});