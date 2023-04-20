import BaseController from "../utils/BaseController";
import { accountService } from "../services/AccountService";
import { logger } from "../utils/Logger";
import { authUser } from "../middleware/authUser"

export class AccountsController extends BaseController {
    constructor() {
        super('account')
        this.router
            .post('', this.createAccount)
            .post('/login', this.login)
            .use(this.authenticate)
            .get('/myaccount', this.getAccount)
            .delete('/logout', this.logout)

    }


    async createAccount(req, res, next) {
        try {
            const data = await accountService.createAccount(req.body)
            if (data == "INVALID INFO") {
                logger.log('info')
                return res.status(401).send("INVALID INFO")
            } else if (data == "INVALID AGE") {
                logger.log('age')
                return res.status(401).send("INVALID AGE")
            } else if (data == "EMAIL ALREADY EXISTS") {
                logger.log('email')
                return res.status(401).send("EMAIL ALREADY EXISTS")
            } else {
                res.status(200).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const loginData = await accountService.login(req.body)
            res.send(loginData)
        } catch (error) {
            next(error)
        }
    }

    async getAccount(req, res, next) {
        try {
            const tokenSent = req.header("Authorization")
            const token = req.user
            const data = await accountService.getAccount(token)
            if (data == 400) {
                res.status(400).send("ACCOUNT NOT FOUND")
            } else {
                if (tokenSent != token) {
                    res.status(200).json({ account: data, newToken: token })
                } else {
                    res.status(200).json(data)
                }
            }
        } catch (error) {
            next(error)
        }
    }


    async logout(req, res, next) {
        try {
            const $token = req.header("Authorization")
            if (!$token) {
                return res.status(401).send("NO AUTH WAS GIVEN")
            }
            const session = await accountService.logout($token)
            if (session == false) {
                return res.status(200).send("SUCCESSFULL")
            } else {
                return res.status(400).send("UNSUCCESSFULL")
            }
        } catch (error) {
            next(error)
        }
    }





    async authenticate(req, res, next) {
        try {
            logger.log("this is being called")
            const token = req.header("Authorization")
            if (!token) {
                return res.status(401).send("FORBIDDEN")
            }
            let user = await authUser.findUser(token)
            if (user == 403) {
                return res.status(403).send("TOKEN ARE EXPIRED, LOG BACK IN")
            } else if (user == {}) {
                return res.status(400).send("NO ACCOUNT FOUND")
            } else {
                req.user = user.accessToken
                next()
            }
        } catch (error) {
            return error.message
        }
    }





}

module.exports = AccountsController


