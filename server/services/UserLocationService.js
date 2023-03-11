import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"

class UserLocationService {

async setLocation(data, userId){
    const check = await this.checkUserLocationExists(data)
    if (check.length > 0) {
        return "ALREADY SHARING"
    } else {
        logger.log(userId, "THIS THE USER ID")
        const locationData = {
            longitude: data.longitude,
            latitude: data.latitude,
            accountId: userId
        }
        logger.log(locationData)
        const location = await dbContext.UserLocation.create(locationData)
        return location
    }

}


// Check to see if user has already accepted to share location and is already in DB
async checkUserLocationExists(data){
const check = await dbContext.UserLocation.find({"accountId": data.accountId})
return check
}



}




export const userLocationService = new UserLocationService()