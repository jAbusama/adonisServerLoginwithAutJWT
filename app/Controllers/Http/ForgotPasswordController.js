'use strict'

const User = use('App/Models/User')
const Mail = use('Mail')
const moment = require('moment')
const crypto = require('crypto')

class ForgotPasswordController {
//not yet finish
  async forgotPassword({request, response, auth}){
    //try{
      const {email}= request.only(['email'])
      const user = await User.findBy('email', email)
      const token = await crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()
      user.token = token

      await user.save()
      //return user
      await Mail.send('emails.welcome',{}, (message)=>{
      message.from('jepoymabusama16@gmail.com')
      message.to('jep@zendcreative.com')

      return user
      })
    // }catch(e){
    //   return e
    // }
  }

  async store({request}){
    try{
      const { email } = request.only(['email'])
      const user = await User.findBy('email', email)

      const token = await crypto.randomBytes(10).toString('hex')
    }
    catch(e){
      
    }
  }
}

module.exports = ForgotPasswordController
