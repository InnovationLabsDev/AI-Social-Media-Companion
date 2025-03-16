import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    photo: { type: Buffer, required: true },
    url: { type: String, required: true },
    caption: { type: Array, required: true},
    hashtags: { type: Array, required: true },
}, { timestamps: true });

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;
