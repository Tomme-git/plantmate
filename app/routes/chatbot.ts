import { generateRecipeIdea } from "~/services/generateRecipeIdea";
import type { Route } from "./+types/chatbot";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const message = formData.get("message") as string;
  const projectIdea = await generateRecipeIdea({ message });
  return Response.json(projectIdea);
}