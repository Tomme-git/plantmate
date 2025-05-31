import Recipe from "./models/Recipes";
import Collections from "./models/Collections";

export async function getRecipes() {
    let recipes = await Recipe.find().populate("collections");
    return recipes.map((recipe) => recipe.toObject());
}
