import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    _id: {
      type: String,
      require: true,
    },
    firstName: { 
      type: String, 
      require: true, 
    },
    lastName: { 
      type: String, 
      require: true,
    },
    age: { 
      type: Number,
      require: true,
    },
    rol: {
      type: String,
      enum: ['Admin', 'Seller', 'Customer']
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
      required: true,
    },
    document: {
      type: String,
      require: true,
    },
  },
  { collection: 'users' }
)

// Creación del modelo "User" utilizando el esquema
const User = mongoose.model('User', userSchema)

export default User
