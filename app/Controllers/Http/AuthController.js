'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')
class AuthController {

  async register({request, response, auth}){
    try{
      const {email, username, password} = request.only(['email', 'username', 'password'])
      
      if(await User.findBy('email',email)){
        return response.json({"status": false, "message": "email exist"})
      }
      else if(await User.findBy('username', username)){
        return response.json({"status":false, "message": "username exist"})
      }
      let user = new User()
      user.email = email
      user.password = await Hash.make(password)
      user.username = username

      await user.save()
      let thisUser = await User.findBy('email', email)
      let token = await auth.generate(thisUser)
      return response.json({"user": user, "token": token.token})
    }
    catch(e){
      return response.json({"status": false, "message": e})
    }
  }

  async login({request, response, auth}){
    try{
      const {email, password} = request.only(['email', 'password'])

      let user = await User.findBy('email', email)
      if(user){
        if(await Hash.verify(password, user.password)){
            return response.json({"status": true, "message": "login success"})
        }
        return response.json({"status": false, "message": "wrong password"})
      }
      return response.json({"status": false, "message": "user not exist"})
    }
    catch(e){
      return response.json({"status": false, message:e})
    }
  }
}

module.exports = AuthController
