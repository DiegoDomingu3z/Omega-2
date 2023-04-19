import { dbContext } from "../db/DbContext"
import { logger } from "../utils/Logger"

class PostsService {



    // FIXME
    // THIS IS TOTALLY BROKENNNNNNNNN
    async getFriendsPosts(offset, limit, id) {
        // get all the posts that are from my friends where I am a close friend
        // get all the posts where user is a match
        try {
            const matchesArr = await dbContext.userMatches.find({ matchId: id }).select('accountId')
                .exec()
            const closeFriendArr = await dbContext.closeFriends.find({ friendId: id }).select('accountId')
                .exec()
            // WILL POSSIBLY NEED THIS
            // const matchesAccountIds = matchesArr.map(match => match.accountId); // Extract accountId values from matchesArr
            // const closeFriendAccountIds = closeFriendArr.map(closeFriend => closeFriend.accountId); // Extract accountId values from closeFriendArr
            const correctPosts = [...matchesArr, ...closeFriendArr]
            logger.log(correctPosts)
            const data = dbContext.Posts.find({
                accountId: { $in: correctPosts }
            })
                .sort({ timeCreated: -1, timeUpdated: - 1 })
                .skip(Number(offset))
                .limit(limit)
                .exec()
            logger.log(data)
            return Promise.resolve(data)
        } catch (error) {
            logger.error(error)
        }

    }

    async createPost(data, userId) {
        try {
            if (!userId) {
                return Promise.resolve(401)
            }
            const sanatizedData = {
                accountId: userId,
                privacy: data.privacy,
                bio: data.bio,
                image: data.image,
                createdAt: new Date(),
                timeUpdated: new Date()
            }
            const postData = await dbContext.Posts.create(sanatizedData)
            return Promise.resolve(postData)
        } catch (error) {
            logger.log(error)
            return 400
        }
    }




}



export const postsService = new PostsService()