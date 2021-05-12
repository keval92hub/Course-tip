const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    review: {
        type: String
    }
});

const courseSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter the course name'],
        unique: true
    },

    description: {
        type: String,
        required: [true, 'Please enter a description']
    },

    reviews: [reviewSchema]

}, {timestamps: true});

const Course = mongoose.model('course', courseSchema);
module.exports = Course;