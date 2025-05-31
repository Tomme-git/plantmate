import { Schema, model, type SchemaType, type Document } from "mongoose";
import type { CollectionsType } from "./Collections";

// Define the schema
const recipeSchema = new Schema(
    {
        title: String,
        description: String,
        ingredients: [String],
        steps: [String],
        tags: [String],
        estimatedTime: Number,
        isFavourite: Boolean,
        collections: [{ type: Schema.Types.ObjectId, ref: "Collections" }],
        user: { type: String, required: true },
        image: String,
    },
    {
        timestamps: true,
        toObject: {
            flattenObjectIds: true,
            getters: true,
        },
    }
);

// Define a TypeScript type for the Recipe model
export interface RecipeType extends Document {
    title: string;
    description: string;
    ingredients: string[];
    steps: string[];
    tags: string[];
    estimatedTime: number;
    isFavourite: boolean;
    collections?: Schema.Types.ObjectId[];
    user: string;
    image: string;
}

// Create and export the model
const Recipe = model<RecipeType>("Recipe", recipeSchema);
export default Recipe;
