const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
	workout: { type: String },
	reps: { type: String },
	sets: { type: String },
	weight: { type: String },
	date: { type: String },
	notes: { type: String },
});

// create our workout model
const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
