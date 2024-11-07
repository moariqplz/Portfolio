class Node:
    def __init__(self, url):
        self.url = url          # Store the URL of the webpage
        self.prev = None        # Pointer to the previous page
        self.next = None        # Pointer to the next page

class BrowserHistory:
    def __init__(self, homepage):
        # Initialize the browser history with the homepage
        self.current = Node(homepage)

    def visit(self, url):
        # Visit a new URL
        new_page = Node(url)
        # Set the current page's next to the new page
        self.current.next = new_page
        # Set the new page's prev to the current page
        new_page.prev = self.current
        # Move to the new page
        self.current = new_page
        print(f"Visited: {url}")

    def back(self, steps):
        # Move back 'steps' number of pages, if possible
        while steps > 0 and self.current.prev is not None:
            self.current = self.current.prev
            steps -= 1
        print(f"Current page after going back: {self.current.url}")
        return self.current.url

    def forward(self, steps):
        # Move forward 'steps' number of pages, if possible
        while steps > 0 and self.current.next is not None:
            self.current = self.current.next
            steps -= 1
        print(f"Current page after going forward: {self.current.url}")
        return self.current.url

# Example Usage
history = BrowserHistory("home.com")

# Visit new pages
history.visit("page1.com")
history.visit("page2.com")
history.visit("page3.com")

# Go back in history
history.back(1)   # Should go to "page2.com"
history.back(1)   # Should go to "page1.com"

# Go forward in history
history.forward(1)  # Should go to "page2.com"

# Visit a new page (this clears forward history beyond the current point)
history.visit("page4.com")

# Try going forward (but there is no forward history now)
history.forward(1)  # Should stay on "page4.com"
