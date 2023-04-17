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
            const userId = req.user._id
            const data = await userGymService.getGymUsers(gymId, offset, limit, userId)
            res.send(data)
        } catch (error) {
            console.log(error)
            next(error)
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