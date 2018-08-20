const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = mongoose.Schema({
    user: {
            type: Schema.Types.ObjectId,
            ref: 'Clients'
        },
        handle: {
            type: String,
            required: true,
            max: 40 // maximum characters for handle
        },
        about: {
            fitness_goals: {
                type: String
            },
            injures: {
                type: String
            },
            health: {
                type: String
            },
            notes: {
                type: String
            }
        },
        weight: {
            metrics: [
                {
                    weight: {
                        type: String,
                        required: true
                    },
                    date: {
                        type: String,
                        required: true
                    }
                }
            ]

        },
        measurements: [
            {
                body_part: {
                    type: String,
                    required, true
                },
                metrics: [
                    {
                        measurement: {
                            type: String,
                            required: true
                        },
                        date: {
                            type: Date,
                            required: true
                        }
                    }
                ]
            }
        ],
        progression_metrics: [
            {
                exercise: {
                    type: String,
                    required: true
                },
                metrics: [
                    {
                        weight:{
                            type: String,
                            required: true
                        },
                        date:
                            {
                                type: Date,
                                required: true
                            }
                    }
                ]
            }
        ]
    }
,{collection: "Profiles"}, { timestamps: true });


module.exports = Profile = mongoose.model('Profile', ProfileSchema);