const supertest = require('supertest')
const mongoose = require('mongoose')
const {app, server} = require('../index')
const api = supertest(app)

describe('prueba de login', ()=>{
   beforeEach(async ()=>{

   })
   test('login', async ()=>{
      
   })
   afterAll(async () => {
		await mongoose.connection.close()
		server.close()
	}) 
})
