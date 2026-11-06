import { Link } from "react-router-dom";
import { useApi } from "../api";

const SHORTCUTS = [
  { to: "/recipes/category/Main", label: "Mains" },
  { to: "/recipes/category/Side", label: "Sides" },
  { to: "/recipes/category/Dessert", label: "Desserts" },
];

const SWAPS = [
  { name: "Buttermilk", swap: "1 cup milk + 1 tbsp lemon juice or vinegar" },
  { name: "Heavy cream", swap: "Half-and-half, or milk + melted butter" },
  {
    name: "Powdered sugar",
    swap: "Blend regular granulated sugar until very fine",
  },
];

function Home() {
  const { data: pick, error, loading, reload } = useApi("/recipe-of-the-day");

  return (
    <div className="home">
      <div className="home_hero">
        <h1 className="home_title">Olivia's Cookbook</h1>
        <p className="home_tagline">
          The ultimate cookbook for all of my cooking and baking needs
        </p>
      </div>

      <Link to="/search" className="home_search">
        <span>🔍</span>
        <span>Search recipes or ingredients...</span>
      </Link>

      <div className="home_chips">
        {SHORTCUTS.map((s) => (
          <Link key={s.to} to={s.to} className="home_chip">
            <span>{s.emoji}</span>
            <span>{s.label}</span>
          </Link>
        ))}
      </div>

      {loading && (
        <div className="pick_card">
          <div className="pick_label">Today's pick</div>
          <p>Finding today's recipe...</p>
        </div>
      )}

      {!loading && !error && pick && (
        <Link to={`/recipes/one-recipe/${pick.id}`} className="pick_card">
          <div className="pick_label">Today's pick</div>
          <div className="pick_name">{pick.name}</div>
          <span className="pick_tag">{pick.category}</span>
          <span className="pick_cta">View recipe →</span>
        </Link>
      )}

      {!loading && error && (
        <div className="pick_card">
          <div className="pick_label">Today's pick</div>
          {error.status === 404 ? (
            <p>Add a recipe to get started!</p>
          ) : (
            <>
              <p>{error.message}</p>
              <button className="retry_button" onClick={reload}>
                Try again
              </button>
            </>
          )}
        </div>
      )}

      <div className="swaps_card">
        <h2 className="swaps_title">Kitchen Swaps</h2>
        <ul className="swaps_list">
          {SWAPS.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.swap}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;