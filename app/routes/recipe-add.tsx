import { useState } from "react";
import { Form, redirect, useNavigate } from "react-router";
import Navbar from "~/navigation/navbar";
import { sessionStorage } from "~/services/session.server";
import type { LoaderFunction, ActionFunction } from "react-router";
import Recipe from "~/models/Recipes"; // Import the Recipe model
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";
import Header from "~/components/Header";



export const meta = () => {
    return [{ title: "Plantmate 🌱 Add Recipe" }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const session = await sessionStorage.getSession(
        request.headers.get("cookie")
    );
    const userEmail = session.get("authUserId");

    if (!userEmail) {
        return redirect("/signin"); // Redirect if no user is logged in
    }

    return { userEmail };
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const session = await sessionStorage.getSession(
        request.headers.get("cookie")
    );
    const authUserId = session.get("authUserId");

    if (!authUserId) {
        return redirect("/signin"); // Redirect if no user is logged in
    }

    const newRecipe = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        ingredients: (formData.get("ingredients") as string).split(","),
        steps: formData.getAll("steps") as string[],
        tags: (formData.get("tags") as string).split(","),
        estimatedTime: parseInt(formData.get("estimatedTime") as string, 10),
        isFavourite: formData.get("isFavourite") === "on",
        image: formData.get("image") as string, // Ensure image is included
        user: authUserId, // Attach the authenticated user's ID
    };

    // Save the new recipe
    try {
        await Recipe.create(newRecipe);
    } catch (error) {
        console.error("Error saving recipe:", error);
        return { status: 500, message: "Failed to save recipe" };
    }

    return redirect("/");
};

export default function AddRecipePage() {
    const [image, setImage] = useState(
        "https://placehold.co/600x400?text=Add+your+amazing+image"
    );
    const [steps, setSteps] = useState<string[]>([""]);
    const navigate = useNavigate();

    function handleCancel() {
        navigate(-1);
    }

    function handleStepChange(index: number, value: string) {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    }

    function addStepField() {
        setSteps([...steps, ""]);
    }

    function removeStepField(index: number) {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index));
        }
    }

    return (
        <div className="pb-24 bg-[#F0ECE3]">
            <Header/>
            <main className="flex justify-center items-center min-h-screen bg-[#F0ECE3] p-6">
                <div className="w-full max-w-3xl bg-[#F0ECE3] p-8">
                    <h1 className="text-3xl font-semibold text-[#466A39] mb-6 text-center">
                        Add a Recipe
                    </h1>
                    <Form
                        id="add-recipe-form"
                        method="post"
                        className="space-y-4"
                    >
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
                                placeholder="Enter recipe title..."
                                required
                                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

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
                                placeholder="Write a description..."
                                required
                                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                            ></textarea>
                        </div>

                        <div>
                            <label
                                htmlFor="ingredients"
                                className="block text-lg font-medium text-[#466A39]"
                            >
                                Ingredients (comma-separated)
                            </label>
                            <input
                                id="ingredients"
                                name="ingredients"
                                type="text"
                                placeholder="Enter ingredients..."
                                required
                                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-[#466A39]">Steps</label>
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex gap-2 items-center mb-2"
                                >
                                    <input
                                        type="text"
                                        name={`steps`}
                                        placeholder={`Step ${index + 1}`}
                                        value={step}
                                        onChange={(e) =>
                                            handleStepChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        required
                                        className="bg-[#F7F4ED] my-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeStepField(index)}
                                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        <RxCross2 size={25} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addStepField}
                                className="w-full py-2 bg-[#466A39] text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
                            >
                                <FaPlus />
                                Add Step
                            </button>
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-lg font-medium text-[#466A39]">
                                Tags (comma-separated)
                            </label>
                            <input
                                id="tags"
                                name="tags"
                                type="text"
                                placeholder="Add tags..."
                                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="estimatedTime"
                                className="block text-lg font-medium text-[#466A39]"
                            >
                                Estimated Time (minutes)
                            </label>
                            <input
                                id="estimatedTime"
                                name="estimatedTime"
                                type="number"
                                placeholder="Enter estimated time"
                                required
                                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="isFavourite"
                                name="isFavourite"
                                type="checkbox"
                            />
                            <label
                                htmlFor="isFavourite"
                                className="block text-lg font-small"
                            >
                                Mark as Favourite
                            </label>
                        </div>

                        <div>
                            <label
                                htmlFor="image"
                                className="block text-lg font-medium text-[#466A39]"
                            >
                                Image URL
                            </label>
                            <input
                                id="image"
                                name="image"
                                type="text"
                                placeholder="Enter image URL..."
                                onChange={(e) => setImage(e.target.value)}
                                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="image-preview"
                                className="block text-lg font-medium text-[#466A39]"
                            >
                                Image Preview
                            </label>
                            <img
                                id="image-preview"
                                className="w-full h-60 object-cover rounded border"
                                src={image}
                                alt="Recipe Preview"
                                onError={(e) => {
                                    const target =
                                        e.currentTarget as HTMLImageElement;
                                    target.src =
                                        "https://placehold.co/600x400?text=Error+loading+image";
                                }}
                            />
                        </div>

                        <div className="flex justify-between mt-6">
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
