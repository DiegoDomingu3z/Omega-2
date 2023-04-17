import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class LikeUserService {

    /**
     *ALGORITHM TO LIKE USERS
    * Create document for likes of a user
    * calls function to check if it should create a match document
    * @param {String} accountId 
    * @returns {String} || @returns {StatusCode}
   */
    async swipeUser(accountId, likedUserId) {
        try {
            // create doc for liked user
            const swiped = await dbContext.UserLike.create(
                {
                    accountId: accountId,
                    potentialMatchId: likedUserId
                }
            )
            const check = await this.checkIfMatchExists(accountId, likedUserId)
            if (check == 'MATCH') {
                const data = await dbContext.userMatches.find({ accountId: accountId, matchId: likedUserId })
                return Promise.resolve(data)
            } else {
                return Promise.resolve(200)
            }
        } catch (error) {
            logger.error(error)
        }

    }


    /**
     * Function checks if users accountId is already associated with a document that contains himself as the potentialMatch
     * and the user they liked as the accountId, this determines if it should create a match documents
     * 2 documents are made if so, one for the user and the potential match
     * @param {ObjectId} accountId
     * @returns {String} MATCH || @returns {Object} check (contains user and potential matchId)
    */

    async checkIfMatchExists(accountId, likedUserId) {
        try {
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
                return Promise.resolve('MATCH')
            }
            return Promise.resolve(check)
        } catch (error) {
            logger.error(error)
        }

    }

}



export const likeUserService = new LikeUserService()