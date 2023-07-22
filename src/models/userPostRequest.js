import mongoose from 'mongoose'
import { PostAvailableTimeSchema } from './posts.js'

const UserPostRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    time: {
      type: PostAvailableTimeSchema,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'userPostRequests' }
)

const UserPostRequest = mongoose.model(
  'UserPostRequests',
  UserPostRequestSchema
)

export default UserPostRequest
