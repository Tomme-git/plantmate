import { Link, Form, redirect } from "react-router";
import type { Route } from "../routes/+types/collections";
import Navbar from "~/navigation/navbar";
import Collections from "~/models/Collections";
import Recipe from "~/models/Recipes";
import { IoMdAdd } from "react-icons/io";
import { sessionStorage } from "~/services/session.server";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import Header from "~/components/Header";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Your Collections" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authUserId = session.get("authUserId");

  if (!authUserId) {
    return redirect("/signin"); // Redirect if no user is logged in
  }

  // Fetch collections owned by the user
  const collections = await Collections.find({ user: authUserId });

  // Fetch one recipe per collection (if available)
  const collectionsWithImages = await Promise.all(
    collections.map(async (collection) => {
      const firstRecipe = await Recipe.findOne({
        collections: { $in: [collection._id] }, // Fix: Use $in for array reference
        image: { $ne: null }, // Ensure recipe has an image
      }).select("image"); // Only retrieve the image field

      return {
        ...collection.toObject(),
        recipeImage: firstRecipe?.image || null, // Store the first recipe's image
      };
    })
  );

  console.log("Collections with Images:", collectionsWithImages); // Debugging

  return {
    collections: collectionsWithImages,
  };
}

export default function CollectionsPage({ loaderData }: Route.ComponentProps) {
  const { collections } = loaderData;

  function confirmDelete(event: React.FormEvent) {
    const response = confirm(
      "You are about to delete this collection. Are you sure?"
    );
    if (!response) {
      event.preventDefault();
    }
  }

  return (
    <div className="min-h-screen bg-[#F0ECE3]">
      <Header/>
      <div className="max-w-3xl mx-auto p-6 bg-[#F0ECE3] rounded-lg">
        <h1 className="text-2xl font-semibold text-center text-[#466A39] mb-6">
          Your Collections
        </h1>
        <div className="space-y-4">
          <Link
            to="/collections/new"
            className="inline-block bg-[#466A39] text-white rounded-lg px-3 py-2 shadow-md"
          >
            Add New Collection
          </Link>
          {collections.map((collection) => {
            // Use collection image, fallback to first recipe image, or placeholder
            const collectionImage =
              collection.image ||
              collection.recipeImage || // Use first recipe's image if available
              `https://placehold.co/600x400/F0ECE3/466A39?text=${encodeURIComponent(
                collection.name
              )}`;

            return (
              <div
                key={collection._id}
                className="bg-[#F7F4ED] p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
                style={{
                  backgroundImage: `url(${collectionImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                }}
              >
                <div className="absolute inset-0 bg-[#466A39] opacity-30 rounded-lg"></div>
                <div className="relative p-4">
                  <Link to={`/collections/${collection._id}`}>
                    <h2
                      className="text-xl font-semibold text-white mb-2 transition-colors"
                      style={{
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {collection.name}
                    </h2>
                    <p
                      className="text-white"
                      style={{
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {collection.description}
                    </p>
                  </Link>
                  <div className="flex gap-2 mt-6">
                    <Link
                      to={`/collections/${collection._id}/update`}
                      className="bg-[#F0ECE3] text-[#466A39] p-2 rounded shadow"
                    >
                      <LuPencil />
                    </Link>
                    <Form
                      method="post"
                      action={`/collections/${collection._id}/destroy`}
                      onSubmit={confirmDelete}
                    >
                      <button
                        type="submit"
                        className="bg-[#F0ECE3] text-[#466A39] p-2 rounded shadow"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Navbar />
    </div>
  );
}
