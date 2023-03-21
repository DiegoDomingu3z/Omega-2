import { authUser } from "../middleware/authUser";
import { likeUserService } from "../services/LikeUserService";
import BaseController from "../utils/BaseController";
import { logger } from "../utils/Logger";

export class LikeUserController extends BaseController {
    constructor() {
        super('api/gymsy/')
        this.router
            .use(this.authenticate)
            .post('/like_user/:id', this.swipeUser)
    }

    async swipeUser(req, res, next) {
        try {
            const accountId = req.user
            const likedUserId = req.params.id
            const likedData = likeUserService.swipeUser(accountId, likedUserId)
            if (likedData === 200) {
                res.status(200).send(`LIKED ${likedUserId}`)
            } else if (likedData == 'MATCH') {
                res.status(200).send(`MATCHED WITH ${likedUserId}`)
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