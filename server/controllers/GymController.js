import { authUser } from "../middleware/authUser"
import { gymService } from "../services/GymService"
import BaseController from "../utils/BaseController"
import { logger } from "../utils/Logger"


export class GymController extends BaseController {
    constructor() {
        super('api/gym')
        this.router
            .use(this.authenticate)
            .post('/', this.registerToGym)
    }


    // controller to call function to determine what to do with gym data
    // set gymid to var and userID
    async registerToGym(req, res, next) {
        try {
            const gymData = req.body.id
            const userId = req.user._id
            const gymValidation = await gymService.registerToGym(gymData, userId)
            if (gymValidation == 'THIS IS NOT A GYM') {
                return res.status(401).send("YOU CANNOT SIGN UP FOR THIS GYM")
            } else {
                res.send(gymValidation)
            }
        } catch (error) {
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
