import os
import sqlite3
from datetime import date

from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

# Where the database lives. On a host with a persistent disk, set DB_PATH to a
# path on that disk (e.g. /var/data/cookbook.db). Defaults to next to this file.
DB_PATH = os.environ.get(
    "DB_PATH", os.path.join(os.path.dirname(os.path.abspath(__file__)), "cookbook.db")
)

# Optional shared secret. If API_KEY is set, POST/PUT/DELETE require a matching
# X-API-Key header. Leave unset to disable (e.g. local development).
API_KEY = os.environ.get("API_KEY", "")

# Open to any origin (same as before); the API key is what protects writes.
CORS(
    app,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-API-Key"],
)


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def create_database():
    connection = sqlite3.connect(DB_PATH)
    connection.execute("""
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            instructions TEXT,
            category TEXT NOT NULL)""")
    connection.execute("""
        CREATE TABLE IF NOT EXISTS ingredients (
            id INTEGER PRIMARY KEY,
            recipe_id INTEGER NOT NULL,
            ingredient TEXT NOT NULL,
            FOREIGN KEY (recipe_id) REFERENCES recipes(id))""")
    connection.commit()
    connection.close()


# Run at import time so it also works under gunicorn.
create_database()


@app.before_request
def require_api_key():
    if API_KEY and request.method in ("POST", "PUT", "DELETE"):
        if request.headers.get("X-API-Key") != API_KEY:
            return {"error": "Unauthorized"}, 401


def read_recipe_payload():
    """Validate and return (name, category, instructions, ingredients) or an error tuple."""
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    category = data.get("category")
    instructions = data.get("instructions") or ""
    ingredients = data.get("ingredients") or []
    if not name:
        return None, ({"error": "Name is required"}, 400)
    if category not in ("Main", "Side", "Dessert"):
        return None, ({"error": "Invalid category"}, 400)
    if not isinstance(ingredients, list):
        return None, ({"error": "Ingredients must be a list"}, 400)
    ingredients = [str(i).strip() for i in ingredients if str(i).strip()]
    return (name, category, instructions, ingredients), None


@app.route("/recipes", methods=["POST"])
def add_recipe():
    payload, error = read_recipe_payload()
    if error:
        return error
    name, category, instructions, ingredients = payload
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
    recipes = connection.execute("SELECT * FROM recipes ORDER BY name COLLATE NOCASE").fetchall()
    ingredient_rows = connection.execute(
        "SELECT recipe_id, ingredient FROM ingredients ORDER BY id"
    ).fetchall()
    connection.close()
    by_recipe = {}
    for row in ingredient_rows:
        by_recipe.setdefault(row["recipe_id"], []).append(row["ingredient"])
    return [
        {
            "id": r["id"],
            "name": r["name"],
            "category": r["category"],
            "instructions": r["instructions"] or "",
            "ingredients": by_recipe.get(r["id"], []),
        }
        for r in recipes
    ]


@app.route("/recipes/<int:recipe_id>", methods=["GET"])
def get_one_recipe(recipe_id):
    connection = get_db()
    recipe = connection.execute(
        "SELECT * FROM recipes WHERE id = ?", (recipe_id,)
    ).fetchone()
    if recipe is None:
        connection.close()
        return {"error": "Recipe not found"}, 404
    ingredients = connection.execute(
        "SELECT ingredient FROM ingredients WHERE recipe_id = ? ORDER BY id",
        (recipe_id,),
    ).fetchall()
    connection.close()
    return {
        "id": recipe["id"],
        "name": recipe["name"],
        "category": recipe["category"],
        "instructions": recipe["instructions"] or "",
        "ingredients": [row["ingredient"] for row in ingredients],
    }


@app.route("/recipes/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    connection = get_db()
    connection.execute("DELETE FROM ingredients WHERE recipe_id = ?", (recipe_id,))
    connection.execute("DELETE FROM recipes WHERE id = ?", (recipe_id,))
    connection.commit()
    connection.close()
    return {"message": "Recipe deleted successfully"}


@app.route("/recipes/<int:recipe_id>", methods=["PUT"])
def update_recipe(recipe_id):
    payload, error = read_recipe_payload()
    if error:
        return error
    name, category, instructions, ingredients = payload
    connection = get_db()
    exists = connection.execute(
        "SELECT 1 FROM recipes WHERE id = ?", (recipe_id,)
    ).fetchone()
    if exists is None:
        connection.close()
        return {"error": "Recipe not found"}, 404
    connection.execute("""
        UPDATE recipes
        SET name = ?, category = ?, instructions = ?
        WHERE id = ?
    """, (name, category, instructions, recipe_id))
    connection.execute("DELETE FROM ingredients WHERE recipe_id = ?", (recipe_id,))
    for ingredient in ingredients:
        connection.execute("""
            INSERT INTO ingredients (recipe_id, ingredient)
            VALUES (?, ?)
        """, (recipe_id, ingredient))
    connection.commit()
    connection.close()
    return {"message": "Recipe updated successfully"}


@app.route("/recipe-of-the-day", methods=["GET"])
def recipe_of_the_day():
    connection = get_db()
    recipes = connection.execute("SELECT * FROM recipes ORDER BY id").fetchall()
    connection.close()
    if len(recipes) == 0:
        return {"error": "No recipes found"}, 404
    recipe = recipes[date.today().toordinal() % len(recipes)]
    return {
        "id": recipe["id"],
        "name": recipe["name"],
        "category": recipe["category"],
    }


@app.route("/")
def home():
    return {"message": "Flask Working"}


if __name__ == "__main__":
    app.run(debug=True)
