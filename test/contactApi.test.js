const supertest = require('supertest')
const {app, server} = require('../index')
const mongoose = require('mongoose')
const Contact = require('../models/Contact')
const api = supertest(app)
const { saveAll, FoundInDB, getAnId, loginUser } = require('../helpers/test_helpers')
const  contacts  = require('./mock/contacts')
const User = require('../models/User')
const users = require('./mock/users')
describe('pruebas de la api', ()=>{
   let token = ''
   beforeEach(async ()=>{
      const id = await getAnId(User)
      contacts.forEach(c=>{c['user']=id})
      await Contact.deleteMany({})
      await saveAll(contacts, Contact)
      token = await loginUser(users[0])
   })
   test('prueba de 404', async ()=>{
      await api
         .get('/api/contactsasdsda')
         .expect(404)
   }) 
   test('obtener los contactos', async ()=>{
      await api
         .get('/api/contacts')
         .set({ Authorization: `Bearer ${token.token}` })
         .expect(200)
         .expect('Content-Type', /application\/json/)
      const result = await FoundInDB(Contact)
      expect(result).toHaveLength(contacts.length)
      const hasUser = result.some((contact)=>contact.hasOwnProperty('user'))
      expect(hasUser).toBe(true)
   }) 
   test('crear nuevo contacto', async ()=>{
      const id = await getAnId(User)
      const newContact = { 
         "name": "Abraham Borja", 
         "number": "040-123456",
         "id": id
       }
      await api
         .post('/api/contacts')
         .set({ Authorization: `Bearer ${token.token}` })
         .send(newContact)
         .expect(200)
         .expect('Content-Type', /application\/json/)
      const names = await FoundInDB(Contact, 'name')
      expect(names).toContain(newContact.name)
   }) 
/*    test('el nombre esta repetido', async ()=>{
      const newContact = { 
         "name": "Dan Abramov", 
         "number": "040-123456"
       }
      const result = await api
         .post('/api/contacts')
         .send(newContact)
         .expect(400)
         .expect('Content-Type', /application\/json/)
      expect(result.body).toHaveProperty('errorMsg')
   })  */
   test('actualizar contacto', async ()=>{
      const updateContact = { 
         "name": "Ankahara Borja", 
         "number": "040-123456"
       }
      const id = await getAnId(Contact)      
      await api
         .put(`/api/contacts/${id}`)
         .set({ Authorization: `Bearer ${token.token}` })
         .send(updateContact)
         .expect(200)
         .expect('Content-Type', /application\/json/)
      const names = await FoundInDB(Contact, 'name')
      expect(names).toContain(updateContact.name)
   }) 
   test('eliminar contacto', async ()=>{
      const id = await getAnId(Contact)
      await api
         .delete(`/api/contacts/${id}`)
         .set({ Authorization: `Bearer ${token.token}` })
         .expect(200)
      const result = await FoundInDB(Contact)
      expect(result).toHaveLength(contacts.length-1)
   }) 
   test('probar get Id', async ()=>{
      let ids = []
      for (let i = 0; i < 5; i++) {
         const id = await getAnId(Contact)
         ids.push(id)
      }
      expect(ids).toHaveLength(5)
   })
   afterAll(async () => {
		await mongoose.connection.close()
		server.close()
	}) 
})