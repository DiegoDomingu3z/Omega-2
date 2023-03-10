import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const FriendsSchema = new Schema({
    accountId: {type: ObjectId, ref: 'Account', required: true},
    friends: [{
        type: ObjectId,
        ref: "Account",
        unique: true
    }]
})