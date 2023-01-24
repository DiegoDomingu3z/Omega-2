import mongoose from 'mongoose'
const Schema = mongoose.Schema

export const AccountSchema = new Schema({
    emailAddress: { type: String, required: true, },
    firstName: { type: String, required: true, },
    lastName: { type: String, required: true },
    age: { type: Number, minlength: 16 }
},
    { timestamps: true, toJSON: { virtuals: true, } })