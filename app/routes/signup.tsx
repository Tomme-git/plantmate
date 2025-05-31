import { Form, useActionData, redirect, Link } from "react-router";
import User from "~/models/User";
import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData(); // Get the form data
    const newUser = Object.fromEntries(formData); // Convert form data to an object

    const result = await User.create(newUser); // Create the user in the database

    if (result) {
      return redirect("/signin"); // Redirect to sign-in page on success
    } else {
      return redirect("/signup"); // Redirect back if user creation fails
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }; // Return error message to frontend
    }
  }
};

export default function SignUp() {
  const actionData = useActionData<{ error?: string }>(); // Get error from action

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E6E1D8] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#F0ECE3] p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-[#466A39] mb-6 text-center">
          Sign Up
        </h1>

        {actionData?.error && (
          <p className="mb-4 text-center text-red-600">{actionData.error}</p>
        )}

        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="mail"
              className="block text-lg font-medium text-[#466A39]"
            >
              Email
            </label>
            <input
              id="mail"
              type="email"
              name="mail"
              placeholder="Enter your email"
              required
              className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-[#466A39]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="bg-[#F7F4ED] mt-2 p-3 w-full border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full rounded-lg bg-[#466A39] px-4 py-2 text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </div>
        </Form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-[#466A39] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
