import { dbContext } from "../db/DbContext"

class AuthUser {
    async findUser(token) {
        const data = await dbContext.Account.findOne({ authToki: token })
        return data
    }




}

export const authUser = new AuthUser()

