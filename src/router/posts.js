import express from 'express'
import {
  getPosts,
  createPost,
  updatePost
} from '../controllers/posts.js'

const router = express.Router()

router.get('/', async (request, response) => {
  const post = await getPosts()

  response.json({ post })
})

router.get('/:id', async (request, response) => {
  try {
    const posts = await getPostById(request.params.id)
    response.json({ post })
  } catch (e) {
    if (e.message === 'Post not found') {
      response.status(404).json(e.message)
    }

    response.status(500).json('Algo ha salido mal')
  }
})

router.post('/', async (request, response) => {
  const createdPost = await createPost(request.body)
  response.json({ post: createdPost })
})

router.put('/:id', async (request, response) => {
  const updatedPost = await updatePost(request.params.id, request.body, request.user)
  response.json({ from: 'server', post: updatedPost })
})

router.delete('/:id', (request, response) => {
  removePostById(request.params.id)
  response.json({ removed: true })
})

export default router
