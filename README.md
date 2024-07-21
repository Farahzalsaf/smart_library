# smart-library

## Overview 

The Smart Library API is a RESTful service designed to manage a bookstore inventory. This API supports key operations for books, authors, users, and personalized book recommendations. It emphasizes robust authentication and authorization mechanisms, clean code practices, proper error handling, and comprehensive documentation.

## Key features 
* Inventory Management: CRUD operations for books and authors.
* User Management: User registration, authentication, and profile management.
* Book Recommendations: Personalized book suggestions based on user preferences.
* Security: Ensures that only authenticated users can modify inventory data.
* Testing: Comprehensive unit and integration tests for all endpoints.


## User stories

## User: 
* Manage Books: Add, update, and delete books from the inventory.

* Manage Authors: Add, update, and delete authors from the system.

* Monitor Users: View a list of registered users and their activities.

## Developer:
* Access API Documentation: Understand endpoints, request formats, and response structures.

* Test API Endpoints: Verify the correctness and reliability of the API.

* Handle Errors Gracefully: Provide meaningful error messages and appropriate HTTP status codes.


## System:
* Authenticate Users: Verify user credentials and provide secure access tokens (JWTs).

* Authorize Actions: Restrict access to certain endpoints based on user roles.


## API Endpoints
## Books
* GET /books: Retrieve a list of all books.
* GET /books/:id: Retrieve details of a specific book by its ID.
* POST /books: Create a new book record (Admin only).
* PUT /books/:id: Update an existing book record by its ID (Admin only).
* DELETE /books/:id: Delete a book record by its ID (Admin only).

## Authors
* GET /authors: Retrieve a list of all authors.
* GET /authors/:id: Retrieve details of a specific author by their ID.
* POST /authors: Create a new author record (Admin only).
* PUT /authors/:id: Update an existing author record by their ID (Admin only).
* DELETE /authors/:id: Delete an author record by their ID (Admin only).

## Users
* POST /users/register: Register a new user.
* POST /users/login: Authenticate a user and return a JWT.
* GET /users/me: Retrieve the authenticated user's details.
* PUT /users/me: Update the authenticated user's information.

## Recommendations
* GET /recommendations: Retrieve book recommendations for the authenticated user based on their preferences.

## Error Handling
* Implement proper error handling for all endpoints.
* Return appropriate HTTP status codes and error messages for different scenarios (e.g., resource not found, validation errors).

## Technical Stack
* Programming Language: Python
* Framework: FastAPI
* Database: PostgreSQL
* ORM: SQLAlchemy
* Docker 
