import { model, Schema, Types } from 'mongoose';

export type ProtoUserI = {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    role?: 'admin' | 'user';
    isVip?: boolean;
    appointment?: Array<{
        treatmentId?: Types.ObjectId;
        date?: Date;
        isDone?: boolean;
        discount?: number;
    }>;
};

export type UserI = {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'admin' | 'user';
    isVip: boolean;
    appointment: Array<{
        treatmentId: Types.ObjectId;
        date?: Date;
        isDone?: boolean;
        discount?: number;
    }>;
};
export const userSchema = new Schema<UserI>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: String,
    password: String,
    phone: String,
    role: String,
    isVip: Boolean,
    appointment: Array<{
        treatmentId: {
            type: Schema.Types.ObjectId;
            ref: 'Treatments';
        };
        date?: Date;
        isDone?: boolean;
        discount?: number;
    }>,
});
userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.password;
    },
});

export const User = model<UserI>('User', userSchema, 'users');
