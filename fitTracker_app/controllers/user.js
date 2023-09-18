const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user.js')

//new route to render the login form
router.get('/' , (req, res) => {
  res.render('newUser.ejs')
})

router.get('/login', (req, res) => {
  res.render('login.ejs')
})

//post route to create a new user
router.post('/', async (req, res) => { // post for new user
  try {
    console.log('before hash: ', req.body) //log the request body to the console
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)) //hash the password
    console.log('after hash: ', req.body) //log the request body to the console
    const newUser = await User.create(req.body) //create a new user with the hashed password and save it to a variable called newUser
    req.session.currentUser = newUser //create a new session and save the newUser to it
    res.redirect('/workouts') //
  } catch (err) { //if there is an error, log it and send a response status of 500
    console.log(err)
    res.status(500).send('Please try a different username or password.')
  }
})

//post route to login a user
router.post('/login', async (req, res) => {
  try {
    const foundUser = await User.findOne({username: req.body.username})
    if(foundUser) {
      const isAMatch = bcrypt.compareSync(req.body.password, foundUser.password)
      if(isAMatch) {
        console.log('login successful')
        req.session.currentUser = foundUser
        res.redirect('/workouts')
      } else {
        res.status(500).send('Username or password does not match or does not exist.')
      }
    } else {
      res.status(500).send('Username or password does not match or does not exist.')
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Username or password does not match or does not exist.')
  }
})

//logout route
router.delete('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) {
      console.log(err, '  logout failed')
      res.status(500).send('Logout failed, please try again')
    } else {
      res.redirect('/user/login')
    }
  })
})

module.exports = router