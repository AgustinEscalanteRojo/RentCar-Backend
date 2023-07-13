import Post from '../models/post.js'

/**
 * @param {string} id
 * @return {{name: string, id: string}}
 */
export const getPostById = async (id) => {
  const post = await Post.findOne({ _id: id })

  if (!post) {
    throw new Error('Post not found')
  }

  return post
}

/**
 * @return {[{name: string},{name: string},{name: string}]}
 */
export const getPosts = async () => {
  return Post.find()
}

/**
 * @param {object} data
 * @param {string} data.name
 * @return {*}
 */
export const createPost = async ({ name }) => {
  const post = new Post({ name })

  return post.save()
}

// verifica si un usuario tiene los permisos adecuados para actualizar un post
/**
 * @param {string} id
 * @param {object} data
 * @return {*&{id}}
 */
export const updatePost = async (id, data, user) => {
  const post = await getPostById(id)
  if (post.sellerId !== user._id && user.rol !== 'admin') {
    throw new Error('este no es tu post')
  }
  await Post.findOneAndUpdate({ _id: id }, data)

  return getPostById(id)
}

// vendedor como el administrador puedan borrar el post
/**
 * @param {string} id
 * @param {object} user
 * @return {boolean}
 */
export const deletePostById = async (id, user) => {
  const post = await getPostById(id)
  if (post.sellerId !== user._id && user.rol !== 'admin') {
    throw new Error('No tienes permiso para borrar este post')
  }
  await Post.deleteOne({ _id: id })
  return true
}

