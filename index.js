const app = require('./app')
const connectToSocket = require('./utils/socket')
const PORT = process.env.PORT || 5000
const errorHandler = require('./middleware/errorHandler')

app.use(errorHandler)

const server = connectToSocket(app)

server.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`)
})
