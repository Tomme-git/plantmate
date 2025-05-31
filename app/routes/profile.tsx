import { Form, Link, useLoaderData, redirect } from "react-router";
import type { ActionFunction, LoaderFunction } from "react-router";
import { sessionStorage } from "../services/session.server";
import User from "~/models/User";
import Navbar from "~/navigation/navbar";
import Header from "~/components/Header";

interface UserType {
  _id: string;
  name: string;
  mail: string;
  title: string;
  image: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authUserId = session.get("authUserId");

  if (!authUserId) {
    return redirect("/signin"); // Redirect if no user is logged in
  }

  const user = await User.findById(authUserId).lean();
  if (!user) {
    return redirect("/signin"); // Redirect if user not found
  }

  return { user };
};

export default function Profile() {
  const { user } = useLoaderData<{ user: UserType }>();

  return (
    <div>
    <Header/>
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-[#F0ECE3]">
      
      <div className="p-8 w-full max-w-md text-center max-w-2xl mx-auto w-full p-6 bg-[#F0ECE3] rounded-lg min-h-screen">
        
      <h1 className="text-3xl font-semibold text-center text-gray-500 mb-6">
            Welcome,{" "}
            <span className="font-semibold text-green-800">{user.name}</span>!
            🌿
        </h1>

        {/* Profile Image Section */}
        <div className="relative">
          <img
            src={user.image}
            alt={`${user.name}'s profile`}
            className="w-32 h-32 rounded-full mx-auto shadow-lg"
          />
          <div className="p-4">
            <Link to="/profile/update" className="text-s text-green-700">
              Edit
            </Link>
          </div>
        </div>

        {/* Name and Email */}

        <p className="text-gray-500 mt-2 text-sm">Name: {user.name}</p>
        <p className="text-gray-500 mt-2 text-sm">Email: {user.mail}</p>

        {/* Buttons Section */}
        <div className="mt-8 space-y-4">
          <Form method="post">
            <button className="w-full px-6 py-3 bg-[#466A39] text-white font-semibold rounded-xl shadow-md">
              Logout
            </button>
          </Form>
        </div>
      </div>
      <Navbar />
    </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );

  return redirect("/signin", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
};
