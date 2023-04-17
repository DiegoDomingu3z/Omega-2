import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"

class UserGymService {

    async getGymUsers(id, offset, limit, userId) {
        const excludedIds = await this.excludeSwipedAccounts(userId)
        const data = await dbContext.UserGym
            .find({ gymId: id, accountId: { $nin: excludedIds } })
            .skip(Number(offset))
            .limit(limit)
        return data
    }




    async excludeSwipedAccounts(id) {
        const accounts = await dbContext.UserLike.find({ accountId: id })
        const excludedAccounts = accounts.map(match => match.potentialMatchId)
        logger.log(excludedAccounts)
        return excludedAccounts
    }




}




export const userGymService = new UserGymService()