import { authUser } from "../middleware/authUser";
import { postsService } from "../services/PostsService";
import BaseController from "../utils/BaseController";
import { logger } from "../utils/Logger";

export class PostController extends BaseController {
    constructor() {
        super('api/posts')
        this.router
            .use(this.authenticate)
            // create offset & limit
            .post('/create', this.createPost)
            .get('/friends', this.getFriendsPosts)
    }




    async createPost(req, res, next) {
        try {
            const data = req.body
            const userId = req.user.accountId
            const createData = await postsService.createPost(data, userId)
            if (createData == 400) {
                res.status(400).send("NOT AVAILABLE")
            } else if (createData == 401) {
                res.status(400).send("Forbidden")
            } else {
                res.status(200).send(createData)
            }
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async getFriendsPosts(req, res, next) {
        try {
            const userId = req.accountId
            const offset = parseInt(req.query.offset) || 0
            const limit = parseInt(req.query.limit) || 15
            const posts = await postsService.getFriendsPosts(offset, limit, userId)
            const tokenSent = req.header("Authorization")
            const token = req.user
            if (tokenSent != token) {
                res.status(200).json({ data: posts, token: token })
            } else {
                res.status(200).json({ data: posts })
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