import express from 'express'
import { getUsers, removeUserById } from '../controllers/user.js'

const router = express.Router()

// Get all users route (only admin)
router.get('/', async (request, response) => {
  try {
    const users = await getUsers(request.user)
    response.json({ users })
  } catch (error) {
    response.status(500).json(error.message)
  }
})

// Delete user by id route (only admin)

router.delete('/:id', async (request, response) => {
  try {
    await removeUserById(request.params.id)
    response.json({ removed: true })
  } catch (error) {
    response.status(500).json(error.message)
  }
})

router.get('/me', async (request, response) => {
  try {
    response.json(request.user)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

router.get('/me/request', async (request, response) => {
  try {
    const postsRequests = await getRequestByUser(request.user)
    response.json(postsRequests)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

export default router
