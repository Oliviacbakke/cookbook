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

  useEffect(() => {
  fetch("http://127.0.0.1:5000/recipes")
    .then((response) => response.json())
    .then((data) => setRecipes(data));
}, []);

  function addIngredient() {
    setIngredients([...ingredients, ""]);}

  function updateIngredient(index, value) {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);}

  function removeIngredient(index) {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);}

  async function saveRecipe() {
    const recipe = {
        name: recipeName,
        instructions: instructions,
        category: category,
        ingredients: ingredients.filter(
        (ingredient) => ingredient.trim() !== "")};
    let response;
    if (editingId !== null) {
        response = await fetch(
        `http://127.0.0.1:5000/recipes/${editingId}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json"},
            body: JSON.stringify(recipe)});
    } else {
        response = await fetch("http://127.0.0.1:5000/recipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"},
        body: JSON.stringify(recipe)});}
    if (response.ok) {
        setRecipeName("");
        setInstructions("");
        setCategory("Main");
        setIngredients([""]);
        setEditingId(null);
        fetch("http://127.0.0.1:5000/recipes")
        .then((response) => response.json())
        .then((data) => setRecipes(data));}}

  async function deleteRecipe(id) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this recipe?");
    if (!confirmed) return;
    const response = await fetch(
        `http://127.0.0.1:5000/recipes/${id}`,
        {method: "DELETE"});
    if (response.ok) {
        setRecipes((currentRecipes) =>
        currentRecipes.filter((recipe) => recipe.id !== id));}}

  function startEditing(recipe) {
    setEditingId(recipe.id);
    setRecipeName(recipe.name);
    setInstructions(recipe.instructions);
    setCategory(recipe.category);
    setIngredients(recipe.ingredients);}

  return (
    <div>
      <h1>Add a Recipe</h1>

      <div className="recipe_form">
        <label>Recipe Name:</label>

        <input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
        />
        <br />

        <label>Category:</label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}>
          <option value="Main">Main</option>
          <option value="Side">Side</option>
          <option value="Dessert">Dessert</option>
        </select>

        <h3>Ingredients</h3>

        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="text"
              value={ingredient}
              placeholder="Ingredient"
              onChange={(e) =>
                updateIngredient(index, e.target.value)}/>

            <button onClick={() => removeIngredient(index)}>
              X
            </button>
          </div>))}

        <button onClick={addIngredient}>
          + Add Ingredient
        </button>

        <h3>Instructions</h3>

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}/>

        <br />
        <br />

       <button onClick={saveRecipe}>
        {editingId !== null ? "Update Recipe" : "Save Recipe"}
        </button>
      </div>

      <br />

      <hr />

    <h2>Delete a Recipe 🗑️</h2>
    <div className="delete_recipes">
    {recipes.map((recipe) => (
        <div className="delete_recipe" key={recipe.id}>
            <span>{recipe.name}</span>
            <button onClick={() => startEditing(recipe)}>
            Edit
            </button>
            <button onClick={() => deleteRecipe(recipe.id)}>
            Delete 🗑️
            </button>
        </div>))}
    </div>  <br></br>

      <Link to="/">
        <button >Back to Home</button>
      </Link>
    </div>);}

export default AddRecipe;