import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
})

const Task = mongoose.model('Tasks', TaskSchema)

export default Task