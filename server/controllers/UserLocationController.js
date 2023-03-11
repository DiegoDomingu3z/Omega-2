import { authUser } from "../middleware/authUser";
import { userLocationService } from "../services/UserLocationService";
import BaseController from "../utils/BaseController";
import { logger } from "../utils/Logger";

export class UserLocationController extends BaseController{
    constructor(){
        super('api/account')
        this.router
            .use(this.authenticate)
            .post('/location', this.setLocation)
    }




    async setLocation(req, res, next){
        try {
            logger.log("location was called")
            const userId = req.user._id
            const geoLoco = await userLocationService.setLocation(req.body, userId)
            if (geoLoco == "User does not exits") {
                return res.status(400).send("ERROR")
            } else{ logger.log("SUCCESS"), res.send(geoLoco) }
           
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