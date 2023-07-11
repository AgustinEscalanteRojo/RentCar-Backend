import Task from '../models/task.js'

/**
 * @param {string} id
 * @return {{name: string, id: string}}
 */
export const getTasksById = async (id) => {
  const task = await Task.findOne({ _id: id })

  if (!task) {
    throw new Error('Task not found')
  }

  return task
}

/**
 * @return {[{name: string},{name: string},{name: string}]}
 */
export const getTasks = async () => {
  return Task.find()
}

/**
 * @param {object} data
 * @param {string} data.name
 * @return {*}
 */
export const createTask = async ({ name }) => {
  const task = new Task({ name })

  return task.save()
}

/**
 * @param {string} id
 * @param {object} data
 * @return {*&{id}}
 */
export const updateTask = async (id, data) => {
  await Task.findOneAndUpdate({ _id: id }, data)

  return getTasksById(id)
}

/**
 * @param {string} id
 * @return {boolean}
 */
export const removeTasksById = async (id) => {
  await Task.deleteOne({ _id: id })
  return true
}
