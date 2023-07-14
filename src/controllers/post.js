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
 * @param {"car", "moto", "van"} data.type
 * @param {string} data.model
 * @param {string} data.plateNumber
 * @param {string} data.km
 * @param {string} data.carSeat
 * @param {"gas", "electric", "hybrid"} data.fuelType
 * @param {"manual", "automatic"} data.gearBoxType
 * @param {string} data.style
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
}) => {
  if (!name || !model || !plateNumber || !km || !carSeat) {
    throw new Error('Missing required fields')
  }

  const existPost = await PostfinOne({ name, type, sellerId })
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
  if (validStyleType && !validStyle.includes(validStyleType)) {
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
  })
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
