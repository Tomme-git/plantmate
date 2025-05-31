import { Schema, model, type Document } from "mongoose";

const collectionsSchema = new Schema(
    {
        name: { type: String, required: true },
        description: String,
        image: String,
        user: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
        toObject: {
            flattenObjectIds: true,
            getters: true,
        },
        timestamps: true,
    }
);

export interface CollectionsType extends Document {
    name: string;
    description?: string;
    image?: string;
    user: string;
}

const Collections = model<CollectionsType>("Collections", collectionsSchema);
export default Collections;
