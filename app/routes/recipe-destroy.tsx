import { redirect } from "react-router";
import Recipe from "~/models/Recipes";
import type { Route } from "../routes/+types/recipe-destroy";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    return redirect("/signin");
  }

  const { id } = params;

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return { status: 404, message: "Recipe not found" };
    }

    if (recipe.user !== authUserId) {
      return redirect("/unauthorized");
    }

    await Recipe.findByIdAndDelete(id);
    return redirect("/");
  } catch (error) {
    return { status: 500, message: "Internal Server Error" };
  }
}

export default function RecipeDestroyPage() {
  return (
    <div className="pb-24">
      <h1 className="text-2xl font-bold mb-4">Delete Recipe</h1>
      <p>Recipe has been deleted successfully.</p>
    </div>
  );
}
