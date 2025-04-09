document.addEventListener('DOMContentLoaded', async () => {
    // Fetch courses from backend
    const response = await fetch('/api/courses');
    const courses = await response.json();
    
    // Populate course list
    const courseList = document.getElementById('course-list');
    const courseSelect = document.getElementById('course-select');
    
    courses.forEach(course => {
        // Add to course list display
        const courseItem = document.createElement('div');
        courseItem.className = 'border border-gray-200 rounded-lg p-4';
        courseItem.innerHTML = `
            <h3 class="font-semibold text-lg">${course.name}</h3>
            <p class="text-gray-600 text-sm mb-2">${course.description}</p>
            <div class="flex justify-between items-center">
                <span class="text-indigo-600 font-medium">${course.instructor}</span>
                <span class="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">${course.credits} credits</span>
            </div>
        `;
        courseList.appendChild(courseItem);
        
        // Add to dropdown
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });
    
    // Handle form submission
    document.getElementById('registration-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('student-name').value,
            email: document.getElementById('student-email').value,
            courseId: document.getElementById('course-select').value
        };
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                alert('Registration successful!');
                e.target.reset();
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
});
