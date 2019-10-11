'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')
const Mail = use('Mail')
const superagent = use('superagent')
class AuthController {

  async register({request, response, auth}){
    try{
      const {email, username, password, mobile} = request.only(['email', 'username', 'password', 'mobile'])
      // if(!(email && username && password && mobile)){
      //   return response.json({"status":false, "message":{"error": "please fill all required data"}})
      // }
      if(!(email && username && password && mobile)){
        return response.json({"status":false, "message":{"error": "please fill all required data"}})
      }
      if(await User.findBy('email',email)){
        return response.json({"status": false, "message":{"error": "email exist"}})
      }
      else if(await User.findBy('username', username)){
        return response.json({"status":false, "message":{"error": "username exist"}})
      }
      else if(await User.findBy('mobile', mobile)){
        return response.json({"status":false, "message":{"error": "mobile number exist"}})
      }
      let user = new User()
      user.email = email
      user.password = await Hash.make(password)
      user.username = username
      user.verifyCode = await Math.random().toString(36).substr(2, 6)
     // user.verifyDate = new Date()
     // user.hour= user.verifyDate.getHours()
     // user.min = user.verifyDate.getMinutes()
      //user.sec = user.verifyDate.getSeconds()

      user.isVerified = false;
      user.mobile = mobile

      // let res = await superagent.post('https://www.itexmo.com/php_api/api.php')
      // .set('Content-Type', 'application/x-www-form-urlencoded')
      // .set('Access-Control-Allow-Origin', '*')
      // .set('Accept', 'application/json')
      // .send({ 1: user.mobile, 2: `Your verification code is ${user.verifyCode}`, 3: 'TR-JEPOY727105_I3P9K' })

      await user.save()
      return response.json({"status": true, "user": user, "message":"Please verify user"})
    }
    catch(e){
      return response.json({"status": false, "message": e})
    }
  }

  async verify({request, response}){
    let { email, verifyCode} = request.only(['email', 'verifyCode'])

    const user = await User.findBy({'email':email ,'verifyCode': verifyCode})
    if(user){
      if(user.isVerified){
        return response.json({status:false, "message": 'User Already Verified'})
      }
      user.isVerified = true;

      await user.save()
      return response.json({"status": true, "message": 'User Verification Success'})
    }
    else{
      return response.json({"status":false, "message": "Incorrect verification Code "})
    }
  }

  async resendVerification({request, response}){
    try{
      const { email } = request.only(['email'])

      const user = await User.findBy('email', email)

      if(user){
        if(user.isVerified){
          return response.json({"status": false, "message": "Account already verified"})
        }
        // let res = await superagent.post('https://www.itexmo.com/php_api/api.php')
        // .set('Content-Type', 'application/x-www-form-urlencoded')
        // .set('Access-Control-Allow-Origin', '*')
        // .set('Accept', 'application/json')
        // .send({ 1: user.mobile, 2: `Your verification code is ${user.verifyCode}`, 3: 'TR-JEPOY727105_I3P9K' })
        
        return response.json({"status": true, "message": "verification sent to 09******"+user.mobile.substr(8, 3), "code":user.verifyCode})
      }
      else{
        return response.json({"status": false, "message": "Email not found"})
      }
    }catch(error){
      return response.json({"status": false, "message": error})
    }
  }

  async login({request, response, auth}){
    try{
      const {email, password} = request.only(['email', 'password'])

      let user = await User.findBy('email', email)
      
      if(user){
        if(user.isVerified){
          if(await Hash.verify(password, user.password)){
            if(await auth.attempt(email,  password)){
              let token = await auth.generate(user)
              return response.json({"status": true, "message": "success", "token": token.token})
            } 
          }
          return response.json({"status": false, "message": "wrong password"})
        }
        return response.json({"status": false, "message":"Please verify your account"})
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
