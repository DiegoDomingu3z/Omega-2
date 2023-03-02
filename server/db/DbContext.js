import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account';
import { UserLocationSchema } from '../models/UserLocation';
import { ValueSchema } from '../models/Value'

class DbContext {
  Values = mongoose.model('Value', ValueSchema);

  Account = mongoose.model('Account', AccountSchema)

  UserLocation = mongoose.model('UserLocation', UserLocationSchema)

}

export const dbContext = new DbContext()
