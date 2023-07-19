import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      loweCase: true,
    },
    age: {
      type: Number,
      require: true,
    },
    rol: {
      type: String,
      enum: ['Admin', 'Seller', 'Customer'],
    },
    phone: {
      type: Number,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    salt: {
      type: String,
      require: true,
    },
    document: {
      type: String,
      require: true,
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
