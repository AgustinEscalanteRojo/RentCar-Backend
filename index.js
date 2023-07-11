import express, { request, response } from 'express';
import bodyParser from 'body-parser'
import authRouter from './src/router/task.js'

const app = express();
const port = 8080;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/auth', authRouter)

app.get('/', (request, response) => {
    response.json({info: 'hola mundo'})
})

app.listen(port, () => {
    console.log('Server start in ${port} port'); 
})