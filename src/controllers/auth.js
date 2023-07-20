import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { isValid } from 'date-fns'

/**
 * @param {string} email
 * @param {string} password
 * @param {string} dateOfBirth
 * @param {'seller' | 'customer'} rol
 * @return {Promise<string>}
 * @return {salt.Promise}
 */

const saltRounds = 10

export const signup = async ({ 
  email, 
  password,
  dateOfBirth,
  rol,
}) => {
  if (!email || !password || !rol) {
    throw new Error('Miss some fields')
  }

  // Verificar si ya existe un usuario con el mismo correo electrónico
  const hasUser = await User.findOne({ email })
  if (hasUser) {
    throw new Error('Email is used')
  }

  if (dateOfBirth && !isValid(dateOfBirth)) {
    throw new Error('Your birthdate is invalid')
  }

  const validRoles = ['seller', 'customer']
  if (rol && !validRoles.includes(rol)) {
    throw new Error(`Your role must be one of the following: ${validRoles}`)
  }

  // Generar un salt (valor aleatorio) para el hash de la contraseña
  const salt = await bcrypt.genSalt(saltRounds)

  // Generar el hash de la contraseña utilizando el salt
  const hashedPassword = await bcrypt.hash(password, salt)

  // Crear un nuevo objeto User con el correo electrónico, contraseña hasheada y salt
  const user = new User({ 
    email, 
    password: hashedPassword, 
    dateOfBirth,
    salt 
  })

  await user.save()

  // Generar y devolver un token JWT firmado con el correo electrónico del usuario
  return jwt.sign({ email: user.email }, process.env.TOKEN_SECRET)
}

/**
 * @param {string} email
 * @param {string} password
 * @return {Promise<string>}
 */

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Miss some fields')
  }

  // Comprobar si existe un usuario con el correo electrónico proporcionado
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('User not found')
  }

  // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
  const matchedPassword = await bcrypt.compare(password, user.password)

  if (!matchedPassword) {
    throw new Error('Invalid password')
  }

  // Generar y devolver un token JWT firmado con el correo electrónico y ID del usuario
  return jwt.sign({ email, id: user._id }, process.env.TOKEN_SECRET)
}
