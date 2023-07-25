import Post from '../models/post.js'
import User from '../models/user.js'
import UserPostComment from '../models/userPostComment.js'
import UserPostValorations from '../models/userPostValoration.js'
import UserPostRequest from '../models/userPostRequest.js'
import { validatePostAvailableTimesData } from '../utils/post.js'
import { startOfDay, endOfDay } from 'date-fns'

//Get all posts controller
/**
 * @return {Promise<object[]>}
 */
export const getPosts = async (filters) => {
  const filtersData = {}

  if (filters) {
    if (filters.type) {
      filtersData.type = filters.type
    }

    if (filters.fuelType) {
      filtersData.fuelType = filters.fuelType
    }

    if (filters.gearBoxType) {
      filtersData.gearBoxType = filters.gearBoxType
    }

    if (filters.style) {
      filtersData.style = filters.style
    }

    if (filters.name) {
      filtersData.name = {
        $regex: filters.name,
      }
    }

    if (filters.time) {
      filtersData.availableTimes = {
        $in: filters.time.split(','),
      }
    }
  }

  return Post.find(filtersData)
}

//Get post by id controller
/**
 * @param {string} id
 * @return {Promise<object>}
 */
export const getPostById = async (id) => {
  const post = await Post.findOne({ _id: id })

  if (!post) {
    throw new Error('Post not found')
  }

  const postValorations = await UserPostValorations.find({
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

  const totalValorations = postValorations.length

  const averageRating = totalValorations > 0 ? rating / totalValorations : 0

  return {
    ...post.toObject(),
    comments: postComments,
    rating: averageRating,
    requests: postRequests,
  }
}

//Create post controller
/**
 * @param {object} data
 * @param {string} data.name
 * @param {"car" | "motorcycle" | "van"} data.type
 * @param {string} data.model
 * @param {string} data.plateNumber
 * @param {number} data.km
 * @param {number} data.carSeats
 * @param {"gas" | "electric" } data.fuelType
 * @param {"manual" | "automatic" } data.gearBoxType
 * @param {string} data.description
 * @param {"4x4" | "coupé" | "sedan" | "compact" } data.style
 * @param {string} data.sellerId
 * @param {"oculto" | "activo"} data.status
 * @param {string} data.name
 * @param {object} data.availableTimes
 * @return {Promise<object>}
 */
export const createPost = async ({ data, user }) => {
  if (user.rol === 'customer') {
    throw new Error("You don't have permission")
  }
  const {
    name,
    type,
    model,
    plateNumber,
    km,
    carSeats,
    fuelType,
    gearBoxType,
    description,
    style,
    sellerId,
    status,
    availableTimes,
  } = data

  if (!name || !type || !plateNumber || !sellerId) {
    throw new Error('Missing required fields')
  }

  const validPostType = ['car', 'motorcycle', 'van']
  if (!validPostType.includes(type)) {
    throw new Error('This is not valid type ')
  }

  const existPost = await Post.findOne({ name, type, sellerId })
  if (existPost) {
    throw new Error('This post already exist!')
  }

  const validFuelType = ['gas', 'electric']
  if (fuelType && !validFuelType.includes(fuelType)) {
    throw new Error('invalid fuel type')
  }

  const validGearBoxType = ['manual', 'automatic']
  if (gearBoxType && !validGearBoxType.includes(gearBoxType)) {
    throw new Error('invalid gear box type')
  }

  const validStyle = ['4x4', 'coupé', 'sedan', 'compact']
  if (style && !validStyle.includes(style)) {
    throw new Error('invalid style')
  }

  const validStatus = ['oculto', 'activo']
  if (status && !validStatus.includes(status)) {
    throw new Error('invalid status')
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
    carSeats,
    fuelType,
    gearBoxType,
    description,
    style,
    sellerId,
    status,
    availableTimes,
  })

  return post.save()
}

//Update post controller
/**
 * @param {object} data
 * @param {string} data.name
 * @param {"car" | "motorcycle" | "van"} data.type
 * @param {string} data.model
 * @param {string} data.plateNumber
 * @param {number} data.km
 * @param {number} data.carSeats
 * @param {"gas" | "electric" } data.fuelType
 * @param {"manual" | "automatic" } data.gearBoxType
 * @param {string} data.description
 * @param {"4x4" | "coupé" | "sedan" | "compact" } data.style
 * @param {string} data.sellerId
 * @param {"oculto" | "activo"} data.status
 * @param {string} data.name
 * @return {Promise<object>}
 */
export const updatePost = async ({ id, data, user }) => {
  const {
    name,
    type,
    model,
    plateNumber,
    km,
    carSeats,
    fuelType,
    gearBoxType,
    description,
    style,
    status,
    availableTimes,
  } = data

  const post = await Post.findOne({ _id: id })
  if (!post) {
    throw new Error('Post not found')
  }

  if (availableTimes) {
    validatePostAvailableTimesData(availableTimes)
  }

  if (model) {
    post.model = model
  }

  if (km) {
    post.km = km
  }

  if (carSeats) {
    post.carSeats = carSeats
  }

  if (description) {
    post.description = description
  }

  if (
    post.sellerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error('you do not have permission')
  }

  if (name) {
    post.name = name
  }

  if (plateNumber) {
    post.plateNumber = plateNumber
  }

  const validPostType = ['car', 'motorcycle', 'van']
  if (type) {
    if (!validPostType.includes(type)) {
      throw new Error('This is not valid type ')
    } else {
      post.type = type
    }
  }

  const validFuelType = ['gas', 'electric']
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

  const validStyle = ['4x4', 'coupé', 'sedan', 'compact']
  if (style) {
    if (style && !validStyle.includes(style)) {
      throw new Error('invalid style')
    } else {
      post.style = style
    }
  }

  const validStatus = ['oculto', 'activo']
  if (status) {
    if (status && !validStatus.includes(status)) {
      throw new Error('invalid status')
    } else {
      post.status = status
    }
  }

  await post.save()

  return post
}

//Delete post controller
/**
 * @param {string} postId
 * @param {string} sellerId
 * @param {object} user
 * @param {string} user._id
 * @param {'admin' | 'seller' | 'customer'} user.rol
 * @returns {Promise<boolean>}
 */
export const deletePostById = async ({ postId, user }) => {
  const post = await getPostById(postId)

  if (
    post.sellerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error('No tienes permiso')
  }

  await Post.deleteOne({ _id: postId })

  return true
}

//Favorite post controller
/**
 * @param {string} postId
 * @param {object} user
 * @param {object[]} user.favPosts
 */
export const togglePostFavByUser = async (postId, user) => {
  if (!postId) {
    throw new Error('id is required')
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

// Create comment by user controller
/**
 * @param {string} postId
 * @param {object} user
 * @param {object} data
 */
export const createPostCommentByUser = async ({ postId, data, user }) => {
  if (user.rol === 'seller') {
    throw new Error("you can't post being a seller")
  }
  if (!data.comment) {
    throw new Error('missing require field')
  }

  const post = await getPostById(postId)
  const postComment = new UserPostComment({
    customerId: user._id,
    postId: post._id,
    comment: data.comment,
  })
  await postComment.save()
}

// Delete comment by user controller
/**
 * @param {string} commentId
 * @param {object} user
 * @param {'admin' | 'seller' | 'customer'} user.rol
 * @param {string} user._id
 * @returns {Promise<boolean>}
 */
export const deletePostCommentByUser = async ({ commentId, user }) => {
  const postComment = await UserPostComment.findOne({ _id: commentId })
  if (!postComment) {
    throw new Error('comment not found')
  }

  if (
    postComment.customerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error("you don't have permission")
  }

  await UserPostComment.deleteOne({ _id: commentId })
}

//Rating by user controller
/**
 * @param {string} postId
 * @param {object} user
 * @param {object} data
 * @param {object} data.rate
 * @param {string} user._id
 */
export const addRatingToPostByUser = async ({ postId, data, user }) => {
  if (user.rol === 'seller') {
    throw new Error("You can't rate posts being seller")
  }

  if (!data.rate) {
    throw new Error('missing require field')
  }

  const formattedRate = Number(data.rate)

  if (isNaN(formattedRate)) {
    throw new Error('invalid field')
  }

  if (formattedRate < 0 || formattedRate > 5) {
    throw new Error('invalid range')
  }

  const post = await getPostById(postId)

  const hasRate = await UserPostValorations.findOne({
    customerId: user._id,
    postId: post._id,
  })

  if (hasRate) {
    throw new Error('You already rate this post!')
  }

  const postRating = new UserPostValorations({
    customerId: user._id,
    postId: post._id,
    rate: data.rate,
  })
  await postRating.save()
}

// Add request
/**
 * @param {string} postId
 * @param {object} data
 * @param {string} data.status
 * @param {object} data.time
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
    weekDay: data.weekDay,
  })

  await postRequest.save()
}

// Update request
/**
 * @param {string} requestId
 * @param {object} data
 * @param {'approved | 'pending' | 'rejected' | 'canceled'} data.status
 */
export const updateRequestStatusBySeller = async ({
  data,
  requestId,
  user,
}) => {
  const postRequest = await UserPostRequest.findOne({ _id: requestId })

  if (!postRequest) {
    throw new Error('Post request not found')
  }

  if (
    user.rol === 'customer' &&
    user._id.toString() !== postRequest.customerId.toString()
  ) {
    throw new Error('You dont have permission')
  }

  if (user.rol === 'seller') {
    const post = await Post.find({ _id: postRequest.postId })
    if (post && post.sellerId && post.sellerId.toString() !== user._id) {
      throw new Error('You arent the author of the request')
    }
  }

  if (data.status) {
    if (data.status === 'approved') {
      const sameRequestDay = await UserPostRequest.find({
        _id: { $ne: postRequest._id },
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
