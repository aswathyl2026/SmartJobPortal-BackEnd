const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const users = require('../models/userModel')

//registraion controller

exports.registerController = async (req, res) => {
  console.log("Inside registerController");
  const { username, email, password, role } = req.body

  const existingUser = await users.findOne({ email })
  if (existingUser) {
    res.status(400).json("User alredy exist... Please login")
  } else {
    const encryptPasssword = await bcrypt.hash(password, 10)
    const newUser = await users.create({ username, email, password: encryptPasssword, role })
    res.status(201).json({
      success: true,
      message: "User Successfuly Registered",
      data: newUser

    })
  }

}

exports.loginController = async (req, res) => {
  console.log("Inside loginController");
  const { email, password } = req.body
  const existingUser = await users.findOne({ email })
  if (existingUser) {
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password)
    if (isPasswordMatch) {
      const token = jwt.sign({ userId: existingUser._id, userMail: email, role: existingUser.role }, process.env.JWTSECRET,
        {
          expiresIn: "1d"
        }
      )
      res.status(200).json({
        success: true,
        message: "Login Successfully",
        data: { user: existingUser, token }
      })
    } else {
      res.status(400).json("Incorrect Email or Password")
    }
  } else {
    res.status(400).json("User not exist... please Register")
  }
}