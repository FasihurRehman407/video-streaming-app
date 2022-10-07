const express=require( "express" );

const {
    getUser,
    deleteUser,
    updateMe,
    deleteMe,
    subscribeUser,
    unsubscribeUser,
    likeVideo,
    dislikeVideo,
    updateUser, // For admins
    updateUserPass, // For admins
    // uploadUserPhoto,
    // resizeUserPhoto,
}=require( `./../controllers/userController` );


const {
    signUp,
    logIn,
    googleAuth,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    // logout
}=require( "../controllers/authController" );






const userRouter=express.Router();

//Optimize:                    ************** Routes ***************
// userRouter.post('/logout', logout)
//! Below routes are for Non-logged-in users
userRouter.post( '/signup', signUp );
userRouter.post( '/login', logIn );
userRouter.post( '/google', googleAuth );
userRouter.post( '/forgotpassword', forgotPassword );
userRouter.patch( '/resetpassword/:token', resetPassword );
userRouter.get( '/find/:id', getUser )

    
    //! Below routes are for logged-in users
    userRouter.use( protect ); // protecting routes
    userRouter.patch( '/updatemypassword', updatePassword );
    // userRouter.patch( '/updateMe', uploadUserPhoto, resizeUserPhoto , updateMe );
    userRouter.patch( '/updateme', updateMe );
    userRouter.delete( '/deleteme', deleteMe );
    userRouter.patch('/sub/:userId',subscribeUser)
    userRouter.patch('/unsub/:userId',unsubscribeUser)
    userRouter.patch('/like/:videoId',likeVideo)
    userRouter.patch('/dislike/:videoId',dislikeVideo)




module.exports=userRouter;