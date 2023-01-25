import bcrypt from "bcrypt";
import { dbContext } from "../db/DbContext"
import { logger } from '../utils/Logger'
class AccountService {

    async createAccount(accountInfo) {
        const bashP = await bcrypt.hash(accountInfo.password, 10);
        const account = {
            email: accountInfo.email,
            password: bashP,
            firstName: accountInfo.firstName,
            lastName: accountInfo.lastName,
            age: accountInfo.age
        }
        const data = await dbContext.Account.create(account)
        await data.save()
    }

    async login(loginData) {
        const userName = loginData.email
        const password = loginData.password
        let account = await dbContext.Account.find({ email: userName })
        const ha$hPa$$ = account[0].password
        logger.log(ha$hPa$$)
        let result = await bcrypt.compare(password.toString(), ha$hPa$$.toString())
        if (result === true) {
            return account
        } else {
            return false
        }



    }

}

export const accountService = new AccountService()