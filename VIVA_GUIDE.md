# VIVA GUIDE — Web Technologies Project
### MFES Solar Energy — Super Simple Notes

---

## HOW TO START MONGODB FIRST (Do this EVERY time before running anything)

Open a terminal AS ADMINISTRATOR (right-click -> Run as administrator) and type:
```
net start MongoDB
```
Keep that terminal open. MongoDB must be running before you start any assignment.

---

# ASSIGNMENT 3 — Product Catalog

## What is it?
A website where people can see solar products. They can search, filter by price, filter by category, and go page by page.

## How to run it
```
cd assignment-3
node seed.js       <- run this ONCE to add products to database
npm run dev        <- start the website
```
Then open browser: http://localhost:3000/products

## What to show sir
1. Open the products page — show the product cards with real product images
2. Type something in the search box -> products filter
3. Pick a category from dropdown -> only those products show
4. Type a min/max price -> filters by price
5. Click Next/Previous -> page changes (pagination), no products repeat

## Simple explanation of each thing

**What is Express?**
> Express is a tool that helps us make a website using Node.js. It handles when someone opens a page.

**What is EJS?**
> EJS is like HTML but we can put real data inside it. Like showing product names and images from the database.

**What is MongoDB?**
> MongoDB is a database. It stores all our products. Instead of tables like Excel, it stores data in JSON format.

**What is Mongoose?**
> Mongoose helps us talk to MongoDB from our Node.js code. We use it to find, save, and delete products.

**What is Pagination?**
> Showing products in pages. Instead of showing all 28 at once, we show 8 per page. Like pages in a book.

**What is a Schema?**
> A schema is the structure of data. Like saying "every product must have a name, price, category, rating, stock, image, and description."

**What is a seed file?**
> A script we run once to fill the database with starting data. It deletes old data and inserts fresh products.

**How do product images work?**
> Each product has an image field in the database that stores a path like `/images/products/Jinko 550W Half-Cut Mono Panel.jpeg`. The image files are stored in the `public/images/products/` folder. Express serves them automatically. The EJS template shows them with an `<img>` tag.

---

## Questions sir might ask — Assignment 3

**Q: What does your /products route do?**
> It gets products from MongoDB, applies filters (search, category, price), and sends them to the EJS page to display.

**Q: What fields does your Product schema have?**
> name, price, category, rating, stock, description, image

**Q: How does search work?**
> We use a query parameter `?search=Jinko`. MongoDB then searches for products where the name contains that word using regex.

**Q: How does pagination work?**
> We use `.skip()` and `.limit()` in MongoDB. If page 2 and 8 per page, we skip 8 and show the next 8.

**Q: How do you make sure products don't repeat across pages?**
> We sort by `_id` which is always unique for every product. If we sorted by `createdAt`, all products inserted at the same time would have the same timestamp and MongoDB would shuffle them randomly — causing repeats.

**Q: What are query parameters?**
> Extra information in the URL. Like `/products?page=2&search=panel`. The `?` starts them.

**Q: Where are images stored?**
> In the `public/images/products/` folder. Each image is named exactly after the product. The path is saved in MongoDB and the EJS template displays it.

---
---

# ASSIGNMENT 4 — Admin Panel (CRUD)

## What is it?
A secret admin area where the shop owner can add, edit, and delete products. Normal people cannot access it.

## How to run it
```
cd assignment-4
node seed.js       <- run this ONCE to add products
npm run dev        <- start the website
```
Then open browser: http://localhost:3001/admin

## What to show sir
1. Open `/admin` -> show the dashboard with stats (total products, low stock etc.)
2. Click Add Product -> fill the form -> submit -> product appears in table
3. Click Edit on any product -> change price -> save -> see the change
4. Click Delete -> a popup appears asking "Are you sure?" -> confirm -> product is deleted
5. Show image upload — choose a photo from your computer — it saves and shows in the table

## Simple explanation of each thing

**What is CRUD?**
> Create, Read, Update, Delete. The four basic things you do with data.
> - Create = Add new product
> - Read = See all products
> - Update = Edit a product
> - Delete = Remove a product

**What is Multer?**
> Multer is a tool that lets users upload images/files from their computer to the server. We save the image in the `/public/uploads` folder.

**What is the delete confirmation popup?**
> It's a Bootstrap Modal. When you click Delete, a popup appears and asks "Are you sure?" so you don't delete by accident.

**What is method-override?**
> HTML forms can only do GET and POST. Method-override tricks the form to also do DELETE and PUT methods.

**What is a dashboard?**
> The main admin page that shows a summary. Like total products, how many are low on stock, etc.

**What is validation?**
> Checking if the form is filled correctly before saving. Like making sure price is a number and name is not empty.

---

## Questions sir might ask — Assignment 4

**Q: What is CRUD?**
> Create, Read, Update, Delete — the four operations we do on products.

**Q: How did you upload images?**
> Using Multer. It takes the image from the form, gives it a unique filename, and saves it in `/public/uploads`. The path is saved in the database.

**Q: How does the delete confirmation work?**
> When Delete is clicked, a Bootstrap Modal popup appears with the product name and asks for confirmation. Only if the user clicks "Yes Delete" does the form submit to `/admin/products/delete/:id`.

**Q: What is a middleware?**
> Code that runs between the request and the response. Like a security guard that checks something before letting you in.

**Q: How did you prevent empty form submission?**
> We check each field in the route. If name is empty, price is not a number, etc., we collect errors and show them back on the form without saving.

**Q: Where are uploaded images stored?**
> In the `public/uploads` folder on the server. The file path like `/uploads/filename.jpg` is saved in the database.

---
---

# LAB TASK 3 — Login & Register (Authentication)

## What is it?
Users can create an account and log in. There are two types of users:
- Customer — can browse products and checkout
- Admin — can also access the Admin Panel

If a customer tries to open `/admin`, they get an "Access Denied" page.

## How to run it
```
cd labtask-3
node seed.js       <- creates products AND 2 test users
npm run dev        <- start the website
```
Then open browser: http://localhost:3002

### Ready-made login accounts:
| Who      | Email             | Password    |
|----------|-------------------|-------------|
| Admin    | admin@mfes.com    | admin123    |
| Customer | ali@example.com   | customer123 |

## What to show sir
1. Open the website — show the navbar says "Login / Register" (guest view)
2. Click Register -> create a new account -> automatically logged in -> navbar now shows your name and Logout
3. Logout -> login with ali@example.com -> try to go to /admin -> see Access Denied page
4. Logout -> login with admin@mfes.com -> Admin Panel link appears in navbar -> can access dashboard
5. Show the flash message "Welcome back, Ali Hassan!" after login

## Simple explanation of each thing

**What is Authentication?**
> Checking who you are. Like showing your ID card. Login verifies your email and password.

**What is Authorization?**
> Checking what you are allowed to do. Even after login, a customer cannot access admin pages.

**What is bcrypt?**
> A tool that hashes (scrambles) passwords before saving them in the database. Even if someone steals the database, they cannot read the passwords.

**What is hashing?**
> Turning a password like `admin123` into a random string like `$2b$12$xyz...`. You cannot reverse it back.

**What is a session?**
> After login, the server remembers you by storing your user ID in a session. Like a wristband at an event. Every time you visit a page, the server checks your wristband.

**What is express-session?**
> The tool that creates and manages sessions in Express.

**What is connect-mongo?**
> It saves sessions in MongoDB instead of server memory. So even if you restart the server, you stay logged in.

**What is connect-flash?**
> A tool that shows one-time messages. Like "Welcome back!" after login. The message disappears after you see it once.

**What is RBAC?**
> Role-Based Access Control. Different users get different permissions based on their role (customer or admin).

**What is isLoggedIn middleware?**
> A function that checks "Is this person logged in?" If not, it redirects them to the login page.

**What is isAdmin middleware?**
> A function that checks "Is this person an admin?" If they are a customer, it shows the Access Denied page.

---

## Questions sir might ask — Lab Task 3

**Q: Why do we hash passwords?**
> So that even if the database is stolen, no one can read the real passwords. bcrypt makes it impossible to reverse.

**Q: How does login work step by step?**
> 1. User types email and password
> 2. We find the user in database by email
> 3. We compare the typed password with the hashed one using bcrypt
> 4. If correct -> save user ID in session -> redirect to home
> 5. If wrong -> show error message

**Q: What is a session?**
> A way to remember a user between pages. After login, we store their ID on the server. Every page they visit, we check that ID.

**Q: What is the difference between Authentication and Authorization?**
> Authentication = "Who are you?" (login)
> Authorization = "What can you do?" (admin vs customer)

**Q: How did you protect the admin routes?**
> With `isAdmin` middleware. Every admin route checks `req.session.userRole === "admin"`. If not, shows Access Denied.

**Q: What is a flash message?**
> A one-time message shown after an action. Like "Welcome back!" after login. It disappears after one page load.

**Q: What happens if a guest tries to open /checkout?**
> The `isLoggedIn` middleware catches it, shows a flash error "Please log in", and redirects to the login page.

---
---

# LAB TASK 4 — REST API with JWT

## What is it?
Instead of a website with pages, this is an API — it returns JSON data. Mobile apps and React front-ends use it. Users login and get a token (like a key). They send this key with every request to prove who they are.

## How to run it
```
cd labtask-4
node seed.js       <- adds products and users
npm run dev        <- start the API
```
Open browser: http://localhost:4000/api/v1 — you'll see a list of all endpoints

## What to show sir
Use Postman (or browser for GET routes):

1. GET `http://localhost:4000/api/v1/products` -> show JSON list of products in Postman
2. POST `http://localhost:4000/api/v1/auth/login` with `{ "email": "ali@example.com", "password": "customer123" }` -> receive a token
3. Copy the token. GET `http://localhost:4000/api/v1/user/profile` with header `Authorization: Bearer <token>` -> shows profile
4. Try the same without the token -> get 401 Unauthorized error
5. POST `http://localhost:4000/api/v1/orders` with the token -> place an order

## Simple explanation of each thing

**What is an API?**
> An API is like a waiter in a restaurant. You ask for something (a request), it goes to the kitchen (server/database), and brings back your food (data) in JSON format.

**What is REST?**
> A set of rules for making APIs. It uses HTTP methods:
> - GET = get data
> - POST = create something
> - PUT = update something
> - DELETE = delete something

**What is JSON?**
> JavaScript Object Notation. A format for data that looks like this:
> `{ "name": "Ali", "role": "customer" }`
> APIs send and receive data in this format.

**What is JWT (JSON Web Token)?**
> A token (a long string of letters) that the server gives you after login. You send this token with every request to prove you are logged in. The server can verify it without checking the database every time.

**What is inside a JWT?**
> A JWT has 3 parts separated by dots:
> - Header: the algorithm used
> - Payload: your data (user ID, role, expiry time)
> - Signature: proves the token was not tampered with

**What is Bearer token?**
> When you send a JWT to the server, you put it in the header like this:
> `Authorization: Bearer eyJhbGci...`
> "Bearer" just means "the person holding this token."

**What is the verifyToken middleware?**
> It checks every protected request:
> 1. Is there a token in the header?
> 2. Is the token valid and not expired?
> 3. If yes -> add user info to `req.user` and continue
> 4. If no -> return 401 or 403 error

**What is 401 vs 403?**
> 401 = Not logged in (no token sent)
> 403 = Logged in but not allowed (wrong role, or token expired)

**What is token expiry?**
> JWT tokens have an expiry time. Ours expire in 1 hour (`1h`). After that, the user must login again to get a new token.

**What is stateless?**
> The server does NOT save any session. It just checks the token. This is better for APIs because mobile apps don't use sessions/cookies.

**What is the Order model?**
> When a user orders products, we save: which user ordered, which products, how many, price at that moment, and shipping address.

---

## Questions sir might ask — Lab Task 4

**Q: What is the difference between session-based auth (Lab Task 3) and JWT (Lab Task 4)?**
> Session: Server remembers the user by storing their ID. Needs a database check every time.
> JWT: Server gives a token. The user sends it every time. Server just verifies the token — no database check needed.

**Q: What is JWT?**
> A JSON Web Token. After login, the server creates a token with your user ID and role inside it. You use this token to access protected routes.

**Q: How does verifyToken middleware work?**
> 1. It looks at the `Authorization` header
> 2. Gets the token after "Bearer "
> 3. Checks if the token is valid using `jwt.verify()`
> 4. If valid -> puts user info in `req.user` and moves to the next function
> 5. If not valid -> sends 401 or 403 error

**Q: What happens if someone sends a fake token?**
> `jwt.verify()` will fail because the signature won't match our secret key. The server returns 403 Forbidden.

**Q: Why do tokens expire?**
> For security. If someone steals your token, it only works for a limited time (1 hour). After that it's useless.

**Q: What is the JWT_SECRET?**
> A private key stored in the `.env` file. The server uses it to sign tokens and verify them. Nobody else should know it.

**Q: What endpoints are public and which are protected?**
> Public (no token needed): GET /products, GET /products/:id, POST /auth/login, POST /auth/register
> Protected (token required): GET /user/profile, POST /orders, GET /orders

**Q: What is the payload in your JWT?**
> `{ user_id: "...", role: "customer" }` — the user's ID and their role.

---
---

# QUICK CHEAT SHEET — All Assignments

| Assignment   | What it does                              | Port | Main URL  |
|--------------|-------------------------------------------|------|-----------|
| Assignment 3 | Product catalog with search & pagination  | 3000 | /products |
| Assignment 4 | Admin panel with CRUD & image upload      | 3001 | /admin    |
| Lab Task 3   | Login/Register + session auth + RBAC      | 3002 | /products |
| Lab Task 4   | REST API with JWT tokens                  | 4000 | /api/v1   |

---

# MOST IMPORTANT WORDS TO REMEMBER

| Word           | Simple meaning                                      |
|----------------|-----------------------------------------------------|
| Express        | Tool to make websites with Node.js                  |
| EJS            | HTML that can show real data from database           |
| MongoDB        | Database that stores data like JSON                 |
| Mongoose       | Helper to use MongoDB in our code                   |
| Schema         | Rules for what data looks like                      |
| seed.js        | Script that fills the database with starting data   |
| CRUD           | Create, Read, Update, Delete                        |
| Multer         | Tool for uploading images                           |
| bcrypt         | Tool that hashes (scrambles) passwords              |
| Session        | Server remembers you after login                    |
| JWT            | A token (like a key) given after login              |
| Middleware     | Code that runs before the main function             |
| API            | A way to get data without a full website            |
| JSON           | Data format like `{ "key": "value" }`               |
| Pagination     | Showing data in pages (8 per page)                  |
| sort by _id    | Sort products by unique ID so pages never repeat    |
| Authentication | Verifying who you are (login)                       |
| Authorization  | Checking what you can do (admin/customer)           |
| RBAC           | Different permissions for different roles           |
| 401            | Error: not logged in                                |
| 403            | Error: logged in but not allowed                    |
| Bearer token   | Sending JWT in the Authorization header             |
| static files   | Images/CSS served directly from the public folder   |

---

# TIPS FOR VIVA

1. **Always start MongoDB first** — open terminal as administrator, run `net start MongoDB`
2. **Run seed.js once** in each assignment folder to get data in the database
3. **Show the browser** for Assignments 3, 4, Lab Task 3
4. **Use Postman** for Lab Task 4 (it's an API, no web pages)
5. Each product has its own real image — named exactly after the product, stored in `public/images/products/`
6. Products never repeat across pages because we sort by `_id` (unique for every product)
7. If sir asks "how does X work", just say what happens step by step in simple words
8. **Don't panic** — if you forget something, look at the code and explain what you see

---

*Good luck on your viva! You built all of this — you've got this!*
