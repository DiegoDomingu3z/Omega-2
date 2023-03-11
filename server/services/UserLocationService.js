import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"

class UserLocationService {

async setLocation(data, userId){
    const check = await this.checkUserLocationExists(userId)
    const locationData = {
        longitude: data.longitude,
        latitude: data.latitude,
        accountId: userId
    }
    // if (check.length > 0) {
    //     const updatedLocation = await dbContext.UserLocation.updateOne({ "accountId": userId},
    //      {
    //         $set: {"longitude": data.longitude, "latitude": "93939339"}
    //     })
    //     logger.log("Updating", updatedLocation)
    //     return updatedLocation
    // } 
    if (check.length == 0) {
        return "User does not exits"
    }
     else {
        logger.log("Created")
        logger.log(locationData)
        const location = await dbContext.UserLocation.create(locationData)
        return location
    }

}


// Check to see if user has already accepted to share location and is already in DB
async checkUserLocationExists(data){
    logger.log(data)
    const check = await dbContext.Account.find({"accountId": data})
    logger.log(check)
    return check
}



}




export const userLocationService = new UserLocationService()