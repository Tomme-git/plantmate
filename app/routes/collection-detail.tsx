import { Link, Form } from "react-router";
import type { Route } from "../routes/+types/collection-detail";
import Navbar from "~/navigation/navbar";
import Collections from "~/models/Collections";
import Recipe from "~/models/Recipes";
import { FaRegTrashAlt } from "react-icons/fa";
import Header from "~/components/Header";

export function meta({ data }: Route.MetaArgs) {
  return [{ title: `${data.collection.name} collection` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const collection = await Collections.findById(params.id);
  if (!collection) {
    throw new Response("Collection not found", { status: 404 });
  }

  const recipes = await Recipe.find({ collections: params.id });

  return {
    collection: collection.toObject(),
    recipes: recipes.map((r) => r.toObject()),
  };
}

export default function CollectionDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const { collection, recipes } = loaderData;

  function confirmRemoveRecipe(event: React.FormEvent) {
    const response = confirm(
      "Are you sure you want to remove this recipe from the collection?"
    );
    if (!response) {
      event.preventDefault();
    }
  }

  return (
    <div className="pb-24 bg-[#F0ECE3]">
      <Header/>
      <div className="max-w-4xl mx-auto p-6 bg-[#F0ECE3] rounded-lg">
        <Link
          to="/collections"
          className="block text-sm text-gray-600 mt-4 mb-4 hover:text-gray-800 transition"
        >
          &larr; Back to Collections
        </Link>
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          {collection.name}
        </h1>
        <p className="text-gray-700 mb-6">{collection.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-[#F7F4ED] p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <Link to={`/recipes/${recipe.id}`} className="block relative">
                <img
                  src={recipe.image || "https://placehold.co/600x400"}
                  alt={recipe.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "https://placehold.co/600x400")
                  }
                />
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#466A39] mb-2 hover:text-[#3B5731] transition-colors">
                    {recipe.title}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                <strong>Estimated Time:</strong> {recipe.estimatedTime} minutes
              </p>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#E6E1D8] text-[#466A39] text-xs font-semibold px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
              <Form
                method="post"
                action={`/collections/${collection._id}/remove-recipe`}
                onSubmit={confirmRemoveRecipe}
                className="relative right-0 top-0"
              >
                <input type="hidden" name="recipeId" value={recipe._id} />
                <button
                  type="submit"
                  className="bg-[#466A39] text-[#F0ECE3] p-2 rounded shadow mt-4"
                >
                  <FaRegTrashAlt />
                </button>
              </Form>
            </div>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  );
}
