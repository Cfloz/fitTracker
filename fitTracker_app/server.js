//import required modules
const express = require('express')
const app = express()
const methodOverride = require('method-override')
const session = require('express-session')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

//require dotenv
require('dotenv').config()
//Middleware configuration this will parase the data from the body of the request and add it to the request object as req.body
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));//this tells express to use the public folder for static assets
app.use(express.static('public/css'))
app.use(express.static('images'))
app.use(
  session({
    secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
  })
)
//enviroment variables
const PORT = process.env.PORT
const mongoURI = process.env.MONGODBURI

//connect to mongo
mongoose.connect(mongoURI)

const db = mongoose.connection
// optional create status messages to check mongo connection 
db.on('error', (err) => { console.log('ERROR: ' , err)})
db.on('connected', () => { console.log('mongo connected')})
db.on('disconnected', () => { console.log('mongo disconnected')})

//import router controllers
const workoutsController = require('./controllers/workouts.js') //import the workouts controller and save it to a variable called workoutsController
const userController = require('./controllers/user.js') //import the users controller and save it to a variable called userController

//auth middleware - if the user is not logged in, redirect them to the login page
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/user/login')
  }
}

//use the with app.use() method to tell express to use the workoutsController for all routes that start with '/workouts'
app.use('/user', userController)//use the userController for all routes that start with '/user'

app.use(isAuthenticated)//use the isAuthenticated middleware for all routes that start with '/workouts'

app.use('/workouts', workoutsController)// use the workoutsController for all routes that start with '/workouts'

//here we are telling the app when you see the URL that starts with '/workouts' use the workoutsController

app.get('/any', (req, res) => { //this is a route that starts with '/any'
  res.session.anyProperty = 'any value' //here we are setting a property on the session object
  res.redirect('/workouts') //redirect to the workouts index route
})

app.get('/retrieve', (req, res) => { //this is a route that starts with '/retrieve'
  if(req.session.anyProperty === 'any value'){ //if the anyProperty property on the session object is equal to 'any value'
  console.log('match!')
  res.send('The value of anyProperty is: ' + req.session.anyProperty) //send the value of the anyProperty property on the session object
}
else{
  console.log('no match!')
}
res.redirect('/workouts') //redirect to the workouts index route
})

app.get('/updateSession', (req, res) => {//this is a route that starts with '/updateSession'')
   req.session.anyProperty = 'not something' //here we are updating the value of the anyProperty property on the session object
   res.redirect('/workouts') //redirect to the workouts index route
})


//listen on the port
app.listen(PORT, () => {
  console.log('server is listening on port: ', PORT)
})