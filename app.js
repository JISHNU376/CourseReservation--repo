document.addEventListener('DOMContentLoaded', async () => {
    // Fetch courses from backend
    const response = await fetch('/api/courses');
    const courses = await response.json();
    
    // Populate course list
    const courseList = document.getElementById('course-list');
    const courseSelect = document.getElementById('course-select');
    
    courses.forEach(course => {
        // Add to course list display with clickable course-item class and data-id attribute
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item border border-gray-200 rounded-lg p-4 cursor-pointer';
        courseItem.setAttribute('data-id', course.id);
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

    // Add click event listener to course items for navigation to course.html
    courseList.addEventListener('click', (e) => {
        let target = e.target;
        while (target && !target.classList.contains('course-item')) {
            target = target.parentElement;
        }
        if (target && target.classList.contains('course-item')) {
            const courseId = target.getAttribute('data-id');
            window.location.href = `course.html?id=${courseId}`;
        }
    });
    
    // Handle form submission
    document.getElementById('registration-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('student-name').value,
            email: document.getElementById('student-email').value,
            phone: document.getElementById('student-phone').value,
            address: document.getElementById('student-address').value,
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
