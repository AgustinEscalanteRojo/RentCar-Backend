import express from 'express'
import {
  getUsers,
  getUserById,
  removeUserById,
} from '../controllers/user.js'

const router = express.Router()

router.get('/users', async (request, response) => {
  try {
    const users = await getUsers(request.user)
    response.json({ users })
  } catch (error) {
    response.status(500).json(error.message)
  }
})

router.get('/users/:id', async (request, response) => {
  try {
    const user = await getUserById(request.params.id)
    response.json({ user })
  } catch (error) {
    if (error.message === 'User not found') {
      response.status(404).json(error.message)
    }
    response.status(500).json(error.message)
  }
})

// ruta para borrar por Id 

router.delete('/users/:id', async (request, response) => {
  try {
    await removeUserById(request.params.id)
    response.json({ removed: true })
  } catch (error) {
    response.status(500).json(error.message)
  }
})

// ruta para valoraciones 

router.post('/valorations/:postId', async (request, response) => {
  try {
    await addRatingToPostByUser({
      postId: request.params.postId,
      user: request.user,
      data: request.body,
    })
    response.json(true)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

export default router
