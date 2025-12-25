# ReactPythonShop

README: E-Commerce API (CS50x Final Project)

Video Demo: https://youtu.be/rQsK8H7JwKM


Description

This project is a robust, full-featured E-Commerce Backend API built using Django and Django REST Framework (DRF). It serves as a comprehensive server-side solution for a digital storefront, featuring custom email-based authentication, JWT security, and external API integration for product data. Unlike standard Django setups, this project implements a Custom User Model that prioritizes email addresses over usernames to align with modern web standards. It also integrates Firebase Admin SDK for cross-platform token verification and includes automated data fetching from the Fake Store API.

🛠 Features
🔐 Custom Authentication System

Email-Based Login: Uses a custom authentication backend to allow users to sign in via email instead of a username.
JWT Security: Implements rest_framework_simplejwt for secure, stateless authentication.
Firebase Integration: Includes utilities to verify ID tokens from Firebase, allowing for seamless integration with mobile or frontend clients.
Password Hashing: A custom UserManager ensures that even with custom creation logic, all passwords are encrypted using Django’s PBKDF2 hashing.

🛒 Shop Management

Product Catalog: Models for products including names, descriptions, pricing, and categories.
Automated Data Seeding: A custom management command (shop_data.py) fetches and populates the database with real product data from an external API.
Cart System: A relational structure linking CustomUser, Cart, and CartItem to manage shopping sessions.

⚙️ Technical Architecture

RESTful Design: Serializers convert complex model instances into JSON for frontend consumption.
CORS Configuration: Pre-configured to handle requests from modern frontend frameworks like React or Vue.
Admin Dashboard: Custom admin classes for easy management of products and user accounts.

📁 Project Structure

api/: Contains the core identity logic, including CustomUser, the authentication backend, and user managers.
shopAPI/: Handles the e-commerce business logic, including Product and Cart models, views, and Firebase utilities.
shop/: The project configuration folder containing settings.py, wsgi.py, and asgi.py.
shop_data.py: A management script to populate the database via the Fake Store API.


A modern e-commerce platform built with React and Python, featuring dynamic cart management, real-time calculations, and integrations for payments. Currently refining the checkout process to ensure secure transactions. This project is my first full-stack build with these technologies, marking a key learning experience
