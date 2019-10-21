'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const UserTest = use('App/Models/UserTest')
const Hash = use('Hash')
class UserController {

  async users({response, auth, params}){
    try{
      let user = await User.all()
      return response.status(200).json({"status": true, "data": user})
    }
    catch(error){
      response.status(404).json({"status":false})
    }
  }

  async showUser({request, response, params}){
    const {email} = await request.only(['email'])
    let user = await User.findBy('email', email)
    if(!user)
      return response.json({"status": false, "message": 'user not exist'})
    return response.json({status: true, data: user})
  }

  async userRegistration({ request, response, auth }){
    const { name, company } = await request.all()

    await UserTest.create({
      name,
      company
    })
    return response.status(200).json({status: true, message: "Successfully register"})
  }

  async show({ response }){
    const user = await UserTest.all()
    return response.status(200).json({user})
  }
  // async login({request, response, auth}){

  //   const {email, password} = await request.only(['email', 'password'])
  //   let user = await User.findBy({email})
  //   if(user){
  //       if(await Hash.verify(password, user.password)){
  //         let jwt = await auth.attempt(email, password)
  //         return {status: true, token:jwt, message: "login success"}
  //       }
  //       return {status:false, message: "wrong password"}
  //     }
  //     return {status: false, message: "not exist"}
  // }
  // async addUser({response, request, params}){

  //       let user = request.only(['name','email','password'])
  //       user.password = await Hash.make(user.password)
  //       user.verifyCode = Math.random().toString(36).substr(2, 6)
  //       let validate = await User.findBy({email: user.email})

  //        if(validate){
  //          return response.status(404).send({status: false, "message": 'email is already exist'})
  //        }
  //       await User.create(user)
  //       return response.status(200).send({status:true, data: user})
  // }


  // async updateUser({response,request,params}){
  //   try{
  //     let user = await request.only(['name', 'email', 'password'])
  //     let updateuser = await User.find(params.id)
  //     user.password = await Hash.make(user.password)
  //     updateuser.name= user.name
  //     updateuser.email= user.email
  //     updateuser.password= user.password
  //     await updateuser.save()
  //     return response.status(200).json(updateuser).send({status: true, data: updateuser})
  //   }
  //   catch( err ){
  //     return response.status(404).send(err)
  //   }
  // }

  // async detete({request, response, auth}){
  //   try{

  //   }
  //   catch(e){
  //     return response.status(404).json({"status": false, "error": e})
  //   }
  // }
}
module.exports = UserController
