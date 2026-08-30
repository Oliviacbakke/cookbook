import { Link } from "react-router-dom";

function OneRecipe() {
  return (
    <div>

      <Link to="/recipes">
        <button>Back to Recipes</button>
      </Link>
    </div>
  );
}

export default OneRecipe;