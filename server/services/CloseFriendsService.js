import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"

class CloseFriendsService {




    // FUNCTION MUST CHECK IF FRIENDS IS IN DOCUMENT ARRAY IF NOT ADD THEM TO THE LIST
    // ELSE LET THE USER KNOW THE FRIEND THEY ARE TRYING TO ADD IS ALREADY ON THE LIST
    // USER MUST BE A MATCH TO BE A CLOSE FRIEND ?!?!?!?!
    async addFriend(adminId, friendId) {
        try {
            const dataCheck = await this.checkIfFriend(adminId, friendId)
            if (dataCheck == 401) {
                return Promise.resolve(401)
            } else {
                return dataCheck
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
            const query2 = {
                accountId: adminId, matchId: friendId
            }
            const matchCheck = await this.checkifMatch(query2)
            if (matchCheck == 401) {
                return 401
            }
            const data = await dbContext.closeFriends.findOne(query)
            if (!data) {
                const createDoc = await dbContext.closeFriends.create({
                    accountId: adminId,
                    friends: [friendId]
                })
                return createDoc
            }
            const arr = data.friends
            if (arr.includes(friendId)) {
                return 401
            } else {
                arr.push(friendId)
                const doc = await dbContext.closeFriends.findOneAndUpdate({ accountId: adminId },
                    { $set: { friends: arr } },
                    { returnOriginal: false })
                return doc
            }
        } catch (error) {
            logger.error(error)
            return error
        }
    }


    async checkifMatch(query2) {
        try {
            const matchCheck = await dbContext.userMatches.findOne(query2)
            if (!matchCheck) {
                return Promise.resolve(401)
            } else {
                return Promise.resolve(200)
            }
        } catch (error) {
            logger.error(error)
            return error
        }
    }


}


export const closeFriendsService = new CloseFriendsService()