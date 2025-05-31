import { useState } from "react";
import { Form, redirect, useNavigate } from "react-router";
import User from "~/models/User";
import { sessionStorage } from "~/services/session.server";
import Navbar from "~/navigation/navbar";
import bcrypt from "bcrypt";
import Header from "~/components/Header";

export function meta() {
  return [{ title: "PlantMate 🌱 Update Profile" }];
}

// Server-side loader function
export async function loader({ request }: { request: Request }) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }

  const user = await User.findById(authUserId);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user: user.toObject() };
}

// Profile Update Component
export default function UpdateProfilePage({
  loaderData,
}: {
  loaderData: { user: { image: string; name: string; email: string } };
}) {
  const { user } = loaderData;

  const [image, setImage] = useState(user.image);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="pb-24 bg-[#F0ECE3]">
      <Header/>
      <main className="flex justify-center items-center min-h-screen bg-[#F0ECE3] p-8">
        <div className="bg-[#F0ECE3] p-8 max-w-lg w-full">
          <h1 className="text-3xl font-semibold text-[#466A39] mb-6 text-center">
            Update Profile
          </h1>
          <Form id="profile-form" method="post" className="space-y-5">
            {/* Profile Image */}
            <div>
              <label
                htmlFor="image"
                className="block text-lg font-medium text-[#466A39]"
              >
                Profile Image
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
              <label className="block text-lg font-medium text-[#466A39]">
                Image Preview
              </label>
              <img
                className="mt-2 w-32 h-32 object-cover rounded-full border"
                src={image || "https://placehold.co/100x100?text=Profile"}
                alt="Profile Preview"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/100x100?text=Error";
                }}
              />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium text-[#466A39]"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-[#466A39]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-[#466A39]"
              >
                New Password (Leave blank to keep current)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password..."
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
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authUserId = session.get("authUserId");

  if (!authUserId) {
    throw redirect("/signin");
  }

  const user = await User.findById(authUserId);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  // Hash new password if provided
  let hashedPassword = user.password;
  const newPassword = formData.get("password")?.toString();
  if (newPassword) {
    hashedPassword = await bcrypt.hash(newPassword, 10);
  }

  // Update user profile
  await User.findByIdAndUpdate(authUserId, {
    name: formData.get("name"),
    email: formData.get("email"),
    image: formData.get("image"),
    password: hashedPassword, // Secure password handling
  });

  return redirect("/profile");
}
