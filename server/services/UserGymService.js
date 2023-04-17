import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"

class UserGymService {

    /**
       * Returns a list of users that the current user can swipe on
       * Calls function "excludedSwipedAccounts" to filter out all accounts user has already swiped on
       * @param {string} id (gymId)
       * @param {string} offset
       * @param {string} limit
       * @param {string} userId
      */
    async getGymUsers(id, offset, limit, userId) {
        const excludedIds = await this.excludeSwipedAccounts(userId)
        const data = await dbContext.UserGym
            .find({ gymId: id, accountId: { $nin: excludedIds } })
            .skip(Number(offset))
            .limit(limit)
        return data
    }



    /**
    * Returns a list of user ids, that the current user has already swiped on
    * @param {string} userId
   */
    async excludeSwipedAccounts(id) {
        const accounts = await dbContext.UserLike.find({ accountId: id })
        const excludedAccounts = accounts.map(match => match.potentialMatchId)
        logger.log(excludedAccounts)
        return excludedAccounts
    }




}




export const userGymService = new UserGymService()