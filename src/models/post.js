import mongoose from 'mongoose'

// Post model
const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: ['car', 'motorcycle', 'van'],
      required: true,
    },
    model: {
      type: String,
    },
    plateNumber: {
      type: String,
      required: true,
    },
    km: {
      type: Number,
    },
    carSeats: {
      type: Number,
    },
    fuelType: {
      type: String,
      enum: ['gas', 'electric'],
    },
    gearBoxType: {
      type: String,
      enum: ['manual', 'automatic'],
    },
    description: {
      type: String,
    },
    style: {
      type: String,
      enum: ['4x4', 'coupé', 'sedan', 'compact'],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['oculto', 'activo'],
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    availableTimes: [
      {
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
    ],
  },
  { collection: 'posts' }
)

const Post = mongoose.model('Post', postSchema)

export default Post