document.addEventListener('DOMContentLoaded', () => {
    const talksData = [
        {
            title: "The Future of AI in Software Development",
            speakers: ["Dr. Ada Lovelace"],
            categories: ["AI", "Software Engineering"],
            duration: 60,
            description: "Explore the transformative impact of artificial intelligence on modern software development practices, tools, and methodologies."
        },
        {
            title: "Understanding Serverless Architectures",
            speakers: ["Grace Hopper"],
            categories: ["Cloud", "Architecture"],
            duration: 60,
            description: "A deep dive into serverless computing, covering FaaS, BaaS, benefits, challenges, and best practices for building scalable applications."
        },
        {
            title: "WebAssembly: Beyond the Browser",
            speakers: ["Alan Turing", "Linus Torvalds"],
            categories: ["Web Development", "Performance"],
            duration: 60,
            description: "Discover the power of WebAssembly (Wasm) not just in web browsers, but in various environments, enabling high-performance, portable code."
        },
        {
            title: "Advanced JavaScript Patterns",
            speakers: ["Brendan Eich"],
            categories: ["JavaScript", "Web Development"],
            duration: 60,
            description: "Uncover sophisticated JavaScript patterns and techniques to write cleaner, more maintainable, and efficient front-end code."
        },
        {
            title: "Containerization with Kubernetes",
            speakers: ["Bjarne Stroustrup"],
            categories: ["DevOps", "Cloud", "Containers"],
            duration: 60,
            description: "Master the essentials of container orchestration using Kubernetes, from deployment to scaling and management of microservices."
        },
        {
            title: "Ethical Hacking for Developers",
            speakers: ["Kevin Mitnick"],
            categories: ["Security", "Development"],
            duration: 60,
            description: "Learn fundamental ethical hacking techniques and security best practices to build more resilient and secure software systems."
        }
    ];

    const eventStartTime = new Date();
    eventStartTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('categorySearch');
    const searchButton = document.getElementById('searchButton');
    const resetButton = document.getElementById('resetButton');

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function calculateSchedule(talks) {
        let currentTime = new Date(eventStartTime);
        const schedule = [];
        const numTalksBeforeLunch = 3;

        talks.forEach((talk, index) => {
            if (index === numTalksBeforeLunch) {
                // Add lunch break
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60 * 1000); // 1 hour lunch
                schedule.push({
                    type: 'break',
                    title: 'Lunch Break',
                    time: `${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}`,
                    duration: 60
                });
                currentTime = new Date(lunchEndTime); // Update current time after lunch
            }

            // Add talk
            const talkStartTime = new Date(currentTime);
            const talkEndTime = new Date(talkStartTime.getTime() + talk.duration * 60 * 1000); // Talk duration
            schedule.push({
                type: 'talk',
                ...talk,
                time: `${formatTime(talkStartTime)} - ${formatTime(talkEndTime)}`
            });
            currentTime = new Date(talkEndTime.getTime() + 10 * 60 * 1000); // 10 minute transition
        });
        return schedule;
    }

    function renderSchedule(filteredTalks = talksData) {
        scheduleContainer.innerHTML = '<h2>Event Schedule</h2>'; // Clear previous schedule

        const currentSchedule = calculateSchedule(filteredTalks);

        currentSchedule.forEach(item => {
            if (item.type === 'talk') {
                const talkElement = document.createElement('div');
                talkElement.classList.add('talk-card');
                talkElement.innerHTML = `
                    <span class="time">${item.time}</span>
                    <h3>${item.title}</h3>
                    <p class="speakers">Speakers: ${item.speakers.join(', ')}</p>
                    <p class="categories">Categories: ${item.categories.join(', ')}</p>
                    <p>${item.description}</p>
                `;
                scheduleContainer.appendChild(talkElement);
            } else if (item.type === 'break') {
                const breakElement = document.createElement('div');
                breakElement.classList.add('lunch-break');
                breakElement.innerHTML = `
                    <p>${item.time} - ${item.title}</p>
                `;
                scheduleContainer.appendChild(breakElement);
            }
        });

        if (filteredTalks.length === 0 && searchInput.value !== '') {
            scheduleContainer.innerHTML += '<p style="text-align: center; margin-top: 20px;">No talks found for this category.</p>';
        }
    }

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            const filteredTalks = talksData.filter(talk =>
                talk.categories.some(category => category.toLowerCase().includes(searchTerm))
            );
            renderSchedule(filteredTalks);
        } else {
            renderSchedule(); // Render all talks if search term is empty
        }
    });

    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        renderSchedule();
    });

    // Initial render of the full schedule
    renderSchedule();
});
