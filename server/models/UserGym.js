import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId


export const UserGymSchema = new Schema({
    accountId: { type: ObjectId, required: true, ref: 'Account' },
    gymId: { type: String, required: true, },
    joined: {
        type: Date,
        default: Date.now
    },
    atTheGym: { type: Boolean },
    usualTime: { type: Array }
})