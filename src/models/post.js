import mongoose from 'mongoose'

const PostAvailableTimeSchema = new mongoose.Schema({
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

  timing: [
    {
      start: Date,
      end: Date,
    },
  ],
})

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['car', 'moto', 'van']
  },
  model: {
    type: String,
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
  },
  km: {
    type: Number,
    required: true,
  },
  carSeat: {
    type: Number,
  },
  fuelType: {
    type: String,
    enum: ['gas', 'electric', 'hybrid']
  },
  gearBoxType: {
    type: String,
    enum: ['manual', 'automatic']
  },
  style: {
    type: String,
    enum: ['4x4', 'minivan', 'sports']
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
})

const Post = mongoose.model('Posts', PostSchema)

export default Post