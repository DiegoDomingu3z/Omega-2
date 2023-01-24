import BaseController from "../utils/BaseController";
import { accountService } from "../services/AccountService";
export class AccountsController extends BaseController {

    constructor() {
        super('account')
        this.router
            .post('', this.createAccount)

    }
    async createAccount(req, res, next) {
        try {
            const data = await accountService.createAccount(req.body)
            res.send("Account Successfully Created")
        } catch (error) {
            next(error)
        }
    }




}


