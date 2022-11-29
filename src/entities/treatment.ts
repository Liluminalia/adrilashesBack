import { model, Schema } from 'mongoose';

export type ProtoTreatmentI = {
    title?: string;
    img?: string;
    description?: string;
    price?: string;
    time?: string;
};

export type TreatmentI = {
    id: string;
    title: string;
    img: string;
    description: string;
    price: string;
    time: string;
};
export const treatmentSchema = new Schema<TreatmentI>({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    img: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: Number,
    time: Number,
});
treatmentSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.password;
    },
});

export const Treatment = model<TreatmentI>(
    'Treatment',
    treatmentSchema,
    'treatments'
);
