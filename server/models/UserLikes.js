import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const UserLikesSchema = new Schema({
    accountId: { type: ObjectId, ref: 'Account', required: true },
    potentialMatchId: { type: String, required: true, unique: true },
    createdAt: {
        type: Date,
        default: Date.now
    },
    match: { type: Boolean, default: false, required: true }
})