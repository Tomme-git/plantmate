import type { RecipeIdea } from "../services/generateRecipeIdea";

export default function RecipeIdeaCard({
  title,
  description,
  ingredients = [],
  steps = [],
  tags = [],
  estimatedTime,
}: RecipeIdea) {
  return (
    <div className="p-6 bg-[#e3f1e5] rounded-lg">
        <h2 className="text-2xl font-bold text-green-700">{title}</h2>
        <p className="text-green-900">{description}</p>

        <div className="mt-3">
            <h3 className="font-semibold text-lg text-green-700">Ingredients:</h3>
            <ul className="list-disc list-inside space-y-1 text-green-900">
                {ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
        </div>

        <div className="mt-4">
            <h3 className="font-semibold text-lg text-green-700">Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-green-900">
                {steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>

        <div className="mt-4 text-sm text-green-600">
            Estimated Time: {estimatedTime} min
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center bg-[#F7F4ED] text-[#466A39] rounded-full px-3 py-1 cursor-pointer">
                    #{tag}
                </span>
            ))}
        </div>
    </div>
);

  
}
