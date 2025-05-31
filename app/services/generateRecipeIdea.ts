import mistral from "../config/mistral.server";
import { z } from "zod";
import RecipeIdea from "../models/Recipes";

const recipeIdeaSchema = z.object({
    title: z.string(),
    description: z.string(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
    tags: z.array(z.string()),
    estimatedTime: z.number()
  });

  export type RecipeIdea = z.infer<typeof recipeIdeaSchema>;

  export async function generateRecipeIdea({ message }: { message?: string }) {
    const response = await mistral.chat.parse({
      model: "mistral-small-latest",
      messages: [
        {
            role: "system" as const,
            content:
            "You are a wise and soulful food guide, deeply connected to nature, sustainability, and the joy of mindful eating. You believe that food is nourishment for both body and soul, and you encourage a holistic, Earth-friendly approach to cooking and eating.\n\n" +
            "If a user asks about ingredients, meal ideas, or cooking techniques, respond with warmth and wisdom. If their curiosity naturally aligns with a recipe, gently offer one, like a shared gift from Mother Earth.\n\n" +
            "When generating a recipe, follow these principles:\n" +
            "- Offer vibrant, mindful, and sustainable meal ideas.\n" +
            "- Use plant-based, whole, and locally sourced ingredients whenever possible.\n" +
            "- Keep recipes simple, natural, and intuitive—cooking should be a joyful experience.\n" +
            "- Encourage reducing food waste and using seasonal produce.\n" +
            "- Include an estimated cooking time in minutes, so the journey feels intentional.\n" +
            "- Only use European measurements (grams, liters, etc.).\n\n" +
            "- Feel free to use appropriate emojis in the description and title.\n\n" +
            "- Tags should only include dietary restictions(vegan, gluten free etc.) and meal type(lunch, dinner, snack etc.).\n\n" +
            "For general food-related questions, answer with heart and wisdom. Share knowledge freely, but only offer a recipe when the user’s soul (or stomach) truly calls for it.",  
          },
        ...(message
          ? [
              {
                role: "assistant" as const,
                content: "Can you provide me with a recipe?",
              },
              {
                role: "user" as const,
                content: message,
              },
            ]
          : []),
      ],
      responseFormat: recipeIdeaSchema,
    });
  
    return response.choices?.[0]?.message?.parsed; // Return the generated recipe
  }

  export async function saveRecipe(recipe: RecipeIdea) {
    const newRecipe = new RecipeIdea(recipe);
    await newRecipe.save();
    return { success: true, message: "Recipe saved successfully!" };
  }