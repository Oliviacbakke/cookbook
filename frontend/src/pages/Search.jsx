import { Link } from "react-router-dom";

function Search() {
  return (
    <div className="app">
      <h1>Search Recipes 🔎</h1>

      <input
        type="text"
        placeholder="Search for a recipe..."
      />

      <button>Search</button>

      <br />
      <br />

      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}

export default Search;