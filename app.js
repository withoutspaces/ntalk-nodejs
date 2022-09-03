const http = require('http')
const session = require('express-session')
const methodOverride = require('method-override')
const express = require('express')
const cookie = require('cookie')
const socketIO = require('socket.io')
const consign = require('consign')
const config = require('./config')
const path = require('path')
const error = require('./middlewares/errors')

const app = express()
const server = http.Server(app)
const io = socketIO(server)
const store = new session.MemoryStore()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(
  session({
    store,
    name: config.sessionKey,
    secret: config.sessionSecret
  })
)
app.use(express.json())
app.use(express.urlencoded())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

io.use((socket, next) => {
  const cookieData = socket.request.headers.cookie
  const cookieObj = cookie.parse(cookieData)
  const sessionHash = cookieObj[config.sessionKey] || ''
  const sessionId = sessionHash.split('.')[0].slice(2)
  store.all((err, sessions) => {
    const currentSession = sessions[sessionId]
    if (err || !currentSession) {
      return next(new Error('Acesso Negado'))
    }
    socket.handshake.session = currentSession
    return next()
  })
})

consign({})
  .include('models')
  .then('controllers')
  .then('routes')
  .then('events')
  .into(app, io)

app.use(error.notFound)
app.use(error.serverError)

server.listen(3000, () => {
  console.log('Ntalk tá on!')
})
