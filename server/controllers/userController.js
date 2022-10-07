// const multer=require( 'multer' );
// const sharp=require( 'sharp' );
const User=require( "../models/userModel" );
const Video = require('./../models/videoModel')
const catchAsync=require( "../utils/catchAysnc" );
const AppError=require( "../utils/appError" );
const factory=require( './FactoryHandler' );


//Todo:  ************************** helper functions ******************************

const filterObject=( obj, ...fields ) => {
    // eslint-disable-next-line prefer-const
    let newObj={};

    Object.keys( obj ).forEach( el => {
        if ( fields.includes( el ) ) {
            newObj[ el ]=obj[ el ];
        }
    } )
    return newObj;
}

//FIX: Image uploading functionality
// const multerStorage=multer.diskStorage( {
//     destination: ( req, file, cb ) => {
//         cb( null, 'public/img/users')
//     },
//     filename: ( req, file, cb ) => {
//         const extension = file.mimetype.split( '/' )[ 1 ];
//         cb( null, `user-${req.user._id}-${Date.now()}.${extension}` );
//     }
// })


// const multerStorage = multer.memoryStorage();

// const multerFilter=( req, file, cb ) => {
//     if ( file.mimetype.startsWith( 'image' ) ) {
//         // console.log( file );
//         req.file=file;
//         cb( null, true )
//     }
//     else {
//         cb( new AppError( "Only image file can be uploaded", 400 ),false );
//     }
// }

// const upload = multer( {
//     storage: multerStorage,
//     fileFilter:multerFilter
// } ); // save the file got from form in respective destination


//Todo:  *************************************************




//Optimize:                    ************** Route handler Functions ***************


// exports.uploadUserPhoto = upload.single( 'photo' );
// exports.resizeUserPhoto = ( req, res, next ) => {
//     // console.log( req.file );
//     if ( !req.file ) return next();

//     req.file.filename=`user-${req.user._id}-${Date.now()}.jpeg`;

//     sharp( req.file.buffer )
//         .resize( 500, 500 )
//         .toFormat( 'jpeg' )
//         .jpeg( { quality: 90 } )
//         .toFile( `public/img/users/${req.file.filename}` );

//     next();

// }


//Fix: Update currently logged in user
exports.updateMe=catchAsync( async ( req, res, next ) => {

    //? (1) Create error if user POSTs password data
    if ( req.body.password||req.body.passwordConfirm ) {
        return next( new AppError( "This URL is not for password updates. Please go to /updateMyPassword", 400 ) );
    }


    //? (2) Filtered out unwanted field names that are not allowed to be updated
    const filteredObj=filterObject( req.body, 'name', 'email' , 'subscribers' , 'subscribedUsers');
    //? (3) update User document
    const updatedUser=await User.findByIdAndUpdate( req.user._id, filteredObj, {
        new: true,
        // runValidators: true
    } )

    res.status( 201 ).json( {
        status: "success",
        user: updatedUser
    } )

} )

//Fix: delete currently logged in user
exports.deleteMe=catchAsync( async ( req, res, next ) => {
    //? (1) get the current user document by id and set its active property to false
    await User.findByIdAndDelete( req.user._id)

    //? (2) Send the delete response with 204 code
    res.status( 204 ).json( {
        status: "success",
        data: null
    } )
} )




// FIX: get single users based on id
exports.getUser=catchAsync(async (req,res,next)=>{
    const doc = await User.findById(req.params.id);
    if(!doc)
        return next(new AppError("Please provide Id!",403));
    res.status(200).json({
        status:'success',
        doc
    })
});

exports.subscribeUser = catchAsync(async (req,res,next)=>{ 
   const doc1= await User.findByIdAndUpdate(req.user._id,{
        $push: {
            subscribedUsers: req.params.userId
        }
    })
    const doc2= await User.findByIdAndUpdate(req.params.userId,{
        $inc:{subscribers:1}
    })


    if(!doc1 || !doc2)
        return next(new AppError("No user found with this id",403));
    
   
    res.status(200).json({
        status:'Subscribed successfully!',
    })    
})

exports.unsubscribeUser = catchAsync(async (req,res,next)=>{
    const doc1= await User.findByIdAndUpdate(req.user._id,{
        $pull: {
            subscribedUsers: req.params.userId
        }
    })
    const doc2= await User.findByIdAndUpdate(req.params.userId,{
        $inc:{subscribers:-1}
    })


    if(!doc1 || !doc2)
        return next(new AppError("No user found with this id",403));
    
   
    res.status(200).json({
        status:'Unsubscribed successfully!',
    })    
})

exports.likeVideo = catchAsync(async (req,res,next)=>{
    const vid = await Video.findByIdAndUpdate(req.params.videoId,{
        $addToSet:{likes:req.user._id},
        $pull: {dislikes:req.user._id}
    })
    res.status(200).json({
        status:'Video has been liked',
        vid
    })
})

exports.dislikeVideo = catchAsync(async (req,res,next)=>{
    const vid = await Video.findByIdAndUpdate(req.params.videoId,{
        $addToSet:{dislikes:req.user._id},
        $pull: {likes:req.user._id}
    })
    res.status(200).json({
        status:'Video has been disliked',
        vid
    })
})