import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class LikeUserService {

    // alg to like a user
    async swipeUser(accountId, likedUserId) {
        // create doc for liked user
        const swiped = await dbContext.UserLike.create(
            {
                accountId: accountId,
                potentialMatchId: likedUserId
            }
        )
        logger.log(swiped)
        const check = await this.checkIfMatchExists(accountId, likedUserId)
        if (check) {
            return "MATCH"
        } else {
            return 200
        }
    }


    // FIND WHY THIS ISNT WORKING, OBJHECT IDS NOT WORKING

    async checkIfMatchExists(accountId, likedUserId) {
        // check to see if a document where they were liked by the user exists
        // if so, create match
        const id = ObjectId(likedUserId)
        const check = await dbContext.UserLike.findOne({
            accountId: id,
            potentialMatchId: accountId.toString()
        })
        if (check) {
            // create document for user that liked and makes match for them
            const createMatch = await dbContext.userMatches.create(
                {
                    accountId: accountId,
                    matchId: likedUserId
                }
            )
            // creates document for match for other user they matched
            const matchForOther = await dbContext.userMatches.create({
                accountId: likedUserId,
                matchId: accountId
            })
        }
        return check
    }

}



export const likeUserService = new LikeUserService()