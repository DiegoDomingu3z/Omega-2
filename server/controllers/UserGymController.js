import { authUser } from "../middleware/authUser";
import { userGymService } from "../services/UserGymService";
import BaseController from "../utils/BaseController";
import { logger } from "../utils/Logger";

export class UserGymController extends BaseController {
    constructor() {
        super('api/users/')
        this.router
            .use(this.authenticate)
            // id of gym
            // gym/:id?offset=:starting&limit=:ending
            .get('/gym/:id', this.getAllUsers)

    }

    async getAllUsers(req, res, next) {
        try {
            const gymId = req.params.id
            const offset = parseInt(req.query.offset) || 0
            const limit = parseInt(req.query.limit) || 10
            const userId = req.accountId
            const data = await userGymService.getGymUsers(gymId, offset, limit, userId)
            const tokenSent = req.header("Authorization")
            const token = req.user
            if (tokenSent != token) {
                res.status(200).json({ data: data, token: token })
            } else {
                res.status(200).json({ data: data })
            }
        } catch (error) {
            console.log(error)
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