import { useState } from "react";
import { Form, redirect, useNavigate } from "react-router";
import type { RecipeType } from "~/models/Recipes";
import Recipe from "~/models/Recipes";
import type { Route } from "./+types/recipe-update";
import Navbar from "~/navigation/navbar";
import { sessionStorage } from "~/services/session.server";
import Header from "~/components/Header";

export function meta({ params }: { params: { id: string } }) {
  return [{ title: `PlantMate 🌱 Update ${params.id}` }];
}

// Server-side loader function
export async function loader({ params, request }: Route.LoaderArgs) {
  const recipe = await Recipe.findById(params.id);
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }
  if (!recipe) {
    throw new Response("Recipe not found", { status: 404 });
  }
  if (recipe.user !== authUserId) {
    return redirect("/unauthorized");
  }
  return { recipe: recipe.toObject(), authUserId };
}

// React component
export default function UpdateRecipePage({
  loaderData,
}: {
  loaderData: { recipe: RecipeType; authUserId: string };
}) {
  const { recipe, authUserId } = loaderData;

  const [image, setImage] = useState(recipe.image);
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState(recipe.ingredients.join("\n"));
  const [steps, setSteps] = useState(recipe.steps.join("\n"));
  const [tags, setTags] = useState(recipe.tags.join(","));
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="pb-24 bg-[#F0ECE3]">
      <Header/>
      <main className="flex justify-center items-center min-h-screen bg-[#F0ECE3] p-8">
        <div className="bg-[#F0ECE3] p-8 max-w-3xl w-full">
          <h1 className="text-3xl font-semibold text-[#466A39] mb-6 text-center">
            Update Recipe
          </h1>
          <Form id="recipe-form" method="post" className="space-y-5">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-lg font-medium text-[#466A39]"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-[#466A39]"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description..."
                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image"
                className="block text-lg font-medium text-[#466A39]"
              >
                Image URL
              </label>
              <input
                name="image"
                defaultValue={image}
                type="url"
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste an image URL..."
                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Image Preview */}
            <div className="flex flex-col items-center">
              <label
                htmlFor="image-preview"
                className="block text-lg font-medium text-[#466A39]"
              >
                Image Preview
              </label>
              <img
                id="image-preview"
                className="mt-2 w-full h-64 object-cover rounded-lg border"
                src={
                  image ||
                  "https://placehold.co/600x400?text=Paste+an+image+URL"
                }
                alt="Recipe Preview"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src =
                    "https://placehold.co/600x400?text=Error+loading+image";
                }}
              />
            </div>

            {/* Ingredients */}
            <div>
              <label
                htmlFor="ingredients"
                className="block text-lg font-medium text-[#466A39]"
              >
                Ingredients (one per line)
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                defaultValue={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="List ingredients, each on a new line..."
                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Steps */}
            <div>
              <label
                htmlFor="steps"
                className="block text-lg font-medium text-[#466A39]"
              >
                Steps (one per line)
              </label>
              <textarea
                id="steps"
                name="steps"
                defaultValue={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="Write steps, each on a new line..."
                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-lg font-medium text-[#466A39]"
              >
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                name="tags"
                defaultValue={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="E.g., vegan, gluten-free"
                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#466A39] text-white rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </Form>
        </div>
      </main>
      <Navbar />
    </div>
  );
}

// Server-side action function
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authUserId = session.get("authUserId");

  const recipe = await Recipe.findById(params.id);
  if (!recipe) {
    throw new Response("Recipe not found", { status: 404 });
  }
  if (recipe.user !== authUserId) {
    return redirect("/unauthorized");
  }

  await Recipe.findByIdAndUpdate(params.id, {
    title: formData.get("title"),
    description: formData.get("description"),
    image: formData.get("image"),
    ingredients: formData
      .get("ingredients")
      ?.toString()
      .split("\n")
      .filter(Boolean),
    steps: formData.get("steps")?.toString().split("\n").filter(Boolean),
    tags: formData
      .get("tags")
      ?.toString()
      .split(",")
      .map((tag) => tag.trim()),
  });

  return redirect(`/recipes/${params.id}`);
}
