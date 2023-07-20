import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      loweCase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },
    rol: {
      type: String,
      enum: ['Admin', 'Seller', 'Customer'],
    },
    phone: {
      type: Number,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    document: {
      type: String,
      required: true,
    },
    favPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  { collection: 'users' }
)

// Creación del modelo "User" utilizando el esquema
const User = mongoose.model('User', userSchema)

export default User
