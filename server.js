const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');
const db = require('./config/db');

const app = express();
const PORT = 8000;

// Connect to database
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Sample data
let courses = [
    { id: 'CS101', name: 'Introduction to Computer Science', description: 'Basic concepts of programming', instructor: 'Dr. Smith', credits: 3 },
    { id: 'MATH201', name: 'Calculus II', description: 'Advanced calculus topics', instructor: 'Prof. Johnson', credits: 4 },
    { id: 'ENG105', name: 'Academic Writing', description: 'Improve your writing skills', instructor: 'Dr. Williams', credits: 3 }
];

const Course = require('./models/Course');
let registrations = [];

// API Routes for Course Management
app.post('/api/courses', async (req, res) => {
    const { name, description, instructor, credits, capacity } = req.body;
    try {
        const course = await Course.create({ name, description, instructor, credits, capacity });
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/courses/:id', async (req, res) => {
    const { name, description, instructor, credits, capacity } = req.body;
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, { name, description, instructor, credits, capacity }, { new: true, runValidators: true });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting course' });
    }
});

// API Routes
app.get('/api/courses', (req, res) => {
    res.json(courses);
});

// New route to get course details by id
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
});

app.post('/api/register', async (req, res) => {
    const { name, email, phone, address, courseId } = req.body;
    
    if (!name || !email || !phone || !address || !courseId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const course = courses.find(c => c.id === courseId);
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    // Store in in-memory registrations array
    registrations.push({ name, email, phone, address, courseId, date: new Date() });
    
    // Create new user in database
    try {
        const user = new User({
            name,
            email,
            phone,
            address,
            role: 'student',
            password: 'defaultpassword' // You may want to handle password properly
        });
        await user.save();
    } catch (error) {
        return res.status(500).json({ error: 'Error saving user to database' });
    }
    
    res.json({ success: true });
});

// Simple login API route (mock authentication)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }
    // For demo, accept any email/password combination where password is 'password'
    if (password === 'password') {
        return res.json({ success: true });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Serve login.html as root page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve other frontend pages
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/course.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'course.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
