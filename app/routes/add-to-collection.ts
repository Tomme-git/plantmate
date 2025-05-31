import { redirect } from "react-router";
import Recipe from "~/models/Recipes";
import Collections from "~/models/Collections";
import type { Route } from "../routes/+types/add-to-collection";

export async function action({ request, params }: Route.ActionArgs) {
    const formData = await request.formData();
    const collectionId = formData.get("collectionId");

    if (!collectionId) {
        return { status: 400, message: "Collection ID is required" };
    }

    const recipe = await Recipe.findById(params.id);
    const collection = await Collections.findById(collectionId);

    if (!recipe || !collection) {
        return { status: 404, message: "Recipe or Collection not found" };
    }

    // Add the collection reference to the recipe document
    if (!recipe.collections) {
        recipe.collections = [];
    }
    if (!recipe.collections.includes(collection.id)) {
        if (collection._id) {
            recipe.collections.push(collection.id);
        }
        await recipe.save();
    }

    return redirect(`/recipes/${params.id}`);
}
