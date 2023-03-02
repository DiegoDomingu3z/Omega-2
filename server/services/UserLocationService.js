import { dbContext } from "../db/DbContext"

class UserLocationService {

async setLocation(data){
    const check = await this.checkUserLocationExists(data)
    if (check.length > 0) {
        return "ALREADY SHARING"
    } else {
        const location = await dbContext.UserLocation.create(data)
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