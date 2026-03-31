# Lab Task 2 - Express Based Application

## Objective
Convert the MFES Solar Energy landing page into an Express.js application with EJS templating engine.

## Features Covered
- ✅ Initializing an Express application
- ✅ Setting up EJS as the view engine for rendering HTML pages dynamically
- ✅ Serving static files (CSS, images, client-side JavaScript) from the `public` directory
- ✅ Setting up basic routing for different endpoints

## Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

## Installation & Setup

1. Navigate into the project directory:
```bash
cd labtask-2
```

2. Install the required dependencies:
```bash
npm install
```

This will install:
- **Express.js** - Web framework for Node.js
- **EJS** - Templating engine for dynamic HTML rendering

## Running the Application

### Option 1: Start with Node.js
```bash
npm start
```

### Option 2: Start with Nodemon (Auto-restart on changes)
First, install nodemon globally (if you haven't already):
```bash
npm install -g nodemon
```

Then start the server:
```bash
npm run dev
```
or
```bash
nodemon server.js
```

## Access Your Application
Once the server starts, you'll see:
```
Server Started at http://localhost:3000
```

Visit the following URLs in your browser:
- **Homepage**: [http://localhost:3000/](http://localhost:3000/)
- **Contact**: [http://localhost:3000/contact](http://localhost:3000/contact)

## Project Structure

```
labtask-2/
├── package.json           # Project dependencies and scripts
├── server.js              # Express server configuration
├── views/
│   └── homepage.ejs       # EJS template for landing page
└── public/
    ├── css/
    │   ├── style.css
    │   └── custom.css
    ├── js/
    │   ├── main.js
    │   └── bootstrap.bundle.min.js
    ├── images/            # All landing page images
    └── fonts/             # Web fonts
```

## How EJS Works

EJS (Embedded JavaScript) is a simple templating engine that lets you:

1. **Generate HTML dynamically** with plain JavaScript
2. **Use server-side logic** before sending HTML to browser
3. **Keep views organized** in the `views/` folder

### Key EJS Tags:
- `<%= variable %>` - Output a variable value
- `<% JavaScript code %>` - Execute JavaScript
- `<%- include('partial') %>` - Include other templates

## Static Files & CSS/JS Paths

The `public` folder is exposed to the client. Reference files with `/` prefix:

### CSS Example:
```html
<link rel="stylesheet" href="/css/style.css">
```

### JavaScript Example:
```html
<script src="/js/main.js"></script>
```

### Image Example:
```html
<img src="/images/mfesl.png" alt="Logo">
```

**Note**: Do NOT include `/public/` in the paths - it's served from the root!

## Stopping the Server
Press `Ctrl+C` in the terminal to stop the server.

## Next Steps
- Create separate EJS templates for different pages
- Add dynamic data rendering from databases
- Implement form handling with POST requests
- Add authentication and user sessions

## Technical Stack
- **Server**: Express.js
- **Templating**: EJS
- **Frontend**: HTML5, CSS3, Bootstrap 5
- **Icons**: Font Awesome
- **JavaScript**: Vanilla JS + Bootstrap bundled

---

**Created as Lab Task 2 for Web Technologies Course**
