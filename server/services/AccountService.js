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
        logger.log(accountInfo)
        const bashP = await bcrypt.hash(accountInfo.password, 10);
        if (accountInfo.email == '' || accountInfo.password == '' || accountInfo.firstName == '' || accountInfo.lastName == '') {
            return "INVALID INFO"
        }
        if (accountInfo.age < 18) {
           return "INVALID AGE"
        }
        let checkIfExists = await dbContext.Account.find({email: accountInfo.email})
        logger.log(checkIfExists)
        if (checkIfExists.length > 0) {
           return "EMAIL ALREADY EXISTS"
        } else {
            var currentDat = new Date()
            var futureDate = new Date(currentDat.getFullYear() + 1, currentDat.getMonth(), currentDat.getDate())
            let toki = await this.authToken()
            const account = {
                email: accountInfo.email,
                password: bashP,
                firstName: accountInfo.firstName,
                lastName: accountInfo.lastName,
                age: accountInfo.age,
                authExpiration: futureDate,
                authToki: toki
            }
            const data = await dbContext.Account.create(account)
            await data.save()
            return data.authToki
        }
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
            // should probably change to findone
            let account = await dbContext.Account.find({ email: userName })
            // @ts-ignore
            if (account == 0) {
                throw new BadRequest("Account not Found")
            } else {
                const ha$hPa$$ = account[0].password
                let result = await bcrypt.compare(password.toString(), ha$hPa$$.toString())
                // if password is the same after uncryptions do the following
                if (result === true) {
                    var currentDat = new Date()
                    var futureDate = new Date(currentDat.getFullYear() + 1, currentDat.getMonth(), currentDat.getDate())
                    let authTok = await this.authToken()
                    let userAccount = account[0]
                    // set the token and expiration date
                    userAccount.authToki = authTok
                    userAccount.authExpiration = futureDate
                    userAccount.save()
                    return authTok
                } else {
                    throw new Forbidden("Incorrect Password")
                }
            }
        }



    }


    async getAccount($token) {
        const accountData = await dbContext.Account.findOne({ authToki: $token })
        let todayDate = new Date()
        let verifyToken = accountData.authExpiration.getTime()
        let time = todayDate.getTime()
        // checks if the auth date for token is expired
        // if it is refresh the token and date
        if (verifyToken < time) {
            console.log("expired token")
            var currentDat = new Date()
            var futureDate = new Date(currentDat.getFullYear() + 1, currentDat.getMonth(), currentDat.getDate())
            if ($token == accountData.authToki) {
                let newToken = await this.authToken()
                accountData.authToki = newToken
                accountData.authExpiration = futureDate
                accountData.save()
                logger.log("new token was successfully created for user")
                logger.log(accountData.authExpiration)
                return accountData
            }
        }
        if ($token == accountData.authToki) {
            return accountData
        }
        if ($token != accountData.authToki) {
            throw new Forbidden("FORBIDDEN")
        }
        else {
            throw new Forbidden("FORBIDDEN")
        }

    }

    // Simple logout function, finds based off authorization header
    // check if user exists, if it does it will remove token and expiration date (ending the session)
    async logout($token) {
        const user = await dbContext.Account.findOne({ authToki: $token })
        if (user) {
            user.authToki = ''
            user.authExpiration = undefined
            user.save()
            return false
        } else {
            return true
        }

    }


    // algorithm to generate randomized tokens for a users session
    // Create string of characters and numbers and generates token
    async authToken() {
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const num = "0123456789"
        let generatedChar = ''
        let generatedNum = ''
        const charLen = char.length
        const numLen = num.length
        let count = 0
        while (count < 15) {
            generatedChar += char.charAt(Math.floor(Math.random() * charLen))
            generatedNum += num.charAt(Math.floor(Math.random() * numLen))
            count += 1;
        }
        let tok = generatedChar + generatedNum
        let arr = tok.split('');
        let len = arr.length

        for (let i = 0; i < len - 1; i++) {
            let j = Math.floor(Math.random() * (len - i)) + i;
            let temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp

        }
        return arr.join('')
    }

}

export const accountService = new AccountService()