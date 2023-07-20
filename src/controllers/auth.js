import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { isValid } from 'date-fns'

/**
 * @param {string} email
 * @param {string} password
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} dateOfBirth
 * @param {number} phone
 * @param {string} document
 * @param {'seller' | 'customer'} rol
 * @return {salt.Promise}
 * @return {Promise<string>}
 */

export const signup = async ({
  email,
  password,
  firstName,
  lastName,
  dateOfBirth,
  phone,
  document,
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

  if (firstName && firstName.length < 3) {
    throw new Error('First name must be 3 characters or longer')
  }

  if (lastName && lastName.length < 3) {
    throw new Error('Last name must be 3 characters or longer')
  }

  if (dateOfBirth && !isValid(dateOfBirth)) {
    throw new Error('Your birthdate is invalid')
  }

  if (phone && typeof phone !== 'number') {
    throw new Error('Phone must only contain numbers')
  }

  if (document && typeof document !== 'string') {
    throw new Error('Document must be composed of numbers and letters')
  }

  const validRoles = ['seller', 'customer']
  if (rol && !validRoles.includes(rol)) {
    throw new Error(`Your role must be one of the following: ${validRoles}`)
  }

  const saltRounds = 10

  // Generar un salt (valor aleatorio) para el hash de la contraseña
  const salt = await bcrypt.genSalt(saltRounds)

  // Generar el hash de la contraseña utilizando el salt
  const hashedPassword = await bcrypt.hash(password, salt)

  // Crear un nuevo objeto User con el correo electrónico, contraseña hasheada y salt
  const user = new User({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    dateOfBirth,
    phone,
    document,
    rol,
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
