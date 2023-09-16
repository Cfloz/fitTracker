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
app.use(express.static({
  session: process.env.SECRET,
  resave: false,
  saveUninitialized: false

}))
//enviroment variables
const PORT = process.env.PORT
const mongodbURI = process.env.MONGODBURI

//connect to mongo
const db = mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
//connection error/success
mongoose.connection.on('error', (err) => console.log('Error in Mongo connection: ', err.message))
mongoose.connection.on('connected', () => console.log('Mongo connected: ', mongodbURI))
mongoose.connection.on('disconnected', () => console.log('Mongo disconnected'))

//controllers
