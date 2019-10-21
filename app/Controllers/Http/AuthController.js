'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')
const Mail = use('Mail')
const superagent = use('superagent')
//const { validate } = use('Validator')

class AuthController {

  async register({ request, response, auth }){
    try{
      const {email, username, password, mobile} = request.only(['email', 'username', 'password', 'mobile'])
      await User.create({
        email,
        username,
        password: await Hash.make(password),
        mobile,
        verifyCode: await Math.random().toString(36).substr(2,6),
        verifyDate: new Date(),
        isVerified: false
      })

      // let res = await superagent.post('https://www.itexmo.com/php_api/api.php')
      // .set('Content-Type', 'application/x-www-form-urlencoded')
      // .set('Access-Control-Allow-Origin', '*')
      // .set('Accept', 'application/json')
      // .send({ 1: user.mobile, 2: `Your verification code is ${user.verifyCode}`, 3: 'TR-JEPOY727105_I3P9K' })
      
      return response.json({"status": true, "message":"Please verify user"})
    }
    catch(e){
      return response.json({"status": false, "message": e.toString()})
    }
  }

  async verify({ response }){
    try{
      // let { email, verifyCode} = request.only(['email', 'verifyCode'])
      // const user = await User.findBy({ 'email':email, 'verifyCode':verifyCode })
      // if(user){
      //   if(user.isVerified)
      //     return response.json({status:false, "message": 'User Already Verified'})
      //   user.isVerified = true;
      //   await user.save()
        return response.json({"status": true, "message": 'User Verification Success'})
      // }
      // return response.json({"status":false, "message": "Incorrect email or verification code "})
    }catch(e){
      return response.json({"status": false, "message": e})
    }
  }

  async resendVerification({request, response}){
    try{
      const { email } = request.only(['email'])
      
      const user = await User.findBy('email', email )
      if( user ){
        let today = new Date()
        let diffMin = today.getMinutes() - user.verifyDate.getMinutes()
        user.verifyDate = today
        await user.save()
        if(user.isVerified)
          return response.json({"status": false, "message": "Account already verified"})
        if( diffMin < 1 )
          return response.json({"status": false, "message": "please wait for 1min to resend the verify code"})
        // let res = await superagent.post('https://www.itexmo.com/php_api/api.php')
        // .set('Content-Type', 'application/x-www-form-urlencoded')
        // .set('Access-Control-Allow-Origin', '*')
        // .set('Accept', 'application/json')
        // .send({ 1: user.mobile, 2: `Your verification code is ${user.verifyCode}`, 3: 'TR-JEPOY727105_I3P9K' })
        return response.json({"status": true, "message": "verification sent to 09******"+user.mobile.substr(8, 3), "code":user.verifyCode})
      }
      else
        return response.json({"status": false, "message": "Email not found"})
    }catch(error){
      return response.json({"status": false, "message": error})
    }
  }

  async login({request, response, auth}){
    try{
      const {email, password} = request.only(['email', 'password'])
      let user = await User.findBy('email', email )
      if(user){
        if(user.isVerified){
            if(await auth.attempt( email,  password )){
              let token = await auth.generate(user)
              return response.json({"status": true, "user": user,"message":  "Login success", "token": token.token})
            } 
        }
        return response.json({"status": false, "message":"Please verify your account"})
      }
      return response.json({"status": false, "message": "user not exist"})
    }
    catch(e){
      return response.json({"status": false, message:e})
    }
  }

  /*async verification(){
      await Mail.send('emails.welcome', {}, (message) => {
        message.from('jepoymabusama16@gmail.com')
        message.to('jep@zendcreative.com')
      })
  }*/

}

module.exports = AuthController
