const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) =>{
    res.send('Respuesta de raiz')
})

app.get('/contacto', (req, res) =>{
    res.send('Respuesta desde Contacto')
})


app.listen(port, () =>{
    console.log('Servidor Escuchando: ', port)
})