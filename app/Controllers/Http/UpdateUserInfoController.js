'use strict'


const User = use('App/Models/User')
const Hash = use('Hash')
const {validate} = use('Validator')
class UpdateUserInfoController {

  async update({request, response, auth}){
    try{
      const {username,password, new_email, new_username, new_password, new_mobile} = request.only(['username', 
        'password', 'new_email', 'new_username', 'new_password', 'new_mobile'])
        
       // await auth.attempt(username, password)

      //  return 'Logged in successfully'
      const messages = {
        'username.required':     "Username is required to update user.",
        'password.required':     "Password is equired to update.",
        'new_password.min':      "Password is must be atleast 8 character long.",
        'new_username.unique':   "New username must be unique.",
        'new_email.unique':      "Email must be unique.",
        'new_mobile.unique':     "Mobile must be unique.",
        'new_mobile.min':        "Mobile numher must be valid.",
        //'new_email.email':       "Email must be a valid email address"
      }
      
      const validation = await validate(request.all(), {
        username:       'required',
        password:       'required',
        new_username:   'unique:users,username',
        new_email:      'unique:users,email',
        new_password:   'min:8',
        new_mobile:     'unique:users,mobile|min:13'
      }, messages)
        
      if(validation.fails()) {
        return response.json({"status": false,"message":validation.messages()})
      }
      const user = await User.findBy('username', username)
      if(user){
        const checkpass = await Hash.verify(password, user.password)
        if(checkpass){
          
          if(new_email == null  && new_username == null && new_password == null && new_mobile == null ){
            return response.json({"status": false, "message": "no changes occured"})
          }
          if( new_email != null ){
            user.email = new_email
          }
          if( new_username != null ){
            user.username = new_username
          }
          if(new_password != null){
            user.password = await Hash.make(new_password)
          }
          if(new_mobile != null)
            user.mobile = new_mobile
          await user.save();
          return response.json({"status":true, "message":"successfully updated"})
        }       
        return response.json({"status":false, "message":"password incorrect"})
      }
      return response.json({"status":false, "message":"user not found"})
    }catch(e){
      return response.json({"status":false, "message":e})
    }
  }
}

module.exports = UpdateUserInfoController
