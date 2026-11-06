import { useState } from "react";
import { Link } from "react-router-dom";
import "./EditRecipes.css";
import { apiFetch, useApi } from "../api";
import LoadState from "../components/LoadState";

function EditRecipes() {
  const { data, setData, error, loading, reload } = useApi("/recipes");
  const recipes = data || [];

  const [recipeName, setRecipeName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("Main");
  const [ingredients, setIngredients] = useState([""]);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function resetForm() {
    setRecipeName("");
    setInstructions("");
    setCategory("Main");
    setIngredients([""]);
    setEditingId(null);
    setFormError("");
  }

  function addIngredient() {
    setIngredients([...ingredients, ""]);
  }

  function updateIngredient(index, value) {
    const next = [...ingredients];
    next[index] = value;
    setIngredients(next);
  }

  function removeIngredient(index) {
    const next = ingredients.filter((_, i) => i !== index);
    setIngredients(next.length === 0 ? [""] : next);
  }

  async function saveRecipe() {
    if (saving) return;
    if (recipeName.trim() === "") {
      setFormError("Please give the recipe a name.");
      return;
    }
    setSaving(true);
    setFormError("");

    const recipe = {
      name: recipeName.trim(),
      instructions,
      category,
      ingredients: ingredients.filter((i) => i.trim() !== ""),
    };

    try {
      if (editingId !== null) {
        await apiFetch(`/recipes/${editingId}`, { method: "PUT", body: JSON.stringify(recipe) });
      } else {
        await apiFetch("/recipes", { method: "POST", body: JSON.stringify(recipe) });
      }
      resetForm();
      reload();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecipe(id) {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await apiFetch(`/recipes/${id}`, { method: "DELETE" });
      setData((current) => (current || []).filter((recipe) => recipe.id !== id));
      if (editingId === id) resetForm();
    } catch (e) {
      window.alert(e.message);
    }
  }

  function startEditing(recipe) {
    setEditingId(recipe.id);
    setRecipeName(recipe.name);
    setInstructions(recipe.instructions || "");
    setCategory(recipe.category);
    setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [""]);
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="edit_page">
      <h2>{editingId !== null ? "Edit Recipe" : "Add a Recipe"}</h2>

      <p className="edit_subtitle">
        {editingId !== null
          ? "Make changes to the recipes below"
          : "Add a new favorite recipe to the cookbook!"}
      </p>

      <div className="recipe_form">
        <div className="form_group">
          <label htmlFor="recipe_name">Recipe Name</label>
          <input
            id="recipe_name"
            type="text"
            value={recipeName}
            placeholder="Chocolate Chip Cookies..."
            onChange={(e) => setRecipeName(e.target.value)}
          />
        </div>

        <div className="form_group">
          <label htmlFor="recipe_category">Category</label>
          <select
            id="recipe_category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Main">Main</option>
            <option value="Side">Side</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div>

        <div className="form_group">
          <h3>Ingredients</h3>

          {ingredients.map((ingredient, index) => (
            <div className="ingredient_row" key={index}>
              <input
                type="text"
                value={ingredient}
                placeholder="Enter an ingredient..."
                onChange={(e) => updateIngredient(index, e.target.value)}
              />
              <button
                className="remove_ingredient"
                aria-label="Remove ingredient"
                onClick={() => removeIngredient(index)}
              >
                ×
              </button>
            </div>
          ))}

          <button className="add_ingredient" onClick={addIngredient}>
            + Add Ingredient
          </button>
        </div>

        <div className="form_group">
          <h3>Instructions</h3>
          <textarea
            value={instructions}
            placeholder="Write your recipe instructions here..."
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        {formError && <p className="form_error">{formError}</p>}

        <button className="save_button" onClick={saveRecipe} disabled={saving}>
          {saving ? "Saving..." : editingId !== null ? "Update Recipe" : "Save Recipe"}
        </button>

        {editingId !== null && (
          <button className="cancel_button" onClick={resetForm}>
            Cancel editing
          </button>
        )}
      </div>

      <div className="recipe_divider"></div>

      <h2 className="manage_title">Manage Recipes</h2>

      <p className="manage_subtitle">Edit or delete recipes from the cookbook</p>

      <LoadState loading={loading} error={error} onRetry={reload} />

      {!loading && !error && (
        <div className="delete_recipes">
          {recipes.length === 0 ? (
            <p className="empty_message">No recipes yet! Add your first one above</p>
          ) : (
            recipes.map((recipe) => (
              <div className="delete_recipe" key={recipe.id}>
                <span>{recipe.name}</span>

                <div className="recipe_actions">
                  <button className="edit_button" onClick={() => startEditing(recipe)}>
                    Edit
                  </button>
                  <button className="delete_button" onClick={() => deleteRecipe(recipe.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <div style={{ height: 60 }} />
    </div>
  );
}

export default EditRecipes;
