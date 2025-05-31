import { sessionStorage } from "~/services/session.server";
import type { Route } from "../+types/root";
import RecipeIdea from "../models/Recipes";

export async function loader({ request }: Route.LoaderArgs) {
    const session = await sessionStorage.getSession(
        request.headers.get("cookie")
    );
    const authUserId = session.get("authUserId");

    const recipeIdeas = await RecipeIdea.find().sort({ createdAt: -1 });
    return { recipeIdeas: recipeIdeas.map((d) => d.toObject()), authUserId };
}
