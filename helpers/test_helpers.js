const User = require("../models/User");
const bcrypt = require('bcrypt');

const saveUsers = async (users) => {
   let promises = []
   users.forEach(async (_user) => {
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

const FoundInDB = async (Schema)=>{
   const all = await Schema.find({})
   return all
}


module.exports = { FoundInDB, saveAll, saveUsers}