const session = require('express-session')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const express = require('express')
const consign = require('consign')
const error = require('./middlewares/errors')
const path = require('path')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(cookieParser('ntalk'))
app.use(session())
app.use(express.json())
app.use(express.urlencoded())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

consign({}).include('models').then('controllers').then('routes').into(app)

app.use(error.notFound)
app.use(error.serverError)

app.listen(3000, () => {
  console.log('Ntalk tá on!')
})
