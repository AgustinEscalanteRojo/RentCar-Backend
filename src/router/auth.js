import express from 'express'

const router = express.Router()

// Ruta para el inicio de sesión
router.post('/login', async (request, response) => {
    try {
      const token = await login(request.body) // Llama a la función login del controlador de autenticación
      response.json(token)
    } catch (e) {
      response.status(500).json(e.message)
    }
  })
  
  // Ruta para el registro de usuarios
  router.post('/signup', async (request, response) => {
    try {
      const token = await signup(request.body) // Llama a la función signup del controlador de autenticación
      response.json(token)
    } catch (e) {
      response.status(500).json(e.message)
    }
  })
  
  // Ruta para la sincronización del rover
  router.get('/syncRover', async (request, response) => {
    try {
      const result = await getRover() // Llama a la función getRover del servicio de rover para obtener los datos del rover
      response.json({ result })
    } catch (e) {
      response.status(404).json(e.message)
    }
  })
  
  export default router