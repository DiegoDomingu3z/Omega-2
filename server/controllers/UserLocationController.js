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
            const geoLoco = await userLocationService.setLocation(req.body)
            if (geoLoco == "ALREADY SHARING") {
                return res.status(400).send("ERROR")
            } else{ res.send(geoLoco)}
           
        } catch (error) {
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
            if (!user) {
                return res.status(401).send("ERROR")
                
            } else {
                next()
            }
        } catch (error) {
            return error.message
        }
    }

}