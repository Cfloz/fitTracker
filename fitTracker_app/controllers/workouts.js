const express = require('express')
const router = express.Router()

//import our workouts model
const Workouts = require('../models/workouts.js')

//index route - get all workouts
router.get('/', async (req, res) => {
  const allWorkouts = await Workouts.find({}) //get all workouts from the database and save to a variable called allWorkouts
  //render the index.ejs template and pass it the allWorkouts variable as "workouts"
  res.render('workouts/index.ejs', { workouts: allWorkouts }) //this is the data we are sending to the index.ejs file
})

//new route - get the form to create a new workout from new.ejs
router.get('/new', (req, res) => {
  res.render('new.ejs')
})

//show route to render "show.ejs" with the data for a single workout
router.get('/:id', async (req, res) => {
  const foundWorkout = await Workouts.findById(req.params.id) //find the workout by id and save it to a variable called foundWorkout
  res.render('show.ejs', { workout: foundWorkout }) //render the show.ejs template and pass it the foundWorkout variable as "workout"
})

//post route to create a new workout
router.post('/', async (req, res) => {
  try{
  const createdWorkout = await Workouts.create(req.body) //create a new workout with the data from the request body and save it to a variable called created workout
  console.log(createdWorkout) //log the created workout to the console
  res.redirect('/workouts') //redirect to the index route
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})

//put route to update a workout
router.put('/:id', async (req,res) =>{ //:id is the id of the workout we want to update
  try{
    //find the workout by id and update it with the data from the request body
    req.body.exercises = req.body.exercises.split(',')
    const updateWorkout = await Workouts.findByIdAndUpdate(req.params.id, req.body, {new: true})
    console.log(updateWorkout) //log the updated workout to the console
    res.redirect('/workouts' + updatedWorkout.id) //redirect to the show route for the updated workout
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})

//delete route to delete a workout
router.delete('/:id', async (req, res) => {
  try{
    
    const deletedWorkout = await Workouts.findByIdAndRemove(req.params.id) //find the workout by id and delete it
    console.log(deletedWorkout) //log the deleted workout to the console
    res.redirect('/workouts') //redirect to the index route
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})


module.exports = router //export the router with all of the routes defined above