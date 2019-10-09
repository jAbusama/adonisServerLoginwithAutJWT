'use strict'
const Task = use('App/Models/Task')
class TaskController {

  async index({response}){
    let tasks= await Task.all()

    let res= response.json(tasks)
    return { status: true }
  }

  async addTask({request, response}){
    const tasksInfo= request.only(['task_name'])

    const task = new Task()
    task.task_name= tasksInfo.task_name
    await task.save()

    return response.status(201).json(task)
  }

  async showTask({request, response, params}){
    const task= await Task.find(params.id)
    
     return response.status(201).send({status: true, task, task_name:task.task_name})
  }

  async updateTask({request, response, params}){
    const taskInfo = request.only(['task_name'])
    const task = await Task.find(params.id)

    if (!task){
      return response.status(404).json({ status: false, data: 'task not found'})
    }

    task.task_name = taskInfo.task_name

    await task.save()

    return response.status(200).json(task)
  }

  async deleteTask({params, request, response}){
    let task = await Task.find(params.id)
    if(!task){
      return response.status(404).send({status: false, message: "Task not found"})
    }

    await task.delete()

    return response.status(200).send({status: true, message: 'successfully delete'})
  }

}

module.exports = TaskController
