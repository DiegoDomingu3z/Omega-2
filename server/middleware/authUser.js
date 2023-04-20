import { dbContext } from "../db/DbContext"
import { accountService } from "../services/AccountService"
import { logger } from "../utils/Logger"

class AuthUser {
    // LATER I NEED TO CHANGE THE PARAMS FOR THE REFRESH TOKEN TO BE THE ONE THE USER SEND
    // INSTEAD OF ME JUST GRABBING FROM THE DATABASE


    async findUser(token) {
        const data = await dbContext.AuthTokens.findOne({ accessToken: token })
        // get access token from data
        if (data) {
            const accessCreateAt = data.accessCreatedAt
            const refreshCreatedAt = data.refreshCreatedAt
            const accessExpiration = data.accessExpires
            const refreshExpiration = data.refreshExpires
            const now = new Date()
            const accessExpired = new Date(accessExpiration * 1000 + accessCreateAt.getTime())
            const refreshExpired = new Date(refreshExpiration * 1000 + refreshCreatedAt.getTime())
            if (now > accessExpired) {
                logger.log("Expired ACCESS TOKEN")
                if (now > refreshExpired) {
                    return Promise.resolve(403)
                } else if (now < refreshExpired) {
                    // create new token and send back
                    // return data
                    const newAccessToken = await accountService.generateNewTokens()
                    const updateData = {
                        accessCreateAt: newAccessToken.accessCreateAt,
                        accessExpires: newAccessToken.accessExpires,
                        accessToken: newAccessToken.accessToken
                    }
                    const updatedDoc = await dbContext.AuthTokens.findOneAndUpdate({ accountId: data.accountId }, updateData, { returnOriginal: false })
                    return Promise.resolve(updatedDoc)
                }
            }
            else if (now < accessExpired && now < refreshExpired) {
                return Promise.resolve(data)
            }

        } else if (!data) {
            return Promise.resolve({})
        }
    }






}

export const authUser = new AuthUser()

