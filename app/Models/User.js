'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static get schema () {
    return {
      email:        { type: String, unique:true },
     
    }
  }
}

module.exports = User
