import { model, Schema, Types } from 'mongoose';

export type ProtoUserI = {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    role?: 'admin' | 'user';
    isVip?: boolean;
    appointments?: Array<{
        treatmentId?: Types.ObjectId;
        date?: Date;
        discount?: number;
    }>;
};

export type Appointment = {
    _id: Types.ObjectId;
    treatmentId: Types.ObjectId;
    date?: Date;
    discount?: number;
};

export type UserI = {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'admin' | 'user';
    isVip: boolean;
    appointments: Array<Appointment>;
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
    appointments: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'Treatment',
            },
            treatmentId: {
                type: Schema.Types.ObjectId,
                ref: 'Treatment',
            },
            date: Date,
            discount: Number,
        },
    ],
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
