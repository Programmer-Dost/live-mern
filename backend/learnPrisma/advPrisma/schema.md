For the users table:

id: 1
name: "John Doe"
email: "john@example.com"
password: "password123"


<br />
For the products table:

id: 1
name: "T-shirt"
description: "Comfortable cotton T-shirt"
price: 19.99

<br />
For the orders table:

id: 1
user_id: 1 (referring to the user with id 1)
total_price: 19.99
status: "PENDING"

<br />
For the order_items table:


id: 1
order_id: 1 (referring to the order with id 1)
product_id: 1 (referring to the product with id 1)
quantity: 1
price: 19.99

<br /><br />
With this example data, we have:

John Doe as the user who placed an order.
One product, a T-shirt, with a price of $19.99.
One order with a total price of $19.99 and status "PENDING".
An order item that belongs to the order, containing one T-shirt.

<br/><br/>
Steps to add new data:
Step 1: Create a new user
Step 2: Create new product
Step 3: Create new order having user_id
Steps 4: Create order_items having order_id and product_id