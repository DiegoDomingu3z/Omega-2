import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const CloseFriendsSchema = new Schema({
    accountId: { type: ObjectId, ref: 'Account', required: true },
    friends: [{
        type: String,
        unique: true
    }]
})