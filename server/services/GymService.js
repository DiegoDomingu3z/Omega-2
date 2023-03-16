import { dbContext } from '../db/DbContext';
import { logger } from '../utils/Logger';
const rp = require('request-promise');
const key = process.env.GOOGLE_API_KEY
const url = process.env.FIND_GYM
class GymService {

    // called in the controller 
    // takes in gymid and userid
    async registerToGym(gymId, userId) {
        // checks if location exists && if its a gym
        const gymCheck = await this.checkGymExists(gymId)
        if (gymCheck == 400) {
            return "THIS IS NOT A GYM"
        } else {
            // sends data to create the gym
            const resiterGym = await this.createGym(gymCheck, userId)
            if (resiterGym == 401) {
                return "THIS IS NOT A GYM"
            } else {
                // assigns the user to that gym
                const registration = await dbContext.UserGym.create(
                    {
                        gymId: resiterGym.gymId,
                        accountId: userId,
                        atTheGym: false
                    }
                )
                return registration
            }
        }
    }


    // function to calls google api to check if location even exists
    // data is the id the user send when registering to gym
    async checkGymExists(data) {
        const options = {
            method: 'GET',
            uri: `${url}?place_id=${data}&key=${key}`
        }
        logger.log(options.uri)
        let gym = await rp(options, function (error, res) {
            if (error) {
                logger.log(error)
                return 400
            } else {
                return res
            }
        })
        const checkData = JSON.parse(gym)
        logger.log(checkData)
        // this is to check if id given is even a valid location
        if (checkData.status == 'INVALID_REQUEST') {
            logger.log("STOPPED HERE")
            return 400
        } else {
            // check if the location type is a gym or health && if its operational
            if (checkData.result.types.includes("gym", "health") && checkData.result.business_status == 'OPERATIONAL') {
                // filter down even more
                // check if its a school or closed, if it is return 400
                if (checkData.result.types.includes("school") || checkData.result.permanently_closed == true) {
                    return 400
                } else {
                    return checkData.result
                }
            }
        }
    }

    // takes in gym obj
    async createGym(gym, userId) {
        const id = gym.place_id
        // checks to see if theres one?
        const exists = await dbContext.Gym.findOne({ gymId: id })
        const checkUser = await dbContext.UserGym.findOne({ accountId: userId, gymId: id })
        if (checkUser) {
            return 401
        } else {
            if (exists) {
                return exists
            }
            else {
                const gymCreation = await dbContext.Gym.create(
                    {
                        gymId: id,
                        name: gym.name,
                        rating: gym.rating,
                        reviews: gym.reviews,
                        longitude: gym.geometry.location.lng,
                        latitude: gym.geometry.location.lat

                    }
                )
                return gymCreation
            }
        }
    }
}



export const gymService = new GymService()