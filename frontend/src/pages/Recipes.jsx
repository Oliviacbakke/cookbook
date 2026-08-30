import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Recipes.css";

function Recipes() {

  const [recipeName, setRecipeName] = useState("");
  const [instructions, setInstructions] = useState("");

  const [ingredients, setIngredients] = useState([""]);

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
  fetch("http://127.0.0.1:5000/recipes")
    .then((response) => response.json())
    .then((data) => setRecipes(data));
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
    const newIngredients = ingredients.filter(
      (_, i) => i !== index
    );

    setIngredients(newIngredients);
  }

  async function saveRecipe() {
    const recipe = {
      name: recipeName,
      instructions: instructions,
      ingredients: ingredients.filter(
        (ingredient) => ingredient.trim() !== ""
      )
    };

    const response = await fetch("http://127.0.0.1:5000/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(recipe)
    });

    const data = await response.json();

    console.log(data);

    setRecipeName("");
    setInstructions("");
    setIngredients([""]);

    alert("Recipe saved!");
  }

  return (
    <div className="app">
      <div className="recipes_header_layout">
      <h1>All Recipes 🍰</h1> </div> <br></br>

      <div className="column_layout">
        <div className="mains">Mains</div>

        <div className="sides">Sides</div>

        <div className="desserts">Desserts</div>
      </div>
      
      <div className="recipe_list">
        {recipes.map((recipe) => (
            <Link
            key={recipe.id}
            to={`/recipes/one-recipe/${recipe.id}`}
            >
            <button>{recipe.name}</button>
            </Link>
        ))}
        </div>

      <br /><br />

      <h2>Add a Recipe</h2>

      <div className="recipe_form">

        <label>
          Recipe Name:
        </label>

        <input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
        />

        <h3>Ingredients</h3>

        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="text"
              value={ingredient}
              placeholder="Ingredient"
              onChange={(e) =>
                updateIngredient(index, e.target.value)
              }
            />

            <button onClick={() => removeIngredient(index)}>
              X
            </button>
          </div>
        ))}

        <button onClick={addIngredient}>
          + Add Ingredient
        </button>

        <h3>Instructions</h3>

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <br />
        <br />

        <button onClick={saveRecipe}>
          Save Recipe
        </button>

      </div>

      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}

export default Recipes;