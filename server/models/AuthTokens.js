import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId


export const AuthTokensSchema = new Schema({
    accountId: { type: ObjectId, ref: 'Account', required: true, unique: true },
    refreshToken: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshCreatedAt: { type: Date, default: Date.now },
    accessCreatedAt: { type: Date, default: Date.now },
    refreshExpires: { type: Number, required: true, default: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 },
    accessExpires: { type: Number, required: true, default: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 }
})