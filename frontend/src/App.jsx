import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css'
import hat from "./hat.jpg";
import Recipes from "./pages/Recipes";
import Search from "./pages/Search";
import OneRecipe from "./pages/OneRecipe";
import EditRecipes from "./pages/EditRecipes";
import SearchRecipes from "./pages/Search";

function Home() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return (
    <div className="app">

      <div className="header_layout">
        <img src={hat} alt="Chef's Hat" className="hat" />
        <h1>Olivia's Cookbook</h1>
        <span className="cookie">🍪</span>
      </div>

      <div className="below">
        The ultimate cookbook for all of my cooking and baking needs
      </div>

      <div className="emoji_container">
        <div className="emoji_row">
          <span>🧁</span> 
          <span>🍪</span> 
          <span>🥖</span> 
          <span>🎂</span> 
          <span>🍩</span> 
          <span>🍰</span> 
          <span>🥧</span> 
          <span>🍪</span> 
          <span>🥐</span> 
          <span>🥖</span> 
          <span>🎂</span> 
          <span>🍩</span> 
          <span>🍰</span> 
          <span>🥧</span>
        </div>

        <div className="emoji_row">
          <span>🧁</span> 
          <span>🍪</span> 
          <span>🥖</span> 
          <span>🎂</span> 
          <span>🍩</span> 
          <span>🍰</span> 
          <span>🥧</span> 
          <span>🍪</span> 
          <span>🥐</span> 
          <span>🥖</span> 
          <span>🎂</span> 
          <span>🍩</span> 
          <span>🍰</span> 
          <span>🥧</span>
        </div>
      </div>

      <div className="daily_recipe">
        Recipe of the Day: [Placeholder]
      </div>

      <div className="button_layout">
        <Link to="/recipes" className="recipe_button">
          All Recipes
        </Link>

        <div className="middle"></div>

        <Link to="/search" className="recipe_button">
          Search Recipes
        </Link>
      </div>

      <div className="button_layout">
        <Link to="/help" className="recipe_button">
          Help Me Find a Recipe
        </Link>

        <div className="middle"></div>

        <Link to="/edit-recipes" className="recipe_button">
          Edit Recipes
        </Link>
      </div>

      <div className="substitutes">
        Most Common Substitutes:
      </div>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/edit-recipes" element={<EditRecipes />} />
        <Route
          path="/recipes/one-recipe/:id"
          element={<OneRecipe />}
        />
        <Route path="/search" element={<SearchRecipes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
