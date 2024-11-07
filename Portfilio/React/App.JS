// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

// Define the main functional component of the app
const App = () => {
  // State hook to manage the list of tasks
  const [tasks, setTasks] = useState([]);

  // State hook to manage the input text for adding a new task
  const [taskInput, setTaskInput] = useState('');

  // State hook to manage the ID of the currently selected task (for reading aloud)
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // State hook to manage which filter is selected (All, Active, Completed)
  const [filter, setFilter] = useState('All');

  // useEffect hook to load tasks from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks from AsyncStorage', error);
      }
    };

    loadTasks();
  }, []);

  // Function to add a new task
  const addTask = async () => {
    if (taskInput.trim().length === 0) return;

    const newTask = { id: Date.now().toString(), name: taskInput, completed: false };
    const updatedTasks = [...tasks, newTask];

    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setTaskInput('');
    } catch (error) {
      console.error('Failed to save task to AsyncStorage', error);
    }
  };

  // Function to delete a task
  const deleteTask = async (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      if (selectedTaskId === id) setSelectedTaskId(null);
    } catch (error) {
      console.error('Failed to delete task from AsyncStorage', error);
    }
  };

  // Function to toggle task completion status
  const toggleCompletion = async (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to update task completion in AsyncStorage', error);
    }
  };

  // Function to filter tasks based on the selected filter
  const getFilteredTasks = () => {
    switch (filter) {
      case 'Active':
        return tasks.filter(task => !task.completed);
      case 'Completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  // Function to read task aloud
  const readTask = (task) => {
    Speech.speak(task.name);
  };

  // Render the UI of the app
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>My To-Do List</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={taskInput}
          onChangeText={setTaskInput}
        />

        <Button title="Add Task" onPress={addTask} />

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => setFilter('All')}>
            <Text style={[styles.filterButton, filter === 'All' && styles.activeFilter]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('Active')}>
            <Text style={[styles.filterButton, filter === 'Active' && styles.activeFilter]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('Completed')}>
            <Text style={[styles.filterButton, filter === 'Completed' && styles.activeFilter]}>Completed</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={getFilteredTasks()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <View style={styles.taskContent}>
                <TouchableOpacity onPress={() => toggleCompletion(item.id)}>
                  <Text style={item.completed ? styles.completedText : styles.taskText}>
                    {item.completed ? '✔️' : '⬜'} {item.name}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonGroup}>
                <Button title="Delete" onPress={() => deleteTask(item.id)} />
                <TouchableOpacity onPress={() => setSelectedTaskId(item.id)}>
                  <Text style={styles.selectText}>
                    {item.id === selectedTaskId ? 'Deselect' : 'Select'}
                  </Text>
                </TouchableOpacity>
                <Button title="Read Aloud" onPress={() => readTask(item)} />
              </View>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// Define styles for the app using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  taskItem: {
    marginBottom: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 18,
  },
  completedText: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  buttonGroup: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectText: {
    color: 'blue',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  filterButton: {
    fontSize: 18,
  },
  activeFilter: {
    fontWeight: 'bold',
    color: 'blue',
  },
});

// Export the App component as the default export
export default App;
