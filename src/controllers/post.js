import Post from '../models/post.js'
import User from '../models/user.js'
import UserPostComment from '../models/user_post_comment.js'
import UserPostRequest from '../models/user_post_request.js'
import UserPostValoration from '../models/user_post_valoration.js'
import { isValid } from 'date-fns'

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getPostById = async (id) => {
  const post = await Post.findOne({ _id: id })

  if (!post) {
    throw new Error('Post not found')
  }

  const postValorations = await UserPostValoration.find({
    postId: post._id,
  })

  const rating = postValorations.reduce((accumulator, current) => {
    return accumulator + current.rate
  }, 0)

  const postComments = await UserPostComment.find({
    postId: post._id,
  })

  const postRequests = await UserPostRequest.find({
    postId: post._id,
  })

  return {
    ...post.toObject(),
    comment: postComments,
    rating: rating / 5,
    requests: postRequests,
  }
}

/**
 * @returns {Promise<object[]>}
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
 * @param {object[]} data.availableTime
 * @param {'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'} data.availableTime.weekDay
 * @param {object[]} data.availableTime.timing
 * @param {Date} data.availableTime.timing.start
 * @param {Date} data.availableTime.timing.end
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
  availableTime,
}) => {
  if (
    !name ||
    !model ||
    !plateNumber ||
    !km ||
    !sellerId ||
    !availableTime.weekDay ||
    !availableTime.timing
  ) {
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

  const validWeekDay = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]
  if (!validWeekDay.includes(availableTime.weekDay)) {
    throw new Error('The day of the week is invalid')
  }

  if (
    !isValid(availableTime.timing.start) ||
    !isValid(availableTime.timing.end)
  ) {
    throw new Error('Your start time or end time for this request is invalid')
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
    availableTime,
  })
  return post.save()
}

// CONTINUAR MAÑANA POR AQUI

// verifica si un usuario tiene los permisos adecuados para actualizar un post
/**
 * @param {string} id
 * @param {object} data
 * @param {object} user
 * @param {object[]} data.availableTime
 * @param {'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'} data.availableTime.weekDay
 * @param {object[]} data.availableTime.timing
 * @param {Date} data.availableTime.timing.start
 * @param {Date} data.availableTime.timing.end
 * @return {Promise<object>}
 */
export const updatePost = async ({ id, data, user }) => {
  const {
    name,
    type,
    model,
    plateNumber,
    km,
    carSeat,
    fuelType,
    gearBoxType,
    style,
    availableTime,
  } = data

  const post = await getPostById(id)

  if (
    post.sellerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error('This post can only be edited by its author')
  }

  if (name) {
    post.name = name
  }

  if (model) {
    post.model = model
  }

  if (plateNumber) {
    post.plateNumber = plateNumber
  }

  if (km) {
    post.km = km
  }

  if (carSeat) {
    post.carSeat = carSeat
  }

  const validPostType = ['car', 'moto', 'van']
  if (type) {
    if (!validPostType.includes(type)) {
      throw new Error('This is not valid type ')
    } else {
      post.type = type
    }
  }

  const validFuelType = ['gas', 'electric', 'hybrid']
  if (fuelType) {
    if (fuelType && !validFuelType.includes(fuelType)) {
      throw new Error('invalid fuel type')
    } else {
      post.fuelType = fuelType
    }
  }

  const validGearBoxType = ['manual', 'automatic']
  if (gearBoxType) {
    if (gearBoxType && !validGearBoxType.includes(gearBoxType)) {
      throw new Error('invalid gear box type')
    } else {
      post.gearBoxType = gearBoxType
    }
  }

  const validStyle = ['4x4', 'minivan', 'sports']
  if (style) {
    if (style && !validStyle.includes(style)) {
      throw new Error('invalid style')
    } else {
      post.style = style
    }
  }

  await post.save()

  return post
}

// vendedor como el administrador puedan borrar el post
/**
 * @param {string} postId
 * @param {string} sellerId
 * @param {object} user
 * @param {string} user._id
 * @param {'admin' | 'seller' | 'customer'} user.rol
 * @returns {Promise<boolean>}
 */
export const deletePostById = async (postId, user) => {
  const post = await getPostById(postId)

  if (
    post.sellerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error('You do not have permission to delete this post')
  }

  await Post.deleteOne({ _id: id })

  return true
}

/**
 *
 * @param {string} postId
 * @param {object} user
 * @param {object[]} user.favPosts
 */

export const togglePostFavByUser = async (postId, user) => {
  if (!postId) {
    throw new Error('PostId is required')
  }
  const post = await getPostById(postId)
  const currentFavs = user.favPosts || []
  const existedFav = currentFavs.find(
    (currentId) => currentId.toString() === postId.toString()
  )

  let newFavList = []
  if (!existedFav) {
    newFavList = [...currentFavs, postId]
  } else {
    newFavList = currentFavs.filter(
      (currentId) => currentId.toString() !== postId.toString()
    )
  }

  await User.updateOne({ _id: user._id }, { favPosts: newFavList })
}

/**
 *
 * @param {string} postId
 * @param {object} data
 * @param {string} data.comment
 * @param {object} user
 * @param {string} user._id
 */

export const createPostCommentByUser = async ({ postId, data, user }) => {
  if (!data.comment) {
    throw new Error('Missing require field')
  }

  const post = await getPostById(postId)
  const postComment = new UserPostComment({
    postId: post._id,
    customerId: user._id,
    comment: data.comment,
  })

  await postComment.save()
}

/**
 *
 * @param {string} commentId
 * @param {object} user
 * @param {string} user._id
 * @param {'admin' | 'seller' | 'customer'} user.rol
 * @returns {Promise<boolean>}
 */

export const deletePostCommentByUser = async ({ commentId, user }) => {
  const postcomment = await UserPostComment.findOne({ _id: commentId })
  if (!postcomment) {
    throw new Error('Missing require field')
  }

  if (
    postcomment.customerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error(
      'This comment can only be deleted by its author or the admin'
    )
  }

  await UserPostComment.deleteOne({
    _id: commentId,
    customerId: user._id,
  })

  return true
}

// añadir ratio

/**
 * @param {string} postId
 * @param {object} data
 * @param {number} data.rate
 * @param {object} user
 * @param {string} user._id
 * @returns {Promise<void>}
 */

export const addRatingToPostByUser = async ({ postId, data, user }) => {
  if (!data.rate) {
    throw new Error('missin require field ')
  }

  const formattedRate = Number(data.rate)
  if (isNan(formattedRate)) {
    throw new Error('invalid field')
  }

  if (formattedRate < 0 || formattedRate > 5) {
    throw new Error('invalid range')
  }

  const post = await getPostById(postId)

  const postRating = new UserPostValoration({
    customerId: user._id,
    postId: post._id,
    rate: formattedRate,
  })

  await postRating.save()
}

// Add request & update request
/**
 * @param {string} postId
 * @param {object} data
 * @param {string} data.status
 * @param {object[]} data.time
 * @param {'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'} data.time.weekDay
 * @param {object[]} data.time.timing
 * @param {Date} data.time.timing.start
 * @param {Date} data.time.timing.end
 */
export const addPostRequestByUser = async ({ postId, data, user }) => {
  if (
    !data.status ||
    !data.time.weekDay ||
    !data.time.timing.start ||
    !data.time.timing.end
  ) {
    throw new Error('Missing some fields')
  }

  const validWeekDay = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]
  if (!validWeekDay.includes(data.time.weekDay)) {
    throw new Error('The day of the week is invalid')
  }

  if (!isValid(data.time.timing.start) || !isValid(data.time.timing.end)) {
    throw new Error('Your start time or end time for this request is invalid')
  }

  const post = await getPostById(postId)
  const postRequest = new UserPostRequest({
    postId: post._id,
    customerId: user._id,
    status: data.status,
    time: {
      weekDay: data.time.weekDay,
      timing: {
        start: data.time.timing.start,
        end: data.time.timing.end,
      },
    },
  })

  await postRequest.save()
}

export const updateRequestStatusBySeller = async ({
  postId,
  data,
  user,
  requestId,
}) => {
  const post = await getPostById(postId)
  const postRequest = await UserPostRequest.findOne({ _id: requestId })
  if (
    post.sellerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error('You dont have permission to edit this request')
  }

  if (data.status) {
    postRequest.status = data.status
  }

  await post.save()

  return post
}
