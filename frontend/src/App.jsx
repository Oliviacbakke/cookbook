import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import CategoryRecipes from "./pages/CategoryRecipes";
import Search from "./pages/Search";
import OneRecipe from "./pages/OneRecipe";
import AddRecipe from "./pages/AddRecipe";
import ManageRecipes from "./pages/ManageRecipes";
import TabBar from "./components/TabBar";
import OfflineBanner from "./components/OfflineBanner";

function App() {
  return (
    <HashRouter>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/category/:category" element={<CategoryRecipes />} />
        <Route path="/recipes/one-recipe/:id" element={<OneRecipe />} />
        <Route path="/search" element={<Search />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/manage" element={<ManageRecipes />} />
      </Routes>
      <TabBar />
    </HashRouter>
    
  );
}

export default App;