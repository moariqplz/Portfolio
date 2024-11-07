// Function to load habits from Local Storage
function loadHabits() {
    // Retrieve the saved habits from local storage
    const savedHabits = localStorage.getItem('habits');
    console.log('Loaded habits from progress:', savedHabits); // Debugging

    // If saved habits exist, parse and return them; otherwise, return an empty array
    return savedHabits ? JSON.parse(savedHabits) : [];
}

// Function to render the progress chart using Chart.js
function renderChart() {
    // Load the habits data
    const habits = loadHabits();
    
    // Check if there are any habits to display
    if (habits.length === 0) {
        console.log('No habits found'); // Debugging
        return; // Exit the function if no habits are found
    }

    // Extract habit names for chart labels
    const labels = habits.map(habit => habit.name);
    // Extract completed and missed data for the chart
    const completedData = habits.map(habit => habit.completed);
    const missedData = habits.map(habit => habit.missed);

    console.log('Labels:', labels); // Debugging
    console.log('Completed data:', completedData); // Debugging
    console.log('Missed data:', missedData); // Debugging

    // Get the context of the canvas element where the chart will be rendered
    const ctx = document.getElementById('progress-chart-canvas').getContext('2d');

    // If a chart already exists, destroy it to prevent overlap
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Create a new bar chart using the loaded data
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, // Set the habit names as labels
            datasets: [
                {
                    label: 'Completed',
                    data: completedData, // Set the completed habits data
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Missed',
                    data: missedData, // Set the missed habits data
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true, // Make the chart responsive
            scales: {
                y: {
                    beginAtZero: true // Start the y-axis at zero
                }
            }
        }
    });
}

// Render the chart when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', renderChart);
// Function to load habits from Local Storage
function loadHabits() {
    // Retrieve the saved habits from local storage
    const savedHabits = localStorage.getItem('habits');
    console.log('Loaded habits from progress:', savedHabits); // Debugging

    // If saved habits exist, parse and return them; otherwise, return an empty array
    return savedHabits ? JSON.parse(savedHabits) : [];
}

// Function to render the progress chart using Chart.js
function renderChart() {
    // Load the habits data
    const habits = loadHabits();
    
    // Check if there are any habits to display
    if (habits.length === 0) {
        console.log('No habits found'); // Debugging
        return; // Exit the function if no habits are found
    }

    // Extract habit names for chart labels
    const labels = habits.map(habit => habit.name);
    // Extract completed and missed data for the chart
    const completedData = habits.map(habit => habit.completed);
    const missedData = habits.map(habit => habit.missed);

    console.log('Labels:', labels); // Debugging
    console.log('Completed data:', completedData); // Debugging
    console.log('Missed data:', missedData); // Debugging

    // Get the context of the canvas element where the chart will be rendered
    const ctx = document.getElementById('progress-chart-canvas').getContext('2d');

    // If a chart already exists, destroy it to prevent overlap
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Create a new bar chart using the loaded data
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, // Set the habit names as labels
            datasets: [
                {
                    label: 'Completed',
                    data: completedData, // Set the completed habits data
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Missed',
                    data: missedData, // Set the missed habits data
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true, // Make the chart responsive
            scales: {
                y: {
                    beginAtZero: true // Start the y-axis at zero
                }
            }
        }
    });
}

// Render the chart when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', renderChart);
