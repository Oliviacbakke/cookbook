import { Link, useParams } from "react-router-dom";
import "./OneRecipe.css";
import { useApi } from "../api";
import LoadState from "../components/LoadState";

function OneRecipe() {
  const { id } = useParams();
  const { data: recipe, error, loading, reload } = useApi(`/recipes/${id}`);

  if (loading || error || !recipe) {
    return (
      <div className="recipe_page">
        <LoadState
          loading={loading}
          error={error && error.status === 404 ? new Error("Recipe not found.") : error}
          onRetry={error && error.status === 404 ? null : reload}
        />
      </div>
    );
  }

  return (
    <div className="recipe_page">
      <h1>{recipe.name}</h1>
      <h2 className="recipe_subtitle">Ingredients</h2>

      <div className="ingredients_list">
        {recipe.ingredients.length === 0 && <div className="ingredient">No ingredients listed.</div>}
        {recipe.ingredients.map((ingredient, index) => (
          <div className="ingredient" key={index}>
            {ingredient}
          </div>
        ))}
      </div>

      <h2>Instructions</h2>

      <p className="text">{recipe.instructions || "No instructions yet."}</p>

      <div className="bottom"></div>
    </div>
  );
}

export default OneRecipe;
