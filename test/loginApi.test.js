const supertest = require('supertest')
const mongoose = require('mongoose')
const {app, server} = require('../index')
const User = require('../models/User')
const api = supertest(app)
const users = require('./mock/users.js')
const jwt = require('jsonwebtoken')
const { saveUsers, loginUser } = require('../helpers/test_helpers')

describe('prueba de login', ()=>{
   token = ''
   beforeEach(async ()=>{
      await User.deleteMany({})
      await saveUsers(users)
      token = await loginUser(users[0])
   })
   test('login', async ()=>{
      const userLogin = users[0]
      const result = await api
         .post('/api/login')
         .send(userLogin)
         .expect(200)
         .expect('Content-Type', /application\/json/)
      expect (result.body).toHaveProperty('token')
   })
   test('loginUser', async()=>{
      const result = await loginUser(users[0])
      expect(result).toHaveProperty('token')
   })
   test('no hay cabeceras',async ()=>{
      await api
         .get('/api/contacts')
         .expect(400)
   })
   test('token invalido',async ()=>{
      const tokenId = token.token.substring(5)
      await api
      .get('/api/contacts')
      .set({ Authorization: `Bearer ${tokenId}` })
      .expect(400)
   })
   test('no se encontro usuario',async ()=>{
      const userData = {
         username: 'juanito',
         id: 5
      }
      const invalidToken = jwt.sign(userData, process.env.SECRET)
      await api
      .get('/api/contacts')
      .set({ Authorization: `Bearer ${invalidToken}` })
      .expect(400)
   })
   afterAll(async () => {
		await mongoose.connection.close()
		server.close()
	}) 
})
