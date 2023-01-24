import BaseController from "../utils/BaseController";

export class AccountsController extends BaseController {

    constructor() {
        super('account')
        this.router
            .get('', this.getMyAccount)

    }


    async getMyAccount(req, res, next) {
        try {
            const myAccount = "Diego"
            res.send(myAccount)
        } catch (error) {
            next(error)
        }
    }

}


