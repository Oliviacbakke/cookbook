import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Recipes.css";

function Recipes() {

  const [recipeName, setRecipeName] = useState("");
  const [instructions, setInstructions] = useState("");

  const [ingredients, setIngredients] = useState([""]);

  const [recipes, setRecipes] = useState([]);

  const [category, setCategory] = useState("Main");

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
      category: category,
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
      
        <div className="mains">
            <h2>Mains</h2>
            {recipes
                .filter((recipe) => recipe.category === "Main")
                .map((recipe) => (
                <Link
                    key={recipe.id}
                    to={`/recipes/one-recipe/${recipe.id}`}>
                    <button>{recipe.name}</button> <br></br> <br></br>
                </Link>))}
        </div>

        <div className="sides">
            <h2>Sides</h2>
            {recipes
                .filter((recipe) => recipe.category === "Side")
                .map((recipe) => (
                <Link
                    key={recipe.id}
                    to={`/recipes/one-recipe/${recipe.id}`}>
                    <button>{recipe.name}</button> <br></br>
                </Link>))}
        </div>

        <div className="desserts">
            <h2>Desserts</h2>
            {recipes
                .filter((recipe) => recipe.category === "Dessert")
                .map((recipe) => (
                <Link
                    key={recipe.id}
                    to={`/recipes/one-recipe/${recipe.id}`}>
                    <button>{recipe.name}</button> <br></br>
                </Link>))}
        </div>
      </div>

      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}

export default Recipes;