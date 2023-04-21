import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account';
import { GymSchema } from '../models/Gym';
import { UserGymSchema } from '../models/UserGym';
import { UserLikesSchema } from '../models/UserLikes';
import { UserLocationSchema } from '../models/UserLocation';
import { UserMatchesSchema } from '../models/UserMatches';
import { ValueSchema } from '../models/Value'
import { CloseFriendsSchema } from '../models/CloseFriends';
import { PostSchema } from '../models/Post';
import { AuthTokensSchema } from '../models/AuthTokens';

class DbContext {
  Values = mongoose.model('Value', ValueSchema);

  Account = mongoose.model('Account', AccountSchema)

  UserLocation = mongoose.model('UserLocation', UserLocationSchema)

  Gym = mongoose.model('Gym', GymSchema)

  UserGym = mongoose.model('UserGym', UserGymSchema)

  UserLike = mongoose.model('UserLike', UserLikesSchema)

  userMatches = mongoose.model('userMatches', UserMatchesSchema)

  closeFriends = mongoose.model('CloseFriends', CloseFriendsSchema)

  Posts = mongoose.model('Posts', PostSchema)

  AuthTokens = mongoose.model('AuthTokens', AuthTokensSchema)

}

export const dbContext = new DbContext()
