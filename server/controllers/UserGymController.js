import { authUser } from "../middleware/authUser";
import BaseController from "../utils/BaseController";

export class UserGymController extends BaseController {
    constructor() {
        super('api/gym_user/')
        this.router
            .use(this.authenticate)
            // id of gym
            .get('gym/:id', this.getAllUsers)
    }

    async getAllUsers(req, res, next) {
        try {
            const gymId = req.params.id

        } catch (error) {
            console.log(error)
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