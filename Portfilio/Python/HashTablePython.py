# Define a hash table (dictionary) for store inventory
inventory = {
    "apple": 50,     # Key: "apple", Value: 50
    "banana": 30,    # Key: "banana", Value: 30
    "orange": 100,   # Key: "orange", Value: 100
    "grapes": 40     # Key: "grapes", Value: 40
}

# Function to add or update inventory
def update_inventory(item, quantity):
    if item in inventory:
        inventory[item] += quantity
    else:
        inventory[item] = quantity
    print(f"Updated inventory: {item} - {inventory[item]} units")

# Function to check inventory for an item
def check_inventory(item):
    return inventory.get(item, 0)  # Returns 0 if item is not found

# Function to remove item from inventory
def remove_item(item):
    if item in inventory:
        del inventory[item]
        print(f"{item} has been removed from inventory.")
    else:
        print(f"{item} not found in inventory.")

# Example Usage
print("Initial Inventory:", inventory)
update_inventory("banana", 20)      # Increase banana stock by 20
update_inventory("pear", 15)         # Add a new item "pear" with 15 units
print("Inventory of apples:", check_inventory("apple"))  # Check apple stock
remove_item("grapes")                # Remove grapes from inventory
print("Final Inventory:", inventory)

class HashTable:
    def __init__(self, size=10):
        # Initialize the hash table with a fixed-size list of empty buckets
        self.size = size
        self.table = [[] for _ in range(size)]
        
    def _hash(self, key):
        # Simple hash function: compute hash based on the key and table size
        return hash(key) % self.size

    def insert(self, key, value):
        # Insert a key-value pair into the hash table
        index = self._hash(key)
        # Check if the key already exists and update it if so
        for pair in self.table[index]:
            if pair[0] == key:
                pair[1] = value
                return
        # Otherwise, append the new key-value pair to the bucket
        self.table[index].append([key, value])

    def get(self, key):
        # Retrieve the value for a given key
        index = self._hash(key)
        # Search for the key in the bucket and return the value if found
        for pair in self.table[index]:
            if pair[0] == key:
                return pair[1]
        # Return None if the key is not found
        return None

    def delete(self, key):
        # Delete a key-value pair from the hash table
        index = self._hash(key)
        # Search for the key in the bucket
        for i, pair in enumerate(self.table[index]):
            if pair[0] == key:
                # Remove the pair from the bucket
                del self.table[index][i]
                return True
        return False

    def display(self):
        # Display the contents of the hash table
        for i, bucket in enumerate(self.table):
            if bucket:
                print(f"Bucket {i}: {bucket}")

# Example Usage
hash_table = HashTable()

# Insert key-value pairs
hash_table.insert("apple", 50)
hash_table.insert("banana", 30)
hash_table.insert("orange", 100)
hash_table.insert("grapes", 40)

# Display the table
print("Initial Hash Table:")
hash_table.display()

# Retrieve values
print("\nRetrieve values:")
print("apple:", hash_table.get("apple"))
print("banana:", hash_table.get("banana"))

# Update a value
hash_table.insert("apple", 60)
print("\nAfter updating 'apple':")
hash_table.display()

# Delete a key
hash_table.delete("grapes")
print("\nAfter deleting 'grapes':")
hash_table.display()
