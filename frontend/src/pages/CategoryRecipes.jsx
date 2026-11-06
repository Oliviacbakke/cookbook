import { Link, useParams } from "react-router-dom";
import "./Recipes.css";
import { useApi } from "../api";
import LoadState from "../components/LoadState";

const TITLES = { Main: "Mains", Side: "Sides", Dessert: "Desserts" };

function CategoryRecipes() {
  const { category } = useParams();
  const title = TITLES[category];
  const { data, error, loading, reload } = useApi("/recipes");
  const recipes = (data || []).filter((r) => r.category === category);

  if (!title) {
    return (
      <div className="recipes_page">
        <h1>Category not found</h1>
        <Link to="/recipes" className="back_button">
          ← Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="recipes_page">
      <h1>{title}</h1>

      <LoadState loading={loading} error={error} onRetry={reload} />

      {!loading && !error && (
        <div className="recipe_category single_category">
          <div className="recipe_list">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/one-recipe/${recipe.id}`}
                className="recipe_card"
              >
                {recipe.name}
              </Link>
            ))}
            {recipes.length === 0 && (
              <p className="empty_message">Nothing here yet!</p>
            )}
          </div>
        </div>
      )}

      <Link to="/recipes" className="back_button">
        ← Back to Categories
      </Link>
    </div>
  );
}

export default CategoryRecipes;