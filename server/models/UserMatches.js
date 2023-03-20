import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const UserMatchesSchema = new Schema({
    accountId: { type: ObjectId, ref: 'Account', required: true },
    matchId: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    },

})