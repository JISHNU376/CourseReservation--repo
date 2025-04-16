const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');
const db = require('./config/db');

const app = express();
const PORT = 8000;

// Connect to database
db.connect();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Sample data
let courses = [
    { id: 'CS101', name: 'Introduction to Computer Science', description: 'Basic concepts of programming', instructor: 'Dr. Smith', credits: 3 },
    { id: 'MATH201', name: 'Calculus II', description: 'Advanced calculus topics', instructor: 'Prof. Johnson', credits: 4 },
    { id: 'ENG105', name: 'Academic Writing', description: 'Improve your writing skills', instructor: 'Dr. Williams', credits: 3 }
];

let registrations = [];

// API Routes
app.get('/api/courses', (req, res) => {
    res.json(courses);
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

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
