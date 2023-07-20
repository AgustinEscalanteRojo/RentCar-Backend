import express from 'express'
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePostById,
} from '../controllers/post.js'

const router = express.Router()

// Get all
router.get('/', async (request, response) => {
  try {
    const post = await getPosts()
    response.json({ post })
  } catch {
    response.status(500).json('Something has gone wrong')
  }
})

// Ruta para obtener por ID
router.get('/:id', async (request, response) => {
  try {
    const posts = await getPostById(request.params.id)
    response.json({ posts })
  } catch (e) {
    if (e.message === 'Post not found') {
      response.status(404).json(error.message)
    }
    response.status(500).json('Something has gone wrong')
  }
})

// Ruta para crear
router.post('/', async (request, response) => {
  try {
    const createdPost = await createPost({...request.body, sellerId:request.user._id})
    response.json({ post: createdPost })
  } catch (e) {
    response.status(500).json(error.message)
  }
})

// Ruta para actualizar por ID
router.put('/:id', async (request, response) => {
  try {
    const updatedPost = await updatePost(
      request.params.id,
      request.body,
      request.user
    )
    response.json({ from: 'server', post: updatedPost })
  } catch (e) {
    response.status(500).json(error.message)
  }
})

// Ruta para eliminar por ID
router.delete('/:id', async (request, response) => {
  try {
    await deletePostById(request.params.id, request.user)
    response.json({ removed: true })
  } catch (e) {
    response.status(500).json(error.message)
  }
})

export default router
