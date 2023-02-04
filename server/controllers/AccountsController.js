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
            .get('/myaccount', this.getAccount);

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
            next(error.message)
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
                return res.status(401).send("FORBIDDEN")
            } else {
                next()
            }
        } catch (error) {
            res.send(error.message)
        }
    }





}


