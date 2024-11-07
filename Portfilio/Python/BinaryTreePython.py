import heapq
from collections import defaultdict, Counter

# Define a Node class to represent each character in the tree
class Node:
    def __init__(self, char, freq):
        self.char = char        # Character
        self.freq = freq        # Frequency of the character
        self.left = None        # Left child
        self.right = None       # Right child
    
    # Overloading the less-than operator for heapq
    def __lt__(self, other):
        return self.freq < other.freq

# Build Huffman Tree
def build_huffman_tree(text):
    # Count the frequency of each character in the text
    freq = Counter(text)
    
    # Create a priority queue with nodes for each character
    priority_queue = [Node(char, f) for char, f in freq.items()]
    heapq.heapify(priority_queue)  # Turn list into a heap
    
    # Build the tree until there is only one node left (the root)
    while len(priority_queue) > 1:
        # Remove the two nodes of lowest frequency
        left = heapq.heappop(priority_queue)
        right = heapq.heappop(priority_queue)
        
        # Create a new merged node with these two nodes as children
        merged = Node(None, left.freq + right.freq)
        merged.left = left
        merged.right = right
        
        # Add the merged node back into the priority queue
        heapq.heappush(priority_queue, merged)
    
    # The last remaining node is the root of the Huffman Tree
    return priority_queue[0]

# Generate Huffman Codes
def generate_codes(node, prefix="", code_map={}):
    if node is None:
        return
    
    # If this is a leaf node, store the code
    if node.char is not None:
        code_map[node.char] = prefix
    
    # Traverse the left and right subtrees
    generate_codes(node.left, prefix + "0", code_map)
    generate_codes(node.right, prefix + "1", code_map)
    
    return code_map

# Encode the text using the generated Huffman codes
def encode_text(text, code_map):
    return "".join(code_map[char] for char in text)

# Decode the encoded text
def decode_text(encoded_text, root):
    decoded_text = []
    current = root
    
    for bit in encoded_text:
        if bit == "0":
            current = current.left
        else:
            current = current.right
        
        # When we reach a leaf node, append the character and restart at the root
        if current.left is None and current.right is None:
            decoded_text.append(current.char)
            current = root
    
    return "".join(decoded_text)

# Example Usage
text = "huffman encoding example"
print("Original Text:", text)

# Build Huffman Tree
root = build_huffman_tree(text)

# Generate Huffman Codes
code_map = generate_codes(root)
print("Character Codes:", code_map)

# Encode Text
encoded_text = encode_text(text, code_map)
print("Encoded Text:", encoded_text)

# Decode Text
decoded_text = decode_text(encoded_text, root)
print("Decoded Text:", decoded_text)
