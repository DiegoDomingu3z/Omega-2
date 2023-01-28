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
                    let authTok = await this.authToken()
                    let userAccount = account[0]
                    userAccount.authToki = authTok
                    userAccount.save()
                    return authTok
                } else {
                    throw new Forbidden("Incorrect Password")
                }
            }
        }

        
    
    }

    // algorithm to generate randomized tokens for a users session
    // Create string of characters and numbers and generates token
    async authToken(){
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const num = "0123456789"
        let generatedChar = ''
        let generatedNum = ''
        const charLen = char.length
        const numLen = num.length
        let count = 0
        while (count < 15){
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