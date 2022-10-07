const mongoose=require( 'mongoose' );
const validator=require( "validator" );
const bcrypt=require( 'bcryptjs' );
const crypto=require( 'crypto' );

//Optimize:  ************************** User Modal Schema ******************************
const userSchema=new mongoose.Schema( {
    name: {
        type: String,
        required: [ true, "Enter your name!" ],
        trim: true,
        unique:true
    },
    email: {
        type: String,
        unique: [ true, "User with this email already exist" ],
        required: [ true, "Please provide your email" ],
        trim: true,
        lowercase: true,
        validate: [ validator.isEmail, "Please provide valid email" ]
    },
    photo: {
        type: String,
    },
    subscribers:{
        type: Number,
        default:0,
    },
    subscribedUsers:{
        type:[mongoose.Schema.ObjectId],
        default:[]
    },
    password: {
        type: String,
        // required: [ true, 'Please provide your password' ],
        minLength: [ 6, "Password must be atleast 6 characters long" ],
        select: false
    },
    passwordConfirm: {
        type: String,
        // required: [ true, 'Please confirm your password' ],
        validate: {
            validator: function ( val ) {
                return val===this.password
            },
            message: "Password and Confirm-password are not same!"
        }
    },
    fromGoogle: {
        type:Boolean,
        default:false
    },
    changePasswordAt: Date,

    passwordResetToken: String,

    passwordResetTokenExpires: Date,
} ,
{
    // TO SEE VIRTUAL FIELDS 
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
}, {timestamps:true}
);




//Todo: ************************** Document/query/aggregation middlewares ******************************
userSchema.pre( 'save', async function ( next ) {
    // Function runs only when we are modifying password field or on creating new user
    if ( !this.isModified( 'password' ) ) return next();
    console.log( "hi from document", this )
    // Encrypting the password before saving it to database 
    this.password=await bcrypt.hash( this.password, 12 );
    this.passwordConfirm=undefined;
    next();
} )

userSchema.pre( 'save', function ( next ) {
    if ( !this.isModified( 'password' )||this.isNew ) return next();

    this.changePasswordAt=Date.now()-1000;
    next()
} )



//Fix:  ************************** instance methods of documents ******************************

//Fix:Function to check password entered by user and encrypted password in db are same
userSchema.methods.correctPassword=async function ( userPassword, encryptedPassword ) {
    return await bcrypt.compare( userPassword, encryptedPassword );
}

//Fix:Function to check if user has changed the password after sign in is generated
userSchema.methods.changePasswordAfter=function ( jwtTimestamp ) {
    if ( this.changePasswordAt ) {
        const changePasswordTimestamp=parseInt( this.changePasswordAt/1000, 10 );
        return jwtTimestamp<changePasswordTimestamp //200<300
    }
    return false;

}

//Fix:Funtion to create reset-token and put that in databse of particular user
userSchema.methods.createResetToken=function () {

    const resetToken=crypto.randomBytes( 32 ).toString( 'hex' );

    this.passwordResetToken=crypto.createHash( 'sha256' ).update( resetToken ).digest( 'hex' );
    this.passwordResetTokenExpires=Date.now()+( 10*60*1000 );
    return resetToken;
}

const User=mongoose.model( 'User', userSchema );


module.exports=User;