import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Search.css";

function Search() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("keyword");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/recipes")
      .then((response) => response.json())
      .then((data) => setRecipes(data));
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const searchText = search.toLowerCase();

    if (searchText === "") {
      return true;
    }

    if (searchType === "keyword") {
      return (
        recipe.name.toLowerCase().includes(searchText) ||
        recipe.instructions.toLowerCase().includes(searchText)
      );
    }

    if (searchType === "includes") {
      return recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchText)
      );
    }

    if (searchType === "notIncludes") {
      return !recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchText)
      );
    }

    return true;
  });

  return (
    <div className="search_page">
  <h1>Search Recipes 🔎</h1>

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
    type="text"
    placeholder={
      searchType === "keyword"
        ? "Search recipes..."
        : "Enter an ingredient..."
    }
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <h2>Results</h2>

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

      <br />

      <Link to="/">
        <button className="back_button"> ← Back to Home</button>
      </Link>

      <br></br><br></br><br></br><br></br><br></br><br></br>
    </div>
  );
}

export default Search;