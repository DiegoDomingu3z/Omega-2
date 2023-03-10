import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const UserLocationSchema = new Schema({
    accountId: {type: ObjectId, ref: 'Account', required: true},
    longitude: {type: String, },
    latitude: {type: String, },
    shareLocation: {type: Boolean, required: true, default: false},

}, {
    timestamps: true, toJSON: {virtuals: true}
})

UserLocationSchema.virtual('user', {
    localField: 'userId',
    foreignField: '_id',
    ref: 'Account',
    justOne: true
})