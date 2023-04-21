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
            const accountId = req.accountId
            const likedUserId = req.params.id
            const likedData = await likeUserService.swipeUser(accountId, likedUserId)
            const tokenSent = req.header("Authorization")
            const token = req.user
            if (likedData == 200) {
                if (tokenSent != token) {
                    res.status(201).json({ data: likedUserId, matched: 'no', token: token })
                    logger.log(`liked`, likedUserId)
                } else {
                    res.status(201).json({ data: likedUserId, matched: 'no' })
                }
            } else {
                if (tokenSent != token) {
                    res.status(201).json({ data: likedUserId, matched: 'yes', token: token })
                } else {
                    res.status(201).json({ data: likedUserId, matched: 'yes' })
                    logger.log('matched with ', likedUserId)
                }
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