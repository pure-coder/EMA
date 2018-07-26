const mongoose = require('mongoose');

// Create Schema
const ExerciseSchema = mongoose.Schema({
    Name: {
        type: String, require: true,
    },
    Details: [
        {
            Metric: { type : String },
            Date: { type: Date }
        }
    ]
},{collection: "Exercise"}, { timestamps: true });


module.exports = mongoose.model('Exercise', ExerciseSchema);