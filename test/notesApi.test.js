const supertest = require('supertest')
const {app, server} = require('../index')
const mongoose = require('mongoose')
const api = supertest(app)


describe('pruebas de la api', ()=>{
   beforeEach(async ()=>{

   })
   test('test de api', async ()=>{
      
   }) 

   afterAll(async () => {
		await mongoose.connection.close()
		server.close()
	}) 
})