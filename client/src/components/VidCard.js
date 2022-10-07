import React , {useState , useEffect} from 'react'
import { Card ,Avatar , Skeleton} from 'antd'
import {  MenuFoldOutlined } from "@ant-design/icons";
import { format } from 'timeago.js';
import { useSpring, animated } from 'react-spring'

import './css/vidCard.css'
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function VidCard({video}) {
  const { Meta } = Card;
  const [showMenu, setShowMenu] = useState(false);
  const [channel, setChannel] = useState(null); 
  const [loading, setLoading] = useState(true);
  const style = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } })
  
  const getChannel = async ()=>{
    try{

      const res = await axios.get(`http://localhost:3001/api/v1/users/find/${video.userId}`);
      setChannel(res.data.doc);
      setLoading(false)
    }catch(err){
      console.log(err.response.data.message)
    }
  }
  useEffect(() => {
    getChannel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.userId]);
  
  return (
    <Link to={`/dashboard/video/${video._id}`}>
    <Skeleton loading={loading}>
    <animated.div style={style}>
    <Card
    className={`${showMenu ?  'video_card':''}`}
    hoverable
    bordered={false}
    onMouseEnter={()=>setShowMenu(true)}
    onMouseLeave={()=>setShowMenu(false)}
    style={{
      width: 275,
    }}
    cover={<img alt="example" src="https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" />}
  >
    <div className={`${showMenu ? 'show_menu':'no_show_menu'}`}>
    <MenuFoldOutlined/>
    </div>
    <Meta  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />} title={video.title} description={video.desc} />
     <div className='ps-5 pt-2 text-muted'>
      <small>{video.views} views</small>
      <small className='px-1'>&#8226;</small>
      <small>{format(video.createdAt)}</small>
    </div>
  </Card>
    </animated.div>
    </Skeleton>
    </Link>
  )
}
