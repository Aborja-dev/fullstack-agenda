const supertest = require('supertest')
const { default: mongoose } = require('mongoose')
const { app, server } = require('../index')
const User = require('../models/User')
const users=require('./mock/users')
const { saveUsers, FoundInDB, getAnId } = require('../helpers/test_helpers')
const contacts = require('./mock/contacts')
const api =supertest(app)

describe('test de la api user', ()=>{
   beforeEach(async ()=>{
      await User.deleteMany({})
      await saveUsers(users)
   })

   test('obtener todos los usuarios', async ()=>{
      await api
         .get('/api/users')
         .expect(200)
         .expect('Content-Type', /application\/json/)
      const result = await FoundInDB(User)
      expect(result).toHaveLength(users.length)
      expect(result).toHaveProperty('notes')
   })
   test('login', async ()=>{
      const { username, password } = users[0]
      const login = {
         username,
         password
      }
      const response = await api
         .post('/api/login')
         .send(login)
         .expect(200)
         .expect('Content-Type', /application\/json/)
      expect(response.body).toHaveProperty('token')
   })
   test('crear nuevo usuario', async ()=>{
      const nuevoUsuario = {
         name: "mariana",
         username: "mariana21",
         password: "mari789"
      }
      await api
         .post('/api/users')
         .send(nuevoUsuario)
         .expect(200)
         .expect('Content-Type', /application\/json/)
      const usernames = await FoundInDB(User, 'username')
      expect(usernames).toContain(nuevoUsuario.username)
   })

   afterAll(async ( )=>{
      await mongoose.connection.close()
      await server.close()
   })
})