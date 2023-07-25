import Post from '../models/post.js'
import User from '../models/user.js'
import UserPostRequest from '../models/userPostRequest.js'

// Get all users controller (only admin)
/**
 * @returns {Promise<object>}
 */

export const getUsers = async (user) => {
  if (!user || user.rol !== 'admin') {
    throw new Error('You dont have permission')
  }
  return User.find()
}

// Get user by id controller
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

// Delete user by id controller (only admin)
/**
 * @param {string} id
 * @param {object} user
 * @param {'admin' | 'seller' | 'customer'} user.rol
 * @returns {Promise<boolean>}
 */
export const removeUserById = async (id, user) => {
  if (!user || user.rol !== 'admin') {
    throw new Error('You dont have permission')
  }
  await User.deleteOne({ _id: id })

  return true
}

export const getRequestByUser = async (user) => {
  if (user.rol === 'customer') {
    return UserPostRequest.find({
      customerId: user._id,
    })
  }

  const sellerPosts = await Post.find({
    sellerId: user._id,
  })

  const postsIds = sellerPosts.map((sellerPost) => sellerPost._id)
  return UserPostRequest.find({
    postId: { $in: postsIds },
  })
}
