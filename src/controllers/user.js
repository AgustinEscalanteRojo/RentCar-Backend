import User from '../models/user.js'
import { getPostById } from './post.js'
import UserPostComment from '../models/user_post_comment.js'

/**
 * @returns {Promise<object>}
 */

export const getUsers = async (user) => {
  if (!user || user.rol !== 'admin') {
    throw new Error('You dont have permission')
  }
  return User.find()
}

/**
 *
 * @param {string} id
 * @returns {Promise<object>}
 */

export const getUserById = async (id) => {
  const user = await User.findOne({ _id: id }).populate('favPosts')

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

/**
 *
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export const removeUserById = async (id) => {
  await User.deleteOne({ _id: id })

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
 * @param {string} data.rate
 * @param {object} user
 * @param {string} user._id
 * @returns {Promise<void>}
 */

export const addRatingToPostByUser = async ({postId, data, user}) => {
  if(!data.rate) {
    throw new Error ("missin require field ")
  }

  const formattedRate = Number(data.rate)
  if (isNan (formattedRate))  {
    throw new Error ("invalid field")
  }

  if(formattedRate < 0 || formattedRate > 5) {
    throw new Error ('invalid range')
  }

  const post = await getPostById(postId)

  const postRating = new UserPostValoration({
    customerId: user._id,
    postId: post._id,
    rate: formattedRate,
  })

  await postRating.save()

}