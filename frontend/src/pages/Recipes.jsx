import { Link } from "react-router-dom";
import "./Recipes.css";

function Recipes() {
  return (
    <div className="recipes_page">
      <h1>All Recipes</h1>
      <p className="recipes_subtitle">Pick a category</p>

      <div className="category_buttons">
        <Link to="/recipes/category/Main" className="category_button">
          Mains
        </Link>
        <Link to="/recipes/category/Side" className="category_button">
          Sides
        </Link>
        <Link to="/recipes/category/Dessert" className="category_button">
          Desserts
        </Link>
      </div>
    </div>
  );
}

export default Recipes;