import { Schema, Document, model } from "mongoose";

interface ILicense extends Document {
    userId: string;
    plugin: string;
    license: string;
    enderess: string;
    activated: boolean;
}

const licenseSchema = new Schema<ILicense>({
    userId: { type: String, required: true },
    plugin: { type: String, required: true},
    license: { type: String, require: true },
    enderess: { type: String, require: true },
    activated: Boolean
})

export default model<ILicense>("License", licenseSchema);
