import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"

class UserLocationService {

    /**
         * Checks to see if documents already exists for the users location
         * If yes it will return nothing
         * else it wil create a document for the user, which can then later be used to update users location
         * @param {Object} data (user location details)
         * @param {String} id (users id)
         * @returns {Object} location (user location details)
        */
    async setLocation(data, userId) {
        logger.log(userId, "THIS THE ID")
        const check = await this.getUserLocation(userId)
        if (check) {
            return "Location Document already exists"
        } else {

            const locationData = {
                longitude: data.longitude,
                latitude: data.latitude,
                accountId: userId
            }
            logger.log("Created")
            logger.log(locationData)
            const location = await dbContext.UserLocation.create(locationData)
            return location
        }


    }

    /**
           * Checks to see if documents already exists for the users location
           * @param {String} token (users auth token)
           * @returns {Object} user (user location details)
          */
    async getUserLocation(token) {
        const user = await dbContext.UserLocation.findOne({ "accountId": token })
        return user
    }









}




export const userLocationService = new UserLocationService()