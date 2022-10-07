const mongoose=require( 'mongoose' );

//Optimize:  ************************** video Modal Schema ******************************
const videoSchema=new mongoose.Schema( {
    userId: {
        type: String,
        required: [ true, "Enter user id!" ],
    },

    title: {
        type: String,
        required: [ true, "Please enter video title" ],
    },
    desc:{
        type:String,
        required:[true, "Please enter video description"]
    },
    thumbnailUrl: {
        type: String,
        required:[true, "Please provide video thumbnail url"]
    },
    videoUrl:{
        type: String,
        required:[true, "Please provide video url"]
    },
    views: {
        type:Number,
        default:0
    },
    tags:{
        type:[String],
        default:[],
    },
    likes:{
        type:[String],
        default:[]
    },
    dislikes:{
        type:[String],
        default:[]
    }
} ,
{timestamps:true}
);


const Video=mongoose.model( 'Video', videoSchema );


module.exports=Video;