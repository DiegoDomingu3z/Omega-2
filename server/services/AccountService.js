import bcrypt from "bcrypt";
import { dbContext } from "../db/DbContext"
import { logger } from '../utils/Logger'
import { BadRequest, Forbidden } from '../utils/Errors'
class AccountService {

    // takes in body of accountInfo, encrypts password with salt, 
    // flush body into correct json to be stored in
    // check if any inputs are empty
    // check if user is old enough 
    async createAccount(accountInfo) {
        const bashP = await bcrypt.hash(accountInfo.password, 10);
        if (accountInfo.email == '' || accountInfo.password == '' || accountInfo.firstName == '' || accountInfo.lastName == '') {
            throw new BadRequest("Not all info was entered")
        }
        if (accountInfo.age < 16) {
            throw new BadRequest("User is not old enough")
        }
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

    // Login Algorithm, takes in reqBody contains password & email/username
    // Finds account based on email, if found will alg with continue else stops,
    // if account found, password is compared to stored hashed, if true, login complete
    async login(loginData) {
        const userName = loginData.email
        const password = loginData.password
        if (password == '' || userName == '') {
            throw new BadRequest("NO PASSWORD OR USERNAME WERE ENTERED")
        } else {
            let account = await dbContext.Account.find({ email: userName })
            if (account == 0) {
                throw new BadRequest("Account not Found")
            } else {
                const ha$hPa$$ = account[0].password
                let result = await bcrypt.compare(password.toString(), ha$hPa$$.toString())
                if (result === true) {
                    return account
                } else {
                    throw new Forbidden("Incorrect Password")
                }
            }
        }



    }

}

export const accountService = new AccountService()