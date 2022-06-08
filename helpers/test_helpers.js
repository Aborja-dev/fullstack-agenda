const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const saveUsers = (users) => {
   let promises = []
   users.forEach( (_user) => {
      const promise = bcrypt
         .hash(_user.password, 10)
         .then(passwordHash=>{
            return new User({
               ..._user,
               passwordHash
            })
         })
         .then((user)=>{
            return user.save()
         })
         promises.push(promise)
   });
   return Promise.all(promises)
}
const saveAll = async (array, Schema) => {
   let promises = []
   array.forEach(async (_el) => {
      const newEl = new Schema(_el)
      promises.push(newEl.save())
   });
   return Promise.all(promises)
}
const FoundInDB = async (Schema, prop=null)=>{
   const all = await Schema.find({})
   return prop
      ?all.map((el)=>el[prop])
      :all.map(a=>a.toJSON())
}
const getAnId = async (Schema, seed=10)=>{
   const all = await Schema.find({})
   const index =  Math.floor((Math.random() * seed)) % all.length
   const doc = all[index]
   return doc.id
}

const loginUser = async (_user)=>{
   const user = await User.findOne({username: _user.username})
   const userForToken = {
      username: user.username,
      id: user._id
   }
   const token = jwt.sign(userForToken, process.env.SECRET)
   return {token}
}


module.exports = { FoundInDB, saveAll, saveUsers, getAnId, loginUser}