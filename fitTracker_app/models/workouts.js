const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    workout: { type: String, required: true },
    reps: { type: String, required: true},
    sets: { type: String, required: true},
    weight: { type: String, required: true},
    date: { type: String, required: true},
    notes: { type: String, required: true}
})

// create our workout model
const Workout = mongoose.model('Workout', workoutSchema)

module.exports = Workout