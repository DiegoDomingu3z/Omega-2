import bcrypt from "bcrypt";
import { dbContext } from "../db/DbContext"
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

}

export const accountService = new AccountService()