import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"

class UserLocationService {

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


    async getUserLocation(token) {
        const user = await dbContext.UserLocation.findOne({ "accountId": token })
        return user
    }









}




export const userLocationService = new UserLocationService()