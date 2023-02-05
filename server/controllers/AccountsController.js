import BaseController from "../utils/BaseController";
import { accountService } from "../services/AccountService";
import { logger } from "../utils/Logger";
import { authUser } from "../middleware/authUser"
import { Forbidden } from "../utils/Errors";
export class AccountsController extends BaseController {

    constructor() {
        super('account')
        this.router
            .post('', this.createAccount)
            .post('/login', this.login)
            .use(this.authenticate)
            .get('/myaccount', this.getAccount)
            .delete('/session', this.logout)

    }

   
    async createAccount(req, res, next) {
        try {
            const data = await accountService.createAccount(req.body)
            res.send(data, "Account Successfully Activated")
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
            const $token = req.header("Authorization")
            const data = await accountService.getAccount($token)
            res.send(data)
        } catch (error) {
            next(error)
        }
    }


    async logout(req, res, next){
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
            if (!user) {
                return res.status(401).send("ERROR")
                
            } else {
                next()
            }
        } catch (error) {
            return error.message
        }
    }





}


