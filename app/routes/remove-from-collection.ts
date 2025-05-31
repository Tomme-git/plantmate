import { redirect } from "react-router";
import Recipe from "~/models/Recipes";
import Collections from "~/models/Collections";
import type { Route } from "../routes/+types/remove-from-collection";

export async function action({ request, params }: Route.ActionArgs) {
    const formData = await request.formData();
    const recipeId = formData.get("recipeId");

    if (!recipeId) {
        return { status: 400, message: "Recipe ID is required" };
    }

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
        return { status: 404, message: "Recipe not found" };
    }

    // Initialize arrays if they are undefined
    recipe.collections = recipe.collections || [];

    // Remove the collection reference from the recipe document
    recipe.collections = recipe.collections.filter(
        (col) => col.toString() !== params.id
    );
    await recipe.save();

    return redirect(`/collections/${params.id}`);
}
