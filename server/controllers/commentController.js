const Comment=require( "../models/commentModel" );
const Video=require( "../models/videoModel" );
const catchAsync=require( "../utils/catchAysnc" );
const AppError=require( "../utils/appError" );
const factory=require( './FactoryHandler' );


exports.addComment = catchAsync(async (req,res,next)=>{
    const doc=await Comment.create({userId:req.user._id , ...req.body});
    res.status( 201 ).json( {
        status: 'success',
        doc
    } );
})


exports.updateComment = catchAsync(async (req,res,next)=>{
    console.log(req.body.description);
    const doc = await Comment.findById(req.params.id);
    if(!doc)
    return(new AppError("Comment not found!",403));
    if(req.user._id == doc.userId){
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {description:req.body.description},{new:true})
        res.status(200).json({
            status:'success',
            updatedComment
        })
    }else{
        return(new AppError("You can only update your comments!",403));

    }
    
})

exports.deleteComment = catchAsync(async (req,res,next)=>{
    const comment = await Comment.findById(req.params.id);
    const vid = await Video.findById(req.params.id);
    if(!comment)
    return(new AppError("Comment not found!",403));
    if(req.user._id == comment.userId || req.user._id == vid.userId){
        await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status:'success',
            data:null
        })
    }else{
        return(new AppError("You can only delete your comments!",403));

    } 
})


exports.getAllComments = catchAsync(async(req,res,next)=>{
    const comments = await Comment.find({
        videoId: req.params.id
    })
    if(comments.length===0)
    return next(new AppError("No comments found",403));
    res.status(200).json({
        status:'success',
        results:comments.length,
        comments
    })
})