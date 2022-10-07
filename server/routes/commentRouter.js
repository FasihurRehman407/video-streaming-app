const express=require( "express" );
const {protect} = require('./../controllers/authController');
const {addComment , deleteComment , updateComment , getAllComments} = require('./../controllers/commentController');
const commentRouter=express.Router();

commentRouter.use(protect);
commentRouter.post("/",addComment); 
commentRouter.get("/allcomments/:id", getAllComments);
commentRouter.delete('/:id',deleteComment);
commentRouter.patch('/:id', updateComment);





module.exports=commentRouter;