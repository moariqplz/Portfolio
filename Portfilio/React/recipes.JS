// Import necessary libraries and components
import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as Speech from 'expo-speech'; 

// Define the main functional component of the app
const App = () => {
  // State hooks
  const [recipes, setRecipes] = useState([]);
  const [recipeInput, setRecipeInput] = useState('');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [cookTimeInput, setCookTimeInput] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  // useEffect hook to load recipes from AsyncStorage
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const savedRecipes = await AsyncStorage.getItem('recipes');
        if (savedRecipes) {
          setRecipes(JSON.parse(savedRecipes));
        }
      } catch (error) {
        console.error('Failed to load recipes from AsyncStorage', error);
      }
    };
    loadRecipes();
  }, []);

  // Function to add a new recipe
  const addRecipe = async () => {
    if (recipeInput.trim().length === 0 || ingredientsInput.trim().length === 0 || cookTimeInput.trim().length === 0) return;

    const newRecipe = {
      id: Date.now().toString(),
      name: recipeInput,
      ingredients: ingredientsInput.split(',').map(ingredient => ingredient.trim()), // Split ingredients by commas and store as an array
      cookTime: cookTimeInput,
    };

    const updatedRecipes = [...recipes, newRecipe];

    try {
      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
      setRecipeInput('');
      setIngredientsInput('');
      setCookTimeInput('');
    } catch (error) {
      console.error('Failed to save recipe to AsyncStorage', error);
    }
  };

  // Function to delete a recipe
  const deleteRecipe = async (id) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    try {
      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
      if (selectedRecipeId === id) {
        setSelectedRecipeId(null);
      }
    } catch (error) {
      console.error('Failed to delete recipe from AsyncStorage', error);
    }
  };

  // Function to use TTS to read the recipe title and ingredients aloud
  const readRecipe = (recipe) => {
    const recipeTitle = `Recipe Name: ${recipe.name}`;
    const ingredientsList = `Ingredients: ${recipe.ingredients.join(', ')}`;

    // Speak the recipe title and ingredients
    Speech.speak(`${recipeTitle}. ${ingredientsList}`);
  };

  // Function to select or deselect a recipe
  const selectRecipe = (id) => {
    setSelectedRecipeId(id);
  };

  // Render the UI of the app
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Recipe App</Text>
        </View>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Add a new recipe"
          value={recipeInput}
          onChangeText={setRecipeInput}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Add ingredients (comma separated)"
          value={ingredientsInput}
          onChangeText={setIngredientsInput}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Cook time (in minutes)"
          value={cookTimeInput}
          onChangeText={setCookTimeInput}
        />

        <Button title="Add Recipe" onPress={addRecipe} />

        {/* Recipe List */}
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.recipeItem}>
              <View>
                <Text style={styles.recipeText}>{item.name}</Text>

                {/* Render Ingredients in List Format */}
                <Text style={styles.recipeDetails}>Ingredients:</Text>
                <FlatList
                  data={item.ingredients}
                  keyExtractor={(ingredient, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Text style={styles.ingredientText}>- {item}</Text> // List each ingredient
                  )}
                />
                
                {/* Display Cook Time */}
                <Text style={styles.recipeDetails}>Cook Time: {item.cookTime} mins</Text>
              </View>

              <View style={styles.buttonGroup}>
                <Button title="Delete" onPress={() => deleteRecipe(item.id)} />
                <TouchableOpacity onPress={() => selectRecipe(item.id)}>
                  <Text style={styles.selectText}>
                    {item.id === selectedRecipeId ? 'Deselect' : 'Select'}
                  </Text>
                </TouchableOpacity>
                <Button title="Read Aloud" onPress={() => readRecipe(item)} />
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
  recipeItem: {
    marginBottom: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  recipeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDetails: {
    fontSize: 16,
    marginTop: 4,
  },
  ingredientText: {
    fontSize: 16,
    marginLeft: 10,
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
});

// Export the App component as the default export
export default App;
