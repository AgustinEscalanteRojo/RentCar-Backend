import express from 'express'
import { login, signup } from '../controllers/auth.js'

const router = express.Router()

// Ruta para el inicio de sesión
router.post('/login', async (request, response) => {
  try {
    const token = await login(request.body) // Llama a la función login del controlador de autenticación
    response.json(token)
  } catch (e) {
    response.status(500).json(error.message)
  }
})

// Ruta para el registro de usuarios
router.post('/signup', async (request, response) => {
  try {
    const token = await signup(request.body) // Llama a la función signup del controlador de autenticación
    response.json(token)
  } catch (e) {
    response.status(500).json(error.message)
  }
})

export default router