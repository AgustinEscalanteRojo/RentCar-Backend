import express from 'express'
import bodyParser from 'body-parser'
import tasksRouter from './src/router/tasks.js'
import authRouter from './src/router/auth.js'
import connectToDb from './src/services/db.js'

const startApp = async () => {
  const app = express()
  const port = 8080

  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

  app.get('/', (request, response) => {
    response.json({ info: 'hola mundo' })
  })

  app.use('/tasks', tasksRouter)
  app.use('/auth', authRouter)

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
