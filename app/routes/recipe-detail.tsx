import { Link, Form, useFetcher } from "react-router";
import { useState } from "react";
import Recipe from "../models/Recipes";
import type { Route } from "../routes/+types/recipe-detail";
import Navbar from "~/navigation/navbar";
import Collections from "~/models/Collections";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { redirect } from "react-router";
import { sessionStorage } from "~/services/session.server";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import Header from "~/components/Header";

export const meta = ({ params }: { params: { id: string } }) => {
  return [{ title: `Plantmate 🌱 ${params.id}` }];
};

export async function loader({ request, params }: Route.LoaderArgs) {
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

  const collections = await Collections.find({ user: authUserId });

  return {
    recipe: recipe.toObject(),
    collections: collections.map((c) => c.toObject()),
    authUserId, // Include authUserId in the returned data
  };
}

export default function RecipeDetailPage({ loaderData }: Route.ComponentProps) {
  const { recipe, collections, authUserId } = loaderData;
  const [selectedCollection, setSelectedCollection] = useState("");
  const [isFavourite, setIsFavourite] = useState(recipe.isFavourite);
  const fetcher = useFetcher();

  function confirmDelete(event: React.FormEvent) {
    const response = confirm("Are you sure you want to delete this recipe?");
    if (!response) {
      event.preventDefault();
    }
  }

  function toggleFavourite() {
    fetcher.submit(
      { isFavourite: !isFavourite },
      {
        method: "post",
        action: `/recipes/${recipe._id}/toggle-favourite`,
      }
    );
    setIsFavourite(!isFavourite);
  }

  return (
    <div className="pb-24 bg-[#F0ECE3]">
      <Header/>
      <div className="max-w-4xl mx-auto p-6 bg-[#F0ECE3] rounded-lg">
        <Link
          to="/"
          className="block text-sm text-gray-600 mt-4 mb-4 hover:text-gray-800 transition"
        >
          &larr; Back to all recipes
        </Link>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-green-700">{recipe.title}</h1>
          <button
            onClick={toggleFavourite}
            className="text-red-500 hover:text-red-700 transition"
          >
            {isFavourite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
          </button>
        </div>
        <img
          src={recipe.image || "https://placehold.co/600x400"}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
          onError={(e) =>
            ((e.target as HTMLImageElement).src =
              "https://placehold.co/600x400")
          }
        />
        <p className="text-gray-700 text-lg mb-4 italic">
          {recipe.description}
        </p>
        <div className="bg-[#F7F4ED] p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-[#466A39] mb-2">
            Ingredients
          </h2>
          <ul className="list-disc list-inside text-gray-800">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="bg-[#F7F4ED] p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-[#466A39] mb-2">Steps</h2>
          <ol className="list-decimal list-inside text-gray-800">
            {recipe.steps.map((step, index) => (
              <li key={index} className="mb-2">
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium text-[#466A39] mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#466A39] text-[#F7F4ED] px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-lg font-medium text-[#466A39] mt-8">
              Add to Collection
            </h3>

        {/* Add to Collection Form and Buttons */}
        <div className="mt-2 flex justify-between items-center gap-4">
          {/* Add to Collection Form */}
          <div className="flex items-center gap-4">
            <Form
              method="post"
              action={`/recipes/${recipe._id}/add-to-collection`}
              className="flex items-center gap-2"
            >
              <select
                name="collectionId"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-[#466A39]"
              >
                <option value="">Select a collection</option>
                {collections.map((collection) => (
                  <option key={collection._id} value={collection._id}>
                    {collection.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-[#466A39] text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              >
                Add
              </button>
            </Form>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            {authUserId === recipe.user && (
              <>
                <Link
                  to={`/recipes/${recipe._id}/update`}
                  className="bg-[#466A39] text-[#F0ECE3] p-2 rounded shadow"
                >
                  <LuPencil />
                </Link>

                <Form
                  method="post"
                  action={`/recipes/${recipe._id}/destroy`}
                  onSubmit={confirmDelete}
                >
                  <button
                    type="submit"
                    className="bg-[#466A39] text-[#F0ECE3] p-2 rounded shadow"
                  >
                    <FaRegTrashAlt />
                  </button>
                </Form>
              </>
            )}
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
}
