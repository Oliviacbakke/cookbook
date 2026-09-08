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
  const [dailyRecipe, setDailyRecipe] = useState(null);

  useEffect(() => {
  fetch("http://127.0.0.1:5000/")
    .then(res => res.json())
    .then(data => console.log(data));

  fetch("http://127.0.0.1:5000/recipe-of-the-day")
    .then((response) => response.json())
    .then((data) => setDailyRecipe(data));
}, []);

  return (
    <div className="home_page">

      <div className="home_header"> <img src={hat} alt="Chef's Hat" className="hat" />

      <div className="header_text">
        <h1>Olivia's Cookbook</h1>
        <p>
          The ultimate cookbook for all of my cooking and baking needs
        </p>
      </div>

      <span className="cookie">🍪</span>

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
        <h2>Recipe of the Day: </h2>
        {dailyRecipe ? (
          <Link to={`/recipes/one-recipe/${dailyRecipe.id}`} className="daily_recipe_link">
            {dailyRecipe.name}
          </Link>
        ) : (
          <p>Loading today's recipe...</p>
        )}
      </div> 

      <div className="home_navigation">

      <Link to="/recipes" className="home_card">
        <h2>All Recipes</h2>
        <p>Browse everything in the cookbook</p>
      </Link>


      <Link to="/search" className="home_card">
        <h2>Search Recipes</h2>
        <p>Find exactly what you're looking for</p>
      </Link>


      <Link to="/edit-recipes" className="home_card">
        <h2>Edit Recipes</h2>
        <p>Add, edit, or delete recipes</p>
      </Link>

      </div>

      <div className="substitutes"> <h2>Common Substitutes</h2> 
        <p>Buttermilk - 1 cup milk + 1 tbsp lemon juice or vinegar</p>
        <p>Heavy cream - Half-and-half or milk + melted butter</p>
        <p>Powdered sugar - Blend regular granulated sugar until very fine</p>
      </div>
      <br></br> <br></br>
    </div>)}

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
