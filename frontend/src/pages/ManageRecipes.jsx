import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditRecipes.css";
import { apiFetch, useApi } from "../api";
import LoadState from "../components/LoadState";

function ManageRecipes() {
  const navigate = useNavigate();
  const { data, setData, error, loading, reload } = useApi("/recipes");
  const recipes = data || [];
  const [search, setSearch] = useState("");

  const searchText = search.trim().toLowerCase();
  const matches =
    searchText === ""
      ? []
      : recipes.filter((recipe) => recipe.name.toLowerCase().includes(searchText));

  async function deleteRecipe(id) {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await apiFetch(`/recipes/${id}`, { method: "DELETE" });
      setData((current) => (current || []).filter((recipe) => recipe.id !== id));
    } catch (e) {
      window.alert(e.message);
    }
  }

  function startEditing(recipe) {
    navigate("/add", { state: { recipe } });
  }

  return (
    <div className="edit_page">
      <h2 className="manage_title">Manage Recipes</h2>

      <p className="manage_subtitle">Search for a recipe to edit or delete it</p>

      <input
        className="manage_search"
        type="search"
        enterKeyHint="search"
        autoCapitalize="none"
        autoCorrect="off"
        placeholder="Search by recipe name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <LoadState loading={loading} error={error} onRetry={reload} />

      {!loading && !error && (
        <div className="delete_recipes">
          {searchText === "" ? (
            <p className="empty_message">
              {recipes.length === 0
                ? "No recipes yet! Add your first one on the Add tab"
                : "Type a name above to find a recipe"}
            </p>
          ) : matches.length === 0 ? (
            <p className="empty_message">No recipes found</p>
          ) : (
            matches.map((recipe) => (
              <div className="delete_recipe" key={recipe.id}>
                <span>{recipe.name}</span>

                <div className="recipe_actions">
                  <button className="edit_button" onClick={() => startEditing(recipe)}>
                    Edit
                  </button>
                  <button className="delete_button" onClick={() => deleteRecipe(recipe.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div style={{ height: 60 }} />
    </div>
  );
}

export default ManageRecipes;