import { authUser } from "../middleware/authUser"
import { closeFriendsService } from "../services/CloseFriendsService"
import BaseController from "../utils/BaseController"
import { logger } from "../utils/Logger"


export class CloseFriendsController extends BaseController {
    constructor() {
        super('api/close-friends')
        this.router
            .use(this.authenticate)
            .post('/add/:userId/', this.addCloseFriend)
    }



    async addCloseFriend(req, res, nest) {
        try {
            const adminId = req.user._id
            const friendId = req.params.userId
            const addProcess = await closeFriendsService.addFriend(adminId, friendId)
            if (addProcess == 401) {
                res.status(401).send('FORBIDDEN')
            } else if (addProcess == 400) {
                res.status(400).send('ERROR')
            } else {
                res.status(200).send(addProcess)
            }
        } catch (error) {
            logger.error(error)
            return error
        }
    }




    async authenticate(req, res, next) {
        try {
            logger.log("this is being called")
            const token = req.header("Authorization")
            logger.log(token)
            if (!token) {
                logger.log("NO TOKEN PROVIDED")
                return res.status(401).send("FORBIDDEN")
            }
            let user = await authUser.findUser(token)
            if (!user) {
                return res.status(401).send("ERROR")

            } else {
                req.user = user
                next()
            }
        } catch (error) {
            return error.message
        }
    }
}