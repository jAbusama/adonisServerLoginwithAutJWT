'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
class UserVerification {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth }, next, properties) {
    const { email, verifyCode } = await request.only([ 'email', 'verifyCode' ])
    const user = await User.findBy({email, verifyCode})
    if(user){
      if(user.isVerified)
        return response.status(200).json({ status: true, message: 'User Already verified'})
      user.isVerified = true;
      await user.save()
      await next()
    }
    else
      return response.status(404).json({ status: false, message: 'Email or verification code is not found'})
    // call next to advance the request
   // await next()
  }
}

module.exports = UserVerification
