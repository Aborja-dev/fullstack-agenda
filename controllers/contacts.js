const contactsRouter = require('express').Router()
const Contact = require('../models/Contact')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

contactsRouter.get('/', (req, res)=>{
   Contact
      .find({})
      .populate('user', {username: 1})
      .then((contacts)=>{
         return res.status(200).json(contacts)
      })
})
contactsRouter.post('/', async (req, res, next)=>{
   const { name, number, user } = req.body
   const newContact = new Contact({
      name,
      number,
      user: user.id
   })
   try {
      const contactSaved = await newContact.save()
      user.contacts = user.contacts.concat(contactSaved.id)
      await user.save()
      res.status(200).json(contactSaved)
   } catch (error) {
      next(error)
   }
})
contactsRouter.put('/:id', (req, res)=>{
   const id = req.params.id
   const {name, number} = req.body
   const updateContact = {
      name,
      number
   }
   Contact
      .findOneAndUpdate({_id: id}, updateContact, {new: true})
      .then(()=>{
         return res.status(200).json(updateContact)
      })
})
contactsRouter.delete('/:id', (req, res)=>{
   const id = req.params.id
   Contact
      .findOneAndDelete({_id: id})
      .then((result)=>{
         return res.status(200).json(result)
      })
})

module.exports = contactsRouter