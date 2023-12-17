const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
const moment = require('moment');

var currentDate = new Date();

const db = knex({
    client:'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '1234',
        database: 'liftou'
    }
})

const app = express();

let initialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(initialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(initialPath, "register.html"));
})

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;
    if( name.length == 0 || email.length == 0|| password.length == 0){
        res.json('Rellena todos los campos');
    } else {
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('Este id ya ha sido registrado. Por favor inserta el id que te ha sido proporcionado.');
            }
        })
    }
})

app.post('/login-user', (req, res)=>{
    const { email, password } = req.body;

    db.select('name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if(data.length){
            
            res.json(data[0]);
            
        } else{
            res.json('contraseña o id incorrecto')
        }    
        })
})

app.get('/api/data', (req, res) => {
    // Aquí puedes utilizar el objeto 'db' para realizar consultas a la base de datos y obtener los datos que necesitas.
    // Luego, envía los datos como respuesta en formato JSON.
    db.select('*')
    .from('users')
    .join('stats', 'users.id', '=' , 'stats.id')
    .where('stats.date', currentDate)
    .then(data => {
    if(data.length){
      res.json(data);
    } else{
        console.log("Todavía no se han registrado datos de hoy.")
    }
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Todavía no se han registrado datos de hoy.' });
    });
  });
  

  app.get('/api/week-data', (req, res) => {
    const today = moment(); // Obtiene la fecha actual

    // Calcula el inicio y fin de la semana actual
    const monday = today.clone().startOf('isoWeek'); // Lunes de la semana actual
    const sunday = today.clone().endOf('isoWeek'); // Domingo de la semana actual
    // Realiza una consulta a la base de datos para obtener los datos de la semana actual
    db.select('*')
    .from('stats')
    .join('users', 'users.id', '=', 'stats.id')
    .whereBetween('stats.date', [monday.format('YYYY-MM-DD'), sunday.format('YYYY-MM-DD')])
    .orderBy('stats.date', 'asc')
    .then(data => {
        if(data.length){
            res.json(data);
        } else {
            console.log("No se encontraron datos para la semana actual.");
            res.status(404).json({ error: 'No se encontraron datos para la semana actual.' });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener datos de la semana actual.' });
    });
});


app.listen(3000, (req, res)=>{
    console.log('listening on port 3000.......')
})