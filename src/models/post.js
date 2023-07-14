import mongoose from 'mongoose'

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
    required: true,
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
    type: String
  }
})

const Post = mongoose.model('Posts', PostSchema)

export default Post