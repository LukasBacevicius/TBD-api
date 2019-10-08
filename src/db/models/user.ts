import { Document, Schema, Model, model } from "mongoose";

export interface UserDocument extends Document {
    name: string,
    email: string
}

export interface UserModel extends UserDocument { }

export const UserSchema: Schema = new Schema(
    {
        name: String,
        email: String
    },
    { collection: "users" }
);

export const User: Model<UserModel> = model<UserModel>(
    "User",
    UserSchema
);