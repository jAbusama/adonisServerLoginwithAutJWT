'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')
const Mail = use('Mail')
class AuthController {

  async register({request, response, auth}){
    try{
      const {email, username, password} = request.only(['email', 'username', 'password'])
      if(!(email && username && password)){
        return response.json({"status":false, "message":{"error": "please fill all required data"}})
      }
      if(await User.findBy('email',email)){
        return response.json({"status": false, "message":{"error": "email exist"}})
      }
      else if(await User.findBy('username', username)){
        return response.json({"status":false, "message":{"error": "username exist"}})
      }
      let user = new User()
      user.email = email
      user.password = await Hash.make(password)
      user.username = username
      

      await user.save()
      return response.json({"status": true, "user": user, "message":"registered success"})
      //let thisUser = await User.findBy('email', email)
      //let token = await auth.generate(thisUser)
      // return response.json({"user": user, "token": token.token})
    }
    catch(e){
      return response.json({"status": false, "message": e})
    }
  }

  async InitialRegister(){

  }

  async login({request, response, auth}){
    try{
      const {email, password} = request.only(['email', 'password'])

      let user = await User.findBy('email', email)
      if(user){
        if(await Hash.verify(password, user.password)){
          if(await auth.attempt(email,  password)){
            let token = await auth.generate(user)
            return response.json({"status": true, "message": "success", "token": token.token})
          } 
        }
        return response.json({"status": false, "message": "wrong password"})
      }
      return response.json({"status": false, "message": "user not exist"})
    }
    catch(e){
      return response.json({"status": false, message:e})
    }
  }

  async verification(){
      await Mail.send('emails.welcome', {}, (message) => {
        message.from('jepoymabusama16@gmail.com')
        message.to('jep@zendcreative.com')
      })
  }

}

module.exports = AuthController
