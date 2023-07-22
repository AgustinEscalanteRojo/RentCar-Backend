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
    },
    lastName: {
      type: String,
    },

    dateOfBirth: {
      type: Date,
    },
    rol: {
      type: String,
      enum: ['Admin', 'Seller', 'Customer'],
      required: true,
    },
    phone: {
      type: Number,
    },
    salt: {
      type: String,
    },
    document: {
      type: String,
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
