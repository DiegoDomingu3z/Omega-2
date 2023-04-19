import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId


export const PostSchema = new Schema({
    accountId: { type: ObjectId, ref: 'Account', required: true },
    privacy: { type: Boolean, required: true, default: false },
    bio: { type: String, required: true, maxlength: [100, "Can only be 100 characters long"] },
    // THIS WILL CHANGE ONCE I FIGURE HOW TO STORE IMAGES IN MONGODB
    image: { type: String, required: true },
    likes: { type: Number, default: 0 },
    timeCreated: { type: Date }
})