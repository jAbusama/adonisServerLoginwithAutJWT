'use strict'

class User {
  get rules () {
    return {
      // validation rules
      email: 'required|unique:users,email',
      username: 'required|unique:users,username',
      password: 'required|min:8',
      mobile: 'required|unique:users,mobile'
    }
  }

  get messages() {
    return {
      'email.required': 'Email is Required.',
      'username.required': "Username is Required.",
      'mobile.required': "Mobile number is Required.",
      'password.required': "Password is Required.",
      'password.min': "Password is must be atleast 8 character long.",
      'email.unique': "Email is already exist.",
      'email.email': "Email must a valid email.",
      'username.unique': "Username is already exist.",
      'mobile.unique': "Mobile is already exist."
    }
  }
  async fails(error) {
    return this.ctx.response.status(400).json({ status: false, message: error[0].message })
  }
}

module.exports = User
