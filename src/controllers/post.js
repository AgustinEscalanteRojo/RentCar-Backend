import Post from '../models/post.js'
import UserPostComment from '../models/user_post_comment.js'

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getPostById = async (id) => {
  const post = await Post.findOne({ _id: id })

  if (!post) {
    throw new Error('Post not found')
  }

  const postComments = await UserPostComment.find({
    postId: post._id,
  })

  return { ...post.toObject(), comment: postComments }
}

/**
 * @returns {Promise<object>}
 */
export const getPosts = async () => {
  return Post.find()
}

/**
 * @param {object} data
 * @param {string} data.name
 * @param {"car", "moto", "van"} data.type
 * @param {string} data.model
 * @param {string} data.plateNumber
 * @param {string} data.km
 * @param {string} data.carSeat
 * @param {"gas", "electric", "hybrid"} data.fuelType
 * @param {"manual", "automatic"} data.gearBoxType
 * @param {string} data.style
 * @param {string} data.sellerId
 */
export const createPost = async ({
  name,
  type,
  model,
  plateNumber,
  km,
  carSeat,
  fuelType,
  gearBoxType,
  style,
  sellerId,
}) => {
  if (!name || !model || !plateNumber || !km || !sellerId) {
    throw new Error('Missing required fields')
  }

  const existPost = await Post.findOne({ name, type, sellerId })
  if (existPost) {
    throw new Error('This post already exist')
  }

  const validPostType = ['car', 'moto', 'van']
  if (!validPostType.includes(type)) {
    throw new Error('This is not valid type')
  }

  const validFuelType = ['gas', 'electric', 'hybrid']
  if (fuelType && !validFuelType.includes(fuelType)) {
    throw new Error('Invalid fuel type')
  }

  const validGearBoxType = ['manual', 'automatic']
  if (gearBoxType && !validGearBoxType.includes(gearBoxType)) {
    throw new Error('Invalid gear box type')
  }

  const validStyle = ['4x4', 'minivan', 'sports']
  if (style && !validStyle.includes(validStyle)) {
    throw new Error('Invalid style')
  }

  const post = new Post({
    name,
    type,
    model,
    plateNumber,
    km,
    carSeat,
    fuelType,
    gearBoxType,
    style,
    sellerId,
  })
  return post.save()
}

// verifica si un usuario tiene los permisos adecuados para actualizar un post
/**
 * @param {string} id
 * @param {object} data
 * @param {object} user
 * @return {Promise<object>}
 */
export const updatePost = async (id, data, user) => {
  const post = await getPostById(id)

  if (
    post.sellerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error('This post can only be edited by its author')
  }

  await Post.findOneAndUpdate({ _id: id }, data)

  return getPostById(id)

  // await post.save()

  // return post

}

// vendedor como el administrador puedan borrar el post
/**
 * @param {string} id
 * @param {string} sellerId
 * @param {object} user
 * @param {string} user._id
 * @param {'admin' | 'seller' | 'customer'} user.rol
 * @returns {Promise<boolean>}
 */
export const deletePostById = async (id, user) => {
  const post = await getPostById(id)

  if (
    post.sellerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error('You do not have permission to delete this post')
  }

  await Post.deleteOne({ _id: id })

  return true
}
