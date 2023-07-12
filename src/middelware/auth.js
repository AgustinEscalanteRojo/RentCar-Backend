import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const publicUrls = ['/auth/login', '/auth/signup']
const adminUrls = ['/admin/users']

/**
 * Middleware para asegurar la autenticación del usuario.
 *
 * @param {object} request
 * @param {object} response
 * @param {function} next
 */
export const ensureAuthenticated = async (request, response, next) => {
  // Comprobar si la ruta de la solicitud incluye '/auth'.
  // Si es así, se permite el acceso sin autenticación.
  if (publicUrls.includes(request.path)) {
    return next()
  }

  // Comprobar si no se proporciona una cabecera 'Authorization' en la solicitud.
  if (!request.headers.authorization) {
    return response.status(403).send({ message: 'You are not authenticated 1' })
  }

  // Obtener el token de autorización de la cabecera 'Authorization'.
  const token = request.headers.authorization.split(' ')[1]

  // Comprobar si no se proporciona un token.
  if (!token) {
    return response.status(403).send({ message: 'You are not authenticated' })
  }

  // Decodificar el token JWT utilizando el secreto.
  const payload = jwt.decode(token, process.env.TOKEN_SECRET)

  // Comprobar si el token no es válido o no contiene un 'id' en el payload.
  if (!payload || !payload.id) {
    return response.status(403).send({ message: 'Wrong token' })
  }

  // Buscar al usuario en la base de datos utilizando el 'id' del payload.
  const user = await User.findOne({ _id: payload.id })

  // Comprobar si no se encuentra al usuario en la base de datos.
  if (!user) {
    return response.status(403).send({ message: 'Wrong token' })
  }

  if (adminUrls.includes(request.path) && user.rol !== 'admin') {
    return response.status(404).send({ message: 'Not found' })
  }

  // Agregar el usuario a la solicitud para que esté disponible en los controladores posteriores.
  request.user = user

  // Pasar la solicitud al siguiente middleware.
  next()
}
