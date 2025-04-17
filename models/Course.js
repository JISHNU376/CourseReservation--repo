const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a course name'],
        trim: true,
        maxlength: [100, 'Course name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a course description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    instructor: {
        type: String,
        required: [true, 'Please add an instructor name']
    },
    credits: {
        type: Number,
        required: [true, 'Please add the number of credits']
    },
    capacity: {
        type: Number,
        required: [true, 'Please add a capacity limit']
    },
    availableSeats: {
        type: Number,
        required: [true, 'Please add available seats'],
        default: function() {
            return this.capacity; // Set available seats to capacity by default
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', CourseSchema);
