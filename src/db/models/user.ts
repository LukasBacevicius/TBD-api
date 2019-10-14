import { Document, Schema, Model, model, models } from "mongoose";
import * as bcrypt from 'bcrypt';
export interface UserDocument extends Document {
    name: {
        firstName: string,
        lastName: string,
    },
    email: string,
    phoneNumber: string,
    created_at: string,
    password: string,
    active: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
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
        created_at: {
            type: Date,
            default: Date.now
        },
        /* 
            TODO: Protect the active field so that user can not edit it
        */
        active: {
            type: Boolean,
            default: false
        }
    },
    { collection: "users" }
);

UserSchema.path('email').validate(async (value) => {
    const emailCount = await models.User.countDocuments({ email: value });
    return !emailCount;
}, 'Email already exists');

UserSchema.pre('save', function (next) {
    //@ts-ignore
    bcrypt.hash(this.password, 10, (err, hash) => {
        //@ts-ignore
        this.password = hash;
        next();
    });
});

UserSchema.pre('update', function (next) {
    //@ts-ignore
    bcrypt.hash(this.password, 10, (err, hash) => {
        //@ts-ignore
        this.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
    const password = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (error, success) => {
            if (error) return reject(error);
            return resolve(success);
        });
    });
};

export const User: Model<UserModel> = model<UserModel>(
    "User",
    UserSchema
);