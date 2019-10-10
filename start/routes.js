'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(()=>{
  Route.get('tasks/:id', 'TaskController.index')
  Route.get('tasks/:id', 'TaskController.showTask')
  Route.post('tasks', 'TaskController.addTask')
  Route.put('tasks/:id', 'TaskController.updateTask')
  Route.delete('tasks/:id', 'TaskController.deleteTask')
}).prefix('api')

Route.group(()=>{
  Route.get('users','UserController.users').middleware('auth')
 // Route.post('login', 'UserController.login')
  //Route.post('users','UserController.addUser')
  Route.get('users/:id','UserController.showUser')
  //Route.put('users/:id','UserController.updateUser')
  Route.delete('users/:id','UserController.deleteUser')
}).prefix('api')

Route.group(()=>{
  Route.post('login','AuthController.login')
  Route.post('register','AuthController.register')
}).prefix('auth')

Route.group(()=>{
  Route.put('password', 'UpdateUserInfoController.changePassword').middleware('auth')
}).prefix('update')



