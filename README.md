# Olivia's Cookbook

    Olivia's Cookbook is a full-stack web application for storing, organizing, and viewing recipes. Users can add recipes with ingredients, instructions, and categories, search for recipes, and view individual recipe pages. The homepage also features a Recipe of the Day.

# Features
    Add and save recipes
    Organize recipes into Main, Side, and Dessert categories
    Add multiple ingredients to each recipe
    View individual recipe pages
    Edit existing recipes
    Delete recipes
    Search for recipes
    Recipe of the Day that automatically changes each day
    Store recipes using a SQLite database
    Technologies

# Frontend

    1. React
    2. JavaScript
    3. HTML
    4. CSS
    5. Vite

# Backend

    1. Python
    2. Flask
    3. Flask-CORS

# Database

    SQLite
    Project Structure
    cookbook/
    ├── frontend/
    │   ├── src/
    │   │   ├── pages/
    │   │   │   ├── Recipes.jsx
    │   │   │   ├── OneRecipe.jsx
    │   │   │   ├── Search.jsx
    │   │   │   └── EditRecipes.jsx
    │   │   ├── App.jsx
    │   │   └── App.css
    │   └── ...
    │
    ├── backend/
    │   ├── app.py
    │   └── cookbook.db
    │
    └── README.md
    How to Run

# Backend

    Navigate to the backend folder: cd backend
    Start the Flask server: python app.py
    The backend runs at:http://127.0.0.1:5000

# Frontend

    In a separate terminal, navigate to the frontend folder: cd frontend
    Install the dependencies:npm install
    Start the development server: npm run dev
    Then open the local URL provided by Vite in your browser.