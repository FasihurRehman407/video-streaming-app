const mongoose=require( 'mongoose' );

//Optimize:  ************************** video Modal Schema ******************************
const commentSchema=new mongoose.Schema( {
    userId: {
        type: String,
        required: [ true, "Enter user id!" ],
    },
    videoId: {
        type: String,
        required: [ true, "Enter video id!" ],
    },
    description:{
        type:String,
        required:[true, "Please enter video description"]
    },
} ,
{timestamps:true}
);


const Comment=mongoose.model( 'Comment', commentSchema );


module.exports=Comment;