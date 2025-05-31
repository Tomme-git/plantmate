import { redirect, data } from "react-router";
import Collections from "~/models/Collections";
import Recipe from "~/models/Recipes";
import type { Route } from "../routes/+types/collection-destroy";

export async function action({ params }: Route.ActionArgs) {
    const { id } = params;

    try {
        // Remove the collection reference from all recipes
        await Recipe.updateMany(
            { collections: id },
            { $pull: { collections: id } }
        );

        // Delete the collection
        await Collections.findByIdAndDelete(id);
        return redirect("/collections");
    } catch (error) {
        return { status: 500 };
    }
}

export default function CollectionDestroyPage() {
    return (
        <div className="pb-24">
            <h1 className="text-2xl font-bold mb-4">Delete Collection</h1>
            <p>Collection has been deleted successfully.</p>
        </div>
    );
}
