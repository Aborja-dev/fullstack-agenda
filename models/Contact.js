const {Schema, model} = require('mongoose')

const ContactSchema = new Schema({
   name: String,
   number: String,
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
})

ContactSchema.set('toJSON', {
   transform: (doc, returnedObject)=>{
      returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
   }
})

const Contact = model('Contact', ContactSchema)
module.exports = Contact