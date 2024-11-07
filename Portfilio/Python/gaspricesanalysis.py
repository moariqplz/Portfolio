import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt

# Step 1: Generate Synthetic Gas Price Data
np.random.seed(42)

# Generating synthetic features (for simplicity, we'll assume these factors affect gas prices)
n_samples = 1000

# Feature 1: Location (categorical, encoded)
locations = ['New York', 'California', 'Texas', 'Florida', 'Ohio']
location = np.random.choice(locations, size=n_samples)

# Feature 2: Day of the week (numerical, cyclic)
days_of_week = np.random.randint(0, 7, size=n_samples)

# Feature 3: Crude oil price (numerical)
crude_oil_price = np.random.uniform(30, 120, size=n_samples)

# Feature 4: Weather condition (categorical)
weather = np.random.choice(['Sunny', 'Rainy', 'Snowy', 'Cloudy'], size=n_samples)

# Feature 5: Gas station popularity (numerical)
gas_station_popularity = np.random.randint(50, 1000, size=n_samples)

# Target variable: Gas prices (numerical)
gas_price = 2.5 + 0.05 * crude_oil_price + 0.02 * gas_station_popularity + np.random.normal(0, 0.2, size=n_samples)

# Create DataFrame
data = pd.DataFrame({
    'Location': location,
    'Day_of_Week': days_of_week,
    'Crude_Oil_Price': crude_oil_price,
    'Weather': weather,
    'Gas_Station_Popularity': gas_station_popularity,
    'Gas_Price': gas_price
})

# Step 2: Data Preprocessing
# 1. Encode categorical variables
le_location = LabelEncoder()
le_weather = LabelEncoder()

data['Location'] = le_location.fit_transform(data['Location'])
data['Weather'] = le_weather.fit_transform(data['Weather'])

# 2. Scale numerical features
scaler = StandardScaler()
data[['Crude_Oil_Price', 'Gas_Station_Popularity']] = scaler.fit_transform(
    data[['Crude_Oil_Price', 'Gas_Station_Popularity']])

# 3. Split into training and testing sets
X = data.drop('Gas_Price', axis=1)
y = data['Gas_Price']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Step 3: Build a Regression Model (Random Forest)
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Step 4: Predictions & Evaluation
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse:.2f}")

# Plot predicted vs. actual values
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], '--r')
plt.xlabel("Actual Gas Prices")
plt.ylabel("Predicted Gas Prices")
plt.title("Actual vs Predicted Gas Prices")
plt.show()

# Step 5: Generative Model (Variational Autoencoder) for Synthetic Gas Price Data

# VAE Model
input_dim = X_train.shape[1]  # Number of input features
latent_dim = 2  # Latent space dimension

# Define the encoder
inputs = tf.keras.layers.Input(shape=(input_dim,))
x = tf.keras.layers.Dense(64, activation='relu')(inputs)
x = tf.keras.layers.Dense(32, activation='relu')(x)
z_mean = tf.keras.layers.Dense(latent_dim)(x)
z_log_var = tf.keras.layers.Dense(latent_dim)(x)

# Sampling function for VAE
def sampling(args):
    z_mean, z_log_var = args
    batch = tf.shape(z_mean)[0]
    dim = tf.shape(z_mean)[1]
    epsilon = tf.keras.backend.random_normal(shape=(batch, dim))
    return z_mean + tf.exp(0.5 * z_log_var) * epsilon

z = tf.keras.layers.Lambda(sampling, output_shape=(latent_dim,))([z_mean, z_log_var])

# Define the decoder
decoder_h = tf.keras.layers.Dense(32, activation='relu')
decoder_mean = tf.keras.layers.Dense(input_dim, activation='linear')  # Change activation to 'linear'

h_decoded = decoder_h(z)
x_decoded_mean = decoder_mean(h_decoded)

# Define the VAE model
encoder = tf.keras.models.Model(inputs, [z_mean, z_log_var])
decoder = tf.keras.models.Model(z, x_decoded_mean)

# Define the VAE loss function
def vae_loss(inputs, x_decoded_mean, z_mean, z_log_var, input_dim):
    # Use mean squared error for continuous data (gas price regression)
    mse_loss = tf.reduce_mean(tf.square(inputs - x_decoded_mean), axis=-1)
    
    # KL divergence loss
    kl_loss = - 0.5 * tf.reduce_mean(z_log_var - tf.square(z_mean) - tf.exp(z_log_var) + 1)
    
    # Combine the losses
    return mse_loss + kl_loss

# Override the call method to compute the loss inside the model
class VAE(tf.keras.Model):
    def __init__(self, encoder, decoder, **kwargs):
        super(VAE, self).__init__(**kwargs)
        self.encoder = encoder
        self.decoder = decoder

    def call(self, inputs):
        # Forward pass through the encoder
        z_mean, z_log_var = self.encoder(inputs)
        z = sampling([z_mean, z_log_var])

        # Forward pass through the decoder
        x_decoded_mean = self.decoder(z)

        # Add loss function here
        self.add_loss(vae_loss(inputs, x_decoded_mean, z_mean, z_log_var, input_dim))

        return x_decoded_mean

# Create the VAE model
vae_model = VAE(encoder, decoder)

# Compile and train the VAE
vae_model.compile(optimizer='adam')
vae_model.fit(X_train, X_train, epochs=50, batch_size=32, validation_split=0.1)

# Sample new synthetic data points from the latent space
z_new = np.random.normal(size=(5, latent_dim))  # Generate 5 new samples
generated_data = decoder_mean(decoder_h(z_new)).numpy()

# Convert the generated synthetic data to a pandas DataFrame with the original column names
generated_data_df = pd.DataFrame(generated_data, columns=X_train.columns)

print("Generated Synthetic Gas Price Data:")
print(generated_data_df)

# Generate new gas price predictions based on synthetic data
new_predictions = model.predict(generated_data_df)
print("Predicted Gas Prices for Generated Data:")
print(new_predictions)
