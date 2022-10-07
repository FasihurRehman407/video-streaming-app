import React, {useState, useEffect, useContext} from 'react';
import Recommendation from './Recommendation';
import VideoPlayer from './Video/VideoPlayer';
import { BarLoader } from 'react-spinners';
import "./css/video.css";
import LoadingBar from 'react-top-loading-bar';
import {
   LikeOutlined,
   DislikeOutlined,
   ShareAltOutlined,
   UserOutlined,
   LikeFilled,
   DislikeFilled,
   SendOutlined,
   CloseOutlined
  } from '@ant-design/icons';
import { Typography, Avatar, Button, Tag ,message, Input, Form} from 'antd';
import { useLocation } from 'react-router-dom';
import { useGetChannelByIdQuery ,useGetVideoByIdQuery,useAddCommentMutation ,useLikeVideoMutation ,useDislikeVideoMutation , useGetUserQuery, useSubscribeChannelMutation, useUnsubscribeChannelMutation } from '../services/nodeApi';
import { format } from 'date-fns';
import appContext from '../context/appContext';
import jwtDecode from 'jwt-decode';
import Comment from './Comment';



export default function Video() {
    const {Title} = Typography;
    const [showSendCancelBtn , setShowSendCancelBtn] = useState(false);
    const [commentForm] = Form.useForm();
    const [likeVideo] = useLikeVideoMutation();
    const [subscribeChannel] = useSubscribeChannelMutation();
    const [addComment] = useAddCommentMutation();
    const [unsubscribeChannel] = useUnsubscribeChannelMutation();
    const [dislikeVideo] = useDislikeVideoMutation();
    const { Cookies } = useContext(appContext);
    const [progress , setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [video , setVideo] = useState(null);
    const [channel , setChannel] = useState(null);
    const location = useLocation();
    const videoId= location.pathname.split('/')[3];
    let id;
    if(Cookies.get('jwt')){
     id = jwtDecode(Cookies.get('jwt')).id;
    }
    const {data:user,isLoading:isUserLoading} = useGetUserQuery(id);

    const {data:vid , isLoading: isVidLoading} = useGetVideoByIdQuery(videoId,{
        skip:false
    });
    const {data:channell , isLoading: isChannelLoading} = useGetChannelByIdQuery(vid && vid.data.userId , {
        skip: vid === "undefined"
    });

    const handleLikeClick = async()=>{
        await likeVideo(videoId);
        message.success("You liked this video")
    }
    const handleDislikeClick = async()=>{
        await dislikeVideo(videoId);
        message.success("You disliked this video")
    }
    const handleToggleSubscribeChannel= async()=>{
        setLoading(true);
        if(user.doc.subscribedUsers.includes(channel._id)){
            await unsubscribeChannel(channel._id);
            setLoading(false);
        }else{
            await subscribeChannel(channel._id);
            setLoading(false);
        }
    }
    const handleAddComment = async(values) => {
        const res = await addComment({
            videoId,
            description: values.comment
        });
        if(res.data.status === 'success'){
            commentForm.resetFields();
            setShowSendCancelBtn(false);
            console.log(res);
        }
    };
    const addCommentFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    const cancelComment = ()=>{
        setShowSendCancelBtn(false);
    }
    const handleCommentInput =()=>{
        setShowSendCancelBtn(true);
    }
    

    useEffect(() => {
        setProgress(30);
        vid && setVideo(vid.data);
        setProgress(70)
        channell && setChannel(channell.doc);
        setProgress(100);
    }, [channell, vid]);
  return (
    <>
    <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
    {
        (isVidLoading && isChannelLoading && isUserLoading) ? 
        <div className='row' style={{justifyContent:'center',marginTop:'4rem',alignItems:'center'}}>
        <BarLoader color='#44cbb1' size={13}/>
      </div>:
      (video && channel && user) && (<div className='d-flex flex-row'>
        <div style={{width:'65%'}}>
            <div>
            <VideoPlayer/>
            </div>
            <div className='pb-2'>{
                video.tags.map((el,i)=>{
                   return <Tag key={i} color="#44cbb1">{el}</Tag>
                })
            }</div>
            <div>
                <Title level={3}>{video.title}</Title>
            </div>
            <div className='d-flex'>
            <div className='flex-grow-1'>
                <div className='text-muted'>{video.views} views {format(new Date(video.createdAt),'MMM d YYY').toString()}</div>
                <div>{video.desc}</div>
            </div>
            <div>
                <span onClick={handleLikeClick}>
                    {video.likes.includes(id)? <LikeFilled style={{cursor:'pointer'}}/>:<LikeOutlined style={{cursor:'pointer'}} />}</span>
                <span className='ps-2'>{video? video.likes.length: 'Like'}</span>
                </div>
            <div className='px-4'>
                <span onClick={handleDislikeClick}>
                    {video.dislikes.includes(id)?<DislikeFilled style={{cursor:'pointer'}}/>:<DislikeOutlined style={{cursor:'pointer'}}/>}
                    </span>
                    <span className='ps-2'>Dislike</span>
                    </div>
            <div className='me-5'><ShareAltOutlined style={{cursor:'pointer'}}/><span className='ps-2'>Share</span></div>
            </div>
            <div className='d-flex mt-3 pe-3'>
            <div className="card flex-grow-1">
            <div className="row">
    <div className="col-md-10">
    <div className='d-flex'>
        <div className='ps-2 pt-2'>
           <Avatar size={40} icon={<UserOutlined />}/>
        </div>
        <div className='ps-2 pt-2'>
            <div className='fw-bold'>{channel.name}</div>
                <div className="text-muted">{channel.subscribers} subscribers</div>
            </div>
       </div>
    </div>
    <div className="col-md-2">
      <div className="card-body">
        <div><Button loading={loading} disabled={loading} onClick={handleToggleSubscribeChannel} style={{color:"#44CBB1" , border:'1px solid #44CBB1'}}>{user.doc.subscribedUsers?.includes(channel._id)? "Subscribed":"Subscribe"}</Button></div>
      </div>
    </div>
  </div>
</div>
</div>
<div className='d-flex my-4'>
    <div className='fw-bold'>332 Comments</div>
    <div className='ms-4'>Sort</div>
</div>
    <div className='d-flex pe-3'>
        <div><Avatar size={40} src={user.doc.photo}/></div>
        <div className="flex-grow-1 pt-1 ms-2">
            <Form
            form={commentForm}
            name='commentForm'
            onFinish={handleAddComment}
            onFinishFailed={addCommentFailed}>
                <Form.Item
                name='comment'>
            <Input allowClear={true} onClick={handleCommentInput} style={{border:'none'}}/>
                </Form.Item>
                <div>
                {showSendCancelBtn && <Form.Item>   
                    <Button onClick={cancelComment} style={{border:'none'}}><CloseOutlined/></Button>
                    <Button style={{border:'none'}} htmlType='submit'>
                        <SendOutlined/>
                    </Button>
                </Form.Item>
}
                </div>
            </Form>
        </div>
    </div>
   <Comment videoId={videoId}/>
</div>

<div style={{width:'35%'}}>
    <Recommendation/>
</div>
</div>
)}
    </>
  )
}
