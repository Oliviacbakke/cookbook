import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EditRecipes.css";

function AddRecipe() {
const [recipeName, setRecipeName] = useState("");
const [instructions, setInstructions] = useState("");
const [category, setCategory] = useState("Main");
const [ingredients, setIngredients] = useState([""]);
const [recipes, setRecipes] = useState([]);
const [editingId, setEditingId] = useState(null);

function loadRecipes() {
fetch("http://127.0.0.1:5000/recipes")
.then((response) => response.json())
.then((data) => setRecipes(data));
}

useEffect(() => {
loadRecipes();
}, []);

function addIngredient() {
setIngredients([...ingredients, ""]);
}

function updateIngredient(index, value) {
const newIngredients = [...ingredients];
newIngredients[index] = value;
setIngredients(newIngredients);
}

function removeIngredient(index) {
const newIngredients = ingredients.filter((_, i) => i !== index);

// Keep at least one ingredient box visible
if (newIngredients.length === 0) {
  setIngredients([""]);
} else {
  setIngredients(newIngredients);
}

}

async function saveRecipe() {
const recipe = {
name: recipeName,
instructions: instructions,
category: category,
ingredients: ingredients.filter(
(ingredient) => ingredient.trim() !== ""
)
};

let response;

if (editingId !== null) {
  response = await fetch(
    `http://127.0.0.1:5000/recipes/${editingId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(recipe)
    }
  );
} else {
  response = await fetch("http://127.0.0.1:5000/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(recipe)
  });
}

if (response.ok) {
  setRecipeName("");
  setInstructions("");
  setCategory("Main");
  setIngredients([""]);
  setEditingId(null);

  loadRecipes();
}

}

async function deleteRecipe(id) {
const confirmed = window.confirm(
"Are you sure you want to delete this recipe?"
);

if (!confirmed) return;

const response = await fetch(
  `http://127.0.0.1:5000/recipes/${id}`,
  {
    method: "DELETE"
  }
);

if (response.ok) {
  setRecipes((currentRecipes) =>
    currentRecipes.filter((recipe) => recipe.id !== id)
  );
}

}

function startEditing(recipe) {
setEditingId(recipe.id);
setRecipeName(recipe.name);
setInstructions(recipe.instructions);
setCategory(recipe.category);
setIngredients(recipe.ingredients);

window.scrollTo({
  top: 0,
  behavior: "smooth"
});

}

return (
<div className="edit_page">

  <h2>
    {editingId !== null
      ? "Edit Recipe"
      : "Add a Recipe"}
  </h2>

  <p className="edit_subtitle">
    {editingId !== null
      ? "Make changes to your recipe below!"
      : "Add a new favorite recipe to your cookbook!"}
  </p>

  <div className="recipe_form">

    <div className="form_group">
      <label>Recipe Name</label>

      <input
        type="text"
        value={recipeName}
        placeholder="Chocolate Chip Cookies..."
        onChange={(e) => setRecipeName(e.target.value)}
      />
    </div>


    <div className="form_group">
      <label>Category</label>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Main">Main</option>
        <option value="Side">Side</option>
        <option value="Dessert">Dessert</option>
      </select>
    </div>


    <div className="form_group">
      <h3>Ingredients</h3>

      {ingredients.map((ingredient, index) => (
        <div className="ingredient_row" key={index}>

          <input
            type="text"
            value={ingredient}
            placeholder="Enter an ingredient..."
            onChange={(e) =>
              updateIngredient(index, e.target.value)
            }
          />

          <button
            className="remove_ingredient"
            onClick={() => removeIngredient(index)}
          >
            ×
          </button>

        </div>
      ))}

      <button
        className="add_ingredient"
        onClick={addIngredient}
      >
        + Add Ingredient
      </button>
    </div>


    <div className="form_group">
      <h3>Instructions</h3>

      <textarea
        value={instructions}
        placeholder="Write your recipe instructions here..."
        onChange={(e) => setInstructions(e.target.value)}
      />
    </div>


    <button
      className="save_button"
      onClick={saveRecipe}
    >
      {editingId !== null
        ? "Update Recipe"
        : "Save Recipe"}
    </button>

  </div>


  <div className="recipe_divider"></div>


  <h2 className="manage_title">Manage Recipes</h2>

  <p className="manage_subtitle">
    Edit or delete recipes from your cookbook.
  </p>


  <div className="delete_recipes">

    {recipes.length === 0 ? (
      <p className="empty_message">
        No recipes yet! Add your first one above
      </p>
    ) : (
      recipes.map((recipe) => (
        <div className="delete_recipe" key={recipe.id}>

          <span>{recipe.name}</span>

          <div className="recipe_actions">

            <button
              className="edit_button"
              onClick={() => startEditing(recipe)}
            >
              Edit
            </button>

            <button
              className="delete_button"
              onClick={() => deleteRecipe(recipe.id)}
            >
              Delete
            </button>

          </div>

        </div>
      ))
    )}

  </div>


  <Link to="/" className="back_button">
    ← Back to Home
  </Link>

</div>

);
}

export default AddRecipe;