import mongoose from 'mongoose'

const PostAvailableTimeSchema = new mongoose.Schema({
  weekDays: [
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

  times: [
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
    enum: ['car', 'moto', 'van'],
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
    enum: ['gas', 'electric', 'hybrid'],
  },
  gearBoxType: {
    type: String,
    enum: ['manual', 'automatic'],
  },
  style: {
    type: String,
    enum: ['4x4', 'minivan', 'sports'],
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  availableTimes: {
    type: [PostAvailableTimeSchema],
  },
},
  { collection: 'posts'}
)

const Post = mongoose.model('Posts', PostSchema)

export default Post
