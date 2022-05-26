const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res)=>{
   const {username: _username, password} = req.body
   const user = await User.findOne({username: _username})
   const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
   if (!passwordCorrect) {
      return res.status(401).json({})
   }
   const userForToken = {
      username: user.username,
      id: user._id
   }
   const token = jwt.sign(userForToken, process.env.SECRET)
   return res.status(200).json({token})
})


module.exports = loginRouter