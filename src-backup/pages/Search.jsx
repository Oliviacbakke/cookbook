import { useState } from "react";
import { Link } from "react-router-dom";
import "./Search.css";
import { useApi } from "../api";
import LoadState from "../components/LoadState";

function Search() {
  const { data, error, loading, reload } = useApi("/recipes");
  const recipes = data || [];
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("keyword");

  const searchText = search.trim().toLowerCase();

  const filteredRecipes = recipes.filter((recipe) => {
    if (searchText === "") return true;

    const hasIngredient = (recipe.ingredients || []).some((ingredient) =>
      ingredient.toLowerCase().includes(searchText)
    );

    if (searchType === "keyword") {
      return (
        (recipe.name || "").toLowerCase().includes(searchText) ||
        (recipe.instructions || "").toLowerCase().includes(searchText)
      );
    }
    if (searchType === "includes") return hasIngredient;
    if (searchType === "notIncludes") return !hasIngredient;
    return true;
  });

  return (
    <div className="search_page">
      <h1>Search Recipes</h1>

      <p className="search_subtitle">Use a keyword, an ingredient, or a lack thereof!</p>

      <div className="search_types">
        <button
          className={searchType === "keyword" ? "active_search" : ""}
          onClick={() => setSearchType("keyword")}
        >
          Keyword
        </button>

        <button
          className={searchType === "includes" ? "active_search" : ""}
          onClick={() => setSearchType("includes")}
        >
          Has Ingredient
        </button>

        <button
          className={searchType === "notIncludes" ? "active_search" : ""}
          onClick={() => setSearchType("notIncludes")}
        >
          No Ingredient
        </button>
      </div>

      <input
        className="search_input"
        type="search"
        enterKeyHint="search"
        autoCapitalize="none"
        autoCorrect="off"
        placeholder={searchType === "keyword" ? "Search recipes..." : "Enter an ingredient..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Results</h2>

      <p className="result_subtitle">Here's what was found!</p>

      <LoadState loading={loading} error={error} onRetry={reload} />

      {!loading && !error && (
        <div className="search_results">
          {filteredRecipes.length === 0 ? (
            <p>No recipes found</p>
          ) : (
            filteredRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/one-recipe/${recipe.id}`}
                className="recipe_result"
              >
                {recipe.name}
              </Link>
            ))
          )}
        </div>
      )}

      <br />

      <div style={{ height: 80 }} />
    </div>
  );
}

export default Search;
