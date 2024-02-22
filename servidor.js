import express from 'express'
import bcrypt, { hash } from 'bcrypt'
import cors from 'cors'
import 'dotenv/config'
import { initializeApp } from "firebase/app";
import {collection, doc, deleteDoc, getDocs, getDoc, getFirestore, setDoc, updateDoc} from 'firebase/firestore'

//conexion a la base de datos en Firebaase

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "crud-practica1-6707b.firebaseapp.com",
  projectId: "crud-practica1-6707b",
  storageBucket: "crud-practica1-6707b.appspot.com",
  messagingSenderId: "260068706990",
  appId: "1:260068706990:web:61df83d911d4e2ffd07b3f"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore()

//Cors options
const corsOptions = {
    origin : '*',
    optionsSuccessStatus : 200
}

const app = express()
app.use(express.json())
app.use(cors(corsOptions))
app.get('/', (_req, res) =>{
    res.send('Respuesta de raiz')
})

app.post('/signup', (req, res) => {
    const { nombre, apaterno, amaterno, telefono, usuario, password } = req.body
    console.log('@@ body => ', req.body)
    if(nombre.length < 3){
        res.json({ 'alerta': 'El nombre debe de tener minimo 3 letras'})
    }else if (!apaterno.length) {
        res.json({ 'alerta': 'El apaterno no puede ser vacio'})
    }else if (!usuario.length) {
        res.json({ 'alerta': 'El usuario no puede ser vacio'})
    }else if (!password.length) {
        res.json({ 'alerta': 'El password requiere 6 caracteres'})
    }else {
        //Guardar en la base de datos
        const usuarios = collection(db, 'usuarios')
        getDoc(doc(usuarios, usuario)).then(user => {
            if(user.exists()) {
                res.json({'alerta': 'Usuario ya existe'})
            }else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password,salt, (err, hash) => {
                        req.body.password = hash
                        
                        setDoc(doc(usuarios, usuario), req.body)
                            .then(registered => {
                                res.json({
                                    'alert': 'success',
                                    registered

                                })
                            })
                    })
                })
            }
        })
    }
})

app.post('/login', (req, res) => {
	const { usuario, password } = req.body

	if (!usuario.length || !password.length) {
		return res.json({
			'alerta': 'Algunos campos estan vacios'
		})
	}
	const usuarios = collection(db, 'usuarios')
	getDoc(doc(usuarios, usuario))
		.then(user => {
			if (!user.exists()) {
				res.json({
					'alerta': 'El usuario no existe'
				})
			} else {
				bcrypt.compare(password, user.data().password, (err, result) => {
					if (result) {
						let userFound = user.data()
						res.json({
							'alert': 'success',
							'usuario': {
								'nombre': userFound.nombre,
								'apaterno': userFound.apaterno,
								'amaterno': userFound.amaterno,
								'usuario': userFound.usuario,
								'telefono': userFound.telefono
							}
						})
					} else {
						res.json({
							'alerta': 'contraseñas no coinciden'
						})
					}
				})
			}
		})
})


app.get('/get-all', async (_req, res) => {
	const usuarios = collection(db, 'usuarios')
	const docsUsuarios = await getDocs(usuarios)
	const arrUsuarios = []
	docsUsuarios.forEach((usuario) => {
		const obj = {
			nombre: usuario.data().nombre,
			apaterno: usuario.data().apaterno,
			amaterno: usuario.data().amaterno,
			usuario: usuario.data().usuario,
			telefono: usuario.data().telefono
		}
		arrUsuarios.push(obj)
	})
	if (arrUsuarios.length > 0) {
		res.json({
			'alerta': 'success',
			'data': arrUsuarios
		})
	} else {
		res.json({
			'alerta': 'error',
			'message': 'No hay usuarios en la base de datos'
		})
	}
})

app.post('/delete-user', (req, res) => {
	const { usuario } = req.body
	deleteDoc(doc(collection(db, 'usuarios'), usuario.usuario))
	.then(data => {
		if (!data) {
			res.json({
				'alerta': 'Usuario fue borrado'
			})
		} else {
			res.json({
				'alerta': 'El usuario no existe en la base de datos'
			})
		}
	}).catch(err => {
		res.json({
			'alerta': 'Fallo',
			'message': err
		})
	})
})

app.post('/update-user', (req, res) => {
    const usuario = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(usuario.password, salt, (err, hash) => {
            if (err) {
                console.error('Error al encriptar la contraseña:', err);
                res.json({
                    'alerta': 'Fallo',
                    'message': 'Error al encriptar la contraseña'
                });
            } else {
                updateDoc(doc(db, 'usuarios', usuario.usuario), {
                    nombre: usuario.nombre,
                    apaterno: usuario.apaterno,
                    amaterno: usuario.amaterno,
                    telefono: usuario.telefono,
                    usuario: usuario.usuario,
                    password: hash
                })
                .then(data => {
                    res.json({
                        'alerta': 'success'
                    });
                })
                .catch(err => {
                    res.json({
                        'alerta': 'Fallo',
                        'message': err
                    });
                });
            }
        });
    });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Servidor Escuchando en el puerto:', port);
});
