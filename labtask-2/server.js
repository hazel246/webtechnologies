// Import the express module
let express = require("express");

// Initialize an express application
let app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", "./views");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Define a route for the root URL ('/')
app.get("/", function (req, res) {
  // Render the 'homepage.ejs' view
  return res.render("homepage");
});

// Define a route for the contact page
app.get("/contact", function (req, res) {
  // Render the 'contact.ejs' view (optional)
  return res.render("homepage"); // Can create separate contact page later
});

// 404 Error Handling - Route not found
app.use((req, res) => {
  res.status(404).render("homepage");
});

// Start the server on port 3000
app.listen(3000, function () {
  console.log("Server Started at http://localhost:3000");
  console.log("Press Ctrl+C to stop the server");
});

// Log a message to indicate that the server.js file is being executed
console.log("Console from server.js file");
