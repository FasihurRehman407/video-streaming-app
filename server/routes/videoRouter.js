const express=require( "express" );
const {addVideo , updateVideo , searchVideos ,
    searchVideosByTags , deleteVideo , getVideo ,
    getRandomVideos , addView , getSubscribedVideos,
    getTrendingVideos , uploadVideoThumbnail , resizeVideoThumbnail} = require('./../controllers/videoController');
const {protect} = require('./../controllers/authController');
const videoRouter=express.Router();

videoRouter.get('/random' , getRandomVideos)
videoRouter.get('/trend' , getTrendingVideos)
videoRouter.get('/subvids' , getSubscribedVideos)
videoRouter.get('/search' , searchVideos)
videoRouter.get('/tags' , searchVideosByTags)
videoRouter.get('/:id' , getVideo)
videoRouter.use( protect ); // protecting routes
videoRouter.post('/',uploadVideoThumbnail, resizeVideoThumbnail, addVideo);
videoRouter.patch('/:videoId', updateVideo);
videoRouter.patch('/view/:videoId', addView);
videoRouter.delete('/:id' , deleteVideo);




module.exports=videoRouter;