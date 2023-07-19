import mongoose from 'mongoose'

const UserPostValidationSchema = new mongoose.Schema(
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
  { collection: 'userPostValidations' }
)

const UserPostValidation = mongoose.model(
  'userPostValidations',
  UserPostValidationSchema
)

export default UserPostValidation
