import mongoose from 'mongoose'

const UserPostValorationSchema = new mongoose.Schema(
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

const UserPostValidation = mongoose.model(
  'UserPostValorations',
  UserPostValorationSchema
)

export default UserPostValidation
