import { redirect } from "react-router";
import Recipe from "~/models/Recipes";
import type { Route } from "../routes/+types/toggle-favourite";

export async function action({ request, params }: Route.ActionArgs) {
    const formData = await request.formData();
    const isFavourite = formData.get("isFavourite") === "true";

    await Recipe.findByIdAndUpdate(params.id, { isFavourite });

    return redirect(`/recipes/${params.id}`);
}
