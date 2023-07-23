import Post from '../models/post.js'
import User from '../models/user.js'
import UserPostComment from '../models/userPostComment.js'
import UserPostRequest from '../models/userPostRequest.js'
import UserPostValoration from '../models/userPostValoration.js'
import { validatePostAvailableTimesData } from '../utils/post.js'

/**
 * @returns {Promise<object[]>}
 */
// Función para obtener todos los posts
export const getPosts = async () => {
  return Post.find()
}

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
    rating: rating / valorations,
    requests: postRequests,
  }
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
 * @param {object} data.availableTimes
 * @return {Promise<object>}
 */
export const createPost = async (
  {
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
    availableTimes,
  },
  user
) => {
  if (user.rol === 'customer') {
    throw new Error('You dont have permission to create')
  }

  if (!name || !model || !plateNumber || !sellerId) {
    throw new Error('Missing required fields')
  }

  const existPost = await Post.findOne({ name, type, sellerId })
  if (existPost) {
    throw new Error('This post already exist')
  }

  const validPostType = ['car', 'moto', 'van']
  if (type && !validPostType.includes(type)) {
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

  if (availableTimes) {
    validatePostAvailableTimesData(availableTimes)
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
    availableTimes,
  })
  return post.save()
}

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
    availableTimes,
  } = data

  const post = await Post.findOne({ _id: id })
  if (!post) {
    throw new Error('Post not found')
  }

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

  if (availableTimes) {
    validatePostAvailableTimesData(availableTimes)

    post.availableTimes = availableTimes
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
  if (user.rol === 'seller') {
    throw new Error('You can post a comment')
  }

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

// Función para agregar una valoración a un post por parte de un usuario
export const addRatingToPostByUser = async ({ postId, data, user }) => {
  if (user.rol === 'seller') {
    throw new Error('You cant post ratings')
  }

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

  const hasRate = await UserPostValorations.findOne({
    customerId: user._id,
    postId: post._id,
  })

  if (hasRate) {
    throw new Error('You already rate this post!')
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
 *
 * @param {string} postId
 * @param {object} data
 * @param {string} data.status
 * @param {object[]} data.time
 * @param {'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'} data.time.weekDay
 * @param {object[]} data.time.timing
 * @param {Date} data.time.timing.start
 * @param {Date} data.time.timing.end
 */

export const createPostRequestByUser = async ({ postId, data, user }) => {
  if (!postId || !data.weekDay) {
    throw new Error('Missing some fields')
  }

  const post = await getPostById(postId)

  if (!post.availableTimes.includes(data.weekDay)) {
    throw new Error(`This ${data.weekDay} is not available to this post`)
  }

  const isRequested = await UserPostRequest.findOne({
    postId: post._id,
    weekDay: data.weekDay,
    createdAt: {
      $gte: startOfDay(new Date()),
      $lte: endOfDay(new Date()),
    },
    status: 'approved',
  })

  if (isRequested) {
    throw new Error('The date is already booked')
  }

  const postRequest = new UserPostRequest({
    postId: post._id,
    customerId: user._id,
    status: data.status,
    time: data.availableTime,
  })

  await postRequest.save()
}

// Función para actualizar el estado de una solicitud de post por parte del vendedor
export const updateRequestStatusBySeller = async ({ data, requestId }) => {
  const postRequest = await UserPostRequest.findOne({ _id: requestId })

  if (data.status) {
    if (data.status === 'approved') {
      const sameRequestDay = await UserPostRequest.find({
        _id: { $not: postRequest._id },
        weekDay: postRequest.weekDay,
        postId: postRequest.postId,
        createdAt: {
          $gte: startOfDay(postRequest.createdAt),
          $lte: endOfDay(postRequest.createdAt),
        },
      })

      const sameRequestIds = sameRequestDay.map((request) => request._id)
      if (sameRequestIds.length > 0) {
        await UserPostRequest.updateMany(
          { _id: { $in: sameRequestIds } },
          { status: 'rejected' }
        )
      }
    }

    postRequest.status = data.status
  }

  await postRequest.save()

  return postRequest
}
