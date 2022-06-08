const User = require("../models/User")
const jwt = require('jsonwebtoken')

const authMiddleware = async (req,res,next)=>{
      const body = req.body
      try {
         const token = req.get('Authorization').substring(7)
         const { id } = jwt.verify(token, process.env.SECRET)
         const user = await User.findById(id)
         body['user'] = user
         next()
      } catch (e) {
         next(e)
      }
}
/*  const authMiddleware = async (req,res,next)=>{
   const authToken = new Promise((resolve,reject)=>{
      const token = req.get('Authorization').substring(7)
      resolve(token)
   })
   .then(token=>{
      const { id } = jwt.verify(token, process.env.SECRET)
      return id
   })
   .then(id=>User.findById(id))
   .catch(e=>next(e))

   const body = req.body
   body['user'] = await authToken
   next()
}  */

module.exports = authMiddleware