const multer=require( 'multer' );
const sharp=require( 'sharp' );
const Video=require( "../models/videoModel" );
const catchAsync=require( "../utils/catchAysnc" );
const AppError=require( "../utils/appError" );
const factory=require( './FactoryHandler' );
const User = require("../models/userModel");


exports.addVideo = catchAsync(async (req,res,next)=>{
    const doc=await Video.create({userId:req.user._id , ...req.body});
    res.status( 201 ).json( {
        status: 'success',
        doc
    } );

})
exports.updateVideo = catchAsync(async (req,res,next)=>{
    const vid = await Video.findById(req.params.videoId);
    if(!vid)
    return(new AppError("Video not found!",403));
    if(req.user._id == vid.userId){
        const updatedVid = await Video.findByIdAndUpdate(req.params.videoId, req.body,{new:true})
        res.status(200).json({
            status:'success',
            updatedVid
        })
    }else{
        return(new AppError("You can only update your videos!",403));

    }
    
})

exports.deleteVideo = catchAsync(async (req,res,next)=>{
    const vid = await Video.findById(req.params.videoId);
    if(!vid)
    return(new AppError("Video not found!",403));
    if(req.user._id == vid.userId){
        await Video.findByIdAndDelete(req.params.videoId)
        res.status(200).json({
            status:'success',
            data:null
        })
    }else{
        return(new AppError("You can only delete your videos!",403));

    } 
})


exports.getVideo = factory.getOne(Video);

exports.addView = catchAsync(async (req,res,next)=>{
    const vid = await Video.findByIdAndUpdate(req.params.videoId,{
        $inc:{views:1}
    })
    if(!vid)
    return(new AppError("No video found!",403));

    res.status(200).json({
        status:'View added!',
        vid
    })
})

exports.getRandomVideos = catchAsync(async (req,res,next)=>{
    const vids = await Video.aggregate([{$sample:{size:20}}])
    res.status(200).json({
        status:'success',
        results:vids.length,
        vids
    })

})

exports.getTrendingVideos = catchAsync(async (req,res,next)=>{
    const vids = await Video.find().sort({views:-1}).limit(1)
    res.status(200).json({
        status:'success',
        vids
    })
})

exports.getSubscribedVideos = catchAsync(async (req,res,next)=>{
    if(!req.user)
    return next(new AppError("Please login to see your subscribed videos",403));
    const user = await User.findById(req.user._id);
    if(!user)
        return next(new AppError("Please login to see your subscribed videos",403));
    const subscribedChannel = user.subscribedUsers
    const list=await Promise.all(subscribedChannel.map((el)=>{
      return Video.find({userId:el});
    }))
    res.status(200).json({
        status:'success',
        list: list.flat().sort((a,b)=> b.createdAt - a.createdAt)
    })
})

exports.searchVideos = catchAsync(async (req,res,next)=>{
    const query = req.query.q;
    const vids = await Video.find({
        title: {$regex: query, $options:'i'}
    })
    if(vids.length===0)
        return next(new AppError("Sorry , No video found!",403))
    res.status(200).json({
        status:'success',
        results: vids.length,
        vids
    })

})
exports.searchVideosByTags = catchAsync(async (req,res,next)=>{
    const tags = req.query.tags.split(",");
    const videos = await Video.find({tags:{$in:tags}}).limit(10);
    if(videos.length===0)
    return next(new AppError("Sorry , No video found!",403))
    res.status(200).json({
        status:'success',
        results:videos.length,
        videos
    })
})

const multerStorage=multer.memoryStorage( {
    destination: ( req, file, cb ) => {
        cb( null, 'public/img/videos')
    },
    filename: ( req, file, cb ) => {
        const extension = file.mimetype.split( '/' )[ 1 ];
        cb( null, `video-${req.user._id}-${Date.now()}.${extension}` );
    }
})

const multerFilter=( req, file, cb ) => {
    console.log(file)
    if ( file.mimetype.startsWith( 'image' )) {
        req.file=file;
        cb( null, true )
    }
    else {
        cb( new AppError( "Only image can be uploaded", 400 ),false );
    }
}

const upload = multer( {
    storage: multerStorage,
    fileFilter:multerFilter
} ); 

exports.uploadVideoThumbnail = upload.single( 'thumbnailUrl' );

exports.resizeVideoThumbnail = catchAsync(async( req, res, next ) => {
    if ( !req.file ) return next();

    req.file.filename=`video-${req.user._id}-${Date.now()}.jpeg`;

    await sharp( req.file.buffer )
        .resize( 500, 500 )
        .toFormat( 'jpeg' )
        .jpeg( { quality: 90 } )
        .toFile( `public/img/videos/${req.file.filename}`);
    req.body.thumbnailUrl = req.file.filename;
    next();
})



