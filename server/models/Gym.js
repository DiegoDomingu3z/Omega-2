import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId


export const GymSchema = new Schema({
    gymId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Array },
    longitude: { type: String },
    latitude: { type: String },
})