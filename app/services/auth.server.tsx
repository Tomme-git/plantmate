import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { redirect } from "react-router";
import { getSession, commitSession } from "./session.server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User";

// Create an instance of the authenticator
export let authenticator = new Authenticator<string>();

// Define the function to verify the user
async function verifyUser({
  mail,
  password,
}: {
  mail: string;
  password: string;
}) {
  const user = await mongoose.models.User.findOne({ mail }).select("+password");
  if (!user) {
    throw new Error("No user found with this email.");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid password.");
  }
  return user.id;
}

// Define and use the authentication strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const mail = form.get("mail");
    const password = form.get("password");

    // Validate input
    if (!mail || typeof mail !== "string" || !mail.trim()) {
      throw new Error("Email is required and must be a string");
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      throw new Error("Password is required and must be a string");
    }

    // Verify user
    return await verifyUser({ mail, password });
  }),
  "user-pass"
);

// The `action` function for sign-in
export async function action({ request }: { request: Request }) {
  try {
    const userId = await authenticator.authenticate("user-pass", request);
    const session = await getSession(request.headers.get("Cookie"));

    session.set("authUserId", userId);

    return redirect("/profile", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ error: "An unknown error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
