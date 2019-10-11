'use strict'


const User = use('App/Models/User')
const Hash = use('Hash')

class UpdateUserInfoController {

  async changePassword({request, response, auth}){
    try{
      const {newemail, username, newusername, password, newpassword} = request.only(['newemail', 'username', 'password', 'newpassword','newusername'])
      if(username==null){
        return response.status(404).json({"status":false, "message":"username is required when updating user"})
      }
      const user = await User.findBy('username', username)
      if(!user){
        return response.status(404).json({"status":false, "message":"user not found"})
      }
      const checkpass = await Hash.verify(password, user.password)
      if(!checkpass){
        return response.status(404).json({"status":false, "message":"password incorrect"})
      }
      if((newemail == null || newemail == user.email) && (newusername == null || newusername == user.username) && newpassword == null){
        return response.status(201).json({"status":true, "message":"no changes occured"})
      }
      if(newemail != null){
        user.email = newemail
      }
      if(newusername != null){
        user.username = newusername
      }
      if(newpassword != null){
        user.password = await Hash.make(newpassword)
      }
      await user.save();
        return response.status(201).json({"status":true, "message":"successfully updated"})
    }
    catch(e){
      return response.status(404).json({"status":false, "message":e})
    }
  }
}

module.exports = UpdateUserInfoController
