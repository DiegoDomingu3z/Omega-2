import mongoose from 'mongoose'
const Schema = mongoose.Schema

export const AccountSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    firstName:
        { type: String, required: true, },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        minlength: 16
    },
    authToki: {
        type: String,
    },
    authExpiration: {
        type: Date
    },
},
    { timestamps: true, toJSON: { virtuals: true, } })