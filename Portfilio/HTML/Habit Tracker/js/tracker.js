// Function to load habits from Local Storage
function loadHabits() {
    // Retrieve the saved habits from local storage
    const savedHabits = localStorage.getItem('habits');
    console.log('Loaded habits from tracker:', savedHabits); // Debugging

    // If saved habits exist, parse and return them; otherwise, return an empty array
    return savedHabits ? JSON.parse(savedHabits) : [];
}

// Function to save habits to Local Storage
function saveHabits() {
    console.log('Saving habits:', habits); // Debugging
    // Convert the habits array to a JSON string and store it in local storage
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Initialize habits array by loading any saved habits from Local Storage
let habits = loadHabits(); // Load habits from Local Storage

// DOM elements references
const habitInput = document.getElementById('habit-name'); // Input field for new habit name
const addHabitButton = document.getElementById('add-habit'); // Button to add a new habit
const habitList = document.getElementById('habit-ul'); // List element to display habits

// Function to render the list of habits on the page
function renderHabits() {
    habitList.innerHTML = ''; // Clear the existing habit list

    // Iterate over each habit in the habits array
    habits.forEach((habit, index) => {
        // Create a list item for each habit
        const li = document.createElement('li');
        li.innerHTML = `
            ${habit.name} - Completed: ${habit.completed} - Missed: ${habit.missed}
            <button onclick="markCompleted(${index})">Complete</button>
            <button onclick="markMissed(${index})">Missed</button>
        `;
        // Append the list item to the habit list
        habitList.appendChild(li);
    });
}

// Function to add a new habit
function addHabit() {
    // Get the habit name from the input field and trim any whitespace
    const habitName = habitInput.value.trim();

    // Check if the habit name is not empty
    if (habitName) {
        // Add the new habit to the habits array with initial counts for completed and missed
        habits.push({ name: habitName, completed: 0, missed: 0 });
        habitInput.value = ''; // Clear the input field
        renderHabits(); // Re-render the habit list with the new habit
        saveHabits(); // Save the updated habits array to Local Storage
    } else {
        alert("Habit name cannot be empty"); // Alert the user if the input is empty
    }
}

// Event listener for the Add Habit button to trigger adding a new habit
addHabitButton.addEventListener('click', addHabit);

// Function to mark a habit as completed
function markCompleted(index) {
    // Increment the completed count for the habit at the specified index
    habits[index].completed += 1;
    renderHabits(); // Re-render the habit list with the updated count
    saveHabits(); // Save the updated habits array to Local Storage
}

// Function to mark a habit as missed
function markMissed(index) {
    // Increment the missed count for the habit at the specified index
    habits[index].missed += 1;
    renderHabits(); // Re-render the habit list with the updated count
    saveHabits(); // Save the updated habits array to Local Storage
}

// Initial rendering of habits when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', renderHabits);
