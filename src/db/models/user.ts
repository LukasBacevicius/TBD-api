import { Document, Schema, Model, model } from "mongoose";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export interface UserDocument extends Document {
    name: {
        firstName: string,
        lastName: string,
    },
    email: string,
    phoneNumber: string,
    created_at: string,
    hash: string,
    salt: string,
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
        hash: String,
        salt: String,
        created_at: Date
    },
    { collection: "users" }
);

UserSchema.methods.setPassword = password => {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = (password) => {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = () => {
    const today = new Date();
    const expirationDate = new Date(today);

    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: expirationDate.getTime() / 1000,
    }, 'secret');
}

UserSchema.methods.toAuthJSON = () => {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};


export const User: Model<UserModel> = model<UserModel>(
    "User",
    UserSchema
);