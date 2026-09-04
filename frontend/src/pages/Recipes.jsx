import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Recipes.css";

function Recipes() {
const [recipes, setRecipes] = useState([]);

useEffect(() => {
fetch("http://127.0.0.1:5000/recipes")
.then((response) => response.json())
.then((data) => setRecipes(data));
}, []);

return (
<div className="recipes_page">

  <h1>All Recipes 🍰</h1>
  <p className="recipes_subtitle">
    Browse all of my favorite recipes!
  </p>

  <div className="column_layout">

    <div className="recipe_category">
      <h2>Mains</h2>

      <div className="recipe_list">
        {recipes
          .filter((recipe) => recipe.category === "Main")
          .map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/one-recipe/${recipe.id}`}
              className="recipe_card"
            >
              {recipe.name}
            </Link>
          ))}

        {recipes.filter((recipe) => recipe.category === "Main").length === 0 && (
          <p className="empty_message">No mains yet!</p>
        )}
      </div>
    </div>


    <div className="recipe_category">
      <h2>Sides</h2>

      <div className="recipe_list">
        {recipes
          .filter((recipe) => recipe.category === "Side")
          .map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/one-recipe/${recipe.id}`}
              className="recipe_card"
            >
              {recipe.name}
            </Link>
          ))}

        {recipes.filter((recipe) => recipe.category === "Side").length === 0 && (
          <p className="empty_message">No sides yet!</p>
        )}
      </div>
    </div>


    <div className="recipe_category">
      <h2>Desserts</h2>

      <div className="recipe_list">
        {recipes
          .filter((recipe) => recipe.category === "Dessert")
          .map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/one-recipe/${recipe.id}`}
              className="recipe_card"
            >
              {recipe.name}
            </Link>
          ))}

        {recipes.filter((recipe) => recipe.category === "Dessert").length === 0 && (
          <p className="empty_message">No desserts yet!</p>
        )}
      </div>
    </div>

  </div>

  <br></br> <br></br>


  <Link to="/" className="back_button">
    ← Back to Home
  </Link>

</div>

);
}

export default Recipes;