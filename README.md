# ECommerceWebApp
It has two folders: Frontend, Backend

Setup Instructions:
1. Go to Frontend folder. Run command 'npm install' to install all dependencies for Frontend
2. Go to Backend folder. Run command 'npm install' to install all dependencies for Backend
3. Install database Postgresql from https://www.postgresql.org/
4. Please create .env file inside the backend folder parallel to db.js, index.js inside the backend folder
5. Please define the variable DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_NAME according to your database.
6. Please define the variable PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_BASE_URL according to your PayPal Account
7. Please define the variable BACK_URL, FRONT_URL as where your backend and frontend are running respectively
8. Run create table commands for creating tables from db.sql in backend folder

To Run the app:
Backend: Go to Backend folder. Execute command "npm start". The backend will run at port 8000. We can access it localhost:8000
Frontend: Go to Frontend folder. Execute command "npm start". The Frontend will run at port 3000. We can access it localhost:3000

Implemented features
1. Insertion of basic tables data in database
2. Creation of session when user lands on the start page
3. Load of products from database
4. Add to cart
5. Searching of products
6. Save of orders, order details and payment details
7. Integration of PayPal payment gateway