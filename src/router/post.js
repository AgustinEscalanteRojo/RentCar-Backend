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
  addPostRequestByUser,
  updateRequestStatusBySeller
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
      response.status(404).json(e.message)
    }
    response.status(500).json('Something has gone wrong')
  }
})

// Ruta para crear
router.post('/', async (request, response) => {
  try {
    const createdPost = await createPost({
      ...request.body,
      sellerId: request.user._id,
    }, 
    request.user
    )
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
    response.json({ from: 'server', post: updatedPost })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Ruta para eliminar por ID
router.delete('/:id', async (request, response) => {
  try {
    await deletePostById(request.params.id, request.user)
    response.json({ removed: true })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// ruta para favoritos
router.post('/favs/:postId', async (request, response) => {
  try {
    await togglePostFavByUser(request.params.postId, request.user)
    response.json(true)
  } catch (e) {
    response.status(500).json(e.message)
  }
})

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

router.delete('/:commentId', async (request, response) => {
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
router.post('/request/:postId', async (request, response) => {
  try {
    await addPostRequestByUser({
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
router.put('/request/:postId/:requestId', async (request, response) => {
  try {
    await updateRequestStatusBySeller(
      request.params.postId,
      request.body,
      request.user
    )
  } catch (error) {
    response.status(500).json(error.message)
  }
})

export default router
