'use strict'

const express = require('express')
const passport = require('passport')
const database_init = require('./database_init')
const bodyParser = require('body-parser')
const auth = require('./passport/local')
const auth_token = require('./passport/token')
const utils = require('./utils')

const app = express()
app.use(bodyParser.json())

const PORT = 8080
const HOST = '0.0.0.0'

/**
 * A basic function to demonstrate the test framework.
 * @param {*} number A basic number
 * @returns The passed number
 */
function test_example (number) {
  return number
}

/**
 * Set the header protocol to authorize Web connection
 */
app.use(function (req, res, next) {
  // Allow access request from any computers
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE,PATCH')
  res.header('Access-Control-Allow-Credentials', true)
  if ('OPTIONS' == req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
})

/**
 * Welcoming path
 */
app.get('/', (req, res) => {
  res.send('Hello World')
})

/**
 * Required subject path, send some usefull data about service
 */
app.get('/about.json', (req, res) => {
  try {
    const about = {}
    about.client = { host: req.ip }
    about.server = {
      current_time: Date.now(),
      services: []
    }
    // TODO fetch the services data from DB with the IP of the client
    res.json(about)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

/**
 * Post request to signup a new user in the database.
 * body.username -> User name
 * body.email -> User mail
 * body.password -> User password
 */
app.post('/api/signup', (req, res, next) => {
  passport.authenticate('signup', { session: false }, (err, user, info) => {
    if (err) throw new Error(err)
    if (user == false) return res.json(info)
    const token = utils.generateToken(user.id)
    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Account created.',
        user,
        token
      },
      statusCode: res.statusCode
    })
  })(req, res, next)
})

/**
 * Post request to login to the website.
 * body.email -> User mail
 * body.password -> User password
 */
app.post('/api/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) throw new Error(err)
    if (user == false) return res.json(info)
    const token = utils.generateToken(user.id)
    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Welcome back.',
        user,
        token
      },
      statusCode: res.statusCode
    })
  })(req, res, next)
})

/**
 * Get request accessing to the user profile.
 * Need to be authentified with a token.
 */
app.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) return res.json('Invalid token')
    return res.json({ message: 'Welcome friend', user: req.user })
  }
)

/**
 * Start the node.js server at PORT and HOST variable
 */
app.listen(PORT, HOST, () => {
  console.log(`Server running...`)
})

module.exports = {
  test_example
}
