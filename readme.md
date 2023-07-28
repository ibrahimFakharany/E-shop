# This Node.js backend API is written in JavaScript using the Express framework.

## It provides a comprehensive REST API for managing a variety of business entities, including:

* Categories
* Brands
* Products
* Users
* Carts
* Coupons
* Reviews
* Orders
* Favorites

## The API is secured using JSON Web Tokens (JWTs).

## To authenticate, a user must provide a valid JWT in the HTTP header.

## The API is deployed on an AWS EC2 instance. To access it, you can use the following URL:

http://16.171.132.148:8787/api/v1/

### For example 

Method POST, END POINT http://16.171.132.148:8787/api/v1/categories to add new category
Method GET, END POINT http://16.171.132.148:8787/api/v1/categories?page=1&limit=20&sold[lt]=30&sort=sold to list categories with specified critria


## Here is the list of all the libraries that the project uses:

* Express
* Dotenv
* Mongoose
* Slugify
* Express-async-handler
* Express-validator
* Nodemon
* Multer
* UUID
* Sharp
* JSONWebToken
* Nodemailer
* Compression
* Cors
* Morgan
* JWT
* Crypto
* Bcrypt