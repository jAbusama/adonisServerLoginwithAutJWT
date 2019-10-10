'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
// const {Models, Model} = require('./')(config)
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
 const Model = use('Model')

class User extends Model {

  // users(){
  //   return this.belongsTo('App/Models/User')
  // }

  static get hidden(){
    return ['password']
  }
  
}
// Models.add('App/Models/User',User)
module.exports = User
