import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  image?: string;
  mail: string;
  name?: string;
  password: string;
}

const userSchema = new Schema<IUser>(
    {
      image: {
        type: String
      },
      mail: {
        type: String,
        required: true,
        unique: [true, "User already exists."] // Enforce uniqueness to avoid duplicate emails
      },
      name: {
        type: String
      },
      password: {
        type: String,
        required: true, // Ensure user passwords are required
        select: false // Automatically exclude from query results
      }
    },
    {
        toObject: {
            flattenObjectIds: true,
            getters: true,
        },
        timestamps: true,
    }  );

// pre save password hook
userSchema.pre("save", async function (next) {
    const user = this; // this refers to the user document
  
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
      return next(); // continue
    }
  
    const salt = await bcrypt.genSalt(10); // generate a salt
    user.password = await bcrypt.hash(user.password, salt); // hash the password
    next(); // continue
  });

  const User = mongoose.model<IUser>("User", userSchema);
export default User;