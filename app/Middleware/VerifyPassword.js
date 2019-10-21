'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const Hash = use('Hash')

class VerifyPassword {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth }, next, properties) {
    // call next to advance the request
    const { email, password } = await request.all()
    const user = await User.findBy('email',email)
    if(!(await Hash.verify(password, user.password)))
      return response.status(400).json({status: false, message: 'Incorrect password'})
    await next()
  }
}

module.exports = VerifyPassword
