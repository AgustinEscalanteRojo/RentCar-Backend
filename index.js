import express from 'express'
import bodyParser from 'body-parser'
import postRouter from './src/router/post.js'
import authRouter from './src/router/auth.js'
import userRouter from './src/router/user.js'
import connectToDb from './src/services/db.js'
import dotenv from 'dotenv'
import { ensureAuthenticated } from './src/middelware/auth.js'
import cors from 'cors'

dotenv.config()

const startApp = async () => {
  const app = express()
  const port = process.env.PORT

  app.use(cors())
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

  app.use(ensureAuthenticated)

  app.use('/auth', authRouter)
  app.use('/posts', postRouter)
  app.use('/user', userRouter)

  try {
    await connectToDb()
    app.listen(port, () => {
      console.log(`Server start in ${port} port`)
    })
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

startApp()
