import React, { useState } from "react";
import type { Route } from "./+types/home";
import { Link, redirect } from "react-router";
import { getRecipes } from "../data";
import Navbar from "~/navigation/navbar";
import { sessionStorage } from "~/services/session.server";
import { FaSearch, FaTimes, FaHeart, FaRegHeart } from "react-icons/fa";
import Header from "~/components/Header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }

  const recipes = await getRecipes();
  const userRecipes = recipes.filter((recipe) => recipe.user === authUserId);

  return { recipes: userRecipes };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { recipes } = loaderData;
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (recipe) =>
        selectedTags.length === 0 ||
        selectedTags.every((tag) => recipe.tags.includes(tag))
    )
    .filter((recipe) => !showFavorites || recipe.isFavourite);

  const uniqueTags = Array.from(
    new Set(recipes.flatMap((recipe) => recipe.tags))
  );

  const handleTagChange = (tag: string) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  return (
    <div className="pb-24 bg-[#F0ECE3]">
      <Header/>
      <div className="max-w-4xl mx-auto p-6 bg-[#F0ECE3] rounded-lg">
        <h1 className="text-2xl font-semibold text-[#466A39] mb-6 text-center">
          Your Recipes
        </h1>
        <div className="flex justify-between items-center mb-4">
  <button
    onClick={() => setShowSearchBar(!showSearchBar)}
    className="px-4 py-2 bg-[#466A39] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#3B5731] transition"
  >
    {showSearchBar ? <FaTimes /> : <FaSearch />}
  </button>

  {/* Add New Recipe button */}
  <Link
    to="/recipes/new"
    className="bg-[#466A39] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#3B5731] transition"
  >
    Add New Recipe
  </Link>
</div>

{showSearchBar && (
  <div className="mb-6">
    <input
      type="text"
      placeholder="Search for a recipe..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="mb-4 p-3 border border-gray-300 rounded-full w-full text-black bg-white shadow-sm focus:ring-[#466A39]"
    />
    <div className="mb-4 flex flex-wrap gap-2">
      {uniqueTags.map((tag, index) => (
        <label
          key={index}
          className="inline-flex items-center text-[#466A39] rounded-full px-3 py-1 cursor-pointer transition-colors"
        >
          <input
            type="checkbox"
            value={tag}
            checked={selectedTags.includes(tag)}
            onChange={() => handleTagChange(tag)}
            className="hidden peer"
          />
          <span className="bg-[#E6E1D8] ml-2 peer-checked:bg-[#466A39] peer-checked:text-white px-3 py-1 rounded-full cursor-pointer transition-colors">
            {tag}
          </span>
        </label>
      ))}
    </div>
    <label className="inline-flex items-center">
  <input
    type="checkbox"
    checked={showFavorites}
    onChange={() => setShowFavorites(!showFavorites)}
    className="hidden peer"
  />
  <span className="ml-2 bg-[#E6E1D8] text-[#466A39] px-3 py-1 rounded-full cursor-pointer peer-checked:bg-[#466A39] peer-checked:text-white transition-colors">
    Sort by Favorites
  </span>
</label>

  </div>
)}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-[#F7F4ED] p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
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
                {recipe.isFavourite && (
                  <div className="absolute top-2 right-2">
                    <FaHeart size={36} className="text-red-500" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#466A39] mb-2 hover:text-[#3B5731] transition-colors">
                    {recipe.title}
                  </h2>
                </div>
              </Link>
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
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Collections:
                </h3>
                <ul className="list-disc list-inside">
                  {recipe.collections?.map((collection) => (
                    <li key={collection._id}>
                      <Link
                        to={`/collections/${collection._id}`}
                        className="text-[#466A39] hover:underline"
                      >
                        {collection.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  );
}
