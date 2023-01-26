import BaseController from "../utils/BaseController";
import { accountService } from "../services/AccountService";
export class AccountsController extends BaseController {

    constructor() {
        super('account')
        this.router
            .post('', this.createAccount)
            .post('/login', this.login)
            .get('/myaccount', this.getAccount)

    }
    getAccount(req, res, next) {
        try {
            const data = "working"
            res.send(data)
        } catch (error) {
            next(error.message)
        }
    }

    async createAccount(req, res, next) {
        try {
            const data = await accountService.createAccount(req.body)
            res.send("Account Successfully Created")
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






}


