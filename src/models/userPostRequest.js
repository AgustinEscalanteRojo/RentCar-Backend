import mongoose from 'mongoose'

const userPostRequestSchema = new mongoose.Schema(
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
      enum: ['pending', 'approved', 'rejected', 'canceled'],
    },
    weekDay: {
      type: String,
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
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
  userPostRequestSchema
)

export default UserPostRequest
