import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./OneRecipe.css";

function OneRecipe() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/recipes/${id}`)
      .then((response) => response.json())
      .then((data) => setRecipe(data));
  }, [id]);

  if (recipe === null) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>{recipe.name} 🍽️</h1>

      <h2>Ingredients 🥣</h2>

      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h2>Instructions 📝</h2>

      <p>{recipe.instructions}</p>

      <Link to="/recipes">
        <button>Back to Recipes</button>
      </Link>
    </div>
  );
}

export default OneRecipe;