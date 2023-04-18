import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"

class CloseFriendsService {




    // FUNCTION MUST CHECK IF FRIENDS IS IN DOCUMENT ARRAY IF NOT ADD THEM TO THE LIST
    // ELSE LET THE USER KNOW THE FRIEND THEY ARE TRYING TO ADD IS ALREADY ON THE LIST
    // USER MUST BE A MATCH TO BE A CLOSE FRIEND ?!?!?!?!
    async addFriend(adminId, friendId) {
        try {
            const dataCheck = await this.checkIfFriend(adminId, friendId)
            if (dataCheck > 0) {
                return Promise.resolve(401)
            } else {
                return "FIX THISSSS"
            }
        } catch (error) {
            logger.error(error)
            return error
        }
    }



    async checkIfFriend(adminId, friendId) {
        try {
            const query = {
                accountId: adminId,
            }

            const data = await dbContext.closeFriends.findOne(query)
            const arr = data.friends

            if (arr.includes(friendId)) {
                return 401
            } else {
                arr.push(friendId)
                const query2 = {
                    query,
                    { friends: arr }
                const doc = await dbContext.closeFriends.findOneAndUpdate(query2)
            }
        }

            return data
    } catch(error) {
        logger.log(error)
        return error
    }
}



}


export const closeFriendsService = new CloseFriendsService()