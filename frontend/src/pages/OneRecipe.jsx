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
    <div className="recipe_page">
      <h1>{recipe.name}</h1>

      <h2>Ingredients</h2>

      <div className="ingredients_list">
        {recipe.ingredients.map((ingredient, index) => (
        <div className="ingredient" key={index}>
            {ingredient}
        </div>))}
      </div>

      <h2>Instructions</h2>

      <p className="text">{recipe.instructions}</p>

      <Link to="/recipes">
        <button>Back to Recipes</button>
      </Link>

      <div className="bottom"></div>
    </div>
  );
}

export default OneRecipe;