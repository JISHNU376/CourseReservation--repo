const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

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

app.post('/api/register', (req, res) => {
    const { name, email, courseId } = req.body;
    
    if (!name || !email || !courseId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const course = courses.find(c => c.id === courseId);
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    registrations.push({ name, email, courseId, date: new Date() });
    res.json({ success: true });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
