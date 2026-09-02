from flask import Flask, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect("cookbook.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_database():
    connection = sqlite3.connect("cookbook.db")
    connection.execute("""
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            instructions TEXT
            category TEXT NOT NULL)""")
    connection.execute("""
        CREATE TABLE IF NOT EXISTS ingredients (
            id INTEGER PRIMARY KEY,
            recipe_id INTEGER NOT NULL,
            ingredient TEXT NOT NULL,
            FOREIGN KEY (recipe_id) REFERENCES recipes(id))""")
    connection.commit()
    connection.close()

@app.route("/recipes", methods=["POST"])
def add_recipe():
    data = request.get_json()
    name = data["name"]
    category = data["category"]
    instructions = data["instructions"]
    ingredients = data["ingredients"]
    connection = get_db()
    cursor = connection.execute("""
        INSERT INTO recipes (name, instructions, category)
        VALUES (?, ?, ?)
    """, (name, instructions, category))
    recipe_id = cursor.lastrowid
    for ingredient in ingredients:
        connection.execute("""
            INSERT INTO ingredients (recipe_id, ingredient)
            VALUES (?, ?)
        """, (recipe_id, ingredient))
    connection.commit()
    connection.close()
    return {
        "message": "Recipe added successfully",
        "recipe_id": recipe_id
    }, 201

@app.route("/recipes", methods=["GET"])
def get_recipes():
    connection = get_db()
    recipes = connection.execute("""
        SELECT * FROM recipes
    """).fetchall()
    result = []
    for recipe in recipes:
        ingredients = connection.execute("""
            SELECT ingredient
            FROM ingredients
            WHERE recipe_id = ?
        """, (recipe["id"],)).fetchall()
        result.append({
            "id": recipe["id"],
            "name": recipe["name"],
            "category": recipe["category"],
            "instructions": recipe["instructions"],
            "ingredients": [row["ingredient"] for row in ingredients]})
    connection.close()
    return result

@app.route("/recipes/<int:recipe_id>", methods=["GET"])
def get_one_recipe(recipe_id):
    connection = get_db()
    recipe = connection.execute("""
        SELECT * FROM recipes
        WHERE id = ?
    """, (recipe_id,)).fetchone()
    if recipe is None:
        connection.close()
        return {"error": "Recipe not found"}, 404
    ingredients = connection.execute("""
        SELECT ingredient
        FROM ingredients
        WHERE recipe_id = ?
    """, (recipe_id,)).fetchall()
    connection.close()
    return {
        "id": recipe["id"],
        "name": recipe["name"],
        "category": recipe["category"],
        "instructions": recipe["instructions"],
        "ingredients": [
            ingredient["ingredient"] for ingredient in ingredients]}

@app.route("/recipes/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    connection = get_db()
    connection.execute("""
        DELETE FROM ingredients
        WHERE recipe_id = ?
    """, (recipe_id,))
    connection.execute("""
        DELETE FROM recipes
        WHERE id = ?
    """, (recipe_id,))
    connection.commit()
    connection.close()
    return {"message": "Recipe deleted successfully"}

@app.route("/")
def home():
    return {"message": "Flask Working"}

if __name__ == "__main__":
    create_database()
    app.run(debug=True)