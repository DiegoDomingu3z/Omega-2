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



    async addCloseFriend(req, res, next) {
        try {
            const adminId = req.accountId
            const friendId = req.params.userId
            const tokenSent = req.header("Authorization")
            const token = req.user
            const addProcess = await closeFriendsService.addFriend(adminId, friendId)
            if (addProcess == 401) {
                res.status(401).send('FORBIDDEN')
            } else if (addProcess == 400) {
                res.status(400).send('ERROR')
            } else {
                if (tokenSent != token) {
                    res.status(200).json({ data: addProcess, newToken: token })
                }
                res.status(200).send(addProcess)
            }
        } catch (error) {
            logger.error(error)
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
