import { Schema, Document, model, Model } from 'mongoose';

export interface IImageAttrs {
    name: string;
    url: string;
    description?: string;
    tags?: string[];
    uploadedBy: string;
    uploadDate: Date;
    copyright?: string;
}

export interface INoodleAttrs {
    name: string;
    description?: string;
    entries: number;
}

export interface IImageDoc extends Document {
    name: string;
    url: string;
    description?: string;
    tags?: string[];
    uploadedBy: string;
    uploadDate: Date;
    copyright?: string;
}

export interface INoodleDoc extends Document {
    name: string;
    description?: string;
    images: IImageDoc[];
    addImage(image: IImageAttrs): Promise<INoodleDoc>;
    getImage(imageId: string): Promise<IImageDoc | null>;
    getRandomImage(): Promise<IImageDoc | null>;
}

export interface INoodleModel extends Model<INoodleDoc> {
    addNoodle(noodle: INoodleAttrs): Promise<INoodleDoc>;
}

const ImageSchema = new Schema<IImageDoc>({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    tags: [String],
    uploadedBy: {
        type: String,
        required: true,
        default: 'anonymous'
    },
    uploadDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    copyright: String
});

export const NoodleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: false,
            default: ''
        },
        images: [ImageSchema],
    },
    {
        timestamps: true
    }
);


NoodleSchema.statics.addNoodle = (doc: INoodleAttrs) => {
    return new Noodle(doc);
}

NoodleSchema.methods.getRandomImage = async function () {
    if (this.images.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
};

NoodleSchema.methods.getImage = async function (imageId: string): Promise<IImageDoc | null> {
    const image = this.images.find((image: IImageDoc) => image._id.toString() === imageId);
    return image || null;
}

NoodleSchema.methods.addImage = async function (image: IImageAttrs) {
    this.images.push(image);
    return this.save();
};

export const Noodle = model<INoodleDoc, INoodleModel>('Noodle', NoodleSchema);
