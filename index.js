require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const contactsRouter = require('./controllers/contacts')
const errorMiddleware = require('./middleware/errorHandler')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authMiddleware = require('./middleware/auth')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use( '/api/contacts', authMiddleware)
app.use('/api/contacts', contactsRouter)

app.use(errorMiddleware)

app.use((req,res)=>{
   return res.status(404).end()
})
const PORT = 3002
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

module.exports = {app, server}