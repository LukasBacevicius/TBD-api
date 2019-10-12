import { Document, Schema, Model, model, models } from "mongoose";

export interface UserDocument extends Document {
    name: {
        firstName: string,
        lastName: string,
    },
    email: string,
    phoneNumber: string,
    created_at: string,
    password: string,
}

export interface UserModel extends UserDocument { }

export const UserSchema: Schema = new Schema(
    {
        name: {
            firstName: {
                type: String,
                required: [true, "First name is required"],
            },
            lastName: {
                type: String,
                required: [true, "Last name is required"],
            }
        },
        email: {
            type: String,
            lowercase: true,
            required: [true, "Email is required"],
            match: [/\S+@\S+\.\S+/, 'Invalid email address']
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        created_at: Date
    },
    { collection: "users" }
);

UserSchema.path('email').validate(async (value) => {
    const emailCount = await models.User.countDocuments({ email: value });
    return !emailCount;
}, 'Email already exists');

export const User: Model<UserModel> = model<UserModel>(
    "User",
    UserSchema
);