import bcrypt from "bcrypt";
import { dbContext } from "../db/DbContext"
import { logger } from '../utils/Logger'
import { BadRequest, Forbidden, NotFound } from '../utils/Errors'
class AccountService {


    /**
    * takes in body of accountInfo, encrypts password with salt, 
    * flush body into correct json to be stored in
    * check if any inputs are empty
    * check if user is old enough 
    * @param {Object} accountInfo
    * @returns {String} Token
   */
    async createAccount(accountInfo) {
        logger.log(accountInfo)
        const bashP = await bcrypt.hash(accountInfo.password, 10);
        if (accountInfo.email == '' || accountInfo.password == '' || accountInfo.firstName == '' || accountInfo.lastName == '') {
            return "INVALID INFO"
        }
        if (accountInfo.age < 18) {
            return "INVALID AGE"
        }
        let checkIfExists = await dbContext.Account.find({ email: accountInfo.email })
        logger.log(checkIfExists)
        if (checkIfExists.length > 0) {
            return "EMAIL ALREADY EXISTS"
        } else {
            const account = {
                email: accountInfo.email,
                password: bashP,
                firstName: accountInfo.firstName,
                lastName: accountInfo.lastName,
                age: accountInfo.age,
            }
            const data = await dbContext.Account.create(account)
            await data.save()
            return data
        }
    }

    /**
  * Login Algorithm, takes in reqBody contains password & email/username 
  *  Finds account based on email, if found will alg with continue else stops,
  * if account found, password is compared to stored hashed, if true, login complete

  * @param {Object} loginData
    @returns {String} authTok
 */

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
                    // var currentDat = new Date()
                    // var futureDate = new Date(currentDat.getFullYear() + 1, currentDat.getMonth(), currentDat.getDate())
                    // let authTok = await this.authToken()
                    // let userAccount = account[0]
                    // // set the token and expiration date
                    // userAccount.authToki = authTok
                    // userAccount.authExpiration = futureDate
                    // userAccount.save()
                    let newAccess = await this.authToken()
                    let NewRefresh = await this.authToken()
                    let auth = {
                        accountId: account[0]._id,
                        refreshToken: NewRefresh,
                        accessToken: newAccess
                    }
                    const checkAuthDoc = await dbContext.AuthTokens.findOne({ accountId: account[0]._id })
                    if (checkAuthDoc) {
                        const updatedDoc = await dbContext.AuthTokens.findOneAndUpdate({ accountId: account[0]._id }, {
                            accessToken: newAccess,
                            refreshToken: NewRefresh,
                            refreshCreatedAt: new Date(),
                            accessCreatedAt: new Date(),
                            refreshExpires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
                            accessExpires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
                        }, { returnOriginal: false })
                        return Promise.resolve(updatedDoc)
                    } else {
                        const authorization = await dbContext.AuthTokens.create(auth)
                        return Promise.resolve(authorization)
                    }
                } else {
                    throw new Forbidden("Incorrect Password")
                }
            }
        }



    }
    /**
   * Finds account based on token that is provided by user,
   * checks to see if token provided is the same and checks if its expired, if it is
   * it will generate new token for user to store locally
   * Throws Forbiddens tries to access account without token
   * @param {String}
   * @returns {Object}
  */

    // BREAKING
    async getAccount($token) {
        try {
            if (!$token) {
                return Promise.resolve(400)
            } else {
                const id = await dbContext.AuthTokens.findOne({ accessToken: $token })
                if (!id) {
                    return Promise.resolve(400)
                }
                const accountInfo = await dbContext.Account.findOne({ _id: id.accountId })
                if (!accountInfo) {
                    return Promise.resolve(400)
                } else {
                    return Promise.resolve(accountInfo)
                }
            }
        } catch (error) {
            logger.log(error)
            return error
        }
    }




    async verifyTokens(accessExpiration, accessCreatedAt, refreshExpiration, refreshCreatedAt) {
        try {
            const now = new Date();
            const accessExpired = new Date(accessExpiration * 1000 + accessCreatedAt.getTime());
            const refreshExpired = new Date(refreshExpiration * 1000 + refreshCreatedAt.getTime());
            // check if access token is expired
            if (now > accessExpired) {
                logger.log("EXPIRED ACCESS TOKEN")
                // check if refresh token is expired
                if (now > refreshExpired) {
                    // if it is it returns 403
                    // user will have to login again and obtain new tokens
                    return Promise.resolve(403)
                } else if (now < refreshExpired) {
                    // if access token is expired but refresh isn't will send back 201 to determine more logic
                    return Promise.resolve(201)
                }
            } else if (now < accessExpired) {
                return Promise.resolve(200)
            }

        } catch (error) {
            logger.error(error)
            return error
        }
    }



    async generateNewTokens() {
        try {
            const newData = {
                accessCreatedAt: new Date(),
                accessExpires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
                accessToken: await this.authToken()
            }
            return Promise.resolve(newData)

        } catch (error) {
            logger.error(error)
            return error
        }
    }





    /**
   * Simple logout function, finds based off authorization header
   * check if user exists, if it does it will remove token and expiration date (ending the session)
   * @param {string} $token
   * @returns {Boolean}
  */
    async logout($token) {
        const user = await dbContext.AuthTokens.findOneAndDelete({ accessToken: $token })
        logger.log(user)
        return true

    }


    /**
* algorithm to generate randomized tokens for a users session
* Create string of characters and numbers and generates token
* @returns {string} generated token
*/
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