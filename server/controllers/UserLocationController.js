import { authUser } from "../middleware/authUser";
import { userLocationService } from "../services/UserLocationService";
import BaseController from "../utils/BaseController";
import { logger } from "../utils/Logger";

export class UserLocationController extends BaseController {
    constructor() {
        super('api/accounts')
        this.router
            .use(this.authenticate)
            .post('/location', this.setLocation)
            .get('/mylocation', this.getUserLocation)
    }




    async setLocation(req, res, next) {
        try {
            logger.log("location was called")
            const userId = req.accountId
            const geoLoco = await userLocationService.setLocation(req.body, userId)
            const tokenSent = req.header("Authorization")
            const token = req.user
            if (tokenSent != token) {
                res.status(200).json({ data: geoLoco, token: token })
            } else {
                res.status(200).json({ data: geoLoco })
                logger.log("SUCCESS")
            }

        } catch (error) {
            next(error)
        }
    }

    async getUserLocation(req, res, next) {
        try {
            const userId = req.accountId
            const geoLoco = await userLocationService.getUserLocation(userId)
            const tokenSent = req.header("Authorization")
            const token = req.user
            if (geoLoco == "user does not exists") {
                return res.status(400).json("ERROR")
            } else if (geoLoco == "FORBIDDEN") {
                return res.status(401).json("ERROR")
            } else {
                if (tokenSent != token) {
                    res.status(200).json({ data: geoLoco, token: token })
                } else {
                    res.status(200).json({ data: geoLoco })
                    logger.log("SUCCESS")
                }
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
                req.accountId = user.accountId
                next()
            }
        } catch (error) {
            return error.message
        }
    }

}