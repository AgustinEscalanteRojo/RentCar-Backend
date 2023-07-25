import express from 'express'
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePostById,
  togglePostFavByUser,
  createPostCommentByUser,
  deletePostCommentByUser,
  addRatingToPostByUser,
  createPostRequestByUser,
  updateRequestStatusBySeller,
} from '../controllers/post.js'

const router = express.Router()

// Get all posts route
router.get('/', async (request, response) => {
  try {
    const posts = await getPosts(request.query)
    response.json({ posts })
  } catch {
    response.status(500).json('Something has gone wrong')
  }
})

// Ruta para obtener por ID
router.get('/:id', async (request, response) => {
  try {
    const post = await getPostById(request.params.id)
    response.json({ post })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Ruta para crear
router.post('/', async (request, response) => {
  try {
    const createdPost = await createPost({
      data: {
        ...request.body,
        sellerId: request.user._id,
      },
      user: request.user,
    })
    response.json({ post: createdPost })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Ruta para actualizar por ID
router.put('/:id', async (request, response) => {
  try {
    const updatedPost = await updatePost({
      id: request.params.id,
      data: request.body,
      user: request.user,
    })
    response.json(updatedPost)
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Ruta para eliminar por ID
router.delete('/:id', async (request, response) => {
  try {
    await deletePostById({ postId: request.params.id, user: request.user })
    response.json({ removed: true })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// ruta para favoritos
router.post('/:id/favs', async (request, response) => {
  try {
    await togglePostFavByUser(request.params.id, request.user)
    response.json(true)
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Comment post route
router.post('/:postId/comments', async (request, response) => {
  try {
    await createPostCommentByUser({
      postId: request.params.postId,
      data: request.body,
      user: request.user,
    })

    response.json(true)
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Delete comments route
router.delete('/comments/:commentId', async (request, response) => {
  try {
    await deletePostCommentByUser({
      commentId: request.params.commentId,
      user: request.user,
    })
    response.json(true)
  } catch (error) {
    console.log(error)
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

// Request route
router.post('/:postId/request', async (request, response) => {
  try {
    await createPostRequestByUser({
      postId: request.params.postId,
      data: request.body,
      user: request.user,
    })
    response.json(true)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

// Update request route
router.put('/:requestId/request', async (request, response) => {
  try {
    await updateRequestStatusBySeller({
      requestId: request.params.requestId,
      data: request.body,
      user: request.user,
    })
    response.json(true)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

export default router
