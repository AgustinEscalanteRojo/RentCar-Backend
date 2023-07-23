import mongoose from 'mongoose'

const userPostValorationSchema = new mongoose.Schema(
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
    rate: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'userPostValorations' }
)

const UserPostValorations = mongoose.model(
  'UserPostValorations',
  userPostValorationSchema
)

export default UserPostValorations
