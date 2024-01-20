import { Schema, Document, model, Model } from 'mongoose';

export interface INoodleAttrs {
    name: string;
    entries: number;
}

export interface INoodleDoc extends Document {
    name: string;
    entries: number;
}

export interface INoodleModel extends Model<INoodleDoc> {
    addNoodle(noodle: INoodleAttrs): Promise<INoodleDoc>;
}

export const NoodleSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        entries: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const Noodle = model<INoodleDoc, INoodleModel>('Noodle', NoodleSchema);

NoodleSchema.statics.addNoodle = (doc: INoodleAttrs) => {
    return new Noodle(doc);
}
