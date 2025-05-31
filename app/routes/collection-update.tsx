import { useNavigate, Form, redirect, data } from "react-router";
import { useState } from "react";
import mongoose from "mongoose";
import Collections from "~/models/Collections";
import Navbar from "~/navigation/navbar";
import type { Route } from "./+types/collection-update";
import Header from "~/components/Header";

export async function loader({ params }: Route.LoaderArgs) {
    const collection = await Collections.findById(params.id);
    if (!collection) {
        throw new Response("Collection not found", { status: 404 });
    }
    return { collection: collection.toObject() };
}

export default function CollectionUpdatePage({
    loaderData,
    actionData,
}: Route.ComponentProps) {
    const navigate = useNavigate();
    const { collection } = loaderData;
    const [image, setImage] = useState("");

    function handleCancel() {
        navigate(-1);
    }

    return (
        <div className="pb-24 bg-[#F0ECE3]">
            <Header/>
            <div className="max-w-3xl mx-auto p-6 bg-[#F0ECE3] rounded-lg ">
                <h1 className="text-3xl font-semibold text-[#466A39] mb-6 text-center">
                    Update Collection
                </h1>
                <Form method="post" className="space-y-4">
                    <div>
                        <label className="block text-lg font-medium text-[#466A39]">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={collection.name}
                            className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-[#466A39]">
                            Description
                        </label>
                        <textarea
                            name="description"
                            defaultValue={collection.description}
                            className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-[#466A39]">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="block text-lg font-medium text-[#466A39]">
                            Image Preview
                        </label>
                        <img
                            src={
                                image ||
                                "https://placehold.co/600x400?text=Preview"
                            }
                            alt="Collection Preview"
                            className="mt-2 w-full h-64 object-cover rounded-lg border"
                            onError={(e) => {
                                const target =
                                    e.currentTarget as HTMLImageElement;
                                target.src =
                                    "https://placehold.co/600x400?text=Error+loading+image";
                            }}
                        />
                    </div>
                    {actionData?.errors && (
                        <div className="error-message text-red-500">
                            <p>{actionData?.errors?.caption?.message}</p>
                            <p>{actionData?.errors?.image?.message}</p>
                        </div>
                    )}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#466A39] text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Update Collection
                        </button>
                    </div>
                </Form>
            </div>
            <Navbar />
        </div>
    );
}

export async function action({ request, params }: Route.ActionArgs) {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const image = formData.get("image");

    try {
        await Collections.findByIdAndUpdate(params.id, {
            name,
            description,
            image,
        });
        return redirect(`/collections/${params.id}`);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return data({ errors: error.errors });
        }
    }
}
