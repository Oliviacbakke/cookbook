import { HashRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Recipes from "./pages/Recipes";
import Search from "./pages/Search";
import OneRecipe from "./pages/OneRecipe";
import AddRecipe from "./pages/AddRecipe";
import ManageRecipes from "./pages/ManageRecipes";
import { useApi } from "./api";
import TabBar from "./components/TabBar";
import CategoryRecipes from "./pages/CategoryRecipes";

function Home() {
  const { data: dailyRecipe, error, loading, reload } = useApi("/recipe-of-the-day");

  return (
    <div className="home_page">
      <div className="home_header">
        <div className="header_text">
          <h1>Olivia's Cookbook</h1>
          <p>The ultimate cookbook for all of my cooking and baking needs</p>
        </div>
      </div>

      <div className="daily_recipe">
        <h2>Recipe of the Day: </h2>
        {loading && <p>Loading today's recipe...</p>}
        {!loading && dailyRecipe && !error && (
          <Link
            to={`/recipes/one-recipe/${dailyRecipe.id}`}
            className="daily_recipe_link"
          >
            {dailyRecipe.name}
          </Link>
        )}
        {!loading && error && error.status === 404 && <p>Add a recipe to get started!</p>}
        {!loading && error && error.status !== 404 && (
          <>
            <p>{error.message}</p>
            <button className="retry_button" onClick={reload}>
              Try again
            </button>
          </>
        )}
      </div>

      <div className="substitutes">
        <h2>Common Substitutes</h2>
        <p>Buttermilk - 1 cup milk + 1 tbsp lemon juice or vinegar</p>
        <p>Heavy cream - Half-and-half or milk + melted butter</p>
        <p>Powdered sugar - Blend regular granulated sugar until very fine</p>
      </div>
      <br /> <br />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/manage" element={<ManageRecipes />} />
        <Route path="/recipes/one-recipe/:id" element={<OneRecipe />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recipes/category/:category" element={<CategoryRecipes />} />
      </Routes>
      <TabBar />
    </HashRouter>
  );
}

export default App;
