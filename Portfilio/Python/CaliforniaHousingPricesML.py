import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.datasets import fetch_california_housing

# Step 1: Load the dataset
def load_data():
    # Load the California Housing dataset from sklearn
    california = fetch_california_housing()

    # Create a DataFrame
    df = pd.DataFrame(california.data, columns=california.feature_names)
    df['Price'] = california.target
    
    return df

# Step 2: Exploratory Data Analysis (EDA)
def perform_eda(df):
    # Basic statistics of the dataset
    print("Descriptive statistics:\n", df.describe())

    # Correlation matrix to identify relationships between features
    plt.figure(figsize=(12, 8))
    sns.heatmap(df.corr(), annot=True, cmap="coolwarm", fmt=".2f")
    plt.title("Correlation Matrix of Housing Features")
    plt.xlabel('Features')
    plt.ylabel('Features')
    plt.show()

    # Visualizing the target variable 'Price' distribution
    plt.figure(figsize=(8, 6))
    sns.histplot(df['Price'], kde=True, color='blue', bins=30)
    plt.title("Distribution of House Prices")
    plt.xlabel('House Price (in $100,000)')
    plt.ylabel('Frequency')
    plt.show()

# Step 3: Data Preprocessing
def preprocess_data(df):
    # Features (X) and target (y)
    X = df.drop('Price', axis=1)
    y = df['Price']

    # Split data into training and testing sets (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    return X_train, X_test, y_train, y_test

# Step 4: Model Training and Prediction
def train_model(X_train, y_train, X_test):
    # Instantiate the Linear Regression model
    model = LinearRegression()

    # Train the model
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)
    
    return model, y_pred

# Step 5: Model Evaluation
def evaluate_model(y_test, y_pred):
    # Calculate Mean Squared Error (MSE) and R-squared
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Mean Squared Error (MSE): {mse}")
    print(f"R-squared (R²): {r2}")

# Step 6: Visualize the Results
def visualize_results(y_test, y_pred):
    # Visualize the predictions vs actual values
    plt.figure(figsize=(8, 6))
    plt.scatter(y_test, y_pred, color='purple', alpha=0.6)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], color='red', linestyle='--')
    plt.title('Actual vs Predicted House Prices')
    plt.xlabel('Actual House Prices ($100,000)')
    plt.ylabel('Predicted House Prices ($100,000)')
    plt.grid(True)
    plt.show()

def main():
    # Load data
    df = load_data()

    # Perform EDA
    perform_eda(df)

    # Preprocess data
    X_train, X_test, y_train, y_test = preprocess_data(df)

    # Train model and make predictions
    model, y_pred = train_model(X_train, y_train, X_test)

    # Evaluate model performance
    evaluate_model(y_test, y_pred)

    # Visualize results
    visualize_results(y_test, y_pred)

if __name__ == "__main__":
    main()

