# ECommerceWebApp
It has two folders: Frontend, Backend

Setup Instructions:
1. Go to Frontend folder. Run command 'npm install' to install all dependencies for Frontend
2. Go to Backend folder. Run command 'npm install' to install all dependencies for Backend
3. Install database Postgresql from https://www.postgresql.org/
4. Please make changes in db.js in backend folder, as per the database details for appropriate connection
5. Run create table commands for creating tables from db.sql in backend folder

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