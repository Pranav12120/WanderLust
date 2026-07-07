# WanderLust

WanderLust is a full-stack travel listing web app where users can explore places, create listings, upload images, review stays, and view exact property locations on an interactive map.
Live Demo: https://wanderlust-sfzl.onrender.com (after the link opens, click on explore)

## Features

- User authentication with signup, login, logout
- Create, edit, and delete listings
- Image upload support with Cloudinary
- Review and rating system for listings
- Map integration for listing locations
- Search listings by title, location, or country
- Flash messages and custom error handling
- Session storage in MongoDB

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Frontend: EJS, Bootstrap, CSS, JavaScript
- Auth: Passport, passport-local, passport-local-mongoose
- File Uploads: Multer, Cloudinary
- Maps and Geocoding: MapTiler SDK and MapTiler Geocoding API

## Project Setup

### Prerequisites

- Node.js (recommended: v24.15.0)
- MongoDB Atlas or local MongoDB instance
- Cloudinary account
- MapTiler API key

### Environment Variables

Create a .env file in the project root with:

ATLASDB_URL=your_mongodb_connection_string  
SECRET=your_session_secret  
CLOUD_NAME=your_cloudinary_cloud_name  
CLOUD_API_KEY=your_cloudinary_api_key  
CLOUD_API_SECRET=your_cloudinary_api_secret  
MAP_API_KEY=your_maptiler_api_key

### Installation

1. Clone the repository
2. Install dependencies
3. Start the app

Commands:

npm install --legacy-peer-deps  
node app.js

You can also use nodemon during development.

## Core Modules

- Listings: CRUD operations for travel listings
- Reviews: add and delete reviews on listings
- Users: authentication and session-based login
- Maps: geocode listing location and display marker on listing page
- Search: query listings using destination keywords

## Learning Goals

This project helped me practice:

- Building a complete MVC-based Express application
- Integrating third-party services (Cloudinary and MapTiler)
- Designing authentication and authorization flows
- Managing relational data with Mongoose population
- Handling validations and custom errors

## Future Improvements

- Pagination and advanced filters
- Wishlist or favorites
- Booking workflow
- User profile pages
- Deployment with CI/CD

## Author

Pranav Kumar Dawande
