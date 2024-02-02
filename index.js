const http = require ('http')
const port = 5000

const server = http.createServer((reg, res) => {
    res.end('Que onda alumnos')
})

server.listen(port, () =>{
    console.log('Servidor Trajando')
})