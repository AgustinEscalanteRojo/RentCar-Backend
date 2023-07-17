import Post from '../models/post.js'

/**
 * @param {string} id
 * @return {Promise<object>}
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
 * @param {"car", "moto", "van"} data.type
 * @param {string} data.model
 * @param {string} data.plateNumber
 * @param {string} data.km
 * @param {string} data.carSeat
 * @param {"gas", "electric", "hybrid"} data.fuelType
 * @param {"manual", "automatic"} data.gearBoxType
 * @param {string} data.style
 * @param {string} data.sellerId
 * @return {*}
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
  sellerId
}) => {
  if (!name || !model || !plateNumber || !km || !carSeat || !sellerId) {
    throw new Error('Missing required fields')
  }

  const existPost = await Post.findOne({ name, type, sellerId })
  if (existPost) {
    throw new Error('This post already exist')
  }

  // const validPostType = ['car', 'moto', 'van']
  // if (!validPostType.includes(type)) {
  //   throw new Error('This is not valid type')
  // }

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
    sellerId
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
 * @return {Promise<boolean>}
 */
export const deletePostById = async (id, user) => {
  const post = await getPostById(id)
  console.log({userId: user._id, sellerId: post.sellerId})
  if (post.sellerId.toString() !== user._id.toString() && user.rol !== 'admin') {
    throw new Error('No tienes permiso para borrar este post')
  }
  await Post.deleteOne({ _id: id })
  return true
}
