const express = require('express')
import { initializeApp } from "firebase/app";
const app = express()
const port = 5000

//conexion a la base de datos en Firebaase

const firebaseConfig = {
  apiKey: "AIzaSyBNzJrKou5ZQV6DXnJd09hCU6hBAiCkhok",
  authDomain: "crud-practica1-6707b.firebaseapp.com",
  projectId: "crud-practica1-6707b",
  storageBucket: "crud-practica1-6707b.appspot.com",
  messagingSenderId: "260068706990",
  appId: "1:260068706990:web:61df83d911d4e2ffd07b3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

app.get('/', (req, res) =>{
    res.send('Respuesta de raiz')
})

app.get('/contacto', (req, res) =>{
    res.send('Respuesta desde Contacto')
})


app.listen(port, () =>{
    console.log('Servidor Escuchando: ', port)
})